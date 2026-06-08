<template>
  <div class="carrier-logo">
    <span style="margin-bottom: 10px; font-weight: 600;font-size: 16px;">Air</span>
    <img v-if="logo" :src="logo" :alt="airline" class="logo-img" />
    <span v-else class="carrier-text">{{ airline }}</span>
  </div>
</template>

<script>
export default {
  name: 'AirLogo',
  props: {
    airline: {
      type: String,
      default: ''
    }
  },
  computed: {
    logo() {
      if (!this.airline) return ''

      const map = {
        HLCU: require('@/assets/HLCU.png'),
        MAEU: require('@/assets/MAEU.png'),
        ZIMU: require('@/assets/ZIMU.png'),
        TSHG: require('@/assets/tailwind.png'),
        MSCU: require('@/assets/MSCU-new.png'),
        MSC: require('@/assets/MSCU-new.png'),
        OOLU: require('@/assets/OOLU.svg'),
        CMDU: require('@/assets/CMA.png'),
        HMM: require('@/assets/HMM.jpg'),
        ONEY: require('@/assets/ONE.png'),
        COSU: require('@/assets/COSCO.png'),
        CMA: require('@/assets/logo/CMA.png'),
        COSCO: require('@/assets/logo/COSCO.png'),
        HPL: require('@/assets/logo/HPL.png'),
        MSK: require('@/assets/logo/MSK.png'),
        ONE: require('@/assets/logo/ONE.png'),
        ZIM: require('@/assets/logo/ZIM.png'),
        EGLV: require('@/assets/logo/EGLV.png'),
        SJHH: require('@/assets/logo/SJHH.png'),
        SMLU: require('@/assets/logo/SMLU.png')
      }

      return map[this.airline.toUpperCase()] || ''
    }
  }
}
</script>

<style scoped>
.carrier-logo {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  align-items: center;
  height: 50px;
}

.logo-img {
  height: 22px;
  max-width: 90px;
  object-fit: contain;
}

.carrier-text {
  font-size: 13px;
  font-weight: 600;
  color: #004f7c;
  white-space: nowrap;
}
</style>
