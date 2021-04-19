<template>
    <app-layer ref="app">
      <v-row justify="center">
        <v-col cols="12" md="4" class="mt-2">
            <firebase-auth @authenticated="authenticated" />
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
                return this.$route.query.redirect ? this.$route.query.redirect : ''
            },

            redirectUrl(){
                return  this.url(this.$router.resolve({path: this.redirect}).route.fullPath)
            }
        },

        methods: {
            authenticated(){
                window.location.replace(this.redirectUrl)
            }
        },

        mounted(){
            this.$refs.app.setState(true);
        }
    }
</script>

