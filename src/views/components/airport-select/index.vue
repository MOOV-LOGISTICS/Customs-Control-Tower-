<template>
  <el-select v-model="selectedAirport" placeholder="Select Airport" clearable filterable class="airport-select" @change="onSelectChange">
    <el-option v-for="(airport,index) in airportList" :value="airport.iata"   :key="airport.iata + '_' + index" :label="`${airport.airportName} (${airport.iata})`" />
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
      selectedAirport: this.value
    }
  },
  computed: {
    ...mapState('bdData', {
      airportList: state => state.airportList
    })
  },

  watch: {
    // selectedAirport(newValue) {
    //   this.$emit('select', newValue)
    // },
    value(newValue) {
      this.selectedAirport = newValue
    }
  },
  async created() {
    console.log('created',this.airportList)
    if (!this.airportList || this.airportList.length === 0) {
      await this.$store.dispatch('bdData/fetchAirportList')
    }
  },
  methods: {
    onSelectChange(iata) {
      this.$emit('input', iata) // 支持 v-model
      this.$emit('select', iata)
      this.$emit('change', iata) // 透传 change 事件给父组件

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

</style>