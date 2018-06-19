<template>
    <div>
        <v-switch
                v-model="switchValue"

                :label="$intl.translate(display.title)"
                :prepend-icon="$controlIcon(display.prependIcon)"
                :append-icon="$controlIcon(display.appendIcon)"
                :hint="$intl.translate(display.hint)"
                :error-messages="switchErrors"

                :required="config.required"
        ></v-switch>
        <json-form-group
                :model="modelProxy"
                :validator="validatorProxy"
                :items="parsed.items"
                :json-form-wrapper="jsonFormWrapper"
                ref="formGroup"
        >
        </json-form-group>
    </div>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";

    export default {
        name: 'switch-group-control',
        mixins: [JsonFormElementMixin],
        data() {
            return {
                switchValue: false,
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
                    items: this.$jsonForm.parseControlList(this.items, validators)
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