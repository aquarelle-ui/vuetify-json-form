<template>
    <div>
        <v-select
                v-model="modelProxy[variantProp]"
                :error-messages="allErrors"

                :label="$intl.translate(display.title)"
                :hint="$intl.translate(display.hint)"
                :placeholder="$intl.translate(display.placeholder)"
                :prepend-icon="$controlIcon(display.prependIcon)"
                :append-icon="$controlIcon(display.appendIcon)"

                :required="config.required"

                :autocomplete="display.autocomplete"

                clearable

                :items="items"
                item-text="title"
                item-value="name"
                item-avatar="icon"
        >
        </v-select>
        <json-form-group v-if="currentVariant !== null"
                         :model="modelProxy"
                         :validator="$v.modelProxy"
                         :items="variant.items"
                         :json-form-wrapper="jsonFormWrapper"
                         >
        </json-form-group>
    </div>
</template>
<script>
    import {JsonFormElementMixin, JsonFormGroup} from "vue-json-form";

    export default {
        components: {JsonFormGroup},
        name: 'variant-control',
        mixins: [JsonFormElementMixin],
        validations() {
            if (this.currentVariant === null) {
                return true;
            }
            return {
                modelProxy: this.getVariantByName(this.currentVariant).validations,
            };
        },
        computed: {
            allErrors() {
                return this.getAllErrors(this.variantProp);
            },
            currentVariant() {
                return this.modelProxy[this.variantProp] || null;
            },
            variantProp() {
                return this.config.variantField || 'variant_name';
            },
            variant() {
                return this.getVariantByName(this.currentVariant);
            }
        },
        methods: {
            getVariantByName(name) {
                for (let i = 0, m = this.items.length; i < m; i++) {
                    if (this.items[i].name === name) {
                        return this.items[i];
                    }
                }
                return null;
            }
        },
        destroyed() {
            this.$delete(this.modelProxy, this.variantProp);
        }
    }
</script>