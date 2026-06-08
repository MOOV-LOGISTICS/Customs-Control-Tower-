<template>
    <div class="app-container" style="width:90%;height:100%;;">

        <el-form :show-message="false" size='mini' :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch"
            label-width="100px">
            <!-- 搜索工作栏 -->
            <el-form-item  prop="carrierCode">
                <el-select filterable v-model="carrierCode" clearable>
                    <el-option v-for="dict in getDictDatas(DICT_TYPE.CARRIER)" :key="dict.value" :label="dict.label+' ('+dict.value+')'"
                        :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="" prop="name">
                <el-input v-model="businessNumber" placeholder="B/L number" clearable />
            </el-form-item>
            <el-form-item  label="" prop="name">
                <el-input v-model="containerNumber" placeholder="Container number" clearable />
            </el-form-item>
            <el-form-item>
                <el-button @click="remote" type="primary">Track<i class="el-icon-search el-icon--right"></i></el-button>
            </el-form-item>
        </el-form>

        <div v-loading="loading" style="height: 95%;">
            <el-empty v-show="srcUrl==''">

</el-empty>
        <div v-show="srcUrl!=''" style="height:95%;transform: translate(0%, 3%); overflow-y: auto; overflow-x: hidden">
            <iframe style="width: 100%; height: 100%;" :src="srcUrl" frameborder="0" loading="lazy"></iframe>
        </div>
    </div>
    </div>
</template>

<script>
import { trackByBookingNumber } from "@/api/shipment/shipment";

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
            businessNumber: '',
            containerNumber: '',
            carrierCode: '',
            srcUrl: '',
            flag: false,
            blError: "",
            loading: false
        };
    },
    created() {
    },
    methods: {
        remote() {
            if(this.businessNumber!=''&&this.containerNumber!=''){
                this.$notify({
          message: 'Please provide booking number or container number.',
          type: 'warning'
        });
                return false;
            }
            if(this.businessNumber==''&&this.containerNumber==''){
                this.$notify({
          message: 'Please provide booking number or container number.',
          type: 'warning'
        });
                return false;
            }
            this.loading=true
            trackByBookingNumber({
            carrier:this.carrierCode,
            type:this.businessNumber!=''?'':'containerNo',
            bookingNumber:this.businessNumber!=''?this.businessNumber:this.containerNumber
          }).then((res)=>{
            this.loading=false
            if(res.data!=null&&res.data.statusCode=='20000'){
              if(this.containerNumber!=''){
                this.srcUrl = 'https://i.saas.freightower.com/#/ocean/detail?key=MrFe7x4NNpSAQRSoUYNURgwSHG2g6nVGEDlZY3r5xLM@&clientId=q8acc6c57665bf971&containerNo='
                    + this.containerNumber + '&carrierCode=' + res.data.data.result.carrier.code + '&showInfo=1&lang=en'
              }else{
                this.srcUrl = 'https://i.saas.freightower.com/#/ocean/detail?key=MrFe7x4NNpSAQRSoUYNURgwSHG2g6nVGEDlZY3r5xLM@&clientId=q8acc6c57665bf971&billNo='
                    + this.businessNumber + '&carrierCode=' + res.data.data.result.carrier.code + '&showInfo=1&lang=en'
              }

            }else{
                this.srcUrl =''
            }
          })
        }
    }
};
</script>
