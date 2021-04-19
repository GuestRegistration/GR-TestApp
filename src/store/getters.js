const getters = {
    error : state => state.error,
    app_ready: state => state.app_ready,
    app_process: state => state.app_process,
    authenticated: state => state.current_user.auth.uid ? true : false,
    profile_loaded: state =>  Object.keys(state.current_user.profile).length ? true : false,
    current_user: state => state.current_user,
    snackbar: state => state.snackbar
}

export default getters