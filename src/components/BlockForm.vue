<template>
    <v-card :flat="flat" :style="heightStyle">
        <v-card-title v-if="title !== null || subtitle !== null" primary-title>
            <div>
                <div v-if="title !== null" class="headline">{{title}}</div>
                <div v-if="subtitle !== null">{{subtitle}}</div>
            </div>
        </v-card-title>
        <v-card-text>
            <v-form @submit.prevent="doSubmit()">
                <json-form-group
                        v-if="model !== null && items !== null"
                        :items="parsed.items"
                        :model="model"
                        :validator="validatorProxy"
                        :validations-container="parsed.validator"
                        :parent-validations-container="parsed.validator"
                        :wrapper="me"
                        :path="path"
                        ref="formGroup"
                ></json-form-group>
                <input v-show="false" type="submit">
            </v-form>
        </v-card-text>
        <v-card-actions>
            <slot v-bind="submitProps" :submit-disabled="processing || $v.$pending || ($v.$dirty && $v.$invalid)">
                <v-spacer></v-spacer>
                <v-btn color="primary"
                       :disabled="processing || $v.$pending || ($v.$dirty && $v.$invalid)"
                       :loading="processing"
                       @click.stop="submitProps.submit()">
                    {{submitButton}}
                </v-btn>
            </slot>
        </v-card-actions>
        <!-- Dialogs -->
        <dialog-forms ref="formOverlay" :options="options" :parser="parser"></dialog-forms>
    </v-card>
</template>
<script>
    import {JsonFormMixin} from "@aquarelle/json-form";
    import DialogForms from "./DialogForms";

    export default {
        name: 'block-form',
        components: {DialogForms},
        mixins: [JsonFormMixin],
        props: {
            title: {
                type: String,
                default: null
            },
            subtitle: {
                type: String,
                default: null
            },
            submitButton: {
                type: String,
                default: 'Submit'
            },
            fillHeight: {
                type: Boolean,
                default: false
            },
            flat: {
                type: Boolean,
                default: false
            }
        },
        data()
        {
            return {
                me: this,
                submitProps: {
                    form: this,
                    validate: () => {
                        this.$v.$touch();
                    },
                    reset: () => {
                        this.$v.$reset();
                    },
                    submit: () => {
                        return this.doSubmit();
                    },
                    invalid: () => {
                        return this.$v.$invalid;
                    },
                    pending: () => {
                        return this.$v.$pending;
                    },
                    dirty: () => {
                        return this.$v.$dirty;
                    }
                }
            };
        },
        computed: {
            heightStyle()
            {
                return this.fillHeight ? {'min-height': '100%'} : undefined;
            }
        }
    };
</script>