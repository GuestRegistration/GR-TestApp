<template>
    <div id="container">
        <canvas></canvas>
        <div v-if="editable">
            <v-btn v-if="!signatureEmpty" small dark color="error" class="mx-2" @click="clear">
                <v-icon class="mr-2">mdi-close</v-icon> Clear
            </v-btn>
            <v-btn v-if="active" small dark color="primary" class="mx-2" @click="save">
                <v-icon class="mr-2">mdi-check</v-icon> Done
            </v-btn>
            <v-btn v-else small dark color="primary" class="mx-2" @click="on">
                <v-icon class="mr-2">mdi-pen</v-icon> Edit
            </v-btn>
        </div>
    </div>
</template>

<script>
import SignaturePad from 'signature_pad';

export default {
    name: "SignaturePad",
    data(){
        return {
            canvas: null,
            signaturePad: null,
            active: false,
        }
    },
    props: {
       signature: String,
       editable: Boolean,
    },
    computed: {
        signatureEmpty(){
            return this.signaturePad && this.signaturePad.isEmpty()
        }
    },
    methods: {
        on(){
            this.signaturePad.on();
            this.resizeCanvas()
            this.active = true;
            this.$emit('input', null);
        },
        off(){
            this.signaturePad.off();
            this.active = false;
        },
        clear(){
            this.signaturePad.clear();
            this.on();
        },
        resizeCanvas() {
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            this.canvas.width = this.canvas.offsetWidth * ratio;
            this.canvas.height = this.canvas.offsetHeight * ratio;
            this.canvas.getContext("2d").scale(ratio, ratio);
            this.signaturePad.clear();
        },

        save(){
            this.off();
            if(this.signaturePad.isEmpty()){
                this.$emit('input', null);
            }else{
                const dataURL = this.signaturePad.toDataURL()
                this.$emit('input', dataURL);
            }
        }
    },

    mounted(){

        this.canvas = document.querySelector("canvas");
        this.signaturePad = new SignaturePad(this.canvas, {
            backgroundColor: '#ffffff'
        });
        setTimeout(() => {
            this.resizeCanvas();
            if(this.signature){
                this.signaturePad.fromDataURL(this.signature)
            }
            this.off();
        }, 500)
       
        // window.addEventListener("resize", () => this.resizeCanvas());
    },

    watch: {
        signature: {
            immediate: false,
            handler(sign) {
                if(sign){
                    this.signaturePad.fromDataURL(sign);
                    this.off();
                }
            }
        }
    }
}
</script>

<style scoped>
    #container {
        background-color: #f7f7f7;
        padding: 5px;
        text-align: center;
    }
    #actions{
        margin-top: 5px;
    }
    canvas {
        width: 100%;
    }
</style>
