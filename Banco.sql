
CREATE DATABASE itermob;

USE itermob;


CREATE TABLE tbl_usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cpf VARCHAR(11) NOT NULL,
    nome VARCHAR(200) NOT NULL,
    sobrenome VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    foto_perfil VARCHAR(200)
);


CREATE TABLE tbl_endereco (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    cep VARCHAR(10) NOT NULL,
    rua VARCHAR(100) NOT NULL,
    numero VARCHAR(10),
    cidade VARCHAR(100) NOT NULL,
    bairro VARCHAR(100),
    estado VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id) ON DELETE CASCADE
);


CREATE TABLE tbl_autenticacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    senha VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id) ON DELETE CASCADE
);


CREATE TABLE tabela (
    id INT PRIMARY KEY AUTO_INCREMENT,
    prefixo INT NOT NULL,
    linha VARCHAR(100) NOT NULL,
    motorista VARCHAR(100) NOT NULL
);


CREATE TABLE tbl_operacional (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_onibus INT NOT NULL,
    sentido VARCHAR(6) NOT NULL, -- 'ida' ou 'volta'
    data_viagem TIMESTAMP NOT NULL,
    FOREIGN KEY (id_onibus) REFERENCES tabela(id) ON DELETE CASCADE
);


CREATE TABLE tbl_historico_viagens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    codigo_operacao INT NOT NULL,
    id_operacional INT NOT NULL,
    data_viagem TIMESTAMP NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_operacional) REFERENCES tbl_operacional(id) ON DELETE CASCADE
);




INSERT INTO tbl_usuarios (cpf, nome, sobrenome, email, telefone, foto_perfil)
VALUES 
('23456789012', 'Maria', 'Oliveira', 'maria.oliveira@example.com', '(11) 91234-5678', 'https://example.com/foto_maria.jpg'),
('34567890123', 'Carlos', 'Santos', 'carlos.santos@example.com', '(21) 97654-3210', 'https://example.com/foto_carlos.jpg'),
('45678901234', 'Ana', 'Costa', 'ana.costa@example.com', '(31) 98456-1234', 'https://example.com/foto_ana.jpg'),
('56789012345', 'Paulo', 'Almeida', 'paulo.almeida@example.com', '(41) 98234-5678', 'https://example.com/foto_paulo.jpg'),
('67890123456', 'Fernanda', 'Gomes', 'fernanda.gomes@example.com', '(51) 97678-4321', 'https://example.com/foto_fernanda.jpg'),
('78901234567', 'Ricardo', 'Pereira', 'ricardo.pereira@example.com', '(61) 98987-6543', 'https://example.com/foto_ricardo.jpg'),
('89012345678', 'Juliana', 'Mendes', 'juliana.mendes@example.com', '(71) 97123-4567', 'https://example.com/foto_juliana.jpg'),
('90123456789', 'André', 'Silveira', 'andre.silveira@example.com', '(81) 98567-8910', 'https://example.com/foto_andre.jpg'),
('01234567890', 'Beatriz', 'Fernandes', 'beatriz.fernandes@example.com', '(91) 97234-5678', 'https://example.com/foto_beatriz.jpg'),
('12345098765', 'Gabriel', 'Araujo', 'gabriel.araujo@example.com', '(92) 98321-4567', 'https://example.com/foto_gabriel.jpg'),
('23456109876', 'Larissa', 'Ribeiro', 'larissa.ribeiro@example.com', '(93) 98765-4321', 'https://example.com/foto_larissa.jpg'),
('34567210987', 'Marcos', 'Martins', 'marcos.martins@example.com', '(94) 97234-8765', 'https://example.com/foto_marcos.jpg'),
('45678321098', 'Patrícia', 'Lima', 'patricia.lima@example.com', '(95) 96543-2109', 'https://example.com/foto_patricia.jpg'),
('56789432109', 'Thiago', 'Souza', 'thiago.souza@example.com', '(96) 98654-1234', 'https://example.com/foto_thiago.jpg'),
('67890543210', 'Camila', 'Carvalho', 'camila.carvalho@example.com', '(97) 96432-1098', 'https://example.com/foto_camila.jpg');



