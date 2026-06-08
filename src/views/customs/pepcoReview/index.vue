<template>
  <div class="app-container">

    <!-- HBL selector -->
    <el-card style="margin-bottom:12px">
      <el-row :gutter="12" align="middle" type="flex">
        <el-col :span="6">
          <el-select v-model="selectedHbl" placeholder="Select HBL" style="width:100%">
            <el-option v-for="h in hblList" :key="h.value" :label="h.label" :value="h.value" />
          </el-select>
        </el-col>
        <el-col :span="18" v-if="hblInfo">
          <el-descriptions :column="4" size="mini" border>
            <el-descriptions-item label="Supplier">{{ hblInfo.supplier }}</el-descriptions-item>
            <el-descriptions-item label="POD">{{ hblInfo.pod }}</el-descriptions-item>
            <el-descriptions-item label="ETA">{{ hblInfo.eta }}</el-descriptions-item>
            <el-descriptions-item label="Documents">
              <span style="color:#13ce66;font-weight:600">4 / 4 Verified</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
    </el-card>

    <!-- Milestone steps overview -->
    <el-card style="margin-bottom:12px">
      <div class="steps-row">
        <div v-for="(m, i) in milestones" :key="m.code" class="step-item">
          <div :class="['step-circle', stepCircleClass(m)]">
            <i v-if="m.status==='COMPLETED'" class="el-icon-check"></i>
            <i v-else-if="m.status==='REJECTED'" class="el-icon-close"></i>
            <i v-else-if="m.locked" class="el-icon-lock"></i>
            <span v-else>{{ i+1 }}</span>
          </div>
          <div class="step-label">{{ m.shortName }}</div>
          <div :class="['step-badge', stepBadgeClass(m)]">{{ stepBadgeLabel(m) }}</div>
          <div v-if="i < milestones.length-1" class="step-connector" :class="{done: m.status==='COMPLETED'}" />
        </div>
      </div>
    </el-card>

    <!-- Milestone detail cards -->
    <el-row :gutter="12">
      <el-col :span="8" v-for="m in milestones" :key="m.code">
        <el-card :class="['milestone-card', milestoneCardClass(m)]">
          <div slot="header" class="card-hdr">
            <span>
              <span v-if="m.isRecheck" class="recheck-badge">RE-CHECK</span>
              {{ m.name }}
            </span>
            <span :class="['status-badge', stepBadgeClass(m)]">{{ stepBadgeLabel(m) }}</span>
          </div>

          <!-- Completed state -->
          <div v-if="m.status==='COMPLETED'" class="milestone-done">
            <i class="el-icon-circle-check"></i>
            <div>Completed by <strong>{{ m.completedBy }}</strong></div>
            <div class="done-time">{{ m.completedAt }}</div>
          </div>

          <!-- Rejected state -->
          <div v-else-if="m.status==='REJECTED'" class="milestone-rejected">
            <el-alert :title="'Rejected by ' + m.rejectedBy" type="error" :closable="false" show-icon style="margin-bottom:10px">
              <div style="font-size:12px;margin-top:4px">{{ m.rejectReason }}</div>
            </el-alert>
            <div style="font-size:12px;color:#666;margin-bottom:8px">OHA action required — work with supplier to correct the issue, then confirm.</div>
            <el-input v-model="m.ohaComment" type="textarea" :rows="2" placeholder="Add OHA correction note (optional)..." size="mini" style="margin-bottom:8px" />
            <el-button type="warning" size="mini" style="width:100%" @click="ohaConfirm(m)">
              <i class="el-icon-check"></i> Confirm Correction Done – Reset All Milestones
            </el-button>
          </div>

          <!-- Locked state -->
          <div v-else-if="m.locked" class="milestone-locked">
            <i class="el-icon-lock"></i>
            <div>{{ m.lockReason }}</div>
          </div>

          <!-- Active / in-progress -->
          <div v-else>
            <div style="font-size:12px;color:#666;margin-bottom:12px">
              Review all documents for this shipment and confirm or reject.
            </div>
            <el-input v-if="m.status!=='COMPLETED'" v-model="m.rejectDraft" type="textarea" :rows="2"
              placeholder="Rejection reason (required if rejecting)..." size="mini" style="margin-bottom:8px" />
            <el-button type="success" size="mini" style="width:48%" @click="approve(m)">
              <i class="el-icon-check"></i> Approve
            </el-button>
            <el-button type="danger" size="mini" style="width:48%;margin-left:4%" @click="reject(m)">
              <i class="el-icon-close"></i> Reject
            </el-button>
          </div>

          <!-- History accordion -->
          <div v-if="m.history && m.history.length" style="margin-top:12px">
            <el-divider><span style="font-size:11px;color:#999">Previous checks</span></el-divider>
            <div v-for="h in m.history" :key="h.at" class="history-item">
              <span class="status-badge rejected" style="font-size:10px">Rejected</span>
              <span style="font-size:11px;color:#666;margin-left:6px">{{ h.by }} – {{ h.at }}</span>
              <div style="font-size:11px;color:#999;padding-left:8px;margin-top:2px">{{ h.reason }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  name: 'PepcoReview',
  data() {
    return {
      selectedHbl: 'MOOV240002',
      hblList: [
        { value:'MOOV240002', label:'MOOV240002 – Dhaka Garments (PGS Review)' },
        { value:'MOOV240003', label:'MOOV240003 – Ho Chi Minh Apparel (Finance Review)' },
        { value:'MOOV240004', label:'MOOV240004 – Istanbul Fashion (Customs Review)' },
        { value:'MOOV240006', label:'MOOV240006 – Guangzhou Clothing (Rejected)' },
      ],
      hblMap: {
        MOOV240002: { supplier:'Dhaka Garments Ltd.',  pod:'DEHAM', eta:'2024-12-15' },
        MOOV240003: { supplier:'Ho Chi Minh Apparel',  pod:'CZPRE', eta:'2024-12-02' },
        MOOV240004: { supplier:'Istanbul Fashion AS',  pod:'ROBUH', eta:'2024-12-10' },
        MOOV240006: { supplier:'Guangzhou Clothing Co.', pod:'PLWAW', eta:'2024-12-18' },
      },
      milestones: [
        { code:'PGS',     shortName:'PGS Check',     name:'Pepco Global Sourcing',   status:'IN_PROGRESS', locked:false, completedBy:null, completedAt:null, rejectReason:'', rejectDraft:'', ohaComment:'', rejectedBy:'', isRecheck:false, history:[] },
        { code:'FINANCE', shortName:'Finance Check', name:'Pepco Finance',           status:'PENDING',     locked:true,  lockReason:'Waiting for PGS Check to complete', completedBy:null, completedAt:null, rejectReason:'', rejectDraft:'', ohaComment:'', rejectedBy:'', isRecheck:false, history:[] },
        { code:'CUSTOMS', shortName:'Customs Check', name:'Pepco Customs & Sanitary',status:'PENDING',     locked:true,  lockReason:'Waiting for Finance Check to complete', completedBy:null, completedAt:null, rejectReason:'', rejectDraft:'', ohaComment:'', rejectedBy:'', isRecheck:false, history:[] },
      ]
    }
  },
  computed: {
    hblInfo() { return this.hblMap[this.selectedHbl] }
  },
  watch: {
    selectedHbl(v) { this.resetToScenario(v) }
  },
  methods: {
    resetToScenario(hbl) {
      const base = [
        { code:'PGS',     shortName:'PGS Check',     name:'Pepco Global Sourcing',    locked:false },
        { code:'FINANCE', shortName:'Finance Check', name:'Pepco Finance',            locked:true,  lockReason:'Waiting for PGS Check to complete' },
        { code:'CUSTOMS', shortName:'Customs Check', name:'Pepco Customs & Sanitary', locked:true,  lockReason:'Waiting for Finance Check to complete' },
      ]
      if (hbl==='MOOV240002') {
        this.milestones = base.map((m,i)=>({...m, status:i===0?'IN_PROGRESS':'PENDING', completedBy:null, completedAt:null, rejectReason:'', rejectDraft:'', ohaComment:'', rejectedBy:'', isRecheck:false, history:[]}))
      } else if (hbl==='MOOV240003') {
        this.milestones = base.map((m,i)=>({...m, status:i===0?'COMPLETED':i===1?'IN_PROGRESS':'PENDING', locked:i===2, lockReason:i===2?'Waiting for Finance Check to complete':'', completedBy:i===0?'Sarah J. (PGS)':null, completedAt:i===0?'2024-11-13 10:30':null, rejectReason:'', rejectDraft:'', ohaComment:'', rejectedBy:'', isRecheck:false, history:[]}))
      } else if (hbl==='MOOV240004') {
        this.milestones = base.map((m,i)=>({...m, status:i<2?'COMPLETED':'IN_PROGRESS', locked:false, completedBy:i===0?'Sarah J. (PGS)':i===1?'Tom K. (Finance)':null, completedAt:i===0?'2024-11-13 10:30':i===1?'2024-11-14 14:15':null, rejectReason:'', rejectDraft:'', ohaComment:'', rejectedBy:'', isRecheck:false, history:[]}))
      } else if (hbl==='MOOV240006') {
        this.milestones = base.map((m,i)=>({...m, status:i===0?'REJECTED':'PENDING', locked:i>0, lockReason:i>0?'Waiting for PGS Check to complete':'', rejectReason:i===0?'Commercial invoice date does not match packing list. Invoice shows 2024-10-15 but PL shows 2024-10-20. Please correct and resubmit.':'', rejectDraft:'', ohaComment:'', rejectedBy:i===0?'Sarah J. (PGS)':'', completedBy:null, completedAt:null, isRecheck:false, history:[]}))
      }
    },
    stepCircleClass(m) {
      if (m.status==='COMPLETED') return 'done'
      if (m.status==='REJECTED')  return 'rejected'
      if (m.locked)               return 'locked'
      return 'active'
    },
    stepBadgeClass(m) {
      if (m.status==='COMPLETED') return 'completed'
      if (m.status==='REJECTED')  return 'rejected'
      if (m.locked)               return 'locked'
      if (m.isRecheck)            return 'recheck'
      return 'in-progress'
    },
    stepBadgeLabel(m) {
      if (m.status==='COMPLETED') return m.isRecheck ? 'Re-checked ✓' : 'Completed ✓'
      if (m.status==='REJECTED')  return 'Rejected'
      if (m.locked)               return 'Locked'
      return m.isRecheck ? 'Re-check Required' : 'In Progress'
    },
    milestoneCardClass(m) {
      if (m.status==='COMPLETED') return 'card-done'
      if (m.status==='REJECTED')  return 'card-rejected'
      if (m.locked)               return 'card-locked'
      return 'card-active'
    },
    approve(m) {
      m.status = 'COMPLETED'
      m.completedBy = 'Demo User'
      m.completedAt = new Date().toLocaleString()
      // unlock next
      const i = this.milestones.indexOf(m)
      if (i < this.milestones.length-1) {
        this.milestones[i+1].locked = false
        this.milestones[i+1].status = 'IN_PROGRESS'
      }
      this.$message.success(`${m.shortName} approved!`)
    },
    reject(m) {
      if (!m.rejectDraft.trim()) { this.$message.warning('Please enter a rejection reason'); return }
      m.status = 'REJECTED'
      m.rejectReason = m.rejectDraft
      m.rejectedBy = 'Demo User'
      // lock all
      this.milestones.forEach(x => { if (x !== m) { x.locked = true; if (x.status!=='COMPLETED') x.status='PENDING' }})
      this.$message.error('Milestone rejected. OHA has been notified.')
    },
    ohaConfirm(m) {
      // save history and reset all
      this.milestones.forEach(x => {
        if (x.status==='REJECTED' || x.status==='COMPLETED') {
          x.history.push({ by: x.rejectedBy||x.completedBy, at: x.completedAt||new Date().toLocaleString(), reason: x.rejectReason||'Completed' })
        }
        x.status = x.code==='PGS' ? 'IN_PROGRESS' : 'PENDING'
        x.locked = x.code !== 'PGS'
        x.completedBy = null; x.completedAt = null
        x.rejectReason = ''; x.rejectDraft = ''; x.rejectedBy = ''
        x.isRecheck = true
      })
      this.$message.success('All milestones reset. Shipment marked for Re-check.')
    }
  },
  created() { this.resetToScenario(this.selectedHbl) }
}
</script>

