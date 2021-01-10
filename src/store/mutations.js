
const mutations = {
    SET_APP_STATE: (state, ready) => {
        state.app_ready = ready
    },
    // SET_VERIFICATION_CONFIRMATION_RESULT: (state, confirmationResult) => {
    //     state.auth.confirmationResult = confirmationResult
    // },

    SET_USER_AUTH: (state, auth) => {
        state.current_user.auth = auth
    },

    SET_USER_PROFILE: (state, profile) => {
        state.current_user.profile = profile
    },

    SET_ACTIVE_PROPERTY: (state, property) => {
        state.current_user.property = property
    },

    ADD_USER_PROPERTY: (state, property) => {
        const userProperty = {
            id: property.id,
            name: property.name,
            image: property.image,
            city: property.address.city,
            country: property.address.country,
        };
       if(state.current_user.profile.properties){
            state.current_user.profile.properties.push(userProperty);
       }else{
            state.current_user.profile.properties = [userProperty];
       }
    },

    TOAST_ERROR: (state, { show, message, retry, exception }) => {
        state.error = { show, message, retry, exception };
    },
    UNSET_CURRENT_USER: (state) => {
        state.current_user = {
            auth: {},
            profile: {},
            property: {}
        }
    },
    PROCESSING(state, status){
        state.processing = status
    } 
}

export default mutations