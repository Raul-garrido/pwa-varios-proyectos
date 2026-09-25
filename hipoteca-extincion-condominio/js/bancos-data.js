/* Base de datos de bancos e hipotecas — investigación ampliada (sept. 2026).
   Fuente: WebSearch (WebFetch a webs oficiales de bancos y a varios
   agregadores está bloqueado por política de red de este entorno; los
   datos son resúmenes de búsqueda que citan esas fuentes, no lectura
   directa). Cada banco incluye varios productos reales (no solo
   "fija/variable genéricas"): joven, aval ICO, segunda vivienda, verde,
   no residentes, etc., cada uno con SU PROPIO plazo máximo y edad máxima
   cuando difieren del estándar — no asumas 30 años para todo, varios
   productos tienen 25, 35 o 40 años, y varias edades máximas van de 70 a
   80 años según banco y producto.

   Cuando una fuente solo daba el diferencial de un producto variable sin
   el TIN combinado, se ha estimado el TIN con un Euríbor de referencia
   fijo (ver EURIBOR_REF) para que las cifras sean comparables entre sí;
   es una aproximación, no una cotización real del Euríbor.
   Verifica siempre TIN/TAE/comisiones exactos en la ficha FIPRE/FEIN
   oficial antes de decidir — cambian con frecuencia y varias cifras eran
   contradictorias entre fuentes (señalado en `nota` cuando aplica). */

const EURIBOR_REF = 2.30; // referencia interna solo para estimar TIN de productos variable sin TIN combinado publicado

