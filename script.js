const csvURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSZuJ9aHJIgGbXgbdu5-6hLA3GcS2zmZjAlygwQj0jHS9jM47tNcCOE89zlIF_JMvTYMefVaQ4z_DJM/pub?gid=345912978&single=true&output=csv';

const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
const markerCluster = L.markerClusterGroup();
map.addLayer(markerCluster);

fetch(csvURL)
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split('\n').slice(1);
    rows.forEach(row => {
      const cols = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
      if (!cols || cols.length < 6) return;

      const [title, lat, lng, url, country, category] = cols.map(c => c.replace(/^"|"$/g, ''));
      const iframe =
        url.includes('youtube.com/embed/')
          ? `<iframe width="300" height="169" src="${url}" frameborder="0" allowfullscreen></iframe>`
          : `<a href="${url}" target="_blank">ライブ映像を開く</a>`;

      const popup = `<strong>${title}</strong><br>${iframe}`;
      const marker = L.marker([parseFloat(lat), parseFloat(lng)]).bindPopup(popup);
      markerCluster.addLayer(marker);
    });
  });
