// src/hooks/useDashboard.js
import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import Swal from 'sweetalert2';
import { getLocalDateString } from '../utils/helpers';




export const useDashboard = () => {
  // 1. STATE BỘ LỌC
  const todayObj = new Date();
  const sevenDaysAgoObj = new Date();
  sevenDaysAgoObj.setDate(todayObj.getDate() - 6);

  const [startDate, setStartDate] = useState(getLocalDateString(sevenDaysAgoObj));
  const [endDate, setEndDate] = useState(getLocalDateString(todayObj));
  const [filterMode, setFilterMode] = useState("day");

  // 2. STATE DỮ LIỆU
  const [allData, setAllData] = useState({ products: [], orders: [], customers: [] });
  const [isLoading, setIsLoading] = useState(true);

  // 3. STATE KẾT QUẢ ĐẦU RA (Cho UI hiển thị)
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalCustomers: 0, activeProducts: 0 });
  const [revenueData, setRevenueData] = useState([]);
  const [realTopRanking, setRealTopRanking] = useState([]);
  const [top10Customers, setTop10Customers] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);

  // Fetch Dữ liệu gốc
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await dashboardService.getDashboardSummary();
      setAllData(data);

      // Cập nhật các chỉ số không bị ảnh hưởng bởi bộ lọc ngày
      const activeCount = data.products.filter(p => p.status === 'active' || p.status === 'Còn hàng').length;
      setStats(prev => ({
        ...prev,
        totalCustomers: data.customers.length, 
        activeProducts: activeCount || data.products.length 
      }));
      setNewestProducts(data.products.slice(0, 4));

    } catch (error) {
      console.error("Lỗi tải dữ liệu Dashboard:", error);
      Swal.fire('Lỗi', 'Không thể tải dữ liệu hệ thống.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // LOGIC XỬ LÝ (Tự động chạy lại khi thay đổi ngày hoặc dữ liệu gốc)
  useEffect(() => {
    const { orders: allOrders, products: allProducts, customers: allCustomers } = allData;
    if (allOrders.length === 0 && allProducts.length === 0) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      Swal.fire({ icon: 'error', title: 'Lỗi chọn ngày', text: 'Ngày bắt đầu không được lớn hơn ngày kết thúc!' });
      setStartDate(endDate); 
      return;
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const chartDataMap = {};
    
    if (filterMode === 'day') {
      let curr = new Date(start);
      while(curr <= end) {
        const key = getLocalDateString(curr);
        chartDataMap[key] = { fullDate: key, name: `${curr.getDate()}/${curr.getMonth() + 1}`, value: 0 };
        curr.setDate(curr.getDate() + 1);
      }
    } else if (filterMode === 'month') {
      let curr = new Date(start.getFullYear(), start.getMonth(), 1);
      const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
      while(curr <= endMonth) {
        const key = `${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2, '0')}`;
        chartDataMap[key] = { fullDate: key, name: `T${curr.getMonth() + 1}/${curr.getFullYear()}`, value: 0 };
        curr.setMonth(curr.getMonth() + 1);
      }
    } else if (filterMode === 'year') {
      let currYear = start.getFullYear();
      while(currYear <= end.getFullYear()) {
        const key = `${currYear}`;
        chartDataMap[key] = { fullDate: key, name: `Năm ${currYear}`, value: 0 };
        currYear++;
      }
    }

    let filteredRevenue = 0;
    let filteredOrderCount = 0;
    const productStatsMap = {}; 
    const customerStatsMap = {}; 

    allOrders.forEach(order => {
      if (!order.createdDate) return;
      const orderDate = new Date(order.createdDate);
      
      if (orderDate >= start && orderDate <= end) {
        filteredOrderCount++;
        if (order.paymentStatus === 'Đã thanh toán') {
          const money = Math.max(0, Number(order.total || 0)); 
          filteredRevenue += money;

          let key;
          if (filterMode === 'day') key = getLocalDateString(orderDate);
          else if (filterMode === 'month') key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
          else if (filterMode === 'year') key = `${orderDate.getFullYear()}`;

          if (chartDataMap[key]) chartDataMap[key].value += money;

          if (order.products) {
            const items = order.products.split(',');
            items.forEach(itemStr => {
              const match = itemStr.trim().match(/^(\d+)\s+(.+)$/);
              if (match) {
                const qty = parseInt(match[1]);
                const name = match[2].trim().toLowerCase();
                if (!productStatsMap[name]) productStatsMap[name] = 0;
                productStatsMap[name] += qty;
              }
            });
          }

          const cusName = order.customerName;
          if (!customerStatsMap[cusName]) customerStatsMap[cusName] = 0;
          customerStatsMap[cusName] += money;
        }
      }
    });

    const rankingArray = [];
    Object.keys(productStatsMap).forEach(orderProductName => {
      const qtySold = productStatsMap[orderProductName];
      const matchedProduct = allProducts.find(p => p.name.toLowerCase().includes(orderProductName) || orderProductName.includes(p.name.toLowerCase()));

      if (matchedProduct) {
        const existingIndex = rankingArray.findIndex(r => r.id === matchedProduct.id);
        if (existingIndex !== -1) {
          rankingArray[existingIndex].sold += qtySold;
          rankingArray[existingIndex].revenue += (qtySold * matchedProduct.price);
        } else {
          rankingArray.push({
            id: matchedProduct.id, name: matchedProduct.name, img: matchedProduct.img, price: matchedProduct.price, sold: qtySold, revenue: qtySold * matchedProduct.price
          });
        }
      } else {
        rankingArray.push({
          id: orderProductName, name: orderProductName.charAt(0).toUpperCase() + orderProductName.slice(1), img: "https://placehold.co/100?text=SP", price: 0, sold: qtySold, revenue: 0 
        });
      }
    });

    setRealTopRanking(rankingArray.sort((a, b) => b.sold - a.sold).slice(0, 5));
    setTop10Customers(Object.keys(customerStatsMap).map(name => ({ name, spent: customerStatsMap[name] })).sort((a, b) => b.spent - a.spent).slice(0, 10));
    setRevenueData(Object.values(chartDataMap));
    setStats(prev => ({ ...prev, totalOrders: filteredOrderCount, totalRevenue: filteredRevenue }));

  }, [startDate, endDate, filterMode, allData]);

  return {
    startDate, setStartDate, endDate, setEndDate, filterMode, setFilterMode,
    stats, revenueData, realTopRanking, top10Customers, newestProducts,
    allCustomers: allData.customers, isLoading
  };
};