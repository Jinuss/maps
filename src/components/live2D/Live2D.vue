<template>
  <div
    :class="{
      'vue-live2d': true,
      'vue-live2d-on-left': true,
      // 'vue-live2d-on-right': direction === 'right',
    }"
    :style="{
      width: `300px`,
      height: `300px`,
      position: 'absolute',
      left: '10px',
      bottom: '20px',
    }"
    @mouseover="openLive2dTool"
    @mouseout="closeLive2dTool"
  >
    <div
      v-show="true"
      v-html="data.tipText"
      :class="{
        'vue-live2d-tip': true,
        'vue-live2d-tip-on-top': true,
        // 'vue-live2d-tip-on-bottom': tipPosition === 'bottom',
      }"
    ></div>
    <canvas
      :id="customId"
      v-show="mainShow"
      :class="{
        'vue-live2d-main': true,
        'vue-live2d-main-on-left': true,
        // 'vue-live2d-main-on-right': direction === 'right',
      }"
      width="300"
      height="300"
    >
    </canvas>
    <div v-show="toolShow" class="vue-live2d-tool">
      <img
        v-for="(tool, index) in tools"
        :key="index"
        :class="tool.className"
        :src="tool.svg"
        @click="tool.click"
      />
    </div>
    <div
      v-show="toggleShow"
      @click="openLive2dMain"
      :class="{
        'vue-live2d-toggle': true,
        'vue-live2d-toggle-on-left': true,
        // 'vue-live2d-toggle-on-right': direction === 'right',
      }"
    >
      <span>Kanban girl</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, nextTick, ref, computed } from "vue";
import commentsrc from "./imgs/comment.svg"
import usersrc from './imgs/user.svg'
import deletesrc from './imgs/delete.svg'
import infosrc from './imgs/info.svg'
import camerasrc from './imgs/camera.svg'
import streetsrc from './imgs/street.svg'

import tips from "./options/tips";

// const model = ["Potion-Maker/Pio", "school-2017-costume-yellow"];
const model = ["ShizukuTalk/shizuku-48", "default"];

const apiPath = "https://evgo2017.com/api/live2d-static-api/indexes";

let [modelPath, modelTexturesId] = model;

const customId = "vue-live2d-main";

let messageTimer = null;

const data = ref({
  containerDisplay: {
    tip: false,
    main: true,
    tool: false,
    toggle: false,
  },
  tipText: "vue-live2d Kanban girl",
  modelTexturesId: modelTexturesId,
});

const changeLive2dSize = () => {
  document.querySelector(
    `#${customId}`
  ).outerHTML = `<canvas id=${customId} width="300" height="300" class="vue-live2d-main"></canvas>`;
  loadModel();
};

const loadModel = () => {
  window.loadlive2d(
    customId,
    `${apiPath}/${modelPath}/${data.value.modelTexturesId}.json`
  );
  console.log(
    `Live2D 模型 ${modelPath}，服装 ${data.value.modelTexturesId} 加载完成`
  );
};

const loadRandModel = () => {
  http({
    url: `${apiPath}/models.json`,
    success: (data) => {
      const models = data.filter(({ modelPath: i }) => i !== modelPath);
      const { modelPath: j, modelIntroduce } =
        models[Math.floor(Math.random() * models.length)];
      modelPath = j;
      showMessage(`${modelIntroduce}`, 4000);
      loadRandTextures(true);
    },
  });
};

const loadRandTextures = (isAfterRandModel = false) => {
  http({
    url: `${apiPath}/${modelPath}/textures.json`,
    success: (resp) => {
      const modelTexturesIds = resp.filter(
        (modelTexturesId) => modelTexturesId !== data.value.modelTexturesId
      );
      data.value.modelTexturesId =
        modelTexturesIds[Math.floor(Math.random() * modelTexturesIds.length)];
      loadModel();
      if (!isAfterRandModel) {
        showMessage("我的新衣服好看嘛？", 4000);
      }
    },
  });
};

const showMessage = (msg = "", timeout = 6000) => {
  if (messageTimer) {
    clearTimeout(messageTimer);
    messageTimer = null;
  } else {
    data.value.containerDisplay.tip = true;
  }
  data.value.tipText = msg;
  messageTimer = setTimeout(() => {
    data.value.containerDisplay.tip = false;
    messageTimer = null;
  }, timeout);
};

const takePhoto = () => {
  showMessage("照好了嘛，留个纪念吖~");
  window.Live2D.captureName = "photo.png";
  window.Live2D.captureFrame = true;
};

