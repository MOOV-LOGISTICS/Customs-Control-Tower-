<template>
  <div class="comment-thread">
    <!-- Rejection context — the opening "system" message of the conversation -->
    <div v-if="doc.reject" class="ct-reject">
      <div class="ct-reject-head"><i class="el-icon-warning-outline"></i> {{ doc.reject.reason }}</div>
      <div v-if="doc.reject.remark" class="ct-reject-remark">{{ doc.reject.remark }}</div>
      <div class="ct-reject-by">{{ doc.reject.by }} · {{ doc.reject.at }} · {{ doc.reject.milestone }}</div>
    </div>

    <div ref="scroll" class="ct-messages">
      <div v-if="!doc.thread.length" class="ct-empty">No messages yet — start the conversation below.</div>
      <div v-for="(m, i) in doc.thread" :key="i"
        :class="['ct-msg', m.role === role ? 'mine' : 'theirs', { system: m.system }]">
        <div class="ct-bubble">
          <div class="ct-text">{{ m.text }}</div>
          <div class="ct-meta">{{ m.by }} · {{ m.at }}</div>
        </div>
      </div>
    </div>

    <div class="ct-input">
      <el-input v-model="draft" type="textarea" :rows="2" resize="none" :placeholder="placeholder" />
      <el-button type="primary" size="small" icon="el-icon-s-promotion" :disabled="!draft.trim()" @click="send">Send</el-button>
    </div>
  </div>
</template>

<script>
import { postComment } from '@/store/reviewFlow'

export default {
  name: 'CommentThread',
  props: {
    hbl:  { type: Object, required: true },
    doc:  { type: Object, required: true },
    role: { type: String, required: true },   // 'supplier' | 'reviewer' — viewer's side
    user: { type: String, required: true },   // display name written onto each message
  },
  data() { return { draft: '' } },
  computed: {
    placeholder() {
      return this.role === 'supplier'
        ? 'Explain your view to the reviewer (e.g. why the current document is the correct one)…'
        : 'Reply to the supplier…'
    },
  },
  mounted() { this.scrollToEnd() },
  methods: {
    send() {
      const text = this.draft.trim()
      if (!text) return
      postComment(this.hbl, this.doc, { text, role: this.role, user: this.user })
      this.draft = ''
      this.scrollToEnd()
      this.$emit('posted')
    },
    scrollToEnd() {
      this.$nextTick(() => {
        const el = this.$refs.scroll
        if (el) el.scrollTop = el.scrollHeight
      })
    },
  },
}
</script>

<style lang="scss" scoped>
$primary: #004F7C;
.comment-thread { display: flex; flex-direction: column; }

.ct-reject {
  background: #fff0f0; border: 1px solid #ffd6d6; border-radius: 6px;
  padding: 8px 12px; margin-bottom: 10px;
  .ct-reject-head   { color: #ff4949; font-weight: 700; font-size: 12px; }
  .ct-reject-remark { color: #606266; font-size: 12px; margin-top: 2px; }
  .ct-reject-by     { color: #999; font-size: 10px; margin-top: 3px; }
}

.ct-messages {
  max-height: 320px; overflow-y: auto; padding: 4px;
  display: flex; flex-direction: column; gap: 8px;
}
.ct-empty { text-align: center; color: #c0c4cc; font-size: 12px; padding: 18px; }

.ct-msg { display: flex; }
.ct-msg.mine   { justify-content: flex-end; }
.ct-msg.theirs { justify-content: flex-start; }
.ct-bubble { max-width: 78%; padding: 7px 11px; border-radius: 10px; font-size: 12px; line-height: 1.5; }
.ct-msg.theirs .ct-bubble { background: #f0f2f5; color: #303133; border-bottom-left-radius: 3px; }
.ct-msg.mine   .ct-bubble { background: #e8f0f6; color: $primary; border-bottom-right-radius: 3px; }
.ct-msg.system .ct-bubble { background: #e6f9ef; color: #0d9b50; font-style: italic; }
.ct-text { white-space: pre-wrap; word-break: break-word; }
.ct-meta { font-size: 10px; color: #a0a4ab; margin-top: 3px; }

.ct-input { margin-top: 10px; display: flex; gap: 8px; align-items: flex-end; }
.ct-input ::v-deep .el-textarea { flex: 1; }
</style>
