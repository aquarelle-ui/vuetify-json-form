<template>
    <div class="ace-editor"></div>
</template>
<style>
    .ace-editor {
        width: 100%;
        min-height: 1px;
    }

    .ace-editor .ace_gutter, .ace-editor .ace_scrollbar {
        z-index: 2;
    }
</style>
<script>
    import ace from "brace";
    import 'brace/theme/chrome'
    import 'brace/ext/searchbox'

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
                hasSyntaxError: false,
                check: () => {
                    this.hasSyntaxError = this.editor.getSession().getAnnotations().some(annot => {
                        return annot.type === 'error';
                    });
                },
                onChange: () => {
                    this.$emit('input', this.editor.getValue());
                }
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

            editor.on('change', this.onChange);
            editor.on('blur', this.check);
            editor.getSession().on('changeAnnotation', this.check);
        },

        beforeDestroy()
        {
            const editor = this.editor;

            editor.getSession().off('changeAnnotation', this.check);
            editor.off('blur', this.check);
            editor.off('change', this.onChange);

            editor.getSession().destroy();
            editor.destroy();

            const el = this.$el;

            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }

            this.hasSyntaxError = false;
            this.editor = null;
        },

        watch: {
            theme(theme)
            {
                const editor = this.editor;
                editor && editor.setTheme('ace/theme/' + theme);
            },
            value(val)
            {
                const editor = this.editor;
                if (!editor) {
                    return;
                }

                const cursor = editor.selection.getCursor();
                editor.setValue(val || '');
                editor.clearSelection();
                editor.gotoLine(cursor.row + 1, cursor.column);
            },
            lang(val)
            {
                const editor = this.editor;
                editor && editor.getSession().setMode('ace/mode/' + val);
            },
            options(val)
            {
                const editor = this.editor;
                editor && editor.setOptions(val);
            }
        }
    };
</script>