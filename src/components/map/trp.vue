<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from 'pinia';
import { useMapStore, useCardStore } from "../../store";
import { EventBus } from '../../util/index'

const { mapTool: MapTool } = storeToRefs(useMapStore())
const cardStore = useCardStore()
const currentColor = ref("#262626")
const ulRef = ref()

const removeClass = () => {
    let aLi = document.querySelectorAll("li")
    aLi.forEach((i) => { i.classList.remove("active") })
}

onMounted(() => {
    if (ulRef && ulRef.value) {
        ulRef.value.childNodes.forEach(item => {
            item.addEventListener('click', () => {
                removeClass()
                let type = item.className
                item.classList.add('active')
                handleClickType(type)
            })
        })
    }
    EventBus.on('cancel', removeClass)
})

const handleCompleteCallback = ({ operate, type, uuid, ...rest }) => {
    if (operate=="add") {
        cardStore.addData({ type, uuid, ...rest });
    }else{
        cardStore.setShowUuid(uuid)
    }
}
const handleClickType = (type) => {
    if (MapTool.value) {
        MapTool.value.callback = handleCompleteCallback
        MapTool.value.removeListener()
        MapTool.value.addListener(type)
    }
}
onBeforeUnmount(() => {
    EventBus.off('cancel', removeClass)
})

</script>
<template>
    <ul class="Draw_draw__UPVhb" ref="ulRef">
        <li class="point">
            <el-tooltip class="box-item" effect="dark" content="标点" placement="left" :offset="20">
                <span role="img" class="anticon">
                    <svg width="1em" height="1em" :fill="currentColor" aria-hidden="true" focusable="false" class="">
                        <use xlink:href="#icon-point"></use>
                    </svg>
                </span>
            </el-tooltip>
        </li>
        <li class="line">
            <el-tooltip class="box-item" effect="dark" content="标线" placement="left" :offset="20">
                <span role="img" class="anticon">
                    <svg width="1em" height="1em" :fill="currentColor" aria-hidden="true" focusable="false" class="">
                        <use xlink:href="#icon-line"></use>
                    </svg></span>
            </el-tooltip>
        </li>
        <li class="polygon">
            <el-tooltip class="box-item" effect="dark" content="标面" placement="left" :offset="20">
                <span role="img" class="anticon"><svg width="1em" height="1em" :fill="currentColor" aria-hidden="true"
                        focusable="false" class="">
                        <use xlink:href="#icon-polygon"></use>
                    </svg></span>
            </el-tooltip>
        </li>
        <li class="circle">
            <el-tooltip class="box-item" effect="dark" content="画圆" placement="left" :offset="20">
                <span role="img" class="anticon"><svg width="1em" height="1em" :fill="currentColor" aria-hidden="true"
                        focusable="false" class="">
                        <use xlink:href="#icon-circle"></use>
                    </svg></span>
            </el-tooltip>
        </li>
        <li class="rect">
            <el-tooltip class="box-item" effect="dark" content="画矩形" placement="left" :offset="20">
                <span role="img" class="anticon"><svg width="1em" height="1em" :fill="currentColor" aria-hidden="true"
                        focusable="false" class="">
                        <use xlink:href="#icon-rect"></use>
                    </svg></span>
            </el-tooltip>
        </li>
        <li class="measure-distance">
            <el-tooltip class="box-item" effect="dark" content="测距" placement="left" :offset="20">
                <span role="img" class="anticon"><svg width="1em" height="1em" :fill="currentColor" aria-hidden="true"
                        focusable="false" class="">
                        <use xlink:href="#icon-measure-distance"></use>
                    </svg></span>
            </el-tooltip>
        </li>
        <li class="measure-polygon">
            <el-tooltip class="box-item" effect="dark" content="测面" placement="left" :offset="20">
                <span role="img" class="anticon"><svg width="1em" height="1em" :fill="currentColor" aria-hidden="true"
                        focusable="false" class="">
                        <use xlink:href="#icon-measure-polygon"></use>
                    </svg></span>
            </el-tooltip>
        </li>
    </ul>
</template>
<style scoped>
ul {
    border-radius: 2px;
    box-shadow: 0 0 4px 2px #b1b1b180;
    position: absolute;
    right: 10px;
    top: 100px;
    z-index: 5;
}

li {
    background-color: #fff;
    font-size: 22px;
    height: 35px;
    transition: all .3s;
    width: 35px;
    align-items: center;
    display: flex;
    justify-content: center;
}

ul>li:not(:last-child) {
    border-bottom: 1px solid #eaeaea;
}

.Draw_draw__UPVhb>li:first-child,
.Draw_draw__UPVhb>li:last-child {
    font-size: 26px;
}

.anticon {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    align-items: center;
    color: inherit;
    display: inline-flex;
    font-style: normal;
    line-height: 0;
    text-align: center;
    text-rendering: optimizelegibility;
    text-transform: none;
    vertical-align: -.125em;
    font-size: 22px;
}

.anticon>* {
    line-height: 1;
}

.anticon svg {
    display: inline-block;
}

li:hover {
    background-color: #f2f2f2;
    cursor: pointer;
}

ul>li.active {
    color: #3385ff;
}

ul>li.active svg {
    fill: #3385ff;
}
</style>
