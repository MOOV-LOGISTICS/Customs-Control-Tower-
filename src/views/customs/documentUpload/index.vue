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

      <!-- Milestone Status Bar -->
      <el-card class="milestone-bar" :class="milestoneBarClass">
        <div class="milestone-bar-inner">
          <div class="milestone-bar-left">
            <i :class="milestoneIcon"></i>
            <div>
              <div class="milestone-bar-title">{{ milestoneTitle }}</div>
              <div class="milestone-bar-sub">{{ milestoneSub }}</div>
            </div>
          </div>
          <el-button v-if="milestoneComplete" type="success" size="small" icon="el-icon-check"
            @click="$message.success('Milestone marked complete! Pepco has been notified.')">
            Mark Milestone Complete
          </el-button>
          <el-tooltip v-else content="Both Commercial Invoice and Packing List must be verified" placement="left">
            <span><el-button type="success" size="small" icon="el-icon-check" disabled>Mark Milestone Complete</el-button></span>
          </el-tooltip>
        </div>
      </el-card>

      <!-- Mandatory label -->
      <div class="mandatory-label">
        <i class="el-icon-warning-outline" style="color:#E6A817;margin-right:4px"></i>
        Required Documents — both must be AI-verified before completing this milestone
      </div>

      <!-- Mandatory Slots -->
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

            <!-- IDLE -->
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

            <!-- UPLOADING / VERIFYING -->
            <div v-if="slot.state === 'uploading' || slot.state === 'verifying'" class="slot-body slot-verifying">
              <div class="verify-filename"><i class="el-icon-document"></i> {{ slot.fileName }}</div>
              <div class="verify-steps">
                <div v-for="(step, i) in slot.steps" :key="i" :class="['verify-step', stepClass(step.status)]">
                  <i :class="stepIcon(step.status)"></i>
                  <span>{{ step.label }}</span>
                  <span v-if="step.status === 'running'" class="step-spinner"></span>
                </div>
              </div>
              <el-progress :percentage="slot.progress" :stroke-width="4" :show-text="false" color="#004F7C" style="margin-top:8px" />
            </div>

            <!-- VERIFIED -->
            <div v-if="slot.state === 'verified'" class="slot-body">
              <!-- Current version -->
              <div class="current-version-block">
                <div class="cv-file">
                  <i class="el-icon-document" style="color:#004F7C;font-size:18px"></i>
                  <div class="cv-info">
                    <div class="cv-name">{{ slot.fileName }}</div>
                    <div class="cv-meta">
                      <el-tag size="mini" type="success">v{{ slot.version }} Current</el-tag>
                      <span style="margin-left:6px;color:#999;font-size:11px">Uploaded {{ slot.uploadedAt }}</span>
                    </div>
                  </div>
                  <div class="cv-actions">
                    <el-button type="text" size="mini" icon="el-icon-view" @click="openPreview(slot, slot.version)">Preview</el-button>
                    <el-button type="text" size="mini" icon="el-icon-download" @click="downloadFile(slot.fileName)">Download</el-button>
                  </div>
                </div>
                <div class="check-list">
                  <div class="check-item pass"><i class="el-icon-circle-check"></i> Document type: {{ slot.label }} ✓</div>
                  <div class="check-item pass"><i class="el-icon-circle-check"></i> PO Number: {{ hblInfo.poNumber }} ✓</div>
                  <div class="check-item pass"><i class="el-icon-circle-check"></i> Supplier: {{ hblInfo.supplier }} ✓</div>
                </div>
              </div>

              <!-- Upload new version -->
              <div class="new-version-row">
                <el-upload action="#" :auto-upload="false" :show-file-list="false" :on-change="(f) => startUpload(slot, f, 'pass')">
                  <el-button type="text" size="mini" icon="el-icon-refresh-left">Upload new version</el-button>
                </el-upload>
              </div>

              <!-- Version History -->
              <div v-if="slot.versionHistory && slot.versionHistory.length" class="version-history">
                <div class="vh-toggle" @click="slot.showHistory = !slot.showHistory">
                  <i :class="slot.showHistory ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"></i>
                  Version History ({{ slot.versionHistory.length }} previous {{ slot.versionHistory.length === 1 ? 'version' : 'versions' }})
                </div>
                <el-collapse-transition>
                  <div v-if="slot.showHistory" class="vh-list">
                    <div v-for="v in slot.versionHistory" :key="v.version" class="vh-row">
                      <div class="vh-row-left">
                        <i class="el-icon-document" style="color:#909399"></i>
                        <div class="vh-info">
                          <div class="vh-name">{{ v.fileName }}</div>
                          <div class="vh-meta">
                            <el-tag size="mini" :type="v.status === 'VERIFIED' ? 'success' : 'warning'">
                              v{{ v.version }} · {{ v.status === 'VERIFIED' ? 'Verified' : 'Unverified' }}
                            </el-tag>
                            <span style="margin-left:6px;color:#bbb;font-size:11px">{{ v.uploadedAt }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="vh-row-actions">
                        <el-button type="text" size="mini" icon="el-icon-view" @click="openPreview(slot, v.version, v)">Preview</el-button>
                        <el-button type="text" size="mini" icon="el-icon-download" @click="downloadFile(v.fileName)">Download</el-button>
                        <el-button type="text" size="mini" icon="el-icon-delete" style="color:#ff4949"
                          @click="deleteVersion(slot, v)">Delete</el-button>
                      </div>
                    </div>
                  </div>
                </el-collapse-transition>
              </div>
            </div>

            <!-- TYPE ERROR -->
            <div v-if="slot.state === 'type_error'" class="slot-body slot-error">
              <div class="error-header">
                <i class="el-icon-circle-close"></i>
                <div>
                  <div class="error-title">Wrong document type</div>
                  <div class="error-file">{{ slot.fileName }}</div>
                </div>
              </div>
              <el-alert title="Document type mismatch" type="error" :closable="false" show-icon style="margin-bottom:10px">
                <div style="font-size:12px;margin-top:2px">
                  AI detected this file is a <strong>{{ slot.detectedType }}</strong>, not a <strong>{{ slot.label }}</strong>.
                </div>
              </el-alert>
              <el-upload action="#" :auto-upload="false" :show-file-list="false" :on-change="(f) => startUpload(slot, f, 'pass')">
                <el-button type="danger" size="small" icon="el-icon-refresh" plain>Re-upload Correct File</el-button>
              </el-upload>
            </div>

            <!-- PO MISMATCH -->
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
                  <span class="mismatch-detail">Found <strong>{{ slot.foundPO }}</strong> — expected <strong>{{ hblInfo.poNumber }}</strong></span>
                </div>
              </div>
              <el-divider style="margin:10px 0" />
              <div style="font-size:12px;color:#666;margin-bottom:8px">How would you like to proceed?</div>
              <el-upload action="#" :auto-upload="false" :show-file-list="false" :on-change="(f) => startUpload(slot, f, 'pass')">
                <el-button size="small" type="primary" plain icon="el-icon-refresh" style="width:100%;margin-bottom:6px">Re-upload Correct File</el-button>
              </el-upload>
              <el-button size="small" type="warning" plain icon="el-icon-warning-outline" style="width:100%" @click="forceSave(slot)">
                Save Anyway — Flag for OHA Review
              </el-button>
            </div>

            <!-- FORCE SAVED -->
            <div v-if="slot.state === 'force_saved'" class="slot-body slot-force">
              <div class="current-version-block">
                <div class="cv-file">
                  <i class="el-icon-document" style="color:#E6A817;font-size:18px"></i>
                  <div class="cv-info">
                    <div class="cv-name">{{ slot.fileName }}</div>
                    <div class="cv-meta">
                      <el-tag size="mini" type="warning">v{{ slot.version }} · Unverified</el-tag>
                      <span style="margin-left:6px;color:#999;font-size:11px">{{ slot.uploadedAt }}</span>
                    </div>
                  </div>
                  <div class="cv-actions">
                    <el-button type="text" size="mini" icon="el-icon-view" @click="openPreview(slot, slot.version)">Preview</el-button>
                    <el-button type="text" size="mini" icon="el-icon-download" @click="downloadFile(slot.fileName)">Download</el-button>
                  </div>
                </div>
              </div>
              <el-alert title="Saved as Unverified — pending OHA review" type="warning" :closable="false" show-icon style="margin-top:8px" />
              <el-upload action="#" :auto-upload="false" :show-file-list="false" :on-change="(f) => startUpload(slot, f, 'pass')" style="margin-top:8px">
                <el-button type="text" size="mini" icon="el-icon-refresh-left">Replace with correct file</el-button>
              </el-upload>
            </div>

          </div>
        </el-col>
      </el-row>

      <!-- Other Documents -->
      <el-card>
        <div slot="header" class="card-hdr">
          <span>Other Documents <span style="color:#999;font-weight:400;font-size:12px">(optional)</span></span>
          <el-button size="mini" icon="el-icon-plus" @click="showOtherUpload=!showOtherUpload">Add Document</el-button>
        </div>
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
                <el-upload action="#" :auto-upload="false" :show-file-list="false" :on-change="onOtherFileChange" style="width:100%">
                  <el-button size="mini" icon="el-icon-upload2" style="width:100%">{{ otherForm.fileName || 'Choose file...' }}</el-button>
                </el-upload>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" size="mini" style="width:100%" :disabled="!otherForm.docType || !otherForm.fileName" @click="saveOtherDoc">Upload</el-button>
              </el-col>
              <el-col :span="3">
                <el-button size="mini" @click="showOtherUpload=false">Cancel</el-button>
              </el-col>
            </el-row>
          </div>
        </el-collapse-transition>
        <el-table :data="otherDocuments" size="mini" stripe border style="margin-top:4px">
          <el-table-column label="Document Type" min-width="160">
            <template #default="{row}">
              <i class="el-icon-document" style="color:#004F7C;margin-right:4px"></i>{{ row.docTypeLabel }}
            </template>
          </el-table-column>
          <el-table-column label="File Name" min-width="180" prop="fileName" />
          <el-table-column label="Ver" width="50" align="center">
            <template #default="{row}"><el-tag size="mini" type="info">v{{ row.version }}</el-tag></template>
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
          <el-table-column label="" width="120" align="center">
            <template #default="{row}">
              <el-button type="text" size="mini" icon="el-icon-view" @click="openPreview(null, 1, row)">Preview</el-button>
              <el-button type="text" size="mini" icon="el-icon-download" @click="downloadFile(row.fileName)">Download</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="!otherDocuments.length" style="text-align:center;padding:20px;color:#c0c4cc;font-size:13px">No other documents uploaded yet</div>
      </el-card>

    </template>

    <!-- ── Preview Dialog ──────────────────────────────────────────────── -->
    <el-dialog :visible.sync="preview.visible" :title="preview.title" width="760px" top="5vh">
      <div class="preview-dialog">
        <!-- Meta bar -->
        <div class="preview-meta">
          <el-descriptions :column="3" size="mini" border>
            <el-descriptions-item label="Document Type">{{ preview.docType }}</el-descriptions-item>
            <el-descriptions-item label="Version">
              <el-tag size="mini" :type="preview.status === 'VERIFIED' ? 'success' : 'warning'">
                v{{ preview.version }} · {{ preview.status === 'VERIFIED' ? 'Verified' : 'Unverified' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="Uploaded">{{ preview.uploadedAt }}</el-descriptions-item>
            <el-descriptions-item label="File Name" :span="2">{{ preview.fileName }}</el-descriptions-item>
            <el-descriptions-item label="PO Number">
              <span style="color:#004F7C;font-weight:600">{{ preview.poNumber }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- AI verification summary (for verified docs) -->
        <div v-if="preview.status === 'VERIFIED'" class="preview-verify-bar">
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
              <div class="pdf-company">{{ hblInfo ? hblInfo.supplier : 'Supplier Co.' }}</div>
              <div class="pdf-doc-title">{{ preview.docType }}</div>
            </div>
            <div class="pdf-divider"></div>
            <div class="pdf-fields">
              <div class="pdf-field"><span class="pdf-label">PO Number</span><span class="pdf-value highlight">{{ preview.poNumber }}</span></div>
              <div class="pdf-field"><span class="pdf-label">Document No.</span><span class="pdf-value">{{ preview.fileName.replace('.pdf','') }}</span></div>
              <div class="pdf-field"><span class="pdf-label">Date</span><span class="pdf-value">{{ preview.uploadedAt }}</span></div>
              <div class="pdf-field"><span class="pdf-label">Supplier</span><span class="pdf-value">{{ hblInfo ? hblInfo.supplier : '—' }}</span></div>
            </div>
            <div class="pdf-table-mock">
              <div class="pdf-table-hdr">
                <span>Item Description</span><span>Qty</span><span>Unit Price</span><span>Amount</span>
              </div>
              <div class="pdf-table-row" v-for="i in 4" :key="i">
                <span>Product Item {{ String.fromCharCode(64+i) }}</span>
                <span>{{ i * 120 }}</span>
                <span>USD {{ (i * 3.5).toFixed(2) }}</span>
                <span>USD {{ (i * 120 * 3.5).toFixed(2) }}</span>
              </div>
              <div class="pdf-table-total">
                <span>Total</span><span></span><span></span>
                <span>USD {{ (1*120*3.5 + 2*120*3.5 + 3*120*3.5 + 4*120*3.5).toFixed(2) }}</span>
              </div>
            </div>
            <div class="pdf-footer">[ Simulated document preview — for demo purposes ]</div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button size="small" icon="el-icon-download" type="primary" @click="downloadFile(preview.fileName)">Download</el-button>
        <el-button size="small" @click="preview.visible=false">Close</el-button>
      </div>
    </el-dialog>

    <!-- Delete confirm dialog -->
    <el-dialog :visible.sync="deleteConfirm.visible" title="Delete Version" width="400px">
      <div style="font-size:13px;line-height:1.8">
        <p>Are you sure you want to delete this version?</p>
        <p><strong>{{ deleteConfirm.fileName }}</strong></p>
        <p style="color:#999;font-size:12px">This action cannot be undone.</p>
      </div>
      <div slot="footer">
        <el-button size="small" @click="deleteConfirm.visible=false">Cancel</el-button>
        <el-button size="small" type="danger" @click="confirmDelete">Delete</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
const VERIFY_STEPS = [
  { label: 'Uploading file to server',      status: 'pending' },
  { label: 'Extracting content via OCR',    status: 'pending' },
  { label: 'Checking document type',        status: 'pending' },
  { label: 'Matching PO reference numbers', status: 'pending' },
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
          state: 'verified',
          fileName: 'INV-2024-001234-v2.pdf', version: 2,
          uploadedAt: '2024-11-13 10:15',
          progress: 0, steps: [],
          detectedType: '', foundPO: '',
          showHistory: false,
          versionHistory: [
            { version: 1, fileName: 'INV-2024-001234.pdf', status: 'VERIFIED',   uploadedAt: '2024-11-11 09:23' },
          ],
        },
        {
          key: 'pl', label: 'Packing List',
          state: 'verified',
          fileName: 'PL-2024-001234.pdf', version: 1,
          uploadedAt: '2024-11-11 09:25',
          progress: 0, steps: [],
          detectedType: '', foundPO: '',
          showHistory: false,
          versionHistory: [],
        },
      ],

      otherDocuments: [
        { id:3, docType:'BILL_OF_LADING', docTypeLabel:'Bill of Lading', fileName:'HBL-MOOV240001.pdf', version:2, status:'VERIFIED', uploadedAt:'2024-11-12 14:10' },
      ],

      // Preview dialog
      preview: {
        visible: false,
        title: '',
        docType: '', fileName: '', version: 1,
        status: 'VERIFIED', uploadedAt: '', poNumber: '',
      },

      // Delete confirm
      deleteConfirm: {
        visible: false,
        slot: null,
        versionObj: null,
        fileName: '',
      },
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
      if (this.mandatorySlots.some(s => ['type_error','po_mismatch'].includes(s.state))) return 'el-icon-warning'
      return 'el-icon-document'
    },
    milestoneTitle() {
      if (this.milestoneComplete) return 'All required documents verified — milestone ready to complete'
      const done = this.mandatorySlots.filter(s => s.state === 'verified').length
      return done === 0 ? 'Upload Shipping Documents Milestone' : `${done}/2 required documents verified`
    },
    milestoneSub() {
      if (this.milestoneComplete) return 'Commercial Invoice ✓  ·  Packing List ✓'
      return this.mandatorySlots.map(s => {
        if (s.state === 'verified')    return `${s.label} ✓`
        if (s.state === 'type_error')  return `${s.label} ✗ (wrong type)`
        if (s.state === 'po_mismatch') return `${s.label} ✗ (PO mismatch)`
        if (s.state === 'force_saved') return `${s.label} ⚠ (pending OHA)`
        return `${s.label} — pending`
      }).join('  ·  ')
    },
  },

  methods: {
    onHblChange() { this.mandatorySlots.forEach(s => this.resetSlot(s)) },

    resetSlot(slot) {
      slot.state = 'idle'; slot.fileName = ''; slot.progress = 0
      slot.steps = []; slot.detectedType = ''; slot.foundPO = ''
      slot.versionHistory = []; slot.showHistory = false
    },

    slotStateIcon(state) {
      return { idle:'el-icon-upload', uploading:'el-icon-loading', verifying:'el-icon-loading',
        verified:'el-icon-circle-check', type_error:'el-icon-circle-close',
        po_mismatch:'el-icon-warning', force_saved:'el-icon-warning-outline' }[state] || 'el-icon-document'
    },
    slotStateLabel(state) {
      return { idle:'Awaiting upload', uploading:'Uploading...', verifying:'AI verifying...',
        verified:'Verified ✓', type_error:'Wrong document type',
        po_mismatch:'PO mismatch', force_saved:'Saved – OHA review needed' }[state] || state
    },
    stepClass(s) {
      return { pending:'step-pending', running:'step-running', done:'step-done', error:'step-error' }[s] || ''
    },
    stepIcon(s) {
      return { pending:'el-icon-minus', running:'el-icon-loading', done:'el-icon-check', error:'el-icon-close' }[s] || ''
    },

    startUpload(slot, file, scenario) {
      // Push current verified file to history before replacing
      if (slot.state === 'verified' || slot.state === 'force_saved') {
        slot.versionHistory.unshift({
          version: slot.version,
          fileName: slot.fileName,
          status: slot.state === 'verified' ? 'VERIFIED' : 'UNVERIFIED',
          uploadedAt: slot.uploadedAt,
        })
        slot.version = (slot.version || 1) + 1
      }

      slot.fileName = file ? file.name : `${slot.key === 'ci' ? 'INVOICE' : 'PACKLIST'}-DEMO.pdf`
      slot.state = 'uploading'; slot.progress = 0
      slot.steps = VERIFY_STEPS.map(s => ({ ...s }))
      slot.steps[0].status = 'running'

      const timings = [
        { delay: 600,  step: 0, status: 'done', progress: 20, nextStep: 1 },
        { delay: 1400, step: 1, status: 'done', progress: 55, nextStep: 2, stateChange: 'verifying' },
        { delay: 2400, step: 2, status: 'done', progress: 75, nextStep: 3 },
        { delay: 3400, step: 3, status: 'done', progress: 100 },
      ]
      timings.forEach(({ delay, step, status, progress, nextStep, stateChange }) => {
        setTimeout(() => {
          slot.steps[step].status = status
          slot.progress = progress
          if (stateChange) slot.state = stateChange
          if (nextStep !== undefined) slot.steps[nextStep].status = 'running'
          if (step === 3) setTimeout(() => this.applyResult(slot, scenario), 400)
        }, delay)
      })
    },

    applyResult(slot, scenario) {
      if (scenario === 'pass') {
        slot.state = 'verified'; slot.uploadedAt = new Date().toLocaleTimeString()
        this.$message.success(`${slot.label} verified successfully!`)
      } else if (scenario === 'type_error') {
        slot.steps[2].status = 'error'; slot.steps[3].status = 'pending'
        slot.state = 'type_error'
        slot.detectedType = slot.key === 'ci' ? 'Bill of Lading' : 'Commercial Invoice'
        // Undo the version bump we did in startUpload since it failed
        if (slot.versionHistory.length) { slot.versionHistory.shift(); slot.version-- }
        this.$message.error(`${slot.label}: wrong document type detected`)
      } else if (scenario === 'po_mismatch') {
        slot.steps[3].status = 'error'; slot.state = 'po_mismatch'
        slot.foundPO = 'PO-2024-999999'
        if (slot.versionHistory.length) { slot.versionHistory.shift(); slot.version-- }
        this.$message.warning(`${slot.label}: PO number does not match`)
      }
    },

    forceSave(slot) {
      slot.state = 'force_saved'; slot.uploadedAt = new Date().toLocaleTimeString()
      this.$message.warning('Saved as Unverified. OHA will review this document.')
    },

    // ── Preview ──────────────────────────────────────────────────────────
    openPreview(slot, version, versionObj) {
      const file = versionObj || slot
      const isVerified = versionObj
        ? versionObj.status === 'VERIFIED'
        : slot.state === 'verified'

      this.preview = {
        visible: true,
        title: `Preview — ${slot ? slot.label : file.docTypeLabel} (v${version})`,
        docType: slot ? slot.label : file.docTypeLabel,
        fileName: file.fileName,
        version,
        status: isVerified ? 'VERIFIED' : 'UNVERIFIED',
        uploadedAt: file.uploadedAt,
        poNumber: this.hblInfo ? this.hblInfo.poNumber : '—',
      }
    },

    downloadFile(fileName) {
      this.$message.success(`Downloading ${fileName}…`)
      setTimeout(() => this.$message.info('In a real system, the file would download here.'), 800)
    },

    // ── Delete version ───────────────────────────────────────────────────
    deleteVersion(slot, versionObj) {
      this.deleteConfirm = { visible: true, slot, versionObj, fileName: versionObj.fileName }
    },
    confirmDelete() {
      const { slot, versionObj } = this.deleteConfirm
      const idx = slot.versionHistory.indexOf(versionObj)
      if (idx > -1) slot.versionHistory.splice(idx, 1)
      this.$message.success(`Version deleted: ${versionObj.fileName}`)
      this.deleteConfirm.visible = false
    },

    // ── Other docs ───────────────────────────────────────────────────────
    onOtherFileChange(file) { this.otherForm.fileName = file.name },
    saveOtherDoc() {
      const labelMap = { BILL_OF_LADING:'Bill of Lading', CERTIFICATE_OF_ORIGIN:'Certificate of Origin', SANITARY_CERT:'Sanitary Certificate', OTHER:'Other' }
      this.otherDocuments.push({
        id: Date.now(), docType: this.otherForm.docType,
        docTypeLabel: labelMap[this.otherForm.docType] || 'Other',
        fileName: this.otherForm.fileName || `DOC-${Date.now()}.pdf`,
        version: 1, status: 'VERIFIED', uploadedAt: new Date().toLocaleTimeString()
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
.milestone-bar-left  { display:flex; align-items:center; gap:10px;
  i { font-size:20px; }
  .bar-complete & i  { color:$status-verified; }
  .bar-error & i     { color:$status-rejected; }
  .bar-verifying & i { color:$primary; }
  .bar-pending & i   { color:#999; }
}
.milestone-bar-title { font-weight:600; font-size:13px; }
.milestone-bar-sub   { font-size:11px; color:$text-secondary; margin-top:2px; }

.mandatory-label { font-size:12px; color:#666; margin-bottom:8px; display:flex; align-items:center; }

// Doc slot
.doc-slot {
  border-radius:8px; border:2px solid $border;
  overflow:hidden; background:#fff; transition:border-color 0.25s;
  &.slot-verified    { border-color:$status-verified; }
  &.slot-type_error  { border-color:$status-rejected; }
  &.slot-po_mismatch { border-color:$status-unverified; }
  &.slot-force_saved { border-color:$status-unverified; }
  &.slot-uploading, &.slot-verifying { border-color:$primary; }
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
  &.badge-uploading, &.badge-verifying { background:#ecf5ff; color:$primary; }
  &.badge-verified    { background:#e6f9ef; color:darken($status-verified,10%); }
  &.badge-type_error  { background:#fff0f0; color:$status-rejected; }
  &.badge-po_mismatch { background:#fff8e0; color:#e6a817; }
  &.badge-force_saved { background:#fff8e0; color:#e6a817; }
}
.slot-body { padding:14px; }

// Idle
.upload-hint { background:#f8fafc; border-radius:6px; padding:10px 12px; margin-bottom:12px; }
.hint-title  { font-size:11px; font-weight:600; color:$text-secondary; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.4px; }
.hint-item   { font-size:12px; color:$text-secondary; padding:2px 0; i { color:$primary; margin-right:4px; } strong { color:$primary; } }
.upload-actions { display:flex; flex-direction:column; gap:8px; }
.demo-btns  { display:flex; align-items:center; }
.demo-label { font-size:11px; color:#999; margin-right:4px; }

// Verifying
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
@keyframes spin { to { transform:rotate(360deg); } }

// Verified — current version block
.current-version-block { background:#f0fdf4; border-radius:6px; padding:10px 12px; margin-bottom:8px; }
.cv-file { display:flex; align-items:center; gap:8px; }
.cv-info { flex:1; }
.cv-name { font-size:12px; font-weight:600; color:$text-primary; }
.cv-meta { margin-top:3px; display:flex; align-items:center; }
.cv-actions { display:flex; gap:0; flex-shrink:0; }
.new-version-row { margin-bottom:6px; }

// Version history
.version-history { border-top:1px dashed $border; padding-top:8px; margin-top:4px; }
.vh-toggle {
  font-size:12px; color:$primary; cursor:pointer; display:flex; align-items:center; gap:4px;
  user-select:none; padding:2px 0;
  &:hover { color:$primary-light; }
  i { font-size:12px; }
}
.vh-list { margin-top:8px; display:flex; flex-direction:column; gap:4px; }
.vh-row {
  display:flex; align-items:center; justify-content:space-between;
  background:#fafafa; border-radius:6px; padding:6px 10px; border:1px solid $border;
}
.vh-row-left { display:flex; align-items:center; gap:8px; }
.vh-info {}
.vh-name { font-size:11px; color:$text-primary; font-weight:500; }
.vh-meta { margin-top:2px; display:flex; align-items:center; }
.vh-row-actions { display:flex; gap:0; flex-shrink:0; }

// Check lists
.check-list { display:flex; flex-direction:column; gap:3px; margin-bottom:8px; }
.check-item { display:flex; align-items:flex-start; gap:6px; font-size:12px;
  i { font-size:13px; flex-shrink:0; margin-top:1px; }
  &.pass { color:darken($status-verified,10%); }
  &.fail { color:$status-rejected; }
}
.mismatch-detail { color:$text-secondary; margin-left:2px; strong { color:$status-rejected; } }

// Error states
.error-header { display:flex; align-items:flex-start; gap:8px; margin-bottom:10px;
  i { font-size:24px; flex-shrink:0; }
  .error-title { font-weight:700; font-size:13px; }
  .error-file  { font-size:11px; color:$text-secondary; }
  &:not(.warning) i { color:$status-rejected; }
  &.warning i { color:$status-unverified; }
}

// Other upload form
.other-upload-form { background:#f8fafc; border-radius:6px; padding:10px 12px; margin-bottom:10px; border:1px dashed $border; }

// ── Preview Dialog ────────────────────────────────────────────────────────
.preview-dialog { display:flex; flex-direction:column; gap:12px; }
.preview-meta {}
.preview-verify-bar {
  display:flex; align-items:center; gap:8px; padding:8px 12px;
  border-radius:6px; font-size:12px; font-weight:500;
  background:#e6f9ef; color:darken($status-verified,10%);
  &.unverified { background:#fff8e0; color:#e6a817; }
  i { font-size:16px; }
}

// Simulated PDF
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
