import gql from 'graphql-tag';

export default gql`

    mutation createPropertyCustomer($property_id: ID!, $user_id: ID!, $name: String, $source: ID!, $email: String, $phone: String, $description: String ){
        createPropertyCustomer(property_id: $property_id, user_id: $user_id, name: $name, source: $source, email: $email, phone: $phone, description: $description){
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
    }
`