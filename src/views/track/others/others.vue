<template>
    <div
     class="app-container"
     style="width:100%; margin: 0 auto;padding-bottom: 40px;"
   >
   <div style="width: 100%;padding-top: 20px;">
     <h1 style="border-bottom: 3px solid #004F7C;padding-bottom: 10px;width: 150px;margin: 0 auto;text-align: center;font-weight: 900;font-size: 30px;">Tracking</h1>
   </div>
   <el-form v-model="trackingForm">
         <div style="text-align: center;font-size: 18px!important;margin-top: 30px;">
             <el-radio-group v-model="trackingForm.type">

               <el-radio v-hasPermi="['order:header:query']" label="order">Purchase Order</el-radio>
                <el-radio v-hasPermi="['order:so-header:query']" label="salesOrder">Sales Order</el-radio>
               <el-radio label="bookingNumber">Booking Number</el-radio>
               <el-radio label="shipmentBookingNumber">MOOV Ref</el-radio>
               <el-radio label="blNumber">BL Number</el-radio>
               <el-radio label="containerNo">Container No</el-radio>

             </el-radio-group>
         </div>
           <div style="margin-bottom: 25px;margin-top: 30px;text-align: center;">
             <el-input v-model="trackingForm.searchKey" style="width: 50%;" placeholder="Search..." >
               <i slot="prefix" class="el-input__icon el-icon-search"></i>
               </el-input>
               <el-button @click="track()" style="margin-left: 10px;" type="primary" :loading="loading">Track</el-button>

           </div>
         </el-form>
     <div v-if="type=='order'" style="padding: 0px 100px;">
         <div style="font-size: 14px;">
             <p>
                 Order Number:{{ orderData.orderNumber }}
             </p>
             <p>
                Shipped together with:
                 <span type="primary" style="margin-right: 10px;" v-for="row in orderData.shipmentResList">
                     <el-link type="primary" @click="toOrder(lot)" style="margin-right: 10px;" v-for="lot in row.orderNumbers.filter((item)=>orderData.orderNumber!=item)">{{ lot }}</el-link>
                 </span>
             </p>
             <p>
                 Containers:{{ orderData.containerCount }}
             </p>
             <div style="border-bottom: 1px solid #0279ce;"></div>
         </div>
         <el-empty v-if="!loading&&type=='order'&&JSON.stringify(orderData)=='{}'">
         </el-empty>
         <div v-for="row in orderData.shipmentResList">
             <Shipment :originDeliveryMap="originDeliveryMap" :row="row"></Shipment>
           <el-skeleton style="width: 100%" v-if="!row.showIframe" :loading="trackMapLoading" animated>
             <template slot="template">
               <el-skeleton-item
                 variant="image"
                 style="width: 100%; height: 400px;"
               />
             </template>
           </el-skeleton>
             <iframe v-if="row.showIframe" style="width: 100%; height: 750px;" :src="row.iframeUrl" frameborder="0" loading="lazy"></iframe>
         </div>

     </div>

     <div v-if="type=='salesOrder'" style="padding: 0px 100px;">
         <div style="font-size: 14px;">
             <p>
                 Order Number:{{ orderData.orderNumber }}
             </p>
             <p>
                Shipped together with:
                 <span type="primary" style="margin-right: 10px;" v-for="row in orderData.shipmentRes">
                    <el-link type="primary" @click="toSOOrder(lot)" style="margin-right: 10px;" v-for="lot in row.orderNumbers.filter((item)=>orderData.orderNumber!=item)">{{ lot }}</el-link>
                 </span>
             </p>
             <p>
                 Containers:{{ orderData.containerCount }}
             </p>
             <div style="border-bottom: 1px solid #0279ce;"></div>
         </div>
         <el-empty v-if="!loading&&type=='order'&&JSON.stringify(orderData)=='{}'">
         </el-empty>
         <div v-for="row in orderData.shipmentRes">
             <Shipment :originDeliveryMap="originDeliveryMap" :row="row"></Shipment>
           <el-skeleton style="width: 100%" v-if="!row.showIframe" :loading="trackMapLoading" animated>
             <template slot="template">
               <el-skeleton-item
                 variant="image"
                 style="width: 100%; height: 400px;"
               />
             </template>
           </el-skeleton>
             <iframe v-if="row.showIframe" style="width: 100%; height: 750px;" :src="row.iframeUrl" frameborder="0" loading="lazy"></iframe>
         </div>

     </div>

     <div v-if="type=='containerNo'" style="padding: 0px 100px;">
         <div style="font-size: 14px;">
             <p>
                 Container No:{{ containerData.containerNo }}
             </p>
             <div style="border-bottom: 1px solid #004F7C;"></div>
         </div>
         <el-empty v-if="!loading&&type=='containerNo'&&JSON.stringify(containerData)=='{}'">

         </el-empty>
         <div v-for="row in containerData.shipmentResList">
             <Shipment :originDeliveryMap="originDeliveryMap" :key="'wqe'+containerData.containerNo" :row="row" :containerNo="containerData.containerNo"></Shipment>
           <el-skeleton style="width: 100%" v-if="!row.showIframe" :loading="trackMapLoading" animated>
             <template slot="template">
               <el-skeleton-item
                 variant="image"
                 style="width: 100%; height: 400px;"
               />
             </template>
           </el-skeleton>
           <iframe v-if="row.showIframe" style="width: 100%; height: 750px;" :src="row.iframeUrl" frameborder="0" loading="lazy"></iframe>
         </div>

     </div>

     <div v-if="type=='bookingNumber'||type=='blNumber'||type=='shipmentBookingNumber'" style="padding: 0px 100px;">
         <div style="font-size: 14px;">
             <p>
                 Booking Ref: {{ shipmentData.bookingNumber }}
             </p>
             <p>
                 Booking Number: {{ shipmentData.shipmentBookingNumber }}
             </p>
             <p>
                 BL Number: {{ shipmentData.blNumber }}
             </p>
             <div style="border-bottom: 1px solid #0279ce;"></div>
         </div>
         <el-empty v-if="!loading&&(type=='bookingNumber'||type=='blNumber'||type=='shipmentBookingNumber')&&JSON.stringify(shipmentData)=='{}'"></el-empty>

         <Shipment :originDeliveryMap="originDeliveryMap" v-if="!loading&&(type=='bookingNumber'||type=='blNumber'||type=='shipmentBookingNumber')
         &&JSON.stringify(shipmentData)!='{}'" :row="this.shipmentData"></Shipment>
       <el-skeleton style="width: 100%" v-if="!shipmentData.showIframe" :loading="trackMapLoading" animated>
         <template slot="template">
           <el-skeleton-item
             variant="image"
             style="width: 100%; height: 400px;"
           />
         </template>
       </el-skeleton>
         <iframe v-if="shipmentData.showIframe" style="width: 100%; height: 750px;" :src="shipmentData.iframeUrl" frameborder="0" loading="lazy"></iframe>
     </div>
   </div>

   </template>
    <style scoped>
    p{
        margin: 12px;
    }
