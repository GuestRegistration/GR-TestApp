<template>
    <div>
        <div class="my-5">
            <h2 class="text-center">Terms and Condition</h2>
        </div>
        <div class="my-5">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Turpis egestas sed tempus urna et pharetra pharetra. Ut faucibus pulvinar elementum integer enim neque. Purus faucibus ornare suspendisse sed nisi lacus. Purus gravida quis blandit turpis cursus in hac habitasse platea. Nibh nisl condimentum id venenatis a. Ultricies mi eget mauris pharetra et ultrices neque. Sed id semper risus in hendrerit gravida rutrum. Viverra adipiscing at in tellus integer feugiat. Et molestie ac feugiat sed lectus vestibulum. Adipiscing elit duis tristique sollicitudin nibh sit amet. Sodales ut eu sem integer. Cursus in hac habitasse platea dictumst quisque sagittis purus. Gravida dictum fusce ut placerat orci nulla pellentesque dignissim enim. Malesuada fames ac turpis egestas sed tempus.</p>
        </div>
         <div class="my-5">
                <v-checkbox v-model="accepted" label="I accept the terms and condition`"></v-checkbox>
        </div>
        <div class="my-5">
            <v-btn
                text
                dark color="accent-4"
                class="primary"
                block
                @click="AcceptTnC"
                id="sign-in-button"
            >
                Continue
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                accepted: false
            }
        },
        props: ['reservation'],
        methods:{
            AcceptTnC(){
                this.$emit('done', this.accepted)
            }
        }

    }
</script>

<style scoped>

</style>

