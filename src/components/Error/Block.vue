<template>
    <div v-show="error !== null" class="input-group__details error--text">
        <span class="input-group__messages input-group__error">
            {{error}}
        </span>
    </div>
</template>
<script>
    export default {
        name: 'block-error',
        props: {
            error: {type: String, default: null, required: false}
        }
    };
</script>