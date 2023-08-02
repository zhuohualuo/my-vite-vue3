<script lang="tsx">
import { defineComponent, onMounted, reactive } from 'vue';
import http from '@/utils/http';

// 避免组件被多次调用的时候，重复发请求
interface CompanyItem {
  expressCompanyName: string;
  expressCompanyId: string;
}
interface OptItem {
  label: string;
  value: string;
  [props: string]: string;
}
let cacheCompanyList: CompanyItem[] = [];

export default defineComponent({
  props: {
    valueField: {
      type: String,
      default: 'value'
    }
  },

  setup(props) {
    const state = reactive<{
      companyList: OptItem[];
    }>({
      companyList: []
    });

    const fetchCompanyList = async () => {
      try {
        if (!cacheCompanyList.length) {
          const data = await http.request({
            url: '/ops/company/listCompany',
            method: 'post'
          });
          cacheCompanyList = data || [];
        }
        state.companyList = cacheCompanyList.map((item) => ({
          value: item.expressCompanyId,
          label: item.expressCompanyName
        }));
      } catch (err) {
        console.log(err);
      }
    };

    onMounted(() => {
      fetchCompanyList();
    });

    return () => (
      <el-select filterable={true}>
        {state.companyList.map((opt) => (
          <el-option key={opt.value} label={opt.label} value={props.valueField === 'item' ? opt : opt[props.valueField as string]}></el-option>
        ))}
      </el-select>
    );
  }
});
</script>
