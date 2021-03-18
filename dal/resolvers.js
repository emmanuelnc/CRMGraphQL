const Usuario = require('../models/Usuarios')

const { gql } = require ('apollo-server');

const resolvers = {
    
        Query: {
            obtenerCurso: ()=> "somethins"
           },

        Mutation: {
                nuevoUsuario: (_, { input } ) => {
                console.log(input)
                return "creado..."
                }
}
    
        }



module.exports = resolvers