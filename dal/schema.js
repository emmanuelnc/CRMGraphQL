const { gql } = require ('apollo-server');


//schema, type definition -- Minimo
const typeDefs = gql`

    type Curso {
        titulo: String
    }


    input CursoInput{
        tecnologia: String
    }
  

    type Query {
        obtenerCursos(input : CursoInput!) : [Curso]
    
    
    }
`;

// input parametro ! obligatorio
/*
query con input
        {
        obtenerCursos( input:{tecnologia: "Node.js"}) {
            titulo
        }
        }


query con  variables, se distingue por el $


query obtenerCursos($input: CursoInput!){
  obtenerCursos( input:$input) {
    titulo
  }
}

y la variable se pasa por panel query variables
{
  "input": {
    "tecnologia": "React"
  }
}


*/



module.exports = typeDefs;