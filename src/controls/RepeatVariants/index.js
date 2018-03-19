import {default as Control} from "./control.vue";
import {ArrayControlParser, JsonForm, setConfigUsingValidation} from "@aquarelle/json-form";

class Parser extends ArrayControlParser {

    getConfig(definition, form) {
        if (!definition.config.variantField) {
            definition.config.variantField = 'variant_name';
        }
        return definition.config;
    }

    getValidation(definition, form, data, validator) {
        definition.validation.subvalidator_control = {
            value: () => data,
            key: 'ui:validation.subvalidator_repeat-variant',
            text: 'Some items have errors'
        };
        return super.getValidation(definition, form, data, validator);
    }

    getItems(definition, form) {
        if (!Array.isArray(definition.items)) {
            return [];
        }
        return definition.items.map(item => {
            item = {...item};
            item.validations = {};
            if (Array.isArray(item.items)) {
                item.items = form.parseControlList(item.items, item.validations);
            }
            else {
                item.items = [];
            }
            return item;
        });
    }

    parse(definition, form, validator) {
        const data = super.parse(definition, form, validator);
        setConfigUsingValidation(data.config, definition.validation, ['required']);
        return data;
    }
}

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('repeat-variants', new Parser(Control.name));
};

export default Control;
