
    import { mapMutations, mapGetters, mapActions } from 'vuex'

    import UPDATE_USER from '../Mutations/updateUser';
    
    export default {
        data(){
            return {
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
                'SET_USER_PROFILE',
                'TOAST_ERROR',
                'SET_APP_STATE',
                'SET_APP_PROCESS',
            ]),
            ...mapActions([
                'query',
                'mutate',
            ]),
        
            setProfile(){
                if(this.update){
                    this.profile = {
                        id: this.current_user.auth.uid,
                        phone: this.current_user.auth.phoneNumber ? this.current_user.auth.phoneNumber : this.current_user.profile.phone,
                        phone_country_code: (this.current_user.profile.phone_meta ? this.current_user.profile.phone_meta.country_code : null) || null,
                        phone_number: (this.current_user.profile.phone_meta ? this.current_user.profile.phone_meta.phone_number : null) || null,
                        email: this.current_user.auth.email ? this.current_user.auth.email : this.current_user.profile.email,
                        first_name: this.current_user.profile.name.first_name,
                        last_name: this.current_user.profile.name.last_name,
                    }
                }
                else{
                    this.profile.id = this.current_user.auth.uid;
                    this.profile.email = this.current_user.auth.email
                    this.profile.phone = this.current_user.auth.phoneNumber
                }
            },
            

            syncAuthWithProfile(credentials){
                this.setProfile();
                if(!this.update) return;

                let profile = { ...this.profile, ...credentials};

                this.SET_APP_STATE(false);
                this.SET_APP_PROCESS('Syncing with your profile...');

                this.mutate({
                    variables: profile,
                    mutation: UPDATE_USER,
                })
                .then(response  => {
                    this.SET_USER_PROFILE(response.data.updateUser);
                    this.setProfile();
                    this.$store.commit("SNACKBAR", {
                        status: true,
                        text: "Profile synced",
                        color: "success"
                    })
                })
                .catch(e => {

                    this.TOAST_ERROR({
                        show: true,
                        retry: () => this.syncProfileWithAuth(),
                        message: 'Failed. ',
                        exception: e
                    }) 
                   
                })
                .finally(() => {
                    this.SET_APP_STATE(true);
                    this.SET_APP_PROCESS('');
                });
            },
        },

        mounted(){
            this.setProfile()
        }

    }



