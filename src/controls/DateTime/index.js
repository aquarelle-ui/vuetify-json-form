import {default as Control} from "./control.vue";
import {DateTimeControlParser as Parser, JsonForm} from "@aquarelle/json-form";

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('date-time', new Parser(Control.name));
};

export default Control;
