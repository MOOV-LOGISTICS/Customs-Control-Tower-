<template>
  <el-dialog
    :title="title"
    :visible="visible"
    @close="handleClose"
    width="600px"
    :close-on-click-modal="false"
  >
    <div class="cbm-warning-content">
      <div class="warning-header">
        <i class="el-icon-warning" style="margin-right: 8px; color: #FAAD14; font-size: 18px;"></i>
        <span class="warning-title">The following items have CBM changed by more than 1:</span>
      </div>
      <el-table :data="parsedDetails" style="width: 100%; margin: 16px 0;" size="small">
        <el-table-column prop="productCode" label="Item Number" width="140" />
        <el-table-column prop="tcId" label="TCId" width="100" />
        <el-table-column prop="originalCBM" label="Original CBM" width="100" />
        <el-table-column prop="newCBM" label="New CBM" width="100" />
        <el-table-column prop="diff" label="Diff" />
      </el-table>
      <div class="warning-footer">
        <span>Do you want to continue?</span>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">Cancel</el-button>
      <el-button type="primary" @click="handleConfirm">Confirm</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'CbmWarningDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Warning'
    },
    details: {
      type: String,
      default: ''
    }
  },
  computed: {
    parsedDetails() {
      // 解析details字符串为表格数据
      const items = [];
      if (!this.details) return items;
      
      // 分割每个项目
      const itemTexts = this.details.split('<br><br>');
      itemTexts.forEach(itemText => {
        if (!itemText.trim()) return;
        
        // 提取各个字段
        const lines = itemText.split('<br>');
        if (lines.length < 2) return;
        
        const itemNumberMatch = lines[0].match(/Item Number: (\S+) &nbsp;  TCId: (\S+)/);
        const cbmMatch = lines[1].match(/Original (\S+) → New (\S+) \(Diff: ([+-]?\S+)\)/);
        
        if (itemNumberMatch && cbmMatch) {
          items.push({
            productCode: itemNumberMatch[1],
            tcId: itemNumberMatch[2],
            originalCBM: cbmMatch[1],
            newCBM: cbmMatch[2],
            diff: cbmMatch[3]
          });
        }
      });
      
      return items;
    }
  },
  methods: {
    handleConfirm() {
      this.$emit('confirm');
    },
    handleCancel() {
      this.$emit('cancel');
    },
    handleClose() {
      this.$emit('cancel');
    }
  }
}
</script>

<style scoped>
.cbm-warning-content {
  padding: 10px 0;
}

.warning-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-weight: 500;
  color: #303133;
}

.warning-footer {
  margin-top: 16px;
  font-weight: 500;
  color: #303133;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.warning-title {
  color: red;
}

/* 表格样式 */
::v-deep .el-table {
  border-radius: 4px;
  overflow: hidden;
}

::v-deep .el-table th {
  background-color: #f5f7fa;
  font-weight: 500;
}

::v-deep .el-table td {
  padding: 8px 0px;
}
</style>