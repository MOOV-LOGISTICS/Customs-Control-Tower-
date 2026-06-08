<template>
  <div class="app-container">
    <el-card style="padding: 10px">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="Under Scoring" name="underScoring">
          <!-- Under Scoring -->
          <under-scoring />
        </el-tab-pane>
        <el-tab-pane label="Booking Score" name="bookingScore">
          <!-- Booking Score -->
          <booking-score />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import BookingScore from './tabs/booking-score.vue'
import UnderScoring from './tabs/under-scoring.vue'

export default {
  name: 'BookingScoreIndex',
  components: { BookingScore, UnderScoring },
  data() {
    return {
      activeName: 'underScoring'
    }
  },
  created() {},
  methods: {
    handleClick(e) {
      console.log(e)
    }
  }
}
</script>

<style lang="scss" scoped>
.booking-score-index {
  background-color: white;
}
</style>