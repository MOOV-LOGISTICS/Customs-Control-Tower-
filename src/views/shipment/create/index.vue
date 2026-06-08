<template>
  <div class="app-container shipment-create" style="width:100%; margin: 0 auto">
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

    <el-dialog title="Add new party" :visible.sync="open" width="800px" append-to-body>
      <el-form :show-message="false" size="mini" ref="form" :model="partyForm" label-width="160px">
        <el-row :gutter="30">
          <el-col :span="24" v-if="false">
            <el-form-item required label="Owner Organization" prop="parentId">
              <treeselect v-model="partyForm.parentId" :options="deptOptions" :normalizer="normalizer" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item required label="Company Type" prop="partyRole">
              <el-checkbox-group v-model="partyForm.partyRole" size="mini">
                <el-checkbox v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_PARTY_ROLE)" :key="dict.value" :label="dict.label" :value="dict.value" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Company Full name" prop="name">
              <el-input v-model="partyForm.name" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item required label="Country" prop="country">
              <el-select v-model="partyForm.country" clearable>
                <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_COUNTRY)" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item required label="City" prop="city">
              <el-input v-model="partyForm.city" autocomplete="off" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="ZIP Code" prop="zip">
              <el-input v-model="partyForm.zip" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item required label="Company Address" prop="address">
              <el-input type="textarea" v-model="partyForm.address" autocomplete="off" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item required label="Company USCI/EORI" prop="companyUsci">
              <el-input v-model="partyForm.companyUsci" autocomplete="off" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item required label="" prop="companyVatEori">
              <el-input v-model="partyForm.companyVatEori" autocomplete="off" />
            </el-form-item>
          </el-col>-->

          <el-col :span="12">
            <el-form-item required label="Contact Name" prop="localName">
              <el-input v-model="partyForm.localName" autocomplete="off" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="Telephone" prop="phone">
              <el-input v-model="partyForm.phone" autocomplete="off" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item required label="Email" prop="email">
              <el-input v-model="partyForm.email" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitForm">
          {{
          $t("purchaseOrder.confirm")
          }}
        </el-button>
        <el-button size="mini" @click="open = false">
          {{
          $t("purchaseOrder.cancel")
          }}
        </el-button>
      </div>
    </el-dialog>
    <el-card class="pd-20">
      <h3 style="text-align: right" v-show="showTips">
        <p>
          {{ $t("booking.pleaseContact") }}
          <a style="border-bottom: 1px solid #00f; color: #090" v-bind:href="'mailto:' + 'tipsMail'">{{ tipsMail }}</a>
        </p>
        <el-divider></el-divider>
        <div>
          <el-row>
            <el-col :span="20" style="display: flex;">
              <el-tag size="small" style="margin-right: 5px;  font-size: 14px; " v-for="spo in spoList" :key="spo.id">
                <el-link v-show="isPepco" type="primary" target="_blank" :href="'/shipment/ppshippingOrderDetail?id='+spo.id">{{ spo.soRef }}</el-link>
                <el-link v-show="!isPepco" type="primary" target="_blank" :href="'/shipment/shippingBookingDetail?id='+spo.id">{{ spo.soRef }}</el-link>
              </el-tag>
            </el-col>
            <el-col :span="4" style="display: flex; float: right; justify-content: flex-end;">
              <el-button @click="applyNewParty" type="primary">Add new party</el-button>
            </el-col>
          </el-row>
        </div>
        <el-divider></el-divider>
      </h3>

      <el-form v-loading="submitLoading" :model="form" ref="form" :show-message="false" label-width="150px">
        <el-descriptions style="box-shadow: none;" class="margin-top" title :column="4" size="mini" border>
          <el-descriptions-item>
            <template slot="label">Carrier</template>
            <el-form-item required prop="carrier">
              <el-select @change="changeCarrier" filterable v-model="form.carrier">
                <el-option v-if="dict.value=='TSHG'" v-for="dict in getDictDatas(DICT_TYPE.CARRIER)" :key="dict.value" :label="dict.label+' ('+dict.value+')'" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">Contract Type</template>
            <el-form-item required prop="contractType">
              <el-select filterable v-model="form.contractType">
                <el-option v-for="dict in getDictDatas(DICT_TYPE.CARRIAGE_CONTRACT)" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item v-if="isSelectedContractPremium">
           <template slot="label">
              <span v-if="isSelectedContractPremium" style="color:red;">*</span>Reason of Premium
            </template>
            <el-form-item :rules="[{ required: true, message: 'Reason of Premium is required' }]" prop="reasonOfPremium">
              <el-select filterable v-model="form.reasonOfPremium">
                <el-option v-for="dict in getDictDatas(DICT_TYPE.Reason_Of_Premium)" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">CRA Number</template>
            <el-row :gutter="form.carrier=='MAEU'?20:0">
              <el-col :span="form.carrier=='MAEU'?12:24">
                <el-form-item required prop="contractNumber">
                  <el-select filterable allow-create v-model="form.contractNumber" @change="remoteGetCraNum" placeholder="Input to select or Select">
                    <el-option v-for="dict in craList" :key="dict.contractNo" :label="dict.contractNo" :value="dict.contractNo" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="form.carrier=='MAEU'">
                <el-form-item :required="form.carrier=='MAEU'" prop="specialAllocation">
                  <el-select placeholder="Type" v-model="form.specialAllocation">
                    <el-option label="Standard" value="Standard"></el-option>
                    <el-option label="Floating" value="Floating"></el-option>
                    <el-option label="Alwaysspace" value="Alwaysspace"></el-option>
                    <el-option label="Addtional" value="Addtional"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">Payment Term</template>
            <el-form-item required prop="paymentTerm">
              <el-select filterable v-model="form.paymentTerm">
                <el-option v-for="dict in getDictDatas(DICT_TYPE.PAYMENT_TERM)" :key="dict.value" :label="dict.value" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">Place of Receipt</template>
            <el-form-item required prop="pol">
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
            <template slot="label">Port of Loading</template>
            <el-form-item required prop="originPort">
              <el-select @change="changePort" v-model="form.originPort" filterable>
                <el-option
                  v-for="(item, index) in craFlag
                                                ? portOptions.filter((item) => {
                                                    return cra_origin.indexOf(item.code) > -1;
                                                  })
                                                : portOptions"
                  :key="index + 'pol3'"
                  :label="item.name+' ('+item.code+')'"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">Port of discharge</template>
            <el-form-item required prop="destinationPort">
              <el-select v-model="form.destinationPort" filterable>
                <el-option
                  v-for="(item, index) in craFlag
                                                ? portOptions.filter((item) => {
                                                    return cra_disch.indexOf(item.code) > -1;
                                                  })
                                                : portOptions"
                  :key="index + 'pol4'"
                  :label="item.name+' ('+item.code+')'"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">Final Destination</template>
            <el-form-item required prop="pod">
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

          <el-descriptions-item>
            <template slot="label">Agreement Party</template>
            <el-form-item :required="form.carrier=='TSHG'" prop="agreementParty">
              <el-select clearable v-model="form.agreementParty" filterable>
                <el-option v-for="item in parties['Agreement Party']" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item v-if="!this.$auth.hasPermi('system:allocation:year-week:show')">
            <template slot="label">Allocation Week</template>
            <el-form-item prop="allocationWeek">
              <el-select :disabled="form.carrier != 'MAEU'" clearable v-model="form.allocationWeek" filterable>
                <el-option v-for="(item,index_a) in allocationWeekList" :key="index_a" :value="item" :label="item"></el-option>
              </el-select>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item v-if="this.$auth.hasPermi('system:allocation:year-week:show')">
            <template slot="label">Allocation Year</template>
            <el-form-item prop="allocationYear">
              <el-select v-model="form.allocationYear" placeholder="Select Year" @change="onYearChange" clearable>
                <el-option v-for="year in availableYears" :key="year" :label="year" :value="year" />
              </el-select>
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item v-if="this.$auth.hasPermi('system:allocation:year-week:show')">
            <template slot="label">Allocation Week</template>
            <el-form-item prop="allocationWeek">
              <el-select v-model="form.allocationWeek" placeholder="Select Week" clearable>
                <el-option v-for="week in availableWeeks" :key="week" :label="week" :value="week" />
              </el-select>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item v-if="$auth.hasPermi('shipment:create-notpb')&&showCustomer">
            <template slot="label">Customer</template>
            <el-form-item :required="$auth.hasPermi('shipment:create-notpb')" prop="customer">
              <el-select clearable v-model="form.customer" filterable>
                <el-option v-for="item in parties['Customer']" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">Order Numbers</template>
            <el-form-item prop="poNumbers">
              <el-input v-model="form.poNumbers" type="textarea" rows="3" />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">Remark</template>

            <el-form-item prop="remark">
              <el-input v-model="form.remark" type="textarea" rows="3" />
            </el-form-item>
          </el-descriptions-item>
        </el-descriptions>

        <el-card style="box-shadow: none;border:1px solid #ddd!important;border-radius: 0px!important;margin: 15px 0px;padding: 10px 0px;">
          <el-row :gutter="20" style="padding-bottom: 10px;  padding-top: 20px;">
            <el-col :span="8">
              <div style="text-indent: 10px;margin-bottom:8px">
                <b style="font-size: 15px">Shipper</b>
              </div>
              <el-descriptions style="padding-bottom: 5px;    box-shadow: none;" :colon="false" class="margin-top parties-desc" title :column="1" size="mini">
                <el-descriptions-item>
                  <template slot="label">
                    <span style="width: 64px; color: #666; ">Name</span>
                  </template>
                  <el-form-item required prop="shipper" style=" width: 100% !important;">
                    <el-select filterable clearable v-model="form.shipper">
                      <el-option v-for="item in parties['Shipper']" :key="item.id+'shipper'" :value="item.id" :label="item.name">
                        <el-tooltip placement="top" :open-delay="100" popper-class="company-full-width-tooltip-shipment-create">
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
                  <div style="padding:6.5px 0px;">{{getShipper().address}}</div>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <span style="width: 64px; color: #666; ">Phone</span>
                  </template>
                  <div style="padding:6.5px 0px">{{getShipper().phone}}</div>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <span style="width: 64px; color: #666; ">Fax</span>
                  </template>
                  <div style="padding:6.5px 0px">{{getShipper().fax}}</div>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <span style="width: 64px; color: #666; ">Email</span>
                  </template>
                  <div style="padding:6.5px 0px">{{getShipper().email}}</div>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label">
                    <span style="width: 64px; color: #666; ">Enterprise</span>
                  </template>
                  <div style="padding:6.5px 0px">{{getShipper().companyUsci}}</div>
                </el-descriptions-item>
              </el-descriptions>
            </el-col>
            <el-col :span="8">
              <div style="text-indent: 10px;margin-bottom:8px">
                <b style="font-size: 15px">Consignee</b>
              </div>
              <el-descriptions style="padding-bottom: 5px;    box-shadow: none;" :colon="false" class="margin-top parties-desc" title :column="1" size="mini">
                <el-descriptions-item>
                  <template slot="label">
                    <span style="width: 64px; color: #666; ">Name</span>
                  </template>
                  <el-form-item required prop="consignee" style=" width: 100% !important;">
                    <el-select remote clearable filterable v-model="form.consignee">
                      <el-option v-for="item in parties['Consignee']" :key="item.id+'cos'" :value="item.id" :label="item.name">
                        <el-tooltip placement="top" :open-delay="100" popper-class="company-full-width-tooltip-shipment-create">
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
                  <div style="padding:6.5px 0px">{{getConsignee().address}}</div>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label">
                    <span style="width: 64px; color: #666; ">Phone</span>
                  </template>
                  <div style="padding:6.5px 0px">{{getConsignee().phone}}</div>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <span style="width: 64px; color: #666; ">Fax</span>
                  </template>
                  <div style="padding:6.5px 0px">{{getConsignee().fax}}</div>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <span style="width: 64px; color: #666; ">Email</span>
                  </template>
                  <div style="padding:6.5px 0px">{{getConsignee().email}}</div>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label">
                    <span style="width: 64px; color: #666; ">Enterprise</span>
                  </template>
                  <div style="padding:6.5px 0px">{{getConsignee().companyUsci}}</div>
                </el-descriptions-item>
              </el-descriptions>
            </el-col>
            <el-col :span="8">
              <div style="text-indent: 10px;margin-bottom:8px">
                <b style="font-size: 15px">Notify Party</b>
              </div>
              <el-descriptions style="padding-bottom: 5px;    box-shadow: none;" :colon="false" class="margin-top parties-desc" title :column="1" size="mini">
                <el-descriptions-item>
                  <template slot="label">
                    <span style="width: 64px; color: #666;color: #666; ">Name</span>
                  </template>
                  <el-form-item required prop="notifyParty" style=" width: 100% !important;">
                    <el-select remote clearable filterable v-model="form.notifyParty">
                      <el-option v-for="item in parties['Notify Party']" :key="item.id+'np'" :value="item.id" :label="item.name">
                        <el-tooltip placement="top" :open-delay="100" popper-class="company-full-width-tooltip-shipment-create">
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
                  <div style="padding:6.5px 0px">{{getNotifyParty().address}}</div>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label">
                    <span style="width: 64px; color: #666; ">Phone</span>
                  </template>
                  <div style="padding:6.5px 0px">{{getNotifyParty().phone}}</div>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <span style="width: 64px; color: #666; ">Fax</span>
                  </template>
                  <div style="padding:6.5px 0px">{{getNotifyParty().fax}}</div>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <span style="width: 64px; color: #666; ">Email</span>
                  </template>
                  <div style="padding:6.5px 0px">{{getNotifyParty().email}}</div>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label">
                    <span style="width: 64px; color: #666; ">Enterprise</span>
                  </template>
                  <div style="padding:6.5px 0px">{{getNotifyParty().companyUsci}}</div>
                </el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>
        </el-card>

        <el-card style="box-shadow: none;border:1px solid #ddd!important;border-radius: 0px!important;margin: 15px 0px;padding: 10px 0px;">
          <el-descriptions title="Booking Contact Info" style="box-shadow: none;" :column="3" border>
            <el-descriptions-item>
              <template slot="label">{{ $t('booking.name') }}</template>
              <el-form-item required prop="name">
                <el-input v-model="form.name" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">{{ $t('booking.phone') }}</template>
              <el-form-item required prop="phone">
                <el-input v-model="form.phone" @blur="validatePhoneNumber" />
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">{{ $t('booking.email') }}</template>
              <el-form-item required prop="email" type="email">
                <el-input v-model="form.email" @blur="validateEmailAddress" />
              </el-form-item>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card style="box-shadow: none;border:1px solid #ddd!important;border-radius: 0px!important;margin: 15px 0px;padding: 10px 0px;">
          <!--增加 货物信息-->
          <div>
            <shipment-cargo-info ref="shipmentCargoInfo" @so-product-list="handleSoProductList" />
          </div>

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
                  <span>
                    {{
                    scope.row.productCode
                    }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="productId" label="Product Name">
                <template v-slot="scope">
                  <span>
                    {{
                    scope.row.productName
                    }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="requested" :label="'Ordered (Cartons)'">
                <template v-slot="scope">{{ scope.row.outerQty }}</template>
              </el-table-column>
              <el-table-column prop="bookedQty" :label="'Booked (Cartons)'">
                <template v-slot="scope">{{ scope.row.booked }}</template>
              </el-table-column>

              <el-table-column prop="totalWeight" :label="'Total Weight (KG)'">
                <template v-slot="scope">{{ scope.row.bookedWeight }}</template>
              </el-table-column>
              <el-table-column prop="totalVolume" :label="'Total Volume (CBM)'">
                <template v-slot="scope">{{ scope.row.bookedVolume }}</template>
              </el-table-column>
          </el-table>-->
          <!--  加汇总和带入按钮 -->

          <!-- <div style="text-align: right;margin-top: 8px; ">
              <span style="margin-right:20px">Total Booked Cartons：{{ totalAllBooked() }}</span>
              <span style="margin-right:20px">Total Gross Weight：{{ totalAllGrossWeight().toFixed(3) }}</span>
              <span style="margin-right:20px">Total Volume：{{ totalAllVolume().toFixed(3) }}</span>
            </div>
          </div>-->

          <SOMainTable :tableData="soTableData" ref="table" v-if="soTableData.length>0" :tableHeight="null"></SOMainTable>
          <pagination v-if="soTableData.length>0" :total="soLineTotal" :page.sync="soQueryParams.pageNo" :limit.sync="soQueryParams.pageSize" :page-sizes="[10, 20, 50]" @pagination="initSO" />
          <el-table style="margin-bottom:10px" border v-if="itemTableData.length > 0" :data="itemTableData">
            <el-table-column prop="orderId" label="Order Number">
              <template v-slot="scope">
                <span>{{ orderMap[scope.row.orderId] }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="productId" label="Product Code">
              <template v-slot="scope">
                <span>
                  {{
                  productMapForBook[scope.row.productId]
                  ? productMapForBook[scope.row.productId].code
                  : ""
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="productId" label="Product Name">
              <template v-slot="scope">
                <span>
                  {{
                  productMapForBook[scope.row.productId]
                  ? productMapForBook[scope.row.productId].name
                  : ""
                  }}
                </span>
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
              <template v-slot="scope">{{ scope.row.requested }}{{ scope.row.requestUnit }}</template>
            </el-table-column>
            <el-table-column prop="bookedQty" :label="$t('booking.booked')">
              <template v-slot="scope">{{ scope.row.bookedQty }}{{ scope.row.bookedUnit }}</template>
            </el-table-column>
          </el-table>
          <el-row>
            <el-button @click="addProduct" size="mini" type="primary">
              {{
              $t("booking.addProduct")
              }}
            </el-button>
            <el-button @click="applyNewHsCode" size="mini" type="primary">Request new HS code</el-button>
            <el-button v-show="receiveSOProductList && receiveSOProductList.length > 0" @click="getFromSOProductData" size="mini" type="primary">Get From Shipper Booking</el-button>
          </el-row>
          <el-descriptions border style="box-shadow: none;" :colon="false" direction="vertical" v-for="(item, i) in form.productData" :key="'product' + i" class="margin-top" title :column="6">
            <template slot="extra">
              <el-button v-if="i != 0" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(i)">{{ $t("search.delete") }}</el-button>
            </template>
            <el-descriptions-item :label="$t('booking.productEnglishName')">
              <el-form-item required :prop="'productData.' + i + '.productEnglishName'">
                <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2 }" v-model="item.productEnglishName" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.hsCode')">
              <!-- <el-input v-model="item.hscode" /> -->
              <el-select filterable clearable remote v-model="item.hscode" :remote-method="remoteGetHsCode" @clear="selectClear">
                <el-option v-for="dict in hsCodeList" :key="dict.id" :label="dict.hsCode" :value="dict.hsCode" />
              </el-select>
            </el-descriptions-item>
            <el-descriptions-item label="Number Of Packages">
              <el-form-item required :prop="'productData.' + i + '.numberOfPackages'">
                <el-input-number v-model="item.numberOfPackages" @blur="item.numberOfPackages = $event.target.value.trim()" :controls="false" :precision="0" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="Packages">
              <el-form-item required :prop="'productData.' + i + '.numberOfPackages'">
                <el-select filterable v-model="item.packages" placeholder>
                  <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="Gross Weight(KG)">
              <el-form-item required :prop="'productData.' + i + '.grossWeight'">
                <el-input-number v-model="item.grossWeight" @blur="item.grossWeight = $event.target.value.trim()" :controls="false" :precision="3" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="Volume(CBM)">
              <el-form-item required :prop="'productData.' + i + '.volume'">
                <el-input-number v-model="item.volume" @blur="item.volume = $event.target.value.trim()" :controls="false" :precision="3" />
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item label="DG">
              <el-switch @change="changeDG(item)" :active-value="1" :inactive-value="0" v-model="item.dg" active-text="Yes" inactive-text="No"></el-switch>
            </el-descriptions-item>
            <el-descriptions-item v-if="item.dg == 0" label="Batteries">
              <el-radio-group @input="changeBatteries(item)" v-model="item.batteries">
                <el-radio :label="2" border>Has batteries</el-radio>
                <el-radio :label="3" border>No batteries</el-radio>
              </el-radio-group>
            </el-descriptions-item>

            <el-descriptions-item :label="dict.label" v-for="dict in getDictDatas(DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS)" :key="'d' + dict.value" v-if="item.dg == 1">
              <el-input v-model="item.hazardousMaterials[dict.value]" />
            </el-descriptions-item>

            <el-descriptions-item v-if="item.dg == 0" label></el-descriptions-item>
            <el-descriptions-item v-if="item.dg == 0" label></el-descriptions-item>
            <el-descriptions-item v-if="item.dg == 0" label></el-descriptions-item>
            <el-descriptions-item v-if="item.dg == 0" label></el-descriptions-item>

            <el-descriptions-item label>
              <el-row :gutter="20" style="color: #004F7C; font-weight: 700 !important; margin-bottom: 5px">
                <!-- <el-col :span="8"> RefNo&Numbers</el-col> -->
                <el-col :span="8">Remark</el-col>
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
                    :headers="uploadHeaders"
                    :on-success="handleSuccess"
                    :file-list="item.fileList"
                    :auto-upload="false"
                    :on-change="(file, files) => handleFileChangeThen(file, files, () => {item.fileList = files}, () => {item.fileList = [];item.uploadData = {}})"
                  >
                    <el-button slot="trigger" type="primary">
                      {{
                      $t("booking.browse")
                      }}
                    </el-button>
                    <div slot="tip" class="el-upload__tip"></div>
                  </el-upload>
                </el-col>
              </el-row>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card style="box-shadow: none;border:1px solid #ddd!important;border-radius: 0px!important;margin: 15px 0px;padding: 10px 0px;">
          <el-row>
            <el-button @click="addContainers" size="mini" type="primary">
              <i class="el-icon-plus"></i>
              {{ $t("booking.addContainers") }}
            </el-button>
          </el-row>

          <el-row :gutter="20" style="margin-bottom: 10px">
            <el-col :span="2">
              <font color="#FF0000">*</font>
              {{ $t("booking.containerType") }}
            </el-col>
            <el-col :span="2">
              <font color="#FF0000">*</font>
              {{ $t("booking.numberOfContainers") }}
            </el-col>
            <el-col :span="2">{{ flag ? "Ventilation(cbm/hour)" : "" }}</el-col>
            <el-col :span="2">
              <font color="#FF0000" v-show="flag">*</font>
              {{ flag ? "Temperature(°C)" : "" }}
            </el-col>
            <el-col :span="2">
              <font color="#FF0000" v-show="flag"></font>
              {{ flag ? "Humidity(%)" : "" }}
            </el-col>
            <el-col :span="2">
              <font color="#FF0000" v-show="flag"></font>
              {{ flag ? "O2(%)" : "" }}
            </el-col>
            <el-col :span="2">
              <font color="#FF0000" v-show="flag"></font>
              {{ flag ? "CO2(%)" : "" }}
            </el-col>
            <el-col :span="2">
              <font color="#FF0000" v-show="flag"></font>
              {{ flag ? "Drains" : "" }}
            </el-col>
            <el-col :span="2">
              <font color="#FF0000">*</font>SOC
            </el-col>
          </el-row>

          <div style="margin-bottom: 5px" v-for="(item, i) in form.containers" :key="item.id || 'container-' + i" class="shipmentRouters-css">
            <el-row :gutter="20">
              <el-col :span="2">
                <el-form-item required :prop="'containers.' + i + '.containerType'">
                  <el-select filterable v-model="item.containerType" @change="handleOptionChange">
                    <el-option
                      v-for="opt in craFlag
                    ? containerOptions.filter((c) => {
                        return cra_contaier_type.indexOf(c.type) > -1;
                      })
                    : containerOptions"
                      :label="opt.type"
                      :value="opt.type"
                      :key="opt.id"
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
                <el-form-item v-show="item.containerType && containerOptions.find((obj) => obj.type == item.containerType)?.isReeferContainer == 'Yes'">
                  <el-input v-model="item.ventClosedOrNot" />
                </el-form-item>
                <span
                  v-show="
                (item.containerType &&
                  containerOptions.find((obj) => obj.type == item.containerType)?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.containerType && flag)
              "
                >&nbsp;</span>
              </el-col>
              <el-col :span="2">
                <el-form-item
                  v-if="item.containerType && containerOptions.find((obj) => obj.type == item.containerType)?.isReeferContainer == 'Yes'"
                  :required="item.containerType && containerOptions.find((obj) => obj.type == item.containerType)?.isReeferContainer == 'Yes'"
                  :prop="'containers.' + i + '.requireTemperature'"
                >
                  <el-input v-model="item.requireTemperature" />
                </el-form-item>
                <span
                  v-show="
                (item.containerType &&
                  containerOptions.find((obj) => obj.type == item.containerType)?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.containerType && flag)
              "
                >&nbsp;</span>
              </el-col>
              <el-col :span="2">
                <el-form-item v-show="item.containerType && containerOptions.find((obj) => obj.type == item.containerType)?.isReeferContainer == 'Yes'">
                  <el-input v-model="item.humidity" />
                </el-form-item>
                <span
                  v-show="
                (item.containerType &&
                  containerOptions.find((obj) => obj.type == item.containerType)?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.containerType && flag)
              "
                >&nbsp;</span>
              </el-col>

              <el-col :span="2">
                <el-form-item v-show="item.containerType && containerOptions.find((obj) => obj.type == item.containerType)?.isReeferContainer == 'Yes'">
                  <el-input v-model="item.o2" />
                </el-form-item>
                <span
                  v-show="
                (item.containerType &&
                  containerOptions.find((obj) => obj.type == item.containerType)?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.containerType && flag)
              "
                >&nbsp;</span>
              </el-col>

              <el-col :span="2">
                <el-form-item v-show="item.containerType && containerOptions.find((obj) => obj.type == item.containerType)?.isReeferContainer == 'Yes'">
                  <el-input v-model="item.co2" />
                </el-form-item>
                <span
                  v-show="
                (item.containerType &&
                  containerOptions.find((obj) => obj.type == item.containerType)?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.containerType && flag)
              "
                >&nbsp;</span>
              </el-col>

              <el-col :span="2">
                <el-form-item v-show="item.containerType && containerOptions.find((obj) => obj.type == item.containerType)?.isReeferContainer == 'Yes'">
                  <el-select v-model="item.drains">
                    <el-option label="Open" value="Open"></el-option>
                    <el-option label="Close" value="Close"></el-option>
                  </el-select>
                </el-form-item>
                <span
                  v-show="
                (item.containerType &&
                  containerOptions.find((obj) => obj.type == item.containerType)?.isReeferContainer != 'Yes' &&
                  flag) ||
                (!item.containerType && flag)
              "
                >&nbsp;</span>
              </el-col>

              <el-col :span="2">
                <el-switch v-model="item.soc" active-text="Yes" inactive-text="No"></el-switch>
              </el-col>
              <el-col :span="2">
                <el-button v-if="i != 0" size="mini" type="text" icon="el-icon-delete" @click="handleDeleteContainer(i)">{{ $t("search.delete") }}</el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>

        <el-dialog :visible.sync="shippingScheduleVisable" title="Shipping Schedule" width="80%">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-date-picker placeholder="ETD From" v-model="searchSchedule.from" />
            </el-col>
            <el-col :span="6">
              <el-date-picker placeholder="ETD To" v-model="searchSchedule.to" />
            </el-col>
            <el-col :span="6">
              <el-input placeholder="Service" v-model="searchSchedule.service"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button @click="queryShippingSchedule" type="primary">
                Search
                <i class="el-icon-search el-icon--right"></i>
              </el-button>
            </el-col>
          </el-row>
          <el-table v-loading="shippingScheduleLoading" height="600px" :data="shippingScheduleData">
            <el-table-column sortable="custom" width="15px" type="expand">
              <template slot-scope="scope">
                <!-- none tshg -->
                <div v-if="scope.row.carrier != 'TSHG'" style="padding: 0px 40px;">
                  <el-empty v-if="scope.row.tshgList.length==0"></el-empty>
                  <div style="padding-top: 10px;">
                    <div style class="ptp-results__transport-plan--deadline mds-text--small-normal">
                      <div>
                        <div class="vessel-title">Departure</div>
                        <div class="vessel-title">{{ scope.row.polTerminal }}</div>
                      </div>
                      <div>
                        <div class="vessel-title">Arrival</div>
                        <div class="vessel-title">{{ scope.row.podTerminal }}</div>
                      </div>
                      <div>
                        <div class="vessel-title">SI Document</div>
                        <div class="vessel-title">{{ scope.row.siCutoff==null?"-":parseTimeToZ1(scope.row.siCutoff) }}</div>
                      </div>
                      <div>
                        <div class="vessel-title">VGM</div>
                        <div class="vessel-title">{{ scope.row.vgmCutoff==null?"-":parseTimeToZ1(scope.row.vgmCutoff) }}</div>
                      </div>
                      <div>
                        <div class="vessel-title">Inland Cutoff</div>
                        <div class="vessel-title">{{ scope.row.inlandCutoff==null?"-":parseTimeToZ1(scope.row.inlandCutoff) }}</div>
                      </div>
                    </div>
                    <el-row v-for="(item,index) in scope.row.tshgList">
                      <div>
                        <div style="float: left;">
                          <div v-show="index==0" style="width: 300px;font-size: 14px;line-height: 20px;font-weight: bold;text-align: right;">{{ scope.row.pol }}</div>
                          <div v-show="index==0" style="width: 300px;font-size: 14px;line-height: 20px;text-align: right;">{{ scope.row.polTerminal }}</div>
                          <div v-show="index==scope.row.tshgList.length-1" style="width: 300px;font-size: 14px;line-height: 20px;font-weight: bold;text-align: right;">{{ scope.row.pod }}</div>
                          <div v-show="index==scope.row.tshgList.length-1" style="width: 300px;font-size: 14px;line-height: 20px;text-align: right;">{{ scope.row.podTerminal }}</div>

                          <div v-show="index!=0&&index!=scope.row.tshgList.length-1" style="width: 300px;font-size: 14px;line-height: 20px;font-weight: bold;text-align: right;">{{ item.portCode }}</div>
                          <div v-show="index!=0&&index!=scope.row.tshgList.length-1" style="width: 300px;font-size: 14px;line-height: 20px;text-align: right;">{{ item.port }}</div>
                          <div v-if="item.barge!='Other'" style="font-size: 14px;line-height: 20px;text-align: right;">{{ item.barge }}</div>
                          <!-- Transport Mode: -->
                        </div>
                        <div style="float: left;">
                          <span v-show="item.barge=='Truck'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                            <svg part="icon" id="mi-truck-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path
                                d="M5.96 2.375A1 1 0 0 1 6.74 2h10.52a1 1 0 0 1 .78.375l1.74 2.176a1 1 0 0 1 .22.624V21a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2H8v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.175a1 1 0 0 1 .22-.624l1.74-2.176zM7 19H5v2h2v-2zm-2-1h14v-7H5v7zm0-8h14V5.175L17.26 3H6.74L5 5.175V10zm14 9h-2v2h2v-2zM7 14h3v1H7v-1zm7 0h3v1h-3v-1z"
                              />
                            </svg>
                          </span>
                          <span v-show="item.barge=='Other'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                            <svg part="icon" id="mi-pin" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path
                                d="M5 9c0-3.772 3.13-7 7-7s7 3.228 7 7c0 2.61-1.17 5.488-2.408 7.817a38.15 38.15 0 0 1-3.046 4.793.983.983 0 0 1-.789.39h-1.514a.983.983 0 0 1-.789-.39c-.444-.59-1.8-2.45-3.046-4.793C6.17 14.487 5 11.61 5 9zm7-6C8.69 3 6 5.772 6 9c0 2.355 1.07 5.052 2.291 7.347A37.174 37.174 0 0 0 11.247 21h1.506a37.169 37.169 0 0 0 2.956-4.653C16.929 14.052 18 11.355 18 9c0-3.228-2.69-6-6-6zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"
                              />
                            </svg>
                          </span>
                          <span v-show="item.barge=='Ocean'||item.barge=='Barge'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                            <svg part="icon" id="mi-vessel-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path
                                d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4h3a1 1 0 0 1 1 1v5.473l2.594.865a1 1 0 0 1 .564 1.423l-2.793 5.187A2 2 0 0 1 16.605 22h-9.21a2 2 0 0 1-1.76-1.052L2.842 15.76a1 1 0 0 1 .564-1.422L6 13.473V8a1 1 0 0 1 1-1h3V3zm1 4h2V3h-2v4zm-4 6.14l4.684-1.562a.999.999 0 0 1 .632 0L17 13.14V8H7v5.14zm5-.613l-8.278 2.76 2.793 5.187a1 1 0 0 0 .88.526h9.21a1 1 0 0 0 .88-.526l2.793-5.188L12 12.527z"
                              />
                            </svg>
                          </span>
                          <!-- <div v-show="index!=scope.row.tshgList.length-1&&!(item.vessel!=null&&item.barge=='Other')" style="border-left: 4px dotted #dbdbdb; height: 40px;margin: 20px;"></div> -->
                          <div v-show="index!=scope.row.tshgList.length-1" style="border-left: 4px solid #dbdbdb; height: 40px;margin: 20px;"></div>
                        </div>
                        <div style="float: left;">
                          <div v-show="index==0" style="font-size: 14px;line-height: 20px;">Departure</div>
                          <div v-show="index==scope.row.tshgList.length-1" style="font-size: 14px;line-height: 20px;">Arrival</div>
                          <div v-show="index!=0&&index!=scope.row.tshgList.length-1" style="font-size: 14px;line-height: 20px;">{{ item.event }}</div>

                          <div v-show="index==0" style="font-size: 14px;line-height: 20px;">{{ parseTimeToZ1(scope.row.departureDate) }}</div>
                          <div v-show="index==scope.row.tshgList.length-1" style="font-size: 14px;line-height: 20px;">{{ parseTimeToZ1(scope.row.arrivalDate) }}</div>
                          <div v-show="item.barge=='Ocean'" style class="ptp-results__transport-plan--vessel mds-text--small-normal">
                            <div>
                              <div class="vessel-title">Vessel</div>
                              <div class="vessel-title">{{ item.barge=='Barge'?"Barge":item.vessel }}</div>
                            </div>
                            <div>
                              <div class="vessel-title">Voyage/Bound</div>
                              <div class="vessel-title">{{ item.voyage==null?'-':item.voyage }}</div>
                            </div>
                            <div>
                              <div class="vessel-title">Service</div>
                              <div class="vessel-title">{{ item.routeCode==null?'-':item.routeCode }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-row>

                    <el-row>
                      <div></div>
                    </el-row>
                  </div>
                </div>
                <!-- tshg -->
                <div v-if="scope.row.carrier == 'TSHG'" style="padding: 0px 40px;">
                  <el-empty v-if="scope.row.tshgList.length==0"></el-empty>
                  <div style="padding-top: 10px;">
                    <div style class="ptp-results__transport-plan--deadline mds-text--small-normal">
                      <div>
                        <div class="vessel-title">Departure</div>
                        <div class="vessel-title">{{ scope.row.polName }}</div>
                      </div>
                      <div>
                        <div class="vessel-title">Arrival</div>
                        <div class="vessel-title">{{ scope.row.podName }}</div>
                      </div>
                      <div>
                        <div class="vessel-title">Container Gate-In</div>
                        <div class="vessel-title">{{ scope.row.containerGateIn==null?"-":parseTimeToZ1(scope.row.containerGateIn) }}</div>
                      </div>
                      <div>
                        <div class="vessel-title">SI Document</div>
                        <div class="vessel-title">{{ scope.row.siDoc==null?"-":parseTimeToZ1(scope.row.siDoc) }}</div>
                      </div>
                      <div>
                        <div class="vessel-title">VGM</div>
                        <div class="vessel-title">{{ scope.row.vgm==null?"-":parseTimeToZ1(scope.row.vgm) }}</div>
                      </div>
                    </div>
                    <el-row v-for="(item,index) in scope.row.tshgList">
                      <div>
                        <div style="float: left;">
                          <div style="width: 300px;font-size: 14px;line-height: 20px;font-weight: bold;text-align: right;">{{ item.portCode }}</div>
                          <div style="width: 300px;font-size: 14px;line-height: 20px;text-align: right;">{{ item.port }}</div>
                          <div v-if="item.barge!='Other'" style="font-size: 14px;line-height: 20px;text-align: right;">{{ item.barge }}</div>
                          <!-- Transport Mode: -->
                        </div>
                        <div style="float: left;">
                          <span v-show="item.barge=='Truck'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                            <svg part="icon" id="mi-truck-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path
                                d="M5.96 2.375A1 1 0 0 1 6.74 2h10.52a1 1 0 0 1 .78.375l1.74 2.176a1 1 0 0 1 .22.624V21a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2H8v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.175a1 1 0 0 1 .22-.624l1.74-2.176zM7 19H5v2h2v-2zm-2-1h14v-7H5v7zm0-8h14V5.175L17.26 3H6.74L5 5.175V10zm14 9h-2v2h2v-2zM7 14h3v1H7v-1zm7 0h3v1h-3v-1z"
                              />
                            </svg>
                          </span>
                          <span v-show="item.barge=='Other'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                            <svg part="icon" id="mi-pin" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path
                                d="M5 9c0-3.772 3.13-7 7-7s7 3.228 7 7c0 2.61-1.17 5.488-2.408 7.817a38.15 38.15 0 0 1-3.046 4.793.983.983 0 0 1-.789.39h-1.514a.983.983 0 0 1-.789-.39c-.444-.59-1.8-2.45-3.046-4.793C6.17 14.487 5 11.61 5 9zm7-6C8.69 3 6 5.772 6 9c0 2.355 1.07 5.052 2.291 7.347A37.174 37.174 0 0 0 11.247 21h1.506a37.169 37.169 0 0 0 2.956-4.653C16.929 14.052 18 11.355 18 9c0-3.228-2.69-6-6-6zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"
                              />
                            </svg>
                          </span>
                          <span v-show="item.barge=='Ocean'||item.barge=='Barge'" part="icon-wrapper" class="mc-icon size-24" style="fill:#141414;">
                            <svg part="icon" id="mi-vessel-front" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path
                                d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4h3a1 1 0 0 1 1 1v5.473l2.594.865a1 1 0 0 1 .564 1.423l-2.793 5.187A2 2 0 0 1 16.605 22h-9.21a2 2 0 0 1-1.76-1.052L2.842 15.76a1 1 0 0 1 .564-1.422L6 13.473V8a1 1 0 0 1 1-1h3V3zm1 4h2V3h-2v4zm-4 6.14l4.684-1.562a.999.999 0 0 1 .632 0L17 13.14V8H7v5.14zm5-.613l-8.278 2.76 2.793 5.187a1 1 0 0 0 .88.526h9.21a1 1 0 0 0 .88-.526l2.793-5.188L12 12.527z"
                              />
                            </svg>
                          </span>
                          <div v-show="index!=scope.row.tshgList.length-1&&!(item.vessel!=null&&item.barge=='Other')" style="border-left: 4px dotted #dbdbdb; height: 40px;margin: 20px;"></div>
                          <div v-show="index!=scope.row.tshgList.length-1&&(item.vessel!=null&&item.barge=='Other')" style="border-left: 4px solid #dbdbdb; height: 40px;margin: 20px;"></div>
                        </div>
                        <div style="float: left;">
                          <div style="font-size: 14px;line-height: 20px;">{{ item.event }}</div>
                          <div style="font-size: 14px;line-height: 20px;">{{ parseTimeToZ1(item.eventTime) }}</div>
                          <div v-show="item.barge=='Ocean'&&item.event=='Departure'" style class="ptp-results__transport-plan--vessel mds-text--small-normal">
                            <div>
                              <div class="vessel-title">Vessel</div>
                              <div class="vessel-title">{{ item.barge=='Barge'?"Barge":item.vessel }}</div>
                            </div>
                            <div>
                              <div class="vessel-title">Service</div>
                              <div class="vessel-title">{{ item.service==null?'-':item.service }}</div>
                            </div>
                            <div>
                              <div class="vessel-title">Voyage/Bound</div>
                              <div class="vessel-title">{{ item.voyage==null?'-':item.voyage }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-row>

                    <el-row>
                      <div></div>
                    </el-row>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column :label="$t('booking.carrier')" prop="carrier" width="250px" :align="'center'">
              <template v-slot="scope">
                <div>
                  <img v-if="scope.row.carrier == 'HLCU'" class="uni-carrier-logo-image" src="../../../assets/HLCU.png" />
                  <img v-if="scope.row.carrier == 'MAEU'" class="uni-carrier-logo-image" src="../../../assets/MAEU.png" />
                  <img v-if="scope.row.carrier == 'ZIMU'" class="uni-carrier-logo-image" src="../../../assets/ZIMU.png" />
                  <img v-if="scope.row.carrier == 'TSHG'" class="uni-carrier-logo-image" src="../../../assets/tailwind.png" />
                  <img v-if="scope.row.carrier == 'MSCU'" class="uni-carrier-logo-image" src="../../../assets/MSCU-new.png" />
                  <img v-if="scope.row.carrier == 'MSC'" class="uni-carrier-logo-image" src="../../../assets/MSCU-new.png" />

                  <img v-if="scope.row.carrier == 'OOLU'" class="uni-carrier-logo-image" src="../../../assets/OOLU.svg" />
                  <img v-if="scope.row.carrier == 'CMDU'" class="uni-carrier-logo-image" src="../../../assets/CMA.png" />
                  <img v-if="scope.row.carrier == 'ONEY'" class="uni-carrier-logo-image" src="../../../assets/ONE.png" />
                  <img v-if="scope.row.carrier == 'COSU'" class="uni-carrier-logo-image" src="../../../assets/COSCO.png" />
                  <img v-if="scope.row.carrier == 'CMA'" class="uni-carrier-logo-image" src="../../../assets/logo/CMA.png" />
                  <img v-if="scope.row.carrier == 'COSCO'" class="uni-carrier-logo-image" src="../../../assets/logo/COSCO.png" />
                  <img v-if="scope.row.carrier == 'HPL'" class="uni-carrier-logo-image" src="../../../assets/logo/HPL.png" />

                  <img v-if="scope.row.carrier == 'MSK'" class="uni-carrier-logo-image" src="../../../assets/logo/MSK.png" />
                  <img v-if="scope.row.carrier == 'HMM'" class="uni-carrier-logo-image" src="../../../assets/HMM.jpg" />
                  <img v-if="scope.row.carrier == 'ONE'" class="uni-carrier-logo-image" src="../../../assets/logo/ONE.png" />
                  <img v-if="scope.row.carrier == 'ZIM'" class="uni-carrier-logo-image" src="../../../assets/logo/ZIM.png" />
                  <img v-if="scope.row.carrier == 'EMC'" class="uni-carrier-logo-image" src="../../../assets/logo/EMC.svg" />
                  <img v-if="scope.row.carrier == 'OOCL'" class="uni-carrier-logo-image" src="../../../assets/logo/OOCL.svg" />
                  <img v-if="scope.row.carrier == 'YML'" class="uni-carrier-logo-image" src="../../../assets/logo/YML.png" />
                  <img v-if="scope.row.carrier == 'MCC'" class="uni-carrier-logo-image" src="../../../assets/logo/MSK.png" />
                  <img v-if="scope.row.carrier == 'EGLV'" class="uni-carrier-logo-image" src="../../../assets/logo/EGLV.png" />
                  <img v-if="scope.row.carrier == 'SJHH'" class="uni-carrier-logo-image" src="../../../assets/logo/SJHH.png" />
                  <img v-if="scope.row.carrier == 'SMLU'" class="uni-carrier-logo-image" src="../../../assets/logo/SMLU.png" />
                </div>
              </template>
            </el-table-column>
            <el-table-column sortable="custom" label="Service" prop="service" width="180px"></el-table-column>

            <el-table-column label="Main Carriage" prop="mainCarriage" min-width="300px">
              <template v-slot="scope">
                <div style="width: 800px;">
                  <div style="float: left; margin-right: 10px;margin-top: 20px">
                    <div style="text-align: center; color:#c3c5c7; ">{{ scope.row.carrier=='TSHG'?scope.row.polName:(scope.row.polTerminal +" ("+ scope.row.pol +") ") }}</div>
                    <div style="text-align: center;">{{ parseTime(scope.row.departureDate) }}</div>
                  </div>

                  <div style="float: left; width: 100px;">
                    <div style="position: relative">
                      <div style="text-align: center;color:#385f78;white-space: nowrap;">{{ scope.row.vesselName }}</div>
                      <div class="image-container" style="position: absolute; left: 35px">
                        <img style="width: 20px; height: 20px" src="../../../assets/icons/ship.png" />
                      </div>
                      <div style="text-align: center;color:#385f78;position: absolute; top: 50px;left: 30px">{{ scope.row.voyage }}</div>
                    </div>
                  </div>

                  <div style="float: left;margin-left: 10px;margin-top: 20px">
                    <div style="text-align: center;  color:#c3c5c7; ">{{ scope.row.carrier=='TSHG'?scope.row.podName:(scope.row.podTerminal +" ("+ scope.row.pod +") ") }}</div>
                    <div style="text-align: center;">{{ parseTime(scope.row.arrivalDate) }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="TT" prop="transitTime" min-width="100px">
              <template v-slot="scope">{{ scope.row.transitTime+" days" }}</template>
            </el-table-column>

            <!-- <el-table-column :label="$t('booking.carrier')" prop="carrier" width="180px" :align="'center'">
      </el-table-column>
      <el-table-column label="Service" prop="service" min-width="100px">
            </el-table-column>-->
            <!-- <el-table-column :label="$t('booking.voyage')" prop="voyage" min-width="100px">
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
            </el-table-column>-->

            <el-table-column prop="choseSchedule" width="100px">
              <template v-slot="scope">
                <el-button type="primary" @click="choseSchedule(scope.row)">Select</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
        <el-card style="box-shadow: none;border:1px solid #ddd!important;border-radius:0px;margin-bottom: 10px;">
          <el-descriptions title="Input ETD Range" style="box-shadow: none;" :column="3" border>
            <span class="el-descriptions__title" slot="title">Select vessel schedule</span>
            <span style="color: #bbb1c2" slot="title">(Input ETD Range)</span>
          </el-descriptions>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-date-picker placeholder="ETD From" v-model="searchSchedule.from" />
            </el-col>
            <el-col :span="6">
              <el-date-picker placeholder="ETD To" v-model="searchSchedule.to" />
            </el-col>
            <el-col :span="6">
              <el-button @click="queryShippingSchedule" type="primary">
                Search
                <i class="el-icon-search el-icon--right"></i>
              </el-button>
            </el-col>
          </el-row>
        </el-card>

        <el-card style="box-shadow: none;border:1px solid #ddd!important;border-radius:0px;padding-top:10px;margin-bottom:15px">
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
                  <i class="el-icon-ship"></i>
                  {{ $t("booking.form") }}:
                  {{ getLabel(item.pol, "pol") }}
                </h4>

                <div v-if="i != form.shipmentRouters.length - 1 && i > 0">
                  <h4>
                    <i class="el-icon-ship"></i>
                    {{ $t("booking.formTo") }}:
                  </h4>
                  <el-row :gutter="20">
                    <el-col :span="6">
                      <font color="#FF0000">*</font>
                      {{ $t("booking.pol") }}
                    </el-col>
                  </el-row>

                  <el-row :gutter="20">
                    <el-col :span="6">
                      <el-form-item required :prop="'shipmentRouters.' + i + '.pol'">
                        <el-select @change="changeRouter($event,i)" filterable v-model="item.pol">
                          <el-option v-for="(item, index) in portOptions" :key="index + 'pol4'" :label="item.name+' ('+item.code+')'" :value="item.code"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <div v-if="i != form.shipmentRouters.length - 1">
                  <el-row :gutter="20">
                    <el-col :span="4">
                      <font color="#FF0000">*</font>Transport Mode
                    </el-col>
                    <el-col :span="4">
                      <font color="#FF0000">*</font>
                      {{ $t("booking.etd") }}
                    </el-col>
                    <el-col :span="4">
                      <font color="#FF0000">*</font>
                      {{ $t("booking.eta") }}
                    </el-col>
                  </el-row>
                  <el-row :gutter="20" style="margin-bottom: 5px">
                    <el-col :span="4">
                      <el-form-item required :prop="'shipmentRouters.' + i + '.transportMode'">
                        <el-select v-model="item.transportMode" clearable filterable>
                          <el-option v-for="dict in transportMode" :key="dict.value" :label="dict.label" :value="dict.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item required :prop="'shipmentRouters.' + i + '.etd'">
                        <el-date-picker value-format="timestamp" v-model="item.etd" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item required :prop="'shipmentRouters.' + i + '.eta'">
                        <el-date-picker value-format="timestamp" v-model="item.eta" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="4">
                      <font color="#FF0000">*</font>
                      {{ $t("booking.transportMeanName") }}
                    </el-col>
                    <el-col :span="4">
                      <font color="#FF0000">*</font>
                      {{ $t("booking.voyage") }}
                    </el-col>
                    <el-col :span="4">
                      <font color="#FF0000">*</font>Service
                    </el-col>
                  </el-row>

                  <el-row :gutter="20" style="margin-bottom: 5px">
                    <!-- <el-col :span="6"><el-input v-model="item.identification" /></el-col> -->
                    <el-col :span="4">
                      <el-form-item required :prop="'shipmentRouters.' + i + '.transportMeanName'">
                        <el-select
                          allow-create
                          v-model="item.transportMeanName"
                          placeholder
                          filterable
                          remote
                          reserve-keyword
                          clearable
                          :remote-method="remoteMethod2"
                          @change="changeVesselName(item)"
                          @clear="item.transportMeanName = null"
                        >
                          <el-option v-for="dict in vesselListLes" :key="dict.id" :label="dict.vesselName" :value="dict.vesselName" />
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
                </div>
                <h4 v-if="i == form.shipmentRouters.length - 1">
                  <i class="el-icon-ship"></i>
                  {{ $t("booking.to") }}:
                  {{ getLabel(item.pol, "pod") }}
                </h4>
                <el-row v-if="i != form.shipmentRouters.length - 1" style="margin-top: 10px; text-align: center;">
                  <el-col :span="12">
                    <el-button type="primary" @click="form.shipmentRouters.splice(i + 1, 0, {})" icon="el-icon-plus" circle></el-button>

                    <el-button v-if="i != form.shipmentRouters.length - 1 && i != 0" type="danger" @click="form.shipmentRouters.splice(i, 1)" icon="el-icon-delete" circle></el-button>
                  </el-col>
                </el-row>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
        <el-row style="text-align: center">
          <!--        <span style="margin-right: 10px;display:inline-block"><el-checkbox v-model="form.reserved">Reserve space</el-checkbox></span>-->
          <span style="margin-right: 10px;display:inline-block">
            <el-checkbox v-model="form.noBookingEdi">No EDI</el-checkbox>
          </span>

          <el-button size="mini" @click="submit(2)" type="primary" :loading="loadingSaveBut">{{$auth.hasPermi('submit:carrier:booking')?'Save Draft':'Submit'}}</el-button>
          <el-button size="mini" @click="submit(0)" v-hasPermi="['submit:carrier:booking']" type="primary" :loading="loadingSaveBut">
            {{
            $t("booking.submit")
            }}
          </el-button>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<style >
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
import { getUserProfile } from '@/api/system/user'
// import { listDept } from '@/api/system/dept'
import { getBookingList } from '@/api/booking/booking'
import { create, si, vgm, findShippingScheduleList, listDept } from '@/api/shipment/shipment'
import { getContainerList } from '@/api/system/container'
import { createDeptApply } from '@/api/system/deptApply'
import { getVesselList } from '@/api/system/vessel'
import { getHsCodeListByCode, applyNewHsCode, getDataByHsCodes } from '@/api/system/hsCode'
import { getCraNumList, getCraNumsList } from '@/api/shipment/shipment'
import { getOriginDeliveryList } from '@/api/system/originDelivery'
import { getBaseHeader } from '@/utils/request'
import { getItemList } from '@/api/order/item'
import { getProductList } from '@/api/system/product'
import { getHeaderList } from '@/api/order/header'
import { getAllocationWeekData } from '@/api/booking/contract'
import { getContractListTenantIgnore } from '@/api/booking/contract'
import { getSOHeaderPage } from '@/api/order/sOHeader'
import SOMainTable from '@/views/salesOrder/components/table.vue'
import { getShippingOrderListByIds } from '@/api/shipping/order'
import { getOrderHeadersList } from '@/api/pepco/shipping-order.js'
import ShipmentCargoInfo from '@/views/shipment/components/shipment-cargo-info.vue'
import { fileLoadMixin } from '@/utils/fileLoadMixin'
import { DICT_TYPE, getDictDatas } from '@/utils/dict'

export default {
  name: 'Shipment',
  computed: {
    DICT_TYPE() {
      return DICT_TYPE
    },
    isSelectedContractPremium() {
      if (!this.form.contractNumber) return false;
      const selected = this.craList.find(
        c => c.contractNo === this.form.contractNumber
      );
      return selected?.contractType === 'Premium';
    }
  },
  watch: {
    'form.contractNumber'(newVal) {
      console.log(newVal, "number change")
      if (!this.isSelectedContractPremium) {
        this.form.reasonOfPremium = undefined;
      }
    }
  },
  mixins: [fileLoadMixin],
  components: { SOMainTable, ShipmentCargoInfo },
  data() {
    return {
      allocationWeekList: [],
      loadingSaveBut: false,
      searchSchedule: {
        from: new Date(),
        to: new Date().setMonth(new Date().getMonth() + 2)
      },
      soIds: [],
      shippingScheduleVisable: false,
      shippingScheduleData: [],
      form: {
        reserved: false,
        specialAllocation: 'Standard',
        type: 'Merchant',
        containers: [],
        shipmentRouters: [{ etd: null, eta: null, transportMeanName: null, identification: null, imo: null, voyage: null, service: null, pol: null }],
        productData: [],
        contractType: 'CY/CY',
        reasonOfPremium: '',
        phone: '',
        email: '',
        remark: '',
        pol: '',
        pod: '',
        allocationYear: null,
        allocationWeek: null
      },
      availableYears: [],
      availableWeeks: [],
      phoneError: '',
      emailError: '',
      portOptions: [],
      soQueryParams: {
        pageNo: 1,
        pageSize: 10
      },
      soLineTotal: 0,
      containerOptions: [],
      hide: false,
      hide2: false,
      shipmentId: null,
      parties: {
        Shipper: [],
        Consignee: [],
        'Notify Party': [],
        'Agreement Party': []
      },
      partiesMap: {},
      tipsMail: 'Tailwind.CS@kblinersh.com',
      open: false,
      partyForm: {
        partyRole: []
      },
      vesslMap: {},
      reverseVesslMap: {},
      vesselList: [],
      vesselListLes: [],
      hsCodeList: [],
      craNumList: [],
      shippingScheduleLoading: false,
      url: '',
      uploadHeaders: {},
      flag: false,
      cra_pol: [],
      cra_pod: [],
      cra_origin: [],
      cra_disch: [],
      cra_contaier_type: [],
      craFlag: false,
      itemTableData: [],
      productMapForBook: {},
      orderMap: {},
      orderItemMap: {},
      applyHsCodeVisable: false,
      hsCode: {},
      uploadCount: 0,
      successCount: 0,
      submitLoading: false,
      carrierMap: {
        CMDU: 'CMA',
        COSU: 'COSCO',
        EGLV: 'EMC',
        HLCU: 'HPL',
        MSCU: 'MSC',
        ONEY: 'ONE',
        ZIMU: 'ZIM',
        MAEU: 'MSK',
        TSHG: 'TSHG',
        'MAEU-ALWAYS': 'MSK',
        SHCO: 'SHIPCO',
        'NVOCC DSV': 'DSV',
        WECC: 'WEC'
      },
      carrierMap2: {
        CMA: 'CMDU',
        TSHG: 'TSHG',
        COSCO: 'COSU',
        EMC: 'EGLV',
        HPL: 'HLCU',
        MSC: 'MSCU',
        ONE: 'ONEY',
        ZIM: 'ZIMU',
        MSK: 'MAEU',
        SHIPCO: 'SHCO',
        DSV: 'NVOCC DSV',
        WEC: 'WECC'
      },
      craList: [],
      soTableData: [],
      showTips: true,
      showCustomer: true,
      transportMode: [
        {
          label: 'Barge',
          value: 'BRG'
        },
        { label: 'Ocean', value: 'SEA' },
        { label: 'Truck', value: 'TRK' },
        { label: 'Railway', value: 'RAI' }
      ],
      source: null,
      spoList: [],
      spoIds: [],
      isPepco: false,
      spoItems: [],
      // 接收shipment-cargo-info组件的数据
      receiveSOProductList: []
    }
  },
  mounted() {},
  created() {
    var data = getBaseHeader()
    this.generateAvailableYears()
    this.uploadHeaders = data
    this.url = process.env.VUE_APP_BASE_API
    this.getPortList()
    this.getContainerList().then(() => {
      this.ensureDefaultContainers()
      this.handleOptionChange()
    })
    this.getParty()
    // this.getParties("Shipper");
    // this.getParties("Consignee");
    // this.getParties("Notify Party");
    // this.getParties("Agreement Party");
    this.getVesselList()
    // this.getHsCodeList();
    this.getContractListTenantIgnore()
    if (this.$route.query.carrier) {
      this.$set(this.form, 'carrier', this.$route.query.carrier)
    }
    this.getUserInfo()
    this.source = this.$route.query.source
    this.isPepco = this.$route.query.isPepco
    console.log('this.form_info', this.isPepco)
    if (this.source == 'booking-order') {
      //是从booking-order创建的shipment
      this.showTips = false
      this.showCustomer = false
      getUserProfile().then(response => {
        this.form.customer = response.data.customers
      })
      this.$set(this.form, 'shipperCreate', true)
    } else if (this.source == 'spoBooking') {
      //是从shipping Order list创建的shipment
    }
    localStorage.removeItem('refreshPoPage')
  },
  methods: {
    getDictDatas,
    getShipper() {
      var party = { address: '-', email: '-', phone: '-', fax: '-', companyUsci: '-' }
      if (this.form.shipper && this.parties['Shipper'] && this.parties['Shipper'].length > 0) {
        var obj = this.parties['Shipper'].find(item => item.id == this.form.shipper)
        if (obj == undefined || obj == null) {
          obj = party
        }
        return obj
      }
      return party
    },
    getNotifyParty() {
      var party = { address: '-', email: '-', phone: '-', fax: '-', companyUsci: '-' }
      if (this.form.notifyParty && this.parties['Notify Party'] && this.parties['Notify Party'].length > 0) {
        var obj = this.parties['Notify Party'].find(item => item.id == this.form.notifyParty)
        if (obj == undefined || obj == null) {
          obj = party
        }
        return obj
      }
      return party
    },
    getConsignee() {
      var party = { address: '-', email: '-', phone: '-', fax: '-', companyUsci: '-' }
      if (this.form.consignee && this.parties['Consignee'] && this.parties['Consignee'].length > 0) {
        var obj = this.parties['Consignee'].find(item => item.id == this.form.consignee)
        if (obj == undefined || obj == null) {
          obj = party
        }
        return obj
      }
      return party
    },
    getAgreementParty() {
      var party = { address: '-', email: '-', phone: '-', fax: '-', companyUsci: '-' }
      if (this.form.agreementParty && this.parties['Agreement Party'] && this.parties['Agreement Party'].length > 0) {
        var obj = this.parties['Agreement Party'].find(item => item.id == this.form.agreementParty)
        if (obj == undefined || obj == null) {
          obj = party
        }
        return obj
      }
      return party
    },

    validatePolPod(rule, value, callback) {
      const { pol, pod } = this.form
      if (pol && pod && pol === pod) {
        // 设置当前字段的错误消息
        callback(new Error(' '))
        // 手动设置另一个字段的错误消息
        this.setFieldError(rule.field === 'pol' ? 'pod' : 'pol', ' ')
      } else {
        callback()
        // 清除另一个字段的错误消息
        this.clearFieldError(rule.field === 'pol' ? 'pod' : 'pol')
      }
    },
    validateOriginAndDestination(rule, value, callback) {
      const { originPort, destinationPort } = this.form
      if (originPort && destinationPort && originPort === destinationPort) {
        // 设置当前字段的错误消息
        callback(new Error(' '))
        // 手动设置另一个字段的错误消息
        this.setFieldError(rule.field === 'originPort' ? 'destinationPort' : 'originPort', ' ')
      } else {
        callback()
        // 清除另一个字段的错误消息
        this.clearFieldError(rule.field === 'originPort' ? 'destinationPort' : 'originPort')
      }
    },
    filteredPortOptions(field) {
      if (!this.craFlag) {
        return this.portOptions
      }
      switch (field) {
        case 'pol':
          return this.portOptions.filter(item => this.cra_pol.includes(item.code))
        case 'pod':
          return this.portOptions.filter(item => this.cra_pod.includes(item.code))
        case 'originPort':
          return this.portOptions.filter(item => this.cra_origin.includes(item.code))
        case 'destinationPort':
          return this.portOptions.filter(item => this.cra_disch.includes(item.code))
        default:
          return this.portOptions
      }
    },
    setFieldError(prop, message) {
      const field = this.$refs.form.fields.find(field => field.prop === prop)
      if (field) {
        field.validateMessage = message
        field.validateState = 'error'
      }
    },
    clearFieldError(prop) {
      const field = this.$refs.form.fields.find(field => field.prop === prop)
      if (field) {
        field.validateMessage = ''
        field.validateState = ''
      }
    },
    changeRouter(value, index) {
      if (this.form.shipmentRouters[index - 1].pol.startsWith('CN') && this.form.shipmentRouters[index].pol.startsWith('CN')) {
        this.$set(this.form.shipmentRouters[index - 1], 'transportMode', 'BRG')
      } else {
        this.$set(this.form.shipmentRouters[index - 1], 'transportMode', 'SEA')
      }

      if (!this.form.shipmentRouters[index + 1].pol.startsWith('CN') && !this.form.shipmentRouters[index].pol.startsWith('CN')) {
        this.$set(this.form.shipmentRouters[index], 'transportMode', 'BRG')
      } else if (this.form.shipmentRouters[index + 1].pol.startsWith('CN') && this.form.shipmentRouters[index].pol.startsWith('CN')) {
        this.$set(this.form.shipmentRouters[index], 'transportMode', 'BRG')
      } else {
        this.$set(this.form.shipmentRouters[index], 'transportMode', 'SEA')
      }
    },
    getUserInfo() {
      var vm = this
      getUserProfile().then(response => {
        vm.userProfile = response.data
        this.$set(this.form, 'name', response.data.nickname)
        this.$set(this.form, 'phone', response.data.mobilePhone)
        this.$set(this.form, 'email', response.data.email)
      })
    },
    getContractListTenantIgnore() {
      var queryParams = {}
      getContractListTenantIgnore(queryParams).then(response => {
        this.craList = []
        for (var t of response.data) {
          t.contractNo = t.contractNo.trim()
          this.craList.push(t)
        }

        //        getCraNumsList().then(response => {
        //          for (var t of response.data) {
        //            t = t.trim();
        //            this.craList.push({'contractNo':t})
        //          }
        //        });
      })
    },
    applyNewHsCode() {
      this.applyHsCodeVisable = true
    },
    choseSchedule(row) {
      this.form.shipmentRouters[0]
      this.$set(this.form.shipmentRouters[0], 'pol', row.port)
      this.$set(this.form.shipmentRouters[0], 'etd', row.departureDate)
      this.$set(this.form.shipmentRouters[0], 'eta', row.arrivalDate)
      this.$set(this.form.shipmentRouters[0], 'transportMeanName', row.vesselName)
      this.$set(this.form.shipmentRouters[0], 'identification', row.vesselCode)
      this.$set(this.form.shipmentRouters[0], 'voyage', row.voyage)
      this.$set(this.form.shipmentRouters[0], 'imo', row.imo)
      this.$set(this.form.shipmentRouters[0], 'service', row.service)
      this.$set(this.form.shipmentRouters[0], 'transportMode', 'SEA')

      this.$set(this.form, 'carrier', this.carrierMap2[row.carrier])
      this.shippingScheduleVisable = false
      if (row.carrier == 'TSHG') {
        this.setSchdulesTSHG(row)
      }
    },
    queryShippingSchedule() {
      console.log('1111')
      if (
        this.form.pol != null &&
        this.form.pol != '' &&
        this.form.pod != null &&
        this.form.pod != '' &&
        this.searchSchedule.from != null &&
        this.searchSchedule.from != '' &&
        this.searchSchedule.to != null &&
        this.searchSchedule.to != ''
      ) {
        var data = {
          origin: this.form.pol,
          destination: this.form.pod,
          departureFrom: this.parseTime(this.searchSchedule.from),
          departureFrom2: this.parseTime(this.searchSchedule.to),
          carrier: this.carrierMap[this.form.carrier],
          service: this.searchSchedule.service
        }
        console.log(data)
        this.shippingScheduleLoading = true
        console.log(123)
        this.findShippingScheduleList(data)
        this.shippingScheduleVisable = true
        console.log(data)
      } else {
        this.$notify({
          title: 'warning',
          message: 'Required fields is empty',
          type: 'warning'
        })
      }
    },
    queryShippingSchedule2() {
      if (
        this.form.pol != null &&
        this.form.pol != '' &&
        this.form.pod != null &&
        this.form.pod != '' &&
        this.searchSchedule.from != null &&
        this.searchSchedule.from != '' &&
        this.searchSchedule.to != null &&
        this.searchSchedule.to != ''
      ) {
        var data = {
          origin: this.form.pol,
          destination: this.form.pod,
          departureFrom: this.parseTime(this.searchSchedule.from),
          departureFrom2: this.parseTime(this.searchSchedule.to),
          carrier: this.carrierMap[this.form.carrier]
        }
        findShippingScheduleList(data).then(response => {
          this.shippingScheduleData = response.data
          console.log(this.form.shipmentRouters[0])
          var arr = this.shippingScheduleData.filter(item => {
            return item.vesselName == this.form.shipmentRouters[0].transportMeanName && item.voyage == this.form.shipmentRouters[0].voyage && this.form.carrier == this.carrierMap2[item.carrier]
          })

          if (arr.length > 0) {
            this.$set(this.form.shipmentRouters[0], 'service', arr[0].service)
          }
        })
      } else {
      }
    },
    findShippingScheduleList(reqData) {
      findShippingScheduleList(reqData).then(response => {
        this.shippingScheduleData = response.data
        this.shippingScheduleLoading = false
      })
    },
    changeDG(item) {
      this.$set(item, 'tempaax', 1)
      this.$delete(item, 'tempaax')
      if (item.dg == 0) {
        this.$set(item, 'hazardousMaterials', {})
      } else {
        this.$set(item, 'batteries', 3)
      }
    },
    validatePhoneNumber() {
      const phoneNumber = this.form.phone
      // 自定义验证逻辑
      if (!/^\d+$/.test(phoneNumber) || phoneNumber.length < 8 || phoneNumber.length > 15) {
        this.phoneError = ''
      } else {
        this.phoneError = ''
      }
    },
    validateEmailAddress() {
      const emailAddress = this.form.email
      // 自定义验证逻辑
      // 例如，验证是否是有效的电子邮件地址
      if (!isValidEmailAddress(emailAddress)) {
        this.emailError = ''
      } else {
        this.emailError = ''
      }
    },
    createEmptyContainer() {
      return {
        containerType: '',
        numbers: null,
        ventClosedOrNot: '',
        requireTemperature: '',
        humidity: '',
        o2: '',
        co2: '',
        drains: '',
        soc: false
      }
    },
    ensureDefaultContainers() {
      if (!this.form.containers || this.form.containers.length === 0) {
        this.$set(this.form, 'containers', [this.createEmptyContainer()])
      }
    },
    handleOptionChange() {
      var arr = []
      for (var i = 0; i < this.containerOptions.length; i++) {
        if (this.containerOptions[i].isReeferContainer == 'Yes') {
          arr.push(this.containerOptions[i].type)
        }
      }
      var flag = false
      for (var i = 0; i < this.form.containers.length; i++) {
        if (arr.indexOf(this.form.containers[i].containerType) > -1) {
          flag = true
          break
        }
      }
      this.flag = flag
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.form.containers.forEach((_, index) => {
            this.$refs.form.clearValidate('containers.' + index + '.requireTemperature')
          })
        }
      })
    },
    remoteMethod(query) {
      if (query !== '' && query.length >= 3) {
        getVesselList({ vesselCode: query }).then(response => {
          this.vesselListLes = response.data
        })
        this.loading = true
      } else {
        this.vesselListLes = []
      }
    },
    getParty() {
      this.getParties({ partyRole: 'Shipper' })
      this.getParties({ partyRole: 'Consignee' })
      this.getParties({ partyRole: 'Notify Party' })
      this.getParties({ partyRole: 'Agreement Party' })
      this.getParties({ partyRole: 'Customer' })
    },
    remoteMethod2(query) {
      if (query !== '' && query.length >= 3) {
        getVesselList({ vesselName: query }).then(response => {
          this.vesselListLes = response.data
        })
        this.loading = true
      } else {
        this.vesselListLes = []
      }
    },
    remoteMethod22(query) {
      if (query !== '' && query.length >= 3) {
        getVesselList({ vesselName: query }).then(response => {
          this.vesselListLes = response.data
          this.changeVesselName(this.form.shipmentRouters[0])
        })
        this.loading = true
      } else {
        this.vesselListLes = []
      }
    },
    remoteMethod3(query) {
      if (query !== '' && query.length >= 3) {
        getVesselList({ imo: query }).then(response => {
          this.vesselListLes = response.data
        })
        this.loading = true
      } else {
        this.vesselListLes = []
      }
    },
    setCra() {
      if (this.cra_pol.indexOf(this.form.pol) == -1) {
        this.$set(this.form, 'pol', '')
        this.$set(this.form, 'originPort', '')
      }
      if (this.cra_pod.indexOf(this.form.pod) == -1) {
        this.$set(this.form, 'pod', '')
        this.$set(this.form, 'destinationPort', '')
      }
      if (this.cra_contaier_type.length > 0) {
        var data = this.form.containers.filter(item => {
          return this.cra_contaier_type.indexOf(item.containerType) > -1 || item.containerType == ''
        })
        if (data.length == 0) {
          data.push(this.createEmptyContainer())
        }
        this.$set(this.form, 'containers', data)
        this.handleOptionChange()
      }
    },
    changeCarrier(value) {
      this.$set(this.form, 'contractNumber', '')

      if (value == 'TSHG') {
        this.setCra()
        this.craFlag = true
      } else {
        this.craFlag = false
      }
      this.changePort(this.form.originPort)
      this.remoteGetCraNum()
      this.$nextTick(() => {
        this.ensureDefaultContainers()
        this.handleOptionChange()
      })
    },

    setShipmentRouter() {
      if (!this.$route.query.schdule) {
        return
      }
      var schdule = JSON.parse(atob(this.$route.query.schdule))

      console.log('scccccccccccccc', schdule)
      this.$set(this.form, 'carrier', this.carrierMap2[schdule.carrier])
      this.changeCarrier(this.carrierMap2[schdule.carrier])
      if (schdule.carrier == 'TSHG') {
        this.craFlag = true
      }
      this.form.shipmentRouters[0].etd = schdule.etd
      this.form.shipmentRouters[0].eta = schdule.eta
      this.form.shipmentRouters[0].transportMode = 'SEA'
      this.form.shipmentRouters[0].transportMeanName = schdule.vessel
      this.form.shipmentRouters[0].voyage = schdule.voyage
      this.form.shipmentRouters[0].identification = schdule.vc
      this.form.shipmentRouters[0].imo = schdule.imo
      this.form.shipmentRouters[0].service = schdule.service

      this.remoteMethod2(schdule.vn)

      this.form.shipmentRouters[0].voyage = schdule.vo
      this.$set(this.form, 'pol', schdule.pol)
      this.$set(this.form, 'pod', schdule.pod)
      this.changePol(schdule.pol)
      this.changePod(schdule.pod)

      if (schdule.carrier == 'TSHG') {
        this.setSchdulesTSHG(schdule)
      }
    },
    setSchdulesTSHG(schdule) {
      console.log(schdule)
      getVesselList().then(response => {
        this.vesselList = response.data
        var schdules = schdule.tshgList
        if (schdules.length > 0) {
          this.form.shipmentRouters = []
        }

        for (var i = 0; i < schdules.length; i++) {
          var sch = schdules[i]
          if (i == schdules.length - 1) {
            this.form.shipmentRouters.push({
              // pol: keys.length==1?preAssignMap[keys[0]].fnd:schdule.pod,
              pol: schdule.pod,
              transportMode: 'Ocean',
              etd: null,
              eta: null
            })
            continue
          }
          if (i != schdules.length - 1 && sch.event == 'Departure') {
            // 有船 并且是 departure ；或者barge
            var sch1 = schdules[i + 1]
            var schItem = {
              transportMode: sch.barge,
              etd: sch.eventTime,
              eta: sch1.eventTime,
              transportMeanName: sch.barge == 'Barge' ? 'TBA' : sch.vessel,
              service: sch.barge == 'Barge' ? 'Unknown' : sch.service,
              voyage: sch.barge == 'Barge' ? 'Unknown' : sch.voyage,
              pol: i == 0 ? schdule.pol : sch.portCode
            }
            if (sch.barge == 'Barge') {
              schItem.transportMode = 'BRG'
            }
            if (sch.barge == 'Ocean') {
              schItem.transportMode = 'SEA'
            }
            var obj = this.vesselList.find(element => element.vesselName == schItem.transportMeanName)

            if (obj) {
              schItem.identification = obj.vesselCode
              schItem.imo = obj.imo
            } else {
              schItem.identification = 'Unknown'
              schItem.imo = 'Unknown'
            }
            if (i == 0) {
              this.form.shipmentRouters[0] = schItem
            } else {
              this.form.shipmentRouters.push(schItem)
            }
          }
          this.form = JSON.parse(JSON.stringify(this.form))
        }
        console.log(this.form.shipmentRouters)
      })
    },
    changeVesselCode(item) {
      var obj = this.vesselListLes.find(element => element.vesselCode == item.identification)
      if (obj) {
        item.transportMeanName = obj.vesselName
        item.imo = obj.imo
      } else {
        item.imo = null
      }

      this.$set(this.form, 'tempaax', 1)
      this.$delete(this.form, 'tempaax')
    },
    changeVesselName(item) {
      var obj = this.vesselListLes.find(element => element.vesselName == item.transportMeanName)
      if (obj) {
        item.identification = obj.vesselCode
        item.imo = obj.imo
      } else {
        item.identification = null
        item.imo = null
      }

      this.$set(this.form, 'tempaax', 1)
      this.$delete(this.form, 'tempaax')
    },
    changeVesselIMO(item) {
      var obj = this.vesselListLes.find(element => element.imo == item.imo)
      if (obj) {
        item.identification = obj.vesselCode
        item.transportMeanName = obj.vesselName
      }

      this.$set(this.form, 'tempaax', 1)
      this.$delete(this.form, 'tempaax')
    },
    getVesselList() {},
    submitHsCode() {
      this.$refs['hsCodeForm'].validate(valid => {
        if (valid) {
          applyNewHsCode(this.hsCode).then(res => {
            this.$notify({
              title: 'success',
              message: 'success',
              type: 'success'
            })
            this.applyHsCodeVisable = false
            this.hsCode = {}
          })
        } else {
          return false
        }
      })
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.partyForm))
          data.partyRole = ',' + data.partyRole.join(',') + ','
          data.status = 0
          createDeptApply(data).then(response => {
            this.$modal.msgSuccess('Success')
            this.open = false
            this.getParty()
          })
        }
      })
    },
    applyNewParty() {
      this.open = true
    },
    addProduct() {
      this.form.productData.push({
        batteries: 3,
        fileList: [],
        uploadData: {},
        hazardousMaterials: {}
      })
    },
    changeBatteries(item) {
      if (item.batteries == 3) {
        item.batteriesLevelTow = []
      } else {
        this.$set(item, 'notToAll', false)
      }
    },
    changeNotToAll(item) {
      if (item.notToAll) {
      }
    },
    showWeight(item) {
      if (item.containerType == '') {
        return 0
      } else {
        var c = this.containerOptions.find(element => element.type == item.containerType)
        if (c) {
          return (item.numbers ? Number(item.numbers) : 0) * c.weight
        }
      }
    },
    getParties(obj, setAp) {
      var vm = this
      listDept(obj).then(response => {
        for (var i = 0; i < response.data.length; i++) {
          vm.$set(
            vm.partiesMap,
            response.data[i].id,
            response.data[i].name + '\n' + (response.data[i].country == null ? '' : response.data[i].country) + ' ' + (response.data[i].address == null ? '' : response.data[i].address)
          )
        }

        if (setAp) {
          this.$set(this.form, 'agreementParty', response.data[0].id)
        }
        this.$set(this.parties, obj.partyRole, response.data)
      })
    },
    changePort(value) {},
    changePol(value) {
      // this.$set(this.form, "originPort", "");
      this.form.shipmentRouters[0].pol = value
      this.form = JSON.parse(JSON.stringify(this.form))
    },
    changePod(value) {
      // this.$set(this.form, "destinationPort", "");
      this.form.shipmentRouters[this.form.shipmentRouters.length - 1].pol = value
      this.form = JSON.parse(JSON.stringify(this.form))
    },
    submit(status) {
      console.log('this.$route.query.ids1', this.$route.query.ids)
      if (this.form.carrier == '' || this.form.carrier == null) {
        this.$notify({
          message: 'Carrier is required',
          type: 'warning'
        })
        return
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.submitLoading = true
          this.loadingSaveBut = true
          var data = JSON.parse(JSON.stringify(this.form))
          if (this.form.carrier == 'TSHG' && this.form.por == 'CNNGB' && this.form.pol == 'CNTAG' && this.form.shipmentRouters.length == 1) {
            data.shipmentRouters[0].pol = 'CNNGB'
          }
          for (var i = 0; i < data.shipmentRouters.length; i++) {
            if (i != data.shipmentRouters.length - 1) {
              data.shipmentRouters[i].pod = data.shipmentRouters[i + 1].pol
            }
          }
          data.shipmentRouters.pop()
          data.routers = JSON.stringify(data.shipmentRouters)
          var containerWeight = 0
          // var remark=data.remark.replace(/Reefer Container:.*/g, "");
          // data.remark=remark
          var text = 'Reefer Container:'
          for (var i = 0; i < data.containers.length; i++) {
            if (data.containers[i].soc == 'Yes') {
              flag = true
            }
            var c = this.containerOptions.find(element => element.type == data.containers[i].containerType)
            if (c != null && c.weight != null) {
              containerWeight += Number(c.weight) * Number(data.containers[i].numbers)
            }
            if (data.containers[i].requireTemperature) {
              text +=
                '' +
                data.containers[i].containerType +
                ' Ventilation(cbm/hour):' +
                (data.containers[i].ventClosedOrNot ? data.containers[i].ventClosedOrNot : 'No') +
                ' Humidity(%):' +
                (data.containers[i].humidity ? data.containers[i].humidity : 'No') +
                ' O2(%):' +
                (data.containers[i].o2 ? data.containers[i].o2 : ' ') +
                ' CO2(%):' +
                (data.containers[i].co2 ? data.containers[i].co2 : ' ') +
                ' Drains:' +
                (data.containers[i].drains ? data.containers[i].drains : ' ')
              console.log(text)
            }
          }
          if (text == 'Reefer Container:') {
            text = ''
          }
          data.remark = data.remark + '\n' + text
          data.containers = JSON.stringify(data.containers)
          var flag = false
          var grossWeight = 0
          for (var i = 0; i < data.productData.length; i++) {
            data.productData[i].hazardousMaterials = JSON.stringify(data.productData[i].hazardousMaterials)
            if (data.productData[i].dg == 1) {
              flag = true
            }

            grossWeight += Number(data.productData[i].grossWeight)

            if (data.productData[i].dg === 1 || data.productData[i].batteries === 2) {
              if (data.productData[i].fileList.length < 1) {
                this.$notify.error('Please upload relevant documents of battery-related goods or dangerous goods, such as MSDS!')
                this.submitLoading = false
                this.loadingSaveBut = false
                return
              }
            }
          }
          data.soIds = this.soQueryParams.ids
          data.spoIds = this.spoIds
          this.uploadCount = 0
          this.successCount = 0

          data.productData = JSON.stringify(data.productData)
          console.log('this.$route.query.ids', this.$route.query.spoIds)
          data.bookingIds = this.$route.query.spoIds
          data.status = status
          data.isPepco = this.isPepco
          if (this.source == 'booking-order') {
            data.source = 'booking-order'
          }
          console.log('this.data', data)
          data.realCarrier = this.form.carrier
          create(data).then(response => {
            if (response.data && response.data.errorCode) {
              if (response.data.errorCode === '1003000026') {
                console.log('创建失败', response.data.message)
                this.$message({
                  message: response.data.message || 'create failed',
                  type: 'error',
                  duration: 3000
                })
                this.submitLoading = false
                this.loadingSaveBut = false
                return
              }
            }

            this.shipmentId = response.data.shipmentId
            for (var i = 0; i < response.data.productIds.length; i++) {
              this.form.productData[i].uploadData.exId = response.data.productIds[i]
            }
            var count = 0
            for (var i = 0; i < response.data.productIds.length; i++) {
              if (this.$refs['upload' + i] && this.$refs['upload' + i][0]) {
                this.$refs['upload' + i][0].submit()
              }
            }
            if (this.source == 'booking-order') {
              this.$router.push('/shipment/booking-order')
            } else {
              this.$router.push('/shipment/detail?id=' + this.shipmentId)
            }
            this.loadingSaveBut = false
            localStorage.setItem('refreshPoPage', JSON.stringify({ key: 'value' }))
          })
        } else {
          return false
        }
      })
    },
    handleSuccess(response, file, fileList) {
      this.successCount = this.successCount + 1
      if (this.successCount == this.uploadCount) {
        this.$router.push('/shipment/detail?id=' + this.shipmentId)
      }
    },
    getLabel(code, type) {
      var item = this.portOptions.find(item => item.code == code)
      if (item) {
        return item.name
      } else {
        return code
      }
    },
    getContainerList() {
      return getContainerList().then(response => {
        this.containerOptions = response.data || []
        this.handleOptionChange()
      })
    },
    getBookingList(ids) {
      getBookingList({ ids: ids }).then(response => {
        console.log('response.data123', response.data)
        if (response.data.length > 0) {
          var orderItems = []
          var preAssigns = []
          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].bookingPreAssignDOS != null) {
              if (response.data[i].bookingPreAssignDOS.length > 0) {
                preAssigns.push(response.data[i].bookingPreAssignDOS[response.data[i].bookingPreAssignDOS.length - 1])
              }
              //bookingPreAssignDOS
            }
            for (var j = 0; j < response.data[i].bookingItemDOS.length; j++) {
              orderItems.push(response.data[i].bookingItemDOS[j].orderItemId)
              this.orderItemMap[response.data[i].bookingItemDOS[j].orderItemId] = response.data[i].bookingItemDOS[j].qty
            }
          }
          var bookSchdule = {}
          var preAssignMap = {}
          for (var i = 0; i < preAssigns.length; i++) {
            if (preAssigns[i].eta != null && preAssigns[i].etd != null && preAssigns[i].vessel != null && preAssigns[i].voyage != null && preAssigns[i].carrier != null) {
              preAssignMap[preAssigns[i].vessel + '/' + preAssigns[i].voyage + '/' + preAssigns[i].carrier] = preAssigns[i]
            }
            if (preAssigns[i].backup != null) {
              bookSchdule = JSON.parse(preAssigns[i].backup)
            }
          }

          if (orderItems.length > 0) {
            getItemList({ ids: orderItems.join(',') }).then(res => {
              var productIds = []
              var orderIds = []
              for (var i = 0; i < res.data.length; i++) {
                res.data[i].bookedQty = this.orderItemMap[res.data[i].id]
                productIds.push(res.data[i].productId)
                orderIds.push(res.data[i].orderId)
              }
              this.itemTableData = res.data
              getHeaderList({ ids: orderIds.join(',') }).then(orderRes => {
                var pos = []
                for (var i = 0; i < orderRes.data.length; i++) {
                  pos.push(orderRes.data[i].orderNumber)
                  this.$set(this.orderMap, [orderRes.data[i].id], orderRes.data[i].orderNumber)
                }
                this.$set(this.form, 'poNumbers', pos.join(','))
              })
              getProductList({ ids: productIds }).then(productRes => {
                for (var i = 0; i < productRes.data.length; i++) {
                  this.$set(this.productMapForBook, [productRes.data[i].id], {
                    name: productRes.data[i].name,
                    code: productRes.data[i].code
                  })
                }
              })
            })
          }

          for (var i = 0; i < response.data[0].bookingProductDOS.length; i++) {
            var d = response.data[0].bookingProductDOS[i]
            if (d.hazardousMaterials == '{}') {
              d.dg = 0
            } else {
              d.dg = 1
            }
            d.batteries = Number(d.batteries)
            if (!d.batteries) d.batteries = 3
            d.hazardousMaterials = JSON.parse(d.hazardousMaterials)
            d.fileList = []
            d.uploadData = {}
            this.form.productData.push(d)
          }

          var schdule = {
            pol: response.data[0].originPort,
            pod: response.data[0].destinationPort
          }
          console.log('schdule123', schdule)
          console.log('schdule1234', preAssignMap)
          const keys = Object.keys(preAssignMap)
          this.form.shipmentRouters[0].pol = keys.length == 1 ? preAssignMap[keys[0]].por : schdule.pol

          this.form.shipmentRouters.push({
            pol: keys.length == 1 ? preAssignMap[keys[0]].fnd : schdule.pod,
            transportMode: 'SEA',
            etd: null,
            eta: null
          })

          this.$set(this.form, 'pol', schdule.pol)
          this.$set(this.form, 'pod', schdule.pod)

          if (schdule.pol) this.changePol(schdule.pol)
          if (schdule.pod) this.changePod(schdule.pod)

          if (keys.length == 1) {
            this.form.shipmentRouters[0].transportMeanName = preAssignMap[keys[0]].vessel
            this.form.shipmentRouters[0].etd = preAssignMap[keys[0]].etd
            this.form.shipmentRouters[0].eta = preAssignMap[keys[0]].eta
            this.form.shipmentRouters[0].transportMode = 'SEA'
            this.form.shipmentRouters[0].voyage = preAssignMap[keys[0]].voyage
            this.$set(this.form, 'pol', preAssignMap[keys[0]].por)
            this.$set(this.form, 'pod', preAssignMap[keys[0]].fnd)
            this.changePol(preAssignMap[keys[0]].por)
            this.changePod(preAssignMap[keys[0]].fnd)
            this.$set(this.form, 'carrier', preAssignMap[keys[0]].carrier)
            this.changeCarrier(preAssignMap[keys[0]].carrier)
            this.remoteMethod22(this.form.shipmentRouters[0].transportMeanName)

            this.searchSchedule.from = preAssignMap[keys[0]].etd - 60 * 60 * 24
            this.searchSchedule.to = preAssignMap[keys[0]].eta
            //this.queryShippingSchedule2()
            //
          } else {
            this.form.shipmentRouters[0].transportMode = 'SEA'
          }
          this.form = JSON.parse(JSON.stringify(this.form))

          if (bookSchdule.carrier == 'TSHG') {
            this.setSchdulesTSHG(bookSchdule)
          }

          //changeVesselName(router)
          //this.form.shipmentRouters[0].imo = schdule.imo;
          //this.remoteMethod2(schdule.vn)
        }
      })
    },
    handleDelete(index) {
      this.form.productData.splice(index, 1)
    },
    handleDeleteContainer(index) {
      this.form.containers.splice(index, 1)
      this.ensureDefaultContainers()
      this.handleOptionChange()
    },
    addContainers() {
      this.form.containers.push(this.createEmptyContainer())
    },
    initSO() {
      this.soQueryParams.ids = this.soIds.split(',')
      getSOHeaderPage(this.soQueryParams).then(res => {
        var orderNumbers = []
        for (var i = 0; i < res.data.list.length; i++) {
          res.data.list[i].key = 'first' + res.data.list[i].id
          orderNumbers.push(res.data.list[i].salesOrderNumber)
        }
        this.soTableData = res.data.list
        this.soLineTotal = res.data.total
      })
    },
    getPortList() {
      getOriginDeliveryList().then(response => {
        this.portOptions = response.data
        //booking
        var ids = this.$route.query.ids
        //salesOrder
        var soIds = this.$route.query.soIds
        //shippingOrder
        var spoIds = this.$route.query.spoIds
        if (ids) {
          this.getBookingList(ids)
          return
        } else if (soIds) {
          this.soIds = soIds
          this.initSO()
        }
        if (spoIds) {
          this.spoIds = spoIds.split(',')

          getShippingOrderListByIds(this.spoIds).then(async response => {
            this.spoList = response.data
            // 处理cargoInfo
            this.handleCargoInfo(this.spoList, spoIds)
            await this.waitForSoProductList()
            getOrderHeadersList({ shippingOrderIds: spoIds })
              .then(res => {
                console.log(res)
                this.spoItems = []
                for (var order of res.data) {
                  console.log(order)

                  var shipping = this.spoList.filter(item => item.id == order.shippingId)
                  console.log(shipping)
                  if (shipping.length > 0) {
                    // 如果 order.soRef 没有值的时候再塞 edwin
                    if (!order.soRef) {
                      order.soRef = shipping[0].soRef
                    }
                    // order.soRef = shipping[0].soRef
                    var products = shipping[0].productDOList
                    if (products && products.length > 0) order.hscode = products[0].hscode
                  }
                  for (var item of order.items) {
                    item.soRef = order.soRef
                    item.orderNumber = order.orderNumber
                    item.hscode = order.hscode
                    item.bookedWeight = item.booked * item.outerWeight
                    item.bookedVolume = item.booked && item.length && item.width && item.height ? Number((item.booked * item.length * item.width * item.height) / 1000000) : 0
                    this.spoItems.push(item)
                  }
                }
                this.getFromSOProductData()
              })
              .catch(err => {
                console.log(err)
              })
            const productData = {
              fileList: [],
              uploadData: {},
              hazardousMaterials: {},
              batteries: 3,
              dg: 0
            }
            for (var i = 0; i < this.spoList.length; i++) {
              this.form.originPort = this.spoList[i].bookingPreAssignDOS[0].pol
              this.form.destinationPort = this.spoList[i].bookingPreAssignDOS[0].pod
              this.form.pol = this.spoList[i].bookingPreAssignDOS[0].por
              this.form.pod = this.spoList[i].bookingPreAssignDOS[0].fnd
              this.changePol(this.form.pol)
              this.changePod(this.form.pod)
              if (this.spoList[i].shipmentType == 'FCL') {
                const loaded = []
                for (var j = 0; j < this.spoList[i].containerDOList.length; j++) {
                  var con = this.spoList[i].containerDOList[j]
                  loaded.push({
                    ...con,
                    containerType: con.type != null ? String(con.type) : '',
                    numbers: con.qty != null ? Number(con.qty) : null,
                    ventClosedOrNot: con.ventClosedOrNot != null ? String(con.ventClosedOrNot) : '',
                    requireTemperature: con.requireTemperature != null ? String(con.requireTemperature) : '',
                    humidity: con.humidity != null ? String(con.humidity) : '',
                    o2: con.o2 != null ? String(con.o2) : '',
                    co2: con.co2 != null ? String(con.co2) : '',
                    drains: con.drains != null ? String(con.drains) : '',
                    soc: con.soc === true || con.soc === 1 || con.soc === 'Yes',
                    type: 0
                  })
                }
                this.$set(this.form, 'containers', loaded)
                this.ensureDefaultContainers()
                this.handleOptionChange()
              }
              for (let j = 0; j < this.spoList[i].productDOList.length; j++) {
                if (this.spoList[i].productDOList[j].hazardousMaterials && this.spoList[i].productDOList[j].hazardousMaterials !== '{}') {
                  productData.dg = 1
                }
                if (this.spoList[i].productDOList[j].batteries === 2) {
                  productData.batteries = 2
                }
              }
            }
            this.form.productData.push(productData)
          })
        } else {
          this.form.productData.push({
            batteries: 3,
            fileList: [],
            uploadData: {},
            dg: 0,
            hazardousMaterials: {}
          })
        }

        this.form.shipmentRouters.push({
          pol: '',
          pod: '',
          transportMode: 'SEA',
          etd: null,
          eta: null
        })

        var schdule = JSON.parse(atob(this.$route.query.schdule))

        console.log('船期数据', schdule)
        this.setShipmentRouter()
        this.hide2 = true
        this.hide = true
      })
    },

    selectBlur(item) {
      for (var i = 0; i < this.hsCodeList.length; i++) {
        if (item.hscode == this.hsCodeList[i].hsCode) {
          item.productEnglishName = this.hsCodeList[i].productEnglishName
        }
      }
    },
    selectClear() {},

    remoteGetHsCode(query) {
      if (query !== '' && query.length >= 4) {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.getHsCodeListByCode(query)
          this.options = this.hsCodeList.filter(item => {
            return item.hsCode.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    getAllocationWeekList() {
      if (this.form.contractNumber && this.form.carrier) {
        getAllocationWeekData(this.form.carrier, this.form.contractNumber).then(response => {
          this.allocationWeekList = response.data
        })
      }
    },
    remoteChangeCraNum() {
      let inputCra = this.$refs.nameCra.selectedLabel.trim()
      console.log(inputCra)
      console.log(this.form.contractNumber)
      console.log('remoteChangeCraNum')
    },
    remoteGetCraNum() {
      //query Allocation  etd week
      this.getAllocationWeekList()

      this.form.reasonOfPremium = ''

      var query = this.form.contractNumber
      if (this.form.carrier == 'MAEU') {
      }
      if (this.form.carrier != 'TSHG') {
        return
      }
      this.craFlag = true
      var remark = this.form.remark.replace(/CRA:.*/g, '')
      if (remark == '') {
        this.$set(this.form, 'remark', remark + '\nCRA:' + query)
      } else {
        this.$set(this.form, 'remark', remark + 'CRA:' + query)
      }
      if (query !== '' && query.length >= 4) {
        getCraNumList(query).then(response => {
          this.craNumList = response.data
          if (this.craNumList.length > 0) {
            if (this.craNumList[0] && this.craNumList[0].ap) {
              var req = {
                partyRole: 'Agreement Party',
                customerCode: this.craNumList[0].ap
              }
              this.getParties(req, true)
            }
          } else {
            this.cra_pol = []
            this.cra_pod = []
            this.cra_origin = []
            this.cra_disch = []
            this.cra_contaier_type = []
          }
          for (var i = 0; i < this.craNumList.length; i++) {
            if (this.cra_pol.indexOf(this.craNumList[i].origin) == -1) {
              this.cra_pol.push(this.craNumList[i].origin)
            }
            if (this.cra_pod.indexOf(this.craNumList[i].delivery) == -1) {
              this.cra_pod.push(this.craNumList[i].delivery)
            }
            if (this.cra_origin.indexOf(this.craNumList[i].loadPort) == -1) {
              this.cra_origin.push(this.craNumList[i].loadPort)
            }
            if (this.cra_disch.indexOf(this.craNumList[i].dischPort) == -1) {
              this.cra_disch.push(this.craNumList[i].dischPort)
            }
            if (this.cra_contaier_type.indexOf(this.craNumList[i].eqpType) == -1) {
              this.cra_contaier_type.push(this.craNumList[i].eqpType)
            }
          }
          this.setCra()
        })
      } else {
        this.cra_contaier_type = []
        this.cra_pol = []
        this.cra_pod = []
        this.cra_origin = []
        this.cra_disch = []
      }
    },
    getHsCodeListByCode(hscode) {
      getHsCodeListByCode(hscode).then(response => {
        this.hsCodeList = response.data
      })
    },
    parseTimeToZ1(timestamp) {
      console.log(timestamp, timestamp)
      if (!timestamp) return null
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}Z`
    },

    totalAllBooked() {
      return this.spoItems.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(typeof currentValue.booked == 'undefined' ? 0 : currentValue.booked)
      }, 0)
    },

    totalAllGrossWeight() {
      return this.spoItems.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(typeof currentValue.bookedWeight == 'undefined' ? 0 : currentValue.bookedWeight)
      }, 0)
    },
    totalAllVolume() {
      return this.spoItems.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(typeof currentValue.bookedVolume == 'undefined' ? 0 : currentValue.bookedVolume)
      }, 0)
    },
    shippingProductTotalAllBooked() {
      if (!this.receiveSOProductList || this.receiveSOProductList.length == 0) return 0
      return this.receiveSOProductList.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(typeof currentValue.numberOfPackages == 'undefined' ? 0 : currentValue.numberOfPackages)
      }, 0)
    },
    shippingProductTotalAllGrossWeight() {
      if (!this.receiveSOProductList || this.receiveSOProductList.length == 0) return 0
      return this.receiveSOProductList.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(typeof currentValue.grossWeight == 'undefined' ? 0 : currentValue.grossWeight)
      }, 0)
    },
    shippingProductTotalAllVolume() {
      if (!this.receiveSOProductList || this.receiveSOProductList.length == 0) return 0
      return this.receiveSOProductList.reduce((accumulator, currentValue) => {
        return Number(accumulator) + Number(typeof currentValue.volume == 'undefined' ? 0 : currentValue.volume)
      }, 0)
    },
    getFromOrder() {
      this.form.productFromOrder = 1
      var weight = this.totalAllGrossWeight().toFixed(3)
      var volume = this.totalAllVolume().toFixed(3)
      var product = this.form.productData[0]
      var booked = this.totalAllBooked()
      product.numberOfPackages = booked
      product.grossWeight = weight
      product.volume = volume
      var units = this.getDictDatas(this.DICT_TYPE.SYSTEM_UNITS)
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
    //传递 货物信息
    handleCargoInfo(spoList, spoIds) {
      this.$nextTick(() => {
        this.$refs.shipmentCargoInfo.active(spoList, spoIds)
      })
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

        const productNames = this.receiveSOProductList.map(item => item.productEnglishName).join('\n')
        product.productEnglishName = productNames
        console.log('productNames', productNames)
      }
      this.form.productData = JSON.parse(JSON.stringify(this.form.productData))
    },
    // 获取so product list
    handleSoProductList(soProductList) {
      this.receiveSOProductList = soProductList
      console.log('handleSoProductList', soProductList)

      if (this._resolveSoProductList) {
        // 通知 promise 完成
        this._resolveSoProductList()
        this._resolveSoProductList = null
      }
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
    waitForSoProductList() {
      return new Promise(resolve => {
        this._resolveSoProductList = resolve
      })
    }
  }
}
// 自定义函数用于验证电子邮件地址
function isValidEmailAddress(email) {
  // 自定义验证逻辑
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}
</script>
<style scoped>
.company-option-with-tooltip {
  display: block;
  overflow: hidden;
  white-space: nowrap;
}
</style>
<style>
.company-full-width-tooltip-shipment-create {
  white-space: nowrap !important;
  max-width: none !important;
  width: auto !important;
}
</style>
