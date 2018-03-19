<template>
    <v-text-field
            type="text"
            textarea

            v-model="model[name]"
            @blur="validate()"
            :error-messages="allErrors"

            :label="$intl.translate(display.title)"
            :hint="$intl.translate(display.hint)"
            :placeholder="$intl.translate(display.placeholder)"
            :mask="display.mask"
            :rows="display.rows"

            :box="display.box"
            :counter="display.counter ? config.maxLength || false : false"

            :required="config.required"
            :maxlength="config.maxLength"
    ></v-text-field>
</template>
<script>
    import {JsonFormElementMixin} from "vue-json-form";

    export default {
        name: 'textarea-control',
        mixins: [JsonFormElementMixin]
    }
</script>