const showHitokoto = () => {
  http({
    url: "https://v1.hitokoto.cn",
    success: ({ hitokoto, id, creator, from }) => {
      showMessage(
        `${hitokoto} <br> - by <a href="https://hitokoto.cn?id=${id}">${creator}</a> from 《${from} 》`
      );
    },
  });
};

const closeLive2dMain = () => {
  data.value.containerDisplay.main = false;
};

const openLive2dMain = () => {
  data.value.containerDisplay.main = true;
};
const closeLive2dTool = () => {
  data.value.containerDisplay.tool = false;
};
const openLive2dTool = () => {
  data.value.containerDisplay.tool = true;
};
const loadEvent = () => {
  for (const event in tips) {
    for (const { selector, texts } of tips[event]) {
      const dom =
        selector === "document" ? document : document.querySelector(selector);
      if (dom == null) {
        continue;
      }

      dom.addEventListener(event, () => {
        const msg = texts[Math.floor(Math.random() * texts.length)];
        showMessage(msg, 2000);
      });
    }
  }
};
const http = ({ url, success }) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 || xhr.status < 300 || xhr.status === 304) {
        success && xhr.response && success(JSON.parse(xhr.response));
      } else {
        console.error(xhr);
      }
    }
  };
  xhr.open("GET", url);
  xhr.send(null);
};

nextTick(() => {
  loadEvent();
});
onMounted(() => {
  loadModel();
});

defineProps({
  tips: {
    default: () => tips,
    type: Object,
  },
  width: {
    default: 0,
    type: Number,
  },
  height: {
    default: 0,
    type: Number,
  },
  size: {
    default: 255,
    type: Number,
  },
});

const tipShow = computed(() => {
  return mainShow && data.value.containerDisplay.tip;
});

const mainShow = computed(() => {
  return data.value.containerDisplay.main;
});

const toolShow = computed(() => {
  return mainShow && data.value.containerDisplay.tool;
});

const toggleShow = computed(() => {
  return !mainShow;
});

const tools = ref([
  {
    className: "custom-fa-comment",
    svg: commentsrc,
    click: showHitokoto,
  },
  {
    className: "custom-fa-user-circle",
    svg: usersrc,
    click: loadRandModel,
  },
  {
    className: "custom-fa-street-view",
    svg: streetsrc,
    click: loadRandTextures,
  },
  {
    className: "custom-fa-camera-retro",
    svg: camerasrc,
    click: takePhoto,
  },
  {
    className: "custom-fa-info-circle",
    svg: infosrc,
    click: () => {},
  },
  {
    className: "custom-fa-times",
    svg: deletesrc,
    click: closeLive2dMain,
  },
]);
</script>

