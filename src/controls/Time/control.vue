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
                v-model="model[name]"
                :error-messages="allErrors"
                @input="($event === null) && handleClear()"

                :label="$intl.translate(display.title)"
                :suffix="$intl.translate(display.suffix)"
                :prefix="$intl.translate(display.prefix)"
                :prepend-icon="$controlIcon(display.prependIcon) || 'access_time'"
                :append-icon="$controlIcon(display.appendIcon)"
                clearable

                :required="config.required"
                readonly
        ></v-text-field>
        <v-time-picker v-model="timeModel"
                       :min="config.minTime"
                       :max="config.maxTime"
                       format="24hr"
                       scrollable>
            <v-spacer></v-spacer>
            <v-btn flat icon color="red" @click.stop="onCancel()">
                <v-icon>clear</v-icon>
            </v-btn>
            <v-btn flat icon color="green" @click.stop="onSave()">
                <v-icon>check</v-icon>
            </v-btn>
        </v-time-picker>
    </v-dialog>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";

    export default {
        name: 'time-control',
        mixins: [JsonFormElementMixin],
        data()
        {
            return {
                showDialog: false,
                timeModel: '00:00'
            }
        },
        mounted()
        {
            this.timeModel = this.modelProxy;
            this.updateValue(false);
        },
        methods: {
            handleClear()
            {
                this.timeModel = '00:00';
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
                this.timeModel = this.modelProxy || '00:00';
            },
            updateValue(validate = true)
            {
                this.$set(this.model, this.name, this.timeModel);
                validate && this.validate();
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