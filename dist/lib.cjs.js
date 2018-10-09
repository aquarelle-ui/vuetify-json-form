'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsonForm = require('@aquarelle/json-form');

class HiddenParser extends jsonForm.ControlParser
{
    getDefault(definition)
    {
        return definition.hasOwnProperty('default') ? definition.default : (definition.nullable ? null : undefined);
    }

    parse(definition, form, validator)
    {
        const data = super.parse(definition, form, validator);
        jsonForm.ControlParser.setConfigUsingValidation(data.config, definition.validation, ['required']);
        return data;
    }
}

class SwitchGroupParser extends jsonForm.ObjectControlParser
{
    getDefault(definition, form)
    {
        return definition.default && typeof definition.default === 'object' ? {...definition.default} : null;
    }

    getItems(definition) {
        if (!definition.items || !Array.isArray(definition.items)) {
            return [];
        }
        return definition.items;
    }

    getSubValidationProperty()
    {
        return 'validations';
    }
}

class TabsParser extends jsonForm.ControlParser
{
    getDefault(definition, form)
    {
        let def = {};
        if (Array.isArray(definition.items)) {
            definition.items.map(item => {
                if (item.name) {
                    def[item.name] = {};
                }
            });
        }
        return def;
    }

    getItems(definition, form, data, validator)
    {
        if (!Array.isArray(definition.items)) {
            return [];
        }

        const validation = data.name == null ? validator : data.validation;

        const items = definition.items.map(item => {
            item = {...item};

            let v = null;
            if (item.name) {
                if (!validation.hasOwnProperty(item.name)) {
                    validation[item.name] = {};
                }
                v = validation[item.name];
            }
            else {
                v = validation;
            }

            if (Array.isArray(item.items)) {
                item.items = form.parseControlList(item.items, v);
            }
            else {
                item.items = [];
            }

            return item;
        });

        return items;
    }
}

class SelectParser extends jsonForm.ControlParser
{

    constructor(element, group)
    {
        super(element);
        this._group = group;
    }

    getDefault(definition)
    {
        if (definition.config && definition.config.multiple) {
            return Array.isArray(definition.default) ? definition.default : [];
        }
        return definition.default == null ? (definition.nullable ? null : undefined) : definition.default;
    }

    getConfig(definition)
    {
        return {
            titleProp: 'title',
            groupTitleProp: 'title',
            valueProp: 'value',
            iconProp: 'icon',
            descriptionProp: 'description',
            itemsProp: 'items',
            multiple: false,
            ...definition.config,
            group: this._group
        };
    }

    getItems(definition, form, data, validator)
    {
        if (!definition.items || !Array.isArray(definition.items)) {
            return [];
        }

        if (!data.config.group) {
            return definition.items;
        }

        const itemsProp = data.config.itemsProp;
        const titleProp = data.config.titleProp;
        const groupTitleProp = data.config.groupTitleProp;

        const items = [];
        let first = true;
        definition.items.map(group => {
            if (!group[itemsProp] || !Array.isArray(group[itemsProp]) || group[itemsProp].length === 0) {
                return;
            }
            if (first) {
                first = false;
            }
            else {
                items.push({divider: true});
            }
            items.push({header: group[groupTitleProp]});
            group[itemsProp].map(item => {
                if (!item[titleProp]) {
                    item[titleProp] = '';
                }
                items.push(item);
            });
        });
        return items;
    }

    parse(definition, form, validator)
    {
        const data = super.parse(definition, form, validator);
        if (data.config.multiple) {
            jsonForm.ControlParser.setConfigUsingValidation(data.config, definition.validation, ['required', 'minItems', 'maxItems']);
        }
        else {
            jsonForm.ControlParser.setConfigUsingValidation(data.config, definition.validation, ['required']);
        }
        return data;
    }
}

class DisplayParser extends SelectParser
{
    constructor(name)
    {
        super(name, false);
    }

    parse(definition, form, validator)
    {
        definition.items = [
            {
                title: 'Phone',
                description: 'Extra small device (xs)',
                icon: 'smartphone',
                value: 'xs',
            },
            {
                title: 'Tablet',
                description: 'Small device (sm)',
                icon: 'tablet',
                value: 'sm',
            },
            {
                title: 'Laptop',
                description: 'Medium device (md)',
                icon: 'laptop',
                value: 'md',
            },
            {
                title: 'Desktop',
                description: 'Large device (lg)',
                icon: 'desktop_windows',
                value: 'lg',
            },
            {
                title: 'TV',
                description: 'Extra large device (xl)',
                icon: 'tv',
                value: 'xl',
            }
        ];
        if (!definition.display) {
            definition.display = {};
        }
        definition.display.icons = true;
        definition.display.chips = true;
        if (!definition.config) {
            definition.config = {};
        }
        definition.config.itemTitle = 'title';
        definition.config.itemDescription = 'description';
        definition.config.itemValue = 'value';
        definition.config.itemIcon = 'icon';
        return super.parse(definition, form, validator);
    }
}

class DescriptionParser extends jsonForm.ControlParser
{
    getName()
    {
        return null;
    }

    getValidation()
    {
        return null;
    }

    getDefault(definition)
    {
        return undefined;
    }
}

class IconParser extends jsonForm.StringControlParser
{
    parse(definition, form, validator)
    {
        if (!definition.validation) {
            definition.validation = {};
        }
        if (!definition.validation.pattern) {
            definition.validation.pattern = {
                value: '^(|([a-zA-Z0-9\\-\\_]+\\:[a-zA-Z0-9\\-\\_]+))$',
                key: 'validation.icon',
                text: 'Invalid icon format'
            };
        }
        return super.parse(definition, form, validator);
    }
}

class ComponentParser extends jsonForm.ControlParser
{
    getSubValidationProperty(definition, form, data, validator)
    {
        if (!definition.config) {
            return null;
        }
        return definition.config.validatorProp || null;
    }
}

class ComboboxParser extends jsonForm.SelectionControlParser
{

    getDefault(definition)
    {
        if (definition.config && definition.config.multiple) {
            return Array.isArray(definition.default) ? definition.default : [];
        }
        return definition.default == null ? (definition.nullable ? null : undefined) : definition.default;
    }

    parse(definition, form, validator)
    {
        const data = super.parse(definition, form, validator);
        if (data.config.multiple) {
            jsonForm.SelectionControlParser.setConfigUsingValidation(data.config, definition.validation, ['required', 'minItems', 'maxItems']);
        }
        else {
            jsonForm.SelectionControlParser.setConfigUsingValidation(data.config, definition.validation, ['required']);
        }
        return data;
    }
}

class ChipsParser extends ComboboxParser
{
    parse(definition, form, validator)
    {
        if (!definition.display || typeof definition.display !== 'object') {
            definition.display = {};
        }
        if (!definition.config || typeof definition.config !== 'object') {
            definition.config = {};
        }

        definition.display.chips = true;
        definition.config.multiple = true;
        return super.parse(definition, form, validator);
    }
}

class RepeatParser extends jsonForm.ArrayControlParser
{
    getSubValidationProperty(definition, form, data, validator) {
        return 'validations';
    }

    getItems(definition, form, data, validator) {
        if (!Array.isArray(definition.items)) {
            return [];
        }

        return definition.items;
    }
}

class RepeatVariantsParser extends jsonForm.ArrayControlParser
{
    getSubValidationProperty(definition, form, data, validator)
    {
        return 'variantValidations';
    }

    getConfig(definition, form)
    {
        if (!definition.config.variantField) {
            definition.config.variantField = 'variant_name';
        }
        return definition.config;
    }

    getItems(definition, form)
    {
        if (!Array.isArray(definition.items)) {
            return [];
        }
        return definition.items.map(item => {
            item = {...item};
            if (!Array.isArray(item.items)) {
                item.items = [];
            }
            return item;
        });
    }
}

class GroupRepeatParser extends jsonForm.ControlParser
{
    getSubValidationProperty(definition, form, data, validator) {
        return 'validations';
    }

    getDefault(definition, form)
    {
        let def = null;
        if (typeof definition.default === 'object') {
            def = {...definition.default};
        }
        else {
            def = {};
        }
        if (Array.isArray(definition.config.regions)) {
            definition.config.regions.map(item => {
                if (!def.hasOwnProperty(item.name) || !Array.isArray(def[item.name])) {
                    def[item.name] = [];
                }
            });
        }
        return def;
    }

    getValidation(definition, form, data, validator)
    {
        const validation = super.getValidation(definition, form, data, validator);

        data.config.regions.map(region => {
            if (region.validation == null || typeof region.validation !== 'object') {
                region.validation = {};
            }

            region.config = {};

            jsonForm.ControlParser.setConfigUsingValidation(region.config, region.validation, ['required', 'minItems', 'maxItems']);
        });

        return validation;
    }

    getItems(definition, form, data, validator)
    {
        if (!definition.items || !Array.isArray(definition.items)) {
            return [];
        }
        return definition.items;
    }

    parse(definition, form, validator)
    {
        const data = super.parse(definition, form, validator);
        jsonForm.ControlParser.setConfigUsingValidation(data.config, definition.validation, ['required']);
        return data;
    }
}

class GroupRepeatVariantsParser extends jsonForm.ControlParser
{
    getSubValidationProperty(definition, form, data, validator)
    {
        return 'regionVariantValidations';
    }

    getDefault(definition, form)
    {
        let def = null;
        if (typeof definition.default === 'object') {
            def = {...definition.default};
        }
        else {
            def = {};
        }
        if (Array.isArray(definition.config.regions)) {
            definition.config.regions.map(item => {
                if (!def.hasOwnProperty(item.name) || !Array.isArray(def[item.name])) {
                    def[item.name] = [];
                }
            });
        }
        return def;
    }

    getConfig(definition, form)
    {
        if (!definition.config.variantField) {
            definition.config.variantField = 'variant_name';
        }
        return definition.config;
    }

    getValidation(definition, form, data, validator)
    {
        const validation = super.getValidation(definition, form, data, validator);

        data.config.regions.map(region => {
            if (region.validation == null || typeof region.validation !== 'object') {
                region.validation = {};
            }

            region.config = {};

            jsonForm.ControlParser.setConfigUsingValidation(region.config, region.validation, ['required', 'minItems', 'maxItems']);
        });

        return validation;
    }

    getItems(definition, form, data, validator)
    {
        if (!definition.items || !Array.isArray(definition.items)) {
            return [];
        }

        return definition.items.map(item => {
            item = {...item};
            if (!Array.isArray(item.items)) {
                item.items = [];
            }
            return item;
        });
    }

    parse(definition, form, validator)
    {
        const data = super.parse(definition, form, validator);
        jsonForm.ControlParser.setConfigUsingValidation(data.config, definition.validation, ['required']);
        return data;
    }
}

class VariantParser extends jsonForm.ControlParser
{
    getSubValidationProperty(definition, form, data, validator)
    {
        return 'currentVariantValidations';
    }

    getDefault(definition)
    {
        let f = definition.config && definition.config.variantField ? definition.config.variantField : 'variant_name';
        if (typeof definition.default === 'object') {
            return {[f]: null, ...definition.default};
        }
        return {
            [f]: null
        };
    }

    getConfig(definition, form)
    {
        if (!definition.config.variantField) {
            definition.config.variantField = 'variant_name';
        }
        return definition.config;
    }

    getValidation(definition, form, data, validator)
    {
        if (data.name == null) {
            validator[data.config.variantField] = super.getValidation(definition, form, data, validator);
            return {};
        }
        return {
            [data.config.variantField]: super.getValidation(definition, form, data, validator)
        };
    }

    getItems(definition, form)
    {
        if (!Array.isArray(definition.items)) {
            return [];
        }
        return definition.items.map(item => {
            item = {...item};
            if (!Array.isArray(item.items)) {
                item.items = [];
            }
            return item;
        });
    }

    parse(definition, form, validator)
    {
        const data = super.parse(definition, form, validator);
        jsonForm.ControlParser.setConfigUsingValidation(data.config, definition.validation, ['required']);
        return data;
    }
}

class CheckboxMultiParser extends jsonForm.SelectionControlParser
{
    parse(definition, form, validator)
    {
        const data = super.parse(definition, form, validator);
        jsonForm.SelectionControlParser.setConfigUsingValidation(data.config, definition.validation, ['minItems', 'maxItems']);
        return data;
    }
}

//

var script = {
    mixins: [jsonForm.JsonFormElementMixin],
    data() {
        return {inputType: 'text'};
    }
};

/* script */
            const __vue_script__ = script;
            
