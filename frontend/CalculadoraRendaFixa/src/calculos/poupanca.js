// ===========================================
// CÁLCULO DA POUPANÇA
// ===========================================

import { calcularJurosCompostos, calcularJurosAportesMensais } from './finance'

export function calcularDiasCheiosPoupanca(dias) {
    const diasPorMes = 30
    if (dias < diasPorMes) return 0
    return Math.floor(dias / diasPorMes) * diasPorMes
}

function getTaxaDiariaPoupanca(taxaMensal) {
    return Math.pow(taxaMensal / 100 + 1, 1 / 30)
}

/**
 * Calcula o resultado da Poupança (com ou sem aporte mensal)
 * Poupança é isenta de IR e IOF para pessoa física
 * @param {number} capital - Valor investido em R$
 * @param {number} taxaMensal - Taxa mensal da poupança (%)
 * @param {number} dias - Período do investimento em dias
 * @param {number} aporteMensal - Aporte mensal em R$ (0 = sem aportes)
 * @returns {{ rendimentoBruto, totalAportado }} - Resultado
 */
export function calcularPoupanca(capital, taxaMensal, dias, aporteMensal = 0) {
    const taxaDiaria = getTaxaDiariaPoupanca(taxaMensal)
    const diasCheios = calcularDiasCheiosPoupanca(dias)

    // Rendimento do capital inicial
    const rendimentoCapital = calcularJurosCompostos(capital, taxaDiaria, diasCheios)

    // Meses inteiros
    const meses = Math.floor(dias / 30)

    // A taxa mensal em formato decimal já está disponível
    const taxaMensalDecimal = taxaMensal / 100

    // Rendimento dos aportes
    const rendimentoAportes = calcularJurosAportesMensais(aporteMensal, taxaMensalDecimal, meses)

    // Total aportado
    const totalAportado = aporteMensal * meses

    const rendimentoBruto = Number((rendimentoCapital + rendimentoAportes).toFixed(2))

    return { rendimentoBruto, totalAportado }
}
