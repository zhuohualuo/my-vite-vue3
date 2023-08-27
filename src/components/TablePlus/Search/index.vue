<template>
  <el-form
    ref="formRef"
    label-position="right"
    size="large"
    class="search-container"
    :inline="true"
    :model="searchData"
    :hide-required-asterisk="true"
    @submit="submit"
  >
    <el-form-item
      v-for="item in list"
      :key="item.field"
      :label="item.label"
      :prop="item.field"
      label-width="90px"
      v-bind="{ ...item.labelConfig } || {}"
    >
      <Select v-if="item.component === 'select'" v-bind="{ ...item.config }" v-model="state.searchData[item.field]" :options="item.options || []" />
      <el-input
        v-if="item.component === 'input'"
        v-model="state.searchData[item.field]"
        size="default"
        clearable
        :type="item.type || 'text'"
        v-bind="{ ...item.config }"
      />
      <el-date-picker
        v-if="item.component === 'date-picker'"
        v-model="state.searchData[item.field]"
        size="default"
        :type="item.type"
        value-format="YYYY-MM-DD"
        v-bind="{ ...item.config }"
      />
      <el-cascader v-if="item.component === 'cascader'" v-bind="{ ...item.config }" v-model="state.searchData[item.field]" size="default" />
      <City v-if="item.component === 'city'" v-model="state.searchData[item.field]" />
      <template v-if="item.component === 'render'">
        {{ item.render ? item.render(state.searchData) : null }}
      </template>
    </el-form-item>
    <el-form-item>
      <el-button v-if="!noSearchBtn" size="default" type="primary" @click="search"> {{ searchButtonText }} </el-button>
      <el-button v-else-if="!noResetBtn" size="default" @click="reset"> 重置 </el-button>
      <slot v-else></slot>
    </el-form-item>
  </el-form>
</template>

<script lang="tsx" setup>
  import { reactive, computed, ref, PropType } from 'vue'
  import Select from './components/Select.vue'
  import City from './components/City.vue'

  interface SearchItem {
    component: 'select' | 'date-picker' | 'cascader' | 'render' | 'input' | 'city' | 'render'
    type?: string
    field: string
    label?: string
    labelConfig?: any
    config?: any
    defaultValue?: any
    options?: Array<{ value: string; label: string }>
    render?: (params: any) => any
  }

  const deafultConfig: { [props: string]: any } = {
    daterange: {
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '结束日期'
    },
    datetimerange: {
      'range-separator': '至',
      'start-placeholder': '开始时间',
      'end-placeholder': '结束时间'
    },
    monthrange: {
      'range-separator': '至',
      'start-placeholder': '开始月份',
      'end-placeholder': '结束月份',
      'value-format': 'yyyy-MM'
    },
    select: {
      clearable: true
    }
  }

  const props = defineProps({
    searchArr: {
      type: Array as PropType<Array<SearchItem>>,
      default: () => {
        return []
      }
    },
    noSearchBtn: {
      type: Boolean,
      default: false
    },
    noResetBtn: {
      type: Boolean,
      default: false
    },
    searchButtonText: {
      type: String,
      default: '搜索'
    }
  })

  const emits = defineEmits(['submit', 'reset'])

  const searchData: any = {}
  const cacheDefaultData: any = {}
  const formRef = ref()
  props.searchArr.forEach((item) => {
    if (item.defaultValue !== undefined) {
      searchData[item.field] = item.defaultValue
      cacheDefaultData[item.field] = item.defaultValue
    }
  })

  const state = reactive({
    searchData,
    show: true
  })

  const list = computed(() =>
    props.searchArr.map((item) => ({
      ...item,
      config: {
        ...(deafultConfig[item.type || item.component] || {}),
        ...(item.config || {})
      }
    }))
  )

  const search = async () => {
    await formRef.value.validate()
    emits('submit', { ...state.searchData, action: 'search' })
  }

  const reset = (params = {}) => {
    formRef.value.resetFields()
    state.searchData = { ...cacheDefaultData, ...params }
    emits('reset', { ...state.searchData })
  }

  const getData = async () => {
    await formRef.value.validate()
    return state.searchData
  }

  // 同步获取数据，不走校验
  const getDataSync = () => state.searchData

  const updateDefaultData = (key: string, value: any, needRefresh: boolean) => {
    cacheDefaultData[key] = value
    if (needRefresh) {
      state.searchData[key] = value
    }
  }

  const submit = (ev: any) => {
    search()
    ev.preventDefault()
  }

  defineExpose({
    updateDefaultData,
    getDataSync,
    getData
  })
</script>

<style lang="scss">
  .top-search-wrap {
    margin-bottom: 4px;
    .ml20 {
      margin-left: 20px !important;
    }
    .el-form-item__content {
      & > .el-input {
        width: 180px;
      }
      & > .el-select {
        width: 180px;
      }
    }
    .el-form-item__label {
      padding-right: 6px;
    }
    .el-form-item {
      margin-right: 20px !important;
    }
    input[type='number'] {
      -moz-appearance: textfield;
    }

    input[type='number']::-webkit-inner-spin-button,
    input[type='number']::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  .city-cascader-wrap .el-cascader-menu__list {
    max-height: 400px;
  }
</style>
