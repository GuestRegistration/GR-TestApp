import gql from 'graphql-tag'

export default gql`
    mutation updateUserEmail($id: ID!, $email: String!, $pending: Boolean) {
        updateUserEmail(id: $id, email: $email, pending: $pending) 
}`