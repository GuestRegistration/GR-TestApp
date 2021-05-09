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
import { mapGetters } from 'vuex';
import firebase from '@/firebase';

export default {
    name: "GoogleConnect",

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
        connect(){
            let provider = new firebase.firebase.auth.GoogleAuthProvider();
            firebase.auth.currentUser.linkWithPopup(provider)
            .then( (result) =>{
               this.$emit('report', {
                    message: 'Google account connected successfully',
                    type: 'success'
                })

                this.$emit('auth-updated', {
                    email: result.user.email
                })

                this.$emit('notification', {
                    title: "Account update", 
                    body: `Google account ${this.googleProvider.email} has been added to your account. You can now sign in with it.`,
                    icon: this.googleProvider.photoURL
                })

                // unlink email if available since user will be able to use google account email
                return this.emailProvider ? firebase.auth.currentUser.unlink(this.emailProvider.providerId) : Promise.resolve()
            })
            .then(() => firebase.auth.currentUser.reload() )
            .catch(e => {
                this.$emit('report', {
                    message: `Failed: ${e.message}`,
                    type: 'error'
                })
            })
            .finally(() => {
                this.$emit('update')
            })
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