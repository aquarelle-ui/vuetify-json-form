<template>
    <v-combobox
            v-model="model[name]"
            @blur="validate()"
            :error-messages="allErrors"

            :label="wrapper.translate(display.title)"

            :suffix="wrapper.translate(display.suffix)"
            :prefix="wrapper.translate(display.prefix)"
            :prepend-icon="$controlIcon(display.prependIcon)"
            :append-icon="$controlIcon(display.appendIcon)"

            :hint="wrapper.translate(display.hint)"
            :placeholder="wrapper.translate(display.placeholder)"

            :box="display.appearance === 'box'"
            :solo="display.appearance === 'solo'"
            :solo-inverted="display.appearance === 'solo-inverted'"
            :outline="display.appearance === 'outline'"

            :flat="!!display.flat"

            :chips="Boolean(display.chips && config.multiple)"
            deletable-chips


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