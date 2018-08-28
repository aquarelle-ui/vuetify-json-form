import {ControlParser} from "@aquarelle/json-form";

export default class extends ControlParser
{
    getName()
    {
        return null;
    }

    getValidation()
    {
        return null;
    }

    getDefault(definition)
    {
        return undefined;
    }
}
