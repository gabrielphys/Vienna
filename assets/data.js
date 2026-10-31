/*
 * Itinerario Vienna 21–23.12.2026.
 * Fonte: documento "Documento1" (programma giorno per giorno), chat del 22:53
 * (City Locker prima del Museo di Sissi) e calendario (voli FR8193 / FR214, hotel).
 * Coordinate: OpenStreetMap / Nominatim. Le fermate vengono agganciate
 * automaticamente alla fermata OSM più vicina della linea (vedi app.js).
 */

window.LINES = {
  U1: { label: "U1", color: "#E3000F", kind: "metro", name: "U1 · rossa" },
  U3: { label: "U3", color: "#EE7D00", kind: "metro", name: "U3 · arancione" },
  U4: { label: "U4", color: "#319F49", kind: "metro", name: "U4 · verde" },
  U6: { label: "U6", color: "#9D6830", kind: "metro", name: "U6 · marrone" },
  D:  { label: "D",  color: "#B4122A", kind: "tram",  name: "Tram D" },
  37: { label: "37", color: "#B4122A", kind: "tram",  name: "Tram 37" },
  S7: { label: "S7", color: "#0078C1", kind: "rail",  name: "S-Bahn S7" },
  walk: { label: "A piedi", color: "#3b3b3b", kind: "walk", name: "A piedi" },
};

/* S7 aeroporto → centro: tracciato schematico (non presente nell'export OSM). */
window.S7_PATH = [
  [48.12105, 16.56325], [48.1275, 16.5480], [48.1360, 16.5090], [48.14185, 16.47885],
  [48.1563, 16.4590], [48.1663, 16.4365], [48.17025, 16.42045], [48.1780, 16.4040],
  [48.1880, 16.3990], [48.19585, 16.38785], [48.20652, 16.38485], [48.2125, 16.3880],
  [48.21977, 16.39308],
];

window.STATIONS = {
  flughafen:     { name: "Flughafen Wien", ll: [48.12105, 16.56325] },
  wienmitte:     { name: "Wien Mitte / Landstraße", ll: [48.20652, 16.38485] },
  praterstern:   { name: "Praterstern", ll: [48.21896, 16.39208] },
  stephansplatz: { name: "Stephansplatz", ll: [48.20826, 16.37198] },
  herrengasse:   { name: "Herrengasse", ll: [48.20932, 16.36580] },
  volkstheater:  { name: "Volkstheater", ll: [48.20520, 16.35870] },
  neubaugasse:   { name: "Neubaugasse", ll: [48.19940, 16.35180] },
  westbahnhof:   { name: "Westbahnhof", ll: [48.19660, 16.33830] },
  gumpendorfer:  { name: "Gumpendorfer Straße", ll: [48.19030, 16.33720] },
  nussdorfer:    { name: "Nußdorfer Straße", ll: [48.23140, 16.35270] },
  nussdorfer37:  { name: "Nußdorfer Straße (tram)", ll: [48.23131, 16.35439] },
  glatzgasse:    { name: "Glatzgasse (Döblinger Hauptstr.)", ll: [48.23301, 16.35340] },
  karlsplatz:    { name: "Karlsplatz", ll: [48.20030, 16.36950] },
  schoenbrunn:   { name: "Schönbrunn", ll: [48.18620, 16.31950] },
  schwarzenbergplatz: { name: "Schwarzenbergplatz", ll: [48.20110, 16.37466] },
  schlossbelvedere:   { name: "Schloss Belvedere", ll: [48.19173, 16.37930] },
};

