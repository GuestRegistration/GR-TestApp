<template>
    <div>
        <confirmation-dialog ref="confirmation" @confirmed="charge">
            <div class="mt-5">
                <h4>Are you sure you want to charge the guest's card {{ form.currency }}{{ form.amount }} ?</h4>
            </div>
        </confirmation-dialog>

        <v-dialog
            v-model="dialog"
            width="400"
            scrollable
            persistent
            >
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
                :disabled="!creditCardAvailable"
                >
                <slot>Charge Card</slot>
                </v-btn>
            </template>
            <v-card>
                <v-card-title class="headline">
                    <span>Charge Card</span>
                </v-card-title>
                <v-card-text >
                    <stripe-credit-card :card="creditCard" />
                    <v-form ref="form" class="pt-5" @submit.prevent>
                        <v-text-field
                            outlined
                            :label="`Amount to charge`"
                            :rules="[(value) => (value !== '' && value > 0) || 'Enter a valid amount']"
                            type="number"
                            :prefix="form.currency"
                            v-model="form.amount"
                        ></v-text-field>

                        <v-textarea
                        label="What charge is for"
                        no-resize
                        clearable
                        v-model="form.description"
                        counter="60"
                        outlined
                        height="100"
                        :rules="[(value) => (value != null && value != '') || 'Give reason for the charge', (value) => (!value || value.length <= 60) || 'Not more than 60 characters allowed' ]"
                        ></v-textarea>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" @click="dialog = false" text>Cancel</v-btn>
                    <v-btn @click.prevent="submit" color="primary" :loading="loading">Charge</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import ConfirmationDialog from '@/components/Utilities/ConfirmationDialog';
import StripeCreditCard from '../../../components/Utilities/StripeCreditCard';

import CREATE_RESERVATION_CHARGE from '../Mutations/createReservationCharge';

export default {
    name: "ReservationExtraCharge",
    components: {
        ConfirmationDialog,
        StripeCreditCard
    },
    props: {
        reservation: Object,
        creditCard: Object,
        user: Object,
        property: Object
    },

    data(){
        return {
            dialog: false,
            loading: false,
            form: {
                currency: 'USD',
                amount: null,
                description: null
            }
        }
    },

    computed: {
        creditCardAvailable(){
            return this.creditCard ? true : false
        }
    },

    methods: {
        submit(){

            if(!this.$refs.form.validate()){
                this.$store.commit('SNACKBAR', {
                    status: true,
                    text: "Can not perform charge",
                    color: "error"
                })
                return;
            }

            this.$refs.confirmation.open();
        },

        charge(){
            if(!this.creditCardAvailable) {
                this.$store.commit('SNACKBAR', {
                    status: true,
                    color: 'error',
                    text: `No credit card to charge`,
                })
                return;
            }
            this.loading = true;

             const variables = {
                    property_id: this.property.id,
                    amount: this.form.amount * 100,
                    currency: this.form.currency,
                    source: this.creditCard.id,
                    customer: this.creditCard.customer,
                    description: this.form.description,
                    capture: true,
                    metadata: {
                        user_id: this.user.id,
                        property_id: this.property.id,
                        reservation_id: this.reservation.id,
                    }
                }

                if(this.user.email){
                    variables.receipt_email = this.user.email
                }

                this.$store.dispatch('mutate', {
                    mutation: CREATE_RESERVATION_CHARGE,
                    variables
                })
                .then(response => {
                    const charge = response.data.createReservationCharge
                     this.$store.commit('SNACKBAR', {
                        status: true,
                        color: 'success',
                        text: `${charge.currency.toUpperCase()}${charge.amount/100} charged on card`
                    })
                    this.$refs.form.reset();
                    this.$emit('charged', charge)
                    this.dialog = false;
                })
                .catch(e => {
                    this.$store.commit('SNACKBAR', {
                        status: true,
                        color: 'error',
                        text: `Charge of ${this.form.currency}${this.form.amount} failed. ${e.message}`
                    })
                })
                .finally(() => {
                    this.loading = false;
                })
        },

    }
}
</script>