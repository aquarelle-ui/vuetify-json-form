import {default as Control} from "./control.vue";
import {StringControlParser, ValidatorItem, JsonForm} from "vue-json-form";

class Parser extends StringControlParser {
    parse(definition, form, validator) {
        if (!definition.validation) {
            definition.validation = {};
        }
        if (!definition.validation.url) {
            definition.validation.url = true;
        }
        else if (typeof definition.validation.url === 'object') {
            definition.validation.url.value = true;
        }
        return super.parse(definition, form, validator);
    }
}

Control.install = function (Vue) {
    const URL_REGEX = /^(https?:\/\/)?((([a-zd]([a-zd-]*[a-zd])*).)+[a-z]{2,}|((d{1,3}.){3}d{1,3}))(:d+)?(\/[-a-zd%_.~+]*)*(\?[;&a-zd%_.~+=-]*)?(#[-a-zd_]*)?$/i;
    JsonForm.validator.add(new ValidatorItem("url", p => p.value !== true ? null : v => {
        if (typeof v !== 'string') {
            return true;
        }
        if (v === '') {
            return true;
        }
        return URL_REGEX.test(v);
    }, "Must be a valid url", "ui:validation.url"));

    Vue.component(Control.name, Control);
    JsonForm.addControl('url', new Parser(Control.name));
};

export default Control;
