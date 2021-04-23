import gql from 'graphql-tag';

export default gql`

    mutation createPropertyCheckinInstructionTemplate($property_id: ID!, $title: String, $body: String!){
        createPropertyCheckinInstructionTemplate(property_id: $property_id, title: $title, body: $body){
            id
            title
            body
        }
    }
`