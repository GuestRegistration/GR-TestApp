<template>
  <v-card
    max-width="344"
  >
    <v-img
      :src="property.image"
      height="200px"
    ></v-img>

    <v-card-title>
      <router-link :to="{name: 'property.show', params: {property: property.id, _property: property}}">
        {{ property.name }}
      </router-link>
      
    </v-card-title>

    <v-card-subtitle>
      {{ property.address.city }} {{ property.address.country }}
    </v-card-subtitle>

  </v-card>
</template>

<script>
    export default {
        name: "PropertyCard",
        data(){
            return {
                property: {}
            }
        },
        props: {
            _property: Object
        },
       
        watch: {
            _property: {
                immediate: true,
                handler(property){
                    this.property = property;
                }
            }
        }
    }
</script>