/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-text-field',{attrs:{"type":_vm.inputType,"error-messages":_vm.allErrors,"label":_vm.$intl.translate(_vm.display.title),"suffix":_vm.$intl.translate(_vm.display.suffix),"prefix":_vm.$intl.translate(_vm.display.prefix),"prepend-icon":_vm.$controlIcon(_vm.display.prependIcon),"append-icon":_vm.$controlIcon(_vm.display.appendIcon),"hint":_vm.$intl.translate(_vm.display.hint),"placeholder":_vm.$intl.translate(_vm.display.placeholder),"mask":_vm.display.mask,"clearable":_vm.display.clearable,"box":_vm.display.appearance === 'box',"solo":_vm.display.appearance === 'solo',"solo-inverted":_vm.display.appearance === 'solo-inverted',"outline":_vm.display.appearance === 'outline',"flat":!!_vm.display.flat,"counter":_vm.display.counter ? _vm.config.maxLength || false : false,"required":_vm.config.required,"maxlength":_vm.config.maxLength},on:{"blur":function($event){_vm.validate();}},model:{value:(_vm.model[_vm.name]),callback:function ($$v) {_vm.$set(_vm.model, _vm.name, $$v);},expression:"model[name]"}})};
var __vue_staticRenderFns__ = [];

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* component normalizer */
  function __vue_normalize__(
    template, style, script$$1,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "text.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var text = __vue_normalize__(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

//

var script$1 = {
    mixins: [jsonForm.JsonFormElementMixin]
};

/* script */
            const __vue_script__$1 = script$1;
            
/* template */
var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-textarea',{attrs:{"error-messages":_vm.allErrors,"label":_vm.$intl.translate(_vm.display.title),"hint":_vm.$intl.translate(_vm.display.hint),"placeholder":_vm.$intl.translate(_vm.display.placeholder),"rows":_vm.display.rows,"suffix":_vm.$intl.translate(_vm.display.suffix),"prefix":_vm.$intl.translate(_vm.display.prefix),"prepend-icon":_vm.$controlIcon(_vm.display.prependIcon),"append-icon":_vm.$controlIcon(_vm.display.appendIcon),"auto-grow":!!_vm.display.autoGrow,"clearable":_vm.display.clearable,"box":_vm.display.appearance === 'box',"solo":_vm.display.appearance === 'solo',"solo-inverted":_vm.display.appearance === 'solo-inverted',"outline":_vm.display.appearance === 'outline',"flat":!!_vm.display.flat,"counter":_vm.display.counter ? _vm.config.maxLength || false : false,"required":_vm.config.required,"maxlength":_vm.config.maxLength},on:{"blur":function($event){_vm.validate();}},model:{value:(_vm.model[_vm.name]),callback:function ($$v) {_vm.$set(_vm.model, _vm.name, $$v);},expression:"model[name]"}})};
var __vue_staticRenderFns__$1 = [];

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* component normalizer */
  function __vue_normalize__$1(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "textarea.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var TextareaControl = __vue_normalize__$1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    undefined,
    undefined
  );

var EmailControl = {
    extends: text,
    created()
    {
        this.inputType = 'email';
    }
};

var TelControl = {
    extends: text,
    created()
    {
        this.inputType = 'tel';
    }
};

//
var script$2 = {
    mixins: [jsonForm.JsonFormElementMixin],
    methods: {
        formatValue(val)
        {
            this.$set(this.model, this.name, Number(val));
        }
    }
};

/* script */
            const __vue_script__$2 = script$2;
            
/* template */
var __vue_render__$2 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-text-field',{attrs:{"type":"number","error-messages":_vm.allErrors,"label":_vm.$intl.translate(_vm.display.title),"suffix":_vm.$intl.translate(_vm.display.suffix),"prefix":_vm.$intl.translate(_vm.display.prefix),"prepend-icon":_vm.$controlIcon(_vm.display.prependIcon),"append-icon":_vm.$controlIcon(_vm.display.appendIcon),"hint":_vm.$intl.translate(_vm.display.hint),"placeholder":_vm.$intl.translate(_vm.display.placeholder),"mask":_vm.display.mask,"clearable":_vm.display.clearable,"box":_vm.display.appearance === 'box',"solo":_vm.display.appearance === 'solo',"solo-inverted":_vm.display.appearance === 'solo-inverted',"outline":_vm.display.appearance === 'outline',"flat":!!_vm.display.flat,"counter":_vm.display.counter ? _vm.config.maxLength || false : false,"required":_vm.config.required,"maxlength":_vm.config.maxLength,"step":_vm.config.multipleOf || 1,"min":_vm.config.minimum,"max":_vm.config.maximum},on:{"input":function($event){_vm.formatValue($event);},"blur":function($event){_vm.validate();}},model:{value:(_vm.model[_vm.name]),callback:function ($$v) {_vm.$set(_vm.model, _vm.name, $$v);},expression:"model[name]"}})};
var __vue_staticRenderFns__$2 = [];

  /* style */
  const __vue_inject_styles__$2 = undefined;
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* component normalizer */
  function __vue_normalize__$2(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "number.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var NumberControl = __vue_normalize__$2(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  );

//

var script$3 = {
    mixins: [jsonForm.JsonFormElementMixin],
    data()
    {
        return {visible: false};
    },
    methods: {
        toggle()
        {
            this.visible = !this.visible;
        }
    }
};

/* script */
            const __vue_script__$3 = script$3;
            
/* template */
var __vue_render__$3 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-text-field',{attrs:{"type":_vm.visible ? 'text' : 'password',"append-icon":_vm.visible ? 'visibility_off' : 'visibility',"error-messages":_vm.allErrors,"label":_vm.$intl.translate(_vm.display.title),"suffix":_vm.$intl.translate(_vm.display.suffix),"prefix":_vm.$intl.translate(_vm.display.prefix),"prepend-icon":_vm.$controlIcon(_vm.display.prependIcon),"hint":_vm.$intl.translate(_vm.display.hint),"placeholder":_vm.$intl.translate(_vm.display.placeholder),"clearable":_vm.display.clearable,"box":_vm.display.appearance === 'box',"solo":_vm.display.appearance === 'solo',"solo-inverted":_vm.display.appearance === 'solo-inverted',"outline":_vm.display.appearance === 'outline',"flat":!!_vm.display.flat,"counter":_vm.display.counter ? _vm.config.maxLength || false : false,"required":_vm.config.required,"maxlength":_vm.config.maxLength},on:{"click:append":_vm.toggle,"blur":function($event){_vm.validate();}},model:{value:(_vm.model[_vm.name]),callback:function ($$v) {_vm.$set(_vm.model, _vm.name, $$v);},expression:"model[name]"}})};
var __vue_staticRenderFns__$3 = [];

  /* style */
  const __vue_inject_styles__$3 = undefined;
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* component normalizer */
  function __vue_normalize__$3(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "password.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var PasswordControl = __vue_normalize__$3(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    undefined,
    undefined
  );

var UrlControl = {
    extends: text,
    created()
    {
        this.inputType = 'url';
    }
};

var ColorControl = {
    extends: text,
    created()
    {
        this.display.placeholder = '#000000';
        this.config.maxLength = 7;
        this.inputType = 'color';
    }
};

//

var script$4 = {
    mixins: [jsonForm.JsonFormElementMixin]
};

/* script */
            const __vue_script__$4 = script$4;
            
/* template */
var __vue_render__$4 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-text-field',{attrs:{"type":"text","error-messages":_vm.allErrors,"label":_vm.$intl.translate(_vm.display.title),"suffix":_vm.$intl.translate(_vm.display.suffix),"prefix":_vm.$intl.translate(_vm.display.prefix),"prepend-icon":_vm.$controlIcon(_vm.display.prependIcon),"append-icon":_vm.$controlIcon(_vm.model[_vm.name] || ''),"hint":_vm.$intl.translate(_vm.display.hint),"placeholder":_vm.$intl.translate(_vm.display.placeholder),"box":_vm.display.appearance === 'box',"solo":_vm.display.appearance === 'solo',"solo-inverted":_vm.display.appearance === 'solo-inverted',"outline":_vm.display.appearance === 'outline',"flat":!!_vm.display.flat,"counter":_vm.display.counter ? _vm.config.maxLength || false : false,"required":_vm.config.required,"maxlength":_vm.config.maxLength},on:{"blur":function($event){_vm.validate();}},model:{value:(_vm.model[_vm.name]),callback:function ($$v) {_vm.$set(_vm.model, _vm.name, $$v);},expression:"model[name]"}})};
var __vue_staticRenderFns__$4 = [];

  /* style */
  const __vue_inject_styles__$4 = undefined;
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* component normalizer */
  function __vue_normalize__$4(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "icon.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var IconControl = __vue_normalize__$4(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    undefined,
    undefined
  );

var HiddenControl = {
    mixins: [jsonForm.JsonFormElementMixin],
    render() {
        return null;
    }
};

var UUIDControl = {
    mixins: [jsonForm.JsonFormElementMixin],
    render()
    {
        return null;
    },
    created()
    {
        if (this.name !== null && typeof this.model[this.name] !== 'string') {
            const id = this.$uuid(typeof this.config.separator === 'string' ? this.config.separator : '-');
            this.$set(this.model, this.name, id);
        }
    }
};

//

var script$5 = {
    name: 'slider-control',
    mixins: [jsonForm.JsonFormElementMixin],
    methods: {
        formatValue(val)
        {
            this.$set(this.model, this.name, Number(val));
        }
    }
};

/* script */
            const __vue_script__$5 = script$5;
            
/* template */
var __vue_render__$5 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-slider',{attrs:{"error-messages":_vm.allErrors,"label":_vm.$intl.translate(_vm.display.title),"color":_vm.display.color || undefined,"prepend-icon":_vm.$controlIcon(_vm.display.prependIcon),"append-icon":_vm.$controlIcon(_vm.display.appendIcon),"hint":_vm.$intl.translate(_vm.display.hint),"persistent-hint":"","ticks":!!_vm.display.ticks,"thumb-label":"","required":_vm.config.required,"step":_vm.config.multipleOf || 1,"min":_vm.config.minimum,"max":_vm.config.maximum},on:{"input":function($event){_vm.formatValue($event);},"blur":function($event){_vm.validate();}},model:{value:(_vm.model[_vm.name]),callback:function ($$v) {_vm.$set(_vm.model, _vm.name, $$v);},expression:"model[name]"}})};
var __vue_staticRenderFns__$5 = [];

  /* style */
  const __vue_inject_styles__$5 = undefined;
  /* scoped */
  const __vue_scope_id__$5 = undefined;
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = false;
  /* component normalizer */
  function __vue_normalize__$5(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "slider.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var SliderControl = __vue_normalize__$5(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    undefined,
    undefined
  );

//

var script$6 = {
    mixins: [jsonForm.JsonFormElementMixin]
};

/* script */
            const __vue_script__$6 = script$6;
            
/* template */
var __vue_render__$6 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-checkbox',{staticClass:"mt-0",attrs:{"error-messages":_vm.allErrors,"color":_vm.display.color || undefined,"label":_vm.$intl.translate(_vm.display.title),"prepend-icon":_vm.$controlIcon(_vm.display.prependIcon),"append-icon":_vm.$controlIcon(_vm.display.appendIcon),"hint":_vm.$intl.translate(_vm.display.hint),"persistent-hint":"","false-value":false,"true-value":true,"required":_vm.config.required},on:{"blur":function($event){_vm.validate();}},model:{value:(_vm.model[_vm.name]),callback:function ($$v) {_vm.$set(_vm.model, _vm.name, $$v);},expression:"model[name]"}})};
var __vue_staticRenderFns__$6 = [];

  /* style */
  const __vue_inject_styles__$6 = undefined;
  /* scoped */
  const __vue_scope_id__$6 = undefined;
  /* module identifier */
  const __vue_module_identifier__$6 = undefined;
  /* functional template */
  const __vue_is_functional_template__$6 = false;
  /* component normalizer */
  function __vue_normalize__$6(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "checkbox.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var CheckboxControl = __vue_normalize__$6(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$6,
    __vue_script__$6,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    undefined,
    undefined
  );

//
//
//

var script$7 = {
    name: 'control-label',
    props: {
        text: {type: String, required: false, default: null},
        hasError: {type: Boolean, required: false, default: false},
        required: {type: Boolean, required: false, default: false}
    }
};

/* script */
            const __vue_script__$7 = script$7;
            
/* template */
var __vue_render__$7 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('label',{directives:[{name:"show",rawName:"v-show",value:(_vm.text != null && _vm.text !== ''),expression:"text != null && text !== ''"}],staticClass:"v-label",class:{'error--text': _vm.hasError}},[_vm._v(_vm._s(_vm.text)),_c('sup',{directives:[{name:"show",rawName:"v-show",value:(_vm.required),expression:"required"}],staticStyle:{"user-select":"none"}},[_vm._v("*")])])};
var __vue_staticRenderFns__$7 = [];

  /* style */
  const __vue_inject_styles__$7 = undefined;
  /* scoped */
  const __vue_scope_id__$7 = undefined;
  /* module identifier */
  const __vue_module_identifier__$7 = undefined;
  /* functional template */
  const __vue_is_functional_template__$7 = false;
  /* component normalizer */
  function __vue_normalize__$7(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "ControlLabel.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var ControlLabel = __vue_normalize__$7(
    { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
    __vue_inject_styles__$7,
    __vue_script__$7,
    __vue_scope_id__$7,
    __vue_is_functional_template__$7,
    __vue_module_identifier__$7,
    undefined,
    undefined
  );

//
//
//

var script$8 = {
    name: 'control-icon',
    computed: {
        icon()
        {
            const d = this.$slots.default;
            if (!d || !d[0]) {
                return undefined;
            }
            return this.$controlIcon(d[0].text);
        }
    }
};

/* script */
            const __vue_script__$8 = script$8;
            
/* template */
var __vue_render__$8 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-icon',_vm._b({domProps:{"textContent":_vm._s(_vm.icon)}},'v-icon',_vm.$attrs,false))};
var __vue_staticRenderFns__$8 = [];

  /* style */
  const __vue_inject_styles__$8 = undefined;
  /* scoped */
  const __vue_scope_id__$8 = undefined;
  /* module identifier */
  const __vue_module_identifier__$8 = undefined;
  /* functional template */
  const __vue_is_functional_template__$8 = false;
  /* component normalizer */
  function __vue_normalize__$8(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "ControlIcon.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var ControlIcon = __vue_normalize__$8(
    { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
    __vue_inject_styles__$8,
    __vue_script__$8,
    __vue_scope_id__$8,
    __vue_is_functional_template__$8,
    __vue_module_identifier__$8,
    undefined,
    undefined
  );

//
//
//
//
//
//
//

var script$9 = {
    name: 'block-error',
    props: {
        error: {type: String, default: null, required: false}
    }
};

/* script */
            const __vue_script__$9 = script$9;
            
/* template */
var __vue_render__$9 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.error !== null),expression:"error !== null"}],staticClass:"v-messages error--text"},[_c('div',{staticClass:"v-messages__message"},[_vm._v("\n        "+_vm._s(_vm.error)+"\n    ")])])};
var __vue_staticRenderFns__$9 = [];

  /* style */
  const __vue_inject_styles__$9 = undefined;
  /* scoped */
  const __vue_scope_id__$9 = undefined;
  /* module identifier */
  const __vue_module_identifier__$9 = undefined;
  /* functional template */
  const __vue_is_functional_template__$9 = false;
  /* component normalizer */
  function __vue_normalize__$9(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "Block.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var BlockError = __vue_normalize__$9(
    { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
    __vue_inject_styles__$9,
    __vue_script__$9,
    __vue_scope_id__$9,
    __vue_is_functional_template__$9,
    __vue_module_identifier__$9,
    undefined,
    undefined
  );

//
//
//
//
//
//
//

var script$a = {
    name: 'list-error',
    props: {
        error: {type: String, default: null, required: false}
    }
};

/* script */
            const __vue_script__$a = script$a;
            
/* template */
var __vue_render__$a = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.error !== null),expression:"error !== null"}],staticClass:"v-messages mt-1 error--text"},[_c('div',{staticClass:"v-messages__message"},[_vm._v("\n        "+_vm._s(_vm.error)+"\n    ")])])};
var __vue_staticRenderFns__$a = [];

  /* style */
  const __vue_inject_styles__$a = undefined;
  /* scoped */
  const __vue_scope_id__$a = undefined;
  /* module identifier */
  const __vue_module_identifier__$a = undefined;
  /* functional template */
  const __vue_is_functional_template__$a = false;
  /* component normalizer */
  function __vue_normalize__$a(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "List.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var ListError = __vue_normalize__$a(
    { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
    __vue_inject_styles__$a,
    __vue_script__$a,
    __vue_scope_id__$a,
    __vue_is_functional_template__$a,
    __vue_module_identifier__$a,
    undefined,
    undefined
  );

//

var script$b = {
    name: 'dialog-forms',
    components: {JsonFormGroup: jsonForm.JsonFormGroup},
    mixins: [jsonForm.ValidationMixin, jsonForm.JsonFormParserMixin],
    props: {
        pushDelay: {
            type: Number,
            default: 100
        },
        popDelay: {
            type: Number,
            default: 500
        },
        colors: {
            type: Array,
            default: () => (['blue', 'indigo', 'deep-purple', 'purple'])
        },
        path: {type: Array, default: () => []},
        options: {type: Object, default: () => ({})},
    },
    data()
    {
        return {
            me: this,
            dialogs: []
        };
    },
    validations()
    {
        const v = {};
        this.dialogs.map((dialog, index) => {
            const m = {model: dialog.validator};
            v[index + ''] = dialog.name ? {[dialog.name]: m} : m;
        });
        return {dialogs: v};
    },
    methods: {
        getColor(index)
        {
            if (this.colors.length === 0) {
                return undefined;
            }
            return this.colors[index % this.colors.length];
        },
        pushUnparsedForm(form, model)
        {
            form = {...form};
            form.validator = {};
            form.items = this.parser.parseControlList(form.items || [], form.validator);
            if (model !== undefined) {
                form.model = model;
            }
            this.pushForm(form);
        },
        pushForm(options)
        {
            const dialog = {
                active: false,
                form: options.items || [],
                validator: options.validator || {},

                name: options.name || undefined,
                model: options.model || {},

                actions: options.actions || {},

                title: options.title || null,
                button: options.button || 'Save',

                path: options.path || []
            };
            this.dialogs.push(dialog);
            // open a dialog
            setTimeout(() => {
                this.$v.dialogs[this.dialogs.length - 1].$reset();
                dialog.active = true;
            }, this.pushDelay);
        },
        popForm()
        {
            const len = this.dialogs.length;
            if (len === 0) {
                return;
            }
            const dialog = this.dialogs[len - 1];
            dialog.active = false;
            // TODO: use different timeout or fix vdialog to provide events
            setTimeout(() => {
                this.dialogs.pop();
            }, this.popDelay);
        },
        clearForms()
        {
            this.dialogs.splice(0, this.dialogs.length);
        },
        onCancel(dialog)
        {
            if (typeof dialog.actions.cancel === 'function') {
                if (dialog.actions.cancel(dialog.model) === false) {
                    // Prevent cancel
                    return false;
                }
            }
            this.popForm();
            return true;
        },
        onSubmit(dialog)
        {
            const index = this.dialogs.indexOf(dialog);
            if (index < 0) {
                return false;
            }
            const v = this.$v.dialogs[index].model;
            v.$touch();
            if (v.$invalid || v.$pending) {
                return false;
            }
            if (typeof dialog.actions.submit === 'function') {
                if (dialog.actions.submit(dialog.model, this.$clone(dialog.model)) === true) {
                    this.popForm();
                }
            }
            else {
                this.popForm();
            }
            return true;
        },
        onRouteLeave(func)
        {
            const length = this.dialogs.length;
            if (length === 0) {
                return true;
            }
            if (!func(this.$refs.formGroup[length - 1])) {
                return false;
            }
            this.onCancel(this.dialogs[length - 1]);
            return false;
        }
    }
};

/* script */
            const __vue_script__$b = script$b;
            
/* template */
var __vue_render__$b = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.dialogs.length > 0)?_c('div',_vm._l((_vm.dialogs),function(dialog,index){return _c('v-dialog',{key:_vm.$uniqueObjectId(dialog, index),attrs:{"lazy":"","fullscreen":"","transition":"dialog-bottom-transition","overlay":false,"scrollable":""},model:{value:(dialog.active),callback:function ($$v) {_vm.$set(dialog, "active", $$v);},expression:"dialog.active"}},[_c('v-card',[_c('v-toolbar',{staticStyle:{"flex":"0 0 auto"},attrs:{"color":_vm.getColor(index),"dark":""}},[_c('v-btn',{attrs:{"icon":"","dark":""},nativeOn:{"click":function($event){_vm.onCancel(dialog);}}},[_c('v-icon',[_vm._v("close")])],1),_vm._v(" "),_c('v-toolbar-title',[_vm._v(_vm._s(_vm.$intl.translate(dialog.title, dialog.model)))]),_vm._v(" "),_c('v-spacer'),_vm._v(" "),_c('v-toolbar-items',[_c('v-btn',{attrs:{"dark":"","flat":"","disabled":_vm.$v.dialogs[index].$pending || (_vm.$v.dialogs[index].$dirty && _vm.$v.dialogs[index].$invalid),"loading":_vm.$v.dialogs[index].$pending},nativeOn:{"click":function($event){_vm.onSubmit(dialog);}}},[_vm._v("\n                        "+_vm._s(_vm.$intl.translate(dialog.button, dialog.model))+"\n                    ")])],1)],1),_vm._v(" "),_c('v-card-text',[_c('v-form',{on:{"submit":function($event){$event.preventDefault();_vm.onSubmit(dialog);}}},[_c('json-form-group',{ref:"formGroup",refInFor:true,attrs:{"items":dialog.form,"model":dialog.model,"validator":_vm.$v.dialogs[index].model,"name":dialog.name,"path":dialog.path,"wrapper":_vm.me,"validations-container":dialog.validator,"parent-validations-container":dialog.validator}}),_vm._v(" "),_c('input',{directives:[{name:"show",rawName:"v-show",value:(false),expression:"false"}],attrs:{"type":"submit"}})],1)],1)],1)],1)})):_vm._e()};
var __vue_staticRenderFns__$b = [];

  /* style */
  const __vue_inject_styles__$b = undefined;
  /* scoped */
  const __vue_scope_id__$b = undefined;
  /* module identifier */
  const __vue_module_identifier__$b = undefined;
  /* functional template */
  const __vue_is_functional_template__$b = false;
  /* component normalizer */
  function __vue_normalize__$b(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "DialogForms.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var DialogForms = __vue_normalize__$b(
    { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
    __vue_inject_styles__$b,
    __vue_script__$b,
    __vue_scope_id__$b,
    __vue_is_functional_template__$b,
    __vue_module_identifier__$b,
    undefined,
    undefined
  );

//

var script$c = {
    name: 'block-form',
    components: {DialogForms},
    mixins: [jsonForm.JsonFormMixin],
    props: {
        title: {
            type: String,
            default: null
        },
        subtitle: {
            type: String,
            default: null
        },
        submitButton: {
            type: String,
            default: 'Submit'
        },
        fillHeight: {
            type: Boolean,
            default: false
        },
        flat: {
            type: Boolean,
            default: false
        }
    },
    data()
    {
        return {
            me: this,
            submitProps: {
                form: this,
                validate: () => {
                    this.$v.$touch();
                },
                reset: () => {
                    this.$v.$reset();
                },
                submit: () => {
                    return this.doSubmit();
                },
                invalid: () => {
                    return this.$v.$invalid;
                },
                pending: () => {
                    return this.$v.$pending;
                },
                dirty: () => {
                    return this.$v.$dirty;
                }
            }
        };
    },
    computed: {
        heightStyle()
        {
            return this.fillHeight ? {'min-height': '100%'} : undefined;
        }
    }
};

/* script */
            const __vue_script__$c = script$c;
            
/* template */
var __vue_render__$c = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-card',{style:(_vm.heightStyle),attrs:{"flat":_vm.flat}},[(_vm.title !== null || _vm.subtitle !== null)?_c('v-card-title',{attrs:{"primary-title":""}},[_c('div',[(_vm.title !== null)?_c('div',{staticClass:"headline"},[_vm._v(_vm._s(_vm.title))]):_vm._e(),_vm._v(" "),(_vm.subtitle !== null)?_c('div',[_vm._v(_vm._s(_vm.subtitle))]):_vm._e()])]):_vm._e(),_vm._v(" "),_c('v-card-text',[_c('v-form',{on:{"submit":function($event){$event.preventDefault();_vm.doSubmit();}}},[(_vm.model !== null && _vm.items !== null)?_c('json-form-group',{ref:"formGroup",attrs:{"items":_vm.parsed.items,"model":_vm.model,"validator":_vm.validatorProxy,"validations-container":_vm.parsed.validator,"parent-validations-container":_vm.parsed.validator,"wrapper":_vm.me,"path":_vm.path}}):_vm._e(),_vm._v(" "),_c('input',{directives:[{name:"show",rawName:"v-show",value:(false),expression:"false"}],attrs:{"type":"submit"}})],1)],1),_vm._v(" "),_c('v-card-actions',[_vm._t("default",[_c('v-spacer'),_vm._v(" "),_c('v-btn',{attrs:{"color":"primary","disabled":_vm.processing || _vm.$v.$pending || (_vm.$v.$dirty && _vm.$v.$invalid),"loading":_vm.processing},on:{"click":function($event){$event.stopPropagation();_vm.submitProps.submit();}}},[_vm._v("\n                "+_vm._s(_vm.submitButton)+"\n            ")])],{submitDisabled:_vm.processing || _vm.$v.$pending || (_vm.$v.$dirty && _vm.$v.$invalid)},_vm.submitProps)],2),_vm._v(" "),_c('dialog-forms',{ref:"formOverlay",attrs:{"options":_vm.options,"parser":_vm.parser}})],1)};
var __vue_staticRenderFns__$c = [];

  /* style */
  const __vue_inject_styles__$c = undefined;
  /* scoped */
  const __vue_scope_id__$c = undefined;
  /* module identifier */
  const __vue_module_identifier__$c = undefined;
  /* functional template */
  const __vue_is_functional_template__$c = false;
  /* component normalizer */
  function __vue_normalize__$c(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "BlockForm.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var BlockForm = __vue_normalize__$c(
    { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
    __vue_inject_styles__$c,
    __vue_script__$c,
    __vue_scope_id__$c,
    __vue_is_functional_template__$c,
    __vue_module_identifier__$c,
    undefined,
    undefined
  );

//

const invalidStep = [() => false];

var script$d = {
    name: 'stepper-form',
    components: {DialogForms},
    mixins: [jsonForm.JsonMultiStepFormMixin],
    props: {
        nextButtonText: {
            type: [String, Object],
            default: 'Next'
        },
        finishButtonText: {
            type: [String, Object],
            default: 'Finish'
        },
        fillHeight: {
            type: Boolean,
            default: true
        },
        vertical: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            me: this,
            invalidStep: invalidStep,
            showStepper: true
        }
    },

    computed: {
        heightStyle() {
            return this.fillHeight ? {'min-height': '100%'} : undefined;
        }
    },
    watch: {
        vertical() {
            const copy = {};
            const model = this.$clone(this.model);
            this.dataSteps.map((step, index) => {
                if (!step.parsed || step.model == null) {
                    return;
                }
                copy[index] = this.$clone(step.model);
            });

            const step = this.currentStep;

            this.showStepper = false;

            this.$nextTick(() => {
                for (const prop in model) {
                    if (model.hasOwnProperty(prop)) {
                        this.$set(this.model, prop, model[prop]);
                    }
                }

                Object.keys(copy).map(index => {
                    this.dataSteps[parseInt(index, 10)].model = copy[index];
                });

                this.$set(this, 'currentStep', step);

                this.showStepper = true;
            });
        }
    },
    methods: {
        getButtonText(step, index) {
            if (step.nextButton) {
                return step.nextButton;
            }
            return index + 1 === this.dataSteps.length ? this.finishButtonText : this.nextButtonText;
        },
        isButtonDisabled(step, index) {
            if (this.isButtonLoading(step, index) || this.stepHasError(step, index)) {
                return true;
            }

            return false;
        },
        isButtonLoading(step, index) {
            if (this.loadingStep === index + 1) {
                return true;
            }
            return step.parsed && this.$v.dataValue[index].$pending;
        }
    }
};

/* script */
            const __vue_script__$d = script$d;
/* template */
var __vue_render__$d = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-form',{style:(_vm.heightStyle),on:{"submit":function($event){$event.preventDefault();$event.stopPropagation();_vm.currentDataStep && _vm.nextStep(_vm.currentDataStep, _vm.currentStep - 1);}}},[(_vm.showStepper)?_c('v-stepper',{style:(_vm.heightStyle),attrs:{"vertical":_vm.vertical},model:{value:(_vm.currentStep),callback:function ($$v) {_vm.currentStep=$$v;},expression:"currentStep"}},[(_vm.vertical)?[_vm._l((_vm.dataSteps),function(step,index){return [_c('v-stepper-step',{key:_vm.$uniqueObjectId(step) + 'h',attrs:{"complete":step.complete,"editable":step.editable && step.touched || _vm.stepHasError(step, index, true),"rules":_vm.stepHasError(step, index) ? _vm.invalidStep : undefined,"step":index + 1}},[_vm._v("\n                    "+_vm._s(_vm.$uniqueObjectId(step))+"\n                    "+_vm._s(_vm.$intl.translate(step.title))+"\n                    "),(!!step.description)?_c('small',[_vm._v(_vm._s(_vm.$intl.translate(step.description)))]):_vm._e()]),_vm._v(" "),_c('v-stepper-content',{key:_vm.$uniqueObjectId(step) + 'c',attrs:{"step":index + 1}},[(step.parsed)?_c('json-form-group',{ref:"formGroup",refInFor:true,attrs:{"items":step.form,"model":_vm.dataValue[index],"name":step.name,"parent-validations-container":step.validator,"path":step.name ? [step.name] : [],"validations-container":step.validator,"validator":_vm.$v.dataValue[index],"wrapper":_vm.me}}):_vm._e(),_vm._v(" "),_c('v-btn',{staticClass:"mt-4",attrs:{"disabled":_vm.processing || _vm.isButtonDisabled(step, index),"loading":_vm.processing || _vm.isButtonLoading(step, index),"color":"primary"},on:{"click":function($event){$event.stopPropagation();_vm.nextStep(step, index);}}},[_vm._v("\n                        "+_vm._s(_vm.$intl.translate(_vm.getButtonText(step, index)))+"\n                    ")])],1)]})]:[_c('v-stepper-header',[_vm._l((_vm.dataSteps),function(step,index){return [_c('v-stepper-step',{key:_vm.$uniqueObjectId(step) + 'h',attrs:{"complete":step.complete,"editable":step.editable && step.touched || _vm.stepHasError(step, index, true),"rules":_vm.stepHasError(step, index) ? _vm.invalidStep : undefined,"step":index + 1}},[_vm._v("\n                        "+_vm._s(_vm.$uniqueObjectId(step))+"\n                        "+_vm._s(_vm.$intl.translate(step.title))+"\n                        "),(!!step.description)?_c('small',[_vm._v(_vm._s(_vm.$intl.translate(step.description)))]):_vm._e()]),_vm._v(" "),(index !== _vm.dataSteps.length - 1)?_c('v-divider',{key:_vm.$uniqueObjectId(step) + 'd'}):_vm._e()]})],2),_vm._v(" "),_c('v-stepper-items',[_vm._l((_vm.dataSteps),function(step,index){return [_c('v-stepper-content',{key:_vm.$uniqueObjectId(step) + 'c',attrs:{"step":index + 1}},[(step.parsed)?_c('json-form-group',{ref:"formGroup",refInFor:true,attrs:{"items":step.form,"model":_vm.dataValue[index],"name":step.name,"parent-validations-container":step.validator,"path":step.name ? [step.name] : [],"validations-container":step.validator,"validator":_vm.$v.dataValue[index],"wrapper":_vm.me}}):_vm._e(),_vm._v(" "),_c('v-layout',[_c('v-spacer'),_vm._v(" "),_c('v-btn',{attrs:{"disabled":_vm.processing || _vm.isButtonDisabled(step, index),"loading":_vm.processing || _vm.isButtonLoading(step, index),"color":"primary"},on:{"click":function($event){$event.stopPropagation();_vm.nextStep(step, index);}}},[_vm._v("\n                                "+_vm._s(_vm.$intl.translate(_vm.getButtonText(step, index)))+"\n                            ")])],1)],1)]})],2)]],2):_vm._e(),_vm._v(" "),_c('input',{directives:[{name:"show",rawName:"v-show",value:(false),expression:"false"}],attrs:{"type":"submit"}}),_vm._v(" "),_c('dialog-forms',{ref:"formOverlay",attrs:{"options":_vm.options,"parser":_vm.parser}})],1)};
var __vue_staticRenderFns__$d = [];

  /* style */
  const __vue_inject_styles__$d = undefined;
  /* scoped */
  const __vue_scope_id__$d = undefined;
  /* module identifier */
  const __vue_module_identifier__$d = undefined;
  /* functional template */
  const __vue_is_functional_template__$d = false;
  /* component normalizer */
  function __vue_normalize__$d(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "StepperForm.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var StepperForm = __vue_normalize__$d(
    { render: __vue_render__$d, staticRenderFns: __vue_staticRenderFns__$d },
    __vue_inject_styles__$d,
    __vue_script__$d,
    __vue_scope_id__$d,
    __vue_is_functional_template__$d,
    __vue_module_identifier__$d,
    undefined,
    undefined
  );

//

var script$e = {
    mixins: [jsonForm.JsonFormElementMixin],
    components: {ControlLabel, BlockError}
};

/* script */
            const __vue_script__$e = script$e;
            
/* template */
var __vue_render__$e = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('control-label',{attrs:{"text":_vm.$intl.translate(_vm.display.title),"has-error":_vm.allErrors.length > 0,"required":_vm.config.required}}),_vm._v(" "),_vm._l((_vm.items),function(item){return _c('v-checkbox',{key:_vm.$uniqueObjectId(item),staticClass:"mt-0",attrs:{"value":item.value,"multiple":"","color":item.color || undefined,"label":_vm.$intl.translate(item.title),"prepend-icon":_vm.$controlIcon(item.icon),"hint":_vm.$intl.translate(item.description),"persistent-hint":""},model:{value:(_vm.model[_vm.name]),callback:function ($$v) {_vm.$set(_vm.model, _vm.name, $$v);},expression:"model[name]"}})}),_vm._v(" "),_c('block-error',{attrs:{"error":_vm.allErrors.length > 0 ? _vm.allErrors[0] : undefined}})],2)};
var __vue_staticRenderFns__$e = [];

  /* style */
  const __vue_inject_styles__$e = undefined;
  /* scoped */
  const __vue_scope_id__$e = undefined;
  /* module identifier */
  const __vue_module_identifier__$e = undefined;
  /* functional template */
  const __vue_is_functional_template__$e = false;
  /* component normalizer */
  function __vue_normalize__$e(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "checkbox-multi.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var CheckboxMultiControl = __vue_normalize__$e(
    { render: __vue_render__$e, staticRenderFns: __vue_staticRenderFns__$e },
    __vue_inject_styles__$e,
    __vue_script__$e,
    __vue_scope_id__$e,
    __vue_is_functional_template__$e,
    __vue_module_identifier__$e,
    undefined,
    undefined
  );

