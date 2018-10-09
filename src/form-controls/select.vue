<template>
    <v-select
            v-model="model[name]"
            :error-messages="allErrors"

            :loading="translatedItems.length === 0"
            :label="$intl.translate(display.title)"
            :hint="$intl.translate(display.hint)"
            persistent-hint
            :placeholder="$intl.translate(display.placeholder)"
            :prepend-icon="$controlIcon(display.prependIcon)"
            :append-icon="$controlIcon(display.appendIcon)"

            :multiple="config.multiple || false"
            :required="config.required"


            :items="translatedItems"
            :item-value="valueProp"
            :item-text="titleProp"
            :item-avatar="iconProp"

            :value-comparator="$equals"

            :clearable="!!display.clearable"

            :box="display.appearance === 'box'"
            :solo="display.appearance === 'solo'"
            :solo-inverted="display.appearance === 'solo-inverted'"
            :outline="display.appearance === 'outline'"
            :flat="!!display.flat"
    >
        <template v-if="!!display.chips" :slot="display.chips ? 'selection' : undefined" slot-scope="data">
            <v-chip v-if="config.multiple"
                    close
                    @input="removeChip(data)"
                    :selected="data.selected"
                    :disabled="data.disabled"
                    :key="$uniqueObjectId(data.item)"
            >
                <v-avatar v-if="display.icons && !!data.item[iconProp]" class="accent">
                    <v-icon>{{$controlIcon(data.item[iconProp])}}</v-icon>
                </v-avatar>
                {{data.item[titleProp]}}
            </v-chip>
            <template v-else>
                <v-icon v-if="display.icons && !!data.item[iconProp]" class="mr-1">
                    {{$controlIcon(data.item[iconProp])}}
                </v-icon>
                <span class="grey--text text--darken-4">{{data.item[titleProp]}}</span>
            </template>
        </template>
        <template v-if="display.icons === true" :slot="display.icons ? 'item' : undefined" slot-scope="data">
            <v-list-tile-avatar>
                <v-icon v-if="!!data.item[iconProp]" :color="isItemSelected(data) ? 'accent' : undefined">
                    {{$controlIcon(data.item[iconProp])}}
                </v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content :color="isItemSelected(data) ? 'accent' : undefined">
                <v-list-tile-title>
                    {{data.item[titleProp]}}
                </v-list-tile-title>
                <v-list-tile-sub-title>
                    {{data.item[descriptionProp]}}
                </v-list-tile-sub-title>
            </v-list-tile-content>
        </template>
    </v-select>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";

    export default {
        mixins: [JsonFormElementMixin],
        data()
        {
            return {
                translatedItems: []
            };
        },
        created()
        {
            this.translatedItems = this.translateItems(this.items);
        },
        methods: {
            removeChip(data)
            {
                if (this.config.multiple) {
                    data.parent.selectItem(data.item);
                }
                else {
                    this.$delete(this.model, this.name);
                }
            },
            isItemSelected(data)
            {
                if (this.config.multiple) {
                    return data.parent.selectedItems.indexOf(data.item) > -1;
                }
                return data.parent.selectedItem === data.item;
            },
            translateItems(items)
            {
                return items.map(item => {
                    if (!item.hasOwnProperty(this.valueProp)) {
                        if (item.hasOwnProperty('header')) {
                            return {header: this.$intl.translate(item.header)};
                        }
                        return item;
                    }
                    item = {...item};
                    item[this.titleProp] = this.$intl.translate(item[this.titleProp]);
                    item[this.descriptionProp] = this.$intl.translate(item[this.descriptionProp]);
                    if (item[this.iconProp]) {
                        item[this.iconProp] = this.$controlIcon(item[this.iconProp]);
                    }
                    return item;
                });
            }
        },
        computed: {
            titleProp()
            {
                return this.config.titleProp || 'title';
            },
            valueProp()
            {
                return this.config.valueProp || 'value';
            },
            descriptionProp()
            {
                return this.config.descriptionProp || 'description';
            },
            iconProp()
            {
                return this.config.iconProp || 'icon';
            },
            itemsProp()
            {
                return this.config.itemsProp || 'items';
            }
        }
    }
</script>