<template>
    <div>
        <v-container v-if="error">
            <Error :_message="error" />
        </v-container>
        <v-container>

            <template v-if="!verification_sent">
                <MobileVerification @sent="verificationSent" @error="gotError" />
            </template>

            <template v-else>
                <MobileVerificationConfirmation :phone_number="phone_number" @verified="phoneVerified" @resend="verification_sent = false" @error="gotError" />
            </template>

        </v-container>
    </div>

</template>

<script>
    import firebase from './../firebase'

    import Error from './Error'
    import MobileVerification from './../components/MobileVerification'
    import MobileVerificationConfirmation from './../components/MobileVerificationConfirmation'

    import {mapActions, mapMutations} from 'vuex'

    export default {
        components: {
            Error,
            MobileVerification,
            MobileVerificationConfirmation, 

        },
        data(){
            return {
                sending_verification: false,
                verification_sent: false,
                mobile_number: '',
                rules: {
                    required: value => !!value || 'Required.'
                },
                error: null
            }
        },
        props: [],
        methods: {
            ...mapActions([
                'getUserByID',
                'sendPhoneVerification'
            ]),
            ...mapMutations([
                'SET_CURRENT_USER'
            ]),
            gotError(e){
                this.error = e
                this.$emit('error', e)
            },

            verificationSent(phone_number){
              this.verification_sent = true
               this.phone_number = phone_number
            },
            phoneVerified(user){
                // get the user idToken from firebase and save it in the local storage, then set the current_user state of the app
                const auth_user = firebase.auth.currentUser
                if(auth_user){
                    // get user idTOken and store in the local storage
                    auth_user.getIdToken()
                        .then((idToken) => {
                            window.localStorage.setItem('gr-user', idToken)
                            console.log('logged in and token saved')
                            return new Promise((resolve, reject) => {
                                resolve(auth_user)
                            })
                        })
                        // then, get the user profile and mutate it to the app state
                        .then((user) => {
                            //console.log(user)
                             this.getUserByID(user.uid)
                            .then(response => {
                                this.SET_CURRENT_USER({
                                        auth: user,
                                        profile: response.data.getUserByID 
                                    })
                                this.$emit('authenticated')
                            })
                        })
                    .catch(e => {
                        this.error = e.message
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>