//

var script$f = {
    mixins: [jsonForm.JsonFormElementMixin]
};

/* script */
            const __vue_script__$f = script$f;
            
/* template */
var __vue_render__$f = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-switch',{staticClass:"mt-0",attrs:{"error-messages":_vm.allErrors,"color":_vm.display.color || undefined,"label":_vm.$intl.translate(_vm.display.title),"prepend-icon":_vm.$controlIcon(_vm.display.prependIcon),"append-icon":_vm.$controlIcon(_vm.display.appendIcon),"hint":_vm.$intl.translate(_vm.display.hint),"persistent-hint":"","false-value":false,"true-value":true,"required":_vm.config.required},on:{"blur":function($event){_vm.validate();}},model:{value:(_vm.model[_vm.name]),callback:function ($$v) {_vm.$set(_vm.model, _vm.name, $$v);},expression:"model[name]"}})};
var __vue_staticRenderFns__$f = [];

  /* style */
  const __vue_inject_styles__$f = undefined;
  /* scoped */
  const __vue_scope_id__$f = undefined;
  /* module identifier */
  const __vue_module_identifier__$f = undefined;
  /* functional template */
  const __vue_is_functional_template__$f = false;
  /* component normalizer */
  function __vue_normalize__$f(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "switch.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var SwitchControl = __vue_normalize__$f(
    { render: __vue_render__$f, staticRenderFns: __vue_staticRenderFns__$f },
    __vue_inject_styles__$f,
    __vue_script__$f,
    __vue_scope_id__$f,
    __vue_is_functional_template__$f,
    __vue_module_identifier__$f,
    undefined,
    undefined
  );

