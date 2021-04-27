import gql from 'graphql-tag';

export default gql`

    mutation updatePropertyCheckinAgreements($property_id: ID!, $agreements: [PropertyCheckinAgreementInput]){
        updatePropertyCheckinAgreements(property_id: $property_id, agreements: $agreements){
            agreement
            link
        }
    }
`