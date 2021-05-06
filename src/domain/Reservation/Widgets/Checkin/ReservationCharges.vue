<template>
    <data-container :loading="loading">
        <template v-slot:loading>
            <div  v-for="i in 4" :key="i">
                <v-skeleton-loader
                    type="heading"
                    class="my-2"
                ></v-skeleton-loader>
                <v-skeleton-loader
                    type="card, button"
                    height="60"
                    class="my-2"
                ></v-skeleton-loader>
                <v-divider></v-divider>
            </div>
        </template>
        <div v-if="charges && charges.length">
            <div v-for="charge in charges" :key="charge.id" >
                <reservation-charge 
                :charge="charge"  
                :payment="payments.find(p => p.metadata.charge_id === charge.id)" 
                :reservation="reservation"
                :property="property"
                :credit-card="creditCard"
                @payment="paymentMade"
                :can-pay="canPay"
                 >
                    <template v-slot:options="props">
                        <slot name="options" v-bind="props" />
                    </template>
                    <template v-slot:default="props">
                        <slot v-bind="props" />
                    </template>
                </reservation-charge>
                <v-divider></v-divider>
            </div>
        </div>
        <div v-else class="text-center text--gray py-5">
            No charge for the reservation
        </div>
    </data-container>
</template>

<script>
import DataContainer from '../../../../components/DataContainer.vue';
import ReservationCharge from '../../Components/ReservationCharge.vue';
import GET_RESERVATION_PAYMENTS from '../../Queries/getReservationPayments';

export default {
    name: "ReservationCharges",
    components:{
        DataContainer,
        ReservationCharge
    },
    data(){
        return {
            loading: false,
            charges: [],
            charge: null,
            currency: 'USD',
            payments: []
        }
    },

    computed: {

    },

    props: {
        reservation: Object,
        property: Object,
        refresh: Boolean,
        creditCard: Object,
        canPay: Boolean
    },
    methods: {
        getCharges(){
            this.loading = true;
             this.charges = this.reservation.charges
            // Get payments for the reservation
            return  this.$store.dispatch('query', {
                query: GET_RESERVATION_PAYMENTS,
                variables: {
                    id: this.reservation.id
                }
            })
            .then(response => {
                this.payments = response.data.getReservationPayments;
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    message: `Could not get charges.`,
                    retry: () => this.getCharges(),
                    exception: e
                });
            })
            .finally(() => {
                this.loading = false;
            })
        },

        paymentMade(payment){
            this.payments.push(payment)
        },

        getPaidCharges(){
            const paidCharges = this.charges.map(charge => {
                return {
                    ...charge,
                    payment: this.payments.find(p => p.metadata.charge_id == charge.id)
                }
            })

            this.$emit('charges-payment', paidCharges)
        }
    },

    watch: {
        reservation: {
            immediate: true,
            handler(){
                this.getCharges()
            }
        },
        payments: {
            immediate: true,
            handler(){
                this.getPaidCharges();
            }
        },
        refresh: {
            handler(refresh){
                if(refresh) this.getCharges()
            }
        }
    }
}
</script>