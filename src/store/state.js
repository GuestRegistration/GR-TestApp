
const state = {
    processing: false,
    current_user: {
        auth: null,
        profile: null
    },
    //some authentication data
    auth: {
        appVerifier: null,
        confirmationResult: null
    }
}
export default state