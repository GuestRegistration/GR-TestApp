<template>
    <v-container class="text-center">
        <v-row justify="center">
            <v-col cols="12" md="4" class="text-center">
                <v-skeleton-loader
                    type="image"
                    height="100"
                    width="100"
                    class="mb-5 "
                    
                ></v-skeleton-loader>

                <v-skeleton-loader
                    type="heading"
                ></v-skeleton-loader>
            </v-col>
            <v-col cols="12" md="6">
                <v-skeleton-loader
                    type="heading, list-item-two-line"
                ></v-skeleton-loader>
                <v-skeleton-loader
                    type="card"
                ></v-skeleton-loader>
                 
            </v-col>
        </v-row>
        
    </v-container>
    
</template>
<script>
export default {
    name: "ReservationSkeleton"
}
</script>