<template>
    <div>
        <v-select
                v-model="modelProxy[variantProp]"
                :error-messages="getAllErrors(variantProp)"

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
        <json-form-group v-if="currentItems !== null"
                         :model="modelProxy"
                         :validator="validatorProxy"
                         :items="currentItems"
                         :json-form-wrapper="jsonFormWrapper"
                         ref="formGroup"
        >
        </json-form-group>
    </div>
</template>
<script>
    import {JsonFormElementMixin, JsonFormGroup} from "@aquarelle/json-form";

    export default {
        components: {JsonFormGroup},
        name: 'variant-control',
        mixins: [JsonFormElementMixin],
        watch: {
            currentVariant(variant)
            {
                const v = this.validatorProxy;
                if (v && v[this.variantProp]) {
                    v[this.variantProp].$touch();
                }
                this.buildItems(variant);
            }
        },
        data()
        {
            return {
                currentItems: null,
                currentValidations: null,
            };
        },
        created()
        {
            const model = this.modelProxy;
            if (model && model[this.variantProp] !== null) {
                this.buildItems(model[this.variantProp]);
            }
        },
        computed: {
            currentVariantValidations()
            {
                return this.currentValidations;
            },
            allErrors()
            {
                return this.getAllErrors(this.variantProp);
            },
            currentVariant()
            {
                return this.modelProxy[this.variantProp] || null;
            },
            variantProp()
            {
                return this.config.variantField || 'variant_name';
            }
        },
        methods: {
            getVariantByName(name)
            {
                if (name === null) {
                    return null;
                }
                for (let i = 0, m = this.items.length; i < m; i++) {
                    if (this.items[i].name === name) {
                        return this.items[i];
                    }
                }
                return null;
            },
            buildItems(name)
            {
                if (name === null) {
                    this.currentItems.splice(0, this.currentItems.length);
                    this.currentValidations = null;
                    this.$nextTick(() => {
                        this.currentItems = null;
                    });
                    return;
                }

                const variant = this.getVariantByName(name);

                const validations = {};
                const items = this.$jsonForm.parseControlList(variant.items, validations);

                this.$nextTick(() => {
                    this.currentItems = items;
                    this.currentValidations = validations;
                });
            },
            onRouteLeave(func)
            {
                if (this.currentItems === null) {
                    return true;
                }
                return func(this.$refs.formGroup);
            }
        },
        beforeDestroy()
        {
            this.$delete(this.modelProxy, this.variantProp);
        }
    }
</script>