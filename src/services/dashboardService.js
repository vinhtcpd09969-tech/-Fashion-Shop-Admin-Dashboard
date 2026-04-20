// src/services/dashboardService.js
import axiosClient from '../api/axiosClient';

export const dashboardService = {
  getDashboardSummary: async () => {
    // Gọi song song 3 API để tăng tốc độ tải trang
    const [resProducts, resOrders, resCustomers] = await Promise.all([
      axiosClient.get("/products"),
      axiosClient.get("/orders"),
      axiosClient.get("/customers")
    ]);
    
    return {
      products: resProducts.data,
      orders: resOrders.data,
      customers: resCustomers.data
    };
  }
};