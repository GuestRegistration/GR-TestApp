import gql from 'graphql-tag';

export default gql`

    mutation removePropertyCreditCard($property_id: ID!, $customer_id: ID!, $card_id: ID!){
        removePropertyCreditCard(property_id: $property_id, customer_id: $customer_id, card_id: $card_id)
    }
`