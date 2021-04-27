import gql from 'graphql-tag';

export default gql`
    mutation checkinReservation($reservation_id: ID!, $agreements: [ReservationCheckinAgreementInput], $questions: [ReservationCheckinQuestionInput]) {
        checkinReservation(reservation_id: $reservation_id, agreements: $agreements, questions: $questions) {
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