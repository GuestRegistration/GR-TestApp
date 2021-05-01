import gql from 'graphql-tag';

export default gql`
        mutation captureReservationCharge($property_id: ID!, $charge_id: ID!, $amount: Int){
            captureReservationCharge(property_id: $property_id, charge_id: $charge_id, amount: $amount) {
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