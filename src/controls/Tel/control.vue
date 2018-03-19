<template>
    <v-text-field
            type="tel"

            v-model="model[name]"
            @blur="validate()"
            :error-messages="allErrors"

            :label="$intl.translate(display.title)"

            :suffix="$intl.translate(display.suffix)"
            :prefix="$intl.translate(display.prefix)"
            :prepend-icon="$controlIcon(display.prependIcon) || 'phone'"
            :append-icon="$controlIcon(display.appendIcon)"
            :hint="$intl.translate(display.hint)"
            :placeholder="$intl.translate(display.placeholder)"
            :mask="display.mask"

            :clearable="display.clearable"
            :box="display.box"
            :counter="display.counter ? config.maxLength || false : false"

            :required="config.required"
            :maxlength="config.maxLength"
    ></v-text-field>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";

    export default {
        name: 'tel-control',
        mixins: [JsonFormElementMixin]
    }
</script>