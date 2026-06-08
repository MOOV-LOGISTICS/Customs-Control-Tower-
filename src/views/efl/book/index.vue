<template>
  <div class="app-container" style="width:100%; margin: 0 auto">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Active Booking" name="first">
        <!-- 搜索工作栏 -->
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

          <el-form-item label="" prop="contractNote">
            <el-input style="width: 200px;" v-model="queryParams.lotNo" placeholder="Please input from LotNo" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary">Search<i class="el-icon-search el-icon--right" @click="handleQuery"></i></el-button>
            <!-- <el-button icon="el-icon-refresh" @click="resetQuery">Reset</el-button> -->
          </el-form-item>
        </el-form>

        <!-- 操作工具栏 -->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button size="mini" type="primary" icon="el-icon-upload2" @click="handleImport">{{ $t("search.import")
            }}</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" style="right: 200px"></right-toolbar>
        </el-row>

        <!-- 列表 -->
        <el-table v-loading="loading" :data="list" fixed>
          <el-table-column show-overflow-tooltip width="150" label="Lot Number" align="center" prop="lotNo" fixed />

          <el-table-column show-overflow-tooltip width="100" label="Batch No" align="center" prop="batchNo" />

          <el-table-column show-overflow-tooltip width="150 " label="Status" align="center" prop="recStatus" />

          <el-table-column show-overflow-tooltip width="120" label="Hot PO" align="center" prop="hotPo" >
            <template slot-scope="scope">
              {{ scope.row.hotpo == 1 ? 'Yes' : 'No' }}
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip width="120" label="VDDL" align="center" prop="vddl" >
            <template slot-scope="scope">
              {{ scope.row.vddl == 1 ? 'Yes' : '' }}
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip width="120" label="Cargo Type" align="center" prop="cargoType" />

          <el-table-column show-overflow-tooltip width="150" label="Incoterm" align="center" prop="incoTerm" />

          <el-table-column show-overflow-tooltip width="150" label="Agent Name" align="center" prop="vmtAgentName" />

          <el-table-column show-overflow-tooltip width="200" label="Supplier Name" align="center" prop="supplierName" />

          <el-table-column show-overflow-tooltip width="200" label="Sequence Number" align="center" prop="seqNo" />

          <el-table-column show-overflow-tooltip width="120" label="POL" align="center" prop="pol" />

          <el-table-column show-overflow-tooltip width="120" label="Discharge POD" align="center" prop="disPod" />

          <el-table-column show-overflow-tooltip width="120" label="Destination POD" align="center" prop="desPod" />

          <el-table-column show-overflow-tooltip width="120" label="Fob Week OWIM" align="center" prop="fobWeekOwim" />

          <el-table-column show-overflow-tooltip width="120" label="Booked ETD" align="center" prop="etdDate" />

          <el-table-column show-overflow-tooltip width="150" label="Booked ETD Week" align="center" prop="etdWeek" />

          <el-table-column show-overflow-tooltip width="120" label="Carrier Name" align="center" prop="carrierName" />

          <el-table-column show-overflow-tooltip width="120" label="QC/SR Release" align="center" prop="qcSrRelease" />

          <el-table-column show-overflow-tooltip width="120" label="20'GP" align="center" prop="ctn20gp" />

          <el-table-column show-overflow-tooltip width="120" label="40'GP" align="center" prop="ctn40gp" />

          <el-table-column show-overflow-tooltip width="120" label="40'HQ" align="center" prop="ctn40hq" />

          <el-table-column show-overflow-tooltip width="120" label="40'NOR" align="center" prop="ctn40nor" />

          <el-table-column show-overflow-tooltip width="120" label="40'HQ RF" align="center" prop="ctn40hqrf" />

          <el-table-column show-overflow-tooltip width="120" label="45'HQ" align="center" prop="ctn45hq" />

          <el-table-column show-overflow-tooltip width="120" label="Total TEU" align="center" prop="totTeu" />

          <el-table-column show-overflow-tooltip width="120" label="CRD Date" align="center" prop="crdDate" />

          <el-table-column show-overflow-tooltip width="120" label="CRD Change" align="center" prop="crdChange" />

          <el-table-column show-overflow-tooltip width="120" :label="$constants.MBL_NUMBER" align="center" prop="mblNo" />

          <el-table-column show-overflow-tooltip width="120" label="Booking No" align="center" prop="bookNo" />

          <el-table-column show-overflow-tooltip width="120" label="Total CBM" align="center" prop="totCbm" />

          <el-table-column show-overflow-tooltip width="120" label="Carrier Service" align="center" prop="carrierService" />

          <el-table-column show-overflow-tooltip width="150" label="Contract No" align="center" prop="serviceContractNo" />

          <el-table-column show-overflow-tooltip width="120" label="Contract Note" align="center" prop="contractNote" />

          <el-table-column show-overflow-tooltip width="180" label="First Vessel" align="center" prop="vessel1" />

          <el-table-column show-overflow-tooltip width="120" label="First Voyage" align="center" prop="voyage1" />

          <el-table-column show-overflow-tooltip width="120" label="First POL" align="center" prop="pol1" />

          <el-table-column show-overflow-tooltip width="120" label="First POD" align="center" prop="pod1" />

          <el-table-column show-overflow-tooltip width="120" label="First ETD" align="center" prop="etd1" />

          <el-table-column show-overflow-tooltip width="120" label="First ETA" align="center" prop="eta1" />

          <el-table-column show-overflow-tooltip width="120" label="Second Vessel" align="center" prop="vessel2" />

          <el-table-column show-overflow-tooltip width="120" label="Second Voyage" align="center" prop="voyage2" />

          <el-table-column show-overflow-tooltip width="120" label="Second POL" align="center" prop="pol2" />

          <el-table-column show-overflow-tooltip width="120" label="Second POD" align="center" prop="pod2" />

          <el-table-column show-overflow-tooltip width="120" label="Second ETD" align="center" prop="etd2" />

          <el-table-column show-overflow-tooltip width="120" label="Second ETA" align="center" prop="eta2" />

          <el-table-column show-overflow-tooltip width="120" label="Third Vessel" align="center" prop="vessel3" />

          <el-table-column show-overflow-tooltip width="120" label="Third Voyage" align="center" prop="voyage3" />

          <el-table-column show-overflow-tooltip width="120" label="Third POL" align="center" prop="pol3" />

          <el-table-column show-overflow-tooltip width="120" label="Third POD" align="center" prop="pod3" />

          <el-table-column show-overflow-tooltip width="120" label="Third ETD" align="center" prop="etd3" />

          <el-table-column show-overflow-tooltip width="120" label="Third ETA" align="center" prop="eta3" />

          <el-table-column show-overflow-tooltip width="120" label="Booking Date" align="center" prop="bookDate" />

          <el-table-column show-overflow-tooltip width="120" label="Book Status" align="center" prop="bookStatus" />

          <el-table-column show-overflow-tooltip  width="150" label="Cancel Category" align="center" prop="cancelCategory" />

          <el-table-column show-overflow-tooltip  width="160" label="Cancel Reason" align="center" prop="cancelDetailReason" />

          <el-table-column show-overflow-tooltip  width="120" label="Cancel RefNo" align="center" prop="cancelReason" />

          <el-table-column show-overflow-tooltip width="120" label="So Release" align="center" prop="soRelease" />

          <el-table-column show-overflow-tooltip width="120" label="CTN Pickup Date" align="center" prop="ctnPickupDate" />

          <el-table-column show-overflow-tooltip width="120" label="SI Cut Off Date" align="center" prop="siCutOffDate" />


          <el-table-column show-overflow-tooltip width="120" label="ATD" align="center" prop="atdDate" />

          <el-table-column show-overflow-tooltip width="120" label="Shipping Status" align="center" prop="shippingStatus" />

          <el-table-column show-overflow-tooltip width="150" label="Special Allocation" align="center" prop="specialAlloc" />

          <el-table-column show-overflow-tooltip width="120" label="RefNo" align="center" prop="remark" />
          <el-table-column show-overflow-tooltip width="120" label="Activate Reason" align="center" prop="reactvtReason" />
          <el-table-column show-overflow-tooltip width="120" label="Created By" align="center" prop="createdBy" />

          <el-table-column show-overflow-tooltip width="120" label="Updated By" align="center" prop="lastUpdatedBy" />

          <el-table-column label="Created Date" align="center" prop="createdStamp" width="180">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.createdStamp) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Updated Date" align="center" prop="lastUpdatedStamp" width="180">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.lastUpdatedStamp) }}</span>
            </template>
          </el-table-column>

        </el-table>
        <!-- 分页组件 -->
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
          @pagination="getList" />

        <!-- 对话框(上传/下载模板) -->
        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body @close="cancelClick">
          <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :on-change="beforeUpload"
            :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
            :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              {{ $t("purchaseOrder.DragTheFileHereOr")
              }}<em>{{ $t("purchaseOrder.clickUpload") }}</em>
            </div>
            <div class="el-upload__tip text-center" slot="tip">
              <!-- <div class="el-upload__tip" slot="tip">
      <el-checkbox v-model="upload.updateSupport" />
      {{ $t("purchaseOrder.whetherToUpdateExistingData") }}
    </div> -->
              <span>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</span>
              <!-- <el-link
      type="primary"
      :underline="false"
      style="font-size: 12px; vertical-align: baseline"
      @click="importTemplate"
      >{{ $t("purchaseOrder.downloadingTheTemplate") }}</el-link
    > -->
            </div>
          </el-upload>
          <div slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="submitFileForm" :disabled="butLoading">{{
              $t("purchaseOrder.confirm")
            }}</el-button>
            <el-button size="mini" @click="cancelClick">{{
              $t("purchaseOrder.cancel")
            }}</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="On Board" name="second">
        <!-- 搜索工作栏 -->
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

          <el-form-item label="" prop="contractNote">
            <el-input  style="width: 200px;" v-model="queryParams.lotNo" placeholder="Please input from LotNo" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary">Search<i class="el-icon-search el-icon--right" @click="handleQuery"></i></el-button>
            <!-- <el-button icon="el-icon-refresh" @click="resetQuery">Reset</el-button> -->
          </el-form-item>
        </el-form>

        <!-- 操作工具栏 -->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button size="mini" type="primary" icon="el-icon-upload2" @click="handleImport">{{ $t("search.import")
            }}</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getReviewList" style="right: 200px"></right-toolbar>
        </el-row>

        <!-- 列表 -->
        <el-table v-loading="loading" :data="list" fixed>
          <el-table-column show-overflow-tooltip width="150" label="Lot Number" align="center" prop="lotno" fixed />

          <el-table-column show-overflow-tooltip width="100" label="Batch No" align="center" prop="batchno" />

          <el-table-column show-overflow-tooltip width="150 " label="Status" align="center" prop="recstatus" />

          <el-table-column show-overflow-tooltip width="120" label="Hot PO" align="center" prop="hotpo" >
            <template slot-scope="scope">
              {{ scope.row.hotpo == 1 ? 'Yes' : 'No' }}
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip width="120" label="VDDL" align="center" prop="vddl" >
            <template slot-scope="scope">
              {{ scope.row.vddl == 1 ? 'Yes' : '' }}
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip width="120" label="Cargo Type" align="center" prop="cargotype" />

          <el-table-column show-overflow-tooltip width="150" label="Incoterm" align="center" prop="incoterm" />

          <el-table-column show-overflow-tooltip width="150" label="Agent Name" align="center" prop="vmtagentname" />

          <el-table-column show-overflow-tooltip width="200" label="Supplier Name" align="center" prop="suppliername" />

          <el-table-column show-overflow-tooltip width="200" label="Sequence Number" align="center" prop="seqno" />

          <el-table-column show-overflow-tooltip width="120" label="POL" align="center" prop="pol" />

          <el-table-column show-overflow-tooltip width="120" label="Discharge POd" align="center" prop="dispod" />

          <el-table-column show-overflow-tooltip width="120" label="Destination pod" align="center" prop="despod" />

          <el-table-column show-overflow-tooltip width="120" label="Fob Week OWIm" align="center" prop="fobweekowim" />

          <el-table-column show-overflow-tooltip width="120" label="Booked ETD" align="center" prop="etddate" />

          <el-table-column show-overflow-tooltip width="150" label="Booked ETD Week" align="center" prop="etdweek" />

          <el-table-column show-overflow-tooltip width="120" label="Carrier Name" align="center" prop="carriername" />

          <el-table-column show-overflow-tooltip width="120" label="QC/SR Release" align="center" prop="qcsrrelease" />

          <el-table-column show-overflow-tooltip width="120" label="20'GP" align="center" prop="ctn20gp" />

          <el-table-column show-overflow-tooltip width="120" label="40'GP" align="center" prop="ctn40gp" />

          <el-table-column show-overflow-tooltip width="120" label="40'HQ" align="center" prop="ctn40hq" />

          <el-table-column show-overflow-tooltip width="120" label="40'NOR" align="center" prop="ctn40nor" />

          <el-table-column show-overflow-tooltip width="120" label="40'HQ RF" align="center" prop="ctn40hqrf" />

          <el-table-column show-overflow-tooltip width="120" label="45'HQ" align="center" prop="ctn45hq" />

          <el-table-column show-overflow-tooltip width="120" label="Total TEU" align="center" prop="totteu" />

          <el-table-column show-overflow-tooltip width="120" label="CRD Date" align="center" prop="crddate" />

          <el-table-column show-overflow-tooltip width="120" label="CRD Change" align="center" prop="crdchange" />

          <el-table-column show-overflow-tooltip width="120" :label="$constants.MBL_NUMBER" align="center" prop="mblno" />

          <el-table-column show-overflow-tooltip width="120" label="Booking No" align="center" prop="bookno" />

          <el-table-column show-overflow-tooltip width="120" label="Total CBM" align="center" prop="totcbm" />

          <el-table-column show-overflow-tooltip width="120" label="Carrier Service" align="center" prop="carrierservice" />

          <el-table-column show-overflow-tooltip width="150" label="Contract No" align="center" prop="servicecontractno" />

          <el-table-column show-overflow-tooltip width="120" label="Contract Note" align="center" prop="contractnote" />

          <el-table-column show-overflow-tooltip width="180" label="First Vessel" align="center" prop="vessel1" />

          <el-table-column show-overflow-tooltip width="120" label="First Voyage" align="center" prop="voyage1" />

          <el-table-column show-overflow-tooltip width="120" label="First POL" align="center" prop="pol1" />

          <el-table-column show-overflow-tooltip width="120" label="First POD" align="center" prop="pod1" />

          <el-table-column show-overflow-tooltip width="120" label="First ETD" align="center" prop="etd1" />

          <el-table-column show-overflow-tooltip width="120" label="First ETA" align="center" prop="eta1" />

          <el-table-column show-overflow-tooltip width="120" label="Second Vessel" align="center" prop="vessel2" />

          <el-table-column show-overflow-tooltip width="120" label="Second Voyage" align="center" prop="voyage2" />

          <el-table-column show-overflow-tooltip width="120" label="Second POL" align="center" prop="pol2" />

          <el-table-column show-overflow-tooltip width="120" label="Second POD" align="center" prop="pod2" />

          <el-table-column show-overflow-tooltip width="120" label="Second ETD" align="center" prop="etd2" />

          <el-table-column show-overflow-tooltip width="120" label="Second ETA" align="center" prop="eta2" />

          <el-table-column show-overflow-tooltip width="120" label="Third Vessel" align="center" prop="vessel3" />

          <el-table-column show-overflow-tooltip width="120" label="Third Voyage" align="center" prop="voyage3" />

          <el-table-column show-overflow-tooltip width="120" label="Third POL" align="center" prop="pol3" />

          <el-table-column show-overflow-tooltip width="120" label="Third POD" align="center" prop="pod3" />

          <el-table-column show-overflow-tooltip width="120" label="Third ETD" align="center" prop="etd3" />

          <el-table-column show-overflow-tooltip width="120" label="Third ETA" align="center" prop="eta3" />

          <el-table-column show-overflow-tooltip width="120" label="Booking Date" align="center" prop="bookdate" />

          <el-table-column show-overflow-tooltip width="120" label="Book Status" align="center" prop="bookstatus" />

          <el-table-column show-overflow-tooltip  width="150" label="Cancel Category" align="center" prop="cancelcategory" />

          <el-table-column show-overflow-tooltip  width="160" label="Cancel Reason" align="center" prop="canceldetailreason" />

          <el-table-column show-overflow-tooltip  width="120" label="Cancel RefNo" align="center" prop="cancelreason" />

          <el-table-column show-overflow-tooltip width="120" label="So Release" align="center" prop="sorelease" />

          <el-table-column show-overflow-tooltip width="120" label="CTN Pickup Date" align="center" prop="ctnpickupdate" />

          <el-table-column show-overflow-tooltip width="120" label="SI Cut Off Date" align="center" prop="sicutoffdate" />


          <el-table-column show-overflow-tooltip width="120" label="ATD" align="center" prop="atddate" />

          <el-table-column show-overflow-tooltip width="120" label="Shipping Status" align="center" prop="shippingstatus" />

          <el-table-column show-overflow-tooltip width="150" label="Special Allocation" align="center" prop="specialalloc" />

          <el-table-column show-overflow-tooltip width="120" label="RefNo" align="center" prop="remark" />
          <el-table-column show-overflow-tooltip width="120" label="Activate Reason" align="center" prop="reactvtreason" />
          <el-table-column show-overflow-tooltip width="120" label="Created By" align="center" prop="createdby" />

          <el-table-column show-overflow-tooltip width="120" label="Updated By" align="center" prop="lastupdatedby" />

          <el-table-column label="Created Date" align="center" prop="createdstamp" width="180">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.createdstamp) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Updated Date" align="center" prop="lastupdatedstamp" width="180">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.lastupdatedstamp) }}</span>
            </template>
          </el-table-column>

        </el-table>
        <!-- 分页组件 -->
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
          @pagination="getReviewList" />

        <!-- 对话框(上传/下载模板) -->
        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body  @close="cancelClick">
          <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"  :on-change="beforeUpload"
            :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
            :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              {{ $t("purchaseOrder.DragTheFileHereOr")
              }}<em>{{ $t("purchaseOrder.clickUpload") }}</em>
            </div>
            <div class="el-upload__tip text-center" slot="tip">
              <!-- <div class="el-upload__tip" slot="tip">
      <el-checkbox v-model="upload.updateSupport" />
      {{ $t("purchaseOrder.whetherToUpdateExistingData") }}
    </div> -->
              <span>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</span>
              <!-- <el-link
      type="primary"
      :underline="false"
      style="font-size: 12px; vertical-align: baseline"
      @click="importTemplate"
      >{{ $t("purchaseOrder.downloadingTheTemplate") }}</el-link
    > -->
            </div>
          </el-upload>
          <div slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="submitFileForm" :disabled="butLoading">{{
              $t("purchaseOrder.confirm")
            }}</el-button>
            <el-button size="mini" @click="cancelClick">{{
              $t("purchaseOrder.cancel")
            }}</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="Booking Not Used" name="third">

        <!-- 搜索工作栏 -->
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

          <el-form-item label="" prop="contractNote">
            <el-input style="width: 200px;" v-model="queryParams.lotNo" placeholder="Please input from LotNo" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary">Search<i class="el-icon-search el-icon--right" @click="handleQuery"></i></el-button>
            <!-- <el-button icon="el-icon-refresh" @click="resetQuery">Reset</el-button> -->
          </el-form-item>
        </el-form>

        <!-- 操作工具栏 -->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button size="mini" type="primary" icon="el-icon-upload2" @click="handleImport">{{ $t("search.import")
            }}</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getHistoricalList"
            style="right: 200px"></right-toolbar>
        </el-row>

        <!-- 列表 -->
        <el-table v-loading="loading" :data="list" fixed>
          <el-table-column show-overflow-tooltip width="150" label="Lot Number" align="center" prop="lotno" fixed />

          <el-table-column show-overflow-tooltip width="100" label="Batch No" align="center" prop="batchno" />

          <el-table-column show-overflow-tooltip width="150 " label="Status" align="center" prop="recstatus" />

          <el-table-column show-overflow-tooltip width="120" label="Hot PO" align="center" prop="hotpo" >
            <template slot-scope="scope">
              {{ scope.row.hotpo == 1 ? 'Yes' : 'No' }}
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip width="120" label="VDDL" align="center" prop="vddl" >
            <template slot-scope="scope">
              {{ scope.row.vddl == 1 ? 'Yes' : '' }}
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip width="120" label="Cargo Type" align="center" prop="cargotype" />

          <el-table-column show-overflow-tooltip width="150" label="Incoterm" align="center" prop="incoterm" />

          <el-table-column show-overflow-tooltip width="150" label="Agent Name" align="center" prop="vmtagentname" />

          <el-table-column show-overflow-tooltip width="200" label="Supplier Name" align="center" prop="suppliername" />

          <el-table-column show-overflow-tooltip width="200" label="Sequence Number" align="center" prop="seqno" />

          <el-table-column show-overflow-tooltip width="120" label="POL" align="center" prop="pol" />

          <el-table-column show-overflow-tooltip width="120" label="Discharge POd" align="center" prop="dispod" />

          <el-table-column show-overflow-tooltip width="120" label="Destination pod" align="center" prop="despod" />

          <el-table-column show-overflow-tooltip width="120" label="Fob Week OWIm" align="center" prop="fobweekowim" />

          <el-table-column show-overflow-tooltip width="120" label="Booked ETD" align="center" prop="etddate" />

          <el-table-column show-overflow-tooltip width="150" label="Booked ETD Week" align="center" prop="etdweek" />

          <el-table-column show-overflow-tooltip width="120" label="Carrier Name" align="center" prop="carriername" />

          <el-table-column show-overflow-tooltip width="120" label="QC/SR Release" align="center" prop="qcsrrelease" />

          <el-table-column show-overflow-tooltip width="120" label="20'GP" align="center" prop="ctn20gp" />

          <el-table-column show-overflow-tooltip width="120" label="40'GP" align="center" prop="ctn40gp" />

          <el-table-column show-overflow-tooltip width="120" label="40'HQ" align="center" prop="ctn40hq" />

          <el-table-column show-overflow-tooltip width="120" label="40'NOR" align="center" prop="ctn40nor" />

          <el-table-column show-overflow-tooltip width="120" label="40'HQ RF" align="center" prop="ctn40hqrf" />

          <el-table-column show-overflow-tooltip width="120" label="45'HQ" align="center" prop="ctn45hq" />

          <el-table-column show-overflow-tooltip width="120" label="Total TEU" align="center" prop="totteu" />

          <el-table-column show-overflow-tooltip width="120" label="CRD Date" align="center" prop="crddate" />

          <el-table-column show-overflow-tooltip width="120" label="CRD Change" align="center" prop="crdchange" />

          <el-table-column show-overflow-tooltip width="120" :label="$constants.MBL_NUMBER" align="center" prop="mblno" />

          <el-table-column show-overflow-tooltip width="120" label="Booking No" align="center" prop="bookno" />

          <el-table-column show-overflow-tooltip width="120" label="Total CBM" align="center" prop="totcbm" />

          <el-table-column show-overflow-tooltip width="120" label="Carrier Service" align="center" prop="carrierservice" />

          <el-table-column show-overflow-tooltip width="150" label="Contract No" align="center" prop="servicecontractno" />

          <el-table-column show-overflow-tooltip width="120" label="Contract Note" align="center" prop="contractnote" />

          <el-table-column show-overflow-tooltip width="180" label="First Vessel" align="center" prop="vessel1" />

          <el-table-column show-overflow-tooltip width="120" label="First Voyage" align="center" prop="voyage1" />

          <el-table-column show-overflow-tooltip width="120" label="First POL" align="center" prop="pol1" />

          <el-table-column show-overflow-tooltip width="120" label="First POD" align="center" prop="pod1" />

          <el-table-column show-overflow-tooltip width="120" label="First ETD" align="center" prop="etd1" />

          <el-table-column show-overflow-tooltip width="120" label="First ETA" align="center" prop="eta1" />

          <el-table-column show-overflow-tooltip width="120" label="Second Vessel" align="center" prop="vessel2" />

          <el-table-column show-overflow-tooltip width="120" label="Second Voyage" align="center" prop="voyage2" />

          <el-table-column show-overflow-tooltip width="120" label="Second POL" align="center" prop="pol2" />

          <el-table-column show-overflow-tooltip width="120" label="Second POD" align="center" prop="pod2" />

          <el-table-column show-overflow-tooltip width="120" label="Second ETD" align="center" prop="etd2" />

          <el-table-column show-overflow-tooltip width="120" label="Second ETA" align="center" prop="eta2" />

          <el-table-column show-overflow-tooltip width="120" label="Third Vessel" align="center" prop="vessel3" />

          <el-table-column show-overflow-tooltip width="120" label="Third Voyage" align="center" prop="voyage3" />

          <el-table-column show-overflow-tooltip width="120" label="Third POL" align="center" prop="pol3" />

          <el-table-column show-overflow-tooltip width="120" label="Third POD" align="center" prop="pod3" />

          <el-table-column show-overflow-tooltip width="120" label="Third ETD" align="center" prop="etd3" />

          <el-table-column show-overflow-tooltip width="120" label="Third ETA" align="center" prop="eta3" />

          <el-table-column show-overflow-tooltip width="120" label="Booking Date" align="center" prop="bookdate" />

          <el-table-column show-overflow-tooltip width="120" label="Book Status" align="center" prop="bookstatus" />

          <el-table-column show-overflow-tooltip  width="150" label="Cancel Category" align="center" prop="cancelcategory" />

          <el-table-column show-overflow-tooltip  width="160" label="Cancel Reason" align="center" prop="canceldetailreason" />

          <el-table-column show-overflow-tooltip  width="120" label="Cancel RefNo" align="center" prop="cancelreason" />

          <el-table-column show-overflow-tooltip width="120" label="So Release" align="center" prop="sorelease" />

          <el-table-column show-overflow-tooltip width="120" label="CTN Pickup Date" align="center" prop="ctnpickupdate" />

          <el-table-column show-overflow-tooltip width="120" label="SI Cut Off Date" align="center" prop="sicutoffdate" />


          <el-table-column show-overflow-tooltip width="120" label="ATD" align="center" prop="atddate" />

          <el-table-column show-overflow-tooltip width="120" label="Shipping Status" align="center" prop="shippingstatus" />

          <el-table-column show-overflow-tooltip width="150" label="Special Allocation" align="center" prop="specialalloc" />

          <el-table-column show-overflow-tooltip width="120" label="RefNo" align="center" prop="remark" />
          <el-table-column show-overflow-tooltip width="120" label="Activate Reason" align="center" prop="reactvtreason" />
          <el-table-column show-overflow-tooltip width="120" label="Created By" align="center" prop="createdby" />

          <el-table-column show-overflow-tooltip width="120" label="Updated By" align="center" prop="lastupdatedby" />

          <el-table-column label="Created Date" align="center" prop="createdstamp" width="180">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.createdstamp) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Updated Date" align="center" prop="lastupdatedstamp" width="180">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.lastupdatedstamp) }}</span>
            </template>
          </el-table-column>

        </el-table>
        <!-- 分页组件 -->
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
          @pagination="getHistoricalList" />

        <!-- 对话框(上传/下载模板) -->
        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body  @close="cancelClick">
          <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :on-change="beforeUpload"
            :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
            :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              {{ $t("purchaseOrder.DragTheFileHereOr")
              }}<em>{{ $t("purchaseOrder.clickUpload") }}</em>
            </div>
            <div class="el-upload__tip text-center" slot="tip">
              <!-- <div class="el-upload__tip" slot="tip">
      <el-checkbox v-model="upload.updateSupport" />
      {{ $t("purchaseOrder.whetherToUpdateExistingData") }}
    </div> -->
              <span>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</span>
              <!-- <el-link
      type="primary"
      :underline="false"
      style="font-size: 12px; vertical-align: baseline"
      @click="importTemplate"
      >{{ $t("purchaseOrder.downloadingTheTemplate") }}</el-link
    > -->
            </div>
          </el-upload>
          <div slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="submitFileForm" :disabled="butLoading" >{{
              $t("purchaseOrder.confirm")
            }}</el-button>
            <el-button size="mini" @click="cancelClick">{{
              $t("purchaseOrder.cancel")
            }}</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="Upload Error" :visible.sync="showError" width="700px" append-to-body>
      <el-table  :data="errorList"   >
        <el-table-column show-overflow-tooltip width="120" label="Sheet Name" align="center" prop="sheet_name"   />
        <el-table-column show-overflow-tooltip width="120" label="Column Index" align="center" prop="no_s"   />
        <el-table-column show-overflow-tooltip width="150" label="Lot Number" align="center" prop="lotNo"   />
        <el-table-column show-overflow-tooltip   label="Column Name" align="center" prop="name"   />
        <el-table-column show-overflow-tooltip  label="Column Value" align="center" prop="value" class-name="error-row-css"   />
      </el-table>
    </el-dialog>
  </div>
