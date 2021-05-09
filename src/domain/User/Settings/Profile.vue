<template>
    <v-form ref="profile">
        <div class="my-3">
            <v-text-field outlined v-model="profile.first_name" label="First name" :rules="[rules.required]" hide-details="auto"></v-text-field>
        </div>
        <div class="my-3">  
            <v-text-field outlined v-model="profile.last_name" label="Last name" :rules="[rules.required]" hide-details="auto"></v-text-field>
        </div> 

        <div class="my-3">  
            <v-text-field outlined v-model="profile.email" label="Email" :messages="['update']"  readonly disabled>
                 <template #message="{ message }">
                   <span v-if="message == 'update'" >
                        Update email in <router-link :to="{name: $route.name, params:{tab: 'authentication'}}">authentication</router-link>
                    </span>
                 </template>
            </v-text-field>
        </div>

        <div class="my-3">  
            <v-text-field outlined v-model="profile.phone" label="Phone" :messages="['update']" readonly disabled>
                <template #message="{ message }">
                    <span v-if="message == 'update'" >
                        Update phone in <router-link :to="{name: $route.name, params:{tab: 'authentication'}}">authentication</router-link>
                    </span>
                </template>
            </v-text-field>
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
         <div class="mt-5" v-if="!update">
            <p class="grey--text">By creating an account, you agree to our <a href="#">Terms of service</a> and <a href="#">Privacy policy</a></p>
        </div>
    </v-form>
</template>

<script>
    import formvalidation from '@/helper/formValidation'
    import UPDATE_USER from '../Mutations/updateUser';
    import CREATE_USER from '../Mutations/createUser';

    import profile from '../Mixins/profile';
    
    export default {
        name: "UserProfile",
        mixins: [profile],

        data(){
            return {
                loading: false,
                rules: formvalidation.rules,
            }
        },
    
        methods: {
            
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
                    this.$store.commit("SNACKBAR", {
                        status: true,
                        text: "Profile updated",
                        color: "success"
                    })
                    if(this.$route.query.redirect){
                        this.$router.push({
                            path: this.$route.query.redirect
                        })
                    }
                })
                .catch(e => {
                    this.TOAST_ERROR({
                        show: true,
                        retry: () => this.createProfile(),
                        message: 'Failed. ',
                        exception: e
                    }) 
                })
                .finally(() => {
                    this.loading = false;
                });
            },

        },
    }
</script>


