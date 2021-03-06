<template>
    <div>
        <v-snackbar v-model="error.show"
        :timeout="-1" 
        color="red" 
        bottom>
        <v-row align="center">
            <v-col class="grow">
                {{error.message}} {{error.exception ? error.exception.message.replace('GraphQL error:', '').trim() : ''}}
            </v-col>
            <v-col class="shrink">
                <v-btn  dark text @click="retryError" v-if="error.retry">
                    Retry
                </v-btn>
                <v-btn  dark text @click="closeError">
                    Close
                </v-btn>
            </v-col>
            </v-row>
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
        
    
        <div class="ma-3">
            <slot name="header" />
        </div>
        <div class="px-1 px-sm-2">
            <slot/>
        </div>
        
    </div>
</template>

<script>
    import {mapMutations, mapGetters} from 'vuex';

    export default {
        name: "AppLayer",
        data(){
            return {
            }
        },
        computed:{
            ...mapGetters([
                'app_ready',
                'error',
                'current_user',
                'profile_loaded',
                'snackbar'
            ]),
        },
        methods: {
            ...mapMutations([
                'TOAST_ERROR',
                'SET_APP_STATE',
                'SET_APP_PROCESS',
                'SNACKBAR'
            ]),

            setState(ready, process = ''){
                this.SET_APP_STATE(ready);
                this.SET_APP_PROCESS(process);
            },

            alert(text, color = 'primary', top = false, right = false, bottom = true, left = false){
                this.SNACKBAR({
                    color, text, top, right, bottom, left,
                    status: true,
                })
            },

            closeAlert(){
                this.SNACKBAR({
                    status: false,
                    color: this.$store.getters.snackbar.color
                })
            },

            toastError({message, retry, exception}){
                this.TOAST_ERROR({
                    show: true,
                    retry,
                    message,
                    exception
                })
            },

            async retryError(){
                const retry = this.error.retry;
                this.TOAST_ERROR({
                    show: true,
                    message: 'Retrying...',
                });

                await retry()
                
                this.TOAST_ERROR({
                    show: false,
                    color: "error"
                });
            },

            closeError(){
                this.TOAST_ERROR({
                    show: false,
                    color: "error"
                });
            },
        },
    }
</script>