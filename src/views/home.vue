<template>
  <div>
    <h1>hello home!!!!!</h1>
    <button @click="handle">
      click to myComponent
    </button>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup () {
    const router = useRouter()

    function handle () {
      console.log('object')
      router.push('/demo')
    }

    return {
      handle
    }
  }
})
</script>
