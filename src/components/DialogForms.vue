<template>
    <div v-if="dialogs.length > 0">
        <v-dialog
                v-for="(dialog, index) in dialogs"
                :key="$uniqueObjectId(dialog, index)"
                v-model="dialog.active"
                lazy
                fullscreen
                transition="dialog-bottom-transition"
                :overlay="false"
                scrollable
        >
            <v-card>
                <v-toolbar :color="getColor(index)" style="flex: 0 0 auto;" dark>
                    <v-btn icon @click.native="onCancel(dialog)" dark>
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{$intl.translate(dialog.title, dialog.model)}}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark flat
                               :disabled="$v.dialogs[index].$pending || ($v.dialogs[index].$dirty && $v.dialogs[index].$invalid)"
                               :loading="$v.dialogs[index].$pending"
                               @click.native="onSubmit(dialog)">
                            {{$intl.translate(dialog.button, dialog.model)}}
                        </v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-card-text>
                    <json-form-group
                            :items="dialog.form"
                            :model="dialog.model"
                            :validator="$v.dialogs[index].model"
                            :name="dialog.name"
                            :json-form-wrapper="me"
                    ></json-form-group>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import {JsonFormGroup, validationMixin} from "@aquarelle/json-form";

    export default {
        name: 'dialog-forms',
        components: {JsonFormGroup},
        mixins: [validationMixin],
        props: {
            pushDelay: {
                type: Number,
                default: 100
            },
            popDelay: {
                type: Number,
                default: 500
            },
            colors: {
                type: Array,
                default: () => (['blue', 'indigo', 'deep-purple', 'purple'])
            },
        },
        data()
        {
            return {
                me: this,
                dialogs: []
            };
        },
        validations()
        {
            const v = {};
            this.dialogs.map((dialog, index) => {
                const m = {model: dialog.validator};
                v[index + ''] = dialog.name ? {[dialog.name]: m} : m;
            });
            return {dialogs: v};
        },
        methods: {
            getColor(index)
            {
                if (this.colors.length === 0) {
                    return undefined;
                }
                return this.colors[index % this.colors.length];
            },
            pushUnparsedForm(form, model)
            {
                form = {...form};
                form.validator = {};
                form.items = this.$jsonForm.parseControlList(form.items || [], form.validator);
                if (model !== undefined) {
                    form.model = model;
                }
                this.pushForm(form);
            },
            pushForm(options)
            {
                const dialog = {
                    active: false,
                    form: options.items || [],
                    validator: options.validator || {},

                    name: options.name || undefined,
                    model: options.model || {},

                    actions: options.actions || {},

                    title: options.title || null,
                    button: options.button || 'Save'
                };
                this.dialogs.push(dialog);
                // open a dialog
                setTimeout(() => {
                    this.$v.dialogs[this.dialogs.length - 1].$reset();
                    dialog.active = true;
                }, this.pushDelay);
            },
            popForm()
            {
                const len = this.dialogs.length;
                if (len === 0) {
                    return;
                }
                const dialog = this.dialogs[len - 1];
                dialog.active = false;
                // TODO: use different timeout or fix vdialog to provide events
                setTimeout(() => {
                    this.dialogs.pop();
                }, this.popDelay);
            },
            clearForms()
            {
                this.dialogs.splice(0, this.dialogs.length);
            },
            onCancel(dialog)
            {
                if (typeof dialog.actions.cancel === 'function') {
                    if (dialog.actions.cancel(dialog.model) === false) {
                        // Prevent cancel
                        return false;
                    }
                }
                this.popForm();
                return true;
            },
            onSubmit(dialog)
            {
                const index = this.dialogs.indexOf(dialog);
                if (index < 0) {
                    return false;
                }
                const v = this.$v.dialogs[index].model;
                v.$touch();
                if (v.$invalid || v.$pending) {
                    return false;
                }
                if (typeof dialog.actions.submit === 'function') {
                    if (dialog.actions.submit(dialog.model, this.$clone(dialog.model)) === true) {
                        this.popForm();
                    }
                }
                else {
                    this.popForm();
                }
                return true;
            }
        },
        beforeRouteLeave(to, from, next)
        {
            const length = this.dialogs.length;
            if (length > 0) {
                this.onCancel(this.dialogs[length - 1]);
                next(false);
            }
            else {
                next();
            }
        }
    };
</script>