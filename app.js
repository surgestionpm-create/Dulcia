/* Dulcia - interfaz. Generado a partir del prototipo. */
var TODAY=(function(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")})(), IVA=1.19;
var pcats=[];
function marg(c){var x=pcats.find(function(p){return p.n===c});return x?x.m:.70}
var CANALES=["WhatsApp","Instagram","Tienda web","Cafetería"];
var orders=[];
var nextId=1, qnum=1;
function nextQ(){return qnum++}
function qn(x){return "N° "+String(x.num).padStart(4,"0")}
var cur={y:+TODAY.slice(0,4),m:+TODAY.slice(5,7)-1}, view="panel", filtro={cat:"",est:""}, selMode=false, sel={}, gSelMode=false, gSel={};
var gbuy={"Ingredientes":true,"Empaque y decoración":true,"Mano de obra y gastos":false};
var rid=1, I="Ingredientes", E="Empaque y decoración", M="Mano de obra y gastos";
function mk(n,rinde,margen,precio,rows){return {id:rid++,nombre:n,rinde:rinde,margen:margen,precio:precio,items:rows.map(function(r){return {g:r[0],n:r[1],q:r[2],u:r[3],c:r[4]}})}}
var recipes=[];
var curR=0, recipe=[], rp={nombre:"",rinde:"",margen:70,precio:0};
function selR(id){var r=recipes.find(function(q){return q.id===id});if(r){curR=id;recipe=r.items;rp=r}}
var wk=(function(){var d=pd(TODAY),k=(d.getDay()+6)%7;d.setDate(d.getDate()-k);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")})(), catsOpen=null;
var cfg={costeo:"real",cap:3,logo:null,logoData:null,logoPath:null,logoDirty:false,tel:"",mail:"",vig:7,abono:50,cond:"",nombre:"",gcal:false,asked:true,url:"",msg:""};
var hora={sueldo:0,horas:160};
var MAY={desp:0,pack:0,coord:0,fact:0};
var EQ=[];  // equipo: [{n:nombre, s:sueldo mensual, h:horas a la semana}]
var SEM=52/12;  // semanas por mes (4,33)
function eqS(){return EQ.reduce(function(a,p){return a+(+p.s||0)},0)}
function eqHM(){return EQ.reduce(function(a,p){return a+(+p.h||0)},0)*SEM}
function eqSync(){if(EQ.length){hora.sueldo=Math.round(eqS());hora.horas=Math.round(eqHM())}}
function vhora(){if(EQ.length){var h=eqHM();return h?eqS()/h:0}return hora.horas?hora.sueldo/hora.horas:0}
function hmin(min){min=Math.round(+min||0);var h=Math.floor(min/60),m=min%60;return h?(h+" h"+(m?" "+m+" min":"")):(m+" min")}
function hasH(r){return (r.items||[]).some(function(it){return String(it.u||"").trim().toLowerCase()==="h"})}
function moOn(r){return !hasH(r)}
function labor(r){return window.NO_P2||!moOn(r)?0:(+r.ta||0)/60*vhora()}
function costTanda(r){return rcost(r)+labor(r)}
function redon(n){return n<10000?Math.ceil(n/100)*100:Math.ceil(n/1000)*1000}
function mayCalc(r){
  var un=r.un||1,cu=costTanda(r)/un,pk=r.mpk===""||r.mpk==null?+MAY.pack||0:+r.mpk,cuM=cu+pk,mm=(r.mm==null?45:+r.mm)/100;
  var neto=redon(cuM/(1-mm)),f=(+MAY.fact||0)/100,g=neto*(1-f)-cuM,desp=r.mds===""||r.mds==null?+MAY.desp||0:+r.mds,F=desp+(+MAY.coord||0)*vhora();
  return {un:un,cu:cu,pk:pk,cuM:cuM,neto:neto,g:g,desp:desp,F:F,eq:F>0&&g>0?Math.ceil(F/g):0,rec:F>0&&g>0?Math.ceil(F/(0.2*g)):0};
}
var gcats=[];
var gid=1, gastos=[];
function gN(g){return g.iva==="incl"?g.monto/IVA:g.monto}
function gI(g){return g.iva==="incl"?g.monto-g.monto/IVA:(g.iva==="mas"?g.monto*(IVA-1):0)}
function gMes(){return gastos.filter(function(g){var d=pd(g.fecha);return d.getFullYear()===cur.y&&d.getMonth()===cur.m})}
var IVAL={incl:"IVA incluido",mas:"Más IVA",no:"Sin IVA"};

function logoSrc(){
  if(cfg.logo)return cfg.logo;
  var ch=(cfg.nombre||"D").trim().charAt(0).toUpperCase()||"D";
  return "data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#F8DCE5"/><text x="50" y="66" font-size="48" font-family="Georgia,serif" font-weight="700" text-anchor="middle" fill="#B3224F">'+ch.replace(/[<>&]/g,"")+'</text></svg>');
}
function $(s){return document.querySelector(s)}
function igUser(s){s=String(s||"").trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i,"").replace(/[?#].*$/,"").replace(/\/.*$/,"").replace(/^@+/,"");return s.replace(/[^A-Za-z0-9._]/g,"").slice(0,30)}
function waNum(s){var d=String(s||"").replace(/\D/g,"");if(d.length===9&&d.charAt(0)==="9")d="56"+d;else if(d.length===8)d="569"+d;return d}
function waFmt(d){d=d||"";return /^569\d{8}$/.test(d)?"+56 9 "+d.slice(3,7)+" "+d.slice(7):(d?"+"+d:"")}
function igUrl(u){return u?"https://instagram.com/"+encodeURIComponent(u):""}
function waUrl(d){return d?"https://wa.me/"+d:""}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
var fm=new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0});
var fmN=new Intl.NumberFormat("es-CL",{maximumFractionDigits:0});
function $$(n){n=Math.round(+n||0);return (n<0?"-":"")+"$ "+fmN.format(Math.abs(n))}
function mnum(v){if(typeof v==="number")return v;var t=String(v==null?"":v).replace(/[^\d,\-]/g,"").replace(",",".");var n=parseFloat(t);return isNaN(n)?0:n}
function mfmt(n){n=+n||0;var neg=n<0;n=Math.abs(n);var ip=Math.floor(n),dp=Math.round((n-ip)*100);return (neg?"-":"")+"$ "+fmN.format(ip)+(dp?","+String(dp).padStart(2,"0").replace(/0$/,""):"")}
var MESES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
var DIAS=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
function pd(s){var p=s.split("-");return new Date(+p[0],+p[1]-1,+p[2])}
function fechaLarga(s){var d=pd(s);return DIAS[d.getDay()]+" "+d.getDate()+" de "+MESES[d.getMonth()]}
function real(){return orders.filter(function(o){return !o.cot})}
function st(x){return x.cot?"cot":(x.pagado>=x.total?"pagado":(x.pagado>0?"anticipo":"sin"))}
var STL={cot:"Cotizado",pagado:"Pagado",anticipo:"Falta saldo",sin:"Sin pago"};
function inMonth(x){var d=pd(x.fecha);return d.getFullYear()===cur.y&&d.getMonth()===cur.m}
var CCOL=[["verde","Verde"],["amarillo","Amarillo"],["rosado","Rosado"],["lila","Lila"],["celeste","Celeste"],["naranjo","Naranjo"],["rojo","Rojo"],["gris","Gris"]];
function catCol(n){var i=pcats.findIndex(function(c){return c.n===n});if(i>=0&&pcats[i].col)return pcats[i].col;
  var k=xNorm(n);if(/cafeter/.test(k))return "verde";if(/personaliz/.test(k))return "amarillo";if(i<0)return "gris";
  var used={};pcats.forEach(function(q){if(q.col)used[q.col]=1});var free=CCOL.map(function(z){return z[0]}).filter(function(z){return !used[z]&&z!=="verde"&&z!=="amarillo"&&z!=="gris"});return free.length?free[i%free.length]:CCOL[i%7][0]}
function chipS(x){return '<span class="chip s-'+st(x)+'">'+STL[st(x)]+'</span>'}

var ICON={
cli:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.3-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><path d="M16 4.6a3.4 3.4 0 0 1 0 6.8M18.5 14.8c1.7.7 2.7 2.4 3 5.2"/></svg>',
 ing:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
 panel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/></svg>',
 cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
 ped:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/></svg>',
 prod:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 12h16M6 12a6 6 0 0 1 12 0M5 12v4a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-4"/></svg>',
 cost:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0"/></svg>',
 inv:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 8l9-5 9 5-9 5z"/><path d="M3 8v8l9 5 9-5V8"/></svg>',
 l:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg>',
 r:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M9 5l7 7-7 7"/></svg>'
};
ICON.pre='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>';
ICON.gas='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M14.5 9.2c-.5-.8-1.4-1.2-2.5-1.2-1.4 0-2.5.7-2.5 1.8 0 2.6 5 1.2 5 3.9 0 1.1-1.100 1.800-2.500 1.800-1.100 0-2.100-.5-2.600-1.400M12 6v2M12 16v2"/></svg>';
ICON.cfg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>';
ICON.mkt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10v4h3l6 4V6L6 10z"/><path d="M16 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11"/></svg>';
ICON.com='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11h10l2-8H6.5"/><circle cx="9" cy="19.500" r="1.200"/><circle cx="17" cy="19.500" r="1.200"/></svg>';
var NAV=[["panel","Panel","panel"],["cal","Calendario","cal"],["ped","Pedidos","ped"],["cli","Clientes","cli"],["prod","Producción","prod"],["cost","Recetas","cost"],["pre","Precios","pre"],["ing","Ingredientes","ing"],["com","Compras","com"],["inv","Inventario","inv"],["gas","Gastos","gas"],["mkt","Marketing","mkt"],["cfg","Ajustes","cfg"]];
function renderNav(){
  $("#side").innerHTML='<div class="brand"><img class="blogo" src="'+logoSrc()+'" alt=""><div><div class="bn">'+esc(cfg.nombre)+'</div><small>con Dulcia</small></div></div><div style="height:14px"></div>'+NAV.map(function(n){
    return '<button class="nav" data-v="'+n[0]+'"'+(view===n[0]?' aria-current="page"':'')+'>'+ICON[n[2]]+'<span>'+n[1]+'</span></button>'}).join("")+

    '<div class="demo" id="syncst">'+esc(window.SYNC_TXT||"")+'</div>';
}
function monthBar(){
  return '<div class="month"><button class="ib" data-m="-1" aria-label="Mes anterior">'+ICON.l+'</button><b>'+MESES[cur.m]+' '+cur.y+'</b><button class="ib" data-m="1" aria-label="Mes siguiente">'+ICON.r+'</button></div>';
}
function head(t,extra){return '<div class="head"><h1>'+t+'</h1><div class="sp"></div>'+(extra||'')+'</div>'}

/* ---------- PANEL ---------- */
function stats(){
  var list=real().filter(inMonth), v=0,neto=0,cob=0,contrib=0;
  list.forEach(function(x){v+=x.total;cob+=x.pagado;var n=x.total/IVA;neto+=n;contrib+=n*marg(x.cat)});
  var gs=gMes(),G=0,GI=0;gs.forEach(function(g){G+=gN(g);GI+=gI(g)});
  var mg=neto?contrib/neto:.7;
  var est=cfg.costeo==="estimado", res=est?contrib-G:neto-G;
  return {list:list,v:v,neto:neto,cob:cob,por:v-cob,contrib:contrib,costos:neto-contrib,mg:mg,G:G,GI:GI,gs:gs,res:res,est:est,pe:est?G/mg:G,ivaD:v-neto,mn:neto?res/neto:0};
}
function vPanel(){
  var s=stats(), pct=s.G?Math.min(100,s.neto/s.pe*100):100;
  var porCat={};s.list.forEach(function(x){var n=x.total/IVA;porCat[x.cat]=porCat[x.cat]||{b:0,n:0,c:0,k:0};porCat[x.cat].b+=+x.total||0;porCat[x.cat].n+=n;porCat[x.cat].c+=n*marg(x.cat);porCat[x.cat].k++});
  var rows=Object.keys(porCat).sort(function(a,b){return porCat[b].c-porCat[a].c}).map(function(k){var c=porCat[k];
    return '<tr><td>'+esc(k)+'</td><td class="r">'+$$(c.b)+'</td><td class="r">'+$$(c.n)+'</td><td class="r">'+Math.round(marg(k)*100)+'%</td><td class="r">'+$$(c.c)+'</td></tr>'}).join("");
  var gc={};s.gs.forEach(function(g){gc[g.cat]=(gc[g.cat]||0)+gN(g)});
  var grows=Object.keys(gc).sort(function(a,b){return gc[b]-gc[a]}).map(function(k){return '<tr><td>'+esc(k)+'</td><td class="r">'+$$(gc[k])+'</td></tr>'}).join("");
  var cks=Object.keys(porCat).sort(function(a,b){return porCat[b].b-porCat[a].b}), cmax=cks.length?porCat[cks[0]].b:0;
  var post='<section class="card catpost"><div class="l">Ventas por categoría</div>'+(cks.length?'<div class="cpl">'+cks.map(function(k){var c=porCat[k];
    return '<div class="cpr"><div class="cpn"><b>'+esc(k)+'</b><span>'+c.k+' pedido'+(c.k===1?'':'s')+'</span></div><div class="cpb"><span style="width:'+(cmax?Math.max(3,c.b/cmax*100):0)+'%"></span></div><div class="cpv">'+$$(c.b)+'<span>'+(s.v?Math.round(c.b/s.v*100):0)+'%</span></div></div>'}).join("")+'</div>'
    :'<div class="n">Sin pedidos este mes.</div>')+'<div class="n">Venta bruta (con IVA) del mes.</div></section>';
  var falta=s.pe-s.neto, ivaPag=s.ivaD-s.GI;
  function row(l,v,b,col){return '<tr'+(b?' class="tot"':'')+'><td>'+l+'</td><td class="r'+(col?(v>=0?' pos':' neg'):'')+'">'+$$(v)+'</td></tr>'}
  return head("Panel",monthBar())+
  '<div class="grid kpis">'+
   kpi("Ventas del mes",$$(s.v),s.list.length+" pedidos · cobrado "+$$(s.cob))+
   (s.est?kpi("Costos de producción",$$(s.costos),"Estimado según el margen de cada categoría"):kpi("Por cobrar",$$(s.por),"Saldos pendientes de los pedidos del mes"))+
   kpi("Gastos del mes",$$(s.G),s.gs.length+" gastos, sin IVA"+(s.est?"":" · incluye ingredientes y materiales"))+
   kpi("Resultado final",'<span class="'+(s.res>=0?'pos':'neg')+'">'+$$(s.res)+'</span>',"Margen neto: "+(s.mn*100).toFixed(1)+"%")+
  '</div>'+post+'<div class="grid two" style="margin-top:14px"><div class="grid" style="align-content:start">'+
   '<section class="card"><h2 style="font-size:1.38rem">Del ingreso al resultado</h2><table><tbody>'+
    (s.est?row("Ventas netas (sin IVA)",s.neto)+row("Costos de producción (estimado)",-s.costos)+row("Utilidad bruta",s.contrib,1)+row("Gastos del mes",-s.G)+row("Resultado final",s.res,1,1)
          :row("Ventas netas (sin IVA)",s.neto)+row("Gastos del mes",-s.G)+row("Resultado final",s.res,1,1))+'</tbody></table>'+
    '<p class="note" style="margin-top:8px">'+(s.est?'Los costos de producción se estiman con el margen de cada categoría, porque tus gastos son solo fijos.':'Tus gastos reales ya incluyen ingredientes y materiales, por eso no se resta un costo estimado.')+' <button class="lnk" data-v="cfg">Cambiar en Ajustes</button></p>'+
    '<dl class="kv" style="margin-top:14px"><dt>IVA de tus ventas</dt><dd>'+$$(s.ivaD)+'</dd><dt>IVA de tus gastos</dt><dd>-'+$$(s.GI)+'</dd><dt>IVA por pagar (estimado)</dt><dd><b>'+$$(ivaPag)+'</b></dd></dl><p class="note">El IVA es una estimación. Confírmalo con tu contador.</p></section>'+
   '<section class="card"><h2 style="font-size:1.38rem">Punto de equilibrio</h2>'+
   (s.G?'<p class="note" style="margin-top:4px">Ventas netas que necesitas para cubrir tus gastos de '+$$(s.G)+(s.est?' y tus costos de producción':'')+'.</p><div class="bar"><span style="width:'+pct+'%"></span></div>'+
   '<div style="display:flex;justify-content:space-between;font-size:.9rem"><span>Llevas '+$$(s.neto)+'</span><span>Meta '+$$(s.pe)+'</span></div>'+
   '<p style="margin:14px 0 0;font-weight:600">'+(falta>0?'Te faltan '+$$(falta)+' de ventas netas para no perder.':'Ya superaste el punto de equilibrio por '+$$(-falta)+'.')+'</p>':'<p class="note">Registra tus gastos del mes en la sección Gastos para calcular tu punto de equilibrio.</p>')+'</section></div>'+
   '<div class="grid" style="align-content:start"><section class="card"><h2 style="font-size:1.38rem">Margen por categoría</h2><div class="scroll"><table class="mc"><thead><tr><th>Categoría</th><th class="r">Venta bruta</th><th class="r">Venta neta</th><th class="r">Margen</th><th class="r">Aporte</th></tr></thead><tbody>'+(rows||'<tr><td colspan="5" class="empty">Sin pedidos este mes.</td></tr>')+'</tbody></table></div></section>'+
   '<section class="card"><h2 style="font-size:1.38rem">Gastos por categoría</h2><table><tbody>'+(grows||'<tr><td class="empty">Sin gastos este mes.</td></tr>')+'</tbody></table></section></div>'+
  '</div>';
}
var PERS=[5,10,15,20,25,30,35,40];
function persTxt(x){return x&&x.personas?x.personas+" personas":""}
/* ---------- MARKETING: base de clientes ---------- */
var mktF={q:"",seg:"",ord:"total",cat:""};
function clientes(){
  var by={}, alias={}, list=[];
  function nk(v){return "n:"+xNorm(v)}
  orders.slice().sort(function(a,b){return (a.fecha+a.hora)<(b.fecha+b.hora)?-1:1}).forEach(function(o){
    var nm=String(o.cliente||"").trim(); if(!nm)return;
    var ks=[o.wa?"w:"+o.wa:null,o.ig?"i:"+o.ig.toLowerCase():null,nk(nm)].filter(Boolean), key=null;
    ks.forEach(function(k){if(key||!alias[k])return;var c0=by[alias[k]];if(k.charAt(0)==="n"&&o.wa&&c0.wa&&c0.wa!==o.wa)return;key=alias[k]});
    ks=ks.filter(function(k){return !(k.charAt(0)==="n"&&alias[k]&&alias[k]!==key&&by[alias[k]].wa&&by[alias[k]].wa!==o.wa)});
    if(!key){key=ks[0];by[key]={nombre:nm,ig:"",wa:"",n:0,cot:0,total:0,primera:"",ultima:"",cats:{},canal:{},personas:0};list.push(by[key])}
    ks.forEach(function(k){alias[k]=key});
    var c=by[key]; c.nombre=nm; if(o.ig)c.ig=o.ig; if(o.wa)c.wa=o.wa;
    if(o.cot){c.cot++;c.cotc=c.cotc||{};c.cotc[o.cat]=1;return}
    c.n++; c.total+=+o.total||0; if(!c.primera)c.primera=o.fecha; if(o.fecha>c.ultima)c.ultima=o.fecha;
    c.cats[o.cat]=(c.cats[o.cat]||0)+1; c.canal[o.canal]=(c.canal[o.canal]||0)+1;
  });
  var t0=pd(TODAY);
  list.forEach(function(c){
    var top=function(m){return Object.keys(m).sort(function(a,b){return m[b]-m[a]})[0]||""};
    c.cat=top(c.cats); c.can=top(c.canal); c.ticket=c.n?c.total/c.n:0;
    c.dias=c.ultima?Math.round((t0-pd(c.ultima))/864e5):null;
    c.seg=!c.n?"cotizo":(c.ultima>TODAY?"proxima":(c.n>=3?"frecuente":(c.dias!=null&&c.dias>90?"inactiva":(c.n===1&&c.dias!=null&&c.dias<=30?"nueva":"ocasional"))));
    if(c.n>=3&&c.dias!=null&&c.dias>90)c.seg="recuperar";
  });
  return list;
}
var SEGL={frecuente:"Frecuente",recuperar:"Frecuente sin volver",inactiva:"Inactiva",nueva:"Nueva",ocasional:"Ocasional",proxima:"Con pedido próximo",cotizo:"Solo cotizó"};
var SEGT={frecuente:"3 o más pedidos y compró en los últimos 90 días.",recuperar:"Compró 3 o más veces, pero hace más de 90 días que no pide.",inactiva:"Hace más de 90 días que no pide.",nueva:"Su primer pedido fue en los últimos 30 días.",ocasional:"1 o 2 pedidos en los últimos 90 días.",proxima:"Tiene un pedido con fecha futura.",cotizo:"Pidió cotización pero aún no compra."};
function mktList(){
  var q=xNorm(mktF.q), l=clientes().filter(function(c){return (!mktF.seg||c.seg===mktF.seg)&&(!mktF.cat||c.cats[mktF.cat]||(c.cotc&&c.cotc[mktF.cat]))&&(!q||xNorm(c.nombre+" "+c.ig+" "+c.wa).indexOf(q)>=0)});
  var o=mktF.ord; l.sort(function(a,b){return o==="nombre"?a.nombre.localeCompare(b.nombre,"es"):o==="ultima"?(b.ultima||"").localeCompare(a.ultima||""):o==="n"?b.n-a.n:b.total-a.total});
  return l;
}
function vMkt(){
  var all=clientes(), l=mktList(), comp=all.filter(function(c){return c.n}), rec=comp.filter(function(c){return c.n>=2}).length;
  var tk=comp.length?comp.reduce(function(a,c){return a+c.total},0)/comp.reduce(function(a,c){return a+c.n},0):0;
  var cnt={}; all.forEach(function(c){cnt[c.seg]=(cnt[c.seg]||0)+1});
  var segs=["frecuente","recuperar","inactiva","nueva","ocasional","proxima","cotizo"].filter(function(k){return cnt[k]});
  var chips='<button class="segc'+(!mktF.seg?' on':'')+'" data-seg="">Todas · '+all.length+'</button>'+segs.map(function(k){return '<button class="segc sg-'+k+(mktF.seg===k?' on':'')+'" data-seg="'+k+'" title="'+SEGT[k]+'">'+SEGL[k]+' · '+cnt[k]+'</button>'}).join("");
  var rows=l.map(function(c){
    return '<tr><td><b>'+esc(c.nombre)+'</b><div class="note" style="margin:0"><span class="sgt sg-'+c.seg+'">'+SEGL[c.seg]+'</span></div></td>'+
      '<td class="ct">'+(c.wa?'<a target="_blank" rel="noopener" href="'+waUrl(c.wa)+'">'+esc(waFmt(c.wa))+'</a>':'')+(c.ig?'<a target="_blank" rel="noopener" href="'+igUrl(c.ig)+'">@'+esc(c.ig)+'</a>':'')+(!c.wa&&!c.ig?'<span class="note" style="margin:0">Sin contacto</span>':'')+'</td>'+
      '<td class="r">'+c.n+(c.cot?'<div class="note" style="margin:0">+'+c.cot+' cotiz.</div>':'')+'</td><td class="r">'+$$(c.total)+'</td><td class="r">'+(c.n?$$(c.ticket):'')+'</td>'+
      '<td>'+(c.ultima?fechaCorta(c.ultima)+(c.dias>0?'<div class="note" style="margin:0">hace '+c.dias+' días</div>':''):'<span class="note" style="margin:0">—</span>')+'</td><td>'+esc(c.cat)+'</td></tr>'}).join("");
  return head("Marketing",'<button class="btn" data-mktx>Descargar clientes en Excel</button>')+
   '<p class="note" style="margin:-6px 0 14px">Tu base de clientes se arma sola con tus pedidos. Úsala para escribirles por WhatsApp, recuperar a las que no vuelven o crear audiencias en Instagram.</p>'+
   '<div class="grid kpis">'+kpi("Clientes",String(all.length),comp.length+" con compras")+kpi("Vuelven a comprar",(comp.length?Math.round(rec/comp.length*100):0)+"%",rec+" con 2 o más pedidos")+kpi("Ticket promedio",$$(tk),"Por pedido, con IVA")+kpi("Para recuperar",String((cnt.inactiva||0)+(cnt.recuperar||0)),"Más de 90 días sin pedir")+'</div>'+
   '<section class="card" style="margin-top:14px"><div class="segs">'+chips+'</div>'+
   '<div class="filters" style="margin:12px 0 0"><input type="search" id="mq" placeholder="Buscar por nombre, Instagram o WhatsApp" value="'+esc(mktF.q)+'"><select id="mcat" aria-label="Categoría de pedido"><option value="">Todas las categorías</option>'+(function(){var cs={};pcats.forEach(function(c){cs[c.n]=1});orders.forEach(function(o){if(o.cat)cs[o.cat]=1});return Object.keys(cs).sort(function(a,b){return a.localeCompare(b,"es")})})().map(function(k){return '<option'+(mktF.cat===k?' selected':'')+'>'+esc(k)+'</option>'}).join("")+'</select><select id="mo" aria-label="Ordenar"><option value="total"'+(mktF.ord==="total"?' selected':'')+'>Más compras ($)</option><option value="n"'+(mktF.ord==="n"?' selected':'')+'>Más pedidos</option><option value="ultima"'+(mktF.ord==="ultima"?' selected':'')+'>Compra más reciente</option><option value="nombre"'+(mktF.ord==="nombre"?' selected':'')+'>Nombre</option></select></div>'+
   (mktF.seg||mktF.cat?'<p class="note" style="margin:8px 0 0">'+(mktF.seg?SEGT[mktF.seg]+' ':'')+(mktF.cat?'Clientas que han pedido o cotizado “'+esc(mktF.cat)+'”.':'')+'</p>':'')+
   '<div class="scroll" style="margin-top:10px"><table class="mkt"><thead><tr><th>Cliente</th><th>Contacto</th><th class="r">Pedidos</th><th class="r">Total comprado</th><th class="r">Ticket</th><th>Último pedido</th><th>Compra más</th></tr></thead><tbody>'+
   (rows||'<tr><td colspan="7" class="empty">'+(all.length?'Ninguna clienta coincide con este filtro.':'Cuando registres pedidos, tus clientes aparecerán aquí.')+'</td></tr>')+'</tbody></table></div>'+
   '<p class="note">'+l.length+' cliente'+(l.length===1?'':'s')+' en la lista. El Excel descarga '+(mktF.seg||mktF.q||mktF.cat?'solo las de este filtro':'todas')+'. Cuida estos datos: úsalos solo para comunicarte con tus clientas.</p></section>';
}
function fechaCorta(iso){return iso.slice(8,10)+"-"+iso.slice(5,7)+"-"+iso.slice(0,4)}
function mktExport(){xlsxLib().then(function(X){
  var l=mktList(), H=["Cliente","WhatsApp","Instagram","Segmento","Pedidos","Cotizaciones","Total comprado","Ticket promedio","Primer pedido","Último pedido","Días sin comprar","Categoría que más compra","Canal","Link WhatsApp"];
  var rows=l.map(function(c){return [c.nombre,c.wa?waFmt(c.wa):"",c.ig?"@"+c.ig:"",SEGL[c.seg],c.n,c.cot,Math.round(c.total),Math.round(c.ticket),c.primera?fechaCorta(c.primera):"",c.ultima?fechaCorta(c.ultima):"",c.dias==null?"":Math.max(0,c.dias),c.cat,c.can,c.wa?waUrl(c.wa):""]});
  xBook(X,H,rows,[26,18,18,20,9,12,15,15,13,13,14,24,14,32],["Base de clientes de "+(cfg.nombre||"tu pastelería")+" · "+fechaCorta(TODAY),"","Se arma con tus pedidos registrados en Dulcia. Las cotizaciones no cuentan como compra.","","Segmentos:"].concat(Object.keys(SEGL).map(function(k){return "• "+SEGL[k]+": "+SEGT[k]})).concat(["","Cuida estos datos personales: úsalos solo para comunicarte con tus clientas y no los compartas."]),"Clientes","Clientes_"+(xNorm(cfg.nombre)||"Dulcia")+(mktF.cat?"_"+xNorm(mktF.cat):"")+"_"+TODAY+".xlsx");
  toast(l.length+" cliente"+(l.length===1?"":"s")+" descargad"+(l.length===1?"a":"as"));
}).catch(function(e){toast(e.message)})}
document.addEventListener("click",function(e){var t=e.target.closest("button");if(!t)return;
  if(t.hasAttribute("data-mktx"))mktExport();else if(t.dataset.seg!==undefined&&t.classList.contains("segc")){mktF.seg=t.dataset.seg;render()}});
document.addEventListener("input",function(e){var t=e.target;if(t.id==="mq"){mktF.q=t.value;var pos=t.selectionStart;render();var n=$("#mq");if(n){n.focus();try{n.setSelectionRange(pos,pos)}catch(er){}}}else if(t.id==="mo"){mktF.ord=t.value;render()}else if(t.id==="mcat"){mktF.cat=t.value;render()}});
function kpi(l,v,n){return '<div class="card kpi"><div class="l">'+l+'</div><div class="v">'+v+'</div><div class="n">'+n+'</div></div>'}

/* ---------- CALENDARIO ---------- */
function vCalBase(){
  var first=new Date(cur.y,cur.m,1), off=(first.getDay()+6)%7, dim=new Date(cur.y,cur.m+1,0).getDate(), cells="";
  ["lun","mar","mié","jue","vie","sáb","dom"].forEach(function(d){cells+='<div class="dh">'+d+'</div>'});
  for(var i=0;i<off;i++)cells+='<div class="d off"></div>';
  for(var d=1;d<=dim;d++){
    var iso=cur.y+"-"+String(cur.m+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");
    var ev=real().filter(function(x){return x.fecha===iso}).sort(function(a,b){return a.hora<b.hora?-1:1});
    var h=ev.slice(0,3).map(function(x){return '<button class="ev cc-'+catCol(x.cat)+'" data-o="'+x.id+'" title="'+esc(x.cliente+" · "+x.cat+" · "+STL[st(x)])+'"><i class="pd p-'+st(x)+'"></i>'+esc(x.cliente)+'</button>'}).join("");
    if(ev.length>3)h+='<button class="more" data-day="'+iso+'">+'+(ev.length-3)+' más</button>';
    cells+='<div class="d'+(iso===TODAY?' today':'')+'" data-nd="'+iso+'" title="Agregar pedido este día"><span class="n">'+d+'</span>'+h+'</div>';
  }
  var rest=(7-(off+dim)%7)%7;for(i=0;i<rest;i++)cells+='<div class="d off"></div>';
  return head("Calendario",monthBar()+'<button class="btn" data-new>Nuevo pedido</button>')+
   '<div class="cal">'+cells+'</div>'+
   '<div class="legend">'+pcats.map(function(c){return '<span class="chip cc-'+catCol(c.n)+'">'+esc(c.n)+'</span>'}).join("")+'</div><div class="legend" style="margin-top:6px"><span class="lg"><i class="pd p-pagado"></i>Pagado</span><span class="lg"><i class="pd p-anticipo"></i>Falta saldo</span><span class="lg"><i class="pd p-sin"></i>Sin pago</span><span>Toca un día para ver todos sus pedidos o agregar uno nuevo. Toca un pedido para ver su detalle.</span></div>';
}

function vCal2(){
  var h=vCalBase();
  var b=cfg.asked?'':'<div class="card banner"><div><b>¿Quieres ver tus pedidos en Google Calendar?</b><div class="note" style="margin:2px 0 0">Si tu cuenta es Gmail, cada pedido nuevo se crea solo como evento en tu calendario.</div></div><div class="bt"><button class="btn sm" data-gc="yes">Conectar con Google</button><button class="btn ghost sm" data-gc="no">Ahora no</button></div></div>';
  return h.replace('<div class="cal">',b+'<div class="cal">');
}
/* ---------- PEDIDOS ---------- */
function vPed(){
  var l=orders.filter(inMonth).filter(function(x){return (!filtro.cat||x.cat===filtro.cat)&&(!filtro.est||st(x)===filtro.est)}).sort(function(a,b){return (a.fecha+a.hora)<(b.fecha+b.hora)?-1:1});
  var opts='<option value="">Todas las categorías</option>'+pcats.map(function(p){return p.n}).concat(orders.some(function(x){return x.cat==="Sin categoría"})?["Sin categoría"]:[]).map(function(c){return '<option'+(filtro.cat===c?' selected':'')+'>'+esc(c)+'</option>'}).join("");
  var es='<option value="">Todos los pagos</option>'+["pagado","anticipo","sin"].map(function(k){return '<option value="'+k+'"'+(filtro.est===k?' selected':'')+'>'+STL[k]+'</option>'}).join("");
  window._pvis=l.map(function(x){return x.id}); Object.keys(sel).forEach(function(k){if(!orders.some(function(o){return o.id===+k}))delete sel[k]});
  var ns=Object.keys(sel).length;
  var bar=selMode?'<div class="selbar"><b>'+ns+' seleccionado'+(ns===1?'':'s')+'</b><div class="sb"><button class="btn ghost sm" data-selall>'+(l.length&&l.every(function(x){return sel[x.id]})?'Quitar todos':'Seleccionar todos ('+l.length+')')+'</button><button class="btn sm danger-f" data-seldel'+(ns?'':' disabled')+'>Eliminar '+ns+'</button><button class="btn ghost sm" data-selmode>Listo</button></div></div>':'';
  return head("Pedidos",monthBar()+'<button class="btn ghost" data-cats="ped">Categorías</button><button class="btn ghost" data-pxlsx>Excel</button>'+(selMode?'':'<button class="btn ghost" data-selmode>Seleccionar</button>')+'<button class="btn" data-new>Nuevo pedido</button>')+bar+
   '<div class="filters"><select id="fcat" aria-label="Categoría">'+opts+'</select><select id="fest" aria-label="Estado de pago">'+es+'</select></div>'+
   '<div class="grid">'+(l.length?l.map(function(x){
     return '<button class="ord'+(selMode?' selm'+(sel[x.id]?' on':''):'')+'" '+(selMode?'data-selo="'+x.id+'" aria-pressed="'+!!sel[x.id]+'"':'data-o="'+x.id+'"')+'>'+(selMode?'<span class="sck" aria-hidden="true"></span>':'')+(x.fotos[0]?'<img class="thumb" loading="lazy" decoding="async" src="'+th(x.fotos[0])+'" alt="">':'<div class="thumb">sin foto</div>')+
     '<div style="min-width:0"><h3>'+esc(x.cliente)+'</h3><p>'+fechaLarga(x.fecha)+' · '+x.hora+' · '+esc(x.cat)+(x.personas?' · '+persTxt(x):'')+'</p><p>'+esc(x.desc)+'</p></div>'+
     '<div class="rt"><b>'+$$(x.total)+'</b>'+chipS(x)+'</div></button>'}).join(""):'<div class="card empty">No hay pedidos con estos filtros. Crea uno con “Nuevo pedido”.</div>')+'</div>';
}

/* ---------- PRODUCCION ---------- */
function hTxt(min){var h=min/60;return (h<10?fq(Math.round(h*10)/10):fq(Math.round(h)))+" h"}
function udPl(r,n){var u=String(r&&r.ud||"").trim()||"unidad";if(n===1)return u;var w=u.split(" "),f=w[0];w[0]=/[aeiouáéó]$/i.test(f)?f+"s":/z$/i.test(f)?f.slice(0,-1)+"ces":f+"es";return w.join(" ")}
var PRODR=7;
function prodSum(dias){
  var by={},sin=0,pd2={};real().filter(function(o){return dias.indexOf(o.fecha)>=0}).forEach(function(o){var ln=(o.items||[]).filter(function(l){return recipes.some(function(r){return r.id===l.rid})});if(!ln.length){sin++;return}
    ln.forEach(function(l){var r=recipes.find(function(q){return q.id===l.rid}),x=by[r.id]=by[r.id]||{r:r,q:0,listo:0,ped:0,ta:0,te:0,tn:0};x.q+=+l.q||0;x.ped++;if(o.listo)x.listo+=+l.q||0;var k=r.id+"|"+o.fecha;pd2[k]=(pd2[k]||0)+(+l.q||0)})});
  // tiempo: por día se hacen tandas completas de cada receta
  Object.keys(pd2).forEach(function(k){var r=by[k.split("|")[0]].r,t=Math.ceil(pd2[k]/(r.un||1)-1e-9);by[r.id].tn+=t;by[r.id].ta+=t*(+r.ta||0);by[r.id].te+=t*(+r.te||0)});
  var rows=Object.keys(by).map(function(k){return by[k]}).sort(function(a,b){return a.r.nombre.localeCompare(b.r.nombre,"es")});
  return {rows:rows,sin:sin,ta:rows.reduce(function(a,x){return a+x.ta},0),te:rows.reduce(function(a,x){return a+x.te},0),sinT:rows.filter(function(x){return !(+x.r.ta)}).length};
}
function invUso(o){ // ingredientes que usa un pedido (con merma), por ingrediente
  var u={};(o.items||[]).forEach(function(l){var r=recipes.find(function(q){return q.id===l.rid});if(!r)return;
    r.items.forEach(function(it){if(gbuy[it.g]===false||!it.n)return;var x=ingFind(it.n,it.u);if(!x)return;var k=ingK(x.n,x.u);u[k]=(u[k]||0)+it.q*(+l.q||0)/(r.un||1)*(1+(+x.mm||0)/100)})});
  return u;
}
function invListo(o){
  if(window.NO_P2)return "";
  if(o.listo&&!o.desc_st){var u=invUso(o),n=0;Object.keys(u).forEach(function(k){var x=ings.find(function(i){return ingK(i.n,i.u)===k});if(x){x.st=(+x.st||0)-u[k];n++}});o.desc_st=n?u:null;return n?"Inventario: se descontaron "+n+" ingrediente"+(n===1?"":"s"):""}
  if(!o.listo&&o.desc_st){var d=o.desc_st,m=0;Object.keys(d).forEach(function(k){var x=ings.find(function(i){return ingK(i.n,i.u)===k});if(x){x.st=(+x.st||0)+d[k];m++}});o.desc_st=null;return m?"Inventario: se devolvieron "+m+" ingrediente"+(m===1?"":"s"):""}
  return "";
}
var PRODOFF=0;
function vProd(){
  var t0=pd(addDays(TODAY,PRODOFF*7)), days=[];
  for(var i=0;i<7;i++){var d=new Date(t0.getFullYear(),t0.getMonth(),t0.getDate()+i);days.push(d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"))}
  var total=0,html=days.map(function(iso){
    var ev=real().filter(function(x){return x.fecha===iso}).sort(function(a,b){return a.hora<b.hora?-1:1});
    total+=ev.length;
    var sdd=prodSum([iso]),sd=sdd.rows;
    return '<div class="day"><h3>'+fechaLarga(iso)+(iso===TODAY?' (hoy)':'')+'</h3>'+(sd.length?'<div class="daysum">'+(!window.NO_P2&&sdd.ta?'<span class="dh">⏱ '+hTxt(sdd.ta)+'</span>':'')+sd.map(function(x){return '<span>'+fq(x.q)+' '+esc(udPl(x.r,x.q))+' · '+esc(x.r.nombre)+'</span>'}).join("")+'</div>':'')+(ev.length?ev.map(function(x){
      return '<label class="prod'+(x.listo?' done':'')+'"><input type="checkbox" data-l="'+x.id+'"'+(x.listo?' checked':'')+'><div style="flex:1;min-width:0"><b>'+x.hora+' · '+esc(x.cliente)+'</b><div class="note" style="margin:0">'+esc(x.cat)+(x.personas?' · '+persTxt(x):'')+' · '+esc(x.desc)+'</div></div>'+(x.fotos[0]?'<img class="thumb" loading="lazy" decoding="async" style="width:48px;height:48px" src="'+th(x.fotos[0])+'" alt="">':'')+'</label>'}).join(""):'<div class="note">Sin pedidos.</div>')+'</div>'}).join("");
  var a0=pd(days[0]),a6=pd(days[6]),rng=a0.getDate()+(a0.getMonth()!==a6.getMonth()?' de '+MESES[a0.getMonth()]:'')+' al '+a6.getDate()+' de '+MESES[a6.getMonth()];
  var sm=prodSum(days),tot=!sm.rows.length?'<section class="card prodsum"><h2 style="font-size:1.35rem">Total a producir · '+rng+'</h2><p class="note" style="margin:6px 0 0">'+(total?'Ningún pedido de estos días tiene receta asignada. Abre cada pedido y agrégale su receta y cantidad: aquí se juntan por producto (ej.: “5 galletas chips en total”).':'No hay pedidos en estos días.')+'</p></section>':'<section class="card prodsum"><h2 style="font-size:1.35rem">Total a producir · '+rng+'</h2><p class="note" style="margin:2px 0 8px">Todos los pedidos de estos días juntos por producto.</p><div class="scroll"><table class="pg ptab"><thead><tr><th>Receta</th><th class="r">Cantidad</th>'+(window.NO_UN?'':'<th class="r">Tandas de receta</th>')+'<th class="r">Pedidos</th>'+(window.NO_P2?'':'<th class="r">Trabajo activo</th>')+'<th class="r">Listo</th></tr></thead><tbody>'+
    sm.rows.map(function(x){var un=x.r.un||1;return '<tr><td><b>'+esc(x.r.nombre)+'</b></td><td class="r"><b>'+fq(x.q)+'</b> '+esc(udPl(x.r,x.q))+'</td>'+(window.NO_UN?'':'<td class="r">'+(un>1?fq(x.tn)+' <span class="note" style="margin:0">(rinde '+un+(x.tn*un>x.q?', sobran '+fq(x.tn*un-x.q):'')+')</span>':fq(x.q))+'</td>')+'<td class="r">'+x.ped+'</td>'+(window.NO_P2?'':'<td class="r">'+(+x.r.ta?hTxt(x.ta):'<button class="lnk" data-gorec="'+x.r.id+'" title="Anota el tiempo en la receta">sin tiempo</button>')+'</td>')+'<td class="r">'+(x.listo>=x.q?'<span class="st pagando">Todo</span>':x.listo?fq(x.listo)+' de '+fq(x.q):'—')+'</td></tr>'}).join("")+
    '</tbody></table></div>'+(window.NO_P2?'':!sm.ta?'<p class="ptime note">Anota el tiempo de trabajo de cada receta (Recetas → Tiempo de producción) para ver cuántas horas necesitas por día y por semana.</p>':'<p class="ptime"><b>'+hTxt(sm.ta)+' de trabajo activo</b> '+(PRODOFF?'en esos días':'en los próximos 7 días')+(sm.te?' · '+hTxt(sm.te)+' de horno o reposo':'')+(vhora()?' · mano de obra '+$$(sm.ta/60*vhora()):'')+(EQ.length&&EQ.some(function(p){return +p.h})?(function(){var cap=EQ.reduce(function(a,p){return a+(+p.h||0)},0);return ' · tu equipo tiene <b>'+fq(cap)+' h</b> a la semana'+(sm.ta/60>cap?' <span class="neg">(faltan '+hTxt(sm.ta-cap*60)+')</span>':'')})():'')+(sm.sinT?'. <span class="note" style="margin:0">'+sm.sinT+' receta'+(sm.sinT===1?'':'s')+' sin tiempo anotado.</span>':'')+'</p>')+(sm.sin?'<p class="note" style="margin:8px 0 0">'+sm.sin+' pedido'+(sm.sin===1?'':'s')+' sin receta no se cuenta'+(sm.sin===1?'':'n')+'. Asígnales una receta para incluirlos.</p>':'')+'</section>';
  var bar='<div class="month"><button class="ib" data-pw="-1" aria-label="Semana anterior">'+ICON.l+'</button><b style="min-width:11em;text-transform:none">'+(PRODOFF===0?'Próximos 7 días':rng)+'</b><button class="ib" data-pw="1" aria-label="Semana siguiente">'+ICON.r+'</button></div>'+(PRODOFF?'<button class="btn ghost sm" data-pw="0">Volver a hoy</button>':'')+'<span class="note" style="margin:0">'+total+' pedido'+(total===1?'':'s')+'</span>';
  return head("Producción",bar)+tot+html;
}

/* ---------- RECETAS ---------- */
function rtot(){return recipe.reduce(function(a,r){return a+r.q*r.c},0)}
function rcost(r){return r.items.reduce(function(a,i){return a+i.q*i.c},0)}
function groups(){var g=[];recipe.forEach(function(r){if(g.indexOf(r.g)<0)g.push(r.g)});return g}
function insertRow(gp){var last=-1;recipe.forEach(function(r,i){if(r.g===gp)last=i});recipe.splice(last+1,0,{g:gp,n:"",q:1,u:"",c:0})}
var FQ=new Intl.NumberFormat("es-CL",{maximumFractionDigits:2});
var FC=new Intl.NumberFormat("es-CL",{maximumFractionDigits:2,minimumFractionDigits:0});
function $$u(n){n=+n||0;return "$ "+(Math.abs(n)<100&&Math.round(n)!==n?FC.format(n):fmN.format(Math.round(n)))}
function fq(n){return FQ.format(n)}
function vCost(){
  var lupa='<label class="rsearch"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><input type="search" id="rq" placeholder="Buscar receta" aria-label="Buscar receta" value="'+esc(RQ)+'"></label>';
  var top=head("Recetas",(recipes.length?lupa:'')+'<button class="btn ghost" data-xlsx>Cargar desde Excel</button><button class="btn" data-newr>Nueva receta</button>');
  var tip=window.NO_ING?'':'<div class="rtip'+(ings.length?'':' fuerte')+'"><span class="rtipi" aria-hidden="true">💡</span><div><b>Para crear una receta, primero crea sus ingredientes.</b> Anótalos en <button class="lnk" data-v="ing">Ingredientes</button> con lo que pagas y cuánto trae el envase; así cada receta calcula sola su costo. Si te falta uno mientras armas la receta, elige “+ Crear ingrediente nuevo” en la lista.</div></div>';
  if(!recipes.length)return top+tip+'<div class="card empty">Aún no tienes recetas. Crea la primera con “Nueva receta”, o cárgalas todas de una vez con “Cargar desde Excel”.</div>';
  var qn=xNorm(RQ),vis=0,chips=recipes.slice().sort(function(a,b){return String(a.nombre||"").localeCompare(String(b.nombre||""),"es",{sensitivity:"base",numeric:true})}).map(function(r){var rn=xNorm(r.nombre),hid=qn&&rn.indexOf(qn)<0&&r.id!==curR;if(!hid)vis++;return '<button class="rc'+(r.id===curR?' on':'')+'" data-sel="'+r.id+'" data-rn="'+esc(rn)+'"'+(hid?' hidden':'')+'><b>'+esc(r.nombre)+'</b><span>'+esc(r.rinde)+'</span><span>Costo '+$$(rcost(r))+'</span></button>'}).join("")+'<div class="rnone note" id="rnone"'+(vis?' hidden':'')+'>No hay recetas con ese nombre.</div>';
  var g="",gl=groups();
  gl.forEach(function(gp,gi){
    g+='<tr class="grp"><td colspan="5"><div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><span>'+esc(gp)+'</span><label class="chk"><input type="checkbox" data-gbuy="'+gi+'"'+(gbuy[gp]!==false?' checked':'')+'> <b>Se incluye en Compras</b></label><span class="chkx">'+(gbuy[gp]!==false?'Estos ítems suman a tu lista de compras de la semana.':'No va a Compras: úsalo para gas, luz u otros costos que no compras por pedido.')+'</span></div></td><td><button class="x" data-delgrp="'+gi+'" aria-label="Eliminar categoría de costo">✕</button></td></tr>';
    recipe.forEach(function(r,i){ if(r.g!==gp)return;
      if(window.NO_ING)g+='<tr><td><input class="t" type="text" value="'+esc(r.n)+'" data-r="'+i+'" data-k="n" aria-label="Nombre"></td><td><input type="number" step="any" value="'+r.q+'" data-r="'+i+'" data-k="q" aria-label="Cantidad"></td><td><input class="u t" type="text" value="'+esc(r.u)+'" data-r="'+i+'" data-k="u" aria-label="Unidad"></td><td><input type="text" class="money" inputmode="decimal" value="'+mfmt(r.c)+'" data-r="'+i+'" data-k="c" aria-label="Costo por unidad"></td>';
      else{var ix=r.n?ingFind(r.n,r.u):null;
      g+='<tr><td><button type="button" class="ingpick'+(ix?'':' empty')+'" data-pickb="'+i+'" aria-haspopup="listbox"><span>'+(ix?esc(ix.n):'Elige un ingrediente…')+'</span><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'+(r.n&&!ix?'<div class="note" style="margin:2px 0 0;color:var(--bad)">“'+esc(r.n)+'” no está en Ingredientes</div>':'')+'</td><td><input type="number" step="any" value="'+r.q+'" data-r="'+i+'" data-k="q" aria-label="Cantidad"></td><td class="ro"><span class="rov">'+esc(r.u||"—")+'</span></td><td class="r ro" title=""El precio se cambia en Ingredientes"><span class="rov">'+(r.n&&ix&&!(+ix.c)?'<button class="lnk bad" data-v="ing">Sin precio</button>':$$u(r.c))+'</span></td>';}
      g+='<td class="r"><span class="rov" id="sub'+i+'">'+$$(r.q*r.c)+'</span></td><td><button class="x" data-delrow="'+i+'" aria-label="Quitar ítem">✕</button></td></tr>';
    });
    g+='<tr><td colspan="6"><button class="btn ghost sm" data-addrow="'+gi+'">+ Agregar ítem</button></td></tr>';
  });
  return top+tip+'<div class="rlist">'+chips+'</div>'+
  '<div class="grid two costgrid"><section class="card cost"><div class="f" style="margin-bottom:10px"><label>Nombre de la receta<input type="text" id="rn" value="'+esc(rp.nombre)+'"></label><label>Rinde<input type="text" id="rr" value="'+esc(rp.rinde)+'"></label>'+
    (window.NO_UN?'':'<label>Unidades que rinde<input type="number" id="run" style="text-align:left" min="1" step="1" inputmode="numeric" value="'+(rp.un||1)+'"></label><label>Se vende por<input type="text" id="rud" style="text-align:left" maxlength="30" placeholder="Ej.: galleta, torta, caja" value="'+esc(rp.ud||"")+'"></label>')+'</div>'+
    (window.NO_UN?'':'<p class="note" style="margin:-4px 0 10px">En los pedidos, la cantidad es en <b>'+esc(udPl(rp,2))+'</b>. Ej.: si rinde 24 y piden 6, la app calcula ¼ de la receta.</p>')+
  '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ghost sm" data-addgrp>+ Nueva categoría de costo</button><button class="btn ghost sm" data-dupr>Duplicar receta</button><button class="btn ghost sm danger" data-delr>Eliminar receta</button></div>'+
  '<p class="note">Marca “Se incluye en Compras” en las categorías que compras para cada pedido (ingredientes, cajas, decoración). Desmárcalo en gastos como gas o luz: igual suman al costo de la receta, pero no aparecen en la lista de Compras. La mano de obra no va aquí: se calcula sola con el tiempo de la receta.'+(window.NO_ING?'':' Los ingredientes se eligen de tu lista de <button class="lnk" data-v="ing">Ingredientes</button>; su unidad y precio se cambian allá.')+'</p>'+
  '<div class="scroll"><table class="rtab"><colgroup><col><col class="c-q"><col class="c-u"><col class="c-c"><col class="c-s"><col class="c-x"></colgroup><thead><tr><th>Ítem</th><th class="r">Cantidad</th><th>Unidad</th><th class="r">Costo unidad</th><th class="r">Subtotal</th><th></th></tr></thead><tbody>'+g+'<tr class="tot"><td colspan="4">Costo total</td><td class="r" id="rtot"></td><td></td></tr></tbody></table></div></section>'+
  '<div class="grid" style="align-content:start"><section class="card" id="rsum">'+rskel()+'</section></div></div>';
}
function rsum(){
  var ci=rtot(),lab=labor(rp),c=ci+lab,un=rp.un||1,cu=c/un,u1=udPl(rp,1),vh=vhora();
  if($("#rtot"))$("#rtot").textContent=$$(ci);
  if($("#kc"))$("#kc").textContent=$$(ci);
  if($("#ktot")){$("#klab").textContent=$$(lab);$("#ktot").textContent=$$(c);$("#kcul").textContent="Costo por "+u1;$("#kcu").textContent=$$u(cu)}
  var mc=$("#mocalc");if(mc){var t;
    if(hasH(rp))t='<b>Esta receta tiene “Horas de trabajo” como ítem.</b> Ahora la mano de obra se calcula con el tiempo de trabajo con manos. Quita ese ítem para no contarla dos veces. <button class="btn ghost sm" data-qhoras>Quitar el ítem de horas</button>';
    else if(!vh)t='Falta el valor de la hora de trabajo. <button class="lnk" data-equipo>Calcúlalo aquí</button> y la mano de obra se suma sola.';
    else if(!rp.ta)t='Anota el <b>trabajo con manos</b> para sumar la mano de obra al costo.';
    else t='<b>Mano de obra de la receta completa</b> = '+hmin(rp.ta)+' de trabajo con manos × '+$$(vh)+' por hora = <b>'+$$(lab)+'</b>.'+
      (un>1?'<br>La receta rinde '+fq(un)+' '+esc(udPl(rp,un))+': '+$$(lab)+' ÷ '+fq(un)+' = <b>'+$$u(lab/un)+' de mano de obra por '+esc(u1)+'</b>.':'<br><span class="neg">Esta receta rinde 1 unidad, así que toda la mano de obra se carga a 1 '+esc(u1)+'.</span> Si la receta completa hace más (ej.: 12 alfajores), cambia <b>Unidades que rinde</b> y <b>Se vende por</b>.');
    mc.innerHTML=t;mc.className="mocalc"+(hasH(rp)?" warn":"")}
  var tp=$("#tpu");if(tp){var ta=+rp.ta||0,te=+rp.te||0;tp.innerHTML=un>1&&(ta||te)?'Por '+esc(u1)+': '+(ta?fq(Math.round(ta/un*10)/10)+' min de trabajo con manos':'')+(ta&&te?' · ':'')+(te?fq(Math.round(te/un*10)/10)+' min de horno o reposo':''):'';tp.hidden=!tp.innerHTML}
  if($("#hv"))$("#hv").textContent=$$(vh);
  if($("#psum"))psum();
}
function hmInputs(id,min,lbl,desc){min=Math.round(+min||0);
  return '<div class="tblk"><div class="tbh"><b>'+lbl+'</b><span class="note" style="margin:0">'+desc+'</span></div><div class="thm"><label>Horas<input type="number" id="'+id+'_h" min="0" step="1" inputmode="numeric" value="'+(min?Math.floor(min/60):'')+'" placeholder="0"></label><label>Minutos<input type="number" id="'+id+'_m" min="0" max="59" step="5" inputmode="numeric" value="'+(min?min%60:'')+'" placeholder="0"></label></div></div>'}
function rskel(){
  if(window.NO_P2)return '<h2 style="font-size:1.38rem">Costo de la receta</h2><dl class="kv" style="margin-top:12px"><dt>Costo de la receta</dt><dd id="kc"></dd></dl><p class="note">Los precios de venta se definen en <button class="lnk" data-v="pre">Precios</button>.</p>';
  return '<h2 style="font-size:1.38rem">Costo de la receta</h2><p class="note" style="margin-top:2px">Ingredientes + mano de obra, para la receta completa. Los precios de venta se definen en <button class="lnk" data-v="pre">Precios</button>.</p>'+
   '<h3 class="rsec">Tiempo de producción</h3><p class="note" style="margin-top:2px">De la receta completa: una tanda'+((rp.un||1)>1?' de '+fq(rp.un)+' '+esc(udPl(rp,rp.un)):'')+'.</p>'+
   hmInputs("ta",rp.ta,"Trabajo con manos","Preparar, armar, decorar y envasar. Es lo que se paga como mano de obra.")+
   hmInputs("te",rp.te,"Horno o reposo","Horno, frío o levado. No suma mano de obra: sirve para planificar Producción.")+
   '<p class="note" id="tpu" style="margin:8px 0 0"></p>'+
   '<h3 class="rsec">Costo</h3><dl class="kv"><dt>Ingredientes y otros</dt><dd id="kc"></dd><dt>Mano de obra</dt><dd id="klab"></dd><dt><b>Costo de la receta</b></dt><dd><b id="ktot"></b></dd><dt id="kcul">Costo por unidad</dt><dd id="kcu"></dd></dl>'+
   '<div class="mocalc" id="mocalc"></div>'+
   '<div class="rcact"><button class="btn ghost sm" data-equipo>Valor de la hora: <b id="hv" style="margin-left:4px"></b></button><button class="btn sm" data-v="pre">Ver precios de venta</button></div>';
}
/* ---------- detalle de precio de un producto (desde Precios) ---------- */
function openPre(id){selR(id);var d=$("#dlg"),u1=udPl(rp,1);
  d.innerHTML='<div class="dlg" id="psum"><header><div><h2 style="font-size:1.62rem">'+esc(rp.nombre)+'</h2><div class="note" style="margin:2px 0 0">Precio por '+esc(u1)+' · costo por '+esc(u1)+' <b id="pcu"></b></div></div><button type="button" class="ib" data-close aria-label="Cerrar">✕</button></header>'+
   '<section class="psec pmn"><h3>Minorista · a público <span class="tg">con IVA</span></h3>'+
   '<label class="prg">Margen que quieres ganar: <b id="mgv"></b><input type="range" id="mg" min="0" max="90" value="'+(+rp.margen||0)+'"></label>'+
   '<div class="kv2"><span>Precio sugerido</span><b id="sug"></b></div><div class="note" style="margin:0" id="sugn"></div>'+
   '<label class="plab">Tu precio por '+esc(u1)+' (con IVA)<input type="text" class="money" inputmode="numeric" id="pa" value="'+mfmt(rp.precio)+'"></label>'+
   '<p style="margin:8px 0 0;font-weight:600">Margen real: <span id="real"></span> · ganancia <span id="realg"></span> por '+esc(u1)+'</p><p style="margin:4px 0 0"><button class="lnk" data-usesug="min">Usar el precio sugerido</button></p></section>'+
   (window.NO_P2?'':'<section class="psec pmy"><h3>Mayorista · cafeterías y reventa <span class="tg">neto + IVA</span></h3>'+
   '<label class="prg">Margen mayorista: <b id="mgmv"></b><input type="range" id="mgm" min="0" max="75" value="'+(rp.mm==null?45:rp.mm)+'"></label>'+
   '<div class="kv2"><span>Precio sugerido</span><b id="msug"></b></div><div class="note" style="margin:0" id="msugn"></div>'+
   (window.NO_PM?'':'<label class="plab">Tu precio mayorista por '+esc(u1)+' (neto)<input type="text" class="money" inputmode="numeric" id="pmy" value="'+mfmt(rp.pm||0)+'"></label><p style="margin:8px 0 0;font-weight:600" id="mreal"></p><p style="margin:4px 0 0"><button class="lnk" data-usesug="may">Usar el precio sugerido</button></p>')+
   '<dl class="kv" style="margin-top:10px"><dt>Costo con packaging</dt><dd id="mcu"></dd><dt>Ganancia por unidad (sugerido)</dt><dd id="mg1"></dd></dl><div class="mmin" id="mmin"></div>'+
   '<div class="f" style="margin-top:10px"><label>Packaging mayorista por '+esc(u1)+'<input type="text" class="money" inputmode="numeric" id="mpk" placeholder="General: '+$$(MAY.pack)+'" value="'+(rp.mpk===""||rp.mpk==null?"":mfmt(rp.mpk))+'"></label><label>Despacho por pedido<input type="text" class="money" inputmode="numeric" id="mds" placeholder="General: '+$$(MAY.desp)+'" value="'+(rp.mds===""||rp.mds==null?"":mfmt(rp.mds))+'"></label></div>'+
   '<p class="note" style="margin-top:4px">Vacío = usa el valor general de <button class="lnk" data-v="cfg">Ajustes</button>.</p></section>')+
   '<div style="display:flex;justify-content:flex-end"><button type="button" class="btn" data-close>Listo</button></div></div>';
  if(!d.open)d.showModal();psum();
}
function psum(){
  var c=costTanda(rp),un=rp.un||1,cu=c/un,m=(+rp.margen||0)/100,netoU=m<1?cu/(1-m):0,sug=redon(netoU*IVA),u1=udPl(rp,1),pn=(+rp.precio||0)/IVA,real=pn>0?(pn-cu)/pn*100:0;
  $("#pcu").textContent=$$u(cu);$("#mgv").textContent=(+rp.margen||0)+"%";
  $("#sug").textContent=$$(sug);$("#sugn").textContent="con IVA · neto "+$$(netoU)+" · ganancia "+$$(netoU-cu)+" por "+u1;
  var r=$("#real");r.textContent=pn>0?real.toFixed(1)+"%":"—";r.className=real>=(+rp.margen||0)?"pos":"neg";$("#realg").textContent=$$(pn-cu);
  if($("#msug")){var mc=mayCalc(rp);$("#mgmv").textContent=(rp.mm==null?45:rp.mm)+"%";
    $("#msug").textContent=$$(mc.neto)+" neto";$("#msugn").textContent=$$(Math.round(mc.neto*IVA))+" con IVA"+(sug>0?(mc.neto*IVA<sug?" · "+Math.round((1-mc.neto*IVA/sug)*100)+"% menos que a público":" · ⚠ queda más caro que a público: baja el margen mayorista"):"");
    $("#mcu").textContent=$$u(mc.cuM);$("#mg1").textContent=$$(mc.g);
    var t;if(mc.g<=0)t='<b class="neg">Con este margen pierdes plata en cada '+esc(u1)+'.</b> Sube el margen mayorista.';
    else if(!mc.F)t='No tienes costos por pedido mayorista. Configúralos en <button class="lnk" data-v="cfg">Ajustes</button> (despacho, coordinación, factura) para calcular el mínimo.';
    else t='Cada pedido mayorista te cuesta '+$$(mc.F)+' (despacho '+$$(mc.desp)+(MAY.coord?' + coordinación '+fq(MAY.coord)+' h':'')+').<br><b>Punto de equilibrio: '+fq(mc.eq)+' '+esc(udPl(rp,mc.eq))+'.</b> Bajo esa cantidad, el pedido no deja ganancia.<br><b>Mínimo recomendado: '+fq(mc.rec)+' '+esc(udPl(rp,mc.rec))+'</b>, así el despacho y la coordinación se comen menos del 20% de tu ganancia.';
    $("#mmin").innerHTML=t;
    var mr=$("#mreal");if(mr){var pm=+rp.pm||0;mr.innerHTML=pm?'Margen real mayorista: <span class="'+((pm-mc.cuM)/pm*100>=(rp.mm==null?45:rp.mm)?'pos':'neg')+'">'+((pm-mc.cuM)/pm*100).toFixed(1)+'%</span> · ganancia '+$$(pm*(1-(+MAY.fact||0)/100)-mc.cuM)+' por '+esc(u1):'<span class="note" style="margin:0">Sin precio mayorista: en los pedidos mayoristas el precio quedará en $ 0 hasta que lo anotes.</span>'}}
}
/* ---------- PRECIOS ---------- */
function preM(r){var un=r.un||1,cu=costTanda(r)/un,m=(+r.margen||0)/100,sug=m<1?redon(cu/(1-m)*IVA):0,pn=(+r.precio||0)/IVA,mc=mayCalc(r),pm=+r.pm||0;
  return {cu:cu,sug:sug,real:pn>0?(pn-cu)/pn*100:null,mc:mc,mreal:pm>0?(pm-mc.cuM)/pm*100:null}}
function realTxt(v,obj){return v==null?'<span class="note" style="margin:0">sin precio</span>':'margen real <span class="'+(v>=obj?'pos':'neg')+'">'+fq(Math.round(v*10)/10)+'%</span>'}
var PQ="";
function preRow(r){var k=preM(r),u1=udPl(r,1),mm=r.mm==null?45:+r.mm,hid=PQ&&xNorm(r.nombre).indexOf(xNorm(PQ))<0;
  return '<tr data-prow="'+r.id+'"'+(hid?' hidden':'')+'><td data-l="Producto"><button type="button" class="prn" data-preopen="'+r.id+'"><b>'+esc(r.nombre)+'</b><span>por '+esc(u1)+' · rinde '+fq(r.un||1)+'</span></button></td>'+
  '<td class="r" data-l="Costo por '+esc(u1)+'"><span class="pcv">'+$$u(k.cu)+'</span></td>'+
  '<td class="r pmn" data-l="Margen %"><span class="pin"><input type="number" min="0" max="95" step="1" inputmode="numeric" data-pmg="'+r.id+'" value="'+(+r.margen||0)+'" aria-label="Margen minorista de '+esc(r.nombre)+'"></span></td>'+
  '<td class="r pmn" data-l="Sugerido con IVA"><span class="psv" id="psg'+r.id+'">'+$$(k.sug)+'</span><button type="button" class="lnk" data-puse="min:'+r.id+'">usar</button></td>'+
  '<td class="r pmn" data-l="Tu precio con IVA"><input type="text" class="money" inputmode="numeric" data-ppa="'+r.id+'" value="'+mfmt(r.precio||0)+'" aria-label="Precio minorista con IVA de '+esc(r.nombre)+'"><small class="prl" id="prl'+r.id+'">'+realTxt(k.real,+r.margen||0)+'</small></td>'+
  (window.NO_P2?'':'<td class="r pmy" data-l="Margen %"><span class="pin"><input type="number" min="0" max="95" step="1" inputmode="numeric" data-pmm="'+r.id+'" value="'+mm+'" aria-label="Margen mayorista de '+esc(r.nombre)+'"></span></td>'+
  '<td class="r pmy" data-l="Sugerido neto"><span class="psv" id="psm'+r.id+'">'+$$(k.mc.neto)+'</span><button type="button" class="lnk" data-puse="may:'+r.id+'">usar</button></td>'+
  (window.NO_PM?'':'<td class="r pmy" data-l="Tu precio neto"><input type="text" class="money" inputmode="numeric" data-ppm="'+r.id+'" value="'+mfmt(r.pm||0)+'" aria-label="Precio mayorista neto de '+esc(r.nombre)+'"><small class="prl" id="prm'+r.id+'">'+realTxt(k.mreal,mm)+'</small></td>'))+'</tr>'}
function preUpd(id){var r=recipes.find(function(q){return q.id===id});if(!r)return;var k=preM(r),e;
  if(e=$("#psg"+id))e.textContent=$$(k.sug);if(e=$("#prl"+id))e.innerHTML=realTxt(k.real,+r.margen||0);
  if(e=$("#psm"+id))e.textContent=$$(k.mc.neto);if(e=$("#prm"+id))e.innerHTML=realTxt(k.mreal,r.mm==null?45:+r.mm)}
function vPre(){
  var lupa='<label class="rsearch"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><input type="search" id="pq" placeholder="Buscar producto" aria-label="Buscar producto" value="'+esc(PQ)+'"></label>';
  var top=head("Precios",(recipes.length?lupa+'<button class="btn ghost" data-prex>Excel</button>':'')+'<button class="btn ghost" data-equipo>Valor hora '+$$(vhora())+'</button>');
  if(!recipes.length)return top+'<div class="card empty">Primero crea tus productos en <button class="lnk" data-v="cost">Recetas</button>: ahí se calcula su costo. Después defines aquí sus precios de venta.</div>';
  var info='<div class="card preinfo"><div><span class="tg tmin">Minorista</span> Precio a público: escríbelo <b>con IVA</b> (bruto), lo que paga tu cliente.</div>'+(window.NO_P2?'':'<div><span class="tg tmay">Mayorista</span> Cafeterías y reventa: escríbelo <b>neto</b>. El IVA se suma en el pedido.</div>')+
   '<p class="note" style="margin:6px 0 0">El <b>costo por unidad</b> viene de Recetas (ingredientes + mano de obra). <b>Sugerido</b> = costo ÷ (1 − margen), redondeado. Cambia el margen y el sugerido se recalcula; toca <b>usar</b> para copiarlo a tu precio. Toca un producto para ver el detalle mayorista (packaging y pedido mínimo).</p></div>';
  var rows=recipes.slice().sort(function(a,b){return String(a.nombre||"").localeCompare(String(b.nombre||""),"es",{sensitivity:"base",numeric:true})}).map(preRow).join("");
  var th=function(t,sub,cl){return '<th class="r '+cl+'">'+t+'<small>'+(sub||'&nbsp;')+'</small></th>'},nm=3,ny=window.NO_P2?0:(window.NO_PM?2:3);
  return top+info+'<section class="card prewrap"><div class="scroll"><table class="prtab"><colgroup><col class="c-p"><col class="c-c"><col class="c-m"><col class="c-s"><col class="c-t">'+(ny?'<col class="c-m"><col class="c-s">'+(ny>2?'<col class="c-t">':''):'')+'</colgroup>'+
    '<thead><tr class="pgh"><th colspan="2"></th><th colspan="'+nm+'" class="pmn"><span class="tg tmin">Minorista</span> a público · con IVA</th>'+(ny?'<th colspan="'+ny+'" class="pmy"><span class="tg tmay">Mayorista</span> cafeterías · neto</th>':'')+'</tr>'+
    '<tr><th>Producto<small>&nbsp;</small></th><th class="r">Costo<small>por unidad</small></th>'+
    th("Margen","%","pmn")+th("Sugerido","con IVA","pmn")+th("Tu precio","con IVA","pmn")+
    (window.NO_P2?'':th("Margen","%","pmy")+th("Sugerido","neto","pmy")+(window.NO_PM?'':th("Tu precio","neto","pmy")))+
    '</tr></thead><tbody>'+rows+'</tbody></table></div><p class="note" id="pnone" style="margin:8px 0 0"'+(recipes.some(function(r){return !PQ||xNorm(r.nombre).indexOf(xNorm(PQ))>=0})?' hidden':'')+'>No hay productos con ese nombre.</p></section>';
}
document.addEventListener("input",function(e){var t=e.target,d=t.dataset||{},id;
  if(t.id==="pq"){PQ=t.value;var n=0;document.querySelectorAll("[data-prow]").forEach(function(tr){var r=recipes.find(function(q){return q.id===+tr.dataset.prow});var h=PQ&&r&&xNorm(r.nombre).indexOf(xNorm(PQ))<0;tr.hidden=!!h;if(!h)n++});var pn=$("#pnone");if(pn)pn.hidden=!!n;return}
  id=+(d.pmg||d.pmm||d.ppa||d.ppm||0);if(!id)return;var r=recipes.find(function(q){return q.id===id});if(!r)return;
  if(d.pmg)r.margen=Math.min(95,Math.max(0,parseFloat(t.value)||0));else if(d.pmm)r.mm=Math.min(95,Math.max(0,parseFloat(t.value)||0));else if(d.ppa)r.precio=mnum(t.value);else if(d.ppm)r.pm=mnum(t.value);
  preUpd(id)});
document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("[data-puse],[data-preopen],[data-prex],[data-equipo],[data-qhoras]");if(!t)return;
  if(t.dataset.preopen){openPre(+t.dataset.preopen);return}
  if(t.hasAttribute("data-prex")){openPreX();return}
  if(t.hasAttribute("data-equipo")){openEq();return}
  if(t.hasAttribute("data-qhoras")){var n=rp.items.length;rp.items=rp.items.filter(function(it){return String(it.u||"").trim().toLowerCase()!=="h"});recipe=rp.items;render();toast("Ítem de horas quitado ("+(n-rp.items.length)+")");return}
  var a=t.dataset.puse.split(":"),r=recipes.find(function(q){return q.id===+a[1]});if(!r)return;var k=preM(r);
  if(a[0]==="min"){r.precio=k.sug;var i=document.querySelector('[data-ppa="'+r.id+'"]');if(i)i.value=mfmt(r.precio)}else{r.pm=k.mc.neto;var j=document.querySelector('[data-ppm="'+r.id+'"]');if(j)j.value=mfmt(r.pm)}
  preUpd(r.id);toast("Precio de “"+r.nombre+"” actualizado")});
/* ---------- valor de la hora (equipo) ---------- */
function openEq(){var d=$("#dlg");if(!EQ.length)EQ.push({n:"Tú",s:Math.round(hora.sueldo||0),h:hora.horas?Math.round(hora.horas/SEM):45});
  d.innerHTML='<div class="dlg eqdlg"><header><h2 style="font-size:1.62rem">Valor de la hora de trabajo</h2><button type="button" class="ib" data-close aria-label="Cerrar">✕</button></header>'+
   '<p style="margin:0">Anota a cada persona que trabaja en la producción, <b>incluido tú</b>: lo que gana al mes y las horas que trabaja a la semana. Dulcia calcula cuánto cuesta, en promedio, <b>1 hora de trabajo</b> de tu equipo.</p>'+
   '<div class="scroll"><table class="eqtab"><thead><tr><th>Persona</th><th class="r">Sueldo al mes</th><th class="r">Horas a la semana</th><th class="r">Valor de su hora</th><th></th></tr></thead><tbody id="eqrows"></tbody></table></div>'+
   '<div><button type="button" class="btn ghost sm" data-eqadd>+ Agregar persona</button></div><div class="eqres" id="eqres"></div>'+
   '<p class="note" style="margin:0">Este valor se usa para la mano de obra de cada receta (trabajo con manos × valor de la hora) y para la coordinación de los pedidos mayoristas. No cambia tus Gastos: los sueldos los sigues anotando allá.</p>'+
   '<div style="display:flex;justify-content:flex-end"><button type="button" class="btn" data-close>Listo</button></div></div>';
  eqRender();if(!d.open)d.showModal()}
function eqRender(){var b=$("#eqrows");if(!b)return;
  b.innerHTML=EQ.map(function(p,i){return '<tr><td data-l="Persona"><input type="text" data-eqn="'+i+'" value="'+esc(p.n||"")+'" placeholder="Nombre" aria-label="Nombre"></td><td class="r" data-l="Sueldo al mes"><input type="text" class="money" inputmode="numeric" data-eqs="'+i+'" value="'+mfmt(p.s||0)+'" aria-label="Sueldo al mes"></td><td class="r" data-l="Horas a la semana"><input type="number" min="0" max="80" step="1" inputmode="numeric" data-eqh="'+i+'" value="'+(+p.h||"")+'" placeholder="45" aria-label="Horas a la semana"></td><td class="r" data-l="Valor de su hora"><span id="eqv'+i+'"></span></td><td><button type="button" class="x" data-eqdel="'+i+'" aria-label="Quitar persona"'+(EQ.length<2?' hidden':'')+'>✕</button></td></tr>'}).join("");eqRes()}
function eqRes(){eqSync();EQ.forEach(function(p,i){var e=$("#eqv"+i);if(e)e.textContent=+p.h?$$(p.s/(p.h*SEM)):"—"});
  var r=$("#eqres");if(!r)return;var S=eqS(),H=eqHM(),v=vhora();
  r.innerHTML='<div class="eqbig"><span>1 hora de trabajo cuesta</span><b>'+$$(v)+'</b></div>'+
   '<p class="note" style="margin:6px 0 0">Sueldos al mes: <b>'+$$(S)+'</b> · Horas al mes: <b>'+fq(Math.round(H))+' h</b> (horas a la semana × 4,33)<br>Cálculo: '+$$(S)+' ÷ '+fq(Math.round(H))+' h = <b>'+$$(v)+' por hora</b>.</p>'+
   (v?'<div class="ej" style="margin-top:8px">Ejemplo: una receta con 1 h 30 min de trabajo con manos suma 1,5 × '+$$(v)+' = <b>'+$$(1.5*v)+'</b> de mano de obra.</div>':'')}
document.addEventListener("input",function(e){var t=e.target,d=t.dataset||{};
  if(d.eqn!=null){EQ[+d.eqn].n=t.value;return}
  if(d.eqs!=null){EQ[+d.eqs].s=mnum(t.value);eqRes();return}
  if(d.eqh!=null){EQ[+d.eqh].h=Math.max(0,parseFloat(t.value)||0);eqRes();return}
  var m=/^(ta|te)_(h|m)$/.exec(t.id||"");if(m&&rp){var h=Math.max(0,parseFloat($("#"+m[1]+"_h").value)||0),mi=Math.max(0,parseFloat($("#"+m[1]+"_m").value)||0);rp[m[1]]=Math.round(h*60+mi);rsum()}});
document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("[data-eqadd],[data-eqdel]");if(!t)return;
  if(t.hasAttribute("data-eqadd")){EQ.push({n:"",s:0,h:45});eqRender();var l=document.querySelectorAll("[data-eqn]");if(l.length)l[l.length-1].focus();return}
  EQ.splice(+t.dataset.eqdel,1);eqRender()});
/* ---------- PRECIOS EN EXCEL ---------- */
var PRH=["Producto","Se vende por","Costo por unidad","Margen minorista %","Precio sugerido minorista (con IVA)","Precio minorista (con IVA)","Margen mayorista %","Precio sugerido mayorista (neto)","Precio mayorista (neto)"];
function openPreX(){var d=$("#dlg");
  d.innerHTML='<div class="dlg"><header><h2 style="font-size:1.62rem">Precios en Excel</h2><button type="button" class="ib" data-close aria-label="Cerrar">✕</button></header>'+
  '<ol style="margin:0;padding-left:20px;line-height:1.6"><li>Descarga tus precios y ábrelos en Excel o Google Sheets.</li><li>Cambia los márgenes o los precios: <b>minorista con IVA</b> y <b>mayorista neto</b>. Para usar un sugerido, cópialo a la columna de precio.</li><li>Súbelo aquí. Antes de cargar te mostramos qué cambia.</li></ol>'+
  '<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn ghost" data-prexls>Descargar mis precios ('+recipes.length+')</button><label class="btn" style="cursor:pointer">Subir mi Excel<input type="file" id="preimp" accept=".xlsx,.xls,.csv" hidden></label></div>'+
  '<p class="note" style="margin:0">Cada fila se busca por el nombre del producto (como está en Recetas). <b>Las celdas vacías no cambian nada.</b> El costo y los sugeridos son solo de referencia: se calculan en Dulcia.</p><div id="premsg"></div></div>';
  if(!d.open)d.showModal()}
function preExcel(){xlsxLib().then(function(X){
  var rows=recipes.slice().sort(function(a,b){return a.nombre.localeCompare(b.nombre,"es")}).map(function(r){var k=preM(r);return [r.nombre,udPl(r,1),Math.round(k.cu),+r.margen||0,k.sug,Math.round(+r.precio||0),r.mm==null?45:+r.mm,k.mc.neto,Math.round(+r.pm||0)]});
  var ws=X.utils.aoa_to_sheet([PRH].concat(rows));ws["!cols"]=[28,14,14,12,18,18,12,18,18].map(function(w){return {wch:w}});
  var wb=X.utils.book_new();X.utils.book_append_sheet(wb,ws,"Precios");X.writeFile(wb,"Precios_Dulcia.xlsx");toast(rows.length+" precios descargados")}).catch(function(e){toast(e.message||"No se pudo crear el Excel")})}
function preParse(buf,X){
  var wb=X.read(buf,{type:"array",raw:true}),ws=wb.Sheets["Precios"]||wb.Sheets[wb.SheetNames[0]],aoa=X.utils.sheet_to_json(ws,{header:1,defval:"",raw:true}),hi=-1,col={};
  for(var i=0;i<Math.min(aoa.length,15)&&hi<0;i++){if(aoa[i].map(xNorm).indexOf("producto")>=0)hi=i}
  if(hi<0)throw new Error("No encontramos la columna “Producto”. Usa el Excel que descargas aquí.");
  aoa[hi].forEach(function(h,j){var k=xNorm(h);var m={producto:"n",margenminorista:"mg",preciominoristaconiva:"pa",margenmayorista:"mm",preciomayoristaneto:"pm"}[k];if(m&&col[m]==null)col[m]=j});
  var out=[],err=[];
  for(var r=hi+1;r<aoa.length;r++){var row=aoa[r],g=function(k){return col[k]==null?"":row[col[k]]};var n=String(g("n")||"").trim();if(!n)continue;
    var rc=recipes.find(function(q){return xNorm(q.nombre)===xNorm(n)});if(!rc){err.push("Fila "+(r+1)+": “"+n+"” no existe en Recetas.");continue}
    var ch={},f=function(k,v,max){if(String(v).trim()==="")return;var x=xNum(v);if(isNaN(x)||x<0||(max&&x>max)){err.push("Fila "+(r+1)+" ("+n+"): valor “"+v+"” no válido.");return}ch[k]=k==="mg"||k==="mm"?Math.round(x*10)/10:Math.round(x)};
    f("mg",g("mg"),95);f("pa",g("pa"));f("mm",g("mm"),95);f("pm",g("pm"));
    var dif=[];if(ch.mg!=null&&ch.mg!==(+rc.margen||0))dif.push("margen min. "+fq(ch.mg)+"%");if(ch.pa!=null&&ch.pa!==Math.round(+rc.precio||0))dif.push("minorista "+$$(ch.pa));if(ch.mm!=null&&ch.mm!==(rc.mm==null?45:+rc.mm))dif.push("margen may. "+fq(ch.mm)+"%");if(ch.pm!=null&&ch.pm!==Math.round(+rc.pm||0))dif.push("mayorista "+$$(ch.pm)+" neto");
    if(dif.length)out.push({r:rc,ch:ch,dif:dif})}
  return {rows:out,err:err}}
function prePreview(res){window._preres=res;var m=$("#premsg");
  m.innerHTML='<div class="card" style="padding:12px 14px;margin-top:6px"><b>'+(res.rows.length?res.rows.length+' producto'+(res.rows.length===1?'':'s')+' con cambios':'No hay cambios')+'</b>'+
  (res.rows.length?'<div class="scroll" style="max-height:220px;margin-top:6px"><table class="pg"><tbody>'+res.rows.map(function(x){return '<tr><td>'+esc(x.r.nombre)+'</td><td>'+esc(x.dif.join(" · "))+'</td></tr>'}).join("")+'</tbody></table></div>':'')+
  (res.err.length?'<div class="qbox" style="margin-top:8px">'+res.err.slice(0,12).map(esc).join("<br>")+(res.err.length>12?'<br>…y '+(res.err.length-12)+' más':'')+'</div>':'')+
  (res.rows.length?'<button class="btn" style="margin-top:10px" data-preimport>Cargar</button>':'')+'</div>'}
function preImport(){var res=window._preres;if(!res)return;res.rows.forEach(function(x){var c=x.ch;if(c.mg!=null)x.r.margen=c.mg;if(c.pa!=null)x.r.precio=c.pa;if(c.mm!=null)x.r.mm=c.mm;if(c.pm!=null)x.r.pm=c.pm});
  window._preres=null;$("#dlg").close();render();toast(res.rows.length+" producto"+(res.rows.length===1?"":"s")+" actualizado"+(res.rows.length===1?"":"s"))}
document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("[data-prexls],[data-preimport]");if(!t)return;if(t.hasAttribute("data-prexls"))preExcel();else preImport()});
document.addEventListener("change",function(e){var t=e.target;if(t.id!=="preimp"||!t.files||!t.files[0])return;var f=t.files[0],m=$("#premsg");if(m)m.innerHTML='<p class="note">Leyendo '+esc(f.name)+'…</p>';
  Promise.all([xlsxLib(),f.arrayBuffer()]).then(function(a){prePreview(preParse(a[1],a[0]))}).catch(function(err){if(m)m.innerHTML='<div class="qbox">'+esc(err.message||"No pudimos leer el archivo.")+'</div>'});t.value=""});
function openNewR(){
  var d=$("#dlg");
  d.innerHTML='<form class="dlg" id="newrf"><header><h2 style="font-size:1.62rem">Nueva receta</h2><button type="button" class="ib" data-close aria-label="Cerrar">✕</button></header>'+
  '<div class="f"><label class="w">Nombre<input type="text" id="nr_n" required placeholder="Ej.: Brownies (bandeja)"></label><label class="w">Rinde<input type="text" id="nr_r" placeholder="Ej.: 20 porciones"></label>'+
  '<label class="w">Copiar ingredientes de<select id="nr_c"><option value="">Empezar en blanco</option>'+recipes.map(function(r){return '<option value="'+r.id+'">'+esc(r.nombre)+'</option>'}).join("")+'</select></label></div>'+
  '<div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn ghost" data-close>Cancelar</button><button class="btn" type="submit">Crear receta</button></div></form>';
  d.showModal();
}
function delR(){
  var i=recipes.findIndex(function(r){return r.id===curR}); if(i<0)return;
  var r=recipes.splice(i,1)[0], lines=[];
  orders.forEach(function(o){(o.items||[]).slice().forEach(function(l,k){if(l.rid===r.id){lines.push({o:o,l:l,k:k});o.items.splice(o.items.indexOf(l),1)}})});
  if(recipes.length)selR(recipes[Math.min(i,recipes.length-1)].id);else{recipe=[];rp={nombre:"",rinde:"",margen:70,precio:0}}
  toast("Receta “"+r.nombre+"” eliminada",function(){recipes.splice(i,0,r);lines.forEach(function(z){z.o.items.splice(Math.min(z.k,z.o.items.length),0,z.l)});selR(r.id)});
}


/* ---------- RECETAS DESDE EXCEL ---------- */
function xlsxLib(){return window.XLSX?Promise.resolve(window.XLSX):new Promise(function(ok,ko){var sc=document.createElement("script");sc.src="xlsx.mini.min.js";sc.onload=function(){window.XLSX?ok(window.XLSX):ko(new Error("x"))};sc.onerror=function(){ko(new Error("No se pudo abrir el lector de Excel. Revisa tu conexión."))};document.head.appendChild(sc)})}
var XCOLS=["Receta","Rinde","Margen %","Categoría de costo","Ítem","Cantidad","Unidad","Costo por unidad","Se compra"];
function openXlsx(){
  var d=$("#dlg");
  d.innerHTML='<div class="dlg"><header><h2 style="font-size:1.62rem">Cargar recetas desde Excel</h2><button type="button" class="ib" data-close aria-label="Cerrar">✕</button></header>'+
  '<ol style="margin:0;padding-left:20px;line-height:1.6"><li>Descarga la plantilla y ábrela en Excel o Google Sheets.</li><li>Escribe una fila por cada ingrediente, caja o decoración. Repite el nombre de la receta en cada fila.</li><li>Guárdala y súbela aquí. Antes de cargar te mostramos lo que vamos a importar.</li></ol>'+
  '<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn ghost" data-xtpl>Descargar plantilla</button><label class="btn" style="cursor:pointer">Subir mi Excel<input type="file" id="ximp" accept=".xlsx,.xls,.csv" hidden></label></div>'+
  (recipes.length?'<div style="border-top:1px dashed var(--line);padding-top:12px"><button type="button" class="btn ghost sm" data-xexp>Descargar mis recetas ('+recipes.length+')</button><p class="note" style="margin:6px 0 0">Bajan en el mismo formato de la plantilla: puedes corregirlas en Excel y volver a subirlas.</p></div>':'')+
  '<p class="note" style="margin:0">Si una receta ya existe con el mismo nombre, se reemplazan sus ítems. Se aceptan archivos .xlsx, .xls y .csv.</p><div id="xmsg"></div></div>';
  if(!d.open)d.showModal();
}
function xTemplate(){
  xlsxLib().then(function(X){
    var E1="Ejemplo: Torta tres leches", E2="Ejemplo: Brownies (bandeja)";
    var rows=[XCOLS,
      [E1,"20 cm · 12 porciones",35,"Ingredientes","Harina",0.25,"kg",1200,"Sí"],
      [E1,"","","Ingredientes","Huevos",6,"un",250,"Sí"],
      [E1,"","","Ingredientes","Leche condensada",1,"un",2800,"Sí"],
      [E1,"","","Ingredientes","Crema",0.5,"L",7000,"Sí"],
      [E1,"","","Empaque y decoración","Caja",1,"un",1500,"Sí"],
      [E2,"20 porciones",50,"Ingredientes","Chocolate 54%",0.3,"kg",9000,"Sí"],
      [E2,"","","Ingredientes","Mantequilla",0.2,"kg",9500,"Sí"],
      [E2,"","","Ingredientes","Huevos",4,"un",250,"Sí"]];
    var ws=X.utils.aoa_to_sheet(rows); ws["!cols"]=[{wch:28},{wch:22},{wch:10},{wch:24},{wch:22},{wch:10},{wch:8},{wch:16},{wch:10}];
    var ins=[["Cómo llenar la plantilla de recetas de Dulcia"],[""],
      ["1. Una fila por cada ítem de la receta: ingredientes, caja, decoración. La mano de obra NO va aquí: se calcula sola con el tiempo de trabajo de cada receta y el valor de la hora."],
      ["2. Repite el nombre de la receta en todas sus filas. Rinde y Margen % basta con ponerlos en la primera fila de cada receta."],
      ["3. Margen %: margen minorista que quieres ganar, por ejemplo 40. Si lo dejas vacío, queda en 70. También se cambia en Precios."],
      ["4. Categoría de costo: por ejemplo Ingredientes, Empaque y decoración, Gas y luz. Si la dejas vacía, queda en Ingredientes."],
      ["5. Cantidad y Costo por unidad: solo números. El costo es lo que pagas por cada unidad; por ejemplo, el precio de 1 kg."],
      ["6. Se compra: Sí o No. Se aplica a toda la categoría: si un ítem de la categoría dice Sí, esa categoría va a la lista de Compras. Para gas, luz u otros costos que no compras por pedido usa No."],
      ["7. Si una receta ya existe en Dulcia con el mismo nombre, se reemplazan sus ítems."],
      ["8. Borra las filas de ejemplo antes de subir tus recetas."]];
    var wi=X.utils.aoa_to_sheet(ins); wi["!cols"]=[{wch:120}];
    var wb=X.utils.book_new(); X.utils.book_append_sheet(wb,ws,"Recetas"); X.utils.book_append_sheet(wb,wi,"Instrucciones");
    X.writeFile(wb,"Plantilla_recetas_Dulcia.xlsx"); toast("Plantilla descargada");
  }).catch(function(e){toast(e.message)});
}
function xNorm(v){return String(v==null?"":v).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z]/g,"")}
function xNum(v){if(typeof v==="number")return v;var t=String(v==null?"":v).replace(/[\s$%]/g,"");if(!t)return NaN;
  if(t.indexOf(",")>=0)t=t.replace(/\./g,"").replace(",",".");else if(/^\d{1,3}(\.\d{3})+$/.test(t))t=t.replace(/\./g,"");return Number(t)}
