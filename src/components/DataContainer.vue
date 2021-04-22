<template>
    <div>
        <template v-if="loading">
            <slot name="loading">
                <v-skeleton-loader
                    height="80"
                    :type="type"
                >
                </v-skeleton-loader>
            </slot>
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
        loading: Boolean,
        type: {
            default: () => 'list-item-two-line'
        }
    }
}
</script>