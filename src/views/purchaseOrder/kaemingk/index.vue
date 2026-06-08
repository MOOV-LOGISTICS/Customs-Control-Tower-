<template>
  <div class="app-container" style="width:100%; margin: 0 auto;padding-top: 20px;" >

    <div style="margin-bottom: 20px;">
      <el-card  style="background: transparent;box-shadow: none!important;">

        <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;">
          <span @click="handleImport"  v-if="!showFactory">
            <icon-park style="border-right: 1px solid #ddd;" type="inbox-upload-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square"/>
          </span>
          <span  @click="handleExport">
            <icon-park type="inbox-download-r" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
          </span>
        </el-card>

        <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;"  v-if="!showFactory">
          <icon-park style="border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#fe5000" strokeLinejoin="miter" strokeLinecap="square"/>
          <div :class="{'avticePort':queryParams.booked==false}" @click="bookedChange(false)" style="cursor: pointer;padding: 0px 15px;border-radius: 10px;float: right;line-height: 24px;margin-left: 10px;">
            <p style="font-size: 20px;">{{ orderInfo.notBooked }}</p>
            <p>Not Inbound</p>
          </div>
        </el-card>

        <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;"  v-if="!showFactory">
          <icon-park style="border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square"/>
          <div :class="{'avticePort':queryParams.booked==true}" @click="bookedChange(true)" style="cursor: pointer;padding: 0px 15px;border-radius: 10px;float: right;line-height: 24px;margin-left: 10px;">
            <p style="font-size: 20px;">{{ orderInfo.booked }}</p>
            <p>Inbound</p>
          </div>
        </el-card>

        <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;"  v-if="showFactory">
          <icon-park style="border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#fe5000" strokeLinejoin="miter" strokeLinecap="square"/>
          <div :class="{'avticePort':queryParams.booked==false}" style="cursor: pointer;padding: 0px 15px;border-radius: 10px;float: right;line-height: 24px;margin-left: 10px;">
            <p style="font-size: 20px;">{{ total }}</p>
            <p>Total PO</p>
          </div>
        </el-card>

        <el-card class="pd-20" style="float: left; width: auto;margin-right: 20px;"  v-if="showFactory">
          <icon-park style="border-right: 1px solid #ddd;" type="order" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square"/>
          <div :class="{'avticePort':queryParams.booked==true}"  style="cursor: pointer;padding: 0px 15px;border-radius: 10px;float: right;line-height: 24px;margin-left: 10px;">
            <p style="font-size: 20px;">{{ orderInfo.inboundPoQty }}</p>
            <p>Inbound PO</p>
          </div>
        </el-card>

        <el-card class="pd-20" id="portsDiv"  v-if="!showFactory" style="white-space: nowrap;overflow-x: auto;height:59.5px;float: left; width: auto;margin-right: 0px;
        width:calc(100% - 800px)">

          <svg style="float:left;border-right: 1px solid #ddd;width: 65px;height: 65px;margin-top: -5px;padding-right: 10px;padding-bottom: 10px;" t="1717126148869" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9997" width="200" height="200"><path d="M433.048 157.845c22.74-23.043 53.113-33.978 83.097-32.752 27.355 0.612 54.457 11.772 74.685 33.277l6.274 6.672 329.473 342.037c18.106 18.797 5.1 50-20.74 50.622l-0.788 0.01-65.135-0.001v296.917c0 60.348-48.43 109.384-108.542 110.358l-1.825 0.015H298.028c-60.954 0-110.368-49.416-110.368-110.373V557.71h-77.709c-26.27 0-39.645-31.365-21.825-50.318l0.55-0.571z m17.17 480.2H332.954c-22.858 0-41.388 18.531-41.388 41.39v117.271c0 22.86 18.53 41.39 41.388 41.39H450.22c22.858 0 41.388-18.53 41.388-41.39v-117.27c0-22.86-18.53-41.39-41.388-41.39z m243.73 0H576.682c-22.858 0-41.388 18.531-41.388 41.39v117.271c0 22.86 18.53 41.39 41.388 41.39h117.266c22.858 0 41.388-18.53 41.388-41.39v-117.27c0-22.86-18.53-41.39-41.388-41.39z m-243.73-246.039H332.954c-22.858 0-41.388 18.531-41.388 41.39v117.271c0 22.86 18.53 41.39 41.388 41.39H450.22c22.858 0 41.388-18.53 41.388-41.39v-117.27c0-22.86-18.53-41.39-41.388-41.39z" fill="#004F7C" p-id="9998"></path></svg>
          <div :class="{'avticePort':checkedPort[item.warehouseName]}"
               @click="clickWareHouse(item.warehouseName)" v-for="item in orderInfo.wareHouses"
               style="position: relative;
    top: -3px;display:inline-block;line-height: 24px;padding: 0px 15px;border-right: 1px solid #ddd;    cursor: pointer;
          border-radius: 10px;
    margin-left: 10px;">
            <p style="font-size: 20px;">{{ item.count }}</p>
            <p>{{ item.warehouseName?item.warehouseName:'Unkown' }}</p>
          </div>
        </el-card>

      </el-card>
    </div>
    <el-card class="pd-20">

      <div style="float: right;line-height: 48px;">
        <div style="float: right;position: relative;z-index: 999;">
          <el-button v-if="!hiddenTask && !showFactory" type="primary"  @click="openOverview">
            {{!drawer2?'Overview':'Order List'}}
          </el-button>
        </div>
      </div>

      <transition name="el-zoom-in-center">
        <div v-show="!drawer2" class="transition-box">
          <el-form :model="queryParams">
            <div v-if="!drawer2" style="float: left;padding-top: 8px;"></div>
            <div v-if="!drawer2" style='float:left;padding: 10px 0px;'>
              <el-input  placeholder="Order Number" v-model="queryParams.orderNumber" @keyup.enter.native = " queryParams.pageNo = 1 ,getList()">
                <el-button slot="append" @click=" queryParams.pageNo = 1 ,getList()" type="primary">Search<i class="el-icon-search el-icon--right" ></i></el-button>
              </el-input>
            </div>

            <div v-if="!drawer2 && !showFactory" style='float:left;margin-left: 5px;padding: 10px 0px;'>
              <el-select @change="queryParams.pageNo = 1 ,getList()" v-model="queryParams.categoryCode" placeholder="Category Code" clearable filterable>
                <el-option v-for="item in categoryCodeList" :key="item" :value="item" :label="item"  />
              </el-select>
            </div>

            <div v-if="!drawer2 && !showFactory"   style='float:left;margin-left: 5px;padding: 10px 0px;'>
              <el-select clearable @change="queryParams.pageNo = 1 ,getList()" v-model="queryParams.status" placeholder="Status">
                <el-option v-for="taskName in taskNames" :label="taskName" :value="taskName"></el-option>
              </el-select>
            </div>

            <div  style="clear: both;"></div>
          </el-form>
          <div   style="overflow: auto;width:calc(100%);float: left;" >
            <el-table :row-class-name="tableRowClassName" border @sort-change="handleSortChange"
                      @expand-change="handleExpandChange"
                      v-loading="loading" :height="tableHeight-70"
                      :data="tableData"
                      @selection-change="handleSelectionChange"
                      ref="multipleTable"
                      style="width: 100%">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column type="expand">
                <template slot-scope="props">
                  <div style="padding:15px 58px 15px 58px;">
                    <el-tabs type="border-card" :ref="'tab'+props.row.id" v-model="props.row.key" @tab-click="handleClick($event,order)">
                      <el-tab-pane label="Order Items" :name="'first'+props.row.id">
                        <el-table
                          border
                          show-summary
                          :summary-method="getSummaries"
                          max-height="400"
                          style="width:100%"
                          :data="props.row.items">
                          <el-table-column
                            prop="date"
                            label="Product Code"
                            width="90">
                            <template v-slot="scope">
                              {{ productMap[scope.row.productId]?productMap[scope.row.productId].code:'' }}
                            </template>
                          </el-table-column>
                          <el-table-column
                            prop="name"
                            label="Product Name"
                            min-width="100">
                            <template v-slot="scope">
                              {{ productMap[scope.row.productId]?productMap[scope.row.productId].name:'' }}
                            </template>
                          </el-table-column>
                          <el-table-column
                            width="80"
                            v-if="!showFactory"
                            prop="innerWeight"
                            label="Inner Wgt.">
                            <template v-slot="scope">
                              {{ scope.row.innerWeight }}
                            </template>
                          </el-table-column>
                          <el-table-column
                            width="80"
                            v-if="!showFactory"
                            prop="outerWeight"
                            label="Outer Wgt.">
                            <template v-slot="scope">
                              {{ scope.row.outerWeight }}
                            </template>
                          </el-table-column>
                          <el-table-column
                            width="80"
                            prop="length"
                            label="L(CM)">
                            <template v-slot="scope">
                              {{ scope.row.length1 }}
                            </template>
                          </el-table-column>
                          <el-table-column
                            width="80"
                            prop="width"
                            label="W(CM)">
                            <template v-slot="scope">
                              {{ scope.row.width1 }}
                            </template>
                          </el-table-column>
                          <el-table-column
                            width="80"
                            prop="height"
                            label="H(CM)">
                            <template v-slot="scope">
                              {{ scope.row.height1 }}
                            </template>
                          </el-table-column>

                          <el-table-column
                            width="90"
                            prop="totalVolume"
                            label="Volume(CBM)">
                            <template v-slot="scope">
                              {{calculateVolume(scope.row)}}
                            </template>
                          </el-table-column>
                          <el-table-column
                            width="80"
                            v-if="!showFactory"
                            prop="totalWeight"
                            label="Outer Wgt.">
                            <template v-slot="scope">
                              {{calculateWeight(scope.row)}}
                            </template>
                          </el-table-column>


                          <el-table-column  prop="PIECESOrdered" width="110" label="Ord. Qty">
                            <template slot-scope="scope">
                              {{Math.ceil(scope.row[scope.row.requestUnit+'Ordered'])+' '+ scope.row.requestUnit }}
                            </template>
                          </el-table-column>
                          <el-table-column  prop="CTNSOrdered"
                            v-if="!showFactory" width="110" label="Ord. Qty">
                            <template slot-scope="scope">
                              {{Math.ceil(scope.row['CTNS'+'Ordered']) +' '+ 'CTNS'}}
                            </template>
                          </el-table-column>
                          <el-table-column v-if="unitLabelsShow[props.row.id]" prop="INNER BOXOrdered" width="110" label="Ord. Qty">
                            <template slot-scope="scope">
                              {{Math.ceil(scope.row['INNER BOX'+'Ordered']) +' '+ 'INNER BOX'}}
                            </template>
                          </el-table-column>

                          <el-table-column  prop="PIECESBooked" width="110" label="Booked Qty">
                            <template slot-scope="scope">
                              {{Math.ceil(scope.row[scope.row.bookedUnit+'Booked']) +' '+ scope.row.bookedUnit}}
                            </template>
                          </el-table-column>
                          <el-table-column  prop="CTNSBooked"
                            v-if="!showFactory" width="110" label="Booked Qty">
                            <template slot-scope="scope">
                              {{Math.ceil(scope.row['CTNS'+'Booked']) +' '+ 'CTNS'}}
                            </template>
                          </el-table-column>
                          <el-table-column v-if="unitLabelsShow[props.row.id]" prop="INNER BOXBooked" width="110" label="Booked Qty">
                            <template slot-scope="scope">
                              {{Math.ceil(scope.row['INNER BOX'+'Booked']) +' '+ 'INNER BOX'}}
                            </template>
                          </el-table-column>

                          <el-table-column  prop="PIECESInbound" width="110" label="Inbound Qty">
                            <template slot-scope="scope">

                            <!-- 同样比较两值，不等则显示红色 -->
                            <span :style="{
                                color: (
                                    Math.ceil(scope.row[scope.row.requestUnit+'Ordered']) != scope.row.inbound &&  // 两值不一致
                                    scope.row.inbound > 0 ) ? 'red' : ''   // 实际值大于0
                                }">
                              {{Math.ceil(scope.row.inbound) +' '+ scope.row.inboundUnit}}
                            </span>
                            </template>
                          </el-table-column>
                          <el-table-column  prop="CTNSInbound"
                            v-if="!showFactory"  width="110" label="Inbound Qty">
                            <template slot-scope="scope">
                              {{Math.ceil(scope.row['CTNS'+'Booked']) +' '+ 'CTNS'}}
                            </template>
                          </el-table-column>
                          <el-table-column v-if="unitLabelsShow[props.row.id]" prop="INNER BOXInbound" width="110" label="Inbound Qty">
                            <template slot-scope="scope">
                              {{Math.ceil(scope.row['INNER BOX'+'Booked']) +' '+ 'INNER BOX'}}
                            </template>
                          </el-table-column>

                          <el-table-column
                            v-if="showFactory"
                            label="Best Before Date"
                            width="160"
                            prop="bestBeforeDate">
                            <template v-slot="scope">
                              {{ parseTime(scope.row.bestBeforeDate) }}
                            </template>
                          </el-table-column>
                          <el-table-column
                            width="80"
                            v-if="showFactory"
                            prop="batchNo"
                            label="Batch No">
                          </el-table-column>
                          <el-table-column
                            width="80"
                            v-if="showFactory"
                            prop="backupStr4"
                            label="DG">
                            <template v-slot="scope">
                              <el-switch
                                v-model="scope.row.backupStr4" disabled active-value="true" active-color="#ff4949" >
                              </el-switch>
                            </template>
                          </el-table-column>

                          <el-table-column
                            width="90"
                            v-if="showFactory"
                            prop="backupStr5"
                            label="IMO Class No">
                          </el-table-column>
                          <el-table-column
                            width="100"
                            v-if="showFactory"
                            prop="backupStr6"
                            label="Packaging Group">
                          </el-table-column>
                          <el-table-column
                            width="80"
                            v-if="showFactory"
                            prop="backupStr7"
                            label="UN No">
                          </el-table-column>

                        </el-table>
                        <br/>
                      </el-tab-pane>
                      <el-tab-pane label="Location" v-if="!showFactory" :name="'first3'+props.row.id">
                        <el-descriptions direction="vertical" class="margin-top" title="" style="box-shadow: none;width:800px" :column="5" size="mini" border>
                          <el-descriptions-item label="Country Of Origin">{{ props.row.originCountry }}</el-descriptions-item>
                          <el-descriptions-item label="Incoterm">{{ props.row.incoterms }}</el-descriptions-item>
                          <el-descriptions-item label="Place Of Container Stuffing">{{ props.row.stuffing }}</el-descriptions-item>
                          <el-descriptions-item label="Place Of Quality Inspection">{{ props.row.inspection }}</el-descriptions-item>
                          <el-descriptions-item label="Inbound Warehouse">{{ props.row.warehouseName }}</el-descriptions-item>
                        </el-descriptions>
                        <br/>
                      </el-tab-pane>
                      <el-tab-pane label="Parties" v-if="!showFactory" :name="'first2'+props.row.id">
                        <el-table
                          :data="[{}]"
                          border
                          style="width:600px">
                          <el-table-column
                            prop="oha"
                            label="OHA"
                          >
                            <template v-slot="scope">
                              {{partyMap[props.row.oha] }}
                            </template>
                          </el-table-column>
                          <el-table-column
                            prop="seller"
                            label="Supplier">
                            <template v-slot="scope">
                              {{partyMap[props.row.seller] }}
                            </template>
                          </el-table-column>
                          <el-table-column
                            prop="buyer"
                            label="Merchandise">
                            <template v-slot="scope">
                              {{partyMap[props.row.buyer] }}
                            </template>
                          </el-table-column>
                        </el-table>
                        <br/>
                      </el-tab-pane>
                      <el-tab-pane v-if="!hiddenTask && !showFactory" label="Milestones" :name="'third'+props.row.id" >
                        <div style="padding-bottom: 20px;padding:10px 0px 20px 0px;overflow-x: hidden;">
                          <div v-for=" task in props.row.orderTaskDOS" :Key="'task'+task.id" class="self-step1"

                               style="margin-right: 30px;position: relative;float: left;margin-right: 30px;height: 100px;">
                            <p>
                                  <span class="self-step"  :class="[task.status==1 ? 'self-step-process' : ''
                      , task.status==2 ? 'self-step-finished' : ''
                      , task.status==0 ? 'self-step-pedding' : '']">{{ task.seq-100 }}</span>
                              <p style="display: inline-block;
                                    width: 150px;
                                    padding-top: 8px;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;">
                                <span class="title">{{ task.taskName }} </span>
                              </p>
                              <p>
                                {{ task.status==2?parseTime(task.updateTime):'' }}
                              </p>
                            </p>
                          </div>
                          <div style="clear:both"></div>
                        </div>
                      </el-tab-pane>
                      <el-tab-pane label="Documents" v-if="!showFactory" :name="'fourth'+props.row.id">
                        <div v-for="file in props.row.inboundFiles">
                          <el-badge  class="item" style="margin-right:50px;float:left;">
                            <div style="width:150px;text-align:center;" >
                              <svg style="display: inline-block;" width="45" height="45" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 23V14L31 4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44H22" stroke="#004f7c" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M28.2 30H37.8L41 34.1176L33 44L25 34.1176L28.2 30Z" fill="none" stroke="#004f7c" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 4V14H40" stroke="#004f7c" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                              <p><el-link :href="file.url" target="_blank">{{ file.name }}</el-link>
                              </p>
                            </div>
                          </el-badge>
                          <div style="clear: both;"></div>
                        </div>
                        <el-empty description="No Files" v-if="props.row.inboundFiles==null||props.row.inboundFiles.length==0">
                        </el-empty>
                        <br/>
                      </el-tab-pane>
                      <el-tab-pane label="Change Log" v-if="!showFactory" :name="'second4'+props.row.id">
                        <el-empty v-if="props.row.logStatusResList.length==0"></el-empty>
                        <el-timeline >
                          <el-timeline-item v-for="(o, index) in props.row.logStatusResList" :key="index" :timestamp=parseTimeToZ1(o.createTime)>
                            {{ o.logInfo }}
                          </el-timeline-item>
                        </el-timeline>
                        <br/>
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                sortable="custom"
                label="Order Number"
                min-width="130"
                max-width="270"
                prop="orderNumber">
                <template v-slot="scope">
                  <span style="color:#000;font-weight: 900;">{{ scope.row.orderNumber }}</span>
                </template>
              </el-table-column>
              <el-table-column
                sortable="custom"
                v-if="!hiddenTask"
                label="Status"
                width="170"
                prop="status">
                <template v-slot="scope">
              <span @click="showTask(scope.row.orderTaskDOS,scope.$index)" style="text-decoration: underline;cursor: pointer;">
              {{ scope.row.status }}
              </span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="!hiddenTask && !showFactory"
                label="Process"
                width="150"
                prop="bookedLines">
                <template v-slot="scope">
                  <el-progress :stroke-width="13" :percentage="
                parseInt(scope.row.orderTaskDOS.filter(item=>item.status==2).length/scope.row.orderTaskDOS.length*100)
                ">
                  </el-progress>
                  <span style="position: absolute;
                  top: 3px;
                  left: 35px;
                  color: white;">
              {{ scope.row.orderTaskDOS.filter(item=>item.status==2).length}}/{{
                      scope.row.orderTaskDOS.length}}
              </span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="!hiddenTask && showFactory"
                label="Completion Rate"
                width="150"
                prop="id">
                <template v-slot="scope">
                  <div style="position: relative;">
                    <el-progress :stroke-width="12" :percentage="calculatePercentage(scope.row)" :show-text="false">
                    </el-progress>
                    <span :style="{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: calculatePercentage(scope.row) === 100 ? '#67c23a' : (calculatePercentage(scope.row) > 100 ? '#f56c6c' : '#e6a23c'),
                    fontSize: '12px',
                    fontWeight: 'bold',
                    zIndex: 10
                    }">
                      {{ calculatePercentage(scope.row) }}%
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                sortable="custom"
                v-if="!showFactory"
                label="Category Code"
                width="120"
                prop="categoryCode">
              </el-table-column>
              <el-table-column
                v-if="!showFactory"
                label="Load Term"
                width="120"
                prop="loadTerm">
              </el-table-column>
              <el-table-column
                v-if="showFactory"
                sortable="custom"
                label="Estimated Inbound Date"
                width="160"
                prop="cargoReadyDate">
                <template v-slot="scope">
                  {{ parseTime(scope.row.cargoReadyDate) }}
                </template>
              </el-table-column>

              <el-table-column
                label="Inbound Warehouse"
                width="115"
                prop="warehouseName">
                <template v-slot="scope">
                  {{ scope.row.warehouseName }}
                </template>
              </el-table-column>
              <el-table-column
                sortable="custom"
                label="Inbound Date"
                width="115"
                prop="inboundTime">
                <template v-slot="scope">
                  {{ parseTime(scope.row.inboundTime) }}
                </template>
              </el-table-column>

              <el-table-column
                sortable="custom"
                v-if="!showFactory"
                label="Inbound Window Start"
                width="160"
                prop="inboundStartTime">
                <template v-slot="scope">
                  {{ parseTime(scope.row.inboundStartTime) }}
                </template>
              </el-table-column>
              <el-table-column
                sortable="custom"
                v-if="!showFactory"
                label="Inbound Window Stop"
                width="160"
                prop="inboundStopTime">
                <template v-slot="scope">
                  {{ parseTime(scope.row.inboundStopTime) }}
                </template>
              </el-table-column>

              <el-table-column
                label="Incoterms"
                v-if="!showFactory"
                width="120"
                prop="incoterms">
                <template v-slot="scope">
                  {{ scope.row.incoterms }}
                </template>
              </el-table-column>
              <el-table-column
               v-if="showFactory"
                label="Factory Email"
                width="170" show-overflow-tooltip
                prop="backupStr2">
                <template v-slot="scope">
                  {{ scope.row.backupStr2 }}
                </template>
              </el-table-column>
              <el-table-column
               v-if="showFactory"
                label="Factory Address" show-overflow-tooltip
                min-width="150"
                prop="backupStr3">
                <template v-slot="scope">
                  {{ scope.row.backupStr3 }}
                </template>
              </el-table-column>
              <el-table-column
               v-if="showFactory"
                label="Factory Contact Phone"
                min-width="150" show-overflow-tooltip
                prop="backupStr4">
                <template v-slot="scope">
                  {{ scope.row.backupStr4 }}
                </template>
              </el-table-column>
              <el-table-column
                v-if="showFactory"
                label="Total Volume(CBM)"
                width="140"
                prop="id">
                <template v-slot="scope">
                  {{ calculateTotalVolume(scope.row) }}
                </template>
              </el-table-column>
              <el-table-column
                v-if="showFactory"
                label="Expected Quantity"
                width="140"
                prop="id">
                <template v-slot="scope">
                  {{ sumExpectedQuantity(scope.row) }}
                </template>
              </el-table-column>
              <el-table-column
                v-if="showFactory"
                label="Actual quantity"
                width="120"
                prop="id">
                <template v-slot="scope">
                  <!-- 同样比较两值，不等则显示红色 -->
                  <span :style="{
                    color: (
                          sumExpectedQuantity(scope.row) !== sumActualQuantity(scope.row) &&  // 两值不一致
                          sumActualQuantity(scope.row) > 0 ) ? 'red' : ''   // 实际值大于0
                    }">
                    {{ sumActualQuantity(scope.row) }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
               v-if="showFactory"
                label="Create Date"
                min-width="120" show-overflow-tooltip
                prop="createTime">
                <template v-slot="scope">
                  {{ parseTime(scope.row.createTime) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="clear:both"></div>

          <pagination
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            :page.sync="queryParams.pageNo"
            :limit.sync="queryParams.pageSize"
            :page-sizes="[20, 30, 50]"
            @pagination="getList"
          />
        </div>
      </transition>

      <transition name="el-zoom-in-center">
        <el-form :model="queryParams">
          <div v-if="drawer2" style="float: left;padding-top: 8px;"></div>
          <div v-if="drawer2" style='float:left;padding: 10px 0px;'>
            <el-input  placeholder="Order Number" v-model="queryParams.orderNumber" @keyup.enter.native = " queryParams.pageNo = 1 ,getList()">
              <el-button slot="append" @click=" queryParams.pageNo = 1 ,getList()" type="primary">Search<i class="el-icon-search el-icon--right" ></i></el-button>
            </el-input>
          </div>

          <div v-if="drawer2" style='float:left;margin-left: 5px;padding: 10px 0px;'>
            <el-select @change="queryParams.pageNo = 1 ,getList()" v-model="queryParams.categoryCode" placeholder="Category Code" clearable filterable>
              <el-option v-for="item in categoryCodeList" :key="item" :value="item" :label="item"  />
            </el-select>
          </div>

          <div v-if="drawer2"   style='float:left;margin-left: 5px;padding: 10px 0px;'>
            <el-select clearable @change="queryParams.pageNo = 1 ,getList()" v-model="queryParams.status" placeholder="Status">
              <el-option v-for="taskName in taskNames" :label="taskName" :value="taskName"></el-option>
            </el-select>
          </div>

          <div  style="clear: both;"></div>
          <div v-show="drawer2" class="transition-box" style="padding-top: 50px;":style="{'height':(tableHeight)+'px'}">
            <el-row :gutter="20" style="padding-top:10px">
              <el-col :span="12" >
                <el-card style="margin-bottom:20px;box-shadow:none !important;" class="box-card" v-if="task1.length>0">
                  <div slot="header" class="clearfix">
                    <span>Purchase Order</span>
                  </div>
                  <div style="padding: 20px;">
                    <el-table border
                              :data="task1"
                              style="width: 100%">
                      <el-table-column
                        prop="taskName"
                        label="Task Name"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="possible"
                        align="center"
                        label="Possible">
                        <template slot="header" slot-scope="scope">
            <span class="title" style="color: #2d86ba;
    background-color:#ceecfd;">Possible</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #2d86ba;" class="numberOftask" @click="taskDetails(scope.row,'possible')">{{ scope.row.possible }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="urgent"
                        align="center"
                        label="Urgent">
                        <template slot="header" slot-scope="scope">
            <span class="title" style="color: #e6a23c;
    background: #fdf6ec;">Urgent</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #e6a23c;" class="numberOftask" @click="taskDetails(scope.row,'urgent')">{{ scope.row.urgent }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="overdue"
                        align="center"
                        label="Overdue">
                        <template slot="header" slot-scope="scope">
            <span class="title" style="color: #f56c6c;
    background: #fef0f0;">Overdue</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #f56c6c;" class="numberOftask" @click="taskDetails(scope.row,'overdue')">{{ scope.row.overdue }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="finished"
                        align="center"
                        label="Finished">
                        <template slot="header" slot-scope="scope">
            <span class="title" style="color: #13854e;
      background-color:#d6ede2;">Finished</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #13854e;" class="numberOftask" @click="taskDetails(scope.row,'finished')">{{ scope.row.finished }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-card>
                <el-card class="box-card" style="box-shadow:none !important;" v-if="task2.length>0">
                  <div slot="header" class="clearfix">
                    <span>Inbound Order</span>
                  </div>
                  <div style="padding: 20px;">
                    <el-table border
                              :data="task2"
                              style="width: 100%">
                      <el-table-column
                        prop="taskName"
                        label="Task Name"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="possible"
                        align="center"
                        label="Possible">
                        <template slot="header" slot-scope="scope">
            <span class="title" style="color: #2d86ba;
    background-color:#ceecfd;">Possible</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #2d86ba;" class="numberOftask" @click="taskDetails(scope.row,'possible')">{{ scope.row.possible }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="urgent"
                        align="center"
                        label="Urgent">
                        <template slot="header" slot-scope="scope">
            <span class="title" style="color: #e6a23c;
    background: #fdf6ec;">Urgent</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #e6a23c;" class="numberOftask" @click="taskDetails(scope.row,'urgent')">{{ scope.row.urgent }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="overdue"
                        align="center"
                        label="Overdue">
                        <template slot="header" slot-scope="scope">
            <span class="title" style="color: #f56c6c;
    background: #fef0f0;">Overdue</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #f56c6c;" class="numberOftask" @click="taskDetails(scope.row,'overdue')">{{ scope.row.overdue }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="finished"
                        align="center"
                        label="Finished">
                        <template slot="header" slot-scope="scope">
            <span class="title" style="color: #13854e;
      background-color:#d6ede2;">Finished</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #13854e;" class="numberOftask" @click="taskDetails(scope.row,'finished')">{{ scope.row.finished }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="12" v-if="task3.length>0">
                <el-card style="box-shadow:none !important;" class="box-card" >
                  <div slot="header" class="clearfix">
                    <span>Inbound Received</span>
                  </div>
                  <div style="padding: 20px;">
                    <el-table border
                              :data="task3"
                              style="width: 100%">
                      <el-table-column
                        prop="taskName"
                        label="Task Name"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="possible"
                        align="center"
                        label="Possible">
                        <template slot="header" slot-scope="scope">
            <span class="title" style="color: #2d86ba;
    background-color:#ceecfd;">Possible</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #2d86ba;" class="numberOftask" @click="taskDetails(scope.row,'possible')">{{ scope.row.possible }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="urgent"
                        align="center"
                        label="Urgent">
                        <template slot="header" slot-scope="scope">
            <span class="title" style="color: #e6a23c;
    background: #fdf6ec;">Urgent</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #e6a23c;" class="numberOftask" @click="taskDetails(scope.row,'urgent')">{{ scope.row.urgent }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="overdue"
                        align="center"
                        label="Overdue">
                        <template slot="header" slot-scope="scope">
            <span class="title" style="color: #f56c6c;
    background: #fef0f0;">Overdue</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #f56c6c;" class="numberOftask" @click="taskDetails(scope.row,'overdue')">{{ scope.row.overdue }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="finished"
                        align="center"
                        label="Finished">
                        <template slot="header" slot-scope="scope">
            <span class="title" style="color: #13854e;
      background-color:#d6ede2;">Finished</span>
                        </template>
                        <template slot-scope="scope">
                          <span style="color: #13854e;" class="numberOftask" @click="taskDetails(scope.row,'finished')">{{ scope.row.finished }}</span>
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
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        v-loading="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-error="handleFileError"
        :auto-upload="false"
        drag
      >
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
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
          >{{ $t("purchaseOrder.downloadingTheTemplate") }}</el-link
          >
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


    <el-dialog
      :title="uploadError.title"
      :visible.sync="uploadError.dialogVisible"
      width="50%" >
      <el-table :data="uploadError.data"
                style="width: 100%"
                max-height="500px">
        <el-table-column property="data" label="Data Error" >
          <template slot-scope="scope">
            <span >{{scope.row}}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="uploadError.dialogVisible = false">OK</el-button>
  </span>
    </el-dialog>


    <el-drawer
      :modal="false"
      :title="title"
      :visible.sync="drawer"
      direction="rtl">

      <div class="cardx" v-for="h in taskList">

        <div class="status1Div">
      <span v-if="showTaskStatus(h)!=''"
            class="status2" :class="[showTaskStatus(h)=='Possible' ? 'color2' : ''
      , showTaskStatus(h)=='Finished' ? 'color1' : ''
      , showTaskStatus(h)=='Urgent' ? 'color3' : ''
      , showTaskStatus(h)=='Overdue' ? 'color4' : '']">
        {{showTaskStatus(h)}}
      </span>
        </div>
        <div class="order" style="margin-bottom: 5px;">Order:{{ h.orderNumber }}</div>
        <div class="taskName" style="margin-bottom: 5px;">Task Name：{{ h.taskName }}</div>

        <div v-if="h.status==1&&h.taskName=='Inbound Order'&&h.jsonData!=null&&h.jsonData!=''&&JSON.parse(h.jsonData)!=null&&JSON.parse(h.jsonData).approveResult=='Failed'" >
          <div style="clear: both;"></div>
          <div class="date" style="margin-bottom: 5px;">Reject Reason：{{ JSON.parse(h.jsonData).reason }}</div>
        </div>

        <div style="clear: both;"></div>
        <div class="date" style="margin-bottom: 5px;" v-if="h.status==2">Complete Date：{{ parseTime(h.updateTime,'{y}-{m}-{d} {h}:{i}:{s}') }}</div>
        <div class="date" style="margin-bottom: 5px;" v-if="h.status==1">Urgent Date：{{ parseTime(h.urgentDate) }}</div>
        <div class="date" style="margin-bottom: 5px;" v-if="h.status==1">Due Date：{{ parseTime(h.dueDate) }}</div>
        <div style="margin-bottom: 5px; float: right;cursor: pointer;">

          <el-popover
            placement="top-start"
            title=""
            width="200"
            trigger="hover"
            content="Send reminder">
            <i @click="sendEmail(h)" slot="reference" v-if="(showTaskStatus(h)=='Overdue'||showTaskStatus(h)=='Urgent')&&user.deptId!=h.partyId" class="el-icon-message"></i>
          </el-popover>

          <i v-show="h.status==1&&user.deptId==h.partyId&& !(showFactory&&h.taskName=='ASN Received')" @click="handleTask(h)" style="cursor: pointer;" class="el-icon-edit"></i>
          <i v-if="h.taskName=='QC Approve'&&h.status==2" @click="viewQcResult(h)" class="el-icon-view"></i>
          <i v-if="h.taskName!='QC Approve'&&h.jsonData!=null&&h.status==2" @click="viewTask(h)" class="el-icon-view"></i>



        </div>
        <div style="clear: both;"></div>
      </div>

    </el-drawer>


    <el-dialog :title="title" width="600px" :visible.sync="crdFormVisible">
      <el-form :disabled="view" :model="form" size="mini">
        <el-form-item label="Cargo handover date" label-width="180px">
          <el-date-picker format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          v-model="form.crd"
                          type="date"
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
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="form.inspectionDate"
            type="date"
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
          <a :href="downloadLink" style="text-decoration: underline; padding-left: 15px;">file</a>
        </el-form-item>

        <el-form-item v-if='!view' label="Approve File" label-width="180px">

          <el-upload
            action=""
            :auto-upload="false"
            :on-change="beforeUpload"
          >
            <el-button size="small" type="primary">File</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="!view" class="dialog-footer">
        <el-button @click="qcFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitTask">Submit</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="title" width="800px" :visible.sync="bookingFormVisible">
      <el-table
        :data="itemList"
        style="width: 100%">
        <el-table-column
          prop="productName"
          label="Product Name"
        >
        </el-table-column>
        <el-table-column
          prop="productCode"
          label="Product Code"
        >
        </el-table-column>
        <el-table-column
          prop="totalVolume"
          label="Total Volume(CBM)"
        >
          <template v-slot="scope">
            <el-input v-model="scope.row.totalVolume" />
          </template>
        </el-table-column>
        <el-table-column
          prop="totalWeight"
          label="Total Weight(KG)"
          width="120">
          <template v-slot="scope">
            <el-input v-model="scope.row.totalWeight" />

            {{ scope.row.index }}
          </template>
        </el-table-column>

        <el-table-column
          prop="requested"
          :label="itemList.length > 0  && itemList[0].requestUnit ?'Requested (' + itemList[0].requestUnit +')' : 'Requested'"
          width="120">
        </el-table-column>
        <el-table-column
          prop="bookedQty"
          :label="itemList.length > 0 && itemList[0].requestUnit  ? 'Booked Qty (' + itemList[0].requestUnit +')' : 'Booked Qty'"
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


    <el-dialog :title="title" width="600px" :visible.sync="pickupFormVisible">
      <el-form :disabled="view" :model="form" size="mini">
        <el-form-item label="Empty Pick up" label-width="180px">
          <el-date-picker
            v-model="form.emptyPickupDate"
            type="date"
            placeholder="Empty Pick up">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="!view" class="dialog-footer">
        <el-button @click="pickupFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitTask">Submit</el-button>
      </div>
    </el-dialog>

    <!-- Inbound Received Confirmation Dialog -->
    <el-dialog
      title="Inbound Received Confirmation"
      :visible.sync="showInboundReceivedConfirmation"
      width="80%"
      :close-on-click-modal="false"
      center>
      <div v-if="loadingInboundComparison" class="loading-container">
        <el-spinner size="large" type="chasing-dots"></el-spinner>
        <span>Loading comparison data...</span>
      </div>
      <div v-else>
        <!-- Summary Statistics -->
        <div class="summary-container">
          <el-card class="summary-card">
            <div class="summary-item">
              <span class="summary-label">Total Items:</span>
              <span class="summary-value">{{ totalItems }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Matched Items:</span>
              <span class="summary-value match">{{ matchItems }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Mismatched Items:</span>
              <span class="summary-value mismatch">{{ mismatchItems }}</span>
            </div>
          </el-card>
        </div>

        <!-- Comparison Table -->
        <div class="table-container">
          <el-table
            :data="inboundComparisonData"
            style="width: 100%"
            border
            :header-cell-style="{backgroundColor: '#f5f7fa', fontWeight: 'bold'}">

            <!-- Fixed Product Code Column -->
            <el-table-column
              prop="productCode"
              label="Product Code"
              width="150"
              fixed="left"
              show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.productCode || '-' }}
              </template>
            </el-table-column>

            <el-table-column
              prop="productName"
              label="Product Name"
              min-width="200"
              show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.productName || '-' }}
              </template>
            </el-table-column>

            <el-table-column
              prop="poQty"
              label="PO Qty"
              width="120">
              <template slot-scope="scope">
                <span :class="{ 'mismatch-text': scope.row.matchStatus === 'MISMATCH' }">
                  {{ scope.row.poQty || 0 }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              prop="asnQty"
              label="ASN Qty"
              width="120">
              <template slot-scope="scope">
                <span :class="{ 'mismatch-text': scope.row.matchStatus === 'MISMATCH' }">
                  {{ scope.row.asnQty || 0 }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              prop="inboundQty"
              label="Inbound Qty"
              width="120">
              <template slot-scope="scope">
                <span :class="{ 'mismatch-text': scope.row.matchStatus === 'MISMATCH' }">
                  {{ scope.row.inboundQty || 0 }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              prop="matchStatus"
              label="Match Status"
              width="120">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.matchStatus === 'MATCH' ? 'success' : 'danger'"
                  size="small">
                  {{ scope.row.matchStatus === 'MATCH' ? 'Matched' : 'Mismatched' }}
                </el-tag>
              </template>
            </el-table-column>

            <!-- <el-table-column
              prop="differenceReason"
              label="Difference Reason"
              min-width="300"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="difference-reason" :class="{ 'mismatch-text': scope.row.matchStatus === 'MISMATCH' }">
                  {{ scope.row.differenceReason || '-' }}
                </span>
              </template>
            </el-table-column> -->
          </el-table>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showInboundReceivedConfirmation = false">Cancel</el-button>
        <el-button v-if="currentTaskStatus != 2" type="primary" @click="confirmInboundReceived" :loading="confirmLoading">Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" width="600px" :visible.sync="containerStuffingFormVisible">
      <el-form :disabled="view" :model="form" size="mini">
        <el-form-item label="Container stuffing date" label-width="180px">
          <el-date-picker
            v-model="form.containerStuffingDate"
            type="date"
            placeholder="Container stuffing date">
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
          <el-date-picker
            v-model="form.customClearanceDate"
            type="date"
            placeholder="Origin Customs Clearance date">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="!view" class="dialog-footer">
        <el-button @click="customClearanceFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitTask">Submit</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="title" width="700px" :visible.sync="taskDetailDataVisible">
      <el-table
        :data="taskDetailData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="Task Name">
          <template v-slot="scope">
            {{ scope.row.taskName }}
          </template>
        </el-table-column>
        <el-table-column
          prop="orderNumber"
          label="Order Number">
          <template v-slot="scope">
          <span style="text-decoration: underline;
          cursor: pointer;
    color: #004F7C;
    font-weight: bold;" @click="toOrder2(scope.row.orderNumber)">{{ scope.row.orderNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="urgentDate"
          label="Urgent Date">
          <template v-slot="scope">
            {{ parseTime(scope.row.urgentDate) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="dueDate"
          label="Due date">
          <template v-slot="scope">
            {{ parseTime(scope.row.dueDate) }}
          </template>
        </el-table-column>
        <el-table-column v-if="title.endsWith('finished')"
                         prop="updateTime"
                         label="Complete date">
          <template v-slot="scope">
            {{ parseTime(scope.row.updateTime) }}
          </template>
        </el-table-column>

        <el-table-column label="Actions">
          <template v-slot="scope">
            <el-popover
              placement="top-start"
              title=""
              width="200"
              trigger="hover"
              content="Send reminder">
              <i @click="sendEmail(scope.row)" slot="reference" v-if="(showTaskStatus(scope.row)=='Overdue'||showTaskStatus(scope.row)=='Urgent')&&user.deptId!=scope.row.partyId" class="el-icon-message"></i>
            </el-popover>
            <i v-show="scope.row.status==1&&user.deptId==scope.row.partyId" @click="handleTask(scope.row)" style="cursor: pointer;" class="el-icon-edit"></i>
            <i v-if="scope.row.taskName=='QC Approve'&&scope.row.status==2" @click="viewQcResult(scope.row)" class="el-icon-view"></i>
            <i v-if="scope.row.taskName!='QC Approve'&&scope.row.jsonData!=null&&scope.row.status==2" @click="viewTask(scope.row)" class="el-icon-view"></i>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <InboundPopup :orderId="task.orderId" :view="view" @close-inbound-popup="closeInboundPopup" v-if="showInboundPopup"></InboundPopup>
    <BookPopup :orderId="task.orderId" :view="view" :type="showBookPopupType"  @close-book-popup="closeBookPopup" v-if="showBookPopup"></BookPopup>
    <OrderPopup :orderId="task.orderId" :view="view"   @close-order-popup="closeOrderPopup" v-if="showOrderPopup"></OrderPopup>




  </div>
</template>
<style scoped>
p{
  margin: 0px;
}
.not-check-css{
  border-color: red;
}


.title{
  font-weight: bold;
  padding-right: 10px;
}


.cardx{
  border-radius: 8px;
  border: 3px dashed transparent;
  padding: 1rem;
  border:1px solid #ddd;
  margin-bottom: 15px;
  box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
}
.status1Div,.order,.taskName,.date{
  float: left;
  margin-left: 15px;
}
.title{
  border: 5px;
}
.self-step1:not(:first-child):before{
  width: 150px;
  height: 2px;
  position: absolute;
  left: -120px;
  content: "";
  background: #004F7C;
  top: 20px;
  text-align: left;
}
.status2{

  border-radius: 100px;
  padding: 2px 13px;
  font-size: 12px;
}
.color1{
  color: #13854e;
  background-color:#d6ede2;
}
.color2{
  color: #2d86ba;
  background-color:#ceecfd;
}
.numberOftask{
  font-size: 16px;
  text-decoration: underline;
  cursor: pointer;
}
.color3{
  color: #e6a23c;
  background: #fdf6ec;
}
.color4{
  color: #f56c6c;
  background: #fef0f0;
}


/deep/.el-table__footer-wrapper tbody td.el-table__cell{
  color: #004F7C;
}
/deep/.el-table .el-table__footer-wrapper .cell{
  color: #004F7C;
}

/* Inbound Received Confirmation Styles */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.summary-container {
  margin-bottom: 20px;
}

.summary-card {
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.summary-item {
  display: inline-block;
  margin-right: 30px;
  margin-bottom: 10px;
}

.summary-label {
  font-weight: bold;
  margin-right: 5px;
  color: #606266;
}

.summary-value {
  font-size: 18px;
  font-weight: bold;
}

.summary-value.match {
  color: #67c23a;
}

.summary-value.mismatch {
  color: #f56c6c;
}

.mismatch-text {
  color: #f56c6c;
  font-weight: bold;
}

.difference-reason {
  font-size: 13px;
}

.el-table__header-wrapper th {
  background-color: #f5f7fa;
  font-weight: bold;
}

.el-table__fixed-column {
  background-color: #fff;
}

</style>
<script>
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数
import '@icon-park/vue/styles/index.css';
import {IconPark} from '@icon-park/vue/es/all';
import {getTaskStatus} from "@/utils/auth";
import { getUserProfile } from "@/api/system/user";
import { getOriginDeliveryList } from "@/api/system/originDelivery";
import { getBaseHeader } from "@/utils/request";
import { getHeaderPage1, exportPO,groupByCategoryCode, exportPO1,downloadKaemingkTemplate,downloadHenkelmanTemplate,orderReportForKaemingk,exportKaemingk,exportPoData  } from "@/api/order/header";
import {  getItemList ,getListByCondition} from "@/api/order/item";
import { getProductList } from "@/api/system/product";
import { getDeptList } from "@/api/system/dept";
import { getVesselList } from "@/api/system/vessel";
import { getTaskNames,updateTask,getTaskList,reminder } from "@/api/order/task";
import { DICT_TYPE, getDictDatas } from "@/utils/dict";
import { listByProductIds } from "@/api/system/unitConversion";
import { checkPoAsnInbound } from "@/api/system/wms-inbound";
import InboundPopup from "../../board/inbound/index.vue";
import BookPopup from "../../board/book/index.vue";
import OrderPopup from "../../board/order/index.vue";
import { getTenantId} from "@/utils/auth"

export default {
  name: "Container",
  components: {
    IconPark,InboundPopup,BookPopup,OrderPopup
  },
  data() {
    return {
      showOrderPopup: false,
      showInboundPopup: false,
      showInboundReceivedConfirmation: false,
      confirmLoading: false,
      showBookPopup: false,
      showBookPopupType: 1,
      taskDetailDataVisible:false,
      taskDetailData:[],
      // Inbound Received Confirmation data
      loadingInboundComparison: false,
      inboundComparisonData: [],
      totalItems: 0,
      matchItems: 0,
      mismatchItems: 0,
      currentTaskStatus: 0,
      uploadError:{
        title: "Errors",
        dialogVisible: false,
        data: ""
      },
      task1:[],
      task2:[],
      task3:[],
      task1Temp:[
        {'taskName':'Update Cargo Handover Date','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Inspection Date','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'QC Approve','possible':0,'urgent':0,'overdue':0,'finished':0},
      ],
      task2Temp:[
        {'taskName':'Inbound Order','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Inbound Order Verification','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Booking Order','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Validate shipper booking','possible':0,'urgent':0,'overdue':0,'finished':0},
      ],
      task3Temp:[
        {'taskName':'Inbound Received','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Carrier Booking','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Booking Confirmation','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Empty Pick up','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Container Loading Plan','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Container stuffing','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'SI Submit','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Origin Customs Clearance','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Gate in','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Vessel Departure','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'HBL Release','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Vessel Arrival','possible':0,'urgent':0,'overdue':0,'finished':0},
        {'taskName':'Empty Return','possible':0,'urgent':0,'overdue':0,'finished':0}
      ],
      drawer2:false,
      direction: "rtl",
      drawer: false,
      tableDataLine: [],
      tableData: [],
      downloadLink:'',
      user:{},
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
        url: process.env.VUE_APP_BASE_API + "/admin-api/order/import",
      },
      activities:[],
      exportLoading: false,
      tableHeight: 0,
      loading: true,
      total: 0,
      bookingNameMap:{},
      lineTotal: 0,
      queryParams: {
        pageNo: 1,
        pageSize: 20,
        prop:'',
        orderBy:''
      },
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
      dialogFormVisible:false,
      pickupFormVisible:false,
      bookingFormVisible:false,
      crdFormVisible:false,
      inspectionFormVisible:false,
      customClearanceFormVisible:false,
      qcFormVisible:false,
      containerStuffingFormVisible:false,
      form:{},
      view:true,
      task:{},
      itemList:[],
      itemVisable: false,
      title: "",
      data: {},
      customFieldHeader: [],
      customFieldLine: [],
      itemMap: {},
      expanded:{},
      loadingMap:{},
      containerMap:{},
      drawer:false,
      vesselMap:{},
      portMap:{},
      taskList:[],
      hiddenTask:false,
      fileType:{
        'shipment_carrier_bill':'MBL',
        'shipment_house_bill':'HBL',
        'shipment_others':'Others',
        'order_inbound_files':'order_inbound',
      },
      allMilestone:{
        "5": "Gate out Empty",
        "6": "Gate In Full",
        "8": "Shipped",
        "9": "BL Issued(Rls)",
        "10": "Arrived",
        "11": "Departure POD",
        "12": "Delivered",
        "14": "Completed"
      },
      otherMilestones: {
        "-1":"Update",
        "0":"CancelShipment",
        "1":"Draft",
        "2":"Submit Booking",
        "3":"Booking Accept",
        "4":"Booking Confirmation",
        "5":"GATE OUT EMPTY",
        "6":"GateIn",
        "7":"Shipping Instructions",
        "8":"Shipped",
        "9":"BLIssued",
        "10":"Arrived",
        "11":"DeparturePOD",
        "12":"Delivered",
        "13":"ArrivalInlandTerminal",
        "14":"Completed",
        "18":"Departure POL",
        "19":"Arrival POD",
        "20":"Custom clearance",
        "21":"Delivery",
        "22":"Empty Return",
      },
      containerStatus:{
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
      title:'',
      orderIndex:0,
      taskNames:[],
      possibleList:[],
      urgentList:[],
      overdueList:[],
      finishedList:[],
      orderInfo:{
        ports:[],
        booked:0,
        notBooked:0,
        inboundPoQty:0,
      },
      categoryCodeList:[],
      unitsMap:{},
      unitsMap1:{},
      unitLabelsShow:{},
      checkedPort:{},
      showFactory:false,
      comparisonList: [], // 合并后的对比列表
      mismatchCount: 0, // 差异数量
      hasCriticalMismatch: false, // 是否有严重差异
      selectedOrderIds: [], // 选中的订单ID数组

    };
  },
  created() {
    var tenantId = getTenantId()
    var tenantDatas = this.getDictDatas(DICT_TYPE.PUSH_TO_NINGBO_WMS_TENANT)
    //指定租户查看列  多显示工厂信息 ,隐藏不必要的列
    if(tenantDatas && tenantId != null){
        for (var tenants of tenantDatas) {
            if (tenants.label == 'tenantIds' && tenants.value?.split(',').map(item => item.trim()).includes(tenantId)) {
                this.showFactory = true
            }
        }
    }
    this.hiddenTask = getTaskStatus()==1;

    if(this.$route.query.orderNumber){
      this.$set(this.queryParams, "orderNumber", this.$route.query.orderNumber)
    }
    getUserProfile().then(response => {
      this.user = response.data;
    });
    this.calcTableHeight();
    this.getList();
    this.groupByCategoryCode();

  },
  methods: {
    orderReport(){
      orderReportForKaemingk(this.queryParams).then((res)=>{
        this.orderInfo=res.data
      })
    },
    bookedChange(flag){
      if(this.queryParams.booked==flag){
        this.queryParams.booked=null
      }else{
        this.queryParams.booked=flag
      }
      this.getList()
    },
    closeOrderPopup(){
      if(this.view) {
        this.showOrderPopup = false
      } else {
        this.showOrderPopup = false
        this.getList();
        this.getTaskNames()
        this.drawer = false
      }
    },
    closeBookPopup(){
      if(this.view) {
        this.showBookPopup = false
      } else {
        this.showBookPopup = false
        this.getList();
        this.getTaskNames()
        this.drawer = false
      }
    },
    closeInboundPopup(){
      if(this.view) {
        this.showInboundPopup = false
      } else {
        this.showInboundPopup = false
        this.getList();
        this.getTaskNames()
        this.drawer = false
      }
    },
    handleExpandChange(item) {
      console.log(item)
    },
    checkPermi,
    checkRole,
    changeBookedQty(row){
      this.calculateWeight(row)
      this.calculateVolume(row)
    },
    calculateWeight(row){
      if(row.outerWeight && row.booked){
        var bookNum = row.booked
        var shengyuNum = 0;
        if(row.bookedUnit!='CTNS') {
          var units=row.units
          if(units == null||units.length==0){
          } else {
            var ctnsUnit = units.filter(item=>item.fromUnit=='CTNS'&&item.toUnit==row.bookedUnit)[0];
            var piecUnit = units.filter(item=>item.fromUnit==row.bookedUnit&&item.toUnit=='INNER BOX')[0];
            bookNum=Math.floor(row.booked/Number(ctnsUnit.conversionFactor))
            if(row.booked%Number(ctnsUnit.conversionFactor)>0&&piecUnit!=null){
              var shengyu=row.booked%Number(ctnsUnit.conversionFactor)/piecUnit.conversionFactor
              shengyuNum = shengyu;
            }
          }
        }
        const weightKg = (row.outerWeight * bookNum + row.innerWeight*shengyuNum).toFixed(3)
        row.totalWeight = weightKg
        return weightKg;
      }
      return row.totalWeight;
    },
    calculateVolume(row ) {
      if(row.length1 && row.width1 && row.height1 && row.booked){
        var bookNum = row.booked
        if(row.bookedUnit!='CTNS') { // 需要转换
          bookNum = row['CTNSBooked']
        }
        // 计算体积（单位：立方厘米）
        const volumeCm3 = row.length1 * row.width1 * row.height1;
        // 转换为立方米
        const volumeCbm = ((volumeCm3 / 1000000) * bookNum).toFixed(3);
        row.totalVolume = volumeCbm;
        return volumeCbm;
      }
      return row.totalVolume;
    },
    getTenantPage(){
      if(this.checkPermi(['super:user'])){
        getTenantPage({pageNo:1,pageSize:100,status:0}).then(response => {
          for(var i=0;i<response.data.list.length;i++){
            this.tenantMap[response.data.list[i].id]=response.data.list[i].name
          }
        });
      }
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex%2==0) {
        return 'shuang-row';
      } else {
        return 'dan-row';
      }
      return '';
    },

    beforeUpload(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = () => {
          this.form.file = reader.result;
          resolve(); // 上传之前的处理完成后调用 resolve()
        };

        reader.readAsDataURL(file.raw);
      });
    },
    handleSortChange({ column, prop, order }){
      // 根据当前排序条件发送请求到后台获取排序结果
      if(order!=null){
        order = order === 'ascending' ? 'ASC' : 'DESC';
        this.queryParams.prop=column.property.replace(/([A-Z])/g, "_$1").toLowerCase()
        this.queryParams.orderBy=order
      }else{
        this.queryParams.prop=''
        this.queryParams.orderBy=''
      }
      this.getList()
    },
    toOrder2(orderNumber){
      this.taskDetailDataVisible=false
      this.drawer2=false
      this.$set(this.queryParams, "orderNumber", orderNumber)
      this.getList()
    },
    sendEmail(task){
      reminder({
        status:this.showTaskStatus(task),
        orderNumber:task.orderNumber,
        taskName:task.taskName,
        partyId:task.partyId
      }).then((res)=>{
        this.$notify({
          title: 'success',
          message: 'success',
          type: 'success'
        });
      })
    },
    taskDetails(row,status){
      this.taskDetailDataVisible=true
      this.taskDetailData=row[status+'data']
      this.title=row.taskName+" "+status
    },
    getTaskNames(){
      getTaskNames({type:'1'}).then((res)=>{
        this.taskNames=res.data
        this.task1 = JSON.parse(JSON.stringify(this.task1Temp))
        this.task2 = JSON.parse(JSON.stringify(this.task2Temp))
        this.task3 = JSON.parse(JSON.stringify(this.task3Temp))
        this.task1=this.task1.filter(item=>this.taskNames.indexOf(item.taskName)>-1)
        this.task2=this.task2.filter(item=>this.taskNames.indexOf(item.taskName)>-1)
        this.task3=this.task3.filter(item=>this.taskNames.indexOf(item.taskName)>-1)
        this.overview()
      })
    },
    overview(){
      getTaskList({status:1,statuskey:'Possible',type:'1',booked:this.queryParams.booked,wareHouses:this.queryParams.wareHouses,
        orderStatus:this.queryParams.status,categoryCode:this.queryParams.categoryCode
      }).then((res)=>{
        this.possibleList=res.data
        this.setData(res,'possible')
      })
      getTaskList({status:1,statuskey:'Urgent',type:'1',booked:this.queryParams.booked,wareHouses:this.queryParams.wareHouses,
        orderStatus:this.queryParams.status,categoryCode:this.queryParams.categoryCode
      }).then((res)=>{
        this.urgentList=res.data
        this.setData(res,'urgent')
      })
      getTaskList({status:1,statuskey:'Overdue',type:'1',booked:this.queryParams.booked,wareHouses:this.queryParams.wareHouses,
        orderStatus:this.queryParams.status,categoryCode:this.queryParams.categoryCode
      }).then((res)=>{
        this.overdueList=res.data
        this.setData(res,'overdue')
      })
      getTaskList({status:2,type:'1',booked:this.queryParams.booked,wareHouses:this.queryParams.wareHouses,
        orderStatus:this.queryParams.status,categoryCode:this.queryParams.categoryCode
      }).then((res)=>{
        this.finishedList=res.data
        this.setData(res,'finished')
      })
    },
    setData(res,key){
      for(var task of this.task1) {
        if(key=='finished')task.finished = 0
        if(key=='overdue')task.overdue = 0
        if(key=='possible')task.possible = 0
        if(key=='urgent')task.urgent = 0
      }
      for(var task of this.task2) {
        if(key=='finished')task.finished = 0
        if(key=='overdue')task.overdue = 0
        if(key=='possible')task.possible = 0
        if(key=='urgent')task.urgent = 0
      }
      for(var task of this.task3) {
        if(key=='finished')task.finished = 0
        if(key=='overdue')task.overdue = 0
        if(key=='possible')task.possible = 0
        if(key=='urgent')task.urgent = 0
      }
      for(var i=0;i<res.data.length;i++){
        if(res.data[i].taskName=='Update Cargo Handover Date'
          ||res.data[i].taskName=='Inspection Date'
          ||res.data[i].taskName=='QC Approve'){
          var index = this.task1.findIndex(item => item.taskName === res.data[i].taskName);
          if(index<0) {
            continue
          }
          if(!this.task1[index][key+'data']||i==0){
            this.task1[index][key+'data']=[]
          }
          this.task1[index][key+'data'].push(res.data[i])
          this.task1[index][key]=this.task1[index][key]+1
        }else if(res.data[i].taskName=='Booking Order'
          ||res.data[i].taskName=='Validate shipper booking'
          ||res.data[i].taskName=='Inbound Order'
          ||res.data[i].taskName=='Inbound received'
        ){
          var index = this.task2.findIndex(item => item.taskName === res.data[i].taskName);
          if(index<0) {
            continue
          }
          if(!this.task2[index][key+'data']||i==0){
            this.task2[index][key+'data']=[]
          }
          this.task2[index][key+'data'].push(res.data[i])
          this.task2[index][key]=this.task2[index][key]+1
        }else{
          if(res.data[i].taskName=='Upload PO'){
            continue
          }
          var index = this.task3.findIndex(item => item.taskName === res.data[i].taskName);
          if(index<0) {
            continue
          }
          if(!this.task3[index][key+'data']||i==0){
            this.task3[index][key+'data']=[]
          }
          this.task3[index][key+'data'].push(res.data[i])
          this.task3[index][key]=this.task3[index][key]+1
        }
      }
    },
    openOverview(){

      this.drawer2=!this.drawer2
    },
    showTaskStatus(h){
      if(h.status==0){
        return ''
      }else if(h.status==1){
        if(Date.now()>h.dueDate){
          return 'Overdue'
        }else if(Date.now()>h.urgentDate){
          return 'Urgent'
        }
        return 'Possible'
      }else if(h.status==2){
        return 'Finished'
      }
    },
    showTask(list,index){
      this.orderIndex=index
      this.drawer=true
      this.taskList=list
      if(list.length>0){
        this.title=list[0].orderNumber
      }
    },
    showStatus(data) {
      if(data.status==1){
        return 'Cancel'
      }
      if(data.shipmentContainerStatusRes.length==0){
        function compare(){
          return function(a,b){
            var value1 = a["status"];
            var value2 = b["status"];
            return parseInt(value1) - parseInt(value2);
          }
        }
        console.log(data)
        var arr=JSON.parse(JSON.stringify(data.shipmentStatusList))
        arr.sort(compare())
        return this.otherMilestones[arr[arr.length-1].status]
      }
      if(data.shipmentContainerStatusRes.length>0){
        var move=data.shipmentContainerStatusRes[data.shipmentContainerStatusRes.length-1]
        if(data.carrier=='TSHG'){
          return this.containerStatus[move.eventCode]?this.containerStatus[move.eventCode]:move.eventCode
        }else{
          return this.containerStatus[move.eventCode]?this.containerStatus[move.eventCode]:move.descriptionEn
        }
      }
    },
    searchPortPor(query){
      if(query.length>=3){

      }
    },

    clickWareHouse(item) {
      this.$set(this.checkedPort, item, !this.checkedPort[item]);
      var wareHouses=[]
      for(var key in this.checkedPort){
        if(this.checkedPort[key]){
          wareHouses.push(key)
        }
      }
      this.queryParams.wareHouses=wareHouses
      this.getList()
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
    groupByCategoryCode(){
      groupByCategoryCode().then((res)=>{
        this.categoryCodeList = res.data;
      })
    },
    handleClick(el,order){
      if(el.index!='0'&&!order.shipments){
        order.shipments=true
      }
      //select shipments
      this.toggleLoading(order.id)
    },
    handleSelectionChange(selection) {
      this.selectedOrderIds = selection.map(item => item.id);
    },
    toggleDetails(index) {
      this.$set(this.expanded, index, !this.expanded[index]);
    },
    async toggleLoading(index) {
      this.$set(this.loadingMap, index, !this.loadingMap[index]);
    },

    getDeptList(ids) {
      var vm = this;
      getDeptList({ ids: ids.join(",") }).then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          vm.$set(vm.partyMap, response.data[i].id, response.data[i].name);
        }
      });
    },

    toTack(vesselName){
      window.open('/track/ship?vesselName='+vesselName)
    },
    toOrder(po){
      window.open('/purchaseorder/POManagement?orderNumber='+po)
    },


    getList() {
      this.loading = true;
      this.orderReport()
      this.getTaskNames()

      // 执行查询
      getHeaderPage1(this.queryParams).then((response) => {
        this.tableData = response.data.list;
        this.vesselMap={}
        if (this.tableData.length > 0) {
          var productIds = [];
          this.shipmentStatusMap={}
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].show=0
            this.tableData[i].key='first'+this.tableData[i].id
            this.orderNumberMap[this.tableData[i].id]=this.tableData[i].orderNumber
            for (var j = 0; j < this.tableData[i].items.length; j++) {
              productIds.push(this.tableData[i].items[j].productId);
            }
          }
          this.getItems(productIds);
          this.itemQueryParams.orderId = this.tableData[0].id;
          var partyIds = [];
          for (var i = 0; i < this.tableData.length; i++) {
            partyIds.push(this.tableData[i].buyer);
            partyIds.push(this.tableData[i].seller);
            partyIds.push(this.tableData[i].oha);
          }
          this.getDeptList(partyIds);


          // carton Show
          listByProductIds({ ids: productIds }).then((response1) => {
            var uitConversions = response1.data;

            for (var i = 0; i < this.tableData.length; i++) {
              var productIds1=[]
              for(var item of this.tableData[i].items) {
                productIds1.push(item.productId);
              }

              this.tableData[i].uitConversions = uitConversions.filter(item => productIds1.indexOf(item.productId)>-1)

              var units = getDictDatas(DICT_TYPE.SYSTEM_UNITS);

              console.log(units)
              for(var item of this.tableData[i].items) {
                for(var unit of units) {
                  this.unitsMap[unit.value] = unit.label
                  this.unitsMap1[unit.label] = unit.value
                  if (item.requestUnit==null) {
                    item.requestUnit = "PIEC"
                  } else if(unit.label==item.requestUnit.toUpperCase()||unit.value==item.requestUnit.toUpperCase()) {
                    item.requestUnit = unit.value;
                  }
                  if (item.bookedUnit==null) {
                    item.bookedUnit = item.requestUnit
                  } else if(unit.label==item.bookedUnit.toUpperCase()||unit.value==item.bookedUnit.toUpperCase()) {
                    item.bookedUnit = unit.value;
                  }
                  if (item.inboundUnit==null) {
                    item.inboundUnit = item.requestUnit
                  } else if(unit.label==item.inboundUnit.toUpperCase()||unit.value==item.inboundUnit.toUpperCase()) {
                    item.inboundUnit = unit.value;
                  }
                  if (item.requested==null) {
                    item.requested = 0
                  }
                  if (item.booked==null) {
                    item.booked = 0
                  }
                  if (item.inbound==null) {
                    item.inbound = 0
                  }
                }
              }
              for(var item of this.tableData[i].items) {
                var units=this.tableData[i].uitConversions.filter(uitConversion=> uitConversion.productId == item.productId)
                item.units = units;
              }
              this.setQty(this.tableData[i].items,this.tableData[i].id)
            }
          });

        }
        this.total = response.data.total;
        this.loading = false;
      });
    },
    setQty(data,orderId){
      var vm=this
      for(var k=0;k<data.length;k++){
        var row=data[k]
        var units=row.units

        vm.unitLabelsShow[orderId] = false;

        if(units == null||units.length==0){
          data[k][row.requestUnit+'Ordered']=row.requested
          data[k][row.bookedUnit+'Booked']=row.booked
          data[k][row.inboundUnit+'Inbound']=row.inbound
        }

        if(units == null||units.length==0){
        } else {
          var requestUnit = row.requestUnit
          var ctnsUnit = units.filter(item=>item.fromUnit=='CTNS'&&item.toUnit==requestUnit)[0];
          var piecUnit = units.filter(item=>item.fromUnit==requestUnit&&item.toUnit=='INNER BOX')[0];

          data[k][requestUnit+'Ordered']=row.requested
          data[k]['CTNS'+'Ordered']=Math.floor(row.requested/Number(ctnsUnit.conversionFactor))
          if(row.requested%Number(ctnsUnit.conversionFactor)>0&&piecUnit!=null){
            var shengyu=row.requested%Number(ctnsUnit.conversionFactor)
            data[k]['CTNS'+'Ordered']= Math.floor(row.requested/Number(ctnsUnit.conversionFactor))
            data[k]['INNER BOX'+'Ordered']= Math.floor(shengyu/piecUnit.conversionFactor)
            vm.unitLabelsShow[orderId] = true;
          }

          data[k][requestUnit+'Booked']=row.booked
          data[k]['CTNS'+'Booked']=Math.floor(row.booked/Number(ctnsUnit.conversionFactor))
          if(row.booked%Number(ctnsUnit.conversionFactor)>0&&piecUnit!=null){
            var shengyu=row.booked%Number(ctnsUnit.conversionFactor)
            data[k]['CTNS'+'Booked']= Math.floor(row.booked/Number(ctnsUnit.conversionFactor))
            data[k]['INNER BOX'+'Booked']= Math.floor(shengyu/piecUnit.conversionFactor)
            vm.unitLabelsShow[orderId] = true;
          }

          data[k][requestUnit+'Inbound']=row.inbound
          data[k]['CTNS'+'Inbound']=Math.floor(row.inbound/Number(ctnsUnit.conversionFactor))
          if(row.inbound%Number(ctnsUnit.conversionFactor)>0&&piecUnit!=null){
            var shengyu=row.inbound%Number(ctnsUnit.conversionFactor)
            data[k]['CTNS'+'Inbound']= Math.floor(row.inbound/Number(ctnsUnit.conversionFactor))
            data[k]['INNER BOX'+'Inbound']= Math.floor(shengyu/piecUnit.conversionFactor)
            vm.unitLabelsShow[orderId] = true;
          }
          if(vm.unitLabelsShow[orderId]==true) {
            if(data[k]['INNER BOX'+'Ordered']==null) {
              data[k]['INNER BOX'+'Ordered'] = 0
            }
            if(data[k]['INNER BOX'+'Booked']==null) {
              data[k]['INNER BOX'+'Booked'] = 0
            }
            if(data[k]['INNER BOX'+'Inbound']==null) {
              data[k]['INNER BOX'+'Inbound'] = 0
            }
          }

        }

      }

      console.log(vm.unitLabelsShow)

    },
    getItems(productIds) {
      getProductList({ ids: productIds }).then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          this.productMap[response.data[i].id] = {
            name: response.data[i].name,
            code: response.data[i].code,
            category: response.data[i].category,
          };
        }
      });
    },
    calcTableHeight() {
      const clientHeight = document.documentElement.clientHeight;
      this.tableHeight = clientHeight - 302;
    },
    /** 导出按钮操作 */
    handleExport() {
      const message = this.selectedOrderIds.length > 0
        ? this.$t("purchaseOrder.confirmExportSelectedOrders")
        : this.$t("purchaseOrder.confirmThatAllDataItemsAreExported");

      this.$modal
        .confirm(message)
        .then(() => {
          // 处理查询参数
          let params = { ...this.queryParams };
          params.pageNo = undefined;
          params.pageSize = undefined;

          // 如果有选中的订单，添加到参数中
          if (this.selectedOrderIds.length > 0) {
            params.orderIds = this.selectedOrderIds;
          }

          this.exportLoading = true;
          if(this.showFactory){
            //申明是使用第二套导出模板
            params.inboundTable = true
            return exportPoData(params);

          }
          return exportKaemingk(params);
        })
        .then((response) => {
          this.$download.excel(response, "smartMOOV_PO"+this.parseTimeToZ2(new Date())+".xlsx");
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    parseTimeToZ1(timestamp) {
      console.log(timestamp,timestamp)
      if(!timestamp) return null
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}Z`;
    },
    parseTimeToZ2(timestamp) {
      if(!timestamp) return null
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
      this.upload.url = process.env.VUE_APP_BASE_API + "/admin-api/order/importKaemingk";
      // if (this.checkPermi(['order:header:importKaemingk'])) {
      //   this.upload.url = process.env.VUE_APP_BASE_API + "/admin-api/order/importKaemingk";
      // } else if (this.checkPermi(['order:header:importHenkelman'])) {
      //   this.upload.url = process.env.VUE_APP_BASE_API + "/admin-api/order/importHenkelman";
      // } else {
      //   this.upload.url = process.env.VUE_APP_BASE_API + "/admin-api/order/import";
      // }
    },
    /** 下载模板操作 */
    importTemplate() {
      downloadKaemingkTemplate().then((response) => {
        this.$download.excel(response, "PO Upload TempLate.xlsx");
      });
      // if (this.checkPermi(['order:header:importKaemingk'])) {
      //   downloadKaemingkTemplate().then((response) => {
      //     this.$download.excel(response, "PO Upload TempLate.xlsx");
      //   });
      // } else if (this.checkPermi(['order:header:importHenkelman'])) {
      //   downloadHenkelmanTemplate().then((response) => {
      //     this.$download.excel(response, "PO Upload TempLate.xlsx");
      //   });
      // } else {
      //   importTemplate().then((response) => {
      //     this.$download.excel(response, "PO Upload TempLate.xlsx");
      //   });
      // }
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

      }
      this.getList();
    },
    // 文件上传失败处理
    handleFileError(err, file, fileList){
      console.log(err)
      this.$refs.upload.clearFiles();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    handleTask(task){
      this.view=false
      this.task=task
      this.currentTaskStatus = task.status // 记录当前任务状态
      this.form={}
      //this.title=task.orderNumber+'['+task.taskName+']'

      if (task.taskName == 'Confirm cargo handover date to CFS') {

      } else if (task.taskName == 'Confirm cargo handover date to CY') {

      } else
      if(task.taskName=='Update Cargo Handover Date'){
        this.crdFormVisible=true
      }else if(task.taskName=='Inspection Date'){
        this.inspectionFormVisible=true
      }else if(task.taskName=='QC Approve'){
        this.qcFormVisible=true
      }else if(task.taskName=='Booking Order'){
        this.bookingFormVisible=true
        getListByCondition({orderId:task.orderId}).then((res)=>{
          this.itemList=res.data
        })
      }else if(task.taskName=='Validate shipper booking'){
        console.log("/shipment/booking-detail?id="+JSON.parse(task.jsonData).bookingId)
        this.$router.push("/shipment/booking-detail?id="+JSON.parse(task.jsonData).bookingId);
      }else if(task.taskName=='Carrier Booking'){
        this.$router.push("/shipment/create?ids="+JSON.parse(task.jsonData).bookingId);
      }else if(task.taskName=='Booking Confirmation'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Empty Pick up'){
        this.pickupFormVisible=true
      }else if(task.taskName=='Container Loading Plan'){
        this.$router.push("/shipment/clp/add?shipmentId="+JSON.parse(task.jsonData).shipmentId+'&bookingNumber='+JSON.parse(task.jsonData).bookingNumber);
      }else if(task.taskName=='Container stuffing'){
        this.containerStuffingFormVisible=true
      }else if(task.taskName=='SI Submit'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Origin Customs Clearance'){
        this.customClearanceFormVisible=true
      }else if(task.taskName=='Gate in'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Vessel Departure'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='HBL Release'){
        this.$router.push("/shipment/Hbl?shipmentId="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Vessel Arrival'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Empty Return'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Upload PO'){
        this.showOrderPopup = true;
      }else if(task.taskName=='Inbound Order'){
        this.showBookPopupType = 1;
        this.showBookPopup = true;
      }else if(task.taskName=='Inbound Order Verification'){
        this.showBookPopupType = 2;
        this.showBookPopup = true;
      }else if(task.taskName=='Inbound Received'){
        if(this.showFactory){
          // 显示Inbound Received Confirmation弹框
          this.showInboundReceivedConfirmation = true;
          this.loadingInboundComparison = true;
          // 调用后端接口获取三方对比数据
          checkPoAsnInbound({orderId: task.orderId}).then(res => {
            this.inboundComparisonData = res.data;
            // 统计匹配情况
            this.totalItems = res.data.length;
            this.matchItems = res.data.filter(item => item.matchStatus === 'MATCH').length;
            this.mismatchItems = res.data.filter(item => item.matchStatus === 'MISMATCH').length;
            this.loadingInboundComparison = false;
          }).catch(error => {
            this.$modal.msgError('Failed to get comparison data');
            this.loadingInboundComparison = false;
          });
        }else{
          this.showInboundPopup = true;
        }
      }
    },
    viewQcResult(task){
      this.qcFormVisible=true
      this.view=true
      //this.title=task.orderNumber+'['+task.taskName+']'
      this.form=JSON.parse(task.jsonData)
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
    viewTask(task){
      this.view=true
      this.task=task
      this.currentTaskStatus = task.status // 记录当前任务状态
      //this.title=task.orderNumber+'['+task.taskName+']'
      if(task.jsonData!=null&&task.jsonData!='') {
        this.form=JSON.parse(task.jsonData)
      }
      if (task.taskName == 'Confirm cargo handover date to CFS') {

      } else if (task.taskName == 'Confirm cargo handover date to CY') {

      } else
      if(task.taskName=='Update Cargo Handover Date'){
        this.crdFormVisible=true
      }else if(task.taskName=='Inspection Date'){
        this.inspectionFormVisible=true
      }else if(task.taskName=='Booking Order'){
        this.$router.push("/shipment/booking-detail?id="+this.form.bookingId);
      }else if(task.taskName=='Validate shipper booking'){
        this.$alert('Pass', 'Result', {
          confirmButtonText: 'Ok',
          callback: action => {

          }
        });
      }else if(task.taskName=='Carrier Booking'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Booking Confirmation'){
        this.$alert('Date:'+JSON.parse(task.jsonData).date+'<br/>'+'Booking Number:'+JSON.parse(task.jsonData).bookingNumber, 'Booking Confirmation', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }else if(task.taskName=='Empty Pick up'){
        this.pickupFormVisible=true
      }else if(task.taskName=='Container Loading Plan'){
        console.log(JSON.parse(task.jsonData))
        this.$router.push("/shipment/clp/detail?id="+JSON.parse(task.jsonData).clpId);
      }else if(task.taskName=='Container stuffing'){
        this.containerStuffingFormVisible=true
      }else if(task.taskName=='SI Submit'){
        this.$router.push("/shipment/detail?id="+JSON.parse(task.jsonData).shipmentId);
      }else if(task.taskName=='Origin Customs Clearance'){
        this.customClearanceFormVisible=true
      }else if(task.taskName=='Gate in'){
        this.$alert('Event Time:'+JSON.parse(task.jsonData).eventTime+'<br/>'+'Vessel:'+JSON.parse(task.jsonData).vessel
          +'<br/>'+'Voyage:'+JSON.parse(task.jsonData).voyage, 'Gate in', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }else if(task.taskName=='Vessel Departure'){
        this.$alert('ATD:'+JSON.parse(task.jsonData).atd, 'Vessel Departure', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }else if(task.taskName=='HBL Release'){
        this.$router.push("/shipment/Hbl?hblNumber="+JSON.parse(task.jsonData).hblNumber);
      }else if(task.taskName=='Vessel Arrival'){
        this.$alert('ATA:'+JSON.parse(task.jsonData).atd, 'Vessel Arrival', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }else if(task.taskName=='Empty Return'){
        this.$alert('Event Time:'+JSON.parse(task.jsonData).eventTime, 'Empty Return', {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
          }
        });
      }else if(task.taskName=='Upload PO'){
        this.showOrderPopup = true;
      }else if(task.taskName=='Inbound Order'){
        this.showBookPopupType = 1;
        this.showBookPopup = true;
      }else if(task.taskName=='Inbound Order Verification'){
        this.showBookPopupType = 2;
        this.showBookPopup = true;
      }else if(task.taskName=='Inbound Received'){
         if(this.showFactory){
          // 显示Inbound Received Confirmation弹框
          this.showInboundReceivedConfirmation = true;
          this.loadingInboundComparison = true;
          // 调用后端接口获取三方对比数据
          checkPoAsnInbound({orderId: task.orderId}).then(res => {
            this.inboundComparisonData = res.data;
            // 统计匹配情况
            this.totalItems = res.data.length;
            this.matchItems = res.data.filter(item => item.matchStatus === 'MATCH').length;
            this.mismatchItems = res.data.filter(item => item.matchStatus === 'MISMATCH').length;
            this.loadingInboundComparison = false;
          }).catch(error => {
            this.$modal.msgError('Failed to get comparison data');
            this.loadingInboundComparison = false;
          });
        }else{
          this.showInboundPopup = true;
        }
      }




    },
    submitTask(){
      if(this.task.taskName=='Booking Order'){
        // for (var i = 0; i < this.itemList.length; i++) {
        //     if(this.itemList[i].bookedQty > this.itemList[i].requested){
        //       this.$notify({
        //         message: "Book qty exceed requested qty",
        //         type: "warning",
        //       });
        //     }
        // }
        // var bookData=[{
        //   orderId:this.task.orderId,
        //   poNumber:this.task.orderNumber,
        //   tableData:this.itemList
        // }]
        // sessionStorage.setItem("bookData", JSON.stringify(bookData));
        // this.$router.push("/shipment/booking-create");
      }else{
        this.task.jsonData=JSON.stringify(this.form)
        updateTask(this.task).then((res)=>{
          this.crdFormVisible=false
          this.inspectionFormVisible=false
          this.qcFormVisible=false
          this.pickupFormVisible=false
          this.containerStuffingFormVisible=false
          this.customClearanceFormVisible=false

          this.taskDetailData = this.taskDetailData.filter(item => item.orderId != this.task.orderId)
          this.getList()
        })

      }

    },
    getSummaries(param) {
      const {columns, data} = param;
      const sums = [];
      if (!columns) {
        return sums = []
      }
      columns.forEach((column, index) => {
        // console.log(column.property)
        if (index == 0) {
          sums[index] = 'Total';//可更改合计行的名称
          return;
        }
        if (column.property =='productCode' ||column.property =='productName'||column.property =='remark'
          || column.property =='length' || column.property =='width' || column.property =='height'||column.property =='hsCode'
          || column.property =='length1' || column.property =='width1' || column.property =='height1'
          || column.property =='innerWeight'|| column.property =='outerWeight'
          || column.property =='bestBeforeDate'|| column.property =='batchNo'|| column.property =='backupStr4'
         || column.property =='backupStr5'|| column.property =='backupStr6'|| column.property =='backupStr7') {
          sums[index] = ' ';
          return;
        }
        if (column.property =='PIECESOrdered') {
          const values = data.map(item => Number(item.requested));
          let sum = 0;
          values.forEach(element => {
            if(isNaN(element)) {
              element = 0
            }
            sum += Number(element);
          });
          sums[index] = sum;
          return;
        }
        if (column.property =='PIECESBooked') {
          const values = data.map(item => Number(item.booked));
          let sum = 0;
          values.forEach(element => {
            if(isNaN(element)) {
              element = 0
            }
            sum += Number(element);
          });
          sums[index] = sum;
          return;
        }
        if (column.property =='PIECESInbound') {
          const values = data.map(item => Number(item.inbound));
          let sum = 0;
          values.forEach(element => {
            if(isNaN(element)) {
              element = 0
            }
            sum += Number(element);
          });
          sums[index] = sum;
          return;
        }
        if (data == null) {
          sums[index] = 0;
        } else {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return Number((prev + curr).toFixed(3));
              } else {
                return prev;
              }
            }, 0);
          }
        }

      });
      return sums;
    },
    sumExpectedQuantity(row){
      return row.items.reduce((total, item) => {
        // 若item.qty不存在，默认加0
        return total + (item.requested || 0);
      }, 0); // 初始值为0
    },
    sumActualQuantity(row){

      return row.items.reduce((total, item) => {
        // 若item.qty不存在，默认加0
        return total + (item.inbound || 0);
      }, 0); // 初始值为0
    },
    calculatePercentage(row){
      const expected = this.sumExpectedQuantity(row);
      const actual = this.sumActualQuantity(row);
      if (expected === 0) {
        return 0;
      }
      return Math.round((actual / expected) * 100);
    },
    calculateTotalVolume(row){
      if (!row.items || row.items.length === 0) {
        return 0;
      }
      return row.items.reduce((total, item) => {
        const volume = this.calculateVolume(item);
        return total + (volume ? Number(volume) : 0);
      }, 0).toFixed(3);
    },
    // 确认入库接收
    confirmInboundReceived() {
      // 调用后端接口确认入库
      this.confirmLoading = true;
      this.drawer = false
      this.task.jsonData = JSON.stringify({ comparisonResult: 'CONFIRMED' });
      updateTask(this.task).then((res) => {
        this.confirmLoading = false;
        this.showInboundReceivedConfirmation = false;
        this.$modal.msgSuccess('Inbound received confirmed successfully');
        this.taskDetailData = this.taskDetailData.filter(item => item.orderId != this.task.orderId);
        this.getList();
      }).catch(error => {
        this.confirmLoading = false;
        this.$modal.msgError('Failed to confirm inbound received');
      });
    },


  },
};
</script>
