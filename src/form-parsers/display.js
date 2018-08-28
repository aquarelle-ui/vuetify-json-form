import SelectParser from "./select";

export default class extends SelectParser
{
    constructor(name)
    {
        super(name, false)
    }

    parse(definition, form, validator)
    {
        definition.items = [
            {
                title: 'Phone',
                description: 'Extra small device (xs)',
                icon: 'smartphone',
                value: 'xs',
            },
            {
                title: 'Tablet',
                description: 'Small device (sm)',
                icon: 'tablet',
                value: 'sm',
            },
            {
                title: 'Laptop',
                description: 'Medium device (md)',
                icon: 'laptop',
                value: 'md',
            },
            {
                title: 'Desktop',
                description: 'Large device (lg)',
                icon: 'desktop_windows',
                value: 'lg',
            },
            {
                title: 'TV',
                description: 'Extra large device (xl)',
                icon: 'tv',
                value: 'xl',
            }
        ];
        if (!definition.display) {
            definition.display = {};
        }
        definition.display.icons = true;
        definition.display.chips = true;
        if (!definition.config) {
            definition.config = {};
        }
        definition.config.itemTitle = 'title';
        definition.config.itemDescription = 'description';
        definition.config.itemValue = 'value';
        definition.config.itemIcon = 'icon';
        return super.parse(definition, form, validator);
    }
}
