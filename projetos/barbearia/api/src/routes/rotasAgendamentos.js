import { Router } from "express";
import { BD } from "../../db.js";

const router = Router();


// ======================================
// 1. LISTAR AGENDAMENTOS
// ======================================

router.get('/agendamentos', async (req, res) => {

    try {

        const query = `
            SELECT
                a.id_agendamento,
                u.nome AS cliente,
                s.nome_servico,
                a.data_hora
            FROM agendamentos a
            INNER JOIN usuarios u
                ON a.id_cliente = u.id_cliente
            INNER JOIN servicos s
                ON a.id_servico = s.id_servico
            ORDER BY a.id_agendamento
        `;

        const agendamentos = await BD.query(query);

        return res.status(200).json(agendamentos.rows);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: 'Erro ao listar agendamentos'
        });
    }
});



// ======================================
// 2. CADASTRAR AGENDAMENTO
// ======================================

// ======================================
// 2. CADASTRAR AGENDAMENTO (Corrigido com valor e status)
// ======================================

router.post('/agendamentos', async (req, res) => {
    const {
        id_cliente,
        id_servico,
        data_hora,
        valor,
        status
    } = req.body;

    // Validação de campos obrigatórios
    if (
        !id_cliente ||
        !id_servico ||
        !data_hora ||
        valor === undefined || // Aceita o valor 0 se necessário
        !status
    ) {
        return res.status(400).json({
            error: 'Todos os campos são obrigatórios (incluindo valor e status)'
        });
    }

    try {
        const comando = `
            INSERT INTO agendamentos
            (
                id_cliente,
                id_servico,
                data_hora,
                valor,
                status
            )
            VALUES ($1, $2, $3, $4, $5)
        `;

        const valores = [
            id_cliente,
            id_servico,
            data_hora,
            valor,
            status
        ];

        await BD.query(comando, valores);

        return res.status(201).json({
            message: 'Agendamento cadastrado com sucesso'
        });

    } catch (error) {
        // Exibe o erro real do PostgreSQL no terminal do VS Code
        console.error('Erro no Banco de Dados:', error.message);

        return res.status(500).json({
            error: 'Erro ao cadastrar agendamento: ' + error.message
        });
    }
});



// ======================================
// 3. ATUALIZAR AGENDAMENTO
// ======================================

router.put('/agendamentos/:id_agendamento', async (req, res) => {

    const { id_agendamento } = req.params;

    const {
        id_cliente,
        id_servico,
        data_hora
    } = req.body;

    if (
        !id_cliente ||
        !id_servico ||
        !data_hora
    ) {
        return res.status(400).json({
            error: 'Todos os campos são obrigatórios'
        });
    }

    try {

        const verificar = await BD.query(
            `
            SELECT *
            FROM agendamentos
            WHERE id_agendamento = $1
            `,
            [id_agendamento]
        );

        if (verificar.rows.length === 0) {
            return res.status(404).json({
                error: 'Agendamento não encontrado'
            });
        }

        const comando = `
            UPDATE agendamentos
            SET
                id_cliente = $1,
                id_servico = $2,
                data_hora = $3
            WHERE id_agendamento = $4
        `;

        const valores = [
            id_cliente,
            id_servico,
            data_hora,
            id_agendamento
        ];

        await BD.query(comando, valores);

        return res.status(200).json({
            message: 'Agendamento atualizado com sucesso'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: 'Erro ao atualizar agendamento'
        });
    }
});



// ======================================
// 4. DELETAR AGENDAMENTO
// ======================================

router.delete('/agendamentos/:id_agendamento', async (req, res) => {

    const { id_agendamento } = req.params;

    try {

        const verificar = await BD.query(
            `
            SELECT *
            FROM agendamentos
            WHERE id_agendamento = $1
            `,
            [id_agendamento]
        );

        if (verificar.rows.length === 0) {

            return res.status(404).json({
                error: 'Agendamento não encontrado'
            });
        }

        await BD.query(
            `
            DELETE FROM agendamentos
            WHERE id_agendamento = $1
            `,
            [id_agendamento]
        );

        return res.status(200).json({
            message: 'Agendamento removido com sucesso'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: 'Erro ao deletar agendamento'
        });
    }
});

export default router;