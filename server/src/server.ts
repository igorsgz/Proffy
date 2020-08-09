import express from 'express'
import routes from './routes'
import cors from 'cors'

const app = express()

app.use(cors()) // permite que aplicações com endereços diferentes da API tenham acesso
app.use(express.json()) // faz a conversão para json pq o express por padrão não entende json
app.use(routes)

app.listen(3333, () => {
    console.log('api rodando')
})