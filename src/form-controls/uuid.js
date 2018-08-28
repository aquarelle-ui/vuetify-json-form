import {JsonFormElementMixin} from "@aquarelle/json-form";

export default {
    mixins: [JsonFormElementMixin],
    render()
    {
        return null;
    },
    created()
    {
        if (this.name !== null && typeof this.model[this.name] !== 'string') {
            const id = this.$uuid(typeof this.config.separator === 'string' ? this.config.separator : '-');
            this.$set(this.model, this.name, id);
        }
    }
};