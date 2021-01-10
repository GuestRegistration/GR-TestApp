<template>
    <v-dialog 
    v-model="dialog"
    scrollable  
    max-width="650px"
    >
        <v-form ref="form" @submit.prevent>
            <v-card>
                <v-card-title>
                    <span class="headline">{{ mode == 'edit' ? 'Update Reservation' : 'Create Reservation' }}</span>
                </v-card-title>
                <v-card-subtitle>{{ property.name }}</v-card-subtitle>
                <v-divider></v-divider>
                <v-card-text>
                    <v-text-field
                        outlined
                        label="Guest name"
                        :rules="[rules.required]"
                        type="text"
                        name="name"
                        v-model="form.name"
                    ></v-text-field>

                    <v-row justify="center">
                        <v-col cols="12" md="6">
                            <div>
                                <label for="checkin-date">Checkin date</label>
                            </div>
                            <v-date-picker id="checkin-date" v-model="form.checkin_date"></v-date-picker>
                        </v-col>
                        <v-col  cols="12" md="6">
                            <div>
                                <label for="checkout-date">Checkout date</label>
                            </div>
                            <v-date-picker id="checkout-date" v-model="form.checkout_date" :min="form.checkin_date"></v-date-picker>
                        </v-col>
                    </v-row>
                  
                    <v-textarea
                    outlined
                    label="Reservation instructions"
                    v-model="form.instruction"
                    ></v-textarea>
                </v-card-text>
                <v-card-actions>
                    <v-btn type="button" @click.prevent="submit" color="primary" large :loading="loading">Submit</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import formValidation from '@/helper/formValidation';

import CREATE_RESERVATION from '../Mutations/createReservation';
import UPDATE_RESERVATION from '../Mutations/updateReservation';

export default {
    name: "PropertyFormDialog",
    data(){
        return {
            dialog: false,
            mode: 'create',
            loading: false,
            rules: formValidation.rules,
            form: {},
        }
    },
    props: {
        property: Object,
        reservation: Object
    },

    computed: {
        ...mapGetters([
            'current_user'
        ])
    },

    methods: {

        ...mapActions([
            'query',
            'mutate'
        ]),
        ...mapMutations([
            'TOAST_ERROR'
        ]),

        open(){
            this.dialog = true;
        },
        close(){
            this.dialog = false;
        },

        submit(){
            
            if(this.$refs.form.validate()){
                if(this.mode == 'edit') this.updateProperty();
                else this.createReservation();
            }
        },

        createReservation(){
            this.loading = true;
            this.mutate({
                variables: {property_id: this.current_user.property.id, ...this.form},
                mutation: CREATE_RESERVATION
            })
            .then(response => {
                this.$emit('success', response.data.createReservation);
                this.$refs.form.reset();
            })
            .catch(e => {
                this.TOAST_ERROR({
                    show: true,
                    retry: () => {
                        return new Promise((resolve, reject) => {
                            this.createReservation();
                        })
                    },
                    message: 'Could not create reservation. ',
                    exception: e
                });
                this.$emit('error', e);
            })
            .finally(() => {
                this.loading = false;
            })
        },

        updateReservation(){
            this.loading = true;
            this.mutate({
                variables: this.form,
                mutation: UPDATE_RESERVATION
            })
            .then(response => {
                //console.log(response);
                this.$emit('success', response.data.updateReservation);
            })
            .catch(e => {
                
                this.$emit('error', e);
            })
            .finally(() => {
                this.loading = true;
            })
        }
    },

    watch: {
        reservation: {
            immediate: true,
            handler(reservation){
                if(reservation){
                    this.mode = 'edit';
                    this.form = {
                        id: reservation.id,
                        name: reservation.name, 
                        checkin_date: reservation.checkin_date,
                        checkout_date: reservation.checkout_date,
                        instruction: reservation.instruction,
                    }
                    
                }else{
                    this.form = {
                        name: null,
                        checkin_date: null,
                        checkout_date: null,
                        instruction: null 
                    }

                }
            }
        }
    }
}
</script>