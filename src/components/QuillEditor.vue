<template>
    <div class="quillWrapper">
        <div ref="quillContainer"></div>
        <input type="file"
               style="display:none;"
               v-if="useCustomImageHandler"
               @change="emitImageInfo($event)"
               ref="fileInput">
    </div>
</template>
<style>
    .ql-editor {
        min-height: 250px;
        max-height: 350px;
        font-size: 14px;
    }

    .quillWrapper .ql-snow.ql-toolbar {
        padding-top: 8px;
        padding-bottom: 4px;
    }

    .quillWrapper .ql-snow.ql-toolbar button {
        margin: 1px;
    }

    .quillWrapper .ql-snow.ql-toolbar .ql-formats {
        margin-bottom: 10px;
    }

    .quillWrapper .ql-snow.ql-toolbar button svg, .ql-snow .ql-toolbar button svg {
        width: 22px;
        height: 22px;
    }

    .quillWrapper .ql-editor ul[data-checked=true] > li::before, .quillWrapper .ql-editor ul[data-checked=false] > li::before {
        font-size: 1.35em;
        vertical-align: baseline;
        bottom: -0.065em;
        font-weight: 900;
        color: #222;
    }

    .quillWrapper .ql-snow .ql-stroke {
        stroke: rgba(63, 63, 63, 0.95);
        stroke-linecap: square;
        stroke-linejoin: initial;
        stroke-width: 1.7px;
    }

    .quillWrapper .ql-picker-label {
        font-size: 15px;
    }

    .quillWrapper .ql-snow .ql-active .ql-stroke {
        stroke-width: 2.25px;
    }

    .quillWrapper .ql-toolbar.ql-snow .ql-formats {
        vertical-align: top;
    }
</style>
<style>

    .text-left {
        text-align: left;
    }

    .text-center {
        text-align: center;
    }

    .text-right {
        text-align: right;
    }

    .text-justify {
        text-align: justify;
    }

    .text-indent-1 {
        padding-left: 3em !important;
    }

    .text-indent-2 {
        padding-left: 6em !important;;
    }

    .text-indent-3 {
        padding-left: 9em !important;;
    }

    .text-indent-4 {
        padding-left: 12em !important;;
    }

    .text-indent-5 {
        padding-left: 15em !important;;
    }

    .text-indent-6 {
        padding-left: 18em !important;;
    }

    .text-indent-7 {
        padding-left: 21em !important;;
    }

    .text-indent-8 {
        padding-left: 24em !important;;
    }

    .ql-color-picker .ql-picker-options {
        width: 112px !important;
    }

    .text-black {
        color: #000000 !important;
    }

    .text-dark {
        color: #343a40 !important;
    }

    .text-light {
        color: #f8f9fa !important;
    }

    .text-white {
        color: #ffffff !important;
    }

    .text-primary {
        color: #007bff !important;
    }

    .text-secondary {
        color: #868e96 !important;
    }

    .text-info {
        color: #17a2b8 !important;
    }

    .text-success {
        color: #28a745 !important;
    }

    .text-warning {
        color: #ffc107 !important;
    }

    .text-danger {
        color: #dc3545 !important;
    }

    .bg-black, .ql-picker-item[data-value="black"] {
        background-color: #000000 !important;
        color: white;
    }

    .bg-dark, .ql-picker-item[data-value="dark"] {
        background-color: #343a40 !important;
        color: white;
    }

    .bg-light, .ql-picker-item[data-value="light"] {
        background-color: #f8f9fa !important;
        color: black;
    }

    .bg-white, .ql-picker-item[data-value="white"] {
        background-color: #ffffff !important;
        color: black;
    }

    .bg-primary, .ql-picker-item[data-value="primary"] {
        background-color: #007bff !important;
        color: white;
    }

    .bg-secondary, .ql-picker-item[data-value="secondary"] {
        background-color: #868e96 !important;
        color: white;
    }

    .bg-info, .ql-picker-item[data-value="info"] {
        background-color: #17a2b8 !important;
        color: white;
    }

    .bg-success, .ql-picker-item[data-value="success"] {
        background-color: #28a745 !important;
        color: white;
    }

    .bg-warning, .ql-picker-item[data-value="warning"] {
        background-color: #ffc107 !important;
        color: white;
    }

    .bg-danger, .ql-picker-item[data-value="danger"] {
        background-color: #dc3545 !important;
        color: white;
    }

    .ql-picker-options .ql-picker-item:not([data-value]) {
        background-color: white !important;
        border: red 2px dashed;
    }

