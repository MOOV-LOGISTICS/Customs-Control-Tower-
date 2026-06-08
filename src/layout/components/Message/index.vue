<template>
  <div>
    <el-popover placement="bottom" width="500" trigger="click" title="Notifications"
    >
      <!-- icon 展示 -->
      <el-badge class="item" slot="reference"  :hidden="unreadCount==0" :value="unreadCount" :max="99" >
        <el-button style="font-size: 20px;border: 0px;background-color:transparent;" class="el-icon-message-solid" type="primary" @click="getList"></el-button>
      </el-badge>

      <div class="popover-content"  >
        <el-scrollbar style="height:300px;">
          <el-empty v-show="list.length==0"></el-empty>
          <el-card
            style="box-shadow: none;background-color: #e6ebf5;margin-bottom: 10px;padding: 10px"
            v-for="item in list" :key="item.id" @click.native="handleUpdateSingle(item)">
            <span class="text-time">{{ parseTime(item.createTime,'{y}-{m}-{d} {h}:{i}') }}</span>
            <p class="text-ellipsis" v-html="item.templateNickname"></p>
            <!-- <div class="text-ellipsis" v-html="item.templateNickname"></div> -->
          </el-card>
        </el-scrollbar>
        <span @click="handleUpdateAll" class="mark-as-read"> {{ $t('notify.allRead') }}</span>
      </div>
      <!-- 更多 -->
      <div style="text-align: right; margin-top: 10px">
        <!-- <el-button size="mini"  type="primary"  @click="handleUpdateAll"> {{ $t('notify.allRead') }}</el-button> -->
        <el-button size="mini"  type="primary"  @click="goMyList"> {{ $t('notify.viewAll') }}</el-button>
      </div>
    </el-popover>

    <el-dialog v-model="clickItem" title="Notification" :visible.sync="messageShow" width="1200px" append-to-body>
      <H2 style="padding: 0; margin: 0;font-weight: 700;">{{ clickItem.templateNickname }}</H2>
      <p style="color: #868e95;font-size: 12px;">{{ parseTime(clickItem.createTime) }}</p>
      <p v-html="clickItem.templateContent"></p>
    </el-dialog>
  </div>
</template>

<script>
import {getUnreadNotifyMessageCount, getUnreadNotifyMessageList,updateAllNotifyMessageRead,updateNotifyMessageRead} from "@/api/system/notify/message";

export default {
  name: 'NotifyMessage',
  data() {
    return {
      // 遮罩层
      loading: false,
      // 列表
      list: [],
      // 未读数量,
      unreadCount: 0,
      message:'UnRead',
      messageShow: false,
      clickItem: {},
    }
  },
  created() {
    // 首次加载小红点
    this.getUnreadCount()
    // 轮询刷新小红点
    setInterval(() => {
      this.getUnreadCount()
    },1000 * 60 * 1)
  },
  methods: {
    getList: function() {
      this.loading = true;
      var queryParams = {
          userType: 2
      };
      getUnreadNotifyMessageList(queryParams).then(response => {
        this.list = response.data;
        this.loading = false;
      });
    },
    getUnreadCount: function() {
      var queryParams = {
          userType: 2
      };
      getUnreadNotifyMessageCount(queryParams).then(response => {
        if(this.unreadCount !== response.data){
          this.unreadCount = response.data;
        }
      })
    },
    goMyList: function() {
      this.$router.push({
        name: 'MyNotifyMessage'
      });
    },
    handleUpdateAll(){
      updateAllNotifyMessageRead().then(response => {
        this.$modal.msgSuccess("Success");
        this.getList();
        this.unreadCount = 0
      });
    },
    handleUpdateSingle(item) {
      this.clickItem = item;
      this.handleUpdate([item.id])
      this.messageShow = true;
    },
    handleUpdate(ids) {
      updateNotifyMessageRead(ids).then(response => {
        // this.$modal.msgSuccess("Success");
        this.getList();
        this.getUnreadCount()
      });
    },
  }
}
</script>
<style>
.popover-content {
  /* 确保内容区域有定位上下文 */
  position: relative;
}

.mark-as-read {
  /* 绝对定位到右上角 */
  position: absolute;
  top: -30px; /* 根据需要调整 */
  right: 10px; /* 根据需要调整 */
  /* 确保不会被其他内容覆盖 */
  z-index: 1;
  /* 其他样式，如字体大小、颜色等 */
  cursor: pointer; /* 鼠标悬停时显示点击效果 */
  color: #909399;
}
.el-badge__content.is-fixed {
    position: absolute;
    top: 8px;
    right: 23px;
    -webkit-transform: translateY(-50%) translateX(100%);
    transform: translateY(-50%) translateX(100%);
    border-color: transparent;
}
.el-badge__content {
    background-color: #F56C6C;
    border-radius: 10px;
    color: #FFF;
    display: inline-block;
    font-size: 11px;
    height: 14px;
    line-height: 14px;
    padding: 0 4px;
    text-align: center;
    white-space: nowrap;
}
.text-time{
  color: #868e95;
  font-size: 12px;
   float: right;
}
.text-ellipsis p {
  font-size: 13px;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* 限制显示的行数 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  /* 你可以根据需要设置宽度，但请注意，如果容器宽度有限，
     并且你设置了固定宽度给每个段落，它们可能会换行显示或溢出容器。 */
  width: 76%; /* 段落宽度，可以调整为适合的值 */
}
.text-ellipsis a{
  color: #004F7C;
}
.text-ellipsis {
  width: 76%;
}


</style>
