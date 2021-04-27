import gql from 'graphql-tag';

export default gql`

    mutation updatePropertyCheckinQuestions($property_id: ID!, $questions: [PropertyCheckinQuestionInput]){
        updatePropertyCheckinQuestions(property_id: $property_id, questions: $questions){
            question
            options
            required
        }
    }
`