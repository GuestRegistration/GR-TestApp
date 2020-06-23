<template>
    <div>
        <v-snackbar v-model="error.show"
        :timeout="0" 
        color="red" 
        bottom>
            {{error.message}} {{error.exception ? error.exception.message.replace('GraphQL error:', '').trim() : ''}}
             <v-btn  dark text @click="retryError" v-if="error.retry">
                Retry
            </v-btn>
            <v-btn  dark text @click="closeError">
                Close
            </v-btn>
        </v-snackbar>

        <v-snackbar v-model="snackbar.status" 
        :timeout="10000" 
        :color="snackbar.color" 
        :top="snackbar.top" 
        :left="snackbar.left" 
        :right="snackbar.right"
        :bottom="snackbar.bottom">
            {{ snackbar.text }}
             <v-btn  dark text @click="closeAlert" >
                Close
            </v-btn>
        </v-snackbar>

        <div v-if="app_ready && isset">
            <slot />
        </div>
        <div v-else>
            <v-row justify="center">
                <v-col cols="12" md="6" class="mt-5">
                    <v-parallax src="@/assets/spinner.gif" height="200"></v-parallax>
                </v-col>
            </v-row>
            <div class="text-center">
                <p>{{text}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapState, mapMutations, mapGetters} from 'vuex'
    export default {
        name: "AppLayer",
        data(){
            return {
                isset: false,
                text: '',
                snackbar: {
                    status: false,
                }
            }
        },
        computed:{
            ...mapGetters([
                'app_ready',
                'error',
                'current_user'
            ]),
        },
        methods: {
            ...mapMutations([
                'TOAST_ERROR',
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
                 this.snackbar = {
                     status: false,
                 }
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
            }
        },

    }
</script>