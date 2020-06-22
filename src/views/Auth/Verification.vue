<template>
    <app-layer ref="app">
        <v-row justify="center">
            <v-col cols="12" md="4">
                <div class="text-center mb-5">
                    <h1 color="red--text">Guest Registration</h1>
                </div>
                <v-card outlined
                :loading="confirming_verification_code"
                >
                    <v-card-text>
                        <div class="text-center">
                            <p>We sent a one time validation code to your phone number. Enter the 6 digit code below before it expires</p>
                        </div>
                        <div class="my-5">
                            <v-form ref="confirm_verification" >
                                <v-text-field outlined v-model="verification_code" label="Verification code" :rules="[rules.required]" hide-details="auto"></v-text-field>
                            </v-form>
                        </div>
                        <div class="my-3">
                            <a href="#" @click.prevent="resend">Resend verification code</a>
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                            text
                            dark color="accent-4"
                            class="primary"
                            block
                            @click="_confirmVerificationCode"
                            id="sign-in-button"
                            :loading="confirming_verification_code"
                        >
                            Continue
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </app-layer>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from 'vuex';
    import validation from './../../helper/form_validation';

    import AppLayer from '@/AppLayer';

export default {
        data(){
            return {
                rules: validation.rules,
                verification_code: '',
                confirming_verification_code: false,
            }
        },
        components: {
            AppLayer
        },
        computed:{
            ...mapGetters([
                'app_ready'
            ])
        },
        methods: {
            ...mapActions([
                'confirmVerificationCode'
            ]),
            resend(){
                window.confirmationResult = null;
                this.$router.push({name: 'signin', query: this.$route.query});
            },
            _confirmVerificationCode(){
                if(this.$refs.confirm_verification.validate()){
                    this.confirming_verification_code = true
                    this.confirmVerificationCode(this.verification_code)
                    .then((result) => {
                            this.confirming_verification_code = false;
                            if(this.$route.query.redirect){
                                this.$router.push({
                                    path: this.$route.query.redirect
                                });
                            }else{
                                this.$router.push({
                                    name: 'home'
                                });
                            }
                        }).catch( (error) => {
                            // User couldn't sign in (bad verification code?)
                            this.confirming_verification_code = false;
                            this.$refs.app.toastError({
                              message: `Could not sign in with the verification code. ${error.message}`,
                              retry: () => {
                                  this._confirmVerificationCode()
                              }, 
                            });
                        });
                }
            },
        },
        mounted(){
            this.$refs.app.setState(true);
        }
    }
</script>

<style scoped>

</style>