//

var script$g = {
    mixins: [jsonForm.JsonFormElementMixin],
    mounted()
    {
        if (this.model.hasOwnProperty(this.name)) {
            const exists = this.items.some(item => this.$equals(this.modelProxy, item.value));
            if (!exists) {
                this.$delete(this.model, this.name);
            }
        }
    }
};

/* script */
            const __vue_script__$g = script$g;
            
/* template */
var __vue_render__$g = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-radio-group',{attrs:{"column":!_vm.display.inline,"row":!!_vm.display.inline,"label":_vm.$intl.translate(_vm.display.title),"error-messages":_vm.allErrors,"value-comparator":_vm.$equals,"mandatory":!!_vm.config.required},model:{value:(_vm.model[_vm.name]),callback:function ($$v) {_vm.$set(_vm.model, _vm.name, $$v);},expression:"model[name]"}},_vm._l((_vm.items),function(item,index){return _c('v-radio',{key:index,class:{'ml-1': index === 0 && !!_vm.display.inline},attrs:{"label":_vm.$intl.translate(item.title),"value":item.value,"color":item.color || _vm.display.color || undefined}})}))};
var __vue_staticRenderFns__$g = [];

  /* style */
  const __vue_inject_styles__$g = undefined;
  /* scoped */
  const __vue_scope_id__$g = undefined;
  /* module identifier */
  const __vue_module_identifier__$g = undefined;
  /* functional template */
  const __vue_is_functional_template__$g = false;
  /* component normalizer */
  function __vue_normalize__$g(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "radio.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var RadioControl = __vue_normalize__$g(
    { render: __vue_render__$g, staticRenderFns: __vue_staticRenderFns__$g },
    __vue_inject_styles__$g,
    __vue_script__$g,
    __vue_scope_id__$g,
    __vue_is_functional_template__$g,
    __vue_module_identifier__$g,
    undefined,
    undefined
  );

//

var script$h = {
    mixins: [jsonForm.JsonFormElementMixin],
    data()
    {
        return {
            translatedItems: []
        };
    },
    created()
    {
        this.translatedItems = this.translateItems(this.items);
    },
    methods: {
        removeChip(data)
        {
            if (this.config.multiple) {
                data.parent.selectItem(data.item);
            }
            else {
                this.$delete(this.model, this.name);
            }
        },
        isItemSelected(data)
        {
            if (this.config.multiple) {
                return data.parent.selectedItems.indexOf(data.item) > -1;
            }
            return data.parent.selectedItem === data.item;
        },
        translateItems(items)
        {
            return items.map(item => {
                if (!item.hasOwnProperty(this.valueProp)) {
                    if (item.hasOwnProperty('header')) {
                        return {header: this.$intl.translate(item.header)};
                    }
                    return item;
                }
                item = {...item};
                item[this.titleProp] = this.$intl.translate(item[this.titleProp]);
                item[this.descriptionProp] = this.$intl.translate(item[this.descriptionProp]);
                if (item[this.iconProp]) {
                    item[this.iconProp] = this.$controlIcon(item[this.iconProp]);
                }
                return item;
            });
        }
    },
    computed: {
        titleProp()
        {
            return this.config.titleProp || 'title';
        },
        valueProp()
        {
            return this.config.valueProp || 'value';
        },
        descriptionProp()
        {
            return this.config.descriptionProp || 'description';
        },
        iconProp()
        {
            return this.config.iconProp || 'icon';
        },
        itemsProp()
        {
            return this.config.itemsProp || 'items';
        }
    }
};

/* script */
            const __vue_script__$h = script$h;
            
/* template */
var __vue_render__$h = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-select',{attrs:{"error-messages":_vm.allErrors,"loading":_vm.translatedItems.length === 0,"label":_vm.$intl.translate(_vm.display.title),"hint":_vm.$intl.translate(_vm.display.hint),"persistent-hint":"","placeholder":_vm.$intl.translate(_vm.display.placeholder),"prepend-icon":_vm.$controlIcon(_vm.display.prependIcon),"append-icon":_vm.$controlIcon(_vm.display.appendIcon),"multiple":_vm.config.multiple || false,"required":_vm.config.required,"items":_vm.translatedItems,"item-value":_vm.valueProp,"item-text":_vm.titleProp,"item-avatar":_vm.iconProp,"value-comparator":_vm.$equals,"clearable":!!_vm.display.clearable,"box":_vm.display.appearance === 'box',"solo":_vm.display.appearance === 'solo',"solo-inverted":_vm.display.appearance === 'solo-inverted',"outline":_vm.display.appearance === 'outline',"flat":!!_vm.display.flat},scopedSlots:_vm._u([{key:_vm.display.chips ? 'selection' : undefined,fn:function(data){return !!_vm.display.chips?[(_vm.config.multiple)?_c('v-chip',{key:_vm.$uniqueObjectId(data.item),attrs:{"close":"","selected":data.selected,"disabled":data.disabled},on:{"input":function($event){_vm.removeChip(data);}}},[(_vm.display.icons && !!data.item[_vm.iconProp])?_c('v-avatar',{staticClass:"accent"},[_c('v-icon',[_vm._v(_vm._s(_vm.$controlIcon(data.item[_vm.iconProp])))])],1):_vm._e(),_vm._v("\n            "+_vm._s(data.item[_vm.titleProp])+"\n        ")],1):[(_vm.display.icons && !!data.item[_vm.iconProp])?_c('v-icon',{staticClass:"mr-1"},[_vm._v("\n                "+_vm._s(_vm.$controlIcon(data.item[_vm.iconProp]))+"\n            ")]):_vm._e(),_vm._v(" "),_c('span',{staticClass:"grey--text text--darken-4"},[_vm._v(_vm._s(data.item[_vm.titleProp]))])]]:undefined}},{key:_vm.display.icons ? 'item' : undefined,fn:function(data){return _vm.display.icons === true?[_c('v-list-tile-avatar',[(!!data.item[_vm.iconProp])?_c('v-icon',{attrs:{"color":_vm.isItemSelected(data) ? 'accent' : undefined}},[_vm._v("\n                "+_vm._s(_vm.$controlIcon(data.item[_vm.iconProp]))+"\n            ")]):_vm._e()],1),_vm._v(" "),_c('v-list-tile-content',{attrs:{"color":_vm.isItemSelected(data) ? 'accent' : undefined}},[_c('v-list-tile-title',[_vm._v("\n                "+_vm._s(data.item[_vm.titleProp])+"\n            ")]),_vm._v(" "),_c('v-list-tile-sub-title',[_vm._v("\n                "+_vm._s(data.item[_vm.descriptionProp])+"\n            ")])],1)]:undefined}}]),model:{value:(_vm.model[_vm.name]),callback:function ($$v) {_vm.$set(_vm.model, _vm.name, $$v);},expression:"model[name]"}})};
var __vue_staticRenderFns__$h = [];

  /* style */
  const __vue_inject_styles__$h = undefined;
  /* scoped */
  const __vue_scope_id__$h = undefined;
  /* module identifier */
  const __vue_module_identifier__$h = undefined;
  /* functional template */
  const __vue_is_functional_template__$h = false;
  /* component normalizer */
  function __vue_normalize__$h(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "select.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var SelectControl = __vue_normalize__$h(
    { render: __vue_render__$h, staticRenderFns: __vue_staticRenderFns__$h },
    __vue_inject_styles__$h,
    __vue_script__$h,
    __vue_scope_id__$h,
    __vue_is_functional_template__$h,
    __vue_module_identifier__$h,
    undefined,
    undefined
  );

//

var script$i = {
    mixins: [jsonForm.JsonFormElementMixin],
    data()
    {
        return {
            search: null
        }
    }
};

/* script */
            const __vue_script__$i = script$i;
            
/* template */
var __vue_render__$i = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-combobox',{attrs:{"error-messages":_vm.allErrors,"label":_vm.$intl.translate(_vm.display.title),"suffix":_vm.$intl.translate(_vm.display.suffix),"prefix":_vm.$intl.translate(_vm.display.prefix),"prepend-icon":_vm.$controlIcon(_vm.display.prependIcon),"append-icon":_vm.$controlIcon(_vm.display.appendIcon),"hint":_vm.$intl.translate(_vm.display.hint),"placeholder":_vm.$intl.translate(_vm.display.placeholder),"box":_vm.display.appearance === 'box',"solo":_vm.display.appearance === 'solo',"solo-inverted":_vm.display.appearance === 'solo-inverted',"outline":_vm.display.appearance === 'outline',"flat":!!_vm.display.flat,"chips":Boolean(_vm.display.chips && _vm.config.multiple),"deletable-chips":"","items":_vm.items,"search-input":_vm.search,"multiple":!!_vm.config.multiple},on:{"blur":function($event){_vm.validate();},"update:searchInput":function($event){_vm.search=$event;}},model:{value:(_vm.model[_vm.name]),callback:function ($$v) {_vm.$set(_vm.model, _vm.name, $$v);},expression:"model[name]"}})};
var __vue_staticRenderFns__$i = [];

  /* style */
  const __vue_inject_styles__$i = undefined;
  /* scoped */
  const __vue_scope_id__$i = undefined;
  /* module identifier */
  const __vue_module_identifier__$i = undefined;
  /* functional template */
  const __vue_is_functional_template__$i = false;
  /* component normalizer */
  function __vue_normalize__$i(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "combobox.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var ComboboxControl = __vue_normalize__$i(
    { render: __vue_render__$i, staticRenderFns: __vue_staticRenderFns__$i },
    __vue_inject_styles__$i,
    __vue_script__$i,
    __vue_scope_id__$i,
    __vue_is_functional_template__$i,
    __vue_module_identifier__$i,
    undefined,
    undefined
  );

//

var script$j = {
    mixins: [jsonForm.JsonFormElementMixin],
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

/* script */
            const __vue_script__$j = script$j;
            
/* template */
var __vue_render__$j = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-alert',{attrs:{"value":true,"outline":_vm.outline,"color":_vm.color,"icon":_vm.icon}},[(_vm.display.title != null)?_c('div',{staticClass:"title",domProps:{"textContent":_vm._s(_vm.$intl.translate(_vm.display.title))}}):_vm._e(),_vm._v(" "),(_vm.display.text != null)?_c('div',{domProps:{"innerHTML":_vm._s(_vm.$intl.translate(_vm.display.text))}}):_vm._e()])};
var __vue_staticRenderFns__$j = [];

  /* style */
  const __vue_inject_styles__$j = undefined;
  /* scoped */
  const __vue_scope_id__$j = undefined;
  /* module identifier */
  const __vue_module_identifier__$j = undefined;
  /* functional template */
  const __vue_is_functional_template__$j = false;
  /* component normalizer */
  function __vue_normalize__$j(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "description.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var DescriptionControl = __vue_normalize__$j(
    { render: __vue_render__$j, staticRenderFns: __vue_staticRenderFns__$j },
    __vue_inject_styles__$j,
    __vue_script__$j,
    __vue_scope_id__$j,
    __vue_is_functional_template__$j,
    __vue_module_identifier__$j,
    undefined,
    undefined
  );

//

const DEVICES = ['xs', 'sm', 'md', 'lg', 'xl'];

var script$k = {
    mixins: [jsonForm.JsonFormElementMixin],
    components: {JsonFormElement: jsonForm.JsonFormElement},
    computed: {
        colProps()
        {
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
        setDeviceProps(container, props, prefix, default_prefix = null)
        {
            if (typeof props === 'object') {
                DEVICES.map(d => {
                    if (props.hasOwnProperty(d)) {
                        container[prefix + d + props[d]] = true;
                    }
                });
            }
            else {
                if (props && default_prefix) {
                    container[default_prefix + props] = true;
                }
            }
        },
        onRouteLeave(func)
        {
            return func(this.$refs.formElement);
        }
    }
};

/* script */
            const __vue_script__$k = script$k;
            
/* template */
var __vue_render__$k = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-flex',_vm._b({staticClass:"pb-0"},'v-flex',_vm.colProps,false),_vm._l((_vm.items),function(item,index){return _c('json-form-element',{key:_vm.$uniqueObjectId(item, index),ref:"formElement",refInFor:true,attrs:{"control":item,"model":_vm.modelProxy,"validator":_vm.validatorProxy,"wrapper":_vm.wrapper,"path":_vm.path,"parent-validations-container":_vm.parentValidationsContainer,"validations-container":_vm.validationsContainer}})}))};
var __vue_staticRenderFns__$k = [];

  /* style */
  const __vue_inject_styles__$k = undefined;
  /* scoped */
  const __vue_scope_id__$k = undefined;
  /* module identifier */
  const __vue_module_identifier__$k = undefined;
  /* functional template */
  const __vue_is_functional_template__$k = false;
  /* component normalizer */
  function __vue_normalize__$k(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "col.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var ColControl = __vue_normalize__$k(
    { render: __vue_render__$k, staticRenderFns: __vue_staticRenderFns__$k },
    __vue_inject_styles__$k,
    __vue_script__$k,
    __vue_scope_id__$k,
    __vue_is_functional_template__$k,
    __vue_module_identifier__$k,
    undefined,
    undefined
  );

//

var script$l = {
    mixins: [jsonForm.JsonFormElementMixin],
    components: {JsonFormElement: jsonForm.JsonFormElement},
    methods: {
        onRouteLeave(func)
        {
            return func(this.$refs.formElement);
        }
    }
};

/* script */
            const __vue_script__$l = script$l;
            
/* template */
var __vue_render__$l = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-container',{staticClass:"px-0 py-0",attrs:{"fluid":"","grid-list-xl":""}},[_c('v-layout',{attrs:{"row":"","wrap":""}},_vm._l((_vm.items),function(item,index){return _c('json-form-element',{key:_vm.$uniqueObjectId(item, index),ref:"formElement",refInFor:true,attrs:{"control":item,"model":_vm.modelProxy,"validator":_vm.validatorProxy,"wrapper":_vm.wrapper,"path":_vm.path,"parent-validations-container":_vm.parentValidationsContainer,"validations-container":_vm.validationsContainer}})}))],1)};
var __vue_staticRenderFns__$l = [];

  /* style */
  const __vue_inject_styles__$l = undefined;
  /* scoped */
  const __vue_scope_id__$l = undefined;
  /* module identifier */
  const __vue_module_identifier__$l = undefined;
  /* functional template */
  const __vue_is_functional_template__$l = false;
  /* component normalizer */
  function __vue_normalize__$l(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "row.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var RowControl = __vue_normalize__$l(
    { render: __vue_render__$l, staticRenderFns: __vue_staticRenderFns__$l },
    __vue_inject_styles__$l,
    __vue_script__$l,
    __vue_scope_id__$l,
    __vue_is_functional_template__$l,
    __vue_module_identifier__$l,
    undefined,
    undefined
  );

//

var script$m = {
    mixins: [jsonForm.JsonFormElementMixin],
    components: {JsonFormGroup: jsonForm.JsonFormGroup, ControlLabel},
    methods: {
        onRouteLeave(func)
        {
            return func(this.$refs.formGroup);
        }
    }
};

/* script */
            const __vue_script__$m = script$m;
            
/* template */
var __vue_render__$m = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.display.panel === true)?_c('v-expansion-panel',{attrs:{"expand":""}},[_c('v-expansion-panel-content',[_c('div',{attrs:{"slot":"header"},slot:"header"},[_vm._v(_vm._s(_vm.$intl.translate(_vm.display.title)))]),_vm._v(" "),_c('json-form-group',{ref:"formGroup",staticClass:"px-2",attrs:{"model":_vm.modelProxy,"validator":_vm.validatorProxy,"items":_vm.items,"wrapper":_vm.wrapper,"path":_vm.path,"parent-validations-container":_vm.parentValidationsContainer,"validations-container":_vm.validationsContainer}})],1)],1):_c('div',[(!!_vm.display.title)?_c('v-subheader',{staticClass:"mb-0"},[_c('control-label',{attrs:{"text":_vm.$intl.translate(_vm.display.title)}})],1):_vm._e(),_vm._v(" "),_c('json-form-group',{ref:"formGroup",attrs:{"model":_vm.modelProxy,"validator":_vm.validatorProxy,"items":_vm.items,"wrapper":_vm.wrapper,"path":_vm.path,"parent-validations-container":_vm.parentValidationsContainer,"validations-container":_vm.validationsContainer}})],1)};
var __vue_staticRenderFns__$m = [];

  /* style */
  const __vue_inject_styles__$m = undefined;
  /* scoped */
  const __vue_scope_id__$m = undefined;
  /* module identifier */
  const __vue_module_identifier__$m = undefined;
  /* functional template */
  const __vue_is_functional_template__$m = false;
  /* component normalizer */
  function __vue_normalize__$m(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "group.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var GroupControl = __vue_normalize__$m(
    { render: __vue_render__$m, staticRenderFns: __vue_staticRenderFns__$m },
    __vue_inject_styles__$m,
    __vue_script__$m,
    __vue_scope_id__$m,
    __vue_is_functional_template__$m,
    __vue_module_identifier__$m,
    undefined,
    undefined
  );

