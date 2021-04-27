import gql from 'graphql-tag';

export default gql`
    query getPropertyCheckinAgreements($property_id: ID!){
        getPropertyCheckinAgreements(property_id: $property_id){
            agreement
            link
        }
    }`;