function xParse(buf,X){
  var wb=X.read(buf,{type:"array",raw:true}), ws=wb.Sheets["Recetas"]||wb.Sheets[wb.SheetNames[0]];
  var aoa=X.utils.sheet_to_json(ws,{header:1,defval:"",raw:true}), hi=-1, col={};
  for(var i=0;i<Math.min(aoa.length,15)&&hi<0;i++){var h=aoa[i].map(xNorm);if(h.indexOf("receta")>=0&&(h.indexOf("item")>=0||h.indexOf("ingrediente")>=0))hi=i}
  if(hi<0)throw new Error("No encontramos las columnas de la plantilla. Usa la plantilla de Dulcia (debe tener las columnas Receta e Ítem).");
  aoa[hi].forEach(function(h,j){var k=xNorm(h);
    if(k==="receta")col.r=j;else if(k==="rinde")col.ri=j;else if(k.indexOf("margen")===0)col.m=j;else if(k.indexOf("categoria")===0)col.g=j;
    else if(k==="item"||k==="ingrediente")col.n=j;else if(k==="cantidad")col.q=j;else if(k==="unidad")col.u=j;else if(k.indexOf("costo")===0)col.c=j;else if(k.indexOf("secompra")===0||k==="compra")col.b=j});
  var out=[], by={}, errs=[], last="";
  for(var r=hi+1;r<aoa.length;r++){var row=aoa[r], g=function(k){return k==null?"":row[k]};
    if(!row.some(function(v){return String(v).trim()!==""}))continue;
    var nm=String(g(col.r)).trim()||last, it=String(g(col.n)).trim(), fila="Fila "+(r+1)+": ";
    if(!nm){errs.push(fila+"falta el nombre de la receta");continue} last=nm;
    var R=by[nm.toLowerCase()]; if(!R){R=by[nm.toLowerCase()]={nombre:nm,rinde:"",margen:null,items:[],buy:{}};out.push(R)}
    var ri=String(g(col.ri)).trim(); if(ri&&!R.rinde)R.rinde=ri;
    var mg=xNum(g(col.m)); if(!isNaN(mg)&&R.margen==null){if(mg>0&&mg<1)mg=mg*100;R.margen=Math.round(Math.min(95,Math.max(0,mg)))}
    if(!it){if(!ri&&isNaN(mg))errs.push(fila+"falta el nombre del ítem");continue}
    var q=xNum(g(col.q)), c=xNum(g(col.c));
    if(isNaN(q)){errs.push(fila+"la cantidad de “"+it+"” no es un número");continue}
    if(isNaN(c)){errs.push(fila+"el costo de “"+it+"” no es un número");continue}
    var gp=String(g(col.g)).trim()||"Ingredientes", bv=xNorm(g(col.b));
    var buy=bv?!(bv==="no"||bv==="n"||bv==="false"||bv==="0"):!/mano de obra/i.test(gp);
    R.buy[gp]=(R.buy[gp]===true)||buy;
    R.items.push({g:gp,n:it,q:q,u:normU(String(g(col.u)).trim()||"un"),c:c});
  }
  return {recs:out.filter(function(x){return x.items.length}),errs:errs};
}
function xPreview(res){
  window._xres=res; var m=$("#xmsg"); if(!m)return;
  if(!res.recs.length){m.innerHTML='<div class="qbox"><b>No encontramos recetas para cargar.</b>'+(res.errs.length?'<ul style="margin:6px 0 0;padding-left:18px">'+res.errs.slice(0,8).map(function(e){return '<li>'+esc(e)+'</li>'}).join("")+'</ul>':'')+'</div>';return}
  var li=res.recs.map(function(x){var ex=recipes.some(function(q){return q.nombre.trim().toLowerCase()===x.nombre.toLowerCase()}),c=x.items.reduce(function(a,i){return a+i.q*i.c},0);
    return '<tr><td><b>'+esc(x.nombre)+'</b><div class="note" style="margin:0">'+x.items.length+(x.items.length===1?' ítem · ':' ítems · ')+(ex?'reemplaza la existente':'nueva')+'</div></td><td class="r">'+$$(c)+'</td></tr>'}).join("");
  m.innerHTML='<div class="qbox"><b>Vamos a cargar '+res.recs.length+' receta'+(res.recs.length===1?'':'s')+'</b>'+
    '<div class="scroll" style="margin-top:6px"><table><thead><tr><th>Receta</th><th class="r">Costo</th></tr></thead><tbody>'+li+'</tbody></table></div>'+
    (res.errs.length?'<p class="note" style="margin:8px 0 0">Estas filas no se cargan:</p><ul style="margin:4px 0 0;padding-left:18px;font-size:.85rem">'+res.errs.slice(0,8).map(function(e){return '<li>'+esc(e)+'</li>'}).join("")+(res.errs.length>8?'<li>y '+(res.errs.length-8)+' más</li>':'')+'</ul>':'')+
    '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px"><button type="button" class="btn ghost" data-close>Cancelar</button><button type="button" class="btn" data-ximport>Cargar recetas</button></div></div>';
}
function xImport(){
  var res=window._xres; if(!res||!res.recs.length)return; var first=null, cb={};
  res.recs.forEach(function(x){Object.keys(x.buy).forEach(function(k){cb[k]=(cb[k]===true)||x.buy[k]})});
  Object.keys(cb).forEach(function(k){gbuy[k]=cb[k]});
  res.recs.forEach(function(x){
    var ex=recipes.find(function(q){return q.nombre.trim().toLowerCase()===x.nombre.toLowerCase()});
    if(ex){ex.items.length=0;x.items.forEach(function(i){ex.items.push(i)});if(x.rinde)ex.rinde=x.rinde;if(x.margen!=null)ex.margen=x.margen;first=first||ex.id}
    else{var nr={id:rid++,nombre:x.nombre,rinde:x.rinde,margen:x.margen!=null?x.margen:70,precio:0,items:x.items};recipes.push(nr);first=first||nr.id}
  });
  var nIng=0; if(!window.NO_ING){res.recs.forEach(function(x){x.items.forEach(function(it){var ix=ingFind(it.n,it.u);if(ix&&ix.c!==+it.c){ix.e=1;ix.pe=+it.c||0;ingPrice(ix,+it.c||0)}})});nIng=ingSync()}
  window._xres=null; $("#dlg").close(); selR(first); view="cost"; render();
  toast(res.recs.length+" receta"+(res.recs.length===1?" cargada":"s cargadas")+(nIng?" · "+nIng+" ingrediente"+(nIng===1?" nuevo":"s nuevos")+" en tu lista":""));
}
document.addEventListener("click",function(e){var t=e.target.closest("button");if(!t)return;
  if(t.hasAttribute("data-xlsx"))openXlsx();else if(t.hasAttribute("data-xtpl"))xTemplate();else if(t.hasAttribute("data-ximport"))xImport()});
