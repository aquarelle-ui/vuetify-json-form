<template>
    <div>
        <v-switch
                v-model="switchValue"

                :color="display.color || undefined"
                :label="wrapper.translate(display.title)"
                :prepend-icon="$controlIcon(display.prependIcon)"
                :append-icon="$controlIcon(display.appendIcon)"
                :hint="wrapper.translate(display.hint)"
                persistent-hint
                :error-messages="switchErrors"

                :required="config.required"
        ></v-switch>
        <json-form-group
                :model="modelProxy"
                :validator="validatorProxy"
                :items="parsed.items"
                :wrapper="wrapper"
                :path="path"
                :parent-validations-container="parentValidationsContainer"
                :validations-container="validationsContainer"
                ref="formGroup"
        >
        </json-form-group>
    </div>
</template>
<script>
    import {JsonFormElementMixin, JsonFormGroup} from "@aquarelle/json-form";

    export default {
        mixins: [JsonFormElementMixin],
        components: {JsonFormGroup},
        data() {
            return {
                switchValue: this.model[this.name] != null,
                lastModel: {}
            };
        },
        created()
        {
            this.switchValue = this.modelProxy != null;
        },
        watch: {
            switchValue(val) {
                if (val) {
                    this.$set(this.model, this.name, this.lastModel || {});
                }
                else {
                    this.lastModel = this.$clone(this.modelProxy);
                    this.$set(this.model, this.name, null);
                    this.validate();
                }
            },
            modelProxy(val) {
                if (val == null) {
                    this.switchValue = false;
                }
                else if (!this.switchValue) {
                    this.switchValue = true;
                }
            }
        },
        computed: {
            validations()
            {
                return this.parsed.validators;
            },
            parsed()
            {
                const validators = {};
                if (!this.switchValue) {
                    return {
                        validators,
                        items: []
                    };
                }
                return {
                    validators,
                    items: this.wrapper.parser.parseControlList(this.items, validators)
                };
            },
            switchErrors()
            {
                return this.switchValue ? [] : this.allErrors;
            }
        },
        methods: {
            onRouteLeave(func)
            {
                if (this.modelProxy == null) {
                    return true;
                }
                return func(this.$refs.formGroup);
            }
        }
    }
</script>