import express from 'express';
import cors from 'cors';

// ROTAS
import rotasUsuarios from "./src/routes/rotasUsuarios.js";
import rotasServicos from "./src/routes/rotasServicos.js";
import rotasAgendamentos from "./src/routes/rotasAgendamentos.js";
import rotasDashboard from "./src/routes/rotasDashboard.js";

// BANCO
import { BD, testarConexao } from "./db.js";

// SWAGGER
import swaggerUI from "swagger-ui-express";
import documentacao from "./config/swagger.js";

const app = express();

app.use(cors());
app.use(express.json());


// SWAGGER
app.use('/swagger', swaggerUI.serve, swaggerUI.setup(documentacao));


// ROTA PRINCIPAL
app.get('/', async (req, res) => {

    await testarConexao();

    res.redirect('/swagger');
});


// ROTAS
app.use(rotasUsuarios);
app.use(rotasServicos);
app.use(rotasAgendamentos);
app.use(rotasDashboard);

const porta = 3001;

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
});