import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';  


import { typeDefs } from './Schema/typedefs.js';
import { resolvers} from './Schema/resolvers.js'



const server = new ApolloServer({
    typeDefs,
    resolvers
});

await startStandaloneServer(server, {
    listen: { port: 4000 }
});
console.log(`https://localhost:4000/`)

