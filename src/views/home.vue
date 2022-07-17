<template>
  <div>
    <h1>hello home!!!!!</h1>
    <button @click="handle">click to demo</button>
    <button @click="handleComponents">click to myComponent</button>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();

    function handle() {
      console.log('object');
      router.push('/demo');
    }
    function handleComponents() {
      router.push('/components');
    }

    return {
      handle,
      handleComponents
    };
  }
});
</script>
