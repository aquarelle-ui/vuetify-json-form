<template>
    <v-text-field
            type="text"

            v-model="model[name]"
            @blur="validate()"
            :error-messages="allErrors"

            :label="$intl.translate(display.title)"

            :suffix="$intl.translate(display.suffix)"
            :prefix="$intl.translate(display.prefix)"
            :prepend-icon="$controlIcon(display.prependIcon)"
            :append-icon="$controlIcon(model[name] || '')"
            :hint="$intl.translate(display.hint)"
            :placeholder="$intl.translate(display.placeholder)"
            :mask="display.mask"

            :box="display.box"
            :counter="display.counter ? config.maxLength || false : false"

            :required="config.required"
            :maxlength="config.maxLength"
    ></v-text-field>
</template>
<script>
    import {JsonFormElementMixin} from "vue-json-form";

    export default {
        name: 'icon-control',
        mixins: [JsonFormElementMixin]
    }
</script>