
const state = {
    processing: false,
    app_ready: false,
    current_user: {
        auth: null,
        profile: null
    },

    //verification data during signing in
    auth: {
        appVerifier: null,
        confirmationResult: null
    }
}
export default state