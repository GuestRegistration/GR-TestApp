
import firebase from './../firebase'
import apollo from './../apollo'
import GET_USER from './../graphql/query/get_user'
import CHECKIN_RESERVATION from './../graphql/mutation/checkin_reservation'

const actions = {

    /**
     * send phone verification to the provided phone number, https://firebase.google.com/docs/auth/web/phone-auth
     * return a promise that is resolved if the sms is sent successfully
     * @param {*} param0 
     * @param {*} mobile_number 
     */
    sendPhoneVerification({commit}, mobile_number){
        commit('PROCESSING', true)
        const appVerifier = new firebase.firebase.auth.RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': function(response) {
                console.log(response)
                console.log('Recapcha solved')
            }
        });
       return new Promise((resolve, reject) => {
            firebase.auth.signInWithPhoneNumber(mobile_number, appVerifier)
            .then(confirmationResult => {
                window.confirmationResult = confirmationResult
                resolve()
            })
            .catch(e => {
                reject(e)
            })
       })
    },

    /**
     * confirm phone verification code sent to mobile and return the user's authentication record, https://firebase.google.com/docs/auth/web/phone-auth
     * return a promise that is resolved to the authenticated user data
     * @param {*} param0 
     * @param {*} code 
     */
    confirmVerificationCode({commit}, code){
        commit('PROCESSING', true)
        return new Promise((resolve, reject) => {
            const verificationId = window.confirmationResult.verificationId
            const credential = firebase.firebase.auth.PhoneAuthProvider.credential(verificationId, code);
            //return window.confirmationResult.confirm(this.verification_code)
            firebase.auth.signInWithCredential(credential)
            .then(result => {
                commit('SET_CURRENT_USER', result.user)
                resolve(result)
            })
            .catch(e => {
                reject(e)
            })
        })
    },

    /**
     * run the getUser graphQL query with the specified id,
     * returns the result of the query
     * 
     * @param {*} param0 
     * @param {*} id 
     */
    getUser({commit}, id){
        commit('PROCESSING', true)
        return apollo.client.query({
            query: GET_USER,
            variables: {
                id
            }
        })
    },

    /**
     * runs the checkinReservation mutation to checkin a reservation. 
     * returns the result of the mutation
     * 
     * @param {*} param0 
     * @param {*} param1 
     */
    checkinReservation({commit}, {reservation_id, user_id, accepted_tnc}){
        commit('PROCESSING', true)
        return apollo.client.mutate({
            // Query
            mutation: CHECKIN_RESERVATION,
            variables: {
                    reservation_id,
                    user_id,
                    accepted_tnc
                }
        })
    },
    /**
     * sign out the cureently authenticated user
     */
    signout({commit}){
       return new Promise((resolve, reject) => {
            firebase.auth.signOut()
            .then(() => {
                commit('SET_CURRENT_USER', null)
                resolve()
            })
            .catch(e => {
                reject(e)
            })
       }) 

      }
}

export default actions