import gql from 'graphql-tag';

export default gql`
    mutation checkinReservation($property_id: ID!, $name: String!, $booking_channel: String, $checkin_date: String!, $checkout_date: String!, $instruction: String, $charges: [propertyChargeInput]) {
        createReservation(property_id: $property_id, name: $name, booking_channel: $booking_channel, checkin_date: $checkin_date, checkout_date: $checkout_date, instruction: $instruction, charges: $charges ){
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