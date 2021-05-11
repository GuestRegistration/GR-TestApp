<template>
    <app-layer ref="app">
      <v-row justify="center">
        <v-col cols="12" md="4" class="mt-2">
            <v-alert v-if="alert"
            prominent
            :type="alert.type"
            >   
            {{ alert.text }}
            </v-alert>
            <firebase-auth :redirect="redirectUrl" :providers="providers" />
        </v-col>
      </v-row>
    </app-layer>
</template>

<script>
    import AppLayer from '@/AppLayer';
    import FirebaseAuth from '../Components/FirebaseAuth.vue';

    export default {
        name: 'Signin',
        components:{
           AppLayer, FirebaseAuth
        },
        data(){
            return {}
        },

        computed: {
            redirect(){
                return this.$route.query.redirect ? this.$route.query.redirect : '/'
            },

            redirectUrl(){
                return  this.url(this.$router.resolve({path: this.redirect}).route.fullPath)
            },

            alert(){
                return this.$route.params.alert
            },

            providers(){
                if(this.$route.query.providers) return this.$route.query.providers.split(',')
                return ['google', 'email', 'phone']
            }
        },

        methods: {
            authenticated(auth){
                console.log(auth);
                window.location.replace(this.redirectUrl)
            }
        },

        mounted(){
            this.$refs.app.setState(true);
        }
    }
</script>

