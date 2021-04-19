<template>
    <v-dialog 
    v-model="dialog"
    scrollable  
    max-width="600px"
    >
        <property-form :property="property" />
    </v-dialog>
</template>

<script>
import PropertyForm from './PropertyForm.vue';

export default {
    name: "PropertyFormDialog",
    components: {
        PropertyForm
    },
}
</script>