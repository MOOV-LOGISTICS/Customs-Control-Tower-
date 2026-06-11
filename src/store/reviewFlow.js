import Vue from 'vue'

// ─────────────────────────────────────────────────────────────────────────────
// Shared state for the rejection-correction loop between the Pepco Review tab
// (PEPCO rejects specific documents) and the Document Upload tab (supplier
// sees why and re-uploads; flow then auto-resets to PGS re-check).
// Deliberately NOT wired to the Document Center store yet — that integration
// design is still being decided.
// ─────────────────────────────────────────────────────────────────────────────

const ms = (status, by = null, at = null, recheck = false, lock = '') => ({
  status, completedBy: by, completedAt: at, isRecheck: recheck, lockReason: lock,
})

// reviewStatus: OK | REJECTED | RESUBMITTED ; reject = {reason, remark, by, at, milestone, round}
// versionHistory: array of prior versions [{version, fileName, uploadedAt, status}], newest-first
// docNumber: OCR-extracted identifier (invoice no. for CI, PL ref for PL, etc.)
const doc = (docType, fileName, version, poNo, uploadedAt, reviewStatus = 'OK', reject = null, versionHistory = [], docNumber = '') => ({
  docType, fileName, version, poNo, uploadedAt,
  status: 'VERIFIED',           // AI-verification status (Documents tab badge)
  reviewStatus, reject,
  versionHistory,
  docNumber,
})

const mkHbl = (hblNo, mblNo, supplier, pol, pod, eta, pgs, fin, cus, docs, history, correctionRound = 0) => ({
  hblNo, mblNo, supplier, pol, pod, eta,
  milestones: { PGS: pgs, FINANCE: fin, CUSTOMS: cus },
  documents: docs,
  verifyHistory: history,
  correctionRound,
  expanded: false,
  activeTab: 'verified',
})

