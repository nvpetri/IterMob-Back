const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const corsOptions = {
    origin: '*'
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

////////////////////////////////////////////////////////////////////// Import das Controllers ///////////////////////////////////////////////////////////////////////////////////////////
const controllerUsuario = require('./controller/controller_usuarios');
const controllerEndereco = require('./controller/controller_endereco');
const controllerAutenticacao = require('./controller/controller_autenticacao')
const controllerViagens = require('./controller/controller_viagens')
const controllerOperacional = require('./controller/controller_operacional');
const controllerOnibus = require('.//controller/controller_onibus')
const controllerLogin = require('./controller/controller_login')
const controllerHistoricoViagens = require('./controller/controller_historicoviagens')
    ////////////////////////////////////////////////////////////////////// End Point Usuarios ///////////////////////////////////////////////////////////////////////////////////////////

app.get('/v1/itermob/usuarios', async function(request, response) {
    let dadosUsuario = await controllerUsuario.getListarUsuarios();

    if (dadosUsuario) {
        dadosUsuario = convertBigIntToString(dadosUsuario); // Converte BigInt para string
        response.status(200).json(dadosUsuario);
    } else {
        response.status(404).json({ message: 'Nenhum registro encontrado' });
    }
});

app.get('/v1/itermob/usuario/:id', async function(request, response) {
    let idUsuario = request.params.id;
    let dadosUsuario = await controllerUsuario.getBuscarUsuario(idUsuario);
    dadosUsuario = convertBigIntToString(dadosUsuario); // Converte BigInt para string
    response.status(dadosUsuario.status_code).json(dadosUsuario);
});

app.get('/v1/itermob/usuario/:id/endereco', async function(request, response) {
    let idUsuario = request.params.id;
    let dadosUsuarioEndereco = await controllerUsuario.getBuscarUsuarioComEndereco(idUsuario);
    dadosUsuarioEndereco = convertBigIntToString(dadosUsuarioEndereco); // Converte BigInt para string
    response.status(dadosUsuarioEndereco.status_code).json(dadosUsuarioEndereco);
});

app.post('/v1/itermob/usuario', async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    try {
        let resultDados = await controllerUsuario.setInserirNovoUsuario(dadosBody, contentType);
        resultDados = convertBigIntToString(resultDados); // Converte BigInt para string
        response.status(resultDados.status_code).json(resultDados);
    } catch (error) {
        console.error('Erro:', error);
        response.status(500).json({ message: 'Erro interno do servidor' });
    }
});

app.delete('/v1/itermob/usuario/:id', async function(request, response) {
    let idUsuario = request.params.id;
    let resultDados = await controllerUsuario.setExcluirUsuario(idUsuario);
    resultDados = convertBigIntToString(resultDados); // Converte BigInt para string
    response.status(resultDados.status_code).json(resultDados);
});

app.put('/v1/itermob/usuario/:id', async function(request, response) {
    let idUsuario = request.params.id;
    let novosDadosUsuario = request.body;
    let resultDados = await controllerUsuario.setAtualizarUsuario(idUsuario, novosDadosUsuario);
    resultDados = convertBigIntToString(resultDados); // Converte BigInt para string
    response.status(resultDados.status_code).json(resultDados);
});

////////////////////////////////////////////////////////////////////// End Point Endereços ///////////////////////////////////////////////////////////////////////////////////////////

app.get('/v1/itermob/enderecos', async function(request, response) {
    let dadosEndereco = await controllerEndereco.getListarEnderecos();

    if (dadosEndereco) {
        dadosEndereco = convertBigIntToString(dadosEndereco); // Converte BigInt para string
        response.status(200).json(dadosEndereco);
    } else {
        response.status(404).json({ message: 'Nenhum registro encontrado' });
    }
});

app.get('/v1/itermob/endereco/:id', async function(request, response) {
    let idEndereco = request.params.id;
    let dadosEndereco = await controllerEndereco.getBuscarEndereco(idEndereco);
    dadosEndereco = convertBigIntToString(dadosEndereco); // Converte BigInt para string
    response.status(dadosEndereco.status_code).json(dadosEndereco);
});

