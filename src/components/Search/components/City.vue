<template>
  <el-select v-model="province" placeholder="省" class="w120" value-key="areaId" filterable clearable>
    <el-option v-for="item in state.provinceList" :key="item.areaId" :label="item.areaName" :value="item" />
  </el-select>
  <el-select v-model="city" placeholder="市" class="w120" value-key="areaId" filterable clearable>
    <el-option v-for="item in state.cityList" :key="item.areaId" :label="item.areaName" :value="item" />
  </el-select>
  <el-select v-model="area" placeholder="区" class="w120" style="margin-right: 0" value-key="areaId" filterable clearable>
    <el-option v-for="item in state.areaList" :key="item.areaId" :label="item.areaName" :value="item" />
  </el-select>
</template>

<script setup lang="tsx">
import { PropType, ref, watch, defineEmits, onMounted, reactive } from 'vue';
import http from '@/utils/http';

interface City {
  areaName: string;
  id: number;
  areaId: number;
  parentAreaId: number;
}

const province = ref();
const city = ref();
const area = ref();

const state = reactive<{
  provinceList: Array<City>;
  cityList: Array<City>;
  areaList: Array<City>;
}>({
  provinceList: [],
  cityList: [],
  areaList: []
});

const emits = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: Array as PropType<Array<any>>,
    default: () => []
  }
});

const updateData = () => {
  emits('update:modelValue', [province.value, city.value, area.value]);
};

const fetchCity = async (parentId?: string) => {
  return http.request({
    url: '/ops/district/queryDistrictByParentId',
    method: 'post',
    data: {
      parentId
    }
  });
};

const fetchNext = async (parentId: string, key: 'provinceList' | 'cityList' | 'areaList') => {
  state[key] = await fetchCity(parentId);
};

watch(
  () => props.modelValue,
  (val) => {
    if (!val || !val.length) {
      state.cityList = [];
      state.areaList = [];
      province.value = '';
      city.value = '';
      area.value = '';
    }
  }
);

watch(
  () => province.value,
  (val) => {
    city.value = '';
    area.value = '';
    state.cityList = [];
    state.areaList = [];
    updateData();
    if (val) {
      fetchNext(val.areaId, 'cityList');
    }
  }
);
watch(
  () => city.value,
  (val) => {
    area.value = '';
    state.areaList = [];
    updateData();
    if (val) {
      fetchNext(val.areaId, 'areaList');
    }
  }
);
watch(
  () => area.value,
  () => {
    updateData();
  }
);

onMounted(async () => {
  state.provinceList = await fetchCity();
});
</script>

<style lang="scss">
.w120 {
  width: 153px !important;
  margin-right: 6px;
  .el-input {
    width: 153px;
  }
}
</style>
