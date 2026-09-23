/* Remendo 4.0 - encaixe da camada de texto do PDF.

   Quem abre o PDF monta uma camada de texto invisivel por cima da imagem da
   pagina, e e essa camada que responde ao toque. A largura de cada pedaco dela
   e calculada medindo a fonte, e no Android essa medida sai errada quando a
   fonte do arquivo ainda nao terminou de carregar: cada linha invisivel nasce
   mais larga que a linha desenhada, e o toque no meio da linha acaba caindo na
   palavra anterior.

   Aqui a gente mede a largura de verdade de cada pedaco na propria pagina e
   forca ele a ter exatamente a largura que o PDF declara.

   A funcao da biblioteca nao aceita ser substituida direto, entao trocamos o
   objeto inteiro por um intermediario que repassa tudo e so troca essa funcao. */
(function(){
  var L=window.pdfjsLib;
  if(!L||!L.renderTextLayer||window.__astraRemendo||typeof Proxy!=='function')return;
  var U=L.Util;

  function encaixar(tl,divs,items,esc,vpt){
    try{
      if(!tl||!tl.isConnected||!divs||!divs.length||!items||!esc)return;
      var pares=[],k=0,i,it,d,m;
      for(i=0;i<items.length;i++){
        it=items[i];
        if(it.str===undefined)continue;
        d=divs[k++];
        if(!d||!d.isConnected||!it.str||!it.width)continue;
        if(/rotate|matrix/.test(d.style.transform||''))continue;  // texto girado fica como esta
        d.style.transform='';
        // o comeco de cada pedaco vem das coordenadas do proprio PDF
        if(U&&vpt&&it.transform){m=U.transform(vpt,it.transform);if(Math.abs(m[1])<1e-4)d.style.left=m[4].toFixed(2)+'px';}
        pares.push([d,it.width*esc]);
      }
      if(!pares.length)return;
      // quanto a pagina inteira esta ampliada na tela agora
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
      tl.dataset.estica='ok';
    }catch(e){}
  }

  var orig=L.renderTextLayer;
  function meuRender(par){
    var divs=[];
    try{if(par&&typeof par==='object')par.textDivs=divs;}catch(e){}
    var t=orig.apply(L,arguments);
    try{
      var tc=par.textContentSource||par.textContent,tl=par.container,vp=par.viewport;
      var itens=tc&&tc.items,esc=vp&&vp.scale,vpt=vp&&vp.transform;
      var faz=function(){encaixar(tl,divs,itens,esc,vpt)};
      t.promise.then(function(){
        faz();
        // e de novo quando as fontes do arquivo terminarem de carregar
        if(document.fonts&&document.fonts.ready)document.fonts.ready.then(faz).catch(function(){});
        setTimeout(faz,600);setTimeout(faz,1800);
      }).catch(function(){});
    }catch(e){}
    return t;
  }

  try{
    window.pdfjsLib=new Proxy(L,{get:function(alvo,chave){
      if(chave==='renderTextLayer')return meuRender;
      return Reflect.get(alvo,chave,alvo);
    }});
    window.__astraRemendo=(window.pdfjsLib.renderTextLayer===meuRender)?'4.0':'falhou';
  }catch(e){window.__astraRemendo='falhou'}
})();
