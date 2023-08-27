<template>
  <div class="tablePlus-container">
    <Search
      v-if="searchArr && searchArr.length > 0"
      ref="searchRef"
      v-bind="{ ...searchConfig }"
      :searchArr="searchArr"
      @reset="reset"
      @submit="submit"
    >
      <slot name="btns"></slot>
    </Search>
    <div ref="tableRef" class="table-container">
      <div class="fc-table-header">
        <slot name="middle"></slot>
      </div>
      <el-table v-bind="{ ...config }" ref="elTableRef" :height="state.tableHeight" :data="list" tooltip-enterable="true">
        <el-table-column
          v-for="(item, index) in tableItems"
          :key="item.type ? item.type : index"
          align="center"
          :prop="item.field"
          v-bind="{ ...item }"
        >
          <template #header="prop">
            {{ item.renderHeader ? item.renderHeader(prop.row, prop.index) : item.label }}
          </template>
          <template v-if="item.slot" #default="prop">
            <slot :name="item.slot" :row="prop.row"></slot>
          </template>
        </el-table-column>
      </el-table>
      <el-row v-if="!noPagination" className="fc-pagination-wrap">
        <el-pagination
          v-model:page-size="state.pageSize"
          background
          :currentPage="state.pageNo"
          :total="total"
          v-bind="{ ...pna }"
          @currentChange="page"
          @sizeChange="submit"
        />
      </el-row>
    </div>
  </div>
</template>

<script lang="tsx" setup>
  import { PropType, reactive, ref, onMounted } from 'vue'
  import Search from './Search/index.vue'

  interface TableItemInterface {
    type?: string
    field?: string
    label?: string
    width?: number
    [props: string]: any
    render?: (data: any, index: number) => any
    renderHeader?: (data: any, index: number) => any
  }

  interface PaginationInterface {
    pageSize?: number
    [props: string]: any
  }

  const props = defineProps({
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
        return []
      }
    },
    total: {
      type: Number
    },
    config: {
      default: () => {
        return {}
      }
    },

    searchConfig: {
      type: Object,
      default: () => {
        return {}
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
        return {}
      }
    }
  })

  const emits = defineEmits(['fetch', 'reset'])

  const state: any = reactive({
    pageNo: 1,
    pageSize: props.pagination.pageSize || 10
  })

  const searchRef = ref()
  const tableRef = ref()
  const elTableRef = ref()

  const pna = reactive({
    'page-sizes': [10, 20, 50],
    layout: 'total, sizes, prev, pager, next, jumper',
    ...props.pagination
  })

  const page = (index: number) => {
    state.pageNo = index
    fetch({ action: 'page' })
  }

  const submit = (params: any = {}) => {
    console.log('submit---', params)
    // 有的分页不用重置
    if (!params.noResetPageNo) {
      state.pageNo = 1
    }
    fetch({ ...params })
  }

  const reset = (params: any = {}) => {
    state.pageNo = 1
    fetch({ action: 'reset', ...params })
    emits('reset')
  }

  // 返回的是个promise
  const getData = async () => {
    if (searchRef.value) {
      const data = await searchRef.value.getData()
      return Promise.resolve({
        ...data,
        pageNo: state.pageNo,
        pageSize: state.pageSize
      })
    }
    return Promise.resolve({})
  }

  const getDataSync = () => {
    const data = searchRef.value.getDataSync()
    return {
      ...data,
      pageNo: state.pageNo,
      pageSize: state.pageSize
    }
  }

  const fetch = async (params: any = {}) => {
    const data = await getData()
    emits('fetch', {
      ...params,
      ...data,
      pageNo: state.pageNo,
      pageSize: state.pageSize
    })
  }

  const updateDefaultData = (key: string, value: any, needRefresh: boolean) => {
    searchRef.value.updateDefaultData(key, value, needRefresh)
  }

  const calculateHeight = () => {
    const winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    const offsetTop = tableRef.value && tableRef.value.getBoundingClientRect().top
    // console.log('0000000000000', winHeight - offsetTop - 20 - 62 - 92)
    state.tableHeight = winHeight - offsetTop - 20 - 62 - 92
  }
  window.addEventListener('resize', calculateHeight)

  onMounted(() => {
    calculateHeight()
  })

  defineExpose({
    getDataSync,
    updateDefaultData,
    submit
  })
</script>

<style lang="scss">
  .table-container {
    padding: 1px;
    .fc-table-header {
      padding: 24px 0 16px 24px;
    }
    .el-table {
      // height: calc(100% - 72px);
    }
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
  }
</style>
