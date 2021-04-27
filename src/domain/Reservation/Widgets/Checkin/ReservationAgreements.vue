<template>
    <div>
        <div v-if="agreements.length">
            <v-checkbox v-for="(agreement, i) in agreements" :key="i" :value="agreement" v-model="agreed">
                <template v-slot:label>
                    <div>
                        {{ agreement.agreement }}
                        <v-tooltip v-if="agreement.link && agreement.link !== ''" bottom>
                            <template v-slot:activator="{ on }">
                                <a
                                    target="_blank"
                                    :href="agreement.link"
                                    @click.stop
                                    v-on="on"
                                >
                                    Read agreement
                                </a>
                            </template>
                            Opens in new window
                        </v-tooltip>
                    </div>
                </template>
            </v-checkbox>
        </div>
        <div v-else class="grey--text py-5 text-center">
            No agreement for the reservation
        </div>
    </div>
</template>

<script>
export default {
    name: "ReservationAgreements",
    data(){
        return {
            agreed: [],
        }
    },
    props: {
       agreements: Array
    },
    watch: {
        agreed: {
            immediate: true,
            handler(agreed){
                this.$emit('agreement', agreed)
            }
        }
    }
}
</script>