//

var script$n = {
    mixins: [jsonForm.JsonFormElementMixin],
    components: {JsonFormGroup: jsonForm.JsonFormGroup},
    data() {
        return {
            switchValue: this.model[this.name] != null,
            lastModel: {}
        };
    },
    created()
    {
        this.switchValue = this.modelProxy != null;
    },
    watch: {
        switchValue(val) {
            if (val) {
                this.$set(this.model, this.name, this.lastModel || {});
            }
            else {
                this.lastModel = this.$clone(this.modelProxy);
                this.$set(this.model, this.name, null);
                this.validate();
            }
        },
        modelProxy(val) {
            if (val == null) {
                this.switchValue = false;
            }
            else if (!this.switchValue) {
                this.switchValue = true;
            }
        }
    },
    computed: {
        validations()
        {
            return this.parsed.validators;
        },
        parsed()
        {
            const validators = {};
            if (!this.switchValue) {
                return {
                    validators,
                    items: []
                };
            }
            return {
                validators,
                items: this.wrapper.parser.parseControlList(this.items, validators)
            };
        },
        switchErrors()
        {
            return this.switchValue ? [] : this.allErrors;
        }
    },
    methods: {
        onRouteLeave(func)
        {
            if (this.modelProxy == null) {
                return true;
            }
            return func(this.$refs.formGroup);
        }
    }
};

/* script */
            const __vue_script__$n = script$n;
            
/* template */
var __vue_render__$n = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('v-switch',{attrs:{"color":_vm.display.color || undefined,"label":_vm.$intl.translate(_vm.display.title),"prepend-icon":_vm.$controlIcon(_vm.display.prependIcon),"append-icon":_vm.$controlIcon(_vm.display.appendIcon),"hint":_vm.$intl.translate(_vm.display.hint),"persistent-hint":"","error-messages":_vm.switchErrors,"required":_vm.config.required},model:{value:(_vm.switchValue),callback:function ($$v) {_vm.switchValue=$$v;},expression:"switchValue"}}),_vm._v(" "),_c('json-form-group',{ref:"formGroup",attrs:{"model":_vm.modelProxy,"validator":_vm.validatorProxy,"items":_vm.parsed.items,"wrapper":_vm.wrapper,"path":_vm.path,"parent-validations-container":_vm.parentValidationsContainer,"validations-container":_vm.validationsContainer}})],1)};
var __vue_staticRenderFns__$n = [];

  /* style */
  const __vue_inject_styles__$n = undefined;
  /* scoped */
  const __vue_scope_id__$n = undefined;
  /* module identifier */
  const __vue_module_identifier__$n = undefined;
  /* functional template */
  const __vue_is_functional_template__$n = false;
  /* component normalizer */
  function __vue_normalize__$n(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "switch-group.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var SwitchGroupControl = __vue_normalize__$n(
    { render: __vue_render__$n, staticRenderFns: __vue_staticRenderFns__$n },
    __vue_inject_styles__$n,
    __vue_script__$n,
    __vue_scope_id__$n,
    __vue_is_functional_template__$n,
    __vue_module_identifier__$n,
    undefined,
    undefined
  );

//

var script$o = {
    mixins: [jsonForm.JsonFormElementMixin],
    components: {JsonFormGroup: jsonForm.JsonFormGroup},
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

/* script */
            const __vue_script__$o = script$o;
            
/* template */
var __vue_render__$o = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-tabs',[_c('v-tabs-slider',{attrs:{"color":_vm.display.color || undefined}}),_vm._v(" "),_vm._l((_vm.items),function(item,key){return _c('v-tab',{key:_vm.$uniqueObjectId(item, key),attrs:{"href":'#' + _vm.tabPrefix + '-tab-' + (item.name || key)}},[(_vm.tabHasError(item))?_c('v-icon',{attrs:{"color":"red"}},[_vm._v("error")]):(item.icon)?_c('v-icon',[_vm._v(_vm._s(item.icon))]):_vm._e(),_vm._v("\n        "+_vm._s(_vm.$intl.translate(item.title))+"\n    ")],1)}),_vm._v(" "),_c('v-tabs-items',{staticClass:"mt-1"},_vm._l((_vm.items),function(item,key){return _c('v-tab-item',{key:_vm.$uniqueObjectId(item, key),staticClass:"px-1",attrs:{"id":_vm.tabPrefix + '-tab-' + (item.name || key)}},[_c('json-form-group',{ref:"formGroup",refInFor:true,attrs:{"model":_vm.modelProxy,"validator":_vm.validatorProxy,"items":item.items,"name":item.name,"wrapper":_vm.wrapper,"path":_vm.path,"parent-validations-container":_vm.parentValidationsContainer,"validations-container":_vm.validationsContainer}})],1)}))],2)};
var __vue_staticRenderFns__$o = [];

  /* style */
  const __vue_inject_styles__$o = undefined;
  /* scoped */
  const __vue_scope_id__$o = undefined;
  /* module identifier */
  const __vue_module_identifier__$o = undefined;
  /* functional template */
  const __vue_is_functional_template__$o = false;
  /* component normalizer */
  function __vue_normalize__$o(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "tabs.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var TabsControl = __vue_normalize__$o(
    { render: __vue_render__$o, staticRenderFns: __vue_staticRenderFns__$o },
    __vue_inject_styles__$o,
    __vue_script__$o,
    __vue_scope_id__$o,
    __vue_is_functional_template__$o,
    __vue_module_identifier__$o,
    undefined,
    undefined
  );

//

var script$p = {
    mixins: [jsonForm.JsonFormElementMixin],
    components: {JsonFormGroup: jsonForm.JsonFormGroup},
    data()
    {
        return {
            asyncFields: null,
            asyncValidator: null
        }
    },
    beforeDestroy()
    {
        this.asyncFields = null;
        this.asyncValidator = null;
    },
    created()
    {
        this.loadFields();
    },
    computed: {
        validations()
        {
            return this.asyncValidator;
        }
    },
    methods: {
        loadFields()
        {
            if (typeof this.config.loader !== 'function') {
                return;
            }
            const fields = this.config.loader(this);
            if (!(fields instanceof Promise)) {
                return;
            }
            this.asyncValidator = fields
                .then(fields => {
                    const validator = {};
                    this.asyncFields = this.wrapper.parser.parseControlList(this.$clone(fields), validator);
                    return validator;
                });
        },
        onRouteLeave(func)
        {
            if (this.asyncFields === null) {
                return true;
            }
            return func(this.$refs.formGroup);
        }
    }
};

/* script */
            const __vue_script__$p = script$p;
            
/* template */
var __vue_render__$p = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.asyncFields !== null)?_c('json-form-group',{ref:"formGroup",attrs:{"model":_vm.modelProxy,"items":_vm.asyncFields,"validator":_vm.validatorProxy,"path":_vm.path,"wrapper":_vm.wrapper,"parent-validations-container":_vm.parentValidationsContainer,"validations-container":_vm.validationsContainer}}):_c('v-progress-linear',{attrs:{"indeterminate":""}})};
var __vue_staticRenderFns__$p = [];

  /* style */
  const __vue_inject_styles__$p = undefined;
  /* scoped */
  const __vue_scope_id__$p = undefined;
  /* module identifier */
  const __vue_module_identifier__$p = undefined;
  /* functional template */
  const __vue_is_functional_template__$p = false;
  /* component normalizer */
  function __vue_normalize__$p(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "async-group.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var AsyncGroupControl = __vue_normalize__$p(
    { render: __vue_render__$p, staticRenderFns: __vue_staticRenderFns__$p },
    __vue_inject_styles__$p,
    __vue_script__$p,
    __vue_scope_id__$p,
    __vue_is_functional_template__$p,
    __vue_module_identifier__$p,
    undefined,
    undefined
  );

var ComponentControl = {
    mixins: [jsonForm.JsonFormElementMixin],
    computed: {
        form()
        {
            return {
                name: this.name,
                validator: this.validator,
                model: this.model,
                config: this.config,
                display: this.display,
                wrapper: this.wrapper,
                path: this.path,
                validationsContainer: this.validationsContainer,
                parentValidationsContainer: this.parentValidationsContainer,
            }
        }
    },
    render(h)
    {
        const component = this.config.component;
        const data = this.config.data || {};
        const alias = this.config.alias || 'form';
        if (!data.props) {
            data.props = {};
        }
        if (this.config.props) {
            Object.assign(data.props, this.config.props);
        }
        data.props[alias] = this.form;
        return h(component, data);
    }
};

//

var script$q = {
    mixins: [jsonForm.JsonFormElementMixin],
    data()
    {
        return {
            showDialog: false,
            dateFormatted: null,
            dateModel: null
        }
    },
    watch: {
        modelProxy(value)
        {
            if (!value) {
                this.dateFormatted = null;
                return;
            }
            this.dateModel = value;
            this.dateFormatted = this.formatDate(this.dateModel);
        }
    },
    computed: {
        landscape()
        {
            if (!this.display.landscape) {
                return false;
            }
            return this.$vuetify.breakpoint.mdAndUp || false;
        },
        locale()
        {
            if (this.config.locale) {
                return this.config.locale;
            }
            const options = this.wrapper.options || {};
            return options.language || 'en';
        },
        firstDayOfWeek()
        {
            if (this.config.firstDayOfWeek) {
                return this.config.firstDayOfWeek;
            }
            const options = this.wrapper.options || {};
            return options.firstDayOfWeek || 0;
        }
    },
    mounted()
    {
        this.dateModel = this.modelProxy;
        this.updateValue(false);
    },
    methods: {
        handleClear()
        {
            this.dateModel = null;
            this.$delete(this.model, this.name);
        },
        onSave()
        {
            this.showDialog = false;
            this.updateValue();
        },
        onCancel()
        {
            this.showDialog = false;
            if (this.modelProxy) {
                this.dateModel = this.modelProxy;
            }
        },
        updateValue(validate = true)
        {
            this.$set(this.model, this.name, this.dateModel);
            this.dateFormatted = this.formatDate(this.dateModel);
            validate && this.validate();
        },
        formatDate(date)
        {
            if (!date) {
                return null;
            }
            return (new Date(date)).toLocaleDateString(this.locale);
        },
        onRouteLeave(func)
        {
            if (!this.showDialog) {
                return true;
            }
            this.onCancel();
            return false;
        }
    }
};

/* script */
            const __vue_script__$q = script$q;
            
/* template */
var __vue_render__$q = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-dialog',{attrs:{"persistent":"","lazy":"","full-width":"","width":_vm.landscape ? 460 : 290},model:{value:(_vm.showDialog),callback:function ($$v) {_vm.showDialog=$$v;},expression:"showDialog"}},[_c('v-text-field',{attrs:{"slot":"activator","readonly":"","error-messages":_vm.allErrors,"label":_vm.$intl.translate(_vm.display.title),"suffix":_vm.$intl.translate(_vm.display.suffix),"prefix":_vm.$intl.translate(_vm.display.prefix),"hint":_vm.$intl.translate(_vm.display.hint),"persistent-hint":"","prepend-icon":_vm.$controlIcon(_vm.display.prependIcon),"append-icon":_vm.$controlIcon(_vm.display.appendIcon) || 'event',"clearable":"","box":_vm.display.appearance === 'box',"solo":_vm.display.appearance === 'solo',"solo-inverted":_vm.display.appearance === 'solo-inverted',"outline":_vm.display.appearance === 'outline',"flat":!!_vm.display.flat,"required":_vm.config.required},on:{"input":function($event){($event === null) && _vm.handleClear();}},slot:"activator",model:{value:(_vm.dateFormatted),callback:function ($$v) {_vm.dateFormatted=$$v;},expression:"dateFormatted"}}),_vm._v(" "),_c('v-date-picker',{attrs:{"min":_vm.config.minDate,"max":_vm.config.maxDate,"locale":_vm.locale,"first-day-of-week":_vm.firstDayOfWeek,"color":_vm.display.color || undefined,"landscape":_vm.landscape,"scrollable":""},model:{value:(_vm.dateModel),callback:function ($$v) {_vm.dateModel=$$v;},expression:"dateModel"}},[_c('v-spacer'),_vm._v(" "),_c('v-btn',{attrs:{"flat":"","icon":"","color":"red"},on:{"click":function($event){$event.stopPropagation();_vm.onCancel();}}},[_c('v-icon',[_vm._v("clear")])],1),_vm._v(" "),_c('v-btn',{attrs:{"flat":"","icon":"","color":"green"},on:{"click":function($event){$event.stopPropagation();_vm.onSave();}}},[_c('v-icon',[_vm._v("check")])],1)],1)],1)};
var __vue_staticRenderFns__$q = [];

  /* style */
  const __vue_inject_styles__$q = undefined;
  /* scoped */
  const __vue_scope_id__$q = undefined;
  /* module identifier */
  const __vue_module_identifier__$q = undefined;
  /* functional template */
  const __vue_is_functional_template__$q = false;
  /* component normalizer */
  function __vue_normalize__$q(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "date.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var DateControl = __vue_normalize__$q(
    { render: __vue_render__$q, staticRenderFns: __vue_staticRenderFns__$q },
    __vue_inject_styles__$q,
    __vue_script__$q,
    __vue_scope_id__$q,
    __vue_is_functional_template__$q,
    __vue_module_identifier__$q,
    undefined,
    undefined
  );

//

var script$r = {
    mixins: [jsonForm.JsonFormElementMixin],
    data()
    {
        return {
            showDialog: false,
            timeModel: '00:00'
        }
    },
    mounted()
    {
        this.timeModel = this.modelProxy;
        this.updateValue(false);
    },
    computed: {
        landscape()
        {
            if (!this.display.landscape) {
                return false;
            }
            return this.$vuetify.breakpoint.mdAndUp || false;
        }
    },
    methods: {
        handleClear()
        {
            this.timeModel = '00:00';
            this.$delete(this.model, this.name);
        },
        onSave()
        {
            this.showDialog = false;
            this.updateValue();
        },
        onCancel()
        {
            this.showDialog = false;
            this.timeModel = this.modelProxy || '00:00';
        },
        updateValue(validate = true)
        {
            this.$set(this.model, this.name, this.timeModel);
            validate && this.validate();
        },
        onRouteLeave(func)
        {
            if (!this.showDialog) {
                return true;
            }
            this.onCancel();
            return false;
        }
    }
};

/* script */
            const __vue_script__$r = script$r;
            
