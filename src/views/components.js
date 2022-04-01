const registerFactory = () => {
  const components = [];
  const componentsMap = {};
  const register = function (component) {
    components.push(component);
    componentsMap[component.key] = component;
  };
  return {
    register,
    components,
    componentsMap
  };
};
const { register, components, componentsMap } = registerFactory();
const createEditTableProp = ({ label, columns }) => {
  return {
    label,
    type: "NewEditTable",
    columns
  };
};
const createInputNumberProp = ({ label }) => {
  return { label, type: "InputNumber" };
};
const createAddRowProp = ({ label }) => {
  return { label, type: "AddRow" };
};
const createInputProp = ({ label }) => {
  return { label, type: "Input" };
};
const createSelectProp = ({ label, options }) => {
  return { label, type: "Select", options };
};
const createSwitchProp = ({ label }) => {
  return { label, type: "i-Switch" };
};
register({
  label: "查询", //组件的描述
  icon: "md-search",
  type: "Search", //组件名称
  render: h => {
    return (
      <Search
        row={3}
        fields={[
          { label: "姓名", key: "name" },
          { label: "Age", key: "age" },
          { label: "Address", key: "address" }
        ]}
      ></Search>
    );
  },
  isFocus: false,
  props: {
    fields: createEditTableProp({
      label: "筛选项配置",
      columns: [
        { title: "描述", type: "Input", key: "label" },
        { title: "字段", type: "Input", key: "key" }
      ]
    }),
    rows: createInputNumberProp({ label: "每行列数" })
  }
});
register({
  label: "远程表格", //组件的描述
  icon: "md-grid",
  type: "AutoTable", //组件名称
  isFocus: false,
  model: {
    value: [{ name: "张三", age: 25, address: "北京" }]
  },
  render(h) {
    console.log(this);
    return (
      <AutoTable
        columns={[
          { title: "姓名", key: "name" },
          {
            title: "Age",
            key: "age"
          },
          {
            title: "Address",
            key: "address"
          }
        ]}
        vModel={this.model.value}
      ></AutoTable>
    );
  },
  data: {
    columns: []
  },
  props: {
    columns: createAddRowProp({
      label: "列配置"
    }),
    loadData: createInputProp({ label: "数据源" })
  }
});
register({
  label: "表格", //组件的描述
  icon: "md-grid",
  type: "Table", //组件名称
  isFocus: false,
  model: {
    value: [{ name: "张三", age: 25, address: "北京" }]
  },
  // component: {
  //   name: "Table",
  //   props: {
  //     columns: [
  //       { title: "姓名", key: "name" },
  //       {
  //         title: "Age",
  //         key: "age"
  //       },
  //       {
  //         title: "Address",
  //         key: "address"
  //       }
  //     ],
  //     data: this.model.value
  //   }
  // },
  render(h, config = {}) {
    console.log(this);
    return (
      <Table
        {...{
          ...config,
          props: {
            columns: [
              { title: "姓名", key: "name" },
              {
                title: "Age",
                key: "age"
              },
              {
                title: "Address",
                key: "address"
              }
            ],
            data: this.model.value,
            ...config.props
          }
        }}
      ></Table>
    );
  },
  data: {
    columns: []
  },
  props: {
    columns: createAddRowProp({
      label: "列配置"
    }),
    loadData: createInputProp({ label: "数据源" })
  }
});
register({
  label: "按钮", //组件的描述
  icon: "md-apps",
  isFocus: false,
  type: "Button", //组件名称
  props: {
    type: createSelectProp({
      label: "类型",
      options: [
        { label: "default", value: "default" },
        { label: "info", value: "info" },
        { label: "success", value: "success" },
        { label: "error", value: "error" },
        { label: "text", value: "text" },
        { label: "primary", value: "primary" },
        { label: "warning", value: "warning" },
        { label: "dashed", value: "dashed" }
      ]
    }),
    ghost: createSwitchProp({
      label: "幽灵属性"
    })
  },
  render(h, config = {}) {
    return (
      <Button
        {...{
          ...config,
          props: {
            ...config.props
          }
        }}
      >
        按钮
      </Button>
    );
  }
});
register({
  label: "Card容器", //组件的描述
  icon: "md-square-outline",
  isFocus: false,
  type: "Card", //组件名称
  render(h, config = {}) {
    return (
      <Card>
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          Classic film
        </p>
        <a href="#" slot="extra">
          <Icon type="ios-loop-strong"></Icon>
          Change
        </a>
        <LayoutDraggable
          {...{
            ...config,
            props: {
              ...config.props
            }
          }}
        ></LayoutDraggable>
      </Card>
    );
  },
  children: [],
  props: {
    type: createSelectProp({
      label: "类型",
      options: [
        { label: "default", value: "default" },
        { label: "info", value: "info" },
        { label: "success", value: "success" },
        { label: "error", value: "error" },
        { label: "text", value: "text" },
        { label: "primary", value: "primary" },
        { label: "warning", value: "warning" },
        { label: "dashed", value: "dashed" }
      ]
    }),
    ghost: createSwitchProp({
      label: "幽灵属性"
    })
  }
});
console.log(components);
export default {
  register,
  components,
  componentsMap
};
