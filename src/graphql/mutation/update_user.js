import gql from 'graphql-tag'

export default gql`
    mutation updateUser(
        $id: String!,
        $phone: String!,
        $phone_country_code: String,
        $phone_number: String, 
        $email: String!, 
        $first_name: String!, 
        $last_name: String! 
    ) {
        updateUser(
            id: $id, 
            phone: $phone
            phone_country_code: $phone_country_code,
            phone_number: $phone_number, 
            email: $email, 
            first_name: $first_name, 
            last_name: $last_name
        ) {
            email
            phone
            phone_meta{
                country_code
                phone_number
                complete_phone
            }
            name{
                first_name
                last_name
        }

    }
}`