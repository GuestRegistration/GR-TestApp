<template>
    <app-layer ref="app" @ready="ready">
        <v-row justify="center mt-5">
            <v-col cols="12" md="4">
                <v-card outlined
                :loading="loading"
                v-if="requestEmail"
                >
                    <v-card-text>
                        <div class="text-center">
                            <p>Confirm your email</p>
                        </div>
                        <div class="my-5">
                            <v-form ref="emailVerification" >
                                <v-text-field outlined v-model="email" label="Email" :rules="[rules.required, rules.email]" hide-details="auto"></v-text-field>
                            </v-form>
                        </div>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn
                            text
                            dark color="accent-4"
                            class="primary"
                            block
                            @click="verify"
                            :loading="loading"
                        >
                            Verify
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </app-layer>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from 'vuex';
    import validation from '@/helper/formValidation';
    import firebase from '@/firebase';
    import AppLayer from '@/AppLayer';
    import UPDATE_USER from '../../User/Mutations/updateUser'

    export default {
        name: "EmailVerification",
        data(){
            return {
                rules: validation.rules,
                email: '',
                loading: false,
                requestEmail: false,
            }
        },
        components: {
            AppLayer
        },
        computed:{
            ...mapGetters([
                'app_ready',
                'current_user',
                'profile_loaded',
            ]),

            profile(){
                if(this.profile_loaded){
                    return {
                        id: this.current_user.auth.uid,
                        phone: this.current_user.profile.phone,
                        phone_country_code: this.current_user.profile.phone_meta.country_code,
                        phone_number: this.current_user.profile.phone_meta.phone_number,
                        email: this.email,                        
                        first_name: this.current_user.profile.name.first_name,
                        last_name: this.current_user.profile.name.last_name,
                    }
                }
                return {};
            },
        },
        methods: {
            ...mapMutations([
                'SET_USER_PROFILE',
            ]),
            ...mapActions([
                'mutate'
            ]),

            ready(){
                this.$refs.app.setState(true);
                if (firebase.auth.isSignInWithEmailLink(window.location.href)) {
                    this.email = window.localStorage.getItem('emailForConnect');
                    if (!this.email) {
                        this.requestEmail = true;
                    }else{
                        this.verify();
                    }
                }else{
                    this.$router.push({
                        name: 'profile'
                    })
                }
            },

            authenticate(){
                if(firebase.auth.currentUser){
                    let credential = firebase.firebase.auth.EmailAuthProvider.credentialWithLink(this.email, window.location.href);
                    return firebase.auth.currentUser.linkWithCredential(credential) 
                }
                 return firebase.auth.signInWithEmailLink(this.email, window.location.href);
            },

            verify(){
                this.loading = true;
                this.authenticate()
                .then(credential => {
                    this.$refs.app.alert('Email address connected successfully', 'success');
                    this.syncEmailWithProfile();
                })
                .catch(e => {
                    this.$refs.app.alert(`Failed: ${e.message}`, 'error');
                })
                .finally(() => {
                    this.loading = false;
                })
            },
           
            verifyEmail(){
                if(this.$refs.EmailVerification.validate()){
                    this.verify();
                }
            },

             syncEmailWithProfile(){
                this.$refs.app.setState(false, 'Syncing email with your profile...');
                this.mutate({
                    variables: this.profile,
                    mutation: UPDATE_USER,
                })
                .then(response  => {
                    this.SET_USER_PROFILE(response.data.updateUser);
                    this.$refs.app.alert('Profile synced', 'success');
                    this.$router.push({
                        name: 'account'
                    })
                    window.localStorage.removeItem('emailForConnect');
                })
                .catch(e => {
                    this.$refs.app.toastError({
                        message: 'Failed.',
                        retry: () => this.syncEmailWithProfile(),
                        exception: e
                    });
                })
                .finally(() => {
                    this.$refs.app.setState(true);
                });
            }
        },

        mounted(){
            this.$refs.app.setState(false);
        }
    }
</script>


