<template>
  <div class="app-container" style="width:100%; margin: 0 auto;">


    <el-dialog title="Pre alert" width="1200px" :visible.sync="agentDialogVisible" class="bg-g">
      <el-form ref="agentDetailForm" :model="agentDetail">
        <el-card style="padding:10px;padding-bottom: 0px;margin-top: 10px;">
          <div><b style="font-size: 15px">Destination Agent</b></div>
          <br/>
          <el-row>
            <el-col :span="12">
              <el-form-item label="" prop="agent">
                <el-input :disabled="true" v-model="agentDetail.agent" autocomplete="off"
                          placeholder="Click + to Add"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <div style="float: right;">
                <div class="avatar-container" @mouseenter="showDeleteIn(id)" @mouseleave="showDeleteOut(id)"
                     v-for="(id,index) in selectedFollower" :key="id"
                     style="float: left;margin: 2px;width: 34px;height: 34px;position: relative; ">
                  <el-tooltip :content="agentMap[id]?agentMap[id].name:'-'" placement="top" effect="light">
                    <el-avatar :size="28">{{ (agentMap[id]?agentMap[id].name:"-").substring(0, 2) }}</el-avatar>
                  </el-tooltip>
                  <span v-if="showDelete[id]" @click="subFollower(id,index)" class="delete-button el-icon-close"
                        style="position: absolute;  top: -2px;  right: 0px;width: 12px;height: 12px;background-color: #858585;  border-radius: 10px;">
                  </span>
                </div>
                <el-button style="margin-top: 3px;margin-left: 3px;margin-bottom: 20px;" type="primary"
                           icon="el-icon-plus" circle @click="addRemoveFollower"></el-button>
              </div>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="padding:10px;padding-bottom: 0px;margin-top: 10px;">

          <div><b style="font-size: 15px">Free Time at POD</b></div>
          <br/>
          <el-row>
            <el-col :span="6">
              <span>Detention</span>
              <el-form-item label="" style="margin-top: 10px;" prop="detention">
                <el-input placeholder="Input" v-model="agentDetail.detention" clearable autocomplete="off"
                          @input="value => agentDetail.detention= Number(value.replace(/[^\d]/g,''))">
                  <template #suffix>Days</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="2">
              <span>Demurrage</span>
              <el-form-item label="" style="margin-top: 10px;" prop="dumurrage">
                <el-input placeholder="Input" v-model="agentDetail.dumurrage" clearable autocomplete="off"
                          @input="value => agentDetail.dumurrage= Number(value.replace(/[^\d]/g,''))">
                  <template #suffix>Days</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="padding:10px;padding-bottom: 0px;margin-top: 10px;">

          <div><b style="font-size: 15px">Destination Clearance</b></div>
          <br/>
          <el-row style="padding: 0px;">
            <el-col :span="6">
              <el-row>
                <span style="display: inline-block;width: 200px !important; ">Normal Customs Clearance</span>
                <el-switch style="margin-left: 10px;"
                           v-model="agentDetail.normalCustomsClearance"
                >
                </el-switch>
              </el-row>
              <el-row>
                <span style="display: inline-block;width: 200px !important; ">DA must pre-pay duties and tax</span>
                <el-switch style="margin-left: 10px;"
                           v-model="agentDetail.prePayDutiesAndTax"
                >
                </el-switch>
              </el-row>
              <el-form-item label="" prop="normalComments">
                <el-input placeholder="Input" v-model="agentDetail.normalComments" clearable autocomplete="off"
                          type="textarea" :autosize="{ minRows: 4}"></el-input>
              </el-form-item>

              <span style="width: 180px;">Taxes and duties to be billed to</span>
              <el-form-item prop="billedToList" style="margin-top: 10px;">
                <el-select v-model="agentDetail.taxesBillto" clearable filterable>
                  <el-option v-for="dict in billedToList" :key="dict.value" :label="dict.label" :value="dict.value"/>
                </el-select>
              </el-form-item>

              <span style="width: 180px;">Customs clearance to be billed to</span>
              <el-form-item prop="billedToList" style="margin-top: 10px;">
                <el-select v-model="agentDetail.customsBillto" clearable filterable>
                  <el-option v-for="dict in billedToList" :key="dict.value" :label="dict.label" :value="dict.value"/>
                </el-select>
              </el-form-item>


            </el-col>
            <el-col :span="2">
              <div class="dashed-border" style="border-right: 4px solid #e7e9ec;width: 50%;height: 280px;"> &nbsp</div>
            </el-col>
            <el-col :span="6">
              <el-row>
                <span style="width: 180px;">Fiscal-Customs Clearance</span>
                <el-switch style="margin-left: 10px;"
                           v-model="agentDetail.fiscalCustomsClearance"
                >
                </el-switch>
              </el-row>
              <el-row style="height: 10px;">

              </el-row>
              <el-form-item label="" style="margin-top: 21px;" prop="fiscalComments">
                <el-input placeholder="Input" v-model="agentDetail.fiscalComments" clearable autocomplete="off"
                          type="textarea" :autosize="{ minRows: 4}"></el-input>
              </el-form-item>


            </el-col>
            <el-col :span="2">
              <div class="dashed-border" style="border-right: 4px solid #e7e9ec;width: 50%;height: 140px;"> &nbsp</div>
            </el-col>
            <el-col :span="6">
              <el-row>
                <span style="width: 180px;">T1-Customs Clearance</span>
                <el-switch style="margin-left: 10px;" v-model="agentDetail.t1CustomsClearance">
                </el-switch>
              </el-row>
              <el-row style="height: 10px;">

              </el-row>
              <el-form-item label="" style="margin-top: 26px;" prop="t1Comments">
                <el-input placeholder="Input" v-model="agentDetail.t1Comments" clearable autocomplete="off"
                          type="textarea"
                          :autosize="{ minRows: 4}"></el-input>
              </el-form-item>

            </el-col>
          </el-row>
        </el-card>

        <el-card style="padding:10px;padding-bottom: 0px;margin-top: 10px;">
          <div><b style="font-size: 15px">Destination Delivery</b>
            <el-switch style="margin-left: 10px;"
                       v-model="agentDetail.destinationDelivery"
            >
            </el-switch>
          </div>
          <br/>
          <el-row>
            <el-col :span="6">
              <span style="width: 180px;">Destination address</span>
              <el-form-item label="" style="margin-top: 10px;" prop="destinationDeliveryComments">
                <el-input placeholder="Input" v-model="agentDetail.destinationDeliveryComments" clearable
                          autocomplete="off" type="textarea" :autosize="{ minRows: 4}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <div class="dashed-border" style="border-right: 4px solid #e7e9ec;width: 50%;height: 140px;"> &nbsp</div>
            </el-col>
            <el-col :span="6" style="margin-top: -30px;">
              <span style="width: 180px;">Transport Mode</span>
              <el-form-item prop="transportMode" style="margin-top: 10px;">
                <el-select v-model="agentDetail.transportMode" clearable filterable>
                  <el-option
                    v-for="dict in transportMode"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>

              <span style="width: 280px;">Destination delivery to be billed to</span>
              <el-form-item prop="billedToList" style="margin-top: 10px;">
                <el-select v-model="agentDetail.destinationDeliveryBillto" clearable filterable>
                  <el-option v-for="dict in billedToList" :key="dict.value" :label="dict.label" :value="dict.value"/>
                </el-select>
              </el-form-item>

              <el-row style="margin:0px;padding: 0px;">
                <el-col :span="16">
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="2">
              <div class="dashed-border" style="border-right: 4px solid #e7e9ec;width: 50%;height: 140px;"> &nbsp</div>
            </el-col>
            <el-col :span="6">
              <span style="width: 280px;">Agreed Cost</span>

              <el-form-item label="" style="margin-top: 10px;" prop="agreedCostDelivery">
                <el-input placeholder="Input" v-model="agentDetail.agreedCostDelivery" clearable autocomplete="off"
                          type="textarea"
                          :autosize="{ minRows: 4}"></el-input>
              </el-form-item>

            </el-col>
          </el-row>
        </el-card>


        <el-card style="padding:10px;padding-bottom: 0px;margin-top: 10px;">
          <div><b style="font-size: 15px">Destination Local Charges</b>
          </div>
          <br/>
          <el-row>
            <el-col :span="6">
              <span style="width: 280px;">Agreed Cost</span>

              <el-form-item label="" style="margin-top: 10px;" prop="agreedCost">
                <el-input placeholder="Input" v-model="agentDetail.agreedCost" clearable autocomplete="off"
                          type="textarea" :autosize="{ minRows: 4}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <div class="dashed-border" style="border-right: 4px solid #e7e9ec;width: 50%;height: 140px;"> &nbsp</div>
            </el-col>
            <el-col :span="6">
              <span style="width: 180px;">Destination Local Charges to be Billed</span>
              <el-form-item prop="billedToList" style="margin-top: 10px;">
                <el-select v-model="agentDetail.destinationBillto" clearable filterable>
                  <el-option
                    v-for="dict in billedToList"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>
        </el-card>


        <el-card style="padding:10px;padding-bottom: 10px;margin-top: 10px;">
          <div><b style="font-size: 15px">Comments to agent</b></div>
          <br/>
          <el-form-item label="" prop="comments">
            <el-input placeholder="Input" v-model="agentDetail.comments" clearable autocomplete="off" type="textarea"
                      :autosize="{ minRows: 4}"></el-input>
          </el-form-item>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">

        <!-- <span style="margin-right: 10px;display:inline-block"><el-checkbox v-model="agentDetail.takeDocument" >Send Email With HBL's and MBL's</el-checkbox></span> -->

        <el-button @click="agentDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitAgentDetail">Submit</el-button>
      </div>
    </el-dialog>

    <el-dialog width="50%" title="Add/Remove Participant" :visible.sync="followerDialogVisible">
      <div>
        <el-input @input="getAllFollowers" clearable style="width:200px;margin-right:20px" v-model="followerPage.name"/>
        <el-button @click="getAllFollowers" type="primary">Search<i class="el-icon-search el-icon--right"></i>
        </el-button>
      </div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-table :data="noSelectedFollower" style="width: 100%">
            <el-table-column width="80">
              <template v-slot="scope">
                <a style="float:left" @click="addFollower(scope.row,scope.$index)">
                  <svg width="30" height="30" viewBox="0 0 48 48"
                       fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="6" width="36" height="36" rx="3" fill="#2F88FF" stroke="#444" stroke-width="4"
                          stroke-linejoin="bevel"/>
                    <path d="M24 16V32" stroke="#FFF" stroke-width="4" stroke-linecap="square"
                          stroke-linejoin="bevel"/>
                    <path d="M16 24L32 24" stroke="#FFF" stroke-width="4" stroke-linecap="square"
                          stroke-linejoin="bevel"/>
                  </svg>
                </a>
              </template>
            </el-table-column>
            <el-table-column prop="DestinationAgent" label="Destination Agent">
              <template v-slot="scope">
                {{ agentMap[scope.row]?agentMap[scope.row].name:"-" }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">

          <el-table :data="selectedFollower" style="width: 100%">
            <el-table-column width="55">
              <template v-slot="scope">
                <a @click="subFollower(scope.row,scope.$index)">
                  <svg width="30" height="30" viewBox="0 0 48 48" fill="none"
                       xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="6" width="36" height="36" rx="3" fill="#2F88FF" stroke="#444" stroke-width="4"
                          stroke-linejoin="bevel"/>
                    <path d="M16 24L32 24" stroke="#FFF" stroke-width="4" stroke-linecap="square"
                          stroke-linejoin="bevel"/>
                  </svg>
                </a>
              </template>
            </el-table-column>
            <el-table-column prop="DestinationAgent" label="Destination Agent">
              <template v-slot="scope">
                {{ agentMap[scope.row]?agentMap[scope.row].name:"-" }}
              </template>
            </el-table-column>

          </el-table>
        </el-col>
        <el-col style="margin-top:10px;text-align:center">
          <el-button @click="followerDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitFollowerChange">Submit</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog width="80%" title="Add/Remove SO" :visible.sync="addRemoveSOVisible" v-loading="addRemoveSoLoading">
      <div style="margin-bottom:10px">
        <el-input style="width:200px;margin-right:20px" v-model="soQueryParams.salesOrderNumber"/>
        <el-button @click="soQueryParams.pageNo=1;getSO()" type="primary">Search<i
          class="el-icon-search el-icon--right"></i></el-button>
      </div>
      <el-row :gutter="30">
        <el-col :span="24">
          <!-- soQueryParams:{
        pageNo: 1,
        pageSize: 10,
      }, -->
          <SOMainTable @addSO="addSO" :showPlusIcon="true" :tableData="soTableData" ref="table"
                       :tableHeight="600"></SOMainTable>
          <pagination :total="soQueryParams.total" :page.sync="soQueryParams.pageNo"
                      :limit.sync="soQueryParams.pageSize" :page-sizes="[10, 20, 50]" @pagination="getSO"/>
        </el-col>

      </el-row>
    </el-dialog>

    <el-dialog
      title="VGM"
      width="80%"
      destroy-on-close
      :visible.sync="sinotransVGMVisable" v-if="sinotransVGMVisable">
      <SinotransVGM :shipmentVgmDOS="shipment.shipmentVgmDOS" v-if="sinotransVGMVisable"
                    :containerDOList="shipment.containerDOList"
                    :shippedContainer="shippedContainer" :showWoColumn="shipment.carrier !== 'TSHG'"
                    :shipmentId="shipment.id"
                    :name="shipment.name"
                    :noVgmEdi="shipment.noVgmEdi"
                    @submitSinotransVGM="submitSinotransVGM"></SinotransVGM>
    </el-dialog>

    <el-dialog title="Request new HS code" width="500px" :visible.sync="applyHsCodeVisable">
      <el-form ref="hsCodeForm" :model="hsCode">
        <el-form-item required label="HS code" label-width="120px">
          <el-input v-model="hsCode.hsCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item required label="Description" label-width="120px">
          <el-input v-model="hsCode.productEnglishName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="applyHsCodeVisable = false">Cancel</el-button>
        <el-button type="primary" @click="submitHsCode">Submit</el-button>
      </div>
    </el-dialog>
    <el-dialog width="80%" title="Add/Remove PO" :visible.sync="addRemovePOVisible">
      <div>
        <el-input style="width:200px;margin-right:20px" v-model="pbPage.orderNumber"/>
        <el-button @click="getAllBookings" type="primary">Search<i class="el-icon-search el-icon--right"></i>
        </el-button>
      </div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-table :data="pbTable" style="width: 100%">
            <el-table-column width="80">
              <template v-slot="scope">
                <a style="float:left" @click="addPo(scope.row)">
                  <svg width="30" height="30" viewBox="0 0 48 48"
                       fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="6" width="36" height="36" rx="3" fill="#2F88FF" stroke="#444" stroke-width="4"
                          stroke-linejoin="bevel"/>
                    <path d="M24 16V32" stroke="#FFF" stroke-width="4" stroke-linecap="square"
                          stroke-linejoin="bevel"/>
                    <path d="M16 24L32 24" stroke="#FFF" stroke-width="4" stroke-linecap="square"
                          stroke-linejoin="bevel"/>
                  </svg>
                </a>
                <svg style="float:left" v-show="selectIds.indexOf(scope.row.id) > -1" width="20" height="20"
                     viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M43 11L16.875 37L5 25.1818" stroke="#444" stroke-width="4" stroke-linecap="square"
                        stroke-linejoin="bevel"/>
                </svg>
              </template>
            </el-table-column>
            <el-table-column prop="bookingNumber" label="PB MOOV Ref" width="170">
            </el-table-column>
            <el-table-column prop="shipmentName" label="Shipment Name" width="170">
            </el-table-column>
            <el-table-column prop="name" label="PO Items">
              <template v-slot="scope">

                <p v-for="item in scope.row.orderItemList" :key="item.id">
                  <el-row :gutter="20">
                    <el-col :span="8">{{ item.orderNumber }}</el-col>
                    <el-col :span="8" :title="item.productName" style="  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;">{{ item.productName }}
                    </el-col>
                    <el-col :span="8">{{ item.productCode }}</el-col>
                  </el-row>
                </p>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="pbPage.total > 0" :total="pbPage.total" :page.sync="pbPage.pageNo"
                      :limit.sync="pbPage.pageSize" :page-sizes="[10, 20, 50]" @pagination="getAllBookings"/>
        </el-col>
        <el-col :span="12">

          <el-table :data="selectedTable" style="width: 100%">
            <el-table-column width="55">
              <template v-slot="scope">
                <a @click="subPo(scope.$index)">
                  <svg width="30" height="30" viewBox="0 0 48 48" fill="none"
                       xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="6" width="36" height="36" rx="3" fill="#2F88FF" stroke="#444" stroke-width="4"
                          stroke-linejoin="bevel"/>
                    <path d="M16 24L32 24" stroke="#FFF" stroke-width="4" stroke-linecap="square"
                          stroke-linejoin="bevel"/>
                  </svg>
                </a>
              </template>
            </el-table-column>
            <el-table-column prop="bookingNumber" label="PB MOOV Ref" width="180">
            </el-table-column>
            <el-table-column prop="shipmentName" label="Shipment Name" width="180">
            </el-table-column>
            <el-table-column prop="name" label="PO Items">
              <template v-slot="scope">

                <p v-for="item in scope.row.orderItemList" :key="item.id">
                  <el-row :gutter="20">
                    <el-col :span="8">{{ item.orderNumber }}</el-col>
                    <el-col :span="8" :title="item.productName" style="  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;">{{ item.productName }}
                    </el-col>
                    <el-col :span="8">{{ item.productCode }}</el-col>
                  </el-row>
                </p>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col style="margin-top:10px;text-align:center">
          <el-button @click="addRemovePOVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitPoChange">Submit</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog width="50%" title="Add/Remove Container" :visible.sync="addRemoveContainerVisible">
      <div>
        <el-input @input="getAllContainers" clearable style="width:200px;margin-right:20px"
                  v-model="containerPage.containerNo"/>
        <el-button @click="getAllContainers" type="primary">Search<i class="el-icon-search el-icon--right"></i>
        </el-button>
      </div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-table :data="noSelectedContainer" style="width: 100%">
            <el-table-column width="80">
              <template v-slot="scope">
                <a style="float:left" @click="addContainer(scope.row,scope.$index)">
                  <svg width="30" height="30" viewBox="0 0 48 48"
                       fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="6" width="36" height="36" rx="3" fill="#2F88FF" stroke="#444" stroke-width="4"
                          stroke-linejoin="bevel"/>
                    <path d="M24 16V32" stroke="#FFF" stroke-width="4" stroke-linecap="square"
                          stroke-linejoin="bevel"/>
                    <path d="M16 24L32 24" stroke="#FFF" stroke-width="4" stroke-linecap="square"
                          stroke-linejoin="bevel"/>
                  </svg>
                </a>
                <!-- <svg style="float:left" v-show="selectIds.indexOf(scope.row.id) > -1" width="20" height="20"
                  viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M43 11L16.875 37L5 25.1818" stroke="#444" stroke-width="4" stroke-linecap="square"
                    stroke-linejoin="bevel" />
                </svg> -->
              </template>
            </el-table-column>
            <el-table-column prop="containerNo" label="Container No">
              <template v-slot="scope">
                {{ scope.row }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">

          <el-table :data="selectedContainer" style="width: 100%">
            <el-table-column width="55">
              <template v-slot="scope">
                <a @click="subContainer(scope.row,scope.$index)">
                  <svg width="30" height="30" viewBox="0 0 48 48" fill="none"
                       xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="6" width="36" height="36" rx="3" fill="#2F88FF" stroke="#444" stroke-width="4"
                          stroke-linejoin="bevel"/>
                    <path d="M16 24L32 24" stroke="#FFF" stroke-width="4" stroke-linecap="square"
                          stroke-linejoin="bevel"/>
                  </svg>
                </a>
              </template>
            </el-table-column>
            <el-table-column prop="containerNo" label="Container No">
              <template v-slot="scope">
                {{ scope.row }}
              </template>
            </el-table-column>

          </el-table>
        </el-col>
        <el-col style="margin-top:10px;text-align:center">
          <el-button @click="addRemoveContainerVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitContainerChange">Submit</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog title="Booking Status" :visible.sync="dialogFormAccept" @closed="onBookingCancel" width="500px">
      <el-form :model="form" :show-message="false">
        <el-form-item label="Booking Number" :label-width="formLabelWidth" prop="bookingNum" :required="acceptRequired">
          <el-input v-model="form.bookingNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Receipt/Confirmation" :label-width="formLabelWidth" prop="dateValue"
                      :required="acceptRequired">
          <el-date-picker v-model="form.dateValue" type="date" value-format="yyyy-MM-dd HH:mm:ss"
                          :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="onBookingCancel">Cancel</el-button>
        <el-button type="primary" @click="openAccept" :loading="loadingAcceptConfirm" :disabled="loadingAcceptConfirm">Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Booking Status" :visible.sync="dialogFormEvents"  width="500px">
      <el-form :model="form" :show-message="false">
        <el-form-item label="Events Date" :label-width="formLabelWidth" prop="dateValue"
                      :required="acceptRequired">
          <el-date-picker v-model="form.dateValue" type="date" value-format="yyyy-MM-dd HH:mm:ss"
                          :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormEvents = false">Cancel</el-button>
        <el-button type="primary" @click="openAccept" :loading="loadingEventsConfirm">Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog title="BL Sample" :visible.sync="dialogBLType" :fullscreen="true">
      <div style="height: 800px; overflow-y: auto; overflow-x: hidden">
        <iframe style="width: 100%; height: 1000%;" :src="sampleUrl"></iframe>
      </div>
    </el-dialog>


    <el-dialog title="Shipping Instructions" :visible.sync="visableSI" width="100%" :fullscreen="true" append-to-body class="bg-g">

      <el-tag class="tab-title">
        Booking Number : {{ shipment.shipmentBookingNumber }}
      </el-tag>
      <el-dialog title="Container" :visible.sync="visableSIContainer" width="700px" append-to-body>
        <el-descriptions style="margin-bottom: 15px" :colon="false" direction="vertical" class="margin-top" title="" :column="3">
          <el-descriptions-item label="Container Type">
            <el-select @change="changeContainerType(containerForm)" clearable v-model="containerForm.containerType">
              <el-option v-for="dict in containerTypeList" :key="dict.type" :label="dict.type" :value="dict.type"/>
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item label="Container No">
            <el-input v-model="containerForm.containerNo"/>
          </el-descriptions-item>

          <el-descriptions-item label="Container Seal Number">
            <el-input v-model="containerForm.containerSealNumber"/>
          </el-descriptions-item>
        </el-descriptions>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitContainer">{{
            $t("purchaseOrder.confirm")
            }}
          </el-button>
          <el-button @click="cancelContainer">{{
            $t("purchaseOrder.cancel")
            }}
          </el-button>
        </div>
      </el-dialog>
      <el-form ref="siForm" :model="siForm" label-width="210px" label-position="right" :show-message="false">

        <div style="overflow-y: auto; overflow-x: hidden;background:#f3f5f8">

          <el-card style="padding:10px;margin-top: 15px;padding-bottom: 5px">
            <el-row :gutter="20">
              <el-col :span="8">
                <div style="text-indent: 10px;margin-bottom:8px">
                  <b style="font-size: 15px">BL Type</b>
                </div>
                <el-card style="height: 150px;padding: 20px">
                  <el-form-item required prop="blType" style="border: none;width:100%" label-width="0">
                    <el-radio-group v-model="siForm.blType" @change="changeBl">
                      <el-row :gutter="20">
                        <el-col :span="14" style="padding-left: 20px">
                          <el-radio style="padding-bottom: 15px;width: 100%;"
                                    v-for="dict in getDictDatas(DICT_TYPE.BL_TYPE).filter((item, index) => {return index < 2; })"
                                    :key="dict.value" :label="dict.label"></el-radio>
                          <!-- <el-radio  style="padding-bottom: 15px;" label="Original" >ORIGINAL</el-radio>
                      <el-radio  style="padding-bottom: 15px;" label="Telex Release" >SEAWAY B/L  </el-radio> -->
                        </el-col>
                        <el-col :span="6">
                          <el-radio style="padding-bottom: 15px;width: 100%;"
                                    v-for="dict in getDictDatas(DICT_TYPE.BL_TYPE).filter((item, index) => {return index >= 2; })"
                                    :key="dict.value" :label="dict.label"></el-radio>
                          <!-- <el-radio  style="padding-bottom: 15px;" label="SeaWayB/L" >TELEX RELEASE  </el-radio> -->
                        </el-col>
                      </el-row>
                    </el-radio-group>
                  </el-form-item>
                </el-card>
              </el-col>
              <el-col :span="8">
                <div style="text-indent: 10px;margin-bottom:8px">
                  <b style="font-size: 15px">B/L Samples</b>
                </div>
                <el-card style="height: 150px;padding: 20px">
                  <el-form-item required prop="blSamples" style="border: none;width:100%" label-width="0">
                    <el-radio-group v-model="siForm.blSamples" @change="changeBl">
                      <el-row :gutter="20">
                        <el-col :span="14" style="padding-left: 20px">
                          <el-radio style="padding-bottom: 15px;width: 100%;" label="CARGO Details">CARGO Details
                          </el-radio>
                          <el-radio style="padding-bottom: 15px;width: 100%;" label="CARGO Summary II">CARGO Summary
                            II
                          </el-radio>
                        </el-col>
                        <el-col :span="6">
                          <el-radio style="padding-bottom: 15px;width: 100%;" label="CARGO Summary I">CARGO Summary I
                          </el-radio>
                          <el-radio style="padding-bottom: 15px;width: 100%;" label="CARGO Summary">CARGO Summary
                          </el-radio>
                        </el-col>
                      </el-row>
                    </el-radio-group>
                  </el-form-item>
                  <el-button @click="viewBlSample(siForm.blSamples)" type="primary"
                             style="margin-left: 15px;padding: 5px;margin-bottom: 10px;">View Samples
                  </el-button>
                </el-card>
              </el-col>
              <el-col :span="8">
                <div style="text-indent: 10px;margin-bottom:8px">
                  <b style="font-size: 15px">SI Remark To Carrier</b>
                </div>
                <el-card style="padding:15px!important;height: 150px" :colon="false" class="margin-top parties-desc"
                         title="" :column="1" size="mini">
                  <el-form-item required prop="siRemark" style="width:100%" label-width="0">
                    <el-input type="textarea" v-model="siForm.siRemark" placeholder="" maxlength="500" show-word-limit
                              :rows="6"
                              @input="siForm.siRemark = filterChinese(siForm.siRemark)"/>
                  </el-form-item>
                </el-card>
              </el-col>
            </el-row>
          </el-card>


          <el-card style="padding:15px;margin-top: 15px;">

            <el-row :gutter="20">
              <el-col :span="8">
                <div style="text-indent: 10px;margin-bottom:8px">
                  <b style="font-size: 15px">Shipper</b>
                </div>
                <el-descriptions style="padding:10px!important;padding-bottom: 5px;border-radius: 10px;" :colon="false"
                                 class="margin-top parties-desc" title="" :column="1" size="mini">
                  <el-descriptions-item>
                    <template slot="label">
                      <span style="width: 64px; ">Name</span>
                    </template>
                    <el-select
                      filterable
                      clearable
                      v-model="siForm.shipper"
                    >
                      <el-option
                        v-for="item in parties['Shipper']"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                      >
                      </el-option>
                    </el-select>
                  </el-descriptions-item>


                  <el-descriptions-item>
                    <template slot="label">
                      <span style="width: 64px; ">Address</span>
                    </template>
                    <div style="padding:6.5px 0px;">
                      {{ partiesMap[siForm.shipper] ? partiesMap[siForm.shipper].address : "" }}
                    </div>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <span style="width: 64px; ">Phone</span>
                    </template>
                    <div style="padding:6.5px 0px">
                      {{ partiesMap[siForm.shipper] ? partiesMap[siForm.shipper].phone : "" }}
                    </div>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <span style="width: 64px; ">Fax</span>
                    </template>
                    <div style="padding:6.5px 0px">
                      {{ partiesMap[siForm.shipper] ? partiesMap[siForm.shipper].fax : "" }}
                    </div>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <span style="width: 64px; ">Email</span>
                    </template>
                    <div style="padding:6.5px 0px">
                      {{ partiesMap[siForm.shipper] ? partiesMap[siForm.shipper].email : "" }}
                    </div>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <span style="width: 64px; ">Enterprise</span>
                    </template>
                    <div style="padding:6.5px 0px">
                      {{ partiesMap[siForm.shipper] ? partiesMap[siForm.shipper].companyUsci : "" }}
                    </div>
                  </el-descriptions-item>

                </el-descriptions>
              </el-col>
              <el-col :span="8">
                <div style="text-indent: 10px;margin-bottom:8px">
                  <b style="font-size: 15px">Consignee</b>
                </div>
                <el-descriptions style="padding:10px!important;padding-bottom: 5px;border-radius: 10px;" :colon="false"
                                 class="margin-top parties-desc" title="" :column="1" size="mini">

                  <el-descriptions-item>
                    <template slot="label">
                      <span style="width: 64px; ">Name</span>
                    </template>
                    <el-select
                      remote
                      clearable
                      filterable
                      v-model="siForm.consignee"
                    >
                      <el-option
                        v-for="item in parties['Consignee']"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                      >
                      </el-option>
                    </el-select>

                  </el-descriptions-item>

                  <el-descriptions-item>
                    <template slot="label">
                      <span style="width: 64px; ">Address</span>
                    </template>
                    <div style="padding:6.5px 0px">
                      {{ partiesMap[siForm.consignee] ? partiesMap[siForm.consignee].address : "" }}
                    </div>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <span style="width: 64px; ">Phone</span>
                    </template>
                    <div style="padding:6.5px 0px">
                      {{ partiesMap[siForm.consignee] ? partiesMap[siForm.consignee].phone : "" }}
                    </div>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <span style="width: 64px; ">Fax</span>
                    </template>
                    <div style="padding:6.5px 0px">
                      {{ partiesMap[siForm.consignee] ? partiesMap[siForm.consignee].fax : "" }}
                    </div>
                  </el-descriptions-item>

                  <el-descriptions-item>
                    <template slot="label">
                      <span style="width: 64px; ">Email</span>
                    </template>
                    <div style="padding:6.5px 0px">
                      {{ partiesMap[siForm.consignee] ? partiesMap[siForm.consignee].email : "" }}
                    </div>
                  </el-descriptions-item>

                  <el-descriptions-item>
                    <template slot="label">
                      <span style="width: 64px; ">Enterprise</span>
                    </template>
                    <div style="padding:6.5px 0px">
                      {{ partiesMap[siForm.consignee] ? partiesMap[siForm.consignee].companyUsci : "" }}
                    </div>
                  </el-descriptions-item>
                </el-descriptions>

              </el-col>
              <el-col :span="8">
                <div style="text-indent: 10px;margin-bottom:8px">
                  <b style="font-size: 15px">Notify Party</b>
                </div>
                <el-descriptions style="padding:10px!important;padding-bottom: 5px;border-radius: 10px;" :colon="false"
                                 class="margin-top parties-desc" title="" :column="1" size="mini">
                  <el-descriptions-item>
                    <template slot="label">
                      <span style="width: 64px; ">Name</span>
                    </template>
                    <el-select
                      remote
                      clearable
                      filterable
                      v-model="siForm.notifyParty"
                    >
                      <el-option
                        v-for="item in parties['Notify Party']"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                      >
                      </el-option>
                    </el-select>
                  </el-descriptions-item>

                  <el-descriptions-item>
                    <template slot="label">
                      <span style="width: 64px; ">Address</span>
                    </template>
                    <div style="padding:6.5px 0px">
                      {{ partiesMap[siForm.notifyParty] ? partiesMap[siForm.notifyParty].address : "" }}
                    </div>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <span style="width: 64px; ">Phone</span>
                    </template>
                    <div style="padding:6.5px 0px">
                      {{ partiesMap[siForm.notifyParty] ? partiesMap[siForm.notifyParty].phone : "" }}
                    </div>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <span style="width: 64px; ">Fax</span>
                    </template>
                    <div style="padding:6.5px 0px">
                      {{ partiesMap[siForm.notifyParty] ? partiesMap[siForm.notifyParty].fax : "" }}
                    </div>
                  </el-descriptions-item>

                  <el-descriptions-item>
                    <template slot="label">
                      <span style="width: 64px; ">Email</span>
                    </template>
                    <div style="padding:6.5px 0px">
                      {{ partiesMap[siForm.notifyParty] ? partiesMap[siForm.notifyParty].email : "" }}
                    </div>
                  </el-descriptions-item>

                  <el-descriptions-item>
                    <template slot="label">
                      <span style="width: 64px; ">Enterprise</span>
                    </template>
                    <div style="padding:6.5px 0px">
                      {{ partiesMap[siForm.notifyParty] ? partiesMap[siForm.notifyParty].companyUsci : "" }}
                    </div>
                  </el-descriptions-item>

                </el-descriptions>

              </el-col>
            </el-row>
          </el-card>


          <el-card style="padding:15px;margin-top: 15px;">
            <div v-if="SOProductList.length>0" style="margin-bottom: 10px;">
              <div  style="text-indent: 0px;margin-bottom:8px">
                <b style="font-size: 15px">Cargo Info</b>
              </div>
              <el-table  class="SOProduct" :data="SOProductList" style="width: 100%;" border show-summary
                        :summary-method="getSummaries">
                <el-table-column prop="soRef" label="SO Ref" width="130px">
                  <template v-slot="{ row, $index }">
                    <el-link v-show="!shipment.fromShipperBooking" type="primary" target="_blank"
                      :href="'/shipment/shippingBookingDetail?id='+spo.id">{{ spo.soRef }}</el-link>
                    <el-link v-show="shipment.fromShipperBooking" type="primary" target="_blank" :href="'/shipment/ppshippingOrderDetail?id='+row.soId">{{
                      row.soRef }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="productEnglishName" label="Product English Name">
                </el-table-column>
                <!-- <el-table-column prop="productChineseName" label="product Chinese Name">
                </el-table-column> -->
                <el-table-column prop="hscode" label="Hs code" width="90px">
                </el-table-column>
                <el-table-column prop="numberOfPackages" label="Number Of Packages" width="130px">
                </el-table-column>
                <el-table-column prop="packages" label="Packages" width="90px">
                </el-table-column>
                <el-table-column prop="grossWeight" label="GrossWeight(KG)" width="110px">
                </el-table-column>
                <el-table-column prop="volume" label="volume(CBM)" width="110px">
                </el-table-column>

                <el-table-column v-if="spoList.length>0&& SOType=='LCL'" prop="numberOfPackagesAll"
                                 label="Number Of Packages Can Allocate">
                  <template v-slot="{ row, $index }">
                    <div :class="getInputStrClassNumberOfPackages(row)"> {{ row.numberOfPackagesAll }}</div>
                  </template>
                </el-table-column>
                <el-table-column v-if="spoList.length>0&& SOType=='LCL'" prop="grossWeightAll"
                                 label="Gross Weight Can Allocate(KG)">
                  <template v-slot="{ row, $index }">
                    <div :class="getInputStrClassGrossWeight(row)"> {{ row.grossWeightAll }}</div>
                  </template>
                </el-table-column>
                <el-table-column v-if="spoList.length>0&& SOType=='LCL'" prop="volumeAll"
                                 label="Volume Can Allocate(CBM)">
                  <template v-slot="{ row, $index }">
                    <div :class="getInputStrClassVolume(row)"> {{ row.volumeAll }}</div>
                  </template>
                </el-table-column>
              </el-table>

            </div>

                    <div v-show="spoItems&&spoItems.length>0">
                      <div style="text-indent: 0px;margin-bottom:8px">
                        <b style="font-size: 15px">Cargo Info</b>
                      </div>
                      <el-table style="margin-bottom:10px" border v-if="spoItems&&spoItems.length > 0" :data="spoItems">
                        <el-table-column prop="soRef" label="SO Number">
                          <template v-slot="scope">
                            <el-link type="primary" target="_blank" :href="'/shipment/ppshippingOrderDetail?id='+scope.row.id">
                              <span>{{ scope.row.soRef }}</span>
                            </el-link>
                          </template>
                        </el-table-column>
                        <!-- <el-table-column prop="orderId" label="Order Number">
                          <template v-slot="scope">
                            <span>{{ scope.row.orderNumber }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="productId" label="Item Number">
                          <template v-slot="scope">
                            <span>{{
                              scope.row.productCode
                              }}</span>
                          </template>
                        </el-table-column> -->
                        <el-table-column prop="productId" label="Product Name">
                          <template v-slot="scope">
                            <span>{{ scope.row.productName }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="hsCode" label="HS Code" min-width="110">
                          <template v-slot="scope">
                            <span>{{ scope.row.hscode }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="markNumbers" label="Marks & Numbers">
                           <template v-slot="scope">
                              <span>{{ scope.row.markNumbers }}</span>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="requested" :label="'Ordered (Cartons)'">
                          <template v-slot="scope">
                            {{ scope.row.outerQty }}
                          </template>
                        </el-table-column> -->
                        <el-table-column prop="bookedQty" :label="'Booked (Cartons)'">
                          <template v-slot="scope">
                            {{ scope.row.booked }}
                          </template>
                        </el-table-column>

                        <el-table-column prop="totalWeight" :label="'Total Weight (KG)'">
                          <template v-slot="scope">
                            {{ scope.row.bookedWeight }}
                          </template>
                        </el-table-column>
                        <el-table-column prop="totalVolume" :label="'Total Volume (CBM)'">
                          <template v-slot="scope">
                            {{ scope.row.bookedVolume }}
                          </template>
                        </el-table-column>

                      </el-table>
                      <!--  加汇总和带入按钮 -->

                      <div style="text-align: right;margin-top: 8px; ">
                        <span style="margin-right:20px">
                          Total Booked Cartons：{{ totalAllBooked() }}
                        </span>
                        <span style="margin-right:20px">
                          Total Gross Weight：{{ totalAllGrossWeight().toFixed(3) }}
                        </span>
                        <span style="margin-right:20px">
                          Total Volume：{{ totalAllVolume().toFixed(3) }}
                        </span>
                      </div>
                    </div>


            <div>
              <el-upload ref="upload" :show-file-list="false" :on-change="beforeUploadContainers" :auto-upload="false"
                         action="#"
                         accept=".xlsx,.xls" size="mini" class="button-row">
                <i
                  style="font-weight: 700 !important;font-size: 12px;color:#004F7C;  margin-bottom: 15px;  margin-right: 15px;cursor: pointer;"
                  class="el-icon-upload2" size="mini" type="primary">Upload Containers</i>
              </el-upload>
              <i style="font-weight: 700 !important;font-size: 12px;color:#004F7C;  margin-right: 15px;cursor: pointer;"
                 @click="downloadImportTemplate()"
                 class="el-icon-download">Import Template</i>
            </div>
            <div v-hasPermi="['system:hs-code:apply']" style="margin-bottom:10px">
              <el-button @click="applyNewHsCode" type="primary">Request new HS code</el-button>
            </div>
            <el-table :data="siForm.containers" style="width: 100%"  default-expand-all>

              <el-table-column type="expand">
                <template slot-scope="scope">
                  <div style="margin-left:50px">
                    <el-descriptions style="margin-bottom:0px;box-shadow: none!important;border:none!important"
                                     :colon="false" direction="vertical" v-for="(item, index) in scope.row.productData"
                                     :key="'product' + index" class="margin-top" title=""
                                     :column="7">

                      <el-descriptions-item :label="index == 0 ? $t('booking.productEnglishName') : ''">
                        <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2 }"
                                  v-model="item.productEnglishName"
                                  maxlength="500" show-word-limit
                                  @input="item.productEnglishName = filterChinese(item.productEnglishName)"/>
                      </el-descriptions-item>
                      <el-descriptions-item :label="index == 0 ? $t('booking.hsCode') : ''">
                        <el-select filterable clearable remote v-model="item.hscode" :remote-method="remoteGetHsCode"
                                   @change="selectBlur(item)">
                          <el-option v-for="dict in hsCodeList" :key="dict.hsCode" :label="dict.hsCode"
                                     :value="dict.hsCode"/>
                        </el-select>
                      </el-descriptions-item>
                      <el-descriptions-item v-if="shipment.fromShipperBooking&&shipment.containerDOList.filter(
                        (item) =>   item.type == 4
                      ).length>0" :label="index == 0 ? 'HS Code(Supplier)' : ''">
                        <el-input v-model="item.hscodeSupplier" disabled />
                      </el-descriptions-item>
                      <el-descriptions-item :label="index == 0 ? 'Number Of Packages' : ''">
                        <el-input-number
                          @change="numberOfPackagesChange(item)"
                          v-model="item.numberOfPackages" :controls="false" :precision="0"/>
                      </el-descriptions-item>
                      <el-descriptions-item :label="index == 0 ? 'Packages' : ''">
                        <el-select filterable v-model="item.packages" placeholder="">
                          <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value"
                                     :label="dict.label" :value="dict.value"/>
                        </el-select>
                      </el-descriptions-item>
                      <el-descriptions-item :label="index == 0 ? 'Gross Weight(KG)' : ''">
                        <el-input-number
                          @change="grossWeightChange(item)"
                          v-model="item.grossWeight" :precision="3" :controls="false"/>
                      </el-descriptions-item>
                      <el-descriptions-item :label="index == 0 ? 'Volume(CBM)' : ''">
                        <el-input-number
                          @change="volumeChange(item)"
                          v-model="item.volume" :precision="3" :controls="false"/>
                      </el-descriptions-item>
                      <el-descriptions-item>
                        <template slot="label">
                          <el-button v-if="index == 0" type="text" @click="addProduct2(scope.row.productData)"><i
                            class="el-icon-plus"></i>Add
                            Product
                          </el-button>
                        </template>
                        <el-button size="mini" type="text" icon="el-icon-delete"
                                   @click="handleDelete(scope.row.productData, index)">{{ $t("search.delete") }}
                        </el-button>
                      </el-descriptions-item>
                    </el-descriptions>
                    <div style="width:100%;margin-top: 10px;margin-left: 10px; ">
                      <el-row>
                        <el-col :span="6">
                          <b>Total Gross Weight:</b>
                          {{ sumGrossWeight(scope.row) }}
                        </el-col>
                        <el-col :span="6">
                          <b>Total CBM:</b>
                          {{ scope.row.productData.reduce((sum, item) => sum + (Number(item?.volume) || 0),
                          0).toFixed(3)
                          }}
                        </el-col>
                        <el-col :span="6">
                          <b>Total Number of Packages:</b>
                          {{ scope.row.productData.reduce((sum, item) => sum + (Number(item?.numberOfPackages) || 0), 0)
                          }}
                        </el-col>
                      </el-row>
                    </div>
                  </div>


                </template>
              </el-table-column>

              <el-table-column prop="date" label="SOC" width="180">
                <template v-slot="scope">
                  <el-checkbox v-model="scope.row.soc"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="Container Type" prop="containerType" width="180">
              </el-table-column>
              <el-table-column label="Sub Container">
                <template v-slot="scope">
                  <el-select v-model="scope.row.subContainerType" clearable filterable>
<!--                             @change="(value) => subContainerTypeChange(i, value)">-->
<!--                    <el-option v-for="item in containerTypeList" :label="item.type" :value="item.type"-->
<!--                               :key="item.type"></el-option>-->
                    <el-option label="Yes" value="Yes"></el-option>
                  </el-select>
                </template>
              </el-table-column>
             <!-- <el-table-column label="Sub Container Type"  prop="subContainerType" >
               <template v-slot="scope">
                 <el-select v-model="scope.row.subContainerType" clearable filterable   placeholder="Yes/No">
                   <el-option label="Yes" value="Yes"></el-option>
                   <el-option label="No" value="No"></el-option>
                 </el-select>
               </template>
             </el-table-column> -->


              <el-table-column label="Container No">
                <template v-slot="scope">
                  <el-input v-model="scope.row.containerNo"/>
                  <!-- <el-select v-if="shipment.carrier == 'TSHG'" clearable filterable remote v-model="scope.row.containerNo"
                    placeholder="" :remote-method="remoteContainerNo" @focus="handleContainerChange(scope.row)"
                    :loading="loadingSelect">
                    <el-option v-for="item in containerOptions" :key="item.id" :label="item.containerNo"
                      :value="item.containerNo">
                    </el-option>
                  </el-select> -->
                </template>

              </el-table-column>
              <el-table-column label="Container Seal Number">
                <template v-slot="scope">
                  <el-input v-model="scope.row.containerSealNumber"/>
                </template>
              </el-table-column>

                <el-table-column label="Tare Weight(KG)">
                  <template v-slot="scope">
                    <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required :prop="'containers.' + scope.$index + '.tareWeight'">
                      <el-input-number v-model="scope.row.tareWeight" :precision="3" :controls="false" />
                    </el-form-item>
                  </template>
                </el-table-column>


                <el-table-column label="VGM(KG)">
                  <template v-slot="scope">
                    <el-form-item label-width="0px" style="margin-bottom: 0px!important;border-width: 0;" :prop="'containers.' + scope.$index + '.vgm'">
                      <div>{{ sumVGM(scope.row).toFixed(3) }}</div>
                    </el-form-item>
                  </template>
                </el-table-column>


              <el-table-column label="Marks&Numbers">
                <template v-slot="scope">
                  <el-input type="textarea" placeholder="Marks&Numbers" v-model="scope.row.remark"/>
                </template>
              </el-table-column>
            </el-table>
            <div style="width:100%;margin-top: 10px;margin-left:10px">
              <el-row>
                <el-col :span="6">
                  <b>Total Gross Weight:</b>
                  {{ totalWeight().toFixed(3) }}
                </el-col>
                <el-col :span="6">
                  <b>Total CBM:</b>
                  {{ totalCBM().toFixed(3) }}
                </el-col>
                <el-col :span="6">
                  <b>Total Number of Packages:</b>
                  {{ totalVolum() }}
                </el-col>
              </el-row>
            </div>
          </el-card>


        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">

        <span style="margin-right: 10px;display:inline-block"><el-checkbox v-model="siForm.noSiEdi">No EDI</el-checkbox></span>

        <!--        <el-button type="primary" v-if="showSIDraft" @click="submitsi(4)" :loading="siButLoading">Save Draft-->
        <!--        </el-button>-->
        <el-button type="primary" @click="submitsi" :loading="siButLoading">Submit
        </el-button>
        <el-button @click="cancelsi" :loading="siButLoading">Cancel</el-button>
      </div>
    </el-dialog>
    <div style="float:left;margin-top:5px;">
      <span v-show="shipment.sinotrans || shipment.pushBookingFlag"
        style="font-size:14px;padding:3px;background:#ffba00;color:#fff;border-radius: 5px;margin-right:10px" effect="dark">smartMOOV Booking
      </span>
    </div>
    <el-dialog title="Verified Gross Mass" :visible.sync="visableVGM" width="1000px" append-to-body>
      <div style="height: 400px; overflow-x: hidden; overflow-y: auto">
        <el-descriptions title="Shipment" style="margin-bottom: 10px">
          <el-descriptions-item label="Carrier Booking Number">{{ this.shipment.shipmentBookingNumber }}
          </el-descriptions-item>
          <el-descriptions-item label="Voyage">{{ vgmForm.vmg[0] ? vgmForm.vmg[0].vesselVoy : "" }}
          </el-descriptions-item>
        </el-descriptions>

        <el-row :gutter="20" style="color: #004F7C; font-weight: 700 !important">
          <el-col :span="4">Container Type</el-col>
          <el-col :span="4">Container No</el-col>
          <el-col :span="4">Tare Weight</el-col>
          <el-col :span="4">VGM</el-col>
          <el-col :span="4">VGM Method</el-col>
          <el-col :span="4">Sign</el-col>
        </el-row>

        <el-descriptions :colon="false" direction="vertical" v-for="(item, i) in vgmForm.vmg" :key="'product' + i"
                         class="margin-top" title="" :column="6">
          <el-descriptions-item>
            {{item.containerType}}
          </el-descriptions-item>
          <el-descriptions-item>
            <el-input v-model="item.containerNo" disabled/>
          </el-descriptions-item>
          <el-descriptions-item>
            <el-input-number v-model="item.tareWeight" @change="setVGM(item)" :precision="3" :controls="false"/>
          </el-descriptions-item>
          <el-descriptions-item>
            <el-input v-model="item.vgm" disabled/>
          </el-descriptions-item>
          <el-descriptions-item>
            <el-select v-model="item.vgmMethod">
              <el-option value="SM1"></el-option>
              <el-option value="SM2"></el-option>
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item>
            <el-input v-model="item.sign"/>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="realSubmitSI(true)">{{ $t("purchaseOrder.confirm") }}
        </el-button>
        <el-button @click="cancelvgm">{{ $t("purchaseOrder.cancel") }}
        </el-button>
      </div>
    </el-dialog>
    <div style="float:left;max-width:60%">
      <span v-show="shipment.reserved"
            style="font-size:18px;padding:3px;background:#ffba00;color:#fff;border-radius: 5px;" effect="dark">Reserve
        space</span>

      <template v-for="spo in spoList">
        <div style="float: left; margin-right: 15px;">
          <el-tag size="small"
                  style="font-size: 14px; "
          >
            <el-link v-show="!shipment.fromShipperBooking" type="primary" target="_blank"
                     :href="'/shipment/shippingBookingDetail?id='+spo.id">{{ spo.soRef }}</el-link>
            <el-link v-show="shipment.fromShipperBooking" type="primary" target="_blank"
                     :href="'/shipment/ppshippingOrderDetail?id='+spo.id">{{ spo.soRef }}
            </el-link>
          </el-tag>
          <el-tag size="small" type="danger"
                  style="margin-left:2px; font-size: 14px; "
          >DC: {{ spo.dc }}</el-tag>
        </div>
      </template>
    </div>
    <div style="float:right;">
      <el-button size="mini" v-hasPermi="['shipment:downloadVGM']" @click="downloadVGM" type="primary" icon="el-icon-download">Download VGM</el-button>
      <el-button v-hasPermi="['shipment:downloadICS2F15']" size="mini"  @click="handleExportICS2F15" icon="el-icon-download" type="primary">Download ICS2 F15</el-button>


      <el-button @click="sendEmail" v-hasPermi="['shipment:sendToCarrier']"
                 v-if="shipment.bookingNumber.startsWith('S')" type="primary">Send files to carrier
      </el-button>
      <div v-if="shipment.status + '' != '1' && shipment.status + '' != '3'" style="display: inline; margin: 0 10px">
        <el-button v-hasPermi="['shipment:update']" @click="handleUpdateShipment(shipment)" type="primary">
          Update
        </el-button>
      </div>
      <el-button v-hasPermi="['shipment:copy']" @click="copyShipment(shipment)" v-if="isBooking"
                 type="primary">Copy
      </el-button>
      <!-- v-if="shipment.clpRes!=null&&showTMFF"-->
      <el-button @click="tmffHBL(shipment.id)" v-if="showTMFF" type="primary">{{ $t("shipment.tmff") }}</el-button>
      <el-button v-hasPermi="['shipment:activate']" @click="activateShipment(shipment)"
                 v-if="shipment.status == '1' || shipment.status == '3'" type="danger">
        Activate
      </el-button>
      <el-button v-hasPermi="['shipment:update']" @click="handleOpenCancel2(1)"
                 v-if="shipment.status != '1' && shipment.status != '3'" type="danger">
        Cancel
      </el-button>
      <el-button v-hasPermi="['shipment:deactivate']" @click="openCancel2(3)"
                 v-if="shipment.status != '1' && shipment.status != '3'" type="danger">
        Deactivate
      </el-button>
      <el-button v-if="tempJsonBut" title="Push JSON" type="primary" @click="tempJson(shipment)">
        Push Data
      </el-button>

    </div>
    <div style="clear:both"></div>
    <div style="height: 20px;"></div>
    <!-- <el-divider></el-divider> -->
    <el-descriptions
      style="padding: 25px 20px 15px !important;background: #fff; border: 1px solid #ddd;"
      :colon="false"
      class="el-des-margin-top"
      :column="6"
      size="small"
    >

      <el-descriptions-item label="">
        <span style="font-size:18px;font-weight: 600;">{{ shipment.bookingNumber }}</span>
      </el-descriptions-item>
      <el-descriptions-item :label="$constants.MBL_NUMBER">
      <el-popover
        placement="bottom-start"
        width="300"
        popper-class="status-popover-css"
        trigger="hover">
        <el-table :data="bookingNumberlogList">
          <el-table-column prop="msg" max-width="120" label="Booking Number">
          </el-table-column>
          <el-table-column
            prop="endDate" max-width="120"
            label="Date">
            <template v-slot="scope">
              {{ parseUTCTime(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="nickname" max-width="80"
            label="User">
          </el-table-column>
        </el-table>
        <template #reference>
          <span>{{ shipment.shipmentBookingNumber }}</span>
        </template>
      </el-popover>
    </el-descriptions-item>

  <el-descriptions-item v-if="shipment.freightMethod=='sea_air'"label="Air Booking Number">
    <el-popover placement="bottom-start" width="300" popper-class="status-popover-css" trigger="hover" z-index='3000'  ref="airBookingPopover">
      <el-table :data="airBookingNumberlogList">
        <el-table-column prop="msg" max-width="120" label="Booking Number">
        </el-table-column>
        <el-table-column prop="endDate" max-width="120" label="Date">
          <template v-slot="scope">
            {{ parseUTCTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="nickname" max-width="80" label="User">
        </el-table-column>
      </el-table>
      <template #reference>
        <span>{{ shipment.seaAirBookingNumber }}</span>
      </template>
    </el-popover>
  </el-descriptions-item>



    <el-descriptions-item label="BL Number">
      <el-popover
        placement="bottom-start"
        width="300"
        popper-class="status-popover-css"
        trigger="hover">
        <el-table :data="blNumberlogList">
          <el-table-column prop="msg" max-width="120" label="BL Number">
          </el-table-column>
          <el-table-column
            prop="endDate" max-width="120"
            label="Date">
            <template v-slot="scope">
              {{ parseUTCTime(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="nickname" max-width="80"
            label="User">
          </el-table-column>
        </el-table>
        <template #reference>
          <span v-if="shipment.atd != null" > {{ shipment.blNumber }}</span>
        </template>
      </el-popover>
    </el-descriptions-item>





      <el-descriptions-item label="CRA Number">
        {{ shipment.contractNumber }}
      </el-descriptions-item>
      <el-descriptions-item label="">

        <el-tag :type="
                  shipment.status==1?'danger':shipment.status==3?'danger':''
                  ">


            <el-popover
               v-if="shipment.status==1"
              placement="bottom-start"
              width="600"
              popper-class="status-popover-css"
              trigger="hover">
              <el-table :data="cancelRemarklogList">
                <el-table-column prop="msg" max-width="550" label="Cancel Remark">
                </el-table-column>
                <el-table-column
                  prop="endDate" width="100"
                  label="Date">
                  <template v-slot="scope">
                    {{ parseUTCTime(scope.row.createTime) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="nickname" width="100"
                  label="User">
                </el-table-column>
              </el-table>
              <template #reference>
                <span> {{showStatus(shipment)}}</span>
              </template>
            </el-popover>

            <span v-else class="title">
              {{showStatus(shipment)}}


          </span>
        </el-tag>
      </el-descriptions-item>

      <template v-if="shipment.status==1">
        <template v-if="$auth.hasPermi('shipment:cancelCode:update')">
          <el-descriptions-item label="">
            <el-button style="border: 0" @click="onModify" icon="el-icon-edit" />
          </el-descriptions-item>
        </template>
      </template>

      <el-descriptions-item>
        <img
          v-if="shipment.carrier == 'HLCU'"
          class="imgLogo"
          src="../../../assets/HLCU.png"
        />
        <img
          v-if="shipment.carrier == 'MAEU'"
          class="imgLogo"
          src="../../../assets/MAEU.png"
        />
        <img
          v-if="shipment.carrier == 'ZIMU'"
          class="imgLogo"
          src="../../../assets/ZIMU.png"
        />
        <img
          v-if="shipment.carrier == 'TSHG'"
          class="imgLogo"
          src="../../../assets/tailwind.png"
        />
        <img
          v-if="shipment.carrier == 'MSCU'"
          class="imgLogo"
          src="../../../assets/MSCU-new.png"
        />
        <img
          v-if="shipment.carrier == 'MSC'"
          class="imgLogo"
          src="../../../assets/MSCU-new.png"
        />
        <img
          v-if="shipment.carrier == 'OOLU'"
          class="imgLogo"
          src="../../../assets/OOLU.svg"
        />
        <img
          v-if="shipment.carrier == 'CMDU'"
          class="imgLogo"
          src="../../../assets/CMA.png"
        />
        <img
          v-if="shipment.carrier == 'HMM'"
          class="imgLogo"
          src="../../../assets/HMM.jpg"
        />
        <img
          v-if="shipment.carrier == 'ONEY'"
          class="imgLogo"
          src="../../../assets/ONE.png"
        />
        <img
          v-if="shipment.carrier == 'COSU'"
          class="imgLogo"
          src="../../../assets/COSCO.png"
        />
        <img
          v-if="shipment.carrier == 'CMA'"
          class="imgLogo"
          src="../../../assets/logo/CMA.png"
        />
        <img
          v-if="shipment.carrier == 'COSCO'"
          class="imgLogo"
          src="../../../assets/logo/COSCO.png"
        />
        <img
          v-if="shipment.carrier == 'HPL'"
          class="imgLogo"
          src="../../../assets/logo/HPL.png"
        />

        <img
          v-if="shipment.carrier == 'MSK'"
          class="imgLogo"
          src="../../../assets/logo/MSK.png"
        />
        <img
          v-if="shipment.carrier == 'ONE'"
          class="imgLogo"
          src="../../../assets/logo/ONE.png"
        />
        <img
          v-if="shipment.carrier == 'ZIM'"
          class="imgLogo"
          src="../../../assets/logo/ZIM.png"
        />
        <img
          v-if="shipment.carrier == 'EGLV'"
          class="imgLogo"
          src="../../../assets/logo/EGLV.png"
        />
        <img
          v-if="shipment.carrier == 'SJHH'"
          class="imgLogo"
          src="../../../assets/logo/SJHH.png"
        />
        <img
          v-if="shipment.carrier == 'SMLU'"
          class="imgLogo"
          src="../../../assets/logo/SMLU.png"
        />
        <span
          v-if="!['TSHG', 'MAEU', 'ZIMU', 'ZIM', 'HLCU', 'MSCU', 'OOLU',
                      'CMDU', 'ONEY', 'COSU','SMLU', 'EGLV', 'SJHH','ONE'].includes(shipment.carrier)">
        >{{ shipment.carrier }}</span>
      </el-descriptions-item>

      <el-descriptions-item label="Carriage Contract">
        {{ shipment.contractType }}
      </el-descriptions-item>
      <el-descriptions-item label="Payment Term">
        {{ shipment.paymentTerm }}
      </el-descriptions-item>
      <el-descriptions-item label="Order Numbers">
        {{shipment.poNumbers}}
      </el-descriptions-item>
      <el-descriptions-item label="">
        <el-popover
        placement="bottom-start"
        width="300"
        popper-class="status-popover-css"
        trigger="hover">
        <el-table :data="containerListlogList">
          <el-table-column prop="msg" max-width="120" label="TEU">
          </el-table-column>
          <el-table-column
            prop="endDate" max-width="120"
            label="Date">
            <template v-slot="scope">
              {{ parseUTCTime(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="nickname" max-width="80"
            label="User">
          </el-table-column>
        </el-table>
        <template #reference>
          <div>
             <el-tag
          style="margin-right: 5px;font-size: 14px;"
          v-for="container in shipment.containerDOList.filter((item) => item.type == 0)"
          :key="container.id"
        >{{ container.containerType }} x {{ container.numbers }}</el-tag>
        </div>
        </template>
      </el-popover>

      </el-descriptions-item>
    </el-descriptions>

    <el-dialog title="Json" :visible.sync="tempJsonVisible" width="80%">
      <template>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
                     @change="handleCheckAllChange">All
        </el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="city in checkList" :label="city.label" :key="city.key" :disabled="city.disabled"
                       style="display: block;">{{ city.label }}
          </el-checkbox>
        </el-checkbox-group>
      </template>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pushJsonToVMT" v-loading="apiLod">Submit</el-button>
      </div>

      <el-divider></el-divider>

      <el-tabs type="card">
        <el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.title" :name="item.name">
          <el-input type="textarea" :rows="8" v-model="item.content">
          </el-input>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog title="API Error List" :visible.sync="apiVisible" width="60%">
      <el-table :data="apiErrorList">
        <el-table-column property="tab" label="API Name" width="200"></el-table-column>
        <el-table-column property="message" label="Message" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-dialog>
    <br/>

    <el-dialog :title="statusForm.title" :visible.sync="visableStatus" width="600px">
      <el-form :model="statusForm" label-width="200px">
        <el-form-item :label="statusForm.title + ' Date'">
          <el-date-picker type="date" value-format="timestamp" v-model="statusForm.date"></el-date-picker>
        </el-form-item>
        <el-form-item label="Revoke" v-if="vmtRevokeSwitch">
          <el-switch v-model="statusForm.revoke"></el-switch>
        </el-form-item>
        <el-table v-if="statusForm.containerTitle" :data="statusForm.containers" style="width: 100%">
          <el-table-column prop="containerNo" label="Container No">
          </el-table-column>
          <el-table-column prop="name" :label="statusForm.containerTitle">
            <template v-slot="scope">
              <el-date-picker size="mini" v-model="scope.row.date" type="date" value-format="yyyy-MM-dd" placeholder="">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column prop="poNumber" label="Po Number">
            <template v-slot="scope">
              <el-input v-model="scope.row.poNumber" size="mini"/>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitStatus()">Submit</el-button>
        <el-button size="mini" @click="visableStatus = false">Cancel</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Add Port Call" :visible.sync="visablePortCall" width="600px">
      <el-form :model="portCall" label-width="200px">
        <el-form-item label="Port" prop="port">
          <el-select filterable v-model="portCall.port">
            <el-option v-for="(portName, portCode) in originDeliveryMap" :label="portName"
                       :value="portCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Vessel" prop="vessel">
          <el-select v-model="portCall.vessel" filterable remote reserve-keyword clearable
                     :remote-method="remoteMethod">
            <el-option v-for="dict in vesselListLes" :key="dict.value" :label="dict.vesselName"
                       :value="dict.vesselName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="ETD" prop="etd">
          <el-date-picker value-format="timestamp" v-model="portCall.etd"/>
        </el-form-item>
        <el-form-item label="ETA" prop="eta">
          <el-date-picker value-format="timestamp" v-model="portCall.eta"/>
        </el-form-item>
        <el-form-item label="ATD" prop="atd">
          <el-date-picker value-format="timestamp" v-model="portCall.atd"/>
        </el-form-item>
        <el-form-item label="ATA" prop="ata">
          <el-date-picker value-format="timestamp" v-model="portCall.ata"/>
        </el-form-item>
        <el-button type="primary" @click="submitPortCall">Submit</el-button>
        <el-button type="primary" @click="visablePortCall = false">Cancel</el-button>
      </el-form>
    </el-dialog>

    <el-dialog title="Destination Router" :visible.sync="visableDestinationRouter" width="600px">
      <el-form :model="destinationRouter" label-width="200px">
        <el-form-item label="Transport mode" prop="transportMode">
          <el-select v-model="destinationRouter.transportMode" clearable filterable>
            <el-option
              v-for="dict in transportMode"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="From location" prop="pol">
          <div style="margin-left: 15px">
            {{ originDeliveryMap[destinationRouter.pol] ? originDeliveryMap[destinationRouter.pol]:
            destinationRouter.pol }}
          </div>
        </el-form-item>
        <el-form-item label="To location" prop="pod">
          <el-input v-model="destinationRouter.pod"/>
        </el-form-item>
        <el-form-item label="ETD" prop="etd">
          <el-date-picker value-format="timestamp" v-model="destinationRouter.etd"/>
        </el-form-item>
        <el-form-item label="ATD" prop="atd">
          <el-date-picker value-format="timestamp" v-model="destinationRouter.atd"/>
        </el-form-item>
        <el-form-item label="ETA" prop="eta">
          <el-date-picker value-format="timestamp" v-model="destinationRouter.eta"/>
        </el-form-item>
        <el-form-item label="ATA" prop="ata">
          <el-date-picker value-format="timestamp" v-model="destinationRouter.ata"/>
        </el-form-item>
        <el-form-item label="Containers" prop="containerNos">
          <el-select v-model="destinationRouter.containers" filterable clearable multiple>
            <el-option v-for="(container,index) in addContainers" :label="container" :value="container"></el-option>
          </el-select>
        </el-form-item>
        <el-input label="Comments" type="textarea" placeholder="Comments"
                  @blur="destinationRouter.comments = $event.target.value.trim()" v-model="destinationRouter.comments"
                  size="mini"
                  :rows="3" maxlength="1000" show-word-limit resize="none">
        </el-input>

        <el-button type="primary" @click="submitDestinationRouter" style="margin-top: 10px">Submit</el-button>
        <el-button type="primary" @click="visableDestinationRouter = false">Cancel</el-button>
      </el-form>
    </el-dialog>

    <el-dialog title="Container Movement" :visible.sync="visableContainerMovement" width="600px">
      <el-form :model="containerMovement" label-width="200px">
        <el-form-item label="Container No" prop="containerNo">
          <el-input readonly v-model="containerMovement.containerNo"/>
        </el-form-item>
        <el-form-item label="Port" prop="port">
          <el-select v-model="containerMovement.port">
            <el-option v-for="(portName, portCode) in originDeliveryMap" :label="portName"
                       :value="portCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Vessel" prop="vessel">
          <el-select v-model="containerMovement.vessel" filterable remote reserve-keyword clearable
                     :remote-method="remoteMethod">
            <el-option v-for="dict in vesselListLes" :key="dict.value" :label="dict.vesselName"
                       :value="dict.vesselName"/>
          </el-select>

        </el-form-item>
        <el-form-item label="Voyage" prop="voyage">
          <el-input v-model="containerMovement.voyage"/>
        </el-form-item>
        <el-form-item label="Event" prop="eventCode">
          <el-select v-model="containerMovement.eventCode">
            <el-option v-for="(name, code) in containerStatus" :label="name" :value="code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Date" prop="eventTime">
          <el-date-picker value-format="timestamp" v-model="containerMovement.eventTime"/>
        </el-form-item>
        <el-button type="primary" @click="submitContainerMovement">Submit</el-button>
        <el-button type="primary" @click="visableContainerMovement = false">Cancel</el-button>
      </el-form>
    </el-dialog>

    <el-tabs v-model="activeName">
      <el-tab-pane label="Shipment Info" name="first">
        <div style="height: 30px;">
          <div style="float: right;">
            <el-button v-if="drawer" @click="opendestinationRouter" type="primary"><i class="el-icon-plus"></i> Add
            </el-button>
            <el-button v-if="drawer" @click="openDestination" type="primary">Sumary</el-button>
            <el-button v-if="!drawer&&$auth.hasPermi('shipment:detail:addDestinationRoute')" @click="openDestination"
                       type="primary">Add Destination Route
            </el-button>
          </div>
        </div>
        <el-card v-if="drawer" style="box-shadow: none;padding: 15px;margin-top: 10px;padding-bottom: 0px">
          <el-table :data="destinationRouterList" style="width: 100%">
            <el-table-column prop="date" label="Transport mode" width="180">
              <template v-slot="scope">
                {{ scope.row.transportMode }}
              </template>
            </el-table-column>
            <el-table-column prop="name" label="From location" width="180">
              <template v-slot="scope">
                {{ scope.row.pol }}
              </template>
            </el-table-column>
            <el-table-column
              prop="pod"
              label="To location">
            </el-table-column>
            <el-table-column
              prop="etd"
              label="ETD">
              <template v-slot="scope">
                {{ parseUTCTime(scope.row.etd) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="atd"
              label="ATD">
              <template v-slot="scope">
                {{ parseUTCTime(scope.row.atd) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="eta"
              label="ETA">
              <template v-slot="scope">
                {{ parseUTCTime(scope.row.eta) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="ata"
              label="ATA">
              <template v-slot="scope">
                {{ parseUTCTime(scope.row.ata) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="comments"
              label="Comments">
            </el-table-column>
            <el-table-column
              prop="containers"
              label="Containers">
              <template v-slot="scope">
                {{ scope.row.containers.join(',') }}
              </template>
            </el-table-column>
            <el-table-column label="" align="center" class-name="small-padding fixed-width">
              <template v-slot="scope">
                <el-tooltip content="Add/Remove Container" placement="bottom" effect="light">
                  <el-button size="mini" type="text" icon="el-icon-plus"
                             @click="addRemoveContainer(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="Edit" placement="bottom" effect="light">
                  <el-button size="mini" type="text" icon="el-icon-edit"
                             @click="handleUpdateDestinationRouter(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="Delete" placement="bottom" effect="light">
                  <el-button size="mini" type="text" icon="el-icon-delete"
                             @click="handleDeleteDestinationRouter(scope.row)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-card v-if="!drawer" style="box-shadow: none;padding: 15px;margin-top: 10px;padding-bottom: 0px">
          <div><b style="font-size: 15px">Shipment Events</b></div>
          <br/>
          <!-- Origin -->
          <div style="margin-right: 0px;position: relative;float: left;width:50px;height: 100px; font-size: 14px;">
            Origin
          </div>

          <div style="min-width: 640px;max-width: 1600px; margin: 0 auto;text-align: center;box-shadow: none; ">
            <div v-for="(task, index) in shipmentMilestones.filter((item) => item.key < 19)" :key="index"
                 class="self-step3"
                 :class="[task.status == 'process' ? 'self-step-process1' : ''
                    , task.status == 'finish' ? 'self-step-finished1' : ''
                    , task.label == 'Cancel Shipment' ? 'self-step-error1' : ''
                    , task.status == 'wait' ? 'self-step-pedding1' : '']"
                 style="margin-right: 30px;position: relative;float: left;margin-right: 30px;height: 90px; ">

<el-popover placement="bottom-start" width="450" popper-class="status-popover-css" trigger="hover"
:popper-options="{boundariesElement: 'body', gpuAcceleration: false }"
>
  <el-table  style="max-height: 300px; overflow: auto;"
    :data="task.key==='1'?draftDateList:task.key === '2' ? submitDateList : task.key === '3' ? bookingReceiptDateList : task.key === '4' ? bookingConfirmationDateList
                          : task.key === '7' ? siDateList: task.key === '18' ? atdDateList: task.key === '19' ? ataDateList: task.key === '20'? customClearanceDateList: task.key === '21'? deliveryDateList: task.key === '22'? emptyReturnDateList: []">
    <el-table-column prop="endDate"
                  :label="task.key === '2' ? 'Submit Date' : task.key === '3' ? 'Receipt Date' : task.key === '4' ? 'Confirmation Date': task.key === '7' ? 'SI Date': task.key === '18' ? 'ATD Date': task.key === '19' ? 'ATA Date': task.key === '20' ? 'Customs clearance Date': task.key === '21' ? 'Delivery Date': task.key === '22' ? 'Empty Return Date':'Date' ">
      <template v-slot="scope">{{ parseUTCTime(scope.row.endDate) }}</template>
    </el-table-column>
    <el-table-column prop="creatorName" max-width="80" label="User">
      <template v-slot="scope">
        {{ !scope.row.updaterName?'Auto Resolved':scope.row.updaterName }}
    </template>
    </el-table-column>
    <el-table-column prop="createTime" max-width="120" label="Create Time">
      <template v-slot="scope">{{ formatUserLocalTime(scope.row.updateTime, scope.row.timeZone, scope.row.timeZoneOffset) }}</template>
    </el-table-column>
  </el-table>
  <div slot="reference">
    <p> <span class="self-step2" :class="[task.status == 'process' ? 'self-step-process' : ''
    , task.status == 'finish' ? 'self-step-finished' : ''
    , task.label == 'Cancel Shipment' ? 'self-step-error' : ''
    , task.status == 'wait' ? 'self-step-pedding' : '']">{{ index + 1 }}</span>

                  <p style="display: inline-block;
                width: 130px;
                padding-top: 8px;
                margin: 0px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;">
                  <p class="title">{{ task.label == 'Shipping Instructions(VGM)' ? 'Shipping Instructions' : task.label
                    }}</p>

                  </p>
                  <p>
                  <p>{{ (task.status == 'finish' || task.label == 'Cancel Shipment') ? parseUTCTime(task.endDate) : ''
                    }}</p>
                  <el-button v-hasPermi="['shipment:update']" @click="edit(task.key)" v-if="shipment.id && task.status != 'wait' &&
                task.key != '1' &&task.key != '8' &&task.key != '9' &&task.key != '10' &&task.key != '11' &&task.key != '12' &&
                ((task.endDate == null && (task.key == '2' || task.key == '1')) ||
                  (task.key != '2' && task.key != '1')) &&
                shipmentMilestones.find((element) => element.key == '0') == null
                " type="text"><i class="el-icon-edit"></i> Edit
                  </el-button>
                  <el-button type="text" v-hasPermi="['shipment:update']" @click="openSinotransVGM"
                             v-if="shipment.id && task.key==='7'&&task.status == 'finish'&& shipment.status != '1' && shipment.status != '3'">
                    <i
                      class="el-icon-edit"></i>VGM
                  </el-button>
                  </p>
                  </p>
                </div>
              </el-popover>

            </div>

  <div v-show="sinotransRecordList.length>0" style="min-width: 640px;max-width: 2000px;
                    margin: 0 auto;text-align: right;box-shadow: none; ">
    <!-- 0没发送 1 发送成功 2 发送失败 3 发送中 -->
    <el-tooltip content="Booking" trigger="hover" placement="bottom" effect="light">
                      <span style="padding: 3px;">
                        <img v-show="sinotransRecordStatus.booking==0" style="height: 30px; " src="@/assets/images/shipment/nobuilt.png" />
                        <img v-show="sinotransRecordStatus.booking==1" style="height: 30px; " src="@/assets/images/shipment/blue.png" />
                        <img v-show="sinotransRecordStatus.booking==2" style="height: 30px; " src="@/assets/images/shipment/red.png" />
                      </span>
    </el-tooltip>
    <el-tooltip content="SI" trigger="hover" placement="bottom" effect="light">
                      <span style="padding: 3px;">
                        <img v-show="sinotransRecordStatus.si==0" style="height: 30px; " src="@/assets/images/shipment/nobuilt.png" />
                        <img v-show="sinotransRecordStatus.si==1" style="height: 30px; " src="@/assets/images/shipment/blue.png" />
                        <img v-show="sinotransRecordStatus.si==2" style="height: 30px; " src="@/assets/images/shipment/red.png" />
                      </span>
    </el-tooltip>
    <el-tooltip content="VGM" trigger="hover" placement="bottom" effect="light">
                      <span style="padding: 3px;">
                        <img v-show="sinotransRecordStatus.vgm==0" style="height: 30px; " src="@/assets/images/shipment/nobuilt.png" />
                        <img v-show="sinotransRecordStatus.vgm==1" style="height: 30px; " src="@/assets/images/shipment/blue.png" />
                        <img v-show="sinotransRecordStatus.vgm==2" style="height: 30px; " src="@/assets/images/shipment/red.png" />
                      </span>
    </el-tooltip>
  </div>



            <div style="clear:both"></div>
          </div>
          <!-- Destination -->
          <div style="margin-right: 0px;position: relative;float: left;width:50px;height: 10px; font-size: 14px;">
            Destination
          </div>

          <div style="min-width: 640px;max-width: 1600px;
    margin: 0 auto;text-align: center;box-shadow: none; ">
            <div v-for="(task, index) in shipmentMilestones.filter((item) => item.key >= 19)" :key="index"
                 class="self-step3"
                 :class="[task.status == 'process' ? 'self-step-process1' : ''
                    , task.status == 'finish' ? 'self-step-finished1' : ''
                    , task.label == 'Cancel Shipment' ? 'self-step-error1' : ''
                    , task.status == 'wait' ? 'self-step-pedding1' : '']"
                 style="margin-right: 30px;position: relative;float: left;margin-right: 30px;height: 90px; ">


<el-popover placement="bottom-start" width="450" popper-class="status-popover-css" trigger="hover"
:popper-options="{boundariesElement: 'body', gpuAcceleration: false }"
>
  <el-table  style="max-height: 300px; overflow: auto;"
    :data="task.key==='1'?draftDateList:task.key === '2' ? submitDateList : task.key === '3' ? bookingReceiptDateList : task.key === '4' ? bookingConfirmationDateList
                          : task.key === '7' ? siDateList: task.key === '18' ? atdDateList: task.key === '19' ? ataDateList: task.key === '20'? []: task.key === '21'? deliveryDateList: task.key === '22'? emptyReturnDateList: []">
    <el-table-column prop="endDate"
      :label="task.key === '2' ? 'Submit Date' : task.key === '3' ? 'Receipt Date' : task.key === '4' ? 'Confirmation Date': task.key === '7' ? 'SI Date': task.key === '18' ? 'ATD Date': task.key === '19' ? 'ATA Date': task.key === '20' ? 'Customs clearance Date': task.key === '21' ? 'Delivery Date': task.key === '22' ? 'Empty Return Date':'Date' ">
      <template v-slot="scope">{{ parseUTCTime(scope.row.endDate) }}</template>
    </el-table-column>
    <el-table-column prop="creatorName" max-width="80" label="User">
      <template v-slot="scope">
        {{ scope.row.source === 1 ? 'Sinotrans API' :!scope.row.updaterName?'Auto Resolved':scope.row.updaterName}}
      </template>
    </el-table-column>
    <el-table-column prop="createTime" max-width="120" label="Create Time">
      <template v-slot="scope">{{ formatUserLocalTime(scope.row.updateTime, scope.row.timeZone, scope.row.timeZoneOffset) }}</template>
    </el-table-column>
  </el-table>
  <div slot="reference">


                  <p>
                <span class="self-step2" :class="[task.status == 'process' ? 'self-step-process' : ''
    , task.status == 'finish' ? 'self-step-finished' : ''
    , task.label == 'Cancel Shipment' ? 'self-step-error' : ''
    , task.status == 'wait' ? 'self-step-pedding' : '']">{{ index + 1+shipmentMilestones.length-4 }}</span>
                  <p style="display: inline-block;
                width: 130px;
                padding-top: 8px;
                margin: 0px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;">
                    <span class="title">{{ task.label == 'Shipping Instructions(VGM)' ?  'Shipping Instructions' : task.label }} </span>
                  </p>
                  <p>
                  <p  v-show="task.key !== '20'" >{{ (task.status == 'finish' || task.label == 'Cancel Shipment') ? parseUTCTime(task.endDate) : ''
                    }}</p>
                  <el-button v-hasPermi="['shipment:update']" @click="edit(task.key)"
                             v-if="shipment.id && task.key !== '20'&& task.status != 'wait' &&
                task.key != '1' &&task.key != '8' &&task.key != '9' &&
                ((task.endDate == null && (task.key == '2' || task.key == '1')) ||
                  (task.key != '2' && task.key != '1')) &&
                shipmentMilestones.find((element) => element.key == '0') == null
                " type="text"><i class="el-icon-edit"></i> Edit
                  </el-button>

                  <el-button type="text" v-hasPermi="['shipment:update']" @click="openSinotransVGM"
                             v-if="shipment.id && task.key==='7'&&task.status == 'finish'&& shipment.status != '1' && shipment.status != '3'">
                    <i class="el-icon-edit"></i>VGM
                  </el-button>
                  </p>
                  </p>
                </div>
              </el-popover>

            </div>
            <div style="clear:both"></div>
          </div>

        </el-card>

        <el-card v-if="!drawer" style="box-shadow: none;padding: 15px;margin-top: 10px;padding-bottom: 0px">
          <div><b style="font-size: 15px">Booked Schedule Route</b></div>
          <br/>


          <div style="
margin: 0 auto;text-align: center;">


            <el-popover
              placement="right"
              width="170"
              trigger="click" style="margin-right: 0px;position: relative;float: left;width:100px;height: 100px; ">
              <el-table :data="tipContainers">
                <el-table-column width="140" property="date" label="Container No">
                  <template slot-scope="scope">
                    {{ scope.row}}
                  </template>
                </el-table-column>
              </el-table>
              <el-button slot="reference" type="text">
                <el-link @click.native="viewContainer(null)" type="primary">View containers</el-link>
              </el-button>
            </el-popover>

            <div>
              <div v-for="(task, index) in tempPlaces1" class="self-step4"
                   :class="[(task.transportMeanName!=null) ? 'self-step-solid4' : 'self-step-dotted4']"
                   style="margin-right: 0px;position: relative;float: left;width:260px;height: 110px; ">
                <p>
                  <span v-show="task.transportMode=='TRK'" part="icon-wrapper" class="mc-icon  size-24 "
                        style="fill:#141414;"><svg part="icon" id="mi-truck-front" shape-rendering="geometricPrecision"
                                                   xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                   viewBox="0 0 24 24"><path
                    d="M5.96 2.375A1 1 0 0 1 6.74 2h10.52a1 1 0 0 1 .78.375l1.74 2.176a1 1 0 0 1 .22.624V21a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2H8v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.175a1 1 0 0 1 .22-.624l1.74-2.176zM7 19H5v2h2v-2zm-2-1h14v-7H5v7zm0-8h14V5.175L17.26 3H6.74L5 5.175V10zm14 9h-2v2h2v-2zM7 14h3v1H7v-1zm7 0h3v1h-3v-1z"></path></svg></span>
                  <span v-show="task.transportMode==null" part="icon-wrapper" class="mc-icon size-24"
                        style="fill:#141414;"><svg part="icon" id="mi-pin" shape-rendering="geometricPrecision"
                                                   xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                   viewBox="0 0 24 24"><path
                    d="M5 9c0-3.772 3.13-7 7-7s7 3.228 7 7c0 2.61-1.17 5.488-2.408 7.817a38.15 38.15 0 0 1-3.046 4.793.983.983 0 0 1-.789.39h-1.514a.983.983 0 0 1-.789-.39c-.444-.59-1.8-2.45-3.046-4.793C6.17 14.487 5 11.61 5 9zm7-6C8.69 3 6 5.772 6 9c0 2.355 1.07 5.052 2.291 7.347A37.174 37.174 0 0 0 11.247 21h1.506a37.169 37.169 0 0 0 2.956-4.653C16.929 14.052 18 11.355 18 9c0-3.228-2.69-6-6-6zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"></path></svg></span>
                  <span v-show="task.transportMode=='SEA'||task.transportMode=='BRG'" part="icon-wrapper"
                        class="mc-icon size-24" style="fill:#141414;"><svg part="icon" id="mi-vessel-front"
                                                                           shape-rendering="geometricPrecision"
                                                                           xmlns="http://www.w3.org/2000/svg" width="24"
                                                                           height="24" viewBox="0 0 24 24"><path
                    d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4h3a1 1 0 0 1 1 1v5.473l2.594.865a1 1 0 0 1 .564 1.423l-2.793 5.187A2 2 0 0 1 16.605 22h-9.21a2 2 0 0 1-1.76-1.052L2.842 15.76a1 1 0 0 1 .564-1.422L6 13.473V8a1 1 0 0 1 1-1h3V3zm1 4h2V3h-2v4zm-4 6.14l4.684-1.562a.999.999 0 0 1 .632 0L17 13.14V8H7v5.14zm5-.613l-8.278 2.76 2.793 5.187a1 1 0 0 0 .88.526h9.21a1 1 0 0 0 .88-.526l2.793-5.188L12 12.527z"></path></svg></span>
                  <span v-show="task.transportMode=='RAI'" part="icon-wrapper" class="mc-icon size-24"
                        style="fill:#141414; width: 24px; height: 24px;display: inline-block; ">
      <svg style="width: 100%;height: 100%;margin: 0px" t="1724923370978" class="icon" viewBox="0 0 1024 1024"
           version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1364" xmlns:xlink="http://www.w3.org/1999/xlink"
           width="1024" height="1024"><path
        d="M832.00000001 64.00000003h-639.99999996A106.66666698 106.66666698 0 0 0 85.33333297 170.66666699v597.33333301a106.66666698 106.66666698 0 0 0 106.66666708 106.66666697h28.58666695l-67.413334 94.29333304a21.33333296 21.33333296 0 1 0 34.55999995 24.74666703l85.33333404-119.04000001h478.29333301l85.33333302 119.04000001a21.33333296 21.33333296 0 1 0 34.55999995-24.74666703l-67.83999997-94.29333304h28.58666701A106.66666698 106.66666698 0 0 0 938.66666703 768V170.66666699a106.66666698 106.66666698 0 0 0-106.66666708-106.66666696zM895.99999996 768a63.99999999 63.99999999 0 0 1-63.99999995 64.00000001h-640.00000002A63.99999999 63.99999999 0 0 1 128.00000004 768V170.66666699a63.99999999 63.99999999 0 0 1 63.99999995-63.99999993h640.00000002A63.99999999 63.99999999 0 0 1 895.99999996 170.66666699z"
        fill="#141414" p-id="1365"></path><path
        d="M256 614.40000001a63.99999999 63.99999999 0 1 0 64.00000002 64A63.99999999 63.99999999 0 0 0 256 614.40000001z m0 85.33333298a21.33333296 21.33333296 0 1 1 21.33333296-21.333333 21.33333296 21.33333296 0 0 1-21.33333296 21.333333zM768 614.40000001a63.99999999 63.99999999 0 1 0 64.00000001 64 63.99999999 63.99999999 0 0 0-64.00000001-64z m0 85.33333298a21.33333296 21.33333296 0 1 1 21.333333-21.333333 21.33333296 21.33333296 0 0 1-21.333333 21.333333zM768 191.99999999H256A63.99999999 63.99999999 0 0 0 191.99999999 256v256A63.99999999 63.99999999 0 0 0 256 575.99999999h512a63.99999999 63.99999999 0 0 0 64.00000001-63.99999999V256A63.99999999 63.99999999 0 0 0 768 191.99999999z m21.333333 320.00000001a21.33333296 21.33333296 0 0 1-21.333333 21.33333296H256a21.33333296 21.33333296 0 0 1-21.333333-21.33333296V256a21.33333296 21.33333296 0 0 1 21.333333-21.333333h512a21.33333296 21.33333296 0 0 1 21.333333 21.333333z"
        fill="#141414" p-id="1366"></path></svg>
      </span>
                <p style="display: inline-block;
      width: 220px;
      margin: 0px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis; ">


<!-- <span>{{ task.code }}</span> -->

      <span class="title">


        <el-popover placement="bottom-start" width="450" popper-class="status-popover-css" trigger="hover"
          :popper-options="{boundariesElement: 'body', gpuAcceleration: false }">
          <el-table  style="max-height: 300px; overflow: auto;border-bottom: none !important;"  :data="timeLogList.filter((item) => item.port == task.code)"
            >
                        <el-table-column prop="type" label="Event Type">
                          <template v-slot="scope">{{ scope.row.type=='DEPARTURE_ATD'?'Vessel Departure':scope.row.type=='BOOKED_ETD'?'Booked ETD':scope.row.type=='BOOKED_ETA'?'Booked ETA':scope.row.type }}</template>
                        </el-table-column>
            <el-table-column prop="eventDate" label="Event Date">
              <template v-slot="scope">{{ parseUTCTime(scope.row.eventTime) }}</template>
            </el-table-column>
                <el-table-column prop="creatorName" max-width="80" label="User">
                  <template v-slot="scope">{{
                  scope.row.source=='Tailwind'&&shipment.carrier=='TSHG'?'Tailwind':scope.row.source=='Freightower'&&shipment.carrier!='TSHG'?'Freightower':scope.row.creatorName
                  }}</template>
                </el-table-column>
            <el-table-column prop="createTime" width="130" label="Create Time">
              <template v-slot="scope">{{ parseUTCTimeWithHM(scope.row.createTime) }}</template>
            </el-table-column>
          </el-table>
          <div slot="reference">
                  <p style="margin:0px" v-if="task.code">{{ originDeliveryMap[task.code]? originDeliveryMap[task.code]: task.code }} </p>
            <div v-show="task.type=='pol'">
              <p style="margin:0px; text-align: left; position: relative;left: 55px;" v-if="task.bookedEtd">{{ 'Booked ETD:'+parseUTCTime(task.bookedEtd) }} </p>
              <p style="margin:0px; text-align: left; position: relative;left: 55px;" v-if="task.etd">{{ 'ETD:'+parseUTCTime(task.etd) }} </p>
              <p style="margin:0px; text-align: left; position: relative;left: 55px;" v-if="task.atd">{{ 'ATD:'+parseUTCTime(task.atd) }} </p>

              <p style="margin:0px; text-align: left; position: relative;left: 55px;" v-if="task.departureAtd">{{ 'Vessel Departure:'+parseUTCTime(task.departureAtd) }} </p>


            </div>

            <div v-show="task.type=='pod'">
              <p style="margin:0px; text-align: left; position: relative;left: 55px;" v-if="task.bookedEta">{{ 'Booked ETA:'+parseUTCTime(task.bookedEta) }} </p>
              <p style="margin:0px; text-align: left; position: relative;left: 55px;" v-if="task.eta">{{ 'ETA:'+parseUTCTime(task.eta) }} </p>
              <p style="margin:0px; text-align: left; position: relative;left: 55px;" v-if="task.ata">{{ 'ATA:'+parseUTCTime(task.ata) }} </p>
            </div>

          </div>
        </el-popover>

          <span> {{task.code}} </span>

         <el-popover v-if="task.transportMeanName != null && !isLong(task.transportMeanName, task.voyage) && index != tempPlaces1.length - 1"
                     placement="bottom-start"
                     width="700"
                     popper-class="status-popover-css"
                     trigger="hover"
         >
              <el-table :data="ningboSinotransReceives.filter(item => item.polCode === task.code)">
                <el-table-column prop="vesselName" max-width="150" label="Vessel Name">
                  <template v-slot="scope">
                    {{ scope.row.vesselName }}
                  </template>
                </el-table-column>

                <el-table-column prop="voyage" max-width="150" label="Voyage">
                  <template v-slot="scope">
                    {{ scope.row.voyage }}
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" max-width="350" label="Date">
                  <template v-slot="scope">
                    {{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
                  </template>
                </el-table-column>
                <el-table-column prop="creator" width="180"   label="User">
                </el-table-column>
              </el-table>
              <p slot="reference" :class="{ 'highlight': isMismatch(task.transportMeanName, task.voyage) }"         style="margin: 0px; width: 150px; position: absolute; left: 180px; top: -10px; white-space: pre-wrap;cursor: pointer;">
                <i class="el-icon-ship"></i>{{ task.transportMeanName + '\n' + task.voyage }}
              </p>
            </el-popover>
            <el-popover v-if="task.transportMeanName != null && isLong(task.transportMeanName, task.voyage) && index != tempPlaces1.length - 1"
                        placement="bottom-start"
                        width="600"
                        popper-class="status-popover-css"
                        trigger="hover"
            >
              <el-table :data="ningboSinotransReceives">
               <el-table-column prop="vesselName" max-width="150" label="Vessel Name">
                  <template v-slot="scope">
                    {{ scope.row.vesselName }}
                  </template>
                </el-table-column>

                <el-table-column prop="voyage" max-width="150" label="Voyage">
                  <template v-slot="scope">
                    {{ scope.row.voyage }}
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" max-width="350" label="Date">
                  <template v-slot="scope">
                    {{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
                  </template>
                </el-table-column>
                <el-table-column  prop="creator"   width="180" label="User">

                </el-table-column>
              </el-table>
              <p slot="reference" :class="{ 'highlight': isMismatch(task.transportMeanName, task.voyage) }"         style="margin: 0px; width: 150px; position: absolute; left: 180px; top: -10px; white-space: normal; cursor: pointer;">
                <i class="el-icon-ship"></i>{{ task.transportMeanName + '\n' + task.voyage }}
              </p>
            </el-popover>


      </span>
                </p>
                </p>
              </div>
            </div>

            <div v-show="tempPlaces2!=null&&tempPlaces2.length>0" style="float: left; margin-top: 40px; "
                 :style="{height: (tempPlaces2.length*100+10)+'px'}">
              <el-row v-for="(places, index) in tempPlaces2" class="self-step5"
                      style="margin-right: 0px;position: relative;height: 100px; "
                      :style="{width: (places.length*230+30)+'px'}">

                <el-popover
                  placement="right"
                  width="170"
                  trigger="click" style="position: absolute;top: 10px;right: -50px;">
                  <el-table :data="tipContainers">
                    <el-table-column width="140" property="date" label="Container No">
                      <template slot-scope="scope">
                        {{ scope.row}}
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button slot="reference" type="text">
                    <el-link @click.native="viewContainer(places[0])" type="primary">View containers</el-link>
                  </el-button>
                </el-popover>

                <div v-for="(task, index1) in places" class="self-step4"
                     style="margin: 0px;position: relative;float: left;width:230px;height: 100px;  ">
                  <p>
                    <span v-show="task.transportMode=='TRK'" part="icon-wrapper" class="mc-icon  size-24 "
                          style="fill:#141414;"><svg part="icon" id="mi-truck-front"
                                                     shape-rendering="geometricPrecision"
                                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24"><path
                      d="M5.96 2.375A1 1 0 0 1 6.74 2h10.52a1 1 0 0 1 .78.375l1.74 2.176a1 1 0 0 1 .22.624V21a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2H8v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.175a1 1 0 0 1 .22-.624l1.74-2.176zM7 19H5v2h2v-2zm-2-1h14v-7H5v7zm0-8h14V5.175L17.26 3H6.74L5 5.175V10zm14 9h-2v2h2v-2zM7 14h3v1H7v-1zm7 0h3v1h-3v-1z"></path></svg></span>
                    <span v-show="task.transportMode==null" part="icon-wrapper" class="mc-icon size-24"
                          style="fill:#141414;"><svg part="icon" id="mi-pin" shape-rendering="geometricPrecision"
                                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24"><path
                      d="M5 9c0-3.772 3.13-7 7-7s7 3.228 7 7c0 2.61-1.17 5.488-2.408 7.817a38.15 38.15 0 0 1-3.046 4.793.983.983 0 0 1-.789.39h-1.514a.983.983 0 0 1-.789-.39c-.444-.59-1.8-2.45-3.046-4.793C6.17 14.487 5 11.61 5 9zm7-6C8.69 3 6 5.772 6 9c0 2.355 1.07 5.052 2.291 7.347A37.174 37.174 0 0 0 11.247 21h1.506a37.169 37.169 0 0 0 2.956-4.653C16.929 14.052 18 11.355 18 9c0-3.228-2.69-6-6-6zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"></path></svg></span>
                    <span v-show="task.transportMode=='SEA'||task.transportMode=='BRG'" part="icon-wrapper"
                          class="mc-icon size-24" style="fill:#141414;"><svg part="icon" id="mi-vessel-front"
                                                                             shape-rendering="geometricPrecision"
                                                                             xmlns="http://www.w3.org/2000/svg"
                                                                             width="24" height="24" viewBox="0 0 24 24"><path
                      d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4h3a1 1 0 0 1 1 1v5.473l2.594.865a1 1 0 0 1 .564 1.423l-2.793 5.187A2 2 0 0 1 16.605 22h-9.21a2 2 0 0 1-1.76-1.052L2.842 15.76a1 1 0 0 1 .564-1.422L6 13.473V8a1 1 0 0 1 1-1h3V3zm1 4h2V3h-2v4zm-4 6.14l4.684-1.562a.999.999 0 0 1 .632 0L17 13.14V8H7v5.14zm5-.613l-8.278 2.76 2.793 5.187a1 1 0 0 0 .88.526h9.21a1 1 0 0 0 .88-.526l2.793-5.188L12 12.527z"></path></svg></span>
                    <span v-show="task.transportMode=='RAI'" part="icon-wrapper" class="mc-icon size-24"
                          style="fill:#141414; width: 24px; height: 24px;display: inline-block; ">
      <svg style="width: 100%;height: 100%;margin: 0px" t="1724923370978" class="icon" viewBox="0 0 1024 1024"
           version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1364" xmlns:xlink="http://www.w3.org/1999/xlink"
           width="1024" height="1024"><path
        d="M832.00000001 64.00000003h-639.99999996A106.66666698 106.66666698 0 0 0 85.33333297 170.66666699v597.33333301a106.66666698 106.66666698 0 0 0 106.66666708 106.66666697h28.58666695l-67.413334 94.29333304a21.33333296 21.33333296 0 1 0 34.55999995 24.74666703l85.33333404-119.04000001h478.29333301l85.33333302 119.04000001a21.33333296 21.33333296 0 1 0 34.55999995-24.74666703l-67.83999997-94.29333304h28.58666701A106.66666698 106.66666698 0 0 0 938.66666703 768V170.66666699a106.66666698 106.66666698 0 0 0-106.66666708-106.66666696zM895.99999996 768a63.99999999 63.99999999 0 0 1-63.99999995 64.00000001h-640.00000002A63.99999999 63.99999999 0 0 1 128.00000004 768V170.66666699a63.99999999 63.99999999 0 0 1 63.99999995-63.99999993h640.00000002A63.99999999 63.99999999 0 0 1 895.99999996 170.66666699z"
        fill="#141414" p-id="1365"></path><path
        d="M256 614.40000001a63.99999999 63.99999999 0 1 0 64.00000002 64A63.99999999 63.99999999 0 0 0 256 614.40000001z m0 85.33333298a21.33333296 21.33333296 0 1 1 21.33333296-21.333333 21.33333296 21.33333296 0 0 1-21.33333296 21.333333zM768 614.40000001a63.99999999 63.99999999 0 1 0 64.00000001 64 63.99999999 63.99999999 0 0 0-64.00000001-64z m0 85.33333298a21.33333296 21.33333296 0 1 1 21.333333-21.333333 21.33333296 21.33333296 0 0 1-21.333333 21.333333zM768 191.99999999H256A63.99999999 63.99999999 0 0 0 191.99999999 256v256A63.99999999 63.99999999 0 0 0 256 575.99999999h512a63.99999999 63.99999999 0 0 0 64.00000001-63.99999999V256A63.99999999 63.99999999 0 0 0 768 191.99999999z m21.333333 320.00000001a21.33333296 21.33333296 0 0 1-21.333333 21.33333296H256a21.33333296 21.33333296 0 0 1-21.333333-21.33333296V256a21.33333296 21.33333296 0 0 1 21.333333-21.333333h512a21.33333296 21.33333296 0 0 1 21.333333 21.333333z"
        fill="#141414" p-id="1366"></path></svg>
      </span>
                  <p style="display: inline-block;
      width: 220px;
      margin: 0px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis; ">
      <span class="title">
        <p style="margin:0px" v-if="task.code">{{ originDeliveryMap[task.code]? originDeliveryMap[task.code]: task.code }} </p>
        <p style="margin:0px" v-if="task.eta">{{ 'ETA:'+parseUTCTime(task.eta) }} </p>
        <p style="margin:0px" v-if="task.ata">{{ 'ATA:'+parseUTCTime(task.ata) }} </p>
        <p style="margin:0px" v-if="task.etd">{{ 'ETD:'+parseUTCTime(task.etd) }} </p>
        <p style="margin:0px" v-if="task.atd">{{ 'ATD:'+parseUTCTime(task.atd) }} </p>
        <p v-if="task.comments" style="margin: 0px;width:150px;position: absolute;left: 160px;top: 0px; ">
         {{ task.comments }}
        </p>
      </span>
                  </p>
                  </p>
                </div>
              </el-row>

            </div>

          </div>

        </el-card>


        <el-card v-if="!drawer&&tempPlacesShow.length>0"
          style="box-shadow: none;padding: 15px;margin-top: 10px;padding-bottom: 0px;border-radius: 10px;">
          <div><b style="font-size: 15px">Carrier Actual Schedule Route</b></div>
          <br />

          <div style="min-width: 640px;max-width: 2000px;
        margin: 0 auto;text-align: center;box-shadow: none; ">
            <div v-for="(task, index) in tempPlacesShow" class="self-step4"
              :class="[(task.transportMeanName!=null) ? 'self-step-solid4' : 'self-step-dotted4']"
              style="margin-right: 0px;position: relative;float: left;width:260px;height: 100px;">
              <p>
                <span v-show="task.transportMode=='TRK'" part="icon-wrapper" class="mc-icon  size-24 "
                  style="fill:#141414;"><svg part="icon" id="mi-truck-front" shape-rendering="geometricPrecision"
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                      d="M5.96 2.375A1 1 0 0 1 6.74 2h10.52a1 1 0 0 1 .78.375l1.74 2.176a1 1 0 0 1 .22.624V21a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2H8v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.175a1 1 0 0 1 .22-.624l1.74-2.176zM7 19H5v2h2v-2zm-2-1h14v-7H5v7zm0-8h14V5.175L17.26 3H6.74L5 5.175V10zm14 9h-2v2h2v-2zM7 14h3v1H7v-1zm7 0h3v1h-3v-1z">
                    </path>
                  </svg></span>
                <span v-show="task.transportMode==null" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;"><svg
                    part="icon" id="mi-pin" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24"
                    height="24" viewBox="0 0 24 24">
                    <path
                      d="M5 9c0-3.772 3.13-7 7-7s7 3.228 7 7c0 2.61-1.17 5.488-2.408 7.817a38.15 38.15 0 0 1-3.046 4.793.983.983 0 0 1-.789.39h-1.514a.983.983 0 0 1-.789-.39c-.444-.59-1.8-2.45-3.046-4.793C6.17 14.487 5 11.61 5 9zm7-6C8.69 3 6 5.772 6 9c0 2.355 1.07 5.052 2.291 7.347A37.174 37.174 0 0 0 11.247 21h1.506a37.169 37.169 0 0 0 2.956-4.653C16.929 14.052 18 11.355 18 9c0-3.228-2.69-6-6-6zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0z">
                    </path>
                  </svg></span>
                <span v-show="task.transportMode=='SEA'||task.transportMode=='BRG'" part="icon-wrapper" class="mc-icon size-24"
                  style="fill:#141414;"><svg part="icon" id="mi-vessel-front" shape-rendering="geometricPrecision"
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                      d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4h3a1 1 0 0 1 1 1v5.473l2.594.865a1 1 0 0 1 .564 1.423l-2.793 5.187A2 2 0 0 1 16.605 22h-9.21a2 2 0 0 1-1.76-1.052L2.842 15.76a1 1 0 0 1 .564-1.422L6 13.473V8a1 1 0 0 1 1-1h3V3zm1 4h2V3h-2v4zm-4 6.14l4.684-1.562a.999.999 0 0 1 .632 0L17 13.14V8H7v5.14zm5-.613l-8.278 2.76 2.793 5.187a1 1 0 0 0 .88.526h9.21a1 1 0 0 0 .88-.526l2.793-5.188L12 12.527z">
                    </path>
                  </svg></span>
                <span v-show="task.transportMode=='RAI'" part="icon-wrapper" class="mc-icon size-24"
                  style="fill:#141414; width: 24px; height: 24px;display: inline-block; ">
                  <svg style="width: 100%;height: 100%;margin: 0px" t="1724923370978" class="icon" viewBox="0 0 1024 1024"
                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1364" xmlns:xlink="http://www.w3.org/1999/xlink"
                    width="1024" height="1024">
                    <path
                      d="M832.00000001 64.00000003h-639.99999996A106.66666698 106.66666698 0 0 0 85.33333297 170.66666699v597.33333301a106.66666698 106.66666698 0 0 0 106.66666708 106.66666697h28.58666695l-67.413334 94.29333304a21.33333296 21.33333296 0 1 0 34.55999995 24.74666703l85.33333404-119.04000001h478.29333301l85.33333302 119.04000001a21.33333296 21.33333296 0 1 0 34.55999995-24.74666703l-67.83999997-94.29333304h28.58666701A106.66666698 106.66666698 0 0 0 938.66666703 768V170.66666699a106.66666698 106.66666698 0 0 0-106.66666708-106.66666696zM895.99999996 768a63.99999999 63.99999999 0 0 1-63.99999995 64.00000001h-640.00000002A63.99999999 63.99999999 0 0 1 128.00000004 768V170.66666699a63.99999999 63.99999999 0 0 1 63.99999995-63.99999993h640.00000002A63.99999999 63.99999999 0 0 1 895.99999996 170.66666699z"
                      fill="#141414" p-id="1365"></path>
                    <path
                      d="M256 614.40000001a63.99999999 63.99999999 0 1 0 64.00000002 64A63.99999999 63.99999999 0 0 0 256 614.40000001z m0 85.33333298a21.33333296 21.33333296 0 1 1 21.33333296-21.333333 21.33333296 21.33333296 0 0 1-21.33333296 21.333333zM768 614.40000001a63.99999999 63.99999999 0 1 0 64.00000001 64 63.99999999 63.99999999 0 0 0-64.00000001-64z m0 85.33333298a21.33333296 21.33333296 0 1 1 21.333333-21.333333 21.33333296 21.33333296 0 0 1-21.333333 21.333333zM768 191.99999999H256A63.99999999 63.99999999 0 0 0 191.99999999 256v256A63.99999999 63.99999999 0 0 0 256 575.99999999h512a63.99999999 63.99999999 0 0 0 64.00000001-63.99999999V256A63.99999999 63.99999999 0 0 0 768 191.99999999z m21.333333 320.00000001a21.33333296 21.33333296 0 0 1-21.333333 21.33333296H256a21.33333296 21.33333296 0 0 1-21.333333-21.33333296V256a21.33333296 21.33333296 0 0 1 21.333333-21.333333h512a21.33333296 21.33333296 0 0 1 21.333333 21.333333z"
                      fill="#141414" p-id="1366"></path>
                  </svg>
                </span>
              <p style="display: inline-block;
        width: 220px;
        margin: 0px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis; ">
                <span class="title">
                  <p style="margin:0px" v-if="task.code">{{ originDeliveryMap[task.code]? originDeliveryMap[task.code]:
                    task.code
                    }} </p>
                  <p style="margin:0px" v-if="task.eta">{{ 'ETA:'+parseUTCTime(task.eta) }} </p>
                  <p style="margin:0px" v-if="task.ata">{{ 'ATA:'+parseUTCTime(task.ata) }} </p>
                  <p style="margin:0px" v-if="task.etd">{{ 'ETD:'+parseUTCTime(task.etd) }} </p>
                  <p style="margin:0px" v-if="task.atd">{{ 'ATD:'+parseUTCTime(task.atd) }} </p>


                  <p v-if="task.vessel!=null&&index!=tempPlacesShow.length-1"
                    style="margin: 0px;width:180px;position: absolute;left: 160px;top: -10px;white-space: pre-wrap;"><i
                      class="el-icon-ship">
                    </i>{{ task.vessel+'\n'+task.voyage }}
                  </p>
                </span>
              </p>
              </p>
            </div>
          </div>
        </el-card>





    <!-- air Booked Schedule Route -->
    <AirBookedScheduleRoute
      v-if="!drawer && shipment && shipment.id && shipment.freightMethod=='sea_air'"
      :shipmentId="shipment.id"
      :shipment="shipment"
      @refreshPage="refreshPage"
    />






        <el-descriptions v-if="siVGMCutoffflag&&!drawer" direction="vertical"
                         style="padding:15px!important;background: #fff;box-shadow: none;border-radius: 10px;"
                         :colon="false" :column="4">
          <template slot="title">
            <i style="font-size: 24px" class="el-icon-alarm-clock"></i><span style="    position: relative;
                    top: -3px;
                    left: 5px;
                    font-size: 14px;">Deadlines</span>
          </template>
          <el-descriptions-item label="Shipping Instructions">{{ siCutoff }}</el-descriptions-item>
          <el-descriptions-item label="Verified Gross Mass">{{ vgmCutoff }}</el-descriptions-item>
        </el-descriptions>
        <el-form v-if="!drawer" :model="shipment" ref="form" :show-message="false" label-width="200px">


          <el-descriptions style="box-shadow: none;padding:15px!important;background: #fff;border-radius: 10px;"
                           direction="vertical" :colon="false" :column="4">
            <template slot="title">
              <b style="font-size: 15px">Contact Info</b>
            </template>
            <el-descriptions-item :label="$t('booking.name')">
              {{ shipment.name }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.phone')">
              {{ shipment.phone }}<br/>
              {{ shipment.fixedPhone }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.email')">
              {{ shipment.email }}
            </el-descriptions-item>
            <el-descriptions-item v-if="shipment.fax" label="Fax">
              {{ shipment.fax }}
            </el-descriptions-item>
          </el-descriptions>
          <el-descriptions style="box-shadow: none;padding:15px!important;background: #fff;border-radius: 10px;"
                           direction="vertical" :colon="false" :column="4">
            <template slot="title">
              <b style="font-size: 15px">{{ $t("booking.involvedParties") }}</b>
            </template>
            <el-descriptions-item :label="$t('booking.shipper')" content-class-name="parties-item-css">
              <p>
                {{
                partiesMap[shipment.shipper] ? partiesMap[shipment.shipper].name : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.shipper] ? partiesMap[shipment.shipper].address : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.shipper] ? partiesMap[shipment.shipper].phone : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.shipper] ? partiesMap[shipment.shipper].fax : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.shipper] ? partiesMap[shipment.shipper].email : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.shipper] ? partiesMap[shipment.shipper].companyUsci : ""
                }}
              </p>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.consignee')" content-class-name="parties-item-css">
              <p>
                {{
                partiesMap[shipment.consignee]
                ? partiesMap[shipment.consignee].name
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.consignee]
                ? partiesMap[shipment.consignee].address
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.consignee]
                ? partiesMap[shipment.consignee].phone
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.consignee]
                ? partiesMap[shipment.consignee].fax
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.consignee]
                ? partiesMap[shipment.consignee].email
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.consignee] ? partiesMap[shipment.consignee].companyUsci : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.consignee] ? partiesMap[shipment.consignee].companyUsci : ""
                }}
              </p>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.notifyParty')" content-class-name="parties-item-css">
              <p>
                {{
                partiesMap[shipment.notifyParty]
                ? partiesMap[shipment.notifyParty].name
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.notifyParty]
                ? partiesMap[shipment.notifyParty].address
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.notifyParty]
                ? partiesMap[shipment.notifyParty].phone
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.notifyParty]
                ? partiesMap[shipment.notifyParty].fax
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.notifyParty]
                ? partiesMap[shipment.notifyParty].email
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.notifyParty] ? partiesMap[shipment.notifyParty].companyUsci : ""
                }}
              </p>
            </el-descriptions-item>
            <el-descriptions-item :label="shipment.carrier=='TSHG'?'Agreement Party':'Second Notify Party'" content-class-name="parties-item-css">
              <p>
                {{
                partiesMap[shipment.agreementParty]
                ? partiesMap[shipment.agreementParty].name
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.agreementParty]
                ? partiesMap[shipment.agreementParty].address
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.agreementParty]
                ? partiesMap[shipment.agreementParty].phone
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.agreementParty]
                ? partiesMap[shipment.agreementParty].fax
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.agreementParty]
                ? partiesMap[shipment.agreementParty].email
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.agreementParty] ? partiesMap[shipment.agreementParty].companyUsci : ""
                }}
              </p>
            </el-descriptions-item>
            <el-descriptions-item label="Customer" v-if="shipment.customer!=null">
              <p>
                {{
                partiesMap[shipment.customer]
                ? partiesMap[shipment.customer].name
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.customer]
                ? partiesMap[shipment.customer].address
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.customer]
                ? partiesMap[shipment.customer].phone
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.customer]
                ? partiesMap[shipment.customer].fax
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.customer]
                ? partiesMap[shipment.customer].email
                : ""
                }}
              </p>
              <p>
                {{
                partiesMap[shipment.customer] ? partiesMap[shipment.customer].companyUsci : ""
                }}
              </p>
            </el-descriptions-item>
          </el-descriptions>


          <div v-if="noteView">
            <el-divider></el-divider>
            <div style="text-indent: 10px">
              <b style="font-size: 15px">Note</b>
            </div>
            <el-table :data="shipmentNoteList" max-height="200px">
              <el-table-column prop="cancelCode" label="Update Category" width="200" show-overflow-tooltip>
                <template v-slot="scope">
                  {{ coCancelCategoryNote(scope.row.cancelCode) }}
                </template>
              </el-table-column>
              <el-table-column prop="cancelSubCode" label="Update Reason" width="300" show-overflow-tooltip>
                <template v-slot="scope">
                  {{ coCancelReasonNote(scope.row.cancelSubCode) }}
                </template>

              </el-table-column>
              <el-table-column prop="cancelRemark" label="Update Remark" show-overflow-tooltip>
                <template v-slot="scope">
                  {{ scope.row.cancelRemark }}
                </template>

              </el-table-column>
            </el-table>
          </div>


        </el-form>


        <!-- 换船 info 卡片（多船期比对版） -->
       <el-card v-if="showVesselChangeCard" class="vessel-change-card modern-card compact-card">

           <div style="margin-top: 15px;  margin-left: 15px;"><b style="font-size: 15px">Vessel Change History</b></div>
          <br/>
          <div v-loading="changeVesselLoading" class="vessel-change-content">
            <!-- 修改：遍历批次组而不是单个记录 -->
            <div v-if="changeVesselGroups && changeVesselGroups.length > 0" class="change-records">
              <div v-for="(batchGroup, batchIndex) in changeVesselGroups" :key="batchIndex" class="batch-group">
                <!-- 批次内的换船记录 -->
                <div class="change-record">
                  <!-- 时间戳 -->
                  <div class="change-timestamp">
                    <span class="record-index">{{ batchIndex + 1 }}</span>
                  </div>

                  <!-- 内容区域 -->
                  <div class="change-content-wrapper">
                    <!-- 原始船期信息（单条船期） -->
                    <div class="vessel-info original-info"  >
                      <h4 class="info-title">Original Vessel</h4>
                      <div class="multi-vessel-list" >
                        <!-- 排除船名是空的数据 -->
                        <div v-if="record.originalVessel" class="vessel-item" v-for="(record, recordIndex) in batchGroup" :key="record.id">
                          <div class="info-grid compact-grid">
                            <div class="info-item">
                              <span class="info-label">Vessel</span>
                              <span class="info-value">{{ record.originalVessel || '-' }}</span>
                            </div>
                            <div class="info-item">
                              <span class="info-label">Voyage</span>
                              <span class="info-value">{{ record.originalVoyage || '-' }}</span>
                            </div>
                            <div class="info-item">
                              <span class="info-label">ETD</span>
                              <span class="info-value">{{ parseTime(record.originalEtd, '{y}-{m}-{d}') || '-' }}</span>
                            </div>
                            <div class="info-item">
                              <span class="info-label">ETA</span>
                              <span class="info-value">{{ parseTime(record.originalEta, '{y}-{m}-{d}') || '-' }}</span>
                            </div>
                            <div class="info-item">
                              <span class="info-label">POL/POD</span>
                              <span class="info-value">{{ record.originalPol }}/{{ record.originalPod }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 中间变更信息区 获取batchGroup里面第一个记录的就可以了 -->
                    <div class="change-middle-section compact-middle">
                      <div>
                        <span class="date-text">{{ parseTime(batchGroup[0].changeTime, '{y}-{m}-{d}') }}</span>
                      </div>
                      <div class="change-type-indicator" :class="'vessel-type'">
                        {{ batchGroup[0].changeType }}
                      </div>
                      <div class="change-reason-card compact-reason">
                        <h4 class="reason-title">Reason:</h4>
                        <p class="reason-content">{{ batchGroup[0].changeReason || 'No reason' }}</p>
                      </div>
                    </div>

                    <!-- 新船期信息（单条船期） -->
                    <div class="vessel-info new-info">
                      <h4 class="info-title">New Vessel</h4>

                        <div class="multi-vessel-list" >
                          <div v-if="record.newVessel" class="vessel-item" v-for="(record, recordIndex) in batchGroup" :key="record.id">
                            <div class="info-grid compact-grid">
                              <div class="info-item">
                                <span class="info-label">Vessel</span>
                                <span class="info-value">{{ record.newVessel || '-' }}</span>
                              </div>
                              <div class="info-item">
                                <span class="info-label">Voyage</span>
                                <span class="info-value">{{ record.newVoyage || '-' }}</span>
                              </div>
                              <div class="info-item">
                                <span class="info-label">ETD</span>
                                <span class="info-value">{{ parseTime(record.newEtd, '{y}-{m}-{d}') || '-' }}</span>
                              </div>
                              <div class="info-item">
                                <span class="info-label">ETA</span>
                                <span class="info-value">{{ parseTime(record.newEta, '{y}-{m}-{d}') || '-' }}</span>
                              </div>
                              <div class="info-item">
                                <span class="info-label">POL/POD</span>
                                <span class="info-value">{{ record.newPol }}/{{ record.newPod }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <!-- 无数据状态 -->
            <div v-else class="no-data">
            </div>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="Places" name="first2">
        <el-card style="padding:20px;border-radius:0px">
          <el-button type="primary" @click="openPortCall" v-show="!onlyPreview">Add Port Call</el-button>
          <el-table :data="places" style="width: 100%">
            <el-table-column prop="port" label="Port" width="180">
            </el-table-column>
            <el-table-column prop="vessel" label="Vessel" width="180">
            </el-table-column>
            <el-table-column prop="etd" label="ETD">
              <template v-slot="scope">
                {{ parseUTCTime(scope.row.etd) }}
              </template>
            </el-table-column>
            <el-table-column prop="eta" label="ETA">
              <template v-slot="scope">
                {{ parseUTCTime(scope.row.eta) }}
              </template>
            </el-table-column>
            <el-table-column prop="atd" label="ATD">
              <template v-slot="scope">
                {{ shipment.carrier == 'OOLU' ? parseUTCTime(scope.row.atd) : parseUTCTime(scope.row.atd ? scope.row.atd
                : scope.row.atdAis) }}
              </template>
            </el-table-column>
            <el-table-column prop="ata" label="ATA">
              <template v-slot="scope">
                {{ shipment.carrier == 'OOLU' ? parseUTCTime(scope.row.ata) : parseUTCTime(scope.row.ata ? scope.row.ata
                : scope.row.ataAis) }}
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="editPortCall(scope.$index,scope.row)"
                >Edit
                </el-button>

                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="deletePlacesById(scope.$index,scope.row)"
                  slot="reference"
                >Delete
                </el-button>

              </template>
            </el-table-column>
          </el-table>
        </el-card>

      </el-tab-pane>
      <el-tab-pane label="Cargo Info" name="first1">
        <div>
          <el-card v-if="shipment.soHeaderVOs.length>0" style="margin-bottom:20px;border-radius:0px;padding:20px">
            <!-- 由于 Unitrans实习生总是不更新所有的po；所以打开新增修改的权限 -->
            <!-- v-show=" shipment.atd == null && shipment.status != '1' && shipment.status != '3' && shipment.fromSalesOrder" type="primary" -->
            <el-button style="margin-bottom:15px" v-hasPermi="['shipment:addRemovePO']"
                       v-show="shipment.status != '1' && shipment.status != '3' && shipment.fromSalesOrder"
                       type="primary"
                       @click="addRemoveSOVisible=true;getSO()">Add/Remove SO
            </el-button>

            <SOMainTable v-loading="addRemoveSoLoading" :tableData="shipment.soHeaderVOs" ref="table"
                         v-if="shipment.soHeaderVOs.length>0"
                         @deleteSO="deleteSO" :tableHeight="null" :showOtherTabs="false"
                         :deleteShow="shipment.soHeaderVOs.length >1 && shipment.atd == null && shipment.status != '1' && shipment.status != '3' && shipment.fromSalesOrder"></SOMainTable>
          </el-card>
          <el-button style="margin-bottom:15px" v-hasPermi="['shipment:addRemovePO']" type="primary"
            v-show="showAddShipperBooking&&shipment.status != '1' && shipment.status != '3' && shipment.fromShippingOrder&& shipment.fromShipperBooking"
            @click="addRemoveSpoShow">Add/Remove Shipper Booking
          </el-button>

          <el-button style="margin-bottom:15px" v-hasPermi="['shipment:addRemovePO']" type="primary"
                     v-show="shipment.atd == null && shipment.status != '1' && shipment.status != '3' && shipment.fromShippingOrder&& !shipment.fromShipperBooking"
                     @click="addRemoveSpoShow">Add/Remove Shipping Order
          </el-button>

          <el-button style="margin-bottom:15px" v-hasPermi="['shipment:addRemovePO']"
                     v-show="shipment.atd == null && shipment.status != '1' && shipment.status != '3' &&!shipment.fromSalesOrder &&!shipment.fromShippingOrder"
                     type="primary"
                     @click="addRemovePo">Add/Remove PO
          </el-button>
          <!--  判断是否到达 si vgm submit to carrier 状态 -->
          <el-button style="margin-bottom:15px" v-hasPermi="['shipment:addRemovePO']"
            v-show="canReArrangeSO&&form.shipmentType=='LCL'&&shipment.atd == null && shipment.status != '1' && shipment.status != '3' &&shipment.fromShippingOrder &&shipment.fromShipperBooking"
            type="primary" @click="reArrangeSOShow">Re-arrange Shipping Order
          </el-button>


          <el-card v-if="spoList.length>0" style="margin-bottom:20px;border-radius:0px;padding:20px">
            <el-tag size="small"
                    style="margin-right: 5px;  font-size: 14px; "
                    v-for="spo in spoList"
                    :key="spo.id"
            >
            <el-link v-show="!shipment.fromShipperBooking" type="primary" target="_blank" :href="'/shipment/shippingBookingDetail?id='+spo.id">{{ spo.soRef }}</el-link>
              <el-link v-show="shipment.fromShipperBooking" type="primary" target="_blank"
                       :href="'/shipment/ppshippingOrderDetail?id='+spo.id">{{ spo.soRef }}
              </el-link>
            </el-tag>
          </el-card>

          <el-table v-if="itemTableData.length > 0" :data="itemTableData">
            <el-table-column prop="orderNumber" label="Order Number">
            </el-table-column>
            <el-table-column prop="productCode" :label="$t('booking.product')">
            </el-table-column>
            <el-table-column prop="productName" :label="$t('booking.product') + ' Name'">
            </el-table-column>

            <el-table-column prop="requested" :label="$t('booking.requested')">
              <template v-slot="scope">
                {{ scope.row.requested }}{{ scope.row.requestUnit }}
              </template>
            </el-table-column>
            <el-table-column prop="bookedQty" :label="$t('booking.booked')">
              <template v-slot="scope">
                {{ scope.row.bookQty }}{{ scope.row.bookedUnit }}
              </template>
            </el-table-column>
            <el-table-column prop="booked" label="Total Booked">
              <template v-slot="scope">
                {{ scope.row.booked }}{{ scope.row.bookedUnit }}
              </template>
            </el-table-column>
          </el-table>
          <div v-for="form in bookings" :key="'booking' + form.id">
            <el-card shadow="never" style="background: #EBF0F4;" class="box-card">
              <div slot="header" v-if="form.shipmentName != '' && form.shipmentName != null" class="clearfix">
                <span>Shipment Name: {{ form.shipmentName }}</span>
              </div>
              <el-descriptions style="box-shadow:none!important;border: none;padding: 15px!important;background: #fff;"
                               :column="4">
                <el-descriptions-item label="Total Weight(KG)">
                  {{ form.totalWeight ? form.totalWeight.toFixed(3) : "NA" }}
                </el-descriptions-item>
                <el-descriptions-item label="Total Volume(CBM)">
                  {{ form.totalVolume ? form.totalVolume.toFixed(3) : "NA" }}
                </el-descriptions-item>
                <el-descriptions-item label="Packages">
                  {{ form.cargoPackageType ? form.cargoPackageType : "NA" }}
                </el-descriptions-item>
                <el-descriptions-item label="Total Number Of Packages">
                  {{ form.slac ? form.slac : "NA" }}
                </el-descriptions-item>
              </el-descriptions>
              <br/>
              <el-descriptions style="margin-bottom: 20px;background: #fff;" :colon="false" direction="vertical"
                               v-for="(item, i) in form.bookingProductDOS" :key="'product' + i" class="margin-top"
                               title=""
                               :column="4">
                <template slot="extra">
                  <br/>
                </template>

                <el-descriptions-item :label="$t('booking.productEnglishName')">{{
                  item.productEnglishName
                  }}
                </el-descriptions-item>
                <el-descriptions-item v-if="form.carrier != 'TSHG'" label="Product Chinese Name">{{
                  item.productChineseName
                  }}
                </el-descriptions-item>
                <el-descriptions-item :label="$t('booking.hsCode')">{{
                  item.hscode
                  }}
                </el-descriptions-item>
                <el-descriptions-item v-if="shipment.carrier != 'TSHG'" label="Marks&Numbers">{{
                  item.markNumbers
                  }}
                </el-descriptions-item>
                <el-descriptions-item :label="shipment.carrier != 'TSHG' ? 'Remark' : 'Marks&Numbers'">{{
                  item.mark
                  }}
                </el-descriptions-item>

                <el-descriptions-item label="Files">
                  <p v-for="file in item.files" :key="file.id + 'file'">
                    <el-link type="primary" :href="file.url"><i class="el-icon-download"></i>{{ file.name }}</el-link>
                  </p>
                </el-descriptions-item>

                <el-descriptions-item>
                  <el-row :gutter="20" style="
                      margin-top: 5px;
                      color: #004F7C;
                      font-weight: 700 !important;
                      margin-bottom: 5px;
                    ">
                    <el-col :span="4">DG</el-col>
                    <el-col v-show="item.hazardousMaterials == '{}'" :span="3">Batteries</el-col>
                    <el-col v-show="item.hazardousMaterials != '{}'" v-for="dict in getDictDatas(
    DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS
  )" :key="dict.value" :span="4">{{ dict.label }}
                    </el-col>
                  </el-row>
                  <el-row style="margin-top: 10px" :gutter="20">
                    <el-col :span="4">
                      <el-switch :active-value="1" :inactive-value="0" v-model="item.dg" active-text="Yes" disabled
                                 inactive-text="No">
                      </el-switch>
                      <span v-show="false">{{
    (item.dg = item.hazardousMaterials == "{}" ? 0 : 1)
  }}</span>
                    </el-col>
                    <el-col v-for="dict in getDictDatas(
    DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS
  )" :key="'d' + dict.value" :span="4" v-show="item.hazardousMaterials != '{}'">
                      {{ JSON.parse(item.hazardousMaterials)[dict.value] }}
                    </el-col>

                    <el-col :span="20" v-show="item.hazardousMaterials == '{}'">
                      <el-radio-group @input="changeBatteries(item)" v-model="item.batteries" disabled>
                        <el-radio :label="2" border>Has batteries</el-radio>
                        <el-radio :label="3" border>No batteries</el-radio>
                      </el-radio-group>
                    </el-col>
                  </el-row>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </div>
        </div>
        <br/>
      </el-tab-pane>
      <el-tab-pane label="Shipped Containers" name="four">
        <div style="padding: 20px;">
          <el-empty v-if="shipment.containerDOList.filter((item) => item.type == 1).length == 0"></el-empty>
          <el-row type="flex" justify="end">
            <el-col :span="2">
              <el-button style="margin-bottom: 10px"
                         v-if="shipment.containerDOList.filter((item) => item.type == 1).length" @click="handleExport"
                         v-loading="exportLoading">Export Data
              </el-button>
            </el-col>
          </el-row>
          <el-card style="padding: 0px;margin-bottom: 20px;position: relative;"
                   v-for="container in shipment.containerDOList.filter((item) => item.type == 1)">
            <div style="    position: absolute;
    cursor: pointer;
    right: 0px;
    top: 20px;
    z-index: 999;">
              <span style="color:#fff;position: absolute;cursor: pointer;right: 80px;top:20px;"
                    @click="openContainerMovement(container.containerNo)">Add Status1</span>
              <svg v-if="!expanded[container.containerNo]" @click="toggleDetails(container.containerNo)" style="position: absolute;cursor: pointer;
    right: 20px;top:20px" width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 36L12 24L24 12" stroke="#fff" stroke-width="4" stroke-linecap="round"
                      stroke-linejoin="round"/>
                <path d="M36 36L24 24L36 12" stroke="#fff" stroke-width="4" stroke-linecap="round"
                      stroke-linejoin="round"/>
              </svg>

              <svg v-if="expanded[container.containerNo]" @click="toggleDetails(container.containerNo)"
                   style="position: absolute;cursor: pointer;right: 20px;top:20px" width="30" height="30"
                   viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M36 12L24 24L12 12" stroke="#fff" stroke-width="4" stroke-linecap="round"
                      stroke-linejoin="round"/>
                <path d="M36 24L24 36L12 24" stroke="#fff" stroke-width="4" stroke-linecap="round"
                      stroke-linejoin="round"/>
              </svg>

            </div>
            <el-row style="float: left;width: 50%;padding: 20px;margin: 0px;">

              <el-col :span="6">
                <p>Container</p>
                <p>{{ container.containerNo }}</p>
              </el-col>
              <el-col :span="6">
                <p>Seal Number</p>
                <p>{{ container.containerSealNumber }}</p>
              </el-col>
              <el-col :span="3">
                <p>Type</p>
                <p>{{ container.containerType }}</p>
              </el-col>
              <el-col :span="3">
                <p>SOC</p>
                <p>{{ container.soc=='true'?'Yes':'No' }}</p>
              </el-col>
              <el-col :span="6">
                <p>Lastest Move </p>

                <p v-if="containerMovementList.filter(item => item.containerNo == container.containerNo).length > 0">
                  {{ originDeliveryMap[containerMovementList.filter(item => item.containerNo == container.containerNo)[
                  containerMovementList.filter(item => item.containerNo == container.containerNo).length - 1
                  ].port] ? originDeliveryMap[containerMovementList.filter(item => item.containerNo ==
                  container.containerNo)[
                  containerMovementList.filter(item => item.containerNo == container.containerNo).length - 1
                  ].port] : containerMovementList.filter(item => item.containerNo == container.containerNo)[
                  containerMovementList.filter(item => item.containerNo == container.containerNo).length - 1
                  ].port }}
                </p>
              </el-col>
            </el-row>

            <el-row
              style="float: left;width: 50%;background: #004F7C;padding: 20px;margin: 0px;color: #fff;height:105px">
              <el-col :span="6">
                <p>Volume</p>
                <p>{{
                  shipment.containerMap ? shipment.containerMap[container.containerNo] ?
                  shipment.containerMap[container.containerNo].volume.toFixed(3) : 'NotLoad':'' }}</p>
              </el-col>
              <el-col :span="18">
                <p>Loaded Lots</p>
                <p>
                  <el-link :href="'/purchaseorder/POManagement?orderNumber=' + shipment.orderMap[orderId]"
                           style="color: #fff;margin-right: 15px;"
                           v-for="(orderId, index) in shipment.containerMap ? shipment.containerMap[container.containerNo] ? shipment.containerMap[container.containerNo].orderIds : [] : []">
                    {{ shipment.orderMap[orderId] + '(qty:' + shipment.containerMap[container.containerNo].qtys[index]
                    + ',volume:' + shipment.containerMap[container.containerNo].cbms[index] + ')' }}
                  </el-link>
                </p>
              </el-col>
            </el-row>
            <div style="clear: both;"></div>
            <el-collapse-transition>
              <div v-show="expanded[container.containerNo]">
                <el-row :gutter="30" style="font-size: 14px; color: #004F7C;padding: 20px;margin-left: 40px;">
                  <el-col :span="6">Date</el-col>
                  <el-col :span="6">Location</el-col>
                  <el-col :span="6">Description</el-col>
                  <el-col :span="6">Vessel/Voyage</el-col>
                </el-row>
                <el-timeline>
                  <el-timeline-item
                    v-for="move in containerMovementList.filter(item => item.containerNo == container.containerNo)"
                    placement="top">
                    <el-row :gutter="30" style="font-size: 13px; padding: 20px;">

                      <el-col :span="6">
                        {{ parseTime(new Date(move.eventTime), '{y}-{m}-{d} {h}:{i}') }}
                      </el-col>
                      <el-col :span="6">
                        <span style="display:inline-block;width:100px">{{
    originDeliveryMap[move.port] ? originDeliveryMap[move.port] : move.port }}</span>
                      </el-col>
                      <el-col :span="6">
                        <span v-if="shipment.carrier != 'TSHG'">{{
    containerStatus[move.eventCode] ? containerStatus[move.eventCode] : move.descriptionEn }}
                        </span>
                        <span v-if="shipment.carrier == 'TSHG'">{{
    containerStatus[move.eventCode] ? containerStatus[move.eventCode] : move.eventCode }}
                        </span>
                      </el-col>
                      <el-col :span="6">
                        <el-link type="primary" :href="'/track/ship?vesselName=' + vesselMap[move.vessel]"
                                 target="_blank">
                          {{ move.vessel }}/{{ move.voyage }}
                        </el-link>
                      </el-col>
                    </el-row>
                  </el-timeline-item>

                </el-timeline>
              </div>
            </el-collapse-transition>

          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="$auth.hasPermi('shipment:map')" label="Map" name="map">

        <div v-loading="!shipment.showIframe && shipment.showIframe2" class="el-loading-spinner"
             element-loading-text="Loading">
          <el-empty description="No Data" v-show=" !shipment.showIframe"></el-empty>
          <iframe v-if="shipment.showIframe" id="iframe1" style="width: 100%; height: 700px;" :src="shipment.iframeUrl"
                  frameborder="0" loading="lazy"></iframe>
        </div>

      </el-tab-pane>
      <el-tab-pane label="Shipping Instructions" name="second">
        <el-empty description="No Data" v-show="siList.length == 0"></el-empty>
        <el-descriptions style="margin-bottom: 10px;background: #fff;padding:12px 0px!important" :colon="false"
                         direction="vertical" v-for="(item, i) in siList" :key="'product' + i" class="margin-top"
                         title="" :column="6">


          <el-descriptions-item :label="$t('booking.productEnglishName')">{{
            item.productEnglishName
            }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('booking.hsCode')">{{
            item.hscode
            }}
          </el-descriptions-item>
          <el-descriptions-item label="Number Of Packages">{{
            item.numberOfPackages
            }}
          </el-descriptions-item>
          <el-descriptions-item label="Packages">{{
            item.packages
            }}
          </el-descriptions-item>
          <el-descriptions-item label="Gross Weight(KG)">{{
            item.grossWeight
            }}
          </el-descriptions-item>
          <el-descriptions-item v-if="item.containerId != null" label="Container Type">{{
            item.containerId ? shippedContainer[item.containerId].containerType : ''
            }}
          </el-descriptions-item>
          <el-descriptions-item v-if="item.containerId != null" label="Container No">{{
            item.containerId ? shippedContainer[item.containerId].containerNo : ''
            }}
          </el-descriptions-item>
          <el-descriptions-item v-if="item.containerId != null" label="Container Seal Number">{{
            item.containerId ? shippedContainer[item.containerId].containerSealNumber : ''
            }}
          </el-descriptions-item>
          <el-descriptions-item label="Volume(CBM)">{{ item.volume }}</el-descriptions-item>
        </el-descriptions>
        <el-row v-show="siList.length > 0">
          <el-col :span="6">
            <b>Total Gross Weight:</b>
            {{ siList.reduce((sum, item) => sum + (Number(item?.grossWeight) || 0), 0).toFixed(3) }}
          </el-col>
          <el-col :span="6">
            <b>Total CBM:</b>
            {{ siList.reduce((sum, item) => sum + (Number(item?.volume) || 0), 0).toFixed(3) }}
          </el-col>
          <el-col :span="6">
            <b>Total Number of Packages:</b>
            {{ siList.reduce((sum, item) => sum + (Number(item?.numberOfPackages) || 0), 0) }}
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="Verified Gross Mass" name="thrid">
        <el-card style="padding:15px">
          <el-table :data="shipment.shipmentVgmDOS.filter(item=>item.type==1)" style="width: 100%">
            <el-table-column prop="date" label="Container Type" width="180">
              <template v-slot="scope">
                {{ shippedContainer[scope.row.containerId].containerType }}
              </template>
            </el-table-column>
            <el-table-column prop="name" label="Container No" width="180">
              <template v-slot="scope">
                {{ shippedContainer[scope.row.containerId].containerNo }}
              </template>
            </el-table-column>
            <el-table-column
              prop="vgm"
              label="VGM(KG)">
            </el-table-column>
            <el-table-column
              prop="tareWeight"
              label="Tare Weight">

            </el-table-column>
            <el-table-column
              prop="grossWeight"
              label="Gross Weight">
            </el-table-column>
            <el-table-column
              prop="vgmMethod"
              label="Vgm Method">
            </el-table-column>
            <el-table-column
              prop="sign"
              label="Sign">
            </el-table-column>
            <el-table-column
              v-if="shipment.carrier!='TSHG'"
              prop="weighingCertificateNumber"
              label="Weighing Certificate Number"
              width="180">
            </el-table-column>
            <el-table-column
              v-if="shipment.carrier!='TSHG'"
              prop="weighingTime"
              label="Weighing Time"
              width="140">
              <template v-slot="scope">
                {{parseTime(scope.row.weighingTime)}}
              </template>
            </el-table-column>
            <el-table-column
              prop="soc"
              label="SOC">
              <template v-slot="scope">
                {{ scope.row.soc?true:false }}
              </template>
            </el-table-column>
          </el-table>
          <el-row v-show="shipment.shipmentVgmDOS.length > 0">
            <el-col :span="6">
              <b>Total VGM:</b>
              {{ shipment.shipmentVgmDOS.reduce((sum, item) => sum + (Number(item?.vgm) || 0), 0).toFixed(3) }}
            </el-col>
          </el-row>
        </el-card>
      </el-tab-pane>

      <el-tab-pane v-if="$auth.hasPermi('shipment:detail:agent')" label="Pre alert" name="thrid1">
        <div v-if="$auth.hasPermi('shipment:detail:addAgent')" style="height: 30px;">
          <div style="float: left;">
            <el-button @click="openDestinationAgent" type="primary">Create Pre alert</el-button>
          </div>

          <div style="float: right;">
            <svg v-show="agentDetail.id!=null" @click="handleSendEmail" width="30" height="30" viewBox="0 0 48 48"
                 fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M36 15H44V28V41H4V28V15H12" stroke="#004F7C" stroke-width="4" stroke-linecap="round"
                    stroke-linejoin="round"/>
              <path d="M24 19V5" stroke="#004F7C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M30 11L24 5L18 11" stroke="#004F7C" stroke-width="4" stroke-linecap="round"
                    stroke-linejoin="round"/>
              <path d="M4 15L24 30L44 15" stroke="#004F7C" stroke-width="4" stroke-linecap="round"
                    stroke-linejoin="round"/>
            </svg>
          </div>

          <div style="float: right;">
            <div style="padding-top:5px;">
              <el-tooltip v-show="agentDetail.sendEmailTime!=null" class="item-tabs" effect="light"
                          placement="bottom-start"
                          slot="label">
                <span slot="content">{{ parseTime(agentDetail.sendEmailTime) }} </span>
                <el-tag :type=" agentDetail.sendEmailTime==null?'danger':'' ">
                  <span style="font-size: 14px;">{{ agentDetail.sendEmailTime==null?'Pending':'Done' }}</span>
                </el-tag>
              </el-tooltip>
              <el-tag v-show="agentDetail.sendEmailTime==null" :type=" agentDetail.sendEmailTime==null?'danger':'' ">
                <span style="font-size: 14px;">{{ agentDetail.sendEmailTime==null?'Pending':'Done' }}</span>
              </el-tag>
            </div>
          </div>

        </div>
        <el-empty description="No Data" v-show="agentDetail.id==null"></el-empty>
        <div v-show="agentDetail.id!=null">
          <el-card style="padding:15px;margin-top: 10px;">
            <div><b style="font-size: 15px;margin-left: 10px;">Destination Agent
            </b></div>
            <el-descriptions direction="vertical" :colon="false" :column="4" style="box-shadow: none;">
              <el-descriptions-item label="Destination Agent">{{ agentDetail.agent }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
          <el-card style="padding:15px;margin-top: 10px;">
            <div><b style="font-size: 15px;margin-left: 10px;">Free Time at POD
            </b></div>
            <el-descriptions direction="vertical" :colon="false" :column="4" style="box-shadow: none;">
              <el-descriptions-item label="Detention">{{agentDetail.detention }} Days</el-descriptions-item>
              <el-descriptions-item label="Demurrage">{{ agentDetail.dumurrage }} Days</el-descriptions-item>
            </el-descriptions>
          </el-card>
          <el-card style="padding:15px;margin-top: 10px;">
            <div><b style="font-size: 15px;margin-left: 10px;">Destination Clearance
            </b></div>
            <el-descriptions direction="vertical" :colon="false" :column="4" style="box-shadow: none;">
              <el-descriptions-item label="Normal Customs Clearance">{{
                agentDetail.normalCustomsClearance==true?"Yes":"No" }}
              </el-descriptions-item>
              <el-descriptions-item label="DA must pre-pay duties and tax">{{
                agentDetail.prePayDutiesAndTax==true?"Yes":"No" }}
              </el-descriptions-item>
              <el-descriptions-item label="Fiscal-Customs Clearance">{{
                agentDetail.fiscalCustomsClearance==true?"Yes":"No" }}
              </el-descriptions-item>
              <el-descriptions-item label="T1-Customs Clearance">{{ agentDetail.t1CustomsClearance==true?"Yes":"No" }}
              </el-descriptions-item>
              <el-descriptions-item label="Comments">{{ agentDetail.normalComments }}</el-descriptions-item>
              <el-descriptions-item label="Taxes and duties to be billed to">{{ agentDetail.taxesBillto }}
              </el-descriptions-item>
              <el-descriptions-item label="Comments">{{ agentDetail.fiscalComments }}</el-descriptions-item>
              <el-descriptions-item label="Comments">{{ agentDetail.t1Comments }}</el-descriptions-item>
              <el-descriptions-item label="Customs clearance to be billed to">{{ agentDetail.customsBillto }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
          <el-card style="padding:15px;margin-top: 10px;">
            <div><b style="font-size: 15px;margin-left: 10px;">Destination Delivery</b></div>
            <el-descriptions direction="vertical" :colon="false" :column="4" style="box-shadow: none;">
              <el-descriptions-item label="Destination Delivery">{{ agentDetail.destinationDelivery==true?"Yes":"No"
                }}
              </el-descriptions-item>
              <el-descriptions-item label="Transport Mode">{{ agentDetail.transportMode }}</el-descriptions-item>
              <el-descriptions-item label="Destination delivery to be billed to">{{
                agentDetail.destinationDeliveryBillto }}
              </el-descriptions-item>
              <el-descriptions-item label="Destination address">{{ agentDetail.destinationDeliveryComments }}
              </el-descriptions-item>
              <el-descriptions-item label="Agreed Cost">{{ agentDetail.agreedCostDelivery }}</el-descriptions-item>
            </el-descriptions>
          </el-card>


          <el-card style="padding:15px;margin-top: 10px;">
            <div><b style="font-size: 15px;margin-left: 10px;">Destination Local Charges</b></div>
            <el-descriptions direction="vertical" :colon="false" :column="4" style="box-shadow: none;">

              <el-descriptions-item label="Agreed Cost">{{ agentDetail.agreedCost }}</el-descriptions-item>
              <el-descriptions-item label="Destination Local Charges to be Billed to">{{ agentDetail.destinationBillto
                }}
              </el-descriptions-item>

            </el-descriptions>
          </el-card>


          <el-card style="padding:15px;margin-top: 10px;">
            <div><b style="font-size: 15px;margin-left: 10px;">Comments to agent
            </b></div>
            <el-descriptions direction="vertical" :colon="false" :column="4" style="box-shadow: none;">
              <el-descriptions-item label="Comments to agent">{{ agentDetail.comments }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </div>
      </el-tab-pane>
      <!-- -----------------change historical start-------------------- -->
      <el-tab-pane label="Change Log" name="six">
        <el-empty description="No Data"
                  v-show="shipLogList.filter(item => Number(item.type) < 4 && item.msg!='').length == 0"></el-empty>
        <el-card style="padding:11px"
                 v-show="shipLogList.filter(item => Number(item.type) < 4 && item.msg!='').length > 0">
          <el-timeline style="margin-top: 30px">
            <el-timeline-item :timestamp=(item.timeAndEmail) placement="top"
                              v-for="(item, i) in shipLogList.filter(item => Number(item.type) < 4 && item.msg!=''&& item.msg!=null && item.msg.indexOf('null') === -1 )"
                              :key="i">
              <div v-html="item.msg.replace(/\001/g, '<br>')"></div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-tab-pane>
      <!-- -----------------change historical end-------------------- -->
      <el-tab-pane label="Documents" name="fileList">
        <!-- 对话框(上传/下载模板) -->
        <el-dialog :title="uploadDocument.title" :visible.sync="uploadDocument.open" width="600px" append-to-body
                   v-loading="uploadDocument.loading">
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
            <!--            如果是选择HBL 并且是shipping Order 的情况下，需要指定哪一个 shipping Order -->
            <el-form-item label="SO ref" v-if="uploadDocument.formData.type == '2' && shipment.fromShippingOrder"
                          required prop="otherId">
              <el-select v-model="uploadDocument.formData.otherId">
                <el-option v-for="(type, index) in spoList" :key="index" :label="type.soRef"
                           :value="type.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('document.status')" v-if="uploadDocument.formData.type != '3'" required
                          prop="type2">
              <el-select v-model="uploadDocument.formData.type2">
                <el-option label="Seaway Bill" value="Seaway Bill"></el-option>
                <el-option label="Telex Released" value="Telex Released"></el-option>
                <el-option label="Original" value="Issued"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('document.email')" v-if="uploadDocument.formData.type != '3'">
              <el-input type="textarea" placeholder="" v-model="uploadDocument.formData.email" size="mini" :rows="3"
                        maxlength="1000" show-word-limit resize="none" @change="handeDocumentEmailTrim">
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('document.documentFile')">

              <el-upload ref="uploadShipmentDocument" :limit="1" :headers="uploadDocument.headers"
                         :action="uploadAction" :file-list="uploadDocument.fileList"
                         :data="uploadDocument.formData" :on-progress="handleFileUploadProgress"
                         :on-success="handleFileSuccess"
                         :on-change="(file, files) => handleFileChangeThen(file,  files, () => {this.uploadDocument.fileList = files}, () => {this.uploadDocument.fileList = []})"
                         :auto-upload="false" drag>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  {{ $t("purchaseOrder.DragTheFileHereOr")
                  }}<em>{{ $t("purchaseOrder.clickUpload") }}</em>
                </div>
              </el-upload>
            </el-form-item>
            <el-tooltip v-if="!this.showSendEmail && uploadDocument.formData.type != '3'"
                        :content="$t('document.sendEmail')" placement="bottom"
                        effect="light">
              <el-checkbox v-model="uploadDocument.formData.sendEmail" icon="el-icon-message"><i
                class="el-icon-message"></i></el-checkbox>
            </el-tooltip>


            <el-button size="mini" type="primary" style="float:right;" :loading="uploadDocument.loading"
                       @click="submitFileForm">{{
              $t("purchaseOrder.confirm") }}
            </el-button>
            <el-button size="mini" style="float:right; margin-right: 10px;" :loading="uploadDocument.loading"
                       @click="uploadDocument.open = false">{{
              $t("purchaseOrder.cancel") }}
            </el-button>
          </el-form>


        </el-dialog>

        <el-skeleton :rows="6" animated :loading="fileListLoading" style=" height: 550px;">
          <div class="file-list">
            <el-row v-hasPermi="['shipment:bl_file:upload']">
              <el-col>
                <el-button type="primary" size="mini" @click="clickUploadFile">Upload File</el-button>

              </el-col>
            </el-row>
            <div style="margin-top:20px">
              <el-row :gutter="20">
                <el-col :span="8" v-hasPermi="['shipment:bl_file:mbl']">
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>Carrier Bill of Lading</span>
                    </div>
                    <el-empty v-show="carrierBillList.length == 0" description="No Document"></el-empty>
                    <div v-for="file in carrierBillList" class="text-upload" size="mini">
                      <div class="tools-but">
                        <ActionButton :url='file.url' iconType="el-icon-view" type='preview'
                          :fileName='file.name' buttonType="text" />
                        <ActionButton :url='file.url' iconType="el-icon-download" type='download' :fileName='file.name' buttonType="text" />
                        <!-- <span> <el-link :href="file.url" :title="file.name"> <i
                          class="el-icon-download"/></el-link></span> -->
                        <span v-show="file.creator==user.id" @click="openDocumentDialog(file)"> <i
                          class="el-icon-edit"/></span>
                        <span v-show="file.creator==user.id" @click="deleteDocument(file)"> <i class="el-icon-delete"/></span>
                      </div>
                      <el-descriptions :column="1" label-class-name="file-item-label" style="height: 250px;">
                        <el-descriptions-item :label="$t('document.name')">{{ file.name }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('document.uploadedBy')">{{ file.updater }}
                        </el-descriptions-item>
                        <el-descriptions-item
                          :label="$t('document.uploadedOn')">{{ formatUserLocalTime(file.updateTime, file.timeZone, file.timeZoneOffset) }}
                        </el-descriptions-item>
                        <el-descriptions-item
                          :label="$t('document.documentNumber')">{{ file.documentNumber }}
                        </el-descriptions-item>
                        <el-descriptions-item
                          :label="$t('document.status')">{{ covStatus(file.type2) }}
                        </el-descriptions-item>
                      </el-descriptions>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8" v-hasPermi="['shipment:bl_file:hbl']">
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>House Bill of Lading</span>
                    </div>
                    <el-empty v-show="houseBillList.length == 0" description="No Document"></el-empty>
                    <div v-for="file in houseBillList" class="text-upload" size="mini">
                      <div class="tools-but">
                        <ActionButton :url='file.url' iconType="el-icon-view" type='preview' :fileName='file.name' buttonType="text" />
                        <ActionButton :url='file.url' iconType="el-icon-download" type='download' :fileName='file.name' buttonType="text" />
                        <!-- <span> <el-link :href="file.url" :title="file.name"> <i
                          class="el-icon-download"/></el-link></span> -->
                        <span v-show="file.creator==user.id" @click="openDocumentDialog(file)"> <i
                          class="el-icon-edit"/></span>
                        <span v-show="file.creator==user.id" @click="deleteDocument(file)"> <i class="el-icon-delete"/></span>
                      </div>
                      <el-descriptions :column="1" label-class-name="file-item-label" style="height: 250px;">
                        <el-descriptions-item :label="$t('document.name')">{{ file.name }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('document.uploadedBy')">{{ file.updater }}
                        </el-descriptions-item>
                        <el-descriptions-item
                          :label="$t('document.uploadedOn')">{{ formatUserLocalTime(file.updateTime, file.timeZone, file.timeZoneOffset) }}
                        </el-descriptions-item>
                        <el-descriptions-item
                          :label="$t('document.documentNumber')">{{ file.documentNumber }}
                        </el-descriptions-item>
                        <el-descriptions-item
                          :label="$t('document.status')">{{ covStatus(file.type2) }}
                        </el-descriptions-item>
                      </el-descriptions>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8" v-hasPermi="['shipment:bl_file:others']">
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>Others</span>
                    </div>
                    <el-empty v-show="othersList.length == 0" description="No Document"></el-empty>
                    <div v-for="file in othersList" class="text-upload" size="mini">
                      <div class="tools-but">
                        <ActionButton :url='file.url' iconType="el-icon-view" type='preview' :fileName='file.name' buttonType="text" />
                        <ActionButton :url='file.url' iconType="el-icon-download" type='download' :fileName='file.name' buttonType="text" />
                        <!-- <span> <el-link :href="file.url" :title="file.name"> <i
                          class="el-icon-download"/></el-link></span> -->
                        <span v-show="file.creator==user.id" @click="openDocumentDialog(file)"> <i
                          class="el-icon-edit"/></span>
                        <span v-show="file.creator==user.id" @click="deleteDocument(file)"> <i class="el-icon-delete"/></span>
                      </div>
                      <el-descriptions :column="1" label-class-name="file-item-label" style="height: 250px;">
                        <el-descriptions-item :label="$t('document.name')">{{ file.name }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('document.uploadedBy')">{{ file.updater }}
                        </el-descriptions-item>
                        <el-descriptions-item
                          :label="$t('document.uploadedOn')">{{ formatUserLocalTime(file.updateTime, file.timeZone, file.timeZoneOffset) }}
                        </el-descriptions-item>
                        <el-descriptions-item
                          :label="$t('document.documentNumber')">{{ file.documentNumber }}
                        </el-descriptions-item>
                      </el-descriptions>
                    </div>
                  </el-card>
                </el-col>
              </el-row>


            </div>


          </div>
        </el-skeleton>
      </el-tab-pane>

      <el-tab-pane v-if="false" label="Third Party Respose" name="getThirdPartyRes">
        <el-table :data="cargooResData" style="width: 100%">
          <el-table-column prop="type" label="Type" width="180">
            <template v-slot="scope">
              {{ scope.row.t_flag == 1 ? 'MOOV error.' : 'CARGOO Error' }}
            </template>
          </el-table-column>
          <el-table-column prop="type" label="Status" width="180">
            <template v-slot="scope">
              {{ scope.row.t_flag == 1 ? 'FullFail' :
              JSON.parse(scope.row.cargoo_resp_body).status
              }}
            </template>
          </el-table-column>
          <el-table-column prop="result" label="Result">
            <template v-slot="scope">
              {{
              scope.row.t_flag == 1 ? scope.row.cargoo_resp_body :
              JSON.parse(scope.row.cargoo_resp_body).childMappingInformation[0].reasonOfFailure
              }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="Comments" name="comments">
        <el-button style="margin-bottom: 20px;" type="primary" @click="commentsDialogVisible = true">Add comments</el-button>
        <el-dialog title="Add comments" :visible.sync="commentsDialogVisible" width="800px">
          <div style="border: 1px solid #ccc;">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode"/>
            <Editor style="height: 260px; overflow-y: hidden;" v-model="html" :defaultConfig="editorConfig" :mode="mode" @onCreated="onCreated"/>
          </div>
          <div style="text-align: right;margin-top: 10px;">
            <el-button type="primary" @click="shipLogCreate">Submit</el-button>
          </div>
        </el-dialog>


        <el-empty v-if="shipLogList.filter(item => item.type == '4').length == 0"></el-empty>
        <el-timeline>
          <el-timeline-item v-for="(item, i) in shipLogList.filter(item => item.type == '4')" :key="i" :timestamp="formatUserLocalTime(item.createTime, item.timeZone, item.timeZoneOffset) " placement="top">
            <el-card style="padding: 15px;" class="card-with-fixed-button">
              <!-- 固定在右上角的按钮 -->
              <div v-if="item.creator == userId" class="card-top-right-actions">
                <el-button type="danger" icon="el-icon-delete" @click="shipLogDelete(item)"></el-button>
              </div>
              <div class="htmldiv" v-html="item.logInfo"></div>
              <p>{{ item.email }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <!-- <div class="htmldiv" v-html="html"></div>  -->
      </el-tab-pane>

    </el-tabs>

    <!-- cancel booking 弹窗 begin-->
    <el-dialog :visible.sync="centerDialogVisible" width="50%" @close="closeCenterDialog">
      <div class="cancelBookingForm">
        <el-row>
          <el-col :span="24" style="margin-top: -35px; padding-bottom: 10px">
            <h4>Cancel Option</h4>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <h5><b style="font-size: 15px">{{ cancelTitle }} Category</b></h5>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-select clearable v-model="shipment.cancelCode" size="mini" placeholder=""
                       @change="getCancelReason($event)" @clear="clearSelCancelCategory">
              <el-option v-for="item in selCancelCategory" :key="item.enumId" :label="item.description"
                         :value="item.enumId">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <h5><b style="font-size: 15px">{{ cancelTitle }} Reason</b></h5>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-select clearable v-model="shipment.cancelSubCode" size="mini" placeholder=""
                       @change="changeSelCancelReason($event)" no-data-text="Please select Cancel Category first">
              <el-option v-for="item in selectCancelReason" :key="item.enumId" :label="item.description"
                         :value="item.enumId">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <h5><b style="font-size: 15px">{{ cancelTitle }} Remark</b></h5>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-input
              type="textarea"
              placeholder=""
              @blur="shipment.cancelRemark = $event.target.value.trim()"
              v-model="shipment.cancelRemark"
              size="mini"
              :rows="3"
              maxlength="1000"
              show-word-limit
              resize="none">
            </el-input>
          </el-col>
        </el-row>

        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" style="margin-top: 20px; margin-bottom: 15px"
                     @click="cancelShipment">Submit</el-button>
        </span>
      </div>
    </el-dialog>
    <!-- cancel booking 弹窗 end-->

    <el-dialog title="Import Container No Failed" :visible.sync="errorDialog">
      <el-table :data="gridData">
        <el-table-column property="index" label="Line" width="150"></el-table-column>
        <el-table-column property="containerType" label="Type" width="200">
          <template slot-scope="scope">
            {{ scope.row.subContainerType? scope.row.subContainerType:scope.row.containerType}}
          </template>
        </el-table-column>
        <el-table-column property="containerNo" label="Container No"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="Import HS code Failed" :visible.sync="checkHsCodeDialog">
      <el-table :data="hsCodeData">
        <el-table-column property="hsCode" label="HS code" width="200">
          <template slot-scope="scope">
            {{ hsCodeData[scope.$index] }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>


    <el-dialog title="Tmff" :visible.sync="visableTmff" width="100%" :fullscreen="true"
               append-to-body class="bg-g" v-loading="formTmffLoading" destroy-on-close>

      <div style="overflow-y: auto; overflow-x: hidden;background:#f3f5f8">

        <el-card style="padding:15px;margin-top: 15px;     overflow: auto;  min-height: 700px;">
          <el-form ref="tmffForm" :model="tmffForm" v-loading="formTmffLoading" :show-message="false">
            <el-row :gutter="20" style="padding-bottom: 10px;">
              <el-col :span="3">
                Master Bill of Lading
              </el-col>
              <el-col :span="3">
                BLno to copy(TMFF)
              </el-col>
              <el-col :span="3">
                <el-form-item required prop="mblNo">
                  <el-input v-model="tmffForm.mblNo" @blur="tmffForm.mblNo = $event.target.value.trim()"
                            autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="3">
                House Bill of Lading
              </el-col>

              <el-col :span="4" v-if="tmffButShow">
                <el-button @click="addHBLRow" type="text" icon="el-icon-plus">Add HBL</el-button>
              </el-col>
            </el-row>
            <el-collapse>
              <el-collapse-item v-for="(item, i) in tmffForm.product" :key="i" class="tmff-css">
                <template slot="title">
                  <el-row :gutter="20" style="padding-bottom: 10px;" class="el-collapse-item-title">
                    <el-col :span="2">
                      HBL{{i+1}}
                    </el-col>
                    <el-col :span="3">
                      BLno to copy(TMFF)
                    </el-col>
                    <el-col :span="3">
                      <el-form-item required :prop="'product.' + i + '.hblNo'" style="margin-top: 10px;">
                        <el-input v-model="item.hblNo" @blur="item.hblNo = $event.target.value.trim()" size="mini"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      Total Packages: {{item.tmffTotalPackages}}
                    </el-col>
                    <el-col :span="4">
                      Total Gross Weight: {{item.tmffTotalWeight}}
                    </el-col>
                    <el-col :span="5">
                      Total Total Volume(CBM): {{item.tmffTotalCbm}}
                    </el-col>
                    <el-col :span="3" v-if="tmffButShow">
                      <el-button v-if="tmffForm.product.length > 1" @click="deleteTmffHBL(i)" type="text"
                                 icon="el-icon-delete">Delete HBL
                      </el-button>
                    </el-col>

                  </el-row>
                </template>
                <div>
                  <el-table :data="item.subItemData"
                            stripe
                            max-height="200"
                            style="width: 100%">
                    <el-table-column
                      label="Order Number"
                      prop="name">
                      <template slot-scope="scope">
                        <el-form-item required :prop="'product.' + i + '.subItemData.' + scope.$index + '.soNumber'">
                          <el-select
                            v-model="scope.row.soNumber"
                            filterable
                            @clear="clearItemOrderRow(scope.row , i) "
                            clearable @change="changeItemOrderRow(scope.row , i)">
          <!-- 2025-11-06 haikang 动态过滤选项：排除已选中的值（当前行自己的选中值除外） -->
                            <el-option
                              v-for="item in getFilteredOptions(scope.row)"
                              :key="item.shipperOrderId"
                              :label="item.soNumber"
                              :value="item.soNumber"
                            />
                          </el-select>
                        </el-form-item>
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="Package Type"
                      prop="bookedUnit">
                    </el-table-column>
                    <el-table-column
                      label="No of Package"
                      prop="bookQty">
                      <template slot-scope="scope">
                        <el-input-number v-model="scope.row.bookQty" @input="sumTmffRowTotal(i)" :controls="false"
                                         :precision="0"/>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="Gross Weight"
                      prop="weight">
                      <template slot-scope="scope">
                        <el-input-number v-model="scope.row.weight" @input="sumTmffRowTotal(i)" :controls="false"
                                         :precision="3"/>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="Volume(CBM)"
                      prop="volume">
                      <template slot-scope="scope">
                        <el-input-number v-model="scope.row.volume" @input="sumTmffRowTotal(i)" :controls="false"
                                         :precision="3"/>
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="Container">
                      <template slot-scope="scope">
                        <el-tag style="margin-right: 5px" v-for="item in scope.row.typeList">
                          {{ item.type }} x {{ item.num }}
                        </el-tag>
                      </template>
                    </el-table-column>

                    <el-table-column align="right" v-if="tmffButShow">
                      <template slot="header" slot-scope="scope">
                        <el-button @click="tmffAddProductRow( item,   i)" type="text" icon="el-icon-plus">
                          Add Product
                        </el-button>
                      </template>
                      <template slot-scope="scope">
                        <el-button
                          v-if="item.subItemData.length > 1 "
                          size="mini"
                          type="text"
                          icon="el-icon-delete"
                          @click="deleteTmffItemRow(item, scope.$index , i)"
                        >{{ $t("search.delete") }}
                        </el-button>
                      </template>
                    </el-table-column>

                  </el-table>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-form>


          <div style="width:100%;margin-top: 10px;margin-left:10px">
            <el-row>
              <el-col :offset="8" :span="3">
                <b>No of Package</b>
              </el-col>
              <el-col :span="3">
                <b>Weight</b>
              </el-col>
              <el-col :span="3">
                <b>Volume(CBM)</b>
              </el-col>
            </el-row>
            <el-row>
              <el-col :offset="6" :span="2">
                <b>Total </b>
              </el-col>
              <el-col :span="3">
                {{tmffAllTotalPackages}}
              </el-col>
              <el-col :span="3">
                {{tmffAllTotalWeight }}
              </el-col>
              <el-col :span="3">
                {{tmffAllTotalCbm}}
              </el-col>
            </el-row>
            <el-row>
              <el-col :offset="6" :span="2">
                <b>Balance </b>
              </el-col>
              <el-col :span="3" :class="{ 'negative-value': tmffAllNotTotalPackages != 0 }">
                {{tmffAllNotTotalPackages}}
              </el-col>
              <el-col :span="3" :class="{ 'negative-value': tmffAllNotTotalWeight != 0 }">
                {{tmffAllNotTotalWeight }}
              </el-col>
              <el-col :span="3" :class="{ 'negative-value': tmffAllNotTotalCbm != 0 }">
                {{tmffAllNotTotalCbm}}
              </el-col>
            </el-row>
          </div>
        </el-card>


      </div>
      <div slot="footer" class="dialog-footer" v-if="tmffButShow">
        <el-button type="primary" :loading="loadingSaveBut" @click="submitTmff">Submit</el-button>
        <el-button @click="visableTmff = false">Cancel</el-button>
      </div>
    </el-dialog>
<!--    tmff查看弹窗-->
    <el-dialog title="Tmff" :visible.sync="visableTmff2" width="100%" :fullscreen="true"
               append-to-body class="bg-g" v-loading="formTmffLoading2" destroy-on-close>

      <div style="overflow-y: auto; overflow-x: hidden;background:#f3f5f8">

        <el-card style="padding:15px;margin-top: 15px;     overflow: auto;  min-height: 700px;">
          <el-form ref="tmffForm" :model="tmffForm2" v-loading="formTmffLoading2" :show-message="false">
            <el-row :gutter="20" style="padding-bottom: 10px;">
              <el-col :span="3">
                Master Bill of Lading
              </el-col>
              <el-col :span="3">
                BLno to copy(TMFF)
              </el-col>
              <el-col :span="3">
                <el-form-item required prop="mblNo">
                  <el-input v-model="tmffForm2.mblNo" @blur="tmffForm2.mblNo = $event.target.value.trim()"
                            autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="3">
                House Bill of Lading
              </el-col>

              <el-col :span="4" v-if="tmffButShow">
<!--                <el-button @click="addHBLRow" type="text" icon="el-icon-plus">Add HBL</el-button>-->
              </el-col>
            </el-row>
            <el-collapse>
              <el-collapse-item v-for="(item, i) in tmffForm2.product" :key="i" class="tmff-css">
                <template slot="title">
                  <el-row :gutter="20" style="padding-bottom: 10px;" class="el-collapse-item-title">
                    <el-col :span="2">
                      HBL{{i+1}}
                    </el-col>
                    <el-col :span="3">
                      BLno to copy(TMFF)
                    </el-col>
                    <el-col :span="3">
                      <el-form-item required :prop="'product.' + i + '.hblNo'" style="margin-top: 10px;">
                        <el-input v-model="item.hblNo" @blur="item.hblNo = $event.target.value.trim()" size="mini"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      Total Packages: {{item.tmffTotalPackages}}
                    </el-col>
                    <el-col :span="4">
                      Total Gross Weight: {{item.tmffTotalWeight}}
                    </el-col>
                    <el-col :span="5">
                      Total Total Volume(CBM): {{item.tmffTotalCbm}}
                    </el-col>
                    <el-col :span="3" v-if="tmffButShow">
                    </el-col>

                  </el-row>
                </template>
                <div>
                  <el-table :data="item.subItemData"
                            stripe
                            max-height="200"
                            style="width: 100%">
                    <el-table-column
                      label="Order Number"
                      prop="name">
                      <template slot-scope="scope">
                        <el-form-item required :prop="'product.' + i + '.subItemData.' + scope.$index + '.soNumber'">
                          <el-select :disabled="true"
                            v-model="scope.row.orderNumber"
                            @change="changeItemOrderRow(scope.row , i)"
                          >
                          </el-select>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="Package Type"
                      prop="bookedUnit">
                    </el-table-column>
                    <el-table-column
                      label="No of Package"
                      prop="bookQty">
                      <template slot-scope="scope">
                        <el-input-number v-model="scope.row.bookQty" @input="sumTmffRowTotal(i)" :controls="false"
                                         :precision="0"/>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="Gross Weight"
                      prop="weight">
                      <template slot-scope="scope">
                        <el-input-number v-model="scope.row.weight" @input="sumTmffRowTotal(i)" :controls="false"
                                         :precision="3"/>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="Volume(CBM)"
                      prop="volume">
                      <template slot-scope="scope">
                        <el-input-number v-model="scope.row.volume" @input="sumTmffRowTotal(i)" :controls="false"
                                         :precision="3"/>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="Container">
                      <template slot-scope="scope">
                        <el-tag style="margin-right: 5px" v-for="item in scope.row.typeList">
                          {{ item.type }} x {{ item.num }}
                        </el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-form>


          <div style="width:100%;margin-top: 10px;margin-left:10px">
            <el-row>
              <el-col :offset="8" :span="3">
                <b>No of Package</b>
              </el-col>
              <el-col :span="3">
                <b>Weight</b>
              </el-col>
              <el-col :span="3">
                <b>Volume(CBM)</b>
              </el-col>
            </el-row>
            <el-row>
              <el-col :offset="6" :span="2">
                <b>Total </b>
              </el-col>
              <el-col :span="3">
                {{tmffAllTotalPackages}}
              </el-col>
              <el-col :span="3">
                {{tmffAllTotalWeight }}
              </el-col>
              <el-col :span="3">
                {{tmffAllTotalCbm}}
              </el-col>
            </el-row>
            <el-row>
              <el-col :offset="6" :span="2">
                <b>Balance </b>
              </el-col>
              <el-col :span="3" :class="{ 'negative-value': tmffAllNotTotalPackages2 != 0 }">
                {{tmffAllNotTotalPackages2}}
              </el-col>
              <el-col :span="3" :class="{ 'negative-value': tmffAllNotTotalWeight2 != 0 }">
                {{tmffAllNotTotalWeight2 }}
              </el-col>
              <el-col :span="3" :class="{ 'negative-value': tmffAllNotTotalCbm2 != 0 }">
                {{tmffAllNotTotalCbm2}}
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
    </el-dialog>

    <el-dialog width="80%" title="Add/Remove Shipping Order" :visible.sync="addRemoveSPOVisible">
      <div>
        <el-input style="width:200px;margin-right:20px" placeholder="SO ref" clearable
                  @clear="spoPage.pageNo = 1; getSpoPage()"
                  v-model="spoPage.soRef"/>
        <el-button @click="spoPage.pageNo = 1; getSpoPage()" type="primary">Search<i
          class="el-icon-search el-icon--right"></i></el-button>
      </div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-table :data="spoTable" style="width: 100%">
            <el-table-column width="80">
              <template v-slot="scope">
                <a style="float:left" @click="addSpo(scope.row)">
                  <svg width="30" height="30" viewBox="0 0 48 48"
                       fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="6" width="36" height="36" rx="3" fill="#2F88FF" stroke="#444" stroke-width="4"
                          stroke-linejoin="bevel"/>
                    <path d="M24 16V32" stroke="#FFF" stroke-width="4" stroke-linecap="square"
                          stroke-linejoin="bevel"/>
                    <path d="M16 24L32 24" stroke="#FFF" stroke-width="4" stroke-linecap="square"
                          stroke-linejoin="bevel"/>
                  </svg>
                </a>
                <svg style="float:left" v-show="selectSpoIds.indexOf(scope.row.id) > -1" width="20" height="20"
                     viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M43 11L16.875 37L5 25.1818" stroke="#444" stroke-width="4" stroke-linecap="square"
                        stroke-linejoin="bevel"/>
                </svg>
              </template>
            </el-table-column>
            <el-table-column prop="soRef" label="SO Ref" width="170">
            </el-table-column>
            <el-table-column prop="shipmentType" label="SO Type" width="80">
            </el-table-column>
            <el-table-column prop="originPort" label="POL" width="80">
            </el-table-column>
            <el-table-column prop="destinationPort" label="POD" width="80">
            </el-table-column>
          </el-table>
          <pagination v-show="spoPage.total > 0" :total="spoPage.total" :page.sync="spoPage.pageNo"
                      :limit.sync="spoPage.pageSize" :page-sizes="[10, 20, 50]" @pagination="getSpoPage"/>
        </el-col>
        <el-col :span="12">

          <el-table :data="selectedSpoTable" style="width: 100%">
            <el-table-column width="55">
              <template v-slot="scope">
                <a @click="subSpo(scope.$index)">
                  <svg width="30" height="30" viewBox="0 0 48 48" fill="none"
                       xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="6" width="36" height="36" rx="3" fill="#2F88FF" stroke="#444" stroke-width="4"
                          stroke-linejoin="bevel"/>
                    <path d="M16 24L32 24" stroke="#FFF" stroke-width="4" stroke-linecap="square"
                          stroke-linejoin="bevel"/>
                  </svg>
                </a>
              </template>
            </el-table-column>
            <el-table-column prop="soRef" label="SO Ref" width="170">
            </el-table-column>
            <el-table-column prop="shipmentType" label="SO Type" width="80">
            </el-table-column>
            <el-table-column prop="originPort" label="POL" width="80">
            </el-table-column>
            <el-table-column prop="destinationPort" label="POD" width="80">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col style="margin-top:10px;text-align:center">
          <el-button @click="addRemoveSPOVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitSpoChange">Submit</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :title="sendMail.title" :visible.sync="sendMail.open" width="70%" append-to-body>
      <el-form ref="sendMailForm" :show-message="false" size="mini" label-width="90px">
        <el-row :gutter="30">
          <el-col :span="24">
            <el-form-item label="TO" prop="toMail">
              <el-input v-model="sendMail.toMail"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Subject" prop="templateTitle">
              <el-input v-model="sendMail.templateTitle"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Content">
              <div style="border: 1px solid #ccc;">
                <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig"
                         :mode="mode"/>
                <Editor style="height: 400px; overflow-y: hidden;" v-model="sendMail.templateContent"
                        :defaultConfig="editorConfig" :mode="mode"
                        @onCreated="onCreated"/>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">

            <div v-show="preAlertFileList.length != 0">
              <div>Document</div>
              <div v-for="file in preAlertFileList" class="text-upload" size="mini">
                <div class="tools-but">
                  <span> <el-link :href="file.url" :title="file.name"> <i class="el-icon-download"/></el-link></span>
                  <span @click="deleteDocumentOfPreAlert(file)"> <i class="el-icon-delete"/></span>
                </div>


                <el-descriptions :column="1" label-class-name="file-item-label">
                  <el-descriptions-item :label="$t('document.name')">{{ file.name }}</el-descriptions-item>
                </el-descriptions>
              </div>
            </div>

          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">

        <el-button size="mini" type="primary" @click="submitMailForm">Send</el-button>
        <el-button size="mini" @click="sendMail.open = false">{{
          $t("purchaseOrder.cancel")
          }}
        </el-button>
      </div>
    </el-dialog>
    <shipping-order-dialog ref="shippingOrderDialog" :spoList="spoList" @submit="handleOrderSubmit"></shipping-order-dialog>

    <shipping-order-re-arrange-dialog ref="ShippingOrderReArrangeDialog" @submit="handleOrderSubmit"></shipping-order-re-arrange-dialog>

    <check-order-status-dialog ref="checkOrderStatusDialog"></check-order-status-dialog>
    <modify-dialog :modifyVisible="modifyVisible" :selCancelCategory="selCancelCategory" :selCancelReason="selCancelReason" :bookingNumber="shipment.bookingNumber" @onModifyClose="onModifyClose" />
  </div>
</template>

<style scoped>
  @charset "utf-8";

  body,
  html {
    font-size: 100%;
    padding: 0;
    margin: 0;
  }
  .negative-value {
    color: red;
  }
  .el-badge__content.is-fixed {
    right: 70px !important;
  }

  /* Reset */
  *,
  *:after,
  *:before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  /* Clearfix hack by Nicolas Gallagher: http://nicolasgallagher.com/micro-clearfix-hack/ */
  .clearfix:before,
  .clearfix:after {
    content: " ";
    display: table;
  }

  .tmff-css .el-collapse-item-title {
      width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0px !important;
      margin: 0px !important;
  }
  .el-descriptions__body{
      color: #004F7C;
    }
  .custom-select .el-input__inner {
    width: 200px;
  }

  .clearfix:after {
    clear: both;
  }

  body {
    font-weight: 500;
    font-size: 1.05em;
    font-family: figtree, "Microsoft YaHei", "Segoe UI", "Lucida Grande", Helvetica, Arial,
      sans-serif;
  }

  .el-message-box__headerbtn .el-message-box__close {
    color: #909399 !important;
  }

  .demo {
    padding: 25px 0;
  }

  .upload-shipment-file {
    padding-bottom: 10px;
  }
  .self-step2{
    width: 20px;
    display: inline-block;
    height: 20px;
    border-radius: 20px;
    color: #fff;
    line-height: 20px;
    text-align: center;
    font-weight: 700;
    position: relative;
    z-index: 999;
  }
  .self-step3:not(:first-child):before {
    width: 160px;
    height: 6px;
    position: absolute;
    left: -100px;
    content: "";
    background: #004F7C;
    top: 7px;
    text-align: left;
  }
  .self-step-process1:not(:first-child):before{
    background:#63acd5;
  }
  .self-step-finished1:not(:first-child):before{
    background:#004F7C;
  }
  .self-step-pedding1:not(:first-child):before{
    background:#ddd;
  }
  .self-step-error1:not(:first-child):before{
    background:#F56C6C;
  }
  .self-step5:not(:first-child):before {
    width: 90px;
    height: 2px;
    position: absolute;
    left: 0px;
    content: "";
    top: 15px;
    text-align: left;
    border-top: 4px dotted #dbdbdb;
  }
  .self-step5:not(:first-child):after {
    height: 100px;
    width: 2px;
    position: absolute;
    left: 0px;
    content: "";
    top: -90px;
    text-align: left;
    border-left: 4px dotted #dbdbdb;
  }

  .self-step5:first-child:before {
    width: 180px;
    height: 2px;
    position: absolute;
    left: -90px;
    content: "";
    top: 15px;
    text-align: left;
    border-top: 4px dotted #dbdbdb;
  }
  .self-step4:not(:last-child):before {
    width: 220px;
    height: 2px;
    position: absolute;
    left: 150px;
    content: "";
    top: 15px;
    text-align: left;
    border-top: 4px solid #dbdbdb;
  }

  .self-step-solid4:not(:last-child):before {
    border-top: 4px solid #dbdbdb;
  }
  .self-step-dotted4:not(:last-child):before {
    border-top: 4px dotted #dbdbdb;
  }

  .self-step1:not(:first-child):before {
    width: 150px;
    height: 2px;
    position: absolute;
    left: -100px;
    content: "";
    background: #004F7C;
    top: 20px;
    text-align: left;
  }
  p{
    margin: 0px;
  }
  .scrollable-content {

    height: 460px;
    overflow-y: auto;
  }


  .main-timeline {
    width: 800px;
    margin: 0 auto;
    font-family: figtree, "Roboto", sans-serif;
  }

  .main-timeline:after {
    content: "";
    display: block;
    clear: both;
  }

  .main-timeline:before {
    content: "";
    height: 100%;
    width: 2px;
    border: 2px dashed #000;
    transform: translateX(-50%);
    position: absolute;
    left: 50%;
    top: 30px;
  }

  .file-css {
    width: 150px;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .main-timeline .timeline {
    width: 50%;
    padding: 100px 70px 0 25px;
    margin: 0 50px 0 0;
    float: left;
    position: relative;
  }

  .htmldiv video {
    width: 400px !important;
    height: 303px !important;
  }

  .main-timeline .timeline-content {
    padding: 5px 15px 5px 40px;
    border: 2px solid #004F7C;
    border-radius: 15px 0 15px 15px;
    display: block;
    position: relative;
  }

  .main-timeline .timeline-content:hover {
    text-decoration: none;
  }

  .main-timeline .timeline-content:after {
    content: "";
    background-color: #004F7C;
    height: 18px;
    width: 15px;
    position: absolute;
    right: -15px;
    top: -2px;
    clip-path: polygon(100% 0, 0 0, 0 100%);
  }

  .main-timeline .timeline-year {
    color: #fff;
    background-color: #004F7C;
    font-size: 32px;
    font-weight: 700;
    text-align: center;
    line-height: 50px;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    position: absolute;
    right: -90px;
    top: -85px;
  }

  .main-timeline .timeline-year:after {
    content: "";
    height: 70px;
    width: 70px;
    border: 8px solid #004F7C;
    border-left-color: transparent;
    border-radius: 50%;
    transform: translateX(-50%) translateY(-50%) rotate(-20deg);
    position: absolute;
    left: 50%;
    top: 50%;
  }

  .main-timeline .timeline-icon {
    color: #fff;
    background-color: #00a79b;
    font-size: 35px;
    text-align: center;
    line-height: 50px;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    left: -25px;
    transition: all 0.3s;
  }

  .main-timeline .title {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1px;
    margin: 0 0 7px 0;
  }

  .main-timeline .description {
    color: #222;
    font-size: 15px;
    letter-spacing: 1px;
    text-align: justify;
    margin: 0 0 5px;
  }

  .main-timeline .timeline:nth-child(even) {
    padding: 100px 25px 0 70px;
    margin: 0 0 0 50px;
    float: right;
  }

  .main-timeline .timeline:nth-child(even) .timeline-content {
    padding: 5px 40px 5px 15px;
    border-radius: 0 15px 15px 15px;
  }

  .main-timeline .timeline:nth-child(even) .timeline-content:after {
    transform: rotateY(180deg);
    right: auto;
    left: -15px;
  }

  .w-e-textarea-video-container {
    background-image: none !important;
  }

  .main-timeline .timeline:nth-child(even) .timeline-year {
    right: auto;
    left: -100px;
  }

  .main-timeline .timeline:nth-child(even) .timeline-year:after {
    transform: translateX(-50%) translateY(-50%) rotate(200deg);
  }

  .main-timeline .timeline:nth-child(even) .timeline-icon {
    left: auto;
    right: -25px;
  }

  .button-row {
    display: inline-flex;
    align-items: center;
  }

  @media screen and (max-width: 767px) {
    .main-timeline:before {
      display: none;
    }

    .main-timeline .timeline {
      width: 100%;
      padding-top: 80px;
      padding-right: 12px;
      margin-bottom: 20px;
    }

    .main-timeline .timeline:nth-child(even) {
      padding-left: 10px;
      padding-top: 80px;
      margin-bottom: 20px;
    }

    .main-timeline .timeline-content,
    .main-timeline .main-timeline .timeline:nth-child(even) .timeline-content {
      background-color: #fff;
      padding-top: 25px;
    }

    .main-timeline .timeline-content:after {
      display: none;
    }

    .main-timeline .timeline-year {
      font-size: 24px;
      line-height: 70px;
      height: 70px;
      width: 70px;
      right: 0;
      top: -65px;
    }


    .main-timeline .timeline-year:after {
      display: none;
    }

    .main-timeline .timeline:nth-child(even) .timeline-year {
      left: 3px;
    }

  }

  iframe * {
    font-family: figtree, 微软雅黑;
  }

  @media screen and (max-width: 567px) {
    .main-timeline .title {
      font-size: 18px;
    }
  }

  .text-upload {
    padding-top: 5px;
    margin: 10px;
    border: 1px solid #ddd;
    display: flex;
    /* 启用 Flexbox 布局 */
    align-items: center;
    flex-wrap: wrap;
    flex-direction: row-reverse;
  }

  .text-upload .tools-but {
    background: #ffffff;
  }

  .text-upload .tools-but span {
    font-size: 14px;
    margin-right: 10px;
    cursor: pointer;
  }

  .text-upload .el-descriptions {
    margin: 0;
    padding: 0px 10px 10px 10px !important;
    border: 0 !important;
    box-shadow: none;
  }
  .el-des-margin-top img.imgLogo {
    margin: 0;
    padding: 0;
    image-rendering: -webkit-optimize-contrast;
    width: 140px;
    height: 40px;
    top: 10px;
  }

  /* .avatar-container:hover .delete-button {
    display: block;
  } */
</style>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<script>
  import { getListByShipmentId, getPage } from "@/api/booking/booking";
import { deleteFile, getFileList } from "@/api/infra/file";
import { getSOHeaderPage } from "@/api/order/sOHeader";
import { getClpSoList } from "@/api/shipment/clpSo";
import { containerStatusListByCondition, createContainerStatus } from "@/api/shipment/containerStatus";
import { createDestinationAgent, getDestinationAgentByShipmentId, sendMail, updateDestinationAgent } from "@/api/shipment/destinationAgent";
import { createDestinationRouter, deleteDestinationRouter, getDestinationRouterList, updateDestinationRouter } from "@/api/shipment/destinationRouter";
import { getNotePage } from "@/api/shipment/note";
import { createPlaces, deletePlaces, placesListByCondition, updatePlaces } from "@/api/shipment/places";
import {
  activateShipment,
  addOrUpdate,
  addRemovePO,
  addRemoveSo,
  cancelShipment,
  checkCarrierAndBookingNumSame,
  createTmffHBL,
  downloadContainersTemplate,
  downloadVGM,
  findDropDownListFromCt,
  findShippingScheduleList,
  findTmffHBL,
  findTmffHBL2,
  getChangeVesselInfo,
  getFeedbackInformationFromNingbo,
  getList,
  getPoTaskStatusByShipmentId,
  getPushQingdaoRecordListByBookingNumber,
  getPushSinotransRecordListByBookingNumber,
  getShipLogList,
  getShipmentFiles,
  saveCargo,
  sendToCarrier,
  shipLogCreate,
  shipLogDelete,
  shipmentStatus,
  si,
  submitBooking,
  submitSinotransVGMAPI,
  submitVmtJson,
  trackByBookingNumber,
  updateBlNumber,
  updateDocumentFile,
  updateStatus,
  exportShipmentICS2F15
} from "@/api/shipment/shipment";
import { exportVesselListByCondition } from "@/api/shipment/vessel";
import { getNotShipmentOrderPage, getShippingOrderByShipment, getShippingOrderListByIds, updateShippingRelationship } from "@/api/shipping/order";
import { checkDataByNoAndType, getContainerNoByNoAndType } from "@/api/system/containerNo";
import { getContainerTrackSettingPage } from "@/api/system/containerTrackSetting";
import { getContainerTypeCodeList } from "@/api/system/containerTypeCode";
import { getDeptList, listDept } from "@/api/system/dept";
import { applyNewHsCode, getDataByHsCodes, getHsCodeListByCode } from "@/api/system/hsCode";
import { getOriginDeliveryList } from "@/api/system/originDelivery";
import { getPolPodList } from "@/api/system/polPod";
import { getUserProfile } from "@/api/system/user";
import { getVesselList } from "@/api/system/vessel";
import auth from "@/plugins/auth";
import { getBaseHeader } from "@/utils/request";
import SOMainTable from '@/views/salesOrder/components/table.vue';
import { i18nChangeLanguage } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { v4 as uuidv4 } from 'uuid';
import vueshowpdf from 'vueshowpdf';
import XLSX from "xlsx";
import { exportShippedExcel } from "../../../api/shipment/shipment";
import SinotransVGM from "./sinotrans-vgm/index.vue";

  import { getOrderStatus } from '@/api/order/header.js';
import { timeLogListByShipmentId } from "@/api/shipment/timeLog";
import { fileLoadMixin } from '@/utils/fileLoadMixin';
import ShipmentCargoInfo from '@/views/shipment/components/shipment-cargo-info.vue';
import ModifyDialog from "@/views/shipment/detail/components/modifyDialog.vue";
import CheckOrderStatusDialog from './components/CheckOrderStatusDialog.vue';
import ShippingOrderDialog from './components/ShippingOrderDialog.vue';
import ShippingOrderReArrangeDialog from './components/ShippingOrderReArrangeDialog';
import AirBookedScheduleRoute from '@/views/shipment/detail/components/AirBookedScheduleRoute.vue';

import { mapGetters } from 'vuex'

  export default {
    name: "Shipment",
    mixins: [fileLoadMixin],
    components: {ModifyDialog, vueshowpdf, Editor, Toolbar,SinotransVGM,SOMainTable,ShippingOrderDialog,CheckOrderStatusDialog, ShippingOrderReArrangeDialog, ShipmentCargoInfo, AirBookedScheduleRoute },
    data() {
      return {
      ningboSinotransReceives: [],
        onlyPreview: false,
        siButLoading:false,
        showSIDraft: false,
        editor: null,
        commentsDialogVisible: false,
        html: '',
        loadingAcceptConfirm: false,
        loadingEventsConfirm: false,
        loadingSaveBut:false,
        mode: 'simple',
        toolbarConfig: {
          excludeKeys: [
            'lineHeight',
            'fontFamily',
            'fontSize',
            'headerSelect',
            'codeBlock'
          ]
        },
        editorConfig: {
          placeholder: '...',
          MENU_CONF: {
            uploadImage: {
              base64LimitSize: 20 * 1024 * 1024
            },
            uploadVideo: {
              customUpload(file, insertFn) {  // TS 语法
                console.log(file)
                file.arrayBuffer().then((buffer) => {
                  // 处理 ArrayBuffer，可以根据需要转换为其他格式
                  const uint8Array = new Uint8Array(buffer);

                  // 将 Uint8Array 转换为字符串
                  const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');

                  // 使用 btoa 将二进制字符串转换为 Base64
                  const base64String = btoa(binaryString);
                  console.log("Base64 Content:", base64String);
                  insertFn('data:video/mp4;base64,' + base64String, '')
                }).catch((error) => {
                  console.error("Error reading file:", error);
                });
                //
              }
            }
          }
        },
        mode: 'default',
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
          "20":"Customs clearance",
          "21":"Delivery",
          "22":"Empty Return",
        },
        carrierBillList: [],
        houseBillList: [],
        othersList: [],
        cargooResData: [],
        uploadTypes: [    // 上传类型选项
          { label: 'Carrier Bill of Lading', value: '1' },
          { label: 'House Bill of Lading', value: '2' },
          { label: 'Others', value: '3' },
        ],
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
          fileList: []
        },
        portCall: {},
        visablePortCall: false,
        fileListLoading: false,
        loading: false,
        expanded: {},
        shipLogList: [],
        // visableShipLog: false,
        changeContainer: null,
        containerOptions: [],
        loadingSelect: false,
        blflag: false,
        sampleUrl: '',
        isshowpdf: false,
        involvedPartiesOptions: [
          { label: 'Shipper', value: 'shipper' },
          { label: 'Consignee', value: 'consignee' },
          { label: 'Notify Party', value: 'notifyParty' }
        ], selectedInvolvedParty: '',
        currentStepIndex: 0,
        shipmentMilestones: [],
        centerDialogVisible: false,
        exportLoading:false,
        shipment: {
          bookingProductDOS: [],
          containerDOList: [],
          soHeaderVOs:[],
          shipmentVgmDOS: [],
          routerDOList: [{}],
          status: "0",
          bookingNumber: '',
          showIframe2: true,
          showIframe:false,
        },
        parties: {
          "Shipper": [],
          "Consignee": [],
          "Notify Party": [],
        },
        visableContainerMovement: false,
        containerMovement: {},
        visableDestinationRouter: false,
        destinationRouter: {},
        destinationRouterList: [],
        containerMovementList: [],
        containerNoList: [],
        hsCodeList: [],
        activeName: "first",
        portOptions: [],
        bookings: [],
        productMapForBook: {},
        orderMap: {},
        orderItemMap: {},
        productMapForBook: {},
        orderMap: {},
        itemTableData: [],
        partiesMap: {},
        visableSI: false,
        siForm: { containers: [], shipper: {}, consignee: {}, notifyParty: {} },
        vgmForm: { vmg: [] },
        visableVGM: false,
        originDeliveryMap: {},
        polPodMap: {},
        containerTypeList: [],
        siList: [],
        shippedContainer: {},
        visableSIContainer: false,
        containerForm: {},
        active: 0,
        selCancelReason: [],
        selCancelCategory: [],
        selectCancelReason: [],
        siVGMCutoffflag:false,
        cancelReasonFlag: false,
        centerDialogFrom: false,
        dialogFormEvents: false,
        dialogFormAccept: false,
        dialogBLType: false,
        acceptRequired: false,
        isBooking: false,
        shipmentScheduleMap: {},
        form: {
          bookingNum: "",
          dateValue: "",
        },
        formLabelWidth: "180px",
        statusKeys: "",
        pickerOptions: {
          disabledDate: (time) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // 设置为今天的凌晨
            return time.getTime() > today.getTime();
          },
        },
        places: [
        ],
        allMilestones: [
          {
            key: "0",
            label: "Canceled",
            sync: true,
            hide: true,
          },
          {
            key: "1",
            label: "Draft",
            sync: true,
            hide: true,
          },
          {
            key: "2",
            label: "Submitted",
            sync: true,
            hide: true,
          },
          {
            key: "3",
            label: "Confirmed",
            sync: true,
            hide: true,
          },
          {
            key: "5",
            label: "Gate out Empty",
            sync: false,
            hide: true,
          },
          {
            key: "6",
            label: "Gate In Full",
            sync: false,
            hide: true,
          },
          {
            key: "7",
            label: "SI Submitted",
            sync: true,
            hide: true,
          },
          {
            key: "8",
            label: "Shipped",
            sync: false,
            hide: true,
          },
          {
            key: "9",
            label: "BL Issued(Rls)",
            sync: false,
            hide: true,
          },
          {
            key: "10",
            label: "Arrived LPOD",
            sync: false,
            hide: true,
          },
          {
            key: "11",
            label: "Departure LPOD",
            sync: false,
            hide: true,
          },
          {
            key: "12",
            label: "Arrived Inland Terminal",
            sync: false,
            hide: true,
          },
          {
            key: "13",
            label: "Departure Inland Terminal",
            sync: false,
            hide: true,
          },
          {
            key: "14",
            label: "Empty Returned",
            sync: false,
            hide: true,
          },],
        hsCode: {},
        applyHsCodeVisable: false,
        statusForm: {},
        visableStatus: false,
        acceptRequired: false,
        siDataStr: '',
        vgmDataStr: '',
        containersHeaders: [
          'Container Type',
          'Container No',
          'Container Seal Number',
          'SOC(TRUE/FALSE)',
          'Marks&Numbers',
          'Tare Weight',
          'Product Name',
          'HS code',
          'Number Of Packages',
          'Packages',
          'Gross Weight(KG)',
          'Volume(CBM)',
        ],
        vesselMap: {},
        checkLoading: false,
        errorDialog: false,
        gridData: [],
        hsCodeData: [],
        checkHsCodeDialog: false,
        addRemovePOVisible: false,
        pbTable: [],
        selectedTable: [],
        pbPage: {
          total: 0,
          poBooking: true,
          pageNo: 1,
          pageSize: 10,
          shipmentBooking: false
        },
        vesselListLes: [],
        selectIds: [],
        shipmentNoteList: [],
        noteView: false,
        showTMFF: false,
        tempJsonVisible: false,
        checkList: [{ "label": "CONTR_GATE_IN", "key": 1, "disabled": false },
        { "label": "BOOKED_ETD", "key": 2, "disabled": false },
        { "label": "BOOKED_ETA", "key": 3, "disabled": false },
        { "label": "TRANS_ETD", "key": 4, "disabled": false },
        { "label": "TRANS_ETA", "key": 5, "disabled": false },
        { "label": "TRANS_ATD", "key": 6, "disabled": false },
        { "label": "TRANS_ATA", "key": 7, "disabled": false },
        { "label": "TRANS_SHP_VESSEL", "key": 8, "disabled": false },
        { "label": "TRANS_SHP_ARRVL_VESSEL", "key": 9, "disabled": false },
        { "label": "TRANS_FND", "key": 10, "disabled": false },

        { "label": "API_CARGOO", "key": 11, "disabled": false },

        { "label": "CONTR_PICKUP_POD", "key": 12, "disabled": false },
        { "label": "CONTR_ARRVL_TERM", "key": 13, "disabled": false },
        { "label": "CONTR_RETURN_DEPOT", "key": 14, "disabled": false },],
        checkedCities: [],
        isIndeterminate: false,
        checkAll: false,
        editableTabs: [],
        tempData: null,
        tempJsonBut: false,
        apiVisible: false,
        apiErrorList: [],
        apiLod: false,
        vmtRevoke: false,
        vmtRevokeSwitch: false,
        showFileDelButton: null,
        tempPlaces: [],
        tempPlacesShow: [],
        tempVessel: [],
        cancelType: 0,
        cancelTitle: '',
        user: {},
        showSendEmail: false,
        visableTmff: false,
        visableTmff2: false,
        tmffButShow: false,
        formTmffLoading: false,
        formTmffLoading2: false,
        tmffAllTotalPackages: 0,
        tmffAllTotalWeight: 0,
        tmffAllTotalCbm: 0,
        tmffAllNotTotalPackages: 0,
        tmffAllNotTotalPackages2: 0,
        tmffAllNotTotalWeight: 0,
        tmffAllNotTotalWeight2: 0,
        tmffAllNotTotalCbm: 0,
        tmffAllNotTotalCbm2: 0,
        currentRow: null,
        itemOptions: [],
        tmffForm: { product: [], mblNo: '', },
        tmffForm2: { product: [], mblNo: '', },
        sinotransVGMVisable:false,

        carrierMap:{
            "CMDU": "CMA",
            "COSU": "COSCO",
            "EGLV": "EMC",
            "HLCU": "HPL",
            "MSCU": "MSC",
            "ONEY": "ONE",
            "ZIMU": "ZIM",
            "MAEU": "MSK",
            "MAEU-ALWAYS": "MSK",
            "TSHG": "TSHG",
          'SHCO': 'SHIPCO',
          'NVOCC DSV': 'DSV',
          'WECC': 'WEC',
        },
        siCutoff:'',
        vgmCutoff:'',
        clpData:[],
        addRemoveSoLoading:false,
        soTableData:[],
        addRemoveSOVisible:false,
        soQueryParams:{
          booked:false
        },
        transportMode:[
          {
            "label":"Barge",
            "value":"BRG"
          },
          {"label":"Ocean",
          "value":"SEA"
        },
          {"label":"Truck",
          "value":"TRK"
        },
          {"label":"Railway",
          "value":"RAI"
        }
        ],
        billedToList:[
          {
            "label":"MOOV HK",
            "value":"MOOV HK"
          },
          {"label":"client",
          "value":"client"
        }
        ],
        tempPlaces1:[],
        tempPlaces2:[],
        drawer:false,

        containersDialog:false,
        tipContainers: [],

        addRemoveContainerVisible:false,
        containerPage: {
          total: 0,
          pageNo: 1,
          pageSize: 10,
        },
        selectedContainer: [],
        noSelectedContainer: [],
        addContainers: [],

        followerDialogVisible:false,
        selectedFollower:[],
        noSelectedFollower:[],
        showDelete: {},
        followerPage: {},
        agentData: [],
        agentMap: [],

      agentDialogVisible:false,
      agentDetail:{
        currency:"EUR",
      },
      currency:[
        "USD","EUR","RMB","HKD",
      ],
      addRemoveSPOVisible:false,
      spoPage: {
        total: 0,
        soRef: '',
        pageNo: 1,
        pageSize: 10,
        shipmentId: [],
      },
      spoTable: [],
      selectedSpoTable: [],
      selectSpoIds: [],
      spoList:[],
      sendMail: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "Mail",
        toMail: '',
        ccMail: '',
        templateTitle: '',
        templateContent: '',
        ids: '',
        fileUrl: '',
        fileName: '',
      },
      preAlertFileList: [],
      SOList:[],
      SOProductList: [],
      SOType: '',
      draftDateList: [],
      submitDateList: [],
      bookingReceiptDateList: [],
      bookingConfirmationDateList: [],
      siDateList: [],
      atdDateList: [],
      ataDateList: [],
      customClearanceDateList: [],
      deliveryDateList: [],
      emptyReturnDateList: [],
      showCNNGBSI: false,
      sinotransRecordList: [],
      sinotransRecordStatus:{
        booking: 0,
        si: 0,
        vgm: 0,
      },
      timeLogList: [],
      isPepco: false,
      spoItems:[],
      showAddShipperBooking: false,
      canReArrangeSO: false,
      orderList:[],
      orderInfo:{},
      movements: [],
      modifyVisible: false,
      showVesselChangeCard: false, // 换船信息弹窗控制
      changeVesselGroups: null, // 换船信息数据
      changeVesselLoading: false, // 查询加载状态
      selectedSoNumbers: [], // tmff存储已选中的soNumber，确保唯一

    };
  },

    mounted() {
      getUserProfile().then(response => {
        this.user = response.data;
      });
      this.getPortList();
      this.init();
      this.getBookings();
      this.getHsCodeList();
      this.getContainerTypeCodeList();
      this.getDropDownValues();
      this.getShipmentStatus();
      this.getShipLogList()
      this.queryChangeVesselInfo();
      this.getDocument()
      //this.getAllBookings()
      var shipmentNoteView = this.getDictDatas(this.DICT_TYPE.SHIPMENT_NOTE_VIEW)
      if (shipmentNoteView && shipmentNoteView.length > 0) {
        for (var c = 0; c < shipmentNoteView.length; c++) {
          if (shipmentNoteView[c].value == localStorage.getItem('TENANT_ID')) {
            this.noteView = true
            break;
          }
        }
      }
      this.queryNotes()
      if (localStorage.getItem('TENANT_ID') == 161) {
        this.tempJsonBut = true
      }
      if (auth.hasRole("VMT_Revoke")) {
        this.vmtRevoke = true
      }
      this.getParty();

    timeLogListByShipmentId({ id: this.$route.query.id }).then((res) => {
      console.log(res)
      this.timeLogList = res.data
    })


    },

  computed: {
    ...mapGetters(['userId','nickname']),
    cancelRemarklogList() {
      return this.shipLogList.filter(log => log.type === '8');
    },
     bookingNumberlogList() {
      return this.shipLogList.filter(log => log.type === '7');
    },
    airBookingNumberlogList() {
      return this.shipLogList.filter(log => log.type === '17');
    },
    blNumberlogList() {
      return this.shipLogList.filter(log => log.type === '6');
    },
    containerListlogList() {
      return this.shipLogList.filter(log => log.type === '5');
    },
    uploadAction() {
      if (this.showSendEmail) {
        return process.env.VUE_APP_BASE_API + "/admin-api/shipment/api/uploadShipmentFile"
      } else {
        return process.env.VUE_APP_BASE_API + "/admin-api/shipment/api/updateDocumentFile2";
      }
    },
    updatedSiRemark: {
      get() {
        if (this.siForm.blType && this.siForm.blSamples) {
          return this.siForm.blType + this.siForm.blSamples + this.siForm.siRemark;
        } else {
          return this.siForm.siRemark;
        }
      },
      set(value) {
        const siRemark = value.substring(this.siForm.blType.length + this.siForm.blSamples.length);
        this.siForm.siRemark = siRemark;
      }
    },
    e_days() {
      if (this.shipment.routerDOList.length > 0) {
        var etd = this.shipment.routerDOList[0].etd
        var eta = this.shipment.routerDOList[this.shipment.routerDOList.length - 1].eta
        return this.getDaysBetweenTimestamps(etd, eta) + 'days'
      }
      return ''
    },
    a_days() {
      var obj1 = this.allMilestones.find((item) => item.key + "" == "8");
      var obj2 = this.allMilestones.find((item) => item.key + "" == "10");
      if (obj1 != null && obj2 != null && obj1.endDate && obj2.endDate) {
        return this.getDaysBetweenTimestamps(obj1.endDate, obj2.endDate) + 'days'
      }
      return '-days'
    },

    },
    created() {
      if(this.$auth.hasRole("super_admin")){
        this.onlyPreview =false
      }else{
        this.onlyPreview = this.$auth.hasPermi("shipment-detail:onlyPreview")
      }
      localStorage.removeItem('refreshPoPage')
      console.log('-------------userId----------')
      console.log(this.userId)
    },

  methods: {
    refreshPage() {
      this.init();
    },

     validateContainerNO(value) {
      const regex = /^[A-Za-z]{4}\d{7}$/
      if (!regex.test(value)) {
        this.$notify.error("The first four digits of \"containerNo\" must be capital letters, and the last seven digits must be numbers!")
        return false;
      }
      return true
    },
    lastTransportMode(code) {
      // 查找最后一个 portCode 等于 task.code 的 movements 元素
      const filteredMovements = this.movements.filter(movement => movement.portCode === code
        && movement.eventCode != 'STSP' && movement.eventCode != 'GITM' && movement.eventCode != 'LOBD');
      // 如果存在这样的元素，则返回最后一个的 transportMode
      const transportMode = filteredMovements.length > 0 ? filteredMovements[filteredMovements.length - 1].transportMode : ''
      return transportMode;
    },
    getPoTaskStatusByShipmentId() {
      const filteredMilestones = this.shipmentMilestones.filter(item => item.key === '7' && item.endDate != null);
      if (filteredMilestones && filteredMilestones.length > 0 || this.shipment.siDate!=null) {
        this.showAddShipperBooking = false
      } else {
        this.showAddShipperBooking = true
      }


      // // 判断当前po的状态是否一致，如果不一致，弹出表单
      // getPoTaskStatusByShipmentId(this.shipment.id).then((response) => {

      //   console.log(response.data)
      //   const allStatusSame = response.data.length > 0 &&
      //     response.data.every(item =>
      //       item.taskStatus === response.data[0].taskStatus
      //     );


      //     if(response.data.length==0||
      //       (allStatusSame && (
      //         response.data[0].taskStatus == 'Carrier Booking'
      //         || response.data[0].taskStatus == 'Booking Confirmation'
      //         || response.data[0].taskStatus == 'SO Release to Supplier'
      //         || response.data[0].taskStatus == 'SI/VGM Submit'
      //         || response.data[0].taskStatus == 'SI/VGM Submit to Carrier'
      //       ))
      //     ) {
      //       this.showAddShipperBooking = true
      //     }
      //     console.log(this.shipmentMilestones)
      //   //   const filteredMilestones = this.shipmentMilestones.filter(item =>
      //   //   item.key === '4' && item.endDate != null
      //   //   // 或者更严格的判断：item.endTime !== null && item.endTime !== undefined
      //   // );
      //   // console.log(filteredMilestones)
      //   //   if(filteredMilestones&& filteredMilestones.length>0) {
      //   //     this.showAddShipperBooking = false
      //   //   }


      //   // if (this.isPepco&&response.data.length != 0&&allStatusSame&&
      //   //     response.data[0].taskStatus == 'SI/VGM Submit to Carrier'
      //   // ) {
      //   //   this.canReArrangeSO = true
      //   // }
      // })
    },

    isMismatch(transportMeanName, voyage) {
      if (!this.ningboSinotransReceives || this.ningboSinotransReceives.length === 0) {
    return false;
  }
  // 复制数组，避免修改原数组
  const sortedRecords = [...this.ningboSinotransReceives].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const latestRecord = sortedRecords[0];
  return transportMeanName !== latestRecord.vesselName || voyage !== latestRecord.voyage;
    },
    isLong(transportMeanName, voyage) {
      return (transportMeanName.length + voyage.length) > 21;
    },

    getFeedbackInformationFromNingbo(code) {
      getFeedbackInformationFromNingbo({ bookingNumber: code }).then((res) => {
        this.ningboSinotransReceives = res.data.filter(item => item.bkStatus !== 5)
      })
    },


     getPushSinotransRecordListByBookingNumber(code) {
      getPushSinotransRecordListByBookingNumber({ bookingNumber: code }).then((res) => {
        const target = '"code":"1"';
        // 2 发送给对面服务器成功；不代表成功 0内部异常 1 生成未发送
        var tempList = res.data.filter(item => item.isPush == 2)
        if(tempList.length > 0) {
          this.sinotransRecordList = res.data.filter(item => item.isPush == 2)
          this.setSinotransRecordList();
        }
        console.log('1111')
                console.log(this.sinotransRecordList)

      })
    },
     getPushQingdaoRecordListByBookingNumber(code) {
      getPushQingdaoRecordListByBookingNumber({ bookingNumber: code }).then((res) => {
        // 2 发送给对面服务器成功；不代表成功 0内部异常 1 生成未发送
        var tempList = res.data.filter(item => item.isPush == 2)
        if(tempList.length > 0) {
          this.sinotransRecordList = res.data.filter(item => item.isPush == 2)
          this.setSinotransRecordList();
        }
        console.log('1111')
                console.log(this.sinotransRecordList)

      })
    },
    setSinotransRecordList() {
        const target = '"code":"1"';
        const target1 = 'code\":1';
        if (this.sinotransRecordList.length > 0) {
          var bookingList = this.sinotransRecordList.filter(item => item.pullType == 1)
          if (bookingList.length > 0) {
            this.sinotransRecordStatus.booking = 3
            var booking = bookingList[bookingList.length - 1]
            if (booking.responseFeedback != null && (booking.responseFeedback.includes(target)||booking.responseFeedback.includes(target1))) {
              this.sinotransRecordStatus.booking = 1
            } else {
              this.sinotransRecordStatus.booking = 2
            }
          }
          var siList = this.sinotransRecordList.filter(item => item.pullType == 2)
          if (siList.length > 0) {
            this.sinotransRecordStatus.si = 3
            var si = siList[siList.length - 1]
            if (si.responseFeedback != null && si.responseFeedback.includes(target)) {
              this.sinotransRecordStatus.si = 1
            } else {
              this.sinotransRecordStatus.si = 2
            }
          }
          var vgmList = this.sinotransRecordList.filter(item => item.pullType == 3)
          if (vgmList.length > 0) {
            this.sinotransRecordStatus.vgm = 3
            var vgm = vgmList[vgmList.length - 1]
            if (vgm.responseFeedback != null && vgm.responseFeedback.includes(target)) {
              this.sinotransRecordStatus.vgm = 1
            } else {
              this.sinotransRecordStatus.vgm = 2
            }
          }

        }
        // sinotransRecordStatus 0没发送  1 发送成功 2 发送失败 3 发送中
        // pull type 1 booking  2 si
    },
    getDiffDate(row) {
      return new Date(row.updateTime) < new Date('2025-02-18')
    },
    openDestination(){
        this.drawer=!this.drawer
    },
    openDestinationAgent(){

          // 获取Destination conf
          var queryParams = {
          pageNo: 1,
          pageSize: 10000,
        }
        getContainerTrackSettingPage(queryParams).then(response => {
          console.log(response.data.list)
          var res = response.data.list.filter(item=>item.carrier==this.shipment.carrier&& item.pod==this.shipment.destinationPort)
          if(res.length>0) {
            if(this.agentDetail.dumurrage==null) {
              this.agentDetail.dumurrage = res[0].freeDemurrage
            }
            if(this.agentDetail.detention==null) {
            this.agentDetail.detention = res[0].freeDetention
            }
          }


        });
        this.agentDialogVisible=!this.agentDialogVisible
      },
      getDestinationAgentByShipmentId() {

        getDestinationAgentByShipmentId(this.$route.query.id).then(response => {
          this.agentDetail = response.data

          if (this.$auth.hasPermi("shipment:detail:agent")) {
              this.selectedFollower = this.agentDetail.agentId?this.agentDetail.agentId.split(','):[]
            }
            if (this.$auth.hasPermi("shipment:detail:addAgent")) {
              this.showDelete = {}
              for(var id of this.selectedFollower){
                this.showDelete[id] = false
              }
            }

          if(this.agentDetail.currency==null) {
            this.agentDetail.currency = "EUR"
          }
          this.agentDetail.shipmentId = this.$route.query.id

            });
      },
      submitAgentDetail() {
        this.$refs["agentDetailForm"].validate(valid => {
          if (!valid) {
            return;
          }
          // 修改的提交
          if (this.agentDetail.id != null) {
            updateDestinationAgent(this.agentDetail).then(response => {
              this.agentDialogVisible = false;
              this.getDestinationAgentByShipmentId();
            });
            return;
          }
          // 添加的提交
          createDestinationAgent(this.agentDetail).then(response => {
            this.agentDialogVisible = false;
            this.getDestinationAgentByShipmentId();
          });
        });
      },
      deleteSO(row){
         this.$confirm("Remove SO?", "", {
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          type: "warning",
        }).then(() => {
          if(this.shipment.orderIds.length == 1){
            this.$notify({
              message: 'At least 1 SO should be added',
              type: 'warning'
            });
            return;
          }
          this.addRemoveSoLoading = true
          var data = {
            shipmentId: this.shipment.id,
            addFlag: false,
            soIds: [row.id]
          }
          this.shipmentAddRemoveSo(data)
        }).catch(() => {
        });

      },
      addSO(row){
        this.addRemoveSoLoading = true
        var data = {
          shipmentId: this.shipment.id,
          oldSoId: this.shipment.orderIds[0],
          addFlag: true,
          soIds: [row.id]
        }
        this.shipmentAddRemoveSo(data)
      },
      shipmentAddRemoveSo(data){
        addRemoveSo(data).then((res)=>{
            this.$notify({
              title: 'success',
              message: 'success',
              type: 'success'
            });
            this.getSO()
            getList({ ids: this.$route.query.id }).then((response) => {
              this.$set(this.shipment, 'soHeaderVOs', response.data[0]['soHeaderVOs']);
              this.$set(this.shipment, 'orderIds', response.data[0]['orderIds']);
              this.addRemoveSoLoading = false
            })
        })
      },
      getSO(){
        getSOHeaderPage(this.soQueryParams).then((res)=>{
            for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].key='first'+res.data.list[i].id
            }
            this.soTableData=res.data.list
            this.soQueryParams.total=res.data.total
        })
      },
      getClpList(shipmentBookingNumber){
        getClpSoList({shipmentBookingNumber:shipmentBookingNumber}).then((res2)=>{
          var containers={}
                for(var j=0;j<res2.data.length;j++){
                  if(!containers[res2.data[j].containerNo]){
                    containers[res2.data[j].containerNo]={
                      containerNo:res2.data[j].containerNo,
                      containerSealNumber:res2.data[j].sealNo,
                      containerType:res2.data[j].containerType,
                      numbersOfPackage:Number(res2.data[j].qty),
                      grossWeight:Number(res2.data[j].grossWeight),
                      volume:Number(res2.data[j].cbm)
                    }
                  }else{
                    containers[res2.data[j].containerNo].numbersOfPackage+=Number(res2.data[j].qty)
                    containers[res2.data[j].containerNo].grossWeight=Number(res2.data[j].grossWeight)
                    containers[res2.data[j].containerNo].volume=Number(res2.data[j].cbm)
                  }
                }
                var newArr=[]
                for(var key in containers){
                  newArr.push(containers[key])
                }
                this.clpData=newArr
        })
      },
      addHBLRow(){
        this.tmffForm.product.push(
        {
          subItemData:[{orderId:null,orderNumber:null,bookedUnit:null,bookQty:null,weight:null,volume:null,soNumber:null,shipperOrderId:null}],
          hblNo: null,
          tmffTotalPackages: 0,
          tmffTotalWeight: 0,
          tmffTotalCbm: 0,
          soNumber:null, //取subItemData第一个的soNumber
          shipperOrderId:null //取subItemData第一个的soNumber
        })

      },
      clearItemOrderRow(row ,index){
        this.$set(row, 'orderId', null)
        this.$set(row, 'soNumber', null)
        this.$set(row, 'poNumbers', null)
        this.$set(row, 'bookedUnit', null)
        this.$set(row, 'bookQty', null)
        this.$set(row, 'weight',null)
        this.$set(row, 'volume', null)
        this.$set(row, 'typeList', null)
        this.$set(row, 'productName', null)
        this.$set(row, 'shipperOrderId', null)
        this.sumTmffRowTotal(index)

        const oldSo = row._oldSo;
        if (oldSo) {
          // 从选中数组中移除
          this.selectedSoNumbers = this.selectedSoNumbers.filter(so => so !== oldSo);
        }
      },
      tmffAddProductRow(row,   hblIndex) {
        this.tmffForm.product[hblIndex].subItemData.push({
          soNumber: null
        });
        this.$set(this.tmffForm.product[hblIndex].subItemData[0], 'tempId', null)
      },
      deleteTmffItemRow(row, itemIndex, hblIndex){
        const deletedRow = row.subItemData[itemIndex];
        if (deletedRow.soNumber) {
          // 从选中数组中移除被删除行的soNumber
          this.selectedSoNumbers = this.selectedSoNumbers.filter(
            so => so !== deletedRow.soNumber
          );
        }

        row.subItemData.splice(itemIndex, 1)
        this.sumTmffRowTotal(hblIndex)
      },
      deleteTmffHBL(index){
        const deletedHbl = this.tmffForm.product[index];
        // 遍历该HBL下的所有产品行，移除选中值
        deletedHbl.subItemData.forEach(row => {
          if (row.soNumber) {
            this.selectedSoNumbers = this.selectedSoNumbers.filter(
              so => so !== row.soNumber
            );
          }
        });

        this.tmffForm.product.splice(index, 1)
        this.sumTmffRowTotal(index)
      },
      changeItemOrderRow(row ,index){
        if(row.soNumber){
          let so = this.shipment.shippingOrderProductResList.find((item) => item.soNumber == row.soNumber);
          if(so){
            this.$set(row, 'bookQty', so.totalQty)
            this.$set(row, 'weight', so.totalWeight)
            this.$set(row, 'volume', so.totalCbm)

            this.$set(row, 'shipmentId', so.shipmentId)
            this.$set(row, 'shipperOrderId', so.shipperOrderId)
            //this.$set(row, 'shipmentClpId', so.shipmentClpId)
            //this.$set(row, 'clpDetailResList', so.clpDetailResList)
            //this.$set(row, 'soType', so.soType)
            //对象转成数组
            // const typeList = Object.values(containerTypeMap);
            // this.$set(row, 'typeList', typeList)
            this.sumTmffRowTotal(index)
          }

        }

        const newSo = row.soNumber;
        const oldSo = row._oldSo; // 临时存储旧值

        // 移除旧值（如果存在且不等于新值）
        if (oldSo && oldSo !== newSo) {
          this.selectedSoNumbers = this.selectedSoNumbers.filter(so => so !== oldSo);
        }

        // 添加新值（如果有效且未被选中）
        if (newSo && !this.selectedSoNumbers.includes(newSo)) {
          this.selectedSoNumbers.push(newSo);
        }

        // 存储当前值作为下次变更的旧值
        row._oldSo = newSo;
      },
    sumTmffRowTotal2(index){
      var tmffTotalPackages2 = 0, tmffTotalWeight2 = 0 , tmffTotalCbm2 = 0
      this.tmffAllNotTotalPackages2 = 0
      this.tmffAllNotTotalWeight2 =  0
      this.tmffAllNotTotalCbm2 =  0
      let processedOrderNumbers = new Set();
      //subItem
      if(this.tmffForm2.product[index]){
        for (const item of this.tmffForm2.product[index].subItemData) {
          if(item.bookQty) {
            tmffTotalPackages2 += Number(item.bookQty);
          }
          if(item.weight) {
            tmffTotalWeight2 += Number(item.weight);
          }
          if(item.volume) {
            tmffTotalCbm2 += Number(item.volume);
          }
        }
        this.tmffForm2.product[index].tmffTotalPackages = tmffTotalPackages2.toFixed(0)
        this.tmffForm2.product[index].tmffTotalWeight =  tmffTotalWeight2.toFixed(3)
        this.tmffForm2.product[index].tmffTotalCbm = tmffTotalCbm2.toFixed(3)
      }
      //all
      for (var i = 0; i < this.tmffForm2.product.length; i++) {
        var item = this.tmffForm2.product[i]
        if(!item.tmffTotalPackages){
          item.tmffTotalPackages = 0
        }
        if(!item.tmffTotalWeight) {
          item.tmffTotalWeight = 0
        }
        if(!item.tmffTotalCbm) {
          item.tmffTotalCbm = 0
        }
        for (const subItem of item.subItemData) {
          this.tmffAllNotTotalPackages2 += Number(subItem.bookQty ? subItem.bookQty : 0)
          this.tmffAllNotTotalWeight2 += Number(subItem.weight ? subItem.weight : 0)
          this.tmffAllNotTotalCbm2 += Number(subItem.volume ? subItem.volume : 0)
        }
      }
      this.tmffAllTotalPackages = Number(this.tmffAllTotalPackages).toFixed(0);
      this.tmffAllTotalWeight = Number(this.tmffAllTotalWeight).toFixed(3);
      this.tmffAllTotalCbm = Number(this.tmffAllTotalCbm).toFixed(3);
      //po已有的量 - 所有的填写的量 = 余量
      this.tmffAllNotTotalPackages2 = (this.tmffAllNotTotalPackages2 - this.tmffAllTotalPackages ).toFixed(0)
      this.tmffAllNotTotalWeight2 =  (this.tmffAllNotTotalWeight2 - this.tmffAllTotalWeight ).toFixed(3)
      this.tmffAllNotTotalCbm2 =  (this.tmffAllNotTotalCbm2 - this.tmffAllTotalCbm ).toFixed(3)
    },
    sumTmffRowTotal(index){
        var tmffTotalPackages = 0, tmffTotalWeight = 0 , tmffTotalCbm = 0
        this.tmffAllNotTotalPackages = 0
        this.tmffAllNotTotalWeight =  0
        this.tmffAllNotTotalCbm =  0
        let processedOrderNumbers = new Set();
        //subItem
        if(this.tmffForm.product[index]){
          for (const item of this.tmffForm.product[index].subItemData) {
            if(item.bookQty) {
              tmffTotalPackages += Number(item.bookQty);
            }
            if(item.weight) {
              tmffTotalWeight += Number(item.weight);
            }
            if(item.volume) {
              tmffTotalCbm += Number(item.volume);
            }
          }
          this.tmffForm.product[index].tmffTotalPackages = tmffTotalPackages.toFixed(0)
          this.tmffForm.product[index].tmffTotalWeight =  tmffTotalWeight.toFixed(3)
          this.tmffForm.product[index].tmffTotalCbm = tmffTotalCbm.toFixed(3)

        }
        //all
        for (var i = 0; i < this.tmffForm.product.length; i++) {
          var item = this.tmffForm.product[i]
          if(!item.tmffTotalPackages){
            item.tmffTotalPackages = 0
          }
          if(!item.tmffTotalWeight) {
            item.tmffTotalWeight = 0
          }
          if(!item.tmffTotalCbm) {
            item.tmffTotalCbm = 0
          }

          for (const subItem of item.subItemData) {
            this.tmffAllNotTotalPackages += Number(subItem.bookQty ? subItem.bookQty : 0)
            this.tmffAllNotTotalWeight += Number(subItem.weight ? subItem.weight : 0)
            this.tmffAllNotTotalCbm += Number(subItem.volume ? subItem.volume : 0)
          }
        }
        this.tmffAllTotalPackages = Number(this.tmffAllTotalPackages).toFixed(0);
        this.tmffAllTotalWeight = Number(this.tmffAllTotalWeight).toFixed(3);
        this.tmffAllTotalCbm = Number(this.tmffAllTotalCbm).toFixed(3);
        //po已有的量 - 所有的填写的量 = 余量
        this.tmffAllNotTotalPackages = (this.tmffAllNotTotalPackages - this.tmffAllTotalPackages ).toFixed(0)
        this.tmffAllNotTotalWeight =  (this.tmffAllNotTotalWeight - this.tmffAllTotalWeight ).toFixed(3)
        this.tmffAllNotTotalCbm =  (this.tmffAllNotTotalCbm - this.tmffAllTotalCbm ).toFixed(3)
    },
    submitSinotransVGM(form){
      submitSinotransVGMAPI(form).then((res)=>{
        this.sinotransVGMVisable=false
        this.$set(this.shipment,'shipmentVgmDOS',JSON.parse(form.vmg))
        this.$nextTick(() => {
          this.init();
          this.$notify({
            title: 'success',
            message: 'success',
            type: 'success'
          });
        })
        this.getShipmentStatus()
        this.init()
        this.$forceUpdate()
      })
    },
    openSinotransVGM(){
      console.log(this.showCNNGBSI)
      if (this.showCNNGBSI) {
        this.$router.push("/shipment/verified-gross-mass?id=" + this.shipment.id);
        return;
      } else {
        this.sinotransVGMVisable = true
      }
    },
    handeDocumentNumberTrim(value) {
      this.uploadDocument.formData.documentNumber = value.trim();
    },
    handeDocumentEmailTrim(value) {
      this.uploadDocument.formData.email = value.trim();
    },
    getThirdPartyRes() {

      },
      shipLogCreate() {
        console.log(this.user)
        console.log(this.html.trim())
        if (this.html.trim() == '') {
          this.$notify({
            message: ' please fill content',
            type: 'warning'
          });
        } else {
          var data = {
            logInfo: this.html,
            email: this.user.email,
            type: 4,
            shipmentId: this.shipment.id
          }
          shipLogCreate(data).then((res) => {
            this.getShipLogList()
            this.html = ''
            this.commentsDialogVisible = false
          })
        }

      },
      shipLogDelete(row) {
        this.$confirm('Confirm to delete?').then(()=> {
          shipLogDelete(row.id).then((res) => {
            this.getShipLogList()
          })
        });
      },
      onCreated(editor) {
        i18nChangeLanguage('en')
        this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
      },
      updateBlNumber(item) {
        this.$prompt("BL Number", "BL Number", {
          confirmButtonText: "Submit",
          cancelButtonText: "Cancel",
          inputType: "text",
          showInput: true,
          inputValue: item.blNumber,
        })
          .then(({ value }) => {
            updateBlNumber({ shipmentId: this.shipment.id, blNumber: value }).then((res) => {
              this.shipment.blNumber = value;
            });
          })
          .catch(() => { });
      },
      activateShipment(item) {
        this.$modal
          .confirm('Confirm to Activate?')
          .then(function () {
            return activateShipment(item.id);
          })
          .then(() => {
            this.getShipmentStatus();
            this.init();
            this.$notify({
              title: 'success',
              message: 'success',
              type: 'success'
            });
          })
          .catch(() => { });

      },
    // 新增处理取消按钮的方法
    handleOpenCancel2(type) {
      if (this.hasVGMFinishedMilestone()) {
        this.$confirm(
          '<span style="color: red; font-weight: bold;">Carrier SI already done! Pls must inform and double check with OP who has finished SI !</span>',
          'Warning',
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          this.openCancel2(type);
        }).catch(() => {
          // 用户取消操作
        });
      } else {
        this.openCancel2(type);
      }
    },
      openCancel2(status) {
        this.cancelType = status
        if (status == 1) {
          this.cancelTitle = 'Cancel'
        } else {
          this.cancelTitle = 'Deactivate'
        }
        this.centerDialogVisible = true
      },
      openContainerMovement(containerNo) {
        if (this.onlyPreview) {
          return
        }
        this.visableContainerMovement = true;
        this.containerMovement = {
          containerNo: containerNo
        }
      },
      submitContainerMovement() {
        this.containerMovement.shipmentId = this.shipment.id
        createContainerStatus(this.containerMovement).then((res) => {
          this.getContainerStatusListByCondition(this.shipment.id)
          this.visableContainerMovement = false
        })
      },

      handleUpdateDestinationRouter(row) {
        this.visableDestinationRouter = true;
        this.destinationRouter = row;
      },
      handleDeleteDestinationRouter(row) {
        const id = row.id;
        this.$modal.confirm('Delete id "' + id + '" ?').then(function() {
            return deleteDestinationRouter(id);
          }).then(() => {
            this.getDestinationRouterList();
            this.$modal.msgSuccess("Success");
          }).catch(() => {});
      },
      opendestinationRouter() {
        this.visableDestinationRouter = true;
        this.destinationRouter = {
          'pol':this.shipment.pod
        }
      },
      getDestinationRouterList() {
        getDestinationRouterList({ shipmentId: this.shipment.id }).then((res) => {
          for(var temp of res.data) {
            temp.containers=temp.containers?temp.containers.split(','):[]
          }
          this.destinationRouterList = res.data;
          this.tempPlaces2 = []
          for (var index = 0; index < this.destinationRouterList.length; index++) {
            var tempPlaces = [];
              var item = this.destinationRouterList[index]
              var item1 = {};
              item1.code = item.pol
              item1.transportMeanName = item.transportMeanName
              item1.voyage = item.voyage
              item1.transportMode = item.transportMode
              item1.etd = item.etd
              item1.atd = item.atd
              item1.containers = item.containers
              item1.comments = item.comments
              tempPlaces.push(item1);

              var item2 = {};
              item2.code = item.pod
              item2.transportMode = item.transportMode
              item2.eta = item.eta
              item2.ata = item.ata
              tempPlaces.push(item2);
              this.tempPlaces2.push(tempPlaces);
            }
            this.getAddContainers()

        })
      },
      submitDestinationRouter() {
        this.destinationRouter.shipmentId = this.shipment.id
        this.destinationRouter.tenantId = this.shipment.tenantId
        if(this.destinationRouter.containers){
          this.destinationRouter.containers=this.destinationRouter.containers.join(',')
        }
        if (this.destinationRouter.id != null) {
            updateDestinationRouter(this.destinationRouter).then(response => {
              this.visableDestinationRouter = false
              this.getDestinationRouterList()
            });
            return;
          }
        createDestinationRouter(this.destinationRouter).then((res) => {
          this.visableDestinationRouter = false
          this.getDestinationRouterList()
        })
      },
      viewContainer(item) {
        if(item==null) {
          var containers = this.shipment.containerDOList.filter((item) => item.type == 1)
          let new_arr = containers.map(obj => {return obj.containerNo})
          this.tipContainers = new_arr
        } else {
          this.tipContainers = item.containers
        }
        console.log(item)
      },
      submitPortCall(){
        this.portCall.shipmentId=this.shipment.id
        if (this.portCall.id != null) {
          updatePlaces(this.portCall).then((res)=>{
            this.getPlaces(this.shipment.id)
            this.visablePortCall=false
            this.getShipLogList()
          })
        } else {
          createPlaces(this.portCall).then((res)=>{
            this.getPlaces(this.shipment.id)
            this.visablePortCall=false
            this.getShipLogList()
          })
        }
      },
      exportVesselListByCondition() {
        exportVesselListByCondition({ shipmentId: this.shipment.id }).then((res) => {
          console.log(res.data)
          for (var i = 0; i < res.data.length; i++) {
            this.vesselMap[res.data[i].vessel] = res.data[i].imo
          }
        })
      },
      getPlaces(shipmentId) {
        placesListByCondition({ shipmentId: shipmentId }).then((res) => {
          this.places = res.data
        })
      },
      getContainerStatusListByCondition(shipmentId) {
        containerStatusListByCondition({ shipmentId: shipmentId }).then((res) => {
          this.containerMovementList = res.data
        })
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
      openPortCall() {
        this.visablePortCall = true;
        this.portCall = {}
      },
      editPortCall(index,row){
        this.visablePortCall=true;
        this.portCall=row;
      },
      deletePlacesById(index,row){
        this.$modal.confirm('Delete  ?').then(function () {
          return  deletePlaces(row.id)
        }).then(() => {
          this.getPlaces(this.shipment.id)
          this.$modal.msgSuccess("Success");
        }).catch(() => {
        });
      },
      showDelBut(id){
        this.showFileDelButton = id
      },
      /** 删除文档按钮操作 */
      deleteDocument(row) {
        if (this.onlyPreview) {
          return
        }
        const id = row.id;
        this.$modal.confirm('Delete "' + row.name + '"?').then(function () {
          return deleteFile(id);
        }).then(() => {
          this.getDocument();
          saveCargo(this.$route.query.id).then((res) => { });
          this.$modal.msgSuccess("Success");
        }).catch(() => {
        });
      },
      //查询文档
      getDocument() {
        getShipmentFiles(this.$route.query.id).then((res) => {
          if (res.data) {
            this.carrierBillList = res.data.carrierBill
            this.houseBillList = res.data.houseBill
            this.othersList = res.data.others
          }
        });
      },
      covStatus(val) {
        if (val == 'Issued') {
          return 'ORIGINAL'
        }
        return val
      },
      clickUploadFile() {
        this.uploadDocument.title = "Add";
        this.uploadDocument.formData = {}
        this.uploadDocument.fileList = null
        this.showSendEmail = true
        this.uploadDocument.open = true;
        if (this.$refs.uploadShipmentDocument) {
          this.$refs.uploadShipmentDocument.clearFiles();
        }
      },
      handlePreview(file) {
        if (file.id) {
          window.location.href = file.url
        }
      },
      /** 修改文件,删除旧文件 */
      deleteOldDocument() {
        deleteFile(this.uploadDocument.formData.id);
      },
      openDocumentDialog(row) {
      console.log(this.onlyPreview)
        if (this.onlyPreview) {
          return
        }
        this.uploadDocument.title = "Update";
        this.showSendEmail = false
        this.uploadDocument.open = true;
        this.uploadDocument.fileList = [row]

        this.uploadDocument.formData = row
        if (row.dataType == 'shipment_carrier_bill') {
          this.uploadDocument.formData.type = '1'
        } else if (row.dataType == 'shipment_house_bill') {
          this.uploadDocument.formData.type = '2'
        } else if (row.dataType == 'shipment_others') {
          this.uploadDocument.formData.type = '3'
        }


      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.uploadDocument.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        if (response.code !== 0) {
          this.$modal.msgError(response.msg);
          return;
        }
        this.uploadDocument.open = false;
        this.uploadDocument.isUploading = false;
        this.$refs.uploadShipmentDocument.clearFiles();

        this.uploadDocument.formData = {}
        this.uploadDocument.loading = false
        this.getDocument();
      },
      sumGrossWeight(row){
        var sum = row.productData.reduce((sum, item) => sum + (Number(item?.grossWeight) || 0), 0).toFixed(3)
        row.grossWeight = sum
        return sum
      },
      sumVGM(row){
        try {
        var sum = row.productData.reduce((sum, item) => sum + (Number(item?.grossWeight) || 0), 0).toFixed(3)
        var sumTare = (Number(row?.tareWeight) || 0).toFixed(3)
        return Number(sum) + Number(sumTare)
        } catch (error) {
          console.error('计算总重量出错:', error);
          return 0; // 确保即使出错也有返回值
        }
      },
      showStatus(data) {
        if(data.status==1){
          return 'Cancel'
        }
        if(data.status==3){
          return 'Deactivate'
        }
        if(data.status==2){
          return 'Draft'
        }
        if(data.status==4){
          return 'Draft Shipping Instruction'
        }
        if(data.status==5){
          return 'Shipper SI'
        }
        if(data.shipmentContainerStatusDOS && data.shipmentContainerStatusDOS.length==0){
          function compare(){
            return function(a,b){
                var value1 = a["status"];
                var value2 = b["status"];
                return parseInt(value1) - parseInt(value2);
            }
          }
          var arr=JSON.parse(JSON.stringify(data.shipmentDetailDOS)).filter(item=>item.endDate!=null)
          arr.sort(compare())
          if(arr.length>0){
            return this.otherMilestones[arr[arr.length-1].status]
          }
          return 'Created'

        }
        if(data.shipmentContainerStatusDOS && data.shipmentContainerStatusDOS.length>0){

          var move=data.shipmentContainerStatusDOS[data.shipmentContainerStatusDOS.length-1]
          if(data.carrier=='TSHG'){

            return this.containerStatus[move.eventCode]?this.containerStatus[move.eventCode]:move.eventCode
          }else{
            return this.containerStatus[move.eventCode]?this.containerStatus[move.eventCode]:move.descriptionEn
          }
        }
        return 'Created'
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs["uploadDocumentForm"].validate((valid) => {
          if (valid) {
            if(this.$refs.uploadShipmentDocument.uploadFiles == null || this.$refs.uploadShipmentDocument.uploadFileslength == 0){
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
            if(this.uploadDocument.formData.email == 'null'){
              this.uploadDocument.formData.email = ''
            }
            if(this.uploadDocument.formData.type == '3'){
              this.uploadDocument.formData.type2 = ''
              this.uploadDocument.formData.email = ''
              this.uploadDocument.formData.sendEmail = false
            }
            if(this.showSendEmail){
              this.$refs.uploadShipmentDocument.submit();
            }else{
              if(this.$refs.uploadShipmentDocument.uploadFiles.length > 0 && this.$refs.uploadShipmentDocument.uploadFiles[0].id == null){
                this.$set(this.uploadDocument,'tempaax',1)
                this.$delete(this.uploadDocument, 'tempaax');
                this.$refs.uploadShipmentDocument.submit();
              }else{
                this.updateDocumentFile()
              }
            }
          }
        })
      },
      updateDocumentFile() {

        updateDocumentFile(this.uploadDocument.formData).then((res) => {
          this.uploadDocument.loading = false
          this.uploadDocument.open = false;
          this.$refs.uploadShipmentDocument.clearFiles();

          this.uploadDocument.formData = {}
          this.getDocument();
          this.$modal.msgSuccess("Success");
        })
      },
      downloadVGM() {
        downloadVGM({ id: this.shipment.id }).then((res) => {
          this.$download.excel(res, "vgm.xlsx");
        })
      },
      totalVolum() {
        const totalNumberOfPackages = this.siForm.containers.reduce((sum, container) => {
          return sum + container.productData.reduce((containerSum, item) => {
            return containerSum + (Number(item?.numberOfPackages) || 0);
          }, 0);
        }, 0);
        return totalNumberOfPackages
      },
      totalCBM() {
        const totalNumberOfPackages = this.siForm.containers.reduce((sum, container) => {
          return sum + container.productData.reduce((containerSum, item) => {
            return containerSum + (Number(item?.volume) || 0);
          }, 0);
        }, 0);
        return totalNumberOfPackages
      },
      totalWeight() {
        const totalNumberOfPackages = this.siForm.containers.reduce((sum, container) => {
          return sum + container.productData.reduce((containerSum, item) => {
            return containerSum + (Number(item?.grossWeight) || 0);
          }, 0);
        }, 0);
        return totalNumberOfPackages
      },
      pushJsonToVMT() {
        var data = this.editableTabs;
        var resData = []
        var index = 0
        this.apiLod = true
        for (var i = 0; i < data.length; i++) {

          var jsons = data[i].content.split("\n")
          if (jsons.length > 2) {
            for (var j = 0; j < jsons.length; j++) {
              if (jsons[j]) {
                submitVmtJson({ data: jsons[j] }).then((res) => {
                  var tempDate = res.data
                  tempDate["tab"] = data[resData.length >= data.length ? data.length - 1 : resData.length].title
                  resData.push(tempDate)
                });
              }
            }

          } else {
            var reqData = data[i].content.replaceAll('\n', '')
            if (reqData) {
              submitVmtJson({ data: reqData }).then((res) => {
                var tempDate = res.data
                tempDate["tab"] = data[resData.length >= data.length ? data.length - 1 : resData.length].title
                resData.push(tempDate)
              });
            }
          }
        }
        setTimeout(() => {
          var errorList = []
          for (var i = 0; i < resData.length; i++) {
            if (resData[i].title) {
              errorList.push({ "tab": resData[i].tab, message: resData[i].title, d: resData[i].data })
            }
          }
          if (errorList.length > 0) {
            this.$notify({
              message: 'API Call Error',
              type: 'warning'
            });
            this.apiErrorList = errorList
            this.apiVisible = true
          } else {
            this.$notify({
              message: 'SUCCESS',
              type: 'success'
            });
          }
          this.apiLod = false
          this.tempJsonVisible = false
        }, 3000);

      },
      parseTimeToZ(timestamp) {
        if (!timestamp) return null
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `"${year}-${month}-${day} ${hours}:${minutes}:${seconds}Z"`;
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

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}Z`;
      },
      sendEmail() {
        sendToCarrier({ id: this.shipment.id }).then((res) => {
          if (res.data == 0) {
            this.$notify({
              title: 'success',
              message: 'success',
              type: 'success'
            });
          } else {
            this.$notify.error({
              title: 'error',
              message: 'no files'
            });
          }
        })
      },
      submitTempJson() {
        this.editableTabs = []
        var json = ''
        console.log(this.tempData)
        var lotNo = this.tempData.poNumbers

        var actionsJson = null
        for (var i = 0; i < this.checkedCities.length; i++) {
          var data = ''

          var bookingItem = this.tempData.bookingItemResVOS
          for (var j = 0; j < bookingItem.length; j++) {
            data += '\n'
            if (this.checkedCities[i] == 'BOOKED_ETD') {
              data += '{"lot": "' + bookingItem[j].orderNumber + '","statuscode": "BOOKED_ETD","timestamp": ' + this.parseTimeToZ(this.tempData.bookedEtd) + '}'

            } else if (this.checkedCities[i] == 'BOOKED_ETA') {
              data += '{"lot": "' + bookingItem[j].orderNumber + '","statuscode": "BOOKED_ETA","timestamp": ' + this.parseTimeToZ(this.tempData.bookedEta) + '}'

            } else if (this.checkedCities[i] == 'TRANS_ETD' && this.tempData.routerDOList[0]) {

              data += '{"lot": "' + bookingItem[j].orderNumber + '","statuscode": "TRANS_ETD","timestamp": ' + this.parseTimeToZ(this.tempData.routerDOList[0].etd) + ',"port": "' + this.tempData.pol + '","revoke": 0}'

            } else if (this.checkedCities[i] == 'TRANS_ETA' && this.tempData.routerDOList[0]) {

              var router = this.tempData.routerDOList.find((item) => item.pod == this.tempData.pod);
              data += '{"lot": "' + bookingItem[j].orderNumber + '","statuscode": "TRANS_ETA","timestamp": ' + this.parseTimeToZ(router.eta) + ',"port": "' + this.tempData.destinationPort + '","revoke": 0}'

            } else if (this.checkedCities[i] == 'TRANS_ATD') {
              if (this.tempData.atd) {
                data += '{"lot": "' + bookingItem[j].orderNumber + '","statuscode": "TRANS_ATD","timestamp": ' + this.parseTimeToZ(this.tempData.atd) + ',"port": "' + this.tempData.pol + '","revoke": 0}'
              } else {
                data += 'ATD IS NULL'
              }
            } else if (this.checkedCities[i] == 'TRANS_ATA') {
              if (this.tempData.ata) {
                data += '{"lot": "' + bookingItem[j].orderNumber + '","statuscode": "TRANS_ATA","timestamp": ' + this.parseTimeToZ(this.tempData.ata) + ',"port": "' + this.tempData.destinationPort + '","revoke": 0}'
              } else {
                data += 'ATA IS NULL'
              }
            } else if (this.checkedCities[i] == 'TRANS_SHP_VESSEL') {
              var router = this.tempData.routerDOList.find((item) => item.pol == this.tempData.pol);
              data += '{"lot": "' + bookingItem[j].orderNumber + '","statuscode": "TRANS_SHP_VESSEL","timestamp": ' + this.parseTimeToZ(Date.now()) + ',"voyage": "' + router.voyage + '","vessel": "' + router.transportMeanName + '","imo": "' + router.imo + '","carrier": "' + this.tempData.carrier + '"}'

            } else if (this.checkedCities[i] == 'TRANS_FND') {
              data += '{"lot": "' + bookingItem[j].orderNumber + '","statuscode": "TRANS_FND","timestamp": ' + this.parseTimeToZ(this.tempData.routerDOList[this.tempData.routerDOList.length - 1].eta) + ',"fnd": "' + this.tempData.pod + '","revoke": 0}'

            } else if (this.checkedCities[i] == 'API_CARGOO') {

              data += '{"message_id": "' + uuidv4() + '","lot": "' + bookingItem[j].orderNumber + '","statuscode": "TRANS_BKG_NO","timestamp": ' + this.parseTimeToZ(Date.now()) + ',"booking_no": "' + this.tempData.shipmentBookingNumber + '", "carrier": "' + this.tempData.carrier + '", "revoke": 0 }'

            } else if (this.checkedCities[i] == 'TRANS_SHP_ARRVL_VESSEL') {
              var router = this.tempPlaces.find((item) => item.code == this.tempData.destinationPort)
              //飞陀查询不到就拿自己的
              if (!router) {
                router = this.tempData.routerDOList.find((item) => item.pod == this.tempData.pod);
                if (router) {
                  data += '{"lot": "' + bookingItem[j].orderNumber + '","statuscode": "TRANS_SHP_ARRVL_VESSEL","timestamp":  ' + this.parseTimeToZ(this.tempData.routerDOList[this.tempData.routerDOList.length - 1].eta) + ',"voyage": "' + router.voyage + '","vessel": "' + router.transportMeanName + '","imo": "' + router.imo + '","carrier": "' + this.tempData.carrier + '"}'
                }

              } else {
                var vessel = this.tempVessel.find((item) => item.vessel == router.vessel)
                data += '{"lot": "' + bookingItem[j].orderNumber + '","statuscode": "TRANS_SHP_ARRVL_VESSEL","timestamp":  ' + this.parseTimeToZ(this.tempData.routerDOList[this.tempData.routerDOList.length - 1].eta) + ',"voyage": "' + router.voyage + '","vessel": "' + router.vessel + '","imo": "' + vessel.imo + '","carrier": "' + this.tempData.carrier + '"}'

              }

            }
          }

          var containList = this.tempData.containerDOList
          for (var c = 0; c < containList.length; c++) {
            // 寻找 "还空箱" 事件并获取其 "eventTime"
            var getOutTime = null
            var getInTime = null
            var iPCTime = null
            var PODTime = null
            var actionsData = JSON.parse(containList[c].actions)
            if (actionsData) {
              for (var x = 0; x < actionsData.status.length; x++) {
                var descriptionCn = actionsData.status[x].descriptionCn
                var eventCode = actionsData.status[x].eventCode
                if (descriptionCn == '还空箱') {
                  getOutTime = this.formatDateTimeToCustomFormat(actionsData.status[x].eventTime);
                }
                if (eventCode == 'GITM' && this.tempData.pol == actionsData.status[x].portCode) {
                  getInTime = this.formatDateTimeToCustomFormat(actionsData.status[x].eventTime);
                }
                if (eventCode == 'STCS' && this.tempData.pod == actionsData.status[x].portCode) {
                  iPCTime = this.formatDateTimeToCustomFormat(actionsData.status[x].eventTime);
                }
                if (eventCode == 'GTOT' && this.tempData.pod == actionsData.status[x].portCode) {
                  PODTime = this.formatDateTimeToCustomFormat(actionsData.status[x].eventTime);
                }
              }
              if (this.tempData.poNumbers) {
                if (this.checkedCities[i] == 'CONTR_PICKUP_POD' && (PODTime || iPCTime)) {
                  data += '{"lot": "' + lotNo + '","statuscode": "CONTR_PICKUP_POD","timestamp": ' + (this.tempData.pod == this.tempData.destinationPort ? iPCTime : PODTime) + ',"container": "' + containList[c].containerNo + '","activity_location": "' + this.tempData.destinationPort + '","revoke": 0}'
                  data += '\n'
                } else if (this.checkedCities[i] == 'CONTR_ARRVL_TERM' && this.tempData.pod != this.tempData.destinationPort) {
                  data += '{"lot": "' + lotNo + '","statuscode": "CONTR_ARRVL_TERM","timestamp": ' + iPCTime + ',"container": "' + containList[c].containerNo + '","activity_location": "' + this.tempData.pod + '","source_id": null}'
                  data += '\n'
                } else if (this.checkedCities[i] == 'CONTR_RETURN_DEPOT') {
                  data += '{"lot": "' + lotNo + '","statuscode": "CONTR_RETURN_DEPOT","timestamp": ' + getOutTime + ',"container": "' + containList[c].containerNo + '","activity_location": "' + this.tempData.pod + '","revoke": 0}'
                  data += '\n'
                } else if (this.checkedCities[i] == 'CONTR_GATE_IN') {
                  data += '{"lot": "' + lotNo + '","statuscode": "CONTR_GATE_IN","timestamp": ' + getInTime + ',"revoke": 0}'
                  data += '\n'
                }
              }
            }


          }

          json = data
          let newTabName = i + '';
          this.editableTabs.push({
            title: this.checkedCities[i],
            name: newTabName,
            content: json
          });
        }
      },
      formatDateTimeToCustomFormat(dateTimeStr) {
        // 将原始日期时间字符串解析为 Date 对象
        var date = new Date(dateTimeStr);

        // 格式化为 "yyyy-MM-dd HH:mm:ss'Z" 格式
        var formattedTime = date.getFullYear() + '-' +
          this.padZero(date.getMonth() + 1) + '-' +
          this.padZero(date.getDate()) + ' ' +
          this.padZero(date.getHours()) + ':' +
          this.padZero(date.getMinutes()) + ':' +
          this.padZero(date.getSeconds()) + "Z";

        return formattedTime;
      },

      // 辅助函数：确保单个数字的月份、日期、小时、分钟和秒前面有零
      padZero(number) {
        if (number < 10) {
          return "0" + number;
        }
        return number;
      },

      handleCheckAllChange(val) {
        this.checkedCities = val ? this.checkList.map(item => item.label) : [];
        this.isIndeterminate = false;
        this.submitTempJson()
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.checkList.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkList.length;
        this.submitTempJson()
      },
      tempJson(data) {

        this.isIndeterminate = false
        this.editableTabs = []
        this.checkedCities = []
        this.tempJsonVisible = true
        this.tempData = data
      },
      coCancelCategoryNote(key) {
        var data = this.selCancelCategory.find((element) => element.enumId == key)
        if (data) return data.description
      },

      coCancelReasonNote(key) {
        var data = this.selCancelReason.find((element) => element.enumId == key)
        if (data) return data.description
      },
      queryNotes() {
        getNotePage({ ShipmentId: this.$route.query.id }).then((res) => {
          this.shipmentNoteList = res.data ? res.data.list : []
        });
      },
      subPo(index) {
        this.selectedTable.splice(index, 1);
        this.selectIds = []
        for (var i = 0; i < this.selectedTable.length; i++) {
          this.selectIds.push(this.selectedTable[i].id)
        }

      },
      applyNewHsCode() {
        this.applyHsCodeVisable = true
      },
      submitHsCode() {
        this.$refs['hsCodeForm'].validate((valid) => {
          if (valid) {
            applyNewHsCode(this.hsCode).then((res) => {
              this.$notify({
                title: 'success',
                message: 'success',
                type: 'success'
              });
              this.applyHsCodeVisable = false
              this.hsCode = {}
            })
          } else {
            return false;
          }
        });
      },
      showDeleteIn(id) {
        this.showDelete[id] = true
        this.showDelete = JSON.parse(JSON.stringify(this.showDelete))
      },
      showDeleteOut(id) {
        this.showDelete[id] = false
        this.showDelete = JSON.parse(JSON.stringify(this.showDelete))
      },
      getAllFollowers() {
        if(this.followerPage.name==null||this.followerPage.name==''||this.followerPage.name==' ') {
          this.noSelectedFollower = this.agentData.map(obj => {return String(obj.id)}).filter((id) => !this.selectedFollower.includes(id))
        } else {
          const pattern = new RegExp(this.followerPage.name.split('').join('.*'), 'i');
          var noSelected = this.agentData.filter((item) => !this.selectedFollower.includes(String(item.id)))
          noSelected = noSelected.filter((item) => pattern.test(item.name))
          this.noSelectedFollower = noSelected.map(obj => {return String(obj.id)})
        }
      },
      addRemoveFollower() {
        this.noSelectedFollower = this.agentData.map(obj => {return String(obj.id)}).filter((id) => !this.selectedFollower.includes(id))
        this.followerDialogVisible = true
      },
      getAgentName() {
        if(this.selectedFollower.length>0) {
          var temp = ''
          for(let i = 0; i < this.selectedFollower.length; i++) {
            let id = this.selectedFollower[i];
            temp += this.agentMap[id]?this.agentMap[id].name:'-'
            if(i!=this.selectedFollower.length-1) {
              temp += ','
            }
          }
          this.agentDetail.agent = temp
          this.agentDetail.agentId = this.selectedFollower.join(',')
        } else {
          this.agentDetail.agent = ''
          this.agentDetail.agentId = ''
        }
      },
      submitFollowerChange() {
          this.followerDialogVisible = false
          this.getAgentName()
      },
      addFollower(row,index) {
        this.noSelectedFollower.splice(index, 1);
        this.selectedFollower.push(row)
        this.showDelete = {}
        for(var id of this.selectedFollower){
          this.showDelete[id] = false
        }
        this.getAgentName()
      },
      subFollower(row,index) {
        this.selectedFollower.splice(index, 1);
        this.noSelectedFollower.push(row)
        this.getAgentName()
        this.showDelete = {}
        for(var id of this.selectedFollower){
          this.showDelete[id] = false
        }
        this.getAgentName()
      },


      addRemoveContainer(row) {
        this.destinationRouter = JSON.parse(JSON.stringify(row))
        this.selectedContainer = JSON.parse(JSON.stringify(row.containers))
        this.getAddContainers()
        this.addRemoveContainerVisible = true
      },
      submitContainerChange() {
        this.destinationRouter.containers = this.selectedContainer
        this.submitDestinationRouter()
        this.addRemoveContainerVisible = false
        this.getDestinationRouterList()
      },
      addContainer(row,index) {
        this.noSelectedContainer.splice(index, 1);
        this.selectedContainer.push(row)
      },
      subContainer(row,index) {
        this.selectedContainer.splice(index, 1);
        this.noSelectedContainer.push(row)
      },

      getAllContainers() {
        if(this.containerPage.containerNo==null||this.containerPage.containerNo==''||this.containerPage.containerNo==' ') {
          this.getAddContainers()
        } else {
          const pattern = new RegExp(this.containerPage.containerNo.split('').join('.*'), 'i');
          this.noSelectedContainer = this.noSelectedContainer.filter((item) => pattern.test(item))
        }
      },
      getAddContainers() {
        var concatenatedArray = []
        for (var index = 0; index < this.destinationRouterList.length; index++) {
            var item = this.destinationRouterList[index]
            concatenatedArray = concatenatedArray.concat(item.containers)
        }
        this.noSelectedContainer = this.shipment.containerDOList.filter((item) => item.type == 1).filter((item) => !concatenatedArray.includes(item.containerNo)).map(obj => {return obj.containerNo})
        this.addContainers = JSON.parse(JSON.stringify(this.noSelectedContainer))
      },
      submitPoChange() {
        var data = {
          shipmentId: this.$route.query.id,
          bookingIds: this.selectIds
        }
        addRemovePO(data).then((res) => {
          this.addRemovePOVisible = false
          this.$notify({
            title: 'success',
            message: 'success',
            type: 'success'
          });
          this.init();
        })
      },
      addPo(row) {
        var res = this.selectedTable.filter((item) => item.id == row.id)
        if (res.length == 0) {
          this.selectedTable.push(row)
          for (var i = 0; i < this.selectedTable.length; i++) {
            this.selectIds.push(this.selectedTable[i].id)
          }
        }
      },
      getAllBookings() {
        getPage(this.pbPage).then((res) => {
          this.pbTable = res.data.list;
          this.pbPage.total = res.data.total;
        })
      },
      getListByShipmentId() {
        getListByShipmentId({ shipmentId: this.$route.query.id }).then((res) => {
          this.selectedTable = res.data;
          this.selectIds = []
          for (var i = 0; i < this.selectedTable.length; i++) {
            this.selectIds.push(this.selectedTable[i].id)
          }
        })
      },
      toggleDetails(index) {
        this.$set(this.expanded, index, !this.expanded[index]);
      },
      addRemovePo() {
        this.addRemovePOVisible = true
        this.getAllBookings()
        this.getListByShipmentId()
      },
      downloadImportTemplate() {
        downloadContainersTemplate({'shipmentId':this.shipment.id}).then((res) => {
          this.$download.excel(res, "import_template.xlsx");
        })
      },
      async checkContainerNo(query) {
        var responseData = null;

        await new Promise((resolve, reject) => {
          checkDataByNoAndType({ data: query })
            .then(response => {
              responseData = response.data;
              resolve();
            })
            .catch(error => {
              reject(error);
            });
        });
        return responseData;


      },

      beforeUploadContainers(file) {
        var vm = this
        this.file2Xce(file).then(tabJson => {
          console.log(tabJson)
          if (tabJson && tabJson.length > 0 && tabJson[0].sheet.length > 0) {
            var errorList = []
            var listTable = []
            vm.checkLoading = true;
            const keyList = Object.keys(tabJson[0].sheet[0]);
            //check key
            for (var i = 0; i < this.containersHeaders.length; i++) {
              if (!keyList.includes(this.containersHeaders[i])) {
                errorList.push(this.containersHeaders[i])
                break
              }
            }
            if (errorList.length > 0) {
              vm.$notify({
                title: 'Warning',
                message: errorList + " does not exist, Please use the import template to import",
                type: 'warning'
              });
              vm.checkLoading = false;
              this.$refs.upload.clearFiles();
              return
            }
            //get data
            tabJson[0].sheet.forEach((item, index, key) => {
              listTable.push(item);
            }
            )

            var containerTypes = this.containerTypeList.map((obj) => obj.type)
            console.log(this.containerTypeList)
            console.log(containerTypes)

            //check key
            listTable.forEach((item, index) => {
              if (!containerTypes.includes(item["Container Type"])) {
                errorList.push(item["Container Type"])
              }
            })
            if (errorList.length > 0) {
              vm.$notify({
                title: 'Warning',
                message: 'Container Type ' + errorList + ' does not exist',
                type: 'warning'
              })
              vm.checkLoading = false
              this.$refs.upload.clearFiles();
              return
            }

            //copy value
            const groupedData = {};
            listTable.forEach((item, index) => {
              const groupKey = `${item["Container Type"]}-${item["Container No"]}`;
              if (!groupedData[groupKey]) {
                var soc = item['SOC(TRUE/FALSE)']
                if (soc != null) {
                  if (soc.toLowerCase == 'true' || soc == '1' || soc.toLowerCase == 'yes') {
                    soc = true
                  } else {
                    soc = false
                  }
                }
                let subContainerType = null
                if (String(item["Sub Container"]|| "").toUpperCase().trim() === 'YES') {
                  subContainerType = 'YES'
                }
                groupedData[groupKey] = {
                  "containerType": String(item["Container Type"]|| "").trim(),
                  "containerNo": String(item["Container No"]|| "").trim(),
                  "subContainerType": subContainerType,
                  "containerSealNumber": String(item["Container Seal Number"]|| ""),
                  "remark": String(item["Marks&Numbers"]|| ""),
                  "tareWeight": item["Tare Weight"],
                  "soc": soc,
                  "productData": []
                };
              }
              const productDataItem = {};
              // Copy the necessary properties to productDataItem
              productDataItem["productEnglishName"] = String(item["Product Name"]|| "");
              productDataItem["hscode"] = String(item["HS code"]|| "");
              productDataItem["numberOfPackages"] = item["Number Of Packages"];
              productDataItem["packages"] = String(item["Packages"]|| "");
              var units=this.getDictDatas(this.DICT_TYPE.SYSTEM_UNITS);
              var excelUnit= String(item['Packages'])
              var unitsFlag = false
              if (excelUnit !=null) {
                  for (var unit of units) {
                      if (unit.label==excelUnit.toUpperCase() || unit.value==excelUnit.toUpperCase()) {
                          productDataItem["packages"]=unit.value;
                          unitsFlag = true
                      }
                  }
              }
              if (!unitsFlag) {
                productDataItem["packages"] = null
              }

              productDataItem["grossWeight"] = item["Gross Weight(KG)"];
              productDataItem["volume"] = item["Volume(CBM)"];
              //数组默认是0,表头行也不算,所以 +2
              groupedData[groupKey]["index"] = index + 2;

              groupedData[groupKey]["productData"].push(productDataItem);
            });
            console.log(groupedData)

            const groupedArray = Object.values(groupedData);
            if (vm.shipment.carrier == 'TSHG') {
              //Check hsCode
              vm.checkTSHGData(groupedArray)
            } else {
              vm.pushData(groupedArray);
            }
           this.$refs.upload.clearFiles();

          }
        })
      },
      checkTSHGData(groupedArray) {
        var vm = this

          // check  hsCode
          const queryList = []
          for (var i = 0; i < groupedArray.length; i++) {
            const productData = groupedArray[i]['productData']
            for (var j = 0; j < productData.length; j++) {
              queryList.push(productData[j].hscode)
            }
          }

          getDataByHsCodes(queryList).then((response2) => {
            var hsCodeErrorList = []
            if (response2.data.length > 0) {
              //筛选出不存在数据库中的数据
              hsCodeErrorList = queryList.filter(itemA =>
                !response2.data.some(itemB =>
                  itemA == itemB.hsCode
                )
              );
            } else {
              hsCodeErrorList = queryList
            }
            if (hsCodeErrorList.length > 0) {
              vm.hsCodeData = hsCodeErrorList
              vm.checkHsCodeDialog = true;
              vm.checkLoading = false;
              return
            }
            vm.pushData(groupedArray);
          });

      },
    checkTSHGHscode(products) {
      var vm = this

      // check  hsCode
      const queryList = []
      for (var i = 0; i < products.length; i++) {
          queryList.push(products[i].hscode)
      }

      getDataByHsCodes(queryList).then((response2) => {
        var hsCodeErrorList = []
        if (response2.data.length > 0) {
          //筛选出不存在数据库中的数据
          hsCodeErrorList = queryList.filter(itemA =>
            !response2.data.some(itemB =>
              itemA == itemB.hsCode
            )
          );
        } else {
          hsCodeErrorList = queryList
        }
        if (hsCodeErrorList.length > 0) {
          vm.hsCodeData = hsCodeErrorList
          vm.checkHsCodeDialog = true;
          vm.checkLoading = false;
          return false
        }
        return true
      });

    },
      pushData(groupedArray) {
        var vm = this
        //push data
        for (var i = 0; i < vm.siForm.containers.length; i++) {
          for (var j = 0; j < groupedArray.length; j++) {

            if (vm.siForm.containers[i].containerType == groupedArray[j].containerType &&
              (!vm.siForm.containers[i].containerNo || vm.siForm.containers[i].containerNo != groupedArray[j].containerNo)) {
              vm.$set(vm.siForm.containers[i], 'containerNo', groupedArray[j].containerNo)
              vm.$set(vm.siForm.containers[i], 'subContainerType', groupedArray[j].subContainerType)
              vm.$set(vm.siForm.containers[i], 'containerSealNumber', groupedArray[j].containerSealNumber)
              vm.$set(vm.siForm.containers[i], 'remark', groupedArray[j].remark)
              vm.$set(vm.siForm.containers[i], 'soc', groupedArray[j].soc)
              vm.$set(vm.siForm.containers[i], 'tareWeight', groupedArray[j].tareWeight)
              vm.siForm.containers[i].productData = []

              vm.$set(vm.siForm.containers[i], 'productData', groupedArray[j].productData)

              groupedArray.splice(j, 1);
              break
            }
          }
        }
        console.log(vm.siForm.containers)
        vm.checkLoading = false;
      },
      file2Xce(file) {
        return new Promise(function (resolve, reject) {
          const reader = new FileReader()
          reader.onload = function (e) {
            const data = e.target.result
            this.wb = XLSX.read(data, {
              type: 'binary'
            })
            const result = []
            this.wb.SheetNames.forEach((sheetName) => {
              result.push({
                sheetName: sheetName,
                sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])
              })
            })
            resolve(result)
          }
          reader.readAsBinaryString(file.raw)
        })
      },
      //去除中文
      filterChinese(name) {
        return name.replace(/[\u4e00-\u9fa5]/g, '');
      },
      getDaysBetweenTimestamps(timestamp1, timestamp2) {
        const oneDayMilliseconds = 1000 * 60 * 60 * 24; // 一天的毫秒数

        // 计算两个时间戳之间的毫秒数差值（取绝对值，确保结果为正数）
        const millisecondsDiff = Math.abs(timestamp1 - timestamp2);

        // 将毫秒数差值转换为天数
        const daysDiff = Math.floor(millisecondsDiff / oneDayMilliseconds);

        return daysDiff;
      },
      changeBl() {
        var data = "" + (this.siForm.blType ? this.siForm.blType : "")
        if (this.shipment.carrier == 'TSHG') {
          data = data + "\n" + (this.siForm.blSamples ? this.siForm.blSamples : "")
        }
        this.$set(this.siForm, 'siRemark', data)
      },
      handleContainerChange(item) {
        this.changeContainer = item
      },
      subContainerTypeChange(index, subContainerType) {
        if (this.siForm.containers[index] && this.siForm.containers[index].containerType !== subContainerType) {
          this.siForm.containers[index].containerNo = null
        }
      },
      remoteContainerNo(query) {
        if (query && query.length > 8
          && this.changeContainer &&
          (this.changeContainer.containerType || this.changeContainer.subContainerType)
        ) {
          this.loadingSelect = true;
          //如果 subContainerType 有值那就用 subContainerType
          getContainerNoByNoAndType(query, (this.changeContainer.subContainerType ? this.changeContainer.subContainerType : this.changeContainer.containerType)).then((response) => {
            this.containerOptions = response.data
            this.loadingSelect = false;
          })

        } else {
          this.containerOptions = [];
        }
      },
      viewBlSample(key) {
        this.dialogBLType = true;
        if (key == "CARGO Details") {
          this.sampleUrl = "/static/CARGO Details.pdf"
        } else if (key == "CARGO Summary I") {
          this.sampleUrl = "/static/CARGO Summary I.pdf"
        } else if (key == "CARGO Summary II") {
          this.sampleUrl = "/static/CARGO Summary II.pdf"
        } else if (key == "CARGO Summary") {
          this.sampleUrl = "/static/CARGO Summary.pdf"
        }
      },
      closepdf() {
        this.isshowpdf = false
      },
      pdferr(errurl) {
      },
      openpdf() {
        this.isshowpdf = true
      },
      disabledDate(date) {
        // 在这个示例中，我们将禁用周六和周日的日期
        const day = date.getDay();
        return day === 0 || day === 6;
      },
      edit(key) {
        if (key == "0") {
          this.openCancel()
        } else if (key == "2") {
          //submit booking
          this.submitBooking();
        } else if (key == "3") {
          this.receiptAndConfirmationForm(key, false)
        } else if (key == "4") {
          this.receiptAndConfirmationForm(key, true)
        } else if (key == "7") {

          const tenantID = localStorage.getItem('TENANT_ID')
            console.log('get local tenantID', tenantID)
            console.log(tenantID)
            if (tenantID) {
               // 获取字典里pepco的id
               const pepcoIdsString = this.getDictDatas(this.DICT_TYPE.PEPCO).find(item => item.label === 'tenantId_4pl')?.value || ''
               const pepcoIdsArray = pepcoIdsString.split(',').map(id => id.trim())
               console.log('pepcoIdsString', pepcoIdsString)
               console.log('pepcoIdsArray', pepcoIdsArray)
               // 检查tenantID是否在pepcoIdsArray中
               const isMatched = pepcoIdsArray.includes(tenantID)
               console.log('isMatched', isMatched)
                    // pepco 租户id
         if(isMatched){
          // 判断当前po的状态是否一致，如果不一致，弹出表单
          getPoTaskStatusByShipmentId(this.shipment.id ).then((response) => {
            console.log('getPoTaskStatusByShipmentId response', response)
            this.orderList = response.data
            const filteredData = (response.data || []).filter(item => item && item.status !== '1')
            // 优先获取status不等于"1"的数据，如果没有则取第一条
            this.orderInfo = filteredData[0] || (response.data || [])[0]
            // 判断seq 当前的任务是大于 SI/VGM Submit to Carrier 的seq 就直接通过
            // 将response 中的第一条拿出来判断
            // 1.判断当前的任务是否是 SI/VGM Submit to Carrier
            getOrderStatus({"orderNumber":  this.orderInfo.orderNumber,"taskStatus":'SI/VGM Submit to Carrier'}).then((res=>{
              if(res.data){
                if (this.shipment.carrier == 'TSHG') {
                  this.openSI();
                } else {
               this.$router.push("/shipment/shipping-instructions?id=" + this.shipment.id);
                 }
              }else{
                const loadingPlans = this.orderList.filter(item => item.taskStatus === 'SI/VGM Submit to Carrier');
            if(this.orderList.length!=0 && loadingPlans.length== this.orderList.length) {
              // 正常
              if (this.shipment.carrier == 'TSHG') {
                  this.openSI();
                } else {
               this.$router.push("/shipment/shipping-instructions?id=" + this.shipment.id);
                 }
            }else{
              this.$refs.checkOrderStatusDialog.openDialog(this.orderList,'SI/VGM Submit to Carrier')
            }
              }
            }))

          })
         }else{
          if (this.shipment.carrier == 'TSHG') {
                  this.openSI();
                } else {
               this.$router.push("/shipment/shipping-instructions?id=" + this.shipment.id);
              }
         }
            }
        }else if (key == "18") {
          this.eventsForm(key)
        }else if (key == "19") {
          this.eventsForm(key)
        }else if (key == "20") {
          this.eventsForm(key)
        }else if (key == "21") {
          this.eventsForm(key)
        }else if (key == "22") {
          this.eventsForm(key)
        }
      },
      eventsForm(key) {
        var obj = this.shipmentMilestones.find((element) => element.key == key)
        if (obj && obj.endDate) {
          this.$set(this.form, 'dateValue', this.parseUTCTime(obj.endDate) + " 00:00:00")
        }
        this.statusKeys = key;
        this.dialogFormEvents = true;
      },
      receiptAndConfirmationForm(key, flag) {

        var obj = this.shipmentMilestones.find((element) => element.key == key)
        if (obj && obj.endDate) {
          this.$set(this.form, 'dateValue', this.parseUTCTime(obj.endDate) + " 00:00:00")
        }

        this.acceptRequired = flag;
        this.statusKeys = key;
        this.dialogFormAccept = true;
      },
    hasVGMFinishedMilestone() {
      return this.shipmentMilestones.some(milestone =>
        milestone.label === 'Shipping Instructions(VGM)' && milestone.status === 'finish'
      );
    },
    // 先确认框确认后更新按钮的方法
    handleUpdateShipment(shipment) {
      if (this.hasVGMFinishedMilestone()) {
        this.$confirm(
          '<span style="color: red; font-weight: bold;">Carrier SI already done! Pls must inform and double check with OP who has finished SI !</span>',
          'Warning',
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          this.updateShipment(shipment);
        }).catch(() => {
          // 用户取消操作
        });
      } else {
        this.updateShipment(shipment);
      }
    },
      updateShipment(item) {
        if (item.carrier == 'TSHG') {
          this.$router.push("/shipment/update?id=" + item.id);
        } else {
          this.$router.push("/shipment/update-shipment?id=" + item.id);
        }
      },
      copyShipment(item) {
        this.$router.push("/shipment/copy?id=" + item.id);
      },
      submitTmff(){
        this.formTmffLoading = true
        this.loadingSaveBut = true
        this.$refs["tmffForm"].validate(async (valid) => {
          if (valid) {
            if(this.tmffForm.mblNo.trim() === '' || !this.tmffForm.mblNo.includes('M')){
              this.$notify({
                type: "warning",
                message: "TMFF MBLNo does not exist",
              });
              this.formTmffLoading = false
              this.loadingSaveBut = false
              return;
            }
            var isPoNa = false
            var headNumbers = [];
            for (let i = 0; i < this.tmffForm.product.length; i++) {
              var lineNumbers = []
              if(!this.tmffForm.product[i].hblNo){
                this.$notify({
                  type: "warning",
                  message: "TMFF HBLNo does not exist",
                });
                this.formTmffLoading = false
                this.loadingSaveBut = false
                return;
              }
              //验证Balance三个值都要为0，否则不通过
              // if(Number(this.tmffAllNotTotalPackages) !== 0 || Number(this.tmffAllNotTotalWeight) !== 0 || Number(this.tmffAllNotTotalCbm) !== 0 ){
              //   this.$notify({
              //     type: "warning",
              //     message: "pls check Balance data",
              //   });
              //   this.formTmffLoading = false
              //   this.loadingSaveBut = false
              //   return ;
              // }
              // for (var j = 0; j < this.tmffForm.product[i].subItemData.length; j++) {
              //   var orderNumber = this.tmffForm.product[i].subItemData[j].orderNumber;
              //   if(headNumbers.includes(orderNumber)){
              //     isPoNa = true;
              //     break;
              //   }
              //   lineNumbers.push(orderNumber);
              // }
              // for (var j = 0; j < lineNumbers.length; j++) {
              //   headNumbers.push(lineNumbers[j])
              // }
            }

            for  (let i = 0; i < this.tmffForm.product.length; i++) {
              this.tmffForm.product[i].soNumber = this.tmffForm.product[i].subItemData[0].soNumber
              this.tmffForm.product[i].shipperOrderId = this.tmffForm.product[i].subItemData[0].shipperOrderId
            }
            //校验是否有重复的soNumber
            let soNumbers = [];
            this.tmffForm.product.forEach(item => {
              soNumbers.push(item.soNumber)
            })
            const duplicates = [...new Set(soNumbers.filter((item, index) => soNumbers.indexOf(item) !== index))];
            if(duplicates.length > 0){
              this.$notify({
                type: "warning",
                message: "There is duplicate shipping order：" + duplicates + ", pls check",
              });
              this.formTmffLoading = false
              this.loadingSaveBut = false
              return;
            }

            // 按HBL分组商品
            const productsByHbl = {};
            this.tmffForm.product.forEach(product => {
              if (!productsByHbl[product.hblNo]) {
                productsByHbl[product.hblNo] = [];
              }
              productsByHbl[product.hblNo].push(product);
            });

            // 获取发货单数据以匹配SupplierId
            const shippingOrdersData = this.spoList;
            if(shippingOrdersData && shippingOrdersData.length > 0){
              // 构建SO单号到SupplierId的映射
              const shippingOrdersMap = {};
              shippingOrdersData.forEach(order => {
                shippingOrdersMap[order.soRef] = order.supplierId;
              });

              // 检查每个HBL分组下的SupplierId是否全部一致
              for (const hblNo in productsByHbl) {
                const hblItem = productsByHbl[hblNo];

                // 遍历当前HBL下的所有商品及子项，收集SupplierId
                for (const product of hblItem) {
                  // 用Set存储当前HBL下所有唯一的SupplierId（自动去重）
                  const supplierIds = new Set();
                  product.subItemData.forEach(item => {
                    const supplierId = shippingOrdersMap[item.soNumber];
                    // 排除null/undefined（可选，根据业务是否允许空值）
                    if (supplierId !== null && supplierId !== undefined) {
                      supplierIds.add(supplierId);
                    }
                  });
                  // 若唯一SupplierId数量>1，说明存在不同供应商
                  if (supplierIds.size > 1) {
                    this.$notify({
                      type: "warning",
                      // 英文提示
                      message: `Same HBL(${hblNo}) contain different suppliers, pls check.`,
                    });
                    this.formTmffLoading = false;
                    this.loadingSaveBut = false;
                    throw new Error(`Same HBL(${hblNo}) contain different suppliers, pls check.`);
                  }
                }

              }
            }

            const data = {
              isPoNa: false, //先默认不重复
              shipmentId: this.$route.query.id,
              mblNo: this.tmffForm.mblNo,
              product : JSON.stringify(this.tmffForm.product),
              bookQty: this.tmffAllTotalPackages,
              weight: this.tmffAllTotalWeight,
              volume: this.tmffAllTotalCbm
            }
            // console.log('所有的数据')
            // console.log(data)
            // const verifyData = {
            //   shipmentId: this.$route.query.id,
            //   product : this.tmffForm.product,
            // }

            this.$confirm('Confirm to Submit?', 'Tips', {
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
              type: 'warning'
            }).then(() =>{
              this.$notify({
                message: 'Processing,Please wait patiently and do not refresh the current page',
                type: 'warning'
              });
              //先进行验证日志表里是否有历史日志记录
              createTmffHBL(data).then((res)=>{
                this.$notify({
                  type: "success",
                  message: "Success!",
                });
                if(res.data){
                  // 拼接提示语
                  let data = res.data.hblList;
                  let text = `${this.$constants.MBL_NUMBER}: ${res.data.mblShpNo}`;
                  for (const t of data) {
                    text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;HBL No: ' + t;
                  }
                  if(data.length>0){
                    this.$alert(text, "Success", { dangerouslyUseHTMLString: true });
                  }
                }
                //重新赋新值
                this.tmffForm.mblNo = res.data.mblShpNo;
                const hblData = res.data.hblData;
                if(hblData){
                  for (const key in hblData) {
                    if (hblData.hasOwnProperty(key)) {
                      this.tmffForm.product.forEach( (item, index) => {
                        if(item.soNumber == key){
                          item.hblNo = hblData[key]
                        }
                      })
                    }
                  }
                }
                this.formTmffLoading = false
                this.loadingSaveBut = false
                this.tmffButShow = false;
              }).catch((error) => {
                this.formTmffLoading = false;
                this.loadingSaveBut = false
                console.error('tmff确认error: ' + error)
                this.tmffButShow = false;
                if(error == '1003000027'){//bl号码不对
                  this.tmffButShow = true;
                }
              });
            },()=>{
                //确认弹窗点了No
                this.formTmffLoading = false
                this.loadingSaveBut = false
              })
          } else {
            //数据验证失败
            this.formTmffLoading = false
            this.loadingSaveBut = false
            return false;
          }
        });
      },
      tmffHBL(sid) {
        if(sid){
          //先判断有没有点过tmff按钮：去 tmff_hbl表 查这个shipment_id，有数据就是做过了，显示visableTmff2这个弹窗。
          findTmffHBL2(sid).then((res)=>{
            if(res.data.hasHblData){
              this.visableTmff2 = true;
              this.tmffForm2 = { product: [], mblNo: '' }
              this.tmffForm2 = res.data;
              for(let i = 0; i < this.tmffForm2.product.length; i++){
                this.sumTmffRowTotal2(i)
              }
            }else{
              this.visableTmff = true;
              this.formTmffLoading = true;
              this.tmffForm = { product: [], mblNo: '' }
              findTmffHBL(sid).then((res)=>{
                this.tmffButShow = true
                this.formTmffLoading = false;

                if(res.data != null && res.data.mblNo){
                  this.tmffButShow = false
                  this.$set(this.tmffForm, "mblNo", res.data.mblNo)
                  this.$set(this.tmffForm, "product", [])
                  //改成循环 赋值
                  for(var i =0 ; i < res.data.product.length; i++){
                    this.tmffForm.product.push(res.data.product[i])
                  }
                }else if(this.tmffForm.product == null || this.tmffForm.product.length == 0){
                  // this.addHBLRow()
                  this.shipment.shippingOrderProductResList.forEach(ele => {
                    this.tmffForm.product.push({
                        subItemData:[{orderId:null,orderNumber:null,shipmentId:ele.shipmentId,
                          bookedUnit:null,bookQty:ele.totalQty,weight:ele.totalWeight,volume:ele.totalCbm,
                          soNumber:ele.soNumber,shipperOrderId:ele.shipperOrderId, _oldSo:ele.soNumber}],
                        hblNo: null,
                        // tmffTotalPackages: 0,
                        // tmffTotalWeight: 0,
                        // tmffTotalCbm: 0,
                        soNumber:ele.soNumber, //取subItemData第一个的soNumber
                        shipperOrderId:ele.shipperOrderId
                    })
                    //初始化
                    this.selectedSoNumbers.push(ele.soNumber)
                  })
                }
              })
            }
          })
        }
    },
    // 过滤下拉选项：只显示未被选中的，或当前行自己已选中的
    getFilteredOptions(currentRow) {
      // 若源数据不存在，返回空数组
      if (!this.shipment?.shippingOrderProductResList) return [];
      return this.shipment.shippingOrderProductResList.filter(opt => {
        // 排除已选中且非当前行的值
        return !this.selectedSoNumbers.includes(opt.soNumber)
          || opt.soNumber === currentRow.soNumber;
      });
    },
    calculate(){
      this.tmffAllTotalPackages = 0
      this.tmffAllTotalWeight = 0
      this.tmffAllTotalCbm = 0
      var siContainers = this.shipment.containerDOList.filter(
        (item) => item.type == 1
      );
      if(this.shipment.carrier == 'TSHG'){
        var data = this.shipment.productDOList.filter((item) => item.type == 1);
        var totalPackages = 0;
        var totalWeight = 0;
        var totalVolume = 0;
        for (var i = 0; i < data.length; i++) {
          totalPackages += data[i].numberOfPackages;
          totalWeight += data[i].grossWeight;
          totalVolume += data[i].volume;
        }
        this.tmffAllTotalPackages = totalPackages
        this.tmffAllTotalWeight = totalWeight
        this.tmffAllTotalCbm = totalVolume
      }else{
        for( var i=0; i < siContainers.length; i++){
          var item = siContainers[i]
          this.tmffAllTotalPackages +=  Number(item.numbersOfPackage);
          this.tmffAllTotalWeight +=  Number(item.grossWeight);
          this.tmffAllTotalCbm +=  Number(item.volume);
        }
        if(this.tmffAllTotalWeight && this.tmffAllTotalWeight != 0){
          this.tmffAllTotalWeight = Number(this.tmffAllTotalWeight).toFixed(3)
        }
        if(this.tmffAllTotalCbm && this.tmffAllTotalCbm != 0){
          this.tmffAllTotalCbm = Number(this.tmffAllTotalCbm).toFixed(3)
        }
      }
    },
      getShipLogList() {
        this.shipLogList = [];
        var that = this;
        getShipLogList({ ids: this.$route.query.id }).then((res) => {
          res.data.forEach((item) => {
            var email = item.email;
            if (item.type == 1) {
              email = "Freightower";
            }
            item.timeAndEmail = that.formatUserLocalTime(item.time, item.timeZone, item.timeZoneOffset) + " • " + email;
            this.shipLogList.push(item);
          }
          )
        });
      },
      openAccept() {
        const isBookingDialog = this.statusKeys === '4' || this.statusKeys === '3';
        if (isBookingDialog) {
          this.loadingAcceptConfirm = true;
        } else {
          this.loadingEventsConfirm = true;
        }

        if ((!this.form.bookingNum || !this.form.dateValue) && this.statusKeys === '') {
          this.$notify.error("Please fill in the required fields");
          this.loadingAcceptConfirm = false;
          this.loadingEventsConfirm = false;
          return;
        }

        if (this.statusKeys === '4') {
          this.$refs["form"].validate((valid) => {
            if (valid && this.form.bookingNum && this.form.dateValue) {
              checkCarrierAndBookingNumSame(this.shipment.id, this.shipment.carrier, this.form.bookingNum.trim())
                .then(res => {
                  if (res.data) {
                    const bn = `<a target="_blank" class="el-link el-link--primary is-underline" href="/shipment/list?uuid=${res.data}">${res.data}</a>`;
                    this.$confirm('Same booking number already existing in shipment ' + bn + ',pls double check',
                      '',
                      {
                        dangerouslyUseHTMLString: true,
                        showConfirmButton: false,
                        type: 'warning'
                      }).catch(() => {});

                    this.loadingAcceptConfirm = false;
                    return;
                  }

                  updateStatus({
                    id: this.$route.query.id,
                    bookingNumber: this.form.bookingNum.trim(),
                    key: this.statusKeys,
                    dateTime: this.form.dateValue,
                  }).then(() => {
                    this.$notify({
                      type: "success",
                      message: "Success!",
                    });
                    this.dialogFormEvents = false;
                    this.dialogFormAccept = false;
                    this.$set(this.form, "bookingNumber", "")
                    this.$set(this.form, "dateValue", "")
                    this.statusKeys = "";
                    this.getShipmentStatus();
                    this.init();
                    localStorage.setItem('refreshPoPage', JSON.stringify({ key: 'value' }))
                  }).finally(() => {
                    this.loadingAcceptConfirm = false;
                  });
                }).catch(() => {
                  this.loadingAcceptConfirm = false;
                });
            } else {
              this.$set(this.form, 'tempaax', 1)
              this.$delete(this.form, 'tempaax');
              this.loadingAcceptConfirm = false;
              return false;
            }
          });
        } else {
          // 如果已经 confirmation，也要检查
          if (this.statusKeys === '3') {
            checkCarrierAndBookingNumSame(this.shipment.id, this.shipment.carrier, this.form.bookingNum.trim())
              .then(res => {
                if (res.data) {
                  const bn = `<a target="_blank" class="el-link el-link--primary is-underline" href="/shipment/list?uuid=${res.data}">${res.data}</a>`;
                  this.$confirm('Same booking number already existing in shipment ' + bn + ',pls double check',
                    '',
                    {
                      dangerouslyUseHTMLString: true,
                      showConfirmButton: false,
                      type: 'warning'
                    }).catch(() => {});
                  this.loadingAcceptConfirm = false
                  return;
                }
                updateStatus({
                  id: this.$route.query.id,
                  bookingNumber: this.form.bookingNum.trim(),
                  key: this.statusKeys,
                  dateTime: this.form.dateValue,
                }).then(() => {
                  this.$notify({
                    type: "success",
                    message: "Success!",
                  });
                  this.dialogFormEvents = false;
                  this.dialogFormAccept = false;
                  this.$set(this.form, "bookingNumber", "")
                  this.$set(this.form, "dateValue", "")
                  this.statusKeys = "";
                  this.getShipmentStatus();
                  this.init();
                }).finally(() => {
                  this.loadingAcceptConfirm  = false;
                });
              }).catch(() => {
                this.loadingAcceptConfirm = false;
              });
          } else {
            updateStatus({
              id: this.$route.query.id,
              bookingNumber: this.form.bookingNum.trim(),
              key: this.statusKeys,
              dateTime: this.form.dateValue,
            }).then(() => {
              this.$notify({
                type: "success",
                message: "Success!",
              });
              this.dialogFormEvents = false;
              this.dialogFormAccept = false;
              this.$set(this.form, "bookingNumber", "")
              this.$set(this.form, "dateValue", "")
              this.statusKeys = "";
              this.getShipmentStatus();
              this.init();
            }).finally(() => {
              this.loadingEventsConfirm = false;
            }).catch(() => {
              this.loadingEventsConfirm = false;
            });
          }
        }
      },

      getParty() {
          this.getParties({ partyRole: "Shipper"});
          this.getParties({ partyRole: "Consignee"});
          this.getParties({ partyRole: "Notify Party"});
          this.getParties({ partyRole: "Agreement Party"});
          this.getParties({ partyRole: "Customer"});
          listDept({ partyRole: "Destination Agent"}).then((response) => {
            for (var i = 0; i < response.data.length; i++) {
              this.$set(this.agentMap, response.data[i].id, response.data[i]);
            }
            this.agentData = response.data
          });
      },
      getParties(obj) {
        var vm = this;
        listDept(obj).then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            vm.$set(vm.partiesMap, response.data[i].id, response.data[i]);
          }
          vm.$set(vm.parties, obj.partyRole, response.data == null ? [] : response.data);
        });
      },
      submitBooking() {
        var msg = 'Submit?'
        if(this.shipment.carrier  == 'TSHG'){
          msg = 'Any booking information adjustment,kindly inform Tailwind customer service team!'
        }

        this.$confirm(msg, "", {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          type: "warning",
        })
          .then(() => {
            submitBooking({ shipmentId: this.shipment.id }).then((response) => {
              this.getShipmentStatus();
              this.init();
              this.$notify({
                type: "success",
                message: "Success!",
              });
            });
          })
          .catch(() => { });
      },
      setStatus(item) {
        this.visableStatus = true
        this.$set(this.statusForm, 'date', item.endDate)
        this.$set(this.statusForm, 'title', item.label)
        this.$set(this.statusForm, 'status', item.key)
        this.$set(this.statusForm, 'shipmentId', this.shipment.id)
        this.vmtRevokeSwitch = false
        var containerTitle = ''
        var dateKey = ''
        if (item.key == '11') {
          containerTitle = 'Departure POD'
          dateKey = 'departurePod'
        } else if (item.key == '12') {
          containerTitle = 'Arrival inland terminal'
          dateKey = 'arrivalInlandTerminal'
        } else if (item.key == '13') {
          containerTitle = 'Empty container return'
          dateKey = 'emptyContainerReturn'
        } else if (item.key == '6') {
          containerTitle = 'Container Gate In'
          dateKey = 'containerGateIn'
        } else if (this.vmtRevoke && (item.key == '8' || item.key == '10')) {
          this.$set(this.statusForm, 'revoke', 0)
          this.vmtRevokeSwitch = true
        }
        var containers = []
        if (containerTitle != '') {
          for (var key in this.shippedContainer) {
            var date = this.parseTime(this.shippedContainer[key][dateKey])
            containers.push({ containerNo: this.shippedContainer[key].containerNo, date: date, poNumber: this.shippedContainer[key].poNumber })
          }
        }

        this.$set(this.statusForm, 'containerTitle', containerTitle)
        this.$set(this.statusForm, 'containers', containers)
      },
      submitStatus() {

        var data = JSON.parse(JSON.stringify(this.statusForm))
        data.containers = JSON.stringify(data.containers)
        addOrUpdate(data).then((response) => {
          this.visableStatus = false
          this.$notify({
            type: "success",
            message: "Success!",
          });
          this.getShipmentStatus()
          this.init()
        })
      },
      getShipmentStatus() {
        this.shipmentMilestones = [];
        var status = this.getDictDatas(this.DICT_TYPE.SHIPMENT_STATUS);
        //shipmentMilestones
        for (var i = 0; i < status.length; i++) {
          if (Number(status[i].value) > 1) {
            this.shipmentMilestones.push({
              key: status[i].value + "",
              label: status[i].label,
              createDate: null,
              endDate: null,
              timeZone: null,
              timeZoneOffset: null,
            });
          }
        }
        shipmentStatus({ id: this.$route.query.id }).then((res) => {
          if(res.data && res.data.length > 0){
            //提取submit,update log
            this.draftDateList = res.data.filter((element) => element.endDate != null && (element.status == 1))
            this.draftDateList.sort(function (a, b) {
              var dateA = new Number(a.createDate);
              var dateB = new Number(b.createDate);
              return dateA - dateB;
            });
            if (this.draftDateList.length > 0) {
              this.draftDateList[0].event = '1'
            }

            this.submitDateList =  res.data.filter((element) =>  element.endDate != null && (element.status == 2 || element.status == -1))
            this.submitDateList.sort(function (a, b) {
              var dateA = new Number(a.createDate);
              var dateB = new Number(b.createDate);
              return dateA - dateB;
            });
            var submitTime = ''
            if (this.submitDateList.length > 0) {
              this.submitDateList[0].event = '1'
              submitTime = this.submitDateList[0].endDate
            }
            for(var submitDate of this.submitDateList) {
              submitDate.endDate = submitTime
            }

            this.bookingReceiptDateList = res.data.filter((element) => element.endDate != null && (element.status == 3))
            this.bookingReceiptDateList.sort(function (a, b) {
              var dateA = new Number(a.createDate);
              var dateB = new Number(b.createDate);
              return dateA - dateB;
            });
            if (this.bookingReceiptDateList.length > 0) {
              this.bookingReceiptDateList[0].event = '1'
            }
            this.bookingConfirmationDateList = res.data.filter((element) => element.endDate != null && (element.status == 4))
            this.bookingConfirmationDateList.sort(function (a, b) {
              var dateA = new Number(a.createDate);
              var dateB = new Number(b.createDate);
              return dateA - dateB;
            });
            if (this.bookingConfirmationDateList.length > 0) {
              this.bookingConfirmationDateList[0].event = '1'
            }
            this.siDateList = res.data.filter((element) => element.endDate != null && (element.status == 7))
            this.siDateList.sort(function (a, b) {
              var dateA = new Number(a.createDate);
              var dateB = new Number(b.createDate);
              return dateA - dateB;
            });
            if (this.siDateList.length > 0) {
              this.siDateList[0].event = '1'
            }
            this.atdDateList = res.data.filter((element) => element.endDate != null && (element.status == 18))
            this.atdDateList.sort(function (a, b) {
              var dateA = new Number(a.createDate);
              var dateB = new Number(b.createDate);
              return dateA - dateB;
            });
            if (this.atdDateList.length > 0) {
              this.atdDateList[0].event = '1'
            }
            this.ataDateList = res.data.filter((element) => element.endDate != null && (element.status == 19))
            this.ataDateList.sort(function (a, b) {
              var dateA = new Number(a.createDate);
              var dateB = new Number(b.createDate);
              return dateA - dateB;
            });
            if (this.ataDateList.length > 0) {
              this.ataDateList[0].event = '1'
            }
            this.customClearanceDateList = res.data.filter((element) => element.endDate != null && (element.status == 20))
            this.customClearanceDateList.sort(function (a, b) {
              var dateA = new Number(a.createDate);
              var dateB = new Number(b.createDate);
              return dateA - dateB;
            });
            if (this.customClearanceDateList.length > 0) {
              this.customClearanceDateList[0].event = '1'
            }
            this.deliveryDateList = res.data.filter((element) => element.endDate != null && (element.status == 21))
            this.deliveryDateList.sort(function (a, b) {
              var dateA = new Number(a.createDate);
              var dateB = new Number(b.createDate);
              return dateA - dateB;
            });
            if (this.deliveryDateList.length > 0) {
              this.deliveryDateList[0].event = '1'
            }
            this.emptyReturnDateList = res.data.filter((element) => element.endDate != null && (element.status == 22))
            this.emptyReturnDateList.sort(function (a, b) {
              var dateA = new Number(a.createDate);
              var dateB = new Number(b.createDate);
              return dateA - dateB;
            });
            if (this.emptyReturnDateList.length > 0) {
              this.emptyReturnDateList[0].event = '1'
            }

          }
          for (var i = 0; i < res.data.length; i++) {
            if (status.find((element) => element.value == res.data[i].status) == null) {

              var milestoneItem = this.allMilestones.find((element) => element.key == res.data[i].status)
              this.$set(milestoneItem, 'endDate', res.data[i].endDate)
            } else {
              if (Number(res.data[i].status) < 0) {
                continue;
              }
              var obj = this.shipmentMilestones.find(
                (element) => element.key == res.data[i].status
              );
              if (obj == null) {
                this.shipmentMilestones.push({
                  key: res.data[i].status + "",
                  label: status.find((element) => element.value == res.data[i].status).label,
                  createDate: res.data[i].createDate,
                  endDate: res.data[i].endDate,
                  timeZone: res.data[i].timeZone,
                  timeZoneOffset: res.data[i].timeZoneOffset,
                });
              } else {
                obj.createDate = res.data[i].createDate;
                obj.endDate = res.data[i].endDate;
              }
            }

          }
          this.shipmentMilestones.sort(function (a, b) {
            var dateA = new Number(a.key);
            var dateB = new Number(b.key);
            return dateA - dateB;
          });
          for (var i = 0; i < this.shipmentMilestones.length; i++) {
            var miestone = this.shipmentMilestones[i];
            if (miestone.createDate != null && miestone.endDate != null) {
              miestone.status = "finish";
            } else if (miestone.createDate != null && miestone.endDate == null) {
              miestone.status = "process";
            } else {
              miestone.status = "wait";
            }
          }
          var json1 = this.shipmentMilestones;
          var json2 = this.allMilestones;
          for (let i = 0; i < json2.length; i++) {
            if (json2[i].sync) {
              let keyFound = false;
              for (let j = 0; j < json1.length; j++) {
                if (json1[j].key === json2[i].key) {
                  json2[i].endDate = json1[j].endDate;
                  keyFound = true;
                  break;
                }
              }
              if (!keyFound) {
                json2[i].hide = true;
              } else {
                json2[i].hide = false;
              }
            } else {
              json2[i].hide = false;
            }
          }

          if (this.shipmentMilestones.length > 0) {
            var obj = this.shipmentMilestones[0]
            if (this.shipmentMilestones[0].key == "0") {
              this.shipmentMilestones.splice(0, 1)
              var index = -1;
              for (var j = 0; j < this.shipmentMilestones.length; j++) {
                if (this.shipmentMilestones[j].status == "finish") {
                  index = j
                  console.log('====' + j)
                }
              }
              console.log(index)
              if (index == -1) {
                this.shipmentMilestones.splice(this.shipmentMilestones.length, 0, obj);
              } else {
                this.shipmentMilestones.splice(index + 1, 0, obj);
              }
            }


          }
          this.shipmentMilestones = JSON.parse(JSON.stringify(this.shipmentMilestones));
          console.log(this.shipmentMilestones)

          var tmffs = this.getDictDatas(this.DICT_TYPE.SHOW_TMFF)
          var obj = tmffs.find((item) => item.value + '' == localStorage.getItem('TENANT_ID') + '');
          var obj1 = this.shipmentMilestones.find((element) => element.key == '7' && element.endDate != null )
          // console.log('显示tmff按钮')
          // console.log(tmffs)
          // console.log(this.shipmentMilestones)
          // console.log(obj)
          // console.log(obj1)
          if (obj != null && obj1 != null) {
            this.showTMFF = true
          }
        });
      },
      closeCenterDialog() {
        this.selectCancelReason = [];
        this.centerDialogFrom = false;
      },
      openCancel() {
        this.centerDialogFrom = true;
        this.centerDialogVisible = true;

        this.selectCancelReason = this.selCancelReason;
      },
      changeSelCancelReason(e) {
        let vm = this;
        this.cancelReasonFlag = false;
        for (var val of vm.selCancelReason) {
          if (e == val.enumId && val.optionIndicator == "t") {
            vm.cancelReasonFlag = true;
            return;
          }
        }
      },
      cancelShipment() {
        let vm = this;
        if (vm.cancelReasonFlag && !vm.shipment.cancelRemark) {
          this.$notify({
            type: "warning",
            message: "Please fill in Cancel Remark for cancellation!",
          });
          return;
        }

        if (!vm.shipment.cancelCode || !vm.shipment.cancelSubCode) {
          this.$notify({
            type: "warning",
            message: "Cancel category and Cancel Reason are mandatory.",
          });
          return;
        }
        var reqDto = {
          cancelCode: vm.shipment.cancelCode,
          cancelSubCode: vm.shipment.cancelSubCode,
          cancelRemark: vm.shipment.cancelRemark,
          id: this.$route.query.id,
          status: this.cancelType,
          uuid: this.$route.query.bookingNumber,
        };
        cancelShipment(reqDto).then((response) => {
          this.centerDialogVisible = false;
          this.$notify({
            title: "success",
            message: "submit success",
            type: "success",
          });
          this.getShipmentStatus();
          this.init();
          this.getBookings();
        });
      },
      getDropDownValues() {
        if (!this.$auth.hasPermi("super:user")) {

          findDropDownListFromCt().then((response) => {
            if (response && response.data) {
              if (response.data.cancelReasonList)
                this.selCancelReason = response.data.cancelReasonList;
              if (response.data.cancelCategoryList)
                this.selCancelCategory = response.data.cancelCategoryList;
            }
          });
        }
      },
      clearSelCancelCategory() {
        this.selectCancelReason = [];
        this.shipment.cancelCode = null;
        this.shipment.cancelSubCode = null;
      },
      getCancelReason(prov) {
        let tempCancelReason = [];
        for (var val of this.selCancelReason) {
          if (prov == val.parentEnumId) {
            tempCancelReason.push({ description: val.description, enumId: val.enumId });
          }
        }
        this.selectCancelReason = tempCancelReason;

        this.shipment.cancelSubCode = null;
      },
      async getFileList(exId, type, item) {
        var list = await getFileList({ exId: exId, dataType: type });
        item.fileList = list.data;
        return list.data;
      },
      updateContainer(i) {
        this.visableSIContainer = true;
        var data = {
          containerNo: this.siForm.containers[i].containerNo,
          containerType: this.siForm.containers[i].containerType,
          containerSealNumber: this.siForm.containers[i].containerSealNumber,
          index: i,
        };
        this.containerForm = JSON.parse(JSON.stringify(data));
      },
      deleteContainer(i) {
        this.siForm.containers.splice(i, 1);
      },
      addProduct2(data) {
        data.push({});
      },
      cancelContainer() {
        this.visableSIContainer = false;
      },
      submitContainer() {
        var obj = this.siForm.containers.findIndex(
          (element) =>
            element.containerNo == this.containerForm.containerNo &&
            element.containerSealNumber == this.containerForm.containerSealNumber
        );
        if (this.containerForm.index != undefined) {
          if (obj == this.containerForm.index || obj == -1) {
            this.siForm.containers[
              this.containerForm.index
            ].containerNo = this.containerForm.containerNo;
            this.siForm.containers[
              this.containerForm.index
            ].containerType = this.containerForm.containerType;
            this.siForm.containers[
              this.containerForm.index
            ].containerSealNumber = this.containerForm.containerSealNumber;
            this.visableSIContainer = false;
          } else {
            this.$notify({
              message:
                "Container No:" +
                this.containerForm.containerNo +
                " Container Seal Number:" +
                this.containerForm.containerSealNumber +
                " is already exists",
              type: "warning",
            });
          }
        } else {
          if (obj != -1) {
            this.$notify({
              message:
                "Container No:" +
                this.containerForm.containerNo +
                " Container Seal Number:" +
                this.containerForm.containerSealNumber +
                " is already exists",
              type: "warning",
            });
          } else {
            var data = JSON.parse(JSON.stringify(this.containerForm));
            data.productData = [{}];
            this.siForm.containers.push(data);
            this.visableSIContainer = false;
          }
        }
      },
      handleDelete(data, index) {
        // 至少要有一条product
        if (data.length < 2) {
          this.$message.warning('Each Container must retain at least one Product record.')
          return
        }
        this.$confirm('Are you sure you want to delete this Product information?', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          data.splice(index, 1)
        }).catch(() => {})
      },
      handleDelete2(index) {
        this.vgmForm.vmg.splice(index, 1);
      },
      changeContainerType(item) {
        this.$set(item, "containerNo", "");
      },
      getContainerTypeCodeList() {
        getContainerTypeCodeList().then((response) => {
          this.containerTypeList = response.data;
        });
      },
      changeContainerNo(item, value) {
        if (value) {
          var flag = true;
          for (var i = 0; i < this.containerNoList.length; i++) {
            if (this.containerNoList[i].containerNo == value) {
              flag = false;
              break;
            }
          }
          if (flag) {
            this.containerNoList.push({
              containerNo: value,
              containerType: item.containerType,
            });
          }
        }
      },
      remoteGetHsCode(query) {
        if (query !== "" && query.length >= 5) {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.getHsCodeListByCode(query);
            this.options = this.hsCodeList.filter((item) => {
              return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options = [];
        }
      },
      getHsCodeListByCode(hscode) {
        getHsCodeListByCode(hscode).then((response) => {
          this.hsCodeList = response.data;
        });
      },
      getHsCodeList() { },
      selectBlur(item) { },
      addProduct() {
        this.visableSIContainer = true;
        this.containerForm = {};
        //this.siForm.productData.push({ batteries: false });
      },
      addRow() {
        this.vgmForm.vmg.push({ batteries: false });
      },
      openSI() {
        this.visableSI = true;
        var res = [];
        var data = JSON.parse(JSON.stringify(this.siList));
        this.$set(this.siForm, "consignee", this.shipment.consignee)
        this.$set(this.siForm, "shipper", this.shipment.shipper)
        this.$set(this.siForm, "notifyParty", this.shipment.notifyParty)
        this.$set(this.siForm, "siRemark", this.shipment.siRemark)
        this.$set(this.siForm, "blSamples", this.shipment.blSamples)
        this.$set(this.siForm, "blType", this.shipment.blType)
        this.$set(this.siForm, "noSiEdi", this.shipment.noSiEdi)

        this.showSIDraft = false
        //未提交过SI
        if (data.length == 0) {
          //显示Draft SI 按钮
          this.showSIDraft = true
          var bookedContainers = this.shipment.containerDOList.filter(
            (item) => item.type == 0
          );

          if(this.clpData.length>0){
            for (var j = 0; j < this.clpData.length; j++) {
                var obj=JSON.parse(JSON.stringify(this.clpData[j]))
                obj.productData=[{}]
                res.push(obj);
              }
          }else{
            var draftContainers = this.shipment.containerDOList.filter(
              (item) =>   item.type == 4
            );
            if(draftContainers.length>0){
              for(var i=0;i<draftContainers.length;i++){

                var obj=JSON.parse(JSON.stringify(draftContainers[i]))

                var products=JSON.parse(JSON.stringify(this.shipment.productDOList.filter(item=>item.shipmentId==this.shipment.id&&item.containerId==obj.id)))

                obj.productData=products
                obj.id=null;
                obj.type=null;

                for(var product of obj.productData) {
                  product.hscodeSupplier = product.hscode
                  product.hscode = ''
                }

                res.push(obj)
              }
            }else{
              for (var i = 0; i < bookedContainers.length; i++) {
                for (var j = 0; j < bookedContainers[i].numbers; j++) {
                  res.push({
                    containerType: bookedContainers[i].containerType,
                    productData: [{}],
                  });
                }
              }
            }

          }

        } else {
          for (var i = 0; i < data.length; i++) {

            if(data[i].type == 4){
              this.showSIDraft = true
            }
            var obj = res.find(
              (element) =>
                element.containerNo ==
                this.shippedContainer[data[i].containerId].containerNo &&
                element.containerSealNumber ==
                this.shippedContainer[data[i].containerId].containerSealNumber
            );
            if (obj == null) {
              res.push({
                containerNo: this.shippedContainer[data[i].containerId].containerNo,
                soc: this.shippedContainer[data[i].containerId].soc,
                containerType: this.shippedContainer[data[i].containerId].containerType,
                subContainerType: this.shippedContainer[data[i].containerId].subContainerType,
                remark: this.shippedContainer[data[i].containerId].remark,
                containerSealNumber: this.shippedContainer[data[i].containerId].containerSealNumber,
                tareWeight: this.shippedContainer[data[i].containerId].tareWeight,
                productData: [data[i]],
              });
            } else {
              obj.productData.push(data[i]);
            }
          }
        }
        this.siForm.containers = res;
        this.siDataStr = JSON.stringify(this.siForm)
        this.productChange()
      },
      openVGM(flag) {
        this.visableVGM = flag;

        this.$set(this.vgmForm, "noVgmEdi", this.shipment.noVgmEdi)

        for (var key in this.shippedContainer) {
          if (this.shippedContainer[key].containerNo) {
            var obj = this.containerNoList.find(
              (element) =>
                element.containerNo == this.shippedContainer[key].containerNo &&
                element.containerType == this.shippedContainer[key].containerType
            );
            if (obj == null) {
              this.containerNoList.push({
                containerNo: this.shippedContainer[key].containerNo,
                containerType: this.shippedContainer[key].containerType,
              });
            }
          }
        }
        var data = [];
        var bookedContainers = this.siForm.containers;

        if (this.shipment.shipmentVgmDOS.length > 0) {
          data = JSON.parse(JSON.stringify(this.shipment.shipmentVgmDOS));
          console.log(data)
          for (var i = 0; i < data.length; i++) {
            console.log(data[i].containerId)
            data[i].containerNo = this.shippedContainer[data[i].containerId].containerNo;
            data[i].containerType = this.shippedContainer[
              data[i].containerId
            ].containerType;
            var grossWeight = 0;
            for (var j = 0; j < bookedContainers[i].productData.length; j++) {
              grossWeight += Number(bookedContainers[i].productData[j].grossWeight);
            }
            console.log(grossWeight)
            data[i].grossWeight = grossWeight;
            data[i].vgm = Number(data[i].tareWeight) + Number(data[i].grossWeight);
            console.log(data[i])
          }
          console.log('---')

          this.vgmForm.vmg = data;

        } else if (this.vgmForm.vmg.length == 0) {
          for (var i = 0; i < bookedContainers.length; i++) {
            var grossWeight = 0;
            for (var j = 0; j < bookedContainers[i].productData.length; j++) {
              //grossWeight
              grossWeight += Number(bookedContainers[i].productData[j].grossWeight);
            }
            data.push({
              containerType: bookedContainers[i].containerType,
              containerNo: bookedContainers[i].containerNo,
              vgmMethod: "SM2",
              billNo: this.shipment.shipmentBookingNumber,
              grossWeight: grossWeight,
              vgm: (grossWeight) + (bookedContainers[i]['tareWeight'] ? Number(bookedContainers[i].tareWeight) : 0),
              tareWeight: bookedContainers[i]['tareWeight'] ? Number(bookedContainers[i].tareWeight) : 0,
              vesselVoy: this.shipment.routerDOList[this.shipment.routerDOList.length - 1]
                .voyage,
            });
          }
          this.vgmForm.vmg = data;
        } else if (this.vgmForm.vmg.length > 0) {
          var bookedContainers = this.siForm.containers;
          for (var i = 0; i < bookedContainers.length; i++) {
            var grossWeight = 0;
            for (var j = 0; j < bookedContainers[i].productData.length; j++) {
              //grossWeight
              grossWeight += Number(bookedContainers[i].productData[j].grossWeight);
            }
            var containerNo = bookedContainers[i].containerNo;
            var vgm = Number(grossWeight) + Number(this.vgmForm.vmg[i].tareWeight);
            this.vgmForm.vmg[i].vgm = vgm;
            this.vgmForm.vmg[i].containerNo = containerNo;
          }
        }
        this.vgmDataStr = JSON.stringify(this.vgmForm)

      },
      setVGM(item) {
        item.vgm = Number(item.grossWeight) + Number(item.tareWeight);
      },
      cancelsi() {
        this.visableSI = false;
      },
      cancelvgm() {
        this.visableVGM = false;
      },
      submitsi(type) {
        this.$refs['siForm'].validate((valid) => {
          if (valid) {
            // if(this.spoList.length>0 && this.SOType == 'LCL') {
            //   for (var product of this.SOProductList) {
            //     if (product.numberOfPackagesAll > 0) {
            //       this.$notify.error('Not fully allocated');
            //       return false
            //     }
            //     if (product.grossWeightAll > 0) {
            //       this.$notify.error('Not fully allocated');

            //       return false
            //     }
            //     if (product.volumeAll > 0) {
            //       this.$notify.error('Not fully allocated');
            //       return false
            //     }
            //   }

            // }
            this.siButLoading = true
            if(type == 4){
              this.siForm.siDraft = true
            }else{
              this.siForm.siDraft = false
            }
            //判断重复的箱号
            const uniqueContainerNos = new Set();
            const duplicates = [];

            this.siForm.containers.forEach(container => {
              if (uniqueContainerNos.has(container.containerNo)) {
                duplicates.push(container);
              } else {
                uniqueContainerNos.add(container.containerNo);
              }
            });
            if(duplicates.length > 0){
                this.$notify.error('Duplicate Container No: ' + duplicates[0].containerNo + ' , please check');
                this.siButLoading = false
                return false
            }

            for (let i = 0; i < this.siForm.containers.length; i++) {
              if (this.siForm.containers[i].containerNo != null) {
                this.siForm.containers[i].containerNo = this.siForm.containers[i].containerNo.replace(/(^\s*)|(\s*$)/g,
                  '').toUpperCase()
              }
              if (this.siForm.containers[i].containerSealNumber != null) {
                this.siForm.containers[i].containerSealNumber = (this.siForm.containers[i].containerSealNumber + '').replace(/(^\s*)|(\s*$)/g, '')
              }
              const state = this.validateContainerNO(this.siForm.containers[i].containerNo)
              if (!state) {
                this.siButLoading = false
                return false
              }
            }
            for (var j = 0; j < this.siForm.containers.length; j++) {
              for (var k = 0; k < this.siForm.containers[j].productData.length; k++) {
                var products = this.siForm.containers[j].productData
                for (var product of products) {
                  if (!product.hscode) {
                    this.$notify.error('Please input HS Code');
                    this.siButLoading = false
                    return false
                  }
                }
                // if(!this.checkTSHGHscode(products)) {
                //   this.$notify.error('Invalid HS Code , please check');
                //   this.siButLoading = false
                //   return false
                // }
              }
            }
            this.realSubmitSI(false);
          } else {
              console.log('error submit!!');
              return false;
            }
        });
      },
      realSubmitSI(flag) {
        var newSIData = JSON.stringify(this.siForm)
        var newVGMData = JSON.stringify(this.vgmForm)
        var siFlag = false
        var vgmFlag = false
        if (this.siDataStr != newSIData) {
          siFlag = true
        }
        if (this.vgmDataStr != newVGMData) {
          vgmFlag = true
        }

        var containers = [];
        var products = [];
        for (var i = 0; i < this.siForm.containers.length; i++) {
          containers.push({
            containerNo: this.siForm.containers[i].containerNo,
            soc: this.siForm.containers[i].soc,
            containerType: this.siForm.containers[i].containerType,
            subContainerType: this.siForm.containers[i].subContainerType,
            containerSealNumber: this.siForm.containers[i].containerSealNumber,
            remark: this.siForm.containers[i].remark,
            tareWeight: this.siForm.containers[i].tareWeight,
          });
          var grossWeight = 0;
          var volume = 0;
          var numbersOfPackage = 0;
          var packageType = '';
          for (var j = 0; j < this.siForm.containers[i].productData.length; j++) {
            this.siForm.containers[i].productData[j].containerNo = this.siForm.containers[
              i
            ].containerNo;
            this.siForm.containers[i].productData[
              j
            ].containerSealNumber = this.siForm.containers[i].containerSealNumber;
            products.push(this.siForm.containers[i].productData[j]);
            if(this.siForm.containers[i].productData[j].grossWeight){
              grossWeight += Number(this.siForm.containers[i].productData[j].grossWeight);
            }
            if(this.siForm.containers[i].productData[j].volume){
              volume += Number(this.siForm.containers[i].productData[j].volume);
            }
            if (this.siForm.containers[i].productData[j].numberOfPackages) {
              numbersOfPackage += Number(this.siForm.containers[i].productData[j].numberOfPackages);
            }
            packageType = this.siForm.containers[i].productData[j].packages
          }
          containers[i].grossWeight = grossWeight
          containers[i].volume = volume
          containers[i].numbersOfPackage = numbersOfPackage
          containers[i].packageType = packageType
        }

        var req = {
          shipmentId: this.$route.query.id,
          blType: this.siForm.blType,
          siRemark: this.siForm.siRemark,
          blSamples: this.siForm.blSamples,
          products: JSON.stringify(products),
          vmg: JSON.stringify(this.vgmForm.vmg),
          containers: JSON.stringify(containers),
          shipper: this.siForm.shipper,
          consignee: this.siForm.consignee,
          agreementParty: this.siForm.agreementParty,
          notifyParty: this.siForm.notifyParty,
          si: siFlag,
          vgm: vgmFlag,
          siDraft: this.siForm.siDraft,
          noSiEdi: this.siForm.noSiEdi,
        };
        si(req).then((response) => {
          this.visableSI = false;
          this.visableVGM = false;
          this.siButLoading = false
          this.getShipmentStatus();
          this.init();
          this.$notify({
            title: "success",
            message: "submit success",
            type: "success",
          });
        });


      },
      getDeptList(ids) {
        getDeptList({ ids: ids.join(",") }).then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            this.$set(this.partiesMap, response.data[i].id, response.data[i]);
          }
        });
      },
      queryShippmentSchedule() {
        //  移除tshg的判断； 都使用飞驼数据map
        // if (this.shipment.carrier == 'TSHG') {
        //   findShippingScheduleList({
        //     origin: this.shipment.originPort,
        //     destination: this.shipment.destinationPort,
        //     voyage: this.shipment.routerDOList[0].voyage.slice(0, -1),
        //     vesselName: this.shipment.routerDOList[0].transportMeanName,
        //     carrier: 'TSHG'
        //   }).then((res) => {
        //     if (res.data != null && res.data.length > 0) {
        //       this.shipmentScheduleMap[this.shipment.routerDOList[0].transportMeanName] =
        //         res.data[0].list
        //     }
        //   })
        // } else
        {

          if (this.shipment.shipmentBookingNumber == null || this.shipment.shipmentBookingNumber == '') {
            this.shipment.showIframe2 = false
            return
          }
          trackByBookingNumber({
            carrier: this.shipment.carrier,
            bookingNumber: this.shipment.shipmentBookingNumber
          }).then((res) => {
            console.log(res.data)
            if (res?.data?.statusCode == '20000') {
              this.shipment.showIframe = true
              this.shipment.showIframe2 = false

              if(res.data.data.result.carrier.code=='TAILWIND') {
                res.data.data.result.carrier.code = 'TSHG'
              }
              this.shipment.iframeUrl = this.srcUrl = 'https://i.saas.freightower.com/#/ocean/detail?key=MrFe7x4NNpSAQRSoUYNURgwSHG2g6nVGEDlZY3r5xLM@&clientId=q8acc6c57665bf971&billNo='
                + this.shipment.shipmentBookingNumber + '&carrierCode=' + res.data.data.result.carrier.code + '&showInfo=1&lang=en'

              console.log(this.shipment.iframeUrl)
              setTimeout(function () {
                var iframe = document.getElementById('iframe1');
                console.log(iframe)
                var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                iframeDocument.body.style.fontFamily = "Arial, sans-serif";
                iframeDocument.body.style.fontSize = "16px";
                iframeDocument.body.style.color = "#333";
              }, 2000);
              this.tempPlaces = res.data.data.result.places
              this.tempPlacesShow = this.tempPlaces
                // 第一步：过滤掉etd和eta都为空的元素
                .filter(item => {
                  // 定义“空”的判断逻辑：null/undefined/空字符串
                  const isEtdEmpty = item.etd == null || item.etd === '';
                  const isEtaEmpty = item.eta == null || item.eta === '';
                  // 保留：etd和eta不同时为空的元素
                  return !(isEtdEmpty && isEtaEmpty);
                })
                // 第二步：按code去重，保留第一个出现的元素
                .reduce((map, item) => {
                  const uniqueKey = String(item.code); // 统一转为字符串，避免类型差异
                  if (!map.has(uniqueKey)) {
                    map.set(uniqueKey, item);
                  }
                  return map;
                }, new Map())
                .values()
                .reduce((arr, item) => [...arr, item], []);

              // this.tempPlacesShow = this.tempPlaces
              //   // 1. 过滤 eta 非空（严格排除 null/undefined/''）
              //   .filter(item => item.etd != null && item.etd !== '')
              //   // 2. 去重：用 code 作为唯一键，Map 强制去重（保留第一个出现的）
              //   .reduce((map, item) => {
              //     // 关键：确保 code 是字符串（避免 number/string 类型差异导致去重失效）
              //     const uniqueKey = String(item.code);
              //     if (!map.has(uniqueKey)) {
              //       map.set(uniqueKey, item);
              //     }
              //     return map;
              //   }, new Map())
              //   // 3. 必须转数组！Map.values() 是迭代器，不转数组可能导致排序/渲染异常
              //   .values()
              //   .reduce((arr, item) => [...arr, item], []) // 迭代器转数组（比 Array.from 更兼容）
              //   // 4. 按 eta 升序排序（加容错，避免 invalid date 导致排序失败）
              //   .sort((a, b) => {
              //     const dateA = new Date(a.etd).getTime();
              //     const dateB = new Date(b.etd).getTime();
              //     return isNaN(dateA) ? 1 : isNaN(dateB) ? -1 : dateA - dateB;
              //   });
              console.log('111111111111111')
              console.log(this.tempPlaces)

              console.log(this.tempPlacesShow)

              // this.tempPlacesShow = this.tempPlaces.filter(item => item.type != 2 && item.type != 5 && item.type != 10)
              if (res.data.data.result.containers.length > 0) {
                this.movements = res.data.data.result.containers[0].status
              }
              this.tempVessel = res.data.data.result.vessel

          } else {
            this.shipment.showIframe2 = false
          }
        })
      }
    },
    setContainerMovement(status, milestones, descriptionCn, container, eventField) {
      var statusByType = status.filter((item) => item.descriptionCn == descriptionCn)
      if (statusByType.length > 0) {
        if (milestones.filter((item) => item.status == eventField).length == 0) {
          milestones.push({
            location: statusByType[0].eventPlace,
            vessel: (statusByType[0].vslName ? statusByType[0].vslName : '') + " / " + (statusByType[0].voy ? statusByType[0].voy : ''),
            status: eventField
          })
        }
      }
      if (statusByType.length > 0) {
        container[eventField] = new Date(statusByType[0].eventTime).getTime()
        return true
      }
      return false
    },
    findShippingSchedule(reqData){
      findShippingScheduleList(reqData).then((response) => {
          var arr=response.data.filter(item=>item.voyage==this.shipment.routerDOList[0].voyage)
          if(arr.length>0){
            this.siCutoff=arr[0].siCutoff
            this.vgmCutoff=arr[0].vgmCutoff
          }
      });
    },
    init() {
      getList({ ids: this.$route.query.id }).then((response) => {
        this.bookings = [];
        this.shippedContainer = {}
        for (var i = 0; i < response.data.length; i++) {
          //this.shipment = response.data[i];
          for (let key in response.data[i]) {
            if (response.data[i].hasOwnProperty(key)) {
              this.$set(this.shipment, key, response.data[i][key]);
            }
          }
          this.isPepco = this.shipment.fromShipperBooking
          if(this.isPepco) {
            this.getPoTaskStatusByShipmentId()
          }

          if (this.shipment.carrier!='TSHG'&&(this.shipment.originPort == 'CNNGB' && this.shipment.sinotrans || this.shipment.pushBookingFlag)&& this.shipment.originPort != 'CNTAO'&&this.shipment.originPort != 'CNTXG') {
            this.showCNNGBSI = true
                      console.log('showCNNGBSI')
          }

            //shipping Order 列表
            if(this.shipment.fromShippingOrder){
              this.getShippingOrderList(this.shipment.id)
            }

          this.getDestinationAgentByShipmentId()
          this.getDestinationAgentByShipmentId()
          this.tempPlaces1 = []
          // 非tailwind和pepco 4pl
          // 需要把place里面的port带时间的都带过来
          for (var index = 0; index < this.shipment.routerDOList.length; index++) {
            var item = this.shipment.routerDOList[index]
            var item1 = {};
            item1.code = item.pol
            item1.transportMeanName = item.transportMeanName
            item1.voyage = item.voyage
            item1.transportMode = item.transportMode
            item1.etd = item.etd
            this.tempPlaces1.push(item1);

            if (index == 0) {
              if(this.isPepco4PL&& this.shipment.carrier != 'TSHG') {
                item1.code = this.shipment.originPort
              }
              item1.bookedEtd = this.shipment.bookedEtd
              item1.etd = this.shipment.etd
              item1.atd = this.shipment.atd
              item1.departureAtd = this.shipment.departureAtd
            }

            var item2 = {};
            item2.code = item.pod
            item2.transportMode = item.transportMode
            item2.eta = item.eta
            this.tempPlaces1.push(item2);
            if(index==this.shipment.routerDOList.length-1) {
              if (this.isPepco4PL && this.shipment.carrier != 'TSHG') {
                item2.code = this.shipment.destinationPort
              }
              item2.bookedEta = this.shipment.bookedEta
              item2.eta = this.shipment.eta
              item2.ata = this.shipment.ata
            }
            item1.type = 'pol'
            item2.type = 'pod'
          }
          placesListByCondition({ shipmentId: this.shipment.id }).then((res) => {
            this.places = res.data
            for (var index = 0; index < this.tempPlaces1.length; index++) {
              var item = this.tempPlaces1[index]
              var tempPlaces = this.places.filter(temp => temp.port==item.code)
              if(tempPlaces!=null&&tempPlaces!=undefined && tempPlaces.length>0){
                var tempPlace = tempPlaces[0]
                console.log(tempPlace)
                if(tempPlace.etd!=null&& tempPlace.etd!=undefined&& tempPlace.etd!=''){
                  item.etd = tempPlace.etd
                }
                if (tempPlace.eta != null && tempPlace.eta!=undefined &&tempPlace.eta!='') {
                  item.eta = tempPlace.eta
                }
                // 不适用place里面的 atd了
                // if(tempPlace.atd!=null && tempPlace.atd !=undefined && tempPlace.atd !=''){
                //   item.atd = tempPlace.atd
                // }
                if (tempPlace.ata != null && tempPlace.ata !=undefined && tempPlace.ata !='') {
                  item.ata = tempPlace.ata
                }

              }
            }
          for (var index = 0; index < this.tempPlaces1.length; index++) {
              if(this.tempPlaces1[index].code == this.shipment.destinationPort){
                this.tempPlaces1[index].eta = this.shipment.eta
                this.tempPlaces1[index].ata = this.shipment.ata
              }
            }
          })



// TODO 添加尾程的轨迹
      this.getDestinationRouterList()


            if(this.shipment.carrier!='TSHG'&&(this.shipment.siDate==null||this.shipment.vgmDate==null)){
              this.siVGMCutoffflag=true

              var date=new Date(this.shipment.etd)
              date.setDate(date.getDate() - 1)
              var reqData={
                weeks:1,
                carrier:this.carrierMap[this.shipment.carrier],
                departureFrom:this.parseTime(date),
                origin:this.shipment.pol,
                destination:this.shipment.pod,
              }
              this.findShippingSchedule(reqData)
            }
            if (this.$auth.hasPermi("shipment:clp-so:query")) {
              this.getClpList(this.shipment.shipmentBookingNumber)
            }

          this.getThirdPartyRes()
          // this.getPlaces(this.shipment.id)
          this.exportVesselListByCondition(this.shipment.id)
          this.getContainerStatusListByCondition(this.shipment.id)
          this.queryShippmentSchedule();
          if(response.data[i].bookingItemResVOS!=null) {
            this.itemTableData = response.data[i].bookingItemResVOS!=null
          }
          var row = response.data[i]
          var data = row.shipmentDetailDOS.sort((a, b) => Number(a.age - b.age)).filter((item) => item.location != null)
          data.sort((a, b) => a.endDate - b.endDate)
          row.movement = data
          var containerMap = {}
          if (row.clpRes) {
            var clpList = row.clpRes.clpDetailResList
            for (var i = 0; i < clpList.length; i++) {
              if (!containerMap[clpList[i].containerNo]) {
                containerMap[clpList[i].containerNo] = {
                  volume: clpList[i].cbm, orderIds: [clpList[i].orderId]
                  , cbms: [clpList[i].cbm]
                  , qtys: [clpList[i].qty]
                }
              } else {
                containerMap[clpList[i].containerNo].volume = containerMap[clpList[i].containerNo].volume + clpList[i].cbm
                if (containerMap[clpList[i].containerNo].orderIds.indexOf(clpList[i].orderId) == -1) {
                  containerMap[clpList[i].containerNo].orderIds.push(clpList[i].orderId)
                  containerMap[clpList[i].containerNo].cbms.push(clpList[i].cbm)
                  containerMap[clpList[i].containerNo].qtys.push(clpList[i].qty)
                }
              }
            }
          }

            var orderMap = {}
            if(row.bookingItemResVOS!=null&& row.bookingItemResVOS!=undefined) {
              for (var i = 0; i < row.bookingItemResVOS.length; i++) {
                orderMap[row.bookingItemResVOS[i].orderId] = row.bookingItemResVOS[i].orderNumber
              }
            }
            row.orderMap = orderMap
            row.containerMap = containerMap

          if (this.shipment.carrier === 'TSHG') {
            this.blflag = true
          } else {
            this.blflag = false
          }
          this.form.bookingNum = this.shipment.shipmentBookingNumber;
          var ids = [
            this.shipment.shipper,
            this.shipment.consignee,
            this.shipment.notifyParty,
            this.shipment.agreementParty,
            this.shipment.customer,
          ];
          for (var j = 0; j < this.shipment.containerDOList.length; j++) {
            if (this.shipment.containerDOList[j].type == 0) {
              continue
            }
            this.shippedContainer[this.shipment.containerDOList[j].id] = {
              poNumber: this.shipment.containerDOList[j].poNumber,
              containerNo: this.shipment.containerDOList[j].containerNo,
              containerType: this.shipment.containerDOList[j].containerType,
              departurePod: this.shipment.containerDOList[j].departurePod,
              arrivalInlandTerminal: this.shipment.containerDOList[j].arrivalInlandTerminal,
              emptyContainerReturn: this.shipment.containerDOList[j].emptyContainerReturn,
              containerGateIn: this.shipment.containerDOList[j].containerGateIn,
              subContainerType: this.shipment.containerDOList[j].subContainerType,
              containerSealNumber: this.shipment.containerDOList[j].containerSealNumber,
              remark: this.shipment.containerDOList[j].remark,
              soc: this.shipment.containerDOList[j].soc,
              tareWeight: this.shipment.containerDOList[j].tareWeight,
            };
          }
          this.getDeptList(ids);
          var products = row.productDOList;
          if (products && products.filter((item) => item.type == 0|| item.type == 4).length > 0) {
            var data = products.filter((item) => item.type == 0|| item.type == 4);
            var totalVolume = 0;
            var totalWeight = 0;
            var cargoPackageType = "";
            var slac = 0;
            for (var i = 0; i < data.length; i++) {
              totalVolume += data[i].volume;
              slac += data[i].numberOfPackages;
              totalWeight += data[i].grossWeight;
              cargoPackageType = data[i].packages;
            }
            this.bookings.push({
              bookingProductDOS: data,
              totalVolume: totalVolume,
              slac: slac,
              totalWeight: totalWeight,
              cargoPackageType: cargoPackageType,
            });
          }
          if (products && products.filter((item) => item.type == 1).length > 0) {
            this.siList = products.filter((item) => item.type == 1);
          }
        }
        this.getPushSinotransRecordListByBookingNumber(this.shipment.bookingNumber)
        this.getPushQingdaoRecordListByBookingNumber(this.shipment.bookingNumber)
        this.getFeedbackInformationFromNingbo(this.shipment.bookingNumber)
        this.calculate();
      });
    },
    isPepco4PL() {
      const tenantID = localStorage.getItem('TENANT_ID')
      console.log('get local tenantID', tenantID)
      console.log(tenantID)
      if (tenantID) {
        // 获取字典里pepco的id
        const pepcoIdsString = this.getDictDatas(this.DICT_TYPE.PEPCO).find(item => item.label === 'tenantId_4pl')?.value || ''
        const pepcoIdsArray = pepcoIdsString.split(',').map(id => id.trim())
        console.log('pepcoIdsString', pepcoIdsString)
        console.log('pepcoIdsArray', pepcoIdsArray)
        // 检查tenantID是否在pepcoIdsArray中
        const isMatched = pepcoIdsArray.includes(tenantID)
        console.log('isMatched', isMatched)
        return isMatched
      }
      return false
    },
    getBookings() {

      },
      toTack(vesselName){
        console.log(vesselName,"vesselName")

        window.open('/track/ship?vesselName='+vesselName)
      },
      getPortList() {
        getOriginDeliveryList().then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            this.$set(this.originDeliveryMap, response.data[i].code, response.data[i].name);
          }
        });
        getPolPodList().then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            this.$set(this.polPodMap, response.data[i].code, response.data[i].name);
          }
        });
      },

      handleExport() {
        this.$modal
          .confirm("Export?")
          .then(() => {
            this.exportLoading = true;
            return exportShippedExcel({ids:[this.$route.query.id]});
          })
          .then((response) => {
            this.$download.excel(response, "Shipped Containers Data.xlsx");
            this.exportLoading = false;
          })
          .catch(() => {});
      },
    // 处理handleExportICS2F15下载逻辑
    handleExportICS2F15() {
      this.$modal
        .confirm(this.$t('purchaseOrder.confirmThatAllDataItemsAreExported'))
        .then(() => {
          this.exportLoading = true
          return exportShipmentICS2F15({ id: this.shipment.id })
        })
        .then(response => {
          this.$download.excel(response, 'smartMOOV_ICS2_F15' + this.parseTimeToZ2(new Date()) + '.xlsx')
          this.exportLoading = false
        })
        .catch(() => { })
    },
    parseTimeToZ2(timestamp) {
      if (!timestamp) return null
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')

      return `${year}${month}${day}${hours}${minutes}`
    },
      getShippingOrderList(shipmentId){
        getShippingOrderByShipment(shipmentId).then(res =>{
          this.spoList = res.data
          this.getShippingOrderListByIds()
        })
      },
      getSpoPage() {
        this.spoPage.shipmentIds = [this.shipment.id]
        getNotShipmentOrderPage(this.spoPage).then((res) => {
          this.spoTable = res.data.list;
          this.spoPage.total = res.data.total;
        })
      },
      addSpo(row) {
        var res = this.selectedSpoTable.filter((item) => item.id == row.id)
        if (res.length == 0) {
          this.selectedSpoTable.push(row)
          for (var i = 0; i < this.selectedSpoTable.length; i++) {
            this.selectSpoIds.push(this.selectedSpoTable[i].id)
          }
        }
      },
      subSpo(index) {
        this.selectedSpoTable.splice(index, 1);
        this.selectSpoIds = []
        for (var i = 0; i < this.selectedSpoTable.length; i++) {
          this.selectSpoIds.push(this.selectedSpoTable[i].id)
        }
      },
      submitSpoChange() {
        var data = {
          shipmentId: this.shipment.id,
          spoIds: this.selectSpoIds
        }
        updateShippingRelationship(data).then((res) => {
          this.addRemoveSPOVisible = false
          this.$notify({
            title: 'success',
            message: 'success',
            type: 'success'
          });
          this.init();
        })
      },
      addRemoveSpoShow() {
        this.$nextTick(() => {
          this.$refs.shippingOrderDialog.openDialog(this.spoList,this.shipment)
        });
        // this.getSpoPage()
        // this.selectedSpoTable = this.spoList;
        // this.selectSpoIds = []
        // for (var i = 0; i < this.selectedSpoTable.length; i++) {
        //   this.selectSpoIds.push(this.selectedSpoTable[i].id)
        // }
        // this.addRemoveSPOVisible = true
      },
      reArrangeSOShow() {
      // this.$nextTick(() => {
        this.$refs.ShippingOrderReArrangeDialog.openDialog(this.spoList, this.shipment)
      // });
      // this.getSpoPage()
      // this.selectedSpoTable = this.spoList;
      // this.selectSpoIds = []
      // for (var i = 0; i < this.selectedSpoTable.length; i++) {
      //   this.selectSpoIds.push(this.selectedSpoTable[i].id)
      // }
      // this.addRemoveSPOVisible = true
    },


      handleOrderSubmit(rows) {
        this.init();
      },
      getShippingOrderListByIds() {
        var poIds = this.spoList.map(item => item.id);
        if(this.isPepco) {
          console.log('-----------is pepco--------------', poIds)
          this.spoIds = poIds

          getShippingOrderListByIds(poIds).then(response => {
            console.log(response.data)
            var spoListTemp = response.data
            if(spoListTemp&& spoListTemp.length>0) {
              this.form.shipmentType = spoListTemp[0].shipmentType
            }
            // 处理cargoInfo
            this.handleCargoInfo(spoListTemp, poIds)
            this.spoItems = []
            spoListTemp.forEach(so => {
              var products = so.productDOList
              var product = {id:so.id,soRef:so.soRef}


              if (products && products[0]) {
                product.hscode = products[0].hscode
                product.markNumbers = products[0].markNumbers
                product.productName = products[0].productEnglishName
                product.booked = products[0].numberOfPackages
                product.bookedWeight=products[0].grossWeight
                product.bookedVolume=products[0].volume
              }
              this.spoItems.push(product)
            })

          // getOrderHeadersList({ shippingOrderIds: poIds.join(",") }).then(res => {
          //   console.log(res)
          //   this.spoItems = []
          //   for (var order of res.data) {
          //     var shipping = spoListTemp.filter(item => item.id = order.shippingId)
          //     if (shipping.length > 0) {
          //       // 如果 order.soRef 没有值的时候再塞 edwin
          //       if (!order.soRef) {
          //         order.soRef = shipping[0].soRef
          //       }
          //       // order.soRef = shipping[0].soRef
          //       var products = shipping[0].productDOList
          //       if (products && products.length > 0)
          //         order.hscode = products[0].hscode
          //     }
          //     for (var item of order.items) {
          //       item.soRef = order.soRef
          //       item.orderNumber = order.orderNumber
          //       item.hscode = order.hscode
          //       item.bookedWeight = item.booked * item.outerWeight
          //       item.bookedVolume = item.booked && item.length && item.width && item.height ? Number((item.booked * item.length * item.width * item.height / 1000000)) : 0
          //       this.spoItems.push(item)
          //     }
          //     this.productChange()
          //   }
          // })
          //   .catch(err => {
          //     console.log(err)
          //   })
         })
        } else {
          console.log('-----------not pepco--------------', poIds)
          this.SOProductList = []
          getShippingOrderListByIds(poIds).then((response) => {
            console.log(response.data)
            this.SOList = response.data
            for (var i = 0; i < this.SOList.length; i++) {
              var so = this.SOList[i]
              var data = this.SOList[i].productDOList
              this.SOType = so.shipmentType
              for (var j = 0; j < data.length; j++) {
                var item = data[j]
                item.mark = item.remark
                item.uploadData = {}
                item.fileList = []
                if (item.hazardousMaterials == "{}") {
                  item.dg = 0;
                } else {
                  item.dg = 1;
                }
                item.batteries = Number(item.batteries);
                if (!item.batteries) item.batteries = 3
                item.soRef = so.soRef
                item.soId = so.id
                item.numberOfPackagesAll = item.numberOfPackages + 0
                item.grossWeightAll = item.grossWeight + 0
                item.volumeAll = item.volume + 0
                item.hazardousMaterials = JSON.parse(item.hazardousMaterials);
                this.SOProductList.push(item)
              }
            }
            this.productChange()
          })
          console.log(this.SOProductList)
        }
      },

      productChange() {
        if(this.isPepco) {
          this.spoItems;
        } else {
          // 全局的去减；不是单个的去减SOProductList循环
          for (var product of this.SOProductList) {
            product.numberOfPackagesAll = product.numberOfPackages
            product.grossWeightAll = product.grossWeight
            product.volumeAll = product.volume
          }

          for (let index = 0; index < this.siForm.containers.length; index++) {
            const element = this.siForm.containers[index];
            for (var product of element.productData) {
              var selectSO = this.SOProductList.filter(p => p.id == product.soProductId).shift();
              if (selectSO != undefined) {
                selectSO.numberOfPackagesAll -= product.numberOfPackages
                selectSO.grossWeightAll -= product.grossWeight
                selectSO.volumeAll -= product.volume
              }

            }
          }
          this.SOProductList = JSON.parse(JSON.stringify(this.SOProductList));
        }
      },
      numberOfPackagesChange(item) {
              console.log('numberOfPackagesChange')
        console.log(item)
        this.productChange()
      },
      grossWeightChange(item) {
        this.productChange()
      },
      volumeChange(item) {
        this.productChange()
      },
      getInputStrClassNumberOfPackages(row){
        if (row.numberOfPackagesAll != 0) {
          return 'Red'
        }
      },
      getInputStrClassGrossWeight(row) {
        if (row.grossWeightAll != 0) {
          return 'Red'
        }
      },
          getInputStrClassVolume(row) {
        if (row.volumeAll != 0) {
          return 'Red'
        }
      },

      handleSendEmail() {

        this.sendMail.open = true;

        var tempEmail = []
        tempEmail.push(this.user.email)
        for (let i = 0; i < this.selectedFollower.length; i++) {
          let id = this.selectedFollower[i];
          if (this.agentMap != null && this.agentMap[id] != null && this.agentMap[id].email != null) {
            tempEmail.push(this.agentMap[id].email)
          }
        }
        this.sendMail.toMail = tempEmail.join(',');

        var tempContainers = this.shipment.containerDOList.filter((item) => item.type == 0)
        var containerStr = tempContainers.map(container => container.numbers + "x" + container.containerType).join(',');
        var pol = this.originDeliveryMap[this.shipment.pol] ? this.originDeliveryMap[this.shipment.pol] : this.shipment.pol
        var pod = this.originDeliveryMap[this.shipment.destinationPort] ? this.originDeliveryMap[this.shipment.destinationPort] : this.shipment.destinationPort

        if(this.agentDetail.templateTitle!=null) {
          this.sendMail.templateTitle = this.agentDetail.templateTitle;
        } else {

          var customerName = this.partiesMap[this.shipment.customer]? this.partiesMap[this.shipment.customer].name : ""

          var title = "MOOV PRE_ALERT / "+ customerName+" / "+this.shipment.poNumbers+" / " + this.shipment.shipmentBookingNumber + " " + this.shipment.pol + " TO " + this.shipment.destinationPort + " " + containerStr;
          this.sendMail.templateTitle = title;
        }

        if (this.agentDetail.templateContent != null) {
          this.sendMail.templateContent = this.agentDetail.templateContent;
        } else {
          var vessel = ''
          var voyage = ''
          for (var index = 0; index < this.shipment.routerDOList.length; index++) {
            var item = this.shipment.routerDOList[index]
            if (item.transportMeanName != 'TBA' && item.transportMeanName != null) {
              vessel = item.transportMeanName
              voyage = item.voyage
              break
            }
          }

          var normalCustomsClearance = this.agentDetail.normalCustomsClearance == true ? "Yes" : "No"
          var prePayDutiesAndTax = this.agentDetail.prePayDutiesAndTax == true ? "Yes" : "No"
          var fiscalCustomsClearance = this.agentDetail.fiscalCustomsClearance == true ? "Yes" : "No"
          var t1CustomsClearance = this.agentDetail.t1CustomsClearance == true ? "Yes" : "No"
          var destinationDelivery = this.agentDetail.destinationDelivery == true ? "Yes" : "No"

          var containerNo = ''
          var containers = this.shipment.containerDOList.filter((item) => item.type == 1)
          var containerList = []
          for (var contaienr of containers) {
            containerList.push(contaienr.containerNo+'('+ contaienr.containerType+')')
          }
          containerNo = containerList.join("、");

          var content = "Dear Agent," + "\n\n"
            + "<strong>Kindly note PRE-ALERT for shipment " + this.shipment.shipmentBookingNumber + "</strong>\n"
            + `${this.$constants.MBL_NUMBER}: ` + this.shipment.shipmentBookingNumber + "\n"
            + "HBL NO: " + this.shipment.poNumbers + "\n"
            + "CONTAINERS: " + containerNo + "\n"
            + "VESSEL/VOYAGE: " + vessel + "/" + voyage + "\n"
            + "POL TO POD: " + pol + " TO " + pod + "\n"
            // + "CONTAINERS: " + containerStr + "\n"
            + "ETD: " + this.parseUTCTime(this.shipment.etd) + "\n"
            + "ETA: " + this.parseUTCTime(this.shipment.eta) + "\n"
            + "ATD: " + this.parseUTCTime(this.shipment.atd) + "\n"

            + "<strong>Free Time at POD: " + "</strong>\n"
            + "Detention: " + this.agentDetail.detention + "days," + "\n"
            + "Demurrage: " + this.agentDetail.dumurrage + "days" + "\n"

            + "<strong>Destination Clearance: " + "</strong>\n"
            + "Normal Customs Clearance: " + normalCustomsClearance + "\n"
            + "DA must pre-pay duties and tax: " + prePayDutiesAndTax + "\n"
            + "Comments: " + this.agentDetail.normalComments + "\n"
            + "Taxes and duties to be billed to: " + this.agentDetail.taxesBillto + "\n"
            + "Customs clearance to be billed to: " + this.agentDetail.customsBillto + "\n"
            + "Fiscal-Customs Clearance: " + fiscalCustomsClearance + "\n"
            + "Comments: " + this.agentDetail.fiscalComments + "\n"
            + "T1-Customs Clearance: " + t1CustomsClearance + "\n"
            + "Comments: " + this.agentDetail.t1Comments + "\n"

            + "<strong>Destination Delivery: " + "</strong>\n"
            + "Destination Delivery: " + destinationDelivery + "\n"
            + "Transport Mode: " + this.agentDetail.transportMode + "\n"
            + "Destination delivery to be billed to: " + this.agentDetail.destinationDeliveryBillto + "\n"
            + "Destination address: " + this.agentDetail.destinationDeliveryComments + "\n"
            + "Agreed Cost: " + this.agentDetail.agreedCostDelivery + "\n"

            + "<strong>Destination Local Charges: " + "</strong>\n"
            + "Agreed Cost: " + this.agentDetail.agreedCost + "\n"
            + "Destination Local Charges to be Billed to: " + this.agentDetail.destinationBillto + "\n"

            + "<strong>Comments to agent: " + "</strong>\n"
            + "Comments: " + this.agentDetail.comments + "\n"


            + "\n" + "Kind regards" + "\n" + "Moov logistics";
          this.sendMail.templateContent = content;

        }
        this.preAlertFileList = []
        this.preAlertFileList = this.preAlertFileList.concat(this.carrierBillList)
        this.preAlertFileList = this.preAlertFileList.concat(this.houseBillList)
        this.preAlertFileList = this.preAlertFileList.concat(this.othersList)

        // if (this.agentDetail.fileIds != null) {
        //           console.log(this.agentDetail.fileIds)
        //   console.log(this.preAlertFileList)

        //   var fileIds = this.agentDetail.fileIds.split(",").map(parseFloat)
        //   console.log(fileIds)

        //   this.preAlertFileList = this.preAlertFileList.filter(item =>  fileIds.includes(item.id));
        // }
        console.log(this.preAlertFileList)


      },
      deleteDocumentOfPreAlert(row) {
        const id = row.id;
        this.preAlertFileList = this.preAlertFileList.filter(item => item.id !== row.id);
        console.log(this.preAlertFileList)
      },
      submitMailForm() {
        console.log(this.sendEmail)
        // console.log("11")
        // this.$refs["sendMailForm"].validate((valid) => {
        //   console.log("22")
        //   if (!valid) {
        //     return;
        //   }
        //   console.log("33")
        // });
        var fileIds = this.preAlertFileList.map(obj => obj.id);
        this.sendMail.fileIds = fileIds
        console.log(fileIds)

        console.log(this.sendMail)
        sendMail(this.sendMail).then(response => {
          this.sendMail.open = false;
          this.sendMail.toMail = "";
          this.$modal.msgSuccess("Success");
          this.agentDetail.templateContent = this.sendMail.templateContent
          this.agentDetail.templateTitle = this.sendMail.templateTitle
          this.agentDetail.fileIds = this.sendMail.fileIds.join(",")
          this.agentDetail.sendEmailTime = new Date().getTime()
          updateDestinationAgent(this.agentDetail).then(response => {
            this.getDestinationAgentByShipmentId();
          });

        });
      },

      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = 'Total';
            return;
          }
          if (column.property == 'productEnglishName' || column.property == 'hscode'  || column.property == 'hscode'
           || column.property == 'packages'
          ) {
            sums[index] = ' ';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += '';
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },
    totalAllBooked() {
      return this.spoItems.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(typeof currentValue.booked == 'undefined' ? 0 : currentValue.booked);
      }, 0)
    },

    totalAllGrossWeight() {
      return this.spoItems.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(typeof currentValue.bookedWeight == 'undefined' ? 0 : currentValue.bookedWeight);
      }, 0)
    },
    totalAllVolume() {
      return this.spoItems.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(typeof currentValue.bookedVolume == 'undefined' ? 0 : currentValue.bookedVolume);
      }, 0)
    },
    //传递 货物信息
    handleCargoInfo(spoList, spoIds) {
      this.$nextTick(() => {
        this.$refs?.shipmentCargoInfo?.active(spoList, spoIds)
      })
    },
    onModify() {
      this.modifyVisible = true
    },
    onModifyClose() {
      this.modifyVisible = false
      this.getShipLogList()
    },
    // 查询换船信息
    queryChangeVesselInfo() {
      this.changeVesselLoading = true;
        getChangeVesselInfo({ shipmentId: this.$route.query.id }) // 使用路由参数获取shipmentId
        .then(response => {
          // 先按id排序
          const sortedRecords = response.data.sort((a, b) => a.id - b.id);

          // 按batchId分组
          const groupedByBatch = sortedRecords.reduce((acc, record) => {
            if (!acc[record.batchId]) {
              acc[record.batchId] = [];
            }
            acc[record.batchId].push({
              id: record.id,
              batchId: record.batchId,
              changeTime: record.createTime,
              creatorName: record.creatorName,
              changeType: record.carrierRolling,
              changeReason: record.reason,
              // 船期信息字段
              originalPol: record.originalPol,
              originalPod: record.originalPod,
              originalEtd: record.originalEtd,
              originalEta: record.originalEta,
              originalVessel: record.originalVessel,
              originalVoyage: record.originalVoyage,
              originalService: record.originalService,
              newPol: record.newPol,
              newPod: record.newPod,
              newEtd: record.newEtd,
              newEta: record.newEta,
              newVessel: record.newVessel,
              newVoyage: record.newVoyage,
              newService: record.newService
            });
            return acc;
          }, {});

          // 转换为数组以便在模板中遍历
          this.changeVesselGroups = Object.values(groupedByBatch);
          console.log(11111111111,this.changeVesselGroups)

          this.showVesselChangeCard = true;
        })
        .catch(error => {
          this.$message.error("Failed to load vessel change information");
          console.error(error);
        })
        .finally(() => {
          this.changeVesselLoading = false;
        });
      },
    onBookingCancel() {
      this.dialogFormAccept = false
      this.form.bookingNum = this.shipment.shipmentBookingNumber
    }
    },
  };
</script>
<style lang="scss" scoped>


.el-loading-spinner {
  background-size: 100px 100px;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100%;
  position: relative;
}
 td.el-descriptions-item.el-descriptions-item__cell {
    text-align: center !important;
    vertical-align: middle !important;
}
.Red {
  color: #EA0000 !important;
}
.highlight {
  background-color: red;
  color: white;
}

/* 在全局或组件样式中添加 */
.status-popover-css {
  .el-table {
    border: none;

    &::before {
      height: 0;
    }

    td, th {
      border: none;
    }

    .el-table__row {
      &:after {
        display: none;
      }
    }
  }
}

.modern-card {
  margin: 20px 0;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.modern-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #f8fafc;
  border-bottom: 1px solid #f0f2f5;
}

/* 记录容器 */
.change-record {
  position: relative;
  padding: 0px 0 15px 0;
  border-bottom: 1px dashed #e5e7eb;
}

.change-record:last-child {
  border-bottom: none;
}

/* 时间戳样式 */
.change-timestamp {
  position: absolute;
  left: 0;
  top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date-text {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
  white-space: nowrap;
}

.record-index {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #3b82f6;
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 内容区域布局 */
.change-content-wrapper {
  margin-left: 50px;
  display: flex;
  align-items: stretch;
  gap: 24px;
}

/* 船期信息卡片 */
.vessel-info {
  flex: 1;
  padding: 16px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.original-info {
  border-left: 4px solid #94a3b8;
}

.new-info {
  border-left: 4px solid #10b981;
}

.info-title {
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
}

.info-title::before {
  content: '';
  width: 4px;
  height: 16px;
  margin-right: 8px;
  border-radius: 2px;
}

.original-info .info-title::before {
  background-color: #94a3b8;
}

.new-info .info-title::before {
  background-color: #10b981;
}

/* 信息网格布局 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.info-item {
  font-size: 13px;
}

.info-label {
  display: block;
  color: #64748b;
  margin-bottom: 4px;
  font-size: 12px;
}

.info-value {
  color: #1e293b;
  font-weight: 500;
}

/* 中间换船类型与原因区域 */
.change-middle-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 12px;
}

.change-type-indicator {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.vessel-type {
  background-color: #dbeafe;
  color: #2563eb;
}

.route-type {
  background-color: #fef3c7;
  color: #d97706;
}

.change-reason-card {
  max-width: 280px;
  padding: 16px;
  border-radius: 8px;
  background-color: #f8fafc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.reason-title {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.reason-content {
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
}

.change-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}


/* 多船期列表容器 */
.multi-vessel-list {
  gap: 12px; /* 船期间距 */
  margin-top: 8px;
}

/* 单船期项样式 */
.vessel-item {
  padding: 10px;
  border-radius: 6px;
  background-color: #fcfcfc;
  border: 1px solid #f0f0f0;
}

/* 紧凑信息网格（5列布局） */
.compact-grid {
  grid-template-columns: repeat(5, 1fr); /* 5列更紧凑 */
  gap: 8px; /* 减小内间距 */
}

/* 紧凑中间区域 */
.compact-middle {
  gap: 10px; /* 减小元素间距 */
  padding: 8px;
}

/* 紧凑化原因卡片 */
.compact-reason {
  padding: 10px; /* 减小内边距 */
  width: 200px; /* 限制宽度 */
  word-wrap: break-word;
  word-break: break-all;
}

.reason-title {
  font-size: 12px; /* 缩小标题 */
  margin-bottom: 4px;
}

.reason-content {
  font-size: 12px; /* 缩小内容 */
  line-height: 1.4;
}

/* 减小信息项尺寸 */
.info-item {
  font-size: 12px;
}

.info-label {
  font-size: 11px; /* 缩小标签 */
  margin-bottom: 2px;
}

/* 减小整体内边距 */
.change-records {
  padding: 12px; /* 原20px */
}

.vessel-info {
  padding: 12px; /* 原16px */
}

.info-title {
  font-size: 13px; /* 缩小标题 */
  margin-bottom: 8px;
}

/* 多船期容器样式 */
.multi-vessel-list {
  display: flex;
  flex-direction: column;
  gap: 8px; /* 减小船期间距 */
  max-height: 200px; /* 限制最大高度 */
  overflow-y: auto; /* 超出滚动 */
  padding-right: 5px;
}

/* 单船期项紧凑样式 */
.vessel-item {
  padding: 8px; /* 减小内边距 */
  border-radius: 4px;
  background-color: #fcfcfc;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}

/* 超紧凑信息网格 */
.compact-grid {
  grid-template-columns: repeat(5, 1fr);
  gap: 5px; /* 极小网格间距 */
}

/* 极小化信息项 */
.info-item {
  font-size: 11px;
}

.info-label {
  font-size: 10px; /* 缩小标签文字 */
  color: #888;
  margin-bottom: 1px;
}

.info-value {
  font-weight: 500;
  line-height: 1.3;
}


/* 减小内容区边距 */
.change-content-wrapper {
  gap: 15px; /* 减小中间区域间距 */
  margin-left: 45px; /* 缩短左侧时间戳距离 */
}

/* 船期卡片进一步压缩 */
.vessel-info {
  padding: 10px; /* 最小内边距 */
  flex: 1;
}

.info-title {
  font-size: 12px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
}

/* 滚动条美化（紧凑模式） */
.multi-vessel-list::-webkit-scrollbar {
  width: 4px;
}

.multi-vessel-list::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 2px;
}
.no-data {
    height: 100px;
}
.parties-item-css {
    white-space: pre-line !important;
    vertical-align: top !important;
}
.tab-title {
  margin: 0 16px 0 0;
  font-size: 12px;
  font-weight: bold;
}

.card-with-fixed-button {
  position: relative;
  padding-top: 40px; // 为顶部按钮留出空间

  .card-top-right-actions {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
  }
}
</style>