/* template */
var __vue_render__$r = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-dialog',{attrs:{"persistent":"","lazy":"","full-width":"","width":_vm.landscape ? 460 : 290},model:{value:(_vm.showDialog),callback:function ($$v) {_vm.showDialog=$$v;},expression:"showDialog"}},[_c('v-text-field',{attrs:{"slot":"activator","readonly":"","error-messages":_vm.allErrors,"label":_vm.$intl.translate(_vm.display.title),"suffix":_vm.$intl.translate(_vm.display.suffix),"prefix":_vm.$intl.translate(_vm.display.prefix),"prepend-icon":_vm.$controlIcon(_vm.display.prependIcon),"append-icon":_vm.$controlIcon(_vm.display.appendIcon) || 'access_time',"clearable":"","box":_vm.display.appearance === 'box',"solo":_vm.display.appearance === 'solo',"solo-inverted":_vm.display.appearance === 'solo-inverted',"outline":_vm.display.appearance === 'outline',"flat":!!_vm.display.flat,"required":_vm.config.required},on:{"input":function($event){($event === null) && _vm.handleClear();}},slot:"activator",model:{value:(_vm.model[_vm.name]),callback:function ($$v) {_vm.$set(_vm.model, _vm.name, $$v);},expression:"model[name]"}}),_vm._v(" "),_c('v-time-picker',{attrs:{"min":_vm.config.minTime,"max":_vm.config.maxTime,"format":_vm.display.ampm ? 'ampm' : '24hr',"color":_vm.display.color || undefined,"landscape":_vm.landscape,"scrollable":""},model:{value:(_vm.timeModel),callback:function ($$v) {_vm.timeModel=$$v;},expression:"timeModel"}},[_c('v-spacer'),_vm._v(" "),_c('v-btn',{attrs:{"flat":"","icon":"","color":"red"},on:{"click":function($event){$event.stopPropagation();_vm.onCancel();}}},[_c('v-icon',[_vm._v("clear")])],1),_vm._v(" "),_c('v-btn',{attrs:{"flat":"","icon":"","color":"green"},on:{"click":function($event){$event.stopPropagation();_vm.onSave();}}},[_c('v-icon',[_vm._v("check")])],1)],1)],1)};
var __vue_staticRenderFns__$r = [];

  /* style */
  const __vue_inject_styles__$r = undefined;
  /* scoped */
  const __vue_scope_id__$r = undefined;
  /* module identifier */
  const __vue_module_identifier__$r = undefined;
  /* functional template */
  const __vue_is_functional_template__$r = false;
  /* component normalizer */
  function __vue_normalize__$r(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "time.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var TimeControl = __vue_normalize__$r(
    { render: __vue_render__$r, staticRenderFns: __vue_staticRenderFns__$r },
    __vue_inject_styles__$r,
    __vue_script__$r,
    __vue_scope_id__$r,
    __vue_is_functional_template__$r,
    __vue_module_identifier__$r,
    undefined,
    undefined
  );

//

var script$s = {
    mixins: [jsonForm.JsonFormElementMixin],
    data()
    {
        return {
            timePick: false,
            showDialog: false,

            dateFormatted: null,
            dateModel: null,
            timeModel: '00:00'
        }
    },
    watch: {
        modelProxy(value)
        {
            if (!value) {
                this.dateFormatted = null;
                return;
            }
            [this.dateModel, this.timeModel] = value.split('T');
            this.dateFormatted = this.formatDate(this.dateModel) + ' ' + this.formatTime(this.timeModel);
        }
    },
    computed: {
        landscape()
        {
            if (!this.display.landscape) {
                return false;
            }
            return this.$vuetify.breakpoint.mdAndUp || false;
        },
        locale()
        {
            if (this.config.locale) {
                return this.config.locale;
            }
            const options = this.wrapper.options || {};
            return options.language || 'en';
        },
        firstDayOfWeek()
        {
            if (this.config.firstDayOfWeek) {
                return this.config.firstDayOfWeek;
            }
            const options = this.wrapper.options || {};
            return options.firstDayOfWeek || 0;
        },
        allowedDates()
        {
            const obj = {min: undefined, max: undefined};
            if (this.config.minDateTime) {
                obj.min = this.config.minDateTime.split('T')[0];
            }
            if (this.config.maxDateTime) {
                obj.max = this.config.maxDateTime.split('T')[0];
            }
            return obj;
        },
        allowedTimes()
        {
            const obj = {min: undefined, max: undefined};
            if (!this.dateModel) {
                return obj;
            }
            const selected = this.parseTime(this.timeModel);
            selected.d = this.dateModel;

            if (this.config.minDateTime) {
                const min = this.parseDateTime(this.config.minDateTime);
                if (selected.d === min.d) {
                    obj.min = min.t;
                }
            }

            if (this.config.maxDateTime) {
                const max = this.parseDateTime(this.config.maxDateTime);
                if (selected.d === max.d) {
                    obj.max = max.t;
                }
            }

            return obj;
        }
    },
    mounted()
    {
        let d = this.modelProxy;
        if (!d) {
            return;
        }
        d = new Date(d);
        if (isNaN(d.getTime())) {
            this.$delete(this.model, this.name);
            return;
        }
        [this.dateModel, d] = d.toISOString().split('T');
        this.timeModel = d.split(':').slice(0, 2).join(':');
        this.updateValue(false);
    },
    methods: {
        onSave()
        {
            this.showDialog = false;
            this.updateValue();
        },
        onCancel()
        {
            this.showDialog = false;
            if (this.modelProxy) {
                [this.dateModel, this.timeModel] = this.modelProxy.split('T');
            }
        },
        handleClear()
        {
            this.timePick = false;
            this.dateModel = null;
            this.timeModel = '00:00';
            this.$delete(this.model, this.name);
        },
        parseDateTime(date)
        {
            date = date.split('T');
            const t = date[1] || '00:00';
            let obj = this.parseTime(t);
            obj.t = t;
            obj.d = date[0];
            return obj;
        },
        parseTime(time)
        {
            time = time.split(':');
            time = {
                h: Number(time[0] || 0),
                m: Number(time[1] || 0),
            };
            return time;
        },
        updateValue(validate = true)
        {
            if (this.dateModel === null) {
                this.dateModel = (new Date()).toISOString().split('T')[0];
            }
            this.$set(this.model, this.name, this.dateModel + 'T' + this.timeModel);
            this.dateFormatted = this.formatDate(this.dateModel) + ' ' + this.formatTime(this.timeModel);
            validate && this.validate();
        },
        formatDate(date)
        {
            if (!date) {
                return null;
            }
            return (new Date(date)).toLocaleDateString(this.locale);
        },
        formatTime(time)
        {
            if (!time) {
                return '';
            }
            return time.toString();
        },
        showDate()
        {
            this.timePick = false;
            this.showDialog = true;
        },
        showTime()
        {
            this.timePick = true;
            this.showDialog = true;
        },
        onRouteLeave(func)
        {
            if (!this.showDialog) {
                return true;
            }
            this.onCancel();
            return false;
        }
    }
};

/* script */
            const __vue_script__$s = script$s;
            
/* template */
var __vue_render__$s = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-dialog',{attrs:{"persistent":"","lazy":"","full-width":"","width":_vm.landscape ? 460 : 290},model:{value:(_vm.showDialog),callback:function ($$v) {_vm.showDialog=$$v;},expression:"showDialog"}},[_c('v-layout',{attrs:{"slot":"activator","row":""},slot:"activator"},[_c('v-text-field',{attrs:{"readonly":"","error-messages":_vm.allErrors,"label":_vm.$intl.translate(_vm.display.title),"suffix":_vm.$intl.translate(_vm.display.suffix),"prefix":_vm.$intl.translate(_vm.display.prefix),"prepend-inner-icon":"event","append-icon":"access_time","clearable":"","box":_vm.display.appearance === 'box',"solo":_vm.display.appearance === 'solo',"solo-inverted":_vm.display.appearance === 'solo-inverted',"outline":_vm.display.appearance === 'outline',"flat":!!_vm.display.flat,"required":_vm.config.required},on:{"input":function($event){($event === null) && _vm.handleClear();},"click:prepend-inner":function($event){_vm.showDate();},"click:append":function($event){_vm.showTime();}},model:{value:(_vm.dateFormatted),callback:function ($$v) {_vm.dateFormatted=$$v;},expression:"dateFormatted"}})],1),_vm._v(" "),_c('v-time-picker',{directives:[{name:"show",rawName:"v-show",value:(_vm.timePick),expression:"timePick"}],attrs:{"min":_vm.allowedTimes.min,"max":_vm.allowedTimes.max,"format":_vm.display.ampm ? 'ampm' : '24hr',"color":_vm.display.color || undefined,"landscape":_vm.landscape,"scrollable":""},model:{value:(_vm.timeModel),callback:function ($$v) {_vm.timeModel=$$v;},expression:"timeModel"}},[_c('v-btn',{attrs:{"icon":"","flat":""},on:{"click":function($event){_vm.timePick = false;}}},[_c('v-icon',[_vm._v("event")])],1),_vm._v(" "),_c('v-spacer'),_vm._v(" "),_c('v-btn',{attrs:{"flat":"","icon":"","color":"red"},on:{"click":function($event){$event.stopPropagation();_vm.onCancel();}}},[_c('v-icon',[_vm._v("clear")])],1),_vm._v(" "),_c('v-btn',{attrs:{"flat":"","icon":"","color":"green"},on:{"click":function($event){$event.stopPropagation();_vm.onSave();}}},[_c('v-icon',[_vm._v("check")])],1)],1),_vm._v(" "),_c('v-date-picker',{directives:[{name:"show",rawName:"v-show",value:(!_vm.timePick),expression:"!timePick"}],attrs:{"min":_vm.allowedDates.min,"max":_vm.allowedDates.max,"locale":_vm.locale,"first-day-of-week":_vm.firstDayOfWeek,"color":_vm.display.color || undefined,"landscape":_vm.landscape,"scrollable":""},model:{value:(_vm.dateModel),callback:function ($$v) {_vm.dateModel=$$v;},expression:"dateModel"}},[_c('v-btn',{attrs:{"icon":"","flat":""},on:{"click":function($event){_vm.timePick = true;}}},[_c('v-icon',[_vm._v("access_time")])],1),_vm._v(" "),_c('v-spacer'),_vm._v(" "),_c('v-btn',{attrs:{"flat":"","icon":"","color":"red"},on:{"click":function($event){$event.stopPropagation();_vm.onCancel();}}},[_c('v-icon',[_vm._v("clear")])],1),_vm._v(" "),_c('v-btn',{attrs:{"flat":"","icon":"","color":"green"},on:{"click":function($event){$event.stopPropagation();_vm.onSave();}}},[_c('v-icon',[_vm._v("check")])],1)],1)],1)};
var __vue_staticRenderFns__$s = [];

  /* style */
  const __vue_inject_styles__$s = undefined;
  /* scoped */
  const __vue_scope_id__$s = undefined;
  /* module identifier */
  const __vue_module_identifier__$s = undefined;
  /* functional template */
  const __vue_is_functional_template__$s = false;
  /* component normalizer */
  function __vue_normalize__$s(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "date-time.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var DateTimeControl = __vue_normalize__$s(
    { render: __vue_render__$s, staticRenderFns: __vue_staticRenderFns__$s },
    __vue_inject_styles__$s,
    __vue_script__$s,
    __vue_scope_id__$s,
    __vue_is_functional_template__$s,
    __vue_module_identifier__$s,
    undefined,
    undefined
  );

//

var script$t = {
    mixins: [jsonForm.JsonFormElementMixin],
    components: {ControlLabel, ListError},
    data()
    {
        return {
            dragOptions: {
                handle: '.drag-handle'
            }
        };
    },
    computed: {
        canAddItem()
        {
            const max = this.config.maxItems;
            if (!max || max < 0) {
                return true;
            }

            const value = this.modelProxy;
            return !value || value.length < max;
        },
        validations()
        {
            const model = this.modelProxy;
            if (!model || model.length === 0) {
                return null;
            }
            const v = {};
            const length = model.length;
            const parser = this.wrapper.parser;
            const items = this.items;
            for (let i = 0; i < length; i++) {
                v[i] = {};
                parser.parseControlList(items, v[i]);
            }
            return v;
        }
    },
    methods: {
        itemTitle(val)
        {
            let title = this.display.itemTitle;
            if (typeof title === "function") {
                title = title(val);
            }
            if (!title) {
                return null;
            }
            if (typeof title !== 'object') {
                title = {key: null, text: title};
            }
            return this.$intl.translate(title, val);
        },
        itemHasError(index, dirty = false)
        {
            const v = this.validatorProxy;
            if (!v || !v[index]) {
                return false;
            }

            if (!dirty && !v[index].$dirty) {
                return false;
            }

            return v[index].$invalid;
        },
        addItem()
        {
            this.wrapper.pushUnparsedForm({
                title: this.display.addTitle || {key: 'common.form.addItemTitle', text: 'Create new item'},
                button: this.display.addSubmitButtom || {key: 'common.form.addSubmitButton', text: 'Add'},
                model: {},
                items: this.items,
                actions: {
                    submit: (original, copy) => {
                        if (!Array.isArray(this.modelProxy)) {
                            this.$set(this.model, this.name, []);
                        }
                        this.modelProxy.push(copy);
                        this.validate();
                        return true;
                    }
                }
            });
        },
        removeItem(val)
        {
            let index = this.modelProxy.indexOf(val);
            if (index >= 0) {
                this.modelProxy.splice(index, 1);
                this.validate();
            }
        },
        editItem(val)
        {
            let index = this.modelProxy.indexOf(val);
            this.wrapper.pushUnparsedForm({
                title: this.display.editTitle || {key: 'common.form.editItemTitle', text: 'Edit item'},
                button: this.display.editSubmitButtom || {key: 'common.form.editSubmitButton', text: 'Save changes'},
                model: this.$clone(val),
                items: this.items,
                actions: {
                    submit: (original, copy) => {
                        this.$set(this.modelProxy, index, copy);
                        this.validate();
                        return true;
                    }
                }
            });
        }
    }
};

/* script */
            const __vue_script__$t = script$t;
            
/* template */
var __vue_render__$t = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-list',{attrs:{"subheader":"","dense":""}},[_c('v-subheader',[_c('control-label',{attrs:{"text":_vm.$intl.translate(_vm.display.title),"has-error":_vm.allErrors.length > 0,"required":_vm.config.required}}),_vm._v(" "),_c('v-spacer'),_vm._v(" "),_c('v-btn',{attrs:{"disabled":!_vm.canAddItem,"small":"","flat":"","ripple":""},on:{"click":function($event){$event.stopPropagation();_vm.addItem();}}},[_c('v-icon',[_vm._v("add")]),_vm._v("\n            "+_vm._s(_vm.$intl.translate(_vm.display.addButton || {key: 'common.form.add', text: 'Add'}))+"\n        ")],1)],1),_vm._v(" "),_c('draggable',{attrs:{"list":_vm.modelProxy,"options":_vm.dragOptions}},[_vm._l((_vm.modelProxy),function(val,index){return _c('v-list-tile',{key:_vm.$uniqueObjectId(val, index),on:{"click":function($event){_vm.editItem(val);}}},[_c('v-list-tile-avatar',{staticClass:"drag-handle"},[(_vm.itemHasError(index))?_c('v-icon',{attrs:{"color":"red"}},[_vm._v("error")]):_c('v-icon',[_vm._v("swap_vert")]),_vm._v("\n                "+_vm._s(index + 1)+".\n            ")],1),_vm._v(" "),_c('v-list-tile-content',[_c('v-list-tile-title',[_vm._v(_vm._s(_vm.itemTitle(val)))])],1),_vm._v(" "),_c('v-list-tile-action',[_c('v-btn',{attrs:{"icon":"","ripple":""},on:{"click":function($event){$event.stopPropagation();_vm.removeItem(val);}}},[_c('v-icon',{attrs:{"color":"red"}},[_vm._v("delete")])],1)],1)],1)}),_vm._v(" "),_c('v-list-tile',{directives:[{name:"show",rawName:"v-show",value:(!_vm.modelProxy || _vm.modelProxy.length === 0),expression:"!modelProxy || modelProxy.length === 0"}],staticClass:"sortable-empty-list-item"},[_c('v-list-tile-content',[_vm._v("\n                "+_vm._s(_vm.$intl.translate(_vm.display.placeholder || {key: 'common.form.empty_list', text: 'No items'}))+"\n            ")])],1)],2),_vm._v(" "),(_vm.allErrors.length > 0)?[_c('v-divider'),_vm._v(" "),_c('list-error',{attrs:{"error":_vm.allErrors[0]}})]:_vm._e()],2)};
var __vue_staticRenderFns__$t = [];

  /* style */
  const __vue_inject_styles__$t = undefined;
  /* scoped */
  const __vue_scope_id__$t = undefined;
  /* module identifier */
  const __vue_module_identifier__$t = undefined;
  /* functional template */
  const __vue_is_functional_template__$t = false;
  /* component normalizer */
  function __vue_normalize__$t(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "repeat.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var RepeatControl = __vue_normalize__$t(
    { render: __vue_render__$t, staticRenderFns: __vue_staticRenderFns__$t },
    __vue_inject_styles__$t,
    __vue_script__$t,
    __vue_scope_id__$t,
    __vue_is_functional_template__$t,
    __vue_module_identifier__$t,
    undefined,
    undefined
  );

//

