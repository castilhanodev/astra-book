/* Remendo 4.4 - a camada de toque do PDF e montada a partir das letras que foram
   realmente desenhadas na pagina, e e REFEITA sempre que a pagina muda de tamanho.

   O problema: por cima da imagem do PDF existe uma camada de texto invisivel, e e
   ela que responde ao toque. Quem monta essa camada calcula a largura de cada
   linha medindo a fonte. Quando a fonte embutida no arquivo nao carrega no
   aparelho, essa medida sai errada, as palavras invisiveis vao escorregando ao
   longo da linha e o toque acaba caindo na palavra anterior. Uma palavra solta em
   italico no meio da frase funciona porque forma um bloco curto; um trecho longo
   na mesma fonte forma um bloco grande e o erro se acumula dentro dele.

   A solucao: enquanto a pagina e desenhada, anotamos onde cada letra foi parar.
   Depois montamos a camada invisivel palavra por palavra, em cima dessas posicoes.
   Assim a camada nao depende mais de medir fonte nenhuma.

   O que faltava na 4.2: quando a pessoa dava zoom, o app redesenhava a pagina numa
   imagem maior e trocava o canvas, mas a camada de toque ficava marcada como
   "ja arrumada" e nunca mais era refeita. As medidas guardadas eram do desenho
   antigo, o erro voltava e o toque caia de novo na palavra anterior. Agora a camada
   guarda a assinatura do desenho em que foi montada (tamanho da imagem, tamanho na
   tela e qual canvas) e se refaz sozinha assim que qualquer um deles muda: no
   intervalo, quando o canvas muda de tamanho e, principalmente, no instante em que
   o dedo encosta na tela, antes de a pessoa terminar de segurar a palavra. */
