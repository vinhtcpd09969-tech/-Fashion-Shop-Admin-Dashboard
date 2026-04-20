// src/utils/helpers.js

// 1. Hàm format ngày tháng (Đang dùng ở Orders và Dashboard)
export const formatDate = (dateString) => {
  if (!dateString) return "Chưa cập nhật";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN") + " - " + date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
};

// Hàm lấy ngày chuẩn YYYY-MM-DD (Đang xài trong Custom Hook useDashboard)
export const getLocalDateString = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 2. Các hàm lấy màu sắc Badge trạng thái (Đang dùng ở Orders)
export const getSelectStatusClass = (status) => {
  switch (status) {
    case "Đang xử lý": return "bg-warning bg-opacity-10 text-warning";
    case "Đã xử lý": return "bg-info bg-opacity-10 text-info";
    case "Đang vận chuyển": return "bg-primary bg-opacity-10 text-primary";
    case "Đã giao": return "bg-success bg-opacity-25 text-success";
    case "Hoàn thành": return "bg-success bg-opacity-10 text-success";
    case "Hủy đơn": return "bg-danger bg-opacity-10 text-danger";
    case "Trả hàng": return "bg-secondary bg-opacity-25 text-secondary";
    default: return "bg-secondary bg-opacity-10 text-secondary";
  }
};

export const getSelectPaymentClass = (payment) => {
  if (payment === "Đã thanh toán") return "bg-success bg-opacity-10 text-success";
  if (payment === "Đã hoàn tiền") return "bg-secondary bg-opacity-10 text-secondary";
  return "bg-danger bg-opacity-10 text-danger";
};

// 3. Hàm phân tích chuỗi sản phẩm trong đơn hàng (Đang dùng ở Orders)
export const parseProducts = (productString) => {
  if (!productString) return [];
  return productString.split(',').map((item, index) => {
    const match = item.trim().match(/^(\d+)\s+(.+)$/);
    if (match) return { id: index, qty: parseInt(match[1]), name: match[2].trim() };
    return { id: index, qty: 1, name: item.trim() }; 
  });
};

// 4. Các hàm lấy màu sắc Badge Khách hàng (Đang dùng ở Customers)
export const getCustomerStatusBadge = (status) => {
    return status === "Hoạt động" ? "bg-success bg-opacity-10 text-success" : "bg-danger bg-opacity-10 text-danger";
};

export const getCustomerTierBadge = (tier) => {
    if(tier === "Kim Cương") return "bg-info bg-opacity-10 text-info";
    if(tier === "Vàng") return "bg-warning bg-opacity-10 text-warning";
    return "bg-secondary bg-opacity-10 text-secondary";
};