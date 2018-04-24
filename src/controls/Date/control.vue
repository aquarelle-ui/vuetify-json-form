<template>
    <v-dialog
            v-model="showDialog"
            persistent
            lazy
            full-width
            width="330px"
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
                :prepend-icon="$controlIcon(display.prependIcon) || 'event'"
                :append-icon="$controlIcon(display.appendIcon)"
                clearable

                :required="config.required"
                readonly
        ></v-text-field>
        <v-date-picker v-model="dateModel"
                       :min="config.minDate"
                       :max="config.maxDate"
                       :locale="locale"
                       :first-day-of-week="firstDayOfWeek"
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
        name: 'date-control',
        mixins: [JsonFormElementMixin],
        data()
        {
            return {
                showDialog: false,
                dateFormatted: null,
                dateModel: null
            }
        },
        computed: {
            locale()
            {
                return this.config.locale || this.$intl.language;
            },
            firstDayOfWeek()
            {
                return this.config.firstDayOfWeek || this.$intl.firstDayOfWeek;
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