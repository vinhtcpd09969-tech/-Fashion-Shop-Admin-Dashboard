// src/utils/constants.js

export const ORDER_STATUS_FLOW = [
  'Đang xử lý', 
  'Đã xử lý', 
  'Đang vận chuyển', 
  'Đã giao', 
  'Hoàn thành'
];

export const ALL_ORDER_STATUSES = [
  ...ORDER_STATUS_FLOW, 
  'Trả hàng', 
  'Hủy đơn'
];