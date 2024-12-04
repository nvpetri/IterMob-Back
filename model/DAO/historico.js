const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Retorna todos os históricos de viagens com informações das tabelas relacionadas
const selectAllHistoricoViagens = async function() {
    try {
        const sql = `
            SELECT 
                hv.id AS id_historico_viagem,
                hv.codigo_operacao,
                hv.data_viagem,
                t.prefixo AS prefixo_onibus,
                t.linha AS linha_onibus,
                t.motorista,
                o.sentido
            FROM tbl_historico_viagens hv
            INNER JOIN tbl_operacional o ON hv.id_operacional = o.id
            INNER JOIN tabela t ON o.id_onibus = t.id
            ORDER BY hv.id DESC;
        `;
        const rsHistorico = await prisma.$queryRawUnsafe(sql);
        return rsHistorico.length > 0 ? rsHistorico : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Insere um novo histórico de viagem
const insertHistoricoViagem = async function (dadosHistorico) {
    try {
        console.log(dadosHistorico)
        // Inserir no banco de dados
        const result = await prisma.tbl_historico_viagens.create({
            data: {
                id_usuario: dadosHistorico.id_usuario,
                codigo_operacao: dadosHistorico.codigo_operacao,
                id_operacional: dadosHistorico.id_operacional,
                data_viagem: dadosHistorico.data_viagem
            }
        });
    
            // Verificar se a inserção foi bem-sucedida
            if (result && result === 1) { // `1` geralmente indica uma linha afetada
                return result
            } else {
                return false
            }
        } catch (error) {
            console.error("Erro ao executar o insertHistoricoViagem:", error);
    
            // Lidar com possíveis erros
            return false
        }
    };
    

module.exports = {
    selectAllHistoricoViagens,
    insertHistoricoViagem
};