<template>
  <el-select v-model="selectedAirline" placeholder="Select Airline" clearable filterable class="airline-select" @change="onSelectChange">
    <el-option v-for="(airline,index) in airlineList" :value="airline.iata" :key="airline.iata + '_' + index" :label="`${airline.airlineName} (${airline.iata})`" />
  </el-select>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AirlineSelect',
  props: {
    value: {
      type: String,
      default: null
    }
  },
  data() {
    return {
        selectedAirline: this.value || null // 使用父组件传的值，空值也保留
    }
  },
  computed: {
    ...mapState('bdData', {
      airlineList: state => state.airlineList
    })
  },

  watch: {
    // selectedAirline(newValue) {
    //   console.log('selectedAirline', newValue)
    //   this.$emit('select', newValue)
    //   this.$emit('select', newValue) // 自定义事件
    // },
    value(newValue) {
      this.selectedAirline = newValue
    }
  },
  async created() {
    if (!this.airlineList || this.airlineList.length === 0) {
      await this.$store.dispatch('bdData/fetchAirlineList')
    }
    // this.selectedAirline  默认为this.airlineList 的第一个  判断this.airlineList 是否有值
    if (!this.selectedAirline) { 
    this.selectedAirline = null // 不自动选第一个
  }
  },
  methods: {
    onSelectChange(iata) {
      this.$emit('input', iata) // 支持 v-model
      this.$emit('select', iata) // 自定义事件
    },
    filterAirlines(query, option) {
      console.log(query, option)
      if (!query) return true
      if (!option || !option.label) return false

      return option.label.toLowerCase().includes(query.trim().toLowerCase())
    }
  }
}
</script>
<style scoped>
/* .airline-select {
  width: 250px !important;
  flex-shrink: 0;
}
.airline-select ::v-deep .el-input {
  width: 100%;
} */
</style>