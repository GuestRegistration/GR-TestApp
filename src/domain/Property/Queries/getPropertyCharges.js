import gql from 'graphql-tag';

export default gql`
    query getPropertyCharges($property_id: ID!){
        getPropertyCharges(property_id: $property_id){
            id
            type
            title
            amount
            description
            enable
        }
    }`;