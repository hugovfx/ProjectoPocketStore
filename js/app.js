import { getProducts } from './api.js';
import { renderCatalog, setStatus } from './ui.js';

// Registro del Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('SW registrado'))
      .catch(err => console.error('Error SW:', err));
  });
}

// Contenido dinámico
async function init() {
  try {
    const items = await getProducts();
    renderCatalog(items);
    setStatus(navigator.onLine ? 'Catálogo actualizado' : 'Modo offline: datos guardados');
  } catch (e) {
    setStatus('No hay conexión ni datos guardados todavía.');
  }
}

window.addEventListener('online', init);
window.addEventListener('offline', () => setStatus('Sin conexión'));
init();