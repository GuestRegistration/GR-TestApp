import gql from 'graphql-tag';

export default gql`
    query getUserStripeVerificationSession($user_id: ID, $verification_id: ID!){
        getUserStripeVerificationSession(user_id: $user_id, verification_id: $verification_id ) {
            id
            object
            created
            last_error {
                code
                reason
            }
            livemode
            metadata {
                user_id  
            }
            options{
                document {
                    document_types
                    require_id_number
                    require_live_capture
                    require_matching_selfie
                } 
            }
            status
            type
            url
            # verified_outputs
        }
    }`;