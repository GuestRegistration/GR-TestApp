<template>
        <v-alert
            prominent
            type="warning"
            v-if="property && !property.active">
                <v-row align="center">
                <v-col class="grow">
                    <slot>Activate subscription for {{ property.name }}</slot>
                </v-col>
                <v-col class="shrink">
                    <router-link :to="{name: 'property.settings', params: {id: property.id, tab: 'subscription'}}" class="text-decoration-none">
                        <v-btn color="warning">View subscription</v-btn>
                    </router-link>
                
                </v-col>
            </v-row>
            
        </v-alert>
</template>

<script>
export default {
    name: "PropertySubscriptionAlert",
    props: {
        property: Object
    }
}
</script>