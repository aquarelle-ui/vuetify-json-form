<template>
    <v-expansion-panel v-if="display.panel === true">
        <v-expansion-panel-content :value="true">
            <div slot="header">{{$intl.translate(display.title)}}</div>
            <json-form-group
                    class="px-2"
                    :model="modelProxy"
                    :validator="validatorProxy"
                    :items="items"
                    :json-form-wrapper="jsonFormWrapper"
            >
            </json-form-group>
        </v-expansion-panel-content>
    </v-expansion-panel>
    <div v-else>
        <v-subheader v-if="!!display.title">
            <control-label :text="$intl.translate(display.title)"></control-label>
        </v-subheader>
        <json-form-group
                :model="modelProxy"
                :validator="validatorProxy"
                :items="items"
                :json-form-wrapper="jsonFormWrapper"
        >
        </json-form-group>
    </div>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";

    export default {
        name: 'group-control',
        mixins: [JsonFormElementMixin]
    }
</script>