const BANCOS = [
  // ===================================================================
  {
    id: 'caixabank', nombre: 'CaixaBank', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'cb-fija', nombre: 'Hipoteca CasaFácil Fijo', tipo: 'fija', tin: 2.85, tinSinBonificar: 3.85, plazoMaxAnios: 30, edadMaxima: 80, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina/pensión ≥600€ + 3 recibos', 'tarjeta CaixaBank'], nota: 'TIN varía algo por plazo (2,80% a 15-20 años, 2,85% a 30 años). Edad máxima: fuentes discrepan entre 75 y 80 años (regla "edad+plazo").' },
      { id: 'cb-var', nombre: 'Hipoteca Variable CaixaBank', tipo: 'variable', tin: 2.70, tinSinBonificar: 3.60, diferencial: 0.50, plazoMaxAnios: 30, edadMaxima: 80, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina/pensión', 'tarjeta', 'seguro hogar', 'seguro vida'] },
      { id: 'cb-joven', nombre: 'Hipoteca Joven CaixaBank (<36 años)', tipo: 'variable', tin: Math.round((EURIBOR_REF + 0.69) * 100) / 100, tinSinBonificar: Math.round((EURIBOR_REF + 1.4) * 100) / 100, diferencial: 0.69, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['<36 años', 'nómina', 'seguro hogar', 'seguro vida'], nota: 'Diferencial E+0,69% (oferta may-2026, el más bajo detectado del mercado en esa fecha). Combinable con Aval ICO para llegar a 100%.' },
      { id: 'cb-avalico', nombre: 'Aval ICO Vivienda Joven (CaixaBank)', tipo: 'variable', tin: Math.round((EURIBOR_REF + 0.69) * 100) / 100, tinSinBonificar: Math.round((EURIBOR_REF + 1.4) * 100) / 100, diferencial: 0.69, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 100, ltvMaxSegunda: 0, comisionApertura: 0, vinculaciones: ['<36 años (o familia con menores)', 'renta ≤37.800€/año', 'primera vivienda habitual', 'aval público gratuito 20% (25% si energía D+), 10 años'], nota: 'CaixaBank fue la primera entidad en firmar el convenio ICO (mayo 2024). Permite hasta el 100% de financiación real, no solo teórica: el aval cubre el 20-25% que falta sobre el 80% estándar.' },
      { id: 'cb-imagin', nombre: 'imagin Hipoteca Fija (filial digital)', tipo: 'fija', tin: 3.05, tinSinBonificar: 3.80, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina/pensión ≥1.200€', 'seguro hogar imagin', 'seguro vida imagin'], nota: 'Según una fuente, en Cataluña puede llegar al 100% para <36 años o VPO (no confirmado con fuente oficial imagin).' }
    ],
    extincionCondominio: {
      financia100: null, entradaTipica: 20, facilidad: 3,
      notas: 'Aplica su LTV estándar (80%) sobre el valor de tasación, no necesariamente sobre el 100% de la parte a compensar — un bróker cita literalmente "con La Caixa solo te financian el 80% del 50%". Sin evidencia de producto oficial al 100% para este caso concreto.',
      fuente: 'https://goanlegal.com/blog/condominio-hipoteca-la-caixa/ (bróker, sesgo comercial)'
    },
    fuentes: ['https://www.caixabank.es/particular/hipotecas/casafacil.html', 'https://www.caixabank.es/particular/hipotecas/aval-ico.html', 'https://www.rankia.com/blog/mejores-hipotecas/7463148-hipoteca-imagin']
  },
  // ===================================================================
  {
    id: 'santander', nombre: 'Banco Santander', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'sa-fija', nombre: 'Hipoteca Fija Santander', tipo: 'fija', tin: 2.96, tinSinBonificar: 3.96, plazoMaxAnios: 30, edadMaxima: 80, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina/pensión ≥1.000€', 'tarjeta/Bizum', 'seguro hogar', 'seguro protección de pagos'], nota: 'Segunda vivienda: plazo máximo reducido a 25 años.' },
      { id: 'sa-var', nombre: 'Hipoteca Variable Santander', tipo: 'variable', tin: 1.84, tinSinBonificar: Math.round((EURIBOR_REF + 1.84) * 100) / 100, diferencial: 0.74, plazoMaxAnios: 30, edadMaxima: 80, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina', 'seguro hogar', 'seguro vida', 'tarjeta'], nota: '1,84% TIN fijo primeros 6 meses, luego Euríbor+0,74% (bonificada) o +0,84% (vinculación mínima). Vinculación descrita como de las más exigentes del mercado.' },
      { id: 'sa-mixta', nombre: 'Hipoteca Mixta Santander', tipo: 'fija', tin: 2.34, tinSinBonificar: 3.34, plazoMaxAnios: 30, edadMaxima: 80, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina', 'seguros hogar/vida', 'certificado energético A/B (-0,10%)'], nota: 'Tramo fijo hasta 5,5 años al 2,34% TIN bonificado, luego Euríbor+0,74% bonificado (+1,74% sin bonificar).' },
      { id: 'sa-joven', nombre: 'Hipoteca Joven Santander (<35 años)', tipo: 'variable', tin: Math.round((EURIBOR_REF + 0.50) * 100) / 100, tinSinBonificar: Math.round((EURIBOR_REF + 1.50) * 100) / 100, diferencial: 0.50, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 95, ltvMaxSegunda: 0, comisionApertura: 0, vinculaciones: ['<35 años', 'nómina (-0,50pp)', 'tarjeta 6 usos/año', 'seguros hogar/vida/accidentes'], nota: 'Hasta 95% sin aval; combinable con Aval ICO para 95-100%.' },
      { id: 'sa-mundo', nombre: 'Hipoteca Mundo (no residentes)', tipo: 'fija', tin: 3.50, tinSinBonificar: 4.20, plazoMaxAnios: 20, edadMaxima: 75, ltvMaxHabitual: 70, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['no residente en España'], nota: 'Plazo más corto que residentes (fuentes discrepan entre 20 y 25 años). Tipos más altos.' }
    ],
    extincionCondominio: {
      financia100: false, entradaTipica: 20, facilidad: 2,
      notas: 'Encontrado con más detalle que antes: Santander puede calcular la financiación sobre el "valor de extinción" (compensación + saldo pendiente) en vez del valor de mercado, limitando a 70-80%. También puede exigir avalistas adicionales o negarse a liberar al copropietario saliente como deudor del préstamo original.',
      fuente: 'https://goanlegal.com/blog/hipoteca-extincion-condominio-santander/ (bróker, sesgo comercial)'
    },
    fuentes: ['https://www.kelisto.es/hipotecas-fijas/bancos/banco-santander/hipoteca-fija-online-santander-80', 'https://www.bbva.es/personas/productos/hipotecas/avales-ico-hipoteca-joven.html', 'https://www.helpmycash.com/hipotecas/santander/hipoteca-mundo-para-no-residentes/']
  },
  // ===================================================================
  {
    id: 'bbva', nombre: 'BBVA', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'bbva-fija', nombre: 'Hipoteca Fija BBVA', tipo: 'fija', tin: 2.45, tinSinBonificar: 3.95, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina', 'seguro hogar', 'seguro protección de pagos'], nota: 'TIN varía por plazo: ~2,00% (≤15a), ~2,20% (16-20a), ~2,30% (21-25a), ~2,45% (26-30a). Sin bonificar: 2,95% 6 primeros meses, 3,95% después.' },
      { id: 'bbva-var', nombre: 'Hipoteca Variable BBVA', tipo: 'variable', tin: 1.99, tinSinBonificar: Math.round((EURIBOR_REF + 1.60) * 100) / 100, diferencial: 0.60, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina ≥600€ (300€ autónomos/pensionistas)', 'seguro hogar', 'seguro amortización préstamo'], nota: '1,99% TIN primer año, luego Euríbor+0,60% bonificado (diferencial ~70pb por debajo de la mediana del mercado en 2026).' },
      { id: 'bbva-mixta', nombre: 'Hipoteca Mixta BBVA', tipo: 'fija', tin: 2.85, tinSinBonificar: 3.85, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina', 'seguros hogar/vida'], nota: '5 años fijo al 2,85%, luego Euríbor+1,60%.' },
      { id: 'bbva-joven', nombre: 'Hipoteca Joven BBVA (<36 años)', tipo: 'variable', tin: Math.round((EURIBOR_REF + 0.60) * 100) / 100, tinSinBonificar: Math.round((EURIBOR_REF + 1.60) * 100) / 100, diferencial: 0.60, plazoMaxAnios: 30, edadMaxima: 70, ltvMaxHabitual: 95, ltvMaxSegunda: 0, comisionApertura: 0, vinculaciones: ['<36 años', 'nómina', 'seguro hogar', 'seguro vida', 'plan de pensiones'], nota: '90-95% sin aval; con Aval ICO hasta 100%. Edad máxima más baja que la hipoteca estándar (70 vs 75 años).' },
      { id: 'bbva-avalico', nombre: 'Aval ICO Vivienda Joven (BBVA)', tipo: 'variable', tin: Math.round((EURIBOR_REF + 0.60) * 100) / 100, tinSinBonificar: Math.round((EURIBOR_REF + 1.60) * 100) / 100, diferencial: 0.60, plazoMaxAnios: 30, edadMaxima: 70, ltvMaxHabitual: 100, ltvMaxSegunda: 0, comisionApertura: 0, vinculaciones: ['<36 años (ningún titular >35)', 'máx. 2 titulares', 'renta ≤37.800€/año + incrementos por hijos'], nota: 'BBVA se adhirió el 28/05/2024. Hasta 100% sin aval de terceros. Vigente hasta 31/12/2027.' }
    ],
    extincionCondominio: {
      financia100: false, entradaTipica: 20, facilidad: 1,
      notas: '⚠ La evidencia MÁS CONCRETA con nombre de banco de toda la investigación, y va en contra: un caso documentado donde BBVA dijo inicialmente que aceptaría la extinción de condominio (con contrato indefinido) y luego LA RECHAZÓ, obligando a la clienta a cambiar de entidad. Otra fuente indica que BBVA financia solo el 80% de la parte adquirida en estos casos.',
      fuente: 'https://goanlegal.com/blog/extincion-de-condominio-hipoteca-bbva/'
    },
    fuentes: ['https://www.bbva.es/personas/productos/hipotecas/hipoteca-fija.html', 'https://www.bbva.es/personas/productos/hipotecas/hipoteca-joven.html', 'https://www.bbva.es/personas/productos/hipotecas/avales-ico-hipoteca-joven.html']
  },
  // ===================================================================
  {
    id: 'sabadell', nombre: 'Banco Sabadell', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'sab-fija', nombre: 'Hipoteca Fija Sabadell', tipo: 'fija', tin: 2.75, tinSinBonificar: 3.75, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina', 'seguro hogar', 'seguro vida', 'protección de pagos'], nota: 'Ejemplo 150.000€/30a: cuota bonificada 612€/mes vs 695€/mes sin bonificar.' },
      { id: 'sab-var', nombre: 'Hipoteca Variable Sabadell', tipo: 'variable', tin: 1.50, tinSinBonificar: Math.round((EURIBOR_REF + 1.50) * 100) / 100, diferencial: 0.50, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina', 'seguro hogar', 'seguro vida', 'protección de pagos'], nota: 'Uno de los diferenciales más bajos del mercado en sept-2026 (top-3 junto a Kutxabank y Bankinter).' },
      { id: 'sab-mixta', nombre: 'Hipoteca Mixta Sabadell', tipo: 'fija', tin: 2.90, tinSinBonificar: 3.90, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina', 'seguros hogar/vida'], nota: 'Tramo fijo elegible a 3, 5 o 7 años.' },
      { id: 'sab-primeravivienda', nombre: '"Mi Primera Vivienda" (aval Comunidad de Madrid)', tipo: 'variable', tin: Math.round((EURIBOR_REF + 0.60) * 100) / 100, tinSinBonificar: Math.round((EURIBOR_REF + 1.30) * 100) / 100, diferencial: 0.60, plazoMaxAnios: 30, edadMaxima: 65, ltvMaxHabitual: 100, ltvMaxSegunda: 0, comisionApertura: 0, vinculaciones: ['18-40 años (o familia numerosa/monoparental)', '2 años de residencia continuada en Madrid', 'no poseer otra vivienda', 'ahorro 10-12% para gastos'], nota: '100% de financiación REAL Y VERIFICADA (no solo teórica) para vivienda ≤390.000€ en la Comunidad de Madrid, vía aval autonómico (no es un aval del propio banco). +1.500 hipotecas avaladas desde 2022. Es el caso más claro de "100%" encontrado en toda la investigación — pero es una compra normal con aval regional, no un producto para extinción de condominio.' }
    ],
    extincionCondominio: {
      financia100: null, entradaTipica: null, facilidad: 3,
      notas: 'Sabadell tiene contenido propio (blog corporativo) explicando el proceso de novación/subrogación en extinción de condominio, pero sin publicar un % de financiación concreto: evaluación caso por caso (solvencia, cuota ≤30% de ingresos).',
      fuente: 'https://www.bancsabadell.com/bsnacional/ca/blog/que-es-le-extincio-del-condomini-i-com-es-realitza/'
    },
    fuentes: ['https://www.helpmycash.com/hipotecas/sabadell/hipoteca-fija-bonificada/', 'https://www.comunidad.madrid/vivienda/mi-primera-vivienda', 'https://www.rastreator.com/noticias/hipotecas/banco-sabadell-hipoteca-100-madrid']
  },
  // ===================================================================
  {
    id: 'bankinter', nombre: 'Bankinter', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'bk-fija', nombre: 'Hipoteca Fija Bankinter', tipo: 'fija', tin: 2.99, tinSinBonificar: 4.15, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 60, comisionApertura: 0.15, vinculaciones: ['nómina', 'seguro de vida Bankinter', 'seguro multirriesgo hogar Bankinter', 'plan de pensiones ≥600€/año'], nota: 'Comisión de apertura: fuentes contradictorias (500€ fijos vs 0,15%). Segunda vivienda: LTV máximo solo 60% (no 70%).' },
      { id: 'bk-var', nombre: 'Hipoteca Variable Bankinter', tipo: 'variable', tin: 2.30, tinSinBonificar: Math.round((EURIBOR_REF + 1.50) * 100) / 100, diferencial: 0.50, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 60, comisionApertura: 0.15, vinculaciones: ['nómina', 'seguro de vida Bankinter', 'seguro multirriesgo hogar Bankinter'] },
      { id: 'bk-sinmas', nombre: 'Hipoteca Sin Más', tipo: 'variable', tin: 2.79, tinSinBonificar: Math.round((EURIBOR_REF + 1.69) * 100) / 100, diferencial: 1.19, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 60, comisionApertura: 0, vinculaciones: ['nómina (-0,50%)', 'seguro hogar (-0,10%)', 'seguro vida (-0,60%)', 'plan pensiones (-0,10%)'], nota: 'Único titular de garantía real (la propia hipoteca), sin garantía personal adicional. Bankinter asume notaría/registro/AJD. Importe máximo 600.000€. Compensación por subrogación a otra entidad: 0,5% (5 primeros años) / 0,25% después.' },
      { id: 'bk-joven', nombre: 'Hipoteca Joven (Fija/Variable/Mixta/Dual)', tipo: 'variable', tin: Math.round((EURIBOR_REF + 0.50) * 100) / 100, tinSinBonificar: Math.round((EURIBOR_REF + 1.80) * 100) / 100, diferencial: 0.50, plazoMaxAnios: 40, edadMaxima: 75, ltvMaxHabitual: 90, ltvMaxSegunda: 0, comisionApertura: 0, vinculaciones: ['<36 años', 'ingresos conjuntos ≥2.000€/mes', 'nómina', 'seguro hogar', 'seguro vida', 'plan de pensiones'], nota: 'Plazo máximo 40 años (no 30) — el más largo detectado entre los productos "joven" investigados junto con ING.' },
      { id: 'bk-avalico', nombre: 'Hipoteca con Aval ICO (Bankinter)', tipo: 'variable', tin: Math.round((EURIBOR_REF + 0.50) * 100) / 100, tinSinBonificar: Math.round((EURIBOR_REF + 1.80) * 100) / 100, diferencial: 0.50, plazoMaxAnios: 40, edadMaxima: 75, ltvMaxHabitual: 100, ltvMaxSegunda: 0, comisionApertura: 0, vinculaciones: ['<36 años (o familia con menores)', 'residencia legal continuada ≥2 años', 'renta ≤37.800€/persona/año', 'patrimonio ≤100.000€'], nota: 'Lanzada oct-2024. Disponible sobre Fija, Variable, Mixta y Dual. Formalización de la línea de avales ampliada hasta 31/12/2027.' },
      { id: 'bk-100propio', nombre: 'Hipoteca 100% (solo inmuebles del propio banco)', tipo: 'variable', tin: Math.round((EURIBOR_REF + 1.0) * 100) / 100, tinSinBonificar: Math.round((EURIBOR_REF + 1.8) * 100) / 100, diferencial: 1.0, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 100, ltvMaxSegunda: 0, comisionApertura: 0, vinculaciones: ['inmueble del portal inmobiliario propio de Bankinter'], nota: 'Según fuente propia del banco, fuera de este caso y del Aval ICO, "Bankinter no ofrece hipotecas al 100%".' }
    ],
    extincionCondominio: {
      financia100: false, entradaTipica: 30, facilidad: 1,
      notas: '⚠ Confirmado de nuevo como uno de los MÁS restrictivos: "no suele financiar el 100% del valor necesario y es más estricto que otros bancos a la hora de liberar al cotitular". En un caso documentado propuso un préstamo personal en vez de ampliar la hipoteca.',
      fuente: 'https://goanlegal.com/blog/hipoteca-extincion-de-condominio-bankinter/'
    },
    fuentes: ['https://docs.bankinter.com/stf/plataformas/particulares/hipotecas/elija_su_hipoteca/tipos_de_hipoteca/hipoteca_sinmas/ficha_informacion_precontractual_hipoteca_sin_mas.pdf', 'https://www.idealista.com/news/finanzas/hipotecas/2024/10/16/820548', 'https://www.rankia.com/blog/mejores-hipotecas/7006791-hipoteca-bankinter-100']
  },
  // ===================================================================
  {
    id: 'ing', nombre: 'ING España', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'ing-fija', nombre: 'Hipoteca Naranja Fija', tipo: 'fija', tin: 3.75, tinSinBonificar: 4.35, plazoMaxAnios: 25, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina (≥600€/mes o saldo ≥2.000€)', 'seguro de vida ING', 'seguro de hogar ING'], nota: 'Plazo máximo 25 años (no 30) — distinto de la variable/mixta de ING, que sí llegan a 40.' },
      { id: 'ing-var', nombre: 'Hipoteca Naranja Variable', tipo: 'variable', tin: Math.round((EURIBOR_REF + 0.65) * 100) / 100, tinSinBonificar: Math.round((EURIBOR_REF + 1.65) * 100) / 100, diferencial: 0.65, plazoMaxAnios: 40, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina', 'seguro de vida ING', 'seguro de hogar ING'], nota: 'Plazo máximo 40 años, el más largo del mercado entre los estándar, siempre que ningún titular supere 75 años al vencimiento.' },
      { id: 'ing-mixta', nombre: 'Hipoteca Naranja Mixta', tipo: 'fija', tin: 2.45, tinSinBonificar: 3.45, plazoMaxAnios: 40, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina', 'seguro de vida ING', 'seguro de hogar ING'], nota: 'Tramo fijo elegible a 5, 10, 15 o 20 años; luego Euríbor+0,95%.' },
      { id: 'ing-joven', nombre: 'Hipoteca Joven ING (100%, <36 años)', tipo: 'variable', tin: Math.round((EURIBOR_REF + 0.65) * 100) / 100, tinSinBonificar: Math.round((EURIBOR_REF + 1.65) * 100) / 100, diferencial: 0.65, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 100, ltvMaxSegunda: 0, comisionApertura: 0, vinculaciones: ['<36 años', 'primera vivienda', 'al menos un titular con ingresos >1.500€/mes netos'], nota: 'Relanzada al 100% en oct-2024 (comunicado oficial), ampliando el 95% anterior. Importe máximo financiable: 400.000€. Sin comisión de apertura, cambio de condiciones ni subrogación. Es de los pocos productos "100%" de catálogo público sin aval externo obligatorio (aunque también admite Aval ICO).' }
    ],
    extincionCondominio: {
      financia100: null, entradaTipica: null, facilidad: 2,
      notas: 'Evidencia mixta: testimonios de foro confirman que ING SÍ ha aprobado novaciones para extinción de condominio (un caso con tipo 1,99% pero ~7.500€ de gastos), aunque sin confirmar el % de financiación exacto obtenido. Otras fuentes lo describen como reacio a liberar a un codeudor sin exigir aportaciones o productos extra.',
      fuente: 'https://www.rankia.com/foros/hipotecas/temas/4506691-extincion-condominio-hipoteca-ing (testimonios de usuarios)'
    },
    fuentes: ['https://www.ing.es/hipotecas/hipoteca-fija', 'https://www.ing.es/sobre-ing/sala-prensa/ing-concede-hipotecas-jovenes-a-menores-de-36', 'https://www.ing.es/sobre-ing/pdf/InfPrecontractualFIPRE.pdf']
  },
  // ===================================================================
  {
    id: 'openbank', nombre: 'Openbank', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'ob-fija', nombre: 'Hipoteca Open Fija', tipo: 'fija', tin: 2.36, tinSinBonificar: 2.96, plazoMaxAnios: 30, edadMaxima: 80, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina/pensión ≥900€/mes', 'seguro hogar Openbank', 'seguro vida Openbank'], nota: 'TIN varía por plazo (más bajo a ≤15 años, más alto a 26-30 años). Edad máxima: regla combinada "edad+plazo ≤80 años".' },
      { id: 'ob-var', nombre: 'Hipoteca Open Variable', tipo: 'variable', tin: 2.00, tinSinBonificar: 2.50, diferencial: 0.65, plazoMaxAnios: 30, edadMaxima: 80, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina/pensión ≥900€/mes', 'seguro hogar Openbank', 'seguro vida Openbank'] },
      { id: 'ob-mixta', nombre: 'Hipoteca Open Mixta', tipo: 'fija', tin: 1.05, tinSinBonificar: 1.60, plazoMaxAnios: 30, edadMaxima: 80, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina/pensión', 'seguro hogar Openbank', 'seguro vida Openbank'], nota: 'Tramo fijo primeros 10 años. Cifras de campaña que pueden no reflejar la oferta vigente — contrastar en openbank.es.' },
      { id: 'ob-segunda', nombre: 'Hipoteca Segunda Vivienda', tipo: 'fija', tin: 2.80, tinSinBonificar: 3.30, plazoMaxAnios: 25, edadMaxima: 80, ltvMaxHabitual: 70, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina/pensión/ingresos periódicos ≥900€/mes'], nota: 'Plazo máximo 25 años (no 30). LTV 70% (no 80%). Producto con página propia distinta de la vivienda habitual.' },
      { id: 'ob-joven', nombre: 'Hipoteca Joven Openbank (≤35 años)', tipo: 'variable', tin: Math.round((EURIBOR_REF + 0.65) * 100) / 100, tinSinBonificar: Math.round((EURIBOR_REF + 1.15) * 100) / 100, diferencial: 0.65, plazoMaxAnios: 30, edadMaxima: 80, ltvMaxHabitual: 90, ltvMaxSegunda: 0, comisionApertura: 0, vinculaciones: ['≤35 años', 'edad+plazo ≤80 años', 'nómina', 'seguro hogar'], nota: 'Hasta 90% (vs 80% estándar). No confirmado si Openbank está adherido al Aval ICO (no aparece en los listados de entidades consultados).' }
    ],
    extincionCondominio: {
      financia100: null, entradaTipica: null, facilidad: null,
      notas: 'No se encontró ningún testimonio ni artículo que mencione a Openbank específicamente en relación con extinción de condominio, ni a favor ni en contra. Dato no confirmado.',
      fuente: null
    },
    fuentes: ['https://www.openbank.es/hipoteca-fija', 'https://www.openbank.es/hipoteca-segunda-vivienda', 'https://www.acierto.com/hipotecas/hipotecas-openbank/']
  },
  // ===================================================================
  {
    id: 'unicaja', nombre: 'Unicaja Banco', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'un-fija', nombre: 'Hipoteca Fija Unicaja', tipo: 'fija', tin: 3.10, tinSinBonificar: 3.85, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0.15, vinculaciones: ['nómina', 'seguro hogar', 'seguro vida'], nota: 'Segunda vivienda: plazo máximo 25 años (no 30). Edad máxima: regla "edad+plazo" ≤75 años (habitual) / ≤70 (segunda).' },
      { id: 'un-var', nombre: 'Hipoteca Variable Unicaja', tipo: 'variable', tin: 2.20, tinSinBonificar: Math.round((EURIBOR_REF + 1.65) * 100) / 100, diferencial: 0.65, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0.15, vinculaciones: ['nómina', 'seguro hogar', 'seguro vida'] },
      { id: 'un-mixta', nombre: 'Hipoteca Mixta Unicaja', tipo: 'fija', tin: 2.75, tinSinBonificar: 4.05, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0.15, vinculaciones: ['nómina ≥600€/mes', 'domiciliación de recibos', 'consumo mínimo con tarjeta'], nota: 'Primeros 10 años fijo al 2,75%, luego Euríbor+0,80%. Bonificación hasta 1,30 puntos si ingresos ≥2.500€/mes.' },
      { id: 'un-joven', nombre: 'Hipoteca Joven Unicaja (18-35 años)', tipo: 'variable', tin: 2.20, tinSinBonificar: Math.round((EURIBOR_REF + 1.65) * 100) / 100, diferencial: 0.65, plazoMaxAnios: 35, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0.15, vinculaciones: ['18-35 años (o familia con menores, sin límite de edad)', 'nómina', 'seguro hogar', 'seguro vida'], nota: 'Plazo máximo 35 años (no 30) sin aval. Con Aval ICO: 95-100% según Comunidad Autónoma.' },
      { id: 'un-avalico', nombre: 'Aval ICO / Línea Avales Primera Vivienda (Unicaja)', tipo: 'variable', tin: 2.20, tinSinBonificar: Math.round((EURIBOR_REF + 1.65) * 100) / 100, diferencial: 0.65, plazoMaxAnios: 35, edadMaxima: 75, ltvMaxHabitual: 100, ltvMaxSegunda: 0, comisionApertura: 0.15, vinculaciones: ['18-35 años (o familia con menores)', 'primera vivienda habitual'], nota: 'Unicaja se adhirió en junio de 2024. Hasta 100% del menor entre tasación/compra según Comunidad Autónoma.' },
      { id: 'un-oxigeno', nombre: 'Hipoteca Oxígeno (verde/sostenible)', tipo: 'variable', tin: 2.10, tinSinBonificar: Math.round((EURIBOR_REF + 1.65) * 100) / 100, diferencial: 0.65, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0.15, vinculaciones: ['certificado energético A', 'nómina conjunta ≥3.000€ (o pensión)', 'seguro hogar', 'seguro vida', 'tarjeta de crédito', 'fondo de inversión'], nota: 'Único banco de los 12 con nombre de marca propio para su hipoteca verde. Bonificación de -0,10 puntos (una fuente secundaria menos fiable dice -1%, probable error).' }
    ],
    extincionCondominio: {
      financia100: null, entradaTipica: null, facilidad: 5,
      notas: '✔ Sigue siendo el ÚNICO banco con página oficial de preguntas frecuentes dedicada específicamente a extinción de condominio, donde indica que "en algunos casos especializados puede llegar a cubrir el 100% de la operación, incluyendo los gastos" (evaluación de perfil, no automático). También aparece en un listado genérico de brókers como uno de los bancos "con mayor probabilidad de aprobar este tipo de operación".',
      fuente: 'https://www.unicajabanco.es/es/faqs/hipotecas/extincion-de-condominio (fuente oficial del banco)'
    },
    fuentes: ['https://www.unicajabanco.es/es/faqs/hipotecas/extincion-de-condominio', 'https://www.unicajabanco.es/en/particulares/hipotecas-y-prestamos/hipotecas/hipoteca-joven', 'https://www.unicajabanco.es/en/particulares/hipotecas-y-prestamos/hipotecas/hipoteca-oxigeno']
  },
  // ===================================================================
  {
    id: 'abanca', nombre: 'Abanca', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'ab-fija', nombre: 'Hipoteca Mari Carmen Fija', tipo: 'fija', tin: 2.85, tinSinBonificar: 3.85, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 60, comisionApertura: 0, vinculaciones: ['nómina', 'seguro hogar', 'seguro vida'], nota: 'No se puede contratar si el titular ya tiene más de 60 años al inicio, según una fuente.' },
      { id: 'ab-var', nombre: 'Hipoteca Mari Carmen Variable', tipo: 'variable', tin: 2.60, tinSinBonificar: Math.round((EURIBOR_REF + 1.60) * 100) / 100, diferencial: 0.60, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 60, comisionApertura: 0, vinculaciones: ['nómina', 'seguro hogar', 'seguro vida'] },
      { id: 'ab-mixta', nombre: 'Hipoteca Mari Carmen Mixta', tipo: 'fija', tin: 2.15, tinSinBonificar: 3.00, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 60, comisionApertura: 0, vinculaciones: ['nómina', '24 compras/año con tarjeta', 'seguro vida', 'seguro hogar'], nota: 'Primeros 5 años fijo al 2,15% bonificado, luego Euríbor+0,60%.' },
      { id: 'ab-joven', nombre: 'Hipoteca Joven Abanca', tipo: 'variable', tin: 2.60, tinSinBonificar: Math.round((EURIBOR_REF + 1.60) * 100) / 100, diferencial: 0.60, plazoMaxAnios: 40, edadMaxima: 75, ltvMaxHabitual: 95, ltvMaxSegunda: 0, comisionApertura: 0, vinculaciones: ['<36 años (o <45 en CCAA con convenio propio)', 'nómina 600-2.500€/mes', 'seguro hogar', 'seguro vida'], nota: 'Plazo máximo 40 años. Hasta 100% en CCAA con convenio propio (Galicia, Madrid, País Vasco, La Rioja, Baleares citadas); 95-97,5% en el resto. Combinable con Aval ICO.' },
      { id: 'ab-escogecasa', nombre: 'Hipoteca EscogeCasa (inmuebles del propio banco)', tipo: 'variable', tin: 2.10, tinSinBonificar: Math.round((EURIBOR_REF + 1.20) * 100) / 100, diferencial: 0.60, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 100, ltvMaxSegunda: 60, comisionApertura: 0, vinculaciones: ['nómina', 'tarjeta crédito y débito', 'seguro vida', 'seguro hogar', 'seguro desempleo', 'plan de pensiones', 'saldo mínimo 24.000€ depositado'], nota: '100% para primera vivienda propiedad de Abanca / 60% para segunda vivienda. Vinculación muy exigente (7 productos).' }
    ],
    extincionCondominio: {
      financia100: null, entradaTipica: null, facilidad: null,
      notas: 'No se encontró documento propio de Abanca sobre extinción de condominio, ni testimonios con nombre propio del banco. Los brokers especializados (que sí nombran a Santander/Bankinter/Ibercaja) no tienen contenido dedicado a Abanca en este tema, lo que sugiere que no destacan acuerdos con esta entidad para este caso. Dato no confirmado.',
      fuente: null
    },
    fuentes: ['https://abanca.com/es/hipotecas/hipoteca-maricarmen/', 'https://abanca.com/es/hipotecas/hipoteca-joven/', 'https://www.helpmycash.com/blog/escogecasa-la-hipoteca-de-pisos-de-bancos-mas-barata/']
  },
  // ===================================================================
  {
    id: 'kutxabank', nombre: 'Kutxabank', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'ku-fija', nombre: 'Hipoteca Fija Kutxabank', tipo: 'fija', tin: 2.70, tinSinBonificar: 4.20, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina', 'seguro hogar', 'seguro vida/amortización'], nota: 'Edad máxima: regla combinada "edad+plazo" ≤75 años (habitual) / ≤70 (segunda vivienda) — no una edad fija.' },
      { id: 'ku-var', nombre: 'Hipoteca Variable Kutxabank', tipo: 'variable', tin: 2.00, tinSinBonificar: Math.round((EURIBOR_REF + 1.20) * 100) / 100, diferencial: 0.49, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina', 'seguro hogar'], nota: 'TIN 2% primer año, luego Euríbor+0,49% (uno de los diferenciales más bajos del mercado). Sin comisión de apertura en ninguna hipoteca Kutxabank.' },
      { id: 'ku-joven', nombre: 'Hipoteca Joven Kutxabank (18-34 años)', tipo: 'variable', tin: 1.75, tinSinBonificar: Math.round((EURIBOR_REF + 1.20) * 100) / 100, diferencial: 0.49, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['18-34 años', 'nómina domiciliada conjunta ≥3.000€', 'aportación anual ≥2.400€ a plan de pensiones Kutxabank', 'seguro hogar'], nota: 'Con Aval ICO: 95-100%, sin comisión de apertura. El descuento adicional de -0,25% deja de aplicar si algún titular supera 35 años.' },
      { id: 'ku-primeravivienda', nombre: '"Mi Primera Vivienda" (aval Comunidad de Madrid)', tipo: 'variable', tin: 2.20, tinSinBonificar: Math.round((EURIBOR_REF + 1.20) * 100) / 100, diferencial: 0.49, plazoMaxAnios: 30, edadMaxima: 65, ltvMaxHabitual: 100, ltvMaxSegunda: 0, comisionApertura: 0, vinculaciones: ['<40 años', 'residencia en Madrid ≥2 años', 'primera vivienda', 'precio máx. 425.000€'], nota: '100% de financiación con aval regional. Sin límite de edad para familias numerosas/monoparentales o nacimiento/adopción durante la vigencia.' }
    ],
    extincionCondominio: {
      financia100: false, entradaTipica: null, facilidad: 1,
      notas: '⚠ Sigue siendo de los más restrictivos: caso real documentado donde, ante una necesidad de 30.000€ para compensar tras una separación, Kutxabank NO amplió la hipoteca y propuso trasladar el plan de pensiones y un préstamo personal en su lugar. Un único caso, pero es la evidencia más concreta encontrada para este banco.',
      fuente: 'https://www.rankia.com/foros/hipotecas/temas/5172054-subrogar-hipoteca-ampliacion-credito-extincion-condominio (testimonio de usuario)'
    },
    fuentes: ['https://clientes.kutxabank.es/es/hipotecas/variable.html', 'https://clientes.kutxabank.es/es/hipotecas/guia-hipotecaria/', 'https://comunidad.madrid/noticias/2026/09/02']
  },
  // ===================================================================
  {
    id: 'mediolanum', nombre: 'Banco Mediolanum', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'med-var', nombre: 'Hipoteca Freedom Variable', tipo: 'variable', tin: 1.50, tinSinBonificar: Math.round((EURIBOR_REF + 1.49) * 100) / 100, diferencial: 0.79, plazoMaxAnios: 30, edadMaxima: 80, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 1, vinculaciones: ['cuenta corriente en Mediolanum', 'ingresos recurrentes', 'seguro de vida'], nota: 'TIN 1,50% fijo primer año, luego Euríbor+0,79% con vinculación (+1,49% sin ella). Plazo condicionado a no superar 80 años de edad al final — el límite de edad más alto detectado en el mercado.' },
      { id: 'med-mixta', nombre: 'Hipoteca Freedom Mixta', tipo: 'fija', tin: 1.99, tinSinBonificar: 1.99, plazoMaxAnios: 30, edadMaxima: 80, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 1, vinculaciones: ['cuenta corriente en Mediolanum', 'seguro de vida', 'domiciliación de nómina'], nota: 'Año 1: 1,99% TIN; años 2-5: 2,50% (bonificada) o 3,20% (sin condiciones); desde año 6: Euríbor+0,79% (bonificada) o +1,49% (sin condiciones).' },
      { id: 'med-green', nombre: 'Hipoteca Freedom Green Variable', tipo: 'variable', tin: 1.50, tinSinBonificar: Math.round((EURIBOR_REF + 1.0) * 100) / 100, diferencial: 0.50, plazoMaxAnios: 30, edadMaxima: 80, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 1, vinculaciones: ['certificado energético B o superior', 'seguro de vida con el banco'], nota: 'Año 1: 1,50% fijo; desde año 2 con condiciones: Euríbor+0,50%.' },
      { id: 'med-greenmixta', nombre: 'Hipoteca Freedom Green Mixta', tipo: 'fija', tin: 1.99, tinSinBonificar: 2.75, plazoMaxAnios: 30, edadMaxima: 80, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 1, vinculaciones: ['certificado energético B o superior', 'seguro de vida', 'domiciliación de nómina'], nota: 'Año 1: 1,99%; años 2-5: 2,75% (sin condiciones); desde año 6: Euríbor+0,94%.' }
    ],
    extincionCondominio: {
      financia100: null, entradaTipica: null, facilidad: null,
      notas: 'Catálogo de producto mucho más reducido que el resto (solo familia "Freedom", sin joven/ICO/no residentes/segunda vivienda con nombre propio). Sin ninguna mención en ningún resultado sobre extinción de condominio. Dato no confirmado.',
      fuente: null
    },
    fuentes: ['https://www.bancomediolanum.es/es-ES/pdf/HipotecaFreedomVariable.pdf', 'https://www.bancomediolanum.es/es/w/financiacion/hipotecas/hipoteca-freedom-mixta', 'https://www.bancomediolanum.es/es-ES/financiacion/hipotecas/hipoteca-freedom-green-variable.html']
  },
  // ===================================================================
  {
    id: 'deutsche', nombre: 'Deutsche Bank España', verificado: 'con reservas', fechaConsulta: '2026-09',
    productos: [
      { id: 'db-fija', nombre: 'HipoteCasa Fija', tipo: 'fija', tin: 3.30, tinSinBonificar: 4.30, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina/pensión', 'seguro hogar', 'seguro vida', 'tarjeta ≥3.000€/año'] },
      { id: 'db-var', nombre: 'HipoteCasa Variable', tipo: 'variable', tin: 1.96, tinSinBonificar: Math.round((EURIBOR_REF + 0.70) * 100) / 100, diferencial: 0.49, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 1, vinculaciones: ['nómina/pensión', 'seguro hogar', 'seguro vida'] },
      { id: 'db-mixta', nombre: 'Hipoteca Mixta Protección DB', tipo: 'fija', tin: 2.75, tinSinBonificar: 3.60, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['nómina/pensión', 'seguro hogar', 'seguro vida', 'seguro protección de pagos'], nota: 'Fijo primeros 5 años (2,75-2,95%), luego Euríbor+0,70% a +0,85%.' },
      { id: 'db-sostenible', nombre: 'Hipoteca Sostenible DB (verde)', tipo: 'fija', tin: 2.20, tinSinBonificar: 3.30, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 80, ltvMaxSegunda: 70, comisionApertura: 0, vinculaciones: ['certificado energético A o B', 'nómina + 3 recibos domiciliados', 'tarjeta débito y crédito', 'seguro hogar', 'seguro vida'], nota: 'También disponible en variable (TIN 2% primer año, luego Euríbor+1,40%). Importe mínimo 20.000€. Cifras de 2022 (lanzamiento), verificar vigencia.' },
      { id: 'db-funcionarios', nombre: 'Hipoteca Funcionarios DB (100%)', tipo: 'variable', tin: Math.round((EURIBOR_REF + 0.70) * 100) / 100, tinSinBonificar: Math.round((EURIBOR_REF + 1.20) * 100) / 100, diferencial: 0.70, plazoMaxAnios: 30, edadMaxima: 75, ltvMaxHabitual: 100, ltvMaxSegunda: 0, comisionApertura: 0, vinculaciones: ['funcionario público'], nota: 'Financia hasta el 100% del valor de la vivienda para funcionarios — excepción al 80% estándar del banco. TIN/TAE exactos no confirmados con precisión.' }
    ],
    extincionCondominio: {
      financia100: null, entradaTipica: null, facilidad: null,
      notas: '⭐ El hallazgo más relevante para tu pregunta: Deutsche Bank comercializó una "Hipoteca Ligera db" que SÍ financiaba hasta el 100% del valor de la vivienda (Euríbor+1,25%, hasta 40 años), incluyendo aparentemente viviendas propiedad del propio banco. Varias fuentes coinciden en que este producto YA NO SE COMERCIALIZA ("existía antes esta posibilidad... pero ya no se comercializa"). Ninguna fuente confirma que se usara específicamente para extinción de condominio (era un producto general de 100%), pero es lo más parecido a "un banco que antes sí daba el 100%" que ha aparecido en toda la investigación — es plausible que sea el recuerdo al que te refieres.',
      fuente: 'https://www.helpmycash.com/hipotecas/deutsche-bank/hipoteca-ligera-db/ (producto discontinuado)'
    },
    fuentes: ['https://www.kelisto.es/hipotecas-variables/bancos/deutsche-bank/hipotecasa-db', 'https://www.deutsche-bank.es/es/particulares/financiacion/hipotecas/mixta-proteccion.html', 'https://www.deutsche-bank.es/es/particulares/financiacion/hipotecas/hipoteca-sostenible-db.html']
  }
];

