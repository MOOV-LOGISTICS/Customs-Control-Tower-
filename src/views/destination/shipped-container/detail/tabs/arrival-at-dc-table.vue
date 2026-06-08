<!-- DeliveryPlanTable.vue -->
<template>
  <div>
    <el-table v-loading="loading" border height="250" style="width: 100%;" :data="tableData">
      <el-table-column label="Update Time" align="center" prop="updateTime" min-width="100px">
        <template slot-scope="scope">
          {{ formatUserLocalTime(scope.row.updateTime, scope.row.timeZone, scope.row.timeZoneOffset) }}
        </template>
      </el-table-column>
      <el-table-column label="DC" align="center" min-width="100px">
         <template slot-scope="scope">
          {{ scope.row.dc }}
         </template>
      </el-table-column>
      <el-table-column label="Arrive Date" align="center" prop="arriveDate" min-width="100px">
        <template slot-scope="scope">
          {{ parseUTCTime(scope.row.arriveDate) }}
        </template>
      </el-table-column>
      <el-table-column label="Arrive Hour" align="center" prop="arriveHour" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.arriveHour }}
        </template>
      </el-table-column>
      <el-table-column label="Operator" align="center" prop="userEmail" min-width="100px">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ArrivalAtDcTable',
  props: {
    tableData: {
      type: Array,
      required: true
    },
    containerRowData: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      newItem: {
        type: 1,
        shipmentId: null,
        destinationContainerId: null,
        containerNo: '',
        transportMode: '',
        dcDate: '',
        priorityType: '',
        bookingHour: '',
        freightContractor: '',
        dc: ''
      },
      submitLoading: false,
      dialogVisible: false
    }
  },
  methods: {
  },
}

</script>
