<template>
    <div>
        <h3>{{$intl.translate(display.title)}}</h3>
        <div>{{$intl.translate(display.text)}}</div>
    </div>
</template>
<script>
    import {JsonFormElementMixin} from "vue-json-form";

    export default {
        name: 'description-control',
        mixins: [JsonFormElementMixin],
    };
</script>