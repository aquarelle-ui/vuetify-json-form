<template>
    <v-text-field
            :type="visible ? 'text' : 'password'"

            :append-icon="visible ? 'visibility_off' : 'visibility'"
            @click:append="toggle"

            v-model="model[name]"
            @blur="validate()"
            :error-messages="allErrors"

            :label="wrapper.translate(display.title)"

            :suffix="wrapper.translate(display.suffix)"
            :prefix="wrapper.translate(display.prefix)"
            :prepend-icon="$controlIcon(display.prependIcon)"

            :hint="wrapper.translate(display.hint)"
            :placeholder="wrapper.translate(display.placeholder)"

            :clearable="display.clearable"

            :box="display.appearance === 'box'"
            :solo="display.appearance === 'solo'"
            :solo-inverted="display.appearance === 'solo-inverted'"
            :outline="display.appearance === 'outline'"

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