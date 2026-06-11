import Vue from 'vue'

// ─────────────────────────────────────────────────────────────────────────────
// Shared document store — the single source of truth for the Document Center.
// Document is a first-class object: one file, one version chain, one status.
// It links to a PO only; HBL/MBL/Container views are resolved through the
// entity relations below (mirrors the backend relation tables).
// ─────────────────────────────────────────────────────────────────────────────

export const DOC_TYPES = [
  'Commercial Invoice',
  'Packing List',
  'ISF',
  'Bill of Lading',
  'Certificate of Origin',
  'Other',
]

// Per-PO mandatory types used for the Doc Completeness column
export const REQUIRED_TYPES = ['Commercial Invoice', 'Packing List']

export const DOC_STATUS = {
  PENDING_REVIEW:   { label: 'Pending Review',    cls: 'st-pending' },
  PENDING_REREVIEW: { label: 'Pending Re-review', cls: 'st-rereview' },
  APPROVED:         { label: 'Approved',          cls: 'st-approved' },
  REJECTED:         { label: 'Rejected',          cls: 'st-rejected' },
}

const nowStr = () => {
  const d = new Date()
  const p = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

let DOC_SEQ = 10
let LOG_SEQ = 100

// ── Seed data — exactly the PRD topology ────────────────────────────────────
// PO-001/002/003 merged into HBL-001; PO-004 split across HBL-001 + HBL-002;
// HBL-001 in CONT-A; HBL-002 across CONT-A + CONT-B; everything under MBL-B.
// PO-005 not yet assigned to any HBL.
export const docStore = Vue.observable({
  pos: [
    { id: 'PO-001', cartons: 50,  supplier: 'NINGBO GENERAL UNION CO.,LTD' },
    { id: 'PO-002', cartons: 30,  supplier: 'NINGBO GENERAL UNION CO.,LTD' },
    { id: 'PO-003', cartons: 20,  supplier: 'NINGBO GENERAL UNION CO.,LTD' },
    { id: 'PO-004', cartons: 800, supplier: 'NINGBO GENERAL UNION CO.,LTD' },
    { id: 'PO-005', cartons: 60,  supplier: 'NINGBO GENERAL UNION CO.,LTD' },
  ],

  hbls: [
    { id: 'HBL-001', poIds: ['PO-001', 'PO-002', 'PO-003', 'PO-004'], containerIds: ['CONT-A'], mblId: 'MBL-B', pod: 'PLGDN', eta: '2026-07-02' },
    { id: 'HBL-002', poIds: ['PO-004'], containerIds: ['CONT-A', 'CONT-B'], mblId: 'MBL-B', pod: 'PLGDN', eta: '2026-07-02' },
  ],

  // Broker (demo) is assigned to both HBLs; PO-005 (unassigned) stays invisible to broker
  brokerAssignedHbls: ['HBL-001', 'HBL-002'],

  documents: [
    // PO-001 — CI was rejected then re-uploaded (v2, auto-flipped to Pending Re-review)
    {
      id: 'DOC-1', poId: 'PO-001', docType: 'Commercial Invoice',
      status: 'PENDING_REREVIEW', rejectReason: 'Carton count does not match Packing List',
      deleted: false,
      versions: [
        { v: 1, fileName: 'INV-PO001.pdf',       by: 'Zhang (Supplier)', at: '2026-06-05 09:12', remark: '' },
        { v: 2, fileName: 'INV-PO001-fixed.pdf', by: 'Zhang (Supplier)', at: '2026-06-09 14:30', remark: 'Corrected carton count' },
      ],
    },
    { id: 'DOC-2', poId: 'PO-001', docType: 'Packing List', status: 'APPROVED', rejectReason: '', deleted: false,
      versions: [{ v: 1, fileName: 'PL-PO001.pdf', by: 'Zhang (Supplier)', at: '2026-06-05 09:15', remark: '' }] },
    { id: 'DOC-3', poId: 'PO-001', docType: 'ISF', status: 'PENDING_REVIEW', rejectReason: '', deleted: false,
      versions: [{ v: 1, fileName: 'ISF-PO001.pdf', by: 'Zhang (Supplier)', at: '2026-06-06 11:02', remark: '' }] },

    // PO-002 — PL currently rejected (supplier needs to act)
    { id: 'DOC-4', poId: 'PO-002', docType: 'Commercial Invoice', status: 'APPROVED', rejectReason: '', deleted: false,
      versions: [{ v: 1, fileName: 'INV-PO002.pdf', by: 'Zhang (Supplier)', at: '2026-06-04 16:40', remark: '' }] },
    { id: 'DOC-5', poId: 'PO-002', docType: 'Packing List', status: 'REJECTED',
      rejectReason: 'Gross weight missing on page 2', deleted: false,
      versions: [{ v: 1, fileName: 'PL-PO002.pdf', by: 'Zhang (Supplier)', at: '2026-06-04 16:42', remark: '' }] },

    // PO-003 — only CI uploaded (completeness gap: PL missing)
    { id: 'DOC-6', poId: 'PO-003', docType: 'Commercial Invoice', status: 'PENDING_REVIEW', rejectReason: '', deleted: false,
      versions: [{ v: 1, fileName: 'INV-PO003.pdf', by: 'Zhang (Supplier)', at: '2026-06-07 10:21', remark: '' }] },

    // PO-004 — split across HBL-001 and HBL-002: these documents are SHARED entries
    { id: 'DOC-7', poId: 'PO-004', docType: 'Commercial Invoice', status: 'APPROVED', rejectReason: '', deleted: false,
      versions: [{ v: 1, fileName: 'INV-PO004.pdf', by: 'Zhang (Supplier)', at: '2026-06-03 08:55', remark: '' }] },
    { id: 'DOC-8', poId: 'PO-004', docType: 'Packing List', status: 'PENDING_REVIEW', rejectReason: '', deleted: false,
      versions: [{ v: 1, fileName: 'PL-PO004.pdf', by: 'Zhang (Supplier)', at: '2026-06-03 08:57', remark: '' }] },
    { id: 'DOC-9', poId: 'PO-004', docType: 'Certificate of Origin', status: 'APPROVED', rejectReason: '', deleted: false,
      versions: [{ v: 1, fileName: 'COO-PO004.pdf', by: 'Zhang (Supplier)', at: '2026-06-03 09:10', remark: '' }] },

    // PO-005 — not assigned to a HBL yet, documents still fully manageable
    { id: 'DOC-10', poId: 'PO-005', docType: 'Commercial Invoice', status: 'PENDING_REVIEW', rejectReason: '', deleted: false,
      versions: [{ v: 1, fileName: 'INV-PO005.pdf', by: 'Zhang (Supplier)', at: '2026-06-08 15:33', remark: '' }] },
  ],

  activity: [
    { id: 1, docId: 'DOC-1', action: 'UPLOAD',      user: 'Zhang (Supplier)', at: '2026-06-05 09:12', detail: 'Uploaded v1' },
    { id: 2, docId: 'DOC-1', action: 'REJECT',      user: 'Anna W. (PEPCO)',  at: '2026-06-08 10:05', detail: 'Carton count does not match Packing List' },
    { id: 3, docId: 'DOC-1', action: 'NEW_VERSION', user: 'Zhang (Supplier)', at: '2026-06-09 14:30', detail: 'Uploaded v2 — status auto-flipped to Pending Re-review' },
    { id: 4, docId: 'DOC-2', action: 'UPLOAD',      user: 'Zhang (Supplier)', at: '2026-06-05 09:15', detail: 'Uploaded v1' },
    { id: 5, docId: 'DOC-2', action: 'APPROVE',     user: 'Anna W. (PEPCO)',  at: '2026-06-08 10:06', detail: '' },
    { id: 6, docId: 'DOC-5', action: 'UPLOAD',      user: 'Zhang (Supplier)', at: '2026-06-04 16:42', detail: 'Uploaded v1' },
    { id: 7, docId: 'DOC-5', action: 'REJECT',      user: 'Tom K. (PEPCO)',   at: '2026-06-08 11:20', detail: 'Gross weight missing on page 2' },
    { id: 8, docId: 'DOC-7', action: 'APPROVE',     user: 'Anna W. (PEPCO)',  at: '2026-06-06 09:00', detail: '' },
  ],

  // {scopeType:'HBL'|'PO', scopeId, by, at, snapshot: {docId: versionNumber}}
  brokerDownloads: [],
})

// ── Relation resolution (front-end mirror of the backend relation tables) ───

export function poById(poId) { return docStore.pos.find(p => p.id === poId) }

export function hblsForPo(poId) {
  return docStore.hbls.filter(h => h.poIds.includes(poId))
}

export function docsForPo(poId) {
  return docStore.documents.filter(d => !d.deleted && d.poId === poId)
}

export function docsForHbl(hblId) {
  const hbl = docStore.hbls.find(h => h.id === hblId)
  if (!hbl) return []
  return hbl.poIds.flatMap(poId => docsForPo(poId))
}

export function unassignedPos() {
  const linked = new Set(docStore.hbls.flatMap(h => h.poIds))
  return docStore.pos.filter(p => !linked.has(p.id))
}

// All entities a document is linked to (PO direct, the rest resolved)
export function entitiesForDoc(doc) {
  const hbls = hblsForPo(doc.poId)
  const containers = [...new Set(hbls.flatMap(h => h.containerIds))]
  const mbls = [...new Set(hbls.map(h => h.mblId))]
  return { po: doc.poId, hbls: hbls.map(h => h.id), containers, mbls }
}

export function isShared(doc) { return hblsForPo(doc.poId).length > 1 }

export function currentVersion(doc) { return doc.versions[doc.versions.length - 1] }

// ── Mutations (every page reads the same objects → sync is intrinsic) ───────

export function addDocument({ poId, docType, fileName, remark, user }) {
  const doc = {
    id: `DOC-${++DOC_SEQ}`, poId, docType,
    status: 'PENDING_REVIEW', rejectReason: '', deleted: false,
    versions: [{ v: 1, fileName, by: user, at: nowStr(), remark: remark || '' }],
  }
  docStore.documents.push(doc)
  log(doc.id, 'UPLOAD', user, 'Uploaded v1')
  return doc
}

// Re-upload: new version on the SAME document; REJECTED auto-flips to PENDING_REREVIEW
export function addVersion(docId, { fileName, remark, user }) {
  const doc = docStore.documents.find(d => d.id === docId)
  const v = currentVersion(doc).v + 1
  doc.versions.push({ v, fileName, by: user, at: nowStr(), remark: remark || '' })
  const flipped = doc.status === 'REJECTED'
  if (flipped) doc.status = 'PENDING_REREVIEW'
  log(docId, 'NEW_VERSION', user,
    `Uploaded v${v}${flipped ? ' — status auto-flipped to Pending Re-review' : ''}`)
  return doc
}

export function approveDoc(docId, user) {
  const doc = docStore.documents.find(d => d.id === docId)
  doc.status = 'APPROVED'
  doc.rejectReason = ''
  log(docId, 'APPROVE', user, '')
}

export function rejectDoc(docId, reason, user) {
  const doc = docStore.documents.find(d => d.id === docId)
  doc.status = 'REJECTED'
  doc.rejectReason = reason
  log(docId, 'REJECT', user, reason)
}

export function softDeleteDoc(docId, user) {
  const doc = docStore.documents.find(d => d.id === docId)
  doc.deleted = true
  log(docId, 'DELETE', user, 'Document voided (soft delete)')
}

export function log(docId, action, user, detail) {
  docStore.activity.unshift({ id: ++LOG_SEQ, docId, action, user, at: nowStr(), detail })
}

export function activityForDoc(docId) {
  return docStore.activity.filter(a => a.docId === docId)
}

// ── Broker package download + "updated since last download" ────────────────

export function recordPackageDownload(scopeType, scopeId, packagedDocs, user) {
  // Snapshot covers ALL documents in scope at download time (not only the
  // packaged subset), so the "updated since" badge fires only on real changes.
  const scopeDocs = scopeType === 'HBL' ? docsForHbl(scopeId) : docsForPo(scopeId)
  const snapshot = {}
  scopeDocs.forEach(d => { snapshot[d.id] = currentVersion(d).v })
  docStore.brokerDownloads.unshift({ scopeType, scopeId, by: user, at: nowStr(), snapshot })
  packagedDocs.forEach(d => log(d.id, 'DOWNLOAD', user, `Package download (${scopeType} ${scopeId})`))
}

export function lastDownloadFor(scopeType, scopeId) {
  return docStore.brokerDownloads.find(r => r.scopeType === scopeType && r.scopeId === scopeId)
}

// true when any document in the HBL has a newer version than the broker's last snapshot
export function hblUpdatedSinceDownload(hblId) {
  const rec = lastDownloadFor('HBL', hblId)
  if (!rec) return false
  return docsForHbl(hblId).some(d => {
    const snap = rec.snapshot[d.id]
    return snap === undefined || currentVersion(d).v > snap
  })
}

// ── Search: any PO / HBL / MBL / Container number or file name ──────────────
// Returns { docIds:Set, hblIds:Set } — rolled up through the relations.
export function searchScope(qRaw) {
  const q = (qRaw || '').trim().toUpperCase()
  if (!q) return null
  const docIds = new Set()
  const hblIds = new Set()

  const addHbl = (hbl) => {
    hblIds.add(hbl.id)
    hbl.poIds.forEach(poId => docsForPo(poId).forEach(d => docIds.add(d.id)))
  }

  docStore.hbls.forEach(h => {
    if (h.id.toUpperCase().includes(q)) addHbl(h)
    if (h.mblId.toUpperCase().includes(q)) addHbl(h)
    if (h.containerIds.some(c => c.toUpperCase().includes(q))) addHbl(h)
  })
  docStore.pos.forEach(p => {
    if (p.id.toUpperCase().includes(q)) {
      docsForPo(p.id).forEach(d => docIds.add(d.id))
      hblsForPo(p.id).forEach(h => hblIds.add(h.id))
    }
  })
  docStore.documents.forEach(d => {
    if (!d.deleted && d.versions.some(v => v.fileName.toUpperCase().includes(q))) {
      docIds.add(d.id)
      hblsForPo(d.poId).forEach(h => hblIds.add(h.id))
    }
  })
  return { docIds, hblIds }
}

// Prefix suggestions for the search box
export function searchSuggest(qRaw) {
  const q = (qRaw || '').trim().toUpperCase()
  if (!q) return []
  const pool = [
    ...docStore.pos.map(p => p.id),
    ...docStore.hbls.map(h => h.id),
    ...[...new Set(docStore.hbls.map(h => h.mblId))],
    ...[...new Set(docStore.hbls.flatMap(h => h.containerIds))],
  ]
  return pool.filter(x => x.toUpperCase().includes(q)).slice(0, 8)
}