app.post('/v1/itermob/endereco', async function(request, response) {
    let dadosBody = request.body;
    let resultDados = await controllerEndereco.setInserirNovoEndereco(dadosBody);
    resultDados = convertBigIntToString(resultDados); // Converte BigInt para string
    response.status(resultDados.status_code).json(resultDados);
});

app.delete('/v1/itermob/endereco/:id', async function(request, response) {
    let idEndereco = request.params.id;
    let resultDados = await controllerEndereco.setExcluirEndereco(idEndereco);
    resultDados = convertBigIntToString(resultDados); // Converte BigInt para string
    response.status(resultDados.status_code).json(resultDados);
});

app.put('/v1/itermob/endereco/:id', async function(request, response) {
    let idEndereco = request.params.id;
    let novosDadosEndereco = request.body;
    let resultDados = await controllerEndereco.setAtualizarEndereco(idEndereco, novosDadosEndereco);
    resultDados = convertBigIntToString(resultDados); // Converte BigInt para string
    response.status(resultDados.status_code).json(resultDados);
});

////////////////////////////////////////////////////////////////////// End Point Autenticação ///////////////////////////////////////////////////////////////////////////////////////////

app.post('/v1/itermob/autenticacao', async function(request, response) {
    try {
        let { idUsuario, senha } = request.body;

        // Verifica se os campos obrigatórios foram informados
        if (!idUsuario || !senha) {
            return response.status(400).json({ status_code: 400, message: 'Campos obrigatórios não informados.' });
        }

        let resultDados = await controllerAutenticacao.setInserirAutenticacao(idUsuario, senha);

        return response.status(resultDados.status_code).json(resultDados);
    } catch (error) {
        console.error('Erro na rota POST /v1/itermob/autenticacao:', error);
        return response.status(500).json({ status_code: 500, message: 'Erro interno do servidor.' });
    }
});

app.put('/v1/itermob/autenticacao/:idUsuario', async function(request, response) {
    try {
        let idUsuario = request.params.idUsuario;
        let { senhaAtual, novaSenha } = request.body;

        // Verifica se os campos obrigatórios foram informados
        if (!idUsuario || !senhaAtual || !novaSenha) {
            return response.status(400).json({ status_code: 400, message: 'Campos obrigatórios não informados.' });
        }

        // Valida a senha atual
        let validacao = await controllerAutenticacao.validateUserPassword(idUsuario, senhaAtual);

        if (validacao.status_code !== 200) {
            return response.status(validacao.status_code).json(validacao);
        }

        // Criptografa a nova senha
        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(novaSenha, saltRounds);

        // Atualiza a senha no banco de dados
        let result = await authDAO.updateSenha(idUsuario, senhaHash);

        if (result) {
            return response.status(200).json({ message: 'Senha atualizada com sucesso.' });
        } else {
            return response.status(500).json({ message: 'Erro ao atualizar a senha.' });
        }
    } catch (error) {
        console.error('Erro na rota PUT /v1/itermob/autenticacao/:idUsuario:', error);
        return response.status(500).json({ status_code: 500, message: 'Erro interno do servidor.' });
    }
});

// Buscar autenticação por ID
app.get('/v1/itermob/autenticacao/:id', async function(request, response) {
    try {
        console.log('Requisição recebida para buscar autenticação:', request.params.id);
        let idAutenticacao = request.params.id;

        // Verifica se o ID foi enviado
        if (!idAutenticacao) {
            return response.status(400).json({ status_code: 400, message: 'ID inválido ou não informado.' });
        }

        let result = await controllerAutenticacao.getUserAutentication(idAutenticacao);

        if (result.status_code) {
            return response.status(result.status_code).json(result);
        } else {
            return response.status(404).json({ status_code: 404, message: 'Autenticação não encontrada.' });
        }
    } catch (error) {
        console.error('Erro na rota GET /v1/itermob/autenticacao/:id:', error);
        return response.status(500).json({ status_code: 500, message: 'Erro interno do servidor.' });
    }
});

// Listar todas as autenticações
app.get('/v1/itermob/autenticacoes', async function(request, response) {
    try {
        console.log('Requisição recebida para listar todas as autenticações');
        let result = await controllerAutenticacao.getAllUserAuthentications();

        if (result.data && result.data.length > 0) {
            return response.status(result.status_code).json(result);
        } else {
            return response.status(404).json({ status_code: 404, message: 'Nenhuma autenticação encontrada.' });
        }
    } catch (error) {
        console.error('Erro na rota GET /v1/itermob/autenticacoes:', error);
        return response.status(500).json({ status_code: 500, message: 'Erro interno do servidor.' });
    }
});

