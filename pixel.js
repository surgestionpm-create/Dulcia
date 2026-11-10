/* Meta Pixel de Dulcia (campañas de Meta Ads). Va en el <head> de todas las páginas públicas y de la app (no en /admin).
   Privacidad: sin coincidencias avanzadas automáticas (autoConfig apagado), nunca se envían correo, nombre ni teléfono,
   y no se carga mientras la URL trae datos de inicio de sesión (#access_token, ?code=…). */
(function () {
  var ID = "1107994378782408";
  if (window.fbq) return;
  var cola = [];
  // Hasta que el Pixel se cargue, los eventos quedan en cola (dulciaPixel funciona desde el primer momento)
  window.dulciaPixel = function (evento, datos, idEvento) {
    try {
      if (window.__dulciaPxOn) window.fbq("track", evento, datos || {}, idEvento ? { eventID: idEvento } : undefined);
      else cola.push([evento, datos, idEvento]);
    } catch (e) {}
  };
  var sensible = function () {
    return /access_token=|refresh_token=|type=(signup|recovery|magiclink|invite|email_change)|error_code=/.test(location.hash) || /[?&](code|token_hash)=/.test(location.search);
  };
  var iniciar = function () {
    /* Código base de Meta Pixel */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("set", "autoConfig", false, ID); // no lee formularios ni botones de la página
    window.fbq("init", ID);
    window.fbq("track", "PageView");
    window.__dulciaPxOn = true;
    cola.splice(0).forEach(function (e) { window.dulciaPixel(e[0], e[1], e[2]); });
  };
  if (!sensible()) { iniciar(); return; }
  // Enlace de confirmación o de clave: se espera a que la app limpie la URL (máximo 15 s; si no, esta visita no se mide)
  var n = 0, t = setInterval(function () { if (!sensible()) { clearInterval(t); iniciar(); } else if (++n > 30) clearInterval(t); }, 500);
})();
