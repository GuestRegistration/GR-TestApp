<template>
    <app-layer ref="app">
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
    import validation from '@/helper/formValidation';
    import firebase from '@/firebase';
    import AppLayer from '@/AppLayer';
    import UPDATE_USER from '../../User/Mutations/updateUser'
    import profile from '../../User/Mixins/profile';

    export default {
        name: "EmailVerification",
        mixins: [profile],

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

            googleProvider(){
                if(!this.current_user.auth.providerData) return null;
                return this.current_user.auth.providerData.find(provider => provider.providerId == 'google.com');
            },

            emailProvider(){
                if(!this.current_user.auth.providerData) return null;
                return this.current_user.auth.providerData.find(provider => provider.providerId == 'password');
            },

            returnPath(){
                return this.$router.resolve({name: this.$route.name, query: this.$route.query }).route.fullPath
            }
        },
        methods: {
            verify(){
                this.loading = true;

                const credential = firebase.firebase.auth.EmailAuthProvider.credentialWithLink(this.email, window.location.href);
                firebase.auth.currentUser.linkWithCredential(credential)
                .then(credential => {
                    if(this.googleProvider){
                        return  firebase.auth.currentUser.unlink(this.googleProvider.providerId)
                    }
                    return Promise.resolve();
                })
                .then(() => {
                    this.$store.commit("SNACKBAR", {
                        status: true,
                        text: `Email address connected successfully`,
                        color: 'success'
                    })
                    this.syncAuthWithProfile({ email: this.email });
                    this.$router.push({
                        name: 'account',
                        params: {
                            tab: 'authentication'
                        }
                    })
                })
                .catch(e => {
                    this.$store.commit("SNACKBAR", {
                        status: true,
                        text: `Failed: ${e.message}`,
                        color: 'error'
                    })
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

        },

        watch: {
            app_ready: {
                immediate: true,
                handler(ready){
                    if(!ready) return;

                    if(!firebase.auth.currentUser)
                    {
                        this.$router.push({
                            name: 'signin',
                            query: {
                                redirect: this.returnPath
                            }
                        })
                        return;
                    }

                    if(firebase.auth.isSignInWithEmailLink(window.location.href)) {
                        this.email = window.localStorage.getItem('emailForConnect');
                        if (!this.email) {
                            this.requestEmail = true;
                        }else{
                            this.verify();
                        }
                    }else{
                        this.$router.push({
                            name: 'account',
                            params: {
                                tab: 'authentication'
                            }
                        })
                    }
                }
            }
        }
    }
</script>


