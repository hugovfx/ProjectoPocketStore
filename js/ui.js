// js/ui.js — todo lo relacionado con pintar la interfaz

let allItems = [];

const catalog = document.getElementById('catalog');
const search = document.getElementById('search');
const net = document.getElementById('net');

// Evita inyectar HTML desde los datos de la API
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

// "Leanne Graham" -> "LG" (ignora títulos como Mrs. o Dr.)
const initials = (name) =>
  name
    .split(' ')
    .filter((w) => !/^(Mr|Mrs|Ms|Dr)\.?$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

export function setStatus(text) {
  document.getElementById('status').textContent = text;
}

function cardTemplate(u, i) {
  return `
    <article class="card" style="animation-delay:${i * 60}ms">
      <div class="avatar" style="--h:${(u.id * 47) % 360}">${esc(initials(u.name))}</div>
      <h2>${esc(u.name)}</h2>
      <p class="user">@${esc(u.username)}</p>
      <ul class="meta">
        <li><span>📧</span><em>${esc(u.email)}</em></li>
        <li><span>🏢</span><em>${esc(u.company.name)}</em></li>
        <li><span>📍</span><em>${esc(u.address.city)}</em></li>
        <li><span>📞</span><em>${esc(u.phone.split(' x')[0])}</em></li>
      </ul>
    </article>`;
}

function paint(items) {
  if (items.length === 0) {
    catalog.innerHTML = `<div class="empty"><b>🕵️</b>No se encontraron resultados</div>`;
    return;
  }
  catalog.innerHTML = items.map(cardTemplate).join('');
}

export function renderCatalog(items) {
  allItems = items;
  paint(allItems);
}

// Buscador: filtra por nombre, correo o ciudad
search.addEventListener('input', () => {
  const q = search.value.trim().toLowerCase();
  const filtered = allItems.filter((u) =>
    [u.name, u.email, u.address.city, u.company.name]
      .join(' ')
      .toLowerCase()
      .includes(q)
  );
  paint(filtered);
});

// Indicador de conexión en el header
function updateNet() {
  const online = navigator.onLine;
  net.textContent = online ? 'En línea' : 'Sin conexión';
  net.classList.toggle('offline', !online);
}
window.addEventListener('online', updateNet);
window.addEventListener('offline', updateNet);
updateNet();