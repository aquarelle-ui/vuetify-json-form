import {ControlParser} from "@aquarelle/json-form";

export default class extends ControlParser
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
