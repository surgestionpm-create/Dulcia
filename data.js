/* Dulcia - acceso de usuarios y guardado en Supabase. */
(function () {
  var sb = window.__FAKE_SB__ || window.supabase.createClient(DULCIA_CONFIG.url, DULCIA_CONFIG.key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  var NEG = null, snap = {}, fotoPath = {}, saving = false, again = false, timer = null, retry = null, loaded = false;
  window.SYNC_TXT = "";
  window.USER_EMAIL = "";

  /* ---------- utilidades ---------- */
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16);
    });
  }
  function ensure(o) { if (!o.uid) o.uid = uuid(); return o.uid; }
  function setStatus(t) { window.SYNC_TXT = t; var el = document.getElementById("syncst"); if (el) el.textContent = t; }
  function chk(res) { if (res && res.error) throw res.error; return res; }
  function dataToBlob(u) { return fetch(u).then(function (r) { return r.blob(); }); }
  function t5(h) { return String(h || "12:00").slice(0, 5); }
  function msg(e) {
    var m = (e && (e.message || e.error_description)) || String(e || "");
    if (/Invalid login credentials/i.test(m)) return "El correo o la clave no son correctos.";
    if (/Email not confirmed/i.test(m)) return "Primero confirma tu correo: te enviamos un enlace.";
    if (/already registered|already been registered/i.test(m)) return "Ese correo ya tiene una cuenta. Usa Ingresar.";
    if (/Password should be at least/i.test(m)) return "La clave debe tener al menos 8 caracteres.";
    if (/rate limit|too many/i.test(m)) return "Demasiados intentos. Espera unos minutos y vuelve a probar.";
    if (/Failed to fetch|NetworkError|network/i.test(m)) return "No hay conexión con el servidor. Revisa tu internet.";
    if (/invalid.*email|valid email/i.test(m)) return "Escribe un correo válido.";
    return m || "Algo salió mal. Intenta de nuevo.";
  }

  /* ---------- filas a guardar ---------- */
  function receta(rr) {
    var grupos = [], items = [];
    rr.items.forEach(function (it, i) {
      var gi = grupos.findIndex(function (g) { return g.nombre === it.g; });
      if (gi < 0) { grupos.push({ nombre: it.g, se_compra: gbuy[it.g] !== false, orden: grupos.length }); gi = grupos.length - 1; }
      items.push({ grupo: it.g, nombre: it.n, cantidad: +it.q || 0, unidad: it.u, costo_unidad: +it.c || 0, orden: i });
    });
    return { row: { id: ensure(rr), negocio_id: NEG, nombre: rr.nombre, rinde: rr.rinde || "", margen: +rr.margen || 0, precio: +rr.precio || 0 }, grupos: grupos, items: items };
  }
  function current() {
    var m = {};
    m["neg"] = { t: "neg", row: { nombre: cfg.nombre, telefono: cfg.tel, correo: cfg.mail, web: cfg.url, cond_cotizacion: cfg.cond, validez_dias: cfg.vig, abono_pct: cfg.abono, cap_diaria: cfg.cap, sueldo_mensual: hora.sueldo, horas_mes: hora.horas, siguiente_cotizacion: qnum, logo_path: cfg.logoPath || null } };
    pcats.forEach(function (c) { m["pc:" + ensure(c)] = { t: "pc", row: { id: c.uid, negocio_id: NEG, nombre: c.n, margen: c.m } }; });
    gcats.forEach(function (n) { m["gc:" + n] = { t: "gc", row: { negocio_id: NEG, nombre: n } }; });
    gastos.forEach(function (g) { m["g:" + ensure(g)] = { t: "g", row: { id: g.uid, negocio_id: NEG, fecha: g.fecha, nombre: g.nombre, categoria: g.cat, monto: +g.monto || 0, iva_modo: g.iva } }; });
    recipes.forEach(function (rr) { var x = receta(rr); m["r:" + x.row.id] = { t: "r", row: x.row, grupos: x.grupos, items: x.items }; });
    orders.forEach(function (o) {
      var id = ensure(o);
      m["p:" + id] = { t: "p", row: { id: id, negocio_id: NEG, es_cotizacion: !!o.cot, numero_cotizacion: o.num || null, cliente: o.cliente, fecha: o.fecha, hora: t5(o.hora), categoria: o.cat, canal: o.canal, descripcion: o.desc || "", total: +o.total || 0, pagado: +o.pagado || 0, listo: !!o.listo, condiciones: o.cond == null ? null : o.cond, validez_dias: o.vig == null ? null : o.vig, origen: o.origen || "app" } };
      var its = [];
      (o.items || []).forEach(function (l) { var r = recipes.find(function (q) { return q.id === l.rid; }); if (r) its.push({ negocio_id: NEG, pedido_id: id, receta_id: r.uid, cantidad: +l.q || 0 }); });
      m["pr:" + id] = { t: "pr", pid: id, rows: its };
      var fs = (o.fotos || []).map(function (f) { return fotoPath[f] ? { negocio_id: NEG, pedido_id: id, path: fotoPath[f] } : null; }).filter(Boolean);
      m["pf:" + id] = { t: "pf", pid: id, rows: fs };
    });
    Object.keys(m).forEach(function (k) { m[k].json = JSON.stringify(m[k].row || m[k].rows ? [m[k].row, m[k].rows, m[k].grupos, m[k].items] : 0); });
    return m;
  }

  /* ---------- guardar ---------- */
  function scheduleSave() { if (!NEG || !loaded) return; clearTimeout(timer); timer = setTimeout(save, 700); }
  async function uploadPending() {
    var st = sb.storage.from("archivos");
    if (cfg.logoDirty && cfg.logoData) {
      var lb = await dataToBlob(cfg.logoData), ext = /png/.test(lb.type) ? "png" : "jpg", lp = NEG + "/logo-" + Date.now() + "." + ext;
      chk(await st.upload(lp, lb, { contentType: lb.type || "image/jpeg", upsert: true }));
      cfg.logoPath = lp; cfg.logoDirty = false;
    }
    for (var i = 0; i < orders.length; i++) {
      var o = orders[i];
      for (var k = 0; k < (o.fotos || []).length; k++) {
        var f = o.fotos[k];
        if (fotoPath[f] || !/^data:/.test(f)) continue;
        var b = await dataToBlob(f), p = NEG + "/pedidos/" + uuid() + ".jpg";
        chk(await st.upload(p, b, { contentType: "image/jpeg" }));
        fotoPath[f] = p;
      }
    }
  }
  async function save() {
    if (!NEG || !loaded) return;
    if (saving) { again = true; return; }
    saving = true; clearTimeout(retry);
    try {
      await uploadPending();
      var cur = current(), keys = Object.keys(cur), old = Object.keys(snap);
      var del = { pc: [], g: [], r: [], p: [] }, delGc = [];
      old.forEach(function (k) {
        if (k in cur) return;
        var p = k.split(":"), t = p[0], id = k.slice(t.length + 1);
        if (t === "gc") delGc.push(id); else if (del[t]) del[t].push(id);
      });
      var chg = keys.filter(function (k) { return snap[k] !== cur[k].json; });
      if (!chg.length && !old.some(function (k) { return !(k in cur); })) { setStatus("Todo guardado"); saving = false; return; }
      setStatus("Guardando…");
      var by = function (t) { return chg.filter(function (k) { return cur[k].t === t; }).map(function (k) { return cur[k]; }); };
      // borrar
      if (del.r.length) chk(await sb.from("recetas").delete().in("id", del.r));
      if (del.p.length) chk(await sb.from("pedidos").delete().in("id", del.p));
      if (del.g.length) chk(await sb.from("gastos").delete().in("id", del.g));
      if (del.pc.length) chk(await sb.from("categorias_pedido").delete().in("id", del.pc));
      if (delGc.length) chk(await sb.from("categorias_gasto").delete().eq("negocio_id", NEG).in("nombre", delGc));
      // guardar
      var neg = by("neg"); if (neg.length) chk(await sb.from("negocios").update(neg[0].row).eq("id", NEG));
      var pc = by("pc"); if (pc.length) chk(await sb.from("categorias_pedido").upsert(pc.map(function (x) { return x.row; }), { onConflict: "id" }));
      var gc = by("gc"); if (gc.length) chk(await sb.from("categorias_gasto").upsert(gc.map(function (x) { return x.row; }), { onConflict: "negocio_id,nombre" }));
      var rs = by("r");
      if (rs.length) {
        var ids = rs.map(function (x) { return x.row.id; });
        chk(await sb.from("recetas").upsert(rs.map(function (x) { return x.row; }), { onConflict: "id" }));
        chk(await sb.from("receta_items").delete().in("receta_id", ids));
        chk(await sb.from("receta_grupos").delete().in("receta_id", ids));
        var gRows = [], iRows = [];
        rs.forEach(function (x) {
          var gid = {};
          x.grupos.forEach(function (g) { gid[g.nombre] = uuid(); gRows.push({ id: gid[g.nombre], negocio_id: NEG, receta_id: x.row.id, nombre: g.nombre, se_compra: g.se_compra, orden: g.orden }); });
          x.items.forEach(function (it) { iRows.push({ negocio_id: NEG, receta_id: x.row.id, grupo_id: gid[it.grupo], nombre: it.nombre, cantidad: it.cantidad, unidad: it.unidad, costo_unidad: it.costo_unidad, orden: it.orden }); });
        });
        if (gRows.length) chk(await sb.from("receta_grupos").insert(gRows));
        if (iRows.length) chk(await sb.from("receta_items").insert(iRows));
      }
      var g = by("g"); if (g.length) chk(await sb.from("gastos").upsert(g.map(function (x) { return x.row; }), { onConflict: "id" }));
      var p = by("p"); if (p.length) chk(await sb.from("pedidos").upsert(p.map(function (x) { return x.row; }), { onConflict: "id" }));
      var pr = by("pr");
      if (pr.length) {
        chk(await sb.from("pedido_recetas").delete().in("pedido_id", pr.map(function (x) { return x.pid; })));
        var prr = []; pr.forEach(function (x) { prr = prr.concat(x.rows); });
        if (prr.length) chk(await sb.from("pedido_recetas").insert(prr));
      }
      var pf = by("pf");
      if (pf.length) {
        chk(await sb.from("pedido_fotos").delete().in("pedido_id", pf.map(function (x) { return x.pid; })));
        var pfr = []; pf.forEach(function (x) { pfr = pfr.concat(x.rows); });
        if (pfr.length) chk(await sb.from("pedido_fotos").insert(pfr));
      }
      snap = {}; keys.forEach(function (k) { snap[k] = cur[k].json; });
      setStatus("Todo guardado");
    } catch (e) {
      console.error("Error al guardar", e);
      setStatus("No se pudo guardar. Reintentando…");
      if (window.toast) toast("No se pudo guardar. Revisa tu conexión; reintentamos solos.");
      retry = setTimeout(save, 8000);
    }
    saving = false;
    if (again) { again = false; scheduleSave(); }
  }
  window.dulciaSaveNow = save;
  var _render = window.render; window.render = function () { _render.apply(this, arguments); scheduleSave(); };

  /* ---------- cargar ---------- */
  function sel(t, f) { var q = sb.from(t).select("*"); return f ? f(q) : q.eq("negocio_id", NEG); }
  async function signed(paths) {
    var out = {}; if (!paths.length) return out;
    for (var i = 0; i < paths.length; i += 100) {
      var r = chk(await sb.storage.from("archivos").createSignedUrls(paths.slice(i, i + 100), 60 * 60 * 24 * 7));
      (r.data || []).forEach(function (x) { if (x.signedUrl) out[x.path] = x.signedUrl; });
    }
    return out;
  }
  async function loadAll() {
    var R = await Promise.all([
      sel("negocios", function (q) { return q.eq("id", NEG).single(); }), sel("categorias_pedido"), sel("categorias_gasto"), sel("recetas"), sel("receta_grupos"), sel("receta_items"),
      sel("pedidos"), sel("pedido_recetas"), sel("pedido_fotos"), sel("gastos")
    ]);
    R.forEach(function (r) { chk(r); });
    var neg = R[0].data;
    cfg.nombre = neg.nombre; cfg.tel = neg.telefono || ""; cfg.mail = neg.correo || ""; cfg.url = neg.web || ""; cfg.cond = neg.cond_cotizacion;
    cfg.vig = neg.validez_dias; cfg.abono = +neg.abono_pct; cfg.cap = neg.cap_diaria; hora.sueldo = +neg.sueldo_mensual; hora.horas = +neg.horas_mes; qnum = neg.siguiente_cotizacion;
    cfg.logoPath = neg.logo_path; cfg.logo = null; cfg.logoData = null; cfg.logoDirty = false;
    if (neg.logo_path) {
      var ls = await signed([neg.logo_path]);
      if (ls[neg.logo_path]) { var d = await toData(ls[neg.logo_path]); if (d) { cfg.logo = d; cfg.logoData = d; } }
    }
    pcats.length = 0; R[1].data.forEach(function (c) { pcats.push({ uid: c.id, n: c.nombre, m: +c.margen }); });
    gcats.length = 0; R[2].data.forEach(function (c) { gcats.push(c.nombre); });
    recipes.length = 0; var rmap = {}, gmap = {};
    R[4].data.forEach(function (g) { gmap[g.id] = g; gbuy[g.nombre] = g.se_compra; });
    R[3].data.forEach(function (r) {
      var rr = { id: rid++, uid: r.id, nombre: r.nombre, rinde: r.rinde || "", margen: +r.margen, precio: +r.precio, items: [] };
      var its = R[5].data.filter(function (i) { return i.receta_id === r.id; }).map(function (i) { return { i: i, g: gmap[i.grupo_id] || { nombre: "Ingredientes", orden: 0 } }; });
      its.sort(function (a, b) { return a.g.orden - b.g.orden || a.i.orden - b.i.orden; });
      its.forEach(function (x) { rr.items.push({ g: x.g.nombre, n: x.i.nombre, q: +x.i.cantidad, u: x.i.unidad, c: +x.i.costo_unidad }); });
      recipes.push(rr); rmap[r.id] = rr.id;
    });
    var paths = R[8].data.map(function (f) { return f.path; }), urls = await signed(paths);
    fotoPath = {}; R[8].data.forEach(function (f) { if (urls[f.path]) fotoPath[urls[f.path]] = f.path; });
    orders.length = 0;
    R[6].data.forEach(function (p) {
      var o = { id: nextId++, uid: p.id, cot: p.es_cotizacion, num: p.numero_cotizacion || 0, cliente: p.cliente, fecha: p.fecha, hora: t5(p.hora), cat: p.categoria, canal: p.canal, desc: p.descripcion || "", total: +p.total, pagado: +p.pagado, listo: p.listo, cond: p.condiciones, vig: p.validez_dias, origen: p.origen, items: [], fotos: [] };
      if (o.cond == null) delete o.cond; if (o.vig == null) delete o.vig;
      R[7].data.filter(function (x) { return x.pedido_id === p.id; }).forEach(function (x) { if (rmap[x.receta_id]) o.items.push({ rid: rmap[x.receta_id], q: +x.cantidad }); });
      R[8].data.filter(function (x) { return x.pedido_id === p.id && urls[x.path]; }).forEach(function (x) { o.fotos.push(urls[x.path]); });
      orders.push(o);
    });
    gastos.length = 0; R[9].data.forEach(function (g) { gastos.push({ id: gid++, uid: g.id, fecha: g.fecha, cat: g.categoria, nombre: g.nombre, monto: +g.monto, iva: g.iva_modo }); });
    if (recipes.length) selR(recipes[0].id);
    snap = {}; var c = current(); Object.keys(c).forEach(function (k) { snap[k] = c[k].json; });
    loaded = true; setStatus("Todo guardado");
  }

  /* ---------- pantallas de acceso ---------- */
  var A = document.getElementById("auth");
  function show(html) { document.getElementById("boot").hidden = true; document.getElementById("appwrap").hidden = true; A.hidden = false; A.innerHTML = '<div class="box">' + html + "</div>"; }
  function note(t, ok) { var m = A.querySelector(".msg"); if (m) { m.textContent = t; m.className = "msg" + (ok ? " ok" : ""); m.hidden = false; } }
  function busy(b, on) { if (b) { b.disabled = on; } }
  function showAuth(mode) {
    mode = mode || "in";
    show('<h1 style="margin:0">' + (window.DULCIA_LOGO || "Dulcia") + '<span style="position:absolute;left:-9999px">Dulcia</span></h1><p class="tag">Tu pastelería, en orden.</p>' +
      '<div class="tabs"><button data-mode="in" aria-pressed="' + (mode === "in") + '">Ingresar</button><button data-mode="up" aria-pressed="' + (mode === "up") + '">Crear cuenta</button></div>' +
      '<form id="af"><label>Correo<input type="email" id="ae" required autocomplete="email"></label>' +
      '<label>Clave<input type="password" id="ap" required minlength="8" autocomplete="' + (mode === "in" ? "current-password" : "new-password") + '" placeholder="Mínimo 8 caracteres"></label>' +
      '<div class="msg" hidden></div><button class="btn" type="submit">' + (mode === "in" ? "Ingresar" : "Crear cuenta") + '</button>' +
      (mode === "in" ? '<button type="button" class="lnk" id="forgot">Olvidé mi clave</button>' : "") + '</form>');
    A.querySelectorAll(".tabs button").forEach(function (b) { b.onclick = function () { showAuth(b.dataset.mode); }; });
    var f = document.getElementById("af");
    f.onsubmit = async function (e) {
      e.preventDefault(); var btn = f.querySelector(".btn"), em = f.querySelector("#ae").value.trim(), pw = f.querySelector("#ap").value; busy(btn, true);
      try {
        if (mode === "in") { var r = await sb.auth.signInWithPassword({ email: em, password: pw }); if (r.error) throw r.error; await afterLogin(r.data.session); }
        else {
          var s = await sb.auth.signUp({ email: em, password: pw }); if (s.error) throw s.error;
          if (s.data.session) await afterLogin(s.data.session);
          else { note("Te enviamos un correo para confirmar tu cuenta. Abre el enlace y después vuelve a ingresar.", true); }
        }
      } catch (err) { note(msg(err)); }
      busy(btn, false);
    };
    var fg = document.getElementById("forgot");
    if (fg) fg.onclick = async function () {
      var em = f.querySelector("#ae").value.trim(); if (!em) { note("Escribe tu correo arriba y vuelve a pulsar."); return; }
      var r = await sb.auth.resetPasswordForEmail(em, { redirectTo: location.origin + location.pathname });
      note(r.error ? msg(r.error) : "Si ese correo tiene cuenta, te enviamos un enlace para crear una clave nueva.", !r.error);
    };
  }
  function showNewPass() {
    show('<h1>Clave nueva</h1><p>Escribe la clave que quieres usar desde ahora.</p><form id="af"><label>Clave nueva<input type="password" id="ap" required minlength="8" autocomplete="new-password"></label><div class="msg" hidden></div><button class="btn" type="submit">Guardar clave</button></form>');
    document.getElementById("af").onsubmit = async function (e) {
      e.preventDefault(); var r = await sb.auth.updateUser({ password: document.getElementById("ap").value });
      if (r.error) note(msg(r.error)); else { var s = await sb.auth.getSession(); await afterLogin(s.data.session); }
    };
  }
  function shrink(file, cb) {
    var rd = new FileReader();
    rd.onload = function () {
      var im = new Image();
      im.onload = function () {
        var sc = Math.min(1, 1600 / Math.max(im.naturalWidth, im.naturalHeight)), c = document.createElement("canvas");
        c.width = Math.round(im.naturalWidth * sc); c.height = Math.round(im.naturalHeight * sc);
        var x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height);
        c.toBlob(function (b) { cb(b); }, "image/jpeg", 0.85);
      };
      im.onerror = function () { cb(null); };
      im.src = rd.result;
    };
    rd.readAsDataURL(file);
  }
  function showPending(info) {
    info = info || {};
    var back = /[?&]pago=ok/.test(location.search), fail = /[?&]pago=fallo/.test(location.search);
    var cfgd = window.DULCIA_CONFIG || {}, c = cfgd.contacto || "";
    show('<h1>' + (back ? "Confirmando tu pago…" : "Un paso más: tu pago") + '</h1>' +
      '<p>' + (back ? 'Estamos esperando la confirmación de Mercado Pago. Tu cuenta se activa sola en unos segundos.' : 'Tu cuenta ya está creada. Se activa al instante cuando pagas los <b>$19.990</b>, pago único y sin mensualidades.') + '</p>' +
      (fail ? '<div class="msg">El pago no se completó. Puedes intentarlo de nuevo.</div>' : '') +
      '<div class="msg" hidden></div>' +
      (back ? '' : '<button class="btn" id="pg" type="button">Pagar $19.990 con Mercado Pago</button><p class="note" style="margin:8px 0 0">Pagas con tarjeta o saldo en el sitio seguro de Mercado Pago. Nosotros no vemos tus datos de pago.</p>') +
      '<button class="btn ghost" id="rv" type="button">Ya pagué, revisar mi cuenta</button><button type="button" class="lnk" id="lo">Cerrar sesión</button>' +
      (c ? '<p class="note">¿Problemas con el pago? Escribe a ' + c + '</p>' : ''));
    document.getElementById("lo").onclick = doLogout;
    var pgb = document.getElementById("pg");
    if (pgb) pgb.onclick = async function () {
      var b = this; busy(b, true);
      try {
        var s = await sb.auth.getSession(), tk = s.data.session.access_token;
        var r = await fetch(cfgd.url + "/functions/v1/crear-pago", { method: "POST", headers: { Authorization: "Bearer " + tk, apikey: cfgd.key, "Content-Type": "application/json" }, body: "{}" });
        var d = await r.json();
        if (d.activo) { await afterLogin(s.data.session); return; }
        if (!r.ok || !d.url) throw new Error(d.error || "No pudimos abrir el pago");
        location.href = d.url;
      } catch (err) { busy(b, false); note("No pudimos abrir el pago. " + msg(err)); }
    };
    var check = async function (quiet) {
      var s3 = await sb.auth.getSession(); await afterLogin(s3.data.session);
      return !document.getElementById("appwrap").hidden;
    };
    document.getElementById("rv").onclick = async function () {
      var b = this; busy(b, true);
      if (await check()) return;
      busy(b, false); note("Todavía no vemos tu pago. Cuando se confirme, tu cuenta se activa sola.");
    };
    if (window.__pv) { clearInterval(window.__pv); window.__pv = 0; }
    if (back) { var n = window.__pn || 0; window.__pv = setInterval(async function () { window.__pn = ++n; if (n > 40) { clearInterval(window.__pv); return; } await check(); }, 3000); }
  }
  /* Panel del administrador: comprobantes pendientes */
  async function adminOpen() {
    var d = document.getElementById("dlg");
    d.innerHTML = '<div class="dlg"><header><h2 style="font-size:1.35rem">Activaciones pendientes</h2><button class="ib" data-close aria-label="Cerrar">✕</button></header><p class="note" style="margin:0">Revisa en tu banco que llegaron $19.990 antes de activar.</p><div id="adm"><p class="note">Cargando…</p></div></div>';
    if (!d.open) d.showModal();
    var box = document.getElementById("adm");
    var r = await sb.rpc("admin_pendientes");
    if (r.error) { box.innerHTML = '<p class="note">' + msg(r.error) + "</p>"; return; }
    if (!r.data.length) { box.innerHTML = '<p class="note">No hay cuentas pendientes.</p>'; return; }
    var html = "";
    for (var i = 0; i < r.data.length; i++) {
      var p = r.data[i], img = "";
      if (p.comprobante_path) {
        var su = await sb.storage.from("comprobantes").createSignedUrl(p.comprobante_path, 3600);
        var url = su.data && (su.data.signedUrl || su.data.signedURL);
        img = url ? '<a href="' + url + '" target="_blank" rel="noopener"><img src="' + url + '" alt="Comprobante de ' + esc2(p.nombre) + '" style="max-width:100%;max-height:240px;border-radius:10px;border:1px solid var(--line)"></a>' : '<p class="note">No se pudo cargar la imagen.</p>';
      } else img = '<p class="note" style="margin:0">Aún no sube comprobante.</p>';
      html += '<div class="qbox" style="display:grid;gap:8px"><div><b>' + esc2(p.nombre) + '</b><div class="note" style="margin:0">' + esc2(p.correo) + " · creada " + new Date(p.creado_en).toLocaleDateString("es-CL") + "</div></div>" + img +
        '<div><button class="btn sm" data-act="' + p.negocio_id + '">Confirmar pago y activar</button></div></div>';
    }
    box.innerHTML = html;
  }
  function esc2(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  document.addEventListener("click", async function (e) {
    var t = e.target.closest("button"); if (!t) return;
    if (t.hasAttribute("data-admin")) { adminOpen(); }
    else if (t.dataset.act) { t.disabled = true; var r = await sb.rpc("admin_activar", { p_negocio: t.dataset.act }); if (r.error) alert_msg(r.error); adminOpen(); }
  });
  function alert_msg(e) { var b = document.getElementById("adm"); if (b) b.insertAdjacentHTML("afterbegin", '<p class="note">' + esc2(msg(e)) + "</p>"); }
  function showOnboard() {
    show('<h1>Bienvenida a Dulcia</h1><p>Un último paso: ¿cómo se llama tu pastelería?</p><form id="af"><label>Nombre de tu pastelería<input type="text" id="an" required maxlength="80" placeholder="Ej.: Ufa Trufa"></label><div class="msg" hidden></div><button class="btn" type="submit">Empezar</button><button type="button" class="lnk" id="lo">Cerrar sesión</button></form>');
    document.getElementById("lo").onclick = doLogout;
    document.getElementById("af").onsubmit = async function (e) {
      e.preventDefault(); var b = e.target.querySelector(".btn"); busy(b, true);
      try { var r = await sb.rpc("crear_negocio", { p_nombre: document.getElementById("an").value.trim() }); if (r.error) throw r.error; var s2 = await sb.auth.getSession(); await afterLogin(s2.data.session); }
      catch (err) { note(msg(err)); busy(b, false); }
    };
  }
  async function enter() {
    document.getElementById("boot").hidden = false; A.hidden = true;
    try { await loadAll(); }
    catch (e) { console.error(e); show('<h1>No pudimos cargar tus datos</h1><p>' + msg(e) + '</p><button class="btn" onclick="location.reload()">Reintentar</button>'); return; }
    document.getElementById("boot").hidden = true; document.getElementById("appwrap").hidden = false; render();
    var d = document.getElementById("syncst"); if (d) d.textContent = window.SYNC_TXT;
    installTip();
  }
  /* Aviso para instalar la app en el celular (una vez por dispositivo) */
  function installTip() {
    try {
      if (localStorage.getItem("dulcia_tip") === "1" || document.getElementById("itip")) return;
      if ((window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone) return;
      var d = document.createElement("div"); d.id = "itip"; d.setAttribute("role", "dialog");
      d.style.cssText = "position:fixed;left:12px;right:12px;bottom:96px;max-width:420px;margin:0 auto;z-index:60;background:#fff;color:#2A1E2E;border-radius:18px;padding:16px 18px;box-shadow:0 18px 50px rgba(42,30,46,.28);font-size:.92rem;line-height:1.45";
      d.innerHTML = '<b style="font-family:Cormorant Garamond,serif;font-size:1.2rem">Instala Dulcia en tu celular</b>' +
        '<p style="margin:6px 0"><b>iPhone (Safari):</b> toca Compartir y luego "Agregar a pantalla de inicio".<br><b>Android (Chrome):</b> toca los tres puntos y luego "Instalar app".</p>' +
        '<p style="margin:0 0 10px;color:#6B5F70">Tienes estos pasos siempre en Ajustes.</p>' +
        '<button type="button" id="itipok" style="background:#B3224F;color:#fff;border:0;border-radius:99px;padding:.5em 1.2em;font-weight:600;cursor:pointer">Entendido</button>';
      document.body.appendChild(d);
      document.getElementById("itipok").onclick = function () { try { localStorage.setItem("dulcia_tip", "1"); } catch (e) {} d.remove(); };
    } catch (e) {}
  }
  async function afterLogin(session) {
    window.USER_EMAIL = (session && session.user && session.user.email) || "";
    try { var ad = await sb.rpc("es_admin"); window.IS_ADMIN = !!(ad && ad.data); } catch (e) { window.IS_ADMIN = false; }
    var r = await sb.rpc("mi_cuenta");
    if (r.error) { show('<h1>Error</h1><p>' + msg(r.error) + '</p><button class="btn" onclick="location.reload()">Reintentar</button>'); return; }
    if (!r.data || !r.data.length) { showOnboard(); return; }
    if (!r.data[0].activo) { showPending(r.data[0]); return; }
    NEG = r.data[0].negocio_id; await enter();
  }
  async function doLogout() { try { await save(); } catch (e) {} await sb.auth.signOut(); location.reload(); }
  window.doLogout = doLogout;

  /* ---------- arranque ---------- */
  ["click", "change", "input", "submit"].forEach(function (ev) { document.addEventListener(ev, function () { scheduleSave(); }, false); });
  document.addEventListener("visibilitychange", function () { if (document.hidden && loaded) save(); });
  window.addEventListener("pagehide", function () { if (loaded) save(); });
  sb.auth.onAuthStateChange(function (ev) { if (ev === "PASSWORD_RECOVERY") showNewPass(); });
  (async function () {
    try {
      var s = await sb.auth.getSession();
      if (s.data && s.data.session && !/type=recovery/.test(location.hash)) await afterLogin(s.data.session);
      else if (!/type=recovery/.test(location.hash)) showAuth("in");
    } catch (e) { showAuth("in"); note(msg(e)); }
  })();
})();
