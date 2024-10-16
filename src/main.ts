import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import "./style.css";
import { drag } from "./directives/index.ts";
import App from "./App.vue";

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);

app.use(ElementPlus);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.directive("drag", drag);

app.mount("#app");
