<template>
  <el-dialog
    :visible="goodsReminderVisible"
    width="50%"
    modal
    close-on-click-modal
    @close="onClose">
    <div slot="title" class="title">
      Products and Containers Confirmation
    </div>
    <el-card :body-style="{ padding: '16px' }">
      <div class="tip-title">
        The following information is inconsistent between Products and Containers. You can go back and make the necessary modifications to ensure consistency:
      </div>
      <div v-for="item in goodsReminderData">
        <div class="tip-item">
          <span class="tip-item-weight">{{ item.productName }} - {{ item.containerName }}</span>:
          <div class="tip-space">
            <span class="tip-item-weight">Products - {{ item.productName }} :</span> <span class="tip-data">{{ item.product.toFixed(3) }}</span>;
          </div>
          <div class="tip-space">
            <span class="tip-item-weight">Containers - {{ item.containerName }} :</span> <span class="tip-data">{{ item.container.toFixed(3) }}</span>;
          </div>
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
  name: "goodsInfoReminder",
  props: ['goodsReminderVisible', 'goodsReminderData', 'originalShipperData', 'updateData', 'reminderType', 'handleClose', 'onGoodsConfirm', 'onGoodsDraft'],
  methods: {
    onClose() {
      this.$emit('handleClose')
    },
    onSubmit() {
      if (this.reminderType === 'submit') {
        this.$emit('onGoodsConfirm', this.originalShipperData, this.updateData)
      } else if (this.reminderType === 'draft') {
        this.$emit('onGoodsDraft', this.originalShipperData, this.updateData)
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
  color: #ea0c34;
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
  .tip-space {
    padding-top: 8px;
    .tip-item-weight {
      font-weight: bold;
    }
    .tip-data {
      color: #ea0c34;
    }
  }

}
</style>
