import gql from 'graphql-tag';

export default gql`
    mutation sendPushNotification($user_id: String, $token: [String], $title: String!, $body: String!, $icon: String){
        sendPushNotification(user_id: $user_id, token: $token, title: $title, body: $body, icon: $icon )
}`;