<template>
    <el-dialog :title="title" @close="handleClose" class="book-popup" :visible.sync="formVisible" width="90%">
      <el-form ref="form" :model="form" :show-message="false" v-loading="loading">
        <el-row>
          <el-col :span="11">
            <el-form-item required prop="warehouseName" label="Inbound Warehouse" label-width="180px">
              <el-select v-model="form.warehouseName">
                <el-option v-for="item in warehouseList" :label="item.warehouseName" :value="item.warehouseName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="inboundTime" label="Requested inbound date"  label-width="180px" style="margin-left: 20px;">
              <el-date-picker
                v-model="form.inboundTime"
                type="date">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item required prop="dangerous" label="Contains Batteries" label-width="180px">
              <el-select v-model="form.dangerous">
                <el-option label="Yes" value="Yes" />
                <el-option label="No" value="No" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <div style="padding: 10px;">
              <el-checkbox v-model="form.factoryConfirm">Confirm cargo have been packed according to inner/outer instructions</el-checkbox>
            </div>
          </el-col>
        </el-row>
        <el-form-item label="Files"label-width="160px">

          <el-upload ref="uploadDocument"
                        drag
                        :multiple="true"
                        :limit="5"
                        action="#"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        :file-list="fileList"

                        :auto-upload="true"
                        :http-request="uploadFile"

                        :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess"
                        :disabled="uploadDocument.isUploading"
                    >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                      {{ $t("purchaseOrder.DragTheFileHereOr")
                      }}<em>{{ $t("purchaseOrder.clickUpload") }}</em>
                    </div>
            </el-upload>
        </el-form-item>
        <el-upload  style="display:inline-block;padding-right: 10px;"
              class="upload-demo"
              ref="upload"
              action="#"
              accept=".xlsx,.xls"
              :auto-upload="false"
              :on-change="skuUpload"
              :show-file-list="false"
              :file-list="skuFileList">
              <el-button class="el-icon-upload2" type="primary"> Upload</el-button>
        </el-upload>
        <el-button @click="downloadTemplate" style="margin-bottom: 10px;" icon="el-icon-download">Download Template</el-button>
        <el-table
          :data="form.itemResList"
          show-summary
          :summary-method="getSummaries"
          max-height="400"
          border
          style="width: 100%">
          <el-table-column prop="productCode"  label="SKU" width="70">
          </el-table-column>
          <el-table-column prop="productName" label="Line Description" width="100">
          </el-table-column>
          <el-table-column prop="hsCode" label="HS Code" width="80">
          </el-table-column>

 <el-table-column  prop="PIECESOrdered" width="110" label="Ord. Qty">
<template slot-scope="scope">
{{Math.ceil(scope.row[scope.row.requestUnit+'Ordered']) +' '+ scope.row.requestUnit}}
</template>
</el-table-column>
<el-table-column  prop="CTNSOrdered" width="110" label="Ord. Qty">
<template slot-scope="scope">
{{Math.ceil(scope.row['CTNS'+'Ordered']) +' '+ 'CTNS'}}
</template>
</el-table-column>
<el-table-column v-if="unitLabelsShow"  prop="INNER BOXOrdered" width="110" label="Ord. Qty">
<template slot-scope="scope">
{{Math.ceil(scope.row['INNER BOX'+'Ordered']) +' '+ 'INNER BOX'}}
</template>
</el-table-column>

<el-table-column  prop="PIECESBooked" width="150" label="Booked Qty">
<template slot-scope="scope">
  <el-input  :class="getInputStrClass(scope.row,scope.row.bookedUnit)"  @change="setItem(scope.$index,scope.row.bookedUnit)" size="mini"  @input="changeBookedQty(scope.row)"
                    v-model="scope.row[scope.row.bookedUnit+'Booked']"
                    >
                    <i slot="suffix" style="font-style:normal;margin-right: 10px; line-height: 30px; color: #1e1e1e">{{scope.row.bookedUnit}}</i>
                  </el-input>
