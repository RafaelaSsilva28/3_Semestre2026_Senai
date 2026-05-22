import { Router } from "express";
import { BD } from "../../db.js";

const router = Router();

// 1. LISTAR TODAS AS TRANSAÇÕES
router.get('/transacoes', async (req, res) => {
    try {
        const comando = `SELECT 
    t.id_transacao,
    t.valor,
    t.descricao,
    TO_CHAR(t.data_registro, 'DD/MM/YYYY') AS data_registro,
    TO_CHAR(t.data_vencimento, 'DD/MM/YYYY') AS data_vencimento,
    TO_CHAR(t.data_pagamento, 'DD/MM/YYYY') AS data_pagamento,
    t.tipo,
    c.nome AS categoria,
    s.nome AS subcategoria
    FROM transacoes t
    LEFT JOIN categorias c ON t.id_categoria = c.id_categoria
    LEFT JOIN subcategorias s ON t.id_subcategoria = s.id_subcategoria;`;
       
        const transacoes = await BD.query(comando);
        res.status(200).json(transacoes.rows);
    } catch (error) {
        console.error('Erro ao listar transações', error.message);
        res.status(500).json({ error: 'Erro ao listar transações' + error.message });
    }
}); 

// 6. LISTAR TRANSAÇÕES POR PERÍODO (Rotas estáticas sempre vêm ANTES das com parâmetro dinâmico)
router.get('/transacoes/periodo', async (req, res) => {
    const { inicio, fim } = req.query;
    try {
        if (!inicio || !fim) {
            return res.status(400).json({ message: 'Informe as datas de início e fim para filtrar as transações por período' });
        }
        
        const comando = `SELECT 
            t.id_transacao,
            t.valor,
            t.descricao,
            TO_CHAR(t.data_registro, 'DD/MM/YYYY') AS data_registro,
            TO_CHAR(t.data_vencimento, 'DD/MM/YYYY') AS data_vencimento,
            TO_CHAR(t.data_pagamento, 'DD/MM/YYYY') AS data_pagamento,
            t.tipo,
            c.nome AS categoria,
            s.nome AS subcategoria
            FROM transacoes t
            LEFT JOIN categorias c ON t.id_categoria = c.id_categoria
            LEFT JOIN subcategorias s ON t.id_subcategoria = s.id_subcategoria
            WHERE t.data_registro BETWEEN TO_DATE($1, 'DD/MM/YYYY') AND TO_DATE($2, 'DD/MM/YYYY')
            ORDER BY t.data_registro DESC`;

        const transacoes = await BD.query(comando, [inicio, fim]);
        res.status(200).json(transacoes.rows);
    } catch (error) {
        console.error('Erro ao listar transações por período', error.message);
        res.status(500).json({ error: 'Erro ao listar transações: ' + error.message });
    }
}); 

// BUSCAR TOTAL POR TIPO (Coloque antes de /transacoes/:id_transacao)
router.get('/transacoes/total', async (req, res) => {
    const { tipo } = req.query; // Captura o tipo enviado pelo Swagger (?tipo=S ou ?tipo=E)
    
    try {
        if (!tipo) {
            return res.status(400).json({ message: 'Informe o parâmetro tipo (E para Entrada ou S para Saída)' });
        }

        // Executa a soma filtrando estritamente pelo tipo recebido
        const comando = `
            SELECT COALESCE(SUM(valor), 0) AS total 
            FROM transacoes 
            WHERE tipo = $1
        `;
        
        const resultado = await BD.query(comando, [tipo.toUpperCase()]);
        
        // Retorna o objeto com o valor somado
        res.status(200).json(resultado.rows[0]); 
    } catch (error) {
        console.error('Erro ao buscar total por tipo:', error.message);
        res.status(500).json({ error: 'Erro ao buscar total: ' + error.message });
    }
});

// 1. LISTAR TRANSAÇÃO ESPECÍFICA POR ID (Esta era a rota que estava faltando e causou o 404!)
router.get('/transacoes/:id_transacao', async (req, res) => {
    const { id_transacao } = req.params;

    try {
        const comando = `
            SELECT 
                t.id_transacao,
                t.valor,
                t.descricao,
                TO_CHAR(t.data_registro, 'DD/MM/YYYY') AS data_registro,
                TO_CHAR(t.data_vencimento, 'DD/MM/YYYY') AS data_vencimento,
                TO_CHAR(t.data_pagamento, 'DD/MM/YYYY') AS data_pagamento,
                t.tipo,
                c.nome AS categoria,
                s.nome AS subcategoria
            FROM transacoes t
            LEFT JOIN categorias c ON t.id_categoria = c.id_categoria
            LEFT JOIN subcategorias s ON t.id_subcategoria = s.id_subcategoria
            WHERE t.id_transacao = $1;
        `;
       
        const transacoes = await BD.query(comando, [id_transacao]);

        if (transacoes.rows.length === 0) {
            return res.status(404).json({ message: 'Transação não encontrada' });
        }

        res.status(200).json(transacoes.rows[0]); // Retorna apenas o objeto da transação encontrada
    } catch (error) {
        console.error('Erro ao buscar transação por ID', error.message);
        res.status(500).json({ error: 'Erro ao buscar transação: ' + error.message });
    }
});

