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
            definition = {...definition};
            const validation = {...definition.validation};
            if (validation.syntax === true) {
                validation.syntax = {value: true};
            }
            if (typeof validation.syntax === 'object' && validation.syntax.value === true) {
                validation.syntax.value = () => {
                    if (!data.$component) {
                        return true;
                    }
                    return !data.$component.hasSyntaxError;
                };
            }
            definition.validation = validation;
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
