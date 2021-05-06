import gql from 'graphql-tag';

export default gql`
    query getPropertyAsCustomer($property_id: ID!){
        getPropertyAsCustomer(property_id: $property_id){
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
                default_source
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