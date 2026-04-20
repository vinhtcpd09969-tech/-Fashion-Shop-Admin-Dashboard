// src/pages/Orders.jsx
import { useState } from "react";
import { FiEye, FiDollarSign, FiCreditCard, FiSearch } from "react-icons/fi";
import { useOrders } from "../hooks/useOrders";
import { formatDate, getSelectStatusClass, getSelectPaymentClass } from "../utils/helpers";
import { ORDER_STATUS_FLOW, ALL_ORDER_STATUSES } from "../utils/constants";

// 🚀 1. Import Component Modal vừa tạo
import OrderDetailModal from "../components/OrderDetailModal";

const Orders = () => {
  const { orders, isLoading, handleUpdateLogic } = useOrders();
  const [viewingOrder, setViewingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    return order.customerName.toLowerCase().includes(searchLower) || order.id.toString().includes(searchLower);
  });

  if (isLoading) return <div className="p-5 text-center text-muted fw-bold">Đang tải danh sách đơn hàng...</div>;

  return (
    <div className="container-fluid p-0 animate-fade-up">
      {/* HEADER TÌM KIẾM */}
      <div className="d-flex justify-content-between align-items-center mb-4 px-3">
        <h3 className="fw-bolder text-dark m-0">Quản lý Đơn hàng</h3>
        <div className="input-group shadow-sm" style={{ width: '300px', borderRadius: '12px', overflow: 'hidden' }}>
          <span className="input-group-text bg-white border-0 text-muted"><FiSearch /></span>
          <input type="text" className="form-control border-0 bg-white shadow-none" placeholder="Tìm đơn hàng..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* BẢNG ĐƠN HÀNG */}
      <div className="card-modern overflow-hidden bg-white mx-3 mb-4 shadow-sm border-0" style={{ borderRadius: '20px' }}>
        <div className="card-body p-0">
          <div className="table-responsive px-2 pb-2">
            <table className="table table-custom table-hover table-borderless align-middle mb-0 mt-2">
              <thead className="table-light">
                <tr>
                  <th className="py-3 px-4">MÃ ĐƠN</th>
                  <th>KHÁCH HÀNG</th>
                  <th>TỔNG TIỀN</th>
                  <th>PHƯƠNG THỨC</th>
                  <th>THANH TOÁN</th>
                  <th>TRẠNG THÁI</th>
                  <th className="text-center">CHI TIẾT</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const isPaymentRestricted = ['Đang xử lý', 'Đã xử lý', 'Đang vận chuyển', 'Đã giao'].includes(order.status);
                  const isOnline = order.paymentMethod === 'Thanh toán online';

                  return (
                    <tr key={order.id}>
                      <td className="px-4 py-3">
                        <div className="fw-bold text-dark">#ORD-{order.id}</div>
                        <div className="text-muted small">{formatDate(order.createdDate)}</div>
                      </td>
                      <td className="fw-bold text-primary">{order.customerName}</td>
                      <td className="fw-bolder text-success">${Number(order.total || 0).toLocaleString()}</td>
                      <td>
                        <span className={`badge ${isOnline ? 'bg-primary' : 'bg-secondary'} bg-opacity-10 ${isOnline ? 'text-primary' : 'text-secondary'} px-3 py-2 rounded-pill fw-medium`}>
                          {isOnline ? <FiCreditCard className="me-2"/> : <FiDollarSign className="me-2"/>} {isOnline ? 'Online' : 'COD'}
                        </span>
                      </td>
                      <td>
<select 
    className={`form-select form-select-sm fw-bold border-0 shadow-none px-3 rounded-pill cursor-pointer ${getSelectPaymentClass(order.paymentStatus)}`}
    value={order.paymentStatus || 'Chưa thanh toán'}
    onChange={(e) => handleUpdateLogic(order, 'paymentStatus', e.target.value)}
    
    // 🚀 ĐÃ SỬA: Gỡ bỏ việc disable khi Trả hàng/Hủy đơn để người dùng có thể sửa thủ công sau đó
    // disabled={order.status === 'Hủy đơn' || order.status === 'Trả hàng'} <- XÓA DÒNG NÀY
  >
    <option value="Chưa thanh toán" disabled={isOnline && order.paymentStatus !== 'Chưa thanh toán'}>Chưa thanh toán</option>
    <option value="Đã thanh toán">Đã thanh toán</option>
    
    {/* Chỉ hiện "Đã hoàn tiền" cho các đơn hàng cần hoàn tiền */}
    {(order.status === 'Hoàn thành' || order.status === 'Trả hàng' || order.status === 'Hủy đơn') && (
      <option value="Đã hoàn tiền">Đã hoàn tiền</option>
    )}
  </select>
                      </td>
                      <td>
                        <select 
                          className={`form-select form-select-sm fw-bold border-0 shadow-none px-3 rounded-pill cursor-pointer ${getSelectStatusClass(order.status)}`}
                          value={order.status || 'Đang xử lý'}
                          onChange={(e) => handleUpdateLogic(order, 'status', e.target.value)}
                        >
                          {order.status === 'Hủy đơn' ? <option value="Hủy đơn">Hủy đơn</option> : (
                            (order.status === 'Hoàn thành' || order.status === 'Trả hàng') ? (
                              <>
                                <option value="Hoàn thành">Hoàn thành</option>
                                <option value="Trả hàng">Trả hàng</option>
                              </>
                            ) : (
                              ALL_ORDER_STATUSES.map(st => {
                                const currIdx = ORDER_STATUS_FLOW.indexOf(order.status);
                                const optIdx = ORDER_STATUS_FLOW.indexOf(st);
                                if (st === 'Trả hàng' || (st === 'Hủy đơn' && order.status !== 'Đang xử lý')) return null;
                                return <option key={st} value={st} disabled={currIdx !== -1 && optIdx !== -1 && optIdx < currIdx}>{st}</option>;
                              })
                            )
                          )}
                        </select>
                      </td>
                      <td className="text-center">
                        <button onClick={() => setViewingOrder(order)} className="btn btn-sm btn-light text-primary rounded-circle p-2 border-0"><FiEye size={18} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 🚀 2. Tái sử dụng Component vừa tách. Code siêu sạch! */}
      <OrderDetailModal 
        order={viewingOrder} 
        onClose={() => setViewingOrder(null)} 
      />

    </div>
  );
};

export default Orders;