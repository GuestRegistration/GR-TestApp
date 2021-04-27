import gql from 'graphql-tag';

export default gql`
    mutation updateReservation($id: ID!, $name: String!, $checkin_date: String, $checkout_date: String, $instruction: String, $charges: [propertyChargeInput], $agreements: [PropertyCheckinAgreementInput], $questions: [PropertyCheckinQuestionInput]) {
        updateReservation(id: $id, name: $name, checkin_date: $checkin_date, checkout_date: $checkout_date, instruction: $instruction, charges: $charges, agreements: $agreements, questions: $questions ){
            id
            user_id
            name
            booking_no
            checkedin_at
            already_checkedin
            approved
            approved_at
            checkin_date
            checkout_date
            instruction
            checkin_url
            property_id
            property{
                id
                name
                address
                image
            }
            guests{
                name
                gender
                type
            }
            charges{
                id
                title
                amount
                description
                type
                enable 
            }
            agreements {
                agreement
                link
            }
            questions {
                question
                options
                required
            }
        }
    }`;