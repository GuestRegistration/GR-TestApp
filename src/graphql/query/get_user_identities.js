import gql from 'graphql-tag'

export default gql`
    query getUserIdentities($id: String!){
        getUserIdentities(id: $id){
            id
            ref
            title
            verified
            document_type
            document_url
        }
    }`