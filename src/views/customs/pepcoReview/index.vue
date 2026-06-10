<template>
  <div class="app-container">

    <!-- ── Milestone Selector ─────────────────────────────────────────── -->
    <div class="milestone-selector">
      <div
        v-for="m in milestoneConfig" :key="m.key"
        :class="['ms-tab', { active: currentMilestone === m.key }]"
        @click="switchMilestone(m.key)"
      >
        <span class="ms-tab-num">{{ m.step }}</span>
        <div class="ms-tab-body">
          <div class="ms-tab-name">{{ m.name }}</div>
          <div class="ms-tab-role">{{ m.role }}</div>
        </div>
        <i v-if="m.key !== 'CUSTOMS'" class="el-icon-arrow-right ms-arrow"></i>
      </div>
    </div>

    <!-- ── KPI Cards ──────────────────────────────────────────────────── -->
    <el-row :gutter="12" style="margin-bottom:14px">
      <el-col :span="6" v-for="(val, label) in currentKpi" :key="label">
        <div :class="['kpi-pill', `kpi-${label}`]">
          <span class="kpi-pill-num">{{ val }}</span>
          <span class="kpi-pill-label">{{ label.charAt(0).toUpperCase() + label.slice(1) }}</span>
        </div>
      </el-col>
    </el-row>

    <!-- ── Filters + Actions ──────────────────────────────────────────── -->
    <el-card style="margin-bottom:12px">
      <el-row :gutter="10" align="middle" type="flex">
        <el-col :span="5"><el-input v-model="filterHbl" placeholder="HBL Number" size="mini" clearable prefix-icon="el-icon-search" /></el-col>
        <el-col :span="5"><el-input v-model="filterSupplier" placeholder="Supplier Name" size="mini" clearable /></el-col>
        <el-col :span="5">
          <el-select v-model="filterStatus" size="mini" placeholder="Pending Task" clearable style="width:100%">
            <el-option label="Possible" value="possible" />
            <el-option label="Urgent"   value="urgent" />
            <el-option label="Overdue"  value="overdue" />
            <el-option label="Finished" value="finished" />
          </el-select>
        </el-col>
        <el-col :span="3"><el-button type="primary" size="mini" icon="el-icon-search" @click="$message.info('Filter applied')">Search</el-button></el-col>
        <el-col :span="6" style="text-align:right">
          <el-button type="primary" size="mini" icon="el-icon-finished" :disabled="selectedHbls.length===0" @click="openBulkVerify">
            Verify Documents ({{ selectedHbls.length }})
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- ── HBL Table ──────────────────────────────────────────────────── -->
    <el-card>
      <el-table
        :data="filteredHbls" size="mini" stripe border
        @selection-change="selectedHbls = $event"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column label="HBL Number" width="120">
          <template #default="{row}">
            <span class="hbl-link" @click="toggleExpand(row)">{{ row.hblNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="MBL Number" prop="mblNo" width="120" />
        <el-table-column label="Supplier" prop="supplier" min-width="160" />
        <el-table-column label="POD" prop="pod" width="70" />
        <el-table-column label="ETA" prop="eta" width="95" />

        <!-- 3-Step Progress -->
        <el-table-column label="3-Step Progress" width="200">
          <template #default="{row}">
            <div class="progress-strip">
              <el-tooltip v-for="m in milestoneConfig" :key="m.key"
                :content="`${m.name}: ${stepLabel(row.milestones[m.key].status)}`" placement="top">
                <div :class="['step-pip', stepPipClass(row.milestones[m.key].status)]">
                  <i :class="stepPipIcon(row.milestones[m.key].status)"></i>
                  <span>{{ m.short }}</span>
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <!-- Current milestone status -->
        <el-table-column label="Status" width="130">
          <template #default="{row}">
            <div>
              <span :class="['status-badge', milestoneBadgeClass(row.milestones[currentMilestone].status)]">
                {{ stepLabel(row.milestones[currentMilestone].status) }}
              </span>
              <el-tag v-if="row.milestones[currentMilestone].isRecheck" size="mini" type="warning" style="margin-left:4px;font-size:9px">RE-CHECK</el-tag>
            </div>
          </template>
        </el-table-column>

        <!-- Action -->
        <el-table-column label="Action" width="130" align="center">
          <template #default="{row}">
            <el-tooltip v-if="row.milestones[currentMilestone].status === 'LOCKED'"
              :content="`Waiting for ${lockReason(row, currentMilestone)}`" placement="left">
              <span>
                <el-button size="mini" type="primary" plain disabled icon="el-icon-lock">Locked</el-button>
              </span>
            </el-tooltip>
            <el-button v-else-if="row.milestones[currentMilestone].status === 'COMPLETE'"
              size="mini" type="text" icon="el-icon-view" @click="toggleExpand(row)">
              View History
            </el-button>
            <el-button v-else
              size="mini" type="primary" icon="el-icon-finished"
              @click="openVerifyDialog(row)">
              Verify Docs
            </el-button>
          </template>
        </el-table-column>

        <!-- Expand toggle -->
        <el-table-column width="40" align="center">
          <template #default="{row}">
            <i :class="row.expanded ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
              style="cursor:pointer;color:#909399" @click="toggleExpand(row)" />
          </template>
        </el-table-column>
      </el-table>

      <!-- Expanded row detail -->
      <template v-for="row in filteredHbls">
        <div v-if="row.expanded" :key="'exp-'+row.hblNo" class="expanded-detail">
          <div class="expanded-hbl-header">
            <span class="exp-hbl-no">{{ row.hblNo }}</span>
            <span class="exp-hbl-supplier">{{ row.supplier }}</span>
            <el-descriptions :column="4" size="mini" border style="flex:1;margin-left:16px">
              <el-descriptions-item label="MBL">{{ row.mblNo }}</el-descriptions-item>
              <el-descriptions-item label="POL">{{ row.pol }}</el-descriptions-item>
              <el-descriptions-item label="POD">{{ row.pod }}</el-descriptions-item>
              <el-descriptions-item label="ETA">{{ row.eta }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <el-tabs v-model="row.activeTab" size="mini" type="card">
            <!-- Documents tab -->
            <el-tab-pane label="Documents" name="documents">
              <el-table :data="row.documents" size="mini" stripe border style="margin-top:8px">
                <el-table-column label="Document Type" min-width="160" prop="docType" />
                <el-table-column label="File Name" min-width="180" prop="fileName" />
                <el-table-column label="Version" width="70" align="center">
                  <template #default="{row}"><el-tag size="mini" type="info">v{{ row.version }}</el-tag></template>
                </el-table-column>
                <el-table-column label="Status" width="100">
                  <template #default="{row}">
                    <span :class="['status-badge', row.status==='VERIFIED'?'verified':'unverified']">
                      {{ row.status==='VERIFIED'?'Verified':'Unverified' }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="Uploaded" width="130" prop="uploadedAt" />
                <el-table-column label="" width="70" align="center">
                  <template><el-button type="text" size="mini" icon="el-icon-view">Preview</el-button></template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <!-- Documents Verified tab -->
            <el-tab-pane name="verified">
              <span slot="label"><i class="el-icon-finished"></i> Documents Verified</span>
              <!-- Re-check banner -->
              <div v-if="hasRecheck(row)" class="recheck-banner">
                <i class="el-icon-warning-outline"></i>
                <div>
                  <strong>RE-CHECK REQUIRED</strong> — This HBL was previously rejected and corrected. Please review the history below before proceeding.
                </div>
              </div>
              <el-table :data="row.verifyHistory" size="mini" stripe border style="margin-top:8px">
                <el-table-column label="Milestone" width="180">
                  <template #default="{row}">
                    <span :class="['ms-pill', `ms-pill-${row.milestone.toLowerCase()}`]">{{ row.milestone }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Status" width="110">
                  <template #default="{row}">
                    <span :class="['status-badge', historyStatusClass(row.status)]">{{ row.status }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Update User" width="160" prop="user" />
                <el-table-column label="Update Time" width="185" prop="time" />
                <el-table-column label="Incomplete Reason" min-width="200">
                  <template #default="{row}">
                    <span v-if="row.reason" style="color:#ff4949">{{ row.reason }}</span>
                    <span v-else style="color:#c0c4cc">—</span>
                  </template>
                </el-table-column>
                <el-table-column label="Remark" min-width="180">
                  <template #default="{row}">
                    <span v-if="row.remark" style="color:#666">{{ row.remark }}</span>
                    <span v-else style="color:#c0c4cc">—</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <!-- Containers/HBL placeholder -->
            <el-tab-pane label="Containers/HBL" name="containers">
              <div style="padding:20px;text-align:center;color:#c0c4cc">Container data will display here</div>
            </el-tab-pane>

            <!-- POs/HBL placeholder -->
            <el-tab-pane label="POs/HBL" name="pos">
              <div style="padding:20px;text-align:center;color:#c0c4cc">PO data will display here</div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>

      <div style="text-align:right;margin-top:10px">
        <el-pagination layout="total, sizes, prev, pager, next" :total="filteredHbls.length" :page-size="20" small />
      </div>
    </el-card>

    <!-- ── Verify Document Dialog ────────────────────────────────────── -->
    <el-dialog :visible.sync="verifyDialog.visible" :title="`Document Verification — ${currentMilestoneName}`" width="520px">
      <div class="verify-dialog-body">
        <!-- HBL info -->
        <div class="verify-hbl-info" v-if="verifyDialog.hbl">
          <i class="el-icon-ship"></i>
          <span>{{ verifyDialog.hbl.hblNo }}</span>
          <span class="vd-supplier">{{ verifyDialog.hbl.supplier }}</span>
          <el-tag size="mini" type="info">{{ currentMilestoneName }}</el-tag>
        </div>
        <div class="verify-hbl-info bulk" v-else>
          <i class="el-icon-finished"></i>
          <span>Bulk verify — {{ selectedHbls.length }} HBL(s) selected</span>
          <el-tag size="mini" type="info">{{ currentMilestoneName }}</el-tag>
        </div>

        <el-divider style="margin:12px 0" />

        <!-- Complete / Not Complete -->
        <el-radio-group v-model="verifyDialog.result" class="verify-radio-group">
          <el-radio-button label="COMPLETE">
            <i class="el-icon-check"></i> Complete
          </el-radio-button>
          <el-radio-button label="NOT_COMPLETE">
            <i class="el-icon-close"></i> Not Complete
          </el-radio-button>
        </el-radio-group>

        <!-- Reason + Remark (only when Not Complete) -->
        <div v-if="verifyDialog.result === 'NOT_COMPLETE'" class="verify-reason-block">
          <el-form label-position="top" size="mini">
            <el-form-item label="Reason *" required>
              <el-select v-model="verifyDialog.reason" placeholder="Please select reason" style="width:100%">
                <el-option label="V001 - Missing shipping docs"                        value="V001 - Missing shipping docs" />
                <el-option label="V002 - Incorrect shipping docs"                      value="V002 - Incorrect shipping docs" />
                <el-option label="V003 - Missing/incorrect sanitary docs (DoC/test report)" value="V003 - Missing/incorrect sanitary docs" />
                <el-option label="V004 - Telex release missing"                        value="V004 - Telex release missing" />
                <el-option label="V005 - Originals missing (not HBL)"                 value="V005 - Originals missing (not HBL)" />
                <el-option label="V006 - HBL missing"                                 value="V006 - HBL missing" />
                <el-option label="V007 - Export declaration missing"                   value="V007 - Export declaration missing" />
                <el-option label="V008 - Do not clear – return to supplier"            value="V008 - Do not clear – return to supplier" />
              </el-select>
            </el-form-item>
            <el-form-item label="Remark">
              <el-input v-model="verifyDialog.remark" type="textarea" :rows="2" placeholder="Additional notes (optional)..." />
            </el-form-item>
          </el-form>
        </div>

        <!-- Sanitary Certificate toggle (Customs milestone only) -->
        <div v-if="currentMilestone === 'CUSTOMS'" class="sanitary-block">
          <el-switch v-model="verifyDialog.sanitaryCert" />
          <span class="sanitary-label">Sanitary Certificate is required</span>
        </div>
      </div>

      <div slot="footer">
        <el-button size="small" @click="verifyDialog.visible=false">Cancel</el-button>
        <el-button size="small" type="primary" @click="submitVerify"
          :disabled="verifyDialog.result==='NOT_COMPLETE' && !verifyDialog.reason">
          Submit
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
const mkHbl = (hblNo, mblNo, supplier, pol, pod, eta, pgs, fin, cus, docs, history) => ({
  hblNo, mblNo, supplier, pol, pod, eta,
  milestones: { PGS: pgs, FINANCE: fin, CUSTOMS: cus },
  documents: docs,
  verifyHistory: history,
  expanded: false,
  activeTab: 'verified',
})

const DOCS_BASE = [
  { docType:'Commercial Invoice', fileName:'INV-2024.pdf',  version:2, status:'VERIFIED', uploadedAt:'2024-11-11 09:23' },
  { docType:'Packing List',       fileName:'PL-2024.pdf',   version:1, status:'VERIFIED', uploadedAt:'2024-11-11 09:25' },
  { docType:'Bill of Lading',     fileName:'HBL.pdf',       version:1, status:'VERIFIED', uploadedAt:'2024-11-12 14:10' },
]

const s = (status, by=null, at=null, recheck=false, lock='') => ({
  status, completedBy:by, completedAt:at, isRecheck:recheck, lockReason:lock
})

export default {
  name: 'PepcoReview',
  data() {
    return {
      currentMilestone: 'PGS',
      filterHbl: '', filterSupplier: '', filterStatus: '',
      selectedHbls: [],

      milestoneConfig: [
        { key:'PGS',     step:'①', name:'PGS Document Check',            role:'Pepco PGS',     short:'PGS'  },
        { key:'FINANCE', step:'②', name:'Finance Document Check',         role:'Pepco Finance', short:'FIN'  },
        { key:'CUSTOMS', step:'③', name:'Shipping Documents Verify by Pepco', role:'Pepco Customs', short:'CUS' },
      ],

      kpis: {
        PGS:     { possible:102, urgent:5, overdue:18, finished:1234 },
        FINANCE: { possible:87,  urgent:3, overdue:9,  finished:1198 },
        CUSTOMS: { possible:45,  urgent:2, overdue:6,  finished:1150 },
      },

      // 6 HBLs covering all state combinations
      hbls: [
        // 1. PGS pending → all downstream locked
        mkHbl('MOOV240001','MAEU240001','Shanghai Textile Co.','CNSHA','PLGDN','2024-12-05',
          s('IN_PROGRESS'), s('LOCKED',null,null,false,'Waiting for PGS Check'), s('LOCKED',null,null,false,'Waiting for Finance Check'),
          DOCS_BASE,
          []
        ),
        // 2. PGS complete, Finance in-progress, Customs locked
        mkHbl('MOOV240002','MAEU240002','Dhaka Garments Ltd.','BGCGP','DEHAM','2024-12-15',
          s('COMPLETE','Sarah J. (PGS)','2024-11-13 10:30 CET'),
          s('IN_PROGRESS'),
          s('LOCKED',null,null,false,'Waiting for Finance Check'),
          DOCS_BASE,
          [
            { milestone:'PGS Check',  status:'Complete',   user:'Sarah J. (PGS)',  time:'2024-11-13 10:30 CET (UTC+1)', reason:'', remark:'' },
          ]
        ),
        // 3. PGS rejected → all reset to Re-check
        mkHbl('MOOV240003','CMDU240003','Ho Chi Minh Apparel','VNSGN','CZPRE','2024-12-02',
          s('IN_PROGRESS',null,null,true),
          s('LOCKED',   null,null,true,'Waiting for PGS Check'),
          s('LOCKED',   null,null,true,'Waiting for Finance Check'),
          DOCS_BASE,
          [
            { milestone:'PGS Check', status:'Complete',   user:'Sarah J. (PGS)',  time:'2024-11-10 09:15 CET (UTC+1)', reason:'', remark:'' },
            { milestone:'PGS Check', status:'Incomplete', user:'Sarah J. (PGS)',  time:'2024-11-11 14:20 CET (UTC+1)', reason:'V002 - Incorrect shipping docs', remark:'CI date mismatch vs PL' },
            { milestone:'PGS Check', status:'Revoke',     user:'PEPCO 4PL Admin', time:'2024-11-12 08:00 CET (UTC+1)', reason:'', remark:'' },
            { milestone:'OHA Note',  status:'Correction', user:'OHA Bangladesh',  time:'2024-11-13 11:30 UTC+6',       reason:'', remark:'Updated CI v2 uploaded with correct dates. Packing list also re-uploaded.' },
          ]
        ),
        // 4. PGS + Finance complete, Customs in-progress
        mkHbl('MOOV240004','HLCU240004','Istanbul Fashion AS','TRIST','ROBUH','2024-12-10',
          s('COMPLETE','Sarah J. (PGS)',   '2024-11-13 10:30 CET'),
          s('COMPLETE','Tom K. (Finance)', '2024-11-14 14:15 CET'),
          s('IN_PROGRESS'),
          DOCS_BASE,
          [
            { milestone:'PGS Check',     status:'Complete', user:'Sarah J. (PGS)',  time:'2024-11-13 10:30 CET (UTC+1)', reason:'', remark:'' },
            { milestone:'Finance Check', status:'Complete', user:'Tom K. (Finance)',time:'2024-11-14 14:15 CET (UTC+1)', reason:'', remark:'' },
          ]
        ),
        // 5. All three complete
        mkHbl('MOOV240005','MAEU240005','Mumbai Textiles Pvt','INNSA','HUBU','2024-11-28',
          s('COMPLETE','Sarah J. (PGS)',    '2024-11-10 09:00 CET'),
          s('COMPLETE','Tom K. (Finance)',  '2024-11-11 11:00 CET'),
          s('COMPLETE','Anna W. (Customs)', '2024-11-12 15:30 CET'),
          DOCS_BASE,
          [
            { milestone:'PGS Check',     status:'Complete', user:'Sarah J. (PGS)',   time:'2024-11-10 09:00 CET (UTC+1)', reason:'', remark:'' },
            { milestone:'Finance Check', status:'Complete', user:'Tom K. (Finance)', time:'2024-11-11 11:00 CET (UTC+1)', reason:'', remark:'' },
            { milestone:'Customs Check', status:'Complete', user:'Anna W. (Customs)',time:'2024-11-12 15:30 CET (UTC+1)', reason:'', remark:'' },
          ]
        ),
        // 6. Finance rejected → PGS+Finance+Customs all reset
        mkHbl('MOOV240006','EGLV240006','Guangzhou Clothing Co.','CNGZU','PLWAW','2024-12-18',
          s('IN_PROGRESS',null,null,true),
          s('LOCKED',null,null,true,'Waiting for PGS Check'),
          s('LOCKED',null,null,true,'Waiting for Finance Check'),
          DOCS_BASE,
          [
            { milestone:'PGS Check',     status:'Complete',   user:'Sarah J. (PGS)',   time:'2024-11-15 10:00 CET (UTC+1)', reason:'', remark:'' },
            { milestone:'Finance Check', status:'Incomplete', user:'Tom K. (Finance)', time:'2024-11-16 09:30 CET (UTC+1)', reason:'V001 - Missing shipping docs', remark:'Sanitary cert missing for food items' },
            { milestone:'Finance Check', status:'Revoke',     user:'PEPCO 4PL Admin',  time:'2024-11-17 08:00 CET (UTC+1)', reason:'', remark:'' },
            { milestone:'OHA Note',      status:'Correction', user:'OHA Guangzhou',    time:'2024-11-18 14:00 UTC+8',       reason:'', remark:'Sanitary cert uploaded. All docs re-verified by supplier.' },
          ]
        ),
      ],

      verifyDialog: {
        visible: false,
        hbl: null,
        result: 'COMPLETE',
        reason: '',
        remark: '',
        sanitaryCert: false,
      },
    }
  },

  computed: {
    currentKpi() { return this.kpis[this.currentMilestone] },
    currentMilestoneName() {
      return this.milestoneConfig.find(m => m.key === this.currentMilestone)?.name || ''
    },
    filteredHbls() {
      return this.hbls.filter(h => {
        const q = this.filterHbl.toLowerCase()
        const qs = this.filterSupplier.toLowerCase()
        return (!q || h.hblNo.toLowerCase().includes(q))
          && (!qs || h.supplier.toLowerCase().includes(qs))
      })
    },
  },

  created() {
    // Support navigating from Dashboard with ?milestone=PGS etc.
    const q = this.$route.query
    if (q.milestone && ['PGS','FINANCE','CUSTOMS'].includes(q.milestone)) {
      this.currentMilestone = q.milestone
    }
  },

  methods: {
    switchMilestone(key) { this.currentMilestone = key; this.selectedHbls = [] },

    toggleExpand(row) { row.expanded = !row.expanded },

    hasRecheck(row) {
      return Object.values(row.milestones).some(m => m.isRecheck)
    },

    lockReason(row, milestone) {
      return row.milestones[milestone].lockReason || 'previous milestone'
    },

    stepLabel(status) {
      return { IN_PROGRESS:'In Progress', COMPLETE:'Complete', LOCKED:'Locked',
               PENDING:'Pending' }[status] || status
    },

    stepPipClass(status) {
      return { IN_PROGRESS:'pip-active', COMPLETE:'pip-done', LOCKED:'pip-locked', PENDING:'pip-pending' }[status] || 'pip-pending'
    },
    stepPipIcon(status) {
      return { IN_PROGRESS:'el-icon-time', COMPLETE:'el-icon-check', LOCKED:'el-icon-lock', PENDING:'el-icon-minus' }[status] || 'el-icon-minus'
    },

    milestoneBadgeClass(status) {
      return { IN_PROGRESS:'in-progress', COMPLETE:'completed', LOCKED:'locked', PENDING:'pending' }[status] || 'pending'
    },

    historyStatusClass(status) {
      return { Complete:'completed', Incomplete:'rejected', Revoke:'pending', Correction:'recheck' }[status] || 'pending'
    },

    openVerifyDialog(hbl) {
      this.verifyDialog = { visible:true, hbl, result:'COMPLETE', reason:'', remark:'', sanitaryCert:false }
    },
    openBulkVerify() {
      this.verifyDialog = { visible:true, hbl:null, result:'COMPLETE', reason:'', remark:'', sanitaryCert:false }
    },

    submitVerify() {
      const { hbl, result, reason, remark } = this.verifyDialog
      const targets = hbl ? [hbl] : this.selectedHbls
      const milestone = this.currentMilestone
      const ORDER = ['PGS', 'FINANCE', 'CUSTOMS']
      const milestoneIdx = ORDER.indexOf(milestone)
      const now = new Date().toLocaleString() + ' CET (UTC+1)'

      // ── Prerequisite check (COMPLETE only) ──────────────────────────────
      // All steps BEFORE the current one must be COMPLETE before this can be approved.
      if (result === 'COMPLETE') {
        const blocked = targets.filter(h =>
          ORDER.slice(0, milestoneIdx).some(k => h.milestones[k].status !== 'COMPLETE')
        )
        if (blocked.length > 0) {
          const names = blocked.map(h => h.hblNo).join(', ')
          const missing = ORDER.slice(0, milestoneIdx).find(k =>
            blocked[0].milestones[k].status !== 'COMPLETE'
          )
          const missingName = this.milestoneConfig.find(m => m.key === missing)?.name || missing
          this.$message.error(`Cannot approve: "${missingName}" must be completed first for ${names}`)
          return
        }
      }

      targets.forEach(h => {
        if (result === 'COMPLETE') {
          // ── Mark current milestone complete ──────────────────────────────
          this.$set(h.milestones[milestone], 'status', 'COMPLETE')
          this.$set(h.milestones[milestone], 'completedBy', 'Demo User')
          this.$set(h.milestones[milestone], 'completedAt', now)
          this.$set(h.milestones[milestone], 'isRecheck', false)

          h.verifyHistory.unshift({
            milestone: this.currentMilestoneName, status: 'Complete',
            user: 'Demo User', time: now, reason: '', remark: ''
          })

          // Unlock ONLY the immediately next milestone
          if (milestoneIdx < ORDER.length - 1) {
            const next = ORDER[milestoneIdx + 1]
            if (h.milestones[next].status === 'LOCKED') {
              this.$set(h.milestones[next], 'status', 'IN_PROGRESS')
              this.$set(h.milestones[next], 'lockReason', '')
            }
          }
          this.$message.success(`${this.currentMilestoneName} approved for ${h.hblNo}`)

        } else {
          // ── Not Complete → ALWAYS reset ALL 3 milestones back to step 1 ─
          // Regardless of which step rejected, flow always restarts from PGS.
          h.verifyHistory.unshift({
            milestone: this.currentMilestoneName, status: 'Incomplete',
            user: 'Demo User', time: now, reason, remark
          })

          ORDER.forEach((k, i) => {
            this.$set(h.milestones[k], 'isRecheck', true)
            this.$set(h.milestones[k], 'completedBy', null)
            this.$set(h.milestones[k], 'completedAt', null)
            if (i === 0) {
              // PGS → back to In Progress (step 1 restarts)
              this.$set(h.milestones[k], 'status', 'IN_PROGRESS')
              this.$set(h.milestones[k], 'lockReason', '')
            } else {
              // FIN + CUS → locked until PGS passes again
              this.$set(h.milestones[k], 'status', 'LOCKED')
              this.$set(h.milestones[k], 'lockReason',
                i === 1 ? 'Waiting for PGS Check' : 'Waiting for Finance Check')
            }
          })

          this.$message.error(`Rejected — all milestones reset to step 1 (PGS Re-check) for ${h.hblNo}`)
        }
      })

      this.verifyDialog.visible = false
      this.selectedHbls = []
    },
  },
}
</script>

<style lang="scss" scoped>
// ── Milestone Selector ───────────────────────────────────────────────────────
.milestone-selector {
  display:flex; align-items:stretch; margin-bottom:14px;
  background:#fff; border-radius:8px; border:1px solid $border; overflow:hidden;
}
.ms-tab {
  flex:1; display:flex; align-items:center; gap:10px; padding:12px 16px;
  cursor:pointer; transition:background 0.2s; position:relative;
  border-right:1px solid $border;
  &:last-child { border-right:none; }
  &:hover { background:#f5f9fd; }
  &.active { background:#004F7C;
    .ms-tab-num  { background:rgba(255,255,255,0.2); color:#fff; }
    .ms-tab-name { color:#fff; }
    .ms-tab-role { color:rgba(255,255,255,0.65); }
    .ms-arrow    { color:rgba(255,255,255,0.4); }
  }
}
.ms-tab-num {
  width:28px; height:28px; border-radius:50%; background:$bg-page; color:$primary;
  display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; flex-shrink:0;
}
.ms-tab-body { flex:1; }
.ms-tab-name { font-weight:600; font-size:13px; color:$text-primary; }
.ms-tab-role { font-size:11px; color:$text-secondary; margin-top:2px; }
.ms-arrow    { font-size:12px; color:$border; flex-shrink:0; }

// ── KPI Pills ────────────────────────────────────────────────────────────────
.kpi-pill {
  border-radius:6px; padding:10px 16px; display:flex; align-items:center; gap:10px;
  background:#fff; border:1px solid $border;
}
.kpi-pill-num   { font-size:22px; font-weight:700; }
.kpi-pill-label { font-size:12px; color:$text-secondary; }
.kpi-possible .kpi-pill-num { color:#3A71A8; }
.kpi-urgent   .kpi-pill-num { color:#E6A817; }
.kpi-overdue  .kpi-pill-num { color:#ff4949; }
.kpi-finished .kpi-pill-num { color:#13ce66; }

// ── 3-Step Progress ──────────────────────────────────────────────────────────
.progress-strip { display:flex; gap:4px; align-items:center; }
.step-pip {
  display:flex; align-items:center; gap:3px; padding:2px 6px; border-radius:10px;
  font-size:10px; font-weight:700; white-space:nowrap;
  i { font-size:10px; }
  &.pip-done    { background:#e6f9ef; color:darken(#13ce66,10%); }
  &.pip-active  { background:#ecf5ff; color:#004F7C; }
  &.pip-locked  { background:#f4f4f5; color:#c0c4cc; }
  &.pip-pending { background:#f4f4f5; color:#909399; }
}

// ── HBL link ─────────────────────────────────────────────────────────────────
.hbl-link { color:$primary; cursor:pointer; font-weight:600;
  &:hover { text-decoration:underline; }
}

// ── Expanded Detail ──────────────────────────────────────────────────────────
.expanded-detail {
  background:#f8fafc; border:1px solid $border; border-radius:6px;
  margin:4px 0 8px; padding:14px 16px;
}
.expanded-hbl-header {
  display:flex; align-items:center; gap:8px; margin-bottom:12px;
}
.exp-hbl-no       { font-weight:700; color:$primary; font-size:14px; white-space:nowrap; }
.exp-hbl-supplier { color:$text-secondary; font-size:12px; white-space:nowrap; }

// Re-check banner
.recheck-banner {
  display:flex; align-items:flex-start; gap:8px; background:#fff8e0;
  border:1px solid #ffd666; border-radius:6px; padding:10px 14px; margin-bottom:8px;
  font-size:12px; color:#7d5a00;
  i { font-size:16px; color:#E6A817; margin-top:1px; flex-shrink:0; }
}

// Milestone pills in history table
.ms-pill {
  display:inline-block; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;
  &.ms-pill-pgs\ check     { background:#ecf5ff; color:#3A71A8; }
  &.ms-pill-finance\ check { background:#fff8e0; color:#e6a817; }
  &.ms-pill-customs\ check { background:#f0f7ff; color:#004F7C; }
  &.ms-pill-oha\ note      { background:#f0fdf4; color:#13ce66; }
}

// ── Verify Dialog ────────────────────────────────────────────────────────────
.verify-dialog-body { padding:0 4px; }
.verify-hbl-info {
  display:flex; align-items:center; gap:8px; padding:8px 12px;
  background:#f8fafc; border-radius:6px; font-size:13px;
  i { color:$primary; font-size:16px; }
  &.bulk i { color:#13ce66; }
}
.vd-supplier { color:$text-secondary; font-size:12px; }
.verify-radio-group {
  display:flex; gap:10px; margin-bottom:12px;
  ::v-deep .el-radio-button__inner { padding:8px 24px; font-size:13px; }
  ::v-deep .el-radio-button.is-active .el-radio-button__inner { background:$primary; border-color:$primary; }
}
.verify-reason-block { border:1px solid $border; border-radius:6px; padding:12px; margin-bottom:12px; background:#fff8f8; }
.sanitary-block {
  display:flex; align-items:center; gap:10px; padding:10px 14px;
  border:1px solid $border; border-radius:6px; background:#f8fafc;
}
.sanitary-label { font-size:13px; color:$text-primary; }

// History status badges
.status-badge {
  &.recheck { background:#f0fdf4; color:#13ce66; }
}
</style>
