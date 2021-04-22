import gql from 'graphql-tag';

export default gql`

    mutation createPropertyCharge($property_id: ID!, $data: propertyChargeInput!){
        createPropertyCharge(property_id: $property_id, data: $data){
            id
            title
            amount
            description
            type   
            enable
            optional
        }
    }
`