import {default as Control} from "./control.vue";
import {ControlParser, JsonForm, setConfigUsingValidation} from "@aquarelle/json-form";

class Parser extends ControlParser {
    getDefault(definition) {
        return definition.hasOwnProperty('default') ? definition.default : undefined;
    }
    parse(definition, form, validator) {
        const data = super.parse(definition, form, validator);
        setConfigUsingValidation(data.config, definition.validation, ['required']);
        return data;
    }
}

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('hidden', new Parser(Control.name));
};

export default Control;
