import {StringControlParser} from "@aquarelle/json-form";

export default class extends StringControlParser
{
    parse(definition, form, validator)
    {
        if (!definition.validation) {
            definition.validation = {};
        }
        if (!definition.validation.url) {
            definition.validation.url = true;
        }
        else {
            if (typeof definition.validation.url === 'object') {
                definition.validation.url.value = true;
            }
        }
        return super.parse(definition, form, validator);
    }
}