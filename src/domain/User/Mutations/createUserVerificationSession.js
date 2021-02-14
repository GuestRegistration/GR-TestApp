import gql from 'graphql-tag'

export default gql`
    mutation createVerificationSession($user_id: ID!, $return_url: String, $refresh_url: String) {
        createVerificationSession(user_id: $user_id, return_url: $return_url, refresh_url: $refresh_url) {
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
    }
}`