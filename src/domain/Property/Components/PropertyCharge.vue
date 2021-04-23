<template>
     <v-card >
        <v-card-title>
            <h1 class="headline">{{ data_charge.title }}</h1>
            <v-spacer></v-spacer>
            <v-icon @click="edit = !edit">mdi-pen</v-icon>
        </v-card-title>
        <v-card-text v-if="edit">
            <property-charge-form  :charge="data_charge" :disabled="$attrs.disabled" :property="property" @updated="chargeUpdated"  />
        </v-card-text>
    </v-card>
</template>

<script>
import PropertyChargeForm from './PropertyChargeForm';

export default {
    name: "PropertyCharge",
    props: {
        property: Object,
        charge: Object,
    },
    data(){
        return {
            edit: false,
            data_charge: {},
        }
    },
    components: {
        PropertyChargeForm
    },

    methods: {
        chargeUpdated(charge){
            this.data_charge = charge;
            this.edit = false;
        }
    },
    watch: {
        charge: {
            immediate: true,
            handler(charge){
                this.data_charge = charge
            }
        }
    }
}
</script>