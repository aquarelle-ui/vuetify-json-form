<template>
    <json-form-group v-if="asyncFields !== null"
                     :model="modelProxy"
                     :items="asyncFields"
                     :validator="validatorProxy"
                     :path="path"
                     :wrapper="wrapper"
                     :parent-validations-container="parentValidationsContainer"
                     :validations-container="validationsContainer"
                     ref="formGroup"
    >
    </json-form-group>
    <v-progress-linear indeterminate v-else></v-progress-linear>
</template>
<script>
    import {JsonFormElementMixin, JsonFormGroup} from "@aquarelle/json-form";

    export default {
        mixins: [JsonFormElementMixin],
        components: {JsonFormGroup},
        data()
        {
            return {
                asyncFields: null,
                asyncValidator: null
            }
        },
        beforeDestroy()
        {
            this.asyncFields = null;
            this.asyncValidator = null;
        },
        created()
        {
            this.loadFields();
        },
        computed: {
            validations()
            {
                return this.asyncValidator;
            }
        },
        methods: {
            loadFields()
            {
                if (typeof this.config.loader !== 'function') {
                    return;
                }
                const fields = this.config.loader(this);
                if (!(fields instanceof Promise)) {
                    return;
                }
                this.asyncValidator = fields
                    .then(fields => {
                        const validator = {};
                        this.asyncFields = this.wrapper.parser.parseControlList(this.$clone(fields), validator);
                        return validator;
                    });
            },
            onRouteLeave(func)
            {
                if (this.asyncFields === null) {
                    return true;
                }
                return func(this.$refs.formGroup);
            }
        }
    }
</script>