window.PLACES = {
  airport:      { name: "Aeroporto di Vienna (VIE)", ll: [48.12030, 16.56230], kind: "flight" },
  hotel:        { name: "Leonardo Hotel Vienna City West", addr: "Graumanngasse 3–5, 1150 Wien", ll: [48.18851, 16.33802], kind: "hotel" },
  locker:       { name: "City Locker Stephansplatz", addr: "posizione indicativa: ~2 min dall'uscita U Stephansplatz", ll: [48.20775, 16.37285], kind: "service", approx: true },
  sisi:         { name: "Sisi Museum · Hofburg", addr: "Michaelerkuppel, 1010 Wien", ll: [48.20790, 16.36640], kind: "visit" },
  goldenfrites: { name: "Golden Frites", addr: "Neubaugasse 48–50, 1070 Wien", ll: [48.20233, 16.34921], kind: "food" },
  rathausplatz: { name: "Christkindlmarkt Rathausplatz", addr: "Rathausplatz, 1010 Wien", ll: [48.21070, 16.35900], kind: "visit" },
  mozarthaus:   { name: "Mozarthaus Vienna", addr: "Domgasse 5, 1010 Wien", ll: [48.20770, 16.37550], kind: "visit" },
  swarovski:    { name: "Swarovski Kärntner Straße", addr: "Kärntner Straße 24, 1010 Wien", ll: [48.20550, 16.37096], kind: "visit" },
  fischerbraeu: { name: "Fischerbräu", addr: "Billrothstraße 17, 1190 Wien", ll: [48.23471, 16.35070], kind: "food" },
  sperl:        { name: "Café Sperl", addr: "Gumpendorfer Straße 11, 1060 Wien", ll: [48.19920, 16.36040], kind: "food" },
  stephansdom:  { name: "Stephansdom", addr: "Stephansplatz 3, 1010 Wien", ll: [48.20849, 16.37313], kind: "visit" },
  belvedere:    { name: "Belvedere Superiore", addr: "Prinz-Eugen-Straße 27, 1030 Wien", ll: [48.19154, 16.38089], kind: "visit" },
  muehlbauer:   { name: "Mühlbauer (souvenir)", addr: "Seilergasse 10, 1010 Wien", ll: [48.20723, 16.37064], kind: "visit" },
  library:      { name: "Biblioteca Nazionale · Prunksaal", addr: "Josefsplatz 1, 1010 Wien", ll: [48.20620, 16.36670], kind: "visit" },
  amhof:        { name: "Mercatino Am Hof", addr: "Am Hof, 1010 Wien", ll: [48.21111, 16.36766], kind: "food" },
  schoenbrunn:  { name: "Castello di Schönbrunn", addr: "Schönbrunner Schloßstraße 47, 1130 Wien", ll: [48.18499, 16.31157], kind: "visit" },
  prater:       { name: "Prater · altalena", addr: "Wurstelprater, 1020 Wien", ll: [48.21561, 16.39958], kind: "visit" },
  annakirche:   { name: "Chiesa di Sant'Anna", addr: "Annagasse 3b, 1010 Wien", ll: [48.20470, 16.37130], kind: "visit" },
  figlmueller:  { name: "Figlmüller", addr: "Wollzeile 5, 1010 Wien", ll: [48.20890, 16.37460], kind: "food" },
};

/*
 * Ogni tappa: time, title, place, legs (spostamento PER ARRIVARE alla tappa),
 * flags: [{type: "fix"|"check"|"opt"|"tip", text}].
 * Leg: {line, from, to, dir} per i mezzi, {line:"walk", from, to, min} a piedi.
 * from/to: chiave di STATIONS o PLACES.
 */
