<template>
    <v-dialog
            v-model="showDialog"
            persistent
            lazy
            full-width
            width="290px"
    >
        <v-layout row slot="activator">
            <v-icon class="date-time-icon ml-2 mr-3" @click.stop="timePick = false; showDialog = true">event</v-icon>
            <v-text-field
                    readonly
                    v-model="dateFormatted"
                    @input="($event === null) && handleClear()"
                    :error-messages="allErrors"

                    :label="$intl.translate(display.title)"
                    :suffix="$intl.translate(display.suffix)"
                    :prefix="$intl.translate(display.prefix)"
                    clearable

                    :required="config.required"
                    readonly
            ></v-text-field>
            <v-icon class="date-time-icon ml-2 mr-2" @click.stop="timePick = true; showDialog = true">access_time
            </v-icon>
        </v-layout>

        <v-time-picker v-show="timePick"
                       v-model="timeModel"
                       :min="allowedTimes.min"
                       :max="allowedTimes.max"
                       format="24hr"
                       scrollable>
            <v-btn icon flat @click="timePick = false">
                <v-icon>event</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn flat icon color="red" @click.stop="onCancel()">
                <v-icon>clear</v-icon>
            </v-btn>
            <v-btn flat icon color="green" @click.stop="onSave()">
                <v-icon>check</v-icon>
            </v-btn>
        </v-time-picker>
        <v-date-picker v-show="!timePick"
                       v-model="dateModel"
                       :min="allowedDates.min"
                       :max="allowedDates.max"
                       :locale="locale"
                       :first-day-of-week="firstDayOfWeek"
                       scrollable>
            <v-btn icon flat @click="timePick = true">
                <v-icon>access_time</v-icon>
            </v-btn>
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
<style scoped>
    .date-time-icon {
        cursor: pointer !important;
    }
</style>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";

    export default {
        name: 'date-time-control',
        mixins: [JsonFormElementMixin],
        data()
        {
            return {
                timePick: false,
                showDialog: false,

                dateFormatted: null,
                dateModel: null,
                timeModel: '00:00'
            }
        },
        watch: {
            modelProxy(value)
            {
                if (!value) {
                    this.dateFormatted = null;
                    return;
                }
                [this.dateModel, this.timeModel] = value.split('T');
                this.dateFormatted = this.formatDate(this.dateModel) + ' ' + this.formatTime(this.timeModel);
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
            },
            allowedDates()
            {
                const obj = {min: undefined, max: undefined};
                if (this.config.minDateTime) {
                    obj.min = this.config.minDateTime.split('T')[0];
                }
                if (this.config.maxDateTime) {
                    obj.max = this.config.maxDateTime.split('T')[0];
                }
                return obj;
            },
            allowedTimes()
            {
                const obj = {min: undefined, max: undefined};
                if (!this.dateModel) {
                    return obj;
                }
                const selected = this.parseTime(this.timeModel);
                selected.d = this.dateModel;

                if (this.config.minDateTime) {
                    const min = this.parseDateTime(this.config.minDateTime);
                    if (selected.d === min.d) {
                        obj.min = min.t;
                    }
                }

                if (this.config.maxDateTime) {
                    const max = this.parseDateTime(this.config.maxDateTime);
                    if (selected.d === max.d) {
                        obj.max = max.t;
                    }
                }

                return obj;
            }
        },
        mounted()
        {
            let d = this.modelProxy;
            if (!d) {
                return;
            }
            d = new Date(d);
            if (isNaN(d.getTime())) {
                this.$delete(this.model, this.name);
                return;
            }
            [this.dateModel, d] = d.toISOString().split('T');
            this.timeModel = d.split(':').slice(0, 2).join(':');
            this.updateValue(false);
        },
        methods: {
            onSave()
            {
                this.showDialog = false;
                this.updateValue();
            },
            onCancel()
            {
                this.showDialog = false;
                if (this.modelProxy) {
                    [this.dateModel, this.timeModel] = this.modelProxy.split('T');
                }
            },
            handleClear()
            {
                this.timePick = false;
                this.dateModel = null;
                this.timeModel = '00:00';
                this.$delete(this.model, this.name);
            },
            parseDateTime(date)
            {
                date = date.split('T');
                const t = date[1] || '00:00';
                let obj = this.parseTime(t);
                obj.t = t;
                obj.d = date[0];
                return obj;
            },
            parseTime(time)
            {
                time = time.split(':');
                time = {
                    h: Number(time[0] || 0),
                    m: Number(time[1] || 0),
                };
                return time;
            },
            updateValue(validate = true)
            {
                if (this.dateModel === null) {
                    this.dateModel = (new Date()).toISOString().split('T')[0];
                }
                this.$set(this.model, this.name, this.dateModel + 'T' + this.timeModel);
                this.dateFormatted = this.formatDate(this.dateModel) + ' ' + this.formatTime(this.timeModel);
                validate && this.validate();
            },
            formatDate(date)
            {
                if (!date) {
                    return null;
                }
                return (new Date(date)).toLocaleDateString(this.locale);
            },
            formatTime(time)
            {
                if (!time) {
                    return '';
                }
                return time.toString();
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