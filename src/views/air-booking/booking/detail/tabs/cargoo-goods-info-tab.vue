<template>
       <div>
          <el-button style="margin-bottom:15px"  type="primary"
                     v-show="shipment.atd == null && shipment.status != '0' && shipment.status != '9'"
                     @click="addRemoveSpoShow">Add/Remove Shipping Order
          </el-button>


          <el-card v-if="spoList.length>0" style="margin-bottom:20px;border-radius:0px;padding:20px">
             <el-tag size="small" style="margin-right: 5px;  font-size: 14px; " v-for="spo in spoList" :key="spo.id">
              <el-link  type="primary" target="_blank"
                       :href="'/shipment/ppshippingOrderDetail?id='+spo.id">{{ spo.soRef }}
              </el-link>
            </el-tag>
          </el-card>

          <!-- <el-table v-if="itemTableData.length > 0" :data="itemTableData">
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
          </el-table> -->
          <div v-for="form in bookingProductData" :key="'booking' + form.id">
            <el-card shadow="never" style="background: #EBF0F4;" class="box-card">
              <el-descriptions style="box-shadow:none!important;border: none;padding: 15px!important;background: #fff;"
                               :column="4">
                <el-descriptions-item label="Total Weight(KG)">
                  {{ form.grossWeight ? form.grossWeight.toFixed(3) : "NA" }}
                </el-descriptions-item>
                <el-descriptions-item label="Total Volume(CBM)">
                  {{ form.volume ? form.volume.toFixed(3) : "NA" }}
                </el-descriptions-item>
                <el-descriptions-item label="Packages">
                  {{ form.packageMethod ? form.packageMethod : "NA" }}
                </el-descriptions-item>
                <el-descriptions-item label="Total Number Of Packages">
                  {{ form.packageNumber ? form.packageNumber : "NA" }}
                </el-descriptions-item>
              </el-descriptions>
              <br/>
              <el-descriptions style="margin-bottom: 20px;background: #fff;" :colon="false" direction="vertical"
                               v-for="(item, i) in bookingProductData" :key="'product' + i" class="margin-top"
                               title=""
                               :column="4">
                <template slot="extra">
                  <br/>
                </template>

                <el-descriptions-item :label="$t('booking.productEnglishName')">{{
                  item.productNameEn
                  }}
                </el-descriptions-item>
                <el-descriptions-item  label="Product Chinese Name">{{
                  item.productNameCn
                  }}
                </el-descriptions-item>
                <el-descriptions-item :label="$t('booking.hsCode')">{{
                  item.hsCode
                  }}
                </el-descriptions-item>
                <el-descriptions-item  label="Marks&Numbers">{{
                  item.markNumber
                  }}
                </el-descriptions-item>
                <el-descriptions-item label="Remark">{{
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
                    <el-col v-show="item.batteries == '{}'" :span="3">Batteries</el-col>
                    <el-col v-show="item.dangerousGoods != '{}'" v-for="dict in getDictDatas(   DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS )" :key="dict.value" :span="4">{{ dict.label }}
                    </el-col>
                  </el-row>
                  <el-row style="margin-top: 10px" :gutter="20">
                    <el-col :span="4">
                      <el-switch :active-value="1" :inactive-value="0" v-model="item.dg" active-text="Yes" disabled
                                 inactive-text="No">
                      </el-switch>
                    </el-col>
                    <el-col v-for="dict in getDictDatas(  DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS)" :key="'d' + dict.value" :span="4" v-show="item.hazardousMaterials != '{}'">
                      {{ JSON.parse(item.dangerousGoods)[dict.value] }}
                    </el-col>

                    <el-col :span="20" v-show="item.dangerousGoods == '{}'">
                      <el-radio-group @input="changeBatteries(item)" v-model="item.batteries" disabled>
                        <el-radio :label="1" border>Has batteries</el-radio>
                        <el-radio :label="2" border>No batteries</el-radio>
                      </el-radio-group>
                    </el-col>
                  </el-row>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </div>
    <shipping-order-dialog ref="shippingOrderDialog" :spoList="spoList" @submit="handleOrderSubmit"></shipping-order-dialog>
    <check-order-status-dialog ref="checkOrderStatusDialog"></check-order-status-dialog>

        </div>

</template>

<script>

import{detail,updateEventTime} from '@/api/air/booking'
import addEventTimeDialog from "../components/add-event-time-dialog.vue";
import { getDeptList, listDept } from "@/api/system/dept";
import ShippingOrderDialog from '../components/shipping-order-dialog.vue';
import CheckOrderStatusDialog from '../components/check-order-status-dialog.vue';

export default {
  name: 'BookingInfoTab',
  components: {addEventTimeDialog,ShippingOrderDialog,CheckOrderStatusDialog },
  props: {
    spoList: {
      type: Array,
      default: () => []
    },
    bookingProductData: {
      type: Array,
      default: () => []
    },
    shipment: {
      type: Object,
      default: () => ({})
    },


  },
  data() {
  return {
    showAddEventDialog: false,
    tempPlacesShow: [],
    partiesMap: {},
    agentData: [],
    agentMap: [],
    };
  },

    mounted() {
    },

  computed: {

    },
    created() {
      localStorage.removeItem('refreshPoPage')

    },

  methods: {

      addRemoveSpoShow() {
        this.$nextTick(() => {
          this.$refs.shippingOrderDialog.openDialog(this.spoList,this.shipment)
        });
      },

    handleOrderSubmit(rows) {
     this.$emit('refreshPage')
      },
    },
}
</script>



<style lang="scss" scoped>
.transport-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
}

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
</style>

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
