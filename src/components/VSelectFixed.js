import VSelect from "vuetify/components/VSelect";

export default {
    name: "v-select-fixed",
    extends: VSelect,
    props: {
        itemValue: {
            type: [String, Function],
            default: "value"
        }
    },
    methods: {
        getValue(item)
        {
            if (this.itemValue instanceof Function) {
                return this.itemValue(item);
            }
            return this.getPropertyFromItem(item, this.itemValue)
        },
        genSelectedItems(val = this.inputValue)
        {
            // If we are using tags, don't filter results
            if (this.tags) {
                return (this.selectedItems = val)
            }

            // Combobox is the single version
            // of a taggable select element
            if (this.combobox) {
                return (this.selectedItems = val != null ? [val] : [])
            }

            let selectedItems = this.computedItems.filter(i => {
                if (!this.isMultiple) {
                    return this.valueComparator(this.getValue(i), this.returnObject ? this.getValue(val) : val)
                } else {
                    // Always return Boolean
                    return this.findExistingIndex(i) > -1
                }
            })

            if (!selectedItems.length &&
                val != null &&
                this.tags
            ) {
                selectedItems = Array.isArray(val) ? val : [val]
            }

            this.selectedItems = selectedItems
        },
    }
}