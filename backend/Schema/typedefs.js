export const typeDefs = `
type user{
    email: String
    name: String
    password: String
    personacount: Int
    personas: [persona!]!
}
type persona{
    id: Int
    name: String
    image : String
    quote: String
    description: String
    attitudes: String
    painpoints: String
    jobs: String
    activities: String
}
type Query{
    getAllUsers: [user!]
    getUser(email: String!): user
    userIsPresent (email: String!): Boolean
    personaValid (email: String!, id: Int!): Boolean
    getPersonaCount (email: String!): Int
}
type Mutation{
    
    createUser(email: String!, name: String!, password: String!): Boolean
    deleteUser(email: String!): String
    updateUser(email: String!, name: String!, password: String!): String
    setPersonaCount(email: String!) : Boolean

    insertPersona(email: String!, name: String, quote: String, image: String, description: String, attitudes: String, painpoints: String, jobs: String, activities: String): String
    updatePersona(id: Int!, email: String!, name: String, image: String, quote: String, description: String, attitudes: String, painpoints: String, jobs: String, activities: String): String
    deletePersona(id: Int, email: String!): String
}`

