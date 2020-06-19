<template>
  <v-row justify="center">
    <v-dialog v-model="loading" persistent max-width="290">
      <v-card>
        <v-card-text>
          <div class="text-center pa-5">
            CHILL...
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    data () {
      return {
        loading: true,
      }
    },
    props: [],
    methods:{
      
    },
    watch: {
        
    }
  }
</script>