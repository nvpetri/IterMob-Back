const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para buscar usuário pelo email
const getUserByEmail = async function(email) {
    try {
      
      let user = await prisma.tbl_usuarios.findUnique({
        where: {
          email: email,
        }
      });
  
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  };
  

  const getUserAuthenticationByUserId = async function(idUsuario) {
    try {
        // Busca a autenticação (senha) do usuário
        let result = await prisma.tbl_autenticacao.findFirst({
            where: {
                id_usuario: idUsuario // O campo 'id_usuario' não é único
            }
        });

        return result ? result : null;
    } catch (error) {
        console.error('Erro ao buscar autenticação do usuário:', error);
        return null;
    }
};

module.exports = {
    getUserByEmail,
    getUserAuthenticationByUserId,
};
