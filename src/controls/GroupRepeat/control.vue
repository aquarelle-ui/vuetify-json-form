<template>
    <div>
        <v-subheader v-if="Boolean(translatedTitle)">
            <control-label :text="$intl.translate(display.title)" :has-error="allErrors.length > 0" :required="config.required"></control-label>
        </v-subheader>
        <v-list v-for="region in config.regions" :key="region.name" subheader dense>
            <v-subheader>
                <control-label :text="$intl.translate(region.title)" :has-error="getAllErrors(region.name).length > 0"
                               :required="region.config.required"></control-label>
                <v-spacer></v-spacer>
                <v-btn :disabled="!canAddItem(region)" small flat ripple @click.stop="addItem(region)">
                    <v-icon>add</v-icon>
                    {{$intl.translate(display.addButton || {key: 'ui:common.add', text: 'Add'})}}
                </v-btn>
            </v-subheader>

            <draggable style="min-height: 2px" :list="modelProxy[region.name]" :options="dragOptions">

                <v-list-tile
                        v-for="(val, index) in modelProxy[region.name]"
                        class="drag-item"
                        :key="$uniqueObjectId(val, index)"
                        @click="editItem(region, val)">

                    <v-list-tile-avatar class="drag-handle">
                        <v-icon v-if="itemHasError(region, index)" color="red">error</v-icon>
                        <v-icon v-else>swap_vert</v-icon>
                        {{index + 1}}.
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                        <v-list-tile-title>{{itemTitle(val)}}</v-list-tile-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                        <v-btn icon ripple @click.stop="removeItem(region, val)">
                            <v-icon color="red">delete</v-icon>
                        </v-btn>
                    </v-list-tile-action>
                </v-list-tile>

                <v-list-tile class="sortable-empty-list-item" v-show="modelProxy[region.name].length === 0">
                    <v-list-tile-content>
                        {{$intl.translate(display.placeholder || {key: 'ui:common.empty_list', text: 'No items'})}}
                    </v-list-tile-content>
                </v-list-tile>
            </draggable>

            <template v-if="getAllErrors(region.name).length > 0">
                <v-divider></v-divider>
                <list-error :error="getAllErrors(region.name)[0]"></list-error>
            </template>

        </v-list>
    </div>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";
    import draggable from 'vuedraggable'
    import ControlLabel from "../../components/ControlLabel.vue";
    import ListError from "../../components/Error/List.vue";

    export default {
        name: 'group-repeat-control',
        mixins: [JsonFormElementMixin],
        components: {draggable, ControlLabel, ListError},
        data() {
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
            translatedTitle() {
                if (!this.display.title) {
                    return null;
                }
                return this.$intl.translate(this.display.title) || null;
            }
        },
        methods: {
            itemTitle(val) {
                let title = this.display.itemTitle;
                if (!title) {
                    return null;
                }
                if (typeof title !== 'object') {
                    title = {key: null, text: title};
                }
                return this.$intl.translate(title, val);
            },
            itemHasError(region, index, dirty = false) {
                const v = this.validatorProxy;
                if (!v || !v.hasOwnProperty(region.name) || !v[region.name]) {
                    return false;
                }

                if (!v[region.name].$invalid || (!dirty && !v[region.name].$dirty)) {
                    return false;
                }

                if (!v[region.name].$each || !v[region.name].$each[index]) {
                    return false;
                }

                return v[region.name].$each[index].$invalid;
            },
            canAddItem(region) {
                return !region.config.maxItems || this.modelProxy[region.name].length < region.config.maxItems;
            },
            addItem(region) {
                this.jsonFormWrapper.pushForm({
                    title: this.display.addTitle || {key: 'ui:common.addItemTitle', text: 'Create new item'},
                    button: this.display.addSubmitButtom || {key: 'ui:common.addSubmitButton', text: 'Add'},
                    model: {},
                    items: this.items,
                    validator: this.config.itemValidator,
                    actions: {
                        submit: (original, copy) => {
                            this.modelProxy[region.name].push(copy);
                            return true;
                        }
                    }
                });
            },
            removeItem(region, val) {
                let index = this.modelProxy[region.name].indexOf(val);
                this.modelProxy[region.name].splice(index, 1);
            },
            editItem(region, val) {
                let index = this.modelProxy[region.name].indexOf(val);
                this.jsonFormWrapper.pushForm({
                    title: this.display.editTitle || {key: 'ui:common.editItemTitle', text: 'Edit item'},
                    button: this.display.editSubmitButtom || {key: 'ui:common.editSubmitButton', text: 'Save changes'},
                    model: this.$clone(val),
                    items: this.items,
                    validator: this.config.itemValidator,
                    actions: {
                        submit: (original, copy) => {
                            this.$set(this.modelProxy[region.name], index, copy);
                            return true;
                        }
                    }
                });
            }
        },
        created() {
            this.config.regions.map(item => {
                if (!this.modelProxy.hasOwnProperty(item.name)) {
                    this.$set(this.modelProxy, item.name, []);
                }
            });
        },
        destroyed() {
            this.config.regions.map(item => {
                this.$delete(this.modelProxy, item.name);
            });
        }
    }
</script>