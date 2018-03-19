import {default as Control} from "./control.vue";
import {BooleanControlParser as Parser, JsonForm} from "vue-json-form";

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('switch', new Parser(Control.name));
};

export default Control;
