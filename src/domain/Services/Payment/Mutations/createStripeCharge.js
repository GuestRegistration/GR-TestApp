import gql from 'graphql-tag';

export default gql`
        mutation createStripeCharge($stripe_account: String!, $source: String!, $amount: Int!, $currency: String!, $description: String, $receipt_email: String, $metadata: StripeChargeMetadataInput){
            createStripeCharge(stripe_account: $stripe_account, source: $source, amount: $amount, currency: $currency, description: $description, receipt_email: $receipt_email, metadata: $metadata) {
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