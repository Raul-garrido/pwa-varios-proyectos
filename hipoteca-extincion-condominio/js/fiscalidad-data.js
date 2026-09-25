/* Datos fiscales por Comunidad Autónoma / municipio.
   Fuente: investigación con WebSearch (sept. 2026). Algunos puntos quedan
   marcados como "verificar" porque el acceso directo a comunidad.madrid,
   boe.es y la ordenanza municipal de Alcalá de Henares estuvo bloqueado
   durante la investigación (ver notas). Usar como orientación, no como
   asesoramiento fiscal definitivo. */

const FISCALIDAD = {
  madrid: {
    nombre: 'Comunidad de Madrid',
    municipioDefecto: 'Alcalá de Henares',
    ajdExtincionCondominio: 0.75, // % sobre base imponible = valor de la cuota adquirida (no el 100% del inmueble)
    ajdGenerico: 0.75,
    itpViviendaUsada: 6, // % general; 4% para familia numerosa en vivienda habitual (requisitos); bonificación 10% cuota si ≤250.000€ (verificar vigencia)
    ivaViviendaNueva: 10,
    ajdViviendaNueva: 0.75,
    plusvaliaMunicipalNota: 'Si el reparto es proporcional a las cuotas de titularidad (exceso de adjudicación "inevitable" por indivisibilidad, art. 1.062 CC), la extinción de condominio NO devenga IIVTNU (plusvalía municipal): no hay transmisión a efectos de este impuesto. Si hay exceso de adjudicación NO proporcional, sí se devenga sobre esa parte, y el sujeto pasivo es quien transmite/sale (recibe la compensación), no quien se queda la vivienda. Alcalá de Henares tiene Ordenanza Fiscal nº 7 propia del IIVTNU (PDF publicado por el Ayuntamiento); no se ha podido verificar si se aparta de los coeficientes máximos estatales, así que este simulador usa el régimen general como criterio conservador.',
    verificado: 'parcial',
    fuentes: [
      { texto: 'STS 1484/2018 (9-oct-2018) y STS 1058/2019 — solo AJD si el bien es indivisible', url: 'https://www.fiscal-impuestos.com/tributacion-ajd-actos-juridicos-documentados-extincion-condominio-sentencia-supremo-fija-jurisprudencia.html' },
      { texto: 'Decreto Legislativo 1/2010 (Madrid) — AJD 0,75%', url: 'https://noticias.juridicas.com/base_datos/CCAA/r7-ma-dleg1-2010.html' },
      { texto: 'Base imponible AJD = cuota adquirida, no el 100%', url: 'https://es.andersen.com/es/blog/la-base-imponible-en-ajd-en-los-supuestos-de-extincion-de-condominio.html' },
      { texto: 'IIVTNU no se devenga en extinción de condominio proporcional (DGT)', url: 'https://www.fiscal-impuestos.com/DGT-IIVTNU-hecho-imponible-plusvalia-disolucion-condominio-compensacion-economica-comuneros' },
      { texto: 'Ordenanza Fiscal nº7 IIVTNU Alcalá de Henares (verificar contenido)', url: 'https://contribuyente.ayto-alcaladehenares.es/wp-content/uploads/2025/01/ORDENANZA-FISCAL-N7-IIVT.pdf' },
      { texto: 'ITP Madrid 6% general (Infobae, resumen 2025 — verificar en comunidad.madrid)', url: 'https://www.infobae.com/espana/2025/04/16/cuanto-se-paga-de-impuesto-de-transmisiones-patrimoniales-en-madrid/' }
    ]
  },
  clm: {
    nombre: 'Castilla-La Mancha (Guadalajara)',
    municipioDefecto: 'Guadalajara',
    ajdExtincionCondominio: 1.5, // % general; no hay tipo especial confirmado para extinción de condominio
    ajdGenerico: 1.5,
    itpViviendaUsada: 9, // % general (uno de los más altos de España); 3% jóvenes <36 años en vivienda habitual ≤240.000€ desde Ley 1/2026 (31/03/2026), bajo condiciones
    ivaViviendaNueva: 10,
    ajdViviendaNueva: 1.5, // reducido a 0,5% (vivienda habitual ≤240.000€) o 0,25% (<36 años) desde Ley 1/2026
    plusvaliaMunicipalNota: 'Mismo criterio que en Madrid: la extinción de condominio proporcional a las cuotas no devenga IIVTNU. El Ayuntamiento de Guadalajara aplica el régimen general si hay exceso de adjudicación no proporcional.',
    verificado: 'parcial',
    fuentes: [
      { texto: 'AJD Castilla-La Mancha 1,5% general', url: 'https://guiafiscal.es/patrimonio/itp/castilla-la-mancha/' },
      { texto: 'Ley 1/2026 (26-mar-2026) — nuevos reducidos ITP/AJD jóvenes, vigente desde 31/03/2026', url: 'https://portaltributario.jccm.es/avisos/entrada-en-vigor-de-la-ley-12026-de-26-de-marzo-de-medidas-administrativas-y-tributarias-de' },
      { texto: 'ITP CLM 9% general, reducido 3% jóvenes', url: 'https://infoitp.es/castilla-la-mancha/' }
    ]
  }
};

// Notas legales generales aplicables a ambas comunidades
const FISCALIDAD_NOTAS_GENERALES = [
  'Desde la Ley 11/2021 (antifraude), la base imponible de AJD/ITP no puede ser inferior al Valor de Referencia catastral del inmueble.',
  'Ley 5/2019 (crédito inmobiliario): en la constitución de una hipoteca sobre vivienda, el AJD, la notaría, el registro y la gestoría de la parte hipotecaria los paga el BANCO. El cliente solo paga la tasación (y copias de escritura si las pide para sí).',
  'La base imponible del AJD en una extinción de condominio es el valor de la cuota que se adquiere (la del copropietario saliente), no el valor total del inmueble.',
];

const GASTOS_GENERICOS = {
  gestoriaExtincion: 400, // € orientativo (rango visto: 100-600€)
  gestoriaHipoteca: 0, // desde Ley 5/2019 la asume el banco
  tasacionVivienda: 350, // € orientativo (rango visto: 200-500€), a cargo del cliente
  seguroHogarAnual: 250,
  seguroVidaAnual: 200
};
