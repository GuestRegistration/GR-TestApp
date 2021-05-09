<template>
    <app-layer ref="app" >
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card flat>
                    <v-toolbar
                    flat
                    >
                    <v-app-bar-nav-icon class="d-sm-none" @click="expandTab = !expandTab"></v-app-bar-nav-icon>
                    <v-toolbar-title>User Account</v-toolbar-title>
                    </v-toolbar>
                    <v-tabs vertical v-model="currentTab" @change="tabChanged" color="primary">

                        <v-tab v-for="tab in tabs" :key="tab.name" :disabled="tab.disabled" class="d-flex">
                            <v-icon flex>
                                {{ tab.icon }}
                            </v-icon>
                            <span :class="{'d-none d-sm-block': !expandTab}">{{ tab.name }} </span>
                        </v-tab>

                        <v-tab-item class="pa-5" :class="{'d-none d-sm-block': expandTab}">                                
                            <user-profile ref="userProfile" />
                        </v-tab-item>

                        <v-tab-item class="pa-5" :class="{'d-none d-sm-block': expandTab}">                                
                            <account-connects @report="accountReport" @auth-updated="(credentials) => syncAuthWithProfile(credentials)" @notification="sendAccountPushNotification" />
                        </v-tab-item>

                    </v-tabs>
                </v-card>
            </v-col>
        </v-row>
    </app-layer>
</template>

<script>
    import AppLayer from '@/AppLayer';
    import UserProfile from '../Settings/Profile';
    import AccountConnects from '../../Auth/Components/AccountConnects';
    
    import PUSH_NOTIFICATION from '@/graphql/mutation/pushNotification'
    import profile from '../Mixins/profile';

    export default {
        name: "UserAccount",
        mixins: [profile],
        components: {
            AppLayer, UserProfile, AccountConnects,
        },
        data(){
            return {
                expandTab: false,
            }
        },
        computed: {
            tabs(){
                return [
                    {
                        name: 'Profile',
                        alias: 'profile',
                        route: {name: this.$route.name, params: {tab: 'profile'}},
                        disabled: false,
                        icon: 'mdi-account'
                    },
                    {
                        name: 'Authentication',
                        alias: 'authentication',
                        route: {name: this.$route.name, params: {tab: 'authentication'}},
                        disabled: false,
                        icon: 'mdi-shield-account'
                    },
                ]
            },

            tab:{
                get: function() {
                    return this.$route.params.tab ?  this.$route.params.tab  : 'profile';
                },
                set: function(tab){}
            },

            currentTab: {
                get: function(){
                    return this.tabs.findIndex(t => t.alias == this.tab)
                },
                set: function(tab){}
            },

        },

        methods: {
            accountReport(report){
                this.$store.commit("SNACKBAR", {
                    status: true,
                    text: report.message,
                    color: report.type
                })
            },
            
            sendAccountPushNotification(payload){
                this.mutate({
                    variables: {
                        user_id: this.current_user.auth.uid,
                        ...payload
                    },
                    mutation: PUSH_NOTIFICATION
                })
                .then(response => {
                    //console.log(response);
                })
                .catch(e => {
                    //console.log(e);
                })
            },

            tabChanged(tab){
                if(!this.tabs[tab].route) return;
                this.expandTab = false;
                this.$router.push(this.tabs[tab].route)
            }

        },
    }
</script>


