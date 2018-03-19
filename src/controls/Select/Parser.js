import {setConfigUsingValidation, ControlParser} from "vue-json-form";

export default class extends ControlParser {

    constructor(element, group) {
        super(element);
        this._group = group;
    }

    getDefault(definition) {
        if (definition.config && definition.config.multiple) {
            return Array.isArray(definition.default) ? definition.default : [];
        }
        return definition.default || undefined;
    }

    getConfig(definition) {
        return {
            titleProp: 'title',
            groupTitleProp: 'title',
            valueProp: 'value',
            iconProp: 'icon',
            descriptionProp: 'description',
            itemsProp: 'items',
            multiple: false,
            ...definition.config,
            group: this._group
        };
    }

    getItems(definition, form, data, validator) {
        if (!definition.items || !Array.isArray(definition.items)) {
            return [];
        }

        if (!data.config.group) {
            return definition.items;
        }

        const itemsProp = data.config.itemsProp;
        const titleProp = data.config.titleProp;
        const groupTitleProp = data.config.groupTitleProp;

        const items = [];
        let first = true;
        definition.items.map(group => {
            if (!group[itemsProp] || !Array.isArray(group[itemsProp]) || group[itemsProp].length === 0) {
                return;
            }
            if (first) {
                first = false;
            }
            else {
                items.push({divider: true});
            }
            items.push({header: group[groupTitleProp]});
            group[itemsProp].map(item => {
                if (!item[titleProp]) {
                    item[titleProp] = '';
                }
                items.push(item);
            });
        });
        return items;
    }

    parse(definition, form, validator) {
        const data = super.parse(definition, form, validator);
        if (data.config.multiple) {
            setConfigUsingValidation(data.config, definition.validation, ['required', 'minItems', 'maxItems']);
        }
        else {
            setConfigUsingValidation(data.config, definition.validation, ['required']);
        }
        return data;
    }
}