<template>
<div>
    <confirmation-dialog ref="confirmation" @confirmed="capture">
        <div class="mt-5">
            <h4>Are you sure you want to capture {{ amountCapturing }} from this authorization ?</h4>
            <v-alert
            class="mt-4"
            v-if="refund > 0"
            border="left"
            colored-border
            elevation="2"
            type="warning"
            >
                {{ `${payment.currency.toUpperCase()} ${(refund/100)}` }} will be refunded
            </v-alert>
        </div>
    </confirmation-dialog>

    <v-dialog
        v-if="!payment.captured"
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
            >
            Capture charge
            </v-btn>
        </template>
        <v-card>
            <v-card-title class="headline">
                <span>Capture authorized charge</span>
            </v-card-title>
            <v-card-text >
                <h4 class="grey--text">Ammount Authorized: {{ amountAuthorized }}</h4>
                <v-form ref="form" class="pt-5" @submit.prevent>
                    <v-text-field
                        outlined
                        :label="`Amount to capture for ${charge.title}`"
                        :rules="[(value) => value !== '' || 'Enter an amount', (value) => value <= (payment.amount/100) || `You cannot capture more than ${amountAuthorized}`]"
                        type="number"
                        :prefix="payment.currency.toUpperCase()"
                        v-model="amount"
                    ></v-text-field>
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
import { mapActions } from 'vuex';
import ConfirmationDialog from '@/components/Utilities/ConfirmationDialog';
import CAPTURE_RESERVATION_CHARGE from '../Mutations/captureReservationCharge';

export default {
    name: "ReservationChargeCapture",
    components: { 
        ConfirmationDialog
    },
    props: {
        stripeAuth: Object,
        reservation: Object,
        charge:Object,
        payment: Object
    },

    data(){
        return {
            dialog: false,
            loading: false,
            amount: 0
        }
    },

    computed: {
        amountAuthorized(){
            if(!this.payment) return 0;
            return `${this.payment.currency.toUpperCase()} ${(this.payment.amount/100)}`
        },

        amountCapturing(){
            return `${this.payment.currency.toUpperCase()} ${(this.amount)}`
        },

        refund(){
            if(!this.payment) return 0;
            return this.payment.amount - this.amount*100
        }
    },

    methods: {
        ...mapActions([
            'mutate'
        ]),

        submit(){
            if(!this.$refs.form.validate()){
                this.$store.commit('SNACKBAR', {
                    status: true,
                    text: "Cannot capture charge",
                    color: "red"
                })
                return;
            }
            this.$refs.confirmation.open();
        },

        capture(){
            this.loading = true;
            this.mutate({
                mutation: CAPTURE_RESERVATION_CHARGE,
                variables: {
                    stripe_account: this.stripeAuth.stripe_user_id,
                    charge_id: this.payment.id,
                    amount: this.amount*100
                }
            })
            .then(response => {
                const payment = response.data.captureReservationCharge;
                if(payment.captured){
                    this.$store.commit('SNACKBAR', {
                        status: true,
                        text: `Captured ${payment.currency.toUpperCase()} ${payment.amount_captured/100} for ${this.charge.title}`,
                        color: "success"
                    })
                    this.$emit('captured', payment)
                    this.dialog = false;
                }else{
                    this.$store.commit('SNACKBAR', {
                        status: true,
                        text: `${this.amountCapturing} not captured yet`,
                        color: "info"
                    })
                }
            })
            .catch(e => {
                this.$store.commit('SNACKBAR', {
                    status: true,
                    text: `Capturing of ${this.amountCapturing} for ${this.charge.title} failed. ${e.message}`,
                    color: "error"
                })
            })
            .finally(() => {
                this.loading = false
            })
        }
    },
    watch: {
        payment: {
            immediate: true,
            handler(payment){
                this.amount = payment.amount/100
            }
        }
    }
}
</script>