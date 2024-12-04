const message = require('../modulo/config.js');
const operacionalDAO = require('../model/DAO/operacional.js');

// Listar operações de ônibus
const getOperacoes = async function () {
    try {
        const operacoes = await operacionalDAO.selectAllOperacoes();
        if (operacoes && operacoes.length > 0) {
            return {
                status: message.SUCCESS_OK.status,
                status_code: message.SUCCESS_OK.status_code,
                message: message.SUCCESS_OK.message,
                operacoes,
            };
        } else {
            return message.ERROR_NOT_FOUND; // 404
        }
    } catch (error) {
        console.error("Erro ao obter operações:", error);
        return message.ERROR_INTERNAL_SERVER; // 500
    }
};

// Função para inserir uma nova operação
const setInserirOperacao = async function (dadosOperacao, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            if (!dadosOperacao.id_onibus || !dadosOperacao.sentido || !dadosOperacao.data_viagem) {
                return message.ERROR_REQUIRED_FIELDS; // 400
            }

            // Verifica se o ônibus existe
            const onibusExiste = await operacionalDAO.verificarOnibusExiste(dadosOperacao.id_onibus);
            if (!onibusExiste) {
                return {
                    status: message.ERROR_NOT_FOUND.status,
                    status_code: message.ERROR_NOT_FOUND.status_code,
                    message: "Ônibus não encontrado."
                };
            }

            const novaOperacao = await operacionalDAO.insertOperacao(dadosOperacao);
            if (novaOperacao) {
                return {
                    status: message.SUCCESS_CREATED_ITEM.status,
                    status_code: message.SUCCESS_CREATED_ITEM.status_code,
                    message: message.SUCCESS_CREATED_ITEM.message,
                    operacao: novaOperacao,
                };
            } else {
                return message.ERROR_INTERNAL_SERVER_DB; // 500
            }
        } else {
            return message.ERROR_CONTENT_TYPE; // 415
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER; // 500
    }
};

module.exports = {
    getOperacoes,
    setInserirOperacao,
};
