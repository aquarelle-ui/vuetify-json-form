import {NumberControlParser} from "@aquarelle/json-form";

export default class extends NumberControlParser
{
    getDefault(definition)
    {
        if (definition.hasOwnProperty('default')) {
            if (Array.isArray(definitions.default)) {
                return [Number(definition.default[0]), Number(definitions.default[1])];
            }
        }
        if (definition.nullable) {
            return null;
        }

        return [0, 100];
    }
}