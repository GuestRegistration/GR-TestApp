import gql from 'graphql-tag'

export default gql`
    query getUserIdentities($id: String!){
        getUserIdentities(id: $id){
            id
            title
            verified
            document_type
            document_url
        }
    }`