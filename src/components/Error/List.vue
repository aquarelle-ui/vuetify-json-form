<template>
    <div v-show="error !== null" class="v-messages mt-1 error--text" v-bind="$attrs">
        <div class="v-messages__message">
            {{error}}
        </div>
    </div>
</template>
<script>
    export default {
        name: 'list-error',
        props: {
            error: {type: String, default: null, required: false}
        }
    };
</script>