import {default as Control} from "./control.vue";
import {ArrayControlParser, JsonForm} from "@aquarelle/json-form";

class Parser extends ArrayControlParser
{
    getSubValidationProperty(definition, form, data, validator) {
        return 'validations';
    }

    getItems(definition, form, data, validator) {
        if (!Array.isArray(definition.items)) {
            return [];
        }

        return definition.items;
    }
}

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('repeat', new Parser(Control.name));
};

export default Control;
