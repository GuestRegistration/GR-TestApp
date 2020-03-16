import gql from 'graphql-tag'

export default gql`
    query getMyIdentities{
        getMyIdentities{
            id
            ref
            title
            verified
            document_type
            document_url
        }
    }`