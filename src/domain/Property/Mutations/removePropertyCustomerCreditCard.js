import gql from 'graphql-tag';

export default gql`

    mutation removePropertyCustomerCreditCard($property_id: ID!, $customer_id: ID!, $card_id: ID!){
        removePropertyCustomerCreditCard(property_id: $property_id, customer_id: $customer_id, card_id: $card_id)
    }
`