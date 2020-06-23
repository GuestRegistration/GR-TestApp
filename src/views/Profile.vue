<template>
    <app-layer ref="app" >
        <template >
            <v-container>
                <v-row justify="center">
                    <v-col cols="12" md="6">
                        <div class="my-3">
                            <h2 class="text-center">{{!update ? 'Create your profile' : 'Update profile'}}</h2>
                        </div>
                        <v-card outlined>
                            <v-card-text>
                                <p v-if="!update">Secure your activity and validate your account</p>
                                <div class="my-5">
                                    <v-form ref="profile">
                                        <div class="my-3">
                                            <label>Phone: {{profile.phone}}</label>
                                            <!-- <v-icon @click="change_phone  = !change_phone">edit</v-icon> -->
                                             <vue-tel-input v-if="change_phone" 
                                                :valid-characters-only="true"
                                                 @input="onPhoneInput"
                                            ></vue-tel-input>
                                        </div>
                                        <div class="my-3">
                                            <v-text-field outlined v-model="profile.first_name" label="First name" :rules="[rules.required]" hide-details="auto"></v-text-field>
                                        </div>
                                            <div class="my-3">  
                                            <v-text-field outlined v-model="profile.last_name" label="Last name" :rules="[rules.required]" hide-details="auto"></v-text-field>
                                        </div>
                                        <div class="my-3">
                                           
                                            <!-- <v-text-field v-model="profile.phone" label="Phone" :rules="[rules.required]" hide-details="auto" disabled=""></v-text-field> -->
                                        </div>
                                        <div class="my-3">
                                            <v-text-field outlined v-model="profile.email" label="Email" :rules="[rules.required]" hide-details="auto"></v-text-field>
                                        </div>
                                        <div class="my-5">
                                            <v-btn
                                                text
                                                dark color="accent-4"
                                                class="primary"
                                                @click="submit"
                                                id="sign-in-button"
                                                :loading="loading"
                                            >
                                                Save
                                            </v-btn>
                                        </div>
                                    </v-form>
                                </div>
                            </v-card-text>
                        </v-card>
                        <div class="mt-5" v-if="!update">
                            <p class="grey--text">By creating an account, you agree to our <a href="#">Terms of service</a> and <a href="#">Privacy policy</a></p>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </template>
    </app-layer>
</template>

<script>
    import UPDATE_USER from './../graphql/mutation/update_user'
    import CREATE_USER from './../graphql/mutation/create_user'
    import form_validation from './../helper/form_validation'
    import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
    import AppLayer from './../AppLayer';
    import { VueTelInput } from 'vue-tel-input';

    export default {
        name: "ProfileUpdate",
        components: {
            AppLayer, VueTelInput
        },
        data(){
            return {
                loading: false,
                rules: form_validation.rules,
                change_phone: false,
                newPhone: null
            }
        },
        computed: {
            ...mapGetters([
                'current_user',
                'authenticated',
                'profile_loaded',
            ]),
            update(){
                return Object.keys(this.current_user.profile).length  ? true : false
            },

            profile(){
                 const profile = {
                     id: this.current_user.auth.uid,
                     phone: this.newPhone ? this.newPhone.number.international : this.current_user.auth.phoneNumber,
                     phone_country_code: null,
                     phone_number: null,
                 }
                 return this.profile_loaded ?
                  {
                   ...profile,
                    email: this.current_user.profile.email,
                    first_name: this.current_user.profile.name.first_name,
                    last_name: this.current_user.profile.name.last_name
                 } : profile
            },
        },

        mounted(){
            this.$refs.app.setState(true);
        },
        methods: {
             ...mapMutations([
                'SET_CURRENT_USER'
            ]),
            ...mapActions([
                'query',
                'mutate',
            ]),
            
            onPhoneInput(formattedNumber, { number, valid, country }) {
               this.newPhone = { number, valid, country };
            },

            submit(){
                 if(this.$refs.profile.validate()){
                     this.createProfile();
                 }
            },

            createProfile(){
                if(this.newPhone && !this.newPhone.valid){
                    this.$refs.app.alert('Invalid phone number', 'red');
                    return;
                }
                this.loading = true;
                this.mutate({
                    variables: this.profile,
                    mutation: this.update ? UPDATE_USER : CREATE_USER,
                })
                .then(response  => {
                    let user = this.current_user
                    user.profile = this.update ? response.data.updateUser : response.data.createUser 
                    this.SET_CURRENT_USER(user);

                    this.$refs.app.alert('Profile updated', 'success');

                    if(this.$route.query.redirect){
                        this.$router.push({
                            path: this.redirect
                        })
                    }
                })
                .catch(e => {
                    this.$refs.app.toastError({
                        message: 'Failed.',
                        retry: () => {
                            this.createProfile()
                        },
                        exception: e
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
            }
        },
    }
</script>


