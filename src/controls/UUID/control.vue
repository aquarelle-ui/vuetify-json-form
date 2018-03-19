<template></template>
<script>
    import {JsonFormElementMixin} from "vue-json-form";
    export default {
        name: 'uuid-control',
        mixins: [JsonFormElementMixin],
        created() {
            if (this.name !== null && typeof this.model[this.name] !== 'string') {
                const id = this.$uuid(typeof this.config.separator === 'string' ? this.config.separator : '-');
                this.$set(this.model, this.name, id);
            }
        }
    };
</script>