<style scoped>
/* live2d */
.vue-live2d {
  display: flex;
  position: relative;
  align-items: flex-end;
}
.vue-live2d-on-left {
  flex-direction: row;
}
.vue-live2d-on-right {
  flex-direction: row-reverse;
}
/* live2d-tip */
.vue-live2d-tip {
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  line-height: 1.5rem;
  padding: 15px 20px;
  font-size: 0.9rem;

  word-break: break-all;
  text-overflow: ellipsis;
  border: 1px solid rgba(224, 186, 140, 0.62);
  border-radius: 12px;
  background-color: rgba(236, 217, 188, 0.5);
  box-shadow: 0 3px 15px 2px rgba(191, 158, 118, 0.2);
  animation: shake 50s ease-in-out 5s infinite;
}
.vue-live2d-tip-on-top {
  top: 0;
}
.vue-live2d-tip-on-bottom {
  bottom: 0;
}
/* live2d-main */
.vue-live2d-main {
  transition: padding 0.3s ease-in-out;
  cursor: grab;
}
.vue-live2d-main-on-left:hover {
  padding-left: 21px;
}
.vue-live2d-main-on-right:hover {
  padding-right: 21px;
}
/* live2d-tool */
.vue-live2d-tool {
  position: absolute;
  width: 20px;
  bottom: 10px;
  color: #5b6c7d;
  text-align: center;
  cursor: pointer;
  padding: 0 10px;
}
.vue-live2d-tool span {
  line-height: 30px;
}
.vue-live2d-tool span:hover {
  color: #0684bd;
}
/* live2d-toggle */
.vue-live2d-toggle {
  width: 1.5rem;
  bottom: 1rem;
  padding: 0.3rem 0;
  writing-mode: vertical-lr;
  color: #fff;
  background-color: #fa0;
  font-size: 1rem;
  cursor: pointer;
  right: 0;
}
.vue-live2d-toggle:hover {
  width: 1.7rem;
}
.vue-live2d-toggle-on-left {
  border-radius: 0 0.5rem 0.5rem 0;
}
.vue-live2d-toggle-on-right {
  border-radius: 0.5rem 0 0 0.5rem;
}
@keyframes shake {
  2% {
    transform: translate(0.5px, -1.5px) rotate(-0.5deg);
  }
  4% {
    transform: translate(0.5px, 1.5px) rotate(1.5deg);
  }
  6% {
    transform: translate(1.5px, 1.5px) rotate(1.5deg);
  }
  8% {
    transform: translate(2.5px, 1.5px) rotate(0.5deg);
  }
  10% {
    transform: translate(0.5px, 2.5px) rotate(0.5deg);
  }
  12% {
    transform: translate(1.5px, 1.5px) rotate(0.5deg);
  }
  14% {
    transform: translate(0.5px, 0.5px) rotate(0.5deg);
  }
  16% {
    transform: translate(-1.5px, -0.5px) rotate(1.5deg);
  }
  18% {
    transform: translate(0.5px, 0.5px) rotate(1.5deg);
  }
  20% {
    transform: translate(2.5px, 2.5px) rotate(1.5deg);
  }
  22% {
    transform: translate(0.5px, -1.5px) rotate(1.5deg);
  }
  24% {
    transform: translate(-1.5px, 1.5px) rotate(-0.5deg);
  }
  26% {
    transform: translate(1.5px, 0.5px) rotate(1.5deg);
  }
  28% {
    transform: translate(-0.5px, -0.5px) rotate(-0.5deg);
  }
  30% {
    transform: translate(1.5px, -0.5px) rotate(-0.5deg);
  }
  32% {
    transform: translate(2.5px, -1.5px) rotate(1.5deg);
  }
  34% {
    transform: translate(2.5px, 2.5px) rotate(-0.5deg);
  }
  36% {
    transform: translate(0.5px, -1.5px) rotate(0.5deg);
  }
  38% {
    transform: translate(2.5px, -0.5px) rotate(-0.5deg);
  }
  40% {
    transform: translate(-0.5px, 2.5px) rotate(0.5deg);
  }
  42% {
    transform: translate(-1.5px, 2.5px) rotate(0.5deg);
  }
  44% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }
  46% {
    transform: translate(1.5px, -0.5px) rotate(-0.5deg);
  }
  48% {
    transform: translate(2.5px, -0.5px) rotate(0.5deg);
  }
  50% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }
  52% {
    transform: translate(-0.5px, 1.5px) rotate(0.5deg);
  }
  54% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }
  56% {
    transform: translate(0.5px, 2.5px) rotate(1.5deg);
  }
  58% {
    transform: translate(2.5px, 2.5px) rotate(0.5deg);
  }
  60% {
    transform: translate(2.5px, -1.5px) rotate(1.5deg);
  }
  62% {
    transform: translate(-1.5px, 0.5px) rotate(1.5deg);
  }
  64% {
    transform: translate(-1.5px, 1.5px) rotate(1.5deg);
  }
  66% {
    transform: translate(0.5px, 2.5px) rotate(1.5deg);
  }
  68% {
    transform: translate(2.5px, -1.5px) rotate(1.5deg);
  }
  70% {
    transform: translate(2.5px, 2.5px) rotate(0.5deg);
  }
  72% {
    transform: translate(-0.5px, -1.5px) rotate(1.5deg);
  }
  74% {
    transform: translate(-1.5px, 2.5px) rotate(1.5deg);
  }
  76% {
    transform: translate(-1.5px, 2.5px) rotate(1.5deg);
  }
  78% {
    transform: translate(-1.5px, 2.5px) rotate(0.5deg);
  }
  80% {
    transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
  }
  82% {
    transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
  }
  84% {
    transform: translate(-0.5px, 0.5px) rotate(1.5deg);
  }
  86% {
    transform: translate(2.5px, 1.5px) rotate(0.5deg);
  }
  88% {
    transform: translate(-1.5px, 0.5px) rotate(1.5deg);
  }
  90% {
    transform: translate(-1.5px, -0.5px) rotate(-0.5deg);
  }
  92% {
    transform: translate(-1.5px, -1.5px) rotate(1.5deg);
  }
  94% {
    transform: translate(0.5px, 0.5px) rotate(-0.5deg);
  }
  96% {
    transform: translate(2.5px, -0.5px) rotate(-0.5deg);
  }
  98% {
    transform: translate(-1.5px, -1.5px) rotate(-0.5deg);
  }
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}
</style>
