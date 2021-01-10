import gql from 'graphql-tag'

export default gql`
    mutation updateUserDevice($device_id: String, $notification_token: String) {
        updateUserDevice(device_id: $device_id, notification_token: $notification_token) {
            device_id
            notification_token
    }
}`