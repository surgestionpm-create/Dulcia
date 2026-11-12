/* Dulcia · Panel de administración. Solo funciona para usuarios de la tabla "admins": cada acción la revisa la base de datos. */
(function () {
  var C = window.DULCIA_CONFIG || {};
  var sb = window.__FAKE_SB__ || supabase.createClient(C.url, C.key);
  var $ = function (s) { return document.querySelector(s); };
  var root = $("#root"), dlg = $("#dlg");
  var S = { cuentas: [], sin: [], inv: [], hist: [], cod: [], com: null, mes: "", tab: "cuentas", q: "", f: "todas", ord: "creado", me: "", invRes: null };
  var PRECIO = { mensual: 5990, semestral: 29990, anual: 54990 };
  var PLN = { prueba: "Prueba", mensual: "Mensual", semestral: "Semestral", anual: "Anual", vitalicio: "De por vida", regalo: "Regalo" };
  var fmN = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 });
  function $$(n) { return "$ " + fmN.format(Math.round(+n || 0)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fd(d, h) { if (!d) return "—"; var x = new Date(d); return x.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" }) + (h ? " " + x.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }) : ""); }
  function hace(d) { if (!d) return "—"; var n = Math.floor((Date.now() - new Date(d)) / 864e5); return n <= 0 ? "hoy" : n === 1 ? "ayer" : "hace " + n + " días"; }
  function iso(d) { var x = new Date(d); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); }
  function errTxt(e) { var m = (e && (e.message || e.error_description)) || String(e || ""); if (/Load failed|Failed to fetch|NetworkError/i.test(m)) return "No pudimos conectarnos. Revisa tu conexión."; return m.replace(/^.*?ERROR:\s*/, ""); }
  var tt;
  function toast(m, bad) { var t = $("#toast"); t.textContent = m; t.hidden = false; t.style.background = bad ? "var(--bad)" : ""; clearTimeout(tt); tt = setTimeout(function () { t.hidden = true; }, 4200); }

  function estado(c) {
    if (c.plan === "vitalicio") return "vitalicio";
    if (!c.activo) return "pausada";
    if (!c.vigente) return "vencida";
    if (c.plan === "prueba") return "prueba";
    if (c.plan === "regalo") return "regalo";
    return "pagando";
  }
  var ESTL = { prueba: "En prueba", pagando: "Pagando", regalo: "Regalo", vitalicio: "De por vida", vencida: "Vencida", pausada: "Pausada" };

  async function rpc(n, a) { var r = await sb.rpc(n, a || {}); if (r.error) throw r.error; return r.data; }

  /* ---------- inicio ---------- */
  async function init() {
    var s = await sb.auth.getSession(), ses = s.data && s.data.session;
    if (!ses) return login();
    S.me = ses.user.email;
    var ok = false; try { ok = await rpc("es_admin"); } catch (e) {}
    if (!ok) {
      root.innerHTML = '<div class="card" id="login"><h1 style="font-size:1.8rem">Sin acceso</h1><p class="note">La cuenta <b>' + esc(S.me) + '</b> no es administradora.</p><div class="row2"><button class="btn ghost" id="out">Cerrar sesión</button><a class="btn" href="/app">Ir a la app</a></div></div>';
      $("#out").onclick = logout; return;
    }
    await load();
  }
  function login(msg) {
    root.innerHTML = '<div class="card" id="login"><h1 style="font-size:1.9rem">Dulcia · Administración</h1><p class="note" style="margin:4px 0 14px">Entra con tu cuenta de administrador.</p>' +
      (msg ? '<div class="errmsg">' + esc(msg) + '</div>' : '') +
      '<form id="lf"><label>Correo<input type="email" id="le" required autocomplete="email"></label><label>Clave<input type="password" id="lp" required autocomplete="current-password"></label><button class="btn" type="submit">Entrar</button></form></div>';
    $("#lf").onsubmit = async function (e) {
      e.preventDefault(); var b = e.target.querySelector("button"); b.disabled = true;
      var r = await sb.auth.signInWithPassword({ email: $("#le").value.trim(), password: $("#lp").value });
      if (r.error) { login("El correo o la clave no son correctos."); return; }
      init();
    };
  }
  async function logout() { await sb.auth.signOut(); login(); }

  async function load() {
    try {
      var R = await Promise.all([rpc("admin_cuentas"), rpc("admin_sin_terminar"), rpc("admin_invitaciones"), rpc("admin_historial"), rpc("admin_codigos").catch(function () { return null; })]);
      S.cuentas = R[0] || []; S.sin = R[1] || []; S.inv = R[2] || []; S.hist = R[3] || []; S.cod = R[4] || []; S.sinCod = R[4] === null;
      render();
      if (!S.revisado && S.sin.some(function (u) { return u.rescate_estado === "enviado"; })) {
        S.revisado = 1;
        avisos("revisar").then(function (d) { if (d.eliminados) { toast(d.eliminados + " registro" + (d.eliminados === 1 ? "" : "s") + " con correo inexistente eliminado" + (d.eliminados === 1 ? "" : "s")); load(); } }).catch(function () {});
      }
    } catch (e) { root.innerHTML = '<div class="card" id="login"><h1 style="font-size:1.6rem">No pudimos cargar el panel</h1><div class="errmsg">' + esc(errTxt(e)) + '</div><p class="note">Si dice que una función no existe, falta ejecutar el SQL del panel en Supabase.</p><button class="btn" id="rt">Reintentar</button></div>'; $("#rt").onclick = load; }
  }

  /* ---------- vista ---------- */
  function kpi(l, v, n) { return '<div class="card kpi"><div class="l">' + l + '</div><div class="v">' + v + '</div><div class="n">' + n + '</div></div>'; }
  function render() {
    var cs = S.cuentas.filter(function (c) { return !c.es_admin; }), cnt = {};
    cs.forEach(function (c) { var e = estado(c); cnt[e] = (cnt[e] || 0) + 1; });
    var tot = cs.reduce(function (a, c) { return a + (+c.total_pagado || 0); }, 0), devs = cs.reduce(function (a, c) { return a + (+c.total_devuelto || 0); }, 0);
    var mrr = cs.reduce(function (a, c) { if (estado(c) !== "pagando" || (+c.total_devuelto > 0 && !(+c.total_pagado > 0))) return a; return a + (c.plan === "mensual" ? PRECIO.mensual : c.plan === "semestral" ? PRECIO.semestral / 6 : c.plan === "anual" ? PRECIO.anual / 12 : 0); }, 0);
    var pronto = cs.filter(function (c) { return c.vigente && c.dias_restantes != null && c.dias_restantes <= 3 && c.plan !== "vitalicio"; }).length;
    var nuevas = cs.filter(function (c) { return Date.now() - new Date(c.creado_en) < 7 * 864e5; }).length;
    var pend = S.inv.filter(function (i) { return !i.usado_en; }).length;
    var h = '<div class="adm"><div class="atop"><div><h1>Administración</h1><div class="who">' + esc(S.me) + '</div></div><div class="acts"><button class="btn ghost sm" data-reload>Actualizar</button><button class="btn ghost sm" data-xls>Descargar Excel</button><a class="btn ghost sm" href="/app">Ir a la app</a><button class="btn ghost sm" data-out>Cerrar sesión</button></div></div>' +
      '<div class="akpis">' +
      kpi("Cuentas", cs.length, nuevas + " nuevas esta semana") +
      kpi("En prueba", cnt.prueba || 0, pronto + " vencen en 3 días o menos") +
      kpi("Pagando", cnt.pagando || 0, "mensual, semestral o anual") +
      kpi("Regalo", cnt.regalo || 0, "colaboraciones vigentes") +
      kpi("Vencidas o pausadas", (cnt.vencida || 0) + (cnt.pausada || 0), (cnt.vitalicio || 0) + " de por vida") +
      kpi("Ingresos totales", $$(tot), devs ? "ya descontados " + $$(devs) + " devueltos" : "pagos aprobados en Mercado Pago") +
      kpi("Ingreso mensual", $$(mrr), "estimado de los planes vigentes") +
      kpi("Sin terminar registro", S.sin.length, "crearon usuario sin pastelería") +
      kpi("Invitaciones", pend, "pendientes de usar") +
      kpi("Conversión", (cs.length ? Math.round(cs.filter(function (c) { return +c.total_pagado > 0; }).length / cs.length * 100) : 0) + "%", "cuentas que pagaron alguna vez") +
      '</div>' +
      '<div class="tabs" role="tablist">' + [["cuentas", "Cuentas", cs.length], ["invitar", "Crear cuenta o regalar", pend], ["sin", "Registros sin terminar", S.sin.length], ["cod", "Códigos", S.cod.length], ["hist", "Historial", S.hist.length]].map(function (t) {
        return '<button role="tab" aria-selected="' + (S.tab === t[0]) + '" data-tab="' + t[0] + '">' + t[1] + '<span class="cnt">' + t[2] + '</span></button>'; }).join("") + '</div>' +
      ({ cuentas: vCuentas, invitar: vInvitar, sin: vSin, cod: vCod, hist: vHist })[S.tab]() + '</div>';
    root.innerHTML = h;
    var q = $("#aq"); if (q && S._focus) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); S._focus = false; }
  }
  function lista() {
    var q = S.q.toLowerCase().trim();
    var l = S.cuentas.filter(function (c) {
      var e = estado(c);
      if (S.f === "pronto") { if (!(c.vigente && c.dias_restantes != null && c.dias_restantes <= 7 && c.plan !== "vitalicio")) return false; }
      else if (S.f !== "todas" && e !== S.f) return false;
      return !q || (c.nombre + " " + c.correo + " " + (c.telefono || "") + " " + (c.nota || "") + " " + (c.codigo || "") + " " + (c.influencer || "")).toLowerCase().indexOf(q) >= 0;
    });
    var o = S.ord;
    l.sort(function (a, b) {
      if (o === "dias") return (a.dias_restantes == null ? 1e9 : a.dias_restantes) - (b.dias_restantes == null ? 1e9 : b.dias_restantes);
      if (o === "pagado") return (+b.total_pagado || 0) - (+a.total_pagado || 0);
      if (o === "uso") return (b.pedidos + b.recetas) - (a.pedidos + a.recetas);
      if (o === "nombre") return String(a.nombre).localeCompare(b.nombre, "es");
      return new Date(b.creado_en) - new Date(a.creado_en);
    });
    return l;
  }
  function vCuentas() {
    var l = lista(), fs = [["todas", "Todas"], ["prueba", "En prueba"], ["pagando", "Pagando"], ["regalo", "Regalo"], ["vitalicio", "De por vida"], ["vencida", "Vencidas"], ["pausada", "Pausadas"], ["pronto", "Vencen en 7 días"]];
    var rows = l.map(function (c) {
      var e = estado(c), d = c.dias_restantes, dc = d == null ? "" : d < 0 ? "bad" : d <= 3 ? "warn" : "";
      return '<tr class="row" data-open="' + c.negocio_id + '"><td class="c-nm nm"><b>' + esc(c.nombre) + (c.es_admin ? ' <span class="st vitalicio">admin</span>' : '') + '</b><span>' + esc(c.correo || "sin correo") + (c.codigo ? ' · <span class="st regalo" title="' + esc(c.influencer || "") + '">' + esc(c.codigo) + '</span>' : '') + '</span></td>' +
        '<td class="c-plan">' + esc(PLN[c.plan] || c.plan || "—") + (c.suscripcion_estado === "authorized" ? ' · auto' : '') + '</td>' +
        '<td class="c-st"><span class="st ' + e + '">' + ESTL[e] + '</span></td>' +
        '<td class="c-dias r"><span class="dias ' + dc + '">' + (d == null ? "∞" : d < 0 ? "venció hace " + (-d) + (d === -1 ? " día" : " días") : d) + '</span></td>' +
        '<td class="c-vence">' + fd(c.vence_en) + '</td>' +
        '<td class="c-pag r">' + $$(c.total_pagado) + '</td>' +
        '<td class="c-uso r">' + c.pedidos + ' ped · ' + c.recetas + ' rec</td>' +
        '<td class="c-act">' + hace(c.ultima_actividad) + '</td>' +
        '<td class="c-cre">' + fd(c.creado_en) + '</td>' +
        '<td class="c-go r"><button class="btn sm" data-open="' + c.negocio_id + '">Gestionar</button></td></tr>';
    }).join("");
    return '<section class="card"><div class="abar"><input type="search" id="aq" placeholder="Buscar por pastelería, correo, teléfono o nota" value="' + esc(S.q) + '">' +
      '<select id="ao" aria-label="Ordenar"><option value="creado"' + (S.ord === "creado" ? " selected" : "") + '>Más nuevas primero</option><option value="dias"' + (S.ord === "dias" ? " selected" : "") + '>Menos días restantes</option><option value="pagado"' + (S.ord === "pagado" ? " selected" : "") + '>Más pagado</option><option value="uso"' + (S.ord === "uso" ? " selected" : "") + '>Más uso</option><option value="nombre"' + (S.ord === "nombre" ? " selected" : "") + '>Nombre</option></select></div>' +
      '<div class="fchips">' + fs.map(function (f) { return '<button class="' + (S.f === f[0] ? "on" : "") + '" data-f="' + f[0] + '">' + f[1] + '</button>'; }).join("") + '</div>' +
      '<div class="scroll"><table class="acc"><thead><tr><th>Pastelería</th><th>Plan</th><th>Estado</th><th class="r">Días</th><th>Vence</th><th class="r">Pagado</th><th class="r">Uso</th><th>Última actividad</th><th>Creada</th><th></th></tr></thead><tbody>' +
      (rows || '<tr><td colspan="10" class="empty">No hay cuentas con este filtro.</td></tr>') + '</tbody></table></div>' +
      '<p class="note">' + l.length + ' cuenta' + (l.length === 1 ? '' : 's') + ' en la lista. Toca una para gestionarla.</p></section>';
  }
  function vInvitar() {
    var r = S.invRes;
    var pend = S.inv.filter(function (i) { return !i.usado_en; }), us = S.inv.filter(function (i) { return i.usado_en; });
    return '<div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:start" id="invg">' +
      '<section class="card"><h2 style="font-size:1.5rem">Crear cuenta con meses de regalo</h2><p class="note" style="margin:4px 0 14px">Para colaboraciones. Si el correo ya tiene cuenta, los meses se suman al tiro. Si no, quedan guardados y se aplican solos cuando esa persona cree su cuenta con ese correo: no ve la prueba de 7 días.</p>' +
      '<form id="invf" class="f"><label class="w">Correo de la pastelería<input type="email" id="ie" required placeholder="pasteleria@gmail.com"></label>' +
      '<label>Nombre de la pastelería<input type="text" id="in" placeholder="Opcional"></label><label>Meses de regalo<select id="im"><option value="1">1 mes</option><option value="3" selected>3 meses</option><option value="6">6 meses</option><option value="12">12 meses</option></select></label>' +
      '<label class="w">Nota interna<input type="text" id="io" placeholder="Ej: colaboración en Instagram, noviembre"></label>' +
      '<div class="w"><button class="btn" type="submit">Crear invitación</button></div></form>' +
      (r ? '<div class="blk" style="margin-top:14px">' + (r.err ? '<div class="errmsg">' + esc(r.err) + '</div>' : '<div class="okmsg">' + esc(r.msg) + '</div>' +
        '<p class="note">Mensaje para enviarle:</p><div class="copybox" id="invtxt">' + esc(r.texto) + '</div><div class="row2" style="margin-top:8px"><button class="btn sm" data-copy="invtxt">Copiar mensaje</button><a class="btn ghost sm" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(r.texto) + '">Enviar por WhatsApp</a><a class="btn ghost sm" href="mailto:' + esc(r.email) + '?subject=' + encodeURIComponent("Tu acceso a Dulcia") + '&body=' + encodeURIComponent(r.texto) + '">Enviar por correo</a></div>') + '</div>' : '') +
      '</section>' +
      '<section class="card"><h2 style="font-size:1.5rem">Invitaciones</h2>' +
      (pend.length ? '<h3 style="font-size:1.05rem;margin:10px 0 4px">Pendientes</h3><table class="pg"><tbody>' + pend.map(function (i) { return '<tr><td><b>' + esc(i.email) + '</b><div class="note" style="margin:0">' + esc(i.nombre || "") + (i.nota ? ' · ' + esc(i.nota) : '') + '</div></td><td class="r">' + i.meses + ' meses</td><td class="r">' + fd(i.creado_en) + '</td><td class="r"><button class="x" data-invdel="' + i.id + '" aria-label="Borrar invitación">✕</button></td></tr>'; }).join("") + '</tbody></table>' : '<p class="note">No hay invitaciones pendientes.</p>') +
      (us.length ? '<h3 style="font-size:1.05rem;margin:16px 0 4px">Usadas</h3><table class="pg"><tbody>' + us.slice(0, 50).map(function (i) { return '<tr><td>' + esc(i.email) + '</td><td class="r">' + i.meses + ' meses</td><td class="r">' + fd(i.usado_en) + '</td></tr>'; }).join("") + '</tbody></table>' : '') +
      '</section></div>';
  }
  function vSin() {
    return '<section class="card"><p class="note" style="margin:0 0 10px">Personas que crearon usuario pero no confirmaron su correo o no escribieron el nombre de su pastelería. Con <b>“Enviar correo”</b> Dulcia le manda un correo con un botón que activa su cuenta y la deja dentro de la app. Si el correo no existe, el registro se elimina solo.</p>' +
      (S.sin.length ? '<div class="scroll"><table class="pg"><thead><tr><th>Correo</th><th>Registro</th><th>Correo confirmado</th><th>Correo de Dulcia</th><th></th></tr></thead><tbody>' + S.sin.map(function (u) {
        return '<tr><td><b>' + esc(u.correo) + '</b></td><td>' + fd(u.creado_en, 1) + ' · ' + hace(u.creado_en) + '</td><td>' + (u.correo_confirmado ? '<span class="st pagando">Sí</span>' : '<span class="st vencida">No</span>') + '</td>' +
          '<td>' + (u.rescate_en ? '<span class="st ' + (u.rescate_estado === "enviado" ? "prueba" : "pagando") + '">' + ({ enviado: "Enviado", entregado: "Entregado", abierto: "Lo abrió" }[u.rescate_estado] || "Enviado") + '</span> <span class="note" style="margin:0">' + hace(u.rescate_en) + (u.rescate_veces > 1 ? ' · ' + u.rescate_veces + ' veces' : '') + '</span>' : '<span class="note" style="margin:0">No enviado</span>') + '</td>' +
          '<td class="r"><button class="btn sm" data-resc="' + u.user_id + '">' + (u.rescate_en ? "Reenviar" : "Enviar correo") + '</button> <button class="btn ghost sm danger" data-udel="' + u.user_id + '" data-mail="' + esc(u.correo) + '">Eliminar</button></td></tr>'; }).join("") + '</tbody></table></div>' : '<p class="empty">No hay registros sin terminar.</p>') + '</section>';
  }
  function mesTxt(m) { var p = String(m || "").split("-"); return p.length === 2 ? ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"][+p[1] - 1] + " " + p[0] : ""; }
  function mesAct() { if (!S.mes) { var d = new Date(); S.mes = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"); } return S.mes; }
  function comResumen() {
    var g = {}; (S.com || []).forEach(function (r) { var k = r.codigo, x = g[k] = g[k] || { codigo: k, influencer: r.influencer, comision: +r.comision, clientes: {}, pagos: 0, devol: 0, neto: 0, monto: 0 };
      x.clientes[r.correo || r.pasteleria] = 1; if (r.movimiento === "Pago") x.pagos += +r.monto; else x.devol += -r.monto; x.neto += +r.monto; x.monto += +r.monto_comision; });
    return Object.keys(g).sort().map(function (k) { var x = g[k]; x.n = Object.keys(x.clientes).length; return x; });
  }
  function vCod() {
    if (S.sinCod) return '<section class="card"><p class="errmsg">Falta ejecutar en Supabase el SQL de los códigos (codigos.sql).</p></section>';
    var link = function (k) { return "https://www.dulcia.cl/?ref=" + k; };
    var form = '<section class="card" style="margin-bottom:14px"><h2 style="font-size:1.4rem">Nuevo código</h2><p class="note" style="margin:4px 0 10px">La persona lo escribe al crear su cuenta, o entra con el link del código y se completa solo. El código no da beneficios: los meses gratis se regalan desde cada cuenta.</p>' +
      '<form id="codf" class="row2"><input type="text" id="cc" required maxlength="30" placeholder="Código (ej.: UFATRUFA)" style="text-transform:uppercase"><input type="text" id="ci" required maxlength="80" placeholder="Nombre del influencer"><input id="cp" type="number" min="0" max="100" step="0.5" value="20" style="max-width:110px" title="% de comisión"><span class="note" style="margin:0">% de cada pago</span><input type="text" id="ct" maxlength="120" placeholder="Contacto (opcional)"><button class="btn sm" type="submit">Crear código</button></form></section>';
    var tabla = '<section class="card" style="margin-bottom:14px"><h2 style="font-size:1.4rem;margin-bottom:8px">Códigos</h2>' + (S.cod.length ? '<div class="scroll"><table class="pg"><thead><tr><th>Código</th><th>Influencer</th><th class="r">Comisión</th><th class="r">Clientes</th><th class="r">Pagando hoy</th><th class="r">Total pagado</th><th>Link para compartir</th><th></th></tr></thead><tbody>' +
      S.cod.map(function (k) { return '<tr><td><b>' + esc(k.codigo) + '</b>' + (k.activo ? '' : ' <span class="st pausada">inactivo</span>') + '</td><td>' + esc(k.influencer) + (k.contacto ? '<div class="note" style="margin:0">' + esc(k.contacto) + '</div>' : '') + '</td><td class="r">' + (+k.comision) + '%</td><td class="r">' + k.clientes + '</td><td class="r">' + k.pagando + '</td><td class="r">' + $$(k.pagado_total) + '</td>' +
        '<td><button class="btn ghost sm" data-clink="' + esc(link(k.codigo)) + '">Copiar link</button></td><td class="r"><button class="btn ghost sm" data-cedit="' + esc(k.codigo) + '">Editar</button></td></tr>'; }).join("") + '</tbody></table></div>' : '<p class="empty">Todavía no hay códigos.</p>') + '</section>';
    var res = S.com ? comResumen() : [], tot = res.reduce(function (a, x) { return a + x.monto; }, 0);
    var com = '<section class="card"><h2 style="font-size:1.4rem">Comisiones del mes</h2><p class="note" style="margin:4px 0 10px">Suma los pagos del mes de los clientes de cada código (los planes semestral y anual cuentan completos el mes en que se pagan) y resta las devoluciones hechas ese mes.</p>' +
      '<div class="row2" style="margin-bottom:12px"><input type="month" id="cmes" value="' + mesAct() + '" style="max-width:200px"><button class="btn ghost sm" data-cver>Ver mes</button><button class="btn sm" data-cxls>Descargar Excel del mes</button></div>' +
      (!S.com ? '<p class="note">Cargando…</p>' : res.length ? '<div class="scroll"><table class="pg"><thead><tr><th>Código</th><th>Influencer</th><th class="r">Clientes que pagaron</th><th class="r">Pagos</th><th class="r">Devoluciones</th><th class="r">Neto</th><th class="r">%</th><th class="r">A pagar</th></tr></thead><tbody>' +
        res.map(function (x) { return '<tr><td><b>' + esc(x.codigo) + '</b></td><td>' + esc(x.influencer) + '</td><td class="r">' + x.n + '</td><td class="r">' + $$(x.pagos) + '</td><td class="r">' + (x.devol ? "−" + $$(x.devol) : "—") + '</td><td class="r">' + $$(x.neto) + '</td><td class="r">' + x.comision + '%</td><td class="r"><b>' + $$(x.monto) + '</b></td></tr>'; }).join("") +
        '<tr><td colspan="7"><b>Total a pagar en ' + mesTxt(S.mes) + '</b></td><td class="r"><b>' + $$(tot) + '</b></td></tr></tbody></table></div>' : '<p class="empty">Sin pagos de clientes con código en ' + mesTxt(S.mes) + '.</p>') + '</section>';
    if (!S.com && !S.comCargando) cargarCom();
    return form + tabla + com;
  }
  async function cargarCom() {
    S.comCargando = 1;
    try { S.com = await rpc("admin_comisiones", { p_mes: mesAct() + "-01" }) || []; } catch (e) { S.com = []; toast(errTxt(e), true); }
    S.comCargando = 0; if (S.tab === "cod") render();
  }
  function editCod(k) {
    var c = S.cod.find(function (x) { return x.codigo === k; }); if (!c) return;
    dlg.innerHTML = '<div class="dlg"><header><div><h2 style="font-size:1.6rem">Código ' + esc(c.codigo) + '</h2><div class="note" style="margin:2px 0 0">' + c.clientes + ' cliente' + (c.clientes === 1 ? '' : 's') + ' · creado el ' + fd(c.creado_en) + '</div></div><button class="ib" data-close aria-label="Cerrar">✕</button></header>' +
      '<form id="cedf" style="display:flex;flex-direction:column;gap:10px"><label>Influencer<input type="text" id="ei" required maxlength="80" value="' + esc(c.influencer) + '"></label><label>% de comisión de cada pago<input id="ep" type="number" min="0" max="100" step="0.5" value="' + (+c.comision) + '"></label>' +
      '<label>Contacto<input type="text" id="et" maxlength="120" value="' + esc(c.contacto || "") + '"></label><label>Nota<textarea id="en" rows="2">' + esc(c.nota || "") + '</textarea></label>' +
      '<label class="row2" style="gap:8px"><input type="checkbox" id="ea"' + (c.activo ? ' checked' : '') + ' style="width:auto;flex:0"> Código activo (si lo desactivas, nadie nuevo puede usarlo; sus clientes actuales siguen sumando comisión)</label>' +
      '<p class="note" style="margin:0">Cambiar el % afecta el cálculo de todos los meses, también los anteriores.</p><div class="row2"><button class="btn sm" type="submit">Guardar</button></div></form></div>';
    dlg.dataset.id = ""; dlg.dataset.cod = k; if (!dlg.open) dlg.showModal();
  }
  function excelCom() {
    xlsxLib().then(function (X) {
      var res = comResumen(), wb = X.utils.book_new();
      var r1 = [["Comisiones de " + mesTxt(S.mes)], [], ["Código", "Influencer", "Contacto", "Clientes que pagaron", "Pagos", "Devoluciones", "Neto", "% comisión", "Monto a pagar"]].concat(res.map(function (x) { var k = S.cod.find(function (c) { return c.codigo === x.codigo; }) || {}; return [x.codigo, x.influencer, k.contacto || "", x.n, Math.round(x.pagos), -Math.round(x.devol), Math.round(x.neto), x.comision / 100, Math.round(x.monto)]; }));
      r1.push(["Total", "", "", "", "", "", "", "", res.reduce(function (a, x) { return a + Math.round(x.monto); }, 0)]);
      var w1 = X.utils.aoa_to_sheet(r1); w1["!cols"] = [14, 22, 22, 12, 12, 12, 12, 10, 14].map(function (w) { return { wch: w }; });
      for (var i = 3; i < r1.length - 1; i++) { var cel = w1[X.utils.encode_cell({ r: i, c: 7 })]; if (cel) cel.z = "0%"; }
      X.utils.book_append_sheet(wb, w1, "Resumen");
      var r2 = [["Código", "Influencer", "Pastelería", "Correo", "Fecha", "Movimiento", "N° pago", "Monto", "% comisión", "Comisión"]].concat((S.com || []).map(function (r) { return [r.codigo, r.influencer, r.pasteleria, r.correo || "", fd(r.fecha), r.movimiento, r.pago_id, Math.round(+r.monto), +r.comision / 100, Math.round(+r.monto_comision)]; }));
      var w2 = X.utils.aoa_to_sheet(r2); w2["!cols"] = [14, 20, 24, 28, 12, 12, 16, 12, 10, 12].map(function (w) { return { wch: w }; });
      for (var j = 1; j < r2.length; j++) { var c2 = w2[X.utils.encode_cell({ r: j, c: 8 })]; if (c2) c2.z = "0%"; }
      X.utils.book_append_sheet(wb, w2, "Detalle de pagos");
      var cl = S.cuentas.filter(function (c) { return c.codigo; });
      var r3 = [["Código", "Influencer", "Pastelería", "Correo", "Teléfono", "Plan", "Estado", "Total pagado", "Creada"]].concat(cl.map(function (c) { return [c.codigo, c.influencer || "", c.nombre, c.correo || "", c.telefono || "", PLN[c.plan] || c.plan || "", ESTL[estado(c)], Math.round(+c.total_pagado || 0), fd(c.creado_en)]; }));
      var w3 = X.utils.aoa_to_sheet(r3); w3["!cols"] = [14, 20, 24, 28, 14, 12, 12, 12, 12].map(function (w) { return { wch: w }; });
      X.utils.book_append_sheet(wb, w3, "Clientes con código");
      X.writeFile(wb, "Dulcia_comisiones_" + S.mes + ".xlsx"); toast("Excel de " + mesTxt(S.mes) + " descargado");
    }).catch(function (e) { toast(errTxt(e), true); });
  }
  function vHist() {
    return '<section class="card" style="margin-bottom:14px"><h2 style="font-size:1.4rem">Correos automáticos</h2><p class="note" style="margin:4px 0 10px">Todos los días a las 10:00 Dulcia envía solo: “quedan 2 días de prueba”, “tu prueba termina hoy”, “tu prueba terminó”, “tu plan vence en 7 días” y “tu plan venció”. Cada correo llega una sola vez por cuenta y queda anotado aquí abajo.</p>' +
      '<div class="row2"><button class="btn sm" data-avprueba>Enviarme los 5 correos de ejemplo</button><button class="btn ghost sm" data-avahora>Enviar los avisos pendientes ahora</button></div></section>' +
      '<section class="card">' + (S.hist.length ? '<div class="scroll"><table class="pg"><thead><tr><th>Fecha</th><th>Acción</th><th>Pastelería</th><th>Correo</th><th>Detalle</th><th>Por</th></tr></thead><tbody>' + S.hist.map(function (h) {
      return '<tr><td>' + fd(h.creado_en, 1) + '</td><td><b>' + esc(h.accion) + '</b></td><td>' + esc(h.pasteleria || "") + '</td><td>' + esc(h.correo || "") + '</td><td>' + esc(h.detalle || "") + '</td><td class="note" style="margin:0">' + esc(h.admin || "") + '</td></tr>'; }).join("") + '</tbody></table></div>' : '<p class="empty">Todavía no hay acciones registradas.</p>') + '</section>';
  }

  /* ---------- gestionar una cuenta ---------- */
  async function abrir(id) {
    var c = S.cuentas.find(function (x) { return x.negocio_id === id; }); if (!c) return;
    var e = estado(c), sub = c.suscripcion_estado === "authorized" || c.suscripcion_estado === "pending";
    var wa = String(c.telefono || "").replace(/\D/g, "");
    dlg.innerHTML = '<div class="dlg"><header><div><h2 style="font-size:1.7rem">' + esc(c.nombre) + '</h2><div class="note" style="margin:2px 0 0">' + esc(c.correo || "") + (c.correo_confirmado ? '' : ' · correo sin confirmar') + '</div></div><button class="ib" data-close aria-label="Cerrar">✕</button></header>' +
      '<div class="row2">' + (c.correo ? '<a class="btn ghost sm" href="mailto:' + esc(c.correo) + '">Escribir correo</a>' : '') + (wa ? '<a class="btn ghost sm" target="_blank" rel="noopener" href="https://wa.me/' + wa + '">WhatsApp</a>' : '') + '</div>' +
      '<dl class="det"><div><dt>Estado</dt><dd><span class="st ' + e + '">' + ESTL[e] + '</span></dd></div><div><dt>Plan</dt><dd>' + esc(PLN[c.plan] || c.plan || "—") + '</dd></div><div><dt>Vence</dt><dd>' + fd(c.vence_en, 1) + '</dd></div>' +
      '<div><dt>Días restantes</dt><dd>' + (c.dias_restantes == null ? "Sin vencimiento" : c.dias_restantes) + '</dd></div><div><dt>Suscripción mensual</dt><dd>' + esc({ authorized: "Activa", pending: "Pendiente", cancelled: "Cancelada", paused: "Pausada" }[c.suscripcion_estado] || "No tiene") + '</dd></div><div><dt>Total pagado</dt><dd>' + $$(c.total_pagado) + ' <span class="note">(' + c.pagos + ' pago' + (c.pagos === 1 ? '' : 's') + ')</span></dd></div>' +
      '<div><dt>Pedidos</dt><dd>' + c.pedidos + '</dd></div><div><dt>Recetas</dt><dd>' + c.recetas + '</dd></div><div><dt>Creada</dt><dd>' + fd(c.creado_en) + ' · ' + hace(c.creado_en) + '</dd></div></dl>' +
      '<div class="blk"><h3>Regalar meses</h3><p class="note" style="margin:0 0 8px">Se suman desde el vencimiento actual (o desde hoy si ya venció). El plan queda como “Regalo”.</p><input type="text" id="gnota" placeholder="Nota: ej. colaboración con @pasteleria" style="margin-bottom:8px"><div class="months">' + [1, 3, 6, 12].map(function (m) { return '<button class="btn sm" data-gift="' + m + '">+ ' + m + (m === 1 ? ' mes' : ' meses') + '</button>'; }).join("") + '</div></div>' +
      '<div class="blk"><h3>Cambiar plan o fecha</h3><div class="row2"><select id="gplan"><option value="mensual">Mensual (+1 mes)</option><option value="semestral">Semestral (+6 meses)</option><option value="anual">Anual (+12 meses)</option><option value="prueba">Prueba (7 días desde hoy)</option><option value="vitalicio">De por vida</option></select><button class="btn ghost sm" data-plan>Aplicar plan</button></div>' +
      '<div class="row2" style="margin-top:8px"><input type="date" id="gfecha" value="' + (c.vence_en ? iso(c.vence_en) : "") + '"><button class="btn ghost sm" data-fecha>Fijar vencimiento</button></div><p class="note" style="margin:6px 0 0">Útil para corregir una fecha: la cuenta queda activa hasta las 23:59 de ese día.</p></div>' +
      '<div class="blk"><h3>Estado de la cuenta</h3><div class="row2"><button class="btn ghost sm" data-pausa="' + (c.activo ? 1 : 0) + '">' + (c.activo ? 'Pausar cuenta' : 'Reactivar cuenta') + '</button>' +
      (sub ? '<button class="btn ghost sm danger" data-subx>Cancelar suscripción mensual</button>' : '') + '</div><p class="note" style="margin:6px 0 0">Pausar bloquea el acceso sin borrar nada. Reactivar no cambia la fecha de vencimiento.</p></div>' +
      (S.sinCod ? '' : '<div class="blk"><h3>Código de invitación</h3><p class="note" style="margin:0 0 8px">De qué influencer viene esta cuenta. Sus pagos generan comisión para ese código.</p><div class="row2"><select id="gcod"><option value="">Sin código</option>' + S.cod.map(function (k) { return '<option value="' + esc(k.codigo) + '"' + (k.codigo === c.codigo ? ' selected' : '') + '>' + esc(k.codigo + " · " + k.influencer) + (k.activo ? '' : ' (inactivo)') + '</option>'; }).join("") + '</select><button class="btn ghost sm" data-gcod>Guardar código</button></div></div>') +
      '<div class="blk"><h3>Nota interna</h3><textarea id="gn" rows="3" placeholder="Solo la ves tú">' + esc(c.nota || "") + '</textarea><div style="margin-top:8px"><button class="btn ghost sm" data-nota>Guardar nota</button></div></div>' +
      '<div class="blk"><h3>Pagos</h3><div id="gpagos" class="note">Cargando…</div></div>' +
      '<div class="blk"><h3>Correos de aviso enviados</h3><div id="gavisos" class="note">Cargando…</div></div>' +
      (c.es_admin ? '' : '<div class="blk"><h3 class="danger">Eliminar cuenta</h3><p class="note" style="margin:0 0 8px">Borra la pastelería, sus recetas, pedidos, gastos, clientes y su usuario. <b>No se puede deshacer.</b>' + (sub ? ' Antes se cancela su suscripción mensual en Mercado Pago.' : '') + ' Para confirmar, escribe el correo <b>' + esc(c.correo || c.nombre) + '</b>.</p><div class="row2"><input type="text" id="gdel" autocomplete="off" placeholder="' + esc(c.correo || c.nombre) + '"><button class="btn bad sm" data-del disabled>Eliminar para siempre</button></div></div>') +
      '</div>';
    dlg.dataset.id = id; if (!dlg.open) dlg.showModal();
    try {
      var ps = await rpc("admin_pagos", { p_negocio: id }), g = $("#gpagos"); if (!g || dlg.dataset.id !== id) return;
      S.pagos = ps || [];
      g.innerHTML = ps && ps.length ? '<table class="pg"><tbody>' + ps.map(function (p) {
        var dev = +p.devuelto || 0, resto = (+p.monto || 0) - dev, ok = p.estado === "approved" || p.estado === "refunded" || p.estado === "charged_back";
        var est = p.estado === "charged_back" ? '<span class="st vencida">Contracargo</span>' : dev >= +p.monto ? '<span class="st vencida">Devuelto</span>' : dev > 0 ? '<span class="st prueba">Devuelto en parte</span>' : p.estado === "approved" ? '<span class="st pagando">Aprobado</span>' : esc(p.estado);
        return '<tr><td>' + fd(p.creado_en, 1) + '</td><td>' + est + '</td><td class="r">' + $$(p.monto) + (dev ? '<div class="note" style="margin:0">−' + $$(dev) + ' devuelto</div>' : '') + '</td><td class="note" style="margin:0">N° ' + esc(p.id) + '</td>' +
          '<td class="r">' + (ok && p.estado === "approved" && resto > 0 ? '<button class="btn ghost sm danger" data-devform="' + esc(p.id) + '">Devolver</button>' : '') + '</td></tr>' +
          '<tr class="devrow" data-devrow="' + esc(p.id) + '" hidden><td colspan="5"></td></tr>'; }).join("") + '</tbody></table>' : 'Sin pagos registrados.';
    } catch (e) { var g2 = $("#gpagos"); if (g2) g2.textContent = errTxt(e); }
    try {
      var av = await rpc("admin_avisos", { p_negocio: id }), ga = $("#gavisos"); if (!ga || dlg.dataset.id !== id) return;
      var AVL = { prueba_2d: "Quedan 2 días de prueba", prueba_hoy: "La prueba termina hoy", prueba_fin: "La prueba terminó", plan_7d: "El plan vence en 7 días", plan_fin: "El plan venció" };
      ga.innerHTML = av && av.length ? '<table class="pg"><tbody>' + av.map(function (a) { return '<tr><td>' + fd(a.enviado_en, 1) + '</td><td>' + esc(AVL[a.tipo] || a.tipo) + '</td><td class="note" style="margin:0">' + esc(a.correo || "") + '</td></tr>'; }).join("") + '</tbody></table>' : 'Todavía no se le ha enviado ningún aviso.';
    } catch (e) { var g3 = $("#gavisos"); if (g3) g3.textContent = "Falta ejecutar el SQL de los avisos."; }
  }
  async function avisos(accion, extra) {
    var s = await sb.auth.getSession(), tk = s.data.session.access_token;
    var r = await fetch(C.url + "/functions/v1/avisos", { method: "POST", headers: { Authorization: "Bearer " + tk, apikey: C.key, "Content-Type": "application/json" }, body: JSON.stringify(Object.assign({ accion: accion || "" }, extra || {})) });
    var d = await r.json().catch(function () { return {}; }); if (!r.ok || !d.ok) throw new Error(d.error || "No se pudo enviar");
    return d;
  }
  async function accion(b, fn) {
    var id = dlg.dataset.id; b.disabled = true;
    try { var m = await fn(id); toast(m || "Listo"); await load(); if (dlg.open && S.cuentas.some(function (c) { return c.negocio_id === id; })) abrir(id); else if (dlg.open) dlg.close(); }
    catch (e) { toast(errTxt(e), true); b.disabled = false; }
  }
  function devForm(id) {
    var p = (S.pagos || []).find(function (x) { return String(x.id) === String(id); }); if (!p) return;
    var resto = (+p.monto || 0) - (+p.devuelto || 0), primera = !(+p.devuelto), m = p.meses || 1;
    document.querySelectorAll("[data-devrow]").forEach(function (r) { r.hidden = true; r.firstChild.innerHTML = ""; });
    var row = document.querySelector('[data-devrow="' + id + '"]'); row.hidden = false;
    row.firstChild.innerHTML = '<div class="copybox" style="white-space:normal"><b>Devolver el pago N° ' + esc(id) + '</b>' +
      '<p class="note" style="margin:4px 0 10px">El dinero sale de tu cuenta de Mercado Pago y vuelve al medio de pago de la clienta. <b>No se puede deshacer.</b></p>' +
      '<div class="devopt"><label><input type="radio" name="devt" value="todo" checked> Todo (' + $$(resto) + ')</label><label><input type="radio" name="devt" value="parte"> Una parte:</label><input type="number" id="devm" min="1" max="' + resto + '" step="1" placeholder="Monto" disabled></div>' +
      (primera ? '<div class="devopt" id="devql"><label><input type="checkbox" id="devq" checked> Quitar también ' + (m === 1 ? 'el mes' : 'los ' + m + ' meses') + ' que dio este pago</label></div>' : '') +
      '<div class="row2"><button class="btn bad sm" data-devok="' + esc(id) + '">Devolver ' + $$(resto) + '</button><button class="btn ghost sm" data-devno>Cancelar</button></div></div>';
  }
  function devSync() {
    var parte = (document.querySelector('input[name=devt]:checked') || {}).value === "parte", mi = $("#devm"), ok = document.querySelector("[data-devok]"); if (!ok) return;
    var p = (S.pagos || []).find(function (x) { return String(x.id) === ok.getAttribute("data-devok"); }), resto = (+p.monto || 0) - (+p.devuelto || 0);
    mi.disabled = !parte; var q = $("#devql"); if (q) q.hidden = parte;
    var v = parte ? Math.round(+mi.value || 0) : resto;
    ok.textContent = "Devolver " + $$(v); ok.disabled = !(v > 0 && v <= resto);
  }
  async function devolver(b) {
    var id = b.getAttribute("data-devok"), parte = (document.querySelector('input[name=devt]:checked') || {}).value === "parte";
    var monto = parte ? Math.round(+$("#devm").value || 0) : null, q = $("#devq");
    b.disabled = true; b.textContent = "Devolviendo…";
    try {
      var s = await sb.auth.getSession(), tk = s.data.session.access_token;
      var r = await fetch(C.url + "/functions/v1/crear-pago", { method: "POST", headers: { Authorization: "Bearer " + tk, apikey: C.key, "Content-Type": "application/json" }, body: JSON.stringify({ accion: "admin_devolver", pago: id, monto: monto, quitar_meses: !parte && !!(q && q.checked) }) });
      var d = await r.json().catch(function () { return {}; }); if (!r.ok || !d.ok) throw new Error(d.error || "Mercado Pago no pudo hacer la devolución");
      toast(d.detalle || "Devolución hecha"); var nid = dlg.dataset.id; await load(); if (S.cuentas.some(function (c) { return c.negocio_id === nid; })) abrir(nid);
    } catch (e) { toast(errTxt(e), true); devSync(); }
  }
  async function cancelarSub(id) {
    var s = await sb.auth.getSession(), tk = s.data.session.access_token;
    var r = await fetch(C.url + "/functions/v1/crear-pago", { method: "POST", headers: { Authorization: "Bearer " + tk, apikey: C.key, "Content-Type": "application/json" }, body: JSON.stringify({ accion: "admin_cancelar", negocio: id }) });
    var d = await r.json().catch(function () { return {}; }); if (!r.ok || !d.ok) throw new Error(d.error || "Mercado Pago no pudo cancelar");
    return "Suscripción mensual cancelada";
  }

  /* ---------- Excel ---------- */
  function xlsxLib() { return window.XLSX ? Promise.resolve(window.XLSX) : new Promise(function (ok, no) { var s = document.createElement("script"); s.src = "xlsx.mini.min.js"; s.onload = function () { ok(window.XLSX); }; s.onerror = function () { no(new Error("No se pudo cargar Excel")); }; document.head.appendChild(s); }); }
  function excel() {
    xlsxLib().then(function (X) {
      var H = ["Pastelería", "Correo", "Teléfono", "Código", "Influencer", "Plan", "Estado", "Días restantes", "Vence", "Suscripción mensual", "Total pagado", "Pagos", "Último pago", "Pedidos", "Recetas", "Última actividad", "Creada", "Nota"];
      var rows = lista().map(function (c) { return [c.nombre, c.correo, c.telefono || "", c.codigo || "", c.influencer || "", PLN[c.plan] || c.plan || "", ESTL[estado(c)], c.dias_restantes == null ? "" : c.dias_restantes, c.vence_en ? fd(c.vence_en) : "", c.suscripcion_estado || "", Math.round(+c.total_pagado || 0), c.pagos, c.ultimo_pago ? fd(c.ultimo_pago) : "", c.pedidos, c.recetas, c.ultima_actividad ? fd(c.ultima_actividad) : "", fd(c.creado_en), c.nota || ""]; });
      var ws = X.utils.aoa_to_sheet([H].concat(rows)); ws["!cols"] = [26, 28, 14, 14, 18, 12, 12, 10, 12, 14, 12, 8, 12, 9, 9, 14, 12, 40].map(function (w) { return { wch: w }; });
      var wb = X.utils.book_new(); X.utils.book_append_sheet(wb, ws, "Cuentas"); X.writeFile(wb, "Dulcia_cuentas_" + iso(new Date()) + ".xlsx");
      toast(rows.length + " cuentas descargadas");
    }).catch(function (e) { toast(errTxt(e), true); });
  }

  /* ---------- eventos ---------- */
  document.addEventListener("click", async function (e) {
    var t = e.target.closest("button,tr[data-open]"); if (!t) return;
    if (t.hasAttribute("data-close")) { dlg.close(); return; }
    if (t.dataset.tab) { S.tab = t.dataset.tab; render(); return; }
    if (t.dataset.f) { S.f = t.dataset.f; render(); return; }
    if (t.hasAttribute("data-reload")) { t.disabled = true; await load(); toast("Datos actualizados"); return; }
    if (t.hasAttribute("data-out")) { logout(); return; }
    if (t.hasAttribute("data-xls")) { excel(); return; }
    if (t.dataset.clink) { try { await navigator.clipboard.writeText(t.dataset.clink); toast("Link copiado: " + t.dataset.clink); } catch (er) { toast("Copia este link: " + t.dataset.clink); } return; }
    if (t.dataset.cedit) { editCod(t.dataset.cedit); return; }
    if (t.hasAttribute("data-cver")) { S.mes = $("#cmes").value || mesAct(); S.com = null; render(); return; }
    if (t.hasAttribute("data-cxls")) { var nm = $("#cmes").value || mesAct(); if (nm !== S.mes || !S.com) { S.mes = nm; S.com = null; render(); await cargarCom(); } excelCom(); return; }
    if (t.hasAttribute("data-gcod")) { var gc = $("#gcod").value; return accion(t, function (id) { return rpc("admin_asignar_codigo", { p_negocio: id, p_codigo: gc || null }).then(function () { S.com = null; return gc ? "Código " + gc + " asignado" : "Código quitado"; }); }); }
    if (t.hasAttribute("data-devform")) { devForm(t.getAttribute("data-devform")); return; }
    if (t.hasAttribute("data-devno")) { document.querySelectorAll("[data-devrow]").forEach(function (r) { r.hidden = true; r.firstChild.innerHTML = ""; }); return; }
    if (t.hasAttribute("data-devok")) { devolver(t); return; }
    if (t.hasAttribute("data-resc")) {
      t.disabled = true; t.textContent = "Enviando…";
      try { var d0 = await avisos("rescatar", { user_id: t.getAttribute("data-resc") }); toast(d0.eliminado ? "Correo inexistente (" + d0.motivo + "): registro eliminado" : "Correo enviado a " + d0.correo); await load(); }
      catch (er) { toast(errTxt(er), true); t.disabled = false; t.textContent = "Enviar correo"; }
      return;
    }
    if (t.hasAttribute("data-avprueba")) { t.disabled = true; try { var d1 = await avisos("probar"); toast("Listo: revisa " + d1.a + " (5 correos)"); } catch (er) { toast(errTxt(er), true); } t.disabled = false; return; }
    if (t.hasAttribute("data-avahora")) { t.disabled = true; try { var d2 = await avisos(""); toast(d2.enviados ? d2.enviados + " aviso" + (d2.enviados === 1 ? "" : "s") + " enviado" + (d2.enviados === 1 ? "" : "s") : "No había avisos pendientes"); await load(); } catch (er) { toast(errTxt(er), true); t.disabled = false; } return; }
    if (t.dataset.open) { abrir(t.dataset.open); return; }
    if (t.dataset.copy) { var el = document.getElementById(t.dataset.copy); try { await navigator.clipboard.writeText(el.textContent); toast("Mensaje copiado"); } catch (er) { toast("No se pudo copiar: selecciónalo y cópialo a mano", true); } return; }
    if (t.dataset.invdel) { t.disabled = true; try { toast(await rpc("admin_invitacion_borrar", { p_id: +t.dataset.invdel })); await load(); } catch (er) { toast(errTxt(er), true); t.disabled = false; } return; }
    if (t.dataset.udel) {
      if (!t.dataset.sure) { t.dataset.sure = 1; t.textContent = "Toca de nuevo para eliminar"; return; }
      t.disabled = true; try { toast(await rpc("admin_eliminar_usuario", { p_user: t.dataset.udel })); await load(); } catch (er) { toast(errTxt(er), true); t.disabled = false; } return;
    }
    if (t.dataset.gift) { var nota = $("#gnota").value.trim(); return accion(t, function (id) { return rpc("admin_regalar", { p_negocio: id, p_meses: +t.dataset.gift, p_nota: nota || null }); }); }
    if (t.hasAttribute("data-plan")) { var pl = $("#gplan").value; return accion(t, function (id) { return rpc("admin_plan", { p_negocio: id, p_plan: pl }); }); }
    if (t.hasAttribute("data-fecha")) { var f = $("#gfecha").value; if (!f) { toast("Elige una fecha", true); return; } return accion(t, function (id) { return rpc("admin_vence", { p_negocio: id, p_fecha: f }); }); }
    if (t.dataset.pausa !== undefined) { var pa = t.dataset.pausa === "1"; return accion(t, function (id) { return rpc("admin_pausar", { p_negocio: id, p_pausar: pa }); }); }
    if (t.hasAttribute("data-nota")) { var n = $("#gn").value; return accion(t, function (id) { return rpc("admin_nota", { p_negocio: id, p_nota: n }); }); }
    if (t.hasAttribute("data-subx")) { if (!t.dataset.sure) { t.dataset.sure = 1; t.textContent = "Toca de nuevo para cancelar"; return; } return accion(t, cancelarSub); }
    if (t.hasAttribute("data-del")) {
      return accion(t, async function (id) {
        var c = S.cuentas.find(function (x) { return x.negocio_id === id; });
        if (c && (c.suscripcion_estado === "authorized" || c.suscripcion_estado === "pending")) { try { await cancelarSub(id); } catch (er) { throw new Error("No se eliminó: primero hay que cancelar su suscripción y Mercado Pago respondió: " + errTxt(er)); } }
        return rpc("admin_eliminar", { p_negocio: id });
      });
    }
  });
  document.addEventListener("input", function (e) {
    var t = e.target;
    if (t.id === "aq") { S.q = t.value; S._focus = true; render(); }
    else if (t.id === "gdel") { var c = S.cuentas.find(function (x) { return x.negocio_id === dlg.dataset.id; }), b = dlg.querySelector("[data-del]"); if (c && b) b.disabled = t.value.trim().toLowerCase() !== String(c.correo || c.nombre).toLowerCase(); }
  });
  document.addEventListener("change", function (e) { if (e.target.name === "devt") devSync(); });
  document.addEventListener("input", function (e) { if (e.target.id === "devm") devSync(); });
  document.addEventListener("change", function (e) { if (e.target.id === "ao") { S.ord = e.target.value; render(); } });
  document.addEventListener("submit", async function (e) {
    if (e.target.id === "codf" || e.target.id === "cedf") {
      e.preventDefault(); var nuevo = e.target.id === "codf", b = e.target.querySelector("button[type=submit]"); b.disabled = true;
      var k = nuevo ? $("#cc").value.trim().toUpperCase() : dlg.dataset.cod, o = S.cod.find(function (x) { return x.codigo === k; }) || {};
      try {
        await rpc("admin_codigo_guardar", nuevo ? { p_codigo: k, p_influencer: $("#ci").value, p_comision: +$("#cp").value, p_activo: true, p_contacto: $("#ct").value.trim() || null, p_nota: null, p_nuevo: true }
          : { p_codigo: k, p_influencer: $("#ei").value, p_comision: +$("#ep").value, p_activo: $("#ea").checked, p_contacto: $("#et").value.trim() || null, p_nota: $("#en").value.trim() || null, p_nuevo: false });
        if (!nuevo) dlg.close(); S.com = null; await load(); toast(nuevo ? "Código " + k + " creado" : "Código " + k + " guardado");
      } catch (er) { toast(errTxt(er), true); b.disabled = false; }
      return;
    }
    if (e.target.id !== "invf") return; e.preventDefault();
    var b = e.target.querySelector("button[type=submit]"); b.disabled = true;
    var em = $("#ie").value.trim().toLowerCase(), m = +$("#im").value, nom = $("#in").value.trim(), nota = $("#io").value.trim();
    try {
      var msg = await rpc("admin_invitar", { p_email: em, p_meses: m, p_nombre: nom || null, p_nota: nota || null });
      var txt = "¡Hola" + (nom ? " " + nom : "") + "! 🍒 Te regalamos " + m + (m === 1 ? " mes" : " meses") + " de Dulcia, la app para ordenar tu pastelería: costeo de recetas, pedidos con anticipo, calendario y cuánto ganas cada mes.\n\n" +
        "Para activarlo, crea tu cuenta con este mismo correo (" + em + ") en:\nhttps://www.dulcia.cl/app/?crear=1\n\nLos meses de regalo se activan solos al crear la cuenta. Cualquier duda, nos escribes.";
      S.invRes = { msg: msg, texto: txt, email: em }; await load();
    } catch (er) { S.invRes = { err: errTxt(er) }; render(); }
  });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  init();
})();
