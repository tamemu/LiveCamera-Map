const csvURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSZuJ9aHJIgGbXgbdu5-6hLA3GcS2zmZjAlygwQj0jHS9jM47tNcCOE89zlIF_JMvTYMefVaQ4z_DJM/pub?gid=345912978&single=true&output=csv'; // ←ここを書き換えてください

const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
const markerCluster = L.markerClusterGroup();
map.addLayer(markerCluster);

let allMarkers = [];

fetch(csvURL)
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split('\n').slice(1);
    rows.forEach(r => {
      const cols = r.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g); // カンマ区切りを安全に分割
      if (!cols || cols.length < 6) return;

      const [title, lat, lng, url, country, category] = cols.map(c => c.replace(/^"|"$/g, ''));
      const cam = { title, lat: parseFloat(lat), lng: parseFloat(lng), url, country, category };

      const iframe = `<iframe width="300" height="169" src="${cam.url}" frameborder="0" allowfullscreen></iframe>`;
      const marker = L.marker([cam.lat, cam.lng]).bindPopup(`<strong>${cam.title}</strong><br>${iframe}`);
      marker.meta = cam;
      markerCluster.addLayer(marker);
      allMarkers.push(marker);
    });
  });
