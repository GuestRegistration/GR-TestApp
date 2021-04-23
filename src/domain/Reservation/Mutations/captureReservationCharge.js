import gql from 'graphql-tag';

export default gql`
        mutation captureReservationCharge($stripe_account: ID!, $charge_id: ID!, $amount: Int){
            captureReservationCharge(stripe_account: $stripe_account, charge_id: $charge_id, amount: $amount) {
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
            }
    }`;