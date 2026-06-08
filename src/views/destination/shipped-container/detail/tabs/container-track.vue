<!-- DeliveryPlanTable.vue -->
<template>
  <div>
    <el-table v-loading="loading" border height="250" style="width: 100%;" :data="mergedTableData">
      <el-table-column label="Date" align="center" prop="eventTime" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.eventTime ? parseTime(new Date(scope.row.eventTime), '{y}-{m}-{d} {h}:{i}') : '/' }}
        </template>
      </el-table-column>
      <el-table-column label="Location" align="center" prop="port" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.port ? scope.row.port : '/' }}
        </template>
      </el-table-column>
      <el-table-column label="Description" align="center" prop="descriptionEn" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.descriptionEn }}
        </template>
      </el-table-column>
      <el-table-column label="Vessel/Voyage" align="center" prop="" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.vessel }}/{{ scope.row.voyage }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: 'ContaienrTrack',
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
  computed: {
    mergedTableData() {
      const eventCodeMap = {
        'BDAR': 'Vessel Arrived',
        'DSCH': 'Container Discharged',
        'GTOT': 'Port Gate Out',
        'FETA': 'Gate In Inland Terminal',
        'STCS': 'Gate Out Inland Terminal',
        'ARDC': 'Arrival at DC',
        'RCVE': 'Empty Container Return'
      };

      let fixedTemplate = [
        { eventCode: 'BDAR' },
        { eventCode: 'DSCH' },
        { eventCode: 'GTOT' },
        // { eventCode: 'FETA' },
        // { eventCode: 'STCS' },
        { eventCode: 'ARDC' },
        { eventCode: 'RCVE' }
      ];
      console.log('是否有权限:',this.$auth.hasPermi("pepco:destination:container-track-gtot:view"));
      if(!this.$auth.hasPermi("pepco:destination:container-track-gtot:view")){
        fixedTemplate = fixedTemplate.filter(item => item.eventCode !== 'GTOT');
      }

      return fixedTemplate.map(templateItem => {
        const matched = this.tableData.find(d => d.eventCode === templateItem.eventCode);
        return {
          ...templateItem,
          ...(matched || {}), // 如果有对应数据则合并
          descriptionEn: eventCodeMap[templateItem.eventCode]
        };
      });
    }
  },
  data() {
    return {
      submitLoading: false,
    }
  },
  methods: {
    refresh() {
      this.$emit('refresh')
    }
  },
}

</script>