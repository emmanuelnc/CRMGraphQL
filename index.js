const { ApolloServer, gql } = require ('apollo-server');
const typeDefs = require('./dal/schema')
const resolvers = require('./dal/resolvers')




//servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ()=> {
        const usuarioId = 3974;
        return {
            usuarioId
        }
    }
}); // requiere squema y resolver



server.listen().then( ({url}) => {
    console.log(`Servidor Listo en url ${url}`)
})