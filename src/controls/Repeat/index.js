import {default as Control} from "./control.vue";
import {ArrayControlParser, JsonForm} from "@aquarelle/json-form";

class Parser extends ArrayControlParser
{
    parse(definition, form, validator)
    {
        const data = super.parse(definition, form, validator);
        data.validation.$each = data.config.itemValidator;
        return data;
    }
}

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('repeat', new Parser(Control.name));
};

export default Control;
