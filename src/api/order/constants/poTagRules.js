export const PO_TAG_RULES = [
  {
    code: 'OTB',
    label: 'OTB',
    type: 'success',
    match: (row, { dataSource } = {}) =>
      dataSource?.otb == '1' || row.otb == '1'
  },
  {
    code: 'NOS',
    label: 'NOS',
    type: 'primary',
    match: row => row.nos === true || row.nos === '1'
  },
  {
    code: 'CHILDREN_TOY',
    label: 'Children Toy',
    type: 'danger',
    className: 'tag-toy',
    match: (row, { approvalCriteria } = {}) =>
      row.isChildrenToy === true ||
      (
        approvalCriteria?.artStructureMap &&
        approvalCriteria.artStructureMap[row.id] !== 0
      )
  },

  {
    code: 'SANITARY_RISK',
    label: 'Sanitary Risk',
    type: 'warning',
    match: row => !!row.sanitaryRisk
  },
  {
    code: 'CERAMIC',
    label: 'Ceramic Products',
    type: 'info',
    className: 'tag-purple',
    match: row => row.isCeramicProducts === true || row.isCeramicProducts === '1'
  }
]