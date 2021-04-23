import gql from 'graphql-tag';

export default gql`
    mutation refundReservationCharge($stripe_account: ID!, $charge_id: ID!, $amount: Int, $reason: String){
        refundReservationCharge(stripe_account: $stripe_account, charge_id: $charge_id, amount: $amount, reason: $reason) {
            id
            currency
            amount
            status
            metadata {
                customer_note
            }
            reason
            charge {
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
        }
}`;