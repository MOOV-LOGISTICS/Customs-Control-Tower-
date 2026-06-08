<template>
  <div style="margin: 0 auto; padding: 10px;">
    <div class="transport-tabs">
      <!-- <el-button style="width: 200px;" v-for="(tab, index) in transportTabs" :key="index" :type="activeTab === tab.value ? 'primary' : 'default'" :class="{ active: activeTab === tab.value }" @click="switchTab(tab.value)">
        <img  :src="tab.icon" alt class="tab-icon" />
        {{ tab.label }}
      </el-button> -->

      <el-button 
        type="primary" 
        style="width: 200px;"
        :class="{ active: activeTab === 'air' }"
      >
        <img :src="airIcon" alt="" class="tab-icon" />
        Air
      </el-button>
    </div>

    <!-- 承运商列表：根据 activeTab 动态显示 -->
    <div class="carrier-list" v-if="activeTab === 'sea'">
      <el-radio
        v-for="carrier in currentCarriers"
        :key="carrier.code"
        v-model="selectedCarrierValue"
        :label="carrier.code"
        @click="selectCarrier(carrier.code)"
        border
        style="  margin: 8px; display: inline-flex; align-items: center; justify-content: center; width: 180px; height: 70px;"
      >
        <img class="uni-airline-logo-image" :src="getLogoPath(carrier.code)" :style="getLogoStyle(carrier.code)" />
      </el-radio>
    </div>

    <!-- 当选择 Air 时显示选择框 -->
    <div v-else-if="activeTab === 'air'" class="carrier-list">
      <div class="airline-select-wrapper">
        <bsc-airline-select style="margin-left: 50px;" v-model="selectedCarrierValue" @select="onSelectAirline" />
      </div>
    </div>

    <!-- Rail 承运商列表 -->
    <div v-else class="carrier-list">
      <el-radio v-for="carrier in currentCarriers" :key="carrier.code" v-model="selectedCarrierValue" :label="carrier.code" border>
        <img class="uni-airline-logo-image" :src="getLogoPath(carrier.code)" :style="getLogoStyle(carrier.code)" />
      </el-radio>
    </div>

    <!-- 确认按钮 -->
    <div class="dialog-footer" style="text-align: right">
      <el-button type="primary" @click="createAirBooking">Confirm</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChooseAir',
  props: {
    airLine: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      activeTab: 'air', // 默认选中 Sea
      selectedCarrierValue: 'DAL',
      airIcon: require('@/assets/logo/air.svg'), // 直接定义图标
      transportTabs: [
        // { label: 'Sea', value: 'sea', icon: require('@/assets/logo/sea.svg') },
        { label: 'Air', value: 'air', icon: require('@/assets/logo/air.svg') },
        // { label: 'Rail', value: 'rail', icon: require('@/assets/logo/rail.svg') }
      ],

      // 承运商按类型分组（暂时都用 Sea 的数据模拟）
      carriers: {
        sea: [{ code: 'TSHG' }, { code: 'MSCU' }, { code: 'CMDU' }, { code: 'OOLU' }, { code: 'ZIMU' }, { code: 'ONEY' }, { code: 'COSU' }, { code: 'EGLV' }],
        air: [
          { code: 'TSHG' },
          { code: 'MSCU' },
          { code: 'CMDU' }
          // 后续可替换为真实 Air 承运商
        ],
        rail: [
          { code: 'TSHG' },
          { code: 'OOLU' }
          // 后续可替换为真实 Rail 承运商
        ]
      },
      selectTransport: 'air',
      selectAirline: null,
      airLineList: [
        { code: 'TSHG', name: 'TSHG', name_cn: 'TSHG' },
        { code: 'MSCU', name: 'MSCU', name_cn: 'MSCU' },
        { code: 'CMDU', name: 'CMDU', name_cn: 'CMDU' },
        { code: 'OOLU', name: 'OOLU', name_cn: 'OOLU' }
      ],
      selectedAirlineObj: null
    }
  },
    watch: {
    // 监听 airLine 参数变化，同步更新选中值
    airLine: {
      handler(newVal) {
        if (newVal) {
          this.selectedCarrierValue = newVal
        }
      },
      immediate: true
    }
  },

  computed: {
    currentCarriers() {
      return this.carriers[this.activeTab] || []
    }
  },

  methods: {
    /**
     * 切换标签页功能
     * @param {string|number} value - 要切换到的标签页标识值
     */
    switchTab(value) {
      this.activeTab = value
      this.selectTransport = value
      this.selectedCarrierValue = null // 切换时清空选择
    },

    getLogoPath(code) {
      const map = {
        TSHG: require('@/assets/TSHG.png'),
        MSCU: require('@/assets/MSCU-new.png'),
        CMDU: require('@/assets/CMA.png'),
        OOLU: require('@/assets/OOLU.svg'),
        ZIMU: require('@/assets/ZIMU.png'),
        ONEY: require('@/assets/ONE.png'),
        COSU: require('@/assets/COSCO.png'),
        EGLV: require('@/assets/EGLV.png')
      }
      return map[code] || ''
    },

    getLogoStyle(code) {
      // 特殊样式调整（如 MSCU、ZIMU）
      if (code === 'MSCU') {
        return { width: '47px', height: '42px' }
      } else if (code === 'ZIMU') {
        return { width: '140px', height: '40px', position: 'relative', top: '3px' }
      } else {
        return { width: '140px', height: '40px' }
      }
    },

    createAirBooking() {
      console.log('选择的code', this.selectedCarrierValue)
      if (!this.selectedCarrierValue) {
        this.$message.warning('Please select a carrier.')
        return
      }
      this.$emit('change-value', {
        transport: this.selectTransport,
        carrier: this.selectedCarrierValue
      })
    },
    selectCarrier(code) {
      this.selectedCarrierValue = code
      console.log('选择的code', code)
      console.log('选择的mode', this.selectTransport)
    },
    onSelectAirline(code) {
      this.selectedCarrierValue = code
      this.transport = 'air'
      console.log('选择的mode', this.selectTransport)
      console.log('选择的code', this.selectedCarrierValue)
    }
  }
}
</script>

<style scoped>
.transport-tabs {
  display: flex;
  justify-content: center;  /* 水平居中 */
  align-items: center;      /* 垂直居中 */
  gap: 10px;
  margin-bottom: 20px;
  width: 100%
}

.transport-tabs .el-button {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  width: 200px;
}

.transport-tabs .el-button.active {
  background-color: #004F7C; /* Element UI primary 蓝色 */
  color: white;
  border-color: #409eff;
}

/* .carrier-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
} */
.carrier-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 每行 3 列，等宽 */
  gap: 16px; /* 项目间距 */
  margin-top: 16px;
}

/* 确保每个 radio 宽度填满格子 */
.carrier-list .el-radio.is-bordered {
  width: 100%;
  height: 80px; /* 可根据图片高度调整 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
}

/* 隐藏 radio 圆点 */
::v-deep .carrier-list .el-radio__input {
  /* display: none; */
}
/* Air 模式下选择框居中 + 加长 */
.airline-select-wrapper {
  display: flex;
  justify-content: center;
  width: 400px;
  padding-top: 10px;
  padding-left: 140px;
}

.airline-select {
  width: 600px; /* 可按需调整：400px / 60% / min(500px, 80%) */
}
.tab-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}
</style>