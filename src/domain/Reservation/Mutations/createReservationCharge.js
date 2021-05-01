import gql from 'graphql-tag';

export default gql`
        mutation createReservationCharge($property_id: ID!, $source: String!, $customer: ID, $amount: Int!, $currency: String!, $description: String, $receipt_email: String, $metadata: StripeReservationChargeMetadataInput, $capture: Boolean){
            createReservationCharge(property_id: $property_id, source: $source, customer: $customer, amount: $amount, currency: $currency, description: $description, receipt_email: $receipt_email, metadata: $metadata, capture: $capture) {
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