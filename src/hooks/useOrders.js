// src/hooks/useOrders.js
import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/orderService';
import Swal from 'sweetalert2'; 

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const executeApiUpdate = async (order, finalStatus, finalPayment) => {
    try {
      const updatedData = { 
        status: finalStatus, 
        paymentStatus: finalPayment, 
        paymentMethod: order.paymentMethod 
      };
      await orderService.updateStatus(order.id, updatedData);
      
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, ...updatedData } : o));
      
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Cập nhật thành công!', showConfirmButton: false, timer: 1500 });
      return true;
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể cập nhật máy chủ.' });
      return false;
    }
  };

  const handleUpdateLogic = async (order, fieldToUpdate, newValue) => {
    let newStatus = fieldToUpdate === 'status' ? newValue : order.status;
    let newPayment = fieldToUpdate === 'paymentStatus' ? newValue : order.paymentStatus;
    const isCOD = order.paymentMethod === 'Thanh toán trực tiếp khi nhận hàng';

    // 🚀 LOGIC TỰ ĐỘNG
    if (isCOD && fieldToUpdate === 'status' && newValue === 'Hoàn thành') {
      newPayment = 'Đã thanh toán';
    }
    if (!isCOD && fieldToUpdate === 'status' && newValue === 'Hoàn thành' && order.status === 'Trả hàng') {
      newPayment = 'Đã thanh toán';
    }

    // 🛑 VALIDATION
    if (!isCOD && fieldToUpdate === 'paymentStatus' && newValue === 'Chưa thanh toán') {
      Swal.fire({ icon: 'error', title: 'Lỗi Logic!', text: 'Đơn hàng Online không thể chuyển về Chưa thanh toán.' });
      return;
    }
    if (newPayment === 'Chưa thanh toán' && newStatus === 'Hoàn thành') {
      Swal.fire({ icon: 'error', title: 'Lỗi Logic!', text: 'Không thể Hoàn thành khi chưa thu tiền.' });
      return;
    }
    if (fieldToUpdate === 'status' && newValue === 'Hủy đơn' && order.status !== 'Đang xử lý') {
      Swal.fire({ icon: 'error', title: 'Không thể hủy!', text: `Đơn hàng đã ở trạng thái: ${order.status}` });
      return;
    }

    // 🚀 ĐÃ XÓA: Đoạn code chặn thay đổi paymentStatus khi status là Hủy đơn / Trả hàng

    // ⚡ XÁC NHẬN HOÀN TIỀN
    if (fieldToUpdate === 'status' && (newValue === 'Trả hàng' || newValue === 'Hủy đơn') && order.paymentStatus !== 'Đã hoàn tiền') {
      const result = await Swal.fire({
        title: 'Xác nhận xử lý tiền',
        text: `Bạn đang đổi trạng thái sang "${newValue}". Bạn có muốn cập nhật thanh toán thành "Đã hoàn tiền" luôn không?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Có, Hoàn tiền!',
        cancelButtonText: 'Không, để tôi sửa sau'
      });

      if (result.isConfirmed) {
        return executeApiUpdate(order, newStatus, 'Đã hoàn tiền');
      }
    }

    return executeApiUpdate(order, newStatus, newPayment);
  };

  return { orders, isLoading, handleUpdateLogic };
};