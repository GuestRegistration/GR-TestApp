
const state = {
    processing: false,
    app_ready: false,
    current_user: {
        auth: {},
        profile: {}
    },
    error: {
        show: false,
        message: '',
        retry: null
    },
}
export default state