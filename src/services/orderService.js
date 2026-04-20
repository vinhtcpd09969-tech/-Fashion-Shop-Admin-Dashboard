// src/services/orderService.js
import axiosClient from '../api/axiosClient';

export const orderService = {
  // Lấy toàn bộ đơn hàng
  getAllOrders: () => {
    return axiosClient.get('/orders').then(res => res.data);
  },

  // Cập nhật trạng thái đơn hàng và thanh toán
  updateStatus: (id, data) => {
    return axiosClient.put(`/orders/${id}/status`, data).then(res => res.data);
  }
};