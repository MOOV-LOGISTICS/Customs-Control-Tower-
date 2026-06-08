<!--<template>-->
<!--  <el-dialog-->
<!--    title="Shipping Instructions"-->
<!--    v-loading="loading"-->
<!--    :visible="visible"-->
<!--    :fullscreen="true"-->
<!--    append-to-body-->
<!--    class="bg-g"-->
<!--    @close="onClose">-->
<!--    <el-tag class="tab-title">Booking Number : {{ shipment.shipmentBookingNumber }}</el-tag>-->
<!--    <el-dialog title="Container" :visible.sync="visibleSIContainer" width="700px" append-to-body>-->
<!--      <el-descriptions style="margin-bottom: 15px" :colon="false" direction="vertical" class="margin-top" title=""-->
<!--                       :column="3">-->
<!--        <el-descriptions-item label="Container Type">-->
<!--          <el-select @change="changeContainerType(containerForm)" clearable v-model="containerForm.containerType">-->
<!--            <el-option v-for="dict in containerTypeList" :key="dict.type" :label="dict.type" :value="dict.type"/>-->
<!--          </el-select>-->
<!--        </el-descriptions-item>-->
<!--        <el-descriptions-item label="Container No">-->
<!--          <el-input v-model="containerForm.containerNo"/>-->
<!--        </el-descriptions-item>-->

<!--        <el-descriptions-item label="Container Seal Number">-->
<!--          <el-input v-model="containerForm.containerSealNumber"/>-->
<!--        </el-descriptions-item>-->
<!--      </el-descriptions>-->
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button type="primary" @click="submitContainer">{{-->
<!--            $t("purchaseOrder.confirm")-->
<!--          }}-->
<!--        </el-button>-->
<!--        <el-button @click="cancelContainer">{{-->
<!--            $t("purchaseOrder.cancel")-->
<!--          }}-->
<!--        </el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->
<!--    <el-form ref="siForm" :model="siForm" label-width="210px" label-position="right" :show-message="false">-->
<!--      <el-card style="margin-top: 15px; padding: 10px 10px 5px;">-->
<!--        <el-row :gutter="20">-->
<!--          <el-col :span="8">-->
<!--            <div style="text-indent: 10px;margin-bottom:8px">-->
<!--              <b style="font-size: 15px">BL Type</b>-->
<!--            </div>-->
<!--            <el-card style="height: 150px;padding: 20px">-->
<!--              <el-form-item required prop="blType" style="border: none;width:100%" label-width="0">-->
<!--                <el-radio-group v-model="siForm.blType" @change="changeBl">-->
<!--                  <el-row :gutter="20">-->
<!--                    <el-col :span="14" style="padding-left: 20px">-->
<!--                      <el-radio-->
<!--                        style="padding-bottom: 15px; width: 100%;"-->
<!--                        v-for="dict in getDictDatas(DICT_TYPE.BL_TYPE).filter((item, index) => index < 2)"-->
<!--                        :key="dict.value"-->
<!--                        :label="dict.label">-->
<!--                      </el-radio>-->
<!--                      &lt;!&ndash; <el-radio  style="padding-bottom: 15px;" label="Original" >ORIGINAL</el-radio>-->
<!--                  <el-radio  style="padding-bottom: 15px;" label="Telex Release" >SEAWAY B/L  </el-radio> &ndash;&gt;-->
<!--                    </el-col>-->
<!--                    <el-col :span="6">-->
<!--                      <el-radio-->
<!--                        style="padding-bottom: 15px; width: 100%;"-->
<!--                        v-for="dict in getDictDatas(DICT_TYPE.BL_TYPE).filter((item, index) => index >= 2)"-->
<!--                        :key="dict.value"-->
<!--                        :label="dict.label">-->
<!--                      </el-radio>-->
<!--                      &lt;!&ndash; <el-radio  style="padding-bottom: 15px;" label="SeaWayB/L" >TELEX RELEASE  </el-radio> &ndash;&gt;-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                </el-radio-group>-->
<!--              </el-form-item>-->
<!--            </el-card>-->
<!--          </el-col>-->
<!--          <el-col :span="8">-->
<!--            <div style="text-indent: 10px;margin-bottom:8px">-->
<!--              <b style="font-size: 15px">B/L Samples</b>-->
<!--            </div>-->
<!--            <el-card style="height: 150px; padding: 20px">-->
<!--              <el-form-item required prop="blSamples" style="border: none; width:100%" label-width="0">-->
<!--                <el-radio-group v-model="siForm.blSamples" @change="changeBl">-->
<!--                  <el-row :gutter="20">-->
<!--                    <el-col :span="14" style="padding-left: 20px">-->
<!--                      <el-radio style="padding-bottom: 15px; width: 100%;" label="CARGO Details">CARGO Details-->
<!--                      </el-radio>-->
<!--                      <el-radio style="padding-bottom: 15px; width: 100%;" label="CARGO Summary II">CARGO Summary-->
<!--                        II-->
<!--                      </el-radio>-->
<!--                    </el-col>-->
<!--                    <el-col :span="6">-->
<!--                      <el-radio style="padding-bottom: 15px; width: 100%;" label="CARGO Summary I">CARGO Summary I-->
<!--                      </el-radio>-->
<!--                      <el-radio style="padding-bottom: 15px; width: 100%;" label="CARGO Summary">CARGO Summary-->
<!--                      </el-radio>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                </el-radio-group>-->
<!--              </el-form-item>-->
<!--              <el-button-->
<!--                @click="viewBlSample(siForm.blSamples)"-->
<!--                type="primary"-->
<!--                style="margin-left: 15px; padding: 5px; margin-bottom: 10px;">-->
<!--                View Samples-->
<!--              </el-button>-->
<!--            </el-card>-->
<!--          </el-col>-->
<!--          <el-col :span="8">-->
<!--            <div style="text-indent: 10px;margin-bottom:8px">-->
<!--              <b style="font-size: 15px">SI Remark To Carrier</b>-->
<!--            </div>-->
<!--            <el-card-->
<!--              style="padding:15px!important; height: 150px"-->
<!--              :colon="false"-->
<!--              class="margin-top parties-desc"-->
<!--              title=""-->
<!--              :column="1"-->
<!--              size="mini">-->
<!--              <el-form-item required prop="siRemark" style="width:100%" label-width="0">-->
<!--                <el-input-->
<!--                  type="textarea"-->
<!--                  v-model="siForm.siRemark"-->
<!--                  placeholder=""-->
<!--                  maxlength="500"-->
<!--                  show-word-limit-->
<!--                  :rows="6"-->
<!--                  @input="siForm.siRemark = filterChinese(siForm.siRemark)"/>-->
<!--              </el-form-item>-->
<!--            </el-card>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--      </el-card>-->
<!--      <el-card style="padding:15px; margin-top: 15px;">-->
<!--        <el-row :gutter="20">-->
<!--          <el-col :span="8">-->
<!--            <div style="text-indent: 10px;margin-bottom:8px">-->
<!--              <b style="font-size: 15px">Shipper</b>-->
<!--            </div>-->
<!--            <el-descriptions-->
<!--              style="padding: 10px !important; border-radius: 10px;"-->
<!--              :colon="false"-->
<!--              class="margin-top parties-desc"-->
<!--              title=""-->
<!--              :column="1"-->
<!--              size="mini">-->
<!--              <el-descriptions-item>-->
<!--                <template slot="label">-->
<!--                  <span style="width: 64px;">Name</span>-->
<!--                </template>-->
<!--                <el-select-->
<!--                  filterable-->
<!--                  clearable-->
<!--                  v-model="siForm.shipper">-->
<!--                  <el-option-->
<!--                    v-for="item in parties['Shipper']"-->
<!--                    :key="item.id"-->
<!--                    :value="item.id"-->
<!--                    :label="item.name">-->
<!--                  </el-option>-->
<!--                </el-select>-->
<!--              </el-descriptions-item>-->