var script$u = {
    mixins: [jsonForm.JsonFormElementMixin],
    components: {ControlLabel, ListError},
    data()
    {
        return {
            dragOptions: {
                handle: '.drag-handle'
            }
        };
    },
    computed: {
        variantValidations()
        {
            const model = this.modelProxy;
            if (!Array.isArray(model) || model.length === 0) {
                return null;
            }

            const v = {};
            const p = this.config.variantField;
            const parser = this.wrapper.parser;
            model.map((item, index) => {
                v[index] = {};
                parser.parseControlList(this.getVariantByName(item[p]).items, v[index]);
            });

            return v;
        },
        canAddItem()
        {
            const max = this.config.maxItems;
            if (!max || max < 0) {
                return true;
            }

            const value = this.modelProxy;
            return !value || value.length < max;
        }
    },
    methods: {
        variantTitle(variant)
        {
            if (variant.display && variant.display.title) {
                return variant.display.title;
            }
            return variant.title;
        },
        itemTitle(val)
        {
            const v = this.getVariantByName(val[this.config.variantField]);
            let title = v.itemTitle || this.display.itemTitle;
            if (typeof title === "function") {
                title = title(val);
            }
            if (!title) {
                return null;
            }
            if (typeof title !== 'object') {
                title = {key: null, text: title};
            }
            return this.$intl.translate(title, val);
        },
        itemHasError(index, dirty = false)
        {
            const v = this.validatorProxy;
            if (!v || !v[index] || (!dirty && !v[index].$dirty)) {
                return false;
            }

            return v[index].$invalid;
        },
        getVariantByName(name)
        {
            for (let i = 0, m = this.items.length; i < m; i++) {
                if (this.items[i].name === name) {
                    return this.items[i];
                }
            }
            return null;
        },
        addItem(variant)
        {
            this.wrapper.pushUnparsedForm({
                title: this.display.addTitle || {key: 'common.form.addItemTitle', text: 'Create new item'},
                button: this.display.addSubmitButtom || {key: 'common.form.addSubmitButton', text: 'Add'},
                model: {
                    [this.config.variantField]: variant.name
                },
                items: variant.items,
                actions: {
                    submit: (original, copy) => {
                        this.modelProxy.push(copy);
                        this.validate();
                        return true;
                    }
                }
            });
        },
        removeItem(val)
        {
            let index = this.modelProxy.indexOf(val);
            if (index >= 0) {
                this.modelProxy.splice(index, 1);
                this.validate();
            }
        },
        editItem(val)
        {
            let index = this.modelProxy.indexOf(val);
            const variant = this.getVariantByName(val[this.config.variantField]);
            this.wrapper.pushUnparsedForm({
                title: this.display.editTitle || {key: 'common.form.editItemTitle', text: 'Edit item'},
                button: this.display.editSubmitButtom || {key: 'common.form.editSubmitButton', text: 'Save changes'},
                model: this.$clone(val),
                items: variant.items,
                actions: {
                    submit: (original, copy) => {
                        this.$set(this.modelProxy, index, copy);
                        this.validate();
                        return true;
                    }
                }
            });
        }
    }
};

/* script */
            const __vue_script__$u = script$u;
            
/* template */
var __vue_render__$u = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-list',{attrs:{"subheader":"","dense":""}},[_c('v-subheader',[_c('control-label',{attrs:{"text":_vm.$intl.translate(_vm.display.title),"has-error":_vm.allErrors.length > 0,"required":_vm.config.required}}),_vm._v(" "),_c('v-spacer'),_vm._v(" "),_c('v-menu',{attrs:{"offset-y":"","disabled":!_vm.canAddItem,"max-height":"426"}},[_c('v-btn',{attrs:{"slot":"activator","disabled":!_vm.canAddItem,"small":"","flat":"","ripple":""},slot:"activator"},[_c('v-icon',[_vm._v("add")]),_vm._v("\n                "+_vm._s(_vm.$intl.translate(_vm.display.addButton || {key: 'common.form.add', text: 'Add'}))+"\n            ")],1),_vm._v(" "),_c('v-list',_vm._l((_vm.items),function(variant){return _c('v-list-tile',{key:variant.name,on:{"click":function($event){_vm.addItem(variant);}}},[_c('v-list-tile-title',[_vm._v(_vm._s(_vm.$intl.translate(_vm.variantTitle(variant))))])],1)}))],1)],1),_vm._v(" "),_c('draggable',{attrs:{"list":_vm.modelProxy,"options":_vm.dragOptions}},[_vm._l((_vm.modelProxy),function(val,index){return _c('v-list-tile',{key:_vm.$uniqueObjectId(val, index),on:{"click":function($event){_vm.editItem(val);}}},[_c('v-list-tile-avatar',{staticClass:"drag-handle"},[(_vm.itemHasError(index))?_c('v-icon',{attrs:{"color":"red"}},[_vm._v("error")]):_c('v-icon',[_vm._v("swap_vert")]),_vm._v("\n                "+_vm._s(index + 1)+".\n            ")],1),_vm._v(" "),_c('v-list-tile-content',[_c('v-list-tile-title',[_vm._v(_vm._s(_vm.itemTitle(val)))]),_vm._v(" "),_c('v-list-tile-sub-title',[_vm._v(_vm._s(_vm.$intl.translate(_vm.variantTitle(_vm.getVariantByName(val[_vm.config.variantField]))))+"\n                ")])],1),_vm._v(" "),_c('v-list-tile-action',[_c('v-btn',{attrs:{"icon":"","ripple":""},on:{"click":function($event){$event.stopPropagation();_vm.removeItem(val);}}},[_c('v-icon',{attrs:{"color":"red"}},[_vm._v("delete")])],1)],1)],1)}),_vm._v(" "),_c('v-list-tile',{directives:[{name:"show",rawName:"v-show",value:(_vm.modelProxy.length === 0),expression:"modelProxy.length === 0"}],staticClass:"sortable-empty-list-item"},[_c('v-list-tile-content',[_vm._v("\n                "+_vm._s(_vm.$intl.translate(_vm.display.placeholder || {key: 'common.form.empty_list', text: 'No items'}))+"\n            ")])],1)],2),_vm._v(" "),(_vm.allErrors.length > 0)?[_c('v-divider'),_vm._v(" "),_c('list-error',{attrs:{"error":_vm.allErrors[0]}})]:_vm._e()],2)};
var __vue_staticRenderFns__$u = [];

  /* style */
  const __vue_inject_styles__$u = undefined;
  /* scoped */
  const __vue_scope_id__$u = undefined;
  /* module identifier */
  const __vue_module_identifier__$u = undefined;
  /* functional template */
  const __vue_is_functional_template__$u = false;
  /* component normalizer */
  function __vue_normalize__$u(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "repeat-variants.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var RepeatVariantsControl = __vue_normalize__$u(
    { render: __vue_render__$u, staticRenderFns: __vue_staticRenderFns__$u },
    __vue_inject_styles__$u,
    __vue_script__$u,
    __vue_scope_id__$u,
    __vue_is_functional_template__$u,
    __vue_module_identifier__$u,
    undefined,
    undefined
  );

//

var script$v = {
    mixins: [jsonForm.JsonFormElementMixin],
    components: {ControlLabel, ListError},
    data()
    {
        return {
            dragOptions: {
                draggable: '.drag-item',
                filter: '.drag-ignore',
                handle: '.drag-handle',
                group: 'region-' + this.$uniqueObjectId(this)
            }
        };
    },
    computed: {
        validations()
        {
            const model = this.modelProxy;
            if (!model || model.length === 0) {
                return null;
            }

            const v = {};
            const p = this.config.variantField;

            const items = this.items;
            const parser = this.wrapper.parser;
            this.config.regions.map(region => {
                v[region.name] = region.validation ? parser.validator.getMultiple(region.validation) : {};

                if (!Array.isArray(model[region.name])) {
                    return;
                }

                model[region.name].map((item, index) => {
                    v[region.name][index] = {};
                    parser.parseControlList(items, v[region.name][index]);
                });
            });

            return v;
        },
        translatedTitle()
        {
            if (!this.display.title) {
                return null;
            }
            return this.$intl.translate(this.display.title) || null;
        }
    },
    methods: {
        itemTitle(val)
        {
            let title = this.display.itemTitle;
            if (typeof title === "function") {
                title = title(val);
            }
            if (!title) {
                return null;
            }
            if (typeof title !== 'object') {
                title = {key: null, text: title};
            }
            return this.$intl.translate(title, val);
        },
        itemHasError(region, index, dirty = false)
        {
            const v = this.validatorProxy;
            if (!v || !v[region.name]) {
                return false;
            }

            if (!v[region.name].$invalid || !v[region.name][index]) {
                return false;
            }

            if (!dirty && !v[region.name][index].$dirty) {
                return false;
            }

            return v[region.name][index].$invalid;
        },
        canAddItem(region)
        {
            const max = region.config.maxItems;
            if (!max || max < 0) {
                return true;
            }

            const model = this.modelProxy;
            if (!model[region.name]) {
                return true;
            }

            return model[region.name].length < max;
        },
        addItem(region)
        {
            this.wrapper.pushUnparsedForm({
                title: this.display.addTitle || {key: 'common.form.addItemTitle', text: 'Create new item'},
                button: this.display.addSubmitButtom || {key: 'common.form.addSubmitButton', text: 'Add'},
                model: {},
                items: this.items,
                actions: {
                    submit: (original, copy) => {
                        this.modelProxy[region.name].push(copy);
                        this.validate();
                        return true;
                    }
                }
            });
        },
        removeItem(region, val)
        {
            let index = this.modelProxy[region.name].indexOf(val);
            if (index >= 0) {
                this.modelProxy[region.name].splice(index, 1);
                this.validate();
            }
        },
        editItem(region, val)
        {
            let index = this.modelProxy[region.name].indexOf(val);
            this.wrapper.pushUnparsedForm({
                title: this.display.editTitle || {key: 'common.form.editItemTitle', text: 'Edit item'},
                button: this.display.editSubmitButtom || {key: 'common.form.editSubmitButton', text: 'Save changes'},
                model: this.$clone(val),
                items: this.items,
                actions: {
                    submit: (original, copy) => {
                        this.$set(this.modelProxy[region.name], index, copy);
                        this.validate();
                        return true;
                    }
                }
            });
        }
    },
    created()
    {
        this.config.regions.map(item => {
            if (!this.modelProxy.hasOwnProperty(item.name)) {
                this.$set(this.modelProxy, item.name, []);
            }
        });
    },
    beforeDestroy()
    {
        this.config.regions.map(item => {
            this.$delete(this.modelProxy, item.name);
        });
    }
};

/* script */
            const __vue_script__$v = script$v;
            
/* template */
var __vue_render__$v = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(Boolean(_vm.translatedTitle))?_c('v-subheader',[_c('control-label',{attrs:{"text":_vm.$intl.translate(_vm.display.title),"has-error":_vm.allErrors.length > 0,"required":_vm.config.required}})],1):_vm._e(),_vm._v(" "),_vm._l((_vm.config.regions),function(region){return _c('v-list',{key:region.name,attrs:{"subheader":"","dense":""}},[_c('v-subheader',[_c('control-label',{attrs:{"text":_vm.$intl.translate(region.title),"has-error":_vm.hasErrors(region.name),"required":region.config.required}}),_vm._v(" "),_c('v-spacer'),_vm._v(" "),_c('v-btn',{attrs:{"disabled":!_vm.canAddItem(region),"small":"","flat":"","ripple":""},on:{"click":function($event){$event.stopPropagation();_vm.addItem(region);}}},[_c('v-icon',[_vm._v("add")]),_vm._v("\n                "+_vm._s(_vm.$intl.translate(_vm.display.addButton || {key: 'common.form.add', text: 'Add'}))+"\n            ")],1)],1),_vm._v(" "),_c('draggable',{staticStyle:{"min-height":"2px"},attrs:{"list":_vm.modelProxy[region.name],"options":_vm.dragOptions}},_vm._l((_vm.modelProxy[region.name]),function(val,index){return _c('v-list-tile',{key:_vm.$uniqueObjectId(val, index),staticClass:"drag-item",on:{"click":function($event){_vm.editItem(region, val);}}},[_c('v-list-tile-avatar',{staticClass:"drag-handle"},[(_vm.itemHasError(region, index))?_c('v-icon',{attrs:{"color":"red"}},[_vm._v("error")]):_c('v-icon',[_vm._v("swap_vert")]),_vm._v("\n                    "+_vm._s(index + 1)+".\n                ")],1),_vm._v(" "),_c('v-list-tile-content',[_c('v-list-tile-title',[_vm._v(_vm._s(_vm.itemTitle(val)))])],1),_vm._v(" "),_c('v-list-tile-action',[_c('v-btn',{attrs:{"icon":"","ripple":""},on:{"click":function($event){$event.stopPropagation();_vm.removeItem(region, val);}}},[_c('v-icon',{attrs:{"color":"red"}},[_vm._v("delete")])],1)],1)],1)})),_vm._v(" "),_c('v-list-tile',{directives:[{name:"show",rawName:"v-show",value:(_vm.modelProxy[region.name].length === 0),expression:"modelProxy[region.name].length === 0"}],staticClass:"sortable-empty-list-item"},[_c('v-list-tile-content',[_vm._v("\n                "+_vm._s(_vm.$intl.translate(_vm.display.placeholder || {key: 'common.form.empty_list', text: 'No items'}))+"\n            ")])],1),_vm._v(" "),(_vm.hasErrors(region.name))?[_c('v-divider'),_vm._v(" "),_c('list-error',{attrs:{"error":_vm.getAllErrors(region.name)[0]}})]:_vm._e()],2)})],2)};
var __vue_staticRenderFns__$v = [];

  /* style */
  const __vue_inject_styles__$v = undefined;
  /* scoped */
  const __vue_scope_id__$v = undefined;
  /* module identifier */
  const __vue_module_identifier__$v = undefined;
  /* functional template */
  const __vue_is_functional_template__$v = false;
  /* component normalizer */
  function __vue_normalize__$v(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "group-repeat.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var GroupRepeatControl = __vue_normalize__$v(
    { render: __vue_render__$v, staticRenderFns: __vue_staticRenderFns__$v },
    __vue_inject_styles__$v,
    __vue_script__$v,
    __vue_scope_id__$v,
    __vue_is_functional_template__$v,
    __vue_module_identifier__$v,
    undefined,
    undefined
  );

//

var script$w = {
    mixins: [jsonForm.JsonFormElementMixin],
    components: {ControlLabel, ListError},
    data()
    {
        return {
            dragOptions: {
                draggable: '.drag-item',
                filter: '.drag-ignore',
                handle: '.drag-handle',
                group: 'region-' + this.$uniqueObjectId(this)
            }
        };
    },
    computed: {
        regionVariantValidations()
        {
            const model = this.modelProxy;
            if (!model || model.length === 0) {
                return null;
            }

            const v = {};
            const p = this.config.variantField;

            const parser = this.wrapper.parser;
            this.config.regions.map(region => {
                v[region.name] = region.validation ? parser.validator.getMultiple(region.validation) : {};

                if (!Array.isArray(model[region.name])) {
                    return;
                }

                model[region.name].map((item, index) => {
                    v[region.name][index] = {};
                    parser.parseControlList(this.getVariantByName(item[p]).items, v[region.name][index]);
                });
            });

            return v;
        },
        translatedTitle()
        {
            if (!this.display.title) {
                return null;
            }
            return this.$intl.translate(this.display.title) || null;
        }
    },
    methods: {
        variantTitle(variant)
        {
            if (variant.display && variant.display.title) {
                return variant.display.title;
            }
            return variant.title;
        },
        itemTitle(val)
        {
            const v = this.getVariantByName(val[this.config.variantField]);
            let title = v.itemTitle || this.display.itemTitle;
            if (typeof title === "function") {
                title = title(val);
            }
            if (!title) {
                return null;
            }
            if (typeof title !== 'object') {
                title = {key: null, text: title};
            }
            return this.$intl.translate(title, val);
        },
        canAddItem(region)
        {
            const max = region.config.maxItems;
            if (!max || max < 0) {
                return true;
            }

            const value = this.modelProxy[region.name];
            return !value || value.length < max;
        },
        itemHasError(region, index, dirty = false)
        {
            const v = this.validatorProxy;
            if (!v || !v[region.name] || !v[region.name][index]) {
                return false;
            }

            if (!dirty && !v[region.name][index].$dirty) {
                return false;
            }

            return v[region.name][index].$invalid;
        },
        getVariantByName(name)
        {
            for (let i = 0, m = this.items.length; i < m; i++) {
                if (this.items[i].name === name) {
                    return this.items[i];
                }
            }
            return null;
        },
        addItem(region, variant)
        {
            this.wrapper.pushUnparsedForm({
                title: this.display.addTitle || {key: 'common.form.addItemTitle', text: 'Create new item'},
                button: this.display.addSubmitButtom || {key: 'common.form.addSubmitButton', text: 'Add'},
                model: {
                    [this.config.variantField]: variant.name
                },
                items: variant.items,
                actions: {
                    submit: (original, copy) => {
                        this.modelProxy[region.name].push(copy);
                        this.validate();
                        return true;
                    }
                }
            });
        },
        removeItem(region, val)
        {
            let index = this.modelProxy[region.name].indexOf(val);
            if (index >= 0) {
                this.modelProxy[region.name].splice(index, 1);
                this.validate();
            }
        },
        editItem(region, val)
        {
            let index = this.modelProxy[region.name].indexOf(val);
            const variant = this.getVariantByName(val[this.config.variantField]);
            this.wrapper.pushUnparsedForm({
                title: this.display.editTitle || {key: 'common.form.editItemTitle', text: 'Edit item'},
                button: this.display.editSubmitButtom || {key: 'common.form.editSubmitButton', text: 'Save changes'},
                model: this.$clone(val),
                items: variant.items,
                actions: {
                    submit: (original, copy) => {
                        this.$set(this.modelProxy[region.name], index, copy);
                        this.validate();
                        return true;
                    }
                }
            });
        }
    },
    created()
    {
        this.config.regions.map(item => {
            if (!this.modelProxy.hasOwnProperty(item.name)) {
                this.$set(this.modelProxy, item.name, []);
            }
        });
    },
    beforeDestroy()
    {
        this.config.regions.map(item => {
            this.$delete(this.modelProxy, item.name);
        });
    }
};

