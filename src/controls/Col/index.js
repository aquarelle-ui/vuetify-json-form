import {default as Control} from "./control.vue";
import {ObjectControlParser as Parser, JsonForm} from "vue-json-form";

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('col', new Parser(Control.name));
};

export default Control;
