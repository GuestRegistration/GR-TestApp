import gql from 'graphql-tag'

export default gql`
    query getProperty($id: String!){
        getProperty(id: $id){
            id
            name
            rules
            terms
            email
            phone_meta {
                complete_phone
            }
            address {
                street
                city
                country
            }
        }
    }`