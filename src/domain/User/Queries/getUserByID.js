import gql from 'graphql-tag';

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
            properties{
                id
                name
                image
                city
                country
            }
            reservations{
                id
                name
                property_id
                property_name
                property_city
                property_country
                property_image
                checkin_date
                checkout_date
                role
            }
        }
    }`;