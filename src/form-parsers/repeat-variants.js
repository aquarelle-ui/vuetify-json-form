import {ArrayControlParser} from "@aquarelle/json-form";

export default class extends ArrayControlParser
{
    getSubValidationProperty(definition, form, data, validator)
    {
        return 'variantValidations';
    }

    getConfig(definition, form)
    {
        if (!definition.config.variantField) {
            definition.config.variantField = 'variant_name';
        }
        return definition.config;
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
}