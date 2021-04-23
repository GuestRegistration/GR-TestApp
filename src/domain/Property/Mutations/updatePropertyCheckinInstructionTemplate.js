import gql from 'graphql-tag';

export default gql`

    mutation updatePropertyCheckinInstructionTemplate($property_id: ID!,  $template_id: ID!, $title: String, $body: String!){
        updatePropertyCheckinInstructionTemplate(property_id: $property_id,  template_id: $template_id, title: $title, body: $body){
            id
            title
            body
        }
    }
`