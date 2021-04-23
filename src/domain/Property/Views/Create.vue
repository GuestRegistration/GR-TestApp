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
            this.$refs.app.alert(`New property ${property.name} created successfully`, 'success');
            this.property = property;
            this.$store.commit('ADD_USER_PROPERTY', property)
            this.$router.push({name: 'property.edit', params: {id: this.property.id, tab: 'gateway', new: true }})
        }
    },
}
</script>
