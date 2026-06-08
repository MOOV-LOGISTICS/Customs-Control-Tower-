<template>
  <span>{{ userName }}</span>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UserText',
  props: {
    userId: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    ...mapState({
      userList: state => state.user.allUsersIncludeDeleted
    }),
    userName() {
      if (!this.userList || this.userList.length === 0) return ''
      if (this.userId === null || this.userId === undefined || this.userId === '') return ''
      const targetId = String(this.userId)
      const user = this.userList.find(item => item && item.id !== null && item.id !== undefined && String(item.id) === targetId)
      return user ? user.nickname : 'Deactivated'
    }
  },
  async created() {
    if (!this.userList || this.userList.length === 0) {
      await this.$store.dispatch('fetchAllUsersIncludeDeleted')
    }
  },
  methods: {}
}
</script>