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

const insertUser = async (dadosUsuario, dadosEndereco) => {
    try {
      console.log("Iniciando a criação do usuário...");
  
      // Criar o usuário com ou sem o endereço, dependendo da entrada
      const novoUsuario = await prisma.tbl_usuarios.create({
        data: {
          cpf: dadosUsuario.cpf,
          nome: dadosUsuario.nome,
          sobrenome: dadosUsuario.sobrenome,
          email: dadosUsuario.email,
          telefone: dadosUsuario.telefone,
          foto_perfil: dadosUsuario.foto_perfil,
          tbl_endereco: dadosEndereco
            ? {
                create: {
                  cep: dadosEndereco.cep,
                  rua: dadosEndereco.rua,
                  numero: dadosEndereco.numero,
                  cidade: dadosEndereco.cidade,
                  bairro: dadosEndereco.bairro,
                  estado: dadosEndereco.estado,
                },
              }
            : undefined,
        },
        include: {
          tbl_endereco: true, // Inclui o endereço no retorno, se existir
        },
      });
  
      console.log("Usuário criado com sucesso:", novoUsuario);
  
      // Verifique se o usuário foi inserido corretamente
      if (novoUsuario) {
        return {
          success: true,
          usuario: novoUsuario, // Retorna os dados completos do usuário criado
        };
      } else {
        console.log("Erro: Nenhum usuário retornado");
        return {
          success: false,
          message: "Erro ao criar o usuário.",
        };
      }
    } catch (error) {
      console.error("Erro ao inserir usuário:", error);
      return {
        success: false,
        message: 'Erro ao inserir usuário no banco de dados.',
      };
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
        // let sqlEndereco = `
        //     DELETE FROM tbl_endereco
        //     WHERE id_usuario = ?
        // `;
        // await prisma.$executeRawUnsafe(sqlEndereco, id);

        let sqlUsuario = `DELETE FROM tbl_usuarios WHERE id = ${id}`;
        console.log(sqlUsuario)
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