const mutations = {
    SET_VERIFICATION_CONFIRMATION_RESULT(state, confirmationResult){
        state.auth.confirmationResult = confirmationResult
    },
    SET_CURRENT_USER(state, user){
        state.current_user = user
    },
    UNSET_CURRENT_USER(state){
        state.current_user = null
    },
    PROCESSING(state, status){
        state.processing = status
    } 
}

export default mutations