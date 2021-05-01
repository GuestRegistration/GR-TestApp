import gql from 'graphql-tag';

export default gql`
    query getPropertyCustomer($user_id: ID, $property_id: ID!){
        getPropertyCustomer(user_id: $user_id, property_id: $property_id ){
            customer {
                id
                object
                address {
                    city
                    country
                    line1
                    line2
                    postal_code
                    state
                }
                balance
                created
                currency
                description
                email
                livemode
                metadata {
                    property_id
                    user_id
                }
                name
                phone
            }
            sources {
                has_more
                data {
                    id
                    name
                    brand
                    exp_month
                    exp_year
                    last4
                    customer
                }
            }
        }
    }`;