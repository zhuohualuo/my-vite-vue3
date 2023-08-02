<template>
  <div class="cityTable-container">
    <TablePro
      :searchArr="searchArr"
      :tableItems="tablesItems"
      :list="state.list"
      :pagination="state.pagination"
      :config="{ onSelectionChange: selectChange }"
      :searchConfig="{
        searchBtnConfig: {
          loading: state.searchLoading
        }
      }"
      @fetch="fetchList"
      ref="searchRef"
    >
      <template v-slot:btns>
        <el-button type="primary" @click="handleAdd('add')">新增</el-button>
        <el-button type="danger" @click="handleMultiDel()"> 删除 </el-button>
      </template>
    </TablePro>
    <!-- <CityAdd ref="cityAddRef" @submit="submit" /> -->
  </div>
</template>

<script lang="jsx" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import TablePro from '@/components/TablePro/index';
// import CityAdd from './cityAdd.vue'
import request from '@/request';
import { dateFormatter } from '@/util';

const tableRef = ref(null);
const cityAddRef = ref();
const searchRef = ref();

const state = reactive({
  searchLoading: false,
  list: [],
  pagination: {
    total: 0
  }
});

const searchArr = [
  {
    component: 'input',
    field: 'cityName',
    label: '城市'
  }
];

const tablesItems = [
  { type: 'selection', width: 50 },
  { type: 'index', width: 50 },
  {
    label: '城市',
    field: 'cityName',
    render({ cityName }) {
      return <span>{cityName}</span>;
    }
  },
  {
    label: '周转率配置',
    render({ configs, configType }) {
      return (
        <>
          <div v-show={configType === 0}>
            {configs.map((item) => {
              return (
                <div>
                  <span>{item.startTurnoverRate}</span>-<span>{item.endTurnoverRate}</span>%
                </div>
              );
            })}
          </div>
          <div v-show={configType === 1}>
            <span>否</span>
          </div>
        </>
      );
    }
  },
  {
    label: '收费柜机-非会员包裹强制取出时长',
    render({ configs, chargeNormalSaveTime, configType }) {
      return (
        <>
          <div v-show={configType === 0}>
            {configs.map((item) => {
              return (
                <div>
                  <span>{item.chargeNormalSaveTime}</span>h
                </div>
              );
            })}
          </div>
          <div v-show={configType === 1}>
            <span>{chargeNormalSaveTime}</span>
          </div>
        </>
      );
    }
  },
  {
    label: '收费柜机-未同意保管费用户包裹强制取出时长',
    render({ configs, chargeDisagreeSaveTime, configType }) {
      return (
        <>
          <div v-show={configType === 0}>
            {configs.map((item) => {
              return (
                <div>
                  <span>{item.chargeDisagreeSaveTime}</span>h
                </div>
              );
            })}
          </div>
          <div v-show={configType === 1}>
            <span>{chargeDisagreeSaveTime}</span>
          </div>
        </>
      );
    }
  },
  {
    label: '非收费柜机-非会员用户包裹',
    render({ configs, freeNormalSaveTime, configType }) {
      return (
        <>
          <div v-show={configType === 0}>
            {configs.map((item) => {
              return (
                <div>
                  <span>{item.freeNormalSaveTime}</span>h
                </div>
              );
            })}
          </div>
          <div v-show={configType === 1}>
            <span>{freeNormalSaveTime}</span>
          </div>
        </>
      );
    }
  },
  {
    label: '会员用户包裹',
    render({ configs, memberSaveTime, configType }) {
      return (
        <>
          <div v-show={configType === 0}>
            {configs.map((item) => {
              return (
                <div>
                  <span>{item.memberSaveTime}</span>h
                </div>
              );
            })}
          </div>
          <div v-show={configType === 1}>
            <span>{memberSaveTime}</span>
          </div>
        </>
      );
    }
  },
  {
    label: '最后变更时间',
    render({ updateSysTm }) {
      return dateFormatter(updateSysTm);
    }
  },
  { label: '最后操作人', field: 'updateEmp' },
  {
    label: '操作',
    width: 100,
    render(data) {
      return (
        <div>
          <el-button
            type="text"
            onClick={() => {
              handleAdd('edit', data);
            }}
          >
            修改
          </el-button>
          <el-button
            type="text"
            onClick={() => {
              handleDel(data);
            }}
          >
            删除
          </el-button>
        </div>
      );
    }
  }
];

