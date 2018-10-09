<template>
    <v-form :style="heightStyle" @submit.prevent.stop="currentDataStep && nextStep(currentDataStep, currentStep - 1)">
        <v-stepper :style="heightStyle" :vertical="vertical" v-if="showStepper" v-model="currentStep">
            <template v-if="vertical">
                <template v-for="(step, index) in dataSteps">
                    <v-stepper-step :complete="step.complete"
                                    :editable="step.editable && step.touched || stepHasError(step, index, true)"
                                    :key="$uniqueObjectId(step) + 'h'"
                                    :rules="stepHasError(step, index) ? invalidStep : undefined"
                                    :step="index + 1">
                        {{$uniqueObjectId(step)}}
                        {{$intl.translate(step.title)}}
                        <small v-if="!!step.description">{{$intl.translate(step.description)}}</small>
                    </v-stepper-step>
                    <v-stepper-content :key="$uniqueObjectId(step) + 'c'" :step="index + 1">
                        <json-form-group
                                :items="step.form"
                                :model="dataValue[index]"
                                :name="step.name"
                                :parent-validations-container="step.validator"
                                :path="step.name ? [step.name] : []"
                                :validations-container="step.validator"
                                :validator="$v.dataValue[index]"
                                :wrapper="me"
                                ref="formGroup"
                                v-if="step.parsed"
                        ></json-form-group>
                        <v-btn :disabled="processing || isButtonDisabled(step, index)"
                               :loading="processing || isButtonLoading(step, index)"
                               @click.stop="nextStep(step, index)"
                               class="mt-4"
                               color="primary">
                            {{$intl.translate(getButtonText(step, index))}}
                        </v-btn>
                    </v-stepper-content>
                </template>
            </template>
            <template v-else>
                <v-stepper-header>
                    <template v-for="(step, index) in dataSteps">
                        <v-stepper-step :complete="step.complete"
                                        :editable="step.editable && step.touched || stepHasError(step, index, true)"
                                        :key="$uniqueObjectId(step) + 'h'"
                                        :rules="stepHasError(step, index) ? invalidStep : undefined"
                                        :step="index + 1">
                            {{$uniqueObjectId(step)}}
                            {{$intl.translate(step.title)}}
                            <small v-if="!!step.description">{{$intl.translate(step.description)}}</small>
                        </v-stepper-step>
                        <v-divider :key="$uniqueObjectId(step) + 'd'" v-if="index !== dataSteps.length - 1"></v-divider>
                    </template>
                </v-stepper-header>
                <v-stepper-items>
                    <template v-for="(step, index) in dataSteps">
                        <v-stepper-content :key="$uniqueObjectId(step) + 'c'" :step="index + 1">
                            <json-form-group
                                    :items="step.form"
                                    :model="dataValue[index]"
                                    :name="step.name"
                                    :parent-validations-container="step.validator"
                                    :path="step.name ? [step.name] : []"
                                    :validations-container="step.validator"
                                    :validator="$v.dataValue[index]"
                                    :wrapper="me"
                                    ref="formGroup"
                                    v-if="step.parsed"
                            ></json-form-group>
                            <v-layout>
                                <v-spacer></v-spacer>
                                <v-btn :disabled="processing || isButtonDisabled(step, index)"
                                       :loading="processing || isButtonLoading(step, index)"
                                       @click.stop="nextStep(step, index)"
                                       color="primary">
                                    {{$intl.translate(getButtonText(step, index))}}
                                </v-btn>
                            </v-layout>
                        </v-stepper-content>
                    </template>
                </v-stepper-items>
            </template>
        </v-stepper>
        <input type="submit" v-show="false">
        <!-- Dialogs -->
        <dialog-forms :options="options" :parser="parser" ref="formOverlay"></dialog-forms>
    </v-form>
</template>
<style>
    .v-stepper__content > .v-stepper__wrapper > .json-form-group {
        margin-left: 1px;
    }
</style>
<script>
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
        data() {
            return {
                me: this,
                invalidStep: invalidStep,
                showStepper: true
            }
        },

        computed: {
            heightStyle() {
                return this.fillHeight ? {'min-height': '100%'} : undefined;
            }
        },
        watch: {
            vertical() {
                const copy = {};
                const model = this.$clone(this.model);
                this.dataSteps.map((step, index) => {
                    if (!step.parsed || step.model == null) {
                        return;
                    }
                    copy[index] = this.$clone(step.model);
                });

                const step = this.currentStep;

                this.showStepper = false;

                this.$nextTick(() => {
                    for (const prop in model) {
                        if (model.hasOwnProperty(prop)) {
                            this.$set(this.model, prop, model[prop]);
                        }
                    }

                    Object.keys(copy).map(index => {
                        this.dataSteps[parseInt(index, 10)].model = copy[index];
                    });

                    this.$set(this, 'currentStep', step);

                    this.showStepper = true;
                });
            }
        },
        methods: {
            getButtonText(step, index) {
                if (step.nextButton) {
                    return step.nextButton;
                }
                return index + 1 === this.dataSteps.length ? this.finishButtonText : this.nextButtonText;
            },
            isButtonDisabled(step, index) {
                if (this.isButtonLoading(step, index) || this.stepHasError(step, index)) {
                    return true;
                }

                return false;
            },
            isButtonLoading(step, index) {
                if (this.loadingStep === index + 1) {
                    return true;
                }
                return step.parsed && this.$v.dataValue[index].$pending;
            }
        }
    };
</script>
