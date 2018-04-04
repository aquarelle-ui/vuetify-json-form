<template>
    <v-radio-group
            v-model="model[name]"
            :column="!display.inline"
            :row="display.inline"

            :label="$intl.translate(display.title)"
            :error-messages="allErrors"
            :value-comparator="$equals"
            :required="config.required"
    >
        <v-radio v-for="(item, index) in items"
                 :key="index"
                 :label="$intl.translate(item.title)"
                 :value="item.value"
        >
        </v-radio>
    </v-radio-group>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";
    import VRadioGroupFixed from "../../components/VRadioGroupFixed";
    import ControlLabel from "../../components/ControlLabel.vue";

    export default {
        name: 'radio-control',
        components: {
            ControlLabel,
            'v-radio-group': VRadioGroupFixed
        },
        mixins: [JsonFormElementMixin],
        mounted()
        {
            if (this.model.hasOwnProperty(this.name)) {
                const exists = this.items.some(item => this.$equals(this.modelProxy, item.value));
                if (!exists) {
                    this.$delete(this.model, this.name);
                }
            }
        }
    }
</script>