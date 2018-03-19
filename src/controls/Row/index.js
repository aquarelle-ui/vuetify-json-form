import {default as Control} from "./control.vue";
import {ObjectControlParser as Parser, JsonForm} from "@aquarelle/json-form";

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('row', new Parser(Control.name));
};

export default Control;
