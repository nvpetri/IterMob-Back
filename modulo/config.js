/******************************* MENSAGENS DE ERRO****************************************/
const ERROR_INVALID_ID = { status: false, status_code: 400, message: 'O ID encaminhado na requisição não é valido!!!!' }
const ERROR_NOT_FOUND = { status: false, status_code: 404, message: 'Nenhum item encontrado na requisição' }
const ERROR_INTERNAL_SERVER_DB = { status: false, status_code: 500, message: 'Ocorreram erros internos no servidor de banco de dados, por favor contate o administrador do sistema' }
const ERROR_REQUIRED_FIELDS = { status: false, status_code: 400, message: 'Existem campos obrigatiorios que não foram preenchidos corretamente' }
const ERROR_CONTENT_TYPE = { status: false, status_code: 415, message: 'O Content-Type da requisição não é suportado. Precisa ser enviado dados no formato application/json' }
const ERROR_INTERNAL_SERVER = { status: false, status_code: 500, message: 'Ocorreram erros internos no servidor na camada de negocio da API' }
const ERROR_REQUIRED_PASSWORD = { status: false, status_code: 400, message: 'A senha é obrigatória e não foi fornecida' }


/******************************* MENSAGENS DE SUCESSO****************************************/

const SUCCESS_CREATED_ITEM = { status: true, status_code: 201, message: 'Item Inserido com sucesso!' }
const SUCCESS_DELETED_ITEM = { status: true, status_code: 202, message: 'Item Deletado com sucesso!' }
const SUCCESS_UPDATED_ITEM = { status: true, status_code: 200, message: 'Item Atualizado com Sucesso!' }
const SUCCESS_OK = { status: true, status_code: 200, message: 'Item Selecionado com Sucesso!' }


module.exports = {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND,
    ERROR_INTERNAL_SERVER_DB,
    ERROR_REQUIRED_FIELDS,
    ERROR_REQUIRED_PASSWORD,
    SUCCESS_CREATED_ITEM,
    ERROR_CONTENT_TYPE,
    ERROR_INTERNAL_SERVER,
    SUCCESS_DELETED_ITEM,
    SUCCESS_UPDATED_ITEM,
    SUCCESS_OK
}