</style>
   <script>
   import { getClpSoList } from "@/api/shipment/clpSo";
   import { getSOHeaderPage } from "@/api/order/sOHeader";
   import { getOriginDeliveryList } from "@/api/system/originDelivery";
import { getPolPodList } from "@/api/system/polPod";
   import { getPage,getList,trackByBookingNumber} from "@/api/shipment/shipment";
   import { shipmentContainerList} from "@/api/shipment/shipment-container";
   import { getHeaderPage} from "@/api/order/header";
   import  Shipment from "./compnents/Shipment.vue"
 export default {
     name: "Others",
     components: {
         Shipment
     },
     data() {
         return {
             trackMapLoading:true,
             expanded:{},
             loading:false,
             type:'',
             trackingForm:{
                 type:'',
                 searchKey:''
             },
             containerData:{
                 shipmentResList:[]
             },
             orderData:{
                 shipmentResList:[]
             },
             shipmentData:{
                 containerDOList:[],
                 movement:[]
             },
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
           label: "Arrived",
           sync: false,
           hide: true,
         },
         {
           key: "11",
           label: "Departure POD",
           sync: false,
           hide: true,
         },
         {
           key: "12",
           label: "Delivered",
           sync: false,
           hide: true,
         },
         {
           key: "14",
           label: "Completed",
           sync: false,
           hide: true,
         },
       ],
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
    'SHCO': 'SHIPCO',
    'NVOCC DSV': 'DSV',
    'WECC': 'WEC',
},
originDeliveryMap: {},
polPodMap:{}
         };
     },
     mounted() {
        if (this.$route.query.type) {
            this.trackingForm.type=this.$route.query.type
        }
        if (this.$route.query.searchKey) {
            this.trackingForm.searchKey=this.$route.query.searchKey
        }
        this.getPortList()
         if(this.trackingForm.type==null|| this.trackingForm.type==undefined||this.trackingForm.searchKey==null|| this.trackingForm.searchKey==undefined) {
         } else {
             this.init()
         }
     },
     methods: {
         lastMove(row){

         },
         getPortList() {
            getOriginDeliveryList().then((response) => {
                for (var i = 0; i < response.data.length; i++) {
                this.$set(this.originDeliveryMap, response.data[i].code, response.data[i].name);
                }
            });
            },
         toggleDetails(index){
             this.$set(this.expanded, index, !this.expanded[index]);
         },
         toOrder(po){
             window.open('/order/POManagement?orderNumber='+po)
         },
          toSOOrder(so){
            window.open('/order/sales-order?orderNumber='+so)
         },
         getClp(shipmentId){
             getClpPage(this.queryParams).then((response) => this.clpPageCallBack(response));
         },
         toTrack(type,searchKey){
            console.log(type)
            console.log(searchKey)
            this.trackingForm.type=type
            this.trackingForm.searchKey=searchKey
            this.track()
         },
         track(){
             this.$router.push('/track/others?type='+this.trackingForm.type+'&searchKey='+this.trackingForm.searchKey)
             this.init()

         },
         getClpSoList(shipment){
            getClpSoList({shipmentBookingNumber:shipment.shipmentBookingNumber}).then((res)=>{
                var containerMap={}
                var qtyMap={}
                var volumeMap={}
                for(var i=0;i<res.data.length;i++){
                    if(containerMap[res.data[i].containerNo]){
                        if(containerMap[res.data[i].containerNo].orderNumbers.indexOf(res.data[i].salesOrderNumber)==-1){
                            containerMap[res.data[i].containerNo].orderNumbers.push(res.data[i].salesOrderNumber)
                            containerMap[res.data[i].containerNo].cbm+=Number(res.data[i].cbm)
                        }
                    }else{
                        containerMap[res.data[i].containerNo]={
                            orderNumbers:[res.data[i].salesOrderNumber],
                            volume:Number(res.data[i].cbm)
                        }

                    }

                    if(qtyMap[res.data[i].salesOrderNumber]){
                        qtyMap[res.data[i].salesOrderNumber]+=Number(res.data[i].qty)
                    }else{
                        qtyMap[res.data[i].salesOrderNumber]=Number(res.data[i].qty)
                    }

                    if(volumeMap[res.data[i].salesOrderNumber]){
                        volumeMap[res.data[i].salesOrderNumber]+=Number(res.data[i].cbm)
                    }else{
                        volumeMap[res.data[i].salesOrderNumber]=Number(res.data[i].cbm)
                    }


                }
                console.log(volumeMap)
                console.log(qtyMap)
                shipment.volumeMap=volumeMap
                shipment.qtyMap=qtyMap
                shipment.containerMap=containerMap
            })
         },
         trackOtherCarrier(shipment){
            if(shipment.carrier=='TSHG'){
                return
            }
            this.trackMapLoading = true
            var type=""
            var dataReq=""
            if(this.type=='containerNo'){
                type='containerNo'
                dataReq=this.trackingForm.searchKey
            }else{
                type='bill'
                dataReq=shipment.shipmentBookingNumber
            }

            trackByBookingNumber({
            carrier:shipment.carrier,
            type:type,
            bookingNumber:dataReq
          }).then((res)=>{
            this.trackMapLoading = false
            if(res.data.statusCode==20000){
                if(type=='containerNo'){
                    shipment.iframeUrl='https://i.saas.freightower.com/#/ocean/detail?key=MrFe7x4NNpSAQRSoUYNURgwSHG2g6nVGEDlZY3r5xLM@&clientId=q8acc6c57665bf971&containerNo='
                    + this.trackingForm.searchKey + '&carrierCode=' + res.data.data.result.carrier.code + '&showInfo=1&lang=en'
                }else{
                    shipment.iframeUrl='https://i.saas.freightower.com/#/ocean/detail?key=MrFe7x4NNpSAQRSoUYNURgwSHG2g6nVGEDlZY3r5xLM@&clientId=q8acc6c57665bf971&billNo='
                    + shipment.shipmentBookingNumber + '&carrierCode=' + res.data.data.result.carrier.code + '&showInfo=1&lang=en'
                }
                this.$set(shipment,'showIframe',true)
                this.$set(shipment,'iframeUrl',shipment.iframeUrl)

                console.log(shipment)
              var containers=res.data.data.result.containers
              for(var i=0;i<containers.length;i++){
                var container=shipment.containerDOList.filter((item)=>item.containerNo==containers[i].containerNo)
                if(container[0]){
                    var statusList=containers[i].status.filter((item)=>item.isEsti=='N')
                    if(statusList.length>0){
                        container[0].lastestMove=statusList[statusList.length-1].eventPlaceOrigin
                    }
                }
            }
        }
          })
         },
         setContainerMovement(status,milestones,descriptionCn,container,eventField){
      var statusByType=status.filter((item)=>item.descriptionCn==descriptionCn)
                  if(statusByType.length>0){
                    if(milestones.filter((item)=>item.status==eventField).length==0){
                      milestones.push({
                        location:statusByType[0].eventPlace,
                        vessel:(statusByType[0].vslName?statusByType[0].vslName:'')+" / "+(statusByType[0].voy?statusByType[0].voy:''),
                        status:eventField
                      })
                    }
                  }
                  if(statusByType.length>0){
                    container[eventField]=new Date(statusByType[0].eventTime).getTime()
                    return true
                  }
                  return false

    },
         init(){
             if (this.trackingForm.type == null || this.trackingForm.type == undefined || this.trackingForm.searchKey == null || this.trackingForm.searchKey == undefined) {
             } else {
                 this.loading = true
             }
             this.expanded={}
             this.orderData={
                 shipmentResList:[]
             }
             this.shipmentData={
                 containerDOList:[],
                 movement:[]
             }
             this.containerData={
                 shipmentResList:[]
             }
            this.type = this.trackingForm.type
             if(this.trackingForm.type=='order'){
                 getHeaderPage({orderNumber:this.trackingForm.searchKey}).then((response) => {
                     var data = response.data.list;
                     if(data.length>0){
                         this.orderData=data[0]
                         this.orderData.containerCount=0
                         for(var i=0;i<this.orderData.shipmentResList.length;i++){
                             for(var j=0;j<this.orderData.shipmentResList[i].containerDOList.length;j++){
                                 if(this.orderData.shipmentResList[i].containerDOList[j].type==1){
                                     this.orderData.containerCount=this.orderData.containerCount+1
                                 }
                             }
                             var row=this.orderData.shipmentResList[i]
                             var data=row.shipmentStatusList.sort((a, b) => Number(a.age - b.age)).filter((item)=>item.location!=null)
                             data.sort((a, b) => a.endDate - b.endDate)
                             row.movement=data

                             this.trackOtherCarrier(row)

                             var containerMap={}
                             if(row.clpRes){
                                 var clpList=row.clpRes.clpDetailResList
                                 for(var i=0;i<clpList.length;i++){
                                    console.log(clpList[i])

                                     if(!containerMap[clpList[i].containerNo]){
                                         containerMap[clpList[i].containerNo]={volume:clpList[i].cbm,orderIds:[clpList[i].orderId]
                                            ,cbms:[clpList[i].cbm]
                                            ,qtys:[clpList[i].qty]}
                                     }else{
                                         containerMap[clpList[i].containerNo].volume=containerMap[clpList[i].containerNo].volume+clpList[i].cbm
                                         if(containerMap[clpList[i].containerNo].orderIds.indexOf(clpList[i].orderId)==-1){
                                             containerMap[clpList[i].containerNo].orderIds.push(clpList[i].orderId)
                                             containerMap[clpList[i].containerNo].cbms.push(clpList[i].cbm)
                                             containerMap[clpList[i].containerNo].qtys.push(clpList[i].qty)
                                         }
                                     }
                                 }
                             }
                             var orderMap={}
                             for(var i=0;i<row.orderIds.length;i++){
                                 orderMap[row.orderIds[i]]=row.orderNumbers[i]
                             }
                             row.orderMap=orderMap
                             row.containerMap=containerMap
                         }
                     }else{
                         this.orderData={}
                     }
                     this.loading=false
                 })
             }else if(this.trackingForm.type=='salesOrder'){
                 this.type='salesOrder'
                 getSOHeaderPage({salesOrderNumber:this.trackingForm.searchKey}).then((response) => {
                     var data = response.data.list;
                     if(data.length>0){
                         this.orderData=data[0]
                         this.orderData.containerCount=0
                         this.orderData.orderNumber=this.orderData.salesOrderNumber
                         for(var i=0;i<this.orderData.shipmentRes.length;i++){
                             for(var j=0;j<this.orderData.shipmentRes[i].containerDOList.length;j++){
                                 if(this.orderData.shipmentRes[i].containerDOList[j].type==1){
                                     this.orderData.containerCount=this.orderData.containerCount+1
                                 }
                             }
                             var row=this.orderData.shipmentRes[i]
                             var data=row.shipmentStatusList.sort((a, b) => Number(a.age - b.age)).filter((item)=>item.location!=null)
                             data.sort((a, b) => a.endDate - b.endDate)
                             row.movement=data
                            console.log("213",row.shipmentStatusList)
                             this.trackOtherCarrier(row)
                             row.containerMap={}
                            this.getClpSoList(row)

                             var orderMap={}
                             for(var i=0;i<row.orderIds.length;i++){
                                 orderMap[row.orderIds[i]]=row.orderNumbers[i]
                             }
                             row.orderMap=orderMap
                             row.shipmentContainerStatusDOS=row.shipmentContainerStatusRes?row.shipmentContainerStatusRes:[]
                         }
                     }else{
                         this.orderData={}
                     }
                     this.loading=false
                 })
             }else if(this.trackingForm.type=='bookingNumber'||this.trackingForm.type=='blNumber'|| this.trackingForm.type=='shipmentBookingNumber'){
                 this.type=this.trackingForm.type
                 var data={}
                 if(this.type=='bookingNumber'){
                     data.shipmentBookingNumber=this.trackingForm.searchKey
                 }else if(this.type=='shipmentBookingNumber'){
                     data.bookingNumber=this.trackingForm.searchKey
                 }else{
                     data.blNumber=this.trackingForm.searchKey
                 }
                 getPage(data).then((res)=>{
                     if(res.data.list.length>0){
                         this.shipmentData=res.data.list[0]
                         this.shipmentData.containerCount=0
                             for(var j=0;j<this.shipmentData.containerDOList.length;j++){
                                 if(this.shipmentData.containerDOList[j].type==1){
                                     this.shipmentData.containerCount=this.shipmentData.containerCount+1
                                 }
                             }
                             var row=this.shipmentData
                             var data=row.shipmentDetailDOS.sort((a, b) => Number(a.age - b.age)).filter((item)=>item.location!=null)

                             data.sort((a, b) => a.endDate - b.endDate)
                             this.trackOtherCarrier(row)
                             row.movement=data
                             var containerMap={}
                             if(row.clpRes){
                                 var clpList=row.clpRes.clpDetailResList
                                 for(var i=0;i<clpList.length;i++){
                                     if(!containerMap[clpList[i].containerNo]){
                                        containerMap[clpList[i].containerNo]={volume:clpList[i].cbm,orderIds:[clpList[i].orderId]
                                            ,cbms:[clpList[i].cbm]
                                            ,qtys:[clpList[i].qty]}
                                     }else{
                                         containerMap[clpList[i].containerNo].volume=containerMap[clpList[i].containerNo].volume+clpList[i].cbm
                                         if(containerMap[clpList[i].containerNo].orderIds.indexOf(clpList[i].orderId)==-1){
                                             containerMap[clpList[i].containerNo].orderIds.push(clpList[i].orderId)
                                             containerMap[clpList[i].containerNo].cbms.push(clpList[i].cbm)
                                             containerMap[clpList[i].containerNo].qtys.push(clpList[i].qty)
                                         }
                                     }
                                 }
                             }

                             var orderMap={}
                             for(var i=0;i<row.bookingItemResVOS.length;i++){
                                 orderMap[row.bookingItemResVOS[i].orderId]=row.bookingItemResVOS[i].orderNumber
                             }
                             row.orderMap=orderMap
                             row.containerMap=containerMap
                     }else{
                         this.shipmentData={}
                     }
                     this.loading=false
                 })
             }else if(this.trackingForm.type=='containerNo'){
                 shipmentContainerList({containerNo:this.trackingForm.searchKey}).then((res)=>{
                     var shipmentIds=[]
                     for(var i=0;i<res.data.length;i++){
                         shipmentIds.push(res.data[i].shipmentId)
                     }
                     if(shipmentIds.length>0){
                         getList({ids:shipmentIds.join(',')}).then((res)=>{
                             this.containerData.containerNo=this.trackingForm.searchKey
                             for(var i=0;i<res.data.length;i++){
                                 res.data[i].containerCount=0
                                     for(var j=0;j<res.data[i].containerDOList.length;j++){
                                         if(res.data[i].containerDOList[j].type==1){
                                             res.data[i].containerCount=res.data[i].containerCount+1
                                         }
                                     }
                                     var row=res.data[i]
                                     var data=row.shipmentDetailDOS.sort((a, b) => Number(a.age - b.age)).filter((item)=>item.location!=null)
                                     data.sort((a, b) => a.endDate - b.endDate)
                                     row.movement=data
                                     this.trackOtherCarrier(row)
                                     var containerMap={}
                                     if(row.clpRes){
                                         var clpList=row.clpRes.clpDetailResList
                                         for(var l=0;l<clpList.length;l++){
                                             if(!containerMap[clpList[l].containerNo]){
                                                containerMap[clpList[l].containerNo]={volume:clpList[l].cbm,orderIds:[clpList[l].orderId]
                                            ,cbms:[clpList[l].cbm]
                                            ,qtys:[clpList[l].qty]}
                                             }else{
                                                 containerMap[clpList[l].containerNo].volume=containerMap[clpList[l].containerNo].volume+clpList[l].cbm
                                                 if(containerMap[clpList[l].containerNo].orderIds.indexOf(clpList[l].orderId)==-1){
                                                     containerMap[clpList[l].containerNo].orderIds.push(clpList[l].orderId)
                                                     containerMap[clpList[l].containerNo].cbms.push(clpList[l].cbm)
                                                        containerMap[clpList[l].containerNo].qtys.push(clpList[l].qty)
                                                 }
                                             }
                                         }
                                     }
                                     var orderMap={}
                                     for(var k=0;k<row.bookingItemResVOS.length;k++){
                                         orderMap[row.bookingItemResVOS[k].orderId]=row.bookingItemResVOS[k].orderNumber
                                     }
                                     row.orderMap=orderMap
                                     row.containerMap=containerMap
                             }
                             this.containerData.shipmentResList=res.data
                             this.loading=false
                         })
                     }else{
                         this.loading=false
                     }
                 })
             } else {
                this.loading=false
             }
         }
     }
 };
 </script>
