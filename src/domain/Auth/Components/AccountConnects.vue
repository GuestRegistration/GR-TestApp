<template>
    <div>
        <div v-if="current_user.auth" class="my-2">
            <v-row align="center">
                <v-col cols="12" sm="3">
                    Email:
                </v-col>
                <v-col cols="12" sm="9">
                    <email-connect v-on="$listeners" :key="version" @update="version++" />
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
                <v-col cols="12" sm="3">
                    Phone:
                </v-col>
                <v-col cols="12" sm="9">
                    <phone-connect v-on="$listeners" :key="version" @update="version++"  />
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
                <v-col cols="12" sm="3">
                    Google:
                </v-col>
                <v-col cols="12" sm="9"> 
                    <google-connect  v-on="$listeners" :key="version" @update="version++" />
                </v-col>
            </v-row>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import GoogleConnect from './GoogleConnect';
import PhoneConnect from './PhoneConnect';
import EmailConnect from './EmailConnect';

export default {
    name: "AccountConnects",
    components:{
        GoogleConnect,
        PhoneConnect,
        EmailConnect
    },
    data(){
        return {
           version: 0,
        }
    },
    computed: {
         ...mapGetters([
            'current_user',
        ]),

        googleProvider(){
            if(!this.current_user.auth.providerData) return null;
            return this.current_user.auth.providerData.find(provider => provider.providerId == 'google.com');
        },

        phoneProvider(){
            if(!this.current_user.auth.providerData) return null;
            return this.current_user.auth.providerData.find(provider => provider.providerId == 'phone');
        },

        emailProvider(){
            if(!this.current_user.auth.providerData) return null;
            return this.current_user.auth.providerData.find(provider => provider.providerId == 'password');
        },
       
    },

}
</script>