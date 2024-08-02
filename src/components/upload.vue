<template>
  <el-form ref="formRef" :model="state.formData" label-width="110px" label-position="left" class="area-station-form">
    <el-form-item label="停靠点照片" prop="picture">
      <el-upload v-model="state.fileList" v-model:file-list="state.fileList" action="" list-type="picture-card" :auto-upload="false" :on-change="saveFile" :limit="1" accept=".jpg" />
      <div v-if="!state.uploadDisabled" class="add-pic">请选择</div>
      <div v-else class="del-pic" @click="handleDelFile">删除</div>
    </el-form-item>
    <el-button @click="saveFn" />
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { uploadQcloudFile } from '@/utils/index';

const state = reactive({
  show: false,
  loading: false,
  formData: {} as Record<string, any>,
  curItem: {} as Record<string, any>,
  buildingList: [] as Array<any>,
  floorList: [] as Array<any>,
  uploadDisabled: false,
  file: '' as any,
  fileList: [] as Array<any>
});

const formRef = ref();
const saveFn = async () => {
  try {
    await formRef.value.validate();
    state.loading = true;
    if (state.file) {
      const token = await getImageToken();
      const url: any = await uploadQcloudFile(token, state.file?.raw);
      await fetchMapPoint(url);
    }
  } catch (error) {
    state.loading = false;
  }
};

const saveFile = (file: any, fileList: any) => {
  try {
    state.file = file;
    state.fileList = fileList;
  } catch (e) {
    console.log(e);
  }
};

const handleDelFile = () => {
  try {
    state.fileList = [];
  } catch (e) {
    console.log(e);
  }
};
</script>

<style lang="scss" scoped></style>