</style>
<style>
    ol.indent-list, ul.indent-list {
        padding-left: 0px;
    }

    ol.indent-list > li, ul.indent-list > li {
        list-style-type: none;
        padding-left: 1.5em;
    }

    .indent-list li::before {
        display: inline-block;
        white-space: nowrap;
        width: 1.2em;
        text-align: right;
        margin-right: 0.3em;
        margin-left: -1.5em;
    }

    .indent-list > li.text-indent-1 {
        padding-left: 4.5em;
    }

    .indent-list > li.text-indent-2 {
        padding-left: 7.5em;
    }

    .indent-list > li.text-indent-3 {
        padding-left: 10.5em;
    }

    .indent-list > li.text-indent-4 {
        padding-left: 13.5em;
    }

    .indent-list > li.text-indent-5 {
        padding-left: 16.5em;
    }

    .indent-list > li.text-indent-6 {
        padding-left: 19.5em;
    }

    .indent-list > li.text-indent-7 {
        padding-left: 22.5em;
    }

    .indent-list > li.text-indent-8 {
        padding-left: 25.5em;
    }

    ol.indent-list > li {
        counter-increment: indent-list-1;
        counter-reset: indent-list-2 indent-list-3 indent-list-4 indent-list-5 indent-list-6 indent-list-7 indent-list-8;
    }

    ol.indent-list > li:before {
        content: counter(indent-list-1, decimal) ". ";
    }

    ol.indent-list > li.text-indent-1 {
        counter-increment: indent-list-2;
        counter-reset: indent-list-3 indent-list-4 indent-list-5 indent-list-6 indent-list-7 indent-list-8;
    }

    ol.indent-list > li.text-indent-1:before {
        content: counter(indent-list-2, lower-alpha) ". ";
    }

    ol.indent-list > li.text-indent-2 {
        counter-increment: indent-list-3;
        counter-reset: indent-list-4 indent-list-5 indent-list-6 indent-list-7 indent-list-8;
    }

    ol.indent-list > li.text-indent-2:before {
        content: counter(indent-list-3, lower-roman) ". ";
    }

    ol.indent-list > li.text-indent-3 {
        counter-increment: indent-list-4;
        counter-reset: indent-list-5 indent-list-6 indent-list-7 indent-list-8;
    }

    ol.indent-list > li.text-indent-3:before {
        content: counter(indent-list-4, decimal) ". ";
    }

    ol.indent-list > li.text-indent-4 {
        counter-increment: indent-list-5;
        counter-reset: indent-list-6 indent-list-7 indent-list-8;
    }

    ol.indent-list > li.text-indent-4:before {
        content: counter(indent-list-5, lower-alpha) ". ";
    }

    ol.indent-list > li.text-indent-5 {
        counter-increment: indent-list-6;
        counter-reset: indent-list-7 indent-list-8;
    }

    ol.indent-list > li.text-indent-5:before {
        content: counter(indent-list-6, lower-roman) ". ";
    }

    ol.indent-list > li.text-indent-6 {
        counter-increment: indent-list-7;
        counter-reset: indent-list-8;
    }

    ol.indent-list > li.text-indent-6:before {
        content: counter(indent-list-7, decimal) ". ";
    }

    ol.indent-list > li.text-indent-7 {
        counter-increment: indent-list-8;
    }

    ol.indent-list > li.text-indent-7:before {
        content: counter(indent-list-8, lower-alpha) ". ";
    }

    ol.indent-list > li.text-indent-8 {
        counter-increment: indent-list-9;
    }

    ol.indent-list > li.text-indent-8:before {
        content: counter(indent-list-9, lower-roman) ". ";
    }

    ul.indent-list > li:before {
        content: "•";
    }

    ul.indent-list > li.text-indent-1:before {
        content: "○";
    }

    ul.indent-list > li.text-indent-2:before {
        content: "■";
    }

    ul.indent-list > li.text-indent-3:before {
        content: "□";
    }

    ul.indent-list > li.text-indent-4:before {
        content: "•";
    }

    ul.indent-list > li.text-indent-5:before {
        content: "○";
    }

    ul.indent-list > li.text-indent-6:before {
        content: "■";
    }

    ul.indent-list > li.text-indent-7:before {
        content: "□";
    }

    ul.indent-list > li.text-indent-8:before {
        content: "•";
    }
