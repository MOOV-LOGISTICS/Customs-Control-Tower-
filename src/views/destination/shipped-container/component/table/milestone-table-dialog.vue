<template>
  <el-dialog :visible.sync="dialogVisible" title="Edit Table" width="60%" @close="handleClose" :modal="false">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="label" width="200">
        <template slot-scope="{ row }">
          <span>{{ row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column >
        <template slot-scope="{ row }">
          <el-input v-if="mode === 'edit'" v-model="row.value" :disabled="mode === 'view'" @input="handleInput(row)" />
          <span v-else>{{ row.value }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" v-if="mode === 'edit'">
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit">Confirm</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'MilestoneTableDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    destinationMilestoneCommand: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      default: 'edit',
      validator: value => ['edit', 'view'].includes(value)
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      tableData: []
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit('update:visible', false);
      }
    },
    'destinationMilestoneCommand.formData': {
      immediate: true,
      handler(val) {
        try {
          let parsedData = typeof val === 'string' ? JSON.parse(val) : val;
          if (typeof parsedData === 'string') {
            parsedData = JSON.parse(parsedData);
          }
          // 转换 formData 为表格数据结构 { label, value }
          this.tableData = parsedData.map(item => ({
            label: item.label,
            value: item.value ?? ''
          }));
        } catch (e) {
          this.tableData = [];
        }
      }
    }
  },
  methods: {
    handleInput(row) {
      // 禁止输入空格
      row.value = row.value.replace(/\s+/g, '');
    },
    handleClose() {
      this.$emit('update:visible', false);
    },
    handleSubmit() {
      // 更新原始 formData 数据结构
      const updatedFormData = this.tableData.map(row => ({
        label: row.label,
        value: row.value
      }));

      const updatedCommand = {
        ...this.destinationMilestoneCommand,
        formData: JSON.stringify(updatedFormData)
      };

      this.$emit('submit', updatedCommand);
      this.dialogVisible = false;
    }
  }
};
</script>