<template>
  <div>
    <div slot="header"></div>
    <i-table
      ref="table"
      :border="true"
      :row-key="true"
      :columns="tableColumns"
      :data="dataClone"
      v-on="$listeners"
      v-bind="$attrs"
    >
      <div slot="footer">
        <Button
          :loading="loading"
          class="footre-button"
          v-if="newModel"
          type="dashed"
          long
          size="small"
          @click="addRow"
        >
          <template v-if="!loading">
            <Icon type="md-add" />
            新增
          </template>
          <template v-if="loading"> 新增处理中... </template>
        </Button>
      </div>
    </i-table>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "NewEditTable",
  props: {
    // draggable: {
    //   type: Boolean,
    //   default: false
    // },
    deleteConfirm: {
      type: Boolean,
      default: false
    },
    hasDelete: {
      type: Boolean,
      default: true
    },
    value: {
      type: Array,
      default: () => {
        return [];
      }
    },
    columns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    newModel: {
      type: Boolean,
      default: true
    },
    addClickBeforeChange: {
      type: Function,
      default: function () {}
    },
    formWrapper: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dataClone: this.value,
      loading: false,
      showTooltip: true,
      search: {}
    };
  },
  watch: {
    columns() {
      this.renderFilterTableColumns();
    },
    value: {
      handler(val) {
        this.dataClone = val;
        this.$emit("input", val);
      },
      deep: true
    }
  },
  computed: {
    tableColumns() {
      return this.columns.map(item => {
        let render = function () {};
        let renderHeader = function () {};
        const { validate = [] } = item;
        renderHeader = (h, params) => {
          const findRequired = validate.some(valid => {
            return valid.required;
          });
          if (findRequired) {
            return (
              <div class="required">
                {typeof item.renderHeader === "function"
                  ? item.renderHeader(h, params)
                  : item.title}
              </div>
            );
          } else {
            return <span>{item.title}</span>;
          }
        };
        if (item.key === "action") {
          render = (h, params) => {
            return this.renderButton(params, item);
          };
        } else {
          render = (h, params) => {
            return this.renderComponent(params, item);
          };
        }

        return {
          ...item,
          render,
          renderHeader
        };
      });
    }
  },

  methods: {
    addRow() {
      this.validate().then(flag => {
        if (!flag) {
          return false;
        }
        this.loading = true;
        const addClickBeforeChange = this.addClickBeforeChange();
        if (addClickBeforeChange && addClickBeforeChange.then) {
          addClickBeforeChange
            .then(() => {
              this.pushActiveRow();
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          this.pushActiveRow();
          this.loading = false;
        }
      });
    },
    exportData(params) {
      this.$refs.table.exportCsv(params);
    },
    bindEventParams(on, params) {
      const events = {};
      Object.keys(on).forEach(event => {
        events[event] = function () {
          on[event].call(this, ...arguments, params);
        };
      });
      return events;
    },
    buttonComponent(params, button) {
      const props = params.column.type;
      const event = {
        click: event => {
          if (button.key === "delete") {
            if (!this.deleteConfirm) {
              this.delete(params.index);
            }
          } else {
            params.column.on.hasOwnProperty(`${button.key}-click`) &&
              params.column.on[`${button.key}-click`](event, params);
          }
        }
      };

      const type = button.type ? button.type : "primary";

      return this.deleteConfirm && button.key === "delete" ? (
        <Poptip
          placement="top-end"
          width="165"
          confirm
          title="是否要删除此行？"
          on={{
            "on-ok": () => {
              this.delete(params.index);
            }
          }}
          class="button-margin"
        >
          <Button
            on={{
              ...event
            }}
            ghost
            size="small"
            type={button.key === "delete" ? "error" : type}
          >
            {button["value"]}
          </Button>
        </Poptip>
      ) : (
        <Button
          class="button-margin"
          on={{
            ...event
          }}
          ghost
          size="small"
          type={button.key === "delete" ? "error" : type}
        >
          {button["value"]}
        </Button>
      );
    },
    getTagName(type = "Input") {
      let tagName = type;
      // Object.keys(iview).forEach(name => {
      //   if (
      //     Object.prototype.toString.call(iview[name]) === "[object Object]"
      //   ) {
      //     if (name.toUpperCase() === type.toUpperCase()) {
      //       tagName = iview[name].name;
      //     }
      //   }
      // });
      return tagName;
    },
    getComponent(params, item) {
      const {
        type = "Input",
        on = {},
        options = [],
        option = {},
        props = {},
        scopedSlots = {},
        attrs = {},
        key,
        title,
        width,
        tooltip = true,
        ellipsis = true
      } = item;
      const { label = "descript", value = "code" } = option;
      let { labelInValue = true, placeholder } = props;
      const componentJSXProps = { ...this.item };
      delete componentJSXProps[scopedSlots];

      let events = {};
      Object.keys(on).forEach(event => {
        let oldEvent = on[event];
        events[event] = function () {
          oldEvent.call(this, ...arguments, params);
        };
      });
      const tagName = this.getTagName(type);
      if (!placeholder) {
        if (!["Input", "InputNumber"].includes(tagName)) {
          placeholder = "请选择" + title;
        } else {
          placeholder = "请输入" + title;
        }
      }
      return (
        <Tooltip
          max-width="200"
          theme="dark"
          transfer
          disabled={
            tooltip &&
            (!["p", "span", "div"].includes(type) || !this.showTooltip)
          }
        >
          <p
            slot="content"
            style="max-height:300px;overflow-y:auto;"
            domPropsInnerHTML={params.row[key]}
          ></p>
          <tagName
            {...{
              ...this.componentJSXProps,
              props: {
                clearable: true,
                filterable: true,
                labelInValue,
                "active-change": false,
                placeholder,
                ...props,
                transfer: true
              },
              ref: `${key}_${params.index}`,
              attrs: {
                ...attrs,
                value: ["p", "span", "div"].includes(type)
                  ? null
                  : params.row[key]
              },
              on: {
                input: value => {
                  params.row[key] = value;
                  this.dataClone[params.index] = params.row;
                  this.$emit("input", this.dataClone);
                },
                // mouseenter: () => {
                //   const $content = this.$refs[`${key}_${params.index}`];
                //   let range = document.createRange();
                //   range.setStart($content, 0);
                //   range.setEnd($content, $content.childNodes.length);
                //   const rangeWidth = range.getBoundingClientRect().width;
                //   this.showTooltip = rangeWidth > $content.offsetWidth;
                //   range = null;
                // },
                // mouseout: () => {
                //   this.showTooltip = false;
                // },
                ...events
              }
            }}
            class={"introduction-container"}
          >
            {params.row[key]}

            {tagName === "iSelect" && !scopedSlots.default
              ? options.map(item => {
                  return (
                    <i-option key={item[value]} value={item[value]}>
                      {item[label]}
                      {labelInValue ? `( ${item[value]})` : null}
                    </i-option>
                  );
                })
              : null}
            {Object.keys(scopedSlots).map(name => {
              return scopedSlots[name].call(this, h, params);
            })}
          </tagName>
        </Tooltip>
      );
    },
    renderComponent(params, item) {
      const { key, validate = [], render } = item;
      if (validate.length > 0) {
        return (
          <Form
            class={`form-optimization`}
            ref={`formValidate_${key}_${params.index}`}
            props={{ model: params.row }}
          >
            <FormItem
              props={{
                prop: key,
                rules: validate
              }}
            >
              {render ? render(h, params) : this.getComponent(params, item)}
            </FormItem>
          </Form>
        );
      } else {
        return render ? render(h, params) : this.getComponent(params, item);
      }
    },
    renderButton(params, item) {
      const buttons = [];
      const key = params.column.key;
      const { render } = item;
      if (render) {
        if (this.hasDelete) {
          buttons.push(
            this.buttonComponent(params, {
              key: "delete",
              value: "删除"
            })
          );
        }
        return (
          <div>
            {render(h, params)}
            {buttons}
          </div>
        );
      } else {
        const { type = [] } = item;
        type.map(button => {
          buttons.push(this.buttonComponent(params, button));
        });
        if (this.hasDelete) {
          buttons.push(
            this.buttonComponent(params, {
              key: "delete",
              value: "删除"
            })
          );
        }
        return buttons;
      }
    },
    renderInitAddButton() {
      const { columns } = this.$props;
      _.map(columns, item => {
        if (typeof item.props === "undefined") {
          this.$set(item, "props", {});
        }
        if (typeof item.on === "undefined") {
          this.$set(item, "on", {});
        }
        if (typeof item.options === "undefined") {
          this.$set(item, "options", []);
        }
        if (typeof item.option === "undefined") {
          this.$set(item, "option", {});
        }
        if (typeof item.nativeOn === "undefined") {
          this.$set(item, "nativeOn", {});
        }
        if (typeof item.validate === "undefined") {
          this.$set(item, "validate", []);
        }
      });
    },
    pushActiveRow() {
      this.dataClone.push(this.createRow());
      this.$emit("input", this.dataClone);
    },
    addDeleteButton(item) {
      item.type = typeof item.type !== "undefined" ? item.type : [];
      item.type.push({
        key: "delete",
        value: "删除"
      });
    },
    getTableData() {
      return this.dataClone;
    },
    delete(index) {
      this.dataClone.splice(index, 1);
      this.$emit("input", this.dataClone);
      this.deleteItemValidateError(index);
      this.$emit("deleted");
    },
    validate() {
      const { columns } = this.$props;
      let flag = true;
      return new Promise(async (resolve, reject) => {
        for (let i = 0; i < columns.length; i++) {
          const column = columns[i];
          if (column.key !== "action") {
            for (let j = 0; j < this.dataClone.length; j++) {
              if (
                typeof this.$refs[`formValidate_${column.key}_${j}`] !==
                "undefined"
              ) {
                const validFlag = await this.$refs[
                  `formValidate_${column.key}_${j}`
                ].validate();
                if (!validFlag) {
                  flag = validFlag;
                }
              }
            }
          }
        }
        resolve(flag);
      });
    },
    deleteItemValidateError(index) {
      // const { columns } = this.$props;
      // columns.forEach(column => {
      //   for (let i in column) {
      //     if (i.indexOf(`_${i}_${index}_validator_error`) > -1) {
      //       this.$delete(column, i);
      //     }
      //   }
      // });
    },
    createRow() {
      const { columns } = this.$props;
      const row = Object.create(null);
      columns
        .filter(column => column.key !== "action")
        .forEach(column => {
          const { attrs = { value: null } } = column;
          this.$set(row, column.key, attrs.value);
        });
      return row;
    },
    // 头部搜索功能

    renderFilterTableColumns() {
      this.columns.forEach((item, index) => {
        item = this.deepRenderFilter(item, item.key);
      });
    },
    deepRenderFilter(item, key) {
      if (item.hasOwnProperty("children") && item.children.length) {
        item.children.forEach((c, i) => {
          c.key = c.key ? c.key : key;
          item.children[i] = this.deepRenderFilter(c, c.key);
        });
        return item.children;
      } else {
        if (item.hasOwnProperty("customFilters")) {
          const { props, on, type } = item.customFilters;
          this.$set(this.search, key, "");

          const renderHeader = this.renderFilter(props, on, key, type);
          const children = [];
          children.push({ key, renderHeader });
          delete item.key;
          item.children = children;
        }
        return item;
      }
    },
    renderFilter(props = {}, on = {}, key, type = "Input") {
      return h => {
        return h("div", { style: { padding: "3px 0" } }, [
          h(
            type,
            {
              props: {
                value: this.search[key],
                ...props
              },
              on: {
                ...on,
                input: val => {
                  this.$set(this.search, key, val);
                }
              }
            },
            [
              h("Button", {
                slot: "append",
                attrs: {},
                props: {
                  size: "small",
                  icon: "ios-search"
                },
                on: {
                  click: () => {
                    this.$emit("on-search", { ...this.search });
                  }
                }
              })
            ]
          )
        ]);
      };
    },
    clearSearch() {
      for (let i in this.search) {
        this.search[i] = "";
      }
    }
  },
  created() {
    this.renderInitAddButton();
  },
  mounted() {
    this.renderFilterTableColumns();
  }
};
</script>
<style lang="less" scoped>
.buttons {
  .button {
    margin-right: 10px;
    cursor: pointer;
    color: #4a90e2;
  }
}
.ivu-table .error td {
  background-color: #ff6600;
  color: #fff;
}
.filterHeader {
  border: none;
}
/deep/ .ivu-table {
  .ivu-table-footer {
    height: auto;
    line-height: inherit;
  }
  .footre-button {
    height: 35px;
    line-height: 32px;
  }
}

/deep/ .ivu-table-cell {
  line-height: inherit;
  .ivu-form-item {
    margin-bottom: 0;
  }
}
/deep/ .ivu-tooltip {
  width: 100%;
  display: flex;
  align-items: center;
}
/deep/.required::before {
  content: "*";
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-family: SimSun;
  font-size: 12px;
  color: #ed4014;
}

// /deep/ .ivu-form-item-error-tip {
//   top: 3px;
//   padding-top: 0;
//   left: 9px;
//   z-index: 3;
//   height: calc(100% - 3px);
//   line-height: 2.6;
//   border-radius: 4px;
//   pointer-events: none;
// }
.button-margin {
  margin-right: 10px;
}
.button-margin:last-child {
  margin-right: 0;
}
/deep/ .ivu-form-item-error {
  .ivu-input,
  .ivu-select-input,
  .ivu-input-number-input {
    &:focus {
      position: relative;
      z-index: 2;
      &::placeholder {
        visibility: hidden;
        opacity: 0 !important;
      }
    }
    &::placeholder {
      visibility: visible;
      opacity: 1;
      color: #ed4014;
    }
  }
  .ivu-select-input {
    &:focus {
      height: 21px;
      background: #fff;
      border-radius: 4px;
    }
    & + i {
      z-index: 3;
    }
  }
  .ivu-input {
    .ivu-icon {
      line-height: 24px;
    }
  }
}
/deep/.introduction-container {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  // > *:first-child {
  //   width: 100%;
  //   height: 32px;
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   white-space: nowrap;
  // }
  // > *:not(:first-child) {
  //   display: none;
  // }
}
// form.ivu-form.form-optimization
//   /deep/
//   .ivu-input-group
//   + .ivu-form-item-error-tip {
//   top: 5px;
//   padding-top: 0;
//   left: 9px;
//   z-index: 3;
//   height: calc(100% - 2px);
//   line-height: 2;
//   border-radius: 4px;
//   pointer-events: none;
// }
// /deep/ .ivu-input-group {
//   top: 4px;
// }
// .multiple-select-table .ivu-table /deep/ .ivu-select-input {
//   line-height: 22px;
// }
// .ivu-table-wrapper .ivu-table .ivu-select-multiple {
//   line-height: inherit;
//   height: inherit;
// }
// /deep/ .ivu-input-icon {
//   width: 32px;
//   height: 24px;
//   line-height: 24px;
//   font-size: 12px;
// }
</style>
