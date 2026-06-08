<template>
  <el-dialog
    :visible="reminderVisible"
    width="50%"
    modal
    close-on-click-modal
    @close="onClose">
    <div slot="title" class="title">
      Products Confirmation
    </div>
    <el-card :body-style="{ padding: '16px' }">
      <div class="tip-title">
        The following data differences from the original booking information have been detected:
      </div>
      <div v-for="item in reminderData">
        <div class="tip-item">
          <span class="tip-item-weight">{{ item.name }}</span> -- <span class="tip-item-weight">Original:</span> {{ item.original }}; <span class="tip-item-weight">Current:</span> {{ item.current }};
        </div>
      </div>
    </el-card>
    <div slot="footer">
      <el-button @click="onClose">Return to Modify</el-button>
      <el-button type="primary" @click="onSubmit">Confirm Submit</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: "differentReminder",
  props: ['reminderVisible', 'reminderData', 'updateData', 'reminderType', 'handleClose', 'updateSI', 'draftUpdateSI'],
  methods: {
    onClose() {
      this.$emit('handleClose')
    },
    onSubmit() {
      if (this.reminderType === 'submit') {
        this.$emit('updateSI', this.updateData)
      } else if (this.reminderType === 'draft') {
        this.$emit('draftUpdateSI', this.updateData)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  color: #FFFFFF;
  text-align: center;
  font-size: 16px;
  line-height: 28px;
}
.tip-title {
  color: #4e5969;
  margin-bottom: 20px;
  line-height: 1.6;
  font-size: 14px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}
.tip-item {
  background-color: #fffbf5;
  border: 1px solid #ffe8cc;
  border-radius: 8px;
  padding: 20px;
  overflow-y: auto;
  margin-bottom: 15px;
  .tip-item-weight {
    font-weight: bold;
  }
}
</style>
