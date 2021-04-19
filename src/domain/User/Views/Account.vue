<template>
    <app-layer ref="app" >
        <template >
            <v-container>
                <v-row justify="center">

                    <!-- Profile -->
                    <v-col cols="12" md="6" id="profile">
                        <v-card outlined>
                            <v-card-title >
                                {{!update ? 'Create your profile' : 'Update profile'}}
                            </v-card-title>
                            <v-card-text>
                                <p v-if="!update">Secure your activity and validate your account</p>
                                <div class="my-5">
                                    <v-form ref="profile">
                                        <div class="my-3">
                                            <v-text-field outlined v-model="profile.first_name" label="First name" :rules="[rules.required]" hide-details="auto"></v-text-field>
                                        </div>
                                            <div class="my-3">  
                                            <v-text-field outlined v-model="profile.last_name" label="Last name" :rules="[rules.required]" hide-details="auto"></v-text-field>
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

                    <!-- credentials -->
                    <v-col cols="12" md="6" id="credentials">
                        <v-card outlined class="mt-2 mt-md-0">
                            <v-card-title>
                                Credentials
                            </v-card-title>
                            <v-card-text>
                                <account-connects @report="accountConnectReport" @auth-updated="syncAuthWithProfile" @notification="sendAccountPushNotification" />
                            </v-card-text>
                        </v-card>
                    </v-col>

                    
                </v-row>
                
            </v-container>
        </template>
    </app-layer>
</template>

<script>
    import { mapMutations, mapGetters, mapActions } from 'vuex'

    import formvalidation from '@/helper/formValidation'
    import AppLayer from '@/AppLayer';
    import AccountConnects from '../../Auth/Components/AccountConnects';
    // import Identities from '../Components/Identities';
    import UPDATE_USER from '../Mutations/updateUser';
    import CREATE_USER from '../Mutations/createUser';
    
    import PUSH_NOTIFICATION from '@/graphql/mutation/pushNotification'

    export default {
        name: "UserAccount",
        components: {
            AppLayer, AccountConnects,
            //Identities,
        },
        data(){
            return {
                loading: false,
                rules: formvalidation.rules,
                profile: {
                        id: null,
                        phone: null,
                        phone_country_code: null,
                        phone_number: null,
                        email: null,
                        first_name: null,
                        last_name: null,
                    }
            }
        },
        computed: {
            ...mapGetters([
                'app_ready',
                'current_user',
                'authenticated',
                'profile_loaded',
            ]),
            update(){
                return Object.keys(this.current_user.profile).length  ? true : false
            },
        },

        methods: {
             ...mapMutations([
                'SET_USER_PROFILE'
            ]),
            ...mapActions([
                'query',
                'mutate',
            ]),
        
            setProfile(){
                if(this.update){
                    this.profile = {
                        id: this.current_user.auth.uid,
                        phone: this.current_user.profile.phone || null,
                        phone_country_code: (this.current_user.profile.phone_meta ? this.current_user.profile.phone_meta.country_code : null) || null,
                        phone_number: (this.current_user.profile.phone_meta ? this.current_user.profile.phone_meta.phone_number : null) || null,
                        email: this.current_user.profile.email || null,
                        first_name: this.current_user.profile.name.first_name,
                        last_name: this.current_user.profile.name.last_name,
                    }
                }
                else{
                    this.profile.id = this.current_user.auth.uid;
                }
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
                    this.SET_USER_PROFILE(this.update ? response.data.updateUser : response.data.createUser);
                    this.setProfile();
                    this.$refs.app.alert('Profile updated', 'success');

                    if(this.$route.query.redirect){
                        this.$router.push({
                            path: this.$route.query.redirect
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
            },

            accountConnectReport({message, type}){
                this.$refs.app.alert(message, type);
            },

            syncAuthWithProfile(credentials){
                let profile = { ...this.profile, ...credentials};
                this.$refs.app.setState(false, 'Syncing with your profile...');
                this.mutate({
                    variables: profile,
                    mutation: UPDATE_USER,
                })
                .then(response  => {
                    this.SET_USER_PROFILE(response.data.updateUser);
                    this.setProfile();
                    this.$refs.app.alert('Profile synced', 'success');
                })
                .catch(e => {
                    this.$refs.app.toastError({
                        message: 'Failed.',
                        retry: () => {
                            this.syncProfileWithAuth()
                        },
                        exception: e
                    });
                })
                .finally(() => {
                    this.$refs.app.setState(true);
                });
            },

            sendAccountPushNotification(payload){
                this.mutate({
                    variables: {
                        user_id: this.current_user.auth.uid,
                        ...payload
                    },
                    mutation: PUSH_NOTIFICATION
                })
                .then(response => {
                    //console.log(response);
                })
                .catch(e => {
                    //console.log(e);
                })
            }
        },

        mounted(){
            this.setProfile()
        }

    }
</script>


