//resolvers

const { gql } = require ('apollo-server');

const cursos = [
    {
        titulo: 'JavaScript Moderno Guía Definitiva Construye +10 Proyectos',
        tecnologia: 'JavaScript ES6',
    },
    {
        titulo: 'React – La Guía Completa: Hooks Context Redux MERN +15 Apps',
        tecnologia: 'React',
    },
    {
        titulo: 'Node.js – Bootcamp Desarrollo Web inc. MVC y REST API’s',
        tecnologia: 'Node.js'
    }, 
    {
        titulo: 'ReactJS Avanzado – FullStack React GraphQL y Apollo',
        tecnologia: 'React'
    }
];

//resolver -- Minimo
//resolver -- Minimo
//parametros obtener cursos, 1 consulta anidada, 2 parametro input, 3 context compartido entre resolvers, 4 info
const resolvers = {
    Query: {
           obtenerCursos: (_,{input},ctx) => {
            console.log('input',input)   
            console.log('Context',ctx)   
            const resultado = cursos.filter( curso => curso.tecnologia === input.tecnologia)
            return resultado
           }
           
    
        }
}


module.exports = resolvers