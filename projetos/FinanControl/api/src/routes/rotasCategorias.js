import { Router } from "express";
import { BD } from "../../db.js";

const router = Router();

// 1. LISTAR CATEGORIAS (GET)
router.get('/categorias', async (req, res) => {
    try {
        const comando = `SELECT * FROM categorias  WHERE ativo = true `;
        const categorias = await BD.query(comando);
        res.status(200).json(categorias.rows);
    } catch (error) {
        console.error('Erro ao listar categorias', error.message);
        res.status(500).json({ error: 'Erro ao listar categorias' });
    }
});

// 2. CADASTRAR CATEGORIAS (POST)
router.post('/categorias', async (req, res) => {
    // Adicionei um valor padrão para tipo_acesso caso o usuário não envie no Swagger
    const { nome, descricao, tipo, cor, icone, ativo = 'comum' } = req.body;

    if (!nome || !descricao || !tipo || !cor || !icone || !ativo) {
        return res.status(400).json({ error: "Nome, descricao, tipo, cor, icone, ativo são obrigatórios." });
    }

    try {
      
        // Adicionado 'ativo' como true por padrão na inserção
        const comando = `INSERT INTO categorias (nome, descricao, tipo, cor, icone, ativo) VALUES ($1, $2, $3, $4, $5, true)`;
        const valores = [nome, descricao, tipo, cor, icone];

        await BD.query(comando, valores);
        return res.status(201).json("Categoria cadastrado com sucesso.");
    } catch (error) {
        console.error('Erro ao cadastrar usuarios', error.message);
        return res.status(500).json({ error: 'Erro ao cadastrar categoria: ' + error.message });
    }
});

// 3. ATUALIZAR CATEGORIA COMPLETO (PUT)
router.put('/categorias/:id_categoria', async (req, res) => {
    const { id_categoria } = req.params;
    const { nome, descricao, tipo, cor, icone } = req.body;

    try {
        const verificarCategoria = await BD.query(`SELECT * FROM categorias WHERE id_categoria = $1 AND ativo = true`, [id_categoria]);
        
        if (verificarCategoria.rows.length === 0) {
            return res.status(404).json({ message: 'Categoria não encontrado' });
        }

        const comando = `UPDATE categorias SET nome = $1, descricao = $2, tipo = $3, cor = $4, icone = $5 WHERE id_categoria = $6`;
        const valores = [nome, descricao, tipo, cor, icone, id_categoria];
        
        await BD.query(comando, valores);
        return res.status(200).json('Categoria atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar categoria', error.message);
        return res.status(500).json({ error: 'Erro ao atualizar categtoria' });
    }
});

// // 4. ATUALIZAR PARCIAL (PATCH)
// router.patch('/categorias/:id_categoria', async (req, res) => {
//     const { id_categoria } = req.params;
//     const { nome, descricao, tipo, cor, icone } = req.body;

//     try {
//         const verificarCategoria = await BD.query(`SELECT * FROM categorias WHERE id_categoria = $1`, [id_categoria]);
//         if (verificarCategoria.rows.length === 0) {
//             return res.status(404).json({ message: 'Categoria não encontrado' });
//         }

//         const campos = [];
//         const valores = [];
//         let contador = 1;

//         if (nome) {
//             campos.push(`nome = $${contador}`);
//             valores.push(nome);
//             contador++;
//         }
//         if (descricao) {
//             campos.push(`descricao = $${contador}`);
//             valores.push(descricao);
//             contador++;
//         }
//         if (tipo) {
//             campos.push(`tipo = $${contador}`);
//             valores.push(tipo);
//             contador++;
//         }
//          if (cor) {
//             campos.push(`cor = $${contador}`);
//             valores.push(cor);
//             contador++;
//         }
//          if (icone) {
//             campos.push(`icone = $${contador}`);
//             valores.push(icone);
//             contador++;
//         }
        



//         if (campos.length === 0) {
//             return res.status(400).json({ message: "Nenhum campo enviado para atualizar" });
//         }

//         valores.push(id_categoria);
//         const comando = `UPDATE categorias SET ${campos.join(', ')} WHERE id_categoria = $${contador}`;
//         await BD.query(comando, valores);

//         return res.status(200).json('Categoria atualizado parcialmente');
//     } catch (error) {
//         console.error('Erro no PATCH', error.message);
//         return res.status(500).json({ message: "Erro interno: " + error.message });
//     }
// });

// 5. DELETAR (LOGICAL DELETE)
router.delete('/categorias/:id_categoria', async (req, res) => {
    const { id_categoria } = req.params;
    try {
        const comando = `UPDATE categorias SET ativo = false WHERE id_categoria = $1`;
        await BD.query(comando, [id_categoria]);
        return res.status(200).json({ message: "Categoria desativado com sucesso" });
    } catch (error) {
        console.error('Erro ao deletar categoria', error.message);
        return res.status(500).json({ message: "Erro interno ao deletar" });
    }
});


export default router;