<template>
    <div class="d-flex align-center">
        <div class="flex-grow-1">
            <input type="text" id="clipboard-input" v-model="text" readonly />
        </div>
        <v-btn class="mx-2" v-if="text" @click="copy" color="primary"><v-icon>mdi-content-copy</v-icon>  Copy</v-btn>
    </div>
</template>

<script>
export default {
    name: "ClipBoard",
    data(){
        return {
            text: ''
        }
    },

    props: {
        value: String
    },

    methods: {
        copy() {
            const input = document.getElementById('clipboard-input');
            input.select();
            if(document.execCommand('copy')){
                this.$store.commit("SNACKBAR", {
                    status: true,
                    text: "Copied to clipboard",
                    color: "success"
                });
            }else{
                this.$store.commit("SNACKBAR", {
                    status: true,
                    text: "Could not copy key to clipboard",
                    color: "error"
                });
            }
        }
    },

    watch: {
        value: {
            immediate: true,
            handler(v){
                if(v){
                    this.text = v;
                }
            }
        }
    }
}
</script>

<style scoped>
    #clipboard-input{
        padding: 10px;
        width: 100%;
        background-color: #f7f7f7;
    }
    #clipboard-input:focus {
        outline: none;
    }
</style>