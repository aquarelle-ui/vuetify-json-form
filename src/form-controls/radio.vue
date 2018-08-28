<template>
    <v-radio-group
            v-model="model[name]"
            :column="!display.inline"
            :row="!!display.inline"

            :label="wrapper.translate(display.title)"
            :error-messages="allErrors"
            :value-comparator="$equals"
            :mandatory="!!config.required"
    >
        <v-radio v-for="(item, index) in items"
                 :class="{'ml-1': index === 0 && !!display.inline}"
                 :key="index"
                 :label="wrapper.translate(item.title)"
                 :value="item.value"
                 :color="item.color || display.color || undefined"
        >
        </v-radio>
    </v-radio-group>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";

    export default {
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