const Usuario = require('../models/Usuarios');
const { gql } = require('apollo-server');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: 'variables.env'});




const crearToken = (usuario, secret, expiresIn)=>{
//        console.log(usuario);
        const {id, email, nombre, apellido } = usuario
        const token =  jwt.sign({ id, email, nombre, apellido }, secret, {expiresIn}) ;
        

        return token;
}

const resolvers = {

        Query: {
                obtenerCurso: () => "something"
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
                        input.password = await bcryptjs.hash(password,salt);
                        


                        try {
                                 //guardarlo en base de datos
                                const usuario = new Usuario(input);
                                usuario.save();
                                return usuario;
                        } catch (error) {
                                console.log(error)
                        }

                },
                autenticarusuario: async (_, {input})=> {
                const {email, password} = input;

                        //validamos si existe el usuarios
                        const existeUsuario = await Usuario.findOne({email});
                        
                        if (!existeUsuario) {
                                throw new Error('El usuario no existe');
                        }
                        //revisar si el suario es correcto
                        const passwordCorrecto = await bcryptjs.compare(password,existeUsuario.password);
                        
                        if (!passwordCorrecto)                        {
                                throw new Error('El password es incorrecto');

                        }
                        return {
                                token: crearToken(existeUsuario,process.env.SECRET,'24h')
                        }

                        //crear tocken
                }





        }

}



module.exports = resolvers