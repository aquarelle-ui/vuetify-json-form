import {default as Control} from "./control.vue";
import {ControlParser, JsonForm, setConfigUsingValidation} from "@aquarelle/json-form";

class Parser extends ControlParser {
    getDefault(definition, form) {
        let def = null;
        if (typeof definition.default === 'object') {
            def = {...definition.default};
        }
        else {
            def = {}
        }
        if (Array.isArray(definition.config.regions)) {
            definition.config.regions.map(item => {
                if (!def.hasOwnProperty(item.name) || !Array.isArray(def[item.name])) {
                    def[item.name] = [];
                }
            })
        }
        return def;
    }

    getConfig(definition, form) {
        if (!definition.config.variantField) {
            definition.config.variantField = 'variant_name';
        }
        return definition.config;
    }

    _isComponentValid(c, prop, name) {
        if (!c || !c[prop]) {
            return true;
        }
        const r = c.$v[prop][name];
        const m = c[prop][name];
        if (!Array.isArray(m)) {
            return false;
        }
        for (let i = 0; i < m.length; i++) {
            if (r[i] && r[i].$invalid) {
                return false;
            }
        }
        return true;
    }

    getValidation(definition, form, data, validator) {
        const validation = super.getValidation(definition, form, data, validator);

        data.config.regions.map(item => {
            if (!validation[item.name]) {
                validation[item.name] = {};
            }
            validation[item.name] = {
                ...validation[item.name],
                subvalidator: form.validator.get('subvalidator', {
                    value: () => {
                        return this._isComponentValid(this.getComponentFromData(data), 'modelProxy', item.name);
                    },
                    key: 'ui:validation.subvalidator_group-repeat-variants',
                    text: 'Some items have errors'
                })
            };
            let v = null;
            if (typeof item.validation === 'object') {
                v = form.validator.getMultiple(item.validation);
            }
            else {
                v = {};
                item.validation = {};
            }
            item.config = {};
            setConfigUsingValidation(item.config, item.validation, ['required', 'minItems', 'maxItems']);
            if (validation.hasOwnProperty(item.name)) {
                validation[item.name] = {...validation[item.name], ...v};
            }
            else {
                validation[item.name] = v;
            }
        });

        return validation;
    }

    getItems(definition, form, data, validator) {
        if (!definition.items || !Array.isArray(definition.items)) {
            return [];
        }

        return definition.items.map(item => {
            item = {...item};
            item.validations = {};
            if (Array.isArray(item.items)) {
                item.items = form.parseControlList(item.items, item.validations);
            }
            else {
                item.items = [];
            }
            return item;
        });
    }

    parse(definition, form, validator) {
        const data = super.parse(definition, form, validator);
        setConfigUsingValidation(data.config, definition.validation, ['required']);
        return data;
    }
}

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('group-repeat-variants', new Parser(Control.name));
};

export default Control;
