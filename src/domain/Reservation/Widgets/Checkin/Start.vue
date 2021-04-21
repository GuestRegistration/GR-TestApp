<template>
    <data-container :loading="loading">
        <div v-if="property.terms">
            <p>Please read carefully the terms and condition for {{ property.name }} <a :href="property.terms" target="_blank">here</a></p>
            <div class="my-5">
                <v-checkbox v-model="accepted" label="I have read and accepted the terms and condition`"></v-checkbox>
            </div>
            <div class="my-5">
                <v-btn
                    text
                    dark color="accent-4"
                    class="primary"
                    block
                    @click="checkin"
                    id="sign-in-button"
                >
                    Continue
                </v-btn>
            </div>
        </div>

        <div v-else>
            <p>There are no terms and conditions for {{ property.name }} yet</p>
            <div class="my-5">
                <v-btn
                    text
                    dark color="accent-4"
                    class="primary"
                    block
                    @click="checkin"
                    id="sign-in-button"
                >
                    Continue
                </v-btn>
            </div>
        </div>      
    </data-container>     
</template>

<script>
import { mapActions } from 'vuex';
    import DataContainer from '../../../../components/DataContainer.vue';
    import CHECKIN_RESERVATION from '../../Mutations/checkinReservation';

    export default {
        name: "CheckinStart",
        components: { DataContainer },
        data(){
            return {
                accepted: false,
                loading: false,
            }
        },
        props: {
            property: Object,
            reservation: Object
        },
        methods:{
            ...mapActions([
                'mutate'
            ]),
            checkin(){
                if(this.accepted){
                    this.loading = true;
                    this.mutate({
                        mutation: CHECKIN_RESERVATION,
                        variables: {
                            reservation_id: this.reservation.id,
                            accepted_tnc: this.accepted
                        }
                    })
                    .then(response => {
                        if(response.data.checkinReservation){
                            const reservation = response.data.checkinReservation;
                            this.$store.commit('ADD_USER_RESERVATION', {...reservation});
                            this.$emit('started', reservation)
                        }else{
                            this.$store.commit('SNACKBAR', {
                                status: true,
                                text: 'Checkin could not start. Try again',
                                color: 'red'
                            })
                        }
                    })
                    .catch(e => {
                        this.$store.commit('TOAST_ERROR', {
                            show: true,
                            message: `Something went wrong while starting your checkin process.`,
                            retry: () => {
                                return new Promise((resolve, reject) => {
                                    this.reservationCheckin();
                                    resolve()
                                })
                                
                            },
                            exception: e
                        })
                    })
                    .finally(() => {
                        this.loading = false;
                    })
                }else{
                    this.$store.commit('SNACKBAR', {
                        status: true,
                        text: 'You need to agree to the terms',
                        color: 'red'
                    })
                }
            },
        },
        watch: {
            reservation: {
                immediate: true,
                handler(reservation){
                    if(reservation.already_checkedin){
                        this.$emit('started', reservation)
                    }
                }
            }
        }

    }
</script>

<style scoped>

</style>

