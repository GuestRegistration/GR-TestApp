import gql from 'graphql-tag'

export default gql`
    mutation createUser($id: String,$phone: String!, $email: String!, $first_name: String!, $last_name: String! ) {
        createUser(id: $id, phone: $phone, email: $email, first_name: $first_name, last_name: $last_name) {
            phone
            email
            name{
                first_name
                last_name
            }

}
}`