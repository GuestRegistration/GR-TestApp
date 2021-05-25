import gql from 'graphql-tag'

export default gql`
    mutation createUserStripeVerificationSession($property_id: ID!, $metadata: StripeVerificationMetadataInput,  $return_url: String, $refresh_url: String) {
        createUserStripeVerificationSession(property_id: $property_id, metadata: $metadata, return_url: $return_url, refresh_url: $refresh_url) {
            id
            object
            created
            last_error{
                code
                reason
            }
            livemode
            status
            type
            url
            last_verification_report{
                id
            }
            metadata {
                user_id
                property_id
                reservation_id
            }
    }
}`