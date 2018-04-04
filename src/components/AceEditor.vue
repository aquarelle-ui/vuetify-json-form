<template>
    <div class="ace-editor"></div>
</template>
<style>
    .ace-editor {
        width: 100%;
        min-height: 1px;
    }
</style>
<script>
    import ace from "brace";
    import 'brace/theme/chrome'

    import 'brace/mode/html'
    import 'brace/mode/javascript'
    import 'brace/mode/php'
    import 'brace/mode/twig'
    import 'brace/mode/text'
    import 'brace/mode/markdown'


    import 'brace/mode/c_cpp'
    import 'brace/mode/csharp'
    import 'brace/mode/java'


    import 'brace/mode/batchfile'

    // Struct
    import 'brace/mode/json'
    import 'brace/mode/xml'
    import 'brace/mode/yaml'

    // BD
    import 'brace/mode/sql'
    import 'brace/mode/mysql'

    // CSS
    import 'brace/mode/sass'
    import 'brace/mode/css'
    import 'brace/mode/scss'
    import 'brace/mode/stylus'

    export default {
        name: 'ace-editor',
        props: {
            value: {type: String, default: '', required: false},
            lang: {type: String, default: 'php', required: false},
            theme: {type: String, default: 'chrome', required: false},
            options: {type: Object, default: () => ({minLines: 5, maxLines: 20}), required: false}
        },
        data()
        {
            return {
                editor: null,
                hasSyntaxError: false
            };
        },

        mounted()
        {
            const editor = this.editor = ace.edit(this.$el);
            editor.$blockScrolling = Infinity;
            editor.getSession().setMode('ace/mode/' + this.lang);
            editor.setTheme('ace/theme/' + this.theme);
            editor.setOptions(this.options);
            editor.setValue(this.value || '', 1);

            const check = () => {
                this.hasSyntaxError = editor.getSession().getAnnotations().some(annot => {
                    return annot.type === 'error';
                });
            };
            editor.on("blur", check);
            editor.getSession().on('changeAnnotation', check);
            editor.on('change', () => {
                this.$emit('input', editor.getValue());
            });
        },

        watch: {
            theme(theme)
            {
                this.theme = theme;
                this.editor.setTheme('ace/theme/' + theme);
            }
        }
    };
</script>