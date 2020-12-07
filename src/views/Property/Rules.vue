<template>
    <property>
        <template  v-slot:default="props">
            <v-container>
                <v-row justify="center">
                    <v-col md="6">
                        <h2>Property Rules</h2>
                        <v-card>
                            <v-card-text v-if="props.property.rules">{{props.property.rules}}</v-card-text>
                            <v-card-text v-else>No rules set</v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </template>
    </property>
</template>

<script>
    import Property from './Show';
    export default {
        name: 'PropertyRules',
        components: {
            Property
        },
        data(){
            return {
                property: null
            }
        },
    }
</script>