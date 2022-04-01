<script>
import draggable from "vuedraggable";
import LayoutDraggable from "@/components/LayoutDraggable";
export default {
  components: { draggable },
  props: {
    selectItem: {
      type: Object,
      default: () => {
        return {};
      }
    },
    value: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    handleSelectItem(component) {
      // e.stopPropagation();
      // this.canvasData.forEach(component => {
      //   component.isFocus = false;
      // });
      // component.isFocus = true;
      this.$emit("on-select-item", component);
    },
    handleBorderSelecting(info) {
      this.$emit("on-border-selecting", info);
    },
    handleBorderDetecting(info) {
      this.$emit("on-border-detecting", info);
    },
    onMove(e, originalEvent) {
      console.log("move", e, originalEvent);
      // return false;
    }
  },
  computed: {
    canvasData: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  render(h) {
    return (
      <div
        class="editor-canvas"
        style={{
          width: 800 + "px",
          height: "calc(100vh - 132px)"
        }}
      >
        <LayoutDraggable
          selectItem={this.selectItem}
          v-model={this.canvasData}
          on={{
            "on-select-item": component => {
              this.handleSelectItem(component);
            },
            "on-border-selecting": info => {
              this.handleBorderSelecting(info);
            },
            "on-border-detecting": info => {
              this.handleBorderDetecting(info);
            }
          }}
        ></LayoutDraggable>
      </div>
    );
  },
  // {this.renderComponent(tree.children)}
  // {this.canvasData.length === 0 && (
  //             <div
  //               key="emptyContainer"
  //               class="container emptyContainer forbid"
  //               style="height:100%;padding:20px;"
  //             >
  //               <div style="display:flex;justify-content:center;background:#f0f0f0;height:100%;align-items:center;border:1px dashed #A7B1BD">
  //                 拖拽组件到这里
  //               </div>
  //             </div>
  //           )}
  // <draggable
  //         vModel={this.canvasData}
  //         group={{ name: "components" }}
  //         class={["draggable-box"]}
  //         tag="div"
  //         filter=".emptyContainer"
  //         handle=".mover"
  //         draggable=".draggable"
  //         animation="100"
  //         ghostClass="ghost"
  //         move={this.onMove}
  //         on={{
  //           end: e => {
  //             console.log("end", e);
  //           },
  //           add: e => {
  //             console.log(
  //               "canvas add",
  //               e,
  //               e.newIndex,
  //               this.canvasData,
  //               this.canvasData[e.newIndex]
  //             );
  //           },
  //           clone: e => {
  //             console.log("clone canvas", e);
  //           }
  //         }}
  //       >
  //         <transition-group tag="div">
  //           {this.canvasData.length === 0 ? (
  //             <div
  //               class="container emptyContainer forbid"
  //               style="height:100%;padding:20px;"
  //               key="emptyContainer"
  //             >
  //               <div style="display:flex;justify-content:center;background:#f0f0f0;height:100%;align-items:center;border:1px dashed #A7B1BD">
  //                 拖拽组件到这里
  //               </div>
  //             </div>
  //           ) : (
  //             this.canvasData.map((component, index) => {
  //               return (
  //                 <div
  //                   class={[
  //                     "component-wrapper",
  //                     "mover",
  //                     "draggable",
  //                     { chosen: component.id === this.selectItem.id }
  //                   ]}
  //                   on={{
  //                     click: e => {
  //                       this.handleSelectItem(e, component);
  //                     }
  //                   }}
  //                   key={component.id}
  //                 >
  //                   {component.render(h)}
  //                 </div>
  //               );
  //             })
  //           )}
  //         </transition-group>
  //       </draggable>
  mounted() {}
};
</script>

<style lang="less" scoped>
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.editor-canvas {
  box-shadow: 0 1px 4px 0 rgb(31 50 88 / 13%);
  background: #ffffff;
  position: relative;

  .hint-text {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #a7b1bd;
    background: #f0f0f0;
    position: absolute;
    left: 20px;
    right: 20px;
    top: 20px;
    bottom: 20px;
  }
}
.draggable-box {
  height: 100%;
  position: relative;
  overflow: auto;

  > div {
    display: block;
    height: 100%;
  }
}

.component-wrapper {
  position: relative;
  // cursor: pointer;
}
.component-wrapper:not(.chosen) {
  &:hover {
    &:before {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      border: 1px dashed #2879ff;
      background: rgb(40 121 255 / 10%);
      z-index: 99;
    }
  }
}
.chosen {
  &:before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    border: 2px solid #2879ff;
    z-index: 99;
  }
}
.ghost {
  // 拖放移动中
  // outline-width: 0;
  min-height: 35px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 0 !important;
  // margin       : 3px 0;
  position: relative;

  &::before {
    content: "";
    height: 5px;
    width: 100%;
    background: #2879ff;
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
