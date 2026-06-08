<template>
  <div class="app-container" style="width:100%;padding-top: 20px;">
    <!-- report start -->
    <div class="header-box">
      <div class="header-card" v-hasPermi="['order:header:import']" style="flex-shrink: 0;">
        <span  @click="handleImport">
          <icon-park type="inbox-upload-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
        </span>
      </div>
      <div class="header-card" v-loading="downloadOrderLoading" style="flex-shrink: 0; margin-left: 8px;">
        <span @click="downloadOrderData">
          <icon-park type="inbox-download-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
        </span>
      </div>

      <div class="header-card" style="flex-shrink: 0; margin-left: 8px;">
        <icon-park style="cursor: default; border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#fe5000" strokeLinejoin="miter" strokeLinecap="square" />
        <div @click="bookedChange(false)" style="margin-left: 14px;">
          <p style="font-size: 20px;">{{ orderInfo.notBooked }}</p>
          <p style="margin-top: 8px">Not Booked(Shipper)</p>
        </div>
      </div>

      <div class="header-card" style="flex-shrink: 0; margin-left: 8px;">
        <icon-park style="cursor: default;border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
        <div @click="bookedChange(true)" style="margin-left: 14px;">
          <p style="font-size: 20px;">{{ orderInfo.booked }}</p>
          <p style="margin-top: 8px">Booked(Shipper)</p>
        </div>
      </div>

      <!-- <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;">
        <icon-park style="border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#E6A23C" strokeLinejoin="miter" strokeLinecap="square" />
        <div :class="{ 'avticePort': queryParams.isCancel }" @click="cancelChange('1')" style="padding: 0px 15px;border-radius: 10px;float: right;line-height: 24px;margin-left: 10px;">
          <p style="font-size: 20px;">{{ orderInfo.canceled }}</p>
          <p>Canceled</p>
        </div>
      </el-card> -->

      <!-- width:calc(100% - 660px) -->
      <div class="header-card" id="portsDiv" style="flex-shrink: 0; margin-left: 8px;">
        <svg
          style="float:left;border-right: 1px solid #ddd;width: 65px;height: 65px;margin-top: -5px;padding-right: 10px;padding-bottom: 10px;"
          t="1717126148869" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9997"
          width="200" height="200">
          <path
            d="M433.048 157.845c22.74-23.043 53.113-33.978 83.097-32.752 27.355 0.612 54.457 11.772 74.685 33.277l6.274 6.672 329.473 342.037c18.106 18.797 5.1 50-20.74 50.622l-0.788 0.01-65.135-0.001v296.917c0 60.348-48.43 109.384-108.542 110.358l-1.825 0.015H298.028c-60.954 0-110.368-49.416-110.368-110.373V557.71h-77.709c-26.27 0-39.645-31.365-21.825-50.318l0.55-0.571z m17.17 480.2H332.954c-22.858 0-41.388 18.531-41.388 41.39v117.271c0 22.86 18.53 41.39 41.388 41.39H450.22c22.858 0 41.388-18.53 41.388-41.39v-117.27c0-22.86-18.53-41.39-41.388-41.39z m243.73 0H576.682c-22.858 0-41.388 18.531-41.388 41.39v117.271c0 22.86 18.53 41.39 41.388 41.39h117.266c22.858 0 41.388-18.53 41.388-41.39v-117.27c0-22.86-18.53-41.39-41.388-41.39z m-243.73-246.039H332.954c-22.858 0-41.388 18.531-41.388 41.39v117.271c0 22.86 18.53 41.39 41.388 41.39H450.22c22.858 0 41.388-18.53 41.388-41.39v-117.27c0-22.86-18.53-41.39-41.388-41.39z"
            fill="#004F7C" p-id="9998"></path>
        </svg>
        <div v-for="(item, index) in orderInfo.dc" :key="index"
          style="position: relative;top: 0px;display:inline-block;line-height: 24px;padding: 0px 15px;border-right: 1px solid #ddd;border-radius: 10px; margin-left: 10px;">
          <p style="font-size: 20px;text-align: center;">{{ item.count }}</p>
          <p style="text-align: center; margin-top: 8px;">{{ item.name ? item.name : 'Unkown' }}</p>
          <!-- <p style="text-align: center;">{{ dc_name[item.dc] ? dc_name[item.dc]+'-'+item.dc : 'Unkown' }}</p> -->
        </div>
        <!-- <icon-park style="cursor: default;float:left;border-right: 1px solid #ddd;" type="anchor-two" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" /> -->
        <!-- <div v-for="(item, index) in orderInfo.ports" :key="index"
          :class="{ 'avticePort': checkedPort[item.destinationPort] }" @click="clickPort1(item.destinationPort)"
          style="position: relative;top: -3px;display:inline-block;line-height: 24px;padding: 0px 15px;border-right: 1px solid #ddd;border-radius: 10px; margin-left: 10px;">
          <p style="font-size: 20px;">{{ item.count }}</p>
          <p>{{ item.destinationPort ? item.destinationPort : 'Unkown' }}</p>
        </div> -->
      </div>
      <div v-hasPermi="['pepco:order:right:header']" class="header-card" style="flex-shrink: 0; margin-left: 8px;" v-if="countryData.length > 0">
        <div style="display: flex">
          <div v-for="item in countryData" :key="item.originCountry">
            <div style="width: 100px; line-height: 24px; padding: 0 15px; border-right: 1px solid #ddd; border-radius: 10px;">
              <p style="text-align: center; font-size: 20px;">{{ item.count }}</p>
              <p style="text-align: center; margin-top: 8px;">{{ item.originCountry }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- report end -->


    <el-card class="pd-20">
      <div style="float: right;line-height: 48px;">
        <div style="float: right;position: relative;z-index: 999;">
          <el-button v-if="JSON.stringify(preBookMap) != '{}' && !drawer2" v-hasPermi="['booking:create']"
            @click="clearAll" size="mini" type="primary">{{ $t("purchaseOrder.clearAll") }}</el-button>
          <el-button v-if="!hiddenTask" type="primary" @click="openOverview">
            {{ !drawer2 ? 'Overview' : 'Order List' }}
          </el-button>
          <!-- v-hasPermi="['booking:preAssgine:create']" -->
        </div>
        <selected-list-box v-show="!drawer2" ref="selectedListBox" @remove-row="handleRemoveRow"></selected-list-box>
        <div style="float: right;" v-if="!drawer2">
          <el-tag style="margin-right: 10px;margin-top: 5px;" :disable-transitions="false" closable @close="handleClose(key)" v-show="value.length > 0" v-for="(value, key) in preBookMap" :key="key">
            {{ orderNumberMap[key] }} ({{ value.length }})
          </el-tag>
        </div>

      </div>

      <transition name="el-zoom-in-center">
        <div v-show="!drawer2" class="transition-box">
          <el-form v-if="!drawer2" :model="queryParams">
            <div>
              <div style="float: left;padding-top: 8px;"></div>

              <div style='float:left;padding: 10px 0px;'>
                <el-input placeholder="Order Number" v-model="queryParams.orderNumber"
                  @keyup.enter.native="triggerFilter" clearable @clear="triggerFilter">
                  <!-- <el-button slot="append" @click=" queryParams.pageNo = 1, getList()" type="primary">Search<i class="el-icon-search el-icon--right"></i></el-button> -->
                </el-input>


              </div>


                          <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                            <el-input placeholder="Container no.(CLR)" v-model="queryParams.containerNo"
                              @keyup.enter.native="triggerFilter" clearable @clear="triggerFilter">
                            </el-input>
                          </div>
                          <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                            <el-select
                              placeholder="Merch Code"
                              v-model="queryParams.merchCode"
                              clearable
                              filterable
                            >
                              <el-option
                                v-for="item in merchCodeOptions"
                                :key="item"
                                :label="item"
                                :value="item">
                              </el-option>
                            </el-select>
                          </div>
                          <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                            <el-button slot="append" @click="triggerFilter" type="primary"
                              style="background-color: white; color: black; border-color: #dcdfe6;"
                            >Search<i
                                class="el-icon-search el-icon--right"></i></el-button>
                          </div>



              <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                <el-select @change="triggerFilter" clearable v-model="queryParams.taskStatus" filterable placeholder="Pending Status">
                  <el-option v-for="item in allTaskNames" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
              <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                <el-select @change="triggerFilter" v-model="queryParams.booked" placeholder="Booked/Not Booked" filterable clearable>
                  <el-option label="All" :value="null"></el-option>
                  <el-option label="Not booked" :value="false"></el-option>
                  <el-option label="Booked" :value="true"></el-option>
                </el-select>
              </div>

              <!-- <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                <el-select @change="queryParams.pageNo = 1, getList()" clearable v-model="queryParams.originPort" filterable
                  placeholder="Origin Port">
                  <el-option v-for="item in originPort" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </div> -->

              <!-- <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                <el-select @change="queryParams.pageNo = 1, getList()" clearable v-model="queryParams.shippingPol" filterable
                  placeholder="POL">
                  <el-option v-for="item in shippingPol" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </div>
              <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                <el-select @change="queryParams.pageNo = 1, getList()" clearable v-model="queryParams.shippingPod" placeholder="POD" filterable>
                  <el-option v-for="item in shippingPod" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </div> -->

              <!-- <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                <el-select @change="queryParams.pageNo = 1, getList()" clearable v-model="queryParams.country" placeholder="Country" filterable>
                  <el-option v-for="item in country" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </div>
              <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                <el-select @change="queryParams.pageNo = 1, getList()" filterable clearable v-model="queryParams.supplierCode" placeholder="Supplier Name">
                  <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.supplierCode">
                  </el-option>
                </el-select>
              </div>
              <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                <el-select @change="queryParams.pageNo = 1, getList()" clearable v-model="queryParams.dc" placeholder="DC" filterable>
                  <el-option v-for="item in dc" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </div> -->
              <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                <el-popover v-model="filterPopover" placement="bottom" title=" " popper-class="popover-filter" width="400" trigger="click">
                  <el-form>
                    <el-row :gutter="10" style="margin-bottom: 15px;">
                      <el-col :span="12">
                        <!--  @change="queryParams.pageNo = 1, getList()"  -->
                        <el-select
                          clearable
                          v-model="queryParams.originPort"
                          filterable
                          multiple
                          placeholder="Origin Port"
                          collapse-tags
                        >
                          <el-option
                            v-for="item in originPort"
                            :key="item"
                            :label="item"
                            :value="item"
                          >
                          </el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="12">
                        <el-select multiple clearable v-model="queryParams.countryList" placeholder="Origin Country" filterable>
                          <el-option v-for="item in country" :key="item" :label="item" :value="item">
                          </el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10" style="margin-bottom: 15px;">
                      <el-col :span="12">
                        <el-select filterable clearable v-model="queryParams.supplierCode" placeholder="Supplier Name">
                          <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.supplierCode">
                          </el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="12">
                        <el-select multiple clearable v-model="queryParams.dcList" placeholder="DC" filterable>
<!--                          <el-option v-for="item in dc" :key="item" :label="item" :value="item">-->
<!--                          </el-option>-->
                          <el-option v-for="item in dcDataList" :key="item.id" :label="item.dcCode + ' - ' + item.dcName" :value="item.dcCode"></el-option>
                        </el-select>
                      </el-col>
                    </el-row>

                    <el-date-picker v-model="queryParams.hodDateRange" clearable type="daterange" range-separator="-"
                            start-placeholder="HOD from"
                            end-placeholder="HOD to"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="margin-bottom: 15px;">
                    </el-date-picker>
                    <el-row :gutter="10" style="margin-bottom: 15px;">
                      <el-col :span="12">
                        <el-select filterable clearable v-model="queryParams.shipmentType" placeholder="SO Type">
                          <el-option v-for="item in this.getDictDatas(DICT_TYPE.SHIPMENT_TYPE)" :key="item.value" :label="item.label" :value="item.value">
                          </el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="12">
                        <el-select clearable v-model="queryParams.transportMode" :placeholder="$t('booking.transportMode')" filterable>
                          <el-option v-for="dict in getDictDatas(DICT_TYPE.MODE_OF_TRANSPORT_PEPCO)" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10" style="margin-bottom: 15px;">
                      <el-col :span="12">
                        <el-select clearable v-model="queryParams.atdFlag" placeholder="ATD">
                          <el-option label="Departed" value="1"></el-option>
                          <el-option label="Not Departed" value="0"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="12">
                        <el-select clearable v-model="queryParams.ataFlag" placeholder="ATA">
                          <el-option label="Arrived" value="1"></el-option>
                          <el-option label="Not Arrived" value="0"></el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10" style="margin-bottom: 15px;">
                      <!-- <el-col :span="12">
                        <el-select filterable clearable v-model="queryParams.supplierType" placeholder="Supplier Type">
                          <el-option v-for="item in supplierTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-col> -->
                      <el-col :span="12">
                        <el-select
                          v-model="queryParams.poTags"
                          placeholder="PO Tag"
                          multiple
                          filterable
                          clearable
                          collapse-tags
                          style="width: 100%"
                        >
                          <el-option
                            v-for="tag in poTagOptions"
                            :key="tag.code"
                            :label="tag.label"
                            :value="tag.code"
                          >
                          <el-tag :type="tag.type" :class="tag.className" size="small" style="margin-right: 8px;">
                              {{ tag.label }}
                            </el-tag>
                          </el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10">
                      <el-col :span="24">
                        <el-date-picker v-model="queryParams.etdDateRange" clearable type="daterange" range-separator="-"
                            start-placeholder="ETD from"
                            end-placeholder="ETD to"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="margin-bottom: 15px;">
                        </el-date-picker>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10" style="margin-bottom: 15px;">
                      <el-col :span="12">
                        <el-cascader
                          clearable
                          style="width: 100%"
                          v-model="queryParams.poStatus"
                          :props="{ expandTrigger: 'hover' }"
                          placeholder="Milestone Status"
                          :options="mileOptions">
                        </el-cascader>
                      </el-col>
                      <el-col :span="12">
                        <el-select filterable clearable v-model="queryParams.status" placeholder="PO Status">
                          <el-option label="Active" :value="0"></el-option>
                          <el-option label="Canceled" :value="1"></el-option>
                          <el-option label="On hold" :value="2"></el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                    <!-- <el-row :gutter="20" style="margin-bottom: 15px;">
                        <el-col style="text-align: right">
                          <el-button @click="triggerFilter" icon="el-icon-search" plain> Search </el-button>
                        </el-col>
                    </el-row> -->
                  </el-form>
                  <el-button slot="reference" icon="el-icon-plus" plain :style="{color:hasFilter?'red':''}">Filter</el-button>
                </el-popover>
                <el-button style="margin-left: 5px;" @click="clearFilters" plain> Clear Filters </el-button>
              </div>
              <div style="clear: both;"></div>
            </div>
          </el-form>
          <div style="overflow: auto;width:calc(100%);float: left;">
            <el-table ref="multipleTable" :row-class-name="tableRowClassName" border @sort-change="handleSortChange"
              :header-cell-class-name="headerCellStyle" @select="handleSelection" v-loading="loading"
              :height="tableHeight - 70" :data="tableData" style="width: 100%">
              <el-table-column type="selection" width="55" :selectable="canBeSelect"> </el-table-column>
              <el-table-column type="expand">
                <template slot-scope="props">
                  <div style="padding:15px 58px 15px 58px;">
                    <el-tabs type="border-card" :ref="'tab' + props.row.id" v-model="props.row.key"
                      @tab-click="handleClick($event, props)">
                      <el-tab-pane label="Order Items" :name="'first' + props.row.id">

                        <el-table border show-summary :summary-method="getSummaries" max-height="400" style="width:100%"
                          :data="props.row.items">
                          <el-table-column prop="productCode" label="Item Number" min-width="150">
                            <template v-slot="scope">
                              {{ productMap[scope.row.productId] ? productMap[scope.row.productId].code : '' }}
                            </template>
                          </el-table-column>
                          <el-table-column prop="tcId" label="TCId" min-width="140">
                            <!--直接从tcId属性取值，后台已经传了-->
                            <!-- <template v-slot="scope">
                              {{ productMap[scope.row.productId]?productMap[scope.row.productId].tcId:'' }}
                            </template> -->
                          </el-table-column>
                          <el-table-column prop="outerQty" :render-header="renderHeader" label="Ordered Outer/(Cartons)"
                            min-width="140">
                            <template v-slot="scope">
                              {{ scope.row.outerQty }}
                            </template>
                          </el-table-column>
                          <el-table-column prop="tcQty" :render-header="renderHeader" label="Ordered Inner/(Cartons)"
                            min-width="140">
                            <template v-slot="scope">
                              {{ scope.row.tcQty }}
                            </template>
                          </el-table-column>
                          <el-table-column prop="orderedPieces" :render-header="renderHeader" label="Ordered Pieces"
                            min-width="120">
                            <template v-slot="scope">
                              {{ scope.row.tcQty * scope.row.tcSize }}
                            </template>
                          </el-table-column>
                          <el-table-column prop="cbm" :render-header="renderHeader" label="Ordered Volume/(cbm)"
                            min-width="120">
                            <template v-slot="scope">
                              {{ scope.row.cbm }}
                            </template>
                          </el-table-column>
                          <el-table-column prop="booked" :render-header="renderHeader" label="Booked Outer/(Cartons)"
                            min-width="130">
                            <template v-slot="scope">
                              <span v-if="scope.row.booked != 0">{{ scope.row.booked }}</span>
                              <span v-else></span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="bookedInner" :render-header="renderHeader"
                            label="Booked Inner/(Cartons)" min-width="130">
                            <template v-slot="scope">
                              <span v-if="scope.row.booked != 0">{{
                                scope.row.bookedProInnerPerOuter == 0 ? '-' : scope.row.bookedInner }}</span>
                              <span v-else></span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="bookedPieces" :render-header="renderHeader" label="Booked Pieces"
                            min-width="120">
                            <template v-slot="scope">
                              <span v-if="scope.row.booked != 0">{{ scope.row.bookedPieces }}</span>
                              <span v-else></span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="outerSize" :render-header="renderHeader" label="Outer Size L*W*H/(CM)"
                            min-width="120">
                            <template v-slot="scope">
                              <span v-if="scope.row.length && scope.row.width && scope.row.height">
                                {{ scope.row.length + '*' + scope.row.width + '*' + scope.row.height }}
                              </span>
                              <span v-else></span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="bookedVolume" :render-header="renderHeader" label="Booked Volume/(cbm)"
                            min-width="120">
                            <template v-slot="scope">
                              <span v-if="scope.row.booked != 0">{{
                                (scope.row.length * scope.row.width * scope.row.height *
                                  scope.row.booked / 1000000).toFixed(1)
                              }}</span>
                              <span v-else></span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="outerWeight" :render-header="renderHeader" label="Gross Weight/(kg)"
                            min-width="120">
                            <template v-slot="scope">
                              <span v-if="scope.row.booked != 0">{{ (scope.row.outerWeight * scope.row.booked).toFixed(1) }}</span>
                              <span v-else></span>
                            </template>
                          </el-table-column>

                        </el-table>
                        <br />
                      </el-tab-pane>
                      <el-tab-pane label="General Information" :name="'first1-1' + props.row.id">
                        <el-descriptions v-for="item in props.row.items" :key="item" direction="vertical"
                          class="margin-top" title="" style="box-shadow: none;width:1000px" :column="4" size="mini"
                          border>
                          <el-descriptions-item label="ItemNo.">{{
                            productMap[item.productId] ? productMap[item.productId].code : ''
                          }}</el-descriptions-item>
                          <el-descriptions-item label="Item Name">{{
                            productMap[item.productId] ? productMap[item.productId].chineseName : ''
                          }}</el-descriptions-item>

                          <el-descriptions-item label="Merch code">{{ item.merchCode
                          }}</el-descriptions-item>
                          <el-descriptions-item label="Art Structure">{{ item.artStructure
                          }}</el-descriptions-item>
                          <el-descriptions-item label="PO Tag">
                            <template v-if="getPoTags(item).length">
                                <el-tag
                                  v-for="tag in getPoTags(item)"
                                  :key="tag.code"
                                  :class="tag.className"
                                  :type="tag.type"
                                  size="small"
                                  class="mr-4"
                                >
                                  {{ tag.label }}
                                </el-tag>
                              </template>
                              <span v-else>-</span>
                          </el-descriptions-item>
                          <el-descriptions-item label="Promo Code">{{ item.promoCode ? item.promoCode : '-'
                          }}</el-descriptions-item>
                        </el-descriptions>

                        <br />
                      </el-tab-pane>
                      <el-tab-pane label="Location" :name="'first3' + props.row.id">
                        <el-descriptions direction="vertical" class="margin-top" title=""
                          style="box-shadow: none;width:1250px" :column="8" size="mini" border>
                          <!--第一行-->
                          <el-descriptions-item label="Origin Country (PO)" style="white-space: nowrap;">{{ props.row.originLocation
                          }}</el-descriptions-item>
                          <el-descriptions-item label="Origin Port (PO)">{{ props.row.originPort }}</el-descriptions-item>
                          <el-descriptions-item label="Destination Port (PO)">{{ props.row.destinationPort
                          }}</el-descriptions-item>
                          <el-descriptions-item label="Requested Booking Date">{{ parseUTCTime(props.row.latestBookingDate)
                          }}</el-descriptions-item>
                          <el-descriptions-item label="Handover Date">{{
                            parseUTCTime(props.row.cargoHandoverDate)
                          }}</el-descriptions-item>
                          <el-descriptions-item label="AHOD">{{
                              showAHOD(props.row)
                            }}</el-descriptions-item>
                          <!-- <el-descriptions-item label="Delivery Terms">{{ props.row.deliveryTerms }}</el-descriptions-item> -->
                          <!--add incoterm and transport mode edwn-->
                          <el-descriptions-item label="Incoterm">{{ incotermLabel(props.row.incoterm) }}</el-descriptions-item>
                          <el-descriptions-item label="Named Place">{{ namedPlaceLabel(props.row.namedPlace) }}</el-descriptions-item>
                          <el-descriptions-item label="Transport Mode">{{ freightMethodLabel(props.row.freightMethod) }}</el-descriptions-item>

                          <!--第二行-->
                          <el-descriptions-item label="Origin Location (Booked)">
                            {{
                              props.row.shipmentResList.length > 0 ?
                                props.row.shipmentResList[props.row.shipmentResList.length - 1].pol : '' }}</el-descriptions-item>
                          <el-descriptions-item label="Origin Port (Booked)">{{
                            props.row.shipmentResList.length > 0 ?
                              props.row.shipmentResList[props.row.shipmentResList.length - 1].originPort : ''
                          }}</el-descriptions-item>
                          <el-descriptions-item label="Destination Port (Booked)">{{
                            props.row.shipmentResList.length > 0 ?
                             props.row.shipmentResList[props.row.shipmentResList.length -
                                1].destinationPort : ''
                          }}</el-descriptions-item>
                          <el-descriptions-item label="Destination Location (Booked)">{{
                            props.row.shipmentResList.length > 0 ?
                              props.row.shipmentResList[props.row.shipmentResList.length -
                                1].pod : ''
                          }}</el-descriptions-item>
                          <el-descriptions-item label="Destination DC">{{ props.row.dc
                          }}</el-descriptions-item>

                        </el-descriptions>
                        <br />
                      </el-tab-pane>
                      <el-tab-pane label="Parties" :name="'first2' + props.row.id">
                        <el-table :data="[{}]" border style="width:600px">
                          <el-table-column prop="oha" label="Origin Handling Agent (OHA)">
                            <template v-slot="scope">
                              {{ partyMap[props.row.oha] }}
                            </template>
                          </el-table-column>
                          <!-- <el-table-column prop="buyer" label="Buyer">
                            <template v-slot="scope">
                              {{partyMap[props.row.buyer] }}
                            </template>
                          </el-table-column> -->
                          <el-table-column prop="seller" label="Supplier Name">
                            <template v-slot="scope">
                              {{ partyMap[props.row.seller] }}
                            </template>
                          </el-table-column>
                          <el-table-column prop="seller" label="Supplier ID">
                            <template v-slot="scope">
                              {{ partyMap[props.row.seller + 'code'] }}
                            </template>
                          </el-table-column>
                          <el-table-column prop="seller" label="Supplier Type">
                            <template v-slot="scope">
                              {{ partyMap[props.row.seller + 'type'] }}
                            </template>
                          </el-table-column>



                        </el-table>
                        <br />
                      </el-tab-pane>
                      <el-tab-pane v-if="checkPermi(['order:tab:show'])" label="Carrier Booking"
                        :name="'second' + props.row.id">
                        <el-empty v-if="props.row.shipmentResList.length == 0"></el-empty>
                        <el-descriptions title="" direction="vertical" :column="8" border
                          style="margin-top: 0px;margin-bottom: 10px;box-shadow: none!important; width: calc(100% - 100px);"
                          v-for="row in props.row.shipmentResList.length > 0 ? [props.row.shipmentResList[props.row.shipmentResList.length - 1]] : []"
                          :key="'item' + row.id">
                          <el-descriptions-item label="Shipment Ref">
                            <!-- <el-link type="primary" :href="'/shipment/detail?id=' + row.id" target="_blank">
                              {{ row.bookingNumber }}
                            </el-link> -->
                            {{ row.bookingNumber }}
                          </el-descriptions-item>
                          <el-descriptions-item label="Booking Number">
                            <!--暂时注释掉，不跳转链接-->
                            <!-- <el-link type="primary" target="_blank"
                              :href="'/shipment/ShipmentTracking?type=bookingNumber&searchKey=' + row.shipmentBookingNumber">{{
                                row.shipmentBookingNumber }}</el-link> -->
                            {{row.shipmentBookingNumber }}
                          </el-descriptions-item>
                          <el-descriptions-item label="BL Number">
                            {{ row.blNumber }}
                          </el-descriptions-item>

                          <el-descriptions-item label="Shipped together with">
                            <!--先注释掉, 不跳转链接-->
                            <!-- <el-link type="primary" @click="toOrder(lot)" style="margin-right: 10px;"
                              v-for="lot in row.orderNumbers.filter((item) => props.row.orderNumber != item)">
                              <span> {{ lot }}</span>
                            </el-link> -->
                          <span :key="index" style="margin-right: 10px;" v-for="(lot, index) in row.orderNumbers.filter((item) => props.row.orderNumber != item)">
                            {{ lot }}
                          </span>
                          </el-descriptions-item>
                          <el-descriptions-item label="Carrier">
                            {{ row.carrier }}
                          </el-descriptions-item>
                          <el-descriptions-item label="Vessel/Voyage">
                            <!-- <el-link type="primary" @click="toTack(row.routerDOList[0].imo)">
                              {{ row.routerDOList[0].transportMeanName }}/{{ row.routerDOList[0].voyage }}
                            </el-link> -->
                            {{ row.routerDOList[0].transportMeanName? row.routerDOList[0].transportMeanName:'-' }}/{{ row.routerDOList[0].voyage }}
                          </el-descriptions-item>

                          <el-descriptions-item label="Contract Number">
                            {{ row.contractNumber }}
                          </el-descriptions-item>
                          <el-descriptions-item label="Shipped TEU">
                            {{getshippedTue(row.containerDOList.filter((item) => item.type == 0))}}
                          </el-descriptions-item>
                          <el-descriptions-item label="Week">
                            <el-link v-if="row.carrier == 'MAEU'" type="primary" target="_blank"
                              @click="toAllocation(order, 2)">
                              {{ row.etdAllocation }}
                            </el-link>
                            <p v-else> {{ row.etdAllocation }} </p>
                          </el-descriptions-item>

                          <el-descriptions-item label="Booked ETD">
                            {{ parseUTCTime(row.bookedEtd) }}
                          </el-descriptions-item>
                          <el-descriptions-item label="Booked ETA">
                            {{ parseUTCTime(row.bookedEta) }}
                          </el-descriptions-item>
                          <el-descriptions-item label="ATD">
                            {{ parseUTCTime(row.atd) }}
                          </el-descriptions-item>
                          <el-descriptions-item label="ATA">
                            {{ parseUTCTime(row.ata) }}
                          </el-descriptions-item>
                          <el-descriptions-item label="Containers">
                            <span style="float: left;"
                              v-for="container in row.containerDOList.filter((item) => item.type == 0)">
                              <span style="margin-right: 5px;">{{ container.containerType }} *{{ container.numbers
                              }}</span>
                            </span>
                          </el-descriptions-item>

                          <el-descriptions-item label="Shipped Containers">
                            <span v-for="container in row.containerDOList.filter((item) => item.type == 1)">
                              <!-- <el-link style="margin-right: 10px;" type="primary" target="_blank"
                                :href="'/shipment/ShipmentTracking?type=containerNo&searchKey=' + container.containerNo">
                                <span style="margin-right: 5px;"> {{ container.containerNo }}: {{
                                  container.containerType }} </span>
                              </el-link> -->
                              <span style="margin-right: 5px;"> {{ container.containerNo }}: {{ container.containerType }} </span>
                              </span>
                          </el-descriptions-item>

                          <el-descriptions-item label="Transport Status">
                            <el-tag type="primary" style="float: left;">
                              {{ showStatus(row) }}
                            </el-tag>
                          </el-descriptions-item>

                        </el-descriptions>

                      </el-tab-pane>
                      <el-tab-pane v-if="!hiddenTask" label="Milestones" :name="'third' + props.row.id">
                        <div>
                        <div style="padding-top: 20px;min-width: 640px;max-width: 1000px;
              margin: 0 auto;text-align: center;box-shadow: none;">
                          <div v-for="task in props.row.orderTaskDOS" :Key="'task' + task.id" class="self-step3"
                            style="margin-right: 20px;position: relative;float: left;height: 80px; "
                            :class="[task.status == 1 ? 'self-step-process1' : ''
                              , task.status == 2 ? 'self-step-finished1' : ''
                              , task.status == 0 ? 'self-step-pedding1' : '']">
                            <p>
                              <!-- <span class="self-step2" :class="[task.status == 1 ? 'self-step-process' : ''
                                , task.status == 2 ? 'self-step-finished' : ''
                                , task.status == 0 ? 'self-step-pedding' : '']">{{ task.seq }}</span> -->
                                <span class="self-step2" :class="[task.status == 1 ? 'self-step-process' : ''
                                , task.status == 2 ? 'self-step-finished' : ''
                                , task.status == 0 ? 'self-step-pedding' : '']"></span>
                            <p style="display: inline-block;
                                    width: 130px;
                                    padding-top: 8px;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;">
                              <el-popover placement="top-start" trigger="hover">
                                <p>
                                  {{ task.taskName === 'Container Loading Plan' ? 'Container Loading Result' : task.taskName }}
                                </p>
                                <span slot="reference" class="title" style="font-size: 12px; "> {{ task.taskName === 'Container Loading Plan' ? 'Container Loading Result' : task.taskName }} </span>
                              </el-popover>
                            </p>
                            <p>
                              {{ task.status == 2 ? formatUserLocalTime(task.finishedTime!=null?task.finishedTime:task.updateTime, task.timeZone, task.timeZoneOffset) : '' }}
                            </p>
                            </p>
                          </div>
                          <div style="clear:both"></div>
                        </div>
                        </div>
                      </el-tab-pane>
                      <el-tab-pane label="Documents" :name="'fourth' + props.row.id">
                        <view-po-management-documents ref="viewPoManagementDocuments" ></view-po-management-documents>

                      </el-tab-pane>
                      <!-- <el-tab-pane v-if="checkPermi(['order:tab:show'])" label="Shipment History"
                        :name="'second2' + props.row.id">

                        <el-empty
                          v-if="props.row.shipmentResList.slice(0, props.row.shipmentResList.length - 1).length == 0"></el-empty>
                        <br
                          v-if="props.row.shipmentResList.slice(0, props.row.shipmentResList.length - 1).length == 0" />
                        <el-descriptions title="" direction="vertical" :column="8" border
                          style="margin-top: 0px;margin-bottom: 10px;box-shadow: none!important; width: calc(100% - 100px);"
                          v-for="row in props.row.shipmentResList.slice(0, props.row.shipmentResList.length - 1)"
                          :key="'item' + row.id">
                          <el-descriptions-item label="Shipment Ref">
                            <el-link type="primary" :href="'/shipment/detail?id=' + row.id" target="_blank">
                              {{ row.bookingNumber }}
                            </el-link>
                          </el-descriptions-item>
                          <el-descriptions-item label="Booking Number">
                            <el-link type="primary" target="_blank"
                              :href="'/shipment/ShipmentTracking?type=bookingNumber&searchKey=' + row.shipmentBookingNumber">{{
                                row.shipmentBookingNumber }}</el-link>
                          </el-descriptions-item>
                          <el-descriptions-item label="BL Number">
                            {{ row.blNumber }}
                          </el-descriptions-item>

                          <el-descriptions-item label="Shipped together with">
                            <el-link type="primary" @click="toOrder(lot)" style="margin-right: 10px;"
                              v-for="lot in row.orderNumbers.filter((item) => props.row.orderNumber != item)">
                              <span> {{ lot }}</span>
                            </el-link>
                          </el-descriptions-item>
                          <el-descriptions-item label="Carrier">
                            {{ row.carrier }}
                          </el-descriptions-item>
                          <el-descriptions-item label="Vessel/Voyage">
                            <el-link type="primary" @click="toTack(row.routerDOList[0].imo)">
                              {{ row.routerDOList[0].transportMeanName }}/{{ row.routerDOList[0].voyage }}
                            </el-link>
                          </el-descriptions-item>

                          <el-descriptions-item label="Contract Number">
                            {{ row.contractNumber }}
                          </el-descriptions-item>
                          <el-descriptions-item label="Shipped Tue">
                            {{getshippedTue(row.containerDOList.filter((item) => item.type == 0))}}
                          </el-descriptions-item>
                          <el-descriptions-item label="Week">
                            <el-link v-if="row.carrier == 'MAEU'" type="primary" target="_blank"
                              @click="toAllocation(order, 2)">
                              {{ row.etdAllocation }}
                            </el-link>
                            <p v-else> {{ row.etdAllocation }} </p>
                          </el-descriptions-item>

                          <el-descriptions-item label="Booked ETD">
                            {{ parseTime(row.bookedEtd) }}
                          </el-descriptions-item>
                          <el-descriptions-item label="Booked ETA">
                            {{ parseTime(row.bookedEta) }}
                          </el-descriptions-item>
                          <el-descriptions-item label="ATD">
                            {{ parseTime(row.atd) }}
                          </el-descriptions-item>
                          <el-descriptions-item label="ATA">
                            {{ parseTime(row.ata) }}
                          </el-descriptions-item>
                          <el-descriptions-item label="Containers">
                            <span style="float: left;"
                              v-for="container in row.containerDOList.filter((item) => item.type == 0)">
                              <span style="margin-right: 5px;">{{ container.containerType }} *{{ container.numbers
                              }}</span>
                            </span>
                          </el-descriptions-item>

                          <el-descriptions-item label="Shipped Containers">
                            <span v-for="container in row.containerDOList.filter((item) => item.type == 1)">
                              <el-link style="margin-right: 10px;" type="primary" target="_blank"
                                :href="'/shipment/ShipmentTracking?type=containerNo&searchKey=' + container.containerNo">
                                <span style="margin-right: 5px;"> {{ container.containerNo }}: {{
                                  container.containerType }} </span>
                              </el-link>
                            </span>
                          </el-descriptions-item>

                          <el-descriptions-item label="Tranport Status">
                            <el-tag type="primary" style="float: left;">
                              {{ showStatus(row) }}
                            </el-tag>
                          </el-descriptions-item>

                        </el-descriptions>
                      </el-tab-pane>
                      -->
                      <el-tab-pane v-if="checkPermi(['order:tab:show'])" label="Transport Plan History"
                        :name="'second3' + props.row.id" style="width: 95%">
                        <el-empty v-if="props.row.bookingPreAssignResList.length == 0"></el-empty>
                        <el-table v-if="props.row.bookingPreAssignResList.length > 0" border :data="props.row.bookingPreAssignResList"
                              style="width: 100%">
                              <el-table-column prop="time" label="Create Time" min-width="150px">
                                <template slot-scope="scope">{{ formatUserLocalTime(scope.row.createTime, scope.row.timeZone, scope.row.timeZoneOffset) }}</template>
                              </el-table-column>

                              <el-table-column prop="event" label="Event" width="100px">
                                <template slot-scope="scope">{{ (scope.row.type == null|| scope.row.type == '') ? (scope.row.status ==
                                  'transportassigned'?'Carrier Booking':'Pre - assign'):scope.row.type }}</template>
                              </el-table-column>
                              <el-table-column prop="status" label="Status" width="80px">
                                <template slot-scope="scope">{{ getPreAssignStatus(scope.row.type, scope.row.status)
                                  }}</template>
                              </el-table-column>
                              <el-table-column prop="carrier" label="Carrier" width="55px"></el-table-column>
                              <el-table-column prop="por" label="POR" width="55px"></el-table-column>
                              <el-table-column prop="pol" label="POL" width="55px"></el-table-column>
                              <el-table-column prop="pod" label="POD" width="55px"></el-table-column>
                              <el-table-column prop="fnd" label="FND" width="55px"></el-table-column>
                              <el-table-column prop="vessel" label="Vessel"></el-table-column>
                              <el-table-column prop="voyage" label="Voyage"></el-table-column>

                              <el-table-column prop="eta" label="ETD/ETA" width="150px">
                                <template slot-scope="scope">{{ (scope.row.etd ? parseUTCTime(scope.row.etd) : '-') + ' / '+(scope.row.eta?parseUTCTime(scope.row.eta):' - ') }}</template>
                              </el-table-column>
                              <el-table-column prop="etd" label="Booked ETD/ETA" width="150px">
                                <template slot-scope="scope">{{
                                  (scope.row.bookedEtd ? parseUTCTime(scope.row.bookedEtd) : '-') + ' / '+(scope.row.bookedEta?parseUTCTime(scope.row.bookedEta):' - ') }}</template>
                              </el-table-column>
                              <!-- <el-table-column prop="reason" label="Revoke Reason" width="120px">
                                <template slot-scope="scope">
                                  <el-popover placement="bottom" width="400" trigger="hover">
                                    <el-descriptions :column="1" style="box-shadow: none; border: none;">
                                      <el-descriptions-item label="Cancel Category">
                                        {{
                                        selCancelCategory1.filter(item => item.enumId == scope.row.rejectReason).length
                                        > 0 ? selCancelCategory1.filter(item =>
                                        item.enumId == scope.row.rejectReason)[0].description : scope.row.rejectReason
                                        }}
                                      </el-descriptions-item>
                                      <el-descriptions-item label="Cancel Reason">
                                        {{
                                        selCancelReason1.filter(item => item.enumId == scope.row.rejectReason1).length >
                                        0 ? selCancelReason1.filter(item =>
                                        item.enumId ==
                                        scope.row.rejectReason1)[0].description : scope.row.rejectReason1
                                        }}
                                      </el-descriptions-item>
                                      <el-descriptions-item label="Cancel Remark">{{ scope.row.rejectComments
                                        }}</el-descriptions-item>
                                    </el-descriptions>
                                    <el-button v-show="scope.row.rejectReason1 != null" slot="reference"
                                      style="margin: 0;padding: 0;" type="text">
                                      <el-tag>View Reason</el-tag>
                                    </el-button>
                                  </el-popover>
                                  <span v-hasPermi="['booking:reason:edit']" v-show="scope.row.rejectReason1 != null"
                                    @click="editReason(scope.row)">
                                    <i class="el-icon-edit" />
                                  </span>
                                </template>
                              </el-table-column> -->
                              <el-table-column prop="pbNumber" label="Shipping Number" width="150px">
                                </el-table-column>

                              <!-- <el-table-column prop="shipmentNumber" label="Carrier Booking Number" width="150px"> -->
                                <!-- <template slot-scope="scope">
                                  <el-link type="primary" :href="'/shipment/detail?id=' + scope.row.shipmentId"
                                    target="_blank">{{ scope.row.shipmentNumber }}</el-link>
                                </template> -->
                              <!-- </el-table-column> -->
                              <!-- <el-table-column prop="user" label="Update User"  min-width="130px">
                                <template slot-scope="scope">{{ getUserName(scope.row.creator) }}</template>
                              </el-table-column> -->
                            </el-table>
                        <!-- <el-descriptions style="margin: 10px;padding: 15px!important;"
                          v-for="item in props.row.bookingPreAssignResList" :column="5">
                          <el-descriptions-item label="POR">{{ item.por }}</el-descriptions-item>
                          <el-descriptions-item label="FND">{{ item.fnd }}</el-descriptions-item>
                          <el-descriptions-item label="POL">{{ item.pol }}</el-descriptions-item>
                          <el-descriptions-item label="POD">{{ item.pod }}</el-descriptions-item>
                          <el-descriptions-item label="vessel">{{ item.vessel }}</el-descriptions-item>
                          <el-descriptions-item label="voyage">{{ item.voyage }}</el-descriptions-item>
                          <el-descriptions-item label="ETD">{{ parseTime(item.etd) }}</el-descriptions-item>
                          <el-descriptions-item label="ETA">{{ parseTime(item.eta) }}</el-descriptions-item>
                        </el-descriptions> -->
                        <br />
                      </el-tab-pane>
                      <el-tab-pane label="Change Log" :name="'second4' + props.row.id">
                        <el-empty v-if="props.row.logStatusResList.length == 0"></el-empty>
                        <div style="max-height: 150px; overflow-y: auto;">
                          <el-timeline>
                            <el-timeline-item v-for="(o, index) in props.row.logStatusResList.slice().reverse()"
                              :key="index" :timestamp=formatUserLocalTime(o.createTime,o.timeZone,o.timeZoneOffset)>
                              {{ o.logInfo }}
                            </el-timeline-item>
                          </el-timeline>
                        </div>
                        <br />
                      </el-tab-pane>
                      <el-tab-pane label="Comments" :name="'Comments' + props.row.id">
                        <order-comment :order-id="props.row.id" :order-number="props.row.orderNumber"></order-comment>
                      </el-tab-pane>
                      <el-tab-pane label="Cargo Ready Date" :name="'cargoReadyDate' + props.row.id">
                        <cargo-ready-date-tab :orderId="props.row.id" />
                      </el-tab-pane>
                      <el-tab-pane label="Actual Handover Date" :name="'aHod' + props.row.id">
                        <cargo-inbound-tab :orderId="props.row.id" />
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable="custom" label="Order Number" min-width="130" prop="orderNumber">
                <template v-slot="scope">
                  <span style="color:#000;font-weight: 900;">{{ scope.row.orderNumber }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="Supplier Code" min-width="100" prop="seller">
                <template v-slot="scope">
                  <span>{{ partyMap[scope.row.seller + 'id'] }}</span>
                </template>
              </el-table-column> -->
              <el-table-column label="Supplier Name" min-width="200" prop="seller" show-overflow-tooltip>
                <template v-slot="scope">
                  <bsc-supplier-text :supplierId="scope.row.seller"/>
                  <!-- <span>{{ partyMap[scope.row.seller] }}</span> -->
                </template>
              </el-table-column>
              <el-table-column v-if="!hiddenTask" label="Pending Status" width="200" prop="status">
                <template v-slot="scope">
                  <!--将整个scope.row传进去，获取信息 edwin-->
                  <span v-show="scope.row.status == '0'" @click="showTask(scope.row, scope.$index)" style="text-decoration: underline;cursor: pointer;">
                    <!-- {{ scope.row.taskStatus }} -->
                    {{ scope.row.taskStatus === 'Container Loading Plan' ? 'Container Loading Result' : scope.row.taskStatusSeq > 20 ? 'Destination In Process': scope.row.taskStatus
}}                  </span>
<i  v-hasPermi="['pepco:order:delete']"  v-show="scope.row.status == '0'" @click="cancelPO(scope.row)" style="cursor: pointer;" class="el-icon-delete"></i>
                  <span v-show="scope.row.status == '1'" style="cursor: pointer;color: red;">
                    {{ 'Canceled' }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column v-if="!hiddenTask" label="Process" width="150" prop="bookedLines">
                <template v-slot="scope">
                  <el-progress :stroke-width="13"
                    :percentage="(scope.row.orderTaskDOS == null || scope.row.orderTaskDOS.length == 0) ? '0' : parseInt(scope.row.orderTaskDOS.filter(item => item.status == 2).length / scope.row.orderTaskDOS.length * 100)">
                  </el-progress>
                  <span style="position: absolute;top: 3px; left: 35px; color: white;">
                    {{scope.row.orderTaskDOS.filter(item => item.status == 2).length}}/{{ scope.row.orderTaskDOS.length
                    }}
                  </span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="Booked Items" width="150" prop="bookedLines">
                <template v-slot="scope">
                  <el-progress :stroke-width="13" :percentage=" parseInt(scope.row.bookedLines/scope.row.orderedLines*100) ">
                  </el-progress>
                  <span style="position: absolute;  top: 3px;  left: 40px;color: white;">
                    {{ scope.row.bookedLines ? scope.row.bookedLines : 0 }}/{{  scope.row.orderedLines ? scope.row.orderedLines : 0 }}
                  </span>
                </template>
              </el-table-column> -->
              <!--隐藏该列 edwin-->
              <!-- <el-table-column label="Inspection Status" width="140" prop="qcApproveResult">
                <template v-slot="scope">
                  <div style="width:140px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
                    :title="scope.row.qcApproveResult">{{ scope.row.qcApproveResult }}</div>
                </template>
              </el-table-column> -->
              <el-table-column sortable="custom" label="HOD" min-width="110" prop="cargoHandoverDate">
                <template v-slot="scope">
                  {{ parseUTCTime(scope.row.cargoHandoverDate) }}
                </template>
              </el-table-column>
              <el-table-column sortable="custom" label="Planned CRD" min-width="110" prop="cargoHandoverDate">
                <template v-slot="scope">
                  {{ parseUTCTime(scope.row.cargoHandoverDate - (7 * 24 * 60 * 60 * 1000)) }}
                </template>
              </el-table-column>
              <el-table-column sortable="custom" label="Supplier CRD" min-width="110" prop="cargoReadyDate">
                <template v-slot="scope">
                  <span>
                    {{ scope.row.cargoReadyDate == null ? '' : parseUTCTime(scope.row.cargoReadyDate) }}
                    <i v-show="(scope.row.milestones || []).find(item => item.taskCode === 'Pepco_Booking_Approval')?.status == 0 && user.deptId == (scope.row.milestones || []).find(item => item.taskName === 'Cargo Ready Date')?.partyId" @click="updateCRD(scope.row)" style="cursor: pointer;" class="el-icon-edit"></i>
                    <i v-show="(scope.row.milestones || []).find(item => item.taskCode === 'Pepco_Booking_Approval')?.status != 0 && user.deptId == (scope.row.milestones || []).find(item => item.taskName === 'Cargo Ready Date')?.partyId && (scope.row.milestones || []).find(item => item.taskCode === 'Container_Loading_Plan')?.status != 2" @click="amendCRD(scope.row)" style="cursor: pointer;" class="el-icon-tickets"></i>
                  </span>
                </template>
              </el-table-column>
              <el-table-column sortable="custom" label="AHOD" min-width="110" prop="actualCargoHandoverDate">
                <template v-slot="scope">
                  {{showAHOD(scope.row)}}
                </template>
              </el-table-column>
              <el-table-column sortable="custom" label="In-DC Date" min-width="110" prop="deliveryDate">
                <template v-slot="scope">
                  {{ parseUTCTime(scope.row.deliveryDate) }}
                </template>
              </el-table-column>
              <!-- 更换为 在po tag中显示 -->
              <!-- <el-table-column label="Sanitary Risk" min-width="110" prop="sanitaryRisk" align="center">
                <template v-slot="scope">
                  <span :style="{ color: scope.row.sanitaryRisk ? 'red' : 'green' }">
                    {{ scope.row.sanitaryRisk ? 'Y' : 'N' }}
                  </span>
                </template>
              </el-table-column> -->
              <el-table-column sortable="custom" label="Booking Date" min-width="110" prop="lastBookingTime">
                <template v-slot="scope">
                  {{ parseUTCTime(scope.row.lastBookingTime) }}
                </template>
              </el-table-column>

            <!-- 2025/05/13暂时隐藏Target ETA -->
              <!-- <el-table-column  label="Target ETA" width="160" >
                <template v-slot="scope">
                  {{parseTime(scope.row.deliveryDate - (21 * 24 * 60 * 60 * 1000)) + ` to ` +  parseTime(scope.row.deliveryDate - (14 * 24 * 60 * 60 * 1000))}}
                </template>
              </el-table-column> -->

              <!-- <el-table-column label="Contractual Week" width="110" prop="etd">
                <template v-slot="scope">
                  {{ scope.row.fobWeekOwim }}
                </template>
              </el-table-column> -->
              <!-- <el-table-column  label="Booked ETD original" min-width="100" prop="etd">
                当cargoHandoverDate is not null, then show (cargoHandoverDate -7)(Planned CRD) + 14 days edwin
                <template v-slot="scope">
                  {{ scope.row.shipmentResList.length > 0 ?
                    parseUTCTime(scope.row.shipmentResList[scope.row.shipmentResList.length - 1].bookedEtd) : 'Not Booked'
                  }}
                </template>
              </el-table-column> -->
              <el-table-column sortable="custom" label="Booked ETD" min-width="100" prop="bookedEtd">
                <template v-slot="scope">
                  {{ scope.row.bookedEtd != null ?
                    parseUTCTime(scope.row.bookedEtd) : 'Not Booked'
                  }}
                </template>
              </el-table-column>

              <!-- <el-table-column  label="Booked ETA original" min-width="100" prop="etd">
                <template v-slot="scope">
                  {{
                    scope.row.shipmentResList.length > 0 ?
                    parseUTCTime(scope.row.shipmentResList[scope.row.shipmentResList.length - 1].bookedEta) : 'Not Booked'
                  }}
                </template>
              </el-table-column> -->
              <el-table-column sortable="custom" label="Booked ETA" min-width="100" prop="bookedEta">
                <template v-slot="scope">
                  {{ scope.row.bookedEta != null ?
                    parseUTCTime(scope.row.bookedEta) : 'Not Booked'
                  }}
                </template>
              </el-table-column>
              <el-table-column sortable="custom" label="ETD" min-width="100" prop="etd">
                <template v-slot="scope">
                  {{ scope.row.etd != null ?
                    parseUTCTime(scope.row.etd) : ''
                  }}
                </template>
              </el-table-column>
              <el-table-column sortable="custom" label="ETA" min-width="100" prop="eta">
                <template v-slot="scope">
                  {{ scope.row.eta != null ?
                    parseUTCTime(scope.row.eta) : ''
                  }}
                </template>
              </el-table-column>
              <el-table-column sortable="custom" label="ATD" min-width="100" prop="atd">
                <template v-slot="scope">
                  {{ scope.row.atd != null ?
                    parseUTCTime(scope.row.atd) : ''
                  }}
                </template>
              </el-table-column>
              <el-table-column sortable="custom" label="ATA" min-width="100" prop="ata">
                <template v-slot="scope">
                  {{ scope.row.ata != null ?
                    parseUTCTime(scope.row.ata) : ''
                  }}
                </template>
              </el-table-column>
                <el-table-column label="PO Tag" min-width="120" align="center">
                  <template slot-scope="scope">
                    <template v-if="getPoTags(scope.row).length">
                      <el-tag
                        v-for="tag in getPoTags(scope.row)"
                        :key="tag.code"
                        :type="tag.type"
                        :class="tag.className"
                        size="small"
                        class="mr-4"
                      >
                        {{ tag.label }}
                      </el-tag>
                    </template>
                    <span v-else>-</span>
                  </template>
                </el-table-column>



              <!-- <el-table-column label="ATD" min-width="100" prop="etd">
                <template v-slot="scope">
                  {{ scope.row.shipmentResList.length > 0 ?
                    scope.row.shipmentResList[scope.row.shipmentResList.length - 1].atd == null ? 'Pending Shipped' :
                    parseUTCTime(scope.row.shipmentResList[scope.row.shipmentResList.length - 1].atd) : 'Pending Shipped' }}
                </template>
              </el-table-column>
              <el-table-column label="ATA" min-width="100" prop="etd">
                <template v-slot="scope">
                  {{ scope.row.shipmentResList.length > 0 ?
                    scope.row.shipmentResList[scope.row.shipmentResList.length - 1].ata == null ? 'Pending Arrived' :
                    parseUTCTime(
                        scope.row.shipmentResList[scope.row.shipmentResList.length - 1].ata) : 'Pending Arrived' }}
                </template>
              </el-table-column> -->

            </el-table>

          </div>
          <div style="clear:both"></div>

          <pagination :total="total" layout="total, sizes, prev, pager, next, jumper" :page.sync="queryParams.pageNo"
            :limit.sync="queryParams.pageSize" :page-sizes="[20, 30, 50]" @pagination="changePage" />
        </div>
      </transition>

      <transition name="el-zoom-in-center">
        <el-form v-if="drawer2" :model="queryParams">
          <div>
            <div style="float: left;padding-top: 8px;"></div>

            <div style='float:left;padding: 10px 0px;'>
              <el-input placeholder="Order Number" v-model="queryParams.orderNumber"
                @input.native="queryParams.orderNumber = $event.target.value.trim()"
                @keyup.enter.native="triggerFilter" clearable @clear="triggerFilter">
                <!-- <el-button slot="append" @click=" queryParams.pageNo = 1, getList()" type="primary">Search<i
                    class="el-icon-search el-icon--right"></i></el-button> -->
              </el-input>
            </div>


                          <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                            <el-input placeholder="Container no.(CLR)" v-model="queryParams.containerNo"
                              @input.native="queryParams.containerNo = $event.target.value.trim()"
                              @keyup.enter.native="triggerFilter" clearable @clear="triggerFilter">
                            </el-input>
                          </div>
                          <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                            <el-select
                              placeholder="Merch Code"
                              @change="triggerFilter"
                              v-model="queryParams.merchCode"
                              clearable
                              filterable
                            >
                              <el-option
                                v-for="item in merchCodeOptions"
                                :key="item"
                                :label="item"
                                :value="item">
                              </el-option>
                            </el-select>
                          </div>
                          <!-- <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                              <el-button slot="append" @click=" queryParams.pageNo = 1, getList()" type="primary"
                                                            style="background-color: white; color: black; border-color: #dcdfe6;"
                              >Search<i
                                  class="el-icon-search el-icon--right"></i></el-button>
                          </div> -->


            <div style='float:left;margin-left: 5px;padding: 10px 0px;'>

              <el-select @change="triggerFilter" clearable v-model="queryParams.taskStatus" filterable
                placeholder="Status">
                <el-option v-for="item in allTaskNames" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
              <el-select @change="triggerFilter" v-model="queryParams.booked" placeholder="Booked/Not Booked" clearable filterable >
                <el-option label="All" :value="null"></el-option>
                <el-option label="Not booked" :value="false"></el-option>
                <el-option label="Booked" :value="true"></el-option>
              </el-select>
            </div>
            <!-- <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
              <el-select @change="queryParams.pageNo = 1, getList()" clearable v-model="queryParams.originPort" filterable
                placeholder="Origin Port">
                <el-option v-for="item in originPort" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </div>

            <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
              <el-select @change="queryParams.pageNo = 1, getList()" clearable v-model="queryParams.country" placeholder="Country" filterable >
                <el-option v-for="item in country" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </div>
            <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
              <el-select @change="queryParams.pageNo = 1, getList()" filterable clearable v-model="queryParams.supplierCode" placeholder="Supplier Name">
                  <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.supplierCode">
                  </el-option>
              </el-select>
            </div>
            <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
              <el-select @change="queryParams.pageNo = 1, getList()" clearable v-model="queryParams.dc" placeholder="DC" filterable>
                <el-option v-for="item in dc" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </div> -->

            <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                <el-popover v-model="filterPopover" placement="bottom" popper-class="popover-filter" title=" " width="400" trigger="click">
                  <el-form>
                    <el-row :gutter="10" style="margin-bottom: 15px;">
                      <el-col :span="12">
                        <!--  @change="queryParams.pageNo = 1, getList()"  -->
                        <el-select
                          clearable
                          v-model="queryParams.originPort"
                          filterable
                          multiple
                          placeholder="Origin Port"
                          collapse-tags
                        >
                          <el-option
                            v-for="item in originPort"
                            :key="item"
                            :label="item"
                            :value="item"
                          >
                          </el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="12">
                        <el-select multiple clearable v-model="queryParams.countryList" placeholder="Origin Country" filterable>
                          <el-option v-for="item in country" :key="item" :label="item" :value="item">
                          </el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10" style="margin-bottom: 15px;">
                      <el-col :span="12">
                        <el-select filterable clearable v-model="queryParams.supplierCode" placeholder="Supplier Name">
                          <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.supplierCode">
                          </el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="12">
                        <el-select multiple clearable v-model="queryParams.dcList" placeholder="DC" filterable>
<!--                          <el-option v-for="item in dc" :key="item" :label="item" :value="item">-->
<!--                          </el-option>-->
                          <el-option v-for="item in dcDataList" :key="item.id" :label="item.dcCode + ' - ' + item.dcName" :value="item.dcCode"></el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10" style="margin-bottom: 15px;">
                      <el-col :span="12">
                        <el-select filterable clearable v-model="queryParams.shipmentType" placeholder="SO Type">
                          <el-option v-for="item in this.getDictDatas(DICT_TYPE.SHIPMENT_TYPE)" :key="item.value" :label="item.label" :value="item.value">
                          </el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="12">
                        <el-select clearable v-model="queryParams.transportMode" :placeholder="$t('booking.transportMode')" filterable>
                          <el-option v-for="dict in getDictDatas(DICT_TYPE.MODE_OF_TRANSPORT_PEPCO)" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10" style="margin-bottom: 15px;">
                      <el-col :span="24">
                        <el-date-picker v-model="queryParams.hodDateRange" clearable type="daterange" range-separator="-"
                                        start-placeholder="HOD from"
                                        end-placeholder="HOD to"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        >
                        </el-date-picker>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10" style="margin-bottom: 15px;">
                      <!-- <el-col :span="12">
                        <el-select filterable clearable v-model="queryParams.supplierType" placeholder="Supplier Type">
                          <el-option v-for="item in supplierTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-col> -->
                      <el-col :span="12">
                        <el-select
                          v-model="queryParams.poTags"
                          placeholder="PO Tag"
                          multiple
                          filterable
                          clearable
                          collapse-tags
                          style="width: 100%"
                        >
                          <el-option
                            v-for="tag in poTagOptions"
                            :key="tag.code"
                            :label="tag.label"
                            :value="tag.code"
                          >
                            <el-tag :type="tag.type" :class="tag.className" size="small" style="margin-right: 8px;">
                              {{ tag.label }}
                            </el-tag>
                          </el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10" style="margin-bottom: 15px;">
                      <el-col :span="24">
                        <el-date-picker v-model="queryParams.etdDateRange" clearable type="daterange" range-separator="-"
                            start-placeholder="ETD from"
                            end-placeholder="ETD to"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="margin-bottom: 15px;">
                    </el-date-picker>
                      </el-col>
                    </el-row>
                    <!-- <el-row :gutter="20" style="margin-bottom: 15px;">
                        <el-col style="text-align: right">
                          <el-button @click="triggerFilter" style="background-color: #004F7C; color: white;" icon="el-icon-search" plain> Search </el-button>
                        </el-col>
                    </el-row> -->
                  </el-form>
                  <el-button slot="reference" icon="el-icon-plus" plain :style="{color:hasFilter?'#004F7C':''}">Filter</el-button>
                </el-popover>
              <el-button style="margin-left: 5px;" @click="clearFilters" plain> Clear Filters </el-button>
              </div>
              <div style="clear: both;"></div>
            </div>


          <div v-loading="taskLoading" v-show="drawer2" class="transition-box" style="padding-top: 30px;" :style="{ 'height': (tableHeight) + 'px' }">
            <el-row :gutter="20" style="padding-top:0px">
              <el-col :span="12" v-if="filteredTask1.length > 0">
                <el-card style="margin-bottom:20px;box-shadow:none !important; width: 800px" class="box-card"
                  v-if="task1.length > 0">
                  <div slot="header" class="clearfix">
                    <span>origin</span>
                    <!-- <span>Origin  <span style="padding: 0px 20px;">Last Update Time:<span style="color: #004F7C;"> {{originDataUpdateTime}}</span></span></span>
                    <i style="cursor: pointer;" class="el-icon-refresh" @click="getTaskNames('cacheFlag')"></i> -->
                  </div>
                  <div style="padding: 20px 0px 20px 0;margin-left:-20px;">
                    <el-table border :data="filteredTask1" style="width: 100%">
                      <el-table-column prop="taskName" label="Task Name" width="220">
                        <template slot-scope="scope">
                          {{ scope.row.taskName === 'Container Loading Plan' ? 'Container Loading Result' : scope.row.taskName }}
                          <overview-tip-popover :task-name="scope.row.taskName" :taskTipInfoMap="taskTipInfoMap"/>
                        </template>
                      </el-table-column>
                      <el-table-column prop="partyRole" label="Party Role" min-width="80">
                        <template slot-scope="scope">
                          {{ getPartyRole(scope.row.taskName) }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="possible" align="center" label="Possible" min-width="100">
                        <template slot="header" slot-scope="scope">
                          <span class="title" style="color: #2d86ba; background-color:#ceecfd;">Possible</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #2d86ba;" class="numberOftask"  @click="taskDetails(scope.row, 'possible')">{{ taskInfo[scope.row.taskName]?.['Possible'] || 0 }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="urgent" align="center" label="Urgent" min-width="100">
                        <template slot="header" slot-scope="scope">
                          <span class="title" style="color: #e6a23c; background: #fdf6ec;">Urgent</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #e6a23c;" class="numberOftask" @click="taskDetails(scope.row, 'urgent')">{{taskInfo[scope.row.taskName]?.['Urgent'] || 0 }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="overdue" align="center" label="Overdue" min-width="100">
                        <template slot="header" slot-scope="scope">
                          <span class="title" style="color: #f56c6c; background: #fef0f0;">Overdue</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #f56c6c;" class="numberOftask"
                            @click="taskDetails(scope.row, 'overdue')">{{ taskInfo[scope.row.taskName]?.['Overdue'] || 0
                            }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="finished" align="center" label="Finished" min-width="100">
                        <template slot="header" slot-scope="scope">
                          <span class="title" style="color: #13854e; background-color:#d6ede2;">Finished</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #13854e;" class="numberOftask"
                            @click="taskDetails(scope.row, 'finished')">{{ taskInfo[scope.row.taskName]?.['Finished'] ||
                              0
                            }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="12" v-if="filteredTask3.length > 0">
                <el-card style="box-shadow:none !important;" class="box-card">
                  <div slot="header" class="clearfix">
                    <span>Destination</span>
                  </div>
                  <div style="padding: 20px;">
                    <el-table border :data="filteredTask3" style="width: 100%">
                      <el-table-column prop="taskName" label="Task Name" width="200">
                      </el-table-column>
                      <el-table-column prop="partyRole" label="Party Role" min-width="80">
                        <template slot-scope="scope">
                          {{ taskInfo[scope.row.taskName]?.['partyRole'] || '-' }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="possible" align="center" label="Possible" min-width="100">
                        <template slot="header" slot-scope="scope">
                          <span class="title" style="color: #2d86ba;background-color:#ceecfd;">Possible</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #2d86ba;" class="numberOftask"  @click="taskDetails(scope.row, 'possible')">{{ taskInfo[scope.row.taskName]?.['Possible'] || 0 }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="urgent" align="center" label="Urgent" min-width="100">
                        <template slot="header" slot-scope="scope">
                          <span class="title" style="color: #e6a23c; background: #fdf6ec;">Urgent</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #e6a23c;" class="numberOftask"
                            @click="taskDetails(scope.row, 'urgent')">{{
                              taskInfo[scope.row.taskName]?.['Urgent'] || 0 }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="overdue" align="center" label="Overdue" min-width="100">
                        <template slot="header" slot-scope="scope">
                          <span class="title" style="color: #f56c6c; background: #fef0f0;">Overdue</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #f56c6c;" class="numberOftask"
                            @click="taskDetails(scope.row, 'overdue')">{{ taskInfo[scope.row.taskName]?.['Overdue'] || 0 }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="finished" align="center" label="Finished" min-width="100">
                        <template slot="header" slot-scope="scope">
                          <span class="title" style="color: #13854e; background-color:#d6ede2;">Finished</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #13854e;" class="numberOftask"
                            @click="taskDetails(scope.row, 'finished')">{{ taskInfo[scope.row.taskName]?.['Finished'] || 0 }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </transition>
    </el-card>

    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" accept=".xlsx, .xls, .xml" :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
        v-loading="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess"
        :on-error="handleFileError" :auto-upload="false" drag multiple :timeout="3000000">
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
          <div>{{ $t("purchaseOrder.onlyXlsXlsxFormatFilesAreAllowed") }}</div>
          <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate">{{ $t("purchaseOrder.downloadingTheTemplate") }}</el-link>
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



    <el-dialog :title="uploadDocument.title" :visible.sync="uploadDocument.open" width="600px" append-to-body
      v-loading="uploadDocument.loading" :before-close="uploadClose">
      <el-form label-width="150px" ref="uploadDocumentForm" :model="uploadDocument.formData" :show-message="false">
        <el-form-item :label="$t('document.documentNumber')" required prop="documentNumber">
          <el-input v-model="uploadDocument.formData.documentNumber" @change="handeDocumentNumberTrim"></el-input>
        </el-form-item>
        <el-form-item :label="$t('document.type')" required prop="type">
          <el-select v-model="uploadDocument.formData.type">
            <el-option v-for="(type, index) in uploadTypes" :key="index" :label="type.label"
              :value="type.value"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item :label="$t('document.documentFile')">

          <el-upload ref="uploadShipmentDocument" :limit="1" accept=".word, .pdf" :headers="uploadDocument.headers"
            :action="uploadDocument.url + '&updateSupport=' + uploadDocument.updateSupport + '&poFileType=' + this.uploadDocument.formData.type + '&fileNumber=' + this.uploadDocument.formData.documentNumber"
            :disabled="uploadDocument.isUploading" v-loading="uploadDocument.isUploading"
            :on-progress="handleFileUploadProgress" :on-success="handleUploadFileSuccess"
            :on-error="handleUploadFileError" :auto-upload="false" drag>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              {{ $t("purchaseOrder.DragTheFileHereOr")
              }}<em>{{ $t("purchaseOrder.clickUpload") }}</em>
            </div>
            <div class="el-upload__tip text-center" slot="tip">
              <span>{{ $t("purchaseOrder.onlyWordPdfFormatFilesAreAllowed") }}</span>
            </div>
          </el-upload>
        </el-form-item>



        <div style="float:right">
          <el-button size="mini" type="primary" :disabled="uploadDocument.isUploading" @click="submitFileFormUpload">{{
            $t("purchaseOrder.confirm")
          }}</el-button>
          <el-button size="mini" @click="uploadClose">{{
            $t("purchaseOrder.cancel")
          }}</el-button>
        </div>
      </el-form>

    </el-dialog>

    <el-dialog title="Review & Book" :visible.sync="bookVisible" width="75%">
      <div v-for="item in reviewBookData" :key="item.orderNumber">
        <p>{{ item.poNumber }}</p>
        <el-table :data="item.tableData">
          <el-table-column prop="productId" label="Product Name" min-width="100">
            <template v-slot="scope">
              <span>{{ productMapForBook[scope.row.productId].split("[")[0] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="productId" label="Product Code" min-width="100">
            <template v-slot="scope">
              <span>{{
                productMapForBook[scope.row.productId]
                  .split("[")[1]
                  .replace("]", "")
                  .replace("null", "")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cargoReadyBy" label="Cargo handover date" min-width="120">
            <template v-slot="scope">
              <span>{{ parseUTCTime(scope.row.cargoReadyBy) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="mustArriveBy" label="Must Arrive By" min-width="110">
            <template v-slot="scope">
              <span>{{ parseUTCTime(scope.row.mustArriveBy) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="requested" min-width="120"
            :label="item.tableData.length > 0 && item.tableData[0].requestUnit ? 'Requested (' + item.tableData[0].requestUnit + ')' : 'Requested'">
          </el-table-column>
          <el-table-column prop="bookedQty"
            :label="item.tableData.length > 0 && item.tableData[0].requestUnit ? 'Booked (' + item.tableData[0].requestUnit + ')' : 'Booked'">
            <template v-slot="scope">
              <el-input size="mini" v-model="scope.row.bookedQty" @input="changeBookedQty(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column prop="totalWeight" :label="$t('booking.totalWeight')" min-width="120">
            <template v-slot="scope">
              <el-input-number :precision="3" :controls="false" size="mini" v-model="scope.row.totalWeight" />
            </template>
          </el-table-column>
          <el-table-column prop="totalVolume" :label="$t('booking.totalVolume')" min-width="120">
            <template v-slot="scope">
              <el-input-number :precision="3" :controls="false" size="mini" v-model="scope.row.totalVolume" />
            </template>
          </el-table-column>
          <el-table-column label="Operation" align="center" class-name="small-padding fixed-width">
            <template v-slot="scope">
              <el-button size="mini" type="text" icon="el-icon-delete"
                @click="handleDelete(item.tableData, scope.row)">{{ $t("search.delete") }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="bookVisible = false">{{
          $t("purchaseOrder.cancel")
        }}</el-button>
        <el-button type="primary" @click="submitBook">{{
          $t("purchaseOrder.confirm")
        }}</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Data Error" :visible.sync="uploadError.dialogVisible" width="50%">
      <el-table :data="uploadError.data" style="width: 100%" max-height="500px" :show-header="false">
        <el-table-column property="data" label="Data Error">
          <template slot-scope="scope">
            <span>{{ scope.row }}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uploadError.dialogVisible = false">OK</el-button>
      </span>
    </el-dialog>

    <!-- // 显示右侧任务栏 task -->

    <el-drawer :modal="false" :title="title" :visible.sync="drawer" direction="rtl">
      <div class="cardx" v-for="h in taskList">
        <div class="status1Div">
          <span v-if="showTaskStatus(h) != ''" class="status2" :class="[showTaskStatus(h) == 'Possible' ? 'color2' : ''
            , showTaskStatus(h) == 'Finished' ? 'color1' : ''
            , showTaskStatus(h) == 'Urgent' ? 'color3' : ''
            , showTaskStatus(h) == 'Overdue' ? 'color4' : '']">
            {{ showTaskStatus(h) }}
            </span>
        </div>
        <div class="order" style="margin-bottom: 5px;">Order:{{ h.orderNumber }}</div>
        <div class="taskName" style="margin-bottom: 5px;">Task Name： {{  h.taskName === 'Container Loading Plan' ? 'Container Loading Result' :  h.taskName }}</div>
        <div style="clear: both;"></div>
        <div class="date" style="margin-bottom: 5px;">Party Role：{{ h.taskName ==='Upload PO'?'SFTP':h.partyRole }}</div>
        <div style="clear: both;"></div>

        <div class="date" style="margin-bottom: 5px;" v-if="h.status == 2">Complete Date：{{
          parseUTCTime2(h.finishedTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</div>
        <div class="date" style="margin-bottom: 5px;" v-if="h.status == 1">Urgent Date：{{ parseTime(h.urgentDate) }}
        </div>
        <div class="date" style="margin-bottom: 5px;" v-if="h.status == 1">Due Date：{{ parseTime(h.dueDate) }}</div>
        <div v-if="h.status == 2">
          <div style="clear: both;"></div>
          <div class="date" style="margin-bottom: 5px;" @click="sendEmailTo(h)">Complete User：{{ h.taskName ==='Upload PO'?'SFTP':h.autoResolved?'Auto Resolved':h.operator?h.operator:h.updaterName }}
          </div>
        </div>

        <div style="margin-bottom: 5px; float: right;cursor: pointer;">

          <el-popover placement="top-start" title="" width="200" trigger="hover" content="Send reminder">
            <i @click="sendEmail(h)" slot="reference" style="cursor: pointer; margin-right: 10px;"
              v-if="!(userCompanyTypeOnlyViewPerm())&&(showTaskStatus(h) == 'Overdue' || showTaskStatus(h) == 'Urgent') && user.deptId != h.partyId"
              class="el-icon-message"></i>
          </el-popover>

          <!--编辑权限的判定增加逻辑 edwin-->
          <i v-show="!(userCompanyTypeOnlyViewPerm())&&editTaskPerm(h)" @click="handleTask(h)" style="cursor: pointer; margin-right: 10px;" class="el-icon-edit"></i>

          <!-- <i v-show="h.status == 1 && user.deptId == h.partyId" @click="handleTask(h)" style="cursor: pointer;"
            class="el-icon-edit"></i> -->
          <!-- <i  @click="handleTask(h)" style="cursor: pointer;" class="el-icon-edit"></i> -->
          <i v-if="(h.taskName == 'QC Approve' || h.taskName == 'Inspection Status') && h.status == 2"
            @click="viewQcResult(h)" class="el-icon-view" style="cursor: pointer; margin-right: 10px;"></i>
          <i v-if="!(h.taskName == 'QC Approve' || h.taskName == 'Inspection Status') && h.jsonData != null && h.status == 2"
            @click="viewTask(h)" class="el-icon-view" style="cursor: pointer; margin-right: 10px;"></i>
        </div>
        <div style="clear: both;"></div>
      </div>

    </el-drawer>
    <el-dialog :title="title" width="600px" :visible.sync="documentationCheckFormVisible">
      <el-form :disabled="view" :model="form" size="mini">
        <el-form-item label="Documentation Check" label-width="180px">
          <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="form.documentationCheck" type="date"
            placeholder="Documentation Check">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="!view" class="dialog-footer">
        <el-button @click="documentationCheckFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitTask">Submit</el-button>
      </div>
    </el-dialog>
    <!-- crd update -->
    <!-- <el-dialog title="Update Cargo Ready Date" width="600px" :visible.sync="cargoReadyDateUpdateFormVisible">
      <el-form ref="cargoReadyDateUpdateFormRef" :model="form" :rules="crdRules" size="mini">
        <el-form-item label="Cargo Ready Date" label-width="180px" prop="cargoReadyDate">
          <el-date-picker format="yyyy-MM-dd" value-format="timestamp" v-model="form.cargoReadyDate" type="date"
            placeholder="Cargo Ready Date">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cargoReadyDateUpdateFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitCRD(form)">Submit</el-button>
      </div>
    </el-dialog>-->
<!--    &lt;!&ndash; crd amend&ndash;&gt;-->
<!--     <el-dialog title="Amend Cargo Ready Date" width="600px" :visible.sync="cargoReadyDateAmendFormVisible">-->
<!--      <el-form ref="cargoReadyDateUpdateFormRef" :model="form" :rules="crdRules" size="mini">-->
<!--        <el-form-item label="Cargo Ready Date" label-width="180px" prop="cargoReadyDate">-->
<!--          <el-date-picker format="yyyy-MM-dd" value-format="timestamp" v-model="form.cargoReadyDate" type="date" placeholder="Cargo Ready Date">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="Remark" label-width="180px" prop="remark">-->
<!--          <el-input type="textarea" :rows="4" v-model="form.remark" />-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button @click="cargoReadyDateAmendFormVisible = false">Cancel</el-button>-->
<!--        <el-button type="primary" @click="submitAmendCRD(form)">Submit</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->

    <!-- Dimensions (edwin)-->
    <el-dialog :title="title" width="99%" :visible.sync="dimensionsFormVisible">
      <el-row type="flex">
        <el-col  style="font-size: 24px; font-weight: bold; width: 450px;">Dimensions(Per Outer Packing)</el-col>
        <el-col >
          <el-popover width="750" placement="left" trigger="hover">
            <el-table :data="dimensionTips">
              <el-table-column width="170" property="Fields" label="Fields"></el-table-column>
              <el-table-column width="350" property="Definition_in_English" label="Definition in English"></el-table-column>
              <el-table-column width="180" property="cn" label="中文释义"></el-table-column>
            </el-table>
            <template v-slot:reference>
             <i class="el-icon-question" style="font-size: 30px; color:#004F7C;"></i>
            </template>
          </el-popover>
        </el-col>

        <!-- <el-col :span="8" :offset="10">
          <el-form :disabled="view" :model="form" size="mini">
            <el-form-item label="Cargo Ready Date" label-width="180px">
              <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="form.cargoReadyDate" type="date"
                placeholder="Cargo Ready Date">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </el-col> -->
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-col :spn="24">
          <span style="font-size: 16px; font-weight: bold;">
            Order Number:
          </span>
          <span style=" font-weight: bold; padding: 0 1px">{{ rowInfo.orderNumber }}</span>
        </el-col>
      </el-row>
      <el-table :data="rowInfo.items" fit>
        <el-table-column label="Item Number" align="center" prop="productCode" min-width="100"></el-table-column>
        <el-table-column label="TCId" align="center" prop="tcId" min-width="80"></el-table-column>
        <el-table-column label="L(cm)" align="center" prop="length" min-width="120">
          <template v-slot="scope">
            <el-input-number :disabled="view" placeholder="" v-model="scope.row.length" controls-position="right"
                             clearable :min="0" style="min-width: 110px"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="W(cm)" align="center" prop="width" min-width="120">
          <template v-slot="scope">
            <el-input-number :disabled="view" placeholder="" v-model="scope.row.width" controls-position="right"
                             clearable :min="0" style="min-width: 110px"> </el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="H(cm)" align="center" prop="height" min-width="120">
          <template v-slot="scope">
            <el-input-number :disabled="view" placeholder="" v-model="scope.row.height" controls-position="right"
                             clearable :min="0" style="min-width: 110px"> </el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="Gross Weight(kg)" align="center" prop="outerWeight" min-width="120">
          <template v-slot="scope">
            <el-input-number :disabled="view" placeholder="" v-model="scope.row.outerWeight" controls-position="right"
                             clearable style="min-width: 110px"> </el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="Net Weight(kg)" align="center" prop="innerWeight" min-width="120">
          <template v-slot="scope">
            <el-input-number :disabled="view" placeholder="" v-model="scope.row.innerWeight" controls-position="right"
                             clearable style="min-width: 110px"> </el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="Ordered Pieces/Outer Carton" align="center" prop="outerSize" min-width="167"></el-table-column>
        <el-table-column label="Produced Pieces/Outer Carton" align="center" prop="bookedProOuterSize" min-width="175">
          <template v-slot="scope">
            <el-input-number :disabled="view || !dimensionNumberEditPerm" v-model="scope.row.bookedProOuterSize" controls-position="right"
                             clearable style="min-width: 110px">
            </el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="Ordered Inner/Outer Carton" align="center" min-width="165">
          <template v-slot="scope">
            <!-- <span v-if="calculateDivisionMethod(scope.row.outerSize, scope.row.tcSize) === 0">
              /
            </span> -->
            <!-- <span v-else>
              {{ calculateDivisionMethod(scope.row.outerSize, scope.row.tcSize) }}
            </span> -->
            <span>
              {{ calculateDivisionMethod(scope.row.outerSize, scope.row.tcSize) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Produced Inner/Outer Carton" prop="bookedProInnerPerOuter" align="center" min-width="175">
          <!-- <template v-slot="scope">
            <span v-if="calculateDivisionMethod(scope.row.outerSize, scope.row.tcSize) === 0">
              /
            </span>
            <el-input v-else :disabled="view && calculateDivisionMethod(scope.row.outerSize, scope.row.tcSize) !== 0"
              @input="handleInputChange($event, scope.row, 'bookedProInnerPerOuter')"
              v-model="scope.row.bookedProInnerPerOuter" clearable class="center-input"> </el-input>
          </template> -->
          <template v-slot="scope">
            <el-input-number style="min-width: 110px" controls-position="right" :disabled="view || !dimensionNumberEditPerm" v-model="scope.row.bookedProInnerPerOuter" clearable> </el-input-number>
          </template>
        </el-table-column>
        <!-- 增加三列Ordered Outer(Cartons), Ordered Volume(cbm),Caculated Volume(cbm) -->
        <el-table-column label="Ordered Outer(Cartons)" prop="" align="center" min-width="138">
          <template v-slot="scope">
            {{ scope.row.outerQty }}
          </template>
        </el-table-column>
        <el-table-column label="Ordered Volume(cbm)" prop="" align="center" min-width="130">
          <template v-slot="scope">
            {{ scope.row.cbm }}
          </template>
        </el-table-column>
        <el-table-column label="Calculated Volume(cbm)" prop="" align="center" min-width="145">
          <template v-slot="scope">
            <span v-if="scope.row.length && scope.row.width && scope.row.height && scope.row.outerQty">
              {{ calculateCBM(scope.row.length, scope.row.width, scope.row.height, scope.row.outerQty).toFixed(3) }}
            </span>
            <span v-else></span>
          </template>
        </el-table-column>

      </el-table>
      <div slot="footer" v-if="!view" class="dialog-footer">
        <el-button @click="dimensionsFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitTask">Submit</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="title" width="600px" :visible.sync="nominateShippingWeekFormVisible">
      <el-form :disabled="view" :model="form" size="mini">
        <el-form-item label="Nominate Shipping Week" label-width="180px">
          <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="form.nominateShippingWeek" type="date"
            placeholder="Nominate Shipping Week">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="!view" class="dialog-footer">
        <el-button @click="nominateShippingWeekFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitTask">Submit</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" width="600px" :visible.sync="crdFormVisible">
      <el-form :disabled="view" :model="form" size="mini">
        <el-form-item label="Cargo handover date" label-width="180px">
          <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="form.crd" type="date"
            placeholder="Cargo handover date">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="!view" class="dialog-footer">
        <el-button @click="crdFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitTask">Submit</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" width="600px" :visible.sync="inspectionFormVisible">
      <el-form :disabled="view" :model="form" size="mini">
        <el-form-item label="Inspection Date" label-width="180px">
          <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="form.inspectionDate" type="date"
            placeholder="Inspection Date">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="!view" class="dialog-footer">
        <el-button @click="inspectionFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitTask">Submit</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="title" width="600px" :visible.sync="qcFormVisible">
      <el-form :disabled="view" :model="form" size="mini">
        <el-form-item v-if="!view" label="Related PO in same shipment" label-width="200px">
          <el-checkbox-group v-model="form.orderList" size="small">
            <!-- 2024-04-22 Ethan：默认全部勾选，并禁止操作  -->
            <el-checkbox v-for="(item, index) in soRelatedPoList" :key="index" disabled :label="item.orderHeaderId" border>{{
              item.orderNumber }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="Quality Approval Results" label-width="180px">
          <el-select v-model="form.approveResult">
            <el-option label="Pass" value="Pass"></el-option>
            <el-option label="Failed" value="Failed"></el-option>
            <el-option label="Exemption from inspection" value="Exemption from inspection"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Approve method" label-width="180px">
          <el-select v-model="form.approveMethod">
            <el-option label="Inspection Report" value="Inspection Report"></el-option>
            <el-option label="Email" value="Email"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if='view' label="Approve File" label-width="180px">
          <a target="_blank" :href="form.file" style="text-decoration: underline; padding-left: 15px;">{{ form.fileName }}</a>
        </el-form-item>

        <el-form-item v-if='!view' label="Approve File" label-width="180px">

          <el-upload :limit="1" ref="inspectionFrom" action="" :auto-upload="false"
                     :file-list="fileList"
                     :on-change="(file, files) => handleFileChangeThen(file, files, ()=>{this.fileList = files;this.beforeUpload(file)}, ()=>{this.fileList = []})">
            <el-button size="small" type="primary">File</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="!view" class="dialog-footer">
        <el-button @click="qcFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitInspectionTask">Submit</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="title" width="800px" :visible.sync="bookingFormVisible">
      <el-table :data="itemList" style="width: 100%">
        <el-table-column prop="productName" label="Product Name">
        </el-table-column>
        <el-table-column prop="productCode" label="Product Code">
        </el-table-column>
        <el-table-column prop="totalVolume" label="Total Volume(CBM)">
          <template v-slot="scope">
            <el-input v-model="scope.row.totalVolume" />
          </template>
        </el-table-column>
        <el-table-column prop="totalWeight" label="Total Weight(KG)" width="120">
          <template v-slot="scope">
            <el-input v-model="scope.row.totalWeight" />
          </template>
        </el-table-column>
        <el-table-column prop="requested"
          :label="itemList.length > 0 && itemList[0].requestUnit ? 'Requested (' + itemList[0].requestUnit + ')' : 'Requested'"
          width="120">
        </el-table-column>
        <el-table-column prop="bookedQty"
          :label="itemList.length > 0 && itemList[0].requestUnit ? 'Booked Qty (' + itemList[0].requestUnit + ')' : 'Booked Qty'"
          width="150">
          <template v-slot="scope">
            <el-input v-model="scope.row.bookedQty" />
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" v-if="!view" class="dialog-footer">
        <el-button @click="bookingFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitTask">Submit</el-button>
      </div>
    </el-dialog>

    <!-- SO Release to Supplier -->
    <el-dialog :title="title" width="800px" :visible.sync="soReleasedVisible">
      <el-form :disabled="view" :model="form" size="mini">
        <el-form-item v-if="!view" label="Related PO in same shipment" label-width="200px">
          <el-checkbox-group v-model="form.orderList" size="small">
            <!-- 2024-04-22 Ethan：默认全部勾选，并禁止操作  -->
            <el-checkbox v-for="(item, index) in soRelatedPoList" :key="index" disabled :label="item.orderHeaderId" border>{{
              item.orderNumber }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="So Release Date" label-width="200px">
          <el-date-picker v-model="form.soReleasedDate" type="date" placeholder="So Release Date"
          value-format="yyyy-MM-dd"
          :picker-options="pickerDisableFutureOptions">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="!view" class="dialog-footer">
        <el-button @click="soReleasedVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitSoReleaseTask">Submit</el-button>
      </div>
    </el-dialog>

    <!-- Cargo Handover Date-->
    <el-dialog :title="title" width="800px" :visible.sync="cargoHandoverDateFormVisible">
      <el-form :disabled="view" :model="form" size="mini">
        <el-form-item v-if="!view" label="Related PO in same shipment" label-width="200px">
          <el-checkbox-group v-model="form.orderList" size="small">
            <!-- 2024-04-23 edwin：默认全部勾选，并禁止操作  -->
            <el-checkbox v-for="(item, index) in soRelatedPoList" :key="index" disabled :label="item.orderHeaderId" border>{{
              item.orderNumber }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="form.taskName" label-width="200px">
          <el-date-picker v-model="form.cargoHandoverDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date"
            placeholder="Cargo Receive Date" :picker-options="pickerDisableFutureOptions">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="!view" class="dialog-footer">
        <el-button @click="cargoHandoverDateFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitCargoHandoverDateTask">Submit</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" width="600px" :visible.sync="pickupFormVisible">
      <el-form :disabled="view" :model="form" size="mini">
        <el-form-item label="Empty Pick up" label-width="180px">
          <el-date-picker v-model="form.emptyPickupDate" type="date" placeholder="Empty Pick up" :picker-options="pickerDisableFutureOptions">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="!view" class="dialog-footer">
        <el-button @click="pickupFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitTask">Submit</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" width="600px" :visible.sync="containerStuffingFormVisible">
      <el-form :disabled="view" :model="form" size="mini">
        <el-form-item label="Container stuffing date" label-width="180px">
          <el-date-picker v-model="form.containerStuffingDate" type="date" placeholder="Container stuffing date" :picker-options="pickerDisableFutureOptions">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="!view" class="dialog-footer">
        <el-button @click="containerStuffingFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitTask">Submit</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" width="600px" :visible.sync="customClearanceFormVisible">
      <el-form :disabled="view" :model="form" size="mini">
        <el-form-item label="Origin Customs Clearance date" label-width="220px">
          <el-date-picker v-model="form.customClearanceDate" type="date" placeholder="Origin Customs Clearance date" :picker-options="pickerDisableFutureOptions">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="!view" class="dialog-footer">
        <el-button @click="customClearanceFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitTask">Submit</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="title" width="70%" :visible.sync="taskDetailDataVisible" @close="handleDialogClose">
      <el-input v-if="mblNumberSearchPerm" v-model="queryParams2.mblNumber" placeholder="Carrier Booking Number" style="width: 200px;padding: 10px;" />
      <el-input v-if="taskDetailSearchSoRef" v-model="queryParams2.soRef" placeholder="SO Ref" style="width: 200px;padding: 10px;" />
      <el-input v-if="taskDetailSearchSoCarrierNumber" v-model="queryParams2.soCarrierNumber" placeholder="Carrier SO Number" style="width: 200px;padding: 10px;" />
      <el-button v-if="showTaskDetailSearch" type="primary" icon="el-icon-search el-icon--right" @click="handleSearch()">Search</el-button>
      <div style="display: flex; flex-wrap: wrap;">
        <el-button type="primary" :loading="downloadMilestoneLoading" icon="el-icon-download" @click="downloadMilestoneData">Download
        </el-button>
        <el-button v-hasPermi="['order:po-management:task:uplod-cargoo-inbound']" type="primary" v-if="showCargoInboundUpload" :loading="downloadCargoInboundUploadTemplateLoading"
                   icon="el-icon-download" @click="downloadCargoInboundUploadTemplate">Batch Upload Update template
        </el-button>
        <!-- 使用 el-upload 组件来处理文件选择和上传 -->
<!--        <el-upload-->
<!--          v-hasPermi="['order:po-management:task:uplod-cargoo-inbound']"-->
<!--          v-if="showCargoInboundUpload"-->
<!--          :action="computedUploadUrl"-->
<!--          style="margin-left: 8px"-->
<!--          :show-file-list="false"-->
<!--          :before-upload="beforeUpload1"-->
<!--          :on-success="handleUploadSuccess"-->
<!--          :on-error="handleUploadError"-->
<!--          :auto-upload="true"-->
<!--          :headers="uploadDocument.headers"-->
<!--        >-->
<!--          <el-button type="primary" icon="el-icon-upload">Batch Upload Update</el-button>-->
<!--        </el-upload>-->
        <div style="margin-left: 8px" v-hasPermi="['order:po-management:task:uplod-cargoo-inbound']" v-if="showCargoInboundUpload">
          <cargo-inbound-upload-button @onSuccessCallback="onSuccessCallback" />
        </div>
        <el-button type="primary" v-if="batchUpdateCRDPerm"  icon="el-icon-edit"  @click="pepcoBatchUpdateCRDMethod">Batch Update Cargo Ready Date</el-button>
        <el-button type="primary" v-if="batchUpdateDimensions"  icon="el-icon-edit"  @click="batchUpdateDimensionMethod">Batch Update Dimensions</el-button>
      </div>

      <el-table :data="taskDetailData" v-loading="taskDetailData2Loading" style="width: 100%" @sort-change="handleOverviewSortChange" >
        <el-table-column prop="date" label="Task Name" min-width="180">
          <template v-slot="scope">
            {{ scope.row.taskName }}
          </template>
        </el-table-column>
        <el-table-column v-if="taskRow.taskName === 'SO Release to Supplier'" prop="vesselVoyage" min-width="140" label="Vessel/Voyage"></el-table-column>
        <el-table-column v-if="taskRow.taskName === 'SO Release to Supplier'" prop="shippingPol" label="POL"></el-table-column>
        <el-table-column prop="orderNumber" min-width="120" label="Order Number">
          <template v-slot="scope">
            <span style="text-decoration: underline; cursor: pointer; color: #004F7C; font-weight: bold;" @click="toOrder2(scope.row.orderNumber)">{{ scope.row.orderNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="taskDetailSearchSoRef" prop="soRef" label="SO Ref" min-width="120">
          <template v-slot="scope">
            {{ scope.row.soRef }}
          </template>
        </el-table-column>
        <el-table-column v-if="taskDetailSearchSoCarrierNumber" prop="soCarrierNumber" label="Carrier SO Number" min-width="120">
          <template v-slot="scope">
            {{ scope.row.soCarrierNumber }}
          </template>
        </el-table-column>


        <el-table-column v-if="mblNumberSearchPerm" prop="carrier" label="Carrier" min-width="120">
          <template v-slot="scope">
            {{ scope.row.carrier }}
          </template>
        </el-table-column>
        <el-table-column v-if="mblNumberSearchPerm" prop="carrierBookingNumber" label="Carrier Booking Number"
          min-width="120">
          <template v-slot="scope">
            {{ scope.row.carrierBookingNumber }}
          </template>
        </el-table-column>

        <el-table-column label="Supplier Name" min-width="200" prop="supplierCode" show-overflow-tooltip>
            <template v-slot="scope">
              <bsc-supplier-text :supplierId="scope.row.supplierId"/>
                <!-- <span>{{ supplierList.find(v=>v.id==scope.row.supplierId)?.name }}</span> -->
            </template>
        </el-table-column>
        <el-table-column prop="urgentDate" label="Urgent Date">
          <template v-slot="scope">
            {{ parseTime(scope.row.urgentDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="dueDate" label="Due date" sortable="custom">
          <template v-slot="scope">
            {{ parseTime(scope.row.dueDate) }}
          </template>
        </el-table-column>
        <el-table-column v-if="title.endsWith('finished')" prop="updateTime" label="Complete date">
          <template v-slot="scope">
            {{ formatUserLocalTime(scope.row.finishedTime!=null?scope.row.finishedTime:scope.row.updateTime, scope.row.timeZone, scope.row.timeZoneOffset) }}
          </template>
        </el-table-column>

        <el-table-column label="Actions">
          <template v-slot="scope">
            <!-- 添加发送人和发送时间 -->
            <el-popover placement="top-start" title="" trigger="hover">
              <p v-show="scope.row.remindTime!=null">
                {{ 'Last Remind Time:'+parseTimeToZ1(scope.row.remindTime) }}
              </p>
              <p v-show="scope.row.remindTime==null">
                Send reminder
              </p>
              <i @click="sendEmail(scope.row)" slot="reference"
              v-if="(showTaskStatus(scope.row) == 'Overdue' || showTaskStatus(scope.row) == 'Urgent') && user.deptId != scope.row.partyId"
                class="el-icon-message"></i>
            </el-popover>
            <i v-show="!(userCompanyTypeOnlyViewPerm())&&scope.row.status == 1 && user.deptId == scope.row.partyId" @click="handleTask(scope.row)"
              style="cursor: pointer;" class="el-icon-edit"></i>
            <i v-if="(scope.row.taskName == 'QC Approve' || scope.row.taskName == 'Inspection Status') && scope.row.status == 2"
              @click="viewQcResult(scope.row)" class="el-icon-view"></i>
            <i v-if="!(scope.row.taskName == 'QC Approve' || scope.row.taskName == 'Inspection Status') && scope.row.jsonData != null && scope.row.status == 2"
              @click="viewTask(scope.row)" class="el-icon-view"></i>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="queryParams2.total" layout="total, sizes, prev, pager, next, jumper"
        :page.sync="queryParams2.pageNo" :limit.sync="queryParams2.pageSize" :page-sizes="[20, 30, 50]"
        @pagination="handlePageChange" />
    </el-dialog>
    <el-dialog :title="title" width="600px"  :visible.sync="preAlertDateFormVisible">

      <el-card>
        <el-row :gutter="20">
          <el-col :span="24">
             <div class="grid-content" style="text-align: left"><strong>Shipment Booking Number:</strong></div>
          </el-col>
          <el-col :span="12">
            <el-tag style="margin-left: 20px;">  {{bookingNumber}}    </el-tag>

            </el-col>
         </el-row>
            <el-row :gutter="20">
              <el-col :span="24" >
             <div style="text-align: left" class="grid-content"><strong>Shipping Booking Number:</strong></div>
          </el-col>
               <el-col :span="12" v-for="(shipper, index) in shippingNumbers" :key="index">
                    <el-tag style="margin-left: 20px;  margin-top: 5px;">  {{shipper}}   </el-tag>
                </el-col>
                </el-row>

  <!-- Order Number Section -->
  <el-row :gutter="20">
    <el-col :span="24">
      <div class="grid-content" style="text-align: left"><strong>Order Number:</strong></div>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="8" v-for="(order, index) in preDataform" :key="index">
      <el-tag style="margin-left: 20px; margin-top: 5px;">  {{order.orderNumber}}  </el-tag>
    </el-col>
  </el-row>
      </el-card>
      <!-- <el-form>
        <el-form-item size="mini" label="Shipment Booking Number">
          <span>{{ bookingNumber }}</span>
        </el-form-item>
        </el-form> -->

      <!-- <el-cardadult>
          <el-descriptions :column="1"   border   style="box-shadow: none;text-align:left;"  :colon="false" direction="vertical"    class="margin-top  centered-descriptions" >
            <el-descriptions-item  class="centered-item">
              {{ bookingNumber }}
          </el-descriptions-item>
          </el-descriptions>
      </el-cardadult> -->
      <!-- <el-cardadult>
          <el-descriptions :column="2"   border   style="box-shadow: none;text-align:center;"  :colon="false" direction="vertical"    class="margin-top  centered-descriptions" >
            <el-descriptions-item v-for="(item, index) in shippingNumbers" :key="index" class="centered-item">
              {{ item }}
          </el-descriptions-item>
          </el-descriptions>
      </el-cardadult> -->
      <!-- <el-cardadult>
          <el-descriptions :column="2"   border   style="box-shadow: none;text-align:center;"  :colon="false" direction="vertical"    class="margin-top  centered-descriptions" >
            <el-descriptions-item v-for="(item, index) in preDataform" :key="index" class="centered-item">
              {{ item.orderNumber }}
          </el-descriptions-item>
          </el-descriptions>
      </el-cardadult> -->
      <el-card  style="margin-top: 20px;">
        <el-form :disabled="view" :model="form" size="mini">
        <el-form-item label="Pre Alert" label-width="180px">
          <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="form.preAlertDate" type="date"
            placeholder="Pre Alert">
          </el-date-picker>
        </el-form-item>
      </el-form>
      </el-card>

      <div slot="footer" v-if="!view" class="dialog-footer">
        <el-button @click="preAlertDateFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitPreAlertTask">Submit</el-button>
      </div>
    </el-dialog>

    <verify-documents ref="verifyDocuments"  @confirm="submitSuccess"> </verify-documents>

    <upload-order-file-hbl ref="uploadOrderFileHbl" @confirm="submitUploadFileTask" @refresh="submitSuccess"></upload-order-file-hbl>

    <upload-order-file ref="uploadOrderFile" @confirm="submitUploadFileTask"  @refresh="submitSuccess"></upload-order-file>
    <pepco-booking-score ref="pepcoBookingScore" @refresh="submitSuccess"></pepco-booking-score>
    <custom-broker-assigned ref="customsBrokerAssigned" @refresh="submitSuccess"></custom-broker-assigned>
    <booking-score-view ref="bookingScoreView"></booking-score-view>
    <view-upload-order-file ref="viewUploadOrderFile"></view-upload-order-file>
    <view-verify-documents ref="viewVerifyDocuments"></view-verify-documents>
    <view-custom-broker-assigned ref="viewCustomBrokerAssigned"  ></view-custom-broker-assigned>
    <office-preview ref="officePreview" ></office-preview>
    <check-order-status-dialog ref="checkOrderStatusDialog"></check-order-status-dialog>
    <pre-alert-check-order-status-dialog ref="preAlertCheckOrderStatusDialog" ></pre-alert-check-order-status-dialog>
    <batch-update-crd-dialog ref="batchUpdateCrdDialog" :userInfo = "user" @refresh="batchUpdateSubmitSuccess"></batch-update-crd-dialog>
    <pre-alert ref="preAlert"  @refresh="submitSuccess"></pre-alert>
    <batch-update-dimensions-dialog  ref="batchUpdateDimensionsDialog" @refresh="batchUpdateDimensionSuccess"></batch-update-dimensions-dialog>
    <pre-alert-handler ref="preAlertHandler" @refresh="submitSuccess"></pre-alert-handler>
    <verify-document-handler ref="verifyDocumentHandler" @refresh="submitSuccess"></verify-document-handler>
    <cargo-ready-date
      :title="title"
      :cargoReadyDateFormVisible="cargoReadyDateFormVisible"
      :onlyView="onlyView"
      :crdInfo="crdInfo"
      @onHandleCRDClose="onHandleCRDClose"
      @onSubmitCRDSuccess="onSubmitCRDSuccess" />
    <cargo-ready-date-update
      :visible="cargoReadyDateUpdateFormVisible"
      :crdInfo="crdInfo"
      :formData="form"
      @onHandleUpdateCRDClose="onHandleUpdateCRDClose"
      @onUpdateCRDSuccess="onUpdateCRDSuccess" />
    <amend-cargo-ready-date
      :visible="crdAmendVisible"
      :crdAmendInfo="crdAmendInfo"
      @onClose="onCRDAmendClose"
      @onCRDAmendSuccess="onCRDAmendSuccess" />
    <cargo-inbound-dialog
      :cargo-inbound-visible="cargoInboundVisible"
      :cargo-inbound-info="cargoInboundInfo"
      :title="title"
      :isCargoInboundOnlyView="isCargoInboundOnlyView"
      @onCargoInboundDialogClose="onCargoInboundDialogClose"
      @onCargoInboundSuccess="onCargoInboundSuccess" />
    <cargo-inbound-update-dialog
      :cargo-inbound-update-visible="cargoInboundUpdateVisible"
      :cargo-inbound-info="cargoInboundInfo"
      :title="title"
      :isCargoInboundOnlyView="isCargoInboundOnlyView"
      @onCargoInboundDialogClose="onCargoInboundDialogClose"
      @onCargoInboundSuccess="onCargoInboundSuccess" />

  </div>
</template>

<script>
import { DICT_TYPE, getDictDatas } from "@/utils/dict";
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数
import '@icon-park/vue/styles/index.css';
import { IconPark } from '@icon-park/vue/es/all';
import { auth } from "@/plugins/auth";
import { getTaskStatus } from "@/utils/auth";
import { getUserProfile, getUserCompanyTypeList,listSimpleUsers } from "@/api/system/user";
import { getOriginDeliveryList } from "@/api/system/originDelivery";
import { getContainerList } from "@/api/system/container";
import { getBaseHeader } from "@/utils/request";
import { trackByBookingNumber, findShippingSchedulePortList, getPoTaskStatusByShipmentId,findDropDownListFromCt,getPoMilestonsStatusByShipmentId,getPoHblImportStatusByOrderHeaderId } from "@/api/shipment/shipment";
import {
  getHeaderPageForPepco,
  groupByOha,
  orderReport,
  importPepcoTemplate,
  exportPepcoPO,
  exportPO,
  updateCRD,
  groupByCountryAndSuppliercode,
  downloadOrderData,
  getOrderStatus,
  deleteHeader,
  countOrderByCountry, getHeaderTaskPage, getHeaderTasksByOrderNumbers, downloadOrderListData
} from "@/api/order/header";
import { getItemPage, getItemList, getListByCondition } from "@/api/order/item";
import { getProductList } from "@/api/system/product";
import { getDeptList } from "@/api/system/dept";
import { getCustomFieldList } from "@/api/system/customField";
import { getVesselList } from "@/api/system/vessel";
import {
  getTaskNames,
  updateTask,
  updateDimensionsData,
  getTaskList,
  reminder,
  taskReport,
  getTaskPage,
  exportOrderMilestoneData,
  updateSoReleasedTask,
  updateCargoHandoverDateTask,
  getAllTaskNamesMap,
  getFileInfoForOrder,
  downloadFileById,
  updateInspectionStatusTask,
  updatePreAlertTask,
  exportCargoInboundUploadTemplate,
  submitCRD
} from "@/api/order/task";
import { createSubscribe, deleteSubscribe } from "@/api/order/subscribe";
import SelectedListBox from "./components/selected-list-box.vue";
import { TrousersBellBottoms } from "@icon-park/vue";
import customBrokerAssigned from "./components/custom-broker-assigned.vue";
import viewCustomBrokerAssigned from "./components/view-custom-broker-assigned.vue";
import orderComment from "@/views/purchaseOrder/pepco/components/order-comment.vue";
import { fileLoadMixin } from '@/utils/fileLoadMixin'
// 添加修改订单信息 edwin
import { updateItem4Pepco } from "@/api/order/item"
import { getSoRelatedPo,getSameOrderTask, groupByPOLAndPOD,getShipmentOrderItemForOrderNumber } from "@/api/pepco/shipping-order.js";

import VerifyDocuments from "./components/verify-documents.vue";
import PepcoBookingScore from './components/pepco-booking-score.vue';
  import uploadOrderFileHbl from "./components/upload-order-file-hbl.vue";

import uploadOrderFile from "./components/upload-order-file.vue";
import bookingScoreView from "./components/booking-score-view.vue";
import viewUploadOrderFile from "./components/view-upload-order-file.vue";
import viewVerifyDocuments from "./components/view-verify-documents.vue";
import officePreview from "./components/office-preview.vue";
import viewPoManagementDocuments from "./components/view-po-management-documents.vue";
import CheckOrderStatusDialog from '../../shipment/detail/components/CheckOrderStatusDialog.vue';
import PreAlertCheckOrderStatusDialog from './components/pre-alert-check-order-status-dialog.vue';
import BatchUpdateCrdDialog from './components/batch-update-crd-dialog.vue';
import { createPoApproval, searchPoApprovalByOrderNumber } from '@/api/pepco/po-approval'
import PreAlert from './components/pre-alert.vue';
// import SupplierText from "@/views/components/supplier-text/index.vue";
import batchUpdateDimensionsDialog from "@/views/purchaseOrder/pepco/components/batch-update-dimensions-dialog.vue";
import {getDestinationDcList} from "@/api/destination/destination";
import { pepcoGetClpByShipmentId } from '@/api/shipment/pepcoclp';
import {parseUTCTime} from "@/utils/ruoyi";
import { isLocalCalendarDateBeforeToday } from "@/utils/dateUtils";
import PreAlertHandler from "@/views/purchaseOrder/pepco/milestones/handler/pre-alert-handler/index.vue";
import VerifyDocumentHandler from "@/views/purchaseOrder/pepco/milestones/handler/verify-document-handler/index.vue";
import CargoReadyDate from "@/views/purchaseOrder/pepco/components/cargo-ready-date.vue";
import CargoReadyDateTab from "@/views/purchaseOrder/pepco/components/cargo-ready-date-tab.vue";
import CargoReadyDateUpdate from "@/views/purchaseOrder/pepco/components/cargo-ready-date-update.vue";
import moment from "moment";
import {mapGetters} from 'vuex'
import AmendCargoReadyDate from "@/views/purchaseOrder/pepco/components/amend-cargo-ready-date.vue";
import { PO_TAG_RULES } from '@/api/order/constants/poTagRules'
import OverviewTipPopover from '@/views/components/overview/overview-tip-popover.vue';
import CargoInboundDialog from "@/views/purchaseOrder/pepco/components/cargo-inbound-dialog.vue";
import CargoInboundUpdateDialog from "@/views/purchaseOrder/pepco/components/cargo-inbound-update-dialog.vue";
import CargoInboundUploadButton from "@/views/purchaseOrder/pepco/components/cargo-inbound-upload-button.vue";
import CargoInboundTab from "@/views/purchaseOrder/pepco/components/cargo-Inbound-tab.vue";

export default {
  name: "Container",
  mixins: [fileLoadMixin],
  components: {
    OverviewTipPopover,
    AmendCargoReadyDate,
    CargoInboundTab,
    CargoInboundUploadButton,
    CargoInboundUpdateDialog,
    CargoInboundDialog,
    CargoReadyDateUpdate,
    CargoReadyDateTab,
    CargoReadyDate, IconPark, SelectedListBox, VerifyDocuments, uploadOrderFile ,PepcoBookingScore, customBrokerAssigned,bookingScoreView,viewUploadOrderFile,
    viewVerifyDocuments, viewCustomBrokerAssigned, officePreview, viewPoManagementDocuments,CheckOrderStatusDialog,BatchUpdateCrdDialog,orderComment,PreAlert,batchUpdateDimensionsDialog
  ,PreAlertCheckOrderStatusDialog,PreAlertHandler,VerifyDocumentHandler, uploadOrderFileHbl
},
  props: {
    showTaskPage: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      //上传文件类别
      // originDataUpdateTime:'',
      poFileType: '06',
      taskLoading: false,
      taskDetailDataVisible: false,
      taskDetailData: [],
      taskDetailData2Loading: false,
      downloadMilestoneLoading:false,
      downloadCargoInboundUploadTemplateLoading: false,
      downloadOrderLoading:false,
      batchUpdateCrdDialogVisible: false,
      uploadError: {
        title: "Errors",
        dialogVisible: false,
        data: ""
      },
      task1: [],
      task2: [],
      task3: [],
      task1Temp: [
        { 'taskName': 'Cargo Ready Date', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['Supplier', 'Shipper', 'Seller', 'OHA Management', 'PEPCO Management', 'PGS', 'PEPCO','OHA', 'PEPCO SCM'] },
        { 'taskName': 'Dimensions', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['Supplier', 'Shipper', 'Seller', 'OHA Management', 'PEPCO Management', 'PGS', 'PEPCO','OHA', 'PEPCO SCM'] },
        { 'taskName': 'Shipper Booking', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['Supplier', 'Shipper', 'Seller', 'OHA Management', 'PEPCO Management', 'PGS', 'PEPCO','OHA', 'PEPCO SCM'] },
        { 'taskName': 'Shipper Booking Validation', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['OHA','OHA Management', 'PEPCO Management', 'PEPCO'] },
        { 'taskName': 'Assign Transport Plan', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['OHA','OHA Management', 'PEPCO Management', 'PEPCO', 'PEPCO SCM'] },
        { 'taskName': 'Pepco Booking Approval', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['PEPCO', 'OHA Management', 'PEPCO Management', 'PGS','OHA', 'PEPCO SCM'] },
        { 'taskName': 'Pepco Booking Score', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['PEPCO', 'OHA Management', 'PEPCO Management','OHA', 'PEPCO SCM'] },
        { 'taskName': 'Carrier Booking', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['OHA','OHA Management', 'PEPCO Management', 'PEPCO'] },
        { 'taskName': 'Booking Confirmation', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['OHA','OHA Management', 'PEPCO Management', 'PEPCO'] },
        // { 'taskName': 'Inspection Status', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['Supplier', 'Shipper', 'Seller'] },
        { 'taskName': 'SO Release to Supplier', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['OHA','OHA Management', 'PEPCO Management', 'PGS', 'PEPCO', 'PEPCO SCM'] },
        { 'taskName': 'SI/VGM Submit', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['Supplier', 'Shipper', 'Seller', 'OHA Management', 'PEPCO Management','OHA', 'PEPCO','PGS'] },
        { 'taskName': 'SI/VGM Submit to Carrier', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['OHA','OHA Management', 'PEPCO Management'] },
        // { 'taskName': 'Cargo Receive Date', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['OHA','OHA Management', 'PEPCO Management'] },
        { 'taskName': 'Cargo Inbound', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['CFS', 'OHA', 'OHA Management', 'PEPCO Management', 'PGS', 'Supplier'] },
        { 'taskName': 'Container Gate In', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['OHA','OHA Management', 'PEPCO Management', 'PEPCO', 'PGS', 'PEPCO SCM'] },
        { 'taskName': 'Container Loading Plan', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['Supplier', 'Shipper', 'Seller', 'OHA Management', 'PEPCO Management', 'PGS', 'PEPCO','OHA', 'PEPCO SCM'] },
        { 'taskName': 'Upload Shipping Documents', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['Supplier', 'Shipper', 'Seller', 'OHA Management', 'PEPCO Management', 'PEPCO','OHA', 'PEPCO SCM'] },
        { 'taskName': 'Verify Shipping Documents', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['OHA','OHA Management', 'PEPCO Management', 'PEPCO', 'PEPCO SCM'] },
        { 'taskName': 'Vessel Departure', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['OHA','OHA Management', 'PEPCO Management', 'PGS', 'PEPCO', 'PEPCO SCM'] },
        { 'taskName': 'Release HBL and Invoice to Shipper', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['OHA','OHA Management', 'PEPCO Management', 'PEPCO'] },
        { 'taskName': 'Pre Alert', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['OHA','OHA Management', 'PEPCO Management'] },
      ],
      task2Temp: [
      ],
      task3Temp: [
        // { 'taskName': 'Document Verification Complete', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['PEPCO'] },
        // { 'taskName': 'Delivery Pre-Plan to MOOV', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['PEPCO'] },
        // { 'taskName': 'Customs Broker Assigned', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['PEPCO'] },
        // { 'taskName': 'Delivery Plan', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['OHA','OHA Management', 'PEPCO Management'] },
        // { 'taskName': 'Freight and Local Charges Invoiced', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['PEPCO'] },
        // { 'taskName': 'Vessel Arrival', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['OHA','OHA Management', 'PEPCO Management'] },
        // { 'taskName': 'Customs Clearance Finished', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['Broker'] },
        // { 'taskName': 'Container Discharged', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['OHA','OHA Management', 'PEPCO Management'] },
        // { 'taskName': 'Arrival at DC (in DC date)', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['Yard Admin'] },
        // { 'taskName': 'Empty Container Returned', 'possible': 0, 'urgent': 0, 'overdue': 0, 'finished': 0, 'type': ['OHA','OHA Management', 'PEPCO Management'] },
      ],
      drawer2: false,
      direction: "rtl",
      drawer: false,
      tableDataLine: [],
      tableData: [],
      downloadLink: '',
      user: {},
      uploadDocument: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "",
        // 是否禁用上传
        isUploading: false,
        loading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/admin-api/shipment/api/uploadShipmentFile",
        formData: {},
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        //上传弹窗
        uploadOpen: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/admin-api/order/import",
      },
      uploadTypes: [    // 上传类型选项
        { label: 'Commercial Invoice', value: '01' },
        { label: 'Draft HBL', value: '02' },
        { label: 'HBL', value: '03' },
        { label: 'MBL', value: '04' },
        { label: 'Packing List', value: '05' },
        { label: 'Others', value: '06' },
        { label: 'Invoice to Supplier', value: '14' },
      ],
      activities: [],
      exportLoading: false,
      tableHeight: 0,
      loading: true,
      total: 0,
      bookingNameMap: {},
      lineTotal: 0,
      queryParams: {
        orderNumber: null,
        containerNo: null,
        originPort: [],
        countryList: [],
        supplierCode: null,
        dcDataList: [],
        shipmentType: null,
        transportMode: null,
        hodDateRange: [],
        etdDateRange:[],
        atdFlag: null,
        ataFlag: null,
        pageNo: 1,
        pageSize: 20,
        prop: '',
        orderBy: '',
        poStatus: [],
        // supplierType: null,
        merchCode: null,
        poTags: [],
        status: 0,
      },
      filterPopover:false,
      itemQueryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      productMap: {},
      preBookMap: {},
      currentOrderId: null,
      orderNumberMap: {},
      bookVisible: false,
      reviewBookData: [],
      productMapForBook: {},
      partyMap: {},
      dialogFormVisible: false,
      soReleasedVisible: false,
      // cargoHandoverDate form 可见性
      cargoHandoverDateFormVisible: false,
      pickupFormVisible: false,
      bookingFormVisible: false,
      crdFormVisible: false,
      nominateShippingWeekFormVisible: false,
      cargoReadyDateFormVisible: false,
      cargoReadyDateUpdateFormVisible: false,
      cargoReadyDateAmendFormVisible: false,
      // dimensions form 初始化 edwin
      dimensionsFormVisible: false,
      documentationCheckFormVisible: false,
      inspectionFormVisible: false,
      customClearanceFormVisible: false,
      qcFormVisible: false,
      containerStuffingFormVisible: false,
      preAlertDateFormVisible: false,
      form: {
        cargoReadyDate: null,
        preAlertDate: null,
        taskStatusName: null
      },
      view: true,
      task: {},
      itemList: [],
      itemVisable: false,
      title: "",
      preAssgineVisable: false,
      shipments: [],
      shipmentItemMap: {},
      data: {},
      customFieldHeader: [],
      customFieldLine: [],
      itemMap: {},
      expanded: {},
      loadingMap: {},
      containerMap: {},
      preAssgine: [],
      preAssgineForm: {},
      shipmentStatusMap: {},
      vesselMap: {},
      portMap: {},
      taskList: [],
      // 查看shippingBooking里程碑的状态
      isShippingBooked: false,
      hiddenTask: false,
      fileType: {
        'shipment_carrier_bill': 'MBL',
        'shipment_house_bill': 'HBL',
        'shipment_others': 'Others',
      },
      allMilestone: {
        "5": "Gate out Empty",
        "6": "Gate In Full",
        "8": "Shipped",
        "9": "BL Issued(Rls)",
        "10": "Arrived",
        "11": "Departure POD",
        "12": "Delivered",
        "14": "Completed"
      },
      vesselListLes: [],
      otherMilestones: {
        "-1": "Update",
        "0": "CancelShipment",
        "1": "Draft",
        "2": "Submit Booking",
        "3": "Booking Accept",
        "4": "Booking Confirmation",
        "5": "GATE OUT EMPTY",
        "6": "GateIn",
        "7": "Shipping Instructions",
        "8": "Shipped",
        "9": "BLIssued",
        "10": "Arrived",
        "11": "DeparturePOD",
        "12": "Delivered",
        "13": "ArrivalInlandTerminal",
        "14": "Completed",
        "18": "Departure POL",
        "19": "Arrival POD",
        "20": "Custom clearance",
        "21": "Delivery",
        "22": "Empty Return",
      },
      containerStatus: {
        "BDAR": "Arrived",
        "DLPT": "Departure",
        "STCS": "Gate Out",
        "GTOT": "Import to Consignee",
        "RCVE": "Return Empty",
        "STSP": "Empty Pick up",
        "GITM": "Gate In",
        "DSCH": "Discharge",
        "LOBD": "Load Board"
      },
      orderIndex: 0,
      taskNames: [],
      possibleList: [],
      urgentList: [],
      overdueList: [],
      finishedList: [],
      orderInfo: {
        ports: [],
        booked: 0,
        notBooked: 0,
      },
      checkedPort: {},
      taskInfo: {},

      portOptions: [],
      shipperList: [],
      ohaList: [],
      deptList: [],
      queryParams2: {
        total: 0,
        pageNo: 1,
        pageSize: 20,
        mblNumber: '', // 确保已初始化
        soRef: ''
      },
      // po 整行数据
      rowInfo: {},
      // SO Related Po in same shipment
      orderList: [],
      soRelatedPoList: [],
      taskData: [],
      verifyResult: [],
      dialogVisible: false,
      // 用户所在的公司类型列表
      userCompanyTypeList: [],
      allTaskNames: [],
      typeNumber: 0,//document种类
      documentData: {}, //当前 Order Number 查询到的document

      // 禁用今天之后的日期
      pickerDisableFutureOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      crdRules: {
        cargoReadyDate:[
          { required : true, message: 'Cargo Ready Date Is Required', trigger: 'change' }
        ]
      },
      taskRow: {},
      mblNumberSearchPerm: false,
      batchUpdateCRDPerm : false,
      showTaskDetailSearch: false,
      taskDetailSearchSoCarrierNumber: false,
      taskDetailSearchSoRef: false,
      // 里程碑权限过滤列表
      milestonePermMap: {
        "SUPPLIER": {
          "origin":[
            "Upload PO",
            "Cargo Ready Date",
            "Dimensions",
            "Shipper Booking",
            "Shipper Booking Validation",
            "Assign Transport Plan",
            "Pepco Booking Approval",
            "SO Release to Supplier",
            "SI/VGM Submit",
            "Cargo Inbound",
            "Container Gate In",
            "Container Loading Plan",
            "Upload Shipping Documents",
            "Vessel Departure"
          ],
          "destination":[
          ]
        },
        "PGS": {
          "origin":[
            "Upload PO",
            "Cargo Ready Date",
            "Dimensions",
            "Shipper Booking",
            "Pepco Booking Approval",
            "SO Release to Supplier",
            "SI/VGM Submit",
            "Cargo Inbound",
            "Container Gate In",
            "Container Loading Plan",
            "Vessel Departure"
          ],
          "destination":[
          ]
        },
        "PEPCO": {
          "origin":[
            "Upload PO",
            "Cargo Ready Date",
            "Dimensions",
            "Shipper Booking",
            "Shipper Booking Validation",
            "Assign Transport Plan",
            "Pepco Booking Approval",
            "Pepco Booking Score",
            "Carrier Booking",
            "Booking Confirmation",
            "SO Release to Supplier",
            "SI/VGM Submit",
            "Container Gate In",
            "Container Loading Plan",
            "Upload Shipping Documents",
            "Verify Shipping Documents",
            "Vessel Departure",
            "Release HBL and Invoice to Shipper",
          ],
          "destination":[
            "Document Verification Complete",
            "Delivery Pre-Plan to MOOV",
            "Customs Broker Assigned",
            "Freight and Local Charges Invoiced"
          ]
        },
        "PEPCO_SCM": {
          "origin": [
            "Upload PO",
            "Cargo Ready Date",
            "Dimensions",
            "Shipper Booking",
            "Assign Transport Plan",
            "Pepco Booking Approval",
            "Pepco Booking Score",
            "SO Release to Supplier",
            "Container Gate In",
            "Container Loading Plan",
            "Upload Shipping Documents",
            "Verify Shipping Documents",
            "Vessel Departure",
          ],
          "destination": [

          ]
        },
        "ORIGIN": {
          "origin":[
            "Upload PO",
            "Cargo Ready Date",
            "Dimensions",
            "Shipper Booking",
            "Shipper Booking Validation",
            "Assign Transport Plan",
            "Pepco Booking Approval",
            "Pepco Booking Score",
            "Carrier Booking",
            "Booking Confirmation",
            "SO Release to Supplier",
            "SI/VGM Submit",
            "SI/VGM Submit to Carrier",
            // "Cargo Receive Date",
            "Cargo Inbound",
            "Container Gate In",
            "Container Loading Plan",
            "Upload Shipping Documents",
            "Verify Shipping Documents",
            "Vessel Departure",
            "Release HBL and Invoice to Shipper",
            "Pre Alert",
          ],
          "destination":[
            "Document Verification Complete",
            "Delivery Pre-Plan to MOOV",
            "Customs Broker Assigned",
            "Delivery Plan",
            "Freight and Local Charges Invoiced",
            "Vessel Arrival",
            "Customs Clearance Finished",
            "Container Discharged",
            "Arrival at DC (in DC date)",
            "Empty Container Returned"
          ]
        },
        "OHA": {
          "origin":[
            "Upload PO",
            "Cargo Ready Date",
            "Dimensions",
            "Shipper Booking",
            "Shipper Booking Validation",
            "Assign Transport Plan",
            "Pepco Booking Approval",
            "Pepco Booking Score",
            "Carrier Booking",
            "Booking Confirmation",
            "SO Release to Supplier",
            "SI/VGM Submit",
            "SI/VGM Submit to Carrier",
            // "Cargo Receive Date",
            "Cargo Inbound",
            "Container Gate In",
            "Container Loading Plan",
            "Upload Shipping Documents",
            "Verify Shipping Documents",
            "Vessel Departure",
            "Release HBL and Invoice to Shipper",
            "Pre Alert",
          ],
          "destination":[
            "Document Verification Complete",
            "Delivery Pre-Plan to MOOV",
            "Customs Broker Assigned",
            "Delivery Plan",
            "Freight and Local Charges Invoiced",
            "Vessel Arrival",
            "Customs Clearance Finished",
            "Container Discharged",
            "Arrival at DC (in DC date)",
            "Empty Container Returned"
          ]
        },
        "CFS": {
          "origin":[
            "Cargo Inbound"
          ],
          "destination":[

          ]
        },
        "Broker": {
          "origin":[

          ],
          "destination":[
            "Customs Clearance Finished"
          ]
        },
        "YardAdmin": {
          "origin":[

          ],
          "destination":[
            "Arrival at DC (in DC date)"
          ]
        },
      },
            // PO Tag 下拉选项
      poTagOptions: [
        {
          code: 'OTB',
          label: 'OTB',
          type: 'success'
        },
        {
          code: 'NOS',
          label: 'NOS',
          type: 'primary'
        },
        {
          code: 'SANITARY_RISK',
          label: 'Sanitary Risk',
          type: 'warning'
        },
        {
          code: 'CERAMIC',
          label: 'Ceramic Products',
          type: 'info',
          className: 'tag-purple',
        },
        {
          code: 'CHILDREN_TOY',
          label: 'Children Toy',
          type: 'danger'
        }
      ],
      // dimensions tips
      dimensionTips: [
        {
          Fields: 'L (cm)',
          Definition_in_English: 'Length of outer carton (unit in cm)',
          cn: '货物外箱长度（单位：厘米）'
        },
        {
          Fields: 'W (cm)',
          Definition_in_English: 'Width of outer carton (unit in cm)',
          cn: '货物外箱宽度（单位：厘米）'
        },
        {
          Fields: 'H (cm)',
          Definition_in_English: 'Height of outer carton (unit in cm)',
          cn: '货物外箱高度（单位：厘米）'
        },
        {
          Fields: 'Gross Weight (kg)',
          Definition_in_English: 'Gross Weight of one outer carton (unit in kg)',
          cn: '单个外箱毛重（单位：公斤）'
        },
        {
          Fields: 'Net Weight (kg)',
          Definition_in_English: 'Net Weight of one outer carton (unit in kg)',
          cn: '单个外箱净重（单位：公斤）'
        },
        {
          Fields: 'Produced Pieces/Outer Carton',
          Definition_in_English: 'Pieces in one outer carton',
          cn: '单个外箱内的总小件数'
        },
        {
          Fields: 'Produced Inner/Outer Carton',
          Definition_in_English: 'Inner in one outer carton',
          cn: '单个外箱内的总内箱数'
        },
        {
          Fields: 'Ordered Outer (Cartons)',
          Definition_in_English: 'Item level total outer cartons from customer order',
          cn: '物料总外箱数量'
        },
        {
          Fields: 'Ordered Volume (cbm)',
          Definition_in_English: 'Item level total volume from customer order(unit in cbm)',
          cn: '物料总体积'
        },
        {
          Fields: 'Calculated Volume',
          Definition_in_English: 'L * W * H * total outer cartons (unit in cbm)',
          cn: '长 * 宽 * 高 * 物料总外箱数量'
        }
      ],
      selCancelCategory1: [],
      selCancelReason: [],
      selCancelCategory: [],
      selCancelReason1: [],
      userMap: [],
      shippingPol:[],
      shippingPod:[],
      originPort:[],
      country:[],
      supplierCode:[],
      dc: [
        '0006',
        '0015',
        '0018',
        '0021',
        '0027',
      ],
      dcDataList: [],
      supplierList: [],
      preDataform:[],
      shippingNumbers:[],
      bookingNumber:null,
      dc_name: {
        '0006':'Rawa',
        '0015':'Sosnowiec',
        '0018':'Gyal',
        '0021':'Bucharest',
        '0027':'Guadalajara',
      },
      batchUpdateDimensions: false,
      // dimensions number edit perm
      dimensionNumberEditPerm: false,
      dimensioneditable: false,
      // supplierTypeOptions: [
      //   { label: 'DIRECT', value: 'DIRECT' },
      //   { label: 'PGS', value: 'PGS' }
      // ],
      countryData: [],
      uploadUrl: process.env.VUE_APP_BASE_API + '/admin-api/order/task/pepco/cargo-inbound-possible-file/upload',
      // 默认隐藏上传组件
      showCargoInboundUpload: false,
      errorDialog: {
        visible: false,
        data: [] // 错误汇总数据结构：[{ type, count, details }]
      },
      expandedErrorTypes: [], // 控制每个错误类型是否展开
      mileOptions: [],
      merchCodeOptions: ['BS', 'EA', 'GL','S','SS','VD','W','WW','X','XX','Y'],
      onlyView: false,
      crdInfo: null,
      crdInfoList: [],
      crdAmendVisible: false,
      crdAmendInfo: null,
      taskTipInfoMap: new Map(),
      cargoInboundVisible: false,
      cargoInboundInfo: null,
      uploadLoading: false,
      isCargoInboundOnlyView: false,
      cargoInboundUpdateVisible: false,
    };

  },
  computed: {
    computedUploadUrl() {
      const baseUrl = process.env.VUE_APP_BASE_API + '/admin-api/order/task/pepco/cargo-inbound-possible-file/upload';
      const statusKey = this.queryParams2.statuskey;
      // 注意处理 null/undefined
      return `${baseUrl}?statusKey=${encodeURIComponent(statusKey || '')}`;
    },
    hasFilter() {
      if(this.drawer2){
        return this.queryParams.originPort|| this.queryParams.country|| this.queryParams.countryList|| this.queryParams.supplierCode || this.queryParams.dc|| this.queryParams.dcList
      }else {
        return this.queryParams.originPort|| this.queryParams.country|| this.queryParams.countryList|| this.queryParams.supplierCode || this.queryParams.dc|| this.queryParams.dcList || this.queryParams.hodDateRange || this.queryParams.etdDateRange
      }
    },
    // 增加对Task的过滤
    filteredTask1() {
      // 如果用户所在的公司类型列表为空，则返回原始数据 edwin
      if (this.userCompanyTypeList.length === 0) {
        return this.task1;
      } else {
        return this.task1.filter(task => task.type.some(type => this.userCompanyTypeList.includes(type)));
      }
    },
    // 增加对Task的过滤
    filteredTask3() {
      // 如果用户所在的公司类型列表为空，则返回原始数据 edwin
      if (this.userCompanyTypeList.length === 0) {
        return this.task3;
      } else {
        return this.task3.filter(task => task.type.some(type => this.userCompanyTypeList.includes(type)));
      }
    },
    ...mapGetters(['nickname'])
  },
  watch: {
    // 监听po整行数据,预填信息
    'rowInfo.items': {
      handler(items) {
        // 确保 items 存在且不为空
        if (!items || items.length === 0) return;
        items.forEach(item => {
          if (item.bookedProOuterSize === '' || item.bookedProOuterSize === undefined || item.bookedProOuterSize === null) {
            item.bookedProOuterSize = item.outerSize;
          }
          if (item.bookedProInnerPerOuter === '' || item.bookedProInnerPerOuter === undefined || item.bookedProInnerPerOuter === null) {
            item.bookedProInnerPerOuter = this.calculateDivisionMethod(scope.row.outerSize, scope.row.tcSize);
          }
        });
      },
      deep: true,
    },
  },
  mounted() {
    this.tableHeight = document.body.clientHeight - 302;
    // 窗口重置时候，重新获取高度
    window.onresize = () => {
      return (() => {
        this.tableHeight = document.body.clientHeight - 302;
        console.log(this.tableHeight)
      })();
    },
    window.addEventListener('storage', this.handleStorageChange);
  },
  created() {

    // 获取用户所在的公司类型列表
    getUserCompanyTypeList().then(response => {
      console.log("获取用户所在的公司类型列表")
      console.log(response.data)
      this.userCompanyTypeList = response.data
    })

    getAllTaskNamesMap().then(res => {
      // 过滤 res.data，只保留那些在 task1Temp 中有对应 taskName 的项
      this.allTaskNames = res.data.filter(item => this.task1Temp.some(temp => temp.taskName === item.value));
      console.log("获取所有任务名称映射", this.allTaskNames);
      //当value = 'Container loading plan'时 将label改为'container loading result'
      // 给this.allTaskNames的末尾塞一个对象 label和value都为Destination In Process
      this.allTaskNames.push({ label: 'Destination In Process', value: 'Destination In Process' });
      const mileOptions = []
      this.allTaskNames.forEach(item => {
        if (item.value == 'Container Loading Plan') {
          item.label = 'Container Loading Result'
        }
        mileOptions.push({
          ...item,
          children: [
            { label: 'Possible', value: 'Possible' },
            { label: 'Urgent', value: 'Urgent' },
            { label: 'Overdue', value: 'Overdue' },
            { label: 'Finished', value: 'Finished' },
          ]
        })
      })
      this.mileOptions = mileOptions
    })
    this.hiddenTask = getTaskStatus() == 1;

    if (this.$route.query.orderNumber) {
      this.queryParams.orderNumber = this.$route.query.orderNumber
    }
    if (this.showTaskPage != null) {
      this.drawer2 = this.showTaskPage
    }

    getDestinationDcList().then(response => {
      this.$set(this, 'dcDataList', response.data || [])
    })

    getUserProfile().then(response => {
      this.user = response.data;
    });

    this.groupByOha()
    this.getPortList()
    this.orderReport()
    // this.groupByPOLAndPOD()
    this.groupByCountryAndSuppliercode()
    this.getDropDownValues()
    listSimpleUsers().then(response => {
      this.userMap = new Map(response.data.map((value, index) => [value.id + '', value.nickname]))
    })

    this.overviewTipPopoverMethods()
  },
  methods: {
    triggerFilter(){
      // 自定义筛选
      this.queryParams.pageNo = 1;
      this.getList()
    },
    checkPermi,
    checkRole,
  getPoTags(row, context = {}) {
      if (row.supplyModel == 'NOS') {
        row.nos = true
      } else {
        row.nos = false
      }
    return PO_TAG_RULES
      .filter(rule => rule.match ? rule.match(row, context) : true)
      .map(rule => ({
        code: rule.code,
        label: rule.label,
        type: rule.type,
        className: rule.className || ''
      }))
  },

    beforeUpload1(file) {
      console.log('文件准备上传', file);
      return true;
    },
    handleUploadSuccess(res) {
      console.log('上传响应:', res);
      if (res.code === 0 ) {
        this.$notify({ type: 'success', message: 'Upload Successful' });
      }else {
        this.$notify({ type: 'error', message: res.msg });
      }
    },
    handleUploadError(err) {
      console.error('上传失败', err);
    },
    updateCargoInboundUploadVisibility(visible) {
      this.showCargoInboundUpload = visible
    },

    toggleDetailsCargoInboundDetail(errorType) {
      const index = this.expandedErrorTypes.indexOf(errorType);
      if (index > -1) {
        this.expandedErrorTypes.splice(index, 1);
      } else {
        this.expandedErrorTypes.push(errorType);
      }
    },
    closeDialog() {
      this.errorDialog.visible = false;
      this.expandedErrorTypes = [];
    },


    groupByCountryAndSuppliercode() {
      groupByCountryAndSuppliercode().then((res) => {
        this.country = res.data.country;
        this.supplierCode = res.data.supplierCode;
        this.dc = res.data.dc;
        this.originPort = res.data.pol;
        // Ethan: 组装Supplier 列表
        this.supplierList = [...res.data.supplierList]
        countOrderByCountry({ country: res.data.country.join(",") }).then(res2 => {
          this.countryData = res2.data
        })
      })
    },

    groupByPOLAndPOD() {
      groupByPOLAndPOD().then((res) => {
        this.shippingPol = res.data.pol;
        this.shippingPod = res.data.pod;
      })
    },
    getPartyRole(taskName) {
      if(taskName=='Cargo Inbound') {
        // return 'CFS'
        return 'OHA'
      } else if (taskName == 'Container Gate In') {
        return 'OHA'
      }
      return this.taskInfo[taskName]?.['partyRole'] || '-'
    },
    downloadDocument(file){
      //console.log(file)
      window.open(file.fileUrl);
      /*let a = document.createElement('a')
      downloadFileById(file.id).then(res =>{
        let url = window.URL.createObjectURL(new Blob([res]))
        a.download = file.fileName
        a.href=url
        a.click();
      })*/
    },
    viewDocument(file){
      this.$refs.officePreview.previewDocument(file);
    },

    bookedChange(flag) {
      return;
    },
    cancelChange() {
      this.queryParams.isCancel = !this.queryParams.isCancel
      this.queryParams.status = this.queryParams.isCancel ? '1' : null
      this.getList()
    },
    clickPort1(item) {
      return;
    },
    changeBookedQty(row) {
      this.calculateWeight(row)
      this.calculateVolume(row)
    },
    calculateWeight(row) {
      if (row.weight && row.bookedQty) {
        const weightKg = (row.weight * row.bookedQty).toFixed(3)
        row.totalWeight = weightKg
        return weightKg;
      }
      return row.totalWeight;
    },
    calculateVolume(row) {
      if (row.length && row.width && row.height && row.bookedQty) {
        // 计算体积（单位：立方厘米）
        const volumeCm3 = row.length * row.width * row.height;
        // 转换为立方米
        const volumeCbm = ((volumeCm3 / 1000000) * row.bookedQty).toFixed(3);
        row.totalVolume = volumeCbm;
        return volumeCbm;
      }
      return row.totalVolume;
    },
    getTenantPage() {
      if (this.checkPermi(['super:user'])) {
        getTenantPage({ pageNo: 1, pageSize: 100, status: 0 }).then(response => {
          for (var i = 0; i < response.data.list.length; i++) {
            this.tenantMap[response.data.list[i].id] = response.data.list[i].name
          }
        });
      }
    },

    // taskReport(value) {
    //   this.taskLoading = true
    //   taskReport({...this.queryParams, ...value}).then((res) => {
    //     this.taskInfo = res.data.statusCount
    //     // this.originDataUpdateTime = res.data.dataTime
    //     this.taskLoading = false
    //     console.log(res.data)
    //   })
    // },

    taskReport() {
      this.taskLoading = true
      taskReport(this.queryParams).then((res) => {
        this.taskInfo = res.data.statusCount
        this.taskLoading = false
        console.log(res.data)
      })
    },
    orderReport() {
      orderReport().then((res) => {
        this.orderInfo = res.data
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return 'shuang-row';
      } else {
        return 'dan-row';
      }
    },
    beforeUpload(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = () => {
          this.form.file = reader.result;
          this.form.fileName = file.name;
          resolve(); // 上传之前的处理完成后调用 resolve()
        };

        reader.readAsDataURL(file.raw);
      });
    },
    handleSortChange({ column, prop, order }) {
      // 根据当前排序条件发送请求到后台获取排序结果
      if (order != null) {
        order = order === 'ascending' ? 'ASC' : 'DESC';
        this.queryParams.prop = column.property.replace(/([A-Z])/g, "_$1").toLowerCase()
        this.queryParams.orderBy = order
      } else {
        this.queryParams.prop = ''
        this.queryParams.orderBy = ''
      }
      this.getList()
    },
    handleOverviewSortChange({column, prop, order}) {
      console.log('排序信息:', {column, prop, order});
      this.queryParams.prop = 'due_date';
      // 设置排序参数
      if (order === 'ascending') {
        this.queryParams.orderBy = 'ASC';
      } else if (order === 'descending') {
        this.queryParams.orderBy = 'DESC';
      } else {
        // 如果没有排序顺序，清除排序参数
        this.queryParams.orderBy = null;
        this.queryParams.prop = null;
      }
      this.taskDataTableQuery();
    },
    toOrder2(orderNumber) {
      this.taskDetailDataVisible = false
      this.drawer2 = false
      this.$set(this.queryParams, "orderNumber", orderNumber)
      this.getList()
    },
    sendEmailTo(task) {
      window.location.href = `mailto:${task.updaterName}`;
    },
    sendEmail(task) {
      reminder({
        status: this.showTaskStatus(task),
        orderNumber: task.orderNumber,
        taskName: task.taskName,
        partyId: task.partyId
      }).then((res) => {
        this.$notify({
          title: 'success',
          message: 'Reminder mail sent',
          type: 'success'
        });
      })
    },
    taskDetails(row, status) {
      // if(row.taskName=='Pepco Booking Score'){
        // this.openNewWindow("/shipment/ppBookingScore")
      // }else{
        this.taskRow = row
        var statusT = status.charAt(0).toUpperCase() + status.slice(1)
        this.taskDetailDataVisible = true
        if (row.taskName === 'Container Loading Plan') {
          this.title = "Container Loading Result " + statusT
        } else {
          this.title = row.taskName + " " + statusT
        }
        this.queryParams2.taskName = row.taskName
        this.queryParams2.status = 1
        if (statusT == 'Finished') {
          this.queryParams2.status = 2
        }
        this.queryParams2.statuskey = statusT

        this.queryParams2.pageNo = 1
        this.queryParams2.mblNumber = ''
        this.queryParams2.soRef = ''
        this.batchUpdateCRDPermMethod(row, this.queryParams2.status)
        this.showTaskDetailSearchMethod(row)
        this.isShowBatchUpdateDimensionBtn(row, this.queryParams2.status)
        this.taskDataTableQuery()
        this.updateCargoInboundUploadVisibility((row.taskName || '').trim() == 'Cargo Inbound'
          && ((this.queryParams2.statuskey || '').trim() == 'Possible'
          || (this.queryParams2.statuskey || '').trim() == 'Urgent'
          || (this.queryParams2.statuskey || '').trim() == 'Overdue'))
      },
    showTaskDetailSearchMethod(row) {
      console.log('-----showTaskDetailSearchMethod-----',row)
      this.showTaskDetailSearch = row.taskName =='Release HBL and Invoice to Shipper' || row.taskName=='Pre Alert' || row.taskName=='SI/VGM Submit to Carrier'||row.taskName== 'SI/VGM Submit'
      this.taskDetailSearchSoRef = row.taskName=='Release HBL and Invoice to Shipper'
      this.taskDetailSearchSoCarrierNumber =row.taskName== 'SI/VGM Submit to Carrier' ||row.taskName== 'SI/VGM Submit'
      this.mblNumberSearchPerm = row.taskName=='Pre Alert'
    },
    handleSearch() {
      this.queryParams2.pageNo = 1
      this.taskDataTableQuery()
    },
    handlePageChange() {
      this.taskDataTableQuery()
    },
    taskDataTableQuery() {
      this.taskDetailData2Loading = true
      this.queryParams2.tenantId = this.queryParams.tenantId
      this.queryParams2.booked = this.queryParams.booked
      this.queryParams2.ports = this.queryParams.ports
      this.queryParams2.orderNumber = this.queryParams.orderNumber
      this.queryParams2.originPort = this.queryParams.originPort
      this.queryParams2.shippingPol = this.queryParams.shippingPol
      this.queryParams2.shippingPod = this.queryParams.shippingPod
      this.queryParams2.supplierCode = this.queryParams.supplierCode
      this.queryParams2.dc = this.queryParams.dc
      this.queryParams2.dcList = this.queryParams.dcList
      this.queryParams2.country = this.queryParams.country
      this.queryParams2.countryList = this.queryParams.countryList
      this.queryParams2.taskStatus = this.queryParams.taskStatus
      this.queryParams2.shipmentType = this.queryParams.shipmentType
      this.queryParams2.transportMode = this.queryParams.transportMode
      this.queryParams2.hodDateRange = this.queryParams.hodDateRange
      this.queryParams2.etdDateRange = this.queryParams.etdDateRange
      // this.queryParams2.supplierType = this.queryParams.supplierType
      this.queryParams2.poTags = this.queryParams.poTags
      this.queryParams2.prop = this.queryParams.prop
      this.queryParams2.orderBy = this.queryParams.orderBy
      getTaskPage(this.queryParams2).then((res) => {
        console.log(res.data)
        this.taskDetailData2Loading = false
        this.taskDetailData = res.data.list
        this.queryParams2.total = res.data.total

      })
    },
    downloadMilestoneData(){
      if(this.taskDetailData.length == 0){
        this.$notify({
          title: 'warning',
          message: 'No data to export',
          type: 'warning'
        });
        return
      }

      this.$confirm('Confirm the download?\n Note that a maximum of 60,000 pieces of data can be downloaded at a time.', 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
          this.downloadMilestoneLoading = true
          exportOrderMilestoneData(this.queryParams2).then(response => {
            this.$download.excel(response, `${this.queryParams2.taskName}-${this.queryParams2.statuskey}-${new Date().getTime()}.xlsx`)
            this.$notify({
              title: 'success',
              message: 'Download Success',
              type: 'success'
            });
            this.downloadMilestoneLoading = false
            })
        })
        .catch(() => {
          this.downloadOrderLoading = false;
        });
    },
    downloadCargoInboundUploadTemplate() {
      if (this.taskDetailData.length == 0) {
        this.$notify({
          title: 'warning',
          message: 'No data to export',
          type: 'warning'
        });
        return
      }

      this.$confirm('Confirm the download?\n Note that a maximum of 60,000 pieces of data can be downloaded at a time.', 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.downloadCargoInboundUploadTemplateLoading = true
        exportCargoInboundUploadTemplate(this.queryParams2).then(response => {
          this.$download.excel(response, `Cargo Inbound Upload Template-${this.queryParams2.statuskey}-${new Date().getTime()}.xlsx`)
          this.$notify({
            title: 'success',
            message: 'Download Success',
            type: 'success'
          });
          this.downloadCargoInboundUploadTemplateLoading = false
        })
      })
        .catch(() => {
          this.downloadOrderLoading = false;
        });
    },
    getTaskNames() {
      this.taskLoading = true
      getTaskNames({ type: '1'}).then((res) => {
        this.task1 = JSON.parse(JSON.stringify(this.task1Temp))
        this.task2 = JSON.parse(JSON.stringify(this.task2Temp))
        this.task3 = JSON.parse(JSON.stringify(this.task3Temp))
        this.taskNames = res.data
        this.task1 = this.task1.filter(item => this.taskNames.indexOf(item.taskName) > -1)
        this.task2 = this.task2.filter(item => this.taskNames.indexOf(item.taskName) > -1)
        this.task3 = this.task3.filter(item => this.taskNames.indexOf(item.taskName) > -1)
        // this.taskReport({cacheFlag: cacheFlag ? false : true })
        this.taskReport()
      })
    },
    openOverview() {

      this.drawer2 = !this.drawer2
    },
    showTaskStatus(h) {
      if(h.taskName == 'Verify Shipping Documents') {
        console.log(h)
      }
      if (h.status == 0) {
        return ''
      } else if (h.status == 1) {
        if (h.dueDate && isLocalCalendarDateBeforeToday(h.dueDate)) {
          return 'Overdue'
        } else if (h.urgentDate && isLocalCalendarDateBeforeToday(h.urgentDate)) {
          return 'Urgent'
        }
        return 'Possible'
      } else if (h.status == 2) {
        return 'Finished'
      }
    },
    // 改成传整行数据，用来dimensions里程碑信息获取
    showTask(row, index) {
      this.rowInfo = row
      console.log("this.rowInfo", this.rowInfo)
      this.orderIndex = index
      this.drawer = true
      this.taskList = row.orderTaskDOS
      console.log("this.taskList",this.taskList)
      if (this.taskList.length > 0) {
        this.title = this.taskList[0].orderNumber
      }
      // 判断该po有没有被shipping，有了shippingId，就说明shipping了
      if(row.shippingId){
        this.isShippingBooked = true
        if(row.shippingId > 0 && !row.shippingDraft){
          this.dimensionNumberEditPerm = false
        }else{
          this.dimensionNumberEditPerm = true
        }
        console.log("this.dimensionNumberEditPerm",this.dimensionNumberEditPerm)
      }else{
        this.isShippingBooked = false
        this.dimensionNumberEditPerm = true
        console.log("this.dimensionNumberEditPerm",this.dimensionNumberEditPerm)

      }
      // 为每个 bookedProOuterSize 设置默认值 dewin
      this.rowInfo.items.forEach(item => {
        if (item.bookedProOuterSize === '' || item.bookedProOuterSize === undefined || item.bookedProOuterSize === null) {
          item.bookedProOuterSize = item.outerSize;
        }
        if (item.bookedProInnerPerOuter === '' || item.bookedProInnerPerOuter === undefined || item.bookedProInnerPerOuter === null) {
          item.bookedProInnerPerOuter = this.calculateDivisionMethod(item.outerSize, item.tcSize);
        }
      });
    },
    showStatus(data) {
      console.log('点击显示状态按钮', data)
      if (data.status == 1) {
        return 'Cancel'
      }
      if (data.shipmentContainerStatusRes.length == 0) {
        function compare() {
          return function (a, b) {
            var value1 = a["status"];
            var value2 = b["status"];
            return parseInt(value1) - parseInt(value2);
          }
        }
        console.log('111', data)
        var arr = JSON.parse(JSON.stringify(data.shipmentStatusList))
        arr = arr.filter(item=> item.endDate!=null)
                console.log('111', arr)

        arr.sort(compare())
        return this.otherMilestones[arr[arr.length - 1].status]
      }
      if (data.shipmentContainerStatusRes.length > 0) {
        var move = data.shipmentContainerStatusRes[data.shipmentContainerStatusRes.length - 1]
        if (data.carrier == 'TSHG') {
          return this.containerStatus[move.eventCode] ? this.containerStatus[move.eventCode] : move.eventCode
        } else {
          return this.containerStatus[move.eventCode] ? this.containerStatus[move.eventCode] : move.descriptionEn
        }
      }
    },

    searchPortPor(query) {
      if (query.length >= 3) {

      }
    },
    clickPort(item) {
      this.loading = true;
      var flag = false;
      for (var i = 0; i < this.activities.length; i++) {
        if (this.activities[i].oha == item.oha) {
          if (this.activities[i].type == "primary") {
            this.activities[i].type = "";
            flag = true
          } else {
            this.activities[i].type = "primary";
          }
        } else {
          this.activities[i].type = "";
        }
        this.$set(this.activities, i, this.activities[i]);
      }
      if (flag) {

        this.$set(this.queryParams, 'oha', null)
      } else {
        this.$set(this.queryParams, 'oha', item.oha)
      }

      this.getList();
    },
    preAssgineOpen() {
      if (this.preAssgine.length == 0) {
        this.$notify({
          message: 'No selected po',
          type: 'warning'
        });
      } else {
        this.preAssgineVisable = true
      }
    },
    remoteMethod(query) {
      if (query !== "" && query.length >= 3) {
        getVesselList({ vesselName: query }).then((response) => {
          this.vesselListLes = response.data;
        });
      } else {
        this.vesselListLes = [];
      }
    },
    handleDialogClose(){
        this.queryParams2 = {
        ...this.queryParams2,
        mblNumber: '',
        soRef: '',
        soCarrierNumber: ''
      }
    },
    groupByOha() {
      groupByOha().then((res) => {
        var ids = []
        for (var i = 0; i < res.data.length; i++) {
          this.activities.push({
            oha: res.data[i].oha,
            count: res.data[i].count
          })
          if (res.data[i].oha != null) {
            ids.push(res.data[i].oha)
          }
        }
        console.log(ids)
        if (ids.length > 0) {
          this.getDeptList(ids)
        }

      })
    },
    getLoadingQty(bookingItem, shipmentList) {
      var qty = 0
      if (shipmentList && shipmentList.length > 0) {
        for (var j = 0; j < shipmentList.length; j++) {
          if (shipmentList[j].clpRes && shipmentList[j].clpRes.clpDetailResList) {
            for (var k = 0; k < shipmentList[j].clpRes.clpDetailResList.length; k++) {
              if (shipmentList[j].clpRes.clpDetailResList[k].orderItemId == bookingItem.id) {
                qty += shipmentList[j].clpRes.clpDetailResList[k].qty
              }
            }
          }

        }

      }
      return qty;
    },
    toAllocation(order, flag) {
      //localStorage.setItem('allocation', JSON.stringify(order));
      var week, carrier, lotNo
      if (order.shipmentResList.length > 0) {
        if (flag == 2) {
          week = order.shipmentResList[0].etdAllocation
        }
        carrier = order.shipmentResList[0].carrier
      }
      if (flag == 1) { lotNo = order.orderNumber }

      window.open('/bi/allocation?lotNo=' + lotNo + '&type=' + carrier + '&week=' + week)
    },
    //获取有BookingNumber的Carrier
    getBookingNumberCarrier(order) {
      if (order.shipmentResList.length > 0) {
        return order.shipmentResList[0].carrier
      }
      return ''
    },
    getContainerList() {
      getContainerList().then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          this.containerMap[response.data[i].type] = response.data[i].tue
        }
        this.getCustomFieldList();
      });
    },
    showContainers(list, filedName) {
      var data = list.filter((item) => item.type = 1 && item[filedName] != null)
      var text = ''
      for (var i = 0; i < data.length; i++) {
        text += data[i].containerNo + ": " + this.parseTime(data[i][filedName]) + "<br/>"
      }
      this.$alert(text, '', {
        dangerouslyUseHTMLString: true
      });
    },
    handleClick(el, order) {
      if(order.row.key.startsWith('fourth')){
        //根据po_number获取Order Number的所有文件种类数（最多6种）
/*        getFileInfoForOrder({'orderNumber' : order.row.orderNumber}).then(res =>{
          this.typeNumber = res.data.typeNumber;
          this.documentData = res.data.data;
        })*/

        this.$refs.viewPoManagementDocuments.getOrderFile(order.row.id)

      }

      if (el.index != '0' && !order.shipments) {
        order.shipments = true
      }
      //select shipments
      this.toggleLoading(order.id)
    },
    toggleDetails(index) {
      this.$set(this.expanded, index, !this.expanded[index]);
    },
    togglePreAssgine(index) {
      this.$set(this.preAssgine, index, !this.preAssgine[index]);
    },
    async toggleLoading(index) {
      this.$set(this.loadingMap, index, !this.loadingMap[index]);
    },
    showItems(order) {
      var value = Math.abs(order.show - 1)
      this.$set(order, 'show', value)
    },

    getCustomFieldList() {
      getCustomFieldList({}).then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].type == "order_header") {
            this.customFieldHeader.push(response.data[i]);
          } else {
            this.customFieldLine.push(response.data[i]);
          }
        }
        this.getList();
      });
    },
    getPortList() {
      findShippingSchedulePortList().then((res) => {
        for (var i = 0; i < res.data.length; i++) {
          this.$set(this.portMap, res.data[i].value, res.data[i].label)
        }
        this.getContainerList()
      })
    },
    getDeptList(ids) {
      var vm = this;
      getDeptList({ ids: ids.join(",") }).then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          vm.$set(vm.partyMap, response.data[i].id, response.data[i].name);
          vm.$set(vm.partyMap, response.data[i].id + 'code', response.data[i].supplierCode);
          vm.$set(vm.partyMap, response.data[i].id + 'type', response.data[i].supplierType);
        }

      });
    },
    getshippedTue(data) {
      var count = 0
      for (var i = 0; i < data.length; i++) {
        count += this.containerMap[data[i].containerType] * data[i].numbers
      }
      return count
    },
    toTack(vesselName) {
      window.open('/track/ship?vesselName=' + vesselName)
    },
    toOrder(po) {
      window.open('/order/POManagement?orderNumber=' + po)
    },
    submitBook() {
      var count = 0;
      var newData = [];
      for (var i = 0; i < this.reviewBookData.length; i++) {
        for (var j = 0; j < this.reviewBookData[i].tableData.length; j++) {
          count++;
        }
        if (this.reviewBookData[i].tableData.length > 0) {
          newData.push(this.reviewBookData[i]);
        }
      }
      if (count == 0) {
        this.$notify({
          message: "Please select a piece of data",
          type: "warning",
        });
      } else {
        sessionStorage.setItem("bookData", JSON.stringify(newData));
        this.openNewWindow("/shipment/booking-create")
      }
    },
    handleDelete(data, index) {
      data.splice(index, 1);
    },
    async getData() {
      var vm = this;
      vm.reviewBookData = [];
      if (JSON.stringify(this.preBookMap) === "{}") {
        this.$notify({
          message: "Please select order.",
          type: "warning",
        });
      } else {
        this.bookVisible = true;
        var productIds = [];
        var data = [];
        for (var key in this.preBookMap) {
          var bn = null
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].id != key || this.tableData[i].bookings.length == 0) {
              continue
            }
            for (var j = 0; j < this.tableData[i].bookings.length; j++) {
              if (this.tableData[i].bookings[j].status == 1) {
                continue
              }
              if (bn) {
                bn += ', <a target="_blank" class="el-link el-link--primary is-underline" href="/booking/booking?bookingNumber='
                  + this.tableData[i].bookings[j].bookingNumber + '">' + this.tableData[i].bookings[j].bookingNumber + '</a>'
              } else {
                bn = ' <a target="_blank" class="el-link el-link--primary is-underline" href="/booking/booking?bookingNumber='
                  + this.tableData[i].bookings[j].bookingNumber + '">' + this.tableData[i].bookings[j].bookingNumber + '</a>'
              }
            }
          }
          if (bn) {
            this.$confirm('Producer booking already created ' + bn + ',would you like to create another one?',
              '',
              {
                dangerouslyUseHTMLString: true,
                confirmButtonText: "Confirm",
                showCancelButton: false,
                type: 'warning'
              }).then(() => {
              }).catch(() => {
              });
          }

          var itemIds = [];
          for (var i = 0; i < this.preBookMap[key].length; i++) {
            itemIds.push(this.preBookMap[key][i].itemId);
          }
          var res = await getItemList({ ids: itemIds.join(",") });
          for (var i = 0; i < res.data.length; i++) {
            var line = this.preBookMap[key].find((item) => item.itemId == res.data[i].id);
            res.data[i].bookedQty = line.qty;
            productIds.push(res.data[i].productId);
          }
          data.push({
            poNumber: vm.orderNumberMap[key],
            orderId: key,
            tableData: res.data,
          });
        }
        getProductList({ ids: productIds }).then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            vm.productMapForBook[response.data[i].id] =
              response.data[i].name + "[" + response.data[i].code + "]";
          }
          vm.reviewBookData = data;
        });
      }
    },
    reviewBook() {
      this.getData();
    },
    clearAll() {
      this.preBookMap = {};
    },
    handleClose(key) {
      delete this.preBookMap[key];
      this.preBookMap = JSON.parse(JSON.stringify(this.preBookMap));
    },
    addAllToBooked(currentOrderId, tableDataLine) {
      if (tableDataLine.length == 0) {
        return;
      }
      var allFlag = true
      var itemIds = [];
      for (var i = 0; i < tableDataLine.length; i++) {
        if (tableDataLine[i].selected) {
          if (tableDataLine[i].bookedQty <= 0) {
            this.$notify({
              message: "Booked Qty must gt 0",
              type: "warning",
            });
            return;
          } else if (tableDataLine[i].bookedQty > tableDataLine[i].requested) {
            this.$notify({
              message: "Book qty exceed requested qty",
              type: "warning",
            });
          } else {
            this.$notify({
              message: "success",
              type: "success",
            });
          }
          allFlag = false
          itemIds.push({
            itemId: tableDataLine[i].id,
            qty: tableDataLine[i].bookedQty,
          });
        }
      }
      //是否有选择Book
      if (allFlag) {
        for (var i = 0; i < tableDataLine.length; i++) {
          this.$set(tableDataLine[i], 'checkCss', true)
        }
        this.$notify({
          message: "Mandatory field, please submit.",
          type: "warning",
        });
        return
      } else {
        for (var i = 0; i < tableDataLine.length; i++) {
          this.$set(tableDataLine[i], 'checkCss', false)
        }
      }
      var arr = this.preBookMap[currentOrderId] ? this.preBookMap[currentOrderId] : [];
      for (var i = 0; i < itemIds.length; i++) {
        var foundItem = arr.find(function (item) {
          return item.itemId === itemIds[i].itemId;
        });
        if (foundItem == null) {
          arr.push(itemIds[i]);
        }
      }
      this.$set(this.preBookMap, currentOrderId, arr);
    },
    getHeaderPage() {
      const params = {
        ...this.queryParams,
        containerNo: this.queryParams.containerNo ? this.queryParams.containerNo.trim() : null,
        orderNumber: this.queryParams.orderNumber ? this.queryParams.orderNumber.trim() : null
      };
      console.log('this')
      getHeaderTaskPage(params).then((response) => {
        this.tableData = response.data.records;
        this.vesselMap = {}
        if (this.tableData.length > 0) {
          var productIds = [];
          this.shipmentStatusMap = {}
          for (var i = 0; i < this.tableData.length; i++) {
            var task = this.tableData[i].orderTaskDOS.find(item => item.taskName ==this.tableData[i].taskStatus)
            console.log('tasl1',task)
            this.$set(this.tableData[i], 'taskStatusSeq', task ? task.seq : 0)
            this.tableData[i].show = 0
            this.tableData[i].key = 'first' + this.tableData[i].id
            this.orderNumberMap[this.tableData[i].id] = this.tableData[i].orderNumber
            for (var j = 0; j < this.tableData[i].items.length; j++) {
              productIds.push(this.tableData[i].items[j].productId);
            }
            for (var k = 0; k < this.tableData[i].shipmentResList.length; k++) {
              var tempCarrier = this.tableData[i].shipmentResList[k].carrier
              if ((tempCarrier && tempCarrier != 'TSHG') && this.tableData[i].shipmentResList[k].shipmentBookingNumber) {
                if (this.$auth.hasPermi("shipment:query")) {

                  trackByBookingNumber({
                    carrier: tempCarrier,
                    type: "bill",
                    bookingNumber: this.tableData[i].shipmentResList[k].shipmentBookingNumber
                  }).then((res) => {

                    if (res.data != null && res.data.statusCode == 20000) {
                      var vessles = res.data.data.result.vessel

                      var vesselMap = {}
                      for (var j = 0; j < vessles.length; j++) {
                        vesselMap[vessles[j].vessel] = vessles[j].imo
                      }
                      var statusList = res.data.data.result.places

                      var portStatusMap = {}
                      for (var k = 0; k < statusList.length; k++) {
                        if (!portStatusMap[statusList[k].code]) {
                          portStatusMap[statusList[k].code] = {}
                        }

                        portStatusMap[statusList[k].code]['etd'] = new Date(statusList[k].etd ? statusList[k].etd : statusList[k].atd)
                        portStatusMap[statusList[k].code]['eta'] = new Date(statusList[k].eta ? statusList[k].eta : statusList[k].ata)
                        if (statusList[k].atd) {
                          portStatusMap[statusList[k].code]['atd'] = new Date(statusList[k].atd)
                        }
                        if (statusList[k].ata) {
                          portStatusMap[statusList[k].code]['ata'] = new Date(statusList[k].ata)
                        }
                      }
                      if (res.data.data.result.containers.length > 0) {
                        var c_status = res.data.data.result.containers[0].status[res.data.data.result.containers[0].status.length - 1]
                        console.log(portStatusMap)
                        this.$set(this.shipmentStatusMap, res.data.data.result.billNo, {
                          status: c_status.descriptionEn + ":" + c_status.portCode,
                          movement: res.data.data.result.containers,
                          vesselMap: vesselMap,
                          portStatusMap: portStatusMap
                        })
                      }

                    }
                  })
                }
              } else {
                var containers = this.tableData[i].shipmentResList[k].containerDOList.filter((item) => item.type == 1)
                var pol = this.tableData[i].shipmentResList[k].originPort
                var pod = this.tableData[i].shipmentResList[k].destinationPort
                if (containers.length > 0) {
                  if (containers[0].actions != null) {
                    var statusList = JSON.parse(containers[0].actions)

                    var atdEvent = statusList.filter((item) => item.location.trim() == this.portMap[pol] && item.event == 'LOAD FULL')
                    if (atdEvent.length > 0) {
                      this.tableData[i].shipmentResList[k].atd = new Date(atdEvent[0].date_track)
                    }

                    var ataEvent = statusList.filter((item) => item.location.trim() == this.portMap[pod] && item.event == 'DISCHARGE FULL')
                    if (ataEvent.length > 0) {
                      this.tableData[i].shipmentResList[k].ata = new Date(ataEvent[0].date_track)
                    }
                  }

                }
              }
            }
            console.log('orderData',this.tableData[i].orderTaskDOS)

            // Ethan: 保存一份完整里程碑
            this.tableData[i].milestones = [...this.tableData[i].orderTaskDOS]
            // 过滤里程碑
            this.tableData[i].orderTaskDOS = this.filterOrderTasksByUser(this.tableData[i].orderTaskDOS)
            console.log('taskdata',this.tableData[i].orderTaskDOS)
          }
          this.getItems(productIds);
          this.itemQueryParams.orderId = this.tableData[0].id;
          var partyIds = [];
          for (var i = 0; i < this.tableData.length; i++) {
            partyIds.push(this.tableData[i].buyer);
            partyIds.push(this.tableData[i].seller);
            partyIds.push(this.tableData[i].oha);
            var bookingNumbers = []
            for (var j = 0; j < this.tableData[i].bookings.length; j++) {
              bookingNumbers.push(this.tableData[i].bookings[j].bookingNumber);
            }
            this.bookingNameMap[this.tableData[i].id] = bookingNumbers;
          }
          this.getDeptList(partyIds);
        }
        this.total = response.data.total;
        this.loading = false;
      });
    },
    downloadOrderData() {
      if (this.tableData.length == 0) {
        this.$notify({
          title: 'warning',
          message: 'No data to export',
          type: 'warning'
        });
        return
      }
      this.$confirm('Confirm the download?\n Note that a maximum of 60,000 pieces of data can be downloaded at a time.', 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
          this.downloadOrderLoading = true
        downloadOrderListData(this.queryParams).then((response) => {
          this.$download.excel(response, "order_data" + this.parseTimeToZ2(new Date()) + ".xlsx");
            this.$notify({
              title: 'success',
              message: 'Download Success',
              type: 'success'
            });
            this.downloadOrderLoading = false
          });
        })
        .catch(() => {
          this.downloadOrderLoading = false;
        });
    },
    changePage() {
      this.loading = true;
      this.getHeaderPage()
    },
    getList() {
      this.loading = true;
      this.filterPopover=false
      this.getTaskNames()
      this.getHeaderPage()
      // this.orderReport()
    },
    async showProduct(shipment) {
      var res = await getItemList({ ids: shipment.itemIds.join(",") });
      var productIds = [];
      for (var i = 0; i < res.data.length; i++) {
        productIds.push(res.data[i].productId);
      }
      var res1 = await getProductList({ ids: productIds });
      var data = [];
      for (var i = 0; i < res1.data.length; i++) {
        data.push({ code: res1.data[i].code, name: res1.data[i].name });
      }
      this.$set(this.shipmentItemMap, shipment.id, data);
    },
    getItems(productIds) {
      getProductList({ ids: productIds }).then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          this.productMap[response.data[i].id] = {
            name: response.data[i].name,
            code: response.data[i].code,
            chineseName: response.data[i].chineseName,
            category: response.data[i].category,
            tcId: response.data[i].tcId,
          };
        }
      });
    },
    clickTr(row) {
      //this.itemVisable = true;
      this.$nextTick(() => {
        this.itemQueryParams.orderId = row.id;
        this.orderNumberMap[row.id] = row.orderNumber;
        //this.getItems();
        this.title = row.orderNumber + ":PO Items";
      });
    },
    calcTableHeight() {
      const clientHeight = document.documentElement.clientHeight;
      this.tableHeight = clientHeight - 302;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.$modal
        .confirm(this.$t("purchaseOrder.confirmThatAllDataItemsAreExported"))
        .then(() => {
          // 处理查询参数
          let params = { ...this.queryParams };
          params.pageNo = undefined;
          params.pageSize = undefined;
          this.exportLoading = true;
          return exportPO(params);
        })
        .then((response) => {
          this.$download.excel(response, "smartMOOV_PO" + this.parseTimeToZ2(new Date()) + ".xlsx");
          this.exportLoading = false;
        })
        .catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport1() {
      this.$modal
        .confirm(this.$t("purchaseOrder.confirmThatAllDataItemsAreExported"))
        .then(() => {
          // 处理查询参数
          let params = { ...this.queryParams };
          params.pageNo = undefined;
          params.pageSize = undefined;
          this.exportLoading = true;
          return exportPO1(params);
        })
        .then((response) => {
          this.$download.excel(response, "smartMOOV_PO1" + this.parseTimeToZ2(new Date()) + ".xlsx");
          this.exportLoading = false;
        })
        .catch(() => { });
    },

    headerCellStyle({ column, columnIndex }) {
      if (columnIndex === 0) {
        return "hiddenCheck";
      }
    },
    // 能否被选中：如果状态为SO Release to Supplier，且未被预定，则可以选中
    canBeSelect(row) {
      if(row.taskStatus == 'Shipper Booking'&&row.booked==false){
        if(row.shippingCancel != null && row.shippingCancel == false && row.shippingOrderStatus == 2){
          //如果是被回退的shipping booking 并且还没有cancel 那不允许重新做
          return false
        }
        // 如果shippingId存在，说明已经shipping booking
        if (row.shippingId) {
          return false
        }
        return true
      }
      return  false
    },
    handleSelection(selection, row) {
      // row 不在 selection 中时，是取消勾选
      if (row.booked) {
        this.$message({
          message: 'The current order has been generated as a shipper order, so you cannot check this option.',
          type: 'warning'
        })
        return
      }
      this.$refs.selectedListBox.refresh(selection, row);
    },
    // 取消选中
    handleRemoveRow(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    parseTimeToZ1(timestamp) {
      if (!timestamp) return null
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    parseTimeToZ2(timestamp) {
      if (!timestamp) return null
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      return `${year}${month}${day}${hours}${minutes}`;
    },
    /** 导入按钮操作 */
    handleImport() {
      console.log(111)
      this.upload.title = "Import";
      this.upload.open = true;
      this.upload.url = process.env.VUE_APP_BASE_API + "/admin-api/order/pepco/import";
    },

    uploadClose() {
      this.uploadDocument.open = false
      this.uploadDocument.formData.type = ''
      this.uploadDocument.formData.documentNumber = ''

    },
    /** 更新上传按钮操作 */
    handleUpload(row) {
      console.log("ddddddd")
      this.uploadDocument.loading = false;
      this.uploadDocument.title = "Upload";
      this.uploadDocument.isUploading = false;
      this.uploadDocument.open = true;
      this.uploadDocument.url = process.env.VUE_APP_BASE_API + "/admin-api/order/pepco/upload" + '?orderNumber=' + row.orderNumber;
    },



    /** 下载模板操作 */
    importTemplate() {
      importPepcoTemplate().then((response) => {
        this.$download.excel(response, "PO Upload TempLate.xlsx");
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
        this.$refs.upload.clearFiles();
        return;
      }
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      // 拼接提示语
      let data = response.data.failureOrderNumber;
      if (data.length > 0) {
        this.uploadError.data = data
        this.uploadError.dialogVisible = true
      } else {
        this.getList();
      }
    },
    // 文件上传成功处理
    handleUploadFileSuccess(response, file, fileList) {
      if (response.code !== 0) {
        this.$modal.msgError('Upload Fail');
        this.$refs.uploadShipmentDocument.clearFiles();
        return;
      }
      this.uploadDocument.formData.type = ''
      this.uploadDocument.formData.documentNumber = ''
      this.uploadDocument.open = false;
      this.uploadDocument.isUploading = false;
      this.$refs.uploadShipmentDocument.clearFiles();
      this.$notify({ type: 'success', message: 'Upload Successful' })
    },
    // 文件上传失败处理
    handleFileError(err, file, fileList) {
      console.log(err)
      this.$refs.upload.clearFiles();
    },
    // 文件上传失败处理
    handleUploadFileError(err, file, fileList) {
      console.log(err)
      this.$refs.uploadShipmentDocument.clearFiles();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    handeDocumentNumberTrim(value) {
      this.uploadDocument.formData.documentNumber = value.trim();
    },
    // 提交上传文件upload
    submitFileFormUpload() {
      // this.$refs.uploadShipmentDocument.submit();
      this.$refs["uploadDocumentForm"].validate((valid) => {
        if (valid) {
          if (this.$refs.uploadShipmentDocument.uploadFiles == null || this.$refs.uploadShipmentDocument.uploadFileslength == 0) {
            this.$notify({
              message: 'Please add files before uploading',
              type: 'warning'
            });
            return
          }
          this.uploadDocument.loading = true
          this.uploadDocument.formData.exId = this.$route.query.id;
          this.uploadDocument.formData.createTime = ''
          this.uploadDocument.formData.updateTime = ''
          if (this.uploadDocument.formData.email == 'null') {
            this.uploadDocument.formData.email = ''
          }
          if (this.uploadDocument.formData.type == '3') {
            this.uploadDocument.formData.type2 = ''
            this.uploadDocument.formData.email = ''
            this.uploadDocument.formData.sendEmail = false
          }
          if (this.showSendEmail) {
            this.$refs.uploadShipmentDocument.submit();
          } else {
            if (this.$refs.uploadShipmentDocument.uploadFiles.length > 0 && this.$refs.uploadShipmentDocument.uploadFiles[0].id == null) {
              this.$set(this.uploadDocument, 'tempaax', 1)
              this.$delete(this.uploadDocument, 'tempaax');
              this.$refs.uploadShipmentDocument.submit();
            } else {
              this.updateDocumentFile()
            }
          }
        }
      })
    },
    async handleTask(task) {
      console.log('提交任务', task.taskName, task)
      console.log('handleTask',  task)
      this.view = false
      this.task = task
      this.form = {}
      // 更新rowInfo edwin
      await this.fetchAndUpdateRowInfo(task);
      //this.title=task.orderNumber+'['+task.taskName+']'
      //zane 除了这个task，其他task都关闭弹窗
      if(task.taskName !== "Pepco Booking Approval") {
          this.taskDetailDataVisible = false
      }

      if (task.taskName == 'SI/VGM Submit to Carrier') {
        this.openNewWindow("/shipment/detail?id=" + this.rowInfo.shipmentId)
      } else
      if (task.taskName == 'SI/VGM Submit') {
        this.openNewWindow("/shipment/ppShippingOrder?customerRef=" + task.orderNumber)
      } else
      if (task.taskName == 'Assign Transport Plan') {
        this.openNewWindow("/shipment/ppShippingOrderList?shipperRef=" + task.orderNumber)
      } else
      if (task.taskName == 'Documentation Check') {
        this.documentationCheckFormVisible = true
      } else if (task.taskName == 'Cargo Ready Date') {
        const orderTask = await getHeaderTasksByOrderNumbers({ orderNumbers: task.orderNumber })
        if (orderTask.data) {
          this.crdInfo = {
            ...orderTask.data[0],
            orderTaskId: this.task.id
          }
          this.cargoReadyDateFormVisible = true
        }
      } else if (task.taskName == 'Dimensions') {
        this.dimensionsFormVisible = true
      } else if (task.taskName == 'Nominate Shipping Week') {
        this.nominateShippingWeekFormVisible = true
      } else if (task.taskName == 'Update Cargo handover date') {
        this.crdFormVisible = true
      } else if (task.taskName == 'Inspection Date') {
        this.inspectionFormVisible = true
      } else if (task.taskName == 'Verify Shipping Documents') {
        this.$refs.verifyDocumentHandler.openDialog(task,true)
        // this.$refs.verifyDocuments.openDialog(task,'Upload_Shipping_Documents')
      } else if (task.taskName == 'QC Approve') {
        this.qcFormVisible = true
      } else if (task.taskName == 'Shipper Booking') {
        console.log(this.rowInfo)
        console.log(task)
        //有shippingOrderStatus就表示已经做了shipping
        if(task.booked==true || this.rowInfo.shippingOrderStatus != null) {
          this.openNewWindow('/shipment/updatePpShippingOrder?id=' + this.rowInfo.shippingId)
          // this.$modal.msgError('Already being used as draft shipper booking');
          return;
        }
        localStorage.setItem('shipping-selectedPoList', JSON.stringify([this.rowInfo]))
        this.openNewWindow('/shipment/ppCreateShippingOrder')
      } else if (task.taskName == 'Shipper Booking Validation') {
        this.openNewWindow("/shipment/ppShippingOrderList?shipperRef="+ task.orderNumber)
      } else if (task.taskName == 'Booking Order') {
        if (this.$auth.hasPermi("booking:create")) {
          this.bookingFormVisible = true
          getListByCondition({ orderId: task.orderId }).then((res) => {
            this.itemList = res.data
          })
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      } else if (task.taskName == 'Validate shipper booking' || task.taskName == 'Validate Booking Order') {
        console.log(task)
        if (this.$auth.hasPermi("booking:query")) {
          this.openNewWindow("/shipment/booking-detail?id=" + JSON.parse(task.jsonData).bookingId)
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
        console.log("/shipment/booking-detail?id=" + JSON.parse(task.jsonData).bookingId)
      } else if (task.taskName == 'Carrier Booking') {

        if (this.$auth.hasPermi("shipment:create")) {
          this.openNewWindow("/shipment/ppShippingOrderList?shipperRef=" + task.orderNumber)
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      } else if (task.taskName == 'Booking Confirmation') {
        if (this.$auth.hasPermi("shipment:query")) {
          this.openNewWindow("/shipment/detail?id=" + this.rowInfo.shipmentId)
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      } else if (task.taskName == 'Inspection Status') {
        this.form = { orderList: [] }
        getSoRelatedPo({ orderId: task.orderId }).then((res) => {
          if (res.data) {
            if (res.data.shippingOrderItems.length == 0) {
              this.form.orderList = [task.orderId]
              this.soRelatedPoList = [{ orderId: task.orderId, orderNumber: task.orderNumber, disabled: true }]
            } else {
              res.data.shippingOrderItems.forEach(item => {
                console.log('shippingOrderItems', item)
                this.form.orderList.push(item.orderHeaderId)
              })
              this.soRelatedPoList = res.data.shippingOrderItems
            }
          }
        })
        this.qcFormVisible = true
      } else if (task.taskName == 'SO Release to Supplier') {
        this.form = { orderList: [], soReleasedDate: undefined }
        getSoRelatedPo({ orderId: task.orderId }).then((res) => {
          if(res.data){
            if (res.data.shippingOrderItems.length == 0) {
              this.form.orderList = [task.orderId]
              this.soRelatedPoList = [{ orderId: task.orderId, orderNumber: task.orderNumber, disabled: true }]
            } else {
              res.data.shippingOrderItems.forEach(item => {
                console.log('shippingOrderItems',item)
                this.form.orderList.push(item.orderHeaderId)
              })
              this.soRelatedPoList = res.data.shippingOrderItems
            }
          }
        })
        this.soReleasedVisible = true
      } else if (task.taskName == 'Cargo Receive Date'
        || task.taskName == 'Cargo Inbound'
        || task.taskName == 'Container Gate In') {
        // Cargo Inbound
        if (task.taskName === 'Cargo Inbound') {
          this.cargoInboundInfo = {
            orderId: task.orderId,
            label: task.taskName,
            orderNumber: task.orderNumber,
            shippingId: task.shippingId,
            id: task.id,
            shipmentId: this.rowInfo.shipmentIds && this.rowInfo.shipmentIds.length > 0 ? this.rowInfo.shipmentIds[0] : null,
            taskName: task.taskName,
            jsonData: task.jsonData,
            cargoHandoverDate: task.cargoHandoverDate,
            actualCargoHandoverDate: task.actualCargoHandoverDate
          }
          console.log(task, '----------------')
          if (task.status === 2) {
            // 更新操作
            this.cargoInboundUpdateVisible = true
          } else {
            // 提交操作
            this.cargoInboundVisible = true
          }
        } else {
          // Container Gate In
          this.form = {
            orderList: [],
            cargoHandoverDate: undefined,
            taskName: task.taskName,
            shipmentId: this.rowInfo.shipmentIds && this.rowInfo.shipmentIds.length > 0 ? this.rowInfo.shipmentIds[0] : null
          }
          if (task.jsonData) {
            try {
              const jsonData = typeof task.jsonData === 'string'
                ? JSON.parse(task.jsonData)
                : task.jsonData;
              this.form.cargoHandoverDate = jsonData.cargoHandoverDate || null;
            } catch (error) {
              console.error('解析 jsonData 失败:', error);
              this.form.cargoHandoverDate = null;
            }
          } else {
            this.form.cargoHandoverDate = null;
          }
          getSoRelatedPo({ orderId: task.orderId }).then((res) => {
            if(res.data){
              if (res.data.shippingOrderItems.length == 0) {
                this.form.orderList = [task.orderId]
                this.soRelatedPoList = [{ orderId: task.orderId, orderNumber: task.orderNumber, disabled: true }]
              } else {
                res.data.shippingOrderItems.forEach(item => {
                  console.log('shippingOrderItems',item)
                  this.form.orderList.push(item.orderHeaderId)
                })
                this.soRelatedPoList = res.data.shippingOrderItems
              }
            }
          })
          this.cargoHandoverDateFormVisible = true
        }
      }
      else if (task.taskName == 'Empty Pick up') {
        this.pickupFormVisible = true
      } else if (task.taskName == 'Container Loading Plan' || task.taskName == 'CLP') {
        console.log('进入Container Loading Plan', task)
        // 判断所有order task 是否都进到clp待完成状态
        console.log(this.rowInfo.shipmentId)
          // getPoTaskStatusByShipmentId(this.rowInfo.shipmentId).then((response)=> {
          //   console.log(task)
          //   console.log(response.data)
          // const tempOrder = response.data.find(item => item.id === task.orderId) || null;
          // console.log(tempOrder)
          // const soList = response.data.filter(item => item.soRef === tempOrder.soRef);
          // console.log(soList)
          // const loadingPlans = soList.filter(item => item.taskStatus === 'Container Loading Plan');
          // console.log(loadingPlans)
          // if(soList.length!=0 && loadingPlans.length== soList.length) {
            // if (this.$auth.hasPermi("shipment:clp:create")) {
              this.openNewWindow("/shipment/clp/add?shipmentId=" + (JSON.parse(task.jsonData).shipmentId)  + '&orderNumber=' + task.orderNumber + '&orderId=' + task.orderId + '&soRef=' + task.soRef)
            // } else {
            //   this.$modal.msgError('No permission, please find the administrator to apply');
            // }
          // } else {
            // this.$refs.checkOrderStatusDialog.openDialog(soList,'Container Loading Plan')
          // }
        //  })
      } else if (task.taskName == 'Container stuffing') {
        this.containerStuffingFormVisible = true
      } else if (task.taskName == 'SI Submit') {
        if (this.$auth.hasPermi("shipment:query")) {
          this.openNewWindow("/shipment/detail?id=" + JSON.parse(task.jsonData).shipmentId)
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      } else if (task.taskName == 'Origin Customs Clearance') {
        this.customClearanceFormVisible = true
      } else if (task.taskName == 'Gate in') {
        if (this.$auth.hasPermi("shipment:query")) {
          this.openNewWindow("/shipment/detail?id=" + JSON.parse(task.jsonData).shipmentId)
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      } else if (task.taskName == 'Vessel Departure') {
        if (this.$auth.hasPermi("shipment:query")) {
          this.openNewWindow("/shipment/detail?id=" + JSON.parse(task.jsonData).shipmentId)
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      }  else if (task.taskName == 'Upload Shipping Documents') {
        this.$refs.uploadOrderFile.openDialog(task,this.rowInfo.taskStatus)
        // this.handleUpload(task)
      }else if (task.taskName == 'Release HBL and Invoice to Shipper') {
        this.$refs.uploadOrderFileHbl.openDialog(task)
        // this.drawer = false
      } else if (task.taskName == 'BL Upload') {
        if (this.$auth.hasPermi("shipment:query")) {
          this.openNewWindow("/shipment/detail?id=" + this.rowInfo.shipmentId)
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      } else if (task.taskName == 'HBL Release') {
        if (this.$auth.hasPermi("shipment:hbl:create")) {
          this.openNewWindow("/shipment/Hbl?shipmentId=" + this.rowInfo.shipmentId)
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      } else if (task.taskName == 'Vessel Arrival') {
        if (this.$auth.hasPermi("shipment:query")) {
          this.openNewWindow("/shipment/detail?id=" + this.rowInfo.shipmentId)
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      } else if (task.taskName == 'Departure LPOD') {
        if (this.$auth.hasPermi("shipment:query")) {
          this.openNewWindow("/shipment/detail?id=" + this.rowInfo.shipmentId)
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      } else if (task.taskName == 'Arrival inland terminal') {
        if (this.$auth.hasPermi("shipment:query")) {
          this.openNewWindow("/shipment/detail?id=" + this.rowInfo.shipmentId)
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      } else if (task.taskName == 'Empty Return') {
        if (this.$auth.hasPermi("shipment:query")) {
          this.openNewWindow("/shipment/detail?id=" + this.rowInfo.shipmentId)
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
      } else if (task.taskName == 'Pre Alert') {
        console.log('进入Container Loading Plan', task)
        console.log('111111',this.rowInfo)
        // 判断所有order task 是否都进到clp待完成状态
        console.log(JSON.parse(task.jsonData))
        console.log('task.jsonData', JSON.parse(task.jsonData).shipmentId)
        this.$refs.preAlertHandler.openDialog(task, this.rowInfo.taskStatus, null, true)

        //   getPoMilestonsStatusByShipmentId(JSON.parse(task.jsonData).shipmentId).then((response)=> {
        //     console.log('查询返回的结果',response.data)
        //   const falseArray = response.data?.['false'] || []
        //   if(falseArray.length == 0 ) {

        //     var notInputContainer = false
        //     // 查询是否clp是Pedding return
        //     pepcoGetClpByShipmentId(this.rowInfo.shipmentId).then((response) => {
        //       console.log(response.data)
        //       for (var booking of response.data) {
        //         if (booking.soType == 'LCL' && booking.status == 'Padding') {
        //           notInputContainer = true
        //         }
        //       }
        //       if (notInputContainer) {
        //         this.$message({
        //           message: 'Please Update CLR LCL Container Number First',
        //           type: 'warning'
        //         })
        //         return
        //       } else {
        //         getPoHblImportStatusByOrderHeaderId(this.rowInfo.id).then((response) => {
        //           console.log('查询返回的结果2', response.data)
        //           const falseHblArray = response.data?.['false'] || []
        //           if(falseHblArray.length == 0){
        //             this.$refs.preAlert.openDialog(task, this.rowInfo.taskStatus, null, true)
        //           }else{
        //             this.$refs.preAlertCheckOrderStatusDialog.openDialog(falseHblArray, 'No HBL Number')
        //           }
        //         })
        //       }
        //     })
        //   } else {
        //     console.log('未完成 verify document 的po',falseArray)
        //     this.$refs.preAlertCheckOrderStatusDialog.openDialog(falseArray,'Verify Shipping Documents')
        //   }
        // })


      }else if(task.taskName=='Pepco Booking Score'){
        this.openNewWindow("/shipment/ppBookingScore")
          // 跳转到pepco booking score页面
          // this.pepcoBookingScoreMethods(task)
        }else if(task.taskName == 'Pepco Booking Approval'){
          const url = `/shipment/ppShippingOrderList?shipperRef=${task.orderNumber}`;
          window.open(url, '_blank', 'noopener,noreferrer');
      } else if(task.taskName=='Document Verification Complete'){
        // 获取po对应shipper order下的所有的po文件
          this.$refs.verifyDocuments.openDialog(task,'all')
          // this.verifyShippingDocuments(task)
      }else if(task.taskName == 'Customs Broker Assign'){
        this.customsBrokerAssignedMethods(task)
      }
    },

    viewQcResult(task) {
      this.qcFormVisible = true
      this.view = true
      //this.title=task.orderNumber+'['+task.taskName+']'
      this.form = JSON.parse(task.jsonData)
      console.log(this.form.file)
      const base64String = this.form.file.split(',')[1];
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      // Create Blob using the provided MIME type from the base64 prefix
      const mimeType = this.form.file.split(',')[0].split(':')[1].split(';')[0];
      const blob = new Blob([byteArray], { type: mimeType });

      // Create download link
      this.downloadLink = URL.createObjectURL(blob);
      console.log(this.downloadLink);
    },
    async viewTask(task) {
      console.log(task)
      this.view = true
      //this.title=task.orderNumber+'['+task.taskName+']'
      this.form = JSON.parse(task.jsonData)
      console.log(this.form)
      // 更新rowInfo
      await this.fetchAndUpdateRowInfo(task)
      console.log('this.rowInfo', this.rowInfo)
      if (task.taskName == 'Shipper Booking Validation') {
        this.openNewWindow("/shipment/ppShippingOrderList?shipperRef=" + task.orderNumber)
      } else
      if (task.taskName == 'Pre Alert') {
        const currentTask = this.rowInfo.milestones.find(v=>v.status==1)||{}
        this.$refs.preAlertHandler.openDialog(task, currentTask.taskName, currentTask.seq, false)
      } else
      if (task.taskName == 'SI/VGM Submit to Carrier') {
        this.openNewWindow("/shipment/detail?id=" + this.rowInfo.shipmentId)
      } else
      if (task.taskName == 'SI/VGM Submit') {
        // 如果不是Supplier,直接跳转到pepco shipping order detail页面
        if (this.userCompanyTypeList && this.userCompanyTypeList.includes('Supplier')) {
          this.openNewWindow("/shipment/ppShippingOrder?customerRef=" + task.orderNumber)
        } else {
          this.openNewWindow("/shipment/ppShippingOrderDetail?id=" + this.rowInfo.shippingId + '&source=shipping-order')
        }
      } else
      if (task.taskName == 'Assign Transport Plan') {
        this.openNewWindow("/shipment/ppShippingOrderList?shipperRef=" + task.orderNumber)
      } else
      if (task.taskName == 'Documentation Check') {
        this.documentationCheckFormVisible = true
      } else if (task.taskName == 'Shipper Booking') {
        console.log(this.rowInfo)
        console.log(task)
        this.openNewWindow("/shipment/ppShippingOrderDetail?id=" + JSON.parse(task.jsonData).shippingId)
      }else if(task.taskName == 'Pepco Booking Approval'){
        console.log(this.rowInfo)
        console.log(task)
        this.openNewWindow("/shipment/ppShippingOrderDetail?id=" + this.rowInfo.shippingId)
      }else if (task.taskName == 'Validate shipper booking') {
        if (this.$auth.hasPermi("booking:query")) {
          this.openNewWindow("/shipment/ppShippingOrderDetail?id=" + JSON.parse(task.jsonData).bookingId)
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
        console.log("/shipment/ppShippingOrderDetail?id=" + JSON.parse(task.jsonData).bookingId, '_blank')
      } else if (task.taskName == 'Cargo Ready Date') {
        this.crdInfo = task
        this.onlyView = true
        this.form ={}
        // this.form.cargoReadyDate = this.parseTimeToZ1(this.rowInfo.cargoReadyDate)
        this.$set(this.form, 'cargoReadyDate', this.parseTimeToZ1(this.rowInfo.cargoReadyDate))
        this.$forceUpdate()
          this.cargoReadyDateFormVisible = true
        } else if (task.taskName == 'Dimensions') {
          // 增加dimensionsFormVisible edwin
          this.dimensionsFormVisible = true
        } else if (task.taskName == 'Nominate Shipping Week') {
          this.nominateShippingWeekFormVisible = true
        } else
          if (task.taskName == 'Update Cargo handover date') {
            this.crdFormVisible = true
          } else if (task.taskName == 'Inspection Date') {
            this.inspectionFormVisible = true
          } else if (task.taskName == 'Booking Order') {
            this.openNewWindow("/shipment/booking-detail?id=" + this.form.bookingId)
          } else if (task.taskName == 'Validate shipper booking') {
            this.$alert('Pass', 'Result', {
              confirmButtonText: 'Ok',
              callback: action => {

              }
            });
          } else if (task.taskName == 'Carrier Booking') {
            this.openNewWindow("/shipment/detail?id=" + this.rowInfo.shipmentId)
          } else if (task.taskName == 'Booking Confirmation') {
            console.log('Booking Confirmation', task)
            this.$alert('Date:' + JSON.parse(task.jsonData).bookingConfirmationDate + '<br/>' + 'Booking Number:' + JSON.parse(task.jsonData).shipmentBookingNumber, 'Booking Confirmation', {
              confirmButtonText: 'OK',
              dangerouslyUseHTMLString: true,
              callback: action => {
              }
            });
          } else if (task.taskName == 'SO Release to Supplier') {
            this.soReleasedVisible = true
          } else if (task.taskName == 'Cargo Handover Date'
            || task.taskName == 'Confirm Cargo Handover Date to CFS'
            || task.taskName == 'Confirm Cargo Handover Date to CY'
            // 以下三个为正式的名字，上面的是测试环境做适配的，后面直接删掉 edwin
            || task.taskName == 'Cargo Receive Date'
            || task.taskName == 'Cargo Inbound'
            || task.taskName == 'Container Gate In') {
            // this.form = {
            //   cargoHandoverDate: this.form.cargoHandoverDate,
            //   taskName: task.taskName
            // }
            // // 增加cargo handvoer date edwin
            // this.cargoHandoverDateFormVisible = true
            this.cargoInboundInfo = {
              orderId: task.orderId,
              label: task.taskName,
              orderNumber: task.orderNumber,
              shippingId: task.shippingId,
              id: task.id,
              shipmentId: this.rowInfo.shipmentIds && this.rowInfo.shipmentIds.length > 0 ? this.rowInfo.shipmentIds[0] : null,
              taskName: task.taskName,
              jsonData: task.jsonData,
              cargoHandoverDate: task.cargoHandoverDate,
              actualCargoHandoverDate: this.form.cargoHandoverDate
            }
            this.isCargoInboundOnlyView = true
            this.cargoInboundUpdateVisible = true
          }
          else if (task.taskName == 'Empty Pick up') {
            this.pickupFormVisible = true
          } else if (task.taskName == 'Container Loading Plan' || task.taskName == 'CLP') {
            console.log(JSON.parse(task.jsonData))
            this.openNewWindow("/shipment/clp/detail?id=" + JSON.parse(task.jsonData).clpId)
          }else if (task.taskName == 'Upload Shipping Documents') {
            const currentTask = this.rowInfo.milestones.find(v=>v.status==1)||{}
            this.$refs.uploadOrderFile.openDialog(task, currentTask.taskName,currentTask.seq)
            // this.handleUpload(task)
      } else if (task.taskName == 'Container stuffing') {
            this.containerStuffingFormVisible = true
          } else if (task.taskName == 'SI Submit') {
            this.openNewWindow("/shipment/detail?id=" + this.rowInfo.shipmentId)
          } else if (task.taskName == 'Origin Customs Clearance') {
            this.customClearanceFormVisible = true
          } else if (task.taskName == 'Gate in') {
            this.$alert('Event Time:' + JSON.parse(task.jsonData).eventTime + '<br/>' + 'Vessel:' + JSON.parse(task.jsonData).vessel
              + '<br/>' + 'Voyage:' + JSON.parse(task.jsonData).voyage, 'Gate in', {
              confirmButtonText: 'OK',
              dangerouslyUseHTMLString: true,
              callback: action => {
              }
            });
          } else if (task.taskName == 'BL Upload') {
            this.openNewWindow("/shipment/detail?id=" + this.rowInfo.shipmentId)
          } else if (task.taskName == 'Vessel Departure') {
            this.$alert('ATD:' + JSON.parse(task.jsonData).atd, 'Vessel Departure', {
              confirmButtonText: 'OK',
              dangerouslyUseHTMLString: true,
              callback: action => {
              }
            });
          } else if (task.taskName == 'HBL Release') {
            this.openNewWindow("/shipment/Hbl?hblNumber=" + JSON.parse(task.jsonData).hblNumber)
          } else if (task.taskName == 'Vessel Arrival') {
            this.$alert('ATA:' + JSON.parse(task.jsonData).atd, 'Vessel Arrival', {
              confirmButtonText: 'OK',
              dangerouslyUseHTMLString: true,
              callback: action => {
              }
            });
          } else if (task.taskName == 'Departure LPOD') {
            this.$alert('Departure LPOD Date:' + JSON.parse(task.jsonData).departurePodDate, 'Departure LPOD', {
              confirmButtonText: 'OK',
              dangerouslyUseHTMLString: true,
              callback: action => {
              }
            });
          } else if (task.taskName == 'Arrival inland terminal') {
            this.$alert('Arrival inland terminal Date:' + JSON.parse(task.jsonData).arrivalInlandTerminalDate, 'Arrival inland terminal', {
              confirmButtonText: 'OK',
              dangerouslyUseHTMLString: true,
              callback: action => {
              }
            });
          } else if (task.taskName == 'Empty Return') {
            this.$alert('Event Time:' + JSON.parse(task.jsonData).eventTime, 'Empty Return', {
              confirmButtonText: 'OK',
              dangerouslyUseHTMLString: true,
              callback: action => {
              }
            });
          }else if(task.taskName == 'Customs Broker Assign'){
            this.viewCustomsBrokerAssignedMethods(task)
          } else if(task.taskName == 'Pepco Booking Score'){
            this.showBookingScore(task)
          } else if(task.taskName == 'Release HBL and Invoice to Shipper'){
            console.log('---------------Release HBL and Invoice to Shipper----------------------')
            const currentTask = this.rowInfo.milestones.find(v=>v.status==1)||{}
            this.$refs.uploadOrderFileHbl.openDialog(task,currentTask.taskName,currentTask.seq)
          }else if(task.taskName == 'Verify Shipping Documents'){
            this.$refs.verifyDocuments.openDialog(task,'Upload_Shipping_Documents')
          }else if(task.taskName == 'Document Verification Complete'){
            this.$refs.verifyDocuments.openDialog(task,'all')
          }
    },
    submitTask() {
      console.log("submitTask上传成功")
      console.log("this.task.taskName")
      console.log(this.task.taskName)
      if (this.task.taskName === 'Cargo Ready Date') {
        const currentYear = new Date().getFullYear()
        const cargoReadyYear = new Date(this.form.cargoReadyDate).getFullYear()
        if (Math.abs(cargoReadyYear - currentYear) > 0) {
          this.$confirm(<div>The year you submit is <span class="warning">{ cargoReadyYear }</span>, there is a situation of crossing years. Do you confirm the submission? </div>, "Warning", {
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            this.submit()
          })
        } else {
          this.submit()
        }
      } else {
        this.submit()
      }
    },
    submit() {
      if (this.task.taskName == 'Booking Order') {
        for (var i = 0; i < this.itemList.length; i++) {
          if (this.itemList[i].bookedQty > this.itemList[i].requested) {
            this.$notify({
              message: "Book qty exceed requested qty",
              type: "warning",
            });
          }
        }
        var bookData = [{
          orderId: this.task.orderId,
          poNumber: this.task.orderNumber,
          tableData: this.itemList
        }]
        sessionStorage.setItem("bookData", JSON.stringify(bookData));
        this.openNewWindow("/shipment/booking-create")
      } // 新增里程碑
      else if (this.task.taskName == 'Dimensions') {
        // 校验失败则中断提交
        if (!this.validateDimensionsFields(this.rowInfo.items)) {
          return;
        }

        const invalidRows = this.rowInfo.items.filter(row => row.invalidFields && row.invalidFields.size > 0);

        if (invalidRows.length > 0) {
          this.$message.error('Please correct all invalid numeric fields before submitting.');
          return;
        }

        let overConvention = false
        let overWeight = false
        for (let i = 0; i < this.rowInfo.items.length; i++) {
          if (this.rowInfo.items[i].length == 0 || this.rowInfo.items[i].width == 0 || this.rowInfo.items[i].height == 0) {
            this.$message.error('Dimension of 0 cm not permitted, please check and revise.');
            return
          }
          if (this.rowInfo.items[i].length > 100 || this.rowInfo.items[i].width > 100 || this.rowInfo.items[i].height > 100) {
            overConvention = true
          }
          if ((this.rowInfo.items[i].outerWeight > 12) || (this.rowInfo.items[i].innerWeight > 12)) {
            overWeight = true
          }
        }
        if (overWeight) {
          this.$confirm('Your submitted carton weight is more than 12kg. Please note that you must provide the gross and net weight of a single carton.', {
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            if (overConvention) {
              this.$confirm('One of more dimensions is larger than 100cm, please confirm if this is correct.', {
                confirmButtonText: 'Submit',
                cancelButtonText: 'Cancel',
                type: 'warning'
              }).then(() => {
                this.onSubmitDimension()
              })
            } else {
              this.onSubmitDimension()
            }
          })
        } else if (overConvention) {
          this.$confirm('One of more dimensions is larger than 100cm, please confirm if this is correct.', {
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            this.onSubmitDimension()
          })
        } else {
          this.onSubmitDimension()
        }
      }
      else if (this.task.taskName == 'Release HBL and Invoice to Shipper' || this.task.taskName == 'Upload Shipping Documents') {
        getSameOrderTask({ shippingOrderId: this.task.shippingId, taskCode: this.task.taskCode }).then((res) => {
          res.data.forEach(item => {
            item.jsonData = JSON.stringify(this.form)
            updateTask(item).then((res) => {
              this.crdFormVisible = false
              this.inspectionFormVisible = false
              this.qcFormVisible = false
              this.pickupFormVisible = false
              this.containerStuffingFormVisible = false
              this.customClearanceFormVisible = false
              this.nominateShippingWeekFormVisible = false
              this.cargoReadyDateFormVisible = false
              // 增加dimensions 里程碑
              this.dimensionsFormVisible = false
              this.documentationCheckFormVisible = false
              this.inspectionFormVisible = false
              this.taskDetailDataVisible = false
              this.preAlertDateFormVisible = false
              this.drawer = false
              if (this.task.taskName == 'Inspection Status') {
                this.$refs.inspectionFrom.clearFiles();
              }
              if (res.code == 0) {
                console.log('更新成功,刷新页面')
                this.getList()
              }
            })
          })
        })
        this.getList()

      }
      else {
        this.task.jsonData = JSON.stringify(this.form)
        updateTask(this.task).then((res) => {
          this.crdFormVisible = false
          this.inspectionFormVisible = false
          this.qcFormVisible = false
          this.pickupFormVisible = false
          this.containerStuffingFormVisible = false
          this.customClearanceFormVisible = false
          this.nominateShippingWeekFormVisible = false
          this.cargoReadyDateFormVisible = false
          // 增加dimensions 里程碑
          this.dimensionsFormVisible = false
          this.documentationCheckFormVisible = false
          this.inspectionFormVisible = false
          this.taskDetailDataVisible = false
          this.preAlertDateFormVisible = false
          this.drawer = false
          if (this.task.taskName == 'Inspection Status') {
            this.$refs.inspectionFrom.clearFiles();
          }
          if (res.code == 0) {
            console.log('更新成功1,刷新页面')
            this.getList()
          }
          // this.getList()
        })
      }



    },
    onSubmitDimension() {
      // 订单项
      this.task.jsonData = JSON.stringify(this.rowInfo.items)
      // 如果状态为2，说明该里程碑已经更新过，只更新数据
      // 根据状态选择更新方法
      const updateFn = this.task.status == 2 ? updateDimensionsData : updateTask;

      updateFn(this.task).then((res) => {
        // 统一关闭所有表单
        const formFlags = [
          'crdFormVisible',
          'inspectionFormVisible',
          'qcFormVisible',
          'pickupFormVisible',
          'containerStuffingFormVisible',
          'customClearanceFormVisible',
          'nominateShippingWeekFormVisible',
          'cargoReadyDateFormVisible',
          'dimensionsFormVisible',
          'documentationCheckFormVisible',
          'taskDetailDataVisible',
        ];
        formFlags.forEach(flag => this[flag] = false);
        // 关闭抽屉
        this.drawer = false;
        // 刷新列表
        this.getList();
      }).catch((error) => {
        console.error('Error updating task:', error);
        this.$message.error('Failed to update task');
        this.getList();
      });
    },
    submitPreAlertTask() {
      this.task.jsonData = JSON.stringify(this.form)
      updatePreAlertTask(this.task).then((res) => {
        this.preAlertDateFormVisible = false
        this.drawer = false
        this.getList()
      })
    },
    submitSoReleaseTask() {
      console.log('submitSoReleaseTask',this.form)
      this.task.jsonData = JSON.stringify(this.form)
      updateSoReleasedTask(this.task).then((res) => {
        this.soReleasedVisible = false
        this.documentationCheckFormVisible = false
        this.getList()
      })
    },
    // 提交 货到日期 里程碑
    submitCargoHandoverDateTask() {
      this.task.jsonData = JSON.stringify(this.form)
      updateCargoHandoverDateTask(this.task).then((res) => {
        this.cargoHandoverDateFormVisible = false
        this.drawer = false
        this.getList()
      }).catch((err) => {
        console.error('Error updating task:', error);
        this.$message.error('Failed to update task');
        this.drawer = false
        this.getList()
      });
    },
    // 提交 inspect 里程碑
    submitInspectionTask() {
      this.task.jsonData = JSON.stringify(this.form)
      updateInspectionStatusTask(this.task).then((res) => {
        this.qcFormVisible = false
        this.drawer = false
        this.$refs.inspectionFrom.clearFiles();
        this.getList()
      }).catch((err) => {
        this.qcFormVisible = false
        console.error('Error updating task:', error);
        this.$message.error('Failed to update task');
        this.drawer = false
        this.$refs.inspectionFrom.clearFiles();
        this.getList()
      });
    },


    subscribe(item) {
      // 订阅和取消订阅；
      var req = {
        'orderId': item.id,
        'orderNumber': item.orderNumber,
        'type': 1
      }
      if (item.subscribe) {
        deleteSubscribe(item.subscribeId).then((res) => {
          item.subscribe = !item.subscribe;
        })
      } else {
        createSubscribe(req).then((res) => {
          item.subscribe = !item.subscribe;
          item.subscribeId = res.data;
        })
      }
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      if (!columns) {
        return sums = []
      }
      columns.forEach((column, index) => {
        if (index == 0) {
          sums[index] = 'Total';//可更改合计行的名称
          return;
        }
        if (column.property == 'productCode' || column.property == 'tcId' || column.property == 'outerSize') {
          sums[index] = ' ';
          return;
        }

        if (data == null) {
          sums[index] = 0;
        } else {
          let total = 0
          data.forEach(row => {
            let value = Number(row[column.property])
            //   if(!isNaN(value)){
            if (column.property == 'outerWeight') {
              total += value * row.booked
            } else if (column.property == 'orderedPieces') {
              total += row.tcQty * row.tcSize
            } else if (column.property == 'bookedVolume') {
              total += row.length * row.width * row.height * row.booked / 1000000
            } else {
              total += value
            }
            // }
          })
          if (column.property == 'bookedVolume') {
            total = total == 0 ? 0 : total.toFixed(1)
          }
          if(column.property == 'outerWeight'){
            total = total == 0 ? 0 : total.toFixed(1)
          }
          sums[index] = total == 0 || isNaN(total) ? ' ' : total

          // const values = data.map(item => Number(item[column.property]))

          // if (!values.every(value => isNaN(value))) {
          //   sums[index] = values.reduce((prev, curr) => {
          //     const value = Number(curr);
          //     if (!isNaN(value)) {
          //       return prev + curr;
          //     } else {
          //       return prev;
          //     }
          //   }, 0);
          // }
        }

      });
      return sums;
    },

    calculateDivisionMethod(A, B) {
      if (A === B) {
        return 1
      }
      return (A / B);
    },
    // 输入去空格 edwin
    handleInputChange(event, row, field) {
      const value = event.trim();
      const isValid = /^(?![0.]*$)(?:\d+(?:\.?\d*)?|\.\d+)$/.test(value);
      // 设置值或清空
      if (value !== '') {
        row[field] = value;
      } else {
        row[field] = null;
      }
      // 校验数字格式
      if (!isValid && value !== '') {
        this.$notify.warning({
          title: 'Warning',
          message: `Field ${field} must be a valid number.`,
          duration: 2000
        });
        // 记录非法字段
        if (!row.invalidFields) row.invalidFields = new Set();
        row.invalidFields.add(field);
      } else {
        // 合法则移除非法标记
        if (row.invalidFields?.has(field)) {
          row.invalidFields.delete(field);
          if (row.invalidFields.size === 0) delete row.invalidFields;
        }
      }
    },
    renderHeader(h, { column }) {
      return h('span', {}, [
        h('span', {}, column.label.split('/')[0]),
        h('br'),
        h('span', {}, column.label.split('/')[1])
      ])
    },

    // 验证上传文件
    verifyShippingDocuments(data) {
      // 获取pod对应shipment下的所有的po文件
      this.dialogVisible = true
      this.$refs.verifyDocuments.openDialog(data)

    },
    // pepco booking score
    pepcoBookingScoreMethods(data){
        console.log('准备跳转',data)
        // data.orderId = 699
        this.$refs.pepcoBookingScore.openDialog(data)
      },
    pepcoBatchUpdateCRDMethod(){
      console.log('跳转到 batch update crd dialog', this.queryParams2)
      this.$refs.batchUpdateCrdDialog.openDialog(this.queryParams2)
    },
    // 填充rowInfo edwin
    async fetchAndUpdateRowInfo(task) {
      const row = this.rowInfo;
      // if (!row || row.orderNumber !== task.orderNumber) {
        try {
          const response = await getHeaderTaskPage({ orderNumber: task.orderNumber });
          if (response.data.records && response.data.records.length > 0) {
            // 更新 rowInfo
            this.rowInfo = response.data.records[0];
            // Ethan: 一份完整的milestone
            this.rowInfo.milestones = this.rowInfo.orderTaskDOS
            // 为每个 bookedProOuterSize 设置默认值 dewin
            this.rowInfo.items.forEach(item => {
              if (item.bookedProOuterSize === '' || item.bookedProOuterSize === undefined || item.bookedProOuterSize === null) {
                item.bookedProOuterSize = item.outerSize;
              }
              if (item.bookedProInnerPerOuter === '' || item.bookedProInnerPerOuter === undefined || item.bookedProInnerPerOuter === null) {
                item.bookedProInnerPerOuter = this.calculateDivisionMethod(item.outerSize, item.tcSize);
              }
            });

            try {
              this.rowInfo.shipmentId = response.data.records[0].shipmentResList[0].id;
            } catch (error) {
              console.error('获取 shipmentId 失败:', error);
              this.rowInfo.shipmentId = null; // 或设置默认值
            }

          } else {
            console.warn('No data found for order number:', task.orderNumber);
          }
        } catch (error) {
          console.error('Failed to fetch order data:', error);
        }
    },

    handleUpdateList(verifyResult) {
      // 强制刷新页面
      this.getHeaderPage()
    },
    updateCRD(row) {
      console.log('updateCRD row:', row)
      this.crdInfo = row.milestones.find(item => item.taskName === 'Cargo Ready Date')
      this.crdInfo.cargoReadyDate = row.cargoReadyDate
      // order_header id
      this.crdInfo.id = row.id
      // order_header order_number
      this.crdInfo.orderNumber = row.orderNumber
            console.log('updateCRD this.crdInfo:',this.crdInfo)
      this.form.taskStatusName = row.taskStatus
      this.cargoReadyDateUpdateFormVisible = true
    },
    submitCRD(form) {
      //  验证表单 edwin
      this.$refs.cargoReadyDateUpdateFormRef.validate(valid => {
        if (!valid) return
        console.log('submitCRD 验证通过:', this.form.cargoReadyDate)
        const currentYear = new Date().getFullYear()
        const cargoReadyYear = new Date(this.form.cargoReadyDate).getFullYear()
        if (Math.abs(cargoReadyYear - currentYear) > 0) {
          this.$confirm(<div>The year you submit is <span class="warning">{ cargoReadyYear }</span>, there is a situation of crossing years. Do you confirm the submission? </div>, "Warning", {
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            this.updateDate(form)
          })
        } else {
          this.updateDate(form)
        }
      })
    },
    amendCRD(row) {
      console.log('amendCRD row:', row)
      this.form = {}
      this.form = row
      this.form.type = 'PO CRD'
      this.form.orderId = row.id
      this.form.orderNumber = row.orderNumber
      this.form.originalData = JSON.stringify({
        "cargoReadyDate" : row.cargoReadyDate,
        "orderId" : row.id,
        "orderNumber" : row.orderNumber
      })
      this.crdAmendInfo = this.form
      this.crdAmendVisible = true
    },
    submitAmendCRD(form){
      searchPoApprovalByOrderNumber(this.form.orderNumber).then((res) => {
        if (res.data) {
          // 或者使用 info 类型提示：
          this.$message({
            message: 'Already exist aprroval info, please wait for approval!',
            type: 'warning',
            duration: 5000
          });
          return
        }

        //  验证表单 edwin
        this.$refs.cargoReadyDateUpdateFormRef.validate(valid => {
          if (!valid) return
          console.log('submitCRD 验证通过:', this.form.cargoReadyDate)
          const currentYear = new Date().getFullYear()
          const cargoReadyYear = new Date(this.form.cargoReadyDate).getFullYear()
          if (Math.abs(cargoReadyYear - currentYear) > 0) {
            this.$confirm(<div>The year you submit is <span class="warning">{ cargoReadyYear }</span>, there is a situation of crossing years. Do you confirm the submission? </div>, "Warning", {
              confirmButtonText: 'Submit',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }).then(() => {
              this.cargoReadyDateAmendFormVisible = false
              this.searchPoApprovalByOrderNumber(form)
            })
          } else {
            this.cargoReadyDateAmendFormVisible = false
            this.searchPoApprovalByOrderNumber(form)
          }
        })
      })
    },
    searchPoApprovalByOrderNumber(form) {
      this.form.newData = JSON.stringify({
        "cargoReadyDate": this.form.cargoReadyDate,
        "orderId": this.form.orderId,
        "orderNumber": this.form.orderNumber
      })
      createPoApproval(form).then((res) => {
        this.$notify({ type: 'success', message: 'Success' })
        this.cargoReadyDateAmendFormVisible = false
        this.getList()
      }).catch((err) => {
        console.error('Error submit amend crd:', error);
        this.$message.error('Failed to amend crd');
        this.cargoReadyDateAmendFormVisible = false
        this.getList()
      });
    },
    updateDate(form) {
      this.cargoReadyDateUpdateFormVisible = true
      updateCRD(form).then((res) => {
        this.$notify({ type: 'success', message: 'Success' })
        this.cargoReadyDateUpdateFormVisible = false
        this.getList()
      }).catch((err) => {
        console.error('Error updating task:', error);
        this.$message.error('Failed to update task');
        this.cargoReadyDateUpdateFormVisible = false
        this.getList()
      });
    },
    submitSuccess(){
      // 关闭右侧状态框
      // score新增成功，刷新列表
      console.log('更新页面')
      this.drawer = false
      this.getList()

  },
  batchUpdateSubmitSuccess(status){
    console.log('batchUpdateSubmitSuccess 更新页面')
    this.taskDetailDataVisible = false
    this.getList()
  },

    batchUpdateDimensionSuccess(){
      this.drawer = false
      this.taskDetailDataVisible = false
      this.getList()
    },

    customsBrokerAssignedMethods(data){
      this.$refs.customsBrokerAssigned.openDialog(data)
    },
    viewCustomsBrokerAssignedMethods(data){
      this.$refs.viewCustomBrokerAssigned.openDialog(data)
    },
    openNewWindow(ref) {
      var newWindow = window.open(ref,'_blank')
      if(newWindow) {
      } else {
        this.$router.push(ref);
      }
      //zane 表单页面提交，防止浏览器拦截在本页面打开
      // try {
      //   const form = document.createElement('form');
      //   form.method = 'GET';
      //   form.action = ref;
      //   form.target = '_blank';
      //   document.body.appendChild(form);
      //   form.submit();
      //   document.body.removeChild(form);
      // } catch (e) {
      //   this.$message.warning('Please allow pop-ups for this site');
      //   // 降级方案
      //   window.location.href = ref;
      // }
    },
    showBookingScore(task) {
      console.log('查看详情',task)
     this.$refs.bookingScoreView.openDialog(task)
    },
    //  计算CBM edwin
    calculateCBM(length, width, height, qty) {
      return ((length * width * height) * qty) / 1000000;
    },
    // transport mode label edwin
    freightMethodLabel(freightMethod) {
      const dict = this.getDictDatas(DICT_TYPE.MODE_OF_TRANSPORT_PEPCO).find(
        item => item.value === freightMethod
      );
      return dict ? dict.label : '';
    },
    // Incoterm label edwin
    incotermLabel(incoterm) {
      const dict = this.getDictDatas(DICT_TYPE.SHIPPING_INCOTERM).find(
        item => item.value === incoterm
      );
      return dict ? dict.label : '';
    },
    // Named Place label
    namedPlaceLabel(namedPlace) {
      const dict = this.getDictDatas(DICT_TYPE.SHIPPING_NAMED_PLACE).find(
        item => item.value === namedPlace
      );
      return dict ? dict.label : '';
    },
    overviewTipPopoverMethods() {
      // 获取字典数据并转换为 Map
      const dictList = this.getDictDatas('overview_tip_popover_po');
      // 创建主 Map
      this.taskTipInfoMap = new Map();
      // 遍历字典列表，将每项转换为 Map 并存入主 Map
      dictList.forEach(item => {
        try {
          // item.label 作为主 Map 的 key
          const taskName = item.label;
          // 解析 item.value 中的 JSON 字符串
          const valueMap = new Map();
          const jsonObj = JSON.parse(item.value);
          // 将 JSON 对象的每个属性转换为 Map 的键值对
          Object.keys(jsonObj).forEach(key => {
            valueMap.set(key, jsonObj[key]);
          });
          // 将解析后的 Map 存入主 Map
          this.taskTipInfoMap.set(taskName, valueMap);
        } catch (error) {
          console.error('Error parsing dict value:', item.value, error);
        }
      });
      console.log('overviewTipPopoverMap:', this.taskTipInfoMap);
    },
    // 根据用户权限过滤里程碑 edwin
    filterOrderTasksByName(orderTasks, filters) {
      return orderTasks.filter(task => filters.includes(task.taskName));
    },
    // 根据用户权限过滤里程碑 edwin
    filterOrderTasksByUser(orderTasks){
      // 没有直接返回
      if (!this.userCompanyTypeList) {
        this.userCompanyTypeList = getUserCompanyTypeList();
        if (!this.userCompanyTypeList) {
          return
        }
      }
      // 根据公司类型过滤
      if(this.userCompanyTypeList.includes('Supplier')){
        return this.filterOrderTasksByName(orderTasks, this.milestonePermMap['SUPPLIER']['origin']);
      }else if(this.userCompanyTypeList.includes('PGS')){
        return this.filterOrderTasksByName(orderTasks, this.milestonePermMap['PGS']['origin']);
      }else if(this.userCompanyTypeList.includes('PEPCO')){
        return this.filterOrderTasksByName(orderTasks, this.milestonePermMap['PEPCO']['origin']);
      }else if(this.userCompanyTypeList.includes('OHA Management')|| this.userCompanyTypeList.includes('PEPCO Management')){
        return this.filterOrderTasksByName(orderTasks, this.milestonePermMap['ORIGIN']['origin']);
      }else if(this.userCompanyTypeList.includes('OHA')){
        return this.filterOrderTasksByName(orderTasks, this.milestonePermMap['OHA']['origin']);
      }else if(this.userCompanyTypeList.includes('CFS')){
        return this.filterOrderTasksByName(orderTasks, this.milestonePermMap['CFS']['origin']);
      }else if(this.userCompanyTypeList.includes('Yard Admin')){
        return this.filterOrderTasksByName(orderTasks, this.milestonePermMap['YardAdmin']['origin']);
      }else if(this.userCompanyTypeList.includes('PEPCO SCM')){
        return this.filterOrderTasksByName(orderTasks, this.milestonePermMap['PEPCO_SCM']['origin']);
      }else{
        return orderTasks
      }
    },
    // 里程碑编辑权限判断抽离出来 edwin
    editTaskPerm(task){
      // partyId不相等，没权限
      if(this.user.deptId != task.partyId){
        return false
      }
      // 以下在partyId相等的基础之上进行判断
      // 状态 = 1, 可以编辑
      if(task.status == 1){
        return true
      }
      // 如果
      // 1.PO没有被订舱(改-si vgm之前)
      // 2.当前所在行为Dimensions里程碑
      // 3.必须状态不等于0， 等于0说明还没到dimensions里程碑
      // 可以编辑Dimensions
      if(task.status != 0 && this.rowInfo.dimensionEditable && task.taskCode === 'Dimensions'){
        return true
      }
      if(task.status != 0 && task.taskCode === 'Cargo_Receive_Date'){
        return true
      }
      if(task.status != 0 && task.taskCode === 'Upload_Shipping_Documents'&&this.rowInfo.taskStatus == 'Verify Shipping Documents'){
        return true
      }
    },
    getDropDownValues() {
      findDropDownListFromCt().then(response => {
        if (response && response.data) {
          if (response.data.cancelReasonList) {
            this.selCancelReason = response.data.cancelReasonList

            this.selCancelReason1 = [...response.data.cancelReasonList]
            this.selCancelReason1.push(...this.rePreAssignOptions)
            this.selCancelReason1.push(...this.cargoCloseOptions)
            this.selCancelReason1.push(...this.lotRemoveOptions)
            this.selCancelReason1.push(...this.sinoLotRemoveOptions)
          }
          if (response.data.cancelCategoryList) {
            this.selCancelCategory = response.data.cancelCategoryList
            this.selCancelCategory1 = [...response.data.cancelCategoryList]
            this.selCancelCategory1.push(...this.rePreAssignOptions)
            this.selCancelCategory1.push(...this.cargoCloseOptions)
            this.selCancelCategory1.push(...this.lotRemoveOptions)
            this.selCancelCategory1.push(...this.sinoLotRemoveOptions)
          }
        }
      })
    },
    getPreAssignStatus(type, status) {
      if (type == 'Carrier Booking') {
        if (status == 'history') {
          return 'Revoked'
        } else if (status == 'transport assigned') {
          return 'Booked'
        } else if (status == 'cancel') {
          return 'Canceled'
        } else if (status == 'REMOVE') {
          return 'REMOVE'
        }
      } else {
        if (status == 'history') {
          return 'Pre-assigned'
        } else if (status == 'open') {
          return 'Pre-assigned'
        } else if (status == 'transport assigned') {
          return 'Booked'
        } else if (status == 'REMOVE') {
          return 'REMOVE'
        }
      }
    },
    getUserName(creator) {
      return this.userMap.get(creator)
    },
    handleStorageChange(event){
      if (event.key === 'refreshPoPage') {
        this.getList();
        console.log('Storage changed:', event.newValue);
        console.log('刷新order list:', event);
      }
    },
    submitUploadFileTask(jsonData){
        this.form =  jsonData
        this.submitTask()
    },
    // 批量更新CRD的权限控制
    batchUpdateCRDPermMethod(row, status){
      if(row.taskName != 'Cargo Ready Date'){
        this.batchUpdateCRDPerm = false
        console.log('no Cargo Ready Date')
        return
      }
      if(status != 1){
        this.batchUpdateCRDPerm = false
        console.log('status != 1')
        return
      }
      // 如果不是Supplier,则直接没有权限
      if(!this.userCompanyTypeList.includes('Supplier')){
        this.batchUpdateCRDPerm = false
        console.log('no Supplier')
        return
      }
      // 只拥有查看的权限
      if(this.userCompanyTypeOnlyViewPerm()){
        this.batchUpdateCRDPerm = false
        console.log('in OHA Management or PEPCO Management or ...')
        return
      }
      this.batchUpdateCRDPerm = true
      console.log('batchUpdateCRDPerm', this.batchUpdateCRDPerm)
    },
    // 只能拥有可查看权限的 user company type
    // 使用的时候注意，不要搞反
    // true 代表 only view
    // false 代表 不止 view, 可能有不限于 edit的权限
    userCompanyTypeOnlyViewPerm(){
      if(this.userCompanyTypeList.includes('OHA Management')){
        return true
      }
      if(this.userCompanyTypeList.includes('PEPCO Management')){
        return true
      }
      if(this.userCompanyTypeList.includes('PEPCO SCM')){
        return true
      }
      return false
    },
    // 批量更新dimension的权限控制
    isShowBatchUpdateDimensionBtn(row, status){
      if(row.taskName != 'Dimensions'){
        this.batchUpdateDimensions = false
        return
      }
      if(status != 1){
        this.batchUpdateDimensions = false
        return
      }
      // 如果不是Supplier,则直接没有权限
      if(!this.userCompanyTypeList.includes('Supplier')){
        this.batchUpdateDimensions = false
        return
      }
      // 只拥有查看的权限
      if(this.userCompanyTypeOnlyViewPerm()){
        this.batchUpdateDimensions = false
        return
      }
      this.batchUpdateDimensions = true
    },
    batchUpdateDimensionMethod(){
      this.$refs.batchUpdateDimensionsDialog.openDialog(this.queryParams2)
    },
    validateDimensionsFields(items) {
      const requiredFields = [
        'length',
        'width',
        'height',
        'outerWeight',
        'innerWeight',
        'bookedProOuterSize',
        'bookedProInnerPerOuter'
      ];

      for (const item of items) {
        for (const field of requiredFields) {
          const value = item[field];
          if (value === null || value === undefined || value === '') {
            this.$notify.warning({
              title: 'Validation Failed',
              message: 'All columns are required!',
              duration: 3000
            });
            return false;
          }
        }
      }

      return true;
    },
    //po页面的清除 筛选条件
    clearFilters(){
      //清除Filter
      this.queryParams.originPort = null;
      this.queryParams.countryList = [];
      this.queryParams.supplierCode = null;
      this.queryParams.dcList = [];
      this.queryParams.hodDateRange = [];
      this.queryParams.etdDateRange = [];
      this.queryParams.shipmentType = null;
      this.queryParams.transportMode = null;
      // this.queryParams.supplierType = null;
      this.queryParams.otb = null;

      //清除搜索条件
      this.queryParams.orderNumber = null;
      this.queryParams.containerNo = null
      this.queryParams.taskStatus = null;
      this.queryParams.booked = '';
      this.queryParams.pageNo = 1;
      this.queryParams.ataFlag = null;
      this.queryParams.atdFlag = null;
      this.queryParams.poStatus = []
      this.queryParams.status = 0
      this.queryParams.poTags = []

      this.getList()
    },
    showAHOD(row){
      const data = row.milestones.filter(item => item.taskCode === 'Cargo_Receive_Date')[0]
      if(data){
        if(data.status === 2){
          return row.actualCargoHandoverDate == null ? '' : parseUTCTime(row.actualCargoHandoverDate)
        }
      }
      return ''
    },
    cancelPO(row) {
      this.$confirm('Delete ' + row.orderNumber + '?', 'Tips', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        return deleteHeader(row.id)
      }).then(() => {
        this.$message({
          type: 'success',
          message: 'Success!'
        });
        this.getList()
      }).catch(() => {
      });
    },
    onHandleCRDClose() {
      this.crdInfo = null
      this.onlyView = false
      this.cargoReadyDateFormVisible = false
    },
    onHandleUpdateCRDClose() {
      this.crdInfo = null
      this.cargoReadyDateUpdateFormVisible = false
    },
    onSubmitCRDSuccess() {
      this.cargoReadyDateFormVisible = false
      this.drawer = false
      this.getList()
    },
    onUpdateCRDSuccess() {
      this.$notify({ type: 'success', message: 'Success' })
      this.cargoReadyDateUpdateFormVisible = false
      this.getList()
    },
    onCRDAmendClose() {
      this.crdAmendVisible = false
    },
    onCRDAmendSuccess() {
      this.getList()
    },
    onCargoInboundDialogClose() {
      this.cargoInboundVisible = false
      this.cargoInboundUpdateVisible = false
      this.cargoInboundInfo = null
      this.isCargoInboundOnlyView = false
    },
    onCargoInboundSuccess() {
      this.cargoInboundUpdateVisible = false
      this.loading = true;
      this.drawer = false
      this.getTaskNames()
      this.getHeaderPage()
      this.taskReport()
    },
    onSuccessCallback() {
      this.$notify({ type: 'success', message: 'Upload Successful' });
      taskReport(this.queryParams).then((res) => {
        this.taskInfo = res.data.statusCount
      })
      this.taskDataTableQuery()
    }
  },
};
</script>

<style lang="scss" scoped>
.el-table__header-wrapper .el-checkbox {
  display: none !important;
}

.el-table-column--selection .el-checkbox {
  display: none !important;
}

p {
  margin: 0px;
}

.not-check-css {
  border-color: red;
}
.mr-4 {
  margin-right: 4px;
}
/* Ceramic Products 的紫色标签样式 */
::v-deep .tag-purple.el-tag--info {
  background-color: #9b59b6;
  border-color: #8e44ad;
  color: #fff;
}

/* 多选标签的折叠样式优化 */
::v-deep .el-select__tags {
  max-width: calc(100% - 32px);
}


.title {
  font-weight: bold;
  padding-right: 10px;
}


.cardx {
  border-radius: 8px;
  border: 3px dashed transparent;
  padding: 1rem;
  border: 1px solid #ddd;
  margin-bottom: 15px;
  box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
}

.status1Div,
.order,
.taskName,
.date {
  float: left;
  margin-left: 15px;
}

.title {
  border: 5px;
}

.self-step1:not(:first-child):before {
  width: 150px;
  height: 2px;
  position: absolute;
  left: -120px;
  content: "";
  background: #004F7C;
  top: 20px;
  text-align: left;
}

.status2 {

  border-radius: 100px;
  padding: 2px 13px;
  font-size: 12px;
}

.color1 {
  color: #13854e;
  background-color: #d6ede2;
}

.color2 {
  color: #2d86ba;
  background-color: #ceecfd;
}

.numberOftask {
  font-size: 16px;
  text-decoration: underline;
  cursor: pointer;
}

.color3 {
  color: #e6a23c;
  background: #fdf6ec;
}

.color4 {
  color: #f56c6c;
  background: #fef0f0;
}

::v-deep .hiddenCheck>.cell .el-checkbox__inner {
  display: none;
}

.center-input ::v-deep input {
  text-align: center;
}

.self-step2 {
  width: 20px;
  display: inline-block;
  height: 20px;
  border-radius: 20px !important;
  color: #fff;
  line-height: 20px;
  text-align: center;
  font-weight: 700;
  position: relative;
  z-index: 999;
}

/* .self-step3:not(:first-child):before {
  width: 160px;
  height: 6px;
  position: absolute;
  left: -100px;
  content: "";
  background: #004F7C !important;
  top: 7px;
  text-align: left;
} */
.self-step3:not(:first-child):before {
  width: 150px;
  height: 6px;
  position: absolute;
  left: -80px;
  content: "";
  background: #004F7C !important;
  top: 7px;
  text-align: left;
}
/* 关键修改：自动换行后的每行第一个不显示横线 */

.self-step3:nth-child(6n+1):before {
  display: none !important;
}

.self-step3:first-child:after  {
  display: none !important;
}

.self-step-process1:not(:first-child):before {
  background: #63acd5 !important;
}

.self-step-finished1:not(:first-child):before {
  background: #004F7C !important;
}

.self-step-pedding1:not(:first-child):before {
  background: #ddd !important;
}

.self-step-error1:not(:first-child):before {
  background: #F56C6C !important;
}
</style>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  font-weight: bold;
}

::v-deep .el-input.is-disabled .el-input__inner {
  color: #606266 !important;
  background-color: #fff;
}
::v-deep .el-textarea.is-disabled .el-textarea__inner {
  color: #606266 !important;
  background-color: #fff;
}

// el-checkbox禁用样式修改
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner::after {
  border-color: #020202;
}
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #f2f6fc;
  border-color: #f2f6fc;
}
::v-deep .el-checkbox__input + span.el-checkbox__label {
  color: #606266;
}

::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
  border-color: #020202;
}
::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #f2f6fc;
  border-color: #f2f6fc;
}
::v-deep .el-checkbox__input.is-disabled + span.el-checkbox__label {
  color: #606266;
}

.centered-descriptions :deep(.el-descriptions-item__content) {
  justify-content: center;
  text-align: center;
}

.centered-item :deep(.el-descriptions-item__container) {
  display: flex;
  justify-content: center;
  align-items: center;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  line-height: 36px;
  text-align: center;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
.header-box {
  display: flex;
  width: 100%;
  margin-bottom: 18px;
  overflow-x: auto;
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
  .header-card {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background-color: #ffffff;
  }
}
.warning {
  font-weight: bold;
  color: red;
}
</style>