</template>
<style>
.error-row-css {
  background: rgb(253, 226, 226);
}
</style>

<script>
import { getDataPage, reviewDataPage, historicalDataPage } from "@/api/efl/book";
import { getBaseHeader } from "@/utils/request";
import XLSX from "xlsx";
import moment from "moment";
export default {
  name: "UnitConversion",
  components: {},
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
      // 单位转换列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        lotNo: null,
      },
      // 表单参数
      form: {},
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/admin-api/efl/book/import",
      },
      productList: [],
      productMap: {},
      activeName: 'first',
      selHotPO: [
        {key: 'Yes', value: 1},
        {key: 'No', value: 0}  ],
      selVddl: [{key: 'Yes', value: 1}],
      showError:false,
      errorList:[],
      butLoading:false
    };
  },
  created() {
    this.getList();
  },
  methods: {

    cancelClick(){
      this.upload.open = false
      this.butLoading = false
       this.$refs.upload.clearFiles();
       this.errorList = []
    },
    handleClick(event) {
      if (event.name === "first") {
        this.queryParams.pageNo = 1;
        this.queryParams.lotNo = ''
        this.getList();
      } else if (event.name === "second") {
        this.queryParams.pageNo = 1;
        this.queryParams.lotNo = ''
        this.getReviewList();
      } else if (event.name === "third") {
        this.queryParams.pageNo = 1;
        this.queryParams.lotNo = ''
        this.getHistoricalList();
      }
    },
    formatTime(row, column) {
      // 使用 Moment.js 或其他时间处理库对时间进行格式化
      return moment(row.validFrom).format('YYYY-MM-DD');
    },
    formatTimeTo(row, column) {
      // 使用 Moment.js 或其他时间处理库对时间进行格式化
      return moment(row.validTo).format('YYYY-MM-DD');
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 执行查询
      getDataPage(this.queryParams).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    getReviewList() {
      this.loading = true;
      // 执行查询
      reviewDataPage(this.queryParams).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    getHistoricalList() {
      this.loading = true;
      // 执行查询
      historicalDataPage(this.queryParams).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    getUrlParam: function getURLParameter(name, urlsearch) {
      return (
        decodeURIComponent(
          (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
            urlsearch || location.search
          ) || [, ""])[1].replace(/\+/g, "%20")
        ) || null
      );
    },

    /** 表单重置 */
    reset() {
      this.form = {
        lotNo: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.searchList();
    },
    searchList() {
      if (this.activeName === "first") {
        this.getList();
      } else if (this.activeName === "second") {
        this.getReviewList();
      } else if (this.activeName === "third") {
        this.getHistoricalList();
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.lotNo = ''
      this.handleQuery();
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "Import";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importCraTemplate().then((response) => {
        this.$download.excel(response, "CRA_temp.xlsx");
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      if (response.code !== 0) {
        this.$modal.msgError(response.msg);
        return;
      }
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
        this.$refs.upload.submit();
    },
    // 上传预处理
    beforeUpload(file) {
      this.butLoading = true
      this.errorList = []
      this.file2Xce(file).then(tabJson => {

        for(var i=0;i<tabJson.length;i++){
          var sheetData = tabJson[i].sheet
          var listTable = []
          //get key
          var headIndex = -1
          var keyList = [];
          for(var j=0; j < sheetData.length; j++){
              if(sheetData[j][0] == ("VMT'S AGENT NAME")){
                headIndex = j
                break
              }
          }
          if(headIndex != -1){
            keyList = Object.values(sheetData[headIndex])

            if(tabJson[i].sheetName == 'Booked_POs'){
              for(var j=headIndex+1; j < sheetData.length; j++){
                  var lotNo = sheetData[j][keyList.indexOf('DB LOT #')]
                  if(sheetData[j][keyList.indexOf('S/O RELEASED?')] ){
                      var aa = moment(sheetData[j][keyList.indexOf('S/O RELEASED?')], 'YYYY-MM-DD', true).toDate()
                      if(!moment(aa).isValid()){
                        this.errorList.push({sheet_name: 'Booked_POs', no_s: j+1, lotNo: lotNo,
                        name: 'S/O RELEASED?', value: sheetData[j][keyList.indexOf('S/O RELEASED?')]})
                      }
                  }
              }
            }else if(tabJson[i].sheetName == 'Onboard'){
              for(var j=headIndex+1; j < sheetData.length; j++){
                  var lotNo = sheetData[j][keyList.indexOf('DB LOT #')]
                  if(sheetData[j][keyList.indexOf('S/O RELEASED?')] ){
                      var aa = moment(sheetData[j][keyList.indexOf('S/O RELEASED?')], 'YYYY-MM-DD', true).toDate()
                      if(!moment(aa).isValid()){
                        this.errorList.push({sheet_name: 'Onboard', no_s: j+1, lotNo: lotNo,
                        name: 'S/O RELEASED?', value: sheetData[j][keyList.indexOf('S/O RELEASED?')]})
                      }
                  }
              }

            }else if(tabJson[i].sheetName == 'Booking not used'){
              for(var j=headIndex+1; j < sheetData.length; j++){

                  var lotNo = sheetData[j][keyList.indexOf('DB LOT #')]
                  if(sheetData[j][keyList.indexOf('S/O RELEASED?')] ){
                      var aa = moment(sheetData[j][keyList.indexOf('S/O RELEASED?')], 'YYYY-MM-DD', true).toDate()
                      if(!moment(aa).isValid()){
                        this.errorList.push({sheet_name: 'Onboard', no_s: j+1, lotNo: lotNo,
                        name: 'S/O RELEASED?', value: sheetData[j][keyList.indexOf('S/O RELEASED?')]})
                      }
                  }
              }
            }

          }
        }

        if(this.errorList.length>0){
          this.showError = true
        }else{
          this.showError = false
          this.butLoading = false
        }

      });


    },
    file2Xce(file) {
      var vm = this
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          const data = e.target.result;
          this.wb = XLSX.read(data, {
            type: 'binary'
          });

          const result = [];
          this.wb.SheetNames.forEach((sheetName) => {
            const sheetData = XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName], { header: 1 });
            const formattedSheetData = sheetData.map(row => {
              return row.map(cell => {
                // Check if the cell is a date (you may need to adjust this based on your date columns)
                if (!isNaN(cell) && XLSX.SSF.parse_date_code(cell)) {
                    const dateObj = moment(XLSX.SSF.parse_date_code(cell)).toDate();
                    // Check if the date is valid
                    if (vm.isValidDate(dateObj)) {
                      return dateObj;
                    } else {
                      return cell;
                    }
                } else {
                  return cell;
                }
              });
            });

            result.push({
              sheetName: sheetName,
              sheet: formattedSheetData
            });
          });

          resolve(result);
        };

        reader.readAsBinaryString(file.raw);
      });
    },

    isValidDate(date) {
      return date instanceof Date && !isNaN(date);
    },

  },
};
</script>
