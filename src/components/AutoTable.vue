<template>
  <div>
    <!-- 头部插槽内容 -->
    <slot name="header"></slot>
    <!-- 块级元素 不需要Row/div嵌套 -->
    <Table
      :loading="loading"
      ref="table"
      row-key
      :columns="columns"
      :data="tableData"
      v-bind="$attrs"
      v-on="$listeners"
      :transfer="true"
    >
    </Table>
    <div class="page" v-if="visiblePage">
      <Page
        v-on="$listeners"
        class="pagebar"
        @on-page-size-change="pageSizeChange"
        :current="tableCurrentPage"
        :show-sizer="!showSize"
        show-elevator
        :page-size="tablePageSize"
        :page-size-opts="pageSizeOpts"
        :total="tableTotalRows"
        show-total
        @on-change="onPageChange"
        :transfer="transfer"
      ></Page>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "AutoTable",
  props: {
    ["page-size-opts"]: {
      type: Array,
      default: () => {
        return [10, 20, 30, 40];
      }
    },
    loadData: {
      type: Function
    },
    hidePage: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    pageSize: {
      type: Number,
      default: 10
    },
    transfer: {
      type: Boolean,
      default: true
    },
    showSize: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false, // 是否正在加载
      tableData: [], // 表格数据
      tableTotalRows: 0, // 表格总行数
      tableCurrentPage: 1, // 表格当前页
      tablePageSize: this.pageSize, // 表格每页条数
      currentParams: {} //当前参数
    };
  },
  created() {
    // 判断是否存在action列,如果有则根据buttons: ['View', 'Edit', 'Delete'] 来生存操作按钮
    if (this.columns) {
      this.columns.forEach(item => {
        // optimize 开启toolTip在单元格多的情况下会影响性能，减慢用户对表格的操作，不需要的时候尽量关闭。
        _.set(
          item,
          "tooltip",
          typeof item.tooltip === "undefined" ? true : item.tooltip
        );
        if (item.key && !_.has(item, "render") && item.key == "action") {
          let arr = [];
          _.map(item.buttons, val => {
            if (typeof val === "string") {
              arr.push(<span class="button">{val}</span>);
            } else if (Object.prototype.toString(val) === "[object Object]") {
              const directives = val.directives || [];
              arr.push(
                <span class="button" {...{ directives }}>
                  {val.label}
                </span>
              );
            }
          });
          item.render = (h, params) => {
            return (
              <span
                onClick={e => {
                  this.$emit("on-click", {
                    type: e.target.innerHTML,
                    params
                  });
                }}
              >
                {arr}
              </span>
            );
          };
        }
      });
    }
  },
  watch: {
    // "initData.firstResult": {
    //   handler(value) {
    //     this.tableCurrentPage = (value || 0) / this.tablePageSize + 1;
    //   }
    // }
  },
  computed: {
    visiblePage() {
      return (
        this.tableData &&
        this.tableData.length > 0 &&
        !this.hidePage &&
        this.tableTotalRows
      );
    },
    firstResult() {
      return this.tableCurrentPage > 0
        ? (this.tableCurrentPage - 1) * this.tablePageSize
        : 0;
    },
    params() {
      return {
        firstResult: this.firstResult,
        pageSize: this.tablePageSize
      };
    }
  },
  methods: {
    exportData(params) {
      this.$refs.table.exportCsv(params);
    },
    selectAll(status) {
      this.$refs.table.selectAll(status);
    },
    getTableData() {
      return this.tableData;
    },
    getTableTotalRows() {
      return this.tableTotalRows;
    },
    refresh(params = {}) {
      const { del } = params;
      if (del && this.tableData.length <= 1) {
        this.tableCurrentPage -= 1;
      }
      return this.fetchData();
    },
    search(params) {
      this.tableCurrentPage = 1;
      return this.fetchData(params);
    },

    fetchData(params = {}) {
      this.loading = true;
      const fn = this.loadData({ ...params, ...this.params }).then(response => {
        return response;
      });
      return fn
        .then(response => {
          this.loading = false;
          const { totalRows, datas } = response;
          this.tableData = datas;
          this.tableTotalRows = totalRows;
          return { totalRows, datas };
        })
        .catch(error => {
          // 接口请求失败
          this.loading = false;
          this.tableData = [];
          this.tableTotalRows = 0;
          return error;
        });
    },
    clearTable() {
      this.tableData = [];
    },
    onPageChange(newPage) {
      this.tableCurrentPage = newPage;
      this.fetchData();
    },
    pageSizeChange(value) {
      this.tablePageSize = value;
      this.search();
      this.$emit("sendPageSize", value);
    }
  }
};
</script>

<style lang="less" scoped>
.button {
  margin-right: 10px;
  cursor: pointer;
  color: #4a90e2;
}
.pagebar {
  padding: 10px;
}
.page {
  text-align: right;
}
.ivu-card-bordered {
  border: none;
  &:hover {
    box-shadow: none;
    border-color: #eee;
  }
}
</style>
