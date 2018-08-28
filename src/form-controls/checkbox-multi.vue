<template>
    <div>
        <control-label :text="wrapper.translate(display.title)" :has-error="allErrors.length > 0"
                       :required="config.required"></control-label>
        <v-checkbox v-for="item in items" :key="$uniqueObjectId(item)"
                    class="mt-0"
                    v-model="model[name]"
                    :value="item.value"
                    multiple

                    :color="item.color || undefined"
                    :label="wrapper.translate(item.title)"
                    :prepend-icon="$controlIcon(item.icon)"
                    :hint="wrapper.translate(item.description)"
                    persistent-hint
        ></v-checkbox>
        <block-error :error="allErrors.length > 0 ? allErrors[0] : undefined"></block-error>
    </div>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";
    import {ControlLabel, BlockError} from "../components";

    export default {
        mixins: [JsonFormElementMixin],
        components: {ControlLabel, BlockError}
    }
</script>