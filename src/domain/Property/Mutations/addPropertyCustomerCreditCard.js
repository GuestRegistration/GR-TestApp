import gql from 'graphql-tag';

export default gql`

    mutation addPropertyCustomerCreditCard($property_id: ID!, $customer_id: ID!, $source: ID!){
        addPropertyCustomerCreditCard(property_id: $property_id, customer_id: $customer_id, source: $source){
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