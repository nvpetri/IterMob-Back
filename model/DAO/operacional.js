const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Retorna todas as operações cadastradas.
 */
const selectAllOperacoes = async function () {
    try {
        const sql = `
            SELECT o.id AS operacao_id,
                   t.prefixo AS prefixo_onibus,
                   t.linha AS linha_onibus,
                   t.motorista,
                   o.sentido,
                   o.data_viagem
            FROM tbl_operacional o
            JOIN tabela t ON o.id_onibus = t.id;
        `;
        const operacoes = await prisma.$queryRawUnsafe(sql);
        return operacoes;
    } catch (error) {
        console.error("Erro ao listar operações:", error);
        return null;
    }
};

/**
 * Verifica se um ônibus existe pelo ID.
 * @param {number} id_onibus - ID do ônibus.
 */


const verificarOnibusExiste = async function (id_onibus) {
    try {
        const sql = `SELECT id FROM tabela WHERE id = $1`; // A consulta está correta aqui
        const result = await prisma.$queryRawUnsafe(sql, id_onibus); // Certifique-se que isso está retornando o resultado esperado
        return result.length > 0; // Se encontrar o ônibus, retornará verdadeiro
    } catch (error) {
        console.error("Erro ao verificar ônibus:", error);
        return false;
    }
};

/**
 * Insere uma nova operação.
 * @param {Object} dadosOperacao - Dados da nova operação.
 */
const insertOperacao = async function (dadosOperacao) {
    try {
        const sql = `
            INSERT INTO tbl_operacional (id_onibus, sentido, data_viagem)
            VALUES ($1, $2, $3);
        `;
        const dataViagemTimestamp = new Date(dadosOperacao.data_viagem); // Converte para timestamp válido
        const result = await prisma.$executeRawUnsafe(
            sql,
            dadosOperacao.id_onibus,
            dadosOperacao.sentido,
            dataViagemTimestamp
        );
        return result > 0; // Retorna true se a operação foi inserida
    } catch (error) {
        console.error("Erro ao inserir operação:", error);
        return null;
    }
};

/**
 * Atualiza uma operação existente.
 * @param {Object} dadosOperacao - Dados atualizados da operação.
 * @param {number} id - ID da operação a ser atualizada.
 */
const updateOperacao = async function (dadosOperacao, id) {
    try {
        const sql = `
            UPDATE tbl_operacional
            SET id_onibus = $1, sentido = $2, data_viagem = $3
            WHERE id = $4;
        `;
        const result = await prisma.$executeRawUnsafe(
            sql,
            dadosOperacao.id_onibus,
            dadosOperacao.sentido,
            dadosOperacao.data_viagem,
            id
        );
        return result > 0;
    } catch (error) {
        console.error("Erro ao atualizar operação:", error);
        return null;
    }
};

/**
 * Remove uma operação com base no ID.
 * @param {number} id - ID da operação.
 */
const deleteOperacao = async function (id) {
    try {
        const sql = `
            DELETE FROM tbl_operacional WHERE id = $1;
        `;
        const result = await prisma.$executeRawUnsafe(sql, id);
        return result > 0;
    } catch (error) {
        console.error("Erro ao deletar operação:", error);
        return null;
    }
};

module.exports = {
    selectAllOperacoes,
    verificarOnibusExiste,
    insertOperacao,
    updateOperacao,
    deleteOperacao,
};
