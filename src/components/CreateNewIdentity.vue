<template>
    <div>
        <template>
            <div class="text-center">
                <v-dialog
                v-model="create_new_identity"
                width="500"
                >
                <template v-slot:activator="{ on }">
                    <v-btn
                    color="primary"
                    dark
                    v-on="on"
                    >
                    Add new
                    </v-btn>
                </template>

                <v-card outlined :loading="saving_identity"> 
                    <v-card-title
                    class="headline grey lighten-2"
                    primary-title
                    >
                    New Identity
                    </v-card-title>
                    <v-card-text>
                        <v-form ref="upload_identity" >
                            <div class="my-5">
                                        <v-select
                                        v-model="country"
                                        :items="countries"
                                        menu-props="auto"
                                        label="Select country"
                                        hide-details
                                        prepend-icon="mdi-flag"
                                        single-line
                                        :rules="[rules.required]"
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
                                        :rules="[rules.required]"
                                    ></v-select>
                            </div>

                            <div class="my-5">
                                <v-row>
                                    <v-col cols="10">
                                        <div id="document-preview"></div>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-progress-circular
                                            :rotate="-90"
                                            :size="70"
                                            :width="15"
                                            :value="document.upload_progress"
                                            color="primary"
                                            >
                                            {{ document.upload_progress }}
                                        </v-progress-circular>
                                    </v-col>
                                </v-row>
                                
                                <template>
                                    <v-file-input
                                        v-model="document.file"
                                        color="primary accent-4"
                                        counter
                                        label="File input"
                                        placeholder="Select document"
                                        prepend-icon="mdi-paperclip"
                                        outlined
                                        @change="uploadIdentity"
                                        :rules="[rules.required]"
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
                            
                            <!-- <div class="my-5">
                                    <v-checkbox v-model="save_file" :label="`Save file in my archive for future reservations`"></v-checkbox>
                            </div> -->
                            
                        </v-form>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="red"
                        text
                        @click="create_new_identity = false"
                        
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        color="primary"
                        text
                        :disabled="!document.uploaded"
                        :loading="saving_identity"
                        @click="saveID"
                    >
                        Save and use ID
                    </v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </div>
            </template>
    </div>
</template>

<script>
    import CREATE_USER_ID from './../graphql/mutation/create_user_id'
    import GET_USER_IDENTITIES from './../graphql/query/get_user_identities'
    import file_helper from './../helper/file'
    import form_validation from './../helper/form_validation'
import { mapState } from 'vuex'

export default {
    
    data(){
        return {
            create_new_identity: false,
            saving_identity: false,
            document: {
                    file: null,
                    upload_progress: 0,
                    uploaded: false,
                    file_url: null
                },
            rules: form_validation.rules,
            country: '',
            
            save_file: false,
            countries: ['Canada', 'US', 'UK'],
            document_type: '',
            document_types: ['National Id card', 'International passport', 'Driving license'],
        }
    },
    computed: {
        ...mapState([
            'current_user'
        ])
    },
    props: [],
    methods: {
        uploadIdentity(file){
                this.document.file = file
                file_helper.previewSelectedImage(this.document.file, '#document-preview')
                this.verifying_identity = true
                const ext = file.name.split('.')[1]
                const saveAs = `private/identity/${this.current_user.auth.uid}.${ext}`

                const uploadTask = file_helper.uploadFile(this.document.file, saveAs)
                
                // Register three observers:
                // 1. 'state_changed' observer, called any time the state changes
                // 2. Error observer, called on failure
                // 3. Completion observer, called on successful completion
                uploadTask.on('state_changed', (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    this.document.upload_progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    }, (error) => {
                        alert("There was error uploading the file")
                    }, () => {
                    // Handle successful uploads on complete
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                            this.document.uploaded = true;
                            this.document.file_url = downloadURL;
                            console.log('uploaded to '+downloadURL)
                        });
                });
            },
            saveID(){
                if(this.$refs.upload_identity.validate()){
                    const variables = {
                            id: this.current_user.auth.uid,
                           title: this.document_type,
                           country: this.country,
                           document_type: this.document_type, 
                           document_url: this.document.file_url
                        }
                    this.saving_identity = true
                    this.$apollo.mutate({
                        // Query
                        mutation: CREATE_USER_ID,
                        variables: variables
                    })
                    .then( response => {
                        this.saving_identity = false
                        alert(`Your identity has been saved`)
                        console.log(response)
                        this.create_new_identity = false;
                        this.$emit('done', response.data.createUserIdentity)
                    })
                 }
            },
        }
        
}
</script>