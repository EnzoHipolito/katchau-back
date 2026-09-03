const db = require('./config/db')
const { sincronizarBanco } = require('./services/database.service')

async function syncDatabase(){
    try{
        await sincronizarBanco()
        return console.log('Banco de dados sincronizado!')
    }
    catch(err){
        console.error('Falha ao sincronizar banco de dados!', err)
        process.exitCode = 1
    }
    finally{
        await db.close()
        console.log('Fechando conexão com banco de dados!')
    }
}

syncDatabase()
