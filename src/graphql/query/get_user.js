import gql from 'graphql-tag'

export default gql`
    query getUser($id: String!){
        getUser(id: $id){
            id
            name{
                first_name
                last_name
            }
        }
    }`