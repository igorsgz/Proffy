import { Request, Response } from 'express'

import db from '../database/connection'
import { convertHourToMinutes } from '../utils/convertHourToMinutes'

interface ScheduleItem {
    week_day: number
    from: string
    to: string
}

export default class ClassesController {
    //método para listar as aulas
    async index(request: Request, response: Response) {
        const filters = request.query

        const subject = filters.subject as string
        const week_day = filters.week_day as string
        const time = filters.time as string

        if (!filters.week_day || !filters.subject || !filters.time) {
            return response.status(400).json({
                error: "Missing filters to search classes"
            })
        }

        const timeInMinutes = convertHourToMinutes(time)

        const classes = await db('classes')
            /* selecionando tudo da tabela class_schedule e pegando 
            todos os agendamentos que tem o id igual ao da aula listada,
            o dia da semana igual ao selecionado e o horário do agendamento
            entre os horários disponíveis*/
            .whereExists(function() {
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                    .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                    .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                    .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
            })
            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id') //pegando o usuário que relaciona com a aula
            .select(['classes.*', 'users.*']) //pegando tudo que tem nas tabelas de usuário e aula
        
        response.json(classes)
    }

    //método para cadastrar as aulas
    async create(request: Request, response: Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body
    
        /* esquema pra realizar a inserção dos dados no banco relacional ao mesmo tempo
        pra se caso em alguma dessas inserções ocorrer algum erro, todos os dados ja inseridos
        serem removidos evitando bugs */
        const trx = await db.transaction()
    
        try {
            const insertedUsersId = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio
            })
        
            //pegando o id do usuário para inserir na tabela classes
            const user_id = insertedUsersId[0]
        
            const insertedClassesIds = await trx('classes').insert({
                subject,
                cost,
                user_id
            })
        
            //pegando o id da aula para inserir na tabela de horarios
            const class_id = insertedClassesIds[0]
        
            //pegando cada item do objeto que está dentro do array e fazendo a conversão
            const classSchedule = schedule.map((ScheduleItem: ScheduleItem) => {
                return {
                    class_id,
                    week_day: ScheduleItem.week_day,
                    from: convertHourToMinutes(ScheduleItem.from),
                    to: convertHourToMinutes(ScheduleItem.to)
                }
            })
        
            await trx('class_schedule').insert(classSchedule)
        
            await trx.commit() //inserindo tudo no banco em uma só vez
            
            return response.status(201).send()
        } catch (err) {
            await trx.rollback() //desfaz qualquer alteração feita nesse meio tempo
    
            console.log(err)
            return response.status(400).json({
                error: 'Unexpected error while creating new class'
            })
        }
    }
}