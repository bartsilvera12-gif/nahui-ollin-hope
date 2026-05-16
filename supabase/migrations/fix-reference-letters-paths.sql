-- Fix: la carpeta /cartas-referenciales chocaba con la ruta del sitio
-- y devolvia 403 en produccion (Vercel servia el directorio antes que la SPA).
-- Renombramos a /img-cartas-referenciales/ y actualizamos las filas existentes.

update nahui.reference_letters
   set url = replace(url, '/cartas-referenciales/', '/img-cartas-referenciales/')
 where url like '/cartas-referenciales/%';
