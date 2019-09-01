const { ApolloServer } = require('apollo-server');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');
const { findOrCreateUser } = require('./controllers/UserController')
require('dotenv').config(); 

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true
    })
    .then(() => console.log('DB connected'))
    .catch(err => console.error(err))

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req}) => {
        let authToken = null;
        let currentUser = null;
        try {
            authToken = req && req.headers.authorization
            if (authToken) {
                // find or create user
                currentUser = await findOrCreateUser(authToken);
            }
        } catch (err) {
            console.log(`Unable to auth user ${authToken} with the error ${err}`)
        }
        return { currentUser };
    }
})

server.listen({ port: process.env.PORT || 4000 }).then(({url}) => {
    console.log(`Server listening on ${url}`);
}
)

