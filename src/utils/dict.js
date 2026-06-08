/**
 * Created byDean.Tan
 *
 * 数据字典工具类
 */
import store from "@/store";

export const DICT_TYPE = {
  USER_TYPE: "user_type",
  COMMON_STATUS: "common_status",
  SYSTEM_COUNTRY: "system_country",
  SYSTEM_PARTY_ROLE: "system_party_role",
  SHIPMENT_TYPE: "shipment_type",
  INCOTERMS: "incoterms",
  CARRIER: "carrier",
  PAYMENT_METHOD: "payment_method",
  WAREHOUSE_CATEGORY: "warehouse_category",
  WAREHOUSE_TYPE: "warehouse_type",
  ENTERPRISE_TYPE: "enterprise_type",
  MODES_OF_TRANSPORT: "modes_of_transport",
  // 增加Pepco 的 MODES_OF_TRANSPORT
  MODE_OF_TRANSPORT_PEPCO: "mode_of_transport_pepco",
  PEPCO: "pepco",
  PEPCO_TOY_HIERARCHY_INDEX: "pepco_toy_hierarchy_index",
  PEPCO_DC_CODE: "pepco_dc_code",

  SHIPMENT_STATUS: "shipment_status",
  SYSTEM_UNITS: "system_units",
  VESSEL: "system_vessel",
  HS_CODE: "hs_code",
  PRODUCT_TYPE_HAZARDOUS_MATERIALS: "product_type_hazardous_materials",
  PRODUCT_TYPE_OTHERS: "product_type_others",
  UNIT_OF_WEIGHT: "unit_of_weight",
  UNIT_OF_VOLUME: "unit_of_volume",
  TERMINAL: "terminal",
  CONTRACT_TYPE: "contract_type",
  CARRIAGE_CONTRACT: "carriage_contract",
  PAYMENT_TERM: "payment_term",
  FIELD_TYPE: "field_type",
  BL_TYPE: "bl_type",
  BLSamples: "blsamples",
  SHIPMENT_NOTE_VIEW: "shipment_Note_view",
  SHOW_TMFF: "show_tmff",
  SINOTRANS_CARRIER: "sinotrans_carrier",
  SINOTRANS_AMS: "sinotrans_ams",
  // 增加incoterm
  SHIPPING_INCOTERM: "shipping_incoterm",
  // Pepco Shipping Named Place
  SHIPPING_NAMED_PLACE: "pepco_shipping_named_place",
  CARRIER_POD_CV_FND: "carrier_pod_cv_fnd",
  MISS_IN_DC_DATE_LOG: "miss_in_dc_date_log",

  // ========== SYSTEM 模块 ==========
  SYSTEM_USER_SEX: "system_user_sex",
  SYSTEM_MENU_TYPE: "system_menu_type",
  SYSTEM_ROLE_TYPE: "system_role_type",
  SYSTEM_DATA_SCOPE: "system_data_scope",
  SYSTEM_NOTICE_TYPE: "system_notice_type",
  SYSTEM_OPERATE_TYPE: "system_operate_type",
  SYSTEM_LOGIN_TYPE: "system_login_type",
  SYSTEM_LOGIN_RESULT: "system_login_result",
  SYSTEM_SMS_CHANNEL_CODE: "system_sms_channel_code",
  SYSTEM_SMS_TEMPLATE_TYPE: "system_sms_template_type",
  SYSTEM_SMS_SEND_STATUS: "system_sms_send_status",
  SYSTEM_SMS_RECEIVE_STATUS: "system_sms_receive_status",
  SYSTEM_ERROR_CODE_TYPE: "system_error_code_type",
  SYSTEM_OAUTH2_GRANT_TYPE: "system_oauth2_grant_type",
  SYSTEM_MAIL_SEND_STATUS: "system_mail_send_status",
  SYSTEM_NOTIFY_TEMPLATE_TYPE: "system_notify_template_type",
  SYSTEM_DICT_RANGE: "system_dict_range",
  SYSTEM_STAR: "system_star",

  // ========== INFRA 模块 ==========
  INFRA_BOOLEAN_STRING: "infra_boolean_string",
  INFRA_REDIS_TIMEOUT_TYPE: "infra_redis_timeout_type",
  INFRA_JOB_STATUS: "infra_job_status",
  INFRA_JOB_LOG_STATUS: "infra_job_log_status",
  INFRA_API_ERROR_LOG_PROCESS_STATUS: "infra_api_error_log_process_status",
  INFRA_CONFIG_TYPE: "infra_config_type",
  INFRA_CODEGEN_TEMPLATE_TYPE: "infra_codegen_template_type",
  INFRA_CODEGEN_FRONT_TYPE: "infra_codegen_front_type",
  INFRA_CODEGEN_SCENE: "infra_codegen_scene",
  INFRA_FILE_STORAGE: "infra_file_storage",

  // ========== BPM 模块 ==========
  BPM_MODEL_CATEGORY: "bpm_model_category",
  BPM_MODEL_FORM_TYPE: "bpm_model_form_type",
  BPM_TASK_ASSIGN_RULE_TYPE: "bpm_task_assign_rule_type",
  BPM_PROCESS_INSTANCE_STATUS: "bpm_process_instance_status",
  BPM_PROCESS_INSTANCE_RESULT: "bpm_process_instance_result",
  BPM_TASK_ASSIGN_SCRIPT: "bpm_task_assign_script",
  BPM_OA_LEAVE_TYPE: "bpm_oa_leave_type",

  // ========== PAY 模块 ==========
  PAY_CHANNEL_WECHAT_VERSION: "pay_channel_wechat_version", // 微信渠道版本
  PAY_CHANNEL_ALIPAY_SIGN_TYPE: "pay_channel_alipay_sign_type", // 支付渠道支付宝算法类型
  PAY_CHANNEL_ALIPAY_MODE: "pay_channel_alipay_mode", // 支付宝公钥类型
  PAY_CHANNEL_ALIPAY_SERVER_TYPE: "pay_channel_alipay_server_type", // 支付宝网关地址
  PAY_CHANNEL_CODE_TYPE: "pay_channel_code_type", // 支付渠道编码类型
  PAY_ORDER_NOTIFY_STATUS: "pay_order_notify_status", // 商户支付订单回调状态
  PAY_ORDER_STATUS: "pay_order_status", // 商户支付订单状态
  PAY_ORDER_REFUND_STATUS: "pay_order_refund_status", // 商户支付订单退款状态
  PAY_REFUND_ORDER_STATUS: "pay_refund_order_status", // 退款订单状态
  PAY_REFUND_ORDER_TYPE: "pay_refund_order_type", // 退款订单类别

  // ========== MP 模块 ==========
  MP_AUTO_REPLY_REQUEST_MATCH: "mp_auto_reply_request_match", // 自动回复请求匹配类型
  MP_MESSAGE_TYPE: "mp_message_type", // 消息类型

  // ========== MALL - PRODUCT 模块 ==========
  PRODUCT_SPU_STATUS: "product_spu_status", // 商品 SPU 状态

  // ========== MALL - ORDER 模块 ==========
  TRADE_AFTER_SALE_STATUS: "trade_after_sale_status", // 售后 - 状态
  TRADE_AFTER_SALE_WAY: "trade_after_sale_way", // 售后 - 方式
  TRADE_AFTER_SALE_TYPE: "trade_after_sale_type", // 售后 - 类型
  TRADE_ORDER_TYPE: "trade_order_type", // 订单 - 类型
  TRADE_ORDER_STATUS: "trade_order_status", // 订单 - 状态
  TRADE_ORDER_ITEM_AFTER_SALE_STATUS: "trade_order_item_after_sale_status", // 订单项 - 售后状态

  // ========== MALL - PROMOTION 模块 ==========
  PROMOTION_DISCOUNT_TYPE: "promotion_discount_type", // 优惠类型
  PROMOTION_PRODUCT_SCOPE: "promotion_product_scope", // 营销的商品范围
  PROMOTION_COUPON_TEMPLATE_VALIDITY_TYPE:
    "promotion_coupon_template_validity_type", // 优惠劵模板的有限期类型
  PROMOTION_COUPON_STATUS: "promotion_coupon_status", // 优惠劵的状态
  PROMOTION_COUPON_TAKE_TYPE: "promotion_coupon_take_type", // 优惠劵的领取方式
  PROMOTION_ACTIVITY_STATUS: "promotion_activity_status", // 优惠活动的状态
  PROMOTION_CONDITION_TYPE: "promotion_condition_type", // 营销的条件类型枚举

  CHANGE_VESSEL_REASON: "change_vessel_reason", // 换船原因

  PUSH_TO_NINGBO_WMS_TENANT: "PushToNingboWMSTenant", // PushToNingboWMSTenant

  CARGO_READY_DATE_REASON_CODE: "cargo_ready_date_reason_code",

  CARGO_INBOUND_REASON_CODE: "cargo_inbound_reason_code", // Cargo Inbound Reason Code

  // ========== Pepco - Contract  ==========
  PEPCO_CONTRACT_TYPE: "pepco_contract_type", // 合同类型
  Reason_Of_Premium: "premium_reason", // 额外费用原因

  // Overdue Booked ETD Log
  Overdue_Booked_ETD_Log: "overdue_booked_etd_log",
  //pepco rejected reason
  PEPCO_REJECTED_REASON_CODE: "pepco_rejected_reason_code",

  //Supplier Booking  Mix DC 开关
  SHIPPING_ORDER_CONFIG: "shipping_order_config",

  CONTAINER_GATE_IN_REASON: 'container_gate_in_reason',
};

