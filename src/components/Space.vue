<script>
export default {
  name: "Space",
  props: {
    align: {
      type: String,
      default: "flex-start",
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return (
          ["flex-start", "flex-end", "center", "baseline"].indexOf(value) !== -1
        );
      }
    },
    direction: {
      type: String,
      default: "horizontal",
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ["horizontal", "vertical"].indexOf(value) !== -1;
      }
    },
    size: {
      type: [String, Array],
      default: "small",
      validator: value => {
        if (typeof value === "string") {
          return ["small", "middle", "large"].indexOf(value) !== -1;
        }
        return true;
      }
    },
    wrap: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    spaceStyle() {
      return {
        "flex-wrap": this.wrap ? "wrap" : "nowrap",
        "align-items": this.align,
        "flex-direction": this.direction === "horizontal" ? "row" : "column"
      };
    },
    spaceItemStyle() {
      // 如果是垂直方向，最后一个元素的paddingBottom不设置
      // 如果是平行方向，最后一个元素的marginRight设置
      return function (index) {
        let marginRight = 0;
        let paddingBottom = 0;
        if (typeof this.size === "string") {
          const map = {
            small: 8,
            middle: 16,
            large: 24
          };
          if (this.direction === "vertical") {
            paddingBottom = map[this.size] + "px";
          } else {
            marginRight = map[this.size] + "px";
          }
        } else {
          marginRight = this.size[0] + "px";
          paddingBottom = this.size[1] + "px";
        }
        if (
          this.direction === "vertical" &&
          this.$slots.default.length - 1 === index
        ) {
          paddingBottom = null;
        }
        return {
          "margin-right":
            this.direction === "horizontal" &&
            this.$slots.default.length - 1 !== index &&
            marginRight,
          "padding-bottom": paddingBottom
        };
      };
    }
  },
  render(h) {
    const extractedChildren = [];
    if (!this.$slots.default.length) return false;
    this.$slots.default.forEach((child, index) => {
      const cVnode = (
        <div style={this.spaceItemStyle(index)} class="space_item">
          {child}
        </div>
      );
      extractedChildren.push(cVnode);
    });
    return (
      <div class="space" style={this.spaceStyle}>
        {extractedChildren.map(child => {
          return child;
        })}
      </div>
    );
  }
};
</script>

<style lang="less" scoped>
.space {
  display: flex;
}
.space_item {
  display: inline-flex;
}
</style>
