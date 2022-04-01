<template>
  <div class="border-selecting-container">
    <div class="border-selecting" :style="borderSelectingStyle"></div>
    <div class="border-detecting" :style="borderDetectingStyle"></div>
  </div>
</template>

<script>
export default {
  props: {
    selecting: {
      type: Object,
      default: () => {
        return {
          width: 0,
          height: 0,
          translateX: 0,
          translateY: 0
        };
      }
    },
    detecting: {
      type: Object,
      default: () => {
        return {
          width: 0,
          height: 0,
          translateX: 0,
          translateY: 0
        };
      }
    }
  },
  computed: {
    borderDetectingStyle() {
      const { width, height, translateX, translateY } = this.detecting;
      return {
        width: width + "px",
        height: height + "px",
        transform: `translate3d(${translateX - 316}px,${translateY - 16}px,0)`
      };
    },
    borderSelectingStyle() {
      const { width, height, translateX, translateY } = this.selecting;
      return {
        width: width + "px",
        height: height + "px",
        transform: `translate3d(${translateX - 316}px,${translateY - 16}px,0)`
      };
    }
  }
};
</script>

<style lang="less" scoped>
.border-selecting-container {
  position: absolute;
  top: 16px;
  bottom: 16px;
  left: 16px;
  width: 100%;
  pointer-events: none;
  z-index: 8888;
  .border-selecting {
    position: absolute;
    pointer-events: none;
    border: 2px solid #2879ff;
    will-change: transform, width, height;
  }
  .border-detecting {
    position: absolute;
    pointer-events: none;
    background: rgb(40 121 255 / 10%);
    border: 1px dashed #2879ff;
    will-change: transform, width, height;
  }
}
</style>