/**
 * 获取 dictType 对应的数据字典数组
 *
 * @param dictType 数据类型
 * @returns {*|Array} 数据字典数组
 */
export function getDictDatas(dictType) {
  return store.getters.dict_datas[dictType] || [];
}

/**
 * 获取 dictType 对应的数据字典数组
 *
 * @param dictType 数据类型
 * @param values 数组、单个元素
 * @returns {*|Array} 数据字典数组
 */
export function getDictDatas2(dictType, values) {
  if (values === undefined) {
    return [];
  }
  // 如果是单个元素，则转换成数组
  if (!Array.isArray(values)) {
    values = [this.value];
  }
  // 获得字典数据
  const results = [];
  for (const value of values) {
    const dict = getDictData(dictType, value);
    if (dict) {
      results.push(dict);
    }
  }
  return results;
}

export function getDictData(dictType, value) {
  // 获取 dictType 对应的数据字典数组
  const dictDatas = getDictDatas(dictType);
  if (!dictDatas || dictDatas.length === 0) {
    return "";
  }
  // 获取 value 对应的展示名
  value = value + ""; // 强制转换成字符串，因为 DictData 小类数值，是字符串
  for (const dictData of dictDatas) {
    if (dictData.value === value) {
      return dictData;
    }
  }
  return undefined;
}

export function getDictDataLabel(dictType, value) {
  const dict = getDictData(dictType, value);
  return dict ? dict.label : "";
}
