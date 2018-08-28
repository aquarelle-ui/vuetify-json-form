import ComboboxParser from "./combobox";

export default class extends ComboboxParser
{
    parse(definition, form, validator)
    {
        if (!definition.display || typeof definition.display !== 'object') {
            definition.display = {};
        }
        if (!definition.config || typeof definition.config !== 'object') {
            definition.config = {};
        }

        definition.display.chips = true;
        definition.config.multiple = true;
        return super.parse(definition, form, validator);
    }
}