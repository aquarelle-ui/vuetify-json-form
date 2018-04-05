<template>
    <v-form @submit.prevent="" :style="heightStyle">
        <v-stepper :style="heightStyle" v-model="currentStep" vertical>
            <template v-for="(step, index) in dataSteps">
                <v-stepper-step :key="$uniqueObjectId(step) + 'h'"
                                :step="index + 1"
                                :complete="step.complete"
                                :editable="step.editable && step.touched || stepHasError(step, index)"
                                :rules="stepHasError(step, index) ? invalidStep : undefined">
                    {{$intl.translate(step.title)}}
                    <small v-if="!!step.description">{{$intl.translate(step.description)}}</small>
                </v-stepper-step>
                <v-stepper-content :key="$uniqueObjectId(step) + 'c'" :step="index + 1">
                    <json-form-group
                            v-if="step.parsed"
                            :items="step.form"
                            :model="dataValue[index]"
                            :validator="$v.dataValue[index]"
                            :name="step.name"
                            :json-form-wrapper="me"
                    ></json-form-group>
                    <v-btn color="primary"
                           :disabled="processing || isButtonDisabled(step, index)"
                           :loading="processing || isButtonLoading(step, index)"
                           @click.stop="nextStep(step, index)">
                        {{$intl.translate(getButtonText(step, index))}}
                    </v-btn>
                </v-stepper-content>
            </template>
        </v-stepper>
        <!-- Dialogs -->
        <dialog-forms ref="dialogs"></dialog-forms>
    </v-form>
</template>
<style>
    /* Fixed invalid stepper style */
    .stepper__content .list__tile__action .btn--icon {
        margin-top: 8px;
    }

    .stepper__content .json-form-group .btn {
        margin-top: 8px;
    }
