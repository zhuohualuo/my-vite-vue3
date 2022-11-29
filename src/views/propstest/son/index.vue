<template>
  <div class="son">
    <h1>son111111111111</h1>
    son-差值表达式fatherToSonStatus==={{ fatherToSonStatus }}
    <br />
    son-差值表达式status==={{ status }}
    <br />
    son-差值表达式data==={{ data.b1.b2Obj }}
    <br />
    son-fatherToSonData==={{ state.data?.b1?.b2Obj }}
    <br />
    son--fatherToSonStatus==={{ state.fatherToSonStatus }}
    <br />
    son--status==={{ state.status }}
    <el-button @click="handleson"> son---button </el-button>

    <h1>son中的grandSon</h1>
    <GrandSon ref="grandSonRef" :son-togran-status="state.fatherToSonStatus" :status="state.status" :data="state.data" @changeSon="toSon" />

    <h1>son 中的 grandSon==ref</h1>
    <el-button @click="handleSonToGrandSon"> ref==sonToGrandSon </el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';

import GrandSon from '../grandson/index.vue';

const props = defineProps({
  status: {
    type: Number,
    default: 0
  },
  fatherToSonStatus: {
    type: Number,
    default: 0
  },
  data: {
    type: Object,
    default: () => {}
  }
});

const emits = defineEmits(['changeFather']);

const state: any = reactive({
  status: 0,
  data: {}
});

const toSon = (val: any) => {
  console.log('toSon===val', val);
  state.status = val;
};

const handleson = () => {
  state.status = 222222;
  emits('changeFather', state.status);
};

const grandSonRef = ref();

const handleSonToGrandSon = () => {
  console.log('handleSonToGrandSon');
  grandSonRef.value.edit();
};

watch(
  () => props.status,
  (val: any) => {
    console.log('son===status', val);
    state.status = props.status;
  }
);
watch(
  () => props.fatherToSonStatus,
  (val: any) => {
    console.log('son===fatherToSonStatus', val);
    state.fatherToSonStatus = props.fatherToSonStatus;
  }
);
watch(
  () => props.data,
  (val: any) => {
    console.log('son===data', val);
    state.data = props.data;
  },
  { deep: true }
);
</script>
