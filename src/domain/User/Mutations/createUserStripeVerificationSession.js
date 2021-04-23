import gql from 'graphql-tag'

export default gql`
    mutation createUserStripeVerificationSession($stripe_account: ID!, $metadata: StripeVerificationMetadataInput,  $return_url: String, $refresh_url: String) {
        createUserStripeVerificationSession(stripe_account: $stripe_account, metadata: $metadata, return_url: $return_url, refresh_url: $refresh_url) {
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
            }
    }
}`