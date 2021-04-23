import gql from 'graphql-tag';

export default gql`
    query getPropertyCheckinInstructionTemplates($property_id: ID!){
        getPropertyCheckinInstructionTemplates(property_id: $property_id){
            id
            title
            body
        }
    }`;