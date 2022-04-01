<template>
  <!-- <Layout> -->
  <!-- <Header class="layout-header-bar">操作头</Header> -->
  <Layout>
    <Sider hide-trigger :width="300">
      <editor-menu :components="components"></editor-menu>
    </Sider>
    <Content :class="['editor-container']">
      <BorderSelecting
        :selecting="borderSelectingInfo"
        :detecting="borderDetectingInfo"
      ></BorderSelecting>
      <EditorCanvas
        @on-border-selecting="handleBorderSelecting"
        @on-border-detecting="handleBorderDetecting"
        @on-select-item="handleSelectItem"
        :selectItem="selectItem"
        v-model="canvasData"
      ></EditorCanvas>
    </Content>
    <Sider hide-trigger :width="300">
      <EditorProperties
        :components="components"
        :selectedComponent="selectedComponent"
      ></EditorProperties>
    </Sider>
  </Layout>
  <!-- </Layout> -->
</template>

<script>
import EditorCanvas from "./EditorCanvas.vue";
import EditorMenu from "./EditorMenu.vue";
import EditorProperties from "./EditorProperties.vue";
import componentsRegister from "./components";
import BorderSelecting from "@/components/BorderSelecting";

const components = componentsRegister.components;
export default {
  components: {
    EditorCanvas,
    EditorMenu,
    EditorProperties,
    BorderSelecting
  },
  data() {
    return {
      components,
      selectItem: {},
      canvasData: [],
      borderSelectingInfo: {
        width: 0,
        height: 0,
        translateX: 0,
        translateY: 0
      },
      borderDetectingInfo: {
        width: 0,
        height: 0,
        translateX: 0,
        translateY: 0
      }
    };
  },
  provide: {
    tree: {
      type: "page",
      props: {},
      children: [
        {
          type: "Modal",
          label: "",
          icon: "",
          isDragger: false, //是否可以拖拽改变层级
          props: {}
        },
        {
          type: "Layout",
          props: {},
          children: [
            {
              type: "Header",
              props: {
                class: "layout-header-bar"
              },
              children: []
            },
            {
              type: "Content",
              props: {},
              children: [
                {
                  type: "Card",
                  props: {
                    props: {
                      "dis-hover": true
                    }
                  },
                  children: [
                    {
                      type: "Search",
                      props: {
                        props: {
                          row: 2,
                          condition: { descript: "" },
                          fields: [
                            { label: "描述", value: "descript" },
                            { label: "代码", value: "code" }
                          ]
                        },
                        on: {
                          search: () => {
                            this.$refs.autoTable.search();
                          }
                        }
                      }
                    },
                    {
                      type: "AutoTable",
                      props: {
                        ref: "autoTable",
                        props: {
                          columns: [
                            { title: "描述", key: "descript" },
                            { title: "代码", key: "code" },
                            { title: "排序", key: "listOrder" }
                          ],
                          loadData: () => {
                            return Promise.resolve({
                              datas: [
                                {
                                  descript: "描述1",
                                  code: "代码1",
                                  listOrder: "排序1"
                                }
                              ]
                            });
                          }
                        }
                      }
                    }
                  ]
                },

                {
                  type: "Divider",
                  props: {}
                },
                {
                  type: "Card",
                  props: {
                    props: {
                      "dis-hover": true
                    }
                  },
                  children: [
                    {
                      type: "AutoTable",
                      props: {
                        ref: "autoTable",
                        props: {
                          columns: [
                            { title: "描述", key: "descript" },
                            { title: "代码", key: "code" },
                            { title: "排序", key: "listOrder" }
                          ],
                          loadData: () => {
                            return Promise.resolve({
                              datas: [
                                {
                                  descript: "描述1",
                                  code: "代码1",
                                  listOrder: "排序1"
                                }
                              ]
                            });
                          }
                        }
                      }
                    }
                  ]
                },
                {
                  type: "Divider",
                  props: {}
                },
                {
                  type: "Card",
                  props: {
                    props: {
                      "dis-hover": true
                    }
                  },
                  children: [
                    {
                      type: "AutoTable",
                      props: {
                        ref: "autoTable",
                        props: {
                          columns: [
                            { title: "描述", key: "descript" },
                            { title: "代码", key: "code" },
                            { title: "排序", key: "listOrder" }
                          ],
                          loadData: () => {
                            return Promise.resolve({
                              datas: [
                                {
                                  descript: "描述1",
                                  code: "代码1",
                                  listOrder: "排序1"
                                }
                              ]
                            });
                          }
                        }
                      }
                    }
                  ]
                },
                {
                  type: "Divider",
                  props: {}
                },
                {
                  type: "Card",
                  props: {
                    props: {
                      "dis-hover": true
                    }
                  },
                  children: [
                    {
                      type: "AutoTable",
                      props: {
                        ref: "autoTable",
                        props: {
                          columns: [
                            { title: "描述", key: "descript" },
                            { title: "代码", key: "code" },
                            { title: "排序", key: "listOrder" }
                          ],
                          loadData: () => {
                            return Promise.resolve({
                              datas: [
                                {
                                  descript: "描述1",
                                  code: "代码1",
                                  listOrder: "排序1"
                                }
                              ]
                            });
                          }
                        }
                      }
                    }
                  ]
                },
                {
                  type: "Divider",
                  props: {}
                },
                {
                  type: "Card",
                  props: {
                    props: {
                      "dis-hover": true
                    }
                  },
                  children: [
                    {
                      type: "AutoTable",
                      props: {
                        ref: "autoTable",
                        props: {
                          columns: [
                            { title: "描述", key: "descript" },
                            { title: "代码", key: "code" },
                            { title: "排序", key: "listOrder" }
                          ],
                          loadData: () => {
                            return Promise.resolve({
                              datas: [
                                {
                                  descript: "描述1",
                                  code: "代码1",
                                  listOrder: "排序1"
                                }
                              ]
                            });
                          }
                        }
                      }
                    }
                  ]
                }
              ]
            },
            {
              type: "Footer",
              props: {},
              children: [
                {
                  type: "span",
                  props: {
                    value: "footer"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  },
  computed: {
    selectedComponent() {
      return this.components.find(comp => comp.isFocus) || {};
    }
  },
  methods: {
    handleBorderSelecting(info) {
      const { width, height, x, y } = info;
      this.borderSelectingInfo.width = width;
      this.borderSelectingInfo.height = height;
      this.borderSelectingInfo.translateX = x;
      this.borderSelectingInfo.translateY = y;
    },
    handleBorderDetecting(info) {
      const { width, height, x, y } = info;
      this.borderDetectingInfo.width = width;
      this.borderDetectingInfo.height = height;
      this.borderDetectingInfo.translateX = x;
      this.borderDetectingInfo.translateY = y;
    },
    handleSelectItem(component) {
      this.selectItem = component;
    }
  }
};
</script>

<style lang="less" scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.editor-container {
  position: relative;
  padding: 16px;
}
.ivu-layout-content {
  overflow-x: visible !important;
}
.ivu-layout-sider {
  margin: 2px 0;
  // border:1px solid
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  background: #ffffff;
}
</style>
