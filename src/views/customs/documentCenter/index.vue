<template>
  <div class="app-container">

    <!-- ── Top bar: search + view switch + filters ───────────────────────── -->
    <el-card class="dc-topbar">
      <div class="dc-topbar-row">
        <el-autocomplete
          v-model="searchQ"
          :fetch-suggestions="fetchSuggest"
          placeholder="Search by PO / HBL / MBL / Container No. or file name…"
          prefix-icon="el-icon-search"
          size="mini" clearable style="width:340px"
          @select="s => searchQ = s.value"
        />
        <el-radio-group v-model="view" size="mini">
          <el-radio-button label="shipment">Shipment View</el-radio-button>
          <el-radio-button label="document">Document View</el-radio-button>
        </el-radio-group>
        <el-select v-model="filterTypes" size="mini" multiple collapse-tags placeholder="Doc Type" style="width:180px">
          <el-option v-for="t in docTypes" :key="t" :label="t" :value="t" />
        </el-select>
        <el-select v-model="filterStatuses" size="mini" multiple collapse-tags placeholder="Status" style="width:190px">
          <el-option v-for="(s, k) in statusMap" :key="k" :label="s.label" :value="k" />
        </el-select>
        <el-switch v-model="pendingMine" active-text="Pending my action" style="margin-left:auto" />
      </div>
      <div class="dc-rolehint">
        <i class="el-icon-user"></i>
        Viewing as <strong>{{ role }}</strong> —
        <template v-if="isSupplier">your POs; rejected documents need your re-upload</template>
        <template v-else-if="isBroker">your assigned HBLs; use Download All to package the latest files</template>
        <template v-else>all shipments; documents pending review are highlighted</template>
      </div>
    </el-card>

    <!-- ════════════════ SHIPMENT VIEW (HBL-anchored) ════════════════ -->
    <template v-if="view === 'shipment'">
      <el-card v-for="grp in shipmentGroups" :key="grp.key" class="hbl-card">
        <!-- HBL header row -->
        <div class="hbl-row" @click="toggleHbl(grp.key)">
          <i :class="expandedHbls[grp.key] ? 'el-icon-arrow-down' : 'el-icon-arrow-right'" class="hbl-caret"></i>
          <span class="hbl-no">{{ grp.title }}</span>
          <span v-if="grp.unassigned" class="hbl-unassigned-tag">POs not yet linked to a HBL</span>
          <template v-else>
            <span class="ent-chips">
              <el-tag v-for="po in grp.poIds.slice(0,3)" :key="po" size="mini" class="chip chip-po">{{ po }}</el-tag>
              <el-tag v-if="grp.poIds.length > 3" size="mini" class="chip">+{{ grp.poIds.length - 3 }}</el-tag>
            </span>
            <span class="hbl-meta">MBL <strong>{{ grp.mblId }}</strong></span>
            <span class="ent-chips">
              <el-tag v-for="c in grp.containerIds" :key="c" size="mini" class="chip chip-cont">{{ c }}</el-tag>
            </span>
          </template>
          <span class="hbl-completeness" :class="{ full: grp.uploaded >= grp.required }">
            <i class="el-icon-folder-checked"></i> {{ grp.uploaded }}/{{ grp.required }} docs
          </span>
          <span class="hbl-badges">
            <span v-if="grp.counts.REJECTED" class="cnt-badge b-rejected">{{ grp.counts.REJECTED }} Rejected</span>
            <span v-if="grp.counts.PENDING_REREVIEW" class="cnt-badge b-rereview">{{ grp.counts.PENDING_REREVIEW }} Re-review</span>
            <span v-if="grp.counts.PENDING_REVIEW" class="cnt-badge b-pending">{{ grp.counts.PENDING_REVIEW }} Pending</span>
            <span v-if="grp.counts.APPROVED" class="cnt-badge b-approved">{{ grp.counts.APPROVED }} Approved</span>
          </span>
          <span class="hbl-updated">{{ grp.lastUpdated }}</span>
          <span class="hbl-actions" @click.stop>
            <el-tag v-if="isBroker && grp.updatedSince" size="mini" type="warning" class="updated-tag">
              ⚠ Updated since your last download
            </el-tag>
            <el-button v-if="canPackage && !grp.unassigned" type="primary" size="mini" icon="el-icon-download"
              @click="openPackage('HBL', grp.key)">Download All</el-button>
          </span>
        </div>

        <!-- Expanded: PO sub-groups -->
        <div v-if="expandedHbls[grp.key]" class="hbl-body">
          <div v-for="poId in grp.poIds" :key="poId" class="po-group">
            <div class="po-row" @click="togglePo(grp.key + '|' + poId)">
              <i :class="expandedPos[grp.key + '|' + poId] ? 'el-icon-arrow-down' : 'el-icon-arrow-right'" class="po-caret"></i>
              <span class="po-title">{{ poId }}</span>
              <span class="po-cartons">({{ poById(poId).cartons }} cartons)</span>
              <span class="po-doccount">{{ docsOfPo(poId).length }} document(s)</span>
              <span class="po-actions" @click.stop>
                <el-button v-if="canUpload" type="text" size="mini" icon="el-icon-upload2" @click="openUpload(poId)">Upload</el-button>
                <el-button v-if="canPackage" type="text" size="mini" icon="el-icon-download" @click="openPackage('PO', poId)">Download All</el-button>
              </span>
            </div>

            <!-- Document rows -->
            <div v-if="expandedPos[grp.key + '|' + poId]" class="doc-list">
              <div v-for="doc in docsOfPoFiltered(poId)" :key="doc.id" class="doc-row">
                <i class="el-icon-document doc-icon"></i>
                <span class="doc-name" @click="openDetail(doc)">
                  {{ doc.docType }}
                  <span class="doc-file">{{ cv(doc).fileName }}</span>
                </span>
                <el-tag size="mini" type="info" class="ver-tag">v{{ cv(doc).v }}</el-tag>
                <span :class="['st-badge', statusMap[doc.status].cls]">{{ statusMap[doc.status].label }}</span>
                <el-tooltip v-if="shared(doc)" placement="top"
                  :content="`Shared across ${entities(doc).hbls.join(', ')} — same document object, any action syncs everywhere`">
                  <span class="shared-tag">🔗 Shared</span>
                </el-tooltip>
                <span class="doc-by">{{ cv(doc).by }} · {{ cv(doc).at }}</span>
                <span class="doc-actions">
                  <el-button type="text" size="mini" icon="el-icon-view" @click="openDetail(doc)">Detail</el-button>
                  <el-button type="text" size="mini" icon="el-icon-download" @click="downloadOne(doc)">Download</el-button>
                  <el-button v-if="canUpload && doc.status === 'REJECTED'" type="text" size="mini"
                    icon="el-icon-refresh-left" class="act-reupload" @click="openReupload(doc)">Re-upload</el-button>
                  <template v-if="canReview && (doc.status === 'PENDING_REVIEW' || doc.status === 'PENDING_REREVIEW')">
                    <el-button type="text" size="mini" icon="el-icon-check" class="act-approve" @click="doApprove(doc)">Approve</el-button>
                    <el-button type="text" size="mini" icon="el-icon-close" class="act-reject" @click="openReject(doc)">Reject</el-button>
                  </template>
                  <el-button v-if="canUpload && doc.status !== 'APPROVED'" type="text" size="mini"
                    icon="el-icon-delete" class="act-delete" @click="doDelete(doc)" />
                </span>
              </div>
              <div v-if="!docsOfPoFiltered(poId).length" class="doc-empty">No documents match the current filters</div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card v-if="!shipmentGroups.length"><div class="doc-empty" style="padding:30px">No shipments match your search / filters</div></el-card>
    </template>

    <!-- ════════════════ DOCUMENT VIEW (flat) ════════════════ -->
    <el-card v-else>
      <el-table :data="flatDocs" size="mini" stripe border :header-cell-style="{background:'#fafafa'}">
        <el-table-column label="Document" min-width="220">
          <template #default="{row}">
            <i class="el-icon-document" style="color:#004F7C;margin-right:4px"></i>
            <span class="doc-name" @click="openDetail(row)">{{ row.docType }}</span>
            <div class="doc-file" style="margin-left:18px">{{ cv(row).fileName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Version" width="70" align="center">
          <template #default="{row}">
            <el-tooltip :content="`${row.versions.length} version(s)`" placement="top">
              <el-tag size="mini" type="info">v{{ cv(row).v }}</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="Status" width="135">
          <template #default="{row}">
            <span :class="['st-badge', statusMap[row.status].cls]">{{ statusMap[row.status].label }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Related Entities" min-width="260">
          <template #default="{row}">
            <el-tag size="mini" class="chip chip-po" style="cursor:pointer" @click="searchQ = row.poId">{{ row.poId }}</el-tag>
            <el-tag v-for="h in entities(row).hbls" :key="h" size="mini" class="chip chip-hbl" style="cursor:pointer" @click="searchQ = h">{{ h }}</el-tag>
            <el-tag v-for="m in entities(row).mbls" :key="m" size="mini" class="chip chip-mbl">{{ m }}</el-tag>
            <el-tag v-for="c in entities(row).containers" :key="c" size="mini" class="chip chip-cont">{{ c }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Uploaded By / At" width="200">
          <template #default="{row}">
            <div style="font-size:11px">{{ cv(row).by }}</div>
            <div style="font-size:11px;color:#999">{{ cv(row).at }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="230" align="center">
          <template #default="{row}">
            <el-button type="text" size="mini" icon="el-icon-view" @click="openDetail(row)">Detail</el-button>
            <el-button v-if="canUpload && row.status === 'REJECTED'" type="text" size="mini" class="act-reupload" @click="openReupload(row)">Re-upload</el-button>
            <template v-if="canReview && (row.status === 'PENDING_REVIEW' || row.status === 'PENDING_REREVIEW')">
              <el-button type="text" size="mini" class="act-approve" @click="doApprove(row)">Approve</el-button>
              <el-button type="text" size="mini" class="act-reject" @click="openReject(row)">Reject</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- ════════════════ Document Detail drawer ════════════════ -->
    <el-drawer :visible.sync="detail.visible" size="640px" :with-header="false">
      <div v-if="detail.doc" class="detail-wrap">
        <div class="detail-hdr">
          <div>
            <div class="detail-title"><i class="el-icon-document"></i> {{ detail.doc.docType }}</div>
            <div class="detail-sub">{{ cv(detail.doc).fileName }}</div>
          </div>
          <span :class="['st-badge', statusMap[detail.doc.status].cls]">{{ statusMap[detail.doc.status].label }}</span>
        </div>

        <!-- Reject reason banner -->
        <div v-if="detail.doc.status === 'REJECTED'" class="reject-banner">
          <i class="el-icon-warning-outline"></i>
          <div><strong>Rejected:</strong> {{ detail.doc.rejectReason }}</div>
        </div>

        <!-- Entities -->
        <div class="detail-section">
          <div class="sec-title">Related Entities</div>
          <el-tag size="mini" class="chip chip-po">{{ detail.doc.poId }}</el-tag>
          <el-tag v-for="h in entities(detail.doc).hbls" :key="h" size="mini" class="chip chip-hbl">{{ h }}</el-tag>
          <el-tag v-for="m in entities(detail.doc).mbls" :key="m" size="mini" class="chip chip-mbl">{{ m }}</el-tag>
          <el-tag v-for="c in entities(detail.doc).containers" :key="c" size="mini" class="chip chip-cont">{{ c }}</el-tag>
          <span v-if="shared(detail.doc)" class="shared-tag" style="margin-left:6px">🔗 Shared across {{ entities(detail.doc).hbls.join(' & ') }}</span>
        </div>

        <!-- Mock preview -->
        <div class="detail-section">
          <div class="sec-title">Preview</div>
          <div class="mini-preview">
            <div class="mp-doc-title">{{ detail.doc.docType }}</div>
            <div class="mp-line"><span>PO Number</span><strong>{{ detail.doc.poId }}</strong></div>
            <div class="mp-line"><span>File</span><strong>{{ cv(detail.doc).fileName }}</strong></div>
            <div class="mp-line"><span>Version</span><strong>v{{ cv(detail.doc).v }}</strong></div>
            <div class="mp-foot">[ Simulated preview — demo ]</div>
          </div>
        </div>

        <!-- Version chain -->
        <div class="detail-section">
          <div class="sec-title">Version History</div>
          <div v-for="v in [...detail.doc.versions].reverse()" :key="v.v" class="ver-row">
            <el-tag size="mini" :type="v.v === cv(detail.doc).v ? 'success' : 'info'">v{{ v.v }}{{ v.v === cv(detail.doc).v ? ' Current' : '' }}</el-tag>
            <span class="ver-file">{{ v.fileName }}</span>
            <span class="ver-meta">{{ v.by }} · {{ v.at }}</span>
            <span v-if="v.remark" class="ver-remark">“{{ v.remark }}”</span>
            <el-button type="text" size="mini" icon="el-icon-download" @click="$message.success(`Downloading ${v.fileName}…`)" />
          </div>
        </div>

        <!-- Activity timeline -->
        <div class="detail-section">
          <div class="sec-title">Activity Timeline</div>
          <el-timeline class="dc-timeline">
            <el-timeline-item v-for="a in activityOf(detail.doc.id)" :key="a.id"
              :timestamp="`${a.at} · ${a.user}`" :type="timelineType(a.action)" size="normal">
              <strong>{{ actionLabel(a.action) }}</strong>
              <span v-if="a.detail" style="color:#666"> — {{ a.detail }}</span>
            </el-timeline-item>
          </el-timeline>
        </div>

        <!-- Phase 2 placeholder -->
        <div class="detail-section phase2-slot">
          <div class="sec-title">Extracted Fields <el-tag size="mini" type="info">Phase 2</el-tag></div>
          <div class="phase2-hint">AI-extracted document fields (and manual correction) will appear here in Phase 2.</div>
        </div>

        <!-- Footer actions -->
        <div class="detail-actions">
          <el-button v-if="canUpload && detail.doc.status === 'REJECTED'" type="warning" size="small" icon="el-icon-refresh-left" @click="openReupload(detail.doc)">Re-upload New Version</el-button>
          <template v-if="canReview && (detail.doc.status === 'PENDING_REVIEW' || detail.doc.status === 'PENDING_REREVIEW')">
            <el-button type="success" size="small" icon="el-icon-check" @click="doApprove(detail.doc)">Approve</el-button>
            <el-button type="danger" size="small" icon="el-icon-close" plain @click="openReject(detail.doc)">Reject</el-button>
          </template>
          <el-button size="small" @click="detail.visible = false">Close</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- ════════════════ Upload / Re-upload dialog ════════════════ -->
    <el-dialog :visible.sync="upload.visible" :title="upload.doc ? `Re-upload — ${upload.doc.docType}` : `Upload Document — ${upload.poId}`"
      width="480px" custom-class="brand-dialog">
      <div v-if="upload.doc && upload.doc.rejectReason" class="reject-banner" style="margin-bottom:12px">
        <i class="el-icon-warning-outline"></i>
        <div><strong>PEPCO reject reason:</strong> {{ upload.doc.rejectReason }}</div>
      </div>
      <el-form label-width="100px" size="mini">
        <el-form-item label="Doc Type">
          <el-select v-if="!upload.doc" v-model="upload.docType" style="width:100%">
            <el-option v-for="t in docTypes" :key="t" :label="t" :value="t" />
          </el-select>
          <el-input v-else :value="upload.doc.docType" disabled />
        </el-form-item>
        <el-form-item label="File">
          <el-upload action="#" :auto-upload="false" :show-file-list="false" :on-change="f => upload.fileName = f.name">
            <el-button size="mini" icon="el-icon-upload2">{{ upload.fileName || 'Choose file…' }}</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="upload.remark" placeholder="Optional — e.g. corrected carton count" />
        </el-form-item>
      </el-form>
      <div v-if="upload.doc" style="font-size:11px;color:#999;margin-left:10px">
        New version will be v{{ cv(upload.doc).v + 1 }} — status auto-flips to Pending Re-review, visible to PEPCO instantly.
      </div>
      <div slot="footer">
        <el-button size="small" @click="upload.visible = false">Cancel</el-button>
        <el-button size="small" type="primary" :disabled="!upload.fileName || (!upload.doc && !upload.docType)" @click="submitUpload">
          {{ upload.doc ? 'Upload New Version' : 'Upload' }}
        </el-button>
      </div>
    </el-dialog>

    <!-- ════════════════ Reject dialog ════════════════ -->
    <el-dialog :visible.sync="reject.visible" title="Reject Document" width="460px" custom-class="brand-dialog">
      <div style="font-size:12px;margin-bottom:8px">
        Rejecting <strong>{{ reject.doc ? reject.doc.docType : '' }}</strong>
        ({{ reject.doc ? cv(reject.doc).fileName : '' }}) — the supplier will be asked to re-upload.
      </div>
      <el-input v-model="reject.reason" type="textarea" :rows="3" placeholder="Reject reason (required)" />
      <div slot="footer">
        <el-button size="small" @click="reject.visible = false">Cancel</el-button>
        <el-button size="small" type="danger" :disabled="!reject.reason.trim()" @click="submitReject">Reject</el-button>
      </div>
    </el-dialog>

    <!-- ════════════════ Package download dialog ════════════════ -->
    <el-dialog :visible.sync="pkg.visible" :title="`Download All — ${pkg.scopeType} ${pkg.scopeId}`" width="640px" custom-class="brand-dialog">
      <template v-if="pkg.state === 'config'">
        <el-checkbox v-model="pkg.onlyApproved" style="margin-bottom:10px">Only approved documents</el-checkbox>
        <el-table :data="pkgDocs" size="mini" border :header-cell-style="{background:'#fafafa'}">
          <el-table-column label="File (zip path)" min-width="240">
            <template #default="{row}">
              <span style="font-family:monospace;font-size:11px">{{ row.poId }}/{{ row.docType.replace(/\s+/g,'') }}_{{ cv(row).fileName.replace(/\.[^.]+$/,'') }}_v{{ cv(row).v }}.pdf</span>
            </template>
          </el-table-column>
          <el-table-column label="Status" width="130">
            <template #default="{row}"><span :class="['st-badge', statusMap[row.status].cls]">{{ statusMap[row.status].label }}</span></template>
          </el-table-column>
          <el-table-column label="Version" width="70" align="center">
            <template #default="{row}">v{{ cv(row).v }}</template>
          </el-table-column>
        </el-table>
        <div style="font-size:11px;color:#999;margin-top:8px">
          <i class="el-icon-document"></i> manifest.csv will be included — file name, doc type, version, status, related PO/HBL/MBL/Container, upload time
        </div>
      </template>
      <template v-else-if="pkg.state === 'packing'">
        <div style="text-align:center;padding:20px">
          <div style="font-size:13px;margin-bottom:14px"><i class="el-icon-loading"></i> Packaging {{ pkgDocs.length }} file(s) as ZIP…</div>
          <el-progress :percentage="pkg.progress" :stroke-width="6" color="#004F7C" />
        </div>
      </template>
      <template v-else>
        <el-alert type="success" :closable="false" show-icon title="Package ready">
          <div style="font-size:12px;margin-top:4px">
            {{ pkg.scopeType }}_{{ pkg.scopeId }}_documents.zip ({{ pkgDocs.length }} files + manifest.csv) — download recorded.
            Any future document update will show an “Updated since your last download” badge on this {{ pkg.scopeType }}.
          </div>
        </el-alert>
      </template>
      <div slot="footer">
        <template v-if="pkg.state === 'config'">
          <el-button size="small" @click="pkg.visible = false">Cancel</el-button>
          <el-button size="small" type="primary" icon="el-icon-download" :disabled="!pkgDocs.length" @click="startPackage">Start Packaging</el-button>
        </template>
        <el-button v-else-if="pkg.state === 'done'" size="small" type="primary" @click="pkg.visible = false">Close</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { roleStore } from '@/store/role'
import {
  docStore, DOC_TYPES, DOC_STATUS, REQUIRED_TYPES,
  poById, docsForPo, docsForHbl, unassignedPos, entitiesForDoc, isShared, currentVersion,
  addDocument, addVersion, approveDoc, rejectDoc, softDeleteDoc,
  activityForDoc, recordPackageDownload, hblUpdatedSinceDownload, searchScope, searchSuggest,
} from '@/store/documents'

export default {
  name: 'DocumentCenter',
  data() {
    return {
      view: 'shipment',
      searchQ: '',
      filterTypes: [],
      filterStatuses: [],
      pendingMine: false,
      expandedHbls: { 'HBL-001': true },
      expandedPos: { 'HBL-001|PO-001': true },

      detail: { visible: false, doc: null },
      upload: { visible: false, poId: '', doc: null, docType: '', fileName: '', remark: '' },
      reject: { visible: false, doc: null, reason: '' },
      pkg: { visible: false, scopeType: 'HBL', scopeId: '', onlyApproved: true, state: 'config', progress: 0 },

      docTypes: DOC_TYPES,
      statusMap: DOC_STATUS,
    }
  },

  computed: {
    role() { return roleStore.currentRole },
    isSupplier() { return this.role === 'Supplier' },
    isBroker() { return this.role === 'Customs Broker' },
    isOps() { return this.role === 'MOOV Ops' },
    isPepco() { return ['Pepco PGS', 'Pepco Finance', 'Pepco Customs'].includes(this.role) },
    canUpload() { return this.isSupplier || this.isOps },
    canReview() { return this.isPepco || this.isOps },
    canPackage() { return this.isBroker || this.isPepco || this.isOps },

    searchHit() { return searchScope(this.searchQ) },

    // HBL groups + "Unassigned to HBL" pseudo group, role-trimmed and search-filtered
    shipmentGroups() {
      let hbls = docStore.hbls
      if (this.isBroker) hbls = hbls.filter(h => docStore.brokerAssignedHbls.includes(h.id))
      let groups = hbls.map(h => this.mkGroup(h))

      const un = unassignedPos()
      if (un.length && !this.isBroker) {
        groups.push(this.mkGroup({
          id: 'UNASSIGNED', poIds: un.map(p => p.id), containerIds: [], mblId: '',
        }, true))
      }

      if (this.searchHit) groups = groups.filter(g => g.unassigned
        ? g.poIds.some(po => docsForPo(po).some(d => this.searchHit.docIds.has(d.id)))
        : this.searchHit.hblIds.has(g.key))

      // groups with documents needing action first
      return groups.sort((a, b) => this.actionWeight(b) - this.actionWeight(a))
    },

    flatDocs() {
      let docs = docStore.documents.filter(d => !d.deleted)
      if (this.isBroker) {
        const visible = new Set(docStore.brokerAssignedHbls.flatMap(h => docsForHbl(h).map(d => d.id)))
        docs = docs.filter(d => visible.has(d.id))
      }
      if (this.searchHit) docs = docs.filter(d => this.searchHit.docIds.has(d.id))
      docs = docs.filter(d => this.passFilters(d))
      return [...docs].sort((a, b) => this.docWeight(b) - this.docWeight(a))
    },

    pkgDocs() {
      if (!this.pkg.scopeId) return []
      let docs = this.pkg.scopeType === 'HBL' ? docsForHbl(this.pkg.scopeId) : docsForPo(this.pkg.scopeId)
      if (this.pkg.onlyApproved) docs = docs.filter(d => d.status === 'APPROVED')
      return docs
    },
  },

  watch: {
    // expand matched HBLs automatically when searching
    searchQ() {
      if (!this.searchHit) return
      this.searchHit.hblIds.forEach(h => this.$set(this.expandedHbls, h, true))
      this.shipmentGroups.forEach(g => g.poIds.forEach(po => this.$set(this.expandedPos, g.key + '|' + po, true)))
    },
  },

  methods: {
    poById, cv: currentVersion, shared: isShared, entities: entitiesForDoc, activityOf: activityForDoc,

    mkGroup(hbl, unassigned = false) {
      const docs = hbl.poIds.flatMap(po => docsForPo(po))
      const counts = { PENDING_REVIEW: 0, PENDING_REREVIEW: 0, APPROVED: 0, REJECTED: 0 }
      docs.forEach(d => counts[d.status]++)
      const required = hbl.poIds.length * REQUIRED_TYPES.length
      const uploaded = hbl.poIds.reduce((n, po) =>
        n + REQUIRED_TYPES.filter(t => docsForPo(po).some(d => d.docType === t)).length, 0)
      const lastUpdated = docs.map(d => currentVersion(d).at).sort().pop() || '—'
      return {
        key: hbl.id, title: unassigned ? 'Unassigned to HBL' : hbl.id, unassigned,
        poIds: hbl.poIds, containerIds: hbl.containerIds, mblId: hbl.mblId,
        counts, required, uploaded, lastUpdated,
        updatedSince: unassigned ? false : hblUpdatedSinceDownload(hbl.id),
      }
    },

    actionWeight(g) {
      if (this.isSupplier) return g.counts.REJECTED * 10
      if (this.isBroker) return g.updatedSince ? 10 : 0
      return g.counts.PENDING_REREVIEW * 10 + g.counts.PENDING_REVIEW
    },
    docWeight(d) {
      if (this.isSupplier) return d.status === 'REJECTED' ? 10 : 0
      return { PENDING_REREVIEW: 10, PENDING_REVIEW: 8, REJECTED: 5, APPROVED: 0 }[d.status] || 0
    },

    passFilters(d) {
      if (this.filterTypes.length && !this.filterTypes.includes(d.docType)) return false
      if (this.filterStatuses.length && !this.filterStatuses.includes(d.status)) return false
      if (this.pendingMine) {
        if (this.isSupplier && d.status !== 'REJECTED') return false
        if ((this.isPepco || this.isOps) && !['PENDING_REVIEW', 'PENDING_REREVIEW'].includes(d.status)) return false
      }
      return true
    },

    docsOfPo(poId) { return docsForPo(poId) },
    docsOfPoFiltered(poId) {
      let docs = docsForPo(poId)
      if (this.searchHit) docs = docs.filter(d => this.searchHit.docIds.has(d.id))
      return docs.filter(d => this.passFilters(d))
    },

    toggleHbl(k) { this.$set(this.expandedHbls, k, !this.expandedHbls[k]) },
    togglePo(k) { this.$set(this.expandedPos, k, !this.expandedPos[k]) },

    fetchSuggest(q, cb) { cb(searchSuggest(q).map(v => ({ value: v }))) },

    userName() {
      return { 'Supplier': 'Zhang (Supplier)', 'Customs Broker': 'EuroCustoms (Broker)' }[this.role]
        || `${this.role.replace('Pepco ', '')} (PEPCO)`
    },

    // ── Detail ──
    openDetail(doc) { this.detail = { visible: true, doc } },

    // ── Upload / Re-upload ──
    openUpload(poId) { this.upload = { visible: true, poId, doc: null, docType: '', fileName: '', remark: '' } },
    openReupload(doc) { this.upload = { visible: true, poId: doc.poId, doc, docType: doc.docType, fileName: '', remark: '' } },
    submitUpload() {
      const u = this.upload
      if (u.doc) {
        addVersion(u.doc.id, { fileName: u.fileName, remark: u.remark, user: this.userName() })
        this.$message.success(`New version uploaded — status flipped to Pending Re-review, PEPCO can re-check now`)
      } else {
        addDocument({ poId: u.poId, docType: u.docType, fileName: u.fileName, remark: u.remark, user: this.userName() })
        this.$message.success(`Document uploaded to ${u.poId} (v1, Pending Review)`)
      }
      this.upload.visible = false
    },

    // ── Review ──
    doApprove(doc) {
      approveDoc(doc.id, this.userName())
      this.$message.success(`${doc.docType} approved${isShared(doc) ? ' — synced across all linked HBLs' : ''}`)
    },
    openReject(doc) { this.reject = { visible: true, doc, reason: '' } },
    submitReject() {
      rejectDoc(this.reject.doc.id, this.reject.reason.trim(), this.userName())
      this.$message.warning(`${this.reject.doc.docType} rejected — supplier notified to re-upload`)
      this.reject.visible = false
    },

    doDelete(doc) {
      this.$confirm(`Void ${doc.docType} (${currentVersion(doc).fileName})? This soft-deletes the document; the action is logged.`, 'Delete Document', {
        type: 'warning', confirmButtonText: 'Delete', cancelButtonText: 'Cancel',
      }).then(() => {
        softDeleteDoc(doc.id, this.userName())
        this.$message.success('Document voided')
      }).catch(() => {})
    },

    downloadOne(doc) { this.$message.success(`Downloading ${currentVersion(doc).fileName}…`) },

    // ── Package download ──
    openPackage(scopeType, scopeId) {
      this.pkg = { visible: true, scopeType, scopeId, onlyApproved: true, state: 'config', progress: 0 }
    },
    startPackage() {
      this.pkg.state = 'packing'; this.pkg.progress = 0
      const timer = setInterval(() => {
        this.pkg.progress = Math.min(100, this.pkg.progress + 20)
        if (this.pkg.progress >= 100) {
          clearInterval(timer)
          recordPackageDownload(this.pkg.scopeType, this.pkg.scopeId, this.pkgDocs, this.userName())
          this.pkg.state = 'done'
        }
      }, 450)
    },

    timelineType(action) {
      return { APPROVE: 'success', REJECT: 'danger', NEW_VERSION: 'warning', UPLOAD: 'primary', DOWNLOAD: 'info', DELETE: 'danger' }[action] || 'info'
    },
    actionLabel(action) {
      return { UPLOAD: 'Uploaded', APPROVE: 'Approved', REJECT: 'Rejected', NEW_VERSION: 'New version', DOWNLOAD: 'Downloaded', DELETE: 'Voided' }[action] || action
    },
  },
}
</script>

<style lang="scss" scoped>
// ── Top bar ──────────────────────────────────────────────────────────────────
.dc-topbar { margin-bottom: 12px; ::v-deep .el-card__body { padding: 12px 16px; } }
.dc-topbar-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.dc-rolehint {
  margin-top: 8px; font-size: 11px; color: #888;
  i { color: $primary; margin-right: 2px; }
  strong { color: $primary; }
}

// ── HBL card / row ───────────────────────────────────────────────────────────
.hbl-card { margin-bottom: 10px; ::v-deep .el-card__body { padding: 0; } }
.hbl-row {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px; cursor: pointer;
  &:hover { background: #f8fafc; }
}
.hbl-caret { color: #909399; font-size: 13px; flex-shrink: 0; }
.hbl-no { font-weight: 700; color: $primary; font-size: 13px; white-space: nowrap; }
.hbl-unassigned-tag { font-size: 11px; color: #e6a817; }
.hbl-meta { font-size: 11px; color: #666; white-space: nowrap; strong { color: #333; } }
.ent-chips { display: flex; gap: 4px; flex-wrap: wrap; }
.chip { font-size: 10px; border: none; }
.chip-po   { background: #ecf5ff; color: #3A71A8; }
.chip-hbl  { background: #fdf3e3; color: #c25e00; }
.chip-mbl  { background: #fce8f0; color: #c2185b; }
.chip-cont { background: #e6f9ef; color: #0d9b50; }
.hbl-completeness {
  font-size: 11px; font-weight: 600; color: #e6a817; white-space: nowrap;
  &.full { color: #13ce66; }
}
.hbl-badges { display: flex; gap: 4px; flex-wrap: wrap; }
.cnt-badge {
  font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 9px; white-space: nowrap;
  &.b-rejected { background: #fff0f0; color: #ff4949; }
  &.b-rereview { background: #fdf3e3; color: #c25e00; }
  &.b-pending  { background: #ecf5ff; color: #3A71A8; }
  &.b-approved { background: #e6f9ef; color: #0d9b50; }
}
.hbl-updated { font-size: 10px; color: #bbb; margin-left: auto; white-space: nowrap; }
.hbl-actions { display: flex; align-items: center; gap: 6px; }
.updated-tag { font-size: 10px; }

// ── PO sub-group ─────────────────────────────────────────────────────────────
.hbl-body { border-top: 1px solid $border; padding: 6px 16px 12px 34px; }
.po-group { margin-top: 6px; }
.po-row {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 10px; background: #f8fafc; border-radius: 6px; cursor: pointer;
  &:hover { background: #f0f4f8; }
}
.po-caret { color: #909399; font-size: 12px; }
.po-title { font-weight: 600; font-size: 12px; color: #333; }
.po-cartons { font-size: 11px; color: #999; }
.po-doccount { font-size: 10px; color: #bbb; }
.po-actions { margin-left: auto; display: flex; gap: 0; }

// ── Document rows ────────────────────────────────────────────────────────────
.doc-list { padding: 4px 0 4px 26px; }
.doc-row {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; border-bottom: 1px dashed #eef1f5; font-size: 12px;
  &:last-child { border-bottom: none; }
  &:hover { background: #fcfdfe; }
}
.doc-icon { color: $primary; }
.doc-name { font-weight: 600; cursor: pointer; color: #333; &:hover { color: $primary; } }
.doc-file { font-size: 11px; color: #999; font-weight: 400; margin-left: 4px; }
.ver-tag { flex-shrink: 0; }
.st-badge {
  font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 9px; white-space: nowrap;
  &.st-pending  { background: #ecf5ff; color: #3A71A8; }
  &.st-rereview { background: #fdf3e3; color: #c25e00; }
  &.st-approved { background: #e6f9ef; color: #0d9b50; }
  &.st-rejected { background: #fff0f0; color: #ff4949; }
}
.shared-tag { font-size: 10px; color: #7b1fa2; background: #f3e5f5; padding: 2px 7px; border-radius: 9px; cursor: help; white-space: nowrap; }
.doc-by { font-size: 10px; color: #bbb; margin-left: auto; white-space: nowrap; }
.doc-actions { display: flex; gap: 0; flex-shrink: 0; }
.act-approve  ::v-deep span, .act-approve  { color: #13ce66 !important; }
.act-reject   ::v-deep span, .act-reject   { color: #ff4949 !important; }
.act-reupload ::v-deep span, .act-reupload { color: #e6a817 !important; }
.act-delete   ::v-deep span, .act-delete   { color: #ff4949 !important; }
.doc-empty { font-size: 11px; color: #c0c4cc; padding: 8px 12px; text-align: center; }

// ── Detail drawer ────────────────────────────────────────────────────────────
.detail-wrap { padding: 20px 22px; overflow-y: auto; height: 100%; }
.detail-hdr { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
.detail-title { font-size: 15px; font-weight: 700; color: $primary; i { margin-right: 4px; } }
.detail-sub { font-size: 11px; color: #999; margin-top: 3px; }
.detail-section { margin-bottom: 16px; }
.sec-title { font-size: 11px; font-weight: 700; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 7px; }
.reject-banner {
  display: flex; gap: 8px; align-items: flex-start;
  background: #fff0f0; border: 1px solid #ffa39e; border-radius: 6px;
  padding: 9px 12px; font-size: 12px; color: #8c2e2b; margin-bottom: 14px;
  i { color: #ff4949; font-size: 15px; margin-top: 1px; }
}
.mini-preview {
  border: 1px solid $border; border-radius: 6px; padding: 16px; background: #fff;
}
.mp-doc-title { font-weight: 700; font-size: 14px; border-bottom: 2px solid $primary; padding-bottom: 6px; margin-bottom: 10px; }
.mp-line { display: flex; gap: 10px; font-size: 12px; padding: 2px 0; span { color: #999; width: 90px; } }
.mp-foot { text-align: center; color: #ccc; font-size: 10px; font-style: italic; margin-top: 10px; }
.ver-row {
  display: flex; align-items: center; gap: 8px; font-size: 12px;
  padding: 6px 10px; background: #f8fafc; border-radius: 6px; margin-bottom: 4px;
}
.ver-file { font-weight: 600; }
.ver-meta { font-size: 10px; color: #999; }
.ver-remark { font-size: 11px; color: #c25e00; font-style: italic; }
.dc-timeline { padding-left: 2px; ::v-deep .el-timeline-item__content { font-size: 12px; } ::v-deep .el-timeline-item__timestamp { font-size: 10px; } }
.phase2-slot { border: 1px dashed #d3dce6; border-radius: 6px; padding: 12px; background: #fafbfc; }
.phase2-hint { font-size: 11px; color: #aab; }
.detail-actions { display: flex; gap: 8px; justify-content: flex-end; border-top: 1px solid $border; padding-top: 14px; }

// ── Brand dialog header ──────────────────────────────────────────────────────
::v-deep .brand-dialog .el-dialog__header {
  background: $primary; padding: 12px 20px;
  .el-dialog__title { color: #fff; font-size: 14px; font-weight: 600; }
  .el-dialog__headerbtn .el-dialog__close { color: #fff; }
}
</style>
