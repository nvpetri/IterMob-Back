const historicoDAO = require('../model/DAO/historico.js');
const message = require('../modulo/config.js');

// Listar o histórico de viagens, incluindo dados das tabelas relacionadas
const getListarHistoricoViagens = async function() {
    try {
        const listaHistorico = await historicoDAO.selectAllHistoricoViagens();

        if (listaHistorico && listaHistorico.length > 0) {
            return {
                
                status_code: message.SUCCESS_OK.status_code,
                message: message.SUCCESS_OK.message,
                historicos: listaHistorico
            };
        } else {
            return message.ERROR_NOT_FOUND; // 404
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER; // 500
    }
};

const formatarData = (data) => {
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia}T00:00:00.000Z`
};

const setInserirNovoHistoricoViagem = async function (dadosBody, contentType) {
    try {
        // Validar o tipo de conteúdo
        if (String(contentType).toLowerCase() !== 'application/json') {
            return message.ERROR_CONTENT_TYPE
        }

        // Validar campos obrigatórios
        const { id_usuario, codigo_operacao, id_operacional, data_viagem } = dadosBody;

        if (!id_usuario || !codigo_operacao || !id_operacional || !data_viagem) {
            return message.ERROR_REQUIRED_FIELDS
        }

        // Converter a data para o formato do banco
        const dataFormatada = formatarData(data_viagem);

        // Chamar a DAO para inserir os dados
        const novoHistorico = await historicoDAO.insertHistoricoViagem({
            id_usuario,
            codigo_operacao,
            id_operacional,
            data_viagem: dataFormatada
        });

        // Verificar o resultado da DAO
        if (novoHistorico.success) {
            return {
                status: true,
                status_code: 201,
                message: novoHistorico.message,
                historico: novoHistorico.historico
            };
        } else {
            return {
                status: false,
                status_code: 500,
                message: novoHistorico.message
            };
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
};


module.exports = {
    getListarHistoricoViagens,
    setInserirNovoHistoricoViagem
};