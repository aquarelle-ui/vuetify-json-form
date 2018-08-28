<template>
    <v-textarea

            v-model="model[name]"
            @blur="validate()"
            :error-messages="allErrors"

            :label="wrapper.translate(display.title)"
            :hint="wrapper.translate(display.hint)"
            :placeholder="wrapper.translate(display.placeholder)"
            :rows="display.rows"

            :suffix="wrapper.translate(display.suffix)"
            :prefix="wrapper.translate(display.prefix)"
            :prepend-icon="$controlIcon(display.prependIcon)"
            :append-icon="$controlIcon(display.appendIcon)"

            :auto-grow="!!display.autoGrow"

            :clearable="display.clearable"

            :box="display.appearance === 'box'"
            :solo="display.appearance === 'solo'"
            :solo-inverted="display.appearance === 'solo-inverted'"
            :outline="display.appearance === 'outline'"

            :flat="!!display.flat"

            :counter="display.counter ? config.maxLength || false : false"

            :required="config.required"
            :maxlength="config.maxLength"
    ></v-textarea>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";

    export default {
        mixins: [JsonFormElementMixin]
    }
</script>