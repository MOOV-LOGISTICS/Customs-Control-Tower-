<template>
  <div>
    <el-dialog :title="title" @close="handleClose" class="order-popup" :visible.sync="formVisible" width="90%">
      <el-form ref="form" :model="form" :show-message="false" v-loading="loading">

        <el-upload v-if="showEdit" style="display:inline-block;padding-right: 10px;"
              class="upload-demo"
              ref="upload"
              action="#"
              accept=".xlsx,.xls"
              :auto-upload="false"
              :on-change="skuUpload"
              :show-file-list="false"
              :limit="1"
              >
              <el-button class="el-icon-upload2" type="primary"> Upload</el-button>
              <el-button @click="downloadTemplate" style="margin-bottom: 10px;" icon="el-icon-download">Download Template</el-button>
        </el-upload>

        <el-table
          :data="form.itemResList"
          show-summary
          :summary-method="getSummaries"
          max-height="400"
          border
          style="width: 100%">
          <el-table-column prop="orderNumber"  label="Order Number" min-width="110">
            {{ form.orderNumber }}
          </el-table-column>
          <el-table-column prop="productCode"  label="SKU" min-width="110">
          </el-table-column>
          <el-table-column prop="hsCode" label="HS Code" min-width="110">
          </el-table-column>
          <el-table-column prop="requested" label="Ordered Quantity" min-width="110">
          </el-table-column>
          <el-table-column prop="requestUnit" label="Unit" min-width="110">
            <template v-slot="scope">
                        {{ scope.row.requestUnit }}
          </template>
          </el-table-column>
            <el-table-column
            min-width="110"
                      prop="innerWeight"
                      label="Inner Weight(Per CARTON)">
                      <template v-slot="scope">
                        {{ scope.row.innerWeight }}
                      </template>
           </el-table-column>
            <el-table-column
            min-width="110"
                      prop="outerWeight"
                      label="Outer Weight(Per CARTON)">
                      <template v-slot="scope">
                        {{ scope.row.outerWeight }}
                      </template>
           </el-table-column>
           <el-table-column prop="weightUnit" label="Unit(KG)" min-width="110">
          </el-table-column>
          <el-table-column prop="length1"
          label="Length"
          min-width="110">
          <template v-slot="scope">
                        {{ scope.row.length1 }}
          </template>
          </el-table-column>
          <el-table-column prop="width1"
          label="Width"
          min-width="110">
          <template v-slot="scope">
                        {{ scope.row.width1 }}
           </template>
          </el-table-column>
          <el-table-column prop="height1"
          label="Height"
          min-width="110">
          <template v-slot="scope">
                        {{ scope.row.height1 }}
           </template>
          </el-table-column>
          <el-table-column prop="sizeUnit" label="Unit(CM)" min-width="110">
          </el-table-column>
        </el-table>
      </el-form>
      <div v-if="showEdit" slot="footer" class="dialog-footer">
          <el-button @click="handleClose">Cancel</el-button>
          <el-button type="primary" @click="submit">Submit</el-button>
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

    </div>
  </template>

  <script>
