<template>
    <v-slider
            v-model="model[name]"
            @input="formatValue($event)"
            @blur="validate()"
            :error-messages="allErrors"

            :label="$intl.translate(display.title)"
            :color="display.color || undefined"
            :thumb-color="display.thumbColor || undefined"
            :track-color="display.trackColor || undefined"


            :prepend-icon="$controlIcon(display.prependIcon)"
            :append-icon="$controlIcon(display.appendIcon)"
            :hint="$intl.translate(display.hint)"
            persistent-hint

            ticks
            :tick-labels="display.labels || undefined"

            thumb-label

            :required="config.required"
            :step="config.multipleOf || 1"
            :min="config.minimum || 0"
            :max="config.maximum || 100"
    >
        <template slot="thumb-label" slot-scope="props">
            <span>{{ getTickLabel(props.value) }}</span>
        </template>
    </v-slider>
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
            },
            getTickLabel(value)
            {
                if ((this.config.multipleOf || 1) !== 1) {
                    return value;
                }

                const index = value - (this.config.minimum || 0);
                if (this.display.labels && this.display.labels[index] != null) {
                    return this.display.labels[index];
                }
                return value;
            }
        }
    }
</script>