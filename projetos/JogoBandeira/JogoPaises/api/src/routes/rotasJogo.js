
import { Router } from "express";
import { BD } from "../../db.js";

const router = Router();

// GET: SORTEAR RODADA
router.get('/jogo', async (req, res) => {
    try {
        // 1. Busca todas as perguntas e guarda na variável
        const comando = `SELECT * FROM perguntas`;
        const resultado = await BD.query(comando);
        // Esta é a variável que armazena todas as suas perguntas!
        const todasPerguntas = resultado.rows;
        //Esta são as variaveis que armazena todas as perguntas para sortear uma
        const indiceAleatorio = Math.floor(Math.random() * todasPerguntas.length)
        const perguntaSorteada = todasPerguntas[indiceAleatorio];
        //objeto com as respostas 
        const opcoes = [
            perguntaSorteada.opcao_1,
            perguntaSorteada.opcao_2,
            perguntaSorteada.opcao_3,
            perguntaSorteada.opcao_4
        ];
        // 5. Envia a resposta final para o jogo
        return res.status(200).json({ 
            imagem: perguntaSorteada.bandeira_url,
            respostaCorreta: perguntaSorteada.resposta_correta,
            opcoes: opcoes
        });

        // 2. Verifica se o banco retornou alguma pergunta
        if (todasPerguntas.length === 0) {
            return res.status(404).json({message: 'Nenhuma pergunta cadastrada no banco de dados.'});
        }
    } catch (error) {
        return res.status(500).json({ 
            error: 'Erro interno ao gerar rodada: ' + error.message 
        });       
    }
});

export default router;
