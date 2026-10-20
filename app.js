/* Dulcia - interfaz. Generado a partir del prototipo. */
var TODAY=(function(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")})(), IVA=1.19;
var pcats=[];
function marg(c){var x=pcats.find(function(p){return p.n===c});return x?x.m:.70}
var CANALES=["WhatsApp","Instagram","Tienda web","Cafetería"];
var orders=[];
var nextId=1, qnum=1;
function nextQ(){return qnum++}
function qn(x){return "N° "+String(x.num).padStart(4,"0")}
var cur={y:+TODAY.slice(0,4),m:+TODAY.slice(5,7)-1}, view="panel", filtro={cat:"",est:""};
var gbuy={"Ingredientes":true,"Empaque y decoración":true,"Mano de obra y gastos":false};
var rid=1, I="Ingredientes", E="Empaque y decoración", M="Mano de obra y gastos";
function mk(n,rinde,margen,precio,rows){return {id:rid++,nombre:n,rinde:rinde,margen:margen,precio:precio,items:rows.map(function(r){return {g:r[0],n:r[1],q:r[2],u:r[3],c:r[4]}})}}
var recipes=[];
var curR=0, recipe=[], rp={nombre:"",rinde:"",margen:70,precio:0};
function selR(id){var r=recipes.find(function(q){return q.id===id});if(r){curR=id;recipe=r.items;rp=r}}
var wk=(function(){var d=pd(TODAY),k=(d.getDay()+6)%7;d.setDate(d.getDate()-k);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")})(), catsOpen=null;
var cfg={cap:3,logo:null,logoData:null,logoPath:null,logoDirty:false,tel:"",mail:"",vig:7,abono:50,cond:"",nombre:"",gcal:false,asked:true,url:"",msg:""};
var hora={sueldo:0,horas:160};
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
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
var fm=new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0});
function $$(n){n=Math.round(n);return (n<0?"-":"")+fm.format(Math.abs(n))}
var MESES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
var DIAS=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
function pd(s){var p=s.split("-");return new Date(+p[0],+p[1]-1,+p[2])}
function fechaLarga(s){var d=pd(s);return DIAS[d.getDay()]+" "+d.getDate()+" de "+MESES[d.getMonth()]}
function real(){return orders.filter(function(o){return !o.cot})}
function st(x){return x.cot?"cot":(x.pagado>=x.total?"pagado":(x.pagado>0?"anticipo":"sin"))}
var STL={cot:"Cotizado",pagado:"Pagado",anticipo:"Falta saldo",sin:"Sin pago"};
function inMonth(x){var d=pd(x.fecha);return d.getFullYear()===cur.y&&d.getMonth()===cur.m}
function chipS(x){return '<span class="chip s-'+st(x)+'">'+STL[st(x)]+'</span>'}

var ICON={
 panel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/></svg>',
 cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
 ped:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/></svg>',
 prod:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 12h16M6 12a6 6 0 0 1 12 0M5 12v4a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-4"/></svg>',
 cost:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0"/></svg>',
 inv:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 8l9-5 9 5-9 5z"/><path d="M3 8v8l9 5 9-5V8"/></svg>',
 l:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg>',
 r:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M9 5l7 7-7 7"/></svg>'
};
ICON.gas='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M14.5 9.2c-.5-.8-1.4-1.2-2.5-1.2-1.4 0-2.5.7-2.5 1.8 0 2.6 5 1.2 5 3.9 0 1.1-1.100 1.800-2.500 1.800-1.100 0-2.100-.5-2.600-1.400M12 6v2M12 16v2"/></svg>';
ICON.cfg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>';
ICON.com='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11h10l2-8H6.5"/><circle cx="9" cy="19.500" r="1.200"/><circle cx="17" cy="19.500" r="1.200"/></svg>';
var NAV=[["panel","Panel","panel"],["cal","Calendario","cal"],["ped","Pedidos","ped"],["prod","Producción","prod"],["cost","Recetas","cost"],["com","Compras","com"],["gas","Gastos","gas"],["cfg","Ajustes","cfg"]];
function renderNav(){
  $("#side").innerHTML='<div class="brand"><img class="blogo" src="'+logoSrc()+'" alt=""><div><div class="bn">'+esc(cfg.nombre)+'</div><small>con Dulcia</small></div></div><div style="height:14px"></div>'+NAV.map(function(n){
    return '<button class="nav" data-v="'+n[0]+'"'+(view===n[0]?' aria-current="page"':'')+'>'+ICON[n[2]]+'<span>'+n[1]+'</span></button>'}).join("")+
    '<button class="nav" disabled>'+ICON.inv+'<span>Inventario</span><small>pronto</small></button>'+
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
  return {list:list,v:v,neto:neto,cob:cob,por:v-cob,contrib:contrib,costos:neto-contrib,mg:mg,G:G,GI:GI,gs:gs,res:contrib-G,pe:G/mg,ivaD:v-neto,mn:neto?(contrib-G)/neto:0};
}
function vPanel(){
  var s=stats(), pct=s.G?Math.min(100,s.neto/s.pe*100):100;
  var porCat={};s.list.forEach(function(x){var n=x.total/IVA;porCat[x.cat]=porCat[x.cat]||{n:0,c:0};porCat[x.cat].n+=n;porCat[x.cat].c+=n*marg(x.cat)});
  var rows=Object.keys(porCat).sort(function(a,b){return porCat[b].c-porCat[a].c}).map(function(k){var c=porCat[k];
    return '<tr><td>'+k+'</td><td class="r">'+$$(c.n)+'</td><td class="r">'+Math.round(marg(k)*100)+'%</td><td class="r">'+$$(c.c)+'</td></tr>'}).join("");
  var gc={};s.gs.forEach(function(g){gc[g.cat]=(gc[g.cat]||0)+gN(g)});
  var grows=Object.keys(gc).sort(function(a,b){return gc[b]-gc[a]}).map(function(k){return '<tr><td>'+esc(k)+'</td><td class="r">'+$$(gc[k])+'</td></tr>'}).join("");
  var falta=s.pe-s.neto, ivaPag=s.ivaD-s.GI;
  function row(l,v,b,col){return '<tr'+(b?' class="tot"':'')+'><td>'+l+'</td><td class="r'+(col?(v>=0?' pos':' neg'):'')+'">'+$$(v)+'</td></tr>'}
  return head("Panel",monthBar())+
  '<div class="grid kpis">'+
   kpi("Ventas del mes",$$(s.v),s.list.length+" pedidos · cobrado "+$$(s.cob))+
   kpi("Costos de producción",$$(s.costos),"Estimado según el margen de cada categoría")+
   kpi("Gastos del mes",$$(s.G),s.gs.length+" gastos, sin IVA")+
   kpi("Resultado final",'<span class="'+(s.res>=0?'pos':'neg')+'">'+$$(s.res)+'</span>',"Margen neto: "+(s.mn*100).toFixed(1)+"%")+
  '</div><div class="grid two" style="margin-top:14px"><div class="grid" style="align-content:start">'+
   '<section class="card"><h2 style="font-size:1.38rem">Del ingreso al resultado</h2><table><tbody>'+
    row("Ventas netas (sin IVA)",s.neto)+row("Costos de producción",-s.costos)+row("Utilidad bruta",s.contrib,1)+row("Gastos del mes",-s.G)+row("Resultado final",s.res,1,1)+'</tbody></table>'+
    '<dl class="kv" style="margin-top:14px"><dt>IVA de tus ventas</dt><dd>'+$$(s.ivaD)+'</dd><dt>IVA de tus gastos</dt><dd>-'+$$(s.GI)+'</dd><dt>IVA por pagar (estimado)</dt><dd><b>'+$$(ivaPag)+'</b></dd></dl><p class="note">El IVA es una estimación. Confírmalo con tu contador.</p></section>'+
   '<section class="card"><h2 style="font-size:1.38rem">Punto de equilibrio</h2>'+
   (s.G?'<p class="note" style="margin-top:4px">Ventas netas que necesitas para cubrir tus gastos de '+$$(s.G)+'.</p><div class="bar"><span style="width:'+pct+'%"></span></div>'+
   '<div style="display:flex;justify-content:space-between;font-size:.9rem"><span>Llevas '+$$(s.neto)+'</span><span>Meta '+$$(s.pe)+'</span></div>'+
   '<p style="margin:14px 0 0;font-weight:600">'+(falta>0?'Te faltan '+$$(falta)+' de ventas netas para no perder.':'Ya superaste el punto de equilibrio por '+$$(-falta)+'.')+'</p>':'<p class="note">Registra tus gastos del mes en la sección Gastos para calcular tu punto de equilibrio.</p>')+'</section></div>'+
   '<div class="grid" style="align-content:start"><section class="card"><h2 style="font-size:1.38rem">Margen por categoría</h2><div class="scroll"><table class="mc"><thead><tr><th>Categoría</th><th class="r">Venta neta</th><th class="r">Margen</th><th class="r">Aporte</th></tr></thead><tbody>'+(rows||'<tr><td colspan="4" class="empty">Sin pedidos este mes.</td></tr>')+'</tbody></table></div></section>'+
   '<section class="card"><h2 style="font-size:1.38rem">Gastos por categoría</h2><table><tbody>'+(grows||'<tr><td class="empty">Sin gastos este mes.</td></tr>')+'</tbody></table></section></div>'+
  '</div>';
}
function kpi(l,v,n){return '<div class="card kpi"><div class="l">'+l+'</div><div class="v">'+v+'</div><div class="n">'+n+'</div></div>'}

/* ---------- CALENDARIO ---------- */
function vCalBase(){
  var first=new Date(cur.y,cur.m,1), off=(first.getDay()+6)%7, dim=new Date(cur.y,cur.m+1,0).getDate(), cells="";
  ["lun","mar","mié","jue","vie","sáb","dom"].forEach(function(d){cells+='<div class="dh">'+d+'</div>'});
  for(var i=0;i<off;i++)cells+='<div class="d off"></div>';
  for(var d=1;d<=dim;d++){
    var iso=cur.y+"-"+String(cur.m+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");
    var ev=real().filter(function(x){return x.fecha===iso}).sort(function(a,b){return a.hora<b.hora?-1:1});
    var h=ev.slice(0,3).map(function(x){return '<button class="ev s-'+st(x)+'" data-o="'+x.id+'" title="'+esc(x.cliente)+'">'+esc(x.cliente)+'</button>'}).join("");
    if(ev.length>3)h+='<span class="more">+'+(ev.length-3)+' más</span>';
    cells+='<div class="d'+(iso===TODAY?' today':'')+'"><span class="n">'+d+'</span>'+h+'</div>';
  }
  var rest=(7-(off+dim)%7)%7;for(i=0;i<rest;i++)cells+='<div class="d off"></div>';
  return head("Calendario",monthBar()+'<button class="btn" data-new>Nuevo pedido</button>')+
   '<div class="cal">'+cells+'</div>'+
   '<div class="legend"><span class="chip s-pagado">Pagado</span><span class="chip s-anticipo">Falta saldo</span><span class="chip s-sin">Sin pago</span><span>Toca un pedido para ver su foto y descripción.</span></div>';
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
  return head("Pedidos",monthBar()+'<button class="btn ghost" data-cats="ped">Categorías</button><button class="btn" data-new>Nuevo pedido</button>')+
   '<div class="filters"><select id="fcat" aria-label="Categoría">'+opts+'</select><select id="fest" aria-label="Estado de pago">'+es+'</select></div>'+
   '<div class="grid">'+(l.length?l.map(function(x){
     return '<button class="ord" data-o="'+x.id+'">'+(x.fotos[0]?'<img class="thumb" src="'+x.fotos[0]+'" alt="">':'<div class="thumb">sin foto</div>')+
     '<div style="min-width:0"><h3>'+esc(x.cliente)+'</h3><p>'+fechaLarga(x.fecha)+' · '+x.hora+' · '+esc(x.cat)+'</p><p>'+esc(x.desc)+'</p></div>'+
     '<div class="rt"><b>'+$$(x.total)+'</b>'+chipS(x)+'</div></button>'}).join(""):'<div class="card empty">No hay pedidos con estos filtros. Crea uno con “Nuevo pedido”.</div>')+'</div>';
}

/* ---------- PRODUCCION ---------- */
function vProd(){
  var t0=pd(TODAY), days=[];
  for(var i=0;i<7;i++){var d=new Date(t0.getFullYear(),t0.getMonth(),t0.getDate()+i);days.push(d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"))}
  var total=0,html=days.map(function(iso){
    var ev=real().filter(function(x){return x.fecha===iso}).sort(function(a,b){return a.hora<b.hora?-1:1});
    total+=ev.length;
    return '<div class="day"><h3>'+fechaLarga(iso)+(iso===TODAY?' (hoy)':'')+'</h3>'+(ev.length?ev.map(function(x){
      return '<label class="prod'+(x.listo?' done':'')+'"><input type="checkbox" data-l="'+x.id+'"'+(x.listo?' checked':'')+'><div style="flex:1;min-width:0"><b>'+x.hora+' · '+esc(x.cliente)+'</b><div class="note" style="margin:0">'+esc(x.cat)+' · '+esc(x.desc)+'</div></div>'+(x.fotos[0]?'<img class="thumb" style="width:48px;height:48px" src="'+x.fotos[0]+'" alt="">':'')+'</label>'}).join(""):'<div class="note">Sin pedidos.</div>')+'</div>'}).join("");
  return head("Producción",'<span class="note" style="margin:0">Próximos 7 días · '+total+' pedidos</span>')+html;
}

/* ---------- RECETAS ---------- */
function rtot(){return recipe.reduce(function(a,r){return a+r.q*r.c},0)}
function rcost(r){return r.items.reduce(function(a,i){return a+i.q*i.c},0)}
function groups(){var g=[];recipe.forEach(function(r){if(g.indexOf(r.g)<0)g.push(r.g)});return g}
function insertRow(gp){var last=-1;recipe.forEach(function(r,i){if(r.g===gp)last=i});recipe.splice(last+1,0,{g:gp,n:"Nuevo ítem",q:1,u:"un",c:0})}
var FQ=new Intl.NumberFormat("es-CL",{maximumFractionDigits:2});
function fq(n){return FQ.format(n)}
function vCost(){
  var top=head("Recetas",'<button class="btn" data-newr>Nueva receta</button>');
  if(!recipes.length)return top+'<div class="card empty">Aún no tienes recetas. Crea la primera con “Nueva receta”.</div>';
  var chips=recipes.map(function(r){return '<button class="rc'+(r.id===curR?' on':'')+'" data-sel="'+r.id+'"><b>'+esc(r.nombre)+'</b><span>'+esc(r.rinde)+'</span><span>Costo '+$$(rcost(r))+'</span></button>'}).join("");
  var g="",gl=groups();
  gl.forEach(function(gp,gi){
    g+='<tr class="grp"><td colspan="5"><div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><span>'+esc(gp)+'</span><label class="chk"><input type="checkbox" data-gbuy="'+gi+'"'+(gbuy[gp]!==false?' checked':'')+'> se compra</label></div></td><td><button class="x" data-delgrp="'+gi+'" aria-label="Eliminar categoría de costo">✕</button></td></tr>';
    recipe.forEach(function(r,i){ if(r.g!==gp)return;
      g+='<tr><td><input class="t" type="text" value="'+esc(r.n)+'" data-r="'+i+'" data-k="n" aria-label="Nombre"></td><td style="width:84px"><input type="number" step="any" value="'+r.q+'" data-r="'+i+'" data-k="q" aria-label="Cantidad"></td><td style="width:64px"><input class="u t" type="text" value="'+esc(r.u)+'" data-r="'+i+'" data-k="u" aria-label="Unidad"></td><td style="width:100px"><input type="number" step="any" value="'+r.c+'" data-r="'+i+'" data-k="c" aria-label="Costo por unidad"></td><td class="r" style="width:92px" id="sub'+i+'">'+$$(r.q*r.c)+'</td><td style="width:34px"><button class="x" data-delrow="'+i+'" aria-label="Quitar ítem">✕</button></td></tr>';
    });
    g+='<tr><td colspan="6"><button class="btn ghost sm" data-addrow="'+gi+'">+ Agregar ítem</button></td></tr>';
  });
  return top+'<div class="rlist">'+chips+'</div>'+
  '<div class="grid two costgrid"><section class="card cost"><div class="f" style="margin-bottom:10px"><label>Nombre de la receta<input type="text" id="rn" value="'+esc(rp.nombre)+'"></label><label>Rinde<input type="text" id="rr" value="'+esc(rp.rinde)+'"></label></div>'+
  '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ghost sm" data-addgrp>+ Nueva categoría de costo</button><button class="btn ghost sm" data-dupr>Duplicar receta</button><button class="btn ghost sm danger" data-delr>Eliminar receta</button></div>'+
  '<p class="note">Marca “se compra” en las categorías que van a la lista de Compras. Valores de ejemplo.</p>'+
  '<div class="scroll"><table><thead><tr><th>Ítem</th><th class="r">Cantidad</th><th>Unidad</th><th class="r">Costo unidad</th><th class="r">Subtotal</th><th></th></tr></thead><tbody>'+g+'<tr class="tot"><td colspan="4">Costo total</td><td class="r" id="rtot"></td><td></td></tr></tbody></table></div></section>'+
  '<div class="grid" style="align-content:start"><section class="card" id="rsum">'+rskel()+'</section></div></div>';
}
function rsum(){
  var c=rtot(), m=rp.margen/100, neto=c/(1-m), sug=Math.ceil(neto*IVA/1000)*1000;
  var pn=rp.precio/IVA, real=pn>0?(pn-c)/pn*100:0;
  $("#rtot").textContent=$$(c);
  $("#mgv").textContent=rp.margen+"%";
  $("#sug").textContent=$$(sug); $("#sugn").textContent="con IVA · neto "+$$(neto);
  $("#kc").textContent=$$(c); $("#kg").textContent=$$(neto-c);
  var r=$("#real"); r.textContent=real.toFixed(1)+"%"; r.className=real>=rp.margen?"pos":"neg";
  $("#realg").textContent=$$(pn-c);
  $("#hv").textContent=$$(hora.sueldo/Math.max(1,hora.horas));
}
function rskel(){
  return '<h2 style="font-size:1.38rem">Precio sugerido</h2>'+
   '<label style="display:block;margin-top:10px;font-size:.85rem;color:var(--soft)">Margen que quieres ganar: <b style="color:var(--ink)" id="mgv"></b><input type="range" id="mg" min="40" max="90" value="'+rp.margen+'"></label>'+
   '<div class="big" style="margin-top:8px" id="sug"></div><div class="note" style="margin-top:0" id="sugn"></div>'+
   '<dl class="kv" style="margin-top:14px"><dt>Costo de producción</dt><dd id="kc"></dd><dt>Ganancia por receta</dt><dd id="kg"></dd></dl>'+
   '<h3 style="font-size:1.2rem;margin-top:20px">Con tu precio actual</h3>'+
   '<label style="display:block;margin-top:6px;font-size:.85rem;color:var(--soft)">Precio que cobras (con IVA)<input type="number" id="pa" value="'+rp.precio+'"></label>'+
   '<p style="margin:10px 0 0;font-weight:600">Margen real: <span id="real"></span> · ganancia <span id="realg"></span></p>'+
   '<h3 style="font-size:1.2rem;margin-top:22px;padding-top:18px;border-top:1px solid var(--line)">Tu hora de trabajo</h3>'+
   '<p class="note" style="margin-top:2px">Cuánto cobrar por hora para ganar el sueldo que quieres.</p>'+
   '<div class="f" style="margin-top:8px"><label>Sueldo mensual que quieres<input type="number" id="hs" value="'+hora.sueldo+'"></label><label>Horas que trabajas al mes<input type="number" id="hh" value="'+hora.horas+'"></label></div>'+
   '<div style="display:flex;gap:10px;align-items:center;justify-content:space-between;margin-top:12px;flex-wrap:wrap"><div><span class="big" style="font-size:1.5rem" id="hv"></span> <span class="note">por hora</span></div><button class="btn sm" data-usehour>Usar en la receta</button></div>'+
   '<p class="note">Si ya anotaste tu sueldo en Gastos, cuéntalo en un solo lugar: aquí o allá. Si no, lo sumarías dos veces.</p>';
}
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


/* ---------- PDF ---------- */
function money(n){return "$"+Math.round(n).toLocaleString("es-CL")}
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
  pair("Cliente",x.cliente,M,y);pair("Fecha de entrega",fmtF(x.fecha),M+70,y);pair("Hora",x.hora+" hrs",M+140,y);y+=15;
  doc.setFont("helvetica","bold");doc.setFontSize(11);doc.setTextColor.apply(doc,AC);doc.text("Detalle del pedido",M,y);y+=6;
  doc.setFont("helvetica","normal");doc.setFontSize(10.5);doc.setTextColor.apply(doc,INK);
  var dl=doc.splitTextToSize(x.desc||"",W-2*M);dl.forEach(function(l){chk(6);doc.text(l,M,y);y+=5.2});y+=3;
  var fsrc=(x.fotos&&x.fotos[0])?await toData(x.fotos[0]):null;
  if(fsrc){var fi=fmtOf(fsrc),inf=fi?await imgInfo(fsrc):null;
    if(inf){var mh=62,mw=90,sc=Math.min(mw/inf.w,mh/inf.h),iw=inf.w*sc,ih=inf.h*sc;chk(ih+10);try{doc.addImage(fsrc,fi,M,y,iw,ih);y+=ih+2;doc.setFontSize(8);doc.setTextColor.apply(doc,SOFT);doc.text("Foto referencial",M,y+3);y+=8}catch(e){}}}
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
function compras(){
  var to=addDays(wk,6), ords=real().filter(function(o){return o.fecha>=wk&&o.fecha<=to}).sort(function(a,b){return (a.fecha+a.hora)<(b.fecha+b.hora)?-1:1}), agg={}, sin=[], con=[];
  ords.forEach(function(o){
    var ln=(o.items||[]).filter(function(l){return recipes.some(function(r){return r.id===l.rid})});
    if(!ln.length){sin.push(o);return}
    con.push({o:o,ln:ln});
    ln.forEach(function(l){var r=recipes.find(function(q){return q.id===l.rid});
      r.items.forEach(function(it){ if(gbuy[it.g]===false)return;
        var k=it.g+"|"+it.n.trim().toLowerCase()+"|"+it.u.trim().toLowerCase();
        var a=agg[k]=agg[k]||{g:it.g,n:it.n,u:it.u,q:0,c:it.c}; a.q+=it.q*l.q})})
  });
  var rows=Object.keys(agg).map(function(k){return agg[k]}).sort(function(a,b){return a.g===b.g?(a.n<b.n?-1:1):(a.g<b.g?-1:1)}), total=0;
  rows.forEach(function(r){total+=r.q*r.c});
  return {ords:ords,rows:rows,sin:sin,con:con,total:total};
}
function vCom(){
  var c=compras(), a=pd(wk), b=pd(addDays(wk,6));
  var bar='<div class="month"><button class="ib" data-w="-7" aria-label="Semana anterior">'+ICON.l+'</button><b style="min-width:11em;text-transform:none">'+a.getDate()+' al '+b.getDate()+' de '+MESES[b.getMonth()]+'</b><button class="ib" data-w="7" aria-label="Semana siguiente">'+ICON.r+'</button></div>';
  var body="",lg="";
  c.rows.forEach(function(r){ if(r.g!==lg){body+='<tr class="grp"><td colspan="4">'+esc(r.g)+'</td></tr>';lg=r.g}
    body+='<tr><td>'+esc(r.n)+'</td><td class="r">'+fq(r.q)+'</td><td>'+esc(r.u)+'</td><td class="r">'+$$(r.q*r.c)+'</td></tr>'});
  var inc=c.con.map(function(z){return '<button class="ord" style="grid-template-columns:minmax(0,1fr)" data-o="'+z.o.id+'"><div style="min-width:0"><h3>'+esc(z.o.cliente)+'</h3><p>'+fechaLarga(z.o.fecha)+' · '+z.ln.map(function(l){var r=recipes.find(function(q){return q.id===l.rid});return esc(r.nombre)+' × '+fq(l.q)}).join(", ")+'</p></div></button>'}).join("");
  var sin=c.sin.map(function(o){return '<button class="chip s-anticipo" style="border:0" data-o="'+o.id+'">'+esc(o.cliente)+' · '+pd(o.fecha).getDate()+'/'+(pd(o.fecha).getMonth()+1)+'</button>'}).join(" ");
  return head("Compras",bar+(c.rows.length?'<button class="btn" data-copyc>Copiar lista</button>':''))+
  '<div class="grid kpis" style="grid-template-columns:repeat(3,minmax(0,1fr));margin-bottom:14px">'+kpi("Pedidos de la semana",c.ords.length,c.con.length+" con receta")+kpi("Compra estimada",$$(c.total),"Ingredientes y materia prima")+kpi("Productos distintos",c.rows.length,"En la lista de compras")+'</div>'+
  '<div class="grid two"><section class="card"><h2 style="font-size:1.38rem">Qué comprar</h2>'+
  (c.rows.length?'<div class="scroll"><table><thead><tr><th>Ingrediente o materia prima</th><th class="r">Cantidad</th><th>Unidad</th><th class="r">Costo estimado</th></tr></thead><tbody>'+body+'<tr class="tot"><td colspan="3">Total estimado</td><td class="r">'+$$(c.total)+'</td></tr></tbody></table></div>':'<div class="empty">No hay pedidos con receta esta semana. Asigna una receta a tus pedidos para ver qué comprar.</div>')+
  '<p class="note">Los precios salen de tus recetas. Descuenta lo que ya tienes en bodega: el módulo de Inventario lo hará solo.</p></section>'+
  '<div class="grid" style="align-content:start"><section class="card"><h2 style="font-size:1.38rem;margin-bottom:10px">Pedidos incluidos</h2><div class="grid" style="gap:8px">'+(inc||'<div class="empty">Sin pedidos con receta.</div>')+'</div></section>'+
  (c.sin.length?'<section class="card"><h2 style="font-size:1.26rem">Sin receta asignada</h2><p class="note" style="margin-top:2px">Estos pedidos no suman a la lista. Toca uno para asignarle una receta.</p><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">'+sin+'</div></section>':'')+'</div></div>';
}
function copiarLista(){
  var c=compras(), tx="Compras del "+pd(wk).getDate()+" al "+pd(addDays(wk,6)).getDate()+" de "+MESES[pd(addDays(wk,6)).getMonth()]+"\n"+c.rows.map(function(r){return "- "+r.n+": "+fq(r.q)+" "+r.u}).join("\n")+"\nTotal estimado: "+$$(c.total);
  function fb(){var d=$("#dlg");d.innerHTML='<div class="dlg"><header><h2 style="font-size:1.44rem">Lista de compras</h2><button class="ib" data-close aria-label="Cerrar">✕</button></header><textarea id="cpt" rows="12" readonly></textarea><p class="note" style="margin:0">Selecciona el texto y cópialo.</p></div>';$("#cpt").value=tx;d.showModal();$("#cpt").select()}
  try{navigator.clipboard.writeText(tx).then(function(){toast("Lista copiada")},fb)}catch(e){fb()}
}
var tt;
function toast(msg,undo){var el=$("#toast");el.innerHTML='<span>'+esc(msg)+'</span>'+(undo?'<button data-undo>Deshacer</button>':'');el.hidden=false;window._undo=undo||null;clearTimeout(tt);tt=setTimeout(function(){el.hidden=true;window._undo=null},7000)}

/* ---------- GASTOS ---------- */
function vGas(){
  var gs=gMes().sort(function(a,b){return a.fecha<b.fecha?-1:1}), N=0,I=0,T=0;
  var rows=gs.map(function(g){N+=gN(g);I+=gI(g);T+=gN(g)+gI(g);
    return '<tr><td>'+g.fecha.slice(8)+"/"+g.fecha.slice(5,7)+'</td><td>'+esc(g.cat)+'</td><td>'+esc(g.nombre)+'</td><td class="r">'+$$(g.monto)+'<div class="note" style="margin:0;font-size:.72rem">'+IVAL[g.iva]+'</div></td><td class="r">'+$$(gN(g))+'</td><td class="r">'+$$(gI(g))+'</td><td class="r">'+$$(gN(g)+gI(g))+'</td><td><button class="x" data-gdel="'+g.id+'" aria-label="Eliminar gasto">✕</button></td></tr>'}).join("");
  return head("Gastos",monthBar()+'<button class="btn ghost" data-cats="gas">Categorías</button><button class="btn" data-newg>Nuevo gasto</button>')+
   '<section class="card"><div class="scroll"><table><thead><tr><th>Día</th><th>Categoría</th><th>Gasto</th><th class="r">Monto</th><th class="r">Neto</th><th class="r">IVA</th><th class="r">Total pagado</th><th></th></tr></thead><tbody>'+
   (rows||'<tr><td colspan="8" class="empty">Aún no registras gastos este mes. Usa “Nuevo gasto” para agregar el primero.</td></tr>')+
   (rows?'<tr class="tot"><td colspan="4">Total del mes</td><td class="r">'+$$(N)+'</td><td class="r">'+$$(I)+'</td><td class="r">'+$$(T)+'</td><td></td></tr>':'')+'</tbody></table></div>'+
   '<p class="note">El monto neto de estos gastos es el que se descuenta de tus ventas en el Panel. El IVA se usa para estimar el IVA por pagar.</p></section>';
}
function openGasto(){
  var d=$("#dlg");
  d.innerHTML='<form class="dlg" id="gf"><header><h2 style="font-size:1.62rem">Nuevo gasto</h2><button type="button" class="ib" data-close aria-label="Cerrar">✕</button></header>'+
  '<div class="f"><label>Fecha<input type="date" id="g_f" required value="'+cur.y+'-'+String(cur.m+1).padStart(2,"0")+'-15"></label>'+
  '<label>Categoría<select id="g_k">'+gcats.map(function(c){return '<option>'+esc(c)+'</option>'}).join("")+'<option value="__new">+ Crear categoría nueva</option></select></label>'+
  '<label class="w" id="g_nk" hidden>Nombre de la categoría nueva<input type="text" id="g_nkv" placeholder="Ej.: Packaging"></label>'+
  '<label class="w">Nombre del gasto<input type="text" id="g_n" required placeholder="Ej.: Compra de mantequilla"></label>'+
  '<label class="w">Monto<input type="number" id="g_m" min="0" required value="0"></label>'+
  '<div class="w rad" role="radiogroup" aria-label="IVA"><label><input type="radio" name="giva" value="incl" checked><span><b>El monto incluye IVA</b><br><span style="color:var(--soft)">Descontamos el IVA para calcular el gasto neto.</span></span></label>'+
  '<label><input type="radio" name="giva" value="mas"><span><b>El monto no incluye IVA</b><br><span style="color:var(--soft)">Le sumamos el IVA para saber cuánto pagas en total.</span></span></label>'+
  '<label><input type="radio" name="giva" value="no"><span><b>No lleva IVA</b><br><span style="color:var(--soft)">Sueldos, préstamos y otros gastos exentos.</span></span></label></div>'+
  '<div class="w prev" id="g_prev"></div></div>'+
  '<div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn ghost" data-close>Cancelar</button><button class="btn" type="submit">Guardar gasto</button></div></form>';
  d.showModal(); gprev();
}
function gmode(){var r=document.querySelector('input[name="giva"]:checked');return r?r.value:"incl"}
function gprev(){var g={monto:+($("#g_m").value)||0,iva:gmode()};$("#g_prev").innerHTML='<dl class="kv"><dt>Gasto neto</dt><dd>'+$$(gN(g))+'</dd><dt>IVA</dt><dd>'+$$(gI(g))+'</dd><dt>Total pagado</dt><dd><b>'+$$(gN(g)+gI(g))+'</b></dd></dl>'}
function openGrp(){
  var d=$("#dlg");
  d.innerHTML='<form class="dlg" id="grpf"><header><h2 style="font-size:1.62rem">Nueva categoría de costo</h2><button type="button" class="ib" data-close aria-label="Cerrar">✕</button></header>'+
  '<label style="display:flex;flex-direction:column;gap:4px;font-size:.85rem;color:var(--soft)">Nombre<input type="text" id="grp_n" required placeholder="Ej.: Transporte, Decoración extra, Moldes"></label><label class="chk" style="font-size:.9rem;color:var(--ink)"><input type="checkbox" id="grp_b" checked> Se compra (aparece en Compras)</label>'+
  '<div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn ghost" data-close>Cancelar</button><button class="btn" type="submit">Crear categoría</button></div></form>';
  d.showModal();
}

/* ---------- AJUSTES ---------- */
function vCfg(){
  return head("Ajustes")+'<div class="grid" style="max-width:720px">'+
  '<section class="card"><h2 style="font-size:1.38rem">Tu pastelería</h2><div class="logoedit" style="margin-top:12px"><img src="'+logoSrc()+'" alt="Logo"><label class="btn ghost sm" style="cursor:pointer">Cambiar logo<input type="file" accept="image/*" hidden id="cl"></label></div>'+
  '<label style="display:flex;flex-direction:column;gap:4px;font-size:.85rem;color:var(--soft);margin-top:14px">Nombre<input type="text" id="cn" value="'+esc(cfg.nombre)+'"></label><p class="note">El logo y el nombre aparecen en el menú y, más adelante, en tus cotizaciones en PDF.</p></section>'+
  '<section class="card"><h2 style="font-size:1.38rem">Capacidad diaria</h2><p class="note" style="margin-top:2px">Te avisamos cuando un día ya llegó a este número de pedidos y vas a agregar otro. Pon 0 para no recibir avisos.</p>'+
  '<label style="display:flex;flex-direction:column;gap:4px;font-size:.85rem;color:var(--soft);margin-top:10px;max-width:220px">Pedidos por día antes de avisar<input type="number" id="cp" min="0" value="'+cfg.cap+'"></label></section>'+
  '<section class="card"><h2 style="font-size:1.38rem">Cotizaciones</h2><p class="note" style="margin-top:2px">Estos datos y condiciones salen en el PDF. Cada cotización parte con estas condiciones y puedes cambiarlas en esa cotización.</p>'+
  '<div class="f" style="margin-top:10px"><label>Teléfono o WhatsApp<input type="text" id="ct" value="'+esc(cfg.tel)+'"></label><label>Correo<input type="text" id="cm" value="'+esc(cfg.mail)+'" placeholder="contacto@tupasteleria.cl"></label><label>Validez (días)<input type="number" id="cv" min="1" value="'+cfg.vig+'"></label><label>Abono para reservar (%)<input type="number" id="ca" min="0" max="100" value="'+cfg.abono+'"></label></div>'+
  '<label style="display:flex;flex-direction:column;gap:4px;font-size:.85rem;color:var(--soft);margin-top:12px">Condiciones (una por línea)<textarea id="cc" rows="8">'+esc(cfg.cond)+'</textarea></label></section>'+
  '<section class="card"><h2 style="font-size:1.38rem">Tu cuenta</h2><p class="note" style="margin-top:2px">Sesión iniciada como <b>'+esc(window.USER_EMAIL||"")+'</b>.</p><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><button class="btn ghost sm" data-logout>Cerrar sesión</button>'+(window.IS_ADMIN?'<button class="btn sm" data-admin>Activaciones pendientes</button>':'')+'</div></section>'+
'<section class="card"><h2 style="font-size:1.38rem">Instala Dulcia en tu celular</h2><p class="note" style="margin-top:2px">Así la abres con un toque, como cualquier app, sin buscar el link.</p><p style="margin:10px 0 4px"><b>iPhone (Safari)</b></p><ol class="note" style="margin:0;padding-left:1.2em"><li>Abre Dulcia en <b>Safari</b>.</li><li>Toca el botón <b>Compartir</b> (el cuadrado con la flecha hacia arriba).</li><li>Elige <b>Agregar a pantalla de inicio</b> y toca <b>Agregar</b>.</li></ol><p style="margin:10px 0 4px"><b>Android (Chrome)</b></p><ol class="note" style="margin:0;padding-left:1.2em"><li>Abre Dulcia en <b>Chrome</b>.</li><li>Toca los <b>tres puntos</b> de arriba a la derecha.</li><li>Elige <b>Instalar app</b> o <b>Agregar a la pantalla principal</b>.</li></ol></section>'+
  '<section class="card"><h2 style="font-size:1.38rem">Próximamente</h2><p class="note" style="margin-top:2px">Sincronización automática con Google Calendar (por ahora agregas cada pedido con un botón desde su detalle), conexión con la tienda web de tu pastelería, ayudantes con acceso propio e inventario.</p></section>'+
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
  if(t.dataset.w){wk=addDays(wk,+t.dataset.w);render();return true}
  if(t.hasAttribute("data-copyc")){copiarLista();return true}
  if(t.dataset.delo){var oi=orders.findIndex(function(q){return q.id===+t.dataset.delo});var od=orders.splice(oi,1)[0];$("#dlg").close();
    toast("Pedido de “"+od.cliente+"” eliminado",function(){orders.splice(oi,0,od)});return true}
  if(t.dataset.ladd){var xo=orders.find(function(q){return q.id===+t.dataset.ladd});xo.items=xo.items||[];xo.items.push({rid:recipes[0].id,q:1});openOrder(xo.id);return true}
  if(t.dataset.ldel){var pl=t.dataset.ldel.split(":"),xl=orders.find(function(q){return q.id===+pl[0]});xl.items.splice(+pl[1],1);openOrder(xl.id);return true}
  if(t.dataset.pdel){var pp=t.dataset.pdel.split(":"),xp=orders.find(function(q){return q.id===+pp[0]});xp.fotos.splice(+pp[1],1);openOrder(xp.id);return true}
  if(t.dataset.gdel){var gi=gastos.findIndex(function(g){return g.id===+t.dataset.gdel});var g0=gastos.splice(gi,1)[0];toast("Gasto “"+g0.nombre+"” eliminado",function(){gastos.splice(gi,0,g0)});render();return true}
  if(t.dataset.addrow!==undefined){insertRow(groups()[+t.dataset.addrow]);render();return true}
  if(t.dataset.delrow!==undefined){var ri=+t.dataset.delrow,r0=recipe.splice(ri,1)[0];toast("Ítem “"+r0.n+"” eliminado",function(){recipe.splice(ri,0,r0)});render();return true}
  if(t.hasAttribute("data-addgrp")){openGrp();return true}
  if(t.hasAttribute("data-usehour")){var v=Math.round(hora.sueldo/Math.max(1,hora.horas));var r=recipe.find(function(x){return x.n==="Horas de trabajo"});
    if(r){r.c=v}else{recipe.push({g:"Mano de obra y gastos",n:"Horas de trabajo",q:1,u:"h",c:v})}render();return true}
  return false;
}
function extraChange(t){
  if(t.id==="cl"){readFiles(t.files,function(u){cfg.logo=u;cfg.logoData=u;cfg.logoDirty=true;render()},400);return true}
  if(t.id==="g_k"){$("#g_nk").hidden=t.value!=="__new";return true}
  if(t.id==="n_k"){$("#n_nkw").hidden=t.value!=="__new";return true}
  if(t.dataset&&t.dataset.gbuy!==undefined){gbuy[groups()[+t.dataset.gbuy]]=t.checked;return true}
  if(t.dataset&&t.dataset.lr){var a=t.dataset.lr.split(":");orders.find(function(q){return q.id===+a[0]}).items[+a[1]].rid=+t.value;return true}
  if(t.name==="giva"){gprev();return true}
  return false;
}
function extraInput(t){
  if(t.id==="cn"){cfg.nombre=t.value;Array.prototype.forEach.call(document.querySelectorAll(".bn"),function(b){b.textContent=t.value});return true}
  if(t.id==="cu"){cfg.url=t.value;return true}
  if(t.id==="cp"){cfg.cap=Math.max(0,parseInt(t.value)||0);return true}
  if(t.id==="ct"){cfg.tel=t.value;return true}
  if(t.id==="cm"){cfg.mail=t.value;return true}
  if(t.id==="cv"){cfg.vig=Math.max(1,parseInt(t.value)||7);return true}
  if(t.id==="ca"){cfg.abono=Math.min(100,Math.max(0,parseFloat(t.value)||0));return true}
  if(t.id==="cc"){cfg.cond=t.value;return true}
  if(t.dataset&&t.dataset.cond){var qo=orders.find(function(q){return q.id===+t.dataset.cond});if(qo)qo.cond=t.value;return true}
  if(t.dataset&&t.dataset.vig){var qv=orders.find(function(q){return q.id===+t.dataset.vig});if(qv)qv.vig=Math.max(1,parseInt(t.value)||7);return true}
  if(t.id==="hs"||t.id==="hh"){hora[t.id==="hs"?"sueldo":"horas"]=parseFloat(t.value)||0;rsum();return true}
  if(t.id==="g_m"){gprev();return true}
  if(t.dataset&&t.dataset.lq){var a=t.dataset.lq.split(":");orders.find(function(q){return q.id===+a[0]}).items[+a[1]].q=parseFloat(t.value)||0;return true}
  if(t.dataset&&t.dataset.pm!==undefined){pcats[+t.dataset.pm].m=Math.min(100,Math.max(0,parseFloat(t.value)||0))/100;return true}
  if(t.id==="rn"){rp.nombre=t.value;var b=document.querySelector(".rc.on b");if(b)b.textContent=t.value;return true}
  if(t.id==="rr"){rp.rinde=t.value;var s=document.querySelector(".rc.on span");if(s)s.textContent=t.value;return true}
  return false;
}
function extraSubmit(f){
  if(f.id==="gf"){
    var k=$("#g_k").value; if(k==="__new"){k=$("#g_nkv").value.trim()||"Otros"; if(gcats.indexOf(k)<0)gcats.push(k)}
    var d=pd($("#g_f").value);
    gastos.push({id:gid++,fecha:$("#g_f").value,cat:k,nombre:$("#g_n").value.trim(),monto:+$("#g_m").value||0,iva:gmode()});
    cur={y:d.getFullYear(),m:d.getMonth()}; $("#dlg").close();
  } else if(f.id==="grpf"){
    var gn=$("#grp_n").value.trim(); gbuy[gn]=$("#grp_b").checked;
    recipe.push({g:gn,n:"Nuevo ítem",q:1,u:"un",c:0}); $("#dlg").close();
  } else if(f.id==="catf"){
    var nm=$("#cat_n").value.trim(); if(!nm)return;
    if(catsOpen==="ped"){if(!pcats.some(function(p){return p.n===nm}))pcats.push({n:nm,m:Math.min(100,Math.max(0,parseFloat($("#cat_m").value)||70))/100})}
    else if(gcats.indexOf(nm)<0)gcats.push(nm);
    window._undo=null;openCats(catsOpen);
  } else if(f.id==="newrf"){
    var base=$("#nr_c").value, nr=base?JSON.parse(JSON.stringify(recipes.find(function(q){return q.id===+base}))):{margen:70,precio:0,items:[{g:"Ingredientes",n:"Nuevo ítem",q:1,u:"un",c:0}]};
    nr.id=rid++;nr.nombre=$("#nr_n").value.trim();nr.rinde=$("#nr_r").value.trim()||nr.rinde||"";recipes.push(nr);selR(nr.id);$("#dlg").close();
  }
}

/* ---------- DIALOGOS ---------- */
function recOpts(sel){return recipes.map(function(r){return '<option value="'+r.id+'"'+(r.id===sel?' selected':'')+'>'+esc(r.nombre)+'</option>'}).join("")}
function evTimes(x){var d=x.fecha.replace(/-/g,""),h=(x.hora||"12:00").split(":"),a=+h[0]||0,m=h[1]||"00",z=function(n){return String(n).padStart(2,"0")};
  return {s:d+"T"+z(a)+m+"00",e:d+"T"+z(Math.min(23,a+1))+m+"00"}}
function evTitle(x){return "Pedido: "+x.cliente+" ("+x.cat+")"}
function evDet(x){return (x.desc||"")+"\nTotal: "+$$(x.total)+" · Saldo: "+$$(x.total-x.pagado)}
function gcalUrl(x){var t=evTimes(x);return "https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(evTitle(x))+"&dates="+t.s+"/"+t.e+"&details="+encodeURIComponent(evDet(x))+"&ctz=America/Santiago"}
function icsDownload(x){var t=evTimes(x),esc2=function(v){return String(v).replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\n/g,"\\n")};
  var ics=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Dulcia//ES","BEGIN:VEVENT","UID:pedido-"+x.id+"@dulcia","DTSTAMP:"+new Date().toISOString().replace(/[-:]/g,"").slice(0,15)+"Z","DTSTART;TZID=America/Santiago:"+t.s,"DTEND;TZID=America/Santiago:"+t.e,"SUMMARY:"+esc2(evTitle(x)),"DESCRIPTION:"+esc2(evDet(x)),"END:VEVENT","END:VCALENDAR"].join("\r\n");
  var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([ics],{type:"text/calendar"}));a.download="pedido-"+x.cliente.replace(/[^a-z0-9]+/gi,"-")+".ics";document.body.appendChild(a);a.click();a.remove()}
function openOrder(id){
  var x=orders.find(function(q){return q.id===id}); if(!x)return;
  var d=$("#dlg"), ln=(x.items||[]).map(function(l,i){return '<div class="ln"><select data-lr="'+x.id+':'+i+'" aria-label="Receta">'+recOpts(l.rid)+'</select><input type="number" step="any" min="0" value="'+l.q+'" data-lq="'+x.id+':'+i+'" aria-label="Cantidad"><button class="x" data-ldel="'+x.id+':'+i+'" aria-label="Quitar receta">✕</button></div>'}).join("");
  d.innerHTML='<div class="dlg"><header><div><h2 style="font-size:1.62rem">'+esc(x.cliente)+'</h2><div class="note" style="margin:2px 0 0">'+fechaLarga(x.fecha)+' · '+x.hora+'</div></div><button class="ib" data-close aria-label="Cerrar">✕</button></header>'+
  '<div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn ghost sm" style="text-decoration:none" target="_blank" rel="noopener" href="'+gcalUrl(x)+'">Agregar a Google Calendar</a><button class="btn ghost sm" data-ics="'+x.id+'">Descargar para otro calendario</button></div>'+
  '<dl class="kv"><dt>Categoría</dt><dd>'+esc(x.cat)+'</dd><dt>Canal</dt><dd>'+esc(x.canal)+'</dd><dt>Total</dt><dd>'+$$(x.total)+'</dd><dt>Pagado</dt><dd>'+$$(x.pagado)+' '+chipS(x)+'</dd><dt>Saldo</dt><dd>'+$$(x.total-x.pagado)+'</dd></dl>'+
  (x.cot?'<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-pdf="'+x.id+'">Descargar PDF</button><button class="btn ghost" data-confirm="'+x.id+'">Confirmar pedido</button></div>':(x.total>x.pagado?'<div><button class="btn sm" data-pay="'+x.id+'">Marcar saldo como pagado</button></div>':''))+
  '<label style="font-size:.85rem;color:var(--soft);font-weight:500;display:flex;flex-direction:column;gap:4px">Descripción<textarea id="odesc" rows="4" data-d="'+x.id+'">'+esc(x.desc)+'</textarea></label>'+
  '<div class="qbox"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap"><b>'+(x.num?'Cotización '+qn(x):'Cotización')+'</b>'+(x.cot?'':'<button class="btn ghost sm" data-pdf="'+x.id+'">Descargar cotización PDF</button>')+'</div>'+
  '<label style="font-size:.85rem;color:var(--soft);font-weight:500;display:flex;flex-direction:column;gap:4px;margin-top:8px">Condiciones de esta cotización<textarea rows="6" data-cond="'+x.id+'">'+esc(x.cond!=null?x.cond:cfg.cond)+'</textarea></label>'+
  '<label style="font-size:.85rem;color:var(--soft);font-weight:500;display:flex;flex-direction:row;gap:8px;align-items:center;margin-top:8px">Validez (días)<input type="number" min="1" style="width:80px" data-vig="'+x.id+'" value="'+(x.vig||cfg.vig)+'"></label></div>'+
  '<div><div style="font-size:.85rem;color:var(--soft);font-weight:500;margin-bottom:6px">Recetas del pedido</div>'+(ln||'<div class="note" style="margin:0 0 6px">Sin receta. Asígnala para que Compras sepa qué ingredientes necesitas.</div>')+
  (recipes.length?'<button class="btn ghost sm" data-ladd="'+x.id+'">+ Agregar receta</button>':'<div class="note">Primero crea una receta en la sección Recetas.</div>')+'</div>'+
  '<div><div style="font-size:.85rem;color:var(--soft);font-weight:500;margin-bottom:6px">Fotos</div><div class="photos">'+x.fotos.map(function(f,i){return '<div class="ph"><img src="'+f+'" alt="Foto del pedido"><button class="px" data-pdel="'+x.id+':'+i+'" aria-label="Quitar foto">✕</button></div>'}).join("")+
  '<label class="addp" tabindex="0">+ Agregar fotos<input type="file" accept="image/*" multiple hidden data-addph="'+x.id+'"></label></div></div>'+
  '<div style="border-top:1px solid var(--line);padding-top:12px"><button class="btn ghost sm danger" data-delo="'+x.id+'">Eliminar pedido</button></div></div>';
  if(!d.open)d.showModal();
}
function openNew(){
  var d=$("#dlg");
  d.innerHTML='<form class="dlg" id="nf"><header><h2 style="font-size:1.62rem">Nuevo pedido</h2><button type="button" class="ib" data-close aria-label="Cerrar">✕</button></header>'+
  '<div class="f"><label class="w">Cliente<input type="text" id="n_c" required placeholder="Nombre del cliente"></label>'+
  '<label>Fecha de entrega<input type="date" id="n_f" required value="'+cur.y+'-'+String(cur.m+1).padStart(2,"0")+'-15"></label><label>Hora<input type="time" id="n_h" value="12:00"></label>'+
  '<label>Categoría<select id="n_k">'+pcats.map(function(c){return '<option>'+esc(c.n)+'</option>'}).join("")+'<option value="__new">+ Crear categoría nueva</option></select></label>'+
  '<label>Canal<select id="n_a">'+CANALES.map(function(c){return '<option>'+c+'</option>'}).join("")+'</select></label>'+
  '<div class="w f" id="n_nkw" hidden><label>Nombre de la categoría<input type="text" id="n_nkn" placeholder="Ej.: Postres"></label><label>Margen %<input type="number" id="n_nkm" value="70" min="0" max="100"></label></div>'+
  '<label>Receta (opcional)<select id="n_r"><option value="">Sin receta</option>'+recOpts(-1)+'</select></label><label>Cantidad de la receta<input type="number" id="n_rq" step="any" min="0" value="1"></label>'+
  '<label>Total con IVA<input type="number" id="n_t" min="0" required value="0"></label><label>Anticipo pagado<input type="number" id="n_p" min="0" value="0"></label>'+
  '<label class="w">Descripción<textarea id="n_d" rows="4" placeholder="Sabores, tamaño, decoración, dirección de entrega…"></textarea></label>'+
  '<div class="w"><div style="font-size:.85rem;color:var(--soft);font-weight:500;margin-bottom:6px">Fotos</div><div class="photos" id="n_ph"><label class="addp">+ Agregar fotos<input type="file" accept="image/*" multiple hidden id="n_file"></label></div></div></div>'+
  '<div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn ghost" data-close>Cancelar</button><button type="button" class="btn ghost" data-savecot>Guardar como cotización</button><button class="btn" type="submit">Guardar pedido</button></div></form>';
  d.showModal();
}
function openCats(kind,msg){
  catsOpen=kind; var d=$("#dlg"), isP=kind==="ped";
  var list=isP?pcats:gcats.map(function(n){return {n:n}});
  var rows=list.map(function(c,i){return '<div class="crow"><span style="flex:1;min-width:0;overflow-wrap:anywhere">'+esc(c.n)+'</span>'+(isP?'<label class="mini">Margen <input type="number" min="0" max="100" value="'+Math.round(c.m*100)+'" data-pm="'+i+'" aria-label="Margen">%</label>':'')+'<button class="x" data-delcat="'+i+'" aria-label="Eliminar categoría '+esc(c.n)+'">✕</button></div>'}).join("")||'<div class="note">Aún no tienes categorías.</div>';
  d.innerHTML='<div class="dlg"><header><h2 style="font-size:1.62rem">Categorías de '+(isP?'pedidos':'gastos')+'</h2><button class="ib" data-close aria-label="Cerrar">✕</button></header>'+
   (msg&&window._undo?'<div class="prev">'+esc(msg)+' <button class="btn ghost sm" data-undo>Deshacer</button></div>':'')+rows+
   '<form id="catf" class="crow" style="border:0"><input type="text" id="cat_n" required placeholder="Nueva categoría">'+(isP?'<input type="number" id="cat_m" value="70" min="0" max="100" style="width:84px" aria-label="Margen %">':'')+'<button class="btn sm" type="submit">Agregar</button></form>'+
   '<p class="note" style="margin:0">'+(isP?'El margen es lo que te queda de la venta neta después de los costos. El Panel lo usa para calcular tu ganancia. Si eliminas una categoría, sus pedidos pasan a “Sin categoría”.':'Si eliminas una categoría, sus gastos pasan a “Sin categoría”.')+'</p></div>';
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
function readFiles(files,cb,max){
  max=max||1600;
  Array.prototype.forEach.call(files,function(f){var r=new FileReader();r.onload=function(){
    var im=new Image();im.onload=function(){
      var sc=Math.min(1,max/Math.max(im.naturalWidth,im.naturalHeight)),c=document.createElement("canvas");
      c.width=Math.round(im.naturalWidth*sc);c.height=Math.round(im.naturalHeight*sc);
      var cx=c.getContext("2d");cx.fillStyle="#fff";cx.fillRect(0,0,c.width,c.height);cx.drawImage(im,0,0,c.width,c.height);
      cb(c.toDataURL("image/jpeg",.82))};
    im.onerror=function(){cb(r.result)};im.src=r.result};r.readAsDataURL(f)});
}

/* ---------- RENDER + EVENTOS ---------- */
function render(){
  renderNav();
  var m=$("#main"); m.innerHTML='<div class="mtop"><img src="'+logoSrc()+'" alt=""><b class="bn">'+esc(cfg.nombre)+'</b></div>'+({panel:vPanel,cal:vCal2,ped:vPed,prod:vProd,cost:vCost,com:vCom,gas:vGas,cfg:vCfg})[view]();
  if(view==="cost"&&recipes.length)rsum();
}
document.addEventListener("click",function(e){
  var t=e.target.closest("button,label.addp"); if(!t)return;
  if(extra(t)){}
  else if(t.dataset.v){view=t.dataset.v;render();scrollTo(0,0)}
  else if(t.dataset.m){cur.m+=+t.dataset.m;if(cur.m<0){cur.m=11;cur.y--}if(cur.m>11){cur.m=0;cur.y++}render()}
  else if(t.dataset.o){openOrder(+t.dataset.o)}
  else if(t.hasAttribute("data-new")){openNew()}
  else if(t.hasAttribute("data-close")){$("#dlg").close()}
  else if(t.dataset.pay){var x=orders.find(function(q){return q.id===+t.dataset.pay});x.pagado=x.total;openOrder(x.id);render()}
});
document.addEventListener("change",function(e){
  var t=e.target;
  if(extraChange(t)){}
  else if(t.id==="fcat"){filtro.cat=t.value;render()}
  else if(t.id==="fest"){filtro.est=t.value;render()}
  else if(t.dataset&&t.dataset.l){var x=orders.find(function(q){return q.id===+t.dataset.l});x.listo=t.checked;render()}
  else if(t.dataset&&t.dataset.addph){var x2=orders.find(function(q){return q.id===+t.dataset.addph});
    readFiles(t.files,function(u){x2.fotos.push(u);openOrder(x2.id);render()})}
  else if(t.id==="n_file"){readFiles(t.files,function(u){pend.push(u);
    var im=document.createElement("img");im.src=u;im.alt="Foto nueva";$("#n_ph").insertBefore(im,$("#n_ph").lastElementChild)})}
});
document.addEventListener("input",function(e){
  var t=e.target;
  if(extraInput(t)){}
  else if(t.dataset&&t.dataset.r!==undefined){var r=recipe[+t.dataset.r],k=t.dataset.k;
    r[k]=(k==="n"||k==="u")?t.value:(parseFloat(t.value)||0);if(k==="q"||k==="c"){$("#sub"+t.dataset.r).textContent=$$(r.q*r.c);rsum()}}
  else if(t.id==="mg"){rp.margen=+t.value;var f=t.selectionStart;rsum();$("#mg").focus()}
  else if(t.id==="pa"){rp.precio=parseFloat(t.value)||0;var a=rsum;a();var el=$("#pa");el.focus();try{el.setSelectionRange(el.value.length,el.value.length)}catch(e){}}
  else if(t.dataset&&t.dataset.d){orders.find(function(q){return q.id===+t.dataset.d}).desc=t.value}
});
document.addEventListener("submit",function(e){
  if(e.target.id==="gf"||e.target.id==="grpf"||e.target.id==="catf"||e.target.id==="newrf"){e.preventDefault();extraSubmit(e.target);return}
  if(e.target.id!=="nf")return; e.preventDefault();
  var f=$("#n_f").value, p=pd(f), tot=+$("#n_t").value||0, pg=Math.min(tot,+$("#n_p").value||0), kc=$("#n_k").value;
  if(kc==="__new"){kc=$("#n_nkn").value.trim()||"Sin categoría";if(!pcats.some(function(q){return q.n===kc}))pcats.push({n:kc,m:Math.min(100,Math.max(0,parseFloat($("#n_nkm").value)||70))/100})}
  var rv=$("#n_r").value, its=rv?[{rid:+rv,q:parseFloat($("#n_rq").value)||1}]:[];
  var isq=!!window._cot; window._cot=false;
  if(!isq&&!window._skipW&&dayWarn(f,0,function(){window._skipW=true;$("#nf").requestSubmit()},function(){var fi=$("#n_f");if(fi)fi.focus()}))return;
  window._skipW=false;
  var n={id:nextId++,cot:isq,num:isq?nextQ():0,cond:cfg.cond,vig:cfg.vig,items:its,cliente:$("#n_c").value.trim(),fecha:f,hora:$("#n_h").value||"12:00",cat:kc,canal:$("#n_a").value,desc:$("#n_d").value.trim()||"Sin descripción.",total:tot,pagado:pg,fotos:pend.slice(),listo:false};
  orders.push(n);pend=[];cur={y:p.getFullYear(),m:p.getMonth()};view=isq?"ped":"cal";$("#dlg").close();render();
  if(isq){openOrder(n.id);toast("Cotización "+qn(n)+" guardada")}
});
$("#dlg").addEventListener("close",function(){pend=[];catsOpen=null;render()});

