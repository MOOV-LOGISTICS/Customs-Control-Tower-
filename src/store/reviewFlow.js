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
  thread: [],                   // discussion: [{ by, role:'supplier'|'reviewer', text, at, system? }]
  resolution: 'PENDING',        // PENDING | RESUBMITTED | ACCEPTED_AS_IS (meaningful once rejected)
  awaitingReviewer: false,      // true = supplier responded, ball is in the reviewer's court
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
          { reason: 'V002 - Incorrect shipping docs', remark: 'CI date mismatch vs PL', by: 'Sarah J. (PGS)', at: '2024-11-11 14:20', milestone: 'PGS Document Check', milestoneKey: 'PGS', round: 1 },
          [{ version: 1, fileName: 'INV-240003.pdf', uploadedAt: '2024-11-09 14:00', status: 'VERIFIED' }], 'INV-2401-3301'),
        doc('Packing List', 'PL-240003-v2.pdf', 2, 'PO-2401-3001', '2024-11-13 11:32', 'RESUBMITTED',
          { reason: 'V002 - Incorrect shipping docs', remark: 'Re-uploaded together with CI', by: 'Sarah J. (PGS)', at: '2024-11-11 14:20', milestone: 'PGS Document Check', milestoneKey: 'PGS', round: 1 },
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
          { reason: 'V003 - Missing/incorrect sanitary docs', remark: 'Sanitary cert expiry date does not match shipment ETA', by: 'Anna W. (Customs)', at: '2024-11-17 11:45', milestone: 'Customs Document Check', milestoneKey: 'CUSTOMS', round: 1 },
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

// ── Demo seed: an in-progress discussion on the pending-correction HBL ─────────
// MOOV240006's Sanitary Certificate was returned by Customs; supplier has replied
// arguing the document is valid, so the ball is in the reviewer's court. The
// pre-reject snapshot lets an "accept as-is" resume the flow at Customs.
const _h6 = reviewStore.hbls.find(h => h.hblNo === 'MOOV240006')
if (_h6) {
  _h6._preReject = {
    PGS:     { status: 'COMPLETE', completedBy: 'Sarah J. (PGS)',   completedAt: '2024-11-15 10:00 CET (UTC+1)', isRecheck: false, lockReason: '' },
    FINANCE: { status: 'COMPLETE', completedBy: 'Tom K. (Finance)', completedAt: '2024-11-16 09:30 CET (UTC+1)', isRecheck: false, lockReason: '' },
    CUSTOMS: { status: 'IN_PROGRESS', completedBy: null, completedAt: null, isRecheck: false, lockReason: '' },
  }
  const _san = _h6.documents.find(d => d.docType === 'Sanitary Certificate')
  if (_san) {
    _san.thread = [
      { by: 'Anna W. (Customs)', role: 'reviewer',
        text: 'The sanitary certificate expiry date (2024-11-30) is earlier than the shipment ETA (2024-12-18). Please provide a valid certificate.',
        at: '2024-11-17 11:45' },
      { by: 'Guangzhou Clothing Co. (Supplier)', role: 'supplier',
        text: 'This certificate is the latest one issued by the authority for this product batch. The goods clear customs at origin before the expiry date — the ETA is the destination arrival. Could you confirm whether the origin-clearance date applies here?',
        at: '2024-11-18 02:10' },
    ]
    _san.awaitingReviewer = true
  }
}

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
    // A returned document is "resolved" once it is no longer REJECTED —
    // either re-uploaded by the supplier or accepted as-is by the reviewer.
    done: inRound.filter(d => d.reviewStatus !== 'REJECTED').length,
    docs: inRound,
  }
}

// ── Mutations ────────────────────────────────────────────────────────────────

