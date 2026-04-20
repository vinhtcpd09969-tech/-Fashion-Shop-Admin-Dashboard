// src/services/productService.js
import axiosClient from '../api/axiosClient';

export const productService = {
  // Lấy danh sách sản phẩm
  getAllProducts: () => {
    return axiosClient.get('/products').then(res => res.data);
  },

  // Lấy cấu trúc danh mục
  getCategories: () => {
    return axiosClient.get('/categories').then(res => res.data);
  },

  // Thêm mới sản phẩm
  createProduct: (data) => {
    return axiosClient.post('/products', data).then(res => res.data);
  },

  // Cập nhật sản phẩm
  updateProduct: (id, data) => {
    return axiosClient.put(`/products/${id}`, data).then(res => res.data);
  }
};