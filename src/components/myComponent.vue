<template>
  <div>
    <h1>hello myComponent</h1>
    <div class="flex">
      <div class="left">
        123 -----{{ $store.state.count }} 222 -----{{ $store.getters.double }}
      </div>
      <div class="right">
        <el-button
          type="primary"
          @click="handleClick"
        >
          修改
        </el-button>
        <el-button
          type="primary"
          @click="handleMock"
        >
          mock请求
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import service from '@/utils/http.ts'

import { ElMessage } from 'element-plus'

export default defineComponent({
  setup () {
    const store = useStore()
    const handleClick = () => {
      console.log('state', store.state.count)
      console.log('getters11111', store.getters.double)
      // 使用 mutation
      store.commit('increment')
      console.log('mutation', store.state.count)
      // 使用 action
      store.dispatch('increment')
      console.log('action', store.state.count)
      console.log('getters22222', store.getters.double)
    }

    const handleMock = () => {
      console.log('handleMock----')
      // 此处是封装好的axios请求
      service.request({ url: '/api/getUsers', method: 'get' }).then((res) => {
        console.log('res-----', res)
        if (res.data.code === 0) {
          ElMessage.success(res.data.msg || '请求成功')
        } else {
          ElMessage.error(res.data.msg || '请求失败')
        }
      })
    }

    return {
      handleClick,
      handleMock
    }
  }
})
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
