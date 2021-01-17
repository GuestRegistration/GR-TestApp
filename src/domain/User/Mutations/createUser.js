import gql from 'graphql-tag'

export default gql`
    mutation createUser(
        $id: String,
        $phone: String,
        $phone_country_code: String,
        $phone_number: String, 
        $email: String, 
        $first_name: String!, 
        $last_name: String! 
    ) {
        createUser(
            id: $id, 
            phone: $phone,
            phone_country_code: $phone_country_code,
            phone_number: $phone_number, 
            email: $email, 
            first_name: $first_name, 
            last_name: $last_name
        ) {
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
            properties{
                id
                name
                image
                address
            }
            reservations{
                id
                name
                property_id
                property_name
                property_address
                property_image
                checkin_date
                checkout_date
                role
            }
        }
}`