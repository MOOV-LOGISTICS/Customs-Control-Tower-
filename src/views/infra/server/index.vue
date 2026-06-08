<template>
  <div>
  {{ url }}
    <i-frame v-if="!loading" :src="url" />
  </div>
</template>
<script>
import iFrame from "@/components/iFrame/index";
import { getBaseHeader } from "@/utils/request";
import { getConfigKey } from "@/api/infra/config";
export default {
  name: "InfraAdminServer",
  components: { iFrame },
  data() {
    return {
      url: process.env.VUE_APP_BASE_API + "/admin/applications?token="+getBaseHeader()['Authorization']+'&tenantId='+getBaseHeader()['tenant-id'],
      loading: true
    };
  },
  created() {
    getConfigKey("url.spring-boot-admin").then(response => {
      if (!response.data || response.data.length === 0) {
        return
      }
      this.url = response.data;
    }).finally(() => {
      this.loading = false;
    })
  }
};
</script>
