const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Buscar todos os históricos de viagens
const selectAllHistoricoViagens = async function() {
    try {
        let sql = `
            SELECT 
                id, nome, empresa, prefixo, status
            FROM historico_viagens
            ORDER BY id DESC
        `;
        let rsHistorico = await prisma.$queryRawUnsafe(sql);
        return rsHistorico.length > 0 ? rsHistorico : false;
    } catch (error) {
        console.error("Erro ao buscar todos os históricos de viagens:", error);
        return false;
    }
};

// Buscar um histórico de viagens pelo ID
const selectHistoricoById = async function(id) {
    try {
        let sql = `
            SELECT 
                id, nome, empresa, prefixo, status
            FROM historico_viagens
            WHERE id = $1
        `;
        let rsHistorico = await prisma.$queryRawUnsafe(sql, id);
        return rsHistorico.length > 0 ? rsHistorico[0] : false;
    } catch (error) {
        console.error(`Erro ao buscar o histórico de viagens com ID ${id}:`, error);
        return false;
    }
};

// Inserir um novo registro de histórico de viagens
const insertHistoricoViagens = async function(dadosHistorico) {
    try {
        let sql = `
            INSERT INTO historico_viagens (nome, empresa, prefixo, status)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `;
        let result = await prisma.$queryRawUnsafe(sql, 
            dadosHistorico.nome, 
            dadosHistorico.empresa, 
            dadosHistorico.prefixo, 
            dadosHistorico.status
        );
        return result.length > 0 ? result[0] : false;
    } catch (error) {
        console.error("Erro ao inserir um novo histórico de viagens:", error);
        return false;
    }
};

// Atualizar um registro de histórico de viagens
const updateHistoricoViagens = async function(id, novosDadosHistorico) {
    try {
        let sql = `
            UPDATE historico_viagens
            SET 
                nome = $1,
                empresa = $2,
                prefixo = $3,
                status = $4
            WHERE id = $5
        `;
        let result = await prisma.$executeRawUnsafe(sql, 
            novosDadosHistorico.nome, 
            novosDadosHistorico.empresa, 
            novosDadosHistorico.prefixo, 
            novosDadosHistorico.status,
            id
        );
        return result ? true : false;
    } catch (error) {
        console.error(`Erro ao atualizar o histórico de viagens com ID ${id}:`, error);
        return false;
    }
};

// Deletar um registro de histórico de viagens pelo ID
const deleteHistoricoViagens = async function(id) {
    try {
        let sql = `
            DELETE FROM historico_viagens
            WHERE id = $1
        `;
        let result = await prisma.$executeRawUnsafe(sql, id);
        return result ? true : false;
    } catch (error) {
        console.error(`Erro ao deletar o histórico de viagens com ID ${id}:`, error);
        return false;
    }
};

module.exports = {
    selectAllHistoricoViagens,
    selectHistoricoById,
    insertHistoricoViagens,
    updateHistoricoViagens,
    deleteHistoricoViagens
};
