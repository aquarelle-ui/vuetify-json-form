<template>
    <v-container fluid grid-list-xl style="padding: 0">
        <v-layout row wrap>
            <json-form-element v-for="(item, index) in items" :key="$uniqueObjectId(item, index)"
                               :control="item"
                               :model="modelProxy"
                               :validator="validatorProxy"
                               :json-form-wrapper="jsonFormWrapper"
                               ref="formElement"
            >
            </json-form-element>
        </v-layout>
    </v-container>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";

    export default {
        name: 'row-control',
        mixins: [JsonFormElementMixin],
        methods: {
            onRouteLeave(func)
            {
                return func(this.$refs.formElement);
            }
        }
    };
</script>