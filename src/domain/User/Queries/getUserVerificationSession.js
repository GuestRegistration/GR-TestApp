import gql from 'graphql-tag';

export default gql`
    query getUserVerificationSession{
        getUserVerificationSession {
            session {
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
            last_report
        }
    }`;