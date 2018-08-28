import {ObjectControlParser} from "@aquarelle/json-form";

export default class extends ObjectControlParser
{
    getDefault(definition, form)
    {
        return definition.default && typeof definition.default === 'object' ? {...definition.default} : null;
    }

    getItems(definition) {
        if (!definition.items || !Array.isArray(definition.items)) {
            return [];
        }
        return definition.items;
    }

    getSubValidationProperty()
    {
        return 'validations';
    }
}