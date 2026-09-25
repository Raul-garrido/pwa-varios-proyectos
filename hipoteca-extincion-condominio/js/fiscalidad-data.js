/* Datos fiscales por Comunidad Autónoma / municipio.
   Verificación sept. 2026: el acceso directo (WebFetch) a comunidad.madrid,
   boe.es, noticias.juridicas.com y clientebancario.bde.es está bloqueado
   por política de red de este entorno (403, confirmado también fuera de
   la investigación inicial), así que no ha sido posible leer el BOE ni la
   web oficial en directo. Cada cifra clave de esta tabla, sin embargo, se
   ha cruzado con WebSearch contra 3-6 fuentes independientes entre sí
   (comparadores fiscales especializados que sí citan y replican el texto
   legal, más el criterio del Tribunal Supremo y de la DGT) y todas
   coinciden, por lo que el nivel de confianza es alto aunque no sea
   "fuente primaria leída directamente". Sigue siendo orientativo: usar
   como guía, no como asesoramiento fiscal definitivo. */

const FISCALIDAD = {
  madrid: {
    nombre: 'Comunidad de Madrid',
    municipioDefecto: 'Alcalá de Henares',
    ajdExtincionCondominio: 0.75, // % sobre base imponible = valor de la cuota adquirida (no el 100% del inmueble)
    ajdGenerico: 0.75,
    itpViviendaUsada: 6, // % general (tipo base, sin aplicar bonificaciones); ver nota de reducidos
    ivaViviendaNueva: 10,
    ajdViviendaNueva: 0.75,
    notaReducidos: 'Sobre el 6% general existen reducciones: bonificación del 10% de la cuota para vivienda habitual ≤250.000€ (tipo efectivo 5,4%), y tipo reducido del 4% para familias numerosas en vivienda habitual (con requisitos). Este simulador usa el 6% general sin aplicar bonificaciones, como cifra conservadora.',
    plusvaliaMunicipalNota: 'Si el reparto es proporcional a las cuotas de titularidad (exceso de adjudicación "inevitable" por indivisibilidad, art. 1.062 CC), la extinción de condominio NO devenga IIVTNU (plusvalía municipal): no hay transmisión a efectos de este impuesto (criterio reiterado de la DGT). Si hay exceso de adjudicación NO proporcional, sí se devenga sobre esa parte, y el sujeto pasivo es quien transmite/sale (recibe la compensación), no quien se queda la vivienda. Alcalá de Henares tiene Ordenanza Fiscal nº 7 propia del IIVTNU; aplica los coeficientes máximos estatales del RDL 8/2023 (no se ha localizado ningún coeficiente propio más gravoso), que es lo que usa este simulador.',
    verificado: true,
    fuentes: [
      { texto: 'STS 1484/2018 (9-oct-2018) y STS 1058/2019 — solo AJD si el bien es indivisible', url: 'https://www.fiscal-impuestos.com/tributacion-ajd-actos-juridicos-documentados-extincion-condominio-sentencia-supremo-fija-jurisprudencia.html' },
      { texto: 'AJD extinción de condominio Madrid 0,75% sobre la cuota adquirida (con ejemplo numérico)', url: 'https://hispanoteca.es/blog/extincion-condominio-ajd-itp/' },
      { texto: 'AJD Madrid 0,75% general (contrastado con guiafiscal.es, rankia, ineaf)', url: 'https://guiafiscal.es/patrimonio/itp/madrid/' },
      { texto: 'ITP Madrid 6% general + bonificación 10% vivienda habitual ≤250.000€ + 4% familia numerosa', url: 'https://www.rankia.com/blog/mejores-hipotecas/7380608-itp-madrid' },
      { texto: 'IIVTNU no se devenga en extinción de condominio proporcional (criterio DGT)', url: 'https://www.fiscal-impuestos.com/DGT-IIVTNU-hecho-imponible-plusvalia-disolucion-condominio-compensacion-economica-comuneros' },
      { texto: 'IIVTNU — condiciones de no sujeción explicadas', url: 'https://derecholocal.es/consulta/esta-sujeta-al-iivtnu-la-extincion-del-condominio' },
      { texto: 'Alcalá de Henares aplica coeficientes IIVTNU del RDL 8/2023 (2026)', url: 'https://www.amparolillo.com/categ/-cuanto-pagare-de-plusvalia-en-alcala-de-henares-en-2026-guia-con-los-nuevos-coeficientes' },
      { texto: 'Ordenanza Fiscal nº7 IIVTNU Alcalá de Henares (texto completo, no verificado dato a dato)', url: 'https://contribuyente.ayto-alcaladehenares.es/wp-content/uploads/2022/10/Ordenanza-Fiscal-del-IIVTNU.pdf' },
      { texto: 'Ley 5/2019 — gastos hipoteca a cargo del banco (Banco de España)', url: 'https://clientebancario.bde.es/pcb/es/blog/que-gastos-te-toca-pagar-cuando-contratas-una-hipoteca-.html' }
    ]
  },
  clm: {
    nombre: 'Castilla-La Mancha (Guadalajara)',
    municipioDefecto: 'Guadalajara',
    ajdExtincionCondominio: 1.5, // % general; no hay tipo especial confirmado para extinción de condominio
    ajdGenerico: 1.5,
    itpViviendaUsada: 9, // % general (no habitual / segunda vivienda); ver nota de reducidos — vivienda habitual tributa menos
    ivaViviendaNueva: 10,
    ajdViviendaNueva: 1.5, // reducido a 0,5% (vivienda habitual ≤240.000€) o 0,25% (<36 años) desde Ley 1/2026
    notaReducidos: 'El 9% es el tipo general (vivienda NO habitual / segunda residencia). Para VIVIENDA HABITUAL el tipo reducido general es del 6%. Y desde la Ley 1/2026 (vigente 31/03/2026) hay tipos aún más bajos para vivienda habitual: 3% para menores de 36 años que financien >50% con hipoteca (límite 240.000€), y 5% para familia numerosa, monoparental o discapacidad ≥65% (mismo límite). Este simulador usa el 9% general como cifra conservadora; si tu caso es vivienda habitual, el coste real de ITP puede ser bastante menor.',
    plusvaliaMunicipalNota: 'Mismo criterio que en Madrid: la extinción de condominio proporcional a las cuotas no devenga IIVTNU. El Ayuntamiento de Guadalajara aplica el régimen general si hay exceso de adjudicación no proporcional.',
    verificado: true,
    fuentes: [
      { texto: 'AJD Castilla-La Mancha 1,5% general', url: 'https://guiafiscal.es/patrimonio/itp/castilla-la-mancha/' },
      { texto: 'Ley 1/2026 (26-mar-2026) — nuevos reducidos ITP/AJD jóvenes y familias, vigente desde 31/03/2026', url: 'https://portaltributario.jccm.es/avisos/entrada-en-vigor-de-la-ley-12026-de-26-de-marzo-de-medidas-administrativas-y-tributarias-de' },
      { texto: 'ITP CLM: 9% general (no habitual) vs 6% vivienda habitual, 3% jóvenes, 5% familia numerosa', url: 'https://trioteca.com/blog/cuanto-pagas-de-itp-en-castilla-la-mancha/' },
      { texto: 'ITP CLM 9%/6%, contraste adicional', url: 'https://infoitp.es/castilla-la-mancha/' }
    ]
  }
};

