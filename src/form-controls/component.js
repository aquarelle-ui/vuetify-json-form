import {JsonFormElementMixin} from "@aquarelle/json-form";

export default {
    mixins: [JsonFormElementMixin],
    computed: {
        form()
        {
            return {
                name: this.name,
                validator: this.validator,
                model: this.model,
                config: this.config,
                display: this.display,
                wrapper: this.wrapper,
                path: this.path,
                validationsContainer: this.validationsContainer,
                parentValidationsContainer: this.parentValidationsContainer,
            }
        }
    },
    render(h)
    {
        const component = this.config.component;
        const data = this.config.data || {};
        const alias = this.config.alias || 'form';
        if (!data.props) {
            data.props = {};
        }
        if (this.config.props) {
            Object.assign(data.props, this.config.props);
        }
        data.props[alias] = this.form;
        return h(component, data);
    }
};
