<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCardStore, useMapStore } from '../../store';
import { CARD_TITLE } from '../../const/const.map'
import pointForm from './form/pointForm.vue';
import lineForm from './form/lineForm.vue';
import polygonForm from './form/polygonForm.vue';
import circleForm from './form/circleForm.vue';
import { TYPES } from '../../const/const.map';

const cardstore = useCardStore()
const { setShowUuid, getItem, removeItem } = cardstore
const { showUuid } = storeToRefs(cardstore)

const MapStore = useMapStore()

let form = ref({ name: "", type: "" })

cardstore.$onAction(({ name, store, after }) => {
    if (name == "addData") {
        after((p) => {
            form.value = { ...form.value, ...p, ...p.formData }
            console.log("🚀 ~ after ~ form.value:", form.value)
        })
    }
})
const handleClose = () => {
    setShowUuid('')
}

const handleDelete = () => {
    let { marker: targetMarker, overlay: targetOverlay, feature } = getItem()
    if (targetOverlay) {
        MapStore.mapTool.map.removeOverlay(targetOverlay);
    }
    if (targetMarker) {
        MapStore.mapTool.layers.vectorLayer.getSource().removeFeature(targetMarker)
    }
    if (feature) {
        MapStore.mapTool.layers.vectorLayer.getSource().removeFeature(feature)
    }
    removeItem({ uuid: showUuid.value })
    setShowUuid('')
}

const formComponent = computed(() => {
    const { type } = form.value
    switch (type) {
        case TYPES.POINT: return pointForm;
        case TYPES.LINESTRING: return lineForm;
        case TYPES.POLYGON:
        case TYPES.RECT: return polygonForm;
        case TYPES.CIRCLE: return circleForm;
        default:
            return null;
    }
})

</script>

<template>
    <div class="card_panel" v-if="!!showUuid" :key="showUuid">
        <div class="card_header">
            <span>{{ CARD_TITLE[form.type] }}</span>
            <span role="img" tabindex="-1" class="anticon Head_close__0vFMi" @click="handleClose">
                <svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="">
                    <use xlink:href="#icon-close"></use>
                </svg></span>
        </div>
        <div class="card_body">
            <div class="container">
                <div class="editPanel">
                    <el-form :model="form" label-width="auto" style="max-width: 600px">
                        <el-form-item label="名称:">
                            <el-input v-model="form.name" />
                        </el-form-item>
                        <el-form-item label="备注:">
                            <el-input v-model="form.mark" :rows="2" type="textarea" />
                        </el-form-item>
                    </el-form>
                    <div class="styleSet">
                        <div class="styleSetTitle">样式设置</div>
                        <component :is="formComponent" :formData="form" />
                    </div>
                    <div class="card_body_footer">
                        <el-button type="primary">保存</el-button>
                        <el-button @click="handleDelete">删除</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card_panel {
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 4px #0000004d;
    min-height: 200px;
    position: absolute;
    right: 70px;
    top: 100px;
    width: 350px;
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

.editPanel {
    padding: 20px;
}

.styleSet {
    padding: 0 0 20px;
}

.styleSetTitle {
    background-color: #f2f2f2;
    border-left: 4px solid #3385ff;
    margin-bottom: 24px;
    padding: 6px 10px;
}

.Head_close__0vFMi {
    cursor: pointer;
}
</style>