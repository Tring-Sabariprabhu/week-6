// import express from 'express';  
// const app = express()
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';  


import { typeDefs } from './schema.js';
import data from '../data.js';


const resolvers = {
    Query:{
        Users: () =>{
            return data.usersData
        },
        User: (_, { id } ) =>{
            return data.usersData.find(user => user.id === id) || null;  
        }
    },
    Mutation:{
        insertUser: (_, {name, location} ) => {
            const user_id =  ++(data.idCount);
            const Newuser = {
                id: user_id,
                name: name,
                location: location
            }
            data.usersData.push(Newuser);
            return Newuser;
        },
        deleteUser: (_, {id}) => {
            const index = data.usersData.findIndex(user => user.id === id);
            if (index === -1) return "User not found";
            data.usersData.splice(index, 1);
            return `User with id ${id} deleted successfully.`;
        },
        updateUser: (_, {id, name, location}) =>{
            const user = data.usersData.find(user => user.id === id);
            if(user){
                user.name = name;
                user.location = location;
                return `User with id ${id} updated Successfully`;
            }
            else{
                return "User not found";
            }
                
            
        }
    }
}


    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    await startStandaloneServer(server, {
        listen: { port: 4000 }
    });


