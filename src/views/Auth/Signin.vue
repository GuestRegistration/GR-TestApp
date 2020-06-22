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
        </v-col>
      </v-row>
    </app-layer>
</template>

<script>
    import { VueTelInput } from 'vue-tel-input'
    import {mapActions, mapMutations} from 'vuex'
    import AppLayer from '@/AppLayer';

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
                                message: `Could not send SMS ${error.message}`,
                                retry: () => {
                                    this._sendPhoneVerification();
                                },
                            });
                        })
                        .finally(() => {
                            this.sending_verification = false;
                        })
                }else{
                    this.$refs.app.alert('Invalid phone number', 'red');
                }
            },
        },
        mounted(){
            this.$refs.app.setState(true);
        }
    }
</script>

