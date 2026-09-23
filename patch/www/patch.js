/* Correcoes rapidas do Astra Book (roda depois do app).
   Hoje: nenhuma notificacao pede alarme exato, senao o Android abre a tela
   "Alarmes e lembretes", que fica apagada porque o app nao usa esse tipo de alarme. */
(function(){
  try{
    var C=window.Capacitor, P=C&&C.Plugins&&C.Plugins.LocalNotifications;
    if(!P||typeof P.schedule!=='function')return;
    var orig=P.schedule.bind(P);
    P.schedule=function(o){
      try{var L=o&&o.notifications;if(L&&L.forEach)L.forEach(function(n){n.isExactNotification=false;n.isExactMandatory=false})}catch(e){}
      return orig(o);
    };
  }catch(e){}
})();
