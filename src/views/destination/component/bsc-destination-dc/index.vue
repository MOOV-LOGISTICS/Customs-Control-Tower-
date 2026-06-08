<template>
  <div>
    <!-- 文本展示模式 -->
    <span v-if="mode === 'text'">{{ displayText }}</span>

    <!-- Select 选择模式 -->
    <el-select v-else v-model="selectedValue" :placeholder="placeholder" :disabled="disabled" :clearable="clearable" :filterable="filterable" style="width: 100%" @change="handleChange">
      <el-option v-for="item in dcList" :key="item.dcCode" :label="`${item.dcName}(${item.dcCode})`" :value="item.dcCode"></el-option>
    </el-select>
  </div>
</template>

<script>
import { getDestinationDcListAll } from '@/api/destination/destination'

// 全局缓存变量
let cachedDcList = null
let cacheTimestamp = 0
let loadingPromise = null // 用于跟踪正在进行的请求
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

export default {
  name: 'BscDestinationDc',
  props: {
    // 模式：'text' 文本展示，'select' 选择
    mode: {
      type: String,
      default: 'text',
      validator: value => ['text', 'select'].includes(value)
    },
    // 绑定的值（dcCode）
    value: {
      type: [String, Number],
      default: null
    },
    // 占位符（仅 select 模式）
    placeholder: {
      type: String,
      default: 'Please select DC'
    },
    // 是否禁用（仅 select 模式）
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否可清空（仅 select 模式）
    clearable: {
      type: Boolean,
      default: true
    },
    // 是否可搜索（仅 select 模式）
    filterable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dcList: [],
      selectedValue: null,
      loading: false
    }
  },
  computed: {
    // 显示文本（仅 text 模式）
    displayText() {
      if (!this.value) return ''
      const valueStr = String(this.value)
      
      // 检查是否包含逗号
      if (valueStr.includes(',')) {
        const dcCodes = valueStr.split(',').map(code => code.trim()).filter(code => code)
        const dcNames = dcCodes.map(code => {
          const dcItem = this.dcList.find(item => item.dcCode === code)
          return dcItem ? dcItem.dcName : code
        })
        return dcNames.join(', ')
      } else {
        const dcItem = this.dcList.find(item => item.dcCode === valueStr)
        return dcItem ? `${dcItem.dcName}` : valueStr
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.selectedValue = val
      }
    }
  },
  created() {
    this.loadDcList()
  },
  methods: {
    // 加载 DC 列表
    async loadDcList() {
      // 检查缓存
      const now = Date.now()
      if (cachedDcList && now - cacheTimestamp < CACHE_DURATION) {
        this.dcList = cachedDcList
        return
      }

      // 如果已经有请求在进行，等待其完成
      if (loadingPromise) {
        try {
          await loadingPromise
          this.dcList = cachedDcList
        } catch (error) {
          console.error('Failed to load DC list:', error)
        }
        return
      }

      try {
        this.loading = true
        // 创建新的请求Promise
        loadingPromise = getDestinationDcListAll()
        const res = await loadingPromise
        if (res.code === 0 && res.data) {
          this.dcList = res.data
          // 更新缓存
          cachedDcList = res.data
          cacheTimestamp = now
        }
      } catch (error) {
        console.error('Failed to load DC list:', error)
        this.$message.error('Failed to load DC list')
      } finally {
        this.loading = false
        // 清空loadingPromise，允许后续请求
        loadingPromise = null
      }
    },

    // 处理值变化（仅 select 模式）
    handleChange(val) {
      this.$emit('input', val)
      this.$emit('change', val, this.getDcByCode(val))
    },

    // 根据 dcCode 获取完整的 DC 信息
    getDcByCode(dcCode) {
      if (!dcCode) return null
      return this.dcList.find(item => item.dcCode === dcCode) || null
    },

    // 强制刷新缓存
    refreshCache() {
      cachedDcList = null
      cacheTimestamp = 0
      this.loadDcList()
    }
  }
}
</script>
