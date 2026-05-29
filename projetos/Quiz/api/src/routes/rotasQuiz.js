import { Router } from "express";
import { BD } from "../../db.js";

const router = Router();

// GET: SORTEAR RODADA
router.get('/quiz', async (req, res) => {
    try {
        // 1. Busca todas as perguntas no banco de dados
        const comando = `SELECT * FROM quiz`;
        const resultado = await BD.query(comando);
        const todasPerguntas = resultado.rows;

        // 2. CORREÇÃO AQUI: Verifica primeiro se o banco está vazio
        if (!todasPerguntas || todasPerguntas.length === 0) {
            return res.status(404).json({ message: 'Nenhuma pergunta cadastrada no banco de dados.' });
        }

        // 3. Sorteia uma pergunta aleatória
        const indiceAleatorio = Math.floor(Math.random() * todasPerguntas.length);
        const perguntaSorteada = todasPerguntas[indiceAleatorio];

        // 4. Junta as opções em uma lista
        const opcoes = [
            perguntaSorteada.opcao_a,
            perguntaSorteada.opcao_b,
            perguntaSorteada.opcao_c,
            perguntaSorteada.opcao_d
        ];

        // 5. Envia a resposta correta e as chaves batendo com o que o App espera
        return res.status(200).json({ 
            pergunta: perguntaSorteada.pergunta,
            imagem: perguntaSorteada.img_pergunta,
            resposta_correta: perguntaSorteada.resposta_correta, // Deve bater com o App!
            opcoes: opcoes
        });

    } catch (error) {
        return res.status(500).json({ 
            error: 'Erro interno ao gerar rodada: ' + error.message 
        });       
    }
});

export default router;
