import gql from 'graphql-tag';

export default gql`
    query getProperty($id: String!){
        getProperty(id: $id){
            id
            name
            rules
            terms
            email
            phone_meta {
                country_code
                phone_number
                complete_phone
            }
            address {
                street
                city
                country
                postal_code
            }
        }
    }`;