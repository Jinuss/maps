<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia';
import { useTopicLayerStore, useMapStore } from '../../../store';
import { ClusterTools } from '../MapTools/ClusterTools';
import { HeatMapTools } from '../MapTools/HeatMapTools';
import { MaskTools } from '../MapTools/MaskTools';
import { WeatherTools } from '../MapTools/WeatherTools'

const mapStore = useMapStore()
const topicStore = useTopicLayerStore()

const { visible } = storeToRefs(topicStore)

let clusterTool = ref()

let heatMapTool = ref()

let maskTool = ref()

let weatherTool = ref()

const hideCard = () => {
    topicStore.setVisible(false)
}

const handleCluster = () => {
    if (!clusterTool.value) {
        clusterTool.value = new ClusterTools({ mapTool: mapStore.mapTool })
    }

    clusterTool.value.createMarkers()
}

const handleHeatMap = () => {
    if (!heatMapTool.value) {
        heatMapTool.value = new HeatMapTools({ mapTool: mapStore.mapTool })
    }

    heatMapTool.value.addFeatures()
}

const handleMaskMap = () => {
    if (!maskTool.value) {
        maskTool.value = new MaskTools({ mapTool: mapStore.mapTool })
    }

}

const handleWeatherMap = () => {
    if (!weatherTool.value) {
        weatherTool.value = new WeatherTools({ mapTool: mapStore.mapTool })
    }
}

onMounted(() => {
})

</script>

<template>
    <div class="topic_card_panel" v-if="visible">
        <div class="card_header">
            <span>专题图</span>
            <span role="img" tabindex="-1" class="anticon Head_close__0vFMi" @click="hideCard">
                <svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="">
                    <use xlink:href="#icon-close"></use>
                </svg></span>
        </div>
        <div class="card_body">
            <div class="container">
                <div class="topic_list">
                    <el-button type="primary" @click="handleCluster">聚合图层</el-button>
                    <el-button type="primary" @click="handleHeatMap">热力图</el-button>
                    <el-button type="primary" @click="handleMaskMap">蒙版图</el-button>
                    <el-button type="primary" @click="handleWeatherMap">气象专题图</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.topic_card_panel {
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 4px #0000004d;
    min-height: 200px;
    position: absolute;
    right: 70px;
    top: 100px;
    width: 500px;
    z-index: 5;
}

.card_header {
    background-color: #3385ff;
    color: #fff;
    font-size: 16px;
    justify-content: space-between;
    line-height: 45px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    display: flex;
}

.card_body {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: auto;
    min-height: 200px;
    max-height: calc(-190px + 100vh);
}

.card_body_footer {
    display: flex;
    justify-content: center;
    padding: 0 10px 20px;
}

.container {
    position: relative;
    overflow: scroll;
    margin-right: -17px;
    margin-bottom: -17px;
    min-height: 217px;
    max-height: calc(-173px + 100vh);
}

.topic_list {
    padding: 20px;
}

.Head_close__0vFMi {
    cursor: pointer;
}
</style>