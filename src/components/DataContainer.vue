<template>
    <div>
        <template v-if="loading">
            <v-skeleton-loader
                height="80"
                type="list-item-two-line"
            >
            </v-skeleton-loader>
        </template>
        <template v-else>
            <slot />
        </template>
    </div>
</template>

<script>
export default {
    name: "DataContainer",
    props: {
        loading: Boolean
    }
}
</script>