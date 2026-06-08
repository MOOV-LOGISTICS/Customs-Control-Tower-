<template>
  <div class="app-container">

    <!-- HBL selector -->
    <el-card style="margin-bottom:12px">
      <el-row :gutter="12" align="middle" type="flex">
        <el-col :span="6">
          <el-select v-model="selectedHbl" placeholder="Select HBL" style="width:100%" @change="onHblChange">
            <el-option v-for="h in hblList" :key="h.value" :label="h.label" :value="h.value" />
          </el-select>
        </el-col>
        <el-col :span="18" v-if="hblInfo">
          <el-descriptions :column="5" size="mini" border>
            <el-descriptions-item label="Supplier">{{ hblInfo.supplier }}</el-descriptions-item>
            <el-descriptions-item label="POL">{{ hblInfo.pol }}</el-descriptions-item>
            <el-descriptions-item label="POD">{{ hblInfo.pod }}</el-descriptions-item>
            <el-descriptions-item label="ETD">{{ hblInfo.etd }}</el-descriptions-item>
            <el-descriptions-item label="ETA">{{ hblInfo.eta }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="12" v-if="selectedHbl">
      <!-- Left: existing documents -->
      <el-col :span="14">
        <el-card>
          <div slot="header" class="card-hdr">
            <span>Uploaded Documents</span>
            <el-button type="primary" size="mini" icon="el-icon-upload2" @click="showUpload=true">Upload New Document</el-button>
          </div>
          <el-table :data="documents" size="mini" stripe border>
            <el-table-column label="Document Type" min-width="160">
              <template #default="{row}">
                <i class="el-icon-document" style="color:#004F7C;margin-right:4px"></i>
                {{ row.docTypeLabel }}
              </template>
            </el-table-column>
            <el-table-column label="File Name" min-width="170" prop="fileName" />
            <el-table-column label="Ver" width="45" align="center">
              <template #default="{row}">
                <el-tag size="mini" type="info">v{{ row.version }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Status" width="110">
              <template #default="{row}">
                <span :class="['status-badge', row.status==='VERIFIED'?'verified':'unverified']">
                  <i :class="row.status==='VERIFIED'?'el-icon-check':'el-icon-warning-outline'"></i>
                  {{ row.status==='VERIFIED'?'Verified':'Unverified' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="Uploaded" width="115" prop="uploadedAt" />
            <el-table-column label="" width="60" align="center">
              <template #default="{row}">
                <el-button type="text" size="mini" icon="el-icon-view" />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- Right: upload panel / AI result -->
      <el-col :span="10">
        <el-card v-if="!showUpload && !aiResult">
          <div style="text-align:center;padding:40px 0;color:#c0c4cc">
            <i class="el-icon-upload" style="font-size:48px;display:block;margin-bottom:12px"></i>
            <div style="font-size:13px">Click "Upload New Document" to add files</div>
          </div>
        </el-card>

        <!-- Upload form -->
        <el-card v-if="showUpload && !aiResult">
          <div slot="header" class="card-hdr">
            <span>Upload Document</span>
            <el-button type="text" size="mini" icon="el-icon-close" @click="showUpload=false" />
          </div>
          <el-form label-position="top" size="mini">
            <el-form-item label="Document Type" required>
              <el-select v-model="form.docType" placeholder="Select type" style="width:100%">
                <el-option label="Commercial Invoice" value="COMMERCIAL_INVOICE" />
                <el-option label="Packing List" value="PACKING_LIST" />
                <el-option label="Bill of Lading (HBL)" value="BILL_OF_LADING" />
                <el-option label="Certificate of Origin" value="CERTIFICATE_OF_ORIGIN" />
                <el-option label="Sanitary Certificate" value="SANITARY_CERT" />
                <el-option label="Other" value="OTHER" />
              </el-select>
            </el-form-item>
            <el-form-item label="File">
              <el-upload
                drag action="#" :auto-upload="false"
                :on-change="onFileChange" :file-list="fileList"
                accept=".pdf,.jpg,.png,.xlsx"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">Drop file here or <em>click to browse</em></div>
                <div slot="tip" class="el-upload__tip">PDF, JPG, PNG or Excel accepted</div>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width:100%" :loading="uploading" @click="submitUpload(true)">
                Upload &amp; AI Verify
              </el-button>
              <el-button style="width:100%;margin-top:6px;margin-left:0" @click="submitUpload(false)">
                Simulate Mismatch
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- AI Verification Result -->
        <el-card v-if="aiResult">
          <div slot="header" class="card-hdr">
            <span>AI Verification Result</span>
            <el-button type="text" size="mini" icon="el-icon-close" @click="aiResult=null;showUpload=false" />
          </div>

          <!-- Success -->
          <div v-if="aiResult.matched" class="ai-result ai-match">
            <div class="ai-icon"><i class="el-icon-circle-check"></i></div>
            <div class="ai-body">
              <div class="ai-title">Document Verified ✓</div>
              <div class="ai-msg">{{ aiResult.message }}</div>
              <div class="ai-fields">
                <el-tag size="mini" type="success" v-for="f in aiResult.matchedFields" :key="f" style="margin:2px">
                  <i class="el-icon-check"></i> {{ f }}
                </el-tag>
              </div>
              <el-button type="success" size="mini" style="margin-top:10px;width:100%" @click="saveDoc(true)">
                Save as Verified
              </el-button>
            </div>
          </div>

          <!-- Mismatch -->
          <div v-else class="ai-result ai-mismatch">
            <div class="ai-icon"><i class="el-icon-warning"></i></div>
            <div class="ai-body">
              <div class="ai-title">Mismatch Detected</div>
              <div class="ai-msg">{{ aiResult.message }}</div>
              <div class="ai-fields">
                <el-tag size="mini" type="danger" v-for="f in aiResult.mismatchedFields" :key="f" style="margin:2px">
                  <i class="el-icon-close"></i> {{ f }}
                </el-tag>
              </div>
              <el-divider />
              <div style="font-size:12px;color:#666;margin-bottom:8px">How would you like to proceed?</div>
              <el-button size="mini" style="width:100%;" @click="discardDoc">
                <i class="el-icon-delete"></i> Discard &amp; Re-upload
              </el-button>
              <el-button size="mini" type="warning" style="width:100%;margin-top:6px;margin-left:0" @click="saveDoc(false)">
                <i class="el-icon-warning-outline"></i> Save Anyway (mark Unverified)
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  name: 'DocumentUpload',
  data() {
    return {
      selectedHbl: 'MOOV240001',
      showUpload: false,
      uploading: false,
      aiResult: null,
      fileList: [],
      form: { docType: '' },
      hblList: [
        { value:'MOOV240001', label:'MOOV240001 – Shanghai Textile Co.' },
        { value:'MOOV240002', label:'MOOV240002 – Dhaka Garments Ltd.' },
        { value:'MOOV240003', label:'MOOV240003 – Ho Chi Minh Apparel' },
      ],
      hblMap: {
        MOOV240001: { supplier:'Shanghai Textile Co.', pol:'CNSHA', pod:'PLGDN', etd:'2024-11-10', eta:'2024-12-05' },
        MOOV240002: { supplier:'Dhaka Garments Ltd.',  pol:'BGCGP', pod:'DEHAM', etd:'2024-11-12', eta:'2024-12-15' },
        MOOV240003: { supplier:'Ho Chi Minh Apparel',  pol:'VNSGN', pod:'CZPRE', etd:'2024-11-08', eta:'2024-12-02' },
      },
      documents: [
        { id:1, docType:'COMMERCIAL_INVOICE', docTypeLabel:'Commercial Invoice', fileName:'INV-2024-00123.pdf', version:1, status:'VERIFIED', uploadedAt:'2024-11-11 09:23' },
        { id:2, docType:'PACKING_LIST',       docTypeLabel:'Packing List',        fileName:'PL-2024-00123.pdf',  version:1, status:'VERIFIED', uploadedAt:'2024-11-11 09:25' },
        { id:3, docType:'BILL_OF_LADING',     docTypeLabel:'Bill of Lading',      fileName:'HBL-MOOV240001.pdf', version:2, status:'VERIFIED', uploadedAt:'2024-11-12 14:10', isRevision:true },
        { id:4, docType:'CERTIFICATE_OF_ORIGIN', docTypeLabel:'Certificate of Origin', fileName:'CO-2024-00123.pdf', version:1, status:'UNVERIFIED', uploadedAt:'2024-11-12 16:45' },
      ]
    }
  },
  computed: {
    hblInfo() { return this.hblMap[this.selectedHbl] }
  },
  methods: {
    onHblChange() { this.showUpload = false; this.aiResult = null },
    onFileChange(file, list) { this.fileList = list },
    submitUpload(matched) {
      if (!this.form.docType) { this.$message.warning('Please select a document type'); return }
      this.uploading = true
      setTimeout(() => {
        this.uploading = false
        this.showUpload = false
        this.aiResult = matched
          ? { matched:true,  confidence:0.97, matchedFields:['Invoice No','HBL No','Supplier Name'],  message:'Document verified. Invoice INV-2024-00567 matches HBL MOOV240001.' }
          : { matched:false, confidence:0.12, mismatchedFields:['Invoice No','HBL No'], message:'Mismatch: Invoice INV-2024-99999 does not match HBL MOOV240001. Expected reference MOOV240001-INV.' }
      }, 1400)
    },
    saveDoc(verified) {
      this.documents.push({
        id: Date.now(), docType: this.form.docType,
        docTypeLabel: this.form.docType.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),
        fileName: `DOC-${Date.now()}.pdf`, version:1,
        status: verified ? 'VERIFIED' : 'UNVERIFIED',
        uploadedAt: new Date().toLocaleString()
      })
      this.$message.success(verified ? 'Document saved as Verified' : 'Document saved as Unverified – OHA review required')
      this.aiResult = null; this.form.docType = ''; this.fileList = []
    },
    discardDoc() {
      this.aiResult = null; this.showUpload = true
      this.$message.info('Document discarded. Please re-upload the correct file.')
    }
  }
}
</script>

<style lang="scss" scoped>
.card-hdr { display:flex; justify-content:space-between; align-items:center; font-weight:600; }

.ai-result { display:flex; gap:12px; padding:4px 0; }
.ai-icon { font-size:32px; flex-shrink:0; padding-top:2px; }
.ai-match .ai-icon { color:$status-verified; }
.ai-mismatch .ai-icon { color:$status-rejected; }
.ai-title { font-weight:700; font-size:14px; margin-bottom:4px; }
.ai-match .ai-title { color:darken($status-verified, 10%); }
.ai-mismatch .ai-title { color:$status-rejected; }
.ai-msg { font-size:12px; color:$text-secondary; margin-bottom:8px; line-height:1.5; }
.ai-body { flex:1; }
</style>
