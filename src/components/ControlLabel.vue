<template>
    <label v-show="text !== null" :class="{'error--text': hasError}">{{text}}</label>
</template>
<script>
    export default {
        name: 'control-label',
        props: {
            text: {type: String, required: false, default: null},
            hasError: {type: Boolean, required: false, default: false},
            required: {type: Boolean, required: false, default: false}
        }
    }
</script>