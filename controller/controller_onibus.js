const message = require('../modulo/config.js');
const onibusDAO = require('../model/DAO/onibus.js');

// Função para inserir um novo ônibus
const setInserirOnibus = async function(dadosOnibus) {
    try {
        // Verifica se todos os campos obrigatórios estão presentes
        if (!dadosOnibus.prefixo || !dadosOnibus.linha || !dadosOnibus.motorista) {
            return {
                status_code: message.ERROR_REQUIRED_FIELDS.status_code,
                message: message.ERROR_REQUIRED_FIELDS.message,
            }; // Retorna erro caso algum campo obrigatório esteja ausente
        }

        // Chama a função DAO para inserir o ônibus
        const result = await onibusDAO.insertOnibus(dadosOnibus);

        // Verifica o resultado da inserção
        if (result) {
            return {
                status_code: message.SUCCESS_CREATED_ITEM.status_code,
                message: message.SUCCESS_CREATED_ITEM.message,
            }; // Retorna sucesso se o ônibus foi inserido
        } else {
            return {
                status_code: message.ERROR_INTERNAL_SERVER_DB.status_code,
                message: message.ERROR_INTERNAL_SERVER_DB.message,
            }; // Retorna erro caso algo tenha falhado na inserção
        }
    } catch (error) {
        console.error("Erro ao inserir ônibus:", error);
        return {
            status_code: message.ERROR_INTERNAL_SERVER.status_code,
            message: message.ERROR_INTERNAL_SERVER.message,
        }; // Retorna erro em caso de falha interna
    }
};

// Função para obter todos os ônibus cadastrados, com todas as informações
const getTodosOnibus = async function() {
    try {
        // Chama a função DAO para listar todos os ônibus
        const result = await onibusDAO.selectAllOnibus();

        // Verifica se há ônibus na resposta
        if (result && result.length > 0) {
            return {
                status_code: message.SUCCESS_OK.status_code,
                message: message.SUCCESS_OK.message,
                onibus: result.map(onibus => ({
                    id: onibus.id,
                    nome: onibus.nome,
                    empresa: onibus.empresa,
                    prefixo: onibus.prefixo,
                    status: onibus.status,
                    linha: onibus.linha,
                    motorista: onibus.motorista,
                })),
            }; // Retorna todos os ônibus, incluindo todas as colunas
        } else {
            return {
                status_code: message.ERROR_NOT_FOUND.status_code,
                message: message.ERROR_NOT_FOUND.message,
            }; // Retorna erro caso não encontre nenhum ônibus
        }
    } catch (error) {
        console.error("Erro ao listar ônibus:", error);
        return {
            status_code: message.ERROR_INTERNAL_SERVER.status_code,
            message: message.ERROR_INTERNAL_SERVER.message,
        }; // Retorna erro em caso de falha interna
    }
};

module.exports = {
    setInserirOnibus,
    getTodosOnibus,
};
