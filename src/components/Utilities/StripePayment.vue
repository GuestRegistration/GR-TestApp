<template>
  <v-row justify="center">
    <v-dialog
      transition="dialog-bottom-transition"
      v-model="dialog"
      persistent
      max-width="400"
    >
      <v-card>
        <v-card-title class="headline grey lighten-3">
          Credit/Debit Card
        </v-card-title>
        <v-card-text>
            
            <data-container :loading="initializing">
                <template #loading>
                    <div class="py-5 text-gray-500 text-center">
                        Hold on while we initialize payment gateway...
                    </div>
                </template>
                <v-alert v-if="initError" color="error">Unable to initialize your payment right now</v-alert>
            </data-container>

            <form @submit.prevent="createToken" :class="{'d-none': initializing || initError != null }">
                <div class="my-3">
                    <div  class="my-3" :id="`card-element-${_uid}`">
                    <!-- A Stripe Element will be inserted here. -->
                    </div>
                    <!-- Used to display Element errors. -->
                    <div id="card-errors" class="text-danger" role="alert">{{cardError}}</div>
                </div>
                <div class="my-5">
                        <v-alert 
                            v-if="processing"
                            border="left"
                            colored-border
                            elevation="2"
                            type="info"
                        >
                        {{process}}
                    </v-alert>
                </div>
            </form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
            <v-btn  text color="red" @click="cancel" invert>Cancel</v-btn>
            <v-btn @click="createToken" color="primary" :loading="processing" :disabled="initError != null" >Pay {{ currency }}{{ amount }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
    import DataContainer from '../DataContainer';
    export default {
        name: "StripePayment",
        components: {
           DataContainer
        },
        data(){
            return {
                dialog: false,
                process: '',
                initError: null,
                cardError: null,
                stripe: null,
                card: null,
                initializing: false,
                intent: null,
            }
        },
        props: {
            publishableKey: {
                type: String,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
            chargeCallback: Function,
            currency: String,

        },

        computed: {
            processing(){
                return this.process === '' ? false : true
            },
        },

        methods: {
            open(intent){
                if(intent){
                    this.intent = intent;
                }
                this.dialog = true;
                this.initialize();
            },

            close(){
                this.dialog = false;
                this.process = '';
                this.card = null;
                this.intent = null;
            },

            initialize()
            {
                this.initializing = true;
                this.setStripe()
                .then(() => {
                    const elements = this.stripe.elements();
                    const style = {
                        base: {
                            fontSize: '16px',
                            color: '#32325d',
                        },
                    };
                    // Create an instance of the card Element.
                    this.card = elements.create('card', {style: style});
                    // Add an instance of the card Element into the `card-element` <div>.
                    this.card.mount(`#card-element-${this._uid}`);

                })
                .catch(e => {
                    // this.$store.commit('APP_ERROR', e);
                    console.log(e, e.message)
                    this.initError = e;
                })
                .finally(() => {
                    this.initializing = false;
                })
            },

            setStripe()
            {
                 /* eslint-disable */
                return new Promise((resolve, reject) => {                    
                    if(document.querySelector("[data-stripe='true']") !== null){
                      
                        this.stripe = Stripe(this.publishableKey);
                        this.$emit('gateway-initailized');
                        resolve();
                        return;
                    }
                    this.process = `Initializing payment gateway...`;
                    let stripeScript = document.createElement('script')
                    stripeScript.setAttribute('src', 'https://js.stripe.com/v3/');
                    document.head.appendChild(stripeScript);
                    stripeScript.onload = () => {
                        this.$emit('gateway-initailized');
                        stripeScript.setAttribute('data-stripe', 'true');
                        this.process = '';
                        this.stripe = Stripe(this.publishableKey);
                        resolve();
                    };
                    stripeScript.onerror = (e) => {
                        this.process = '';
                        reject(e);
                    }; 
                })
            },

            confimPayment()
            {
               const vm = this
               this.process = "Processing your payment...";
                // Confirm payment
                vm.stripe.confirmCardPayment(this.intent.client_secret, {
                    payment_method: {
                        card: this.card,
                        // billing_details: {
                        //     name: [this.$store.getters.auth.firstName, this.$store.getters.auth.lastName].join(' ')
                        // }
                    }
                }).then(function(result) {
                    if (result.error) {
                        vm.$emit('error',  result.error);
                    } else {
                    // The payment has been processed!
                    if (result.paymentIntent.status === 'succeeded') {
                            vm.$emit('success');
                        }
                    }
                })
                .finally(() => {
                    this.process = "";
                })
            },

            createToken(){
               const vm = this
               this.process = "Processing your payment...";
                // Create a token or display an error when the form is submitted.
                vm.stripe.createToken(this.card).then((response) => {
                    if (response.error) {
                        vm.$emit('error', response.error)
                        vm.process = '';
                    } else {
                        vm.chargeCallback(response.token.id)
                        .then(response => {
                            this.$emit('success', response);
                        })
                        .catch(e => {
                            this.$emit('error', e);
                        })
                        .finally(() => {
                            vm.process = '';
                        })
                    }
                });
            },

            cancel(){
                this.$emit('abort');
                this.close();
            }
        },
       
    }
</script>

<style scoped>
    /* *
    * The CSS shown here will not be introduced in the Quickstart guide, but shows
    * how you can use CSS to style your Element's container.
    */
    .StripeElement {
    box-sizing: border-box;

    height: 40px;

    padding: 10px 12px;

    border: 1px solid transparent;
    border-radius: 4px;
    background-color: white;

    box-shadow: 0 1px 3px 0 #e6ebf1;
    -webkit-transition: box-shadow 150ms ease;
    transition: box-shadow 150ms ease;
    }

    .StripeElement--focus {
    box-shadow: 0 1px 3px 0 #cfd7df;
    }

    .StripeElement--invalid {
    border-color: #fa755a;
    }

    .StripeElement--webkit-autofill {
    background-color: #fefde5 !important;
    }
</style>