/* Dulcia · botón "Continuar con Google" (lo usan /prueba, /black, /empezar y el ingreso de la app).
   El botón aparece solo si Google está activado en Supabase (Authentication → Sign In / Providers → Google). */
(function () {
  var cfg = window.DULCIA_CONFIG || {}, p = null;
  var LOGO = '<svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
  window.DULCIA_GOOGLE = {
    // ¿Está activado Google en Supabase? (se consulta la configuración pública del proyecto)
    disponible: function () {
      if (!p) p = fetch(cfg.url + "/auth/v1/settings", { headers: { apikey: cfg.key } })
        .then(function (r) { return r.ok ? r.json() : {}; })
        .then(function (d) { return !!(d && d.external && d.external.google); })
        .catch(function () { return false; });
      return p;
    },
    boton: function (txt, gtext) { return '<button type="button" class="gbtn" data-google' + (gtext ? ' data-gtext="' + gtext + '"' : '') + ' hidden>' + LOGO + "<span>" + (txt || "Continuar con Google") + "</span></button>"; },
    // Muestra los botones si Google está activo y los conecta. extra: { ref, bf, origen }
    // Usa el botón oficial de Google (la ventana dice "Ir a dulcia.cl"); si no carga, usa el ingreso clásico por Supabase.
    activar: function (getSb, extra, alError) {
      var bs = [].slice.call(document.querySelectorAll("[data-google]")); if (!bs.length) return;
      var G = window.DULCIA_GOOGLE;
      var guardar = function (via) {
        var x = typeof extra === "function" ? extra() : (extra || {});
        try { localStorage.setItem("dulcia_auto", JSON.stringify({ t: Date.now(), ref: x.ref || "", origen: x.origen || "" })); if (x.bf) localStorage.setItem("dulcia_bf", JSON.stringify(x.bf)); } catch (e) {}
        try { window.dulciaEvent && dulciaEvent("google_click", { origen: x.origen || "", via: via }); } catch (e) {}
      };
      var clasico = function (b) {
        b.hidden = false;
        if (b.dataset.on) return; b.dataset.on = "1";
        b.addEventListener("click", async function () {
          var t = b.querySelector("span"), t0 = t.textContent; b.disabled = true; t.textContent = "Abriendo Google…";
          try {
            guardar("redirect");
            var sb = await getSb();
            var r = await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.origin + "/app/", queryParams: { prompt: "select_account" } } });
            if (r && r.error) throw r.error;
          } catch (err) { b.disabled = false; t.textContent = t0; if (alError) alError("No pudimos abrir Google. Intenta de nuevo o usa tu correo."); }
        });
      };
      G.disponible().then(function (ok) {
        if (!ok) return;
        [].forEach.call(document.querySelectorAll("[data-google-sep]"), function (b) { b.hidden = false; });
        G.gis().then(async function (gis) {
          var raw = Array.from(crypto.getRandomValues(new Uint8Array(16)), function (n) { return n.toString(16).padStart(2, "0"); }).join("");
          var hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw))), function (n) { return n.toString(16).padStart(2, "0"); }).join("");
          gis.initialize({ client_id: G.CLIENT_ID, nonce: hash, ux_mode: "popup", context: "signin", itp_support: true,
            callback: async function (resp) {
              try {
                guardar("gis");
                bs.forEach(function (b) { var w = b.previousElementSibling; if (w && w.className === "gis-wrap") w.style.opacity = ".5"; });
                var sb = await getSb();
                var r = await sb.auth.signInWithIdToken({ provider: "google", token: resp.credential, nonce: raw });
                if (r.error) throw r.error;
                location.href = "/app/";
              } catch (err) {
                bs.forEach(function (b) { var w = b.previousElementSibling; if (w && w.className === "gis-wrap") w.remove(); clasico(b); });
                if (alError) alError("No pudimos entrar con Google. Toca el botón de nuevo o usa tu correo.");
              }
            } });
          bs.forEach(function (b) {
            var w = document.createElement("div"); w.className = "gis-wrap";
            w.style.cssText = "display:flex;justify-content:center;min-height:44px;width:100%;color-scheme:light";
            b.parentNode.insertBefore(w, b); b.hidden = true;
            var ancho = Math.max(200, Math.min(400, Math.round((b.parentNode.getBoundingClientRect().width || 320))));
            gis.renderButton(w, { type: "standard", theme: "outline", size: "large", shape: "pill", logo_alignment: "center",
              text: b.dataset.gtext || "continue_with", locale: "es", width: ancho });
          });
        }).catch(function () { bs.forEach(clasico); });
      });
    },
    CLIENT_ID: "1029348243611-jdbvicniega5iqng5119qdq4j2a34bvi.apps.googleusercontent.com",
    // Carga la librería oficial "Acceder con Google" (si no responde en 5 s, se usa el ingreso clásico)
    gis: function () {
      if (window.__gisP) return window.__gisP;
      window.__gisP = new Promise(function (ok, no) {
        if (window.google && google.accounts && google.accounts.id) return ok(google.accounts.id);
        var s = document.createElement("script"); s.src = "https://accounts.google.com/gsi/client?hl=es"; s.async = true;
        var to = setTimeout(function () { no(new Error("timeout")); }, 5000);
        s.onload = function () { clearTimeout(to); if (window.google && google.accounts && google.accounts.id) ok(google.accounts.id); else no(new Error("gis")); };
        s.onerror = function () { clearTimeout(to); no(new Error("gis")); };
        document.head.appendChild(s);
      });
      return window.__gisP;
    }
  };
})();
