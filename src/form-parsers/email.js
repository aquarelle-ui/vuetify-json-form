import {StringControlParser} from "@aquarelle/json-form";

export default class extends StringControlParser
{
    parse(definition, form, validator)
    {
        if (!definition.validation) {
            definition.validation = {};
        }
        if (!definition.validation.email) {
            definition.validation.email = true;
        }
        else {
            if (typeof definition.validation.email === 'object') {
                definition.validation.email.value = true;
            }
        }
        return super.parse(definition, form, validator);
    }
}