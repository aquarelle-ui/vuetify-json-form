<template>
    <v-checkbox

            v-model="model[name]"
            @blur="validate()"
            :error-messages="allErrors"

            :label="$intl.translate(display.title)"
            :prepend-icon="$controlIcon(display.prependIcon)"
            :append-icon="$controlIcon(display.appendIcon)"
            :hint="$intl.translate(display.hint)"

            :false-value="false"
            :true-value="true"

            :required="config.required"
    ></v-checkbox>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";

    export default {
        name: 'checkbox-control',
        mixins: [JsonFormElementMixin]
    }
</script>