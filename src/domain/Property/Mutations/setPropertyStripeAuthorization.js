import gql from 'graphql-tag';

export default gql`

    mutation setPropertyStripeAuthorization($property_id: ID!, $grant_type: String!, $code: String!){
        setPropertyStripeAuthorization(property_id: $property_id, grant_type: $grant_type, code: $code){
            access_token
            scope
            livemode
            token_type
            refresh_token
            stripe_user_id
            stripe_publishable_key       
        }

    }
`