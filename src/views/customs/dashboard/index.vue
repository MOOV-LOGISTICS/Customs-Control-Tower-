<template>
  <div class="app-container">

    <!-- KPI Cards -->
    <el-row :gutter="12" style="margin-bottom:16px">
      <el-col :span="6" v-for="kpi in kpis" :key="kpi.label">
        <el-card class="kpi-card">
          <div class="kpi-icon" :style="{background: kpi.bg}"><i :class="kpi.icon" :style="{color: kpi.color}"></i></div>
          <div class="kpi-body">
            <div class="kpi-value">{{ kpi.value }}</div>
            <div class="kpi-label">{{ kpi.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Shipment table -->
    <el-card>
      <div slot="header" class="card-hdr">
        <span>Customs Shipments</span>
        <div style="display:flex;gap:8px;align-items:center">
          <el-input v-model="search" placeholder="Search HBL / supplier..." prefix-icon="el-icon-search" size="mini" style="width:220px" clearable />
          <el-select v-model="filterStatus" size="mini" placeholder="All statuses" clearable style="width:150px">
            <el-option v-for="s in statuses" :key="s.value" :label="s.label" :value="s.value" />
          </el-select>
        </div>
      </div>

      <el-table :data="filteredRows" size="mini" stripe border style="width:100%">
        <el-table-column label="HBL No" prop="hblNo" width="120">
          <template #default="{row}">
            <span class="link" @click="goTo(row)">{{ row.hblNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Supplier" prop="supplierName" min-width="160" />
        <el-table-column label="POL" prop="pol" width="75" />
        <el-table-column label="POD" prop="pod" width="75" />
        <el-table-column label="ETD" prop="etd" width="95" />
        <el-table-column label="ETA" prop="eta" width="95" />
        <el-table-column label="Customs Status" width="170">
          <template #default="{row}">
            <span :class="['status-badge', statusClass(row.customsStatus)]">{{ statusLabel(row.customsStatus) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Broker" prop="brokerName" min-width="160" />
        <el-table-column label="Actions" width="80" align="center">
          <template #default="{row}">
            <el-button type="text" size="mini" icon="el-icon-view" @click="goTo(row)" />
          </template>
        </el-table-column>
      </el-table>

      <div style="text-align:right;margin-top:10px">
        <el-pagination layout="total, prev, pager, next" :total="filteredRows.length" :page-size="10" small />
      </div>
    </el-card>

  </div>
</template>

<script>
const ROWS = [
  { id:1, hblNo:'MOOV240001', supplierName:'Shanghai Textile Co.', pol:'CNSHA', pod:'PLGDN', etd:'2024-11-10', eta:'2024-12-05', customsStatus:'DOCS_PENDING',  brokerName:'EuroCustoms Sp.z.o.o.' },
  { id:2, hblNo:'MOOV240002', supplierName:'Dhaka Garments Ltd.',  pol:'BGCGP', pod:'DEHAM', etd:'2024-11-12', eta:'2024-12-15', customsStatus:'PGS_REVIEW',    brokerName:'Hamburg Customs GmbH' },
  { id:3, hblNo:'MOOV240003', supplierName:'Ho Chi Minh Apparel',  pol:'VNSGN', pod:'CZPRE', etd:'2024-11-08', eta:'2024-12-02', customsStatus:'FINANCE_REVIEW', brokerName:'Prague Broker s.r.o.' },
  { id:4, hblNo:'MOOV240004', supplierName:'Istanbul Fashion AS',  pol:'TRIST', pod:'ROBUH', etd:'2024-11-15', eta:'2024-12-10', customsStatus:'CUSTOMS_REVIEW', brokerName:'Bucharest Customs SRL' },
  { id:5, hblNo:'MOOV240005', supplierName:'Mumbai Textiles Pvt',  pol:'INNSA', pod:'HUBU',  etd:'2024-11-05', eta:'2024-11-28', customsStatus:'DOCS_READY',     brokerName:'Budapest Logistics Kft' },
  { id:6, hblNo:'MOOV240006', supplierName:'Guangzhou Clothing',   pol:'CNGZU', pod:'PLWAW', etd:'2024-11-18', eta:'2024-12-18', customsStatus:'REJECTED',       brokerName:'Warsaw Customs Sp.z.o.o.' },
  { id:7, hblNo:'MOOV240007', supplierName:'Colombo Garments Ltd', pol:'LKCMB', pod:'SKBTS', etd:'2024-11-19', eta:'2024-12-08', customsStatus:'DOCS_READY',     brokerName:'Bratislava Broker s.r.o.' },
  { id:8, hblNo:'MOOV240008', supplierName:'Cairo Apparel Co.',    pol:'EGALY', pod:'ROCTS', etd:'2024-11-20', eta:'2024-12-12', customsStatus:'DOCS_PENDING',   brokerName:'Constanta Customs SRL' },
]

const STATUS_MAP = {
  DOCS_PENDING:  { label:'Docs Pending',    cls:'pending' },
  PGS_REVIEW:    { label:'PGS Review',      cls:'in-progress' },
  FINANCE_REVIEW:{ label:'Finance Review',  cls:'in-progress' },
  CUSTOMS_REVIEW:{ label:'Customs Review',  cls:'in-progress' },
  DOCS_READY:    { label:'Docs Ready',      cls:'completed' },
  REJECTED:      { label:'Rejected',        cls:'rejected' },
}

export default {
  name: 'CustomsDashboard',
  data() {
    return {
      search: '', filterStatus: '',
      rows: ROWS,
      statuses: Object.entries(STATUS_MAP).map(([v,s])=>({value:v, label:s.label})),
      kpis: [
        { label:'Total Shipments',    value: 8,  icon:'el-icon-ship',      color:'#004F7C', bg:'#e8f4fd' },
        { label:'Docs Pending',       value: 2,  icon:'el-icon-document',  color:'#E6A817', bg:'#fff8e0' },
        { label:'Under Review',       value: 3,  icon:'el-icon-finished',  color:'#3A71A8', bg:'#ecf5ff' },
        { label:'Ready for Broker',   value: 2,  icon:'el-icon-download',  color:'#13ce66', bg:'#e6f9ef' },
      ]
    }
  },
  computed: {
    filteredRows() {
      return this.rows.filter(r => {
        const q = this.search.toLowerCase()
        const matchQ = !q || r.hblNo.toLowerCase().includes(q) || r.supplierName.toLowerCase().includes(q)
        const matchS = !this.filterStatus || r.customsStatus === this.filterStatus
        return matchQ && matchS
      })
    }
  },
  methods: {
    statusLabel(s) { return STATUS_MAP[s]?.label || s },
    statusClass(s) { return STATUS_MAP[s]?.cls || 'pending' },
    goTo(row) { this.$router.push('/customs/document-upload') }
  }
}
</script>

<style lang="scss" scoped>
.card-hdr { display:flex; justify-content:space-between; align-items:center; font-weight:600; }
.link { color:$primary; cursor:pointer; font-weight:600; &:hover { text-decoration:underline; } }

.kpi-card ::v-deep .el-card__body {
  display:flex; align-items:center; gap:14px; padding:14px 16px;
}
.kpi-icon {
  width:44px; height:44px; border-radius:10px;
  display:flex; align-items:center; justify-content:center;
  i { font-size:22px; }
}
.kpi-value { font-size:24px; font-weight:700; color:$text-primary; line-height:1.2; }
.kpi-label { font-size:11px; color:$text-secondary; margin-top:2px; }
</style>