document.addEventListener("change",function(e){var t=e.target;if(t.id!=="ximp"||!t.files||!t.files[0])return;var f=t.files[0],m=$("#xmsg");if(m)m.innerHTML='<p class="note">Leyendo '+esc(f.name)+'…</p>';
  Promise.all([xlsxLib(),f.arrayBuffer()]).then(function(a){xPreview(xParse(a[1],a[0]))}).catch(function(err){if(m)m.innerHTML='<div class="qbox">'+esc(err.message||"No pudimos leer el archivo.")+'</div>'});t.value=""});

function xBook(X,head,rows,widths,ins,name,file){
  var ws=X.utils.aoa_to_sheet([head].concat(rows)); ws["!cols"]=widths.map(function(w){return {wch:w}});
  var wb=X.utils.book_new(); X.utils.book_append_sheet(wb,ws,name);
  if(ins){var wi=X.utils.aoa_to_sheet(ins.map(function(l){return [l]})); wi["!cols"]=[{wch:120}]; X.utils.book_append_sheet(wb,wi,"Instrucciones")}
  X.writeFile(wb,file);
}
function xExportRecetas(){
  xlsxLib().then(function(X){
    var rows=[]; recipes.forEach(function(r){r.items.forEach(function(it,i){
      rows.push([r.nombre,i===0?(r.rinde||""):"",i===0?(+r.margen||0):"",it.g,it.n,+it.q||0,it.u,+it.c||0,gbuy[it.g]===false?"No":"Sí"])})});
    xBook(X,XCOLS,rows,[28,22,10,24,22,10,8,16,10],null,"Recetas","Mis_recetas_Dulcia_"+TODAY+".xlsx"); toast("Recetas descargadas");
  }).catch(function(e){toast(e.message)});
}
/* ---------- GASTOS DESDE / HACIA EXCEL ---------- */
var GCOLS=["Fecha","Gasto","Categoría","Monto","IVA"], GIVA={incl:"Incluido",mas:"Más IVA",no:"Sin IVA"};
var GINS=["Cómo llenar la plantilla de gastos de Dulcia","",
  "1. Una fila por cada gasto.",
  "2. Fecha: día-mes-año, por ejemplo 05-10-2026. También sirve una fecha de Excel.",
  "3. Gasto: qué compraste o pagaste, por ejemplo Harina 25 kg o Arriendo.",
  "4. Categoría: por ejemplo Insumos, Packaging, Servicios, Arriendo. Si no existe en Dulcia, se crea sola.",
  "5. Monto: solo el número, con o sin $ y puntos. Por ejemplo 32.000.",
  "6. IVA: Incluido (el monto ya trae IVA), Más IVA (hay que sumarle IVA) o Sin IVA (sueldos, arriendo de persona, exentos). Si lo dejas vacío, queda como Incluido.",
  "7. Si un gasto ya existe en Dulcia (misma fecha, nombre y monto), no se carga dos veces.",
  "8. Borra las filas de ejemplo antes de subir tus gastos."];
function openGxlsx(){
  var d=$("#dlg");
  d.innerHTML='<div class="dlg"><header><h2 style="font-size:1.62rem">Gastos en Excel</h2><button type="button" class="ib" data-close aria-label="Cerrar">✕</button></header>'+
  '<ol style="margin:0;padding-left:20px;line-height:1.6"><li>Descarga la plantilla y anota un gasto por fila.</li><li>Súbela aquí. Antes de cargar te mostramos lo que vamos a importar.</li></ol>'+
  '<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn ghost" data-gtpl>Descargar plantilla</button><label class="btn" style="cursor:pointer">Subir mi Excel<input type="file" id="gimp" accept=".xlsx,.xls,.csv" hidden></label></div>'+
  (gastos.length?'<div style="border-top:1px dashed var(--line);padding-top:12px"><button type="button" class="btn ghost sm" data-gexp>Descargar mis gastos ('+gastos.length+')</button><p class="note" style="margin:6px 0 0">Todos tus gastos, en el mismo formato de la plantilla.</p></div>':'')+
  (gastos.length?'<div style="border-top:1px dashed var(--line);padding-top:12px"><label class="btn ghost sm danger" style="cursor:pointer">Eliminar gastos con un Excel<input type="file" id="gdelx" accept=".xlsx,.xls,.csv" hidden></label><p class="note" style="margin:6px 0 0">Sube un Excel con los gastos que quieres borrar, por ejemplo el mismo archivo que cargaste por error. Buscamos cada fila por fecha, nombre del gasto y monto, y antes de borrar te mostramos lo que encontramos.</p></div>':'')+
  '<div id="gmsg"></div></div>';
  if(!d.open)d.showModal();
}
function dmy(iso){return iso.slice(8,10)+"-"+iso.slice(5,7)+"-"+iso.slice(0,4)}
function gTemplate(){xlsxLib().then(function(X){
  var y=cur.y, m=String(cur.m+1).padStart(2,"0");
  xBook(X,GCOLS,[["02-"+m+"-"+y,"Ejemplo: Arriendo cocina","Arriendo",180000,"Sin IVA"],["05-"+m+"-"+y,"Ejemplo: Gas","Servicios",32000,"Incluido"],["08-"+m+"-"+y,"Ejemplo: Harina 25 kg","Insumos",28500,"Incluido"],["11-"+m+"-"+y,"Ejemplo: Cajas de torta","Packaging",40000,"Más IVA"]],
    [12,30,18,14,12],GINS,"Gastos","Plantilla_gastos_Dulcia.xlsx"); toast("Plantilla descargada");
}).catch(function(e){toast(e.message)})}
function gExport(){xlsxLib().then(function(X){
  var rows=gastos.slice().sort(function(a,b){return a.fecha<b.fecha?-1:1}).map(function(g){return [dmy(g.fecha),g.nombre,g.cat,+g.monto||0,GIVA[g.iva]||"Incluido"]});
  xBook(X,GCOLS,rows,[12,30,18,14,12],null,"Gastos","Mis_gastos_Dulcia_"+TODAY+".xlsx"); toast("Gastos descargados");
}).catch(function(e){toast(e.message)})}
function xDate(v){
  if(typeof v==="number"&&v>20000&&v<80000){var d=new Date(Date.UTC(1899,11,30)+Math.round(v)*864e5);return d.getUTCFullYear()+"-"+String(d.getUTCMonth()+1).padStart(2,"0")+"-"+String(d.getUTCDate()).padStart(2,"0")}
  var t=String(v==null?"":v).trim(), a;
  if((a=/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/.exec(t)))return a[1]+"-"+a[2].padStart(2,"0")+"-"+a[3].padStart(2,"0");
  if((a=/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{2,4})$/.exec(t))){var yy=a[3].length===2?"20"+a[3]:a[3];return yy+"-"+a[2].padStart(2,"0")+"-"+a[1].padStart(2,"0")}
  return null;
}
function gOkDate(iso){if(!iso)return false;var p=iso.split("-"),d=new Date(+p[0],+p[1]-1,+p[2]);return d.getFullYear()===+p[0]&&d.getMonth()===+p[1]-1&&d.getDate()===+p[2]}
function gIva(v){var k=xNorm(v);if(!k)return "incl";if(k.indexOf("mas")===0||k.indexOf("noincluye")===0||k==="neto"||k==="masiva")return "mas";if(k.indexOf("sin")===0||k==="no"||k.indexOf("exento")===0||k==="noaplica")return "no";return "incl"}
function gDelParse(buf,X){
  var wb=X.read(buf,{type:"array",raw:true}), ws=wb.Sheets["Gastos"]||wb.Sheets[wb.SheetNames[0]];
  var aoa=X.utils.sheet_to_json(ws,{header:1,defval:"",raw:true}), hi=-1, col={};
  for(var i=0;i<Math.min(aoa.length,15)&&hi<0;i++){var h=aoa[i].map(xNorm);if(h.indexOf("fecha")>=0&&h.indexOf("monto")>=0)hi=i}
  if(hi<0)throw new Error("No encontramos las columnas Fecha y Monto. Usa la plantilla de gastos de Dulcia o el archivo que descargaste desde aquí.");
  aoa[hi].forEach(function(h,j){var k=xNorm(h);if(k==="fecha")col.f=j;else if(k==="gasto"||k==="nombre"||k==="detalle"||k==="descripcion")col.n=j;else if(k==="monto"||k==="valor")col.m=j});
  var pool={}; gastos.forEach(function(g){var k=g.fecha+"|"+String(g.nombre).trim().toLowerCase()+"|"+Math.round(g.monto);(pool[k]=pool[k]||[]).push(g.id)});
  var ids=[], miss=[];
  for(var r=hi+1;r<aoa.length;r++){var row=aoa[r]; if(!row.some(function(v){return String(v).trim()!==""}))continue;
    var f=xDate(col.f==null?"":row[col.f]), n=String(col.n==null?"":row[col.n]).trim(), mv=col.m==null?"":row[col.m], m=String(mv).trim()===""?0:xNum(mv);
    var k=f+"|"+n.toLowerCase()+"|"+Math.round(m);
    if(pool[k]&&pool[k].length)ids.push(pool[k].shift()); else miss.push("Fila "+(r+1)+": "+(n||"sin nombre")+(gOkDate(f)?" · "+dmy(f):"")+" · "+$$(m||0));
  }
  return {ids:ids,miss:miss};
}
function gDelPreview(res){
  window._gdel=res; var m=$("#gmsg"); if(!m)return;
  var mis=res.miss.length?'<p class="note" style="margin:8px 0 0">'+res.miss.length+' fila'+(res.miss.length===1?' no coincide':'s no coinciden')+' con ningún gasto y no se borra'+(res.miss.length===1?'':'n')+':</p><ul style="margin:4px 0 0;padding-left:18px;font-size:.85rem">'+res.miss.slice(0,6).map(function(e){return '<li>'+esc(e)+'</li>'}).join("")+(res.miss.length>6?'<li>y '+(res.miss.length-6)+' más</li>':'')+'</ul>':'';
  if(!res.ids.length){m.innerHTML='<div class="qbox"><b>No encontramos gastos para eliminar.</b>'+mis+'</div>';return}
  var gs=res.ids.map(function(i){return gastos.find(function(g){return g.id===i})}), tt=gs.reduce(function(a,g){return a+(+g.monto||0)},0);
  var bym={}; gs.forEach(function(g){var k=g.fecha.slice(0,7);bym[k]=(bym[k]||0)+1});
  var li=Object.keys(bym).sort().map(function(k){var p=k.split("-");return '<tr><td>'+MESES[+p[1]-1]+' '+p[0]+'</td><td class="r">'+bym[k]+'</td></tr>'}).join("");
  m.innerHTML='<div class="qbox"><b style="color:var(--bad)">Vamos a eliminar '+res.ids.length+' gasto'+(res.ids.length===1?'':'s')+' · '+$$(tt)+'</b>'+
    '<div class="scroll" style="margin-top:6px"><table><thead><tr><th>Mes</th><th class="r">Gastos</th></tr></thead><tbody>'+li+'</tbody></table></div>'+mis+
    '<p class="note" style="margin:8px 0 0">Después de eliminar tendrás unos segundos para tocar “Deshacer”.</p>'+
    '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px"><button type="button" class="btn ghost" data-close>Cancelar</button><button type="button" class="btn danger-f" data-gdelok>Eliminar '+res.ids.length+'</button></div></div>';
}
function gDelIds(ids){
  var del={}; ids.forEach(function(i){del[i]=1});
  var keep=[],gone=[]; gastos.forEach(function(g,i){if(del[g.id])gone.push({i:i,g:g});else keep.push(g)});
  gastos.length=0; keep.forEach(function(g){gastos.push(g)}); gSel={}; gSelMode=false; if($("#dlg").open)$("#dlg").close(); view="gas"; render();
  toast(gone.length+" gasto"+(gone.length===1?" eliminado":"s eliminados"),function(){gone.forEach(function(z){gastos.splice(Math.min(z.i,gastos.length),0,z.g)})});
}
function gParse(buf,X){
  var wb=X.read(buf,{type:"array",raw:true}), ws=wb.Sheets["Gastos"]||wb.Sheets[wb.SheetNames[0]];
  var aoa=X.utils.sheet_to_json(ws,{header:1,defval:"",raw:true}), hi=-1, col={};
  for(var i=0;i<Math.min(aoa.length,15)&&hi<0;i++){var h=aoa[i].map(xNorm);if(h.indexOf("fecha")>=0&&h.indexOf("monto")>=0)hi=i}
  if(hi<0)throw new Error("No encontramos las columnas de la plantilla. Usa la plantilla de gastos de Dulcia (debe tener las columnas Fecha y Monto).");
  aoa[hi].forEach(function(h,j){var k=xNorm(h);if(k==="fecha")col.f=j;else if(k==="gasto"||k==="nombre"||k==="detalle"||k==="descripcion")col.n=j;else if(k.indexOf("categoria")===0)col.k=j;else if(k==="monto"||k==="valor")col.m=j;else if(k==="iva")col.i=j});
  var out=[], errs=[], dup=0, seen={};
  gastos.forEach(function(g){seen[g.fecha+"|"+g.nombre.trim().toLowerCase()+"|"+Math.round(g.monto)]=1});
  for(var r=hi+1;r<aoa.length;r++){var row=aoa[r], g=function(k){return k==null?"":row[k]}, fila="Fila "+(r+1)+": ";
    if(!row.some(function(v){return String(v).trim()!==""}))continue;
    var f=xDate(g(col.f)), n=String(g(col.n)).trim(), m=xNum(g(col.m));
    if(!gOkDate(f)){errs.push(fila+"la fecha no es válida");continue}
    if(!n){errs.push(fila+"falta el nombre del gasto");continue}
    if(isNaN(m)||m<0){errs.push(fila+"el monto de “"+n+"” no es un número");continue}
    var key=f+"|"+n.toLowerCase()+"|"+Math.round(m); if(seen[key]){dup++;continue} seen[key]=1;
    out.push({fecha:f,nombre:n,cat:String(g(col.k)).trim()||"Otros",monto:m,iva:gIva(g(col.i))});
  }
  return {gs:out,errs:errs,dup:dup};
}
function gPreview(res){
  window._gres=res; var m=$("#gmsg"); if(!m)return;
  var dupt=res.dup?'<p class="note" style="margin:6px 0 0">'+res.dup+' gasto'+(res.dup===1?' ya existía y no se carga':'s ya existían y no se cargan')+' de nuevo.</p>':'';
  var errt=res.errs.length?'<p class="note" style="margin:8px 0 0">Estas filas no se cargan:</p><ul style="margin:4px 0 0;padding-left:18px;font-size:.85rem">'+res.errs.slice(0,8).map(function(e){return '<li>'+esc(e)+'</li>'}).join("")+(res.errs.length>8?'<li>y '+(res.errs.length-8)+' más</li>':'')+'</ul>':'';
  if(!res.gs.length){m.innerHTML='<div class="qbox"><b>No hay gastos nuevos para cargar.</b>'+dupt+errt+'</div>';return}
  var bym={}; res.gs.forEach(function(g){var k=g.fecha.slice(0,7);bym[k]=bym[k]||{n:0,t:0};bym[k].n++;bym[k].t+=gN(g)+gI(g)});
  var li=Object.keys(bym).sort().map(function(k){var p=k.split("-");return '<tr><td>'+MESES[+p[1]-1]+' '+p[0]+'<div class="note" style="margin:0">'+bym[k].n+' gasto'+(bym[k].n===1?'':'s')+'</div></td><td class="r">'+$$(bym[k].t)+'</td></tr>'}).join("");
  var nuevas=[]; res.gs.forEach(function(g){if(gcats.indexOf(g.cat)<0&&nuevas.indexOf(g.cat)<0)nuevas.push(g.cat)});
  m.innerHTML='<div class="qbox"><b>Vamos a cargar '+res.gs.length+' gasto'+(res.gs.length===1?'':'s')+'</b>'+
    '<div class="scroll" style="margin-top:6px"><table><thead><tr><th>Mes</th><th class="r">Total pagado</th></tr></thead><tbody>'+li+'</tbody></table></div>'+
    (nuevas.length?'<p class="note" style="margin:6px 0 0">Categorías nuevas: '+nuevas.map(esc).join(", ")+'.</p>':'')+dupt+errt+
    '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px"><button type="button" class="btn ghost" data-close>Cancelar</button><button type="button" class="btn" data-gimport>Cargar gastos</button></div></div>';
}
function gImport(){
  var res=window._gres; if(!res||!res.gs.length)return; var last="";
  res.gs.forEach(function(g){if(gcats.indexOf(g.cat)<0)gcats.push(g.cat);gastos.push({id:gid++,fecha:g.fecha,cat:g.cat,nombre:g.nombre,monto:g.monto,iva:g.iva});if(g.fecha>last)last=g.fecha});
  window._gres=null; var d=pd(last); cur={y:d.getFullYear(),m:d.getMonth()}; $("#dlg").close(); view="gas"; render();
  toast(res.gs.length+" gasto"+(res.gs.length===1?" cargado":"s cargados"));
}
document.addEventListener("click",function(e){var t=e.target.closest("button");if(!t)return;
  if(t.hasAttribute("data-gxlsx"))openGxlsx();else if(t.hasAttribute("data-gtpl"))gTemplate();else if(t.hasAttribute("data-gexp"))gExport();else if(t.hasAttribute("data-gimport"))gImport();else if(t.hasAttribute("data-gdelok")){var gr=window._gdel;window._gdel=null;if(gr&&gr.ids.length)gDelIds(gr.ids)}else if(t.hasAttribute("data-xexp"))xExportRecetas()});
