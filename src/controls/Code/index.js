import {default as Control} from "./control.vue";
import {StringControlParser, JsonForm, ValidatorItem} from "@aquarelle/json-form";

class Parser extends StringControlParser
{
    getDefault(definition)
    {
        return typeof definition.default === 'string' ? definition.default : '';
    }

    getValidation(definition, form, data, validator)
    {
        if (definition.validation.hasOwnProperty('syntax')) {
            if (definition.validation.syntax === true) {
                definition.validation.syntax = {value: true};
            }
            if (typeof definition.validation.syntax === 'object' && definition.validation.syntax.value === true) {
                definition.validation.syntax.value = () => {
                    if (!data.$component || !data.$component.$refs || !data.$component.$refs.control) {
                        return false;
                    }
                    return !!data.$component.$refs.control.hasSyntaxError;
                };
            }
        }

        return super.getValidation(definition, form, data, validator);
    }
}

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.validator.add(new ValidatorItem('syntax', p => {
        if (typeof p.value !== 'function') {
            return null;
        }
        return p.value;
    }, 'Syntax error', 'ui:validation.code-syntax'));
    JsonForm.addControl('code', new Parser(Control.name));
};

export default Control;
