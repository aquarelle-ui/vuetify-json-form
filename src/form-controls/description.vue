<template>
    <v-alert :value="true" :outline="outline" :color="color" :icon="icon">
        <div class="title" v-if="display.title != null" v-text="$intl.translate(display.title)"></div>
        <div v-if="display.text != null" v-html="$intl.translate(display.text)"></div>
    </v-alert>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";

    export default {
        mixins: [JsonFormElementMixin],
        computed: {
            outline() {
                return this.display.hasOwnProperty('outline') ? Boolean(this.display.outline) : true;
            },
            color() {
                return this.display.color || 'info';
            },
            icon() {
                if (this.display.icon) {
                    return this.$controlIcon(this.display.icon);
                }

                switch (this.color) {
                    case 'success':
                        return 'check_circle';
                    case 'info':
                        return 'info';
                    case 'warning':
                        return 'warning';
                    case 'error':
                        return 'error';
                }

                return undefined;
            }
        }
    };
</script>