import {default as Control} from "./control.vue";
import {ObjectControlParser, JsonForm} from "@aquarelle/json-form";

class Parser extends ObjectControlParser
{
    getDefault(definition, form)
    {
        return definition.default && typeof definition.default === 'object' ? {...definition.default} : null;
    }

    getItems(definition) {
        if (!definition.items || !Array.isArray(definition.items)) {
            return [];
        }
        return definition.items;
    }

    getSubValidationProperty()
    {
        return 'validations';
    }
}

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('switch-group', new Parser(Control.name));
};

export default Control;
