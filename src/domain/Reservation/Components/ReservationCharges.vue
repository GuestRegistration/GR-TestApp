<template>
    <data-container :loading="loading">
        <div v-if="charges && charges.length">
            <div v-for="charge in charges" :key="charge.id" >
                <reservation-charge 
                :charge="charge"  
                :payments="payments" 
                :reservation="reservation"
                :stripe-auth="stripe_auth"
                @payment="paymentMade"
                 >
                 <template v-slot:default="attrs">
                    <slot v-bind="attrs" />
                 </template>
                </reservation-charge>
                <v-divider></v-divider>
            </div>
        </div>
        <div v-else>
            <p class="text--gray">No charge for the reservation</p>
        </div>
    </data-container>
</template>

<script>
import DataContainer from '../../../components/DataContainer.vue';
import ReservationCharge from './ReservationCharge.vue';
import GET_PROPERTY_STRIPE_AUTH from '../../Property/Queries/getPropertyStripeAuthorization';
import GET_RESERVATION_PAYMENTS from '../Queries/getReservationPayments';

export default {
    name: "ReservationCharges",
    components:{
        DataContainer,
        ReservationCharge
    },
    data(){
        return {
            loading: false,
            stripe_auth: null,
            charges: [],
            charge: null,
            currency: 'USD',
            payments: []
        }
    },

    computed: {
        property(){
            return this.reservation.property
        }

    },

    props: {
        reservation: Object,
        refresh: Boolean
    },
    methods: {
        getCharges(){
            this.loading = true;
             this.$store.dispatch('query', {
                query: GET_PROPERTY_STRIPE_AUTH,
                variables: {
                    property_id: this.reservation.property_id
                }
            })
            .then(response => {
                this.stripe_auth = response.data.getPropertyStripeAuthorization;
                this.charges = this.reservation.charges
                // Get payments for the reservation
                return  this.$store.dispatch('query', {
                    query: GET_RESERVATION_PAYMENTS,
                    variables: {
                        id: this.reservation.id
                    }
                })
            })
            .then(response => {
                this.payments = response.data.getReservationPayments;
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    message: `Could not get charges.`,
                    retry: () => {
                        return new Promise((resolve, reject) => {
                            this.getCharges();
                            resolve();
                        })
                    },
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