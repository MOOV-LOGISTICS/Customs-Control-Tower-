/**
 * transport pre assign
 * 不同的CARRIER POD所对应的FND去做一个对应设置
 */
const transportPAMap = [
  {
    // Carrier: CMA CGM
    carrier: 'CMDU',
    children: [
      {
        // Port of Discharge: Gdansk
        discharge: 'PLGDN',
        // Final Destination: Rawa Mazowiecka、Sosnowiec、Gdansk
        options: ['PLRMA', 'PLSWC', 'PLGDN']
      },
      {
        // Port of Discharge: Koper
        discharge: 'SIKOP',
        // Final Destination: Gyal
        options: ['HUGYL']
      },
      {
        // Port of Discharge: Rijeka
        discharge: 'HRRJK',
        // Final Destination: Gyal
        options: ['HUGYL']
      },
      {
        // Port of Discharge: Hamburg
        discharge: 'DEHAM',
        // Final Destination: Gyal
        options: ['HUGYL']
      },
      {
        // Port of Discharge: Constanta
        discharge: 'ROCND',
        // Final Destination: Bucuresti
        options: ['ROBUH']
      },
      {
        // Port of Discharge: Valencia/BCN(as back up)
        discharge: 'ESVLC',
        // Final Destination: Cabanillas del Campos
        options: ['ESCDO']
      }
    ]
  },
  {
    // Carrier: Maersk
    carrier: 'MAEU',
    children: [
      {
        // Port of Discharge: Gdansk
        discharge: 'PLGDN',
        // Final Destination: Gdansk CY
        options: ['PLGDN']
      },
      {
        // Port of Discharge: Koper
        discharge: 'SIKOP',
        // Final Destination: Koper CY
        options: ['SIKOP', 'HUGYL']
      },
      {
        // Port of Discharge: Constanta
        discharge: 'ROCND',
        // Final Destination: Bucharest
        options: ['ROBUH']
      },
      {
        // Port of Discharge: Valencia
        discharge: 'ESVLC',
        // Final Destination: Cabanillas del Campos
        options: ['ESCDO', 'ESVLC']
      }
    ]
  },
  {
    // Carrier: MSC
    carrier: 'MSCU',
    children: [
      {
        // Port of Discharge: Gdansk/Gdynia
        discharge: 'PLGDN',
        // Final Destination: Rawa Mazowiecka、Sosnowiec,SL、GDANSK, POLAND、GDYNIA, POLAND
        options: ['PLRMA', 'PLSWC', 'PLGDN', 'PLGDY']
      },
      {
        // Port of Discharge: GDYNIA
        discharge: 'PLGDY',
        // Final Destination: Rawa Mazowiecka、Sosnowiec,SL
        options: ['PLRMA', 'PLSWC']
      },
      {
        // Port of Discharge: Trieste
        discharge: 'ITTRS',
        // Final Destination: Gyal
        options: ['HUGYL']
      },
      {
        // Port of Discharge: Constanta
        discharge: 'ROCND',
        // Final Destination: Bucuresti
        options: ['ROBUH']
      },
      {
        // Port of Discharge: Valencia
        discharge: 'ESVLC',
        // Final Destination: cabanillas del campo
        options: ['ESCDO']
      }
    ]
  },
  {
    // Carrier: COSCO
    carrier: 'COSU',
    children: [
      {
        // Port of Discharge: Gdansk
        discharge: 'PLGDN',
        // Final Destination: Rawa Mazowiecka、Sosnowiec
        options: ['PLRMA', 'PLSWC']
      },
      {
        // Port of Discharge: Piraeus
        discharge: 'GRPIR',
        // Final Destination: Gyal
        options: ['HUGYL']
      }
    ]
  }
]

export default transportPAMap
