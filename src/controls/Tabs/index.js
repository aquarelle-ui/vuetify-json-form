import {default as Control} from "./control.vue";
import {ControlParser, JsonForm, setConfigUsingValidation} from "@aquarelle/json-form";

class Parser extends ControlParser {
    getDefault(definition, form) {
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

    _copyProps(from, to) {
        for (let p in from) {
            if (from.hasOwnProperty(p)) {
                to[p] = from[p];
            }
        }
    }

    getItems(definition, form, data, validator) {
        if (!Array.isArray(definition.items)) {
            return [];
        }
        return definition.items.map(item => {
            item = {...item};
            const v = {};
            if (Array.isArray(item.items)) {
                item.items = form.parseControlList(item.items, v);
            }
            else {
                item.items = [];
            }

            if (data.name === null) {
                if (item.name) {
                    if (!validator[item.name]) {
                        validator[item.name] = {};
                    }
                    this._copyProps(v, validator[item.name]);
                }
                else {
                    this._copyProps(v, validator);
                }
            }
            else {
                if (item.name) {
                    data.validation[item.name] = v;
                }
                else {
                    this._copyProps(v, data.validation);
                }
            }

            return item;
        });
    }
}

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('tabs', new Parser(Control.name));
};

export default Control;
