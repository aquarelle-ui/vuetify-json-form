import {JsonForm} from "@aquarelle/json-form";

import {default as controls} from "./controls";
import {default as validators} from "./validators";

import "./style.css";

export * from "./form-controls"
export * from "./form-parsers";
export * from "./components";

export function install(Vue) {
    Vue.use(JsonForm);

    // controls
    for (const name in controls) {
        if (controls.hasOwnProperty(name)) {
            JsonForm.addControl(name, controls[name]);
        }
    }
    // validators
    for (const name in validators) {
        if (validators.hasOwnProperty(name)) {
            JsonForm.validator.add(validators[name]);
        }
    }

    // control icon
    Vue.prototype.$controlIcon = function (icon) {
        if (typeof icon !== 'string') {
            return undefined;
        }
        return icon.replace(':', '-');
    };
}

