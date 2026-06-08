<!-- KB LINER AGENCY PTE. LTD(该租户专属，将edi嵌入moov) -->
<template>
    <div class="app-container">
        <el-card class="Iframe pd-20" style="padding-top: 20px;">
            <iframe src="https://shipping.kbliner.com/pyApi/edi?seacret_key=d5f985d69cf3ef990172c386ec7e913e"
                frameborder="0" width="100%" :height="height"></iframe>
        </el-card>
    </div>
</template>
<script>
import { getBaseHeader } from "@/utils/request";
// TODO 动态Key 生成
export default {
    name: 'Iframe',
    data() {
        return {
            height: document.documentElement.clientHeight - 94.5 + 'px;',
            loading: true,
            url: this.src
        }
    },
    created() {
        this.height = document.documentElement.clientHeight - 94.5 + 'px;'
    },
    methods: {}
}
</script>
  