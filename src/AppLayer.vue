<template>
    <div>
        <v-snackbar v-model="error.show"
        :timeout="-1" 
        color="red" 
        bottom>
        <div class="d-flex align-center flex-wrap">
            <div>
                {{error.message}} {{error.exception ? error.exception.message.replace('GraphQL error:', '').trim() : ''}}
            </div>
            <div class="ml-auto">
                <v-btn  dark text @click="retryError" v-if="error.retry">
                    Retry
                </v-btn>
                <v-btn  dark text @click="closeError">
                    Close
                </v-btn>
            </div>
        </div>
        </v-snackbar>

        <v-snackbar v-model="snackbar.status" 
            :timeout="5000" 
            :color="snackbar.color" 
            :top="snackbar.top" 
            :left="snackbar.left" 
            :right="snackbar.right"
            :bottom="snackbar.bottom">
            <div class="d-flex align-center flex-wrap">
                <div>{{ snackbar.text }}</div>
                <div class="ml-auto">
                    <v-btn  dark text @click="closeAlert" >Close</v-btn>
                </div>
            </div>
        </v-snackbar>

        <v-snackbar bottom right :value="updateExists" :timeout="-1" color="primary">
            <div class="d-flex align-center">
                <div>
                    An update is available
                </div>
                <v-spacer></v-spacer>
                <v-btn text @click="refreshApp">
                    Update
                </v-btn>
            </div>
        </v-snackbar>
        
        <div class="ma-3">
            <slot name="header" />
        </div>
        <div  v-if="app_ready && isset" class="px-5">
            <slot/>
        </div>
        
        <div v-else>
            <v-row justify="center">
                <v-col cols="12" md="6" class="mt-5">
                    <v-img src="@/assets/spinner.gif" height="200" ></v-img>
                </v-col>
            </v-row>
            <div class="text-center">
                <p>{{text}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import update from './mixins/update';
    import {mapActions, mapState, mapMutations, mapGetters} from 'vuex';
    import firebase from '@/firebase';
    import helper from '@/helper';

    import GET_USER_BY_ID from './domain/User/Queries/getUserByID';
    import UPDATE_USER_DEVICE from './domain/User/Mutations/updateUserDevice';

    export default {
        name: "AppLayer",
        data(){
            return {
                isset: false,
                text: '',
                snackbar: {
                    status: false, color: 'primary', top: false, right: false, bottom: true, left: false
                }
            }
        },
        computed:{
            ...mapGetters([
                'app_ready',
                'error',
                'current_user',
                'profile_loaded',
            ]),
        },
        methods: {
            ...mapActions([
                'getIdToken',
                'signout',
                'query',
                'mutate'
            ]),
            ...mapMutations([
                'TOAST_ERROR',
                'SET_APP_STATE',
                'SET_USER_AUTH',
                'SET_USER_PROFILE',
                'SET_ACTIVE_PROPERTY'
            ]),

            setState(ready, process = ''){
                this.isset = ready;
                this.text = process;
            },

            alert(text, color = 'primary', top = false, right = false, bottom = true, left = false){
                this.snackbar = {
                    color, text, top, right, bottom, left,
                    status: true,
                }
            },
            closeAlert(){
                 this.snackbar.status = false;
            },

            toastError({message, retry, exception}){
                this.TOAST_ERROR({
                    show: true,
                    retry: () => {
                        return new Promise((resolve, reject) => {
                            retry();
                            resolve();
                        })
                    },
                    message,
                    exception
                })
            },
            retryError(){
                const retry = this.error.retry;
                this.TOAST_ERROR({
                    show: true,
                    message: 'Retrying...',
                });
                retry().then(() => {
                    this.TOAST_ERROR({
                        show: false,
                    });
                })
                .catch(e => {
                    console.log('error', e, e.message);
                })
            },
            closeError(){
                this.TOAST_ERROR({
                    show: false,
                });
            },

            setUser(){
                this.SET_APP_STATE(false);
                if( window.localStorage.getItem('gr-user') 
                    && firebase.auth.currentUser 
                    && window.localStorage.getItem('token-expires') > helper.nowTimestamp()
                    && this.profile_loaded
                )
                {
                    this.SET_APP_STATE(true);
                    this.$emit('ready');
                    return;
                }
                else if(!firebase.auth.currentUser){
                    this.signout().then(() => {
                        this.SET_APP_STATE(true);
                    })
                    return;
                }
                
                this.getIdToken()
                .then(user =>  {
                if(user){
                    this.SET_USER_AUTH(firebase.auth.currentUser);
                    return this.query({
                            query: GET_USER_BY_ID,
                            variables: {
                            id: user.uid
                        }
                    }); 
                    }else{
                        return new Promise((r,e) => {
                            this.signout().then(() => {
                            window.localStorage.removeItem('gr-user')
                            r(null)
                            })
                        })
                    }
                })
                .then(response => {
                    if(response && response.data.getUserByID){ 
                        this.SET_USER_PROFILE(response.data.getUserByID || {})
                        this.SET_ACTIVE_PROPERTY(response.data.getUserByID && response.data.getUserByID.properties ? response.data.getUserByID.properties[0] : {});

                        if(Notification.permission === "granted"){
                            this.getNotificationToken();
                        }else{
                            Notification.requestPermission().then(permission => {
                                if (permission === "granted") {
                                new Notification("Holla! We can now send you notification here");
                                this.getNotificationToken();
                                }
                            });
                        }
                    }
                    else if(firebase.auth.currentUser){
                        this.$router.push({
                            name: 'account'
                        })
                    }
                    this.SET_APP_STATE(true);
                    this.$emit('ready')
                })
                .catch(e => {
                    this.toastError({
                        message: 'Authentication error.',
                        retry: () => {
                        return new Promise((resolve, reject) => {
                            this.setUser();
                            resolve();
                        })
                        },
                        exception: e
                    });
                    // this.SET_APP_STATE(true);
                    // this.$emit('ready')
                })
            },
            getNotificationToken(){
                const messaging = firebase.messaging;
                messaging.getToken().then((currentToken) => {
                if(currentToken) {                  
                    this.mutate({
                        mutation: UPDATE_USER_DEVICE,
                        variables: {
                        device_id: navigator.userAgent,
                        notification_token: currentToken
                        }
                    })
                    .then(response => {
                        console.log('Device updated');
                        })
                    .catch(e => {
                        console.log('Could not update user device information')
                    })
                    } 
                });
                messaging.onMessage((payload) => {
                    new Notification(payload.notification.title, {
                        body: payload.notification.body,
                        icon: payload.notification.icon,
                    });
                });
            },

        },

        mounted(){
            firebase.auth.onAuthStateChanged((user) => {
                this.setUser();
            });
        },

        mixins: [update]
    }
</script>