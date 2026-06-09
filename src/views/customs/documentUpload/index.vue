<template>
  <div class="app-container">

    <!-- PO / HBL Selector -->
    <el-card class="po-selector-card">
      <el-row :gutter="16" align="middle" type="flex">
        <el-col :span="6">
          <div class="selector-label">Select PO / HBL</div>
          <el-select v-model="selectedHbl" style="width:100%" @change="onHblChange">
            <el-option v-for="h in hblList" :key="h.value" :label="h.label" :value="h.value" />
          </el-select>
        </el-col>
        <el-col :span="18" v-if="hblInfo">
          <el-descriptions :column="6" size="mini" border>
            <el-descriptions-item label="Supplier">{{ hblInfo.supplier }}</el-descriptions-item>
            <el-descriptions-item label="PO Number">
              <strong style="color:#004F7C">{{ hblInfo.poNumber }}</strong>
            </el-descriptions-item>
            <el-descriptions-item label="POL">{{ hblInfo.pol }}</el-descriptions-item>
            <el-descriptions-item label="POD">{{ hblInfo.pod }}</el-descriptions-item>
            <el-descriptions-item label="ETD">{{ hblInfo.etd }}</el-descriptions-item>
            <el-descriptions-item label="ETA">{{ hblInfo.eta }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
    </el-card>

    <template v-if="selectedHbl">

      <!-- ── Milestone Status Bar ─────────────────────────────────────────── -->
      <el-card class="milestone-bar" :class="milestoneBarClass">
        <div class="milestone-bar-inner">
          <div class="milestone-bar-left">
            <i :class="milestoneIcon"></i>
            <div>
              <div class="milestone-bar-title">{{ milestoneTitle }}</div>
              <div class="milestone-bar-sub">{{ milestoneSub }}</div>
            </div>
          </div>
          <el-button
            v-if="milestoneComplete"
            type="success" size="small" icon="el-icon-check"
            @click="$message.success('Milestone marked as complete! Pepco has been notified.')"
          >Mark Milestone Complete</el-button>
          <el-tooltip v-else content="Both Commercial Invoice and Packing List must be verified before completing this milestone" placement="left">
            <span>
              <el-button type="success" size="small" icon="el-icon-check" disabled>Mark Milestone Complete</el-button>
            </span>
          </el-tooltip>
        </div>
      </el-card>

      <!-- ── Mandatory Document Slots ────────────────────────────────────── -->
      <div class="mandatory-label">
        <i class="el-icon-warning-outline" style="color:#E6A817;margin-right:4px"></i>
        Required Documents — both must be AI-verified before completing this milestone
      </div>

      <el-row :gutter="14" style="margin-bottom:14px">
        <el-col :span="12" v-for="slot in mandatorySlots" :key="slot.key">
          <div :class="['doc-slot', `slot-${slot.state}`]">

            <!-- Slot header -->
            <div class="slot-header">
              <div class="slot-title">
                <i class="el-icon-document"></i>
                {{ slot.label }}
                <el-tag size="mini" type="danger" style="margin-left:6px">Required</el-tag>
              </div>
              <div :class="['slot-status-badge', `badge-${slot.state}`]">
                <i :class="slotStateIcon(slot.state)"></i>
                {{ slotStateLabel(slot.state) }}
              </div>
            </div>

            <!-- IDLE: waiting for upload -->
            <div v-if="slot.state === 'idle'" class="slot-body slot-idle">
              <div class="upload-hint">
                <div class="hint-title">AI will verify:</div>
                <div class="hint-item"><i class="el-icon-check"></i> Document is a {{ slot.label }}</div>
                <div class="hint-item"><i class="el-icon-check"></i> PO Number matches <strong>{{ hblInfo.poNumber }}</strong></div>
                <div class="hint-item"><i class="el-icon-check"></i> Supplier matches <strong>{{ hblInfo.supplier }}</strong></div>
              </div>
              <div class="upload-actions">
                <el-upload action="#" :auto-upload="false" :show-file-list="false" :on-change="(f) => startUpload(slot, f, 'pass')">
                  <el-button type="primary" size="small" icon="el-icon-upload2">Upload &amp; AI Verify</el-button>
                </el-upload>
                <div class="demo-btns">
                  <span class="demo-label">Demo:</span>
                  <el-button size="mini" type="text" @click="startUpload(slot, null, 'type_error')">Wrong doc type</el-button>
                  <el-button size="mini" type="text" @click="startUpload(slot, null, 'po_mismatch')">PO mismatch</el-button>
                </div>
              </div>
            </div>

            <!-- UPLOADING / VERIFYING: async progress -->
            <div v-if="slot.state === 'uploading' || slot.state === 'verifying'" class="slot-body slot-verifying">
              <div class="verify-filename">
                <i class="el-icon-document"></i> {{ slot.fileName }}
              </div>
              <div class="verify-steps">
                <div v-for="(step, i) in slot.steps" :key="i" :class="['verify-step', stepClass(step.status)]">
                  <i :class="stepIcon(step.status)"></i>
                  <span>{{ step.label }}</span>
                  <span v-if="step.status === 'running'" class="step-spinner"></span>
                  <span v-if="step.detail" class="step-detail">{{ step.detail }}</span>
                </div>
              </div>
              <el-progress
                :percentage="slot.progress"
                :stroke-width="4"
                :show-text="false"
                :color="'#004F7C'"
                style="margin-top:8px"
              />
            </div>

            <!-- VERIFIED: all checks passed -->
            <div v-if="slot.state === 'verified'" class="slot-body slot-verified">
              <div class="verified-file">
                <i class="el-icon-document" style="color:#004F7C"></i>
                <div class="verified-file-info">
                  <div class="verified-filename">{{ slot.fileName }}</div>
                  <div class="verified-meta">v{{ slot.version }} · Uploaded {{ slot.uploadedAt }}</div>
                </div>
                <el-button type="text" size="mini" icon="el-icon-view">Preview</el-button>
              </div>
              <div class="check-list">
                <div class="check-item pass"><i class="el-icon-circle-check"></i> Document type: {{ slot.label }} ✓</div>
                <div class="check-item pass"><i class="el-icon-circle-check"></i> PO Number: {{ hblInfo.poNumber }} ✓</div>
                <div class="check-item pass"><i class="el-icon-circle-check"></i> Supplier: {{ hblInfo.supplier }} ✓</div>
              </div>
              <el-button type="text" size="mini" icon="el-icon-refresh-left" style="margin-top:6px" @click="resetSlot(slot)">
                Replace with new version
              </el-button>
            </div>

            <!-- TYPE ERROR: wrong document type -->
            <div v-if="slot.state === 'type_error'" class="slot-body slot-error">
              <div class="error-header">
                <i class="el-icon-circle-close"></i>
                <div>
                  <div class="error-title">Wrong document type</div>
                  <div class="error-file">{{ slot.fileName }}</div>
                </div>
              </div>
              <el-alert
                title="Document type mismatch"
                type="error" :closable="false" show-icon
                style="margin-bottom:10px"
              >
                <div style="font-size:12px;margin-top:2px">
                  AI detected this file is a <strong>{{ slot.detectedType }}</strong>, not a <strong>{{ slot.label }}</strong>.
                  Please upload the correct document.
                </div>
              </el-alert>
              <el-upload action="#" :auto-upload="false" :show-file-list="false" :on-change="(f) => startUpload(slot, f, 'pass')">
                <el-button type="danger" size="small" icon="el-icon-refresh" plain>Re-upload Correct File</el-button>
              </el-upload>
            </div>

            <!-- PO MISMATCH: right doc type, wrong PO -->
            <div v-if="slot.state === 'po_mismatch'" class="slot-body slot-warning">
              <div class="error-header warning">
                <i class="el-icon-warning"></i>
                <div>
                  <div class="error-title">PO number mismatch</div>
                  <div class="error-file">{{ slot.fileName }}</div>
                </div>
              </div>
              <div class="check-list">
                <div class="check-item pass"><i class="el-icon-circle-check"></i> Document type: {{ slot.label }} ✓</div>
                <div class="check-item fail">
                  <i class="el-icon-circle-close"></i>
                  PO Number mismatch:
                  <span class="mismatch-detail">
                    Found <strong>{{ slot.foundPO }}</strong> — expected <strong>{{ hblInfo.poNumber }}</strong>
                  </span>
                </div>
              </div>
              <el-divider style="margin:10px 0" />
              <div style="font-size:12px;color:#666;margin-bottom:8px">How would you like to proceed?</div>
              <el-upload action="#" :auto-upload="false" :show-file-list="false" :on-change="(f) => startUpload(slot, f, 'pass')">
                <el-button size="small" type="primary" plain icon="el-icon-refresh" style="width:100%;margin-bottom:6px">
                  Re-upload Correct File
                </el-button>
              </el-upload>
              <el-button size="small" type="warning" plain icon="el-icon-warning-outline" style="width:100%" @click="forceSave(slot)">
                Save Anyway — Flag for OHA Review
              </el-button>
            </div>

            <!-- FORCE SAVED: saved despite mismatch -->
            <div v-if="slot.state === 'force_saved'" class="slot-body slot-force">
              <div class="verified-file">
                <i class="el-icon-document" style="color:#E6A817"></i>
                <div class="verified-file-info">
                  <div class="verified-filename">{{ slot.fileName }}</div>
                  <div class="verified-meta">v{{ slot.version }} · Saved with flag</div>
                </div>
              </div>
              <el-alert title="Saved as Unverified — pending OHA review" type="warning" :closable="false" show-icon style="margin-top:8px" />
              <el-button type="text" size="mini" icon="el-icon-refresh-left" style="margin-top:6px" @click="resetSlot(slot)">
                Replace with correct file
              </el-button>
            </div>

          </div>
        </el-col>
      </el-row>

      <!-- ── Other Documents ─────────────────────────────────────────────── -->
      <el-card>
        <div slot="header" class="card-hdr">
          <span>Other Documents <span style="color:#999;font-weight:400;font-size:12px">(optional)</span></span>
          <el-button size="mini" icon="el-icon-plus" @click="showOtherUpload=!showOtherUpload">Add Document</el-button>
        </div>

        <!-- Other upload form -->
        <el-collapse-transition>
          <div v-if="showOtherUpload" class="other-upload-form">
            <el-row :gutter="12" align="middle" type="flex">
              <el-col :span="7">
                <el-select v-model="otherForm.docType" placeholder="Document type" size="mini" style="width:100%">
                  <el-option label="Bill of Lading (HBL)" value="BILL_OF_LADING" />
                  <el-option label="Certificate of Origin" value="CERTIFICATE_OF_ORIGIN" />
                  <el-option label="Sanitary Certificate" value="SANITARY_CERT" />
                  <el-option label="Other" value="OTHER" />
                </el-select>
              </el-col>
              <el-col :span="10">
                <el-upload action="#" :auto-upload="false" :show-file-list="false" :on-change="onOtherFileChange" style="display:inline-block;width:100%">
                  <el-button size="mini" icon="el-icon-upload2" style="width:100%">
                    {{ otherForm.fileName || 'Choose file...' }}
                  </el-button>
                </el-upload>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" size="mini" style="width:100%" :disabled="!otherForm.docType || !otherForm.fileName" @click="saveOtherDoc">
                  Upload
                </el-button>
              </el-col>
              <el-col :span="3">
                <el-button size="mini" @click="showOtherUpload=false">Cancel</el-button>
              </el-col>
            </el-row>
          </div>
        </el-collapse-transition>

        <!-- Other documents table -->
        <el-table :data="otherDocuments" size="mini" stripe border style="margin-top:4px">
          <el-table-column label="Document Type" min-width="160">
            <template #default="{row}">
              <i class="el-icon-document" style="color:#004F7C;margin-right:4px"></i>{{ row.docTypeLabel }}
            </template>
          </el-table-column>
          <el-table-column label="File Name" min-width="180" prop="fileName" />
          <el-table-column label="Ver" width="50" align="center">
            <template #default="{row}">
              <el-tag size="mini" type="info">v{{ row.version }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Status" width="115">
            <template #default="{row}">
              <span :class="['status-badge', row.status==='VERIFIED'?'verified':'unverified']">
                <i :class="row.status==='VERIFIED'?'el-icon-check':'el-icon-warning-outline'"></i>
                {{ row.status==='VERIFIED'?'Verified':'Unverified' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="Uploaded" width="120" prop="uploadedAt" />
          <el-table-column label="" width="60" align="center">
            <template><el-button type="text" size="mini" icon="el-icon-view" /></template>
          </el-table-column>
        </el-table>

        <div v-if="!otherDocuments.length" style="text-align:center;padding:20px;color:#c0c4cc;font-size:13px">
          No other documents uploaded yet
        </div>
      </el-card>

    </template>

  </div>
</template>

<script>
const VERIFY_STEPS = [
  { label: 'Uploading file to server',       status: 'pending' },
  { label: 'Extracting content via OCR',     status: 'pending' },
  { label: 'Checking document type',         status: 'pending' },
  { label: 'Matching PO reference numbers',  status: 'pending' },
]

export default {
  name: 'DocumentUpload',
  data() {
    return {
      selectedHbl: 'MOOV240001',
      showOtherUpload: false,
      otherForm: { docType: '', fileName: '' },

      hblList: [
        { value:'MOOV240001', label:'MOOV240001 – Shanghai Textile Co.' },
        { value:'MOOV240002', label:'MOOV240002 – Dhaka Garments Ltd.' },
        { value:'MOOV240003', label:'MOOV240003 – Ho Chi Minh Apparel' },
      ],
      hblMap: {
        MOOV240001: { supplier:'Shanghai Textile Co.', poNumber:'PO-2024-001234', pol:'CNSHA', pod:'PLGDN', etd:'2024-11-10', eta:'2024-12-05' },
        MOOV240002: { supplier:'Dhaka Garments Ltd.',  poNumber:'PO-2024-005678', pol:'BGCGP', pod:'DEHAM', etd:'2024-11-12', eta:'2024-12-15' },
        MOOV240003: { supplier:'Ho Chi Minh Apparel',  poNumber:'PO-2024-009012', pol:'VNSGN', pod:'CZPRE', etd:'2024-11-08', eta:'2024-12-02' },
      },

      mandatorySlots: [
        {
          key: 'ci', label: 'Commercial Invoice',
          state: 'idle',   // idle | uploading | verifying | verified | type_error | po_mismatch | force_saved
          fileName: '', version: 1, uploadedAt: '',
          progress: 0, steps: [],
          detectedType: '', foundPO: '',
        },
        {
          key: 'pl', label: 'Packing List',
          state: 'idle',
          fileName: '', version: 1, uploadedAt: '',
          progress: 0, steps: [],
          detectedType: '', foundPO: '',
        },
      ],

      otherDocuments: [
        { id:3, docType:'BILL_OF_LADING',  docTypeLabel:'Bill of Lading',  fileName:'HBL-MOOV240001.pdf', version:2, status:'VERIFIED', uploadedAt:'2024-11-12 14:10' },
      ],
    }
  },

  computed: {
    hblInfo() { return this.hblMap[this.selectedHbl] },

    milestoneComplete() {
      return this.mandatorySlots.every(s => s.state === 'verified')
    },
    milestoneBarClass() {
      const states = this.mandatorySlots.map(s => s.state)
      if (states.every(s => s === 'verified')) return 'bar-complete'
      if (states.some(s => ['type_error','po_mismatch'].includes(s))) return 'bar-error'
      if (states.some(s => ['uploading','verifying'].includes(s))) return 'bar-verifying'
      return 'bar-pending'
    },
    milestoneIcon() {
      if (this.milestoneComplete) return 'el-icon-circle-check'
      const states = this.mandatorySlots.map(s => s.state)
      if (states.some(s => ['type_error','po_mismatch'].includes(s))) return 'el-icon-warning'
      return 'el-icon-document'
    },
    milestoneTitle() {
      if (this.milestoneComplete) return 'All required documents verified — milestone ready to complete'
      const ci = this.mandatorySlots[0], pl = this.mandatorySlots[1]
      const done = [ci,pl].filter(s => s.state === 'verified').length
      if (done === 0) return 'Upload Shipping Documents Milestone'
      return `${done}/2 required documents verified`
    },
    milestoneSub() {
      if (this.milestoneComplete) return 'Commercial Invoice ✓  ·  Packing List ✓'
      const parts = this.mandatorySlots.map(s => {
        if (s.state === 'verified') return `${s.label} ✓`
        if (s.state === 'type_error') return `${s.label} ✗ (wrong type)`
        if (s.state === 'po_mismatch') return `${s.label} ✗ (PO mismatch)`
        if (s.state === 'force_saved') return `${s.label} ⚠ (pending OHA)`
        return `${s.label} — pending`
      })
      return parts.join('  ·  ')
    },
  },

  methods: {
    onHblChange() {
      this.mandatorySlots.forEach(s => this.resetSlot(s))
    },

    resetSlot(slot) {
      slot.state = 'idle'
      slot.fileName = ''; slot.progress = 0; slot.steps = []
      slot.detectedType = ''; slot.foundPO = ''
    },

    slotStateIcon(state) {
      return { idle:'el-icon-upload', uploading:'el-icon-loading', verifying:'el-icon-loading',
               verified:'el-icon-circle-check', type_error:'el-icon-circle-close',
               po_mismatch:'el-icon-warning', force_saved:'el-icon-warning-outline' }[state] || 'el-icon-document'
    },
    slotStateLabel(state) {
      return { idle:'Awaiting upload', uploading:'Uploading...', verifying:'AI verifying...',
               verified:'Verified ✓', type_error:'Wrong document type', po_mismatch:'PO mismatch',
               force_saved:'Saved – OHA review needed' }[state] || state
    },
    stepClass(s) {
      return { pending:'step-pending', running:'step-running', done:'step-done', error:'step-error' }[s] || ''
    },
    stepIcon(s) {
      return { pending:'el-icon-minus', running:'el-icon-loading', done:'el-icon-check', error:'el-icon-close' }[s] || ''
    },

    startUpload(slot, file, scenario) {
      slot.fileName = file ? file.name : `${slot.key === 'ci' ? 'INVOICE' : 'PACKLIST'}-DEMO.pdf`
      slot.state = 'uploading'
      slot.progress = 0
      slot.steps = VERIFY_STEPS.map(s => ({ ...s }))

      // Simulate async verification steps
      const timings = [
        { delay: 600,  step: 0, status: 'done',    progress: 20, nextStep: 1 },
        { delay: 1400, step: 1, status: 'done',    progress: 55, nextStep: 2, stateChange: 'verifying' },
        { delay: 2400, step: 2, status: 'done',    progress: 75, nextStep: 3 },
        { delay: 3400, step: 3, status: 'done',    progress: 100 },
      ]

      // Mark first step as running
      slot.steps[0].status = 'running'
      slot.state = 'uploading'

      timings.forEach(({ delay, step, status, progress, nextStep, stateChange }) => {
        setTimeout(() => {
          slot.steps[step].status = status
          slot.progress = progress
          if (stateChange) slot.state = stateChange
          if (nextStep !== undefined) slot.steps[nextStep].status = 'running'

          // Final result after last step
          if (step === 3) {
            setTimeout(() => {
              this.applyResult(slot, scenario)
            }, 400)
          }
        }, delay)
      })
    },

    applyResult(slot, scenario) {
      if (scenario === 'pass') {
        slot.state = 'verified'
        slot.uploadedAt = new Date().toLocaleTimeString()
        this.$message.success(`${slot.label} verified successfully!`)

      } else if (scenario === 'type_error') {
        slot.steps[2].status = 'error'
        slot.steps[3].status = 'pending'
        slot.state = 'type_error'
        slot.detectedType = slot.key === 'ci' ? 'Bill of Lading' : 'Commercial Invoice'
        this.$message.error(`${slot.label}: wrong document type detected`)

      } else if (scenario === 'po_mismatch') {
        slot.steps[3].status = 'error'
        slot.state = 'po_mismatch'
        slot.foundPO = 'PO-2024-999999'
        this.$message.warning(`${slot.label}: PO number does not match`)
      }
    },

    forceSave(slot) {
      slot.state = 'force_saved'
      slot.uploadedAt = new Date().toLocaleTimeString()
      this.$message.warning('Saved as Unverified. OHA will review this document.')
    },

    onOtherFileChange(file) {
      this.otherForm.fileName = file.name
    },
    saveOtherDoc() {
      const labelMap = { BILL_OF_LADING:'Bill of Lading', CERTIFICATE_OF_ORIGIN:'Certificate of Origin', SANITARY_CERT:'Sanitary Certificate', OTHER:'Other' }
      this.otherDocuments.push({
        id: Date.now(), docType: this.otherForm.docType,
        docTypeLabel: labelMap[this.otherForm.docType] || 'Other',
        fileName: this.otherForm.fileName || `DOC-${Date.now()}.pdf`,
        version: 1, status: 'VERIFIED',
        uploadedAt: new Date().toLocaleTimeString()
      })
      this.otherForm = { docType: '', fileName: '' }
      this.showOtherUpload = false
      this.$message.success('Document uploaded successfully')
    },
  },
}
</script>

<style lang="scss" scoped>
.card-hdr { display:flex; justify-content:space-between; align-items:center; font-weight:600; }

// PO selector
.po-selector-card { margin-bottom:12px; }
.selector-label { font-size:11px; color:$text-secondary; margin-bottom:4px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; }

// Milestone bar
.milestone-bar {
  margin-bottom:12px;
  ::v-deep .el-card__body { padding:12px 16px; }
  &.bar-complete  { border-left:4px solid $status-verified; }
  &.bar-error     { border-left:4px solid $status-rejected; }
  &.bar-verifying { border-left:4px solid $primary; }
  &.bar-pending   { border-left:4px solid #ddd; }
}
.milestone-bar-inner { display:flex; align-items:center; justify-content:space-between; }
.milestone-bar-left { display:flex; align-items:center; gap:10px;
  i { font-size:20px; }
  .bar-complete & i  { color:$status-verified; }
  .bar-error & i     { color:$status-rejected; }
  .bar-verifying & i { color:$primary; }
  .bar-pending & i   { color:#999; }
}
.milestone-bar-title { font-weight:600; font-size:13px; }
.milestone-bar-sub   { font-size:11px; color:$text-secondary; margin-top:2px; }

// Mandatory label
.mandatory-label { font-size:12px; color:#666; margin-bottom:8px; display:flex; align-items:center; }

// Document slot
.doc-slot {
  border-radius:8px; border:2px solid $border;
  overflow:hidden; background:#fff; transition:border-color 0.25s;
  &.slot-verified    { border-color:$status-verified; }
  &.slot-type_error  { border-color:$status-rejected; }
  &.slot-po_mismatch { border-color:$status-unverified; }
  &.slot-force_saved { border-color:$status-unverified; }
  &.slot-uploading,
  &.slot-verifying   { border-color:$primary; }
}

.slot-header {
  display:flex; justify-content:space-between; align-items:center;
  padding:10px 14px; background:#fafafa; border-bottom:1px solid $border;
}
.slot-title { font-weight:600; font-size:13px; display:flex; align-items:center; gap:4px;
  i { color:$primary; font-size:15px; }
}
.slot-status-badge {
  font-size:11px; font-weight:600; padding:2px 8px; border-radius:10px; display:flex; align-items:center; gap:4px;
  &.badge-idle        { background:#f4f4f5; color:#909399; }
  &.badge-uploading,
  &.badge-verifying   { background:#ecf5ff; color:$primary; }
  &.badge-verified    { background:#e6f9ef; color:darken($status-verified,10%); }
  &.badge-type_error  { background:#fff0f0; color:$status-rejected; }
  &.badge-po_mismatch { background:#fff8e0; color:#e6a817; }
  &.badge-force_saved { background:#fff8e0; color:#e6a817; }
}

.slot-body { padding:14px; }

// Idle state
.slot-idle {}
.upload-hint { background:#f8fafc; border-radius:6px; padding:10px 12px; margin-bottom:12px; }
.hint-title { font-size:11px; font-weight:600; color:$text-secondary; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.4px; }
.hint-item { font-size:12px; color:$text-secondary; padding:2px 0;
  i { color:$primary; margin-right:4px; }
  strong { color:$primary; }
}
.upload-actions { display:flex; flex-direction:column; gap:8px; }
.demo-btns { display:flex; align-items:center; gap:0; }
.demo-label { font-size:11px; color:#999; margin-right:4px; }

// Verifying state
.slot-verifying {}
.verify-filename { font-size:12px; color:$text-secondary; margin-bottom:10px; display:flex; align-items:center; gap:4px; }
.verify-steps { display:flex; flex-direction:column; gap:4px; }
.verify-step {
  display:flex; align-items:center; gap:6px; font-size:12px; padding:3px 0;
  &.step-pending { color:#c0c4cc; }
  &.step-running { color:$primary; font-weight:600; }
  &.step-done    { color:darken($status-verified,8%); }
  &.step-error   { color:$status-rejected; }
  i { font-size:13px; flex-shrink:0; }
}
.step-spinner { display:inline-block; width:10px; height:10px; border:2px solid $primary; border-top-color:transparent; border-radius:50%; animation:spin 0.7s linear infinite; margin-left:4px; }
.step-detail { font-size:11px; color:#999; margin-left:auto; }
@keyframes spin { to { transform:rotate(360deg); } }

// Verified state
.slot-verified {}
.verified-file { display:flex; align-items:center; gap:8px; background:#f0fdf4; border-radius:6px; padding:8px 10px; margin-bottom:10px;
  i { font-size:20px; }
}
.verified-file-info { flex:1; }
.verified-filename { font-size:12px; font-weight:600; color:$text-primary; }
.verified-meta { font-size:11px; color:$text-secondary; }

// Error / warning states
.error-header { display:flex; align-items:flex-start; gap:8px; margin-bottom:10px;
  i { font-size:24px; flex-shrink:0; }
  .error-title { font-weight:700; font-size:13px; }
  .error-file  { font-size:11px; color:$text-secondary; }
  &:not(.warning) i { color:$status-rejected; }
  &.warning i { color:$status-unverified; }
}

// Check list
.check-list { display:flex; flex-direction:column; gap:4px; margin-bottom:10px; }
.check-item { display:flex; align-items:flex-start; gap:6px; font-size:12px; flex-wrap:wrap;
  i { font-size:13px; flex-shrink:0; margin-top:1px; }
  &.pass { color:darken($status-verified,10%); }
  &.fail { color:$status-rejected; }
}
.mismatch-detail { color:$text-secondary; margin-left:2px; strong { color:$status-rejected; } }

// Other upload form
.other-upload-form { background:#f8fafc; border-radius:6px; padding:10px 12px; margin-bottom:10px; border:1px dashed $border; }
</style>
