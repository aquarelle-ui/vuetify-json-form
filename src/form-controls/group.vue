<template>
    <v-expansion-panel expand v-if="display.panel === true">
        <v-expansion-panel-content>
            <div slot="header">{{$intl.translate(display.title)}}</div>
            <json-form-group
                    class="px-2"
                    :model="modelProxy"
                    :validator="validatorProxy"
                    :items="items"
                    :wrapper="wrapper"
                    :path="path"
                    :parent-validations-container="parentValidationsContainer"
                    :validations-container="validationsContainer"
                    ref="formGroup"
            >
            </json-form-group>
        </v-expansion-panel-content>
    </v-expansion-panel>
    <div v-else>
        <v-subheader v-if="!!display.title" class="mb-0">
            <control-label :text="$intl.translate(display.title)"></control-label>
        </v-subheader>
        <json-form-group
                :model="modelProxy"
                :validator="validatorProxy"
                :items="items"
                :wrapper="wrapper"
                :path="path"
                :parent-validations-container="parentValidationsContainer"
                :validations-container="validationsContainer"
                ref="formGroup"
        >
        </json-form-group>
    </div>
</template>
<script>
    import {JsonFormElementMixin, JsonFormGroup} from "@aquarelle/json-form";
    import {ControlLabel} from "../components";

    export default {
        mixins: [JsonFormElementMixin],
        components: {JsonFormGroup, ControlLabel},
        methods: {
            onRouteLeave(func)
            {
                return func(this.$refs.formGroup);
            }
        }
    }
</script>