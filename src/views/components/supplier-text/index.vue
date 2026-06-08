<template>
  <span>{{ supplierName }}</span>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SupplierText',
  props: {
    supplierId: {
      type: [String, Number],
      default: null
    },
    supplierCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      fetching: false
    }
  },
  computed: {
    ...mapState({
      supplierList: state => state.dept.supplierList
    }),
    supplierName() {
      if (!this.supplierList || this.supplierList.length === 0) return ''
      const supplier = this.supplierList.find(item => (this.supplierId && item.id === this.supplierId) || (this.supplierCode && item.code === this.supplierCode))
      return supplier ? supplier.name : ''
    }
  },
  async created() {
    if (!this.supplierList || this.supplierList.length === 0) {
      console.log('supplierList start', this.supplierList)
      await this.$store.dispatch('dept/fetchSupplierList')
      console.log('supplierList', this.supplierList)
    }
  },
  methods: {}
}
</script>