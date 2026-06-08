<template>
  <div class="app-container">
    <div class="contract-list">
      <el-card style="padding:20px 0px 10px 20px;background-color: #fff;">
        <el-row>
          <el-col :span="5">
            <el-select filterable v-model="queryParams.customerId" size="small" @change="handleQuery" clearable placeholder="Customer Name">
              <el-option v-for="dept in customerOptions" :value="dept.id" :key="dept.id" :label="dept.name"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-card>
      <el-card style="padding:20px;background-color: #fff;">
        <!-- 搜索工作栏 -->
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label prop="carrier">
            <el-select filterable clearable v-model="queryParams.carrier" placeholder="Carrier">
              <el-option v-for="dict in getDictDatas(DICT_TYPE.CARRIER)" :key="dict.value" :label="dict.label+' ('+dict.value+')'" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label prop="status">
            <el-select filterable clearable v-model="queryParams.status" placeholder="Status">
              <el-option v-for="dict in statusList" :key="dict.value" :label="dict.value" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item style=" background-color: transparent;">
            <el-button @click="handleQuery" type="primary">
              <i class="el-icon-search el-icon--right"></i>
              Search
            </el-button>
            <el-button @click="handleAdd" type="primary" plain>
              Create
              <i class="el-icon-plus el-icon--right" v-hasPermi="['booking:contract:create']"></i>
            </el-button>
          </el-form-item>
          <div style="display: contents;">
            <el-button @click="openRegionAdd" type="primary" plain v-hasPermi="['booking:contract:create']" style="    float: right;">
              Create Region
              <i class="el-icon-plus el-icon--right"></i>
            </el-button>
          </div>
        </el-form>

        <!-- 列表 -->
        <el-table :height="height" v-loading="loading" :data="list">
          <el-table-column label="Carrier" align="center" prop="carrier" />
          <el-table-column label="Contract No" align="center" prop="contractNo" min-width="180">
            <template v-slot="scope">
              <span v-if="showContractNo">
                <el-link type="primary" @click="handleUpdate(scope.row)">{{ scope.row.contractNo }}</el-link>
              </span>
              <span v-else>{{ scope.row.contractNo }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Customer Name" align="center" min-width="230" show-overflow-tooltip prop="customerName" />
          <el-table-column label="Priority" align="center" prop="priotity" />
          <el-table-column label="Valid From" align="center" prop="validFrom" width="180">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.validFrom) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Valid To" align="center" prop="validTo" width="180">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.validTo) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Status" align="center">
            <template v-slot="scope">
              <span>{{ parseStatus(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" class-name="small-padding fixed-width">
            <template v-slot="scope">
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['booking:contract:delete']">delete</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-card>
      <!-- 分页组件 -->

      <!-- 对话框(添加 / 修改) -->
      <el-dialog :title="title" :visible.sync="open" width="100%" :before-close="handleClose" fullscreen destroy-on-close>
        <el-form ref="form" :model="form" size="mini" :rules="rules" label-width="120px" v-loading="formLoading">
          <el-row :gutter="20" style="margin-bottom: 15px;">
            <el-col :span="3">Contract</el-col>
            <el-col :span="6">
              <el-form-item prop="customerId" label="Customer Name">
                <el-select filterable v-model="form.customerId" size="mini" clearable placeholder="Customer Name">
                  <el-option v-for="dept in customerOptions" :value="dept.id" :key="dept.id" :label="dept.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20" style="margin-bottom: 10px">
            <el-col :span="3">Carrier</el-col>
            <el-col :span="4">Contract No.</el-col>
            <el-col :span="3">POD Region</el-col>
            <el-col :span="3">Priority</el-col>
            <el-col :span="4">Valid From</el-col>
            <el-col :span="4">Valid To</el-col>
            <el-col :span="3">Contract Related File</el-col>
          </el-row>

          <el-row :gutter="20" class="contract-css">
            <el-col :span="3">
              <el-form-item prop="carrier">
                <el-select filterable v-model="form.carrier" size="mini">
                  <el-option v-for="dict in getDictDatas(DICT_TYPE.CARRIER)" :key="dict.value" :label="dict.label+' ('+dict.value+')'" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="contractNo">
                <el-input v-model="form.contractNo" @blur="form.contractNo = $event.target.value.trim()" size="mini" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="podRegion">
                <el-select v-model="form.podRegion" clearable size="mini">
                  <el-option label="EU" value="EU"></el-option>
                  <el-option label="US" value="US"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="priotity">
                <el-select filterable v-model="form.priotity" clearable size="mini">
                  <el-option v-for="item in  priotityOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="validFrom">
                <el-date-picker value-format="timestamp" v-model="form.validFrom" size="mini" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="validTo">
                <el-date-picker value-format="timestamp" v-model="form.validTo" size="mini" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-upload
                class="upload-demo"
                multiple
                ref="upload"
                :headers="upload.headers"
                :action="upload.url"
                :on-progress="handleFileUploadProgress"
                :on-success="handleFileSuccess"
                :file-list="form.fileList"
                :on-preview="handlePreview"
                :before-remove="beforeRemove"
                :on-remove="deleteDocument"
                :auto-upload="false"
              >
                <svg style="cursor: pointer;" width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="icon-21f8f28d7f10b972" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48" style="mask-type: alpha">
                    <path d="M48 0H0V48H48V0Z" fill="#004F7C" />
                  </mask>
                  <g mask="url(#icon-21f8f28d7f10b972)">
                    <path d="M6 24.0083V42H42V24" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M33 15L24 6L15 15" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M23.9917 32V6" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                  </g>
                </svg>
              </el-upload>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row :gutter="20" style="margin-bottom: 15px;">
            <el-col :span="4">Allocation</el-col>
          </el-row>
          <el-row :gutter="20" style="margin-bottom: 10px">
            <el-col :span="4">Rule</el-col>
            <el-col :span="4" :offset="16">Allocation File</el-col>
          </el-row>
          <el-row :gutter="20" style="margin-bottom: 15px" class="contract-css">
            <el-col :span="4">
              <el-form-item prop="rule">
                <el-select filterable v-model="form.rule" @change="changeRule">
                  <el-option v-for="item in  ruleOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" :offset="16">
              <svg style="cursor: pointer;" @click="handleImport" width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="icon-21f8f28d7f10b972" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48" style="mask-type: alpha">
                  <path d="M48 0H0V48H48V0Z" fill="#004F7C" />
                </mask>
                <g mask="url(#icon-21f8f28d7f10b972)">
                  <path d="M6 24.0083V42H42V24" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M33 15L24 6L15 15" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M23.9917 32V6" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                </g>
              </svg>
              <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
                <el-upload
                  :show-file-list="false"
                  :on-change="beforeUploadContainers"
                  :on-success="handleFileSuccess"
                  :disabled="upload.isUploading"
                  v-loading="upload.isUploading"
                  :on-error="handleFileError"
                  :on-progress="handleFileUploadProgress"
                  :action="upload.url + '?updateSupport=' + upload.updateSupport"
                  :auto-upload="false"
                  accept=".xlsx, .xls"
                  drag
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">
                    {{ $t("purchaseOrder.DragTheFileHereOr")
                    }}
                    <em>{{ $t("purchaseOrder.clickUpload") }}</em>
                  </div>
                  <div class="el-upload__tip text-center" slot="tip">
                    <div>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</div>
                    <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="downloadImportTemplate">Import Template</el-link>
                  </div>
                </el-upload>
              </el-dialog>
            </el-col>
          </el-row>
          <el-divider></el-divider>

          <el-row :gutter="20" style="padding-bottom: 10px;">
            <el-col :span="2">
              <el-button @click="addItemRow" type="primary">Add Row</el-button>
            </el-col>
            <el-col :span="4" v-show="title == 'Update'">
              <el-date-picker v-model="queryItemParams.allocationYear" type="year" value-format="yyyy" @change="queryItemParams.pageNo =1 ;getContractItemPage()" placeholder="Allocation Year"></el-date-picker>
            </el-col>
            <el-col :span="4" v-show="title == 'Update'">
              <el-select v-model="queryItemParams.allocationWeek" placeholder="Allocation Week" @change="getContractItemPage" multiple filterable>
                <el-option v-for="number in numbers" :key="number" :label="number" :value="number"></el-option>
              </el-select>
            </el-col>
          </el-row>

          <el-table v-loading="subItemLoading" :data="subItemData" stripe max-height="400" style="width: 100%">
            <el-table-column prop="allocationYear" min-width="100px" label="Allocation Year">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.allocationYear" type="year" :picker-options="pickerYearOptions" placeholder="Year" format="yyyy" value-format="yyyy"></el-date-picker>
              </template>
            </el-table-column>

            <el-table-column prop="allocationMonth" min-width="100px" label="Allocation Month" v-if="showVessel == 2" key="0">
              <template slot-scope="scope">
                <el-date-picker popper-class="hlcu-month" v-model="scope.row.allocationMonth" type="month" style="width: 150px" placeholder="Month" format="MMM" value-format="MM" :picker-options="pickerOptions" />
              </template>
            </el-table-column>

            <el-table-column prop="allocationWeek" min-width="100px" label="Allocation Week" v-if="[1, 3, 4, 5, 6, 7].includes(showVessel)" key="1">
              <template slot-scope="scope">
                <el-input-number :controls="false" :precision="0" :max="53" v-model="scope.row.allocationWeek" />
              </template>
            </el-table-column>

            <el-table-column prop="contractType" min-width="140px" label="Contract Type" v-if="[1, 3, 4 ].includes(showVessel)" key="10">
              <template slot-scope="scope">
                <el-select v-model="scope.row.contractType" clearable>
                  <el-option v-for="dict in contractTypeList" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </template>
            </el-table-column>

            <el-table-column prop="polCode" min-width="140px" label="POL">
              <template slot-scope="scope">
                <el-input v-model="scope.row.polCode" />
              </template>
            </el-table-column>

            <el-table-column min-width="130px" prop="region" label="Pol Region" v-if="[1, 3, 4, 5, 6, 7].includes(showVessel)" key="2">
              <template slot-scope="scope">
                <el-select filterable v-model="scope.row.region" clearable class="custom-select">
                  <el-option v-for="(item, index) in contractRegionList" :key="index" :label="item.region" :value="item.id+''"></el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column prop="podCode" min-width="140px" label="POD">
              <template slot-scope="scope">
                <el-select filterable v-model="scope.row.podCode">
                  <el-option v-for="(item, index) in  polList" :key="index + 'pod'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column prop="pod" min-width="140px" label="Pod Region">
              <template slot-scope="scope">
                <el-select filterable v-model="scope.row.pod">
                  <el-option v-for="(item, index) in  podList" :key="index + 'pod'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column prop="originCountry" min-width="140px" label="Origin Country" key="3">
              <template slot-scope="scope">
                <el-select filterable v-model="scope.row.originCountry">
                  <el-option
                    v-for="dict in countryList.slice().reverse()"
                    :key="dict"
                    :label="dict"
                    :value="dict"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column min-width="120px" prop="service" label="Service">
              <template slot-scope="scope">
                <el-input v-model="scope.row.service" />
              </template>
            </el-table-column>
            <el-table-column min-width="180px" prop="vessel" label="Vessel" v-if="showVessel == 2 || showVessel == 3  || showVessel == 7">
              <template slot-scope="scope">
                <el-select v-model="scope.row.vessel" filterable remote reserve-keyword clearable :remote-method="remoteMethod">
                  <el-option v-for="dict in vesselListLes" :key="dict.value" :label="dict.vesselName" :value="dict.vesselName" />
                </el-select>
              </template>
            </el-table-column>

            <el-table-column min-width="120px" prop="voyage" label="Voyage" v-if="showVessel == 2 || showVessel == 3  || showVessel == 7">
              <template slot-scope="scope">
                <el-input v-model="scope.row.voyage" />
              </template>
            </el-table-column>
            <el-table-column min-width="180px" prop="vessel2" label="Vessel2" v-if="showVessel == 2 || showVessel == 7">
              <template slot-scope="scope">
                <el-select v-model="scope.row.vessel2" filterable remote reserve-keyword clearable :remote-method="remoteMethod">
                  <el-option v-for="dict in vesselListLes" :key="dict.value" :label="dict.vesselName" :value="dict.vesselName" />
                </el-select>
              </template>
            </el-table-column>

            <el-table-column min-width="120px" prop="voyage2" label="Voyage2" v-if="showVessel == 2 || showVessel == 7">
              <template slot-scope="scope">
                <el-input v-model="scope.row.voyage2" />
              </template>
            </el-table-column>
            <el-table-column prop="service" label="Service" v-if="showVessel == 2" key="6">
              <template slot-scope="scope">
                <el-input v-model="scope.row.service" />
              </template>
            </el-table-column>

            <el-table-column prop="contractualTeu" min-width="150px" label="Contractual (TEU)">
              <template slot-scope="scope">
                <el-input-number :controls="false" :precision="1" :max="9999999" v-model="scope.row.contractualTeu" />
              </template>
            </el-table-column>

            <el-table-column prop="allocationTeu" min-width="150px" label="Confirmed (TEU)">
              <template slot-scope="scope">
                <el-input-number :controls="false" :precision="1" :max="9999999" v-model="scope.row.allocationTeu" />
              </template>
            </el-table-column>
            <el-table-column prop="extarAllocationTeu" min-width="165px" label="Confirmed Extra (TEU)">
              <template slot-scope="scope">
                <el-input-number :controls="false" :precision="1" :max="9999999" v-model="scope.row.extarAllocationTeu" />
              </template>
            </el-table-column>
            <el-table-column prop="remark" min-width="100px" label="Remark">
              <template slot-scope="scope">
                <el-input type="textarea" rows="1" placeholder="Remark" v-model="scope.row.remark"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="Actions" min-width="150px">
              <template slot-scope="scope">
                <el-button v-show="scope.row.id != null" size="mini" type="text" icon="el-icon-edit" @click="updateContractItem(scope.row)">{{ $t("booking.update") }}</el-button>
                <el-button size="mini" type="text" icon="el-icon-delete" @click="deleteRow(scope.$index,scope.row)">{{ $t("search.delete") }}</el-button>
              </template>
            </el-table-column>
          </el-table>

          <br />
          <el-form-item label="Comments" prop="remark" label-width="90px">
            <el-input v-model="form.remark" type="textarea" rows="3" placeholder="Notes for changes in allocation or special requests for allocation. " />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <pagination v-show="subItemTotal > 0" :total="subItemTotal" :page.sync="queryItemParams.pageNo" :limit.sync="queryItemParams.pageSize" class="itemPageCss" @pagination="getContractItemPage" />
          <el-button type="primary" @click="submitForm">Submit</el-button>
          <el-button @click="cancel">Cancel</el-button>
        </div>
      </el-dialog>
    </div>

    <el-dialog title="Region" :visible.sync="regionVisible" width="100%" @open="openRegion" fullscreen destroy-on-close>
      <!-- 搜索工作栏 -->
      <el-form :model="queryParamsRegion" ref="queryFormRegion" size="small" :inline="true" label-width="68px">
        <el-form-item label="Region" prop="region">
          <el-input v-model="queryParamsRegion.region" placeholder="Region" clearable @keyup.enter.native="handleRegionQuery" @blur="queryParamsRegion.region = $event.target.value.trim()" />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleRegionQuery" type="primary">
            Search
            <i class="el-icon-search el-icon--right"></i>
          </el-button>

          <el-button @click="handleRegionAdd" type="primary" plain>
            Create
            <i class="el-icon-plus el-icon--right"></i>
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 列表 -->
      <el-table v-loading="regionLoading" :data="regionList">
        <el-table-column label="Region" align="center" prop="region" min-width="140" />
        <!--        <el-table-column label="Ports" align="center" prop="ports"  min-width="250">-->
        <!--          <template v-slot="scope">-->
        <!--            <el-tag-->
        <!--              v-if="scope.row.ports"-->
        <!--              style="margin-right: 5px"-->
        <!--              v-for="(port, index) in scope.row.ports.split(',')"-->
        <!--              :key="index"-->
        <!--            >{{ port + " " }}</el-tag>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="Create Date" align="center" prop="createTime" min-width="140">
          <template v-slot="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label align="center" class-name="small-padding fixed-width" min-width="220">
          <template v-slot="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleRegionUpdate(scope.row)">Update</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleRegionDelete(scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pagination v-show="regionTotal > 0" :total="regionTotal" :page.sync="queryParamsRegion.pageNo" :limit.sync="queryParamsRegion.pageSize" @pagination="getRegionList" />

      <!-- 对话框(添加 / 修改) -->
      <el-dialog :title="regionTitle" :visible.sync="regionOpen" width="75%" v-dialogDrag append-to-body>
        <el-form ref="regionForm" :model="regionForm" :rules="rules" label-width="80px" :show-message="false">
          <el-form-item label="Region" required prop="region">
            <el-input v-model="regionForm.region" placeholder="Region" />
          </el-form-item>
          <el-form-item label="Ports" required prop="ports">
            <el-select filterable multiple v-model="regionForm.ports" class="custom-select-2" placeholder="Ports">
              <el-option v-for="(item, index) in  polList" :key="index" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitRegionForm">Submit</el-button>
          <el-button @click="regionCancel">Cancel</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<style>
.itemPageCss {
  float: left;
  padding: 0;
  margin: 0;
}
.contract-css .el-form-item__content {
  margin: 0 !important;
}
.contract-css label.el-form-item__label {
  display: none;
}
.contract-css.pol {
  padding: 5px 0px;
}
ul.el-upload-list.el-upload-list--text {
  max-height: 75px;
  overflow: auto;
}
.upload-demo .el-upload-list__item.is-success:focus:not(:hover) {
  display: none !important;
}
.upload-demo i.el-icon-close {
  color: red !important;
}
.hlcu-month .el-date-picker__header.el-date-picker__header--bordered {
  display: none;
}
.el-select.custom-select.el-select--mini {
  max-height: 120px;
}
.custom-select .el-select__tags {
  max-height: 100px;
  overflow-y: auto;
}
</style>

<script>
import auth from '@/plugins/auth'
import {
  createContract,
  updateContract,
  deleteContract,
  downloadContractItemTemplate,
  getWeeksByContractId,
  getContract,
  getContractPage,
  exportContractExcel,
  getContractItemPage,
  deleteContractItem,
  updateContractItem
} from '@/api/booking/contract'
import XLSX from 'xlsx'
import { getOriginDeliveryList } from '@/api/system/originDelivery'
import { getPolPodList } from '@/api/system/polPod'
import { getVesselList } from '@/api/system/vessel'
import { getBaseHeader } from '@/utils/request'
import { getFileList, deleteFile } from '@/api/infra/file'
import { createContractRegion, updateContractRegion, deleteContractRegion, getContractRegion, getContractRegionPage, getContractRegionList } from '@/api/booking/contractRegion'
import { listDept } from '@/api/system/dept'
import { getCountryList} from "@/api/system/country";
import {DICT_TYPE, getDictDatas} from "@/utils/dict";

export default {
  name: 'Contract',
  computed: {
    DICT_TYPE() {
      return DICT_TYPE
    }
  },
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      pickerYearOptions: {
        disabledDate(time) {
          // 禁用2022年之前的日期
          return time.getFullYear() < 2022
        }
      },
      pickerOptions: {
        disabledDate(time) {
          // 禁用年份选择
          return time.getFullYear() !== new Date().getFullYear()
        }
      },
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // booking_contract列表
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      height: '',
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        carrier: null,
        status: null
      },
      subItemData: [],
      vesselListLes: [],
      // 表单参数
      form: {
        carrier: null,
        contractNo: null,
        priotity: null,
        validFrom: null,
        validTo: null,
        rule: 1,
        regionPorts: [],
        fileList: []
      },
      // 表单校验
      rules: {},
      statusList: [{ value: 'Active' }, { value: 'Expired' }, { value: 'Incoming' }],
      ruleOptions: [
        { label: 'TSHG Based', value: 3 },
        { label: 'MAEU Based', value: 4 }
        // { label: 'HLCU Based', value: 5 }
        // { label: 'TEMP Based', value: 6 },
        // { label: 'TSHG BD & CHINA Based', value: 7 }
      ],
      priotityOptions: [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }
      ],
      showVessel: 1,
      portOptions: [],
      countryList: [],
      polList: [],
      podList: [
        // { code: 'NEU', name: 'NORTH EUROPE' },
        // { code: 'MED', name: 'MEDITERRANEAN' }
        { code: 'ES', name: 'Espana' },
        { code: 'HU', name: 'Hungary' },
        { code: 'PL', name: 'Poland' },
        { code: 'RO', name: 'Roumania' }
      ],
      formLoading: false,
      subItemLoading: false,
      subItemTotal: 0,
      numbers: [],
      queryItemParams: {
        pageNo: 1,
        pageSize: 10,
        allocationWeek: null,
        allocationYear: null
      },
      cId: null,
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/admin-api/shipment/contract-item/import-contract-item'
      },
      checkLoading: false,
      allocationTSHGHeaders: [
        'Allocation Year',
        'Allocation Week',
        'Contract Type',
        'Pol Region',
        'Vessel',
        'Voyage',
        'Contractual Allocation (TEU)',
        'Confirmed Allocation (TEU)',
        'Confirmed Extra Allocation (TEU)',
        'Remark'
      ],
      allocationTSHGHeaders2: [
        'Allocation Year',
        'Allocation Week',
        'Region',
        'Vessel',
        'Voyage',
        'Vessel2',
        'Voyage2',
        'Contractual Allocation (TEU)',
        'Confirmed Allocation (TEU)',
        'Confirmed Extra Allocation (TEU)',
        'Remark'
      ],
      allocationMAEUHeaders: [
        'Allocation Year',
        'Allocation Week',
        'Contract Type',
        'Pol Region',
        'Pod Region',
        'POD',
        'Service',
        'Contractual Allocation (TEU)',
        'Confirmed Allocation (TEU)',
        'Confirmed Extra Allocation (TEU)',
        'Remark'
      ],
      allocationTEMPHeaders: ['Allocation Year', 'Allocation Week', 'Region', 'Contractual Allocation (TEU)', 'Confirmed Allocation (TEU)', 'Confirmed Extra Allocation (TEU)', 'Remark'],
      allocationHLCUHeaders: ['Allocation Year', 'Allocation Week', 'Region', 'Contractual Allocation (TEU)', 'Confirmed Allocation (TEU)', 'Confirmed Extra Allocation (TEU)', 'Remark'],
      allocationHeaders: ['Allocation Year', 'Allocation Week', 'Contract Type', 'Region', 'POD', 'Contractual Allocation (TEU)', 'Confirmed Allocation (TEU)', 'Confirmed Extra Allocation (TEU)', 'Remark'],
      allocationVesselHeaders: ['Allocation Year', 'Vessel', 'Voyage', 'Service', 'Contractual Allocation (TEU)', 'Confirmed Allocation (TEU)', 'Confirmed Extra Allocation (TEU)', 'Remark'],
      showContractNo: false,
      contractTypeList: [
        { label: 'Standard', value: 'Standard' },
        { label: 'Floating', value: 'Floating' },
        { label: 'Alwaysspace', value: 'Alwaysspace' },
        { label: 'Addtional', value: 'Addtional' }
      ],
      regionVisible: false,
      // 遮罩层
      regionLoading: true,
      // 总条数
      regionTotal: 0,
      // booking_contract_region列表
      regionList: [],
      // 弹出层标题
      regionTitle: '',
      // 是否显示弹出层
      regionOpen: false,
      // 查询参数
      queryParamsRegion: {
        pageNo: 1,
        pageSize: 15,
        region: null,
        ports: null,
        createTime: []
      },
      // 表单参数
      regionForm: {},
      contractRegionList: [],
      customerOptions: []
    }
  },
  created() {
    this.getCountryList()
    this.getList()
    this.getOriginDeliveryList()
    this.getRegionPostsList()

    if (auth.hasPermi('booking:contract:update')) {
      this.showContractNo = true
    }
    const clientHeight = document.documentElement.clientHeight
    this.height = clientHeight - 420
    this.getCustomerParties()
    // this.getPortList()
  },
  methods: {
    getDictDatas,
    getCountryList() {
      getCountryList().then(response => {
        for (let datum of response.data) {
          if(!this.countryList.includes(datum.countryCode)){
            this.countryList.push(datum.countryCode)
          }
        }
      })
    },
    getPortList() {
      this.polList = []
      getPolPodList().then(response => {
        this.polList = response.data
      })
    },
    getCustomerParties() {
      listDept().then(response => {
        this.customerOptions = response.data.filter(item => {
          return item.partyRole.includes('Customer')
        })
      })
    },
    openRegionAdd() {
      this.regionVisible = true
    },
    getRegionPostsList() {
      getContractRegionList().then(res => {
        this.contractRegionList = res.data
      })
    },
    openRegion() {
      this.getRegionList()
    },
    /** 查询列表 */
    getRegionList() {
      this.regionLoading = true
      // 执行查询
      getContractRegionPage(this.queryParamsRegion).then(response => {
        this.regionList = response.data.list
        this.regionTotal = response.data.total
        this.regionLoading = false
      })
    },
    /** 取消按钮 */
    regionCancel() {
      this.regionOpen = false
      this.regionReset()
    },
    /** 表单重置 */
    regionReset() {
      this.regionForm = {
        id: undefined,
        region: undefined,
        ports: undefined
      }
      this.resetForm('regionForm')
    },
    /** 搜索按钮操作 */
    handleRegionQuery() {
      this.queryParamsRegion.pageNo = 1
      this.getRegionList()
    },
    /** 新增按钮操作 */
    handleRegionAdd() {
      this.regionReset()
      this.regionOpen = true
      this.regionTitle = 'Add'
    },
    /** 修改按钮操作 */
    handleRegionUpdate(row) {
      this.regionReset()
      const id = row.id
      getContractRegion(id).then(response => {
        var data = response.data
        data.ports = data.ports.split(',')
        this.regionForm = data
        this.regionOpen = true
        this.regionTitle = 'Update'
      })
    },
    /** 提交按钮 */
    submitRegionForm() {
      this.$refs['regionForm'].validate(valid => {
        if (!valid) {
          return
        }
        var data = this.regionForm
        data.ports = this.regionForm.ports.join(',')
        // 修改的提交
        if (this.regionForm.id != null) {
          updateContractRegion(data).then(response => {
            this.$modal.msgSuccess('Success')
            this.regionOpen = false
            this.getRegionList()
            this.getRegionPostsList()
          })
          return
        }
        // 添加的提交
        createContractRegion(data).then(response => {
          this.$modal.msgSuccess('Success')
          this.regionOpen = false
          this.getRegionList()
          this.getRegionPostsList()
        })
      })
    },
    /** 删除按钮操作 */
    handleRegionDelete(row) {
      const id = row.id
      this.$modal
        .confirm('Are you sure you want to delete it? ')
        .then(function () {
          return deleteContractRegion(id)
        })
        .then(() => {
          this.getRegionList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    handleClose() {
      this.open = false
      this.subItemData = []
      this.queryItemParams.allocationYear = ''
    },
    padZero(month) {
      if (month) {
        return month < 10 ? '0' + month : month
      }
    },
    handlePreview(file) {
      if (file.id) {
        window.location.href = file.url
      }
    },

    beforeRemove(file, fileList) {
      return this.$confirm('Delete "' + file.name + '"?')
    },
    /** 删除文档按钮操作 */
    deleteDocument(row, fileList) {
      if (row.id) {
        deleteFile(row.id)
        this.$set(this.form, 'tempaax', 1)
        this.$delete(this.form, 'tempaax')
        this.$notify.success('Success')
      }
    },
    async getFileList(item, type) {
      var list = await getFileList({ exId: item.id, dataType: type })
      this.form.fileList = list.data
      this.$set(this.form, 'tempaax', 1)
      this.$delete(this.form, 'tempaax')
      return list.data
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      console.log('文件上传成功')
      console.log('上传的返回值', response.data)
      if (response.code == null || response.code !== 0) {
        console.log('上传的返回值', response.data)
        this.$modal.msgError(response.msg)
        this.upload.open = false
        this.upload.isUploading = false
        this.$refs.upload.clearFiles()
        return
      }
      console.log('上传的返回值111', response.data)
      // 将结果添加到this.data中
      // this.subItemData = this.subItemData.concat(response.data)
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
    },

    // 文件上传失败处理
    handleFileError(err, file, fileList) {
      console.log('文件上传失败')
      console.log(err)
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
    },
    // 提交上传文件
    submitFileForm(id) {
      this.$set(this.upload, 'url', this.upload.url + '?id=' + id)
      this.$nextTick(() => {
        this.$refs.upload.submit()
      })
    },
    parseStatus(row) {
      var date = new Date().getTime()
      if (row.validTo >= date && row.validFrom <= date) {
        return 'Active'
      } else if (row.validTo < date) {
        return 'Expired'
      } else {
        return 'Incoming'
      }
    },
    /** 导入按钮操作 */
    handleImport() {
      // 上传 contract item
      this.upload.title = 'Upload'
      this.upload.open = true
      this.upload.url = process.env.VUE_APP_BASE_API + '/admin-api/pepco/shipping/order/import-booking-score'
    },
    downloadImportTemplate() {
      downloadContractItemTemplate(this.form.rule).then(res => {
        this.$download.excel(res, 'import_allocation_template.xlsx')
      })
    },
    beforeUploadContainers(file) {
      var vm = this
      this.file2Xce(file).then(tabJson => {
        console.log('json', tabJson)
        console.log('this.showVessel', this.showVessel)
        if (tabJson && tabJson.length > 0 && tabJson[0].sheet.length > 0) {
          var errorList = []
          var listTable = []
          vm.checkLoading = true
          const keyList = tabJson[0].sheetHeaders
          console.log('this.keyList', keyList)
          //check key
          if (this.showVessel == 2) {
            for (var i = 0; i < this.allocationVesselHeaders.length; i++) {
              if (!keyList.includes(this.allocationVesselHeaders[i])) {
                errorList.push(this.allocationVesselHeaders[i])
                break
              }
            }
          } else if (this.showVessel == 1) {
            for (var i = 0; i < this.allocationHeaders.length; i++) {
              if (!keyList.includes(this.allocationHeaders[i])) {
                errorList.push(this.allocationHeaders[i])
                break
              }
            }
          } else if (this.showVessel == 3) {
            console.log('this.allocationTSHGHeaders', this.allocationTSHGHeaders)
            for (var i = 0; i < this.allocationTSHGHeaders.length; i++) {
              if (!keyList.includes(this.allocationTSHGHeaders[i])) {
                errorList.push(this.allocationTSHGHeaders[i])
                break
              }
            }
          }
          // else if (this.showVessel == 4) {
          //   console.log('this.allocationMAEUHeaders', this.allocationTSHGHeaders2)
          //   for (var i = 0; i < this.allocationTSHGHeaders2.length; i++) {
          //     if (!keyList.includes(this.allocationTSHGHeaders2[i])) {
          //       errorList.push(this.allocationTSHGHeaders2[i])
          //       break
          //     }
          //   }
          // }
          else if (this.showVessel == 4) {
            console.log('this.allocationMAEUHeaders', this.allocationMAEUHeaders)
            for (var i = 0; i < this.allocationMAEUHeaders.length; i++) {
              if (!keyList.includes(this.allocationMAEUHeaders[i])) {
                errorList.push(this.allocationMAEUHeaders[i])
                break
              }
            }
          } else if (this.showVessel == 5) {
            for (var i = 0; i < this.allocationHLCUHeaders.length; i++) {
              if (!keyList.includes(this.allocationHLCUHeaders[i])) {
                errorList.push(this.allocationHLCUHeaders[i])
                break
              }
            }
          } else if (this.showVessel == 5) {
            for (var i = 0; i < this.allocationTEMPHeaders.length; i++) {
              if (!keyList.includes(this.allocationTEMPHeaders[i])) {
                errorList.push(this.allocationTEMPHeaders[i])
                break
              }
            }
          }

          if (errorList.length > 0) {
            vm.$notify({
              title: 'Warning',
              message: errorList + ' does not exist, Please use the import template to import',
              type: 'warning'
            })
            vm.checkLoading = false
            return
          }
          //get data
          tabJson[0].sheet.forEach((item, index, key) => {
            listTable.push(item)
          })
          //copy value
          const groupedData = {}
          //清除默认没有输入数据的一行
          if (listTable.length > 0 && this.subItemData.length > 0) {
            for (var i = 0; i < this.subItemData.length; i++) {
              if (this.subItemData[i]['allocationYear'] == null || this.subItemData[i]['allocationYear'] == 0) {
                this.subItemData.splice(i, 1)
                i--
              }
            }
          }
          console.log('this.podList', this.podList)
          listTable.forEach((item, index) => {
            var podCode = null
            var pod = null
            var contractTypeValue = null
            var regionId = null
            console.log('item', item)
            if (item['POD']) {
              var obj = this.polList.find(it => it.code == item['POD'].trim() || it.name == item['POD'].trim())
              if (obj) {
                podCode = obj.code
              }
            }
            if (item['Pod Region']) {
              var obj = this.podList.find(it => it.code == item['Pod Region'].trim() || it.name == item['Pod Region'].trim())
              if (obj) {
                pod = obj.code
              }
            }
            if (item['Contract Type']) {
              console.log('this.contractTypeList', this.contractTypeList)
              console.log('item[Contract Type]', item['Contract Type'])
              var obj = this.contractTypeList.find(it => it.label.replaceAll(' ', '') == item['Contract Type'].trim().replaceAll(' ', ''))
              if (obj) {
                contractTypeValue = obj.value
              }
            }
            if (item['Pol Region']) {
              const regionStr = String(item['Pol Region'] || '').trim()
              var data = this.contractRegionList.find(it => it.region === regionStr)
              if (data) {
                regionId = data.id + ''
              }
            }
            var month = this.padZero(item['Allocation Month']) + ''
            this.subItemData.push({
              allocationYear: item['Allocation Year'] ? item['Allocation Year'] + ''.trim() : null,
              allocationWeek: item['Allocation Week'] ? item['Allocation Week'] + ''.trim() : null,
              contractType: contractTypeValue,
              allocationMonth: month,
              pol: item['POL'] ? item['POL'] + ''.trim() : null,
              region: regionId,
              pod: pod,
              podCode: podCode,
              originCountry: item['Origin Country'] ? item['Origin Country'] + ''.trim() : null,
              vessel: item['Vessel'] ? String(item['Voyage'] || '').trim() : null,
              voyage: item['Voyage'] ? String(item['Voyage'] || '').trim() : null,
              vessel2: item['Vessel2'] ? item['Vessel2'].trim() : null,
              voyage2: item['Voyage2'] ? item['Voyage2'].trim() : null,
              service: item['Service'] ? String(item['Service'] || '').trim() : null,
              contractualTeu: item['Contractual Allocation (TEU)'] ? item['Contractual Allocation (TEU)'] + ''.trim() : null,
              allocationTeu: item['Confirmed Allocation (TEU)'] ? item['Confirmed Allocation (TEU)'] + ''.trim() : null,
              extarAllocationTeu: item['Confirmed Extra Allocation (TEU)'] ? item['Confirmed Extra Allocation (TEU)'] + ''.trim() : null,
              remark: item['Remark']
            })
          })
        }
      })
      vm.checkLoading = false
      this.upload.open = false
    },

    file2Xce(file) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader()
        reader.onload = function (e) {
          const data = e.target.result
          this.wb = XLSX.read(data, {
            type: 'binary'
          })
          // 获取工作簿中的第一个工作表，您可以根据需要更改 sheet_name_or_index
          const wsname = this.wb.SheetNames[0]
          const ws = this.wb.Sheets[wsname]

          // 将工作表转换为 JSON 对象数组
          const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 })

          // jsonData 的第一行包含了表头信息
          const headers = jsonData[0]
          const result = []
          this.wb.SheetNames.forEach(sheetName => {
            result.push({
              sheetName: sheetName,
              sheetHeaders: headers,
              sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])
            })
          })
          console.log('转换后的数据', result)
          resolve(result)
        }
        reader.readAsBinaryString(file.raw)
      })
    },
    remoteMethod(query) {
      if (query !== '' && query.length >= 3) {
        getVesselList({ vesselName: query }).then(response => {
          this.vesselListLes = response.data
        })
      } else {
        this.vesselListLes = []
      }
    },
    getOriginDeliveryList() {
      getOriginDeliveryList().then(res => {
        this.polList = res.data
      })
    },
    changeRule(value) {
      this.showVessel = value
    },
    deleteRow(index, row) {
      // 删除指定索引的行
      if (row.id) {
        this.deleteItemById(index, row)
      } else {
        this.subItemData.splice(index, 1)
      }
    },
    addItemRow() {
      // 添加新行在第一行
      this.subItemData.unshift({
        allocationYear: null,
        allocationWeek: null,
        allocationMonth: null,
        polCode: null,
        region: null,
        pod: null,
        allocationTeu: null,
        extarAllocationTeu: null,
        remark: null
      })
    },

    deleteRegionPortRow(index) {
      // 删除指定索引的行
      this.form.regionPorts.splice(index, 1)
    },
    addRegionPortRow() {
      // 添加新行
      this.form.regionPorts.push({ region: null, pol: null })
    },
    /** 查询列表 */
    getList() {
      this.loading = true
      // 执行查询
      getContractPage(this.queryParams).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.loading = false
      })
    },
    /** 取消按钮 */
    cancel() {
      this.open = false
      this.reset()
    },
    /** 表单重置 */
    reset() {
      this.form = {
        carrier: null,
        contractNo: null,
        priotity: null,
        validFrom: null,
        validTo: null,
        rule: 3,
        regionPorts: []
      }
      this.changeRule(3)
      this.subItemData = []
      this.subItemTotal = 0
      this.queryItemParams.allocationWeek = null
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true
      this.title = 'Add'
      this.reset()
      this.addRegionPortRow()
      this.addItemRow()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.open = true
      this.title = 'Update'
      this.reset()
      this.formLoading = true
      this.cId = row.id
      this.numbers = []
      getWeeksByContractId(this.cId).then(res => {
        this.numbers = res.data
      })
      getContract(this.cId).then(response => {
        this.form = response.data
        if (this.form.regionPorts) {
          this.form.regionPorts = JSON.parse(this.form.regionPorts)
        }
        this.changeRule(this.form.rule)
        this.getFileList(this.form, 'contract')
        this.queryItemParams.contractId = this.cId
        this.getContractItemPage()
      })
      this.formLoading = false
    },
    getContractItemPage() {
      this.subItemLoading = true
      getContractItemPage(this.queryItemParams).then(response => {
        const data = [...response.data.list]
        data.forEach(item => {
          if (!this.podList.find(elem => elem.code == item.pod)) {
            item.pod = null
          }
          if (!this.contractRegionList.find(elem => elem.id == item.region)) {
            item.region = null
          }
        })
        this.subItemData = response.data.list
        this.subItemTotal = response.data.total
        this.subItemLoading = false
      })
    },
    updateContractItem(row) {
      row.contractId = this.cId
      this.$modal
        .confirm('Are you sure you want to update it? ')
        .then(function () {
          return updateContractItem(row)
        })
        .then(() => {
          this.getContractItemPage()
          this.$modal.msgSuccess('Success')
        })
        .catch(() => {})
    },
    /** 提交按钮 */
    submitForm() {
      var vm = this
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        console.log('form', this.form)
        if (this.form.carrier == null || this.form.carrier == '') {
          this.$modal.msgError('Please select a carrier')
          return
        }
        if (this.form.contractNo == null || this.form.contractNo == '') {
          this.$modal.msgError('Please input contract number')
          return
        }
        this.formLoading = true
        var data = this.form

        data.regionPorts = JSON.stringify(this.form.regionPorts)
        // 修改的提交
        if (this.form.id != null) {
          const newData = this.subItemData.filter(item => item.id == null)
          data.subItemData = JSON.stringify(newData)
          this.submitFileForm(this.form.id)
          updateContract(data).then(response => {
            this.$modal.msgSuccess('Success')
            this.open = false
            this.getList()
            this.formLoading = false
          })
          return
        }

        // 添加的提交

        data.subItemData = JSON.stringify(this.subItemData)
        createContract(data).then(response => {
          this.$modal.msgSuccess('Success')
          this.open = false
          if (response.data) {
            this.submitFileForm(response.data)
          }
          this.getList()
          this.formLoading = false
        })
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id
      this.$modal
        .confirm('Are you sure you want to delete it? ')
        .then(function () {
          return deleteContract(id)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('Success')
        })
        .catch(() => {})
    },
    deleteItemById(index, row) {
      const id = row.id
      this.$modal
        .confirm('Are you sure you want to delete it? ')
        .then(function () {
          return deleteContractItem(id)
        })
        .then(() => {
          this.subItemData.splice(index, 1)
          this.getContractItemPage()
          this.$modal.msgSuccess('Success')
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = { ...this.queryParams }
      params.pageNo = undefined
      params.pageSize = undefined
      this.$modal
        .confirm('是否确认导出所有booking_contract数据项?')
        .then(() => {
          this.exportLoading = true
          return exportContractExcel(params)
        })
        .then(response => {
          this.$download.excel(response, 'booking_contract.xlsx')
          this.exportLoading = false
        })
        .catch(() => {})
    }
  }
}
</script>
