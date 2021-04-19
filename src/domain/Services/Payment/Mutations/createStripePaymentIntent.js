import gql from 'graphql-tag';

export default gql`
        mutation createStripePaymentIntent($stripe_account: String!, $amount: Int!, $currency: String!, $payment_method_types: [String]!, $metadata: StripePaymentIntentMetadataInput){
            createStripePaymentIntent(stripe_account: $stripe_account, amount: $amount, currency: $currency, payment_method_types: $payment_method_types, metadata: $metadata) {
                client_secret      
            }
    }`;