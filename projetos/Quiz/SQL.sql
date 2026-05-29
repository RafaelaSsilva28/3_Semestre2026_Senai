-- 1. CRIAÇÃO DA TABELA
CREATE TABLE quiz (
id_pergunta SERIAL PRIMARY KEY,
pergunta VARCHAR(255) NOT NULL,
img_pergunta TEXT NULL,
opcao_a VARCHAR(100) NULL,
opcao_b VARCHAR(100) NULL,
opcao_c VARCHAR(100) NULL,
opcao_d VARCHAR(100) NULL,
resposta_correta VARCHAR(255) NULL
);

-- Perguntas sobre a série The Boys
INSERT INTO quiz (pergunta, img_pergunta, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta) VALUES
('Qual é o nome do líder dos Sete no início da série?', 'https://i.pinimg.com/736x/25/1c/a4/251ca4d708939cd3b03a325e82ed76af.jpg', 'Capitão Pátria', 'Trem-Bala', 'Profundo', 'Translúcido', 'Capitão Pátria'),
('Qual substância dá superpoderes aos humanos em The Boys?', 'https://i.pinimg.com/736x/50/8d/82/508d82e89e61ec29a1ebb626b6b9c9f7.jpg', 'Composto V', 'Elemento X', 'Soro Super', 'Gás Coringa', 'Composto V'),
('Qual é o verdadeiro nome do Billy Bruto?', 'https://i.pinimg.com/736x/71/6a/d0/716ad076c39a6c4697467f8675d0b9b4.jpg', 'Billy Butcher', 'William Butcher', 'Will Smith', 'Billy Bob', 'William Butcher');
-- Perguntas sobre Doces
INSERT INTO quiz (pergunta, img_pergunta, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta) VALUES
('Qual é o ingrediente principal do brigadeiro tradicional?', 'https://i.pinimg.com/webp/736x/96/a9/d6/96a9d64bcf19e36acf281d9178347f32.webp', 'Leite condensado e chocolate', 'Creme de leite e açúcar', 'Leite em pó e água', 'Manteiga e mel', 'Leite condensado e chocolate'),
('De qual país é originário o doce chamado Macaron?', 'https://i.pinimg.com/736x/5e/2f/df/5e2fdf8cad4cf1316edab14bedc21acc.jpg', 'Itália', 'França', 'Bélgica', 'Suíça', 'França'),
('Qual desses doces é famoso por ser feito de marshmallow e ter formato de acampamento?', 'https://i.pinimg.com/webp/1200x/40/15/5f/40155f45b3a488694372b34f3a884c62.webp', 'S''mores', 'Brownie', 'Cookies', 'Cupcake', 'S''mores');
-- Perguntas sobre o anime Attack on Titan
INSERT INTO quiz (pergunta, img_pergunta, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta) VALUES
('Qual é o nome do protagonista de Attack on Titan?', 'https://i.pinimg.com/webp/736x/67/b6/90/67b690140f09b858dd942c7a35e434e2.webp', 'Eren Yeager', 'Armin Arlert', 'Levi Ackerman', 'Erwin Smith', 'Eren Yeager'),
('Qual é o nome da muralha mais externa que protege a humanidade?', 'https://i.pinimg.com/736x/2d/fc/4d/2dfc4d11b20fbca8f08898a8b4500091.jpg', 'Muralha Maria', 'Muralha Rose', 'Muralha Sina', 'Muralha Shiganshina', 'Muralha Maria'),
('Qual divisão militar é responsável por explorar o exterior das muralhas?', 'https://i.pinimg.com/736x/d6/80/78/d680780676a092b237d09eb757738079.jpg', 'Divisão de Reconhecimento', 'Polícia Militar', 'Guarnição', 'Cadetes', 'Divisão de Reconhecimento');