const fetchList = async (data = {}) => {
  try {
    state.searchLoading = true;
    const {
      data: { content, totalCount }
    } = await request({
      url: '/inner/es-post-op/op/savetime/city/pages',
      method: 'post',
      data: data,
      headers: { 'Content-Type': 'application/json' }
    });
    // const { content, totalCount } = {
    //   totalCount: 0,
    //   content: [
    //     {
    //       configs: [
    //         {
    //           startTurnoverRate: 123,
    //           freeNormalSaveTime: 123,
    //           chargeNormalSaveTime: 123,
    //           endTurnoverRate: 123,
    //           chargeDisagreeSaveTime: 123,
    //         },
    //         {
    //           startTurnoverRate: 123,
    //           freeNormalSaveTime: 123,
    //           chargeNormalSaveTime: 123,
    //           endTurnoverRate: 123,
    //           chargeDisagreeSaveTime: 123,
    //         },
    //       ],
    //       cityName: ['上海市-310100'],
    //       pushStatus: 0,
    //       pushTm: '',
    //       turnoverCycle: 0,
    //       updateSysTm: 1690597755126,
    //       freeNormalSaveTime: 0,
    //       chargeNormalSaveTime: 0,
    //       id: 0,
    //       configType: 0,
    //       updateEmp: 'luozhuohua',
    //       chargeDisagreeSaveTime: 10,
    //     },
    //     {
    //       configs: [
    //         {
    //           startTurnoverRate: 123,
    //           freeNormalSaveTime: 123,
    //           chargeNormalSaveTime: 123,
    //           endTurnoverRate: 123,
    //           chargeDisagreeSaveTime: 123,
    //         },
    //         {
    //           startTurnoverRate: 123,
    //           freeNormalSaveTime: 123,
    //           chargeNormalSaveTime: 123,
    //           endTurnoverRate: 123,
    //           chargeDisagreeSaveTime: 123,
    //         },
    //       ],
    //       cityName: ['上海市'],
    //       pushStatus: 0,
    //       pushTm: '',
    //       turnoverCycle: 0,
    //       updateSysTm: 1690597755126,
    //       freeNormalSaveTime: 0,
    //       chargeNormalSaveTime: 0,
    //       id: 0,
    //       configType: 0,
    //       updateEmp: 'luozhuohua',
    //       chargeDisagreeSaveTime: 10,
    //     },
    //   ],
    // }
    state.list = content;
    state.pagination.total = totalCount;

    console.log('content---', content);
  } catch (err) {
    console.log(err);
  }
  state.searchLoading = false;
};

const handleAdd = (type, params) => {
  console.log('handleAdd', type, params);
  cityAddRef.value.show(type, params);
};

const fetchDeleteCity = async (params) => {
  await ElMessageBox.confirm('确认执行删除操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  });
  // 删除传数组
  const { success } = await request({
    method: 'post',
    url: '/inner/es-post-op/op/savetime/city/delete',
    data: {
      ids: params
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (success) {
    ElMessage.success('删除成功');
    refresh();
  }
};

let select = [];
const selectChange = (data) => {
  console.log('selectChange', data);
  select = data.map((item) => item.id);
};

const handleDel = async ({ id }) => {
  console.log('handleDel', id);

  fetchDeleteCity([id]);
};

const handleMultiDel = () => {
  console.log('handleMultiDel', select);
  if (!select.length) {
    ElMessage.warning('请先选择需要删除的任务!');
    return;
  }
  fetchDeleteCity(select);
};

const submit = () => {
  refresh();
};

const refresh = () => {
  setTimeout(() => {
    searchRef.value.submit();
  });
};

onMounted(() => {
  refresh();
});
</script>
