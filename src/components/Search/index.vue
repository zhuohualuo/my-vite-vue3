<script lang="tsx">
import { toRefs, reactive, computed, ref, defineComponent, PropType } from 'vue';
import Select from './components/Select.vue';
import City from './components/City.vue';
import CompanyList from './components/CompanyList.vue';
import Net from './components/Net.vue';

interface SearchItem {
  component: 'select' | 'date-picker' | 'cascader' | 'render' | 'input';
  type?: string;
  field: string;
  label?: string;
  labelConfig?: any;
  config?: any;
  defaultValue?: any;
  options?: Array<{ value: string; label: string }>;
  render?: (params: any) => any;
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
};

export default defineComponent({
  props: {
    searchArr: {
      type: Array as PropType<Array<SearchItem>>,
      default: () => {
        return [];
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
  },

  emits: ['submit', 'reset'],

  setup(props, ctx) {
    const searchData: any = {};
    const cacheDefaultData: any = {};
    const formRef = ref();
    const netRef = ref();
    props.searchArr.forEach((item) => {
      if (item.defaultValue !== undefined) {
        searchData[item.field] = item.defaultValue;
        cacheDefaultData[item.field] = item.defaultValue;
      }
    });

    const state = reactive({
      searchData,
      show: true
    });

    const list = computed(() =>
      props.searchArr.map((item) => ({
        ...item,
        config: {
          ...(deafultConfig[item.type || item.component] || {}),
          ...(item.config || {})
        }
      }))
    );

    const search = async () => {
      await formRef.value.validate();
      ctx.emit('submit', { ...state.searchData, action: 'search' });
    };

    const reset = (params = {}) => {
      formRef.value.resetFields();
      state.searchData = { ...cacheDefaultData, ...params };
      ctx.emit('reset', { ...state.searchData });
    };

    const getData = async () => {
      await formRef.value.validate();
      return state.searchData;
    };

    // 同步获取数据，不走校验
    const getDataSync = () => state.searchData;

    const renderComponent = (name: string, item: SearchItem) => {
      switch (name) {
        case 'select':
          return <Select {...item.config} options={item.options || []} v-model={state.searchData[item.field]} />;
        case 'input':
          return <el-input clearable type={item.type || 'text'} v-model={state.searchData[item.field]} {...item.config} />;
        case 'date-picker':
          return <el-date-picker type={item.type} value-format="YYYY-MM-DD" {...item.config} v-model={state.searchData[item.field]} />;
        case 'cascader':
          return <el-cascader {...item.config} v-model={state.searchData[item.field]} />;
        case 'city':
          return <City v-model={state.searchData[item.field] as Array<any>} />;
        case 'company':
          return <CompanyList {...item.config} v-model={state.searchData[item.field]} />;
        case 'net':
          return <Net ref="netRef" {...item.config} v-model={state.searchData[item.field]} onUpdateDefaultData={updateDefaultData} />;
        case 'render':
          return item.render ? item.render(state.searchData) : null;
      }
    };

    const updateDefaultData = (key: string, value: any, needRefresh: boolean) => {
      cacheDefaultData[key] = value;
      if (needRefresh) {
        state.searchData[key] = value;
      }
    };

    return {
      ...toRefs(state),
      cacheDefaultData,
      formRef,
      netRef,
      search,
      reset,
      renderComponent,
      getData,
      getDataSync,
      updateDefaultData,
      list
    };
  },

  render() {
    return (
      <el-form label-position="right" size="large" class=" top-search-wrap" ref="formRef" inline={true} model={this.searchData} hide-required-asterisk={true}>
        {this.list.map((item) => (
          <el-form-item key={item.field} label={item.label} prop={item.field} label-width="90px" {...(item.labelConfig || {})}>
            {this.renderComponent(item.component, item)}
          </el-form-item>
        ))}
        <el-form-item>
          {!this.noSearchBtn ? (
            <el-button type="primary" onClick={this.search}>
              {this.searchButtonText}
            </el-button>
          ) : null}

          {!this.noResetBtn ? <el-button onClick={this.reset}>重置</el-button> : null}
          {this.$slots.default && this.$slots.default()}
        </el-form-item>
      </el-form>
    );
  }
});
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
