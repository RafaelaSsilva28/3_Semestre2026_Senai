import { Router } from "express";
import { BD } from "../../db.js";

const router = Router();


// 1. LISTAR transações (Apenas ativos)
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
        res.status(500).json({ error: 'Erro ao listar transações'  + error.message });
    }
}); 
// 1. LISTAR transações/categorias (Apenas ativos)
router.get('/transacoes/categorias/:id_categoria', async (req, res) => {
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
        res.status(500).json({ error: 'Erro ao listar transações'  + error.message });
    }
}); 
// 1. LISTAR transações/subcategorias (Apenas ativos)
router.get('/transacoes/subcategorias/:id_subcategoria', async (req, res) => {
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
        res.status(500).json({ error: 'Erro ao listar transações'  + error.message });
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
router.put('/transacoes/categorias/:id_categoria', async (req, res) => {
    const { id_categoria } = req.params;
    const {
        valor,
        descricao,
        data_pagamento,
        data_vencimento,
        tipo,
        id_subcategoria
    } = req.body;

    try {
        // Removido o "AND ativo = true" que provavelmente causava o erro 500
        const verificar = await BD.query(
            `SELECT * FROM transacoes WHERE id_categoria = $1`, [id_categoria]
        );

        if (verificar.rows.length === 0) {
            return res.status(404).json({ message: 'Transação não encontrada para esta categoria' });
        }

        const comando = `
            UPDATE transacoes SET
                valor = $1,
                descricao = $2,
                data_pagamento = $3,
                data_vencimento = $4,
                tipo = $5,
                id_subcategoria = $6
            WHERE id_categoria = $7
        `;

        const valores = [
            valor,
            descricao,
            data_pagamento,
            data_vencimento,
            tipo,
            id_subcategoria,
            id_categoria
        ];

        await BD.query(comando, valores);

        res.status(200).json({ message: "Transação atualizada com sucesso!" });

    } catch (error) {
        // Exibe o erro real do banco de dados no seu terminal do VS Code / Nodemon
        console.error('Erro detalhado do banco:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar transação: ' + error.message });
    }
});



// 5. DELETE (FÍSICO - deleta todas as transações da categoria)
router.delete('/transacoes/categorias/:id_categoria', async (req, res) => {
    const { id_categoria } = req.params;

    try {
        // Alinhado para verificar por id_categoria
        const verificar = await BD.query(
            `SELECT * FROM transacoes WHERE id_categoria = $1`,
            [id_categoria]
        );

        if (verificar.rows.length === 0) {
            return res.status(404).json({ message: 'Nenhuma transação encontrada para esta categoria' });
        }

        // Alinhado para deletar por id_categoria
        await BD.query(
            `DELETE FROM transacoes WHERE id_categoria = $1`,
            [id_categoria]
        );

        res.status(200).json({ message: "Transações da categoria removidas com sucesso!" });

    } catch (error) {
        console.error('Erro ao deletar transação', error.message);
        res.status(500).json({ error: "Erro interno: " + error.message });
    }
});


// 6. LISTAR TRANSAÇÕES POR PERÍODO
router.get('/transacoes/periodo', async (req, res) => {
    const { inicio, fim } = req.query;
    try {
        // Correção do BUG: Corrigido para verificar se as datas NÃO foram informadas
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

// 7. FILTRAR TRANSAÇÕES POR TIPO (Mostra todas as transações daquele tipo)
router.get('/transacoes/tipo/:tipo', async (req, res) => {
    const { tipo } = req.params;
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
            LEFT JOIN subcategorias s ON t.id_subcategoria = s.id_subcategoria
            WHERE UPPER(t.tipo) = $1
            ORDER BY t.data_registro DESC;`;

        // Passa o tipo em maiúsculo (ex: "E" ou "S") para garantir a busca no banco
        const transacoes = await BD.query(comando, [tipo.toUpperCase()]);
        
        res.status(200).json(transacoes.rows);
    } catch (error) {
        console.error('Erro ao listar transações por tipo', error.message);
        res.status(500).json({ error: 'Erro ao listar transações por tipo: ' + error.message });
    }
});


// 8. LISTAR TOTAL GERAL DE TRANSAÇÕES (Bate com a terceira rota do Swagger)
router.get('/transacoes/total', async (req, res) => {
    try {
        const comando = `
            SELECT SUM(valor) as total
            FROM transacoes
        `;
        const resultado = await BD.query(comando);
        
        return res.status(200).json({
            total: resultado.rows[0].total || 0 // Correção do índice [0] do rows
        });
    } catch (error) {
        console.error('Erro ao calcular total geral', error.message);
        return res.status(500).json({ error: "Erro ao calcular o total geral" });
    }
});

export default router;

