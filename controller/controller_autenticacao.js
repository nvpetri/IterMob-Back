const bcrypt = require('bcrypt');
const message = require('../modulo/config.js');
const authDAO = require('../model/DAO/autenticacao');


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

const getUserAutentication = async function(id_usuario){
    try {
        if(!id_usuario){
            return message.ERROR_INVALID_ID
        }else{
            
        }

    } catch (error) {
        
    }
}

module.exports = {
    setInserirAutenticacao,
    getUserAutentication
};