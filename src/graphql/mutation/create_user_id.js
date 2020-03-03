import gql from 'graphql-tag'

export default gql`
    mutation createUserIdentity($id: String!, $title: String!, $country: String!, $document_type: String!, $document_url: String! ) {
        createUserIdentity(id: $id, title: $title, country: $country, document_type: $document_type, document_url: $document_url) {
            title
            country
            document_type
            document_url
            verified
            ref
    }
}`