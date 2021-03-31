const { gql } = require ('apollo-server');


//schema, type definition -- Minimo
const typeDefs = gql`

  type Token {
    token : String
  }

  type Usuario {
    id : ID
    nombre : String
    apellido : String
    email : String
    creado : String
  }

  input UsuarioInput {
    nombre : String!
    apellido : String!
    email : String!
    password : String!
    
  }

  input AutenticarInput {
    email : String!
    password : String!
  }

type Query
    {
      obtenerCurso : String
    }

 type Mutation{
      nuevoUsuario(input: UsuarioInput) : Usuario
      autenticarusuario(input: AutenticarInput) : Token
    }
`;

module.exports = typeDefs;