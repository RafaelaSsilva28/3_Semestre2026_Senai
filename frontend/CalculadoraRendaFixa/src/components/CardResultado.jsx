import './CardResultado.css'

// Função auxiliar para formatar valores em moeda brasileira
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    })
}

// Função auxiliar para formatar percentuais
function formatarPorcentagem(valor) {
    return valor.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + '%'
}

// Mapa de cores por tipo de investimento
const coresMap = {
    amber: {
        gradiente: 'linear-gradient(135deg, #f59e0b, #d97706)',
        barra: '#f59e0b',
        texto: '#f59e0b',
    },
    blue: {
        gradiente: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        barra: '#3b82f6',
        texto: '#60a5fa',
    },
    green: {
        gradiente: 'linear-gradient(135deg, #22c55e, #16a34a)',
        barra: '#22c55e',
        texto: '#4ade80',
    },
}

function CardResultado({ nome, capital, totalAportado = 0, rendimentoBruto, valorIR, aliquotaIR, valorIOF, cor = 'amber' }) {
    const cores = coresMap[cor] || coresMap.amber

    // Cálculos derivados
    const totalInvestido = capital + totalAportado
    const totalDeducoes = (valorIR ?? 0) + (valorIOF ?? 0)
    const rendimentoLiquido = rendimentoBruto - totalDeducoes
    const totalFinal = totalInvestido + rendimentoLiquido

    // A rentabilidade compara o rendimento líquido com o total de dinheiro colocado (capital inicial + todos os aportes mensais)
    const percentualRentabilidade = totalInvestido > 0 ? (rendimentoLiquido / totalInvestido) * 100 : 0

    const temDeducoes = (valorIR > 0) || (valorIOF > 0)

    return (
        <div className="card-resultado">
            {/* Cabeçalho colorido */}
            <div className="card-cabecalho" style={{ background: cores.gradiente }}>
                <h3>{nome}</h3>
            </div>

            <div className="card-corpo">
                {/* Grade principal: Valor Total e Rendimento Líquido */}
                <div className="card-grade-principal">
                    <div className="card-metrica azul">
                        <p className="metrica-label">Valor Total Líquido</p>
                        <p className="metrica-valor">{formatarMoeda(totalFinal)}</p>
                    </div>
                    <div className="card-metrica verde">
                        <p className="metrica-label">Rendimento Líquido</p>
                        <p className="metrica-valor verde-texto">{formatarMoeda(rendimentoLiquido)}</p>
                    </div>
                </div>

                {/* Barra de rentabilidade */}
                <div className="card-barra-container">
                    <div className="barra-topo">
                        <span>Rentabilidade do Investimento</span>
                        <span style={{ color: cores.texto }}>{formatarPorcentagem(percentualRentabilidade)}</span>
                    </div>
                    <div className="barra-fundo">
                        <div
                            className="barra-preenchimento"
                            style={{
                                width: `${Math.min(percentualRentabilidade, 100)}%`,
                                backgroundColor: cores.barra,
                            }}
                        />
                    </div>
                </div>

                {/* Detalhamento */}
                <div className="card-detalhes">
                    <div className="detalhe-linha">
                        <span>Capital Inicial</span>
                        <span>{formatarMoeda(capital)}</span>
                    </div>
                    {totalAportado > 0 && (
                        <div className="detalhe-linha">
                            <span>Total de Aportes Adicionais</span>
                            <span>{formatarMoeda(totalAportado)}</span>
                        </div>
                    )}
                    <div className="detalhe-linha borda-abaixo">
                        <span><strong>Total de Dinheiro Investido</strong></span>
                        <span><strong>{formatarMoeda(totalInvestido)}</strong></span>
                    </div>

                    {rendimentoBruto > 0 && (
                        <div className="detalhe-linha">
                            <span>Rendimento Bruto</span>
                            <span className="verde-texto">{formatarMoeda(rendimentoBruto)}</span>
                        </div>
                    )}
                </div>

                {/* Deduções (IR e IOF) - só aparece se houver */}
                {temDeducoes && (
                    <div className="card-deducoes">
                        <p className="deducoes-titulo">⚠️ Deduções</p>
                        {valorIR > 0 && (
                            <div className="detalhe-linha">
                                <span>
                                    Imposto de Renda
                                    {aliquotaIR && (
                                        <span className="badge-ir">{formatarPorcentagem(aliquotaIR)}</span>
                                    )}
                                </span>
                                <span className="vermelho-texto">-{formatarMoeda(valorIR)}</span>
                            </div>
                        )}
                        {valorIOF > 0 && (
                            <div className="detalhe-linha">
                                <span>IOF</span>
                                <span className="vermelho-texto">-{formatarMoeda(valorIOF)}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CardResultado
