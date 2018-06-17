import {default as Control} from "./control.vue";

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
};

export default Control;
