import { useEffect, useState } from 'react'
import CardResultado from '../components/CardResultado'
import { calcularCDB } from '../calculos/cdb'
import { calcularLCx } from '../calculos/lcx'
import { calcularPoupanca } from '../calculos/poupanca'
import indicadores from '../dados/indicadores'
import './Calculadora.css'

function Calculadora() {
    // ------------------------------------------
    // ESTADOS com useState
    // Cada variável de estado possui um valor e uma função para atualizá-lo
    // ------------------------------------------
    const [capital, setCapital] = useState(1000)
    const [aporteMensal, setAporteMensal] = useState(0) // <-- NOVO ESTADO AQUI
    const [periodo, setPeriodo] = useState(360)
    const [tipoPeriodo, setTipoPeriodo] = useState('dias')
    const [taxaDI, setTaxaDI] = useState(indicadores.cdi.valor)
    const [percentualCDB, setPercentualCDB] = useState(100)
    const [percentualLCx, setPercentualLCx] = useState(100)
    const taxaPoupanca = indicadores.poupanca.valor // valor fixo

    // ------------------------------------------
    // CÁLCULO DOS DIAS
    // Converte o período para dias conforme o tipo
    // Este cálculo roda toda vez que o componente
    // renderiza (sempre que qualquer estado muda)
    // ------------------------------------------
    let diasTotal = periodo
    if (tipoPeriodo === 'meses') diasTotal = Math.floor(periodo * (365 / 12))
    if (tipoPeriodo === 'anos') diasTotal = Math.floor(periodo * 365)

    // ------------------------------------------
    // CÁLCULOS DOS INVESTIMENTOS
    // Chamamos as funções de cálculo com os estados atuais
    // Passamos o "aporteMensal" para todas elas
    // ------------------------------------------
    const resultadoPoupanca = calcularPoupanca(capital, taxaPoupanca, diasTotal, aporteMensal)
    const resultadoCDB = calcularCDB(capital, taxaDI, percentualCDB, diasTotal, aporteMensal)
    const resultadoLCx = calcularLCx(capital, taxaDI, percentualLCx, diasTotal, aporteMensal)

    return (
        <div className="calculadora-layout">

            {/* ===== COLUNA ESQUERDA: Formulário ===== */}
            <div className="formulario-card">
                <div className="formulario-cabecalho">
                    <h2>Investimento</h2>
                </div>

                <form className="formulario-corpo" onSubmit={(e) => e.preventDefault()}>

                    {/* Valor investido inicial */}
                    <div className="campo-grupo">
                        <label>Investimento Inicial (R$)</label>
                        <input type="number" min="1" value={capital}
                            onChange={(e) => setCapital(Number(e.target.value))} />
                    </div>

                    {/* Aporte Mensal */}
                    <div className="campo-grupo">
                        <label>Aporte Mensal (R$)</label>
                        <input type="number" min="0" value={aporteMensal}
                            onChange={(e) => setAporteMensal(Number(e.target.value))}
                        />
                    </div>

                    {/* Período + Tipo (lado a lado) */}
                    <div className="campos-linha">
                        <div className="campo-grupo">
                            <label>Período</label>
                            <input type="number" min="1" value={periodo}
                                onChange={(e) => setPeriodo(Number(e.target.value))}
                            />
                        </div>

                        <div className="campo-grupo">
                            <label>Tipo</label>
                            <select value={tipoPeriodo}
                                onChange={(e) => setTipoPeriodo(e.target.value)}
                            >
                                <option value="dias">dias</option>
                                <option value="meses">meses</option>
                                <option value="anos">anos</option>
                            </select>
                        </div>
                    </div>

                    {/* Taxa DI */}
                    <div className="campo-grupo">
                        <label>Taxa DI (% ao ano)</label>
                        <input type="number" min="0" step="0.01" value={taxaDI}
                            onChange={(e) => setTaxaDI(Number(e.target.value))}
                        />
                    </div>

                    {/* % do CDI para CDB */}
                    <div className="campo-grupo">
                        <label>CDB / RDB / LC (% do CDI)</label>
                        <input type="number" min="0" value={percentualCDB}
                            onChange={(e) => setPercentualCDB(Number(e.target.value))}
                        />
                    </div>

                    {/* % do CDI para LCI/LCA */}
                    <div className="campo-grupo">
                        <label>LCI / LCA (% do CDI)</label>
                        <input type="number" min="0" value={percentualLCx}
                            onChange={(e) => setPercentualLCx(Number(e.target.value))}
                        />
                    </div>
                </form>
            </div>

            {/* ===== COLUNA DIREITA: Resultados ===== */}
            <div className="calculadora-resultados">
                <h2 className="resultados-titulo">Simulação</h2>
                <p className="resultados-descricao">
                    Rentabilidade do seu investimento por tipo de aplicação:
                </p>

                <CardResultado
                    nome="Poupança"
                    capital={capital}
                    totalAportado={resultadoPoupanca.totalAportado}
                    rendimentoBruto={resultadoPoupanca.rendimentoBruto}
                    cor="amber"
                />

                <CardResultado
                    nome="CDB / RDB / LC"
                    capital={capital}
                    totalAportado={resultadoCDB.totalAportado}
                    rendimentoBruto={resultadoCDB.rendimentoBruto}
                    valorIR={resultadoCDB.valorIR}
                    aliquotaIR={resultadoCDB.aliquotaIR}
                    valorIOF={resultadoCDB.valorIOF}
                    cor="blue"
                />

                <CardResultado
                    nome="LCI / LCA"
                    capital={capital}
                    totalAportado={resultadoLCx.totalAportado}
                    rendimentoBruto={resultadoLCx.rendimentoBruto}
                    cor="green"
                />
            </div>

        </div>
    )
}

export default Calculadora
