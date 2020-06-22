import gql from 'graphql-tag'

export default gql`
    mutation checkinReservation($reservation_id: String!, $accepted_tnc: Boolean!, $identity_ref: String! ) {
        checkinReservation(reservation_id: $reservation_id, accepted_tnc: $accepted_tnc, identity_ref: $identity_ref) {
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
    }`