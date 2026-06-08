<template>
  <!-- <el-card class="comment-section"> -->
  <el-card class="comment-section">
    <div v-if="!noTitle">
      <div style="margin-bottom: 5px;">
        <span style="font-size: 20px; margin-bottom: 10px;  margin-top: 10px; font-weight: 700;">Comments({{ comments.length }})</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="refresh">Refresh</el-button>
      </div>
      <el-divider></el-divider>
    </div>

    <div class="comment-container">
      <!-- Left Section: Input and Send Button -->
      <div class="comment-input">
        <el-input v-model="newComment.content" type="textarea" placeholder="Give some additional information here..." rows="4"></el-input>
        <!-- 按钮居右 -->
        <div class="button-container">
          <el-button type="primary" style="width: 20%" @click="sendComment">SEND</el-button>
        </div>
      </div>

      <!-- Right Section: Comment List -->
      <div class="comment-list">
        <el-timeline>
          <el-timeline-item v-for="(comment, index) in comments" :key="index" :timestamp="comment.time">
            <div>
              <strong>{{ comment.email }}</strong>
              <el-tag v-if="comment.type" :type="comment.tagType" style="margin-left: 10px;">{{ comment.type }}</el-tag>
            </div>
            <div>{{ comment.content }}</div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </el-card>
</template>

  <script>
import { parseTime } from '@/utils/ruoyi'
import { createOrderComment, orderCommentAll } from '@/api/system/order-comment'

export default {
  name: 'CommentInput',
  props: {
    orderId: {
      type: String | Number,
      default: ''
    },
    orderType: {
      type: String,
      default: '2' // 1: order, 2: shippingOrder, 3: shipment
    },
    noTitle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newComment: {
        email: 'user@example.com', // Replace with actual user email
        type: '',
        content: ''
      },
      comments: []
    }
  },
  created() {
    this.loadComments()
  },
  methods: {
    refresh() {
      console.log('refresh')
      this.loadComments('refresh')
    },
    loadComments(type) {
      const params = { orderId: this.orderId, orderType: this.orderType }
      orderCommentAll(params).then(res => {
        this.comments = []
        res.data.forEach(comment => {
          const commentData = {
            email: comment.commentUser,
            time: formatUserLocalTime(comment.createTime, comment.timeZone, comment.timeZoneOffset),
            type: comment.commentType,
            content: comment.content,
            tagType: this.getTagType(comment.commentType)
          }
          this.comments.push(commentData)
        })
        if (type === 'refresh') {
          this.$message.success('Refresh Success')
        }
      })
    },
    sendComment() {
      console.log('Sending comment:', this.newComment)
      if (!this.newComment.content) {
        this.$message.error('please input comment content.')
        return
      }
      let command = { orderId: this.orderId, orderType: this.orderType, content: this.newComment.content, commentType: 'Comment' }
      createOrderComment(command)
        .then(() => {
          this.$message.success('Send Success')
          this.loadComments()
          this.newComment.content = ''
        })
        .catch(() => {
          this.$message.error('Send Failed')
        })
    },
    getTagType(commentType) {
      switch (commentType) {
        case 'Reject':
          return 'warning'
        case 'Accept':
          return 'success'
        case 'Cancel':
          return 'danger'
        case 'Pre Assign':
          return ''
        case 'Comment':
          return 'info'
        default:
          return ''
      }
    }
  }
}
</script>

<style scoped>
.comment-section {
  padding: 15px;
}

.comment-container {
  display: flex;
  justify-content: space-between;
}

.comment-input {
  width: 45%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.type-select {
  width: 100%;
}

.button-container {
  display: flex;
  justify-content: flex-end;
}

.comment-list {
  width: 50%;
  height: 200px;
  overflow-y: auto;
}
</style>
