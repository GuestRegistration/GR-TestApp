<template>
    <app-layer ref="app">
      <v-row justify="center">
        <v-col cols="12" md="4" class="mt-2">
            <firebase-auth :redirect="redirect" />
        </v-col>
      </v-row>
    </app-layer>
</template>

<script>
    import {mapActions, mapMutations} from 'vuex'
    import AppLayer from '@/AppLayer';
    import FirebaseAuth from '../Components/FirebaseAuth.vue';

    export default {
        name: 'Signin',
        components:{
           AppLayer, FirebaseAuth
        },
        data(){
            return {
                redirect: '',
            }
        },
        mounted(){
            this.redirect = this.$route.query.redirect ? this.$route.query.redirect : '/'
            this.$refs.app.setState(true);
        }
    }
</script>

