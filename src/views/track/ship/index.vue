<template>
    <div class="app-container" style="height:100%;">
        <div  style="height:100%;transform: translate(0%, 1%); overflow-y: hidden; overflow-x: hidden" v-show="flag">
            <iframe style="width: 100%; height: 100%;" :src="srcUrl" frameborder="0" ></iframe>
        </div>
    </div>
</template>

<script>
import { getVessels } from "@/api/track/track";

export default {
    name: "SystemTenant",
    components: {
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 导出遮罩层
            exportLoading: false,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 租户列表
            list: [],
            // Customer Plan列表
            packageList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            // vesselNum: '',
            srcUrl: '',
            flag: true,
            loading: false
        };
    },
    created() {
        this.remote()
    },
    methods: {
        remote() {
            getVessels({
                vesselNum:this.$route.query.vesselName
            }).then((res) => {
                this.srcUrl = res.data+'&lang=en';
                this.flag=true;
            })
        },
    }
};
</script>