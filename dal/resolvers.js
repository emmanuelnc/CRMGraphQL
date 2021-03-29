const Usuario = require('../models/Usuarios')
const { gql } = require('apollo-server');
const bcryptjs = require('bcryptjs')

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

                        // if (existeUsuario) {
                        //         throw new Error('El usuario ya esta registrado');
                        // }
                        // // hacer hash a password
                        // //utilizamos la libreria cryptjs
                        // const salt = await bcryptjs.getSalt(10);
                        // input.password = await bcryptjs.hash(password, salt);


                        // //guardarlo en base de datos

                        // try {
                        //         const usuario = new Usuario(input);
                        //         usuario.save();
                        //         return usuario;
                        // } catch (error) {
                        //         console.log(error)
                        // }

                }
        }

}



module.exports = resolvers