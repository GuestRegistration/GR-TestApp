import gql from 'graphql-tag';

export default gql`
    mutation approveReservationCheckin($id: ID! ) {
        approveReservationCheckin(id: $id) {
            id
            user_id
            name
            checkedin_at
            already_checkedin
            approved
            approved_at
            booking_no
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