(function(){
  var L=window.pdfjsLib;
  if(!L||!L.renderTextLayer||window.__astraRemendo||typeof Proxy!=='function')return;
  var U=L.Util, MAPA=new WeakMap();   // canvas -> letras desenhadas nele

  /* ---------- 1. anotar onde cada letra foi desenhada ---------- */
  function gravar(ctx,lista){
    if(ctx.__astraGrav)return;ctx.__astraGrav=1;
    var ft=ctx.fillText.bind(ctx);
    ctx.fillText=function(txt,x,y,mw){
      try{
        var m=ctx.getTransform(),f=parseFloat(ctx.font)||10;
        lista.push({t:String(txt),
          x:m.a*x+m.c*y+m.e, y:m.b*x+m.d*y+m.f,
          alt:f*Math.hypot(m.b,m.d), esc:Math.hypot(m.a,m.b)});
      }catch(e){}
      return mw===undefined?ft(txt,x,y):ft(txt,x,y,mw);
    };
  }

  /* ---------- 2. juntar letras em palavras, na ordem em que foram desenhadas ---------- */
  function palavras(letras){
    if(!letras||!letras.length)return null;
    var ordem=[],cur=null,suspeitos=0,total=0,i,l,prox,fim;
    for(i=0;i<letras.length;i++){
      l=letras[i];
      if(!l.t||!(l.alt>0)){cur=null;continue}
      if(!l.t.replace(/\s/g,'')){cur=null;continue}          // espaco separa palavra
      prox=letras[i+1];
      fim=(prox&&prox.alt>0&&Math.abs(prox.y-l.y)<=l.alt*0.4&&prox.x>=l.x)?prox.x:(l.x+l.alt*0.55*l.t.length);
      var junta=cur&&Math.abs(l.y-cur.y)<=cur.alt*0.4&&l.x>=cur.fim-cur.alt*0.35&&l.x-cur.fim<=cur.alt*0.12;
      if(junta){cur.t+=l.t;cur.fim=fim;if(l.alt>cur.alt)cur.alt=l.alt}
      else{cur={t:l.t,ini:l.x,fim:fim,y:l.y,alt:l.alt};ordem.push(cur)}
    }
    if(!ordem.length)return null;
    for(i=0;i<ordem.length;i++){var tt=ordem[i].t;
      for(var q=0;q<tt.length;q++){total++;var cc=tt.charCodeAt(q);if(cc>=0xE000||cc<32)suspeitos++}}
    ordem.ilegivel=(total>0&&suspeitos/total>0.15);
    return ordem;
  }

  /* agrupa as palavras em linhas, para montar a camada */
  function emLinhas(ordem){
    var ps=ordem.slice().sort(function(a,b){return (a.y-b.y)||(a.x-b.x)});
    var linhas=[],at=null;
    for(var i=0;i<ps.length;i++){
      var w=ps[i];
      if(!at||Math.abs(w.y-at.y)>Math.max(2,at.alt*0.4)){at={y:w.y,alt:w.alt,ps:[]};linhas.push(at)}
      if(w.alt>at.alt)at.alt=w.alt;
      at.ps.push(w);
    }
    for(var k=0;k<linhas.length;k++)linhas[k].ps.sort(function(a,b){return a.ini-b.ini});
    return linhas;
  }

  /* ---------- 3. montar a camada invisivel em cima dessas posicoes ---------- */
  function montar(tl,linhas,fator){
    var frag=document.createDocumentFragment(),caixas=[],cx=[];
    for(var k=0;k<linhas.length;k++){
      var ln=linhas[k],alt=ln.alt*fator;
      var esq=ln.ps[0].ini*fator, topo=(ln.y*fator)-alt*0.8;
      var sp=document.createElement('span');
      sp.style.cssText='position:absolute;white-space:pre;transform-origin:0% 0%;left:'
        +esq.toFixed(2)+'px;top:'+topo.toFixed(2)+'px;font-size:'+Math.max(1,alt).toFixed(2)+'px;line-height:1';
      for(var j=0;j<ln.ps.length;j++){
        var w=ln.ps[j],prox=ln.ps[j+1];
        var ini=w.ini*fator, fim=(prox?prox.ini:w.fim)*fator;
        var el=document.createElement('i');
        el.style.cssText='position:absolute;top:0;white-space:pre;font-style:inherit;transform-origin:0% 0%;left:'+(ini-esq).toFixed(2)+'px';
        el.textContent=w.t+(prox?' ':'');
        sp.appendChild(el);
        caixas.push([el,Math.max(1,fim-ini)]);
        /* a caixa que responde ao toque fica guardada em pixels DO DESENHO da pagina,
           nao da camada invisivel. Na hora do toque ela e convertida usando a posicao
           e o tamanho que a imagem tem na tela naquele instante. Assim, se a camada
           estiver deslocada, o toque continua certo: quem manda e a imagem que a
           pessoa esta vendo.
           A caixa vai so ate o fim das letras, nao ate o comeco da proxima palavra,
           entao o espaco entre duas nao pertence a da esquerda. */
        cx.push({el:el,gx:w.ini,gw:Math.max(1,w.fim-w.ini),gy:ln.y-ln.alt*0.8,gh:Math.max(2,ln.alt)});
      }
      frag.appendChild(sp);
    }
    tl.textContent='';
    tl.appendChild(frag);
    // uma medida so para todos, depois um ajuste so: evita travar a tela
    var reais=caixas.map(function(c){return c[0].getBoundingClientRect().width});
    var amp=(tl.getBoundingClientRect().width||1)/(tl.offsetWidth||1);
    for(var i=0;i<caixas.length;i++){
      var el=caixas[i][0],alvo=caixas[i][1],real=reais[i]/(amp||1);
      var f=(real>0.3)?(alvo/real):1;
      if(!isFinite(f)||f<=0.05||f>20)f=1;
      /* a largura e escrita como alvo/f: depois do scaleX(f) a caixa mede exatamente
         "alvo", que e a largura tirada das letras desenhadas. Assim a area que responde
         ao toque nao depende de medir fonte nenhuma, mesmo que a medida do texto erre. */
      el.style.width=(alvo/f).toFixed(2)+'px';
      if(Math.abs(f-1)>0.002)el.style.transform='scaleX('+f.toFixed(4)+')';
    }
    tl.__caixas=cx;
    try{var cvv=canvasDe(tl);tl.__cvRef=cvv;tl.__cvW=cvv?cvv.width:0}catch(e){}
    /* a nossa camada ja nasce nas coordenadas certas: um ajuste de escala por cima
       dela so deslocaria tudo */
    try{tl.style.transform='';tl.dataset.fit='letras'}catch(e){}
    try{window.__astraRefeitas=(window.__astraRefeitas||0)+1;window.__astraQuando=Date.now()}catch(e){}
    tl.dataset.astra='letras';
    marcar(tl);
  }

  /* ---------- a palavra que esta debaixo do dedo, pelas letras desenhadas ----------
     Nao pergunta ao navegador qual elemento esta no ponto nem mede fonte nenhuma:
     usa as caixas tiradas do desenho da pagina, convertidas para a tela no instante
     do toque. Por isso vale com zoom, com a pagina rolada e depois de redesenhar. */
  function camadaEm(x,y){
    var el=null;try{el=document.elementFromPoint(x,y)}catch(e){}
    var pg=el&&el.closest?el.closest('.pg,.page'):null;
    var tl=pg?pg.querySelector('.textLayer'):null;
    if(tl)return tl;
    var ts=document.querySelectorAll('.textLayer');
    for(var i=ts.length-1;i>=0;i--){
      var r=ts[i].getBoundingClientRect();
      if(r.width>1&&x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom)return ts[i];
    }
    return null;
  }
  function alvoEm(x,y){
    try{
      var tl=camadaEm(x,y);if(!tl)return null;
      var cs=tl.__caixas;if(!cs||!cs.length)return null;
      var cv=tl.__cvRef||canvasDe(tl);if(!cv||!cv.width)return null;
      /* posicao e tamanho da IMAGEM na tela, medidos agora */
      var r=cv.getBoundingClientRect();
      var k=r.width/cv.width;if(!(k>0))return null;
      var lx=(x-r.left)/k, ly=(y-r.top)/k;     // ponto em pixels do desenho
      var melhor=null,md=Infinity;
      for(var i=0;i<cs.length;i++){
        var c=cs[i];if(!c.el||!c.el.isConnected)continue;
        if(lx>=c.gx&&lx<=c.gx+c.gw&&ly>=c.gy&&ly<=c.gy+c.gh){try{window.__ultimoAlvo={t:Date.now(),x:x,y:y,p:(c.el.textContent||'').trim(),dentro:true}}catch(e){}return c.el}
        var dx=lx<c.gx?c.gx-lx:(lx>c.gx+c.gw?lx-(c.gx+c.gw):0);
        var dy=ly<c.gy?c.gy-ly:(ly>c.gy+c.gh?ly-(c.gy+c.gh):0);
        var d=dx+dy*3;if(d<md){md=d;melhor=c.el}
      }
      try{window.__ultimoAlvo={t:Date.now(),x:x,y:y,p:(melhor&&melhor.textContent||'').trim(),dentro:false,dist:Math.round(md)}}catch(e){}
      /* dentro da pagina, responde sempre a palavra mais perto. O caminho antigo,
         quando nao achava nada, procurava primeiro para a ESQUERDA, e por isso caia
         na palavra anterior. Aqui nao existe esse lado preferido. */
      var dentroDaPagina=(x>=r.left-4&&x<=r.right+4&&y>=r.top-4&&y<=r.bottom+4);
      return (dentroDaPagina||md*k<=36)?melhor:null;
    }catch(e){return null}
  }

  /* assinatura do desenho: muda quando o app redesenha a pagina em outro tamanho */
  function canvasDe(tl){var pai=tl&&tl.parentElement;return pai?pai.querySelector('canvas'):null}
  function assinatura(tl){
    var cv=canvasDe(tl);if(!cv)return null;
    return cv.width+'x'+cv.height+'|'+cv.offsetWidth+'x'+cv.offsetHeight+'|'+tl.offsetWidth;
  }
  function marcar(tl){try{tl.__cv=canvasDe(tl);tl.__sig=assinatura(tl)}catch(e){}}
  function vencida(tl){
    try{
      if(!tl||!tl.isConnected)return false;
      var cv=canvasDe(tl);if(!cv)return false;
      var l=MAPA.get(cv);if(!l||!l.length)return false;
      if(tl.dataset.astra!=='letras')return true;      // nunca foi montada
      if(tl.__cv!==cv)return true;                     // o app trocou o canvas
      return tl.__sig!==assinatura(tl);                // mudou de tamanho
    }catch(e){return false}
  }
  /* refaz a camada se ela estiver vencida. e o coracao do "sempre mapeando".
     Nunca durante um toque: trocar os elementos no meio do gesto tira o chao da
     selecao que esta comecando e o dicionario abre vazio. */
  var dedo=false;
  /* tambem nao refaz enquanto existe uma selecao viva na tela: o app ainda esta
     lendo o trecho selecionado, e trocar os elementos embaixo dele perde a palavra */
  function ocupado(){
    try{
      if(document.getElementById('selbar'))return true;
      var s=window.getSelection&&window.getSelection();
      if(s&&s.rangeCount&&!s.isCollapsed)return true;
    }catch(e){}
    return false;
  }
  function conferir(tl,agora){if((dedo||ocupado())&&!agora)return false;if(vencida(tl))return refazer(tl);return false}
  function conferirTodas(agora){
    try{var ts=document.querySelectorAll('.textLayer');
      for(var i=0;i<ts.length;i++)conferir(ts[i],agora);
    }catch(e){}
  }

  /* quebra o texto que o PDF informa em palavras, com a posicao de cada uma */
  function palavrasDosItens(tl){
    var its=tl._itensPos;if(!its||!its.length)return null;
    var out=[];
    for(var i=0;i<its.length;i++){
      var it=its[i],s=it.s;if(!s)continue;
      var total=s.length||1,re=/\S+/g,m;
      while((m=re.exec(s))){
        out.push({t:m[0],
          x:it.x+(m.index/total)*it.w,
          f:it.x+((m.index+m[0].length)/total)*it.w,
          y:it.y});
      }
    }
    return out.length?out:null;
  }
  /* para cada palavra desenhada, acha o texto de verdade pela posicao dela */
  function textoPorPosicao(ordem,tl,k){
    var alvo=palavrasDosItens(tl);if(!alvo||!(k>0))return null;
    var res=new Array(ordem.length),achou=0;
    for(var i=0;i<ordem.length;i++){
      var g=ordem[i];
      var vx=g.ini/k, vf=g.fim/k, vy=g.y/k, alt=g.alt/k;
      var cg=(vx+vf)/2;
      var melhor=null,mo=0,exato=null;
      for(var j=0;j<alvo.length;j++){
        var a=alvo[j];
        if(Math.abs(a.y-vy)>Math.max(2,alt*0.7))continue;
        /* o centro da palavra desenhada caiu dentro deste pedaco: e esse mesmo */
        if(!exato&&cg>=a.x&&cg<=a.f)exato=a;
        var ov=Math.min(vf,a.f)-Math.max(vx,a.x);
        if(ov<=0)continue;
        /* mede a sobreposicao em relacao a menor das duas, para palavra curta
           nao perder para a vizinha larga */
        var men=Math.max(1,Math.min(vf-vx,a.f-a.x));
        var nota=ov/men;
        if(nota>mo){mo=nota;melhor=a}
      }
      var esc2=exato||melhor;
      if(esc2&&(exato||mo>0.35)){res[i]=esc2.t;achou++}
    }
    return achou>=ordem.length*0.55?res:null;
  }

  function refazer(tl){
    try{
      if(tl&&tl.container)tl=tl.container;
      if(!tl||!tl.isConnected)return false
      var pai=tl.parentElement;if(!pai)return false
      var cv=pai.querySelector('canvas');if(!cv)return false
      var letras=MAPA.get(cv);if(!letras||!letras.length)return false
      var ordem=palavras(letras);if(!ordem)return false
      // o texto desenhado nem sempre e o texto de verdade (fonte embutida com
      // letras remapeadas). Nesse caso usamos o texto que o proprio PDF informa,
      // casando na mesma ordem em que as letras foram desenhadas.
      var larg0=cv.offsetWidth||tl.offsetWidth||0;
      var kbm=(tl._vpW>0)?(cv.width/tl._vpW):0;      // pixels do desenho por ponto do PDF
      var certas=tl._palavras||null;
      if(certas&&certas.length===ordem.length&&!window.__astraForcaPos){
        for(var n=0;n<ordem.length;n++)ordem[n].t=certas[n];
        tl.dataset.astraMotivo='contagem';
      }else{
        var porPos=textoPorPosicao(ordem,tl,kbm);
        if(porPos){
          for(var n2=0;n2<ordem.length;n2++)if(porPos[n2])ordem[n2].t=porPos[n2];
          tl.dataset.astraMotivo='posicao';
        }else if(ordem.ilegivel){tl.dataset.astraMotivo='ilegivel';return false}
        else tl.dataset.astraMotivo='desenho';
      }
      var lg=emLinhas(ordem);if(!lg.length)return false
      // as letras estao em pixels do desenho; a camada esta em pixels da tela
      var fator=cv.width?((larg0||cv.offsetWidth||tl.offsetWidth||0)/cv.width):0;
      if(!(fator>0))return false
      montar(tl,lg,fator);
      return true;
    }catch(e){return false}
  }

  /* ---------- 4. encaixe antigo, usado quando nao der para ler as letras ---------- */
  function encaixar(tl,divs,items,esc,vpt){
    try{
      if(!tl||!tl.isConnected||!divs||!divs.length||!items||!esc)return;
      if(tl.dataset.astra==='letras')return;
      var pares=[],k=0,i,it,d,m;
      for(i=0;i<items.length;i++){
        it=items[i];
        if(it.str===undefined)continue;
        d=divs[k++];
        if(!d||!d.isConnected||!it.str||!it.width)continue;
        if(/rotate|matrix/.test(d.style.transform||''))continue;
        d.style.transform='';
        if(U&&vpt&&it.transform){m=U.transform(vpt,it.transform);if(Math.abs(m[1])<1e-4)d.style.left=m[4].toFixed(2)+'px';}
        pares.push([d,it.width*esc]);
      }
      if(!pares.length)return;
      var larg=tl.getBoundingClientRect().width,base=tl.offsetWidth||0;
      var amp=(larg>0&&base>0)?(larg/base):1;
      var reais=pares.map(function(p){return p[0].getBoundingClientRect().width/(amp||1)});
      for(i=0;i<pares.length;i++){
        var alvo=pares[i][1],real=reais[i];
        if(!(alvo>0)||!(real>0.5))continue;
        var f=alvo/real;
        if(!isFinite(f)||f<=0.05||f>20)continue;
        if(Math.abs(f-1)>0.004)pares[i][0].style.transform='scaleX('+f.toFixed(4)+')';
      }
    }catch(e){}
  }

  /* ---------- 5. ligacoes ---------- */
  var origTexto=L.renderTextLayer;
  function meuTexto(par){
    var divs=[];
    try{if(par&&typeof par==='object')par.textDivs=divs}catch(e){}
    var t=origTexto.apply(L,arguments);
    try{
      var tc=par.textContentSource||par.textContent,vp=par.viewport;
      var itens=tc&&tc.items,esc=vp&&vp.scale,vpt=vp&&vp.transform,tl=par.container;
      try{
        if(tl&&itens){
          var bruto='';
          for(var q=0;q<itens.length;q++)if(itens[q].str!==undefined)bruto+=itens[q].str+(itens[q].hasEOL?'\n':'');
          tl._palavras=bruto.split(/\s+/).filter(function(w){return w.length});
          /* e tambem ONDE cada pedaco de texto esta, para casar por posicao quando a
             contagem de palavras nao bater (acontece em livro com hifen e aspas) */
          tl._vpW=vp&&vp.width||0;
          var pos=[];
          if(U&&vpt){
            for(var z=0;z<itens.length;z++){
              var it=itens[z];if(it.str===undefined||!it.str)continue;
              var m=U.transform(vpt,it.transform);
              pos.push({s:it.str,x:m[4],y:m[5],w:(it.width||0)*(esc||1)});
            }
          }
          tl._itensPos=pos;
        }
      }catch(e){}
      var faz=function(){if(!refazer(tl))encaixar(tl,divs,itens,esc,vpt)};
      t.promise.then(function(){
        faz();
        if(document.fonts&&document.fonts.ready)document.fonts.ready.then(faz).catch(function(){});
        setTimeout(faz,700);
      }).catch(function(){});
    }catch(e){}
    return t;
  }

  function pagina(pg){
    if(!pg||pg.__astraPg)return pg;
    try{
      pg.__astraPg=1;
      var r=pg.render.bind(pg);
      pg.render=function(par){
        try{
          var c=par&&par.canvasContext;
          if(c&&c.canvas){var lista=[];MAPA.set(c.canvas,lista);gravar(c,lista)}
        }catch(e){}
        return r.apply(pg,arguments);
      };
    }catch(e){}
    return pg;
  }

  function documento(doc){
    if(!doc||doc.__astraDoc)return doc;
    try{
      doc.__astraDoc=1;
      var g=doc.getPage.bind(doc);
      doc.getPage=function(){return g.apply(doc,arguments).then(pagina)};
    }catch(e){}
    return doc;
  }

  var origAbrir=L.getDocument;
  function meuAbrir(){
    var t=origAbrir.apply(L,arguments);
    try{
      var pr=t.promise;
      Object.defineProperty(t,'promise',{configurable:true,get:function(){return pr.then(documento)}});
    }catch(e){}
    return t;
  }

  try{
    window.pdfjsLib=new Proxy(L,{get:function(alvo,chave){
      if(chave==='renderTextLayer')return meuTexto;
      if(chave==='getDocument')return meuAbrir;
      return Reflect.get(alvo,chave,alvo);
    }});
    window.__astraRemendo=(window.pdfjsLib.renderTextLayer===meuTexto)?'4.4':'falhou';
    setInterval(conferirTodas,400);

    /* no instante do toque: se a camada embaixo do dedo estiver vencida, refaz
       agora, antes de a pessoa terminar de segurar a palavra. e o que garante que
       o dicionario nunca abre com a palavra de tras. */
    var solta=null;
    function noToque(e){
      try{
        var x=e.clientX,y=e.clientY;
        if(x===undefined&&e.touches&&e.touches[0]){x=e.touches[0].clientX;y=e.touches[0].clientY}
        var tl=(x===undefined)?null:camadaEm(x,y);
        if(tl)conferir(tl,true);else conferirTodas(true);
      }catch(_){}
      clearTimeout(solta);dedo=true;
    }
    /* segura mais um pouco depois de soltar: o app ainda esta resolvendo a palavra */
    function soltou(){clearTimeout(solta);solta=setTimeout(function(){dedo=false},900)}
    window.__astraAlvo=alvoEm;
    document.addEventListener('pointerdown',noToque,true);
    document.addEventListener('touchstart',noToque,{capture:true,passive:true});
    document.addEventListener('pointerup',soltou,true);
    document.addEventListener('pointercancel',soltou,true);
    document.addEventListener('touchend',soltou,{capture:true,passive:true});
    document.addEventListener('touchcancel',soltou,{capture:true,passive:true});
    /* e tambem quando o proprio canvas muda de tamanho */
    try{
      if(typeof ResizeObserver==='function'){
        var RO=new ResizeObserver(function(){conferirTodas()});
        setInterval(function(){try{
          var cs=document.querySelectorAll('.pg canvas,.page canvas');
          for(var i=0;i<cs.length;i++)if(!cs[i].__astraRO){cs[i].__astraRO=1;RO.observe(cs[i])}
        }catch(_){}},1200);
      }
    }catch(_){}

  }catch(e){window.__astraRemendo='falhou'}
})();
