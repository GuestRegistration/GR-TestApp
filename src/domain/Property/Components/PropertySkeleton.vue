<template>
    <v-container class="text-center">
        <v-row justify="center">
            <v-col cols="12" md="6" class="text-center">
                <v-skeleton-loader
                    type="card"
                    height="200"
                    class="mb-5 "
                    
                ></v-skeleton-loader>
            </v-col>
        </v-row>
        
    </v-container>
    
</template>
<script>
export default {
    name: "PropertySkeleton"
}
</script>