// 1. LISTAR TRANSAÇÕES POR CATEGORIA
router.get('/transacoes/categoria/:id_categoria', async (req, res) => {
    const { id_categoria } = req.params;

    try {
        const comando = `
            SELECT 
                t.id_transacao,
                t.valor,
                t.descricao,
                TO_CHAR(t.data_registro, 'DD/MM/YYYY') AS data_registro,
                TO_CHAR(t.data_vencimento, 'DD/MM/YYYY') AS data_vencimento,
                TO_CHAR(t.data_pagamento, 'DD/MM/YYYY') AS data_pagamento,
                t.tipo,
                c.nome AS categoria,
                s.nome AS subcategoria
            FROM transacoes t
            LEFT JOIN categorias c ON t.id_categoria = c.id_categoria
            LEFT JOIN subcategorias s ON t.id_subcategoria = s.id_subcategoria
            WHERE t.id_categoria = $1;
        `;
       
        const transacoes = await BD.query(comando, [id_categoria]);
        res.status(200).json(transacoes.rows);
    } catch (error) {
        console.error('Erro ao listar transações por categoria', error.message);
        res.status(500).json({ error: 'Erro ao listar transações: ' + error.message });
    }
});

// 7. FILTRAR TRANSAÇÕES POR TIPO
router.get('/transacoes/tipo/:tipo', async (req, res) => {
    const { tipo } = req.params;
    try {
        const comando = `
            SELECT 
                t.id_transacao,
                t.valor,
                t.descricao,
                TO_CHAR(t.data_registro, 'DD/MM/YYYY') AS data_registro,
                TO_CHAR(t.data_vencimento, 'DD/MM/YYYY') AS data_vencimento,
                TO_CHAR(t.data_pagamento, 'DD/MM/YYYY') AS data_pagamento,
                t.tipo,
                c.nome AS categoria,
                s.nome AS subcategoria
            FROM transacoes t
            LEFT JOIN categorias c ON t.id_categoria = c.id_categoria
            LEFT JOIN subcategorias s ON t.id_subcategoria = s.id_subcategoria
            WHERE t.tipo = $1;
        `;
        const transacoes = await BD.query(comando, [tipo]);
        res.status(200).json(transacoes.rows);
    } catch (error) {
        console.error('Erro ao filtrar transações por tipo', error.message);
        res.status(500).json({ error: 'Erro ao filtrar transações: ' + error.message });
    }
});

// 2. CADASTRAR TRANSAÇÃO
router.post('/transacoes', async (req, res) => {
    const {
        valor,
        descricao,
        data_pagamento,
        data_vencimento,
        tipo,
        id_categoria,
        id_subcategoria
    } = req.body;

    try {
        const comando = `
            INSERT INTO transacoes 
            (valor, descricao, data_pagamento, data_vencimento, tipo, id_categoria, id_subcategoria)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;

        const valores = [
            valor,
            descricao,
            data_pagamento,
            data_vencimento,
            tipo,
            id_categoria,
            id_subcategoria
        ];

        await BD.query(comando, valores);

        res.status(201).json({ message: "Transação cadastrada com sucesso!" });

    } catch (error) {
        console.error('Erro ao cadastrar transação', error.message);
        res.status(500).json({ error: 'Erro ao cadastrar transação' });
    }
});

// 3. ATUALIZAR COMPLETO (PUT)
router.put('/transacoes/:id_transacao', async (req, res) => {
    const { id_transacao } = req.params;
    const {
        valor,
        descricao,
        data_pagamento,
        data_vencimento,
        tipo,
        id_categoria,
        id_subcategoria
    } = req.body;

    try {
        const verificar = await BD.query(
            `SELECT * FROM transacoes WHERE id_transacao = $1`, [id_transacao]
        );

        if (verificar.rows.length === 0) {
            return res.status(404).json({ message: 'Transação não encontrada' });
        }

        const comando = `
            UPDATE transacoes SET
                valor = $1,
                descricao = $2,
                data_pagamento = $3,
                data_vencimento = $4,
                tipo = $5,
                id_categoria = $6,
                id_subcategoria = $7
            WHERE id_transacao = $8
        `;

        const valores = [
            valor,
            descricao,
            data_pagamento,
            data_vencimento,
            tipo,
            id_categoria,
            id_subcategoria,
            id_transacao
        ];

        await BD.query(comando, valores);

        res.status(200).json({ message: "Transação updated com sucesso!" });

    } catch (error) {
        console.error('Erro detalhado do banco:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar transação: ' + error.message });
    }
});

// 5. DELETE (FÍSICO)
router.delete('/transacoes/:id_transacao', async (req, res) => {
    const { id_transacao } = req.params;

    try {
        const verificar = await BD.query(
            `SELECT * FROM transacoes WHERE id_transacao = $1`, [id_transacao]
        );

        if (verificar.rows.length === 0) {
            return res.status(404).json({ message: 'Transação não encontrada' });
        }

        await BD.query(
            `DELETE FROM transacoes WHERE id_transacao = $1`, [id_transacao]
        );

        res.status(200).json({ message: "Transação removida com sucesso!" });

    } catch (error) {
        console.error('Erro ao deletar transação', error.message);
        res.status(500).json({ error: "Erro interno: " + error.message });
    }
});

export default router;