document.addEventListener("change",function(e){var t=e.target;if(t.id!=="gdelx"||!t.files||!t.files[0])return;var f=t.files[0],m=$("#gmsg");if(m)m.innerHTML='<p class="note">Leyendo '+esc(f.name)+'…</p>';
  Promise.all([xlsxLib(),f.arrayBuffer()]).then(function(a){gDelPreview(gDelParse(a[1],a[0]))}).catch(function(err){if(m)m.innerHTML='<div class="qbox">'+esc(err.message||"No pudimos leer el archivo.")+'</div>'});t.value=""});
document.addEventListener("change",function(e){var t=e.target;if(t.id!=="gimp"||!t.files||!t.files[0])return;var f=t.files[0],m=$("#gmsg");if(m)m.innerHTML='<p class="note">Leyendo '+esc(f.name)+'…</p>';
  Promise.all([xlsxLib(),f.arrayBuffer()]).then(function(a){gPreview(gParse(a[1],a[0]))}).catch(function(err){if(m)m.innerHTML='<div class="qbox">'+esc(err.message||"No pudimos leer el archivo.")+'</div>'});t.value=""});

/* ---------- PEDIDOS DESDE / HACIA EXCEL ---------- */
var PCOLS=["Fecha","Hora","Cliente","Instagram","WhatsApp","Categoría","Canal","Receta","Cantidad receta","Total","Anticipo","Descripción","Tipo","Personas"];
var PINS=["Cómo llenar la plantilla de pedidos de Dulcia","",
  "1. Una fila por cada pedido.",
  "2. Fecha de entrega: día-mes-año, por ejemplo 24-10-2026. Hora: por ejemplo 15:00. Si la dejas vacía, queda a las 12:00.",
  "3. Cliente es obligatorio. Instagram y WhatsApp son opcionales (por ejemplo @usuario y +56 9 1234 5678).",
  "4. Categoría: por ejemplo Tortas o Eventos. Si no existe en Dulcia, se crea sola. Canal: WhatsApp, Instagram, Tienda web, Cafetería u otro.",
  "5. Receta: escribe el nombre tal como está en Dulcia. Si no la encontramos, el pedido se carga sin receta y te avisamos.",
  "6. Total y Anticipo: solo el número, con o sin $ y puntos. Por ejemplo 39.000.",
  "7. Tipo: Pedido o Cotización. Si lo dejas vacío, queda como Pedido. Personas: para cuántas personas es (opcional), por ejemplo 20.",
  "8. Si un pedido ya existe (misma fecha, cliente y total), no se carga dos veces.",
  "9. Borra las filas de ejemplo antes de subir tus pedidos."];
function openPxlsx(){
  var d=$("#dlg");
  d.innerHTML='<div class="dlg"><header><h2 style="font-size:1.62rem">Pedidos en Excel</h2><button type="button" class="ib" data-close aria-label="Cerrar">✕</button></header>'+
  '<ol style="margin:0;padding-left:20px;line-height:1.6"><li>Descarga la plantilla y anota un pedido por fila.</li><li>Súbela aquí. Antes de cargar te mostramos lo que vamos a importar.</li></ol>'+
  '<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn ghost" data-ptpl>Descargar plantilla</button><label class="btn" style="cursor:pointer">Subir mi Excel<input type="file" id="pimp" accept=".xlsx,.xls,.csv" hidden></label></div>'+
  (real().length?'<div style="border-top:1px dashed var(--line);padding-top:12px"><b style="font-size:.95rem">Descargar ventas completas</b><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button type="button" class="btn sm" data-vxls="mes">Ventas de '+MESES[cur.m]+' '+cur.y+'</button><button type="button" class="btn ghost sm" data-vxls="todo">Todas las ventas</button></div><p class="note" style="margin:6px 0 0">Cada pedido con cliente, RUT, productos, despacho, descuento, total, neto, IVA, pagos, saldo y documento (boleta o factura), más una hoja con el detalle de cada producto vendido.</p></div>':'')+
  (orders.length?'<div style="border-top:1px dashed var(--line);padding-top:12px"><button type="button" class="btn ghost sm" data-pexp>Descargar mis pedidos ('+orders.length+')</button><p class="note" style="margin:6px 0 0">Todos tus pedidos y cotizaciones, en el mismo formato de la plantilla.</p></div>':'')+
  (orders.length?'<div style="border-top:1px dashed var(--line);padding-top:12px"><label class="btn ghost sm danger" style="cursor:pointer">Eliminar pedidos con un Excel<input type="file" id="pdelx" accept=".xlsx,.xls,.csv" hidden></label><p class="note" style="margin:6px 0 0">Sube un Excel con los pedidos que quieres borrar, por ejemplo el mismo archivo que cargaste por error. Buscamos cada fila por fecha, cliente y total, y antes de borrar te mostramos lo que encontramos.</p></div>':'')+
  '<div id="pmsg"></div></div>';
  if(!d.open)d.showModal();
}
function ventasExcel(alcance){
  xlsxLib().then(function(X){
    var l=real().filter(function(o){return alcance==="todo"||inMonth(o)}).sort(function(a,b){return (a.fecha+a.hora)<(b.fecha+b.hora)?-1:1});
    var H=["Fecha de entrega","Hora","Cliente","Tipo de cliente","Razón social","RUT","WhatsApp","Instagram","Categoría","Canal","Productos","Subtotal productos","Despacho","Descuento","Total con IVA","Neto","IVA","Pagado","Saldo","Estado de pago","Documento","N° documento","Listo","Personas","Descripción"];
    var rows=l.map(function(o){var c=o.cid?clis.find(function(z){return z.id===o.cid}):null,sub=Math.round(oSub(o)),ds=oDsc(o,sub),tot=Math.round(+o.total||0),neto=Math.round(tot/IVA);
      var prods=(o.items||[]).map(function(it){var r=recipes.find(function(q){return q.id===it.rid});return r?fq(it.q)+" "+udPl(r,it.q)+" "+r.nombre:""}).filter(Boolean).join(" · ");
      return [dmy(o.fecha),o.hora||"",o.cliente,(o.tc==="mayorista"?"Mayorista":"Minorista"),c?c.rs||"":"",c?c.rut||"":"",o.wa?waFmt(o.wa):"",o.ig?"@"+o.ig:"",o.cat||"",o.canal||"",prods,sub,+o.desp||0,ds,tot,neto,tot-neto,Math.round(+o.pagado||0),tot-Math.round(+o.pagado||0),STL[st(o)]||"",DOCL[o.doct||""],o.docn||"",o.listo?"Sí":"No",o.personas||"",o.desc==="Sin descripción."?"":o.desc]});
    var tt=function(i){return rows.reduce(function(a,r){return a+(+r[i]||0)},0)};
    if(rows.length)rows.push(["Total","","","","","","","","","","",tt(11),tt(12),tt(13),tt(14),tt(15),tt(16),tt(17),tt(18),"","","","","",""]);
    var ws=X.utils.aoa_to_sheet([H].concat(rows));ws["!cols"]=[12,7,24,12,24,13,15,16,16,12,40,14,10,10,13,12,11,12,11,12,12,12,7,9,40].map(function(w){return {wch:w}});ws["!autofilter"]={ref:"A1:Y"+(l.length+1)};
    var D=[["Fecha de entrega","Cliente","Tipo de cliente","Documento","N° documento","Producto","Cantidad","Unidad","Precio unitario con IVA","Subtotal con IVA","Costo estimado","Ganancia estimada (neta)"]];
    l.forEach(function(o){(o.items||[]).forEach(function(it){var r=recipes.find(function(q){return q.id===it.rid});if(!r)return;var p=Math.round(lnP(it,o.tc)),sb=Math.round((+it.q||0)*p),cst=Math.round(costTanda(r)/(r.un||1)*(+it.q||0));
      D.push([dmy(o.fecha),o.cliente,o.tc==="mayorista"?"Mayorista":"Minorista",DOCL[o.doct||""],o.docn||"",r.nombre,+it.q||0,udPl(r,it.q),p,sb,cst,Math.round(sb/IVA)-cst])})});
    var w2=X.utils.aoa_to_sheet(D);w2["!cols"]=[12,24,12,12,12,24,9,10,14,14,13,16].map(function(w){return {wch:w}});w2["!autofilter"]={ref:"A1:L"+D.length};
    var wb=X.utils.book_new();X.utils.book_append_sheet(wb,ws,"Ventas");X.utils.book_append_sheet(wb,w2,"Detalle de productos");
    X.writeFile(wb,"Ventas_Dulcia_"+(alcance==="todo"?"todas":cur.y+"-"+String(cur.m+1).padStart(2,"0"))+".xlsx");toast(l.length+" venta"+(l.length===1?"":"s")+" descargada"+(l.length===1?"":"s"));
  }).catch(function(e){toast(e.message||"No se pudo crear el Excel")});
}
document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("[data-vxls]");if(t)ventasExcel(t.dataset.vxls)});
function pTemplate(){xlsxLib().then(function(X){
  var y=cur.y, m=String(cur.m+1).padStart(2,"0"), r1=recipes[0]?recipes[0].nombre:"", c1=pcats[0]?pcats[0].n:"Tortas";
  xBook(X,PCOLS,[["18-"+m+"-"+y,"15:00","Ejemplo: Fernanda Rojas","@fer.rojas","+56 9 8765 4321",c1,"Instagram",r1,1,39000,19500,"Tres leches con frambuesas","Pedido",20],
                 ["22-"+m+"-"+y,"11:00","Ejemplo: Oficina Austral","","+56 9 2222 3333",c1,"WhatsApp","",1,48000,0,"3 cajas de trufas corporativas","Cotización",""]],
    [12,8,26,16,18,16,12,24,10,12,12,36,12,10],PINS,"Pedidos","Plantilla_pedidos_Dulcia.xlsx"); toast("Plantilla descargada");
}).catch(function(e){toast(e.message)})}
function pExport(){xlsxLib().then(function(X){
  var rows=orders.slice().sort(function(a,b){return (a.fecha+a.hora)<(b.fecha+b.hora)?-1:1}).map(function(o){
    var it=(o.items||[])[0], r=it?recipes.find(function(q){return q.id===it.rid}):null;
    return [dmy(o.fecha),o.hora||"12:00",o.cliente,o.ig?"@"+o.ig:"",waFmt(o.wa),o.cat,o.canal,r?r.nombre:"",it?(+it.q||1):"",+o.total||0,+o.pagado||0,o.desc==="Sin descripción."?"":o.desc,o.cot?"Cotización":"Pedido",o.personas||""]});
  xBook(X,PCOLS,rows,[12,8,26,16,18,16,12,24,10,12,12,36,12,10],null,"Pedidos","Mis_pedidos_Dulcia_"+TODAY+".xlsx"); toast("Pedidos descargados");
}).catch(function(e){toast(e.message)})}
function xHora(v){
  if(typeof v==="number"&&v>=0){var fr=v%1,mins=Math.round(fr*1440);if(v>=1&&v<24&&fr===0)mins=v*60;return String(Math.floor(mins/60)%24).padStart(2,"0")+":"+String(mins%60).padStart(2,"0")}
  var t=String(v==null?"":v).trim().toLowerCase(), a=/^(\d{1,2})(?:[:.h](\d{2}))?\s*(am|pm|hrs?|h)?\.?$/.exec(t);
  if(!a)return null; var h=+a[1], mi=+(a[2]||0); if(a[3]==="pm"&&h<12)h+=12; if(a[3]==="am"&&h===12)h=0; if(h>23||mi>59)return null;
  return String(h).padStart(2,"0")+":"+String(mi).padStart(2,"0");
}
function pParse(buf,X){
  var wb=X.read(buf,{type:"array",raw:true}), ws=wb.Sheets["Pedidos"]||wb.Sheets[wb.SheetNames[0]];
  var aoa=X.utils.sheet_to_json(ws,{header:1,defval:"",raw:true}), hi=-1, col={};
  for(var i=0;i<Math.min(aoa.length,15)&&hi<0;i++){var h=aoa[i].map(xNorm);if(h.indexOf("fecha")>=0&&h.indexOf("cliente")>=0)hi=i}
  if(hi<0)throw new Error("No encontramos las columnas de la plantilla. Usa la plantilla de pedidos de Dulcia (debe tener las columnas Fecha y Cliente).");
  aoa[hi].forEach(function(h,j){var k=xNorm(h);
    if(k==="fecha"||k==="fechadeentrega")col.f=j;else if(k==="hora")col.h=j;else if(k==="cliente")col.c=j;else if(k==="instagram")col.ig=j;else if(k==="whatsapp"||k==="telefono")col.wa=j;
    else if(k.indexOf("categoria")===0)col.k=j;else if(k==="canal")col.a=j;else if(k==="receta")col.r=j;else if(k.indexOf("cantidad")===0)col.q=j;
    else if(k==="total"||k==="totalconiva"||k==="monto")col.t=j;else if(k==="anticipo"||k==="anticipopagado"||k==="abono"||k==="pagado")col.p=j;else if(k==="descripcion"||k==="detalle")col.d=j;else if(k==="tipo")col.ty=j;else if(k==="personas"||k==="porciones")col.pe=j});
  var out=[], errs=[], warns=[], dup=0, seen={};
  orders.forEach(function(o){seen[o.fecha+"|"+o.cliente.trim().toLowerCase()+"|"+Math.round(o.total)]=1});
  for(var r=hi+1;r<aoa.length;r++){var row=aoa[r], g=function(k){return k==null?"":row[k]}, fila="Fila "+(r+1)+": ";
    if(!row.some(function(v){return String(v).trim()!==""}))continue;
    var f=xDate(g(col.f)), cl=String(g(col.c)).trim(), t=xNum(g(col.t)), pa=xNum(g(col.p)), hv=g(col.h), ho=String(hv).trim()===""?"12:00":xHora(hv);
    if(!gOkDate(f)){errs.push(fila+"la fecha no es válida");continue}
    if(!cl){errs.push(fila+"falta el nombre del cliente");continue}
    if(!ho){errs.push(fila+"la hora de “"+cl+"” no es válida (usa por ejemplo 15:00)");continue}
    if(String(g(col.t)).trim()==="")t=0; if(isNaN(t)||t<0){errs.push(fila+"el total de “"+cl+"” no es un número");continue}
    if(String(g(col.p)).trim()==="")pa=0; if(isNaN(pa)||pa<0){errs.push(fila+"el anticipo de “"+cl+"” no es un número");continue}
    var key=f+"|"+cl.toLowerCase()+"|"+Math.round(t); if(seen[key]){dup++;continue} seen[key]=1;
    var rn=String(g(col.r)).trim(), rec=rn?recipes.find(function(q){return q.nombre.trim().toLowerCase()===rn.toLowerCase()}):null, q=xNum(g(col.q));
    if(rn&&!rec)warns.push(fila+"no encontramos la receta “"+rn+"”; el pedido se carga sin receta");
    var cot=/^cotiz/.test(xNorm(g(col.ty)));
    out.push({fecha:f,hora:ho,cliente:cl,ig:igUser(g(col.ig)),wa:waNum(g(col.wa)),cat:String(g(col.k)).trim()||"Sin categoría",canal:String(g(col.a)).trim()||"WhatsApp",
      items:rec?[{rid:rec.id,q:isNaN(q)||q<=0?1:q}]:[],total:t,pagado:Math.min(t,pa),desc:String(g(col.d)).trim()||"Sin descripción.",cot:cot,personas:(function(v){v=Math.round(xNum(v));return v>0&&v<10000?v:null})(g(col.pe))});
  }
  return {os:out,errs:errs,warns:warns,dup:dup};
}
function pDelParse(buf,X){
  var wb=X.read(buf,{type:"array",raw:true}), ws=wb.Sheets["Pedidos"]||wb.Sheets[wb.SheetNames[0]];
  var aoa=X.utils.sheet_to_json(ws,{header:1,defval:"",raw:true}), hi=-1, col={};
  for(var i=0;i<Math.min(aoa.length,15)&&hi<0;i++){var h=aoa[i].map(xNorm);if(h.indexOf("fecha")>=0&&h.indexOf("cliente")>=0)hi=i}
  if(hi<0)throw new Error("No encontramos las columnas Fecha y Cliente. Usa la plantilla de pedidos de Dulcia o el archivo que descargaste desde aquí.");
  aoa[hi].forEach(function(h,j){var k=xNorm(h);if(k==="fecha"||k==="fechadeentrega")col.f=j;else if(k==="cliente")col.c=j;else if(k==="total"||k==="totalconiva"||k==="monto")col.t=j});
  var pool={}; orders.forEach(function(o){var k=o.fecha+"|"+o.cliente.trim().toLowerCase()+"|"+Math.round(o.total);(pool[k]=pool[k]||[]).push(o.id)});
  var ids=[], miss=[], filas=0;
  for(var r=hi+1;r<aoa.length;r++){var row=aoa[r]; if(!row.some(function(v){return String(v).trim()!==""}))continue; filas++;
    var f=xDate(col.f==null?"":row[col.f]), cl=String(col.c==null?"":row[col.c]).trim(), tv=col.t==null?"":row[col.t], t=String(tv).trim()===""?0:xNum(tv);
    var k=f+"|"+cl.toLowerCase()+"|"+Math.round(t);
    if(pool[k]&&pool[k].length)ids.push(pool[k].shift()); else miss.push("Fila "+(r+1)+": "+(cl||"sin cliente")+(gOkDate(f)?" · "+dmy(f):"")+" · "+$$(t||0));
  }
  return {ids:ids,miss:miss,filas:filas};
}
function pDelPreview(res){
  window._pdel=res; var m=$("#pmsg"); if(!m)return;
  var mis=res.miss.length?'<p class="note" style="margin:8px 0 0">'+res.miss.length+' fila'+(res.miss.length===1?' no coincide':'s no coinciden')+' con ningún pedido y no se borra'+(res.miss.length===1?'':'n')+':</p><ul style="margin:4px 0 0;padding-left:18px;font-size:.85rem">'+res.miss.slice(0,6).map(function(e){return '<li>'+esc(e)+'</li>'}).join("")+(res.miss.length>6?'<li>y '+(res.miss.length-6)+' más</li>':'')+'</ul>':'';
  if(!res.ids.length){m.innerHTML='<div class="qbox"><b>No encontramos pedidos para eliminar.</b>'+mis+'</div>';return}
  var os=res.ids.map(function(i){return orders.find(function(o){return o.id===i})}), tt=os.reduce(function(a,o){return a+(+o.total||0)},0);
  var bym={}; os.forEach(function(o){var k=o.fecha.slice(0,7);bym[k]=(bym[k]||0)+1});
  var li=Object.keys(bym).sort().map(function(k){var p=k.split("-");return '<tr><td>'+MESES[+p[1]-1]+' '+p[0]+'</td><td class="r">'+bym[k]+'</td></tr>'}).join("");
  m.innerHTML='<div class="qbox"><b style="color:var(--bad)">Vamos a eliminar '+res.ids.length+' pedido'+(res.ids.length===1?'':'s')+' · '+$$(tt)+'</b>'+
    '<div class="scroll" style="margin-top:6px"><table><thead><tr><th>Mes</th><th class="r">Pedidos</th></tr></thead><tbody>'+li+'</tbody></table></div>'+mis+
    '<p class="note" style="margin:8px 0 0">Se borran con sus recetas y fotos. Después tendrás unos segundos para tocar “Deshacer”.</p>'+
    '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px"><button type="button" class="btn ghost" data-close>Cancelar</button><button type="button" class="btn danger-f" data-pdelok>Eliminar '+res.ids.length+'</button></div></div>';
}
function pDelDo(){
  var res=window._pdel; if(!res||!res.ids.length)return; window._pdel=null;
  var del={}; res.ids.forEach(function(i){del[i]=1});
  var keep=[],gone=[]; orders.forEach(function(o,i){if(del[o.id])gone.push({i:i,o:o});else keep.push(o)});
  orders.length=0; keep.forEach(function(o){orders.push(o)}); $("#dlg").close(); view="ped"; render();
  toast(gone.length+" pedido"+(gone.length===1?" eliminado":"s eliminados"),function(){gone.forEach(function(z){orders.splice(Math.min(z.i,orders.length),0,z.o)})});
}
function pPreview(res){
  window._pres=res; var m=$("#pmsg"); if(!m)return;
  var lst=function(a,tit){return a.length?'<p class="note" style="margin:8px 0 0">'+tit+'</p><ul style="margin:4px 0 0;padding-left:18px;font-size:.85rem">'+a.slice(0,8).map(function(e){return '<li>'+esc(e)+'</li>'}).join("")+(a.length>8?'<li>y '+(a.length-8)+' más</li>':'')+'</ul>':''};
  var dupt=res.dup?'<p class="note" style="margin:6px 0 0">'+res.dup+' pedido'+(res.dup===1?' ya existía y no se carga':'s ya existían y no se cargan')+' de nuevo.</p>':'';
  if(!res.os.length){m.innerHTML='<div class="qbox"><b>No hay pedidos nuevos para cargar.</b>'+dupt+lst(res.errs,"Estas filas no se cargan:")+'</div>';return}
  var bym={}; res.os.forEach(function(o){var k=o.fecha.slice(0,7);bym[k]=bym[k]||{n:0,t:0,c:0};if(o.cot)bym[k].c++;else{bym[k].n++;bym[k].t+=o.total}});
  var li=Object.keys(bym).sort().map(function(k){var p=k.split("-"),b=bym[k];return '<tr><td>'+MESES[+p[1]-1]+' '+p[0]+'<div class="note" style="margin:0">'+b.n+' pedido'+(b.n===1?'':'s')+(b.c?' · '+b.c+' cotización'+(b.c===1?'':'es'):'')+'</div></td><td class="r">'+$$(b.t)+'</td></tr>'}).join("");
  var perDay={}; real().forEach(function(o){perDay[o.fecha]=(perDay[o.fecha]||0)+1}); res.os.forEach(function(o){if(!o.cot)perDay[o.fecha]=(perDay[o.fecha]||0)+1});
  var full=cfg.cap>0?Object.keys(perDay).filter(function(d){return perDay[d]>cfg.cap&&res.os.some(function(o){return !o.cot&&o.fecha===d})}).sort():[];
  var capt=full.length?'<p class="note" style="margin:6px 0 0;color:var(--warn)">Ojo: '+full.map(function(d){return fechaLarga(d)}).join(", ")+' quedaría'+(full.length===1?'':'n')+' con más de '+cfg.cap+' pedidos (tu capacidad diaria).</p>':'';
  m.innerHTML='<div class="qbox"><b>Vamos a cargar '+res.os.length+' pedido'+(res.os.length===1?'':'s')+'</b>'+
    '<div class="scroll" style="margin-top:6px"><table><thead><tr><th>Mes</th><th class="r">Ventas</th></tr></thead><tbody>'+li+'</tbody></table></div>'+
    capt+dupt+lst(res.warns,"Avisos:")+lst(res.errs,"Estas filas no se cargan:")+
    '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px"><button type="button" class="btn ghost" data-close>Cancelar</button><button type="button" class="btn" data-pimport>Cargar pedidos</button></div></div>';
}
function pImport(){
  var res=window._pres; if(!res||!res.os.length)return; var last="";
  res.os.forEach(function(o){
    if(o.cat!=="Sin categoría"&&!pcats.some(function(q){return q.n===o.cat}))pcats.push({n:o.cat,m:.7});
    orders.push({id:nextId++,cot:o.cot,num:o.cot?nextQ():0,cond:cfg.cond,vig:cfg.vig,items:o.items,cliente:o.cliente,ig:o.ig,wa:o.wa,fecha:o.fecha,hora:o.hora,cat:o.cat,canal:o.canal,desc:o.desc,personas:o.personas,total:o.total,pagado:o.pagado,fotos:[],listo:false});
    if(o.fecha>last)last=o.fecha});
  window._pres=null; var d=pd(last); cur={y:d.getFullYear(),m:d.getMonth()}; $("#dlg").close(); view="ped"; render();
  toast(res.os.length+" pedido"+(res.os.length===1?" cargado":"s cargados"));
}
document.addEventListener("click",function(e){var t=e.target.closest("button");if(!t)return;
  if(t.hasAttribute("data-pxlsx"))openPxlsx();else if(t.hasAttribute("data-ptpl"))pTemplate();else if(t.hasAttribute("data-pexp"))pExport();else if(t.hasAttribute("data-pimport"))pImport();else if(t.hasAttribute("data-pdelok"))pDelDo()});
document.addEventListener("change",function(e){var t=e.target;if(t.id!=="pdelx"||!t.files||!t.files[0])return;var f=t.files[0],m=$("#pmsg");if(m)m.innerHTML='<p class="note">Leyendo '+esc(f.name)+'…</p>';
  Promise.all([xlsxLib(),f.arrayBuffer()]).then(function(a){pDelPreview(pDelParse(a[1],a[0]))}).catch(function(err){if(m)m.innerHTML='<div class="qbox">'+esc(err.message||"No pudimos leer el archivo.")+'</div>'});t.value=""});
document.addEventListener("change",function(e){var t=e.target;if(t.id!=="pimp"||!t.files||!t.files[0])return;var f=t.files[0],m=$("#pmsg");if(m)m.innerHTML='<p class="note">Leyendo '+esc(f.name)+'…</p>';
  Promise.all([xlsxLib(),f.arrayBuffer()]).then(function(a){pPreview(pParse(a[1],a[0]))}).catch(function(err){if(m)m.innerHTML='<div class="qbox">'+esc(err.message||"No pudimos leer el archivo.")+'</div>'});t.value=""});

/* ---------- INGREDIENTES (lista única de precios) ---------- */
function ingKey(it){return xNorm(it.n)+"|"+xNorm(it.u)}
function ingList(){
  var map={}, order=[];
  recipes.forEach(function(r){(r.items||[]).forEach(function(it){
    if(!String(it.n||"").trim()||it.n==="Nuevo ítem")return;
    var k=ingKey(it), e=map[k];
    if(!e){e=map[k]={k:k,n:String(it.n).trim(),u:it.u||"",g:it.g||"Ingredientes",prices:{},uses:[]};order.push(e)}
    var c=Math.round((+it.c||0)*100)/100; e.prices[c]=(e.prices[c]||0)+1;
    if(e.uses.indexOf(r.nombre)<0)e.uses.push(r.nombre);
  })});
  order.forEach(function(e){var ps=Object.keys(e.prices).map(Number);e.price=ps.sort(function(a,b){return e.prices[b]-e.prices[a]})[0]||0;e.distinct=ps.length>1?ps.sort(function(a,b){return a-b}):null});
  return order;
}
var ings=[], iid=1, UNITS=["g","kg","ml","L","un","cda","cdta","taza","cm","m"];
function normU(u){u=String(u==null?"":u).trim();if(/^(l|lt|lts|litro|litros)$/i.test(u))return "L";var k=u.toLowerCase();for(var i=0;i<UNITS.length;i++)if(UNITS[i].toLowerCase()===k)return UNITS[i];return u}window.normU=normU;
function ingK(n,u){return xNorm(n)+"|"+xNorm(u)}
function ingFind(n,u){var k=ingK(n,u);return ings.find(function(x){return ingK(x.n,x.u)===k})}
function ingUses(x){var k=ingK(x.n,x.u),n=0;recipes.forEach(function(r){if(r.items.some(function(it){return ingKey(it)===k}))n++});return n}
function ingCats(){var c=[I,E,M];ings.forEach(function(x){if(c.indexOf(x.g)<0)c.push(x.g)});return c}
function ingSync(){if(window.NO_ING)return 0;var add=0;ingList().forEach(function(e){if(!ingFind(e.n,e.u)){ings.push({id:iid++,n:e.n,u:e.u,c:e.price,e:1,pe:e.price,g:e.g});add++}});return add}
function ingAlign(){if(window.NO_ING)return 0;var n=0;recipes.forEach(function(r){r.items.forEach(function(it){if(!it.n)return;var x=ingFind(it.n,it.u);if(x&&+it.c!==+x.c){it.c=x.c;n++}})});return n}
function ingCalc(x){var e=+x.e||0;x.c=e>0?(+x.pe||0)/e:0;return x.c}
function ingPrice(x,v){x.c=v;var k=ingK(x.n,x.u),n=0;recipes.forEach(function(r){var hit=false;r.items.forEach(function(it){if(ingKey(it)===k){it.c=v;hit=true}});if(hit)n++});return n}
function ingRename(x,n,u){var k=ingK(x.n,x.u);recipes.forEach(function(r){r.items.forEach(function(it){if(ingKey(it)===k){it.n=n;it.u=u}})});x.n=n;x.u=u}
function ingOpts(sel){
  var h='<option value=""'+(sel?'':' selected')+' disabled>Elige un ingrediente…</option>';
  ingCats().forEach(function(g){var l=ings.filter(function(x){return x.g===g}).sort(function(a,b){return a.n.localeCompare(b.n,"es")});
    if(l.length)h+='<optgroup label="'+esc(g)+'">'+l.map(function(x){return '<option value="'+x.id+'"'+(sel===x?' selected':'')+'>'+esc(x.n)+'</option>'}).join("")+'</optgroup>'});
  return h+'<option value="new">+ Crear ingrediente nuevo…</option>';
}
var RQ="";
function pickClose(){var p=$("#ipk");if(p)p.remove();document.querySelectorAll('[data-pickb][aria-expanded]').forEach(function(b){b.removeAttribute("aria-expanded")})}
function pickPlace(){
  var p=$("#ipk");if(!p)return;var b=document.querySelector('[data-pickb="'+p.dataset.row+'"]');if(!b){pickClose();return}
  var vv=window.visualViewport,vh=vv?vv.height+vv.offsetTop:innerHeight,r=b.getBoundingClientRect(),w=Math.min(Math.max(r.width,290),innerWidth-16),below=vh-r.bottom;
  p.style.width=w+"px";p.style.left=Math.min(Math.max(8,r.left),innerWidth-w-8)+"px";p.style.top=p.style.bottom="";
  if(below<260&&r.top>below){p.style.bottom=(innerHeight-r.top+4)+"px";p.style.maxHeight=Math.min(380,r.top-12)+"px"}else{p.style.top=(r.bottom+4)+"px";p.style.maxHeight=Math.max(160,Math.min(380,below-12))+"px"}
}
function pickFill(q){
  var p=$("#ipk");if(!p)return;var n=xNorm(q),h="",cnt=0;
  ingCats().forEach(function(g){var l=ings.filter(function(x){return x.g===g&&(!n||xNorm(x.n).indexOf(n)>=0)}).sort(function(a,b){return a.n.localeCompare(b.n,"es",{sensitivity:"base"})});
    if(l.length){cnt+=l.length;h+='<div class="ipkg">'+esc(g)+'</div>'+l.map(function(x){return '<button type="button" class="ipko" role="option" data-pko="'+x.id+'"><span>'+esc(x.n)+'</span><small>'+esc(x.u)+(+x.c?' · '+$$u(x.c):' · sin precio')+'</small></button>'}).join("")}});
  if(!cnt)h+='<div class="ipkn">'+(ings.length?'No hay ingredientes con “'+esc(q)+'”.':'Aún no tienes ingredientes.')+'</div>';
  h+='<button type="button" class="ipko nuevo" data-pko="new"><span>+ Crear ingrediente nuevo'+(q.trim()?': “'+esc(q.trim())+'”':'…')+'</span></button>';
  var l=p.querySelector(".ipkl");l.innerHTML=h;l.scrollTop=0;var f=l.querySelector(".ipko");if(f)f.classList.add("act");
}
function pickOpen(b){
  pickClose();var p=document.createElement("div");p.id="ipk";p.dataset.row=b.dataset.pickb;
  p.innerHTML='<div class="ipks"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><input type="search" id="ipkq" placeholder="Buscar ingrediente…" autocomplete="off" aria-label="Buscar ingrediente"></div><div class="ipkl" role="listbox"></div>';
  document.body.appendChild(p);pickFill("");pickPlace();b.setAttribute("aria-expanded","true");
  setTimeout(function(){var q=$("#ipkq");if(q)q.focus()},0);
}
function pickChoose(o){
  var p=$("#ipk");if(!p)return;var i=+p.dataset.row,r=recipe[i];if(!r){pickClose();return}
  if(o.dataset.pko==="new"){var q=($("#ipkq")||{}).value||"";pickClose();openIngNew(i,r.g);var nn=$("#in_n");if(nn&&q.trim())nn.value=q.trim();return}
  var x=ings.find(function(z){return z.id===+o.dataset.pko});pickClose();if(x){r.n=x.n;r.u=x.u;r.c=x.c;render()}
}
document.addEventListener("click",function(e){
  var b=e.target.closest&&e.target.closest("[data-pickb]");if(b){e.stopPropagation();if($("#ipk")&&$("#ipk").dataset.row===b.dataset.pickb)pickClose();else pickOpen(b);return}
  var o=e.target.closest&&e.target.closest("[data-pko]");if(o){e.stopPropagation();pickChoose(o);return}
  if(!(e.target.closest&&e.target.closest("#ipk")))pickClose();
},true);
document.addEventListener("input",function(e){
  if(e.target.id==="ipkq"){pickFill(e.target.value);return}
  if(e.target.id==="rq"){RQ=e.target.value;var q=xNorm(RQ),n=0;document.querySelectorAll(".rlist .rc").forEach(function(c){var v=!q||c.dataset.rn.indexOf(q)>=0||c.classList.contains("on");c.hidden=!v;if(v)n++});var no=$("#rnone");if(no)no.hidden=n>0}
});
document.addEventListener("keydown",function(e){
  if(e.target.id!=="ipkq")return;var l=[].slice.call(document.querySelectorAll("#ipk .ipko")),a=l.findIndex(function(x){return x.classList.contains("act")});
  if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();if(a>=0)l[a].classList.remove("act");a=e.key==="ArrowDown"?Math.min(l.length-1,a+1):Math.max(0,a-1);if(l[a]){l[a].classList.add("act");l[a].scrollIntoView({block:"nearest"})}}
  else if(e.key==="Enter"){e.preventDefault();if(l[a])pickChoose(l[a])}
  else if(e.key==="Escape"){var row=$("#ipk").dataset.row;pickClose();var bb=document.querySelector('[data-pickb="'+row+'"]');if(bb)bb.focus()}
});
addEventListener("resize",pickPlace);if(window.visualViewport)visualViewport.addEventListener("resize",pickPlace);
document.addEventListener("scroll",function(e){if(!(e.target&&e.target.closest&&e.target.closest("#ipk")))pickPlace()},true);
document.addEventListener("input",function(e){var t=e.target,id=t.id;if(!id)return;
  var num=function(v){return Math.round(+String(v).replace(/[^\d,.-]/g,"").replace(/\./g,"").replace(",",".")||0)};
  if(id==="mgm"){rp.mm=+t.value;psum()}else if(id==="mpk"){rp.mpk=t.value.trim()===""?"":num(t.value);psum()}else if(id==="mds"){rp.mds=t.value.trim()===""?"":num(t.value);psum()}
  else if(id==="ta"){rp.ta=Math.max(0,+t.value||0);rsum()}else if(id==="te"){rp.te=Math.max(0,+t.value||0)}
  else if(id==="myd"){MAY.desp=num(t.value)}else if(id==="myp"){MAY.pack=num(t.value)}else if(id==="myc"){MAY.coord=Math.max(0,+t.value||0)}else if(id==="myf"){MAY.fact=Math.min(100,Math.max(0,+t.value||0))}
});
document.addEventListener("input",function(e){if(e.target.id==="pmy"){rp.pm=mnum(e.target.value);psum()}});
document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("[data-usesug]");if(!t)return;
  if(t.dataset.usesug==="min"){var c=costTanda(rp)/(rp.un||1);rp.precio=redon(c/(1-rp.margen/100)*IVA);var a=$("#pa");if(a)a.value=mfmt(rp.precio)}
  else{rp.pm=mayCalc(rp).neto;var b=$("#pmy");if(b)b.value=mfmt(rp.pm)}psum();toast("Precio actualizado")});
