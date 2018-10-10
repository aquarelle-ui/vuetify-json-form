<template>
    <v-text-field
            type="number"

            v-model="model[name]"
            @input="formatValue($event)"
            @blur="validate()"
            :error-messages="allErrors"

            :label="$intl.translate(display.title)"

            :suffix="$intl.translate(display.suffix)"
            :prefix="$intl.translate(display.prefix)"
            :prepend-inner-icon="$controlIcon(display.prependIcon)"
            :prepend-icon="$controlIcon(display.prependOuterIcon)"
            :append-icon="$controlIcon(display.appendIcon)"
            :append-outer-icon="$controlIcon(display.appendOuterIcon)"

            :hint="$intl.translate(display.hint)"
            :placeholder="$intl.translate(display.placeholder)"
            :mask="display.mask"

            :clearable="display.clearable"

            :box="display.appearance === 'box'"
            :solo="display.appearance === 'solo'"
            :solo-inverted="display.appearance === 'solo-inverted'"
            :outline="display.appearance === 'outline'"

            :flat="!!display.flat"

            :color="display.color || undefined"

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