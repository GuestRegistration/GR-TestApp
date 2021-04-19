import gql from 'graphql-tag';

export default gql`
    query getReservationPayments($id: ID!){
        getReservationPayments(id: $id){
            id
           amount
           metadata {
               user_id
               reservation_id
               charge_id
               property_id
           }
        }
    }`;