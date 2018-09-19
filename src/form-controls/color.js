import text from "./text";

export default {
    extends: text,
    created()
    {
        this.display.placeholder = '#000000';
        this.config.maxLength = 7;
        this.inputType = 'color';
    }
}