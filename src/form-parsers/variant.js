import {ControlParser} from "@aquarelle/json-form";

export default class extends ControlParser
{
    getSubValidationProperty(definition, form, data, validator)
    {
        return 'currentVariantValidations';
    }

    getDefault(definition)
    {
        let f = definition.config && definition.config.variantField ? definition.config.variantField : 'variant_name';
        if (typeof definition.default === 'object') {
            return {[f]: null, ...definition.default};
        }
        return {
            [f]: null
        };
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
        if (data.name == null) {
            validator[data.config.variantField] = super.getValidation(definition, form, data, validator);
            return {};
        }
        return {
            [data.config.variantField]: super.getValidation(definition, form, data, validator)
        };
    }

    getItems(definition, form)
    {
        if (!Array.isArray(definition.items)) {
            return [];
        }
        return definition.items.map(item => {
            item = {...item};
            if (!Array.isArray(item.items)) {
                item.items = [];
            }
            return item;
        });
    }

    parse(definition, form, validator)
    {
        const data = super.parse(definition, form, validator);
        ControlParser.setConfigUsingValidation(data.config, definition.validation, ['required']);
        return data;
    }
}

