// src/hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';
import Swal from 'sweetalert2';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categoryStructure, setCategoryStructure] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm sắp xếp sản phẩm
  const sortProducts = (list) => {
    return [...list].sort((a, b) => {
      const isInactiveA = a.status === 'inactive' ? 1 : 0;
      const isInactiveB = b.status === 'inactive' ? 1 : 0;
      if (isInactiveA !== isInactiveB) return isInactiveA - isInactiveB; 
      return b.id - a.id; 
    });
  };

  // Tải dữ liệu lần đầu
  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Dùng Promise.all để lấy cả 2 dữ liệu cùng lúc cho nhanh
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(),
        productService.getCategories()
      ]);

      setProducts(sortProducts(productsData));

      // Build category structure
      const catMap = {};
      categoriesData.forEach(cat => {
        catMap[cat.name] = cat.subCategories;
      });
      setCategoryStructure(catMap);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      Swal.fire('Lỗi', 'Không thể tải dữ liệu từ máy chủ', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Logic Thêm
  const addProduct = async (newProduct) => {
    try {
      const addedProduct = await productService.createProduct(newProduct);
      setProducts(prev => sortProducts([addedProduct, ...prev]));
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã thêm sản phẩm!', showConfirmButton: false, timer: 2000 });
      return true; // Báo thành công cho form đóng lại
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // Logic Cập nhật (Sửa, Ngừng bán, Khôi phục)
  const updateProduct = async (id, updatedData, successMessage = 'Cập nhật thành công!') => {
    try {
      const resData = await productService.updateProduct(id, updatedData);
      setProducts(prev => {
        const updatedList = prev.map(p => p.id === id ? resData : p);
        return sortProducts(updatedList);
      });
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: successMessage, showConfirmButton: false, timer: 2000 });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // Trả về những gì UI cần
  return {
    products,
    categoryStructure,
    isLoading,
    addProduct,
    updateProduct
  };
};