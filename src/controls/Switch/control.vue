<template>
    <v-switch

            v-model="model[name]"
            @blur="validate()"
            :error-messages="allErrors"

            :label="$intl.translate(display.title)"
            :prepend-icon="$controlIcon(display.prependIcon)"
            :append-icon="$controlIcon(display.appendIcon)"
            :hint="$intl.translate(display.hint)"
            persistent-hint

            :false-value="false"
            :true-value="true"

            :required="config.required"
    ></v-switch>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";

    export default {
        name: 'switch-control',
        mixins: [JsonFormElementMixin]
    }
</script>