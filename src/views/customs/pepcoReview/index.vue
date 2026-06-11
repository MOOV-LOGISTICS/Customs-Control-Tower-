<template>
  <div class="app-container">

    <!-- ── Verify Documents Counter Board (follows selected Pending Task) ── -->
    <el-card class="counter-board">
      <div class="cb-inner">
        <div class="cb-title">
          <div class="cb-task-name">{{ currentMilestoneName }}</div>
          <div v-if="currentMilestoneLegacy" class="cb-task-legacy">({{ currentMilestoneLegacy }})</div>
        </div>
        <div class="cb-stats">
          <div class="cb-stat possible"><span class="cb-num">{{ currentKpi.possible }}</span><span class="cb-label">Possible</span></div>
          <div class="cb-divider"></div>
          <div class="cb-stat urgent"><span class="cb-num">{{ currentKpi.urgent }}</span><span class="cb-label">Urgent</span></div>
          <div class="cb-divider"></div>
          <div class="cb-stat overdue"><span class="cb-num">{{ currentKpi.overdue }}</span><span class="cb-label">Overdue</span></div>
          <div class="cb-divider"></div>
          <div class="cb-stat finished"><span class="cb-num">{{ currentKpi.finished }}</span><span class="cb-label">Finished</span></div>
        </div>
      </div>
    </el-card>

    <!-- ── Filters + Actions ──────────────────────────────────────────── -->
    <el-card style="margin-bottom:12px">
      <el-row :gutter="10" align="middle" type="flex">
        <el-col :span="4"><el-input v-model="filterHbl" placeholder="HBL Number" size="mini" clearable prefix-icon="el-icon-search" /></el-col>
        <el-col :span="4"><el-input v-model="filterSupplier" placeholder="Supplier Name" size="mini" clearable /></el-col>
        <el-col :span="7">
          <el-select v-model="currentMilestone" size="mini" placeholder="Pending Task" style="width:100%" @change="clearSelection">
            <el-option value="ALL" label="All Tasks">
              <span style="font-weight:600">All Tasks</span>
              <span style="font-size:11px;color:#999;margin-left:6px">(no filter — every HBL shown)</span>
            </el-option>
            <el-option v-for="m in milestoneConfig" :key="m.key" :value="m.key" :label="m.name">
              <span>{{ m.name }}</span>
              <span v-if="m.legacy" style="font-size:11px;color:#999;margin-left:6px">({{ m.legacy }})</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3"><el-button type="primary" size="mini" icon="el-icon-search" @click="$message.info('Filter applied')">Search</el-button></el-col>
        <el-col :span="6" style="text-align:right">
          <el-tooltip v-if="!canVerify" content="Your role has read-only access to this page" placement="top">
            <el-tag size="mini" type="info"><i class="el-icon-view"></i> Read-only</el-tag>
          </el-tooltip>
          <el-button v-else type="primary" size="mini" icon="el-icon-finished" :disabled="selectedHbls.length===0" @click="openBulkVerify">
            Verify Documents ({{ selectedHbls.length }})
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- ── HBL Table ──────────────────────────────────────────────────── -->
    <el-card>
      <el-table
        ref="hblTable"
        :data="filteredHbls" size="mini" stripe border
        @selection-change="selectedHbls = $event"
      >
        <el-table-column type="selection" width="40" :selectable="rowSelectable" />
        <el-table-column label="HBL Number" width="120">
          <template #default="{row}">
            <span class="hbl-link" @click="toggleExpand(row)">{{ row.hblNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="MBL Number" prop="mblNo" width="120" />
        <el-table-column label="Supplier" prop="supplier" min-width="160" />
        <el-table-column label="POD" prop="pod" width="70" />
        <el-table-column label="ETA" prop="eta" width="95" />

        <!-- Current Stage (overall HBL progress) -->
        <el-table-column label="Current Stage" width="200">
          <template #default="{row}">
            <span :class="['stage-badge', currentStage(row).cls]">{{ currentStage(row).label }}</span>
            <el-tag v-if="currentStage(row).recheck" size="mini" type="warning" style="margin-left:4px;font-size:9px">RE-CHECK</el-tag>
          </template>
        </el-table-column>

        <!-- Status of the effective task (selected task, or current stage in All mode) -->
        <el-table-column label="Status" width="130">
          <template #default="{row}">
            <div>
              <span :class="['status-badge', milestoneBadgeClass(row.milestones[effectiveKey(row)].status)]">
                {{ stepLabel(row.milestones[effectiveKey(row)].status) }}
              </span>
              <el-tag v-if="row.milestones[effectiveKey(row)].isRecheck" size="mini" type="warning" style="margin-left:4px;font-size:9px">RE-CHECK</el-tag>
              <div v-if="row.milestones[effectiveKey(row)].status==='LOCKED'" style="font-size:10px;color:#b0b6bf;margin-top:2px">
                {{ row.milestones[effectiveKey(row)].lockReason }}
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- Action -->
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
              <div style="display:flex;justify-content:flex-end;margin-top:8px">
                <el-button type="primary" size="mini" icon="el-icon-download" @click="downloadAllDocs(row)">
                  Download All ({{ row.documents.length }})
                </el-button>
              </div>
              <el-table :data="row.documents" size="mini" stripe border style="margin-top:8px">
                <el-table-column label="PO Number" width="120" prop="poNo" />
                <el-table-column label="Document Type" min-width="150" prop="docType" />
                <el-table-column label="File Name" min-width="170" prop="fileName" />
                <el-table-column label="Version" width="70" align="center">
                  <template #default="{row}"><el-tag size="mini" type="info">v{{ row.version }}</el-tag></template>
                </el-table-column>
                <el-table-column label="AI Check" width="95">
                  <template #default="{row}">
                    <span :class="['status-badge', row.status==='VERIFIED'?'verified':'unverified']">
                      {{ row.status==='VERIFIED'?'Verified':'Unverified' }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="Review Status" width="150">
                  <template #default="{row}">
                    <el-tooltip v-if="row.reviewStatus==='REJECTED'" placement="top"
                      :content="`${row.reject.reason} — ${row.reject.by}, ${row.reject.at}`">
                      <span class="status-badge rejected">Rejected</span>
                    </el-tooltip>
                    <el-tooltip v-else-if="row.reviewStatus==='RESUBMITTED'" placement="top"
                      :content="`Re-uploaded after rejection: ${row.reject.reason}`">
                      <span class="status-badge resubmitted">Resubmitted v{{ row.version }}</span>
                    </el-tooltip>
                    <span v-else style="color:#c0c4cc">—</span>
                  </template>
                </el-table-column>
                <el-table-column label="Uploaded" width="130" prop="uploadedAt" />
                <el-table-column label="" width="70" align="center">
                  <template #default="scope">
                    <el-button type="text" size="mini" icon="el-icon-view" @click="openDocPreview(row, scope.row)">Preview</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <!-- Documents Verified tab -->
            <el-tab-pane name="verified">
              <span slot="label"><i class="el-icon-finished"></i> Documents Verified</span>
              <!-- Pending Correction banner — live progress of the supplier's re-uploads -->
              <div v-if="currentStage(row).cls==='stage-correction'" class="correction-banner">
                <i class="el-icon-warning-outline"></i>
                <div style="flex:1">
                  <strong>PENDING CORRECTION</strong> —
                  Waiting for supplier: <strong>{{ progress(row).done }} of {{ progress(row).total }}</strong> rejected document(s) re-uploaded.
                  Flow resets to PGS re-check automatically when all are corrected.
                  <div class="corr-doc-list">
                    <div v-for="(d, i) in progress(row).docs" :key="i" class="corr-doc-row">
                      <i :class="d.reviewStatus === 'RESUBMITTED' ? 'el-icon-circle-check ok' : 'el-icon-remove-outline waiting'"></i>
                      <span class="cdr-po">{{ d.poNo }}</span>
                      <span class="cdr-type">{{ d.docType }}</span>
                      <span class="cdr-file">{{ d.fileName }} (v{{ d.version }})</span>
                      <span :class="['cdr-state', d.reviewStatus === 'RESUBMITTED' ? 'ok' : 'waiting']">
                        {{ d.reviewStatus === 'RESUBMITTED' ? 'Re-uploaded' : 'Waiting for re-upload' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Re-check banner -->
              <div v-if="hasRecheck(row)" class="recheck-banner">
                <i class="el-icon-warning-outline"></i>
                <div>
                  <strong>RE-CHECK REQUIRED</strong> — This HBL was previously rejected and corrected. Please review the history below before proceeding.
                </div>
              </div>

              <!-- 3-node milestone timeline -->
              <div class="ms-timeline">
                <div v-for="(m, i) in milestoneConfig" :key="m.key" class="tl-node">
                  <div class="tl-top">
                    <div :class="['tl-circle', tlCircleClass(row.milestones[m.key])]">
                      <i :class="stepPipIcon(row.milestones[m.key].status)"></i>
                    </div>
                    <div v-if="i < milestoneConfig.length - 1"
                      :class="['tl-connector', { done: row.milestones[m.key].status === 'COMPLETE' }]"></div>
                  </div>
                  <div class="tl-name">{{ m.short }} — {{ m.shortName }}</div>
                  <div :class="['tl-status', tlCircleClass(row.milestones[m.key])]">
                    {{ stepLabel(row.milestones[m.key].status) }}
                    <span v-if="row.milestones[m.key].isRecheck" class="tl-recheck">RE-CHECK</span>
                  </div>
                  <div class="tl-meta">
                    <template v-if="row.milestones[m.key].status === 'COMPLETE'">
                      {{ row.milestones[m.key].completedBy }}<br>{{ row.milestones[m.key].completedAt }}
                    </template>
                    <template v-else-if="row.milestones[m.key].lockReason">
                      {{ row.milestones[m.key].lockReason }}
                    </template>
                    <template v-else>—</template>
                  </div>
                </div>
              </div>
              <el-table :data="row.verifyHistory" size="mini" stripe border style="margin-top:8px">
                <el-table-column label="Milestone" width="220">
                  <template #default="{row}">
                    <span :class="['ms-pill', `ms-pill-${row.milestone.toLowerCase()}`]">{{ row.milestone }}</span>
                    <el-tag v-if="row.isRecheck" size="mini" type="warning" style="margin-left:4px;font-size:9px;vertical-align:middle">RE-CHECK</el-tag>
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
    <el-dialog :visible.sync="verifyDialog.visible" :title="`Document Verification — ${verifyDialogTaskName}`" width="520px">
      <div class="verify-dialog-body">
        <!-- HBL info -->
        <div class="verify-hbl-info" v-if="verifyDialog.hbl">
          <i class="el-icon-ship"></i>
          <span>{{ verifyDialog.hbl.hblNo }}</span>
          <span class="vd-supplier">{{ verifyDialog.hbl.supplier }}</span>
          <el-tag size="mini" type="info">{{ verifyDialogTaskName }}</el-tag>
        </div>
        <div class="verify-hbl-info bulk" v-else>
          <i class="el-icon-finished"></i>
          <span>Bulk verify — {{ selectedHbls.length }} HBL(s) selected</span>
          <el-tag size="mini" type="info">{{ verifyDialogTaskName }}</el-tag>
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

          <!-- Problem documents — required; these are returned to the supplier -->
          <template v-if="verifyDialog.hbl">
            <div class="doc-sel-label">Problem document(s) * <span>— will be returned to the supplier for re-upload</span></div>
            <el-checkbox-group v-model="verifyDialog.docSel" class="doc-sel-list">
              <el-checkbox v-for="(d, i) in verifyDialog.hbl.documents" :key="i" :label="i" class="doc-sel-row">
                <span class="dsr-po">{{ d.poNo }}</span>
                <span class="dsr-type">{{ d.docType }}</span>
                <span class="dsr-file">{{ d.fileName }} (v{{ d.version }})</span>
              </el-checkbox>
            </el-checkbox-group>
          </template>
          <el-alert v-else type="warning" :closable="false" show-icon
            title="Rejection requires selecting the problem documents — please verify HBLs one at a time when rejecting." />
        </div>

        <!-- Sanitary Certificate toggle (Customs milestone only) -->
        <div v-if="verifyDialog.milestoneKey === 'CUSTOMS' || (!verifyDialog.milestoneKey && currentMilestone === 'CUSTOMS')" class="sanitary-block">
          <el-switch v-model="verifyDialog.sanitaryCert" />
          <span class="sanitary-label">Sanitary Certificate is required</span>
        </div>
      </div>

      <div slot="footer">
        <el-button size="small" @click="verifyDialog.visible=false">Cancel</el-button>
        <el-button size="small" type="primary" @click="submitVerify"
          :disabled="verifyDialog.result==='NOT_COMPLETE' && (!verifyDialog.reason || !verifyDialog.hbl || verifyDialog.docSel.length === 0)">
          Submit
        </el-button>
      </div>
    </el-dialog>

    <!-- ── Document Preview Dialog ───────────────────────────────────── -->
    <el-dialog :visible.sync="docPreview.visible" :title="`Preview — ${docPreview.docType} (v${docPreview.version})`" width="760px" top="5vh">
      <div class="preview-dialog">
        <div class="preview-meta">
          <el-descriptions :column="3" size="mini" border>
            <el-descriptions-item label="Document Type">{{ docPreview.docType }}</el-descriptions-item>
            <el-descriptions-item label="Version">
              <el-tag size="mini" :type="docPreview.status === 'VERIFIED' ? 'success' : 'warning'">
                v{{ docPreview.version }} · {{ docPreview.status === 'VERIFIED' ? 'Verified' : 'Unverified' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="Uploaded">{{ docPreview.uploadedAt }}</el-descriptions-item>
            <el-descriptions-item label="File Name" :span="2">{{ docPreview.fileName }}</el-descriptions-item>
            <el-descriptions-item label="HBL Number">
              <span style="color:#004F7C;font-weight:600">{{ docPreview.hblNo }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div v-if="docPreview.status === 'VERIFIED'" class="preview-verify-bar">
          <i class="el-icon-circle-check" style="color:#13ce66"></i>
          <span>AI Verified — Document type, PO Number and Supplier all matched</span>
        </div>
        <div v-else class="preview-verify-bar unverified">
          <i class="el-icon-warning-outline" style="color:#E6A817"></i>
          <span>Unverified — Pending OHA review</span>
        </div>

        <!-- Simulated PDF viewer -->
        <div class="pdf-viewer">
          <div class="pdf-page">
            <div class="pdf-header-row">
              <div class="pdf-company">{{ docPreview.supplier }}</div>
              <div class="pdf-doc-title">{{ docPreview.docType }}</div>
            </div>
            <div class="pdf-divider"></div>
            <div class="pdf-fields">
              <div class="pdf-field"><span class="pdf-label">HBL Number</span><span class="pdf-value highlight">{{ docPreview.hblNo }}</span></div>
              <div class="pdf-field"><span class="pdf-label">Document No.</span><span class="pdf-value">{{ docPreview.fileName.replace('.pdf','') }}</span></div>
              <div class="pdf-field"><span class="pdf-label">Date</span><span class="pdf-value">{{ docPreview.uploadedAt }}</span></div>
              <div class="pdf-field"><span class="pdf-label">Supplier</span><span class="pdf-value">{{ docPreview.supplier }}</span></div>
            </div>
            <div class="pdf-table-mock">
              <div class="pdf-table-hdr"><span>Item Description</span><span>Qty</span><span>Unit Price</span><span>Amount</span></div>
              <div class="pdf-table-row" v-for="i in 4" :key="i">
                <span>Product Item {{ String.fromCharCode(64+i) }}</span>
                <span>{{ i * 120 }}</span>
                <span>USD {{ (i * 3.5).toFixed(2) }}</span>
                <span>USD {{ (i * 120 * 3.5).toFixed(2) }}</span>
              </div>
              <div class="pdf-table-total"><span>Total</span><span></span><span></span><span>USD 4200.00</span></div>
            </div>
            <div class="pdf-footer">[ Simulated document preview — for demo purposes ]</div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button size="small" icon="el-icon-download" type="primary" @click="$message.success(`Downloading ${docPreview.fileName}…`)">Download</el-button>
        <el-button size="small" @click="docPreview.visible=false">Close</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { roleStore, ROLE_MILESTONE } from '@/store/role'
// Shared with the Document Upload tab: HBL/milestone/document state lives in
// one store so PEPCO rejections and supplier re-uploads stay in sync.
import { reviewStore, rejectDocuments, correctionProgress } from '@/store/reviewFlow'

export default {
  name: 'PepcoReview',
  data() {
    return {
      currentMilestone: 'ALL',
      filterHbl: '', filterSupplier: '', filterStatus: '',
      selectedHbls: [],

      milestoneConfig: [
        { key:'PGS',     step:'①', name:'PGS Document Check',     shortName:'PGS Check',     role:'Pepco PGS',     short:'PGS', legacy:'' },
        { key:'FINANCE', step:'②', name:'Finance Document Check', shortName:'Finance Check', role:'Pepco Finance', short:'FIN', legacy:'' },
        { key:'CUSTOMS', step:'③', name:'Customs Document Check', shortName:'Customs Check', role:'Pepco Customs', short:'CUS', legacy:'Shipping Documents Verify by Pepco' },
      ],

      kpis: {
        PGS:     { possible:102, urgent:5, overdue:18, finished:1234 },
        FINANCE: { possible:87,  urgent:3, overdue:9,  finished:1198 },
        CUSTOMS: { possible:45,  urgent:2, overdue:6,  finished:1150 },
      },


      verifyDialog: {
        visible: false,
        hbl: null,
        milestoneKey: null,
        result: 'COMPLETE',
        reason: '',
        remark: '',
        sanitaryCert: false,
        docSel: [],   // indices of documents flagged as problematic (Not Complete)
      },

      docPreview: {
        visible: false,
        docType: '', fileName: '', version: 1,
        status: 'VERIFIED', uploadedAt: '',
        hblNo: '', supplier: '',
      },
    }
  },

  computed: {
    // HBL/milestone/document state shared with the Document Upload tab
    hbls() { return reviewStore.hbls },

    // ── Role scoping (demo of RBAC: role ↔ milestone mapping) ────────────
    role() { return roleStore.currentRole },
    // milestone the current role operates on; null = not a reviewer
    myKey() { return ROLE_MILESTONE[this.role] || null },
    isOps() { return this.role === 'MOOV Ops' },
    // Supplier / Customs Broker etc. can look but never verify
    canVerify() { return this.isOps || !!this.myKey },

    currentKpi() {
      if (this.currentMilestone === 'ALL') {
        const keys = ['possible', 'urgent', 'overdue', 'finished']
        const sum = {}
        keys.forEach(k => { sum[k] = Object.values(this.kpis).reduce((a, v) => a + v[k], 0) })
        return sum
      }
      return this.kpis[this.currentMilestone]
    },
    currentMilestoneName() {
      if (this.currentMilestone === 'ALL') return 'Verify Documents'
      return this.milestoneConfig.find(m => m.key === this.currentMilestone)?.name || ''
    },
    currentMilestoneLegacy() {
      if (this.currentMilestone === 'ALL') return 'All tasks — PGS + Finance + Customs'
      return this.milestoneConfig.find(m => m.key === this.currentMilestone)?.legacy || ''
    },
    verifyDialogTaskName() {
      if (this.verifyDialog.milestoneKey) return this.milestoneNameOf(this.verifyDialog.milestoneKey)
      if (this.currentMilestone === 'ALL') return 'Current task per HBL'
      return this.currentMilestoneName
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
    } else if (this.myKey) {
      // Reviewer roles land on their own task queue by default
      this.currentMilestone = this.myKey
    }
  },

  watch: {
    // Switching role re-scopes the page: reviewers get their own queue,
    // everyone else gets the global view
    role() {
      this.currentMilestone = this.myKey || 'ALL'
      this.clearSelection()
    },
  },

  methods: {
    switchMilestone(key) { this.currentMilestone = key; this.clearSelection() },

    toggleExpand(row) { row.expanded = !row.expanded },

    hasRecheck(row) {
      return Object.values(row.milestones).some(m => m.isRecheck)
    },

    // The milestone this row is operated against:
    // a specific task when one is selected, or the row's current stage in All mode.
    effectiveKey(row) {
      if (this.currentMilestone !== 'ALL') return this.currentMilestone
      const ORDER = ['PGS', 'FINANCE', 'CUSTOMS']
      const idx = ORDER.findIndex(k => row.milestones[k].status !== 'COMPLETE')
      return idx === -1 ? 'CUSTOMS' : ORDER[idx]
    },
    milestoneNameOf(key) {
      return this.milestoneConfig.find(m => m.key === key)?.name || key
    },

    // Row-level permission (front-end mirror of the backend RBAC check):
    // a row is operable only when the milestone it sits at belongs to my role
    // and is actually open for review. MOOV Ops bypasses the role scope.
    rowSelectable(row) {
      if (!this.canVerify) return false
      const key = this.effectiveKey(row)
      if (!this.isOps && key !== this.myKey) return false
      return row.milestones[key].status === 'IN_PROGRESS'
    },

    // Overall HBL progress — which stage is it at right now (independent of selected task)
    currentStage(row) {
      const ORDER = ['PGS', 'FINANCE', 'CUSTOMS']
      // Pending correction overrides everything
      if (ORDER.some(k => row.milestones[k].status === 'PENDING_CORRECTION')) {
        return { label:'Pending Correction', cls:'stage-correction', icon:'el-icon-warning-outline', recheck:false }
      }
      // All complete
      if (ORDER.every(k => row.milestones[k].status === 'COMPLETE')) {
        return { label:'All Stages Complete', cls:'stage-done', icon:'el-icon-circle-check', recheck:false }
      }
      // First non-complete = current stage
      const idx = ORDER.findIndex(k => row.milestones[k].status !== 'COMPLETE')
      const cfg = this.milestoneConfig[idx]
      const ms = row.milestones[ORDER[idx]]
      return {
        label: cfg.shortName,
        cls: 'stage-active', icon: 'el-icon-time', recheck: ms.isRecheck,
      }
    },

    tlCircleClass(ms) {
      return {
        COMPLETE: 'tl-done', IN_PROGRESS: 'tl-active', LOCKED: 'tl-locked',
        PENDING: 'tl-locked', PENDING_CORRECTION: 'tl-correction',
      }[ms.status] || 'tl-locked'
    },

    lockReason(row, milestone) {
      return row.milestones[milestone].lockReason || 'previous milestone'
    },

    stepLabel(status) {
      return { IN_PROGRESS:'In Progress', COMPLETE:'Complete', LOCKED:'Locked',
               PENDING:'Pending', PENDING_CORRECTION:'Pending Correction' }[status] || status
    },

    stepPipClass(status) {
      return { IN_PROGRESS:'pip-active', COMPLETE:'pip-done', LOCKED:'pip-locked', PENDING:'pip-pending', PENDING_CORRECTION:'pip-correction' }[status] || 'pip-pending'
    },
    stepPipIcon(status) {
      return { IN_PROGRESS:'el-icon-time', COMPLETE:'el-icon-check', LOCKED:'el-icon-lock', PENDING:'el-icon-minus', PENDING_CORRECTION:'el-icon-warning-outline' }[status] || 'el-icon-minus'
    },

    milestoneBadgeClass(status) {
      return { IN_PROGRESS:'in-progress', COMPLETE:'completed', LOCKED:'locked', PENDING:'pending', PENDING_CORRECTION:'recheck' }[status] || 'pending'
    },

    historyStatusClass(status) {
      return { Complete:'completed', Incomplete:'rejected', Revoke:'pending', Correction:'recheck' }[status] || 'pending'
    },

    // Correction progress of the current rejection round (shared store)
    progress(h) { return correctionProgress(h) },

    downloadAllDocs(h) {
      this.$notify({
        title: 'Download started',
        dangerouslyUseHTMLString: true,
        message: `<div style="font-size:12px;line-height:1.7">
          <div><b>${h.hblNo}</b> — ${h.documents.length} file(s) packed as ZIP</div>
          ${h.documents.map(d => `<div style="color:#999">📄 ${d.fileName} (v${d.version})</div>`).join('')}
        </div>`,
        type: 'success', duration: 4000,
      })
    },

    openDocPreview(hblRow, doc) {
      this.docPreview = {
        visible: true,
        docType: doc.docType,
        fileName: doc.fileName,
        version: doc.version,
        status: doc.status,
        uploadedAt: doc.uploadedAt,
        hblNo: hblRow.hblNo,
        supplier: hblRow.supplier,
      }
    },

    openVerifyDialog(hbl) {
      this.verifyDialog = { visible:true, hbl, milestoneKey:this.effectiveKey(hbl), result:'COMPLETE', reason:'', remark:'', sanitaryCert:false, docSel:[] }
    },
    openBulkVerify() {
      // Bulk with a single selection keeps the full dialog (incl. rejection);
      // multi-selection can only approve — rejection needs per-document flags.
      const single = this.selectedHbls.length === 1 ? this.selectedHbls[0] : null
      this.verifyDialog = {
        visible:true, hbl:single, milestoneKey:single ? this.effectiveKey(single) : null,
        result:'COMPLETE', reason:'', remark:'', sanitaryCert:false, docSel:[],
      }
    },

    submitVerify() {
      const { hbl, result, reason, remark, milestoneKey } = this.verifyDialog
      const targets = hbl ? [hbl] : this.selectedHbls
      const ORDER = ['PGS', 'FINANCE', 'CUSTOMS']
      const now = new Date().toLocaleString() + ' CET (UTC+1)'
      // Milestone per target: fixed when opened from a row / a selected task;
      // each row's own current stage when bulk-verifying in All mode.
      const mkFor = h => milestoneKey || this.effectiveKey(h)

      // ── Prerequisite check (COMPLETE only) ──────────────────────────────
      // All steps BEFORE the target one must be COMPLETE before it can be approved.
      if (result === 'COMPLETE') {
        const blocked = targets.filter(h => {
          const idx = ORDER.indexOf(mkFor(h))
          return ORDER.slice(0, idx).some(k => h.milestones[k].status !== 'COMPLETE')
        })
        if (blocked.length > 0) {
          const names = blocked.map(h => h.hblNo).join(', ')
          const idx = ORDER.indexOf(mkFor(blocked[0]))
          const missing = ORDER.slice(0, idx).find(k =>
            blocked[0].milestones[k].status !== 'COMPLETE'
          )
          this.$message.error(`Cannot approve: "${this.milestoneNameOf(missing)}" must be completed first for ${names}`)
          return
        }
      }

      targets.forEach(h => {
        const milestone = mkFor(h)
        const milestoneIdx = ORDER.indexOf(milestone)
        const milestoneName = this.milestoneNameOf(milestone)

        if (result === 'COMPLETE') {
          // ── Mark target milestone complete ───────────────────────────────
          this.$set(h.milestones[milestone], 'status', 'COMPLETE')
          this.$set(h.milestones[milestone], 'completedBy', 'Demo User')
          this.$set(h.milestones[milestone], 'completedAt', now)
          this.$set(h.milestones[milestone], 'isRecheck', false)

          h.verifyHistory.unshift({
            milestone: milestoneName, status: 'Complete',
            user: 'Demo User', time: now, reason: '', remark: '',
            isRecheck: !!h.milestones[milestone].isRecheck,
          })

          // Unlock ONLY the immediately next milestone
          if (milestoneIdx < ORDER.length - 1) {
            const next = ORDER[milestoneIdx + 1]
            if (h.milestones[next].status === 'LOCKED') {
              this.$set(h.milestones[next], 'status', 'IN_PROGRESS')
              this.$set(h.milestones[next], 'lockReason', '')
            }
          }
          this.$message.success(`${milestoneName} approved for ${h.hblNo}`)

        } else {
          // ── Not Complete → reject the flagged documents ──────────────────
          // Documents go REJECTED, all milestones go PENDING_CORRECTION.
          // The reset to PGS re-check happens automatically once the supplier
          // has re-uploaded every rejected document (Document Upload tab).
          const docs = this.verifyDialog.docSel.map(i => h.documents[i])
          rejectDocuments(h, docs, { reason, remark, milestoneName, user: 'Demo User' })

          // Email notification feedback
          this.$notify({
            title: 'Rejection submitted',
            dangerouslyUseHTMLString: true,
            message: `<div style="font-size:12px;line-height:1.7">
              <div><b>${h.hblNo}</b> — ${milestoneName}</div>
              <div>Reason: ${reason}</div>
              <div style="margin-top:4px">Returned documents:<br>${docs.map(d => `<span style="color:#c25e00">· ${d.poNo} — ${d.docType} (${d.fileName})</span>`).join('<br>')}</div>
              <div style="color:#13ce66;margin-top:4px">
                ✉ Notification email sent to supplier<br>
                <span style="color:#999">${h.supplier.toLowerCase().replace(/[^a-z]/g,'')}@supplier-mail.com</span>
              </div>
              <div style="color:#999;margin-top:4px">Flow resets to PGS re-check automatically after the supplier re-uploads all returned documents.</div>
            </div>`,
            type: 'warning', duration: 6000,
          })
        }
      })

      this.verifyDialog.visible = false
      this.clearSelection()
    },

    clearSelection() {
      this.selectedHbls = []
      this.$refs.hblTable && this.$refs.hblTable.clearSelection()
    },
  },
}
</script>

<style lang="scss" scoped>
// ── Verify Documents Counter Board ──────────────────────────────────────────
.counter-board {
  margin-bottom:12px;
  ::v-deep .el-card__body { padding:12px 20px; }
}
.cb-inner { display:flex; align-items:center; justify-content:space-between; gap:20px; }
.cb-title { min-width:240px; }
.cb-task-name   { font-weight:700; font-size:15px; color:$text-primary; }
.cb-task-legacy { font-size:11px; color:#999; margin-top:2px; }
.cb-stats { display:flex; align-items:center; gap:24px; flex:1; justify-content:flex-end; }
.cb-stat  { text-align:center; min-width:70px; }
.cb-num   { display:block; font-size:24px; font-weight:700; line-height:1.2; }
.cb-label { font-size:12px; color:$text-secondary; }
.cb-divider { width:1px; height:34px; background:$border; }
.cb-stat.possible .cb-num { color:#3A71A8; }
.cb-stat.urgent   .cb-num { color:#E6A817; }
.cb-stat.overdue  .cb-num { color:#ff4949; }
.cb-stat.finished .cb-num { color:#13ce66; }

// ── Current Stage badge ──────────────────────────────────────────────────────
.stage-badge {
  display:inline-flex; align-items:center; gap:4px;
  padding:3px 10px; border-radius:10px; font-size:11px; font-weight:600; white-space:nowrap;
  i { font-size:12px; }
  &.stage-active     { background:#ecf5ff; color:#004F7C; }
  &.stage-done       { background:#e6f9ef; color:darken(#13ce66,10%); }
  &.stage-correction { background:#fff8e0; color:#e6a817; }
}

// ── Milestone Timeline (Documents Verified tab) ──────────────────────────────
.ms-timeline {
  display:flex; align-items:flex-start;
  background:#fff; border:1px solid $border; border-radius:6px;
  padding:16px 20px 12px; margin:8px 0 10px;
}
.tl-node { flex:1; position:relative; }
.tl-top { display:flex; align-items:center; }
.tl-circle {
  width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center;
  font-size:15px; flex-shrink:0; z-index:1;
  &.tl-done       { background:#13ce66; color:#fff; }
  &.tl-active     { background:#004F7C; color:#fff; }
  &.tl-locked     { background:#e4e7ed; color:#c0c4cc; }
  &.tl-correction { background:#E6A817; color:#fff; }
}
.tl-connector {
  flex:1; height:2px; background:#e4e7ed; margin:0 6px;
  &.done { background:#13ce66; }
}
.tl-name   { font-size:12px; font-weight:700; margin-top:8px; color:$text-primary; }
.tl-status {
  font-size:11px; font-weight:600; margin-top:2px;
  &.tl-done       { color:darken(#13ce66,10%); }
  &.tl-active     { color:#004F7C; }
  &.tl-locked     { color:#c0c4cc; }
  &.tl-correction { color:#e6a817; }
}
.tl-recheck {
  display:inline-block; background:#fff8e0; color:#e6a817;
  font-size:9px; font-weight:700; padding:0 4px; border-radius:3px; margin-left:4px;
}
.tl-meta { font-size:11px; color:#999; margin-top:3px; line-height:1.5; }

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

// Pending Correction banner (with Supplier demo entry)
.correction-banner {
  display:flex; align-items:center; gap:8px; background:#fff1f0;
  border:1px solid #ffa39e; border-radius:6px; padding:10px 14px; margin-bottom:8px;
  font-size:12px; color:#8c2e2b;
  i { font-size:16px; color:#ff4949; flex-shrink:0; }
}

// Milestone pills in history table
.ms-pill {
  display:inline-block; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;
  &.ms-pill-pgs\ check     { background:#ecf5ff; color:#3A71A8; }
  &.ms-pill-finance\ check { background:#fff8e0; color:#e6a817; }
  &.ms-pill-customs\ check { background:#f0f7ff; color:#004F7C; }
  &.ms-pill-supplier\ note { background:#f0fdf4; color:#13ce66; }
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
  &.recheck     { background:#f0fdf4; color:#13ce66; }
  &.resubmitted { background:#fdf3e3; color:#c25e00; }
}

// Problem-document checklist (reject flow in verify dialog)
.doc-sel-label {
  font-size:12px; font-weight:600; color:$text-primary; margin:4px 0 6px;
  span { font-weight:400; color:#999; font-size:11px; }
}
.doc-sel-list { display:flex; flex-direction:column; gap:4px; }
.doc-sel-row {
  margin:0 !important; padding:6px 10px; background:#fff; border:1px solid $border; border-radius:6px;
  display:flex; align-items:center;
  ::v-deep .el-checkbox__label { display:inline-flex; gap:8px; align-items:center; font-size:12px; }
  .dsr-po   { color:#3A71A8; font-weight:600; }
  .dsr-type { font-weight:600; }
  .dsr-file { color:#999; font-size:11px; }
}

// Correction progress list inside the Pending Correction banner
.corr-doc-list { margin-top:8px; display:flex; flex-direction:column; gap:4px; }
.corr-doc-row {
  display:flex; align-items:center; gap:8px; font-size:11px;
  background:rgba(255,255,255,0.6); border-radius:4px; padding:4px 8px;
  i.ok      { color:#13ce66; }
  i.waiting { color:#e6a817; }
  .cdr-po   { color:#3A71A8; font-weight:600; }
  .cdr-type { font-weight:600; }
  .cdr-file { color:#999; }
  .cdr-state { margin-left:auto; font-weight:600;
    &.ok      { color:#13ce66; }
    &.waiting { color:#c25e00; }
  }
}

// ── Document Preview Dialog ──────────────────────────────────────────────────
.preview-dialog { display:flex; flex-direction:column; gap:12px; }
.preview-verify-bar {
  display:flex; align-items:center; gap:8px; padding:8px 12px;
  border-radius:6px; font-size:12px; font-weight:500;
  background:#e6f9ef; color:darken(#13ce66,10%);
  &.unverified { background:#fff8e0; color:#e6a817; }
  i { font-size:16px; }
}
.pdf-viewer { border:1px solid $border; border-radius:6px; overflow:hidden; max-height:380px; overflow-y:auto; }
.pdf-page { background:#fff; padding:24px 28px; font-size:12px; min-height:300px; }
.pdf-header-row { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; }
.pdf-company   { font-weight:700; font-size:14px; color:$primary; }
.pdf-doc-title { font-weight:700; font-size:16px; color:$text-primary; }
.pdf-divider   { height:2px; background:$primary; margin-bottom:14px; }
.pdf-fields    { display:grid; grid-template-columns:1fr 1fr; gap:6px 20px; margin-bottom:16px; }
.pdf-field     { display:flex; gap:8px; }
.pdf-label     { color:$text-secondary; width:90px; flex-shrink:0; }
.pdf-value     { color:$text-primary; font-weight:500; &.highlight { color:$primary; font-weight:700; } }
.pdf-table-mock { border:1px solid $border; border-radius:4px; overflow:hidden; margin-bottom:12px; }
.pdf-table-hdr { display:grid; grid-template-columns:3fr 1fr 1fr 1fr; background:#f5f7fa; padding:6px 10px; font-weight:600; font-size:11px; color:$text-secondary; gap:8px; }
.pdf-table-row { display:grid; grid-template-columns:3fr 1fr 1fr 1fr; padding:5px 10px; border-top:1px solid $border; gap:8px;
  &:nth-child(even) { background:#fafafa; }
}
.pdf-table-total { display:grid; grid-template-columns:3fr 1fr 1fr 1fr; padding:6px 10px; border-top:2px solid $border; font-weight:700; gap:8px; background:#f0f7ff; }
.pdf-footer { text-align:center; color:#bbb; font-size:11px; margin-top:8px; font-style:italic; }
</style>
