<template>
    <div>
        <slot name="heading" />
        <data-container :loading="loading">
            <template v-slot:loading>
                <div  v-for="i in 4" :key="i">
                    <v-skeleton-loader
                        type="card"
                        height="50"
                        class="my-2"
                    ></v-skeleton-loader>
                </div>
            </template>
            <div class="d-flex justify-end">
                <v-btn color="primary"  icon title="New charge" @click="createNewCharge = true"><v-icon dark> mdi-plus</v-icon> </v-btn>
            </div>
            <v-card v-if="createNewCharge" class="my-1">
                <v-card-title>
                    <h2 class="headline">New charge</h2>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="createNewCharge = false"><v-icon>mdi-close</v-icon> </v-btn>
                </v-card-title>
                <v-card-text>
                    <property-charge-form class="my-2" :disabled="!stripeConnected" :property="property"  @created="chargeCreated"  />
                </v-card-text>
            </v-card>
            <template v-if="charges.length">
                <property-charge v-for="charge in charges" :key="charge.id" :property="property" :charge="charge" :disabled="!stripeConnected" class="my-1" />
            </template>
            <template v-else>
                <div class="py-5 text-center">
                    <p class="grey--text">No charge yet</p>
                </div>
                 <template v-if="!createNewCharge">
                    <div class="text-center">
                        <v-btn color="primary" @click="createSecurityDeposit = !createSecurityDeposit" class="my-1">Set security deposit</v-btn>
                    </div>
                    <v-card v-if="createSecurityDeposit"  class="my-1">
                        <v-card-text>
                            <p>Set security deposit charge</p>
                            <h1 class="headline">Create Security deposit</h1>
                            <property-charge-form class="mt-2" :property="property" :prefill="security_deposit.form" :read-only="security_deposit.read_only" :title="security_deposit.form.title" @created="chargeCreated"  />
                        </v-card-text>
                    </v-card>
                </template>
            </template>
           

        </data-container>
    </div>

</template>
<script>
import DataContainer from '../../../components/DataContainer.vue';
import PropertyChargeForm from '../Components/PropertyChargeForm.vue';
import PropertyCharge from '../Components/PropertyCharge.vue';
import GET_PROPERTY_CHARGES from '../Queries/getPropertyCharges';

export default {
    name: "PropertyCharges",
    components: {
        DataContainer,
        PropertyChargeForm,
        PropertyCharge
    },

    props: {
        property: Object
    },

    data(){
        return {
            loading: false,
            stripe_authorization: null,
            createSecurityDeposit: false,
            createNewCharge: false,
            security_deposit: {
                form: {
                    title: 'Security Deposit',
                    description: 'Initial security deposit to be paid at checkin in',
                    enable: false,
                    amount: 100,
                    type: 'Instant',
                },
                read_only: [
                    'title'
                ]
            },
            charges: [],
        }
    },  

    computed: {
        stripeConnected(){
            return this.property.stripe_connected
        }
    },

    methods: {
        getPropertyCharges(){
            this.loading = true;
           
             this.$store.dispatch('query', {
                query: GET_PROPERTY_CHARGES,
                variables: {
                    property_id: this.property.id
                }
            })
            .then(response => {
                this.charges = response.data.getPropertyCharges
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    retry: () =>  this.getPropertyCharges(),
                    message: 'Could not get property charges ',
                    exception: e
                })
            })
            .finally(() => {
                this.loading = false;
            })
        },

        chargeCreated(charge){
            this.charges.unshift(charge);
            this.createNewCharge = false;
        }

    },

    watch: {
        property: {
            immediate: true,
            handler(property){
                if(property) this.getPropertyCharges()
                else this.loading = true;
            }
        }
    }
}
</script>