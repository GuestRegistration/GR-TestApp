import gql from 'graphql-tag';

export default gql`
    query getUserNotifications{
        getUserNotifications{
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