import { downloadKaemingkTemplate,getHeaderApiByOrderId,updateKaemingk } from "@/api/order/header";
import { DICT_TYPE, getDictDatas } from "@/utils/dict";
import XLSX from "xlsx";
import { getTaskList } from "@/api/order/task";
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数

  export default {
    props: {
      orderId: {
        type: Number,
        default: null
      },
      view: {
        type: Boolean,
        default: null
      },
      type: {
        type: Number,
        default: null
      },
    },
    data() {
      return {
        uploadError:{
        title: "Errors",
        dialogVisible: false,
        data: ""
      },
        loading:true,
        form:{
          itemResList:[],
        },
        formVisible:true,
        unitsMap:{},
        unitsMap1:{},
        skuFileList:[],
        uploadFile:null,
        fileList: [],
        deletcFileList: [],
        height: '50px',

        title: '',
        task:null,
        showEdit:false,
      };
    },
    mounted() {
      this.title = "PO Upload"

      const clientHeight = document.documentElement.clientHeight;
      this.height = clientHeight - 298;
      if(this.orderId!=null&&this.orderId!=0) {
        this.getHeaderApiByOrderId(this.orderId);
      }
      var units = getDictDatas(DICT_TYPE.SYSTEM_UNITS);
        for(var unit of units) {
            this.unitsMap[unit.value] = unit.label
            this.unitsMap1[unit.label] = unit.value
        }
    },
    methods: {
      checkPermi,
      checkRole,
      handleClose() {
        this.$emit('close-order-popup');
      },

    getHeaderApiByOrderId(id) {
      getHeaderApiByOrderId(id).then((response) => {
        this.form = JSON.parse(JSON.stringify(response.data));

        console.log(this.form)
        this.loading = false
        getTaskList({orderNumber:response.data.orderNumber,status:1,type:1}).then((res)=>{
           if(res.data.length>0){
            console.log(res.data)
             this.task = res.data[0]
             console.log(this.task)
             if (this.checkPermi(['order:header:edit'])&&this.task.seq!=5) {
              this.showEdit = true
             }
           }
        });


      });
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
	    skuUpload(file){
        console.log(file)
        this.uploadFile = file;
	        var vm = this;
            this.file2Xce(file).then(tabJson => {
                if (tabJson && tabJson.length > 0) {
                    this.xlsxJson = tabJson
                    console.log(tabJson)
                    vm.form.itemResList = []
                    var units = getDictDatas(DICT_TYPE.SYSTEM_UNITS);
                    for(var i=0;i<this.xlsxJson[1].sheet.length;i++){
                        var index=i
                        var item=this.xlsxJson[1].sheet[i]

                        var errData={}
                        errData['index']  = index
                        vm.form.itemResList[index] = {}
                        vm.form.itemResList[index]['orderNumber'] = item['Order Number']
                        vm.form.itemResList[index]['productCode'] = item['SKU']
                        vm.form.itemResList[index]['hsCode'] = item['HS CODE']
                        vm.form.itemResList[index]['requested'] = item['Ordered Quantity']
                        var excelUnit = item['Unit']
                        for(var unit of units) {
                          if(unit.label==excelUnit.toUpperCase()||unit.value==excelUnit.toUpperCase()) {
                            item.requestUnit = unit.value;
                          }
                        }
                        vm.form.itemResList[index]['requestUnit'] = item.requestUnit
                        vm.form.itemResList[index]['innerWeight'] = item['Inner Weight(Per CARTON)']
                        vm.form.itemResList[index]['outerWeight'] = item['Outer Weight(Per CARTON)']
                        vm.form.itemResList[index]['weightUnit'] = item['Unit(KG)']
                        vm.form.itemResList[index]['length1'] = item['Length']
                        vm.form.itemResList[index]['width1'] = item['Width']
                        vm.form.itemResList[index]['height1'] = item['Height']
                        vm.form.itemResList[index]['length'] = item['Length']
                        vm.form.itemResList[index]['width'] = item['Width']
                        vm.form.itemResList[index]['height'] = item['Height']
                        vm.form.itemResList[index]['sizeUnit'] = item['Unit(CM)']
                    }
                    console.log(vm.form.itemResList)
                }
            })
            this.$refs.upload.clearFiles();
	    },
    downloadTemplate(){
      downloadKaemingkTemplate().then((response) => {
          this.$download.excel(response, "PO Upload TempLate.xlsx");
       });
    },
    submit() {
			var vm = this
      this.$refs["form"].validate(valid => {
        console.log(valid)
        if (!valid) {
          return;
        }
        if(this.uploadFile==null) {
          this.$modal.msgError('Please Upload File');
          return;
        }

        const formData = new FormData();
        formData.append("orderNumber", vm.form.orderNumber);
        formData.append("file", this.uploadFile.raw, this.uploadFile.name)
        console.log('formData')
        console.log(formData)
        vm.loading = true
        updateKaemingk(formData).then(response => {
          vm.loading = false
          let data = response.data.failureOrderNumber;
          if (data.length > 0) {
            this.uploadError.data = data
            this.uploadError.dialogVisible = true
          } else {
            vm.fileList = [];
            vm.deletcFileList = [];
            vm.$emit('close-order-popup');
          }
        });

      });

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
                || column.property =='length1' || column.property =='width1' || column.property =='height1' ) {
                    sums[index] = ' ';
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



    },
  };
  </script>

  <style scoped>

  </style>
