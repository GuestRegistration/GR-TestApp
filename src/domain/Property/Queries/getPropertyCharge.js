import gql from 'graphql-tag';

export default gql`
    query getPropertyCharges($property_id: ID!, $charge_id: ID!){
        getPropertyCharges(property_id: $property_id, charge_id: $charge_id){
            id
            type
            title
            amount
            description
            enable
    }`;