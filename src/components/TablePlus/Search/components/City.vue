<template>
  <div>
    <el-select v-model="province" size="default" placeholder="省" class="w120" value-key="distId" filterable clearable @change="provinceChange">
      <el-option v-for="item in state.provinceList" :key="item.distId" :label="item.name" :value="item" />
    </el-select>
    <el-select v-model="city" size="default" placeholder="市" class="w120" value-key="distId" filterable clearable @change="cityChange">
      <el-option v-for="item in state.cityList" :key="item.distId" :label="item.name" :value="item" />
    </el-select>
    <el-select
      v-model="area"
      size="default"
      placeholder="区"
      class="w120"
      style="margin-right: 0"
      value-key="distId"
      filterable
      clearable
      @change="areaChange"
    >
      <el-option v-for="item in state.areaList" :key="item.distId" :label="item.name" :value="item" />
    </el-select>
  </div>
</template>

<script setup lang="tsx">
  import { PropType, ref, watch, defineEmits, onMounted, reactive } from 'vue'
  import { getAllProvince, getDistrictList } from '@/api/building'
  import http from '@/utils/http'

  interface City {
    name: string
    id: number
    distId: number
    parentdistId: number
  }

  const province = ref()
  const city = ref()
  const area = ref()

  const state = reactive<{
    provinceList: Array<City>
    cityList: Array<City>
    areaList: Array<City>
  }>({
    provinceList: [],
    cityList: [],
    areaList: []
  })

  const emits = defineEmits(['update:modelValue'])

  const props = defineProps({
    modelValue: {
      type: Array as PropType<Array<any>>,
      default: () => []
    }
  })

  const updateData = () => {
    emits('update:modelValue', [province.value, city.value, area.value])
  }

  const fetchCity = async (type: number, parentId?: string) => {
    return http.request({
      url: '/adp/district/findDistrictsByParentAndType',
      method: 'post',
      data: {
        type,
        parentDistId: parentId
      },
      requestOptions: {
        ignoreCancel: true,
        errorMessageLevel: 'none'
      }
    })
  }

  const fetchNext = async (parentId: string, key: 'provinceList' | 'cityList' | 'areaList') => {
    if (key === 'cityList') {
      state[key] = await fetchCity(3, parentId)
    } else if (key === 'areaList') {
      state[key] = await fetchCity(4, parentId)
    }
  }

  watch(
    () => props.modelValue,
    (val) => {
      console.log('val----', val)
      if (!val || !val.length) {
        state.cityList = []
        state.areaList = []
        province.value = ''
        city.value = ''
        area.value = ''
      } else {
        console.log(val, 9999)
        province.value = val[0]
        city.value = val[1]
        area.value = val[2]
        console.log('province.value--', province.value)
        console.log('city.value--', city.value)
        fetchNext(val[0].distId, 'cityList')
        fetchNext(val[1].distId, 'areaList')
      }
    }
  )

  const provinceChange = (val: any) => {
    city.value = ''
    area.value = ''
    state.cityList = []
    state.areaList = []
    updateData()
    if (val) {
      fetchNext(val.distId, 'cityList')
    }
  }

  const cityChange = (val: any) => {
    area.value = ''
    state.areaList = []
    updateData()
    if (val) {
      fetchNext(val.distId, 'areaList')
    }
  }

  const areaChange = () => {
    updateData()
  }

  onMounted(async () => {
    state.provinceList = await getAllProvince()
  })
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
