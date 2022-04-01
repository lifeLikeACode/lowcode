<script>
// 1.form的值更新
// 2.dep和immediate重新编译更新
// 3.immediate再去判断是否执行请求数据
const iviewMap = {
  Circle: "iCircle",
  Switch: "iSwitch",
  Affix: "Affix",
  Alert: "Alert",
  Anchor: "Anchor",
  AnchorLink: "AnchorLink",
  AutoComplete: "AutoComplete",
  Avatar: "Avatar",
  BackTop: "BackTop",
  Badge: "Badge",
  Breadcrumb: "Breadcrumb",
  BreadcrumbItem: "BreadcrumbItem",
  Button: "Button",
  ButtonGroup: "ButtonGroup",
  Card: "Card",
  Carousel: "Carousel",
  CarouselItem: "CarouselItem",
  Cascader: "Cascader",
  Cell: "Cell",
  CellGroup: "CellGroup",
  Checkbox: "Checkbox",
  CheckboxGroup: "CheckboxGroup",
  Col: "iCol",
  Collapse: "Collapse",
  ColorPicker: "ColorPicker",
  Content: "Content",
  DatePicker: "DatePicker",
  Divider: "Divider",
  Drawer: "Drawer",
  Dropdown: "Dropdown",
  DropdownItem: "DropdownItem",
  DropdownMenu: "DropdownMenu",
  Footer: "Footer",
  Form: "iForm",
  FormItem: "FormItem",
  Header: "Header",
  Icon: "Icon",
  Input: "Input",
  InputNumber: "InputNumber",
  Scroll: "Scroll",
  Sider: "Sider",
  Split: "Split",
  Submenu: "Submenu",
  Layout: "Layout",
  List: "List",
  ListItem: "ListItem",
  ListItemMeta: "ListItemMeta",
  LoadingBar: "LoadingBar",
  Menu: "Menu",
  MenuGroup: "MenuGroup",
  MenuItem: "MenuItem",
  Message: "Message",
  Modal: "Modal",
  Notice: "Notice",
  Option: "iOption",
  OptionGroup: "OptionGroup",
  Page: "Page",
  Panel: "Panel",
  Poptip: "Poptip",
  Progress: "Progress",
  Radio: "Radio",
  RadioGroup: "RadioGroup",
  Rate: "Rate",
  Row: "Row",
  Select: "iSelect",
  Slider: "Slider",
  Spin: "Spin",
  Step: "Step",
  Steps: "Steps",
  Table: "Table",
  Tabs: "Tabs",
  TabPane: "TabPane",
  Tag: "Tag",
  Time: "Time",
  Timeline: "Timeline",
  TimelineItem: "TimelineItem",
  TimePicker: "TimePicker",
  Tooltip: "Tooltip",
  Transfer: "Transfer",
  Tree: "Tree",
  Upload: "Upload"
};