<style lang="scss" scoped>
.card-hdr { display:flex; justify-content:space-between; align-items:center; font-weight:600; }

// Steps
.steps-row { display:flex; align-items:flex-start; justify-content:center; padding:12px 0 4px; position:relative; }
.step-item { display:flex; flex-direction:column; align-items:center; position:relative; flex:1; }
.step-circle {
  width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center;
  font-weight:700; font-size:15px; z-index:1; position:relative;
  &.done    { background:$status-verified; color:#fff; }
  &.active  { background:$primary; color:#fff; }
  &.locked  { background:#e4e7ed; color:#c0c4cc; }
  &.rejected{ background:$status-rejected; color:#fff; }
}
.step-label { font-size:12px; font-weight:600; margin-top:6px; text-align:center; }
.step-badge { margin-top:3px; font-size:10px; }
.step-connector {
  position:absolute; top:19px; left:50%; width:100%; height:2px;
  background:#e4e7ed; z-index:0;
  &.done { background:$status-verified; }
}

// Milestone cards
.milestone-card {
  &.card-active   ::v-deep .el-card__header { border-left:3px solid $primary; }
  &.card-done     ::v-deep .el-card__header { border-left:3px solid $status-verified; }
  &.card-rejected ::v-deep .el-card__header { border-left:3px solid $status-rejected; }
  &.card-locked   { opacity:0.65; }
}
.milestone-done {
  text-align:center; color:darken($status-verified, 10%); padding:10px 0;
  i { font-size:32px; display:block; margin-bottom:6px; }
  .done-time { font-size:11px; color:#999; margin-top:3px; }
}
.milestone-locked {
  text-align:center; color:#c0c4cc; padding:16px 0;
  i { font-size:28px; display:block; margin-bottom:6px; }
  div { font-size:12px; }
}
.milestone-rejected { }
.recheck-badge {
  display:inline-block; background:#fff8e0; color:#e6a817;
  font-size:9px; font-weight:700; padding:1px 5px; border-radius:3px;
  letter-spacing:0.5px; margin-right:6px; vertical-align:middle;
}
.history-item { padding:4px 0; border-top:1px dashed #eee; margin-top:4px; }
</style>
