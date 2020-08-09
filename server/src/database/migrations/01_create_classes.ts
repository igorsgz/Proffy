import Knex from 'knex'

export async function up(knex: Knex) {
    return knex.schema.createTable('classes', table => {
        table.increments('id').primary()
        table.string('subject').notNullable()
        table.decimal('cost').notNullable()

        //relacionamento com o id do professor cadastrado
        table.integer('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE') //ao alterar o usuário, todas as aulas dele são mantidas relacionadas
            .onDelete('CASCADE') //ao deletar o usuário, todas as aulas dele são deletadas automaticamente
    })
}  

export async function down(knex: Knex) {
    return knex.schema.dropTable('classes')
}