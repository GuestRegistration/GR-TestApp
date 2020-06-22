const getters = {
    error : state => state.error,
    app_ready: state => state.app_ready,
    authenticated: state => state.current_user.auth.uid ? true : false,
    profile_loaded: state =>  Object.keys(state.current_user.profile).length ? true : false,
    current_user: state => state.current_user,
}

export default getters