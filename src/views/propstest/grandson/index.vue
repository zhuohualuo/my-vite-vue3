<template>
  <div class="grandSon">
    <h1>grandSon11111111</h1>
    grandSon--插值表达式status==={{ status }}
    <br />
    grandSon--插值表达式father==={{ fatherToGrandStatus }}
    <br />
    grandSon--插值表达式son==={{ sonTogranStatus }}
    <br />
    grandSon--插值表达式data==={{ data.b1?.b2Obj }}
    <br />
    grandSon--status==={{ state.status }}
    <br />
    grandSon--data==={{ state.data?.b1?.b2Obj }}
    <br />
    grandSon--fatherStatus==={{ state.fatherToGrandStatus }}
    <br />
    grandSon--sonStatus==={{ state.sonTogranStatus }}
    <br />
    <el-button @click="handlegrandSon"> grandSon---button </el-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch, defineEmits } from 'vue';

const props = defineProps({
  status: {
    type: Number,
    default: 0
  },
  fatherToGrandStatus: {
    type: Number,
    default: 0
  },
  sonTogranStatus: {
    type: Number,
    default: 0
  },
  data: {
    type: Object,
    default: () => ({})
  }
});

const emits = defineEmits(['changeFather', 'changeSon']);

const state: any = reactive({
  status: 0,
  data: {}
});

const handlegrandSon = () => {
  state.status = 33333;
  emits('changeFather', state.status);
  emits('changeSon', state.status);
};

const edit = () => {
  console.log('edit');
  console.log('props.status', props.status);
  console.log('props.data', props.data);
};

watch(
  () => props.status,
  (val: any) => {
    console.log('grandSon===status', val);
    state.status = props.status;
  }
);
watch(
  () => props.fatherToGrandStatus,
  (val: any) => {
    console.log('grandSon===fatherToGrandStatus', val);
    state.fatherToGrandStatus = props.fatherToGrandStatus;
  }
);
watch(
  () => props.sonTogranStatus,
  (val: any) => {
    console.log('grandSon===sonTogranStatus', val);
    state.sonTogranStatus = props.sonTogranStatus;
  }
);
watch(
  () => props.data,
  (val: any) => {
    console.log('grandSon===data', val);
    state.data = props.data;
  }
  // { deep: true }
);

defineExpose({
  edit
});
</script>
