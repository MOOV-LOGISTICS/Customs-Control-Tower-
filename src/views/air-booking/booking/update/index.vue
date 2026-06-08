<template>
  <div class="app-container shipment-create" style="width:100%; margin: 0 auto">
    <el-card class="pd-20">
      <el-form v-loading="submitLoading" :model="form" ref="form" :show-message="false" label-width="150px">
        <el-card style="box-shadow: none;border:1px solid #ddd!important;border-radius: 0px!important;margin: 15px 0px;padding: 10px 0px;">
          <span class="general-info">General Info</span>
          <el-descriptions style="box-shadow: none;" class="margin-top" title :column="4" size="mini" border>
            <el-descriptions-item>
              <template slot="label">Air Line</template>
              <el-form-item required prop="airline">
                <bsc-airline-select v-model="form.airline" @select="selectAir" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">Port of Loading</template>
              <el-form-item required prop="pol">
                <bsc-airport-select v-model="form.pol" @select="selectPol" />
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">Port of Discharge</template>
              <el-form-item required prop="pod">
                <bsc-airport-select v-model="form.pod" @select="selectPod" />
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">Place of Delivery</template>
              <el-form-item prop="fnd">
                <el-input v-model="form.fnd" type="textarea" rows="2" />
              </el-form-item>
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
              <template slot="label">Booking Agent</template>
             <el-form-item prop="bookingAgent">
                <el-input v-model="form.bookingAgent" type="textarea" rows="2" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item></el-descriptions-item>
            <el-descriptions-item></el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">Remark</template>

              <el-form-item prop="remark">
                <el-input v-model="form.remark" type="textarea" rows="3" />
              </el-form-item>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
        <el-card style="box-shadow: none;border:1px solid #ddd!important;border-radius: 0px!important;margin: 15px 0px;padding: 10px 0px;">
          <span class="general-info">Parties</span>

          <el-row :gutter="20" style="padding-bottom: 10px;  padding-top: 20px;">
            <el-col :span="8">
              <div style="text-indent: 10px;margin-bottom:8px">
                <b style="font-size: 15px">Shipper</b>
              </div>
              <el-descriptions style="padding-bottom: 5px;  box-shadow: none;" :colon="false" class="margin-top parties-desc" title :column="1" size="mini">
                <el-descriptions-item>
                  <template slot="label">
                    <span style="width: 64px; color: #666; ">Name</span>
                  </template>
                  <el-form-item required prop="shipperPartyId" style=" width: 100% !important;">
                    <el-select filterable clearable v-model="form.shipperPartyId">
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
                  <el-form-item required prop="consigneePartyId" style=" width: 100% !important;">
                    <el-select remote clearable filterable v-model="form.consigneePartyId">
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
                  <el-form-item required prop="notifyPartyId" style=" width: 100% !important;">
                    <el-select remote clearable filterable v-model="form.notifyPartyId">
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
          <span class="general-info">Booking Contact</span>
          <el-descriptions style="box-shadow: none;" :column="3" border>
            <el-descriptions-item>
              <template slot="label">{{ $t('booking.name') }}</template>
              <el-form-item required prop="contactName">
                <el-input v-model="form.contactName" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">{{ $t('booking.phone') }}</template>
              <el-form-item required prop="contactPhone">
                <el-input v-model="form.contactPhone" @blur="validatePhoneNumber" />
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">{{ $t('booking.email') }}</template>
              <el-form-item required prop="contactEmail" type="email">
                <el-input v-model="form.contactEmail" @blur="validateEmailAddress" />
              </el-form-item>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card style="box-shadow: none;border:1px solid #ddd!important;border-radius: 0px!important;margin: 15px 0px;padding: 10px 0px;">
          <!--增加 货物信息-->
          <div>
            <booking-goods-info ref="bookingGoodsInfo" @so-product-list="handleSoProductList" />
          </div>
          <!-- // so下面的po列表，暂时先隐藏 -->

          <!-- <el-table style="margin-bottom:10px" border v-if=" form.productData.length > 0" :data=" form.productData">
            <el-table-column prop="orderId" label="Order Number">
              <template v-slot="scope">
                <span>{{ orderMap[scope.row.orderId] }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="productId" label="Product Code">
              <template v-slot="scope">
                <span>{{ productMapForBook[scope.row.productId] ? productMapForBook[scope.row.productId].code : "" }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="productId" label="Product Name">
              <template v-slot="scope">
                <span>{{ productMapForBook[scope.row.productId] ? productMapForBook[scope.row.productId].name : "" }}</span>
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
          </el-table>-->
          <!-- <el-row>
            <el-button @click="addProduct" size="mini" type="primary">{{ $t("booking.addProduct") }}</el-button>
          </el-row> -->
           <div v-show="receiveSOProductList && receiveSOProductList.length>0" style="padding: 10px 0px;">
              <el-button @click="getFromSOProductData" size="mini" type="primary">Get From Shipper Booking</el-button>
          </div>
          <el-descriptions border  :label-style="{ width: '140px' }" style="box-shadow: none;" :colon="false" direction="vertical" v-for="(item, i) in form.productData" :key="'product' + i" class="margin-top" title :column="3">
            <template slot="extra">
              <el-button v-if="i != 0" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(i)">{{ $t("search.delete") }}</el-button>
            </template>
            <el-descriptions-item :label="$t('booking.marksAndNumbers')">
              <el-form-item required :prop="'productData.' + i + '.markNumber'">
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" v-model="item.markNumber" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('booking.productEnglishName')">
              <el-form-item required :prop="'productData.' + i + '.productNameEn'">
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" v-model="item.productNameEn" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="Product Chinese Name">
              <el-form-item  :prop="'productData.' + i + '.productNameCn'">
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" v-model="item.productNameCn" />
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item :label="$t('booking.hsCode')">
              <el-input v-model="item.hsCode"  clearable minlength="10" maxlength="10" @blur="validateHsCode($event, item)" />
            </el-descriptions-item>
            <el-descriptions-item label="Number Of Packages">
              <el-form-item required :prop="'productData.' + i + '.packageNumber'">
                <el-input-number v-model="item.packageNumber" @blur="item.packageNumber = $event.target.value.trim()" :controls="false" :precision="0" />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="Packages">
              <el-form-item required :prop="'productData.' + i + '.packageMethod'">
                <el-select filterable v-model="item.packageMethod" placeholder>
                  <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="Gross Weight(KG)">
              <el-form-item required :prop="'productData.' + i + '.grossWeight'">
                <el-input-number v-model="item.grossWeight" @blur="item.grossWeight = $event.target.value.trim()" :controls="false" :precision="3" />
              </el-form-item>
            </el-descriptions-item>
            <!-- <el-descriptions-item label="Chargable Weight(KG)">
              <el-form-item required :prop="'productData.' + i + '.grossWeight'">
                <el-input-number v-model="item.grossWeight" @blur="item.grossWeight = $event.target.value.trim()" :controls="false" :precision="3" />
              </el-form-item>
            </el-descriptions-item>-->
            <el-descriptions-item label="Volume(CBM)">
              <el-form-item required :prop="'productData.' + i + '.volume'">
                <el-input-number v-model="item.volume" @blur="item.volume = $event.target.value.trim()" :controls="false" :precision="3" />
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item label="DG">
    <el-switch
      :key="item.id"
      v-model.number="item.dg"
      :active-value="1"
      :inactive-value="0"
      active-text="Yes"
      inactive-text="No"
      @change="changeDG(item)"
    />
              </el-descriptions-item>
            <el-descriptions-item label="Batteries">
              <el-radio-group @input="changeBatteries(item)" v-model="item.batteries">
                <el-radio :label="1" border>Has batteries</el-radio>
                <el-radio :label="2" border>No batteries</el-radio>
              </el-radio-group>
            </el-descriptions-item>

            <!-- <el-descriptions-item :label="dict.label"  v-for="dict in getDictDatas(DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS)" :key="'d' + dict.value" v-if="item.dg === 1">
              <el-input v-model="item.hazardousMaterials[dict.value]" />
            </el-descriptions-item> -->
               <!-- Hazardous Materials -->
            <template v-for="dict in getDictDatas(DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS)">
              <el-descriptions-item 
                v-if="item.dg === 1" 
                :key="'d' + dict.value" 
                :label="dict.label"
              >
                <el-input v-model="item.hazardousMaterials[dict.value]" />
              </el-descriptions-item>
            </template>

            <!-- <el-descriptions-item label>
              <el-row :gutter="20" style="color: #004F7C; font-weight: 700 !important; margin-bottom: 5px">
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
            </el-descriptions-item>-->
          </el-descriptions>
        </el-card>

        <el-card style="box-shadow: none;border:1px solid #ddd!important;border-radius:0px;padding-top:10px;margin-bottom:15px">
          <span class="general-info">Booking Router</span>
          <div class="transport-legs-container">
            <span class="transport-legs">Transport Legs</span>
            <el-button class="transport-legs-button" @click="addLegs(form.airRouters.length-1)">+ Add Legs</el-button>
          </div>

          <el-timeline style="padding-top: 20px;">
            <el-timeline-item
              :timestamp=" (item.etd!=null||item.eta!=null)? (   (parseTime(item.etd) ? parseTime(item.etd) : '-') +   ' - ' +   (parseTime(item.eta) ? parseTime(item.eta) : '-')   ):'' "
              placement="top"
              v-for="(item, i) in form.airRouters"
              :key="i + 'router'"
              class="shipmentRouters-css"
            >
              <!-- 添加图标和数字 -->
              <div style="display: flex; align-items: center;">
                <img :src="getIcon(item.transportMode)" style="width: 24px; height: 24px;" />
                <span style="margin-left: 8px;">{{ i +1 }}</span>
              </div>
               <el-card shadow="never">
             <div v-if="i != form.airRouters.length">
    <!-- 公共第一行标题 -->
    <el-row :gutter="20">
      <el-col :span="4"><font color="#FF0000">*</font>Mode of Transport</el-col>
      <el-col :span="4"><font color="#FF0000">*</font>Carrier</el-col>
      <!-- 根据模式显示标题 -->
      <template v-if="item.transportMode=='AIR'">
        <el-col :span="4"><font color="#FF0000">*</font>Flight</el-col>
        <el-col :span="4"><font color="#FF0000">*</font>POL</el-col>
      </template>
      <template v-else-if="item.transportMode=='SEA'">
        <el-col :span="4"><font color="#FF0000">*</font>Service</el-col>
        <el-col :span="4"><font color="#FF0000">*</font>Vessel</el-col>
      </template>
    </el-row>

    <!-- 输入行 -->
    <el-row :gutter="20" style="margin-bottom: 5px">
      <el-col :span="4">
        <el-form-item required :prop="'airRouters.' + i + '.transportMode'">
          <el-select v-model="item.transportMode" clearable filterable>
            <el-option v-for="dict in transportMode" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="4">
        <el-form-item required :prop="'airRouters.' + i + '.carrier'">
          <bsc-airline-select v-model="item.carrier" @select="selectRouterAirline(item.carrier,i)" />
        </el-form-item>
      </el-col>

      <!-- AIR 专用 -->
      <template v-if="item.transportMode=='AIR'">
        <el-col :span="4">
          <el-form-item required :prop="'airRouters.' + i + '.flight'">
            <el-input v-model="item.flight" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item required :prop="'airRouters.' + i + '.pol'">
            <bsc-airport-select v-model="item.pol" @select="onPolChange(i)"  />
          </el-form-item>
        </el-col>
      </template>

      <!-- SEA 专用 -->
      <template v-else-if="item.transportMode=='SEA'">
        <el-col :span="4">
          <el-form-item :prop="'airRouters.' + i + '.serviceCode'">
            <el-input v-model="item.serviceCode" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item required :prop="'airRouters.' + i + '.vessel'">
            <el-input v-model="item.vessel" />
          </el-form-item>
        </el-col>
      </template>
    </el-row>

    <!-- 第二行：AIR / SEA 的后续信息 -->
    <template v-if="item.transportMode=='AIR'">
      <el-row :gutter="20" style="margin-bottom: 5px">
        <el-col :span="4"><font color="#FF0000">*</font>POD</el-col>
        <el-col :span="4"><font color="#FF0000">*</font>{{ $t("booking.etd") }}</el-col>
        <el-col :span="4"><font color="#FF0000">*</font>ETD Time</el-col>
        <el-col :span="4"><font color="#FF0000">*</font>{{ $t("booking.eta") }}</el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 5px">
        <el-col :span="4">
          <el-form-item required :prop="'airRouters.' + i + '.pod'">
            <bsc-airport-select v-model="item.pod"  @select="onPodChange(i)" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item required :prop="'airRouters.' + i + '.etd'">
            <el-date-picker type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="item.etd" :picker-options="{
            disabledDate: date => item.etd ? date < new Date(item.etd) : false
          }" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item required :prop="'airRouters.' + i + '.etdTime'">
            <el-time-picker value-format="HH:mm" format="HH:mm" :picker-options="{ step: '00:30' }" v-model="item.etdTime" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item required :prop="'airRouters.' + i + '.eta'">
            <el-date-picker type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="item.eta" :picker-options="{
            disabledDate: date => item.etd ? date < new Date(item.etd) : false
          }" />
          </el-form-item>
        </el-col>
      </el-row>
    </template>

    <template v-else-if="item.transportMode=='SEA'">
      <el-row :gutter="20" style="margin-bottom: 5px">
        <el-col :span="4"><font color="#FF0000">*</font>Voyage</el-col>
        <el-col :span="4"><font color="#FF0000">*</font>POR</el-col>
        <el-col :span="4"><font color="#FF0000">*</font>POL</el-col>
        <el-col :span="4"><font color="#FF0000">*</font>POD</el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 5px">
        <el-col :span="4">
          <el-form-item required :prop="'airRouters.' + i + '.voyage'">
            <el-input v-model="item.voyage" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item required :prop="'airRouters.' + i + '.por'">
            <el-select filterable v-model="item.por">
              <el-option v-for="(port, index) in portOptions" :key="index + 'por'" :label="port.name+' ('+port.code+')'" :value="port.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item required :prop="'airRouters.' + i + '.pol'">
            <el-select filterable v-model="item.pol">
              <el-option v-for="(port, index) in portOptions" :key="index + 'pol'" :label="port.name+' ('+port.code+')'" :value="port.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item required :prop="'airRouters.' + i + '.pod'">
            <el-select filterable v-model="item.pod">
              <el-option v-for="(port, index) in portOptions" :key="index + 'pod'" :label="port.name+' ('+port.code+')'" :value="port.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- SEA 日期时间 -->
      <el-row :gutter="20" style="margin-bottom: 5px">
        <el-col :span="4">
          <el-form-item required :prop="'airRouters.' + i + '.fnd'">
            <el-select filterable v-model="item.fnd">
              <el-option v-for="(port, index) in portOptions" :key="index + 'fnd'" :label="port.name+' ('+port.code+')'" :value="port.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item required :prop="'airRouters.' + i + '.etd'">
            <el-date-picker type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="item.etd" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item required :prop="'airRouters.' + i + '.etdTime'">
            <el-time-picker value-format="HH:mm" format="HH:mm" :picker-options="{ step: '00:30' }" v-model="item.etdTime" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item required :prop="'airRouters.' + i + '.eta'">
            <el-date-picker type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="item.eta" />
          </el-form-item>
        </el-col>
      </el-row>
    </template>

    <!-- ETA Time 公共 -->
    <el-row :gutter="20">
      <el-col :span="4"><font color="#FF0000">*</font>ETA Time</el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom: 5px">
      <el-col :span="4">
        <el-form-item required :prop="'airRouters.' + i + '.etaTime'">
          <el-time-picker value-format="HH:mm" format="HH:mm" :picker-options="{ step: '00:30' }" v-model="item.etaTime" />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 删除按钮 -->
    <el-row v-if="i != form.airRouters.length" style="margin-top: 10px; text-align: center;">
      <el-col :span="12">
        <el-button v-if="i != 0" type="danger" @click="removeLeg(form.airRouters.length-1)" icon="el-icon-delete" circle></el-button>
      </el-col>
    </el-row>
             </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
        <el-row style="text-align: center">
          <!--        <span style="margin-right: 10px;display:inline-block"><el-checkbox v-model="form.reserved">Reserve space</el-checkbox></span>-->
          <!-- <span style="margin-right: 10px;display:inline-block">
            <el-checkbox v-model="form.noBookingEdi">No EDI</el-checkbox>
          </span>-->

          <el-button v-if="form.status ==0" size="mini" @click="submit(0)" type="primary" :loading="loadingSaveBut">{{'Save Draft'}}</el-button>
          <el-button size="mini" @click="submit(1)" type="primary" :loading="loadingSaveBut">{{'Submit'}}</el-button>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>



