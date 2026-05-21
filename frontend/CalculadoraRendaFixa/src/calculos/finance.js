// ===========================================
// FUNÇÕES FINANCEIRAS BÁSICAS
// ===========================================

/**
 * Calcula juros compostos
 * @param {number} capital - Valor investido
 * @param {number} taxaDiaria - Taxa diária (ex: 1.0003 para 0.03% ao dia)
 * @param {number} dias - Número de dias do investimento
 * @returns {number} - Valor dos juros (sem o capital)
 */
export function calcularJurosCompostos(capital, taxaDiaria, dias) {
    const juros = capital * Math.pow(taxaDiaria, dias) - capital
    return Number(juros.toFixed(2))
}

/**
 * Calcula o valor futuro (juros) gerado por aportes mensais regulares
 * Usa a fórmula de valor futuro de anuidade:
 *   FV = aporte × ((1 + r)^n - 1) / r
 * onde r = taxa mensal e n = número de meses
 *
 * @param {number} aporteMensal - Valor depositado todo mês
 * @param {number} taxaMensal - Taxa mensal (decimal, ex: 0.009 = 0,9% a.m.)
 * @param {number} meses - Número de meses
 * @returns {number} - Total dos juros gerados pelos aportes (sem o capital aportado)
 */
export function calcularJurosAportesMensais(aporteMensal, taxaMensal, meses) {
    if (aporteMensal <= 0 || meses <= 0 || taxaMensal <= 0) return 0

    // Valor futuro total (aportes + juros)
    const fvTotal = aporteMensal * (Math.pow(1 + taxaMensal, meses) - 1) / taxaMensal

    // Remove o total aportado para obter só os juros
    const totalAportado = aporteMensal * meses
    const juros = fvTotal - totalAportado

    return Number(juros.toFixed(2))
}

/**
 * Retorna a alíquota de IR conforme o prazo (tabela regressiva)
 * @param {number} dias - Número de dias do investimento
 * @returns {number} - Alíquota de IR em %
 */
export function getAliquotaIR(dias) {
    if (dias <= 180) return 22.5
    if (dias <= 360) return 20.0
    if (dias <= 720) return 17.5
    return 15.0
}

/**
 * Retorna o percentual de IOF conforme o dia de resgate (tabela padrão)
 * @param {number} dias - Número de dias do investimento
 * @returns {number} - Percentual de IOF em %
 */
export function getPercentualIOF(dias) {
    const tabelaIOF = [
        96, 93, 90, 86, 83, 80, 76, 73, 70, 66,
        63, 60, 56, 53, 50, 46, 43, 40, 36, 33,
        30, 26, 23, 20, 16, 13, 10, 6, 3, 0,
    ]
    if (dias >= 1 && dias <= 30) {
        return tabelaIOF[dias - 1] ?? 0
    }
    return 0
}

/**
 * Calcula o valor do IOF sobre os rendimentos
 * @param {number} dias - Número de dias
 * @param {number} rendimentoBruto - Rendimento bruto em R$
 * @returns {number} - Valor do IOF em R$
 */
export function calcularIOF(dias, rendimentoBruto) {
    const percentual = getPercentualIOF(dias)
    return rendimentoBruto * (percentual / 100)
}
