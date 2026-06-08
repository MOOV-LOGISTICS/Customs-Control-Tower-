export default {
  mounted() {
    if (this.$options && this.$options.name === 'ElInput') {
      // 处理 input 事件
      // this.$on('input', val => {
      //   if (typeof val === 'string') {
      //     const trimmed = val.trim();
      //     if (trimmed !== val) {
      //       this.$emit('input', trimmed);
      //     }
      //   }
      // });
      // 处理 blur 事件
      this.$on('blur', () => {
        if (typeof this.value === 'string') {
          const trimmed = this.value.trim();
          if (trimmed !== this.value) {
            this.$emit('input', trimmed); // 更新 v-model
          }
        }
      });
    }
  }
};


