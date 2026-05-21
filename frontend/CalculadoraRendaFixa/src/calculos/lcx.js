//lcx.js
// ===========================================
// CÁLCULO DO LCI / LCA (isento de IR)
// ===========================================

import { calcularJurosCompostos, calcularJurosAportesMensais } from './finance'

function getTaxaDiariaLCx(percentualDI, taxaDI) {
    const index = percentualDI / 100
    return Math.pow((index * taxaDI) / 100 + 1, 1 / 365)
}

/**
 * Calcula o resultado do LCI/LCA (com ou sem aporte mensal)
 * LCI/LCA são isentos de IR e IOF para pessoa física
 * @param {number} capital - Valor investido em R$
 * @param {number} taxaDI - Taxa DI anual (%)
 * @param {number} percentualDI - Percentual do CDI contratado
 * @param {number} dias - Período do investimento em dias
 * @param {number} aporteMensal - Aporte mensal em R$ (0 = sem aportes)
 * @returns {{ rendimentoBruto, totalAportado }}
 */
export function calcularLCx(capital, taxaDI, percentualDI, dias, aporteMensal = 0) {
    const taxaDiaria = getTaxaDiariaLCx(percentualDI, taxaDI)

    // Rendimento do capital inicial
    const rendimentoCapital = calcularJurosCompostos(capital, taxaDiaria, dias)

    // Taxa mensal equivalente
    const taxaMensal = Math.pow(taxaDiaria, 30) - 1

    // Meses inteiros no período
    const meses = Math.floor(dias / 30)

    // Rendimento dos aportes
    const rendimentoAportes = calcularJurosAportesMensais(aporteMensal, taxaMensal, meses)

    // Total aportado
    const totalAportado = aporteMensal * meses

    const rendimentoBruto = Number((rendimentoCapital + rendimentoAportes).toFixed(2))

    return { rendimentoBruto, totalAportado }
}
