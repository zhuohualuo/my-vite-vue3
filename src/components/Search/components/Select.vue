/** * 单独包一层，不然jsx解析select导致options更新有问题 */
<script lang="tsx">
import { defineComponent, PropType } from 'vue';

interface Opt {
  value: string;
  label: string;
}

export default defineComponent({
  props: {
    options: {
      type: Array as PropType<Array<Opt>>,
      required: true
    }
  },

  setup(props) {
    return () => (
      <el-select>
        <>
          {props.options.map((opt) => (
            <el-option key={opt.value} label={opt.label} value={opt.value}></el-option>
          ))}
        </>
      </el-select>
    );
  }
});
</script>
