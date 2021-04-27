import gql from 'graphql-tag';

export default gql`
    query getPropertyCheckinQuestions($property_id: ID!){
        getPropertyCheckinQuestions(property_id: $property_id){
            question
            options
            required
        }
    }`;