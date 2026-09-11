/*
 * build.js — genera las paginas HTML del sitio desde src/
 *
 * El header y el footer viven en un solo lugar (src/partials/) y se
 * insertan en cada pagina al construir. Antes estaban copiados en los 8
 * archivos, y cada cambio habia que hacerlo 8 veces.
 *
 * Uso:  node build.js
 *
 * Entrada:  src/partials/*.html  +  src/pages/*.html
 * Salida:   los *.html de la raiz (se sobrescriben)
 *
 * No tiene dependencias: solo Node. La salida es HTML estatico plano, asi
 * que el sitio se sigue publicando y abriendo igual que antes.
 */

const fs = require('fs');
const path = require('path');

// TODO: confirmar el numero real. Antes conocenos.html tenia este numero y
// las otras 7 paginas un placeholder (5493810000000, siete ceros).
const WHATSAPP = '5493863409588';

const raiz = __dirname;
const dirPartials = path.join(raiz, 'src', 'partials');
const dirPaginas = path.join(raiz, 'src', 'pages');

const leer = (...p) => fs.readFileSync(path.join(...p), 'utf8');

const head = leer(dirPartials, 'head.html').trimEnd();
const header = leer(dirPartials, 'header.html').trimEnd();
const footer = leer(dirPartials, 'footer.html').trimEnd();

/* Separa el bloque de metadatos del contenido de la pagina. */
function parsear(texto) {
  const m = texto.match(/^<!--\r?\n([\s\S]*?)\r?\n-->\r?\n?/);
  if (!m) throw new Error('falta el bloque de metadatos');
  const campos = {};
  for (const linea of m[1].split(/\r?\n/)) {
    const i = linea.indexOf(':');
    if (i > 0) campos[linea.slice(0, i).trim()] = linea.slice(i + 1).trim();
  }
  return { campos, contenido: texto.slice(m[0].length).trimEnd() };
}

/* Marca como activo el enlace del nav cuyo href coincide con la pagina. */
function marcarActivo(html, href) {
  if (!href) return html;
  const busca = '<a href="' + href + '">';
  if (!html.includes(busca)) {
    throw new Error('activo: "' + href + '" no existe en header.html');
  }
  return html.replace(busca, '<a href="' + href + '" class="active">');
}

const paginas = fs.readdirSync(dirPaginas).filter((f) => f.endsWith('.html')).sort();
let escritas = 0;

for (const archivo of paginas) {
  const { campos, contenido } = parsear(leer(dirPaginas, archivo));

  for (const requerido of ['title', 'description']) {
    if (!campos[requerido]) throw new Error(archivo + ': falta "' + requerido + '"');
  }

  const cabecera = head
    .split('{{title}}').join(campos.title)
    .split('{{description}}').join(campos.description);

  const pie = footer.split('{{whatsapp}}').join(WHATSAPP);

  const salida = [
    '<!DOCTYPE html>',
    '<!-- ARCHIVO GENERADO por build.js. No editar a mano: se sobrescribe.',
    '     El contenido de esta pagina esta en src/pages/' + archivo,
    '     El header y el footer, en src/partials/ -->',
    '<html lang="es">',
    '<head>',
    cabecera,
    '</head>',
    '<body>',
    marcarActivo(header, campos.activo),
    contenido,
    pie,
    '</body>',
    '</html>',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(raiz, archivo), salida, 'utf8');
  escritas++;
  console.log('  ' + archivo.padEnd(16) + campos.title);
}

console.log('\n' + escritas + ' paginas generadas.');
