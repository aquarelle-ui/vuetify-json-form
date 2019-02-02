<template>
    <v-dialog v-model="modalShow" :overlay="false" persistent lazy scrollable fullscreen
              transition="dialog-bottom-transition">
        <v-card v-if="currentDialog != null">
            <v-toolbar ref="toolbar" :color="getColor(currentDialogIndex)" style="flex: 0 0 auto;" dark>
                <v-btn icon @click.native="actionsEnabled && onCancel(currentDialog)" dark>
                    <v-icon>{{currentDialogIndex === 0 ? 'close' : 'arrow_back'}}</v-icon>
                </v-btn>
                <v-toolbar-title>{{currentTitle}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn dark flat
                           :disabled="$v.dialogs[currentDialogIndex].$pending"
                           :loading="$v.dialogs[currentDialogIndex].$pending"
                           @click.native="actionsEnabled && onSubmit(currentDialog)">
                        {{$intl.translate(currentDialog.button, currentDialog.model)}}
                        <v-icon>check</v-icon>
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-card-text class='dialog-slider-wrapper' :style="{height: height + 'px'}">
                <transition-group :name="currentMethodPrefix + '-' + currentMethod" class='dialog-slider' tag="div"
                                  @before-enter="beforeEnter()" @after-leave="afterLeave()">
                    <div v-for="(dialog, index) in dialogs" :key="$uniqueObjectId(dialog, index)"
                         v-show="currentDialogIndex === index"
                         class='dialog-slide'>
                        <v-form @submit.prevent="actionsEnabled && onSubmit(dialog)" novalidate>
                            <json-form-group
                                    :items="dialog.form"
                                    :model="dialog.model"
                                    :validator="$v.dialogs[index].model"
                                    :name="dialog.name"
                                    :path="dialog.path"
                                    :wrapper="me"
                                    :validations-container="dialog.validator"
                                    :parent-validations-container="dialog.validator"
                                    ref="formGroup"
                            ></json-form-group>
                            <input v-show="false" type="submit">
                        </v-form>
                    </div>
                </transition-group>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script>
    import {JsonFormGroup, ValidationMixin, JsonFormParserMixin} from "@aquarelle/json-form";

    export default {
        name: 'dialog-forms',
        components: {JsonFormGroup},
        mixins: [ValidationMixin, JsonFormParserMixin],
        props: {
            colors: {
                type: Array,
                default: () => (['blue', 'indigo', 'deep-purple', 'purple'])
            },
            path: {type: Array, default: () => []},
            options: {type: Object, default: () => ({})},
            hideTimeout: {type: Number, default: 200}
        },
        data()
        {
            return {
                lastOverflow: 'auto',
                height: 0,
                actionsEnabled: true,
                me: this,
                currentDialogIndex: -1,
                currentMethodPrefix: 'slide',
                currentMethod: 'push',
                dialogs: [],
                modalShow: false
            };
        },
        watch: {
            currentDialogIndex(val, old)
            {
                this.$nextTick(() => {
                    if (old === -1) {
                        const el = document.documentElement;
                        this.lastOverflow = el.style.overflowY || 'auto';
                        el.style.overflowY = 'hidden';
                        this.setHeight();
                    } else if (val === -1) {
                        document.documentElement.style.overflowY = this.lastOverflow;
                    }
                    this.modalShow = val >= 0;
                    if (!this.modalShow) {
                        this.clearForms();
                    }
                });
            },
            '$vuetify.breakpoint.height'()
            {
                this.setHeight();
            },
            '$vuetify.breakpoint.width'()
            {
                this.setHeight();
            }
        },
        computed: {
            currentDialog()
            {
                if (this.currentDialogIndex < 0) {
                    return null;
                }
                return this.dialogs[this.currentDialogIndex] || null;
            },
            currentTitle()
            {
                const dialog = this.currentDialog;
                if (dialog == null) {
                    return undefined;
                }
                return this.$intl.translate(dialog.title, dialog.model);
            }
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
            setHeight()
            {
                const toolbar = this.$refs.toolbar;
                const th = toolbar ? toolbar.computedHeight : 0;
                this.height = this.$vuetify.breakpoint.height - th;
            },
            getColor(index)
            {
                if (this.colors.length === 0) {
                    return undefined;
                }
                return this.colors[index % this.colors.length];
            },
            clearForms()
            {
                this.dialogs.splice(0, this.dialogs.length);
            },
            pushUnparsedForm(form, model)
            {
                form = {...form};
                form.validator = {};
                form.items = this.parser.parseControlList(form.items || [], form.validator);
                if (model !== undefined) {
                    form.model = model;
                }
                this.pushForm(form);
            },
            pushForm(options)
            {
                if (!this.actionsEnabled) {
                    return;
                }
                const dialog = {
                    form: options.items || [],
                    validator: options.validator || {},

                    name: options.name || undefined,
                    model: options.model || {},

                    actions: options.actions || {},

                    title: options.title || null,
                    button: options.button || null,
                    cancelButton: options.cancelButton || null,

                    path: options.path || []
                };
                this.dialogs.push(dialog);
                this.currentMethod = 'push';
                this.currentDialogIndex++;
            },
            popForm()
            {
                if (this.currentDialogIndex < 0) {
                    return;
                }

                if (this.currentDialogIndex === 0 && this.hideTimeout > 0) {
                    this.modalShow = false;
                    setTimeout(() => {
                        this.currentMethod = 'pop';
                        this.currentDialogIndex--;
                    }, this.hideTimeout);
                    return;
                }

                this.currentMethod = 'pop';
                this.currentDialogIndex--;
            },
            beforeEnter()
            {
                this.actionsEnabled = false;
            },
            afterLeave()
            {
                const last = this.dialogs.length - 1;
                if (last > this.currentDialogIndex) {
                    this.dialogs.pop();
                }
                this.actionsEnabled = true;
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
            },
            onRouteLeave(func)
            {
                const length = this.dialogs.length;
                if (length === 0) {
                    return true;
                }
                if (!func(this.$refs.formGroup[length - 1])) {
                    return false;
                }
                this.onCancel(this.dialogs[length - 1]);
                return false;
            }
        }
    };
</script>
<style>
    .dialog-slider {
        overflow: hidden;
        position: relative;
        width: 100%;
        height: 100%;
    }

    .dialog-slider .dialog-slide {
        position: absolute;
        overflow-y: auto;
        overflow-x: hidden;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }

    .slide-push-leave-active,
    .slide-pop-leave-active,
    .slide-push-enter-active,
    .slide-pop-enter-active {
        transition: all 0.75s;
    }

    .slide-push-enter {
        transform: translate(100%, 0) scale(1);
    }

    .slide-push-leave-to {
        transform: translate(-100%, 0) scale(0);
    }

    .slide-pop-enter {
        transform: translate(-100%, 0) scale(1);
    }

    .slide-pop-leave-to {
        transform: translate(200%, 0) scale(0);
    }
</style>