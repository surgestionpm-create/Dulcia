/* Google Analytics 4 de Dulcia. Solo mide visitas y clics del sitio; en la app, solo "cuenta creada" y "clic en pagar". */
(function () {
  var ID = "G-0KBE96B2E9";
  var app = /\/app(\.html)?\/?$/.test(location.pathname);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  var s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID; document.head.appendChild(s);
  gtag("js", new Date());
  // Nunca enviamos el #fragmento de la URL (puede traer datos de inicio de sesión) ni parámetros internos de la app
  var clean = location.origin + location.pathname + (app ? "" : location.search);
  gtag("config", ID, { send_page_view: false, page_location: clean, page_title: app ? "App Dulcia" : document.title });
  gtag("event", "page_view", { page_location: clean, page_title: app ? "App Dulcia" : document.title });
  window.dulciaEvent = function (name, params) { try { gtag("event", name, params || {}); } catch (e) {} };
  if (app) return;
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a"); if (!a) return;
    var h = a.getAttribute("href") || "", sec = a.closest("section,header,footer,nav,.plan"), donde = sec ? (sec.id || sec.className || sec.tagName).toString().split(" ")[0] : "";
    var plan = a.closest(".plan"), pn = plan && plan.querySelector(".pn") ? plan.querySelector(".pn").textContent.trim().toLowerCase() : "";
    if (/crear=1/.test(h)) dulciaEvent("clic_prueba_gratis", { ubicacion: donde, plan: pn || "sin_plan", texto: a.textContent.trim().slice(0, 40) });
    else if (/(^|\/)app\/?$/.test(h)) dulciaEvent("clic_entrar", { ubicacion: donde });
    else if (/wa\.me|whatsapp/.test(h)) dulciaEvent("clic_whatsapp", { ubicacion: donde });
    else if (/^mailto:/.test(h)) dulciaEvent("clic_correo", { ubicacion: donde });
    else if (/instagram\.com/.test(h)) dulciaEvent("clic_instagram", { ubicacion: donde });
  }, true);
  document.addEventListener("toggle", function (e) { var d = e.target; if (d.tagName === "DETAILS" && d.open) { var q = d.querySelector("summary"); dulciaEvent("abre_pregunta", { pregunta: q ? q.textContent.trim().slice(0, 80) : "" }); } }, true);
})();