export default {
  name: "AutoForm",
  props: {
    scoped: {
      type: Object,
      default: () => {}
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
      default: 120
    },
    value: {
      //表单导出源数据
      type: Object,
      default: () => {
        return {};
      },
      required: true
    },
    fields: {
      //表单数据配置项
      type: Array,
      required: true
    },
    row: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      resetting: false,
      destroyed: false,
      validateErrorList: [],
      autoFormList: [],
      deps: new Map(),
      loadDatas: new Map(),
      loadedMap: new Map(),
      loadedDataMap: new Map(),
      loadingMap: new Map(),
      immediateLoadData: new Map(),
      options: {},
      userOpen: new Map(),
      watcherMap: new Map(),
      descriptKeyMap: new Map(),
      needUpdateQueue: new Set(),
      defaultValue: {}
    };
  },
  computed: {
    formStyle() {
      return {
        "grid-template-columns": `repeat(${this.row},calc(${
          100 / this.row + "%"
        } - 6px))`,
        "grid-gap": "0 6px"
      };
    },
    // labelWidth() {
    //   return this["label-width"] || null;
    // },
    submitForm: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    fieldsMap() {
      return this.fields.reduce((map, item, index) => {
        map[item.key] = index;
        return map;
      }, {});
    }
  },
  methods: {
    // 给需要描述的字段赋值
    setDescriptValue(descriptKey, option, key) {
      const findItem = option.find(item => item.value === this.submitForm[key]);
      if (findItem) {
        this.submitForm[descriptKey] = findItem.label;
      }
    },
    getItem(prop) {
      return this.$refs[prop];
    },
    unbindWatch() {
      this.watcherMap.forEach((unwatch, key) => {
        unwatch && unwatch();
      });
    },
    resetFields() {
      // this.unbindWatch();
      // this.watcherMap.clear();
      if (this.$refs.autoForm) {
        this.resetting = true;
        this.$refs.autoForm.resetFields();
        this.$emit("input", this.submitForm);
        this.$nextTick(() => {
          this.resetting = false;
          this.loadedMap.clear();
        });
      }
    },
    validateScroll() {
      const prop = this.validateErrorList.filter(item => item).shift();
      const instance = Array.isArray(this.getItem(prop))
        ? this.getItem(prop)[0]
        : this.getItem(prop);
      this.validateErrorList = [];
      const { top } = instance.$el.getBoundingClientRect();
      if (instance.$options._componentTag === "Input" && instance.focus) {
        instance.focus();
      } else if (top > window.innerHeight) {
        window.scrollTo(0, top - window.innerHeight / 2);
      } else {
        window.scrollTo(0, top / 2);
      }
    },
    validate(callback) {
      // 使用display："none" 控制field是否显示，只有使用display的方式resetFields才能正确的重置字段。但是也导致验证的时候隐藏的节点也会进行validate ，此处自定义validate，过滤掉隐藏的节点
      function fieldsVisible(fields, map) {
        return this.compilerFields(fields).reduce((map, item) => {
          map.set(
            item.key,
            typeof item.show === "undefined" ? true : item.show
          );
          item.children &&
            item.children.length &&
            fieldsVisible.call(this, item.children, map);
          return map;
        }, map);
      }
      const fieldsVisibleMap = fieldsVisible.call(this, this.fields, new Map());
      const fields = this.$refs.autoForm.fields;
      const filterFields = fields.filter(item => {
        return fieldsVisibleMap.get(item.prop);
      });
      return new Promise(resolve => {
        let valid = true;
        let count = 0;
        // fields 为空需要返回promise
        if (filterFields.length === 0) {
          resolve(valid);
          if (typeof callback === "function") {
            callback(valid);
          }
        }
        filterFields.forEach(field => {
          field.validate("", errors => {
            if (errors) {
              valid = false;
            }
            if (++count === filterFields.length) {
              // all finish
              resolve(valid);
              if (typeof callback === "function") {
                callback(valid);
              }
            }
          });
        });
      });
      // filterFields.forEach(field => {
      //   field.validate("", error => {
      //   });
      // });
      // const valid = await this.$refs.autoForm.validate(fn);
      // if (!valid) {
      //   this.validateScroll();
      // }
      // return valid;
    },
    validated(prop, status, error) {
      if (!status) {
        if (!this.validateErrorList.includes(prop)) {
          this.validateErrorList[this.fieldsMap[prop]] = prop;
        }
      } else {
        const findIndex = this.validateErrorList.indexOf(prop);
        if (findIndex > -1) {
          this.validateErrorList.splice(findIndex, 1);
        }
      }
      this.$emit("on-validate", prop, status, error);
    },
    validateField(prop, callback) {
      this.$refs.autoForm.validateField(prop, callback);
    },
    createNullValidator(fields) {
      const hasRequired = fields.some(item => {
        if (typeof item.validators !== "undefined") {
          if (Array.isArray(item.validators)) {
            return item.validators.some(valid => valid.required);
          } else if (typeof item.validators === "object") {
            return item.validators.required;
          }
        } else {
          return false;
        }
      });
      return [
        {
          required: hasRequired,
          validator: (rule, value, callback) => {
            callback();
          },
          trigger: ""
        }
      ];
    },
    validatorsHandler(validators = [], type, label) {
      let innerValidators = [];

      innerValidators = innerValidators.concat(validators);
      return innerValidators.map(valid => {
        if (valid.hasOwnProperty("validator")) {
          delete valid.message;
          return {
            ...valid,
            required: valid.required
          };
        } else {
          let message = valid.hasOwnProperty("message")
            ? valid.message
            : type === "Input" || type === "InputNumber"
            ? `请输入${label}`
            : `请选择${label}`;
          return {
            ...valid,
            type: valid.type,
            message,
            required: valid.required
          };
        }
      });
    },
    compileExpression(expressionString) {
      if (/\{\{([\s\S]+)\}\}/.test(expressionString)) {
        const form = this.submitForm;
        const options = this.options;

        const expression = expressionString.replace(
          /\{\{([\s\S]+)\}\}/,
          (...[, $1]) => {
            return $1;
          }
        );
        return this.getCompileValue(expression, {
          form,
          options,
          ...this.scoped
        });
      }
      return expressionString;
    },
    getCompileValue(expression, { form, ...args }) {
      form = form;
      const $scoped = {
        ...args
      };
      try {
        return eval(expression);
      } catch (error) {
        console.error(("expression is error: ", expression));
      }
    },
    setValue(key, value) {
      let keys = [];
      let target = null;
      key.replace(/(\w+)\.?/g, (content, $1) => {
        keys.push($1);
      });
      if (keys.length > 0) {
        target = this.submitForm;
        while (keys.length > 1) {
          target = target[keys.shift()];
        }
        target[keys.shift()] = value;
        this.$emit("input", this.submitForm);
      }
    },
    getValue(key = "") {
      let keys = [];
      let target = null;

      key.replace(/(\w+)\.?/g, (content, $1) => {
        keys.push($1);
      });
      if (keys.length > 0) {
        target = this.submitForm;
        while (keys.length > 0) {
          target = target[keys.shift()];
        }
      }

      return target;
    },
    resetValue(key) {
      this.$refs[`form${key}`] && this.$refs[`form${key}`].resetField();
    },
    itemStyle(num = 1, children, show) {
      let flex = {};
      let visibleStyle = {};
      if (children) {
        // flex = { display: "flex", "flex-wrap": "wrap" };
      }
      if (!show) {
        visibleStyle = { display: "none" };
      }
      const width = {
        "grid-column-start": `span ${num}`
      };

      return { ...width, ...flex, ...visibleStyle };
    },
    itemStyleForParent(num = 1, children) {
      let flex = {};
      if (children) {
        let percent = 100 / num;
        flex = {
          display: "grid",
          "grid-template-columns": `repeat(${num}, ${percent}%)`
        };
      }

      return { ...flex };
    },

    addDep(deps, key) {
      // if (!this.deps.has(key)) {
      this.deps.set(key, deps);
      // }
    },
    getLoadData(loadData, effectKey) {
      if (loadData) {
        let promise = loadData(this.submitForm);
        if (promise && !promise.then) {
          promise = Promise.resolve(promise);
        }
        this.loadingMap.set(effectKey, true);
        this.loadedMap.set(effectKey, true);
        return promise.then(data => {
          const descriptKey = this.descriptKeyMap.get(effectKey);
          if (descriptKey) {
            this.setDescriptValue(descriptKey, data, effectKey);
          }
          this.$set(this.options, effectKey, data);
          this.loadingMap.set(effectKey, false);
          return data;
        });
      }
    },
    loadData(key) {
      const loadData = this.loadDatas.get(key);
      return this.getLoadData(loadData, key);
    },
    notify(key, clear = true, immediate = false) {
      this.deps.forEach((values, effectKey) => {
        if (values.includes(key)) {
          // 设置数据为重新请求状态
          this.loadedMap.set(effectKey, false);
          if (clear) {
            this.$set(this.options, effectKey, []);
            this.resetValue(effectKey);
          }
          if (this.immediateLoadData.get(effectKey)) {
            if (immediate) {
              this.loadData(effectKey);
            } else {
              this.needUpdateQueue.add(effectKey);
            }
          }
          // 递归调用当前依赖项的依赖项
          this.$nextTick(() => {
            this.notify(effectKey, clear);
          });
        }
      });
    },
    setUserOpen(key, value) {
      this.userOpen.set(key, value);
    },
    watchDep(key) {
      const unwatch = this.$watch(
        `submitForm.${key}`,
        function (val, oldVal) {
          if (!val && !oldVal) {
            return false;
          }
          if (this.resetting) {
            return false;
          }

          const values = Array.isArray(val) ? val.length : val;
          if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
            if (!this.userOpen.get(key) && !this.loadedMap.get(key)) {
              if (this.immediateLoadData.get(key) || values) {
                const fn = this.loadData(key);
                if (fn && fn.then) {
                  fn.then(data => {
                    this.notify(key, false, true);
                  });
                } else {
                  this.notify(key, false, true);
                }
              }
            }
          }
        },
        {
          immediate: true
        }
      );
      this.watcherMap.set(key, unwatch);
    },
    renderSelectOption({ labelInValue, key, option }) {
      const map = {};
      return this.options[key]
        ? this.options[key]
            .filter(item => {
              if (!map[item.value]) {
                map[item.value] = true;
                return item;
              }
            })
            .map(value => {
              return (
                <i-option
                  key={value[option.code || "value"]}
                  value={value[option.code || "value"]}
                >
                  {value[option.label || "label"]}

                  {labelInValue ? `(${value[option.code || "value"]})` : null}
                </i-option>
              );
            })
        : null;
    },
    renderCheckboxOption({ key, option }) {
      return this.options[key]
        ? this.options[key].map(value => {
            return (
              <Checkbox
                key={value[option.code || "value"]}
                label={value[option.code || "value"]}
              >
                {value[option.label || "label"]}
              </Checkbox>
            );
          })
        : null;
    },
    renderRadioOption({ key, option, props }) {
      return this.options[key]
        ? this.options[key].map(item => {
            return (
              <Radio
                disabled={item.disabled}
                key={item[option.code || "value"]}
                label={item[option.code || "value"]}
              >
                {item[option.label || "label"]}
              </Radio>
            );
          })
        : null;
    },
    renderForm(fields) {
      const { validated, labelWidth, submitForm, labelColon, labelPosition } =
        this;
      return (
        <Form
          class="form"
          style={this.formStyle}
          ref="autoForm"
          inline
          labelWidth={labelWidth}
          labelPosition={labelPosition}
          props={{
            model: submitForm,
            "label-colon": labelColon
          }}
          nativeOn={{
            submit: e => {
              e.preventDefault();
            }
          }}
          on={{
            "on-validate": (prop, status, error) => {
              validated(prop, status, error);
            }
          }}
        >
          {this.renderFormItem(fields)}
        </Form>
      );
    },
    renderFormItem(fields) {
      const compilerFields = this.compilerFields(fields);
      return compilerFields.map(item => {
        let {
          type = "Input",
          on = {},
          option = {},
          props = {},
          render,
          scopedSlots = {},
          attrs = {},
          label,
          key,
          validators = [],
          ref,
          loadData = null,
          deps = [],
          num,
          directives = [],
          immediate,
          children = [],
          loadedData,
          show = true,
          afterSlot,
          descriptKey
        } = item;
        if (children.length > 0) {
          validators = this.createNullValidator(children);
        }
        this.descriptKeyMap.set(key, descriptKey);
        this.addDep(deps, key);
        this.immediateLoadData.set(key, immediate);
        this.loadedDataMap.set(key, { deps, loadedData });
        // if (this.immediateLoadData.has(key) && !this.loadedMap.get(key)) {
        //   this.needUpdateQueue.add(key);
        // }
        if (typeof attrs.value !== "undefined" && !this.watcherMap.has(key)) {
          // 首次加载数据的时候才去赋值
          this.submitForm[key] = attrs.value;
        }

        Object.keys(iviewMap).forEach(name => {
          if (Object.prototype.toString.call(name) === "[object Object]") {
            if (name.toUpperCase() === type.toUpperCase()) {
              type = name;
            }
          }
        });
        this.loadDatas.set(key, loadData);
        if (!this.watcherMap.has(key)) {
          this.watchDep(key);
        }
        const componentJSXProps = { ...item };

        delete componentJSXProps["scopedSlots"];
        if (this.needUpdateQueue.has(key)) {
          this.loadData(key);
          this.needUpdateQueue.delete(key);
        }
        return (
          <FormItem
            label-width={
              typeof props.labelWidth !== "undefined"
                ? props.labelWidth
                : this.labelWidth
            }
            style={this.itemStyle(num, children.length > 0, show)}
            label={
              typeof label !== "undefined" && typeof label !== "function"
                ? label
                : ""
            }
            class={[`form-item-${type}`]}
            prop={key}
            key={key}
            ref={`form${key}`}
            rules={this.validatorsHandler(validators, type, label)}
            show-message={props["show-message"]}
          >
            {typeof label === "function" && label(h)}
            {render ? (
              render.call(this, h, { ...item })
            ) : children.length ? (
              <div
                style={this.itemStyleForParent(num, children.length > 0, show)}
              >
                {this.renderFormItem(children)}
              </div>
            ) : (
              this.renderContent({
                tagName: type,
                label,
                props,
                directives,
                ref,
                key,
                attrs,
                loadData,
                on,
                scopedSlots,
                option,
                componentJSXProps,
                afterSlot
              })
            )}
          </FormItem>
        );
      });
    },
    renderContent({
      tagName,
      label,
      props,
      directives,
      ref,
      key,
      attrs,
      loadData,
      on,
      scopedSlots,
      option,
      componentJSXProps,
      afterSlot = null
    }) {
      const { labelInValue = true } = props;

      const value = this.getValue(key, attrs);

      return (
        <div>
          <tagName
            {...{
              ...componentJSXProps,
              props: {
                placeholder: typeof label !== "function" && label,

                clearable: true,
                filterable: true,
                "active-change": false,
                maxlength: props.type === "textarea" ? 256 : 32,
                min: 0,
                max: 99999999,
                transfer: true,
                data: this.options[key],
                ...props,
                labelInValue: true,
                value,
                "not-found-text": this.loadingMap.get(key)
                  ? "数据加载中"
                  : "无匹配数据"
              },
              directives,
              ref: ref || key,
              attrs: {
                ...attrs,
                value
              },
              on: {
                input: value => {
                  console.log(value);
                  this.setValue(key, value);
                },

                ...on,
                "on-focus": (...args) => {
                  this.setUserOpen(key, true);
                  if (on["on-focus"]) {
                    on["on-focus"].call(this, ...args);
                  }
                },
                "on-blur": (...args) => {
                  this.setUserOpen(key, false);
                  if (on["on-blur"]) {
                    on["on-blur"].call(this, ...args);
                  }
                },
                "on-open-change": boolean => {
                  if (boolean) {
                    this.setUserOpen(key, true);
                    if (!this.loadedMap.get(key)) {
                      this.getLoadData(loadData, key);
                    }
                  } else {
                    this.setUserOpen(key, false);
                  }
                  if (on["on-open-change"]) {
                    on["on-open-change"].call(this, boolean);
                  }
                },
                "on-clear": () => {
                  this.setUserOpen(key, true);
                  this.$nextTick(() => {
                    this.setUserOpen(key, false);
                  });
                },
                // 仅用户操作点击会触发
                "on-change": (...args) => {
                  let item = [];

                  if (tagName === "Select") {
                    if (this.userOpen.get(key)) {
                      try {
                        if (this.options[key]) {
                          item = this.options[key].filter(
                            item =>
                              this.submitForm[key] &&
                              this.submitForm[key].includes(item.value)
                          );
                        }
                      } catch (error) {
                        console.log(error);
                      }
                      const descriptKey = this.descriptKeyMap.get(key);
                      if (descriptKey) {
                        this.setDescriptValue(
                          descriptKey,
                          this.options[key],
                          key
                        );
                      }
                      this.$emit("form-value-change", {
                        key,
                        ...arguments,
                        item,
                        option: this.options[key]
                      });
                      // nextTick让notify晚于render执行，以此解决immediate变更后不更新的问题
                      this.$nextTick(() => {
                        this.notify(key);
                      });
                    }
                  } else {
                    this.setUserOpen(key, true);
                    this.$emit("form-value-change", { key, ...arguments });
                    this.$nextTick(() => {
                      this.notify(key);

                      this.setUserOpen(key, false);
                    });
                  }

                  // args.label = args.label.replace(
                  //   /^(.+)(\(.*\))$/g,
                  //   (_, $1) => {
                  //     return $1;
                  //   }
                  // );
                  if (on["on-change"]) {
                    on["on-change"].call(
                      this,
                      ...args,
                      item,
                      this.options[key]
                    );
                    this.$emit("input", this.submitForm);
                  }
                }
              }
            }}
          >
            {tagName === "span" ? value : null}
            {tagName === "Select"
              ? this.renderSelectOption({ key, labelInValue, option })
              : tagName === "CheckboxGroup"
              ? this.renderCheckboxOption({ key, option })
              : tagName === "RadioGroup"
              ? this.renderRadioOption({ key, option })
              : null}

            {Object.keys(scopedSlots).map(name => {
              const content = scopedSlots[name].call(
                this,
                h,
                this.options[key],
                props
              );
              if (content) {
                content.data = content.data || {};
                content.data.slot = name;
              }
              return content;
            })}
          </tagName>
          {afterSlot && afterSlot(h)}
        </div>
      );
    },
    compilerFields(fields) {
      return fields.map(field => {
        return this.compilerField(field);
      });
    },
    compilerField(field) {
      const newItem = {};
      if (typeof field === "string") {
        return this.compileExpression(field);
      }
      Object.keys(field).map(key => {
        const value = field[key];
        if (key === "children") {
          newItem[key] = value;
        } else if (typeof value === "string") {
          newItem[key] = this.compileExpression(value);
        } else if (typeof value === "function") {
          newItem[key] = value;
        } else if (toString.call(value) === "[object Null]") {
          newItem[key] = value;
        } else if (Array.isArray(value)) {
          newItem[key] = this.compilerFields(value);
        } else if (typeof value === "object") {
          newItem[key] = this.compilerField(value);
        } else {
          newItem[key] = value;
        }
      });
      return newItem;
    }
  },
  created() {},
  mounted() {
    this.destroyed = false;
    // this.$nextTick(() => {
    //   const compiledFields = this.compilerFields(this.fields);
    //   compiledFields.forEach(field => {
    //     if (!this.watcherMap.has(field.key)) {
    //       this.watchDep(field.key);
    //     }
    //   });
    // });
  },
  beforeDestroy() {
    this.destroyed = true;
    this.unbindWatch();
    // this.resetFields();
  },
  deactivated() {
    this.destroyed = true;
    this.unbindWatch();
    // this.resetFields();
  },
  activated() {
    this.destroyed = false;
    this.defaultValue = JSON.parse(JSON.stringify(this.submitForm));
  },
  destroyed() {},
  render(h) {
    if (this.destroyed) {
      return null;
    }
    return this.renderForm(this.fields);
  }
};
</script>

<style lang="less" scoped>
.form {
  display: grid;
  // flex-wrap: wrap;
}
.ivu-form-inline .ivu-form-item {
  margin-right: 0;
}
/deep/ .ivu-date-picker {
  width: 100% !important;
}
/deep/ .ivu-form-item {
  .ivu-form-item:first-child {
    .ivu-form-item-content {
      margin-right: 2px !important;
    }
  }
  .ivu-form-item:last-child {
    .ivu-form-item-content {
      margin-left: 2px !important;
    }
  }
  .ivu-form-item:not(:first-child) :not(:last-child) {
    .ivu-form-item-content {
      margin: 0 1px !important;
    }
  }
}
</style>
