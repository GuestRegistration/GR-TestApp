import gql from 'graphql-tag';

export default gql`
    mutation checkinReservation($reservation_id: ID!, $agreements: [ReservationCheckinAgreementInput], $questions: [ReservationCheckinQuestionInput], $verification: ReservationIdVerificationInput,  $credit_card: ReservationCreditCardInput, $signature: String!) {
        checkinReservation(reservation_id: $reservation_id, agreements: $agreements, questions: $questions, verification: $verification, credit_card: $credit_card, signature: $signature) {
            id
            user_id
            name
            balance
            room
            booking_reference
            already_checkedin
            checkedin_at
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