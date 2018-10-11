<template>
    <div>
        <v-text-field
                type="text"
                :error-messages="allErrors"
                :value="info"
                readonly

                @click.native.stop="uploadInput.click()"
                @input="onClear($event)"


                :label="$intl.translate(display.title)"
                :hint="$intl.translate(display.hint)"
                persistent-hint

                :suffix="$intl.translate(display.suffix)"
                :prefix="$intl.translate(display.prefix)"
                :prepend-inner-icon="$controlIcon(display.prependIcon)"
                :prepend-icon="$controlIcon(display.prependOuterIcon)"
                :append-icon="$controlIcon(display.appendIcon)"
                :append-outer-icon="$controlIcon(display.appendOuterIcon)"


                :color="display.color || undefined"

                :clearable="display.clearable"

                :box="display.appearance === 'box'"
                :solo="display.appearance === 'solo'"
                :solo-inverted="display.appearance === 'solo-inverted'"
                :outline="display.appearance === 'outline'"

                :flat="!!display.flat"

                :required="config.required"
        ></v-text-field>

        <v-list dense v-if="config.multiple && modelProxy != null && modelProxy.length > 0">
            <v-list-tile v-for="(file, key) in modelProxy" :key="key">
                <v-list-tile-content>
                    <v-list-tile-title>{{file.name}}</v-list-tile-title>
                    <v-list-tile-sub-title>{{formatSize(file.size)}}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-btn icon ripple @click.stop="removeItem(file)">
                        <v-icon color="red">delete</v-icon>
                    </v-btn>
                </v-list-tile-action>
            </v-list-tile>
        </v-list>

        <input v-show="false" ref="file" type="file" :accept="accept" :multiple="!!config.multiple"
               @change="uploadInputChanged()">
    </div>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";

    export default {
        mixins: [JsonFormElementMixin],
        data() {
            return {info: ''};
        },
        computed: {
            accept()
            {
                if (!this.config.fileMimeType) {
                    return undefined;
                }
                if (typeof this.config.fileMimeType === 'string') {
                    return this.config.fileMimeType;
                }
                if (Array.isArray(this.config.fileMimeType)) {
                    return this.config.fileMimeType.join(', ');
                }
                return undefined;
            },
            uploadInput()
            {
                return this.$refs.file;
            }
        },
        methods: {
            onClear(data)
            {
                if (data != null) {
                    return;
                }
                this.$set(this.model, this.name, this.config.multiple ? [] : undefined);
                this.setInfo();
            },
            removeItem(item) {
                const pos = this.modelProxy.indexOf(item);
                if (pos === -1) {
                    return;
                }
                this.modelProxy.splice(pos, 1);
                this.setInfo();
            },
            uploadInputChanged(input = this.uploadInput)
            {
                const files = input.files;
                if (!files || files.length === 0) {
                    input.value = null;
                    return;
                }
                if (this.config.multiple) {
                    let list = [];
                    for (let i = 0; i < files.length; i++) {
                        list.push(files[i]);
                    }
                    if (this.modelProxy && this.modelProxy.length > 0) {
                        list = this.modelProxy.concat(list);
                    }
                    this.$set(this.model, this.name, list);
                } else {
                    this.$set(this.model, this.name, files[0]);
                }
                input.value = null;
                this.setInfo();
            },
            getFilesInfo(files) {
                if (files == null) {
                    return '';
                }

                const size = this.totalSize(files);
                const formatted = this.formatSize(size);

                if (Array.isArray(files)) {
                    if (files.length === 0) {
                        return '';
                    }
                    return this.$intl.translate({
                        key: 'common.form.multipleFilesLabel',
                        text: '{count} files ({formattedSize})'
                    }, {
                        count: files.length,
                        size: size,
                        formattedSize: formatted
                    });
                }

                return this.$intl.translate({
                    key: 'common.form.filesLabel',
                    text: '{name} ({formattedSize})'
                }, {
                    name: files.name,
                    size: size,
                    formattedSize: formatted
                });
            },
            setInfo()
            {
                this.info = this.getFilesInfo(this.modelProxy);
                this.validate();
            },
            totalSize(files) {
                if (Array.isArray(files)) {
                    return files.reduce((total, file) => total + (file.size || 0), 0)
                }
                return files.size || 0;
            },
            formatSize(value, precision = 2)
            {
                const sizes = ['B', 'KB', 'MB'];

                for (let i = 0; i < sizes.length; i++) {
                    if (value < 1024) {
                        return value.toFixed(precision) + sizes[i];
                    }
                    value /= 1024;
                }

                return Math.ceil(value) + 'GB';
            }
        }
    }
</script>