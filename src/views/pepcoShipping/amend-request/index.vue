<template>
  <div>
    <el-card class="pd-20" style="float: left; width: auto; margin-right: 20px; margin-top: 10px">
      <icon-park style="border-right: 1px solid #ddd;" type="message-unread" theme="filled" size="48" fill="#004F7C" strokeLinejoin="miter" strokeLinecap="square" />
      <div style="float: right; line-height: 24px; margin-left: 10px; border-radius: 10px; padding: 0px 15px; cursor: pointer;">
        <p style="font-size: 20px;">{{ count }}</p>
        <p>Pending Request</p>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    handleQuery() {
      // Add your query handling logic here
      console.log('Query updated:', 0)
    }
  }
}
</script>

<style scoped>
.avticePort {
  background-color: #f0f8ff;
}
</style>