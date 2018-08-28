import text from "./text";

export default {
    extends: text,
    created()
    {
        this.inputType = 'email';
    }
}