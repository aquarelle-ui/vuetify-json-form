import {default as Control} from "./control";
import {ControlParser, JsonForm} from "@aquarelle/json-form";

class Parser extends ControlParser
{
    getSubValidationProperty(definition, form, data, validator)
    {
        if (!definition.config) {
            return null;
        }
        return definition.config.validatorProp || null;
    }
}

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('component', new Parser(Control.name));
};

export default Control;
