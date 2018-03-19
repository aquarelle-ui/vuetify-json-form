<template>
    <div>
        <control-label :text="$intl.translate(display.title)" :has-error="allErrors.length > 0" :required="config.required"></control-label>
        <ace-editor ref="editor" v-model="model[name]" :options="config.editor" :lang="config.lang"></ace-editor>
        <block-error :error="allErrors.length > 0 ? allErrors[0] : undefined"></block-error>
    </div>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";
    import AceEditor from "../../components/AceEditor.vue";
    import BlockError from "../../components/Error/Block.vue";
    import ControlLabel from "../../components/ControlLabel.vue";

    export default {
        name: 'code-control',
        components: {AceEditor, BlockError, ControlLabel},
        mixins: [JsonFormElementMixin],
        computed: {
            hasSyntaxError() {
                return this.$refs.editor.hasSyntaxError;
            }
        }
    }
</script>