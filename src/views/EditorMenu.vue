<template>
  <draggable
    v-model="components"
    ghostClass="ghost"
    chosenClass="chosen"
    filter=".forbid"
    animation="300"
    :sort="false"
    :move="onMove"
    class="draggable-box"
    tag="div"
    :group="{ name: 'components', pull: 'clone' }"
    @choose="chooseComponent"
    @start="start"
    @end="end"
    @add="add"
    @clone="clone"
  >
    <transition-group tag="div" style="display: flex; flex-wrap: wrap">
      <div
        class="component-wrapper"
        v-for="component in components"
        :key="component.type"
      >
        <Icon color="#2D8CF0" size="14" :type="component.icon" />
        <span>{{ component.label }}</span>
      </div>
    </transition-group>
  </draggable>
</template>

<script>
import draggable from "vuedraggable";
export default {
  components: { draggable },
  props: {
    components: {
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
    start(e) {
      this.components[e.oldIndex] = {
        ...this.components[e.oldIndex],
        id: this.components[e.oldIndex].type + "_" + new Date().getTime()
      };
      console.log(this.components);
    },
    onMove(e, originalEvent) {
      // console.log("move", e, originalEvent);
    },
    chooseComponent(e) {
      const { oldIndex } = e;
      this.components[oldIndex] = {
        ...this.components[oldIndex],
        id: this.components[oldIndex].type + "_" + new Date().getTime()
      };
      console.log(this.components);
      console.log("chooseComponent", e);
    },
    end(e) {
      console.log("end", e);
    },
    add(e) {
      console.log("add", e);
    },

    clone(e) {
      console.log("clone", e.item._underlying_vm_);
    }
  }
};
</script>

<style lang="less" scoped>
.component-wrapper {
  cursor: grab;
  display: flex;
  align-items: center;
  height: 36px;
  width: 140px;
  padding: 0 8px;
  margin: 8px 0 0 8px;
  background: #ffffff;
  border: 1px solid #e5e6e8;
  border-radius: 6px;
  background-color: #ffffff;
  user-select: none;
  i {
    margin-right: 8px;
  }
  span {
    font-size: 12px;
  }
  &:hover {
    border: 1px dashed #2d8cf0;
    span {
      color: #2d8cf0;
    }
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
