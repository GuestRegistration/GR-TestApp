<template>
    <div>
        <!-- if there is any report -->
        <template  v-if="report">
            <Report :_message="report" @close="report = null" />
        </template>
        <template v-if="!app_ready">
            <Wait />
        </template>         
        
        <template v-else>
            <v-container>
                <v-row justify="center">
                    <v-col cols="12" md="6">
                        <div class="my-3">
                            <h2 class="text-center">{{!update ? 'Create your profile' : 'Update profile'}}</h2>
                        </div>
                        <v-card outlined
                        :loading="processing"
                        >
                            <v-card-text>
                                <p v-if="!update">Secure your activity and validate your account</p>
                                <div class="my-5">
                                    <v-form ref="profile" >
                                        <div class="my-3">
                                            <v-text-field v-model="profile.first_name" label="First name" :rules="[rules.required]" hide-details="auto"></v-text-field>
                                        </div>
                                            <div class="my-3">  
                                            <v-text-field v-model="profile.last_name" label="Last name" :rules="[rules.required]" hide-details="auto"></v-text-field>
                                        </div>
                                        <div class="my-3">
                                            <v-text-field v-model="profile.phone" label="Phone" :rules="[rules.required]" hide-details="auto" disabled=""></v-text-field>
                                        </div>
                                        <div class="my-3">
                                            <v-text-field v-model="profile.email" label="Email" :rules="[rules.required]" hide-details="auto"></v-text-field>
                                        </div>
                                        <div class="my-5">
                                            <v-btn
                                                text
                                                dark color="accent-4"
                                                class="primary"
                                                @click="createProfile"
                                                id="sign-in-button"
                                                :loading="processing"
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
    </div>
</template>

<script>
    import UPDATE_USER from './../graphql/mutation/update_user'
    import CREATE_USER from './../graphql/mutation/create_user'
    import form_validation from './../helper/form_validation'
    import { mapState, mapMutations, mapGetters } from 'vuex'
    import Report from './../components/Report'
    import Wait from './../components/Wait'
    import _apollo from './../apollo'

    export default {
        components: {
            Wait, Report
        },
        data(){
            return {
                user: this.current_user,
                processing: false,
                rules: form_validation.rules,
                report: null,
                redirect_to: this.$route.query.then
            }
        },
        computed: {
            ...mapGetters([
                'app_ready',
                'current_user'
            ]),
            profile() {
                return {
                    first_name: this.current_user.profile ? this.current_user.profile.name.first_name : '',
                    last_name: this.current_user.profile ? this.current_user.profile.name.last_name : '',
                    email: this.current_user.profile ? this.current_user.profile.email : '',
                    phone: this.current_user.auth.phoneNumber,
                }
            },
        },
        mounted(){

        },
        methods: {
             ...mapMutations([
                'SET_CURRENT_USER'
            ]),
            update(){
                return this.current_user.profile ? true : false
            },
            createProfile(){
                if(this.$refs.profile.validate()){
                    const variables = {
                            id: this.current_user.auth.uid,
                            phone_country_code: this.current_user.profile.phone.country_code,
                            phone_number: this.current_user.profile.phone.phone_number,
                            email: this.profile.email,
                            first_name: this.profile.first_name,
                            last_name: this.profile.last_name
                        }
                    this.processing = true
                    const apollo = _apollo()
                    apollo.client.mutate({
                        mutation: this.update ? UPDATE_USER : CREATE_USER,
                        variables: variables
                    })
                    .then( response  => {
                        this.processing = false
                        this.report = this.update ? `Profile updated` : `Profile created`
                        let user = this.current_user
                        user.profile = this.update ? response.data.updateUser : response.data.createUser 
                        this.SET_CURRENT_USER(user)
                        if(this.redirect_to){
                            this.redirect()
                        }else{
                            this.update = true
                        }
                    })
                    .catch(e => {
                        this.report = e.message
                        this.processing = false
                    })
                }
            },

            redirect(){
                this.$router.push({
                        path: this.redirect_to
                    })
            }
        },
    }
</script>

<style scoped>

</style>

