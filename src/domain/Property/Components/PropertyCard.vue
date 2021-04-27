<template>
  <v-card
  >
    <v-img
      v-if="property.image"
      :src="property.image"
      height="200px"
    ></v-img>
    <v-img v-else
      src="@/assets/img/default-property.jpg"
      height="200px"
    ></v-img>

    <v-card-title>
      <router-link :to="{name: 'property.show', params: {id: property.id, _property: property}}" class="text-decoration-none">
        {{ property.name }}
      </router-link>
      <v-spacer></v-spacer>
      <slot name="action" />
    </v-card-title>

    <v-card-subtitle>
      {{ property.full_address }}
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

