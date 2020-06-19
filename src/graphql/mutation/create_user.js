import gql from 'graphql-tag'

export default gql`
    mutation createUser(
        $id: String,
        $phone_country_code: String!,
        $phone_number: String!, 
        $email: String!, 
        $first_name: String!, 
        $last_name: String! 
    ) {
        createUser(
            id: $id, 
            phone_country_code: $phone_country_code,
            phone_number: $phone_number, 
            email: $email, 
            first_name: $first_name, 
            last_name: $last_name
        ) {
            email
            phone{
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