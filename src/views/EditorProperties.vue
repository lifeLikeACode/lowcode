<script>
export default {
  data() {
    return {};
  },
  props: {
    components: {
      type: Array,
      default: () => {
        return [];
      }
    },
    selectedComponent: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  render(h) {
    const renderMap = {
      Input: (h, key, value) => {
        return <Input></Input>;
      },
      InputNumber: (h, key, value) => {
        return <InputNumber></InputNumber>;
      },
      Select: (h, key, value) => {
        const { options } = value;
        return (
          <Select>
            {options.map(item => {
              return <Option value={item.value}>{item.label}</Option>;
            })}
          </Select>
        );
      },
      "i-Switch": (h, key, value) => {
        return <i-Switch></i-Switch>;
      },
      NewEditTable: (h, key, value) => {
        const { columns } = value;
        return <NewEditTable columns={columns}></NewEditTable>;
      },
      AddRow: (h, key, value) => {
        const { columns } = value;
        return <AddRow list={[]}></AddRow>;
      }
    };
    return (
      <Card dis-hover bordered={false}>
        <Form label-width={80} label-position="left">
          {Object.keys(this.selectedComponent).length > 0 ? (
            Object.entries(this.selectedComponent.props).map(item => {
              console.log(item);
              const [key, value] = item;
              const { type, label } = value;
              return (
                <FormItem label={label}>
                  {renderMap[type](h, key, value)}
                </FormItem>
              );
            })
          ) : (
            <p>请在左侧画布选中节点</p>
          )}
        </Form>
      </Card>
    );
  }
};
</script>

<style lang="less" scoped></style>
