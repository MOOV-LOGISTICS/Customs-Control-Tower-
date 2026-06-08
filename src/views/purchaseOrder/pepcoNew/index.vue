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
        </div>
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
                              @change="triggerFilter"
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
                <!-- 改为级联选择器 -->
               <el-cascader :options="taskStatusOptions" v-model="taskStatusValue"
                  :props="{ expandTrigger: 'hover' }"
                  @change="handleTaskStatusChange" clearable filterable placeholder="Pending Status"/>
                <!-- <el-select @change="queryParams.pageNo = 1, getList()" clearable v-model="queryParams.taskStatus" filterable placeholder="Pending Status">
                  <el-option v-for="item in allTaskNames" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select> -->
              </div>
              <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                <el-select @change="triggerFilter" v-model="queryParams.booked" placeholder="Booked/Not Booked" filterable clearable>
                  <el-option label="All" :value="null"></el-option>
                  <el-option label="Not booked" :value="false"></el-option>
                  <el-option label="Booked" :value="true"></el-option>
                </el-select>
              </div>
              <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                <el-popover v-model="filterPopover" placement="bottom" popper-class="popover-filter"  title=" " width="400" trigger="click">
                  <el-form>
                    <el-row :gutter="10" style="margin-bottom: 15px;">
                      <el-col :span="12">
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
                        <el-select v-model="queryParams.poTags" placeholder="PO Tag" multiple filterable clearable
                          collapse-tags style="width: 100%">
                          <el-option v-for="tag in poTagOptions" :key="tag.code" :label="tag.label" :value="tag.code">
                            <el-tag :type="tag.type" :class="tag.className" size="small" style="margin-right: 8px;">
                              {{ tag.label }}
                            </el-tag>
                          </el-option>
                        </el-select>
                      </el-col>

                    <el-col :span="12">
                        <el-input placeholder="MBL no.(Pre Alert)" v-model="queryParams.mblNumber"
                          @keyup.enter.native="triggerFilter" clearable @clear="triggerFilter">
                        </el-input>
                      </el-col>
                      <!-- <el-col :span="12">
                        <el-select filterable clearable v-model="queryParams.otb" placeholder="OTB">
                          <el-option label="Yes" value="1" />
                          <el-option label="No" value="0" />
                        </el-select>
                      </el-col> -->
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
                          v-model="allMilestoneDDLModel"
                          :props="{ expandTrigger: 'hover' }"
                          placeholder="Milestone Status"
                          :options="allMilestoneDDLOptions">
                        </el-cascader>
                        <!-- <el-cascader
                          clearable
                          style="width: 100%"
                          v-model="queryParams.poStatus"
                          :props="{ expandTrigger: 'hover' }"
                          placeholder="Milestone Status"
                          :options="mileOptions">
                        </el-cascader> -->
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
                          <el-button @click="triggerFilter" icon="el-icon-search" plain style="background-color: #004F7C;color: white;"> Search</el-button>
                        </el-col>
                    </el-row> -->
                  </el-form>
                  <el-button slot="reference" icon="el-icon-plus" plain :style="{color:hasFilter?'#004F7C':''}">Filter</el-button>
                </el-popover>
                <el-button style="margin-left: 5px;" @click="clearFilters" plain> Clear Filters </el-button>
                <el-button style="margin-left: 5px;background-color: #004F7C; color: white;" icon="el-icon-search"  @click="triggerFilter" plain> Search </el-button>
              </div>
              <div style="clear: both;"></div>
            </div>
          </el-form>
          <div style="overflow: auto;width:calc(100%);float: left;">

          <BaseTable ref="multipleTable" :data="tableData" :row-class-name="tableRowClassName" :header-cell-class-name="headerCellStyle"
          :border="true" @sort-change="handleSortChange" @select="handleSelection" row-key="id"
          :height="tableHeight - 70" :columns='tableColumns'  :total="total"    v-loading="loading"
          @expand-change="handleExpandChange" :expand-row-keys="expandRowKeys" :pageNo="queryParams.pageNo"
          @pagination="changePage" />


          </div>

        </div>
      </transition>

      <transition name="el-zoom-in-center">
       <el-form v-if="drawer2" :model="queryParams">
          <!-- 添加 SEA/AIR 标签页 -->
          <div class="overview-tab-wrapper">
            <div class="overview-tabs">
              <div class="tab-item" :class="{ active: activeOverviewTab === 'sea' }" @click="activeOverviewTab = 'sea'">
                <ShipIcon class="tab-icon" :active="activeOverviewTab === 'sea'" />
                <span>SEA</span>
                <i class="el-icon-success overview-right-success-icon" v-if="!shipOverviewTip"></i>
                <i class="el-icon-warning overview-right-warning-icon" v-if="shipOverviewTip"></i>
                <span class="active-line"></span>
              </div>
              <div v-hasPermi="['pepco:air:overview-tab:view']" class="tab-item" :class="{ active: activeOverviewTab === 'air' }" @click="activeOverviewTab = 'air'">
                <PlaneIcon class="tab-icon" :active="activeOverviewTab === 'air'" />
                <span>AIR</span>
                <i class="el-icon-success overview-right-success-icon" v-if="!planeOverviewTip"></i>
                <i class="el-icon-warning overview-right-warning-icon" v-if="planeOverviewTip"></i>
                <span class="active-line"></span>
              </div>
              <!-- permission todo -->
              <div v-hasPermi="['pepco:sea-air:overview-tab:view']" class="tab-item" :class="{ active: activeOverviewTab === 'sea-air' }" @click="activeOverviewTab = 'sea-air'">
                <PlaneIcon class="tab-icon" :active="activeOverviewTab === 'sea-air'" />
                <span>SEA-AIR</span>
                <i class="el-icon-success overview-right-success-icon" v-if="!seaAirOverviewTip"></i>
                <i class="el-icon-warning overview-right-warning-icon" v-if="seaAirOverviewTip"></i>
                <span class="active-line"></span>
              </div>
            </div>

            <!-- 整体底部横线 -->
            <div class="tabs-bottom-line"></div>
          </div>
          <div v-show="activeOverviewTab === 'air'">
            <air-overview :queryParams="queryParams" />
          </div>





    <div v-show="activeOverviewTab === 'sea'">
          <div>
            <div style="float: left;padding-top: 8px;"></div>

            <div style='float:left;padding: 10px 0px;'>
              <el-input placeholder="Order Number" v-model="queryParams.orderNumber"
                @input.native="queryParams.orderNumber = $event.target.value.trim()"
                @keyup.enter.native=" queryParams.pageNo = 1; getList()" clearable>
              </el-input>
            </div>


                          <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                            <el-input placeholder="Container no.(CLR)" v-model="queryParams.containerNo"
                              @input.native="queryParams.containerNo = $event.target.value.trim()"
                              @keyup.enter.native="triggerFilter" clearable>
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
                          <!-- <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                              <el-button slot="append" @click="triggerFilter" type="primary"
                               style="background-color: white; color: black; border-color: #dcdfe6;"
                              >Search<i class="el-icon-search el-icon--right"></i></el-button>
                          </div> -->


            <div style='float:left;margin-left: 5px;padding: 10px 0px;'>

              <el-select @change="triggerFilter" clearable v-model="queryParams.taskStatus" filterable
                placeholder="Status">
                <el-option v-for="item in filteredSeaTaskNames" :key="item.value" :label="item.label" :value="item.value">
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

            <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                <el-popover v-model="filterPopover" placement="bottom" title=" " popper-class="popover-filter" width="400" trigger="click">
                  <el-form>
                    <el-row :gutter="10" style="margin-bottom: 15px;">
                      <el-col :span="12">
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
                       <!-- <el-col :span="12">
                        <el-select filterable clearable v-model="queryParams.otb" placeholder="OTB">
                          <el-option label="Yes" value="1" />
                          <el-option label="No" value="0" />
                        </el-select>
                      </el-col> -->
                   <el-col :span="12">
                      <el-select v-model="queryParams.poTags" placeholder="PO Tag" multiple filterable clearable
                        collapse-tags style="width: 100%">
                        <el-option v-for="tag in poTagOptions" :key="tag.code" :label="tag.label" :value="tag.code">
                          <el-tag :type="tag.type" :class="tag.className" size="small" style="margin-right: 8px;">
                            {{ tag.label }}
                          </el-tag>
                        </el-option>
                      </el-select>
                    </el-col>
                   <el-col :span="12">
                      <el-input placeholder="MBL no.(Pre Alert)" v-model="queryParams.mblNumber"
                        @keyup.enter.native="triggerFilter" clearable @clear="triggerFilter">
                      </el-input>
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
                          <el-button @click="triggerFilter" icon="el-icon-search" plain style="background-color: #004F7C; color: white;"> Search </el-button>
                        </el-col>
                    </el-row> -->
                  </el-form>
                  <el-button slot="reference" icon="el-icon-plus" plain :style="{color:hasFilter?'#004F7C':''}">Filter</el-button>
                </el-popover>
              <el-button style="margin-left: 5px;" @click="clearFilters" plain> Clear Filters </el-button>
              <el-button slot="reference" style="margin-left: 5px;background-color: #004F7C; color: white;" icon="el-icon-search"  @click="triggerFilter" plain> Search </el-button>

              </div>

              <div style="clear: both;"></div>
            </div>

          <div v-loading="taskLoading" v-show="drawer2" class="transition-box" style="padding-top: 30px;" :style="{ 'height': (tableHeight) + 'px' }">
            <el-row :gutter="20" style="padding-top:0px">
              <el-col :span="12" v-if="seaTasks.length > 0">
                <el-card style="margin-bottom:20px;box-shadow:none !important; width: 800px" class="box-card"
                  v-if="task1.length > 0">
                  <div slot="header" class="clearfix">
                     <span>Origin
                       <!-- <span style="padding: 0px 20px;">Last Update Time:<span style="color: #004F7C;"> {{originDataUpdateTime}}</span> </span> -->
                      </span>
                    <!-- <i style="cursor: pointer;" class="el-icon-refresh" @click="getTaskNames('cacheFlag')"></i> -->
                  </div>
                  <div style="padding: 20px 0px 20px 0;margin-left:-20px;">


                    <el-table border :data="seaTasks" style="width: 100%">
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
          </div>
    <div v-show="activeOverviewTab === 'sea-air'">
          <div>
            <div style="float: left;padding-top: 8px;"></div>

            <div style='float:left;padding: 10px 0px;'>
              <el-input placeholder="Order Number" v-model="queryParams.orderNumber"
                @input.native="queryParams.orderNumber = $event.target.value.trim()"
                @keyup.enter.native=" queryParams.pageNo = 1; taskSeaAirReport()" clearable>
              </el-input>
            </div>


                          <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                            <el-input placeholder="Container no.(CLR)" v-model="queryParams.containerNo"
                              @input.native="queryParams.containerNo = $event.target.value.trim()"
                              @keyup.enter.native=" queryParams.pageNo = 1, taskSeaAirReport()" clearable>
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
                              <el-button slot="append" @click=" queryParams.pageNo = 1, taskSeaAirReport()" type="primary"
                               style="background-color: white; color: black; border-color: #dcdfe6;"
                              >Search<i class="el-icon-search el-icon--right"></i></el-button>
                          </div>


            <div style='float:left;margin-left: 5px;padding: 10px 0px;'>

              <el-select @change="queryParams.pageNo = 1, taskSeaAirReport()" clearable v-model="queryParams.taskStatus" filterable
                placeholder="Status">
                <el-option v-for="item in allTaskNames" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
              <el-select @change="queryParams.pageNo = 1 ,taskSeaAirReport()" v-model="queryParams.booked" placeholder="Booked/Not Booked" clearable filterable >
                <el-option label="All" :value="null"></el-option>
                <el-option label="Not booked" :value="false"></el-option>
                <el-option label="Booked" :value="true"></el-option>
              </el-select>
            </div>

            <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
                <el-popover v-model="filterSeaAirPopover" placement="bottom" title="Filter" width="400" trigger="click">
                  <el-form>
                    <el-row :gutter="10" style="margin-bottom: 15px;">
                      <el-col :span="12">
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
                      <el-col :span="12">
                        <el-select filterable clearable v-model="queryParams.supplierType" placeholder="Supplier Type">
                          <el-option v-for="item in supplierTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-col>
                       <el-col :span="12">
                        <el-select filterable clearable v-model="queryParams.otb" placeholder="OTB">
                          <el-option label="Yes" value="1" />
                          <el-option label="No" value="0" />
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
                    <el-row :gutter="20" style="margin-bottom: 15px;">
                        <el-col style="text-align: right">
                          <el-button @click="queryParams.pageNo = 1,taskSeaAirReport()" icon="el-icon-search" plain> Search </el-button>
                        </el-col>
                    </el-row>
                  </el-form>
                  <el-button slot="reference" icon="el-icon-plus" plain :style="{color:hasFilter?'red':''}">Filter</el-button>
                </el-popover>
              <el-button style="margin-left: 5px;" @click="clearFilters" plain> Clear Filters </el-button>
              </div>
              <div style="clear: both;"></div>
            </div>

          <div v-loading="taskLoading" v-show="drawer2" class="transition-box" style="padding-top: 30px;" :style="{ 'height': (tableHeight) + 'px' }">
            <el-row :gutter="20" style="padding-top:0px">
              <el-col :span="12" v-if="seaAirTasks.length > 0">
                <el-card style="margin-bottom:20px;box-shadow:none !important; width: 800px" class="box-card"
                  v-if="task1.length > 0">
                  <div slot="header" class="clearfix">
                     <span>Origin
                       <!-- <span style="padding: 0px 20px;">Last Update Time:<span style="color: #004F7C;"> {{originDataUpdateTime}}</span> </span> -->
                      </span>
                    <!-- <i style="cursor: pointer;" class="el-icon-refresh" @click="getTaskNames('cacheFlag')"></i> -->
                  </div>
                  <div style="padding: 20px 0px 20px 0;margin-left:-20px;">

                    <el-table border :data="seaAirTasks" style="width: 100%">
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
                          <span style="color: #2d86ba;" class="numberOftask"  @click="taskDetails(scope.row, 'possible')">{{ taskSeaAirInfo[scope.row.taskName]?.['Possible'] || 0 }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="urgent" align="center" label="Urgent" min-width="100">
                        <template slot="header" slot-scope="scope">
                          <span class="title" style="color: #e6a23c; background: #fdf6ec;">Urgent</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #e6a23c;" class="numberOftask" @click="taskDetails(scope.row, 'urgent')">{{taskSeaAirInfo[scope.row.taskName]?.['Urgent'] || 0 }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="overdue" align="center" label="Overdue" min-width="100">
                        <template slot="header" slot-scope="scope">
                          <span class="title" style="color: #f56c6c; background: #fef0f0;">Overdue</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #f56c6c;" class="numberOftask"
                            @click="taskDetails(scope.row, 'overdue')">{{ taskSeaAirInfo[scope.row.taskName]?.['Overdue'] || 0
                            }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="finished" align="center" label="Finished" min-width="100">
                        <template slot="header" slot-scope="scope">
                          <span class="title" style="color: #13854e; background-color:#d6ede2;">Finished</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #13854e;" class="numberOftask"
                            @click="taskDetails(scope.row, 'finished')">{{ taskSeaAirInfo[scope.row.taskName]?.['Finished'] ||
                              0
                            }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-card>
              </el-col>
              <!-- <el-col :span="12" v-if="filteredTask3.length > 0">
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
              </el-col> -->
            </el-row>
          </div>
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

    <el-drawer :modal="false" :title="title" :visible.sync="drawer" direction="rtl" >
      <div  v-loading="isDrawerLoading">
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
          formatUserLocalTime(h.finishedTime, h.timeZone, h.timeZoneOffset) }}</div>
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
           <svg v-hasPermi="['pepco:withdraw:container-gate-in']" v-if="h.showWithdrawBtu && h.taskName == 'Container Gate In'"
                 @click="withdrawContainerGateIn(h,'task')"
                 class="el-icon"
                 viewBox="0 0 1024 1024"
                 style="padding-left: 5px; cursor: pointer; width: 16px; height: 16px; vertical-align: -2px; display: inline-block; fill: currentColor;">
              <path d="M328.832 449.514667a42.666667 42.666667 0 0 1-60.330667 60.330666L87.466667 328.832a42.666667 42.666667 0 0 1 0-60.330667L268.501333 87.466667a42.666667 42.666667 0 0 1 60.330667 60.330666l-108.181333 108.16L618.666667 256c188.522667 0 341.333333 152.810667 341.333333 341.333333s-152.810667 341.333333-341.333333 341.333334H170.666667a42.666667 42.666667 0 1 1 0-85.333334h448c141.376 0 256-114.624 256-256s-114.624-256-256-256H220.650667l108.181333 108.181334z">
              </path>
          </svg>
          <svg v-hasPermi="['pepco:withdraw:cargo-inbound']" v-if="h.showWithdrawBtu && h.taskName == 'Cargo Inbound'"
                 @click="withdrawCargoInbound(h,'task')"
                 class="el-icon"
                 viewBox="0 0 1024 1024"
                 style="padding-left: 5px; cursor: pointer; width: 16px; height: 16px; vertical-align: -2px; display: inline-block; fill: currentColor;">
              <path d="M328.832 449.514667a42.666667 42.666667 0 0 1-60.330667 60.330666L87.466667 328.832a42.666667 42.666667 0 0 1 0-60.330667L268.501333 87.466667a42.666667 42.666667 0 0 1 60.330667 60.330666l-108.181333 108.16L618.666667 256c188.522667 0 341.333333 152.810667 341.333333 341.333333s-152.810667 341.333333-341.333333 341.333334H170.666667a42.666667 42.666667 0 1 1 0-85.333334h448c141.376 0 256-114.624 256-256s-114.624-256-256-256H220.650667l108.181333 108.181334z">
              </path>
            </svg>
          <i v-show="!(userCompanyTypeOnlyViewPerm())&&editTaskPerm(h)" @click="handleTask(h)" style="cursor: pointer; margin-right: 10px;" class="el-icon-edit"></i>
          <i v-if="(h.taskName == 'QC Approve' || h.taskName == 'Inspection Status') && h.status == 2"
            @click="viewQcResult(h)" class="el-icon-view" style="cursor: pointer; margin-right: 10px;"></i>
          <i v-if="!(h.taskName == 'QC Approve' || h.taskName == 'Inspection Status') && h.jsonData != null && h.status == 2"
            @click="viewTask(h)" class="el-icon-view" style="cursor: pointer; margin-right: 10px;"></i>
        </div>
        <div style="clear: both;"></div>
      </div>
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
     <!-- Dimensions (edwin)-->
    <el-dialog :title="title" width="99%" :visible.sync="dimensionsFormVisible">
      <el-row type="flex">
        <el-col  style="font-size: 24px; font-weight: bold; width: 450px;">Dimensions(Per Outer Packing)</el-col>
        <el-col >
          <el-popover width="750" placement="left" trigger="hover">
            <BaseTable :data="dimensionTips"
                  :columns="dimensionTipscolumns" />
            <template v-slot:reference>
             <i class="el-icon-question" style="font-size: 30px; color:#004F7C;"></i>
            </template>
          </el-popover>
        </el-col>

      </el-row>
      <!-- <el-divider></el-divider> -->
      <!-- <el-row>
        <el-col :spn="24">
          <span style="font-size: 16px; font-weight: bold;">  Order Number: {{ rowInfo.orderNumber }} </span>
        </el-col>
      </el-row> -->
        <div style="font-size: 16px; font-weight: bold;">  Order Number: {{ rowInfo.orderNumber }} </div>
         <BaseTable :data="rowInfo.items"  :columns="dimensionDatacolumns" />
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
      <el-input v-if="mblNumberSearchPerm" v-model="queryParams2.carrierBookingNumber" placeholder="Carrier Booking Number" style="width: 200px;padding: 10px;" />
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
        <!-- <el-upload
          v-hasPermi="['order:po-management:task:uplod-cargoo-inbound']"
          v-if="showCargoInboundUpload"
          :action="computedUploadUrl"
          style="margin-left: 8px"
          :show-file-list="false"
          :before-upload="beforeUpload1"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :auto-upload="true"
          :headers="uploadDocument.headers"
        >
          <el-button type="primary" icon="el-icon-upload">Batch Upload Update</el-button>
        </el-upload> -->
        <div style="margin-left: 8px" v-hasPermi="['order:po-management:task:uplod-cargoo-inbound']" v-if="showCargoInboundUpload">
          <cargo-inbound-upload-button @onSuccessCallback="onSuccessCallback" />
        </div>
          <el-button type="primary" v-if="batchUpdateCRDPerm"  icon="el-icon-edit"  @click="pepcoBatchUpdateCRDMethod">Batch Update Cargo Ready Date</el-button>
          <el-button type="primary" v-if="batchUpdateDimensions"  icon="el-icon-edit"  @click="batchUpdateDimensionMethod">Batch Update Dimensions</el-button>
        <el-button v-if="showGateIn" :loading="gateInLoading" type="primary" @click="downloadGateInTemplate">Batch Upload Update template</el-button>
        <div style="margin-left: 8px" v-if="showGateIn" v-has-permi="['order:task:batch-upload-container-gate-in']">
          <container-gate-in-upload-button @onSuccessCallback="onSuccessCallback" />
        </div>
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
            {{ parseTime(scope.row.finishedTime!=null?scope.row.finishedTime:scope.row.updateTime) }}
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
                class="el-icon-message"
                :style="scope.row.taskCode === 'Pepco_Booking_Approval' || scope.row.taskCode === 'Pepco_Booking_Score'? 'color: #c0c4cc; cursor: not-allowed;' : 'cursor: pointer;'"></i>
            </el-popover>
            <i v-show="!(userCompanyTypeOnlyViewPerm())&&scope.row.status == 1 && user.deptId == scope.row.partyId" @click="handleTask(scope.row)"
              style="cursor: pointer;" class="el-icon-edit"></i>
            <i v-if="(scope.row.taskName == 'QC Approve' || scope.row.taskName == 'Inspection Status') && scope.row.status == 2"
              @click="viewQcResult(scope.row)" class="el-icon-view"></i>
            <i v-if="!(scope.row.taskName == 'QC Approve' || scope.row.taskName == 'Inspection Status') && scope.row.jsonData != null && scope.row.status == 2"
              @click="viewTask(scope.row)" class="el-icon-view"></i>
            <svg v-hasPermi="['pepco:withdraw:container-gate-in']" v-if="scope.row.showWithdrawBtu && scope.row.taskName == 'Container Gate In'"
                 @click="withdrawContainerGateIn(scope.row,'milestone')"
                 class="el-icon"
                 viewBox="0 0 1024 1024"
                 style="padding-left: 5px; cursor: pointer; width: 16px; height: 16px; vertical-align: -2px; display: inline-block; fill: currentColor;">
              <path d="M328.832 449.514667a42.666667 42.666667 0 0 1-60.330667 60.330666L87.466667 328.832a42.666667 42.666667 0 0 1 0-60.330667L268.501333 87.466667a42.666667 42.666667 0 0 1 60.330667 60.330666l-108.181333 108.16L618.666667 256c188.522667 0 341.333333 152.810667 341.333333 341.333333s-152.810667 341.333333-341.333333 341.333334H170.666667a42.666667 42.666667 0 1 1 0-85.333334h448c141.376 0 256-114.624 256-256s-114.624-256-256-256H220.650667l108.181333 108.181334z">
              </path>
            </svg>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="queryParams2.total" layout="total, sizes, prev, pager, next, jumper"
        :page.sync="queryParams2.pageNo" :limit.sync="queryParams2.pageSize" :page-sizes="[20, 30, 50]"
        @pagination="handlePageChange" />
    </el-dialog>

    <upload-order-file-hbl ref="uploadOrderFileHbl" @confirm="submitUploadFileTask" @refresh="submitSuccess"></upload-order-file-hbl>

    <verify-documents ref="verifyDocuments"  @confirm="submitSuccess"> </verify-documents>
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

    <cbm-warning-dialog
      :visible.sync="cbmWarningDialogVisible"
      :details="cbmWarningDetails"
      @confirm="handleCbmWarningConfirm"
      @cancel="handleCbmWarningCancel"
    ></cbm-warning-dialog>

    <container-gate-in
      :visible="containerGateInVisible"
      :title="title"
      :containerGateInInfo="containerGateInInfo"
      @onContainerGateInClose="onContainerGateInClose"
      @onContainerGateInSuccess="onContainerGateInSuccess" />
    <container-gate-in-view
      :visible="containerGateInViewVisible"
      :title="title"
      :containerGateInInfo="containerGateInInfo"
      @onContainerGateInViewClose="onContainerGateInViewClose" />

    <air-order-drawer ref="airOrderDrawer" @refresh="submitSuccess"/>
    <Cargo-Ready-Date-Handler ref="cargoReadyDateHandler" @success="submitSuccess" />

<update-sea-air-booking-number-dialog ref="updateSeaAirBookingNumberDialog"
  :visible.sync="showUpdateSeaAirBookingNumberDialog" :data="updateSeaAirBookingNumberData"
  @submit="handleUpdateSeaAirBookingNumber"></update-sea-air-booking-number-dialog>

<!-- @success="refresh" -->
      <AirPreAlertHandler ref="airPreAlertHandler" @success="submitSuccess" />

    <order-reject-dialog
      :visible="orderRejectVisible"
      :order-info="orderRejectInfo"
      @onClose="onOrderRejectClose"
      @onRejectSuccess="onOrderRejectSuccess"
    />
  </div>
</template>

<script>
import { DICT_TYPE, getDictDatas } from "@/utils/dict";
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数
import '@icon-park/vue/styles/index.css';
import { IconPark } from '@icon-park/vue/es/all';
import { getTaskStatus } from "@/utils/auth";
import { getUserProfile, getUserCompanyTypeList } from "@/api/system/user";
import { getBaseHeader } from "@/utils/request";
import {
  holdHeader,
  activeHeader,

  orderReport,
  importPepcoTemplate,
  exportPO,
  updateCRD,
  groupByCountryAndSuppliercode,
  downloadOrderData,
  deleteHeader,
  countOrderByCountry,
  // getHeaderTaskPage,
  getHeaderPageForPepcoList,
  getOrderTaskList,
  reactivateFromCancelPo,
  getExpandedData,
  getHeaderTasksByOrderNumbers,
  downloadOrderListData,
  getOrderItemList,
  withdrawContainerGateInMilestone,
  withdrawCargoInboundMilestone,
} from "@/api/order/header";
import { getItemList, getListByCondition } from "@/api/order/item";
import { getProductList } from "@/api/system/product";
import { getTaskNames, updateTask, updateDimensionsData, reminder, taskReport, getTaskPage, exportOrderMilestoneData,
  updateSoReleasedTask, updateCargoHandoverDateTask, getAllTaskNamesMap,
  updateInspectionStatusTask,
  //  updatePreAlertTask,
  exportCargoInboundUploadTemplate, downloadGateInTemplate
} from "@/api/order/task";
import { createSubscribe, deleteSubscribe } from "@/api/order/subscribe";
import SelectedListBox from "./components/selected-list-box.vue";
import customBrokerAssigned from "./components/custom-broker-assigned.vue";
import viewCustomBrokerAssigned from "./components/view-custom-broker-assigned.vue";
import { getSoRelatedPo,getSameOrderTask} from "@/api/pepco/shipping-order.js";
import { PO_TAG_RULES } from '@/api/order/constants/poTagRules'
import VerifyDocuments from "./components/verify-documents.vue";
import PepcoBookingScore from './components/pepco-booking-score.vue';
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
import batchUpdateDimensionsDialog from "@/views/purchaseOrder/pepco/components/batch-update-dimensions-dialog.vue";
import {getDestinationDcList} from "@/api/destination/destination";
import {parseUTCTime} from "@/utils/ruoyi";
import { isLocalCalendarDateBeforeToday } from "@/utils/dateUtils";
import PreAlertHandler from "@/views/purchaseOrder/pepco/milestones/handler/pre-alert-handler/index.vue";
import CbmWarningDialog from './components/cbm-warning-dialog.vue';

import AirPreAlertHandler from '@/views/purchaseOrder/pepcoNew/milestones/handler/sea-air-pre-alert/index.vue'



import { dimensionTips,dimensionTipscolumns, _task1Temp, _uploadTypes, _fileType, _allMilestone, _otherMilestones, _containerStatus, _milestonePermMap, _dc_name, merchCodeOptions } from './components/enumdata.js'
import PoExpandContent from "./components/PoExpandContent.vue"
import SupplierText from '@/views/components/supplier-text/index.vue'
import BaseTable from "./UIcomponts/baseTable.vue";

import VerifyDocumentHandler from "@/views/purchaseOrder/pepco/milestones/handler/verify-document-handler/index.vue";
import CargoReadyDate from "@/views/purchaseOrder/pepco/components/cargo-ready-date.vue";
import CargoReadyDateUpdate from "@/views/purchaseOrder/pepco/components/cargo-ready-date-update.vue";
import uploadOrderFileHbl from "./components/upload-order-file-hbl.vue";

import { fileLoadMixin } from '@/utils/fileLoadMixin'

import moment from "moment";
import {mapGetters} from 'vuex'
import AmendCargoReadyDate from "@/views/purchaseOrder/pepco/components/amend-cargo-ready-date.vue";
import OverviewTipPopover from '@/views/components/overview/overview-tip-popover.vue';
import CargoInboundDialog from "@/views/purchaseOrder/pepco/components/cargo-inbound-dialog.vue";
import CargoInboundUpdateDialog from "@/views/purchaseOrder/pepco/components/cargo-inbound-update-dialog.vue";
import CargoInboundUploadButton from "@/views/purchaseOrder/pepco/components/cargo-inbound-upload-button.vue";
import ContainerGateIn from "@/views/purchaseOrder/pepcoNew/components/container-gate-in.vue";
import ContainerGateInView from "@/views/purchaseOrder/pepcoNew/components/container-gate-in-view.vue";
import ContainerGateInUploadButton from "@/views/purchaseOrder/pepcoNew/components/container-gate-in-upload-button.vue";
import ShipIcon from "@/views/air-booking/components/icons/ShipIcon.vue";
import PlaneIcon from "@/views/air-booking/components/icons/PlaneIcon.vue";
import AirOverview from "@/views/air-booking/milestone/index.vue";
// import SeaOverview from "@/views/purchaseOrder/pepcoNew/overview.vue";
// import SeaAirOverview from "@/views/purchaseOrder/pepcoNew/overview.vue";
import AirOrderDrawer from "@/views/air-booking/milestone/components/order-drawer.vue";
import {pepcoMilestoneHasPendingTasks,pepcoSeaAirMilestoneHasPendingTasks} from "@/api/order/task";
import { airMilestoneHasPendingTasks, getAirTaskNamesMap } from "@/api/air/booking";
import CargoReadyDateHandler from '@/views/air-booking/milestone/handler/01-cargo-ready-date/index.vue'
import updateSeaAirBookingNumberDialog from "@/views/shipment/detail/components/update-sea-air-booking-number-dialog.vue";
import OrderRejectDialog from './components/order-reject-dialog.vue'

export default {
  name: "pepco-order",
  mixins: [fileLoadMixin],
  components: {
    ContainerGateInUploadButton,
    ContainerGateInView,
    ContainerGateIn,
    OverviewTipPopover,
    AmendCargoReadyDate,
    CargoInboundUploadButton,
    CargoInboundUpdateDialog,
    CargoInboundDialog,
    VerifyDocumentHandler,
    CargoReadyDateUpdate,
    CargoReadyDate,
    uploadOrderFileHbl,
    IconPark,
    SelectedListBox,
    VerifyDocuments,
    uploadOrderFile,
    PepcoBookingScore,
    customBrokerAssigned,
    bookingScoreView,
    viewUploadOrderFile,
    viewVerifyDocuments,
    viewCustomBrokerAssigned,
    officePreview,
    viewPoManagementDocuments,
    CheckOrderStatusDialog,
    BatchUpdateCrdDialog,
    PreAlert,
    batchUpdateDimensionsDialog,
    PreAlertCheckOrderStatusDialog,
    PreAlertHandler,
    CbmWarningDialog,
    PoExpandContent,
    SupplierText,
    BaseTable,
    ShipIcon,
    PlaneIcon,
    AirOverview,
    AirOrderDrawer,
    CargoReadyDateHandler,
    updateSeaAirBookingNumberDialog,
    AirPreAlertHandler,
    OrderRejectDialog
  },
  props: {
    showTaskPage: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      allMilestoneDDLModel:'',
      firstRequest:true, // sea-air 首次请求
       showUpdateSeaAirBookingNumberDialog: false,
       updateSeaAirBookingNumberData: {
         bookingNumber: '',
         shipmentId: 0,
         confirmationDate: null
       },
      originDataUpdateTime:'',
      bookingNumber:null,
      //上传文件类别
      expandRowKeys: [],
      shippingNumbers: [],
      preDataform:[],
      poFileType: '06',
      taskLoading: false,
      taskDetailDataVisible: false,
    taskDetailData: [],
    cbmWarningDialogVisible: false,
    cbmWarningDetails: '',
    cbmWarningResolve: null,
      taskDetailData2Loading: false,
      downloadMilestoneLoading:false,
      downloadCargoInboundUploadTemplateLoading: false,
      downloadOrderLoading:false,
      orderRejectVisible: false,
      orderRejectInfo: {},
      dimensionTips,
      dimensionTipscolumns,
      merchCodeOptions,
      uploadError: {
        title: "Errors",
        dialogVisible: false,
        data: ""
      },
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
      task1: [],
      task3: [],
      originData: [],
      destinationData: [],
      task1Temp:_task1Temp,
      task3Temp: [ ],
      drawer2: false,
      drawer: false,
      tableData: [],
      downloadLink: '',
      user: {},
      uploadTypes: _uploadTypes,
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

      exportLoading: false,
      tableHeight: 0,
      loading: true,
      total: 0,
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
        poTags: [],
        mblNumber: null,
        merchCode: null,
        status: 0,
        taskStatusArray: [],

      },
      taskStatusValue: null,
      filterPopover:false,
      filterSeaAirPopover:false,
      preBookMap: {},
      orderNumberMap: {},
      soReleasedVisible: false,
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
      // preAlertDateFormVisible: false,
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
      shipments: [],
      shipmentItemMap: {},
      data: {},
      itemMap: {},
      expanded: {},
      loadingMap: {},
      preAssgine: [],
      preAssgineForm: {},
      shipmentStatusMap: {},
      vesselMap: {},
      taskList: [],
      // 查看shippingBooking里程碑的状态
      isShippingBooked: false,
      hiddenTask: false,
      taskNames: [],
      orderInfo: {
        ports: [],
        booked: 0,
        notBooked: 0,
      },
      checkedPort: {},
      taskInfo: {},
      taskSeaAirInfo: {},
      queryParams2: {
        total:0,
        pageNo: 1,
        pageSize: 20,
        mblNumber: '', // 确保已初始化
        carrierBookingNumber: '', // zane 之前叫mblnumber和新加功能重复了
        soRef: ''
      },
      // po 整行数据
      rowInfo: {},
      // dimensions popup 原始 items 数据（用于比较 CBM 变化）
      originalRowInfoItems: [],
      // SO Related Po in same shipment
      orderList: [],
      soRelatedPoList: [],
      taskData: [],
      verifyResult: [],
      dialogVisible: false,
      // 用户所在的公司类型列表
      userCompanyTypeList: [],
      allTaskNames: [],
      // air milestone task names
      airTaskNames:[],
      taskStatusOptions:[
        {
          value: 'Sea',
          label: 'Sea',
          children: []
        },
        {
          value: 'Air',
          label: 'Air',
          children: []
        },
        {
          value: 'sea_air',
          label: 'Sea Air',
          children: []
        }
      ],
      typeNumber: 0,//document种类
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
      milestonePermMap: _milestonePermMap,
      // dimensions tips
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
      fileList:[],
      dcDataList: [],
      supplierList: [],
      dc_name:_dc_name,
      batchUpdateDimensions: false,
      // dimensions number edit perm
      dimensionNumberEditPerm: false,
      supplierTypeOptions: [
        { label: 'DIRECT', value: 'DIRECT' },
        { label: 'PGS', value: 'PGS' }
      ],
      countryData: [],
      uploadUrl: process.env.VUE_APP_BASE_API + '/admin-api/order/task/pepco/cargo-inbound-possible-file/upload',
      // 默认隐藏上传组件
      showCargoInboundUpload: false,
      errorDialog: {
        visible: false,
        data: [] // 错误汇总数据结构：[{ type, count, details }]
      },
      mileOptions: [],
      allMilestoneDDLOptions: [
        {
          value: 'Sea',
          label: 'Sea',
          children: []
        },
        {
          value: 'Air',
          label: 'Air',
          children: []
        },
        {
          value: 'sea_air',
          label: 'Sea Air',
          children: []
        }
      ],
      expandedRowData:{},
      isExpandLoading:false,
      isDrawerLoading:false,
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
      // 默认显示 SEA 标签页
      activeOverviewTab: 'sea',
      // shipTip
      shipOverviewTip: false,
      // planeTip
      planeOverviewTip: false,
      // sea-airTip
      seaAirOverviewTip: false,
      formFlags:['crdFormVisible', 'inspectionFormVisible', 'qcFormVisible', 'pickupFormVisible', 'containerStuffingFormVisible', 'customClearanceFormVisible',
          'nominateShippingWeekFormVisible', 'cargoReadyDateFormVisible', 'dimensionsFormVisible', 'documentationCheckFormVisible',  'taskDetailDataVisible', ],
      tableColumns: [
        { type: 'selection', width: 55, selectable: (row) => this.canBeSelect(row) },
        {
          type: 'expand',  render: ({ row }) => {
            if (this.expandedRowData[row.id]) {
              return (
                <PoExpandContent
                  hiddenTask={this.hiddenTask}
                  dataSource={this.expandedRowData[row.id]}
                  id={row.id}
                  shippingId={row.shippingId}
                  orderNumber={row.orderNumber}
                   />
              );
            }else{
              return ( <div style="height: 100px;" v-loading='isExpandLoading'></div>);
            }
          }},
        {
          label: 'Order Number', minWidth: 130, sortable: 'custom', prop: 'orderNumber',
          render: ({ row }) => {
            return <span style="color:black">{row.orderNumber}</span>
          }
        },
        {
          label: 'Supplier Name', prop: 'supplierCode', minWidth: 200,tooltip: true, render: ({ row }) => {
            return <SupplierText supplierId={row.seller} />
          },
        },
        {
          label: 'Pending Status', prop: 'status', width: 200,  notShow:this.hiddenTask,render: ({ row, index }) => {
            const {status, taskStatus, taskStatusSeq, freightMethod} = row;
            return <div>

              {status == '0' &&
                      <span onClick={() => {
                        this.showTask(row, index)
                      }} style="text-decoration: underline;cursor: pointer">
               {taskStatus == 'Container Loading Plan' ? 'Container Loading Result' : freightMethod == 'sea_air' ?
                       (taskStatusSeq > 33 ? 'Destination In Process' : taskStatus) : taskStatusSeq > 20 ? 'Destination In Process' : taskStatus}
              </span>}


              { status =='0' &&  this.$auth.hasPermi('pepco:order:delete') &&  <i onClick={()=>{this.cancelPO(row)}} style="cursor: pointer;" class="el-icon-delete">Cancel</i>}
              { status =='1' &&  <span style="color: red;font-weight: 800;"> Canceled{ this.$auth.hasPermi('pepco:order:reactivate') && <i onClick={() => { this.reactivatePO(row) }}
                                                                                                                                           style="cursor: pointer; color: green; margin-left: 5px;"
                                                                                                                                           class="el-icon-refresh"
                                                                                                                                           title="Reactivate"/>}
              </span>}
              {status == '0' && taskStatusSeq < 7 && this.$auth.hasPermi('pepco:order:hold') && <i onClick={() => { this.holdPO(row) }} style="cursor: pointer;" class="el-icon-edit">Hold</i>}
              {status == '2'  && <span style="cursor: pointer;color:#e6a23c;"> Hold </span>}
              {status == '2' && this.$auth.hasPermi('pepco:order:active') && <i onClick={() => {this.activePO(row)}} style="cursor: pointer;" class="el-icon-edit">Active</i>}
            </div>
          }
        },
        {
          label: 'Process', prop: 'bookedLines', width: 150, notShow: this.hiddenTask, render: ({ row }) => {
            const process = row.process || { total: 0, completed: 0 };
            return (<div style='position:relative'>
              <el-progress stroke-width={13}
              percentage={ process.total==0 ? 0 : parseInt(process.completed / process.total * 100)} > </el-progress>
              <span style="position: absolute;top: -4px; left: 35px; color: white;"> {process.total == 0 ? 0 :
              `${process.completed}/${process.total}`} </span>
            </div>)
          },
        },
        {
          label: 'HOD', prop: 'cargoHandoverDate', width: 150, sortable: 'custom', formatter: (row) => {
            return parseUTCTime(row.cargoHandoverDate)
          }
        },
        {
          label: 'Planned CRD', prop: 'cargoHandoverDate', width: 150, sortable: 'custom', formatter: (row) => {
            return parseUTCTime(row.cargoHandoverDate - (7 * 24 * 60 * 60 * 1000))
          }
        },
        {
          label: 'Supplier CRD', prop: 'cargoReadyDate', width: 150, sortable: 'custom', render: ({row}) => {
            return (
              <span>
                {row.cargoReadyDate == null ? '' : parseUTCTime(row.cargoReadyDate)}
                {row.cargoReadyDateEditable && <i onClick={() => { this.updateCRD(row) }} style="cursor: pointer;" class="el-icon-edit"></i>}
                {row.cargoReadyDateRevisionable && <i onClick={() => { this.amendCRD(row) }} style="cursor: pointer;" class="el-icon-tickets"></i>}
              </span>
            )
          }
        },
        { label: 'AHOD', prop: 'actualCargoHandoverDate', width: 110, sortable: 'custom', formatter: (row) => {
            return this.parseUTCTime(row.actualCargoHandoverDate)
          } },
        {
          label: 'In-DC Date', prop: 'deliveryDate', width: 110, sortable: 'custom', formatter: (row) => {
            return this.parseUTCTime(row.deliveryDate)
          }
        },
        // {
        //   label: 'Sanitary Risk', prop: 'sanitaryRisk', width: 110, render: ({ row }) => {
        //     return (<span style={{ color: row.sanitaryRisk ? 'red' : 'green' }}  >
        //       {row.sanitaryRisk ? 'Y' : 'N'}
        //     </span>)
        //   }
        // },
        {
          label: 'Booking Date', prop: 'lastBookingTime', width: 110, sortable: 'custom', formatter: (row) => {
            return parseUTCTime(row.lastBookingTime)
          }
        },
        {
          label: 'Booked ETD', prop: 'bookedEtd', width: 150, sortable: 'custom', formatter: (row) => {
            return this.parseUTCTime(row.bookedEtd) || 'Not Booked'
          }
        },
        {
          label: 'Booked ETA', prop: 'bookedEta', width: 150, sortable: 'custom', formatter: (row) => {
            return this.parseUTCTime(row.bookedEta) || 'Not Booked'
          }
        },
        {
          label: 'ETD', prop: 'etd', width: 90, sortable: 'custom', formatter: (row) => {
            return row.etd != null ? parseUTCTime(row.etd) : ''
          }
        },
        {
          label: 'ETA', prop: 'eta', width: 90, sortable: 'custom', formatter: (row) => {
            return row.eta != null ? parseUTCTime(row.eta) : ''
          }
        },
        {
          label: 'ATD', prop: 'atd', width: 115, sortable: 'custom', formatter: (row) => {
            return row.atd != null ? parseUTCTime(row.atd) : ''
          }
        },
        {
          label: 'ATA', prop: 'ata', width: 110, sortable: 'custom', formatter: (row) => {
            return row.ata != null ? parseUTCTime(row.ata) : ''
          }
        },
        {
          label: 'PO Tag',
          prop: 'poTag',
          minWidth: 120,
          align: 'center',
          render: (scope) => {
            const row = scope?.row || scope
            if (!row) return <span>-</span>

            const tags = this.getPoTags(row)
            if (!tags.length) return <span>-</span>

            return (
              <div>
                {
                  tags.map(tag => (
                    <el-tag
                      key={tag.code}
                      type={tag.type}
                      size="small"
                      class={[tag.className, 'mr-4']}
                    >
                      {tag.label}
                    </el-tag>
                  ))
                }
              </div>
            )
          }
        },
        {
          label: 'Actions',
          minWidth: 120,
          fixed: 'right',
          align: 'center',
          render: scope => {
            const buttons = []
            // Reject
            if (scope.row.taskStatusSeq > 7 && scope.row.taskStatusSeq < 15) {
              buttons.push(
                <el-tooltip popper-class="action-icon-tooltip" effect="dark" content="Reject" placement="top">
                  <svg-icon class='action-icon' icon-class="close-circle" onClick={() => {
                    this.handleOrderReject(scope.row)
                  }} />
                </el-tooltip>
              )
            }
            // Hold
            if (scope.row.status == '0' && scope.row.taskStatusSeq < 7 && this.$auth.hasPermi('pepco:order:hold')) {
              buttons.push(
                <el-tooltip popper-class="action-icon-tooltip" effect="dark" content="Hold" placement="top">
                  <svg-icon class='action-icon' icon-class="pause-circle" onClick={() => {
                    this.holdPO(scope.row)
                  }} />
                </el-tooltip>
              )
            }
            // Cancel
            if (scope.row.status == '0' && this.$auth.hasPermi('pepco:order:delete')) {
              buttons.push(
                <el-tooltip popper-class="action-icon-tooltip" effect="dark" content="Cancel" placement="top">
                  <svg-icon class='action-icon' icon-class="delete" onClick={() => {
                    this.cancelPO(scope.row)
                  }} />
                </el-tooltip>
              )
            }
            // Reactive
            if (scope.row.status == '1' && this.$auth.hasPermi('pepco:order:reactivate')) {
              buttons.push(
                <el-tooltip popper-class="action-icon-tooltip" effect="dark" content="Reactive" placement="top">
                  <svg-icon class='action-icon' icon-class="refresh" onClick={() => {
                    this.reactivatePO(scope.row)
                  }} />
                </el-tooltip>
              )
            }
            return buttons.length ? buttons : null
          }
        }




        // {label: 'OTB', prop: 'otb', width: 110, sortable: 'custom', formatter: (row) => {
        //     return  row.otb=='1'?"Yes":row.otb=='0'?"No":'-'
        //   },
        // },
      ],
      dimensionDatacolumns: [
        { label: 'Item Number', prop: 'productCode', minWidth: 100, align: 'center' },
        { label: 'TCId', prop: 'tcId', minWidth: 80, align: 'center' },
        { label: 'L(cm)', prop: 'length', minWidth: 120, align: 'center', render: ({ row }) => {
            return (  <el-input-number disabled={this.view}  placeholder=""  value={row.length}  onInput={(val) => { row.length = val }}
                controls-position="right" clearable min={0}  style="min-width: 110px"  />
            );
          }
        },
        { label: 'W(cm)',  minWidth: 120, align: 'center', render: ({ row }) => {
            return ( <el-input-number  disabled={this.view} placeholder=""  value={row.width}  onInput={(val) => { row.width = val }}
                controls-position="right" clearable  min={0}  style="min-width: 110px" />
            );
          }
        },
        { label: 'H(cm)',   prop: 'height', minWidth: 120, align: 'center', render: ({ row }) => {
           return (  <el-input-number
                disabled={this.view}  placeholder=""  value={row.height}  onInput={(val) => { row.height = val }}
                controls-position="right" clearable  min={0}  style="min-width: 110px" />
            );
          }
        },
        { label: 'Gross Weight(kg)', prop: 'outerWeight',  minWidth: 120, align: 'center',  render: ({ row }) => {
            return (  <el-input-number   disabled={this.view}  value={row.outerWeight} placeholder=""   onInput={(val) => { row.outerWeight = val }}
                  controls-position="right"  clearable style="min-width: 110px"  />
            );
          }
        },
        { label: 'Net Weight(kg)',prop: 'innerWeight', minWidth: 120, align: 'center', render: ({ row }) => {
            return (  <el-input-number disabled={this.view}  placeholder="" value={row.innerWeight}  onInput={(val) => { row.innerWeight = val }}
                controls-position="right" clearable style="min-width: 110px" />
            );
          }
        },
        { label: 'Ordered Pieces/Outer Carton', prop: 'outerSize', minWidth: 167, align: 'center' },
        { label: 'Produced Pieces/Outer Carton', prop: 'bookedProOuterSize',minWidth: 175, align: 'center', render: ({ row }) => {
            return (  <el-input-number  disabled={this.view || !this.dimensionNumberEditPerm} value={row.bookedProOuterSize} onInput={(val) => { row.bookedProOuterSize = val }}
                controls-position="right" clearable style="min-width: 110px"  />
            );
          }
        },
        { label: 'Ordered Inner/Outer Carton',minWidth: 165, align: 'center', render: ({ row }) => {
          return <span>{this.calculateDivisionMethod(row.outerSize, row.tcSize)}</span>; } },
        { label: 'Produced Inner/Outer Carton',  prop: 'bookedProInnerPerOuter', minWidth: 175, align: 'center',  render: ({ row }) => {
            return (
              <el-input-number style="min-width: 110px"
                controls-position="right" disabled={this.view || !this.dimensionNumberEditPerm}
                value={row.bookedProInnerPerOuter} onInput={(val) => { row.bookedProInnerPerOuter = val }} clearable />
            );
          }
        },
        { label: 'Ordered Outer(Cartons)', minWidth: 138,  align: 'center', render: ({ row }) => {
            return <span>{row.outerQty}</span>;
          }
        },
        { label: 'Ordered Volume(cbm)',  minWidth: 130,  align: 'center',  render: ({ row }) => {
            return <span>{row.cbm}</span>;
          }
        },
        { label: 'Calculated Volume(cbm)', minWidth: 145, align: 'center', render: ({ row }) => {
            if (row.length && row.width && row.height && row.outerQty) {
              return <span>{this.calculateCBM(row.length, row.width, row.height, row.outerQty).toFixed(3)}</span>;
            }
            return <span></span>;
          }
        }
      ],
      containerGateInVisible: false,
      containerGateInInfo: null,
      containerGateInViewVisible: false,
      showGateIn: false,
      gateInLoading: false,
    };

  },
  computed: {
    filteredSeaTaskNames() {
      // 过滤逻辑：先判空 + 类型兜底 + 排除包含Air的项
      return this.allTaskNames.filter(item => {
        // 1. 判空：确保item和item.label存在
        if (!item || !item.label) return false;
        // 2. 类型兜底：强制转为字符串，避免includes报错
        const labelStr = String(item.label);
        // 3. 核心逻辑：不包含"Air"才保留
        return !labelStr.includes("Air");
      });
    },
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
    seaTasks() {
      const excludeTasks = ['Air Transfer Confirmation','Air Transfer Departure','Air Transfer Pre Alert']
      let list = this.task1.filter(item=>!excludeTasks.includes(item.taskName))
      // 如果用户所在的公司类型列表为空，则返回原始数据 edwin
      if (this.userCompanyTypeList.length === 0) {
        return list;
      } else {
        return list.filter(task => task.type.some(type => this.userCompanyTypeList.includes(type)));
      }
    },
    // 增加对Task的过滤
    seaAirTasks() {
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
    ...mapGetters(['nickname']),
    // 增加 milestoneDDLModel
    // allMilestoneDDLModel: {
    //   get() {
    //     return this.queryParams.poStatus || this.queryParams.airPoStatus;
    //   },
    //   set(val) {
    //     if (!val || val.length === 0) {
    //       this.queryParams.poStatus = null;
    //       this.queryParams.airPoStatus = null;
    //       return;
    //     }
    //     const [first, second, third] = val;
    //     if (first === 'Air') {
    //       this.queryParams.airPoStatus = [second, third];
    //       this.queryParams.poStatus = null;
    //     } else if (first === 'Sea') {
    //       this.queryParams.poStatus = [second, third];
    //       this.queryParams.airPoStatus = null;
    //     }
    //   }
    // }
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
    // 监听tab
    activeOverviewTab(newV,oldV){
      if(newV === 'sea-air'){
        this.queryParams.shippingMode = "sea-air"
        if(this.firstRequest){
          // 发送请求

          this.taskSeaAirReport()
          this.firstRequest = false;
        }

      }else{
        delete this.queryParams.shippingMode
      }

    },
    allMilestoneDDLModel(val){
      console.log('allMilestoneDDLModel>>>>>>>>>>', val)
      if (!val || val.length === 0) {
          this.queryParams.poStatus = null;
          this.queryParams.airPoStatus = null;
          return;
        }
        const [first, second, third] = val;
        if (first === 'Air') {
          this.queryParams.airPoStatus = [second, third];
          this.queryParams.poStatus = null;
        } else if (first === 'Sea') {
          this.queryParams.poStatus = [second, third];
          this.queryParams.airPoStatus = null;
        }

    }

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

    getAirTaskNamesMap().then(res => {
      this.airTaskNames = res.data
      console.log("获取所有空运任务名称映射", this.airTaskNames);
      const airOption = this.taskStatusOptions.find(option => option.value === 'Air');
      if (airOption) {
        airOption.children = [...this.airTaskNames];
      }
      console.log("更新后的taskStatusOptions:", this.taskStatusOptions);

      const airDDLOptions = []
      this.airTaskNames.forEach(item => {
        airDDLOptions.push({
          ...item,
          children: [
            { label: 'Possible', value: 'Possible' },
            { label: 'Urgent', value: 'Urgent' },
            { label: 'Overdue', value: 'Overdue' },
            { label: 'Finished', value: 'Finished' },
          ]
        })
      })
      const airDDLOption = this.allMilestoneDDLOptions.find(option => option.value === 'Air');
      if (airDDLOption) {
        airDDLOption.children = airDDLOptions;
      }
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

      console.log('allTaskNames',this.allTaskNames)

      const seaOption = this.taskStatusOptions.find(option => option.value === 'Sea');
      var seaAllTaskNames = this.allTaskNames.filter(item => item&&item.label&&!item.label.includes("Air"))
      console.log('seaAllTaskNames',seaAllTaskNames)
      if (seaOption) {
        seaOption.children = [...seaAllTaskNames];
      }

      const seaAirOption = this.taskStatusOptions.find(option => option.value === 'sea_air');
      if (seaAirOption) {
        seaAirOption.children = [...this.allTaskNames];
      }

      const seaDDLOp = this.allMilestoneDDLOptions.find(option => option.value === 'Sea');
      console.log('mileOptions',this.mileOptions)
      var seaMileOption = this.mileOptions.filter(item => item&&item.label&&!item.label.includes("Air"))
      console.log('seaMileOption',seaMileOption)
      if (seaDDLOp) {
        seaDDLOp.children = [...seaMileOption];
      }

      const seaAirDDLOp = this.allMilestoneDDLOptions.find(option => option.value === 'sea_air');
      if (seaAirDDLOp) {
        seaAirDDLOp.children = [...this.mileOptions];
      }
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
    this.getList()
    this.orderReport()
    this.groupByCountryAndSuppliercode()
    this.overviewTipPopoverMethods()
    // 获取shipOverviewTip
    pepcoMilestoneHasPendingTasks().then(res => {
      console.log('shipOverviewTip:', res.data);
      this.shipOverviewTip = res.data
    }).catch(err => {
      console.error('Error fetching shipOverviewTip:', err);
    })
    pepcoSeaAirMilestoneHasPendingTasks().then(res => {
      console.log('shipOverviewTip:', res.data);
      this.seaAirOverviewTip = res.data
    }).catch(err => {
      console.error('Error fetching seaAirOverviewTip:', err);
    })
    // 获取planeOverviewTip
    airMilestoneHasPendingTasks().then(res => {
      console.log('planeOverviewTip:', res.data);
      this.planeOverviewTip = res.data
    }).catch(err => {
      console.error('Error fetching planeOverviewTip:', err);
    })
    // 获取sea-air tips
    // todo
    // seaAirMilestoneHasPendingTasks().then(res => {
    //   console.log('planeOverviewTip:', res.data);
    //   this.planeOverviewTip = res.data
    // }).catch(err => {
    //   console.error('Error fetching planeOverviewTip:', err);
    // })
  },
  methods: {
    triggerFilter(){
      // 自定义筛选
      this.queryParams.pageNo = 1;
      this.getList()
    },
    checkPermi,
    checkRole,
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

    getPartyRole(taskName) {
      if(taskName=='Cargo Inbound') {
        return 'OHA'
      } else if (taskName == 'Container Gate In') {
        return 'OHA'
      }
      return this.taskInfo[taskName]?.['partyRole'] || '-'
    },
    downloadDocument(file){
      window.open(file.fileUrl);
    },
    viewDocument(file){
      this.$refs.officePreview.previewDocument(file);
    },

    bookedChange(flag) {
      return;
    },

    clickPort1(item) {
      return;
    },

    taskReport(value) {
      this.taskLoading = true
      this.queryParams.cacheFlag = true
      taskReport({...this.queryParams, ...value}).then((res) => {
        this.taskInfo = res.data.statusCount
        this.originDataUpdateTime = res.data.dataTime
        this.taskLoading = false
        console.log(res.data)
      })
    },
    taskSeaAirReport(value) {
      this.taskLoading = true
      taskReport({...this.queryParams, ...value}).then((res) => {
        this.taskSeaAirInfo = res.data.statusCount
        this.originDataUpdateTime = res.data.dataTime
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
      if (task.taskCode === 'Pepco_Booking_Approval' || task.taskCode === 'Pepco_Booking_Score') {
        console.log('Pepco_Booking_Approval,Pepco_Booking_Score 关闭发送邮件功能', task);
        return;
      }
      reminder({
        status: this.showTaskStatus(task),
        orderNumber: task.orderNumber,
        taskName: task.taskName,
        partyId: task.partyId,
        shippingId: task.shippingId
      }).then((res) => {
        this.$notify({
          title: 'success',
          message: 'Reminder mail sent',
          type: 'success'
        });
      })
    },
    taskDetails(row, status) {
        this.taskRow = row
        var statusT = status.charAt(0).toUpperCase() + status.slice(1)
        var _statusT = statusT == 'Finished' ? 2: 1
        this.taskDetailDataVisible = true
        this.title = row.taskName === 'Container Loading Plan' ?  "Container Loading Result " + statusT : row.taskName + " " + statusT
        this.queryParams2 ={
          ...this.queryParams2,
          statuskey: statusT,
          taskName: row.taskName,
          status: _statusT,
          pageNo: 1,
          mblNumber: '',
          soRef: ''
        }
        this.batchUpdateCRDPermMethod(row, _statusT)
        this.showTaskDetailSearchMethod(row)
        this.isShowBatchUpdateDimensionBtn(row, _statusT)
        this.taskDataTableQuery()
        const { statuskey } = this.queryParams2
        const visibleData = (row.taskName || '').trim() == 'Cargo Inbound'  && ((statuskey || '').trim() == 'Possible' || (statuskey || '').trim() == 'Urgent' || (statuskey || '').trim() == 'Overdue')
        this.showCargoInboundUpload = visibleData
        this.showGateIn = row.taskName === 'Container Gate In' && ((statuskey || '').trim() === 'Possible' || (statuskey || '').trim() === 'Urgent' || (statuskey || '').trim() === 'Overdue')
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
      const valueStingData= ['tenantId', 'booked', 'ports','orderNumber','originPort','shippingPol','shippingPod', 'poTags','mblNumber',
      'supplierCode','dc','dcList','country', 'countryList','taskStatus','shipmentType','transportMode','hodDateRange','etdDateRange','prop','orderBy']
      valueStingData.map(ele=>{
        this.queryParams2[ele] = this.queryParams[ele]
      })
      if(this.queryParams.shippingMode == "sea-air") {
        this.queryParams2.shippingMode = "sea-air"
      } else {
        this.queryParams2.shippingMode = "sea"
      }
      getTaskPage(this.queryParams2).then((res) => {
        console.log(res.data)
        this.taskDetailData2Loading = false
        this.taskDetailData = res.data.list
        this.queryParams2.total = res.data.total

      })
    },
    getPoTags(row) {
      if(row.supplyModel=='NOS') {
        row.nos = true
      } else {
        row.nos = false
      }

      return PO_TAG_RULES
        .filter(rule => rule.match ? rule.match(row) : true)
        .map(rule => ({
          code: rule.code,
          label: rule.label,
          type: rule.type,
          className: rule.className || ''
        }))
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
    // getTaskNames() {
    getTaskNames(cacheFlag) {
      this.taskLoading = true
      getTaskNames({ type: '1' }).then((res) => {
        this.task1 = JSON.parse(JSON.stringify(this.task1Temp))
        this.task3 = JSON.parse(JSON.stringify(this.task3Temp))
        this.taskNames = res.data
        this.task1 = this.task1.filter(item => this.taskNames.indexOf(item.taskName) > -1)
        this.task3 = this.task3.filter(item => this.taskNames.indexOf(item.taskName) > -1)
        // this.taskReport()
        this.taskReport({cacheFlag: cacheFlag ? false : true })
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

    showTask(row, index) {
      if (!row.freightMethod || row.freightMethod === 'sea' || row.freightMethod === 'sea_air') {
        const { shippingId, shippingDraft } = row
        this.rowInfo = {
          ...row,
          items: row.items ? row.items.forEach(item => {
            item.bookedProOuterSize = (item.bookedProOuterSize === '' || item.bookedProOuterSize === undefined || item.bookedProOuterSize === null) ? item.outerSize : item.bookedProOuterSize
            item.bookedProInnerPerOuter = (item.bookedProInnerPerOuter === '' || item.bookedProInnerPerOuter === undefined || item.bookedProInnerPerOuter === null) ? this.calculateDivisionMethod(item.outerSize, item.tcSize) : item.bookedProInnerPerOuter
          }) : []
        }
        this.drawer = true
        this.isDrawerLoading = true
        this.dimensionNumberEditPerm = shippingId && shippingId > 0 && !shippingDraft ? false : true
        getOrderTaskList({ orderId: row.id }).then((res) => {
          this.isDrawerLoading = false
          this.taskList = res.data.map(item => {
            return {
              ...item,
              orderId: row.id
            }
          })
          this.title = res.data[0].orderNumber
        })
      }else if(row.freightMethod === 'air'){
        this.$refs.airOrderDrawer.openDrawer(row)
      }
    },

    handleDialogClose(){
        this.queryParams2 = {
        ...this.queryParams2,
        mblNumber: '',
        carrierBookingNumber: '',
        soRef: '',
        soCarrierNumber: ''
      }
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

    toTack(vesselName) {
      window.open('/track/ship?vesselName=' + vesselName)
    },
    toOrder(po) {
      window.open('/order/POManagement?orderNumber=' + po)
    },

    clearAll() {
      this.preBookMap = {};
    },
    handleClose(key) {
      delete this.preBookMap[key];
      this.preBookMap = JSON.parse(JSON.stringify(this.preBookMap));
    },
    getHeaderPage() {
      getHeaderPageForPepcoList({...this.queryParams,
        containerNo: this.queryParams.containerNo ? this.queryParams.containerNo.trim() : null,
        orderNumber: this.queryParams.orderNumber ? this.queryParams.orderNumber.trim() : null
      }).then((response) => {
        this.tableData = response.data.records?.map(ele=>{
          return {
            ...ele,
            items:ele.orderItemProductInfo
          }
        });
        this.total = response.data.total;
        this.loading = false;
        console.log("🚀 ~ this.tableData:", this.tableData, this.total)
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
    changePage(pageNo) {
      console.log("🚀 ~ pageNo:", pageNo)
      this.loading = true;
      this.queryParams.pageNo = pageNo
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
    handleExpandChange(row, expandedRows) {
      // 检查当前行是否在展开的行数组中
      const isExpanded = expandedRows.some(expandedRow => expandedRow.id === row.id);

      if (isExpanded) {
        // 展开：调用详情接口并添加 id 到 expandRowKeys
        this.isExpandLoading = true
        getExpandedData({ orderId: row.id }).then(response => {
          this.isExpandLoading = false
          console.log("🚀 ~ response:", response)
          this.expandedRowData[row.id] = response.data;
          // 如果不在 expandRowKeys 中，则添加
          if (!this.expandRowKeys.includes(row.id)) {
            this.expandRowKeys.push(row.id);
          }
        })
      } else {
        // 折叠：从 expandRowKeys 中移除
        const index = this.expandRowKeys.indexOf(row.id);
        if (index > -1) {
          this.expandRowKeys.splice(index, 1);
        }
      }
    },

    headerCellStyle({ column, columnIndex }) {
      if (columnIndex === 0) {
        return "hiddenCheck";
      }
    },
    // 能否被选中：如果状态为SO Release to Supplier，且未被预定，则可以选中
    canBeSelect(row) {
      if(row.taskStatus == 'Shipper Booking'&&row.booked==false){
        if( (row.shippingCancel != null && row.shippingCancel == false && row.shippingOrderStatus == 2)  || row.shippingId){
          //如果是被回退的shipping booking 并且还没有cancel 那不允许重新做   // 如果shippingId存在，说明已经shipping booking
          return false
        }
        return true
      }
      return  false
    },
    handleSelection(selection, row) {
      console.log("🚀 ~ selection, row:", selection, row)

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
      this.$refs.multipleTable.toggleRowSelection(row, false);
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

      this.view = false
      this.task = task
      this.form = {}
      // 更新rowInfo edwin
      await this.fetchAndUpdateRowInfo(task);

      if (this.rowInfo.status == '2') {
        this.$modal.msgWarning('Order Number:' + this.rowInfo.orderNumber + ' Status: Hold');
        return
      }
      if (this.rowInfo.status == '1') {
        this.$modal.msgWarning('Order Number:' + this.rowInfo.orderNumber + ' Status: Cancelled');
        return
      }

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
        console.log('Cargo Ready Date',this.rowInfo.cargoHandoverDate)
        const orderTask = await getHeaderTasksByOrderNumbers({ orderNumbers: task.orderNumber })
        if (orderTask.data) {
          this.crdInfo = {
            ...orderTask.data[0],
            cargoHandoverDate: this.rowInfo.cargoHandoverDate,
            orderTaskId: this.task.id
          }
          this.cargoReadyDateFormVisible = true
        }
      } else if (task.taskName == 'Dimensions') {
        // 保存原始 items 数据，用于后续比较 CBM 变化
        this.originalRowInfoItems = JSON.parse(JSON.stringify(this.rowInfo.items || []))
        this.dimensionsFormVisible = true
      } else if (task.taskName == 'Nominate Shipping Week') {
        this.nominateShippingWeekFormVisible = true
      } else if (task.taskName == 'Update Cargo handover date') {
        this.crdFormVisible = true
      } else if (task.taskName == 'Inspection Date') {
        this.inspectionFormVisible = true
      } else if (task.taskName == 'Verify Shipping Documents') {
         this.$refs.verifyDocumentHandler.openDialog({...task,shippingId: this.rowInfo.shippingId},true)
         // this.$refs.verifyDocuments.openDialog(task,'Upload_Shipping_Documents')
      } else if (task.taskName == 'QC Approve') {
        this.qcFormVisible = true
      } else if (task.taskName == 'Shipper Booking') {
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
        // // 根据taskName分别构造Cargo Inbound和Container Gate In类型的信息
        // 2026-04-28(TYIN-12416)，重新调整为so级别
           if (task.taskName === 'Cargo Inbound') {
        // 2026-04-09(TYIN-10079)，Cargo Inbound和Container Gate In都调整为po level
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
             if (task.status === 2) {
               // 更新操作
               this.cargoInboundUpdateVisible = true
             } else {
               // 提交操作
               this.cargoInboundVisible = true
             }
           } else if (task.taskName === 'Container Gate In') {
             // 填充打开Container Gate In时的必要信息
             this.containerGateInInfo = {
               orderId: task.orderId,
               orderNumber: task.orderNumber,
               shippingId: task.shippingId,
               shipmentId: this.rowInfo.shipmentIds && this.rowInfo.shipmentIds.length > 0 ? this.rowInfo.shipmentIds[0] : null,
               jsonData: task.jsonData
             }
             this.containerGateInVisible = true
        // this.form = {
        //   orderList: [],
        //   cargoHandoverDate: undefined,
        //   taskName: task.taskName,
        //   shipmentId: this.rowInfo.shipmentIds && this.rowInfo.shipmentIds.length > 0 ? this.rowInfo.shipmentIds[0] : null
        // }
        // if (task.jsonData) {
        //   try {
        //     const jsonData = typeof task.jsonData === 'string'
        //       ? JSON.parse(task.jsonData)
        //       : task.jsonData;
        //     this.form.cargoHandoverDate = jsonData.cargoHandoverDate || null;
        //   } catch (error) {
        //     console.error('解析 jsonData 失败:', error);
        //     this.form.cargoHandoverDate = null;
        //   }
        // } else {
        //   this.form.cargoHandoverDate = null;
        // }
        // getSoRelatedPo({ orderId: task.orderId }).then((res) => {
        //   if(res.data){
        //     if (res.data.shippingOrderItems.length == 0) {
        //       this.form.orderList = [task.orderId]
        //       this.soRelatedPoList = [{ orderId: task.orderId, orderNumber: task.orderNumber, disabled: true }]
        //     } else {
        //       res.data.shippingOrderItems.forEach(item => {
        //         console.log('shippingOrderItems',item)
        //         this.form.orderList.push(item.orderHeaderId)
        //       })
        //       this.soRelatedPoList = res.data.shippingOrderItems
        //     }
        //   }
        // })
        // this.cargoHandoverDateFormVisible = true
      }
    } else if (task.taskName == 'Empty Pick up') {
        this.pickupFormVisible = true
      } else if (task.taskName == 'Container Loading Plan' || task.taskName == 'CLP') {
        console.log('进入Container Loading Plan', task)
        // 判断所有order task 是否都进到clp待完成状态
        console.log(this.rowInfo.shipmentId)
        this.openNewWindow("/shipment/clp/add?shipmentId=" +(JSON.parse(task.jsonData).shipmentId)  + '&orderNumber=' + task.orderNumber + '&orderId=' + task.orderId + '&soRef=' + task.soRef)
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
        // 判断所有order task 是否都进到clp待完成状态
        console.log(JSON.parse(task.jsonData))
        console.log('task.jsonData', JSON.parse(task.jsonData).shipmentId)
        this.$refs.preAlertHandler.openDialog({...task,shippingId: this.rowInfo.shippingId}, this.rowInfo.taskStatus, null, true)
      }else if(task.taskName=='Pepco Booking Score'){
        this.openNewWindow("/shipment/ppBookingScore")
          // 跳转到pepco booking score页面
        }else if(task.taskName == 'Pepco Booking Approval'){
          const url = `/shipment/ppShippingOrderList?shipperRef=${task.orderNumber}`;
          window.open(url, '_blank', 'noopener,noreferrer');
      } else if(task.taskName=='Document Verification Complete'){
        // 获取po对应shipper order下的所有的po文件
          this.$refs.verifyDocuments.openDialog({...task,shippingId: this.rowInfo.shippingId},'all')
          // this.verifyShippingDocuments(task)
      }else if(task.taskName == 'Customs Broker Assign'){
        this.$refs.customsBrokerAssigned.openDialog(task)
      } else if (task.taskName == 'Air Transfer Confirmation') {
        this.openNewWindow("/shipment/detail?id=" + this.rowInfo.shipmentId)
      } else if (task.taskName == 'Air Transfer Departure') {
        this.openNewWindow("/shipment/detail?id=" + this.rowInfo.shipmentId)
      } else if (task.taskName == 'Air Transfer Pre Alert') {
        console.log('this.rowInfo', this.rowInfo)
        task.shipmentId = this.rowInfo.shipmentId
        this.$refs.airPreAlertHandler.handle(task, 'edit');
      }


    },

    viewQcResult(task) {
      this.qcFormVisible = true
      this.view = true
      //this.title=task.orderNumber+'['+task.taskName+']'
      this.form = JSON.parse(task.jsonData)
      // console.log(this.form.file)
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
      // console.log(this.downloadLink);
    },
    async viewTask(task) {
      this.view = true
      this.form = JSON.parse(task.jsonData)
      // 更新rowInfo
      await this.fetchAndUpdateRowInfo(task)
      // console.log('ths.rowInfo', this.rowInfo)
      if (task.taskName == 'Shipper Booking Validation') {
        this.openNewWindow("/shipment/ppShippingOrderList?shipperRef=" + task.orderNumber)
      } else
      if (task.taskName == 'Pre Alert') {
        const currentTask = this.rowInfo?.inProgressOrderTasks?.find(v=>v.status==1)||{}
        this.$refs.preAlertHandler.openDialog({...task,shippingId: this.rowInfo.shippingId}, currentTask.taskName, currentTask?.seq, false)
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
        // console.log(this.rowInfo)
        // console.log(task)
        this.openNewWindow("/shipment/ppShippingOrderDetail?id=" + JSON.parse(task.jsonData).shippingId)
      }else if(task.taskName == 'Pepco Booking Approval'){
        // console.log(this.rowInfo)
        // console.log(task)
        this.openNewWindow("/shipment/ppShippingOrderDetail?id=" + this.rowInfo.shippingId)
      }else if (task.taskName == 'Validate shipper booking') {
        if (this.$auth.hasPermi("booking:query")) {
          this.openNewWindow("/shipment/ppShippingOrderDetail?id=" + JSON.parse(task.jsonData).bookingId)
        } else {
          this.$modal.msgError('No permission, please find the administrator to apply');
        }
        // console.log("/shipment/ppShippingOrderDetail?id=" + JSON.parse(task.jsonData).bookingId, '_blank')
      } else if (task.taskName == 'Cargo Ready Date') {
        console.log('Cargo Ready Date', task)
        console.log('Cargo Ready Date',this.rowInfo.cargoHandoverDate)
        this.crdInfo = task
        this.crdInfo.cargoHandoverDate = this.rowInfo.cargoHandoverDate
        this.onlyView = true
        this.form ={}
        // this.form.cargoReadyDate = this.parseTimeToZ1(this.rowInfo.cargoReadyDate)
        this.$set(this.form, 'cargoReadyDate', this.parseTimeToZ1(this.rowInfo.cargoReadyDate))
        this.$forceUpdate()
          this.cargoReadyDateFormVisible = true
        } else if (task.taskName == 'Dimensions') {

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
            // console.log('Booking Confirmation', task)
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
              // 2026-04-28，重新调整为so level
              // 2026-04-09(TYIN-10079)，Cargo Inbound和Container Gate In都调整为po level
              if (task.taskName === 'Cargo Inbound') {
                this.cargoInboundInfo = {
                  ...task,
                  label: task.taskName,
                  shipmentId: this.rowInfo?.shipmentIds?.length > 0 ? this.rowInfo.shipmentIds[0] : null,
                  actualCargoHandoverDate: this.form.cargoHandoverDate
                }
                this.isCargoInboundOnlyView = true
                this.cargoInboundUpdateVisible = true
              } else if (task.taskName === 'Container Gate In') {
                this.containerGateInInfo = {
                  orderId: task.orderId,
                  orderNumber: task.orderNumber,
                  shippingId: task.shippingId
                }
                this.containerGateInViewVisible = true
              }
          }
          else if (task.taskName == 'Empty Pick up') {
            this.pickupFormVisible = true
          } else if (task.taskName == 'Container Loading Plan' || task.taskName == 'CLP') {
            // console.log(JSON.parse(task.jsonData))
            this.openNewWindow("/shipment/clp/detail?id=" + JSON.parse(task.jsonData).clpId)
          }else if (task.taskName == 'Upload Shipping Documents') {
            const currentTask = this.rowInfo?.inProgressOrderTasks?.find(v=>v.status==1)||{}
            this.$refs.uploadOrderFile.openDialog(task, currentTask.taskName,currentTask?.seq)
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
             this.$refs.viewCustomBrokerAssigned.openDialog(task)
          } else if(task.taskName == 'Pepco Booking Score'){
              this.$refs.bookingScoreView.openDialog(task)
          } else if(task.taskName == 'Release HBL and Invoice to Shipper'){
            const currentTask = this.rowInfo?.inProgressOrderTasks?.find(v=>v.status==1)||{}
              this.$refs.uploadOrderFileHbl.openDialog(task,currentTask.taskName,currentTask.seq)
          }else if(task.taskName == 'Verify Shipping Documents'){
            this.$refs.verifyDocuments.openDialog({...task,shippingId: this.rowInfo.shippingId},'Upload_Shipping_Documents')
          }else if(task.taskName == 'Document Verification Complete'){
            this.$refs.verifyDocuments.openDialog({...task,shippingId: this.rowInfo.shippingId},'all')
          } else if (task.taskName == 'Air Transfer Confirmation') {
            this.openNewWindow("/shipment/detail?id=" + this.rowInfo.shipmentId)
          } else if (task.taskName == 'Air Transfer Departure') {
            this.openNewWindow("/shipment/detail?id=" + this.rowInfo.shipmentId)
          } else if (task.taskName == 'Air Transfer Pre Alert') {
            console.log('this.rowInfo', this.rowInfo)
            task.shipmentId = this.rowInfo.shipmentId
            this.$refs.airPreAlertHandler.handle(task, 'view');
          }
    },
    async submitTask() {
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
    }else{
      this.submit()
    }
    },
    async submit() {
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
        const isValid = await this.validateDimensionsFields(this.rowInfo.items);
        if (!isValid) {
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
        let index = 0
        getSameOrderTask({ shippingOrderId: this.rowInfo.shippingId, taskCode: this.task.taskCode }).then((res) => {
          res.data.forEach(item => {
            //2026-03-03 haikang 记录最后一个数据，需要考虑并单下回退的情况2
            index++
            if (index == res.data.length) {
              item.isLast = true
            }
            item.jsonData = JSON.stringify(this.form)
            updateTask(item).then((res) => {
              this.formFlags.forEach(flag => this[flag] = false);
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
          this.formFlags.forEach(flag => this[flag] = false);
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

        this.formFlags.forEach(flag => this[flag] = false);
        // 关闭抽屉
        this.drawer = false;
        // 刷新列表
        this.getList();
      }).catch((error) => {
        // console.error('Error updating task:', error);
        if (error?.handled) {
          //统一在request.js处理
          // this.$message.error(error.msg);
          return;
        }
        this.$message.error('Failed to update task');
        this.getList();
      });
    },
    //  submitPreAlertTask() {
    //   this.task.jsonData = JSON.stringify(this.form)
    //   updatePreAlertTask(this.task).then((res) => {
    //     this.preAlertDateFormVisible = false
    //     this.drawer = false
    //     this.getList()
    //   })
    // },

    submitSoReleaseTask() {
      // console.log('submitSoReleaseTask',this.form)
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

    // // 验证上传文件
    // verifyShippingDocuments(data) {
    //   // 获取pod对应shipment下的所有的po文件
    //   this.dialogVisible = true
    //   this.$refs.verifyDocuments.openDialog(data)

    // },

    pepcoBatchUpdateCRDMethod(){
      console.log('跳转到 batch update crd dialog', this.queryParams2)
      this.$refs.batchUpdateCrdDialog.openDialog(this.queryParams2)
    },
    // 填充rowInfo edwin
    async fetchAndUpdateRowInfo(task) {
      const response = await getHeaderPageForPepcoList({ orderNumber: task.orderNumber });
      // let orderItemList
      // if(task.taskName == 'Dimensions'){
      //  const orderItemList = await getOrderItemList(task.orderId);
         response?.data?.records[0]?.orderItemProductInfo.forEach(item => {
            if (item.bookedProOuterSize === '' || item.bookedProOuterSize === undefined || item.bookedProOuterSize === null) {
              item.bookedProOuterSize = item.outerSize;
            }
            if (item.bookedProInnerPerOuter === '' || item.bookedProInnerPerOuter === undefined || item.bookedProInnerPerOuter === null) {
              item.bookedProInnerPerOuter = this.calculateDivisionMethod(item.outerSize, item.tcSize);
            }
        });
      // }
      this.rowInfo = {...response.data.records[0], items: response?.data?.records[0]?.orderItemProductInfo,
        shipmentId: response.data.records[0]?.shipmentIds?.[0] || null};
    },

    handleUpdateList(verifyResult) {
      // 强制刷新页面
      this.getHeaderPage()
    },
    updateCRD(row) {
      if (!row.freightMethod || row.freightMethod === 'sea' || row.freightMethod === 'sea_air') {
        this.crdInfo = {
          ...row.cargoReadyDateOrderTask,
          cargoHandoverDate: row.cargoHandoverDate,
          cargoReadyDate: row.cargoReadyDate,
          id: row.id,
          orderNumber: row.orderNumber,
        }
        console.log('updateCRD this.crdInfo:', this.crdInfo)
        this.form.taskStatusName = row.taskStatus
        this.cargoReadyDateUpdateFormVisible = true
      }else if(row.freightMethod === 'air'){
        if(row.cargoReadyDateAirMilestone){
          this.$refs.cargoReadyDateHandler.handle(row.cargoReadyDateAirMilestone, 'edit');
        }
      }
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
      if (!row.freightMethod || row.freightMethod === 'sea' || row.freightMethod === 'sea_air') {
        this.form = {}
        this.form = row
        this.form.type = 'PO CRD'
        this.form.orderId = row.id
        this.form.orderNumber = row.orderNumber
        this.form.originalData = JSON.stringify({
          "cargoReadyDate": row.cargoReadyDate,
          "orderId": row.id,
          "orderNumber": row.orderNumber
        })
        // this.cargoReadyDateAmendFormVisible = true
        this.crdAmendInfo = this.form
        this.crdAmendVisible = true
      }
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

    openNewWindow(ref) {
      var newWindow = window.open(ref,'_blank')
      if(newWindow) {
      } else {
        this.$router.push(ref);
      }
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
    handleStorageChange(event){
      if (event.key === 'refreshPoPage') {
        this.getList();
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
      const stringFlag = ['OHA Management', 'PEPCO Management', 'PEPCO SCM']
      return stringFlag.some(item =>this.userCompanyTypeList.includes(item))
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
    console.log('validateDimensionsFields items:', JSON.stringify(items))
      return new Promise((resolve) => {
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
              resolve(false);
              return;
            }
          }
        }

        // TB-8584 Check if any item has CBM changed by more than 1 from original value
        // Compare new CBM with original CBM, show warning if |new CBM - original CBM| > 1
        const itemsWithChangedCBM = [];

        items.forEach((item, index) => {
          const newCBM = (item.width * item.length * item.height * item.outerQty) / 1000000;
          const originalItem = this.originalRowInfoItems[index]; // 使用索引匹配对应项

          if (!originalItem) {
            return; // 跳过不存在的原始项
          }

          const originalCBM = (originalItem.length * originalItem.width * originalItem.height * originalItem.outerQty) / 1000000;
          console.log('originalItem:', JSON.stringify(originalItem),originalCBM)
          // 第一次提交Dimensions时不需要判断及弹窗显示，只有后续修改的时候才需要下面功能
          if (originalItem && originalCBM > 0) {
            const diff = newCBM - originalCBM;

            // Flag if |new CBM - original CBM| > 1 (difference greater than 1, increase or decrease)
            if (Math.abs(diff) > 1) {
              itemsWithChangedCBM.push({
                productCode: item.productCode,
                tcId: originalItem.tcId, // 存储tcId
                originalCBM: originalCBM.toFixed(3),
                newCBM: newCBM.toFixed(3),
                diff: diff.toFixed(3)
              });
            }
          }
          //  else {
          //   // If no original item found, just check if CBM > 1
          //   if (newCBM > 1) {
          //     itemsWithChangedCBM.push({
          //       productCode: item.productCode,
          //       originalCBM: 'N/A',
          //       newCBM: newCBM.toFixed(3),
          //       diff: newCBM.toFixed(3)
          //     });
          //   }
          // }
        });

        if (itemsWithChangedCBM.length > 0) {
          const details = itemsWithChangedCBM
            .map(item => {
              // 直接使用存储的tcId
              const tcId = item.tcId || 'N/A';

              return `Item Number: ${item.productCode} &nbsp;  TCId: ${tcId}<br>Original ${item.originalCBM} → New ${item.newCBM} (Diff: ${item.diff > 0 ? '+' : ''}${item.diff})`;
            })
            .join('<br><br>');

          this.cbmWarningDetails = details;
          this.cbmWarningDialogVisible = true;

          new Promise((resolvePromise) => {
            this.cbmWarningResolve = resolvePromise;
          }).then((result) => {
            resolve(result);
          });
        } else {
          resolve(true);
        }
      });
    },
    handleCbmWarningConfirm() {
      this.cbmWarningDialogVisible = false;
      if (this.cbmWarningResolve) {
        this.cbmWarningResolve(true);
        this.cbmWarningResolve = null;
      }
    },
    handleCbmWarningCancel() {
      this.cbmWarningDialogVisible = false;
      if (this.cbmWarningResolve) {
        this.cbmWarningResolve(false);
        this.cbmWarningResolve = null;
      }
    },
    //po页面的清除 筛选条件
    clearFilters(){
      this.queryParams={
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
        poTags: [],
        mblNumber: null,
        status: 0,
        taskStatusArray: [],
        airPoStatus: null,
      }
      this.taskStatusValue = null,
      this.getList()
    },
    activePO(row) {
      this.$confirm('Active ' + row.orderNumber + '?', 'Tips', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        return activeHeader({ id: row.id })
      }).then(() => {
        this.$message({
          type: 'success',
          message: 'Success!'
        });
        this.getList()
      }).catch(() => {
      });
    },
    holdPO(row) {
      this.$confirm('Hold ' + row.orderNumber + '?', 'Tips', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        return holdHeader({ id: row.id })
      }).then(() => {
        this.$message({
          type: 'success',
          message: 'Success!'
        });
        this.getList()
      }).catch(() => {
      });
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
      this.taskReport()
      this.taskDataTableQuery()
    },
      reactivatePO(row) {
      this.$confirm('Reativate ' + row.orderNumber + '?', 'Tips', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        return reactivateFromCancelPo(row.id)
      }).then(() => {
        this.$message({
          type: 'success',
          message: 'Success!'
        });
        this.getList()
      }).catch(() => {
      });
    },
    onContainerGateInClose() {
      this.containerGateInVisible = false
    },
    onContainerGateInSuccess() {
      this.containerGateInVisible = false
      this.loading = true;
      this.drawer = false
      this.getTaskNames()
      this.getHeaderPage()
    },
    onContainerGateInViewClose() {
      this.containerGateInViewVisible = false
    },
    downloadGateInTemplate() {
      // 数据为空直接返回
      if (this.taskDetailData.length === 0) {
        this.$notify({
          title: 'warning',
          message: 'No data to export',
          type: 'warning'
        });
        return
      }

      // 开始导出
      this.$confirm('Confirm the download?\n Note that a maximum of 60,000 pieces of data can be downloaded at a time.', 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.gateInLoading = true
        // 获取模板
        downloadGateInTemplate(this.queryParams2).then(res => {
          if (res) {
            // 下载成功提示
            this.$notify({
              title: 'success',
              message: 'Download Success',
              type: 'success'
            })
            // 导出生成Excel
            this.$download.excel(res, `Container Gate In Upload Template-${this.queryParams2.statuskey}-${new Date().getTime()}.xlsx`)
            this.gateInLoading = false
          }
        })
      }).catch(() => {
        this.gateInLoading = false;
      })
    },
    withdrawContainerGateIn(row,type) {
      console.log('点击回退Containergatein')
      this.$confirm('Are you sure you want to withdraw container gate in?', 'Withdraw Container Gate in', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        // 执行撤回操作
        console.log('revoke gate in', row)
        // 判断 如果status 不是2 则不操作
        if(row.status != 2){
          return
        }
        // 调用接口

        withdrawContainerGateInMilestone({ id: row.id }).then(response => {
          if (response.code === 0) {
            console.log('Withdraw gate in response:', response)
            this.$message({
              type: 'success',
              message: 'Withdraw gate in successfully!'
            })
            if(type =='milestone'){
              this.handlePageChange()

            }else{
              this.onCargoInboundSuccess()
            }
          } else {
            this.$message({
              type: 'error',
              message: 'Failed to withdraw gate in.'
            })
          }
        })

      }).catch(() => {
        // 取消操作，不做任何处理
      })
    },
    withdrawCargoInbound(row,type) {
       console.log('点击回退cargo inbound')
      this.$confirm('Are you sure you want to withdraw cargo inbound?', 'Withdraw Cargo Inbound', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        // 执行撤回操作
        console.log('revoke gate in', row)
        // 判断 如果status 不是2 则不操作
        if(row.status != 2){
          return
        }
        // 调用接口

        withdrawCargoInboundMilestone({ id: row.id }).then(response => {
          if (response.code === 0) {
            console.log('Withdraw cargo inbound response:', response)
            this.$message({
              type: 'success',
              message: 'Withdraw cargo inbound successfully!'
            })
            if(type =='milestone'){
              this.handlePageChange()

            }else{
              this.onCargoInboundSuccess()
            }
          } else {
            this.$message({
              type: 'error',
              message: 'Failed to withdraw cargo inbound.'
            })
          }
        })

      }).catch(() => {
        // 取消操作，不做任何处理
      })
    },
    handleTaskStatusChange(data){
      console.log('handleTaskStatusChange', data)
      if(data && data.length > 0){
        console.log('handleTaskStatusChange2', data)
        this.queryParams.taskStatusArray[0] = data[0] ? data[0].toLowerCase() : null
        this.queryParams.taskStatusArray[1] = data[1] ? data[1] : null
      }else{
        this.queryParams.taskStatusArray = []
      }
      this.queryParams.pageNo = 1
      this.getList()
    },

    showUpdateSeaAirBookingNumber() {
      console.log('this.shipment.seaAirBookingConfirmation', this.shipment.seaAirBookingConfirmation)
      this.updateSeaAirBookingNumberData = {
        bookingNumber: this.shipment.seaAirBookingNumber || '',
        shipmentId: this.shipment.id,
        confirmationDate: this.shipment.seaAirBookingConfirmation || null
      };
      this.showUpdateSeaAirBookingNumberDialog = true;
    },
    handleUpdateSeaAirBookingNumber(value) {
      console.log('handleUpdateSeaAirBookingNumber', value)
      this.$emit('refreshPage')
    },
    handleOrderReject(row) {
      this.orderRejectInfo = row
      this.orderRejectVisible = true
    },
    onOrderRejectClose() {
      this.orderRejectVisible = false
      this.orderRejectInfo = {}
    },
    onOrderRejectSuccess() {
      this.getList()
    }
  },
};
</script>

<style lang="scss" scoped>
.el-table__header-wrapper .el-checkbox {
  display: none !important;
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

.el-table-column--selection .el-checkbox {
  display: none !important;
}

p {
  margin: 0px;
}

.not-check-css {
  border-color: red;
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
.overview-tabs {
  display: flex;
  gap: 16px;
}

.tab-item {
  position: relative;
  min-width: 200px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606266;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: 0.25s;
}

.tab-item:hover {
  color: #2e75bb;
  transform: translateY(-2px);
}

.tab-item.active {
  color: #2e75bb;
  border-bottom: 3px solid #2e75bb;
}

.tab-item span {
  pointer-events: none;
}

.tab-item .tab-icon {
  position: absolute;
  left: 15px;
  fill: currentColor;
}

.tab-item .overview-right-success-icon{
  position: absolute;
  right: 20px;
  transform: scale(1.5);
  color: #13854e;
}

.tab-item .overview-right-warning-icon{
  position: absolute;
  right: 20px;
  transform: scale(1.5);
  color: #e6a23c;
}

.tabs-bottom-line {
  margin-top:8px; height:1px; width:100%;
  background:rgba(110, 106, 106, 0.3);
  border-radius:1px;
}

.action-icon{
  cursor: pointer;
  width: 14px;
  height: 14px;
  outline:none;
  // &.focusing{
  //   background-color: #E5E6E8;
  //   border-radius: 4px;
  //   padding: 4px;
  //   box-sizing: content-box;
  // }
}
</style>

