import gql from 'graphql-tag';

export default gql`
    query getReservationPayments($id: ID!){
        getReservationPayments(id: $id){
           id
           currency
           amount
           status
           metadata {
               user_id
               reservation_id
               charge_id
               property_id
           }
        }
    }`;