<template>
  <div>
    <!-- MBL File -->
    <div style="text-align: left;margin-top: 20px;">
      <el-button v-if="isEdit" style="padding-bottom: 10px" type="primary" icon="el-icon-upload2" @click="showUploadDialog">Upload</el-button>
    </div>
    <el-table :data="tableData" v-loading="tableLoading">
      <el-table-column prop="documentNumber" label="Document Number" width="130px" align="center" />
      <el-table-column prop="poNumber" label="PO Number" align="center" />
      <el-table-column prop="shippingOrderNumber" label="SO Ref" align="center" />
      <el-table-column prop="typeCode" label="Document Type" align="center">
        <template #default="scope">
          <span>{{ fileTypes.find(type => type.value === scope.row.typeCode)?.label }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="blType" label="BL Type" align="center">
        <template slot-scope="scope">
          <span>{{ ['03', '04'].includes(scope.row.typeCode) ? scope.row.blType : '/' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fileName" label="File Name" align="center" show-overflow-tooltip />
      <el-table-column label="Action" width="220px" align="center">
        <template #default="scope">
          <ActionButton :url="scope.row.fileUrl" iconType="el-icon-download" type="download" :fileName="scope.row.fileName" />
          <ActionButton :url="scope.row.fileUrl" iconType="el-icon-view" type="preview" :fileName="scope.row.fileName" />
          <el-link>
            <el-button v-if="isEdit" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
          </el-link>
          <el-link v-if="scope.row.typeCode === '04'">
            <el-button style="margin-left: 5px;" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
          </el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- Upload Dialog -->
    <el-dialog :title="uploadSet.title" :visible.sync="showDialog" width="600px" append-to-body v-loading="uploadSet.loading" :before-close="uploadClose">
      <el-form label-width="150px" ref="uploadFormRef" :model="uploadForm" :show-message="false" :rules="rules">
        <el-form-item :label="$t('document.type')" prop="typeCode">
          <el-select v-model="uploadForm.typeCode" @change="handleTypeChange">
            <el-option v-for="(type, index) in fileTypes" :key="index" :label="type.label" :value="type.value"></el-option>
          </el-select>
        </el-form-item>
<el-row v-show="uploadForm.typeCode=='04'&&(uploadForm.showTip!=1&&uploadForm.showTip!=2&&uploadForm.showTip!=3&&uploadForm.showTip!=4)" style="margin: 0px;">
  <el-col>
<div
  style="background-color: #FFFBE6; border: 2px solid #F5E6A5; border-radius: 4px; padding: 5px;margin-bottom: 7px;margin-top: -5px; display: flex; align-items: center; width: 100%; box-sizing: border-box;">
  <i class="el-icon-info" style="color: #E6A23C; margin-right: 8px; font-size: 16px;"></i>
  <span style="color: #8C6A03; font-size: 14px; flex: 1;">Upload an MBL file first to automatically extract the
    information.</span>
</div>
  </el-col>
</el-row>
<el-row v-show="uploadForm.typeCode=='04'&&uploadForm.showTip==1" style="margin: 0px;">
  <el-col>
    <div
      style="background-color: #E6F7FF; border: 2px solid #98D8FF; border-radius: 4px; padding: 5px;margin-bottom: 7px;margin-top: -5px; display: flex; align-items: center; width: 100%; box-sizing: border-box;">
      <i class="el-icon-info" style="color: #1890FF; margin-right: 8px; font-size: 16px;"></i>
      <span style="color: #252623; font-size: 14px; flex: 1;">{{'Please be patient as the file is uploading.('+uploadForm.percent+'%)'}}
      </span>
    </div>
  </el-col>
</el-row>
<el-row v-show="uploadForm.typeCode=='04'&&uploadForm.showTip==2" style="margin: 0px;">
  <el-col>
    <div
      style="background-color: #F6FFED; border: 2px solid #C8F0A9; border-radius: 4px; padding: 5px;margin-bottom: 7px;margin-top: -5px; display: flex; align-items: center; width: 100%; box-sizing: border-box;">
      <i class="el-icon-info" style="color: #52C41A; margin-right: 8px; font-size: 16px;"></i>
      <span style="color: #252623; font-size: 14px; flex: 1;">The uploaded MBL file matches the entered
        information.
      </span>
    </div>
  </el-col>
</el-row>
<el-row v-show="uploadForm.typeCode=='04'&&uploadForm.showTip==3" style="margin: 0px;">
  <el-col>
    <div
      style="background-color: #FFF1F0; border: 2px solid #FFD2CE; border-radius: 4px; padding: 5px;margin-bottom: 7px;margin-top: -5px; display: flex; align-items: center; width: 100%; box-sizing: border-box;">
      <i class="el-icon-info" style="color: #FF4D4F; margin-right: 8px; font-size: 16px;"></i>
      <span style="color: #252623; font-size: 14px; flex: 1;">The uploaded MBL file has partial mismatches with the
        shipment information.</span>
    </div>
  </el-col>
</el-row>
<el-row v-show="uploadForm.typeCode=='04'&&uploadForm.showTip==4" style="margin: 0px;">
  <el-col>
    <div
      style="background-color: #FFF1F0; border: 2px solid #FFD2CE; border-radius: 4px; padding: 5px;margin-bottom: 7px;margin-top: -5px; display: flex; align-items: center; width: 100%; box-sizing: border-box;">
      <i class="el-icon-info" style="color: #FF4D4F; margin-right: 8px; font-size: 16px;"></i>
      <span style="color: #252623; font-size: 14px; flex: 1;">File parsing failed. Please upload a clearer file or enter the information manually.</span>
    </div>
  </el-col>
</el-row>


<el-form-item v-show="uploadForm.typeCode=='04'" :label="$t('document.documentFile')">
  <el-upload ref="uploadFileRef" :limit="1"
    :accept="uploadForm.typeCode === '16' || uploadForm.typeCode === '17' ? 'image/*, .jpeg, .jpg, .png, .gif, .doc, .docx, .pdf, .xls, .xlsx' : '.doc, .docx, .pdf, .xls, .xlsx'"
    :headers="uploadSet.headers" :data="uploadForm" :action="uploadSet.url" :disabled="uploadSet.isUploading"
    :file-list="fileList" v-loading="uploadSet.isUploading" :on-progress="handleFileUploadProgress"
    :on-success="handleUploadSuccess" :on-error="handleUploadError" :auto-upload="false" :on-change="handleFileChange"
    :on-remove="handleRemove"
    drag>
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">
      {{ $t("purchaseOrder.DragTheFileHereOr") }}
      <em>{{ $t("purchaseOrder.clickUpload") }}</em>
    </div>
  </el-upload>
</el-form-item>

        <el-form-item :label="uploadForm.typeCode=='04'?$constants.MBL_NUMBER:$t('document.documentNumber')" prop="documentNumber">
          <el-input :disabled="uploadForm.showTip==1" v-model="uploadForm.documentNumber"></el-input>
        </el-form-item>
        <el-form-item :label="$t('document.status')" v-show="showBlType" prop="blType">
          <el-select :disabled="uploadForm.showTip==1" v-model="uploadForm.blType">
            <el-option label="SEAWAY BILL" value="SEAWAY BILL"></el-option>
            <el-option label="TELEX RELEASE" value="TELEX RELEASE"></el-option>
            <el-option label="ORIGINAL" value="ORIGINAL"></el-option>
          </el-select>
        </el-form-item>

        <!-- container -->
        <!-- <el-form-item label="Container No" prop="containerMatchs"
          v-show="uploadForm.typeCode == '04' && uploadForm.containerMatchs && uploadForm.containerMatchs.length > 0" >
          <span v-for="container in uploadForm.containerMatchs" :key="container.containerNo"
            style="margin: 5px;"
            >
            <el-tooltip effect="dark" placement="bottom">
                <div slot="content">{{ getMatchText(container.match) }}</div>
              <el-tag>
                <i v-if="container.match == 1" class="el-icon-success" style="margin-right: 4px; color: #52C41A;"></i>
                <i v-if="container.match == 2" class="el-icon-warning" style="margin-right: 4px; color: #FAAD14;"></i>
                <i v-if="container.match == 3" class="el-icon-error" style="margin-right: 4px; color: #FF5052;"></i>
                {{ container.containerNo }}
              </el-tag>
            </el-tooltip>
          </span>
        </el-form-item> -->






            <el-card style="margin-top: 20px; margin-bottom: 15px;">
              <el-table :data="uploadForm.containerMatchsList" v-show="uploadForm.typeCode == '04' && uploadForm.containerMatchsList && uploadForm.containerMatchsList.length > 0">
                <el-table-column prop="field" label="Field" min-width="140px" align="center" />
                <el-table-column prop="shipmentInfo" label="Shipment Info" min-width="120px" align="center" />
                <el-table-column prop="uploadFile" label="Upload File" min-width="120px" align="center" />

                <el-table-column prop="result" label="Result" min-width="140px" align="center">
                  <template #default="scope">
                    <el-tag >
                                      <i v-if="scope.row.match == 1" class="el-icon-success" style="margin-right: 4px; color: #52C41A;"></i>
                                      <i v-if="scope.row.match == 2" class="el-icon-warning" style="margin-right: 4px; color: #FAAD14;"></i>
                                      <i v-if="scope.row.match == 3" class="el-icon-error" style="margin-right: 4px; color: #FF5052;"></i>
                      {{scope.row.result}}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>




        <!-- <el-form-item label="Container No"  prop="containerInfo" v-show="uploadForm.typeCode=='04'">
          <div v-for="container in uploadForm.containerInfo" :key="container.containerNo">
              <el-tooltip class="item" effect="dark" content="Bottom Center 提示文字" placement="bottom">
                <el-tag>
                  <i v-show="container.match==1" class="el-icon-success" style="margin-right: 4px; color: #52C41A;"></i>
                  <i v-show="container.match==2" class="el-icon-warning" style="margin-right: 4px; color: #FAAD14;"></i>
                  <i v-show="container.match==3" class="el-icon-error" style="margin-right: 4px; color: #FF5052;"></i>
                  {{ container.containerNo }}</el-tag>
              </el-tooltip>

          </div>


        </el-form-item> -->



        <el-form-item v-show="uploadForm.typeCode!='04'" :label="$t('document.documentFile')">
          <el-upload
            ref="uploadFileRef"
            :limit="1"
            :accept="uploadForm.typeCode === '16' || uploadForm.typeCode === '17' ? 'image/*, .jpeg, .jpg, .png, .gif, .doc, .docx, .pdf, .xls, .xlsx' : '.doc, .docx, .pdf, .xls, .xlsx'"
            :headers="uploadSet.headers"
            :data="uploadForm"
            :action="uploadSet.url"
            :disabled="uploadSet.isUploading"
            :file-list="fileList"
            v-loading="uploadSet.isUploading"
            :on-progress="handleFileUploadProgress"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :auto-upload="false"
            :on-change="handleFileChange"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              {{ $t("purchaseOrder.DragTheFileHereOr") }}
              <em>{{ $t("purchaseOrder.clickUpload") }}</em>
            </div>
          </el-upload>
        </el-form-item>

        <div style="float:right">
          <!-- :disabled="uploadForm.typeCode=='04'&&(uploadForm.showTip==1||uploadSet.notMatch)&&task.country != 'BD'" -->
          <el-button size="mini" v-if="isEdit && showUpload" type="primary"  @click="submitUploadForm">{{ $t("purchaseOrder.confirm") }}</el-button>
          <el-button size="mini" v-if="!showUpload" type="primary" @click="reSubmitForm">{{ $t("purchaseOrder.confirm") }}</el-button>

          <el-button size="mini" @click="uploadClose">{{ $t("purchaseOrder.cancel") }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getBaseHeader } from '@/utils/request'
import {reSaveFile, updateOrderFile} from '@/api/order/task'
import {orderFileList, deleteOrderFile, deleteOrderFileByOrderFileId} from '@/api/pepco/order-file'
import { aiUploadAndAnalyze } from '@/api/system/ai/ai'

export default {
  name: 'PreAlertHandlerUploadFile',
  data() {
    return {
      dialogVisible: false, // 控制弹窗显示的状态
      task: {},
      shipmentId: null,
      tableData: [],
      fileList: [],
      fileTypes: [
        // 上传类型选项
        { label: 'MBL', value: '04' },
        { label: 'Container Loading Picture', value: '16' }
      ],
      isEdit: false,
      shipmentClpDetailList: [],
      tableLoading: false,
      uploadForm: {
        typeCode: undefined,
        documentNumber: '',
        blType: '',
        shippingOrderId: undefined,
        taskName: undefined,
        email: '',
        id: null,
        showTip: 0,
      },
      uploadSet: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: 'Upload Document',
        // 是否禁用上传
        isUploading: false,
        loading: false,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/admin-api/order/task/pepco/order-file/shipment-upload'
      },
      title: 'Task Document',
      showBlType: false,
      rules: {
        documentNumber: [{ required: true, message: 'Document Number is required', trigger: 'blur' }],
        typeCode: [{ required: true, message: 'Document Type is required', trigger: 'change' }],
        blType: [
          {
            required: () => this.uploadForm.typeCode === '04', // 仅在 typeCode=04（MBL）时必填
            message: 'BL Type is required',
            trigger: 'change'
          }
        ]
      },
      showDialog: false,
      showUpload: true,
      originalFileList: [],
      formKey: 0
    }
  },

  methods: {
    getMatchText(match){
      if(match=='1') {
        return 'Macth the upload file';
      }
       if (match == '2') {
        return 'Not found in the uploaded file';
      }
      if (match == '3') {
        return 'Mismatch with the shipment info';
      }

    },
    initComponent(task, shipmentId, isEdit, shipmentClpDetailList) {
      console.log('task', task)
      console.log('shipmentId', shipmentId)
      console.log('shipmentClpDetailList', shipmentClpDetailList)

      this.task = task
      this.shipmentId = shipmentId
      this.isEdit = isEdit
      this.shipmentClpDetailList = shipmentClpDetailList
      this.uploadForm.showTip = 0
      this.getOrderFileList()
    },
    getOrderFileList() {
      this.tableLoading = true
      orderFileList({ shipmentId: this.shipmentId, orderHeaderId: this.task.orderId, taskCode: this.task.taskCode }).then(res => {
        console.log('fileData', res.data)
        this.tableData = res.data
        this.tableLoading = false
      })
    },
    handleUploadSuccess(response, file, fileList) {
      if (response.code !== 0) {
        this.$modal.msgError(response.msg)
        return
      }
      this.uploadSet.open = false
      this.uploadSet.isUploading = false
      this.$refs.uploadFileRef.clearFiles()

      this.uploadForm = {}
      this.uploadSet.loading = false
      this.showUpload = false
      this.showDialog = false
      this.$emit('reload')
      // this.getOrderFileList()
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.uploadSet.isUploading = true
    },
    handleUploadError(err, file, fileList) {
      console.error('Upload error:', err)
    },
    uploadClose() {
      this.showDialog = false
      this.uploadSet.open = false
      this.uploadSet.isUploading = false
      this.$refs.uploadFileRef.clearFiles()
      this.fileList = []
      this.uploadForm = {
        typeCode: undefined,
        documentNumber: '',
        blType: undefined,
        shippingOrderId: undefined,
        shipmentId: undefined,
        taskName: undefined,
        id: null
      }
    }, // 提交上传文件
    submitUploadForm() {
      if (this.uploadForm.typeCode === '04') {
        const specialCharRegex = /[!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~`，。！？；：（）【】《》「」『』｛｝［］～…—·￥、〃〝〞‵′＂]/g
        if (specialCharRegex.test(this.uploadForm.documentNumber)) {
          this.$notify({
            message: 'Special symbols such as (, ! @） are not allowed. Only the symbol "_ ","-" is allowed!',
            type: 'warning'
          })
          return;
        }
      }
      this.uploadSet.url = process.env.VUE_APP_BASE_API + '/admin-api/order/task/pepco/order-file/shipment-upload'
      this.$refs.uploadFileRef.action = this.uploadSet.url // 关键修复
      const originalRules = this.rules.blType

      // 如果typeCode是16，移除blType的校验规则
      if (this.uploadForm.typeCode === '16') {
        this.rules.blType = []
      } else {
        // 否则恢复原始规则
        this.rules.blType = originalRules
      }
      this.$refs.uploadFormRef.validate(valid => {
        //去除bltype的校验
        if (valid) {
          if (this.fileList.length == 0) {
            this.$notify({
              message: 'Please add files before uploading',
              type: 'warning'
            })
            return
          }
          if (this.uploadForm.typeCode === '04' && this.tableData.find(item => item.typeCode === '04')) {
            this.$notify({
              message: 'Only one MBL can be uploaded at a time',
              type: 'warning'
            })
            return
          }
/*           if (this.uploadForm.typeCode === '04') {
            if (this.uploadForm.showTip != 0&&(this.uploadForm.containerMatchsList == undefined || this.uploadForm.containerMatchsList.length == 0) && this.task.country != 'BD') {
              this.$notify({
                message: 'The uploaded MBL file has partial mismatches with the shipment information.',
                type: 'warning'
              })
              return;
            }
            if (this.uploadForm.showTip != 0 &&this.uploadForm.containerMatchsList) {
              for (var container of this.uploadForm.containerMatchsList) {
                if ((container.match == 3 || container.match == 2) && this.task.country != 'BD') {
                  this.$notify({
                    message: 'The uploaded MBL file has partial mismatches with the shipment information.',
                    type: 'warning'
                  })
                  return;
                }
              }
            }
          } */

          this.uploadSet.isUploading = true
          this.uploadForm.taskCode = this.task.taskCode
          this.uploadForm.taskName = this.task.taskName
          this.uploadForm.shipmentId = this.shipmentId
          this.$refs.uploadFileRef.submit()
        }
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.uploadForm.containerMatchs = []
      this.uploadForm.containerMatchsList = []
      this.uploadForm.showTip = 0
      this.uploadForm.percent = 0
      this.uploadForm = JSON.parse(JSON.stringify(this.uploadForm))
    },
    handleFileChange(file, fileList) {
      console.log('11111')
      const type = file.name.split('.').pop().toLowerCase()
      const acceptType = ['csv', 'doc', 'docx', 'ppt', 'pptx', 'rar', 'txt', 'xls', 'xlsx', 'zip', 'pdf', 'jpeg', 'gif', 'jpg', 'png']
      if (acceptType.includes(type)) {
        this.fileList = fileList
      } else {
        this.$message.error('The file format does not meet the upload requirements.')
        this.fileList = []
        return
      }
      console.log('File changed:', file, fileList)
      this.fileList = fileList

      this.uploadForm.containerMatchs = []
      this.uploadForm.containerMatchsList = []

      if(file!=null&& this.uploadForm.typeCode == '04'&& type=='pdf') {
        // 调用接口；获取数据；
        const formData = new FormData();
        formData.append("file", file.raw, file.name)
        formData.append("type", 'mbl')
        console.log('formData')
        console.log(formData)
      //  this.uploadSet.loading = true
       this.uploadSet.notMatch = false

       this.uploadForm.showTip = 1
       this.uploadForm.percent = 0

        var vm = this

        const totalTime = 10000; // 总时长：10秒（10000毫秒）
        const steps = 99; // 从0到99共99步（线性递增，每步+1）
        const fixedInterval = totalTime / steps; // 固定步长间隔（≈101毫秒/步，确保匀速）

        // 初始化进度为0
        vm.uploadForm.percent = 0;

        const updatePercent = () => {
          if (vm.uploadForm.percent < 99) {
            // 线性递增：每次固定+1（核心线性逻辑）
            vm.uploadForm.percent += 1;
            console.log(vm.uploadForm.percent);
            vm.uploadForm = JSON.parse(JSON.stringify(vm.uploadForm))
            // 关键：移除深拷贝，用框架原生响应式触发更新
            // Vue：直接修改属性即可（若已在data中定义percent，自动响应）
            // React：需用setState，下文有适配版

            // 固定间隔递归，确保匀速线性增长
            setTimeout(updatePercent, fixedInterval);
          }
        };

        // 启动线性增长（首次延迟固定间隔，避免初始瞬间跳步）
        setTimeout(updatePercent, fixedInterval);


        aiUploadAndAnalyze(formData).then(response => {
          vm.uploadForm.percent = 100
          vm.uploadSet.loading = false
          console.log('aiUploadAndAnalyze:',response)

          if(response.blNumber && response.documentType && response.containerInfo&& response.containerInfo.length>0) {
            vm.uploadForm.documentNumber = response.blNumber
            vm.uploadForm.blType = response.documentType
            // vm.uploadForm.containerInfo = response.containerInfo

            // 定义校验容器编号格式的正则：4个大写字母 + 7个数字，且无其他字符
            const containerNoReg = /^[A-Z]{4}\d{7}$/;

            // 过滤containerInfo数组，仅保留符合格式的容器信息
            vm.uploadForm.containerInfo = response.containerInfo.filter(item => {
              // 先判断containerNo是否存在，避免空值报错
              if (!item.containerNo) return false;
              // 校验格式，符合则保留，不符合则过滤（屏蔽）
              return containerNoReg.test(item.containerNo.trim());
            });

            // 打印过滤结果，方便验证（可根据需要删除）
            console.log("过滤后的容器信息：", vm.uploadForm.containerInfo);


            // 1. 定义过滤和去重方法
            const filterAndDeduplicate = (arr) => {
              return [...new Set(
                arr.filter(item => item !== null && item !== '' && item !== undefined)
              )];
            };

            // 2. 提取并清洗两个数组的容器编号
            const pdfContainers = filterAndDeduplicate(
              vm.uploadForm.containerInfo.map(detail => detail.containerNo)
            );
            console.log('pdfContainers' + pdfContainers)
            const clpContainers = filterAndDeduplicate(
              vm.shipmentClpDetailList.map(detail => detail.containerNo)
            );
            console.log('clpContainers' + clpContainers)

            // 3. 计算并集（合并两个数组后去重）
            const union = [...new Set([...pdfContainers, ...clpContainers])];
            console.log('union' + union)
            // 3. 计算左差集（仅存在于 pdfContainers 的编号）
            const leftDiff = pdfContainers.filter(no => !clpContainers.includes(no));
            console.log('leftDiff' + leftDiff)
            const rightDiff = clpContainers.filter(no => !pdfContainers.includes(no));
            console.log('rightDiff' + rightDiff)

            // 4. 遍历 uploadForm.containerInfo，设置 match 值
            union.forEach(containerNo => {
              // 排除空值（避免无效数据干扰）
              if (!containerNo || containerNo === '' || containerNo === null) {
                detail.match = 0; // 可选：空值设置为0（表示无效）
                return;
              }
              var item = {};
              var item1 = {};
              item.containerNo = containerNo
              item1.containerNo = containerNo
              item1.field = 'Container No'
              var showTip = 2;
              // 判断是否在左差集 → match=2
              if (leftDiff.includes(containerNo)) {
                item.match = 3;
                item1.shipmentInfo = '-'
                item1.uploadFile = containerNo
                item1.result = 'Mismatch'
                item1.match = 3;
                this.uploadSet.notMatch = true
                showTip = 3;
              } else if (rightDiff.includes(containerNo)) {
                item.match = 2;
                item1.shipmentInfo = containerNo
                item1.uploadFile = '-'
                item1.result = 'Not Found'
                item1.match = 2;
                this.uploadSet.notMatch = true
                showTip = 3;
              } else {
                // 不在左差集 → 属于合集（同时存在于两个数组）→ match=1
                item.match = 1;
                item1.shipmentInfo = containerNo
                item1.uploadFile = containerNo
                item1.result = 'Match'
                item1.match = 1;
              }
              vm.uploadForm.showTip = showTip
              console.log('containerNo match:' + containerNo+ item.match)
              vm.uploadForm.containerMatchs.push(item)
              vm.uploadForm.containerMatchsList.push(item1)
            });

            // （如果需要处理右差集对应的 shipmentClpDetailList，可类似遍历设置）


          } else {
            vm.uploadForm.documentNumber = ''
            vm.uploadForm.blType = ''
            vm.uploadForm.showTip = 4
          }

        }).catch(error => {
          // 捕获所有异常（包括超时、接口错误、网络错误等）
          console.error('接口调用失败:', error);
          vm.uploadForm.documentNumber = ''
          vm.uploadForm.blType = ''
          vm.uploadForm.showTip = 0
          // 可添加用户提示，如：this.$message.error('文件解析失败，请重试')
        })
          .finally(() => {
            // 无论成功/失败/超时，最终都关闭加载状态
            vm.uploadSet.loading = false;
            vm.uploadForm = JSON.parse(JSON.stringify(vm.uploadForm))
          });
      }

    },
    handleTypeChange(value) {
      console.log('选择的类型:', value)
      if (value == '04') {
        this.showBlType = true
      } else {
        this.showBlType = false
      }
    },
    handleDelete(row) {
      console.log('Deleting file:', row)
      this.$confirm(`Delete ${row.fileName}?`, this.$t('Confirm'), {
        type: 'warning'
      }).then(() => {
        deleteOrderFileByOrderFileId(row.id).then(res => {
          if (res.code === 0) {
            this.$notify({
              message: 'Delete Success',
              type: 'success'
            })
            this.$emit('reload')
            // this.getOrderFileList()
          } else {
            this.$notify({
              message: res.msg,
              type: 'error'
            })
          }
        })
      })
    },
    showUploadDialog() {
      this.uploadSet.url = process.env.VUE_APP_BASE_API + '/admin-api/order/task/pepco/order-file/shipment-upload'
      this.uploadForm = {
        typeCode: undefined,
        documentNumber: '',
        blType: '',
        taskName: this.task.taskName,
        id: null
      }
      this.showDialog = true
      this.showUpload = true
      this.uploadSet.open = true
    },
    handleEdit(row) {
      console.log('Editing row:', row)
      this.showUpload = false

      this.uploadForm = {
        taskCode: this.task.taskCode,
        taskName: this.task.taskName,
        documentNumber: row.documentNumber || '',
        typeCode: row.typeCode || '',
        id: row.id || null,
        blType: this.showBlType ? row.blType || '' : '',
        shippingOrderId: row.shippingOrderId || undefined
      }

      //  3. 设置文件列表
      this.originalFileList = [{ name: row.fileName }]
      this.fileList = [{ name: row.fileName }]

      this.formKey = Date.now()
      this.showDialog = true
      this.uploadSet.isUploading = false
      this.showBlType = true
      console.log('this.uploadForm11111:', this.uploadForm)
    },
    reSubmitForm() {
      console.log('resubmit')
      if (this.uploadForm.typeCode === '04') {
        const specialCharRegex = /[!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~`，。！？；：（）【】《》「」『』｛｝［］～…—·￥、〃〝〞‵′＂]/g
        if (specialCharRegex.test(this.uploadForm.documentNumber)) {
          this.$notify({
            message: 'Special symbols such as (, ! @） are not allowed. Only the symbol "_ ","-" is allowed!',
            type: 'warning'
          })
          return;
        }
      }
      this.uploadSet.url = process.env.VUE_APP_BASE_API + '/admin-api/order/task/pepco/order-file/update'
      this.$refs.uploadFileRef.action = this.uploadSet.url // 关键修复
      const uploadFiles = this.$refs.uploadFileRef.uploadFiles
      console.log('uploadFiles', uploadFiles)
      console.log('this.fielList', this.fileList)
      this.uploadSet.isUploading = true
      this.uploadForm.taskCode = this.task.taskCode
      this.uploadForm.taskName = this.task.taskName
      this.uploadForm.shipmentId = this.shipmentId
      console.log('提交的参数', this.uploadForm)
      console.log('提交的参数', this.uploadSet)
      if (this.uploadForm.blType == '' || this.uploadForm.blType == null) {
        // 提示必须选择
        this.$message.error('Please select BL Type')
        this.uploadSet.isUploading = false
        return
      }
      // 判断只更新 其它信息
      if (this.originalFileList[0].name == this.fileList[0].name) {
        // 说明文件没变化
        this.fileList = []
        console.log('没有文件上传，只更新其它信息')
        console.log('新接口的入参', this.uploadForm)
        updateOrderFile(this.uploadForm).then(res => {
          console.log('返回结果', res)
          if (res.code == 0) {
            this.$message.success('File resaved successfully')
            this.$emit('reload')
            // this.getOrderFileList()
          } else {
            this.$message.error(res.msg)
          }
          this.uploadSet.isUploading = false
          this.showDialog = false
        })
      }

      this.$nextTick(() => {
        this.$refs.uploadFileRef.submit()
      })
    }
  }
}
</script>
