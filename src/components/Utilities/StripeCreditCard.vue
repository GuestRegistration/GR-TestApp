<template>
<div>
    <v-card v-bind="$attrs" v-if="card">
    <v-card-title >
        <h4 class="headline"> **** **** **** {{ card.last4 }}</h4>
        <v-spacer></v-spacer>
        {{ card.brand }}
        <!-- <v-img src="@/assets/img/credit-cards/visa.png" width="20"></v-img> -->
    </v-card-title>
    <v-card-text>
        Expires {{ card.exp_month }}/{{ card.exp_year }}
    </v-card-text>
    <v-card-actions>
        <slot name="actions" v-bind="{card}" />
    </v-card-actions>
</v-card>
<v-card v-else v-bind="$attrs">
    <v-card-text>
        <p class="grey--text text-center my-3">No credit card</p>
    </v-card-text>
</v-card>

</div>
</template>

<script>
export default {
    name: "StripeCreditCard",
    data(){
        return {
            cards: {
                visa: 'visa.png',
                mastercard: 'mastercard.png'

            }
        }
    },
    props: {
        card: Object
    },

}
</script>