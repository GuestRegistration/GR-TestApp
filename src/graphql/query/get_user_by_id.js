import gql from 'graphql-tag'

export default gql`
    query getUserByID($id: String!){
        getUserByID(id: $id){
            id
            email,
            phone,
            name{
                first_name
                last_name
            }
            phone_meta{
                country_code
                phone_number
            }
        }
    }`