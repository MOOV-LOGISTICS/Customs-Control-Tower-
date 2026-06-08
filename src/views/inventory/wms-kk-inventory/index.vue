<template>
    <div class="app-container">
        <div style="margin-bottom: 20px">
            <el-card style="background: transparent; box-shadow: none !important">
                <el-card class="pd-20" style="float: left; width: auto; margin-right: 20px">
                    <span @click="handleExport">
                        <icon-park type="inbox-download-r" theme="filled" size="48" fill="#004F7C"
                            strokeLinejoin="miter" strokeLinecap="square" />
                    </span>
                    <span  @click="handleImport()" v-hasPermi="['wms:warehouse:import']">
                        <icon-park type="inbox-upload-r" theme="filled" size="48" fill="#004F7C" 
                        strokeLinejoin="miter" strokeLinecap="square"/>
                    </span>
                </el-card>
                <el-card class="pd-20" style="float: left; width: auto; margin-right: 20px" v-if="!shouColumn">
                    <img :src="notOnhandIcon" alt="Example Image" class="icon-image"
                        style="border-right: 1px solid #ddd" />
                    <div @click="handChange(false)"
                        style="cursor: pointer; padding: 0px 5px; border-radius: 10px; float: right; line-height: 24px; margin-left: 10px;">
                        <p style="font-size: 20px">
                            {{
                            onHandDataInfo.notOnHand
                            }}
                        </p>
                        <p>
                            Not on hand
                        </p>
                    </div>
                </el-card>
                <el-dialog
                :title="upload.title"
                :visible.sync="upload.open"
                width="400px"
                append-to-body
              >
                <el-upload
                    ref="upload"
                    :limit="1"
                    accept=".xlsx, .xls"
                    :auto-upload="false"
                    :headers="upload.headers"
                    :action="upload.url"
                    :disabled="upload.isUploading"
                    v-loading="upload.isUploading"
                    :on-progress="handleFileUploadProgress"
                    :on-success="handleFileSuccess"
                    :on-error="handleFileError"
                    :file-list="fileList" 
                  drag
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">
                    {{ $t("purchaseOrder.DragTheFileHereOr")
                    }}<em>{{ $t("purchaseOrder.clickUpload") }}</em>
                  </div>
                  <div class="el-upload__tip text-center" slot="tip">
                    <div>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</div>
                    <el-link
                      type="primary"
                      :underline="false"
                      style="font-size: 12px; vertical-align: baseline"
                      @click="downloadImportTemplate"
                    > Import Template
                    </el-link>
                  </div>
                </el-upload>
                   <div slot="footer" class="dialog-footer">
                        <el-button size="mini" type="primary" :disabled="upload.isUploading" @click="submitFileForm">{{
                        $t("purchaseOrder.confirm")
                        }}</el-button>
                        <el-button size="mini" @click="upload.open = false">{{
                        $t("purchaseOrder.cancel")
                        }}</el-button>
                    </div>
              </el-dialog>
                <el-card class="pd-20" style="float: left; width: auto; margin-right: 20px">
                    <img :src="onhandIcon" alt="Example Image" class="icon-image"
                        style="border-right: 1px solid #ddd" />
                    <div @click="handChange(true)"
                        style=" cursor: pointer; padding: 0px 15px; border-radius: 10px; float: right; line-height: 24px; margin-left: 10px;">
                        <p style="font-size: 20px">
                            {{
                            onHandDataInfo.onHand
                            }}
                        </p>
                        <p>
                            On hand
                        </p>
                    </div>
                </el-card>

                <el-card class="pd-20" style="float: left; width: auto; margin-right: 20px" v-if="shouColumn">
                    <img :src="onhandIcon" alt="Example Image" class="icon-image"
                        style="border-right: 1px solid #ddd" />
                    <div @click="handChange(true)"
                        style=" cursor: pointer; padding: 0px 15px; border-radius: 10px; float: right; line-height: 24px; margin-left: 10px;">
                        <p style="font-size: 20px">
                            {{
                            onHandDataInfo.totalVolume
                            }}
                        </p>
                        <p>
                            Total Volume
                        </p>
                    </div>
                </el-card>
            </el-card>
        </div>
        <el-card class="inventory-list pd-20" style="padding-top: 20px">
            <!-- 搜索工作栏 -->
            <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                label-width="68px">
                <div style="float: left; padding-top: 8px">
                    <div style="float: left; padding: 10px 0px" v-if="!shouColumn">
                        <el-select v-model="queryParams.skuId" placeholder="Article Number" clearable filterable
                            @keyup.enter.native="handleQuery">
                            <el-option v-for="product in productList" :key="product.id" :label="product.skuId"
                                :value="product.skuId">
                            </el-option>
                        </el-select>
                    </div>
                    <div style="float: left; padding: 10px 0px" v-if="shouColumn">
                           <el-input v-model="queryParams.skuId" placeholder="Article Number" clearable
                            @keyup.enter.native="handleQuery" @blur="queryParams.skuId = $event.target.value.trim()"/>
                    </div>

                    <div style="float: left; margin-left: 5px; padding: 10px 0px">
                        <el-button @click="handleQuery" type="primary">
                            Search
                            <i class="el-icon-search el-icon--right"></i>
                        </el-button>
                    </div>
                </div>
            </el-form>

            <!-- 列表 -->
            <el-table :height="tableHeight" v-loading="loading" :data="list" border>
                <el-table-column label="Warehouse" align="center" prop="warehouse" />
                <el-table-column v-if="!shouColumn" label="Category Code" align="center" prop="categoryCode" />
                <el-table-column label="Article Number" align="center" prop="skuId" />
                <el-table-column label="Product Name" min-width="200px" align="center" prop="skuNameEn" />
                <el-table-column label="On hand Qty" align="center" prop="qtyOnHand" />
                
                <el-table-column v-if="!shouColumn"  label="Inbound Qty" align="center" prop="qtyInbound" />
                <el-table-column v-if="!shouColumn"  label="Outbound Qty" align="center" prop="qtyOutbound" />
                <el-table-column v-if="shouColumn"  min-width="140px" label="Total Pcs" align="center" prop="totalPiecesAllocated" />
                <el-table-column v-if="shouColumn" min-width="140px"  label="Pcs Available" align="center" prop="totalPiecesAvailable" />
                <el-table-column v-if="shouColumn"  min-width="140px" label="Pcs Blocked" align="center" prop="totalPiecesBlocked" />
                <el-table-column label="Unit" align="center" prop="skuUnit" />
                <el-table-column v-if="!shouColumn" label="Weight" align="center" prop="weight" >
                    <template #default="scope">
                        {{ formatNumberWithFallback(scope.row.weight) }}
                    </template>
                </el-table-column>
                <el-table-column label="Volume" align="center" prop="volume" >
                    <template #default="scope">
                        {{ formatNumberWithFallback(scope.row.volume) }}
                    </template>
                </el-table-column>
                <el-table-column label="Cartons Quantity" min-width="120px" align="center" prop="cartonsQty" />
            </el-table>
            <!-- 分页组件 -->
            <pagination :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList" />
        </el-card>
    </div>
