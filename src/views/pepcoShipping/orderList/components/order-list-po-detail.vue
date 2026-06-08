<template>
  <div>
    <el-table v-loading="loading" :data="tableData" size="mini">
      <el-table-column prop="orderNumber" label="Order Number" min-width="100" align="center"></el-table-column>
      <el-table-column prop="itemNumber" label="Item Number" min-width="80" align="center"></el-table-column>
      <el-table-column prop="tcId" label="TCId" min-width="80" align="center"></el-table-column>
      <el-table-column prop="promoCode" label="Promote Code" width="100" align="center">
        <template #default="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.promoCode" placement="top">
            <span class="ellipsis-text">{{ scope.row.promoCode }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="merchCode" label="Merch Code" min-width="60" align="center"></el-table-column>
      <el-table-column prop="dc" label="DC Code" min-width="60" align="center"></el-table-column>
      <el-table-column label="IN-DC Date" min-with="80" align="center">
        <!-- <template v-slot="{row}">{{ parseUTCTime(row.dcDate) }}</template> -->
         <template v-slot="{row}">
          <span 
            :class="{'dc-highlight-date': isWithin14Days(row.bookedEta, row.dcDate)}"
            @click="handleDateClick" >
            {{ parseUTCTime(row.dcDate) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Planned/Supplier(CRD)" min-width="160" align="center">
        <template v-slot="{row}">{{ parseUTCTime(row.plannedCrd)}} / {{ parseUTCTime(row.supplierCrd)}}</template>
      </el-table-column>
      <el-table-column prop="orderScore" label="Order Score" min-width="60" align="center"></el-table-column>
      <el-table-column prop="targetETA" label="Target ETA" min-width="160" align="center"></el-table-column>
      <el-table-column label="PO Tag" min-width="150" align="center">
        <template #default="{ row }">
          <template v-if="getPoTags(row).length">
            <el-tag
              v-for="tag in getPoTags(row)"
              :key="tag.code"
              :type="tag.type"
              :class="tag.className"
              size="small"
            >
              {{ tag.label }}
            </el-tag>
          </template>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getOrderHeaderList } from '@/api/pepco/shipping-order'
import { parseTime as parseDateTime, parseUTCTime as parseUTCDateTime } from '@/utils/ruoyi'
import { PO_TAG_RULES } from '@/api/order/constants/poTagRules'


export default {
  props: {
    shippingOrderId: {
      default: 0
    },
    bookedEta: {
      type: Number 
    }
  },
  mounted() {
    this.initData()
  },
  data() {
    return {
      tableData: [],
      loading: false
    }
  },
  methods: {
    initData() {
      this.loading = true
      getOrderHeaderList({ shippingOrderId: this.shippingOrderId })
        .then(res => {
          this.resolveData(res.data)
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    getPoTags(row) {
      if (row.supplyModel == 'NOS') {
        row.nos = true
      } else {
        row.nos = false
      }
      return PO_TAG_RULES
        .filter(rule => rule.match ? rule.match(row) : true)
        .map(rule => ({
          code: rule.code,
          label: rule.label,
          type: rule.type,
          className: rule.className || ''
        }))
    },
    resolveData(rows) {
      const itemList = []
      rows.forEach(row => {
        row.items.forEach(item => {
          itemList.push({
            id: item.id,
            orderId: item.orderId,
            orderNumber: row.orderNumber,
            itemNumber: item.productCode,
            itemName: item.productName,
            tcId: item.tcId,
            promoCode: item.promoCode,
            merchCode: item.merchCode,
            dcDate: row.deliveryDate,
            dc: row.dc,
            orderScore: row.orderScore,
            otb: row.otb,
            nos: item.nos,
            supplyModel: row.supplyModel,
            isChildrenToy: item.isChildrenToy,
            sanitaryRisk: item.sanitaryRisk,
            isCeramicProducts: item.isCeramicProducts,
            // 计划的crd
            plannedCrd: row.cargoHandoverDate - 7 * 24 * 60 * 60 * 1000,
            // supplier 实际传的crd
            supplierCrd: row.cargoReadyDate,
            targetETA: parseUTCDateTime(row.targetETA - 42 * 24 * 60 * 60 * 1000) + ` to ` + parseUTCDateTime(row.targetETA - 14 * 24 * 60 * 60 * 1000),
            bookedEta: this.bookedEta, 
          })
        })
      })
      this.tableData = itemList
    },
    // 添加日期比较方法
    isWithin14Days(bookedEtaMs, dcDateMs) {
      // 1. 验证毫秒级时间戳有效性
      if (!Number.isFinite(bookedEtaMs) || !Number.isFinite(dcDateMs)) {
          return false;
      }

      // 2. 提取日期部分（忽略时分秒，不考虑时区）
      const getDatePart = (timestampMs) => {
          const date = new Date(timestampMs);
          // 只保留年、月、日，自动忽略时分秒（设为00:00:00）
          return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      };

      // 3. 转换为纯日期时间戳（仅年-月-日）
      const bookedDate = getDatePart(bookedEtaMs);
      const dcDate = getDatePart(dcDateMs);

      // 4. 计算日期差（天数）
      const msPerDay = 86400000; // 1天的毫秒数
      const dayDiff = (dcDate - bookedDate) / msPerDay;
      // 5. 判断条件：bookedEta 到 dcDate 的天数 >1 且 ≤13
      return dayDiff > 1 && dayDiff <= 13;
  },
    handleDateClick(rowId) {
      this.$emit('goto-dc-reason-log', rowId);
    }
  }
}
</script>

<style scoped>
.ellipsis-text {
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dc-highlight-date {
  color: #ff4d4f;
  cursor: pointer;
  text-decoration: underline;
}
</style>
