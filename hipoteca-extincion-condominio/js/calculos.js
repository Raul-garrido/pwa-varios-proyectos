/* Motor de cálculo: amortización francesa, aranceles notariales/registrales
   orientativos y lógica de extinción de condominio. Sin dependencias. */

const Calc = (() => {

  function euro(n) {
    if (!isFinite(n)) return '—';
    return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  }
  function euro2(n) {
    if (!isFinite(n)) return '—';
    return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });
  }
  function pct(n, dec = 2) {
    if (!isFinite(n)) return '—';
    return n.toLocaleString('es-ES', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + ' %';
  }

  // Arancel notarial orientativo (escala RD 1426/1989 simplificada, tipos marginales por tramo de cuantía)
  function arancelNotarial(valor) {
    if (valor <= 0) return 90.15;
    const tramos = [
      { limite: 6010.12, base: 90.15, tipo: 0 },
      { limite: 30050.61, base: 90.15, tipo: 0.0045 },
      { limite: 60101.21, base: 90.15 + 0.0045 * (30050.61 - 6010.12), tipo: 0.003 },
      { limite: 150253.03, base: 90.15 + 0.0045 * (30050.61 - 6010.12) + 0.003 * (60101.21 - 30050.61), tipo: 0.002 },
      { limite: 601012.10, base: 90.15 + 0.0045 * (30050.61 - 6010.12) + 0.003 * (60101.21 - 30050.61) + 0.002 * (150253.03 - 60101.21), tipo: 0.001 },
      { limite: Infinity, base: 90.15 + 0.0045 * (30050.61 - 6010.12) + 0.003 * (60101.21 - 30050.61) + 0.002 * (150253.03 - 60101.21) + 0.001 * (601012.10 - 150253.03), tipo: 0.00065 },
    ];
    let honorario = 90.15;
    for (let i = 0; i < tramos.length; i++) {
      const inf = i === 0 ? 0 : tramos[i - 1].limite;
      if (valor > inf) {
        const tramoActual = tramos[i];
        const excesoInf = i === 0 ? 0 : inf;
        honorario = tramoActual.base + tramoActual.tipo * (Math.min(valor, tramoActual.limite) - excesoInf);
      }
    }
    // Suplidos aproximados: folios, copias, diligencias
    const suplidos = 60;
    return Math.round((honorario + suplidos) * 100) / 100;
  }

  // Arancel registral orientativo (escala RD 1427/1989 simplificada)
  function arancelRegistral(valor) {
    if (valor <= 0) return 24.04;
    const tramos = [
      { limite: 6010.12, base: 24.04, tipo: 0 },
      { limite: 30050.61, base: 24.04, tipo: 0.0175 },
      { limite: 60101.21, base: 24.04 + 0.0175 * (30050.61 - 6010.12), tipo: 0.0125 },
      { limite: 150253.03, base: 24.04 + 0.0175 * (30050.61 - 6010.12) + 0.0125 * (60101.21 - 30050.61), tipo: 0.0075 },
      { limite: 601012.10, base: 24.04 + 0.0175 * (30050.61 - 6010.12) + 0.0125 * (60101.21 - 30050.61) + 0.0075 * (150253.03 - 60101.21), tipo: 0.003 },
      { limite: Infinity, base: 24.04 + 0.0175 * (30050.61 - 6010.12) + 0.0125 * (60101.21 - 30050.61) + 0.0075 * (150253.03 - 60101.21) + 0.003 * (601012.10 - 150253.03), tipo: 0.002 },
    ];
    let honorario = 24.04;
    for (let i = 0; i < tramos.length; i++) {
      const inf = i === 0 ? 0 : tramos[i - 1].limite;
      if (valor > inf) {
        const tramoActual = tramos[i];
        const excesoInf = i === 0 ? 0 : inf;
        honorario = tramoActual.base + tramoActual.tipo * (Math.min(valor, tramoActual.limite) - excesoInf);
      }
    }
    // Bonificación legal habitual del 5% sobre honorarios + suplidos aprox
    honorario = honorario * 0.95;
    const suplidos = 30;
    return Math.round((honorario + suplidos) * 100) / 100;
  }

  // Sistema de amortización francés (cuota constante)
  function amortizacionFrancesa(capital, tinAnualPct, anios, extraAnual = 0) {
    const n = Math.round(anios * 12);
    const i = (tinAnualPct / 100) / 12;
    if (capital <= 0 || n <= 0) {
      return { cuotaMensual: 0, totalIntereses: 0, totalPagado: 0, tablaAnual: [], anosReales: 0 };
    }
    const cuota = i === 0 ? capital / n : capital * i / (1 - Math.pow(1 + i, -n));
    let pendiente = capital;
    let totalIntereses = 0;
    let totalAmortizado = 0;
    const tablaAnual = [];
    let mes = 0;
    let anio = 0;
    while (pendiente > 0.5 && mes < n + 1200) {
      let interesesAnio = 0;
      let amortizadoAnio = 0;
      let cuotaAnio = 0;
      anio++;
      for (let m = 1; m <= 12 && pendiente > 0.5 && mes < n; m++) {
        mes++;
        const interesMes = pendiente * i;
        let amortMes = cuota - interesMes;
        if (amortMes > pendiente) amortMes = pendiente;
        pendiente -= amortMes;
        interesesAnio += interesMes;
        amortizadoAnio += amortMes;
        cuotaAnio += (interesMes + amortMes);
      }
      // amortización anticipada anual opcional (reduce capital, no reduce plazo -> reduce cuota futura recalculando)
      if (extraAnual > 0 && pendiente > 0.5) {
        const extra = Math.min(extraAnual, pendiente);
        pendiente -= extra;
        amortizadoAnio += extra;
        cuotaAnio += extra;
      }
      totalIntereses += interesesAnio;
      totalAmortizado += amortizadoAnio;
      tablaAnual.push({
        anio, cuotaAnio, interesesAnio, amortizadoAnio,
        pendiente: Math.max(pendiente, 0)
      });
      if (mes >= n && pendiente <= 0.5) break;
      if (anio > anios + 60) break; // salvaguarda
    }
    return {
      cuotaMensual: cuota,
      totalIntereses,
      totalPagado: capital + totalIntereses,
      tablaAnual,
      anosReales: tablaAnual.length
    };
  }

  // Extinción de condominio: reparto de cuotas, compensación y capital a financiar
  function calcularExtincionCondominio({ valorVivienda, hipotecaPendiente, propietarios, quienSeQueda, aportacionPropia }) {
    // propietarios: [{ id, nombre, porcentaje }]
    const sumaPct = propietarios.reduce((a, p) => a + p.porcentaje, 0);
    const salientes = propietarios.filter(p => p.id !== quienSeQueda);
    const detalleSalientes = salientes.map(p => {
      const valorCuota = valorVivienda * (p.porcentaje / 100);
      const deudaCuota = hipotecaPendiente * (p.porcentaje / 100);
      const compensacionNeta = valorCuota - deudaCuota;
      return { ...p, valorCuota, deudaCuota, compensacionNeta };
    });
    const compensacionTotal = detalleSalientes.reduce((a, p) => a + p.compensacionNeta, 0);
    const porcentajeAdquirido = salientes.reduce((a, p) => a + p.porcentaje, 0);
    const baseImponibleAJD = valorVivienda * (porcentajeAdquirido / 100); // valor de la(s) cuota(s) adquirida(s)
    const capitalNecesario = hipotecaPendiente + compensacionTotal - (aportacionPropia || 0);
    return {
      sumaPct, detalleSalientes, compensacionTotal, porcentajeAdquirido,
      baseImponibleAJD, capitalNecesario
    };
  }

  return { euro, euro2, pct, arancelNotarial, arancelRegistral, amortizacionFrancesa, calcularExtincionCondominio };
})();