<script>
import { getUserProfile } from '@/api/system/user'
import { listDept } from '@/api/shipment/shipment'
import { update, detail } from '@/api/air/booking'
import { getBaseHeader } from '@/utils/request'
import { getShippingOrderListByIds } from '@/api/shipping/order'
import { getOrderHeadersList } from '@/api/pepco/shipping-order.js'
import BookingGoodsInfo from '@/views/air-booking/booking/components/booking-goods-info.vue'
import { fileLoadMixin } from '@/utils/fileLoadMixin'
import { DICT_TYPE, getDictDatas } from '@/utils/dict'
import { getOriginDeliveryList } from '@/api/system/originDelivery'

export default {
  name: 'Shipment',
  computed: {
    DICT_TYPE() {
      return DICT_TYPE
    }
  },
  mixins: [fileLoadMixin],
  components: { BookingGoodsInfo },
  data() {
    return {
      loadingSaveBut: false,
      soIds: [],
      form: {
        reserved: false,
        type: 'Merchant',
        airRouters: [{ transportMode: 'AIR', carrier: '', flight: '', etd: null, eta: null, pol: '',pod: '' ,etaTime:null,etdTime:null}],
        productData: [],
        contactEmail: '',
        contactPhone: '',
        email: '',
        remark: '',
        pol: '',
        pod: '',
        airline: 'CAL',
        freightType: '',
        bookingAgent:''
      },

      phoneError: '',
      emailError: '',


      bookingId: null,
      parties: {
        Shipper: [],
        Consignee: [],
        'Notify Party': [],
        'Agreement Party': []
      },
      partiesMap: {},
      open: false,

      hsCodeList: [],
      craNumList: [],
      shippingScheduleLoading: false,
      url: '',
      uploadHeaders: {},
      itemTableData: [],
      productMapForBook: {},
      orderMap: {},
      orderItemMap: {},
      applyHsCodeVisable: false,
      hsCode: {},
      uploadCount: 0,
      successCount: 0,
      submitLoading: false,
      showTips: true,
      transportMode: [
        // { label: 'Ocean', value: 'SEA' },
        { label: 'Air', value: 'AIR' },
        // { label: 'Railway', value: 'RAI' }
      ],

      spoList: [],
      spoIds: [],
      isPepco: false,
      spoItems: [],
      // 接收shipment-cargo-info组件的数据
      receiveSOProductList: [],
      portOptions: [],
      disabledDate: date => item.eta ? date > new Date(item.eta) : false,

    }
  },
  mounted() {},
  created() {
    var data = getBaseHeader()
    this.uploadHeaders = data
    this.url = process.env.VUE_APP_BASE_API
    this.getPortList()
    this.initData()
    this.getParty()
    localStorage.removeItem('refreshPoPage')
  },
  methods: {
    getDictDatas,
    getShipper() {
        var party = { address: '-', email: '-', phone: '-', fax: '-', companyUsci: '-' }
      if (this.form.shipperPartyId && this.parties['Shipper'] && this.parties['Shipper'].length > 0) {
        var obj = this.parties['Shipper'].find(item => item.id == this.form.shipperPartyId)
        if (obj == undefined || obj == null) {
          obj = party
        }
        return obj
      }
      return party
    },
    getNotifyParty() {
      var party = { address: '-', email: '-', phone: '-', fax: '-', companyUsci: '-' }
      if (this.form.notifyPartyId && this.parties['Notify Party'] && this.parties['Notify Party'].length > 0) {
        var obj = this.parties['Notify Party'].find(item => item.id == this.form.notifyPartyId)
        if (obj == undefined || obj == null) {
          obj = party
        }
        return obj
      }
      return party
    },
    getConsignee() {
       var party = { address: '-', email: '-', phone: '-', fax: '-', companyUsci: '-' }
      if (this.form.consigneePartyId && this.parties['Consignee'] && this.parties['Consignee'].length > 0) {
        var obj = this.parties['Consignee'].find(item => item.id == this.form.consigneePartyId)
        if (obj == undefined || obj == null) {
          obj = party
        }
        return obj
      }
      return party
    },
    getAgreementParty() {
      var party = { address: '-' }
      if (this.form.agreementParty && this.parties['Agreement Party'] && this.parties['Agreement Party'].length > 0) {
        var obj = this.parties['Agreement Party'].find(item => item.id == this.form.agreementParty)
        if (obj == undefined || obj == null) {
          obj = party
        }
        return obj
      }
      return party
    },

    applyNewHsCode() {
      this.applyHsCodeVisable = true
    },

    changeDG(item) {
      console.log(typeof item.dg)
       console.log(item.dg)
      console.log('changeDG',item)
      this.$set(item, 'tempaax', 1)
      this.$delete(item, 'tempaax')
        if (item.dg === 1) {
          if (!item.hazardousMaterials) {
            this.$set(item, 'hazardousMaterials', {})
          }
        }

        if (item.dg === 0) {
          this.$set(item, 'hazardousMaterials', {})
        }
    },
    validatePhoneNumber() {
      const phoneNumber = this.form.contactPhone
      // 自定义验证逻辑
      if (!/^\d+$/.test(phoneNumber) || phoneNumber.length < 8 || phoneNumber.length > 15) {
        this.phoneError = ''
      } else {
        this.phoneError = ''
      }
    },
    validateEmailAddress() {
      const emailAddress = this.form.contactEmail
      // 自定义验证逻辑
      // 例如，验证是否是有效的电子邮件地址
      if (!isValidEmailAddress(emailAddress)) {
        this.emailError = ''
      } else {
        this.emailError = ''
      }
    },
    getParty() {
      this.getParties({ partyRole: 'Shipper' })
      this.getParties({ partyRole: 'Consignee' })
      this.getParties({ partyRole: 'Notify Party' })
      this.getParties({ partyRole: 'Agreement Party' })
      this.getParties({ partyRole: 'Customer' })
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

    getVesselList() {},

    addProduct() {
      this.form.productData.push({
        batteries: 0,
        fileList: [],
        uploadData: {},
        hazardousMaterials: {}
      })
    },
    changeBatteries(item) {
      if (item.batteries == 1) {
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
      this.form.airRouters[0].pol = value
      this.form = JSON.parse(JSON.stringify(this.form))
    },
    changePod(value) {
      // this.$set(this.form, "destinationPort", "");
      this.form.airRouters[this.form.airRouters.length - 1].pol = value
      this.form = JSON.parse(JSON.stringify(this.form))
    },
    submit(status) {
      console.log('this.form', this.form)
      if (this.form.airline == '' || this.form.airline == null) {
        this.$notify({
          message: 'Airline is required',
          type: 'warning'
        })
        return
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.submitLoading = true
          this.loadingSaveBut = true
          var data = JSON.parse(JSON.stringify(this.form))
          console.log('data before submit', data)
          var grossWeight = 0
          // 拼接时间
          data.airRouters = data.airRouters.map(item => {
            if (item.etd && item.etdTime) {
              // 拼成 "2026-03-16 20:00" 格式（注意：Date 构造函数在部分浏览器对 "2026-03-16T20:00:00" 更可靠）
              const isoStr = `${item.etd}T${item.etdTime}:00`
              // 转为时间戳（毫秒）
              item.etd = new Date(isoStr).getTime()
            }
            if (item.eta && item.etaTime) {
              const isoStr = `${item.eta}T${item.etaTime}:00`
              item.eta = new Date(isoStr).getTime()
            }
            return item
          })
          for (var i = 0; i < data.productData.length; i++) {
            console.log('data.productData[i]', data.productData[i])
            data.productData[i].dangerousGoods = JSON.stringify(data.productData[i].hazardousMaterials)

            grossWeight += Number(data.productData[i].grossWeight)

            if (data.productData[i].dg === 1 || data.productData[i].batteries === 1) {
              // if (data.productData[i].fileList.length < 1) {
              //   this.$notify.error('Please upload relevant documents of battery-related goods or dangerous goods, such as MSDS!')
              //   this.submitLoading = false
              //   this.loadingSaveBut = false
              //   return
              // }
            }
          }
          console.log('this.spoIds', this.spoIds)
          if (this.spoIds !== '' && this.spoIds !== null && typeof this.spoIds !== 'undefined') { 
            data.spoIds = this.spoIds.length >0 ? this.spoIds.split(',') : [];
          }
          data.freightType = this.spoList[0] ? this.spoList[0].shipmentType : ''
          data.blType = this.spoList[0] ? this.spoList[0].blType : ''
          this.uploadCount = 0
          this.successCount = 0

          // data.productData = JSON.stringify(data.productData)
          console.log('this.$route.query.ids', this.$route.query.spoIds)
          data.status = status
          console.log('submitData', data)
          update(data).then(response => {
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
            this.$router.push('/shipment/air-booking-detail?bookingId=' + response.data.id)

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
        this.$router.push('/shipment/detail?id=' + this.bookingId)
      }
    },
    handleDelete(index) {
      this.form.productData.splice(index, 1)
    },

    async initData() {
      // 获取detail
      detail({ airBookingId: this.$route.query.bookingId }).then(response => {
        console.log('初始化数据', response.data)
        // 判断是否有shippingOrder 没有就 试用booking的信息
        const res = response.data
        this.form = Object.assign({}, this.form, res.airBookingDTO)
        this.$set(this.form, 'productData', res.productData)
      // 遍历 productData 初始化属性
          this.form.productData.forEach(item => {
            // 确保 id 存在，用于 v-for key 和 switch key
            if (!item.id) item.id = Math.random().toString(36).substr(2, 9);
            // DG 默认关闭
            item.dg = Number(item.dg || 0);
            // Batteries 默认值
            if (!item.batteries) item.batteries = 2;
            // 解析 dangerousGoods 字符串并初始化 hazardousMaterials 对象
            if (item.dangerousGoods) {
              try {
                const dgData = JSON.parse(item.dangerousGoods);
                this.$set(item, 'hazardousMaterials', dgData);
              } catch (e) {
                console.error('解析 dangerousGoods 失败:', e);
                this.$set(item, 'hazardousMaterials', {});
              }
            } else {
              this.$set(item, 'hazardousMaterials', {});
            }
            // 确保每个 dict.value 在 hazardousMaterials 中有响应式属性
            this.getDictDatas(DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS).forEach(dict => {
              if (!(dict.value in item.hazardousMaterials)) {
                this.$set(item.hazardousMaterials, dict.value, '');
              }
            });
          });
        
        // 转换时间格式
        this.form.airRouters = res.airRouters.map(item => {
          const result = { ...item }

          // 处理 etd（时间戳 → 日期 + 时间）
          if (item.etd != null) {
            const date = new Date(item.etd) // item.etd 是 number（时间戳）
            result.etd = date.toISOString().split('T')[0] // "2025-12-01"
            result.etdTime = date.toTimeString().substring(0, 5) // "12:30"
          }

          // 处理 eta（时间戳 → 日期 + 时间）
          if (item.eta != null) {
            const date = new Date(item.eta)
            result.eta = date.toISOString().split('T')[0]
            result.etaTime = date.toTimeString().substring(0, 5)
          }

          return result
        })

        // if (res.airRouters && res.airRouters.length > 0) {
        //   this.$set(this.form, 'airRouters', res.airRouters)
        // }
        if (res.shippingResList && res.shippingResList.length > 0) {
          this.spoList = res.shippingResList
          this.spoIds = res.shippingResList.map(item => item.id).join(',')
          console.log('this.spoList', this.spoList)
              console.log('this.spoIds', this.spoIds)
          this.handleCargoInfo(this.spoList,  this.spoIds)
          this.waitForSoProductList()
        }
      })
    },

    selectClear() {},
    selectRouterAirline(value, index) {
      console.log('selectRouterAirline', value,index)
      this.form.airRouters[index].carrier = value
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
            product.packageMethod = unit.value
          }
        }
      }
      var productName = this.spoItems[0].productName
      product.productNameEn = productName

      var hscode = this.spoItems[0].hscode
      product.hscode = hscode
      this.form.productData = JSON.parse(JSON.stringify(this.form.productData))
    },
    //传递 货物信息
    handleCargoInfo(spoList, spoIds) {
      this.$nextTick(() => {
        this.$refs.bookingGoodsInfo.active(spoList, spoIds)
      })
    },
    getFromSOProductData() {
      console.log('SO数据', this.receiveSOProductList)
      this.form.productFromOrder = 1
      if (this.receiveSOProductList && this.receiveSOProductList.length > 0) {
        var weight = this.shippingProductTotalAllGrossWeight().toFixed(3)
        var volume = this.shippingProductTotalAllVolume().toFixed(3)
        var product = this.form.productData[0]
        var booked = this.shippingProductTotalAllBooked()
        product.packageNumber = booked
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
              product.packageMethod = unit.value
            }
          }
        }
        // 填充hs code
        var hscode = this.receiveSOProductList[0].hscode
        product.hsCode = hscode

        const productNames = this.receiveSOProductList.map(item => item.productEnglishName).join('\n')
        product.productNameEn = productNames
        console.log('productNames', productNames)
        if (this.receiveSOProductList[0].batteries == 3) {
          product.batteries = 2
        }
      }
      this.form.productData = JSON.parse(JSON.stringify(this.form.productData))
      console.log('productData', this.form.productData)
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

    waitForSoProductList() {
      console.log('waitForSoProductList')
      return new Promise(resolve => {
        this._resolveSoProductList = resolve
      })
    },

    getIcon(transportMode) {
      switch (transportMode) {
        case 'SEA':
          return require('@/assets/logo/sea.svg')
        case 'AIR':
          return require('@/assets/logo/air.svg')
        case 'RAI':
          return require('@/assets/logo/rail.svg')
        default:
          return ''
      }
    },
  addLegs(index) {
    console.log('addLegs', index) 
    const routers = this.form.airRouters
    const current = routers[index]
    if (!current) return
    const newLeg = {
      transportMode: 'AIR',
      carrier: '',
      flight: '',
      pol: '',
      pod: current.pod || '',
      etd: null,
      eta:  current.eta,
      etdTime:  null,
      etaTime: current.etaTime
    }
    console.log('newLeg', newLeg)
    routers.splice(index + 1, 0, newLeg)
    current.pod = ''
    current.eta = ''
    current.etaTime = ''
      

    },
    removeLeg(index) {
    const routers = this.form.airRouters
    if (!routers.length) return
    routers.splice(index, 1)
    this.fixRoute()
    },
    onPolChange(index) {
    const routers = this.form.airRouters
    const current = routers[index]
    if (!current) return
    if (current.pol && current.pod && current.pol === current.pod) {
      this.$message.error('POL cannot equal POD')
      current.pol = ''
      return
    }
    if (index > 0) {
      routers[index - 1].pod = current.pol
    }
    },
    onPodChange(index) {
    const routers = this.form.airRouters
    const current = routers[index]
    if (!current) return
    if (current.pol && current.pod && current.pol === current.pod) {
      this.$message.error('POL cannot equal POD')
      current.pod = ''
      return
    }
    if (routers[index + 1]) {
      routers[index + 1].pol = current.pod
    }
    },
    fixRoute() {
    const routers = this.form.airRouters
    for (let i = 1; i < routers.length; i++) {
      routers[i].pol = routers[i - 1].pod || ''
    }
    },
    onEtaChange(index) {
    const routers = this.form.airRouters
    if (routers[index + 1]) {
      routers[index + 1].etd = routers[index].eta
    }
    },
    onEtaTimeChange(index) {
    const routers = this.form.airRouters
    if (routers[index + 1]) {
      routers[index + 1].etdTime = routers[index].etaTime
    }
    },
    validateAirRoute() {
    const routers = this.form.airRouters
    const podSet = new Set()
    for (let i = 0; i < routers.length; i++) {
      const { pol, pod } = routers[i]
      if (pol && pod && pol === pod) {
        this.$message.error(`Route ${i + 1}: POL cannot equal POD`)
        return false
      }
      if (pod && podSet.has(pod)) {
        this.$message.error(`Airport ${pod} duplicated in route`)
        return false
      }
      if (pod) podSet.add(pod)
    }
    return true
    },
    selectAir(value) {},
    selectPol(value) {
      console.log('selectPol1', value)
      console.log('this.form.pol1', this.form.pol)
      this.form.airRouters[0].pol = value
    },

    selectPod(value) {
      this.form.airRouters[0].pod = value
    },
    getPortList(){
      getOriginDeliveryList().then((response) => {
        this.portOptions = response.data;
      });

    },
    validateHsCode(event, item) {
      const value = event.target.value.trim()
      item.hscode = value
      if (value.length < 10) {
        this.$message({
          message: 'HS Code must be 10 characters',
          type: 'warning'
        })
      }
    },
  }
}
// 自定义函数用于验证电子邮件地址
function isValidEmailAddress(email) {
  // 自定义验证逻辑
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}
</script>


<style scoped >
.company-option-with-tooltip {
  display: block;
  overflow: hidden;
  white-space: nowrap;
}
.company-full-width-tooltip-shipment-create {
  white-space: nowrap !important;
  max-width: none !important;
  width: auto !important;
}
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

.general-info {
  display: flex; /* 使用 flex 而不是 inline-flex */
  align-items: center; /* 垂直居中 */
  font-weight: bold;
  font-size: 18px;
  color: #0296ff;
  white-space: nowrap; /* 防止文字换行 */
}

.general-info::after {
  content: '';
  display: block; /* 确保它是块级元素 */
  height: 1px;
  background-color: #0296ff;
  margin-left: 10px; /* 文字和线之间的间距 */
  flex-grow: 1; /* 让它占据剩余的空间 */
}
.transport-legs-container {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 垂直居中（可选） */
  width: 100%; /* 确保容器占满宽度 */
  padding-top: 20px;
}
.transport-legs {
  padding-left: 20px;

  font-weight: bold;
  font-size: 16px;
  color: #0296ff;
  white-space: nowrap; /* 防止文字换行 */
}
</style>
