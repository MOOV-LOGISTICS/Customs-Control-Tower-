<template>
  <footer class="moov-footer">
    <a href="/privacy-statement" target="_blank">Terms & Conditions</a>
    <span>
        <a href="https://www.moovlogistics.com/" target="_blank"
      >Copyright © 2019-{{ new Date().getFullYear() }} MOOV ||
    </a>
    <a href="https://beian.miit.gov.cn/" target="_blank">沪ICP备20009454号-1</a>
    </span>
    
  </footer>
</template>
<script>
export default {
  name: "MoovFooter",
};
</script>
<style lang="scss" scoped>
@import 'index.scss';
</style>
