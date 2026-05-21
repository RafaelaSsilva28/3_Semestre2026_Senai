CREATE TABLE usuarios (
id_usuario SERIAL PRIMARY KEY,
nome VARCHAR(150) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
senha VARCHAR(255) NOT NULL,
tipo_acesso VARCHAR(50) NOT NULL,
ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE categorias (
id_categoria SERIAL PRIMARY KEY,
nome VARCHAR(150) NOT NULL,
descricao TEXT,
tipo VARCHAR(50) NOT NULL,
cor VARCHAR(50),
icone VARCHAR(100),
ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE subcategorias (
id_subcategoria SERIAL PRIMARY KEY,
nome VARCHAR(150) NOT NULL,
ativo BOOLEAN DEFAULT TRUE,
id_categoria INTEGER NOT NULL,
FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);
CREATE TABLE transacoes (
id_transacao SERIAL PRIMARY KEY,
valor NUMERIC(12, 2),
descricao TEXT,
data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
data_pagamento DATE,
data_vencimento DATE,
tipo CHAR(1),
id_categoria INT,
id_subcategoria INT,
FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
FOREIGN KEY (id_subcategoria) REFERENCES subcategorias(id_subcategoria)
)