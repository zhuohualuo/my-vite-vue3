<script lang="tsx">
import { defineComponent, PropType, reactive, ref } from 'vue';
import Search from '../Search/index.vue';

interface TableItemInterface {
  type?: string;
  field?: string;
  label?: string;
  width?: number;
  [props: string]: any;
  render?: (data: any, index: number) => any;
  renderHeader?: (data: any, index: number) => any;
}

interface PaginationInterface {
  pageSize?: number;
  [props: string]: any;
}

export default defineComponent({
  props: {
    tableItems: {
      type: Array as PropType<Array<TableItemInterface>>,
      required: true
    },
    height: {
      type: [Number, String]
    },
    list: {
      type: Array as PropType<Array<any>>,
      required: true
    },
    searchArr: {
      type: Array as PropType<Array<any>>,
      default: () => {
        return [];
      }
    },
    total: {
      type: Number
    },
    config: {
      default: () => {
        return {};
      }
    },

    searchConfig: {
      type: Object,
      default: () => {
        return {};
      }
    },

    // 是否需要分页，不需要传true
    noPagination: {
      type: Boolean,
      default: false
    },

    // 是否需要差异化处理分页，无特殊情况可以忽略
    pagination: {
      type: Object as PropType<PaginationInterface>,
      default: () => {
        return {};
      }
    }
  },
  emits: ['fetch', 'selection-change', 'submit', 'reset'],
  setup(props, ctx) {
    const state = reactive({
      pageNo: 1,
      pageSize: props.pagination.pageSize || 10
    });

    const searchRef = ref();
    const tableRef = ref();

    const pna = reactive({
      'page-sizes': [10, 50],
      layout: 'total, sizes, prev, pager, next, jumper',
      onSizeChange() {
        submit();
      },
      ...props.pagination
    });

    const page = (index: number) => {
      state.pageNo = index;
      fetch({ action: 'page' });
    };

    const submit = (params: any = {}) => {
      //有的分页不用重置
      if (!params.noResetPageNo) {
        state.pageNo = 1;
      }
      fetch({ ...params });
    };

    const reset = (params: any = {}) => {
      state.pageNo = 1;
      fetch({ action: 'reset', ...params });
      ctx.emit('reset');
    };

    //返回的是个promise
    const getData = async () => {
      if (searchRef.value) {
        const data = await searchRef.value.getData();
        return Promise.resolve({
          ...data,
          pageNo: state.pageNo,
          pageSize: state.pageSize
        });
      }
      return Promise.resolve({});
    };

    const getDataSync = () => {
      const data = searchRef.value.getDataSync();
      return {
        ...data,
        pageNo: state.pageNo,
        pageSize: state.pageSize
      };
    };

    const fetch = async (params: any = {}) => {
      const data = await getData();
      ctx.emit('fetch', {
        ...params,
        ...data,
        pageNo: state.pageNo,
        pageSize: state.pageSize
      });
    };

    const updateDefaultData = (key: string, value: any, needRefresh: boolean) => {
      searchRef.value.updateDefaultData(key, value, needRefresh);
    };

    return {
      page,
      pna,
      state,
      submit,
      reset,
      searchRef,
      tableRef,
      getDataSync,
      updateDefaultData
    };
  },
  render() {
    const { list, tableItems, searchConfig, noPagination, searchArr, total, state, page, pna, submit, reset, config } = this;
    return (
      <>
        {searchArr && searchArr.length > 0 && (
          <Search {...searchConfig} searchArr={searchArr} onReset={reset} onSubmit={submit} ref="searchRef">
            {this.$slots.btns && this.$slots.btns()}
          </Search>
        )}
        {this.$slots.middle && this.$slots.middle()}
        <el-table data={list} border key="1" tooltip-enterable="true" ref="elTableRef" {...config}>
          {tableItems.map((item: TableItemInterface) => {
            return item.type ? (
              <el-table-column key={item.type} align="center" {...item}></el-table-column>
            ) : (
              <el-table-column
                align="center"
                {...item}
                v-slots={{
                  default: (prop: any) => {
                    return item.render ? item.render(prop.row, prop.index) : item.field ? prop.row[item.field] : null;
                  },
                  header: (prop: any) => {
                    return item.renderHeader ? item.renderHeader(prop.row, prop.index) : item.label;
                  }
                }}
              ></el-table-column>
            );
          })}
        </el-table>
        {!noPagination && (
          <el-row className="fc-pagination-wrap">
            <el-pagination background onCurrentChange={page} v-model:page-size={state.pageSize} currentPage={state.pageNo} total={total} {...pna}></el-pagination>
          </el-row>
        )}
      </>
    );
  }
});
</script>

<style lang="scss">
.fc-pagination-wrap {
  .el-pagination {
    justify-content: end;
    padding: 24px 0;
  }
  .number {
    color: #a2a3a5 !important;
    &.is-active {
      color: #fff !important;
    }
  }
  .el-pagination__total {
    color: #606266;
  }
}
</style>
