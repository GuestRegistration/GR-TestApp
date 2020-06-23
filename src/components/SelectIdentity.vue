<template>
    <div>
        <div class="mb-5 text-center">
            <h2 class="">Identity</h2>
            <p><strong>{{reservation.property.name}}</strong> would like to verify your Identity</p>
        </div>
        <v-card outlined>
            <v-card-text>
                <div class="my-5">
                    <template v-if="loading">
                        <div class="text-center">
                            <small>We want to save you some stress. We are trying to see if we have any of your ID from the past...</small>
                            <v-skeleton-loader
                                height="80"
                                type="list-item-two-line"
                        >
                        </v-skeleton-loader>
                        </div>
                    </template>
                    <template v-else>
                        <v-container>
                          <v-row>
                            <v-col cols="12" md="7">
                                <template v-if="identities && identities.length > 0"> 
                                    <v-subheader>We found IDs you have uploaded</v-subheader>
                                     <v-divider></v-divider>
                                   <v-radio-group 
                                   v-model="identity_to_use"
                                    :mandatory="false"
                                    @change="selectID"
                                    >
                                        <v-radio v-for="(identity, key) in identities" :key="key"
                                        :label="`${identity.title} - ${identity.verified ? `Verified` :   `Not verified yet`} `"
                                        :value="identity"></v-radio>
                                    </v-radio-group>
                                </template>
                                <template v-else>
                                    <p class="grey--text">We do not have any record of your ID yet, you can add one now.</p>
                                </template>
                                <CreateNewIdentity @done="getUploadedID"/>
                            </v-col>
                            <v-col cols="12" md="5">
                                 <template v-if="identity_to_use !== null">
                                     <div class="text-center">
                                        <h4>{{identity_to_use.title}}</h4>
                                        <p>{{identity_to_use.verified ? `Verified` : `Not verified yet`}}</p>
                                    </div>
                                     <template v-if="identity_to_use.document_url">
                                         <img :src="identity_to_use.document_url" :alt="identity_to_use.title" width="100%">
                                    </template>
                                    <template v-else>
                                            <h4 class="red--text text-center">Invalid ID</h4>
                                    </template>
                                    
                                 </template>
                                 <template v-else>
                                    <v-sheet
                                        color="grey lighten-4"
                                        class="px-3 pt-3 pb-3"
                                    >
                                        <v-skeleton-loader
                                        class="mx-auto"
                                        type="card"
                                        ></v-skeleton-loader>
                                    </v-sheet>
                                </template>
                            </v-col>
                        </v-row>
                        </v-container>

                    </template>
                </div>
                    <div class="my-5">
                        <v-btn
                            text
                            dark color="accent-4"
                            class="primary"
                            block
                            @click="submit"
                            id="sign-in-button"
                        >
                            Continue
                        </v-btn>
                    </div>
            </v-card-text>
        </v-card>
            
    </div>
</template>

<script>
    import GET_MY_IDENTITIES from './../graphql/query/get_my_identities';
    import form_validation from './../helper/form_validation';
    import CreateNewIdentity from './CreateNewIdentity';
    import { mapState, mapMutations, mapActions } from 'vuex';

    export default {
        data(){
            return {
                loading: false,
                identities: [],
                identity_to_use: null,
                reservation: this._reservation,
            }
        },
        computed: {
            ...mapState([
                'current_user'
            ])
        },
        components: {
            CreateNewIdentity
        },
        props: ['_reservation'],
        mounted(){
            this.getMyIdentities()
        },
        methods: {
            ...mapMutations([
                'TOAST_ERROR',
            ]),
            ...mapActions([
                'query',
                'mutate'
            ]),

            selectID(id){
                this.identity_to_use = id
            },
            getUploadedID(identity){
                this.$emit('alert', {message:'New identity uploaded', type: 'success'});
                if(this.identities){
                     this.identities.push(identity);
                }else{
                     this.identities = [identity];
                }
                this.identity_to_use = identity;
            },

            submit(){
                this.$emit('done', this.identity_to_use);
            },

            getMyIdentities(){
                    this.loading = true;
                    this.query({
                        query: GET_MY_IDENTITIES,
                    })
                    .then(response => {
                        this.identities = response.data.getMyIdentities
                    })
                    .catch(e => {
                        this.TOAST_ERROR({
                            show: true,
                            message: `Could not get your Ids.`,
                            retry: () => {
                                return new Promise((resolve, reject) => {
                                    this.getMyIdentities();
                                    resolve();
                                })
                            },
                            exception: e
                        })
                    })
                    .finally(() => {
                        this.loading = false
                    })
            }
        
        },

         watch: {
            _reservation: function(r){
                this.reservation = r
            }
        }
    }
</script>

<style scoped>

</style>

