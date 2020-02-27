import gql from 'graphql-tag'

export default gql`
    query getReservation($id: String!){
        getReservation(id: $id){
            id
            name
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