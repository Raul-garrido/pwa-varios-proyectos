/* Interactividad de la PWA: extinción de condominio + comparador de hipotecas */

(() => {
  const $ = (id) => document.getElementById(id);

  // ---------------------------------------------------------------------
  // ESTADO: copropietarios
  // ---------------------------------------------------------------------
  let propietarios = [
    { id: 'p1', nombre: 'Propietario A', porcentaje: 50 },
    { id: 'p2', nombre: 'Propietario B', porcentaje: 50 }
  ];
  let quienSeQueda = 'p1';
  let nextPropId = 3;

  function renderPropietarios() {
    const list = $('ec-propietarios-list');
    list.innerHTML = '';
    propietarios.forEach((p) => {
      const row = document.createElement('div');
      row.className = 'propietario-row';
      row.innerHTML = `
        <input type="text" data-field="nombre" data-id="${p.id}" value="${p.nombre}">
        <input type="number" data-field="porcentaje" data-id="${p.id}" value="${p.porcentaje}" min="0" max="100" step="0.5">
        <button type="button" class="btn-remove" data-remove="${p.id}" title="Eliminar" ${propietarios.length <= 2 ? 'disabled' : ''}>✕</button>
      `;
      list.appendChild(row);
    });

    list.querySelectorAll('input[data-field="nombre"]').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const p = propietarios.find(x => x.id === e.target.dataset.id);
        p.nombre = e.target.value;
        renderQuienSeQuedaOptions();
        recalcExtincion();
      });
    });
    list.querySelectorAll('input[data-field="porcentaje"]').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const p = propietarios.find(x => x.id === e.target.dataset.id);
        p.porcentaje = parseFloat(e.target.value) || 0;
        recalcExtincion();
      });
    });
    list.querySelectorAll('button[data-remove]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.remove;
        if (propietarios.length <= 2) return;
        propietarios = propietarios.filter(p => p.id !== id);
        if (quienSeQueda === id) quienSeQueda = propietarios[0].id;
        renderPropietarios();
        renderQuienSeQuedaOptions();
        recalcExtincion();
      });
    });
  }

  function renderQuienSeQuedaOptions() {
    const sel = $('ec-quien-se-queda');
    const prev = quienSeQueda;
    sel.innerHTML = propietarios.map(p => `<option value="${p.id}">${p.nombre || p.id}</option>`).join('');
    sel.value = propietarios.some(p => p.id === prev) ? prev : propietarios[0].id;
    quienSeQueda = sel.value;
  }

  $('ec-add-propietario').addEventListener('click', () => {
    const id = 'p' + (nextPropId++);
    propietarios.push({ id, nombre: 'Propietario ' + id.slice(1), porcentaje: 0 });
    renderPropietarios();
    renderQuienSeQuedaOptions();
    recalcExtincion();
  });

  $('ec-quien-se-queda').addEventListener('change', (e) => {
    quienSeQueda = e.target.value;
    recalcExtincion();
  });

  // ---------------------------------------------------------------------
  // SECCIÓN 1: EXTINCIÓN DE CONDOMINIO
  // ---------------------------------------------------------------------
  let ultimoResultadoExtincion = null;

  function gastosExtincion({ baseImponibleAJD, ubicacion, excesoNoProporcional, requiereTasacion }) {
    const fisc = FISCALIDAD[ubicacion];
    const items = [];
    const ajdImporte = baseImponibleAJD * (fisc.ajdExtincionCondominio / 100);
    items.push({ concepto: `AJD extinción de condominio (${fisc.ajdExtincionCondominio}% sobre ${Calc.euro(baseImponibleAJD)})`, importe: ajdImporte });
    items.push({ concepto: 'Notaría (arancel orientativo)', importe: Calc.arancelNotarial(baseImponibleAJD) });
    items.push({ concepto: 'Registro de la Propiedad (arancel orientativo)', importe: Calc.arancelRegistral(baseImponibleAJD) });
    items.push({ concepto: 'Gestoría', importe: GASTOS_GENERICOS.gestoriaExtincion });
    if (requiereTasacion) {
      items.push({ concepto: 'Tasación de la vivienda (exigida por el banco)', importe: GASTOS_GENERICOS.tasacionVivienda });
    }
    if (excesoNoProporcional) {
      items.push({ concepto: 'Plusvalía municipal (IIVTNU) — estimación por exceso de adjudicación no proporcional', importe: Math.round(baseImponibleAJD * 0.02) });
    } else {
      items.push({ concepto: 'Plusvalía municipal (IIVTNU) — no se devenga (reparto proporcional a las cuotas)', importe: 0 });
    }
    return items;
  }

  function recalcExtincion() {
    const valorVivienda = parseFloat($('ec-valor').value) || 0;
    const hipotecaPendiente = parseFloat($('ec-hipoteca-pendiente').value) || 0;
    const aportacionPropia = parseFloat($('ec-aportacion').value) || 0;
    const ubicacion = $('ec-ubicacion').value;
    const excesoNoProporcional = $('ec-exceso-no-proporcional').checked;
    const requiereTasacion = $('ec-requiere-tasacion').checked;

    const sumaPct = propietarios.reduce((a, p) => a + p.porcentaje, 0);
    const detalleDiv = $('ec-detalle-salientes');

    if (Math.abs(sumaPct - 100) > 0.01) {
      detalleDiv.innerHTML = `<p style="color:#b23b3b;font-weight:600;">⚠ Los porcentajes de los copropietarios deben sumar 100% (actualmente suman ${sumaPct}%).</p>`;
      $('ec-compensacion-total').textContent = '—';
      $('ec-hipoteca-asumida').textContent = '—';
      $('ec-capital-necesario').textContent = '—';
      $('ec-tabla-gastos').innerHTML = '';
      $('ec-total-gastos').textContent = '—';
      ultimoResultadoExtincion = null;
      updateResumenGlobal();
      return;
    }

    const r = Calc.calcularExtincionCondominio({
      valorVivienda, hipotecaPendiente, propietarios, quienSeQueda, aportacionPropia
    });

    detalleDiv.innerHTML = r.detalleSalientes.map(p => `
      <div class="detalle-item">
        <strong>${p.nombre} (${p.porcentaje}%)</strong>
        Valor de su cuota: ${Calc.euro(p.valorCuota)} · Deuda hipotecaria de su cuota: ${Calc.euro(p.deudaCuota)}
        <br>Compensación neta a recibir: <strong>${Calc.euro(p.compensacionNeta)}</strong>
      </div>
    `).join('') || '<p>El propietario que se queda la vivienda no debe compensar a nadie más.</p>';

    $('ec-compensacion-total').textContent = Calc.euro(r.compensacionTotal);
    $('ec-hipoteca-asumida').textContent = Calc.euro(hipotecaPendiente);
    $('ec-capital-necesario').textContent = Calc.euro(Math.max(r.capitalNecesario, 0));

    const items = gastosExtincion({ baseImponibleAJD: r.baseImponibleAJD, ubicacion, excesoNoProporcional, requiereTasacion });
    $('ec-tabla-gastos').innerHTML = items.map(it => `<tr><td>${it.concepto}</td><td>${Calc.euro2(it.importe)}</td></tr>`).join('');
    const totalGastos = items.reduce((a, it) => a + it.importe, 0);
    $('ec-total-gastos').textContent = Calc.euro2(totalGastos);

    $('ec-nota-fiscal').textContent = fisc => '';
    $('ec-nota-fiscal').innerHTML = `Ubicación: ${FISCALIDAD[ubicacion].nombre}. Base imponible AJD = valor de la(s) cuota(s) adquirida(s), no el 100% del inmueble (criterio STS 1484/2018).`;

    ultimoResultadoExtincion = {
      valorVivienda, hipotecaPendiente, compensacionTotal: r.compensacionTotal,
      capitalNecesario: Math.max(r.capitalNecesario, 0), totalGastos, ubicacion
    };
    updateResumenGlobal();
  }

  ['ec-valor', 'ec-hipoteca-pendiente', 'ec-aportacion', 'ec-ubicacion', 'ec-exceso-no-proporcional', 'ec-requiere-tasacion']
    .forEach(id => $(id).addEventListener('input', recalcExtincion));

  $('ec-usar-en-hipoteca').addEventListener('click', () => {
    if (!ultimoResultadoExtincion) return;
    $('hi-precio').value = ultimoResultadoExtincion.valorVivienda;
    const pct = ultimoResultadoExtincion.valorVivienda > 0
      ? Math.min(100, Math.round((ultimoResultadoExtincion.capitalNecesario / ultimoResultadoExtincion.valorVivienda) * 100))
      : 80;
    $('hi-porcentaje').value = pct;
    $('hi-porcentaje-range').value = pct;
    $('hi-ubicacion').value = ultimoResultadoExtincion.ubicacion;
    $('hi-tipo-operacion').value = 'extincion';
    recalcHipoteca();
    document.getElementById('seccion-hipoteca').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ---------------------------------------------------------------------
  // SECCIÓN 2: COMPARADOR DE HIPOTECAS
  // ---------------------------------------------------------------------
  function populateBancoSelect() {
    const sel = $('hi-banco');
    sel.innerHTML = BANCOS.map(b => `<option value="${b.id}">${b.nombre}</option>`).join('');
  }

  function populateProductoSelect() {
    const bancoId = $('hi-banco').value;
    const banco = BANCOS.find(b => b.id === bancoId);
    const sel = $('hi-producto');
    sel.innerHTML = banco.productos.map(p => `<option value="${p.id}">${p.nombre} (${p.tipo === 'fija' ? 'Fija' : 'Variable'})</option>`).join('');
  }

  function productoActual() {
    const banco = BANCOS.find(b => b.id === $('hi-banco').value);
    const producto = banco.productos.find(p => p.id === $('hi-producto').value);
    return { banco, producto };
  }

  let ultimoResultadoHipoteca = null;

  function gastosHipoteca({ producto, capital, precio, tipoOperacion, ubicacion, viviendaNueva, baseImponibleImpuesto }) {
    const fisc = FISCALIDAD[ubicacion];
    const items = [];
    items.push({ concepto: 'Tasación de la vivienda (a cargo del cliente)', importe: GASTOS_GENERICOS.tasacionVivienda });
    const comisionApertura = capital * (producto.comisionApertura / 100);
    items.push({ concepto: `Comisión de apertura (${producto.comisionApertura}%)`, importe: comisionApertura });
    items.push({ concepto: 'AJD constitución hipoteca, notaría, registro y gestoría (a cargo del banco, Ley 5/2019)', importe: 0 });

    if (tipoOperacion === 'extincion') {
      items.push({ concepto: 'AJD, notaría, registro y gestoría de la extinción de condominio (ya incluidos en la Sección 1, no se duplican aquí)', importe: 0 });
    } else if (viviendaNueva) {
      items.push({ concepto: `IVA vivienda nueva (${fisc.ivaViviendaNueva}%)`, importe: precio * (fisc.ivaViviendaNueva / 100) });
      items.push({ concepto: `AJD compraventa vivienda nueva (${fisc.ajdViviendaNueva}%)`, importe: precio * (fisc.ajdViviendaNueva / 100) });
    } else {
      items.push({ concepto: `ITP compraventa vivienda usada (${fisc.itpViviendaUsada}% general — puede haber tipos reducidos, ver notas de datos)`, importe: precio * (fisc.itpViviendaUsada / 100) });
    }
    return items;
  }

  function recalcHipoteca() {
    const { banco, producto } = productoActual();
    const tipoOperacion = $('hi-tipo-operacion').value;
    const precio = parseFloat($('hi-precio').value) || 0;
    const edad = parseFloat($('hi-edad').value) || 18;
    const ubicacion = $('hi-ubicacion').value;
    const viviendaNueva = $('hi-vivienda-nueva').checked;
    const extraAnual = parseFloat($('hi-extra-anual').value) || 0;

    const ltvMax = producto.ltvMaxHabitual;
    $('hi-porcentaje').max = ltvMax;
    $('hi-porcentaje-range').max = ltvMax;
    let porcentaje = parseFloat($('hi-porcentaje').value) || 0;
    if (porcentaje > ltvMax) { porcentaje = ltvMax; $('hi-porcentaje').value = ltvMax; }
    $('hi-porcentaje-range').value = porcentaje;
    $('hi-ltv-hint').textContent = `Máximo financiable por ${banco.nombre} en este producto: ${ltvMax}% del valor de tasación.`;

    const plazoMaxPorEdad = Math.max(1, producto.edadMaxima - edad);
    const plazoMax = Math.min(producto.plazoMaxAnios, plazoMaxPorEdad);
    $('hi-plazo').max = plazoMax;
    $('hi-plazo-range').max = plazoMax;
    let plazo = parseFloat($('hi-plazo').value) || 1;
    if (plazo > plazoMax) { plazo = plazoMax; $('hi-plazo').value = plazoMax; }
    $('hi-plazo-range').value = plazo;
    $('hi-plazo-hint').textContent = `Plazo máximo: ${producto.plazoMaxAnios} años, limitado a ${plazoMax} años por la edad máxima del banco (${producto.edadMaxima} años).`;

    $('hi-producto-info').textContent = (producto.tipo === 'variable'
      ? `TIN ${producto.tin}% (Euríbor + ${producto.diferencial}%) con todas las bonificaciones · sin bonificar: ${producto.tinSinBonificar}% · vinculaciones: ${producto.vinculaciones.join(', ')}`
      : `TIN fijo ${producto.tin}% con todas las bonificaciones · sin bonificar: ${producto.tinSinBonificar}% · vinculaciones: ${producto.vinculaciones.join(', ')}`)
      + ` · Datos consultados ${banco.fechaConsulta} (${banco.verificado}), verificar en la ficha FIPRE/FEIN oficial antes de decidir.`;

    const capital = precio * (porcentaje / 100);
    const entrada = precio - capital;
    const baseImponibleImpuesto = tipoOperacion === 'extincion' ? capital : precio;

    const amort = Calc.amortizacionFrancesa(capital, producto.tin, plazo, extraAnual);

    $('hi-capital').textContent = Calc.euro(capital);
    $('hi-entrada').textContent = Calc.euro(entrada);
    $('hi-tin').textContent = Calc.pct(producto.tin);
    $('hi-cuota').textContent = Calc.euro2(amort.cuotaMensual) + ' /mes';
    $('hi-intereses').textContent = Calc.euro(amort.totalIntereses);
    $('hi-total-pagado').textContent = Calc.euro(amort.totalPagado);

    $('hi-tabla-amortizacion').innerHTML = amort.tablaAnual.map(row => `
      <tr>
        <td>${row.anio}</td>
        <td>${Calc.euro2(row.cuotaAnio)}</td>
        <td>${Calc.euro2(row.interesesAnio)}</td>
        <td>${Calc.euro2(row.amortizadoAnio)}</td>
        <td>${Calc.euro2(row.pendiente)}</td>
      </tr>
    `).join('');

    const items = gastosHipoteca({ producto, capital, precio, tipoOperacion, ubicacion, viviendaNueva, baseImponibleImpuesto });
    $('hi-tabla-gastos').innerHTML = items.map(it => `<tr><td>${it.concepto}</td><td>${Calc.euro2(it.importe)}</td></tr>`).join('');
    const totalGastosHipoteca = items.reduce((a, it) => a + it.importe, 0);
    $('hi-total-gastos').textContent = Calc.euro2(totalGastosHipoteca);

    ultimoResultadoHipoteca = {
      capital, entrada, cuotaMensual: amort.cuotaMensual, totalIntereses: amort.totalIntereses,
      totalPagado: amort.totalPagado, totalGastos: totalGastosHipoteca, plazo
    };
    updateResumenGlobal();
  }

  $('hi-banco').addEventListener('change', () => { populateProductoSelect(); recalcHipoteca(); });
  ['hi-producto', 'hi-tipo-operacion', 'hi-precio', 'hi-edad', 'hi-ubicacion', 'hi-vivienda-nueva', 'hi-extra-anual']
    .forEach(id => $(id).addEventListener('input', recalcHipoteca));

  // sliders <-> number inputs sincronizados
  function syncPair(rangeId, numberId) {
    $(rangeId).addEventListener('input', () => { $(numberId).value = $(rangeId).value; recalcHipoteca(); });
    $(numberId).addEventListener('input', () => { $(rangeId).value = $(numberId).value; recalcHipoteca(); });
  }
  syncPair('hi-porcentaje-range', 'hi-porcentaje');
  syncPair('hi-plazo-range', 'hi-plazo');

  // ---------------------------------------------------------------------
  // ANÁLISIS DE BANCOS EN EXTINCIÓN DE CONDOMINIO
  // ---------------------------------------------------------------------
  function renderAnalisisBancos() {
    const tbody = $('tabla-analisis-bancos');
    const ordenados = [...BANCOS].sort((a, b) => (b.extincionCondominio.facilidad || 0) - (a.extincionCondominio.facilidad || 0));
    tbody.innerHTML = ordenados.map(b => {
      const ec = b.extincionCondominio;
      const facilidadTxt = ec.facilidad == null ? 'Sin evidencia' : '★'.repeat(ec.facilidad) + '☆'.repeat(5 - ec.facilidad);
      const facilidadClass = ec.facilidad >= 4 ? 'facilidad-alta' : ec.facilidad >= 2 ? 'facilidad-media' : ec.facilidad != null ? 'facilidad-baja' : '';
      const financia100 = ec.financia100 === true ? 'Sí' : ec.financia100 === false ? 'No (evidencia)' : 'Sin confirmar';
      const entrada = ec.entradaTipica == null ? '—' : '~' + ec.entradaTipica + '%';
      const notaConFuente = (ec.notas || '') + (ec.fuente ? ` <em>[Fuente: ${ec.fuente}]</em>` : '');
      return `<tr>
        <td>${b.nombre}</td>
        <td>${financia100}</td>
        <td>${entrada}</td>
        <td class="${facilidadClass}">${facilidadTxt}</td>
        <td>${notaConFuente}</td>
      </tr>`;
    }).join('');
    const desc = document.querySelector('.analisis-bancos .panel-desc');
    if (desc) desc.textContent = BANCOS_RESUMEN_METODOLOGICO;
  }

  // ---------------------------------------------------------------------
  // RESUMEN GLOBAL
  // ---------------------------------------------------------------------
  function updateResumenGlobal() {
    const ec = ultimoResultadoExtincion;
    const hi = ultimoResultadoHipoteca;

    $('rs-gastos-extincion').textContent = ec ? Calc.euro(ec.totalGastos) : '—';
    $('rs-gastos-hipoteca').textContent = hi ? Calc.euro(hi.totalGastos) : '—';
    const totalGastos = (ec ? ec.totalGastos : 0) + (hi ? hi.totalGastos : 0);
    $('rs-total-gastos').textContent = Calc.euro(totalGastos);

    const entradaHipoteca = hi ? hi.entrada : 0;
    const gastosNoFinanciables = totalGastos; // se asumen en efectivo salvo que el usuario los cubra aparte
    $('rs-entrada').textContent = Calc.euro(entradaHipoteca + gastosNoFinanciables);

    $('rs-capital-final').textContent = hi ? Calc.euro(hi.capital) : '—';
    $('rs-cuota').textContent = hi ? Calc.euro2(hi.cuotaMensual) + ' /mes' : '—';
    $('rs-plazo').textContent = hi ? hi.plazo + ' años' : '—';
    $('rs-intereses').textContent = hi ? Calc.euro(hi.totalIntereses) : '—';
  }

  // ---------------------------------------------------------------------
  // MODAL DE FUENTES
  // ---------------------------------------------------------------------
  function renderFuentes() {
    const cont = $('fuentes-contenido');
    let html = '<p><strong>⚠️ Limitación de esta investigación:</strong> el acceso directo (WebFetch) a las webs oficiales de bancos, comunidad.madrid y boe.es está bloqueado por política de red de este entorno (confirmado, no es un fallo puntual). Cada cifra fiscal se ha cruzado con WebSearch contra 3-6 fuentes independientes entre sí (comparadores fiscales especializados, el criterio del Tribunal Supremo y de la DGT), por lo que la confianza es alta aunque no sea lectura directa del BOE. Verifica siempre las cifras exactas de tu caso con una gestoría o notaría antes de decidir.</p>';
    html += '<h4>Fiscalidad — Notas generales</h4><ul>' + FISCALIDAD_NOTAS_GENERALES.map(n => `<li>${n}</li>`).join('') + '</ul>';
    Object.values(FISCALIDAD).forEach(f => {
      html += `<h4>${f.nombre}${f.verificado === true ? ' ✔ cruzado con varias fuentes' : f.verificado === 'parcial' ? ' (parcialmente verificado)' : ''}</h4>`;
      if (f.notaReducidos) html += `<p><em>${f.notaReducidos}</em></p>`;
      html += '<ul>';
      html += f.fuentes.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.texto}</a></li>`).join('');
      html += '</ul>';
    });
    html += '<h4>Bancos — metodología</h4><p>' + BANCOS_RESUMEN_METODOLOGICO + '</p>';
    html += '<h4>Bancos — fuentes por entidad</h4><ul>';
    BANCOS.forEach(b => {
      html += `<li><strong>${b.nombre}</strong> (consultado ${b.fechaConsulta}): ` +
        b.fuentes.map(u => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`).join(' · ') +
        (b.extincionCondominio.fuente ? `<br>Extinción de condominio: ${b.extincionCondominio.fuente}` : '') +
        '</li>';
    });
    html += '</ul>';
    cont.innerHTML = html;
  }
  $('link-fuentes').addEventListener('click', (e) => { e.preventDefault(); renderFuentes(); $('fuentes-modal').classList.add('open'); });
  $('cerrar-fuentes').addEventListener('click', () => $('fuentes-modal').classList.remove('open'));
  $('fuentes-modal').addEventListener('click', (e) => { if (e.target.id === 'fuentes-modal') $('fuentes-modal').classList.remove('open'); });

  // ---------------------------------------------------------------------
  // INIT
  // ---------------------------------------------------------------------
  renderPropietarios();
  renderQuienSeQuedaOptions();
  populateBancoSelect();
  populateProductoSelect();
  renderAnalisisBancos();
  recalcExtincion();
  recalcHipoteca();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
})();
