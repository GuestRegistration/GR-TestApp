import gql from 'graphql-tag';

export default gql`
    query getUserStripeVerifications($user_id: ID, $property_id: ID!){
        getUserStripeVerifications(user_id: $user_id, property_id: $property_id) {
            property_id
            session
            report
            status
            url
            type
            metadata {
                user_id
                property_id
                reservation_id
            }
        }
    }`;