// PEPCO rejects specific documents at a milestone:
// docs → REJECTED (with reason), all milestones → PENDING_CORRECTION
export function rejectDocuments(hbl, docs, { reason, remark, milestoneName, milestoneKey, user }) {
  hbl.correctionRound++
  const at = nowStr()

  // Snapshot the milestone states BEFORE the rejection overwrites them, so a
  // later "accept as-is" (no re-upload) can resume the flow exactly here
  // instead of forcing a full PGS re-check.
  hbl._preReject = {}
  Object.keys(hbl.milestones).forEach(k => {
    const m = hbl.milestones[k]
    hbl._preReject[k] = {
      status: m.status, completedBy: m.completedBy, completedAt: m.completedAt,
      isRecheck: m.isRecheck, lockReason: m.lockReason,
    }
  })

  docs.forEach(d => {
    d.reviewStatus = 'REJECTED'
    d.resolution = 'PENDING'
    d.awaitingReviewer = false
    d.reject = { reason, remark: remark || '', by: user, at, milestone: milestoneName, milestoneKey: milestoneKey || 'PGS', round: hbl.correctionRound }
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

const MS_NAME = { PGS: 'PGS Check', FINANCE: 'Finance Check', CUSTOMS: 'Customs Check' }

// Supplier re-uploads a rejected document (the content has changed).
export function resubmitDocument(hbl, document, fileName, user) {
  document.fileName = fileName
  document.version += 1
  document.uploadedAt = nowStr().replace(' CET (UTC+1)', '')
  document.reviewStatus = 'RESUBMITTED'
  document.resolution = 'RESUBMITTED'
  document.awaitingReviewer = false
  return finalizeIfDone(hbl, user)
}

// Reviewer accepts a returned document as-is after discussion — no new upload.
// Used when the supplier argues the current file is already correct and the
// reviewer agrees.
export function acceptDocumentAsIs(hbl, document, user) {
  document.reviewStatus = 'OK'
  document.resolution = 'ACCEPTED_AS_IS'
  document.awaitingReviewer = false
  document.thread.push({
    by: user, role: 'reviewer', system: true,
    text: 'Accepted as-is — supplier clarification approved, no re-upload required.',
    at: nowStr().replace(' CET (UTC+1)', ''),
  })
  return finalizeIfDone(hbl, user)
}

// Append a message to a document's discussion thread. Pure communication:
// milestones are NOT touched, so the document stays at the same review stage.
export function postComment(hbl, document, { text, role, user }) {
  const at = nowStr().replace(' CET (UTC+1)', '')
  document.thread.push({ by: user, role, text, at })
  document.awaitingReviewer = role === 'supplier'
  hbl.verifyHistory.unshift({
    milestone: 'Discussion',
    status: role === 'supplier' ? 'Supplier Note' : 'Reviewer Note',
    user, time: nowStr(), reason: '', remark: text, isRecheck: false,
  })
}

// Once no returned document is still REJECTED, close out the correction round:
//   · any document was re-uploaded (content changed) → full reset to PGS re-check
//   · all were accepted as-is (only clarified)        → resume at the rejection milestone
function finalizeIfDone(hbl, user) {
  const remaining = hbl.documents.filter(d => d.reviewStatus === 'REJECTED').length
  if (remaining > 0) return { reset: false, finalized: false, remaining }

  const ORDER = ['PGS', 'FINANCE', 'CUSTOMS']
  const round = hbl.correctionRound
  const roundDocs = hbl.documents.filter(d => d.reject && d.reject.round === round)
  const anyResubmit = roundDocs.some(d => d.resolution === 'RESUBMITTED')

  if (anyResubmit) {
    // Content changed somewhere → re-check the whole flow from PGS
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
      user: user || 'System', time: nowStr(), reason: '',
      remark: 'All returned documents resolved (with re-uploads) — flow restarts at PGS (re-check). PGS notified.',
      isRecheck: false,
    })
    return { reset: true, finalized: true, resumedAt: 'PGS' }
  }

  // Pure clarification — restore the pre-rejection state and complete the
  // milestone that returned the document, exactly as a normal approval would.
  const mk = (roundDocs[0].reject && roundDocs[0].reject.milestoneKey) || 'PGS'
  const snap = hbl._preReject
  if (snap) {
    ORDER.forEach(k => {
      const m = hbl.milestones[k], s = snap[k]
      m.status = s.status; m.completedBy = s.completedBy; m.completedAt = s.completedAt
      m.isRecheck = s.isRecheck; m.lockReason = s.lockReason
    })
  }
  const at = nowStr()
  const m = hbl.milestones[mk]
  m.status = 'COMPLETE'; m.completedBy = user; m.completedAt = at; m.isRecheck = false; m.lockReason = ''
  const idx = ORDER.indexOf(mk)
  if (idx < ORDER.length - 1) {
    const next = ORDER[idx + 1]
    if (hbl.milestones[next].status === 'LOCKED') {
      hbl.milestones[next].status = 'IN_PROGRESS'; hbl.milestones[next].lockReason = ''
    }
  }
  hbl.verifyHistory.unshift({
    milestone: MS_NAME[mk] || mk, status: 'Complete',
    user, time: at, reason: '',
    remark: 'Approved after discussion — supplier clarification accepted, no re-upload required.',
    isRecheck: false,
  })
  return { reset: false, finalized: true, resumedAt: mk }
}
