import {StringControlParser} from "@aquarelle/json-form";

export default class extends StringControlParser
{
    parse(definition, form, validator)
    {
        if (!definition.validation) {
            definition.validation = {};
        }
        if (!definition.validation.tel) {
            definition.validation.tel = true;
        }
        else {
            if (typeof definition.validation.tel === 'object') {
                definition.validation.tel.value = true;
            }
        }
        return super.parse(definition, form, validator);
    }
}