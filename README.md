# Vienna · 21–23 dicembre 2026

Dashboard interattiva del viaggio a Vienna: programma giorno per giorno, mappa con i
tragitti in U-Bahn, tram e S-Bahn (colori ufficiali Wiener Linien), fermate, direzioni
e note pratiche.

## Aprire la dashboard

È un sito statico, non serve compilare nulla.

```bash
python3 -m http.server 8000   # poi apri http://localhost:8000
```

### GitHub Pages

Il workflow `.github/workflows/pages.yml` pubblica il sito a ogni push su `main`
(oppure a mano da *Actions → Deploy GitHub Pages → Run workflow*).

Da fare una sola volta: *Settings → Pages → Build and deployment → Source:* **GitHub Actions**.

In alternativa, senza workflow: *Source:* **Deploy from a branch**, branch
`claude/vienna-transport-dashboard-6q18zu`, cartella `/ (root)`. Il file `.nojekyll`
fa pubblicare i file così come sono.

Indirizzo: <https://gabrielphys.github.io/Vienna/>

## Contenuto

- **21.12**: arrivo, City Locker, Museo di Sissi, Golden Frites, mercatini, Mozarthaus,
  Swarovski, cena da Fischerbräu. Un selettore mette a confronto la mattina
  *ottimizzata* (prima il locker, poi Sissi) con quella *originale*.
- **22.12**: Café Sperl, Stephansdom, Belvedere, Mühlbauer, Biblioteca Nazionale,
  Am Hof, Schönbrunn, Prater, concerto a Sant'Anna, Figlmüller.
- **23.12**: proposta di rientro in aeroporto per il volo FR214.

Le correzioni al documento originale sono evidenziate nella timeline e nella sezione
"Da sapere prima di partire": direzioni del tram D, orario della S7, fermata del 37,
tempo a piedi per il Café Sperl.

## File

| File | Contenuto |
| --- | --- |
| `index.html` | struttura della pagina |
| `assets/data.js` | itinerario, luoghi, fermate, note (da modificare per cambiare il programma) |
| `assets/app.js` | mappa (Leaflet) e interfaccia |
| `assets/network.js` | tracciati di U1/U3/U4/U6, tram D e 37, generati da OpenStreetMap |
| `tools/build_network.py` | rigenera `network.js` da un export Overpass (`tools/overpass_query.txt`) |

Dati cartografici © OpenStreetMap contributors (ODbL). La S7 è disegnata in forma schematica.
Orari e tempi sono stime: controllateli su Wien Mobil o ÖBB Scotty prima di partire.
