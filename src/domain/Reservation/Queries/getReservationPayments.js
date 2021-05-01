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
            captured
            refunded
            amount_captured
            amount_refunded
            receipt_url
            net_captured
        }
    }`;