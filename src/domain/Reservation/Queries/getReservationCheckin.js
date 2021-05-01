import gql from 'graphql-tag';

export default gql`
    query getReservationCheckin($id: ID!){
        getReservationCheckin(id: $id){
            checkin {
                checkedin_at
                name {
                    first_name
                    last_name
                }
                agreements {
                    agreement
                    link
                }
                questions {
                    question
                    response
                }
                credit_card {
                    id
                    brand
                    customer
                    exp_month
                    exp_year
                    last4
                    name
                }

            }
            reservation{
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
                instruction
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
            }
            
            user{
                id
                email,
                phone,
                name{
                    first_name
                    last_name
                }
                phone_meta{
                    country_code
                    phone_number
                }
            }
            verifications{
                type
                status
                session
                report
                metadata {
                    user_id
                    property_id
                }
            }

        }
    }`;