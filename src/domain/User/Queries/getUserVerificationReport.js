import gql from 'graphql-tag';

export default gql`
    query getUserVerificationReport($id: ID){
        getUserVerificationReport(id: $id){
            id
            object
            created
            livemode
            type #Enum: document | id_number
            verification_session #ID VerificationSession 
            options {
                document {
                    document_types
                    require_id_number
                    require_live_capture
                    require_matching_selfie
                } 
            }
            document {
                status #Enum: processing | verified | unverified
                error {
                    code
                    reason
                }
                first_name
                last_name
                dob {
                    year
                    month
                    day
                }
                address {
                    line1
                    city
                    state
                    zip
                    country
                }
                document_type #Enum: driving_license | passport | id_card
                # document_number #Expandable --> https://stripe.com/docs/api/expanding_objects
                back #FileUpload,
                front #FileUpload,
                expiration_date {
                    year
                    month
                    day
                }
                issued_date {
                    year
                    month
                    day
                }
                issuing_country
            }

            selfie {
                document_front #FileUpload
                error {
                    code #Enum: selfie_document_non_photo_id | selfie_no_face_detected | selfie_multiple_faces_detected | selfie_face_mismatch | selfie_manipulated
                    reason
                }
                selfie #FileUpload
                status #Enum: processing | verified | unverified
            }
            metadata {
                user_id
            }
            files{
                document_front {
                    img_src
                }
                document_back{
                    img_src
                }
                selfie {
                    img_src
                }
            }
        }

    }`;