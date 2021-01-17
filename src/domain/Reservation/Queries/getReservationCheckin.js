import gql from 'graphql-tag';

export default gql`
    query getReservationCheckin($id: String!){
        getReservationCheckin(id: $id){
            reservation{
                id
                user_id
                name
                checkedin_at
                already_checkedin
                approved
                approved_at
                booking_channel
                checkin_date
                checkout_date
                instruction
                property{
                    id
                    name
                    address
                    image
                }
                guests{
                    name
                    gender
                    type
                }
            }
            
            user{
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
            identity{
                id
                user_id
                country
                document_type
                document_url
                title
                verified
                verified_at
                ref
            }
        }
    }`;