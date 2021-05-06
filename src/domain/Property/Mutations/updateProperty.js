import gql from 'graphql-tag';

export default gql`

    mutation updateProperty(
        $id: String!
        $name: String!, 
        $email: String!, 
        $phone: String!,
        $phone_country_code: String, 
        $phone_number: String, 
        $full_address: String!,
        $street: String, 
        $city: String, 
        $state: String, 
        $country: String, 
        $postal_code: String,
        $rules: String,
        $terms: String
    ){
        updateProperty(
            id: $id,
            name: $name, 
            email: $email, 
            phone: $phone,
            phone_country_code: $phone_country_code, 
            phone_number: $phone_number, 
            full_address: $full_address
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
            phone
            phone_meta {
                country_code
                phone_number
                complete_phone
            }
            full_address
            address {
                street
                city
                country
                postal_code
            } 
            stripe_connected
            subscription {
                status
                trial_start
                trial_end
                current_period_start
                current_period_end
            }
            active       
        }

    }
`