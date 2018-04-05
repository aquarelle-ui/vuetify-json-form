<template>
    <v-list subheader dense>
        <v-subheader>
            <control-label :text="$intl.translate(display.title)" :has-error="allErrors.length > 0"
                           :required="config.required"></control-label>
            <v-spacer></v-spacer>
            <v-btn :disabled="!canAddItem" small flat ripple @click.stop="addItem()">
                <v-icon>add</v-icon>
                {{$intl.translate(display.addButton || {key: 'ui:common.add', text: 'Add'})}}
            </v-btn>
        </v-subheader>

        <draggable :list="modelProxy" :options="dragOptions">
            <v-list-tile v-for="(val, index) in modelProxy" :key="$uniqueObjectId(val, index)"
                         @click="editItem(val)">

                <v-list-tile-avatar class="drag-handle">
                    <v-icon v-if="itemHasError(index)" color="red">error</v-icon>
                    <v-icon v-else>swap_vert</v-icon>
                    {{index + 1}}.
                </v-list-tile-avatar>

                <v-list-tile-content>
                    <v-list-tile-title>{{itemTitle(val)}}</v-list-tile-title>
                </v-list-tile-content>

                <v-list-tile-action>
                    <v-btn icon ripple @click.stop="removeItem(val)">
                        <v-icon color="red">delete</v-icon>
                    </v-btn>
                </v-list-tile-action>
            </v-list-tile>

            <v-list-tile class="sortable-empty-list-item" v-show="modelProxy.length === 0">
                <v-list-tile-content>
                    {{$intl.translate(display.placeholder || {key: 'ui:common.empty_list', text: 'No items'})}}
                </v-list-tile-content>
            </v-list-tile>
        </draggable>

        <template v-if="allErrors.length > 0">
            <v-divider></v-divider>
            <list-error :error="allErrors[0]"></list-error>
        </template>
    </v-list>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";
    import draggable from 'vuedraggable'
    import ControlLabel from "../../components/ControlLabel.vue";
    import ListError from "../../components/Error/List.vue";

    export default {
        name: 'repeat-control',
        mixins: [JsonFormElementMixin],
        components: {draggable, ControlLabel, ListError},
        data()
        {
            return {
                dragOptions: {
                    handle: '.drag-handle'
                }
            };
        },
        computed: {
            canAddItem()
            {
                const max = this.config.maxItems;
                if (!max || max < 0) {
                    return true;
                }

                const value = this.modelProxy;
                return !value || value.length < max;
            },
            validations()
            {
                const model = this.modelProxy;
                if (!model || model.length === 0) {
                    return null;
                }
                const v = {};
                const length = model.length;
                const parser = this.$jsonForm;
                const items = this.items;
                for (let i = 0; i < length; i++) {
                    v[i] = {};
                    parser.parseControlList(items, v[i]);
                }
                return v;
            }
        },
        methods: {
            itemTitle(val)
            {
                let title = this.display.itemTitle;
                if (!title) {
                    return null;
                }
                if (typeof title !== 'object') {
                    title = {key: null, text: title};
                }
                return this.$intl.translate(title, val);
            },
            itemHasError(index, dirty = false)
            {
                const v = this.validatorProxy;
                if (!v || !v[index]) {
                    return false;
                }

                if (!dirty && !v[index].$dirty) {
                    return false;
                }

                return v[index].$invalid;
            },
            addItem()
            {
                this.jsonFormWrapper.pushUnparsedForm({
                    title: this.display.addTitle || {key: 'ui:common.addItemTitle', text: 'Create new item'},
                    button: this.display.addSubmitButtom || {key: 'ui:common.addSubmitButton', text: 'Add'},
                    model: {},
                    items: this.items,
                    actions: {
                        submit: (original, copy) => {
                            this.modelProxy.push(copy);
                            this.validate();
                            return true;
                        }
                    }
                });
            },
            removeItem(val)
            {
                let index = this.modelProxy.indexOf(val);
                if (index >= 0) {
                    this.modelProxy.splice(index, 1);
                    this.validate();
                }
            },
            editItem(val)
            {
                let index = this.modelProxy.indexOf(val);
                this.jsonFormWrapper.pushUnparsedForm({
                    title: this.display.editTitle || {key: 'ui:common.editItemTitle', text: 'Edit item'},
                    button: this.display.editSubmitButtom || {key: 'ui:common.editSubmitButton', text: 'Save changes'},
                    model: this.$clone(val),
                    items: this.items,
                    actions: {
                        submit: (original, copy) => {
                            this.$set(this.modelProxy, index, copy);
                            this.validate();
                            return true;
                        }
                    }
                });
            }
        }
    }
</script>