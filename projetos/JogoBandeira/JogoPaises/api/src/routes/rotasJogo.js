import { Router } from "express";
import { BD } from "../../db.js";

const router = Router();

//GET: SORTEAR RODADA
router.get('/jogo', async (req, res) => {
    try{

    }catch(error){
        return res.status(500).json({error: 'Erro interno ao gerar rodada' + error.mesage})       
    }
})