import {ArrayControlParser} from "@aquarelle/json-form";

export default class extends ArrayControlParser
{
    getSubValidationProperty(definition, form, data, validator) {
        return 'validations';
    }

    getItems(definition, form, data, validator) {
        if (!Array.isArray(definition.items)) {
            return [];
        }

        return definition.items;
    }
}