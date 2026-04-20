// src/services/customerService.js
import axiosClient from '../api/axiosClient';

export const customerService = {
  // Lấy danh sách khách hàng
  getAllCustomers: () => {
    return axiosClient.get('/customers').then(res => res.data);
  },

  // Thêm mới khách hàng
  createCustomer: (data) => {
    return axiosClient.post('/customers', data).then(res => res.data);
  },

  // Cập nhật khách hàng (Sửa, Khóa, Khôi phục)
  updateCustomer: (id, data) => {
    return axiosClient.put(`/customers/${id}`, data).then(res => res.data);
  }
};