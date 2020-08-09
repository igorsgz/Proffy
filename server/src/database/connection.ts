import knex from 'knex'
import path from 'path'

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite') //diretório do arquivo do banco de dados usando o path do NodeJS
    },
    useNullAsDefault: true, //define como null os campos das tabelas que não possuem informações
})

export default db