INSERT INTO tbl_endereco (id_usuario, cep, rua, numero, cidade, bairro, estado)
VALUES 
(1, '01010-000', 'Rua das Flores', '123', 'São Paulo', 'Centro', 'SP'),
(2, '22020-010', 'Av. Atlântica', '456', 'Rio de Janeiro', 'Copacabana', 'RJ'),
(3, '30130-010', 'Rua da Bahia', '789', 'Belo Horizonte', 'Centro', 'MG'),
(4, '80040-210', 'Rua XV de Novembro', '321', 'Curitiba', 'Centro', 'PR'),
(5, '90010-050', 'Av. Borges de Medeiros', '654', 'Porto Alegre', 'Centro Histórico', 'RS');


INSERT INTO tbl_endereco (cep, rua, numero, cidade, bairro, estado, id_usuario)
VALUES ('12345-678', 'Rua Exemplo', '123', 'Cidade Exemplo', 'Bairro Exemplo', 'Estado Exemplo', 1);


INSERT INTO tabela (prefixo, linha, motorista)
VALUES (1001, 'Linha A', 'Carlos');


INSERT INTO tbl_operacional (id_onibus, sentido, data_viagem)
VALUES (1, 'ida', '2024-11-15 08:00:00');


INSERT INTO tbl_historico_viagens (id_usuario, codigo_operacao, id_operacional, data_viagem)
VALUES (1, 101, 1, '2024-11-15 08:00:00');

SELECT hv.id AS historico_id,
       hv.codigo_operacao,
       hv.data_viagem,
       o.id_onibus,
       o.sentido,
       o.data_viagem AS data_operacional,
       t.prefixo,
       t.linha,
       t.motorista
FROM tbl_historico_viagens hv
JOIN tbl_operacional o ON hv.id_operacional = o.id
JOIN tabela t ON o.id_onibus = t.id
WHERE hv.id_usuario = 1;

create table itinerario(
id int primary key auto_increment,
origem varchar(50) not null,
destino varchar(100) not null,
linha varchar(5) not null
);

CREATE TABLE favoritos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_itinerario INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_itinerario) REFERENCES itinerario(id) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id) ON DELETE CASCADE
);

ALTER TABLE tabela
ADD COLUMN nome VARCHAR(200) NOT NULL,
ADD COLUMN empresa VARCHAR(100) NOT NULL,
ADD COLUMN status VARCHAR(20) NOT NULL;

INSERT INTO tabela (nome, empresa, prefixo, status, linha, motorista)
VALUES
('Jd.Angélica', 'Del Rey', 51649, 'Ativo', 'Linha 1', 'Carlos'),
('Novo Horizonte', 'EMTU', 67654, 'Ativo', 'Linha 2', 'José'),
('Vila Dirce', 'Del Rey', 23456, 'Em manutenção', 'Linha 3', 'Ana'),
('Center Clube', 'EMTU', 12345, 'Ativo', 'Linha 4', 'Pedro'),
('Jd.Santa Brisa', 'Del Rey', 39876, 'Ativo', 'Linha 5', 'Maria');

CREATE TABLE historico_viagens (
    id SERIAL PRIMARY KEY,          
    nome VARCHAR(255) NOT NULL,       
    empresa VARCHAR(255) NOT NULL,    
    prefixo VARCHAR(255) NOT NULL,    
    status VARCHAR(50) NOT NULL       
);

-- Inserindo dados na tabela de histórico de viagens
INSERT INTO historico_viagens (nome, empresa, prefixo, status)
VALUES
    ('Jd.Angelica', 'Del Rey', '5 1649', 'Ativo'),
    ('Novo Horizonte', 'EMTU', '6 7654', 'Ativo'),
    ('Vila Dirce', 'Del Rey', '2 3456', 'Em manutenção'),
    ('Center Clube', 'EMTU', '1 2345', 'Ativo'),
    ('Jd.Santa Br.', 'Del Rey', '3 9876', 'Ativo');
    
