<template>
  <div class="swiper-wrapper">
    <el-carousel trigger="click" height="68.5rem" :interval="4000" :autoplay="true">
      <el-carousel-item v-for="(item, index) in bannerList" :key="item.id">
        <img
          :src="item.url"
          alt="banner"
          :loading="index === 0 ? 'eager' : 'lazy'"
          :fetchpriority="index === 0 ? 'high' : 'auto'"
        >
        <!-- <div class="content">
          <img :src="item.url" alt="banner" class="banner-img" />
          <div class="text">{{ item.text }}</div>
        </div> -->
      </el-carousel-item>
    </el-carousel>
  </div>

</template>
<script>
export default {
  data() {
    return {
      bannerList: [
        {
          id: 1,
          url: `/static/images/login/banner1.png`,
          text: "Our ocean freight services serve as the backbone of global trade, offering reliable, cost-effective ",
        },
        {
          id: 2,
          url: `/static/images/login/banner2.png`,
          text: "Our ocean freight services serve as the backbone of global trade, offering reliable, cost-effective ",
        },
        {
          id: 3,
          url: `/static/images/login/banner3.png`,
          text: "Our ocean freight services serve as the backbone of global trade, offering reliable, cost-effective ",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.swiper-wrapper {
  border-radius: 3.2rem;
  overflow: hidden;
}

/* 淡入淡出无缝切换 */
::v-deep .el-carousel__item {
  opacity: 0;
  transition: opacity 1s ease-in-out !important;
  transform: none !important;

  &.is-active {
    opacity: 1;
    z-index: 2;
  }

  &.is-animating {
    transition: opacity 1s ease-in-out !important;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }
}

.content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 0 4rem;
  height: 100%;
  overflow: hidden;

  .banner-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .text {
    position: relative;
    z-index: 1;
    color: #fff;
    font-size: 1.8rem;
    margin-bottom: 7rem;
  }
}

/* 指示器样式 */
::v-deep .el-carousel__indicators {
  display: flex;
  gap: 0.7rem;

  .el-carousel__indicator {
    padding: 0;
    margin-bottom: 4.5rem;

    .el-carousel__button {
      height: 0.5rem;
      width: 4.2rem;
      border-radius: 0.25rem;
    }
  }
}
</style>