window.DAYS = [
  {
    id: "d1",
    date: "2026-12-21",
    tab: "Lun 21",
    title: "Arrivo, Hofburg e mercatini",
    hasVariants: true,
    steps: [
      {
        time: "08:05", title: "Atterraggio a Vienna", place: "airport",
        detail: "Volo FR8193 Bergamo → Vienna.",
        legs: [],
      },
      /* --- Variante ottimizzata (chat 22:53): locker prima, poi museo --- */
      {
        variant: "opt",
        time: "08:34", end: "09:10", title: "Treno per il centro", place: "stephansplatz",
        detail: "S7 fino a Wien Mitte, poi U3 diretta a Stephansplatz: nessun altro cambio.",
        legs: [
          { line: "walk", from: "airport", to: "flughafen", min: 5 },
          { line: "S7", from: "flughafen", to: "wienmitte", dir: "Wien Floridsdorf", min: 25 },
          { line: "U3", from: "wienmitte", to: "stephansplatz", dir: "Ottakring" },
        ],
        flags: [
          { type: "check", text: "Il documento indica «8.34 → 8.48 metro U1»: con la S7 fino al centro servono circa 25 minuti, quindi alle 8:48 sarete ancora in treno. Controllate l'orario su Wien Mobil o ÖBB Scotty." },
        ],
      },
      {
        variant: "opt",
        time: "09:12", title: "Zaini al City Locker", place: "locker",
        detail: "Circa 2 minuti dalla fermata Stephansplatz.",
        legs: [{ line: "walk", from: "stephansplatz", to: "locker", min: 2 }],
        flags: [{ type: "opt", text: "Andando subito al locker non dovete tornare indietro dal museo: risparmiate circa 5 minuti e il cambio a Herrengasse." }],
      },
      {
        variant: "opt",
        time: "09:30", end: "11:45", title: "Museo di Sissi", place: "sisi",
        detail: "Ingresso 9:30–9:45. Biglietto con fascia oraria.",
        legs: [{ line: "walk", from: "locker", to: "sisi", min: 9 }],
      },
      /* --- Variante originale (documento) --- */
      {
        variant: "orig",
        time: "08:34", end: "09:15", title: "Treno + metro per Herrengasse", place: "herrengasse",
        detail: "S-Bahn, poi U1 fino a Stephansplatz e U3 direzione Ottakring fino a Herrengasse.",
        legs: [
          { line: "walk", from: "airport", to: "flughafen", min: 5 },
          { line: "S7", from: "flughafen", to: "praterstern", dir: "Wien Floridsdorf", min: 28 },
          { line: "U1", from: "praterstern", to: "stephansplatz", dir: "Oberlaa" },
          { line: "U3", from: "stephansplatz", to: "herrengasse", dir: "Ottakring" },
        ],
      },
      {
        variant: "orig",
        time: "09:20", title: "Zaini al City Locker", place: "locker",
        detail: "8–10 minuti a piedi dal museo: si corre.",
        legs: [{ line: "walk", from: "herrengasse", to: "locker", min: 9 }],
        flags: [{ type: "check", text: "In questa versione si fa avanti e indietro tra Herrengasse, Stephansplatz e la Hofburg." }],
      },
      {
        variant: "orig",
        time: "09:30", end: "11:45", title: "Museo di Sissi", place: "sisi",
        detail: "Ingresso 9:30–9:45.",
        legs: [{ line: "walk", from: "locker", to: "sisi", min: 9 }],
      },
      /* --- comune --- */
      {
        time: "12:20", title: "Pranzo da Golden Frites", place: "goldenfrites",
        detail: "Patatine olandesi e krokets.",
        legs: [
          { line: "walk", from: "sisi", to: "herrengasse", min: 3 },
          { line: "U3", from: "herrengasse", to: "neubaugasse", dir: "Ottakring" },
          { line: "walk", from: "neubaugasse", to: "goldenfrites", min: 6 },
        ],
        flags: [{ type: "tip", text: "Il negozio è a Neubaugasse 48–50, all'estremità nord della via: circa 6 minuti dall'uscita della U3." }],
      },
      {
        time: "13:30", end: "15:00", title: "Mercatini di Natale", place: "rathausplatz",
        detail: "Christkindlmarkt sulla Rathausplatz.",
        legs: [
          { line: "walk", from: "goldenfrites", to: "neubaugasse", min: 6 },
          { line: "U3", from: "neubaugasse", to: "volkstheater", dir: "Simmering" },
          { line: "walk", from: "volkstheater", to: "rathausplatz", min: 7 },
        ],
        flags: [{ type: "tip", text: "Uscite verso il Ring e camminate fino alla Rathausplatz. Da Golden Frites potete anche andare a piedi (circa 12 minuti) passando per il mercatino di Spittelberg." }],
      },
      {
        time: "15:30", end: "16:30", title: "Casa di Mozart", place: "mozarthaus",
        detail: "Passeggiata attraverso il centro storico.",
        legs: [{ line: "walk", from: "rathausplatz", to: "mozarthaus", min: 25 }],
      },
      {
        time: "16:45", title: "Swarovski · esposizione", place: "swarovski",
        detail: "Ingresso gratuito.",
        legs: [{ line: "walk", from: "mozarthaus", to: "swarovski", min: 5 }],
      },
      {
        time: "17:30", title: "Ritiro zaini", place: "locker",
        legs: [{ line: "walk", from: "swarovski", to: "locker", min: 6 }],
      },
      {
        time: "17:45", title: "In hotel per prepararsi", place: "hotel",
        detail: "Check-in al Leonardo Hotel Vienna City West.",
        legs: [
          { line: "walk", from: "locker", to: "stephansplatz", min: 2 },
          { line: "U3", from: "stephansplatz", to: "westbahnhof", dir: "Ottakring" },
          { line: "U6", from: "westbahnhof", to: "gumpendorfer", dir: "Siebenhirten" },
          { line: "walk", from: "gumpendorfer", to: "hotel", min: 4 },
        ],
      },
      {
        time: "20:30", title: "Cena da Fischerbräu", place: "fischerbraeu",
        detail: "Partenza dall'hotel alle 19:40. Da provare: gli Spätzle.",
        depart: "19:40",
        legs: [
          { line: "walk", from: "hotel", to: "gumpendorfer", min: 4 },
          { line: "U6", from: "gumpendorfer", to: "nussdorfer", dir: "Floridsdorf" },
          { line: "walk", from: "nussdorfer", to: "nussdorfer37", min: 2 },
          { line: "37", from: "nussdorfer37", to: "glatzgasse", dir: "Hohe Warte" },
          { line: "walk", from: "glatzgasse", to: "fischerbraeu", min: 3 },
        ],
        flags: [{ type: "check", text: "«Döblinger Hauptstraße» è la via, non il nome della fermata: con il 37 scendete alla prima fermata, Glatzgasse. Il locale è a circa 3 minuti a piedi." }],
      },
      {
        time: "22:30", title: "Rientro in hotel", place: "hotel",
        legs: [
          { line: "walk", from: "fischerbraeu", to: "glatzgasse", min: 3 },
          { line: "37", from: "glatzgasse", to: "nussdorfer37", dir: "Schottentor" },
          { line: "walk", from: "nussdorfer37", to: "nussdorfer", min: 2 },
          { line: "U6", from: "nussdorfer", to: "gumpendorfer", dir: "Siebenhirten" },
          { line: "walk", from: "gumpendorfer", to: "hotel", min: 4 },
        ],
        timeApprox: true,
      },
    ],
  },
  {
    id: "d2",
    date: "2026-12-22",
    tab: "Mar 22",
    title: "Belvedere, Schönbrunn, Prater, concerto",
    steps: [
      {
        time: "08:00", title: "Colazione al Café Sperl", place: "sperl",
        detail: "Da provare: la Sachertorte.",
        legs: [{ line: "walk", from: "hotel", to: "sperl", min: 25 }],
        flags: [{ type: "check", text: "Il documento indica 15 minuti, ma dall'hotel sono circa 2 km: contate 25 minuti e uscite alle 7:35." }],
      },
      {
        time: "09:30", title: "Duomo di Santo Stefano", place: "stephansdom",
        detail: "Passeggiata a piedi nelle vie dello shopping.",
        legs: [{ line: "walk", from: "sperl", to: "stephansdom", min: 25 }],
      },
      {
        time: "10:30", end: "11:30", title: "Belvedere Superiore", place: "belvedere",
        detail: "Circa 20 minuti dal Duomo: partite verso le 10:00. Il tram vi lascia davanti al palazzo.",
        depart: "10:00",
        legs: [
          { line: "walk", from: "stephansdom", to: "schwarzenbergplatz", min: 10 },
          { line: "D", from: "schwarzenbergplatz", to: "schlossbelvedere", dir: "Absberggasse" },
          { line: "walk", from: "schlossbelvedere", to: "belvedere", min: 3 },
        ],
        flags: [{ type: "fix", text: "Correzione: verso il Belvedere il tram D va preso in direzione Absberggasse (o Hauptbahnhof), non Nußdorf. Le direzioni nel documento sono invertite." }],
      },
      {
        time: "12:00", end: "13:00", title: "Souvenir da Mühlbauer", place: "muehlbauer",
        detail: "Se c'è tempo: caffè con orsetto.",
        legs: [
          { line: "walk", from: "belvedere", to: "schlossbelvedere", min: 3 },
          { line: "D", from: "schlossbelvedere", to: "schwarzenbergplatz", dir: "Nußdorf" },
          { line: "walk", from: "schwarzenbergplatz", to: "muehlbauer", min: 10 },
        ],
        flags: [{ type: "fix", text: "Correzione: per il ritorno il tram D va preso in direzione Nußdorf, non Absberggasse." }],
      },
      {
        time: "13:10", end: "13:45", title: "Biblioteca Nazionale Austriaca", place: "library",
        detail: "Prunksaal, 5 minuti dal negozio.",
        legs: [{ line: "walk", from: "muehlbauer", to: "library", min: 5 }],
      },
      {
        time: "14:00", title: "Mercatino Am Hof", place: "amhof",
        detail: "Pranzo e vin brulé (da provare l'Uhudler).",
        legs: [{ line: "walk", from: "library", to: "amhof", min: 8 }],
      },
      {
        time: "15:30", title: "Giardini di Schönbrunn", place: "schoenbrunn",
        detail: "Residenza estiva degli Asburgo. Tramonto verso le 16:00.",
        legs: [
          { line: "walk", from: "amhof", to: "stephansplatz", min: 7 },
          { line: "U1", from: "stephansplatz", to: "karlsplatz", dir: "Oberlaa" },
          { line: "U4", from: "karlsplatz", to: "schoenbrunn", dir: "Hütteldorf" },
          { line: "walk", from: "schoenbrunn", to: "schoenbrunn_palace", min: 6 },
        ],
        flags: [{ type: "tip", text: "A metà pomeriggio c'è il mercatino davanti al castello. Il 21 dicembre il sole tramonta verso le 16:00." }],
      },
      {
        time: "17:00", title: "Prater · altalena", place: "prater",
        detail: "Circa 25 minuti di viaggio: lasciate Schönbrunn entro le 16:30.",
        depart: "16:30",
        legs: [
          { line: "walk", from: "schoenbrunn_palace", to: "schoenbrunn", min: 6 },
          { line: "U4", from: "schoenbrunn", to: "karlsplatz", dir: "Heiligenstadt" },
          { line: "U1", from: "karlsplatz", to: "praterstern", dir: "Leopoldau" },
          { line: "walk", from: "praterstern", to: "prater", min: 2 },
        ],
      },
      {
        time: "18:30", title: "Rientro in hotel", place: "hotel",
        detail: "Circa 35 minuti: lasciate il Prater verso le 17:50.",
        depart: "17:50",
        legs: [
          { line: "walk", from: "prater", to: "praterstern", min: 2 },
          { line: "U1", from: "praterstern", to: "stephansplatz", dir: "Oberlaa" },
          { line: "U3", from: "stephansplatz", to: "westbahnhof", dir: "Ottakring" },
          { line: "U6", from: "westbahnhof", to: "gumpendorfer", dir: "Siebenhirten" },
          { line: "walk", from: "gumpendorfer", to: "hotel", min: 4 },
        ],
      },
      {
        time: "20:15", title: "Concerto a Sant'Anna", place: "annakirche",
        detail: "Partenza dall'hotel alle 19:35.",
        depart: "19:35",
        legs: [
          { line: "walk", from: "hotel", to: "gumpendorfer", min: 4 },
          { line: "U6", from: "gumpendorfer", to: "westbahnhof", dir: "Floridsdorf" },
          { line: "U3", from: "westbahnhof", to: "stephansplatz", dir: "Simmering" },
          { line: "walk", from: "stephansplatz", to: "annakirche", min: 7 },
        ],
      },
      {
        time: "21:30", title: "Cena da Figlmüller", place: "figlmueller",
        detail: "8–10 minuti a piedi dalla chiesa.",
        legs: [{ line: "walk", from: "annakirche", to: "figlmueller", min: 9 }],
      },
      {
        time: "23:00", title: "Rientro in hotel", place: "hotel",
        timeApprox: true,
        legs: [
          { line: "walk", from: "figlmueller", to: "stephansplatz", min: 3 },
          { line: "U3", from: "stephansplatz", to: "westbahnhof", dir: "Ottakring" },
          { line: "U6", from: "westbahnhof", to: "gumpendorfer", dir: "Siebenhirten" },
          { line: "walk", from: "gumpendorfer", to: "hotel", min: 4 },
        ],
      },
    ],
  },
  {
    id: "d3",
    date: "2026-12-23",
    tab: "Mer 23",
    title: "Partenza",
    steps: [
      {
        time: "05:45", title: "Partenza dall'hotel", place: "hotel",
        detail: "Proposta: il programma non copre il ritorno. Il volo FR214 parte verso le 8:20 secondo il calendario.",
        legs: [],
        timeApprox: true,
        flags: [{ type: "check", text: "Confermate l'orario sulla carta d'imbarco. Mercoledì la metro riprende verso le 5:00." }],
      },
      {
        time: "06:40", title: "Aeroporto di Vienna", place: "airport",
        detail: "U6 fino a Westbahnhof, U3 fino a Wien Mitte, poi S7 per l'aeroporto. Circa 55 minuti in tutto.",
        timeApprox: true,
        legs: [
          { line: "walk", from: "hotel", to: "gumpendorfer", min: 4 },
          { line: "U6", from: "gumpendorfer", to: "westbahnhof", dir: "Floridsdorf" },
          { line: "U3", from: "westbahnhof", to: "wienmitte", dir: "Simmering" },
          { line: "S7", from: "wienmitte", to: "flughafen", dir: "Flughafen Wien", min: 25 },
          { line: "walk", from: "flughafen", to: "airport", min: 5 },
        ],
      },
      {
        time: "08:20", title: "Volo FR214 Vienna → Milano Malpensa", place: "airport",
        timeApprox: true,
        legs: [],
      },
    ],
  },
];

