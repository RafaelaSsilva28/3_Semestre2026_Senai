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
            `SELECT * FROM transacoes WHERE id_transacao = $1 AND ativo = true`, [id_transacao]
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

        res.status(200).json({ message: "Transação atualizada com sucesso!" });

    } catch (error) {
        console.error('Erro ao atualizar transação', error.message);
        res.status(500).json({ error: 'Erro ao atualizar transação' });
    }
});

// 5. DELETE (FÍSICO - pode mudar pra lógico se quiser)
router.delete('/transacoes/:id_transacao', async (req, res) => {
    const { id_transacao } = req.params;

    try {
        const verificar = await BD.query(
            `SELECT * FROM transacoes WHERE id_transacao = $1`,
            [id_transacao]
        );

        if (verificar.rows.length === 0) {
            return res.status(404).json({ message: 'Transação não encontrada' });
        }

        await BD.query(
            `DELETE FROM transacoes WHERE id_transacao = $1`,
            [id_transacao]
        );

        res.status(200).json({ message: "Transação removida com sucesso!" });

    } catch (error) {
        console.error('Erro ao deletar transação', error.message);
        res.status(500).json({ error: "Erro interno" });
    }
});

// 6.LISTAR TRANSAÇÕES POR PERÍODO (Ex: Listar transações do mês de janeiro) METODO GET
router.get('/transacoes/periodo', async (req, res) => {
    //requisições a partir de query params )
    const {inicio, fim} = req.query;
    try {
        if(inicio || fim){
            return res.status(400).json({message: 'Informe as datas de início e fim para filtrar as transações por período'});
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
        console.error('Erro ao listar transações', error.message);
        res.status(500).json({ error: 'Erro ao listar transações'  + error.message });
    }
}); 

//rota soma de transação
router.get('/transacoes/total', async(req, res) =>{
    const {tipo} = req.query; //pegar o tipo E ou S
    try{
        const comando = `
            SELECT SUM(valor) as total
            FROM transacoes
            WHERE tipo = $1
        `
        const resultado = await BD.query(comando, [tipo.toUpperCase()]);
        return res.status(200).json({
            tipo: tipo.toLocaleLowerCase(),
            total: resultado.rows[0].total || 0
        })
    }catch(error){
        return res.status(500).json({error: "Erro ao calcular o total"})
    }
})


export default router;

