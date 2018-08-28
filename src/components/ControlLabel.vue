<template>
    <label class="v-label" v-show="text != null && text !== ''" :class="{'error--text': hasError}">{{text}}<sup style="user-select: none" v-show="required">*</sup></label>
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