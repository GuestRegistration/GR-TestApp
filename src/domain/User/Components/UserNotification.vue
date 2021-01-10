<template>
    <div>
        <v-card>
            <v-card-text>
                <p>{{ notification.text }}</p>
                <small class="grey--text">{{ notification.time }}</small>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    export default {
        name: "UserNotification",
        data(){
            return {

            }
        },
        props: {
            notification: Object
        },
       
    }
</script>

<style scoped>

</style>
