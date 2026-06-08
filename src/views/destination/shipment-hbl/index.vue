<template>
  <div class="app-container">
    <div class="card-box-container-dest-01">
      <!-- <el-card style="display: flex; flex-shrink: 0; justify-content: center;align-items: center;"
        :body-style="{ padding: '8px' }">
        <div @click="downloadOrderData">
          <icon-park type="inbox-download-r" theme="filled" size="60" fill="#004F7C" strokeLinejoin="miter"
            strokeLinecap="square" />
        </div>
      </el-card> -->

    <el-card style="display: flex; flex-shrink: 0; justify-content: center; align-items: center;"
        :body-style="{ padding: '8px' }">
        <!-- 导出中：进度条 -->
        <div v-if="hblExportLoading" style="width: 120px; text-align: center;">
          <el-progress :text-inside="true" :stroke-width="22" :percentage="hblPercentage" :status="hblProgressStatus"
            text-color="white" />
          <div style="margin-top: 4px; font-size: 12px; color: #606266;">{{ hblProgressTip }}</div>
        </div>

        <!-- 空闲：图标 -->
        <div v-else @click="handleHblExport" style="cursor: pointer;">
          <icon-park type="inbox-download-r" theme="filled" size="60" fill="#004F7C" strokeLinejoin="miter"
            strokeLinecap="square" />
        </div>
      </el-card>
      <el-card style="display: flex; flex-shrink: 0; justify-content: center;align-items: center; margin-left: 8px"
        :body-style="{ padding: '8px' }">
        <!-- 左侧图标 -->
        <div
          style="float: left; margin-top: 10px; height: 100%; display: flex; align-items: center; border-right: 1px solid #ddd; padding-right: 5px;">
          <icon-park type="order" theme="filled" size="60" fill="#fe5000" strokeLinejoin="miter" strokeLinecap="square"
            style="cursor: default;" />
        </div>
        <!-- 右侧文字 -->
        <div @click="handReportChange(null)" class="clickable-area"
          style="border-radius: 10px; float: left; margin-left: 20px; line-height: 24px; height: 100%; display: flex; flex-direction: column; justify-content: center;">
          <p style="color: #303133; font-size: 16px; font-weight: bold; margin-top: 10px;">Total HBL</p>
          <p class="count-class" style="margin: 4px 0 0; margin-top: 20px; text-align: center">{{
            hblOverviewStatus.hblCount }}</p>
        </div>
      </el-card>
      <el-card style="display: flex; flex-shrink: 0; justify-content: center;align-items: center; margin-left: 8px"
        :body-style="{ padding: '8px' }" v-hasPermi="['pepco:destination-hbl:documents-verified:view']">
        <div
          style="background-color: #f5f7fa; padding: 10px 20px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06); text-align: center;">
          <p style="color: #303133; font-size: 16px; font-weight: bold; margin: 0;">Verify Documents</p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap;">
          <!-- Possible -->
          <div
            :class="{ 'activePort': mainTableQueryParams.documentVerified === false && mainTableQueryParams.taskType === 'possible' }"
            @click="handReportChange(1, 'possible')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ hblOverviewStatus.verifyDocumentPossibleCount }}</p>
            <p style="color: #000">Possible</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Urgent -->
          <div
            :class="{ 'activePort': mainTableQueryParams.documentVerified === false && mainTableQueryParams.taskType === 'urgent' }"
            @click="handReportChange(1, 'urgent')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ hblOverviewStatus.verifyDocumentUrgentCount }}</p>
            <p style="color: #000">Urgent</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Overdue -->
          <div
            :class="{ 'activePort': mainTableQueryParams.documentVerified === false && mainTableQueryParams.taskType === 'overdue' }"
            @click="handReportChange(1, 'overdue')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ hblOverviewStatus.verifyDocumentOverdueCount }}</p>
            <p style="color: #000">Overdue</p>
          </div>
          <div style="width: 1px; height: 40px; background-color: #ccc;"></div>
          <!-- Finished -->
          <div :class="{ 'activePort': mainTableQueryParams.documentVerified === true }"
            @click="handReportChange(2, 'finished')" class="clickable-area" style="padding: 0 10px; cursor: pointer;">
            <p class="count-class">{{ hblOverviewStatus.verifyDocumentDoneCount }}</p>
            <p style="color: #000">Finished</p>
          </div>
        </div>
      </el-card>
    </div>
    <el-card class="pd-20">
      <!-- 搜索工作栏 -->
      <div style="display: flex; width: 100%; overflow-x: auto" class="box-scroller">
        <el-form :model="mainTableQueryParams" ref="queryForm" size="small" :inline="true" v-show="showMainTableSearch"
          label-width="68px" style="display: flex">
          <div style="display: flex; flex-shrink: 0">
            <div style="margin-left: 8px; margin-bottom: 6px">
              <el-input style="width: 166px" v-model="mainTableQueryParams.hblNumber" placeholder="HBL Number" clearable
                @keyup.enter.native="handleQuery" @input="(value) => mainTableQueryParams.hblNumber = value.trim()" @clear="handleQuery" />
            </div>
            <div style="margin-left: 8px">
              <el-input style="width: 166px" v-model="mainTableQueryParams.mblNumber" :placeholder="$constants.MBL_NUMBER" clearable
                @keyup.enter.native="handleQuery" @input="(value) => mainTableQueryParams.mblNumber = value.trim()" />
            </div>
            <div style="margin-left: 8px">
              <el-select style="width: 166px" @change="handleQuery" clearable v-model="mainTableQueryParams.pendingTaskCode"
                placeholder="Pending Task" filterable>
                <el-option v-for="item in pendingTaskList" :key="item.taskCode" :label="item.taskName"
                  :value="item.taskCode"></el-option>
              </el-select>
            </div>
            <div style="display: flex; margin-left: 8px; margin-bottom: 6px">
              <el-popover v-model="filterPopover" placement="bottom" title=" " width="1000" popper-class="popover-filter" trigger="click">
                <el-form>
                  <el-row :gutter="24" style="margin-bottom: 15px;">
                    <el-col :span="6">
                      <el-select clearable v-model="mainTableQueryParams.pol" placeholder="POL" filterable>
                        <el-option v-for="item in mainTableQueryFilerList.polList" :key="item" :label="item"
                          :value="item"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select clearable v-model="mainTableQueryParams.pod" multiple placeholder="POD" filterable>
                        <el-option v-for="item in mainTableQueryFilerList.podList" :key="item" :label="item"
                          :value="item"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-input v-model="mainTableQueryParams.po" placeholder="PO" clearable
                        @keyup.enter.native="handleQuery" @input="(value) => mainTableQueryParams.po = value.trim()" />
                    </el-col>
                    <el-col :span="6">
                      <el-input v-model="mainTableQueryParams.containerNo" placeholder="Container Number" clearable
                        @keyup.enter.native="handleQuery"
                        @input="(value) => mainTableQueryParams.containerNo = value.trim()" />
                    </el-col>
                  </el-row>
                  <el-row :gutter="24" style="margin-bottom: 15px;">
                    <el-col :span="6">
                      <el-select clearable v-model="mainTableQueryParams.supplierCode" placeholder="Supplier Name"
                        filterable>
                        <el-option v-for="item in mainTableQueryFilerList.supplierList" :key="item.id"
                          :label="item.name" :value="item.supplierCode"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select clearable v-model="mainTableQueryParams.dc" multiple placeholder="DC" filterable>
                        <el-option v-for="item in mainTableQueryFilerList.dcList" :key="item.dcCode"
                          :label="item.dcCode + ' - ' + item.dcName" :value="item.dcCode"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select clearable v-model="mainTableQueryParams.sanitaryRisk" placeholder="Sanitary Risk"
                        filterable>
                        <el-option label="Yes" value="true"></el-option>
                        <el-option label="No" value="false"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select clearable v-model="mainTableQueryParams.sanitary" placeholder="Sanitary Required"
                        filterable>
                        <el-option label="Yes" value="true"></el-option>
                        <el-option label="No" value="false"></el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24" style="margin-bottom: 15px;">
                    <el-col :span="12">
                      <el-date-picker v-model="mainTableQueryParams.etaDateRange" clearable type="daterange"
                        range-separator="-" start-placeholder="ETA From" end-placeholder="ETA To"
                        value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-col>
                    <el-col :span="6">
                      <el-select v-model="mainTableQueryParams.brokerDeptName" placeholder="Broker" filterable
                        reserve-keyword clearable>
                        <el-option v-for="item in mainTableQueryFilerList.brokerList" :key="item" :label="item"
                          :value="item"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select clearable v-model="mainTableQueryParams.assigned" placeholder="Broker assignment"
                        filterable>
                        <el-option label="Yes" value="1"></el-option>
                        <el-option label="No" value="0"></el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10" style="margin-bottom: 15px;">
                    <el-col :span="6">
                      <el-select v-model="mainTableQueryParams.vessel" placeholder="Vessel" multiple filterable
                        reserve-keyword clearable>
                        <el-option v-for="item in mainTableQueryFilerList.vesselList" :key="item" :label="item"
                          :value="item"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select v-model="mainTableQueryParams.voyage" placeholder="Voyage" filterable reserve-keyword
                        clearable>
                        <el-option v-for="item in mainTableQueryFilerList.voyageList" :key="item" :label="item"
                          :value="item"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select clearable v-model="mainTableQueryParams.invoiced" placeholder="Invoice to Customs"
                        filterable>
                        <el-option label="C" value="1"></el-option>
                        <el-option label="I" value="2"></el-option>
                        <el-option label="N" value="0"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select clearable v-model="mainTableQueryParams.finished" placeholder="Customs Clearance"
                        filterable>
                        <el-option label="Yes" value="1"></el-option>
                        <el-option label="No" value="0"></el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10" style="margin-bottom: 15px;">
                    <el-col :span="6">
                      <el-input v-model="mainTableQueryParams.lp" clearable placeholder="LP" />
                    </el-col>
                    <el-col :span="6">
                      <el-select clearable v-model="mainTableQueryParams.country" placeholder="Country of Origin"
                        filterable>
                        <el-option v-for="item in mainTableQueryFilerList.countryList" :key="item" :label="item"
                          :value="item"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select clearable v-model="mainTableQueryParams.verified" placeholder="Doc Verify" filterable>
                        <el-option label="N" value="0"></el-option>
                        <el-option label="C" value="1"></el-option>
                        <el-option label="I" value="2"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-input clearable v-model="mainTableQueryParams.commercialInvoiceNumber"
                        placeholder="Commercial Invoice Number" filterable>
                      </el-input>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10" style="margin-bottom: 15px;">
                    <el-col :span="6">
                      <el-select clearable v-model="mainTableQueryParams.carrier" placeholder="Carrier" filterable>
                        <el-option v-for="item in mainTableQueryFilerList.carrierList" :key="item" :label="item"
                          :value="item"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select clearable v-model="mainTableQueryParams.hblType" placeholder="HBL Type" filterable>
                        <el-option v-for="item in mainTableQueryFilerList.hblTypeList" :key="item" :label="item"
                          :value="item"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-input clearable v-model="mainTableQueryParams.itemNumber" placeholder="Item Number"
                        filterable>
                      </el-input>
                    </el-col>
                    <el-col :span="6">
                      <el-select style="min-width: 146px" v-model="mainTableQueryParams.soType"
                        placeholder="SO Type" clearable>
                        <el-option label="FCL" value="FCL"></el-option>
                        <el-option label="LCL" value="LCL"></el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10" style="margin-bottom: 15px;"></el-row>
                  <div style="display: flex;justify-content: flex-end;">
              <!-- <el-button  @click="handleQuery" type="primary">
                 <i class="el-icon-search el-icon--right"></i>
                Search
              </el-button> -->
            </div>
                </el-form>
                <el-button slot="reference" icon="el-icon-plus" plain
                  :style="{ color: hasFilter ? '#004F7C' : '' }">Filter</el-button>
              </el-popover>
              <el-button style="margin-left: 5px" @click="clearFilters" plain>Clear Filters</el-button>
            </div>
            <div style="margin-left: 8px;">
              <el-button @click="handleQuery" type="primary">
                <i class="el-icon-search el-icon--right"></i>
                Search
              </el-button>
            </div>
          </div>
          <div style="margin-left: 8px; flex-shrink: 0">
            <el-button v-hasPermi="['pepco:destination-hbl:document-verify:edit']" type="primary"
              @click="verifyShipping('Document Verification Complete')" icon="el-icon-s-order" plain>Verify
              Documents</el-button>
          </div>
          <div style="margin-left: 8px; flex-shrink: 0">
            <el-button v-hasPermi="['pepco:destination-hbl:broker-assign:edit']" type="primary"
              @click="assignBroker('Customs_Broker_Assigned')" icon="el-icon-s-order" plain>Broker Assign</el-button>
          </div>
          <div style="margin-left: 8px; flex-shrink: 0">
            <el-button v-hasPermi="['pepco:destination-hbl:data-fix:edit']" type="primary" @click="openDataFixDialog"
              icon="el-icon-s-order" plain>Data Fix</el-button>
          </div>
        </el-form>
      </div>
      <!-- 列表 -->
      <el-table border :row-class-name="tableRowClassName" :height="tableHeight" v-loading="loading"
        :data="mainTableDataList" @select="handleSelection" @selection-change="handleSelectionChange"
        @sort-change="handleSortChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="expand">
          <template #default="props">
            <hbl-expand-detail :ref="`hblExpandDetailRef${props.row.id}`" :hblRowData="props.row"></hbl-expand-detail>
          </template>
        </el-table-column>
        <el-table-column label="LP" align="center" prop="lp" min-width="120px" sortable="custom" />
        <el-table-column :label="$constants.MBL_NUMBER" align="center" prop="mblNumber" min-width="125px" sortable="custom" />
        <el-table-column label="HBL Number" align="center" prop="hblNumber" min-width="120px" sortable="custom">
          <template slot-scope="scope">
            <span style="color:#000;font-weight: 900; text-align: center;">{{ scope.row.hblNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Set Number" align="center" prop="setNew" min-width="120px" sortable="custom" />
        <el-table-column label="Supplier Name" sortable="custom" align="center" min-width="120" prop="supplierCode"
          show-overflow-tooltip>
          <template v-slot="scope">
            <bsc-supplier-text :supplierId="scope.row.supplierId" />
          </template>
        </el-table-column>
        <el-table-column prop="brokerDeptName" label="Broker" align="center" min-width="150" sortable="custom">
          <template v-slot="scope">
            <span>{{ formatBrokerNames(scope.row.brokerDeptName) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Carrier" align="center" prop="carrier" min-width="80px" sortable="custom">
          <template slot-scope="scope">{{ scope.row.carrier }}</template>
        </el-table-column>
        <el-table-column label="Contract Type" align="center" prop="contractType" min-width="120px" sortable="custom">
          <template slot-scope="scope">{{ scope.row.contractType }}</template>
        </el-table-column>
        <!-- <el-table-column label="Freight Type" align="center" prop="freightType" min-width="100px" sortable="custom" /> -->
        <el-table-column label="So Type" align="center" prop="soType" min-width="100px" sortable="custom" />
        <el-table-column label="Containers/HBL" align="center" prop="containerNo" min-width="150px" sortable="custom">
          <template slot-scope="scope">
            <!-- <div style="white-space: pre-line; text-align: center;">{{ formatContainerNo(scope.row.containerNo) }}</div> -->
            <div style="white-space: pre-line; text-align: center;">{{ scope.row.containerNo }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Containers/LP" align="center" prop="containerNoLp" min-width="150px" sortable="custom">
          <template slot-scope="scope">
            <!-- <div style="white-space: pre-line; text-align: center;">{{ formatContainerNo(scope.row.containerNo) }}</div> -->
            <div style="white-space: pre-line; text-align: center;">{{ scope.row.containerNoLp }}</div>
          </template>
        </el-table-column>
        <el-table-column label="MBL Type" align="center" prop="mblType" min-width="120px" sortable="custom" />
        <el-table-column label="HBL Type" align="center" prop="blType" min-width="120px" sortable="custom" />
        <el-table-column label="Departing Vessel" sortable="custom" align="center" min-width="180" prop="vessel">
          <template v-slot="scope">
            <span>{{ scope.row.vessel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Arrival Vessel" sortable="custom" align="center" min-width="180" prop="podVessel">
          <template v-slot="scope">
            <span>{{ scope.row.podVessel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="POL" sortable="custom" align="center" min-width="70" prop="pol">
          <template v-slot="scope">
            <span>{{ scope.row.pol }}</span>
          </template>
        </el-table-column>
        <el-table-column label="POD" sortable="custom" align="center" min-width="70" prop="pod">
          <template v-slot="scope">
            <span>{{ scope.row.pod }}</span>
          </template>
        </el-table-column>
        <el-table-column label="DC" sortable="custom" align="center" min-width="160" prop="dc">
          <template v-slot="scope">
            <span>{{ getDcName(scope.row.dc) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="ETD" sortable="custom" min-width="100" prop="etd">
          <template v-slot="scope">{{ parseUTCTime(scope.row.etd) }}</template>
        </el-table-column>
        <el-table-column align="center" label="ETA" sortable="custom" min-width="110" prop="eta">
          <template v-slot="scope">
            {{ parseUTCTime(scope.row.eta) }}
            <i v-if="scope.row.eta" v-hasPermi="['pepco:destination-hbl:eta:edit']"
              @click="openUpdateShipmentTimeDialog(scope.row, 'ETA')" style="cursor: pointer;" class="el-icon-edit"></i>
          </template>
        </el-table-column>
        <el-table-column align="center" label="ATD" sortable="custom" min-width="100" prop="atd">
          <template v-slot="scope">{{ parseUTCTime(scope.row.atd) }}</template>
        </el-table-column>
        <el-table-column align="center" label="ATA" sortable="custom" min-width="110" prop="ata">
          <template v-slot="scope">
            {{ parseUTCTime(scope.row.ata) }}
            <i v-if="scope.row.ata" v-hasPermi="['pepco:destination-hbl:ata:edit']"
              @click="openUpdateShipmentTimeDialog(scope.row, 'ATA')" style="cursor: pointer;" class="el-icon-edit"></i>
          </template>
        </el-table-column>
        <el-table-column label="Doc Verify" align="center" min-width="120" prop="verified" sortable="custom">
          <template v-slot="scope">
            <span :style="{ color: scope.row.verified !== 0 ? '#67C23A' : '' }">
              {{
                scope.row.verified === 1 ? 'C' : scope.row.verified === 2 ? 'I' : 'N'
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Broker assignment" align="center" min-width="130" prop="assigned" sortable="custom">
          <template v-slot="scope">
            <span :style="{ color: scope.row.assigned === 1 ? '#67C23A' : '' }">
              {{
                scope.row.assigned === 1 ? 'Y' : 'N'
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Invoice to Customs" align="center" min-width="140" prop="invoiced" sortable="custom">
          <template v-slot="scope">
            <span v-if="scope.row.invoiced === 1" style="color: #67C23A;">
              C
            </span>
            <span v-else-if="scope.row.invoiced === 2" style="color: #E6A23C;">
              I
            </span>
            <span v-else style="color: #909399;">
              N
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Customs Clearance" align="center" min-width="140" prop="finished" sortable="custom">
          <template v-slot="scope">
            <span :style="{ color: scope.row.finished === 1 ? '#67C23A' : '' }">
              {{
                scope.row.finished === 1 ? 'Y' : 'N'
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Sanitary Risk" sortable="custom" align="center" min-width="150" prop="sanitaryRisk">
          <template v-slot="scope">
            <span v-if="scope.row.sanitaryRisk" style="color: #67C23A;">{{ 'Y' }}</span>
            <span v-else style="color: #909399;">{{ 'N' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Sanitary Required" sortable="custom" align="center" min-width="150" prop="sanitary">
          <template v-slot="scope">
            <span v-if="scope.row.sanitary" style="color: #67C23A;">{{ 'Yes' }}</span>
            <span v-else style="color: #909399;">{{ 'No' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pagination :total="total" :page.sync="mainTableQueryParams.pageNo" :limit.sync="mainTableQueryParams.pageSize"
        @pagination="getList" :page-sizes="[20, 40, 100, 200]" />
    </el-card>

    <el-dialog v-loading="loadingSaveVerify" :title="title" width="600px" :visible.sync="verifyDialog">
      <div class="dialog-content">
        <div class="vertical-radios">
          <el-radio class="complete-radio" v-model="radio" label="1" border @input="selectRadio"
            size="medium">Complete</el-radio>
          <div @click="selectRadio('2')" class="vertical-radios">
            <el-radio class="incomplete-radio" v-model="radio" label="2" border @input="selectRadio" size="medium">Not
              Complete</el-radio>
          </div>
          <el-switch style="display: block" @change="changeSwitch" v-model="sanitaryValue" active-color="blue"
            active-text="Sanitary Certificate is required"></el-switch>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="showVerifyRevokeBtn" style="float: left" type="primary" :loading="loadingSaveVerify"
          @click="revokeVerifyDocument">Revoke</el-button>
        <el-button @click="Incomplete">Cancel</el-button>
        <el-button type="primary" :loading="loadingSaveVerify" @click="Complete">Submit</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="reasonTitle" width="600px" :visible.sync="reasonDialog">
      <el-form :model="form" size="mini" ref="reasonDialogForm">
        <el-form-item prop="reason" v-if="!finishRadioValue" :label="reasonTitle" align="center" label-width="200px">
          <el-select v-model="form.reason" placeholder="Please select reason" style="width: 100%" clearable>
            <el-option v-for="(value, key) in docReasonMap" :key="key" :label="`${key} - ${value}`" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item prop="remark" v-if="!finishRadioValue" label="Remark" align="center" label-width="200px">
          <el-input placeholder="Remark" type="textarea" show-word-limit maxlength="200" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reasonDialog = false">Cancel</el-button>
        <el-button v-if="type === 'Document_Verification_Complete_Hbl'" type="primary" :loading="loadingSaveBut"
          @click="submitDouumentReason">Submit</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" width="600px" :visible.sync="assignBrokerformDialogVisible">
      <el-form :model="brokerForm" size="mini">
        <el-form-item required v-if="type === 'Customs_Broker_Assigned'" label="Customer Brokers" label-width="180px">
          <el-select v-model="brokerForm.brokerDeptId" @change="handleBrokerChange">
            <el-option v-for="option in brokerList" :key="option.id" :label="option.name" :value="option.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="float: left" v-if="type === 'Customs_Broker_Assigned'" type="primary"
          :loading="loadingSaveBut" @click="revokeBroker">Revoke</el-button>
        <el-button @click="assignBrokerformDialogVisible = false">Cancel</el-button>
        <el-button v-if="type === 'Customs_Broker_Assigned'" type="primary" :loading="loadingSaveBut"
          @click="submitBroker2(10)">Submit</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" accept=".xlsx, .xls, .xml" :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport" :data="{ type: upload.type }"
        :disabled="upload.isUploading" v-loading="upload.isUploading" :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess" :on-error="handleFileError" :auto-upload="false" drag multiple
        :timeout="3000000">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          {{ $t("purchaseOrder.DragTheFileHereOr") }}
          <em>{{ $t("purchaseOrder.clickUpload") }}</em>
        </div>
        <div class="el-upload__tip text-center" slot="tip">
          <div>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</div>
          <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline"
            @click="downloadTemplateData(upload.type)">{{ $t("purchaseOrder.downloadingTheTemplate") }}</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <span>
          <el-button size="mini" type="primary" :disabled="upload.isUploading" @click="submitFileForm">
            {{
              $t("purchaseOrder.confirm")
            }}
          </el-button>
        </span>
        <el-button size="mini" @click="upload.open = false">
          {{
            $t("purchaseOrder.cancel")
          }}
        </el-button>
      </div>
    </el-dialog>

    <!-- Update Shipment Time Dialog -->
    <el-dialog :title="shipmentTimeForm.currHblRowData.carrierBookingNumber" width="500px"
      :visible.sync="shipmentTimeUpdateDialogVisible" append-to-body>
      <el-form :model="shipmentTimeForm" label-width="120px">
        <el-form-item :label="$constants.MBL_NUMBER">
          <el-input v-model="shipmentTimeForm.mblNumber" readonly />
        </el-form-item>
        <el-form-item v-if="shipmentTimeForm.type === 'ETA'" label="ETA">
          <el-date-picker v-model="shipmentTimeForm.eventTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
            placeholder="Select ETA" style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="shipmentTimeForm.type === 'ATA'" label="ATA">
          <el-date-picker v-model="shipmentTimeForm.eventTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
            placeholder="Select ATA" style="width: 100%">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shipmentTimeUpdateDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="updateShipmentTime">Confirm</el-button>
      </div>
    </el-dialog>
    <!-- data fix Dialog -->
    <el-dialog title="Data Fix" :visible.sync="dataFixDialogVisible" width="600px" :close-on-click-modal="false">
      <el-form ref="dataFixForm" :model="dataFixForm" :rules="dataFixRules" label-width="140px">
        <el-form-item label="LP" prop="lp">
          <el-input v-model="dataFixForm.lp" placeholder="Please enter LP"></el-input>
        </el-form-item>
        <!-- <el-form-item label="HBL Number" prop="hblNumber">
          <el-input v-model="dataFixForm.hblNumber" placeholder="Please enter HBL Number"></el-input>
        </el-form-item> -->
        <el-form-item label="Set Number" prop="setNew">
          <el-input v-model="dataFixForm.setNew" placeholder="Please enter Set Number"></el-input>
        </el-form-item>
        <!-- <el-form-item label="Containers/HBL" prop="containerNo">
          <el-input
            v-model="dataFixForm.containerNo"
            type="textarea"
            :rows="3"
            placeholder="Please enter Containers/HBL"
          ></el-input>
        </el-form-item>
        <el-form-item label="Containers/LP" prop="containerNoLp">
          <el-input
            v-model="dataFixForm.containerNoLp"
            type="textarea"
            :rows="3"
            placeholder="Please enter Containers/LP"
          ></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dataFixDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitDataFix" :loading="loadingDataFix">Submit</el-button>
      </div>
    </el-dialog>


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
import {
  containerRevokeBroker,
  containerSubmitBroker,
  destinationHblBrokerList,
  destinationHblCarrierList,
  destinationHblCountryList,
  destinationHblPodList,
  destinationHblPolList,
  destinationHblSupplierList,
  destinationHblTypeList,
  destinationHblVesselList,
  destinationHblVoyageList,
  doDataFix,
  downloadShipmentHblData,
  createHblExportTask,
  getHblExportProgress,
  getHblExportFile,
  exportContainerBroker,
  getBrokerDataList,
  getDestinationDcList,
  getDestinationHblCount,
  getDestinationHblPage,
  getDictData,
  getMilestonesEnumListByType,
  revokeHblVerify,
  updateAta,
  updateEta,
  verifyDestinationHbl,
  verifyDocumentsOverviewStatistics,
} from '@/api/destination/destination';
import { v4 as uuidv4 } from 'uuid'
import { getAccessToken, getTenantId } from '@/utils/auth'
import axios from 'axios'
import { getTaskSettingPage } from '@/api/system/taskSetting';
import { getBaseHeader } from '@/utils/request';
import { IconPark } from '@icon-park/vue/es/all';
import '@icon-park/vue/styles/index.css';
import HblExpandDetail from './detail/index.vue';
export default {
  name: 'pepco-shipped-container',
  components: {
    IconPark,
    HblExpandDetail,
  },
  mounted() {
    // 添加鼠标滚轮横向滚动功能
    const container = document.querySelector('.card-box-container-dest-01');
    if (container) {
      container.addEventListener('wheel', this.handleWheelScroll);
    }
  },

  beforeDestroy() {
    // 移除事件监听器
    const container = document.querySelector('.card-box-container-dest-01');
    if (container) {
      container.removeEventListener('wheel', this.handleWheelScroll);
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showMainTableSearch: true,
      tableHeight: 0,
      // 总条数
      total: 0,
      // container list
      mainTableDataList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {
        brokerDeptId: null
      },
      // 表单校验
      rules: {},
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        //上传弹窗
        uploadOpen: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 类型：1- pre plan 2- plan 3- arrival at dc
        type: 1,
        // 上传的地址
        url: null
      },
      // 查询参数
      mainTableQueryParams: {
        pageNo: 1,
        pageSize: 20,
        orderBy: null,
        orderDirection: null,
        taskType: null,
        taskCode: null,
        documentVerified: null,
        source: null,
        hblNumber: null,
        mblNumber: null,
        containerNo: null,
        supplierCode: null,
        dc: null,
        pol: null,
        pod: null,
        etaDateRange: [],
        vessel: null,
        voyage: null,
        country: null,
        mpNumber: null,
        sanitaryRisk: null,
        sanitary: null,
        carrier: null,
        lp: null,
        brokerDeptName: null,
        assigned: null,
        invoiced: null,
        finished: null,
        hblType: null,
        po: null,
        commercialInvoiceNumber: null,
        itemNumber: null,
        freightType: null,
        soType: null
      },
      mainTableQueryFilerList: {
        dcList: [],
        polList: [],
        podList: [],
        vesselList: [],
        voyageList: [],
        brokerList: [],
        supplierList: [],
        countryList: [],
        carrierList: [],
        hblTypeList: [],
      },
      dcList: [],
      verifyDisable: false,
      selectIds: [],
      selectedRows: [],
      pendingTaskList: [],
      filterPopover: false,
      hblOverviewStatus: {
        hblCount: 0,
        verifyDocumentPossibleCount: 0,
        verifyDocumentUrgentCount: 0,
        verifyDocumentOverdueCount: 0,
        verifyDocumentDoneCount: 0
      },
      showVerifyRevokeBtn: false,
      loadingSaveVerify: false,
      sanitaryValue: false,
      verifyDialog: false,
      radio: '',
      reasonDialog: false,
      reasonTitle: '',
      finishRadioValue: false,
      type: '',
      loadingSaveBut: false,
      formData: '',
      taskCode: '',
      downloadOrderLoading: false,
      brokerForm: {},
      brokerSelectedRows: [],
      assignBrokerformDialogVisible: false,
      brokerList: [],
      // 增加修改shipment time的基础数据
      shipmentTimeUpdateDialogVisible: false,
      shipmentTimeForm: {
        currHblRowData: {},
        mblNumber: null,
        eventTime: null,
        type: null
      },
      dataFixDialogVisible: false,
      loadingDataFix: false,
      dataFixForm: {
        id: null,
        lp: '',
        // hblNumber: '',
        setNew: '',
        // containerNo: '',
        // containerNoLp: ''
      },
      dataFixRules: {
        lp: [
          { required: true, message: 'Please enter LP', trigger: 'blur' }
        ],
        hblNumber: [
          { required: true, message: 'Please enter HBL Number', trigger: 'blur' }
        ],
        setNew: [
          { required: true, message: 'Please enter Set Number', trigger: 'blur' }
        ],
        containerNo: [
          { required: true, message: 'Please enter Containers/HBL', trigger: 'blur' }
        ],
        containerNoLp: [
          { required: true, message: 'Please enter Containers/LP', trigger: 'blur' }
        ]
      },
      docReasonMap:{},
      //导出
      hblExportLoading: false,
      hblPercentage: 0,
      hblProgressStatus: '',      // '' | 'success' | 'exception'
      hblProgressTip: 'Exporting',
      hblProgressId: null,
      hblPollTimer: null,
    }
  },
  watch: {},
  computed: {
    hasFilter() {
      return this.mainTableQueryParams.dc
    }
  },
  async created() {
    if (this.$route.query.taskRow && this.$route.query.taskType) {
      const row = JSON.parse(this.$route.query.taskRow)
      // console.log('row', row)
      this.mainTableQueryParams.taskType = this.$route.query.taskType
      this.mainTableQueryParams.taskCode = row.taskCode
      console.log('this.$route.query.queryParams', this.$route.query.queryParams)
      if(this.$route.query.queryParams){
        const overviewqueryParams = JSON.parse(this.$route.query.queryParams);
        console.log('overviewqueryParams', overviewqueryParams)
        this.mainTableQueryParams.containerNo = overviewqueryParams.containerNo;
        this.mainTableQueryParams.dc = overviewqueryParams.dcList;
      }
      if (row.taskCode === 'Document_Verification_Complete_Hbl') {
        this.mainTableQueryParams.documentVerified = this.$route.query.taskType === 'finished'
      }
    } else {
      this.mainTableQueryParams = {
        pageNo: 1,
        pageSize: 20
      }
    }
    // 计算表格高度
    this.calcTableHeight()
    // 获取页面常用数据
    await this.getCommonData()
    // 获取筛选条件下拉数据
    await this.getDestinationHblQueryFilterList()
    // 获取列表
    await this.getList()
  },
  methods: {
    formatContainerNo(containerNo) {
      if (!containerNo) return ''
      return containerNo.replace(/,/g, '\n')
    },
    /** 查询列表 */
    getList() {
      this.loading = true
      this.filterPopover = false
      this.handleSelection([], null)
      console.log('getList', this.mainTableQueryParams)
      // 执行查询
      const params = { ...this.mainTableQueryParams }
      getDestinationHblPage(params).then(response => {
        this.mainTableDataList = response.data.list
        this.total = response.data.total
        this.loading = false
      })
      // 数量看板
      this.handReport()
    },
    handReport() {
      console.log('handReport')
      const params = { ...this.mainTableQueryParams }
      // params.podVessel = params.podVessel.map(item => (item === 'Empty Value' ? '' : item))
      // params.podVoyage = params.podVoyage === 'Empty Value' ? '' : params.podVoyage
      getDestinationHblCount(params).then(response => {
        this.hblOverviewStatus.hblCount = response.data
      })
      verifyDocumentsOverviewStatistics(params).then(response => {
        this.hblOverviewStatus.verifyDocumentPossibleCount = response.data.possibleCount
        this.hblOverviewStatus.verifyDocumentUrgentCount = response.data.urgentCount
        this.hblOverviewStatus.verifyDocumentOverdueCount = response.data.overdueCount
        this.hblOverviewStatus.verifyDocumentDoneCount = response.data.doneCount
      })
    },
    clearFilters() {
      this.mainTableQueryParams = {
        pageNo: 1,
        pageSize: 20,
        orderBy: null,
        orderDirection: null,
        taskType: null,
        taskCode: null,
        documentVerified: null,
        verified: null,
        source: null,
        hblNumber: null,
        mblNumber: null,
        containerNo: null,
        supplierCode: null,
        dc: null,
        pol: null,
        pod: null,
        etaDateRange: [],
        vessel: null,
        voyage: null,
        country: null,
        mpNumber: null,
        sanitaryRisk: null,
        lp: null,
        sanitary: null,
        carrier: null,
        brokerDeptName: null,
        assigned: null,
        invoiced: null,
        finished: null,
        commercialInvoiceNumber: null,
        itemNumber: null,
        freightType: null,
        soType: null,
      }
      this.handleQuery()
    },
    handleSortChange({ column, prop, order }) {
      // 根据当前排序条件发送请求到后台获取排序结果
      if (order != null) {
        order = order === 'ascending' ? 'ASC' : 'DESC'
        this.mainTableQueryParams.orderBy = column.property.replace(/([A-Z])/g, '_$1').toLowerCase()
        this.mainTableQueryParams.orderDirection = order
      } else {
        this.mainTableQueryParams.orderBy = ''
        this.mainTableQueryParams.orderDirection = ''
      }
      this.getList()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.mainTableQueryParams.pageNo = 1
      this.getList()
    },
    handleSelectionChange(val) {
      console.log('handleSelectionChange:', val)
      this.selectedRows = val
      this.selectIds = val.map(item => item.id)
    },
    handleSelection(selection, row) {
      console.log('handleSelection', selection)
      // 空的不能操作
      this.verifyDisable = selection.length === 0
      this.selectIds = selection.map(item => item.id)
    },
    calcTableHeight() {
      const clientHeight = document.documentElement.clientHeight
      this.tableHeight = clientHeight - 382
    },
    getCommonData() {
      getMilestonesEnumListByType(4).then(res => {
        console.log('getMilestonesEnumListByType')
        console.log(res)
        if (res.data) {
          res.data.forEach(item => {
            console.log('item', item.taskName)
          })
        }
        this.pendingTaskList = res.data
      })
      getDestinationDcList().then(response => {
        console.log('获取DC列表:', response.data)
        this.$set(this, 'dcList', response.data || [])
        this.mainTableQueryFilerList.dcList = response.data
      })
      this.getBrokerList()
      getDictData('pepco_dest_doc_verify_select_op').then(res => {
        console.log('pepco_dest_doc_verify_select_op', res)
        if (res.data) {
          res.data.forEach(item => {
            this.docReasonMap[item.value] = item.label
          })
          console.log('this.docReasonMap', this.docReasonMap)
        }
      }).catch(error => {
        console.log('获取doc verify reason失败:', error)
      })
    },
    getDestinationHblQueryFilterList() {
      destinationHblPolList().then(response => {
        if (response.data) {
          this.mainTableQueryFilerList.polList = response.data
        }
      }).catch(error => {
        console.log('获取pol列表失败:', error)
      })
      destinationHblPodList().then(response => {
        if (response.data) {
          this.mainTableQueryFilerList.podList = response.data
        }
      }).catch(error => {
        console.log('获取pod列表失败:', error)
      })
      destinationHblVesselList().then(response => {
        if (response.data) {
          this.mainTableQueryFilerList.vesselList = response.data
        }
      }).catch(error => {
        console.log('获取vessel列表失败:', error)
      })
      destinationHblVoyageList().then(response => {
        if (response.data) {
          this.mainTableQueryFilerList.voyageList = response.data
        }
      }).catch(error => {
        console.log('获取voyage列表失败:', error)
      })
      destinationHblCarrierList().then(response => {
        if (response.data) {
          this.mainTableQueryFilerList.carrierList = response.data
        }
      }).catch(error => {
        console.log('获取carrier列表失败:', error)
      })
      destinationHblSupplierList().then(response => {
        if (response.data) {
          this.mainTableQueryFilerList.supplierList = response.data
        }
      }).catch(error => {
        console.log('获取supplier列表失败:', error)
      })
      destinationHblCountryList().then(response => {
        if (response.data) {
          this.mainTableQueryFilerList.countryList = response.data
        }
      }).catch(error => {
        console.log('获取country列表失败:', error)
      })
      destinationHblBrokerList().then(response => {
        if (response.data) {
          this.mainTableQueryFilerList.brokerList = response.data
        }
      }).catch(error => {
        console.log('获取broker列表失败:', error)
      })
      destinationHblTypeList().then(response => {
        if (response.data) {
          this.mainTableQueryFilerList.hblTypeList = response.data
        }
      }).catch(error => {
        console.log('获取hblType列表失败:', error)
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return 'shuang-row'
      } else {
        return 'dan-row'
      }
    },
    handReportChange(status, taskType) {
      if (null == status) {
        this.mainTableQueryParams.documentVerified = null
        this.mainTableQueryParams.taskCode = null
      } else if (status == 1) {
        this.mainTableQueryParams.documentVerified = false
        this.mainTableQueryParams.taskCode = 'Document_Verification_Complete_Hbl'
      } else if (status == 2) {
        this.mainTableQueryParams.documentVerified = true
        this.mainTableQueryParams.taskCode = 'Document_Verification_Complete_Hbl'
      }
      this.mainTableQueryParams.taskType = taskType
      this.getList()
    },
    getDcName(dcCodes) {
      if (!dcCodes) return ''
      return dcCodes
        .split(',')
        .map(code => {
          const match = this.dcList.find(item => item.dcCode === code.trim())
          return match ? match.dcName : code
        })
        .join(', ')
    },
    async verifyShipping(value) {
      this.showVerifyRevokeBtn = false
      // 判断verify的id个数
      if (this.selectIds.length == 0) {
        this.$message({
          type: 'warning',
          // 提示语：只能选择一条数据
          message: 'Please select at least one record.'
        })
        return
      }
      // if (this.checkVerifiedStatus()) {
      //   return
      // }
      console.log('选择的数据', this.selectedRows)
      if (this.selectedRows[0].verified !== 0) {
        this.$set(this, 'showVerifyRevokeBtn', true)
      }
      console.log('选择的记录:', this.showVerifyRevokeBtn)
      console.log('选择的id:', this.selectIds)
      this.loadingSaveVerify = false
      this.sanitaryValue = this.selectedRows[0].sanitary === null ? false : this.selectedRows[0].sanitary
      this.verifyDialog = true
      this.title = value
      this.radio = '1'
      await getTaskSettingPage({
        pageNo: 1,
        pageSize: 20,
        taskCode: 'Document_Verification_Complete_Hbl'
      })
        .then(response => {
          if (response.data.list.length > 0) {
            console.log('获取任务设置成功1:', response.data.list)
            this.$set(this, 'formData', response.data.list[0].formTemplate)
            this.$set(this, 'taskCode', response.data.list[0].taskCode)
            this.$set(this, 'type', response.data.list[0].taskCode)
          }
        })
        .catch(error => {
          console.error('获取任务设置失败:', error)
        })
    },
    async selectRadio(value) {
      console.log('Selected radio value:', value)
      if (value == '2') {
        console.log('获取任务设置成功:', this.formData)
        this.reasonDialog = true
        this.finishRadioValue = false
        this.reasonTitle = 'Verify Documents'
        console.log('this.formData11:', this.selectIds)
      } else {
        console.log('同意:', this.selectIds)
      }
    },
    changeSwitch(value) {
      console.log('changeSwitch value:', value)
      this.$set(this, 'sanitaryValue', value)
    },
    Incomplete() {
      console.log('cancel')
      this.verifyDialog = false
      this.finshDialog = false
    },
    Complete() {
      if (this.radio === '1') {
        this.submitComplete()
      } else {
        if (this.type === 'Document_Verification_Complete_Hbl') {
          this.submitDouumentReason()
        } else {
          console.error(`unknow the type: ${this.type}`)
        }
      }
    },
    submitComplete() {
      this.loadingSaveVerify = true
      console.log('同意:', this.selectIds)
      const formData = JSON.parse(this.formData)
      const data = {
        taskCode: 'Document_Verification_Complete_Hbl',
        ids: this.selectIds,
        completeValue: '1',
        sanitaryValue: this.sanitaryValue
      }
        ; (formData[0].value = '1'), (formData[0].status = 'Complete')
      data.formData = JSON.stringify(formData)
      verifyDestinationHbl(data).then(response => {
        if (response.code != null || response.code == 0) {
          this.$message({
            type: 'success',
            message: 'Verify Success'
          })
          this.getList()
        }
        this.loadingSaveVerify = false
      })
      this.verifyDialog = false
    },
    submitDouumentReason() {
      console.log('this.form:', this.form)
      console.log('this.form.reason:', this.form.reason)
      if (!this.form.reason || this.form.reason === '' || this.form.reason === null) {
        this.$message({
          type: 'warning',
          message: 'Please fill in the reason'
        })
        return
      }
      const formData = JSON.parse(this.formData)
      const data = {
        taskCode: 'Document_Verification_Complete',
        ids: this.selectIds,
        completeValue: this.form.reason,
        sanitaryValue: this.sanitaryValue
      }
      formData[0].value = this.form.reason
      formData[0].remark = this.form.remark
      formData[0].status = 'Incomplete'
      data.formData = JSON.stringify(formData)
      console.log('verifyData', data)
      this.$refs['reasonDialogForm'].validate(valid => {
        if (valid) {
          verifyDestinationHbl(data).then(response => {
            if (response.code != null || response.code == 0) {
              this.$message({
                type: 'success',
                message: 'Submit Success'
              })
              // this.queryParams.pendingTaskValue = null
              this.getList()
            }
          })
          this.finshDialog = false
          this.verifyDialog = false
          this.reasonDialog = false
          this.form = {}
          this.radio = '1'
        } else {
          // this.$message.warning("Please fill out the form completely")
          this.selectRadio('2')
        }
      })
    },
    revokeVerifyDocument() {
      this.loadingSaveVerify = true
      // 给出确认按钮，是否进行操作

      this.$confirm('Are you sure you want to revoke the verify document?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => {
          // 确认操作
          const data = {
            ids: this.selectIds,
            sanitaryValue: this.sanitaryValue
          }
          revokeHblVerify(data)
            .then(response => {
              if (response.code === 0) {
                console.log('Revoke Verify Document response:', response)
                this.$message({
                  type: 'success',
                  message: 'Verify Document revoked successfully!'
                })
                this.verifyDialog = false
                this.loadingSaveVerify = false
                this.getList()
              } else {
                this.$message({
                  type: 'error',
                  message: 'Failed to revoke verify document.'
                })
              }
            })
            .catch(error => {
              this.loadingSaveBut = false
              console.error('revoke error:', error)
              this.$message({
                type: 'error',
                message: 'Failed to revoke verify document.'
              })
            })
        })
        .catch(() => {
          // 取消操作
          this.loadingSaveVerify = false
          this.verifyDialog = false
        })
    },
    // downloadOrderData() {
    //   if (this.mainTableDataList.length === 0) {
    //     this.$notify({
    //       title: 'warning',
    //       message: 'No data to export',
    //       type: 'warning'
    //     })
    //     return
    //   }
    //   this.$confirm('Confirm the download?', 'Tips', {
    //     confirmButtonText: 'Confirm',
    //     cancelButtonText: 'Cancel',
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       this.downloadOrderLoading = true
    //       downloadShipmentHblData(this.mainTableQueryParams).then(response => {
    //         this.$download.excel(response, 'PEPCO Shipment HBLs' + this.parseUTCTime(new Date()) + '.xlsx')
    //         this.$notify({
    //           title: 'success',
    //           message: 'Download Success',
    //           type: 'success'
    //         })
    //         this.downloadOrderLoading = false
    //       })
    //     })
    //     .catch(() => {
    //       this.downloadOrderLoading = false
    //     })
    // },
    //修改导出 zane

    async handleHblExport() {
      if (!this.mainTableDataList || this.mainTableDataList.length === 0) {
        this.$notify({ title: 'Warning', message: 'No data to export', type: 'warning' })
        return
      }
      try {
        await this.$confirm('Confirm the download?', 'Tips', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        })
      } catch {
        return
      }

      this.hblProgressId = uuidv4()
      this.hblExportLoading = true
      this.hblPercentage = 0
      this.hblProgressStatus = ''
      this.hblProgressTip = 'Exporting'

      try {
        await createHblExportTask({
          ...this.mainTableQueryParams,
          progressId: this.hblProgressId
        })
        this.startHblPolling()
      } catch {
        this.$message.error('Failed to create export task')
        this.resetHblExportState()
      }
    },

    startHblPolling() {
      this.stopHblPolling()
      this.hblPollTimer = setInterval(this.pollHblProgress, 3000)
    },

    stopHblPolling() {
      if (this.hblPollTimer) {
        clearInterval(this.hblPollTimer)
        this.hblPollTimer = null
      }
    },

    async pollHblProgress() {
      try {
        const res = await getHblExportProgress({ progressId: this.hblProgressId })
        if (!res || !res.data) return

        const { current, sum, done, failed } = res.data

        if (sum > 0) {
          // 最多到 99，留给下载完成后跳 100
          this.hblPercentage = Math.min(Math.round((current / sum) * 100), 99)
        }

        if (failed) {
          this.stopHblPolling()
          this.hblProgressStatus = 'exception'
          this.hblPercentage = 100
          this.hblProgressTip = 'Failed'
          this.$message.error('Export task failed')
          setTimeout(() => this.resetHblExportState(), 2000)
          return
        }

        if (done) {
          this.stopHblPolling()
          this.hblPercentage = 100
          this.hblProgressStatus = 'success'
          this.hblProgressTip = 'Downloading'
          await this.downloadHblFile(this.hblProgressId)
          setTimeout(() => this.resetHblExportState(), 1500)
        }
      } catch (error) {
        console.error('[HBL Export] Poll error:', error)
        this.stopHblPolling()
        this.hblProgressStatus = 'exception'
        this.hblProgressTip = 'Error'
        this.$message.error('Export connection error')
        setTimeout(() => this.resetHblExportState(), 2000)
      }
    },

    async downloadHblFile(progressId) {
      try {
        const res = await getHblExportFile({ progressId })
        if (!res || !res.data) {
          this.$message.error('Download failed: file URL is empty')
          return
        }

        const token = getAccessToken()
        const tenantId = getTenantId()

        const fileRes = await axios.get(res.data, {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`,
            'tenant-id': tenantId
          }
        })

        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
        const blob = new Blob([fileRes.data])
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `PEPCO_Shipment_HBLs_${dateStr}.xlsx`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)

        this.$notify({ title: 'Success', message: 'Download Success', type: 'success' })
      } catch (err) {
        console.error('[HBL Export] Download error:', err)
        this.$message.error('File download failed')
      }
    },

    resetHblExportState() {
      this.hblExportLoading = false
      this.hblPercentage = 0
      this.hblProgressStatus = ''
      this.hblProgressTip = 'Exporting'
      this.hblProgressId = null
    },

    beforeDestroy() {
      this.stopHblPolling()
    },
    getBrokerList() {
      getBrokerDataList()
        .then(response => {
          console.log('获取11brokerList:', response.data)
          // this.$set(this, 'brokerList', response.data)
          this.brokerList = response.data.map(item => ({
            ...item,
            id: String(item.id)
          }))
          console.log('获取11brokerList12:', this.brokerList)
        })
        .catch(error => {
          console.error('get brokers:', error)
        })
    },
    async assignBroker(taskCode) {
      const containerHblSelectedRows = [];
      const containerIdSet = new Set();
      // 遍历所有展开的详情组件，获取选中的broker行
      this.mainTableDataList.forEach((row, index) => {
        const expandDetailRef = this.$refs[`hblExpandDetailRef${row.id}`]
        if (expandDetailRef) {
          const selectedRows = expandDetailRef.getContainerHblSelectedRows();
          if (selectedRows && selectedRows.length > 0) {
            selectedRows.forEach(item => {
              if (!containerIdSet.has(item.id)) {
                containerIdSet.add(item.id)
                containerHblSelectedRows.push(item)
              }
            });
          }
        }
      });
      console.log('Container HBL所有选中的Broker行:', containerHblSelectedRows)
      // 将选中的行保存到组件数据中
      this.brokerSelectedRows = containerHblSelectedRows
      this.brokerForm = {}
      if (this.brokerSelectedRows.length == 0) {
        this.handleBrokerImport()
        this.assignBrokerformDialogVisible = false
      } else {
        console.log('assignBroker taskCode:', taskCode)

        //获取system_task_setting中的form_template
        await getTaskSettingPage({ pageNo: 1, pageSize: 10, taskCode: taskCode })
          .then(response => {
            if (response.data.list.length > 0) {
              console.log('获取任务设置成功:', response.data.list)
              this.$set(this, 'formData', response.data.list[0].formTemplate)
              this.$set(this, 'taskCode', response.data.list[0].taskCode)
              this.$set(this, 'type', response.data.list[0].taskCode)
            }
          })
          .catch(error => {
            console.error('获取任务设置失败:', error)
          })
        this.title = 'Customs broker assign'
        const selectedBroker = this.brokerSelectedRows.find(item => item.brokerDeptId)
        console.log('selectedBroker:', selectedBroker)
        if (selectedBroker) {
          this.brokerForm.brokerDeptId = selectedBroker.brokerDeptId || ''
        }
        console.log('taskCode1111:', this.taskCode)
        this.assignBrokerformDialogVisible = true
      }
    },
    handleBrokerChange(val) {
      console.log('handleBrokerChange:', val)
      // this.form.brokerDeptId = val
      // 直接赋值即可
      this.brokerForm.brokerDeptId = val
      // 触发表单验证
      console.log('form.brokerDeptId:', this.brokerForm.brokerDeptId)
      const broker = this.brokerList.find(broker => broker.id === val)
      console.log('selected broker:', broker)
      this.$nextTick(() => {
        this.$forceUpdate() // 强制组件刷新
      })
    },
    revokeBroker() {
      this.loadingSaveBut = true
      // 给出确认按钮，是否进行操作

      this.$confirm('Are you sure you want to revoke the broker assignment?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => {
          // 确认操作
          const selectDestinationContainerIds = this.brokerSelectedRows.map(item => item.id)
          containerRevokeBroker(selectDestinationContainerIds)
            .then(response => {
              if (response.code === 0) {
                console.log('Revoke broker response:', response)
                this.$message({
                  type: 'success',
                  message: 'Broker assignment revoked successfully!'
                })
                this.assignBrokerformDialogVisible = false
                this.loadingSaveBut = false
                this.getList()
              } else {
                this.$message({
                  type: 'error',
                  message: 'Failed to revoke broker assignment.'
                })
              }
            })
            .catch(error => {
              this.loadingSaveBut = false
              console.error('revoke error:', error)
              this.$message({
                type: 'error',
                message: 'Failed to revoke broker assignment.'
              })
            })
        })
        .catch(() => {
          // 取消操作
          this.loadingSaveBut = false
          this.assignBrokerformDialogVisible = false
        })
    },
    submitBroker2(number) {
      this.loadingSaveBut = true
      console.log('brokerSelectedRows:', this.brokerSelectedRows)
      if (this.brokerSelectedRows.length < 1) {
        this.$message({
          type: 'warning',
          message: 'Please select at least one record'
        })
        return
      }
      if (this.taskCode === 'Customs_Broker_Assigned' && (this.brokerForm.brokerDeptId == null || this.brokerForm.brokerDeptId === '')) {
        this.$message({
          type: 'warning',
          message: 'Please select a broker'
        })
        return
      }
      console.log('taskCode:', this.taskCode)
      console.log('formData:', this.formData)
      const formData = JSON.parse(this.formData)
      const data = {
        destinationContainerIds: this.brokerSelectedRows.map(item => item.id),
        taskCode: this.taskCode
      }
      if (this.taskCode === 'Customs_Broker_Assigned') {
        const broker = this.brokerList.find(v => v.id === this.brokerForm.brokerDeptId)
        console.log('broker:', broker)
        // 将formData转换成JSON字符串
        // 将formData 解析，把value值改成broker.brokerCode
        formData[0].value = broker.id
        formData[0].status = 'Assigned'
        console.log('解析后formData:', formData)
        data.brokerCode = broker.name
        data.brokerDeptId = this.brokerForm.brokerDeptId
        data.formData = JSON.stringify(formData)
      }
      // 提交broker
      if (number === 10) {
        containerSubmitBroker(data)
          .then(response => {
            if (response.code === 0) {
              this.$message({
                type: 'success',
                message: 'Broker assigned successfully!'
              })
              this.assignBrokerformDialogVisible = false
              this.loadingSaveBut = false
              this.getList()
              this.brokerForm.brokerDeptId = null
            } else {
              this.$message({
                type: 'error',
                message: 'Failed to assign broker.'
              })
            }
          })
          .catch(error => {
            console.error('submit error:', error)
            this.$message({
              type: 'error',
              message: 'Failed to assign broker.'
            })
          })
      }
    },
    handleBrokerImport() {
      this.upload.title = 'Import Broker'
      this.upload.type = 1
      this.upload.url = process.env.VUE_APP_BASE_API + '/admin-api/pepco/destination/container/import-container-broker'
      this.upload.open = true
    },
    downloadTemplateData(type) {
      this.$modal
        .confirm(this.$t('purchaseOrder.confirmThatAllDataItemsAreExported'))
        .then(() => {
          // 处理查询参数
          this.exportLoading = true
          if (type === 1) {
            return exportContainerBroker({})
          }
        })
        .then(response => {
          if (type === 1) {
            this.$download.excel(response, 'Pepco Shipping Broker.xlsx.xlsx')
          }
          this.exportLoading = false
        })
        .catch(() => { })
    },
    submitFileForm() {
      this.$refs.upload.submit()
    },
    // 文件上传失败处理
    handleFileError(err, file, fileList) {
      console.log('文件上传失败')
      console.log('文件上传失败')
      console.log(err)
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
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
      console.log('上传的返回值111', this.data)
      // 将结果添加到this.data中
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.getList()
    },
    formatBrokerNames(brokerNames) {
      if (!brokerNames) return '';
      // Split by comma, trim whitespace, filter out empty values, and remove duplicates
      const uniqueNames = [...new Set(brokerNames.split(',').map(name => name.trim()).filter(name => name))];
      // Join back with comma and space
      return uniqueNames.join(', ');
    },
    // 打开更新ETD/ETA的对话框
    openUpdateShipmentTimeDialog(row, type) {
      this.shipmentTimeForm = {
        currHblRowData: row,
        type: type,
        mblNumber: row.mblNumber,
        eventTime: this.parseUTCTime(type === 'ETA' ? row.eta : row.ata)
      };
      this.shipmentTimeUpdateDialogVisible = true;
    },
    // 更新ETD/ETA
    updateShipmentTime() {
      console.log('updateShipmentTime:', this.shipmentTimeForm)
      const { currHblRowData, type, eventTime } = this.shipmentTimeForm;
      // 添加值的验证
      if (!eventTime) {
        this.$message.warning(`Please select ${type}`);
        return;
      }
      const updateData = {
        shipmentIds: [currHblRowData.shipmentId],
        eta: type === 'ETA' ? eventTime : null,
        ata: type === 'ATA' ? eventTime : null
      };
      console.log('updateData:', updateData)

      // 根据类型选择对应的API函数
      const apiFunction = type === 'ETA' ? updateEta : updateAta;
      const actionName = type === 'ATA' ? 'ATA' : 'ETA';

      apiFunction(updateData).then(response => {
        if (response.code === 0) {
          this.$message.success(`Update ${actionName} successfully!`);
        } else {
          this.$message.error(`Failed to update ${actionName}.`);
        }
      }).catch(() => {

      }).finally(() => {
        this.shipmentTimeUpdateDialogVisible = false;
        this.handleQuery();
      });
    },
    openDataFixDialog() {
      // 检查是否选择了数据
      if (this.selectedRows.length === 0) {
        this.$message({
          type: 'warning',
          message: 'Please select at only one record.'
        });
        return;
      }

      // 只能选择一条数据进行修复
      if (this.selectedRows.length > 1) {
        this.$message({
          type: 'warning',
          message: 'Please select only one record for data fix.'
        });
        return;
      }

      // 获取选中的行数据
      const selectedRow = this.selectedRows[0];

      // 填充表单数据
      this.dataFixForm = {
        id: selectedRow.id,
        lp: selectedRow.lp || '',
        // hblNumber: selectedRow.hblNumber || '',
        setNew: selectedRow.setNew || '',
        // containerNo: selectedRow.containerNo || '',
        // containerNoLp: selectedRow.containerNoLp || ''
      };

      // 打开对话框
      this.dataFixDialogVisible = true;

      // 清空表单验证
      this.$nextTick(() => {
        this.$refs.dataFixForm && this.$refs.dataFixForm.clearValidate();
      });
    },

    // 提交 Data Fix
    submitDataFix() {
      this.$refs.dataFixForm.validate(valid => {
        if (valid) {
          this.loadingDataFix = true;

          // 准备提交的数据
          const submitData = {
            id: this.dataFixForm.id,
            lp: this.dataFixForm.lp,
            // hblNumber: this.dataFixForm.hblNumber,  //先只可以修改lp\setNew
            setNew: this.dataFixForm.setNew,
            // containerNo: this.dataFixForm.containerNo,
            // containerNoLp: this.dataFixForm.containerNoLp
          };

          // 调用 API
          doDataFix(submitData)
            .then(response => {
              if (response.code === 0) {
                this.$message({
                  type: 'success',
                  message: 'Data fix successfully!'
                });
                this.dataFixDialogVisible = false;
                // 刷新列表
                this.getList();
              } else {
                this.$message({
                  type: 'error',
                  message: response.msg || 'Failed to fix data.'
                });
              }
            })
            .catch(error => {
              console.error('Data fix error:', error);
              this.$message({
                type: 'error',
                message: 'Failed to fix data.'
              });
            })
            .finally(() => {
              this.loadingDataFix = false;
            });
        }
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.card-box-container-dest-01 {
  display: flex;
  width: 100%;
  margin-bottom: 10px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
}

.box-scroller {
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
}

.clickable-area {
  cursor: pointer;
  // color: #fff;
  padding: 0px 5px;
  border-radius: 10px;
  float: right;
  line-height: 24px;
  margin-left: 5px;
}

.count-class {
  font-size: 20px;
  text-align: center;
  // color: #000;
}

.dialog-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

/* 垂直排列样式 */
.vertical-radios {
  display: flex;
  flex-direction: column;
  gap: 20px;
  /* 上下间距 */
}

.vertical-radios .el-radio {
  margin-bottom: 15px;
}

.complete-radio.is-checked .el-radio__inner {
  background: #67c23a;
  border-color: #67c23a;
}

.complete-radio.is-checked .el-radio__label {
  color: #67c23a;
}

/* 带边框样式的特殊处理 */
.dialog-content>>>.complete-radio.is-checked.is-bordered {
  border-color: #67c23a;
}

.dialog-content>>>.incomplete-radio.is-checked.is-bordered {
  border-color: #f56c6c;
}

/* 红色样式 */
.incomplete-radio.is-checked .el-radio__inner {
  background: #f56c6c;
  border-color: #f56c6c;
}

.incomplete-radio.is-checked .el-radio__label {
  color: #f56c6c;
}

.activePort {
  background-color: #3a71a8;
  color: white !important;
  /* 强制覆盖内联 */
  border-radius: 4px;
  transition: background-color 0.3s;
}
</style>
