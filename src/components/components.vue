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

    <p>====================</p>
    <h1>el-input</h1>

    <p>====================</p>
    <h1>el-input</h1>
    <el-cascader v-model="value2" :options="options2" :props="props" @change="handleChange" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

import XLSX from 'xlsx';

const res = {
  msg: '处理成功',
  code: '0',
  data: {
    1: [
      {
        boxLine: 1,
        boxColumn: 1,
        deviceUid: '123987_71950',
        deviceNo: '123987',
        boxCode: '1-1'
      }
    ],
    2: [
      {
        deleteFlag: 0,
        boxLine: 2,
        boxColumn: 2,
        deviceUid: '123987_71950',
        deviceNo: '123987',
        boxCode: '2-1'
      }
    ]
  }
};
const getPostParams = () => {
  return gridCabinetList.map((gridCabinet, index) => {
    const data = {
      containerCode: String.fromCharCode(index + 65),
      cellRow: gridCabinet.table.length,
      cellCol: gridCabinet.table[0].length,
      cellLength: gridCabinet.cellLength,
      cellWidth: gridCabinet.cellWidth,
      cellHeight: gridCabinet.cellHeight
    };
    console.log('data=====', data);
  });
};

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

const gridCabinetList = reactive([
  {
    cellLength: undefined,
    cellWidth: undefined,
    cellHeight: undefined,
    table: [
      [
        {
          boxLine: 1,
          boxColumn: 1,
          boxCode: 1
        }
      ]
    ]
  }
]);

const table = reactive([
  {
    boxLine: 1,
    boxColumn: 1,
    boxCode: 1,
    '01': '123'
  }
]);
const tableProps = reactive([
  {
    prop: '01'
  }
]);

const pageParams = reactive({
  type: 'add',
  index: 0
});

const state: Record<string, any> = reactive({
  fileList: [],
  dialogVisible: false,
  boxList: [
    {
      boxLine: 1,
      boxColumn: 1,
      boxCode: ''
    }
  ]
});

const formatIndex = (index) => {
  return Number(index) < 10 ? '0' + index : index + '';
};
const handelChange = (type, action) => {
  const handelArray = [];
  const propsLength = tableProps.length;
  // handelArray = gridCabinetList[gridCabinetIndex].table;
  const len = gridCabinetList.length;
  // if (type === 'row') {
  //   handelArray = gridCabinetList[gridCabinetIndex].table;
  // } else {
  //   handelArray = gridCabinetList[gridCabinetIndex].table[0];
  // }
  const handelMap = {
    add: {
      limit: 10,
      msg: '最多添加',
      row: () => {
        table.push({});
      },
      col: () => {
        tableProps.push({
          prop: formatIndex(tableProps.length)
        });
      }
    },
    delete: {
      limit: 1,
      msg: '最少保留',
      row: () => {
        handelArray.pop();
      },
      col: () => {
        handelArray.pop();
      }
    }
  };
  if (handelArray.length === handelMap[action].limit) {
    // this.$message.error(handelMap[action].msg + handelMap[action].limit + (type === 'row' ? '行' : '列'));
    alert(123);
  } else {
    handelMap[action][type]();
  }
  if (type === 'col') {
    // this.$nextTick(() => {
    //   // 重新渲染表格，消除抖动
    //   this.$refs['table' + gridCabinetIndex][0].doLayout();
    // });
  }
};
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

const value2 = ref([]);

const props = {
  multiple: true
};

const handleChange = (value) => {
  console.log(value);
};

const options2 = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Disciplines',
        children: [
          {
            value: 'consistency',
            label: 'Consistency'
          },
          {
            value: 'feedback',
            label: 'Feedback'
          },
          {
            value: 'efficiency',
            label: 'Efficiency'
          },
          {
            value: 'controllability',
            label: 'Controllability'
          }
        ]
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'side nav',
            label: 'Side Navigation'
          },
          {
            value: 'top nav',
            label: 'Top Navigation'
          }
        ]
      }
    ]
  },
  {
    value: 'component',
    label: 'Component',
    children: [
      {
        value: 'basic',
        label: 'Basic',
        children: [
          {
            value: 'layout',
            label: 'Layout'
          },
          {
            value: 'color',
            label: 'Color'
          },
          {
            value: 'typography',
            label: 'Typography'
          },
          {
            value: 'icon',
            label: 'Icon'
          },
          {
            value: 'button',
            label: 'Button'
          }
        ]
      },
      {
        value: 'form',
        label: 'Form',
        children: [
          {
            value: 'radio',
            label: 'Radio'
          },
          {
            value: 'checkbox',
            label: 'Checkbox'
          },
          {
            value: 'input',
            label: 'Input'
          },
          {
            value: 'input-number',
            label: 'InputNumber'
          },
          {
            value: 'select',
            label: 'Select'
          },
          {
            value: 'cascader',
            label: 'Cascader'
          },
          {
            value: 'switch',
            label: 'Switch'
          },
          {
            value: 'slider',
            label: 'Slider'
          },
          {
            value: 'time-picker',
            label: 'TimePicker'
          },
          {
            value: 'date-picker',
            label: 'DatePicker'
          },
          {
            value: 'datetime-picker',
            label: 'DateTimePicker'
          },
          {
            value: 'upload',
            label: 'Upload'
          },
          {
            value: 'rate',
            label: 'Rate'
          },
          {
            value: 'form',
            label: 'Form'
          }
        ]
      },
      {
        value: 'data',
        label: 'Data',
        children: [
          {
            value: 'table',
            label: 'Table'
          },
          {
            value: 'tag',
            label: 'Tag'
          },
          {
            value: 'progress',
            label: 'Progress'
          },
          {
            value: 'tree',
            label: 'Tree'
          },
          {
            value: 'pagination',
            label: 'Pagination'
          },
          {
            value: 'badge',
            label: 'Badge'
          }
        ]
      },
      {
        value: 'notice',
        label: 'Notice',
        children: [
          {
            value: 'alert',
            label: 'Alert'
          },
          {
            value: 'loading',
            label: 'Loading'
          },
          {
            value: 'message',
            label: 'Message'
          },
          {
            value: 'message-box',
            label: 'MessageBox'
          },
          {
            value: 'notification',
            label: 'Notification'
          }
        ]
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'menu',
            label: 'Menu'
          },
          {
            value: 'tabs',
            label: 'Tabs'
          },
          {
            value: 'breadcrumb',
            label: 'Breadcrumb'
          },
          {
            value: 'dropdown',
            label: 'Dropdown'
          },
          {
            value: 'steps',
            label: 'Steps'
          }
        ]
      },
      {
        value: 'others',
        label: 'Others',
        children: [
          {
            value: 'dialog',
            label: 'Dialog'
          },
          {
            value: 'tooltip',
            label: 'Tooltip'
          },
          {
            value: 'popover',
            label: 'Popover'
          },
          {
            value: 'card',
            label: 'Card'
          },
          {
            value: 'carousel',
            label: 'Carousel'
          },
          {
            value: 'collapse',
            label: 'Collapse'
          }
        ]
      }
    ]
  },
  {
    value: 'resource',
    label: 'Resource',
    children: [
      {
        value: 'axure',
        label: 'Axure Components'
      },
      {
        value: 'sketch',
        label: 'Sketch Templates'
      },
      {
        value: 'docs',
        label: 'Design Documentation'
      }
    ]
  }
];
</script>

<style scoped>
.table-append-action {
  width: 149px;
  text-align: center;
  padding: 8px 0;
  border-right: solid 1px rgb(235, 238, 245);
}
</style>
