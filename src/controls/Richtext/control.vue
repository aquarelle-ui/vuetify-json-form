<template>
    <div>
        <control-label :text="$intl.translate(display.title)" :has-error="allErrors.length > 0"
                       :required="config.required"></control-label>
        <quill-editor
                v-model="model[name]"
                :placeholder="$intl.translate(display.placeholder)"
                :editor-modules="config.mode"
        >
        </quill-editor>
        <block-error :error="allErrors.length > 0 ? allErrors[0] : undefined"></block-error>
    </div>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";
    import QuillEditor from '../../components/QuillEditor.vue';
    import BlockError from "../../components/Error/Block.vue";
    import ControlLabel from "../../components/ControlLabel.vue";

    export default {
        name: 'richtext-control',
        mixins: [JsonFormElementMixin],
        components: {ControlLabel, QuillEditor, BlockError}
    };
</script>