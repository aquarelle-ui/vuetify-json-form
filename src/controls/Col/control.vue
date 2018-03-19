<template>
    <v-flex v-bind="colProps" class="pb-0">
        <json-form-element v-for="(item, index) in items" :key="$uniqueObjectId(item, index)"
                           :control="item"
                           :model="modelProxy"
                           :validator="validatorProxy"
                           :json-form-wrapper="jsonFormWrapper"
        >
        </json-form-element>
    </v-flex>
</template>
<script>
    import {JsonFormElementMixin} from "vue-json-form";

    const DEVICES = ['xs', 'sm', 'md', 'lg', 'xl'];

    export default {
        name: 'col-control',
        mixins: [JsonFormElementMixin],
        computed: {
            colProps() {
                let p = {};
                if (this.display.size) {
                    this.setDeviceProps(p, this.display.size, '', 'md');
                }
                if (this.display.offset) {
                    this.setDeviceProps(p, this.display.offset, 'offset-', 'offset-md');
                }
                return p;
            }
        },
        methods: {
            setDeviceProps(container, props, prefix, default_prefix = null) {
                if (typeof props === 'object') {
                    DEVICES.map(d => {
                        if (props.hasOwnProperty(d)) {
                            container[prefix + d + props[d]] = true;
                        }
                    });
                }
                else if (props && default_prefix) {
                    container[default_prefix + props] = true;
                }
            }
        }
    };
</script>