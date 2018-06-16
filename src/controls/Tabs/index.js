import {default as Control} from "./control.vue";
import {ControlParser, JsonForm, setConfigUsingValidation} from "@aquarelle/json-form";

class Parser extends ControlParser
{
    getDefault(definition, form)
    {
        let def = {};
        if (Array.isArray(definition.items)) {
            definition.items.map(item => {
                if (item.name) {
                    def[item.name] = {};
                }
            });
        }
        return def;
    }

    getItems(definition, form, data, validator)
    {
        if (!Array.isArray(definition.items)) {
            return [];
        }

        const validation = data.name == null ? validator : data.validation;

        const items = definition.items.map(item => {
            item = {...item};

            let v = null;
            if (item.name) {
                if (!validation.hasOwnProperty(item.name)) {
                    validation[item.name] = {};
                }
                v = validation[item.name];
            }
            else {
                v = validation;
            }

            if (Array.isArray(item.items)) {
                item.items = form.parseControlList(item.items, v);
            }
            else {
                item.items = [];
            }

            return item;
        });

        return items;
    }
}

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('tabs', new Parser(Control.name));
};

export default Control;