const nowStr = () => {
  const d = new Date()
  const p = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())} CET (UTC+1)`
}

export const reviewStore = Vue.observable({
  hbls: [
    // 1. PGS pending → all downstream locked
    mkHbl('MOOV240001', 'MAEU240001', 'Shanghai Textile Co.', 'CNSHA', 'PLGDN', '2024-12-05',
      ms('IN_PROGRESS'), ms('LOCKED', null, null, false, 'Waiting for PGS Check'), ms('LOCKED', null, null, false, 'Waiting for Finance Check'),
      [
        doc('Commercial Invoice', 'INV-240001-v2.pdf', 2, 'PO-2401-1001', '2024-11-11 09:23', 'OK', null, [
          { version: 1, fileName: 'INV-240001.pdf', uploadedAt: '2024-11-09 15:30', status: 'VERIFIED' },
        ], 'INV-2401-8821'),
        doc('Packing List',       'PL-240001.pdf',  1, 'PO-2401-1001', '2024-11-11 09:25', 'OK', null, [], 'PLR-2401-8821'),
        doc('Bill of Lading',     'HBL-240001.pdf', 1, 'PO-2401-1002', '2024-11-12 14:10', 'OK', null, [], 'MAEU240001'),
      ],
      []
    ),
    // 2. PGS complete, Finance in-progress
    mkHbl('MOOV240002', 'MAEU240002', 'Dhaka Garments Ltd.', 'BGCGP', 'DEHAM', '2024-12-15',
      ms('COMPLETE', 'Sarah J. (PGS)', '2024-11-13 10:30 CET'),
      ms('IN_PROGRESS'),
      ms('LOCKED', null, null, false, 'Waiting for Finance Check'),
      [
        doc('Commercial Invoice', 'INV-240002.pdf', 1, 'PO-2401-2001', '2024-11-10 11:02', 'OK', null, [], 'INV-2401-2210'),
        doc('Packing List',       'PL-240002.pdf',  1, 'PO-2401-2001', '2024-11-10 11:05', 'OK', null, [], 'PLR-2401-2210'),
        doc('Bill of Lading',     'HBL-240002.pdf', 1, 'PO-2401-2001', '2024-11-11 09:40', 'OK', null, [], 'MAEU240002'),
      ],
      [
        { milestone: 'PGS Check', status: 'Complete', user: 'Sarah J. (PGS)', time: '2024-11-13 10:30 CET (UTC+1)', reason: '', remark: '', isRecheck: false },
      ]
    ),
    // 3. PGS rejected → reset → PGS re-checked OK → Finance now in re-check
    mkHbl('MOOV240003', 'CMDU240003', 'Ho Chi Minh Apparel', 'VNSGN', 'CZPRE', '2024-12-02',
      ms('COMPLETE', 'Sarah J. (PGS)', '2024-11-14 09:40 CET', true),
      ms('IN_PROGRESS', null, null, true),
      ms('LOCKED', null, null, true, 'Waiting for Finance Check'),
      [
        doc('Commercial Invoice', 'INV-240003-v2.pdf', 2, 'PO-2401-3001', '2024-11-13 11:30', 'RESUBMITTED',
          { reason: 'V002 - Incorrect shipping docs', remark: 'CI date mismatch vs PL', by: 'Sarah J. (PGS)', at: '2024-11-11 14:20', milestone: 'PGS Document Check', round: 1 },
          [{ version: 1, fileName: 'INV-240003.pdf', uploadedAt: '2024-11-09 14:00', status: 'VERIFIED' }], 'INV-2401-3301'),
        doc('Packing List', 'PL-240003-v2.pdf', 2, 'PO-2401-3001', '2024-11-13 11:32', 'RESUBMITTED',
          { reason: 'V002 - Incorrect shipping docs', remark: 'Re-uploaded together with CI', by: 'Sarah J. (PGS)', at: '2024-11-11 14:20', milestone: 'PGS Document Check', round: 1 },
          [{ version: 1, fileName: 'PL-240003.pdf', uploadedAt: '2024-11-09 14:05', status: 'VERIFIED' }], 'PLR-2401-3301'),
        doc('Bill of Lading', 'HBL-240003.pdf', 1, 'PO-2401-3002', '2024-11-09 16:20', 'OK', null, [], 'CMDU240003'),
      ],
      [
        { milestone: 'PGS Check', status: 'Complete',   user: 'Sarah J. (PGS)',  time: '2024-11-14 09:40 CET (UTC+1)', reason: '', remark: '', isRecheck: true },
        { milestone: 'Supplier Note', status: 'Correction', user: 'Ho Chi Minh Apparel (Supplier)', time: '2024-11-13 11:30 UTC+7', reason: '', remark: 'Updated CI v2 uploaded with correct dates. Packing list also re-uploaded.', isRecheck: false },
        { milestone: 'PGS Check', status: 'Revoke',     user: 'PEPCO 4PL Admin', time: '2024-11-12 08:00 CET (UTC+1)', reason: '', remark: '', isRecheck: false },
        { milestone: 'PGS Check', status: 'Incomplete', user: 'Sarah J. (PGS)',  time: '2024-11-11 14:20 CET (UTC+1)', reason: 'V002 - Incorrect shipping docs', remark: 'CI date mismatch vs PL', isRecheck: false },
        { milestone: 'PGS Check', status: 'Complete',   user: 'Sarah J. (PGS)',  time: '2024-11-10 09:15 CET (UTC+1)', reason: '', remark: '', isRecheck: false },
      ],
      1
    ),
    // 4. PGS + Finance complete, Customs in-progress
    mkHbl('MOOV240004', 'HLCU240004', 'Istanbul Fashion AS', 'TRIST', 'ROBUH', '2024-12-10',
      ms('COMPLETE', 'Sarah J. (PGS)', '2024-11-13 10:30 CET'),
      ms('COMPLETE', 'Tom K. (Finance)', '2024-11-14 14:15 CET'),
      ms('IN_PROGRESS'),
      [
        doc('Commercial Invoice',    'INV-240004.pdf', 1, 'PO-2401-4001', '2024-11-09 10:11', 'OK', null, [], 'INV-2401-4412'),
        doc('Packing List',          'PL-240004.pdf',  1, 'PO-2401-4001', '2024-11-09 10:14', 'OK', null, [], 'PLR-2401-4412'),
        doc('Sanitary Certificate',  'SAN-240004.pdf', 1, 'PO-2401-4002', '2024-11-10 13:00', 'OK', null, [], 'SC-2401-4412'),
      ],
      [
        { milestone: 'PGS Check',     status: 'Complete', user: 'Sarah J. (PGS)',   time: '2024-11-13 10:30 CET (UTC+1)', reason: '', remark: '', isRecheck: false },
        { milestone: 'Finance Check', status: 'Complete', user: 'Tom K. (Finance)', time: '2024-11-14 14:15 CET (UTC+1)', reason: '', remark: '', isRecheck: false },
      ]
    ),
    // 5. All three complete
    mkHbl('MOOV240005', 'MAEU240005', 'Mumbai Textiles Pvt', 'INNSA', 'HUBU', '2024-11-28',
      ms('COMPLETE', 'Sarah J. (PGS)', '2024-11-10 09:00 CET'),
      ms('COMPLETE', 'Tom K. (Finance)', '2024-11-11 11:00 CET'),
      ms('COMPLETE', 'Anna W. (Customs)', '2024-11-12 15:30 CET'),
      [
        doc('Commercial Invoice', 'INV-240005.pdf', 1, 'PO-2401-5001', '2024-11-05 08:30', 'OK', null, [], 'INV-2401-5523'),
        doc('Packing List',       'PL-240005.pdf',  1, 'PO-2401-5001', '2024-11-05 08:32', 'OK', null, [], 'PLR-2401-5523'),
        doc('Bill of Lading',     'HBL-240005.pdf', 1, 'PO-2401-5001', '2024-11-06 10:00', 'OK', null, [], 'MAEU240005'),
      ],
      [
        { milestone: 'PGS Check',     status: 'Complete', user: 'Sarah J. (PGS)',    time: '2024-11-10 09:00 CET (UTC+1)', reason: '', remark: '', isRecheck: false },
        { milestone: 'Finance Check', status: 'Complete', user: 'Tom K. (Finance)',  time: '2024-11-11 11:00 CET (UTC+1)', reason: '', remark: '', isRecheck: false },
        { milestone: 'Customs Check', status: 'Complete', user: 'Anna W. (Customs)', time: '2024-11-12 15:30 CET (UTC+1)', reason: '', remark: '', isRecheck: false },
      ]
    ),
    // 6. Customs Check rejected the Sanitary Certificate → Pending Correction,
    //    waiting for the supplier to re-upload that document
    mkHbl('MOOV240006', 'EGLV240006', 'Guangzhou Clothing Co.', 'CNGZU', 'PLWAW', '2024-12-18',
      ms('PENDING_CORRECTION', null, null, false, 'Waiting for Supplier correction'),
      ms('PENDING_CORRECTION', null, null, false, 'Waiting for Supplier correction'),
      ms('PENDING_CORRECTION', null, null, false, 'Waiting for Supplier correction'),
      [
        doc('Commercial Invoice',   'INV-240006.pdf', 1, 'PO-2401-6001', '2024-11-12 09:00', 'OK', null, [], 'INV-2401-6634'),
        doc('Packing List',         'PL-240006.pdf',  1, 'PO-2401-6001', '2024-11-12 09:03', 'OK', null, [], 'PLR-2401-6634'),
        doc('Sanitary Certificate', 'SAN-240006.pdf', 1, 'PO-2401-6002', '2024-11-13 14:20', 'REJECTED',
          { reason: 'V003 - Missing/incorrect sanitary docs', remark: 'Sanitary cert expiry date does not match shipment ETA', by: 'Anna W. (Customs)', at: '2024-11-17 11:45', milestone: 'Customs Document Check', round: 1 },
          [], 'SC-2401-6634'),
      ],
      [
        { milestone: 'Customs Check', status: 'Incomplete', user: 'Anna W. (Customs)', time: '2024-11-17 11:45 CET (UTC+1)', reason: 'V003 - Missing/incorrect sanitary docs', remark: 'Sanitary cert expiry date does not match shipment ETA. Email sent to supplier.', isRecheck: false },
        { milestone: 'Finance Check', status: 'Complete',   user: 'Tom K. (Finance)',  time: '2024-11-16 09:30 CET (UTC+1)', reason: '', remark: '', isRecheck: false },
        { milestone: 'PGS Check',     status: 'Complete',   user: 'Sarah J. (PGS)',    time: '2024-11-15 10:00 CET (UTC+1)', reason: '', remark: '', isRecheck: false },
      ],
      1
    ),
  ],
})

// ── Queries ──────────────────────────────────────────────────────────────────

// All rejected documents across HBLs — the supplier's correction work queue
export function rejectedDocs() {
  return reviewStore.hbls.flatMap(h =>
    h.documents.filter(d => d.reviewStatus === 'REJECTED').map(d => ({ hbl: h, doc: d })))
}

export function resubmittedCount() {
  return reviewStore.hbls.reduce((n, h) =>
    n + h.documents.filter(d => d.reviewStatus === 'RESUBMITTED').length, 0)
}

// Correction progress of the CURRENT round for a Pending-Correction HBL
export function correctionProgress(hbl) {
  const inRound = hbl.documents.filter(d => d.reject && d.reject.round === hbl.correctionRound)
  return {
    total: inRound.length,
    done: inRound.filter(d => d.reviewStatus === 'RESUBMITTED').length,
    docs: inRound,
  }
}

// ── Mutations ────────────────────────────────────────────────────────────────

// PEPCO rejects specific documents at a milestone:
// docs → REJECTED (with reason), all milestones → PENDING_CORRECTION
export function rejectDocuments(hbl, docs, { reason, remark, milestoneName, user }) {
  hbl.correctionRound++
  const at = nowStr()
  docs.forEach(d => {
    d.reviewStatus = 'REJECTED'
    d.reject = { reason, remark: remark || '', by: user, at, milestone: milestoneName, round: hbl.correctionRound }
  })

  Object.keys(hbl.milestones).forEach(k => {
    const m = hbl.milestones[k]
    m.status = 'PENDING_CORRECTION'
    m.lockReason = 'Waiting for Supplier correction'
    m.completedBy = null
    m.completedAt = null
    m.isRecheck = false
  })

  hbl.verifyHistory.unshift({
    milestone: milestoneName.replace(' Document', ''), status: 'Incomplete',
    user, time: at, reason,
    remark: `${docs.length} document(s) returned to supplier: ${docs.map(d => d.docType).join(', ')}. ${remark ? remark + '. ' : ''}Email sent to supplier.`,
    isRecheck: false,
  })
}

// Supplier re-uploads a rejected document. When the HBL has no rejected
// documents left, the whole flow automatically resets to PGS re-check.
export function resubmitDocument(hbl, document, fileName, user) {
  document.fileName = fileName
  document.version += 1
  document.uploadedAt = nowStr().replace(' CET (UTC+1)', '')
  document.reviewStatus = 'RESUBMITTED'

  const remaining = hbl.documents.filter(d => d.reviewStatus === 'REJECTED').length
  if (remaining > 0) return { reset: false, remaining }

  // All corrected → reset milestones, restart at PGS with re-check flags
  const ORDER = ['PGS', 'FINANCE', 'CUSTOMS']
  ORDER.forEach((k, i) => {
    const m = hbl.milestones[k]
    m.isRecheck = true
    m.completedBy = null
    m.completedAt = null
    if (i === 0) { m.status = 'IN_PROGRESS'; m.lockReason = '' }
    else { m.status = 'LOCKED'; m.lockReason = i === 1 ? 'Waiting for PGS Check' : 'Waiting for Finance Check' }
  })

  hbl.verifyHistory.unshift({
    milestone: 'Supplier Note', status: 'Correction',
    user, time: nowStr(), reason: '',
    remark: 'All rejected documents resubmitted by supplier — flow restarts at PGS (re-check). PGS notified.',
    isRecheck: false,
  })

  return { reset: true, remaining: 0 }
}
