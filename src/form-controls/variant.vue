<template>
    <div>
        <v-select
                v-model="modelProxy[variantProp]"
                :error-messages="getAllErrors(variantProp)"

                :label="wrapper.translate(display.title)"
                :hint="wrapper.translate(display.hint)"
                :placeholder="wrapper.translate(display.placeholder)"
                :prepend-icon="$controlIcon(display.prependIcon)"
                :append-icon="$controlIcon(display.appendIcon)"

                :required="config.required"


                clearable

                :box="display.appearance === 'box'"
                :solo="display.appearance === 'solo'"
                :solo-inverted="display.appearance === 'solo-inverted'"
                :outline="display.appearance === 'outline'"
                :flat="!!display.flat"

                :items="selectItems"
                item-text="title"
                item-value="name"
                item-avatar="icon"

                :loading="loading"
                :disabled="loading"
        >
        </v-select>
        <json-form-group v-if="currentItems !== null"
                         :model="modelProxy"
                         :validator="validatorProxy"
                         :items="currentItems"
                         :wrapper="wrapper"
                         :path="path"
                         :parent-validations-container="parentValidationsContainer"
                         :validations-container="validationsContainer"
                         ref="formGroup"
        >
        </json-form-group>
    </div>
</template>
<script>
    import {JsonFormElementMixin, JsonFormGroup} from "@aquarelle/json-form";

    export default {
        components: {JsonFormGroup},
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
                loading: false,
                selectItems: this.items,
                currentItems: null,
                currentValidations: {},
            };
        },
        created()
        {
            const init = () => {
                const model = this.modelProxy;
                if (model && model[this.variantProp] != null) {
                    this.buildItems(model[this.variantProp]);
                }
            };
            if (typeof this.config.variantLoader === 'function') {
                this.loading = true;
                this.config.variantLoader(this)
                    .then(items => {
                        this.selectItems = items || [];
                        init();
                        this.loading = false;
                    });
            } else {
                init();
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
                return this.selectItems.find(item => item.name === name);
            },
            clearObject(obj)
            {
                for (let prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        this.$delete(obj, prop);
                    }
                }
                return obj;
            },
            buildItems(name)
            {
                if (name === null) {
                    this.currentItems = null;
                    this.clearObject(this.currentValidations);
                    return;
                }

                const variant = this.getVariantByName(name);

                this.currentValidations = this.clearObject(this.currentValidations);

                const validations = {};
                this.currentItems = this.wrapper.parser.parseControlList(variant.items, validations);

                for (let prop in validations) {
                    if (validations.hasOwnProperty(prop)) {
                        this.$set(this.currentValidations, prop, validations[prop]);
                    }
                }
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
            this.currentItems = null;
            this.clearObject(this.currentValidations);
        }
    }
</script>