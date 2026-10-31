(function () {
  "use strict";

  const { LINES, STATIONS, PLACES, DAYS, NOTES, NETWORK, S7_PATH } = window;
  const TZ = "Europe/Vienna";
  const MIN_PER_STOP = { metro: 1.8, tram: 2.2 };
  const FLAG_LABEL = { fix: "Correzione", check: "Da verificare", opt: "Ottimizzato", tip: "Consiglio" };

  /* ---------------- geometry helpers ---------------- */
  const loc = (key) => {
    const p = STATIONS[key] || PLACES[key];
    if (!p) throw new Error("Luogo sconosciuto: " + key);
    return p;
  };
  const d2 = (a, b) => {
    const kx = Math.cos((48.2 * Math.PI) / 180);
    const dx = (a[1] - b[1]) * kx, dy = a[0] - b[0];
    return dx * dx + dy * dy;
  };
  const nearest = (arr, ll) => {
    let best = 0, bd = Infinity;
    arr.forEach((p, i) => { const d = d2(p, ll); if (d < bd) { bd = d; best = i; } });
    return best;
  };
  const slice = (path, a, b) => {
    const i = nearest(path, a), j = nearest(path, b);
    const seg = i <= j ? path.slice(i, j + 1) : path.slice(j, i + 1).reverse();
    return [a, ...seg, b];
  };
  const linePath = (line) => (line === "S7" ? S7_PATH : NETWORK[line] && NETWORK[line].path);

  function legGeometry(leg) {
    const a = loc(leg.from).ll, b = loc(leg.to).ll;
    const path = linePath(leg.line);
    if (leg.line === "walk" || !path) return [a, b];
    return slice(path, a, b);
  }

  function legStops(leg) {
    const net = NETWORK[leg.line];
    if (!net) return null;
    const i = nearest(net.stops, loc(leg.from).ll), j = nearest(net.stops, loc(leg.to).ll);
    return Math.abs(i - j);
  }

  function legMinutes(leg) {
    if (leg.min) return leg.min;
    const n = legStops(leg);
    if (n == null) return null;
    return Math.max(2, Math.round(n * (MIN_PER_STOP[LINES[leg.line].kind] || 2)));
  }

  /* ---------------- time helpers ---------------- */
  function viennaNow() {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(new Date());
    const g = (t) => parts.find((p) => p.type === t).value;
    return { date: `${g("year")}-${g("month")}-${g("day")}`, mins: +g("hour") * 60 + +g("minute") };
  }
  const toMins = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };

  /* ---------------- state ---------------- */
  const state = {
    day: null,
    variant: localStorage.getItem("vienna.variant") || "opt",
    selected: null,
    hiddenLines: new Set(),
  };

  const visibleSteps = (day) =>
    day.steps.filter((s) => !s.variant || s.variant === state.variant);

  /* ---------------- map ---------------- */
  const map = L.map("map", { zoomControl: false, attributionControl: true, maxZoom: 19 })
    .setView([48.205, 16.37], 13);
  L.control.zoom({ position: "bottomright" }).addTo(map);
  // OSM standard in scala di grigi (filtro CSS sul pane delle tile): etichette leggibili a ogni zoom.
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  map.createPane("network"); map.getPane("network").style.zIndex = 390;
  map.createPane("legs"); map.getPane("legs").style.zIndex = 410;
  map.createPane("legsTop"); map.getPane("legsTop").style.zIndex = 420;

  const networkLayers = {};
  ["U1", "U3", "U4", "U6", "D", "37", "S7"].forEach((ln) => {
    const path = linePath(ln);
    if (!path) return;
    const cfg = LINES[ln];
    networkLayers[ln] = L.polyline(path, {
      pane: "network", color: cfg.color, weight: cfg.kind === "tram" ? 2.5 : 3.5, opacity: 0.22,
      dashArray: ln === "S7" ? "8 5" : null, interactive: false,
    }).addTo(map);
  });

  let dayLayer = L.layerGroup().addTo(map);
  let stepLayers = [];   // per visible step: {lines: [...], marker, bounds}
  let meMarker = null;

  function drawDay() {
    dayLayer.clearLayers();
    stepLayers = [];
    const steps = visibleSteps(state.day);
    const placeMarkers = new Map();
    const stationMarkers = new Map();
    let n = 0;

    steps.forEach((step, si) => {
      const lines = [];
      const pts = [];
      (step.legs || []).forEach((leg) => {
        const geom = legGeometry(leg);
        const cfg = LINES[leg.line];
        pts.push(...geom);
        const casing = cfg.kind === "walk" ? null : L.polyline(geom, {
          pane: "legs", color: "#fff", weight: 8, opacity: 0.9, interactive: false, lineCap: "round",
        }).addTo(dayLayer);
        const pl = L.polyline(geom, {
          pane: "legs",
          color: cfg.color,
          weight: cfg.kind === "walk" ? 3 : 5,
          opacity: 0.9,
          dashArray: cfg.kind === "walk" ? "2 7" : cfg.kind === "rail" ? "10 6" : null,
          lineCap: "round",
        }).addTo(dayLayer);
        pl.bindTooltip(legTooltip(leg), { sticky: true, className: "tt" });
        pl.on("click", () => select(si, { fromMap: true }));
        lines.push({ pl, casing, kind: cfg.kind });

        if (cfg.kind !== "walk") {
          [leg.from, leg.to].forEach((k) => {
            if (!STATIONS[k] || stationMarkers.has(k)) return;
            const m = L.marker(STATIONS[k].ll, {
              icon: L.divIcon({ className: "", html: '<div class="station"></div>', iconSize: [10, 10], iconAnchor: [5, 5] }),
              pane: "markerPane", zIndexOffset: -100,
            }).bindTooltip(`<b>${STATIONS[k].name}</b>`, { className: "tt", direction: "top", offset: [0, -6] });
            m.addTo(dayLayer);
            stationMarkers.set(k, m);
          });
        }
      });

      const p = loc(step.place);
      pts.push(p.ll);
      let marker = placeMarkers.get(step.place);
      const isHotel = step.place === "hotel";
      if (!marker) {
        const label = isHotel ? "H" : String(++n);
        marker = L.marker(p.ll, {
          icon: L.divIcon({ className: "", html: `<div class="pin${isHotel ? " hotel" : ""}">${label}</div>`, iconSize: [24, 24], iconAnchor: [12, 12] }),
          zIndexOffset: 500,
        }).addTo(dayLayer);
        marker._steps = [];
        marker.on("click", () => select(marker._steps[0], { fromMap: true }));
        placeMarkers.set(step.place, marker);
        if (stationMarkers.has(step.place)) dayLayer.removeLayer(stationMarkers.get(step.place));
      }
      marker._steps.push(si);
      marker.bindTooltip(
        `<b>${p.name}</b>${p.addr ? `<br>${p.addr}` : ""}<br>` +
          marker._steps.map((i) => `${steps[i].time} · ${steps[i].title}`).join("<br>"),
        { className: "tt", direction: "top", offset: [0, -12] }
      );
      stepLayers.push({ lines, marker, pts, bounds: L.latLngBounds(pts) });
    });

    // attach numeric labels for the timeline
    steps.forEach((s, i) => {
      const el = stepLayers[i].marker.options.icon.options.html.match(/>([^<]+)</);
      s._label = el ? el[1] : "";
    });
  }

  function legTooltip(leg) {
    const cfg = LINES[leg.line];
    if (cfg.kind === "walk") return `A piedi · ${leg.min} min<br>${loc(leg.from).name} → ${loc(leg.to).name}`;
    const n = legStops(leg);
    return `<b>${cfg.label}</b> direzione ${leg.dir}<br>${loc(leg.from).name} → ${loc(leg.to).name}` +
      (n ? `<br>${n} ${n === 1 ? "fermata" : "fermate"}` : "");
  }

  function fitDay(animate = true) {
    const b = L.latLngBounds([]);
    // vista d'insieme sulla città: l'aeroporto (lng > 16.45) si vede selezionando la tappa
    stepLayers.forEach((s) => s.pts.forEach((p) => { if (p[1] < 16.45) b.extend(p); }));
    if (!b.isValid()) stepLayers.forEach((s) => b.extend(s.bounds));
    if (b.isValid()) map.fitBounds(b, { padding: [40, 40], animate, maxZoom: 15 });
  }

  /* ---------------- rendering ---------------- */
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function badge(line) {
    const cfg = LINES[line];
    if (cfg.kind === "walk") return `<span class="badge walk">PIEDI</span>`;
    return `<span class="badge ${cfg.kind}" style="background:${cfg.color}">${cfg.label}</span>`;
  }

  function legHTML(leg) {
    const cfg = LINES[leg.line];
    const from = esc(loc(leg.from).name), to = esc(loc(leg.to).name);
    if (cfg.kind === "walk") {
      return `<div class="leg">${badge("walk")}<div class="leg-text">${leg.min} min <span class="meta">· ${from} → ${to}</span></div></div>`;
    }
    const n = legStops(leg);
    const mins = legMinutes(leg);
    const meta = [n ? `${n} ${n === 1 ? "fermata" : "fermate"}` : null, mins ? `~${mins} min` : null].filter(Boolean).join(" · ");
    return `<div class="leg">${badge(leg.line)}<div class="leg-text">` +
      `<span class="dir">dir. <b>${esc(leg.dir)}</b></span> → scendere a <b>${to}</b>` +
      `<br><span class="meta">da ${from}${meta ? " · " + meta : ""}</span></div></div>`;
  }

  function stepHTML(step, i, nowIdx) {
    const p = loc(step.place);
    const legs = step.legs || [];
    const flags = (step.flags || []).map((f) =>
      `<div class="flag ${f.type}"><strong>${FLAG_LABEL[f.type]}</strong>${esc(f.text)}</div>`).join("");
    return `<li class="step${i === nowIdx ? " now" : ""}" data-i="${i}" tabindex="0">
      <div class="time">${step.timeApprox ? '<span class="approx">~</span>' : ""}${step.time}${step.end ? `<span class="end">${step.end}</span>` : ""}</div>
      <div class="body">
        <span class="dot${step.place === "hotel" ? " hotel" : ""}"></span>
        <div class="title"><span class="idx">${esc(step._label || "")}</span>${esc(step.title)}</div>
        <div class="place">${esc(p.name)}${p.addr ? " · " + esc(p.addr) : ""}</div>
        ${step.detail ? `<div class="detail">${esc(step.detail)}</div>` : ""}
        ${step.depart ? `<span class="depart">Partenza ${step.depart}</span>` : ""}
        ${legs.length ? `<div class="route">${legs.map(legHTML).join("")}</div>` : ""}
        ${flags}
      </div>
    </li>`;
  }

  function dayStats(steps) {
    let rides = 0, walk = 0, transit = 0;
    const used = new Set();
    steps.forEach((s) => (s.legs || []).forEach((l) => {
      if (l.line === "walk") walk += l.min || 0;
      else { rides++; used.add(l.line); transit += legMinutes(l) || 0; }
    }));
    const lines = [...used].map((l) => LINES[l].label).join(", ");
    return `${steps.length} tappe · ${rides} corse${lines ? ` (${lines})` : ""} · ~${Math.round(walk / 5) * 5} min a piedi · ~${Math.round(transit / 5) * 5} min sui mezzi`;
  }

  function renderTabs() {
    $("day-tabs").innerHTML = DAYS.map((d) =>
      `<button role="tab" data-day="${d.id}" aria-selected="${d === state.day}">
        <span class="d-tab">${d.tab} dic</span><span class="d-sub">${esc(d.title)}</span></button>`).join("");
  }

  function renderDay() {
    const day = state.day;
    const steps = visibleSteps(day);
    drawDay();

    let nowIdx = -1;
    const now = viennaNow();
    if (now.date === day.date) {
      steps.forEach((s, i) => { if (toMins(s.depart || s.time) <= now.mins) nowIdx = i; });
    }

    $("day-title").textContent = day.title;
    $("day-stats").textContent = dayStats(steps);
    $("variant-switch").hidden = !day.hasVariants;
    document.querySelectorAll(".seg button").forEach((b) =>
      b.setAttribute("aria-checked", String(b.dataset.variant === state.variant)));
    $("timeline").innerHTML = steps.map((s, i) => stepHTML(s, i, nowIdx)).join("");
    renderTabs();

    state.selected = null;
    $("leg-card").hidden = true;
    if (nowIdx >= 0) select(nowIdx, { scroll: true });
    else fitDay(false);
  }

  function select(i, opts = {}) {
    if (state.selected === i && !opts.force) {   // toggle off
      state.selected = null;
      applyHighlight();
      $("leg-card").hidden = true;
      fitDay();
      return;
    }
    state.selected = i;
    applyHighlight();
    const sl = stepLayers[i];
    if (sl && sl.bounds.isValid()) {
      const wide = window.matchMedia("(min-width: 861px)").matches && (visibleSteps(state.day)[i].legs || []).length;
      map.fitBounds(sl.bounds, {
        paddingTopLeft: wide ? [340, 60] : [40, 40], paddingBottomRight: [60, 70], maxZoom: 17,
      });
    }
    const li = document.querySelector(`.step[data-i="${i}"]`);
    if (li && (opts.fromMap || opts.scroll)) li.scrollIntoView({ block: "center", behavior: opts.scroll ? "auto" : "smooth" });
    renderLegCard(i);
  }

  function applyHighlight() {
    const sel = state.selected;
    document.querySelectorAll(".step").forEach((el) =>
      el.classList.toggle("active", +el.dataset.i === sel));
    stepLayers.forEach((s, i) => {
      const on = sel == null || i === sel;
      s.lines.forEach(({ pl, casing, kind }) => {
        pl.setStyle({ opacity: on ? 0.95 : 0.15, weight: kind === "walk" ? 3 : sel === i ? 6 : 5 });
        if (casing) casing.setStyle({ opacity: on ? 0.9 : 0 });
        if (on && sel != null) { if (casing) casing.bringToFront(); pl.bringToFront(); }
      });
    });
    const selMarker = sel != null ? stepLayers[sel].marker : null;
    stepLayers.forEach((s) => {
      const el = s.marker.getElement && s.marker.getElement();
      if (!el) return;
      const pin = el.querySelector(".pin");
      pin.classList.toggle("sel", s.marker === selMarker);
      pin.classList.toggle("dim", sel != null && s.marker !== selMarker && !pin.classList.contains("hotel"));
    });
  }

  function renderLegCard(i) {
    const step = visibleSteps(state.day)[i];
    const card = $("leg-card");
    if (!step || !(step.legs || []).length) { card.hidden = true; return; }
    card.innerHTML = `<div class="lc-time">${step.depart ? "Partenza " + step.depart + " · " : ""}arrivo ${step.timeApprox ? "~" : ""}${step.time}</div>
      <div class="lc-title">${esc(step.title)}</div>
      <div class="route">${step.legs.map(legHTML).join("")}</div>`;
    card.hidden = false;
  }

  function renderNotes() {
    $("notes").innerHTML = NOTES.map((n) =>
      `<li><div class="n-head"><span class="n-type ${n.type}">${FLAG_LABEL[n.type]}</span><span class="n-title">${esc(n.title)}</span></div><p>${esc(n.text)}</p></li>`).join("");
  }

  function renderLegend() {
    const order = ["S7", "U1", "U3", "U4", "U6", "D", "37", "walk"];
    $("legend").innerHTML = order.map((ln) => {
      const c = LINES[ln];
      const label = ln === "D" || ln === "37" ? `Tram ${ln}` : c.label;
      return `<button class="lg" data-line="${ln}" title="${ln === "walk" ? "" : "Mostra/nascondi la linea"}">
        <span class="sw ${c.kind}" style="background:${c.kind === "walk" ? "none" : c.color};color:${c.color}"></span>${label}</button>`;
    }).join("");
  }

  function renderCountdown() {
    const start = new Date("2026-12-21T07:00:00+01:00");
    const end = new Date("2026-12-23T09:45:00+01:00");
    const now = new Date();
    let label = "Partenza", value;
    if (now < start) {
      const days = Math.ceil((start - now) / 86400000);
      value = days === 1 ? "domani" : `tra ${days} giorni`;
    } else if (now <= end) { label = "Stato"; value = "In viaggio"; }
    else { label = "Stato"; value = "Viaggio concluso"; }
    $("cd-label").textContent = label;
    $("cd-value").textContent = value;
  }

  /* ---------------- events ---------------- */
  $("day-tabs").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-day]");
    if (!b) return;
    setDay(b.dataset.day);
  });
  $("day-tabs").addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = DAYS.indexOf(state.day) + (e.key === "ArrowRight" ? 1 : -1);
    if (DAYS[i]) { setDay(DAYS[i].id); document.querySelector(`[data-day="${DAYS[i].id}"]`).focus(); }
  });
  document.querySelector(".seg").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-variant]");
    if (!b || b.dataset.variant === state.variant) return;
    state.variant = b.dataset.variant;
    localStorage.setItem("vienna.variant", state.variant);
    renderDay();
  });
  $("timeline").addEventListener("click", (e) => {
    const li = e.target.closest(".step");
    if (li) select(+li.dataset.i);
  });
  $("timeline").addEventListener("keydown", (e) => {
    const li = e.target.closest(".step");
    if (!li) return;
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(+li.dataset.i); }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = e.key === "ArrowDown" ? li.nextElementSibling : li.previousElementSibling;
      if (next) { next.focus(); select(+next.dataset.i, { force: true }); }
    }
  });
  $("legend").addEventListener("click", (e) => {
    const b = e.target.closest(".lg");
    if (!b || !networkLayers[b.dataset.line]) return;
    const ln = b.dataset.line;
    if (state.hiddenLines.has(ln)) { state.hiddenLines.delete(ln); networkLayers[ln].addTo(map); }
    else { state.hiddenLines.add(ln); map.removeLayer(networkLayers[ln]); }
    b.classList.toggle("off", state.hiddenLines.has(ln));
  });
  $("btn-fit").addEventListener("click", () => {
    state.selected = null; applyHighlight(); $("leg-card").hidden = true; fitDay();
  });
  $("btn-locate").addEventListener("click", (e) => {
    const btn = e.currentTarget;
    if (!navigator.geolocation) { btn.textContent = "Non disponibile"; return; }
    btn.textContent = "Ricerca…";
    navigator.geolocation.getCurrentPosition((pos) => {
      const ll = [pos.coords.latitude, pos.coords.longitude];
      if (meMarker) map.removeLayer(meMarker);
      meMarker = L.marker(ll, {
        icon: L.divIcon({ className: "", html: '<div class="me"></div>', iconSize: [14, 14], iconAnchor: [7, 7] }),
        zIndexOffset: 1000,
      }).addTo(map).bindTooltip("Sei qui", { className: "tt" });
      map.setView(ll, Math.max(map.getZoom(), 15));
      btn.textContent = "La mia posizione";
      btn.setAttribute("aria-pressed", "true");
    }, () => { btn.textContent = "Posizione negata"; setTimeout(() => (btn.textContent = "La mia posizione"), 2500); },
    { enableHighAccuracy: true, timeout: 10000 });
  });
  window.addEventListener("hashchange", () => {
    const d = DAYS.find((x) => "#" + x.id === location.hash);
    if (d && d !== state.day) { state.day = d; renderDay(); }
  });

  function setDay(id) {
    const d = DAYS.find((x) => x.id === id);
    if (!d || d === state.day) return;
    state.day = d;
    history.replaceState(null, "", "#" + id);
    renderDay();
    document.querySelector(".panel").scrollTop = 0;
  }

  /* ---------------- init ---------------- */
  (function init() {
    const now = viennaNow();
    state.day = DAYS.find((d) => "#" + d.id === location.hash)
      || DAYS.find((d) => d.date === now.date)
      || DAYS[0];
    renderLegend();
    renderNotes();
    renderCountdown();
    renderDay();
    setInterval(renderCountdown, 60 * 60 * 1000);
  })();
})();