////////////////////////////////////////////////////////////////////// End Point Viagens ///////////////////////////////////////////////////////////////////////////////////////////

app.get('/v1/itermob/viagens', async function(request, response) {
    try {
        let viagens = await controllerViagens.getListarHistoricoViagens();
        if (viagens) {
            viagens = convertBigIntToString(viagens); // Converte BigInt para string
            response.status(200).json(viagens);
        } else {
            response.status(404).json({ message: 'Nenhuma viagem encontrada.' });
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Erro ao listar as viagens.' });
    }
});

app.get('/v1/itermob/viagem/:id', async function(request, response) {
    let idViagem = request.params.id;
    try {
        let viagem = await controllerViagens.getBuscarViagem(idViagem);
        if (viagem) {
            viagem = convertBigIntToString(viagem); // Converte BigInt para string
            response.status(200).json(viagem);
        } else {
            response.status(404).json({ message: 'Viagem não encontrada.' });
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Erro ao buscar a viagem.' });
    }
});

app.post('/v1/itermob/viagem', async function(request, response) {
    let dadosBody = request.body;


    let result = await controllerViagens.setInserirNovoHistoricoViagem(
        dadosBody,
        request.headers['content-type']
    );

    response.status(result.status_code).json(result);
});

app.put('/v1/itermob/viagem/:id', async function(request, response) {
    let idViagem = request.params.id;
    let novosDadosViagem = request.body.viagem; // Novos dados da viagem

    try {
        let result = await controllerViagens.setAtualizarViagem(idViagem, novosDadosViagem);
        if (result) {
            response.status(200).json({ message: 'Viagem atualizada com sucesso.' });
        } else {
            response.status(400).json({ message: 'Erro ao atualizar a viagem.' });
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Erro ao atualizar a viagem.' });
    }
});

app.delete('/v1/itermob/viagem/:id', async function(request, response) {
    let idViagem = request.params.id;
    try {
        let result = await controllerViagens.setExcluirViagem(idViagem);
        if (result) {
            response.status(200).json({ message: 'Viagem deletada com sucesso.' });
        } else {
            response.status(400).json({ message: 'Erro ao deletar a viagem.' });
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Erro ao deletar a viagem.' });
    }
});



//////////////////////////////////////////////////////////////////////////////////// OPERACIONAL ////////////////////////////////////////////////////////////////////////////////////////////

// Rota para listar operações de ônibus
app.get('/v1/itermob/operacional', async(req, res) => {
    const response = await controllerOperacional.getOperacoes();
    res.status(response.status_code).json(response);
});

// Rota para inserir uma nova operação
app.post('/v1/itermob/operacional', async(req, res) => {
    const dadosOperacao = req.body;
    const contentType = req.headers['content-type'];
    const response = await controllerOperacional.setInserirOperacao(dadosOperacao, contentType);
    res.status(response.status_code).json(response);
});

//////////////////////////////////////////////////////////////////////////////////////////// ONIBUS ///////////////////////////////////////////////////////////////////////////////////////////

app.post('/v1/itermob/onibus', async function(request, response) {
    const dadosOnibus = request.body;

    // Chama a função da controller para criar um ônibus
    const result = await controllerOnibus.setInserirOnibus(dadosOnibus);

    // Retorna a resposta com o status e dados apropriados
    response.status(result.status_code).json(result);
});

app.get('/v1/itermob/onibus', async function(request, response) {
    // Chama a função da controller para buscar todos os ônibus
    const result = await controllerOnibus.getTodosOnibus();

    // Retorna a resposta com o status e dados apropriados
    response.status(result.status_code).json(result);
});

////////////////////////////////////////////////////////////////////////////////////////// LOGIN //////////////////////////////////////////////////////////////////////////////////

app.post('/v1/itermob/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Chama o controlador de login
        const result = await controllerLogin.login(email, senha);

        // Retorna a resposta baseada no resultado do login
        return res.status(result.status_code).json({
            message: result.message,
            data: result.data || null
        });

    } catch (error) {
        console.error('Erro ao processar o login:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

//////////////////////////////////////////////////////////////// HISTORICO VIAGENS //////////////////////////////////////////////////////////////

// Listar todos os históricos de viagens
app.get('/v1/itermob/historico-viagens', async (request, response) => {
    try {
        let dadosHistorico = await controllerHistoricoViagens.getListarHistoricoViagens();

        if (dadosHistorico && dadosHistorico.historicos && dadosHistorico.historicos.length > 0) {
            dadosHistorico.historicos = convertBigIntToString(dadosHistorico.historicos); // Converte BigInt para string
            response.status(200).json(dadosHistorico);
        } else {
            response.status(404).json({ message: 'Nenhum histórico de viagem encontrado.' });
        }
    } catch (error) {
        console.error('Erro na rota GET /v1/itermob/historico-viagens:', error);
        response.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// Buscar histórico de viagens por ID
app.get('/v1/itermob/historico-viagem/:id', async (request, response) => {
    let idHistorico = request.params.id;
    try {
        let dadosHistorico = await controllerHistoricoViagens.getBuscarHistoricoViagem(idHistorico);

        if (dadosHistorico) {
            dadosHistorico = convertBigIntToString(dadosHistorico); // Converte BigInt para string
            response.status(200).json(dadosHistorico);
        } else {
            response.status(404).json({ message: 'Histórico de viagem não encontrado.' });
        }
    } catch (error) {
        console.error('Erro na rota GET /v1/itermob/historico-viagem/:id:', error);
        response.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// Criar um novo histórico de viagens
app.post('/v1/itermob/historico-viagem', async (request, response) => {
    let dadosBody = request.body;
    let contentType = request.headers['content-type'];

    // Verificar se o Content-Type é application/json
    if (!contentType || !contentType.includes('application/json')) {
        return response.status(415).json({
            status: false,
            status_code: 415,
            message: "O Content-Type da requisição não é suportado. Precisa ser enviado dados no formato application/json"
        });
    }

    try {
        let resultado = await controllerHistoricoViagens.setInserirHistoricoViagem(dadosBody, contentType);

        if (resultado && resultado.status_code) {
            resultado = convertBigIntToString(resultado); // Converte BigInt para string
            response.status(resultado.status_code).json(resultado);
        } else {
            response.status(500).json({ message: 'Erro interno ao criar histórico de viagem.' });
        }
    } catch (error) {
        console.error('Erro na rota POST /v1/itermob/historico-viagem:', error);
        response.status(500).json({ message: 'Erro interno do servidor.' });
    }
});


// Atualizar um histórico de viagens
app.put('/v1/itermob/historico-viagem/:id', async (request, response) => {
    let idHistorico = request.params.id;
    let novosDadosHistorico = request.body;

    try {
        let resultado = await controllerHistoricoViagens.setAtualizarHistoricoViagem(idHistorico, novosDadosHistorico);

        if (resultado && resultado.status_code) {
            resultado = convertBigIntToString(resultado); // Converte BigInt para string
            response.status(resultado.status_code).json(resultado);
        } else {
            response.status(404).json({ message: 'Histórico de viagem não encontrado para atualização.' });
        }
    } catch (error) {
        console.error('Erro na rota PUT /v1/itermob/historico-viagem/:id:', error);
        response.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// Excluir um histórico de viagens
app.delete('/v1/itermob/historico-viagem/:id', async (request, response) => {
    let idHistorico = request.params.id;
    
    try {
        let resultado = await controllerHistoricoViagens.setExcluirHistoricoViagem(idHistorico);

        if (resultado && resultado.status_code) {
            response.status(resultado.status_code).json(resultado);
        } else {
            response.status(404).json({ message: 'Histórico de viagem não encontrado para exclusão.' });
        }
    } catch (error) {
        console.error('Erro na rota DELETE /v1/itermob/historico-viagem/:id:', error);
        response.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

function convertBigIntToString(obj) {
    if (typeof obj === 'bigint') {
        return obj.toString();
    } else if (Array.isArray(obj)) {
        return obj.map(convertBigIntToString);
    } else if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, convertBigIntToString(value)])
        );
    }
    return obj;
}

app.listen(8080, function() {
    console.log('Servidor rodando na porta 8080');
});