/* Luoghi aggiuntivi usati solo come estremi di percorso */
window.PLACES.schoenbrunn_palace = window.PLACES.schoenbrunn;

window.NOTES = [
  {
    type: "fix",
    title: "Tram D: direzioni invertite (22.12)",
    text: "Per andare da Schwarzenbergplatz al Belvedere prendete il D in direzione Absberggasse (alcune corse indicano Hauptbahnhof). Per tornare verso il Ring, direzione Nußdorf.",
  },
  {
    type: "opt",
    title: "Prima il City Locker, poi Sissi (21.12)",
    text: "Dalla S7 cambiate a Wien Mitte con la U3 diretta a Stephansplatz. Lasciate gli zaini (2 minuti dalla fermata) e andate a piedi alla Hofburg (8–10 minuti). Così niente avanti e indietro. Nella mappa potete confrontare le due versioni.",
  },
  {
    type: "check",
    title: "Orario del treno dall'aeroporto",
    text: "«8.34 → 8.48» non è compatibile con la S7 (circa 25 minuti fino a Wien Mitte). Il CAT impiega 16 minuti ma costa di più e serve un biglietto a parte.",
  },
  {
    type: "tip",
    title: "Biglietti",
    text: "Un biglietto Wiener Linien da 48 ore, convalidato il 21 verso le 9:00, vale fino al 23 alle 9:00 e copre tutti gli spostamenti in città, compreso il viaggio verso l'aeroporto la mattina della partenza. Per la tratta Stadtgrenze–Flughafen serve però un'estensione (o un biglietto aeroporto): controllate all'acquisto.",
  },
  {
    type: "check",
    title: "Café Sperl: uscite prima",
    text: "Dall'hotel sono circa 2 km, cioè 25 minuti a piedi e non 15. Per essere lì alle 8:00 uscite alle 7:35.",
  },
  {
    type: "check",
    title: "Fischerbräu: fermata Glatzgasse",
    text: "Il tram 37 non ha una fermata «Döblinger Hauptstraße». Si scende a Glatzgasse, una fermata dopo Nußdorfer Straße.",
  },
];
