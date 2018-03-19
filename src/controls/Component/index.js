import {default as Control} from "./control";
import {ControlParser as Parser, JsonForm} from "vue-json-form";

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('component', new Parser(Control.name));
};

export default Control;
