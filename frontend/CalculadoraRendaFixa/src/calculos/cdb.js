// ===========================================
// CÁLCULO DO CDB / RDB / LC
// ===========================================

import { calcularJurosCompostos, calcularJurosAportesMensais, getAliquotaIR, calcularIOF } from './finance'

function getTaxaDiariaCDB(percentualDI, taxaDI) {
    const index = percentualDI / 100
    return Math.pow((index * taxaDI) / 100 + 1, 1 / 365)
}

/**
 * Calcula o resultado do CDB/RDB/LC (com ou sem aporte mensal)
 * @param {number} capital - Valor investido em R$
 * @param {number} taxaDI - Taxa DI anual (%)
 * @param {number} percentualDI - Percentual do CDI contratado (ex: 100 = 100% CDI)
 * @param {number} dias - Período do investimento em dias
 * @param {number} aporteMensal - Aporte mensal em R$ (0 = sem aportes)
 * @returns {{ rendimentoBruto, valorIR, aliquotaIR, valorIOF, totalAportado }}
 */
export function calcularCDB(capital, taxaDI, percentualDI, dias, aporteMensal = 0) {
    const taxaDiaria = getTaxaDiariaCDB(percentualDI, taxaDI)

    // Rendimento do capital inicial
    const rendimentoCapital = calcularJurosCompostos(capital, taxaDiaria, dias)

    // Taxa mensal equivalente à taxa diária
    const taxaMensal = Math.pow(taxaDiaria, 30) - 1

    // Número de meses inteiros no período
    const meses = Math.floor(dias / 30)

    // Rendimento gerado pelos aportes mensais
    const rendimentoAportes = calcularJurosAportesMensais(aporteMensal, taxaMensal, meses)

    // Total de aportes depositados
    const totalAportado = aporteMensal * meses

    // Rendimento bruto total (capital + aportes)
    const rendimentoBruto = Number((rendimentoCapital + rendimentoAportes).toFixed(2))

    // IR e IOF aplicados sobre o rendimento total
    const aliquotaIR = getAliquotaIR(dias)
    const valorIOF = calcularIOF(dias, rendimentoBruto)
    const valorIR = (rendimentoBruto - valorIOF) * (aliquotaIR / 100)

    return { rendimentoBruto, valorIR, aliquotaIR, valorIOF, totalAportado }
}
