<template>
    <v-switch
            class="mt-0"
            v-model="model[name]"
            @blur="validate()"
            :error-messages="allErrors"

            :color="display.color || undefined"
            :label="wrapper.translate(display.title)"
            :prepend-icon="$controlIcon(display.prependIcon)"
            :append-icon="$controlIcon(display.appendIcon)"
            :hint="wrapper.translate(display.hint)"
            persistent-hint

            :false-value="false"
            :true-value="true"

            :required="config.required"
    ></v-switch>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";

    export default {
        mixins: [JsonFormElementMixin]
    }
</script>