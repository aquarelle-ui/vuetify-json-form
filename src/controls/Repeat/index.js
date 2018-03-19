import {default as Control} from "./control.vue";
import {ArrayControlParser, JsonForm} from "vue-json-form";

class Parser extends ArrayControlParser {

    _isComponentValid(c) {
        if (!c || !c.validatorProxy) {
            return true;
        }
        return !c.validatorProxy.$each.$invalid;
    }

    parse(definition, form, validator) {
        const data = super.parse(definition, form, validator);
        data.validation.subvalidator = form.validator.get('subvalidator', {
            value: () => {
                return this._isComponentValid(this.getComponentFromData(data));
            },
            key: 'ui:validation.subvalidator_repeat',
            text: 'Some items have errors'
        });
        data.validation.$each = data.config.itemValidator;
        return data;
    }
}

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('repeat', new Parser(Control.name));
};

export default Control;