function unitOpts(u){var l=UNITS.slice();if(u&&l.indexOf(u)<0)l.push(u);return l.map(function(x){return '<option'+(x===u?' selected':'')+'>'+esc(x)+'</option>'}).join("")}
function openIngNew(row,cat){
  var d=$("#dlg");
  d.innerHTML='<form class="dlg" id="ingf" style="max-width:440px"><header><h2 style="font-size:1.5rem">Nuevo ingrediente</h2><button type="button" class="ib" data-close aria-label="Cerrar">✕</button></header>'+
   '<label>Nombre<input type="text" id="in_n" required maxlength="80" placeholder="Ej: Mantequilla"></label>'+
   '<label>¿En qué unidad lo anotas en tus recetas?<select id="in_u">'+unitOpts("g")+'</select></label>'+
   '<div class="f"><label>¿Cuánto trae lo que compras?<span class="inenv"><input type="number" id="in_e" min="0" step="any" inputmode="decimal" placeholder="Ej: 1000"><b id="in_ul">g</b></span></label><label>¿Cuánto pagas por eso?<input type="text" class="money" inputmode="decimal" id="in_c" value="$ 0"></label></div>'+
   '<p class="note" style="margin:0" id="in_res">Ejemplo: un paquete de mantequilla de 250 g a $ 2.400 cuesta $ 9,6 por g.</p>'+
   '<label>Categoría<select id="in_g">'+ingCats().map(function(g){return '<option'+(g===(cat||I)?' selected':'')+'>'+esc(g)+'</option>'}).join("")+'</select></label>'+
   '<div class="msg" hidden></div><div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn ghost" data-close>Cancelar</button><button class="btn" type="submit">Crear ingrediente</button></div></form>';
  d.dataset.row=row==null?"":row; if(!d.open)d.showModal(); setTimeout(function(){var n=$("#in_n");if(n)n.focus()},50);
}
document.addEventListener("submit",function(e){if(e.target.id!=="ingf")return;e.preventDefault();
  var n=$("#in_n").value.trim().replace(/\s+/g," "),u=$("#in_u").value,ev=parseFloat(String($("#in_e").value).replace(",","."))||0,pv=mnum($("#in_c").value),g=$("#in_g").value,m=e.target.querySelector(".msg");
  var dup=ings.find(function(x){return xNorm(x.n)===xNorm(n)});
  if(!n){m.textContent="Escribe el nombre.";m.hidden=false;return}
  if(dup){m.textContent="Ya existe “"+dup.n+"” ("+dup.u+"). Elígelo de la lista en vez de crearlo otra vez.";m.hidden=false;return}
  if(!(ev>0)){m.textContent="Escribe cuánto trae lo que compras (por ejemplo, 1000 si es un kilo y lo anotas en g).";m.hidden=false;return}
  if(!(pv>0)){m.textContent="Escribe cuánto pagas por eso.";m.hidden=false;return}
  var x={id:iid++,n:n,u:u,e:ev,pe:pv,g:g};ingCalc(x);ings.push(x);
  var d=$("#dlg"),row=d.dataset.row; d.close();
  if(row!==""&&recipe[+row]){recipe[+row].n=x.n;recipe[+row].u=x.u;recipe[+row].c=x.c}
  render(); toast("Ingrediente “"+x.n+"” creado");
});
function inRes(){var u=$("#in_u"),r=$("#in_res");if(!u||!r)return;var ev=parseFloat(String($("#in_e").value).replace(",","."))||0,pv=mnum($("#in_c").value),n=$("#in_n").value.trim()||"este ingrediente";
  $("#in_ul").textContent=u.value; r.innerHTML=ev>0&&pv>0?'Costo: <b>'+$$u(pv/ev)+' por '+esc(u.value)+'</b> de '+esc(n)+'.':'Ejemplo: un paquete de mantequilla de 250 g a $ 2.400 cuesta $ 9,6 por g.'}
document.addEventListener("input",function(e){var t=e.target;if(t.id==="in_u"||t.id==="in_e"||t.id==="in_c"||t.id==="in_n")inRes()});
document.addEventListener("change",function(e){if(e.target.id==="in_u")inRes()});
/* ---------- Ingredientes por Excel ---------- */
var IX_H=["Ingrediente","Unidad","Cuánto trae el envase","Precio del envase","Categoría","Stock actual","Stock mínimo","Merma %"];
function ixUnit(u){var k=xNorm(u);var m={g:"g",gr:"g",grs:"g",gramo:"g",gramos:"g",kg:"kg",kilo:"kg",kilos:"kg",kilogramo:"kg",kilogramos:"kg",ml:"ml",cc:"ml",mililitro:"ml",mililitros:"ml",l:"L",lt:"L",lts:"L",litro:"L",litros:"L",un:"un",u:"un",und:"un",unidad:"un",unidades:"un",cda:"cda",cucharada:"cda",cucharadas:"cda",cdta:"cdta",cucharadita:"cdta",cucharaditas:"cdta",taza:"taza",tazas:"taza",h:"h",hora:"h",horas:"h",cm:"cm",m:"m",metro:"m",metros:"m"};return m[k]||""}
function openIngX(){
  var d=$("#dlg");
  d.innerHTML='<div class="dlg"><header><h2 style="font-size:1.62rem">Ingredientes en Excel</h2><button type="button" class="ib" data-close aria-label="Cerrar">✕</button></header>'+
  '<ol style="margin:0;padding-left:20px;line-height:1.6"><li>Descarga la plantilla (o tus ingredientes actuales) y ábrela en Excel o Google Sheets.</li><li>Una fila por ingrediente: nombre, unidad (g, kg, ml, L, un…), cuánto trae el envase y lo que pagas por él.</li><li>Súbela aquí. Antes de cargar te mostramos qué se crea y qué se actualiza.</li></ol>'+
  '<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn ghost" data-ixtpl>Descargar plantilla</button>'+(ings.length?'<button type="button" class="btn ghost" data-ixexp>Descargar mis ingredientes ('+ings.length+')</button>':'')+'<label class="btn" style="cursor:pointer">Subir mi Excel<input type="file" id="iximp" accept=".xlsx,.xls,.csv" hidden></label></div>'+
  '<p class="note" style="margin:0">Si un ingrediente ya existe con el mismo nombre y unidad, se actualizan su envase, precio y categoría, y el nuevo costo se aplica a todas las recetas que lo usan. Nada se borra.</p><div id="ixmsg"></div></div>';
  if(!d.open)d.showModal();
}
function ixBook(X,rows){
  var ws=X.utils.aoa_to_sheet([IX_H].concat(rows));ws["!cols"]=[30,10,20,18,18,14,14,10].map(function(w){return {wch:w}});
  var ins=X.utils.aoa_to_sheet([["Cómo llenar la hoja Ingredientes"],[""],["Ingrediente: el nombre tal como quieres verlo en tus recetas."],["Unidad: g, kg, ml, L, un, cda, cdta, taza, h, cm o m. Es la unidad en que usas el ingrediente en las recetas."],["Cuánto trae el envase: en esa misma unidad. Ej.: bolsa de harina de 1 kg con unidad g → 1000."],["Precio del envase: lo que pagas por ese envase, con IVA. Ej.: 1290."],["Categoría: Ingredientes, Empaque y decoración, o Mano de obra y gastos (o una categoría tuya)."],["Stock actual y stock mínimo: en la misma unidad. Si los dejas vacíos, no se cambian."],["Merma %: lo que se pierde al usarlo (ej.: 5 para frutas). Se suma a lo que necesitas comprar."],[""],["El costo por unidad lo calcula Dulcia: precio del envase ÷ cuánto trae."]]);ins["!cols"]=[{wch:110}];
  var wb=X.utils.book_new();X.utils.book_append_sheet(wb,ws,"Ingredientes");X.utils.book_append_sheet(wb,ins,"Instrucciones");return wb;
}
function ixTemplate(){xlsxLib().then(function(X){X.writeFile(ixBook(X,[["Harina sin polvos","g",1000,1290,I,2500,1000,0],["Huevos","un",30,7990,I,30,15,0],["Mantequilla","g",250,2890,I,500,250,0],["Frutillas","g",1000,3990,I,0,0,10],["Caja torta 20 cm","un",1,900,E,10,5,0]]),"Plantilla_ingredientes_Dulcia.xlsx");toast("Plantilla descargada")}).catch(function(e){toast(e.message)})}
function ixExport(){xlsxLib().then(function(X){var l=ings.slice().sort(function(a,b){return (a.g+a.n).localeCompare(b.g+b.n,"es")});X.writeFile(ixBook(X,l.map(function(x){return [x.n,x.u,+x.e||0,Math.round(+x.pe||0),x.g,Math.round((+x.st||0)*100)/100,+x.mn||0,+x.mm||0]})),"Ingredientes_Dulcia.xlsx");toast(l.length+" ingredientes descargados")}).catch(function(e){toast(e.message)})}
function ixParse(buf,X){
  var wb=X.read(buf,{type:"array",raw:true}),ws=wb.Sheets["Ingredientes"]||wb.Sheets[wb.SheetNames[0]],aoa=X.utils.sheet_to_json(ws,{header:1,defval:"",raw:true}),hi=-1,col={};
  for(var i=0;i<Math.min(aoa.length,15)&&hi<0;i++){var h=aoa[i].map(xNorm);if((h.indexOf("ingrediente")>=0||h.indexOf("nombre")>=0)&&h.indexOf("unidad")>=0)hi=i}
  if(hi<0)throw new Error("No encontramos las columnas de la plantilla (Ingrediente y Unidad). Usa la plantilla de Dulcia.");
  aoa[hi].forEach(function(h,j){var k=xNorm(h);if(k==="ingrediente"||k==="nombre")col.n=j;else if(k==="unidad")col.u=j;else if(k.indexOf("cuantotrae")===0||k.indexOf("envase")===0&&k.indexOf("precio")<0)col.e=j;else if(k.indexOf("precio")===0)col.p=j;else if(k.indexOf("categoria")===0)col.g=j;else if(k.indexOf("stockactual")===0||k==="stock"||k==="tengo")col.st=j;else if(k.indexOf("stockminimo")===0||k==="minimo")col.mn=j;else if(k.indexOf("merma")===0)col.mm=j});
  var out=[],err=[],seen={};
  for(var r=hi+1;r<aoa.length;r++){var row=aoa[r],g=function(c){return c==null?"":row[c]};var n=String(g(col.n)).trim();if(!n)continue;
    var u=ixUnit(g(col.u)),e=xNum(g(col.e)),p=xNum(g(col.p)),cat=String(g(col.g)).trim();
    if(!u){err.push("Fila "+(r+1)+" ("+n+"): unidad “"+g(col.u)+"” no válida. Usa g, kg, ml, L, un, cda, cdta, taza, h, cm o m.");continue}
    if(isNaN(e)||e<=0)e=1; if(isNaN(p)||p<0)p=0;
    var k=ingK(n,u);if(seen[k]){err.push("Fila "+(r+1)+": “"+n+"” ("+u+") está repetido; se usa la primera fila.");continue}seen[k]=1;
    var ov=function(c){var v=g(c);return v===""||v==null?null:xNum(v)},st=ov(col.st),mn=ov(col.mn),mm=ov(col.mm);
    out.push({n:n,u:u,e:e,pe:Math.round(p),g:cat||I,st:isNaN(st)?null:st,mn:isNaN(mn)?null:mn,mm:isNaN(mm)?null:mm,ex:ingFind(n,u)})}
  return {rows:out,err:err};
}
function ixPreview(res){
  window._ixres=res;var m=$("#ixmsg"),nu=res.rows.filter(function(x){return !x.ex}).length,up=res.rows.length-nu;
  m.innerHTML='<div class="card" style="padding:12px 14px;margin-top:6px"><b>'+res.rows.length+' ingrediente'+(res.rows.length===1?'':'s')+' en el archivo</b><div class="note" style="margin:4px 0 8px">'+nu+' nuevo'+(nu===1?'':'s')+' · '+up+' se actualiza'+(up===1?'':'n')+'</div>'+
    (res.rows.length?'<div class="scroll" style="max-height:220px"><table class="pg"><tbody>'+res.rows.slice(0,60).map(function(x){return '<tr><td>'+esc(x.n)+'</td><td>'+esc(x.u)+'</td><td class="r">'+fq(x.e)+' '+esc(x.u)+'</td><td class="r">'+$$(x.pe)+'</td><td>'+(x.ex?'<span class="note" style="margin:0">actualiza</span>':'<b>nuevo</b>')+'</td></tr>'}).join("")+'</tbody></table></div>':'')+
    (res.err.length?'<div class="qbox" style="margin-top:8px">'+res.err.slice(0,12).map(esc).join("<br>")+(res.err.length>12?'<br>…y '+(res.err.length-12)+' más':'')+'</div>':'')+
    (res.rows.length?'<button class="btn" style="margin-top:10px" data-iximport>Cargar '+res.rows.length+' ingrediente'+(res.rows.length===1?'':'s')+'</button>':'')+'</div>';
}
function ixImport(){
  var res=window._ixres;if(!res)return;var nu=0,up=0,rec=0;
  res.rows.forEach(function(x){var it=ingFind(x.n,x.u);
    var inv=function(o){if(x.st!=null)o.st=x.st;if(x.mn!=null)o.mn=Math.max(0,x.mn);if(x.mm!=null)o.mm=Math.min(90,Math.max(0,x.mm))};
    if(it){it.e=x.e;it.pe=x.pe;it.g=x.g;inv(it);ingCalc(it);rec+=ingPrice(it,it.c);up++}
    else{var ni={id:iid++,n:x.n,u:x.u,e:x.e,pe:x.pe,g:x.g};inv(ni);ingCalc(ni);ings.push(ni);nu++}});
  window._ixres=null;$("#dlg").close();render();
  toast(nu+" nuevo"+(nu===1?"":"s")+" · "+up+" actualizado"+(up===1?"":"s")+(rec?" · costos aplicados en "+rec+" receta"+(rec===1?"":"s"):""));
}
document.addEventListener("click",function(e){var t=e.target.closest("button");if(!t)return;
  if(t.hasAttribute("data-ingx"))openIngX();else if(t.hasAttribute("data-ixtpl"))ixTemplate();else if(t.hasAttribute("data-ixexp"))ixExport();else if(t.hasAttribute("data-iximport"))ixImport()});
document.addEventListener("change",function(e){var t=e.target;if(t.id!=="iximp"||!t.files||!t.files[0])return;var f=t.files[0],m=$("#ixmsg");if(m)m.innerHTML='<p class="note">Leyendo '+esc(f.name)+'…</p>';
  Promise.all([xlsxLib(),f.arrayBuffer()]).then(function(a){ixPreview(ixParse(a[1],a[0]))}).catch(function(err){if(m)m.innerHTML='<div class="qbox">'+esc(err.message||"No pudimos leer el archivo.")+'</div>'});t.value=""});

function invEstado(x){var st=+x.st||0,mn=+x.mn||0;return st<=0?'<span class="st vencida">Sin stock</span>':mn>0&&st<mn?'<span class="st prueba">Bajo mínimo</span>':'<span class="st pagando">OK</span>'}
function vInv(){
  var top=head("Inventario",'<input type="search" id="invq" placeholder="Buscar ingrediente" aria-label="Buscar ingrediente" style="max-width:240px"><button class="btn" data-v="com">Ver qué comprar</button>');
  if(window.NO_P2)return top+'<div class="card empty">Falta un paso en la base de datos para usar el inventario. Avísale a soporte.</div>';
  if(!ings.length)return top+'<div class="card empty">Primero crea tus ingredientes en <button class="lnk" data-v="ing">Ingredientes</button>.</div>';
  var l=ings.filter(function(x){return x.g!==M}),bajo=l.filter(function(x){return (+x.mn||0)>0&&(+x.st||0)<(+x.mn||0)}).length,sin=l.filter(function(x){return (+x.st||0)<=0}).length,val=l.reduce(function(a,x){return a+Math.max(0,+x.st||0)*(+x.c||0)},0);
  var cats=ingCats().filter(function(g){return g!==M});
  var html=cats.map(function(g){var lg=l.filter(function(x){return x.g===g}).sort(function(a,b){return a.n.localeCompare(b.n,"es")});if(!lg.length)return "";
    return '<section class="card invcard"><h2 style="font-size:1.3rem;margin-bottom:6px">'+esc(g)+'</h2><div class="scroll"><table class="itab"><thead><tr><th>Ingrediente</th><th>Tengo</th><th>Stock mínimo</th><th>Merma</th><th class="r">Valor</th><th>Estado</th></tr></thead><tbody>'+
    lg.map(function(x){return '<tr data-invn="'+esc(xNorm(x.n))+'"><td><b>'+esc(x.n)+'</b><div class="note" style="margin:0">'+(+x.c?$$u(x.c)+' / '+esc(x.u):'sin precio')+'</div></td>'+
      '<td><span class="iu"><input type="number" step="any" inputmode="decimal" data-ist="'+x.id+'" value="'+(Math.round((+x.st||0)*100)/100)+'" aria-label="Stock de '+esc(x.n)+'"><i>'+esc(x.u)+'</i></span></td>'+
      '<td><span class="iu"><input type="number" min="0" step="any" inputmode="decimal" data-imn="'+x.id+'" value="'+(+x.mn||"")+'" placeholder="0" aria-label="Mínimo de '+esc(x.n)+'"><i>'+esc(x.u)+'</i></span></td>'+
      '<td><span class="iu"><input type="number" min="0" max="90" step="any" inputmode="decimal" data-imm="'+x.id+'" value="'+(+x.mm||"")+'" placeholder="0" aria-label="Merma de '+esc(x.n)+'"><i>%</i></span></td>'+
      '<td class="r" id="iv'+x.id+'">'+$$(Math.max(0,+x.st||0)*(+x.c||0))+'</td><td id="ie'+x.id+'">'+invEstado(x)+'</td></tr>'}).join("")+'</tbody></table></div></section>'}).join("");
  return top+'<div class="grid kpis k3" style="grid-template-columns:repeat(3,minmax(0,1fr));margin-bottom:14px">'+kpi("Bajo el mínimo",bajo,"van solos a la lista de Compras")+kpi("Sin stock",sin,"de "+l.length+" ingredientes")+kpi("Valor del inventario",$$(val),"según el costo de cada ingrediente")+'</div>'+
  '<div class="rtip"><span class="rtipi" aria-hidden="true">📦</span><div><b>Se actualiza solo:</b> se descuenta cuando marcas un pedido como <b>Listo</b> en Producción (y se devuelve si lo desmarcas) y se suma cuando tocas <b>Comprado</b> en Compras. Si cuentas tu bodega, corrige aquí el número de “Tengo”.</div></div>'+html;
}
document.addEventListener("input",function(e){var t=e.target,d=t.dataset;if(!d)return;var id=d.ist||d.imn||d.imm;
  if(t.id==="invq"){var q=xNorm(t.value);document.querySelectorAll("[data-invn]").forEach(function(r){r.hidden=!!q&&r.dataset.invn.indexOf(q)<0});return}
  if(!id)return;var x=ings.find(function(i){return i.id===+id});if(!x)return;var v=t.value===""?0:+String(t.value).replace(",",".");if(isNaN(v))return;
  if(d.ist)x.st=v;else if(d.imn)x.mn=Math.max(0,v);else x.mm=Math.min(90,Math.max(0,v));
  var a=$("#iv"+x.id),b=$("#ie"+x.id);if(a)a.textContent=$$(Math.max(0,+x.st||0)*(+x.c||0));if(b)b.innerHTML=invEstado(x)});
document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("button");if(!t)return;
  if(t.dataset.cbuy){var x=ings.find(function(i){return i.id===+t.dataset.cbuy}),q=+t.dataset.cq;if(!x)return;x.st=(+x.st||0)+q;render();toast(x.n+": +"+fq(Math.round(q*100)/100)+" "+x.u+" al inventario",function(){x.st=(+x.st||0)-q;render()});return}
  if(t.hasAttribute("data-cbuyall")){var c=compras(),mv=c.compra.filter(function(r){return r.x});mv.forEach(function(r){r.x.st=(+r.x.st||0)+r.buy});render();toast(mv.length+" ingrediente"+(mv.length===1?"":"s")+" sumado"+(mv.length===1?"":"s")+" al inventario",function(){mv.forEach(function(r){r.x.st=(+r.x.st||0)-r.buy});render()});return}
  if(t.hasAttribute("data-crw")){CR=null;render();return}
  if(t.dataset.pw!=null){PRODOFF=t.dataset.pw==="0"?0:PRODOFF+(+t.dataset.pw);render();scrollTo(0,0);return}
  if(t.dataset.gorec){selR(+t.dataset.gorec);view="cost";render();scrollTo(0,0);return}
});
document.addEventListener("change",function(e){var t=e.target;if(t.id!=="crd"&&t.id!=="crh")return;var d=$("#crd").value||crD(),h=$("#crh").value||crH();if(h<d){var z=d;d=h;h=z}CR={d:d,h:h};render()});
function vIng(){
  var top=head("Ingredientes",'<input type="search" id="ingq" placeholder="Buscar ingrediente" aria-label="Buscar ingrediente" style="max-width:240px">'+(window.NO_ING?'':'<button class="btn ghost" data-ingx>Cargar o bajar Excel</button><button class="btn" data-ingnew>Nuevo ingrediente</button>'));
  if(window.NO_ING)return top+'<div class="card empty">Falta un paso en la base de datos para usar la lista de ingredientes. Avísale a soporte.</div>';
  if(!ings.length)return top+'<div class="card empty">Aún no tienes ingredientes. Crea el primero con “Nuevo ingrediente”: después lo eliges en tus recetas.</div>';
  var html=ingCats().map(function(g){
    var l=ings.filter(function(x){return x.g===g}).sort(function(a,b){return a.n.localeCompare(b.n,"es")}); if(!l.length)return "";
    var rows=l.map(function(x){var us=ingUses(x);
      return '<div class="ingrow" data-ingn="'+esc(xNorm(x.n))+'"><div class="ingc ingn"><input class="t ingname" type="text" value="'+esc(x.n)+'" data-ingname="'+x.id+'" aria-label="Nombre del ingrediente"><span class="ingus">'+(us?'Usado en '+us+' receta'+(us===1?'':'s'):'Sin usar en recetas')+'</span></div>'+
        '<label class="ingc"><span class="ingl">Unidad</span><select data-ingunit="'+x.id+'">'+unitOpts(x.u)+'</select></label>'+
        '<label class="ingc"><span class="ingl">Cuánto trae</span><span class="inenv"><input type="number" min="0" step="any" inputmode="decimal" data-inge="'+x.id+'" value="'+(+x.e||"")+'" aria-label="Cantidad que trae '+esc(x.n)+'"><b>'+esc(x.u)+'</b></span></label>'+
        '<label class="ingc"><span class="ingl">Precio de compra</span><input type="text" class="money" inputmode="decimal" data-ingpe="'+x.id+'" value="'+mfmt(x.pe)+'" aria-label="Precio de compra de '+esc(x.n)+'"></label>'+
        '<div class="ingc"><span class="ingl">Costo por unidad</span><span class="ingcu'+(+x.c?'':' bad')+'" id="ingcu'+x.id+'">'+(+x.c?$$u(x.c)+' / '+esc(x.u):'Sin precio')+'</span></div>'+
        '<label class="ingc"><span class="ingl">Categoría</span><select data-ingcat="'+x.id+'">'+ingCats().map(function(c){return '<option'+(c===x.g?' selected':'')+'>'+esc(c)+'</option>'}).join("")+'</select></label>'+
        '<div class="ingc ingx"><button class="x" data-ingdel="'+x.id+'" aria-label="Eliminar '+esc(x.n)+'"'+(us?' title="Está en uso: primero quítalo de las recetas"':'')+'>✕</button></div></div>'}).join("");
    return '<section class="card ingcard"><h2 style="font-size:1.3rem;margin-bottom:10px">'+esc(g)+' <span class="note" style="font-size:.85rem">'+l.length+'</span></h2>'+
      '<div class="ingrow inghead" aria-hidden="true"><span>Nombre</span><span>Unidad</span><span>Cuánto trae</span><span>Precio de compra</span><span>Costo por unidad</span><span>Categoría</span><span></span></div>'+rows+'</section>'}).join("");
  return top+'<div class="card banner" style="margin-bottom:14px"><div>Esta es tu <b>lista oficial</b> de ingredientes, empaques y mano de obra. Anota cada uno <b>como lo compras</b> (por ejemplo, mantequilla: 250 g a $ 2.400) y Dulcia calcula el costo por gramo. En las recetas solo se eligen de aquí, y si cambias un precio se actualiza en <b>todas las recetas</b>.</div></div>'+
    '<div class="grid">'+html+'</div><p class="note" id="ingnone" hidden>No encontramos ingredientes con ese nombre.</p>';
}
document.addEventListener("click",function(e){var t=e.target.closest("button");if(!t)return;
  if(t.hasAttribute("data-ingnew"))openIngNew(null);
  else if(t.dataset.ingdel){var x=ings.find(function(q){return q.id===+t.dataset.ingdel});if(!x)return;var us=ingUses(x);
    if(us){toast("“"+x.n+"” está en "+us+" receta"+(us===1?"":"s")+". Quítalo de ahí antes de eliminarlo.");return}
    var ix=ings.indexOf(x);ings.splice(ix,1);render();toast("Ingrediente eliminado",function(){ings.splice(ix,0,x)})}
});
document.addEventListener("input",function(e){var t=e.target;
  if(t.dataset&&(t.dataset.ingpe!==undefined||t.dataset.inge!==undefined)){var x=ings.find(function(q){return q.id===+(t.dataset.ingpe||t.dataset.inge)});if(!x)return;
    if(t.dataset.ingpe!==undefined)x.pe=mnum(t.value);else x.e=parseFloat(String(t.value).replace(",","."))||0;
    t.dataset.n=ingPrice(x,ingCalc(x));var cu=$("#ingcu"+x.id);if(cu){cu.textContent=+x.c?$$u(x.c)+" / "+x.u:"Sin precio";cu.className="ingcu"+(+x.c?"":" bad")}}
});
document.addEventListener("change",function(e){var t=e.target;if(!t.dataset)return;
  if((t.dataset.ingpe!==undefined||t.dataset.inge!==undefined)&&t.dataset.n&&+t.dataset.n>0){toast("Precio actualizado en "+t.dataset.n+" receta"+(t.dataset.n==="1"?"":"s"));return}
  if(t.dataset.pick!==undefined){var r=recipe[+t.dataset.pick];if(!r)return;
    if(t.value==="new"){openIngNew(+t.dataset.pick,r.g);return}
    var x=ings.find(function(q){return q.id===+t.value});if(x){r.n=x.n;r.u=x.u;r.c=x.c;render()}return}
  var id=+(t.dataset.ingname||t.dataset.ingunit||t.dataset.ingcat||0);if(!id)return;var x2=ings.find(function(q){return q.id===id});if(!x2)return;
  if(t.dataset.ingcat){x2.g=t.value;render();return}
  var nn=t.dataset.ingname?t.value.trim().replace(/\s+/g," "):x2.n, nu=t.dataset.ingunit?t.value:x2.u;
  if(!nn){t.value=x2.n;toast("El nombre no puede quedar vacío");return}
  var dup=ings.find(function(q){return q!==x2&&xNorm(q.n)===xNorm(nn)});
  if(dup){if(t.dataset.ingname)t.value=x2.n;else t.value=x2.u;toast("Ya existe “"+dup.n+"”. Usa ese ingrediente.");return}
  var us=ingUses(x2);ingRename(x2,nn,nu);render();if(us)toast("Actualizado en "+us+" receta"+(us===1?"":"s"));
});
document.addEventListener("input",function(e){var t=e.target;
  if(t.id==="ingq"){var q=xNorm(t.value),n=0;document.querySelectorAll(".ingrow").forEach(function(r){var v=!q||r.dataset.ingn.indexOf(q)>=0;r.hidden=!v;if(v)n++});
    document.querySelectorAll(".ingcard").forEach(function(c){c.hidden=!c.querySelector(".ingrow:not([hidden])")});var no=$("#ingnone");if(no)no.hidden=n>0;return}
  if(t.dataset&&t.dataset.ing!==undefined){var en=(window._ingL||[])[+t.dataset.ing];if(!en)return;var v=mnum(t.value),n2=0;
    recipes.forEach(function(r){var hit=false;(r.items||[]).forEach(function(it){if(ingKey(it)===en.k){it.c=v;hit=true}});if(hit)n2++});
    en.price=v;t.dataset.n=n2;var w=$("#ingw"+t.dataset.ing);if(w)w.hidden=true}
});
document.addEventListener("change",function(e){var t=e.target;if(t.dataset&&t.dataset.ing!==undefined&&t.dataset.n){toast("Precio actualizado en "+t.dataset.n+" receta"+(t.dataset.n==="1"?"":"s"))}});

/* ---------- PDF ---------- */
function money(n){return $$(n)}
function imgInfo(src){return new Promise(function(ok){var im=new Image();im.onload=function(){ok({w:im.naturalWidth,h:im.naturalHeight})};im.onerror=function(){ok(null)};im.src=src})}
function fmtF(iso){var d=pd(iso);return d.getDate()+" de "+MESES[d.getMonth()]+" de "+d.getFullYear()}
async function toData(u){
  if(!u)return null; if(/^data:/.test(u))return u;
  try{var r=await fetch(u),b=await r.blob();return await new Promise(function(ok){var fr=new FileReader();fr.onload=function(){ok(fr.result)};fr.onerror=function(){ok(null)};fr.readAsDataURL(b)})}catch(e){return null}
}
async function genPdf(id){
  var x=orders.find(function(q){return q.id===id}); if(!x)return;
  if(!window.jspdf){toast("No se pudo preparar el PDF");return}
  if(!x.num)x.num=nextQ();
  var J=window.jspdf.jsPDF, doc=new J({unit:"mm",format:"a4"}), W=210, M=18, y=18, AC=[179,34,79], INK=[42,30,46], SOFT=[110,100,115];
  function chk(h){if(y+h>282){doc.addPage();y=18}}
  function fmtOf(s){var m=/^data:image\/(png|jpe?g)/i.exec(s);return m?(m[1].toLowerCase()==="png"?"PNG":"JPEG"):null}
  try{var lg=cfg.logoData,lf=lg?fmtOf(lg):null;if(lf)doc.addImage(lg,lf,M,y-2,22,22)}catch(e){}
  doc.setTextColor.apply(doc,INK);doc.setFont("helvetica","bold");doc.setFontSize(16);doc.text(cfg.nombre,M+26,y+7);
  doc.setFont("helvetica","normal");doc.setFontSize(9);doc.setTextColor.apply(doc,SOFT);
  var ct=[cfg.tel,cfg.mail,cfg.url].filter(Boolean).join("  |  ");doc.text(ct,M+26,y+13);
  doc.setFont("helvetica","bold");doc.setFontSize(20);doc.setTextColor.apply(doc,AC);doc.text("COTIZACIÓN",W-M,y+5,{align:"right"});
  doc.setFontSize(11);doc.setTextColor.apply(doc,INK);doc.text(qn(x),W-M,y+12,{align:"right"});
  var hoy=pd(TODAY), ven=new Date(hoy.getFullYear(),hoy.getMonth(),hoy.getDate()+(x.vig||cfg.vig));
  doc.setFont("helvetica","normal");doc.setFontSize(9);doc.setTextColor.apply(doc,SOFT);
  doc.text("Emitida: "+fmtF(TODAY),W-M,y+18,{align:"right"});doc.text("Válida hasta: "+fmtF(iso_(ven)),W-M,y+23,{align:"right"});
  y+=32;doc.setDrawColor(220,210,215);doc.line(M,y,W-M,y);y+=8;
  function pair(a,b,xx,yy){doc.setFont("helvetica","normal");doc.setFontSize(8.5);doc.setTextColor.apply(doc,SOFT);doc.text(a,xx,yy);doc.setFont("helvetica","bold");doc.setFontSize(11);doc.setTextColor.apply(doc,INK);doc.text(b,xx,yy+5.5)}
  pair("Cliente",x.cliente,M,y);pair("Fecha de entrega",fmtF(x.fecha),M+70,y);pair("Hora",x.hora+" hrs",M+125,y);if(x.personas)pair("Porciones",x.personas+" personas",M+152,y);y+=15;
  doc.setFont("helvetica","bold");doc.setFontSize(11);doc.setTextColor.apply(doc,AC);doc.text("Detalle del pedido",M,y);y+=6;
  doc.setFont("helvetica","normal");doc.setFontSize(10.5);doc.setTextColor.apply(doc,INK);
  var dl=doc.splitTextToSize(x.desc||"",W-2*M);dl.forEach(function(l){chk(6);doc.text(l,M,y);y+=5.2});y+=3;
  var fsrc=(x.fotos&&x.fotos[0])?await toData(x.fotos[0]):null;
  if(fsrc){var fi=fmtOf(fsrc),inf=fi?await imgInfo(fsrc):null;
    if(inf){var mh=100,mw=W-2*M,sc=Math.min(mw/inf.w,mh/inf.h),iw=inf.w*sc,ih=inf.h*sc,ix=(W-iw)/2;chk(ih+10);try{doc.addImage(fsrc,fi,ix,y,iw,ih);y+=ih+2;doc.setFontSize(8);doc.setTextColor.apply(doc,SOFT);doc.text("Foto referencial",W/2,y+3,{align:"center"});y+=8}catch(e){}}}
  chk(50);y+=2;
  var tot=x.total, neto=tot/IVA, iva=tot-neto, ab=Math.round(tot*cfg.abono/100), sal=tot-ab, bx=W-M-78;
  function row(a,b,bold,big){doc.setFont("helvetica",bold?"bold":"normal");doc.setFontSize(big?13:10.5);doc.setTextColor.apply(doc,bold?INK:SOFT);doc.text(a,bx,y);doc.text(b,W-M,y,{align:"right"});y+=big?8:6.2}
  doc.setDrawColor.apply(doc,AC);doc.setLineWidth(.5);doc.line(bx,y-4.5,W-M,y-4.5);doc.setLineWidth(.2);
  row("Valor neto",money(neto));row("IVA 19%",money(iva));row("Total",money(tot),true,true);
  doc.setDrawColor(220,210,215);doc.line(bx,y-4,W-M,y-4);
  row("Abono para reservar ("+cfg.abono+"%)",money(ab),true);row("Saldo a pagar",money(sal));
  y+=6;chk(30);
  doc.setFont("helvetica","bold");doc.setFontSize(11);doc.setTextColor.apply(doc,AC);doc.text("Condiciones",M,y);y+=6;
  doc.setFont("helvetica","normal");doc.setFontSize(9.5);doc.setTextColor.apply(doc,INK);
  String(x.cond!=null?x.cond:cfg.cond).split("\n").filter(function(s){return s.trim()}).forEach(function(c){
    var ls=doc.splitTextToSize(c.trim(),W-2*M-6);chk(ls.length*4.6+2);doc.text("-",M,y);ls.forEach(function(l){doc.text(l,M+5,y);y+=4.6});y+=1.4});
  var pn=doc.getNumberOfPages();for(var p=1;p<=pn;p++){doc.setPage(p);doc.setFontSize(8);doc.setTextColor.apply(doc,SOFT);doc.text(cfg.nombre+" - Cotización "+qn(x)+" - Página "+p+" de "+pn,W/2,291,{align:"center"})}
  var fn="Cotizacion_"+String(x.num).padStart(4,"0")+"_"+x.cliente.replace(/[^A-Za-z0-9]+/g,"_")+".pdf";
  window._lastPdf={name:fn,pages:pn};
  var blob=doc.output("blob");
  try{var dl2=await claude.use("downloads");if(!dl2)throw 0;await dl2.save({filename:fn,data:blob});toast("PDF listo: "+fn)}
  catch(e){ if(e&&e.code==="declined")return; try{var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=fn;document.body.appendChild(a);a.click();a.remove();toast("PDF descargado")}catch(e2){toast("No se pudo descargar el PDF")} }
  if(view==="ped"||view==="cal")render();
}

