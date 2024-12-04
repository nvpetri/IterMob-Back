const message = require('../modulo/config.js');
const authDAO = require('../model/DAO/login');

// Função de login
const login = async function(email, senha) {
    try {
        if (!email || !senha) {
            return message.ERROR_REQUIRED_FIELDS;
        }

        // Passo 1: Buscar o usuário pelo email
        let user = await authDAO.getUserByEmail(email);

        // Verifica se o usuário foi encontrado
        if (!user) {
            return { status_code: 404, message: 'Usuário não encontrado' };
        }

        // Passo 2: Buscar autenticação do usuário (senha)
        let auth = await authDAO.getUserAuthenticationByUserId(user.id);

        // Verifica se a autenticação foi encontrada
        if (!auth || !auth.senha) {
            return { status_code: 404, message: 'Autenticação não encontrada' };
        }

        // Passo 3: Comparar a senha informada com a senha armazenada (hash)
        const isPasswordValid = await bcrypt.compare(senha, auth.senha);

        if (isPasswordValid) {
            return { status_code: 200, message: 'Login bem-sucedido', data: { userId: user.id } };
        } else {
            return { status_code: 401, message: 'Senha inválida' };
        }

    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

module.exports = {
    login,
};
