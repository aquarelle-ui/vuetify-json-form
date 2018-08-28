import {SelectionControlParser} from "@aquarelle/json-form";

export default class extends SelectionControlParser
{
    parse(definition, form, validator)
    {
        const data = super.parse(definition, form, validator);
        SelectionControlParser.setConfigUsingValidation(data.config, definition.validation, ['minItems', 'maxItems']);
        return data;
    }
}