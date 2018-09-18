import {ControlParser} from "@aquarelle/json-form";

export default class extends ControlParser
{
    getSubValidationProperty(definition, form, data, validator) {
        return 'validations';
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

    getValidation(definition, form, data, validator)
    {
        const validation = super.getValidation(definition, form, data, validator);

        data.config.regions.map(region => {
            if (region.validation == null || typeof region.validation !== 'object') {
                region.validation = {};
            }

            region.config = {};

            ControlParser.setConfigUsingValidation(region.config, region.validation, ['required', 'minItems', 'maxItems']);
        });

        return validation;
    }

    getItems(definition, form, data, validator)
    {
        if (!definition.items || !Array.isArray(definition.items)) {
            return [];
        }
        return definition.items;
    }

    parse(definition, form, validator)
    {
        const data = super.parse(definition, form, validator);
        ControlParser.setConfigUsingValidation(data.config, definition.validation, ['required']);
        return data;
    }
}

