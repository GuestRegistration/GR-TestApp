import gql from 'graphql-tag';

export default gql`
    query getPropertyNotifications($id: String){
        getPropertyNotifications(id: $id){
            id
            text
            time
            timestamp
            payload{
                property_id
                reservation_id
                user_id
            }
        }
    }`;