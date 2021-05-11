<template>
    <div>
        <div v-if="!googleProvider">
            <v-btn small color="primary" @click="connect">Connect Google</v-btn>
            <p><small class="grey--text">Connecting your Google account will change your primary email to your Google account email</small></p>
        </div>
        <div v-else>
            <v-avatar>
                <img
                    :src="googleProvider.photoURL"
                    :alt="googleProvider.displayName"
                >
            </v-avatar>
            {{ googleProvider.displayName }}
            <p><small class="grey--text">To disconnect your Google account, change your email from {{ googleProvider.email }} to another valid email</small></p>
            <!-- <v-btn v-if="current_user.auth.providerData.length > 1" small class="red accent--4" dark @click="disconnect" :loading="loading">Remove</v-btn> -->
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import firebase from '../../../firebase';
import profile from '../../User/Mixins/profile'

export default {
    name: "GoogleConnect",
    mixins: [profile],
    props: {

    },
    data(){
        return {
           loading: false,
        }
    },
    computed:{
        ...mapGetters([
            'current_user',
        ]),

        googleProvider(){
            if(!this.current_user.auth.providerData) return null;
            return this.current_user.auth.providerData.find(provider => provider.providerId == 'google.com');
        },

        emailProvider(){
            if(!this.current_user.auth.providerData) return null;
            return this.current_user.auth.providerData.find(provider => provider.providerId == 'password');
        },
    },
    methods: {
        ...mapActions(['signout']),

        async connect(){
            try {

                const provider = new firebase.firebase.auth.GoogleAuthProvider();
                const google = await firebase.auth.currentUser.linkWithPopup(provider);
                const newGoogleProvider = google.user.providerData.find(provider => provider.providerId == 'google.com');

                if(newGoogleProvider){
                    this.syncAuthWithProfile({
                        email: newGoogleProvider.email
                    })
                }

                this.$emit('notification', {
                    title: "Account update", 
                    body: `Google account ${newGoogleProvider.email} has been added to your account. You can now sign in with it.`,
                    icon: newGoogleProvider.photoURL
                })

                if(this.emailProvider){
                    await  firebase.auth.currentUser.unlink(this.emailProvider.providerId);
                }

                await this.signout();

                this.$router.push({
                    name: 'signin',
                    query: {
                        redirect: this.$router.resolve({name: this.$route.name}).route.fullPath,
                        providers: 'google'
                    },
                    params: {
                        alert: {
                            type: 'success',
                            text: 'Google account connected successfully. You need to sign in again with your new connected Google account'
                        }
                    }
                })

            } catch (error) {
                this.$emit('report', {
                    message: `Failed: ${error.message}`,
                    type: 'error'
                })
            }
            finally{
                this.$emit('update')
            }
        },

        // disconnect(){
        //     this.loading = true;
        //     firebase.auth.currentUser.unlink(this.googleProvider.providerId)
        //     .then(() => firebase.auth.currentUser.reload() )
        //     .then(() => {
        //         this.$emit('report', {
        //             message: `Google account removed.`,
        //             type: 'success'
        //         })
        //     })
        //     .catch(e => {
        //         this.$emit('report', {
        //             message: `Could not remove email. ${e.message}`,
        //             type: 'error'
        //         });
        //     })
        //     .finally(() => {
        //         this.loading = false;
        //         this.$emit('update')
        //     })
        // }
    },

}
</script>