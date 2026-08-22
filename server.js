require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./config/db')
const PORT = process.env.SERVER_PORT
const authRouter = require('./routes/auth')

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

// ============ Rotas ============
app.get('/', (req, res) => {
    res.json({message: 'Rota raiz funcionando!'})
})

app.use('/auth', authRouter)

// ============ Inicialização ============
db.sync()
.then(() => {
    app.listen(PORT, () => {
        console.log('Servidor inicializado!')
    })
})
.catch((err) => {
    console.error('Erro ao inicializar servidor', err)
})