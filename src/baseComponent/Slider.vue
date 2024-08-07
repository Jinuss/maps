<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    value: {
        type: Number,
        default: 0
    },
    max: Number,
    min: Number,
    step: Number
})

const sliderValue = ref(props.value)

watch(() => props.value, (newVal) => {
    sliderValue.value = newVal
})
const emit = defineEmits(['change'])
const changeSlider = (val) => {
    sliderValue.value = val;
    emit('change', val)
}
</script>
<template>
    <div class="slider">
        <el-slider v-model="sliderValue" :max="props.max" :step="props.step" :min="props.min" @change="changeSlider"
            @input="changeSlider" />
        <span>{{ sliderValue }}</span>
    </div>
</template>
<style scoped>
.slider {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    width: 100%;
}

span {
    font-size: 14px;
    margin-left: 20px;
}
</style>