<template>
    <v-slider
            v-model="model[name]"
            @input="formatValue($event)"
            @blur="validate()"
            :error-messages="allErrors"

            :label="wrapper.translate(display.title)"
            :color="display.color || undefined"

            :prepend-icon="$controlIcon(display.prependIcon)"
            :append-icon="$controlIcon(display.appendIcon)"
            :hint="wrapper.translate(display.hint)"
            persistent-hint
            :ticks="!!display.ticks"

            thumb-label

            :required="config.required"
            :step="config.multipleOf || 1"
            :min="config.minimum"
            :max="config.maximum"
    ></v-slider>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";

    export default {
        name: 'slider-control',
        mixins: [JsonFormElementMixin],
        methods: {
            formatValue(val)
            {
                this.$set(this.model, this.name, Number(val));
            }
        }
    }
</script>