</template>
</el-table-column>
<el-table-column  prop="CTNSBooked" width="110" label="Booked Qty">
<template slot-scope="scope">
{{Math.ceil(scope.row['CTNS'+'Booked']) +' '+ 'CTNS'}}
</template>
</el-table-column>
<el-table-column v-if="unitLabelsShow" prop="INNER BOXBooked" width="110" label="Booked Qty">
<template slot-scope="scope">
{{Math.ceil(scope.row['INNER BOX'+'Booked']) +' '+ 'INNER BOX'}}
</template>
</el-table-column>


            <el-table-column
                      width="65"
                      prop="innerWeight"
                      label="Inner Wgt.">
                      <template v-slot="scope">
                        {{ scope.row.innerWeight }}
                      </template>
           </el-table-column>
            <el-table-column
                      width="70"
                      prop="outerWeight"
                      label="Outer Wgt.">
                      <template v-slot="scope">
                        {{ scope.row.outerWeight }}
                      </template>
           </el-table-column>

          <el-table-column prop="totalWeight"
          label="Outer Wgt."
          width="70">
            <template v-slot="scope">
              {{calculateWeight(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column prop="length1"
          label="L(CM)"
          width="50">
          <template v-slot="scope">
                        {{ scope.row.length1 }}
          </template>
          </el-table-column>
          <el-table-column prop="width1"
          label="W(CM)"
          width="50">
          <template v-slot="scope">
                        {{ scope.row.width1 }}
           </template>
          </el-table-column>
          <el-table-column prop="height1"
          label="H(CM)"
          width="50">
          <template v-slot="scope">
                        {{ scope.row.height1 }}
           </template>
          </el-table-column>
          <el-table-column prop="totalVolume" label="Volume(CBM)" width="85">
            <template v-slot="scope">
              {{calculateVolume(scope.row)}}
            </template>
          </el-table-column>

          <el-table-column prop="remark" label="Remark">
            <template slot-scope="scope">
            <el-input v-model="scope.row.remark"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div v-show="type==1&&showEdit" slot="footer" class="dialog-footer">
          <el-button @click="handleClose">Cancel</el-button>
          <el-button type="primary" @click="submit">Submit</el-button>
      </div>
      <div v-show="type==2&&!view" slot="footer" class="dialog-footer">
          <el-button type="warning" @click="handleReject">Reject</el-button>
          <el-button type="success" @click="handleApprove">Approve</el-button>
      </div>

    </el-dialog>
  </template>

  <script>
import { getWarehousePage } from "@/api/system/warehouse";
import { downloadBookTemplate,uploadBookFiles } from "@/api/order/item";
import { getProductPage } from "@/api/system/product";
import { getHeaderApiByOrderId,getInboundFilesById } from "@/api/order/header";
import { listByProductIds } from "@/api/system/unitConversion";
import { DICT_TYPE, getDictDatas } from "@/utils/dict";
import XLSX from "xlsx";
import { getTaskList,updateTask } from "@/api/order/task";
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数
import { getUserProfile } from "@/api/system/user";

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
        loading:true,
        form:{
          itemResList:[],
        },
        formVisible:true,
        warehouseList:[],
        productList:[],
        unitsMap:{},
        unitsMap1:{},
        unitLabelsShow:false,
        skuFileList:[],

        uploadDocument:{
            // 是否禁用上传
            isUploading: false,
        },
        fileList: [],
        deletcFileList: [],
        height: '50px',

        title: '',
        tasks:[],
        showEdit:false,
      user: {},

      };
    },
    mounted() {
      if(this.type==1) {
        this.title = "Inbound Order"
      } else if(this.type==2) {
        this.title = "Inbound Order Verification"
      }
      const clientHeight = document.documentElement.clientHeight;
      this.height = clientHeight - 298;
      this.getWarehousePage();
      if(this.orderId!=null&&this.orderId!=0) {
        this.getHeaderApiByOrderId(this.orderId);
      }
      if(!this.view||this.checkPermi(['order:book:edit'])) {
        this.showEdit = true
      }
      getUserProfile({}).then((res)=>{
        this.user=res.data
      })

    },
    methods: {
      checkPermi,
      checkRole,

      handleClose() {
        this.$emit('close-book-popup');
      },
      handleRemove(file, fileList) {
        this.fileList = fileList
      },
      handlePreview(file) {
        console.log(file);
        window.open(file.url,'_blank');
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`Delete ${ file.name }？`)
        .then(() => {
          if(file.id!=null) {
            deletcFileList.push(file.id)
          }
        });
      },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.uploadDocument.isUploading = true;
      console.log("222222222")
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      if (response.code !== 0) {
        this.$modal.msgError(response.msg);
        return;
      }
      this.uploadDocument.isUploading = false;
      this.$refs.uploadDocument.clearFiles();
    },
    uploadFile(raw) {
        console.log(raw)
        console.log(this.fileList)
        this.fileList.push(raw.file)
    },

    getWarehousePage(){
      getWarehousePage({pageNo:1,pageSize:100,status:0}).then(response => {
          this.warehouseList=response.data.list
        });
    },
    getProductPage(){
      getProductPage({pageNo:1,pageSize:10000,status:0}).then(response => {
          this.productList=response.data.list
        });
    },
    getHeaderApiByOrderId(id) {

      getInboundFilesById(id).then((response) => {
        for(var item of response.data) {
          this.fileList.push(item)
        }
      });
      console.log(this.fileList)

      getHeaderApiByOrderId(id).then((response) => {
        this.form = JSON.parse(JSON.stringify(response.data));

        console.log(this.form)

        var productIds=[]
        for(var item of this.form.itemResList) {
          item.orderNumber = this.form.orderNumber;
          productIds.push(item.productId);
        }
        var orderUnits=[]
        var orderUnitsFull=[]
        var units = getDictDatas(DICT_TYPE.SYSTEM_UNITS);

        for(var item of this.form.itemResList) {
          this.form.warehouseName = item.warehouseName;
          this.form.inboundTime = item.inboundTime;

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
                if (item.requested==null) {
                  item.requested = 0
                }
                if (item.booked==null) {
                  item.booked = 0
                }
          }
        }
        listByProductIds({ ids: productIds }).then((response1) => {
          this.form.uitConversions = response1.data;
          for(var i=0;i<this.form.itemResList.length;i++){
            var units=this.form.uitConversions.filter(uitConversion=> uitConversion.productId == this.form.itemResList[i].productId)
            this.form.itemResList[i].units = units;
          }
          this.setQty(this.form.itemResList)
          this.form = JSON.parse(JSON.stringify(this.form));
          this.loading = false

        });
        getTaskList({orderNumber:response.data.orderNumber,status:1,type:1}).then((res)=>{
           if(res.data.length>0){
             this.tasks.push(res.data[0])
           }
        });

      });
    },
    setQty(data){
      var vm=this
      for(var k=0;k<data.length;k++){
        var row=data[k]
        var units=row.units

        vm.unitLabelsShow = false;



        if(units == null||units.length==0){
            data[k][row.requestUnit+'Ordered']=row.requested
            data[k][row.bookedUnit+'Booked']=row.booked
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
            vm.unitLabelsShow = true;
          }

          data[k][requestUnit+'Booked']=row.booked
          data[k]['CTNS'+'Booked']=Math.floor(row.booked/Number(ctnsUnit.conversionFactor))
          if(row.booked%Number(ctnsUnit.conversionFactor)>0&&piecUnit!=null){
            var shengyu=row.booked%Number(ctnsUnit.conversionFactor)
            data[k]['CTNS'+'Booked']= Math.floor(row.booked/Number(ctnsUnit.conversionFactor))
            data[k]['INNER BOX'+'Booked']= Math.floor(shengyu/piecUnit.conversionFactor)
            vm.unitLabelsShow = true;
          }

        }
        if(vm.unitLabelsShow==true) {
            if(data[k]['INNER BOX'+'Ordered']==null) {
              data[k]['INNER BOX'+'Ordered'] = 0
            }
            if(data[k]['INNER BOX'+'Booked']==null) {
              data[k]['INNER BOX'+'Booked'] = 0
            }
          }


      }
      console.log(data)

    },
    setItem(index,bookedUnit){
      var unitL = bookedUnit
      var vm=this
      var row=vm.form.itemResList[index]
      row.bookedUnit=unitL
      row.booked=row[bookedUnit+'Booked']

      var units=row.units
      if(units == null||units.length==0){
      } else {
        var requestUnit = row.requestUnit
        var ctnsUnit = units.filter(item=>item.fromUnit=='CTNS'&&item.toUnit==requestUnit)[0];
        var piecUnit = units.filter(item=>item.fromUnit==requestUnit&&item.toUnit=='INNER BOX')[0];

        row[requestUnit+'Booked']=row.booked
        row['CTNS'+'Booked']=Math.floor(row.booked/Number(ctnsUnit.conversionFactor))
          if(row.booked%Number(ctnsUnit.conversionFactor)>0&&piecUnit!=null){
            var shengyu=row.booked%Number(ctnsUnit.conversionFactor)
            row['CTNS'+'Booked']= Math.floor(row.booked/Number(ctnsUnit.conversionFactor))
            row['INNER BOX'+'Booked']= Math.floor(shengyu/piecUnit.conversionFactor)
          }
        }
      this.form = JSON.parse(JSON.stringify(this.form));
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
	        var vm = this;
            this.file2Xce(file).then(tabJson => {
                if (tabJson && tabJson.length > 0) {
                    this.xlsxJson = tabJson
                    console.log(tabJson)
                    this.listTable = []
                    var errItemTable=[]
                    //转换字段名称，获取数据集
                    for(var i=0;i<this.xlsxJson[0].sheet.length;i++){
                        var index=i
                        var item=this.xlsxJson[0].sheet[i]
                        var errData={}
                        errData['index']  = index
                        errData['SKU'] = item['SKU(Article)']

                        var excelUnit = item['Unit']
                        var units = getDictDatas(DICT_TYPE.SYSTEM_UNITS);
                        for(var unit of units) {
                          if(unit.label==excelUnit.toUpperCase()||unit.value==excelUnit.toUpperCase()) {
                            item.bookedUnit = unit.value;
                          }
                        }
                        //如果sku存在就做修改
                        if(item['SKU(Article)']){
                            var index = vm.form.itemResList.findIndex(tempData => tempData.productCode == item['SKU(Article)']);
                            // console.log(index)
                            if(index != -1){
                                vm.form.itemResList[index]['booked'] = item['Booked Quantity']
                                vm.form.itemResList[index]['bookedUnit'] = item.bookedUnit
                                vm.form.itemResList[index]['remark'] = item['Remark']
                            }else{
                                errItemTable.push(errData)
                            }
                        }else{
                            errItemTable.push(errData)
                        }
                    }
                    // console.log(vm.form.itemResList)
                    vm.setQty(vm.form.itemResList)
                    this.form = JSON.parse(JSON.stringify(this.form));
                    // vm.$set(vm.form, "itemResList", JSON.parse(JSON.stringify(vm.form.itemResList)));
                }
            })
	    },
    downloadTemplate(){
      downloadBookTemplate(this.form.rule).then((res)=>{
        this.$download.excel(res, "booking_template.xlsx");
      })
    },
    submit() {
			var vm = this
      this.$refs["form"].validate(valid => {
        console.log(valid)
        if (!valid) {
          return;
        }
        if(vm.form.factoryConfirm==null) {
          vm.form.factoryConfirm = false
        }

        vm.form.bookJson = JSON.stringify(vm.form.itemResList)
        const formData = new FormData();
        formData.append("warehouseName", vm.form.warehouseName);
        formData.append("inboundTime", this.parseTime(vm.form.inboundTime));
        formData.append("dangerous", vm.form.dangerous);
        formData.append("factoryConfirm", vm.form.factoryConfirm);
        formData.append("bookJson", vm.form.bookJson);

        this.fileList.map(file => {
          if(file.id==null) {
            formData.append("file", file, file.name)
          }
         });
         this.deletcFileList.map(file => {
          if(file.id!=null) {
            formData.append("deletcFileList", file, file.name)
          }
         });

         console.log('formData')
        console.log(formData)
        vm.loading = true
        uploadBookFiles(formData).then(response => {
          vm.loading = false
          vm.fileList = [];
          vm.deletcFileList = [];
          vm.$emit('close-book-popup');
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
                || column.property =='length1' || column.property =='width1' || column.property =='height1'
                || column.property =='innerWeight'|| column.property =='outerWeight') {
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
    handleReject() { // 流程回退
      this.validateBooking(0)
    },
    handleApprove() { // 流程进去
      this.validateBooking(1)
    },
    validateBooking(status){
      var vm = this
      this.$confirm('Are you sure '+(status==1?'Approve':'Reject')+'?', 'Tips', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }).then(() => {
          if(status==0){
            this.$prompt('Please provide a reason.', 'Reject Message', {
              confirmButtonText: 'Confirm',
              cancelButtonText: 'Cancel',
            }).then(({ value }) => {
              var jsonDate = JSON.parse(this.tasks[0].jsonData)
              var data={
                status:status,
                approveResult:'Failed',
                reason:value,
                email1:jsonDate.email1,
                email2:this.user.email,
                ts: Date.now(),
              }
              vm.loading = true
              console.log(this.tasks)
              console.log(this.tasks.length)
              for(var i =0;i<this.tasks.length;i++){
                var task=this.tasks[i]
                task.jsonData=JSON.stringify(data)
                console.log(task)
                updateTask(task).then((res)=>{
                  this.$notify({
                    title: 'Success',
                    message: 'Success',
                    type: 'success'
                  });
                  vm.$emit('close-book-popup');
                })
              }
            }).catch(() => {
            });
          }else{
            var data={
              status:status,
              approveResult:'Pass',
            }
            vm.loading = true
            console.log(this.tasks.length)
            for(var i =0;i<this.tasks.length;i++){
                var task=this.tasks[i]
                task.jsonData=JSON.stringify(data)
                console.log(task)
                updateTask(task).then((res)=>{
                  this.$notify({
                    title: 'Success',
                    message: 'Success',
                    type: 'success'
                  });
                  vm.$emit('close-book-popup');
                })
            }
          }
        }).catch(() => {

        });
    },
      getInputStrClass(row,item) {
        if(row.booked!=row.requested) {
            return 'Red'
          }
    },



    },
  };
  </script>

  <style scoped>

.Red /deep/ .el-input__inner{
  color: #EA0000 !important;
}


  </style>
