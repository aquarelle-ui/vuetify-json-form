<template>
    <v-icon v-bind="$attrs" v-text="icon"></v-icon>
</template>
<script>
    export default {
        name: 'control-icon',
        computed: {
            icon() {
                const d = this.$slots.default;
                if (!d || !d[0]) {
                    return undefined;
                }
                return this.$controlIcon(d[0].text);
            }
        }
    };
</script>