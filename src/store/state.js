
const state = {
    navDrawer: false,
    processing: false,
    app_ready: false,
    current_user: {
        auth: {},
        profile: {},
        property: {}
    },
    error: {
        show: false,
        message: '',
        retry: null,
        exception: null
    },
}
export default state;