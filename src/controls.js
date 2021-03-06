import {
    StringControlParser,
    ExtendedStringControlParser,
    NumberControlParser,
    ObjectControlParser,
    BooleanControlParser,
    SelectionControlParser,
    DateControlParser,
    TimeControlParser,
    DateTimeControlParser,
    AsyncObjectControlParser,
    FileControlParser
} from "@aquarelle/json-form";
import {
    HiddenParser,
    SwitchGroupParser,
    TabsParser,
    SelectParser,
    DisplayParser,
    DescriptionParser,
    IconParser,
    ComponentParser,
    ChipsParser,
    RepeatParser,
    ComboboxParser,
    RepeatVariantsParser,
    GroupRepeatParser,
    GroupRepeatVariantsParser,
    VariantParser,
    CheckboxMultiParser, RangeParser
} from "./form-parsers";
import {
    TextControl,
    EmailControl,
    TelControl,
    NumberControl,
    PasswordControl,
    ColorControl,
    UrlControl,
    HiddenControl,
    SliderControl,

    ColControl,
    RowControl,
    GroupControl,

    CheckboxControl,
    SwitchControl,
    SwitchGroupControl,
    UUIDControl,
    TextareaControl,
    RadioControl,
    TabsControl,
    SelectControl,
    DescriptionControl,

    DateControl,
    TimeControl,
    DateTimeControl,
    IconControl,
    AsyncGroupControl,
    ComponentControl,
    ComboboxControl,
    RepeatControl,
    RepeatVariantsControl,
    GroupRepeatControl,
    GroupRepeatVariantsControl, VariantControl, CheckboxMultiControl, RangeControl, FileControl,
} from "./form-controls";

export default {
    'text': new StringControlParser(TextControl),
    'textarea': new StringControlParser(TextareaControl),
    'tel': new ExtendedStringControlParser(TelControl, {tel: true}),
    'email': new ExtendedStringControlParser(EmailControl, {email: true}),
    'password': new StringControlParser(PasswordControl),
    'number': new NumberControlParser(NumberControl),
    'url': new ExtendedStringControlParser(UrlControl, {url: true}),
    'ipv4': new ExtendedStringControlParser(TextControl, {ipv4: true}),
    'ipv6': new ExtendedStringControlParser(TextControl, {ipv6: true}),
    'color': new ExtendedStringControlParser(ColorControl, {color: true}),
    'hidden': new HiddenParser(HiddenControl),
    'uuid': new StringControlParser(UUIDControl),

    'checkbox': new BooleanControlParser(CheckboxControl),
    'checkbox-multi': new CheckboxMultiParser(CheckboxMultiControl),

    'switch': new BooleanControlParser(SwitchControl),
    'radio': new SelectionControlParser(RadioControl),
    'select': new SelectParser(SelectControl),
    'select-group': new SelectParser(SelectControl, true),
    'combobox': new ComboboxParser(ComboboxControl),
    'chips': new ChipsParser(ComboboxControl),
    'display': new DisplayParser(SelectControl),

    'slider': new NumberControlParser(SliderControl),
    'range': new RangeParser(RangeControl),

    'file': new FileControlParser(FileControl),

    'icon': new IconParser(IconControl),

    'description': new DescriptionParser(DescriptionControl),
    'col': new ObjectControlParser(ColControl),
    'row': new ObjectControlParser(RowControl),
    'group': new ObjectControlParser(GroupControl),
    'switch-group': new SwitchGroupParser(SwitchGroupControl),
    'async-group': new AsyncObjectControlParser(AsyncGroupControl),
    'tabs': new TabsParser(TabsControl),
    'component': new ComponentParser(ComponentControl),

    'date': new DateControlParser(DateControl),
    'time': new TimeControlParser(TimeControl),
    'date-time': new DateTimeControlParser(DateTimeControl),

    'repeat': new RepeatParser(RepeatControl),
    'repeat-variants': new RepeatVariantsParser(RepeatVariantsControl),
    'group-repeat': new GroupRepeatParser(GroupRepeatControl),
    'group-repeat-variants': new GroupRepeatVariantsParser(GroupRepeatVariantsControl),
    'variant': new VariantParser(VariantControl),
};
