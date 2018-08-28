<template>
    <v-text-field
            type="text"

            v-model="model[name]"
            @blur="validate()"
            :error-messages="allErrors"

            :label="wrapper.translate(display.title)"

            :suffix="wrapper.translate(display.suffix)"
            :prefix="wrapper.translate(display.prefix)"
            :prepend-icon="$controlIcon(display.prependIcon)"
            :append-icon="$controlIcon(model[name] || '')"
            :hint="wrapper.translate(display.hint)"
            :placeholder="wrapper.translate(display.placeholder)"

            :box="display.appearance === 'box'"
            :solo="display.appearance === 'solo'"
            :solo-inverted="display.appearance === 'solo-inverted'"
            :outline="display.appearance === 'outline'"

            :flat="!!display.flat"

            :counter="display.counter ? config.maxLength || false : false"

            :required="config.required"
            :maxlength="config.maxLength"
    ></v-text-field>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";

    export default {
        mixins: [JsonFormElementMixin]
    }
</script>