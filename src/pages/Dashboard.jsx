// src/pages/Dashboard.jsx
import { useState } from "react";
import { FiShoppingCart, FiDollarSign, FiUsers, FiBox, FiInfo } from "react-icons/fi";
import Card from "../components/Card";
import { useDashboard } from "../hooks/useDashboard";

// 🚀 1. Import các UI Components đã được bóc tách
import { NewestProducts } from "../components/dashboard/NewestProducts";
import { RevenueChart, TopProductsChart, TopCustomersChart } from "../components/dashboard/DashboardCharts";

const Dashboard = () => {
  const [showTips, setShowTips] = useState(true);
  
  // Lấy dữ liệu và hàm xử lý từ Custom Hook
  const {
    startDate, setStartDate, endDate, setEndDate, filterMode, setFilterMode,
    stats, revenueData, realTopRanking, top10Customers, newestProducts,
    allCustomers, isLoading
  } = useDashboard();

  if (isLoading) return <div className="d-flex justify-content-center align-items-center vh-100"><h4 className="text-primary">Đang tải dữ liệu tổng quan...</h4></div>;

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fc', minHeight: '100vh' }}>
      <div className="dashboard-container">
        
        {/* Tiêu đề & Thông báo */}
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div><h3 className="fw-bolder text-dark m-0" style={{ letterSpacing: '-0.5px' }}>Dashboard Tổng Quan</h3><p className="text-muted m-0 mt-1">Dữ liệu thời gian thực từ MySQL Laragon.</p></div>
          <button className="btn btn-outline-primary shadow-sm fw-medium rounded-pill px-4" onClick={() => setShowTips(!showTips)}>{showTips ? "Ẩn mẹo" : "Hiện mẹo"}</button>
        </div>
        {showTips && (
          <div className="alert border-0 shadow-sm rounded-4 mb-4 d-flex align-items-center" style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}>
            <FiInfo className="fs-4 me-3" /><div><strong>Kết nối thành công!</strong> Các số liệu dưới đây được tổng hợp tự động từ API thực tế.</div>
          </div>
        )}

        {/* Hàng 1: 4 Thẻ thống kê + Biểu đồ Doanh Thu */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-xl-7">
            <div className="row g-4 h-100">
              {[ { title: "Đơn (Trong kỳ)", content: stats.totalOrders, color: "#6366f1", icon: <FiShoppingCart /> },
                 { title: "Doanh Thu (Trong kỳ)", content: `$${stats.totalRevenue.toLocaleString()}`, color: "#10b981", icon: <FiDollarSign /> },
                 { title: "Tổng Khách Hàng", content: stats.totalCustomers, color: "#f59e0b", icon: <FiUsers /> },
                 { title: "Mẫu Đang Bán", content: stats.activeProducts, color: "#ec4899", icon: <FiBox /> }
              ].map((item, index) => (
                <div className="col-12 col-sm-6" key={index}>
                  <Card title={item.title} content={item.content} gradient={`linear-gradient(135deg, ${item.color} 0%, ${item.color}cc 100%)`} shadowColor={`${item.color}40`}>
                    <div className="d-flex align-items-center justify-content-center text-white" style={{ width: '56px', height: '56px', borderRadius: '16px', background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}cc 100%)`, boxShadow: `0 8px 20px ${item.color}40` }}>{item.icon}</div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <div className="col-12 col-xl-5">
            <RevenueChart revenueData={revenueData} filterMode={filterMode} setFilterMode={setFilterMode} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
          </div>
        </div>

        {/* Hàng 2: Bảng Sản phẩm mới + Biểu đồ Top Sản phẩm */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-xl-7">
            <NewestProducts newestProducts={newestProducts} />
          </div>
          <div className="col-12 col-xl-5">
            <TopProductsChart realTopRanking={realTopRanking} />
          </div>
        </div>

        {/* Hàng 3: Biểu đồ Top 10 Khách hàng */}
        <div className="row">
          <div className="col-12">
            <TopCustomersChart top10Customers={top10Customers} allCustomers={allCustomers} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;