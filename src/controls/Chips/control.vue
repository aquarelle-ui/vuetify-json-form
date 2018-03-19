<template>
    <v-select
            v-model="model[name]"
            :error-messages="allErrors"
            chips
            tags

            clearable

            :label="$intl.translate(display.title)"
            :hint="$intl.translate(display.hint)"
            :prepend-icon="$controlIcon(display.prependIcon)"
            :append-icon="$controlIcon(display.appendIcon)"

            :required="config.required"
    >
        <template slot="selection" slot-scope="data">
            <v-chip
                    close
                    @input="remove(data.item)"
                    :selected="data.selected"
            >
                <strong>{{ data.item }}</strong>
            </v-chip>
        </template>
    </v-select>
</template>
<script>
    import {JsonFormElementMixin} from "vue-json-form";

    export default {
        name: 'chips-control',
        mixins: [JsonFormElementMixin],
        methods: {
            remove(item) {
                this.modelProxy.splice(this.modelProxy.indexOf(item), 1)
            }
        }
    }
</script>