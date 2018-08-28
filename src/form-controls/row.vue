<template>
    <v-container fluid grid-list-xl class="px-0 py-0">
        <v-layout row wrap>
            <json-form-element v-for="(item, index) in items" :key="$uniqueObjectId(item, index)"
                               :control="item"
                               :model="modelProxy"
                               :validator="validatorProxy"
                               :wrapper="wrapper"
                               :path="path"
                               :parent-validations-container="parentValidationsContainer"
                               :validations-container="validationsContainer"
                               ref="formElement"
            >
            </json-form-element>
        </v-layout>
    </v-container>
</template>
<script>
    import {JsonFormElementMixin, JsonFormElement} from "@aquarelle/json-form";

    export default {
        mixins: [JsonFormElementMixin],
        components: {JsonFormElement},
        methods: {
            onRouteLeave(func)
            {
                return func(this.$refs.formElement);
            }
        }
    };
</script>