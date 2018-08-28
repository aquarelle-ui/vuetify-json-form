<template>
    <v-text-field
            type="number"

            v-model="model[name]"
            @input="formatValue($event)"
            @blur="validate()"
            :error-messages="allErrors"

            :label="wrapper.translate(display.title)"

            :suffix="wrapper.translate(display.suffix)"
            :prefix="wrapper.translate(display.prefix)"
            :prepend-icon="$controlIcon(display.prependIcon)"
            :append-icon="$controlIcon(display.appendIcon)"

            :hint="wrapper.translate(display.hint)"
            :placeholder="wrapper.translate(display.placeholder)"
            :mask="display.mask"

            :clearable="display.clearable"

            :box="display.appearance === 'box'"
            :solo="display.appearance === 'solo'"
            :solo-inverted="display.appearance === 'solo-inverted'"
            :outline="display.appearance === 'outline'"

            :flat="!!display.flat"

            :counter="display.counter ? config.maxLength || false : false"

            :required="config.required"
            :maxlength="config.maxLength"
            :step="config.multipleOf || 1"
            :min="config.minimum"
            :max="config.maximum"
    ></v-text-field>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";
    export default {
        mixins: [JsonFormElementMixin],
        methods: {
            formatValue(val)
            {
                this.$set(this.model, this.name, Number(val));
            }
        }
    }
</script>