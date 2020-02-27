<template>
    <div>
        <div class="my-5">
            <h2 class="text-center">Create you profile</h2>
        </div>
        <v-card 
        :loading="creating_profile"
        >
            <v-card-text>
                <p>Secure your activity and validate your account</p>
                <div class="my-5">
                    <v-form ref="profile" >
                        <div class="my-3">
                            <v-text-field v-model="profile.first_name" label="First name" :rules="[rules.required]" hide-details="auto"></v-text-field>
                        </div>
                            <div class="my-3">  
                            <v-text-field v-model="profile.last_name" label="Last name" :rules="[rules.required]" hide-details="auto"></v-text-field>
                        </div>
                        <div class="my-3">
                            <v-text-field v-model="profile.email" label="Email" :rules="[rules.required]" hide-details="auto"></v-text-field>
                        </div>
                        <div class="my-5">
                            <v-btn
                                text
                                dark color="accent-4"
                                class="primary"
                                block
                                @click="createProfile"
                                id="sign-in-button"
                                :loading="creating_profile"
                            >
                                Continue
                            </v-btn>
                        </div>
                    </v-form>
                </div>
            </v-card-text>
        </v-card>
            <div class="mt-5">
            <p class="grey--text">By creating an account, you agree to our <a href="#">Terms of service></a> and <a href="#">Privacy policy</a></p>
        </div>
    </div>
</template>

<script>
    import CREATE_USER from './../graphql/mutation/create_user'

    export default {
        
        data(){
            return {
                user: this._user,
                creating_profile: false,
                profile: {
                    first_name: '',
                    last_name: '',
                    email: ''
                },
                rules: {
                    required: value => !!value || 'Required.'
                }

            }
        },
        props: ['mobile_number', '_user'],
        methods: {
            createProfile(){
                if(this.$refs.profile.validate()){
                    const variables = {
                            id: this.user.uid,
                            phone: this.mobile_number,
                            email: this.profile.email,
                            first_name: this.profile.first_name,
                            last_name: this.profile.last_name
                        }
                    this.creating_profile = true
                    this.$apollo.mutate({
                        // Query
                        mutation: CREATE_USER,
                        variables: variables
                    })
                    .then( data => {
                        this.creating_profile = false
                        alert(`Your profile has been created. You can proceed now`)
                        console.log(data)
                        this.$emit('done')
                    })
                }
            }
        },
        watch: {
            _user: function(user){
                this.user = user
            }
        }

    }
</script>

<style scoped>

</style>

