<template>
    <app-layer ref="app">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" sm="8" md="6">
                    <div class="mt-3">
                        <property-form @property-created="propertyCreated" >
                            <template #heading>
                                <h2 class="ml-3">Create property</h2>
                            </template>
                        </property-form>
                    </div>
                </v-col>
            </v-row>
        </v-container>
               
    </app-layer>
</template>

<script>
import AppLayer from '@/AppLayer';
import PropertyForm from '../Components/PropertyForm.vue';

export default {
    name: 'CreateProperty',
    components: {
        AppLayer, PropertyForm
    }, 
    data(){
        return {
            property: null,
        }
    },

    computed:{

    },
    
    methods:{
        propertyCreated(property){
            this.property = property;
            this.$router.push({name: 'property.settings', params: {id: this.property.id, tab: 'subscription', new: true }})
        }
    },
}
</script>
