<template>
    <div>
        <template v-if="loading">
            <div class="text-center">
                <v-skeleton-loader
                    height="80"
                    type="list-item-two-line"
            >
            </v-skeleton-loader>
            </div>
        </template>
        <template v-else-if="identities">
            <v-alert 
                v-if="!identities.length"
                border="left"
                colored-border
                elevation="2"
                type="warning">
                No ID yet
            </v-alert>
            <v-list v-else>
                <v-list-item
                v-for="identity in identities" 
                :key="identity.id"
                >
                    <v-list-item-avatar>
                        <v-img :src="identity.document_url"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title v-html="identity.title"></v-list-item-title>
                        <v-list-item-subtitle v-html="identity.document_type"></v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn icon>
                            <v-icon color="grey lighten-1">mdi-information</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
            <CreateNewIdentity @done="getUploadedID"/>
        </template>
    </div>
</template>

<script>
import formValidation from '@/helper/formValidation';
import CreateNewIdentity from './CreateNewIdentity';

import GET_USER_IDENTITIES from '../Queries/getUserIdentities';
import { mapActions } from 'vuex';

export default {
    name: "UserIdentities",
    data(){
        return {
            loading: false,
            identities: []
        }
    },
    components: {
        CreateNewIdentity
    },
    methods: {
        ...mapActions([
            'query',
        ]),
        getUploadedID(identity){
            this.identities.push(identity)
        },
        getMyIdentities(){
            this.loading = true;
            this.query({
                query: GET_USER_IDENTITIES,
            })
            .then(response => {
                this.identities = response.data.getUserIdentities
            })
            .catch(e => {
                this.TOAST_ERROR({
                    show: true,
                    message: `Could not get your Ids.`,
                    retry: () => this.getMyIdentities(),
                    exception: e
                })
            })
            .finally(() => {
                this.loading = false
            })
        }
    },
    mounted(){
        this.getMyIdentities();
    }
}
</script>