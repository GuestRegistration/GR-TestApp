<template>
  <div>
    <v-autocomplete
        v-model="location"
        :loading="loading"
        :items="predictions"
        :search-input.sync="search"
        v-bind="$attrs"
        v-on="$listeners"
    ></v-autocomplete>

  </div>
</template>

<script>
import config from '../../config';

export default {
    name: "GooglePlaces",
    data: () => ({
      location: null,
      search: null,
      searchResults: [],
      service: null,
      loading: false
    }),

    metaInfo () {
      return {
        script: [{
          src: `https://maps.googleapis.com/maps/api/js?key=${config.google.api_key}&libraries=places`,
          async: true,
          defer: true,
          callback: () => this.MapsInit()
        }]
      }
    },

    computed: {
        predictions(){
            return this.searchResults.map(prediction => prediction.description);
        }
    },

    methods: {
      MapsInit () {
        this.service = new window.google.maps.places.AutocompleteService()
      },

      displaySuggestions (predictions, status) {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
          this.searchResults = []
          return
        }
        this.searchResults = predictions;
        this.loading = false
      }
    },

    watch: {
      search (val) {
        if (val) {
            this.loading = true
            this.service.getPlacePredictions({
                input: val,
                // types: ['(regions)']
            }, this.displaySuggestions)
        }
      }
    }
}
</script>