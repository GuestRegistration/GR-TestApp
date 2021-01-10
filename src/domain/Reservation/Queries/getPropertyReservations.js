import gql from 'graphql-tag';

export default gql`
    query getPropertyReservations($id: String!){
        getPropertyReservations(id: $id){
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