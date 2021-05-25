import gql from 'graphql-tag';
export default gql`
    mutation generatePropertyApiKey($property_id: ID!){
        generatePropertyApiKey(property_id: $property_id)
    }
`