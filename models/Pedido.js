const mongoose = require('mongoose');

const PedidoSchema = mongoose.Schema({
   
pedido :{
    type: Array,
    required : true
},
total:{
    type : Number,
    required: true
},
cliente : {
    type: mongoose.Schema.Types.ObjectId,
    requird:true,
    ref:'Cliente'
},
vendedor : {
    type: mongoose.Schema.Types.ObjectId,
    requird:true,
    ref:'Usuario'
},
estado : {
    type: String,
    default:"Pendiente"
},
creado : {
    type:Date,
    default: Date.now(),
    required: true,
    trim: true
}

});

module.exports  = mongoose.model('Pedido',PedidoSchema);
