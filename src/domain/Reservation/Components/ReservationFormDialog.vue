<template>
    <v-dialog 
    v-model="dialog"
    fullscreen
      hide-overlay
      transition="dialog-bottom-transition"    
      >
        <v-form ref="form" @submit.prevent>
            <v-card>
                <v-toolbar
                    dark
                    color="primary"
                >
                    <v-btn
                    icon
                    dark
                    @click="close"
                    >
                    <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title><span v-if="property">{{ property.name }} - </span>{{ mode == 'edit' ? 'Update Reservation' : 'Create Reservation' }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn
                            dark
                            text
                            @click.prevent="submit"
                            :loading="loading"
                        >
                            Save
                        </v-btn>
                    </v-toolbar-items>
                </v-toolbar>

                <v-container>
                    <v-row justify="center">
                        <v-col cols="12" md="8">
                            <v-text-field
                                outlined
                                label="Guest name"
                                :rules="[rules.required]"
                                type="text"
                                name="name"
                                v-model="form.name"
                            ></v-text-field>

                            <v-text-field
                                outlined
                                label="Booking Number"
                                type="text"
                                name="booking_no"
                                v-model="form.booking_no"
                                :disabled="mode == 'edit'"
                            ></v-text-field>

                            <v-row justify="center" >
                                <v-col cols="12" md="6">
                                    <div>
                                        <label for="checkin-date">Checkin date</label>
                                    </div>
                                    <v-date-picker full-width id="checkin-date" v-model="form.checkin_date" :min="today"></v-date-picker>
                                </v-col>
                                <v-col  cols="12" md="6">
                                    <div>
                                        <label for="checkout-date">Checkout date</label>
                                    </div>
                                    <v-date-picker full-width id="checkout-date" v-model="form.checkout_date" :min="form.checkin_date ? form.checkin_date : today"></v-date-picker>
                                </v-col>
                            </v-row>
                            <div class="text-right  my-2">
                                <v-btn color="primary" small @click="selectInstructionTemplate = !selectInstructionTemplate"><v-icon>mdi-content-copy</v-icon> Copy instruction from template</v-btn>
                            </div>
                            <property-checkin-instruction-template-select :class="{'d-none' : !selectInstructionTemplate }" 
                            :property="property"
                            label="Select instruction to copy" 
                            outlined return-object clearable
                            v-model="instructionTemplate"
                            @change="instructionTemplateSelected"
                            />

                            <v-textarea
                            outlined
                            label="Reservation instructions"
                            v-model="form.instruction"
                            :rules="[rules.required]"
                            ></v-textarea>

                            <h4>Charges</h4>
                            <template v-if="form.charges && form.charges.length">
                                <v-list>
                                    <v-list-item v-for="(charge, i) in form.charges" :key="i">
                                        <v-list-item-icon>
                                            <v-icon>mdi-credit-card</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                {{ charge.title }} <span v-show="charge.optional" class="text-italic">(optional)</span>
                                            </v-list-item-title>
                                            <v-list-item-subtitle>
                                                USD{{ charge.amount }}, {{ charge.type }}
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </template>
                            <template v-else>
                                <p class="grey--text py-3">No charge</p>
                            </template>

                            <property-charges-select 
                                v-if="!reservationCheckedIn"
                                outlined
                                label="Charges on checkin"
                                v-model="form.charges"
                                :property="property"
                                multiple
                                return-object
                            />

                            <h4>Agreements</h4>
                            <template v-if="form.agreements && form.agreements.length">
                                <v-list>
                                    <v-list-item v-for="(agreement, i) in form.agreements" :key="i">
                                         <v-list-item-icon>
                                            <v-icon>mdi-handshake</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                {{ agreement.agreement }}
                                            </v-list-item-title>
                                            <v-list-item-subtitle v-if="agreement.link && agreement.link !== ''">
                                                 <a :href="agreement.link" target="_blank">Read agreement</a>
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </template>
                            <template v-else>
                                <p class="grey--text py-3">No agreement</p>
                            </template>
                            <property-checkin-agreement-select 
                                v-if="!reservationCheckedIn"
                                outlined
                                label="Agreement for checkin"
                                v-model="form.agreements"
                                :property="property"
                                multiple
                                return-object
                            />

                            <h4>Questions</h4>
                            <template v-if="form.questions && form.questions.length">
                                <v-list>
                                    <v-list-item v-for="(question, i) in form.questions" :key="i">
                                         <v-list-item-icon>
                                            <v-icon>mdi-account-question</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                {{ question.question }} <span v-show="question.required" class="text-italic">(required)</span>
                                            </v-list-item-title>
                                            <v-list-item-subtitle v-if="question.options && question.options !== ''">
                                                {{ question.options }}
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </template>
                            <template v-else>
                                <p class="grey--text py-3">No checkin question</p>
                            </template>
                            <property-checkin-question-select 
                                v-if="!reservationCheckedIn"
                                outlined
                                label="Questions for checkin"
                                v-model="form.questions"
                                :property="property"
                                multiple
                                return-object
                            />

                           
                        </v-col>
                    </v-row>
                </v-container>

            </v-card>
        </v-form>
    </v-dialog>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import formValidation from '@/helper/formValidation';

import PropertyChargesSelect from '../../Property/Components/PropertyChargesSelect';
import PropertyCheckinInstructionTemplateSelect from '../../Property/Components/PropertyCheckinInstructionTemplateSelect';
import PropertyCheckinAgreementSelect from '../../Property/Components/PropertyCheckinAgreementSelect';
import PropertyCheckinQuestionSelect from '../../Property/Components/PropertyCheckinQuestionSelect';

import CREATE_RESERVATION from '../Mutations/createReservation';
import UPDATE_RESERVATION from '../Mutations/updateReservation';

export default {
    name: "ReservationFormDialog",
    components: {
        PropertyChargesSelect, PropertyCheckinInstructionTemplateSelect,
        PropertyCheckinAgreementSelect, PropertyCheckinQuestionSelect
    },

    data(){
        return {
            dialog: false,
            mode: 'create',
            loading: false,
            rules: formValidation.rules,
            form: {},
            selectInstructionTemplate: false,
            instructionTemplate: null,
        }
    },
    props: {
        property: Object,
        reservation: Object
    },

    computed: {
        ...mapGetters([
            'current_user'
        ]),
        today(){
            return new Date().toISOString().substr(0, 10);
        },

        reservationCheckedIn(){
            if(!this.reservation) return
            return this.reservation.already_checkedin
        }
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
            if(!this.reservation) this.$refs.form.reset()
        },

        submit(){
            
            if(this.$refs.form.validate()){
                if(this.mode === 'edit') this.updateReservation();
                else this.createReservation();
            }
        },

        createReservation(){
            this.loading = true;
            this.mutate({
                variables: {property_id: this.property.id, ...this.form},
                mutation: CREATE_RESERVATION
            })
            .then(response => {
                this.$emit('created', response.data.createReservation);
                this.$store.commit('SNACKBAR', {
                    status: true,
                    text: 'Reservation created',
                    color: 'success'
                })
                this.$refs.form.reset();
            })
            .catch(e => {
                this.TOAST_ERROR({
                    show: true,
                    retry: () => this.createReservation(),
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
                 this.$store.commit('SNACKBAR', {
                    status: true,
                    text: 'Reservation updated',
                    color: 'success'
                })
                this.$emit('updated', response.data.updateReservation);
            })
            .catch(e => {
                this.TOAST_ERROR({
                     show: true,
                    retry: () => this.updateReservation(),
                    message: 'Could not  update reservation. ',
                    exception: e
                 }) 
                this.$emit('error', e);
            })
            .finally(() => {
                this.loading = false;
            })
        },

        instructionTemplateSelected(template){
            if(!template) return;
            this.form.instruction = this.form.instruction ? `${this.form.instruction}\n${template.body}` : `${template.body}`;
            this.selectInstructionTemplate = false;
            this.instructionTemplate = null
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
                        booking_no: reservation.booking_no,
                        checkin_date: reservation.checkin_date,
                        checkout_date: reservation.checkout_date,
                        instruction: reservation.instruction,
                        charges: reservation.charges,
                        agreements: reservation.agreements,
                        questions: reservation.questions
                    }
                    
                }else{
                    this.form = {
                        name: null,
                        booking_no: null,
                        checkin_date: this.today,
                        checkout_date: this.today,
                        instruction: null,
                        charges: [] ,
                        agreements: [],
                        questions: []
                    }

                }
            }
        }
    }
}
</script>