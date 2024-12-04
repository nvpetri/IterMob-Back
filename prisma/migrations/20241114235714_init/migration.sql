-- CreateTable
CREATE TABLE "tbl_endereco" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "cep" VARCHAR(10) NOT NULL,
    "rua" VARCHAR(100) NOT NULL,
    "numero" VARCHAR(10),
    "cidade" VARCHAR(100) NOT NULL,
    "bairro" VARCHAR(100),
    "estado" VARCHAR(100) NOT NULL,

    CONSTRAINT "tbl_endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_usuarios" (
    "id" SERIAL NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "nome" VARCHAR(200) NOT NULL,
    "sobrenome" VARCHAR(200) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "telefone" VARCHAR(20) NOT NULL,
    "foto_perfil" VARCHAR(200),

    CONSTRAINT "tbl_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_autenticacao" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "senha" VARCHAR(255) NOT NULL,

    CONSTRAINT "tbl_autenticacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favoritos" (
    "id" SERIAL NOT NULL,
    "id_itinerario" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "favoritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itinerario" (
    "id" SERIAL NOT NULL,
    "origem" VARCHAR(50) NOT NULL,
    "destino" VARCHAR(100) NOT NULL,
    "linha" VARCHAR(5) NOT NULL,

    CONSTRAINT "itinerario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tabela" (
    "id" SERIAL NOT NULL,
    "prefixo" INTEGER NOT NULL,
    "linha" VARCHAR(100) NOT NULL,
    "motorista" VARCHAR(100) NOT NULL,

    CONSTRAINT "tabela_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_historico_viagens" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "codigo_operacao" INTEGER NOT NULL,
    "id_operacional" INTEGER NOT NULL,
    "data_viagem" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_historico_viagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_operacional" (
    "id" SERIAL NOT NULL,
    "id_onibus" INTEGER NOT NULL,
    "sentido" VARCHAR(6) NOT NULL,
    "data_viagem" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_operacional_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_tbl_endereco_id_usuario" ON "tbl_endereco"("id_usuario");

-- CreateIndex
CREATE INDEX "idx_tbl_autenticacao_id_usuario" ON "tbl_autenticacao"("id_usuario");

-- CreateIndex
CREATE INDEX "idx_favoritos_id_itinerario" ON "favoritos"("id_itinerario");

-- CreateIndex
CREATE INDEX "idx_favoritos_id_usuario" ON "favoritos"("id_usuario");

-- CreateIndex
CREATE INDEX "idx_tbl_historico_viagens_id_operacional" ON "tbl_historico_viagens"("id_operacional");

-- CreateIndex
CREATE INDEX "idx_tbl_historico_viagens_id_usuario" ON "tbl_historico_viagens"("id_usuario");

-- CreateIndex
CREATE INDEX "idx_tbl_operacional_id_onibus" ON "tbl_operacional"("id_onibus");

-- AddForeignKey
ALTER TABLE "tbl_endereco" ADD CONSTRAINT "tbl_endereco_ibfk_1" FOREIGN KEY ("id_usuario") REFERENCES "tbl_usuarios"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "tbl_autenticacao" ADD CONSTRAINT "tbl_autenticacao_ibfk_1" FOREIGN KEY ("id_usuario") REFERENCES "tbl_usuarios"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_ibfk_1" FOREIGN KEY ("id_itinerario") REFERENCES "itinerario"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_ibfk_2" FOREIGN KEY ("id_usuario") REFERENCES "tbl_usuarios"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "tbl_historico_viagens" ADD CONSTRAINT "tbl_historico_viagens_ibfk_1" FOREIGN KEY ("id_usuario") REFERENCES "tbl_usuarios"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "tbl_historico_viagens" ADD CONSTRAINT "tbl_historico_viagens_ibfk_2" FOREIGN KEY ("id_operacional") REFERENCES "tbl_operacional"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "tbl_operacional" ADD CONSTRAINT "tbl_operacional_ibfk_1" FOREIGN KEY ("id_onibus") REFERENCES "tabela"("id") ON DELETE CASCADE ON UPDATE RESTRICT;
