import gql from 'graphql-tag';

export default gql`

    mutation createProperty(
        $name: String!, 
        $email: String!, 
        $phone: String!,
        $phone_country_code: String, 
        $phone_number: String, 
        $street: String, 
        $city: String, 
        $state: String, 
        $country: String, 
        $postal_code: String,
        $rules: String,
        $terms: String
    ){
        createProperty(
            name: $name, 
            email: $email, 
            phone: $phone,
            phone_country_code: $phone_country_code, 
            phone_number: $phone_number, 
            street: $street, 
            city: $city, 
            state: $state, 
            country: $country, 
            postal_code: $postal_code,
            rules: $rules,
            terms: $terms
        ){
            id
            name
            rules
            terms
            email
            image
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

    }
`