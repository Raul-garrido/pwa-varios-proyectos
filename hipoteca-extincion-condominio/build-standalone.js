/* Genera hipoteca-extincion-condominio-standalone.html (un único archivo
   HTML con CSS/JS incrustados) a partir de index.html + css/ + js/, para
   poder descargarlo y compartirlo sin servidor ni carpeta. Ejecutar tras
   cualquier cambio en index.html, css/style.css o js/*.js:
     node build-standalone.js
*/
const fs = require('fs');
const path = require('path');

const root = __dirname;
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

html = html.replace(
  /<link rel="stylesheet" href="css\/style\.css">/,
  () => `<style>\n${fs.readFileSync(path.join(root, 'css/style.css'), 'utf8')}\n</style>`
);

// El bundle no lleva manifest/iconos (no tiene sentido para un único archivo)
html = html.replace(/\s*<link rel="manifest"[^>]*>\n?/, '\n');
html = html.replace(/\s*<link rel="icon"[^>]*>\n?/, '\n');
html = html.replace(/\s*<link rel="apple-touch-icon"[^>]*>\n?/, '\n');

const scripts = ['js/calculos.js', 'js/fiscalidad-data.js', 'js/bancos-data.js', 'js/app.js'];
for (const s of scripts) {
  const src = fs.readFileSync(path.join(root, s), 'utf8');
  const re = new RegExp(`<script src="${s.replace('/', '\\/')}"></script>`);
  html = html.replace(re, () => `<script>\n${src}\n</script>`);
}
// El intento de registrar el service worker no falla: bajo file:// o sin
// servidor, navigator.serviceWorker suele no existir o register() se
// rechaza, y ya está capturado con .catch(() => {}) en app.js.

const outPath = path.join(root, '..', 'hipoteca-extincion-condominio-standalone.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log('Generado:', outPath, `(${html.length} bytes)`);
