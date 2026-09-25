/* Base de datos de bancos e hipotecas.
   Fuente: investigación con WebSearch (sept. 2026). IMPORTANTE: el acceso
   directo (WebFetch) a las webs oficiales de los bancos estuvo bloqueado
   por el proxy de red de este entorno, así que los datos proceden de
   resultados de búsqueda que citan y resumen esas páginas oficiales y
   comparadores (HelpMyCash, Kelisto, iAhorro, Rankia, goanlegal...), NO de
   lectura directa de la ficha FIPRE/FEIN. Verifica siempre el TIN/TAE
   exacto en la ficha oficial del banco antes de decidir — cambian a
   menudo. Cada banco incluye `fechaConsulta` y `fuentes` para que puedas
   contrastar. El campo `extincionCondominio` es el más incierto: casi
   ningún banco publica una política oficial y cuantificada; se refleja
   así explícitamente en vez de inventar cifras. */

const BANCOS = [
  {
    id: 'caixabank', nombre: 'CaixaBank', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'cb-fija', nombre: 'Hipoteca CasaFácil Fijo', tipo: 'fija', tin: 2.85, tinSinBonificar: 3.80, plazoMaxAnios: 30, edadMaxima: 80, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina + 3 recibos', 'tarjeta (3 compras/trimestre)', 'seguro hogar', 'seguro vida/salud', 'alarma'] }
    ],
    extincionCondominio: {
      financia100: null, entradaTipica: null, facilidad: 3,
      notas: 'Aplica su LTV estándar (80%) sobre el valor de tasación del conjunto de la operación, no necesariamente sobre el 100% de la parte a compensar; en la práctica suele dejar un margen a cubrir con fondos propios. Trayectoria documentada operando este tipo de casos. Sin cifra oficial publicada — consulta directa recomendada.',
      fuente: 'https://goanlegal.com/blog/condominio-hipoteca-la-caixa/ (bróker, sesgo comercial)'
    },
    fuentes: ['https://www.caixabank.es/particular/hipotecas/casafacil.html', 'https://www.hoyfinanzas.es/hipotecas/hipoteca-casafacil-caixabank-tipos-interes-comisiones']
  },
  {
    id: 'santander', nombre: 'Banco Santander', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'sa-fija', nombre: 'Hipoteca Fija Santander', tipo: 'fija', tin: 2.96, tinSinBonificar: 3.96, plazoMaxAnios: 30, edadMaxima: 80, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina/pensión', 'tarjeta (6 usos/trimestre)', 'seguro hogar', 'seguro vida', 'plan de pensiones/inversión'] },
      { id: 'sa-var', nombre: 'Hipoteca Variable Santander', tipo: 'variable', tin: 2.68, tinSinBonificar: 3.68, diferencial: 0.84, plazoMaxAnios: 30, edadMaxima: 80, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina/pensión', 'tarjeta', 'seguro hogar', 'seguro vida', 'plan de pensiones/inversión'] }
    ],
    extincionCondominio: {
      financia100: false, entradaTipica: 20, facilidad: 2,
      notas: 'Según fuentes de brokers, no suele cubrir el importe total necesario: aplica de facto ~80% LTV sobre el importe a compensar, exigiendo aportación propia del resto (~20%). No confirmado en fuente oficial de Santander.',
      fuente: 'https://goanlegal.com/blog/hipoteca-extincion-condominio-santander/ (bróker, sesgo comercial)'
    },
    fuentes: ['https://www.bancosantander.es/particulares/hipotecas/hipoteca-fija', 'https://www.helpmycash.com/hipotecas/santander/hipoteca-fija/']
  },
  {
    id: 'bbva', nombre: 'BBVA', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'bbva-fija', nombre: 'Hipoteca Fija BBVA', tipo: 'fija', tin: 2.85, tinSinBonificar: 3.85, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina', 'seguro hogar', 'seguro vida'] },
      { id: 'bbva-joven', nombre: 'Hipoteca Joven BBVA (<36 años)', tipo: 'variable', tin: 1.99, tinSinBonificar: 2.99, diferencial: 1.60, plazoMaxAnios: 30, edadMaxima: 70, ltvMaxHabitual: 95, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina', 'seguro hogar', 'seguro vida', 'menor de 36 años (hasta 100% con aval ICO Vivienda Joven)'] }
    ],
    extincionCondominio: {
      financia100: false, entradaTipica: 20, facilidad: 2,
      notas: 'Foros y brokers indican que, como la mayoría de bancos, suele financiar solo ~80% de la parte adquirida, exigiendo aportación del resto. Sin condiciones especiales confirmadas en fuente oficial.',
      fuente: 'https://goanlegal.com/blog/extincion-de-condominio-hipoteca-bbva/ (bróker/foro, sin confirmación oficial)'
    },
    fuentes: ['https://www.bbva.es/personas/productos/hipotecas/hipoteca-fija.html', 'https://www.bbva.es/personas/productos/hipotecas/hipoteca-joven.html']
  },
  {
    id: 'sabadell', nombre: 'Banco Sabadell', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'sab-fija', nombre: 'Hipoteca Fija Sabadell', tipo: 'fija', tin: 2.75, tinSinBonificar: 3.75, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina', 'seguro hogar', 'seguro vida', 'protección de pagos'] },
      { id: 'sab-var', nombre: 'Hipoteca Variable Sabadell', tipo: 'variable', tin: 1.50, tinSinBonificar: 2.50, diferencial: 0.50, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina', 'seguro hogar', 'seguro vida', 'protección de pagos'] }
    ],
    extincionCondominio: {
      financia100: null, entradaTipica: null, facilidad: 3,
      notas: 'Sabadell publica un blog propio explicando el proceso de novación/subrogación en extinción de condominio, pero no un % de financiación concreto: remite a evaluación caso por caso (solvencia, cuota ≤30% de ingresos, historial crediticio).',
      fuente: 'https://www.bancsabadell.com/bsnacional/ca/blog/que-es-le-extincio-del-condomini-i-com-es-realitza/'
    },
    fuentes: ['https://selectra.es/finanzas/bancos/sabadell/hipoteca-sabadell', 'https://www.kelisto.es/hipotecas-fijas/bancos/banc-sabadell/hipoteca-fija']
  },
  {
    id: 'bankinter', nombre: 'Bankinter', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'bk-fija', nombre: 'Hipoteca Fija Bonificada Bankinter', tipo: 'fija', tin: 2.85, tinSinBonificar: 4.15, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 60, comisionApertura: 0, vinculaciones: ['nómina', 'seguro de vida Bankinter', 'seguro multirriesgo hogar Bankinter', 'plan de pensiones ≥600€/año'] },
      { id: 'bk-var', nombre: 'Hipoteca Variable Bankinter', tipo: 'variable', tin: 2.30, tinSinBonificar: 3.30, diferencial: 0.50, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 60, comisionApertura: 0, vinculaciones: ['nómina', 'seguro de vida Bankinter', 'seguro multirriesgo hogar Bankinter'] }
    ],
    extincionCondominio: {
      financia100: false, entradaTipica: 30, facilidad: 1,
      notas: '⚠ Descrito repetidamente como de los MÁS restrictivos: "aplica criterios exigentes" y "no suele financiar el 100% del valor necesario". En un caso documentado, ante 30.000€ necesarios para compensar, propuso un préstamo personal a 10 años (peor condición) en vez de ampliar la hipoteca. Muchas solicitudes se rechazan según brokers.',
      fuente: 'https://goanlegal.com/blog/hipoteca-extincion-de-condominio-bankinter/ (bróker/testimonios, no oficial)'
    },
    fuentes: ['https://www.kelisto.es/hipotecas/bancos/bankinter', 'https://www.finteca.es/bancos/hipoteca-bankinter/']
  },
  {
    id: 'ing', nombre: 'ING España', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'ing-fija', nombre: 'Hipoteca Naranja Fija', tipo: 'fija', tin: 3.75, tinSinBonificar: 4.25, plazoMaxAnios: 25, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina (≥600€/mes o saldo ≥2.000€)', 'seguro de vida ING', 'seguro de hogar ING'] },
      { id: 'ing-var', nombre: 'Hipoteca Naranja Variable', tipo: 'variable', tin: 2.65, tinSinBonificar: 3.65, diferencial: 0.65, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina (≥600€/mes o saldo ≥2.000€)', 'seguro de vida ING', 'seguro de hogar ING'] }
    ],
    extincionCondominio: {
      financia100: null, entradaTipica: null, facilidad: 2,
      notas: 'Evidencia mixta: varias fuentes lo describen como reacio a liberar a un cotitular ("exige aportaciones adicionales, avalistas o productos extra"), pero un testimonio de foro completó la operación con buen tipo (1,99%) aunque con gastos de formalización altos (~7.500€). Sin política oficial publicada.',
      fuente: 'https://goanlegal.com/blog/extincion-de-condominio-hipoteca-ing/ (bróker/foro, no oficial)'
    },
    fuentes: ['https://www.ing.es/hipotecas/hipoteca-fija', 'https://www.helpmycash.com/hipotecas/ing/hipoteca-naranja/']
  },
  {
    id: 'openbank', nombre: 'Openbank', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'ob-fija', nombre: 'Hipoteca Fija Openbank', tipo: 'fija', tin: 2.46, tinSinBonificar: 2.96, plazoMaxAnios: 30, edadMaxima: 80, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina/pensión (≥900€ o ≥1.800€ dos titulares)', 'seguro hogar Openbank', 'seguro vida Openbank'] },
      { id: 'ob-var', nombre: 'Hipoteca Variable Openbank', tipo: 'variable', tin: 2.00, tinSinBonificar: 2.50, diferencial: 0.65, plazoMaxAnios: 30, edadMaxima: 80, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina/pensión', 'seguro hogar Openbank', 'seguro vida Openbank'] }
    ],
    extincionCondominio: {
      financia100: null, entradaTipica: null, facilidad: null,
      notas: 'No se encontró información específica publicada sobre la política de Openbank en extinción de condominio, ni oficial ni de comparadores. Dato no confirmado — consulta directa recomendada.',
      fuente: null
    },
    fuentes: ['https://www.openbank.es/hipoteca-fija', 'https://www.kelisto.es/hipotecas-fijas/bancos/openbank/hipoteca-fija-hasta-80-vt']
  },
  {
    id: 'unicaja', nombre: 'Unicaja Banco', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'un-fija', nombre: 'Hipoteca Fija Unicaja', tipo: 'fija', tin: 2.95, tinSinBonificar: 3.85, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0.15, vinculaciones: ['nómina', 'seguro hogar', 'seguro vida'] },
      { id: 'un-var', nombre: 'Hipoteca Variable Unicaja', tipo: 'variable', tin: 2.10, tinSinBonificar: 3.10, diferencial: 0.65, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0.15, vinculaciones: ['nómina', 'seguro hogar', 'seguro vida'] }
    ],
    extincionCondominio: {
      financia100: null, entradaTipica: null, facilidad: 5,
      notas: '✔ El ÚNICO banco con una página oficial de preguntas frecuentes dedicada específicamente a extinción de condominio. Su propio texto indica que "en algunos casos especializados puede llegar a cubrir el 100% de la operación, incluyendo los gastos", condicionado a evaluación de perfil financiero, estabilidad laboral e historial crediticio (no automático). Es el banco con la comunicación más transparente encontrada en esta investigación.',
      fuente: 'https://www.unicajabanco.es/es/faqs/hipotecas/extincion-de-condominio (fuente oficial del banco)'
    },
    fuentes: ['https://www.unicajabanco.es/es/faqs/hipotecas/extincion-de-condominio', 'https://www.unicajabanco.es/es/particulares/hipotecas-y-prestamos/simulador-hipotecas']
  },
  {
    id: 'abanca', nombre: 'Abanca', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'ab-fija', nombre: 'Hipoteca Mari Carmen Fija', tipo: 'fija', tin: 2.85, tinSinBonificar: 3.85, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina', 'seguro hogar', 'seguro vida (vinculación media)'] },
      { id: 'ab-var', nombre: 'Hipoteca Mari Carmen Variable', tipo: 'variable', tin: 2.35, tinSinBonificar: 3.35, diferencial: 0.60, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina', 'seguro hogar', 'seguro vida (vinculación media)'] }
    ],
    extincionCondominio: {
      financia100: null, entradaTipica: null, facilidad: null,
      notas: 'No se encontró documento propio de Abanca sobre el tema; solo referencias genéricas de brokers, sin datos específicos de esta entidad. Dato no confirmado.',
      fuente: null
    },
    fuentes: ['https://www.abanca.com/es/hipotecas/hipoteca-maricarmen/', 'https://www.abanca.com/es/hipotecas/hipoteca-maricarmen-fija/']
  },
  {
    id: 'kutxabank', nombre: 'Kutxabank', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'ku-fija', nombre: 'Hipoteca Fija Kutxabank', tipo: 'fija', tin: 2.70, tinSinBonificar: 4.50, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina ≥3.000€/mes', 'seguro hogar', 'plan de pensiones/EPSV ≥2.400€/año', 'cuenta en Kutxabank'] },
      { id: 'ku-var', nombre: 'Hipoteca Variable Kutxabank', tipo: 'variable', tin: 2.07, tinSinBonificar: 2.71, diferencial: 0.49, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina ≥3.000€/mes', 'seguro hogar', 'plan de pensiones/EPSV ≥2.400€/año', 'cuenta en Kutxabank'] }
    ],
    extincionCondominio: {
      financia100: false, entradaTipica: null, facilidad: 1,
      notas: '⚠ Caso real documentado: ante 30.000€ necesarios para compensar tras una separación (hipoteca de 210.000€ pendiente), Kutxabank NO amplió la hipoteca; propuso trasladar el plan de pensiones y ofrecer un préstamo personal a 10 años en vez de ampliar en buenas condiciones. Un único caso, no representa política oficial general, pero es la evidencia más concreta encontrada.',
      fuente: 'https://www.rankia.com/foros/hipotecas/temas/5172054-subrogar-hipoteca-ampliacion-credito-extincion-condominio (testimonio de usuario)'
    },
    fuentes: ['https://clientes.kutxabank.es/es/hipotecas/variable.html', 'https://www.hoyfinanzas.es/hipotecas/hipoteca-variable-kutxabank-tipos-interes-bonificaciones']
  },
  {
    id: 'mediolanum', nombre: 'Banco Mediolanum', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'med-var', nombre: 'Hipoteca Freedom Variable', tipo: 'variable', tin: 2.15, tinSinBonificar: 2.85, diferencial: 0.65, plazoMaxAnios: 30, edadMaxima: 80, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['cuenta corriente en Mediolanum', 'ingresos recurrentes', 'seguro de vida'] },
      { id: 'med-mixta', nombre: 'Hipoteca Freedom Mixta', tipo: 'fija', tin: 1.99, tinSinBonificar: 2.50, plazoMaxAnios: 30, edadMaxima: 80, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 1, vinculaciones: ['cuenta corriente en Mediolanum', 'ingresos recurrentes', 'seguro de vida'] }
    ],
    extincionCondominio: {
      financia100: null, entradaTipica: null, facilidad: null,
      notas: 'No se encontró ninguna información específica (ni oficial ni de brokers) sobre la política de Banco Mediolanum en extinción de condominio. Dato no confirmado.',
      fuente: null
    },
    fuentes: ['https://www.bancomediolanum.es/es/w/financiacion/hipotecas/hipoteca-freedom-mixta']
  },
  {
    id: 'deutsche', nombre: 'Deutsche Bank España', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'db-fija', nombre: 'Hipoteca Fija Deutsche Bank', tipo: 'fija', tin: 4.30, tinSinBonificar: 4.80, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina/pensión', 'seguro hogar', 'seguro vida', 'tarjeta ≥3.000€/año'] },
      { id: 'db-var', nombre: 'Hipoteca Variable HipoteCasa DB', tipo: 'variable', tin: 1.99, tinSinBonificar: 2.49, diferencial: 0.65, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 1, vinculaciones: ['nómina/pensión', 'seguro hogar', 'seguro vida', 'seguro protección de pagos', 'plan de pensiones'] }
    ],
    extincionCondominio: {
      financia100: null, entradaTipica: null, facilidad: null,
      notas: 'No se encontró información específica sobre Deutsche Bank España en este tema. Dato no confirmado.',
      fuente: null
    },
    fuentes: ['https://www.deutsche-bank.es/es/particulares/financiacion/hipotecas.html']
  }
];

/* Nota EVO Banco: fusionado en Bankinter desde abril/julio de 2025, ya no
   comercializa hipotecas nuevas como marca independiente. Se ha sustituido
   en este comparador por Deutsche Bank España. Las hipotecas EVO ya
   firmadas mantienen sus condiciones originales (fuera del alcance de
   este simulador, pensado para nuevas operaciones). */

const BANCOS_RESUMEN_METODOLOGICO = `Ningún banco de los investigados publica en su web oficial una cifra concreta de "financiamos el 100% del exceso de adjudicación sin entrada" (excepto Unicaja, que habla de "casos especializados" no automáticos). El patrón general del mercado es aplicar el LTV estándar del banco (típicamente 80%) sobre el conjunto de la operación, lo que suele dejar un ~20% a cubrir con fondos propios. Los mensajes de "100% sin entrada" que circulan en internet proceden mayoritariamente de brokers/gestorías que venden ese servicio, no de los bancos. Bankinter y Kutxabank muestran la evidencia más consistente de ser restrictivos en estos casos; Unicaja es el único con comunicación oficial transparente sobre el tema.`;
