<template>
    <label :class="$mergeClasses({'v-label': true, 'error--text': hasError}, $attrs.class)" v-show="text != null && text !== ''">{{text}}<sup style="user-select: none" v-show="required">*</sup></label>
</template>
<script>
    export default {
        name: 'control-label',
        props: {
            text: {type: String, required: false, default: null},
            hasError: {type: Boolean, required: false, default: false},
            required: {type: Boolean, required: false, default: false},
        }
    }
</script>