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
  // Links de campaña del Black Friday (correo con ?ref=BLACKDULCIA o PREBLACKDULCIA): van a la página del Black, donde el descuento ya va aplicado
  if (MODO === "normal" && /^(PRE)?BLACKDULCIA$/i.test(q.get("ref") || "")) {
    var plB = q.get("plan"); location.replace("/black" + (/^(mensual|semestral|anual)$/.test(plB || "") ? "?plan=" + plB : "")); return;
  }
  var hoy = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago" }).format(new Date());

  /* ---------- La oferta de la página ---------- */
  var F, clave, antes = false;
  if (MODO === "black") {
    var FASES = {
      pre: { codigo: "PREBLACKDULCIA", dcto: 30, desde: "2026-11-23", hasta: "2026-11-25", fin: "2026-11-25T23:59:59-03:00", inicio: "2026-11-23T00:00:00-03:00",
        tag: "Pre Black · 23 al 25 nov", h1: 'Pre Black: <em>30%</em> en la app que ordena tu pastelería', dia: "miércoles 25",
        sub: "Costea tus recetas, pon precios con ganancia, organiza tus pedidos y controla tu inventario. Todo en un solo lugar.",
        l3: "Pruébala gratis 7 días y, si te gusta, paga con 30% hasta el miércoles 25." },
      black: { codigo: "BLACKDULCIA", dcto: 60, desde: "2026-11-26", hasta: "2026-11-29", fin: "2026-11-29T23:59:59-03:00", inicio: "2026-11-26T00:00:00-03:00",
        tag: "Black Friday · 26 al 29 nov", h1: '<em>60% off</em> en la app que ordena tu pastelería', dia: "domingo 29",
        sub: "Costea tus recetas, pon precios con ganancia, organiza tus pedidos y controla tu inventario. Todo en un solo lugar.",
        l3: "Pruébala gratis 7 días, sin tarjeta, y si te gusta paga con 60% hasta el domingo 29." }
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
  } else {
    clave = "normal";
    F = { codigo: "", tag: "7 días gratis · sin tarjeta", h1: 'La app que <em>ordena tu pastelería</em>',
      sub: "Costea tus recetas, pon precios con ganancia, organiza tus pedidos y controla tu inventario. Todo en un solo lugar.",
      l3: "Elige tu plan y paga hoy, o pruébala gratis 7 días, sin tarjeta." };
  }
  var tm = document.querySelector("meta[name=theme-color]"); if (tm) tm.content = clave === "black" ? "#1C1420" : "#B3224F";

  /* ---------- Código de descuento (página normal): ?ref=CODIGO o se escribe ---------- */
  var promo = null;                     // { codigo, descuento, hasta, planes: { k: { precio, normal, meses } } }
  var codRef = "";                      // código escrito por la persona (con o sin descuento)
  var codInv = "";                      // invitación de influencer que llegó por link (sin descuento): se registra sin mostrarse
  function precio(k) {
    if (MODO === "black") return Math.round(NORMAL[k] * (100 - F.dcto) / 100);
    return promo && promo.planes[k] ? promo.planes[k].precio : NORMAL[k];
  }
  function codigoPago(k) { return MODO === "black" ? F.codigo : (promo && promo.planes[k] ? promo.codigo : ""); }
  function codigoCuenta() { return MODO === "black" ? F.codigo : (codRef || codInv); }
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
  var ben = '<li><span>1</span><div><b>Costeo y precios:</b> el costo real de cada receta y su precio con ganancia, minorista y mayorista.</div></li>' +
    '<li><span>2</span><div><b>Pedidos y calendario:</b> fechas, abonos, saldos y cotizaciones en PDF.</div></li>' +
    '<li><span>3</span><div><b>Inventario y compras:</b> stock de ingredientes y productos, y qué comprar según tus pedidos.</div></li>' +
    '<li><span>4</span><div><b>Producción y ganancias:</b> qué hornear cada día, tus gastos y cuánto te queda.</div></li>';
  var gift = MODO === "black"
    ? '<div class="gift"><span aria-hidden="true">🎁</span><div><b>Pruébala gratis 7 días, sin tarjeta.</b> Si te gusta, pagas con el ' + F.dcto + '% hasta el ' + F.dia + ' desde la app (código <b>' + F.codigo + '</b> ya guardado). Y si pagas hoy, tus 7 días igual se suman.</div></div>'
    : '<div class="gift"><span aria-hidden="true">🎁</span><div><b>Si pagas hoy, no pierdes tus 7 días gratis:</b> el plan empieza a contar cuando terminan.</div></div>';
  var codBox = MODO === "black" ? "" :
    '<details class="cod" id="codbox"><summary>¿Tienes un código de descuento o de invitación?</summary><div class="codr"><input type="text" id="cod" maxlength="30" autocapitalize="characters" spellcheck="false" autocomplete="off" placeholder="Ej.: DULCE10"><button type="button" class="btn ghost sm" id="codb">Aplicar</button></div><div class="codm" id="codm" hidden></div></details>';
  var faq = MODO === "black"
    ? '<details><summary>¿Puedo probar antes de pagar?</summary><p>Sí. Toca <b>Probar 7 días gratis</b>: no pedimos tarjeta y no se cobra nada. El descuento queda guardado en tu cuenta: si decides pagar antes del ' + F.dia + ', lo haces desde la app en Ajustes → Tu plan con el ' + F.dcto + '% aplicado.</p></details>' +
      '<details><summary>¿Qué pasa con los 7 días gratis?</summary><p>Los tienes igual. Pagas hoy con el descuento y tu plan empieza a contar cuando terminan tus 7 días de prueba.</p></details>' +
      '<details><summary>¿El plan mensual se queda con descuento?</summary><p>El descuento dura los primeros 3 meses. Después se cobra el precio normal de ' + pz(NORMAL.mensual) + ' al mes, solo con Mercado Pago. Lo cancelas cuando quieras desde la app.</p></details>' +
      '<details><summary>¿Ya tengo cuenta, sirve el código?</summary><p>Sí, si nunca has pagado un plan: <a href="/app/?ref=' + F.codigo + '&amp;pagar=anual">ingresa aquí</a> y el código se aplica solo al elegir tu plan.</p></details>'
    : '<details><summary>¿Puedo probar antes de pagar?</summary><p>Sí. Toca <b>Crear cuenta y probar 7 días gratis</b>: no pides tarjeta y no se cobra nada. Cuando quieras, eliges tu plan desde la app.</p></details>' +
      '<details><summary>Si pago hoy, ¿pierdo la prueba?</summary><p>No. El plan empieza a contar cuando terminan tus 7 días gratis.</p></details>' +
      '<details><summary>¿Cómo cancelo el plan mensual?</summary><p>Desde la app, en Ajustes → Tu plan → Cancelar suscripción. No se cobra más y sigues usando Dulcia hasta la fecha pagada.</p></details>';
  faq += '<details><summary>¿Cómo pago?</summary><p>Con tarjeta o saldo en el sitio seguro de Mercado Pago. Nosotros no vemos tus datos de pago.</p></details>';

  main.innerHTML = '<div class="grid"><div class="ofe">' +
    '<span class="tag">' + F.tag + '</span><h1>' + F.h1 + '</h1><p class="sub">' + F.sub + '</p>' + (F.l3 ? '<p class="l3">' + F.l3 + '</p>' : '') +
    (MODO === "black" ? '<a class="btn quick" href="#f" id="quick">Probar gratis 7 días</a>' : '') +
    '<ul class="ben bd">' + ben + '</ul></div><div>' +
    '<div class="pls" role="radiogroup" aria-label="Elige tu plan">' + PL.map(planHTML).join("") + '</div>' + gift +
    '<form id="f" novalidate>' + codBox +
      '<div class="yo" id="yo"></div>' +
      (window.DULCIA_GOOGLE ? '<div id="gwrap" style="display:grid;gap:12px">' + DULCIA_GOOGLE.boton(MODO === "black" ? "Probar gratis con Google" : "Continuar con Google") + '<p class="gsep" data-google-sep hidden><span>o con tu correo</span></p></div>' : '') +
      '<div id="nuevos" style="display:grid;gap:12px">' +
        '<label>Tu correo<input type="email" id="em" autocomplete="email" inputmode="email" required placeholder="nombre@correo.cl"></label>' +
        '<label>Crea una clave<input type="password" id="pw" autocomplete="new-password" minlength="6" required placeholder="Mínimo 6 caracteres"></label>' +
      '</div>' +
      '<label id="lnom">Nombre de tu pastelería <span class="hint">(opcional, lo puedes cambiar después)</span><input type="text" id="nom" autocomplete="organization" maxlength="80" placeholder="Ej.: Dulces de Mía"></label>' +
      '<label class="mp" id="mp">Correo de tu Mercado Pago <span class="hint">Solo si es distinto: la suscripción mensual queda a nombre de ese correo.</span><input type="email" id="mpm" autocomplete="off" inputmode="email" placeholder="Igual al de arriba"></label>' +
      '<div class="msg" id="msg" hidden></div>' +
      (MODO === "black" ? '<button class="btn" id="free" type="submit">Probar 7 días gratis</button><button class="btn ghost" id="go" type="button">Crear cuenta y pagar</button>'
        : '<button class="btn" id="go" type="submit">Crear cuenta y pagar</button><button class="btn ghost" id="free" type="button">Crear cuenta y probar 7 días gratis</button>') +
      '<p class="small">' + (MODO === "black" ? "Probar no tiene costo ni pide tarjeta. " : "") + 'Pago seguro en Mercado Pago. Al crear tu cuenta aceptas los <a href="terminos.html">términos</a> y la <a href="privacidad.html">privacidad</a>.</p>' +
    '</form><ul class="ben bm">' + ben + '</ul></div></div>' +
    '<h2>Preguntas rápidas</h2>' + faq;

  if (antes) { var g = $("#go"); g.textContent = "Disponible desde el lunes 23"; g.disabled = true;
    var m0 = $("#msg"); m0.hidden = false; m0.textContent = "La campaña empieza el lunes 23 de noviembre a las 00:00. Vuelve ese día para pagar con el descuento."; }


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
    if (!antes) $("#go").textContent = (cuenta ? "Pagar " : (MODO === "black" ? "O paga hoy " : "Crear cuenta y pagar ")) + pz(precio(k)) + (k === "mensual" ? " al mes" : "") + (MODO === "black" && !cuenta ? " con " + F.dcto + "%" : "");
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
    // El campo del código va siempre cerrado y vacío: cada persona escribe su código.
    // Si llegó por link de influencer (?ref=) y ese código NO tiene descuento, solo se registra la invitación, sin mostrar nada.
    var refIn = (q.get("ref") || lsGet("dulcia_ref") || "").toUpperCase();
    if (/^[A-Z0-9_-]{3,30}$/.test(refIn)) cargarSb().then(async function () {
      var v = await sb.rpc("codigo_valido", { p_codigo: refIn }); if (v.error || !v.data) return;
      var r = await sb.rpc("promo_publico", { p_codigo: refIn }); var d = r.data || {};
      if (!r.error && !d.planes && /no tiene descuento/i.test(d.error || "")) codInv = refIn;
    }).catch(function () {});
  }

  /* ---------- Si ya tiene sesión en este celular ---------- */
  cargarSb().then(async function () {
    var s = await sb.auth.getSession(); if (!s.data.session) return;
    var r = await sb.rpc("mi_cuenta"); var c = r.data && r.data[0];
    cuenta = { email: s.data.session.user.email, negocio: c || null };
    $("#nuevos").style.display = "none"; var gw = $("#gwrap"); if (gw) gw.style.display = "none"; $("#em").required = false; $("#pw").required = false;
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
    if (/Password should|at least/i.test(m)) return "La clave es muy corta: usa al menos " + ((/(\d+)/.exec(m) || [])[1] || 6) + " caracteres.";
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
      if (pw.length < 6) { msg("La clave debe tener al menos 6 caracteres.", true); $("#pw").focus(); return; }
    }
    if (nom.length < 2) nom = "Mi pastelería";
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
        if (MODO === "black") lsSet("dulcia_bf", JSON.stringify({ c: F.codigo, hasta: F.hasta }));
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
  // Google: en el Black entra a probar gratis con el 60% guardado; en /empezar abre el pago del plan elegido al llegar a la app
  if (window.DULCIA_GOOGLE) DULCIA_GOOGLE.activar(cargarSb, function () {
    if (MODO === "black") return { ref: F.codigo, origen: "black", bf: { c: F.codigo, hasta: F.hasta } };
    lsSet("dulcia_pagar", plan());
    return { ref: codRef || codInv, origen: "empezar", bf: promo && promo.codigo ? { c: promo.codigo, hasta: String(promo.hasta || "2099-12-31").slice(0, 10) } : null };
  }, function (t) { msg(esc(t), true); });
  // En el Black la acción principal (y la tecla Enter) es probar gratis; pagar hoy es el botón secundario
  if (MODO === "black") {
    $("#f").addEventListener("submit", function (e) { e.preventDefault(); enviar(true); });
    $("#go").addEventListener("click", function () { enviar(false); });
  } else {
    $("#f").addEventListener("submit", function (e) { e.preventDefault(); enviar(false); });
    var fb = $("#free"); if (fb) fb.addEventListener("click", function () { enviar(true); });
  }
  var qk = $("#quick"); if (qk) qk.addEventListener("click", function (e) { e.preventDefault(); $("#f").scrollIntoView({ behavior: "smooth", block: "start" }); setTimeout(function () { var x = $("#em"); if (x && x.offsetParent) x.focus({ preventScroll: true }); }, 450); });
})();
