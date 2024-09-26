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

////////////////////////////////////////////////////////////////////// End Point Usuarios ///////////////////////////////////////////////////////////////////////////////////////////


app.get('/v1/itermob/usuarios', async function(request, response) {
    let dadosUsuario = await controllerUsuario.getListarUsuarios();

    if (dadosUsuario) {
        response.status(200).json(dadosUsuario);
    } else {
        response.status(404).json({ message: 'Nenhum registro encontrado' });
    }
});


app.get('/v1/itermob/usuario/:id', async function(request, response) {
    let idUsuario = request.params.id;
    let dadosUsuario = await controllerUsuario.getBuscarUsuario(idUsuario);
    response.status(dadosUsuario.status_code).json(dadosUsuario);
});


app.get('/v1/itermob/usuario/:id/endereco', async function(request, response) {
    let idUsuario = request.params.id;
    let dadosUsuarioEndereco = await controllerUsuario.getBuscarUsuarioComEndereco(idUsuario);
    response.status(dadosUsuarioEndereco.status_code).json(dadosUsuarioEndereco);
});

app.post('/v1/itermob/inserirUsuario', async function(request, response) {
    let dadosBody = request.body;
    let contentType = request.is();
    let resultDados = await controllerUsuario.setInserirNovoUsuario(dadosBody, contentType);
    response.status(resultDados.status_code).json(resultDados);
});



app.delete('/v1/itermob/usuario/:id', async function(request, response) {
    let idUsuario = request.params.id;
    let resultDados = await controllerUsuario.setExcluirUsuario(idUsuario);
    response.status(resultDados.status_code).json(resultDados);
});


app.put('/v1/itermob/usuario/:id', async function(request, response) {
    let idUsuario = request.params.id;
    let novosDadosUsuario = request.body;
    let resultDados = await controllerUsuario.setAtualizarUsuario(idUsuario, novosDadosUsuario);
    response.status(resultDados.status_code).json(resultDados);
});

////////////////////////////////////////////////////////////////////// End Point Endereços ///////////////////////////////////////////////////////////////////////////////////////////


app.get('/v1/itermob/enderecos', async function(request, response) {
    let dadosEndereco = await controllerEndereco.getListarEnderecos();

    if (dadosEndereco) {
        response.status(200).json(dadosEndereco);
    } else {
        response.status(404).json({ message: 'Nenhum registro encontrado' });
    }
});


app.get('/v1/itermob/endereco/:id', async function(request, response) {
    let idEndereco = request.params.id;
    let dadosEndereco = await controllerEndereco.getBuscarEndereco(idEndereco);
    response.status(dadosEndereco.status_code).json(dadosEndereco);
});


app.post('/v1/itermob/inserirEndereco', async function(request, response) {
    let dadosBody = request.body;
    let resultDados = await controllerEndereco.setInserirNovoEndereco(dadosBody);
    response.status(resultDados.status_code).json(resultDados);
});


app.delete('/v1/itermob/endereco/:id', async function(request, response) {
    let idEndereco = request.params.id;
    let resultDados = await controllerEndereco.setExcluirEndereco(idEndereco);
    response.status(resultDados.status_code).json(resultDados);
});


app.put('/v1/itermob/endereco/:id', async function(request, response) {
    let idEndereco = request.params.id;
    let novosDadosEndereco = request.body;
    let resultDados = await controllerEndereco.setAtualizarEndereco(idEndereco, novosDadosEndereco);
    response.status(resultDados.status_code).json(resultDados);
});

////////////////////////////////////////////////////////////////////// End Point Autenticação ///////////////////////////////////////////////////////////////////////////////////////////

app.post('/v1/itermob/inserirAutenticacao', async function(request, response) {
    let { idUsuario, senha } = request.body;
    let resultDados = await controllerAutenticacao.setInserirAutenticacao(idUsuario, senha);
    response.status(resultDados.status_code).json(resultDados);
});


app.listen(8080, function() {
    console.log('Servidor rodando na porta 8080');
});