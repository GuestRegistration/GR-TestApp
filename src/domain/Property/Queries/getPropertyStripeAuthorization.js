import gql from 'graphql-tag';

export default gql`
    query getPropertyStripeAuthorization($property_id: ID!){
        getPropertyStripeAuthorization(property_id: $property_id){
            access_token
            scope
            livemode
            token_type
            refresh_token
            stripe_user_id
            stripe_publishable_key
        }
    }`;