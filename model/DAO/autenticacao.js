const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Inserir autenticação de usuário
const insertUserAuthentication = async function(idUsuario, senhaHash) {
    try {
        let sql = `
            INSERT INTO tbl_autenticacao (id_usuario, senha)
            VALUES (${idUsuario}, '${senhaHash}')
        `;

        let result = await prisma.$executeRawUnsafe(sql);
        return result ? true : false;
    } catch (error) {
        console.error('Erro ao inserir autenticação:', error);
        return false;
    }
};

// Buscar autenticação por ID de autenticação
const getUserAutentication = async function(idAutenticacao) {
    try {
        let sql = `
            SELECT * FROM tbl_autenticacao WHERE id = ${idAutenticacao}
        `;

        let result = await prisma.$queryRawUnsafe(sql);

        return result && result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error('Erro ao buscar autenticação:', error);
        return null;
    }
};

// Buscar autenticação por ID de usuário
const getUserAuthenticationByUserId = async function(idUsuario) {
    try {
        let sql = `
            SELECT * FROM tbl_autenticacao WHERE id_usuario = ${idUsuario}
        `;

        let result = await prisma.$queryRawUnsafe(sql);

        return result && result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error('Erro ao buscar autenticação por usuário:', error);
        return null;
    }
};

// Listar todas as autenticações
const getAllUserAuthentications = async function() {
    try {
        let result = await prisma.tbl_autenticacao.findMany();
        return result; // Retorna todas as autenticações
    } catch (error) {
        console.error('Erro ao listar autenticações:', error);
        return [];
    }
};

// Atualizar senha de um usuário
const updateSenha = async function(idUsuario, senhaHash) {
    try {
        let result = await prisma.tbl_autenticacao.update({
            where: { id_usuario: idUsuario },
            data: { senha: senhaHash },
        });
        return result ? true : false;
    } catch (error) {
        console.error('Erro ao atualizar senha:', error);
        return false;
    }
};

module.exports = {
    insertUserAuthentication,
    getUserAutentication,
    getUserAuthenticationByUserId,
    getAllUserAuthentications,
    updateSenha,
};