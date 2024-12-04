const message = require('../modulo/config.js');
const autenticacao = require('../model/DAO/autenticacao.js')
const usuarioDAO = require('../model/DAO/usuarios.js');


const getListarUsuarios = async function() {
    try {
        let listarUsuarios = await usuarioDAO.selectAllUsers();
        let usuariosJSON = {};

        if (listarUsuarios && listarUsuarios.length > 0) {
            let usuariosComEnderecos = await Promise.all(
                listarUsuarios.map(async(usuario) => {
                    let usuarioEndereco = await usuarioDAO.selectByIdUser(usuario.id);

                    return {
                        id: usuario.id,
                        cpf: usuario.cpf,
                        nome: usuario.nome,
                        sobrenome: usuario.sobrenome,
                        email: usuario.email,
                        telefone: usuario.telefone,
                        foto_perfil: usuario.foto_perfil,
                        endereco: usuarioEndereco && usuarioEndereco.id_endereco ? {
                            id: usuarioEndereco.id_endereco,
                            cep: usuarioEndereco.cep,
                            rua: usuarioEndereco.rua,
                            numero: usuarioEndereco.numero,
                            cidade: usuarioEndereco.cidade,
                            bairro: usuarioEndereco.bairro,
                            estado: usuarioEndereco.estado
                        } : null
                    };
                })
            );

            usuariosJSON.usuarios = usuariosComEnderecos;
            usuariosJSON.status_code = 200;
            return usuariosJSON;
        } else {
            return message.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER_DB;
    }
};


const getBuscarUsuario = async function(id) {
    try {
        if (!id || isNaN(id)) {
            return message.ERROR_INVALID_ID;
        }

        let dadosUsuario = await usuarioDAO.selectByIdUser(id);

        if (dadosUsuario) {
            let usuarioJSON = {
                usuario: {
                    id: dadosUsuario.id,
                    cpf: dadosUsuario.cpf,
                    nome: dadosUsuario.nome,
                    sobrenome: dadosUsuario.sobrenome,
                    email: dadosUsuario.email,
                    telefone: dadosUsuario.telefone,
                    foto_perfil: dadosUsuario.foto_perfil,
                    endereco: dadosUsuario.id_endereco ? {
                        id: dadosUsuario.id_endereco,
                        cep: dadosUsuario.cep,
                        rua: dadosUsuario.rua,
                        numero: dadosUsuario.numero,
                        cidade: dadosUsuario.cidade,
                        bairro: dadosUsuario.bairro,
                        estado: dadosUsuario.estado
                    } : null
                },
                status_code: 200
            };
            return usuarioJSON;
        } else {
            return message.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER_DB;
    }
};


const setExcluirUsuario = async function(id) {
    try {
        if (!id || isNaN(id)) {
            return message.ERROR_INVALID_ID;
        }

        let usuarioExistente = await usuarioDAO.selectByIdUser(id);
        console.log(usuarioExistente)

        if (usuarioExistente) {
            let resultadoExclusao = await usuarioDAO.deleteUser(id);

            if (resultadoExclusao) {
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

const setInserirNovoUsuario = async function(dadosUsuario, contentType) {
    try {
      // Verifica se o content-type é JSON
      if (String(contentType).toLowerCase() !== 'application/json') {
        return message.ERROR_CONTENT_TYPE;
      }
  
      // Verifica os campos obrigatórios
      if (!dadosUsuario.cpf || dadosUsuario.cpf.length > 11 ||
          !dadosUsuario.nome || dadosUsuario.nome.length > 200 ||
          !dadosUsuario.sobrenome || dadosUsuario.sobrenome.length > 200 ||
          !dadosUsuario.email || dadosUsuario.email.length > 100 ||
          !dadosUsuario.telefone || dadosUsuario.telefone.length > 20
      ) {
        return message.ERROR_REQUIRED_FIELDS;
      }
  
      // Verifica se a senha foi fornecida
      if (!dadosUsuario.senha || dadosUsuario.senha.length < 6) {
        return message.ERROR_REQUIRED_PASSWORD;  // Retorna erro se a senha não for fornecida ou for inválida
      }
  
      // Armazenar a senha e fazer o hash antes de salvar no banco
      const senhaHash = await bcrypt.hash(dadosUsuario.senha, 10);
      dadosUsuario.senha = senhaHash;  // Substitui a senha original pelo hash
  
      // Criar o novo usuário com a senha já criptografada
      let novoUsuario = await usuarioDAO.insertUser(dadosUsuario, dadosUsuario.endereco);
  
      // Verifique se o campo "success" no retorno é verdadeiro
      if (novoUsuario.success) {
        // Apenas retorna o ID do novo usuário com a mensagem de sucesso
        return {
          status: message.SUCCESS_CREATED_ITEM.status,
          status_code: message.SUCCESS_CREATED_ITEM.status_code,
          message: message.SUCCESS_CREATED_ITEM.message,
          usuarioId: novoUsuario.usuario.id // Retorna apenas o ID do usuário criado
        };
      } else {
        return message.ERROR_INTERNAL_SERVER_DB; // Erro no processo de criação do usuário
      }
  
    } catch (error) {
      console.error(error);
      return message.ERROR_INTERNAL_SERVER_DB; // Erro geral ao tentar inserir o usuário
    }
  };
  


const setAtualizarUsuario = async function(id, novosDadosUsuario, novosDadosEndereco) {
    try {
        if (!id || isNaN(id) ||
            !novosDadosUsuario.cpf || novosDadosUsuario.cpf.length > 11 ||
            !novosDadosUsuario.nome || novosDadosUsuario.nome.length > 200 ||
            !novosDadosUsuario.sobrenome || novosDadosUsuario.sobrenome.length > 200 ||
            !novosDadosUsuario.email || novosDadosUsuario.email.length > 100 ||
            !novosDadosUsuario.telefone || novosDadosUsuario.telefone.length > 20
        ) {
            return message.ERROR_INVALID_INPUT;
        }

        let usuarioExistente = await usuarioDAO.selectByIdUser(id);

        if (usuarioExistente) {

            let resultadoAtualizacao = await usuarioDAO.updateUser(id, novosDadosUsuario);


            if (novosDadosEndereco) {
                if (usuarioExistente.endereco) {

                    await usuarioDAO.updateEndereco(usuarioExistente.endereco.id, novosDadosEndereco);
                } else {

                    await usuarioDAO.insertUserAddress(id, novosDadosEndereco);
                }
            }

            if (resultadoAtualizacao) {

                let usuarioAtualizado = await usuarioDAO.selectByIdUser(id);

                return {
                    status: message.SUCCESS_UPDATED_ITEM.status,
                    status_code: message.SUCCESS_UPDATED_ITEM.status_code,
                    message: message.SUCCESS_UPDATED_ITEM.message,
                    usuario: {
                        id: usuarioAtualizado.id,
                        cpf: usuarioAtualizado.cpf,
                        nome: usuarioAtualizado.nome,
                        sobrenome: usuarioAtualizado.sobrenome,
                        email: usuarioAtualizado.email,
                        telefone: usuarioAtualizado.telefone,
                        foto_perfil: usuarioAtualizado.foto_perfil,
                        endereco: usuarioAtualizado.id_endereco ? {
                            id: usuarioAtualizado.id_endereco,
                            cep: usuarioAtualizado.cep,
                            rua: usuarioAtualizado.rua,
                            numero: usuarioAtualizado.numero,
                            cidade: usuarioAtualizado.cidade,
                            bairro: usuarioAtualizado.bairro,
                            estado: usuarioAtualizado.estado
                        } : null
                    }
                };
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

const setAtualizarSenhaUsuario = async function(usuarioId, senha) {
    try {
        // Verificar se a senha está presente e válida
        if (!senha || senha.length < 6) {
            return message.ERROR_REQUIRED_FIELDS;
        }

        // Fazer o hash da senha antes de salvar
        const senhaHash = await bcrypt.hash(senha, 10);

        // Atualizar o usuário com a nova senha
        let usuarioAtualizado = await autenticacao.updateSenha(usuarioId, senhaHash);

        if (usuarioAtualizado) {
            return {
                status: message.SUCCESS_UPDATED_ITEM.status,
                status_code: message.SUCCESS_UPDATED_ITEM.status_code,
                message: message.SUCCESS_UPDATED_ITEM.message,
            };
        } else {
            return message.ERROR_INTERNAL_SERVER_DB;
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_DB;
    }
};


module.exports = {
    getListarUsuarios,
    getBuscarUsuario,
    setExcluirUsuario,
    setInserirNovoUsuario,
    setAtualizarUsuario,
    setAtualizarSenhaUsuario
};