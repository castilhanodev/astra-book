/* Remendo 4.2 - a camada de toque do PDF passa a ser montada a partir das letras
   que foram realmente desenhadas na pagina.

   O problema: por cima da imagem do PDF existe uma camada de texto invisivel, e e
   ela que responde ao toque. Quem monta essa camada calcula a largura de cada
   linha medindo a fonte. Quando a fonte embutida no arquivo nao carrega no
   aparelho, essa medida sai errada, as palavras invisiveis vao escorregando ao
   longo da linha e o toque acaba caindo na palavra anterior. Uma palavra solta em
   italico no meio da frase funciona porque forma um bloco curto; um trecho longo
   na mesma fonte forma um bloco grande e o erro se acumula dentro dele.

   A solucao: enquanto a pagina e desenhada, anotamos onde cada letra foi parar.
   Depois montamos a camada invisivel palavra por palavra, em cima dessas posicoes.
   Assim a camada nao depende mais de medir fonte nenhuma. */
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
    var frag=document.createDocumentFragment(),caixas=[];
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
      }
      frag.appendChild(sp);
    }
    tl.textContent='';
    tl.appendChild(frag);
    // uma medida so para todos, depois um ajuste so: evita travar a tela
    var reais=caixas.map(function(c){return c[0].getBoundingClientRect().width});
    var amp=(tl.getBoundingClientRect().width||1)/(tl.offsetWidth||1);
    for(var i=0;i<caixas.length;i++){
      var alvo=caixas[i][1],real=reais[i]/(amp||1);
      if(!(real>0.3))continue;
      var f=alvo/real;
      if(!isFinite(f)||f<=0.05||f>20)continue;
      if(Math.abs(f-1)>0.01)caixas[i][0].style.transform='scaleX('+f.toFixed(4)+')';
    }
    tl.dataset.astra='letras';
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
      var certas=tl._palavras||null;
      if(certas&&certas.length===ordem.length){
        for(var n=0;n<ordem.length;n++)ordem[n].t=certas[n];
      }else if(ordem.ilegivel)return false
      var lg=emLinhas(ordem);if(!lg.length)return false
      // as letras estao em pixels do desenho; a camada esta em pixels da tela
      var larg=cv.offsetWidth||tl.offsetWidth||0;
      var fator=cv.width?(larg/cv.width):0;
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
    window.__astraRemendo=(window.pdfjsLib.renderTextLayer===meuTexto)?'4.2':'falhou';
    setInterval(function(){
      try{
        var ts=document.querySelectorAll('.textLayer');
        for(var i=0;i<ts.length;i++){
          var t=ts[i];
          if(t.dataset.astra==='letras')continue;
          var pai=t.parentElement,cv=pai&&pai.querySelector('canvas');
          if(!cv)continue;
          var l=MAPA.get(cv);
          if(l&&l.length)refazer(t);
        }
      }catch(e){}
    },400);

  }catch(e){window.__astraRemendo='falhou'}
})();

/* TESTE: libera o Astra Pro. Tirar depois de gerar o APK. */
(function(){
  try{
    if(Date.now()>new Date('2026-10-15T00:00:00Z').getTime())return;
    var valor=JSON.stringify({on:true,plan:'manual',until:0,at:Date.now()});
    var ehPro=function(k){return typeof k==='string'&&k.indexOf('astra.pro.')===0};
    var ler=Storage.prototype.getItem, gravar=Storage.prototype.setItem;
    Storage.prototype.getItem=function(k){return ehPro(k)?valor:ler.apply(this,arguments)};
    Storage.prototype.setItem=function(k,v){if(ehPro(k))return;return gravar.apply(this,arguments)};
    var marca=function(){try{document.documentElement.dataset.proon='1'}catch(e){}};
    marca(); setInterval(marca,1500);
  }catch(e){}
})();
