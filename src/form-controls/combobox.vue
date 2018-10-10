<template>
    <v-combobox
            v-model="model[name]"
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

            :box="display.appearance === 'box'"
            :solo="display.appearance === 'solo'"
            :solo-inverted="display.appearance === 'solo-inverted'"
            :outline="display.appearance === 'outline'"

            :flat="!!display.flat"

            :chips="Boolean(display.chips && config.multiple)"
            deletable-chips

            :color="display.color || undefined"

            :items="items"
            :search-input.sync.trim="search"


            :multiple="!!config.multiple"
    >

    </v-combobox>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";

    export default {
        mixins: [JsonFormElementMixin],
        data()
        {
            return {
                search: null
            }
        }
    }
</script>