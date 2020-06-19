<template>
    <div>
        <v-container v-if="report">
            <Report :_message="report" @close="report = null"/>
        </v-container>
        
        <v-container>
            <template v-if="!verification_sent">
                <MobileVerification @sent="verificationSent" @error="gotError" />
            </template>

            <template v-else>
                <MobileVerificationConfirmation :phone_number="phone.number.international" @verified="phoneVerified" @resend="verification_sent = false" @error="gotError" />
            </template>

        </v-container>
    </div>

</template>

<script>
    import firebase from './../firebase'

    import Report from './Report'
    import MobileVerification from './../components/MobileVerification'
    import MobileVerificationConfirmation from './../components/MobileVerificationConfirmation'

    import {mapActions, mapGetters, mapMutations} from 'vuex'

    export default {
        components: {
            Report,
            MobileVerification,
            MobileVerificationConfirmation, 

        },
        data(){
            return {
                sending_verification: false,
                verification_sent: false,
                phone: null,
                rules: {
                    required: value => !!value || 'Required.'
                },
                report: null
            }
        },
        computed:{
            ...mapGetters([
 
            ])
        },
        props: [],
        methods: {
            ...mapActions([
                'getIdToken',
                'getUserByID',
                'sendPhoneVerification'
            ]),
            ...mapMutations([
                'SET_APP_STATE',
                'SET_CURRENT_USER',
            ]),
            gotError(e){
                this.report = e
            },

            verificationSent(phone){
              this.verification_sent = true
               this.phone = phone
            },

            phoneVerified(user){
                this.$emit('authenticated')
            }
        }
    }
</script>

<style scoped>

</style>

