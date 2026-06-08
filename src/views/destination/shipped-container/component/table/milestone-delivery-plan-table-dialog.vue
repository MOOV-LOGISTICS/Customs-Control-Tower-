<template>
  <el-dialog :visible.sync="dialogVisible" :title="containerData.containerNo" width="90%" @close="handleClose" :modal="false" with="100%">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="Mode of Transport" align="center" prop="transportMode" min-width="150px">
        <template slot-scope="{ row }">
          <!-- <el-input v-if="mode === 'edit'" v-model="row.transportMode" :disabled="mode === 'view'" @input="handleInput(row, 'transportMode')" /> -->
          <el-select v-if="mode === 'edit'"  v-model="row.transportMode" placeholder="Select Mode"  :disabled="mode === 'view'" style="width: 100%;">
            <el-option v-for="item in transportModeOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
          <span v-else>{{ row.transportMode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Delivery Schedule Date" align="center" prop="dcDate" min-width="160px">
        <template slot-scope="{ row }">
          <el-date-picker v-if="mode === 'edit'" v-model="row.dcDate" type="date" placeholder="Select Date" :disabled="mode === 'view'" @input="handleInput(row, 'dcDate')" value-format="yyyy-MM-dd" />
          <!-- <el-input v-if="mode === 'edit'" v-model="row.dcDate" :disabled="mode === 'view'" @input="handleInput(row, 'dcDate')" /> -->
          <span v-else>{{ parseUTCTime(row.dcDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Delivery Schedule Hour" align="center" prop="bookingHour" min-width="160px">
        <template slot-scope="{ row }">
          <el-time-picker v-if="mode === 'edit'" type="time" format="HH:mm" v-model="row.bookingHour" placeholder="Select Time" :disabled="mode === 'view'" @input="handleInput(row, 'bookingHour')" value-format="HH:mm"></el-time-picker>
          <!-- <el-input v-if="mode === 'edit'" v-model="row.bookingHour" :disabled="mode === 'view'" @input="handleInput(row, 'bookingHour')" /> -->
          <span v-else>{{ row.bookingHour }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Haulier" align="center" prop="freightContractor" min-width="200px">
        <template slot-scope="{ row }">
          <el-input v-if="mode === 'edit'" v-model="row.freightContractor" :disabled="mode === 'view'"/>
          <span v-else>{{ row.freightContractor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Score" align="center" prop="score" min-width="100px">
        <template slot-scope="{ row }">
          <el-input v-if="mode === 'edit'" v-model="row.score" :disabled="mode === 'view'" @input="handleInput(row, 'score')" />
          <span v-else>{{ row.score }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Priority Type" align="center" prop="priorityType" min-width="100px">
        <template slot-scope="{ row }">
          <el-input v-if="mode === 'edit'" v-model="row.priorityType" :disabled="mode === 'view'" @input="handleInput(row, 'priorityType')" />
          <span v-else>{{ row.priorityType }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="Send To WH" align="center" prop="dc" min-width="150px">
        <template slot-scope="{ row }">
          <el-input v-if="mode === 'edit'" v-model="row.dc" :disabled="mode === 'view'" @input="handleDCInput(row, 'dc')" @blur="handleDCBlur(row, 'dc')"/>
          <span v-else>{{ row.dc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="DC Code" align="center" prop="planDcCode" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.planDcCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Approved for External WH" align="center" prop="approvedForExternalWh" min-width="150px">

        <template slot-scope="{ row }">
          <el-select v-if="mode === 'edit'"  v-model="row.approvedForExternalWh" placeholder="Select Mode"  :disabled="mode === 'view'" style="width: 100%;">
            <el-option v-for="item in approvedForExternalWhOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
          <span v-else>{{ row.approvedForExternalWh }}</span>
        </template>

      </el-table-column>
      <el-table-column label="Container Number" align="center" prop="containerNo" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.containerNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Container Size" align="center" prop="containerType" min-width="110px">
        <template slot-scope="{ row }">
          <span>{{ row.containerType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Carrier" align="center" prop="carrier" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.carrier }}</span>
        </template>
      </el-table-column>
      <el-table-column label="POL" align="center" prop="pol" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.pol }}</span>
        </template>
      </el-table-column>
      <el-table-column label="POD" align="center" prop="pod" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.pod }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Vessel" align="center" prop="vessel" min-width="200px">
        <template slot-scope="{ row }">
          <span>{{ row.vessel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Voyage" align="center" prop="voyage" min-width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.voyage }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Docs Number" align="center" prop="mpNumber" min-width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.mpNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="hbl Number" align="center" prop="hblNumber" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.hblNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$constants.MBL_NUMBER" align="center" prop="mblNumber" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.mblNumber }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" v-if="mode === 'edit'">
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <!-- 修改：绑定 disabled 属性，仅当数据有变更时可用 -->
      <el-button type="primary" @click="handleSubmit" :disabled="!hasDataChanged">Confirm</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDestinationDcList, getDestinationDeliveryPlanList } from '@/api/destination/destination';

// 公共字段配置
const EDITABLE_FIELDS = [
  'transportMode', 'dcDate', 'bookingHour', 'freightContractor',
  'score', 'priorityType', 'dc', 'inlandCarrier', 'approvedForExternalWh'
];

export default {
  name: 'MilestoneDeliveryPlanTableDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    containerData: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      default: 'edit',
      validator: value => ['edit', 'view'].includes(value)
    },
    // 1 是 pre delivery plan
    // 2 是 delivery plan
    deliveryPlanType: {
      type: Number,
      default: 1,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      tableData: [{
        id: null,
        type: this.deliveryPlanType,
        shipmentId: this.containerData.shipmentId,
        destinationContainerId: this.containerData.id,
        containerNo: this.containerData.containerNo,
        containerType: this.containerData.containerType,
        carrier: this.containerData.carrier,
        vessel: this.containerData.vessel,
        voyage: this.containerData.voyage,
        pol: this.containerData.pol,
        pod: this.containerData.containerPod,
        eta: this.containerData.containerEta,
        mpNumber: this.containerData.lpNumber,
        hblNumber: this.containerData.hblNumber,
        mblNumber: this.containerData.mblNumber,
        approvedForExternalWh: this.containerData.approvedForExternalWh,
        score: '',
        dcDate: null,
        bookingHour: '',
        inlandCarrier: '',
        freightContractor: '',
        priorityType: '',
        transportMode: '',
        dc: ''
      }],
      originalTableData: [],
      transportModeOptions:[
        { value: 'INTERMODAL', label: 'INTERMODAL' },
        { value: 'DIRECT TRUCK', label: 'DIRECT TRUCK' },
      ],
      approvedForExternalWhOptions: [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
      ],
      dcNameList:[],
      isDataLoaded: false
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (val) {
        this.resetTableData()
      }
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit('update:visible', false)
      }
    }
  },
  async created() {
    console.log('visible', this.mode)
    try {
      // 等待获取DC列表
      const response = await getDestinationDcList()
      console.log('获取DC列表:', response.data)
      this.dcNameList = response.data
    } catch (error) {
      console.error('获取DC列表失败:', error)
    }
    this.fillDeliveryPlanData()
  },
  computed: {
    hasDataChanged() {
      if (!this.isDataLoaded) {
        return false;
      }

      if (this.originalTableData.length === 0 && this.tableData.length === 0) {
        return false;
      }
      if (this.originalTableData.length !== this.tableData.length) {
        return true;
      }

      for (let i = 0; i < this.tableData.length; i++) {
        const current = this.tableData[i];
        const original = this.originalTableData[i];

        if (!original) return true;

        // 比对
        for (const field of EDITABLE_FIELDS) {
          const val1 = current[field] === '' ? null : current[field];
          const val2 = original[field] === '' ? null : original[field];

          if (val1 !== val2) {
            return true;
          }
        }
      }
      return false;
    }
  },
  methods: {
    handleInput(row, field) {
      if (row[field]) {
        row[field] = row[field].replace(/\s+/g, '')
        console.log('绑定值类型：', typeof row[field], row[field])
      }
    },
    handleDCInput(row, field) {
      // 输入过程中允许空格，但失去焦点或提交时去除首尾空格
      // 这里可以添加实时处理逻辑
      console.log('DC输入处理:', row[field]);
    },

    // 添加失去焦点处理方法
    handleDCBlur(row, field) {
      if (row[field]) {
        row[field] = row[field].trim();
        console.log('DC字段去空格后:', row[field]);
      }
    },
    // 解析DC列表
    parseDcList() {
      const dcString = this.containerData.dc || '';
      const dcList = dcString.split(',').map(dc => dc.trim()).filter(dc => dc !== '');
      return dcList.length > 0 ? dcList : [''];
    },
    // 预填充表格数据
    prefillTableData() {
      const dcList = this.parseDcList();
      console.log('this.deliveryPlanType:', this.deliveryPlanType);
      this.tableData = dcList.map(currDc => ({
        // 获取container data row上的即时数据
        type: this.deliveryPlanType,
        shipmentId: this.containerData.shipmentId,
        destinationContainerId: this.containerData.id,
        containerNo: this.containerData.containerNo,
        containerType: this.containerData.containerType,
        carrier: this.containerData.carrier,
        vessel: this.containerData.vessel,
        voyage: this.containerData.voyage,
        pol: this.containerData.pol,
        pod: this.containerData.pod,
        eta: this.containerData.eta,
        mpNumber: this.containerData.lpNumber,
        hblNumber: this.containerData.hblNumber,
        mblNumber: this.containerData.mblNumber,
        dcCode: this.containerData.dc,
        planDcCode: currDc,
        // 用户输入的数据
        id: null,
        score: '',
        dcDate: null,
        bookingHour: '',
        inlandCarrier: '',
        freightContractor: '',
        priorityType: '',
        transportMode: '',
        dc: this.dcNameList ? this.getDcName(currDc) : ''
      }));
      console.log('tableData', this.tableData)
    },
    fillDeliveryPlanData() {
      console.log('fillDeliveryPlanData', this.deliveryPlanType, this.containerData.id)

      // 先进行预填充
      this.prefillTableData();

      getDestinationDeliveryPlanList({ type: this.deliveryPlanType, destinationContainerId: this.containerData.id })
        .then(res => {
          if (res.data) {
            // 按 dcCode 分组并获取每组最新记录
            const groupedData = this.groupByDcCodeAndGetLatest(res.data);
            console.log('groupedData', groupedData)
            // 创建DC到数据的映射
            const dataMap = {};
            groupedData.forEach(item => {
              dataMap[item.planDcCode] = item;
            });
            console.log('dataMap', dataMap)
            console.log('this.tableData', this.tableData)
            this.tableData = this.tableData.map(row => {
              const existingData = dataMap[row.planDcCode];
              if (existingData) {
                return {
                  ...row,
                  id: existingData.id,
                  transportMode: existingData.transportMode,
                  dcDate: this.mode == 'view' ? existingData.dcDate : this.parseUTCTime(existingData.dcDate),
                  bookingHour: existingData.bookingHour,
                  inlandCarrier: existingData.inlandCarrier,
                  freightContractor: existingData.freightContractor,
                  approvedForExternalWh: existingData.approvedForExternalWh,
                  score: existingData.score,
                  priorityType: existingData.priorityType,
                  dc: existingData.dc
                };
              }
              return row;
            });

            // 保存原始对比
            this.originalTableData = JSON.parse(JSON.stringify(this.tableData));
            this.isDataLoaded = true;
          }
        }).catch(err => {
          console.error('获取数据失败:', err);
        })
    },
    /**
    * 按 dcCode 分组并获取每组最新记录
    * @param {Array} data - 原始数据数组
    * @returns {Array} - 每组最新记录组成的数组
    */
    groupByDcCodeAndGetLatest(data) {
      if (!Array.isArray(data) || data.length === 0) {
        return [];
      }
      // 按 dcCode 分组
      const grouped = data.reduce((acc, item) => {
        const key = item.planDcCode || 'unknown';
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {});
      // 获取每组最新记录
      const latestRecords = Object.values(grouped).map(group => {
        return group.reduce((latest, current) => {
          // 假设使用 createdAt 字段判断最新记录，如果没有则使用 id
          const latestTime = latest.createTime;
          const currentTime = current.createTime;
          return currentTime > latestTime ? current : latest;
        });
      });

      return latestRecords;
    },
    handleClose() {
      this.dialogVisible = false
      this.resetTableData()
      this.isDataLoaded = false
      this.$emit('update:visible', false)
    },
    handleSubmit() {
      // 验证 score 是否为整数
      const invalidScoreRow = this.tableData.find(row => {
        if (row.score === '' || row.score === null || row.score === undefined) {
          return false;
        }
        return !/^\d+$/.test(row.score.toString());
      });

      if (invalidScoreRow) {
        this.$message.error('Score must be a number!');
        return;
      }

      const submitData = this.tableData.filter((row, index) => {
        const original = this.originalTableData[index];
        if (!original) {
          return true;
        }
        // 仅当字段值发生变化时才提交
        for (const field of EDITABLE_FIELDS) {
          const val1 = row[field] === '' ? null : row[field];
          const val2 = original[field] === '' ? null : original[field];
          if (val1 !== val2) {
            return true;
          }
        }
        // 所有字段均未变化，过滤掉
        return false;
      }).map(row => {
        return {
          ...row,
          freightContractor: row.freightContractor ? row.freightContractor.trim() : row.freightContractor
        };
      });
      if (submitData.length === 0) {
        this.$message.info('No changes detected, nothing to submit.');
        return;
      }
      submitData.forEach(item => {
        if (!item.id) {
          console.log('准备提交新增数据:', item.containerNo, item.planDcCode);
        } else {
          console.log('准备提交更新数据:', item.containerNo, item.planDcCode, 'ID:', item.id);
        }
      });

      this.$emit('submit', submitData)

      this.originalTableData = JSON.parse(JSON.stringify(this.tableData));

      this.resetTableData()
      this.dialogVisible = false
    },
    resetTableData() {
      this.tableData = []
      // 新增：重置时清空原始快照
      this.originalTableData = []
    },
    getDcName(dcCodes) {
      if (!dcCodes) return ''
      return dcCodes
        .split(',')
        .map(code => {
          const match = this.dcNameList.find(item => item.dcCode === code.trim())
          return match ? match.dcName : code
        })
        .join(', ')
    },
  }
}
</script>
