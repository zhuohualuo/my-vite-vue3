<template>
  <div>
    <h1>components</h1>
    <h1>button Error test</h1>
    <el-button type="primary" @click="testHandle"> test </el-button>
    <p>====================</p>
    <h1>uploadExcel</h1>
    <el-upload class="upload" action="" :auto-upload="false" :on-change="fileChange" :file-list="state.fileList" accept=".xls,.xlsx">
      <el-link type="success"> 导入不可用日期 </el-link>
    </el-upload>
    <el-link type="success" class="download" @click="downTemplate"> 下载模板 </el-link>

    <p>====================</p>
    <h1>message</h1>
    <el-dialog v-model="state.dialogVisible">
      <el-button :plain="true" @click="openHTML"> Use HTML String </el-button>
    </el-dialog>
    <el-button @click="dialogClick"> dialog=== </el-button>

    <p>====================</p>
    <h1>select</h1>
    <el-select v-model="value" filterable placeholder="Select">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>

    <p>====================</p>
    <h1>form</h1>
    <el-form ref="formRef" :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="Approved by">
        <el-input v-model="formInline.user" placeholder="Approved by" />
      </el-form-item>
      <el-form-item label="Activity zone">
        <el-select v-model="formInline.region" placeholder="Activity zone">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit"> Query </el-button>
      </el-form-item>
    </el-form>

    <p>====================</p>
    <h1>el-link</h1>
    <el-link type="success" @click="handleLink"> handleLink </el-link>
    <el-button type="success" @click="handleButton"> handleButton </el-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

import XLSX from 'xlsx';

const formRef: FormInstance = ref();
console.log('formRef==', formRef);

const formInline = reactive({
  user: '',
  region: ''
});

const handleLink = () => {
  ElMessage.success('handleLink');
};
const handleButton = () => {
  ElMessage.success('handleButton');
};

const onSubmit = () => {
  console.log('submit!');
};

const value = ref('');
const options = [
  {
    value: 'Option1',
    label: 'Option1'
  },
  {
    value: 'Option2',
    label: 'Option2'
  },
  {
    value: 'Option3',
    label: 'Option3'
  },
  {
    value: 'Option4',
    label: 'Option4'
  },
  {
    value: 'Option5',
    label: 'Option5'
  }
];

const openHTML = () => {
  ElMessage({
    dangerouslyUseHTMLString: true,
    message: '第1行，不可预约日期不能小于当前日期 第2行，不可预约日期不能小于当前日期 第3行，不可预约日期不能小于当前日期 第4行，不可预约日期不能小于当前日期 第5行，不可预约日期不能小于当前日期',
    duration: 0
  });
};
const dialogClick = () => {
  state.dialogVisible = true;
};

const state: Record<string, any> = reactive({
  fileList: [],
  dialogVisible: false
});

const testHandle = () => {
  try {
    throw Error(123);
  } catch (error) {
    throw new Error('error', { cause: error });
  }
};

const fileChange = (file: any, fileList: any) => {
  console.log('11111');
  if (fileList.length > 0) {
    state.fileList = [file.raw];
  }
  // 解析Excel文件
  const reader = new FileReader();
  const rABS = true; // 是否读取为二进制文件
  if (rABS) {
    reader.readAsBinaryString(file.raw);
  } else {
    reader.readAsArrayBuffer(file.raw);
  }
  // 表格回显不可用日期
  reader.onload = function (e: any) {
    let data = e.target.result;
    if (!rABS) {
      data = new Uint8Array(data);
    }
    const obj = XLSX.read(data, { type: rABS ? 'binary' : 'array' });
    const { Sheets, SheetNames } = obj;
    // 读取表格内容
    const array = XLSX.utils.sheet_to_json(Sheets[SheetNames[0]], { raw: false });
    if (!array.length) {
      ElMessage.error('导入日期失败');
      return;
    }
    ElMessage.success('导入日期成功');
  };
};

// 下载模板 需要配置token
const downTemplate = () => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', '/adp/outdoor/distribution/downloadTemplate');
  xhr.responseType = 'blob';
  xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('Authorization'));
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      try {
        const blob = new Blob([xhr.response], { type: 'text/xls' });
        const csvUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = csvUrl;
        link.download = 'unmannedDisableReserveTemplate' + '.xlsx';
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(csvUrl);
      } catch (error) {
        console.log(error);
      }
    }
  };
  xhr.send();
};
</script>
