import gql from 'graphql-tag';

export default gql`
    mutation checkinReservation($reservation_id: ID!, $identity_ref: String ) {
        checkinReservation(reservation_id: $reservation_id, identity_ref: $identity_ref) {
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
            property_id
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
            charges{
                id
                title
                amount
                description
                type
                enable 
            }
        
        }
    }`;