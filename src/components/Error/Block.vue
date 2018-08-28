<template>
    <div v-show="error !== null" class="v-messages error--text">
        <div class="v-messages__message">
            {{error}}
        </div>
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