<template>
  <div class="app-container" style="width:100%; margin: 0 auto">
    <h3 style="text-align: right" v-show="showTips">
      <p>
        {{ $t("booking.pleaseContact") }}
        <a
          style="border-bottom: 1px solid #00f; color: #090"
          v-bind:href="'mailto:' + 'tipsMail'"
        >
          {{ tipsMail }}</a
        >
      </p>
    </h3>
    <el-card class="pd-20">
    <el-form :model="form" ref="form" :show-message="false" label-width="140px">


      <el-descriptions style="box-shadow: none;" class="margin-top" title="" :column="4" size="mini" border>
    <el-descriptions-item>
      <template slot="label">
        Carrier
      </template>
      <el-form-item required  prop="carrier">
      <el-select :disabled="form.status==0" @change="changeCarrier" filterable v-model="form.carrier">
                <el-option
                  v-for="dict in getDictDatas(DICT_TYPE.CARRIER)"
                  :key="dict.value"
                  :label="dict.label+' ('+dict.value+')'"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">

        Contract Type
      </template>
      <el-form-item required  prop="contractType">
      <el-select :disabled="form.status==0" filterable v-model="form.contractType">
                <el-option
                  v-for="dict in getDictDatas(DICT_TYPE.CARRIAGE_CONTRACT)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
         </el-descriptions-item>
          <el-descriptions-item v-if="isSelectedContractPremium">
            <template slot="label">
              <span v-if="isSelectedContractPremium" style="color:red;">*</span>Reason of Premium
            </template>
            <el-form-item :rules="[{ required: true, message: 'Reason of Premium is required' }]"
              prop="reasonOfPremium">
              <el-select filterable v-model="form.reasonOfPremium">
                <el-option v-for="dict in getDictDatas(DICT_TYPE.Reason_Of_Premium)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>

      <template slot="label">

        CRA Number
      </template>
      <el-row :gutter="form.carrier=='MAEU'?20:0">
        <el-col :span="form.carrier=='MAEU'?12:24">
          <el-form-item
              required
              prop="contractNumber"
            >
      <el-select filterable allow-create v-model="form.contractNumber"  @change="remoteGetCraNum" placeholder="Input to select or Select">
                <el-option
                v-for="dict in craList"
                  :key="dict.contractNo"
                  :label="dict.contractNo"
                  :value="dict.contractNo"
                />
              </el-select>
              </el-form-item>
            </el-col>
              <el-col :span="12" v-if="form.carrier=='MAEU'">
                <el-form-item
              :required="form.carrier=='MAEU'"
              prop="specialAllocation"
            >
              <el-select  placeholder="Type" v-model="form.specialAllocation">
                <el-option label="Standard" value="Standard"></el-option>
                <el-option label="Floating" value="Floating"></el-option>
                <el-option label="Alwaysspace" value="Alwaysspace"></el-option>
                <el-option label="Addtional" value="Addtional"></el-option>
              </el-select>
              </el-form-item>
            </el-col>
            </el-row>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">

        Payment Term
      </template>
      <el-form-item required  prop="paymentTerm">
      <el-select :disabled="form.status==0" filterable v-model="form.paymentTerm">
                <el-option
                  v-for="dict in getDictDatas(DICT_TYPE.PAYMENT_TERM)"
                  :key="dict.value"
                  :label="dict.value"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
    </el-descriptions-item>

    <el-descriptions-item >
      <template slot="label">

        Place of Receipt
      </template>
      <el-form-item required  prop="pol" >
    <el-select @change="changePol" filterable v-model="form.pol">
                <el-option
                  v-for="(item, index) in craFlag
                    ? portOptions.filter((item) => {
                        return cra_pol.indexOf(item.code) > -1;
                      })
                    : portOptions"
                  :key="index + 'pol1'"
                  :label="item.name+' ('+item.code+')'"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">

                  Port of Loading
                </template>
                <el-form-item required prop="originPort" >
                  <el-select @change="changePort" v-model="form.originPort" filterable>
                    <el-option v-for="(item, index) in craFlag
                                  ? portOptions.filter((item) => {
                                      return cra_origin.indexOf(item.code) > -1;
                                    })
                                  : portOptions" :key="index + 'pol3'" :label="item.name+' ('+item.code+')'"
                      :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">

                  Port of discharge
                </template>
                <el-form-item required prop="destinationPort"
                 >
                  <el-select v-model="form.destinationPort" filterable>
                    <el-option v-for="(item, index) in craFlag
                                  ? portOptions.filter((item) => {
                                      return cra_disch.indexOf(item.code) > -1;
                                    })
                                  : portOptions" :key="index + 'pol4'" :label="item.name+' ('+item.code+')'"
                      :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item >
      <template slot="label">

        Final Destination
      </template>
      <el-form-item required  prop="pod" >
      <el-select @change="changePod" filterable v-model="form.pod">
                <el-option
                  v-for="(item, index) in craFlag
                    ? portOptions.filter((item) => {
                        return cra_pod.indexOf(item.code) > -1;
                      })
                    : portOptions"
                  :key="index + 'pol2'"
                  :label="item.name+' ('+item.code+')'"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
              </el-descriptions-item>





    <el-descriptions-item >
      <template slot="label">

        Agreement Party
      </template>
      <el-form-item :required="form.carrier=='TSHG'"  prop="agreementParty">
      <el-select
                clearable
                v-model="form.agreementParty"
                filterable
              >
                <el-option
                  v-for="item in parties['Agreement Party']"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item v-if="!this.$auth.hasPermi('system:allocation:year-week:show')">
                <template slot="label">Allocation Week</template>
                <el-form-item prop="allocationWeek">
                  <el-select clearable v-model="form.allocationWeek" filterable>
                    <el-option v-for="(item,index_a) in allocationWeekList" :key="index_a" :value="item" :label="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item v-if="this.$auth.hasPermi('system:allocation:year-week:show')">
                <template slot="label">
                  Allocation Year
                </template>
                <el-form-item  prop="allocationYear">
                  <el-select v-model="form.allocationYear" placeholder="Select Year" @change="onYearChange" clearable>
                    <el-option v-for="year in availableYears" :key="year" :label="year" :value="year" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item v-if="this.$auth.hasPermi('system:allocation:year-week:show')">
                <template slot="label">
                 Allocation Week
                </template>
                <el-form-item  prop="allocationWeek" >
                  <el-select v-model="form.allocationWeek" placeholder="Select Week" clearable>
                    <el-option v-for="week in availableWeeks" :key="week" :label="week" :value="week" />
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

            <el-descriptions-item  v-if="$auth.hasPermi('shipment:create-notpb')&&showCustomer">
      <template slot="label">
        Customer
      </template>
      <el-form-item  :required="$auth.hasPermi('shipment:create-notpb')" prop="customer">
      <el-select
                clearable
                v-model="form.customer"
                filterable
              >
                <el-option
                  v-for="item in parties['Customer']"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
              </el-descriptions-item>

            <el-descriptions-item >
              <template slot="label">

                Order Numbers
              </template>

              <el-form-item  prop="poNumbers">
              <el-input v-model="form.poNumbers" type="textarea" rows="3" />
            </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item >
              <template slot="label">

                Remark
              </template>

              <el-form-item  prop="remark">
              <el-input v-model="form.remark" type="textarea" rows="3" />
            </el-form-item>
            </el-descriptions-item>



  </el-descriptions>

  <div style="box-shadow: none;border:1px solid #ddd!important;border-radius: 0px!important;margin: 15px 0px;padding: 10px 15px;">
  <el-row :gutter="20" style="padding-bottom: 10px;  padding-top: 20px;" >
    <el-col :span="8">
      <div style="text-indent: 10px;margin-bottom:8px">
        <b style="font-size: 15px">Shipper</b>
      </div>
      <el-descriptions style="padding-bottom: 5px;    box-shadow: none;" :colon="false" class="margin-top parties-desc" title=""  :column="1" size="mini" >
        <el-descriptions-item  >
          <template slot="label">
            <span style="width: 64px; color: #666; ">Name</span>
          </template>
          <el-form-item required prop="shipper" style=" width: 100% !important;">
            <el-select
              filterable
              clearable
              v-model="form.shipper"
            >
              <el-option
                v-for="item in parties['Shipper']"
                :key="item.id+'shipper'"
                :value="item.id"
                :label="item.name"
              >
                        <el-tooltip placement="top" :open-delay="100" popper-class="company-full-width-tooltip-shipment-update">
                          <div slot="content">
                            <p>Address: {{ item.address }}</p>
                            <p>Phone: {{ item.phone }}</p>
                            <p>Fax: {{ item.fax }}</p>
                            <p>Email: {{ item.email }}</p>
                            <p>Enterprise: {{ item.companyUsci }}</p>
                          </div>
                          <span class="company-option-with-tooltip">{{ item.name }}</span>
                        </el-tooltip>
              </el-option>
            </el-select>
          </el-form-item>
        </el-descriptions-item>



        <el-descriptions-item>
          <template slot="label">
            <span style="width: 64px; color: #666; ">Address</span>
          </template>
          <div style="padding:6.5px 0px;">
            {{getShipper().address}}
          </div>
        </el-descriptions-item >
        <el-descriptions-item>
          <template slot="label">
            <span style="width: 64px; color: #666; ">Phone</span>
          </template>
          <div style="padding:6.5px 0px">
            {{getShipper().phone}}
          </div>
        </el-descriptions-item >
        <el-descriptions-item>
          <template slot="label">
            <span style="width: 64px; color: #666; ">Fax</span>
          </template>
          <div style="padding:6.5px 0px">
            {{getShipper().fax}}
          </div>
        </el-descriptions-item >
        <el-descriptions-item>
          <template slot="label">
            <span style="width: 64px; color: #666; ">Email</span>
          </template>
          <div style="padding:6.5px 0px">
            {{getShipper().email}}
          </div>
        </el-descriptions-item >
        <el-descriptions-item>
          <template slot="label">
            <span style="width: 64px; color: #666; ">Enterprise</span>
          </template>
          <div style="padding:6.5px 0px">
            {{getShipper().companyUsci}}
          </div>
        </el-descriptions-item >

      </el-descriptions>
    </el-col>
    <el-col :span="8">
      <div style="text-indent: 10px;margin-bottom:8px">
        <b style="font-size: 15px">Consignee</b>
      </div>
      <el-descriptions style="padding-bottom: 5px;    box-shadow: none;" :colon="false" class="margin-top parties-desc" title=""  :column="1" size="mini" >

        <el-descriptions-item >
          <template slot="label">
            <span style="width: 64px; color: #666; ">Name</span>
          </template>
          <el-form-item required prop="consignee" style=" width: 100% !important;">
            <el-select
              remote
              clearable
              filterable
              v-model="form.consignee"
            >
              <el-option
                v-for="item in parties['Consignee']"
                :key="item.id+'cos'"
                :value="item.id"
                :label="item.name"
              >
                        <el-tooltip placement="top" :open-delay="100" popper-class="company-full-width-tooltip-shipment-update">
                          <div slot="content">
                            <p>Address: {{ item.address }}</p>
                            <p>Phone: {{ item.phone }}</p>
                            <p>Fax: {{ item.fax }}</p>
                            <p>Email: {{ item.email }}</p>
                            <p>Enterprise: {{ item.companyUsci }}</p>
                          </div>
                          <span class="company-option-with-tooltip">{{ item.name }}</span>
                        </el-tooltip>
              </el-option>
            </el-select>
          </el-form-item>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <span style="width: 64px; color: #666; ">Address</span>
          </template>
          <div style="padding:6.5px 0px">
            {{getConsignee().address}}
          </div>
        </el-descriptions-item >

        <el-descriptions-item>
          <template slot="label">
            <span style="width: 64px; color: #666; ">Phone</span>
          </template>
          <div style="padding:6.5px 0px">
            {{getConsignee().phone}}
          </div>
        </el-descriptions-item >

        <el-descriptions-item>
          <template slot="label">
            <span style="width: 64px; color: #666; ">Fax</span>
          </template>
          <div style="padding:6.5px 0px">
            {{getConsignee().fax}}
          </div>
        </el-descriptions-item >

        <el-descriptions-item>
          <template slot="label">
            <span style="width: 64px; color: #666; ">Email</span>
          </template>
          <div style="padding:6.5px 0px">
            {{getConsignee().email}}
          </div>
        </el-descriptions-item >

        <el-descriptions-item>
          <template slot="label">
            <span style="width: 64px; color: #666; ">Enterprise</span>
          </template>
          <div style="padding:6.5px 0px">
            {{getConsignee().companyUsci}}
          </div>
        </el-descriptions-item >
      </el-descriptions>

    </el-col>
    <el-col :span="8">
      <div style="text-indent: 10px;margin-bottom:8px">
        <b style="font-size: 15px">Notify Party</b>
      </div>
      <el-descriptions style="padding-bottom: 5px;    box-shadow: none;" :colon="false" class="margin-top parties-desc" title=""  :column="1" size="mini" >
        <el-descriptions-item >
          <template slot="label">
            <span style="width: 64px; color: #666;color: #666; ">Name</span>
          </template>
          <el-form-item required prop="notifyParty" style=" width: 100% !important;">
            <el-select
              remote
              clearable
              filterable
              v-model="form.notifyParty"
            >
              <el-option
                v-for="item in parties['Notify Party']"
                :key="item.id+'np'"
                :value="item.id"
                :label="item.name"
              >
                        <el-tooltip placement="top" :open-delay="100" popper-class="company-full-width-tooltip-shipment-update">
                          <div slot="content">
                            <p>Address: {{ item.address }}</p>
                            <p>Phone: {{ item.phone }}</p>
                            <p>Fax: {{ item.fax }}</p>
                            <p>Email: {{ item.email }}</p>
                            <p>Enterprise: {{ item.companyUsci }}</p>
                          </div>
                          <span class="company-option-with-tooltip">{{ item.name }}</span>
                        </el-tooltip>
              </el-option>
            </el-select>
          </el-form-item>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <span style="width: 64px; color: #666; ">Address</span>
          </template>
          <div style="padding:6.5px 0px">
            {{getNotifyParty().address}}
          </div>
        </el-descriptions-item >
        <el-descriptions-item>
          <template slot="label">
            <span style="width: 64px; color: #666; ">Phone</span>
          </template>
          <div style="padding:6.5px 0px">
            {{getNotifyParty().phone}}
          </div>
        </el-descriptions-item >
        <el-descriptions-item>
          <template slot="label">
            <span style="width: 64px; color: #666; ">Fax</span>
          </template>
          <div style="padding:6.5px 0px">
            {{getNotifyParty().fax}}
          </div>
        </el-descriptions-item >

        <el-descriptions-item>
          <template slot="label">
            <span style="width: 64px; color: #666; ">Email</span>
          </template>
          <div style="padding:6.5px 0px">
            {{getNotifyParty().email}}
          </div>
        </el-descriptions-item >

        <el-descriptions-item>
          <template slot="label">
            <span style="width: 64px; color: #666; ">Enterprise</span>
          </template>
          <div style="padding:6.5px 0px">
            {{getNotifyParty().companyUsci}}
          </div>
        </el-descriptions-item >

      </el-descriptions>

    </el-col>
