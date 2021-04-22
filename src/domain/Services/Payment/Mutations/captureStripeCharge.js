import gql from 'graphql-tag';

export default gql`
        mutation captureStripeCharge($stripe_account: String!, $charge_id: ID!, $amount: Int){
            captureStripeCharge(stripe_account: $stripe_account, charge_id: $charge_id, amount: $amount) {
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
            }
    }`;