/* script */
            const __vue_script__$w = script$w;
            
/* template */
var __vue_render__$w = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(Boolean(_vm.translatedTitle))?_c('v-subheader',[_c('control-label',{attrs:{"text":_vm.translatedTitle,"has-error":_vm.allErrors.length > 0,"required":_vm.config.required}})],1):_vm._e(),_vm._v(" "),_vm._l((_vm.config.regions),function(region){return _c('v-list',{key:region.name,attrs:{"subheader":"","dense":""}},[_c('v-subheader',[_c('control-label',{attrs:{"text":_vm.$intl.translate(region.title),"has-error":_vm.hasErrors(region.name),"required":region.config.required}}),_vm._v(" "),_c('v-spacer'),_vm._v(" "),_c('v-menu',{attrs:{"offset-y":"","disabled":!_vm.canAddItem(region),"max-height":"426"}},[_c('v-btn',{attrs:{"slot":"activator","disabled":!_vm.canAddItem(region),"small":"","flat":"","ripple":""},slot:"activator"},[_c('v-icon',[_vm._v("add")]),_vm._v("\n                    "+_vm._s(_vm.$intl.translate(_vm.display.addButton || {key: 'common.form.add', text: 'Add'}))+"\n                ")],1),_vm._v(" "),_c('v-list',_vm._l((_vm.items),function(variant){return _c('v-list-tile',{key:variant.name,on:{"click":function($event){_vm.addItem(region, variant);}}},[_c('v-list-tile-title',[_vm._v(_vm._s(_vm.$intl.translate(_vm.variantTitle(variant))))])],1)}))],1)],1),_vm._v(" "),_c('draggable',{staticStyle:{"min-height":"2px"},attrs:{"list":_vm.modelProxy[region.name],"options":_vm.dragOptions}},_vm._l((_vm.modelProxy[region.name]),function(val,index){return _c('v-list-tile',{key:_vm.$uniqueObjectId(val, index),staticClass:"drag-item",on:{"click":function($event){_vm.editItem(region, val);}}},[_c('v-list-tile-avatar',{staticClass:"drag-handle"},[(_vm.itemHasError(region, index))?_c('v-icon',{attrs:{"color":"red"}},[_vm._v("error")]):_c('v-icon',[_vm._v("swap_vert")]),_vm._v("\n                    "+_vm._s(index + 1)+".\n                ")],1),_vm._v(" "),_c('v-list-tile-content',[_c('v-list-tile-title',[_vm._v(_vm._s(_vm.itemTitle(val)))]),_vm._v(" "),_c('v-list-tile-sub-title',[_vm._v("\n                        "+_vm._s(_vm.$intl.translate(_vm.variantTitle(_vm.getVariantByName(val[_vm.config.variantField]))))+"\n                    ")])],1),_vm._v(" "),_c('v-list-tile-action',[_c('v-btn',{attrs:{"icon":"","ripple":""},on:{"click":function($event){$event.stopPropagation();_vm.removeItem(region, val);}}},[_c('v-icon',{attrs:{"color":"red"}},[_vm._v("delete")])],1)],1)],1)})),_vm._v(" "),_c('v-list-tile',{directives:[{name:"show",rawName:"v-show",value:(_vm.modelProxy[region.name].length === 0),expression:"modelProxy[region.name].length === 0"}],staticClass:"sortable-empty-list-item"},[_c('v-list-tile-content',[_vm._v("\n                "+_vm._s(_vm.$intl.translate(_vm.display.placeholder || {key: 'common.form.empty_list', text: 'No items'}))+"\n            ")])],1),_vm._v(" "),(_vm.hasErrors(region.name))?[_c('v-divider'),_vm._v(" "),_c('list-error',{attrs:{"error":_vm.getAllErrors(region.name)[0]}})]:_vm._e()],2)})],2)};
var __vue_staticRenderFns__$w = [];

  /* style */
  const __vue_inject_styles__$w = undefined;
  /* scoped */
  const __vue_scope_id__$w = undefined;
  /* module identifier */
  const __vue_module_identifier__$w = undefined;
  /* functional template */
  const __vue_is_functional_template__$w = false;
  /* component normalizer */
  function __vue_normalize__$w(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "group-repeat-variants.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var GroupRepeatVariantsControl = __vue_normalize__$w(
    { render: __vue_render__$w, staticRenderFns: __vue_staticRenderFns__$w },
    __vue_inject_styles__$w,
    __vue_script__$w,
    __vue_scope_id__$w,
    __vue_is_functional_template__$w,
    __vue_module_identifier__$w,
    undefined,
    undefined
  );

//

var script$x = {
    components: {JsonFormGroup: jsonForm.JsonFormGroup},
    mixins: [jsonForm.JsonFormElementMixin],
    watch: {
        currentVariant(variant)
        {
            const v = this.validatorProxy;
            if (v && v[this.variantProp]) {
                v[this.variantProp].$touch();
            }
            this.buildItems(variant);
        }
    },
    data()
    {
        return {
            loading: false,
            selectItems: this.items,
            currentItems: null,
            currentValidations: {},
        };
    },
    created()
    {
        const init = () => {
            const model = this.modelProxy;
            if (model && model[this.variantProp] != null) {
                this.buildItems(model[this.variantProp]);
            }
        };
        if (typeof this.config.variantLoader === 'function') {
            this.loading = true;
            this.config.variantLoader(this)
                .then(items => {
                    this.selectItems = items || [];
                    init();
                    this.loading = false;
                });
        } else {
            init();
        }
    },
    computed: {
        currentVariantValidations()
        {
            return this.currentValidations;
        },
        allErrors()
        {
            return this.getAllErrors(this.variantProp);
        },
        currentVariant()
        {
            return this.modelProxy[this.variantProp] || null;
        },
        variantProp()
        {
            return this.config.variantField || 'variant_name';
        }
    },
    methods: {
        getVariantByName(name)
        {
            if (name === null) {
                return null;
            }
            return this.selectItems.find(item => item.name === name);
        },
        clearObject(obj)
        {
            for (let prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    this.$delete(obj, prop);
                }
            }
            return obj;
        },
        buildItems(name)
        {
            if (name === null) {
                this.currentItems = null;
                this.clearObject(this.currentValidations);
                return;
            }

            const variant = this.getVariantByName(name);

            this.currentValidations = this.clearObject(this.currentValidations);

            const validations = {};
            this.currentItems = this.wrapper.parser.parseControlList(variant.items, validations);

            for (let prop in validations) {
                if (validations.hasOwnProperty(prop)) {
                    this.$set(this.currentValidations, prop, validations[prop]);
                }
            }
        },
        onRouteLeave(func)
        {
            if (this.currentItems === null) {
                return true;
            }
            return func(this.$refs.formGroup);
        }
    },
    beforeDestroy()
    {
        this.$delete(this.modelProxy, this.variantProp);
        this.currentItems = null;
        this.clearObject(this.currentValidations);
    }
};

/* script */
            const __vue_script__$x = script$x;
            
/* template */
var __vue_render__$x = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('v-select',{attrs:{"error-messages":_vm.getAllErrors(_vm.variantProp),"label":_vm.$intl.translate(_vm.display.title),"hint":_vm.$intl.translate(_vm.display.hint),"placeholder":_vm.$intl.translate(_vm.display.placeholder),"prepend-icon":_vm.$controlIcon(_vm.display.prependIcon),"append-icon":_vm.$controlIcon(_vm.display.appendIcon),"required":_vm.config.required,"clearable":"","box":_vm.display.appearance === 'box',"solo":_vm.display.appearance === 'solo',"solo-inverted":_vm.display.appearance === 'solo-inverted',"outline":_vm.display.appearance === 'outline',"flat":!!_vm.display.flat,"items":_vm.selectItems,"item-text":"title","item-value":"name","item-avatar":"icon","loading":_vm.loading,"disabled":_vm.loading},model:{value:(_vm.modelProxy[_vm.variantProp]),callback:function ($$v) {_vm.$set(_vm.modelProxy, _vm.variantProp, $$v);},expression:"modelProxy[variantProp]"}}),_vm._v(" "),(_vm.currentItems !== null)?_c('json-form-group',{ref:"formGroup",attrs:{"model":_vm.modelProxy,"validator":_vm.validatorProxy,"items":_vm.currentItems,"wrapper":_vm.wrapper,"path":_vm.path,"parent-validations-container":_vm.parentValidationsContainer,"validations-container":_vm.validationsContainer}}):_vm._e()],1)};
var __vue_staticRenderFns__$x = [];

  /* style */
  const __vue_inject_styles__$x = undefined;
  /* scoped */
  const __vue_scope_id__$x = undefined;
  /* module identifier */
  const __vue_module_identifier__$x = undefined;
  /* functional template */
  const __vue_is_functional_template__$x = false;
  /* component normalizer */
  function __vue_normalize__$x(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "variant.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var VariantControl = __vue_normalize__$x(
    { render: __vue_render__$x, staticRenderFns: __vue_staticRenderFns__$x },
    __vue_inject_styles__$x,
    __vue_script__$x,
    __vue_scope_id__$x,
    __vue_is_functional_template__$x,
    __vue_module_identifier__$x,
    undefined,
    undefined
  );

var controls = {
    'text': new jsonForm.StringControlParser(text),
    'textarea': new jsonForm.StringControlParser(TextareaControl),
    'tel': new jsonForm.ExtendedStringControlParser(TelControl, {tel: true}),
    'email': new jsonForm.ExtendedStringControlParser(EmailControl, {email: true}),
    'password': new jsonForm.StringControlParser(PasswordControl),
    'number': new jsonForm.NumberControlParser(NumberControl),
    'url': new jsonForm.ExtendedStringControlParser(UrlControl, {url: true}),
    'ipv4': new jsonForm.ExtendedStringControlParser(text, {ipv4: true}),
    'ipv6': new jsonForm.ExtendedStringControlParser(text, {ipv6: true}),
    'color': new jsonForm.ExtendedStringControlParser(ColorControl, {color: true}),
    'hidden': new HiddenParser(HiddenControl),
    'uuid': new jsonForm.StringControlParser(UUIDControl),

    'checkbox': new jsonForm.BooleanControlParser(CheckboxControl),
    'checkbox-multi': new CheckboxMultiParser(CheckboxMultiControl),

    'switch': new jsonForm.BooleanControlParser(SwitchControl),
    'radio': new jsonForm.SelectionControlParser(RadioControl),
    'select': new SelectParser(SelectControl),
    'select-group': new SelectParser(SelectControl, true),
    'combobox': new ComboboxParser(ComboboxControl),
    'chips': new ChipsParser(ComboboxControl),
    'display': new DisplayParser(SelectControl),

    'slider': new jsonForm.NumberControlParser(SliderControl),

    'icon': new IconParser(IconControl),

    'description': new DescriptionParser(DescriptionControl),
    'col': new jsonForm.ObjectControlParser(ColControl),
    'row': new jsonForm.ObjectControlParser(RowControl),
    'group': new jsonForm.ObjectControlParser(GroupControl),
    'switch-group': new SwitchGroupParser(SwitchGroupControl),
    'async-group': new jsonForm.AsyncObjectControlParser(AsyncGroupControl),
    'tabs': new TabsParser(TabsControl),
    'component': new ComponentParser(ComponentControl),

    'date': new jsonForm.DateControlParser(DateControl),
    'time': new jsonForm.TimeControlParser(TimeControl),
    'date-time': new jsonForm.DateTimeControlParser(DateTimeControl),

    'repeat': new RepeatParser(RepeatControl),
    'repeat-variants': new RepeatVariantsParser(RepeatVariantsControl),
    'group-repeat': new GroupRepeatParser(GroupRepeatControl),
    'group-repeat-variants': new GroupRepeatVariantsParser(GroupRepeatVariantsControl),
    'variant': new VariantParser(VariantControl),
};

// import {ValidatorItem} from "@aquarelle/json-form";

var validators = {};

function install(Vue) {
    Vue.use(jsonForm.JsonForm);

    // controls
    for (const name in controls) {
        if (controls.hasOwnProperty(name)) {
            jsonForm.JsonForm.addControl(name, controls[name]);
        }
    }
    // validators
    for (const name in validators) {
        if (validators.hasOwnProperty(name)) {
            jsonForm.JsonForm.validator.add(validators[name]);
        }
    }

    // control icon
    Vue.prototype.$controlIcon = function (icon) {
        if (typeof icon !== 'string') {
            return undefined;
        }
        if (icon.indexOf(':') === -1) {
            return icon;
        }
        icon = icon.split(':');
        return icon[0] + ' fa-' + icon[1];
    };
}

exports.install = install;
exports.TextControl = text;
exports.TextareaControl = TextareaControl;
exports.EmailControl = EmailControl;
exports.TelControl = TelControl;
exports.NumberControl = NumberControl;
exports.PasswordControl = PasswordControl;
exports.UrlControl = UrlControl;
exports.ColorControl = ColorControl;
exports.IconControl = IconControl;
exports.HiddenControl = HiddenControl;
exports.UUIDControl = UUIDControl;
exports.SliderControl = SliderControl;
exports.CheckboxControl = CheckboxControl;
exports.CheckboxMultiControl = CheckboxMultiControl;
exports.SwitchControl = SwitchControl;
exports.RadioControl = RadioControl;
exports.SelectControl = SelectControl;
exports.ComboboxControl = ComboboxControl;
exports.DescriptionControl = DescriptionControl;
exports.ColControl = ColControl;
exports.RowControl = RowControl;
exports.GroupControl = GroupControl;
exports.SwitchGroupControl = SwitchGroupControl;
exports.TabsControl = TabsControl;
exports.AsyncGroupControl = AsyncGroupControl;
exports.ComponentControl = ComponentControl;
exports.DateControl = DateControl;
exports.TimeControl = TimeControl;
exports.DateTimeControl = DateTimeControl;
exports.RepeatControl = RepeatControl;
exports.RepeatVariantsControl = RepeatVariantsControl;
exports.GroupRepeatControl = GroupRepeatControl;
exports.GroupRepeatVariantsControl = GroupRepeatVariantsControl;
exports.VariantControl = VariantControl;
exports.HiddenParser = HiddenParser;
exports.SwitchGroupParser = SwitchGroupParser;
exports.TabsParser = TabsParser;
exports.SelectParser = SelectParser;
exports.DisplayParser = DisplayParser;
exports.DescriptionParser = DescriptionParser;
exports.IconParser = IconParser;
exports.ComponentParser = ComponentParser;
exports.ComboboxParser = ComboboxParser;
exports.ChipsParser = ChipsParser;
exports.RepeatParser = RepeatParser;
exports.RepeatVariantsParser = RepeatVariantsParser;
exports.GroupRepeatParser = GroupRepeatParser;
exports.GroupRepeatVariantsParser = GroupRepeatVariantsParser;
exports.VariantParser = VariantParser;
exports.CheckboxMultiParser = CheckboxMultiParser;
exports.ControlLabel = ControlLabel;
exports.ControlIcon = ControlIcon;
exports.BlockError = BlockError;
exports.ListError = ListError;
exports.BlockForm = BlockForm;
exports.DialogForms = DialogForms;
exports.StepperForm = StepperForm;
