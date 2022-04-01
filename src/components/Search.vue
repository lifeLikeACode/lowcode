<template>
  <auto-form
    ref="form"
    :fields="filterFields"
    v-model="form"
    :row="row + 1"
    :label-position="labelPosition"
    :label-width="labelWidth"
    :label-colon="labelColon"
    :scoped="innerScoped"
  ></auto-form>
</template>

<script>
const action = "_action";

export default {
  name: "Search",
  props: {
    loading: {
      type: Boolean
    },
    fields: {
      type: Array,
      default: () => {
        return [];
      }
    },
    ["label-colon"]: {
      type: Boolean,
      default: true
    },
    ["label-position"]: {
      type: String,
      default: "right"
    },
    ["label-width"]: {
      type: Number,
      default: 100
    },
    value: {
      type: Object,
      default: () => {
        return {};
      }
    },
    row: {
      type: Number,
      default: 5
    },
    scoped: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      expand: true,
      originalExpression: null
    };
  },
  computed: {
    complierFields() {
      return this.fields.filter(item => {
        const { expression } = this.originalExpression.get(item.key) || {};
        let form = this.form;
        let $scoped = this.innerScoped;
        const result = eval(expression);
        return result ? item : false;
      });
    },
    complierFieldsLength() {
      return this.fields.reduce((sum, item) => {
        if (item.key === "_action") {
          return sum;
        }
        const { num } = this.originalExpression.get(item.key) || {};
        let form = this.form;

        if (typeof num === "number") {
        } else if (num.match(/\{\{(.*)\}\}/)) {
          num = num.match(/\{\{(.*)\}\}/)[1];
          num = eval(num);
        }
        sum += num;
        return sum;
      }, 0);
    },
    filterFields() {
      this.complierFields.forEach((item, index) => {
        const { expression } = this.originalExpression.get(item.key) || {};
        if (this.expand) {
          item.show = `{{${expression}}}`;
        } else {
          const isShow = index < this.row || item.key === action;
          item.show = `{{${expression} && ${isShow}}}`;
        }
      });
      return this.fields;
    },
    text() {
      return !this.expand ? "展开" : "收起";
    },
    type() {
      return !this.expand ? "ios-arrow-down" : "ios-arrow-up";
    },
    form: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    innerScoped() {
      return {
        expand: this.expand,
        filterFieldsSize: this.complierFieldsLength,
        row: this.row,
        ...this.scoped
      };
    }
  },
  methods: {
    expandHandler() {
      this.expand = !this.expand;
    },
    resetFields() {
      this.$refs.form.resetFields();
    },
    search() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit("search");
        }
      });
    },
    createAction() {
      this.originalExpression = this.fields.reduce((map, item) => {
        const expression = item.show
          ? item.show.match(/\{\{(.*)\}\}/)[1]
          : true;
        map.set(item.key, { expression, num: item.num || 1 });
        return map;
      }, new Map());
      if (this.fields.find(item => item.key === action)) {
        return false;
      }
      this.fields.push({
        key: action,
        type: "buttonGroups",
        props: {
          labelWidth: 0
        },
        num: "{{$scoped.expand ? ($scoped.row + 1) - (($scoped.filterFieldsSize) % ($scoped.row + 1)) : 1}}",
        label: "",
        render: () => {
          return (
            <div style="text-align: right;">
              <Button
                on={{
                  click: () => {
                    this.resetFields();
                  }
                }}
                icon="md-refresh"
                type="default"
                disabled={this.loading}
              >
                重置
              </Button>
              <Button
                class="ivu-ml-8"
                icon="ios-search"
                type="primary"
                on={{
                  click: () => {
                    this.search();
                  }
                }}
                loading={this.loading}
              >
                查询
              </Button>
              {this.row < this.complierFields.length ? (
                <a class="ivu-ml-8" on={{ click: this.expandHandler }}>
                  {this.text}
                  <Icon type={this.type}></Icon>
                </a>
              ) : null}
            </div>
          );
        }
      });
    }
  },

  watch: {
    fields: {
      handler() {
        this.createAction();
      }
    }
  },

  created() {
    console.log("created");
    this.createAction();
  },
  activated() {
    console.log("console.log('created')");
  }
};
</script>

<style lang="less" scoped>
.ivu-ml-8 {
  margin-left: 8px;
}
// /deep/ .form-item-buttonGroups {
//   div {
//     line-height: 82px;
//   }
// }
</style>
