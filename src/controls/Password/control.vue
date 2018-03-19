<template>
    <v-text-field
            :type="visible ? 'text' : 'password'"
            :append-icon="visible ? 'visibility_off' : 'visibility'"
            :append-icon-cb="toggle"

            v-model="model[name]"
            @blur="validate()"
            :error-messages="allErrors"

            :label="$intl.translate(display.title)"

            :suffix="$intl.translate(display.suffix)"
            :prefix="$intl.translate(display.prefix)"
            :prepend-icon="$controlIcon(display.prependIcon)"

            :hint="$intl.translate(display.hint)"
            :placeholder="$intl.translate(display.placeholder)"
            :mask="display.mask"

            :box="display.box"
            :counter="display.counter ? config.maxLength || false : false"

            :required="config.required"
            :maxlength="config.maxLength"
    ></v-text-field>
</template>
<script>
    import {JsonFormElementMixin} from "vue-json-form";

    export default {
        name: 'password-control',
        mixins: [JsonFormElementMixin],
        data() {
            return {visible: false}
        },
        methods: {
            toggle() {
                this.visible = !this.visible;
            }
        }
    }
</script>