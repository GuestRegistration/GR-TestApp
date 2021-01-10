import gql from 'graphql-tag';

export default gql`
    query getReservation($id: String!){
        getReservation(id: $id){
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
                city
                country
                image
            }
            guests{
                name
                gender
                type
            }
        
        }
    }`;