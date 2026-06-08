<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="70%" append-to-body>
    <div>
      <!-- Upload Button -->
      <el-button v-if="isEdit" type="primary" icon="el-icon-upload2" @click="showUploadDialog">Upload</el-button>

      <el-form v-if="!isEdit" label-width="150px" ref="uploadFormRef11" :show-message="false">
        <el-form-item label="Related PO" v-if="shippingOrderItems.length > 0">
          <el-checkbox-group v-model="checkedList" size="small">
            <el-checkbox v-for="(orderItem,index) in shippingOrderItems" :label="orderItem.orderNumber" :key="index" disabled border></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <!-- Table -->
      <el-table :data="tableData" v-loading="tableLoading">
        <el-table-column prop="documentNumber" label="Document Number" align="center" />
        <el-table-column prop="poNumber" label="PO Number" align="center" />
        <el-table-column prop="shippingOrderNumber" label="SO Ref" align="center" />
        <el-table-column prop="typeCode" label="Document Type" align="center">
          <template #default="scope">
            <span>{{ uploadTypes.find(type => type.value === scope.row.typeCode)?.label }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="blType" label="BL Type" align="center">
          <template slot-scope="scope">
            <span>{{ ['03', '04'].includes(scope.row.typeCode) ? scope.row.blType : '/' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="File Name" align="center" show-overflow-tooltip />
        <el-table-column prop="updateTime" label="Upload Date" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatUserLocalTime(scope.row.updateTime, scope.row.timeZone, scope.row.timeZoneOffset) }}
          </template>
        </el-table-column>
        <el-table-column label="Action" width="250px" align="center">
          <template #default="scope">
            <!-- <el-button type="primary" icon="el-icon-download" @click="downloadFile(scope.row)"></el-button> -->
            <!--            <el-link type="primary" :href="scope.row.fileUrl">-->
            <!--              <el-button type="primary" icon="el-icon-download" style="margin-right: 10px;margin-bottom: 2px;"></el-button>-->
            <!--            </el-link>-->
            <template v-if="scope.row.typeCode !== '15' ">
              <ActionButton :url="scope.row.fileUrl" iconType="el-icon-download" type="download" :fileName="scope.row.fileName" />
              <ActionButton :url="scope.row.fileUrl" iconType="el-icon-view" type="preview" :fileName="scope.row.fileName" />
            </template>
            <el-link>
              <el-button v-if="isEdit" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
            </el-link>
            <el-link v-if="scope.row.typeCode === '03'">
              <el-button style="margin-left: 5px;" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Upload Dialog -->
    <el-dialog :title="uploadSet.title" :visible.sync="showDialog" width="600px" append-to-body v-loading="uploadSet.loading" :before-close="uploadClose">
      <el-form label-width="150px" ref="uploadFormRef" :model="uploadForm" :show-message="false" :key="formKey">
        <el-form-item :label="$t('document.type')" required prop="typeCode">
          <el-select v-model="uploadForm.typeCode" @change="handleTypeChange">
            <el-option v-for="(type, index) in fileTypes" :key="index" :label="type.label" :value="type.value"></el-option>
          </el-select>
        </el-form-item>


<el-row
  v-show="uploadForm.typeCode=='03'&&uploadForm.id==null&&(uploadForm.showTip!=1&&uploadForm.showTip!=2&&uploadForm.showTip!=3&&uploadForm.showTip!=4)"
  style="margin: 0px;">
  <el-col>
    <div
      style="background-color: #FFFBE6; border: 2px solid #F5E6A5; border-radius: 4px; padding: 5px;margin-bottom: 7px;margin-top: -5px; display: flex; align-items: center; width: 100%; box-sizing: border-box;">
      <i class="el-icon-info" style="color: #E6A23C; margin-right: 8px; font-size: 16px;"></i>
      <span style="color: #8C6A03; font-size: 14px; flex: 1;">Upload an HBL file first to automatically extract the
        information.</span>
    </div>
  </el-col>
</el-row>
<el-row v-show="uploadForm.typeCode=='03'&&uploadForm.showTip==1" style="margin: 0px;">
  <el-col>
    <div
      style="background-color: #E6F7FF; border: 2px solid #98D8FF; border-radius: 4px; padding: 5px;margin-bottom: 7px;margin-top: -5px; display: flex; align-items: center; width: 100%; box-sizing: border-box;">
      <i class="el-icon-info" style="color: #1890FF; margin-right: 8px; font-size: 16px;"></i>
      <span style="color: #252623; font-size: 14px; flex: 1;">{{'Please be patient as the file is uploading.('+uploadForm.percent+'%)'}}
      </span>
    </div>
  </el-col>
</el-row>
<el-row v-show="!isTmff&&uploadForm.typeCode=='03'&&uploadForm.showTip==2" style="margin: 0px;">
  <el-col>
    <div
      style="background-color: #F6FFED; border: 2px solid #C8F0A9; border-radius: 4px; padding: 5px;margin-bottom: 7px;margin-top: -5px; display: flex; align-items: center; width: 100%; box-sizing: border-box;">
      <i class="el-icon-info" style="color: #52C41A; margin-right: 8px; font-size: 16px;"></i>
      <span style="color: #252623; font-size: 14px; flex: 1;">The uploaded HBL file matches the entered
        information.
      </span>
    </div>
  </el-col>
</el-row>
<el-row v-show="!isTmff&&uploadForm.typeCode=='03'&&uploadForm.showTip==3" style="margin: 0px;">
  <el-col>
    <div
      style="background-color: #FFF1F0; border: 2px solid #FFD2CE; border-radius: 4px; padding: 5px;margin-bottom: 7px;margin-top: -5px; display: flex; align-items: center; width: 100%; box-sizing: border-box;">
      <i class="el-icon-info" style="color: #FF4D4F; margin-right: 8px; font-size: 16px;"></i>
      <span style="color: #252623; font-size: 14px; flex: 1;">The uploaded HBL file has partial mismatches with the
        shipment information.</span>
    </div>
  </el-col>
</el-row>
<el-row v-show="!isTmff&&uploadForm.typeCode=='03'&&uploadForm.showTip==4" style="margin: 0px;">
  <el-col>
    <div
      style="background-color: #FFF1F0; border: 2px solid #FFD2CE; border-radius: 4px; padding: 5px;margin-bottom: 7px;margin-top: -5px; display: flex; align-items: center; width: 100%; box-sizing: border-box;">
      <i class="el-icon-info" style="color: #FF4D4F; margin-right: 8px; font-size: 16px;"></i>
      <span style="color: #252623; font-size: 14px; flex: 1;">File parsing failed. Please upload a clearer file or enter
        the information manually.</span>
    </div>
  </el-col>
</el-row>

<!-- tmff -->
<el-row v-show="isTmff&&tmffMatch==1&&uploadForm.typeCode=='03'&&uploadForm.showTip==2" style="margin: 0px;">
  <el-col>
    <div
      style="background-color: #F6FFED; border: 2px solid #C8F0A9; border-radius: 4px; padding: 5px;margin-bottom: 7px;margin-top: -5px; display: flex; align-items: center; width: 100%; box-sizing: border-box;">
      <i class="el-icon-info" style="color: #52C41A; margin-right: 8px; font-size: 16px;"></i>
      <span style="color: #252623; font-size: 14px; flex: 1;">The uploaded HBL file matches the entered
        information.
      </span>
    </div>
  </el-col>
</el-row>
<el-row v-show="isTmff&&tmffMatch==2&&uploadForm.typeCode=='03'&&uploadForm.showTip==4" style="margin: 0px;">
  <el-col>
    <div
      style="background-color: #FFF1F0; border: 2px solid #FFD2CE; border-radius: 4px; padding: 5px;margin-bottom: 7px;margin-top: -5px; display: flex; align-items: center; width: 100%; box-sizing: border-box;">
      <i class="el-icon-info" style="color: #FF4D4F; margin-right: 8px; font-size: 16px;"></i>
      <span style="color: #252623; font-size: 14px; flex: 1;">The uploaded HBL file does not match the information entered. Please verify the details and upload the correct file.</span>
    </div>
  </el-col>
</el-row>
<el-row v-show="isTmff&&tmffMatch==2&&uploadForm.typeCode=='03'&&uploadForm.showTip==5" style="margin: 0px;">
  <el-col>
    <div
      style="background-color: #FFF1F0; border: 2px solid #FFD2CE; border-radius: 4px; padding: 5px;margin-bottom: 7px;margin-top: -5px; display: flex; align-items: center; width: 100%; box-sizing: border-box;">
      <i class="el-icon-info" style="color: #FF4D4F; margin-right: 8px; font-size: 16px;"></i>
      <span style="color: #252623; font-size: 14px; flex: 1;">File parsing failed. Please upload a clearer file or enter
      the information manually.</span>
    </div>
  </el-col>
</el-row>

        <el-form-item :label="$t('document.documentFile')" v-show="this.uploadForm.typeCode !== '18'">
          <el-upload ref="uploadFileRef" :limit="1"
            :accept="uploadForm.typeCode === '16' || uploadForm.typeCode === '17' ? 'image/*, .jpeg, .jpg, .png, .gif, .doc, .docx, .pdf, .xls, .xlsx' : '.doc, .docx, .pdf, .xls, .xlsx'"
            :headers="uploadSet.headers" :data="uploadForm" :action="uploadSet.url" :disabled="uploadSet.isDisabled"
            :file-list="fileList" v-loading="uploadSet.isUploading" :on-progress="handleFileUploadProgress"
            :on-success="handleUploadSuccess" :on-error="handleUploadError" :auto-upload="false" :on-change="handleFileChange"
            :on-remove="handleRemove"
            drag>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              {{ $t("purchaseOrder.DragTheFileHereOr") }}
              <em>{{ $t("purchaseOrder.clickUpload") }}</em>
            </div>
            <!-- <div class="el-upload__tip text-center" slot="tip">
                      <span>{{ $t("purchaseOrder.onlyWordPdfFormatFilesAreAllowed") }}</span>
                    </div>-->
          </el-upload>
        </el-form-item>

        <el-form-item :label="$t('document.documentNumber')" :required="uploadForm.typeCode !== '18'" prop="documentNumber" v-show="this.uploadForm.typeCode !== '18'">
          <el-input :disabled="uploadForm.typeCode === '15'||uploadForm.showTip==1" v-model="uploadForm.documentNumber"></el-input>
        </el-form-item>

        <el-form-item :label="$t('document.status')" v-show="showBlType" :required="uploadForm.typeCode=='03'" prop="blType">
          <el-select v-model="uploadForm.blType">
            <el-option label="SEAWAY BILL" value="SEAWAY BILL"></el-option>
            <el-option label="TELEX RELEASE" value="TELEX RELEASE"></el-option>
            <el-option label="ORIGINAL" value="ORIGINAL"></el-option>
            <el-option label="Original, pending TELEX" value="Original, pending TELEX"></el-option>
          </el-select>
        </el-form-item>

        <!-- 如果是选择HBL 并且是shipping Order 的情况下，需要指定哪一个 shipping Order -->
        <el-form-item label="SO Ref" v-if="uploadForm.typeCode == '02'|| uploadForm.typeCode=='03'">
          <el-input v-model="shippingOrder.soRef" disabled></el-input>
        </el-form-item>
        <el-form-item label="Related PO" v-if="shippingOrderItems.length > 0&&(uploadForm.typeCode == '02'|| uploadForm.typeCode=='03')">
          <el-checkbox-group v-model="checkedList" size="small">
            <el-checkbox v-for="(orderItem,index) in shippingOrderItems" :label="orderItem.orderNumber" :key="index" disabled border></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- <el-form-item :label="$t('uploadForm.email')" v-if="uploadSet.formData.type != '3'">
          <el-input type="textarea" placeholder v-model="uploadSet.formData.email" size="mini" :rows="3" maxlength="1000" show-word-limit resize="none" @change="handeDocumentEmailTrim"></el-input>
        </el-form-item>-->
        <!-- 如果选择HBL；填2个日期 -->
        <el-form-item :required="!dHDDisabled" label="Draft HBL Date" v-if="uploadForm.typeCode == '03'" prop="draftHblDate">
          <el-date-picker :disabled="dHDDisabled" :key="datePickerKey" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="uploadForm.draftHblDate" type="date" placeholder="Draft HBL Date"></el-date-picker>
        </el-form-item>
        <el-form-item required label="HBL Issue Date" v-if="uploadForm.typeCode == '03'" prop="hblIssueDate">
          <el-date-picker :key="datePickerKey" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="uploadForm.hblIssueDate" type="date" placeholder="HBL Issue Date"></el-date-picker>
        </el-form-item>


<el-card v-if="isTmff&&tmffMatch==2" style="margin-top: 20px; margin-bottom: 15px;">
  <el-table :data="uploadForm.documentNumberList"
    v-show="uploadForm.documentNumberList&&uploadForm.documentNumberList.length>0">
    <el-table-column prop="field" label="Field" min-width="140px" align="center" />
    <el-table-column prop="tmffInfo" label="Tmff Info" min-width="120px" align="center" />
    <el-table-column prop="uploadFile" label="Upload File" min-width="120px" align="center" />

    <el-table-column prop="result" label="Result" min-width="140px" align="center">
      <template #default="scope">
        <el-tag>
          <i v-if="scope.row.match == 1" class="el-icon-success" style="margin-right: 4px; color: #52C41A;"></i>
          <i v-if="scope.row.match == 2" class="el-icon-warning" style="margin-right: 4px; color: #FAAD14;"></i>
          <i v-if="scope.row.match == 3" class="el-icon-error" style="margin-right: 4px; color: #FF5052;"></i>
          {{scope.row.result}}</el-tag>
      </template>
    </el-table-column>
  </el-table>
</el-card>


<el-card v-if="!isTmff" style="margin-top: 20px; margin-bottom: 15px;">
  <el-table :data="uploadForm.containerMatchsList"
    v-show="uploadForm.typeCode == '03' && uploadForm.containerMatchsList && uploadForm.containerMatchsList.length > 0">
    <el-table-column prop="field" label="Field" min-width="140px" align="center" />
    <el-table-column prop="shipmentInfo" label="Shipment Info" min-width="120px" align="center" />
    <el-table-column prop="uploadFile" label="Upload File" min-width="120px" align="center" />

    <el-table-column prop="result" label="Result" min-width="140px" align="center">
      <template #default="scope">
        <el-tag>
          <i v-if="scope.row.match == 1" class="el-icon-success" style="margin-right: 4px; color: #52C41A;"></i>
          <i v-if="scope.row.match == 2" class="el-icon-warning" style="margin-right: 4px; color: #FAAD14;"></i>
          <i v-if="scope.row.match == 3" class="el-icon-error" style="margin-right: 4px; color: #FF5052;"></i>
          {{scope.row.result}}</el-tag>
      </template>
    </el-table-column>
  </el-table>
</el-card>



        <div style="float:right">
          <!-- :disabled="(uploadForm.typeCode == '03'&&(uploadForm.showTip==1||uploadSet.notMatch)&&task.country !='BD')||uploadSet.isUploading" -->
          <el-button size="mini" v-if="isEdit && showUpload" type="primary"  @click="submitUploadForm">{{ $t("purchaseOrder.confirm") }}</el-button>
          <!-- :disabled="uploadForm.typeCode == '03'&&(uploadForm.showTip==1||uploadSet.notMatch)&&task.country != 'BD'" -->
          <el-button size="mini" v-if="!showUpload"  type="primary" @click="reSubmitForm">{{ $t("purchaseOrder.confirm") }}</el-button>

          <el-button size="mini" @click="uploadClose">{{ $t("purchaseOrder.cancel") }}</el-button>
        </div>
      </el-form>
    </el-dialog>

    <div v-if="task.status==1" slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t("purchaseOrder.cancel") }}</el-button>
      <el-button type="primary" @click="handleTaskConfirm">{{ $t("purchaseOrder.confirm") }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { orderFileList, uploadOrderFile, deleteOrderFile, submitWithoutFile, resaveOrderFile, submitOnlyTask } from '@/api/pepco/order-file'
import { updateTask, updatePreAlertTask, reSaveFile } from '@/api/order/task'

import { getPoRelatedSoByOrderId, getPoRelatedOrderFile, getShippingOrderItemList, getOrderShipmentPage, getShippingOrderDetail } from '@/api/pepco/shipping-order'
import { getBaseHeader } from '@/utils/request'
import {getShippingDraftHblDate} from "@/api/shipping/order";
import moment from "moment";
import {parseUTCTime} from "@/utils/ruoyi";
import { getUserProfile } from '@/api/system/user'
import { aiUploadAndAnalyze } from '@/api/system/ai/ai'
import { pepcoGetClpDetailBySoRef } from '@/api/shipment/pepcoclp';
import { findTmffBLNo } from '@/api/shipment/hbl'

export default {
  data() {
    return {
      dialogVisible: false,
      isEdit: false,
      showUpload: false, // 是否显示编辑按钮
      tableLoading: false,
      title: 'Task Document',
      tableData: [],
      fileList: [],
      fileTypes: [
        // 上传类型选项
        { label: 'Commercial Invoice', value: '01' },
        { label: 'Packing List', value: '05' },
        { label: 'Others', value: '06' },
        { label: 'Shipping Documents By Email', value: '15' },
        { label: 'Container Loading Picture', value: '16' },
        { label: 'Customs Declaration', value: '17' },
        { label: 'No Need Upload Document', value: '18' }
      ],
      uploadTypes: [
        // 上传类型选项
        { label: 'Commercial Invoice', value: '01' },
        { label: 'Draft HBL', value: '02' },
        { label: 'HBL', value: '03' },
        { label: 'MBL', value: '04' },
        { label: 'Packing List', value: '05' },
        { label: 'Others', value: '06' },
        { label: 'Inspection Status', value: '07' },
        { label: 'CLP', value: '08' },
        { label: 'ICS2', value: '11' },
        { label: 'Manifest', value: '12' },
        { label: 'Shipper Booking Others', value: '13' },
        { label: 'Invoice to Supplier', value: '14' },
        { label: 'Shipping Documents By Email', value: '15' },
        { label: 'Container Loading Picture', value: '16' },
        { label: 'Customs Declaration', value: '17' },
        { label: 'No Need Upload Document', value: '18' }
      ],
      uploadSet: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: 'Upload Document',

        isUploading: false,
        // 是否禁用上传
        isDisabled: false,
        loading: false,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/admin-api/order/order-file/upload'
      },
      shipmentClpDetailList: [],
      uploadForm: {
        typeCode: undefined,
        documentNumber: '',
        documentNumberList: [],
        blType: '',
        shippingOrderId: undefined,
        taskName: undefined,
        email: '',
        id: null,
        draftHblDate: '', //
        hblIssueDate: '',
        showTip: 0,
      },
      task: {},
      shippingOrder: {
        soRef: ''
      },
      shippingOrderItems: [],
      checkedList: [],
      taskCode: '',
      showBlType: false,
      shippingOrderList: [], // 存储文件列表
      shippingOrderNumber: [],
      refuseReason: '',
      refuseName: '',
      refuseTime: '',
      shipmentInfo: {
        shipmentId: ''
      },
      showDialog: false,
      originalFileList: [],
      datePickerKey: 0,
      formKey: 0,
      user: {},
      isTmff: false,
      tmffMatch: 0,

      dHDDisabled: false
    }
  },
  created() {
    console.log('UploadOrderFile created')
  },
  methods: {
    parseUTCTime,
    openDialog(task, activeTask, currentSeq) {
      console.log('openDialog', task)
      this.task = task
      this.title = task.taskName
      this.taskCode = task.taskCode
      this.showUpload = true


      console.log('进入了Release_HBL_and_Invoice_to_Shipper')
      this.fileTypes = [
        { label: 'Invoice to Supplier', value: '14' },
        { label: 'HBL', value: '03' },
        { label: 'Customs Declaration', value: '17' }
      ]
      // 获取clp数据；根据so；查找clp数据；找到相关的contianerNo
      pepcoGetClpDetailBySoRef(this.task.soRef).then((response) => {
        this.shipmentClpDetailList = response.data
      })

      // 1. task是正在进行的status=1
      // 2. activeTask == 'Verify Shipping Documents',当前是Verify Shipping Documents,upload shippment file节点可编辑
      // 3. 当前是Release_HBL_and_Invoice_to_Shipper，并且正在进行的task seq>18, Release_HBL_and_Invoice_to_Shipper节点可以一直编辑
      // 4. 当前code是Upload_Shipping_Documents，并且正在进行的task seq<= 20(Pre Alert), Upload_Shipping_Documents节点不可编辑
      this.isEdit = task.status == 1 || task.taskCode == 'Release_HBL_and_Invoice_to_Shipper' && currentSeq && currentSeq > 18
      this.getShippingOrder()
      this.dialogVisible = true
      console.log('this.edit', this.isEdit)
      // 解析task中的jsonData
      if (task.jsonData != null && task.jsonData != undefined && task.jsonData != '') {
        const jsonData = JSON.parse(task.jsonData)
        if (jsonData.hasOwnProperty('reason')) {
          // 存在reason属性的处理
          this.refuseReason = jsonData.reason
          this.refuseName = jsonData.createBy
          this.refuseTime = this.formatDateTime(jsonData.createTime)
          // 进一步处理...
        } else {
          this.refuseReason = undefined
        }
      }
    },
    getShippingOrder() {
      getPoRelatedSoByOrderId({ orderId: this.task.orderId }).then(res => {
        this.shippingOrder = res.data.shippingOrder
        this.shippingOrderItems = res.data.shippingOrderItems
        this.shippingOrderItems.forEach(item => {
          this.checkedList.push(item.orderNumber)
        })
        this.shipmentInfo.shipmentId = this.shippingOrder.shipmentId
        findTmffBLNo({ shipmentId: this.shippingOrder.shipmentId, shippingOrderId: this.shippingOrder.id }).then(res => {
          if (res.data) {
            var item = res.data
            if (this.shippingOrder.id == item.shippingOrderId) {
              // add tmff
              this.isTmff = true
            }
          }
        })
        this.getOrderFileList()
      })
    },
    getOrderFileList() {
      getUserProfile().then(response => {
        this.user = response.data
        this.tableLoading = true
        orderFileList({ shippingOrderId: this.shippingOrder.id, orderHeaderId: this.task.orderId, taskCode: this.task.taskCode }).then(res => {
          if (this.user.isFactory) {
            this.tableData = []
            for (var file of res.data) {
              console.log(file.creator)
              console.log(this.user.id)
              if (file.creator == this.user.id + '') {
                this.tableData.push(file)
              }
            }
          } else {
            this.tableData = res.data
          }
          this.tableLoading = false
        })
      })
    },
    downloadFile(row) {
      console.log('Downloading file:', row)
      // Implement file download logic here
      console.log(file)

      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = row.fileUrl
      document.body.appendChild(link)
      link.click()
    },
    handleDelete(row) {
      console.log('Deleting file:', row)
      this.$confirm(`Delete ${row.fileName}?`, this.$t('Confirm'), {
        type: 'warning'
      }).then(() => {
        deleteOrderFile(row.id).then(res => {
          if (res.code === 0) {
            this.$notify({
              message: 'Delete Success',
              type: 'success'
            })
            this.getOrderFileList()
          } else {
            this.$notify({
              message: res.msg,
              type: 'error'
            })
          }
        })
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
      this.getOrderFileList()
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
      if (this.$refs.uploadFileRef) {
        this.$refs.uploadFileRef.clearFiles()
      }
      this.uploadForm.documentNumberList = []
      this.fileList = []
      this.uploadForm = {
        typeCode: undefined,
        documentNumber: '',
        blType: undefined,
        shippingOrderId: undefined,
        taskName: undefined,
        id: null
      }
    },
    formatToDateOnly(dateStr) {
      if (!dateStr) return new Date(0); // 空值兜底，避免报错
      const date = new Date(dateStr);
      // 重置时分秒和毫秒为0，只保留年月日
      date.setHours(0, 0, 0, 0);
      return date;
    },
    // 提交上传文件
    submitUploadForm() {
      this.uploadSet.url = process.env.VUE_APP_BASE_API + '/admin-api/order/order-file/upload'
      console.log('uploadForm', this.uploadForm)
      if (this.uploadForm.typeCode === '03') {
        // Check if dates are provided and valid
        // if (!this.uploadForm.draftHblDate || !this.uploadForm.hblIssueDate) {
        //   this.$notify({
        //     message: 'Both Draft HBL Date and HBL Issue Date are required',
        //     type: 'warning'
        //   });
        //   return;
        // }   


        // 验证HBL号码唯一性  zane
        if (!this.validateHblNumberConsistency()) {
          return;
        }
        const specialCharRegex = /[!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~`，。！？；：（）【】《》「」『』｛｝［］～…—·￥、〃〝〞‵′＂]/g
        if (specialCharRegex.test(this.uploadForm.documentNumber)) {
          this.$notify({
            message: 'Special symbols such as (, ! @） are not allowed. Only the symbol "_ ","-" is allowed!',
            type: 'warning'
          })
          return;
        }

        if (this.formatToDateOnly(this.uploadForm.draftHblDate) > this.formatToDateOnly(this.uploadForm.hblIssueDate)) {
          this.$notify({
            message: 'Draft HBL Date cannot be later than HBL Issue Date',
            type: 'warning'
          })
          return
        }
        if (moment(this.uploadForm.hblIssueDate).isAfter(moment().format("YYYY-MM-DD"))) {
          console.log(new Date(this.uploadForm.hblIssueDate))
          console.log(new Date())
          this.$notify({
            message: 'For HBL Issue dates, only today and dates before today can be selected',
            type: 'warning'
          })
          return
        }
      }
      this.uploadForm.shipmentId = this.shipmentInfo.shipmentId
      if (this.uploadForm.typeCode === '15') {
        this.uploadSet.isUploading = true
        this.uploadForm.taskCode = this.task.taskCode
        this.uploadForm.taskName = this.task.taskName
        this.uploadForm.shippingOrderId = this.shippingOrder.id
        submitWithoutFile(this.uploadForm).then(() => {
          //关闭文件上传弹窗和Upload Shipping Documents弹窗
          this.$emit('confirm', this.shipmentInfo)
          this.dialogVisible = false
          this.showDialog = false
          this.uploadSet.open = false
        })
      } else if (this.uploadForm.typeCode === '18') {
        //关闭文件上传弹窗和Upload Shipping Documents弹窗
        this.uploadSet.isUploading = true
        console.log('this.shippingOrder.id', this.shippingOrder.id)
        submitOnlyTask({ shippingOrderId: this.shippingOrder.id }).then(() => {
          this.dialogVisible = false
          this.showDialog = false
          this.uploadSet.open = false
          this.$emit('refresh')
        })
        this.uploadSet.isUploading = false
      } else {
        this.$refs.uploadFormRef.validate(valid => {
          if (valid) {
            if (this.fileList.length == 0) {
              this.$notify({
                message: 'Please add files before uploading',
                type: 'warning'
              })
              return
            }
            this.uploadSet.isUploading = true
            this.uploadForm.taskCode = this.task.taskCode
            this.uploadForm.taskName = this.task.taskName
            this.uploadForm.shippingOrderId = this.shippingOrder.id
            this.uploadForm.level = 2
            this.$refs.uploadFileRef.submit()
          }
        })
      }
    },

    validateHblNumberConsistency() {
      if (!this.uploadForm.documentNumber || !this.uploadForm.documentNumber.trim()) {
        this.$notify({
          message: 'HBL Number is required',
          type: 'warning'
        });
        return false;
      }

      // 查找已存在的HBL记录（排除当前编辑的记录）
      const existingHbl = this.tableData.find(item => {
        // 如果是编辑模式，排除当前编辑的记录
        if (this.uploadForm.id && item.id === this.uploadForm.id) {
          return false;
        }
        return item.typeCode === '03';
      });

      console.log("uploadForm", this.uploadForm);
      console.log("existingHbl", existingHbl);

      // 如果存在其他HBL记录，新上传的号码必须与已存在的一致
      if (existingHbl) {
        const currentNumber = this.uploadForm.documentNumber.trim();
        const existingNumber = existingHbl.documentNumber.trim();

        if (currentNumber !== existingNumber) {
          this.$notify({
            message: `HBL Number must be "${existingNumber}" to match existing HBL records. Current input: "${currentNumber}"`,
            type: 'warning',
            duration: 5000
          });
          return false;
        }
      }

      // 如果不存在其他HBL记录，可以使用任何号码
      return true;
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.resetFile()
    },
    handleFileChange(file, fileList) {
      console.log('222222222222222')
      const type = file.name.split('.').pop().toLowerCase()
      const acceptType = ['csv', 'doc', 'docx', 'ppt', 'pptx', 'rar', 'txt', 'xls', 'xlsx', 'zip', 'pdf', 'jpeg', 'gif', 'jpg', 'png']
      if (acceptType.includes(type)) {
        this.fileList = fileList
      } else {
        this.$message.error('The file format does not meet the upload requirements.')
        this.fileList = []
        return
      }

      this.uploadForm.containerMatchs = []
      this.uploadForm.containerMatchsList = []

      if (file != null && this.uploadForm.typeCode == '03' && type == 'pdf') {
        // 调用接口；获取数据；
        const formData = new FormData();
        formData.append("file", file.raw, file.name)

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

        if (this.isTmff) {
          formData.append("type", 'hbl-tmff')
          console.log('formData')
          console.log(formData)
          aiUploadAndAnalyze(formData).then(response => {
            vm.uploadForm.percent = 100
            vm.uploadSet.loading = false
            console.log('aiUploadAndAnalyze:', response)

            if (response.blNumber) {
              this.tmffMatch = 0
              if (this.isTmff) {
                var showTip = 2;
                if (vm.uploadForm.documentNumber == response.blNumber) {
                  this.tmffMatch = 1
                } else {
                  showTip = 4;
                  var documentNumberList = []
                  {
                    var temp = {}
                    temp.field = 'Document Number'
                    temp.tmffInfo = vm.uploadForm.documentNumber
                    temp.result = 'Not Found'
                    temp.match = 3
                    documentNumberList.push(temp)
                  }
                  {
                    var temp = {}
                    temp.field = 'Document Number'
                    temp.uploadFile = response.blNumber
                    temp.result = 'Mismatch'
                    temp.match = 2
                    documentNumberList.push(temp)
                  }
                  this.uploadSet.notMatch = true
                  this.tmffMatch = 2
                  vm.uploadForm.documentNumberList = documentNumberList
                }
                vm.uploadForm.showTip = showTip
                // vm.uploadForm.blType = response.documentType
              }
              // （如果需要处理右差集对应的 shipmentClpDetailList，可类似遍历设置）
            } else {
              if (this.isTmff) {
                // vm.uploadForm.blType = ''
                vm.uploadForm.showTip = 4
                vm.tmffMatch = 2
                console.log('2222')
              }

            }

          }).catch(error => {
            // 捕获所有异常（包括超时、接口错误、网络错误等）
            console.error('接口调用失败:', error);
            // vm.uploadForm.blType = ''
            vm.tmffMatch = 2
            vm.uploadForm.showTip = 5
            // 可添加用户提示，如：this.$message.error('文件解析失败，请重试')
          })
            .finally(() => {
              // 无论成功/失败/超时，最终都关闭加载状态
              vm.uploadSet.loading = false;
              vm.uploadForm = JSON.parse(JSON.stringify(vm.uploadForm))
              console.log(vm.uploadForm)
            });
        } else {
          formData.append("type", 'hbl')
          console.log('formData')
          console.log(formData)
          aiUploadAndAnalyze(formData).then(response => {
            vm.uploadForm.percent = 100
            vm.uploadSet.loading = false
            console.log('aiUploadAndAnalyze:', response)

            if (response.blNumber && response.containerInfo && response.containerInfo.length > 0) {
              this.tmffMatch = 0
               {
                vm.uploadForm.documentNumber = response.blNumber
                // vm.uploadForm.blType = response.documentType
                vm.uploadForm.containerInfo = response.containerInfo

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
                  console.log('containerNo match:' + containerNo + item.match)
                  vm.uploadForm.containerMatchs.push(item)
                  vm.uploadForm.containerMatchsList.push(item1)
                });
              }
              // （如果需要处理右差集对应的 shipmentClpDetailList，可类似遍历设置）
            } else {
              {
                vm.uploadForm.documentNumber = ''
                // vm.uploadForm.blType = ''
                vm.uploadForm.showTip = 4
              }

            }

          }).catch(error => {
            // 捕获所有异常（包括超时、接口错误、网络错误等）
            console.error('接口调用失败:', error);
            {
              vm.uploadForm.documentNumber = ''
            }
            // vm.uploadForm.blType = ''
            vm.uploadForm.showTip = 0
            // 可添加用户提示，如：this.$message.error('文件解析失败，请重试')
          })
            .finally(() => {
              // 无论成功/失败/超时，最终都关闭加载状态
              vm.uploadSet.loading = false;
              vm.uploadForm = JSON.parse(JSON.stringify(vm.uploadForm))
              console.log(vm.uploadForm)
            });
        }
      }
    },
    handleTaskConfirm() {
      console.log('handleTaskConfirm')
      console.log('this.task', this.tableData)
      const hasHBL = this.tableData.some(item => item.typeCode === '03')

      if (hasHBL) {
        // Find the HBL record
        const hblRecord = this.tableData.find(item => item.typeCode === '03')

        // Check if Draft HBL Date is after HBL Issue Date
        if (hblRecord.draftHblDate && hblRecord.hblIssueDate && this.formatToDateOnly(hblRecord.draftHblDate) > this.formatToDateOnly(hblRecord.hblIssueDate)) {
          this.$notify({
            message: 'Draft HBL Date cannot be later than HBL Issue Date',
            type: 'warning'
          })
          return
        }
      }
      if (this.tableData.length == 0) {
        this.$notify({
          message: 'Please upload the document',
          type: 'warning'
        })
        return
      }
      this.$emit('confirm', this.shipmentInfo)
      this.dialogVisible = false
    },
    handleTypeChange(value) {
      console.log('选择的类型:', value)
      this.isTmff = false
      if (value == '03' || value == '04') {
        if (value === '03') {
          getShippingDraftHblDate({ soRef: this.shippingOrder.soRef }).then(res => {
            if (res.data && res.data.draftHblDate) {
              this.uploadForm.draftHblDate = this.formatDateTime(res.data.draftHblDate)
              this.dHDDisabled = true
            }
          })
          this.dHDDisabled = false
                    //HBL查询出他提交过的tmff 的blNo
          findTmffBLNo({ shipmentId: this.shippingOrder.shipmentId, shippingOrderId: this.shippingOrder.id }).then(res => {
            if (res.data) {
              var item = res.data
              if (this.shippingOrder.id == item.shippingOrderId) {
                //复制tmff生成的shpNo到表单的Document Number
                this.uploadForm.documentNumber = item.shpNo
                var formattedDate = this.formatDate(item.createTime)
                //手动将属性添加到响应式对象上
                this.$set(this.uploadForm, 'hblIssueDate', formattedDate);
                // add tmff
                this.isTmff = true
              }
            }
          })
        }
        this.showBlType = true
      } else {
        this.showBlType = false
      }
      //shawn 如果类型是15 Shipping Documents By Email, Document Number设置成Invoice offline，且不可编辑，也禁止上传文件
      if (value === '15') {
        this.uploadForm.documentNumber = 'Invoice offline'
        //禁止上传文件
        this.uploadSet.isDisabled = true
      } else {
        if (this.uploadForm.documentNumber === 'Invoice offline') {
          this.uploadForm.documentNumber = ''
        }
        this.uploadSet.isDisabled = false
      }
      this.resetFile()

    },
    resetFile() {
      this.uploadForm.containerMatchs = []
      this.uploadForm.containerMatchsList = []
      this.uploadForm.showTip = 0
      this.uploadForm.percent = 0
      this.uploadForm = JSON.parse(JSON.stringify(this.uploadForm))
      this.tmffMatch = 0
    },
    formatDateTime(timestamp) {
      const date = new Date(Number(timestamp))
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    handleEdit(row) {
      this.showUpload = false
      this.showDialog = true
      console.log('this.showUpload ', this.showUpload)
      console.log('row', row)
      this.uploadSet.isUploading = false
      //  1. 初始化 showBlType
      this.showBlType = row.typeCode === '03' || row.typeCode === '04'
      this.uploadForm = {
        taskCode: this.task.taskCode,
        taskName: this.task.taskName,
        documentNumber: row.documentNumber || '',
        typeCode: row.typeCode || '',
        id: row.id || null,
        blType: this.showBlType ? row.blType || '' : '',
        draftHblDate: this.showBlType ? this.parseUTCTime(row.draftHblDate) : '',
        hblIssueDate: this.showBlType ? this.parseUTCTime(row.hblIssueDate) : '',
        shippingOrderId: row.shippingOrderId || undefined,
        email: row.email || ''
      }

      //  3. 设置文件列表
      this.originalFileList = [{ name: row.fileName }]
      this.fileList = [{ name: row.fileName }]

      //  4. 强制触发重渲染（可选）
      this.datePickerKey = Date.now()
      this.formKey = Date.now()
    },
    formatDate(timestamp) {
      if (!timestamp) return ''

      // 如果是字符串并已经是 yyyy-MM-dd 格式，直接返回
      if (typeof timestamp === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(timestamp)) {
        return timestamp
      }

      const date = new Date(timestamp)
      if (isNaN(date.getTime())) return '' // 非法日期

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    showUploadDialog() {
      console.log('this.upload.ure', this.uploadSet.url)
      this.uploadSet.url = process.env.VUE_APP_BASE_API + '/admin-api/order/order-file/upload'
      this.uploadForm = {
        typeCode: undefined,
        documentNumber: '',
        blType: '',
        shippingOrderId: this.shippingOrder.id,
        taskName: this.task.taskName,
        id: null
      }
      console.log('shipmentInfo', this.shipmentInfo)
      this.showDialog = true
      this.showUpload = true
      this.uploadSet.open = true
    },
    reSubmitForm() {
      console.log('resubmit')
      const specialCharRegex = /[!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~`，。！？；：（）【】《》「」『』｛｝［］～…—·￥、〃〝〞‵′＂]/g
      if (specialCharRegex.test(this.uploadForm.documentNumber)) {
        this.$notify({
          message: 'Special symbols such as (, ! @） are not allowed. Only the symbol "_ ","-" is allowed!',
          type: 'warning'
        })
        return;
      }
      this.uploadSet.url = process.env.VUE_APP_BASE_API + '/admin-api/order/task/pepco/order-file/re-save'
      this.$refs.uploadFileRef.action = this.uploadSet.url // 关键修复
      const uploadFiles = this.$refs.uploadFileRef.uploadFiles
      console.log('uploadFiles', uploadFiles)
      console.log('this.fielList', this.fileList)
      this.uploadSet.isUploading = true
      this.uploadForm.taskCode = this.task.taskCode
      this.uploadForm.taskName = this.task.taskName
      this.uploadForm.shipmentId = this.shipmentInfo.shipmentId
      console.log('提交的参数', this.uploadForm)
      console.log('提交的参数', this.uploadSet)

      // 判断只更新 其它信息
      if (this.originalFileList[0].name == this.fileList[0].name) {
        // 说明文件没变化
        this.fileList = []
        console.log('没有文件上传，只更新其它信息')
        console.log('新接口的入参', this.uploadForm)
        reSaveFile(this.uploadForm).then(res => {
          console.log('返回结果', res)
          if (res.code == 0) {
            this.$message.success('File resaved successfully')
            this.getOrderFileList()
          } else {
            this.$message.error(res.msg)
          }
          this.uploadSet.isUploading = false
          this.showDialog = false
          this.showUpload = true
        })
      }

      this.$nextTick(() => {
        this.$refs.uploadFileRef.submit()
      })
    },
    handleDraftHblDateChange(value) {
      console.log('Draft HBL Date changed:', value)
      // this.uploadForm.draftHblDate = value
      this.$set(this.uploadForm, 'draftHblDate', value)
      this.datePickerKey++
    },
    handleIssueDateChange(value) {
      console.log('HBL Issue Date changed:', value)
      // this.uploadForm.hblIssueDate = value
      this.$set(this.uploadForm, 'hblIssueDate', value)
      this.datePickerKey++
    }
  }
}
</script>

<style scoped>
.upload-demo {
  width: 100%;
}
.reason-class {
  padding-left: 20px;
}
.refuse-container {
  padding-top: 10px;
}
.info-text {
  padding-left: 20px;
  color: #666;
  font-size: small;
}
.refuse-comment {
  padding-top: 10px;
}
.comment-label {
  padding-left: 20px;
  font-weight: bold;
}
.comment-text {
  padding-left: 20px;
  color: red;
}
</style>
