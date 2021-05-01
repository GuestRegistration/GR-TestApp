<template>
<div>
    <confirmation-dialog ref="confirmation" @confirmed="refund">
        <div class="mt-5">
            <h4>Are you sure you want to refund {{ amountRefunding }} to guest ?</h4>
        </div>
    </confirmation-dialog>

    <v-dialog
        v-if="stripe_charge && stripe_charge.captured && !stripe_charge.refunded"
        v-model="dialog"
        width="400"
        scrollable
        persistent
        >
        <template v-slot:activator="{ on, attrs }">
            <slot name="activator">
                 <v-btn
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    :disabled="stripe_charge.net_captured <= 0"
                    >
                    Refund
            </v-btn>
            </slot>
           
        </template>
        <v-card>
            <v-card-title class="headline">
                <span>Refund charge</span>
            </v-card-title>
            <v-card-text >
                <h4 class="success--text">Ammount Received: {{ amountCharged }}</h4>
                <v-form ref="form" class="pt-5" @submit.prevent>
                    <v-text-field
                        outlined
                        :label="`Amount to refund for ${charge.title}`"
                        :rules="[(value) => value !== '' || 'Enter an amount', (value) => value <= (stripe_charge.net_captured/100) || `You cannot refund more than ${amountCharged}`]"
                        type="number"
                        :prefix="stripe_charge.currency.toUpperCase()"
                        v-model="form.amount"
                    ></v-text-field>

                    <v-select
                    :items="reasons"
                    item-text="title"
                    item-value="value"
                    label="Reason"
                    v-model="form.reason"
                    outlined
                    clearable
                    ></v-select>

                    <v-textarea
                        label="Guest note"
                        no-resize
                        clearable
                        v-model="form.customer_note"
                        counter="60"
                        outlined
                        height="100"
                        :rules="[(value) => (!value || value.length <= 60) || 'Not more than 60 characters allowed' ]"
                        ></v-textarea>

                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" @click="dialog = false" text>Cancel</v-btn>
                <v-btn @click.prevent="submit" color="primary" :loading="loading">Refund</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</div>
</template>

<script>
import { mapActions } from 'vuex';
import ConfirmationDialog from '@/components/Utilities/ConfirmationDialog';
import REFUND_RESERVATION_CHARGE from '../Mutations/refundReservationCharge';

export default {
    name: "ReservationChargeRefund",
    components: { 
        ConfirmationDialog
    },
    props: {
        property: Object,
        reservation: Object,
        charge:Object,
        payment: Object
    },

    data(){
        return {
            dialog: false,
            loading: false,
            form: {
                amount: 0,
                reason: null,
                customer_note: null
            },
            reasons: [
                {
                    title: 'Duplicate transaction',
                    value: 'duplicate'
                },
                {
                    title: 'Fraudulent transaction',
                    value: 'fraudulent'
                },
                {
                    title: 'Requested by guest',
                    value: 'requested_by_customer'
                },

            ],
            stripe_charge: null
        }
    },

    computed: {

        amountCharged(){
            return `${this.stripe_charge.currency.toUpperCase()}${(this.stripe_charge.net_captured/100)}`
        },

        amountRefunding(){
            return `${this.stripe_charge.currency.toUpperCase()}${(this.form.amount)}`
        },

    },

    methods: {
        ...mapActions([
            'mutate'
        ]),

        submit(){
            if(!this.$refs.form.validate()){
                this.$store.commit('SNACKBAR', {
                    status: true,
                    text: "Cannot refund charge",
                    color: "red"
                })
                return;
            }
            this.$refs.confirmation.open();
        },

        refund(){
            this.loading = true;
            this.mutate({
                mutation: REFUND_RESERVATION_CHARGE,
                variables: {
                    property_id: this.property.id,
                    charge_id: this.stripe_charge.id,
                    amount: this.form.amount*100,
                    reason: this.form.reason,
                    customer_note: this.form.customer_note
                }
            })
            .then(response => {
                const refund = response.data.refundReservationCharge;
                if(refund){
                    this.$store.commit('SNACKBAR', {
                        status: true,
                        text: `${refund.currency.toUpperCase()}${refund.amount/100} for ${this.charge.title} refunded`,
                        color: "success"
                    })
                    this.stripe_charge = refund.charge;
                    this.$emit('refunded', refund)
                    this.dialog = false;
                }else{
                    this.$store.commit('SNACKBAR', {
                        status: true,
                        text: `${this.amountRefunding} not refunded yet.`,
                        color: "info"
                    })
                }
            })
            .catch(e => {
                this.$store.commit('SNACKBAR', {
                    status: true,
                    text: `Refund of ${this.amountRefunding} for ${this.charge.title} failed. ${e.message}`,
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
                this.stripe_charge = payment;
                this.form = {
                    amount: (payment.amount_captured - payment.amount_refunded)/100,
                    reason: null,
                    customer_note: null
                }
            }
        }
    }
}
</script>