// src/api/axiosClient.js
import axios from 'axios';

// 1. Khởi tạo một instance của Axios với cấu hình mặc định
const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Đặt domain gốc 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Can thiệp vào các Request gửi đi (Gắn Token tự động)
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    
    // Nếu có token thì nhét vào Header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Can thiệp vào các Response trả về (Xử lý lỗi chung - tùy chọn)
axiosClient.interceptors.response.use(
  (response) => {
    // Nếu API trả về thành công, có thể bóc tách dữ liệu luôn (VD: return response.data)
    // Nhưng để tránh sửa code cũ nhiều, ta tạm thời giữ nguyên response
    return response;
  },
  (error) => {
    // Nếu lỗi 401 (Hết hạn Token / Chưa đăng nhập) -> Có thể tự động đá về trang Login
    if (error.response && error.response.status === 401) {
      console.error("Token đã hết hạn hoặc không hợp lệ!");
      // localStorage.removeItem('token');
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default axiosClient;