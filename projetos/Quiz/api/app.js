import express from "express";
import {BD, testarConexao } from "./db.js";
import cors from "cors";
import rotasQuiz from './src/routes/rotasQuiz.js'

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  await testarConexao();
  res.status(200).json("Api Funcionando");
});

app.use(rotasQuiz)

const porta = 3001;
app.listen(porta, () => {
  console.log(`http://localhost:${porta}`);
});
// Adicione:


