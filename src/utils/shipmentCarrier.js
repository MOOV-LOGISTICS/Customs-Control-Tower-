/**
 * Create Shipment
 * 不同的Carrier所对应的Carriage Term去做一个对应设置
 * @type
 */
const shipmentCarrier = [
  {
    // Carrier: CMA CGM
    carrier: 'CMDU',
    // Carriage Term: CY-Door、CY/CY
    options: ['MD', 'CY/CY']
  },
  {
    // Carrier: Maersk
    carrier: 'MAEU',
    // Carriage Term: CY-CY、CY-Door
    options: ['CY/CY', 'MD']
  },
  {
    // Carrier: MSC
    carrier: 'MSCU',
    // Carriage Term: CY-Door
    options: ['MD','CY/CY']
  },
  {
    // Carrier: COSCO
    carrier: 'COSU',
    // Carriage Term: CY-Door
    options: ['MD','CY/CY']
  }
]

export default shipmentCarrier
