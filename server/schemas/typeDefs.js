const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Query {
        _id: ID
    }
`

module.exports = typeDefs;