/* ---------- COMPRAS ---------- */
function iso_(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function addDays(iso,n){var d=pd(iso);d.setDate(d.getDate()+n);return iso_(d)}
var CR=null;
function crD(){return CR?CR.d:wk}function crH(){return CR?CR.h:addDays(wk,6)}
function compras(){
  var wk0=crD(),to=crH(), ords=real().filter(function(o){return o.fecha>=wk0&&o.fecha<=to}).sort(function(a,b){return (a.fecha+a.hora)<(b.fecha+b.hora)?-1:1}), agg={}, sin=[], con=[];
  ords.forEach(function(o){
    var ln=(o.items||[]).filter(function(l){return recipes.some(function(r){return r.id===l.rid})});
    if(!ln.length){sin.push(o);return}
    con.push({o:o,ln:ln});
    ln.forEach(function(l){var r=recipes.find(function(q){return q.id===l.rid});
      r.items.forEach(function(it){ if(gbuy[it.g]===false)return;
        var k=it.g+"|"+it.n.trim().toLowerCase()+"|"+it.u.trim().toLowerCase();
        var a=agg[k]=agg[k]||{g:it.g,n:it.n,u:it.u,q:0,c:it.c}; a.q+=it.q*l.q/(r.un||1)})})
  });
  // unir por ingrediente y aplicar inventario: comprar = necesito (con merma) + mínimo − stock
  var by={};Object.keys(agg).forEach(function(k){var a=agg[k],x=ingFind(a.n,a.u),kk=x?"i"+x.id:k,b=by[kk]=by[kk]||{g:x?x.g:a.g,n:x?x.n:a.n,u:x?x.u:a.u,q:0,c:x?(+x.c||0):a.c,x:x};b.q+=a.q});
  if(!window.NO_P2)ings.forEach(function(x){if(x.g!==M&&(+x.mn||0)>0&&(+x.st||0)<(+x.mn||0)&&!by["i"+x.id])by["i"+x.id]={g:x.g,n:x.n,u:x.u,q:0,c:+x.c||0,x:x}});
  var rows=Object.keys(by).map(function(k){var r=by[k],x=r.x;r.nec=r.q*(1+(x&&!window.NO_P2?(+x.mm||0)/100:0));r.st=x&&!window.NO_P2?(+x.st||0):0;r.mn=x&&!window.NO_P2?(+x.mn||0):0;r.buy=Math.max(0,r.nec+r.mn-Math.max(0,r.st));r.bajo=r.mn>0&&r.st<r.mn;return r})
    .sort(function(a,b){return a.g===b.g?a.n.localeCompare(b.n,"es"):a.g.localeCompare(b.g,"es")}), total=0;
  rows.forEach(function(r){total+=r.buy*r.c});
  return {ords:ords,rows:rows,sin:sin,con:con,total:total,bajo:rows.filter(function(r){return r.bajo}).length,compra:rows.filter(function(r){return r.buy>0})};
}
function vCom(){
  var c=compras(), a=pd(crD()), b=pd(crH()), P2=!window.NO_P2;
  var bar='<div class="month"><button class="ib" data-w="-7" aria-label="Semana anterior">'+ICON.l+'</button><b style="min-width:11em;text-transform:none">'+a.getDate()+(a.getMonth()!==b.getMonth()?' de '+MESES[a.getMonth()]:'')+' al '+b.getDate()+' de '+MESES[b.getMonth()]+'</b><button class="ib" data-w="7" aria-label="Semana siguiente">'+ICON.r+'</button></div>';
  var rango=P2?'<div class="crango"><label>Desde<input type="date" id="crd" value="'+crD()+'"></label><label>Hasta<input type="date" id="crh" value="'+crH()+'"></label>'+(CR?'<button class="btn ghost sm" data-crw>Semana completa</button>':'')+'</div>':'';
  var body="",lg="",nc=P2?6:4;
  c.rows.forEach(function(r){ if(r.g!==lg){body+='<tr class="grp"><td colspan="'+nc+'">'+esc(r.g)+'</td></tr>';lg=r.g}
    body+=P2?'<tr'+(r.buy>0?'':' class="cok"')+'><td>'+esc(r.n)+(r.bajo?' <span class="st vencida">bajo mínimo</span>':'')+(r.x?'':'<div class="note" style="margin:0">No está en Ingredientes</div>')+'</td><td class="r">'+fq(Math.round(r.nec*100)/100)+' '+esc(r.u)+'</td><td class="r">'+(r.x?fq(Math.round(r.st*100)/100)+' '+esc(r.u):'—')+'</td><td class="r"><b>'+fq(Math.round(r.buy*100)/100)+' '+esc(r.u)+'</b></td><td class="r">'+$$(r.buy*r.c)+'</td><td class="r">'+(r.x&&r.buy>0?'<button class="btn ghost sm" data-cbuy="'+r.x.id+'" data-cq="'+r.buy+'">Comprado</button>':'')+'</td></tr>'
      :'<tr><td>'+esc(r.n)+'</td><td class="r">'+fq(r.q)+'</td><td>'+esc(r.u)+'</td><td class="r">'+$$(r.q*r.c)+'</td></tr>'});
  var inc=c.con.map(function(z){return '<button class="ord" style="grid-template-columns:minmax(0,1fr)" data-o="'+z.o.id+'"><div style="min-width:0"><h3>'+esc(z.o.cliente)+'</h3><p>'+fechaLarga(z.o.fecha)+' · '+z.ln.map(function(l){var r=recipes.find(function(q){return q.id===l.rid});return esc(r.nombre)+' × '+fq(l.q)}).join(", ")+'</p></div></button>'}).join("");
  var sin=c.sin.map(function(o){return '<button class="chip s-anticipo" style="border:0" data-o="'+o.id+'">'+esc(o.cliente)+' · '+pd(o.fecha).getDate()+'/'+(pd(o.fecha).getMonth()+1)+'</button>'}).join(" ");
  return head("Compras",bar+(c.rows.length?'<button class="btn" data-copyc>Copiar lista</button>':''))+rango+
  '<div class="grid kpis k3" style="grid-template-columns:repeat(3,minmax(0,1fr));margin-bottom:14px">'+kpi(CR?"Pedidos en esos días":"Pedidos de la semana",c.ords.length,c.con.length+" con receta")+kpi("Compra estimada",$$(c.total),P2?"Descontando tu inventario":"Ingredientes y materia prima")+(P2?kpi("Por comprar",c.compra.length,c.bajo?c.bajo+" bajo el mínimo":"de "+c.rows.length+" ingredientes"):kpi("Productos distintos",c.rows.length,"En la lista de compras"))+'</div>'+
  '<div class="grid'+(P2?' cgrid':' two')+'"><section class="card"><h2 style="font-size:1.38rem">Qué comprar</h2>'+
  (c.rows.length?'<div class="scroll"><table class="ctab"><thead><tr>'+(P2?'<th>Ingrediente</th><th class="r">Necesito</th><th class="r">Tengo</th><th class="r">Comprar</th><th class="r">Costo</th><th></th>':'<th>Ingrediente o materia prima</th><th class="r">Cantidad</th><th>Unidad</th><th class="r">Costo estimado</th>')+'</tr></thead><tbody>'+body+'<tr class="tot"><td colspan="'+(P2?4:3)+'">Total estimado</td><td class="r">'+$$(c.total)+'</td>'+(P2?'<td></td>':'')+'</tr></tbody></table></div>'+(P2&&c.compra.some(function(r){return r.x})?'<div style="margin-top:10px"><button class="btn sm" data-cbuyall>Marcar todo como comprado</button></div>':''):'<div class="empty">No hay pedidos con receta en estos días. Asigna una receta a tus pedidos para ver qué comprar.</div>')+
  '<p class="note">'+(P2?'Necesito incluye la merma de cada ingrediente. Comprar = necesito + stock mínimo − lo que tienes. Al tocar “Comprado”, esa cantidad se suma a tu <button class="lnk" data-v="inv">Inventario</button>.':'Los precios salen de tus recetas.')+'</p></section>'+
  '<div class="grid" style="align-content:start"><section class="card"><h2 style="font-size:1.38rem;margin-bottom:10px">Pedidos incluidos</h2><div class="grid" style="gap:8px">'+(inc||'<div class="empty">Sin pedidos con receta.</div>')+'</div></section>'+
  (c.sin.length?'<section class="card"><h2 style="font-size:1.26rem">Sin receta asignada</h2><p class="note" style="margin-top:2px">Estos pedidos no suman a la lista. Toca uno para asignarle una receta.</p><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">'+sin+'</div></section>':'')+'</div></div>';
}
function copiarLista(){
  var c=compras(), P2=!window.NO_P2, tx="Compras del "+pd(crD()).getDate()+" al "+pd(crH()).getDate()+" de "+MESES[pd(crH()).getMonth()]+"\n"+(P2?c.compra:c.rows).map(function(r){return "- "+r.n+": "+fq(Math.round((P2?r.buy:r.q)*100)/100)+" "+r.u}).join("\n")+"\nTotal estimado: "+$$(c.total);
  function fb(){var d=$("#dlg");d.innerHTML='<div class="dlg"><header><h2 style="font-size:1.44rem">Lista de compras</h2><button class="ib" data-close aria-label="Cerrar">✕</button></header><textarea id="cpt" rows="12" readonly></textarea><p class="note" style="margin:0">Selecciona el texto y cópialo.</p></div>';$("#cpt").value=tx;d.showModal();$("#cpt").select()}
  try{navigator.clipboard.writeText(tx).then(function(){toast("Lista copiada")},fb)}catch(e){fb()}
}
var tt;
function toast(msg,undo){var el=$("#toast");el.innerHTML='<span>'+esc(msg)+'</span>'+(undo?'<button data-undo>Deshacer</button>':'');el.hidden=false;window._undo=undo||null;clearTimeout(tt);tt=setTimeout(function(){el.hidden=true;window._undo=null},7000)}

/* ---------- GASTOS ---------- */
function vGas(){
  var gs=gMes().sort(function(a,b){return a.fecha<b.fecha?-1:1}), N=0,I=0,T=0;
  Object.keys(gSel).forEach(function(k){if(!gastos.some(function(g){return g.id===+k}))delete gSel[k]});
  window._gvis=gs.map(function(g){return g.id}); var gns=Object.keys(gSel).length, GS=gSelMode;
  var rows=gs.map(function(g){N+=gN(g);I+=gI(g);T+=gN(g)+gI(g);
    return '<tr'+(GS?' class="gselr'+(gSel[g.id]?' on':'')+'" data-gselo="'+g.id+'"':' class="gedr" data-gedr="'+g.id+'" title="Toca para editar"')+'>'+(GS?'<td style="width:30px"><span class="gck" aria-hidden="true"></span></td>':'')+'<td>'+g.fecha.slice(8)+"/"+g.fecha.slice(5,7)+'</td><td>'+esc(g.cat)+'</td><td>'+esc(g.nombre)+'</td><td class="r">'+$$(g.monto)+'<div class="note" style="margin:0;font-size:.72rem">'+IVAL[g.iva]+'</div></td><td class="r">'+$$(gN(g))+'</td><td class="r">'+$$(gI(g))+'</td><td class="r">'+$$(gN(g)+gI(g))+'</td><td style="white-space:nowrap"><button class="x" data-gedit="'+g.id+'" aria-label="Editar gasto" title="Editar gasto"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button><button class="x" data-gdel="'+g.id+'" aria-label="Eliminar gasto">✕</button></td></tr>'}).join("");
  var gbar=GS?'<div class="selbar"><b>'+gns+' seleccionado'+(gns===1?'':'s')+'</b><div class="sb"><button class="btn ghost sm" data-gselall>'+(gs.length&&gs.every(function(g){return gSel[g.id]})?'Quitar todos':'Seleccionar todos ('+gs.length+')')+'</button><button class="btn sm danger-f" data-gseldel'+(gns?'':' disabled')+'>Eliminar '+gns+'</button><button class="btn ghost sm" data-gselmode>Listo</button></div></div>':'';
  return head("Gastos",monthBar()+'<button class="btn ghost" data-cats="gas">Categorías</button><button class="btn ghost" data-gxlsx>Excel</button>'+(GS?'':(gs.length?'<button class="btn ghost" data-gselmode>Seleccionar</button>':''))+'<button class="btn" data-newg>Nuevo gasto</button>')+gbar+
   '<section class="card"><div class="scroll"><table><thead><tr>'+(GS?'<th></th>':'')+'<th>Día</th><th>Categoría</th><th>Gasto</th><th class="r">Monto</th><th class="r">Neto</th><th class="r">IVA</th><th class="r">Total pagado</th><th style="width:70px"></th></tr></thead><tbody>'+
   (rows||'<tr><td colspan="8" class="empty">Aún no registras gastos este mes. Usa “Nuevo gasto” para agregar el primero, o “Excel” para cargar muchos de una vez.</td></tr>')+
   (rows?'<tr class="tot"><td colspan="'+(GS?5:4)+'">Total del mes</td><td class="r">'+$$(N)+'</td><td class="r">'+$$(I)+'</td><td class="r">'+$$(T)+'</td><td></td></tr>':'')+'</tbody></table></div>'+
   '<p class="note">El monto neto de estos gastos es el que se descuenta de tus ventas en el Panel. El IVA se usa para estimar el IVA por pagar.</p></section>';
}
function openGastoEdit(id){
  var g=gastos.find(function(q){return q.id===id}); if(!g)return;
  openGasto(); var f=$("#gf"); f.dataset.edit=g.id; f.querySelector("h2").textContent="Editar gasto";
  $("#g_f").value=g.fecha; var k=$("#g_k"); if(![].some.call(k.options,function(o){return o.value===g.cat})){var o=document.createElement("option");o.textContent=g.cat;k.insertBefore(o,k.firstChild)} k.value=g.cat;
  $("#g_n").value=g.nombre; $("#g_m").value=mfmt(g.monto);
  var r=document.querySelector('input[name="giva"][value="'+(g.iva||"incl")+'"]'); if(r)r.checked=true;
  f.querySelector("button[type=submit]").textContent="Guardar cambios"; gprev();
}
function openGasto(){
  var d=$("#dlg");
  d.innerHTML='<form class="dlg" id="gf"><header><h2 style="font-size:1.62rem">Nuevo gasto</h2><button type="button" class="ib" data-close aria-label="Cerrar">✕</button></header>'+
  '<div class="f"><label>Fecha<input type="date" id="g_f" required value="'+cur.y+'-'+String(cur.m+1).padStart(2,"0")+'-15"></label>'+
  '<label>Categoría<select id="g_k">'+gcats.map(function(c){return '<option>'+esc(c)+'</option>'}).join("")+'<option value="__new">+ Crear categoría nueva</option></select></label>'+
  '<label class="w" id="g_nk" hidden>Nombre de la categoría nueva<input type="text" id="g_nkv" placeholder="Ej.: Packaging"></label>'+
  '<label class="w">Nombre del gasto<input type="text" id="g_n" required placeholder="Ej.: Compra de mantequilla"></label>'+
  '<label class="w">Monto<input type="text" class="money" inputmode="numeric" id="g_m" required value="$ 0"></label>'+
  '<div class="w rad" role="radiogroup" aria-label="IVA"><label><input type="radio" name="giva" value="incl" checked><span><b>El monto incluye IVA</b><br><span style="color:var(--soft)">Descontamos el IVA para calcular el gasto neto.</span></span></label>'+
  '<label><input type="radio" name="giva" value="mas"><span><b>El monto no incluye IVA</b><br><span style="color:var(--soft)">Le sumamos el IVA para saber cuánto pagas en total.</span></span></label>'+
  '<label><input type="radio" name="giva" value="no"><span><b>No lleva IVA</b><br><span style="color:var(--soft)">Sueldos, préstamos y otros gastos exentos.</span></span></label></div>'+
  '<div class="w prev" id="g_prev"></div></div>'+
  '<div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn ghost" data-close>Cancelar</button><button class="btn" type="submit">Guardar gasto</button></div></form>';
  d.showModal(); gprev();
}
function gmode(){var r=document.querySelector('input[name="giva"]:checked');return r?r.value:"incl"}
function gprev(){var g={monto:mnum($("#g_m").value),iva:gmode()};$("#g_prev").innerHTML='<dl class="kv"><dt>Gasto neto</dt><dd>'+$$(gN(g))+'</dd><dt>IVA</dt><dd>'+$$(gI(g))+'</dd><dt>Total pagado</dt><dd><b>'+$$(gN(g)+gI(g))+'</b></dd></dl>'}
function openGrp(){
  var d=$("#dlg");
  d.innerHTML='<form class="dlg" id="grpf"><header><h2 style="font-size:1.62rem">Nueva categoría de costo</h2><button type="button" class="ib" data-close aria-label="Cerrar">✕</button></header>'+
  '<label style="display:flex;flex-direction:column;gap:4px;font-size:.85rem;color:var(--soft)">Nombre<input type="text" id="grp_n" required placeholder="Ej.: Transporte, Decoración extra, Moldes"></label><label class="chk" style="font-size:.9rem;color:var(--ink)"><input type="checkbox" id="grp_b" checked> Se incluye en Compras <span style="color:var(--soft);font-size:.85em">(desmárcalo para mano de obra o gastos fijos)</span></label>'+
  '<div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn ghost" data-close>Cancelar</button><button class="btn" type="submit">Crear categoría</button></div></form>';
  d.showModal();
}

/* ---------- AJUSTES ---------- */
function vCfg(){
  return head("Ajustes")+'<div class="grid" style="max-width:720px">'+
  '<section class="card"><h2 style="font-size:1.38rem">Tu pastelería</h2><div class="logoedit" style="margin-top:12px"><img src="'+logoSrc()+'" alt="Logo"><label class="btn ghost sm" style="cursor:pointer">Cambiar logo<input type="file" accept="image/*" hidden id="cl"></label></div>'+
  '<label style="display:flex;flex-direction:column;gap:4px;font-size:.85rem;color:var(--soft);margin-top:14px">Nombre<input type="text" id="cn" value="'+esc(cfg.nombre)+'"></label><p class="note">El logo y el nombre aparecen en el menú y, más adelante, en tus cotizaciones en PDF.</p></section>'+
  '<section class="card manualc"><div><h2 style="font-size:1.38rem">Manual de uso</h2><p class="note" style="margin:2px 0 0">Guía completa de Dulcia, paso a paso y con imágenes: recetas, precios, pedidos, producción, compras, inventario y más. Se actualiza con cada mejora de la app.</p></div><a class="btn" href="/manual-dulcia.pdf" target="_blank" rel="noopener" download="Manual-Dulcia.pdf">Descargar manual (PDF)</a></section>'+
  '<section class="card"><h2 style="font-size:1.38rem">Cómo calcular tu resultado</h2><p class="note" style="margin-top:2px">Así el Panel no cuenta dos veces lo que gastas en ingredientes.</p>'+
  '<div class="rad" role="radiogroup" aria-label="Cómo calcular tu resultado" style="margin-top:10px"><label><input type="radio" name="costeo" value="real"'+(cfg.costeo!=="estimado"?' checked':'')+'><span><b>Anoto todas mis compras en Gastos</b><br><span style="color:var(--soft)">Ingredientes, materiales y gastos fijos. Resultado = ventas netas − gastos.</span></span></label>'+
  '<label><input type="radio" name="costeo" value="estimado"'+(cfg.costeo==="estimado"?' checked':'')+'><span><b>En Gastos anoto solo gastos fijos</b><br><span style="color:var(--soft)">Arriendo, luz, sueldos. Los ingredientes se estiman con el margen de cada categoría.</span></span></label></div></section>'+
  (window.NO_P2?'':'<section class="card"><h2 style="font-size:1.38rem">Mano de obra</h2><p class="note" style="margin-top:2px">Cuánto cuesta 1 hora de trabajo de tu equipo. Se usa para el costo de cada receta.</p><div class="eqsum"><div><span class="big" style="font-size:1.6rem">'+$$(vhora())+'</span> <span class="note">por hora</span><div class="note" style="margin:2px 0 0">'+(EQ.length?EQ.length+' persona'+(EQ.length===1?'':'s')+' · '+$$(eqS())+' al mes · '+fq(EQ.reduce(function(a,p){return a+(+p.h||0)},0))+' h a la semana':'Aún no anotas a tu equipo.')+'</div></div><button class="btn ghost sm" data-equipo>'+(EQ.length?'Editar equipo':'Calcular valor hora')+'</button></div></section>')+
  (window.NO_P2?'':'<section class="card"><h2 style="font-size:1.38rem">Venta mayorista</h2><p class="note" style="margin-top:2px">Costos de cada pedido mayorista. Con ellos, cada receta te dice cuántas unidades mínimas pedir para que convenga. Una receta puede usar su propio packaging o despacho.</p>'+
  '<div class="f" style="margin-top:10px"><label>Despacho por pedido<input type="text" class="money" inputmode="numeric" id="myd" value="'+mfmt(MAY.desp)+'"></label><label>Packaging por unidad<input type="text" class="money" inputmode="numeric" id="myp" value="'+mfmt(MAY.pack)+'"></label>'+
  '<label>Horas de coordinación por pedido<input type="number" id="myc" min="0" step="0.25" value="'+(+MAY.coord||0)+'"></label><label>% por factura o pago a 30 días<input type="number" id="myf" min="0" max="100" step="0.5" value="'+(+MAY.fact||0)+'"></label></div>'+
  '<p class="note">La coordinación se valoriza con el valor de la hora de trabajo ('+$$(vhora())+'/h, en Mano de obra).</p></section>')+
  '<section class="card"><h2 style="font-size:1.38rem">Capacidad diaria</h2><p class="note" style="margin-top:2px">Te avisamos cuando un día ya llegó a este número de pedidos y vas a agregar otro. Pon 0 para no recibir avisos.</p>'+
  '<label style="display:flex;flex-direction:column;gap:4px;font-size:.85rem;color:var(--soft);margin-top:10px;max-width:220px">Pedidos por día antes de avisar<input type="number" id="cp" min="0" value="'+cfg.cap+'"></label></section>'+
  '<section class="card"><h2 style="font-size:1.38rem">Cotizaciones</h2><p class="note" style="margin-top:2px">Estos datos y condiciones salen en el PDF. Cada cotización parte con estas condiciones y puedes cambiarlas en esa cotización.</p>'+
  '<div class="f" style="margin-top:10px"><label>Teléfono o WhatsApp<input type="text" id="ct" value="'+esc(cfg.tel)+'"></label><label>Correo<input type="text" id="cm" value="'+esc(cfg.mail)+'" placeholder="contacto@tupasteleria.cl"></label><label>Validez (días)<input type="number" id="cv" min="1" value="'+cfg.vig+'"></label><label>Abono para reservar (%)<input type="number" id="ca" min="0" max="100" value="'+cfg.abono+'"></label></div>'+
  '<label style="display:flex;flex-direction:column;gap:4px;font-size:.85rem;color:var(--soft);margin-top:12px">Condiciones (una por línea)<textarea id="cc" rows="8">'+esc(cfg.cond)+'</textarea></label></section>'+
  '<section class="card"><h2 style="font-size:1.38rem">Google Calendar automático</h2>'+(window.calBox?window.calBox():"")+'</section>'+
  '<section class="card"><h2 style="font-size:1.38rem">Tu plan</h2>'+(window.planBox?window.planBox():"")+'</section>'+
  '<section class="card"><h2 style="font-size:1.38rem">Tu cuenta</h2><p class="note" style="margin-top:2px">Sesión iniciada como <b>'+esc(window.USER_EMAIL||"")+'</b>.</p><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><button class="btn ghost sm" data-logout>Cerrar sesión</button>'+(window.IS_ADMIN?'<a class="btn sm" href="/admin" target="_blank" rel="noopener">Panel de administración</a>':'')+'</div></section>'+
'<section class="card"><h2 style="font-size:1.38rem">Instala Dulcia en tu celular</h2><p class="note" style="margin-top:2px">Así la abres con un toque, como cualquier app, sin buscar el link.</p><p style="margin:10px 0 4px"><b>iPhone (Safari)</b></p><ol class="note" style="margin:0;padding-left:1.2em"><li>Abre Dulcia en <b>Safari</b>.</li><li>Toca el botón <b>Compartir</b> (el cuadrado con la flecha hacia arriba).</li><li>Elige <b>Agregar a pantalla de inicio</b> y toca <b>Agregar</b>.</li></ol><p style="margin:10px 0 4px"><b>Android (Chrome)</b></p><ol class="note" style="margin:0;padding-left:1.2em"><li>Abre Dulcia en <b>Chrome</b>.</li><li>Toca los <b>tres puntos</b> de arriba a la derecha.</li><li>Elige <b>Instalar app</b> o <b>Agregar a la pantalla principal</b>.</li></ol></section>'+
  '<section class="card"><h2 style="font-size:1.38rem">Próximamente</h2><p class="note" style="margin-top:2px">Conexión con la tienda web de tu pastelería, ayudantes con acceso propio e inventario.</p></section>'+
  '</div>';
}

function dayWarn(iso,exId,ok,back){
  var ex=real().filter(function(o){return o.fecha===iso&&o.id!==exId}).sort(function(a,b){return a.hora<b.hora?-1:1});
  if(cfg.cap<=0||ex.length<cfg.cap)return false;
  var n=ex.length, d=$("#dlg2");
  window._d2ok=ok;window._d2back=back;
  d.innerHTML='<div class="dlg"><header><h2 style="font-size:1.56rem">Ese día ya tiene '+n+' pedido'+(n===1?'':'s')+'</h2><button class="ib" data-d2="back" aria-label="Cerrar">✕</button></header>'+
   '<p style="margin:0">'+esc(fechaLarga(iso))+' ya tiene <b>'+n+' pedido'+(n===1?'':'s')+'</b>. Tu límite es '+cfg.cap+'. Con este serían <b>'+(n+1)+'</b>. Revisa si alcanzas a producirlos antes de aceptar.</p>'+
   '<div class="grid" style="gap:6px">'+ex.map(function(o){return '<div class="crow" style="border-bottom:0;background:var(--bg);border-radius:10px;padding:8px 10px"><b style="min-width:3.2em">'+o.hora+'</b><span style="flex:1;min-width:0;overflow-wrap:anywhere">'+esc(o.cliente)+' <span class="note" style="margin:0">· '+esc(o.cat)+'</span></span></div>'}).join("")+'</div>'+
   '<div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap"><button class="btn ghost" data-d2="back">Cambiar fecha</button><button class="btn" data-d2="go">Agregar igual</button></div></div>';
  d.showModal();return true;
}
function extra(t){
  if(t.dataset.d2){var d2=$("#dlg2"),go=window._d2ok,bk=window._d2back;window._d2ok=window._d2back=null;d2.close();if(t.dataset.d2==="go"){if(go)go()}else if(bk)bk();return true}
  if(t.hasAttribute("data-logout")){doLogout();return true}
  if(t.dataset.ics){icsDownload(orders.find(function(q){return q.id===+t.dataset.ics}));return true}
  if(t.dataset.gc){var a=t.dataset.gc;if(a==="yes")cfg.gcal=true;else if(a==="toggle")cfg.gcal=!cfg.gcal;cfg.asked=true;render();return true}
  if(t.hasAttribute("data-newg")){openGasto();return true}
  if(t.hasAttribute("data-undo")){var u=window._undo;window._undo=null;$("#toast").hidden=true;if(u)u();if(catsOpen&&$("#dlg").open)openCats(catsOpen);else render();return true}
  if(t.dataset.cats){openCats(t.dataset.cats);return true}
  if(t.dataset.delcat!==undefined){delCat(catsOpen,+t.dataset.delcat);return true}
  if(t.dataset.sel){selR(+t.dataset.sel);render();return true}
  if(t.hasAttribute("data-savecot")){var fm=$("#nf");if(fm.reportValidity()){window._cot=true;fm.requestSubmit()}return true}
  if(t.dataset.confirm){var xc=orders.find(function(q){return q.id===+t.dataset.confirm});
    if(!xc._okW&&dayWarn(xc.fecha,xc.id,function(){xc._okW=true;t.click()},null))return true;xc._okW=false;xc.cot=false;var pc=pd(xc.fecha);cur={y:pc.getFullYear(),m:pc.getMonth()};render();openOrder(xc.id);toast("Pedido confirmado. Ya cuenta en el calendario y el panel.");return true}
  if(t.dataset.pdf){genPdf(+t.dataset.pdf);return true}
  if(t.hasAttribute("data-newr")){openNewR();return true}
  if(t.hasAttribute("data-delr")){delR();render();return true}
  if(t.hasAttribute("data-dupr")){var src=rp,cp=JSON.parse(JSON.stringify(src));cp.id=rid++;cp.nombre=src.nombre+" (copia)";recipes.push(cp);selR(cp.id);render();return true}
  if(t.dataset.delgrp!==undefined){var gp=groups()[+t.dataset.delgrp],rm=[];recipe.forEach(function(r,i){if(r.g===gp)rm.push({i:i,r:r})});
    for(var k=rm.length-1;k>=0;k--)recipe.splice(rm[k].i,1);
    toast("Categoría de costo “"+gp+"” eliminada",function(){rm.forEach(function(z){recipe.splice(z.i,0,z.r)})});render();return true}
  if(t.dataset.w){wk=addDays(wk,+t.dataset.w);CR=null;render();return true}
  if(t.hasAttribute("data-copyc")){copiarLista();return true}
  if(t.hasAttribute("data-gselmode")){gSelMode=!gSelMode;gSel={};render();return true}
  if(t.hasAttribute("data-gselall")){var gv=window._gvis||[],ga=gv.length&&gv.every(function(i){return gSel[i]});gSel={};if(!ga)gv.forEach(function(i){gSel[i]=1});render();return true}
  if(t.hasAttribute("data-gseldel")){var gids=Object.keys(gSel).map(Number);if(!gids.length)return true;
    var gt=gids.reduce(function(a,i){var g=gastos.find(function(q){return q.id===i});return a+(g?+g.monto||0:0)},0),d3=$("#dlg");
    d3.innerHTML='<div class="dlg" style="max-width:440px"><header><h2 style="font-size:1.5rem">¿Eliminar '+gids.length+' gasto'+(gids.length===1?'':'s')+'?</h2><button class="ib" data-close aria-label="Cerrar">✕</button></header><p style="margin:0">Suman '+$$(gt)+'.</p><p class="note" style="margin:0">Después de eliminar tendrás unos segundos para tocar “Deshacer”.</p><div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn ghost" data-close>Cancelar</button><button class="btn danger-f" data-gseldelok>Eliminar '+gids.length+'</button></div></div>';
    if(!d3.open)d3.showModal();return true}
  if(t.hasAttribute("data-gseldelok")){gDelIds(Object.keys(gSel).map(Number));return true}
  if(t.hasAttribute("data-selmode")){selMode=!selMode;sel={};render();return true}
  if(t.dataset.selo){var si=+t.dataset.selo;if(sel[si])delete sel[si];else sel[si]=1;render();return true}
  if(t.hasAttribute("data-selall")){var vis=window._pvis||[],all=vis.length&&vis.every(function(i){return sel[i]});sel={};if(!all)vis.forEach(function(i){sel[i]=1});render();return true}
  if(t.hasAttribute("data-seldel")){var ids=Object.keys(sel).map(Number);if(!ids.length)return true;
    var tt=ids.reduce(function(a,i){var o=orders.find(function(q){return q.id===i});return a+(o?+o.total||0:0)},0),d2=$("#dlg");
    d2.innerHTML='<div class="dlg" style="max-width:440px"><header><h2 style="font-size:1.5rem">¿Eliminar '+ids.length+' pedido'+(ids.length===1?'':'s')+'?</h2><button class="ib" data-close aria-label="Cerrar">✕</button></header><p style="margin:0">Suman '+$$(tt)+'. Se borran con sus recetas y fotos.</p><p class="note" style="margin:0">Después de eliminar tendrás unos segundos para tocar “Deshacer”.</p><div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn ghost" data-close>Cancelar</button><button class="btn danger-f" data-seldelok>Eliminar '+ids.length+'</button></div></div>';
    if(!d2.open)d2.showModal();return true}
  if(t.hasAttribute("data-seldelok")){var keep=[],gone=[];orders.forEach(function(o,i){if(sel[o.id])gone.push({i:i,o:o});else keep.push(o)});
    orders.length=0;keep.forEach(function(o){orders.push(o)});sel={};selMode=false;$("#dlg").close();render();
    toast(gone.length+" pedido"+(gone.length===1?" eliminado":"s eliminados"),function(){gone.forEach(function(z){orders.splice(Math.min(z.i,orders.length),0,z.o)})});return true}
  if(t.dataset.delo){var oi=orders.findIndex(function(q){return q.id===+t.dataset.delo});var od=orders.splice(oi,1)[0];$("#dlg").close();
    toast("Pedido de “"+od.cliente+"” eliminado",function(){orders.splice(oi,0,od)});return true}
  if(t.dataset.ladd){var xo=orders.find(function(q){return q.id===+t.dataset.ladd});xo.items=xo.items||[];xo.items.push({rid:recipes[0].id,q:1,p:window.NO_PM?null:precioStd(recipes[0],xo.tc)});openOrder(xo.id);return true}
  if(t.dataset.ltot){var xt=orders.find(function(q){return q.id===+t.dataset.ltot});xt.total=oTot(xt);if(xt.pagado>xt.total)xt.pagado=xt.total;openOrder(xt.id);render();toast("Total del pedido: "+$$(xt.total));return true}
  if(t.dataset.ldel){var pl=t.dataset.ldel.split(":"),xl=orders.find(function(q){return q.id===+pl[0]});xl.items.splice(+pl[1],1);openOrder(xl.id);return true}
  if(t.dataset.pdel){var pp=t.dataset.pdel.split(":"),xp=orders.find(function(q){return q.id===+pp[0]});xp.fotos.splice(+pp[1],1);openOrder(xp.id);return true}
  if(t.dataset.gedit){openGastoEdit(+t.dataset.gedit);return true}
  if(t.dataset.gdel){var gi=gastos.findIndex(function(g){return g.id===+t.dataset.gdel});var g0=gastos.splice(gi,1)[0];toast("Gasto “"+g0.nombre+"” eliminado",function(){gastos.splice(gi,0,g0)});render();return true}
  if(t.dataset.addrow!==undefined){insertRow(groups()[+t.dataset.addrow]);render();return true}
  if(t.dataset.delrow!==undefined){var ri=+t.dataset.delrow,r0=recipe.splice(ri,1)[0];toast("Ítem “"+r0.n+"” eliminado",function(){recipe.splice(ri,0,r0)});render();return true}
  if(t.hasAttribute("data-addgrp")){openGrp();return true}
  if(t.hasAttribute("data-usehour")){var v=Math.round(hora.sueldo/Math.max(1,hora.horas));var r=recipe.find(function(x){return x.n==="Horas de trabajo"});
    if(!window.NO_ING){var hx=ingFind("Horas de trabajo","h");if(!hx){hx={id:iid++,n:"Horas de trabajo",u:"h",c:v,e:1,pe:v,g:M};ings.push(hx)}hx.e=1;hx.pe=v;ingPrice(hx,v)}
    if(r){r.c=v}else{recipe.push({g:"Mano de obra y gastos",n:"Horas de trabajo",q:1,u:"h",c:v})}render();return true}
  return false;
}
function extraChange(t){
  if(t.id==="cl"){readFiles(t.files,function(u){cfg.logo=u;cfg.logoData=u;cfg.logoDirty=true;render()},400);return true}
  if(t.id==="g_k"){$("#g_nk").hidden=t.value!=="__new";return true}
  if(t.id==="n_k"){$("#n_nkw").hidden=t.value!=="__new";return true}
  if(t.dataset&&t.dataset.gbuy!==undefined){gbuy[groups()[+t.dataset.gbuy]]=t.checked;var cx=t.closest("div")&&t.closest("div").querySelector(".chkx");if(cx)cx.textContent=t.checked?"Estos ítems suman a tu lista de compras de la semana.":"No va a Compras: úsalo para gas, luz u otros costos que no compras por pedido.";return true}
  if(t.dataset&&t.dataset.lr){var a=t.dataset.lr.split(":"),ox=orders.find(function(q){return q.id===+a[0]}),li=ox.items[+a[1]];li.rid=+t.value;if(!window.NO_PM){li.p=precioStd(recipes.find(function(r){return r.id===li.rid}),ox.tc);openOrder(ox.id)}return true}
  if(t.name==="giva"){gprev();return true}
  return false;
}
function extraInput(t){
  if(t.id==="cn"){cfg.nombre=t.value;Array.prototype.forEach.call(document.querySelectorAll(".bn"),function(b){b.textContent=t.value});return true}
  if(t.id==="cu"){cfg.url=t.value;return true}
  if(t.name==="costeo"){cfg.costeo=t.value==="estimado"?"estimado":"real";return true}
  if(t.id==="cp"){cfg.cap=Math.max(0,parseInt(t.value)||0);return true}
  if(t.id==="ct"){cfg.tel=t.value;return true}
  if(t.id==="cm"){cfg.mail=t.value;return true}
  if(t.id==="cv"){cfg.vig=Math.max(1,parseInt(t.value)||7);return true}
  if(t.id==="ca"){cfg.abono=Math.min(100,Math.max(0,parseFloat(t.value)||0));return true}
  if(t.id==="cc"){cfg.cond=t.value;return true}
  if(t.dataset&&t.dataset.cond){var qo=orders.find(function(q){return q.id===+t.dataset.cond});if(qo)qo.cond=t.value;return true}
  if(t.dataset&&t.dataset.vig){var qv=orders.find(function(q){return q.id===+t.dataset.vig});if(qv)qv.vig=Math.max(1,parseInt(t.value)||7);return true}
  if(t.id==="hs"||t.id==="hh"){hora[t.id==="hs"?"sueldo":"horas"]=t.id==="hs"?mnum(t.value):(parseFloat(t.value)||0);rsum();return true}
  if(t.id==="g_m"){gprev();return true}
  if(t.dataset&&t.dataset.lq){var a=t.dataset.lq.split(":"),oq=orders.find(function(q){return q.id===+a[0]});oq.items[+a[1]].q=parseFloat(t.value)||0;lnSync(oq);return true}
  if(t.dataset&&t.dataset.lp){var a2=t.dataset.lp.split(":"),op=orders.find(function(q){return q.id===+a2[0]});op.items[+a2[1]].p=pIn(mnum(t.value),op.tc);lnSync(op);return true}
  if(t.dataset&&t.dataset.pcol!==undefined){var pci=+t.dataset.pcol;pcats[pci].col=t.value;var sw=document.getElementById("sw"+pci);if(sw)sw.className="sw cc-"+t.value;return true}
  if(t.dataset&&t.dataset.pm!==undefined){pcats[+t.dataset.pm].m=Math.min(100,Math.max(0,parseFloat(t.value)||0))/100;return true}
  if(t.id==="rn"){rp.nombre=t.value;var b=document.querySelector(".rc.on b");if(b)b.textContent=t.value;return true}
  if(t.id==="run"){rp.un=Math.max(1,Math.round(+t.value||1));rsum();return true}
  if(t.id==="rud"){rp.ud=t.value;rsum();return true}
  if(t.id==="rr"){rp.rinde=t.value;var s=document.querySelector(".rc.on span");if(s)s.textContent=t.value;return true}
  return false;
}
function extraSubmit(f){
  if(f.id==="gf"){
    var k=$("#g_k").value; if(k==="__new"){k=$("#g_nkv").value.trim()||"Otros"; if(gcats.indexOf(k)<0)gcats.push(k)}
    var d=pd($("#g_f").value);
    var ge=f.dataset.edit?gastos.find(function(q){return q.id===+f.dataset.edit}):null;
    if(ge){ge.fecha=$("#g_f").value;ge.cat=k;ge.nombre=$("#g_n").value.trim();ge.monto=mnum($("#g_m").value);ge.iva=gmode();toast("Gasto actualizado")}
    else gastos.push({id:gid++,fecha:$("#g_f").value,cat:k,nombre:$("#g_n").value.trim(),monto:mnum($("#g_m").value),iva:gmode()});
    cur={y:d.getFullYear(),m:d.getMonth()}; $("#dlg").close();
  } else if(f.id==="grpf"){
    var gn=$("#grp_n").value.trim(); gbuy[gn]=$("#grp_b").checked;
    recipe.push({g:gn,n:"",q:1,u:"",c:0}); $("#dlg").close();
  } else if(f.id==="catf"){
    var nm=$("#cat_n").value.trim(); if(!nm)return;
    if(catsOpen==="ped"){if(!pcats.some(function(p){return p.n===nm}))pcats.push({n:nm,m:Math.min(100,Math.max(0,parseFloat($("#cat_m").value)||70))/100})}
    else if(gcats.indexOf(nm)<0)gcats.push(nm);
    window._undo=null;openCats(catsOpen);
  } else if(f.id==="newrf"){
    var base=$("#nr_c").value, nr=base?JSON.parse(JSON.stringify(recipes.find(function(q){return q.id===+base}))):{margen:70,precio:0,items:[{g:"Ingredientes",n:"",q:1,u:"",c:0}]};
    nr.id=rid++;nr.nombre=$("#nr_n").value.trim();nr.rinde=$("#nr_r").value.trim()||nr.rinde||"";recipes.push(nr);selR(nr.id);$("#dlg").close();
  }
}

/* ---------- DIALOGOS ---------- */
var TCL={minorista:"Minorista (público)",mayorista:"Mayorista (cafetería, reventa)"};
var clis=[],cid=1,CLQ="",CLF="";
function cliPrecio(c,r,tc){if(c&&c.pr&&c.pr[r.id]!=null&&c.pr[r.id]!=="")return +c.pr[r.id];return precioStd(r,tc)}
function oSub(x){return (x.items||[]).reduce(function(a,l){return a+(+l.q||0)*lnP(l,x.tc)},0)}
function oDsc(x,sub){return x.dsct==="porcentaje"?Math.round(sub*(+x.dsc||0)/100):Math.round((+x.dsc||0)*(x.tc==="mayorista"?IVA:1))}
function oTot(x){var s0=oSub(x);return Math.round(s0+(+x.desp||0)-oDsc(x,s0))}
function cliStats(c){var l=real().filter(function(o){return o.cid===c.id}),t=l.reduce(function(a,o){return a+(+o.total||0)},0),u=l.reduce(function(a,o){return o.fecha>a?o.fecha:a},"");return {n:l.length,t:t,u:u}}
function cliFind(nm){var k=xNorm(nm);return k?clis.find(function(c){return xNorm(c.n)===k}):null}
function esH(it){return String(it.u||"").trim().toLowerCase()==="h"}
function migH(){ // las "horas de trabajo" que estaban como ítem pasan al tiempo de trabajo con manos
  if(window.NO_P2)return;var n=0;
  recipes.forEach(function(r){var hs=(r.items||[]).filter(esH);if(!hs.length)return;
    if(!(+r.ta))r.ta=Math.round(hs.reduce(function(a,it){return a+(+it.q||0)},0)*60);
    for(var i=r.items.length-1;i>=0;i--)if(esH(r.items[i]))r.items.splice(i,1);n++});
  if(rp&&rp.items)recipe=rp.items;
  if(!window.NO_ING)for(var j=ings.length-1;j>=0;j--)if(esH(ings[j])&&!ingUses(ings[j]))ings.splice(j,1);
  if(n)setTimeout(function(){toast(n===1?"La mano de obra de 1 receta pasó a “Trabajo con manos”":"La mano de obra de "+n+" recetas pasó a “Trabajo con manos”")},400);
}
function cliAutoImport(){ // la primera vez, los clientes de los pedidos pasan a ser clientes guardados
  if(window.NO_CLI||clis.length||!orders.length)return;var key="dulcia_cliimp_"+((window.CUENTA||{}).negocio_id||"");try{if(localStorage.getItem(key))return;localStorage.setItem(key,"1")}catch(e){}
  var n=0;orders.slice().sort(function(a,b){return (a.fecha+a.hora)<(b.fecha+b.hora)?-1:1}).forEach(function(o){var nm=String(o.cliente||"").trim();if(!nm)return;
    var c=clis.find(function(z){return (o.wa&&z.wa===o.wa)||(o.ig&&z.ig&&z.ig.toLowerCase()===o.ig.toLowerCase())||xNorm(z.n)===xNorm(nm)});
    if(!c){c={id:cid++,n:nm,tipo:"minorista",wa:"",ig:"",mail:"",rs:"",rut:"",giro:"",dir:"",com:"",notas:"",pr:{},may:0};clis.push(c);n++}
    if(o.wa)c.wa=o.wa;if(o.ig)c.ig=o.ig;if(o.tc==="mayorista")c.may=(c.may||0)+1;o.cid=c.id});
  clis.forEach(function(c){if(c.may)c.tipo="mayorista";delete c.may});
  if(n)setTimeout(function(){toast(n+" cliente"+(n===1?"":"s")+" creado"+(n===1?"":"s")+" desde tus pedidos. Revísalos en Clientes.")},400);
}
function vCli(){
  var top=head("Clientes",'<input type="search" id="cliq" placeholder="Buscar cliente" aria-label="Buscar cliente" value="'+esc(CLQ)+'" style="max-width:240px">'+'<button class="btn ghost" data-clix>Excel</button>'+'<button class="btn" data-clinew>Nuevo cliente</button>');
  if(window.NO_CLI)return top+'<div class="card empty">Falta un paso en la base de datos para guardar clientes. Avísale a soporte.</div>';
  var q=xNorm(CLQ),l=clis.filter(function(c){return (!CLF||c.tipo===CLF)&&(!q||xNorm(c.n+" "+c.wa+" "+c.ig+" "+c.rs+" "+c.rut).indexOf(q)>=0)}).sort(function(a,b){return a.n.localeCompare(b.n,"es",{sensitivity:"base"})});
  var nm=clis.filter(function(c){return c.tipo==="mayorista"}).length;
  var chips='<div class="segs">'+[["","Todos",clis.length],["minorista","Minoristas",clis.length-nm],["mayorista","Mayoristas",nm]].map(function(z){return '<button class="segc'+(CLF===z[0]?' on':'')+'" data-clf="'+z[0]+'">'+z[1]+' · '+z[2]+'</button>'}).join("")+'</div>';
  var rows=l.map(function(c){var st=cliStats(c);return '<tr class="clir" data-cliedit="'+c.id+'"><td><b>'+esc(c.n)+'</b>'+(c.rs?'<div class="note" style="margin:0">'+esc(c.rs)+(c.rut?' · '+esc(c.rut):'')+'</div>':'')+'</td><td><span class="st '+(c.tipo==="mayorista"?'regalo':'pagando')+'">'+(c.tipo==="mayorista"?'Mayorista':'Minorista')+'</span></td><td>'+(c.wa?esc(waFmt(c.wa)):'')+(c.ig?'<div class="note" style="margin:0">@'+esc(c.ig)+'</div>':'')+(!c.wa&&!c.ig?'<span class="note" style="margin:0">—</span>':'')+'</td><td class="r">'+st.n+'</td><td class="r">'+$$(st.t)+'</td><td>'+(st.u?dmy(st.u):'—')+'</td><td class="r"><button class="btn ghost sm" data-clinp="'+c.id+'">Nuevo pedido</button></td></tr>'}).join("");
  return top+'<p class="note" style="margin:-6px 0 12px">Guarda a tus clientes una vez y elígelos al crear un pedido: se completan solos su contacto, su tipo de precio y sus precios especiales.</p>'+chips+
    '<section class="card">'+(l.length?'<div class="scroll"><table class="pg ctl"><thead><tr><th>Cliente</th><th>Tipo</th><th>Contacto</th><th class="r">Pedidos</th><th class="r">Total comprado</th><th>Último pedido</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div>':'<div class="empty">'+(clis.length?'No hay clientes con ese filtro.':'Aún no tienes clientes guardados. Crea el primero con “Nuevo cliente”.')+'</div>')+'</section>';
}
var CLH=["Cliente","Tipo","WhatsApp","Instagram","Correo","Razón social","RUT","Giro","Dirección","Comuna","Notas"];
function openCliX(){var d=$("#dlg");
  d.innerHTML='<div class="dlg"><header><h2 style="font-size:1.62rem">Clientes en Excel</h2><button type="button" class="ib" data-close aria-label="Cerrar">✕</button></header>'+
  '<ol style="margin:0;padding-left:20px;line-height:1.6"><li>Descarga tus clientes (o la plantilla) y ábrela en Excel o Google Sheets.</li><li>Corrige o agrega filas: una por cliente. En la hoja “Precios especiales” anota cliente, producto y precio.</li><li>Súbela aquí. Antes de cargar te mostramos qué se crea y qué se actualiza.</li></ol>'+
  '<div style="display:flex;gap:8px;flex-wrap:wrap">'+(clis.length?'<button type="button" class="btn ghost" data-clixls>Descargar mis clientes ('+clis.length+')</button>':'')+'<button type="button" class="btn ghost" data-clitpl>Descargar plantilla</button><label class="btn" style="cursor:pointer">Subir mi Excel<input type="file" id="cliimp" accept=".xlsx,.xls,.csv" hidden></label></div>'+
  '<p class="note" style="margin:0">Cada fila se busca por RUT y, si no tiene, por nombre: si existe se actualiza, si no se crea. <b>Las celdas vacías no borran datos.</b> Tipo: Minorista o Mayorista.</p><div id="climsg"></div></div>';
  if(!d.open)d.showModal()}
function cliTemplate(){xlsxLib().then(function(X){var ws=X.utils.aoa_to_sheet([CLH,["Café del Puerto","Mayorista","+56 9 5555 1234","@cafedelpuerto","compras@cafedelpuerto.cl","Café del Puerto SpA","76.123.456-7","Cafetería","Av. Angelmó 1234","Puerto Montt","Entregar antes de las 9:00"],["Javiera Soto","Minorista","+56 9 1234 5678","@javi.soto","","","","","","",""]]);ws["!cols"]=[26,11,16,18,26,26,14,18,28,16,40].map(function(w){return {wch:w}});
  var r0=recipes[0],w2=X.utils.aoa_to_sheet([["Cliente","Producto","Precio especial (con IVA)"],["Café del Puerto",r0?r0.nombre:"Galletas chips",850]]);w2["!cols"]=[26,26,22].map(function(w){return {wch:w}});
  var wb=X.utils.book_new();X.utils.book_append_sheet(wb,ws,"Clientes");X.utils.book_append_sheet(wb,w2,"Precios especiales");X.writeFile(wb,"Plantilla_clientes_Dulcia.xlsx");toast("Plantilla descargada")}).catch(function(e){toast(e.message)})}
function rutK(r){return String(r||"").replace(/[^0-9kK]/g,"").toLowerCase()}
function cliParse(buf,X){
  var wb=X.read(buf,{type:"array",raw:true}),ws=wb.Sheets["Clientes"]||wb.Sheets[wb.SheetNames[0]],aoa=X.utils.sheet_to_json(ws,{header:1,defval:"",raw:true}),hi=-1,col={};
  var mapa={cliente:"n",nombre:"n",tipo:"tipo",tipodecliente:"tipo",whatsapp:"wa",telefono:"wa",instagram:"ig",correo:"mail",email:"mail",razonsocial:"rs",rut:"rut",giro:"giro",direccion:"dir",comuna:"com",notas:"notas"};
  for(var i=0;i<Math.min(aoa.length,15)&&hi<0;i++){var h=aoa[i].map(xNorm);if(h.indexOf("cliente")>=0||h.indexOf("nombre")>=0)hi=i}
  if(hi<0)throw new Error("No encontramos la columna “Cliente”. Usa la plantilla de Dulcia.");
  aoa[hi].forEach(function(h,j){var k=mapa[xNorm(h)];if(k&&col[k]==null)col[k]=j});
  var out=[],err=[],vistos={};
  for(var r=hi+1;r<aoa.length;r++){var row=aoa[r],g=function(k){return col[k]==null?"":String(row[col[k]]==null?"":row[col[k]]).trim()};var n=g("n").replace(/\s+/g," ");if(!n||/^total$/i.test(n))continue;
    var k=xNorm(n);if(vistos[k]){err.push("Fila "+(r+1)+": “"+n+"” está repetido; se usa la primera fila.");continue}vistos[k]=1;
    var tp=xNorm(g("tipo")),x={n:n,tipo:tp.indexOf("mayor")===0?"mayorista":tp.indexOf("minor")===0?"minorista":"",wa:waNum(g("wa")),ig:igUser(g("ig")),mail:g("mail"),rs:g("rs"),rut:g("rut"),giro:g("giro"),dir:g("dir"),com:g("com"),notas:g("notas")};
    if(g("tipo")&&!x.tipo)err.push("Fila "+(r+1)+" ("+n+"): tipo “"+g("tipo")+"” no válido, se deja como estaba (Minorista si es nuevo).");
    var rk=rutK(x.rut),porRut=rk&&clis.find(function(c){return rutK(c.rut)===rk});x.ex=porRut||cliFind(n)||null;if(x.ex&&!porRut)x.n="";out.push(x)}
  var pr=[],wp=wb.Sheets["Precios especiales"];
  if(wp){var a2=X.utils.sheet_to_json(wp,{header:1,defval:"",raw:true});for(var j=1;j<a2.length;j++){var cn=String(a2[j][0]||"").trim(),pn=String(a2[j][1]||"").trim(),pv=xNum(a2[j][2]);if(!cn||!pn)continue;
    var rr=recipes.find(function(q){return xNorm(q.nombre)===xNorm(pn)});if(!rr){err.push("Precios especiales, fila "+(j+1)+": el producto “"+pn+"” no existe en Recetas.");continue}
    if(!out.some(function(o){return xNorm(o.n)===xNorm(cn)})&&!cliFind(cn)){err.push("Precios especiales, fila "+(j+1)+": el cliente “"+cn+"” no existe.");continue}
    pr.push({c:cn,rid:rr.id,p:isNaN(pv)?"":Math.round(pv)})}}
  return {rows:out,pr:pr,err:err};
}
function cliPreview(res){window._clires=res;var m=$("#climsg"),nu=res.rows.filter(function(x){return !x.ex}).length,up=res.rows.length-nu;
  m.innerHTML='<div class="card" style="padding:12px 14px;margin-top:6px"><b>'+res.rows.length+' cliente'+(res.rows.length===1?'':'s')+' en el archivo</b><div class="note" style="margin:4px 0 8px">'+nu+' nuevo'+(nu===1?'':'s')+' · '+up+' se actualiza'+(up===1?'':'n')+(res.pr.length?' · '+res.pr.length+' precio'+(res.pr.length===1?'':'s')+' especial'+(res.pr.length===1?'':'es'):'')+'</div>'+
  (res.rows.length?'<div class="scroll" style="max-height:220px"><table class="pg"><tbody>'+res.rows.slice(0,60).map(function(x){return '<tr><td>'+esc(x.n||x.ex.n)+'</td><td>'+(x.tipo?(x.tipo==="mayorista"?'Mayorista':'Minorista'):'<span class="note" style="margin:0">—</span>')+'</td><td>'+esc(x.rut||"")+'</td><td>'+(x.ex?'<span class="note" style="margin:0">actualiza</span>':'<b>nuevo</b>')+'</td></tr>'}).join("")+'</tbody></table></div>':'')+
  (res.err.length?'<div class="qbox" style="margin-top:8px">'+res.err.slice(0,12).map(esc).join("<br>")+(res.err.length>12?'<br>…y '+(res.err.length-12)+' más':'')+'</div>':'')+
  (res.rows.length||res.pr.length?'<button class="btn" style="margin-top:10px" data-cliimport>Cargar</button>':'')+'</div>'}
function cliImport(){var res=window._clires;if(!res)return;var nu=0,up=0;
  res.rows.forEach(function(x){var c=x.ex&&clis.indexOf(x.ex)>=0?x.ex:null;if(!c){c={id:cid++,n:x.n,tipo:x.tipo||"minorista",wa:"",ig:"",mail:"",rs:"",rut:"",giro:"",dir:"",com:"",notas:"",pr:{}};clis.push(c);nu++}else up++;
    ["n","tipo","wa","ig","mail","rs","rut","giro","dir","com","notas"].forEach(function(k){if(x[k])c[k]=x[k]})});
  res.pr.forEach(function(z){var c=cliFind(z.c);if(!c)return;if(z.p==="")delete c.pr[z.rid];else c.pr[z.rid]=z.p});
  window._clires=null;$("#dlg").close();render();toast(nu+" nuevo"+(nu===1?"":"s")+" · "+up+" actualizado"+(up===1?"":"s")+(res.pr.length?" · "+res.pr.length+" precios especiales":""));
}
document.addEventListener("change",function(e){var t=e.target;if(t.id!=="cliimp"||!t.files||!t.files[0])return;var f=t.files[0],m=$("#climsg");if(m)m.innerHTML='<p class="note">Leyendo '+esc(f.name)+'…</p>';
  Promise.all([xlsxLib(),f.arrayBuffer()]).then(function(a){cliPreview(cliParse(a[1],a[0]))}).catch(function(err){if(m)m.innerHTML='<div class="qbox">'+esc(err.message||"No pudimos leer el archivo.")+'</div>'});t.value=""});
function cliExcel(){
  xlsxLib().then(function(X){
    var l=clis.slice().sort(function(a,b){return a.n.localeCompare(b.n,"es",{sensitivity:"base"})});
    var H=["Cliente","Tipo","WhatsApp","Instagram","Correo","Razón social","RUT","Giro","Dirección","Comuna","Pedidos","Total comprado","Ticket promedio","Primer pedido","Último pedido","Precios especiales","Notas"];
    var rows=l.map(function(c){var ps=real().filter(function(o){return o.cid===c.id}),t=ps.reduce(function(a,o){return a+(+o.total||0)},0),f=ps.map(function(o){return o.fecha}).sort();
      return [c.n,c.tipo==="mayorista"?"Mayorista":"Minorista",c.wa?waFmt(c.wa):"",c.ig?"@"+c.ig:"",c.mail||"",c.rs||"",c.rut||"",c.giro||"",c.dir||"",c.com||"",ps.length,Math.round(t),ps.length?Math.round(t/ps.length):0,f.length?dmy(f[0]):"",f.length?dmy(f[f.length-1]):"",Object.keys(c.pr||{}).length,c.notas||""]});
    var ws=X.utils.aoa_to_sheet([H].concat(rows));ws["!cols"]=[26,11,16,18,26,26,14,18,28,16,9,15,15,13,13,10,40].map(function(w){return {wch:w}});ws["!autofilter"]={ref:"A1:Q"+(rows.length+1)};
    var wb=X.utils.book_new();X.utils.book_append_sheet(wb,ws,"Clientes");
    var pr=[["Cliente","Producto","Precio especial (con IVA)","Unidad","Precio normal (con IVA)","Tipo"]];
    l.forEach(function(c){Object.keys(c.pr||{}).forEach(function(k){var r=recipes.find(function(q){return q.id===+k});if(r)pr.push([c.n,r.nombre,Math.round(+c.pr[k]),udPl(r,1),precioStd(r,c.tipo),c.tipo==="mayorista"?"Mayorista":"Minorista"])})});
    var w2=X.utils.aoa_to_sheet(pr);w2["!cols"]=[26,26,22,12,20,11].map(function(w){return {wch:w}});X.utils.book_append_sheet(wb,w2,"Precios especiales");
    X.writeFile(wb,"Clientes_Dulcia_"+TODAY+".xlsx");toast(l.length+" cliente"+(l.length===1?"":"s")+" descargado"+(l.length===1?"":"s"));
  }).catch(function(e){toast(e.message||"No se pudo crear el Excel")});
}
function cprNota(tc){return 'por unidad, '+(tc==="mayorista"?'netos (+ IVA)':'con IVA')+'. Vacío = usa su precio normal.'}
function openCli(id,alGuardar){
  var c=id?clis.find(function(z){return z.id===id}):{tipo:"minorista",pr:{}};if(!c)return;var nuevo=!id,d=$("#dlg");
  var f=function(lb,idf,v,ph,ty){return '<label>'+lb+'<input type="'+(ty||"text")+'" id="'+idf+'" value="'+esc(v||"")+'"'+(ph?' placeholder="'+ph+'"':'')+'></label>'};
  var precios=recipes.slice().sort(function(a,b){return a.nombre.localeCompare(b.nombre,"es")}).map(function(r){var v=c.pr&&c.pr[r.id]!=null&&c.pr[r.id]!==""?mfmt(pVer(c.pr[r.id],c.tipo)):"";
    return '<div class="cpr"><span>'+esc(r.nombre)+' <span class="note" style="margin:0">por '+esc(udPl(r,1))+'</span></span><span class="cpn" data-cpn="'+r.id+'">'+$$(pVer(precioStd(r,c.tipo),c.tipo))+'</span><input type="text" class="money" inputmode="numeric" data-cpr="'+r.id+'" value="'+v+'" placeholder="—" aria-label="Precio especial de '+esc(r.nombre)+'"></div>'}).join("");
  d.innerHTML='<form class="dlg" id="clf"><header><h2 style="font-size:1.62rem">'+(nuevo?'Nuevo cliente':esc(c.n))+'</h2><button type="button" class="ib" data-close aria-label="Cerrar">✕</button></header>'+
    '<div class="f"><label class="w">Nombre o razón comercial<input type="text" id="cl_n" required value="'+esc(c.n||"")+'" placeholder="Ej.: Café del Puerto"></label>'+
    '<label>Tipo de cliente<select id="cl_t"><option value="minorista"'+(c.tipo!=="mayorista"?' selected':'')+'>'+TCL.minorista+'</option><option value="mayorista"'+(c.tipo==="mayorista"?' selected':'')+'>'+TCL.mayorista+'</option></select></label>'+
    f("WhatsApp","cl_wa",c.wa?waFmt(c.wa):"","+56 9 1234 5678","tel")+f("Instagram","cl_ig",c.ig?"@"+c.ig:"","@usuario")+f("Correo","cl_m",c.mail,"contacto@cliente.cl","email")+
    '<div class="w fsec">Facturación</div>'+f("Razón social","cl_rs",c.rs,"Ej.: Café del Puerto SpA")+f("RUT","cl_rut",c.rut,"76.123.456-7")+'<label class="w">Giro<input type="text" id="cl_g" value="'+esc(c.giro||"")+'" placeholder="Ej.: Cafetería"></label>'+
    '<div class="w fsec">Despacho</div>'+f("Dirección","cl_dir",c.dir,"Calle y número")+f("Comuna","cl_com",c.com,"Ej.: Puerto Montt")+
    (recipes.length?'<div class="w fsec">Precios especiales <span class="note" style="margin:0;font-weight:400" id="cl_prn">'+cprNota(c.tipo)+'</span></div><div class="w cprs"><div class="cpr cph"><span>Producto</span><span>Precio normal</span><span>Precio especial</span></div>'+precios+'</div>':'')+
    '<label class="w">Notas<textarea id="cl_no" rows="3" placeholder="Horario de entrega, preferencias, forma de pago…">'+esc(c.notas||"")+'</textarea></label></div>'+
    '<div style="display:flex;gap:8px;justify-content:space-between;flex-wrap:wrap">'+(nuevo?'<span></span>':'<button type="button" class="btn ghost sm danger" data-clidel="'+c.id+'">Eliminar cliente</button>')+'<div style="display:flex;gap:8px"><button type="button" class="btn ghost" data-close>Cancelar</button><button class="btn" type="submit">'+(nuevo?'Crear cliente':'Guardar')+'</button></div></div></form>';
  d.dataset.cli=id||"";window._cliCb=alGuardar||null;if(!d.open)d.showModal();
}
function cliGuardar(){
  var id=+$("#dlg").dataset.cli,nuevo=!id,c=nuevo?{id:cid++,pr:{}}:clis.find(function(z){return z.id===id});if(!c)return;
  var nm=$("#cl_n").value.trim().replace(/\s+/g," ");if(!nm){$("#cl_n").focus();return}
  var otro=cliFind(nm);if(otro&&otro.id!==c.id){toast("Ya existe un cliente llamado “"+otro.n+"”");$("#cl_n").focus();return}
  c.n=nm;c.tipo=$("#cl_t").value;c.wa=waNum($("#cl_wa").value);c.ig=igUser($("#cl_ig").value);c.mail=$("#cl_m").value.trim();c.rs=$("#cl_rs").value.trim();c.rut=$("#cl_rut").value.trim();c.giro=$("#cl_g").value.trim();c.dir=$("#cl_dir").value.trim();c.com=$("#cl_com").value.trim();c.notas=$("#cl_no").value.trim();
  c.pr={};document.querySelectorAll("[data-cpr]").forEach(function(i){if(i.value.trim()&&mnum(i.value)>0)c.pr[+i.dataset.cpr]=pIn(mnum(i.value),c.tipo)});
  if(nuevo)clis.push(c);var cb=window._cliCb;window._cliCb=null;$("#dlg").close();render();toast(nuevo?"Cliente “"+c.n+"” creado":"Cliente guardado");if(cb)cb(c);
}
document.addEventListener("submit",function(e){if(e.target.id==="clf"){e.preventDefault();cliGuardar()}});
document.addEventListener("change",function(e){if(e.target.id!=="cl_t")return;var tc=e.target.value,old=tc==="mayorista"?"minorista":"mayorista";
  document.querySelectorAll("[data-cpn]").forEach(function(s){var r=recipes.find(function(q){return q.id===+s.dataset.cpn});if(r)s.textContent=$$(pVer(precioStd(r,tc),tc))});
  document.querySelectorAll("[data-cpr]").forEach(function(i){if(i.value.trim()&&mnum(i.value)>0)i.value=mfmt(Math.round(pVer(pIn(mnum(i.value),old),tc)))});
  var n=$("#cl_prn");if(n)n.textContent=cprNota(tc)});
document.addEventListener("input",function(e){if(e.target.id==="cliq"){CLQ=e.target.value;var p=e.target.selectionStart;render();var i=$("#cliq");if(i){i.focus();try{i.setSelectionRange(p,p)}catch(er){}}}});
document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("button,tr[data-cliedit]");if(!t)return;
  if(t.hasAttribute("data-clinew")){openCli(0);return}
  if(t.hasAttribute("data-clixls")){cliExcel();return}
  if(t.hasAttribute("data-clix")){openCliX();return}
  if(t.hasAttribute("data-clitpl")){cliTemplate();return}
  if(t.hasAttribute("data-cliimport")){cliImport();return}
  if(t.dataset.clf!=null){CLF=t.dataset.clf;render();return}
  if(t.dataset.clinp){e.stopPropagation();var c0=clis.find(function(z){return z.id===+t.dataset.clinp});openNew(TODAY);if(c0)nCliente(c0);return}
  if(t.dataset.cliedit&&!e.target.closest("button")){openCli(+t.dataset.cliedit);return}
  if(t.dataset.clidel){var c1=clis.find(function(z){return z.id===+t.dataset.clidel});if(!c1)return;if(!t.dataset.sure){t.dataset.sure=1;t.textContent="Toca de nuevo para eliminar";return}
    var i1=clis.indexOf(c1);clis.splice(i1,1);var os=orders.filter(function(o){return o.cid===c1.id});os.forEach(function(o){o.cid=null});$("#dlg").close();render();
    toast("Cliente eliminado (sus pedidos se mantienen)",function(){clis.splice(i1,0,c1);os.forEach(function(o){o.cid=c1.id});render()});return}
});
function precioStd(r,tc){if(!r)return 0;return tc==="mayorista"?(+r.pm?+r.pm*IVA:0):(+r.precio||0)}
/* Mayorista: los precios se ven y se escriben NETOS (el IVA se suma al final). Internamente se guardan con IVA. */
function pVer(p,tc){return tc==="mayorista"?Math.round((+p||0)/IVA*100)/100:(+p||0)}
function pIn(v,tc){return tc==="mayorista"?v*IVA:v}
function pLbl(tc){return tc==="mayorista"?"Precio neto":"Precio c/IVA"}
function ivaDe(t){t=Math.round(+t||0);var n=Math.round(t/IVA);return {neto:n,iva:t-n,tot:t}}
function lnP(l,tc){return l.p==null||l.p===""?precioStd(recipes.find(function(r){return r.id===l.rid}),tc):+l.p}
function lnTot(x){return (x.items||[]).reduce(function(a,l){return a+(+l.q||0)*lnP(l,x.tc)},0)}
function lnSync(x){var tot=lnTot(x),e=$("#lntot");if(e)e.innerHTML=lnTotHtml(x);(x.items||[]).forEach(function(l,i){var s=$("#lsub"+i);if(s)s.textContent=$$((+l.q||0)*pVer(lnP(l,x.tc),x.tc))})}
function lnTotHtml(x){var t=oTot(x),v=ivaDe(t);return (+x.desp||+x.dsc?'Total calculado (productos + despacho − descuento): <b>':'Total de los productos: <b>')+''+$$(t)+'</b> <span class="note" style="margin:0">(neto '+$$(v.neto)+' + IVA '+$$(v.iva)+')</span>'+(t&&Math.round(t)!==Math.round(+x.total||0)?' <button class="btn ghost sm" data-ltot="'+x.id+'">Usar como total del pedido</button>':(t?' <span class="note" style="margin:0">= total del pedido</span>':''))}
function recOpts(sel){return recipes.map(function(r){return '<option value="'+r.id+'"'+(r.id===sel?' selected':'')+'>'+esc(r.nombre)+'</option>'}).join("")}
function evTimes(x){var d=x.fecha.replace(/-/g,""),h=(x.hora||"12:00").split(":"),a=+h[0]||0,m=h[1]||"00",z=function(n){return String(n).padStart(2,"0")};
  return {s:d+"T"+z(a)+m+"00",e:d+"T"+z(Math.min(23,a+1))+m+"00"}}
