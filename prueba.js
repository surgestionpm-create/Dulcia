/* Dulcia · dulcia.cl/prueba: crear cuenta gratis con solo correo y clave, y entrar directo a la app. */
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var ev = function (n, p) { try { window.dulciaEvent && dulciaEvent(n, p || {}); } catch (e) {} };
  var px = function (n, p) { try { window.dulciaPixel && dulciaPixel(n, p || {}); } catch (e) {} };
  var lsSet = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var cfg = window.DULCIA_CONFIG || {}, sb = null, q = new URLSearchParams(location.search);
  try { if (window.DULCIA_LOGO) $("#logo").innerHTML = window.DULCIA_LOGO; } catch (e) {}

  // Black Friday (26 al 29 de noviembre, hora de Chile): la franja avisa y el 60% queda guardado para pagar desde la app
  var hoy = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago" }).format(new Date());
  var BF = (hoy >= "2026-11-26" && hoy <= "2026-11-29") || q.get("fase") === "black";
  if (BF) document.body.classList.add("bf");

  // Código de invitación sin descuento que venga en el link (?ref=): se registra en silencio. Nunca se muestra ni se rellena.
  var codInv = "";
  var refIn = (q.get("ref") || "").trim().toUpperCase();

  function cargarSb() {
    return new Promise(function (ok, no) {
      if (window.supabase) return ok();
      var s = document.createElement("script"); s.src = "supabase.js"; s.onload = ok; s.onerror = function () { no(new Error("Failed to fetch")); }; document.head.appendChild(s);
    }).then(function () {
      if (!sb) sb = window.supabase.createClient(cfg.url, cfg.key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } });
      return sb;
    });
  }
  cargarSb().then(async function () {
    // Si ya tiene sesión abierta, el botón lo lleva a su cuenta
    var s = await sb.auth.getSession();
    if (s.data.session) { var b = $("#go"); b.textContent = "Ir a mi cuenta"; b.dataset.ir = "1"; $("#gslot").style.display = "none"; }
    if (/^[A-Z0-9_-]{3,30}$/.test(refIn)) {
      var v = await sb.rpc("codigo_valido", { p_codigo: refIn }); if (v.error || !v.data) return;
      var r = await sb.rpc("promo_publico", { p_codigo: refIn }); var d = r.data || {};
      if (!r.error && !d.planes && /no tiene descuento/i.test(d.error || "")) codInv = refIn;
    }
  }).catch(function () {});

  // Botón "Continuar con Google" (aparece solo si Google está activado en Supabase)
  if (window.DULCIA_GOOGLE) {
    $("#gslot").innerHTML = DULCIA_GOOGLE.boton("Continuar con Google") + '<p class="gsep" data-google-sep hidden><span>o con tu correo</span></p>';
    DULCIA_GOOGLE.activar(cargarSb, function () { return { ref: codInv, origen: "prueba", bf: BF ? { c: "BLACKDULCIA", hasta: "2026-11-29" } : null }; }, function (t) { msg(t, true); });
  }

  function msg(h, err) { var m = $("#msg"); m.hidden = false; m.className = "msg" + (err ? " err" : ""); m.innerHTML = h; }
  function txtErr(e) {
    var m = String(e && (e.message || e.error_description || e) || "");
    if (/already registered|already been registered|User already/i.test(m)) return "YA";
    if (/Password should|at least/i.test(m)) return "La clave es muy corta: usa al menos " + ((/(\d+)/.exec(m) || [])[1] || 6) + " caracteres.";
    if (/invalid.*email|Unable to validate email/i.test(m)) return "Revisa tu correo: parece que está mal escrito.";
    if (/rate limit|too many/i.test(m)) return "Hubo muchos intentos seguidos. Espera un minuto e intenta de nuevo.";
    if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return "Sin conexión. Revisa tu internet e intenta de nuevo.";
    return "No pudimos crear tu cuenta. Intenta de nuevo o escríbenos a " + esc(cfg.contacto || "contacto.dulcia@gmail.com") + ".";
  }
  function yaTiene() { msg('Ese correo ya tiene cuenta en Dulcia. <a href="/app/">Ingresa aquí</a> con tu clave.', true); }

  $("#ver").addEventListener("click", function () { var p = $("#pw"), v = p.type === "password"; p.type = v ? "text" : "password"; this.textContent = v ? "Ocultar" : "Ver"; });

  var empezo = false;
  $("#em").addEventListener("focus", function () { if (!empezo) { empezo = true; ev("form_start", { form: "prueba" }); } });

  $("#f").addEventListener("submit", async function (e) {
    e.preventDefault();
    var b = $("#go");
    if (b.dataset.ir) { location.href = "/app/"; return; }
    var em = $("#em").value.trim().toLowerCase(), pw = $("#pw").value;
    $("#msg").hidden = true;
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(em)) { msg("Escribe un correo válido, por ejemplo tu@correo.cl.", true); $("#em").focus(); return; }
    if (pw.length < 6) { msg("La clave debe tener al menos 6 caracteres.", true); $("#pw").focus(); return; }
    var t0 = b.textContent; b.disabled = true; b.textContent = "Creando tu cuenta…";
    var listo = function () { b.disabled = false; b.textContent = t0; };
    try {
      await cargarSb();
      var s = await sb.auth.signUp({ email: em, password: pw, options: { emailRedirectTo: location.origin + "/app/", data: codInv ? { ref: codInv } : {} } });
      if (s.error) { if (txtErr(s.error) === "YA") { yaTiene(); listo(); return; } throw s.error; }
      if (!s.data.session) {
        if (s.data.user && s.data.user.identities && s.data.user.identities.length === 0) { yaTiene(); listo(); return; }
        msg("Te enviamos un correo a <b>" + esc(em) + "</b>. Ábrelo y toca el botón para entrar a Dulcia.");
        b.textContent = "Revisa tu correo"; ev("sign_up", { method: "email", fase: "prueba", confirmar: "si" }); return;
      }
      ev("sign_up", { method: "email", fase: "prueba" }); px("CompleteRegistration", { content_name: "Dulcia prueba", status: true });
      var r = await sb.rpc("crear_negocio", { p_nombre: "Mi pastelería", p_codigo: codInv || null });
      if (r.error && !/Ya tienes una cuenta/i.test(r.error.message || "")) throw r.error;
      ev("start_trial", { fase: "prueba" }); px("StartTrial", { value: 0, currency: "CLP" });
      if (BF) lsSet("dulcia_bf", JSON.stringify({ c: "BLACKDULCIA", hasta: "2026-11-29" }));
      b.textContent = "¡Listo! Entrando…";
      location.href = "/app/";
    } catch (err) {
      var t = txtErr(err); if (t === "YA") yaTiene(); else msg(esc(t), true);
      listo();
    }
  });

  // Botones de abajo: llevan al formulario y ponen el cursor en el correo
  [].forEach.call(document.querySelectorAll("[data-ir]"), function (a) {
    if (a.tagName !== "A") return;
    a.addEventListener("click", function (e) { e.preventDefault(); $("#f").scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(function () { $("#em").focus({ preventScroll: true }); }, 400); });
  });
  // Botón fijo en el celular: aparece cuando el formulario ya no se ve
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { $("#sticky").classList.toggle("on", !es[0].isIntersecting); }).observe($("#f"));
  }
})();
