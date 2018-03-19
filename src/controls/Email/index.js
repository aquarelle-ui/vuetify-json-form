import {default as Control} from "./control.vue";
import {StringControlParser, ValidatorItem, JsonForm} from "@aquarelle/json-form";

class Parser extends StringControlParser {
    parse(definition, form, validator) {
        if (!definition.validation) {
            definition.validation = {};
        }
        if (!definition.validation.email) {
            definition.validation.email = true;
        }
        else if (typeof definition.validation.email === 'object') {
            definition.validation.email.value = true;
        }
        return super.parse(definition, form, validator);
    }
}

Control.install = function (Vue) {

    const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    JsonForm.validator.add(new ValidatorItem("email", p => p.value !== true ? null : v => {
        if (typeof v !== 'string') {
            return true;
        }
        if (v === '') {
            return true;
        }
        return EMAIL_REGEX.test(v);
    }, "Must be a valid e-mail", "ui:validation.email"));

    Vue.component(Control.name, Control);
    JsonForm.addControl('email', new Parser(Control.name));
};

export default Control;
