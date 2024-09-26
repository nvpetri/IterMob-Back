const message = require('../modulo/config.js');
const authDAO = require('../model/DAO/autenticacao');
const crypto = require('crypto');

// Função para criptografar a senha com MD5
const gerarHashMD5 = (senha) => {
    return crypto.createHash('md5').update(senha).digest('hex');
};

// Função para inserir a autenticação do usuário
const setInserirAutenticacao = async function(idUsuario, senha) {
    try {
        if (!idUsuario || !senha) {
            return message.ERROR_REQUIRED_FIELDS; // 400 Bad Request
        }

        // Gerar hash da senha com MD5
        const senhaHash = gerarHashMD5(senha);

        let result = await authDAO.insertUserAuthentication(idUsuario, senhaHash);
        return result ? message.SUCCESS_CREATED_ITEM : message.ERROR_INTERNAL_SERVER_DB;
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

module.exports = {
    setInserirAutenticacao
};