function evTitle(x){return "Pedido: "+x.cliente+" ("+x.cat+")"}
function evDet(x){return (x.personas?"Para "+x.personas+" personas. ":"")+(x.desc||"")+"\nTotal: "+$$(x.total)+" · Saldo: "+$$(x.total-x.pagado)}
function gcalUrl(x){var t=evTimes(x);return "https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(evTitle(x))+"&dates="+t.s+"/"+t.e+"&details="+encodeURIComponent(evDet(x))+"&ctz=America/Santiago"}
function icsDownload(x){var t=evTimes(x),esc2=function(v){return String(v).replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\n/g,"\\n")};
  var ics=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Dulcia//ES","BEGIN:VEVENT","UID:pedido-"+x.id+"@dulcia","DTSTAMP:"+new Date().toISOString().replace(/[-:]/g,"").slice(0,15)+"Z","DTSTART;TZID=America/Santiago:"+t.s,"DTEND;TZID=America/Santiago:"+t.e,"SUMMARY:"+esc2(evTitle(x)),"DESCRIPTION:"+esc2(evDet(x)),"END:VEVENT","END:VCALENDAR"].join("\r\n");
  var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([ics],{type:"text/calendar"}));a.download="pedido-"+x.cliente.replace(/[^a-z0-9]+/gi,"-")+".ics";document.body.appendChild(a);a.click();a.remove()}
function openOrder(id){
  var x=orders.find(function(q){return q.id===id}); if(!x)return;
  var PM=!window.NO_PM, d=$("#dlg"), ln=(x.items||[]).map(function(l,i){return '<div class="ln'+(PM?' lnp':'')+'"><select data-lr="'+x.id+':'+i+'" aria-label="Receta">'+recOpts(l.rid)+'</select><input type="number" step="any" min="0" value="'+l.q+'" data-lq="'+x.id+':'+i+'" aria-label="Cantidad" title="Cantidad en '+esc(udPl(recipes.find(function(r){return r.id===l.rid}),2))+'">'+
    (PM?'<input type="text" class="money" inputmode="numeric" data-lp="'+x.id+':'+i+'" value="'+mfmt(pVer(lnP(l,x.tc),x.tc))+'" aria-label="'+(x.tc==="mayorista"?'Precio neto por unidad':'Precio por unidad con IVA')+'" title="'+(x.tc==="mayorista"?'Precio por unidad (neto, + IVA)':'Precio por unidad (con IVA)')+'"><span class="lsub" id="lsub'+i+'">'+$$((+l.q||0)*pVer(lnP(l,x.tc),x.tc))+'</span>':'')+
    '<button class="x" data-ldel="'+x.id+':'+i+'" aria-label="Quitar receta">✕</button></div>'}).join("");
  d.innerHTML='<div class="dlg"><header><div><h2 style="font-size:1.62rem">'+esc(x.cliente)+'</h2><div class="note" style="margin:2px 0 0">'+fechaLarga(x.fecha)+' · '+x.hora+'</div></div><div style="display:flex;gap:8px;flex:none"><button class="ib" data-edito="'+x.id+'" aria-label="Editar pedido" title="Editar pedido"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button><button class="ib" data-close aria-label="Cerrar">✕</button></div></header>'+
  '<div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn ghost sm" style="text-decoration:none" target="_blank" rel="noopener" href="'+gcalUrl(x)+'">Agregar a Google Calendar</a><button class="btn ghost sm" data-ics="'+x.id+'">Descargar para otro calendario</button></div>'+
  '<dl class="kv"><dt>Categoría</dt><dd>'+esc(x.cat)+'</dd>'+(!window.NO_DOC&&x.doct?'<dt>Documento</dt><dd>'+DOCL[x.doct]+(x.docn?' N° '+esc(x.docn):'')+'</dd>':'')+(PM?'<dt>Tipo de cliente</dt><dd>'+(x.tc==="mayorista"?'Mayorista':'Minorista')+'</dd>':'')+(x.personas?'<dt>Personas</dt><dd>'+x.personas+'</dd>':'')+'<dt>Canal</dt><dd>'+esc(x.canal)+'</dd>'+(+x.desp?'<dt>Despacho</dt><dd>'+$$(x.desp)+' <span class="note" style="margin:0">'+(x.despi==="sin"?'(neto '+$$(x.desp/IVA)+' + IVA)':'(con IVA)')+'</span></dd>':'')+(+x.dsc?'<dt>Descuento</dt><dd>'+(x.dsct==="porcentaje"?fq(x.dsc)+'% ('+$$(oDsc(x,oSub(x)))+')':$$(oDsc(x,0))+(x.tc==="mayorista"?' <span class="note" style="margin:0">('+$$(x.dsc)+' neto + IVA)</span>':''))+'</dd>':'')+'<dt>Neto</dt><dd>'+$$(ivaDe(x.total).neto)+'</dd><dt>IVA 19%</dt><dd>'+$$(ivaDe(x.total).iva)+'</dd><dt>Total con IVA</dt><dd><b>'+$$(x.total)+'</b></dd><dt>Pagado</dt><dd>'+$$(x.pagado)+' '+chipS(x)+'</dd><dt>Saldo</dt><dd>'+$$(x.total-x.pagado)+'</dd></dl>'+
  '<div class="contact"><b>Contacto</b>'+
  '<label>Instagram<span class="crow2"><input type="text" data-ig="'+x.id+'" value="'+esc(x.ig?"@"+x.ig:"")+'" placeholder="@usuario" autocapitalize="none" autocomplete="off"><a class="btn ghost sm" id="a_ig" target="_blank" rel="noopener" href="'+igUrl(x.ig)+'"'+(x.ig?'':' hidden')+'>Ver perfil</a></span></label>'+
  '<label>WhatsApp<span class="crow2"><input type="tel" inputmode="tel" data-wa="'+x.id+'" value="'+esc(waFmt(x.wa))+'" placeholder="+56 9 1234 5678" autocomplete="off"><a class="btn ghost sm" id="a_wa" target="_blank" rel="noopener" href="'+waUrl(x.wa)+'"'+(x.wa?'':' hidden')+'>Abrir chat</a></span></label></div>'+
  (x.cot?'<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-pdf="'+x.id+'">Descargar PDF</button><button class="btn ghost" data-confirm="'+x.id+'">Confirmar pedido</button></div>':(x.total>x.pagado?'<div><button class="btn sm" data-pay="'+x.id+'">Marcar saldo como pagado</button></div>':''))+
  (window.NO_DOC||x.cot?'':docBox(x))+
  '<label style="font-size:.85rem;color:var(--soft);font-weight:500;display:flex;flex-direction:column;gap:4px">Descripción<textarea id="odesc" rows="4" data-d="'+x.id+'">'+esc(x.desc)+'</textarea></label>'+
  '<div><div style="font-size:.85rem;color:var(--soft);font-weight:500;margin-bottom:6px">Recetas del pedido'+(PM?' · cliente '+(x.tc==="mayorista"?'<b>mayorista</b>':'minorista'):'')+'</div>'+(PM&&ln?'<div class="ln lnp lnh"><span>Receta</span><span>Cantidad</span><span>'+pLbl(x.tc)+'</span><span>Subtotal</span><span></span></div>':'')+(ln||'<div class="note" style="margin:0 0 6px">Sin receta. Asígnala para que Compras sepa qué ingredientes necesitas.</div>')+
  (PM&&ln?'<div class="lntot" id="lntot">'+lnTotHtml(x)+'</div>':'')+
  (recipes.length?'<button class="btn ghost sm" data-ladd="'+x.id+'">+ Agregar receta</button>':'<div class="note">Primero crea una receta en la sección Recetas.</div>')+'</div>'+
  '<div><div style="font-size:.85rem;color:var(--soft);font-weight:500;margin-bottom:6px">Fotos</div><div class="photos big">'+x.fotos.map(function(f,i){return '<div class="ph"><img src="'+f+'" alt="Foto del pedido"><button class="px" data-pdel="'+x.id+':'+i+'" aria-label="Quitar foto">✕</button></div>'}).join("")+
  (x.fotos.length<MAXF?'<label class="addp" tabindex="0">+ Agregar foto<small style="display:block;font-size:.72rem">máximo '+MAXF+'</small><input type="file" accept="image/*" multiple hidden data-addph="'+x.id+'"></label>':'')+'</div></div>'+
  '<div class="qbox"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap"><b>'+(x.num?'Cotización '+qn(x):'Cotización')+'</b>'+(x.cot?'':'<button class="btn ghost sm" data-pdf="'+x.id+'">Descargar cotización PDF</button>')+'</div>'+
  '<label style="font-size:.85rem;color:var(--soft);font-weight:500;display:flex;flex-direction:column;gap:4px;margin-top:8px">Condiciones de esta cotización<textarea rows="6" data-cond="'+x.id+'">'+esc(x.cond!=null?x.cond:cfg.cond)+'</textarea></label>'+
  '<label style="font-size:.85rem;color:var(--soft);font-weight:500;display:flex;flex-direction:row;gap:8px;align-items:center;margin-top:8px">Validez (días)<input type="number" min="1" style="width:80px" data-vig="'+x.id+'" value="'+(x.vig||cfg.vig)+'"></label></div>'+
  '<div style="border-top:1px solid var(--line);padding-top:12px"><button class="btn ghost sm danger" data-delo="'+x.id+'">Eliminar pedido</button></div></div>';
  if(!d.open)d.showModal();
}
var DOCL={"":"Sin documento",boleta:"Boleta",factura:"Factura"};
function docBox(x){var c=x.cid?clis.find(function(z){return z.id===x.cid}):null;
  return '<div class="docb"><div class="docbh"><b>Documento tributario</b><span class="note" style="margin:0">Anota la boleta o factura de este pedido.</span></div>'+
  '<div class="docr"><label>Tipo<select data-doct="'+x.id+'">'+Object.keys(DOCL).map(function(k){return '<option value="'+k+'"'+((x.doct||"")===k?' selected':'')+'>'+DOCL[k]+'</option>'}).join("")+'</select></label>'+
  '<label>N° de documento<input type="text" inputmode="numeric" data-docn="'+x.id+'" value="'+esc(x.docn||"")+'" placeholder="Ej.: 1234"'+(x.doct?'':' disabled')+'></label></div>'+
  (x.doct==="factura"?(c&&(c.rs||c.rut)?'<p class="note" style="margin:6px 0 0">Factura a: <b>'+esc(c.rs||c.n)+'</b>'+(c.rut?' · RUT '+esc(c.rut):'')+(c.giro?' · '+esc(c.giro):'')+'</p>':'<p class="note" style="margin:6px 0 0;color:var(--warn)">Este cliente no tiene razón social ni RUT. Complétalos en Clientes.</p>'):'')+'</div>'}
