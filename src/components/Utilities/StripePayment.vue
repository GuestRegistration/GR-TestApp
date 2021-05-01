<template>
  <v-row justify="center">
    <v-dialog
      transition="dialog-bottom-transition"
      v-model="dialog"
      persistent
      max-width="400"
    >
    <v-card flat>
        <v-card-title class="headline">
          Credit/Debit Card
          <v-spacer></v-spacer>
          <v-btn  text color="red" @click="cancel" invert>Cancel</v-btn>
        </v-card-title>
        <v-card-text>
          <stripe-credit-card ref="creditCard" v-bind="$attrs" v-on="$listeners" @ready="open" @abort="close" />
        </v-card-text>
    </v-card>
      
    </v-dialog>
  </v-row>
</template>


<script>
    import StripeCreditCard from './StripeCreditCardForm';
    export default {
        name: "StripePayment",
        components: {
           StripeCreditCard
        },
        data(){
            return {
                dialog: false,
            }
        },

        methods: {
            open(){
                this.dialog = true;
            },

            close(){
              this.dialog = false;
            },

            cancel(){
              this.$refs.creditCard.cancel();
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