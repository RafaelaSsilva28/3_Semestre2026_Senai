-- 1. CRIAÇÃO DA TABELA (Perfeita!)
CREATE TABLE perguntas (
id_pergunta SERIAL PRIMARY KEY,
bandeira_url TEXT NOT NULL,
opcao_1 VARCHAR(255) NULL,
opcao_2 VARCHAR(255) NULL,
opcao_3 VARCHAR(255) NULL,
opcao_4 VARCHAR(255) NULL,
resposta_correta VARCHAR(255) NULL
);

-- 2. INSERÇÃO DOS DADOS
-- (Resposta: Brasil)
INSERT INTO perguntas (bandeira_url, opcao_1, opcao_2, opcao_3, opcao_4, resposta_correta)
VALUES ('https://i.pinimg.com/736x/18/1e/c0/181ec0ab19475f8137358e0244bca843.jpg', 'Argentina', 'Brasil', 'Colômbia', 'Chile', 'Brasil');

-- (Resposta: Japão)
INSERT INTO perguntas (bandeira_url, opcao_1, opcao_2, opcao_3, opcao_4, resposta_correta)
VALUES ('https://i.pinimg.com/control1/736x/a8/5f/3d/a85f3de67f4e3e931bd8897118ea4450.jpg', 'Japão', 'China', 'Coreia do Sul', 'Tailândia', 'Japão');

-- (Resposta: França)
INSERT INTO perguntas (bandeira_url, opcao_1, opcao_2, opcao_3, opcao_4, resposta_correta)
VALUES ('https://i.pinimg.com/control1/736x/1f/e5/46/1fe5464860172cce2e467c47916fb89f.jpg', 'Itália', 'França', 'Reino Unido', 'Alemanha', 'França');

-- (Resposta: Coreia do Sul)
INSERT INTO perguntas (bandeira_url, opcao_1, opcao_2, opcao_3, opcao_4, resposta_correta)
VALUES ('https://i.pinimg.com/control1/1200x/a7/66/fa/a766fa10206df3cf1c2d75e1d614c523.jpg', 'Coreia do Sul', 'Japão', 'China', 'Tailândia', 'Coreia do Sul');
