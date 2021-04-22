import gql from 'graphql-tag';

export default gql`

    mutation updatePropertyCharge($property_id: ID!, $charge_id: ID!, $data: propertyChargeInput!){
        updatePropertyCharge(property_id: $property_id, charge_id: $charge_id, data: $data){
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