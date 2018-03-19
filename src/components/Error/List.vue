<template>
    <v-list-tile v-show="error !== null" class="input-group__details error--text">
        <v-list-tile-action class="input-group__messages input-group__error">
            {{error}}
        </v-list-tile-action>
    </v-list-tile>
</template>
<script>
    export default {
        name: 'list-error',
        props: {
            error: {type: String, default: null, required: false}
        }
    };
</script>