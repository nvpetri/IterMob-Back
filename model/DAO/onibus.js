const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para inserir um ônibus
const insertOnibus = async function(dadosOnibus) {
    try {
        // Usando Prisma para inserir diretamente na tabela 'tabela'
        const result = await prisma.tabela.create({
            data: {
                prefixo: dadosOnibus.prefixo,
                linha: dadosOnibus.linha,
                motorista: dadosOnibus.motorista
            }
        });
        return result ? true : false; // Retorna true se o ônibus foi inserido com sucesso.
    } catch (error) {
        console.error("Erro ao inserir ônibus:", error);
        return false;
    }
};

// Função para listar todos os ônibus (puxando todas as informações)
const selectAllOnibus = async function() {
    try {
        // Usando Prisma para buscar todos os registros da tabela 'tabela' com todos os campos
        const result = await prisma.tabela.findMany({
            select: {
                id: true,        // ID do ônibus
                nome: true,      // Nome do ônibus
                empresa: true,   // Empresa do ônibus
                prefixo: true,   // Prefixo do ônibus
                status: true,    // Status do ônibus
                linha: true,     // Linha do ônibus
                motorista: true  // Motorista do ônibus
            }
        });
        return result;
    } catch (error) {
        console.error("Erro ao listar ônibus:", error);
        return null;
    }
};

module.exports = {
    insertOnibus,
    selectAllOnibus,
};
