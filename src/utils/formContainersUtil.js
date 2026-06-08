/**
 * 计算箱数和 gross weight
 * @param containers 箱信息
 * @returns {{containersCount: number, maxGrossWeight: number}}
 */
export function resolveFormContainers(containers) {
  // 箱数
  let containersCount = 0;
  // 最大 gross weight
  let maxGrossWeight = 0;
  // 遍历箱信息
  for (let container of containers) {
    // 1.目前PEPCO制定针对所有的DC ，每个shipment 订舱的集装箱数不会超过8个，能否SM是定每个shipper booking FCL的情况下不超过10个。
    // 也就是不允许shipper在提交shipper booking的时候填写大于等于10的箱量。
    // console.log('container', container)
    if (container.qty && Number(container.qty) > 0) {
      containersCount += Number(container.qty)
    }
    // 2.目前PEPCO规定 20GP max gross weight 不超过19.5T 40GP/40HQ 不超过21.5吨。
    // 为了防止shipper 乱输入 gross weight， SM设置 20GP 毛重不得输入超过20吨，40GP/HQ不得超过22吨。
    // 同样的这个要换算成总数，比如这票shipper booking 是5*20GP，那么总重量不得超过100吨。
    if(container.type === '20DC' && container.qty){// 20GP
      maxGrossWeight += container.qty * 20000
    }else if((container.type === '40DC' || container.type === '40HC') && container.qty){// 40GP/HQ
      maxGrossWeight += container.qty * 22000
    }
  }
  return {
    containersCount,// 箱数
    maxGrossWeight// 最大 gross weight
  }
}

/**
 * 校验 gross weight：仅 20DC/40DC/40HC 有上限；重量为 0 不可提交
 */
export function validateContainersGrossWeight(maxGrossWeight, grossWeightCount) {
  if (!grossWeightCount || Number(grossWeightCount) <= 0) {
    return 'Gross weight cannot be 0'
  }
  if (maxGrossWeight > 0 && Number(grossWeightCount) > maxGrossWeight) {
    return 'The value entered for gross weight is too large, please re-enter'
  }
  return null
}

const REEFER_FIELD_DEFAULTS = {
  ventClosedOrNot: '',
  requireTemperature: '',
  humidity: '',
  o2: '',
  co2: '',
  drains: ''
}

/**
 * 判断箱型是否为冷藏箱
 */
export function isReeferContainerType(containerType, containerOptions) {
  if (!containerType || !containerOptions || !containerOptions.length) {
    return false
  }
  const option = containerOptions.find(item => item.type === containerType)
  return !!(option && option.isReeferContainer === 'Yes')
}

/**
 * 清空单个集装箱的冷藏字段
 */
export function clearContainerReeferFields(container) {
  Object.keys(REEFER_FIELD_DEFAULTS).forEach(field => {
    container[field] = REEFER_FIELD_DEFAULTS[field]
  })
  return container
}

/**
 * 非冷藏箱清空冷藏字段；冷藏箱保留原值
 * @param typeKey shipment 用 containerType，pepco 用 type
 */
export function applyReeferFieldsForContainer(container, containerOptions, typeKey = 'containerType') {
  if (!containerOptions || !containerOptions.length) {
    return container
  }
  if (!isReeferContainerType(container[typeKey], containerOptions)) {
    return clearContainerReeferFields(container)
  }
  return container
}

/**
 * 提交前批量清理非冷藏箱的冷藏字段
 */
export function sanitizeContainersReeferFields(containers, containerOptions, typeKey = 'containerType') {
  if (!containers || !containers.length) {
    return containers || []
  }
  return containers.map(container => applyReeferFieldsForContainer({ ...container }, containerOptions, typeKey))
}

const TEMPERATURE_REQUIRED_RULE = [
  {
    validator(rule, value, callback) {
      if (!String(value || '').trim()) {
        callback(new Error('  '))
      } else {
        callback()
      }
    },
    trigger: ['change', 'blur']
  }
]

