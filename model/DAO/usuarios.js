const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const selectAllUsers = async function() {
    try {
        let sql = `
            SELECT 
                u.id, u.cpf, u.nome, u.sobrenome, u.email, u.telefone, u.foto_perfil,
                e.id AS id_endereco, e.cep, e.rua, e.numero, e.cidade, e.bairro, e.estado
            FROM tbl_usuarios AS u
            LEFT JOIN tbl_endereco AS e ON u.id = e.id_usuario
            ORDER BY u.id DESC
        `;

        let rsUsuarios = await prisma.$queryRawUnsafe(sql);
        return rsUsuarios.length > 0 ? rsUsuarios : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};


const selectByIdUser = async function(id) {
    try {
        let sql = `
            SELECT 
                u.id, u.cpf, u.nome, u.sobrenome, u.email, u.telefone, u.foto_perfil,
                e.id AS id_endereco, e.cep, e.rua, e.numero, e.cidade, e.bairro, e.estado
            FROM tbl_usuarios AS u
            LEFT JOIN tbl_endereco AS e ON u.id = e.id_usuario
            WHERE u.id = ${id}
        `;
        let rsUsuario = await prisma.$queryRawUnsafe(sql);
        return rsUsuario.length > 0 ? rsUsuario[0] : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const insertUser = async function(dadosUsuario, dadosEndereco) {
    try {
        let resultUsuario = await prisma.$queryRaw`
            INSERT INTO tbl_usuarios (cpf, nome, sobrenome, email, telefone, foto_perfil) 
            VALUES (${dadosUsuario.cpf}, ${dadosUsuario.nome}, ${dadosUsuario.sobrenome}, ${dadosUsuario.email}, ${dadosUsuario.telefone}, ${dadosUsuario.foto_perfil}) 
            RETURNING id;`;

        let idUsuario = resultUsuario[0].id;


        if (resultUsuario) {
            if (dadosEndereco) {
                await prisma.$executeRawUnsafe(`
                    INSERT INTO tbl_endereco (cep, rua, numero, cidade, bairro, estado, id_usuario) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                    dadosEndereco.cep, dadosEndereco.rua, dadosEndereco.numero, 
                    dadosEndereco.cidade, dadosEndereco.bairro, dadosEndereco.estado, idUsuario);
            }


            await prisma.$executeRawUnsafe(`
                INSERT INTO tbl_autenticacao (id_usuario, senha) 
                VALUES (?, ?)`, idUsuario, senhaHash);

            return { id: idUsuario }; 
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};


const updateUser = async function(id, novosDadosUsuario) {
    try {
        let sqlUsuario = `
            UPDATE tbl_usuarios
            SET cpf = ?, nome = ?, sobrenome = ?, email = ?, telefone = ?, foto_perfil = ?
            WHERE id = ?
        `;

        let resultUsuario = await prisma.$executeRawUnsafe(sqlUsuario, novosDadosUsuario.cpf, novosDadosUsuario.nome, novosDadosUsuario.sobrenome, novosDadosUsuario.email, novosDadosUsuario.telefone, novosDadosUsuario.foto_perfil, id);

        return resultUsuario ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};


const updateEndereco = async function(idEndereco, novosDadosEndereco) {
    try {
        let sqlEndereco = `
            UPDATE tbl_endereco
            SET cep = ?, rua = ?, numero = ?, cidade = ?, bairro = ?, estado = ?
            WHERE id = ?
        `;
        let resultEndereco = await prisma.$executeRawUnsafe(sqlEndereco, novosDadosEndereco.cep, novosDadosEndereco.rua, novosDadosEndereco.numero, novosDadosEndereco.cidade, novosDadosEndereco.bairro, novosDadosEndereco.estado, idEndereco);

        return resultEndereco ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};


const insertUserAddress = async function(idUsuario, dadosEndereco) {
    try {
        let sqlEndereco = `
            INSERT INTO tbl_endereco (cep, rua, numero, cidade, bairro, estado, id_usuario) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        let resultEndereco = await prisma.$executeRawUnsafe(sqlEndereco, dadosEndereco.cep, dadosEndereco.rua, dadosEndereco.numero, dadosEndereco.cidade, dadosEndereco.bairro, dadosEndereco.estado, idUsuario);

        return resultEndereco ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};


const deleteUser = async function(id) {
    try {
        let sqlEndereco = `
            DELETE FROM tbl_endereco
            WHERE id_usuario = ?
        `;
        await prisma.$executeRawUnsafe(sqlEndereco, id);

        let sqlUsuario = `DELETE FROM tbl_usuarios WHERE id = ${id}`;
        let resultUsuario = await prisma.$executeRawUnsafe(sqlUsuario);

        return resultUsuario ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
}


module.exports = {
    selectAllUsers,
    selectByIdUser,
    insertUser,
    updateUser,
    updateEndereco,
    insertUserAddress,
    deleteUser
};