<!--              <el-descriptions-item>-->
<!--                <template slot="label">-->
<!--                  <span style="width: 64px;">Address</span>-->
<!--                </template>-->
<!--                <div style="padding: 6.5px 0;">-->
<!--                  {{ partiesMap[siForm.shipper] ? partiesMap[siForm.shipper].address : "" }}-->
<!--                </div>-->
<!--              </el-descriptions-item>-->
<!--              <el-descriptions-item>-->
<!--                <template slot="label">-->
<!--                  <span style="width: 64px;">Phone</span>-->
<!--                </template>-->
<!--                <div style="padding: 6.5px 0">-->
<!--                  {{ partiesMap[siForm.shipper] ? partiesMap[siForm.shipper].phone : "" }}-->
<!--                </div>-->
<!--              </el-descriptions-item>-->
<!--              <el-descriptions-item>-->
<!--                <template slot="label">-->
<!--                  <span style="width: 64px;">Fax</span>-->
<!--                </template>-->
<!--                <div style="padding: 6.5px 0">-->
<!--                  {{ partiesMap[siForm.shipper] ? partiesMap[siForm.shipper].fax : "" }}-->
<!--                </div>-->
<!--              </el-descriptions-item>-->
<!--              <el-descriptions-item>-->
<!--                <template slot="label">-->
<!--                  <span style="width: 64px;">Email</span>-->
<!--                </template>-->
<!--                <div style="padding: 6.5px 0">-->
<!--                  {{ partiesMap[siForm.shipper] ? partiesMap[siForm.shipper].email : "" }}-->
<!--                </div>-->
<!--              </el-descriptions-item>-->
<!--              <el-descriptions-item>-->
<!--                <template slot="label">-->
<!--                  <span style="width: 64px;">Enterprise</span>-->
<!--                </template>-->
<!--                <div style="padding: 6.5px 0">-->
<!--                  {{ partiesMap[siForm.shipper] ? partiesMap[siForm.shipper].companyUsci : "" }}-->
<!--                </div>-->
<!--              </el-descriptions-item>-->
<!--            </el-descriptions>-->
<!--          </el-col>-->
<!--          <el-col :span="8">-->
<!--            <div style="text-indent: 10px; margin-bottom:8px">-->
<!--              <b style="font-size: 15px">Consignee</b>-->
<!--            </div>-->
<!--            <el-descriptions-->
<!--              style="padding: 10px !important; border-radius: 10px;"-->
<!--              :colon="false"-->
<!--              class="margin-top parties-desc"-->
<!--              title=""-->
<!--              :column="1"-->
<!--              size="mini">-->
<!--              <el-descriptions-item>-->
<!--                <template slot="label">-->
<!--                  <span style="width: 64px;">Name</span>-->
<!--                </template>-->
<!--                <el-select-->
<!--                  remote-->
<!--                  clearable-->
<!--                  filterable-->
<!--                  v-model="siForm.consignee">-->
<!--                  <el-option-->
<!--                    v-for="item in parties['Consignee']"-->
<!--                    :key="item.id"-->
<!--                    :value="item.id"-->
<!--                    :label="item.name">-->
<!--                  </el-option>-->
<!--                </el-select>-->
<!--              </el-descriptions-item>-->

<!--              <el-descriptions-item>-->
<!--                <template slot="label">-->
<!--                  <span style="width: 64px;">Address</span>-->
<!--                </template>-->
<!--                <div style="padding: 6.5px 0">-->
<!--                  {{ partiesMap[siForm.consignee] ? partiesMap[siForm.consignee].address : "" }}-->
<!--                </div>-->
<!--              </el-descriptions-item>-->
<!--              <el-descriptions-item>-->
<!--                <template slot="label">-->
<!--                  <span style="width: 64px; ">Phone</span>-->
<!--                </template>-->
<!--                <div style="padding: 6.5px 0">-->
<!--                  {{ partiesMap[siForm.consignee] ? partiesMap[siForm.consignee].phone : "" }}-->
<!--                </div>-->
<!--              </el-descriptions-item>-->
<!--              <el-descriptions-item>-->
<!--                <template slot="label">-->
<!--                  <span style="width: 64px;">Fax</span>-->
<!--                </template>-->
<!--                <div style="padding: 6.5px 0">-->
<!--                  {{ partiesMap[siForm.consignee] ? partiesMap[siForm.consignee].fax : "" }}-->
<!--                </div>-->
<!--              </el-descriptions-item>-->

<!--              <el-descriptions-item>-->
<!--                <template slot="label">-->
<!--                  <span style="width: 64px;">Email</span>-->
<!--                </template>-->
<!--                <div style="padding: 6.5px 0">-->
<!--                  {{ partiesMap[siForm.consignee] ? partiesMap[siForm.consignee].email : "" }}-->
<!--                </div>-->
<!--              </el-descriptions-item>-->

<!--              <el-descriptions-item>-->
<!--                <template slot="label">-->
<!--                  <span style="width: 64px;">Enterprise</span>-->
<!--                </template>-->
<!--                <div style="padding: 6.5px 0">-->
<!--                  {{ partiesMap[siForm.consignee] ? partiesMap[siForm.consignee].companyUsci : "" }}-->
<!--                </div>-->
<!--              </el-descriptions-item>-->
<!--            </el-descriptions>-->
<!--          </el-col>-->
<!--          <el-col :span="8">-->
<!--            <div style="text-indent: 10px;margin-bottom:8px">-->
<!--              <b style="font-size: 15px">Notify Party</b>-->
<!--            </div>-->
<!--            <el-descriptions-->
<!--              style="padding: 10px !important; border-radius: 10px;"-->
<!--              :colon="false"-->
<!--              class="margin-top parties-desc"-->
<!--              title=""-->
<!--              :column="1"-->
<!--              size="mini">-->
<!--              <el-descriptions-item>-->
<!--                <template slot="label">-->
<!--                  <span style="width: 64px;">Name</span>-->
<!--                </template>-->
<!--                <el-select-->
<!--                  remote-->
<!--                  clearable-->
<!--                  filterable-->
<!--                  v-model="siForm.notifyParty">-->
<!--                  <el-option-->
<!--                    v-for="item in parties['Notify Party']"-->
<!--                    :key="item.id"-->
<!--                    :value="item.id"-->
<!--                    :label="item.name">-->
<!--                  </el-option>-->
<!--                </el-select>-->
<!--              </el-descriptions-item>-->

<!--              <el-descriptions-item>-->
<!--                <template slot="label">-->
<!--                  <span style="width: 64px;">Address</span>-->
<!--                </template>-->
<!--                <div style="padding: 6.5px 0">-->
<!--                  {{ partiesMap[siForm.notifyParty] ? partiesMap[siForm.notifyParty].address : "" }}-->
<!--                </div>-->
<!--              </el-descriptions-item>-->
<!--              <el-descriptions-item>-->
<!--                <template slot="label">-->
<!--                  <span style="width: 64px;">Phone</span>-->
<!--                </template>-->
<!--                <div style="padding: 6.5px 0">-->
<!--                  {{ partiesMap[siForm.notifyParty] ? partiesMap[siForm.notifyParty].phone : "" }}-->
<!--                </div>-->
<!--              </el-descriptions-item>-->
<!--              <el-descriptions-item>-->
<!--                <template slot="label">-->
<!--                  <span style="width: 64px;">Fax</span>-->
<!--                </template>-->
<!--                <div style="padding: 6.5px 0">-->
<!--                  {{ partiesMap[siForm.notifyParty] ? partiesMap[siForm.notifyParty].fax : "" }}-->
<!--                </div>-->
<!--              </el-descriptions-item>-->

<!--              <el-descriptions-item>-->
<!--                <template slot="label">-->
<!--                  <span style="width: 64px;">Email</span>-->
<!--                </template>-->
<!--                <div style="padding: 6.5px 0">-->
<!--                  {{ partiesMap[siForm.notifyParty] ? partiesMap[siForm.notifyParty].email : "" }}-->
<!--                </div>-->
<!--              </el-descriptions-item>-->

<!--              <el-descriptions-item>-->
<!--                <template slot="label">-->
<!--                  <span style="width: 64px;">Enterprise</span>-->
<!--                </template>-->
<!--                <div style="padding: 6.5px 0">-->
<!--                  {{ partiesMap[siForm.notifyParty] ? partiesMap[siForm.notifyParty].companyUsci : "" }}-->
<!--                </div>-->
<!--              </el-descriptions-item>-->
<!--            </el-descriptions>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--      </el-card>-->
<!--      <el-card style="padding:15px; margin-top: 15px;">-->
<!--        <div v-if="SOProductList.length > 0" style="margin-bottom: 10px;">-->
<!--          <div style="text-indent: 0; margin-bottom:8px">-->
<!--            <b style="font-size: 15px">Cargo Info</b>-->
<!--          </div>-->
<!--          <el-table-->
<!--            class="SOProduct"-->
<!--            :data="SOProductList"-->
<!--            style="width: 100%;"-->
<!--            border-->
<!--            show-summary-->
<!--            :summary-method="getSummaries">-->
<!--            <el-table-column prop="soRef" label="SO Ref" width="130px">-->
<!--              <template v-slot="{ row, $index }">-->
<!--                <el-link-->
<!--                  v-show="!shipment.fromShipperBooking"-->
<!--                  type="primary"-->
<!--                  target="_blank"-->
<!--                  :href="'/shipment/shippingBookingDetail?id=' + row.id">{{ row.soRef }}-->
<!--                </el-link>-->
<!--                <el-link-->
<!--                  v-show="shipment.fromShipperBooking"-->
<!--                  type="primary" target="_blank"-->
<!--                  :href="'/shipment/ppshippingOrderDetail?id=' + row.soId">-->
<!--                  {{ row.soRef }}-->
<!--                </el-link>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="productEnglishName" label="Product English Name">-->
<!--            </el-table-column>-->
<!--            &lt;!&ndash; <el-table-column prop="productChineseName" label="product Chinese Name">-->
<!--            </el-table-column> &ndash;&gt;-->
<!--            <el-table-column prop="hscode" label="Hs code" width="90px">-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="numberOfPackages" label="Number Of Packages" width="130px">-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="packages" label="Packages" width="90px">-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="grossWeight" label="GrossWeight(KG)" width="110px">-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="volume" label="volume(CBM)" width="110px">-->
<!--            </el-table-column>-->

