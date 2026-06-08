<template>
  <div class="app-container">
    <el-card style="margin-bottom:12px">
      <div slot="header" class="card-hdr">
        <span>Shipments Ready for Customs Clearance</span>
        <el-tag type="success" size="small">{{ shipments.length }} ready</el-tag>
      </div>
      <el-alert type="info" :closable="false" show-icon style="margin-bottom:14px">
        <span>The following shipments have completed all Pepco document checks and have been assigned to your agency. Download the full document package to proceed with customs clearance.</span>
      </el-alert>

      <div v-for="s in shipments" :key="s.id" class="shipment-block">
        <div class="shipment-hdr">
          <div class="shipment-meta">
            <span class="hbl-no">{{ s.hblNo }}</span>
            <span class="supplier">{{ s.supplierName }}</span>
            <el-tag size="mini" type="success" style="margin-left:8px">Docs Ready</el-tag>
          </div>
          <div class="shipment-actions">
            <el-checkbox v-model="s.allSelected" @change="v => toggleAll(s, v)" style="margin-right:10px">
              Select All ({{ s.documents.length }})
            </el-checkbox>
            <el-button type="primary" size="mini" icon="el-icon-download" :disabled="!hasSelected(s)" @click="download(s)">
              Download Selected
            </el-button>
          </div>
        </div>

        <el-descriptions :column="4" size="mini" border style="margin-bottom:10px">
          <el-descriptions-item label="POD">{{ s.pod }}</el-descriptions-item>
          <el-descriptions-item label="ETA">{{ s.eta }}</el-descriptions-item>
          <el-descriptions-item label="Docs Ready">{{ s.docsReadyAt }}</el-descriptions-item>
          <el-descriptions-item label="Notified">{{ s.brokerNotifiedAt }}</el-descriptions-item>
        </el-descriptions>

        <el-table :data="s.documents" size="mini" stripe border>
          <el-table-column width="40" align="center">
            <template #default="{row}">
              <el-checkbox v-model="row.selected" @change="updateAllSelected(s)" />
            </template>
          </el-table-column>
          <el-table-column label="Document Type" prop="docType" min-width="170">
            <template #default="{row}">
              <i class="el-icon-document" style="color:#004F7C;margin-right:4px"></i>{{ row.docType }}
            </template>
          </el-table-column>
          <el-table-column label="File Name" prop="fileName" min-width="180" />
          <el-table-column label="Size" prop="fileSize" width="80" align="right" />
          <el-table-column label="Verified" width="90" align="center">
            <template>
              <span class="status-badge verified"><i class="el-icon-check"></i> Verified</span>
            </template>
          </el-table-column>
          <el-table-column label="" width="70" align="center">
            <template #default="{row}">
              <el-button type="text" size="mini" icon="el-icon-view">Preview</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'BrokerDownload',
  data() {
    return {
      shipments: [
        {
          id:5, hblNo:'MOOV240005', supplierName:'Mumbai Textiles Pvt', pod:'HUBU', eta:'2024-11-28',
          docsReadyAt:'2024-11-20 14:30', brokerNotifiedAt:'2024-11-20 14:32',
          allSelected: false,
          documents: [
            { id:1, docType:'Commercial Invoice',    fileName:'INV-2024-00456.pdf', fileSize:'245 KB', selected:false },
            { id:2, docType:'Packing List',          fileName:'PL-2024-00456.pdf',  fileSize:'187 KB', selected:false },
            { id:3, docType:'Bill of Lading',        fileName:'HBL-MOOV240005.pdf', fileSize:'312 KB', selected:false },
            { id:4, docType:'Certificate of Origin', fileName:'CO-2024-00456.pdf',  fileSize:'156 KB', selected:false },
          ]
        },
        {
          id:7, hblNo:'MOOV240007', supplierName:'Colombo Garments Ltd.', pod:'SKBTS', eta:'2024-12-01',
          docsReadyAt:'2024-11-19 09:15', brokerNotifiedAt:'2024-11-19 09:17',
          allSelected: false,
          documents: [
            { id:5, docType:'Commercial Invoice', fileName:'INV-2024-00789.pdf', fileSize:'198 KB', selected:false },
            { id:6, docType:'Packing List',       fileName:'PL-2024-00789.pdf',  fileSize:'143 KB', selected:false },
            { id:7, docType:'Bill of Lading',     fileName:'HBL-MOOV240007.pdf', fileSize:'289 KB', selected:false },
          ]
        }
      ]
    }
  },
  methods: {
    toggleAll(s, v) { s.documents.forEach(d => d.selected = v) },
    updateAllSelected(s) { s.allSelected = s.documents.every(d => d.selected) },
    hasSelected(s) { return s.documents.some(d => d.selected) },
    download(s) {
      const count = s.documents.filter(d => d.selected).length
      this.$message.success(`Downloading ${count} document${count>1?'s':''} for ${s.hblNo}…`)
      setTimeout(() => this.$message.info('In a real system, a ZIP file would be downloaded here.'), 1200)
    }
  }
}
</script>

<style lang="scss" scoped>
.card-hdr { display:flex; justify-content:space-between; align-items:center; font-weight:600; }
.shipment-block { border:1px solid $border; border-radius:8px; padding:14px; margin-bottom:14px; background:#fff; }
.shipment-hdr { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
.shipment-meta { display:flex; align-items:center; gap:8px; }
.hbl-no { font-weight:700; font-size:14px; color:$primary; }
.supplier { font-size:13px; color:$text-secondary; }
.shipment-actions { display:flex; align-items:center; }
</style>
