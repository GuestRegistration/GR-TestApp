<template>
    <app-layer ref="app">
      <v-row justify="center">
        <v-col cols="12" md="4">
            <div class="text-center mb-5">
                <h1 color="red--text">Guest Registration</h1>
            </div>
            <v-card outlined
            :loading="sending_verification"
            >
              <v-card-text>
                  <div class="text-center">
                      <p>Give us your phone number so we can identify you </p>
                  </div>
                  <div class="my-5">
                      <v-form ref="phone_verification" >
                          <vue-tel-input 
                              :valid-characters-only="true"
                              @input="onInput"
                          ></vue-tel-input>
                          <div class="mt-2 text-center">
                              <strong :class="`${phone.valid ? 'success--text' : 'red--text'}`">{{ phone_number }}</strong>
                          </div>
                      </v-form>
                  </div>
              </v-card-text>
              <v-card-actions>
                  <v-btn
                      text
                      dark color="accent-4"
                      class="primary"
                      block
                      @click="_sendPhoneVerification"
                      id="sign-in-button"
                      :loading="sending_verification"
                  >
                      Continue
                  </v-btn>
              </v-card-actions>
            </v-card>

            <div class="text-center mt-3">
                <v-btn text dark class="primary ma-1" @click="signInWithGoogle">
                    Signin with Google
                </v-btn>
            </div>
        </v-col>
      </v-row>
    </app-layer>
</template>

<script>
    import { VueTelInput } from 'vue-tel-input'
    import {mapActions, mapMutations} from 'vuex'
    import AppLayer from '@/AppLayer';
    import firebase from '../../firebase';

    import validations from './../../helper/form_validation';

    export default {
        name: 'Signin',
        components:{
           AppLayer, VueTelInput
        },
        data(){
            return {
                phone: {
                    number: {},
                    valid: false,
                    country: undefined,
                },
                sending_verification: false,
                rules: validations.rules,
            }
        },
        computed:{
            phone_number(){
                return this.phone.number.international
            }
        },
        props: [],
        methods: {
            ...mapActions([
                'sendPhoneVerification'
            ]),

            onInput(formattedNumber, { number, valid, country }) {
                this.phone.number = number;
                this.phone.valid = valid;
                this.phone.country = country;
            },
            _sendPhoneVerification(){
                if(this.phone.valid){
                        this.sending_verification = true
                        this.sendPhoneVerification(this.phone_number)
                        .then(() => {
                            // SMS sent. Prompt user to type the code from the message, then sign the
                            // user in with confirmationResult.confirm(code).
                            this.$refs.app.alert(`Verification code sent to ${this.phone_number}`, 'success');
                            this.$router.push({
                                name: 'signin.verification',
                                query: this.$route.query
                              });
                        }).catch( (error) => {
                            this.$refs.app.toastError({
                                message: `Could not send SMS.`,
                                retry: () => {
                                    this._sendPhoneVerification();
                                },
                                exception: error
                            });
                        })
                        .finally(() => {
                            this.sending_verification = false;
                        })
                }else{
                    this.$refs.app.alert('Invalid phone number', 'red');
                }
            },

            signInWithGoogle(){
                let userRef, signin, setup_profile = false;
                
                let provider = new firebase.firebase.auth.GoogleAuthProvider();
                
                firebase.auth.signInWithPopup(provider).then((result) => {
                    console.log(result);
                    // This gives a Google Access Token. You can use it to access the Google API.
                    // var token = result.credential.accessToken;

                    //pass some data to the global scope of the method to be used in other chained promise
                    signin = result
                    
                    })
                    .catch((error) => {
                        alert(`Sign in failed: ${error.message}`)
                });
            },
        },
        mounted(){
            this.$refs.app.setState(true);
        }
    }
</script>

