import { Router } from "express";
import { BD } from "../../db.js";


const router = Router();
const SECRET_KEY = "sua_chave_secreta"

//Informações do Dashboard

//Transações por Categorias
router.get('/dashboard', async (req, res) => {
    try {

        //Grafico de Pizza 
        const selecaoCategorias = `
            SELECT c.nome, SUM(t.valor) AS total 
            FROM transacoes t 
            INNER JOIN categorias c ON t.id_categoria = c.id_categoria
            WHERE t.tipo = 'S'
            GROUP BY c.nome
            ORDER BY total DESC
        `

        //5 Maiores Gastos
        const selecaoMaioresGastos = `
            SELECT descricao, valor, TO_CHAR(data_registro, 'DD/MM/YYYY') AS data_registro
            FROM transacoes
            WHERE tipo = 'S'
            ORDER BY valor DESC
            LIMIT 5
        `

        //Card Resumo do Mes
        const selecaoResumoMes = `
            SELECT 
                SUM(CASE WHEN tipo = 'E' THEN valor ELSE 0 END) AS entradas,
                SUM(CASE WHEN tipo = 'S' THEN valor ELSE 0 END) AS saidas,
                SUM(CASE WHEN tipo = 'E' THEN valor ELSE 0 END) AS saldo
            FROM transacoes
            WHERE DATE_TRUNC('month', data_registro) = DATE_TRUNC('month', CURRENT_DATE)
        `

        //Evolução Mensal
        const evolucaoMensal = `
            SELECT
                TO_CHAR(DATE_TRUNC('month', data_registro), 'MM/YYYY') AS mes,
                SUM(CASE WHEN tipo = 'E' THEN valor ELSE 0 END) AS entradas,
                SUM(CASE WHEN tipo = 'S' THEN valor ELSE 0 END) AS saidas,
                SUM(CASE WHEN tipo = 'E' THEN valor ELSE 0 END) - 
            SUM(CASE WHEN tipo = 'S' THEN valor ELSE 0 END) AS saldo
            FROM transacoes
            GROUP BY DATE_TRUNC('month', data_registro)
            ORDER BY DATE_TRUNC('month', data_registro) ASC 
        `

        //Ultimas 5 transações
        const selecaoUltimasTransacoes = `
        SELECT descricao, valor, tipo, TO_CHAR(data_registro, 'DD/MM/YYYY') AS data_registro
        FROM transacoes
        ORDER BY data_registro DESC
        LIMIT 5
        `

        const resCategorias = await BD.query(selecaoCategorias);
        const resMaioresGastos = await BD.query(selecaoMaioresGastos);
        const resResumoMes = await BD.query(selecaoResumoMes);
        const resEvolucaoMensal = await BD.query(evolucaoMensal);
        const resUltimasTransacoes = await BD.query(selecaoUltimasTransacoes);

        //Objeto com todos os dados do dashboard
        const dadosDashboard = {
            resumoCategorias: resCategorias.rows,
            resumoMaioresGastos: resMaioresGastos.rows,
            resumoMes: resResumoMes.rows[0] || { entradas: 0, saidas: 0, saldo: 0 },
            evolucaoMensal: resEvolucaoMensal.rows,
            resumoselecaoUltimasTransacoes: resUltimasTransacoes.rows
        }

        return res.status(200).json(dadosDashboard);

    } catch (error) {
        console.error('Erro ao buscar transações por categoria', error.message);
        return res.status(500).json({ error: 'Erro ao buscar transações por categoria' });
    }
});

export default router;