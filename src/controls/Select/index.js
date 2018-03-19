import {default as Control} from "./control.vue";
import {JsonForm} from "vue-json-form";
import Parser from "./Parser";

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('select', new Parser(Control.name, false));
    JsonForm.addControl('select-group', new Parser(Control.name, true));
};

export default Control;