</style>
<script>
    import Quill from 'quill';
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';

    import hljs from "highlight.js";
    import 'highlight.js/styles/default.css';

    const TEXT_COLORS = [
        'black', 'dark', 'light', 'white',
        'primary', 'secondary', 'info', 'success', 'warning', 'danger'
    ];

    const BG_COLORS = [
        'black', 'dark', 'light', 'white',
        'primary', 'secondary', 'info', 'success', 'warning', 'danger'
    ];

    const syntax = {
        highlight(text)
        {
            return hljs.highlightAuto(text).value;
        }
    };

    const MODES = {
        minimal: {
            syntax: false,
            formula: false,
            toolbar: [
                [{'header': [1, 2, 3, false]}],
                [{'align': []}],
                ['bold', 'italic', 'underline', 'strike'],

                [{'list': 'ordered'}, {'list': 'bullet'}],

                ['blockquote', 'link'],
                ['clean']
            ]
        },
        simple: {
            syntax: false,
            formula: false,
            toolbar: [
                [{'header': [1, 2, 3, 4, 5, 6, false]}],
                [{'align': []}],
                ['bold', 'italic', 'underline', 'strike'],

                [{'list': 'ordered'}, {'list': 'bullet'}],
                [{'indent': '-1'}, {'indent': '+1'}],

                ['blockquote', 'code-block', 'link', 'image', 'video'],
                ['clean']
            ]
        },
        full: {
            syntax: syntax,
            formula: false,
            toolbar: [
                [{'header': [1, 2, 3, 4, 5, 6, false]}],
                [{'align': []}],
                ['bold', 'italic', 'underline', 'strike', {'script': 'sub'}, {'script': 'super'}],

                [{'list': 'ordered'}, {'list': 'bullet'}, {'list': 'check'}],
                [{'indent': '-1'}, {'indent': '+1'}],

                [{'color': TEXT_COLORS.concat([false])}, {'background': BG_COLORS.concat([false])}],

                ['blockquote', 'code-block', 'link', 'image', 'video'],
                ['clean']
            ]
        }
    };

    // Setup quill
    (function (Quill) {

        const setup = (cls, props) => {
            cls = Quill.import(cls);
            for (let p in props) {
                if (props.hasOwnProperty(p)) {
                    cls[p] = props[p];
                }
            }
            Quill.register(cls, true);
        };

        // Background color
        setup('attributors/class/background', {
            keyName: 'bg',
            whitelist: BG_COLORS
        });

        // Text color
        setup('attributors/class/color', {
            keyName: 'text',
            whitelist: TEXT_COLORS
        });

        // Text align
        setup('attributors/class/align', {
            keyName: 'text'
        });

        // Strike format
        setup('formats/strike', {
            tagName: ['DEL', 'S']
        });

        // Indent format
        setup('formats/indent', {
            keyName: 'text-indent'
        });

        // Indent format
        setup('formats/list', {
            className: 'indent-list'
        });

        // Indent format
        setup('formats/code-block', {
            className: 'hljs'
        });

    })(Quill);


    export default {
        name: 'quill-editor',

        props: {
            value: {type: String, required: false, default: ''},
            placeholder: {type: String, default: '', required: false},
            disabled: {type: Boolean, default: false, required: false},
            useCustomImageHandler: {type: Boolean, default: false, required: false},
            editorModules: {type: [Object, String], default: 'full', required: false},
            editorTheme: {type: String, default: 'snow', required: false}
        },

        data()
        {
            return {
                quill: null,
                editor: null
            }
        },

        mounted()
        {
            let modules = MODES.full;
            if (this.editorModules) {
                if (typeof this.editorModules === 'string') {
                    modules = MODES.hasOwnProperty(this.editorModules) ? MODES[this.editorModules] : MODES.full;
                }
                else {
                    modules = this.editorModules;
                }
            }

            // Quill element
            this.quill = new Quill(this.$refs.quillContainer, {
                modules: modules,
                placeholder: this.placeholder,
                theme: this.editorTheme,
                readOnly: this.disabled,
            });

            // Editor element
            this.editor = this.$refs.quillContainer.querySelector('.ql-editor');

            // Set initial content
            this.editor.innerHTML = this.value || '';

            // Check for custom image handler
            if (this.useCustomImageHandler) {
                let toolbar = this.quill.getModule('toolbar');
                toolbar.addHandler('image', (image, callback) => {
                    this.$refs.fileInput.click();
                });
            }

            // Watch text
            this.quill.on('text-change', () => {
                let text = this.editor.innerHTML;
                if (text === '<p><br></p>') {
                    text = '';
                }
                this.$emit('input', text);
            });
        },

        watch: {
            value(val)
            {
                if (val !== this.editor.innerHTML && !this.quill.hasFocus()) {
                    this.editor.innerHTML = val;
                }
            },
            disabled(status)
            {
                this.quill.enable(!status);
            }
        },

        methods: {
            emitImageInfo($event)
            {
                let file = $event.target.files[0];
                let Editor = this.quill;
                let range = Editor.getSelection();
                let cursorLocation = range.index;
                this.$emit('imageAdded', file, Editor, cursorLocation)
            }
        }
    }
</script>