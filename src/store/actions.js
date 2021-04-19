
import firebase from './../firebase';
import _apollo from './../apollo';
import helper from './../helper';

const actions = {

    getIdToken({commit}){
        return new Promise((resolve, reject) => {
            const auth_user = firebase.auth.currentUser
            if(auth_user){
                auth_user.getIdToken()
                .then((idToken) => {
                    window.localStorage.setItem('gr-user', idToken);
                    window.localStorage.setItem('token-expires', helper.nowTimestamp()+3500);
                    commit('SET_USER_AUTH', auth_user)
                    resolve(auth_user)
                })
                .catch(e => {
                    window.localStorage.removeItem('gr-user');
                    window.localStorage.removeItem('token-expires');    
                    reject(e)
                })
            }else{
                window.localStorage.removeItem('gr-user');
                window.localStorage.removeItem('token-expires');    
                resolve(null)
            }
        })
    },
    /**
     * send phone verification to the provided phone number, https://firebase.google.com/docs/auth/web/phone-auth
     * return a promise that is resolved if the sms is sent successfully
     * @param {*} param0 
     * @param {*} mobile_number 
     */
    // sendPhoneVerification({commit}, mobile_number){
    //     commit('PROCESSING', true)
    //     const appVerifier = new firebase.firebase.auth.RecaptchaVerifier('sign-in-button', {
    //         'size': 'invisible',
    //         'callback': function(response) {
    //             // console.log(response)
    //             // console.log('Recapcha solved')
    //         }
    //     });
    //    return new Promise((resolve, reject) => {
    //         firebase.auth.signInWithPhoneNumber(mobile_number, appVerifier)
    //         .then(confirmationResult => {
    //             window.confirmationResult = confirmationResult
    //             resolve()
    //         })
    //         .catch(e => {
    //             reject(e)
    //         })
    //    })
    // },

    /**
     * confirm phone verification code sent to mobile and return the user's authentication record, https://firebase.google.com/docs/auth/web/phone-auth
     * return a promise that is resolved to the authenticated user data
     * @param {*} param0 
     * @param {*} code 
     */
    // confirmVerificationCode({commit}, code){
    //     commit('PROCESSING', true)
    //     return new Promise((resolve, reject) => {
    //         const verificationId = window.confirmationResult.verificationId
    //         const credential = firebase.firebase.auth.PhoneAuthProvider.credential(verificationId, code);
    //         //return window.confirmationResult.confirm(this.verification_code)
    //         firebase.auth.signInWithCredential(credential)
    //         .then(result => {
    //             resolve(result)
    //         })
    //         .catch(e => {
    //             reject(e)
    //         })
    //     })
    // },

    query({commit}, {query, variables}){
        return new Promise((resolve, reject) => {
            _apollo().then(apollo => {
                return apollo.client.query({
                    query,variables
                })
            })
            .then(response => {
                resolve(response);
            })
            .catch(e => {
                reject(e);
            })
        })
    },
    
    mutate({commit}, {mutation, variables}){
        return new Promise((resolve, reject) => {
            _apollo().then(apollo => {
                return apollo.client.mutate({
                    mutation,variables
                })
            })
            .then(response => {
                resolve(response);
            })
            .catch(e => {
                reject(e);
            })
        })
    },

    /**
     * sign out the cureently authenticated user
     */
    signout({commit}){
       return new Promise((resolve, reject) => {
            firebase.auth.signOut()
            .then(() => {
                window.localStorage.removeItem('gr-user');
                window.localStorage.removeItem('token-expires');
                commit('UNSET_CURRENT_USER')
                resolve()
            })
            .catch(e => {
                reject(e)
            })
       }) 

      }
}

export default actions