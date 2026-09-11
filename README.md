# Frontend VitaDev

Sitio institucional de VitaDev. HTML, CSS y JavaScript sin frameworks.

## Importante: no editar los `.html` de la raíz

Los 8 archivos HTML de la raíz (`index.html`, `proyectos.html`, etc.) **son
generados**. Si los editás a mano, el próximo build borra tus cambios. Cada uno
arranca con un comentario que lo avisa.

Lo que sí se edita está en `src/`.

## Estructura

```
src/
  partials/
    head.html      metadatos, fuentes y link al CSS (una sola copia)
    header.html    barra superior y menú        (una sola copia)
    footer.html    pie de página y <script>     (una sola copia)
  pages/
    index.html     metadatos + contenido propio de cada página
    ...            (uno por página)
assets/
  styles.css       todo el CSS del sitio        (una sola copia)
  app.js           menú móvil                   (una sola copia)
build.js           arma los .html de la raíz
```

## Construir

No necesita `npm install`: usa solo Node, sin dependencias.

**Mientras trabajás** (recomendado): doble clic en `desarrollar.cmd`, o

```bash
node build.js --watch
```

Queda escuchando `src/`. Guardás `header.html` y las 8 páginas se regeneran
solas, sin correr nada. Dejá la ventana abierta mientras editás.

**Una sola vez** (antes de publicar): doble clic en `construir.cmd`, o

```bash
node build.js
```

Como la salida es HTML estático plano, el sitio se sigue publicando y abriendo
igual que siempre: no hace falta servidor ni paso de deploy nuevo.

## Ver el sitio

Abrí `index.html` en el navegador. Si preferís por HTTP:

```bash
npx serve -l 4173
```

## Cómo agregar una página

1. Creá `src/pages/mi-pagina.html` con este encabezado:

   ```html
   <!--
   title: Mi página — VitaDev
   description: Descripción para Google y para las redes.
   activo: proyectos.html
   -->
   ```

   `activo` es el `href` del ítem del menú que se marca como actual. Si la
   página no está en el menú, dejalo vacío. Si el `href` no existe en
   `src/partials/header.html`, el build falla avisando.

2. Debajo del encabezado va el contenido: solo lo que está entre el header y
   el footer.

3. Corré `node build.js` (o dejá el watch corriendo y se genera sola).

## Por qué hay un build

El header y el footer estaban copiados en los 8 archivos, unos 500 renglones
duplicados. Cada cambio del menú costaba 8 ediciones, y alcanzaba con olvidar
una para que las páginas quedaran desincronizadas. Pasó de verdad: el número de
WhatsApp del footer se actualizó en una sola página y las otras siete quedaron
con un placeholder.

HTML puro no tiene forma de incluir un archivo en otro. El build resuelve eso
sin agregar dependencias ni cambiar cómo se publica el sitio.
