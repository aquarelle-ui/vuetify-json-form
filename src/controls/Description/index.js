import {default as Control} from "./control.vue";
import {ControlParser, JsonForm} from "@aquarelle/json-form";

class Parser extends ControlParser {
    getName() {
        return null;
    }
    getValidation() {
        return null;
    }
    getDefault(definition) {
        return undefined;
    }
}

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('description', new Parser(Control.name));
};

export default Control;
