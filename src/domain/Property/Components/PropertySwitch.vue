<template>
    <v-select
        class="mx-2"
        :items="propertiesSwitch"
        item-text="name"
        item-value="id"
        dense
        :value="current_user.property.id"
        @change="switchProperty"
    ></v-select>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: "PropertySwitch",
    computed: {
        ...mapGetters([
            'current_user',
            'profile_loaded'
        ]),
        
        propertiesSwitch(){
          return this.profile_loaded && this.current_user.profile.properties ? 
                this.current_user.profile.properties : []
        }
    },
    methods: {
    ...mapMutations([
      'SET_ACTIVE_PROPERTY'
    ]),

    switchProperty(property){
      const activeProperty = this.current_user.profile.properties.find(p => p.id == property);
      this.SET_ACTIVE_PROPERTY(activeProperty);
      this.$emit('change', activeProperty);
      this.$eventHub.$emit('property-switched', activeProperty);
    }

  },
}
</script>