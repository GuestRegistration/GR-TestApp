import gql from 'graphql-tag';

export default gql`
    mutation updateReservation($id: String!, $name: String!, $booking_channel: String, $checkin_date: String, $checkout_date: String, $instruction: String) {
        createReservation(id: $id, name: $name, booking_channel: $booking_channel, checkin_date: $checkin_date, checkout_date: $checkout_date, instruction: $instruction ){
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
    }`;