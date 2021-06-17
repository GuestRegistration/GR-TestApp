
const mutations = {
    SET_APP_STATE: (state, ready) => {
        state.app_ready = ready
    },

    SET_APP_PROCESS: (state, process) => {
        state.app_process = process
    },

    SET_USER_AUTH: (state, auth) => {
        state.current_user.auth = auth
    },

    SET_USER_PROFILE: (state, profile) => {
        state.current_user.profile = profile
    },

    SET_ACTIVE_PROPERTY: (state, property) => {
        state.current_user.property = property
    },

    ADD_USER_RESERVATION: (state, reservation) => {
        const userReservation = {
            id: reservation.id,
            name: reservation.name,
            property_id: reservation.property.id,
            property_name: reservation.property.name,
            property_address: reservation.property.address,
            property_image: reservation.property.image,
            checkin_date: reservation.checkin_date,
            checkout_date: reservation.checkout_date,
            role: ''
        };
       if(state.current_user.profile.reservations){
            state.current_user.profile.reservations.push(userReservation);
       }else{
            state.current_user.profile.reservations = [userReservation];
       }
    },

    ADD_USER_PROPERTY: (state, property) => {
        const userProperty = {
            id: property.id,
            name: property.name,
            image: property.image,
            address: property.full_address,
            active: property.active
        };
       if(state.current_user.profile.properties){
            state.current_user.profile.properties.push(userProperty);
       }else{
            state.current_user.profile.properties = [userProperty];
       }
    },

    UPDATE_USER_PROPERTY: (state, property) => {
        const userProperty = {
            id: property.id,
            name: property.name,
            image: property.image,
            address: property.full_address,
            active: property.active
        };
       if(state.current_user.profile.properties){
            let index = state.current_user.profile.properties.findIndex(p => p.id == property.id);
            if(index < 0) return;
            state.current_user.profile.properties.splice(index, 1, userProperty);
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

    SNACKBAR(state, settings){
        state.snackbar = settings
    },

    SET_APP_LAYOUT(state, layout) {
        state.app_layout = layout
    }
}

export default mutations