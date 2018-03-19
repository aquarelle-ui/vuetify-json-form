import {default as Control} from "./control.vue";
import {StringControlParser, ValidatorItem, JsonForm} from "@aquarelle/json-form";

class Parser extends StringControlParser {
    parse(definition, form, validator) {
        if (!definition.validation) {
            definition.validation = {};
        }
        if (!definition.validation.tel) {
            definition.validation.tel = true;
        }
        else if (typeof definition.validation.tel === 'object') {
            definition.validation.tel.value = true;
        }
        return super.parse(definition, form, validator);
    }
}

Control.install = function (Vue) {

    const TEL_REGEX = /[a-z0-9#*-.+() ]+/i;
    JsonForm.validator.add(new ValidatorItem("tel", p => p.value !== true ? null : v => {
        if (typeof v !== 'string') {
            return true;
        }
        if (v === '') {
            return true;
        }
        return TEL_REGEX.test(v);
    }, "Must be a valid phone number", "ui:validation.tel"));

    Vue.component(Control.name, Control);
    JsonForm.addControl('tel', new Parser(Control.name));
};

export default Control;
