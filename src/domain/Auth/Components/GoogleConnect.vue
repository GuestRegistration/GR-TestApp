<template>
    <div>
        <div v-if="!connected">
            <v-btn small color="primary" @click="connect">Connect Google</v-btn>
        </div>
        <div v-else>
            <p>Connected as {{ connected.displayName }}  ({{connected.email}})</p>
            <v-btn v-if="current_user.auth.providerData.length > 1" small class="red accent--4" dark @click="disconnect" :loading="loading">Remove</v-btn>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import firebase from '@/firebase';

export default {
    name: "GoogleConnect",

    props: {
        provider: Object,
    },
    data(){
        return {
           connected: null,
           loading: false,
        }
    },
    computed:{
        ...mapGetters([
            'current_user',
        ]),
    },
    methods: {
        connect(){
            let provider = new firebase.firebase.auth.GoogleAuthProvider();
            firebase.auth.currentUser.linkWithPopup(provider)
            .then(result =>{
               this.$emit('report', {
                    message: 'Google account connected successfully',
                    type: 'success'
                })
                this.connected = result.user.providerData.find(provider => provider.providerId == 'google.com');
                this.$emit('notification', {
                    title: "Account update", 
                    body: `Google account ${this.connected.email} has been added to your account. You can now sign in with it.`,
                    icon: this.connected.photoURL
                })
            })
            .catch(e => {
                this.$emit('report', {
                    message: `Failed: ${e.message}`,
                    type: 'error'
                })
            })
        },

        disconnect(){
            this.loading = true;
            firebase.auth.currentUser.unlink(this.connected.providerId)
            .then(() => {
                this.connected = null;
                this.$emit('report', {
                    message: `Google account removed.`,
                    type: 'success'
                })
            })
            .catch(e => {
                this.$emit('report', {
                    message: `Could not remove email. ${e.message}`,
                    type: 'error'
                });
            })
            .finally(() => {
                this.loading = false;
            })
        }
    },
    watch: {
        provider: {
            immediate: true,
            handler(provider){
                this.connected = provider;
            }
        },
       
    }
}
</script>