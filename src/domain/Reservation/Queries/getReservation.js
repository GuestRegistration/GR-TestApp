import gql from 'graphql-tag';

export default gql`
    query getReservation($id: ID!){
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
            checkin_url
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
    }`;