<template>
  <div class="app-container">

    <!-- ── Top bar: search + view switch + filters ───────────────────────── -->
    <el-card class="dc-topbar">
      <div class="dc-topbar-row">
        <el-autocomplete
          v-model="searchQ"
          :fetch-suggestions="fetchSuggest"
          placeholder="Search by Document No. / PO / HBL / MBL / Container or file name…"
          prefix-icon="el-icon-search"
          size="mini" clearable style="width:340px"
          @select="s => searchQ = s.value"
        />
        <el-radio-group v-model="view" size="mini">
          <el-radio-button label="shipment">Shipment View</el-radio-button>
          <el-radio-button label="document">Document View</el-radio-button>
        </el-radio-group>
        <el-tooltip v-if="view === 'shipment'" placement="top"
          :content="userViewMode ? 'Display mode (your preference is remembered)' : 'Auto — small groups show as cards, large ones as a list'">
          <el-radio-group :value="userViewMode" size="mini" @input="setViewMode">
            <el-radio-button label="list"><i class="el-icon-s-fold"></i> List</el-radio-button>
            <el-radio-button label="grid"><i class="el-icon-menu"></i> Grid</el-radio-button>
          </el-radio-group>
        </el-tooltip>
        <el-select v-model="filterTypes" size="mini" multiple collapse-tags placeholder="Doc Type" style="width:180px">
          <el-option v-for="t in docTypes" :key="t" :label="t" :value="t" />
        </el-select>
      </div>
      <div class="dc-rolehint">
        <i class="el-icon-user"></i>
        Viewing as <strong>{{ role }}</strong> —
        <template v-if="isSupplier">your POs; rejected documents need your re-upload</template>
        <template v-else-if="isBroker">your assigned HBLs; use Download All to package the latest files</template>
        <template v-else>all shipments — review &amp; approve actions live in the Pepco Review tab; this page is for tracking and downloads</template>
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
            <span class="ent-chips" @click.stop>
              <el-tooltip v-for="po in headerPos(grp)" :key="po" :content="poFilters[grp.key] === po ? 'Clear filter' : `Show only documents of ${po}`" placement="top">
                <el-tag size="mini" :class="['chip', 'chip-po', 'chip-filter', { active: poFilters[grp.key] === po }]"
                  @click.native="togglePoFilter(grp, po)">{{ po }}</el-tag>
              </el-tooltip>
              <el-tag v-if="grp.poIds.length > 3 && !chipsOpen[grp.key]" size="mini" class="chip chip-filter"
                @click.native="$set(chipsOpen, grp.key, true)">+{{ grp.poIds.length - 3 }}</el-tag>
            </span>
            <span class="hbl-meta">MBL <strong>{{ grp.mblId }}</strong></span>
            <span class="ent-chips">
              <el-tag v-for="c in grp.containerIds" :key="c" size="mini" class="chip chip-cont">{{ c }}</el-tag>
            </span>
          </template>
          <span class="hbl-completeness" :class="{ full: grp.uploaded >= grp.required }">
            <i class="el-icon-folder-checked"></i> {{ grp.uploaded }}/{{ grp.required }} docs
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

        <!-- Expanded: flat deduplicated document ledger (keyed by Document Number) -->
        <div v-if="expandedHbls[grp.key]" class="hbl-body">
          <div v-if="poFilters[grp.key]" class="po-filter-bar">
            <i class="el-icon-s-operation"></i>
            Filtered by <strong>{{ poFilters[grp.key] }}</strong> — showing only documents related to this PO
            <span class="pf-clear" @click="clearPoFilter(grp.key)"><i class="el-icon-close"></i> Clear</span>
          </div>

          <!-- GRID mode: tile cards, like a desktop folder -->
          <div v-if="modeFor(grp) === 'grid'" class="ledger-grid">
            <div v-for="doc in ledgerDocs(grp)" :key="doc.id" class="doc-card" @click="previewVersion(doc, cv(doc))">
              <div class="card-top">
                <span :class="['lt-badge', typeBadge(doc.docType).cls]">{{ typeBadge(doc.docType).abbr }}</span>
                <span :class="['ver-chip', { multi: doc.versions.length > 1 }]" @click.stop="openVersions(doc)">
                  v{{ cv(doc).v }}<i v-if="doc.versions.length > 1" class="el-icon-caret-bottom"></i>
                </span>
              </div>
              <div class="card-dn">{{ doc.docNumber }}</div>
              <div class="card-type">{{ doc.docType }}</div>
              <div class="card-file">{{ cv(doc).fileName }}</div>
              <div class="card-pos">
                <span v-for="po in doc.poIds || [doc.poId]" :key="po" class="meta-po">{{ po }}</span>
                <span v-if="shared(doc)" class="shared-tag">🔗</span>
              </div>
              <div class="card-actions" @click.stop>
                <el-button type="text" size="mini" icon="el-icon-view" @click="previewVersion(doc, cv(doc))" />
                <el-button type="text" size="mini" icon="el-icon-download" @click="downloadOne(doc)" />
                <el-button type="text" size="mini" icon="el-icon-info" @click="openDetail(doc)" />
              </div>
            </div>
          </div>

          <!-- LIST mode: ledger rows -->
          <div v-else v-for="doc in ledgerDocs(grp)" :key="doc.id" class="ledger-row">
            <span :class="['lt-badge', typeBadge(doc.docType).cls]">{{ typeBadge(doc.docType).abbr }}</span>
            <div class="ledger-main">
              <div class="ledger-line-a">
                <span class="ledger-dn" @click="openDetail(doc)">{{ doc.docNumber }}</span>
                <span class="ledger-type">{{ doc.docType }}</span>
                <el-tooltip :content="doc.versions.length > 1 ? `${doc.versions.length} versions — click for history` : 'Version 1'" placement="top">
                  <span :class="['ver-chip', { multi: doc.versions.length > 1 }]" @click="openVersions(doc)">
                    v{{ cv(doc).v }}<i v-if="doc.versions.length > 1" class="el-icon-caret-bottom"></i>
                  </span>
                </el-tooltip>
                <el-tooltip v-if="shared(doc)" placement="top"
                  :content="`Shared across ${entities(doc).hbls.join(', ')} — same document object, one version chain`">
                  <span class="shared-tag">🔗 Shared</span>
                </el-tooltip>
                <span class="ledger-file">{{ cv(doc).fileName }}</span>
                <span class="ledger-actions">
                  <el-button type="text" size="mini" icon="el-icon-view" @click="previewVersion(doc, cv(doc))">Preview</el-button>
                  <el-button type="text" size="mini" icon="el-icon-download" @click="downloadOne(doc)">Download</el-button>
                  <el-button type="text" size="mini" icon="el-icon-info" @click="openDetail(doc)">Detail</el-button>
                </span>
              </div>
              <div class="ledger-line-b">
                <span class="ocr-tag"><i class="el-icon-cpu"></i> OCR</span>
                <span class="meta-kv">
                  <label>PO</label>
                  <span v-if="(doc.poIds || [doc.poId]).length" class="meta-pos">
                    <span v-for="po in doc.poIds || [doc.poId]" :key="po" class="meta-po">{{ po }}</span>
                  </span>
                  <span v-else class="meta-none">—</span>
                </span>
                <span class="meta-kv">
                  <label>Products</label>
                  <span v-if="(doc.ocr && doc.ocr.products || []).length" class="meta-mono">{{ doc.ocr.products.join(' · ') }}</span>
                  <span v-else class="meta-none">—</span>
                </span>
                <span class="ledger-by">{{ cv(doc).by }} · {{ cv(doc).at }}</span>
              </div>
            </div>
          </div>
          <div v-if="!ledgerDocs(grp).length" class="doc-empty">No documents match the current filters</div>
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
        <el-table-column label="Actions" width="200" align="center">
          <template #default="{row}">
            <el-button type="text" size="mini" icon="el-icon-view" @click="openDetail(row)">Detail</el-button>
            <el-button type="text" size="mini" icon="el-icon-download" @click="downloadOne(row)">Download</el-button>
            <el-button v-if="canUpload && row.status === 'REJECTED'" type="text" size="mini" class="act-reupload" @click="openReupload(row)">Re-upload</el-button>
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
            <div class="detail-dn">{{ detail.doc.docNumber }}</div>
            <div class="detail-sub">{{ cv(detail.doc).fileName }}</div>
          </div>
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
            <span style="margin-left:auto;display:flex;flex-shrink:0">
              <el-tooltip content="Preview this version" placement="top">
                <el-button type="text" size="mini" icon="el-icon-view" @click="previewVersion(detail.doc, v)" />
              </el-tooltip>
              <el-button type="text" size="mini" icon="el-icon-download" @click="$message.success(`Downloading ${v.fileName}…`)" />
            </span>
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

        <!-- AI-extracted fields (OCR at upload time) -->
        <div class="detail-section">
          <div class="sec-title">AI-Extracted Fields <span class="ocr-tag"><i class="el-icon-cpu"></i> OCR</span></div>
          <div class="xf-grid">
            <div class="xf-item">
              <label>Document Number</label>
              <span class="xf-mono xf-dn">{{ detail.doc.docNumber }}</span>
            </div>
            <div class="xf-item">
              <label>PO Numbers</label>
              <span>
                <el-tag v-for="po in detail.doc.poIds || [detail.doc.poId]" :key="po" size="mini" class="chip chip-po" style="margin-right:4px">{{ po }}</el-tag>
              </span>
            </div>
            <div class="xf-item">
              <label>Product Numbers</label>
              <span v-if="(detail.doc.ocr && detail.doc.ocr.products || []).length" class="xf-mono">{{ detail.doc.ocr.products.join(' · ') }}</span>
              <span v-else class="meta-none">— none detected</span>
            </div>
            <div class="xf-item">
              <label>Supplier</label>
              <span>{{ (poById(detail.doc.poId) || {}).supplier || '—' }}</span>
            </div>
          </div>
        </div>

        <!-- Footer actions (review/approve lives in the Pepco Review page) -->
        <div class="detail-actions">
          <el-button v-if="canUpload && detail.doc.status === 'REJECTED'" type="warning" size="small" icon="el-icon-refresh-left" @click="openReupload(detail.doc)">Re-upload New Version</el-button>
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

    <!-- ════════════════ File preview dialog (in-page, same as Document Upload) ════ -->
    <el-dialog :visible.sync="pv.visible"
      :title="pv.doc ? `Preview — ${pv.doc.docType} (v${pv.v.v})` : 'Preview'"
      width="760px" top="5vh" append-to-body>
      <div v-if="pv.doc" class="preview-dialog">
        <div class="preview-meta">
          <el-descriptions :column="3" size="mini" border>
            <el-descriptions-item label="Document No.">
              <span class="xf-mono xf-dn">{{ pv.doc.docNumber }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="Version">
              <el-tag size="mini" :type="pvIsCurrent ? 'success' : 'warning'">
                v{{ pv.v.v }} · {{ pvIsCurrent ? 'Current' : 'Superseded' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="Uploaded">{{ pv.v.at }}</el-descriptions-item>
            <el-descriptions-item label="File Name" :span="2">{{ pv.v.fileName }}</el-descriptions-item>
            <el-descriptions-item label="PO Number(s)">
              <span style="color:#004F7C;font-weight:600">{{ (pv.doc.poIds || [pv.doc.poId]).join(', ') }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div v-if="pvIsCurrent" class="preview-verify-bar">
          <i class="el-icon-circle-check" style="color:#13ce66"></i>
          <span>Current valid version — OCR fields extracted at upload time</span>
        </div>
        <div v-else class="preview-verify-bar superseded">
          <i class="el-icon-warning-outline" style="color:#E6A817"></i>
          <span>Superseded version — v{{ cv(pv.doc).v }} is the current valid version of this document</span>
        </div>

        <div class="pdf-viewer">
          <div class="pdf-page">
            <div class="pdf-header-row">
              <div class="pdf-company">{{ (poById(pv.doc.poId) || {}).supplier || 'Supplier Co.' }}</div>
              <div class="pdf-doc-title">{{ pv.doc.docType }}</div>
            </div>
            <div class="pdf-divider"></div>
            <div class="pdf-fields">
              <div class="pdf-field"><span class="pdf-label">Document No.</span><span class="pdf-value highlight xf-mono">{{ pv.doc.docNumber }}</span></div>
              <div class="pdf-field"><span class="pdf-label">PO Number(s)</span><span class="pdf-value highlight">{{ (pv.doc.poIds || [pv.doc.poId]).join(', ') }}</span></div>
              <div class="pdf-field"><span class="pdf-label">Date</span><span class="pdf-value">{{ pv.v.at }}</span></div>
              <div class="pdf-field"><span class="pdf-label">Supplier</span><span class="pdf-value">{{ (poById(pv.doc.poId) || {}).supplier || '—' }}</span></div>
              <div v-if="(pv.doc.ocr && pv.doc.ocr.products || []).length" class="pdf-field">
                <span class="pdf-label">Products</span><span class="pdf-value xf-mono">{{ pv.doc.ocr.products.join(' · ') }}</span>
              </div>
              <div v-if="pv.v.remark" class="pdf-field">
                <span class="pdf-label">Remark</span><span class="pdf-value" style="color:#c25e00">“{{ pv.v.remark }}”</span>
              </div>
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
        <el-button size="small" icon="el-icon-download" type="primary"
          @click="$message.success(`Downloading ${pv.v.fileName}…`)">Download</el-button>
        <el-button size="small" @click="pv.visible = false">Close</el-button>
      </div>
    </el-dialog>

    <!-- ════════════════ Version history dialog ════════════════ -->
    <el-dialog :visible.sync="verDlg.visible"
      :title="verDlg.doc ? `Version History — ${verDlg.doc.docNumber}` : 'Version History'"
      width="560px" custom-class="brand-dialog">
      <template v-if="verDlg.doc">
        <div class="verdlg-sub">{{ verDlg.doc.docType }} · all versions share this Document Number</div>
        <div v-for="v in [...verDlg.doc.versions].reverse()" :key="v.v" class="ver-row">
          <el-tag size="mini" :type="v.v === cv(verDlg.doc).v ? 'success' : 'info'">
            v{{ v.v }}{{ v.v === cv(verDlg.doc).v ? ' Current' : '' }}
          </el-tag>
          <span class="ver-file">{{ v.fileName }}</span>
          <span class="ver-meta">{{ v.by }} · {{ v.at }}</span>
          <span v-if="v.remark" class="ver-remark">“{{ v.remark }}”</span>
          <span style="margin-left:auto;display:flex;flex-shrink:0">
            <el-tooltip content="Preview this version" placement="top">
              <el-button type="text" size="mini" icon="el-icon-view" @click="previewVersion(verDlg.doc, v)" />
            </el-tooltip>
            <el-button type="text" size="mini" icon="el-icon-download"
              @click="$message.success(`Downloading ${v.fileName}…`)" />
          </span>
        </div>
      </template>
      <div slot="footer">
        <el-button size="small" @click="verDlg.visible = false">Close</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { roleStore } from '@/store/role'
import {
  docStore, DOC_TYPES, REQUIRED_TYPES,
  poById, docsForPo, docsForHbl, unassignedPos, entitiesForDoc, isShared, currentVersion,
  addDocument, addVersion,
  activityForDoc, recordPackageDownload, hblUpdatedSinceDownload, searchScope, searchSuggest,
} from '@/store/documents'

export default {
  name: 'DocumentCenter',
  data() {
    return {
      view: 'shipment',
      searchQ: '',
      filterTypes: [],

      expandedHbls: { 'HBL-001': true },
      poFilters: {},    // { hblKey: poId } — header chip filter
      chipsOpen: {},    // { hblKey: true } — header chips expanded past 3
      verDlg: { visible: false, doc: null },
      pv: { visible: false, doc: null, v: null },   // in-page file preview dialog
      // '' = auto (≤6 docs → grid, otherwise list); 'list'/'grid' = user preference
      userViewMode: localStorage.getItem('dcViewMode') || '',

      detail: { visible: false, doc: null },
      upload: { visible: false, poId: '', doc: null, docType: '', fileName: '', remark: '' },
      pkg: { visible: false, scopeType: 'HBL', scopeId: '', onlyApproved: true, state: 'config', progress: 0 },

      docTypes: DOC_TYPES,

    }
  },

  computed: {
    role() { return roleStore.currentRole },
    isSupplier() { return this.role === 'Supplier' },
    isBroker() { return this.role === 'Customs Broker' },
    isOps() { return this.role === 'MOOV Ops' },
    isPepco() { return ['Pepco PGS', 'Pepco Finance', 'Pepco Customs'].includes(this.role) },
    canUpload() { return this.isSupplier || this.isOps },
    pvIsCurrent() { return this.pv.doc && this.pv.v && this.pv.v.v === currentVersion(this.pv.doc).v },
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
      return !this.filterTypes.length || this.filterTypes.includes(d.docType)
    },

    docsOfPo(poId) { return docsForPo(poId) },

    // Flat deduplicated ledger of an HBL group, sorted type-first then newest
    ledgerDocs(grp) {
      const seen = new Set()
      let docs = grp.poIds.flatMap(po => docsForPo(po)).filter(d => !seen.has(d.id) && seen.add(d.id))
      const pf = this.poFilters[grp.key]
      if (pf) docs = docs.filter(d => (d.poIds || [d.poId]).includes(pf))
      if (this.searchHit) docs = docs.filter(d => this.searchHit.docIds.has(d.id))
      docs = docs.filter(d => this.passFilters(d))
      const order = ['Commercial Invoice', 'Packing List', 'Bill of Lading', 'ISF', 'Certificate of Origin', 'Other']
      return docs.sort((a, b) => {
        const t = order.indexOf(a.docType) - order.indexOf(b.docType)
        return t !== 0 ? t : currentVersion(b).at.localeCompare(currentVersion(a).at)
      })
    },

    headerPos(grp) {
      return this.chipsOpen[grp.key] ? grp.poIds : grp.poIds.slice(0, 3)
    },
    togglePoFilter(grp, po) {
      if (this.poFilters[grp.key] === po) {
        this.clearPoFilter(grp.key)
      } else {
        this.$set(this.poFilters, grp.key, po)
        this.$set(this.expandedHbls, grp.key, true)
      }
    },
    clearPoFilter(key) { this.$set(this.poFilters, key, '') },

    typeBadge(t) {
      return {
        'Commercial Invoice':    { abbr: 'CI',  cls: 'lt-ci' },
        'Packing List':          { abbr: 'PL',  cls: 'lt-pl' },
        'Bill of Lading':        { abbr: 'BL',  cls: 'lt-bl' },
        'ISF':                   { abbr: 'ISF', cls: 'lt-isf' },
        'Certificate of Origin': { abbr: 'CO',  cls: 'lt-coo' },
      }[t] || { abbr: 'DOC', cls: 'lt-other' }
    },

    openVersions(doc) { this.verDlg = { visible: true, doc } },

    // Display mode: explicit user choice wins; otherwise auto by group size
    modeFor(grp) {
      return this.userViewMode || (this.ledgerDocs(grp).length <= 6 ? 'grid' : 'list')
    },
    setViewMode(mode) {
      // clicking the active button again returns to auto
      this.userViewMode = this.userViewMode === mode ? '' : mode
      if (this.userViewMode) localStorage.setItem('dcViewMode', this.userViewMode)
      else localStorage.removeItem('dcViewMode')
    },


    // Open the in-page preview dialog for one specific version (same UX as Document Upload)
    previewVersion(doc, v) { this.pv = { visible: true, doc, v } },

    toggleHbl(k) { this.$set(this.expandedHbls, k, !this.expandedHbls[k]) },

    fetchSuggest(q, cb) { cb(searchSuggest(q).map(v => ({ value: v }))) },

    userName() {
      return { 'Supplier': 'Zhang (Supplier)', 'Customs Broker': 'EuroCustoms (Broker)' }[this.role]
        || `${this.role.replace('Pepco ', '')} (PEPCO)`
    },

    // ── Detail ──
    openDetail(doc) { this.detail = { visible: true, doc } },

    // ── Re-upload (Document View only — Shipment View is read-only) ──
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

// ── Flat document ledger ─────────────────────────────────────────────────────
.hbl-body { border-top: 1px solid $border; padding: 8px 16px 12px 38px; }

.po-filter-bar {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; color: #3A71A8; background: #ecf5ff;
  border: 1px solid #c8e0f5; border-radius: 6px;
  padding: 6px 12px; margin-bottom: 8px;
  strong { color: $primary; }
  .pf-clear {
    margin-left: auto; cursor: pointer; font-weight: 600; color: #3A71A8;
    &:hover { color: $primary; }
  }
}

.ledger-row {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 9px 10px; border-bottom: 1px dashed #eef1f5;
  &:last-child { border-bottom: none; }
  &:hover { background: #fcfdfe; }
}
.lt-badge {
  flex-shrink: 0; width: 34px; height: 34px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 800; letter-spacing: 0.3px; margin-top: 2px;
  &.lt-ci    { background: #e8f0f6; color: $primary; }
  &.lt-pl    { background: #e6f9ef; color: #0d9b50; }
  &.lt-bl    { background: #fdf3e3; color: #c25e00; }
  &.lt-isf   { background: #f3e5f5; color: #7b1fa2; }
  &.lt-coo   { background: #fce8f0; color: #c2185b; }
  &.lt-other { background: #f0f2f5; color: #909399; }
}
.ledger-main { flex: 1; min-width: 0; }
.ledger-line-a { display: flex; align-items: center; gap: 8px; }
.ledger-dn {
  font-family: 'Consolas', 'SFMono-Regular', Menlo, monospace;
  font-size: 13px; font-weight: 700; color: $primary; letter-spacing: 0.3px;
  cursor: pointer; white-space: nowrap;
  &:hover { text-decoration: underline; }
}
.ledger-type { font-size: 11px; color: #666; white-space: nowrap; }
.ver-chip {
  font-size: 10px; font-weight: 700; color: #909399;
  background: #f0f2f5; border-radius: 9px; padding: 2px 8px;
  cursor: pointer; white-space: nowrap; flex-shrink: 0;
  i { margin-left: 1px; font-size: 9px; }
  &.multi { background: #e8f0f6; color: $primary; }
  &:hover { background: #d8e6f0; color: $primary; }
}
.ledger-file { font-size: 11px; color: #999; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ledger-actions { margin-left: auto; display: flex; gap: 0; flex-shrink: 0; }
.ledger-line-b {
  display: flex; align-items: center; gap: 12px; margin-top: 4px;
  font-size: 11px;
}
.ocr-tag {
  font-size: 9px; font-weight: 800; letter-spacing: 0.5px;
  color: #7b1fa2; background: #f3e5f5; border-radius: 4px;
  padding: 1px 6px; white-space: nowrap;
  i { margin-right: 1px; }
}
.meta-kv {
  display: flex; align-items: center; gap: 5px;
  label { color: #bbb; font-size: 10px; text-transform: uppercase; letter-spacing: 0.4px; }
}
.meta-pos { display: flex; gap: 3px; }
.meta-po {
  font-family: 'Consolas', 'SFMono-Regular', Menlo, monospace;
  font-size: 10px; font-weight: 600; color: #3A71A8;
  background: #ecf5ff; border-radius: 4px; padding: 1px 6px;
}
.meta-mono {
  font-family: 'Consolas', 'SFMono-Regular', Menlo, monospace;
  font-size: 10px; color: #666;
}
.meta-none { color: #d0d4da; }
.ledger-by { margin-left: auto; font-size: 10px; color: #bbb; white-space: nowrap; }

.chip-filter {
  cursor: pointer;
  &:hover { box-shadow: 0 0 0 1px #3A71A8 inset; }
  &.active { background: $primary; color: #fff; }
}

// ── Grid (tile card) mode ────────────────────────────────────────────────────
.ledger-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px; padding: 4px 0;
}
.doc-card {
  position: relative; background: #fff; border: 1px solid $border; border-radius: 8px;
  padding: 12px 14px; cursor: pointer; transition: box-shadow .15s, transform .15s;
  &:hover {
    box-shadow: 0 3px 10px rgba(0, 79, 124, 0.12); transform: translateY(-1px);
    .card-actions { opacity: 1; }
  }
}
.card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.card-dn {
  font-family: 'Consolas', 'SFMono-Regular', Menlo, monospace;
  font-size: 13px; font-weight: 700; color: $primary; letter-spacing: 0.3px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.card-type { font-size: 11px; color: #666; margin-top: 1px; }
.card-file { font-size: 10px; color: #aaa; margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-pos { display: flex; gap: 3px; flex-wrap: wrap; margin-top: 7px; align-items: center; }
.card-actions {
  position: absolute; right: 8px; bottom: 6px; opacity: 0; transition: opacity .15s;
  background: rgba(255,255,255,0.95); border-radius: 6px; padding: 0 2px;
  display: flex; gap: 0;
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

// ── Detail: OCR extracted fields ─────────────────────────────────────────────
.detail-dn {
  font-family: 'Consolas', 'SFMono-Regular', Menlo, monospace;
  font-size: 13px; font-weight: 700; color: $primary; margin-top: 3px;
}
.xf-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px 18px;
  border: 1px solid $border; border-radius: 6px; padding: 12px 14px; background: #fafbfd;
}
.xf-item {
  display: flex; flex-direction: column; gap: 3px; font-size: 12px;
  label { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.4px; }
}
.xf-mono { font-family: 'Consolas', 'SFMono-Regular', Menlo, monospace; font-size: 11px; color: #333; }
.xf-dn { font-size: 13px; font-weight: 700; color: $primary; }
.verdlg-sub { font-size: 11px; color: #999; margin-bottom: 10px; }

// ── In-page file preview dialog (mirrors Document Upload) ───────────────────
.preview-dialog { display:flex; flex-direction:column; gap:12px; }
.preview-verify-bar {
  display:flex; align-items:center; gap:8px; padding:8px 12px;
  border-radius:6px; font-size:12px; font-weight:500;
  background:#e6f9ef; color:#0d9b50;
  &.superseded { background:#fff8e0; color:#e6a817; }
  i { font-size:16px; }
}
.pdf-viewer { border:1px solid $border; border-radius:6px; overflow:hidden; max-height:380px; overflow-y:auto; }
.pdf-page { background:#fff; padding:24px 28px; font-size:12px; min-height:300px; }
.pdf-header-row { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; }
.pdf-company   { font-weight:700; font-size:14px; color:$primary; }
.pdf-doc-title { font-weight:700; font-size:16px; color:#303133; }
.pdf-divider   { height:2px; background:$primary; margin-bottom:14px; }
.pdf-fields    { display:grid; grid-template-columns:1fr 1fr; gap:6px 20px; margin-bottom:16px; }
.pdf-field     { display:flex; gap:8px; }
.pdf-label     { color:#909399; width:100px; flex-shrink:0; }
.pdf-value     { color:#303133; font-weight:500; &.highlight { color:$primary; font-weight:700; } }
.pdf-table-mock { border:1px solid $border; border-radius:4px; overflow:hidden; margin-bottom:12px; }
.pdf-table-hdr { display:grid; grid-template-columns:3fr 1fr 1fr 1fr; background:#f5f7fa; padding:6px 10px; font-weight:600; font-size:11px; color:#909399; gap:8px; }
.pdf-table-row { display:grid; grid-template-columns:3fr 1fr 1fr 1fr; padding:5px 10px; border-top:1px solid $border; gap:8px;
  &:nth-child(even) { background:#fafafa; }
}
.pdf-table-total { display:grid; grid-template-columns:3fr 1fr 1fr 1fr; padding:6px 10px; border-top:2px solid $border; font-weight:700; gap:8px; background:#f0f7ff; }
.pdf-footer { text-align:center; color:#bbb; font-size:11px; margin-top:8px; font-style:italic; }
.detail-actions { display: flex; gap: 8px; justify-content: flex-end; border-top: 1px solid $border; padding-top: 14px; }

// ── Brand dialog header ──────────────────────────────────────────────────────
::v-deep .brand-dialog .el-dialog__header {
  background: $primary; padding: 12px 20px;
  .el-dialog__title { color: #fff; font-size: 14px; font-weight: 600; }
  .el-dialog__headerbtn .el-dialog__close { color: #fff; }
}
</style>