document.addEventListener("change",function(e){var t=e.target;if(!t.dataset||t.dataset.doct==null)return;var x=orders.find(function(q){return q.id===+t.dataset.doct});if(!x)return;x.doct=t.value;if(!x.doct)x.docn="";openOrder(x.id);render();var n=document.querySelector('[data-docn="'+x.id+'"]');if(n&&x.doct)n.focus()});
document.addEventListener("input",function(e){var t=e.target;if(!t.dataset||t.dataset.docn==null)return;var x=orders.find(function(q){return q.id===+t.dataset.docn});if(x)x.docn=t.value.trim()});
function openDay(iso){
  var ev=real().filter(function(x){return x.fecha===iso}).sort(function(a,b){return a.hora<b.hora?-1:1}), d=$("#dlg");
  var tot=ev.reduce(function(a,x){return a+(+x.total||0)},0), cap=cfg.cap>0&&ev.length>=cfg.cap;
  d.innerHTML='<div class="dlg dayd"><header><div><h2 style="font-size:1.62rem">'+fechaLarga(iso)+'</h2><div class="note" style="margin:2px 0 0">'+ev.length+' pedido'+(ev.length===1?'':'s')+' · '+$$(tot)+(cap?' · <span style="color:var(--warn)">día lleno según tu capacidad</span>':'')+'</div></div><button class="ib" data-close aria-label="Cerrar">✕</button></header>'+
   '<div class="dayl">'+ev.map(function(x){return '<button class="dayo cb-'+catCol(x.cat)+'" data-o="'+x.id+'"><span class="dh2">'+x.hora+'</span><span style="min-width:0"><b>'+esc(x.cliente)+'</b><span class="note" style="display:block;margin:0">'+esc(x.cat)+(x.personas?' · '+persTxt(x):'')+'</span></span><span class="dr">'+$$(x.total)+chipS(x)+'</span></button>'}).join("")+'</div>'+
   '<div style="display:flex;justify-content:flex-end"><button class="btn" data-newday="'+iso+'">+ Agregar pedido este día</button></div></div>';
  if(!d.open)d.showModal();
}
function openEdit(id){
  var x=orders.find(function(q){return q.id===id}); if(!x)return;
  openNew(x.fecha); var fm=$("#nf"); fm.dataset.edit=x.id;
  fm.querySelector("h2").textContent=x.cot?"Editar cotización":"Editar pedido";
  $("#n_c").value=x.cliente; $("#n_ig").value=x.ig?"@"+x.ig:""; $("#n_wa").value=waFmt(x.wa); $("#n_h").value=x.hora||"12:00";
  var k=$("#n_k"); if(![].some.call(k.options,function(o){return o.value===x.cat})){var o=document.createElement("option");o.textContent=x.cat;k.insertBefore(o,k.firstChild)} k.value=x.cat;
  var a=$("#n_a"); if(![].some.call(a.options,function(o){return o.value===x.canal})){var o2=document.createElement("option");o2.textContent=x.canal;a.appendChild(o2)} a.value=x.canal;
  var pe=$("#n_pe"); if(x.personas&&![].some.call(pe.options,function(o){return +o.value===x.personas})){var o3=document.createElement("option");o3.value=x.personas;o3.textContent=x.personas+" personas";pe.appendChild(o3)} pe.value=x.personas?String(x.personas):"";
  $("#n_t").value=mfmt(x.total); $("#n_p").value=mfmt(x.pagado); $("#n_d").value=x.desc==="Sin descripción."?"":x.desc;
  [$("#n_r"),$("#n_rq"),$("#n_ph")].forEach(function(el){var l=el&&el.closest("label,.w");if(l)l.hidden=true});
  if($("#n_tc"))nTcSet(x.tc||"minorista",true);
  if(!window.NO_CLI){fm.dataset.cid=x.cid||"";var cx=x.cid?clis.find(function(c){return c.id===x.cid}):null;if(cx)nCliente(cx);var bx=$("#n_cli");if(bx&&!cx)bx.innerHTML='';
    var di0=$("#n_despi");if(di0){di0.value=x.despi==="sin"?"sin":"con";di0.dataset.man=1}if($("#n_desp"))$("#n_desp").value=mfmt(x.despi==="sin"&&di0?Math.round((+x.desp||0)/IVA):(x.desp||0));if($("#n_dsc"))$("#n_dsc").value=String(x.dsc||0).replace(".",",");if($("#n_dsct"))$("#n_dsct").value=x.dsct||"monto"}
  if(!window.NO_PM){window._nl=(x.items||[]).map(function(l){return {rid:l.rid,q:l.q,p:lnP(l,x.tc),man:true}});nRender();window._ntman=Math.round(+x.total||0)!==window._ntcalc;$("#n_t").value=mfmt(x.total);var rb=$("#n_trec");if(rb)rb.hidden=!window._ntman}
  var sc=fm.querySelector("[data-savecot]"); if(sc)sc.hidden=true;
  fm.querySelector("button[type=submit]").textContent="Guardar cambios";
  var nt=document.createElement("p");nt.className="note w";nt.style.margin="0";nt.textContent=window.NO_PM?"Las recetas y las fotos se cambian en el detalle del pedido.":"Las fotos se cambian en el detalle del pedido.";fm.querySelector(".f").appendChild(nt);
}
function nPrecio(precio){ // pedido nuevo: precio estándar según receta y tipo de cliente; total = cantidad × precio
  var r=recipes.find(function(q){return q.id===+(($("#n_r")||{}).value)}),tc=($("#n_tc")||{}).value,pi=$("#n_rp"),nt=$("#n_rpn");if(!pi)return;
  if(precio){var p=precioStd(r,tc);pi.value=mfmt(p);if(nt){nt.hidden=!r;nt.textContent=r?(tc==="mayorista"?(+r.pm?"Precio mayorista de “"+r.nombre+"”: "+$$(r.pm)+" + IVA. Puedes cambiarlo.":"“"+r.nombre+"” no tiene precio mayorista: anótalo en la receta o escríbelo aquí."):(+r.precio?"Precio a público de “"+r.nombre+"”. Puedes cambiarlo.":"“"+r.nombre+"” no tiene precio a público: anótalo en la receta o escríbelo aquí.")):""}}
  if(r){var t=Math.round((parseFloat($("#n_rq").value)||0)*mnum(pi.value));$("#n_t").value=mfmt(t)}
}

function openNew(fecha){
  var d=$("#dlg"), fdef=fecha||(TODAY.slice(0,7)===cur.y+'-'+String(cur.m+1).padStart(2,"0")?TODAY:cur.y+'-'+String(cur.m+1).padStart(2,"0")+'-15');
  d.innerHTML='<form class="dlg" id="nf"><header><h2 style="font-size:1.62rem">Nuevo pedido</h2><button type="button" class="ib" data-close aria-label="Cerrar">✕</button></header>'+
  '<div class="f">'+(window.NO_PM?'':'<div class="w ntcw"><span class="ntcl">Tipo de cliente</span><div class="seg2" role="radiogroup" aria-label="Tipo de cliente"><button type="button" role="radio" aria-checked="true" class="on" data-ntc="minorista">Minorista <small>público</small></button><button type="button" role="radio" aria-checked="false" data-ntc="mayorista">Mayorista <small>cafetería, reventa</small></button></div><input type="hidden" id="n_tc" value="minorista"></div>')+
  '<label class="w">Cliente<input type="text" id="n_c" required placeholder="Escribe o elige un cliente guardado" autocomplete="off"'+(window.NO_CLI?'':' list="n_cl"')+'></label>'+
  (window.NO_CLI?'':'<datalist id="n_cl"></datalist><div class="w ncli" id="n_cli"></div>')+
  '<label>Instagram<input type="text" id="n_ig" placeholder="@usuario" autocapitalize="none" autocomplete="off"></label><label>WhatsApp<input type="tel" id="n_wa" placeholder="+56 9 1234 5678" inputmode="tel" autocomplete="off"></label>'+
  '<label>Fecha de entrega<input type="date" id="n_f" required value="'+fdef+'"></label><label>Hora<input type="time" id="n_h" value="12:00"></label>'+
  '<label>Categoría<select id="n_k">'+pcats.map(function(c){return '<option>'+esc(c.n)+'</option>'}).join("")+'<option value="__new">+ Crear categoría nueva</option></select></label>'+
  '<label>Canal<select id="n_a">'+CANALES.map(function(c){return '<option>'+c+'</option>'}).join("")+'</select></label>'+

  '<div class="w f" id="n_nkw" hidden><label>Nombre de la categoría<input type="text" id="n_nkn" placeholder="Ej.: Postres"></label><label>Margen %<input type="number" id="n_nkm" value="70" min="0" max="100"></label></div>'+
  (window.NO_PM?'<label>Receta (opcional)<select id="n_r"><option value="">Sin receta</option>'+recOpts(-1)+'</select></label><label>Cantidad<input type="number" id="n_rq" step="any" min="0" value="1"></label>':
  '<div class="w nprod"><div class="nph">Productos del pedido</div><div id="n_lines"></div>'+(recipes.length?'<button type="button" class="btn ghost sm" data-naddl>+ Agregar producto</button>':'<p class="note" style="margin:0">Primero crea tus productos en Recetas.</p>')+
  '<div class="ntot"><div class="ntr"><span id="n_subl">Subtotal productos</span><b id="n_sub">$ 0</b></div>'+(window.NO_CLI?'':'<div class="ntr"><span>Despacho</span>'+(window.NO_DOC?'<input type="text" class="money" inputmode="numeric" id="n_desp" value="$ 0" aria-label="Despacho">':'<span class="ndsc ndesp"><input type="text" class="money" inputmode="numeric" id="n_desp" value="$ 0" aria-label="Despacho"><select id="n_despi" aria-label="IVA del despacho"><option value="con">Con IVA</option><option value="sin">Sin IVA</option></select></span>')+'</div>'+
  '<div class="ntr"><span>Descuento</span><span class="ndsc"><input type="text" inputmode="decimal" id="n_dsc" value="0" aria-label="Descuento"><select id="n_dsct" aria-label="Tipo de descuento"><option value="monto">$</option><option value="porcentaje">%</option></select></span></div>')+
  '<div class="ntr ntiv"><span>Neto</span><b id="n_neto">$ 0</b></div><div class="ntr ntiv"><span>IVA 19%</span><b id="n_iva">$ 0</b></div><div class="ntr ntb"><span>Total con IVA</span><b id="n_tb">$ 0</b></div><p class="note" id="n_ivn" style="margin:0"></p>'+
  '</div></div>')+
  '<label>Personas<select id="n_pe"><option value="">Sin indicar</option>'+PERS.map(function(n){return '<option value="'+n+'">'+n+' personas</option>'}).join("")+'</select></label>'+
  '<label>'+(window.NO_PM?'Total con IVA':'Total del pedido (con IVA)')+(window.NO_PM?'':' <button type="button" class="lnk" id="n_trec" hidden>recalcular</button>')+'<input type="text" class="money" inputmode="numeric" id="n_t" required value="$ 0"></label><label>Anticipo pagado<input type="text" class="money" inputmode="numeric" id="n_p" value="$ 0"></label>'+
  '<label class="w">Descripción<textarea id="n_d" rows="4" placeholder="Sabores, tamaño, decoración, dirección de entrega…"></textarea></label>'+
  '<div class="w"><div style="font-size:.85rem;color:var(--soft);font-weight:500;margin-bottom:6px">Fotos</div><div class="photos" id="n_ph"><label class="addp">+ Agregar fotos<small style="display:block;font-size:.72rem">máximo 2</small><input type="file" accept="image/*" multiple hidden id="n_file"></label></div></div></div>'+
  '<div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn ghost" data-close>Cancelar</button><button type="button" class="btn ghost" data-savecot>Guardar como cotización</button><button class="btn" type="submit">Guardar pedido</button></div></form>';
  if(!d.open)d.showModal();
  window._nl=[];window._ntman=false;if(!window.NO_PM){nAddLine();nRender()}nDl();
}
/* ---- pedido: lista de productos, cliente guardado y total automático ---- */
function nCli(){return window.NO_CLI?null:clis.find(function(c){return c.id===+(($("#nf")||{dataset:{}}).dataset.cid||0)})}
function nTc(){return ($("#n_tc")||{}).value||"minorista"}
function nDl(){var dl=$("#n_cl");if(!dl)return;var tc=nTc();dl.innerHTML=clis.filter(function(c){return c.tipo===tc}).sort(function(a,b){return a.n.localeCompare(b.n,"es")}).map(function(c){return '<option value="'+esc(c.n)+'">'+(c.rs?esc(c.rs):'')+(c.wa?(c.rs?' · ':'')+esc(waFmt(c.wa)):'')+'</option>'}).join("")}
function nTcSet(v,silencioso){var h=$("#n_tc");if(!h)return;h.value=v==="mayorista"?"mayorista":"minorista";var di=$("#n_despi");if(di&&!di.dataset.man)di.value=h.value==="mayorista"?"sin":"con";document.querySelectorAll("[data-ntc]").forEach(function(b){var on=b.dataset.ntc===h.value;b.classList.toggle("on",on);b.setAttribute("aria-checked",on)});nDl();if(!silencioso){var c=nCli();if(c&&c.tipo!==h.value){$("#nf").dataset.cid="";$("#n_c").value=""}nCliente(nCli())}}
function nAddLine(rid){var r=rid?recipes.find(function(q){return q.id===rid}):null;window._nl.push({rid:r?r.id:0,q:1,p:r?cliPrecio(nCli(),r,nTc()):0,man:false})}
function nRender(){var box=$("#n_lines");if(!box)return;
  box.innerHTML=(window._nl.length?'<div class="nln nlh"><span>Producto</span><span>Cantidad</span><span>'+pLbl(nTc())+'</span><span>Subtotal</span><span></span></div>':'')+window._nl.map(function(l,i){var r=recipes.find(function(q){return q.id===l.rid});
    return '<div class="nln"><select data-nlr="'+i+'" aria-label="Producto"><option value="">Elige un producto…</option>'+recOpts(l.rid)+'</select><input type="number" step="any" min="0" data-nlq="'+i+'" value="'+l.q+'" aria-label="Cantidad" title="'+(r?'Cantidad en '+esc(udPl(r,2)):'')+'"><input type="text" class="money" inputmode="numeric" data-nlp="'+i+'" value="'+mfmt(pVer(l.p,nTc()))+'" aria-label="'+(nTc()==="mayorista"?'Precio neto por unidad':'Precio por unidad con IVA')+'"><span class="lsub" id="nls'+i+'">'+$$((+l.q||0)*pVer(l.p,nTc()))+'</span><button type="button" class="x" data-nldel="'+i+'" aria-label="Quitar producto">✕</button></div>'}).join("");
  nTotal();}
function nDespB(){var v=$("#n_desp")?mnum($("#n_desp").value):0;return ($("#n_despi")||{}).value==="sin"?Math.round(v*IVA):v}
function nTotal(){if(window.NO_PM)return;var tc=nTc(),may=tc==="mayorista",sub=window._nl.reduce(function(a,l){return a+(l.rid?(+l.q||0)*(+l.p||0):0)},0);window._nl.forEach(function(l,i){var e=$("#nls"+i);if(e)e.textContent=$$((+l.q||0)*pVer(l.p,tc))});
  var dI=$("#n_desp")?mnum($("#n_desp").value):0,sinI=($("#n_despi")||{}).value==="sin",desp=nDespB(),dv=$("#n_dsc")?parseFloat(String($("#n_dsc").value).replace(/\./g,"").replace(",","."))||0:0,dt=($("#n_dsct")||{}).value,dsc=dt==="porcentaje"?Math.round(sub*dv/100):Math.round(dv*(may?IVA:1)),tot=Math.max(0,Math.round(sub+desp-dsc));
  $("#n_sub").textContent=$$(may?sub/IVA:sub);$("#n_subl").textContent="Subtotal productos ("+(may?"neto":"con IVA")+")";
  var rb=$("#n_trec");if(rb)rb.hidden=!window._ntman;if(!window._ntman)$("#n_t").value=mfmt(tot);window._ntcalc=tot;nResumen();
  var nv=$("#n_ivn");if(nv){var t=[];if(may)t.push("Mayorista: precios"+(dt==="porcentaje"?"":" y descuento")+" netos, el IVA se suma al final.");if(dI&&sinI)t.push("Despacho sin IVA: "+$$(dI)+" + IVA "+$$(desp-dI)+" = "+$$(desp)+".");else if(dI&&$("#n_despi"))t.push("Despacho con IVA incluido: neto "+$$(dI/IVA)+" + IVA "+$$(dI-Math.round(dI/IVA))+".");nv.textContent=t.join(" ");nv.hidden=!t.length}}
function nResumen(){var b=$("#n_tb");if(!b)return;var v=ivaDe(mnum($("#n_t").value));$("#n_neto").textContent=$$(v.neto);$("#n_iva").textContent=$$(v.iva);b.textContent=$$(v.tot)}
function nPrecios(){window._nl.forEach(function(l){if(l.man||!l.rid)return;var r=recipes.find(function(q){return q.id===l.rid});if(r)l.p=cliPrecio(nCli(),r,nTc())});nRender()}
function nCliente(c){ // completa los datos desde un cliente guardado
  var fm=$("#nf");if(!fm)return;fm.dataset.cid=c?c.id:"";var box=$("#n_cli");
  if(c){$("#n_c").value=c.n;if(c.ig)$("#n_ig").value="@"+c.ig;if(c.wa)$("#n_wa").value=waFmt(c.wa);if($("#n_tc")&&nTc()!==c.tipo)nTcSet(c.tipo,true);
    if(box)box.innerHTML='<span class="st '+(c.tipo==="mayorista"?'regalo':'pagando')+'">Cliente guardado · '+(c.tipo==="mayorista"?'mayorista':'minorista')+'</span>'+(Object.keys(c.pr||{}).length?' <span class="note" style="margin:0">con precios especiales</span>':'')+(c.dir?' <span class="note" style="margin:0">· despacho: '+esc(c.dir+(c.com?", "+c.com:""))+'</span>':'');
    if(c.dir&&$("#n_d")&&!$("#n_d").value.trim())$("#n_d").value="Despacho: "+c.dir+(c.com?", "+c.com:"")}
  else if(box){var nm=$("#n_c").value.trim();box.innerHTML=nm?'<span class="st prueba">Cliente nuevo</span> <span class="note" style="margin:0">Al guardar el pedido, “'+esc(nm)+'” queda en Clientes como '+(nTc()==="mayorista"?'mayorista':'minorista')+'.</span>':''}
  nPrecios();
}
document.addEventListener("input",function(e){var t=e.target,d=t.dataset||{};if(!$("#nf"))return;
  if(t.id==="n_c"){if(window.NO_CLI)return;var c=cliFind(t.value);if(c){if(+($("#nf").dataset.cid)!==c.id)nCliente(c)}else{if($("#nf").dataset.cid){$("#nf").dataset.cid=""}nCliente(null)}return}
  if(d.nlq!=null){window._nl[+d.nlq].q=parseFloat(t.value)||0;nTotal();return}
  if(d.nlp!=null){var l=window._nl[+d.nlp];l.p=pIn(mnum(t.value),nTc());l.man=true;nTotal();return}
  if(t.id==="n_desp"||t.id==="n_dsc"){nTotal();return}
  if(t.id==="n_t"){window._ntman=mnum(t.value)!==window._ntcalc;var rb=$("#n_trec");if(rb)rb.hidden=!window._ntman;nResumen()}
});
document.addEventListener("change",function(e){var t=e.target,d=t.dataset||{};if(!$("#nf"))return;
  if(d.nlr!=null){var l=window._nl[+d.nlr],r=recipes.find(function(q){return q.id===+t.value});l.rid=r?r.id:0;l.man=false;l.p=r?cliPrecio(nCli(),r,nTc()):0;nRender();return}
  if(t.id==="n_tc"){nPrecios();return}
  if(t.id==="n_dsct"){nTotal();return}
  if(t.id==="n_despi"){t.dataset.man=1;nTotal();return}
});
document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("button");if(!t||!$("#nf"))return;
  if(t.hasAttribute("data-naddl")){nAddLine();nRender();var s2=document.querySelectorAll("[data-nlr]");if(s2.length)s2[s2.length-1].focus();return}
  if(t.dataset.nldel!=null){window._nl.splice(+t.dataset.nldel,1);nRender();return}
  if(t.id==="n_trec"){window._ntman=false;nTotal();return}
  if(t.dataset.ntc){nTcSet(t.dataset.ntc);var ci=$("#n_c");if(ci&&!ci.value)ci.focus();return}
});
function openCats(kind,msg){
  catsOpen=kind; var d=$("#dlg"), isP=kind==="ped";
  var list=isP?pcats:gcats.map(function(n){return {n:n}});
  var rows=list.map(function(c,i){return '<div class="crow"><span style="flex:1;min-width:0;overflow-wrap:anywhere">'+esc(c.n)+'</span>'+(isP?'<label class="mini ccsel"><i class="sw cc-'+catCol(c.n)+'" id="sw'+i+'"></i><select data-pcol="'+i+'" aria-label="Color en el calendario">'+CCOL.map(function(z){return '<option value="'+z[0]+'"'+(catCol(c.n)===z[0]?' selected':'')+'>'+z[1]+'</option>'}).join("")+'</select></label><label class="mini">Margen <input type="number" min="0" max="100" value="'+Math.round(c.m*100)+'" data-pm="'+i+'" aria-label="Margen">%</label>':'')+'<button class="x" data-delcat="'+i+'" aria-label="Eliminar categoría '+esc(c.n)+'">✕</button></div>'}).join("")||'<div class="note">Aún no tienes categorías.</div>';
  d.innerHTML='<div class="dlg"><header><h2 style="font-size:1.62rem">Categorías de '+(isP?'pedidos':'gastos')+'</h2><button class="ib" data-close aria-label="Cerrar">✕</button></header>'+
   (msg&&window._undo?'<div class="prev">'+esc(msg)+' <button class="btn ghost sm" data-undo>Deshacer</button></div>':'')+rows+
   '<form id="catf" class="crow" style="border:0"><input type="text" id="cat_n" required placeholder="Nueva categoría">'+(isP?'<input type="number" id="cat_m" value="70" min="0" max="100" style="width:84px" aria-label="Margen %">':'')+'<button class="btn sm" type="submit">Agregar</button></form>'+
   '<p class="note" style="margin:0">'+(isP?'El color es el que tienen sus pedidos en el Calendario. El margen es lo que te queda de la venta neta después de los costos. El Panel lo usa para calcular tu ganancia. Si eliminas una categoría, sus pedidos pasan a “Sin categoría”.':'Si eliminas una categoría, sus gastos pasan a “Sin categoría”.')+'</p></div>';
  if(!d.open)d.showModal();
}
function delCat(kind,i){
  var d=$("#dlg"), msg;
  if(kind==="ped"){var c=pcats.splice(i,1)[0],ids=[];orders.forEach(function(o){if(o.cat===c.n){o.cat="Sin categoría";ids.push(o.id)}});
    msg="Categoría “"+c.n+"” eliminada.";window._undo=function(){pcats.splice(i,0,c);orders.forEach(function(o){if(ids.indexOf(o.id)>=0)o.cat=c.n})}}
  else{var n=gcats.splice(i,1)[0],ids2=[];gastos.forEach(function(g){if(g.cat===n){g.cat="Sin categoría";ids2.push(g.id)}});
    msg="Categoría “"+n+"” eliminada.";window._undo=function(){gcats.splice(i,0,n);gastos.forEach(function(g){if(ids2.indexOf(g.id)>=0)g.cat=n})}}
  openCats(kind,msg);
}
var pend=[];
var MAXF=2; window.THUMB=window.THUMB||{}; function th(f){return window.THUMB[f]||f}
function readFiles(files,cb,max){
  max=max||1200;
  Array.prototype.forEach.call(files,function(f){var r=new FileReader();r.onload=function(){
    var im=new Image();im.onload=function(){
      var sc=Math.min(1,max/Math.max(im.naturalWidth,im.naturalHeight)),c=document.createElement("canvas");
      c.width=Math.round(im.naturalWidth*sc);c.height=Math.round(im.naturalHeight*sc);
      var cx=c.getContext("2d");cx.fillStyle="#fff";cx.fillRect(0,0,c.width,c.height);cx.drawImage(im,0,0,c.width,c.height);
      cb(c.toDataURL("image/jpeg",.8))};
    im.onerror=function(){cb(r.result)};im.src=r.result};r.readAsDataURL(f)});
}

/* ---------- RENDER + EVENTOS ---------- */
function render(){
  cliAutoImport();migH();renderNav();
  var m=$("#main"); m.innerHTML='<div class="mtop"><img src="'+logoSrc()+'" alt=""><b class="bn">'+esc(cfg.nombre)+'</b></div>'+(window.planBanner?window.planBanner():"")+({panel:vPanel,cal:vCal2,ped:vPed,cli:vCli,prod:vProd,cost:vCost,pre:vPre,ing:vIng,com:vCom,inv:vInv,gas:vGas,mkt:vMkt,cfg:vCfg})[view]();
  if(view==="cost"&&recipes.length)rsum();
}
/* tras cerrar el diálogo del equipo o de un precio, la vista se vuelve a dibujar (listener de close) */
document.addEventListener("input",function(e){var t=e.target;if(!t.classList||!t.classList.contains("money"))return;
  var v=t.value,neg=/^\s*-/.test(v),c=v.replace(/[^\d,]/g,""),k=c.indexOf(","),ip=k<0?c:c.slice(0,k),dp=k<0?"":c.slice(k+1).replace(/,/g,"").slice(0,2);
  ip=ip.replace(/^0+(?=\d)/,"");var out="$ "+(neg?"-":"")+(ip?fmN.format(+ip):"0")+(k<0?"":","+dp);
  if(t.value!==out){t.value=out;try{t.setSelectionRange(out.length,out.length)}catch(er){}}},true);
document.addEventListener("focusin",function(e){var t=e.target;if(t.classList&&t.classList.contains("money")&&mnum(t.value)===0)t.value=""});
document.addEventListener("focusout",function(e){var t=e.target;if(t.classList&&t.classList.contains("money")&&!t.value.trim())t.value="$ 0"});
document.addEventListener("click",function(e){
  if(!e.target.closest("button,a,input,select,textarea,label")){var ge2=e.target.closest("tr[data-gedr]");if(ge2){openGastoEdit(+ge2.dataset.gedr);return}var gr2=e.target.closest("tr[data-gselo]");if(gr2){var gi2=+gr2.dataset.gselo;if(gSel[gi2])delete gSel[gi2];else gSel[gi2]=1;render();return}var dc=e.target.closest(".cal .d[data-nd]");if(dc){if(real().some(function(x){return x.fecha===dc.dataset.nd}))openDay(dc.dataset.nd);else openNew(dc.dataset.nd);return}}
  var t=e.target.closest("button,label.addp"); if(!t)return;
  if(extra(t)){}
  else if(t.dataset.v){view=t.dataset.v;render();scrollTo(0,0)}
  else if(t.dataset.m){cur.m+=+t.dataset.m;if(cur.m<0){cur.m=11;cur.y--}if(cur.m>11){cur.m=0;cur.y++}render()}
  else if(t.dataset.day){openDay(t.dataset.day)}
  else if(t.dataset.newday){openNew(t.dataset.newday)}
  else if(t.dataset.o){openOrder(+t.dataset.o)}
  else if(t.dataset.edito){openEdit(+t.dataset.edito)}
  else if(t.hasAttribute("data-new")){openNew()}
  else if(t.hasAttribute("data-close")){$("#dlg").close()}
  else if(t.dataset.pay){var x=orders.find(function(q){return q.id===+t.dataset.pay});x.pagado=x.total;openOrder(x.id);render()}
});
document.addEventListener("change",function(e){
  var t=e.target;
  if(extraChange(t)){}
  else if(t.id==="fcat"){filtro.cat=t.value;render()}
  else if(t.id==="fest"){filtro.est=t.value;render()}
  else if(t.dataset&&t.dataset.l){var x=orders.find(function(q){return q.id===+t.dataset.l});x.listo=t.checked;var mv=invListo(x);render();if(mv)toast(mv)}
  else if(t.dataset&&t.dataset.addph){var x2=orders.find(function(q){return q.id===+t.dataset.addph});
    var lib=MAXF-x2.fotos.length;if(lib<=0){toast("Máximo "+MAXF+" fotos por pedido");return}if(t.files.length>lib)toast("Solo se agregan "+lib+" foto"+(lib===1?"":"s")+": el máximo es "+MAXF+" por pedido");
    readFiles([].slice.call(t.files,0,lib),function(u){if(x2.fotos.length>=MAXF)return;x2.fotos.push(u);openOrder(x2.id);render()})}
  else if(t.id==="n_file"){var lib2=MAXF-pend.length;if(lib2<=0){toast("Máximo "+MAXF+" fotos por pedido");return}if(t.files.length>lib2)toast("Solo se agregan "+lib2+" foto"+(lib2===1?"":"s")+": el máximo es "+MAXF+" por pedido");
    readFiles([].slice.call(t.files,0,lib2),function(u){if(pend.length>=MAXF)return;pend.push(u);
    var im=document.createElement("img");im.src=u;im.alt="Foto nueva";$("#n_ph").insertBefore(im,$("#n_ph").lastElementChild);if(pend.length>=MAXF){var ad=$("#n_ph .addp");if(ad)ad.hidden=true}})}
});
document.addEventListener("input",function(e){
  var t=e.target;
  if(extraInput(t)){}
  else if(t.dataset&&t.dataset.r!==undefined){var r=recipe[+t.dataset.r],k=t.dataset.k;
    r[k]=(k==="n"||k==="u")?t.value:(k==="c"?mnum(t.value):(parseFloat(t.value)||0));if(k==="q"||k==="c"){$("#sub"+t.dataset.r).textContent=$$(r.q*r.c);rsum()}}
  else if(t.id==="mg"){rp.margen=+t.value;psum()}
  else if(t.id==="pa"){rp.precio=mnum(t.value);psum()}
  else if(t.dataset&&t.dataset.d){orders.find(function(q){return q.id===+t.dataset.d}).desc=t.value}
  else if(t.dataset&&t.dataset.ig){var qi=orders.find(function(q){return q.id===+t.dataset.ig});qi.ig=igUser(t.value);var ai=$("#a_ig");ai.href=igUrl(qi.ig);ai.hidden=!qi.ig}
  else if(t.dataset&&t.dataset.wa){var qw=orders.find(function(q){return q.id===+t.dataset.wa});qw.wa=waNum(t.value);var aw=$("#a_wa");aw.href=waUrl(qw.wa);aw.hidden=!qw.wa}
});
function nSaveCli(){ // cliente del pedido: el guardado elegido, o uno nuevo si se marcó "Guardar como cliente"
  var c=nCli();if(c)return c.id;var nm=$("#n_c").value.trim();if(!nm)return null;
  var ex=cliFind(nm);if(ex)return ex.id;c={id:cid++,n:nm,tipo:nTc(),wa:waNum($("#n_wa").value),ig:igUser($("#n_ig").value),mail:"",rs:"",rut:"",giro:"",dir:"",com:"",notas:"",pr:{}};clis.push(c);return c.id}
document.addEventListener("submit",function(e){
  if(e.target.id==="gf"||e.target.id==="grpf"||e.target.id==="catf"||e.target.id==="newrf"){e.preventDefault();extraSubmit(e.target);return}
  if(e.target.id!=="nf")return; e.preventDefault();
  if(e.target.dataset.edit){var ox=orders.find(function(q){return q.id===+e.target.dataset.edit}); if(!ox)return;
    var ef=$("#n_f").value, et=mnum($("#n_t").value), ek=$("#n_k").value;
    if(ek==="__new"){ek=$("#n_nkn").value.trim()||"Sin categoría";if(!pcats.some(function(q){return q.n===ek}))pcats.push({n:ek,m:Math.min(100,Math.max(0,parseFloat($("#n_nkm").value)||70))/100})}
    if(!ox.cot&&ef!==ox.fecha&&!window._skipW&&dayWarn(ef,ox.id,function(){window._skipW=true;$("#nf").requestSubmit()},function(){var fi=$("#n_f");if(fi)fi.focus()}))return;
    window._skipW=false;
    ox.cliente=$("#n_c").value.trim();ox.ig=igUser($("#n_ig").value);ox.wa=waNum($("#n_wa").value);ox.fecha=ef;ox.hora=$("#n_h").value||"12:00";ox.cat=ek;ox.canal=$("#n_a").value;
    if(!window.NO_PM)ox.items=window._nl.filter(function(l){return l.rid}).map(function(l){return {rid:l.rid,q:+l.q||0,p:+l.p||0}});
    if(!window.NO_CLI){ox.cid=nSaveCli()||null;ox.desp=nDespB();ox.despi=($("#n_despi")||{}).value==="sin"?"sin":"con";ox.dsc=parseFloat(String($("#n_dsc").value).replace(/\./g,"").replace(",","."))||0;ox.dsct=$("#n_dsct").value}
    if($("#n_tc"))ox.tc=$("#n_tc").value;ox.personas=+$("#n_pe").value||null;ox.desc=$("#n_d").value.trim()||"Sin descripción.";ox.total=et;ox.pagado=Math.min(et,mnum($("#n_p").value));
    $("#dlg").close();var ep=pd(ef);cur={y:ep.getFullYear(),m:ep.getMonth()};render();openOrder(ox.id);toast("Cambios guardados");return}
  var f=$("#n_f").value, p=pd(f), tot=mnum($("#n_t").value), pg=Math.min(tot,mnum($("#n_p").value)), kc=$("#n_k").value;
  if(kc==="__new"){kc=$("#n_nkn").value.trim()||"Sin categoría";if(!pcats.some(function(q){return q.n===kc}))pcats.push({n:kc,m:Math.min(100,Math.max(0,parseFloat($("#n_nkm").value)||70))/100})}
  var rv=($("#n_r")||{}).value, its=window.NO_PM?(rv?[{rid:+rv,q:parseFloat($("#n_rq").value)||1}]:[]):window._nl.filter(function(l){return l.rid}).map(function(l){return {rid:l.rid,q:+l.q||0,p:+l.p||0}});
  var isq=!!window._cot; window._cot=false;
  if(!isq&&!window._skipW&&dayWarn(f,0,function(){window._skipW=true;$("#nf").requestSubmit()},function(){var fi=$("#n_f");if(fi)fi.focus()}))return;
  window._skipW=false;
  var n={id:nextId++,cot:isq,num:isq?nextQ():0,cond:cfg.cond,vig:cfg.vig,items:its,cliente:$("#n_c").value.trim(),ig:igUser($("#n_ig").value),wa:waNum($("#n_wa").value),fecha:f,hora:$("#n_h").value||"12:00",cat:kc,canal:$("#n_a").value,desc:$("#n_d").value.trim()||"Sin descripción.",personas:+$("#n_pe").value||null,total:tot,pagado:pg,fotos:pend.slice(),listo:false,tc:$("#n_tc")?$("#n_tc").value:"minorista"};
  if(!window.NO_CLI){n.cid=nSaveCli()||null;n.desp=nDespB();n.despi=($("#n_despi")||{}).value==="sin"?"sin":"con";n.dsc=parseFloat(String($("#n_dsc").value).replace(/\./g,"").replace(",","."))||0;n.dsct=$("#n_dsct").value}
  orders.push(n);pend=[];cur={y:p.getFullYear(),m:p.getMonth()};view=isq?"ped":"cal";$("#dlg").close();render();
  if(isq){openOrder(n.id);toast("Cotización "+qn(n)+" guardada")}
});
$("#dlg").addEventListener("close",function(){pend=[];catsOpen=null;render()});

