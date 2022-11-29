<template>
  <el-form ref="formRef" :model="dynamicValidateForm" label-width="120px" class="demo-dynamic" :rules="formRules">
    <el-form-item label="name" prop="params.name">
      <el-input v-model.trim="dynamicValidateForm.params.name" />
    </el-form-item>
    <el-form-item
      prop="email"
      label="Email"
      :rules="[
        {
          required: true,
          message: 'Please input email address',
          trigger: 'blur'
        },
        {
          type: 'email',
          message: 'Please input correct email address',
          trigger: ['blur', 'change']
        }
      ]"
    >
      <el-input v-model="dynamicValidateForm.email" />
    </el-form-item>
    <el-form-item
      v-for="(domain, index) in dynamicValidateForm.domains"
      :key="domain.key"
      :label="'Domain' + index"
      :prop="'domains.' + index + '.value'"
      :rules="{
        required: true,
        message: 'domain can not be null',
        trigger: 'blur'
      }"
    >
      <el-input v-model="domain.value" />
      <el-button class="mt-2" @click.prevent="removeDomain(domain)"> Delete </el-button>
    </el-form-item>
    <el-form-item
      v-for="(a, index) in dynamicValidateForm.params.aa"
      :key="a.key"
      :label="'aa' + index"
      :prop="'params.aa.' + index + '.value'"
      :rules="{
        required: true,
        message: 'domain can not be null',
        trigger: 'blur'
      }"
    >
      <el-input v-model="a.value" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(formRef)"> Submit </el-button>
      <el-button @click="addDomain"> New domain </el-button>
      <el-button @click="resetForm(formRef)"> Reset </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { FormInstance } from 'element-plus';

interface DomainItem {
  key: number;
  value: string;
}

const formRules = {
  'params.name': [
    {
      required: true,
      message: 'domain can not be null',
      trigger: 'blur'
    }
  ]
};

const formRef = ref<FormInstance>();
const dynamicValidateForm = reactive<{
  domains: DomainItem[];
  email: string;
  params: any;
}>({
  domains: [
    {
      key: 1,
      value: ''
    }
  ],
  email: '',
  params: {
    aa: [
      { value: '', label: '1' },
      { value: '', label: '2' }
    ],
    name: ''
  }
});

const removeDomain = (item: DomainItem) => {
  const index = dynamicValidateForm.domains.indexOf(item);
  if (index !== -1) {
    dynamicValidateForm.domains.splice(index, 1);
  }
};

const addDomain = () => {
  dynamicValidateForm.domains.push({
    key: Date.now(),
    value: ''
  });
};

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!');
    } else {
      console.log('error submit!');
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
