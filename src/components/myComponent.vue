<template>
  <div>
    <h1>hello myComponent</h1>
    <div class="flex">
      <div class="left">123 -----{{ $store.state.count }} 222 -----{{ $store.getters.double }}</div>
      <div class="right">
        <el-button type="primary" @click="handleClick"> 修改 </el-button>
        <el-button type="primary" @click="handleMock"> mock请求 </el-button>
      </div>
    </div>
    <el-divider />
    <div class="flex">
      <div class="left">
        <div>{{ userStore.name }}</div>
      </div>
      <div class="right">
        <el-button type="primary" @click="handlePiniaClick"> pinia修改 </el-button>
      </div>
    </div>
    <el-divider />
    <div>
      <h1>测试 vueUse 的鼠标坐标</h1>
      <h3>Mouse: {{ x }} x {{ y }}</h3>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex';
import { useUserStore } from '@/storePinia/user';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import service from '@/utils/http';
import { useMouse } from '@vueuse/core';

const { x, y } = useMouse();

const store = useStore();
const handleClick = () => {
  console.log('state', store.state.count);
  console.log('getters11111', store.getters.double);
  // 使用 mutation
  store.commit('increment');
  console.log('mutation', store.state.count);
  // 使用 action
  store.dispatch('increment');
  console.log('action', store.state.count);
  console.log('getters22222', store.getters.double);
};

const userStore = useUserStore();
const handlePiniaClick = () => {
  console.log('userStore ', userStore);
  // 使用 action
  userStore.updateName('李四');
};

const handleMock = () => {
  console.log('handleMock----');
  // 此处是封装好的axios请求
  service.request({ url: '/api/getUsers', method: 'get' }).then((res) => {
    console.log('res-----', res);
    if (res.data.code === 0) {
      ElMessage.success(res.data.msg || '请求成功');
    } else {
      ElMessage.error(res.data.msg || '请求失败');
    }
  });
};
</script>

<style scoped lang="less">
.flex {
  display: flex;
  justify-content: space-between;
  padding: 24px 240px;
  .left {
    padding: 24px;
  }
  .right {
    margin: 0 8px;
  }
}
</style>
