<template>
  <div class="app-container shipment-create" style="width:100%; margin: 0 auto">
    <el-dialog title="Upload Error" :visible.sync="checkDialogTableVisible" width="30%">
      <el-table :data="checkErrorData">
        <el-table-column property="type" label="Type" width="100"></el-table-column>
        <el-table-column property="status" label="Status" width="100">
          <template slot-scope="scope">
            {{scope.row.status === true ? 'Exceeding':' Missing'}}
          </template>
        </el-table-column>
        <el-table-column property="number" label="Number"></el-table-column>
      </el-table>
    </el-dialog>

    <el-card class="pd-20">

      <el-form :model="form" ref="form" :show-message="false" label-width="140px">

        <el-row :gutter="20">

          <el-col :span="17">
            <el-card style="border-radius: 0px!important;margin-top:15px;padding:0px 0px 15px 0px">

              <div class="el-descriptions__title" style="font-size:20px;margin-bottom:10px;margin-top:10px">General Info
              </div>


              <el-descriptions
                style="padding: 15px 15px 0px 0px!important;background: #fff;box-shadow: none!important;border: 0px solid #ddd;"
                direction="vertical" :colon="false" class="margin-top" :column="6">

                <el-descriptions-item label="SO Number">

                  <el-input disabled v-model="form.ningboBlNumber" />
                </el-descriptions-item>
                <el-descriptions-item label="Vessel">
                  <el-input disabled v-model="form.transportMeanName" />
                </el-descriptions-item>
                <el-descriptions-item label="Voyage">
                  <el-input disabled v-model="form.voyage" />
                </el-descriptions-item>
                <el-descriptions-item label="Port of Discharge">
                  <el-input disabled v-model="form.destinationPortStr" style="width: 250px;" />
                </el-descriptions-item>
                <el-descriptions-item label="">
                </el-descriptions-item>
              </el-descriptions>


              <el-descriptions v-for="(item, i) in form.productData.filter(item => item.containerId==null )"
                :key="'product' + i"
                style="padding: 0px 15px 0px 0px!important;background: #fff;box-shadow: none!important;border: 0px solid #ddd;"
                direction="vertical" :colon="false" class="margin-top" :column="6">

                <el-descriptions-item label="Number of package"><el-input
                    v-model="item.numberOfPackages" /></el-descriptions-item>
                <el-descriptions-item label="Package">
                  <el-select filterable v-model="item.packages" placeholder="">
                    <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value"
                      :label="dict.label" :value="dict.value" />
                  </el-select>

                </el-descriptions-item>
                <el-descriptions-item label="Gross Weight(KG)"><el-input
                    v-model="item.grossWeight" /></el-descriptions-item>
                <el-descriptions-item label="Volume(CBM)"><el-input v-model="item.volume" /></el-descriptions-item>
                <el-descriptions-item label=""></el-descriptions-item>
                <el-descriptions-item label=""></el-descriptions-item>

                <el-descriptions-item label="Marks and Numbers" :span="2">
                  <el-input type="textarea" v-model="item.markNumbers" /></el-descriptions-item>
                <el-descriptions-item label="Product name" :span="2"><el-input type="textarea"
                    v-model="item.productEnglishName" /></el-descriptions-item>
                <el-descriptions-item label="Product chinese name" :span="2"><el-input type="textarea"
                    v-model="item.productChineseName" /></el-descriptions-item>
              </el-descriptions>


              <el-table style="margin-top: 15px;margin-bottom: 10px;" :data="remainingContainerDOList">
                <el-table-column prop="containerType" label="Container Type" width="90px">
                  <template v-slot="scope">
                    {{scope.row.containerType}}
                  </template>
                </el-table-column>
                <el-table-column prop="containerNo" label="Container Number" width="120px">
                  <template v-slot="scope">
                    {{scope.row.containerNo}}
                  </template>
                </el-table-column>
                <el-table-column prop="containerSealNumber" label="Seal Number" width="100px">
                  <template v-slot="scope">
                    {{scope.row.containerSealNumber}}
                  </template>
                </el-table-column>
                <el-table-column prop="numbersOfPackage" label="Number of package" width="120px">
                  <template v-slot="scope">
                    {{scope.row.numbersOfPackage}}
                  </template>
                </el-table-column>
                <el-table-column prop="grossWeight" label="Gross Weight(KG)" width="110px">
                  <template v-slot="scope">
                    {{scope.row.grossWeight}}
                  </template>
                </el-table-column>
                <el-table-column prop="volume" label="Volume(CBM)" width="110px">
                  <template v-slot="scope">
                    {{scope.row.volume}}
                  </template>
                </el-table-column>
                <el-table-column prop="numbersOfPackageAll" label="Number of package(Remaining）">
                  <template v-slot="scope">
                    <div :class="getInputStrClassNumberOfPackages(scope.row.containerNo)">
                      {{ getByContainerNo(scope.row.containerNo).numbersOfPackage }}

                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="grossWeightAll" label="Gross Weight(Remaining)">
                  <template v-slot="scope">
                    <div :class="getInputStrClassGrossWeight(scope.row.containerNo)">
                      {{ getByContainerNo(scope.row.containerNo).grossWeight }}

                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="volumeAll" label="Volume(Remaining)">
                  <template v-slot="scope">
                    <div :class="getInputStrClassVolume(scope.row.containerNo)">
                      {{ getByContainerNo(scope.row.containerNo).volume }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div>
              </div>
            </el-card>
            <el-card style="border-radius: 0px!important;margin-top:15px;padding:0px 0px 15px 0px">
              <div class="el-descriptions__title" style="font-size:20px;margin-bottom:10px;margin-top:10px">Cargo
                Manifest
              </div>
              <el-row>
                <el-button @click="addSubSo" :disabled="false" size="mini" type="primary">Create Sub SO
                  Number</el-button>

                <!-- <div class="el-descriptions__title" style="font-size:20px;margin-bottom:10px;font-size:20px"> -->
                <el-upload style="display:inline-block;padding-right: 10px;padding-left: 10px;" class="upload-demo"
                  ref="upload" action="#" accept=".xlsx,.xls" :auto-upload="false" :on-change="beforeUploadManifest"
                  :show-file-list="false">
                  <el-button size="mini" type="text"><i class="el-icon-plus"></i>Upload</el-button>
                </el-upload>
                <el-button @click="downloadImportTemplate()" size="mini" type="text"><i
                    class="el-icon-plus"></i>Download
                  Template</el-button>
                <!-- </div> -->
              </el-row>
              <el-card v-for="(item,i) in form.subSoList" :key="item.soNumber" style="margin-bottom: 10px; ">
                <div>
                  <el-input v-model="item.soNumber" placeholder="" style="width: 200px;"></el-input>


                  <el-button v-show="i!=0" size="mini" type="text" icon="el-icon-delete"
                    @click="handleDeleteSubSo(i)">{{
                    $t("search.delete") }}</el-button>

                  <div style="float: right;">
                    <el-button type="text" @click="addContainers(item.containers)"><i class="el-icon-plus"></i>Add
                      Container</el-button>
                  </div>

                </div>

                <el-table :data="item.containers" border style="margin-top: 15px;margin-bottom: 10px;"
                  class="shipmentContainers-css">

                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <div style="margin-left:50px">
                        <el-descriptions style="margin-bottom:0px;box-shadow: none!important;border:none!important"
                          :colon="false" direction="vertical" v-for="(item, index) in scope.row.productData"
                          :key="index" class="margin-top" title="" :column="9">

                          <!-- <el-descriptions-item label="Select">
                                <el-select @change="changeProduct(item,item.productId,scope.row.containerNo)"
                                  v-model="item.productId">
                                  <el-option v-for="dict in selectProductDic[scope.row.containerNo]" :key="dict.id"
                                    :label="dict.productEnglishName" :value="dict.id" />
                                </el-select>
                              </el-descriptions-item> -->


                          <el-descriptions-item :label="index == 0 ? $t('booking.productEnglishName') : ''" :span="2">
                            <el-form-item required label=""
                              :prop="'subSoList.'+i+'.containers.' + scope.$index + '.productData.' + index + '.productEnglishName'">
                              <el-input type="textarea" v-model="item.productEnglishName" maxlength="500"
                                show-word-limit
                                @input="item.productEnglishName = filterChinese(item.productEnglishName)" />
                            </el-form-item>
                          </el-descriptions-item>
                          <el-descriptions-item :label="index == 0 ? $t('booking.hsCode') : ''">
                            <el-form-item required label=""
                              :prop="'subSoList.'+i+'.containers.' + scope.$index + '.productData.' + index + '.hscode'">
                              <el-input v-model="item.hscode" />
                            </el-form-item>

                          </el-descriptions-item>
                          <el-descriptions-item :label="index == 0 ? 'Number Of Packages' : ''">
                            <el-form-item required label=""
                              :prop="'subSoList.'+i+'.containers.' + scope.$index + '.productData.' + index + '.numberOfPackages'">

                              <el-input-number @change="numberOfPackagesChange" v-model="item.numberOfPackages"
                                :controls="false" :precision="0" />
                            </el-form-item>
                          </el-descriptions-item>
                          <el-descriptions-item :label="index == 0 ? 'Packages' : ''">
                            <el-form-item required label=""
                              :prop="'subSoList.'+i+'.containers.' + scope.$index + '.productData.' + index + '.packages'">

                              <el-select filterable v-model="item.packages" placeholder="">
                                <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value"
                                  :label="dict.label" :value="dict.value" />
                              </el-select>
                            </el-form-item>
                          </el-descriptions-item>
                          <el-descriptions-item :label="index == 0 ? 'Gross Weight(KG)' : ''">
                            <el-form-item required label=""
                              :prop="'subSoList.'+i+'.containers.' + scope.$index + '.productData.' + index + '.grossWeight'">

                              <el-input-number @change="grossWeightChange" v-model="item.grossWeight" :precision="3"
                                :controls="false" />
                            </el-form-item>

                          </el-descriptions-item>
                          <el-descriptions-item :label="index == 0 ? 'Volume(CBM)' : ''">
                            <el-form-item required label=""
                              :prop="'subSoList.'+i+'.containers.' + scope.$index + '.productData.' + index + '.volume'">
                              <el-input-number @change="volumeChange" v-model="item.volume" :precision="3"
                                :controls="false" />
                            </el-form-item>
                          </el-descriptions-item>
                          <el-descriptions-item>
                            <template slot="label">
                              <el-button v-if="index == 0" type="text" @click="addProduct(scope.row.productData)"><i
                                  class="el-icon-plus"></i>Add Product</el-button>
                            </template>
                            <el-button size="mini" v-if="index != 0" type="text" icon="el-icon-delete"
                              @click="handleDeleteProduct(scope.row.productData, index)">{{ $t("search.delete")
                              }}</el-button>


                          </el-descriptions-item>
                        </el-descriptions>
                        <div style="width:100%;margin-top: 10px;margin-left: 10px; ">
                          <el-row>
                            <el-col :span="6">
                              <b>Total Gross Weight:</b>
                              {{ scope.row.productData==undefined?0: scope.row.productData.reduce((sum, item) => sum +
                              (Number(item?.grossWeight) || 0),
                              0).toFixed(3) }}
                            </el-col>
                            <el-col :span="6">
                              <b>Total CBM:</b>
                              {{ scope.row.productData==undefined?0: scope.row.productData.reduce((sum, item) => sum +
                              (Number(item?.volume) || 0), 0).toFixed(3)
                              }}
                            </el-col>
                            <el-col :span="6">
                              <b>Total Number of Packages:</b>
                              {{ scope.row.productData==undefined?0: scope.row.productData.reduce((sum, item) => sum +
                              (Number(item?.numberOfPackages) || 0), 0)
                              }}
                            </el-col>
                          </el-row>
                        </div>
                      </div>



                    </template>
                  </el-table-column>
                  <!-- <el-table-column label="Select">
                        <template v-slot="scope">
                          <el-select @change="changeContainer(scope.row,scope.row.containerNo1)"
                            v-model="scope.row.containerNo1">
                            <el-option v-for="dict in selectContainerList" :key="dict.containerNo"
                              :label="dict.containerNo" :value="dict.containerNo" />
                          </el-select>
                        </template>
                      </el-table-column> -->

                  <el-table-column label="Container No">
                    <template v-slot="scope">
                      <el-form-item required :prop="'subSoList.'+i+'.containers[' +  scope.$index + '].containerNo'"
                        label-width="0px" style="margin-bottom: 0px!important;">
                        <el-input v-model="scope.row.containerNo" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="Seal Number">
                    <template v-slot="scope">
                      <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                        :prop="'subSoList.'+i+'.containers.' + scope.$index + '.sealNumber'">
                        <el-input v-model="scope.row.sealNumber"
                          @blur="scope.row.sealNumber = $event.target.value.trim()" />
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column label="Container Type" prop="containerType">
                    <template v-slot="scope">
                      <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                        :prop="'subSoList.'+i+'.containers.' + scope.$index + '.containerType'">
                        <el-select v-model="scope.row.containerType" clearable filterable>
                          <el-option v-for="item in containerTypeList" :label="item.type" :value="item.type"
                            :key="item.type"></el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>


                  <el-table-column label="Marks&Numbers">
                    <template v-slot="scope">
                      <el-input type="textarea" placeholder="Marks&Numbers" v-model="scope.row.remark" />
                    </template>
                  </el-table-column>


                  <el-table-column label="" prop="add">
                    <template v-slot="scope">
                      <el-button v-if="scope.$index != 0" size="mini" type="text" icon="el-icon-delete"
                        @click="handleDeleteContainer(item.containers,scope.$index)">{{
                        $t("search.delete") }}</el-button>
                      <el-button size="mini" type="text" icon="el-icon-delete"
                        @click="clearContainer(item.containers,scope.$index)">Clear</el-button>
                    </template>
                  </el-table-column>

                </el-table>
              </el-card>

            </el-card>

            <el-card style="border-radius: 0px!important;margin-top:15px;padding:0px 0px 15px 0px">


              <div class="el-descriptions__title" style="font-size:20px;margin-bottom:10px;margin-top:10px">VGM List
              </div>




              <!-- vgm -->
              <el-table :data="form.vgmTableData" style="width: 100%">
                <el-table-column prop="containerType" label="Container Type" min-width="100">
                </el-table-column>
                <el-table-column prop="containerNo" label="Container No." width="130">
                </el-table-column>
                <el-table-column prop="containerSealNumber" label="Seal No." width="130">
                </el-table-column>

                <el-table-column prop="grossWeight" label="Gross Weight">
                </el-table-column>
                <el-table-column prop="tareWeight" label="Tare Weight">
                  <template v-slot="scope">
                    <el-form-item required :prop="'vgmTableData[' +  scope.$index + '].tareWeight'" label-width="0px"
                      style="margin-bottom: 0px!important;">
                      <el-input @input="sum(scope.row)" v-model="scope.row.tareWeight" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="vgm" label="VGM(KG)">
                </el-table-column>
                <el-table-column prop="vgmMethod" label="Vgm Method">
                  <template v-slot="scope">

                    <el-select v-model="scope.row.vgmMethod">
                      <el-option value="SM1"></el-option>
                      <el-option value="SM2"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="weighingCertificateNumber" label="Weighing Certificate Number" width="180">
                  <template v-slot="scope">
                    <el-input v-model="scope.row.weighingCertificateNumber" />
                  </template>
                </el-table-column>
                <el-table-column prop="weighingTime" label="Weighing Time" width="140">
                  <template v-slot="scope">
                    <el-date-picker type="date" value-format="timestamp"
                      v-model="scope.row.weighingTime"></el-date-picker>
                  </template>
                </el-table-column>
              </el-table>

              <el-descriptions style="padding:0px!important;border: none;box-shadow: none !important;" :colon="false"
                class="margin-top" title="" direction="vertical" :column="7" size="mini">
                <el-descriptions-item span="2">
                  <template slot="label">
                    VGM Party
                  </template>
                  <el-form-item required prop="vgmData.vgmParty">
                    <el-input v-model="form.vgmData.vgmParty" />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">

                    Sign
                  </template>
                  <el-form-item prop="vgmData.sign">
                    <el-input v-model="form.vgmData.sign" />
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label">
                    E-mail
                  </template>
                  <el-form-item required prop="vgmData.email">
                    <el-input v-model="form.vgmData.email" />
                  </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label">
                    Phone
                  </template>
                  <el-form-item prop="vgmData.phone">
                    <el-input v-model="form.vgmData.phone" />
                  </el-form-item>
                </el-descriptions-item>


                <el-descriptions-item span="2">
                  <template slot="label">
                    VGM Location
                  </template>
                  <el-form-item required prop="vgmData.vgmLocation">
                    <el-input v-model="form.vgmData.vgmLocation" />
                  </el-form-item>
                </el-descriptions-item>


                <el-descriptions-item></el-descriptions-item>
                <el-descriptions-item></el-descriptions-item>
                <el-descriptions-item></el-descriptions-item>

              </el-descriptions>



            </el-card>
            <!-- end -->
          </el-col>

          <el-col :span="7">
            <el-descriptions style="padding:15px!important" :colon="false" class="margin-top" title="Contact Info"
              direction="vertical" :column="2" size="mini">
              <el-descriptions-item>
                <template slot="label">
                  <span style="color:red;">*</span>{{ $t('booking.name') }}
                </template>
                <el-form-item required prop="name">
                  <el-input v-model="form.name" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">

                  Mobile Phone
                </template>
                <el-form-item prop="phone">
                  <el-input v-model="form.phone" @blur="validatePhoneNumber" />
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  <span style="color:red;">*</span>Fax
                </template>
                <el-form-item prop="fax" type="fax">
                  <el-input v-model="form.fax" />
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">

                  <span style="color:red;">*</span>Business Phone
                </template>
                <el-form-item prop="fixedPhone" type="fixedPhone">
                  <el-input v-model="form.fixedPhone" />
                </el-form-item>
              </el-descriptions-item>


              <el-descriptions-item span="2">
                <template slot="label">
                  <span style="color:red;">*</span>{{ $t('booking.email') }} (Booking)
                </template>
                <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="email" type="email">
                  <el-input v-model="form.email" @blur="validateEmailAddress" />
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item span="2">
                <template slot="label">
                  <span style="color:red;">*</span>{{ $t('booking.email') }} (Si)
                </template>
                <el-form-item required :rules="[ { required: true, message: '  '}  ]" prop="siEmail" type="email">
                  <el-input v-model="form.siEmail" @blur="validateEmailAddress" />
                </el-form-item>
              </el-descriptions-item>


              <el-descriptions-item></el-descriptions-item>
              <el-descriptions-item></el-descriptions-item>
              <el-descriptions-item></el-descriptions-item>

            </el-descriptions>




            <el-descriptions style="padding:15px!important" :colon="false" class="margin-top parties-desc"
              title="Shipper" :column="1" size="mini">
              <el-descriptions-item labelStyle="width: 90px" contentStyle="width: 90px">
                <template slot="label">
                  Name
                </template>
                <el-form-item required prop="shipper" style="border:none;border-bottom:1px solid #ddd;width: 100%;">
                  <el-select @change="changeShipper" filterable clearable v-model="form.shipper">
                    <el-option v-for="item in parties['Shipper']" :key="item.id" :value="item.id" :label="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
                <div>

                </div>
              </el-descriptions-item>

              <el-descriptions-item label="Enterprise Code" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">
                  {{getShipper().companyUsci}}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="Address" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">

                  {{getShipper().address}}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="Country Code" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">
                  {{getShipper().country!=undefined?getShipper().country.split("-")[0]:'-'}}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="Phone" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">

                  {{getShipper().phone}}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="AEO Code" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">

                  {{getShipper().aeoCode}}
                </div>
              </el-descriptions-item>
            </el-descriptions>

            <el-descriptions style="padding:15px!important" :colon="false" class="margin-top parties-desc"
              title="Consignee" :column="1" size="mini">
              <el-descriptions-item labelStyle="width: 90px" contentStyle="width: 90px">
                <template slot="label">
                  Name
                </template>
                <el-form-item required prop="consignee" style="border:none;border-bottom:1px solid #ddd;width: 100%;">
                  <el-select remote v-model="form.consignee" filterable>
                    <el-option v-for="item in parties['Consignee']" :key="item.id" :value="item.id" :label="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item label="Enterprise Code" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">
                  {{getConsignee().companyUsci}}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="Address" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">

                  {{getConsignee().address}}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="Country Code" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">

                  {{getConsignee().country!=undefined?getConsignee().country.split("-")[0]:'-'}}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="Phone" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">

                  {{getConsignee().phone}}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="AEO Code" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">

                  {{getConsignee().aeoCode}}
                </div>
              </el-descriptions-item>

            </el-descriptions>

            <el-descriptions style="padding:15px!important" :colon="false" class="margin-top parties-desc"
              title="Notify Party" :column="1" size="mini">

              <el-descriptions-item labelStyle="width: 90px" contentStyle="width: 90px">
                <template slot="label">

                  Notify Party
                </template>
                <el-form-item required prop="notifyParty" style="border:none;border-bottom:1px solid #ddd;width: 100%;">
                  <el-select clearable v-model="form.notifyParty" filterable>
                    <el-option v-for="item in parties['Notify Party']" :key="item.id" :value="item.id"
                      :label="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item label="Enterprise Code" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">
                  {{getNotifyParty().companyUsci}}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="Address" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">

                  {{getNotifyParty().address}}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="Country Code" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">
                  {{getNotifyParty().country!=undefined?getNotifyParty().country.split("-")[0]:'-'}}

                </div>
              </el-descriptions-item>
              <el-descriptions-item label="Phone" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">

                  {{getNotifyParty().phone}}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="AEO Code" labelStyle="width: 105px" contentStyle="width: 105px">
                <div style="padding:6.5px 0px">

                  {{getNotifyParty().aeoCode}}
                </div>
              </el-descriptions-item>


            </el-descriptions>

          </el-col>
        </el-row>


        <el-row style="text-align: center">
          <span style="margin-right: 10px;display:inline-block"><el-checkbox v-model="form.pushVgm"
            v-hasPermi="['sinotrans-booking']">Book through smartMOOV</el-checkbox></span>
          <el-button size="mini" @click="submit" type="primary" :loading="loadingSaveBut">{{
            $t("booking.submit")
            }}</el-button>
        </el-row>
      </el-form>
    </el-card>



    <el-dialog title="Number of SOs" :visible.sync="soNumbersDialogVisible" width="250px">
      <el-input-number v-model="soNumbers" :min="1" :max="10"></el-input-number>
      <div slot="footer" class="dialog-footer">
        <el-button @click="soNumbersDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitSoNumbers">Submit</el-button>
      </div>
    </el-dialog>





  </div>

</template>

<style>
  .shipmentRouters-css .el-form-item__content {
    margin: 0 !important;
  }

  .shipmentRouters-css label.el-form-item__label {
    display: none;
  }

  .shipmentContainers-css .el-form-item.is-required.el-form-item--mini {
    margin: 0px !important;
  }

  .shipmentContainers-css .el-form-item__content {
    margin: 0 !important;
  }

  .Red {
    color: #EA0000 !important;
  }
</style>

<script>
  import { listDept } from "@/api/system/dept";
  import {
    create,
    si,
    vgm,
    shipmentDetails,
    updateShipment,
    submitSISinotrans,
    downloadContainersTemplate,
    submitSinotransVGMAPI,
    submitManifest,
    downloadManifestTemplate, submitProductNonContainer
  } from "@/api/shipment/shipment";
  import { getContainerList } from "@/api/system/container";
  import { createDeptApply } from "@/api/system/deptApply";
  import { getFileList, deleteFile } from "@/api/infra/file";
  import { getCraNumList, downloadSinotransContainersTemplate } from "@/api/shipment/shipment";
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
  import { getPortPage } from "@/api/system/port";
  import { getContainerTypeCodeList } from "@/api/system/containerTypeCode";
  import SinotransVGM from "../detail/sinotrans-vgm/index.vue"
  import { getUserProfile } from "@/api/system/user";

  import XLSX from "xlsx";

  export default {
    name: "Shipment",
    components: { SinotransVGM },
    data() {
      return {
        checkDialogTableVisible: false,
        checkErrorAllData: [],
        checkErrorData: [],
        allocationWeekList: [],
        loadingSaveBut: false,
        form: {
          type: "Merchant",
          containers: [],

          shipmentRouters: [],
          productData: [],
          productDataBook: [],
          contractType: "CY/CY",
          phone: "",
          email: "",
          vgmData: {}
        },
        phoneError: "",
        emailError: "",
        portOptions: [],
        containerOptions: [],
        parties: {
          'Notify Party': [],
          'Consignee': [],
          'Shipper': [],
        },
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
        showSIDraft: false,
        itemTableData: [],
        productMapForBook: {},
        orderMap: {},
        orderItemMap: {},
        selCancelReason: [],
        selCancelCategory: [],
        selectCancelReason: [],
        activeName: 'second',
        cancelReasonFlag: false,
        shipmentNote: {
          cancelCode: null,
          cancelSubCode: null,
          cancelRemark: null,
        },
        noteView: false,
        craList: [],
        chosePaymentLocationVisable: false,
        paymentLocationList: [],
        queryParams: {
          pageNo: 1,
          total: 0,
          pageSize: 10,
        },
        containerTypeList: [],
        showCNNGBSI: false,
        containersHeaders: [
          "SO Number",
          "Container No",
          "Seal Number",
          "Container Type",
          "Marks&Numbers",
          "Product Name",
          "HS code",
          "Number Of Packages",
          "Package Type",
          "Gross Weight(KG)",
          "Volume(CBM)"
        ],
        selectContainerList: [],
        selectProductDic: {},
        shippedContainer: {},
        remainingContainerDOList: [],
        remaining: {},
        soNumbersDialogVisible: false,
        soNumbers: 1,
        user: {},

      };
    },
    computed: {

    },
    created() {

      var data = getBaseHeader();
      this.uploadHeaders = data;
      this.url = process.env.VUE_APP_BASE_API;


      var ids = this.$route.query.id;

      if (ids) {
        getUserProfile().then((response) => {
          this.user = response.data
          getOriginDeliveryList().then((response) => {
            this.portOptions = response.data;
            this.getShipmentDetails(ids);
          });
        });
      }
      this.getContainerTypeCodeList();
      this.getContainerList();
      this.getParties({ partyRole: "Shipper" });
      this.getParties({ partyRole: "Consignee" });
      this.getParties({ partyRole: "Notify Party" });
      this.getParties({ partyRole: "Agreement Party" });
    },
    methods: {
      changeShipper() {
        var party = this.getShipper()
        this.$set(this.form.vgmData, "vgmParty", party.name);
      },
      getShipper() {
        var party = { "address": "-", "email": "-", "phone": "-" };
        if (this.form.shipper && this.parties['Shipper'] && this.parties['Shipper'].length > 0) {
          var obj = this.parties['Shipper'].find((item => item.id == this.form.shipper))
          if (obj == undefined || obj == null) {
            obj = party;
          }
          if (this.form.vgmTableData.length > 0) {
            if (this.form.vgmData.vgmParty == null) {
              this.$set(this.form.vgmData, "vgmParty", obj.name);
            }
          }
          return obj
        }
        return party
      },
      getNotifyParty() {
        var party = { "address": "-", "email": "-", "phone": "-" };
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
        var party = { "address": "-", "email": "-", "phone": "-" };
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
        var party = { "address": "-", "email": "-", "phone": "-" };
        if (this.form.agreementParty && this.parties['Agreement Party'] && this.parties['Agreement Party'].length > 0) {
          var obj = this.parties['Agreement Party'].find((item => item.id == this.form.agreementParty))
          if (obj == undefined || obj == null) {
            obj = party;
          }
          return obj
        }
        return party
      },



      getShipmentDetails(id) {
        shipmentDetails(id).then((response) => {
          if (response.data) {

            this.form = Object.assign({}, this.form, response.data);
            if (response.data.siEmail === null) {
              this.$set(this.form, 'siEmail', this.user.email)
            }
            var destinationPorts = this.portOptions.filter(item => item.code == this.form.destinationPort)
            if (destinationPorts.length > 0) {
              this.form.destinationPortStr = destinationPorts[0].name + '(' + destinationPorts[0].code + ')'
            }

            if (this.form.status == 4) {
              this.showSIDraft = true
            }
            this.form.shipmentRouters = response.data.routerDOList;

            this.remainingContainerDOList = this.form.containerDOList.filter(item => item.type != 0)
            // this.form.transportMeanName = this.form.shipmentRouters.filter(item => item.pol == this.form.originPort)[0].transportMeanName
            // this.form.voyage = this.form.shipmentRouters.filter(item => item.pol == this.form.originPort)[0].voyage
            this.form.transportMeanName = this.form.sinotransReceiveRecordDOList.filter(item => item.bkStatus !== 5)[0].vesselName
            this.form.voyage = this.form.sinotransReceiveRecordDOList.filter(item => item.bkStatus !== 5)[0].voyage

            for (var i = 0; i < response.data.containerDOList.length; i++) {
              var d = response.data.containerDOList[i];
              if (d.type == 4 || d.type == 0) {
                this.showSIDraft = true
              } else if (d.type == 1) {
                this.showSIDraft = false
              }
              if ((d.type == 1 && this.form.siDate != null) || d.type == 4) {
                this.form.containers.push(JSON.parse(JSON.stringify(d)))
              } else if (d && d.type == 0
                && response.data.containerDOList.filter(item => (item.type == 1 || item.type == 4)).length == 0) {
                for (var j = 0; j < d.numbers; j++) {
                  this.form.containers.push({
                    containerType: d.containerType,
                    soc: d.soc,
                    containerNo: '',
                    containerSealNumber: '',
                    remark: '',
                    numbersOfPackage: 0,
                    grossWeight: 0,
                    volume: 0,
                    packageType: '',
                    packageMethod: ''

                  });
                }
              }
            }
            for (var i = 0; i < response.data.productDOList.length; i++) {
              var d = response.data.productDOList[i];
              if (d && d.type == 0 && this.form.siDate == null) {
                if (d.hazardousMaterials == "{}" || null == d.hazardousMaterials) {
                  d.dg = 0;
                } else {
                  d.dg = 1;
                }
                d.batteries = Number(d.batteries);
                d.hazardousMaterials = JSON.parse(d.hazardousMaterials);
                d.fileList = [];
                d.uploadData = {};
                this.form.productData.push(JSON.parse(JSON.stringify(d)));
                this.form.productDataBook.push(JSON.parse(JSON.stringify(d)));
              }
            }
            if (this.form.siDate != null || this.form.status == 4) {
              this.form.productData = response.data.productDOList.filter(item => (item.type == 1 || item.type == 4));
              this.form.productDataBook = response.data.productDOList.filter(item => (item.type == 0));

            }
            for (var container of this.form.containers) {
              container.productData = []
              for (var i = 0; i < response.data.productDOList.length; i++) {
                var d = response.data.productDOList[i];
                if (d.containerId != null && d.containerId == container.id) {
                  container.productData.push(d)
                }
              }
              if (container.productData == undefined || container.productData == null || container.productData.length == 0) {
                container.productData = [{}]
              }
            }
            for (var contianer of this.form.containers) {
              contianer.sealNumber = contianer.containerSealNumber
            }


            this.form.containers = JSON.parse(JSON.stringify(this.form.containers))

            // this.selectContainerList = JSON.parse(JSON.stringify(this.form.containers))


            //this.flag

            for (var i = 0; i < this.form.containerDOList.length; i++) {
              if (this.form.containerDOList[i].requireTemperature) {
                this.flag = true
              }
            }
            this.form.shipmentRouters.push({
              pol: response.data.pod,
              etd: null,
              eta: null,
            });

            for (var j = 0; j < this.form.containerDOList.length; j++) {
              if (this.form.containerDOList[j].type == 0) {
                continue
              }
              this.shippedContainer[this.form.containerDOList[j].id] = {
                poNumber: this.form.containerDOList[j].poNumber,
                containerNo: this.form.containerDOList[j].containerNo,
                containerType: this.form.containerDOList[j].containerType,
                departurePod: this.form.containerDOList[j].departurePod,
                arrivalInlandTerminal: this.form.containerDOList[j].arrivalInlandTerminal,
                emptyContainerReturn: this.form.containerDOList[j].emptyContainerReturn,
                containerGateIn: this.form.containerDOList[j].containerGateIn,
                subContainerType: this.form.containerDOList[j].subContainerType,
                containerSealNumber: this.form.containerDOList[j].containerSealNumber,
                remark: this.form.containerDOList[j].remark,
                soc: this.form.containerDOList[j].soc,
                tareWeight: this.form.containerDOList[j].tareWeight,
              };
            }
            this.form.vgmTableData = []
            if (this.form.shipmentVgmDOS.length > 0) {
              for (var vgmData of this.form.shipmentVgmDOS) {

                var obj = JSON.parse(JSON.stringify(vgmData))
                obj.containerType = this.shippedContainer[vgmData.containerId].containerType
                obj.containerNo = this.shippedContainer[vgmData.containerId].containerNo
                obj.containerSealNumber = this.shippedContainer[vgmData.containerId].containerSealNumber
                this.form.vgmTableData.push(obj)
              }
            } else {
              for (var i = 0; i < this.form.containerDOList.length; i++) {
                if (this.form.containerDOList[i].type != 1) {
                  continue
                }
                let sumVgm = 0;
                if (this.form.containerDOList[i] && (this.form.containerDOList[i].grossWeight !== undefined || this.form.containerDOList[i].tareWeight !== undefined)) {
                  const grossWeight = Number(this.form.containerDOList[i].grossWeight) || 0;
                  const tareWeight = Number(this.form.containerDOList[i].tareWeight) || 0;
                  sumVgm = grossWeight + tareWeight;
                }
                this.form.vgmTableData.push({
                  grossWeight: this.form.containerDOList[i].grossWeight,
                  containerId: this.form.containerDOList[i].id,
                  vgmMethod: 'SM2',
                  sign: this.name,
                  weighingTime: new Date().getTime(),
                  containerType: this.form.containerDOList[i].containerType,
                  containerNo: this.form.containerDOList[i].containerNo,
                  containerSealNumber: this.form.containerDOList[i].containerSealNumber,
                  tareWeight: this.form.containerDOList[i].tareWeight,
                  vgm: sumVgm.toFixed(3),
                })

              }
            }
            if (this.form.vgmTableData.length > 0) {
              var vgmData = {}
              vgmData = JSON.parse(JSON.stringify(this.form.vgmTableData[0]))
              if (vgmData.vgmLocation == null) {
                var pols = this.portOptions.filter(item => item.code == this.form.pol)
                if (pols.length > 0) {
                  vgmData.vgmLocation = pols[0].name
                }
              }
              if (vgmData.email == null) {
                vgmData.email = this.user.email
              }
              if (vgmData.sign == null) {
                vgmData.sign = this.user.nickname
              }
              if (vgmData.phone == null) {
                vgmData.phone = this.user.businessPhone
              }
              if (vgmData.weighingTime == null) {
                vgmData.weighingTime = new Date()
              }

              this.$set(this.form, "vgmData", vgmData);
            }

            console.log(response.data.manifestVOs)

            const groupedBySoNumber = response.data.manifestVOs.reduce((acc, manifestVO) => {
              const soNumber = manifestVO.soNumber;
              if (!acc[soNumber]) {
                acc[soNumber] = [];
              }
              acc[soNumber].push(manifestVO);
              return acc;
            }, {});

            this.form.subSoList = []
            for (const soNumber in groupedBySoNumber) {
              console.log(`SO Number: ${soNumber}`);
              var so = {}
              var containers = []
              groupedBySoNumber[soNumber].forEach((manifestVO) => {
                manifestVO.containerSealNumber = manifestVO.sealNumber
                console.log(manifestVO);
                var container = this.form.containers.filter(item => item.containerNo == manifestVO.containerNo)
                if (container.length > 0) {
                  manifestVO.container = JSON.parse(JSON.stringify(container[0]))
                }

                var products = []
                for (var manifestProduct of response.data.manifestProductVOs) {
                  if (manifestProduct.containerId == manifestVO.id) {
                    products.push(JSON.parse(JSON.stringify(manifestProduct)))
                  }
                }
                manifestVO.productData = products

                containers.push(manifestVO)
              });
              so.soNumber = soNumber
              so.containers = JSON.parse(JSON.stringify(containers))
              this.form.subSoList.push(so)
            }
            console.log(this.form.subSoList);

            this.totalRemaining()

            this.$set(this.form, "pol", response.data.pol);
            this.$set(this.form, "pod", response.data.pod);
            this.$set(this.form, "originPort", response.data.originPort);
            this.$set(this.form, "destinationPort", response.data.destinationPort);
            this.form = JSON.parse(JSON.stringify(this.form))

          }
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



      getContainerList() {
        getContainerList().then((response) => {
          this.containerOptions = response.data;
        });
      },


      getPortList() {
        getOriginDeliveryList().then((response) => {
          this.portOptions = response.data;
        });
      },


      remoteGetHsCode(query) {
        if (query !== "" && query.length >= 2) {
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

      //去除中文
      filterChinese(name) {
        return name.replace(/[\u4e00-\u9fa5]/g, '');
      },


      subContainerTypeChange(index, subContainerType) {
        if (this.form.containers[index].containerType !== subContainerType) {
          this.form.containers[index].containerNo = null
        }
      },

      getInputStrClassNumberOfPackages(containerNo) {
        if (this.getByContainerNo(containerNo).numbersOfPackage != 0) {
          return 'Red'
        }
      },

      getInputStrClassGrossWeight(containerNo) {
        if (this.getByContainerNo(containerNo).grossWeight != 0) {
          return 'Red'
        }
      },

      getInputStrClassVolume(containerNo) {
        if (this.getByContainerNo(containerNo).volume != 0) {
          return 'Red'
        }
      },


      getByContainerNo(containerNo) {
        return this.remaining[containerNo]
      },

      numberOfPackagesChange() {
        this.totalRemaining()
      },
      grossWeightChange() {
        this.totalRemaining()
      },
      volumeChange() {
        this.totalRemaining()
      },
      totalRemaining() {
        for (var container of this.form.containers) {

          var numbersOfPackage = container.numbersOfPackage == null ? 0 : container.numbersOfPackage
          var grossWeight = container.grossWeight == null ? 0 : container.grossWeight
          var volume = container.volume == null ? 0 : container.volume

          for (var subSo of this.form.subSoList) {
            for (var tempContainer of subSo.containers) {
              if (tempContainer.containerNo == container.containerNo
                && tempContainer.productData != undefined && tempContainer.productData != '' && tempContainer.productData.length > 0) {
                for (var tempProduct of tempContainer.productData) {
                  numbersOfPackage -= tempProduct.numberOfPackages == null ? 0 : tempProduct.numberOfPackages
                  grossWeight -= tempProduct.grossWeight == null ? 0 : tempProduct.grossWeight.toFixed(4)
                  volume -= tempProduct.volume == null ? 0 : tempProduct.volume.toFixed(4)
                }
              }
            }
          }
          this.remaining[container.containerNo] = {}
          this.remaining[container.containerNo].numbersOfPackage = numbersOfPackage
          this.remaining[container.containerNo].grossWeight = parseFloat(grossWeight.toFixed(3))
          this.remaining[container.containerNo].volume = parseFloat(volume.toFixed(3))
        }
        this.remaining = JSON.parse(JSON.stringify(this.remaining));
        this.$set(this, 'remaining', JSON.parse(JSON.stringify(this.remaining)))
        console.log(this.remaining)
      },


      getContainerTypeCodeList() {
        getContainerTypeCodeList().then((response) => {
          this.containerTypeList = response.data;
        });
      },

      hasDuplicates(array) {
        const seen = new Set();
        for (const item of array) {
          const containerNo = item.containerNo;
          if (seen.has(containerNo)) return true;
          seen.add(containerNo);
        }
        return false;
      },

      addSubSo() {
        this.soNumbersDialogVisible = true

      },
      submitSoNumbers() {

        this.form.subSoList = []
        this.soNumbersDialogVisible = false
        if (this.soNumbers == 1) {
          var tempContainers = []

          this.form.subSoList.push({
            soNumber: this.form.shipmentBookingNumber,
            containers: JSON.parse(JSON.stringify(this.form.containers))
          });

        } else {
          for (let i = 0; i < this.soNumbers; i++) {
            this.form.subSoList.push({
              soNumber: this.generateNumbers(this.form.shipmentBookingNumber, this.form.subSoList.length),
              containers: [
                {
                  productData: [{}],
                }
              ]
            });
          }
        }
        this.totalRemaining()

      },
      generateNumbers(start, count) {
        const lastChar = start[start.length - 1];
        if (lastChar == 'a' || lastChar == 'A') { // MSCU 177LBRBRN7B981A  ONEY DACC04135300 MSCU 177WWYWYQ23014FB
          if (count == 0) {
            return start
          }
        }
        if (lastChar == 'b' || lastChar == 'B') {
          if (count == 0) {
            return start
          }
          count = count + 1;
          start = start.substr(0, start.length - 1);
        }
        if (lastChar == 'c' || lastChar == 'C') {
          if (count == 0) {
            return start
          }
          count = count + 2;
          start = start.substr(0, start.length - 1);
        }
        if (lastChar == 'd' || lastChar == 'D') {
          if (count == 0) {
            return start
          }
          count = count + 3;
          start = start.substr(0, start.length - 1);
        }
        let result = [];
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        if (this.form.carrier == 'ONEY') {
          const letters = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26'];
        }
        const letterIndex = count % letters.length;
        return start + letters[letterIndex];
      },
      addContainers(data) {
        if (data == undefined || data == null) {
          data = []
        }
        data.push({ productData: [{}] });
      },
      addProduct(data) {
        data.push({});
      },
      changeContainer(row, containerNo) {
        if (containerNo == '') {
          row.containerNo = ''
          row.containerSealNumber = ''
          row.containerType = ''
          row.productData = [{}]
          return
        }
        var container = this.selectContainerList.filter(item => item.containerNo == containerNo)[0]
        row.containerNo = container.containerNo
        row.containerSealNumber = container.containerSealNumber
        row.containerType = container.containerType
        row.productData = [{}]

        this.totalRemaining()
      },
      changeProduct(row, productId, containerNo) {

        if (productId == '') {
          row.productEnglishName = ''
          row.hscode = ''
          row.numberOfPackages = ''
          row.packages = ''
          row.grossWeight = ''
          row.volume = ''
          return
        }

        var product = this.selectProductDic[containerNo].filter(item => item.id == productId)[0]
        row.productEnglishName = product.productEnglishName
        row.hscode = product.hscode
        row.numberOfPackages = product.numberOfPackages
        row.packages = product.packages
        row.grossWeight = product.grossWeight
        row.volume = product.volume

        this.totalRemaining()
      },

      handleDeleteSubSo(index) {
        this.form.subSoList.splice(index, 1);
        this.totalRemaining()
      },

      handleDeleteContainer(containers, index) {
        containers.splice(index, 1);
        this.totalRemaining()
      },
      handleDeleteProduct(data, index) {
        data.splice(index, 1);
        this.totalRemaining()
      },
      clearContainer(containers, index) {
        containers[index] = {
          productData: [{}],
        }
        this.totalRemaining()
        this.form = JSON.parse(JSON.stringify(this.form))
      },
      clearProduct(row) {

        this.totalRemaining()
      },
      sum(item) {
        item.vgm = Number(item.grossWeight) + Number(item.tareWeight)
      },
      submit() {


        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (this.form.subSoList.length <= 0) {
              this.$notify.error("Please Create Sub SO Number")
              return
            }

            var productData = JSON.parse(JSON.stringify(this.form.productData.filter(item => item.containerId == null)))
            var product = {}
            product.products = JSON.stringify(productData)
            product.shipmentId = this.form.id
            submitProductNonContainer(product).then((res) => {
            })


            this.loadingSaveBut = true
            var data = JSON.parse(JSON.stringify(this.form));

            data.containers = JSON.stringify(data.containers);
            var form = {}
            for (var item of data.vgmTableData) {
              item.vgmParty = this.form.vgmData.vgmParty
              item.sign = this.form.vgmData.sign
              item.email = this.form.vgmData.email
              item.phone = this.form.vgmData.phone
              item.vgmLocation = this.form.vgmData.vgmLocation
            }
            form.vmg = JSON.stringify(data.vgmTableData)
            form.shipmentId = this.form.id
            form.noVgmEdi = this.form.noVgmEdi
            // Contact Info  合并进去
            form.name = this.form.name
            form.phone = this.form.phone
            form.fax = this.form.fax
            form.fixedPhone = this.form.fixedPhone
            form.email = this.form.email
            form.siEmail = this.form.siEmail
            form.shipper = this.form.shipper
            form.consignee = this.form.consignee
            form.notifyParty = this.form.notifyParty
            form.pushVgm = this.form.pushVgm
            submitSinotransVGMAPI(form).then((res) => {
              //Cargo Manifest 提交
              var manifest = {}
              manifest.shipmentId = this.form.id
              var containers = []
              var products = []
              console.log(this.form.subSoList)
              for (var mani of this.form.subSoList) {
                for (var container of mani.containers) {
                  container.soNumber = mani.soNumber
                  container.sealNumber = container.sealNumber
                  containers.push(container)
                  for (var maniProduct of container.productData) {
                    maniProduct.soNumberAndContainerNo = container.soNumber + '-' + container.containerNo
                    products.push(maniProduct)

                  }
                }
              }
              manifest.containers = JSON.stringify(containers)
              manifest.products = JSON.stringify(products)
              submitManifest(manifest).then((res) => {
                this.$router.push("/shipment/detail?id=" + this.form.id);
              })
            })
          } else {
            return false;
          }
        });
      },

      beforeUploadManifest(file) {
        console.log(file)
        var vm = this
        var units = this.getDictDatas(this.DICT_TYPE.SYSTEM_UNITS);
        this.file2Xce(file).then(tabJson => {
          if (tabJson && tabJson.length > 0 && tabJson[0].sheet.length > 0) {
            console.log('11111111111')

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

            console.log(listTable)
            const groupedData = listTable.reduce((acc, item) => {
              const soNumber = item['SO Number'];
              const containerNo = item['Container No'];
              const containerType = item['Container Type'];
              const sealNumber = item['Seal Number'];
              const remark = item['Marks&Numbers'];
              var excelUnit = item['Package Type']
              var packageType = ''
              if (excelUnit != null) {
                for (var unit of units) {
                  if (unit.label == excelUnit.toUpperCase() || unit.value == excelUnit.toUpperCase()) {
                    packageType = unit.value
                  }
                }
              }



              // 初始化 SO Number
              if (!acc[soNumber]) {
                acc[soNumber] = {
                  soNumber: soNumber,
                  containers: []
                };
              }

              // 初始化 Container No
              let container = acc[soNumber].containers.find(c => c.containerNo === containerNo);
              if (!container) {
                container = {
                  containerNo: containerNo,
                  containerType: containerType,
                  sealNumber: sealNumber,
                  remark: remark,
                  productData: []
                };
                acc[soNumber].containers.push(container);
              }

              // 添加产品数据
              container.productData.push({
                productEnglishName: item['Product Name'],
                hscode: item['HS code'],
                numberOfPackages: item['Number Of Packages'],
                packages: packageType,
                grossWeight: item['Gross Weight(KG)'],
                volume: item['Volume(CBM)']
              });

              return acc;
            }, {});
            console.log(groupedData);

            // 将结果转换为数组
            const result = Object.values(groupedData);

            console.log(result);

            vm.form.subSoList = result
            this.totalRemaining()
            this.$refs.upload.clearFiles();
          }
        })
      },

      downloadImportTemplate() {
        downloadManifestTemplate({ shipmentId: this.$route.query.id }).then((res) => {
          this.$download.excel(res, "import_template_manifest.xlsx");
        })
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

    },
  };
  // 自定义函数用于验证电子邮件地址
  function isValidEmailAddress(email) {
    // 自定义验证逻辑
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
</script>
