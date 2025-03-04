export const typeDefs = `#graphql
type user{
    id: Int,
    name: String,
    location: String
}
type Query{
    Users: [user!]
    User(id: Int!) : user
}
type Mutation{
    insertUser( name: String!, location: String!): user
    deleteUser(id: Int!) : String
    updateUser(id: Int!, name: String!, location: String!): String
}

`