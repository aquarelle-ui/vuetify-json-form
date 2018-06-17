import JsonForm from "@aquarelle/json-form";
import * as elements from "./controls";
import ControlIcon from "./components/ControlIcon.vue";
import ControlLabel from "./components/ControlLabel.vue";
import ErrorList from "./components/Error/List";
import ErrorBlock from "./components/Error/Block";
import DialogForms from "./components/DialogForms.vue";
import StepperForm from "./components/StepperForm.vue";
import BlockForm from "./components/BlockForm.vue";
import AceEditor from "./components/AceEditor.vue";
import QuillEditor from "./components/QuillEditor.vue";

import "./style.css";

export {default as VSelectFixed} from "./components/VSelectFixed";
export {default as VRadioGroupFixed} from "./components/VRadioGroupFixed";

export {default as AsyncGroupControl} from "./components/Form/AsyncGroupControl";

export default function install(Vue) {
    Vue.use(JsonForm);
    Vue.prototype.$controlIcon = function (icon) {
        if (typeof icon !== 'string') {
            return undefined;
        }
        return icon.replace(':', '-');
    };

    Vue.component(ControlLabel.name, ControlLabel);
    Vue.component(ErrorList.name, ErrorList);
    Vue.component(ErrorBlock.name, ErrorBlock);
    Vue.component(ControlIcon.name, ControlIcon);
    Vue.component(DialogForms.name, DialogForms);
    Vue.component(StepperForm.name, StepperForm);
    Vue.component(BlockForm.name, BlockForm);
    Vue.component(AceEditor.name, AceEditor);
    Vue.component(QuillEditor.name, QuillEditor);

    Object.values(elements).forEach(component => {
        Vue.use(component)
    });
};

