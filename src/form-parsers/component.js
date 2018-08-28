import {ControlParser} from "@aquarelle/json-form";

export default class extends ControlParser
{
    getSubValidationProperty(definition, form, data, validator)
    {
        if (!definition.config) {
            return null;
        }
        return definition.config.validatorProp || null;
    }
}