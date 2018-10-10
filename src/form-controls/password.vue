<template>
    <v-text-field
            :type="visible ? 'text' : 'password'"

            @click:append="toggle"

            v-model="model[name]"
            @blur="validate()"
            :error-messages="allErrors"

            :label="$intl.translate(display.title)"

            :suffix="$intl.translate(display.suffix)"
            :prefix="$intl.translate(display.prefix)"
            :prepend-inner-icon="$controlIcon(display.prependIcon)"
            :prepend-icon="$controlIcon(display.prependOuterIcon)"
            :append-outer-icon="$controlIcon(display.appendOuterIcon)"
            :append-icon="visible ? 'visibility_off' : 'visibility'"

            :hint="$intl.translate(display.hint)"
            :placeholder="$intl.translate(display.placeholder)"

            :clearable="display.clearable"

            :box="display.appearance === 'box'"
            :solo="display.appearance === 'solo'"
            :solo-inverted="display.appearance === 'solo-inverted'"
            :outline="display.appearance === 'outline'"

            :color="display.color || undefined"

            :flat="!!display.flat"

            :counter="display.counter ? config.maxLength || false : false"

            :required="config.required"
            :maxlength="config.maxLength"
    ></v-text-field>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";

    export default {
        mixins: [JsonFormElementMixin],
        data()
        {
            return {visible: false};
        },
        methods: {
            toggle()
            {
                this.visible = !this.visible;
            }
        }
    }
</script>