/** Equipment Quantity 必填且大于 0（仅标红，不显示文字） */
export const CONTAINER_QUANTITY_RULES = [
  {
    validator(rule, value, callback) {
      if (value == null || value === '' || Number(value) <= 0) {
        callback(new Error('  '))
      } else {
        callback()
      }
    },
    trigger: ['change', 'blur']
  }
]

export function containerQuantityRules() {
  return CONTAINER_QUANTITY_RULES
}

/** 冷藏箱温度字段校验规则；非冷藏箱返回空规则 */
export function containerTemperatureRules(containerType, containerOptions) {
  return isReeferContainerType(containerType, containerOptions) ? TEMPERATURE_REQUIRED_RULE : []
}

/** 冷藏箱才注册 prop，避免切换箱型后仍校验温度 */
export function containerTemperatureProp(index, containerType, containerOptions) {
  return isReeferContainerType(containerType, containerOptions)
    ? `containers.${index}.requireTemperature`
    : undefined
}

/** 切换箱型后清除非冷藏箱的温度校验状态 */
export function clearNonReeferTemperatureValidation(formRef, containers, containerOptions, typeKey = 'containerType') {
  if (!formRef || !containers || !containers.length) {
    return
  }
  containers.forEach((container, index) => {
    if (!isReeferContainerType(container[typeKey], containerOptions)) {
      formRef.clearValidate(`containers.${index}.requireTemperature`)
    }
  })
}

function resolveEquipmentType(con) {
  if (con.containerType != null && String(con.containerType).trim() !== '') {
    return String(con.containerType)
  }
  if (con.type != null && String(con.type).trim() !== '' && !/^\d+$/.test(String(con.type))) {
    return String(con.type)
  }
  return ''
}

/** Shipper Booking 集装箱 → Carrier Shipment 表单结构 */
export function mapShippingOrderContainerToShipmentForm(con) {
  return {
    containerType: resolveEquipmentType(con),
    numbers: con.qty != null ? Number(con.qty) : (con.numbers != null ? Number(con.numbers) : null),
    ventClosedOrNot: con.ventClosedOrNot != null ? String(con.ventClosedOrNot) : '',
    requireTemperature: con.requireTemperature != null ? String(con.requireTemperature) : '',
    humidity: con.humidity != null ? String(con.humidity) : '',
    o2: con.o2 != null ? String(con.o2) : '',
    co2: con.co2 != null ? String(con.co2) : '',
    drains: con.drains != null ? String(con.drains) : '',
    soc: con.soc === true || con.soc === 1 || con.soc === 'Yes',
    type: 0
  }
}

/** 表单行补全响应式字段 */
export function ensureContainerRowFields(container, template) {
  if (!container || !template) {
    return container
  }
  Object.keys(template).forEach(key => {
    if (!(key in container)) {
      container[key] = template[key]
    }
  })
  return container
}

/** 从 Shipper Booking 回填缺失的冷藏字段（如草稿保存时字段被清空） */
export function backfillReeferFieldsFromShippingOrder(containers, shippingOrderContainers, containerOptions, typeKey = 'containerType') {
  if (!containers || !containers.length || !shippingOrderContainers || !shippingOrderContainers.length || !containerOptions || !containerOptions.length) {
    return containers
  }
  containers.forEach(container => {
    const equipmentType = container[typeKey]
    if (!isReeferContainerType(equipmentType, containerOptions)) {
      return
    }
    const soContainer = shippingOrderContainers.find(item => resolveEquipmentType(item) === String(equipmentType))
    if (!soContainer) {
      return
    }
    const source = mapShippingOrderContainerToShipmentForm(soContainer)
    Object.keys(REEFER_FIELD_DEFAULTS).forEach(field => {
      if (!String(container[field] || '').trim() && String(source[field] || '').trim()) {
        container[field] = source[field]
      }
    })
  })
  return containers
}