/* Nota EVO Banco: fusionado en Bankinter desde abril/julio de 2025, ya no
   comercializa hipotecas nuevas como marca independiente. Se ha sustituido
   en este comparador por Deutsche Bank España. Las hipotecas EVO ya
   firmadas mantienen sus condiciones originales (fuera del alcance de
   este simulador, pensado para nuevas operaciones). */

const BANCOS_RESUMEN_METODOLOGICO = `Tras una segunda ronda de investigación mucho más exhaustiva (12 bancos, ~40 productos distintos, decenas de búsquedas cruzadas), la conclusión sobre "financiación 100% en extinción de condominio" se mantiene y se refuerza: NINGÚN banco de los investigados publica hoy una política oficial de financiar al 100% una extinción de condominio. El patrón dominante es aplicar el LTV estándar (típicamente 80%) sobre la parte a adquirir, dejando un ~20% a cubrir con fondos propios. La evidencia con nombre propio de banco es mayoritariamente NEGATIVA: BBVA (rechazó un caso tras aceptarlo inicialmente), Bankinter y Kutxabank (casos documentados donde no ampliaron la hipoteca y ofrecieron préstamo personal en su lugar), Santander (limita al valor de "extinción" con 70-80% LTV). Unicaja sigue siendo el único con comunicación oficial transparente sobre el tema ("casos especializados" hasta 100%, no automático). El 100% cuando se consigue en el mercado suele venir de BRÓKERS HIPOTECARIOS con acuerdos privados no publicados (goanlegal, brokersfinance, hipotecanova), no de catálogo bancario. El caso más parecido a "un banco que antes sí daba el 100%" es la "Hipoteca Ligera db" de Deutsche Bank — un producto general de 100% financiación, ya discontinuado, sin confirmación de que se usara específicamente para extinción de condominio. Aparte de esto, el 100% real y verificado que SÍ existe hoy en el mercado viene de programas ajenos a la extinción de condominio: el Aval ICO estatal (jóvenes <36 años) y el programa autonómico "Mi Primera Vivienda" de la Comunidad de Madrid (Sabadell y Kutxabank adheridos, entre otros) — ambos pensados para comprar una primera vivienda, no para liquidar una copropiedad.`;
