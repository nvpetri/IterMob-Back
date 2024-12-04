const message = require('../modulo/config.js');
const historicoViagensDAO = require('../model/DAO/historicoviagens.js');

// Listar todos os históricos de viagens
const getListarHistoricoViagens = async function() {
    try {
        let listarHistorico = await historicoViagensDAO.selectAllHistoricoViagens();

        if (listarHistorico && listarHistorico.length > 0) {
            return {
                status: message.SUCCESS_FETCH.status,
                status_code: message.SUCCESS_FETCH.status_code,
                message: message.SUCCESS_FETCH.message,
                historicos: listarHistorico
            };
        } else {
            return message.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER_DB;
    }
};

// Buscar um histórico de viagens pelo ID
const getBuscarHistoricoViagem = async function(id) {
    try {
        if (!id || isNaN(id)) {
            return message.ERROR_INVALID_ID;
        }

        let historico = await historicoViagensDAO.selectHistoricoById(id);

        if (historico) {
            return {
                status: message.SUCCESS_FETCH.status,
                status_code: message.SUCCESS_FETCH.status_code,
                message: message.SUCCESS_FETCH.message,
                historico
            };
        } else {
            return message.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER_DB;
    }
};

// Inserir um novo histórico de viagens
const setInserirHistoricoViagem = async function(dadosHistorico, contentType) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return message.ERROR_CONTENT_TYPE;
        }

        // Verificar campos obrigatórios
        if (!dadosHistorico.nome || !dadosHistorico.empresa || !dadosHistorico.prefixo || !dadosHistorico.status) {
            return message.ERROR_REQUIRED_FIELDS;
        }

        let novoHistorico = await historicoViagensDAO.insertHistoricoViagens(dadosHistorico);

        if (novoHistorico) {
            return {
                status: message.SUCCESS_CREATED_ITEM.status,
                status_code: message.SUCCESS_CREATED_ITEM.status_code,
                message: message.SUCCESS_CREATED_ITEM.message,
                historicoId: novoHistorico.id
            };
        } else {
            return message.ERROR_INTERNAL_SERVER_DB;
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER_DB;
    }
};

// Atualizar um histórico de viagens
const setAtualizarHistoricoViagem = async function(id, novosDadosHistorico) {
    try {
        if (!id || isNaN(id)) {
            return message.ERROR_INVALID_ID;
        }

        // Verificar campos obrigatórios
        if (!novosDadosHistorico.nome || !novosDadosHistorico.empresa || !novosDadosHistorico.prefixo || !novosDadosHistorico.status) {
            return message.ERROR_REQUIRED_FIELDS;
        }

        let historicoExistente = await historicoViagensDAO.selectHistoricoById(id);

        if (historicoExistente) {
            let atualizado = await historicoViagensDAO.updateHistoricoViagens(id, novosDadosHistorico);

            if (atualizado) {
                return message.SUCCESS_UPDATED_ITEM;
            } else {
                return message.ERROR_INTERNAL_SERVER_DB;
            }
        } else {
            return message.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER_DB;
    }
};

// Excluir um histórico de viagens
const setExcluirHistoricoViagem = async function(id) {
    try {
        if (!id || isNaN(id)) {
            return message.ERROR_INVALID_ID;
        }

        let historicoExistente = await historicoViagensDAO.selectHistoricoById(id);

        if (historicoExistente) {
            let excluido = await historicoViagensDAO.deleteHistoricoViagens(id);

            if (excluido) {
                return message.SUCCESS_DELETED_ITEM;
            } else {
                return message.ERROR_INTERNAL_SERVER_DB;
            }
        } else {
            return message.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

module.exports = {
    getListarHistoricoViagens,
    getBuscarHistoricoViagem,
    setInserirHistoricoViagem,
    setAtualizarHistoricoViagem,
    setExcluirHistoricoViagem
};
