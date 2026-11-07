/* Dulcia · Panel de administración. Solo funciona para usuarios de la tabla "admins": cada acción la revisa la base de datos. */
(function () {
  var C = window.DULCIA_CONFIG || {};
  var sb = window.__FAKE_SB__ || supabase.createClient(C.url, C.key);
  var $ = function (s) { return document.querySelector(s); };
  var root = $("#root"), dlg = $("#dlg");
  var S = { cuentas: [], sin: [], inv: [], hist: [], tab: "cuentas", q: "", f: "todas", ord: "creado", me: "", invRes: null };
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
      var R = await Promise.all([rpc("admin_cuentas"), rpc("admin_sin_terminar"), rpc("admin_invitaciones"), rpc("admin_historial")]);
      S.cuentas = R[0] || []; S.sin = R[1] || []; S.inv = R[2] || []; S.hist = R[3] || [];
      render();
    } catch (e) { root.innerHTML = '<div class="card" id="login"><h1 style="font-size:1.6rem">No pudimos cargar el panel</h1><div class="errmsg">' + esc(errTxt(e)) + '</div><p class="note">Si dice que una función no existe, falta ejecutar el SQL del panel en Supabase.</p><button class="btn" id="rt">Reintentar</button></div>'; $("#rt").onclick = load; }
  }

  /* ---------- vista ---------- */
  function kpi(l, v, n) { return '<div class="card kpi"><div class="l">' + l + '</div><div class="v">' + v + '</div><div class="n">' + n + '</div></div>'; }
  function render() {
    var cs = S.cuentas.filter(function (c) { return !c.es_admin; }), cnt = {};
    cs.forEach(function (c) { var e = estado(c); cnt[e] = (cnt[e] || 0) + 1; });
    var tot = cs.reduce(function (a, c) { return a + (+c.total_pagado || 0); }, 0);
    var mrr = cs.reduce(function (a, c) { if (estado(c) !== "pagando") return a; return a + (c.plan === "mensual" ? PRECIO.mensual : c.plan === "semestral" ? PRECIO.semestral / 6 : c.plan === "anual" ? PRECIO.anual / 12 : 0); }, 0);
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
      kpi("Ingresos totales", $$(tot), "pagos aprobados en Mercado Pago") +
      kpi("Ingreso mensual", $$(mrr), "estimado de los planes vigentes") +
      kpi("Sin terminar registro", S.sin.length, "crearon usuario sin pastelería") +
      kpi("Invitaciones", pend, "pendientes de usar") +
      kpi("Conversión", (cs.length ? Math.round(cs.filter(function (c) { return +c.total_pagado > 0; }).length / cs.length * 100) : 0) + "%", "cuentas que pagaron alguna vez") +
      '</div>' +
      '<div class="tabs" role="tablist">' + [["cuentas", "Cuentas", cs.length], ["invitar", "Crear cuenta o regalar", pend], ["sin", "Registros sin terminar", S.sin.length], ["hist", "Historial", S.hist.length]].map(function (t) {
        return '<button role="tab" aria-selected="' + (S.tab === t[0]) + '" data-tab="' + t[0] + '">' + t[1] + '<span class="cnt">' + t[2] + '</span></button>'; }).join("") + '</div>' +
      ({ cuentas: vCuentas, invitar: vInvitar, sin: vSin, hist: vHist })[S.tab]() + '</div>';
    root.innerHTML = h;
    var q = $("#aq"); if (q && S._focus) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); S._focus = false; }
  }
  function lista() {
    var q = S.q.toLowerCase().trim();
    var l = S.cuentas.filter(function (c) {
      var e = estado(c);
      if (S.f === "pronto") { if (!(c.vigente && c.dias_restantes != null && c.dias_restantes <= 7 && c.plan !== "vitalicio")) return false; }
      else if (S.f !== "todas" && e !== S.f) return false;
      return !q || (c.nombre + " " + c.correo + " " + (c.telefono || "") + " " + (c.nota || "")).toLowerCase().indexOf(q) >= 0;
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
      return '<tr class="row" data-open="' + c.negocio_id + '"><td class="c-nm nm"><b>' + esc(c.nombre) + (c.es_admin ? ' <span class="st vitalicio">admin</span>' : '') + '</b><span>' + esc(c.correo || "sin correo") + '</span></td>' +
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
    return '<section class="card"><p class="note" style="margin:0 0 10px">Personas que crearon usuario pero no confirmaron su correo o no escribieron el nombre de su pastelería. Puedes escribirles para ayudarlas o eliminarlas.</p>' +
      (S.sin.length ? '<div class="scroll"><table class="pg"><thead><tr><th>Correo</th><th>Registro</th><th>Correo confirmado</th><th></th></tr></thead><tbody>' + S.sin.map(function (u) {
        return '<tr><td><b>' + esc(u.correo) + '</b></td><td>' + fd(u.creado_en, 1) + ' · ' + hace(u.creado_en) + '</td><td>' + (u.correo_confirmado ? '<span class="st pagando">Sí</span>' : '<span class="st vencida">No</span>') + '</td>' +
          '<td class="r"><a class="btn ghost sm" href="mailto:' + esc(u.correo) + '?subject=' + encodeURIComponent("¿Te ayudamos a empezar con Dulcia?") + '">Escribir</a> <button class="btn ghost sm danger" data-udel="' + u.user_id + '" data-mail="' + esc(u.correo) + '">Eliminar</button></td></tr>'; }).join("") + '</tbody></table></div>' : '<p class="empty">No hay registros sin terminar.</p>') + '</section>';
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
      '<div class="blk"><h3>Nota interna</h3><textarea id="gn" rows="3" placeholder="Solo la ves tú">' + esc(c.nota || "") + '</textarea><div style="margin-top:8px"><button class="btn ghost sm" data-nota>Guardar nota</button></div></div>' +
      '<div class="blk"><h3>Pagos</h3><div id="gpagos" class="note">Cargando…</div></div>' +
      '<div class="blk"><h3>Correos de aviso enviados</h3><div id="gavisos" class="note">Cargando…</div></div>' +
      (c.es_admin ? '' : '<div class="blk"><h3 class="danger">Eliminar cuenta</h3><p class="note" style="margin:0 0 8px">Borra la pastelería, sus recetas, pedidos, gastos, clientes y su usuario. <b>No se puede deshacer.</b>' + (sub ? ' Antes se cancela su suscripción mensual en Mercado Pago.' : '') + ' Para confirmar, escribe el correo <b>' + esc(c.correo || c.nombre) + '</b>.</p><div class="row2"><input type="text" id="gdel" autocomplete="off" placeholder="' + esc(c.correo || c.nombre) + '"><button class="btn bad sm" data-del disabled>Eliminar para siempre</button></div></div>') +
      '</div>';
    dlg.dataset.id = id; if (!dlg.open) dlg.showModal();
    try {
      var ps = await rpc("admin_pagos", { p_negocio: id }), g = $("#gpagos"); if (!g || dlg.dataset.id !== id) return;
      g.innerHTML = ps && ps.length ? '<table class="pg"><tbody>' + ps.map(function (p) { return '<tr><td>' + fd(p.creado_en, 1) + '</td><td>' + esc(p.estado === "approved" ? "Aprobado" : p.estado) + '</td><td class="r">' + $$(p.monto) + '</td><td class="note" style="margin:0">N° ' + esc(p.id) + '</td></tr>'; }).join("") + '</tbody></table>' : 'Sin pagos registrados.';
    } catch (e) { var g2 = $("#gpagos"); if (g2) g2.textContent = errTxt(e); }
    try {
      var av = await rpc("admin_avisos", { p_negocio: id }), ga = $("#gavisos"); if (!ga || dlg.dataset.id !== id) return;
      var AVL = { prueba_2d: "Quedan 2 días de prueba", prueba_hoy: "La prueba termina hoy", prueba_fin: "La prueba terminó", plan_7d: "El plan vence en 7 días", plan_fin: "El plan venció" };
      ga.innerHTML = av && av.length ? '<table class="pg"><tbody>' + av.map(function (a) { return '<tr><td>' + fd(a.enviado_en, 1) + '</td><td>' + esc(AVL[a.tipo] || a.tipo) + '</td><td class="note" style="margin:0">' + esc(a.correo || "") + '</td></tr>'; }).join("") + '</tbody></table>' : 'Todavía no se le ha enviado ningún aviso.';
    } catch (e) { var g3 = $("#gavisos"); if (g3) g3.textContent = "Falta ejecutar el SQL de los avisos."; }
  }
  async function avisos(accion) {
    var s = await sb.auth.getSession(), tk = s.data.session.access_token;
    var r = await fetch(C.url + "/functions/v1/avisos", { method: "POST", headers: { Authorization: "Bearer " + tk, apikey: C.key, "Content-Type": "application/json" }, body: JSON.stringify({ accion: accion || "" }) });
    var d = await r.json().catch(function () { return {}; }); if (!r.ok || !d.ok) throw new Error(d.error || "No se pudo enviar");
    return d;
  }
  async function accion(b, fn) {
    var id = dlg.dataset.id; b.disabled = true;
    try { var m = await fn(id); toast(m || "Listo"); await load(); if (dlg.open && S.cuentas.some(function (c) { return c.negocio_id === id; })) abrir(id); else if (dlg.open) dlg.close(); }
    catch (e) { toast(errTxt(e), true); b.disabled = false; }
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
      var H = ["Pastelería", "Correo", "Teléfono", "Plan", "Estado", "Días restantes", "Vence", "Suscripción mensual", "Total pagado", "Pagos", "Último pago", "Pedidos", "Recetas", "Última actividad", "Creada", "Nota"];
      var rows = lista().map(function (c) { return [c.nombre, c.correo, c.telefono || "", PLN[c.plan] || c.plan || "", ESTL[estado(c)], c.dias_restantes == null ? "" : c.dias_restantes, c.vence_en ? fd(c.vence_en) : "", c.suscripcion_estado || "", Math.round(+c.total_pagado || 0), c.pagos, c.ultimo_pago ? fd(c.ultimo_pago) : "", c.pedidos, c.recetas, c.ultima_actividad ? fd(c.ultima_actividad) : "", fd(c.creado_en), c.nota || ""]; });
      var ws = X.utils.aoa_to_sheet([H].concat(rows)); ws["!cols"] = [26, 28, 14, 12, 12, 10, 12, 14, 12, 8, 12, 9, 9, 14, 12, 40].map(function (w) { return { wch: w }; });
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
  document.addEventListener("change", function (e) { if (e.target.id === "ao") { S.ord = e.target.value; render(); } });
  document.addEventListener("submit", async function (e) {
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
