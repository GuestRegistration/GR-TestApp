<template>
        <v-dialog
        v-model="dialog"
        width="400"
        scrollable
        persistent
        >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
            >
            <slot>Instructions</slot>
            </v-btn>
        </template>
        <v-card>
            <v-card-title class="headline">
                <span>Reservation Instructions</span>
            </v-card-title>
             <v-card-text  v-if="reservation.approved">
                <div class="text-center mt-5" v-if="reservation.instruction">
                    {{reservation.instruction}}
                </div>
                <div class="text-center mt-5" v-else>
                    No checkin instruction
                </div>
                </v-card-text>
                <v-card-text v-else>
                    <v-alert 
                    border="top"
                    colored-border
                    elevation="2"
                    type="warning"
                    class="mt-5"
                    >
                        Your checkin needs to be approved before you can see instructions
                    </v-alert>
                </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" @click="dialog = false" text>close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>

<script>
export default {
    name: "ReservationInstructionDialog",
    data(){
        return {
            dialog: false
        }
    },
    props: {
        reservation: Object
    }
}
</script>