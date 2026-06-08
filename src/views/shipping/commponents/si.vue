<template>
  <div style="background:#fff!important;padding: 10px;">
    <div :style="{'height':height+'px'}" v-loading="loading">
      <el-form :disabled="shipment.siDate!=null" ref="form" label-width="210px" :model="siForm" label-position="right"
        :show-message="false">

            <div class="el-descriptions__title" style="font-size:20px;margin-bottom:10px;font-size:20px">
              <el-upload style="display:inline-block;padding-right: 10px;padding-left: 10px;" class="upload-demo"
                ref="upload" action="#" accept=".xlsx,.xls" :auto-upload="false" :on-change="containersUpload"
                :show-file-list="false" :limit="1">
                <el-button size="mini" type="text"><i class="el-icon-plus"></i>Upload</el-button>
              </el-upload>
              <el-button @click="downloadTemplate" size="mini" type="text"><i class="el-icon-plus"></i>Download
                Template</el-button>
              <el-button @click="applyNewHsCode" size="mini" type="text"><i class="el-icon-plus"></i>Request new HS
                code</el-button>
            </div>

            <el-scrollbar :style="{'height':height-80+'px'}">
              <!-- default-expand-all -->
              <el-table border :data="siForm.containers" style="width: 100%;">
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <div style="margin-left:50px">
                      <el-descriptions style="margin-bottom:0px;box-shadow: none!important;border:none!important"
                        :colon="false" direction="vertical" v-for="(item, index) in scope.row.productData"
                        :key="'product' + index" class="margin-top" title="" :column="7">
                        <el-descriptions-item :label="index == 0 ? $t('booking.productEnglishName') : ''">
                          <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                            :prop="'containers.' + scope.$index + '.productData.' + index + '.productEnglishName'">
                            <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2 }"
                              v-model="item.productEnglishName" maxlength="500" show-word-limit
                              @input="item.productEnglishName = filterChinese(item.productEnglishName)" />
                          </el-form-item>
                        </el-descriptions-item>
                        <el-descriptions-item :label="index == 0 ? $t('booking.hsCode') : ''">
                          <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                            :prop="'containers.' + scope.$index + '.productData.' + index + '.hscode'">
                            <el-select filterable clearable remote v-model="item.hscode"
                              :remote-method="remoteGetHsCode" @change="selectBlur(item)">
                              <el-option v-for="dict in hsCodeList" :key="dict.hsCode" :label="dict.hsCode"
                                :value="dict.hsCode" />
                            </el-select>
                          </el-form-item>
                        </el-descriptions-item>
                        <el-descriptions-item :label="index == 0 ? 'Number Of Packages' : ''">
                          <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                            :prop="'containers.' + scope.$index + '.productData.' + index + '.numberOfPackages'">
                            <el-input-number v-model="item.numberOfPackages" :controls="false" :precision="0" />
                          </el-form-item>
                        </el-descriptions-item>
                        <el-descriptions-item :label="index == 0 ? 'Packages' : ''">
                          <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                            :prop="'containers.' + scope.$index + '.productData.' + index + '.packages'">
                            <el-select filterable v-model="item.packages" placeholder="">
                              <el-option v-for="dict in getDictDatas(DICT_TYPE.SYSTEM_UNITS)" :key="dict.value"
                                :label="dict.label" :value="dict.value" />
                            </el-select>
                          </el-form-item>
                        </el-descriptions-item>
                        <el-descriptions-item :label="index == 0 ? 'Gross Weight(KG)' : ''">
                          <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                            :prop="'containers.' + scope.$index + '.productData.' + index + '.grossWeight'">
                            <el-input-number v-model="item.grossWeight" :precision="3" :controls="false" />
                          </el-form-item>
                        </el-descriptions-item>
                        <el-descriptions-item :label="index == 0 ? 'Volume(CBM)' : ''">
                          <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                            :prop="'containers.' + scope.$index + '.productData.' + index + '.volume'">
                            <el-input-number v-model="item.volume" :precision="3" :controls="false" />
                          </el-form-item>
                        </el-descriptions-item>
                        <el-descriptions-item>
                          <template slot="label">
                            <el-button v-if="index == 0" type="text" @click="addProduct2(scope.row.productData)"><i
                                class="el-icon-plus"></i>Add
                              Product</el-button>
                          </template>
                          <el-button size="mini" v-if="index != 0" type="text" icon="el-icon-delete"
                            @click="handleDeleteProduct(scope.row.productData, index)">{{ $t("search.delete") }}</el-button>
                        </el-descriptions-item>
                      </el-descriptions>
                      <div style="width:100%;margin:10px ">
                        <el-row>
                          <el-col :span="6">
                            <b>Total Gross Weight:</b>
                            {{ scope.row.productData.reduce((sum, item) => sum + (Number(item?.grossWeight) || 0),
                            0).toFixed(3) }}
                          </el-col>
                          <el-col :span="6">
                            <b>Total CBM:</b>
                            {{ scope.row.productData.reduce((sum, item) => sum + (Number(item?.volume) || 0),
                            0).toFixed(3)
                            }}
                          </el-col>
                          <el-col :span="6">
                            <b>Total Number of Packages:</b>
                            {{ scope.row.productData.reduce((sum, item) => sum + (Number(item?.numberOfPackages) || 0),
                            0)
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
                <el-table-column label="Sub Container Type">
                  <template v-slot="scope">
                    <el-select v-model="scope.row.subContainerType" clearable filterable
                      @change="(value) => subContainerTypeChange(i, value)">
                      <el-option v-for="item in containerTypeList" :label="item.type" :value="item.type"
                        :key="item.type"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="Container No.">
                  <template v-slot="scope">
                    <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                      :prop="'containers.' + scope.$index + '.containerNo'">
                      <el-input v-model="scope.row.containerNo" />
                    </el-form-item>
                  </template>

                </el-table-column>
                <el-table-column label="Container Seal Number">
                  <template v-slot="scope">
                    <el-form-item label-width="0px" style="margin-bottom: 0px!important;" required
                      :prop="'containers.' + scope.$index + '.containerSealNumber'">
                      <el-input v-model="scope.row.containerSealNumber" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="Marks&Numbers">
                  <template v-slot="scope">
                    <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2 }" placeholder="Marks&Numbers"
                      v-model="scope.row.remark" />
                  </template>
                </el-table-column>
              </el-table>
              <div style="width:100%;margin: 20px;">
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

            </el-scrollbar>
                <div style="text-align: center;margin-bottom: 10px;margin-top: 10px;">
                  <el-button v-if="shipment.siDate==null" @click="submit" type="primary">Submit</el-button>
                </div>
      </el-form>



    </div>


    <el-dialog title="Import Container No Failed" :visible.sync="errorDialog" append-to-body>
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

    <el-dialog title="Import HS code Failed" :visible.sync="checkHsCodeDialog" append-to-body>
      <el-table :data="hsCodeData">
        <el-table-column property="hsCode" label="HS code" width="200">
          <template slot-scope="scope">
            {{ hsCodeData[scope.$index] }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="Request new HS code" width="500px" :visible.sync="applyHsCodeVisable" append-to-body>
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

  </div>



</template>

<script>
  import { draftSI, downloadContainersTemplate } from "@/api/shipment/shipment";
  import { getContainerTypeCodeList } from "@/api/system/containerTypeCode";
  import { getHsCodeListByCode, getDataByHsCodes, applyNewHsCode } from "@/api/system/hsCode";
  import { getContainerNoByNoAndType, checkDataByNoAndType } from "@/api/system/containerNo";
  import XLSX from "xlsx";
  import { getList } from "@/api/shipment/shipment";

  export default {
    name: "SI",
    components: {},
    props: {
      height: {
        type: Number
      },
      shipmentId: {
        type: Number
      },
    },
    data() {
      return {
        loading: false,
        siForm: {
          containers: []
        },
        hsCodeList: [],
        containerTypeList: [],
        changeContainer: {},
        containerOptions: [],
        containersHeaders: [
          "Sub Container Type",
          "Container Type",
          "Container No",
          "Container Seal Number",
          "Marks&Numbers",
          "Tare Weight",
          "Product Name",
          "HS code",
          "Number Of Packages",
          "Packages",
          "Gross Weight(KG)",
          "Volume(CBM)"
        ],
        checkLoading: false,
        errorDialog: false,
        gridData: [],
        checkHsCodeDialog: false,
        hsCodeData: [],
        hsCode: {},
        applyHsCodeVisable: false,
        shipment: {},

      };
    },
    mounted() {

      this.loading = true
      getList({ ids: this.shipmentId }).then((response) => {
        this.loading = false
        for (var i = 0; i < response.data.length; i++) {
          this.shipment = response.data[i]
        }
        this.siForm.id = this.shipment.id
        this.getContainerTypeCodeList()
        for (var i = 0; i < this.shipment.containerDOList.length; i++) {
          if (this.shipment.containerDOList[i].type == 0) {
            console.log(this.shipment.containerDOList[i].numbers)
            for (var j = 0; j < this.shipment.containerDOList[i].numbers; j++) {
              this.siForm.containers.push({
                containerType: this.shipment.containerDOList[i].containerType,
                productData: [{}]
              })
            }
          }
        }
        this.setData(4)
        this.setData(1)
      });

    },

    methods: {

      setData(type) {
        var draftContainers = this.shipment.containerDOList.filter(
          (item) => item.type == type
        );
        if (draftContainers.length > 0) {
          var res = []
          for (var i = 0; i < draftContainers.length; i++) {

            var obj = JSON.parse(JSON.stringify(draftContainers[i]))
            var products = JSON.parse(JSON.stringify(this.shipment.productDOList.filter(item => item.shipmentId == this.shipment.id && item.containerId == obj.id)))

            obj.productData = products
            if (obj.productData.length == 0) {
              this.addProduct2(obj.productData)
            }
            obj.id = null;
            obj.type = null;
            res.push(obj)
          }
          this.siForm.containers = res
          console.log(this.siForm.containers)
        }
      },
      addProduct2(data) {
        data.push({});
      },
      handleDeleteProduct(data, index) {
        data.splice(index, 1);
      },
      getContainerTypeCodeList() {
        getContainerTypeCodeList().then((response) => {
          this.containerTypeList = response.data;
        });
      },
      submit() {
        console.log('111111111')
        this.$refs['form'].validate((valid) => {
          if (valid) {


            

            draftSI(this.siForm).then((res) => {
              this.loading = false
              this.$emit('after-submit');
            })





          } else {
            console.log(valid)
            console.log('error submit!!');
            var arr = this.$refs['form'].fields.filter(item => item.validateState == 'error')
            console.log(arr[0])
            if (arr[0].validateMessage.indexOf('containers') > -1) {
              this.activeName = 'sencod'
            } else {
              this.activeName = 'first'
            }
            return false;
          }
        });
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

      containersUpload(file) {
        console.log(11111111)
        var vm = this
        this.file2Xce(file).then(tabJson => {
          if (tabJson && tabJson.length > 0 && tabJson[0].sheet.length > 0) {
            var errorList = []
            var listTable = []
            vm.checkLoading = true;
            const keyList = Object.keys(tabJson[0].sheet[0]);

            console.log(keyList)

            //check key
            for (var i = 0; i < this.containersHeaders.length; i++) {
              if (this.containersHeaders[i] !== 'Sub Container Type' && !keyList.includes(this.containersHeaders[i])) {
                errorList.push(this.containersHeaders[i])
                break
              }
            }
            console.log(222222222)
            console.log(errorList)

            if (errorList.length > 0) {
              vm.$notify({
                title: 'Warning',
                message: errorList + " does not exist, Please use the import template to import",
                type: 'warning'
              });
              vm.checkLoading = false;
              return
            }
            //get data
            tabJson[0].sheet.forEach((item, index, key) => {
              listTable.push(item);
            }
            )
            console.log(listTable)

            //copy value
            const groupedData = {};
            listTable.forEach((item, index) => {
              const groupKey = `${item["Container Type"]}-${item["Container No"]}`;
              if (!groupedData[groupKey]) {
                groupedData[groupKey] = {
                  "containerType": item["Container Type"],
                  "containerNo": item["Container No"],
                  "subContainerType": item["Sub Container Type"],
                  "containerSealNumber": item["Container Seal Number"],
                  "remark": item["Marks&Numbers"],
                  "tareWeight": item["Tare Weight"],
                  "productData": []
                };
              }
              const productDataItem = {};
              // Copy the necessary properties to productDataItem
              productDataItem["productEnglishName"] = item["Product Name"];
              productDataItem["hscode"] = item["HS code"];
              productDataItem["numberOfPackages"] = item["Number Of Packages"];
              productDataItem["packages"] = item["Packages"];
              var packagesList = this.getDictDatas(this.DICT_TYPE.SYSTEM_UNITS)
              var unitsFlag = false
              for (var i = 0; i < packagesList.length; i++) {
                unitsFlag = false
                if (packagesList[i].label == productDataItem["packages"]) {
                  productDataItem["packages"] = packagesList[i].value
                  unitsFlag = true
                  break
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
            console.log(groupedArray)
            console.log(vm.shipment.carrier)

            if (vm.shipment.carrier == 'TSHG') {
              //Check containerNo,hsCode
              vm.checkTSHGData(groupedArray)
            } else {
              vm.pushData(groupedArray);
            }

          }
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
        console.log(queryList)

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
          console.log(hsCodeErrorList)

          if (hsCodeErrorList.length > 0) {
            vm.hsCodeData = hsCodeErrorList
            vm.checkHsCodeDialog = true;
            vm.checkLoading = false;
            return
          }
          vm.pushData(groupedArray);
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
        vm.checkLoading = false;
      },

      downloadTemplate() {
        downloadContainersTemplate({ 'shipmentId': this.shipment.id }).then((res) => {
          this.$download.excel(res, "import_template_containers.xlsx");
        })
      },
      subContainerTypeChange(index, subContainerType) {
        if (this.siForm.containers[index].containerType !== subContainerType) {
          this.siForm.containers[index].containerNo = null
        }
      },
      handleContainerChange(item) {
        this.changeContainer = item
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


    },
  };
</script>
