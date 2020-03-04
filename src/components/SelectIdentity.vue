<template>
    <div>
        <div class="mb-5 text-center">
            <h2 class="">Identity</h2>
            <p>We want to verify your Identity</p>
        </div>
        <v-card 
        :loading="saving_identity"
        >
            <v-card-text>
                <div class="my-5">
                    <template v-if="$apollo.queries.identitities.loading">
                        <div class="text-center">
                            <small>We are trying to see if we have any of your ID before...</small>
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
                                <template v-if="prev_identitities && prev_identitities.length > 0"> 
                                    <v-subheader>We found IDs you have uploaded in the past</v-subheader>
                                     <v-divider></v-divider>
                                   <v-radio-group 
                                   v-model="identity_to_use"
                                    :mandatory="false"
                                    @change="selectID"
                                    >
                                        <v-radio v-for="(identity, key) in prev_identitities" :key="key"
                                        :label="`${identity.title} - ${identity.verified ? `Verified` :   `Not verified yet`} `"
                                        :value="identity"></v-radio>
                                    </v-radio-group>
                                </template>
                                <template v-else>
                                    <p class="grey--text">We do not have any record of your identity yet</p>
                                </template>
                                <CreateNewIdentity :_user="user" @done="getUploadedID"/>
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
                                        :color="`grey lighten-4`"
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
                            :loading="saving_identity"
                        >
                            Continue
                        </v-btn>
                    </div>
            </v-card-text>
        </v-card>
            
    </div>
</template>

<script>
    import GET_USER_IDENTITIES from './../graphql/query/get_user_identities'
    import form_validation from './../helper/form_validation'
    import CreateNewIdentity from './CreateNewIdentity'
import { mapState } from 'vuex'
    export default {
        data(){
            return {
                user: this._user,
                saving_identity: false,
                identity_to_use: null,
                prev_identitities: this.identities || []
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
        props: [],
        mounted(){
            console.log(this.user)
        },
        methods: {
            selectID(id){
                console.log(id)
                this.identity_to_use = id
            },
            getUploadedID(id){
                this.identity_to_use = id
                this.prev_identitities.push(id)
                this.identity_to_use = id
            },
            submit(){
                if(this.identity_to_use == null){
                    alert('No Id has been selected')
                }else{
                 this.$emit('done', this.identity_to_use)
                }
            }
        
        },
        apollo:{
            identitities: {
                query: GET_USER_IDENTITIES,
                variables() {
                   return {
                       id: this.current_user.auth.uid
                   } 
                },
               update: data => data.getUserIdentities
            }
        }
    }
</script>

<style scoped>

</style>

