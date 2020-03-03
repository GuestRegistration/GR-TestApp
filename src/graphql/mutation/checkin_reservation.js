import gql from 'graphql-tag'

export default gql`
    mutation checkinReservation($reservation_id: String!, $user_id: String!, $accepted_tnc: Boolean!, identity_ref: String! ) {
        checkinReservation(reservation_id: $reservation_id, user_id: $user_id, accepted_tnc: $accepted_tnc, identity_ref: $identity_ref) {
           id
           already_checkedin
           checkedin_at
    }
}`