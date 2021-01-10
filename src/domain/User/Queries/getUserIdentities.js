import gql from 'graphql-tag';

export default gql`
    query getMyIdentities{
        getUserIdentities{
            id
            ref
            title
            verified
            document_type
            document_url
        }
    }`;