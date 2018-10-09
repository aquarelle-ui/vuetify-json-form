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
                v-model="model[name]"
                :error-messages="allErrors"
                @input="($event === null) && handleClear()"

                :label="$intl.translate(display.title)"
                :suffix="$intl.translate(display.suffix)"
                :prefix="$intl.translate(display.prefix)"
                :prepend-icon="$controlIcon(display.prependIcon)"
                :append-icon="$controlIcon(display.appendIcon) || 'access_time'"
                clearable

                :box="display.appearance === 'box'"
                :solo="display.appearance === 'solo'"
                :solo-inverted="display.appearance === 'solo-inverted'"
                :outline="display.appearance === 'outline'"

                :flat="!!display.flat"

                :required="config.required"
        ></v-text-field>
        <v-time-picker v-model="timeModel"
                       :min="config.minTime"
                       :max="config.maxTime"
                       :format="display.ampm ? 'ampm' : '24hr'"
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
        </v-time-picker>
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
                timeModel: '00:00'
            }
        },
        mounted()
        {
            this.timeModel = this.modelProxy;
            this.updateValue(false);
        },
        computed: {
            landscape()
            {
                if (!this.display.landscape) {
                    return false;
                }
                return this.$vuetify.breakpoint.mdAndUp || false;
            }
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