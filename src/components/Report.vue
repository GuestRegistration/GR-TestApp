<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Hey...</v-card-title>
        <v-card-text>{{message}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="close">close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    data () {
      return {
        dialog: true,
        message: this._message
      }
    },
    props: ['_message'],
    methods:{
      close(){
        this.dialog = false
        this.$emit('close')
      }
    },
    watch: {
        _message: function(m){
            this.message = m
        }
    }
  }
</script>