<script>
import draggable from "vuedraggable";
export default {
  name: "LayoutDraggable",
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
  methods: {
    handleSelectItem(e, component) {
      console.log("child layout component", component.id);
      this.$emit("on-select-item", { ...component, render: undefined });
    },
    handlerBorderSelecting(info) {
      this.$emit("on-border-selecting", info);
    },
    handlerBorderDetecting(info) {
      this.$emit("on-border-detecting", info);
    }
  },
  mounted() {},
  render(h) {
    return (
      <draggable
        vModel={this.canvasData}
        group="components"
        ghostClass="ghost"
        chosenClass="chosen"
        handle=".mover"
        animation="200"
        class="draggable-box"
        draggable=".draggable"
        filter=".emptyContainer"
        tag="div"
        on={{
          end: e => {
            console.log("end", e);
            console.log(this.canvasData);
          },
          clone: e => {
            console.log("clone", e);
          },
          add: e => {
            console.log(
              "add",
              e,
              // this.canvasData,
              e.originalEvent.currentTarget
            );
            this.$nextTick(() => {
              console.log(e.originalEvent.currentTarget);
            });
            // this.handlerBorderSelecting(
            //   e.originalEvent.currentTarget.getBoundingClientRect()
            // );
          }
        }}
      >
        <transition-group tag="div" class="transition-container">
          {this.canvasData.map((component, index) => {
            return (
              <div
                class={[
                  "component-wrapper",
                  "draggable",
                  "mover",
                  { chosen: component.id === this.selectItem.id }
                ]}
                key={component.id + "component"}
                on={{
                  click: e => {
                    console.log(e);
                    console.log("e.target", e.target.getBoundingClientRect());
                    console.log(
                      "e.currentTarget",
                      e.currentTarget.getBoundingClientRect()
                    );
                    e.stopPropagation();
                    this.handlerBorderSelecting(
                      e.currentTarget.getBoundingClientRect()
                    );
                    this.handleSelectItem(e, component);
                  },
                  mouseover: e => {
                    if (component.id === this.selectItem.id) {
                      return false;
                    }
                    // console.log(e);
                    // console.log("e.target", e.target.getBoundingClientRect());
                    // console.log(
                    //   "e.currentTarget",
                    //   e.currentTarget.getBoundingClientRect()
                    // );
                    this.handlerBorderDetecting(
                      e.currentTarget.getBoundingClientRect()
                    );
                  },
                  mouseout: e => {
                    this.handlerBorderDetecting({
                      width: 0,
                      height: 0,
                      translateX: 0,
                      translateY: 0
                    });
                  }
                }}
              >
                {component.render(h, {
                  props: {
                    value: component.children || [],
                    selectItem: this.selectItem
                  },
                  on: {
                    input: value => {
                      component.children = value;
                    }
                  }
                })}
                <div style="position: absolute;bottom: 0;right: 5px;background: #f3f4f5;">
                  {component.id}
                </div>
              </div>
            );
          })}
        </transition-group>
      </draggable>
    );
  }
};
</script>
<style lang="less" scoped>
.draggable-box {
  .transition-container {
    height: 100%;
    min-height: 100px;
    border: 1px dashed #a7b1bd;
    .empty-container {
      height: 100%;
      padding: 20px;
      &-text {
        display: flex;
        justify-content: center;
        height: 100%;
        min-height: 100px;
        background: #f0f0f0;
        align-items: center;
        border: 1px dashed #a7b1bd;
      }
    }
    .component-wrapper {
      position: relative;
      // &:before {
      //   content: "";
      //   position: absolute;
      //   left: 0;
      //   right: 0;
      //   bottom: 0;
      //   top: 0;
      //   z-index: 99;
      // }
    }
  }
}
</style>
