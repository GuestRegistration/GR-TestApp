import gql from 'graphql-tag';

export default gql`

    mutation addPropertyCreditCard($property_id: ID!, $customer_id: ID!, $source: ID!){
        addPropertyCreditCard(property_id: $property_id, customer_id: $customer_id, source: $source){
            id
            object
            name
            brand
            exp_month
            exp_year
            last4
            customer
        }
    }
`