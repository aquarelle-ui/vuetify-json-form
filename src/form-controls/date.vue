<template>
    <v-dialog
            v-model="showDialog"
            persistent
            lazy
            full-width
            :width="landscape ? 460 : 290"
    >
        <v-text-field
                slot="activator"
                readonly
                v-model="dateFormatted"
                :error-messages="allErrors"
                @input="($event === null) && handleClear()"

                :label="$intl.translate(display.title)"
                :suffix="$intl.translate(display.suffix)"
                :prefix="$intl.translate(display.prefix)"
                :hint="$intl.translate(display.hint)"
                persistent-hint
                :prepend-icon="$controlIcon(display.prependIcon)"
                :append-icon="$controlIcon(display.appendIcon) || 'event'"

                clearable

                :box="display.appearance === 'box'"
                :solo="display.appearance === 'solo'"
                :solo-inverted="display.appearance === 'solo-inverted'"
                :outline="display.appearance === 'outline'"

                :flat="!!display.flat"

                :required="config.required"
        ></v-text-field>
        <v-date-picker v-model="dateModel"
                       :min="config.minDate"
                       :max="config.maxDate"
                       :locale="locale"
                       :first-day-of-week="firstDayOfWeek"
                       :color="display.color || undefined"
                       :landscape="landscape"
                       scrollable>
            <v-spacer></v-spacer>
            <v-btn flat icon color="red" @click.stop="onCancel()">
                <v-icon>clear</v-icon>
            </v-btn>
            <v-btn flat icon color="green" @click.stop="onSave()">
                <v-icon>check</v-icon>
            </v-btn>
        </v-date-picker>
    </v-dialog>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";

    export default {
        mixins: [JsonFormElementMixin],
        data()
        {
            return {
                showDialog: false,
                dateFormatted: null,
                dateModel: null
            }
        },
        watch: {
            modelProxy(value)
            {
                if (!value) {
                    this.dateFormatted = null;
                    return;
                }
                this.dateModel = value;
                this.dateFormatted = this.formatDate(this.dateModel);
            }
        },
        computed: {
            landscape()
            {
                if (!this.display.landscape) {
                    return false;
                }
                return this.$vuetify.breakpoint.mdAndUp || false;
            },
            locale()
            {
                if (this.config.locale) {
                    return this.config.locale;
                }
                const options = this.wrapper.options || {};
                return options.language || 'en';
            },
            firstDayOfWeek()
            {
                if (this.config.firstDayOfWeek) {
                    return this.config.firstDayOfWeek;
                }
                const options = this.wrapper.options || {};
                return options.firstDayOfWeek || 0;
            }
        },
        mounted()
        {
            this.dateModel = this.modelProxy;
            this.updateValue(false);
        },
        methods: {
            handleClear()
            {
                this.dateModel = null;
                this.$delete(this.model, this.name);
            },
            onSave()
            {
                this.showDialog = false;
                this.updateValue();
            },
            onCancel()
            {
                this.showDialog = false;
                if (this.modelProxy) {
                    this.dateModel = this.modelProxy;
                }
            },
            updateValue(validate = true)
            {
                this.$set(this.model, this.name, this.dateModel);
                this.dateFormatted = this.formatDate(this.dateModel);
                validate && this.validate();
            },
            formatDate(date)
            {
                if (!date) {
                    return null;
                }
                return (new Date(date)).toLocaleDateString(this.locale);
            },
            onRouteLeave(func)
            {
                if (!this.showDialog) {
                    return true;
                }
                this.onCancel();
                return false;
            }
        }
    }
</script>