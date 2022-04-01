<template>
  <div>
    <Space direction="vertical">
      <div v-for="(li, index) in list" :key="li._id" style="">
        <!-- <Row type="flex" :wrap="false">
        <i-Col><Input v-model="li.title" /></i-Col>
        <i-Col><Input v-model="li.title" /></i-Col>
        <i-Col><Icon type="md-trash" @click="deleteOne(index)" /></i-Col>
      </Row> -->

        <Space
          :wrap="false"
          align="center"
          style="background: #f6f7f8; padding: 6px 10px"
          ><Input v-model="li.title" /><Input v-model="li.title" /><Icon
            type="ios-trash-outline"
            @click="deleteOne(index)"
            size="18"
            style="cursor: pointer"
        /></Space>
      </div>
      <Button type="primary" long @click="addOne">添加一项</Button>
    </Space>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [{ key: "", title: "" }]
    };
  },
  methods: {
    addOne() {
      this.list.push({
        title: "",
        key: "",
        _id: new Date().getTime()
      });
    },
    deleteOne(index) {
      this.list.splice(index, 1);
    }
  }
};
</script>

<style lang="less" scoped></style>
