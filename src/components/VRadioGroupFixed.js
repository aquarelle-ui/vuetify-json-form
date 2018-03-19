import VRadioGroup from 'vuetify/components/VRadioGroup';

export default {
    name: "v-radio-group-fixed",
    extends: VRadioGroup,
    props: {
        valueComparator: {type: Function, default: () => ((a, b) => a === b)}
    },
    mounted: function(){
        let val = this.inputValue;
        this.radios.forEach(radio => {
            radio.isActive = this.valueComparator(val, radio.value)
        })
    },
    methods: {
        toggleRadio (value) {
            if (this.disabled) {
                return
            }

            this.shouldValidate = true
            this.$emit('change', value)
            this.$nextTick(() => this.validate())

            this.radios
                .filter(r => !this.valueComparator(r.value, value))
                .forEach(r => r.isActive = false)
        }
    },
    watch: {
        inputValue (val) {
            this.radios.forEach(radio => {
                radio.isActive = this.valueComparator(val, radio.value)
            })
        }
    }
};