<!--            <el-table-column-->
<!--              v-if="spoList.length > 0 && SOType === 'LCL'"-->
<!--              prop="numberOfPackagesAll"-->
<!--              label="Number Of Packages Can Allocate">-->
<!--              <template v-slot="{ row, $index }">-->
<!--                <div :class="getInputStrClassNumberOfPackages(row)"> {{ row.numberOfPackagesAll }}</div>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              v-if="spoList.length > 0 && SOType === 'LCL'"-->
<!--              prop="grossWeightAll"-->
<!--              label="Gross Weight Can Allocate(KG)">-->
<!--              <template v-slot="{ row, $index }">-->
<!--                <div :class="getInputStrClassGrossWeight(row)"> {{ row.grossWeightAll }}</div>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              v-if="spoList.length > 0 && SOType ==='LCL'"-->
<!--              prop="volumeAll"-->
<!--              label="Volume Can Allocate(CBM)">-->
<!--              <template v-slot="{ row, $index }">-->
<!--                <div :class="getInputStrClassVolume(row)"> {{ row.volumeAll }}</div>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--        </div>-->

<!--        <div v-show="spoItems && spoItems.length > 0">-->
<!--          <div style="text-indent: 0; margin-bottom: 8px">-->
<!--            <b style="font-size: 15px">Cargo Info</b>-->
<!--          </div>-->
<!--          <el-table style="margin-bottom: 10px" border v-if="spoItems && spoItems.length > 0" :data="spoItems">-->
<!--            <el-table-column prop="soRef" label="SO Number">-->
<!--              <template v-slot="scope">-->
<!--                <el-link type="primary" target="_blank" :href="'/shipment/ppshippingOrderDetail?id='+scope.row.id">-->
<!--                  <span>{{ scope.row.soRef }}</span>-->
<!--                </el-link>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            &lt;!&ndash; <el-table-column prop="orderId" label="Order Number">-->
<!--              <template v-slot="scope">-->
<!--                <span>{{ scope.row.orderNumber }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="productId" label="Item Number">-->
<!--              <template v-slot="scope">-->
<!--                <span>{{-->
<!--                  scope.row.productCode-->
<!--                  }}</span>-->
<!--              </template>-->
<!--            </el-table-column> &ndash;&gt;-->
<!--            <el-table-column prop="productId" label="Product Name">-->
<!--              <template v-slot="scope">-->
<!--                <span>{{ scope.row.productName }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="hsCode" label="HS Code" min-width="110">-->
<!--              <template v-slot="scope">-->
<!--                <span>{{ scope.row.hscode }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="markNumbers" label="Marks & Numbers">-->
<!--              <template v-slot="scope">-->
<!--                <span>{{ scope.row.markNumbers }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            &lt;!&ndash; <el-table-column prop="requested" :label="'Ordered (Cartons)'">-->
<!--              <template v-slot="scope">-->
<!--                {{ scope.row.outerQty }}-->
<!--              </template>-->
<!--            </el-table-column> &ndash;&gt;-->
<!--            <el-table-column prop="bookedQty" :label="'Booked (Cartons)'">-->
<!--              <template v-slot="scope">-->
<!--                {{ scope.row.booked }}-->
<!--              </template>-->
<!--            </el-table-column>-->

<!--            <el-table-column prop="totalWeight" :label="'Total Weight (KG)'">-->
<!--              <template v-slot="scope">-->
<!--                {{ scope.row.bookedWeight }}-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="totalVolume" :label="'Total Volume (CBM)'">-->
<!--              <template v-slot="scope">-->
<!--                {{ scope.row.bookedVolume }}-->
<!--              </template>-->
<!--            </el-table-column>-->

<!--          </el-table>-->
<!--          &lt;!&ndash;  加汇总和带入按钮 &ndash;&gt;-->

<!--          <div style="text-align: right;margin-top: 8px; ">-->
<!--            <span style="margin-right: 20px">Total Booked Cartons：{{ totalAllBooked() }}</span>-->
<!--            <span style="margin-right: 20px">Total Gross Weight：{{ totalAllGrossWeight().toFixed(3) }}</span>-->
<!--            <span style="margin-right: 20px">Total Volume：{{ totalAllVolume().toFixed(3) }}</span>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div style="display: flex; align-items: center; margin-bottom: 10px;">-->
<!--          <el-upload-->
<!--            ref="upload"-->
<!--            :show-file-list="false"-->
<!--            :on-change="beforeUploadContainers"-->
<!--            :auto-upload="false"-->
<!--            action="#"-->
<!--            accept=".xlsx,.xls"-->
<!--            size="mini">-->
<!--            <i class="el-icon-upload2 text-btn">-->
<!--              Upload Containers-->
<!--            </i>-->
<!--          </el-upload>-->
<!--          <i @click="downloadImportTemplate()" class="el-icon-download text-btn">-->
<!--            Import Template-->
<!--          </i>-->
<!--          <i class="el-icon-plus text-btn" @click="addContainers">-->
<!--            {{ $t("booking.addContainers") }}-->
<!--          </i>-->
<!--        </div>-->
<!--        <div v-hasPermi="['system:hs-code:apply']" style="margin-bottom:10px">-->
<!--          <el-button @click="applyNewHsCode" type="primary">Request new HS code</el-button>-->
<!--        </div>-->
<!--        <el-table :data="siForm.containers" style="width: 100%" default-expand-all>-->
<!--          <el-table-column type="expand">-->
<!--            <template slot-scope="scope">-->
<!--              <div style="margin-left: 50px">-->
<!--                <el-descriptions-->
<!--                  style="margin-bottom: 0; box-shadow: none !important; border: none !important"-->
<!--                  :colon="false"-->
<!--                  direction="vertical"-->
<!--                  v-for="(item, index) in scope.row.productData"-->
<!--                  :key="'product' + index"-->
<!--                  class="margin-top"-->
<!--                  title=""-->
<!--                  :column="7">-->
<!--                  <el-descriptions-item :label="index === 0 ? $t('booking.productEnglishName') : ''">-->
<!--                    <el-input-->
<!--                      type="textarea" :autosize="{ minRows: 1, maxRows: 2 }"-->
<!--                      v-model="item.productEnglishName"-->
<!--                      maxlength="500" show-word-limit-->
<!--                      @input="item.productEnglishName = filterChinese(item.productEnglishName)"/>-->
<!--                  </el-descriptions-item>-->
<!--                  <el-descriptions-item :label="index === 0 ? $t('booking.hsCode') : ''">-->
<!--                    <el-select filterable clearable remote v-model="item.hscode" :remote-method="remoteGetHsCode"-->
<!--                               @change="selectBlur(item)">-->
<!--                      <el-option v-for="dict in hsCodeList" :key="dict.hsCode" :label="dict.hsCode"-->
<!--                                 :value="dict.hsCode"/>-->
<!--                    </el-select>-->
<!--                  </el-descriptions-item>-->
<!--                  <el-descriptions-item v-if="shipment.fromShipperBooking && shipment.containerDOList.filter(-->
<!--                      (item) =>   item.type == 4-->
<!--                    ).length>0" :label="index === 0 ? 'HS Code(Supplier)' : ''">-->
<!--                    <el-input v-model="item.hscodeSupplier" disabled/>-->
<!--                  </el-descriptions-item>-->
<!--                  <el-descriptions-item :label="index === 0 ? 'Number Of Packages' : ''">-->
<!--                    <el-input-number-->
<!--                      @change="numberOfPackagesChange(item)"-->
<!--                      v-model="item.numberOfPackages" :controls="false" :precision="0"/>-->
<!--                  </el-descriptions-item>-->
<!--                  <el-descriptions-item :label="index === 0 ? 'Packages' : ''">-->
<!--                    <el-select filterable v-model="item.packages" placeholder="">-->
<!--                      <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value"-->
<!--                                 :label="dict.label" :value="dict.value"/>-->
<!--                    </el-select>-->
<!--                  </el-descriptions-item>-->
<!--                  <el-descriptions-item :label="index === 0 ? 'Gross Weight(KG)' : ''">-->
<!--                    <el-input-number-->
<!--                      @change="grossWeightChange(item)"-->
<!--                      v-model="item.grossWeight" :precision="3" :controls="false"/>-->
<!--                  </el-descriptions-item>-->
<!--                  <el-descriptions-item :label="index === 0 ? 'Volume(CBM)' : ''">-->
<!--                    <el-input-number-->
<!--                      @change="volumeChange(item)"-->
<!--                      v-model="item.volume" :precision="3" :controls="false"/>-->
<!--                  </el-descriptions-item>-->
<!--                  <el-descriptions-item>-->
<!--                    <template slot="label">-->
<!--                      <el-button v-if="index === 0" type="text" @click="addProduct2(scope.row.productData)">-->
<!--                        <i class="el-icon-plus"></i>Add Product-->
<!--                      </el-button>-->
<!--                    </template>-->
<!--                    <el-button size="mini" v-if="index !== 0" type="text" icon="el-icon-delete"-->
<!--                               @click="handleDelete(scope.row.productData, index)">{{ $t("search.delete") }}-->
<!--                    </el-button>-->
<!--                  </el-descriptions-item>-->
<!--                </el-descriptions>-->
<!--                <div style="width:100%;margin-top: 10px;margin-left: 10px; ">-->
<!--                  <el-row>-->
<!--                    <el-col :span="6">-->
<!--                      <b>Total Gross Weight:</b>-->
<!--                      {{ sumGrossWeight(scope.row) }}-->
<!--                    </el-col>-->
<!--                    <el-col :span="6">-->
<!--                      <b>Total CBM:</b>-->
<!--                      {{-->
<!--                        scope.row.productData.reduce((sum, item) => sum + (Number(item?.volume) || 0),-->
<!--                          0).toFixed(3)-->
<!--                      }}-->
<!--                    </el-col>-->
<!--                    <el-col :span="6">-->
<!--                      <b>Total Number of Packages:</b>-->
<!--                      {{-->
<!--                        scope.row.productData.reduce((sum, item) => sum + (Number(item?.numberOfPackages) || 0), 0)-->
<!--                      }}-->
<!--                    </el-col>-->
<!--                    <el-col :span="6">-->
<!--                      <el-button size="mini" v-if="scope.$index !== 0" type="text" icon="el-icon-delete" @click="handleDeleteContainer(scope.$index)">{{ $t("search.delete") }}</el-button>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                </div>-->
<!--              </div>-->
<!--            </template>-->
<!--          </el-table-column>-->

<!--          <el-table-column prop="date" label="SOC" width="180">-->
<!--            <template v-slot="scope">-->
<!--              <el-checkbox v-model="scope.row.soc"></el-checkbox>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column label="Container Type" prop="containerType" width="180">-->
<!--            <template v-slot="scope">-->
<!--              <el-select-->
<!--                filterable-->
<!--                v-model="scope.row.containerType"-->
<!--                @change="handleOptionChange(scope.row.containerType)"-->
<!--              >-->
<!--                <el-option-->
<!--                  v-for="item in craFlag-->
<!--                    ? containerOptions.filter(item => cra_contaier_type.indexOf(item.type) > -1)-->
<!--                    : containerOptions"-->
<!--                  :label="item.type"-->
<!--                  :value="item.type"-->
<!--                  :key="item.id">-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column label="Sub Container Type">-->
<!--            <template v-slot="scope">-->
<!--              <el-select v-model="scope.row.subContainerType" clearable filterable-->
<!--                         @change="(value) => subContainerTypeChange(scope.$index, value)">-->
<!--                <el-option v-for="item in containerTypeList" :label="item.type" :value="item.type"-->
<!--                           :key="item.type"></el-option>-->
<!--              </el-select>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          &lt;!&ndash; <el-table-column label="Sub Container Type"  prop="subContainerType" >-->
<!--            <template v-slot="scope">-->
<!--              <el-select v-model="scope.row.subContainerType" clearable filterable   placeholder="Yes/No">-->
<!--                <el-option label="Yes" value="Yes"></el-option>-->
<!--                <el-option label="No" value="No"></el-option>-->
<!--              </el-select>-->
<!--            </template>-->
<!--          </el-table-column> &ndash;&gt;-->


<!--          <el-table-column label="Container No">-->
<!--            <template v-slot="scope">-->
<!--              <el-input v-model="scope.row.containerNo"/>-->
<!--              &lt;!&ndash; <el-select v-if="shipment.carrier == 'TSHG'" clearable filterable remote v-model="scope.row.containerNo"-->
<!--                placeholder="" :remote-method="remoteContainerNo" @focus="handleContainerChange(scope.row)"-->
<!--                :loading="loadingSelect">-->
<!--                <el-option v-for="item in containerOptions" :key="item.id" :label="item.containerNo"-->
<!--                  :value="item.containerNo">-->
<!--                </el-option>-->
<!--              </el-select> &ndash;&gt;-->
<!--            </template>-->

<!--          </el-table-column>-->
<!--          <el-table-column label="Container Seal Number">-->
<!--            <template v-slot="scope">-->
<!--              <el-input v-model="scope.row.containerSealNumber"/>-->
<!--            </template>-->
<!--          </el-table-column>-->

<!--          <el-table-column label="Tare Weight(KG)">-->
<!--            <template v-slot="scope">-->
<!--              <el-form-item label-width="0px" style="margin-bottom: 0 !important;" required-->
<!--                            :prop="'containers.' + scope.$index + '.tareWeight'">-->
<!--                <el-input-number v-model="scope.row.tareWeight" :precision="3" :controls="false"/>-->
<!--              </el-form-item>-->
<!--            </template>-->
<!--          </el-table-column>-->


<!--          <el-table-column label="VGM(KG)">-->
<!--            <template v-slot="scope">-->
<!--              <el-form-item label-width="0px" style="margin-bottom: 0 !important;border-width: 0;"-->
<!--                            :prop="'containers.' + scope.$index + '.vgm'">-->
<!--                <div>{{ sumVGM(scope.row).toFixed(3) }}</div>-->
<!--              </el-form-item>-->
<!--            </template>-->
<!--          </el-table-column>-->


<!--          <el-table-column label="Marks&Numbers">-->
<!--            <template v-slot="scope">-->
<!--              <el-input type="textarea" placeholder="Marks&Numbers" v-model="scope.row.remark"/>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--        </el-table>-->
<!--        <div style="width:100%;margin-top: 10px;margin-left:10px">-->
<!--          <el-row>-->
<!--            <el-col :span="6">-->
<!--              <b>Total Gross Weight:</b>-->
<!--              {{ totalWeight().toFixed(3) }}-->
<!--            </el-col>-->
<!--            <el-col :span="6">-->
<!--              <b>Total CBM:</b>-->
<!--              {{ totalCBM().toFixed(3) }}-->
<!--            </el-col>-->
<!--            <el-col :span="6">-->
<!--              <b>Total Number of Packages:</b>-->
<!--              {{ totalVolum() }}-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </div>-->
<!--      </el-card>-->
<!--    </el-form>-->

<!--    <div slot="footer" class="dialog-footer">-->

<!--      <span style="margin-right: 10px;display:inline-block"><el-checkbox-->
<!--        v-model="siForm.noSiEdi">No EDI</el-checkbox></span>-->

<!--      &lt;!&ndash;        <el-button type="primary" v-if="showSIDraft" @click="submitsi(4)" :loading="siButLoading">Save Draft&ndash;&gt;-->
<!--      &lt;!&ndash;        </el-button>&ndash;&gt;-->
<!--      <el-button type="primary" @click="submitsi" :loading="siButLoading">Submit</el-button>-->
<!--      <el-button @click="onClose">Cancel</el-button>-->
<!--    </div>-->

<!--    <el-dialog title="BL Sample" :visible.sync="dialogBLType" :fullscreen="true">-->
<!--      <div style="height: 800px; overflow-y: auto; overflow-x: hidden">-->
<!--        <iframe style="width: 100%; height: 1000%;" :src="sampleUrl"></iframe>-->
<!--      </div>-->
<!--    </el-dialog>-->

<!--    <el-dialog title="Request new HS code" width="500px" :visible.sync="applyHsCodeVisable">-->
<!--      <el-form ref="hsCodeForm" :model="hsCode">-->
<!--        <el-form-item required label="HS code" label-width="120px">-->
<!--          <el-input v-model="hsCode.hsCode" autocomplete="off"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item required label="Description" label-width="120px">-->
<!--          <el-input v-model="hsCode.productEnglishName" autocomplete="off"></el-input>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button @click="applyHsCodeVisable = false">Cancel</el-button>-->
<!--        <el-button type="primary" @click="submitHsCode">Submit</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->

<!--    <el-dialog title="Import HS code Failed" :visible.sync="checkHsCodeDialog">-->
<!--      <el-table :data="hsCodeData">-->
<!--        <el-table-column property="hsCode" label="HS code" width="200">-->
<!--          <template slot-scope="scope">-->
<!--            {{ hsCodeData[scope.$index] }}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--      </el-table>-->
<!--    </el-dialog>-->
<!--  </el-dialog>-->
<!--</template>-->
<!--<script>-->
<!--import {applyNewHsCode, getDataByHsCodes, getHsCodeListByCode} from "@/api/system/hsCode";-->
<!--import {downloadContainersTemplate, si} from "@/api/shipment/shipment";-->
<!--import {getShippingOrderByShipment, getShippingOrderListByIds} from "@/api/shipping/order";-->
<!--import {listDept} from "@/api/system/dept";-->
<!--import {getContainerTypeCodeList} from "@/api/system/containerTypeCode";-->
<!--import XLSX from "xlsx";-->

<!--export default {-->
<!--  name: "shipping-instructions-dialog",-->
<!--  props: ['visible', 'shipment', 'containerOptions', 'craFlag', 'cra_contaier_type', 'handleClose'],-->
<!--  data() {-->
<!--    return {-->
<!--      loading: false,-->
<!--      visibleSIContainer: false,-->
<!--      containerForm: {},-->
<!--      containerTypeList: [],-->
<!--      siForm: {containers: [], shipper: {}, consignee: {}, notifyParty: {}},-->
<!--      parties: {-->
<!--        "Shipper": [],-->
<!--        "Consignee": [],-->
<!--        "Notify Party": [],-->
<!--      },-->
<!--      partiesMap: {},-->
<!--      SOProductList: [],-->
<!--      spoList: [],-->
<!--      SOType: '',-->
<!--      spoItems: [],-->
<!--      hsCodeData: [],-->
<!--      checkHsCodeDialog: false,-->
<!--      checkLoading: false,-->
<!--      containersHeaders: [-->
<!--        'Container Type',-->
<!--        'Container No',-->
<!--        'Container Seal Number',-->
<!--        'SOC(TRUE/FALSE)',-->
<!--        'Marks&Numbers',-->
<!--        'Tare Weight',-->
<!--        'Product Name',-->
<!--        'HS code',-->
<!--        'Number Of Packages',-->
<!--        'Packages',-->
<!--        'Gross Weight(KG)',-->
<!--        'Volume(CBM)',-->
<!--      ],-->
<!--      applyHsCodeVisable: false,-->
<!--      options: [],-->
<!--      hsCodeList: [],-->
<!--      isPepco: false,-->
<!--      siButLoading: false,-->
<!--      vgmForm: {vmg: []},-->
<!--      siDataStr: '',-->
<!--      dialogBLType: false,-->
<!--      sampleUrl: null,-->
<!--      timer: null,-->
<!--      hsCode: {-->
<!--        hsCode: null,-->
<!--        productEnglishName: null-->
<!--      },-->
<!--      flag: false,-->
<!--    }-->
<!--  },-->
<!--  watch: {-->
<!--    async visible(newVal, oldVal) {-->
<!--      if (newVal) {-->
<!--        this.loading = true-->
<!--        await this.getParty()-->
<!--        await this.getContainerTypeCodeList()-->

<!--        const containers = []-->
<!--        const siList = []-->
<!--        const products = this.shipment.productDOList-->
<!--        if (products && products.filter((item) => item.type == 1).length > 0) {-->
<!--          siList.push(...products.filter((item) => item.type == 1))-->
<!--        }-->
<!--        const shippedContainer = {}-->
<!--        for (let i = 0; i < this.shipment.containerDOList.length; i++) {-->
<!--          if (this.shipment.containerDOList[i].type == 0) {-->
<!--            continue-->
<!--          }-->
<!--          shippedContainer[this.shipment.containerDOList[i].id] = {-->
<!--            poNumber: this.shipment.containerDOList[i].poNumber,-->
<!--            containerNo: this.shipment.containerDOList[i].containerNo,-->
<!--            containerType: this.shipment.containerDOList[i].containerType,-->
<!--            departurePod: this.shipment.containerDOList[i].departurePod,-->
<!--            arrivalInlandTerminal: this.shipment.containerDOList[i].arrivalInlandTerminal,-->
<!--            emptyContainerReturn: this.shipment.containerDOList[i].emptyContainerReturn,-->
<!--            containerGateIn: this.shipment.containerDOList[i].containerGateIn,-->
<!--            subContainerType: this.shipment.containerDOList[i].subContainerType,-->
<!--            containerSealNumber: this.shipment.containerDOList[i].containerSealNumber,-->
<!--            remark: this.shipment.containerDOList[i].remark,-->
<!--            soc: this.shipment.containerDOList[i].soc,-->
<!--            tareWeight: this.shipment.containerDOList[i].tareWeight,-->
<!--          }-->
<!--        }-->
<!--        for (let i = 0; i < siList.length; i++) {-->
<!--          containers.push({-->
<!--            containerNo: shippedContainer[siList[i].containerId].containerNo,-->
<!--            soc: shippedContainer[siList[i].containerId].soc,-->
<!--            containerType: shippedContainer[siList[i].containerId].containerType,-->
<!--            subContainerType: shippedContainer[siList[i].containerId].subContainerType,-->
<!--            remark: shippedContainer[siList[i].containerId].remark,-->
<!--            containerSealNumber: shippedContainer[siList[i].containerId].containerSealNumber,-->
<!--            tareWeight: shippedContainer[siList[i].containerId].tareWeight,-->
<!--            productData: [siList[i]],-->
<!--          });-->
<!--        }-->
<!--        this.siForm = {-->
<!--          containers: containers,-->
<!--          consignee: this.shipment.consignee,-->
<!--          shipper: this.shipment.shipper,-->
<!--          notifyParty: this.shipment.notifyParty,-->
<!--          siRemark: this.shipment.siRemark,-->
<!--          blSamples: this.shipment.blSamples,-->
<!--          blType: this.shipment.blType,-->
<!--          noSiEdi: this.shipment.noSiEdi-->
<!--        }-->
<!--        this.siDataStr = JSON.stringify(this.siForm)-->
<!--        const res = await getShippingOrderByShipment(this.shipment.id)-->
<!--        this.spoList = res.data-->
<!--        const response = await getShippingOrderListByIds(res.data.map(item => item.id))-->
<!--        if (this.shipment.fromShipperBooking) {-->
<!--          const spoListTemp = response.data-->
<!--          // if(spoListTemp && spoListTemp.length > 0) {-->
<!--          //   this.form.shipmentType = spoListTemp[0].shipmentType-->
<!--          // }-->
<!--          const spoItems = []-->
<!--          spoListTemp.forEach(so => {-->
<!--            const products = so.productDOList-->
<!--            const product = { id:so.id, soRef: so.soRef}-->

<!--            if (products && products[0]) {-->
<!--              product.hscode = products[0].hscode-->
<!--              product.markNumbers = products[0].markNumbers-->
<!--              product.productName = products[0].productEnglishName-->
<!--              product.booked = products[0].numberOfPackages-->
<!--              product.bookedWeight=products[0].grossWeight-->
<!--              product.bookedVolume=products[0].volume-->
<!--            }-->
<!--            spoItems.push(product)-->
<!--          })-->
<!--          this.spoItems = spoItems-->
<!--        } else {-->
<!--          this.SOList = response.data-->
<!--          for (let i = 0; i < this.SOList.length; i++) {-->
<!--            const so = this.SOList[i]-->
<!--            const data = this.SOList[i].productDOList-->
<!--            this.SOType = so.shipmentType-->
<!--            for (let j = 0; j < data.length; j++) {-->
<!--              const item = data[j]-->
<!--              item.mark = item.remark-->
<!--              item.uploadData = {}-->
<!--              item.fileList = []-->
<!--              if (item.hazardousMaterials === "{}") {-->
<!--                item.dg = 0;-->
<!--              } else {-->
<!--                item.dg = 1;-->
<!--              }-->
<!--              item.batteries = Number(item.batteries);-->
<!--              if (!item.batteries) item.batteries = 3-->
<!--              item.soRef = so.soRef-->
<!--              item.soId = so.id-->
<!--              item.numberOfPackagesAll = item.numberOfPackages + 0-->
<!--              item.grossWeightAll = item.grossWeight + 0-->
<!--              item.volumeAll = item.volume + 0-->
<!--              item.hazardousMaterials = JSON.parse(item.hazardousMaterials);-->
<!--              this.SOProductList.push(item)-->
<!--            }-->
<!--          }-->
<!--          this.productChange()-->
<!--        }-->
<!--        this.loading = false-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    validateContainerNO(value) {-->
<!--      const regex = /^[A-Za-z]{4}\d{7}$/-->
<!--      if (!regex.test(value)) {-->
<!--        this.$notify.error("The first four digits of \"containerNo\" must be capital letters, and the last seven digits must be numbers!")-->
<!--        return false;-->
<!--      }-->
<!--      return true-->
<!--    },-->
<!--    async getParty() {-->
<!--      await this.getParties({ partyRole: "Shipper"})-->
<!--      await this.getParties({ partyRole: "Consignee"})-->
<!--      await this.getParties({ partyRole: "Notify Party"})-->
<!--      await this.getParties({ partyRole: "Agreement Party"})-->
<!--      await this.getParties({ partyRole: "Customer"})-->
<!--    },-->
<!--    async getParties(obj) {-->
<!--      const response = await listDept(obj)-->
<!--      for (let i = 0; i < response.data.length; i++) {-->
<!--        this.$set(this.partiesMap, response.data[i].id, response.data[i]);-->
<!--      }-->
<!--      this.$set(this.parties, obj.partyRole, response.data ? response.data : [])-->
<!--    },-->
<!--    async getContainerTypeCodeList() {-->
<!--      const response = await getContainerTypeCodeList()-->
<!--      this.containerTypeList = response.data-->
<!--    },-->
<!--    handleCargoInfo(spoList, spoIds) {-->
<!--      this.$nextTick(() => {-->
<!--        this.$refs.shipmentCargoInfo.active(spoList, spoIds)-->
<!--      })-->
<!--    },-->
<!--    changeContainerType(item) {-->
<!--      this.$set(item, "containerNo", "");-->
<!--    },-->
<!--    submitContainer() {-->
<!--      const obj = this.siForm.containers.findIndex(-->
<!--        (element) =>-->
<!--          element.containerNo === this.containerForm.containerNo &&-->
<!--          element.containerSealNumber === this.containerForm.containerSealNumber-->
<!--      );-->
<!--      if (this.containerForm.index) {-->
<!--        if (obj === this.containerForm.index || obj === -1) {-->
<!--          this.siForm.containers[-->
<!--            this.containerForm.index-->
<!--            ].containerNo = this.containerForm.containerNo;-->
<!--          this.siForm.containers[-->
<!--            this.containerForm.index-->
<!--            ].containerType = this.containerForm.containerType;-->
<!--          this.siForm.containers[-->
<!--            this.containerForm.index-->
<!--            ].containerSealNumber = this.containerForm.containerSealNumber;-->
<!--          this.visableSIContainer = false;-->
<!--        } else {-->
<!--          this.$notify({-->
<!--            message:-->
<!--              "Container No:" +-->
<!--              this.containerForm.containerNo +-->
<!--              " Container Seal Number:" +-->
<!--              this.containerForm.containerSealNumber +-->
<!--              " is already exists",-->
<!--            type: "warning",-->
<!--          });-->
<!--        }-->
<!--      } else {-->
<!--        if (obj !== -1) {-->
<!--          this.$notify({-->
<!--            message:-->
<!--              "Container No:" +-->
<!--              this.containerForm.containerNo +-->
<!--              " Container Seal Number:" +-->
<!--              this.containerForm.containerSealNumber +-->
<!--              " is already exists",-->
<!--            type: "warning",-->
<!--          });-->
<!--        } else {-->
<!--          const data = {...this.containerForm}-->
<!--          data.productData = [{}];-->
<!--          this.siForm.containers.push(data);-->
<!--          this.visableSIContainer = false;-->
<!--        }-->
<!--      }-->
<!--    },-->
<!--    cancelContainer() {-->
<!--      this.visableSIContainer = false-->
<!--    },-->
<!--    changeBl() {-->
<!--      let data = "" + (this.siForm.blType ? this.siForm.blType : "")-->
<!--      if (this.shipment.carrier === 'TSHG') {-->
<!--        data = data + "\n" + (this.siForm.blSamples ? this.siForm.blSamples : "")-->
<!--      }-->
<!--      this.$set(this.siForm, 'siRemark', data)-->
<!--    },-->
<!--    viewBlSample(key) {-->
<!--      this.dialogBLType = true;-->
<!--      if (key === "CARGO Details") {-->
<!--        this.sampleUrl = "/static/CARGO Details.pdf"-->
<!--      } else if (key === "CARGO Summary I") {-->
<!--        this.sampleUrl = "/static/CARGO Summary I.pdf"-->
<!--      } else if (key === "CARGO Summary II") {-->
<!--        this.sampleUrl = "/static/CARGO Summary II.pdf"-->
<!--      } else if (key === "CARGO Summary") {-->
<!--        this.sampleUrl = "/static/CARGO Summary.pdf"-->
<!--      }-->
<!--    },-->
<!--    filterChinese(name) {-->
<!--      return name.replace(/[\u4e00-\u9fa5]/g, '')-->
<!--    },-->
<!--    getSummaries(param) {-->
<!--      const {columns, data} = param;-->
<!--      const sums = [];-->
<!--      columns.forEach((column, index) => {-->
<!--        if (index === 0) {-->
<!--          sums[index] = 'Total';-->
<!--          return;-->
<!--        }-->
<!--        if (column.property === 'productEnglishName' || column.property === 'hscode' || column.property === 'hscode'-->
<!--          || column.property === 'packages'-->
<!--        ) {-->
<!--          sums[index] = ' ';-->
<!--          return;-->
<!--        }-->
<!--        const values = data.map(item => Number(item[column.property]));-->
<!--        if (!values.every(value => isNaN(value))) {-->
<!--          sums[index] = values.reduce((prev, curr) => {-->
<!--            const value = Number(curr);-->
<!--            if (!isNaN(value)) {-->
<!--              return prev + curr;-->
<!--            } else {-->
<!--              return prev;-->
<!--            }-->
<!--          }, 0);-->
<!--          sums[index] += '';-->
<!--        } else {-->
<!--          sums[index] = '';-->
<!--        }-->
<!--      });-->
<!--      return sums;-->
<!--    },-->
<!--    getInputStrClassNumberOfPackages(row) {-->
<!--      if (Number(row.numberOfPackagesAll) !== 0) {-->
<!--        return 'Red'-->
<!--      }-->
<!--    },-->
<!--    getInputStrClassGrossWeight(row) {-->
<!--      if (Number(row.grossWeightAll) !== 0) {-->
<!--        return 'Red'-->
<!--      }-->
<!--    },-->
<!--    getInputStrClassVolume(row) {-->
<!--      if (Number(row.volumeAll) !== 0) {-->
<!--        return 'Red'-->
<!--      }-->
<!--    },-->
<!--    totalAllBooked() {-->
<!--      return this.spoItems.reduce((accumulator, currentValue) => {-->
<!--        return Number(accumulator) + Number(typeof currentValue.booked == 'undefined' ? 0 : currentValue.booked);-->
<!--      }, 0)-->
<!--    },-->
<!--    totalAllGrossWeight() {-->
<!--      return this.spoItems.reduce((accumulator, currentValue) => {-->
<!--        return Number(accumulator) + Number(typeof currentValue.bookedWeight == 'undefined' ? 0 : currentValue.bookedWeight);-->
<!--      }, 0)-->
<!--    },-->
<!--    totalAllVolume() {-->
<!--      return this.spoItems.reduce((accumulator, currentValue) => {-->
<!--        return Number(accumulator) + Number(typeof currentValue.bookedVolume == 'undefined' ? 0 : currentValue.bookedVolume);-->
<!--      }, 0)-->
<!--    },-->
<!--    beforeUploadContainers(file) {-->
<!--      this.file2Xce(file).then(tabJson => {-->
<!--        if (tabJson && tabJson.length > 0 && tabJson[0].sheet.length > 0) {-->
<!--          const errorList = []-->
<!--          const listTable = []-->
<!--          this.checkLoading = true-->
<!--          const keyList = Object.keys(tabJson[0].sheet[0]);-->
<!--          //check key-->
<!--          for (let i = 0; i < this.containersHeaders.length; i++) {-->
<!--            if (!keyList.includes(this.containersHeaders[i])) {-->
<!--              errorList.push(this.containersHeaders[i])-->
<!--              break-->
<!--            }-->
<!--          }-->
<!--          if (errorList.length > 0) {-->
<!--            this.$notify({-->
<!--              title: 'Warning',-->
<!--              message: errorList + " does not exist, Please use the import template to import",-->
<!--              type: 'warning'-->
<!--            });-->
<!--            this.checkLoading = false;-->
<!--            this.$refs.upload.clearFiles();-->
<!--            return-->
<!--          }-->
<!--          //get data-->
<!--          tabJson[0].sheet.forEach((item, index, key) => {-->
<!--              listTable.push(item);-->
<!--            }-->
<!--          )-->

<!--          const containerTypes = this.containerTypeList.map((obj) => obj.type)-->

<!--          //check key-->
<!--          listTable.forEach((item, index) => {-->
<!--            if (!containerTypes.includes(item["Container Type"])) {-->
<!--              errorList.push(item["Container Type"])-->
<!--            }-->
<!--          })-->
<!--          if (errorList.length > 0) {-->
<!--            this.$notify({-->
<!--              title: 'Warning',-->
<!--              message: 'Container Type ' + errorList + ' does not exist',-->
<!--              type: 'warning'-->
<!--            })-->
<!--            this.checkLoading = false-->
<!--            this.$refs.upload.clearFiles();-->
<!--            return-->
<!--          }-->

<!--          //copy value-->
<!--          const groupedData = {};-->
<!--          listTable.forEach((item, index) => {-->
<!--            const groupKey = `${item["Container Type"]}-${item["Container No"]}`;-->
<!--            if (!groupedData[groupKey]) {-->
<!--              let soc = item['SOC(TRUE/FALSE)']-->
<!--              if (soc != null) {-->
<!--                if (soc.toLowerCase === 'true' || soc === '1' || soc.toLowerCase === 'yes') {-->
<!--                  soc = true-->
<!--                } else {-->
<!--                  soc = false-->
<!--                }-->
<!--              }-->
<!--              groupedData[groupKey] = {-->
<!--                "containerType": String(item["Container Type"] || "").trim(),-->
<!--                "containerNo": String(item["Container No"] || "").trim(),-->
<!--                "subContainerType": String(item["Sub Container Type"] || "").trim(),-->
<!--                "containerSealNumber": String(item["Container Seal Number"] || ""),-->
<!--                "remark": String(item["Marks&Numbers"] || ""),-->
<!--                "tareWeight": item["Tare Weight"],-->
<!--                "soc": soc,-->
<!--                "productData": []-->
<!--              };-->
<!--            }-->
<!--            const productDataItem = {};-->
<!--            // Copy the necessary properties to productDataItem-->
<!--            productDataItem["productEnglishName"] = String(item["Product Name"] || "");-->
<!--            productDataItem["hscode"] = String(item["HS code"] || "");-->
<!--            productDataItem["numberOfPackages"] = item["Number Of Packages"];-->
<!--            productDataItem["packages"] = String(item["Packages"] || "");-->
<!--            const units = this.getDictDatas(this.DICT_TYPE.SYSTEM_UNITS);-->
<!--            const excelUnit = String(item['Packages'])-->
<!--            let unitsFlag = false-->
<!--            if (excelUnit != null) {-->
<!--              for (const unit of units) {-->
<!--                if (unit.label === excelUnit.toUpperCase() || unit.value === excelUnit.toUpperCase()) {-->
<!--                  productDataItem["packages"] = unit.value;-->
<!--                  unitsFlag = true-->
<!--                }-->
<!--              }-->
<!--            }-->
<!--            if (!unitsFlag) {-->
<!--              productDataItem["packages"] = null-->
<!--            }-->

<!--            productDataItem["grossWeight"] = item["Gross Weight(KG)"];-->
<!--            productDataItem["volume"] = item["Volume(CBM)"];-->
<!--            //数组默认是0,表头行也不算,所以 +2-->
<!--            groupedData[groupKey]["index"] = index + 2;-->

<!--            groupedData[groupKey]["productData"].push(productDataItem);-->
<!--          });-->

<!--          const groupedArray = Object.values(groupedData);-->
<!--          if (this.shipment.carrier === 'TSHG') {-->
<!--            //Check hsCode-->
<!--            this.checkTSHGData(groupedArray)-->
<!--          } else {-->
<!--            this.pushData(groupedArray);-->
<!--          }-->
<!--          this.$refs.upload.clearFiles();-->
<!--        }-->
<!--      })-->
<!--    },-->
<!--    checkTSHGData(groupedArray) {-->
<!--      // check  hsCode-->
<!--      const queryList = []-->
<!--      for (let i = 0; i < groupedArray.length; i++) {-->
<!--        const productData = groupedArray[i]['productData']-->
<!--        for (let j = 0; j < productData.length; j++) {-->
<!--          queryList.push(productData[j].hscode)-->
<!--        }-->
<!--      }-->

<!--      getDataByHsCodes(queryList).then((response2) => {-->
<!--        let hsCodeErrorList = []-->
<!--        if (response2.data.length > 0) {-->
<!--          //筛选出不存在数据库中的数据-->
<!--          hsCodeErrorList = queryList.filter(itemA =>-->
<!--            !response2.data.some(itemB =>-->
<!--              itemA == itemB.hsCode-->
<!--            )-->
<!--          );-->
<!--        } else {-->
<!--          hsCodeErrorList = queryList-->
<!--        }-->
<!--        if (hsCodeErrorList.length > 0) {-->
<!--          this.hsCodeData = hsCodeErrorList-->
<!--          this.checkHsCodeDialog = true;-->
<!--          this.checkLoading = false;-->
<!--          return-->
<!--        }-->
<!--        this.pushData(groupedArray);-->
<!--      });-->
<!--    },-->
<!--    pushData(groupedArray) {-->
<!--      //push data-->
<!--      for (let i = 0; i < this.siForm.containers.length; i++) {-->
<!--        for (let j = 0; j < groupedArray.length; j++) {-->
<!--          if (this.siForm.containers[i].containerType == groupedArray[j].containerType &&-->
<!--            (!this.siForm.containers[i].containerNo || this.siForm.containers[i].containerNo != groupedArray[j].containerNo)) {-->
<!--            this.$set(this.siForm.containers[i], 'containerNo', groupedArray[j].containerNo)-->
<!--            this.$set(this.siForm.containers[i], 'subContainerType', groupedArray[j].subContainerType)-->
<!--            this.$set(this.siForm.containers[i], 'containerSealNumber', groupedArray[j].containerSealNumber)-->
<!--            this.$set(this.siForm.containers[i], 'remark', groupedArray[j].remark)-->
<!--            this.$set(this.siForm.containers[i], 'soc', groupedArray[j].soc)-->
<!--            this.$set(this.siForm.containers[i], 'tareWeight', groupedArray[j].tareWeight)-->
<!--            this.siForm.containers[i].productData = []-->

<!--            this.$set(this.siForm.containers[i], 'productData', groupedArray[j].productData)-->

<!--            groupedArray.splice(j, 1);-->
<!--            break-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--      this.checkLoading = false;-->
<!--    },-->
<!--    downloadImportTemplate() {-->
<!--      downloadContainersTemplate({shipmentId: this.shipment.id}).then((res) => {-->
<!--        this.$download.excel(res, "import_template.xlsx");-->
<!--      })-->
<!--    },-->
<!--    applyNewHsCode() {-->
<!--      this.applyHsCodeVisable = true-->
<!--    },-->
<!--    remoteGetHsCode(query) {-->
<!--      if (query && query.length >= 5) {-->
<!--        // 防抖处理-->
<!--        if (this.timer) clearTimeout(this.timer)-->
<!--        this.timer = setTimeout(() => {-->
<!--          this.loading = true-->
<!--          getHsCodeListByCode(query).then(response => {-->
<!--            this.hsCodeList = response.data-->
<!--            this.loading = false-->
<!--          }).catch(() => {-->
<!--            this.loading = false-->
<!--          })-->
<!--        }, 500)-->
<!--      }-->
<!--    },-->
<!--    selectBlur() {-->

<!--    },-->
<!--    numberOfPackagesChange() {-->
<!--      this.productChange()-->
<!--    },-->
<!--    productChange() {-->
<!--      if (!this.shipment.fromShipperBooking) {-->
<!--        // 全局的去减；不是单个的去减SOProductList循环-->
<!--        for (const product of this.SOProductList) {-->
<!--          product.numberOfPackagesAll = product.numberOfPackages-->
<!--          product.grossWeightAll = product.grossWeight-->
<!--          product.volumeAll = product.volume-->
<!--        }-->

<!--        for (let index = 0; index < this.siForm.containers.length; index++) {-->
<!--          const element = this.siForm.containers[index];-->
<!--          for (const product of element.productData) {-->
<!--            const selectSO = this.SOProductList.filter(p => p.id == product.soProductId).shift();-->
<!--            if (selectSO) {-->
<!--              selectSO.numberOfPackagesAll -= product.numberOfPackages-->
<!--              selectSO.grossWeightAll -= product.grossWeight-->
<!--              selectSO.volumeAll -= product.volume-->
<!--            }-->
<!--          }-->
<!--        }-->
<!--        this.SOProductList = [...this.SOProductList]-->
<!--      }-->
<!--    },-->
<!--    grossWeightChange() {-->
<!--      this.productChange()-->
<!--    },-->
<!--    volumeChange() {-->
<!--      this.productChange()-->
<!--    },-->
<!--    addProduct2(data) {-->
<!--      data.push({});-->
<!--    },-->
<!--    handleDelete(data, index) {-->
<!--      data.splice(index, 1);-->
<!--    },-->
<!--    sumGrossWeight(row) {-->
<!--      const sum = row.productData.reduce((sum, item) => sum + (Number(item?.grossWeight) || 0), 0).toFixed(3)-->
<!--      row.grossWeight = sum-->
<!--      return sum-->
<!--    },-->
<!--    subContainerTypeChange(index, subContainerType) {-->
<!--      if (this.siForm.containers[index] && this.siForm.containers[index].containerType !== subContainerType) {-->
<!--        this.siForm.containers[index].containerNo = null-->
<!--      }-->
<!--    },-->
<!--    sumVGM(row) {-->
<!--      try {-->
<!--        const sum = row.productData.reduce((sum, item) => sum + (Number(item?.grossWeight) || 0), 0).toFixed(3)-->
<!--        const sumTare = (Number(row?.tareWeight) || 0).toFixed(3)-->
<!--        return Number(sum) + Number(sumTare)-->
<!--      } catch (error) {-->
<!--        console.error('计算总重量出错:', error);-->
<!--        return 0; // 确保即使出错也有返回值-->
<!--      }-->
<!--    },-->
<!--    totalVolum() {-->
<!--      const totalNumberOfPackages = this.siForm.containers.reduce((sum, container) => {-->
<!--        return sum + container.productData.reduce((containerSum, item) => {-->
<!--          return containerSum + (Number(item?.numberOfPackages) || 0);-->
<!--        }, 0);-->
<!--      }, 0);-->
<!--      return totalNumberOfPackages-->
<!--    },-->
<!--    totalCBM() {-->
<!--      const totalNumberOfPackages = this.siForm.containers.reduce((sum, container) => {-->
<!--        return sum + container.productData.reduce((containerSum, item) => {-->
<!--          return containerSum + (Number(item?.volume) || 0);-->
<!--        }, 0);-->
<!--      }, 0);-->
<!--      return totalNumberOfPackages-->
<!--    },-->
<!--    totalWeight() {-->
<!--      const totalNumberOfPackages = this.siForm.containers.reduce((sum, container) => {-->
<!--        return sum + container.productData.reduce((containerSum, item) => {-->
<!--          return containerSum + (Number(item?.grossWeight) || 0);-->
<!--        }, 0);-->
<!--      }, 0);-->
<!--      return totalNumberOfPackages-->
<!--    },-->
<!--    submitsi() {-->
<!--      this.$refs['siForm'].validate(valid => {-->
<!--        if (valid) {-->
<!--          // if(this.spoList.length>0 && this.SOType == 'LCL') {-->
<!--          //   for (var product of this.SOProductList) {-->
<!--          //     if (product.numberOfPackagesAll > 0) {-->
<!--          //       this.$notify.error('Not fully allocated');-->
<!--          //       return false-->
<!--          //     }-->
<!--          //     if (product.grossWeightAll > 0) {-->
<!--          //       this.$notify.error('Not fully allocated');-->

<!--          //       return false-->
<!--          //     }-->
<!--          //     if (product.volumeAll > 0) {-->
<!--          //       this.$notify.error('Not fully allocated');-->
<!--          //       return false-->
<!--          //     }-->
<!--          //   }-->

<!--          // }-->
<!--          this.siButLoading = true-->
<!--          this.siForm.siDraft = false-->
<!--          //判断重复的箱号-->
<!--          const uniqueContainerNos = new Set();-->
<!--          const duplicates = [];-->
<!--          this.siForm.containers.forEach(container => {-->
<!--            if (uniqueContainerNos.has(container.containerNo)) {-->
<!--              duplicates.push(container);-->
<!--            } else {-->
<!--              uniqueContainerNos.add(container.containerNo);-->
<!--            }-->
<!--          });-->
<!--          if (duplicates.length > 0) {-->
<!--            this.$notify.error('Duplicate Container No: ' + duplicates[0].containerNo + ' , please check');-->
<!--            this.siButLoading = false-->
<!--            return false-->
<!--          }-->

<!--          for (let i = 0; i < this.siForm.containers.length; i++) {-->
<!--            if (this.siForm.containers[i].containerNo) {-->
<!--              this.siForm.containers[i].containerNo = this.siForm.containers[i].containerNo.replace(/(^\s*)|(\s*$)/g, '').toUpperCase()-->
<!--            }-->
<!--            if (this.siForm.containers[i].containerSealNumber) {-->
<!--              this.siForm.containers[i].containerSealNumber = (this.siForm.containers[i].containerSealNumber + '').replace(/(^\s*)|(\s*$)/g, '')-->
<!--            }-->
<!--            const state = this.validateContainerNO(this.siForm.containers[i].containerNo)-->
<!--            if (!state) {-->
<!--              this.siButLoading = false-->
<!--              return false-->
<!--            }-->
<!--          }-->
<!--          for (let j = 0; j < this.siForm.containers.length; j++) {-->
<!--            for (let k = 0; k < this.siForm.containers[j].productData.length; k++) {-->
<!--              const products = this.siForm.containers[j].productData-->
<!--              for (const product of products) {-->
<!--                if (!product.hscode) {-->
<!--                  this.$notify.error('Please input HS Code');-->
<!--                  this.siButLoading = false-->
<!--                  return false-->
<!--                }-->
<!--              }-->
<!--              // if(!this.checkTSHGHscode(products)) {-->
<!--              //   this.$notify.error('Invalid HS Code , please check');-->
<!--              //   this.siButLoading = false-->
<!--              //   return false-->
<!--              // }-->
<!--            }-->
<!--          }-->
<!--          this.realSubmitSI(false);-->
<!--        } else {-->
<!--          console.log('error submit!!');-->
<!--          return false;-->
<!--        }-->
<!--      });-->
<!--    },-->
<!--    realSubmitSI(flag) {-->
<!--      const newSIData = { ...this.siForm }-->
<!--      const newVGMData = { ...this.vgmForm }-->
<!--      let siFlag = false-->
<!--      let vgmFlag = false-->
<!--      if (this.siDataStr != newSIData) {-->
<!--        siFlag = true-->
<!--      }-->
<!--      if (this.vgmDataStr != newVGMData) {-->
<!--        vgmFlag = true-->
<!--      }-->

<!--      const containers = [];-->
<!--      const products = [];-->
<!--      for (let i = 0; i < this.siForm.containers.length; i++) {-->
<!--        containers.push({-->
<!--          containerNo: this.siForm.containers[i].containerNo,-->
<!--          soc: this.siForm.containers[i].soc,-->
<!--          containerType: this.siForm.containers[i].containerType,-->
<!--          subContainerType: this.siForm.containers[i].subContainerType,-->
<!--          containerSealNumber: this.siForm.containers[i].containerSealNumber,-->
<!--          remark: this.siForm.containers[i].remark,-->
<!--          tareWeight: this.siForm.containers[i].tareWeight,-->
<!--        });-->
<!--        let grossWeight = 0;-->
<!--        let volume = 0;-->
<!--        let numbersOfPackage = 0;-->
<!--        let packageType = '';-->
<!--        for (let j = 0; j < this.siForm.containers[i].productData.length; j++) {-->
<!--          this.siForm.containers[i].productData[j].containerNo = this.siForm.containers[i].containerNo;-->
<!--          this.siForm.containers[i].productData[j].containerSealNumber = this.siForm.containers[i].containerSealNumber;-->
<!--          products.push(this.siForm.containers[i].productData[j]);-->
<!--          if (this.siForm.containers[i].productData[j].grossWeight) {-->
<!--            grossWeight += Number(this.siForm.containers[i].productData[j].grossWeight);-->
<!--          }-->
<!--          if (this.siForm.containers[i].productData[j].volume) {-->
<!--            volume += Number(this.siForm.containers[i].productData[j].volume);-->
<!--          }-->
<!--          if (this.siForm.containers[i].productData[j].numberOfPackages) {-->
<!--            numbersOfPackage += Number(this.siForm.containers[i].productData[j].numberOfPackages);-->
<!--          }-->
<!--          packageType = this.siForm.containers[i].productData[j].packages-->
<!--        }-->
<!--        containers[i].grossWeight = grossWeight-->
<!--        containers[i].volume = volume-->
<!--        containers[i].numbersOfPackage = numbersOfPackage-->
<!--        containers[i].packageType = packageType-->
<!--      }-->

<!--      const req = {-->
<!--        shipmentId: this.$route.query.id,-->
<!--        blType: this.siForm.blType,-->
<!--        siRemark: this.siForm.siRemark,-->
<!--        blSamples: this.siForm.blSamples,-->
<!--        products: JSON.stringify(products),-->
<!--        vmg: JSON.stringify(this.vgmForm.vmg),-->
<!--        containers: JSON.stringify(containers),-->
<!--        shipper: this.siForm.shipper,-->
<!--        consignee: this.siForm.consignee,-->
<!--        agreementParty: this.siForm.agreementParty,-->
<!--        notifyParty: this.siForm.notifyParty,-->
<!--        si: siFlag,-->
<!--        vgm: vgmFlag,-->
<!--        siDraft: this.siForm.siDraft,-->
<!--        noSiEdi: this.siForm.noSiEdi,-->
<!--      };-->
<!--      si(req).then(response => {-->
<!--        this.siButLoading = false-->
<!--        this.$notify({-->
<!--          title: "success",-->
<!--          message: "submit success",-->
<!--          type: "success",-->
<!--        });-->
<!--        this.onClose()-->
<!--      });-->
<!--    },-->
<!--    file2Xce(file) {-->
<!--      return new Promise(function (resolve, reject) {-->
<!--        const reader = new FileReader()-->
<!--        reader.onload = function (e) {-->
<!--          const data = e.target.result-->
<!--          const wb = XLSX.read(data, {-->
<!--            type: 'binary'-->
<!--          })-->
<!--          const result = []-->
<!--          wb.SheetNames.forEach((sheetName) => {-->
<!--            result.push({-->
<!--              sheetName: sheetName,-->
<!--              sheet: XLSX.utils.sheet_to_json(wb.Sheets[sheetName])-->
<!--            })-->
<!--          })-->
<!--          resolve(result)-->
<!--        }-->
<!--        reader.readAsBinaryString(file.raw)-->
<!--      })-->
<!--    },-->
<!--    onClose() {-->
<!--      this.$emit('handleClose');-->
<!--    },-->
<!--    submitHsCode() {-->
<!--      this.$refs['hsCodeForm'].validate(valid => {-->
<!--        if (valid) {-->
<!--          applyNewHsCode(this.hsCode).then(res => {-->
<!--            this.$notify({-->
<!--              title: 'success',-->
<!--              message: 'success',-->
<!--              type: 'success'-->
<!--            });-->
<!--            this.applyHsCodeVisable = false-->
<!--            this.hsCode = {}-->
<!--          })-->
<!--        }-->
<!--      })-->
<!--    },-->
<!--    handleOptionChange(value) {-->
<!--      const arr = [];-->
<!--      for (let i = 0; i < this.containerOptions.length; i++) {-->
<!--        if (this.containerOptions[i].isReeferContainer == "Yes") {-->
<!--          arr.push(this.containerOptions[i].type);-->
<!--        }-->
<!--      }-->
<!--      let flag = false;-->
<!--      for (let i = 0; i < this.siForm.containers.length; i++) {-->
<!--        if (arr.indexOf(this.siForm.containers[i].containerType) > -1) {-->
<!--          flag = true;-->
<!--          break;-->
<!--        }-->
<!--      }-->
<!--      this.flag = flag;-->
<!--    },-->
<!--    addContainers() {-->
<!--      this.siForm.containers.push({ productData: [{}] })-->
<!--    },-->
<!--    handleDeleteContainer(index) {-->
<!--      this.siForm.containers.splice(index, 1)-->
<!--    }-->
<!--  },-->
<!--  beforeDestroy() {-->
<!--    // 清楚防抖函数-->
<!--    if (this.timer) clearTimeout(this.timer)-->
<!--  },-->
<!--}-->
<!--</script>-->
<!--<style lang="scss" scoped>-->
<!--.text-btn {-->
<!--  font-weight: bold;-->
<!--  font-size: 12px;-->
<!--  color:#004F7C;-->
<!--  margin-right: 15px;-->
<!--  cursor: pointer;-->
<!--}-->
<!--</style>-->
