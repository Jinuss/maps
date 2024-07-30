<script setup>
import { ref, reactive } from 'vue';
import pointForm from './form/pointForm.vue';

const form = reactive({ name: "" })

const emit = defineEmits(['getEventByCard'])

const handleClose = () => {
    emit('getEventByCard')
}
</script>
<template>
    <div class="card_panel">
        <div class="card_header">
            <span>标点</span>
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
                        <pointForm />
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
.Head_close__0vFMi{
    cursor: pointer;
}
</style>