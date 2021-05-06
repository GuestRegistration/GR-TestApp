
const state = {
    navDrawer: false,
    processing: false,
    app_ready: false,
    app_process: '',
    current_user: {
        auth: {},
        profile: {},
        property: {}
    },
    error: {
        show: false,
        message: '',
        retry: () => Promise.resolve(),
        exception: null
    },
    snackbar: {
        status: false,
        text: '', 
        color: 'primary', 
        top: false, 
        right: false, 
        bottom: true, 
        left: false
    }
}
export default state;