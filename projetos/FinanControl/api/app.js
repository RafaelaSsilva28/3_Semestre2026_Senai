import express from 'express';
import {testarConexao} from './db.js';
import rotasUsuarios from './src/routes/rotasUsuarios.js'
import rotasCategorias from './src/routes/rotasCategorias.js'
import rotasSubcategorias from './src/routes/rotasSubcategorias.js'
import rotasTransacoes from './src/routes/rotasTransacoes.js'
import rotasDashboard from './src/routes/rotasDashboard.js'
//usando swagger
import swaggerUi from 'swagger-ui-express';
import documentacao from './config/swagger.js';
import cors from 'cors'

const app = express();
app.use(cors())

app.use(express.json());
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(documentacao))

app.get('/', async(req, res) =>{
    await testarConexao();
    // res.status(200).json("Api Funcionando");
    res.redirect('/swagger')
})

//Utilizando rotas
app.use(rotasUsuarios);
app.use(rotasCategorias);
app.use(rotasSubcategorias);
app.use(rotasTransacoes);
app.use(rotasDashboard)

const porta = 3001;
app.listen(porta, () =>{
    console.log(`http://localhost:${porta}`);
})