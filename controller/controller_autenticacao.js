const message = require('../modulo/config.js');
const authDAO = require('../model/DAO/autenticacao');

// Função para inserir autenticação
const setInserirAutenticacao = async function(idUsuario, senha) {
    try {
        if (!idUsuario || !senha) {
            return message.ERROR_REQUIRED_FIELDS;
        }

        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(senha, saltRounds);

        let result = await authDAO.insertUserAuthentication(idUsuario, senhaHash);
        return result ? message.SUCCESS_CREATED_ITEM : message.ERROR_INTERNAL_SERVER_DB;
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

// Função para buscar autenticação pelo ID do usuário
const getUserAutentication = async function(idUsuario) {
    try {
        if (!idUsuario) {
            return message.ERROR_INVALID_ID;
        }

        let result = await authDAO.getUserAutenticationByUserId(idUsuario);

        if (result) {
            return { status_code: 200, message: 'Autenticação encontrada', data: result };
        } else {
            return message.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

// Função para listar todas as autenticações
const getAllUserAuthentications = async function() {
    try {
        let result = await authDAO.getAllUserAuthentications();

        if (result && result.length > 0) {
            return { status_code: 200, message: 'Autenticações encontradas', data: result };
        } else {
            return { status_code: 404, message: 'Nenhuma autenticação encontrada' };
        }
    } catch (error) {
        console.error(error);
        return { status_code: 500, message: message.ERROR_INTERNAL_SERVER };
    }
};

// Função para validar senha
const validateUserPassword = async function(idUsuario, senhaInserida) {
    try {
        if (!idUsuario || !senhaInserida) {
            return message.ERROR_REQUIRED_FIELDS;
        }

        // Busca a autenticação do usuário no banco de dados
        let result = await authDAO.getUserAuthenticationByUserId(idUsuario);

        if (result && result.senha) {
            // Compara a senha inserida com o hash salvo no banco
            const senhaValida = await bcrypt.compare(senhaInserida, result.senha);
            return senhaValida ? { status_code: 200, message: 'Senha válida', data: { idUsuario } } : { status_code: 401, message: 'Senha inválida' };
        } else {
            return { status_code: 404, message: 'Usuário ou autenticação não encontrada' };
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

// Função para testar se o usuário possui uma senha atribuída
const testIfUserHasPassword = async function(idUsuario) {
    try {
        let result = await authDAO.getUserAuthenticationByUserId(idUsuario);

        // Verifica se o usuário tem autenticação registrada e se a senha não é nula
        if (result && result.senha) {
            return { status_code: 200, message: 'Senha atribuída ao usuário', data: { idUsuario } };
        } else {
            return { status_code: 404, message: 'Usuário não possui senha atribuída' };
        }
    } catch (error) {
        console.error(error);
        return { status_code: 500, message: 'Erro interno do servidor' };
    }
};

module.exports = {
    setInserirAutenticacao,
    getUserAutentication,
    getAllUserAuthentications,
    validateUserPassword,
    testIfUserHasPassword,
};
