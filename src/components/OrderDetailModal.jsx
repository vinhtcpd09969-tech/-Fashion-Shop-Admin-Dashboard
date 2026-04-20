// src/components/OrderDetailModal.jsx
import React from 'react';
import { FiShoppingBag, FiUser, FiCalendar, FiTruck, FiDollarSign, FiCreditCard } from "react-icons/fi";
import { formatDate, getSelectStatusClass, getSelectPaymentClass, parseProducts } from "../utils/helpers";

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
      <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg rounded-4">
            
            <div className="modal-header bg-light border-bottom-0 rounded-top-4 pb-3">
              <h5 className="modal-title fw-bolder text-dark d-flex align-items-center">
                <FiShoppingBag className="me-2 text-primary" /> Chi Tiết Đơn Hàng #ORD-{order.id}
              </h5>
              <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
            </div>

            <div className="modal-body p-4 pt-2">
              <div className="row g-3 mb-4">
                <div className="col-6 col-md-4">
                  <div className="p-3 bg-light rounded-3 border border-white shadow-sm h-100">
                    <div className="small text-muted fw-bold mb-1"><FiUser className="me-1"/> KHÁCH HÀNG</div>
                    <div className="fw-bolder fs-6 text-dark">{order.customerName}</div>
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <div className="p-3 bg-light rounded-3 border border-white shadow-sm h-100">
                    <div className="small text-muted fw-bold mb-1"><FiCalendar className="me-1"/> NGÀY ĐẶT</div>
                    <div className="fw-bolder fs-6 text-dark">{formatDate(order.createdDate)}</div>
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <div className="p-3 bg-light rounded-3 border border-white shadow-sm h-100">
                    <div className="small text-muted fw-bold mb-1"><FiCreditCard className="me-1"/> PHƯƠNG THỨC</div>
                    <div className="fw-bolder fs-6 text-primary">
                      {order.paymentMethod === 'Thanh toán online' ? 'Online' : 'Tiền mặt (COD)'}
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-6">
                  <div className="p-3 bg-light rounded-3 border border-white shadow-sm h-100">
                    <div className="small text-muted fw-bold mb-1"><FiTruck className="me-1"/> TRẠNG THÁI</div>
                    <div className={`fw-bolder fs-6 ${getSelectStatusClass(order.status).split(' ')[2]}`}>
                      {order.status}
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="p-3 bg-light rounded-3 border border-white shadow-sm h-100">
                    <div className="small text-muted fw-bold mb-1"><FiDollarSign className="me-1"/> THANH TOÁN</div>
                    <div className={`fw-bolder fs-6 ${getSelectPaymentClass(order.paymentStatus).split(' ')[2]}`}>
                      {order.paymentStatus}
                    </div>
                  </div>
                </div>
              </div>

              <h6 className="fw-bolder text-dark mb-3">Sản Phẩm Đã Mua:</h6>
              <div className="table-responsive border rounded-3 overflow-hidden">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="py-2 px-3 text-muted small fw-bold">SẢN PHẨM</th>
                      <th className="py-2 px-3 text-muted small fw-bold text-center" style={{ width: '100px' }}>SỐ LƯỢNG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parseProducts(order.products).map((item) => (
                      <tr key={item.id}>
                        <td className="px-3 py-3 fw-bold text-dark">{item.name}</td>
                        <td className="px-3 py-3 text-center fw-bolder text-primary">x{item.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="table-light">
                    <tr>
                      <td className="px-3 py-3 text-end fw-bold text-dark">TỔNG CỘNG:</td>
                      <td className="px-3 py-3 text-center fw-bolder fs-5 text-success">${Number(order.total || 0).toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="modal-footer border-top-0 pt-0 pb-4 pe-4">
              <button type="button" className="btn btn-secondary px-4 fw-medium rounded-pill shadow-sm" onClick={onClose}>Đóng lại</button>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailModal;