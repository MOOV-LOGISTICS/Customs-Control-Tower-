<template>
  <el-dialog 
    :visible.sync="dialogVisible" 
    :title="containerData.containerNo" 
    width="60%" 
    @close="handleClose" 
    :modal="false"
  >
    <div v-if="!containerData.dc" class="warning-message">
      <el-alert
        title="The container DC has not been synced in time, please contact support."
        type="warning"
        :closable="false"
        show-icon
      />
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="DC" align="center" prop="dc" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.dc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="DC Code" align="center" prop="dcCode" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.dcCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Arrive Date" align="center" prop="arriveDate" min-width="160px">
        <template slot-scope="{ row }">
          <el-date-picker 
            v-if="mode === 'edit'" 
            v-model="row.arriveDate" 
            type="date" 
            placeholder="Select Date" 
            :disabled="mode === 'view'" 
            :clearable="false"
            :editable="false"
          />
          <!-- 修改：View 模式下格式化日期显示 -->
          <span v-else>{{ formatDate(row.arriveDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Arrive Hour" align="center" prop="arriveHour" min-width="160px">
        <template slot-scope="{ row }">
          <el-time-picker 
            v-if="mode === 'edit'" 
            type="time" 
            format="HH:mm" 
            value-format="HH:mm"
            v-model="row.arriveHour" 
            placeholder="Select Time" 
            :disabled="mode === 'view'" 
            :clearable="false"
            :editable="false"
          ></el-time-picker>
          <span v-else>{{ row.arriveHour }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" v-if="mode === 'edit'">
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit" :disabled="!isDataChanged">Confirm</el-button>
    </div>
  </el-dialog>
</template>

<script>


export default {
  name: 'MilestoneArrivalAtDcTableDialog',
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
    destinationMilestoneCommand: {
      type: Object,
      required: true
    },
    dcNameList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      tableData: [],
      originalTableData: []
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.dialogVisible = val
        if (val) {
          this.resetTableData()
          this.fillArrivalAtDcData()
        }
      },
      immediate: true
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit('update:visible', false)
      }
    }
  },
  computed: {
    // 检查数据是否发生变化
    isDataChanged() {
      // 检查原始数据中是否所有行的 arriveDate 和 arriveHour 都为空
      const allOriginalFieldsEmpty = this.originalTableData.every(row => 
        !row.arriveDate && !row.arriveHour
      )
      
      // 如果原始数据中所有行的 arriveDate 和 arriveHour 都为空，允许提交
      if (allOriginalFieldsEmpty) {
        return true
      }
      
      // 如果原始数据和当前数据长度不同，说明发生了变化
      if (this.originalTableData.length !== this.tableData.length) {
        return true
      }
      
      // 检查每个DC的arriveDate、arriveHour和dc是否发生变化
      for (let i = 0; i < this.tableData.length; i++) {
        const originalRow = this.originalTableData[i]
        const currentRow = this.tableData[i]
        
        if (originalRow.arriveDate !== currentRow.arriveDate || 
            originalRow.arriveHour !== currentRow.arriveHour ||
            originalRow.dc !== currentRow.dc) {
          return true
        }
      }
      
      return false
    }
  },
  methods: {
    // 新增：格式化日期用于显示
    formatDate(dateStr) {
      if (!dateStr) return '';
      // 如果已经是 YYYY-MM-DD 格式直接返回
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
      
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    },
    // 根据 dcCode 获取 dc 名称
    getDcName(dcCode) {
      if (!dcCode) return ''
      const match = this.dcNameList.find(item => item.dcCode === dcCode.trim())
      return match ? match.dcName : dcCode
    },
    handleDCBlur(row, field) {
      if (row[field]) {
        row[field] = row[field].trim()
      }
    },
    // 解析 DC 列表
    parseDcList() {
      const dcString = this.containerData.dc || ''
      const dcList = dcString.split(',').map(dc => dc.trim()).filter(dc => dc !== '')
      return dcList.length > 0 ? dcList : ['']
    },
    // 预填充表格数据
    prefillTableData() {
      const dcList = this.parseDcList()
      this.tableData = dcList.map(currDc => ({
        dcCode: currDc,
        dc: this.getDcName(currDc),
        arriveDate: '',
        arriveHour: ''
      }))
    },
    // 填充 Arrival at DC 数据
    fillArrivalAtDcData() {
      this.prefillTableData()
      
      // 尝试从 formData 中解析已有的数据
      try {
        const formData = this.destinationMilestoneCommand.formData
        if (formData && formData !== '[]') {
          let parsedData = typeof formData === 'string' ? JSON.parse(formData) : formData
          if (typeof parsedData === 'string') {
            parsedData = JSON.parse(parsedData)
          }
          
          // 如果是旧格式（单个时间），转换为新格式
          if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData[0].label === 'Arrive Date') {
            // 旧格式转换
            this.tableData = this.tableData.map(row => ({
              ...row,
              arriveDate: parsedData.find(item => item.label === 'Arrive Date')?.value || '',
              arriveHour: parsedData.find(item => item.label === 'Arrive Hour')?.value || ''
            }))
          } else if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData[0].dcCode) {
            // 新格式，保持预填充的 dc 结构，只更新时间数据
            this.tableData = this.tableData.map(prefilledRow => {
              // 尝试从 parsedData 中找到对应的 dcCode 行
              const matchingRow = parsedData.find(row => row.dcCode === prefilledRow.dcCode)
              return {
                ...prefilledRow,
                // 只更新时间数据，保持 dc 和 dcCode 为预填充的值
                arriveDate: matchingRow?.arriveDate || '',
                arriveHour: matchingRow?.arriveHour || ''
              }
            })
          }
        }
      } catch (error) {
        console.error('解析 formData 失败:', error)
      }
      
      // 保存原始数据副本
      this.originalTableData = JSON.parse(JSON.stringify(this.tableData))
    },
    handleClose() {
      this.dialogVisible = false
      this.resetTableData()
      this.$emit('update:visible', false)
    },
    handleSubmit() {
      // 复制一份 tableData 用于过滤和校验，避免直接影响页面显示
      const filteredData = this.tableData.filter(row => !!row.arriveDate || !!row.arriveHour);
      
      // 如果过滤后数据为空，说明全空，禁止提交
      if (filteredData.length === 0) {
        this.$message({
          message: 'Please enter at least one delivery date and hour.',
          type: 'warning'
        });
        return;
      }

      for (let i = 0; i < filteredData.length; i++) {
        const row = filteredData[i];
        const hasDate = !!row.arriveDate;
        const hasHour = !!row.arriveHour;

        // 校验规则：如果填了其中一个，另一个也必须填
        if ((hasDate || hasHour) && (!hasDate || !hasHour)) {
          this.$message({
            message: 'Please check data to ensure container delivered have both delivery date and delivery hour.',
            type: 'warning'
          });
          return;
        }

        // 校验规则：日期不能是未来时间
        if (hasDate) {
          // 修改：处理可能的 Date 对象或字符串
          const selectedDate = row.arriveDate instanceof Date ? row.arriveDate : new Date(row.arriveDate);
          // 获取当前日期（去除时间部分以便只比较日期）
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (selectedDate > today) {
            this.$message({
              message: 'The arrival date in the future. Please correct and reupload.',
              type: 'warning'
            });
            return;
          }
        }
      }

      // 创建提交数据，使用过滤后的数据，并处理日期和时间格式
      const submitData = filteredData.map(row => {
        let formattedDate = row.arriveDate;
        // 如果 arriveDate 是 Date 对象，则格式化为 'YYYY-MM-DD' 字符串
        if (row.arriveDate instanceof Date) {
          const y = row.arriveDate.getFullYear();
          const m = String(row.arriveDate.getMonth() + 1).padStart(2, '0');
          const d = String(row.arriveDate.getDate()).padStart(2, '0');
          formattedDate = `${y}-${m}-${d}`;
        }
        
        // 处理 arriveHour 格式，确保为 'HH:mm' 字符串
        let formattedHour = row.arriveHour;
        // 如果使用了 value-format="HH:mm"，这里通常已经是字符串，但为了保险起见处理 Date 对象情况
        if (row.arriveHour instanceof Date) {
          const h = String(row.arriveHour.getHours()).padStart(2, '0');
          const min = String(row.arriveHour.getMinutes()).padStart(2, '0');
          formattedHour = `${h}:${min}`;
        }
        
        return {
          ...row,
          arriveDate: formattedDate,
          arriveHour: formattedHour
        };
      });
      
      const updatedCommand = {
        ...this.destinationMilestoneCommand,
        formData: JSON.stringify(submitData)
      }
      
      this.$emit('submit', updatedCommand)
      this.resetTableData()
      this.dialogVisible = false
    },
    resetTableData() {
      this.tableData = []
    }
  }
}
</script>