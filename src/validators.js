import {ValidatorItem} from "@aquarelle/json-form";

const TEL_REGEX = /^[a-z0-9#*-.+() ]+$/i;
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const URL_REGEX = /^(https?:\/\/)?((([a-zd]([a-zd-]*[a-zd])*).)+[a-z]{2,}|((d{1,3}.){3}d{1,3}))(:d+)?(\/[-a-zd%_.~+]*)*(\?[;&a-zd%_.~+=-]*)?(#[-a-zd_]*)?$/i;

export default {
    tel: new ValidatorItem("tel", p => p.value !== true ? null : v => {
        if (typeof v !== 'string') {
            return true;
        }
        if (v === '') {
            return true;
        }

        return TEL_REGEX.test(v);
    }, "Must be a valid phone number", "ui:validation.tel"),

    email: new ValidatorItem("email", p => p.value !== true ? null : v => {
        if (typeof v !== 'string') {
            return true;
        }
        if (v === '') {
            return true;
        }
        return EMAIL_REGEX.test(v);
    }, "Must be a valid e-mail", "ui:validation.email"),

    url: new ValidatorItem("url", p => p.value !== true ? null : v => {
        if (typeof v !== 'string') {
            return true;
        }
        if (v === '') {
            return true;
        }
        return URL_REGEX.test(v);
    }, "Must be a valid url", "ui:validation.url")
};