</style>
<script>
    import {JsonFormGroup, validationMixin} from "@aquarelle/json-form";
    import DialogForms from "./DialogForms.vue";

    const invalidStep = [() => false];

    export default {
        name: 'stepper-form',
        components: {DialogForms, JsonFormGroup},
        mixins: [validationMixin],
        props: {
            steps: {
                type: Array,
                required: true
            },
            nextButtonText: {
                type: [String, Object],
                default: 'Next'
            },
            finishButtonText: {
                type: [String, Object],
                default: 'Finish'
            },
            value: {
                type: [Object, Array],
                default: () => ({})
            },
            fillHeight: {
                type: Boolean,
                default: true
            },
            processing: {
                type: Boolean,
                default: false
            }
        },
        data()
        {
            return {
                me: this,
                invalidStep: invalidStep,
                currentStep: 0,
                loadingStep: 0,
                map: new WeakMap(),
                mapTracker: 0
            }
        },
        validations()
        {
            const dataSteps = this.dataSteps;
            // Use mapTracker to make map reactive
            if (!this.steps || !dataSteps.length || this.mapTracker <= 0) {
                return true;
            }
            let v = {};
            dataSteps.map((step, index) => {
                if (!step.parsed || !step.validator) {
                    v[index] = {};
                }
                else {
                    if (step.name) {
                        v[index] = {[step.name]: step.validator};
                    }
                    else {
                        v[index] = step.validator;
                    }
                }
            });
            return {
                dataValue: v
            };
        },
        watch: {
            steps()
            {
                this.setupStepper();
            }
        },
        mounted()
        {
            this.setupStepper();
        },
        computed: {
            heightStyle()
            {
                return this.fillHeight ? {height: '100%'} : undefined;
            },
            dataSteps()
            {
                if (!this.steps) {
                    return [];
                }
                return this.steps.map(step => {
                    if (!this.map.has(step)) {
                        const data = {
                            parsed: false,
                            editable: Boolean(step.editable),
                            touched: false,
                            complete: false,

                            title: step.title || null,
                            description: step.description || null,
                            nextButton: step.nextButton || null,

                            name: step.name || null,
                            form: null,
                            validator: null,
                            items: step.items || [],
                            callback: step.callback || null,

                            model: step.model || null
                        };

                        this.map.set(step, data);
                    }
                    return this.map.get(step);
                });
            },
            dataValue()
            {
                // Use mapTracker to make map reactive
                if (this.mapTracker <= 0) {
                    return [];
                }
                const value = this.value;
                return this.dataSteps.map(step => {
                    if (!step.parsed) {
                        return null;
                    }
                    return step.model !== null ? step.model : value;
                });
            }
        },
        methods: {
            setupStepper()
            {
                const ds = this.dataSteps;
                if (ds.length > 0) {
                    if (!ds[0].parsed) {
                        this.$set(ds[0], 'touched', true);
                        this.parseStep(ds[0], () => {
                            this.$set(this, 'currentStep', 1);
                        });
                    }
                }
            },
            pushUnparsedForm(options, model)
            {
                this.$refs.dialogs.pushUnparsedForm(options, model);
            },
            pushForm(options)
            {
                this.$refs.dialogs.pushForm(options);
            },
            popForm()
            {
                this.$refs.dialogs.popForm();
                if (this.$v) {
                    this.$v.$touch();
                }
            },
            getButtonText(step, index)
            {
                if (step.nextButton) {
                    return step.nextButton;
                }
                return index + 1 === this.dataSteps.length ? this.finishButtonText : this.nextButtonText;
            },
            gotoNextStep(currentStep)
            {
                this.$set(currentStep, 'complete', true);

                const length = this.dataSteps.length;

                // check if is last step
                if (this.currentStep === length) {
                    this.submitSteps();
                    return;
                }

                // check if the next step is editable
                let index = this.currentStep;
                let next = null;
                while (index < length) {
                    const dataStep = this.dataSteps[index];
                    if (!dataStep.editable && dataStep.touched && !this.stepHasError(this.dataSteps[index], index)) {
                        // Do not enter a locked step
                        index++;
                        continue;
                    }
                    next = dataStep;
                    break;
                }

                if (next === null) {
                    // goto last step
                    index = this.dataSteps.length - 1;
                    next = this.dataSteps[index];
                }

                if (!next.parsed) {
                    this.parseStep(next, () => {
                        this.loadingStep = 0;
                        this.currentStep = index + 1;
                        next.touched = true;
                    });
                    return;
                }
                this.loadingStep = 0;
                this.currentStep = index + 1;
                next.touched = true;
            },
            parseStep(step, callback)
            {
                if (typeof step.items === 'function') {
                    let result = step.items(this.value, step, this);
                    if (typeof result.then === 'function') {
                        result.then((items, validator = null) => {
                            this.setupStepForm(step, items, validator);
                            this.markAsParsed(step);
                            callback && callback(step);
                        });
                        return;
                    }
                    this.setupStepForm(step, result, null);
                }
                else {
                    this.setupStepForm(step, step.items, null);
                }
                this.markAsParsed(step);
                callback && callback(step);
            },
            markAsParsed(step, parsed = true)
            {
                this.$set(step, 'parsed', parsed);
                // Makes map reactive
                this.mapTracker++;
            },
            setupStepForm(step, items, validator = null)
            {
                if (validator === null) {
                    validator = {};
                    items = this.$jsonForm.parseControlList(items, validator);
                }

                this.$set(step, 'validator', validator);
                this.$set(step, 'form', items);
            },
            nextStep(currentStep, index)
            {
                const v = this.$v.dataValue;
                if (v && v[index]) {
                    v[index].$touch();
                    if (v[index].$pending || v[index].$invalid) {
                        return;
                    }
                }
                this.loadingStep = this.currentStep;
                if (typeof currentStep.callback === 'function') {
                    let result = currentStep.callback(this.value, currentStep, this);
                    if (result === true) {
                        this.gotoNextStep(currentStep);
                    }
                    else {
                        if (result && typeof result.then === 'function') {
                            // Promises
                            result.then(() => {
                                this.gotoNextStep(currentStep);
                            });
                        }
                        else {
                            this.loadingStep = 0;
                        }
                    }
                }
                else {
                    this.gotoNextStep(currentStep);
                }
            },
            stepHasError(step, index, dirty = false)
            {
                if (!step.parsed || !this.$v.dataValue) {
                    return false;
                }
                const v = this.$v.dataValue;
                if (!v[index] || (!dirty && !v[index].$dirty)) {
                    return false;
                }

                return v[index].$invalid;
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
            },
            submitSteps()
            {
                this.$v.$touch();
                if (this.$v.$invalid || this.$v.$pending) {
                    return;
                }
                if (!this.dataSteps.every(step => step.parsed && step.complete)) {
                    return;
                }
                this.$emit('submit', this);
                this.$emit('input', this.value);
                this.loadingStep = 0;
            }
        }
    };
</script>