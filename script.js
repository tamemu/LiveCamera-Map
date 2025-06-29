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
    const cams = rows.map(r => {
      const [title, lat, lng, url, country, category] = r.split(',');
      return {
        title,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        url,
        country,
        category
      };
    });

    populateFilters(cams);
    displayMarkers(cams);

    document.getElementById('countryFilter').addEventListener('change', () => filterMarkers());
    document.getElementById('categoryFilter').addEventListener('change', () => filterMarkers());
  });

function populateFilters(cams) {
  const countrySel = document.getElementById('countryFilter');
  const categorySel = document.getElementById('categoryFilter');

  const countries = [...new Set(cams.map(c => c.country))].sort();
  const categories = [...new Set(cams.map(c => c.category))].sort();

  countries.forEach(c => {
    countrySel.innerHTML += `<option value="\${c}">\${c}</option>`;
  });
  categories.forEach(c => {
    categorySel.innerHTML += `<option value="\${c}">\${c}</option>`;
  });
}

function displayMarkers(cams) {
  cams.forEach(cam => {
    const iframe = `<iframe width="300" height="169" src="\${cam.url}" frameborder="0" allowfullscreen></iframe>`;
    const marker = L.marker([cam.lat, cam.lng]).bindPopup(`<strong>\${cam.title}</strong><br>\${iframe}`);
    marker.meta = cam;
    markerCluster.addLayer(marker);
    allMarkers.push(marker);
  });
}

function filterMarkers() {
  const selectedCountry = document.getElementById('countryFilter').value;
  const selectedCategory = document.getElementById('categoryFilter').value;

  markerCluster.clearLayers();

  allMarkers.forEach(marker => {
    const { country, category } = marker.meta;
    const matchCountry = !selectedCountry || country === selectedCountry;
    const matchCategory = !selectedCategory || category === selectedCategory;

    if (matchCountry && matchCategory) {
      markerCluster.addLayer(marker);
    }
  });
}
