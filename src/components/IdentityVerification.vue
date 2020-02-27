<template>
    <div>
        <div class="my-5">
            <h2 class="text-center">Identity Verification</h2>
        </div>
        <v-card 
        :loading="verifying_identity"
        >
            <v-card-text>
                <div class="my-5">
                    <v-form ref="confirm_verification" >
                        <div class="my-5">
                                    <v-select
                                    v-model="country"
                                    :items="countries"
                                    menu-props="auto"
                                    label="Select country"
                                    hide-details
                                    prepend-icon="mdi-flag"
                                    single-line
                                    ></v-select>
                        </div>

                        <div class="my-5">  
                                <v-select
                                    v-model="document_type"
                                    :items="document_types"
                                    menu-props="auto"
                                    label="Document type"
                                    hide-details
                                    single-line
                                    prepend-icon="mdi-paperclip"
                                ></v-select>
                        </div>

                        <div class="my-5">
                            <template>
                                <v-file-input
                                   
                                    color="primary accent-4"
                                    counter
                                    label="File input"
                                    placeholder="Select document"
                                    prepend-icon="mdi-paperclip"
                                    outlined
                                   
                                >
                                    <template v-slot:selection="{ index, text }">
                                    <v-chip
                                        color="primary accent-4"
                                        dark
                                        label
                                        small
                                    >
                                        {{ text }}
                                    </v-chip>
                                    </template>
                                </v-file-input>
                                </template>
                        </div>
                        
                        <div class="my-5">
                             <v-checkbox v-model="save_file" :label="`Save file in my archive for future reservations`"></v-checkbox>
                        </div>
                        <div class="my-5">
                            <v-btn
                                text
                                dark color="accent-4"
                                class="primary"
                                block
                                @click="verifyIdentity"
                                id="sign-in-button"
                                :loading="verifying_identity"
                            >
                                Continue
                            </v-btn>
                        </div>
                    </v-form>
                </div>
            </v-card-text>
        </v-card>
            
    </div>
</template>

<script>
    export default {
        data(){
            return {
                verifying_identity: false,
                country: '',
                file: '',
                save_file: false,
                countries: ['Canada', 'US', 'UK'],
                document_type: '',
                document_types: ['National Id card', 'International passport', 'Driving license'],
                rules: {
                    required: value => !!value || 'Required.'
                }

            }
        },
        methods: {
            verifyIdentity(){
                this.verifying_identity = true
                setTimeout(()=>{
                    this.verifying_identity = false
                    this.$emit('done')
                }, 3000)
            }

        }
    }
</script>

<style scoped>

</style>

