import {SelectionControlParser} from "@aquarelle/json-form";

export default class extends SelectionControlParser
{

    getDefault(definition)
    {
        if (definition.config && definition.config.multiple) {
            return Array.isArray(definition.default) ? definition.default : [];
        }
        return definition.default == null ? (definition.nullable ? null : undefined) : definition.default;
    }

    parse(definition, form, validator)
    {
        const data = super.parse(definition, form, validator);
        if (data.config.multiple) {
            SelectionControlParser.setConfigUsingValidation(data.config, definition.validation, ['required', 'minItems', 'maxItems']);
        }
        else {
            SelectionControlParser.setConfigUsingValidation(data.config, definition.validation, ['required']);
        }
        return data;
    }
}