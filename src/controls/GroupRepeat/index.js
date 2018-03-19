import {default as Control} from "./control.vue";
import {ControlParser, JsonForm, setConfigUsingValidation} from "vue-json-form";

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

    _isComponentValid(c, prop, name) {
        if (!c || !c[prop] || !c[prop][name]) {
            return true;
        }
        return !c[prop][name].$each.$invalid;
    }

    getValidation(definition, form, data, validator) {
        const validation = super.getValidation(definition, form, data, validator);

        data.config.itemValidator = {};

        data.config.regions.map(region => {
            if (!validation[region.name]) {
                validation[region.name] = {};
            }
            validation[region.name] = {
                ...validation[region.name],
                subvalidator: form.validator.get('subvalidator', {
                    value: () => {
                        return this._isComponentValid(this.getComponentFromData(data), 'validatorProxy', region.name);
                    },
                    key: 'ui:validation.subvalidator_group-repeat',
                    text: 'Some items have errors'
                })
            };

            let v = null;
            if (typeof region.validation === 'object') {
                v = form.validator.getMultiple(region.validation);
            }
            else {
                v = {};
                region.validation = {};
            }
            region.config = {};
            setConfigUsingValidation(region.config, region.validation, ['required', 'minItems', 'maxItems']);

            if (validation.hasOwnProperty(region.name)) {
                validation[region.name] = {...validation[region.name], ...v};
            }
            else {
                validation[region.name] = v;
            }

            validation[region.name].$each = data.config.itemValidator;
        });

        return validation;
    }

    getItems(definition, form, data, validator) {
        if (!definition.items || !Array.isArray(definition.items)) {
            return [];
        }
        return form.parseControlList(definition.items, data.config.itemValidator);
    }

    parse(definition, form, validator) {
        const data = super.parse(definition, form, validator);
        setConfigUsingValidation(data.config, definition.validation, ['required']);
        return data;
    }
}

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('group-repeat', new Parser(Control.name));
};

export default Control;
