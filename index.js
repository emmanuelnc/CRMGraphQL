const { ApolloServer, gql } = require('apollo-server');
const typeDefs = require('./dal/schema')
const resolvers = require('./dal/resolvers')

require('dotenv').config({ path: 'variables.env' });
const jwt = require('jsonwebtoken');


const conectarDB = require('./config/db')


const bcryptjs = require('bcryptjs');


/* Original */
// const salt = await bcryptjs.genSalt(10);
// const haspass = await bcryptjs.hash(password,salt);


/*1 Callback help 1 version*/
//    bcryptjs.genSalt(10,(err,salt) =>  bcryptjs.hash("456*",salt, (err,hash )=> console.log(hash) )  );

/*  //Promise 2 version, 3 states Pending, Fulfilled, reject */
// bcryptjs.genSalt(10)
// .then((salt) => {
//     bcryptjs.hash("456*",salt)
//     .then((value) => {
//         console.log("HashPass", value);
//     })
// })

//conectar a la base de datos
conectarDB()

//servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        //console.log(req.headers['authorization'])

       // console.log(req.headers);

        const token = req.headers['authorization'] || '';

        if (token) {
            try {
                const usuario =  jwt.verify(token, process.env.SECRET);
                //console.log("usuario:",  usuario);

                return {
                    usuario
                }

            } catch (err) {
                var today = new Date();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                console.log("Hubo un error al verificar token " + time);
                //console.lo(err);
               // console.log(req.url.toString())
            }
        }




    }
});



server.listen().then(({ url }) => {
    console.log(`Servidor Listo en url ${url}`)
})