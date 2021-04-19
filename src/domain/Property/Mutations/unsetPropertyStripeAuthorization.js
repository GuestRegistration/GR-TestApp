import gql from 'graphql-tag';

export default gql`

    mutation unsetPropertyStripeAuthorization($property_id: ID!){
        unsetPropertyStripeAuthorization(property_id: $property_id){
            stripe_user_id
        }
    }
`