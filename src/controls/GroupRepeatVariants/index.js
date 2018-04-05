import {default as Control} from "./control.vue";
import {ControlParser, JsonForm, setConfigUsingValidation} from "@aquarelle/json-form";

class Parser extends ControlParser
{
    getSubValidationProperty(definition, form, data, validator)
    {
        return 'regionVariantValidations';
    }

    getDefault(definition, form)
    {
        let def = null;
        if (typeof definition.default === 'object') {
            def = {...definition.default};
        }
        else {
            def = {}
        }
        if (Array.isArray(definition.config.regions)) {
            definition.config.regions.map(item => {
                if (!def.hasOwnProperty(item.name) || !Array.isArray(def[item.name])) {
                    def[item.name] = [];
                }
            })
        }
        return def;
    }

    getConfig(definition, form)
    {
        if (!definition.config.variantField) {
            definition.config.variantField = 'variant_name';
        }
        return definition.config;
    }

    getValidation(definition, form, data, validator)
    {
        const validation = super.getValidation(definition, form, data, validator);

        data.config.regions.map(region => {
            if (!validation[region.name]) {
                validation[region.name] = {};
            }

            let v = null;
            if (typeof region.validation === 'object') {
                v = form.validator.getMultiple(region.validation, false);
            }
            else {
                v = {};
                region.validation = {};
            }

            region.config = {};

            setConfigUsingValidation(region.config, region.validation, ['required', 'minItems', 'maxItems']);

            if (validation.hasOwnProperty(region.name)) {
                validation[region.name] = {...validation[region.name], ...v};
            }
            else {
                validation[region.name] = v;
            }
        });

        return validation;
    }

    getItems(definition, form, data, validator)
    {
        if (!definition.items || !Array.isArray(definition.items)) {
            return [];
        }

        return definition.items.map(item => {
            item = {...item};
            if (Array.isArray(item.items)) {
                item.items = [];
            }
            return item;
        });
    }

    parse(definition, form, validator)
    {
        const data = super.parse(definition, form, validator);
        setConfigUsingValidation(data.config, definition.validation, ['required']);
        return data;
    }
}

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('group-repeat-variants', new Parser(Control.name));
};

export default Control;
