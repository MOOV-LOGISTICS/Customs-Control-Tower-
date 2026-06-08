/**
 * Mock API interceptor for smartMOOV Customs Demo
 * Intercepts all axios requests and returns mock data
 * so the frontend can run completely without a backend.
 */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

export function setupMock(axiosInstance) {
  const mock = new MockAdapter(axiosInstance, { delayResponse: 300, onNoMatch: 'passthrough' })

  // ─── Auth ────────────────────────────────────────────────────────────────

  // Login
  mock.onPost(/\/system\/auth\/login/).reply(200, {
    code: 200,
    data: {
      accessToken: 'mock-access-token-demo-12345',
      refreshToken: 'mock-refresh-token-demo-12345',
      expiresTime: Date.now() + 24 * 60 * 60 * 1000,
      userId: 1,
      tenantId: 1
    }
  })

  // Refresh token
  mock.onPost(/\/system\/auth\/refresh-token/).reply(200, {
    code: 200,
    data: {
      accessToken: 'mock-access-token-demo-12345',
      refreshToken: 'mock-refresh-token-demo-12345',
      expiresTime: Date.now() + 24 * 60 * 60 * 1000,
    }
  })

  // Logout
  mock.onPost(/\/system\/auth\/logout/).reply(200, { code: 200, data: true })

  // Get user info + permissions
  mock.onGet(/\/system\/auth\/get-permission-info/).reply(200, {
    code: 200,
    data: {
      user: {
        id: 1,
        username: 'demo',
        nickname: 'Demo User',
        email: 'demo@moovlogistics.com',
        mobile: '',
        avatar: '',
        deptId: 1,
        status: 0,
        remark: '',
        loginDate: new Date().toISOString(),
      },
      roles: ['SUPER_ADMIN', 'MOOV_OPS', 'PEPCO_CUSTOMS'],
      permissions: ['*:*:*'], // full permissions for demo
    }
  })

  // Menu list (routes)
  mock.onGet(/\/system\/auth\/list-menus/).reply(200, {
    code: 200,
    data: [
      {
        id: 100,
        name: 'Pepco Shipping',
        path: '/pepco-shipping',
        component: 'Layout',
        meta: { title: 'Pepco Shipping', icon: 'shipping', noCache: false },
        children: [
          {
            id: 101,
            name: 'OrderList',
            path: 'order-list',
            component: 'pepcoShipping/index',
            meta: { title: 'Order List', noCache: false }
          },
          {
            id: 102,
            name: 'AsnDocuments',
            path: 'asn-documents',
            component: 'asnDocument/index',
            meta: { title: 'Documents', noCache: false }
          }
        ]
      },
      {
        id: 200,
        name: 'Customs',
        path: '/customs',
        component: 'Layout',
        meta: { title: 'Customs', icon: 'document', noCache: false },
        children: [
          {
            id: 201,
            name: 'CustomsDashboard',
            path: 'dashboard',
            component: 'customs/dashboard/index',
            meta: { title: 'Customs Dashboard', noCache: false }
          },
          {
            id: 202,
            name: 'DocumentUpload',
            path: 'document-upload',
            component: 'customs/documentUpload/index',
            meta: { title: 'Document Upload', noCache: false }
          },
          {
            id: 203,
            name: 'PepcoReview',
            path: 'pepco-review',
            component: 'customs/pepcoReview/index',
            meta: { title: 'Pepco Review', noCache: false }
          },
          {
            id: 204,
            name: 'BrokerDownload',
            path: 'broker-download',
            component: 'customs/brokerDownload/index',
            meta: { title: 'Broker Downloads', noCache: false }
          }
        ]
      }
    ]
  })

  // ─── Tenant ──────────────────────────────────────────────────────────────

  mock.onGet(/\/system\/tenant\/get-id-by-name/).reply(200, {
    code: 200,
    data: 1
  })

  // ─── Captcha ─────────────────────────────────────────────────────────────

  mock.onPost(/\/system\/captcha\/get/).reply(200, {
    code: 200,
    data: { repCode: '0000', repData: { token: 'mock-captcha', secretKey: '', originalImageBase64: '', jigsawImageBase64: '' } }
  })
  mock.onPost(/\/system\/captcha\/check/).reply(200, {
    code: 200,
    data: { repCode: '0000', repMsg: 'success' }
  })

  // ─── Dict data ───────────────────────────────────────────────────────────

  mock.onGet(/\/system\/dict\/data\/type\//).reply(200, { code: 200, data: [] })
  mock.onGet(/\/system\/dict\/data\/list/).reply(200, { code: 200, data: { list: [], total: 0 } })

  // ─── Config ──────────────────────────────────────────────────────────────

  mock.onGet(/\/infra\/config\/get-value-by-key/).reply(200, { code: 200, data: null })

  // ─── Privacy ─────────────────────────────────────────────────────────────

  mock.onGet(/\/system\/privacy-agreement\/latest/).reply(200, {
    code: 200,
    data: { id: 1, content: 'Demo privacy agreement', version: '1.0' }
  })

  // ─── File upload ─────────────────────────────────────────────────────────

  mock.onPost(/\/infra\/file\/upload/).reply(200, {
    code: 200,
    data: 'https://placehold.co/400x300?text=Uploaded+File'
  })

  // ─── Shipment / HBL (existing pages) ─────────────────────────────────────

  mock.onGet(/\/shipping\/order\/list-page/).reply(200, {
    code: 200,
    data: {
      list: generateMockHblList(),
      total: 12
    }
  })

  mock.onGet(/\/shipping\/order\/get/).reply(200, {
    code: 200,
    data: generateMockHblDetail()
  })

  // ─── Customs: Document Upload ─────────────────────────────────────────────

  mock.onGet(/\/customs\/document\/list/).reply(200, {
    code: 200,
    data: generateMockDocuments()
  })

  mock.onPost(/\/customs\/document\/upload/).reply(config => {
    return [200, {
      code: 200,
      data: {
        id: Math.floor(Math.random() * 10000),
        status: 'VERIFIED',
        aiVerificationResult: {
          matched: true,
          confidence: 0.97,
          matchedFields: ['Invoice No', 'HBL No', 'Supplier Name'],
          message: 'Document verified successfully. Invoice INV-2024-00123 matches HBL MOOV240001.'
        }
      }
    }]
  })

  mock.onPost(/\/customs\/document\/upload-mismatch/).reply(200, {
    code: 200,
    data: {
      id: Math.floor(Math.random() * 10000),
      status: 'UNVERIFIED',
      aiVerificationResult: {
        matched: false,
        confidence: 0.12,
        matchedFields: [],
        mismatchedFields: ['Invoice No', 'HBL No'],
        message: 'Mismatch detected: Invoice INV-2024-99999 does not match HBL MOOV240001. Expected invoice reference MOOV240001-INV.'
      }
    }
  })

  // ─── Customs: Milestone Review ────────────────────────────────────────────

  mock.onGet(/\/customs\/milestone\/get/).reply(200, {
    code: 200,
    data: generateMockMilestones()
  })

  mock.onPost(/\/customs\/milestone\/approve/).reply(200, {
    code: 200,
    data: { success: true }
  })

  mock.onPost(/\/customs\/milestone\/reject/).reply(200, {
    code: 200,
    data: { success: true }
  })

  mock.onPost(/\/customs\/milestone\/reset/).reply(200, {
    code: 200,
    data: { success: true }
  })

  // ─── Customs: Broker ──────────────────────────────────────────────────────

  mock.onGet(/\/customs\/broker\/shipment-list/).reply(200, {
    code: 200,
    data: {
      list: generateMockBrokerShipments(),
      total: 5
    }
  })

  mock.onPost(/\/customs\/broker\/bulk-download/).reply(200, {
    code: 200,
    data: { downloadUrl: '#', fileCount: 4 }
  })

  // ─── Catch-all: return empty success for any unmatched API ───────────────

  mock.onAny(/\/admin-api\//).reply(200, { code: 200, data: null })

  return mock
}

// ─── Mock data generators ──────────────────────────────────────────────────

function generateMockHblList() {
  return [
    { id: 1, hblNo: 'MOOV240001', mblNo: 'MAEU240001', supplierName: 'Shanghai Textile Co.', pol: 'CNSHA', pod: 'PLGDN', etd: '2024-11-10', eta: '2024-12-05', customsStatus: 'DOCS_PENDING', brokerName: 'EuroCustoms Sp.z.o.o.' },
    { id: 2, hblNo: 'MOOV240002', mblNo: 'MAEU240002', supplierName: 'Dhaka Garments Ltd.', pol: 'BGCGP', pod: 'DEHAM', etd: '2024-11-12', eta: '2024-12-15', customsStatus: 'PGS_REVIEW', brokerName: 'Hamburg Customs GmbH' },
    { id: 3, hblNo: 'MOOV240003', mblNo: 'CMDU240003', supplierName: 'Ho Chi Minh Apparel', pol: 'VNSGN', pod: 'CZPRE', etd: '2024-11-08', eta: '2024-12-02', customsStatus: 'FINANCE_REVIEW', brokerName: 'Prague Broker s.r.o.' },
    { id: 4, hblNo: 'MOOV240004', mblNo: 'HLCU240004', supplierName: 'Istanbul Fashion AS', pol: 'TRIST', pod: 'ROBUH', etd: '2024-11-15', eta: '2024-12-10', customsStatus: 'CUSTOMS_REVIEW', brokerName: 'Bucharest Customs SRL' },
    { id: 5, hblNo: 'MOOV240005', mblNo: 'MAEU240005', supplierName: 'Mumbai Textiles Pvt', pol: 'INNSA', pod: 'HUBU', etd: '2024-11-05', eta: '2024-11-28', customsStatus: 'DOCS_READY', brokerName: 'Budapest Logistics Kft' },
    { id: 6, hblNo: 'MOOV240006', mblNo: 'EGLV240006', supplierName: 'Guangzhou Clothing Co.', pol: 'CNGZU', pod: 'PLWAW', etd: '2024-11-18', eta: '2024-12-18', customsStatus: 'REJECTED', brokerName: 'Warsaw Customs Sp.z.o.o.' },
  ]
}

function generateMockHblDetail() {
  return {
    id: 1,
    hblNo: 'MOOV240001',
    mblNo: 'MAEU240001',
    supplierName: 'Shanghai Textile Co.',
    pol: 'CNSHA',
    pod: 'PLGDN',
    etd: '2024-11-10',
    eta: '2024-12-05',
    containerCount: 2,
    containers: ['MSKU1234567', 'MSKU7654321'],
    customsStatus: 'PGS_REVIEW',
    brokerName: 'EuroCustoms Sp.z.o.o.',
    brokerEmail: 'broker@eurocustoms.pl',
  }
}

function generateMockDocuments() {
  return [
    { id: 1, docType: 'COMMERCIAL_INVOICE', docTypeLabel: 'Commercial Invoice', fileName: 'INV-2024-00123.pdf', version: 1, status: 'VERIFIED', uploadedBy: 'Supplier', uploadedAt: '2024-11-11 09:23', fileSize: '245 KB', fileUrl: '#' },
    { id: 2, docType: 'PACKING_LIST', docTypeLabel: 'Packing List', fileName: 'PL-2024-00123.pdf', version: 1, status: 'VERIFIED', uploadedBy: 'Supplier', uploadedAt: '2024-11-11 09:25', fileSize: '187 KB', fileUrl: '#' },
    { id: 3, docType: 'BILL_OF_LADING', docTypeLabel: 'Bill of Lading', fileName: 'HBL-MOOV240001.pdf', version: 2, status: 'VERIFIED', uploadedBy: 'Supplier', uploadedAt: '2024-11-12 14:10', fileSize: '312 KB', fileUrl: '#', isRevision: true },
    { id: 4, docType: 'CERTIFICATE_OF_ORIGIN', docTypeLabel: 'Certificate of Origin', fileName: 'CO-2024-00123.pdf', version: 1, status: 'UNVERIFIED', uploadedBy: 'Supplier', uploadedAt: '2024-11-12 16:45', fileSize: '156 KB', fileUrl: '#', needsOHAReview: true },
  ]
}

function generateMockMilestones() {
  return {
    hblNo: 'MOOV240001',
    milestones: [
      {
        id: 1,
        code: 'PGS_CHECK',
        name: 'Pepco Global Sourcing Document Check',
        status: 'COMPLETED',
        completedAt: '2024-11-13 10:30',
        completedBy: 'Sarah Johnson (PGS)',
        isRecheck: false,
        history: []
      },
      {
        id: 2,
        code: 'FINANCE_CHECK',
        name: 'Pepco Finance Document Check',
        status: 'IN_PROGRESS',
        completedAt: null,
        completedBy: null,
        isRecheck: false,
        locked: false,
        history: []
      },
      {
        id: 3,
        code: 'CUSTOMS_CHECK',
        name: 'Pepco Customs Document & Sanitary Check',
        status: 'PENDING',
        completedAt: null,
        completedBy: null,
        isRecheck: false,
        locked: true,
        lockReason: 'Waiting for Finance Check to complete',
        history: []
      }
    ]
  }
}

function generateMockBrokerShipments() {
  return [
    {
      id: 5,
      hblNo: 'MOOV240005',
      mblNo: 'MAEU240005',
      supplierName: 'Mumbai Textiles Pvt',
      pod: 'HUBU',
      eta: '2024-11-28',
      docsReadyAt: '2024-11-20 14:30',
      documentCount: 4,
      brokerNotifiedAt: '2024-11-20 14:32',
      documents: [
        { id: 1, docType: 'Commercial Invoice', fileName: 'INV-2024-00456.pdf', fileSize: '245 KB' },
        { id: 2, docType: 'Packing List', fileName: 'PL-2024-00456.pdf', fileSize: '187 KB' },
        { id: 3, docType: 'Bill of Lading', fileName: 'HBL-MOOV240005.pdf', fileSize: '312 KB' },
        { id: 4, docType: 'Certificate of Origin', fileName: 'CO-2024-00456.pdf', fileSize: '156 KB' },
      ]
    },
    {
      id: 7,
      hblNo: 'MOOV240007',
      mblNo: 'CMDU240007',
      supplierName: 'Colombo Garments Ltd.',
      pod: 'SKBTS',
      eta: '2024-12-01',
      docsReadyAt: '2024-11-19 09:15',
      documentCount: 3,
      brokerNotifiedAt: '2024-11-19 09:17',
      documents: [
        { id: 5, docType: 'Commercial Invoice', fileName: 'INV-2024-00789.pdf', fileSize: '198 KB' },
        { id: 6, docType: 'Packing List', fileName: 'PL-2024-00789.pdf', fileSize: '143 KB' },
        { id: 7, docType: 'Bill of Lading', fileName: 'HBL-MOOV240007.pdf', fileSize: '289 KB' },
      ]
    }
  ]
}
