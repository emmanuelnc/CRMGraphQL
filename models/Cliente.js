const mongoose = require('mongoose');

const ClientesSchema = mongoose.Schema({
        nombre : {
            type:String,
            required: true,
            trim: true
        },
        apellido : {
            type:String,
            required: true,
            trim: true
        },
        email : {
            type:String,
            required: true,
            trim: true,
            unique: true
        },
        creado : {
            type:Date,
            default: Date.now(),
            required: true,
            trim: true
        },
        empresa : {
            type:String,
            trim: true,
        },
        telefono : {
            type : String,
            trim: true
        },
        vendedor : {
            type : mongoose.Schema.Types.ObjectId,
            required: true,
            ref : 'Usuario'
        }
});



module.exports =  mongoose.model("Cliente", ClientesSchema)