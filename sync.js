const db = require('./config/db')

async function syncDatabase(){
    try{
        await db.sync()
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
