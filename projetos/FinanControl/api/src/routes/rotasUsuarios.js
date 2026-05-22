import { Router } from "express";
import { BD } from "../../db.js";
import bcrypt from 'bcrypt';
import { autenticarToken } from "../middlewares/autenticacao.js";
import jwt from 'jsonwebtoken';

const router = Router();

const SECRET_KEY = 'sua_chave_secreta'

// 1. LISTAR USUÁRIOS (Apenas ativos), autenticando o token chamando a function      
router.get('/usuarios', autenticarToken, async (req, res) => {
    try {
        const query = `SELECT id_usuario, nome, email, tipo_acesso FROM usuarios WHERE ativo = true ORDER BY id_usuario`;
        const usuarios = await BD.query(query);
        res.status(200).json(usuarios.rows);
    } catch (error) {
        console.error('Erro ao listar usuarios', error.message);
        res.status(500).json({ error: 'Erro ao listar usuarios' });
    }
});


// 2. CADASTRAR USUÁRIO (POST)
router.post('/usuarios', async (req, res) => {
    const { nome, email, senha, tipo_acesso = 'comum' } = req.body;

    // Validação de campos obrigatórios
    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Nome, email e senha são obrigatórios." });
    }

    try {
        // 1. CORREÇÃO AQUI: Alinhado para buscar 'id_usuario' em vez de 'id'
        const verifEmail = 'SELECT id_usuario FROM usuarios WHERE email = $1';
        const usuarioExistente = await BD.query(verifEmail,[email]);
        
        if (usuarioExistente.rows.length > 0) {
            return res.status(400).json({ mensagem: "Este e-mail já está em uso." });
        }

        // 2. Criptografa a senha
        const saltRounds = 10;
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);
        
        // 3. Insere o novo usuário
        const comando = `INSERT INTO usuarios (nome, email, senha, tipo_acesso, ativo) VALUES ($1, $2, $3, $4, true)`;
        const valores = [nome, email, senhaCriptografada, tipo_acesso];

        await BD.query(comando, valores);
        
        return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso." });

    } catch (error) {
        // Exibe o erro real no terminal do VS Code/Node para monitoramento
        console.error('Erro ao cadastrar usuários:', error);
        return res.status(500).json({ mensagem: 'Erro interno ao cadastrar usuário.' });
    }
});


// 3. ATUALIZAR USUÁRIO COMPLETO (PUT)
router.put('/usuarios/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    const { nome, email, senha, tipo_acesso } = req.body;

    // --- ADICIONE ESTA VALIDAÇÃO ---
    if (!nome || !email || !senha || !tipo_acesso) {
        return res.status(400).json({ error: "Todos os campos (nome, email, senha, tipo_acesso) são obrigatórios para atualização completa." });
    }

    try {
        const verificarUsuario = await BD.query(`SELECT * FROM usuarios WHERE id_usuario = $1 AND ativo = true`, [id_usuario]);
        
        if (verificarUsuario.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario não encontrado ou inativo' });
        }

        const saltRounds = 10;
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

        const comando = `UPDATE usuarios SET nome = $1, email = $2, senha = $3, tipo_acesso = $4 WHERE id_usuario = $5`;
        const valores = [nome, email, senhaCriptografada, tipo_acesso, id_usuario];
        
        await BD.query(comando, valores);
        return res.status(200).json('Usuario atualizado com sucesso!');
    } catch (error) {
        // Isso vai te mostrar no console EXATAMENTE qual foi o erro técnico
        console.error('ERRO DETALHADO:', error); 
        return res.status(500).json({ error: 'Erro ao atualizar usuario: ' + error.message });
    }
});

// 4. ATUALIZAR PARCIAL (PATCH)
router.patch('/usuarios/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    const { nome, email, senha } = req.body;

    try {
        const verificarUsuario = await BD.query(`SELECT * FROM usuarios WHERE id_usuario = $1`, [id_usuario]);
        if (verificarUsuario.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario não encontrado' });
        }

        const campos = [];
        const valores = [];
        let contador = 1;

        if (nome) {
            campos.push(`nome = $${contador}`);
            valores.push(nome);
            contador++;
        }
        if (email) {
            campos.push(`email = $${contador}`);
            valores.push(email);
            contador++;
        }
        if (senha) {
            const senhaHash = await bcrypt.hash(senha, 10);
            campos.push(`senha = $${contador}`);
            valores.push(senhaHash);
            contador++;
        }

        if (campos.length === 0) {
            return res.status(400).json({ message: "Nenhum campo enviado para atualizar" });
        }

        valores.push(id_usuario);
        const comando = `UPDATE usuarios SET ${campos.join(', ')} WHERE id_usuario = $${contador}`;
        await BD.query(comando, valores);

        return res.status(200).json('Usuario atualizado parcialmente');
    } catch (error) {
        console.error('Erro no PATCH', error.message);
        return res.status(500).json({ message: "Erro interno: " + error.message });
    }
});

// 5. DELETAR (LOGICAL DELETE)
router.delete('/usuarios/:id_usuario', autenticarToken, async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const comando = `UPDATE usuarios SET ativo = false WHERE id_usuario = $1`;
        await BD.query(comando, [id_usuario]);
        return res.status(200).json({ message: "Usuário desativado com sucesso" });
    } catch (error) {
        console.error('Erro ao deletar usuario', error.message);
        return res.status(500).json({ message: "Erro interno ao deletar" });
    }
});

// 6. LOGIN (Única versão funcional)
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    try {
        const comando = 'SELECT * FROM usuarios WHERE email = $1 AND ativo = true';
        const resultado = await BD.query(comando, [email]);

        if (resultado.rows.length === 0) {
            return res.status(401).json({ message: 'Usuário não encontrado ou inativo' });
        }

        const usuario = resultado.rows[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ message: 'Senha inválida' });
        }

        //GERANDO TOKEN PARA RETORNAR E SER USADO
        const token = jwt.sign(
            {id_usuario: usuario.id_usuario, email: usuario.email},
            SECRET_KEY,
            // {expires: '15m'}  //tempo para expirar o token 
        )

        return res.status(200).json({
            message: 'Login realizado com sucesso',
            token: token,
            usuario: { id: usuario.id_usuario, nome: usuario.nome, email: usuario.email }
        });
    } catch (error) {
        console.error('Erro no Login', error.message);
        return res.status(500).json({ message: 'Erro interno no servidor' });
    }
});

export default router;