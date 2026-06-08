<template>
  <div v-show="isVisible" class="floating-icon" @click="onClick">
    <!-- 这里放置图标，可以是图像或字体图标 -->
    <img src="../assets/images/tab1.jpg" alt="Floating Icon">
  </div>
</template>

<script>
export default {
  name: 'FloatingIcon',
  data() {
    return {
      isVisible: true // 控制图标显示隐藏的变量
    };
  },
  methods: {
    onClick() {
      // 处理点击事件
      console.log('Icon clicked!');
    }
  }
};
</script>

<style scoped>
.floating-icon {
  position: fixed;
  bottom: 20px;
  right: 20px;
  /* 样式调整为你需要的样式 */
}
</style>
