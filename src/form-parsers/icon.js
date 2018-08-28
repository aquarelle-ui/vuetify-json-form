import {StringControlParser} from "@aquarelle/json-form";

export default class extends StringControlParser
{
    parse(definition, form, validator)
    {
        if (!definition.validation) {
            definition.validation = {};
        }
        if (!definition.validation.pattern) {
            definition.validation.pattern = {
                value: '^(|([a-zA-Z0-9\\-\\_]+\\:[a-zA-Z0-9\\-\\_]+))$',
                key: 'ui:validation.icon',
                text: 'Invalid icon format'
            };
        }
        return super.parse(definition, form, validator);
    }
}