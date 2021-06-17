<template>
    <a :href="path" @click.prevent="navigate" class="text-decoration-none">
        <slot />
    </a>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
    name: 'PropertyLink',
    props: {
        to: Object
    },
    computed: {
        ...mapGetters([
            'current_user'
        ]),
        route() {
            return this.$router.resolve(this.to).route;
        },
        path() {
            return this.route.fullPath;
        },
    },
    methods: {
        ...mapMutations([
            'SET_ACTIVE_PROPERTY'
        ]),

        //Set the property as active property before navigating to the route 
        navigate() {
            const property = this.current_user.profile.properties.find(p => p.id == this.route.params.id);
            if(property) {
                this.SET_ACTIVE_PROPERTY(property);
                this.$router.push(this.path);
            }
        }
    }
}
</script>