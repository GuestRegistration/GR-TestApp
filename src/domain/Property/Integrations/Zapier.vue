<template>
    <v-card class="my-2">
        <v-card-title><h4>Zapier</h4></v-card-title>
        <v-card-subtitle>Zapier integration for {{ property.name }}.</v-card-subtitle>
        <v-card-text>
            <v-list>
                <v-list-item>
                    <v-list-item-icon>
                        <v-icon v-if="zapier.zapier_authorized" v-text="'mdi-check-circle'" color="success"></v-icon>
                        <v-icon v-else v-text="'mdi-close-circle'" color="error"></v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Authorized</v-list-item-title>
                        <v-list-item-subtitle v-if="zapier.zapier_authorized">
                            There is an access token currently being used by Zapier to access data in {{ property.name }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle v-else>
                            There is no access token for Zapier to access data in {{ property.name }}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item :disabled="!zapier.zapier_authorized">
                        <v-list-item-icon>
                        <v-icon v-text="'mdi-clock'"></v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>
                            Last Poll: 
                            <span v-if="zapier.zapier_last_poll">{{ zapier.zapier_last_poll | timestamp_to_date('day mName, year. diff') }}</span>
                            <span v-else>Never polled</span>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            Last time Zapier polled data for {{ property.name }} for its triggers
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card-text>
        <v-card-actions>
            <v-btn v-if="zapier.zapier_authorized" small @click="$refs.confirmation.open()" color="error"><v-icon>mdi-cancel</v-icon> Revoke Zapier access</v-btn>
        </v-card-actions>
        <confirmation-dialog ref="confirmation" @confirmed="revoke">
            <div class="text-center mt-5">
                <h4>
                    Are you sure you want to revoke Zapier access to {{ property.name }}.
                </h4>
            </div>
        </confirmation-dialog>
    </v-card>
</template>

<script>
import ConfirmationDialog from '../../../components/Utilities/ConfirmationDialog.vue';

export default {
    name: "Zapier",
    components: { ConfirmationDialog },
    data(){
        return {
            zapier: {}
        }
    },
    props: {
        property: Object,
        integrations: {
            type: Object,
            default: () => ({})
        }
    },
    methods: {
        revoke() {
            this.$store.commit("SNACKBAR", {
                status: true,
                text: "Not available yet",
                color: "info",
            })
        }
    },

    watch: {
        integrations: {
            immediate: true,
            handler(integrations) {
                if(integrations) {
                    this.zapier = integrations
                }
            }
        }
    }
}
</script>