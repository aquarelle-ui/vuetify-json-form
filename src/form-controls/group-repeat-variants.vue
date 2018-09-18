<template>
    <div>
        <v-subheader v-if="Boolean(translatedTitle)">
            <control-label :text="translatedTitle" :has-error="allErrors.length > 0"
                           :required="config.required"></control-label>
        </v-subheader>
        <v-list v-for="region in config.regions" :key="region.name" subheader dense>
            <v-subheader>
                <control-label :text="wrapper.translate(region.title)" :has-error="hasErrors(region.name)"
                               :required="region.config.required"></control-label>
                <v-spacer></v-spacer>
                <v-menu offset-y :disabled="!canAddItem(region)" max-height="426">
                    <v-btn :disabled="!canAddItem(region)" small flat ripple slot="activator">
                        <v-icon>add</v-icon>
                        {{wrapper.translate(display.addButton || {key: 'ui:common.add', text: 'Add'})}}
                    </v-btn>
                    <v-list>
                        <v-list-tile v-for="variant in items" :key="variant.name" @click="addItem(region, variant)">
                            <v-list-tile-title>{{wrapper.translate(variantTitle(variant))}}</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-subheader>

            <draggable style="min-height: 2px" :list="modelProxy[region.name]" :options="dragOptions">
                <v-list-tile
                        v-for="(val, index) in modelProxy[region.name]"
                        :key="$uniqueObjectId(val, index)"
                        class="drag-item"
                        @click="editItem(region, val)">

                    <v-list-tile-avatar class="drag-handle">
                        <v-icon v-if="itemHasError(region, index)" color="red">error</v-icon>
                        <v-icon v-else>swap_vert</v-icon>
                        {{index + 1}}.
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                        <v-list-tile-title>{{itemTitle(val)}}</v-list-tile-title>
                        <v-list-tile-sub-title>
                            {{wrapper.translate(variantTitle(getVariantByName(val[config.variantField])))}}
                        </v-list-tile-sub-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                        <v-btn icon ripple @click.stop="removeItem(region, val)">
                            <v-icon color="red">delete</v-icon>
                        </v-btn>
                    </v-list-tile-action>
                </v-list-tile>
            </draggable>

            <v-list-tile class="sortable-empty-list-item" v-show="modelProxy[region.name].length === 0">
                <v-list-tile-content>
                    {{wrapper.translate(display.placeholder || {key: 'ui:common.empty_list', text: 'No items'})}}
                </v-list-tile-content>
            </v-list-tile>

            <template v-if="hasErrors(region.name)">
                <v-divider></v-divider>
                <list-error :error="getAllErrors(region.name)[0]"></list-error>
            </template>
        </v-list>

    </div>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";
    import {ControlLabel, ListError} from "../components";

    export default {
        mixins: [JsonFormElementMixin],
        components: {ControlLabel, ListError},
        data()
        {
            return {
                dragOptions: {
                    draggable: '.drag-item',
                    filter: '.drag-ignore',
                    handle: '.drag-handle',
                    group: 'region-' + this.$uniqueObjectId(this)
                }
            };
        },
        computed: {
            regionVariantValidations()
            {
                const model = this.modelProxy;
                if (!model || model.length === 0) {
                    return null;
                }

                const v = {};
                const p = this.config.variantField;

                const parser = this.wrapper.parser;
                this.config.regions.map(region => {
                    v[region.name] = region.validation ? parser.validator.getMultiple(region.validation) : {};

                    if (!Array.isArray(model[region.name])) {
                        return;
                    }

                    model[region.name].map((item, index) => {
                        v[region.name][index] = {};
                        parser.parseControlList(this.getVariantByName(item[p]).items, v[region.name][index]);
                    });
                });

                return v;
            },
            translatedTitle()
            {
                if (!this.display.title) {
                    return null;
                }
                return this.wrapper.translate(this.display.title) || null;
            }
        },
        methods: {
            variantTitle(variant)
            {
                if (variant.display && variant.display.title) {
                    return variant.display.title;
                }
                return variant.title;
            },
            itemTitle(val)
            {
                const v = this.getVariantByName(val[this.config.variantField]);
                let title = v.itemTitle || this.display.itemTitle;
                if (typeof title === "function") {
                    title = title(val);
                }
                if (!title) {
                    return null;
                }
                if (typeof title !== 'object') {
                    title = {key: null, text: title};
                }
                return this.wrapper.translate(title, val);
            },
            canAddItem(region)
            {
                const max = region.config.maxItems;
                if (!max || max < 0) {
                    return true;
                }

                const value = this.modelProxy[region.name];
                return !value || value.length < max;
            },
            itemHasError(region, index, dirty = false)
            {
                const v = this.validatorProxy;
                if (!v || !v[region.name] || !v[region.name][index]) {
                    return false;
                }

                if (!dirty && !v[region.name][index].$dirty) {
                    return false;
                }

                return v[region.name][index].$invalid;
            },
            getVariantByName(name)
            {
                for (let i = 0, m = this.items.length; i < m; i++) {
                    if (this.items[i].name === name) {
                        return this.items[i];
                    }
                }
                return null;
            },
            addItem(region, variant)
            {
                this.wrapper.pushUnparsedForm({
                    title: this.display.addTitle || {key: 'ui:common.addItemTitle', text: 'Create new item'},
                    button: this.display.addSubmitButtom || {key: 'ui:common.addSubmitButton', text: 'Add'},
                    model: {
                        [this.config.variantField]: variant.name
                    },
                    items: variant.items,
                    actions: {
                        submit: (original, copy) => {
                            this.modelProxy[region.name].push(copy);
                            this.validate();
                            return true;
                        }
                    }
                });
            },
            removeItem(region, val)
            {
                let index = this.modelProxy[region.name].indexOf(val);
                if (index >= 0) {
                    this.modelProxy[region.name].splice(index, 1);
                    this.validate();
                }
            },
            editItem(region, val)
            {
                let index = this.modelProxy[region.name].indexOf(val);
                const variant = this.getVariantByName(val[this.config.variantField]);
                this.wrapper.pushUnparsedForm({
                    title: this.display.editTitle || {key: 'ui:common.editItemTitle', text: 'Edit item'},
                    button: this.display.editSubmitButtom || {key: 'ui:common.editSubmitButton', text: 'Save changes'},
                    model: this.$clone(val),
                    items: variant.items,
                    actions: {
                        submit: (original, copy) => {
                            this.$set(this.modelProxy[region.name], index, copy);
                            this.validate();
                            return true;
                        }
                    }
                });
            }
        },
        created()
        {
            this.config.regions.map(item => {
                if (!this.modelProxy.hasOwnProperty(item.name)) {
                    this.$set(this.modelProxy, item.name, []);
                }
            });
        },
        beforeDestroy()
        {
            this.config.regions.map(item => {
                this.$delete(this.modelProxy, item.name);
            });
        }
    }
</script>