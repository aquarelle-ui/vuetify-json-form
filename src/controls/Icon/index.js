import {default as Control} from "./control.vue";
import {StringControlParser, JsonForm} from "@aquarelle/json-form";

class Parser extends StringControlParser {
    parse(definition, form, validator) {
        if (!definition.validation) {
            definition.validation = {};
        }
        if (!definition.validation.pattern) {
            definition.validation.pattern = {
                value: '^(|([a-zA-Z0-9\\-\\_]+\\:[a-zA-Z0-9\\-\\_]+))$',
                key: 'ui:validation.icon',
                text: 'Invalid icon format'
            };
        }
        return super.parse(definition, form, validator);
    }
}

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('icon', new Parser(Control.name));
};

export default Control;
