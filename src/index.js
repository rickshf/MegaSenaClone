// Importa os módulos necessários
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./controllers/db"); // Importa a conexão com o BD PostgreSQL

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Instancia a aplicação Express
const app = express();

// Define a porta que será usada pelo servidor
const PORT = process.env.PORT || 3000;

// Middleware para permitir o uso de JSON no corpo das requisições
app.use(express.json());

// Middleware para permitir requisições de diferentes origens (CORS)
app.use(cors());

// Importar as rotas do controlador Mega
const megaController = require("./controllers/mega");
// Define a rota base para o controlador Mega
app.use("/", megaController);

// Rota não encontrada
app.use((req, res) => {
res.status(404).json({erro: "Rota não encontrada"})
});

// Inicia o servidor e escuta na porta definida
app.listen(PORT, function () {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


