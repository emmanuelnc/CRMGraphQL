const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env'})

const conectarDB = async () => {
    try{

console.log('intentando conectar')

        await mongoose.connect(process.env.DB_LOCALMONGO,{
            useNewUrlParser:true,
            useUnifiedTopology :true,
            useFindAndModify :false,
            useCreateIndex:true
        })
        console.log('Conectado a la base de datos...')

    }catch(error){
        console.log('Hubo un error');
        console.log(error)
        process.exit(1) // detiene la aplicacion
    }
}
module.exports = conectarDB