import gql from 'graphql-tag'

export default gql`
    query getUserByID($id: String!){
        getUserByID(id: $id){
            id
            email
            name{
                first_name
                last_name
            }
        }
    }`