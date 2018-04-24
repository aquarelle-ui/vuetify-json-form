<template>
    <v-tabs>
        <v-tabs-slider></v-tabs-slider>
        <v-tab
                v-for="(item, key) in items"
                :key="$uniqueObjectId(item, key)"
                :href="'#' + tabPrefix + '-tab-' + (item.name || key)"
        >
            <v-icon v-if="tabHasError(item)" color="red">error</v-icon>
            <v-icon v-else-if="item.icon">{{item.icon}}</v-icon>
            {{$intl.translate(item.title)}}
        </v-tab>
        <v-tabs-items>
            <v-tab-item
                    v-for="(item, key) in items"
                    :key="$uniqueObjectId(item, key)"
                    :id="tabPrefix + '-tab-' + (item.name || key)"
            >
                <json-form-group
                        :model="modelProxy"
                        :validator="validatorProxy"

                        :items="item.items"
                        :json-form-wrapper="jsonFormWrapper"
                        :name="item.name"
                        ref="formGroup"
                >
                </json-form-group>
            </v-tab-item>
        </v-tabs-items>
    </v-tabs>
</template>
<script>
    import {JsonFormElementMixin, JsonFormGroup} from "@aquarelle/json-form";

    export default {
        components: {JsonFormGroup},
        name: 'tabs-control',
        mixins: [JsonFormElementMixin],
        data()
        {
            return {
                tabPrefix: this.$uniqueObjectId(this)
            }
        },
        methods: {
            tabHasError(tab, dirty = false)
            {
                if (tab.name) {
                    const v = this.validatorProxy[tab.name];
                    if (!v || !dirty && !v.$dirty) {
                        return false;
                    }
                    return v.$invalid;
                }

                const f = (item, validator) => {
                    if (item.config && Array.isArray(item.config.regions)) {
                        return item.config.some(region => {
                            const v = validator[region.name];
                            if (!v || !dirty && !v.$dirty) {
                                return false;
                            }
                            return v.$invalid;
                        });
                    }
                    if (!Array.isArray(item.items)) {
                        return false;
                    }
                    return item.items.some(subitem => {
                        if (subitem.name !== null) {
                            if (!dirty && !validator.$dirty) {
                                return false;
                            }
                            return validator.$invalid;
                        }
                        return f(subitem, validator);
                    });
                };

                return f(tab, this.validatorProxy);
            },
            onRouteLeave(func)
            {
                return func(this.$refs.formGroup);
            }
        },
        created()
        {
            this.items.map(item => {
                if (item.name && !this.modelProxy.hasOwnProperty(item.name)) {
                    this.$set(this.modelProxy, item.name, {});
                }
            });
        },
        destroyed()
        {
            this.items.map(item => {
                if (item.name) {
                    this.$delete(this.modelProxy, item.name);
                }
            });
        }
    };
</script>