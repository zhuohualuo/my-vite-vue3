<template>
  <el-select v-model="state.networkBusinessCode" filterable clearable :disabled="state.companyList.length <= 1" @change="updateData">
    <el-option v-for="item in state.companyList" :key="item.value" :value="item.value" :label="item.label" />
  </el-select>
  <el-cascader v-if="state.networkBusinessCode" ref="treeRef" :key="state.networkBusinessCode" v-model="state.networkIdStrList" :disabled="!state.networkBusinessCode" clearable filterable :collapse-tags="true" :show-all-levels="false" :props="treeProps" :popper-class="clsRandom" :placeholder="placeholder" style="width: 286px; margin-left: 6px" @change="change" @visible-change="visibleChange" />
  <el-select v-else :disabled="true" style="width: 286px; margin-left: 6px" :placeholder="defaultPlaceholder" />
</template>

<script setup lang="tsx">
import { reactive, onMounted, ref, PropType, watch, onBeforeUnmount } from 'vue';
import http from '@/utils/http';
import { CascaderProps } from 'element-plus';

interface CompanyItem {
  code: string;
  name: string;
}
interface OptItem {
  label: string;
  value: string;
  [props: string]: string;
}

const props = defineProps({
  modelValue: {
    type: Array as PropType<Array<any>>,
    default: () => []
  },
  treeConfig: {
    type: Object as PropType<CascaderProps>,
    default: () => ({})
  },
  readOnlyData: Object as PropType<OptItem>
});

const state = reactive<{
  companyList: OptItem[];
  networkBusinessCode: string;
  networkIdStrList: string[] | string;
}>({
  companyList: [],
  networkBusinessCode: props.modelValue[0],
  networkIdStrList: props.readOnlyData?.value || []
});

// @ts-ignore
const defaultPlaceholder = props.treeConfig.placeholder || '快递网点';
const placeholder = ref(props.readOnlyData?.value ? props.readOnlyData.label : defaultPlaceholder);

const clsRandom = `net-cascader-wrap-${parseInt(`${Math.random() * 10000000}`)}`;

const treeRef = ref();

const emits = defineEmits(['update:modelValue', 'updateDefaultData']);

watch(
  () => props.modelValue,
  (val) => {
    const arr = val || [];
    const [networkBusinessCode, networkIdStrList = []] = arr;
    state.networkBusinessCode = networkBusinessCode;
    state.networkIdStrList = networkIdStrList;

    if (!networkIdStrList || !networkIdStrList.length) {
      placeholder.value = defaultPlaceholder;
    }
  }
);

const updateData = () => {
  emits('update:modelValue', [state.networkBusinessCode, state.networkIdStrList]);
};

const change = () => {
  updateData();
};

const treeProps = {
  lazy: true,
  checkStrictly: true,
  multiple: true,
  emitPath: false,
  lazyLoad: async (node: any, resolve: any) => {
    const params: any = {};
    if (node.level === 0) {
      params.companyId = state.networkBusinessCode;
    } else {
      params.networkId = node.data.id;
    }
    if (node.data.id === '-1') {
      resolve([]);
      return;
    }
    const data = await http.request({
      url: '/ops/network/findNetworkTree',
      method: 'post',
      data: params,
      requestOptions: { ignoreCancel: true }
    });
    const nodes = data.map((item: any) => ({
      id: item.id,
      value: item.id,
      label: item.name,
      data: {
        id: item.id,
        name: item.name
      },
      disabled: !item.showType
    }));
    // 多选才这么玩
    if (props.treeConfig.multiple !== false) {
      const canSelectArr = nodes.filter((item: any) => item.disabled === false);
      const disabled = canSelectArr.length === 0;
      const allSelect = { id: '-1', value: '', label: '全选', disabled, leaf: true };
      if (canSelectArr.length) {
        nodes.unshift(allSelect);
      }
    }
    resolve(nodes);
  },
  ...props.treeConfig
};

const fetchCompanyList = async () => {
  try {
    const arr = await http.request({
      url: '/ops/network/findNetworkTree',
      method: 'post',
      requestOptions: { ignoreCancel: true }
    });
    state.companyList = arr?.map((item: CompanyItem) => ({
      value: item.code,
      label: item.name
    }));
    if (arr.length === 1) {
      state.networkBusinessCode = state.companyList[0].value;
      updateData();
      emits('updateDefaultData', 'net', [state.networkBusinessCode, []]);
    }
  } catch (err) {
    console.log(err);
  }
};

const findElement = (dom: any) => {
  while (dom) {
    if (dom.classList.contains('el-cascader-node')) {
      return dom;
    }
    dom = dom.parentElement;
  }
  return dom;
};

const elementFn = (ev: any) => {
  if (ev && (ev.target.classList.contains('el-checkbox__inner') || ev.target.classList.contains('el-checkbox'))) {
    try {
      const liDom = findElement(ev.target);
      if (!liDom.previousElementSibling) {
        const ipt = liDom.querySelector('.el-checkbox__input');
        const status = ipt.classList.contains('is-checked');
        let dom = liDom.nextElementSibling;
        while (dom) {
          if (status) {
            if (dom.classList.contains('is-active')) {
              dom.querySelector('.el-checkbox').click();
            }
          } else if (!dom.classList.contains('is-active')) {
            dom.querySelector('.el-checkbox').click();
          }
          dom = dom.nextElementSibling;
        }
        ipt.classList.toggle('is-checked');
        if (status) {
          liDom.classList.remove('is-active');
        } else {
          liDom.classList.add('is-active');
        }
        ev.preventDefault();
        ev.stopImmediatePropagation();
      }
    } catch (err) {
      console.log(err);
    }
  }
};

const visibleChange = (status: boolean) => {
  const wrap = document.querySelector(`.${clsRandom}`) as any;
  if (status) {
    wrap.removeEventListener('click', elementFn);
    wrap.addEventListener('click', elementFn, true);
  } else {
    wrap.removeEventListener('click', elementFn);
  }
};

onMounted(() => {
  // 避免系统管理员点击重置的时候，无法还原
  // if (props.readOnlyData?.value) {
  //   emits('updateDefaultData', 'net', ['', []])
  // }
  fetchCompanyList();
});

onBeforeUnmount(() => {
  document.removeEventListener('click', elementFn);
});

defineExpose({
  treeRef
});
</script>
<style></style>
