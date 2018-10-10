import {JsonMultiStepFormMixin} from "@aquarelle/json-form";
import DialogForms from "./DialogForms";

const invalidStep = [() => false];

export default {
    name: 'stepper-form',
    components: {DialogForms},
    mixins: [JsonMultiStepFormMixin],
    props: {
        nextButtonText: {
            type: [String, Object],
            default: 'Next'
        },
        finishButtonText: {
            type: [String, Object],
            default: 'Finish'
        },
        fillHeight: {
            type: Boolean,
            default: true
        },
        vertical: {
            type: Boolean,
            default: true
        }
    },
    render(h)
    {
        const children = [];
        if (this.vertical) {
            this.dataSteps.map((step, index) => {
                const id = this.$uniqueObjectId(step);
                children.push(this.genStepHeader(h, step, index, id));
                children.push(this.genStepContent(h, step, index, id, this.genForm(h, step, index, id), true));
            });
        } else {
            const headers = [];
            const items = [];
            this.dataSteps.map((step, index) => {
                const id = this.$uniqueObjectId(step);
                if (index > 0) {
                    headers.push(h('v-divider'));
                }
                headers.push(this.genStepHeader(h, step, index, id));
                items.push(this.genStepContent(h, step, index, id, this.genForm(h, step, index, id), false));
            });
            if (headers.length > 0) {
                children.push(h('v-stepper-header', headers));
                children.push(h('v-stepper-items', items));
            }
        }

        if (children.length === 0) {
            return null;
        }

        const formChildren = [
            h('input', {
                style: {display: 'none'},
                attrs: {
                    type: 'submit'
                }
            }),
            h('dialog-forms', {
                props: {
                    options: this.options,
                    parser: this.parse,
                },
                ref: 'formOverlay'
            })
        ];

        if (!this.locked) {
            formChildren.unshift(h('v-stepper', {
                style: this.heightStyle,
                props: {
                    vertical: this.vertical,
                    value: this.currentStep,
                },
                on: {
                    input: value => this.currentStep = value
                },
                ref: 'stepper'
            }, children));
        }

        return h('v-form', {
            style: this.heightStyle,
            on: {
                submit: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (this.currentDataStep) {
                        this.nextStep(this.currentDataStep, this.currentStep - 1)
                    }
                    return false;
                }
            }
        }, formChildren);
    },
    data()
    {
        return {
            showStepper: true,
            cachedForms: {},
        }
    },

    computed: {
        heightStyle()
        {
            return this.fillHeight ? {'min-height': '100%'} : undefined;
        }
    },
    watch: {
        vertical()
        {
            this.locked = true;
            this.$nextTick(() => this.locked = false);
        }
    },
    methods: {
        genStepHeader(h, step, index, id)
        {
            const children = [];
            if (step.title != null) {
                children.push(this.$intl.translate(step.title));
            }
            if (step.description != null && step.description !== '') {
                children.push(h('small', this.$intl.translate(step.description)));
            }
            return h('v-stepper-step', {
                key: id + 'h',
                props: {
                    complete: step.complete,
                    step: index + 1,
                    editable: step.editable && step.touched || this.stepHasError(step, index, true),
                    rules: this.stepHasError(step, index) ? invalidStep : undefined
                }
            }, children)
        },
        genStepContent(h, step, index, id, form, vertical)
        {
            const children = [];
            if (form != null) {
                children.push(form);
            }

            if (vertical) {
                children.push(this.genButton(h, step, index));
            } else {
                children.push(h('v-layout', [h('v-spacer'), this.genButton(h, step, index)]));
            }

            return h('v-stepper-content', {
                key: id + 'c',
                props: {
                    step: index + 1
                }
            }, children)
        },
        genButton(h, step, index)
        {
            return h('v-btn', {
                class: 'mt-4',
                props: {
                    disabled: this.processing || this.isButtonDisabled(step, index),
                    loading: this.processing || this.isButtonLoading(step, index),
                    color: 'primary'
                },
                on: {
                    click: (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        this.nextStep(step, index);
                        return false;
                    }
                }
            }, this.$intl.translate(this.getButtonText(step, index)) || null);
        },
        genForm(h, step, index, id)
        {
            if (!step.parsed) {
                return null;
            }
            id = id + 'f';
            if (this.cachedForms.hasOwnProperty(id)) {
                return this.cachedForms[id];
            }
            return this.cachedForms[id] = h('json-form-group', {
                props: {
                    items: step.form || [],
                    model: this.dataValue[index],
                    name: step.name || undefined,
                    path: step.name ? [step.name] : [],
                    validationsContainer: step.validator,
                    parentValidationsContainer: step.validator,
                    validator: this.$v.dataValue[index],
                    wrapper: this
                },
                ref: 'formGroup',
                key: id
            });
        },
        getButtonText(step, index)
        {
            if (step.nextButton) {
                return step.nextButton;
            }
            return index + 1 === this.dataSteps.length ? this.finishButtonText : this.nextButtonText;
        },
        isButtonDisabled(step, index)
        {
            if (this.isButtonLoading(step, index) || this.stepHasError(step, index)) {
                return true;
            }

            return false;
        },
        isButtonLoading(step, index)
        {
            if (this.loadingStep === index + 1) {
                return true;
            }
            return step.parsed && this.$v.dataValue[index].$pending;
        }
    }
};