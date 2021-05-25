import gql from 'graphql-tag';

export default gql`
    query getPropertyIntegrations($property_id: ID!){
        getPropertyIntegrations(property_id: $property_id){
            api_key
        }
    }`;