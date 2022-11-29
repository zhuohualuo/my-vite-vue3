<template>
  <div class="father">
    <h1>father11111111111111</h1>
    father--差值表达式==={{ state.status }}
    <el-button @click="handleFather"> father---button </el-button>

    father---插值表达式data==={{ state.data.b1.b2Obj }}

    <h2>father 中的son</h2>
    <Son :father-to-son-status="state.status" :status="state.status" :data="state.data" @changeFather="toFather" />

    <h2>father 中的 grandSon</h2>
    <GrandSon :father-to-grand-status="state.status" :status="state.status" :data="state.data" @changeFather="toFather" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';

import Son from '../son/index.vue';
import GrandSon from '../grandson/index.vue';

const state: any = reactive({
  status: 100,
  data: {
    a1: 1,
    b1: {
      b2Str: 'b2',
      b2Obj: [{ b3Num: 333 }]
    },
    c1: [{ c2Arr: [{ c3obj: { c4Str: '444' } }] }]
  }
});

const handleFather = () => {
  state.status++;
  state.data.b1.b2Obj[0].b3Num++;
};
const toFather = (val: any) => {
  console.log('toFather===val', val);
  if (val) {
    state.status = val;
  }
};

watch(
  () => state.status,
  (val: any) => {
    console.log('father===val', val);
  }
);
watch(
  () => state.data.b1.b2Obj[0].b3Num,
  (val: any) => {
    console.log('father===data', val);
  }
);
</script>
