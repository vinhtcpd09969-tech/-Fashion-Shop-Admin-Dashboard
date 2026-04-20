// src/hooks/useCustomers.js
import { useState, useEffect, useCallback } from 'react';
import { customerService } from '../services/customerService';
import Swal from 'sweetalert2';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm sắp xếp
  const sortCustomers = (list) => {
    return [...list].sort((a, b) => {
      const isInactiveA = a.status === 'Tạm khóa' ? 1 : 0;
      const isInactiveB = b.status === 'Tạm khóa' ? 1 : 0;
      if (isInactiveA !== isInactiveB) return isInactiveA - isInactiveB;
      return String(b.id).localeCompare(String(a.id)); 
    });
  };

  // Fetch dữ liệu lần đầu
  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await customerService.getAllCustomers();
      setCustomers(sortCustomers(data));
    } catch (error) {
      console.error("Lỗi tải khách hàng:", error);
      Swal.fire('Lỗi', 'Không thể tải dữ liệu khách hàng', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Logic Thêm Khách Hàng
  const addCustomer = async (data) => {
    try {
      const newCus = await customerService.createCustomer(data);
      setCustomers(prev => sortCustomers([newCus, ...prev]));
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã thêm khách hàng!', showConfirmButton: false, timer: 2000 });
      return true;
    } catch (error) {
      console.error(error);
      Swal.fire('Lỗi Server', 'Thêm thất bại. Vui lòng kiểm tra lại.', 'error');
      return false;
    }
  };

  // Logic Cập Nhật Khách Hàng
  const updateCustomer = async (id, data, successMsg = 'Cập nhật thành công!') => {
    try {
      const updatedCus = await customerService.updateCustomer(id, data);
      setCustomers(prev => sortCustomers(prev.map(c => c.id === id ? updatedCus : c)));
      if (successMsg) {
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: successMsg, showConfirmButton: false, timer: 2000 });
      }
      return true;
    } catch (error) {
      console.error(error);
      Swal.fire('Lỗi Server', 'Không thể cập nhật. Vui lòng thử lại.', 'error');
      return false;
    }
  };

  return {
    customers,
    isLoading,
    addCustomer,
    updateCustomer
  };
};