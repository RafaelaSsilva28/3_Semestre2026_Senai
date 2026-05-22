import { Router } from "express";
import { BD } from "../../db.js";
const router = Router();

// 1. LISTAR SUBCATEGORIAS (Apenas ativas)
router.get('/subcategorias', async (req, res) => {
    try {
        const query = `
            SELECT 
                s.id_subcategoria,
                s.nome,
                s.id_categoria,
                c.nome AS categoria
            FROM subcategorias s
            LEFT JOIN categorias c ON s.id_categoria = c.id_categoria
            WHERE s.ativo = true
            ORDER BY s.id_subcategoria
        `;
        const resultado = await BD.query(query);
        res.status(200).json(resultado.rows);
    } catch (error) {
        console.error('Erro ao listar subcategorias', error.message);
        res.status(500).json({ error: 'Erro ao listar subcategorias' });
    }
});
// 2. CRIAR SUBCATEGORIA (POST)
router.post('/subcategorias', async (req, res) => {
    const { nome, id_categoria } = req.body;

    try {
        // Validação básica
        if (!nome || !id_categoria) {
            return res.status(400).json({ message: 'Nome e id_categoria são obrigatórios' });
        }

        const comando = `
            INSERT INTO subcategorias (nome, id_categoria, ativo)
            VALUES ($1, $2, true)
            RETURNING *
        `;

        const valores = [nome, id_categoria];

        const resultado = await BD.query(comando, valores);

        return res.status(201).json({
            message: 'Subcategoria criada com sucesso!',
            subcategoria: resultado.rows[0]
        });

    } catch (error) {
        console.error('Erro ao criar subcategoria', error.message);
        return res.status(500).json({ error: 'Erro ao criar subcategoria' });
    }
});

// 3. ATUALIZAR USUÁRIO COMPLETO (PUT)
router.put('/subcategorias/:id_subcategoria', async (req, res) => {
    const { id_subcategoria } = req.params;
    const { nome, id_categoria } = req.body;

    try {
        const verificarSubcategoria = await BD.query(`SELECT * FROM subcategorias WHERE id_subcategoria = $1 AND ativo = true`, [id_subcategoria]);
        
        if (verificarSubcategoria.rows.length === 0) {
            return res.status(404).json({ message: 'Subcategoria não encontrada' });
        }

        // CORRIGIDO: de 'tio_acesso' para 'tipo_acesso'
        const comando = `UPDATE subcategorias SET nome = $1, id_categoria = $2 WHERE id_subcategoria = $3`;
        const valores = [nome, id_categoria, id_subcategoria];

        await BD.query(comando, valores);
        return res.status(200).json('Subcategoria atualizada com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar subcategoria', error.message);
        return res.status(500).json({ error: 'Erro ao atualizar subcategoria' });
    }
});

// 3. ATUALIZAR COMPLETO (PUT)
router.put('/subcategorias/:id_subcategoria', async (req, res) => {
    const { id_subcategoria } = req.params;
    const { nome, id_categoria } = req.body;

    try {
        const verificar = await BD.query(
            `SELECT * FROM subcategorias WHERE id_subcategoria = $1 AND ativo = true`,
            [id_subcategoria]
        );

        if (verificar.rows.length === 0) {
            return res.status(404).json({ message: 'Subcategoria não encontrada' });
        }

        const comando = `
            UPDATE subcategorias
            SET nome = $1, id_categoria = $2
            WHERE id_subcategoria = $3
        `;
        const valores = [nome, id_categoria, id_subcategoria];

        await BD.query(comando, valores);
        return res.status(200).json('Subcategoria atualizada com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar subcategoria', error.message);
        return res.status(500).json({ error: 'Erro ao atualizar subcategoria' });
    }
});

// 4. ATUALIZAÇÃO PARCIAL (PATCH)
router.patch('/subcategorias/:id_subcategoria', async (req, res) => {
    const { id_subcategoria } = req.params;
    const { nome, id_categoria, ativo } = req.body;

    try {
        const verificar = await BD.query(
            `SELECT * FROM subcategorias WHERE id_subcategoria = $1`,
            [id_subcategoria]
        );

        if (verificar.rows.length === 0) {
            return res.status(404).json({ message: 'Subcategoria não encontrada' });
        }

        const campos = [];
        const valores = [];
        let contador = 1;

        if (nome) {
            campos.push(`nome = $${contador}`);
            valores.push(nome);
            contador++;
        }

        if (id_categoria) {
            campos.push(`id_categoria = $${contador}`);
            valores.push(id_categoria);
            contador++;
        }

        if (ativo !== undefined) {
            campos.push(`ativo = $${contador}`);
            valores.push(ativo);
            contador++;
        }

        if (campos.length === 0) {
            return res.status(400).json({ message: "Nenhum campo enviado para atualizar" });
        }

        valores.push(id_subcategoria);

        const comando = `
            UPDATE subcategorias
            SET ${campos.join(', ')}
            WHERE id_subcategoria = $${contador}
        `;

        await BD.query(comando, valores);

        return res.status(200).json('Subcategoria atualizada parcialmente');
    } catch (error) {
        console.error('Erro no PATCH', error.message);
        return res.status(500).json({ message: "Erro interno: " + error.message });
    }
});

// 5. DELETAR (LOGICAL DELETE)
router.delete('/subcategorias/:id_subcategoria', async (req, res) => {
    const { id_subcategoria } = req.params;

    try {
        const comando = `
            UPDATE subcategorias
            SET ativo = false
            WHERE id_subcategoria = $1
        `;

        await BD.query(comando, [id_subcategoria]);

        return res.status(200).json({ message: "Subcategoria desativada com sucesso" });
    } catch (error) {
        console.error('Erro ao deletar subcategoria', error.message);
        return res.status(500).json({ message: "Erro interno ao deletar" });
    }
});

export default router;
