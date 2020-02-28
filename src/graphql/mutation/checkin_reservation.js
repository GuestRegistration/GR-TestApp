import gql from 'graphql-tag'

export default gql`
    mutation checkinReservation($reservation_id: String!, $user_id: String!, $accepted_tnc: Boolean! ) {
        checkinReservation(reservation_id: $reservation_id, user_id: $user_id, accepted_tnc: $accepted_tnc) {
           id
           already_checkedin
           checkedin_at
    }
}`