import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ViewUI from "view-design";
import "view-design/dist/styles/iview.css";
import AutoForm from "@/components/AutoForm";
import AutoTable from "@/components/AutoTable";
import Search from "@/components/Search";
import NewEditTable from "@/components/NewEditTable";
import AddRow from "@/components/AddRow";
import Space from "@/components/Space";
import LayoutDraggable from "@/components/LayoutDraggable.vue";
Vue.config.productionTip = false;
Vue.use(ViewUI);
Vue.component("AutoForm", AutoForm);
Vue.component("AutoTable", AutoTable);
Vue.component("Search", Search);
Vue.component("NewEditTable", NewEditTable);
Vue.component("AddRow", AddRow);
Vue.component("Space", Space);
Vue.component("LayoutDraggable", LayoutDraggable);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
