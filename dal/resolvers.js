const Usuario = require('../models/Usuarios');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');
const Pedido = require('../models/Pedido');

const { gql } = require('apollo-server');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findOneAndUpdate } = require('../models/Usuarios');

require('dotenv').config({ path: 'variables.env' });




const crearToken = (usuario, secret, expiresIn) => {
        //        console.log(usuario);
        const { id, email, nombre, apellido } = usuario
        const token = jwt.sign({ id, email, nombre, apellido }, secret, { expiresIn });


        return token;
}

const resolvers = {

        Query: {
                obtenerCurso: () => "something",
                ObtenerUsuario: async (_, { token }) => {
                        const usuarioId = await jwt.verify(token, process.env.SECRET);
                        return usuarioId;
                },
                obtenerProductos: async () => {
                        try {
                                const productos = await Producto.find({});
                                return productos;

                        } catch (error) {
                                console.log(error)
                        }

                },
                obtenerProducto: async (_, { id }) => {
                        //resivar si el producto existe
                        const foundProduct = await Producto.findById(id);
                        if (!foundProduct) {
                                throw new Error('Producto no encontrado');
                        }
                        return foundProduct

                },
                obtenerClientes: async () => {
                        try {
                                const clientes = await Cliente.find({});
                                return clientes;
                        } catch (error) {
                                console.log(error);
                        }
                },
                obtenerClientesVendedor: async (_, { }, ctx) => {
                        try {
                                const clientes = await Cliente.find({ vendedor: ctx.usuario.id.toString() });
                                return clientes;
                        } catch (error) {
                                console.log(error);
                        }

                },
                obtenerCliente: async (_, { id }, ctx) => {
                        //revisar si el cliente existe o no
                        const cliente = await Cliente.findById(id);

                        if (!cliente) {
                                throw new Error('Cliente no encontrado');
                        }

                        //quien lo creo puede verlo
                        if (cliente.vendedor.toString() !== ctx.usuario.id) {
                                throw new Error('No esta autorizado para ver este cleinte');
                        }
                        return cliente;


                },
                obtenerPedidos: async(_,{}) =>{
                        try {
                                const pedidos = await Pedido.find({});
                                return pedidos;
                                
                        } catch (error) {
                                console.log(error);
                                
                        }

                },
                obtenerPedidosvendedor: async (_,{}, ctx) => {
                        const pedidos = await Pedido.find({vendedor: ctx.usuario.id});
                        return pedidos;
                },
                obtenerPedido: async (_,{id}, ctx) => {
                        
                        //validamos si el pedido existe
                        const foundpedido = await Pedido.findById(id);
                        if(!foundpedido){
                                throw new Error('El pedido no existe');
                                }
                        
                
                                console.log("Vendedor: " ,foundpedido.vendedor);
                                console.log("Usuario: " ,ctx.usuario.id);
                
                        if (foundpedido.vendedor.toString() !== ctx.usuario.id){
                                                                throw new Error('No esta autorizado para ver este pedido');
                        }
                        
                                return foundpedido;
                        
                
                },
                obtenerPedidosEstado: async(_,{estado},ctx) => {
                        const pedidos = await Pedido.find({ vendedor : ctx.usuario.id, estado});
                        return pedidos;

                },
                mejoresClientes: async () => {
                        
                        const clientes = await Pedido.aggregate([
                                { $match : {estado : "COMPLETADO"}},
                                { $group : {
                                        _id : "$cliente",
                                        total: { $sum : '$total'}
                                }},
                                {
                                        $lookup : {
                                                from : 'clientes',
                                                localField: '_id',
                                                foreignField: '_id',
                                                as: 'cliente'
                                        }
                                },
                                {
                                        $sort : {
                                         total: -1       
                                        }
                                }

                        ]);
                        return clientes;
                },
                mejoresVendedores: async ()=>{
                        const vendedores = await Pedido.aggregate([
                                {$match : {estado:"COMPLETADO"}},
                                {$group : {
                                        _id : "$vendedor",
                                        total: {$sum : '$total'}
                                        }
                                },
                                {
                                        $lookup:{
                                                from : 'usuarios',
                                                localField : '_id',
                                                foreignField: '_id',
                                                as: 'vendedor'
                                        }
                                },
                                {
                                        $limit:3
                                },
                                {
                                        $sort : {total: -1 }
                                }
                                 ])
                                 return vendedores;

                },
                buscarProducto : async (_,{texto}) => {
                        const productos = await Producto.find({$text : {$search:texto} }).limit(5) ;
                        return productos;
                }

        },
        Mutation: {
                nuevoUsuario: async (_, { input }) => {
                        const { email, password } = input

                        //Revisar si el usuario ya esta registrado
                        const existeUsuario = await Usuario.findOne({ email });
                        console.log(existeUsuario);

                        if (existeUsuario) {
                                throw new Error('El usuario ya esta registrado');
                        }

                        // hacer hash a password
                        //utilizamos la libreria cryptjs
                        const salt = await bcryptjs.genSalt(10);
                        input.password = await bcryptjs.hash(password, salt);



                        try {
                                //guardarlo en base de datos
                                const usuario = new Usuario(input);
                                usuario.save();
                                return usuario;
                        } catch (error) {
                                console.log(error)
                        }

                },
                autenticarusuario: async (_, { input }) => {
                        const { email, password } = input;

                        //validamos si existe el usuarios
                        const foundUser = await Usuario.findOne({ email });

                        if (!foundUser) {
                                throw new Error('El usuario no existe');
                        }
                        //revisar si el suario es correcto
                        const passwordCorrecto = await bcryptjs.compare(password, foundUser.password);

                        if (!passwordCorrecto) {
                                throw new Error('El password es incorrecto');

                        }
                        return {
                                token: crearToken(foundUser, process.env.SECRET, '24h')
                        }

                        //crear tocken
                },
                nuevoProducto: async (_, { input }) => {
                        try {
                                const nuevoProducto = new Producto(input);

                                //almacenar
                                const resultado = await nuevoProducto.save();
                                return resultado;


                        } catch (error) {
                                console.log(error)
                        }
                },
                actualizarProducto: async (_, { id, input }) => {
                        let foundProduct = await Producto.findById(id);

                        if (!foundProduct) {
                                throw new Error('Producto no encontrado');
                        }

                        //guardarlo en base de datos
                        foundProduct = await Producto.findOneAndUpdate({ _id: id }, input, { new: true });
                        return foundProduct

                },
                eliminaProducto: async (_, { id }) => {
                        const foundProduct = await Producto.findById(id);

                        if (!foundProduct) {
                                throw new Error('Producto no encontrado');
                        }

                        await Producto.findOneAndDelete({ _id: id });
                        return "Producto eliminado";

                },
                nuevoCliente: async (_, { input }, ctx) => {





                        const { email } = input;

                        const cliente = await Cliente.findOne({ email });
                        if (cliente) {
                                throw new Error('Ese cliente ya esta registrado');
                        }



                        //verificar si esta registrado
                        const nuevoCliente = new Cliente(input);
                        nuevoCliente.vendedor = ctx.usuario.id; //"60650a2c78cc0630b4881cf9";

                        try {

                                const result = await nuevoCliente.save();

                                return result;

                        } catch (error) {
                                console.log(error);
                        }


                        //asignar vendedor

                        // guardar
                },
                actualizarCliente: async (_, { id, input }, ctx) => {

                        // ver si existe
                        let cliente = await Cliente.findById(id);
                        if (!cliente) {
                                throw new Error('Ese cliente no existe');
                        }

                        //validar vendedor autorizado
                        //quien lo creo puede verlo
                        if (cliente.vendedor.toString() !== ctx.usuario.id) {
                                throw new Error('No esta autorizado para editar este cleinte');
                        }

                        cliente = Cliente.findOneAndUpdate({ _id: id }, input, { new: true });
                        return cliente;

                },
                eliminaCliente: async (_, { id }, ctx) => {
                        let cliente = await Cliente.findById(id);
                        if (!cliente) {
                                throw new Error('Ese cliente no existe');
                        }

                        //validar vendedor autorizado
                        //quien lo creo puede verlo
                        if (cliente.vendedor.toString() !== ctx.usuario.id) {
                                throw new Error('No esta autorizado para editar este cleinte');
                        }
                        //climinar

                        await Cliente.findOneAndDelete({ _id: id });
                        return "Cliente eliminado";
                },

                nuevoPedido: async (_, { input }, ctx) => {
                        //verificar si existe cliente
                        const { cliente } = input



                        let foundCliente = await Cliente.findById(cliente);
                        if (!foundCliente) {
                                throw new Error('Ese cliente no existe');
                        }

                        //verificar si el cliente es del vendedor


                        if (foundCliente.vendedor.toString() !== ctx.usuario.id) {
                                throw new Error('No esta autorizado para editar este cleinte');
                        }

                        //revisar stock
                        //el foreach no es asyncrono, al ponerle async la aplicacion continuara de todas maneras
                        //por eso es mejor usar este otro for

                        for await (const articulo of input.pedido) {
                                const { id } = articulo;
                                const producto = await Producto.findById(id);
                                if (producto) {
                                        if (articulo.cantidad > producto.existencia) {
                                                throw new Error(` El articulo: ${producto.nombre} excede la cantidad disponible`);
                                        }
                                        else
                                        {
                                                producto.existencia  = producto.existencia - articulo.cantidad;
                                                producto.save();
                                                //posible bub si alguno de los articulos no existen
                                        }
                                }
                        }


                        const nuevoPedido = new Pedido(input);

                        //asirnar vendedor a pedido
                        nuevoPedido.vendedor = ctx.usuario.id;


                        //guardar pedido
                        const resultado = await nuevoPedido.save();
                        return resultado;

                },
                actualizarPedido: async(_,{id, input},ctx) =>{
                        //verificar si existe pedido
                        const existepedido = await Pedido.findById(id);
                        
                        if (!existepedido){
                                throw new Error(`El Pedido no existe`);
                        }


                        //verificar si existe cliente
                        const existecliente = await Cliente.findById(input.cliente);
                        
                        if (!existecliente){
                                throw new Error(`El Cliente no existe`);
                        }

                        //verificar si pertenece a vendedor
                        if (existecliente.vendedor.toString() !== ctx.usuario.id) {
                                throw new Error('No esta autorizado para editar este cleinte');
                        }

                        //revisar stock para validar nuevas cantidades
                        for await (const articulo of input.pedido) {
                                const { id } = articulo;
                                const producto = await Producto.findById(id);
                                if (producto) {
                                        if (articulo.cantidad > producto.existencia) {
                                                throw new Error(` El articulo: ${producto.nombre} excede la cantidad disponible`);
                                        }
                                        else
                                        {
                                                producto.existencia  = producto.existencia - articulo.cantidad;
                                                producto.save();
                                                //posible bub si alguno de los articulos no existen y ademas ya se desconto la existencia de lo que estoy regresando
                                        }
                                }
                        }

                        //guardar
                        const resultado = await Pedido.findOneAndUpdate({_id : id}, input,{new:true});
                        return resultado;
                },
                eliminarPedido: async(_,{id},ctx) => {
                          //verificar si existe pedido
                          const existepedido = await Pedido.findById(id);
                        
                          if (!existepedido){
                                  throw new Error(`El Pedido no existe`);
                          }
                          if(existepedido.vendedor.toString() !== ctx.usuario.id){
                                throw new Error(`No tienes autorizacion para eliminar este pedido`);
                          }
                        await Pedido.findOneAndDelete({ _id: id });
                        return "Pedido eliminado";
                }






        }

}



module.exports = resolvers