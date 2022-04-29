<template>
    <div>
        <h1>hello home!!!!!</h1>
        <button @click="handle">click to myComponent</button>
    </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
    setup() {
        const router = useRouter()
        const route = useRoute()
        
        function handle() {
            console.log('object');
            router.push('/demo')
        }

        return {
            handle 
        }
    },
})
</script>
