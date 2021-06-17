import gql from 'graphql-tag';

export default gql`
    mutation createReservation($property_id: ID!, $data: ReservationInput!) {
        createReservation(property_id: $property_id, data: $data ){
            id
            user_id
            name
            balance
            room
            booking_reference
            already_checkedin
            checkedin_at
            approved
            approved_at
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
            agreements {
                agreement
                link
            }
            questions {
                question
                options
                required
            }
        
        }
    }`;