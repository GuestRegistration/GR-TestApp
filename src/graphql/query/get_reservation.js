import gql from 'graphql-tag'

export default gql`
    query getReservation($id: String!){
        getReservation(id: $id){
            id
            name
            checkedin_at
            already_checkedin
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