</template>
<style scoped>
.icon-image {
    width: 50px;
    /* 设置图片宽度 */
    height: 50px;
    /* 设置图片高度 */
}
</style>

<script>
import { getInventoryPage, exportInventoryExcel, handReport,
     downloadInventoryTemplate
} from "@/api/order/wmsKkInventory";
import { getWarehousePage } from "@/api/system/warehouse";
import { getProductPage } from "@/api/system/product";
import { getBaseHeader } from "@/utils/request";
import "@icon-park/vue/styles/index.css";
import { IconPark } from "@icon-park/vue/es/all";
import onhandIcon from "@/assets/blue-warehouse.png";
import notOnhandIcon from "@/assets/red-warehouse.png";
import { getTenantId} from "@/utils/auth"
import { DICT_TYPE, getDictDatas } from "@/utils/dict";
export default {
    name: "Inventory",
    components: {
        IconPark,
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 导出遮罩层
            exportLoading: false,
            // 显示搜索条件
            showSearch: true,
            tableHeight: 0,
            // 总条数
            total: 0,
            // order_inventory列表
            list: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNo: 1,
                pageSize: 20,
                source: null,
                customer: null,
                skuId: null,
                skuName: null,
                warehouse: null,
                categoryCode : null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {},
            warehouseList: [],
            productList: [],
            notOnhandIcon,
            onhandIcon,
            onHandDataInfo: {
                notOnHand: 0,
                onHand: 0,
                totalVolume: 0,
                totalWeight: 0,
            },
            // 用户导入参数
            upload: {
                // 是否显示弹出层（用户导入）
                open: false,
                // 弹出层标题（用户导入）
                title: "",
                // 是否禁用上传
                isUploading: false,
                // 设置上传的请求头部
                headers: getBaseHeader(),
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + '/admin-api/warehouse/kk/inventory/importInventory'
            },
            checkLoading :false,
            fileList:[],
            shouColumn: false,
        };
    },
    created() {

        var tenantDatas = this.getDictDatas(DICT_TYPE.PUSH_TO_NINGBO_WMS_TENANT)
        var tenantId = getTenantId()
        //指定租户查看列
        if(tenantDatas && tenantId != null){ 
            for (var tenants of tenantDatas) {
                if (tenants.label == 'tenantIds' && tenants.value?.split(',').map(item => item.trim()).includes(tenantId)) { 
                    this.shouColumn = true
                }
            }
        }
        this.getList();
        this.getWarehousePage();
        this.getProductPage();
        this.calcTableHeight();
        this.handReport();

    },
    methods: {
        formatNumberWithFallback(value) {
            // 尝试转换为数字
            const num = Number(value)
            // 若转换失败（NaN），返回原始值；否则保留2位小数
            return isNaN(num) ? value : num.toFixed(2)
        },
        calcTableHeight() {
            const clientHeight = document.documentElement.clientHeight;
            this.tableHeight = clientHeight - 390;
        },
        /** 查询列表 */
        getList() {
            this.loading = true;
            
            if(this.shouColumn){ 
                // 不显示库存是0的
                this.queryParams['notShowZero'] = true;
            }
            // 执行查询
            getInventoryPage(this.queryParams).then((response) => {
                this.list = response.data.list;
                this.total = response.data.total;
                this.loading = false;
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNo = 1;
            this.getList();
        },
        /** 导出按钮操作 */
        handleExport() {
            this.$modal
                .confirm(this.$t("purchaseOrder.confirmThatAllDataItemsAreExported"))
                .then(() => {
                    // 处理查询参数
                    let params = { ...this.queryParams };
                    console.log(params);
                    params.pageNo = undefined;
                    params.pageSize = undefined;
                    if(this.shouColumn){ 
                        // 不显示库存是0的
                        params.notShowZero = true;
                    }
                    this.exportLoading = true;
                    return exportInventoryExcel(params);
                })
                .then((response) => {
                    this.$download.excel(response, "smartMOOV_inventory" + this.parseTimeToZ2(new Date()) + ".xlsx");
                    this.exportLoading = false;
                })
                .catch((error) => {
                    console.error('Error in exportInventoryExcel:', error);
                    this.exportLoading = false;
                });
        },
        getWarehousePage() {
            getWarehousePage({ pageNo: 1, pageSize: 100, status: 0 }).then(
                (response) => {
                    this.warehouseList = response.data.list;
                }
            );
        },
        getProductPage() {
            getProductPage({ pageNo: 1, pageSize: 10000, status: 0 }).then(
                (response) => {
                    this.productList = response.data.list
                    .filter(product => product !== null && product.code !== null)
                    .map(product => ({
                        id: product.id,
                        skuId: product.code,
                        skuName: product.name
                    }));
                }
            );
        },
        parseTimeToZ1(timestamp) {
            if (!timestamp) return null;
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");
            const seconds = date.getSeconds().toString().padStart(2, "0");

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}Z`;
        },
        parseTimeToZ2(timestamp) {
            if (!timestamp) return null;
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");
            const seconds = date.getSeconds().toString().padStart(2, "0");

            return `${year}${month}${day}${hours}${minutes}`;
        },
        handChange(flag) {
            this.queryParams.isOnHand = flag;
            this.getList();
            this.queryParams.isOnHand = null;
        },
        handReport() {
            handReport().then((response) => {
                this.onHandDataInfo = response.data;
            });
        },
        /** 导入按钮操作 */
        handleImport() {
            this.upload.title = "Upload";
            this.upload.open = true;
        },
        downloadImportTemplate(){
            this.upload.isUploading = true;
            downloadInventoryTemplate(this.form.rule).then((res)=>{
                this.$download.excel(res, "import_inventory_template.xlsx");
                this.upload.isUploading = false;
            })
        },
        // 文件上传中处理
        handleFileUploadProgress(event, file, fileList) {
            this.upload.isUploading = true;
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
            if (response.code !== 0) {
                this.$modal.msgError(response.msg);
                this.$refs.upload.clearFiles();
                this.upload.isUploading = false;
                return;
            }
            this.upload.open = false;
            this.upload.isUploading = false;
            this.$refs.upload.clearFiles();
            this.getList();
        },
        // 文件上传失败处理
        handleFileError(err, file, fileList){
            console.log(err)
            this.upload.isUploading = false;
            this.$refs.upload.clearFiles();
        },
        // 提交上传文件
        submitFileForm() {
            this.$refs.upload.submit();
        },
      
    },
};
</script>