</el-row>

  </div>
  <div style="box-shadow: none;border:1px solid #ddd!important;border-radius: 0px!important;margin: 15px 0px;padding: 10px 15px;">
  <el-descriptions title="Booking Contact Info" style="box-shadow: none;" :column="3" border>
  <el-descriptions-item>
      <template slot="label">

        {{ $t('booking.name') }}
      </template>
      <el-form-item required  prop="name">
            <el-input :disabled="form.status==0" v-model="form.name" />
          </el-form-item>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">

        {{ $t('booking.phone') }}
      </template>
      <el-form-item required  prop="phone">
            <el-input :disabled="form.status==0" v-model="form.phone" @blur="validatePhoneNumber" />
          </el-form-item>
    </el-descriptions-item>

    <el-descriptions-item>
      <template slot="label">

        {{ $t('booking.email') }}
      </template>
      <el-form-item required  prop="email" type="email">
            <el-input :disabled="form.status==0" v-model="form.email" @blur="validateEmailAddress" />
          </el-form-item>
    </el-descriptions-item>
  </el-descriptions>
  </div>
  <div style="box-shadow: none;border:1px solid #ddd!important;border-radius: 0px!important;margin: 15px 0px;padding: 10px 15px;">
         <!--增加 货物信息-->
         <div><shipment-cargo-info ref="shipmentCargoInfo" @so-product-list="handleSoProductList"/></div>


            <!-- <div v-show="spoItems&&spoItems.length>0">
              <el-table style="margin-bottom:10px" border v-if="spoItems&&spoItems.length > 0" :data="spoItems">
                <el-table-column prop="soRef" label="SO Number">
                  <template v-slot="scope">
                    <span>{{ scope.row.soRef }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="orderId" label="Order Number">
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
                </el-table-column>
                <el-table-column prop="productId" label="Product Name">
                  <template v-slot="scope">
                    <span>{{
                      scope.row.productName
                      }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="requested" :label="'Ordered (Cartons)'">
                  <template v-slot="scope">
                    {{ scope.row.outerQty }}
                  </template>
                </el-table-column>
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

              </el-table> -->
              <!--  加汇总和带入按钮 -->

              <!-- <div style="text-align: right;margin-top: 8px; ">
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
            </div> -->





    <SOMainTable  :tableData="form.soHeaderVOs" ref="table" v-if="form.soHeaderVOs!=null&&form.soHeaderVOs.length>0" :tableHeight="null"></SOMainTable>
    <br/>
    <el-table style="margin-top: 15px;margin-bottom: 10px;" v-if="itemTableData.length > 0" :data="itemTableData">
          <el-table-column prop="orderId" label="Order Number">
            <template v-slot="scope">
              <span>{{ orderMap[scope.row.orderId] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="productId" :label="$t('booking.product')">
            <template v-slot="scope">
                <span>{{
                  productMapForBook[scope.row.productId]
                  ? productMapForBook[scope.row.productId].code
                  : ""
                }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="productId" :label="$t('booking.product')">
            <template v-slot="scope">
                <span>{{
                  productMapForBook[scope.row.productId]
                  ? productMapForBook[scope.row.productId].name
                  : ""
                }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cargoReadyBy" :label="$t('booking.cargoReadyBy')" width="180">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.cargoReadyBy) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="mustArriveBy" :label="$t('booking.mustArriveBy')">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.mustArriveBy) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="requested" :label="$t('booking.requested')">
            <template v-slot="scope">
              {{ scope.row.requested }}{{ scope.row.requestUnit }}
            </template>
          </el-table-column>
          <el-table-column prop="bookedQty" :label="$t('booking.booked')">
            <template v-slot="scope">
              {{ scope.row.bookedQty }}{{ scope.row.bookedUnit }}
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-button @click="addProduct" size="mini" type="primary">{{
            $t("booking.addProduct")
          }}</el-button>
          <el-button v-show="receiveSOProductList && receiveSOProductList.length > 0" @click="getFromSOProductData" size="mini" type="primary">Get From Shipper Booking</el-button>
        </el-row>
        <el-descriptions
        border
          style="box-shadow: none;"
          :colon="false"
          direction="vertical"
          v-for="(item, i) in form.productData"
          :key="'product' + i"
          class="margin-top"
          title=""
          :column="6"
        >
          <template slot="extra">
            <el-button
              v-if="i != 0"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(i)"
              >{{ $t("search.delete") }}</el-button
            >
          </template>
          <el-descriptions-item :label="$t('booking.productEnglishName')">
            <el-input
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 2 }"
              v-model="item.productEnglishName"
            />
          </el-descriptions-item>
          <el-descriptions-item :label="$t('booking.hsCode')">
            <!-- <el-input v-model="item.hscode" /> -->
            <el-select
              filterable
              clearable
              remote
              v-model="item.hscode"
              :remote-method="remoteGetHsCode"
              @clear="selectClear"
            >
              <el-option
                v-for="dict in hsCodeList"
                :key="dict.id"
                :label="dict.hsCode"
                :value="dict.hsCode"
              />
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item label="Number Of Packages"
            ><el-input-number v-model="item.numberOfPackages"  @blur="item.numberOfPackages = $event.target.value.trim()"  :controls="false" :precision="0"
          /></el-descriptions-item>
          <el-descriptions-item label="Packages">
            <el-select filterable v-model="item.packages" placeholder="">
              <el-option
                v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item label="Gross Weight(KG)"
            ><el-input-number v-model="item.grossWeight"    @blur="item.grossWeight = $event.target.value.trim()"  :controls="false" :precision="3"
          /></el-descriptions-item>
          <el-descriptions-item label="Volume(CBM)"
            ><el-input-number v-model="item.volume"   @blur="item.volume = $event.target.value.trim()"   :controls="false" :precision="3"
          /></el-descriptions-item>


          <el-descriptions-item label="DG">
            <el-switch
                  @change="changeDG(item)"
                  :active-value="1"
                  :inactive-value="0"
                  v-model="item.dg"
                  active-text="Yes"
                  inactive-text="No"
                >
                </el-switch>
          </el-descriptions-item>
          <el-descriptions-item v-if="item.dg == 0" label="Batteries">
            <el-radio-group @input="changeBatteries(item)" v-model="item.batteries">
                  <el-radio :label="2" border>Has batteries</el-radio>
                  <el-radio :label="3" border>No batteries</el-radio>
                </el-radio-group>
          </el-descriptions-item>

          <el-descriptions-item :label="dict.label"
                v-for="dict in getDictDatas(DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS)"
                :key="'d' + dict.value"
                v-if="item.dg == 1"
              >
                <el-input
                  v-model="item.hazardousMaterials[dict.value]"
                />
              </el-descriptions-item>

              <el-descriptions-item  v-if="item.dg == 0" label="">
                </el-descriptions-item>
                <el-descriptions-item v-if="item.dg == 0" label="">
                </el-descriptions-item>
                <el-descriptions-item v-if="item.dg == 0" label="">
                </el-descriptions-item>
                <el-descriptions-item v-if="item.dg == 0" label="">
                </el-descriptions-item>

          <el-descriptions-item label="">

            <el-row
              :gutter="20"
              style="color: #004F7C; font-weight: 700 !important; margin-bottom: 5px"
            >
              <!-- <el-col :span="8"> RefNo&Numbers</el-col> -->
              <el-col :span="8"> Remark</el-col>
              <el-col :span="6">Files</el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-input type="textarea" v-model="item.mark" />
              </el-col>
              <el-col :span="6">
                <el-upload
                  class="upload-demo"
                  :ref="'upload' + i"
                  multiple
                  :action="url + '/admin-api/shipment/product/upload'"
                  :data="item.uploadData"
                  :before-remove="(file, fileList) => handleRemove(file, fileList, i)"
                  :headers="uploadHeaders"
                  :show-file-list="true"
                  :on-preview="handlePictureCardPreview"
                  v-bind:file-list="item.files"
                  :auto-upload="false"
                  :on-change="(file, files) => handleFileChangeThen(file, files, () => {item.files = files}, () => {item.files = [];item.uploadData = {}})"
                >
                  <el-button slot="trigger" type="primary">{{
                    $t("booking.browse")
                  }}</el-button>
                  <div slot="tip" class="el-upload__tip"></div>
                </el-upload>
              </el-col>
            </el-row>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div style="box-shadow: none;border:1px solid #ddd!important;border-radius: 0px!important;margin: 15px 0px;padding: 10px 15px;">
      <el-row>
        <el-button @click="addContainers" size="mini" type="primary">
          <i class="el-icon-plus"></i>{{ $t("booking.addContainers") }}
        </el-button>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px">
        <el-col :span="2">
          <font color="#FF0000">*</font>{{ $t("booking.containerType") }}
        </el-col>
        <el-col :span="2">
          <font color="#FF0000">*</font>{{ $t("booking.numberOfContainers") }}
        </el-col>
        <el-col :span="2">
          {{ flag ? "Ventilation(cbm/hour)" : "" }}
        </el-col>
        <el-col :span="2">
          <font color="#FF0000" v-show="flag">*</font
          >{{ flag ? "Temperature(°C)" : "" }}
        </el-col>
        <el-col :span="2">
          <font color="#FF0000" v-show="flag"></font
          >{{ flag ? "Humidity(%)" : "" }}
        </el-col>
        <el-col :span="2">
          <font color="#FF0000" v-show="flag"></font
          >{{ flag ? "O2(%)" : "" }}
        </el-col>
        <el-col :span="2">
          <font color="#FF0000" v-show="flag"></font
          >{{ flag ? "CO2(%)" : "" }}
        </el-col>
        <el-col :span="2">
          <font color="#FF0000" v-show="flag"></font
          >{{ flag ? "Drains" : "" }}
        </el-col>
        <el-col :span="2"> <font color="#FF0000">*</font>SOC </el-col>
      </el-row>


      <div style="margin-bottom: 5px" v-for="(item, i) in form.containers" :key="i"
           class="shipmentRouters-css">
        <el-row :gutter="20">
          <el-col :span="2">
            <el-form-item required :prop="'containers.' + i + '.containerType'">
              <el-select
                filterable
                v-model="item.containerType"
                @change="handleOptionChange(item.containerType)"
              >
                <el-option
                  v-for="item in craFlag
                    ? containerOptions.filter((item) => {
                        return cra_contaier_type.indexOf(item.type) > -1;
                      })
                    : containerOptions"
                  :label="item.type"
                  :value="item.type"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item required :prop="'containers.' + i + '.numbers'">
              <el-input-number :controls="false" :precision="0" v-model="item.numbers" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item v-show="
                item.containerType &&
                containerOptions.find((obj) => obj.type == item.containerType)
                  ?.isReeferContainer == 'Yes'
              "
              >

            <el-input
              v-model="item.ventClosedOrNot"
            />
          </el-form-item>
            <span
              v-show="
                (item.containerType &&
                  containerOptions.find((obj) => obj.type == item.containerType)
                    ?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.containerType && flag)
              "
              >&nbsp;</span
            >
          </el-col>
          <el-col :span="2">
            <el-form-item v-if="
                item.containerType &&
                containerOptions.find((obj) => obj.type == item.containerType)
                  ?.isReeferContainer == 'Yes'
              "
              :required="
              item.containerType &&
                containerOptions.find((obj) => obj.type == item.containerType)
                  ?.isReeferContainer == 'Yes'" :prop="'containers.' + i + '.requireTemperature'">
            <el-input
              v-model="item.requireTemperature"
            />
            </el-form-item>
            <span
              v-show="
                (item.containerType &&
                  containerOptions.find((obj) => obj.type == item.containerType)
                    ?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.containerType && flag)
              "
              >&nbsp;</span
            >
          </el-col>
          <el-col :span="2">
            <el-form-item v-show="
                item.containerType &&
                containerOptions.find((obj) => obj.type == item.containerType)
                  ?.isReeferContainer == 'Yes'
              ">
            <el-input
              v-model="item.humidity"
            />
            </el-form-item>
            <span
              v-show="
                (item.containerType &&
                  containerOptions.find((obj) => obj.type == item.containerType)
                    ?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.containerType && flag)
              "
              >&nbsp;</span
            >
          </el-col>

          <el-col :span="2">
            <el-form-item v-show="
                item.containerType &&
                containerOptions.find((obj) => obj.type == item.containerType)
                  ?.isReeferContainer == 'Yes'
              ">
            <el-input
              v-model="item.o2"
            />
            </el-form-item>
            <span
              v-show="
                (item.containerType &&
                  containerOptions.find((obj) => obj.type == item.containerType)
                    ?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.containerType && flag)
              "
              >&nbsp;</span
            >
          </el-col>

          <el-col :span="2">
            <el-form-item v-show="
                item.containerType &&
                containerOptions.find((obj) => obj.type == item.containerType)
                  ?.isReeferContainer == 'Yes'
              ">
            <el-input
              v-model="item.co2"
            />
            </el-form-item>
            <span
              v-show="
                (item.containerType &&
                  containerOptions.find((obj) => obj.type == item.containerType)
                    ?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.containerType && flag)
              "
              >&nbsp;</span
            >
          </el-col>

          <el-col :span="2">
            <el-form-item v-show="
                item.containerType &&
                containerOptions.find((obj) => obj.type == item.containerType)
                  ?.isReeferContainer == 'Yes'
              ">
              <el-select v-model="item.drains">
    <el-option
      label="Open"
      value="Open">
    </el-option>
    <el-option
      label="Close"
      value="Close">
    </el-option>
  </el-select>

            </el-form-item>
            <span
              v-show="
                (item.containerType &&
                  containerOptions.find((obj) => obj.type == item.containerType)
                    ?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.containerType && flag)
              "
              >&nbsp;</span
            >
          </el-col>

          <el-col :span="2">
            <el-switch v-model="item.soc" active-text="Yes" inactive-text="No">
            </el-switch>
          </el-col>
          <el-col :span="2">
            <el-button
              v-if="i != 0"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDeleteContainer(i)"
              >{{ $t("search.delete") }}</el-button
            ></el-col
          >
        </el-row>
      </div>
    </div>

    <el-dialog :visible.sync="shippingScheduleVisable" title="Shipping Schedule" width="80%"   >

<el-row :gutter="20">
  <el-col :span="6">
    <el-date-picker placeholder="ETD From" v-model="searchSchedule.from"/>
  </el-col>
  <el-col :span="6">
    <el-date-picker placeholder="ETD To" v-model="searchSchedule.to"/>
  </el-col>
              <el-col :span="6">
              <el-input placeholder="Service" v-model="searchSchedule.service"></el-input>
            </el-col>
  <el-col :span="4" >
    <el-button @click="queryShippingSchedule" type="primary">Search<i class="el-icon-search el-icon--right" ></i></el-button>
  </el-col>
</el-row>
<el-table v-loading="shippingScheduleLoading"  height="600px" :data="shippingScheduleData" >

  <el-table-column sortable="custom"  width="15px" type="expand" >
            <template slot-scope="scope">
              <!-- none tshg -->
              <div  v-if="scope.row.carrier != 'TSHG'" style="padding: 0px 40px;">
                <el-empty v-if="scope.row.tshgList.length==0">
                </el-empty>
                <div style="padding-top: 10px;">
                  <div style="" class="ptp-results__transport-plan--deadline mds-text--small-normal">
                            <div ><div class="vessel-title">Departure</div><div class="vessel-title">{{ scope.row.polTerminal }}</div></div>
                            <div ><div class="vessel-title">Arrival</div><div class="vessel-title">{{ scope.row.podTerminal }}</div></div>
                            <div ><div class="vessel-title">SI Document</div><div class="vessel-title">{{ scope.row.siCutoff==null?"-":parseTimeToZ1(scope.row.siCutoff) }}</div></div>
                            <div ><div class="vessel-title">VGM</div><div class="vessel-title">{{ scope.row.vgmCutoff==null?"-":parseTimeToZ1(scope.row.vgmCutoff) }}</div></div>
                            <div ><div class="vessel-title">Inland Cutoff</div><div class="vessel-title">{{ scope.row.inlandCutoff==null?"-":parseTimeToZ1(scope.row.inlandCutoff) }}</div></div>
                        </div>
                  <el-row v-for="(item,index) in scope.row.tshgList" >
                    <div>
                      <div style="float: left;">

                        <div v-show="index==0" style="width: 300px;font-size: 14px;line-height: 20px;font-weight: bold;text-align: right;" >{{ scope.row.pol }}</div>
                        <div v-show="index==0" style="width: 300px;font-size: 14px;line-height: 20px;text-align: right;" >{{ scope.row.polTerminal }}</div>
                        <div v-show="index==scope.row.tshgList.length-1" style="width: 300px;font-size: 14px;line-height: 20px;font-weight: bold;text-align: right;" >{{ scope.row.pod }}</div>
                        <div v-show="index==scope.row.tshgList.length-1" style="width: 300px;font-size: 14px;line-height: 20px;text-align: right;" >{{ scope.row.podTerminal }}</div>

                        <div v-show="index!=0&&index!=scope.row.tshgList.length-1" style="width: 300px;font-size: 14px;line-height: 20px;font-weight: bold;text-align: right;" >{{ item.portCode }}</div>
                        <div v-show="index!=0&&index!=scope.row.tshgList.length-1" style="width: 300px;font-size: 14px;line-height: 20px;text-align: right;" >{{ item.port }}</div>
                        <div v-if="item.barge!='Other'" style="font-size: 14px;line-height: 20px;text-align: right;" > {{ item.barge }}</div>
                        <!-- Transport Mode: -->

                      </div>
                      <div style="float: left;">
                        <span v-show="item.barge=='Truck'" part="icon-wrapper" class="mc-icon  size-24 " style="fill:#141414;"><svg part="icon" id="mi-truck-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5.96 2.375A1 1 0 0 1 6.74 2h10.52a1 1 0 0 1 .78.375l1.74 2.176a1 1 0 0 1 .22.624V21a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2H8v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.175a1 1 0 0 1 .22-.624l1.74-2.176zM7 19H5v2h2v-2zm-2-1h14v-7H5v7zm0-8h14V5.175L17.26 3H6.74L5 5.175V10zm14 9h-2v2h2v-2zM7 14h3v1H7v-1zm7 0h3v1h-3v-1z"></path></svg></span>
                        <span v-show="item.barge=='Other'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;"><svg part="icon" id="mi-pin" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 9c0-3.772 3.13-7 7-7s7 3.228 7 7c0 2.61-1.17 5.488-2.408 7.817a38.15 38.15 0 0 1-3.046 4.793.983.983 0 0 1-.789.39h-1.514a.983.983 0 0 1-.789-.39c-.444-.59-1.8-2.45-3.046-4.793C6.17 14.487 5 11.61 5 9zm7-6C8.69 3 6 5.772 6 9c0 2.355 1.07 5.052 2.291 7.347A37.174 37.174 0 0 0 11.247 21h1.506a37.169 37.169 0 0 0 2.956-4.653C16.929 14.052 18 11.355 18 9c0-3.228-2.69-6-6-6zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"></path></svg></span>
                        <span v-show="item.barge=='Ocean'||item.barge=='Barge'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;"><svg part="icon" id="mi-vessel-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4h3a1 1 0 0 1 1 1v5.473l2.594.865a1 1 0 0 1 .564 1.423l-2.793 5.187A2 2 0 0 1 16.605 22h-9.21a2 2 0 0 1-1.76-1.052L2.842 15.76a1 1 0 0 1 .564-1.422L6 13.473V8a1 1 0 0 1 1-1h3V3zm1 4h2V3h-2v4zm-4 6.14l4.684-1.562a.999.999 0 0 1 .632 0L17 13.14V8H7v5.14zm5-.613l-8.278 2.76 2.793 5.187a1 1 0 0 0 .88.526h9.21a1 1 0 0 0 .88-.526l2.793-5.188L12 12.527z"></path></svg></span>
                        <!-- <div v-show="index!=scope.row.tshgList.length-1&&!(item.vessel!=null&&item.barge=='Other')" style="border-left: 4px dotted #dbdbdb; height: 40px;margin: 20px;"></div> -->
                        <div v-show="index!=scope.row.tshgList.length-1" style="border-left: 4px solid #dbdbdb; height: 40px;margin: 20px;"></div>
                      </div>
                      <div style="float: left;">
                        <div v-show="index==0" style="font-size: 14px;line-height: 20px;" >Departure</div>
                        <div v-show="index==scope.row.tshgList.length-1" style="font-size: 14px;line-height: 20px;" >Arrival</div>
                        <div v-show="index!=0&&index!=scope.row.tshgList.length-1" style="font-size: 14px;line-height: 20px;" >{{ item.event }}</div>

                        <div v-show="index==0" style="font-size: 14px;line-height: 20px;" >{{ parseTimeToZ1(scope.row.departureDate) }}</div>
                        <div v-show="index==scope.row.tshgList.length-1" style="font-size: 14px;line-height: 20px;" >{{ parseTimeToZ1(scope.row.arrivalDate) }}</div>
                        <div v-show="item.barge=='Ocean'" style="" class="ptp-results__transport-plan--vessel mds-text--small-normal">
                            <div ><div class="vessel-title">Vessel</div><div class="vessel-title">{{ item.barge=='Barge'?"Barge":item.vessel }}</div></div>
                            <div ><div class="vessel-title">Voyage/Bound</div><div class="vessel-title">{{ item.voyage==null?'-':item.voyage }}</div></div>
                            <div ><div class="vessel-title">Service</div><div class="vessel-title">{{ item.routeCode==null?'-':item.routeCode }}</div></div>

                        </div>
                      </div>
                    </div>
                  </el-row>

                  <el-row>
                    <div>


                  </div>
                  </el-row>

                </div>

            </div>
            <!-- tshg -->
            <div  v-if="scope.row.carrier == 'TSHG'" style="padding: 0px 40px;">
                <el-empty v-if="scope.row.tshgList.length==0">
                </el-empty>
                <div style="padding-top: 10px;">
                  <div style="" class="ptp-results__transport-plan--deadline mds-text--small-normal">
                            <div ><div class="vessel-title">Departure</div><div class="vessel-title">{{ scope.row.polName }}</div></div>
                            <div ><div class="vessel-title">Arrival</div><div class="vessel-title">{{ scope.row.podName }}</div></div>
                            <div ><div class="vessel-title">Container Gate-In</div><div class="vessel-title">{{ scope.row.containerGateIn==null?"-":parseTimeToZ1(scope.row.containerGateIn) }}</div></div>
                            <div ><div class="vessel-title">SI Document</div><div class="vessel-title">{{ scope.row.siDoc==null?"-":parseTimeToZ1(scope.row.siDoc) }}</div></div>
                            <div ><div class="vessel-title">VGM</div><div class="vessel-title">{{ scope.row.vgm==null?"-":parseTimeToZ1(scope.row.vgm) }}</div></div>
                        </div>
                  <el-row v-for="(item,index) in scope.row.tshgList" >
                    <div>
                      <div style="float: left;">
                        <div style="width: 300px;font-size: 14px;line-height: 20px;font-weight: bold;text-align: right;" >{{ item.portCode }}</div>
                        <div style="width: 300px;font-size: 14px;line-height: 20px;text-align: right;" >{{ item.port }}</div>
                        <div v-if="item.barge!='Other'" style="font-size: 14px;line-height: 20px;text-align: right;" > {{ item.barge }}</div>
                        <!-- Transport Mode: -->

                      </div>
                      <div style="float: left;">
                        <span v-show="item.barge=='Truck'" part="icon-wrapper" class="mc-icon  size-24 " style="fill:#141414;"><svg part="icon" id="mi-truck-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5.96 2.375A1 1 0 0 1 6.74 2h10.52a1 1 0 0 1 .78.375l1.74 2.176a1 1 0 0 1 .22.624V21a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2H8v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.175a1 1 0 0 1 .22-.624l1.74-2.176zM7 19H5v2h2v-2zm-2-1h14v-7H5v7zm0-8h14V5.175L17.26 3H6.74L5 5.175V10zm14 9h-2v2h2v-2zM7 14h3v1H7v-1zm7 0h3v1h-3v-1z"></path></svg></span>
                        <span v-show="item.barge=='Other'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;"><svg part="icon" id="mi-pin" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 9c0-3.772 3.13-7 7-7s7 3.228 7 7c0 2.61-1.17 5.488-2.408 7.817a38.15 38.15 0 0 1-3.046 4.793.983.983 0 0 1-.789.39h-1.514a.983.983 0 0 1-.789-.39c-.444-.59-1.8-2.45-3.046-4.793C6.17 14.487 5 11.61 5 9zm7-6C8.69 3 6 5.772 6 9c0 2.355 1.07 5.052 2.291 7.347A37.174 37.174 0 0 0 11.247 21h1.506a37.169 37.169 0 0 0 2.956-4.653C16.929 14.052 18 11.355 18 9c0-3.228-2.69-6-6-6zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"></path></svg></span>
                        <span v-show="item.barge=='Ocean'||item.barge=='Barge'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;"><svg part="icon" id="mi-vessel-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4h3a1 1 0 0 1 1 1v5.473l2.594.865a1 1 0 0 1 .564 1.423l-2.793 5.187A2 2 0 0 1 16.605 22h-9.21a2 2 0 0 1-1.76-1.052L2.842 15.76a1 1 0 0 1 .564-1.422L6 13.473V8a1 1 0 0 1 1-1h3V3zm1 4h2V3h-2v4zm-4 6.14l4.684-1.562a.999.999 0 0 1 .632 0L17 13.14V8H7v5.14zm5-.613l-8.278 2.76 2.793 5.187a1 1 0 0 0 .88.526h9.21a1 1 0 0 0 .88-.526l2.793-5.188L12 12.527z"></path></svg></span>
                        <div v-show="index!=scope.row.tshgList.length-1&&!(item.vessel!=null&&item.barge=='Other')" style="border-left: 4px dotted #dbdbdb; height: 40px;margin: 20px;"></div>
                        <div v-show="index!=scope.row.tshgList.length-1&&(item.vessel!=null&&item.barge=='Other')" style="border-left: 4px solid #dbdbdb; height: 40px;margin: 20px;"></div>
                      </div>
                      <div style="float: left;">
                        <div style="font-size: 14px;line-height: 20px;" >{{ item.event }}</div>
                        <div style="font-size: 14px;line-height: 20px;" >{{ parseTimeToZ1(item.eventTime) }}</div>
                        <div v-show="item.barge=='Ocean'&&item.event=='Departure'" style="" class="ptp-results__transport-plan--vessel mds-text--small-normal">
                            <div ><div class="vessel-title">Vessel</div><div class="vessel-title">{{ item.barge=='Barge'?"Barge":item.vessel }}</div></div>
                            <div ><div class="vessel-title">Service</div><div class="vessel-title">{{ item.service==null?'-':item.service }}</div></div>
                            <div ><div class="vessel-title">Voyage/Bound</div><div class="vessel-title">{{ item.voyage==null?'-':item.voyage }}</div></div>
                        </div>
                      </div>
                    </div>
                  </el-row>

                  <el-row>
                    <div>


                  </div>
                  </el-row>

                </div>

            </div>

            </template>
          </el-table-column>

  <el-table-column :label="$t('booking.carrier')" prop="carrier" width="250px" :align="'center'">
            <template v-slot="scope">
              <div>
                <img
            v-if="scope.row.carrier == 'HLCU'"
            class="uni-carrier-logo-image"
            src="../../../assets/HLCU.png"
          />
          <img
            v-if="scope.row.carrier == 'MAEU'"
            class="uni-carrier-logo-image"
            src="../../../assets/MAEU.png"
          />
          <img
            v-if="scope.row.carrier == 'ZIMU'"
            class="uni-carrier-logo-image"
            src="../../../assets/ZIMU.png"
          />
          <img
                  v-if="scope.row.carrier == 'TSHG'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/tailwind.png"
                />
                <img
            v-if="scope.row.carrier == 'MSCU'"
            class="uni-carrier-logo-image"
            src="../../../assets/MSCU-new.png"
          />
          <img
                  v-if="scope.row.carrier == 'MSC'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/MSCU-new.png"
                />

                <img
            v-if="scope.row.carrier == 'OOLU'"
            class="uni-carrier-logo-image"
            src="../../../assets/OOLU.svg"
          />
          <img
            v-if="scope.row.carrier == 'CMDU'"
            class="uni-carrier-logo-image"
            src="../../../assets/CMA.png"
          />
          <img
            v-if="scope.row.carrier == 'ONEY'"
            class="uni-carrier-logo-image"
            src="../../../assets/ONE.png"
          />
          <img
            v-if="scope.row.carrier == 'COSU'"
            class="uni-carrier-logo-image"
            src="../../../assets/COSCO.png"
          />
                <img
                  v-if="scope.row.carrier == 'CMA'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/CMA.png"
                />
                <img
                  v-if="scope.row.carrier == 'COSCO'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/COSCO.png"
                />
                <img
                  v-if="scope.row.carrier == 'HPL'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/HPL.png"
                />

                <img
                  v-if="scope.row.carrier == 'MSK'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/MSK.png"
                />
                <img
                  v-if="scope.row.carrier == 'HMM'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/HMM.jpg"
                />
                <img
                  v-if="scope.row.carrier == 'ONE'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/ONE.png"
                />
                <img
                  v-if="scope.row.carrier == 'ZIM'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/ZIM.png"
                />
                <img
                  v-if="scope.row.carrier == 'EMC'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/EMC.svg"
                />
                <img
                  v-if="scope.row.carrier == 'OOCL'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/OOCL.svg"
                />
                <img
                  v-if="scope.row.carrier == 'YML'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/YML.png"
                />
                <img
                  v-if="scope.row.carrier == 'MCC'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/MSK.png"
                />
                <img
                  v-if="scope.row.carrier == 'EGLV'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/EGLV.png"
                />
                <img
                  v-if="scope.row.carrier == 'SJHH'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/SJHH.png"
                />
                <img
                  v-if="scope.row.carrier == 'SMLU'"
                  class="uni-carrier-logo-image"
                  src="../../../assets/logo/SMLU.png"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column sortable="custom"  label="Service" prop="service" width="180px">
          </el-table-column>


          <el-table-column
            label="Main Carriage"
            prop="mainCarriage"
            min-width="300px"
          >
          <template v-slot="scope">
            <div style="width: 800px;">
              <div style="float: left; margin-right: 10px;margin-top: 20px">
                <div style="text-align: center; color:#c3c5c7; ">
      {{ scope.row.carrier=='TSHG'?scope.row.polName:(scope.row.polTerminal +" ("+ scope.row.pol +") ") }}
    </div>
    <div style="text-align: center;">
      {{ parseTime(scope.row.departureDate) }}
    </div>
              </div>

              <div style="float: left; width: 100px;">
                <div style="position: relative">
                  <div style="text-align: center;color:#385f78;white-space: nowrap;">
                  {{ scope.row.vesselName }}
                </div>
                <div class="image-container" style="position: absolute; left: 35px">
                  <img style="width: 20px; height: 20px"
                  src="../../../assets/icons/ship.png"
                  />
                </div>
                <div style="text-align: center;color:#385f78;position: absolute; top: 50px;left: 30px">
                  {{ scope.row.voyage }}
                </div>
                </div>
              </div>

              <div style="float: left;margin-left: 10px;margin-top: 20px">
                <div style="text-align: center;  color:#c3c5c7; ">
                  {{ scope.row.carrier=='TSHG'?scope.row.podName:(scope.row.podTerminal +" ("+ scope.row.pod +") ") }}
                  </div>
                  <div style="text-align: center;">
                    {{ parseTime(scope.row.arrivalDate) }}
                  </div>
              </div>
            </div>

            </template>
          </el-table-column>

          <el-table-column
            label="TT"
            prop="transitTime"
            min-width="100px"
          >
          <template v-slot="scope">
            {{ scope.row.transitTime+" days" }}
            </template>
          </el-table-column>
<!-- <el-table-column :label="$t('booking.carrier')" prop="carrier" width="180px" :align="'center'">
</el-table-column>
<el-table-column label="Service" prop="service" min-width="100px">
</el-table-column>
<el-table-column :label="$t('booking.voyage')" prop="voyage" min-width="100px">
  <template slot-scope="scope">
    {{ scope.row.voyage }}
  </template>
</el-table-column>
<el-table-column
  :label="$t('booking.vesselCode')"
  prop="vesselCode"
  min-width="100px"
>
</el-table-column>
<el-table-column
  :label="$t('booking.vesselName')"
  prop="vesselName"
  min-width="100px"
>
</el-table-column>
<el-table-column :label="$t('booking.pol')" prop="port" min-width="100px">
</el-table-column>
<el-table-column :label="$t('booking.pod')" prop="pod" min-width="100px">
</el-table-column>
<el-table-column
  :label="$t('booking.etd')"
  prop="departureDate"
  min-width="100px"
>
  <template v-slot="scope">
    <span>{{ parseTime(scope.row.departureDate) }}</span>
  </template>
</el-table-column>
<el-table-column
  :label="$t('booking.eta')"
  prop="arrivalDate"
  min-width="100px"
>
  <template v-slot="scope">
    <span>{{ parseTime(scope.row.arrivalDate) }}</span>
  </template>
</el-table-column> -->

<el-table-column
  prop="choseSchedule"
  width="100px"
>
  <template v-slot="scope">
    <el-button type="primary" @click="choseSchedule(scope.row)">Select</el-button>
  </template>
</el-table-column>
</el-table>
</el-dialog>

<el-card  style="box-shadow: none;border:1px solid #ddd!important;border-radius:0px;margin-bottom: 10px;">
<el-descriptions title="Input ETD Range" style="box-shadow: none;" :column="3" border>
  <span class="el-descriptions__title" slot="title">Select vessel schedule </span><span style="color: #bbb1c2" slot="title">(Input ETD Range)</span>
</el-descriptions>
<el-row :gutter="20" >
        <el-col :span="6">
          <el-date-picker placeholder="ETD From" v-model="searchSchedule.from"/>
        </el-col>
        <el-col :span="6">
          <el-date-picker placeholder="ETD To" v-model="searchSchedule.to"/>
        </el-col>
        <el-col :span="6" >
          <el-button @click="queryShippingSchedule" type="primary">Search<i class="el-icon-search el-icon--right" ></i></el-button>
        </el-col>
      </el-row>
</el-card>

    <el-card style="box-shadow: none;border:1px solid #ddd!important;border-radius: 0px!important;margin: 15px 0px;padding: 10px 15px;">


      <el-timeline>
        <el-timeline-item
          :timestamp="
          (item.etd!=null||item.eta!=null)? (
            (parseTime(item.etd) ? parseTime(item.etd) : '-') +
            ' - ' +
            (parseTime(item.eta) ? parseTime(item.eta) : '-')
            ):''
          "
          placement="top"
          v-for="(item, i) in form.shipmentRouters"
          :key="i + 'router'"
          class="shipmentRouters-css"
        >
          <el-card shadow="never">
            <h4 v-if="i == 0">
              <i class="el-icon-ship"></i>{{ $t("booking.form") }}:
              {{ getLabel(item.pol, "pol") }}
            </h4>
            <div v-if="i != form.shipmentRouters.length - 1 && i > 0">
              <h4><i class="el-icon-ship"></i>{{ $t("booking.formTo") }}:</h4>
              <el-row :gutter="20">
                <el-col :span="6"
                  ><font color="#FF0000">*</font>{{ $t("booking.pol") }}</el-col
                >
              </el-row>

              <el-row :gutter="20">
                <el-col :span="6">
                  <el-form-item required :prop="'shipmentRouters.' + i + '.pol'">
                    <el-select @change="changeRouter($event,i)" filterable v-model="item.pol">

                      <el-option
                        v-for="(item, index) in portOptions"
                        :key="index + 'pol4'"
                         :label="item.name+' ('+item.code+')'"
                        :value="item.code"
                      ></el-option>

                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <br />
            <div v-if="i != form.shipmentRouters.length - 1">
              <el-row :gutter="20">
                <el-col :span="4"><font color="#FF0000">*</font>Transport Mode</el-col>
                <el-col :span="4"
                  ><font color="#FF0000">*</font>{{ $t("booking.etd") }}</el-col
                >
                <el-col :span="4"
                  ><font color="#FF0000">*</font>{{ $t("booking.eta") }}</el-col
                >
              </el-row>
              <el-row :gutter="20" style="margin-bottom: 5px">
                <el-col :span="4" >
                  <el-form-item required :prop="'shipmentRouters.' + i + '.transportMode'">
                    <el-select v-model="item.transportMode" clearable filterable>
                      <el-option
                        v-for="dict in transportMode"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" >
                  <el-form-item   required   :prop="'shipmentRouters.' + i + '.etd'">
                    <el-date-picker  value-format="timestamp" v-model="item.etd" />
                  </el-form-item>
                </el-col>
                <el-col :span="4" >
                  <el-form-item required :prop="'shipmentRouters.' + i + '.eta'">
                    <el-date-picker value-format="timestamp" v-model="item.eta" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="4"
                  ><font color="#FF0000">*</font
                  >{{ $t("booking.transportMeanName") }}</el-col
                >
                <el-col :span="4"></el-col>
                  <font color="#FF0000">*</font>{{ $t("booking.voyage") }}
                </el-col>
                <el-col :span="4">
                  <font color="#FF0000">*</font>Service
                </el-col>
              </el-row>

              <el-row :gutter="20" style="margin-bottom: 5px">
                <el-col :span="4">
                  <el-form-item required :prop="'shipmentRouters.' + i + '.transportMeanName'">
                    <el-select
                    allow-create
                      v-model="item.transportMeanName"
                      placeholder=""
                      filterable
                      remote
                      reserve-keyword
                      clearable
                      :remote-method="remoteMethod2"
                      @change="changeVesselName(item)"
                      @clear="item.transportMeanName = null"
                    >
                      <el-option
                        v-for="dict in vesselListLes"
                        :key="dict.id"
                        :label="dict.vesselName"
                        :value="dict.vesselName"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                              <el-col :span="4">
                                <el-form-item required :prop="'shipmentRouters.' + i + '.voyage'">
                                  <el-input v-model="item.voyage" />
                                </el-form-item>
                              </el-col>
                              <el-col :span="4">
                                <el-form-item required :prop="'shipmentRouters.' + i + '.service'">
                                  <el-input v-model="item.service" />
                                </el-form-item>
                              </el-col>
              </el-row>
              <!-- 添加换船触发复选框 -->
              <el-row :gutter="20" style="margin-top: 15px;">
                <el-col :span="24">
                  <el-checkbox v-model="changeVesselFlag" @change="handleChangeVessel">
                    <span style="color: #ff4949;">Change Vessel Information</span>
                  </el-checkbox>
                </el-col>
              </el-row>
              <!-- 换船触发复选框结束 -->
            </div>
            <h4 v-if="i == form.shipmentRouters.length - 1">
              <i class="el-icon-ship"></i>{{ $t("booking.to") }}:
              {{ getLabel(item.pol, "pod") }}
            </h4>
            <el-row
              v-if="i != form.shipmentRouters.length - 1"
              style="margin-top: 10px; text-align: center"
            >
              <el-col :span="12">
                <el-button
                  type="primary"
                  @click="form.shipmentRouters.splice(i + 1, 0, {})"
                  icon="el-icon-plus"
                  circle
                ></el-button>

                <el-button
                  v-if="i != form.shipmentRouters.length - 1 && i != 0"
                  type="danger"
                  @click="form.shipmentRouters.splice(i, 1)"
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>

      <div v-if="noteView && form.status==0">
        <el-descriptions style="padding: 15px!important;background: #fff;margin-bottom: 15px;">
          <el-descriptions-item label="Update Category" >
            <el-select clearable v-model="shipmentNote.cancelCode" size="mini"  placeholder=""
                       @change="getCancelReason($event)" @clear="clearSelCancelCategory">
              <el-option v-for="item in selCancelCategory" :key="item.enumId" :label="item.description"
                         :value="item.enumId">
              </el-option>
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item label="Update Reason"
          ><el-select clearable v-model="shipmentNote.cancelSubCode" size="mini" placeholder=""
                      @change="changeSelCancelReason($event)" no-data-text="Please select Cancel Category first">
            <el-option v-for="item in selectCancelReason" :key="item.enumId" :label="item.description"
                       :value="item.enumId">
            </el-option>
          </el-select>
          </el-descriptions-item>
          <el-descriptions-item label="Update Remark"
          > <el-input type="textarea" placeholder=""
                      @blur="shipmentNote.cancelRemark = $event.target.value.trim()" v-model="shipmentNote.cancelRemark" size="mini"
                      :rows="3" maxlength="1000" show-word-limit resize="none">
          </el-input>
          </el-descriptions-item>
        </el-descriptions>
      </div>



      <el-row style="text-align: center">
        <span style="margin-right: 10px;display:inline-block"><el-checkbox v-model="form.noBookingEdi" >No EDI</el-checkbox></span>

        <el-button size="mini" @click="submit(2)" v-if="form.status==2" type="primary" :loading="loadingSaveBut">
          Save Update
        </el-button>
        <el-button size="mini" @click="submit(0)" v-hasPermi="['submit:carrier:booking']" type="primary" :loading="loadingSaveBut">{{
          $t("booking.submit")
        }}</el-button>
      </el-row>
    </el-form>
  </el-card>


       <el-dialog
          title="Vessel Change Information"
          :visible.sync="changeVesselDialog"
          width="800px"
          :close-on-click-modal="false"
          custom-class="vessel-change-dialog"
        >
          <div class="vessel-change-container">

            <!-- 换船原因区域 -->
            <el-card class="reason-card">
              <div slot="header" class="card-header">
                <i class="el-icon-info"></i>
                <span>Change Reason</span>
              </div>
              <el-descriptions :column="1" border class="reason-descriptions">
                <el-descriptions-item label="Reason Type" label-class="required-label">
                  <el-select v-model="vesselChangeReason.carrierRolling" filterable placeholder="Select reason type" required>
                    <el-option  key="Schedule change" label="Schedule change" value="Schedule change" />
                    <el-option  key="Carrier rollover" label="Carrier rollover" value="Carrier rollover" />
                    <el-option  key="Supplier issue" label="Supplier issue" value="Supplier issue" />
                    <el-option  key="Vessel change" label="Vessel change" value="Vessel change" />
                  </el-select>
                </el-descriptions-item>
                <el-descriptions-item v-if="vesselChangeReason.carrierRolling === 'Carrier rollover'" label="Original Allocation Week">
                  <el-input
                    type="text"
                    v-model="vesselChangeReason.originalAllocationWeek"
                    placeholder="original allocation week"
                    :required="vesselChangeReason.carrierRolling === 'Carrier rollover'"
                  />
                </el-descriptions-item>
                <el-descriptions-item label="Detailed Reason">
                  <el-input
                    type="textarea"
                    v-model="vesselChangeReason.reason"
                    placeholder="Please enter detailed reason for vessel change"
                    :rows="4"
                    required
                  />
                </el-descriptions-item>
              </el-descriptions>
            </el-card>

            <!-- 动态航段对比区域 -->
            <div class="segment-container-all">
              <div
                v-for="segmentIndex in Math.max(originalVesselInfos.length, filteredShipmentRouters.length)"
                :key="segmentIndex"
                class="segment-container"
              >
                <h4 style="margin: 15px 0; color: #409eff;">
                  Voyage Segment {{ segmentIndex }}
                  <!-- 同时存在原始和新航段时 -->
                  <template v-if="originalVesselInfos[segmentIndex-1] && filteredShipmentRouters[segmentIndex-1]">
                    <template v-if="filteredShipmentRouters[segmentIndex]">
                      <!-- 当前新航段存在下一层航段：显示当前出发港 → 下一层出发港 -->
                      : {{ filteredShipmentRouters[segmentIndex-1].pol }} <i class="el-icon-arrow-right"></i> {{ filteredShipmentRouters[segmentIndex].pol }}
                    </template>
                    <template v-else>
                      <!-- 当前新航段不存在下一层航段：显示当前出发港 → 当前到达港 -->
                      : {{ filteredShipmentRouters[segmentIndex-1].pol }} <i class="el-icon-arrow-right"></i> {{ filteredShipmentRouters[segmentIndex-1].pod }}
                    </template>
                  </template>
                  <!-- 仅存在原始航段时 (保持不变) -->
                  <template v-else-if="originalVesselInfos[segmentIndex-1]">
                    : {{ originalVesselInfos[segmentIndex-1].pol }}  <i class="el-icon-arrow-right"></i> {{ originalVesselInfos[segmentIndex-1].pod }}
                  </template>
                  <!-- 仅存在新航段时 -->
                  <template v-else-if="filteredShipmentRouters[segmentIndex-1]">
                    <template v-if="filteredShipmentRouters[segmentIndex]">
                      <!-- 当前新航段存在下一层航段：显示当前出发港 → 下一层出发港 -->
                      : {{ filteredShipmentRouters[segmentIndex-1].pol }}  <i class="el-icon-arrow-right"></i> {{ filteredShipmentRouters[segmentIndex].pol }}
                    </template>
                    <template v-else>
                      <!-- 当前新航段不存在下一层航段：显示当前出发港 → 最后一层到达港 -->
                      : {{ filteredShipmentRouters[segmentIndex-1].pol }}  <i class="el-icon-arrow-right"></i> {{ form.pod}}

                    </template>
                  </template>
                </h4>

                <!-- 换船前后信息对比区域 -->
                <div class="comparison-section">
                  <!-- 换船前信息卡片 -->
                  <el-card v-if="originalVesselInfos[segmentIndex-1]" class="info-card original-info">
                    <div slot="header" class="card-header">
                      <i class="el-icon-ship"></i>
                      <span>Original Vessel Information</span>
                    </div>
                    <el-descriptions :column="1" border>
                      <el-descriptions-item
                        :label-class="{'highlight-label': isSegmentDifferent(segmentIndex-1, 'carrier')}"
                        label="Carrier"
                      >
                        <span :class="{'highlight-value': isSegmentDifferent(segmentIndex-1, 'carrier')}">
                          {{ originalVesselCarrier || '-' }}
                        </span>
                      </el-descriptions-item>
                      <el-descriptions-item
                        :label-class="{'highlight-label': isSegmentDifferent(segmentIndex-1, 'transportMeanName')}"
                        label="Vessel Name"
                      >
                        <span :class="{'highlight-value': isSegmentDifferent(segmentIndex-1, 'transportMeanName')}">
                          {{ originalVesselInfos[segmentIndex-1].transportMeanName || '-' }}
                        </span>
                      </el-descriptions-item>
                      <el-descriptions-item
                        :label-class="{'highlight-label': isSegmentDifferent(segmentIndex-1, 'voyage')}"
                        label="Voyage"
                      >
                        <span :class="{'highlight-value': isSegmentDifferent(segmentIndex-1, 'voyage')}">
                          {{ originalVesselInfos[segmentIndex-1].voyage || '-' }}
                        </span>
                      </el-descriptions-item>
                      <el-descriptions-item
                        :label-class="{'highlight-label': isSegmentDifferent(segmentIndex-1, 'service')}"
                        label="Service"
                      >
                        <span :class="{'highlight-value': isSegmentDifferent(segmentIndex-1, 'service')}">
                          {{ originalVesselInfos[segmentIndex-1].service || '-' }}
                        </span>
                      </el-descriptions-item>
                      <el-descriptions-item
                        :label-class="{'highlight-label': isSegmentDifferent(segmentIndex-1, 'etd')}"
                        label="ETD"
                      >
                        <span :class="{'highlight-value': isSegmentDifferent(segmentIndex-1, 'etd')}">
                          {{ parseTime(originalVesselInfos[segmentIndex-1].etd) || '-' }}
                        </span>
                      </el-descriptions-item>
                      <el-descriptions-item
                        :label-class="{'highlight-label': isSegmentDifferent(segmentIndex-1, 'eta')}"
                        label="ETA"
                      >
                        <span :class="{'highlight-value': isSegmentDifferent(segmentIndex-1, 'eta')}">
                          {{ parseTime(originalVesselInfos[segmentIndex-1].eta) || '-' }}
                        </span>
                      </el-descriptions-item>
                    </el-descriptions>
                  </el-card>
                  <el-card v-else class="info-card original-info empty-segment">
                    <div slot="header" class="card-header">
                      <i class="el-icon-ship"></i>
                      <span>Original Vessel Information</span>
                    </div>
                    <div class="empty-segment-text">No original segment data available</div>
                  </el-card>

                  <!-- 箭头图标 -->
                  <div class="arrow-container">
                    <i class="el-icon-refresh arrow-icon"></i>
                  </div>

                  <!-- 换船后信息卡片 -->
                  <el-card v-if="form.shipmentRouters[segmentIndex-1]" class="info-card new-info">
                    <div slot="header" class="card-header">
                      <i class="el-icon-ship"></i>
                      <span>New Vessel Information</span>
                    </div>
                    <el-descriptions :column="1" border>
                      <el-descriptions-item label="Carrier">
                        <span>{{ form.carrier || '-' }}</span>
                      </el-descriptions-item>
                      <el-descriptions-item label="Vessel Name">
                        <span>{{ form.shipmentRouters[segmentIndex-1].transportMeanName || '-' }}</span>
                      </el-descriptions-item>
                      <el-descriptions-item label="Voyage">
                        <span>{{ form.shipmentRouters[segmentIndex-1].voyage || '-' }}</span>
                      </el-descriptions-item>
                      <el-descriptions-item label="Service">
                        <span>{{ form.shipmentRouters[segmentIndex-1].service || '-' }}</span>
                      </el-descriptions-item>
                      <el-descriptions-item label="ETD">
                        <span>{{ parseTime(form.shipmentRouters[segmentIndex-1].etd) || '-' }}</span>
                      </el-descriptions-item>
                      <el-descriptions-item label="ETA">
                        <span>{{ parseTime(form.shipmentRouters[segmentIndex-1].eta) || '-' }}</span>
                      </el-descriptions-item>
                    </el-descriptions>
                  </el-card>
                  <el-card v-else class="info-card new-info empty-segment">
                    <div slot="header" class="card-header">
                      <i class="el-icon-ship"></i>
                      <span>New Vessel Information</span>
                    </div>
                    <div class="empty-segment-text">No new segment data available</div>
                  </el-card>
                </div>
              </div>
            </div>
          </div>
        </el-dialog>
          <!-- 换船信息弹窗结束 -->
  </div>
</template>

<style>
.shipmentRouters-css .el-form-item__content {
    margin: 0 !important;
}
.shipmentRouters-css label.el-form-item__label {
    display: none;
}

.uni-carrier-logo-image {
  width: 180px;
  height: 60px;
  image-rendering: -webkit-optimize-contrast;
  -moz-osx-font-smoothing: grayscale;
  -webkit-backface-visibility: hidden;
}
.ptp-results__transport-plan--deadline {
  display: grid;
  grid-template-columns: repeat(5, 1fr);

  border: 1px solid #dbdbdb;
  padding: 8px;
  margin: 8px 0;
}
.ptp-results__transport-plan--mode {
  display: grid;
  grid-template-columns: repeat(1, 1fr);

  border: 1px solid #dbdbdb;
  background-color: #f7f7f7;
  padding: 8px;
  margin: 8px 0;
}
.ptp-results__transport-plan--vessel {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  border: 1px solid #dbdbdb;
  background-color: #f7f7f7;
  padding: 8px;
  margin: 8px 0;
}
.vessel-title {
  text-align: center;
}
</style>

<script>
import { getUserProfile } from "@/api/system/user";
// import { listDept } from "@/api/system/dept";
import {
  create,
  si,
  vgm,
  findDropDownListFromCt,
  shipmentDetails,
  checkShippingSIStatus, updateTailwindShipment,
} from "@/api/shipment/shipment";
import { getContainerList } from "@/api/system/container";
import { createDeptApply } from "@/api/system/deptApply";
import SOMainTable from '@/views/salesOrder/components/table.vue';
import { getVesselList } from "@/api/system/vessel";
import {getFileList, deleteFile, updateFileExId} from "@/api/infra/file";
import { getCraNumList,findShippingScheduleList,listDept } from "@/api/shipment/shipment";
import { getHsCodeListByCode } from "@/api/system/hsCode";
import { getOriginDeliveryList } from "@/api/system/originDelivery";
import { getBaseHeader } from "@/utils/request";
import { getBookingList } from "@/api/booking/booking";
import { getItemList } from "@/api/order/item";
import { getProductList } from "@/api/system/product";
import { getHeaderList } from "@/api/order/header";
import { getListByShipmentId } from "@/api/booking/booking";
import { createNote } from "@/api/shipment/note";
import { getAllocationWeekData } from "@/api/booking/contract";
import { getContractListTenantIgnore } from "@/api/booking/contract";
  import { getShippingOrderListByIds } from '@/api/shipping/order'
  import { getOrderHeadersList } from '@/api/pepco/shipping-order.js'
import ShipmentCargoInfo from '@/views/shipment/components/shipment-cargo-info.vue'
import { fileLoadMixin } from '@/utils/fileLoadMixin'
import ShippingInstructionsDialog from "@/views/shipment/update/shipping-instructions-dialog.vue";


export default {
  name: "Shipment",
  mixins: [fileLoadMixin],
  components: {ShippingInstructionsDialog, SOMainTable, ShipmentCargoInfo},
  data() {
    return {
      allocationWeekList:[],
      loadingSaveBut:false,
      searchSchedule:{
        from:new Date(),
        to:new Date().setMonth(new Date().getMonth() + 2)
      },
      shippingScheduleVisable:false,
      shippingScheduleData:[],
      shippingScheduleLoading:false,
      form: {
        type: "Merchant",
        containers: [],
        shipmentRouters: [],
        productData: [],
        contractType: "CY/CY",
        reasonOfPremium: '',
        phone: "",
        email: "",
      },
      phoneError: "",
      emailError: "",
      portOptions: [],
      containerOptions: [],
      parties: {},
      partiesMap: {},
      tipsMail: "Tailwind.CS@kblinersh.com",
      open: false,
      partyForm: {
        partyRole: [],
      },
      vesslMap: {},
      reverseVesslMap: {},
      vesselList: [],
      vesselListLes: [],
      hsCodeList: [],
      url: "",
      uploadHeaders: {},
      flag: false,
      cra_pol: [],
      cra_pod: [],
      cra_origin: [],
      cra_disch: [],
      cra_contaier_type: [],
      craFlag: false,
      itemTableData:[],
      productMapForBook:{},
      orderMap: {},
      orderItemMap: {},
      selCancelReason: [],
      selCancelCategory: [],
      selectCancelReason: [],
      cancelReasonFlag: false,
      shipmentNote:{
        cancelCode:null,
        cancelSubCode:null,
        cancelRemark:null,
      },
      noteView:false,
      craList:[],
      carrierMap:{
    "CMDU": "CMA",
    "COSU": "COSCO",
    "EGLV": "EMC",
    "HLCU": "HPL",
    "MSCU": "MSC",
    "ONEY": "ONE",
    "ZIMU": "ZIM",
    "MAEU": "MSK",
    "TSHG": "TSHG",
    "MAEU-ALWAYS": "MSK",
    'SHCO': 'SHIPCO',
        'NVOCC DSV': 'DSV',
        'WECC': 'WEC',
},      carrierMap2:{
    "CMA": "CMDU",
    "TSHG": "TSHG",
    "COSCO": "COSU",
    "EMC": "EGLV",
    "HPL": "HLCU",
    "MSC": "MSCU",
    "ONE": "ONEY",
    "ZIM": "ZIMU",
    "MSK": "MAEU",
        'SHIPCO': 'SHCO',
        'DSV': 'NVOCC DSV',
        'WEC': 'WECC',
},
showTips:true,
showCustomer:true,
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
      isPepco: false,
      spoItems: [],
      spoList: [],
      // 接收shipment-cargo-info组件的数据
      receiveSOProductList: [],
      // 换船相关数据
      changeVesselFlag: false,
      changeVesselDialog: false,
      originalVesselInfos: [], // 存储所有原始航段信息，从接口加载后保持不变
      originalVesselCarrier: '',
      vesselChangeReason: {
        carrierRolling: '',
        originalAllocationWeek:'',
        reason: ''
      },
      isInitialLoad: true,
      availableYears: [],
      availableWeeks: [],
      isShowSI: false,
      siVisible: false
    };
  },
  created() {
    var data = getBaseHeader();
    this.generateAvailableYears()
    this.uploadHeaders = data;
    this.url = process.env.VUE_APP_BASE_API;
    this.getPortList();
    this.getContainerList();
    this.getParty();
    this.getVesselList();
    this.getContractListTenantIgnore();

    if (this.$auth.hasPermi("booking:query")) {
      this.getBookings();
    }
    this.getDropDownValues();
    var shipmentNoteView = this.getDictDatas(this.DICT_TYPE.SHIPMENT_NOTE_VIEW)
    if(shipmentNoteView && shipmentNoteView.length > 0){
      for(var c=0; c< shipmentNoteView.length ; c++){
          if(shipmentNoteView[c].value == localStorage.getItem('TENANT_ID')){
            this.noteView = true
            break;
          }
      }
    }
    var ids = this.$route.query.id;

    if (ids) {
      this.getShipmentDetails(ids);
    } else {
      this.form.productData.push({
        batteries: 3,
        fileList: [],
        uploadData: {},
        dg: 0,
        hazardousMaterials: {},
      });
    }
    if(this.$route.query.source == 'booking-order'){
      this.showTips = false;
      this.showCustomer = false;
      getUserProfile().then((response) => {
        this.form.customer = response.data.customers
      });
    }
  },
  methods: {

    getShipper() {
      var party = { "address": "-", "email": "-", "phone": "-", "fax": "-", "companyUsci": "-" };
      if (this.form.shipper && this.parties['Shipper'] && this.parties['Shipper'].length > 0) {
        var obj = this.parties['Shipper'].find((item => item.id == this.form.shipper))
        if (obj == undefined || obj == null) {
          obj = party;
        }
        return obj
      }
      return party
    },
    getNotifyParty() {
      var party = { "address": "-", "email": "-", "phone": "-" , "fax": "-", "companyUsci": "-"};
      if (this.form.notifyParty && this.parties['Notify Party'] && this.parties['Notify Party'].length > 0) {
        var obj = this.parties['Notify Party'].find((item => item.id == this.form.notifyParty))
        if (obj == undefined || obj == null) {
          obj = party;
        }
        return obj
      }
      return party
    },
    getConsignee() {
      var party = { "address": "-", "email": "-", "phone": "-" , "fax": "-", "companyUsci": "-"};
      if (this.form.consignee && this.parties['Consignee'] && this.parties['Consignee'].length > 0) {
        var obj = this.parties['Consignee'].find((item => item.id == this.form.consignee))
        if (obj == undefined || obj == null) {
          obj = party;
        }
        return obj
      }
      return party
    },
    getAgreementParty() {
      var party = { "address": "-", "email": "-", "phone": "-" , "fax": "-", "companyUsci": "-"};
      if (this.form.agreementParty && this.parties['Agreement Party'] && this.parties['Agreement Party'].length > 0) {
        var obj = this.parties['Agreement Party'].find((item => item.id == this.form.agreementParty))
        if (obj == undefined || obj == null) {
          obj = party;
        }
        return obj
      }
      return party
    },
    validatePolPod(rule, value, callback) {
      const { pol, pod } = this.form;
      if (pol && pod && pol === pod) {
        // 设置当前字段的错误消息
        callback(new Error(' '));
        // 手动设置另一个字段的错误消息
        this.setFieldError(rule.field === 'pol' ? 'pod' : 'pol', ' ');
      } else {
        callback();
        // 清除另一个字段的错误消息
        this.clearFieldError(rule.field === 'pol' ? 'pod' : 'pol');
      }
    },
    validateOriginAndDestination(rule, value, callback) {
      const { originPort, destinationPort } = this.form;
      if (originPort && destinationPort && originPort === destinationPort) {
        // 设置当前字段的错误消息
        callback(new Error(' '));
        // 手动设置另一个字段的错误消息
        this.setFieldError(rule.field === 'originPort' ? 'destinationPort' : 'originPort', ' ');
      } else {
        callback();
        // 清除另一个字段的错误消息
        this.clearFieldError(rule.field === 'originPort' ? 'destinationPort' : 'originPort');
      }
    },
    filteredPortOptions(field) {
      if (!this.craFlag) {
        return this.portOptions;
      }
      switch (field) {
        case 'pol':
          return this.portOptions.filter(item => this.cra_pol.includes(item.code));
        case 'pod':
          return this.portOptions.filter(item => this.cra_pod.includes(item.code));
        case 'originPort':
          return this.portOptions.filter(item => this.cra_origin.includes(item.code));
        case 'destinationPort':
          return this.portOptions.filter(item => this.cra_disch.includes(item.code));
        default:
          return this.portOptions;
      }
    },
    setFieldError(prop, message) {
      const field = this.$refs.form.fields.find(field => field.prop === prop);
      if (field) {
        field.validateMessage = message;
        field.validateState = 'error';
      }
    },
    clearFieldError(prop) {
      const field = this.$refs.form.fields.find(field => field.prop === prop);
      if (field) {
        field.validateMessage = '';
        field.validateState = '';
      }
    },
    changeRouter(value,index){

    if(this.form.shipmentRouters[index-1].pol.startsWith('CN')
      &&this.form.shipmentRouters[index].pol.startsWith('CN')){
        this.$set(this.form.shipmentRouters[index-1],'transportMode','BRG')
    }else{
      this.$set(this.form.shipmentRouters[index-1],'transportMode','SEA')
    }


    if(!this.form.shipmentRouters[index+1].pol.startsWith('CN')
      &&!this.form.shipmentRouters[index].pol.startsWith('CN')){
        this.$set(this.form.shipmentRouters[index],'transportMode','BRG')
    }else if(this.form.shipmentRouters[index+1].pol.startsWith('CN')
      &&this.form.shipmentRouters[index].pol.startsWith('CN')){
        this.$set(this.form.shipmentRouters[index],'transportMode','BRG')
    }else{
      this.$set(this.form.shipmentRouters[index],'transportMode','SEA')
    }

    },
    getContractListTenantIgnore() {
      var queryParams = {};
      getContractListTenantIgnore(queryParams).then(response => {
        this.craList = []
        for (var t of response.data) {
          t.contractNo = t.contractNo.trim();
          this.craList.push(t)
        }
      });
    },
    choseSchedule(row){
      this.form.shipmentRouters[0]
      this.$set(this.form.shipmentRouters[0],'pol',row.port)
      this.$set(this.form.shipmentRouters[0],'etd',row.departureDate)
      this.$set(this.form.shipmentRouters[0],'eta',row.arrivalDate)
      this.$set(this.form.shipmentRouters[0],'transportMeanName',row.vesselName)
      this.$set(this.form.shipmentRouters[0],'identification',row.vesselCode)
      this.$set(this.form.shipmentRouters[0],'voyage',row.voyage)
      this.$set(this.form.shipmentRouters[0],'imo',row.imo)
      this.$set(this.form.shipmentRouters[0],'service',row.service)
      this.$set(this.form.shipmentRouters[0],'transportMode',"SEA")

      this.$set(this.form,'carrier',this.carrierMap2[row.carrier])
      this.shippingScheduleVisable=false
      if (row.carrier == "TSHG") {
        this.setSchdulesTSHG(row)
      }
    },
    queryShippingSchedule(){
      console.log(this.searchSchedule.from)
      console.log(this.searchSchedule.to)

      console.log('111122')
      if(this.form.pol!=null&&this.form.pol!=''
      &&this.form.pod !=null&&this.form.pod !=''
      &&this.searchSchedule.from!=null&&this.searchSchedule.from!=''
      &&this.searchSchedule.to!=null&&this.searchSchedule.to!=''){
        var data={
              origin:this.form.pol,
              destination:this.form.pod,
              departureFrom:this.parseTime(this.searchSchedule.from),
              departureFrom2:this.parseTime(this.searchSchedule.to),
              carrier:this.carrierMap[this.form.carrier],
              service: this.searchSchedule.service
            }
            console.log(data)
            this.shippingScheduleLoading=true
            console.log(123)
            this.findShippingScheduleList(data)
            this.shippingScheduleVisable=true
            console.log(data)
      }else{
        this.$notify({
              title: 'warning',
              message: 'Required fields is empty',
              type: 'warning'
            });
      }

    },
    findShippingScheduleList(reqData) {
      findShippingScheduleList(reqData).then((response) => {
        this.shippingScheduleData = response.data;
        this.shippingScheduleLoading=false
      });
    },
    getAllocationWeekList(){
      console.log('查询week参数',this.form.contractNumber)

      if(this.form.contractNumber && this.form.carrier){
        getAllocationWeekData(this.form.carrier, this.form.contractNumber).then((response) => {
          this.allocationWeekList = response.data
          console.log('查询week结果', this.allocationWeekList)
        })
      }
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
    getDropDownValues() {
      findDropDownListFromCt().then((response) => {
        if (response && response.data) {
          if (response.data.cancelReasonList)
            this.selCancelReason = response.data.cancelReasonList;
          if (response.data.cancelCategoryList)
            this.selCancelCategory = response.data.cancelCategoryList;
        }
      });
    },
    clearSelCancelCategory() {
    console.log(this.form)
      this.selectCancelReason = [];
      this.shipmentNote.cancelCode = null;
      this.shipmentNote.cancelSubCode = null;
    },
    getCancelReason(prov) {
      let tempCancelReason = [];
      for (var val of this.selCancelReason) {
        if (prov == val.parentEnumId) {
          tempCancelReason.push({ description: val.description, enumId: val.enumId });
        }
      }
      this.selectCancelReason = tempCancelReason;

      this.shipmentNote.cancelSubCode = null;
    },
    // 删除图片
    changeCarrier(value) {
      this.$set(this.form, "contractNumber", "");

      if (value == "TSHG") {
        this.setCra();
        this.craFlag = true;
      } else {
        this.craFlag = false;
      }
      this.remoteGetCraNum()
    },
    getParty() {
        this.getParties({ partyRole: "Shipper"});
        this.getParties({ partyRole: "Consignee"});
        this.getParties({ partyRole: "Notify Party"});
        this.getParties({ partyRole: "Agreement Party"});
        this.getParties({ partyRole: "Customer"});
    },
    remoteGetCraNum() {
     //query Allocation  etd week
     this.getAllocationWeekList()
           // 初次加载时跳过清空，之后正常清空
      if (this.isInitialLoad) {
        this.isInitialLoad = false
      } else {
        this.form.reasonOfPremium = ''
      }

      var query = this.form.contractNumber;
      if(this.form.carrier!='TSHG'){

        return
      }
      if (query !== "" && query.length >= 4) {
        getCraNumList(query).then((response) => {
          this.craNumList = response.data;
          if (this.craNumList.length > 0) {
            if (this.craNumList[0] && this.craNumList[0].ap) {
              var req = {
                partyRole: "Agreement Party",
                customerCode: this.craNumList[0].ap,
              };
              this.getParties(req, true);
            }
          }else{
            this.cra_pol = [];
            this.cra_pod = [];
            this.cra_origin = [];
            this.cra_disch = [];
            this.cra_contaier_type = [];
          }
          for (var i = 0; i < this.craNumList.length; i++) {
            if (this.cra_pol.indexOf(this.craNumList[i].origin) == -1) {
              this.cra_pol.push(this.craNumList[i].origin);
            }
            if (this.cra_pod.indexOf(this.craNumList[i].delivery) == -1) {
              this.cra_pod.push(this.craNumList[i].delivery);
            }
            if (this.cra_origin.indexOf(this.craNumList[i].loadPort) == -1) {
              this.cra_origin.push(this.craNumList[i].loadPort);
            }
            if (this.cra_disch.indexOf(this.craNumList[i].dischPort) == -1) {
              this.cra_disch.push(this.craNumList[i].dischPort);
            }
            if (this.cra_contaier_type.indexOf(this.craNumList[i].eqpType) == -1) {
              this.cra_contaier_type.push(this.craNumList[i].eqpType);
            }
          }
          this.setCra();
        });
      } else {
        this.cra_contaier_type = [];
        this.cra_pol = [];
        this.cra_pod = [];
        this.cra_origin = [];
        this.cra_disch = [];
      }
      // zane 判断是否展示reasonOfPremium
      if (!this.isSelectedContractPremium) {
        this.form.reasonOfPremium = undefined
      }
    },
    setCra() {
      console.log(1)
      if (this.cra_pol.indexOf(this.form.pol) == -1) {
        this.$set(this.form, "pol", "");
        this.$set(this.form, "originPort", "");
      }
      if (this.cra_pod.indexOf(this.form.pod) == -1) {
        this.$set(this.form, "pod", "");
        this.$set(this.form, "destinationPort", "");
      }
      if (this.cra_contaier_type.length > 0) {
        var data = this.form.containers.filter((item) => {
          return (
            this.cra_contaier_type.indexOf(item.containerType) > -1 ||
            item.containerType == ""
          );
        });
        if (data.length == 0) {
          data.push({ containerType: "" });
        }
        this.$set(this.form, "containers", data);
      }
    },
    handleRemove(file, fileList, i) {
      this.form.productData[i].files = fileList
      if (file.id) {
        var vm = this;
        this.$modal
          .confirm(
            'Are you sure to delete the data item with the file "' + file.name + '"?'
          )
          .then(function () {
            deleteFile(file.id).then((response) => {
              const findex = fileList.map((f) => f.name).indexOf(file.name);
              if (findex > -1) {
                fileList.splice(findex, 1);
              }
            });
          })
          .then(() => {
            this.$modal.msgSuccess("Successfully deleted");
          })
          .catch(() => {});
        return false;
      } else {
        return true;
      }
    },
    // 预览 / 下载
    handlePictureCardPreview(file) {
      const link = document.createElement("a");
      link.href = file.url;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    getBookings() {
      this.bookings = [];
      getListByShipmentId({ shipmentId: this.$route.query.id }).then((response) => {
        var orderItems = [];
        this.isBooking = response.data.length > 0?false:true
        for (var i = 0; i < response.data.length; i++) {
          for (var j = 0; j < response.data[i].bookingItemDOS.length; j++) {
            orderItems.push(response.data[i].bookingItemDOS[j].orderItemId);
            this.orderItemMap[response.data[i].bookingItemDOS[j].orderItemId] =
              response.data[i].bookingItemDOS[j].qty;
          }
        }
        if (orderItems.length > 0) {
          //this.showItems=true;
          getItemList({ ids: orderItems.join(",") }).then((response) => {
            var productIds = [];
            var orderIds = [];
            for (var i = 0; i < response.data.length; i++) {
              response.data[i].bookedQty = this.orderItemMap[response.data[i].id];
              productIds.push(response.data[i].productId);
              orderIds.push(response.data[i].orderId);
            }
            this.itemTableData = response.data;
            getHeaderList({ ids: orderIds.join(",") }).then((response) => {
              for (var i = 0; i < response.data.length; i++) {
                this.$set(
                  this.orderMap,
                  [response.data[i].id],
                  response.data[i].orderNumber
                );
              }
            });
            getProductList({ ids: productIds.join(",") }).then((response) => {
              for (var i = 0; i < response.data.length; i++) {
                this.$set(this.productMapForBook, [response.data[i].id], {
                  name: response.data[i].name,
                  code: response.data[i].code,
                });
              }
            });
          });
        }
      });
    },
    getShipmentDetails(id) {
      shipmentDetails(id).then((response) => {
        if (response.data) {
          this.form.contractNumber = response.data.contractNumber;
          if (response.data.carrier == "TSHG") {
            this.craFlag = true;
          } else {
            this.craFlag = false;
          }
          this.form = Object.assign({}, this.form, response.data);

          this.isPepco = this.form.fromShipperBooking
          const spoIds = this.form.shippingList.map(item => item.id);
          if(spoIds&& spoIds.length>0) {
            getShippingOrderListByIds(spoIds).then(async(response) => {
              this.spoList = response.data
              // 处理cargoInfo
              this.handleCargoInfo(this.spoList, spoIds)
              await this.waitForSoProductList();
              getOrderHeadersList({ shippingOrderIds: spoIds.join(',') }).then(res => {
                console.log(res)
                this.spoItems = []
                for (var order of res.data) {
                  var shipping = this.spoList.filter(item => item.id == order.shippingId)
                  if (shipping.length > 0) {
                    // 如果 order.soRef 没有值的时候再塞 edwin
                    if (!order.soRef) {
                      order.soRef = shipping[0].soRef
                    }
                    // order.soRef = shipping[0].soRef
                    var products = shipping[0].productDOList
                    if (products && products.length > 0)
                      order.hscode = products[0].hscode
                  }
                  for (var item of order.items) {
                    item.soRef = order.soRef
                    item.orderNumber = order.orderNumber
                    item.hscode = order.hscode
                    item.bookedWeight = item.booked * item.outerWeight
                    item.bookedVolume = item.booked && item.length && item.width && item.height ? Number((item.booked * item.length * item.width * item.height / 1000000)) : 0
                    this.spoItems.push(item)
                  }
                }
                // this.getFromOrder()
              })
                .catch(err => {
                  console.log(err)
                })
            })
          }



          this.remoteGetCraNum();

          // 保存原始航段信息（深拷贝，确保后续修改不影响原始数据）
          this.originalVesselInfos = JSON.parse(JSON.stringify(response.data.routerDOList));
          //深拷贝carrier
          this.originalVesselCarrier = JSON.parse(JSON.stringify(this.form.carrier));

          this.form.shipmentRouters = response.data.routerDOList;
          for (var i = 0; i < response.data.containerDOList.length; i++) {
            var d = response.data.containerDOList[i];
            if (d && d.type == 0) {
              this.form.containers.push(d);
            }
          }
          for (var i = 0; i < response.data.productDOList.length; i++) {
            var d = response.data.productDOList[i];
            if (d && d.type == 0) {
              if (d.hazardousMaterials == "{}" || null == d.hazardousMaterials) {
                d.dg = 0;
              } else {
                d.dg = 1;
              }
              d.batteries = Number(d.batteries);
              d.hazardousMaterials = JSON.parse(d.hazardousMaterials);
              d.fileList = [];
              d.uploadData = {};
              this.form.productData.push(d);
            }
          }
          //this.flag
          for(var i=0;i<this.form.containerDOList.length;i++){
            if(this.form.containerDOList[i].requireTemperature){
              this.flag=true
            }
          }
          this.form.shipmentRouters.push({
            pol: response.data.pod,
            etd: null,
            eta: null,
          });
          this.changePol(response.data.pol)
          this.changePod(response.data.pod)
          this.changePort(response.data.originPort)
          this.$set(this.form, "pol", response.data.pol);
          this.$set(this.form, "pod", response.data.pod);
          this.$set(this.form, "originPort", response.data.originPort);
          this.$set(this.form, "destinationPort", response.data.destinationPort);

          const val = this.form.allocationYear;
          if (val !== null && val !== '' && !isNaN(Number(val))) {
              this.onYearChange(Number(val));
            }
        }
      });
    },
    //传递 货物信息
    handleCargoInfo(spoList, spoIds) {
      this.$nextTick(() => {
        this.$refs.shipmentCargoInfo.active(spoList, spoIds)
      })
    },

    changePort(value){
    },
    changeDG(item) {
      if (item.dg == 0) {
        this.$set(item, "hazardousMaterials", {});
      } else {
        this.$set(item, "batteries", 3);
      }
      this.$nextTick(() => {
        // 在DOM更新后执行其他操作 不然switch val 不会改变
        var tempa = this.form.name;
        this.form.name = tempa + " ";
        this.form.name = tempa;
      });
    },
    validatePhoneNumber() {
      const phoneNumber = this.form.phone;
      // 自定义验证逻辑
      if (
        !/^\d+$/.test(phoneNumber) ||
        phoneNumber.length < 8 ||
        phoneNumber.length > 15
      ) {
        this.phoneError = "Please enter a valid phone or landline number";
      } else {
        this.phoneError = "";
      }
    },
    validateEmailAddress() {
      const emailAddress = this.form.email;
      // 自定义验证逻辑
      // 例如，验证是否是有效的电子邮件地址
      if (!isValidEmailAddress(emailAddress)) {
        this.emailError = "Please enter a valid email address";
      } else {
        this.emailError = "";
      }
    },
    handleOptionChange(value) {
      var arr = [];
      for (var i = 0; i < this.containerOptions.length; i++) {
        if (this.containerOptions[i].isReeferContainer == "Yes") {
          arr.push(this.containerOptions[i].type);
        }
      }
      var flag = false;
      for (var i = 0; i < this.form.containers.length; i++) {
        if (arr.indexOf(this.form.containers[i].containerType) > -1) {
          flag = true;
          break;
        }
      }
      this.flag = flag;
    },
    remoteMethod(query) {
      if (query !== "" && query.length >= 3) {
        getVesselList({ vesselCode: query }).then((response) => {
          this.vesselListLes = response.data;
        });
        this.loading = true;
      } else {
        this.vesselListLes = [];
      }
    },
    remoteMethod2(query) {
      if (query !== "" && query.length >= 3) {
        getVesselList({ vesselName: query }).then((response) => {
          this.vesselListLes = response.data;
        });
        this.loading = true;
      } else {
        this.vesselListLes = [];
      }
    },
    setShipmentRouter() {
      if (!this.$route.query.schdule) {
        return;
      }
      var schdule = JSON.parse(atob(this.$route.query.schdule));
      this.$set(this.form, "carrier", schdule.carrier);
      this.form.shipmentRouters[0].etd = schdule.etd;
      this.form.shipmentRouters[0].eta = schdule.eta;

      this.form.shipmentRouters[0].transportMeanName = schdule.vn;
      this.form.shipmentRouters[0].identification = schdule.vc;
      this.form.shipmentRouters[0].voyage = schdule.vo;

      this.form.shipmentRouters[0].pol = schdule.pol;
      this.form.shipmentRouters[1].pod = schdule.pod;
      if (schdule.carrier == "TSHG") {
        this.setSchdulesTSHG(schdule)
      }
    },
    setSchdulesTSHG(schdule) {
      console.log(schdule)
      getVesselList().then((response) => {
          this.vesselList = response.data;
          var schdules = schdule.tshgList
        if(schdules.length>0) {
          this.form.shipmentRouters = []
        }

        for(var i=0;i<schdules.length;i++){
          var sch = schdules[i]
          if(i==schdules.length-1){
              this.form.shipmentRouters.push({
              // pol: keys.length==1?preAssignMap[keys[0]].fnd:schdule.pod,
              pol: schdule.pod,
              transportMode:'SEA',
              etd: null,
              eta: null,
            });
          continue
          }
          if(i!=schdules.length-1&&sch.event=='Departure') {
             // 有船 并且是 departure ；或者barge
            var sch1 = schdules[i+1]
            var schItem  = {
              transportMode:sch.barge,
              etd: sch.eventTime,
              eta: sch1.eventTime,
              transportMeanName:sch.barge=='Barge'?"TBA":sch.vessel,
              service:sch.barge=='Barge'?"Unknown":sch.service,
              voyage:sch.barge=='Barge'?"Unknown":sch.voyage,
              pol:i==0?schdule.pol:sch.portCode,
            }
            if(sch.barge=='Barge') {
              schItem.transportMode = 'BRG'
            }
            if(sch.barge=='Ocean') {
              schItem.transportMode = 'SEA'
            }
            var obj=this.vesselList.find(
                (element) => element.vesselName == schItem.transportMeanName
              )

              if(obj){
                schItem.identification = obj.vesselCode;
                schItem.imo = obj.imo;
              }else{
                schItem.identification =  "Unknown"
                schItem.imo =  "Unknown"
            }
            if(i==0) {
              this.form.shipmentRouters[0] = schItem;
            } else {
              this.form.shipmentRouters.push(schItem);
            }

          }
          this.form = JSON.parse(JSON.stringify(this.form));

        }
        console.log(this.form.shipmentRouters)
      });

    },
    changeVesselCode(item) {
      var obj = this.vesselListLes.find(
        (element) => element.vesselCode == item.identification
      )
       if(obj){
        item.transportMeanName = obj.vesselName
        item.imo =  obj.imo
       }else{
        item.imo =  null
       }

      this.$set(this.form,'tempaax',1)
      this.$delete(this.form, 'tempaax');
    },
    changeVesselName(item) {
      var obj=this.vesselListLes.find(
        (element) => element.vesselName == item.transportMeanName
      )
      if(obj){
        item.identification = obj.vesselCode;
        item.imo = obj.imo;
      }else{
        item.identification =  null
        item.imo =  null
     }
      this.$set(this.form,'tempaax',1)
      this.$delete(this.form, 'tempaax');

    },
    getVesselList() {},
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.partyForm));
          data.partyRole = "," + data.partyRole.join(",") + ",";
          data.status = 0;
          createDeptApply(data).then((response) => {
            this.$modal.msgSuccess("Success");
            this.open = false;
            this.getParty();
          });
        }
      });
    },
    applyNewParty() {
      this.open = true;
    },
    addProduct() {
      let batteries = 3;
      let dg = 0
      if (this.form.productData.length > 0) {
        for (let i = 0; i < this.form.productData.length; i++) {
          if (this.form.productData[i].batteries === 2) {
            batteries = 2
          }
          if (this.form.productData[i].dg) {
            dg = 1
          }
        }
      }
      this.form.productData.push({
        batteries: batteries,
        dg: dg,
        fileList: [],
        uploadData: {},
        hazardousMaterials: {},
      });
    },
    changeBatteries(item) {
      if (item.batteries == 3) {
        item.batteriesLevelTow = [];
      } else {
        this.$set(item, "notToAll", false);
      }
    },
    changeNotToAll(item) {
      if (item.notToAll) {
      }
    },
    getParties(obj, setAp) {
      var vm = this;
      listDept(obj).then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          vm.$set(
            vm.partiesMap,
            response.data[i].id,
            response.data[i].name +
              "\n" +
              (response.data[i].country == null ? "" : response.data[i].country) +
              " " +
              (response.data[i].address == null ? "" : response.data[i].address)
          );
        }

        if (setAp) {
          this.$set(this.form, "agreementParty", response.data[0].id);
        }
        this.$set(this.parties, obj.partyRole, response.data);
      });
    },
    changePol(value) {
      // this.$set(this.form, "originPort", "");
      this.form.shipmentRouters[0].pol = value;
      this.form = JSON.parse(JSON.stringify(this.form))
    },
    changePod(value) {
      // this.$set(this.form, "destinationPort", "");
      this.form.shipmentRouters[this.form.shipmentRouters.length - 1].pol = value;
      this.form = JSON.parse(JSON.stringify(this.form))
    },
    submit(status) {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          var tipFlag = false
          if(status == 0 && this.form.carrier  == 'TSHG'){
            function compare(){
              return function(a,b){
                  var value1 = a["status"];
                  var value2 = b["status"];
                  return parseInt(value1) - parseInt(value2);
              }
            }
            var arr=JSON.parse(JSON.stringify(this.form.shipmentDetailDOS)).filter(item=>item.endDate!=null)
            arr.sort(compare())
            //最后的状态还是 Draft
            if(arr.length>0 && arr[arr.length-1].status == 1){
              tipFlag = true
            }
          }
          if(tipFlag){
            this.$confirm('Any booking information adjustment,kindly inform Tailwind customer service team!', '', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
              type: 'warning'
            }).then(() => {
              this.saveData(status)
            }).catch(() => {
              this.loadingSaveBut = false
            });
          }else{
            this.saveData(status)
          }
        } else {
          return false;
        }
      });
    },
    saveData(status){
      this.loadingSaveBut = true
      var data = JSON.parse(JSON.stringify(this.form));
      console.log(data)
      if (this.form.carrier == 'TSHG' && this.form.por == 'CNNGB' && this.form.pol == 'CNTAG' && this.form.shipmentRouters.length == 1) {
        data.shipmentRouters[0].pol = 'CNNGB';
      }
      for (var i = 0; i < data.shipmentRouters.length; i++) {
        if (i != data.shipmentRouters.length - 1) {
          data.shipmentRouters[i].pod = data.shipmentRouters[i + 1].pol;
        }
      }
      data.shipmentRouters.pop();
      data.routers = JSON.stringify(data.shipmentRouters);
      for (var i = 0; i < data.containers.length; i++) {
        if (data.containers[i].soc == "Yes") {
          flag = true;
        }
      }
      var remark=data.remark.replace(/Reefer Container:.*/g, "");
      data.remark=remark.replace('Reefer Container:','')
      var text='Reefer Container:'
      for (var i = 0; i < data.containers.length; i++) {
        if(data.containers[i].requireTemperature){
          text+=''+data.containers[i].containerType
          +' Ventilation(cbm/hour):'+(data.containers[i].ventClosedOrNot?data.containers[i].ventClosedOrNot:'No')
          +' Humidity(%):'+ (data.containers[i].humidity?data.containers[i].humidity:'No')
          +' O2(%):'+(data.containers[i].o2?data.containers[i].o2:' ')
          +' CO2(%):'+(data.containers[i].co2?data.containers[i].co2:' ')
          +' Drains:'+(data.containers[i].drains?data.containers[i].drains:' ')
          console.log(text)
        }

      }
      if(text=='Reefer Container:'){
        text=''
      }
      if (!data.remark.endsWith('\n')) { // 如果末尾不包含换行符
        text = '\n' + text
      }

      data.remark=data.remark + text
      data.containers = JSON.stringify(data.containers);
      var flag = false;
      for (var i = 0; i < data.productData.length; i++) {
        data.productData[i].hazardousMaterials = JSON.stringify(
          data.productData[i].hazardousMaterials
        );
        if (data.productData[i].dg == 1) {
          flag = true;
        }
        if (data.productData[i].dg === 1 || data.productData[i].batteries === 2) {
          if (data.productData[i].files.length < 1) {
            this.$notify.error("Please upload relevant documents of battery-related goods or dangerous goods, such as MSDS!")
            this.loadingSaveBut = false
            return
          }
        }
      }
      if(this.shipmentNote.cancelRemark){
       var notes = {"shipmentId": this.form.id,
                    "cancelCode": this.shipmentNote.cancelCode,
                    "cancelSubCode": this.shipmentNote.cancelSubCode,
                    "cancelRemark": this.shipmentNote.cancelRemark
                    }
        createNote(notes).then((response) => {});
      }

      if(this.changeVesselFlag){
        // 添加换船信息
        var vesselChange = [];
        // 获取两个数组的最大长度，确保所有数据都能被处理
        const maxLength = Math.max(this.originalVesselInfos.length, this.filteredShipmentRouters.length);

        for (let i = 0; i < maxLength; i++) {
          // 当数组长度不足时，使用空对象避免报错
          const original = this.originalVesselInfos[i] || {};
          const newItem = this.filteredShipmentRouters[i] || {};

          vesselChange.push({
            carrierRolling: this.vesselChangeReason.carrierRolling,
            reason: this.vesselChangeReason.reason,
            originalAllocationWeek: this.vesselChangeReason.carrierRolling === 'Carrier rollover' ? this.vesselChangeReason.originalAllocationWeek : '',
            // 原始船期信息
            originalPol: original.pol || '',
            originalPod: original.pod || '',
            originalEtd: original.etd || '',
            originalEta: original.eta || '',
            originalVessel: original.transportMeanName || '',
            originalVoyage: original.voyage || '',
            originalService: original.service || '',
            // 新船期信息
            newPol: newItem.pol || '',
            //如果是最后一层船就直接用 form.pod
            newPod: (i == this.filteredShipmentRouters.length - 1 ? this.form.pod : newItem.pod),
            newEtd: newItem.etd || '',
            newEta: newItem.eta || '',
            newVessel: newItem.transportMeanName || '',
            newVoyage: newItem.voyage || '',
            newService: newItem.service || ''
          });
        }
        data.vesselChange = JSON.stringify(vesselChange)
      }
      if (flag  && this.form.carrier == "TSHG") {
        this.$alert("SOC、DG Please Contact Tailwind.CS@kblinersh.com", "Tips", {
          confirmButtonText: "OK",
          callback: (action) => {
            if (action == "confirm") {
              data.productData = JSON.stringify(data.productData);
              data.bookingIds = this.$route.query.ids;
              data.status = status;
              if(this.$route.query.source == 'booking-order'){
                data.source = 'booking-order';
              }
              updateTailwindShipment(data).then((response) => {
                for (var i = 0; i < response.data.productIds.length; i++) {
                  this.form.productData[i].uploadData.exId =
                    response.data.productIds[i];
                  this.$refs["upload" + i][0].submit();

                  // 如果文件没有更改直接根据，不更改exId会导致product找不到已上传的文件
                  if (this.form.productData[i].files.length > 0) {
                    this.form.productData[i].files.forEach(file => {
                      if (file.id && file.exId) {
                        updateFileExId({
                          id: file.id,
                          exId: response.data.productIds[i]
                        })
                      }
                    })
                  }
                }
                this.loadingSaveBut = true
                if(this.$route.query.source == 'booking-order'){
                  this.$router.push("/shipment/booking-order");
                } else {
                  this.$router.push("/shipment/detail?id=" + response.data.shipmentId);
                }
              });
            }
          },
        });
      } else {
        data.productData = JSON.stringify(data.productData);
        data.bookingIds = this.$route.query.ids;
        data.status = status;
        if(this.$route.query.source == 'booking-order'){
              data.source = 'booking-order';
            }
        updateTailwindShipment(data).then((response) => {
          for (var i = 0; i < response.data.productIds.length; i++) {
            this.form.productData[i].uploadData.exId = response.data.productIds[i];
            this.$refs["upload" + i][0].submit();

            // 如果文件没有更改直接根据，不更改exId会导致product找不到已上传的文件
            if (this.form.productData[i].files.length > 0) {
              this.form.productData[i].files.forEach(file => {
                if (file.id && file.exId) {
                  updateFileExId({
                    id: file.id,
                    exId: response.data.productIds[i]
                  })
                }
              })
            }
          }
          this.loadingSaveBut = true
          console.log(this.$route.query.source)
                if(this.$route.query.source == 'booking-order'){
                  this.$router.push("/shipment/booking-order");
                } else {
                  this.$router.push("/shipment/detail?id=" + response.data.shipmentId);
                }
        });
      }
    },

    getLabel(code, type) {
      var item = this.portOptions.find((item) => item.code == code);
      if (item) {
        return item.name;
      } else {
        return code;
      }
    },
    getContainerList() {
      getContainerList().then((response) => {
        this.containerOptions = response.data;
      });
    },
    remoteMethod3(query) {
      if (query !== "" && query.length >= 3) {
        getVesselList({ imo: query }).then((response) => {
          this.vesselListLes = response.data;
        });
        this.loading = true;
      } else {
        this.vesselListLes = [];
      }
    },
    changeVesselIMO(item){
      var obj=this.vesselListLes.find(
        (element) => element.imo == item.imo
      )
      if(obj){
        item.identification =  obj.vesselCode
        item.transportMeanName =  obj.vesselName
      }

      this.$set(this.form,'tempaax',1)
      this.$delete(this.form, 'tempaax');
    },
    handleDelete(index) {
      this.form.productData.splice(index, 1);
    },
    handleDeleteContainer(index) {
      this.form.containers.splice(index, 1);
    },
    addContainers() {
      this.form.containers.push({});
    },
    getPortList() {
      getOriginDeliveryList().then((response) => {
        this.portOptions = response.data;
        this.setShipmentRouter();
      });
    },

    selectBlur(item) {
      for (var i = 0; i < this.hsCodeList.length; i++) {
        if (item.hscode == this.hsCodeList[i].hsCode) {
          item.productEnglishName = this.hsCodeList[i].productEnglishName;
        }
      }
    },
    selectClear() {},

    remoteGetHsCode(query) {
      if (query !== "" && query.length >= 2) {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.getHsCodeListByCode(query);
          this.options = this.hsCodeList.filter((item) => {
            return item.hsCode.toLowerCase().indexOf(query.toLowerCase()) > -1;
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
    shippingProductTotalAllBooked() {
      if(!this.receiveSOProductList || this.receiveSOProductList.length == 0) return 0
      return this.receiveSOProductList.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(typeof currentValue.numberOfPackages == 'undefined' ? 0 : currentValue.numberOfPackages)
      }, 0)
    },
    shippingProductTotalAllGrossWeight() {
      if(!this.receiveSOProductList || this.receiveSOProductList.length == 0) return 0
      return this.receiveSOProductList.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(typeof currentValue.grossWeight == 'undefined' ? 0 : currentValue.grossWeight)
      }, 0)
    },
    shippingProductTotalAllVolume() {
      if(!this.receiveSOProductList || this.receiveSOProductList.length == 0) return 0
      return this.receiveSOProductList.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(typeof currentValue.volume == 'undefined' ? 0 : currentValue.volume)
      }, 0)
    },
    getFromOrder() {
      this.form.productFromOrder = 1
      var weight = this.totalAllGrossWeight().toFixed(3);
      var volume = this.totalAllVolume().toFixed(3);
      var product = this.form.productData[0]
      var booked = this.totalAllBooked()
      product.numberOfPackages = booked
      product.grossWeight = weight
      product.volume = volume
      var units = this.getDictDatas(this.DICT_TYPE.SYSTEM_UNITS);
      var excelUnit = this.spoItems[0].bookedUnit
      if (excelUnit == 'CT') {
        excelUnit = 'CTNS'
      }
      if (excelUnit == null) {
        excelUnit = 'CTNS'
      }
      console.log(excelUnit)
      if (excelUnit != null) {
        for (var unit of units) {
          if (unit.label == excelUnit.toUpperCase() || unit.value == excelUnit.toUpperCase()) {
            product.packages = unit.value
          }
        }
      }
      var productName = this.spoItems[0].productName
      product.productEnglishName = productName

      var hscode = this.spoItems[0].hscode
      product.hscode = hscode
      this.form.productData = JSON.parse(JSON.stringify(this.form.productData))

    },
    getFromSOProductData() {
      this.form.productFromOrder = 1
      if (this.receiveSOProductList && this.receiveSOProductList.length > 0) {
        var weight = this.shippingProductTotalAllGrossWeight().toFixed(3)
        var volume = this.shippingProductTotalAllVolume().toFixed(3)
        var product = this.form.productData[0]
        var booked = this.shippingProductTotalAllBooked()
        product.numberOfPackages = booked
        product.grossWeight = weight
        product.volume = volume
        var units = this.getDictDatas(this.DICT_TYPE.SYSTEM_UNITS)
        var excelUnit = this.receiveSOProductList[0].bookedUnit
        if (excelUnit == 'CT') {
          excelUnit = 'CTNS'
        }
        if (excelUnit == null) {
          excelUnit = 'CTNS'
        }
        console.log(excelUnit)
        if (excelUnit != null) {
          for (var unit of units) {
            if (unit.label == excelUnit.toUpperCase() || unit.value == excelUnit.toUpperCase()) {
              product.packages = unit.value
            }
          }
        }
        // 填充hs code
        var hscode = this.receiveSOProductList[0].hscode
        product.hscode = hscode

        const productNames = this.receiveSOProductList.map(item => item.productEnglishName).join('\n');
        product.productEnglishName = productNames
        console.log("productNames", productNames);
      }
      this.form.productData = JSON.parse(JSON.stringify(this.form.productData))
    },
    // 获取so product list
    handleSoProductList(soProductList){
      this.receiveSOProductList = soProductList
      console.log("handleSoProductList", soProductList);

      if (this._resolveSoProductList) {
        // 通知 promise 完成
        this._resolveSoProductList();
        this._resolveSoProductList = null;
      }
    },
    waitForSoProductList() {
      return new Promise(resolve => {
        this._resolveSoProductList = resolve;
      });
    },

     // 处理换船复选框变更
    handleChangeVessel(checked) {
      if (checked) {
        // 直接显示对话框，使用已加载的 originalVesselInfos
        this.changeVesselDialog = true;
      } else {
        // 取消勾选时重置
        this.vesselChangeReason = { carrierRolling: '', reason: '' };
      }
    },

    // 判断指定航段的指定字段是否存在差异
    isSegmentDifferent(segmentIndex, field) {
      var original = this.originalVesselInfos[segmentIndex];
      var newSegment = this.form.shipmentRouters[segmentIndex];
      if('carrier' == field){
        original = this.originalVesselCarrier
        newSegment = this.form.carrier
        return original != newSegment
      }

      // 若一方存在另一方不存在，视为差异
      if ((original && !newSegment) || (!original && newSegment)) return true;

      // 若双方都不存在，视为无差异
      if (!original && !newSegment) return false;

      // 双方都存在时比较字段值
      return original[field] !== newSegment[field];
    },
    generateAvailableYears() {
      const currentYear = new Date().getFullYear()
      const years = []
      for (let y = currentYear; y <= currentYear + 3; y++) {
        years.push(y)
      }
      this.availableYears = years
    },

    onYearChange(year) {
      this.generateWeeksForYear(year)
    },

    generateWeeksForYear(year) {
      const weeks = this.getWeeksInYear(year)

      const today = new Date()
      const currentYear = today.getFullYear()
      const currentWeek = this.getWeekNumber(today)

      // this.availableWeeks = weeks.filter(week => {
      //   if (year === currentYear) {
      //     return week >= currentWeek // 当前年，过滤掉之前的周
      //   }
      //   return true
      // })
      this.availableWeeks = weeks
    },

    getWeeksInYear(year) {
      const weeks = []
      let date = new Date(year, 0, 1) // 从1月1日开始

      // 移动到第一个周一（ISO周从周一开始）
      while (date.getDay() !== 1) {
        date.setDate(date.getDate() + 1)
      }

      while (date.getFullYear() === year || (date.getMonth() === 0 && date.getDate() < 7)) {
        const week = this.getWeekNumber(date)
        if (!weeks.includes(week)) {
          weeks.push(week)
        }
        date.setDate(date.getDate() + 7)
      }

      return weeks.sort((a, b) => a - b)
    },
    getWeekNumber(date) {
      // ISO Week Number
      const target = new Date(date.valueOf())
      const dayNr = (date.getDay() + 6) % 7
      target.setDate(target.getDate() - dayNr + 3)
      const firstThursday = target.valueOf()
      target.setMonth(0, 1)
      if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7))
      }
      return 1 + Math.ceil((firstThursday - target) / 604800000)
    },
    checkShippingSIStatus() {
      // 检查SI/VGM Submit to Carrier是否完成，只有完成了才显示Update Shipping Instructions按钮
      checkShippingSIStatus({ shipmentId: this.$route.query.id }).then(res => {
        this.isShowSI = res.data
      })
    },
    updateShippingSI() {
      this.siVisible = true
    },
    handleClose() {
      this.siVisible = false
    }
  },
  computed: {
    // 过滤出有船名的新航段
    filteredShipmentRouters() {
      return this.form.shipmentRouters.filter(r => r.transportMeanName);
    },
        // zane 计算是否展示
    isSelectedContractPremium() {
      if (!this.form.contractNumber) return false;
      const selected = this.craList.find(
        c => c.contractNo === this.form.contractNumber
      );
      return selected?.contractType === 'Premium';
    }
  },
};
// 自定义函数用于验证电子邮件地址
function isValidEmailAddress(email) {
  // 自定义验证逻辑
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
</script>
<style scoped>
.company-option-with-tooltip {
  display: block;
  overflow: hidden;
  white-space: nowrap;
}


/* 换船弹框样式 */
.vessel-change-dialog .el-dialog__body {
  padding: 20px;
}

.vessel-change-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comparison-section {
  display: flex;
  gap: 20px;
  align-items: center;
}

.info-card {
  flex: 1;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.original-info .card-header {
  background-color: #f5f7fa;
  color: #606266;
}

.new-info .card-header {
  background-color: #f0f9eb;
  color: #52c41a;
}

.card-header {
  padding: 10px 10px;
  display: flex;
  align-items: center;
  font-weight: 500;
}

.card-header i {
  margin-right: 8px;
  font-size: 16px;
}

.arrow-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.arrow-icon {
  font-size: 24px;
  color: #409eff;
  transform: rotate(90deg);
}

.reason-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.el-descriptions__item-label {
  font-weight: 500;
  color: #606266;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
  border-top: 1px solid #e9e9e9;
  margin-top: 10px;
}

/* 表单样式优化 */
.vessel-change-dialog .el-form-item {
  margin-bottom: 15px;
}

.vessel-change-dialog .el-select,
.vessel-change-dialog .el-input,
.vessel-change-dialog .el-date-picker {
  width: 100%;
}

/* 不一致数据高亮样式 */

.highlight-label {
  color: #e6a23c !important;
  font-weight: bold !important;
}
.highlight-value {
  background-color: #fffbee;
  color: #e6a23c;
  padding: 2px 4px;
  border-radius: 4px;
  font-weight: bold;
}

/* 空航段样式 */
.empty-segment {
  background-color: #f9f9f9;
  border: 1px dashed #e9e9e9;
}
.empty-segment-text {
  text-align: center;
  padding: 40px 0;
  color: #909399;
  font-style: italic;
}

.segment-container-all{
  /* 最大高度 */
  max-height: 320px;
  overflow-y: auto;
}
/* 航段容器样式 */
.segment-container {
  border: 1px solid #e9e9e9;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
}
.segment-container:last-child {
  margin-bottom: 0;
}

/* 对比区域样式 */
.comparison-section {
  display: flex;
  align-items: stretch;
  gap: 20px;
}
.info-card {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
}
.arrow-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
}
.arrow-icon {
  font-size: 24px;
  color: #409eff;
  transform: rotate(90deg);
}

/* 原因区域样式 */
.reason-descriptions{
  margin-bottom: 10px;
}
/* 原因区域样式 */
.reason-descriptions .el-descriptions__item-label {
  width: 140px;
  font-weight: 500;
}
.required-label::before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
</style>
<style>
.company-full-width-tooltip-shipment-update{
  white-space: nowrap !important;
  max-width: none !important;
  width: auto !important;
}
</style>
<style lang="scss" scoped>
.tip {
  font-size: 12px;
  color: #E5951C;
  padding: 5px 20px 5px 5px;
  background: #FFF5E6;
  border-radius: 5px;
  width: fit-content;
  .el-icon-warning{
    margin-right:5px ;
    color: #E5951C;
  }
}
</style>
