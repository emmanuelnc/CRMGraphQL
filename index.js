const { ApolloServer, gql } = require ('apollo-server');
const typeDefs = require('./dal/schema')
const resolvers = require('./dal/resolvers')

const conectarDB = require('./config/db')

//conectar a la base de datos
conectarDB()

//servidor
const server = new ApolloServer({
    typeDefs,
    resolvers
}); 



server.listen().then( ({url}) => {
    console.log(`Servidor Listo en url ${url}`)
})