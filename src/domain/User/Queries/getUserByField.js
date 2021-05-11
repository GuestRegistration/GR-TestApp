import gql from 'graphql-tag';

export default gql`
    query getUserByField($field: String!, $value: String!){
        getUserByID(field: $field, value: $value){
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
            verification{
                document
                selfie
            }
            properties{
                id
                name
                image
                address
                active
                subscription_status
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
    }`;