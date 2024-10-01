const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const insertUserAuthentication = async function(idUsuario, senhaHash) {
    try {
        let sql = `
            INSERT INTO tbl_autenticacao (id_usuario, senha)
            VALUES (${idUsuario}, '${senhaHash}')
        `;

        let result = await prisma.$executeRawUnsafe(sql);
        return result ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const updateSenha = async function(usuarioId, senhaHash) {
    return await prisma.tbl_usuarios.update({
        where: { id: usuarioId },
        data: { senha: senhaHash }
    });
};


module.exports = {
    insertUserAuthentication,
    updateSenha
};