// Notas legales generales aplicables a ambas comunidades
const FISCALIDAD_NOTAS_GENERALES = [
  'Desde la Ley 11/2021 (antifraude), la base imponible de AJD/ITP no puede ser inferior al Valor de Referencia catastral del inmueble.',
  'Ley 5/2019 (crédito inmobiliario), confirmado por el Banco de España: en la constitución de una hipoteca sobre vivienda, el AJD, la notaría, el registro y la gestoría de la parte hipotecaria los paga el BANCO. El cliente solo paga la tasación (y copias de escritura si las pide para sí).',
  'La base imponible del AJD en una extinción de condominio es el valor de la cuota que se adquiere (la del copropietario saliente), no el valor total del inmueble (criterio consolidado desde STS 1484/2018).',
  'Verificación: estas cifras están cruzadas contra varias fuentes independientes vía búsqueda web, pero no se ha podido leer en directo el texto del BOE ni de comunidad.madrid por una restricción de red de este entorno (no del dato en sí). Confirma el tipo exacto aplicable a tu caso concreto con una gestoría o notaría antes de firmar.',
];

const GASTOS_GENERICOS = {
  gestoriaExtincion: 400, // € orientativo (rango visto: 100-600€)
  gestoriaHipoteca: 0, // desde Ley 5/2019 la asume el banco
  tasacionVivienda: 350, // € orientativo (rango visto: 200-500€), a cargo del cliente
  seguroHogarAnual: 250,
  seguroVidaAnual: 200
};
