<script setup>
import { ref } from 'vue';
import { useMapStore } from '../../store';

const mapStore = useMapStore()

const active = ref(true)
const handleChange = () => {
    const target = !active.value;
    active.value = target;
    mapStore.setMapMode(!target ? '3D' : '2D')
}
</script>
<template>
    <span @click="handleChange" :class="active ? 'active' : ''"></span>
</template>

<style scoped>
span {
    position: absolute;
    z-index: 5;
    outline: none;
    border: none;
    cursor: pointer;
    width: 26px;
    height: 26px;
    right: 18px;
    bottom: 150px;
    background: url(../../assets/gl-navi-control-pc4.png) -188px 1px / 266px no-repeat rgb(255, 255, 255);
    box-shadow: rgba(0, 0, 0, 0.15) 1px 2px 1px;
}

span:hover {
    background: url(../../assets/gl-navi-control-pc4.png) -240px 1px / 266px no-repeat rgb(255, 255, 255);
}

span.active {
    background: url(../../assets/gl-navi-control-pc4.png) -110px 1px / 266px no-repeat rgb(255, 255, 255);
}

span.active:hover {
    background: url(../../assets/gl-navi-control-pc4.png) -162px 1px / 266px no-repeat rgb(255, 255, 255);
}
</style>