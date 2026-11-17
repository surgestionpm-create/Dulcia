/* Dulcia · Crear cuenta y pagar en una sola página.
   Lo usan dulcia.cl/empezar (planes normales, con código opcional) y dulcia.cl/black (campaña Black Friday).
   La página define window.REG = { modo: "normal" | "black" } antes de cargar este archivo. */
(function () {
  "use strict";
  var MODO = (window.REG && window.REG.modo) || "normal";
  var NORMAL = { mensual: 5990, semestral: 29990, anual: 54990 };
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var pz = function (n) { return "$ " + Math.round(n).toLocaleString("es-CL"); };
  var ev = function (n, p) { try { window.dulciaEvent && dulciaEvent(n, p || {}); } catch (e) {} };
  var px = function (n, p) { try { window.dulciaPixel && dulciaPixel(n, p || {}); } catch (e) {} };
  var lsGet = function (k) { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } };
  var lsSet = function (k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} };
  try { if (window.DULCIA_LOGO) $("#logo").innerHTML = window.DULCIA_LOGO; } catch (e) {}
  var q = new URLSearchParams(location.search), main = $("#main"), cfg = window.DULCIA_CONFIG || {};
  var hoy = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago" }).format(new Date());

  /* ---------- La oferta de la página ---------- */
  var F, clave, antes = false;
  if (MODO === "black") {
    var FASES = {
      pre: { codigo: "PREBLACKDULCIA", dcto: 30, desde: "2026-11-23", hasta: "2026-11-25", fin: "2026-11-25T23:59:59-03:00", inicio: "2026-11-23T00:00:00-03:00",
        tag: "Pre Black · 23 al 25 nov", h1: 'Nos adelantamos al Black: <em>30%</em> en cualquier plan', dia: "miércoles 25",
        sub: "Antes que todos, conoce Dulcia: costea tus recetas, pon precios que sí dejan ganancia y ordena tus pedidos. Paga hoy con descuento." },
      black: { codigo: "BLACKDULCIA", dcto: 60, desde: "2026-11-26", hasta: "2026-11-29", fin: "2026-11-29T23:59:59-03:00", inicio: "2026-11-26T00:00:00-03:00",
        tag: "Black Friday · 26 al 29 nov", h1: 'Black Friday Dulcia: <em>60%</em> en cualquier plan', dia: "domingo 29",
        sub: "El precio más bajo del año para ordenar tu pastelería: costeo de recetas, precios con ganancia, pedidos y producción en un solo lugar." }
    };
    var fz = q.get("fase");
    clave = fz === "pre" || fz === "black" ? fz : hoy < FASES.black.desde ? "pre" : hoy <= FASES.black.hasta ? "black" : "fin";
    antes = !fz && hoy < FASES.pre.desde;
    if (clave === "fin") {
      main.innerHTML = '<div class="fin"><span class="tag">Black Friday terminó</span><h1>Gracias por acompañarnos</h1><p>La campaña terminó el domingo 29 de noviembre. Igual puedes empezar hoy: paga tu plan o prueba Dulcia 7 días gratis, sin tarjeta.</p><a class="btn" href="/empezar">Ver planes y crear mi cuenta</a></div>';
      ev("view_promo", { fase: "fin" }); return;
    }
    F = FASES[clave];
    if (clave === "black") document.body.classList.add("black");
    lsSet("dulcia_ref", F.codigo);
  } else {
    clave = "normal";
    F = { codigo: "", tag: "7 días gratis · sin tarjeta", h1: 'Empieza a ordenar tu pastelería <em>hoy</em>',
      sub: "Costeo de recetas, precios que sí dejan ganancia, pedidos y producción en un solo lugar. Elige tu plan y paga ahora, o pruébala 7 días gratis." };
  }
  var tm = document.querySelector("meta[name=theme-color]"); if (tm) tm.content = clave === "black" ? "#1C1420" : "#B3224F";

  /* ---------- Código de descuento (página normal): ?ref=CODIGO o se escribe ---------- */
  var promo = null;                     // { codigo, descuento, hasta, planes: { k: { precio, normal, meses } } }
  var codRef = "";                      // código válido para registrar la cuenta (con o sin descuento)
  function precio(k) {
    if (MODO === "black") return Math.round(NORMAL[k] * (100 - F.dcto) / 100);
    return promo && promo.planes[k] ? promo.planes[k].precio : NORMAL[k];
  }
  function codigoPago(k) { return MODO === "black" ? F.codigo : (promo && promo.planes[k] ? promo.codigo : ""); }
  function codigoCuenta() { return MODO === "black" ? F.codigo : codRef; }
  function detalle(k) {
    if (MODO === "black") return { anual: "12 meses. Equivale a " + pz(precio("anual") / 12) + " al mes.", semestral: "6 meses. Equivale a " + pz(precio("semestral") / 6) + " al mes.",
      mensual: F.dcto + "% los primeros 3 meses; después " + pz(NORMAL.mensual) + " al mes. Lo cancelas cuando quieras." }[k];
    var x = promo && promo.planes[k];
    if (k === "mensual") return x ? (+promo.descuento) + "% " + (+x.meses > 0 ? "los primeros " + x.meses + (x.meses == 1 ? " mes" : " meses") + "; después " + pz(NORMAL.mensual) + " al mes." : "mientras sigas suscrita.") + " Lo cancelas cuando quieras." : "Se cobra solo cada mes con Mercado Pago. Lo cancelas cuando quieras.";
    var meses = k === "anual" ? 12 : 6;
    return meses + " meses en un solo pago. Equivale a " + pz(precio(k) / meses) + " al mes." + (x ? " Con " + (+promo.descuento) + "% de descuento." : "");
  }
  var PL = [{ k: "anual", n: "Anual", best: true }, { k: "semestral", n: "Semestral" }, { k: "mensual", n: "Mensual" }];
  var pre = q.get("plan"); if (!NORMAL[pre]) pre = "anual";

  function planHTML(p) {
    var rebajado = precio(p.k) < NORMAL[p.k];
    return '<label class="pl"><input type="radio" name="plan" value="' + p.k + '"' + (p.k === pre ? " checked" : "") + '><span class="n">' + p.n + (p.best ? "<em>Más conveniente</em>" : "") + '</span>' +
      '<span class="p" data-p="' + p.k + '">' + (rebajado ? "<s>" + pz(NORMAL[p.k]) + "</s>" : "") + "<b>" + pz(precio(p.k)) + "</b>" + (p.k === "mensual" ? '<i>/mes</i>' : "") + '</span><span class="d" data-d="' + p.k + '">' + detalle(p.k) + '</span></label>';
  }
  var ben = '<li><span>1</span><div><b>Costeo real</b> de cada receta, con ingredientes, mano de obra y empaque.</div></li>' +
    '<li><span>2</span><div><b>Precios</b> minorista y mayorista que sí dejan ganancia.</div></li>' +
    '<li><span>3</span><div><b>Pedidos, calendario y producción</b> en el celular, con cotizaciones en PDF.</div></li>';
  var gift = MODO === "black"
    ? '<div class="gift"><span aria-hidden="true">🎁</span><div><b>Además, 7 días gratis:</b> tu plan empieza a contar cuando terminan. Código <b>' + F.codigo + '</b> ya aplicado · solo cuentas nuevas.</div></div>'
    : '<div class="gift"><span aria-hidden="true">🎁</span><div><b>Si pagas hoy, no pierdes tus 7 días gratis:</b> el plan empieza a contar cuando terminan.</div></div>';
  var codBox = MODO === "black" ? "" :
    '<details class="cod" id="codbox"><summary>¿Tienes un código de descuento o de invitación?</summary><div class="codr"><input type="text" id="cod" maxlength="30" autocapitalize="characters" spellcheck="false" autocomplete="off" placeholder="Ej.: DULCE10"><button type="button" class="btn ghost sm" id="codb">Aplicar</button></div><div class="codm" id="codm" hidden></div></details>';
  var faq = MODO === "black"
    ? '<details><summary>¿Qué pasa con los 7 días gratis?</summary><p>Los tienes igual. Pagas hoy con el descuento y tu plan empieza a contar cuando terminan tus 7 días de prueba.</p></details>' +
      '<details><summary>¿El plan mensual se queda con descuento?</summary><p>El descuento dura los primeros 3 meses. Después se cobra el precio normal de ' + pz(NORMAL.mensual) + ' al mes, solo con Mercado Pago. Lo cancelas cuando quieras desde la app.</p></details>' +
      '<details><summary>¿Ya tengo cuenta, sirve el código?</summary><p>Sí, si nunca has pagado un plan: <a href="/app/?ref=' + F.codigo + '&amp;pagar=anual">ingresa aquí</a> y el código se aplica solo al elegir tu plan.</p></details>'
    : '<details><summary>¿Puedo probar antes de pagar?</summary><p>Sí. Toca <b>Crear cuenta y probar 7 días gratis</b>: no pides tarjeta y no se cobra nada. Cuando quieras, eliges tu plan desde la app.</p></details>' +
      '<details><summary>Si pago hoy, ¿pierdo la prueba?</summary><p>No. El plan empieza a contar cuando terminan tus 7 días gratis.</p></details>' +
      '<details><summary>¿Cómo cancelo el plan mensual?</summary><p>Desde la app, en Ajustes → Tu plan → Cancelar suscripción. No se cobra más y sigues usando Dulcia hasta la fecha pagada.</p></details>';
  faq += '<details><summary>¿Cómo pago?</summary><p>Con tarjeta o saldo en el sitio seguro de Mercado Pago. Nosotros no vemos tus datos de pago.</p></details>';

  main.innerHTML = '<div class="grid"><div class="ofe">' +
    '<span class="tag">' + F.tag + '</span><h1>' + F.h1 + '</h1><p class="sub">' + F.sub + '</p>' +
    '<div class="cd" id="cd" aria-live="off"' + (MODO === "black" ? "" : " hidden") + '></div>' +
    '<ul class="ben bd">' + ben + '</ul></div><div>' +
    '<div class="pls" role="radiogroup" aria-label="Elige tu plan">' + PL.map(planHTML).join("") + '</div>' + gift +
    '<form id="f" novalidate>' + codBox +
      '<div class="yo" id="yo"></div>' +
      '<div id="nuevos" style="display:grid;gap:12px">' +
        '<label>Tu correo<input type="email" id="em" autocomplete="email" inputmode="email" required placeholder="nombre@correo.cl"></label>' +
        '<label>Crea una clave<input type="password" id="pw" autocomplete="new-password" minlength="8" required placeholder="Mínimo 8 caracteres"></label>' +
      '</div>' +
      '<label id="lnom">Nombre de tu pastelería<input type="text" id="nom" autocomplete="organization" maxlength="80" required placeholder="Ej.: Dulces de Mía"></label>' +
      '<label class="mp" id="mp">Correo de tu Mercado Pago <span class="hint">Solo si es distinto: la suscripción mensual queda a nombre de ese correo.</span><input type="email" id="mpm" autocomplete="off" inputmode="email" placeholder="Igual al de arriba"></label>' +
      '<div class="msg" id="msg" hidden></div>' +
      '<button class="btn" id="go" type="submit">Crear cuenta y pagar</button>' +
      (MODO === "black" ? "" : '<button class="btn ghost" id="free" type="button">Crear cuenta y probar 7 días gratis</button>') +
      '<p class="small">Pago seguro en Mercado Pago. Al crear tu cuenta aceptas los <a href="terminos.html">términos</a> y la <a href="privacidad.html">privacidad</a>.</p>' +
    '</form><ul class="ben bm">' + ben + '</ul></div></div>' +
    '<h2>Preguntas rápidas</h2>' + faq;

  if (antes) { var g = $("#go"); g.textContent = "Disponible desde el lunes 23"; g.disabled = true;
    var m0 = $("#msg"); m0.hidden = false; m0.textContent = "La campaña empieza el lunes 23 de noviembre a las 00:00. Vuelve ese día para pagar con el descuento."; }

  /* ---------- Cuenta regresiva (black) ---------- */
  if (MODO === "black") {
    var finT = Date.parse(F.fin), iniT = Date.parse(F.inicio);
    var tick = function () {
      var ahora = Date.now(), objetivo = ahora < iniT ? iniT : finT, s = Math.max(0, Math.floor((objetivo - ahora) / 1000));
      var d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), mi = Math.floor(s % 3600 / 60), se = s % 60, p2 = function (n) { return (n < 10 ? "0" : "") + n; };
      $("#cd").innerHTML = (ahora < iniT ? "Empieza en" : "Termina en") + " <b>" + (d ? d + "d " : "") + p2(h) + "h " + p2(mi) + "m " + p2(se) + "s</b>" + (ahora < iniT ? "" : " · hasta el " + F.dia + " a las 23:59");
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- Plan elegido ---------- */
  var cuenta = null, sb = null;
  function plan() { return (document.querySelector("input[name=plan]:checked") || {}).value || "anual"; }
  function pintarPrecios() {
    PL.forEach(function (p) {
      var rebajado = precio(p.k) < NORMAL[p.k];
      $('[data-p="' + p.k + '"]').innerHTML = (rebajado ? "<s>" + pz(NORMAL[p.k]) + "</s>" : "") + "<b>" + pz(precio(p.k)) + "</b>" + (p.k === "mensual" ? "<i>/mes</i>" : "");
      $('[data-d="' + p.k + '"]').innerHTML = detalle(p.k);
    });
  }
  function upd() {
    var k = plan();
    if (!antes) $("#go").textContent = (cuenta ? "Pagar " : "Crear cuenta y pagar ") + pz(precio(k)) + (k === "mensual" ? " al mes" : "");
    $("#mp").classList.toggle("on", k === "mensual");
    var cc = codigoCuenta();
    $("#ingresar").href = "/app/?" + (cc ? "ref=" + encodeURIComponent(cc) + "&" : "") + "pagar=" + k;
  }
  document.querySelectorAll("input[name=plan]").forEach(function (r) { r.addEventListener("change", function () { upd(); ev("elige_plan_promo", { plan: plan(), fase: clave }); }); });
  ev("view_promo", { fase: clave }); px("ViewContent", { content_name: MODO === "black" ? "Black Friday " + clave : "Planes", content_category: MODO === "black" ? "promo" : "planes" });
  var empezo = false; $("#f").addEventListener("focusin", function () { if (!empezo) { empezo = true; ev("form_start_promo", { fase: clave }); } });

  /* ---------- Supabase (se carga después de mostrar la página) ---------- */
  function cargarSb() {
    return new Promise(function (ok, no) {
      if (window.supabase) return ok();
      var s = document.createElement("script"); s.src = "supabase.js"; s.onload = ok; s.onerror = function () { no(new Error("Sin conexión. Revisa tu internet e intenta de nuevo.")); }; document.head.appendChild(s);
    }).then(function () {
      if (!sb) sb = window.supabase.createClient(cfg.url, cfg.key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } });
      return sb;
    });
  }

  /* ---------- Código en la página normal ---------- */
  async function aplicarCodigo(cod, silencioso) {
    var m = $("#codm"); cod = String(cod || "").trim().toUpperCase();
    if (!cod) { promo = null; codRef = ""; pintarPrecios(); upd(); if (m) m.hidden = true; return; }
    try {
      await cargarSb();
      var v = await sb.rpc("codigo_valido", { p_codigo: cod });
      if (v.error) throw v.error;
      if (!v.data) { if (!silencioso) { m.hidden = false; m.className = "codm err"; m.textContent = "El código " + cod + " no existe. Revísalo o déjalo en blanco."; } promo = null; codRef = ""; pintarPrecios(); upd(); return; }
      codRef = cod;
      var r = await sb.rpc("promo_publico", { p_codigo: cod }), d = r.data || {};
      if (!r.error && d.planes) {
        promo = d; m.hidden = false; m.className = "codm ok";
        m.innerHTML = "✓ Código <b>" + esc(cod) + "</b>: " + (+d.descuento) + "% de descuento" + (d.hasta ? ", válido hasta el " + String(d.hasta).split("-").reverse().join("-") : "") + ". Solo cuentas nuevas.";
        ev("codigo_aplicado", { codigo: cod });
      } else {
        promo = null;
        if (!silencioso || (d.error && !/no tiene descuento/i.test(d.error))) { m.hidden = false; m.className = "codm" + (/no tiene descuento/i.test(d.error || "") ? " ok" : " err"); m.textContent = /no tiene descuento/i.test(d.error || "") ? "✓ Código " + cod + " registrado." : (d.error || "Ese código no tiene descuento."); }
      }
      $("#cod").value = cod; $("#codbox").open = true;
    } catch (e) { if (!silencioso) { m.hidden = false; m.className = "codm err"; m.textContent = "No pudimos revisar el código. Intenta de nuevo."; } }
    pintarPrecios(); upd();
  }
  if (MODO !== "black") {
    $("#codb").onclick = function () { aplicarCodigo($("#cod").value, false); };
    $("#cod").onkeydown = function (e) { if (e.key === "Enter") { e.preventDefault(); aplicarCodigo($("#cod").value, false); } };
    var refUrl = (q.get("ref") || "").toUpperCase();
    var refLs = lsGet("dulcia_ref").toUpperCase();
    if (/^[A-Z0-9_-]{3,30}$/.test(refUrl)) aplicarCodigo(refUrl, false);
    else if (/^[A-Z0-9_-]{3,30}$/.test(refLs)) aplicarCodigo(refLs, true);
  }

  /* ---------- Si ya tiene sesión en este celular ---------- */
  cargarSb().then(async function () {
    var s = await sb.auth.getSession(); if (!s.data.session) return;
    var r = await sb.rpc("mi_cuenta"); var c = r.data && r.data[0];
    cuenta = { email: s.data.session.user.email, negocio: c || null };
    $("#nuevos").style.display = "none"; $("#em").required = false; $("#pw").required = false;
    if (c) { $("#lnom").style.display = "none"; $("#nom").required = false; var fr = $("#free"); if (fr) { fr.textContent = "Ir a mi cuenta"; fr.dataset.ir = "1"; } }
    var yo = $("#yo"); yo.classList.add("on");
    yo.innerHTML = '<div class="msg">Entraste como <b>' + esc(cuenta.email) + '</b>' + (c ? " (" + esc(c.nombre || "tu pastelería") + ")" : "") + '. <button type="button" class="lnk" id="otra">Usar otra cuenta</button></div>';
    $("#otra").onclick = async function () { await sb.auth.signOut(); location.reload(); };
    upd();
  }).catch(function () {});
  upd();

  /* ---------- Crear la cuenta y pagar ---------- */
  function msg(t, err) { var m = $("#msg"); m.hidden = false; m.className = "msg" + (err ? " err" : ""); m.innerHTML = t; }
  function txtErr(e) {
    var m = String(e && (e.message || e.error_description || e) || "");
    if (/already registered|already been registered|User already/i.test(m)) return "YA";
    if (/Password should|at least/i.test(m)) return "La clave debe tener al menos 8 caracteres.";
    if (/invalid.*email|Unable to validate email/i.test(m)) return "Revisa tu correo: parece que está mal escrito.";
    if (/rate limit|too many/i.test(m)) return "Hubo muchos intentos seguidos. Espera un minuto e intenta de nuevo.";
    if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return "Sin conexión. Revisa tu internet e intenta de nuevo.";
    return m || "Algo salió mal. Intenta de nuevo.";
  }
  function linkApp(k) { var cc = codigoCuenta(); return "/app/?" + (cc ? "ref=" + encodeURIComponent(cc) + "&amp;" : "") + (k ? "pagar=" + k : ""); }
  function yaTiene(k) {
    msg('Ese correo ya tiene cuenta en Dulcia. <a href="' + linkApp(k) + '"><b>Ingresa aquí</b></a>' + (k ? " y se abre el pago" + (codigoPago(k) ? " con el código " + esc(codigoPago(k)) + " ya aplicado" : "") : "") + ".", true);
  }

  async function enviar(gratis) {
    if (antes && !gratis) return;
    var b = gratis ? $("#free") : $("#go"), k = plan(), em = $("#em").value.trim().toLowerCase(), pw = $("#pw").value, nom = $("#nom").value.trim(), mpm = $("#mpm").value.trim();
    $("#msg").hidden = true;
    if (gratis && cuenta && cuenta.negocio) { location.href = "/app/"; return; }
    if (!cuenta) {
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(em)) { msg("Escribe tu correo completo, por ejemplo nombre@gmail.com.", true); $("#em").focus(); return; }
      if (pw.length < 8) { msg("La clave debe tener al menos 8 caracteres.", true); $("#pw").focus(); return; }
    }
    if ((!cuenta || !cuenta.negocio) && nom.length < 2) { msg("Escribe el nombre de tu pastelería.", true); $("#nom").focus(); return; }
    if (!gratis && k === "mensual" && mpm && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(mpm)) { msg("Revisa el correo de Mercado Pago.", true); $("#mpm").focus(); return; }
    var otros = [$("#go"), $("#free")].filter(Boolean); otros.forEach(function (x) { x.disabled = true; });
    var t0 = b.textContent; b.textContent = "Preparando tu cuenta…";
    var listo = function () { otros.forEach(function (x) { x.disabled = false; }); b.textContent = t0; if (antes) $("#go").disabled = true; upd(); };
    try {
      await cargarSb();
      var ses, cc = codigoCuenta();
      if (!cuenta) {
        var s = await sb.auth.signUp({ email: em, password: pw, options: { emailRedirectTo: location.origin + linkApp(gratis ? "" : k).replace(/&amp;/g, "&"), data: cc ? { ref: cc } : {} } });
        if (s.error) { if (txtErr(s.error) === "YA") { yaTiene(gratis ? "" : k); listo(); return; } throw s.error; }
        if (!s.data.session) {
          if (s.data.user && s.data.user.identities && s.data.user.identities.length === 0) { yaTiene(gratis ? "" : k); listo(); return; }
          if (!gratis) lsSet("dulcia_pagar", k);
          msg("Te enviamos un correo a <b>" + esc(em) + "</b> para confirmar tu cuenta. Ábrelo y " + (gratis ? "entras a Dulcia." : "se abre el pago" + (codigoPago(k) ? " con tu descuento ya aplicado." : ".")));
          b.textContent = "Revisa tu correo"; ev("sign_up", { method: "email", fase: clave, confirmar: "si" }); return;
        }
        ses = s.data.session; cuenta = { email: em, negocio: null };
        ev("sign_up", { method: "email", fase: clave }); px("CompleteRegistration", { content_name: "Dulcia " + clave, status: true });
      } else { ses = (await sb.auth.getSession()).data.session; }
      if (!cuenta.negocio) {
        var r = await sb.rpc("crear_negocio", { p_nombre: nom, p_codigo: cc || null });
        if (r.error && !/Ya tienes una cuenta/i.test(r.error.message || "")) throw r.error;
        var c = await sb.rpc("mi_cuenta"); cuenta.negocio = c.data && c.data[0] || {};
      }
      var n = cuenta.negocio || {};
      // Invitación con meses de regalo o cuenta de por vida: no se cobra nada
      if (gratis || n.plan === "regalo" || n.plan === "vitalicio") {
        if (gratis) ev("start_trial", { fase: clave });
        location.href = "/app/"; return;
      }
      b.textContent = "Abriendo Mercado Pago…";
      lsSet("dulcia_px_pend", JSON.stringify({ plan: k, t: Date.now(), neg: n.negocio_id || "", vence: n.vence_en || "", sus: n.suscripcion_estado || "", ref: "" })); lsSet("dulcia_pagar", null);
      ev("begin_checkout", { currency: "CLP", value: precio(k), coupon: codigoPago(k) || undefined, items: [{ item_id: k, item_name: "Dulcia " + k, price: precio(k), quantity: 1 }] });
      px("InitiateCheckout", { value: precio(k), currency: "CLP", content_ids: [k], content_type: "product" });
      var rp = await fetch(cfg.url + "/functions/v1/crear-pago", { method: "POST", headers: { Authorization: "Bearer " + ses.access_token, apikey: cfg.key, "Content-Type": "application/json" },
        body: JSON.stringify({ plan: k, email: k === "mensual" ? (mpm || cuenta.email) : cuenta.email, codigo: codigoPago(k) }) });
      var d = await rp.json().catch(function () { return {}; });
      if (d.activo) { location.href = "/app/"; return; }
      if (!rp.ok || !d.url) {
        msg(esc(d.error || "No pudimos abrir el pago.") + ' Tu cuenta ya está creada: puedes <a href="' + linkApp(k) + '">entrar a Dulcia</a> y pagar desde ahí, o usar tus 7 días gratis.', true);
        listo(); return;
      }
      location.href = d.url;
    } catch (err) {
      var t = txtErr(err); if (t === "YA") yaTiene(gratis ? "" : k); else msg(esc(t), true);
      listo();
    }
  }
  $("#f").addEventListener("submit", function (e) { e.preventDefault(); enviar(false); });
  var fb = $("#free"); if (fb) fb.addEventListener("click", function () { enviar(true); });
})();
