<template>
  <div class="app-container">

    <!-- ── Origin Task Board (Supplier landing view) ─────────────────────── -->
    <el-card>
      <div slot="header" class="card-hdr">
        <span>Origin</span>
        <span style="font-size:11px;color:#999;font-weight:400">Click any status number on "Upload Shipping Documents" to see the PO list</span>
      </div>
      <el-table :data="allTaskRows" size="mini" border :header-cell-style="{background:'#fafafa'}" :row-class-name="taskRowClass">
        <el-table-column label="Task Name" min-width="220">
          <template #default="{row}">
            <div style="display:flex;align-items:center;gap:6px">
              <span style="font-weight:600">{{ row.taskName }}</span>
              <el-tooltip :content="row.hint" placement="top">
                <i class="el-icon-question" style="color:#3A71A8;font-size:13px;cursor:help"></i>
              </el-tooltip>
              <el-tag v-if="row.key==='UPLOAD_DOCS'" size="mini" type="success" style="font-size:10px">New flow</el-tag>
              <el-tag v-if="row.key==='DOC_CORRECTION'" size="mini" type="warning" style="font-size:10px">New flow</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Party Role" width="120" prop="partyRole" />
        <el-table-column label="Possible" width="110" align="center">
          <template #default="{row}">
            <span class="ms-num possible" @click="openPoList(row, 'possible')">{{ row.possible }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Urgent" width="110" align="center">
          <template #default="{row}">
            <span class="ms-num urgent" @click="openPoList(row, 'urgent')">{{ row.urgent }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Overdue" width="110" align="center">
          <template #default="{row}">
            <span class="ms-num overdue" @click="openPoList(row, 'overdue')">{{ row.overdue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Finished" width="110" align="center">
          <template #default="{row}">
            <span class="ms-num finished" @click="openPoList(row, 'finished')">{{ row.finished }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- ── Dialog 1: PO list for selected status ─────────────────────────── -->
    <el-dialog
      :visible.sync="poListDialog.visible"
      :title="`Upload Shipping Documents ${poListDialog.statusLabel}`"
      width="1000px" top="6vh" custom-class="brand-dialog"
    >
      <div style="margin-bottom:10px">
        <el-button type="primary" size="mini" icon="el-icon-download" @click="$message.success('Exporting PO list as Excel…')">Download</el-button>
      </div>
      <el-table :data="poListFiltered" size="mini" stripe border :header-cell-style="{background:'#fafafa'}">
        <el-table-column label="Task Name" min-width="170">
          <template>Upload Shipping Documents</template>
        </el-table-column>
        <el-table-column label="Order Number" width="150">
          <template #default="{row}">
            <span class="po-link">{{ row.orderNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Supplier Name" min-width="200" prop="supplier" />
        <el-table-column label="Urgent Date" width="110" prop="urgentDate" />
        <el-table-column label="Due date" width="110" prop="dueDate" sortable />
        <el-table-column label="Actions" width="80" align="center">
          <template #default="{row}">
            <el-button type="text" size="mini" icon="el-icon-edit" @click="openPoDocs(row)" />
          </template>
        </el-table-column>
      </el-table>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
        <span style="font-size:12px;color:#666">Total {{ poListFiltered.length }}</span>
        <el-pagination layout="prev, pager, next" :total="poListFiltered.length" :page-size="20" small />
      </div>
    </el-dialog>

    <!-- ── Dialog 2: PO document history ─────────────────────────────────── -->
    <el-dialog
      :visible.sync="poDocsDialog.visible"
      title="Upload Shipping Documents"
      width="1100px" top="5vh" custom-class="brand-dialog"
    >
      <div v-if="currentPo" style="margin-bottom:10px;display:flex;align-items:center;gap:12px">
        <el-button type="primary" size="mini" icon="el-icon-upload2" @click="openUploadDialog">Upload</el-button>
        <el-tag size="mini" type="danger" style="margin-left:6px;vertical-align:middle">New</el-tag>
        <span style="font-size:12px;color:#666">
          PO <strong style="color:#004F7C">{{ currentPo.orderNo }}</strong> · {{ currentPo.supplier }} · SO Ref {{ currentPo.soRef }}
        </span>
      </div>
      <el-table v-if="currentPo" :data="currentPo.docs" size="mini" stripe border :header-cell-style="{background:'#fafafa'}">
        <el-table-column label="Document Number" width="130" prop="docNumber" align="center" />
        <el-table-column label="PO Number" width="140" prop="poNumber" align="center" />
        <el-table-column label="SO Ref" width="140" prop="soRef" align="center" />
        <el-table-column label="Document Type" width="150" align="center">
          <template #default="{row}">
            <div>{{ row.docTypeLabel }}</div>
          </template>
        </el-table-column>
        <el-table-column label="BL Type" width="80" align="center">
          <template #default="{row}">{{ row.blType || '/' }}</template>
        </el-table-column>
        <el-table-column label="Version" width="80" align="center">
          <template #default="{row}">
            <el-tooltip v-if="row.versionHistory && row.versionHistory.length" content="Click to view version history" placement="top">
              <el-tag size="mini" type="primary" style="cursor:pointer" @click="versionHistoryDialog={visible:true,doc:row}">
                v{{ row.version }} <i class="el-icon-time" style="font-size:10px;margin-left:2px"></i>
              </el-tag>
            </el-tooltip>
            <el-tag v-else size="mini" type="info">v{{ row.version }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="File Name" min-width="160" prop="fileName" />
        <el-table-column label="Upload Date" width="110" prop="uploadDate" align="center" />
        <el-table-column label="Action" width="220" align="center">
          <template #default="{row}">
            <el-tooltip content="Update — upload a new version of this document" placement="top">
              <el-button type="warning" size="mini" icon="el-icon-refresh-left" @click="openUpdateDialog(row)" />
            </el-tooltip>
            <el-button type="primary" size="mini" icon="el-icon-download" @click="downloadFile(row.fileName)" />
            <el-button type="primary" size="mini" icon="el-icon-view" @click="previewPoDoc(row)" />
            <el-tooltip :disabled="!currentPo.confirmed" content="Locked — documents cannot be deleted after Confirm" placement="top">
              <span>
                <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="currentPo.confirmed" @click="deletePoDoc(row)" />
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="currentPo && !currentPo.docs.length" style="text-align:center;padding:28px;color:#c0c4cc;font-size:13px">
        No documents uploaded for this PO yet — click <strong>Upload</strong> to start
      </div>
      <div slot="footer">
        <el-button size="small" @click="poDocsDialog.visible=false">Cancel</el-button>
        <el-tooltip :disabled="poHasAnyDocs" content="Nothing to save — no documents on this PO yet" placement="top">
          <span style="margin-left:10px">
            <el-button size="small" icon="el-icon-folder-checked" :disabled="!poHasAnyDocs" @click="savePoDocs">Save</el-button>
          </span>
        </el-tooltip>
        <el-tooltip :disabled="poHasRequired" content="Confirm requires Commercial Invoice and Packing List on this PO — upload and submit them first" placement="top">
          <span style="margin-left:10px">
            <el-button size="small" type="primary" :disabled="!poHasRequired" @click="confirmPoDocs">Confirm</el-button>
          </span>
        </el-tooltip>
      </div>
    </el-dialog>

    <!-- ── Dialog 3: Upload (full AI-verify flow, embedded in dialog) ────── -->
    <el-dialog
      :visible.sync="uploadDialog.visible"
      :title="currentPo ? `Upload Documents — ${currentPo.orderNo}` : 'Upload Documents'"
      width="1080px" top="3vh" custom-class="brand-dialog"
      :close-on-click-modal="false"
    >
      <template v-if="currentPo">

        <!-- Milestone status bar -->
        <el-card class="milestone-bar" :class="milestoneBarClass" shadow="never">
          <div class="milestone-bar-inner">
            <div class="milestone-bar-left">
              <i :class="milestoneIcon"></i>
              <div>
                <div class="milestone-bar-title">{{ milestoneTitle }}</div>
                <div class="milestone-bar-sub">{{ milestoneSub }}</div>
              </div>
            </div>
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
                  <div class="hint-item"><i class="el-icon-check"></i> PO Number matches <strong>{{ currentPo.orderNo }}</strong></div>
                  <div class="hint-item"><i class="el-icon-check"></i> Supplier matches <strong>{{ currentPo.supplier }}</strong></div>
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
                    <div class="check-item pass"><i class="el-icon-circle-check"></i> PO Number: {{ currentPo.orderNo }} ✓</div>
                    <div class="check-item pass"><i class="el-icon-circle-check"></i> Supplier: {{ currentPo.supplier }} ✓</div>
                  </div>
                </div>
                <div class="new-version-row">
                  <el-upload action="#" :auto-upload="false" :show-file-list="false" :on-change="(f) => startUpload(slot, f, 'pass')">
                    <el-button type="text" size="mini" icon="el-icon-refresh-left">Upload new version</el-button>
                  </el-upload>
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
                    <span class="mismatch-detail">Found <strong>{{ slot.foundPO }}</strong> — expected <strong>{{ currentPo.orderNo }}</strong></span>
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
        <el-card shadow="never">
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
          </el-table>
          <div v-if="!otherDocuments.length" style="text-align:center;padding:14px;color:#c0c4cc;font-size:13px">No other documents added in this session</div>
        </el-card>

      </template>

      <div slot="footer">
        <el-button size="small" @click="uploadDialog.visible=false">Cancel</el-button>
        <el-tooltip :disabled="hasSessionUploads" content="Nothing to save yet — upload at least one document" placement="top">
          <span style="margin-left:10px">
            <el-button size="small" icon="el-icon-folder-checked" :disabled="!hasSessionUploads" @click="saveUpload">Save</el-button>
          </span>
        </el-tooltip>
        <el-tooltip :disabled="canConfirm" content="Submit requires Commercial Invoice and Packing List — both uploaded and AI-verified" placement="top">
          <span style="margin-left:10px">
            <el-button size="small" type="primary" :disabled="!canConfirm" @click="submitUpload">Submit</el-button>
          </span>
        </el-tooltip>
      </div>
    </el-dialog>

    <!-- ── Preview Dialog ──────────────────────────────────────────────── -->
    <el-dialog :visible.sync="preview.visible" :title="preview.title" width="760px" top="5vh" append-to-body>
      <div class="preview-dialog">
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

        <div v-if="preview.status === 'VERIFIED'" class="preview-verify-bar">
          <i class="el-icon-circle-check" style="color:#13ce66"></i>
          <span>AI Verified — Document type, PO Number and Supplier all matched</span>
        </div>
        <div v-else class="preview-verify-bar unverified">
          <i class="el-icon-warning-outline" style="color:#E6A817"></i>
          <span>Unverified — Pending OHA review</span>
        </div>

        <div class="pdf-viewer">
          <div class="pdf-page">
            <div class="pdf-header-row">
              <div class="pdf-company">{{ currentPo ? currentPo.supplier : 'Supplier Co.' }}</div>
              <div class="pdf-doc-title">{{ preview.docType }}</div>
            </div>
            <div class="pdf-divider"></div>
            <div class="pdf-fields">
              <div class="pdf-field"><span class="pdf-label">PO Number</span><span class="pdf-value highlight">{{ preview.poNumber }}</span></div>
              <div class="pdf-field"><span class="pdf-label">Document No.</span><span class="pdf-value">{{ preview.fileName.replace('.pdf','') }}</span></div>
              <div class="pdf-field"><span class="pdf-label">Date</span><span class="pdf-value">{{ preview.uploadedAt }}</span></div>
              <div class="pdf-field"><span class="pdf-label">Supplier</span><span class="pdf-value">{{ currentPo ? currentPo.supplier : '—' }}</span></div>
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

    <!-- ── Document Correction queue (rejected during Pepco review) ──────── -->
    <el-dialog
      :visible.sync="correctionDialog.visible"
      title="Document Correction — Rejected by Pepco Review"
      width="1080px" top="6vh" custom-class="brand-dialog"
    >
      <el-alert v-if="correctionQueue.length" type="warning" :closable="false" show-icon style="margin-bottom:10px"
        title="These documents were rejected during Pepco review. Re-upload each one — once all rejected documents of a HBL are corrected, its review flow automatically restarts at PGS (re-check).">
      </el-alert>
      <el-table :data="correctionQueue" size="mini" stripe border :header-cell-style="{background:'#fafafa'}">
        <el-table-column label="HBL" width="110">
          <template #default="{row}"><span style="font-weight:600;color:#004F7C">{{ row.hbl.hblNo }}</span></template>
        </el-table-column>
        <el-table-column label="PO Number" width="120">
          <template #default="{row}">{{ row.doc.poNo }}</template>
        </el-table-column>
        <el-table-column label="Document Type" width="150">
          <template #default="{row}">{{ row.doc.docType }}</template>
        </el-table-column>
        <el-table-column label="File" min-width="160">
          <template #default="{row}">
            <el-tooltip content="Click to preview file" placement="top">
              <span
                style="color:#004F7C;cursor:pointer;text-decoration:underline;font-size:12px"
                @click="previewRejectedDoc(row)"
              >{{ row.doc.fileName }}</span>
            </el-tooltip>
            <el-tag size="mini" type="info" style="margin-left:4px">v{{ row.doc.version }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Rejected By" width="160">
          <template #default="{row}">
            <div style="font-size:11px">{{ row.doc.reject.by }}</div>
            <div style="font-size:10px;color:#999">{{ row.doc.reject.at }} · {{ row.doc.reject.milestone }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Reject Reason" width="200">
          <template #default="{row}">
            <div style="color:#ff4949;font-size:12px">{{ row.doc.reject.reason }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Reviewer Remark" min-width="200">
          <template #default="{row}">
            <span v-if="row.doc.reject.remark" style="font-size:12px;color:#303133">{{ row.doc.reject.remark }}</span>
            <span v-else style="color:#c0c4cc">—</span>
          </template>
        </el-table-column>
        <el-table-column label="Action" width="110" align="center">
          <template #default="{row}">
            <el-button type="warning" size="mini" icon="el-icon-refresh-left" @click="openCorrReupload(row)">Re-upload</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!correctionQueue.length" style="text-align:center;padding:28px;color:#13ce66;font-size:13px">
        <i class="el-icon-circle-check" style="font-size:20px"></i><br>
        No rejected documents — all corrections are done
      </div>
    </el-dialog>

    <!-- ── Correction re-upload dialog (AI-checked for CI / PL) ──────────── -->
    <el-dialog
      :visible.sync="corrUpload.visible"
      :title="corrUpload.item ? `Re-upload — ${corrUpload.item.doc.docType} (${corrUpload.item.hbl.hblNo})` : 'Re-upload'"
      width="540px" custom-class="brand-dialog" append-to-body
      :close-on-click-modal="false"
    >
      <template v-if="corrUpload.item">
        <!-- Reject reason -->
        <div class="corr-reject-banner">
          <i class="el-icon-warning-outline"></i>
          <div>
            <div><strong>{{ corrUpload.item.doc.reject.reason }}</strong></div>
            <div v-if="corrUpload.item.doc.reject.remark" style="font-size:11px;margin-top:2px">{{ corrUpload.item.doc.reject.remark }}</div>
            <div style="font-size:10px;color:#999;margin-top:2px">
              Rejected by {{ corrUpload.item.doc.reject.by }} · {{ corrUpload.item.doc.reject.at }} · {{ corrUpload.item.doc.reject.milestone }}
            </div>
          </div>
        </div>

        <!-- Current file -->
        <div class="update-current" style="margin-top:10px">
          <i class="el-icon-document" style="color:#004F7C;font-size:18px"></i>
          <div style="flex:1">
            <div style="font-size:12px;font-weight:600">{{ corrUpload.item.doc.fileName }}</div>
            <div style="margin-top:3px">
              <el-tag size="mini" type="danger">v{{ corrUpload.item.doc.version }} Rejected</el-tag>
              <span style="margin-left:6px;color:#999;font-size:11px">{{ corrUpload.item.doc.poNo }}</span>
            </div>
          </div>
        </div>

        <!-- IDLE -->
        <div v-if="corrUpload.state === 'idle'" style="margin-top:12px">
          <div v-if="corrNeedsAi(corrUpload.item)" class="upload-hint" style="margin-bottom:10px">
            <div class="hint-title">AI will verify the new version:</div>
            <div class="hint-item"><i class="el-icon-check"></i> Document is a {{ corrUpload.item.doc.docType }}</div>
            <div class="hint-item"><i class="el-icon-check"></i> PO Number matches <strong>{{ corrUpload.item.doc.poNo }}</strong></div>
            <div class="hint-item"><i class="el-icon-check"></i> Supplier matches <strong>{{ corrUpload.item.hbl.supplier }}</strong></div>
          </div>
          <div v-else style="font-size:12px;color:#666;margin-bottom:10px">
            This document type does not require AI verification — the new version is saved directly.
          </div>
          <el-upload action="#" :auto-upload="false" :show-file-list="false" :on-change="(f) => startCorrUpload(f)">
            <el-button type="primary" size="small" icon="el-icon-upload2">
              {{ corrNeedsAi(corrUpload.item) ? 'Upload & AI Verify' : 'Upload New Version' }}
            </el-button>
          </el-upload>
        </div>

        <!-- VERIFYING -->
        <div v-if="corrUpload.state === 'verifying'" style="margin-top:12px">
          <div class="verify-filename"><i class="el-icon-document"></i> {{ corrUpload.fileName }}</div>
          <div class="verify-steps">
            <div v-for="(step, i) in corrUpload.steps" :key="i" :class="['verify-step', stepClass(step.status)]">
              <i :class="stepIcon(step.status)"></i>
              <span>{{ step.label }}</span>
              <span v-if="step.status === 'running'" class="step-spinner"></span>
            </div>
          </div>
          <el-progress :percentage="corrUpload.progress" :stroke-width="4" :show-text="false" color="#004F7C" style="margin-top:8px" />
        </div>

        <!-- DONE -->
        <div v-if="corrUpload.state === 'done'" style="margin-top:12px">
          <el-alert type="success" :closable="false" show-icon
            :title="`Re-uploaded as v${corrUpload.item.doc.version}`">
            <div style="font-size:12px;margin-top:2px">
              <template v-if="corrUpload.resetTriggered">
                All rejected documents of {{ corrUpload.item.hbl.hblNo }} are corrected —
                <strong>review flow restarted at PGS Check (re-check)</strong>, PGS team notified.
              </template>
              <template v-else>
                Saved. Other rejected documents on {{ corrUpload.item.hbl.hblNo }} still need re-upload before the review flow restarts.
              </template>
            </div>
          </el-alert>
        </div>
      </template>

      <div slot="footer">
        <el-button size="small" @click="corrUpload.visible=false">{{ corrUpload.state === 'done' ? 'Close' : 'Cancel' }}</el-button>
      </div>
    </el-dialog>

    <!-- ── Update document dialog (direct new-version upload) ───────────── -->
    <el-dialog
      :visible.sync="updateDialog.visible"
      :title="updateDialog.doc ? `Update — ${updateDialog.doc.docTypeLabel}` : 'Update Document'"
      width="520px" custom-class="brand-dialog" append-to-body
      :close-on-click-modal="false"
    >
      <template v-if="updateDialog.doc">
        <!-- Current version summary -->
        <div class="update-current">
          <i class="el-icon-document" style="color:#004F7C;font-size:18px"></i>
          <div style="flex:1">
            <div style="font-size:12px;font-weight:600">{{ updateDialog.doc.fileName }}</div>
            <div style="margin-top:3px">
              <el-tag size="mini" type="info">v{{ updateDialog.doc.version }} Current</el-tag>
              <span style="margin-left:6px;color:#999;font-size:11px">Uploaded {{ updateDialog.doc.uploadDate }}</span>
            </div>
          </div>
        </div>

        <!-- IDLE: choose new file -->
        <div v-if="updateDialog.state === 'idle'" style="margin-top:12px">
          <div v-if="updateNeedsAi" class="upload-hint" style="margin-bottom:10px">
            <div class="hint-title">AI will verify the new version:</div>
            <div class="hint-item"><i class="el-icon-check"></i> Document is a {{ updateDialog.doc.docTypeLabel }}</div>
            <div class="hint-item"><i class="el-icon-check"></i> PO Number matches <strong>{{ currentPo.orderNo }}</strong></div>
            <div class="hint-item"><i class="el-icon-check"></i> Supplier matches <strong>{{ currentPo.supplier }}</strong></div>
          </div>
          <div v-else style="font-size:12px;color:#666;margin-bottom:10px">
            This document type does not require AI verification — the new version is saved directly.
          </div>
          <el-upload action="#" :auto-upload="false" :show-file-list="false" :on-change="(f) => startUpdate(f)">
            <el-button type="primary" size="small" icon="el-icon-upload2">
              {{ updateNeedsAi ? 'Upload & AI Verify' : 'Upload New Version' }}
            </el-button>
          </el-upload>
        </div>

        <!-- VERIFYING (CI / PL only) -->
        <div v-if="updateDialog.state === 'verifying'" style="margin-top:12px">
          <div class="verify-filename"><i class="el-icon-document"></i> {{ updateDialog.fileName }}</div>
          <div class="verify-steps">
            <div v-for="(step, i) in updateDialog.steps" :key="i" :class="['verify-step', stepClass(step.status)]">
              <i :class="stepIcon(step.status)"></i>
              <span>{{ step.label }}</span>
              <span v-if="step.status === 'running'" class="step-spinner"></span>
            </div>
          </div>
          <el-progress :percentage="updateDialog.progress" :stroke-width="4" :show-text="false" color="#004F7C" style="margin-top:8px" />
        </div>

        <!-- DONE -->
        <div v-if="updateDialog.state === 'done'" style="margin-top:12px">
          <el-alert type="success" :closable="false" show-icon
            :title="`New version saved as v${updateDialog.newVersion}`">
            <div style="font-size:12px;margin-top:2px">
              {{ updateDialog.fileName }} — previous versions are preserved (visible in Document Center later).
            </div>
          </el-alert>
        </div>
      </template>

      <div slot="footer">
        <el-button size="small" @click="updateDialog.visible=false">{{ updateDialog.state === 'done' ? 'Close' : 'Cancel' }}</el-button>
      </div>
    </el-dialog>

    <!-- ── Version History dialog ──────────────────────────────────────── -->
    <el-dialog
      :visible.sync="versionHistoryDialog.visible"
      :title="versionHistoryDialog.doc ? `Version History — ${versionHistoryDialog.doc.docTypeLabel}` : 'Version History'"
      width="680px" append-to-body custom-class="brand-dialog"
    >
      <template v-if="versionHistoryDialog.doc">
        <el-table :data="versionHistoryAllRows(versionHistoryDialog.doc)" size="mini" border :header-cell-style="{background:'#fafafa'}">
          <el-table-column label="Version" width="110" align="center">
            <template #default="{row}">
              <el-tag v-if="row.isCurrent" size="mini" type="success">v{{ row.version }} · Current</el-tag>
              <el-tag v-else size="mini" type="info">v{{ row.version }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="File Name" min-width="180" prop="fileName" />
          <el-table-column label="Upload Date" width="110" prop="uploadDate" align="center" />
          <el-table-column label="Status" width="100" align="center">
            <template #default="{row}">
              <span :class="['status-badge', row.status==='VERIFIED'?'verified':'unverified']">
                <i :class="row.status==='VERIFIED'?'el-icon-check':'el-icon-warning-outline'"></i>
                {{ row.status==='VERIFIED'?'Verified':'Unverified' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="Actions" width="130" align="center">
            <template #default="{row}">
              <el-button type="text" size="mini" icon="el-icon-view" @click="previewVersionEntry(row)">Preview</el-button>
              <el-button type="text" size="mini" icon="el-icon-download" @click="downloadFile(row.fileName)">DL</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div slot="footer">
        <el-button size="small" @click="versionHistoryDialog.visible=false">Close</el-button>
      </div>
    </el-dialog>

    <!-- Delete confirm dialog -->
    <el-dialog :visible.sync="deleteConfirm.visible" title="Delete Document" width="400px" append-to-body>
      <div style="font-size:13px;line-height:1.8">
        <p>Are you sure you want to delete this document?</p>
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
import { rejectedDocs, resubmittedCount, resubmitDocument } from '@/store/reviewFlow'

const VERIFY_STEPS = [
  { label: 'Uploading file to server',      status: 'pending' },
  { label: 'Extracting content via OCR',    status: 'pending' },
  { label: 'Checking document type',        status: 'pending' },
  { label: 'Matching PO reference numbers', status: 'pending' },
]

const mkSlot = (key, label) => ({
  key, label, state: 'idle',
  fileName: '', version: 1, uploadedAt: '',
  progress: 0, steps: [], detectedType: '', foundPO: '',
})

// PO mock data — each PO carries its own uploaded-document history
const mkPo = (orderNo, supplier, soRef, urgentDate, dueDate, bucket, docs = [], confirmed = false) => ({
  orderNo, supplier, soRef, urgentDate, dueDate, bucket, docs, confirmed,
})

let DOC_NO = 4567890

export default {
  name: 'DocumentUpload',
  data() {
    return {
      // Origin task board (only Upload Shipping Documents is interactive)
      taskRows: [
        { key:'CARGO_READY',   taskName:'Cargo Ready Date',         partyRole:'Supplier', possible:2456, urgent:282, overdue:124, finished:12664, hint:'Confirm the date cargo is ready for pickup' },
        { key:'DIMENSIONS',    taskName:'Dimensions',               partyRole:'Supplier', possible:0,    urgent:0,   overdue:11,  finished:12653, hint:'Submit cargo dimensions' },
        { key:'BOOKING',       taskName:'Shipper Booking',          partyRole:'Supplier', possible:18,   urgent:2,   overdue:12,  finished:12621, hint:'Place the shipper booking' },
        { key:'SI_VGM',        taskName:'SI/VGM Submit',            partyRole:'Supplier', possible:38,   urgent:0,   overdue:285, finished:11470, hint:'Submit Shipping Instruction & VGM' },
        { key:'CARGO_INBOUND', taskName:'Cargo Inbound',            partyRole:'OHA',      possible:127,  urgent:5,   overdue:62,  finished:2413,  hint:'Confirm cargo received at origin warehouse' },
        { key:'LOADING',       taskName:'Container Loading Result', partyRole:'Supplier', possible:0,    urgent:0,   overdue:122, finished:11348, hint:'Report container loading result' },
        { key:'UPLOAD_DOCS',   taskName:'Upload Shipping Documents',partyRole:'Supplier', possible:102,  urgent:0,   overdue:15,  finished:11286, hint:'Upload CI, PL and other shipping documents — AI verified' },
      ],

      poList: [
        mkPo('ORD01715445_01','NINGBO GENERAL UNION CO.,LTD','NGB26040836051','2026-05-20','2026-05-22','overdue', [
          { docNumber:4567890, poNumber:'ORD01715445_01', soRef:'NGB26040836051', docTypeLabel:'Commercial Invoice', blType:'', fileName:'111.txt', uploadDate:'2026-06-10', version:1, status:'VERIFIED' },
        ]),
        mkPo('ORD01715442_01','NINGBO GENERAL UNION CO.,LTD','NGB26040836052','2026-05-17','2026-05-19','overdue'),
        mkPo('ORD01715441_01','NINGBO GENERAL UNION CO.,LTD','NGB26040836053','2026-05-17','2026-05-19','overdue'),
        mkPo('ORD01711696_01','NINGBO GENERAL UNION CO.,LTD','NGB26040836054','2026-05-20','2026-05-22','overdue'),
        mkPo('ORD01711684_01','NINGBO GENERAL UNION CO.,LTD','NGB26040836055','2026-05-17','2026-05-19','overdue'),
        mkPo('ORD01694507_01','NINGBO GENERAL UNION CO.,LTD','NGB26040836056','2026-05-23','2026-05-26','overdue'),
        mkPo('ORD01694382_01','SHANGHAI TEXTILE CO.,LTD',    'SHA26040811021','2026-05-16','2026-05-19','possible'),
        mkPo('ORD01694101_01','SHANGHAI TEXTILE CO.,LTD',    'SHA26040811022','2026-05-20','2026-05-22','possible'),
        mkPo('ORD01694098_01','DHAKA GARMENTS LTD',          'CGP26040899011','2026-05-17','2026-05-19','possible'),
        mkPo('ORD01687130_01','DHAKA GARMENTS LTD',          'CGP26040899012','2026-05-20','2026-05-22','urgent'),
        mkPo('ORD01687127_01','HO CHI MINH APPAREL',         'SGN26040877001','2026-05-17','2026-05-19','urgent'),
        mkPo('ORD01671737_01','HO CHI MINH APPAREL',         'SGN26040877002','2026-05-02','2026-05-05','finished', [
          { docNumber:4567801, poNumber:'ORD01671737_01', soRef:'SGN26040877002', docTypeLabel:'Commercial Invoice', blType:'', fileName:'INV-1671737-v2.pdf', uploadDate:'2026-05-04', version:2, status:'VERIFIED',
            versionHistory:[{ version:1, fileName:'INV-1671737.pdf', uploadDate:'2026-05-01', status:'VERIFIED' }] },
          { docNumber:4567802, poNumber:'ORD01671737_01', soRef:'SGN26040877002', docTypeLabel:'Packing List',       blType:'', fileName:'PL-1671737.pdf',  uploadDate:'2026-05-04', version:1, status:'VERIFIED' },
          { docNumber:4567803, poNumber:'ORD01671737_01', soRef:'SGN26040877002', docTypeLabel:'Bill of Lading',     blType:'HBL', fileName:'HBL-1671737.pdf', uploadDate:'2026-05-05', version:1, status:'VERIFIED' },
        ], true),
      ],

      // Dialog state
      poListDialog: { visible: false, statusKey: '', statusLabel: '' },
      poDocsDialog: { visible: false },
      uploadDialog: { visible: false },
      currentPo: null,

      // Upload dialog state (reset per PO)
      mandatorySlots: [mkSlot('ci', 'Commercial Invoice'), mkSlot('pl', 'Packing List')],
      showOtherUpload: false,
      otherForm: { docType: '', fileName: '' },
      otherDocuments: [],

      preview: {
        visible: false, title: '',
        docType: '', fileName: '', version: 1,
        status: 'VERIFIED', uploadedAt: '', poNumber: '',
      },

      deleteConfirm: { visible: false, doc: null, fileName: '' },

      // Direct new-version upload for an existing document row
      updateDialog: {
        visible: false, doc: null,
        state: 'idle',          // idle | verifying | done
        fileName: '', steps: [], progress: 0, newVersion: 1,
      },

      // Version history viewer
      versionHistoryDialog: { visible: false, doc: null },

      // Rejected-document correction queue (shared with Pepco Review)
      correctionDialog: { visible: false },
      corrUpload: {
        visible: false, item: null,
        state: 'idle',          // idle | verifying | done
        fileName: '', steps: [], progress: 0, resetTriggered: false,
      },
    }
  },

  computed: {
    // Static task rows + the live Document Correction row (shared review store)
    allTaskRows() {
      const rejected = rejectedDocs().length
      const corrRow = {
        key: 'DOC_CORRECTION',
        taskName: 'Document Correction (Re-upload)',
        partyRole: 'Supplier',
        possible: 0, urgent: rejected, overdue: 0, finished: resubmittedCount(),
        hint: 'Documents rejected during Pepco review — re-upload to restart the review flow at PGS',
      }
      const idx = this.taskRows.findIndex(r => r.key === 'UPLOAD_DOCS')
      return [...this.taskRows.slice(0, idx + 1), corrRow]
    },

    // Supplier correction work queue (rejected documents across all HBLs)
    correctionQueue() {
      return rejectedDocs()
    },

    poListFiltered() {
      const k = this.poListDialog.statusKey
      if (!k) return this.poList
      return this.poList.filter(p => p.bucket === k)
    },

    milestoneComplete() {
      return this.mandatorySlots.every(s => s.state === 'verified')
    },
    // Invoice / Packing List updates must pass AI verification
    updateNeedsAi() {
      const t = this.updateDialog.doc && this.updateDialog.doc.docTypeLabel
      return t === 'Commercial Invoice' || t === 'Packing List'
    },
    // Submit enabled only when each required doc type is covered:
    // uploaded in this session (verified / force-saved) or already on the PO
    canConfirm() {
      if (!this.currentPo) return false
      return this.mandatorySlots.every(slot =>
        slot.state === 'verified' || slot.state === 'force_saved'
        || this.currentPo.docs.some(d => d.docTypeLabel === slot.label)
      )
    },
    // Save enabled as soon as anything was uploaded in this session —
    // other documents alone can be saved without meeting the CI+PL rule
    hasSessionUploads() {
      return this.mandatorySlots.some(s => s.state === 'verified' || s.state === 'force_saved')
        || this.otherDocuments.length > 0
    },
    // PO-level gates for the document history dialog footer
    poHasAnyDocs() {
      return !!this.currentPo && this.currentPo.docs.length > 0
    },
    poHasRequired() {
      if (!this.currentPo) return false
      return ['Commercial Invoice', 'Packing List'].every(t =>
        this.currentPo.docs.some(d => d.docTypeLabel === t))
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
      if (this.milestoneComplete) return 'All required documents verified — confirm to save'
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
    taskRowClass({ row }) {
      return row.key === 'UPLOAD_DOCS' ? 'upload-docs-row' : ''
    },

    // ── Dialog 1: PO list ────────────────────────────────────────────────
    openPoList(taskRow, statusKey) {
      if (taskRow.key === 'DOC_CORRECTION') {
        this.correctionDialog.visible = true
        return
      }
      if (taskRow.key !== 'UPLOAD_DOCS') {
        this.$message.info(`"${taskRow.taskName}" is an existing milestone — demo focuses on Upload Shipping Documents`)
        return
      }
      const labels = { possible:'Possible', urgent:'Urgent', overdue:'Overdue', finished:'Finished' }
      this.poListDialog = { visible: true, statusKey, statusLabel: labels[statusKey] || '' }
    },

    // ── Document Correction (rejected docs re-upload) ────────────────────
    previewRejectedDoc(row) {
      const { hbl, doc } = row
      const w = window.open('', '_blank')
      if (!w) { this.$message.warning('Pop-up blocked — please allow pop-ups for this site and try again'); return }
      const statusColor = '#ff4949'
      w.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>${doc.docType} — ${hbl.hblNo} [REJECTED]</title>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background:#EBF0F4; margin:0; padding:24px; }
    .wrapper { max-width:760px; margin:0 auto; }
    .topbar { background:#004F7C; color:#fff; padding:12px 20px; border-radius:8px 8px 0 0;
              display:flex; justify-content:space-between; align-items:center; }
    .topbar-title { font-size:15px; font-weight:700; }
    .topbar-meta  { font-size:11px; opacity:0.8; }
    .meta-card { background:#fff; border:1px solid #dce3ea; padding:14px 20px; margin-bottom:14px; }
    .meta-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px 20px; font-size:12px; }
    .meta-label { color:#909399; margin-bottom:2px; font-size:11px; text-transform:uppercase; letter-spacing:0.4px; }
    .meta-value { color:#303133; font-weight:600; }
    .reject-banner { background:#fff0f0; border:1px solid #ffcdd2; border-radius:6px; padding:10px 14px;
                     margin-bottom:14px; font-size:12px; }
    .reject-code { color:#ff4949; font-weight:700; margin-bottom:4px; }
    .reject-remark { color:#606266; }
    .reject-by { color:#909399; font-size:11px; margin-top:4px; }
    .pdf-page { background:#fff; border:1px solid #dce3ea; padding:28px 32px; border-radius:0 0 8px 8px; }
    .pdf-header { display:flex; justify-content:space-between; margin-bottom:14px; }
    .pdf-company { font-weight:700; font-size:15px; color:#004F7C; }
    .pdf-doctype { font-weight:700; font-size:18px; color:#303133; }
    .pdf-divider { height:2px; background:#ff4949; margin-bottom:16px; }
    .pdf-fields { display:grid; grid-template-columns:1fr 1fr; gap:6px 24px; margin-bottom:18px; font-size:12px; }
    .pdf-label { color:#909399; width:110px; display:inline-block; }
    .pdf-value { color:#303133; font-weight:500; }
    .pdf-value.hi { color:#004F7C; font-weight:700; }
    table { width:100%; border-collapse:collapse; font-size:12px; margin-bottom:14px; }
    thead tr { background:#f5f7fa; }
    th, td { padding:6px 10px; border:1px solid #ebeef5; text-align:left; }
    th { font-weight:600; color:#606266; font-size:11px; }
    .footer { text-align:center; color:#bbb; font-size:11px; margin-top:14px; font-style:italic; }
    .simulate-note { background:#fffbe6; border:1px solid #ffe58f; border-radius:4px; padding:6px 12px;
                     font-size:11px; color:#876800; margin-top:10px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="topbar">
      <span class="topbar-title">${doc.docType} — REJECTED</span>
      <span class="topbar-meta">${hbl.hblNo} · ${hbl.supplier} · v${doc.version}</span>
    </div>
    <div class="reject-banner">
      <div class="reject-code">✕ ${doc.reject.reason}</div>
      ${doc.reject.remark ? `<div class="reject-remark">${doc.reject.remark}</div>` : ''}
      <div class="reject-by">Rejected by ${doc.reject.by} · ${doc.reject.at} · ${doc.reject.milestone}</div>
    </div>
    <div class="meta-card">
      <div class="meta-grid">
        <div><div class="meta-label">Document Number</div><div class="meta-value" style="color:#004F7C">${doc.docNumber || '—'}</div></div>
        <div><div class="meta-label">Document Type</div><div class="meta-value">${doc.docType}</div></div>
        <div><div class="meta-label">Version</div><div class="meta-value" style="color:#ff4949">v${doc.version} (Rejected)</div></div>
        <div><div class="meta-label">PO Number</div><div class="meta-value">${doc.poNo}</div></div>
        <div><div class="meta-label">HBL Number</div><div class="meta-value">${hbl.hblNo}</div></div>
        <div><div class="meta-label">Uploaded</div><div class="meta-value">${doc.uploadedAt}</div></div>
        <div><div class="meta-label">File Name</div><div class="meta-value">${doc.fileName}</div></div>
        <div><div class="meta-label">Supplier</div><div class="meta-value">${hbl.supplier}</div></div>
      </div>
    </div>
    <div class="pdf-page">
      <div class="pdf-header">
        <div class="pdf-company">${hbl.supplier}</div>
        <div class="pdf-doctype">${doc.docType}</div>
      </div>
      <div class="pdf-divider"></div>
      <div class="pdf-fields">
        <div><span class="pdf-label">Document No.</span><span class="pdf-value hi">${doc.docNumber || doc.fileName.replace('.pdf','')}</span></div>
        <div><span class="pdf-label">PO Number</span><span class="pdf-value hi">${doc.poNo}</span></div>
        <div><span class="pdf-label">HBL</span><span class="pdf-value">${hbl.hblNo}</span></div>
        <div><span class="pdf-label">Date</span><span class="pdf-value">${doc.uploadedAt}</span></div>
        <div><span class="pdf-label">Supplier</span><span class="pdf-value">${hbl.supplier}</span></div>
        <div><span class="pdf-label">Version</span><span class="pdf-value" style="color:#ff4949">v${doc.version} — Rejected</span></div>
      </div>
      <table>
        <thead><tr><th>Item Description</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr></thead>
        <tbody>
          <tr><td>Product Item A</td><td>120</td><td>USD 3.50</td><td>USD 420.00</td></tr>
          <tr><td>Product Item B</td><td>240</td><td>USD 7.00</td><td>USD 1,680.00</td></tr>
          <tr><td>Product Item C</td><td>360</td><td>USD 10.50</td><td>USD 3,780.00</td></tr>
          <tr><td>Product Item D</td><td>480</td><td>USD 14.00</td><td>USD 6,720.00</td></tr>
        </tbody>
        <tfoot><tr style="font-weight:700;background:#f0f7ff"><td>Total</td><td></td><td></td><td>USD 12,600.00</td></tr></tfoot>
      </table>
      <div class="footer">[ Simulated document preview — for demo purposes ]</div>
      <div class="simulate-note">This is a prototype simulation. In production this tab would display the actual uploaded PDF file.</div>
    </div>
  </div>
</body>
</html>`)
      w.document.close()
    },

    openCorrReupload(item) {
      this.corrUpload = {
        visible: true, item,
        state: 'idle', fileName: '', steps: [], progress: 0, resetTriggered: false,
      }
    },
    corrNeedsAi(item) {
      return ['Commercial Invoice', 'Packing List'].includes(item.doc.docType)
    },
    startCorrUpload(file) {
      const c = this.corrUpload
      c.fileName = file ? file.name : `${c.item.doc.docType.replace(/\s+/g, '').toUpperCase()}-FIXED.pdf`

      if (!this.corrNeedsAi(c.item)) {
        this.finishCorrUpload()
        return
      }
      c.state = 'verifying'; c.progress = 0
      c.steps = VERIFY_STEPS.map(s => ({ ...s }))
      c.steps[0].status = 'running'
      const timings = [
        { delay: 600,  step: 0, progress: 20,  nextStep: 1 },
        { delay: 1400, step: 1, progress: 55,  nextStep: 2 },
        { delay: 2400, step: 2, progress: 75,  nextStep: 3 },
        { delay: 3400, step: 3, progress: 100 },
      ]
      timings.forEach(({ delay, step, progress, nextStep }) => {
        setTimeout(() => {
          c.steps[step].status = 'done'
          c.progress = progress
          if (nextStep !== undefined) c.steps[nextStep].status = 'running'
          if (step === 3) setTimeout(() => this.finishCorrUpload(), 400)
        }, delay)
      })
    },
    finishCorrUpload() {
      const c = this.corrUpload
      const { hbl, doc } = c.item
      const result = resubmitDocument(hbl, doc, c.fileName, `${hbl.supplier} (Supplier)`)
      c.state = 'done'
      c.resetTriggered = result.reset
      if (result.reset) {
        this.$notify({
          title: 'Review flow restarted',
          dangerouslyUseHTMLString: true,
          message: `<div style="font-size:12px;line-height:1.7">
            <div><b>${hbl.hblNo}</b> — all rejected documents corrected.</div>
            <div style="color:#13ce66">✔ Milestones reset — flow restarts at <b>PGS Check (Re-check)</b></div>
            <div style="color:#999">✉ PGS team notified for re-review</div>
          </div>`,
          type: 'success', duration: 6000,
        })
      } else {
        this.$message.success(`${doc.docType} re-uploaded (v${doc.version}) — ${result.remaining} rejected document(s) still pending on ${hbl.hblNo}`)
      }
    },

    // ── Dialog 2: PO docs history ────────────────────────────────────────
    openPoDocs(po) {
      this.currentPo = po
      this.poDocsDialog.visible = true
    },
    savePoDocs() {
      this.poDocsDialog.visible = false
      this.$message.success(`${this.currentPo.docs.length} document(s) saved for ${this.currentPo.orderNo} — milestone not completed (CI + PL still required)`)
    },
    confirmPoDocs() {
      // Backstop for the disabled button — same rule as poHasRequired
      if (!this.poHasRequired) {
        this.$message.error('Cannot confirm: Commercial Invoice and Packing List are required on this PO')
        return
      }
      this.currentPo.confirmed = true
      this.poDocsDialog.visible = false
      this.$message.success(`${this.currentPo.orderNo} confirmed — Upload Shipping Documents milestone completed`)
    },
    previewPoDoc(doc) {
      this.preview = {
        visible: true,
        title: `Preview — ${doc.docTypeLabel} (v${doc.version})`,
        docType: doc.docTypeLabel,
        fileName: doc.fileName,
        version: doc.version,
        status: doc.status || 'VERIFIED',
        uploadedAt: doc.uploadDate,
        poNumber: doc.poNumber,
      }
    },
    deletePoDoc(doc) {
      this.deleteConfirm = { visible: true, doc, fileName: doc.fileName }
    },
    confirmDelete() {
      const { doc } = this.deleteConfirm
      const idx = this.currentPo.docs.indexOf(doc)
      if (idx > -1) this.currentPo.docs.splice(idx, 1)
      this.$message.success(`Deleted: ${doc.fileName}`)
      this.deleteConfirm.visible = false
    },

    // ── Dialog 3: Upload ─────────────────────────────────────────────────
    openUploadDialog() {
      // fresh slots per session; existing versions counted from PO history
      this.mandatorySlots = [mkSlot('ci', 'Commercial Invoice'), mkSlot('pl', 'Packing List')]
      this.otherDocuments = []
      this.otherForm = { docType: '', fileName: '' }
      this.showOtherUpload = false
      this.uploadDialog.visible = true
    },

    // version = existing docs of same type on this PO + 1
    nextVersion(docTypeLabel) {
      const existing = this.currentPo.docs.filter(d => d.docTypeLabel === docTypeLabel)
      return existing.length ? Math.max(...existing.map(d => d.version)) + 1 : 1
    },

    // Persist every file uploaded in this session to the PO history, then
    // reset the session state so a second Save cannot duplicate them.
    persistSessionUploads() {
      const today = new Date().toISOString().slice(0, 10)
      let saved = 0

      this.mandatorySlots.forEach(slot => {
        if (slot.state === 'verified' || slot.state === 'force_saved') {
          this.currentPo.docs.push({
            docNumber: ++DOC_NO,
            poNumber: this.currentPo.orderNo,
            soRef: this.currentPo.soRef,
            docTypeLabel: slot.label,
            blType: '',
            fileName: slot.fileName,
            uploadDate: today,
            version: this.nextVersion(slot.label),
            status: slot.state === 'verified' ? 'VERIFIED' : 'UNVERIFIED',
          })
          saved++
        }
      })
      this.otherDocuments.forEach(d => {
        this.currentPo.docs.push({
          docNumber: ++DOC_NO,
          poNumber: this.currentPo.orderNo,
          soRef: this.currentPo.soRef,
          docTypeLabel: d.docTypeLabel,
          blType: d.docType === 'BILL_OF_LADING' ? 'HBL' : '',
          fileName: d.fileName,
          uploadDate: today,
          version: this.nextVersion(d.docTypeLabel),
          status: d.status,
        })
        saved++
      })

      this.mandatorySlots = [mkSlot('ci', 'Commercial Invoice'), mkSlot('pl', 'Packing List')]
      this.otherDocuments = []
      return saved
    },

    // Save: store whatever was uploaded (other documents alone are fine) —
    // the milestone is NOT completed; files reappear in the PO history.
    saveUpload() {
      const saved = this.persistSessionUploads()
      this.uploadDialog.visible = false
      this.$message.success(`${saved} document(s) saved to ${this.currentPo.orderNo} — you can continue later. Submit still requires CI + PL.`)
    },

    // Submit: completes the milestone — hard-gated on CI + PL coverage.
    submitUpload() {
      // Backstop for the disabled button — same rule as canConfirm
      if (!this.canConfirm) {
        this.$message.error('Cannot submit: Commercial Invoice and Packing List are both required')
        return
      }
      const saved = this.persistSessionUploads()
      this.uploadDialog.visible = false
      this.$message.success(`Submitted — ${saved} new document(s) saved to ${this.currentPo.orderNo}, Upload Shipping Documents milestone completed`)
      // back on the PO docs dialog — list already shows the new files
    },

    // ── Update an existing document (new version, AI-checked for CI/PL) ──
    openUpdateDialog(doc) {
      this.updateDialog = {
        visible: true, doc,
        state: 'idle', fileName: '', steps: [], progress: 0, newVersion: doc.version + 1,
      }
    },

    startUpdate(file) {
      const d = this.updateDialog
      d.fileName = file ? file.name : `${d.doc.docTypeLabel.replace(/\s+/g,'').toUpperCase()}-UPDATE.pdf`

      if (!this.updateNeedsAi) {
        // Non CI/PL types save directly
        this.saveUpdatedVersion()
        return
      }

      // CI / PL: run the same 4-step AI verification
      d.state = 'verifying'; d.progress = 0
      d.steps = VERIFY_STEPS.map(s => ({ ...s }))
      d.steps[0].status = 'running'

      const timings = [
        { delay: 600,  step: 0, progress: 20,  nextStep: 1 },
        { delay: 1400, step: 1, progress: 55,  nextStep: 2 },
        { delay: 2400, step: 2, progress: 75,  nextStep: 3 },
        { delay: 3400, step: 3, progress: 100 },
      ]
      timings.forEach(({ delay, step, progress, nextStep }) => {
        setTimeout(() => {
          d.steps[step].status = 'done'
          d.progress = progress
          if (nextStep !== undefined) d.steps[nextStep].status = 'running'
          if (step === 3) setTimeout(() => this.saveUpdatedVersion(), 400)
        }, delay)
      })
    },

    saveUpdatedVersion() {
      const d = this.updateDialog
      const today = new Date().toISOString().slice(0, 10)
      d.newVersion = d.doc.version + 1
      // Replace the row in place: same list entry, new file/version/doc number.
      // Superseded versions are archived to the Document Center (Phase 1 backlog).
      d.doc.docNumber = ++DOC_NO
      d.doc.fileName = d.fileName
      d.doc.uploadDate = today
      d.doc.version = d.newVersion
      d.doc.status = 'VERIFIED'
      d.state = 'done'
      this.$message.success(`${d.doc.docTypeLabel} updated to v${d.newVersion}`)
    },

    // ── Slot upload flow (unchanged AI-verify simulation) ────────────────
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
        slot.version = this.nextVersion(slot.label)
        this.$message.success(`${slot.label} verified successfully!`)
      } else if (scenario === 'type_error') {
        slot.steps[2].status = 'error'; slot.steps[3].status = 'pending'
        slot.state = 'type_error'
        slot.detectedType = slot.key === 'ci' ? 'Bill of Lading' : 'Commercial Invoice'
        this.$message.error(`${slot.label}: wrong document type detected`)
      } else if (scenario === 'po_mismatch') {
        slot.steps[3].status = 'error'; slot.state = 'po_mismatch'
        slot.foundPO = 'ORD09999999_01'
        this.$message.warning(`${slot.label}: PO number does not match`)
      }
    },

    forceSave(slot) {
      slot.state = 'force_saved'; slot.uploadedAt = new Date().toLocaleTimeString()
      slot.version = this.nextVersion(slot.label)
      this.$message.warning('Saved as Unverified. OHA will review this document.')
    },

    // ── Preview / download ───────────────────────────────────────────────
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
        poNumber: this.currentPo ? this.currentPo.orderNo : '—',
      }
    },

    downloadFile(fileName) {
      this.$message.success(`Downloading ${fileName}…`)
    },

    // ── Version history helpers ──────────────────────────────────────────
    // Returns current version + all historical entries, newest first
    versionHistoryAllRows(doc) {
      const current = { version: doc.version, fileName: doc.fileName, uploadDate: doc.uploadDate, status: doc.status, isCurrent: true }
      const history = (doc.versionHistory || []).map(h => ({ ...h, uploadDate: h.uploadDate || h.uploadedAt, isCurrent: false }))
        .sort((a, b) => b.version - a.version)
      return [current, ...history]
    },
    previewVersionEntry(row) {
      this.preview = {
        visible: true,
        title: `Preview — ${this.versionHistoryDialog.doc.docTypeLabel} (v${row.version})`,
        docType: this.versionHistoryDialog.doc.docTypeLabel,
        fileName: row.fileName,
        version: row.version,
        status: row.status || 'VERIFIED',
        uploadedAt: row.uploadDate || row.uploadedAt || '',
        poNumber: this.versionHistoryDialog.doc.poNumber || '',
      }
    },

    // ── Other docs (within upload dialog session) ────────────────────────
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
      this.$message.success('Document added — will be saved on Confirm')
    },
  },
}
</script>

<style lang="scss" scoped>
.card-hdr { display:flex; justify-content:space-between; align-items:center; font-weight:600; }

// Origin task board
.ms-num {
  font-weight:700; cursor:pointer; padding:2px 8px; border-radius:4px; font-size:13px;
  text-decoration:underline;
  &.possible { color:#3A71A8; }
  &.urgent   { color:#E6A817; }
  &.overdue  { color:#ff4949; }
  &.finished { color:#13ce66; }
}
::v-deep .upload-docs-row { background:#f0f7ff !important; }

.po-link { color:$primary; font-weight:600; text-decoration:underline; }

// Brand dialog header
::v-deep .brand-dialog .el-dialog__header {
  background:$primary; padding:12px 20px;
  .el-dialog__title { color:#fff; font-size:14px; font-weight:600; }
  .el-dialog__headerbtn .el-dialog__close { color:#fff; }
}

// Milestone bar
.milestone-bar {
  margin-bottom:12px; border:1px solid $border;
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

// Update dialog — current version summary
.update-current {
  display:flex; align-items:center; gap:10px;
  background:#f8fafc; border:1px solid $border; border-radius:6px; padding:10px 12px;
}

// Correction re-upload — reject reason banner
.corr-reject-banner {
  display:flex; gap:8px; align-items:flex-start;
  background:#fff0f0; border:1px solid #ffa39e; border-radius:6px;
  padding:9px 12px; font-size:12px; color:#8c2e2b;
  i { color:#ff4949; font-size:15px; margin-top:1px; flex-shrink:0; }
}

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

// status badge (other docs table)
.status-badge {
  font-size:11px; font-weight:600; padding:2px 8px; border-radius:10px; display:inline-flex; align-items:center; gap:3px;
  &.verified   { background:#e6f9ef; color:darken($status-verified,10%); }
  &.unverified { background:#fff8e0; color:#e6a817; }
}
</style>
