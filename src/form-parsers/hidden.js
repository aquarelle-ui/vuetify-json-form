import {ControlParser} from "@aquarelle/json-form";

export default class extends ControlParser
{
    getDefault(definition)
    {
        return definition.hasOwnProperty('default') ? definition.default : (definition.nullable ? null : undefined);
    }

    parse(definition, form, validator)
    {
        const data = super.parse(definition, form, validator);
        ControlParser.setConfigUsingValidation(data.config, definition.validation, ['required']);
        return data;
    }
}